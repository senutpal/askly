import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
	contactSessionFields,
	conversationStatusValidator,
	lastMessageValidator,
} from "./lib/conversations";

export default defineSchema({
	widgetSettings: defineTable({
		organizationId: v.string(),
		greetMessage: v.string(),
		defaultSuggestions: v.object({
			suggestion1: v.optional(v.string()),
			suggestion2: v.optional(v.string()),
			suggestion3: v.optional(v.string()),
		}),
		vapiSettings: v.object({
			assistantId: v.optional(v.string()),
			phoneNumber: v.optional(v.string()),
		}),
	}).index("by_organization_id", ["organizationId"]),
	conversations: defineTable({
		threadId: v.string(),
		organizationId: v.string(),
		contactSessionId: v.id("contactSessions"),
		status: conversationStatusValidator,
		lastMessage: v.optional(lastMessageValidator),
	})
		.index("by_organization_id", ["organizationId"])
		.index("by_contact_session_id", ["contactSessionId"])
		.index("by_thread_id", ["threadId"])
		.index("by_status_and_organization_id", ["status", "organizationId"]),

	conversationStats: defineTable({
		organizationId: v.string(),
		unresolved: v.number(),
		escalated: v.number(),
		resolved: v.number(),
		updatedAt: v.number(),
	}).index("by_organization_id", ["organizationId"]),

	contactSessions: defineTable(contactSessionFields)
		.index("by_organization_id", ["organizationId"])
		.index("by_expires_at", ["expiresAt"]),

	users: defineTable({
		name: v.string(),
	}),

	plugins: defineTable({
		organizationId: v.string(),
		service: v.union(v.literal("vapi"), v.literal("google-ai")),
		secretContent: v.string(),
		iv: v.string(),
		authTag: v.string(),
	})
		.index("by_organization_id", ["organizationId"])
		.index("by_organization_id_and_service", ["organizationId", "service"]),
	crawlJobs: defineTable({
		organizationId: v.string(),
		url: v.string(),
		status: v.union(
			v.literal("pending"),
			v.literal("crawling"),
			v.literal("completed"),
			v.literal("failed"),
			v.literal("cancelled"),
		),
		maxDepth: v.number(),
		options: v.object({
			includeImages: v.boolean(),
			includePdfs: v.boolean(),
			includeText: v.boolean(),
		}),
		startedAt: v.number(),
		completedAt: v.optional(v.number()),
		error: v.optional(v.string()),
		pagesVisited: v.number(),
		resourcesFound: v.number(),
	})
		.index("by_organization_id", ["organizationId"])
		.index("by_status", ["status"])
		.index("by_organization_and_status", ["organizationId", "status"]),

	crawlResults: defineTable({
		jobId: v.id("crawlJobs"),
		url: v.string(),
		type: v.union(v.literal("text"), v.literal("image"), v.literal("pdf")),
		title: v.string(),
		description: v.optional(v.string()),
		size: v.optional(v.number()),
		contentHash: v.string(),
		selected: v.boolean(),
		addedToKnowledgeBase: v.boolean(),
		sourceUrl: v.string(),
		// Extracted text captured at crawl time so importing a page does not
		// re-fetch it. Only set for text resources, and only when it fits in a
		// single Convex document (see MAX_STORED_TEXT_CHARS).
		text: v.optional(v.string()),
		error: v.optional(v.string()),
	})
		.index("by_job_id", ["jobId"])
		.index("by_content_hash", ["contentHash"])
		.index("by_type", ["type"])
		.index("by_job_and_type", ["jobId", "type"]),

	// Fixed-window counters for abuse protection on public endpoints. One row
	// per key ("message:session:<id>", "crawl:org:<id>", ...). Rows are swept
	// by the cleanupRateLimits cron.
	rateLimits: defineTable({
		key: v.string(),
		windowStart: v.number(),
		count: v.number(),
	})
		.index("by_key", ["key"])
		.index("by_window_start", ["windowStart"]),
});
