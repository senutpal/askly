"use client";

import { NoiseOverlay } from "@workspace/ui";
import React from "react";
import { useMobileDetect } from "@/hooks/use-mobile-detect";

/**
 * HeroBackground - Background effects for hero section
 * Includes grid pattern, gradient blobs, and noise overlay
 * Optimized: gradient blobs hidden on mobile for better performance
 */
export const HeroBackground = React.memo(() => {
	const { isMobile } = useMobileDetect();

	return (
		<>
			{/* Grid Pattern */}
			<div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_80%)]" />

			{/* Gradient Blobs - Hidden on mobile for performance */}
			{!isMobile && (
				<>
					<div className="hidden md:block absolute left-[-10%] top-[0%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-10 blur-[100px] dark:opacity-10" />
					<div className="hidden md:block absolute right-[-10%] top-[0%] -z-10 h-[400px] w-[400px] rounded-full bg-purple-500 opacity-10 blur-[120px] dark:opacity-10" />
				</>
			)}

			{/* Noise Overlay */}
			<NoiseOverlay />
		</>
	);
});

HeroBackground.displayName = "HeroBackground";
