"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import ShinyText from "@workspace/ui/components/shinytext";

/**
 * FeaturesHeader - Section header with title and description
 * Introduces the features/capabilities section
 */
export const FeaturesHeader = React.memo(() => {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={headerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mb-24"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-[1px] w-12 bg-foreground/30" />
        <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
          System Capabilities
        </span>
      </div>

      <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground mb-8 leading-[1.1]">
        Built for the <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-violet-600 dark:from-indigo-300 dark:to-violet-500 animate-gradient">
          Intelligence Era.
        </span>
      </h2>
      <ShinyText
        text="A unified cognitive architecture designed to handle the complexities of modern communication at enterprise scale."
        disabled={false}
        speed={5}
        className="text-lg md:text-xl leading-relaxed max-w-2xl"
      />
    </motion.div>
  );
});

FeaturesHeader.displayName = "FeaturesHeader";
