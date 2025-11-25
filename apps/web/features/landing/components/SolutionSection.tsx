"use client";

import { RadialPattern } from "@workspace/ui";
import { useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { AvailabilityCard } from "./AvailabilityCard";
import { MultilingualCard } from "./MultilingualCard";
import { ROICard } from "./ROICard";
import { SetupCard } from "./SetupCard";
import { SolutionHeader } from "./SolutionHeader";

export default function SolutionRedesign() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const _y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const _opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.9, 1],
    [0, 1, 1, 0]
  );

  return (
    <section
      id="solution"
      ref={containerRef}
      className="relative mt-16 md:mt-0 overflow-hidden  "
    >
      <RadialPattern />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SolutionHeader />
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          <MultilingualCard />
          <AvailabilityCard />
          <ROICard />
          <SetupCard />
        </div>
      </div>
    </section>
  );
}
