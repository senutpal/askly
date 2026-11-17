import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalMutation } from "../_generated/server";
import { countConversations } from "../lib/conversationStats";

/**
 * Housekeeping run by convex/crons.ts.
 *
 * Deletion is intentionally conservative:
 * - a contact session that produced a conversation is never deleted, because
 *   the dashboard joins conversations to their session for contact details;
 * - only abandoned sessions (created, never used) are removed;
 * - crawl jobs are removed after the retention window in small scheduled
 *   batches, so a job with large extracted-text rows never exceeds the
 *   per-transaction size limits.
 */

const SESSION_SCAN_LIMIT = 200;
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const STOPPED_JOB_SCAN_LIMIT = 50;
const TERMINAL_JOB_BATCH = 20;
const CRAWL_RETENTION_MS = 14 * 24 * 60 * 60 * 1000;
const CRAWL_STALE_MS = 20 * 60 * 1000;
const RATE_LIMIT_RETENTION_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT_BATCH = 500;
const STATS_ORG_BATCH = 50;
/**
 * Rows can carry up to MAX_STORED_TEXT_CHARS of extracted text, so delete
 * them a few at a time instead of reading a whole job into one transaction.
 */
const RESULT_DELETE_BATCH = 10;

export const cleanupExpiredContactSessions = internalMutation({
	args: {},
	returns: v.object({ scanned: v.number(), deleted: v.number() }),
	handler: async (ctx) => {
		const cutoff = Date.now() - SESSION_MAX_AGE_MS;
		const expired = await ctx.db
			.query("contactSessions")
			.withIndex("by_expires_at", (q) => q.lt("expiresAt", cutoff))
			.take(SESSION_SCAN_LIMIT);

		let deleted = 0;
		for (const session of expired) {
			const conversation = await ctx.db
				.query("conversations")
				.withIndex("by_contact_session_id", (q) =>
					q.eq("contactSessionId", session._id),
				)
				.first();

			if (conversation) continue;

			await ctx.db.delete(session._id);
			deleted += 1;
		}

		return { scanned: expired.length, deleted };
	},
});

export const failStaleCrawlJobs = internalMutation({
	args: {},
	returns: v.object({ failed: v.number() }),
	handler: async (ctx) => {
		const cutoff = Date.now() - CRAWL_STALE_MS;
		const crawling = await ctx.db
			.query("crawlJobs")
			.withIndex("by_status", (q) => q.eq("status", "crawling"))
			.take(STOPPED_JOB_SCAN_LIMIT);

		let failed = 0;
		for (const job of crawling) {
			if (job.startedAt > cutoff) continue;

			await ctx.db.patch(job._id, {
				status: "failed",
				error: "Crawl timed out",
				completedAt: Date.now(),
			});
			failed += 1;
		}

		return { failed };
	},
});

/**
 * Find old terminal jobs and hand each one to `deleteCrawlJobBatch`, which
 * removes the results in small chunks. The index scan is oldest-first, so a
 * backlog is always drained from the front.
 */
export const cleanupOldCrawlData = internalMutation({
	args: {},
	returns: v.object({ queued: v.number() }),
	handler: async (ctx) => {
		const cutoff = Date.now() - CRAWL_RETENTION_MS;
		let queued = 0;

		for (const status of ["completed", "failed", "cancelled"] as const) {
			const jobs = await ctx.db
				.query("crawlJobs")
				.withIndex("by_status", (q) => q.eq("status", status))
				.take(STOPPED_JOB_SCAN_LIMIT);

			for (const job of jobs) {
				if (queued >= TERMINAL_JOB_BATCH) return { queued };
				if (job.startedAt > cutoff) continue;

				await ctx.scheduler.runAfter(
					0,
					internal.system.maintenance.deleteCrawlJobBatch,
					{ jobId: job._id },
				);
				queued += 1;
			}
		}

		return { queued };
	},
});

export const deleteCrawlJobBatch = internalMutation({
	args: { jobId: v.id("crawlJobs") },
	returns: v.null(),
	handler: async (ctx, args) => {
		const job = await ctx.db.get(args.jobId);
		if (!job) return null;

		// Never remove a job that started running again.
		if (job.status === "pending" || job.status === "crawling") return null;

		const results = await ctx.db
			.query("crawlResults")
			.withIndex("by_job_id", (q) => q.eq("jobId", args.jobId))
			.take(RESULT_DELETE_BATCH);

		if (results.length > 0) {
			for (const result of results) {
				await ctx.db.delete(result._id);
			}
			await ctx.scheduler.runAfter(
				0,
				internal.system.maintenance.deleteCrawlJobBatch,
				{ jobId: args.jobId },
			);
			return null;
		}

		await ctx.db.delete(args.jobId);
		return null;
	},
});

export const cleanupRateLimits = internalMutation({
	args: {},
	returns: v.object({ deleted: v.number() }),
	handler: async (ctx) => {
		const cutoff = Date.now() - RATE_LIMIT_RETENTION_MS;
		const stale = await ctx.db
			.query("rateLimits")
			.withIndex("by_window_start", (q) => q.lt("windowStart", cutoff))
			.take(RATE_LIMIT_BATCH);

		for (const bucket of stale) {
			await ctx.db.delete(bucket._id);
		}

		return { deleted: stale.length };
	},
});

export const reconcileConversationStats = internalMutation({
	args: { cursor: v.optional(v.union(v.string(), v.null())) },
	returns: v.object({ created: v.number() }),
	handler: async (ctx, args) => {
		const organizations = await ctx.db.query("widgetSettings").paginate({
			numItems: STATS_ORG_BATCH,
			cursor: args.cursor ?? null,
		});

		let created = 0;
		for (const settings of organizations.page) {
			const existing = await ctx.db
				.query("conversationStats")
				.withIndex("by_organization_id", (q) =>
					q.eq("organizationId", settings.organizationId),
				)
				.unique();

			if (existing) continue;

			const { counts, approximate } = await countConversations(
				ctx.db,
				settings.organizationId,
			);

			if (approximate) continue;

			await ctx.db.insert("conversationStats", {
				organizationId: settings.organizationId,
				unresolved: counts.unresolved,
				escalated: counts.escalated,
				resolved: counts.resolved,
				updatedAt: Date.now(),
			});
			created += 1;
		}

		if (!organizations.isDone) {
			await ctx.scheduler.runAfter(
				0,
				internal.system.maintenance.reconcileConversationStats,
				{ cursor: organizations.continueCursor },
			);
		}

		return { created };
	},
});
