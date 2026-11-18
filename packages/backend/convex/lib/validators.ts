import type { MessageDoc } from "@convex-dev/agent";
import { vMessageDoc } from "@convex-dev/agent/validators";
import { type Infer, type Validator, v } from "convex/values";
import { aiProviderValidator, embeddingProviderValidator } from "./aiProviders";

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

export const contactSessionMetadataValidator = v.object(
	contactSessionMetadataFields,
);

export const contactSessionFields = {
	name: v.string(),
	email: v.string(),
	organizationId: v.string(),
	expiresAt: v.number(),
	metadata: v.optional(contactSessionMetadataValidator),
};

export const contactSessionDocValidator = v.object({
	_id: v.id("contactSessions"),
	_creationTime: v.number(),
	...contactSessionFields,
});

export const conversationDocFields = {
	_id: v.id("conversations"),
	_creationTime: v.number(),
	threadId: v.string(),
	organizationId: v.string(),
	contactSessionId: v.id("contactSessions"),
	status: conversationStatusValidator,
	lastMessage: v.optional(lastMessageValidator),
};

export const conversationDocValidator = v.object(conversationDocFields);

export const conversationWithContactSessionValidator = v.object({
	...conversationDocFields,
	contactSession: contactSessionDocValidator,
});

export const conversationListItemValidator = v.object({
	...conversationDocFields,
	lastMessage: v.union(lastMessageValidator, v.null()),
	contactSession: contactSessionDocValidator,
});

export const publicConversationListItemValidator = v.object({
	_id: v.id("conversations"),
	_creationTime: v.number(),
	status: conversationStatusValidator,
	organizationId: v.string(),
	threadId: v.string(),
	lastMessage: v.union(lastMessageValidator, v.null()),
});

export const publicConversationValidator = v.object({
	_id: v.id("conversations"),
	status: conversationStatusValidator,
	threadId: v.string(),
});

export const conversationStatsValidator = v.object({
	unresolved: v.number(),
	escalated: v.number(),
	resolved: v.number(),
	total: v.number(),
	approximate: v.boolean(),
});

export const pluginServiceValidator = v.union(
	v.literal("vapi"),
	v.literal("google-ai"),
	v.literal("openai"),
	v.literal("anthropic"),
);

export const pluginDocValidator = v.object({
	_id: v.id("plugins"),
	_creationTime: v.number(),
	organizationId: v.string(),
	service: pluginServiceValidator,
	secretContent: v.string(),
	iv: v.string(),
	authTag: v.string(),
});

export const pluginSummaryValidator = v.object({
	service: pluginServiceValidator,
});

export const aiSettingsFields = {
	organizationId: v.string(),
	provider: aiProviderValidator,
	model: v.string(),
	baseUrl: v.optional(v.string()),
	embeddingProvider: embeddingProviderValidator,
	embeddingModel: v.string(),
	embeddingDimension: v.number(),
	reembedRequired: v.boolean(),
	updatedAt: v.number(),
};

export const aiSettingsDocValidator = v.object({
	_id: v.id("aiSettings"),
	_creationTime: v.number(),
	...aiSettingsFields,
});

export const aiSettingsViewValidator = v.object({
	provider: aiProviderValidator,
	model: v.string(),
	baseUrl: v.union(v.string(), v.null()),
	hasApiKey: v.boolean(),
	keys: v.object({
		google: v.boolean(),
		openai: v.boolean(),
		anthropic: v.boolean(),
	}),
	embeddingProvider: embeddingProviderValidator,
	embeddingModel: v.string(),
	embeddingDimension: v.number(),
	embeddingHasApiKey: v.boolean(),
	reembedRequired: v.boolean(),
});

export const aiConnectionTestValidator = v.object({
	ok: v.boolean(),
	code: v.optional(v.string()),
	message: v.string(),
});

export const defaultSuggestionsValidator = v.object({
	suggestion1: v.optional(v.string()),
	suggestion2: v.optional(v.string()),
	suggestion3: v.optional(v.string()),
});

export const vapiSettingsValidator = v.object({
	assistantId: v.optional(v.string()),
	phoneNumber: v.optional(v.string()),
});

export const widgetSettingsDocValidator = v.object({
	_id: v.id("widgetSettings"),
	_creationTime: v.number(),
	organizationId: v.string(),
	greetMessage: v.string(),
	defaultSuggestions: defaultSuggestionsValidator,
	vapiSettings: vapiSettingsValidator,
});

export const vapiCredentialsValidator = v.object({
	privateApiKey: v.string(),
	publicApiKey: v.string(),
});

export type VapiCredentials = Infer<typeof vapiCredentialsValidator>;

export const secretValidator = v.union(v.string(), vapiCredentialsValidator);

export const isVapiCredentials = (value: unknown): value is VapiCredentials => {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	return (
		"privateApiKey" in value &&
		typeof value.privateApiKey === "string" &&
		value.privateApiKey.length > 0 &&
		"publicApiKey" in value &&
		typeof value.publicApiKey === "string" &&
		value.publicApiKey.length > 0
	);
};

export const vapiPhoneNumberValidator = v.object({
	id: v.string(),
	number: v.optional(v.string()),
	name: v.optional(v.string()),
	status: v.optional(v.string()),
});

export const vapiAssistantValidator = v.object({
	id: v.string(),
	name: v.optional(v.string()),
	model: v.union(v.string(), v.null()),
	firstMessage: v.optional(v.string()),
});

export const contactSessionValidationValidator = v.object({
	valid: v.boolean(),
	reason: v.optional(v.string()),
	contactSession: v.optional(
		v.object({
			_id: v.id("contactSessions"),
			organizationId: v.string(),
			expiresAt: v.number(),
		}),
	),
});

export const organizationValidationValidator = v.object({
	valid: v.boolean(),
	reason: v.optional(v.string()),
});

export const vapiSecretsValidator = v.object({
	publicApiKey: v.string(),
});

export const fileUploadValidator = v.object({
	url: v.union(v.string(), v.null()),
	entryId: v.string(),
});

export const publicFileValidator = v.object({
	id: v.string(),
	name: v.string(),
	type: v.string(),
	size: v.string(),
	status: v.union(
		v.literal("ready"),
		v.literal("processing"),
		v.literal("error"),
	),
	url: v.union(v.string(), v.null()),
	category: v.optional(v.string()),
});

export const fileListValidator = v.object({
	page: v.array(publicFileValidator),
	isDone: v.boolean(),
	continueCursor: v.string(),
});

export const paginationResultValidator = <
	Item extends Validator<unknown, "required", string>,
>(
	item: Item,
) =>
	v.object({
		page: v.array(item),
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

export const messagePaginationValidator =
	paginationResultValidator(vMessageDoc);

export const toLastMessage = (message: MessageDoc) => {
	const agentName = message.agentName;

	return {
		text: message.text ?? "",
		role: message.message?.role ?? "assistant",
		at: message._creationTime,
		...(agentName ? { agentName } : {}),
	};
};
