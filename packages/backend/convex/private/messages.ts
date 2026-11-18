import { saveMessage } from "@convex-dev/agent";
import { generateText } from "ai";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { components } from "../_generated/api";
import { adjustConversationStats } from "../lib/conversationStats";
import { authedAction, authedMutation, authedQuery } from "../lib/functions";
import { messagePaginationValidator } from "../lib/validators";
import { supportAgent } from "../system/ai/agents/supportAgent";
import {
	GEMINI_MODEL,
	OPERATOR_MESSAGE_ENHANCEMENT_PROMPT,
} from "../system/ai/constants";
import { createGoogleAI } from "../system/ai/helpers";

export const enhanceResponse = authedAction({
	args: { prompt: v.string() },
	returns: v.string(),
	handler: async (ctx, args) => {
		const gemini = await createGoogleAI(ctx, ctx.orgId, GEMINI_MODEL);

		const response = await generateText({
			model: gemini,
			messages: [
				{
					role: "system",
					content: OPERATOR_MESSAGE_ENHANCEMENT_PROMPT,
				},
				{
					role: "user",
					content: args.prompt,
				},
			],
		});

		return response.text;
	},
});

export const create = authedMutation({
	args: {
		prompt: v.string(),
		conversationId: v.id("conversations"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const conversation = await ctx.db.get(args.conversationId);

		if (!conversation) {
			throw new ConvexError({
				code: "NOT FOUND",
				message: "Conversation not found",
			});
		}

		if (conversation.organizationId !== ctx.orgId) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Invalid Organization Id",
			});
		}

		if (conversation.status === "resolved") {
			throw new ConvexError({
				code: "BAD REQUEST",
				message: "Conversation resolved",
			});
		}

		if (conversation.status === "unresolved") {
			await ctx.db.patch(args.conversationId, { status: "escalated" });
			await adjustConversationStats(ctx, {
				organizationId: ctx.orgId,
				from: "unresolved",
				to: "escalated",
			});
		}

		const { message } = await saveMessage(ctx, components.agent, {
			threadId: conversation.threadId,
			agentName: ctx.identity.familyName,
			message: {
				role: "assistant",
				content: args.prompt,
			},
		});

		if (
			!conversation.lastMessage ||
			conversation.lastMessage.at <= message._creationTime
		) {
			await ctx.db.patch(args.conversationId, {
				lastMessage: {
					text: args.prompt,
					role: "assistant",
					at: message._creationTime,
					...(message.agentName ? { agentName: message.agentName } : {}),
				},
			});
		}

		return null;
	},
});

export const getMany = authedQuery({
	args: {
		threadId: v.string(),
		paginationOpts: paginationOptsValidator,
	},
	returns: messagePaginationValidator,
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

		if (conversation.organizationId !== ctx.orgId) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Invalid organization Id",
			});
		}

		return await supportAgent.listMessages(ctx, {
			threadId: args.threadId,
			paginationOpts: args.paginationOpts,
		});
	},
});
