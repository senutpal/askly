"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionTemplate,
  AnimatePresence,
  MotionValue,
} from "motion/react";
import {
  Globe,
  FileText,
  MessageSquare,
  Phone,
  Users,
  Zap,
  ArrowUpRight,
  LucideIcon,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import ShinyText from "@workspace/ui/components/shinytext";

// --- Data & Configuration ---
interface Feature {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
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

// --- Components ---

const GridLine = ({ vertical = false, index }: { vertical?: boolean, index?: number }) => {
  return (
    <div
      className={cn(
        "absolute bg-gradient-to-b from-transparent via-border/40 to-transparent",
        vertical
          ? "w-[1px] h-full left-0 top-0"
          : "h-[1px] w-full top-0 left-0"
      )}
    />
  );
};

interface FeatureCardProps {
  feature: Feature;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const FeatureCard = ({ feature, mouseX, mouseY }: FeatureCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col justify-between p-8 h-[280px] w-full border-r border-b border-border/30 bg-background/50 backdrop-blur-3xl dark:bg-black/20 hover:bg-background/80 transition-colors duration-500 overflow-hidden"
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${feature.color.replace("1)", "0.15)")},
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Spotlight Border Reveal */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
            background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${feature.color.replace("1)", "0.4)")},
              transparent 80%
            )
          `,
          maskImage: `linear-gradient(to bottom, transparent, transparent) padding-box, linear-gradient(to bottom, white, white) border-box`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div className={cn(
            "p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/20 shadow-sm backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          )}>
            <feature.icon 
              className="w-6 h-6 transition-colors duration-500" 
              style={{ color: feature.color }}
            />
          </div>
          <motion.div
             initial={{ opacity: 0, x: 10 }}
             whileHover={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.2 }}
          >
            <ArrowUpRight className="w-5 h-5 text-muted-foreground/50" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed font-medium tracking-wide">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
};
const CrossDotPattern = () => (
  <div className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_80%)]">
      {/* The Plus Grid */}
      <div className="absolute h-full w-full bg-[radial-gradient(#00000020_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#ffffff33_1px,transparent_1px)]" />
      
      {/* The Crosshairs Overlay - Adds the technical feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000008_1px,transparent_1px),linear-gradient(to_bottom,#0000008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>
);

export default function EnterpriseFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, amount: 0.5 });
  
  // Mouse tracking for the entire grid
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section className="relative w-full py-32 overflow-hidden selection:bg-zinc-200 selection:text-zinc-900 dark:selection:bg-zinc-800 dark:selection:text-white">
      <CrossDotPattern/>
      {/* Subtle Background Noise/Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      
      {/* Ambient Glow */}
      <div className="absolute top-20 left-2/3 -translate-x-1/2 w-[1000px] h-[700px] bg-indigo-500/10 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* --- Typography Header --- */}
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-24"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-foreground/30" />
            <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
              System Capabilities
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground mb-8 leading-[1.1]">
            Built for the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-violet-600 dark:from-indigo-300 dark:to-violet-500 animate-gradient">
              Intelligence Era.
            </span>
          </h2>
          <ShinyText 
                text="A unified cognitive architecture designed to handle the complexities of modern communication at enterprise scale." 
                disabled={false} 
                speed={5} 
                className='text-lg md:text-xl leading-relaxed max-w-2xl' 
              />
        </motion.div>

        {/* --- The Lattice Grid --- */}
        <div 
          className="relative group border-t border-l border-border/30 rounded-3xl overflow-hidden"
          onMouseMove={handleMouseMove}
          ref={containerRef}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative">
             {features.map((feature, i) => (
               <FeatureCard 
                 key={feature.id} 
                 feature={feature} 
                 mouseX={mouseX} 
                 mouseY={mouseY} 
               />
             ))}
          </div>
        </div>

        {/* --- Bottom CTA / Trust Marker --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-16 flex items-center justify-between border-t border-border/40 pt-8"
        >
           <p className="text-sm text-muted-foreground font-mono">
             0.999% Uptime SLA
           </p>
           <p className="text-sm text-muted-foreground font-mono">
             SOC2 Compliant
           </p>
        </motion.div>

      </div>
    </section>
  );
}