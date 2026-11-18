import { saveMessage } from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { components } from "../_generated/api";
import { mutation, query } from "../_generated/server";
import { adjustConversationStats } from "../lib/conversationStats";
import { consumeRateLimit, RATE_LIMITS } from "../lib/rateLimit";
import {
	paginationResultValidator,
	publicConversationListItemValidator,
	publicConversationValidator,
	toLastMessage,
} from "../lib/validators";
import { supportAgent } from "../system/ai/agents/supportAgent";

export const getMany = query({
	args: {
		contactSessionId: v.id("contactSessions"),
		paginationOpts: paginationOptsValidator,
	},
	returns: paginationResultValidator(publicConversationListItemValidator),
	handler: async (ctx, args) => {
		const contactSession = await ctx.db.get(args.contactSessionId);

		if (!contactSession || contactSession.expiresAt < Date.now()) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "INVALID Session",
			});
		}

		const conversations = await ctx.db
			.query("conversations")
			.withIndex("by_contact_session_id", (q) =>
				q.eq("contactSessionId", args.contactSessionId),
			)
			.order("desc")
			.paginate(args.paginationOpts);

		const conversationsWithLastMessage = await Promise.all(
			conversations.page.map(async (conversation) => {
				let lastMessage = conversation.lastMessage ?? null;

				if (!conversation.lastMessage) {
					const messages = await supportAgent.listMessages(ctx, {
						threadId: conversation.threadId,
						paginationOpts: {
							numItems: 1,
							cursor: null,
						},
					});
					const message = messages.page[0];
					lastMessage = message ? toLastMessage(message) : null;
				}

				return {
					_id: conversation._id,
					_creationTime: conversation._creationTime,
					status: conversation.status,
					organizationId: conversation.organizationId,
					threadId: conversation.threadId,
					lastMessage,
				};
			}),
		);

		return {
			...conversations,
			page: conversationsWithLastMessage,
		};
	},
});

export const getOne = query({
	args: {
		conversationId: v.id("conversations"),
		contactSessionId: v.id("contactSessions"),
	},
	returns: publicConversationValidator,
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.contactSessionId);

		if (!session || session.expiresAt < Date.now()) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "INVALID Session",
			});
		}
		const conversation = await ctx.db.get(args.conversationId);
		if (!conversation) {
			throw new ConvexError({
				code: "NOT FOUND",
				message: "Conversation Not Found",
			});
		}

		if (conversation.contactSessionId !== session._id) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "Incorrect Session",
			});
		}

		return {
			_id: conversation._id,
			status: conversation.status,
			threadId: conversation.threadId,
		};
	},
});

export const create = mutation({
	args: {
		contactSessionId: v.id("contactSessions"),
	},
	returns: v.id("conversations"),
	handler: async (ctx, args) => {
		const session = await ctx.db.get(args.contactSessionId);

		if (!session || session.expiresAt < Date.now()) {
			throw new ConvexError({
				code: "UNAUTHORIZED",
				message: "INVALID Session",
			});
		}

		// The organization is always derived from the validated contact session,
		// never from a caller-supplied value (cross-tenant boundary).
		const organizationId = session.organizationId;

		await consumeRateLimit(ctx, `conversation:session:${session._id}`, {
			limit: RATE_LIMITS.conversationPerSession.limit,
			windowMs: RATE_LIMITS.conversationPerSession.windowMs,
		});

		const widgetSettings = await ctx.db
			.query("widgetSettings")
			.withIndex("by_organization_id", (q) =>
				q.eq("organizationId", organizationId),
			)
			.unique();

		const { threadId } = await supportAgent.createThread(ctx, {
			userId: organizationId,
		});

		const greeting =
			widgetSettings?.greetMessage || "Hello, how can I help you today ?";

		const { message: greetingMessage } = await saveMessage(
			ctx,
			components.agent,
			{
				threadId,
				message: {
					role: "assistant",
					content: greeting,
				},
			},
		);

		const conversationId = await ctx.db.insert("conversations", {
			contactSessionId: session._id,
			status: "unresolved",
			organizationId,
			threadId,
			lastMessage: {
				text: greeting,
				role: "assistant",
				at: greetingMessage._creationTime,
			},
		});

		await adjustConversationStats(ctx, {
			organizationId,
			to: "unresolved",
		});

		return conversationId;
	},
});
