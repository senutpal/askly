import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";
import type { ActionCtx } from "../../_generated/server";
import {
	type EmbeddingConfig,
	ragNamespaceForEmbedding,
} from "../../lib/aiProviders";
import { getOrganizationEmbeddingModel } from "./config";
import { createEmbeddingModel } from "./providers";

export const createRagForEmbedding = (
	organizationId: string,
	embedding: EmbeddingConfig,
) => ({
	rag: new RAG(components.rag, {
		textEmbeddingModel: createEmbeddingModel({
			embedding,
			apiKey: "unused",
		}),
		embeddingDimension: embedding.dimension,
	}),
	namespace: ragNamespaceForEmbedding(organizationId, embedding),
});

export const createOrganizationRAG = async (
	ctx: ActionCtx,
	organizationId: string,
) => {
	const { embedding, model } = await getOrganizationEmbeddingModel(
		ctx,
		organizationId,
	);

	return {
		rag: new RAG(components.rag, {
			textEmbeddingModel: model,
			embeddingDimension: embedding.dimension,
		}),
		namespace: ragNamespaceForEmbedding(organizationId, embedding),
		embedding,
	};
};
