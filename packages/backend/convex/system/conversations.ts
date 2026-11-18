import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { adjustConversationStats } from "../lib/conversationStats";
import {
	conversationDocValidator,
	lastMessageRoleValidator,
} from "../lib/validators";

export const escalate = internalMutation({
	args: {
		threadId: v.string(),
	},
	returns: v.null(),
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

		if (conversation.status === "escalated") return null;

		await ctx.db.patch(conversation._id, { status: "escalated" });
		await adjustConversationStats(ctx, {
			organizationId: conversation.organizationId,
			from: conversation.status,
			to: "escalated",
		});

		return null;
	},
});

export const resolve = internalMutation({
	args: {
		threadId: v.string(),
	},
	returns: v.null(),
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

		if (conversation.status === "resolved") return null;

		await ctx.db.patch(conversation._id, { status: "resolved" });
		await adjustConversationStats(ctx, {
			organizationId: conversation.organizationId,
			from: conversation.status,
			to: "resolved",
		});

		return null;
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
	returns: v.null(),
	handler: async (ctx, args) => {
		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) return null;
		if (conversation.lastMessage && conversation.lastMessage.at > args.at) {
			return null;
		}

		await ctx.db.patch(args.conversationId, {
			lastMessage: {
				text: args.text,
				role: args.role,
				at: args.at,
				...(args.agentName ? { agentName: args.agentName } : {}),
			},
		});

		return null;
	},
});

export const getByThreadId = internalQuery({
	args: {
		threadId: v.string(),
	},
	returns: v.union(conversationDocValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db
			.query("conversations")
			.withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
			.unique();
	},
});
