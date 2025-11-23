"use client";

import { motion } from "motion/react";

interface TechStackCardProps {
	title: string;
	items: { label: string; desc: string }[];
}

export const TechStackCard = ({ title, items }: TechStackCardProps) => (
	<motion.div
		whileHover={{ y: -4 }}
		className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 backdrop-blur-sm transition-all duration-300"
	>
		<h4 className="font-medium text-zinc-900 dark:text-white mb-4">{title}</h4>
		<ul className="space-y-3">
			{items.map((item, idx) => (
				<li
					key={idx}
					className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
				>
					<div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0" />
					<div className="flex flex-col">
						<span className="font-medium text-zinc-900 dark:text-zinc-200">
							{item.label}
						</span>
						<span className="text-xs opacity-70">{item.desc}</span>
					</div>
				</li>
			))}
		</ul>
	</motion.div>
);
