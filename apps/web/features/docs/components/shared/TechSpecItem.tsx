"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface TechSpecItemProps {
	title: string;
	description: string;
	icon: LucideIcon;
}

export const TechSpecItem = ({
	title,
	description,
	icon: Icon,
}: TechSpecItemProps) => (
	<motion.div
		whileHover={{ x: 4 }}
		className="group flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900/50 transition-all duration-200"
	>
		<div className="mt-1 text-zinc-400 group-hover:text-blue-500 transition-colors">
			<Icon className="w-5 h-5" />
		</div>
		<div>
			<h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
				{title}
			</h4>
			<p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
				{description}
			</p>
		</div>
	</motion.div>
);
