"use client";

import { AlertBadge, cn } from "@workspace/ui";
import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion, MotionValue } from "motion/react";
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

interface ProblemNarrativeProps {
	activeCard: number;
	problems: Problem[];
	scrollYProgress: MotionValue<number>;
}

/**
 * ProblemNarrative - Left side narrative content
 * Displays the current problem description with animations
 * Optimized with faster transitions and GPU acceleration
 */
export const ProblemNarrative = React.memo<ProblemNarrativeProps>(
	({ activeCard, problems, scrollYProgress }) => {
		const { isMobile } = useMobileDetect();
		const activeProblem = problems[activeCard] || problems[0];

		// Memoize progress bar height calculation
		const progressHeight = useMemo(() => {
			try {
				const value = scrollYProgress.get();
				return `${value * 100}%`;
			} catch {
				return "0%";
			}
		}, [scrollYProgress, activeCard]); // Update when activeCard changes

		return (
			<div
				className="w-full lg:w-1/2 h-full flex flex-col justify-start md:justify-center z-10 mb-12 lg:mb-0 relative"
				style={{ contain: "layout style" }}
			>
				{/* Progress Bar - Desktop only */}
				{!isMobile && (
					<div className="absolute top-1/4 left-0 w-1 h-1/2 bg-neutral-200 dark:bg-neutral-800 rounded-full hidden lg:block">
						<div
							className="w-full bg-red-500 rounded-full transition-all duration-300 ease-out"
							style={{ height: progressHeight }}
						/>
					</div>
				)}

				<div className="lg:pl-12 space-y-8 max-w-lg">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
						viewport={{ once: true }}
					>
						<div className="hidden md:block">
							<AlertBadge
								text="Critical Analysis"
								icon={AlertCircle}
								variant="error"
							/>
						</div>
						<h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-black/60 to-black dark:from-neutral-400 dark:to-neutral-300">
							Campus communication <br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-neutral-800 dark:from-neutral-500 dark:to-neutral-300">
								is broken.
							</span>
						</h2>
					</motion.div>

					{/* Content transitions */}
					<div className="relative min-h-[180px]">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeCard}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{
									duration: isMobile ? 0.25 : 0.35,
									ease: "easeInOut",
								}}
								className="absolute top-0 left-0"
								style={{ willChange: "opacity, transform" }}
							>
								<h3
									className={cn(
										"text-2xl font-semibold mb-4 bg-gradient-to-b text-transparent bg-clip-text",
										activeProblem?.accent,
									)}
								>
									{activeProblem?.title}
								</h3>
								<p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
									{activeProblem?.description}
								</p>
							</motion.div>
						</AnimatePresence>
					</div>

					{/* Progress indicator - Desktop only */}
					{!isMobile && (
						<div className="flex items-center gap-4 text-sm font-medium text-neutral-500 dark:text-neutral-500">
							<span>0{activeCard + 1}</span>
							<div className="w-12 h-[1px] bg-neutral-300 dark:bg-neutral-700" />
							<span>0{problems.length}</span>
						</div>
					)}
				</div>
			</div>
		);
	},
);

ProblemNarrative.displayName = "ProblemNarrative";
