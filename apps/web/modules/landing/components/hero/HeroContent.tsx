"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatedBadge } from "@workspace/ui/components/animated-badge";
import ShinyText from "@workspace/ui/components/shinytext";
import { SpotlightButton } from "@workspace/ui/components/spotlight-button";

/**
 * HeroContent - Left side text content of hero section
 * Includes heading, description, and CTA buttons
 */
export const HeroContent = React.memo(() => {
  const { theme } = useTheme();
  const badgeColor = useMemo(
    () => (theme === "dark" ? "#20a7db" : "#2d62ef"),
    [theme]
  );

  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
      <AnimatedBadge text="Community-Driven • Free" color={badgeColor} />
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-black/40 to-black dark:from-white dark:to-gray-300 ">
          Campus Communication
        </span>
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-400 dark:from-blue-100 dark:to-blue-600 tracking-tight ">
          Revolutionized Effortlessly<span className="hidden md:inline">.</span>
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className=" max-w-[90%] md:max-w-xl leading-relaxed"
      >
        <ShinyText
          text="The AI-first communication layer for modern institutions.
                Multilingual answers for students, zero overhead for staff."
          disabled={false}
          speed={5}
          className="text-lg md:text-xl leading-relaxed"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex md:mt-3 flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
      >
        <SignUpButton mode="modal">
          <SpotlightButton className="w-full sm:w-auto shadow-lg shadow-blue-500/20">
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </SpotlightButton>
        </SignUpButton>

        <Link href="#features" className="w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-8 font-medium text-neutral-900 dark:text-white transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            View Demo
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
});

HeroContent.displayName = "HeroContent";
