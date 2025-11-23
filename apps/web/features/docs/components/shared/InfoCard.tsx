"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface InfoCardProps {
	title: string;
	description: string;
	icon: LucideIcon;
	delay?: number;
}

export const InfoCard = ({
	title,
	description,
	icon: Icon,
	delay = 0,
}: InfoCardProps) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true }}
		transition={{ duration: 0.5, delay }}
		className="p-6 rounded-2xl border bg-white dark:bg-zinc-900/20 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
	>
		<div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-900 dark:text-white">
			<Icon className="w-5 h-5" />
		</div>
		<h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
			{title}
		</h3>
		<p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
			{description}
		</p>
	</motion.div>
);
