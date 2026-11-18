import { generateText } from "ai";
import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { describeProviderFailure } from "../lib/aiErrors";
import {
	aiProviderValidator,
	embeddingProviderValidator,
	getEmbeddingConfig,
	getProviderDefinition,
	pluginServiceForProvider,
	providerFromPluginService,
	requiresReembed,
} from "../lib/aiProviders";
import { authedAction, authedMutation, authedQuery } from "../lib/functions";
import { assertPublicHostname, assertPublicHttpUrl } from "../lib/publicUrl";
import {
	aiConnectionTestValidator,
	aiSettingsViewValidator,
} from "../lib/validators";
import { getProviderApiKey, getResolvedAiSettings } from "../system/ai/config";
import { createLanguageModel } from "../system/ai/providers";
import { resolveAiSettings } from "../system/ai/settings";

const MAX_API_KEY_LENGTH = 4096;
const INVALID_BASE_URL_MESSAGE = "Base URL must be a public http(s) URL.";

const normalizeApiKey = (value: string | undefined) => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
};

const normalizeModel = (value: string) => {
	const trimmed = value.trim();

	if (!trimmed) {
		throw new ConvexError({
			code: "INVALID_MODEL",
			message: "Choose a model.",
		});
	}

	return trimmed;
};

const normalizeBaseUrl = async (value: string | undefined) => {
	const trimmed = value?.trim();

	if (!trimmed) {
		return undefined;
	}

	try {
		assertPublicHttpUrl(trimmed);
		await assertPublicHostname(new URL(trimmed).hostname);
	} catch {
		throw new ConvexError({
			code: "INVALID_BASE_URL",
			message: INVALID_BASE_URL_MESSAGE,
		});
	}

	return trimmed.replace(/\/+$/, "");
};

export const get = authedQuery({
	args: {},
	returns: aiSettingsViewValidator,
	handler: async (ctx) => {
		const [settings, plugins] = await Promise.all([
			ctx.db
				.query("aiSettings")
				.withIndex("by_organization_id", (q) =>
					q.eq("organizationId", ctx.orgId),
				)
				.unique(),
			ctx.db
				.query("plugins")
				.withIndex("by_organization_id", (q) =>
					q.eq("organizationId", ctx.orgId),
				)
				.collect(),
		]);

		const resolved = resolveAiSettings(settings);

		const keys = { google: false, openai: false, anthropic: false };

		for (const plugin of plugins) {
			const provider = providerFromPluginService(plugin.service);

			if (provider) {
				keys[provider] = true;
			}
		}

		return {
			provider: resolved.provider,
			model: resolved.model,
			baseUrl: resolved.baseUrl ?? null,
			hasApiKey: keys[resolved.provider],
			keys,
			embeddingProvider: resolved.embedding.provider,
			embeddingModel: resolved.embedding.model,
			embeddingDimension: resolved.embedding.dimension,
			embeddingHasApiKey: keys[resolved.embedding.provider],
			reembedRequired: resolved.reembedRequired,
		};
	},
});

export const save = authedAction({
	args: {
		provider: aiProviderValidator,
		model: v.string(),
		apiKey: v.optional(v.string()),
		embeddingApiKey: v.optional(v.string()),
		baseUrl: v.optional(v.string()),
		acknowledgeReembed: v.optional(v.boolean()),
	},
	returns: v.object({ reembedRequired: v.boolean() }),
	handler: async (ctx, args) => {
		const current = await getResolvedAiSettings(ctx, ctx.orgId);
		const embedding = getEmbeddingConfig(args.provider);
		const embeddingChanged = requiresReembed(current.embedding, embedding);

		if (embeddingChanged && args.acknowledgeReembed !== true) {
			throw new ConvexError({
				code: "REEMBED_REQUIRED",
				message:
					"Changing the embedding provider requires re-embedding the knowledge base. Acknowledge the warning to continue.",
			});
		}

		const provider = getProviderDefinition(args.provider);
		const model = normalizeModel(args.model);
		const baseUrl = await normalizeBaseUrl(args.baseUrl);
		const apiKey = normalizeApiKey(args.apiKey);
		const embeddingApiKey = normalizeApiKey(args.embeddingApiKey);

		if (
			(apiKey && apiKey.length > MAX_API_KEY_LENGTH) ||
			(embeddingApiKey && embeddingApiKey.length > MAX_API_KEY_LENGTH)
		) {
			throw new ConvexError({
				code: "INVALID_API_KEY",
				message: "The API key is too long.",
			});
		}

		if (!apiKey && !(await getProviderApiKey(ctx, ctx.orgId, args.provider))) {
			throw new ConvexError({
				code: "MISSING_API_KEY",
				message: `Enter your ${provider.keyLabel}.`,
			});
		}

		const embeddingProvider = getProviderDefinition(embedding.provider);
		const embeddingUsesChatKey = embedding.provider === args.provider;

		if (
			!embeddingUsesChatKey &&
			!embeddingApiKey &&
			!(await getProviderApiKey(ctx, ctx.orgId, embedding.provider))
		) {
			throw new ConvexError({
				code: "MISSING_EMBEDDING_API_KEY",
				message: `Enter your ${embeddingProvider.keyLabel}. Knowledge base embeddings use ${embeddingProvider.name}.`,
			});
		}

		if (apiKey) {
			await ctx.runAction(internal.system.secrets.upsert, {
				organizationId: ctx.orgId,
				service: pluginServiceForProvider(args.provider),
				text: apiKey,
			});
		}

		if (!embeddingUsesChatKey && embeddingApiKey) {
			await ctx.runAction(internal.system.secrets.upsert, {
				organizationId: ctx.orgId,
				service: pluginServiceForProvider(embedding.provider),
				text: embeddingApiKey,
			});
		}

		const reembedRequired = embeddingChanged || current.reembedRequired;

		await ctx.runMutation(internal.system.ai.settings.upsert, {
			organizationId: ctx.orgId,
			provider: args.provider,
			model,
			baseUrl,
			embeddingProvider: embedding.provider,
			embeddingModel: embedding.model,
			embeddingDimension: embedding.dimension,
			acknowledgeReembed: args.acknowledgeReembed === true,
		});

		return { reembedRequired };
	},
});

export const testConnection = authedAction({
	args: {
		provider: aiProviderValidator,
		model: v.string(),
		apiKey: v.optional(v.string()),
		baseUrl: v.optional(v.string()),
	},
	returns: aiConnectionTestValidator,
	handler: async (ctx, args) => {
		const provider = getProviderDefinition(args.provider);
		const model = args.model.trim();

		if (!model) {
			return {
				ok: false,
				code: "INVALID_MODEL",
				message: "Choose a model.",
			};
		}

		let baseUrl: string | undefined;

		try {
			baseUrl = await normalizeBaseUrl(args.baseUrl);
		} catch {
			return {
				ok: false,
				code: "INVALID_BASE_URL",
				message: INVALID_BASE_URL_MESSAGE,
			};
		}

		const apiKey =
			normalizeApiKey(args.apiKey) ??
			(await getProviderApiKey(ctx, ctx.orgId, args.provider));

		if (!apiKey) {
			return {
				ok: false,
				code: "MISSING_API_KEY",
				message: `Enter your ${provider.keyLabel}.`,
			};
		}

		try {
			await generateText({
				model: createLanguageModel({
					provider: args.provider,
					apiKey,
					baseUrl,
					model,
				}),
				prompt: "Reply with the word OK.",
				maxOutputTokens: 16,
			});

			return {
				ok: true,
				message: `${provider.name} chat connection successful.`,
			};
		} catch (error) {
			return { ok: false, ...describeProviderFailure(error) };
		}
	},
});

export const removeKey = authedAction({
	args: {
		provider: aiProviderValidator,
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		await ctx.runMutation(internal.system.ai.settings.removeKey, {
			organizationId: ctx.orgId,
			provider: args.provider,
		});

		return null;
	},
});

export const confirmReembed = authedMutation({
	args: {
		embeddingProvider: embeddingProviderValidator,
		embeddingModel: v.string(),
		embeddingDimension: v.number(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const settings = await ctx.db
			.query("aiSettings")
			.withIndex("by_organization_id", (q) => q.eq("organizationId", ctx.orgId))
			.unique();

		if (!settings) {
			return null;
		}

		if (
			requiresReembed(
				{
					provider: settings.embeddingProvider,
					model: settings.embeddingModel,
					dimension: settings.embeddingDimension,
				},
				{
					provider: args.embeddingProvider,
					model: args.embeddingModel,
					dimension: args.embeddingDimension,
				},
			)
		) {
			throw new ConvexError({
				code: "STALE_REEMBED_CONFIRMATION",
				message:
					"The embedding configuration changed. Review the new warning before confirming.",
			});
		}

		await ctx.db.patch(settings._id, { reembedRequired: false });

		return null;
	},
});
