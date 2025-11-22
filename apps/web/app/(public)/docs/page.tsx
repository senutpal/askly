"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  Github,
  Command,
  Rocket,
} from "lucide-react";
import { cn } from "@workspace/ui";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import { documentationNavigation } from "./navigation";
import type { NavigationSection } from "./navigation";

const BentoCard = ({
  children,
  className,
  href,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  delay?: number;
}) => {
  const cardContent = (
    <>
      {/* Subtle Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-900/10" />

      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn("relative group h-full", className)}
    >
      {href ? (
        <Link
          href={href}
          className="block h-full w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 dark:border-white/10 dark:bg-[#111] dark:hover:shadow-blue-500/10"
        >
          {cardContent}
        </Link>
      ) : (
        <div className="block h-full w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 dark:border-white/10 dark:bg-[#111] dark:hover:shadow-blue-500/10">
          {cardContent}
        </div>
      )}
    </motion.div>
  );
};

const SectionLink = ({ section }: { section: NavigationSection }) => {
  return (
    <Link
      href={section.href}
      className="group/item flex items-center gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-zinc-100 dark:hover:bg-white/10"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition-colors group-hover/item:bg-blue-600 group-hover/item:text-white dark:bg-zinc-800 dark:text-white dark:group-hover/item:bg-blue-500">
        <section.icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {section.title}
        </span>
        <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          {section.description}
        </span>
      </div>
      <ArrowRight className="ml-auto h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100 text-blue-600 dark:text-blue-400" />
    </Link>
  );
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFD] text-zinc-900 selection:bg-blue-100 dark:bg-black dark:text-zinc-100 dark:selection:bg-blue-900/30">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/60 backdrop-blur-xl transition-all dark:border-white/10 dark:bg-[#050505]/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-2 z-50">
            <Image alt="Logo" height={25} width={25} src="/logo.svg" />
            <span className="text-xl font-bold tracking-tight">Askly</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="/docs" className="text-zinc-900 dark:text-zinc-100">
              Documentation
            </Link>
            <Link
              href="#"
              className="hover:text-zinc-900 transition-colors dark:hover:text-zinc-100"
            >
              API
            </Link>
            <Link
              href="#"
              className="hover:text-zinc-900 transition-colors dark:hover:text-zinc-100"
            >
              Changelog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-500 dark:border-white/10 dark:bg-white/5">
              <Command className="h-3 w-3" />
              <span>Search docs...</span>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-20">
        {/* Hero Section - Compact & Impactful */}
        <div className="mb-16 grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
              Documentation
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Everything you need to integrate Askly's intelligent multilingual
              chatbot. Streamline campus communication with our high-performance
              API.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/docs/quick-start"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-500/20 transition-all hover:scale-105 hover:bg-zinc-800 dark:bg-white dark:text-black dark:shadow-white/10"
              >
                Start Building <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/senutpal/askly"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-900 shadow-sm transition-all hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                <Github className="h-4 w-4" /> Star on GitHub
              </Link>
            </div>
          </motion.div>
        </div>

        {/* The Bento Grid Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
          {/* Primary Group: Getting Started (Spans 2 cols) */}
          <BentoCard
            className="md:col-span-2 lg:col-span-1 lg:row-span-2"
            delay={0.3}
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Rocket className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Getting Started</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
              The essentials to get Askly up and running. Follow these guides to
              authenticate and make your first API call.
            </p>
            <div className="space-y-1">
              {documentationNavigation[0]?.sections.map((section) => (
                <SectionLink key={section.href} section={section} />
              ))}
            </div>
          </BentoCard>

          {/* Secondary Groups */}
          {documentationNavigation.slice(1).map((group, idx) => (
            <BentoCard
              key={group.group}
              delay={0.3 + idx * 0.1}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4 dark:border-white/5">
                <h2 className="text-lg font-semibold">{group.group}</h2>
              </div>
              <div className="flex-1 space-y-1">
                {group.sections.map((section) => (
                  <SectionLink key={section.href} section={section} />
                ))}
              </div>
            </BentoCard>
          ))}
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="mt-20 border-t border-zinc-200 bg-white py-10 dark:border-white/5 dark:bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Askly Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
