"use client";

import {
	Button,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui";
import { Brain, CheckCircle2, Sparkles, UnplugIcon } from "lucide-react";
import Image from "next/image";

interface GoogleAIConnectedViewProps {
	onDisconnect: () => void;
}

export const GoogleAIConnectedView = ({
	onDisconnect,
}: GoogleAIConnectedViewProps) => {
	const capabilities = [
		{
			title: "Chat Enhancement",
			description: "AI-powered message generation with Gemini models",
			icon: Sparkles,
		},
		{
			title: "Document Processing",
			description: "Extract text from PDFs, images, and documents",
			icon: Brain,
		},
		{
			title: "Knowledge Search",
			description: "Semantic search using vector embeddings",
			icon: CheckCircle2,
		},
	];

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Image
								alt="Google AI"
								className="rounded-lg object-contain"
								height={36}
								width={36}
								src="/gemini.svg"
							/>
							<div className="space-y-2">
								<CardTitle>GeminiIntegration</CardTitle>
								<CardDescription>
									Your AI capabilities are active and ready
								</CardDescription>
							</div>
						</div>
						<Button onClick={onDisconnect} size="sm" variant="destructive">
							<UnplugIcon /> Disconnect
						</Button>
					</div>
				</CardHeader>
			</Card>

			<div className="grid gap-4 md:grid-cols-3">
				{capabilities.map((capability) => {
					const Icon = capability.icon;
					return (
						<Card key={capability.title}>
							<CardHeader>
								<div className="flex items-start gap-4">
									<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
										<Icon className="h-6 w-6 text-primary" />
									</div>
									<div className="space-y-1">
										<CardTitle className="text-base">
											{capability.title}
										</CardTitle>
										<CardDescription className="text-sm">
											{capability.description}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
						</Card>
					);
				})}
			</div>

			<Card className="border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20">
				<CardHeader>
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
							<CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<CardTitle className="text-base text-green-900 dark:text-green-100">
								Connected Successfully
							</CardTitle>
							<CardDescription className="text-green-700 dark:text-green-300">
								All AI features are operational and using your API key securely
							</CardDescription>
						</div>
					</div>
				</CardHeader>
			</Card>
		</div>
	);
};
