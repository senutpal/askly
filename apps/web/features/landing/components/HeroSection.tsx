"use client";

import { useScroll, useTransform } from "motion/react";
import { useMobileDetect } from "@/hooks/use-mobile-detect";
import { HeroBackground } from "./hero/HeroBackground";
import { HeroContent } from "./hero/HeroContent";
import { HeroVisual } from "./hero/HeroVisual";


export default function HeroSection() {
	const { isMobile } = useMobileDetect();
  const { scrollY } = useScroll();
  
	const _y1 = useTransform(scrollY, [0, 500], [0, isMobile ? 100 : 200]);
	const _y2 = useTransform(scrollY, [0, 500], [0, isMobile ? -75 : -150]);

	return (
		<section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden ">
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
