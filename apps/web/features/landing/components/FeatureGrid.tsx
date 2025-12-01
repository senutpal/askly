"use client";

import type { LucideIcon } from "lucide-react";
import { useMotionValue } from "motion/react";
import React, { useCallback, useRef } from "react";
import { useMobileDetect } from "@/hooks/use-mobile-detect";
import { FeatureCard } from "./FeatureCard";

interface Feature {
	id: number;
	icon: LucideIcon;
	title: string;
	description: string;
	color: string;
}

interface FeatureGridProps {
	features: Feature[];
}

/**
 * FeatureGrid - Grid container for feature cards
 * Tracks mouse position for spotlight effects on desktop only
 * Optimized for mobile by disabling mouse tracking
 */
export const FeatureGrid = React.memo<FeatureGridProps>(({ features }) => {
	const { isMobile } = useMobileDetect();
	const containerRef = useRef<HTMLDivElement>(null);

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const handleMouseMove = useCallback(
		({ currentTarget, clientX, clientY }: React.MouseEvent) => {
			// Skip on mobile for better performance
			if (isMobile) return;

			const { left, top } = currentTarget.getBoundingClientRect();
			mouseX.set(clientX - left);
			mouseY.set(clientY - top);
		},
		[mouseX, mouseY, isMobile],
	);

	return (
		<div
			className="relative group border-t border-l border-border/30 rounded-3xl overflow-hidden"
			onMouseMove={handleMouseMove}
			ref={containerRef}
			style={{ contain: "layout style" }}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative">
				{features.map((feature) => (
					<FeatureCard
						key={feature.id}
						feature={feature}
						mouseX={mouseX}
						mouseY={mouseY}
					/>
				))}
			</div>
		</div>
	);
});

FeatureGrid.displayName = "FeatureGrid";
