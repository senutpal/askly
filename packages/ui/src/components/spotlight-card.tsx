import React, { useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "../lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

/**
 * SpotlightCard - Card with mouse-tracking spotlight effect
 * Creates an interactive radial gradient that follows the cursor
 */
export const SpotlightCard = React.memo<SpotlightCardProps>(
  ({ children, className = "", spotlightColor = "rgba(34, 197, 94, 0.1)" }) => {
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
        className={cn(
          "group relative border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 overflow-hidden rounded-3xl",
          className
        )}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                ${spotlightColor},
                transparent 80%
              )
            `,
          }}
        />
        <div className="relative h-full">{children}</div>
      </div>
    );
  }
);

SpotlightCard.displayName = "SpotlightCard";
