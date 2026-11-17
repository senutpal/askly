"use client";

import { Button } from "@workspace/ui";
import { Loader2Icon } from "lucide-react";

interface CrawlProgressStepProps {
	pagesVisited?: number;
	resourcesFound?: number;
	onCancel?: () => void;
	isCancelling?: boolean;
}

export const CrawlProgressStep = ({
	pagesVisited = 0,
	resourcesFound = 0,
	onCancel,
	isCancelling = false,
}: CrawlProgressStepProps) => {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-12">
			<Loader2Icon className="size-12 animate-spin text-primary" />
			<div className="space-y-1 text-center">
				<p className="font-medium">Scanning website for resources...</p>
				<p className="text-sm text-muted-foreground">
					{pagesVisited > 0
						? `${pagesVisited} page${pagesVisited === 1 ? "" : "s"} scanned · ${resourcesFound} resource${resourcesFound === 1 ? "" : "s"} found`
						: "Starting crawl..."}
				</p>
			</div>
			{onCancel && (
				<Button
					onClick={onCancel}
					variant="outline"
					size="sm"
					disabled={isCancelling}
				>
					{isCancelling ? "Cancelling..." : "Cancel Crawl"}
				</Button>
			)}
		</div>
	);
};
