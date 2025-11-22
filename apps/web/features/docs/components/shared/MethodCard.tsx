"use client";

import React from "react";

interface MethodCardProps {
  name: string;
  desc: string;
}

export const MethodCard = ({ name, desc }: MethodCardProps) => (
  <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800">
    <code className="text-sm font-semibold text-blue-600 dark:text-blue-400">{name}</code>
    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
  </div>
);
