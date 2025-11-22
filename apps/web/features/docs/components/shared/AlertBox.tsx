"use client";

import React from "react";
import { AlertCircle, Lightbulb, Info, LucideIcon } from "lucide-react";

type AlertType = "info" | "tip" | "warning";

interface AlertBoxProps {
  type?: AlertType;
  children: React.ReactNode;
  title?: string;
}

export const AlertBox = ({ type = "info", children, title }: AlertBoxProps) => {
  const styles = {
    info: "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300",
    tip: "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    warning: "bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-300",
  };

  const icons: Record<AlertType, LucideIcon> = {
    info: Info,
    tip: Lightbulb,
    warning: AlertCircle
  };
  
  const Icon = icons[type];

  return (
    <div className={`mt-4 p-4 rounded-lg border flex gap-3 ${styles[type]}`}>
      <Icon className="w-5 h-5 shrink-0" />
      <div className="space-y-1">
        {title && <p className="text-sm font-medium opacity-90">{title}</p>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
