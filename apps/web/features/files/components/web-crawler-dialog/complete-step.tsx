"use client";

import { AlertTriangleIcon, CheckCircleIcon } from "lucide-react";

export type ImportFailure = {
	url: string;
	error: string;
	title: string;
};

interface CompleteStepProps {
	successful: number;
	failed: number;
	failures?: ImportFailure[];
}

export const CompleteStep = ({
	successful,
	failed,
	failures,
}: CompleteStepProps) => {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-8">
			<div className="rounded-full bg-emerald-500/10 p-4 text-emerald-500">
				<CheckCircleIcon className="size-10" />
			</div>
			<div className="text-center w-full max-w-md">
				<p className="font-semibold text-lg">Import Complete</p>
				<div className="mt-2 text-sm text-muted-foreground space-y-1">
					<p>
						{successful} resource{successful !== 1 && "s"} imported successfully
					</p>
					{failed > 0 && (
						<p className="text-destructive font-medium">
							{failed} failed to import
						</p>
					)}
				</div>
				{failed > 0 && failures && failures.length > 0 && (
					<div className="mt-4 max-h-48 w-full overflow-y-auto rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-left">
						<p className="font-medium text-xs text-destructive mb-2 flex items-center gap-1.5">
							<AlertTriangleIcon className="size-3.5" />
							Failed URLs:
						</p>
						<div className="space-y-2">
							{failures.map((f) => (
								<div
									key={f.url || f.title}
									className="text-xs border-b border-border/30 pb-1.5 last:border-b-0 last:pb-0"
								>
									<p
										className="font-mono text-muted-foreground truncate"
										title={f.url}
									>
										{f.url || f.title}
									</p>
									<p className="text-destructive text-[11px] mt-0.5">
										{f.error}
									</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
