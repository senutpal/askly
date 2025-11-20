"use client";

import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

/**
 * SolutionHeader - Section header with badge and title
 * Introduces the solution/advantage section
 */
export const SolutionHeader = React.memo(() => {
  return (
    <div className="max-w-3xl mx-auto text-center mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/50 dark:bg-green-900/40 border border-green-400 dark:border-green-800 mb-6 backdrop-blur-sm"
      >
        <Sparkles className="w-3 h-3 text-green-600 dark:text-green-500" />
        <span className="text-xs font-semibold tracking-wide uppercase text-green-700 dark:text-green-500">
          The Askly Advantage
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-neutral-600 to-neutral-800 dark:from-neutral-200 dark:to-neutral-600 mb-6"
      >
        Automate support without <br />
        <div className="md:mt-4 text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-600 dark:from-green-400 dark:to-green-600">
          losing the human touch.
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-lg md:text-xl leading-relaxed text-neutral-600 dark:text-neutral-400"
      >
        Askly makes campus communication smoother and more efficient, taking care of everyday
        tasks so your team can dedicate their time and energy to supporting students.
      </motion.p>
    </div>
  );
});

SolutionHeader.displayName = "SolutionHeader";
