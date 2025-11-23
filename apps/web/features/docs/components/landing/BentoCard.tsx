"use client";

import { cn } from "@workspace/ui";
import { motion } from "motion/react";
import Link from "next/link";
import type React from "react";

interface BentoCardProps {
	children: React.ReactNode;
	className?: string;
	href?: string;
	delay?: number;
}

export const BentoCard = ({
	children,
	className,
	href,
	delay = 0,
}: BentoCardProps) => {
	const cardContent = (
		<>
			<div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-900/10" />

			<div className="relative z-10 h-full flex flex-col">{children}</div>
		</>
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay, ease: "easeOut" }}
			className={cn("relative group h-full", className)}
		>
			{href ? (
				<Link
					href={href}
					className="block h-full w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 dark:border-white/10 dark:bg-[#111] dark:hover:shadow-blue-500/10"
				>
					{cardContent}
				</Link>
			) : (
				<div className="block h-full w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 dark:border-white/10 dark:bg-[#111] dark:hover:shadow-blue-500/10">
					{cardContent}
				</div>
			)}
		</motion.div>
	);
};
