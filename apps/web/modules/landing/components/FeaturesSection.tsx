"use client";

import { easeOut, motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Globe,
  FileText,
  MessageSquare,
  Phone,
  Users,
  Zap,
} from "lucide-react";
import { GlowingEffect } from "@workspace/ui/components/glowing-effect";
import { Badge } from "@workspace/ui/components/badge";
import ShinyText from "@workspace/ui/components/shinytext";
import { cn } from "@workspace/ui/lib/utils";

// Feature data
const features = [
  {
    icon: <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    title: "Language Diversity",
    description:
      "Understand and respond in Hindi, English, and regional languages — powered by intelligent language models.",
    accent: "from-blue-500/20 to-blue-300/10",
  },
  {
    icon: <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />,
    title: "Knowledge Integration",
    description:
      "Ingest FAQs, circulars, and PDFs automatically. Retrieve precise answers with factual RAG pipelines.",
    accent: "from-green-500/20 to-green-300/10",
  },
  {
    icon: (
      <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
    ),
    title: "Smart Widget System",
    description:
      "Embed lightweight conversational widgets into any site with a single line of code.",
    accent: "from-orange-500/20 to-orange-300/10",
  },
  {
    icon: <Phone className="w-5 h-5 text-pink-600 dark:text-pink-400" />,
    title: "Voice Support",
    description:
      "Enable natural, voice-based conversations in any language — accessible across all devices.",
    accent: "from-pink-500/20 to-pink-300/10",
  },
  {
    icon: <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    title: "Fallback Mechanisms",
    description:
      "Seamlessly hand over chats to human operators with preserved conversation context.",
    accent: "from-teal-500/20 to-teal-300/10",
  },
  {
    icon: <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
    title: "24/7 Availability",
    description:
      "Always-on infrastructure handling thousands of concurrent sessions efficiently.",
    accent: "from-yellow-500/20 to-yellow-300/10",
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Animation for container and cards
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut, staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <section id="features" ref={ref} className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* --- Header --- */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-20 space-y-6"
        >
          <Badge variant="secondary" className="px-4 py-1">
            Features
          </Badge>

          <h2 className="text-4xl md:text-6xl font-bold font-sans-alt  dark:from-white dark:to-gray-400 bg-gradient-to-b from-gray-500 to-gray-900 text-transparent bg-clip-text">
            Powering the{" "}
            <span className=" bg-gradient-to-b from-violet-500 to-violet-600 text-transparent bg-clip-text inline-block">
              Future of Communication
            </span>
          </h2>

          <ShinyText
            text="An adaptive AI platform built for seamless, multilingual, and voice-enabled experiences — always learning, always available."
            className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground"
            disabled={false}
            speed={8}
          />
        </motion.div>

        {/* --- Features Grid --- */}
        <motion.ul
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.li
              key={feature.title}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="relative list-none"
            >
              {/* Outer glow frame */}
              <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border/50 p-2 md:rounded-[1.5rem] md:p-3">
                <GlowingEffect
                  spread={40}
                  glow
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.02}
                  borderWidth={3}
                />
                {/* Actual Card */}
                <div
                  className={cn(
                    "relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-gradient-to-b p-8 shadow-sm backdrop-blur-xl transition-transform duration-500",
                    feature.accent
                  )}
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-background/80 dark:bg-gray-900/60 border border-border flex items-center justify-center shadow-inner">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground font-sans-alt">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Background Glow Accent */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_60%)]" />
    </section>
  );
}
