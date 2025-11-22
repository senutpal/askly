"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
}

export const ActionCard = ({ title, desc, href, icon: Icon }: ActionCardProps) => (
  <Link href={href} className="block group">
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="h-full p-6 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900/40 dark:border-zinc-800 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
    >
      <Icon className="w-6 h-6 mb-4 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
      <h4 className="font-medium text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
        {title}
        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{desc}</p>
    </motion.div>
  </Link>
);
