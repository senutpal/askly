"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Menu, X, ChevronRight } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { href: "#problem", label: "Problem" },
  { href: "#solution", label: "Solution" },
  { href: "#features", label: "Features" },
  { href: "/docs", label: "Docs" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY >= 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? " bg-background/80 backdrop-blur-md border-b border-border/40"
          : "bg-transparent "
      }`}
    >
      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-50">
            <Image alt="Logo" height={25} width={25} src="/logo.svg" />
            <span className="text-xl font-bold tracking-tight">Askly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline hover:underline-offset-4 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            <SignInButton mode="modal">
              <Button
                size="sm"
                className="bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                Sign in
              </Button>
            </SignInButton>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden gap-2 z-50">
            <ModeToggle />
            <button
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
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
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
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
    </nav>
  );
}