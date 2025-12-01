"use client";

import { GlassCard } from "@workspace/ui";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { useMobileDetect } from "@/hooks/use-mobile-detect";
import { ChatSimulation } from "./ChatSimulation";

/**
 * HeroVisual - Right side visual content of hero section
 * Displays the animated chat simulation in a glass card
 * Optimized for mobile with reduced animation complexity
 */
export const HeroVisual = React.memo(() => {
	const { isMobile } = useMobileDetect();
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		setPrefersReducedMotion(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) =>
			setPrefersReducedMotion(e.matches);
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, []);

	// Simplified animation for mobile and reduced motion
	const shouldSimplify = isMobile || prefersReducedMotion;

	return (
		<div className="relative lg:h-[600px] flex items-center justify-center lg:justify-end perspective-1000">
			{/* Main Floating Card */}
			<motion.div
				initial={{
					opacity: 0,
					scale: shouldSimplify ? 1 : 0.9,
					rotateX: shouldSimplify ? 0 : 10,
					rotateY: shouldSimplify ? 0 : 10,
				}}
				animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
				transition={{
					duration: shouldSimplify ? 0.4 : 1,
					type: shouldSimplify ? "tween" : "spring",
					bounce: 0.2,
				}}
				className="relative w-full max-w-[500px] z-20"
				style={{ willChange: "opacity, transform" }}
			>
				<GlassCard className="border-t border-white/50 dark:border-white/20">
					<ChatSimulation />
				</GlassCard>
			</motion.div>
		</div>
	);
});

HeroVisual.displayName = "HeroVisual";
