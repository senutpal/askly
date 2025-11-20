import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface SocialButtonProps {
  icon: LucideIcon;
  href: string;
  label?: string;
}

/**
 * SocialButton - Animated social media icon button
 * Includes scale and rotate animations on hover
 */
export const SocialButton = React.memo<SocialButtonProps>(
  ({ icon: Icon, href, label }) => {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
      >
        <Icon className="h-5 w-5" />
      </motion.a>
    );
  }
);

SocialButton.displayName = "SocialButton";
