"use client";

import React from "react";

interface GuidelineItemProps {
  label: string;
}

export const GuidelineItem = ({ label }: GuidelineItemProps) => (
  <div className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
    <span className="font-medium text-zinc-900 dark:text-zinc-200">{label}</span>
  </div>
);
