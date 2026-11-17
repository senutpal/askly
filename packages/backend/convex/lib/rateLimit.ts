import { ConvexError } from "convex/values";
import type { MutationCtx } from "../_generated/server";

export type RateLimitRule = {
	/** Maximum number of calls allowed inside one window. */
	limit: number;
	/** Window length in milliseconds. */
	windowMs: number;
};

/**
 * Budgets for the public (unauthenticated widget) surface and for the
 * expensive crawler actions. Limits are deliberately generous for a single
 * human conversation and tight enough that a script cannot run up Gemini or
 * embedding spend unnoticed.
 */
export const RATE_LIMITS = {
	/** One visitor can send 20 messages per minute. */
	messagePerSession: { limit: 20, windowMs: 60_000 },
	/**
	 * Safety net per tenant when many visitors talk at once. Deliberately
	 * generous: the per-session budget is what stops a single abuser.
	 */
	messagePerOrganization: { limit: 600, windowMs: 60_000 },
	/** New anonymous sessions per tenant. A busy widget can be chatty. */
	contactSessionPerOrganization: { limit: 300, windowMs: 60_000 },
	/** Conversation creation from one session. */
	conversationPerSession: { limit: 10, windowMs: 60_000 },
	/** Crawls are cheap to start and expensive to run. */
	crawlStartPerOrganization: { limit: 10, windowMs: 3_600_000 },
	/** Importing crawl results triggers embeddings. */
	crawlImportPerOrganization: { limit: 20, windowMs: 3_600_000 },
} as const satisfies Record<string, RateLimitRule>;

/**
 * Fixed-window counter. Convex mutations are serializable, so a read followed
 * by a patch cannot race with another mutation on the same key.
 *
 * Throws a structured `RATE_LIMITED` ConvexError that clients can surface
 * directly, including how long the caller should wait.
 */
export async function consumeRateLimit(
	ctx: MutationCtx,
	key: string,
	rule: RateLimitRule,
): Promise<void> {
	const now = Date.now();
	const existing = await ctx.db
		.query("rateLimits")
		.withIndex("by_key", (q) => q.eq("key", key))
		.unique();

	if (!existing || now - existing.windowStart >= rule.windowMs) {
		if (existing) {
			await ctx.db.patch(existing._id, { windowStart: now, count: 1 });
		} else {
			await ctx.db.insert("rateLimits", {
				key,
				windowStart: now,
				count: 1,
			});
		}
		return;
	}

	if (existing.count >= rule.limit) {
		throw new ConvexError({
			code: "RATE_LIMITED",
			message: "Too many requests. Please wait a moment and try again.",
			retryAfterMs: existing.windowStart + rule.windowMs - now,
		});
	}

	await ctx.db.patch(existing._id, { count: existing.count + 1 });
}

/**
 * Charge several buckets in one transaction. Actions should prefer this over
 * calling an internal mutation once per bucket.
 */
export async function consumeRateLimits(
	ctx: MutationCtx,
	buckets: Array<{ key: string; rule: RateLimitRule }>,
): Promise<void> {
	for (const bucket of buckets) {
		await consumeRateLimit(ctx, bucket.key, bucket.rule);
	}
}
