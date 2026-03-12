"use client";

import { GlassCard } from "@workspace/ui";
import React from "react";
import { ChatSimulation } from "./ChatSimulation";

/**
 * HeroVisual - Right side visual content of hero section
 * No animations, instant render
 */
export const HeroVisual = React.memo(() => {
	return (
		<div className="relative lg:h-[600px] flex items-center justify-center lg:justify-end">
			<div className="relative w-full max-w-[500px] z-20">
				<GlassCard className="border-t border-white/50 dark:border-white/20">
					<ChatSimulation />
				</GlassCard>
			</div>
		</div>
	);
});

HeroVisual.displayName = "HeroVisual";
