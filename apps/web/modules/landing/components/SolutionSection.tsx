"use client";

import React, { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import { RadialPattern } from "@workspace/ui/components/radial-pattern";
import { SolutionHeader } from "./solution/SolutionHeader";
import { MultilingualCard } from "./solution/MultilingualCard";
import { AvailabilityCard } from "./solution/AvailabilityCard";
import { ROICard } from "./solution/ROICard";
import { SetupCard } from "./solution/SetupCard";

/**
 * SolutionSection - Main solution section with Bento grid layout
 * Refactored into smaller card components for better maintainability
 */
export default function SolutionRedesign() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative mt-16 md:mt-0 overflow-hidden  ">
      <RadialPattern />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <SolutionHeader/>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Card 1: Multilingual (Large Span) */}
          <MultilingualCard />

          {/* Card 2: 24/7 Availability (Vertical) */}
          <AvailabilityCard />

          {/* Card 3: ROI/Stats (Vertical) */}
          <ROICard />

          {/* Card 4: Dashboard Preview (Large Span) */}
          <SetupCard />
        </div>
      </div>
    </section>
  );
}