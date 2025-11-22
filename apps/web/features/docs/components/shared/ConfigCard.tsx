"use client";

import React from "react";
import { Settings } from "lucide-react";

interface ConfigCardProps {
  title: string;
  items: { key: string, desc: React.ReactNode }[];
}

export const ConfigCard = ({ title, items }: ConfigCardProps) => (
  <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800">
    <h4 className="font-medium text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
      <Settings className="w-4 h-4 text-zinc-400" />
      {title}
    </h4>
    <ul className="space-y-4">
      {items.map((item, idx) => (
        <li key={idx} className="flex flex-col gap-1 text-sm">
          <span className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded w-fit">
            {item.key}
          </span>
          <span className="text-zinc-600 dark:text-zinc-400 pl-1">
            {item.desc}
          </span>
        </li>
      ))}
    </ul>
  </div>
);
