import { ConvexError, v } from "convex/values";
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
	pluginServiceForProvider,
	requiresReembed,
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
		acknowledgeReembed: v.boolean(),
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("aiSettings")
			.withIndex("by_organization_id", (q) =>
				q.eq("organizationId", args.organizationId),
			)
			.unique();

		const current = resolveAiSettings(existing);
		const embedding: EmbeddingConfig = {
			provider: args.embeddingProvider,
			model: args.embeddingModel,
			dimension: args.embeddingDimension,
		};
		const embeddingChanged = requiresReembed(current.embedding, embedding);

		if (embeddingChanged && !args.acknowledgeReembed) {
			throw new ConvexError({
				code: "REEMBED_REQUIRED",
				message:
					"Changing the embedding provider requires re-embedding the knowledge base. Acknowledge the warning to continue.",
			});
		}

		const values = {
			provider: args.provider,
			model: args.model,
			baseUrl: args.baseUrl,
			embeddingProvider: args.embeddingProvider,
			embeddingModel: args.embeddingModel,
			embeddingDimension: args.embeddingDimension,
			reembedRequired: embeddingChanged || current.reembedRequired,
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

export const removeKey = internalMutation({
	args: {
		organizationId: v.string(),
		provider: aiProviderValidator,
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		const settings = await ctx.db
			.query("aiSettings")
			.withIndex("by_organization_id", (q) =>
				q.eq("organizationId", args.organizationId),
			)
			.unique();

		const current = resolveAiSettings(settings);

		if (args.provider === current.provider) {
			throw new ConvexError({
				code: "KEY_IN_USE",
				message: "Switch to another provider before removing this key.",
			});
		}

		if (args.provider === current.embedding.provider) {
			throw new ConvexError({
				code: "KEY_IN_USE",
				message:
					"This key is used for knowledge base embeddings. Switch providers before removing it.",
			});
		}

		const plugin = await ctx.db
			.query("plugins")
			.withIndex("by_organization_id_and_service", (q) =>
				q
					.eq("organizationId", args.organizationId)
					.eq("service", pluginServiceForProvider(args.provider)),
			)
			.unique();

		if (plugin) {
			await ctx.db.delete(plugin._id);
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
