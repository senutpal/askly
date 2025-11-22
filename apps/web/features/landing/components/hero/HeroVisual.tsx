"use client";

import React from "react";
import { motion } from "motion/react";
import { GlassCard } from "@workspace/ui";
import { ChatSimulation } from "./ChatSimulation";

/**
 * HeroVisual - Right side visual content of hero section
 * Displays the animated chat simulation in a glass card
 */
export const HeroVisual = React.memo(() => {
  return (
    <div className="relative lg:h-[600px] flex items-center justify-center lg:justify-end perspective-1000">
      {/* Main Floating Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 10, rotateY: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
        transition={{ duration: 1, type: "spring", bounce: 0.2 }}
        className="relative w-full max-w-[500px] z-20"
      >
        <GlassCard className="border-t border-white/50 dark:border-white/20">
          <ChatSimulation />
        </GlassCard>
      </motion.div>
    </div>
  );
});

HeroVisual.displayName = "HeroVisual";
