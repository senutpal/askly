"use client";

import { api } from "@workspace/backend/_generated/api";
import {
	AI_PROVIDERS,
	type AiProvider,
	getEmbeddingConfig,
	getProviderDefinition,
	requiresReembed,
} from "@workspace/backend/lib/aiProviders";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@workspace/ui";
import { useAction } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import {
	CheckCircle2,
	Loader2,
	PlugZap,
	TriangleAlert,
	XCircle,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { getConvexErrorData, getErrorMessage } from "../lib/convex-error";
import { AiProviderCard } from "./ai-provider-card";
import { AiProviderReembedDialog } from "./ai-provider-reembed-dialog";

type AiSettingsView = FunctionReturnType<typeof api.private.aiSettings.get>;

type TestResult = {
	ok: boolean;
	message: string;
};

interface AiProviderFormProps {
	settings: AiSettingsView;
}

export const AiProviderForm = ({ settings }: AiProviderFormProps) => {
	const saveSettings = useAction(api.private.aiSettings.save);
	const testConnection = useAction(api.private.aiSettings.testConnection);

	const [provider, setProvider] = useState<AiProvider>(settings.provider);
	const [model, setModel] = useState(settings.model);
	const [baseUrl, setBaseUrl] = useState(settings.baseUrl ?? "");
	const [apiKey, setApiKey] = useState("");
	const [embeddingApiKey, setEmbeddingApiKey] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [isTesting, setIsTesting] = useState(false);
	const [testResult, setTestResult] = useState<TestResult | null>(null);
	const [isReembedOpen, setIsReembedOpen] = useState(false);

	const definition = getProviderDefinition(provider);
	const hasStoredKey = settings.keys[provider];

	const embedding = getEmbeddingConfig(provider);
	const embeddingDefinition = getProviderDefinition(embedding.provider);
	const usesSeparateEmbeddingKey = embedding.provider !== provider;
	const hasStoredEmbeddingKey = settings.keys[embedding.provider];
	const isEmbeddingKeyMissing =
		usesSeparateEmbeddingKey &&
		!hasStoredEmbeddingKey &&
		!embeddingApiKey.trim();
	const embeddingChanges = requiresReembed(
		{
			provider: settings.embeddingProvider,
			model: settings.embeddingModel,
			dimension: settings.embeddingDimension,
		},
		embedding,
	);

	const modelOptions = useMemo(() => {
		const options = [...definition.models];

		if (model.trim() && !options.some((option) => option.id === model)) {
			options.unshift({
				id: model,
				label: model,
				description: "Currently selected model.",
			});
		}

		return options;
	}, [definition, model]);

	const selectedModel = modelOptions.find((option) => option.id === model);

	const selectProvider = (next: AiProvider) => {
		if (next === provider) {
			return;
		}

		setProvider(next);
		setModel(
			next === settings.provider
				? settings.model
				: getProviderDefinition(next).defaultModel,
		);
		setBaseUrl(next === settings.provider ? (settings.baseUrl ?? "") : "");
		setApiKey("");
		setEmbeddingApiKey("");
		setTestResult(null);
	};

	const persist = async (acknowledgeReembed: boolean) => {
		setIsSaving(true);

		try {
			const result = await saveSettings({
				provider,
				model,
				apiKey: apiKey.trim() || undefined,
				embeddingApiKey: usesSeparateEmbeddingKey
					? embeddingApiKey.trim() || undefined
					: undefined,
				baseUrl: baseUrl.trim() || undefined,
				acknowledgeReembed: acknowledgeReembed || undefined,
			});

			setApiKey("");
			setEmbeddingApiKey("");
			setTestResult(null);
			setIsReembedOpen(false);
			toast.success(
				result.reembedRequired
					? "AI provider saved. Re-embed your knowledge base to finish."
					: "AI provider saved",
			);
		} catch (error) {
			if (getConvexErrorData(error)?.code === "REEMBED_REQUIRED") {
				setIsReembedOpen(true);
			} else {
				toast.error(getErrorMessage(error, "Something went wrong"));
			}
		} finally {
			setIsSaving(false);
		}
	};

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();

		if (!apiKey.trim() && !hasStoredKey) {
			toast.error(`Enter your ${definition.keyLabel}.`);
			return;
		}

		if (isEmbeddingKeyMissing) {
			toast.error(
				`Enter your ${embeddingDefinition.keyLabel} for knowledge base embeddings.`,
			);
			return;
		}

		if (embeddingChanges) {
			setIsReembedOpen(true);
			return;
		}

		void persist(false);
	};

	const onTest = async () => {
		setIsTesting(true);
		setTestResult(null);

		try {
			const result = await testConnection({
				provider,
				model,
				apiKey: apiKey.trim() || undefined,
				baseUrl: baseUrl.trim() || undefined,
			});

			setTestResult(result);
		} catch (error) {
			setTestResult({
				ok: false,
				message: getErrorMessage(error, "Could not test the connection."),
			});
		} finally {
			setIsTesting(false);
		}
	};

	return (
		<form className="space-y-6" onSubmit={onSubmit}>
			<Card className="border-border/60">
				<CardHeader>
					<CardTitle>Provider</CardTitle>
					<CardDescription>
						Choose which provider answers your customers and enhances replies.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid gap-3 md:grid-cols-3">
						{AI_PROVIDERS.map((item) => (
							<AiProviderCard
								definition={item}
								isSelected={item.id === provider}
								key={item.id}
								onSelect={() => selectProvider(item.id)}
							/>
						))}
					</div>

					<div className="space-y-2">
						<Label>Model</Label>
						<Select
							onValueChange={(value) => {
								setModel(value);
								setTestResult(null);
							}}
							value={model}
						>
							<SelectTrigger className="h-11 w-full rounded-xl">
								<SelectValue placeholder="Choose a model" />
							</SelectTrigger>
							<SelectContent>
								{modelOptions.map((option) => (
									<SelectItem key={option.id} value={option.id}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{selectedModel ? (
							<p className="text-muted-foreground text-xs">
								{selectedModel.description}
							</p>
						) : null}
					</div>
				</CardContent>
			</Card>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle>Credentials</CardTitle>
					<CardDescription>
						Keys are encrypted before storage and never sent back to the
						browser.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="space-y-2">
						<div className="flex items-center justify-between gap-2">
							<Label htmlFor="ai-api-key">{definition.keyLabel}</Label>
							<Badge variant={hasStoredKey ? "secondary" : "outline"}>
								{hasStoredKey ? "Stored" : "Not set"}
							</Badge>
						</div>
						<Input
							autoComplete="off"
							className="h-11 rounded-xl bg-muted/40"
							id="ai-api-key"
							onChange={(event) => {
								setApiKey(event.target.value);
								setTestResult(null);
							}}
							placeholder={
								hasStoredKey
									? "Enter a new key to replace the stored one"
									: definition.keyPlaceholder
							}
							type="password"
							value={apiKey}
						/>
						<p className="text-muted-foreground text-xs">
							Leave blank to keep using the stored key.{" "}
							<a
								className="text-primary underline-offset-4 hover:underline"
								href={definition.keyUrl}
								rel="noreferrer"
								target="_blank"
							>
								Get a {definition.name} key
							</a>
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="ai-base-url">Base URL (optional)</Label>
						<Input
							className="h-11 rounded-xl bg-muted/40"
							id="ai-base-url"
							onChange={(event) => {
								setBaseUrl(event.target.value);
								setTestResult(null);
							}}
							placeholder={`${definition.name} default endpoint`}
							value={baseUrl}
						/>
						<p className="text-muted-foreground text-xs">
							Only needed for proxies or compatible gateways.
						</p>
					</div>
				</CardContent>
			</Card>

			<Card className="border-border/60">
				<CardHeader>
					<CardTitle>Knowledge base embeddings</CardTitle>
					<CardDescription>
						Semantic search always uses a dedicated embedding model.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="grid gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-3">
						<div className="space-y-1">
							<p className="text-muted-foreground text-xs">Provider</p>
							<p className="font-medium text-sm">{embeddingDefinition.name}</p>
						</div>
						<div className="space-y-1">
							<p className="text-muted-foreground text-xs">Model</p>
							<p className="font-medium text-sm">{embedding.model}</p>
						</div>
						<div className="space-y-1">
							<p className="text-muted-foreground text-xs">Dimensions</p>
							<p className="font-medium text-sm">{embedding.dimension}</p>
						</div>
					</div>

					{usesSeparateEmbeddingKey ? (
						<div className="space-y-2">
							<div className="flex items-center justify-between gap-2">
								<Label htmlFor="ai-embedding-key">
									{embeddingDefinition.keyLabel} for embeddings
								</Label>
								<Badge
									variant={hasStoredEmbeddingKey ? "secondary" : "outline"}
								>
									{hasStoredEmbeddingKey ? "Stored" : "Not set"}
								</Badge>
							</div>
							<Input
								autoComplete="off"
								className="h-11 rounded-xl bg-muted/40"
								id="ai-embedding-key"
								onChange={(event) => setEmbeddingApiKey(event.target.value)}
								placeholder={
									hasStoredEmbeddingKey
										? "Enter a new key to replace the stored one"
										: embeddingDefinition.keyPlaceholder
								}
								type="password"
								value={embeddingApiKey}
							/>
							<p className="text-muted-foreground text-xs">
								{definition.name} does not provide embeddings, so search keeps
								using {embeddingDefinition.name}.
							</p>
						</div>
					) : null}

					{embeddingChanges ? (
						<div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-50/60 p-4 text-amber-900 text-sm dark:bg-amber-950/30 dark:text-amber-100">
							<TriangleAlert className="mt-0.5 size-4 shrink-0" />
							<p>
								Switching to {embeddingDefinition.name} changes how vectors are
								created. You will be asked to confirm before saving, and the
								knowledge base must be re-embedded afterwards.
							</p>
						</div>
					) : null}
				</CardContent>
			</Card>

			{testResult ? (
				<Alert
					className={
						testResult.ok
							? "border-emerald-500/40 bg-emerald-50/60 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100"
							: undefined
					}
					variant={testResult.ok ? "default" : "destructive"}
				>
					{testResult.ok ? <CheckCircle2 /> : <XCircle />}
					<AlertTitle>
						{testResult.ok ? "Connection works" : "Connection failed"}
					</AlertTitle>
					<AlertDescription
						className={
							testResult.ok
								? "text-emerald-800 dark:text-emerald-200"
								: undefined
						}
					>
						{testResult.message}
					</AlertDescription>
				</Alert>
			) : null}

			<div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
				<Button
					className="rounded-xl"
					disabled={isSaving || isTesting}
					onClick={onTest}
					type="button"
					variant="outline"
				>
					{isTesting ? (
						<Loader2 className="size-4 animate-spin" />
					) : (
						<PlugZap className="size-4" />
					)}
					Test connection
				</Button>
				<Button
					className="rounded-xl"
					disabled={isSaving || isTesting}
					type="submit"
				>
					{isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
					Save changes
				</Button>
			</div>

			<AiProviderReembedDialog
				embeddingLabel={`${embeddingDefinition.name} (${embedding.model})`}
				isSaving={isSaving}
				onConfirm={() => void persist(true)}
				onOpenChange={setIsReembedOpen}
				open={isReembedOpen}
			/>
		</form>
	);
};
