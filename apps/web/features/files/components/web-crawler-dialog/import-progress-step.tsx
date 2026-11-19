"use client";

import { Loader2Icon } from "lucide-react";

interface ImportProgressStepProps {
	current: number;
	total: number;
}

export const ImportProgressStep = ({
	current,
	total,
}: ImportProgressStepProps) => {
	const percent =
		total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

	return (
		<div className="flex flex-col items-center justify-center gap-4 py-12">
			<Loader2Icon className="size-12 animate-spin text-primary" />
			<div className="text-center w-full max-w-xs space-y-3">
				<p aria-live="polite" className="font-medium">
					Importing {current} of {total} ({percent}%)
				</p>
				<div
					aria-label="Import progress"
					aria-valuemax={total}
					aria-valuemin={0}
					aria-valuenow={current}
					className="h-2 w-full overflow-hidden rounded-full bg-muted"
					role="progressbar"
				>
					<div
						className="h-full bg-primary transition-all duration-300"
						style={{ width: `${percent}%` }}
					/>
				</div>
				<p className="text-muted-foreground text-xs">
					Extracting text and generating embeddings...
				</p>
			</div>
		</div>
	);
};
