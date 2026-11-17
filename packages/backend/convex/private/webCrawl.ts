import { contentHashFromArrayBuffer } from "@convex-dev/rag";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { parseHTML } from "linkedom";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import {
	action,
	internalAction,
	internalMutation,
	internalQuery,
	mutation,
	query,
} from "../_generated/server";
import { extractTextContent } from "../lib/extractTextContent";
import { RATE_LIMITS } from "../lib/rateLimit";
import {
	assertPublicUrl,
	CrawlCancelledError,
	type CrawlControl,
	crawlWebsite,
	fetchPublicUrl,
	MAX_CRAWL_DEPTH,
	MAX_RESOURCES_PER_JOB,
} from "../lib/webCrawler";
import { createRAG } from "../system/ai/rag";

/**
 * Persisting one crawl batch keeps each mutation comfortably below the
 * per-transaction write limits even when every page carries the maximum
 * amount of extracted text.
 */
const RESULTS_SAVE_BATCH = 10;
const MAX_URL_LENGTH = 2048;
/** Only these states mean "this job is finished and must not change". */
const TERMINAL_STATUSES = new Set(["completed", "failed", "cancelled"]);

const crawlStatusValidator = v.union(
	v.literal("pending"),
	v.literal("crawling"),
	v.literal("completed"),
	v.literal("failed"),
	v.literal("cancelled"),
);

const crawlResourceTypeValidator = v.union(
	v.literal("text"),
	v.literal("image"),
	v.literal("pdf"),
);

const crawlOptionsValidator = v.object({
	includeImages: v.boolean(),
	includePdfs: v.boolean(),
	includeText: v.boolean(),
});

const crawlJobValidator = v.object({
	_id: v.id("crawlJobs"),
	_creationTime: v.number(),
	organizationId: v.string(),
	url: v.string(),
	status: crawlStatusValidator,
	maxDepth: v.number(),
	options: crawlOptionsValidator,
	startedAt: v.number(),
	completedAt: v.optional(v.number()),
	error: v.optional(v.string()),
	pagesVisited: v.number(),
	resourcesFound: v.number(),
});

const crawlResultFields = {
	jobId: v.id("crawlJobs"),
	url: v.string(),
	type: crawlResourceTypeValidator,
	title: v.string(),
	description: v.optional(v.string()),
	size: v.optional(v.number()),
	contentHash: v.string(),
	selected: v.boolean(),
	addedToKnowledgeBase: v.boolean(),
	sourceUrl: v.string(),
	error: v.optional(v.string()),
};

/** Full document, used by internal queries only. */
const crawlResultValidator = v.object({
	_id: v.id("crawlResults"),
	_creationTime: v.number(),
	...crawlResultFields,
	text: v.optional(v.string()),
});

/**
 * Shape returned to the dashboard. The extracted page text is deliberately
 * omitted: it can be up to 200k characters per row and the UI never renders
 * it.
 */
const crawlResultPublicValidator = v.object({
	_id: v.id("crawlResults"),
	_creationTime: v.number(),
	...crawlResultFields,
});

type AuthContext = Pick<QueryCtx, "auth">;

async function requireOrgId(ctx: AuthContext): Promise<string> {
	const identity = await ctx.auth.getUserIdentity();
	if (identity === null) {
		throw new ConvexError({
			code: "UNAUTHORIZED",
			message: "Identity Not Found",
		});
	}

	const orgId = identity.orgId as string | undefined;
	if (!orgId) {
		throw new ConvexError({
			code: "UNAUTHORIZED",
			message: "Organization Not Found",
		});
	}

	return orgId;
}

/** Depth is always decided server-side; the client cannot raise it. */
function clampDepth(maxDepth: number): number {
	if (!Number.isFinite(maxDepth)) return 1;
	return Math.max(0, Math.min(MAX_CRAWL_DEPTH, Math.floor(maxDepth)));
}

export const startCrawl = action({
	args: {
		url: v.string(),
		maxDepth: v.number(),
		options: crawlOptionsValidator,
	},
	returns: v.object({ jobId: v.id("crawlJobs") }),
	handler: async (ctx, args): Promise<{ jobId: Id<"crawlJobs"> }> => {
		const orgId = await requireOrgId(ctx);

		const url = args.url.trim();
		if (!url) {
			throw new ConvexError({
				code: "BAD_REQUEST",
				message: "URL is required",
			});
		}
		if (url.length > MAX_URL_LENGTH) {
			throw new ConvexError({
				code: "BAD_REQUEST",
				message: "URL is too long",
			});
		}

		// Reject unsafe seed URLs before charging a rate limit, persisting a job
		// or scheduling work.
		assertPublicUrl(url);

		await ctx.runMutation(internal.system.rateLimit.consumeMany, {
			buckets: [
				{
					key: `crawl:start:org:${orgId}`,
					...RATE_LIMITS.crawlStartPerOrganization,
				},
			],
		});

		const maxDepth = clampDepth(args.maxDepth);

		const jobId: Id<"crawlJobs"> = await ctx.runMutation(
			internal.private.webCrawl.createJob,
			{
				organizationId: orgId,
				url,
				maxDepth,
				options: args.options,
			},
		);

		await ctx.scheduler.runAfter(0, internal.private.webCrawl.executeCrawl, {
			jobId,
			url,
			maxDepth,
			options: args.options,
		});

		return { jobId };
	},
});

/**
 * Execute the actual crawl. Cancellation is cooperative: the crawler checks
 * the job status between pages so a cancel stops network and model spend
 * almost immediately.
 */
export const executeCrawl = internalAction({
	args: {
		jobId: v.id("crawlJobs"),
		url: v.string(),
		maxDepth: v.number(),
		options: crawlOptionsValidator,
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const { jobId, url, maxDepth, options } = args;

		const control: CrawlControl = {
			isCancelled: async () => {
				const job = await ctx.runQuery(
					internal.private.webCrawl.getJobDocument,
					{ jobId },
				);
				return job?.status === "cancelled";
			},
			onProgress: async ({ pagesVisited, resourcesFound }) => {
				await ctx.runMutation(internal.private.webCrawl.updateJobProgress, {
					jobId,
					pagesVisited,
					resourcesFound,
				});
			},
		};

		try {
			await ctx.runMutation(internal.private.webCrawl.updateJobStatus, {
				jobId,
				status: "crawling",
			});

			const result = await crawlWebsite(
				{
					url,
					maxDepth,
					includeImages: options.includeImages,
					includePdfs: options.includePdfs,
					includeText: options.includeText,
				},
				control,
			);

			let inserted = 0;
			const toSave = result.resources.slice(0, MAX_RESOURCES_PER_JOB);
			for (let index = 0; index < toSave.length; index += RESULTS_SAVE_BATCH) {
				inserted += await ctx.runMutation(
					internal.private.webCrawl.saveResults,
					{
						jobId,
						resources: toSave.slice(index, index + RESULTS_SAVE_BATCH),
					},
				);
			}

			await ctx.runMutation(internal.private.webCrawl.updateJobStatus, {
				jobId,
				status: "completed",
				pagesVisited: result.pagesVisited,
				resourcesFound: inserted,
			});
		} catch (error) {
			const cancelled = error instanceof CrawlCancelledError;
			await ctx.runMutation(internal.private.webCrawl.updateJobStatus, {
				jobId,
				status: cancelled ? "cancelled" : "failed",
				error: cancelled
					? undefined
					: error instanceof Error
						? error.message
						: "Unknown error",
			});
		}

		return null;
	},
});

export const getJob = query({
	args: { jobId: v.id("crawlJobs") },
	returns: crawlJobValidator,
	handler: async (ctx, args) => {
		const orgId = await requireOrgId(ctx);

		const job = await ctx.db.get(args.jobId);
		if (!job || job.organizationId !== orgId) {
			throw new ConvexError({
				code: "NOT_FOUND",
				message: "Job not found",
			});
		}

		return job;
	},
});

/**
 * Stop a running crawl. The crawler notices between pages and exits without
 * persisting further results.
 */
export const cancelCrawl = mutation({
	args: { jobId: v.id("crawlJobs") },
	returns: v.object({ cancelled: v.boolean() }),
	handler: async (ctx, args) => {
		const orgId = await requireOrgId(ctx);

		const job = await ctx.db.get(args.jobId);
		if (!job || job.organizationId !== orgId) {
			throw new ConvexError({
				code: "NOT_FOUND",
				message: "Job not found",
			});
		}

		if (job.status !== "pending" && job.status !== "crawling") {
			return { cancelled: false };
		}

		await ctx.db.patch(job._id, {
			status: "cancelled",
			completedAt: Date.now(),
		});

		return { cancelled: true };
	},
});

export const getResults = query({
	args: {
		jobId: v.id("crawlJobs"),
		typeFilter: v.optional(crawlResourceTypeValidator),
		paginationOpts: paginationOptsValidator,
	},
	returns: v.object({
		page: v.array(crawlResultPublicValidator),
		isDone: v.boolean(),
		continueCursor: v.string(),
	}),
	handler: async (ctx, args) => {
		const orgId = await requireOrgId(ctx);

		const job = await ctx.db.get(args.jobId);
		if (!job || job.organizationId !== orgId) {
			throw new ConvexError({
				code: "NOT_FOUND",
				message: "Job not found",
			});
		}

		const { typeFilter, paginationOpts } = args;
		const result = await (typeFilter
			? ctx.db
					.query("crawlResults")
					.withIndex("by_job_and_type", (q) =>
						q.eq("jobId", args.jobId).eq("type", typeFilter),
					)
					.paginate(paginationOpts)
			: ctx.db
					.query("crawlResults")
					.withIndex("by_job_id", (q) => q.eq("jobId", args.jobId))
					.paginate(paginationOpts));

		return {
			page: result.page.map((row) => ({
				_id: row._id,
				_creationTime: row._creationTime,
				jobId: row.jobId,
				url: row.url,
				type: row.type,
				title: row.title,
				description: row.description,
				size: row.size,
				contentHash: row.contentHash,
				selected: row.selected,
				addedToKnowledgeBase: row.addedToKnowledgeBase,
				sourceUrl: row.sourceUrl,
				error: row.error,
			})),
			isDone: result.isDone,
			continueCursor: result.continueCursor,
		};
	},
});

export const addSelectedResources = action({
	args: {
		jobId: v.id("crawlJobs"),
		selectedResourceIds: v.array(v.id("crawlResults")),
	},
	returns: v.object({
		results: v.array(
			v.object({
				resourceId: v.id("crawlResults"),
				success: v.boolean(),
				entryId: v.optional(v.string()),
				error: v.optional(v.string()),
			}),
		),
		successful: v.number(),
		failed: v.number(),
	}),
	handler: async (ctx, args) => {
		const orgId = await requireOrgId(ctx);

		if (args.selectedResourceIds.length === 0) {
			return { results: [], successful: 0, failed: 0 };
		}
		if (args.selectedResourceIds.length > MAX_RESOURCES_PER_JOB) {
			throw new ConvexError({
				code: "BAD_REQUEST",
				message: `Select at most ${MAX_RESOURCES_PER_JOB} resources at a time`,
			});
		}

		const job = await ctx.runQuery(internal.private.webCrawl.getJobDocument, {
			jobId: args.jobId,
		});
		if (!job || job.organizationId !== orgId) {
			throw new ConvexError({ code: "NOT_FOUND", message: "Job not found" });
		}

		// Importing triggers embeddings, so it gets its own budget.
		await ctx.runMutation(internal.system.rateLimit.consumeMany, {
			buckets: [
				{
					key: `crawl:import:org:${orgId}`,
					...RATE_LIMITS.crawlImportPerOrganization,
				},
			],
		});

		const results: Array<{
			resourceId: Id<"crawlResults">;
			success: boolean;
			entryId?: string;
			error?: string;
		}> = [];

		const orgRag = await createRAG(ctx, orgId);

		for (const resourceId of args.selectedResourceIds) {
			try {
				const resource = await ctx.runQuery(
					internal.private.webCrawl.getResource,
					{ resourceId },
				);
				if (!resource) {
					results.push({
						resourceId,
						success: false,
						error: "Resource not found",
					});
					continue;
				}
				if (resource.jobId !== args.jobId) {
					results.push({
						resourceId,
						success: false,
						error: "Resource does not belong to this job",
					});
					continue;
				}
				if (resource.addedToKnowledgeBase) {
					results.push({
						resourceId,
						success: true,
						error: "Already in knowledge base",
					});
					continue;
				}

				// Re-validate the stored URL before fetching: crawled pages are
				// untrusted and may have injected internal/off-origin URLs.
				assertPublicUrl(resource.url);

				let filename = sanitizeFilename(resource.title);
				let bytes: ArrayBuffer;
				let mimeType: string;

				if (resource.type === "text") {
					// Prefer the text captured at crawl time: no second network
					// call and the imported content matches what the user reviewed.
					const pageText = resource.text
						? `# ${resource.title}\n\n${resource.text}`
						: await fetchPageText(resource.url, resource.title);

					filename = `${filename.replace(/\.txt$/i, "")}.txt`;
					bytes = new TextEncoder().encode(pageText).buffer as ArrayBuffer;
					mimeType = "text/plain";
				} else {
					const response = await fetchPublicUrl(resource.url, {
						responseType: "arraybuffer",
						timeout: 30000,
						maxContentLength: 10 * 1024 * 1024,
					});
					bytes = response.data as ArrayBuffer;
					mimeType =
						(response.headers["content-type"] as string | undefined) ||
						guessMimeType(filename);
				}

				const blob = new Blob([bytes], { type: mimeType });
				const storageId = await ctx.storage.store(blob);
				const text = await extractTextContent(ctx, {
					storageId,
					filename,
					bytes,
					mimeType,
					organizationId: orgId,
				});
				const { entryId, created } = await orgRag.add(ctx, {
					namespace: orgId,
					text,
					key: filename,
					metadata: {
						storageId,
						uploadedBy: orgId,
						filename,
						category: "web-crawl",
						sourceUrl: resource.url,
						crawledAt: Date.now(),
					},
					contentHash: await contentHashFromArrayBuffer(bytes),
				});
				if (!created) {
					await ctx.storage.delete(storageId);
				}
				await ctx.runMutation(internal.private.webCrawl.markAsAdded, {
					resourceId,
				});
				results.push({
					resourceId,
					success: true,
					entryId,
				});
			} catch (error) {
				console.error(`Error processing resource ${resourceId}:`, error);
				results.push({
					resourceId,
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		}

		return {
			results,
			successful: results.filter((r) => r.success).length,
			failed: results.filter((r) => !r.success).length,
		};
	},
});

export const createJob = internalMutation({
	args: {
		organizationId: v.string(),
		url: v.string(),
		maxDepth: v.number(),
		options: crawlOptionsValidator,
	},
	returns: v.id("crawlJobs"),
	handler: async (ctx, args) => {
		// One active crawl per tenant: two concurrent jobs would double the
		// network and embedding spend without giving the user anything extra.
		const running = await ctx.db
			.query("crawlJobs")
			.withIndex("by_organization_and_status", (q) =>
				q.eq("organizationId", args.organizationId).eq("status", "crawling"),
			)
			.first();
		const queued = running
			? null
			: await ctx.db
					.query("crawlJobs")
					.withIndex("by_organization_and_status", (q) =>
						q.eq("organizationId", args.organizationId).eq("status", "pending"),
					)
					.first();

		if (running || queued) {
			throw new ConvexError({
				code: "CONFLICT",
				message: "A crawl is already running. Wait for it to finish.",
			});
		}

		return await ctx.db.insert("crawlJobs", {
			organizationId: args.organizationId,
			url: args.url,
			status: "pending",
			maxDepth: args.maxDepth,
			options: args.options,
			startedAt: Date.now(),
			pagesVisited: 0,
			resourcesFound: 0,
		});
	},
});

export const updateJobStatus = internalMutation({
	args: {
		jobId: v.id("crawlJobs"),
		status: crawlStatusValidator,
		error: v.optional(v.string()),
		pagesVisited: v.optional(v.number()),
		resourcesFound: v.optional(v.number()),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const job = await ctx.db.get(args.jobId);
		if (!job) return null;

		// Never resurrect or overwrite a finished job: a cancel or a timeout can
		// land while the crawler is still winding down.
		if (job.status !== args.status && TERMINAL_STATUSES.has(job.status)) {
			return null;
		}

		const updates: {
			status: "pending" | "crawling" | "completed" | "failed" | "cancelled";
			completedAt?: number;
			error?: string;
			pagesVisited?: number;
			resourcesFound?: number;
		} = { status: args.status };

		if (
			args.status === "completed" ||
			args.status === "failed" ||
			args.status === "cancelled"
		) {
			updates.completedAt = job.completedAt ?? Date.now();
		}

		if (args.error !== undefined) {
			updates.error = args.error;
		}

		if (args.pagesVisited !== undefined) {
			updates.pagesVisited = args.pagesVisited;
		}

		if (args.resourcesFound !== undefined) {
			updates.resourcesFound = args.resourcesFound;
		}

		await ctx.db.patch(args.jobId, updates);
		return null;
	},
});

export const updateJobProgress = internalMutation({
	args: {
		jobId: v.id("crawlJobs"),
		pagesVisited: v.number(),
		resourcesFound: v.number(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const job = await ctx.db.get(args.jobId);
		if (!job || job.status !== "crawling") return null;

		await ctx.db.patch(args.jobId, {
			pagesVisited: args.pagesVisited,
			resourcesFound: args.resourcesFound,
		});
		return null;
	},
});

export const saveResults = internalMutation({
	args: {
		jobId: v.id("crawlJobs"),
		resources: v.array(
			v.object({
				url: v.string(),
				type: crawlResourceTypeValidator,
				title: v.string(),
				description: v.optional(v.string()),
				size: v.optional(v.number()),
				sourceUrl: v.string(),
				contentHash: v.string(),
				text: v.optional(v.string()),
			}),
		),
	},
	returns: v.number(),
	handler: async (ctx, args) => {
		const job = await ctx.db.get(args.jobId);
		if (!job) return 0;

		// A cancel may land while the crawler is still finishing a page.
		if (job.status === "cancelled") return 0;

		let inserted = 0;
		for (const resource of args.resources.slice(0, MAX_RESOURCES_PER_JOB)) {
			await ctx.db.insert("crawlResults", {
				jobId: args.jobId,
				url: resource.url,
				type: resource.type,
				title: resource.title,
				description: resource.description,
				size: resource.size,
				contentHash: resource.contentHash,
				selected: true,
				addedToKnowledgeBase: false,
				sourceUrl: resource.sourceUrl,
				text: resource.text,
			});
			inserted += 1;
		}

		return inserted;
	},
});

export const getResource = internalQuery({
	args: { resourceId: v.id("crawlResults") },
	returns: v.union(crawlResultValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db.get(args.resourceId);
	},
});

export const getJobDocument = internalQuery({
	args: { jobId: v.id("crawlJobs") },
	returns: v.union(crawlJobValidator, v.null()),
	handler: async (ctx, args) => ctx.db.get(args.jobId),
});

export const markAsAdded = internalMutation({
	args: { resourceId: v.id("crawlResults") },
	returns: v.null(),
	handler: async (ctx, args) => {
		await ctx.db.patch(args.resourceId, {
			addedToKnowledgeBase: true,
		});
		return null;
	},
});

async function fetchPageText(url: string, title: string): Promise<string> {
	const response = await fetchPublicUrl(url, {
		timeout: 15000,
		responseType: "text",
		maxContentLength: 10 * 1024 * 1024,
	});
	const { document } = parseHTML(String(response.data));
	return extractTextFromPage(document, title);
}

function extractTextFromPage(document: Document, title: string): string {
	const body = document.body ?? document;
	const cloned = body.cloneNode(true) as Element;

	const unwanted = Array.from(
		cloned.querySelectorAll(
			"script, style, nav, footer, header, aside, iframe, noscript",
		),
	);
	for (const el of unwanted) {
		el.remove();
	}

	const text = (cloned.textContent ?? "")
		.replace(/\s+/g, " ")
		.replace(/\n\s*\n/g, "\n")
		.trim();

	return `# ${title}\n\n${text}`;
}

function sanitizeFilename(input: string): string {
	const cleaned = input
		.replace(/[\\/:*?"<>|\p{Cc}]/gu, " ")
		.replace(/\s+/g, " ")
		.trim()
		.slice(0, 80);
	return cleaned || "page";
}

function guessMimeType(filename: string): string {
	const ext = filename.split(".").pop()?.toLowerCase() ?? "";
	const mimeTypes: Record<string, string> = {
		pdf: "application/pdf",
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		png: "image/png",
		gif: "image/gif",
		webp: "image/webp",
	};
	return mimeTypes[ext] || "application/octet-stream";
}
