"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@workspace/ui/components/button";
import { ChevronRight } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  links: NavLink[];
  onClose: () => void;
}

/**
 * MobileMenu - Full-screen mobile navigation menu
 * Animated overlay with navigation links and auth
 */
export const MobileMenu = React.memo<MobileMenuProps>(({ isOpen, links, onClose }) => {
  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-40 min-h-screen bg-background md:hidden flex flex-col"
        >
          {/* Decorative Background Gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-6 pt-28 pb-10 flex flex-col h-full justify-between">
            {/* Navigation Links Group */}
            <div className="flex flex-col space-y-6">
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className="group flex items-center justify-between text-3xl font-semibold text-foreground/80 hover:text-primary transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                  </Link>
                  {/* Subtle separator line */}
                  <div className="h-px w-full bg-border/30 mt-4" />
                </motion.div>
              ))}
            </div>

            {/* Footer Section (Auth & Extra Info) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex flex-col space-y-6"
            >
              <SignInButton mode="modal">
                <Button className="w-full h-12 text-lg font-medium rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all ">
                  Sign In
                </Button>
              </SignInButton>

              <p className="text-center text-xs text-muted-foreground pt-4">
                © 2024 Askly Inc. All rights reserved.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileMenu.displayName = "MobileMenu";
