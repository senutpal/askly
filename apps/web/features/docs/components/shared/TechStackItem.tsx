import React from "react";

interface TechStackItemProps {
  category: string;
  items: string[];
}

export const TechStackItem = ({ category, items }: TechStackItemProps) => (
  <div className="p-5 rounded-xl border bg-zinc-50/50 dark:bg-zinc-900/20">
    <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-3 uppercase tracking-wider opacity-80">{category}</h4>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="w-1 h-1 rounded-full bg-blue-500" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);
