"use client";

import { motion } from "motion/react";
import type React from "react";

interface ApiCardProps {
	title: string;
	description?: string;
	children: React.ReactNode;
	label?: string;
}

export const ApiCard = ({
	title,
	description,
	children,
	label,
}: ApiCardProps) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true, margin: "-50px" }}
		className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 transition-all duration-300 mb-8"
	>
		<div className="flex items-center justify-between mb-4">
			<h3 className="text-lg font-medium text-zinc-900 dark:text-white font-mono">
				{title}
			</h3>
			{label && (
				<span className="px-2 py-1 text-xs font-medium rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
					{label}
				</span>
			)}
		</div>
		{description && (
			<p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
				{description}
			</p>
		)}
		{children}
	</motion.div>
);
