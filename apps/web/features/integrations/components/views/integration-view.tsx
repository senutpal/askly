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
import { Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { INTEGRATIONS, type IntegrationId } from "../../constants";
import { createScript } from "../../utils";

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

			<div className="flex flex-col min-h-screen bg-muted p-8">
				<div className="mx-auto w-full max-w-screen-md">
					<div className="space-y-2">
						<h1 className="text-2xl md:text-4xl font-semibold">
							Setup & Integrations
						</h1>
						<p>Choose a platform below</p>
					</div>

					<div className="mt-8 space-y-6">
						<div className="flex items-center gap-4">
							<Label className="w-34">Organization ID</Label>
							<Input
								className="flex-1 bg-background font-mono text-sm"
								readOnly
								value={organization?.id || "Undefined"}
							/>
							<Button size="sm" className="gap-2" onClick={handleCopyOrg}>
								<Copy className="size-4" />
								Copy
							</Button>
						</div>
					</div>

					<Separator className="my-8" />

					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						{INTEGRATIONS.map((integration) => (
							<button
								key={integration.id}
								className="flex items-center gap-4 rounded-lg border bg-background p-4 hover:bg-accent"
								onClick={() => handleIntegrationClick(integration.id)}
							>
								<Image src={integration.icon} alt="" width={32} height={32} />
								<p>{integration.title}</p>
							</button>
						))}
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

	const copySnippet = async () => {
		try {
			await navigator.clipboard.writeText(snippet);
			toast.success("Snippet copied!");
		} catch {
			toast.error("Copy failed");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="min-w-2xl">
				<DialogHeader>
					<DialogTitle>Install on {integration.toUpperCase()}</DialogTitle>
					<DialogDescription>
						Follow the platform-specific instructions below
					</DialogDescription>
				</DialogHeader>

				{steps.map((step, idx) => (
					<div key={idx} className="space-y-2">
						<div className="rounded-md bg-accent p-2 text-sm">
							{idx + 1}. {step}
						</div>
						{idx === 0 && (
							<div className="group relative">
								<pre className="max-h-[300px] overflow-auto whitespace-pre-wrap break-all bg-foreground p-2 rounded text-secondary text-sm font-mono">
									{snippet}
								</pre>
								<Button
									size="icon"
									variant="secondary"
									className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition"
									onClick={copySnippet}
								>
									<Copy className="size-3" />
								</Button>
							</div>
						)}
					</div>
				))}
			</DialogContent>
		</Dialog>
	);
};
