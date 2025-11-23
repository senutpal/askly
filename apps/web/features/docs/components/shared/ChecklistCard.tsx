"use client";

import { Check } from "lucide-react";

interface ChecklistCardProps {
	title: string;
	items: string[];
}

export const ChecklistCard = ({ title, items }: ChecklistCardProps) => (
	<div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800">
		<h4 className="font-medium text-zinc-900 dark:text-white mb-4">{title}</h4>
		<ul className="space-y-3">
			{items.map((item, idx) => (
				<li
					key={idx}
					className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
				>
					<div className="mt-0.5 p-0.5 rounded border border-zinc-300 dark:border-zinc-700">
						<Check className="w-3 h-3 text-transparent" />{" "}
						{/* Empty state visual */}
					</div>
					<span className="font-mono text-xs">{item}</span>
				</li>
			))}
		</ul>
	</div>
);
