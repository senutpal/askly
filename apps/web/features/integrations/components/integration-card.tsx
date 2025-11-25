"use client";

import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import type { IntegrationId } from "../constants";

interface IntegrationCardProps {
	id: IntegrationId;
	title: string;
	icon: string;
	description?: string;
	onClick: () => void;
	index: number;
}

export const IntegrationCard = ({
	title,
	icon,
	description,
	onClick,
	index,
}: IntegrationCardProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: index * 0.05 }}
			whileHover={{ y: -5 }}
			className="group relative h-full"
		>
			<button
				onClick={onClick}
				className={cn(
					"relative flex h-full w-full flex-col items-start gap-4 overflow-hidden rounded-3xl border border-white/10 bg-neutral-100 p-6 text-left transition-all duration-300",
					"hover:border-white/20 hover:bg-neutral-200 hover:shadow-2xl hover:shadow-primary/5",
					"dark:bg-black/20 dark:hover:bg-white/5"
				)}
			>

				<div className="relative z-10 flex w-full items-start justify-between">
					<div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md transition-transform duration-300 group-hover:scale-110 dark:bg-black/40">
						<Image
							src={icon}
							alt={title}
							width={32}
							height={32}
							className="h-8 w-8 object-contain"
						/>
					</div>
					<div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 opacity-0 transition-all duration-300 group-hover:opacity-100">
						<ArrowRight className="h-4 w-4 text-primary" />
					</div>
				</div>

				<div className="relative z-10 mt-2 space-y-2">
					<h3 className="text-xl font-semibold tracking-tight text-foreground">
						{title}
					</h3>
					<p className="text-sm leading-relaxed text-muted-foreground">
						{description ||
							`Connect your agent with ${title} to streamline your workflow and enhance capabilities.`}
					</p>
				</div>

				{/* Bottom Highlight Line */}
				<div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary/50 to-primary transition-all duration-300 group-hover:w-full" />
			</button>
		</motion.div>
	);
};
