"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { CrossDotPattern } from "@workspace/ui";
import { FooterBrand } from "./footer/FooterBrand";
import { FooterNav } from "./footer/FooterNav";
import { SocialButtons } from "./footer/SocialButtons";
import { FooterBottom } from "./footer/FooterBottom";

// --- Data ---
const productLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Technology", href: "#tech-stack" },
  { label: "Pricing", href: "#pricing" },
];

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/askly", label: "Twitter" },
  { icon: Github, href: "https://github.com/askly", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/company/askly", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@ask ly.ai", label: "Email" },
];

// Ambient Background Component
const AmbientBackground = React.memo(() => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[120px] animate-pulse-slow" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[120px] animate-pulse-slow delay-700" />
    </div>
  );
});
AmbientBackground.displayName = "AmbientBackground";

/**
 * Footer - Main footer section
 * Refactored into smaller components for better maintainability
 */
export default function Footer() {
  // Scroll parallax effect for the container
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  return (
    <footer
      ref={containerRef}
      className="relative w-full overflow-hidden  text-gray-900 dark:text-white pt-24 pb-12"
    >
      <CrossDotPattern />
      <AmbientBackground />

      <motion.div
        style={{ y, opacity }}
        className="max-w-[1232px] mx-auto xl:px-0 md:px-12 px-6 lg:px-24 sm:px-12"
      >
        {/* Top Section: Brand & Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-8 border-b border-gray-200/50 dark:border-white/10 pb-10">
          {/* Brand Column */}
          <FooterBrand />

          {/* Navigation Column */}
          <FooterNav links={productLinks} />

          {/* Socials (Desktop position) - attached to brand */}
          <div className="lg:col-span-7">
            <SocialButtons socialLinks={socialLinks} className="hidden lg:flex gap-4 mt-12" />
          </div>

          {/* Mobile Socials - attached to nav */}
          <div className="lg:col-span-5">
            <SocialButtons socialLinks={socialLinks} className="flex lg:hidden gap-4 mt-12" />
          </div>
        </div>

        {/* Bottom Section: Legal & Credits */}
        <FooterBottom />
      </motion.div>
    </footer>
  );
}