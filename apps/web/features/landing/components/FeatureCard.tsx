"use client";

import { cn } from "@workspace/ui";
import { type LucideIcon } from "lucide-react";
import React from "react";

interface Feature {
	id: number;
	icon: LucideIcon;
	title: string;
	description: string;
	color: string;
}

interface FeatureCardProps {
	feature: Feature;
}

/**
 * FeatureCard - Individual feature card
 * No mouse tracking or spotlight effects
 */
export const FeatureCard = React.memo<FeatureCardProps>(({ feature }) => {
	return (
		<div className="group relative flex flex-col justify-between p-8 h-[280px] w-full border-r border-b border-border/30 bg-background/50 dark:bg-black/20 hover:bg-background/80 transition-colors duration-300 overflow-hidden">
			<div className="relative z-10 flex flex-col h-full justify-between">
				<div className="flex justify-between items-start">
					<div
						className={cn(
							"p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/20 shadow-sm transition-transform duration-300 group-hover:scale-110",
						)}
					>
						<feature.icon
							className="w-6 h-6"
							style={{ color: feature.color }}
						/>
					</div>
				</div>

				<div className="space-y-3">
					<h3 className="text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
						{feature.title}
					</h3>
					<p className="text-base text-muted-foreground leading-relaxed font-medium tracking-wide">
						{feature.description}
					</p>
				</div>
			</div>
		</div>
	);
});

FeatureCard.displayName = "FeatureCard";
