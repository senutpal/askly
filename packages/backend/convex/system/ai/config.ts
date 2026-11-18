import { ConvexError } from "convex/values";
import { internal } from "../../_generated/api";
import type { ActionCtx } from "../../_generated/server";
import {
	type AiProvider,
	getProviderDefinition,
	pluginServiceForProvider,
} from "../../lib/aiProviders";
import { createEmbeddingModel, createLanguageModel } from "./providers";
import { type ResolvedAiSettings, resolveAiSettings } from "./settings";

export const getProviderApiKey = async (
	ctx: ActionCtx,
	organizationId: string,
	provider: AiProvider,
): Promise<string | null> => {
	try {
		const secret = await ctx.runAction(
			internal.system.secrets.getByOrganizationIdAndService,
			{
				organizationId,
				service: pluginServiceForProvider(provider),
			},
		);

		return typeof secret === "string" && secret.trim().length > 0
			? secret.trim()
			: null;
	} catch {
		return null;
	}
};

export const getResolvedAiSettings = async (
	ctx: ActionCtx,
	organizationId: string,
): Promise<ResolvedAiSettings> => {
	const settings = await ctx.runQuery(
		internal.system.ai.settings.getForOrganization,
		{ organizationId },
	);

	return resolveAiSettings(settings);
};

export const getOrganizationLanguageModel = async (
	ctx: ActionCtx,
	organizationId: string,
) => {
	const settings = await getResolvedAiSettings(ctx, organizationId);
	const apiKey = await getProviderApiKey(
		ctx,
		organizationId,
		settings.provider,
	);

	if (!apiKey) {
		const provider = getProviderDefinition(settings.provider);

		throw new ConvexError({
			code: "MISSING_API_KEY",
			message: `${provider.keyLabel} is not configured. Add it in Settings → Plugins → AI Provider.`,
		});
	}

	return {
		settings,
		model: createLanguageModel({
			provider: settings.provider,
			apiKey,
			baseUrl: settings.baseUrl,
			model: settings.model,
		}),
	};
};

export const getOrganizationEmbeddingModel = async (
	ctx: ActionCtx,
	organizationId: string,
) => {
	const settings = await getResolvedAiSettings(ctx, organizationId);
	const apiKey = await getProviderApiKey(
		ctx,
		organizationId,
		settings.embedding.provider,
	);

	if (!apiKey) {
		const provider = getProviderDefinition(settings.embedding.provider);

		throw new ConvexError({
			code: "MISSING_EMBEDDING_API_KEY",
			message: `Knowledge base embeddings use ${provider.name}. Add a ${provider.keyLabel} in Settings → Plugins → AI Provider.`,
		});
	}

	return {
		settings,
		embedding: settings.embedding,
		model: createEmbeddingModel({
			embedding: settings.embedding,
			apiKey,
			baseUrl:
				settings.embedding.provider === settings.provider
					? settings.baseUrl
					: undefined,
		}),
	};
};
