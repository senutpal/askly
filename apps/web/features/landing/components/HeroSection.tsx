"use client";

import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { HeroVisual } from "./HeroVisual";

/**
 * HeroSection - Main hero section component
 * Optimized for fast initial render and above-fold performance
 */
export default function HeroSection() {
	return (
		<section
			className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
			style={{ willChange: "transform" }}
		>
			<HeroBackground />
			<div className="container relative z-10 px-4 md:px-6 pt-32 md:pt-24 pb-20 mx-auto">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
					<HeroContent />
					<HeroVisual />
				</div>
			</div>
		</section>
	);
}
