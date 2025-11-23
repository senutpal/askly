"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface FeatureCardProps {
	title: string;
	description: string;
	icon: LucideIcon;
	points: string[];
}

export const FeatureCard = ({
	title,
	description,
	icon: Icon,
	points,
}: FeatureCardProps) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true, margin: "-50px" }}
		whileHover={{ y: -4 }}
		className="h-full p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 backdrop-blur-sm transition-all duration-300"
	>
		<div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-5 shadow-sm">
			<Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
		</div>

		<h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
			{title}
		</h3>
		<p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
			{description}
		</p>

		<ul className="space-y-3">
			{points.map((point, idx) => (
				<li
					key={idx}
					className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
				>
					<div className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
					<span>{point}</span>
				</li>
			))}
		</ul>
	</motion.div>
);
