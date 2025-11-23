"use client";

import { AlertCircle, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";

interface SolutionCardProps {
	title: string;
	children: React.ReactNode;
	severity?: "default" | "warning";
}

export const SolutionCard = ({
	title,
	children,
	severity = "default",
}: SolutionCardProps) => (
	<motion.div
		whileHover={{ y: -2 }}
		className={`p-6 rounded-2xl border transition-all duration-300 ${
			severity === "warning"
				? "border-orange-200 bg-orange-50/30 dark:border-orange-900/30 dark:bg-orange-900/10"
				: "border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800"
		}`}
	>
		<div className="flex items-center gap-2 mb-4">
			{severity === "warning" ? (
				<AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
			) : (
				<ShieldAlert className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
			)}
			<h4 className="font-medium text-zinc-900 dark:text-white">{title}</h4>
		</div>
		<div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-3">
			{children}
		</div>
	</motion.div>
);
