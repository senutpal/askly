import { type PaginationResult, paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";
import {
	adjustConversationStats,
	countConversations,
} from "../lib/conversationStats";
import {
	contactSessionFields,
	conversationStatusValidator,
	lastMessageValidator,
} from "../lib/conversations";

const paginationResultValidator = v.object({
	page: v.array(
		v.object({
			_id: v.id("conversations"),
			_creationTime: v.number(),
			threadId: v.string(),
			organizationId: v.string(),
			contactSessionId: v.id("contactSessions"),
			status: conversationStatusValidator,
			lastMessage: v.union(lastMessageValidator, v.null()),
			contactSession: v.object({
				_id: v.id("contactSessions"),
				_creationTime: v.number(),
				...contactSessionFields,
			}),
		}),
	),
	isDone: v.boolean(),
	continueCursor: v.string(),
	splitCursor: v.optional(v.union(v.string(), v.null())),
	pageStatus: v.optional(
		v.union(
			v.literal("SplitRecommended"),
			v.literal("SplitRequired"),
			v.null(),
		),
	),
});

export const updateStatus = mutation({
	args: {
		conversationId: v.id("conversations"),
		status: v.union(
			v.literal("unresolved"),
			v.literal("escalated"),
			v.literal("resolved"),
		),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Identity Not Found",
			});
		}

		const orgId = identity.orgId as string;

		if (!orgId) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Organization Not Found",
			});
		}

		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) {
			throw new ConvexError({
				code: "NOT_FOUND",
				message: "Conversation Not Found",
			});
		}

		if (conversation.organizationId !== orgId) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Conversation does not belong to your organization",
			});
		}

		if (conversation.status === args.status) return;

		await ctx.db.patch(args.conversationId, {
			status: args.status,
		});
		await adjustConversationStats(ctx, {
			organizationId: orgId,
			from: conversation.status,
			to: args.status,
		});
	},
});

export const getOne = query({
	args: {
		conversationId: v.id("conversations"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Identity Not Found",
			});
		}

		const orgId = identity.orgId as string;

		if (!orgId) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Organization Not Found",
			});
		}

		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) {
			throw new ConvexError({
				code: "NOT FOUND",
				message: "Message Not Found",
			});
		}

		if (conversation.organizationId !== orgId) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Invalid Organization ID",
			});
		}

		const contactSession = await ctx.db.get(conversation.contactSessionId);

		if (!contactSession) {
			throw new ConvexError({
				code: "NOT FOUND",
				message: "Contact Session Not Found",
			});
		}

		return {
			...conversation,
			contactSession,
		};
	},
});

export const getMany = query({
	args: {
		paginationOpts: paginationOptsValidator,
		status: v.optional(conversationStatusValidator),
	},
	returns: paginationResultValidator,
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Identity Not Found",
			});
		}

		const orgId = identity.orgId as string;

		if (!orgId) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Organization Not Found",
			});
		}

		let conversations: PaginationResult<Doc<"conversations">>;

		if (args.status) {
			conversations = await ctx.db
				.query("conversations")
				.withIndex("by_status_and_organization_id", (q) =>
					q
						.eq("status", args.status as Doc<"conversations">["status"])
						.eq("organizationId", orgId),
				)
				.order("desc")
				.paginate(args.paginationOpts);
		} else {
			conversations = await ctx.db
				.query("conversations")
				.withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
				.order("desc")
				.paginate(args.paginationOpts);
		}

		const conversationsWithAdditionalData = await Promise.all(
			conversations.page.map(async (conversation) => {
				const contactSession = await ctx.db.get(conversation.contactSessionId);

				if (!contactSession) {
					return null;
				}

				return {
					...conversation,
					lastMessage: conversation.lastMessage ?? null,
					contactSession,
				};
			}),
		);

		const validConversations = conversationsWithAdditionalData.filter(
			(conv): conv is NonNullable<typeof conv> => conv != null,
		);

		return {
			...conversations,
			page: validConversations,
		};
	},
});

export const getStats = query({
	args: {},
	returns: v.object({
		unresolved: v.number(),
		escalated: v.number(),
		resolved: v.number(),
		total: v.number(),
		approximate: v.boolean(),
	}),
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (identity === null) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Identity Not Found",
			});
		}

		const orgId = identity.orgId as string;

		if (!orgId) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Organization Not Found",
			});
		}

		const stats = await ctx.db
			.query("conversationStats")
			.withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
			.unique();

		if (stats) {
			const total = stats.unresolved + stats.escalated + stats.resolved;

			return {
				unresolved: stats.unresolved,
				escalated: stats.escalated,
				resolved: stats.resolved,
				total,
				approximate: stats.approximate ?? false,
			};
		}

		const { counts, approximate } = await countConversations(ctx.db, orgId);

		return {
			...counts,
			total: counts.unresolved + counts.escalated + counts.resolved,
			approximate,
		};
	},
});
