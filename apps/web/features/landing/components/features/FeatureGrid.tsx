"use client";

import React, { useRef, useCallback } from "react";
import { useMotionValue } from "motion/react";
import { FeatureCard } from "./FeatureCard";
import { LucideIcon } from "lucide-react";

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
 * Tracks mouse position for spotlight effects
 */
export const FeatureGrid = React.memo<FeatureGridProps>(({ features }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for the entire grid
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    },
    [mouseX, mouseY]
  );

  return (
    <div
      className="relative group border-t border-l border-border/30 rounded-3xl overflow-hidden"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </div>
    </div>
  );
});

FeatureGrid.displayName = "FeatureGrid";
