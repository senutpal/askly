import React from "react";
import { cn } from "../lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GlassCard - Glassmorphism card with backdrop blur
 * Creates a frosted glass effect with gradient overlay
 */
export const GlassCard = React.memo<GlassCardProps>(({ children, className }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-2xl",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
      {children}
    </div>
  );
});

GlassCard.displayName = "GlassCard";
