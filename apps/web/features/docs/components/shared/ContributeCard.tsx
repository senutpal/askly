"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface ContributeCardProps {
  title: string;
  desc: string;
  icon: LucideIcon;
  href?: string;
}

export const ContributeCard = ({ title, desc, icon: Icon, href }: ContributeCardProps) => {
  const Content = (
    <div className="h-full p-6 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
      <Icon className="w-6 h-6 mb-4 text-zinc-500 dark:text-zinc-400" />
      <h4 className="font-medium text-zinc-900 dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer" className="block group h-full">
        <motion.div whileHover={{ y: -4 }} className="h-full">
          {Content}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      {Content}
    </motion.div>
  );
};
