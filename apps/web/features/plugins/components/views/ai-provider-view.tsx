"use client";

import { api } from "@workspace/backend/_generated/api";
import { Separator, Skeleton } from "@workspace/ui";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { AiProviderForm } from "../ai-provider-form";
import { AiProviderReembedBanner } from "../ai-provider-reembed-banner";

export const AiProviderView = () => {
	const settings = useQuery(api.private.aiSettings.get);

	return (
		<div className="min-h-screen w-full bg-background p-6 md:p-12 dark:bg-neutral-900">
			<div className="mx-auto w-full max-w-4xl space-y-10">
				<header className="space-y-3">
					<h1 className="font-bold text-4xl tracking-tight md:text-5xl">
						AI Provider
					</h1>
					<p className="max-w-2xl text-lg text-muted-foreground">
						Pick the model that answers customers, enhances replies, and powers
						knowledge base search.
					</p>
				</header>

				<Separator className="bg-border/50" />

				{settings === undefined ? (
					<Skeleton className="h-[32rem] w-full rounded-3xl" />
				) : (
					<div className="space-y-6">
						{settings.reembedRequired ? <AiProviderReembedBanner /> : null}
						<AiProviderForm settings={settings} />
					</div>
				)}
			</div>
		</div>
	);
};
