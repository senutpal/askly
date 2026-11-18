import { saveMessage } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { components, internal } from "../_generated/api";
import { action, query } from "../_generated/server";
import { RATE_LIMITS } from "../lib/rateLimit";
import { messagePaginationValidator } from "../lib/validators";
import {
	createSupportAgent,
	supportAgent,
} from "../system/ai/agents/supportAgent";
import { escalateConversation } from "../system/ai/tools/escalateConversation";
import { resolveConversation } from "../system/ai/tools/resolveConversation";
import { search } from "../system/ai/tools/search";

export const create = action({
	args: {
		prompt: v.string(),
		threadId: v.string(),
		contactSessionId: v.id("contactSessions"),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const contactSession = await ctx.runQuery(
			internal.system.contactSessions.getOne,
			{
				contactSessionId: args.contactSessionId,
			},
		);
		if (!contactSession || contactSession.expiresAt < Date.now()) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Invalid Session",
			});
		}
		const conversation = await ctx.runQuery(
			internal.system.conversations.getByThreadId,
			{
				threadId: args.threadId,
			},
		);
		if (!conversation) {
			throw new ConvexError({
				code: "NOT FOUND",
				message: "Conversation not found",
			});
		}
		if (conversation.contactSessionId !== contactSession._id) {
			throw new ConvexError({
				code: "FORBIDDEN",
				message: "Conversation does not belong to this session",
			});
		}
		if (conversation.organizationId !== contactSession.organizationId) {
			throw new ConvexError({
				code: "FORBIDDEN",
				message: "Conversation organization does not match this session",
			});
		}
		if (conversation.status === "resolved") {
			throw new ConvexError({
				code: "BAD REQUEST",
				message: "Conversation resolved",
			});
		}
		if (args.prompt.length > 4000) {
			throw new ConvexError({
				code: "BAD_REQUEST",
				message: "Message is too long",
			});
		}
		// Charge the public budgets only after every cheap validation passed,
		// and before the (paid) model call.
		await ctx.runMutation(internal.system.rateLimit.consumeMany, {
			buckets: [
				{
					key: `message:session:${contactSession._id}`,
					...RATE_LIMITS.messagePerSession,
				},
				{
					key: `message:org:${conversation.organizationId}`,
					...RATE_LIMITS.messagePerOrganization,
				},
			],
		});
		const agent =
			conversation.status === "unresolved"
				? await createSupportAgent(ctx, conversation.organizationId)
				: null;

		const { messageId: promptMessageId, message: promptMessage } =
			await saveMessage(ctx, components.agent, {
				threadId: args.threadId,
				message: { role: "user", content: args.prompt },
			});

		await ctx.runMutation(internal.system.conversations.updateLastMessage, {
			conversationId: conversation._id,
			text: args.prompt,
			role: "user",
			at: promptMessage._creationTime,
		});

		if (!agent) return null;

		const result = await agent.generateText(
			ctx,
			{
				threadId: args.threadId,
			},
			{
				promptMessageId,
				tools: {
					escalateConversationTool: escalateConversation,
					resolveConversationTool: resolveConversation,
					searchTool: search,
				},
			},
		);

		const lastOutput = result.savedMessages
			?.filter((message) => (message.text ?? "").trim().length > 0)
			.at(-1);

		if (lastOutput) {
			await ctx.runMutation(internal.system.conversations.updateLastMessage, {
				conversationId: conversation._id,
				text: lastOutput.text ?? "",
				role: lastOutput.message?.role ?? "assistant",
				at: lastOutput._creationTime,
				agentName: lastOutput.agentName,
			});
		}

		return null;
	},
});

export const getMany = query({
	args: {
		threadId: v.string(),
		paginationOpts: paginationOptsValidator,
		contactSessionId: v.id("contactSessions"),
	},
	returns: messagePaginationValidator,
	handler: async (ctx, args) => {
		const contactSession = await ctx.db.get(args.contactSessionId);
		if (!contactSession || contactSession.expiresAt < Date.now()) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Invalid Session",
			});
		}
		const conversation = await ctx.db
			.query("conversations")
			.withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
			.unique();
		if (
			!conversation ||
			conversation.contactSessionId !== args.contactSessionId
		) {
			throw new ConvexError({
				code: "FORBIDDEN",
				message: "Conversation not found for this session",
			});
		}
		if (conversation.organizationId !== contactSession.organizationId) {
			throw new ConvexError({
				code: "FORBIDDEN",
				message: "Conversation organization does not match this session",
			});
		}
		const paginated = await supportAgent.listMessages(ctx, {
			threadId: args.threadId,
			paginationOpts: args.paginationOpts,
		});
		return paginated;
	},
});
