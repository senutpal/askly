import type { MessageDoc } from "@convex-dev/agent";
import { v } from "convex/values";

export const conversationStatusValidator = v.union(
	v.literal("unresolved"),
	v.literal("escalated"),
	v.literal("resolved"),
);

export const lastMessageRoleValidator = v.union(
	v.literal("user"),
	v.literal("assistant"),
	v.literal("system"),
	v.literal("tool"),
);

export const lastMessageValidator = v.object({
	text: v.string(),
	role: lastMessageRoleValidator,
	at: v.number(),
	agentName: v.optional(v.string()),
});

export const contactSessionMetadataFields = {
	userAgent: v.optional(v.string()),
	language: v.optional(v.string()),
	languages: v.optional(v.string()),
	platform: v.optional(v.string()),
	vendor: v.optional(v.string()),
	screenResolution: v.optional(v.string()),
	viewportSize: v.optional(v.string()),
	timezone: v.optional(v.string()),
	timezoneOffset: v.optional(v.number()),
	cookieEnabled: v.optional(v.boolean()),
	referrer: v.optional(v.string()),
	currentUrl: v.optional(v.string()),
};

export const contactSessionFields = {
	name: v.string(),
	email: v.string(),
	organizationId: v.string(),
	expiresAt: v.number(),
	metadata: v.optional(v.object(contactSessionMetadataFields)),
};

export const toLastMessage = (message: MessageDoc) => {
	const agentName = message.agentName;

	return {
		text: message.text ?? "",
		role: message.message?.role ?? "assistant",
		at: message._creationTime,
		...(agentName ? { agentName } : {}),
	};
};
