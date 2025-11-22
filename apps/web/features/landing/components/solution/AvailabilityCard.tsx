"use client";

import React from "react";
import { Clock } from "lucide-react";
import { SpotlightCard } from "@workspace/ui";

/**
 * AvailabilityCard - Vertical Bento card showing 24/7 availability
 * Features a pulsing online indicator
 */
export const AvailabilityCard = React.memo(() => {
  return (
    <SpotlightCard className="md:col-span-3 lg:col-span-4 min-h-[400px] flex flex-col">
      <div className="p-8 flex-1">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3">
          Always Awake
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
          Midnight queries? Weekend worries? Askly provides instant answers 24/7, drastically
          reducing anxiety for students and workload for staff.
        </p>
      </div>
      <div className="relative h-32 w-full bg-gradient-to-t from-purple-50/50 dark:from-purple-900/10 to-transparent flex items-center justify-center">
        {/* Pulsing Indicator */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 bg-green-500/20 rounded-full animate-ping" />
          <div className="relative px-4 py-2 bg-white dark:bg-neutral-800 rounded-full shadow-sm border border-green-200 dark:border-green-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-green-700 dark:text-green-400">
              ONLINE NOW
            </span>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
});

AvailabilityCard.displayName = "AvailabilityCard";
