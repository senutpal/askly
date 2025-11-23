"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface ProblemCardProps {
	title: string;
	description: string;
	icon: LucideIcon;
}

export const ProblemCard = ({
	title,
	description,
	icon: Icon,
}: ProblemCardProps) => (
	<motion.div
		whileHover={{ y: -2 }}
		className="flex gap-4 p-5 rounded-xl border border-red-100 bg-red-50/30 dark:bg-red-400/10 dark:border-red-900/30 transition-all"
	>
		<div className="shrink-0 mt-1">
			<Icon className="w-5 h-5 text-red-500/80 dark:text-red-400" />
		</div>
		<div>
			<h4 className="font-medium text-zinc-900 dark:text-zinc-200 text-sm mb-1">
				{title}
			</h4>
			<p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
				{description}
			</p>
		</div>
	</motion.div>
);
