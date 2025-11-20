"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useMobileDetect } from "@/hooks/use-mobile-detect";

interface Problem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  stat: string;
  statLabel: string;
  accent: string;
  shadow: string;
}

interface ProblemCardProps {
  card: Problem;
  index: number;
  activeCard: number;
  total: number;
}

/**
 * ProblemCard - Individual problem card in the stack
 * Animates based on scroll position with spring physics
 * Heavily optimized for mobile devices
 */
export const ProblemCard = React.memo<ProblemCardProps>(
  ({ card, index, activeCard, total }) => {
    const { isMobile } = useMobileDetect();
    
    // Physics-based springing for interactions
    const isActive = index === activeCard;
    const isPast = index < activeCard;

    // Calculate visual state based on active index
    // Simplified calculations for mobile
    const animationState = useMemo(
      () => ({
        y: isActive ? 0 : isPast ? -50 * (activeCard - index) : 20 * (index - activeCard),
        scale: isActive
          ? 1
          : isPast
          ? 1 - (activeCard - index) * 0.05
          : 0.9 - (index - activeCard) * 0.05,
        opacity: isActive
          ? 1
          : isPast
          ? isMobile
            ? index === activeCard - 1
              ? 0.8
              : 0
            : Math.max(0, 1 - (activeCard - index) * 0.3)
          : Math.max(0, 0.4 - (index - activeCard) * 0.1),
        // Disable 3D transforms on mobile for performance
        rotateX: isMobile ? 0 : (isActive ? 0 : isPast ? 10 : -10),
        z: isMobile ? 0 : (isActive ? 0 : -100),
        // Reduce blur on mobile
        filter: isMobile ? "blur(0px)" : (isActive ? "blur(0px)" : "blur(8px)"),
      }),
      [isActive, isPast, index, activeCard, isMobile]
    );

    return (
      <motion.div
        // Disable layout animations on mobile (very expensive)
        layout={!isMobile}
        initial={false}
        animate={animationState}
        transition={
          isMobile
            ? {
                // Faster, simpler transitions on mobile
                type: "tween",
                duration: 0.3,
                ease: "easeOut",
              }
            : {
                // Spring physics on desktop only
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 1,
              }
        }
        className={cn(
          "absolute inset-0 rounded-3xl p-1",
          "bg-gradient-to-b from-white/40 to-white/10 dark:from-white/10 dark:to-white/5",
          "border border-white/20 dark:border-white/10",
          // Reduce blur on mobile
          isMobile ? "backdrop-blur-sm shadow-lg" : "backdrop-blur-2xl shadow-2xl",
          isActive ? "z-30" : "z-0",
          // Dynamic shadow based on card color when active
          isActive && card.shadow
        )}
        style={{
          transformStyle: isMobile ? "flat" : "preserve-3d",
          willChange: "transform, opacity",
        }}
      >
        <div className="relative h-full w-full rounded-[20px] bg-white/50 dark:bg-neutral-900/80 overflow-hidden flex flex-col justify-between p-6 md:p-8 border border-white/40 dark:border-white/5">
          {/* Abstract Geometric Background decoration - Hidden on mobile */}
          {!isMobile && (
            <div
              className={cn(
                "absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br",
                card.accent
              )}
            />
          )}

          {/* Header */}
          <div className="relative z-10 flex justify-between items-start">
            <div
              className={cn(
                "p-3 rounded-2xl bg-gradient-to-br shadow-lg text-white",
                card.accent
              )}
            >
              <card.icon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
              <Zap className="w-3 h-3" />
              <span>Pain Point</span>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 mt-auto space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                {card.subtitle}
              </h4>
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                {card.stat}
                <span className="text-lg md:text-xl text-neutral-500 dark:text-neutral-500 font-medium ml-2">
                  {card.statLabel}
                </span>
              </h3>
            </div>

            {/* Visualization Bar (Dummy data for visual aesthetics) */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-medium text-neutral-400">
                <span>Impact Level</span>
              </div>
              <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                {/* Use CSS transition on mobile instead of motion */}
                {isMobile ? (
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", card.accent)}
                    style={{ width: isActive ? "85%" : "0%" }}
                  />
                ) : (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isActive ? "85%" : "0%" }}
                    transition={{ delay: 0.2, duration: 1, ease: "circOut" }}
                    className={cn("h-full rounded-full bg-gradient-to-r", card.accent)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

ProblemCard.displayName = "ProblemCard";
