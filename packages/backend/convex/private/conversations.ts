import type { PaginationResult } from "convex/server";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import {
	adjustConversationStats,
	countConversations,
} from "../lib/conversationStats";
import { authedMutation, authedQuery } from "../lib/functions";
import {
	conversationListItemValidator,
	conversationStatsValidator,
	conversationStatusValidator,
	conversationWithContactSessionValidator,
	paginationResultValidator,
} from "../lib/validators";

export const updateStatus = authedMutation({
	args: {
		conversationId: v.id("conversations"),
		status: conversationStatusValidator,
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) {
			throw new ConvexError({
				code: "NOT_FOUND",
				message: "Conversation Not Found",
			});
		}

		if (conversation.organizationId !== ctx.orgId) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Conversation does not belong to your organization",
			});
		}

		if (conversation.status === args.status) return null;

		await ctx.db.patch(args.conversationId, {
			status: args.status,
		});
		await adjustConversationStats(ctx, {
			organizationId: ctx.orgId,
			from: conversation.status,
			to: args.status,
		});

		return null;
	},
});

export const getOne = authedQuery({
	args: {
		conversationId: v.id("conversations"),
	},
	returns: conversationWithContactSessionValidator,
	handler: async (ctx, args) => {
		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) {
			throw new ConvexError({
				code: "NOT FOUND",
				message: "Message Not Found",
			});
		}

		if (conversation.organizationId !== ctx.orgId) {
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

export const getMany = authedQuery({
	args: {
		paginationOpts: paginationOptsValidator,
		status: v.optional(conversationStatusValidator),
	},
	returns: paginationResultValidator(conversationListItemValidator),
	handler: async (ctx, args) => {
		let conversations: PaginationResult<Doc<"conversations">>;
		const status = args.status;

		if (status) {
			conversations = await ctx.db
				.query("conversations")
				.withIndex("by_status_and_organization_id", (q) =>
					q.eq("status", status).eq("organizationId", ctx.orgId),
				)
				.order("desc")
				.paginate(args.paginationOpts);
		} else {
			conversations = await ctx.db
				.query("conversations")
				.withIndex("by_organization_id", (q) =>
					q.eq("organizationId", ctx.orgId),
				)
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

export const getStats = authedQuery({
	args: {},
	returns: conversationStatsValidator,
	handler: async (ctx) => {
		const stats = await ctx.db
			.query("conversationStats")
			.withIndex("by_organization_id", (q) => q.eq("organizationId", ctx.orgId))
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

		const { counts, approximate } = await countConversations(ctx.db, ctx.orgId);

		return {
			...counts,
			total: counts.unresolved + counts.escalated + counts.resolved,
			approximate,
		};
	},
});
