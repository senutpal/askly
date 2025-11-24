"use client";

import { useOrganization } from "@clerk/nextjs";
import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Input,
	Label,
	Separator,
} from "@workspace/ui";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { INTEGRATIONS, type IntegrationId } from "../../constants";
import { createScript } from "../../utils";
import { IntegrationCard } from "../integration-card";

interface IntegrationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	snippet: string;
	integration: IntegrationId;
}

export const IntegrationsView = () => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedSnippet, setSelectedSnippet] = useState("");
	const [selectedIntegration, setSelectedIntegration] =
		useState<IntegrationId | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	const { organization } = useOrganization();

	const handleIntegrationClick = (integrationId: IntegrationId) => {
		if (!organization) {
			toast.error("Organization ID not found");
			return;
		}

		setSelectedIntegration(integrationId);
		const snippet = createScript(integrationId, organization.id);
		setSelectedSnippet(snippet);
		setDialogOpen(true);
	};

	const handleCopyOrg = async () => {
		try {
			if (!organization?.id) {
				toast.error("Organization ID not found");
				return;
			}
			await navigator.clipboard.writeText(organization.id);
			toast.success("Copied Organization ID");
		} catch {
			toast.error("Failed to Copy");
		}
	};

	const filteredIntegrations = INTEGRATIONS.filter((integration) =>
		integration.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<>
			{selectedIntegration && (
				<IntegrationDialog
					open={dialogOpen}
					onOpenChange={setDialogOpen}
					snippet={selectedSnippet}
					integration={selectedIntegration}
				/>
			)}

			<div className="min-h-screen w-full bg-background dark:bg-neutral-900 p-6 md:p-12">
				<div className="mx-auto w-full max-w-6xl space-y-12">
					{/* Header Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
					>
						<div className="space-y-4">
							
							<h1 className="text-4xl font-bold tracking-tight md:text-6xl">
								Connect your <br />
								<span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
									workflow
								</span>
							</h1>
							<p className="max-w-md text-lg text-muted-foreground">
								Seamlessly integrate with your favorite platforms and tools.
								Expand your capabilities in seconds.
							</p>
						</div>

						{/* Organization ID Card */}
						<div className="w-full max-w-md rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
							<Label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Organization ID
							</Label>
							<div className="flex items-center gap-2 rounded-xl bg-background p-2 ring-1 ring-border transition-all focus-within:ring-2 focus-within:ring-primary">
								<code className="flex-1 truncate bg-transparent px-2 font-mono text-sm">
									{organization?.id || "Loading..."}
								</code>
								<Button
									size="sm"
									variant="ghost"
									className="h-8 gap-2 rounded-lg hover:bg-primary/10 hover:text-primary"
									onClick={handleCopyOrg}
								>
									<Copy className="size-3.5" />
									Copy
								</Button>
							</div>
						</div>
					</motion.div>

					<Separator className="bg-border/50" />

					{/* Search and Grid */}
					<div className="space-y-8">
						<div className="relative max-w-md">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search integrations..."
								className="h-12 rounded-xl border-border/50 bg-background/50 pl-10 backdrop-blur-sm transition-all focus:border-primary focus:ring-primary/20"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<motion.div
							layout
							className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
						>
							<AnimatePresence>
								{filteredIntegrations.map((integration, index) => (
									<IntegrationCard
										key={integration.id}
										{...integration}
										index={index}
										onClick={() => handleIntegrationClick(integration.id)}
									/>
								))}
							</AnimatePresence>
						</motion.div>

						{filteredIntegrations.length === 0 && (
							<div className="flex h-64 flex-col items-center justify-center gap-4 text-center text-muted-foreground">
								<Search className="h-12 w-12 opacity-20" />
								<p>No integrations found matching "{searchQuery}"</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

const IntegrationDialog = ({
	open,
	onOpenChange,
	snippet,
	integration,
}: IntegrationDialogProps) => {
	const steps =
		INTEGRATIONS.find((i) => i.id === integration)?.installSteps ?? [];
	const [copied, setCopied] = useState(false);

	const copySnippet = async () => {
		try {
			await navigator.clipboard.writeText(snippet);
			setCopied(true);
			toast.success("Snippet copied!");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Copy failed");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-2xl gap-0 overflow-hidden border-b bg-background/90 p-0 dark:bg-neutral-800 backdrop-blur-xl sm:rounded-3xl">
				<div className="bg-muted/50 p-6">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3 text-2xl">
							Install on{" "}
							<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								{INTEGRATIONS.find((i) => i.id === integration)?.title}
							</span>
						</DialogTitle>
						<DialogDescription className="text-base">
							Follow the platform-specific instructions below to get started.
						</DialogDescription>
					</DialogHeader>
				</div>

				<div className="space-y-6 p-6">
					{steps.map((step, idx) => (
						<div key={idx} className="space-y-3">
							<div className="flex items-start gap-3">
								<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
									{idx + 1}
								</div>
								<p className="text-sm text-foreground/80">{step}</p>
							</div>
							{idx === 0 && (
								<div className="group relative ml-9 overflow-hidden rounded-xl border border-border/50 bg-background">
									<div className="absolute right-2 top-2 z-10">
										<Button
											size="sm"
											variant="secondary"
											className="h-8 gap-2 bg-background/80 backdrop-blur transition-all hover:bg-background"
											onClick={copySnippet}
										>
											{copied ? (
												<Check className="size-3.5 text-green-500" />
											) : (
												<Copy className="size-3.5" />
											)}
										
										</Button>
									</div>
									<pre className="max-h-[300px] overflow-auto p-4 text-xs font-mono text-muted-foreground scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
										{snippet}
									</pre>
								</div>
							)}
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
};
