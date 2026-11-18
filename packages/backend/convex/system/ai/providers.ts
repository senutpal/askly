import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { EmbeddingModel, LanguageModel } from "ai";
import type { AiProvider, EmbeddingConfig } from "../../lib/aiProviders";

type ProviderConnection = {
	apiKey: string;
	baseUrl?: string;
};

type LanguageModelOptions = ProviderConnection & {
	provider: AiProvider;
	model: string;
};

type EmbeddingModelOptions = ProviderConnection & {
	embedding: EmbeddingConfig;
};

const connectionOptions = ({ apiKey, baseUrl }: ProviderConnection) =>
	baseUrl ? { apiKey, baseURL: baseUrl } : { apiKey };

export const createLanguageModel = ({
	provider,
	model,
	...connection
}: LanguageModelOptions): LanguageModel => {
	const options = connectionOptions(connection);

	switch (provider) {
		case "google":
			return createGoogleGenerativeAI(options)(model);
		case "openai":
			return createOpenAI(options).chat(model);
		case "anthropic":
			return createAnthropic(options)(model);
	}
};

export const createEmbeddingModel = ({
	embedding,
	...connection
}: EmbeddingModelOptions): EmbeddingModel<string> => {
	const options = connectionOptions(connection);

	switch (embedding.provider) {
		case "google":
			return createGoogleGenerativeAI(options).textEmbedding(embedding.model);
		case "openai":
			return createOpenAI(options).textEmbedding(embedding.model);
	}
};
