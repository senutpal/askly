"use client";

import { cn } from "@workspace/ui";
import { Zap } from "lucide-react";
import { motion } from "motion/react";
import React, { useMemo } from "react";
import { useMobileDetect } from "@/hooks/use-mobile-detect";

interface Problem {
	id: string;
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	subtitle: string;
	description: string;
	stat: string;
	statLabel: string;
	accent: string;
	shadow: string;
}

interface ProblemCardProps {
	card: Problem;
	index: number;
	activeCard: number;
	total: number;
}

/**
 * ProblemCard - Individual problem card in the stack
 * Heavily optimized for mobile - no 3D transforms, no blur, simplified animations
 */
export const ProblemCard = React.memo<ProblemCardProps>(
	({ card, index, activeCard, total }) => {
		const { isMobile } = useMobileDetect();

		const isActive = index === activeCard;
		const isPast = index < activeCard;

		// Optimized animation state - minimal calculations
		const animationState = useMemo(() => {
			if (isMobile) {
				// Ultra-simplified mobile animations - only y and opacity
				return {
					y: isActive
						? 0
						: isPast
							? -40 * (activeCard - index)
							: 15 * (index - activeCard),
					opacity: isActive
						? 1
						: isPast
							? index === activeCard - 1
								? 0.6
								: 0
							: 0.3,
					scale: 1, // Fixed scale on mobile
				};
			}

			// Desktop animations
			return {
				y: isActive
					? 0
					: isPast
						? -50 * (activeCard - index)
						: 20 * (index - activeCard),
				scale: isActive
					? 1
					: isPast
						? 1 - (activeCard - index) * 0.05
						: 0.9 - (index - activeCard) * 0.05,
				opacity: isActive
					? 1
					: isPast
						? Math.max(0, 1 - (activeCard - index) * 0.3)
						: Math.max(0, 0.4 - (index - activeCard) * 0.1),
				rotateX: isActive ? 0 : isPast ? 10 : -10,
				z: isActive ? 0 : -100,
			};
		}, [isActive, isPast, index, activeCard, isMobile]);

		return (
			<motion.div
				layout={false} // Disable layout animations completely
				initial={false}
				animate={animationState}
				transition={
					isMobile
						? {
								// Instant transitions on mobile
								type: "tween",
								duration: 0.25,
								ease: "easeOut",
							}
						: {
								// Smooth spring on desktop
								type: "spring",
								stiffness: 140,
								damping: 22,
								mass: 0.8,
							}
				}
				className={cn(
					"absolute inset-0 rounded-3xl p-1 h-[250px] md:h-full",
					"bg-gradient-to-b from-white/40 to-white/10 dark:from-white/10 dark:to-white/5",
					"border border-white/20 dark:border-white/10",
					// Minimal backdrop blur on mobile
					isMobile
						? "backdrop-blur-[2px] shadow-lg"
						: "backdrop-blur-2xl shadow-2xl",
					isActive ? "z-30" : "z-0",
					isActive && card.shadow,
				)}
				style={{
					transformStyle: isMobile ? "flat" : "preserve-3d",
					willChange: "transform, opacity",
					transform: isMobile ? "translate3d(0, 0, 0)" : undefined, // Force GPU on mobile
					contain: "layout style paint",
				}}
			>
				<div className="relative h-full w-full rounded-[20px] bg-white/50 dark:bg-neutral-900/80 overflow-hidden flex flex-col justify-between p-6 md:p-8 border border-white/40 dark:border-white/5">
					{/* Abstract Geometric Background - Desktop only */}
					{!isMobile && (
						<div
							className={cn(
								"absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br",
								card.accent,
							)}
						/>
					)}

					{/* Header */}
					<div className="relative z-10 flex justify-between items-start">
						<div
							className={cn(
								"p-3 rounded-2xl bg-gradient-to-br shadow-lg text-white",
								card.accent,
							)}
						>
							<card.icon className="w-6 h-6" />
						</div>
						<div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
							<Zap className="w-3 h-3" />
							<span>Pain Point</span>
						</div>
					</div>

					{/* Content */}
					<div className="relative z-10 mt-auto space-y-6">
						<div>
							<h4 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
								{card.subtitle}
							</h4>
							<h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
								{card.stat}
								<span className="text-lg md:text-xl text-neutral-500 dark:text-neutral-500 font-medium ml-2">
									{card.statLabel}
								</span>
							</h3>
						</div>

						{/* Impact Bar - CSS only on mobile for better performance */}
						<div className="space-y-2">
							<div className="flex justify-between text-[10px] uppercase font-medium text-neutral-400">
								<span>Impact Level</span>
							</div>
							<div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
								<div
									className={cn(
										"h-full rounded-full bg-gradient-to-r transition-all",
										card.accent,
									)}
									style={{
										width: isActive ? "85%" : "0%",
										transitionDuration: isActive ? "0.7s" : "0.3s",
										transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		);
	},
);

ProblemCard.displayName = "ProblemCard";
