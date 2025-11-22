"use client";

import React from "react";

interface ChecklistItemProps {
  children: React.ReactNode;
}

export const ChecklistItem = ({ children }: ChecklistItemProps) => (
  <div className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0" />
    <span className="leading-relaxed">{children}</span>
  </div>
);
