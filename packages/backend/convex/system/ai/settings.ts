import { v } from "convex/values";
import type { Doc } from "../../_generated/dataModel";
import { internalMutation, internalQuery } from "../../_generated/server";
import {
	type AiProvider,
	aiProviderValidator,
	DEFAULT_AI_MODEL,
	DEFAULT_AI_PROVIDER,
	type EmbeddingConfig,
	embeddingProviderValidator,
	getEmbeddingConfig,
} from "../../lib/aiProviders";
import { aiSettingsDocValidator } from "../../lib/validators";

export type ResolvedAiSettings = {
	provider: AiProvider;
	model: string;
	baseUrl?: string;
	embedding: EmbeddingConfig;
	reembedRequired: boolean;
};

export const resolveAiSettings = (
	settings: Doc<"aiSettings"> | null,
): ResolvedAiSettings => {
	if (settings) {
		return {
			provider: settings.provider,
			model: settings.model,
			baseUrl: settings.baseUrl,
			embedding: {
				provider: settings.embeddingProvider,
				model: settings.embeddingModel,
				dimension: settings.embeddingDimension,
			},
			reembedRequired: settings.reembedRequired,
		};
	}

	return {
		provider: DEFAULT_AI_PROVIDER,
		model: DEFAULT_AI_MODEL,
		embedding: getEmbeddingConfig(DEFAULT_AI_PROVIDER),
		reembedRequired: false,
	};
};

export const getForOrganization = internalQuery({
	args: { organizationId: v.string() },
	returns: v.union(aiSettingsDocValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db
			.query("aiSettings")
			.withIndex("by_organization_id", (q) =>
				q.eq("organizationId", args.organizationId),
			)
			.unique();
	},
});

export const upsert = internalMutation({
	args: {
		organizationId: v.string(),
		provider: aiProviderValidator,
		model: v.string(),
		baseUrl: v.optional(v.string()),
		embeddingProvider: embeddingProviderValidator,
		embeddingModel: v.string(),
		embeddingDimension: v.number(),
		reembedRequired: v.boolean(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("aiSettings")
			.withIndex("by_organization_id", (q) =>
				q.eq("organizationId", args.organizationId),
			)
			.unique();

		const values = {
			provider: args.provider,
			model: args.model,
			baseUrl: args.baseUrl,
			embeddingProvider: args.embeddingProvider,
			embeddingModel: args.embeddingModel,
			embeddingDimension: args.embeddingDimension,
			reembedRequired: existing?.reembedRequired || args.reembedRequired,
			updatedAt: Date.now(),
		};

		if (existing) {
			await ctx.db.patch(existing._id, values);
		} else {
			await ctx.db.insert("aiSettings", {
				organizationId: args.organizationId,
				...values,
			});
		}

		return null;
	},
});

export const setReembedRequired = internalMutation({
	args: {
		organizationId: v.string(),
		reembedRequired: v.boolean(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("aiSettings")
			.withIndex("by_organization_id", (q) =>
				q.eq("organizationId", args.organizationId),
			)
			.unique();

		if (existing) {
			await ctx.db.patch(existing._id, {
				reembedRequired: args.reembedRequired,
			});
		}

		return null;
	},
});
