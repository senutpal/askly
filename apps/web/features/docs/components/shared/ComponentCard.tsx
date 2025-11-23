"use client";

import type { LucideIcon } from "lucide-react";

interface ComponentCardProps {
	title: string;
	desc: string;
	icon: LucideIcon;
	items: string[];
}

export const ComponentCard = ({
	title,
	desc,
	icon: Icon,
	items,
}: ComponentCardProps) => (
	<div className="p-6 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900/40 dark:border-zinc-800">
		<Icon className="w-6 h-6 mb-4 text-zinc-500 dark:text-zinc-400" />
		<h4 className="font-medium text-zinc-900 dark:text-white mb-2">{title}</h4>
		<p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
			{desc}
		</p>
		<div className="space-y-2">
			{items.map((item, i) => (
				<div
					key={i}
					className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-mono"
				>
					<div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
					{item}
				</div>
			))}
		</div>
	</div>
);
