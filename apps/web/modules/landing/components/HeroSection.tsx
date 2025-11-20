"use client";

import React from "react";
import { useScroll, useTransform } from "motion/react";
import { useMobileDetect } from "@/hooks/use-mobile-detect";
import { HeroBackground } from "./hero/HeroBackground";
import { HeroContent } from "./hero/HeroContent";
import { HeroVisual } from "./hero/HeroVisual";

/**
 * HeroSection - Main hero section of the landing page
 * Refactored into smaller sub-components for better maintainability
 * Optimized for mobile with reduced scroll transform ranges
 */
export default function HeroSection() {
  const { isMobile } = useMobileDetect();
  const { scrollY } = useScroll();
  
  // Reduce parallax effect on mobile to minimize layout calculations
  const y1 = useTransform(scrollY, [0, 500], [0, isMobile ? 100 : 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, isMobile ? -75 : -150]);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden ">
      {/* Background Effects */}
      <HeroBackground />

      <div className="container relative z-10 px-4 md:px-6 pt-32 md:pt-24 pb-20 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Side: Text Content */}
          <HeroContent />

          {/* Right Side: Visual Content */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
