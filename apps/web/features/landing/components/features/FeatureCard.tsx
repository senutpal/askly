"use client";

import { cn } from "@workspace/ui";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { type MotionValue, motion, useMotionTemplate } from "motion/react";
import React, { useRef } from "react";

interface Feature {
	id: number;
	icon: LucideIcon;
	title: string;
	description: string;
	color: string;
}

interface FeatureCardProps {
	feature: Feature;
	mouseX: MotionValue<number>;
	mouseY: MotionValue<number>;
}

/**
 * FeatureCard - Individual feature card with spotlight effect
 * Mouse tracking creates interactive radial gradient
 */
export const FeatureCard = React.memo<FeatureCardProps>(
	({ feature, mouseX, mouseY }) => {
		const ref = useRef<HTMLDivElement>(null);

		return (
			<div
				ref={ref}
				className="group relative flex flex-col justify-between p-8 h-[280px] w-full border-r border-b border-border/30 bg-background/50 backdrop-blur-3xl dark:bg-black/20 hover:bg-background/80 transition-colors duration-500 overflow-hidden"
			>
				{/* Spotlight Effect */}
				<motion.div
					className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
					style={{
						background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${feature.color.replace("1)", "0.15)")},
              transparent 80%
            )
          `,
					}}
				/>

				{/* Spotlight Border Reveal */}
				<motion.div
					className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
					style={{
						background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${feature.color.replace("1)", "0.4)")},
              transparent 80%
            )
          `,
						maskImage: `linear-gradient(to bottom, transparent, transparent) padding-box, linear-gradient(to bottom, white, white) border-box`,
						WebkitMaskComposite: "xor",
						maskComposite: "exclude",
					}}
				/>

				{/* Content */}
				<div className="relative z-10 flex flex-col h-full justify-between">
					<div className="flex justify-between items-start">
						<div
							className={cn(
								"p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/20 shadow-sm backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
							)}
						>
							<feature.icon
								className="w-6 h-6 transition-colors duration-500"
								style={{ color: feature.color }}
							/>
						</div>
						<motion.div
							initial={{ opacity: 0, x: 10 }}
							whileHover={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.2 }}
						>
							<ArrowUpRight className="w-5 h-5 text-muted-foreground/50" />
						</motion.div>
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
	},
);

FeatureCard.displayName = "FeatureCard";
