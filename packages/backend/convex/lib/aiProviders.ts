import { type Infer, v } from "convex/values";

export const aiProviderValidator = v.union(
	v.literal("google"),
	v.literal("openai"),
	v.literal("anthropic"),
);

export type AiProvider = Infer<typeof aiProviderValidator>;

export const embeddingProviderValidator = v.union(
	v.literal("google"),
	v.literal("openai"),
);

export type EmbeddingProvider = Infer<typeof embeddingProviderValidator>;

export type AiModelDefinition = {
	id: string;
	label: string;
	description: string;
};

export type AiProviderDefinition = {
	id: AiProvider;
	name: string;
	description: string;
	keyLabel: string;
	keyPlaceholder: string;
	keyUrl: string;
	defaultModel: string;
	models: readonly AiModelDefinition[];
};

export type EmbeddingConfig = {
	provider: EmbeddingProvider;
	model: string;
	dimension: number;
};

export const DEFAULT_AI_PROVIDER: AiProvider = "google";
export const DEFAULT_AI_MODEL = "gemini-3.5-flash-lite";

export const AI_PROVIDERS: readonly AiProviderDefinition[] = [
	{
		id: "google",
		name: "Google",
		description: "Gemini models with native PDF and image understanding.",
		keyLabel: "Google AI API key",
		keyPlaceholder: "AIza...",
		keyUrl: "https://aistudio.google.com/app/apikey",
		defaultModel: DEFAULT_AI_MODEL,
		models: [
			{
				id: "gemini-3.5-flash-lite",
				label: "Gemini 3.5 Flash Lite",
				description: "Fast and inexpensive for high-volume support.",
			},
			{
				id: "gemini-4-hydrogen",
				label: "Gemini 4 Hydrogen",
				description: "Balanced speed and reasoning.",
			},
			{
				id: "gemini-4-argon",
				label: "Gemini 4 Argon",
				description: "Stronger reasoning for complex questions.",
			},
			{
				id: "gemini-4-carbon",
				label: "Gemini 4 Carbon",
				description: "Highest capability for demanding workloads.",
			},
		],
	},
	{
		id: "openai",
		name: "OpenAI",
		description: "GPT models with broad tooling and embedding support.",
		keyLabel: "OpenAI API key",
		keyPlaceholder: "sk-...",
		keyUrl: "https://platform.openai.com/api-keys",
		defaultModel: "gpt-6.2-sol",
		models: [
			{
				id: "gpt-6-luna",
				label: "GPT-6 Luna",
				description: "Low latency and low cost.",
			},
			{
				id: "gpt-6.1-terra",
				label: "GPT-6.1 Terra",
				description: "Balanced everyday support.",
			},
			{
				id: "gpt-6.2-sol",
				label: "GPT-6.2 Sol",
				description: "Recommended default for support.",
			},
			{
				id: "gpt-6.2-astra",
				label: "GPT-6.2 Astra",
				description: "Deepest reasoning for hard cases.",
			},
		],
	},
	{
		id: "anthropic",
		name: "Anthropic",
		description: "Claude models tuned for careful, well-written answers.",
		keyLabel: "Anthropic API key",
		keyPlaceholder: "sk-ant-...",
		keyUrl: "https://console.anthropic.com/settings/keys",
		defaultModel: "claude-sonnet-5-5",
		models: [
			{
				id: "claude-haiku-5-5",
				label: "Claude Haiku 5.5",
				description: "Fastest responses for simple questions.",
			},
			{
				id: "claude-sonnet-5-5",
				label: "Claude Sonnet 5.5",
				description: "Recommended balance of speed and quality.",
			},
			{
				id: "claude-opus-5-5",
				label: "Claude Opus 5.5",
				description: "Highest capability for difficult cases.",
			},
			{
				id: "claude-fable-5-2",
				label: "Claude Fable 5.2",
				description: "Expressive writing and tone.",
			},
		],
	},
];

const EMBEDDING_CONFIGS: Record<EmbeddingProvider, EmbeddingConfig> = {
	google: {
		provider: "google",
		model: "gemini-embedding-001",
		dimension: 3072,
	},
	openai: {
		provider: "openai",
		model: "text-embedding-3-large",
		dimension: 3072,
	},
};

const EMBEDDING_PROVIDER_BY_CHAT_PROVIDER: Record<
	AiProvider,
	EmbeddingProvider
> = {
	google: "google",
	openai: "openai",
	anthropic: "google",
};

export const getProviderDefinition = (
	provider: AiProvider,
): AiProviderDefinition => {
	const definition = AI_PROVIDERS.find((item) => item.id === provider);

	if (!definition) {
		throw new Error(`Unknown AI provider: ${provider}`);
	}

	return definition;
};

export const getDefaultModelForProvider = (provider: AiProvider) =>
	getProviderDefinition(provider).defaultModel;

export const getEmbeddingConfig = (provider: AiProvider): EmbeddingConfig =>
	EMBEDDING_CONFIGS[EMBEDDING_PROVIDER_BY_CHAT_PROVIDER[provider]];

export const embeddingSignature = (config: EmbeddingConfig) =>
	`${config.provider}:${config.model}:${config.dimension}`;

export const requiresReembed = (
	current: EmbeddingConfig,
	next: EmbeddingConfig,
) => embeddingSignature(current) !== embeddingSignature(next);

const LEGACY_RAG_NAMESPACE_SIGNATURE = embeddingSignature(
	EMBEDDING_CONFIGS.google,
);

export const ragNamespaceForEmbedding = (
	organizationId: string,
	embedding: EmbeddingConfig,
) => {
	const signature = embeddingSignature(embedding);

	return signature === LEGACY_RAG_NAMESPACE_SIGNATURE
		? organizationId
		: `${organizationId}:${signature}`;
};

export const pluginServiceForProvider = (provider: AiProvider) =>
	provider === "google" ? "google-ai" : provider;

export const providerFromPluginService = (
	service: string,
): AiProvider | null => {
	if (service === "google-ai") {
		return "google";
	}

	if (service === "openai" || service === "anthropic") {
		return service;
	}

	return null;
};
