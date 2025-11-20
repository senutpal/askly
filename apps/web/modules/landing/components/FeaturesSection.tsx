"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Globe,
  FileText,
  MessageSquare,
  Phone,
  Users,
  Zap,
} from "lucide-react";
import { CrossDotPattern } from "@workspace/ui/components/cross-dot-pattern";
import { FeaturesHeader } from "./features/FeaturesHeader";
import { FeatureGrid } from "./features/FeatureGrid";

// --- Data & Configuration ---
const features = [
  {
    id: 1,
    icon: Globe,
    title: "Global Linguistics",
    description:
      "Native-level understanding in Hindi, English, and regional dialects powered by adaptive LLMs.",
    color: "rgba(59, 130, 246, 1)", // Blue
  },
  {
    id: 2,
    icon: FileText,
    title: "Neural Knowledge",
    description:
      "Ingests circulars and PDFs into a factual RAG pipeline for precise, hallucination-free recall.",
    color: "rgba(16, 185, 129, 1)", // Emerald
  },
  {
    id: 3,
    icon: MessageSquare,
    title: "Fluid Widgets",
    description:
      "Zero-latency embeddable conversational interfaces that adapt to any host environment.",
    color: "rgba(249, 115, 22, 1)", // Orange
  },
  {
    id: 4,
    icon: Phone,
    title: "Voice Synthesis",
    description:
      "Natural, full-duplex voice conversations indistinguishable from human interaction.",
    color: "rgba(236, 72, 153, 1)", // Pink
  },
  {
    id: 5,
    icon: Users,
    title: "Human Handoff",
    description:
      "Context-aware escalation protocols ensuring seamless transitions to human operators.",
    color: "rgba(20, 184, 166, 1)", // Teal
  },
  {
    id: 6,
    icon: Zap,
    title: "Infinite Scale",
    description:
      "Serverless architecture designed to handle massive concurrent session loads effortlessly.",
    color: "rgba(234, 179, 8, 1)", // Yellow
  },
];

/**
 * FeaturesSection - Main features section with spotlight grid
 * Refactored into smaller components for better maintainability
 */
export default function EnterpriseFeatures() {
  return (
    <section className="relative w-full py-32 overflow-hidden selection:bg-zinc-200 selection:text-zinc-900 dark:selection:bg-zinc-800 dark:selection:text-white">
      <CrossDotPattern />
      
      {/* Subtle Background Noise/Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

      {/* Ambient Glow */}
      <div className="absolute top-20 left-2/3 -translate-x-1/2 w-[1000px] h-[700px] bg-indigo-500/10 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <FeaturesHeader />

        {/* Feature Grid */}
        <FeatureGrid features={features} />

        {/* Bottom CTA / Trust Marker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-16 flex items-center justify-between border-t border-border/40 pt-8"
        >
          <p className="text-sm text-muted-foreground font-mono">0.999% Uptime SLA</p>
          <p className="text-sm text-muted-foreground font-mono">SOC2 Compliant</p>
        </motion.div>
      </div>
    </section>
  );
}