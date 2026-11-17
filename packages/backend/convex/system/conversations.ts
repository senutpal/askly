import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { adjustConversationStats } from "../lib/conversationStats";
import { lastMessageRoleValidator } from "../lib/conversations";

export const escalate = internalMutation({
	args: {
		threadId: v.string(),
	},
	handler: async (ctx, args) => {
		const conversation = await ctx.db
			.query("conversations")
			.withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
			.unique();

		if (!conversation) {
			throw new ConvexError({
				code: "NOT FOUND",
				message: "Conversation Not Found",
			});
		}

		if (conversation.status === "escalated") return;

		await ctx.db.patch(conversation._id, { status: "escalated" });
		await adjustConversationStats(ctx, {
			organizationId: conversation.organizationId,
			from: conversation.status,
			to: "escalated",
		});
	},
});

export const resolve = internalMutation({
	args: {
		threadId: v.string(),
	},
	handler: async (ctx, args) => {
		const conversation = await ctx.db
			.query("conversations")
			.withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
			.unique();

		if (!conversation) {
			throw new ConvexError({
				code: "NOT FOUND",
				message: "Conversation Not Found",
			});
		}

		if (conversation.status === "resolved") return;

		await ctx.db.patch(conversation._id, { status: "resolved" });
		await adjustConversationStats(ctx, {
			organizationId: conversation.organizationId,
			from: conversation.status,
			to: "resolved",
		});
	},
});

export const updateLastMessage = internalMutation({
	args: {
		conversationId: v.id("conversations"),
		text: v.string(),
		role: lastMessageRoleValidator,
		at: v.number(),
		agentName: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) return;
		if (conversation.lastMessage && conversation.lastMessage.at > args.at) {
			return;
		}

		await ctx.db.patch(args.conversationId, {
			lastMessage: {
				text: args.text,
				role: args.role,
				at: args.at,
				...(args.agentName ? { agentName: args.agentName } : {}),
			},
		});
	},
});

export const getByThreadId = internalQuery({
	args: {
		threadId: v.string(),
	},
	handler: async (ctx, args) => {
		const conversation = ctx.db
			.query("conversations")
			.withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
			.unique();

		return conversation;
	},
});
