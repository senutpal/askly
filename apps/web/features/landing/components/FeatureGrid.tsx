"use client";

import type { LucideIcon } from "lucide-react";
import React from "react";
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
 * No mouse tracking - pure CSS grid
 */
export const FeatureGrid = React.memo<FeatureGridProps>(({ features }) => {
	return (
		<div className="relative border-t border-l border-border/30 rounded-3xl overflow-hidden">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative">
				{features.map((feature) => (
					<FeatureCard key={feature.id} feature={feature} />
				))}
			</div>
		</div>
	);
});

FeatureGrid.displayName = "FeatureGrid";
