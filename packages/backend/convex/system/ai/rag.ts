import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";
import type { ActionCtx } from "../../_generated/server";
import { getGoogleAIApiKey } from "./helpers";

export async function createRAG(ctx: ActionCtx, organizationId: string) {
	const apiKey = await getGoogleAIApiKey(ctx, organizationId);
	const google = createGoogleGenerativeAI({ apiKey });

	return new RAG(components.rag, {
		textEmbeddingModel: google.textEmbedding("gemini-embedding-001"),
		embeddingDimension: 3072,
	});
}

const google = createGoogleGenerativeAI({ apiKey: "PLACEHOLDER_FOR_INIT" });
const rag = new RAG(components.rag, {
	textEmbeddingModel: google.textEmbedding("gemini-embedding-001"),
	embeddingDimension: 3072,
});

export default rag;
