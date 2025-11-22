"use client";

import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface DetailedInfoCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const DetailedInfoCard = ({ title, icon: Icon, children }: DetailedInfoCardProps) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 backdrop-blur-sm transition-all duration-300 h-full"
  >
    <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
      <Icon className="w-5 h-5 text-zinc-500" />
      <h4 className="font-medium">{title}</h4>
    </div>
    <div className="text-sm text-zinc-600 dark:text-zinc-400">
      {children}
    </div>
  </motion.div>
);
