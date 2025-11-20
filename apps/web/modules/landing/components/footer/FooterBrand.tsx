"use client";

import React from "react";
import { motion } from "motion/react";

/**
 * FooterBrand - Brand section with tagline
 * Large heading with company messaging
 */
export const FooterBrand = React.memo(() => {
  return (
    <div className="lg:col-span-7 flex flex-col justify-between">
      <div className="space-y-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight text-gray-900 dark:text-white max-w-2xl"
        >
          Transforming campus communication with{" "}
          <span className="text-gray-400 dark:text-neutral-500">intelligent AI.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed"
        >
          Making education accessible in every language. Built for the institutions of tomorrow.
        </motion.p>
      </div>
    </div>
  );
});

FooterBrand.displayName = "FooterBrand";
