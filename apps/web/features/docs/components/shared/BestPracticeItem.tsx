"use client";

import { CheckCircle2 } from "lucide-react";

interface BestPracticeItemProps {
	text: string;
}

export const BestPracticeItem = ({ text }: BestPracticeItemProps) => (
	<div className="flex items-start gap-3 p-4 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900/40 dark:border-zinc-800">
		<div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 shrink-0">
			<CheckCircle2 className="h-3.5 w-3.5" />
		</div>
		<p className="text-sm text-zinc-600 dark:text-zinc-300">{text}</p>
	</div>
);
