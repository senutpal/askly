"use client";

import React from "react";
import { motion } from "motion/react";
import { SocialButton } from "@workspace/ui";
import { LucideIcon } from "lucide-react";

interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

interface SocialButtonsProps {
  socialLinks: SocialLink[];
  className?: string;
}

/**
 * SocialButtons - Social media icon buttons
 * Displays social links with hover animations
 */
export const SocialButtons = React.memo<SocialButtonsProps>(({ socialLinks, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className={className}
    >
      {socialLinks.map((social) => (
        <SocialButton key={social.label} {...social} />
      ))}
    </motion.div>
  );
});

SocialButtons.displayName = "SocialButtons";
