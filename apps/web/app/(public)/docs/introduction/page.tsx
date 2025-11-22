"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  Globe, 
  BrainCircuit, 
  Mic, 
  ArrowUpRight, 
  Languages, 
  FileText, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  BarChart3, 
  Zap,
  Server,
  LayoutTemplate,
  Workflow,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { DocLayout } from "@/features/docs/components/DocLayout";

// --- Shared Components (Matching the Design System) ---

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
  <div className="flex items-center gap-3 mb-6">
    {Icon && <Icon className="w-5 h-5 text-zinc-400" />}
    <h2 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-white">
      {children}
    </h2>
  </div>
);

const InfoCard = ({ title, description, icon: Icon, delay = 0 }: { title: string, description: string, icon: any, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-6 rounded-2xl border  bg-white dark:bg-zinc-900/20 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
  >
    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-900 dark:text-white">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
  </motion.div>
);

const ProblemCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="flex gap-4 p-5 rounded-xl border border-red-100 bg-red-50/30 dark:bg-red-400/10 dark:border-red-900/30 transition-all"
  >
    <div className="shrink-0 mt-1">
      <Icon className="w-5 h-5 text-red-500/80 dark:text-red-400" />
    </div>
    <div>
      <h4 className="font-medium text-zinc-900 dark:text-zinc-200 text-sm mb-1">{title}</h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const TechStackItem = ({ category, items }: { category: string, items: string[] }) => (
  <div className="p-5 rounded-xl border  bg-zinc-50/50 dark:bg-zinc-900/20">
    <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-3 uppercase tracking-wider opacity-80">{category}</h4>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="w-1 h-1 rounded-full bg-blue-500" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

// --- Main Page Component ---

export default function IntroductionPage() {
  return (
    <DocLayout
      title="Introduction to Askly"
      description="Learn what Askly is and how it transforms campus communication through AI."
    >
      <div className="space-y-20 pb-10">

        {/* Hero / Definition */}
        <section>
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-zinc-50 to-white p-8  dark:from-zinc-900/50 dark:to-zinc-950"
          >
            <div className="relative z-10">
             
              <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                Askly is an open-source conversational platform engineered to eliminate language barriers in education. 
                It combines <strong className="text-zinc-900 dark:text-zinc-200">RAG technology</strong>, <strong className="text-zinc-900 dark:text-zinc-200">Voice AI</strong>, and <strong className="text-zinc-900 dark:text-zinc-200">Next.js 15</strong> to provide 24/7 automated support capable of handling thousands of concurrent student queries.
              </p>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/20" />
          </motion.div>
        </section>

        {/* The Problem Section */}
        <section>
          <SectionHeading icon={FileText}>The Challenge</SectionHeading>
          <div className="grid md:grid-cols-2 gap-4">
            <ProblemCard 
              icon={Languages}
              title="Language Barriers"
              description="Most institutional systems only support English, creating accessibility gaps for students comfortable in regional dialects."
            />
            <ProblemCard 
              icon={FileText}
              title="Information Silos"
              description="Critical data is locked inside PDFs and circulars, making it difficult for students to find specific answers quickly."
            />
            <ProblemCard 
              icon={MessageCircle}
              title="Repetitive Strain"
              description="Administrative staff spend hours answering the same FAQ questions daily, leading to operational bottlenecks."
            />
            <ProblemCard 
              icon={Clock}
              title="Limited Availability"
              description="Student queries don't stop at 5 PM, but campus offices do. This creates long turnaround times for simple answers."
            />
          </div>
        </section>

        {/* The Solution Section */}
        <section>
          <SectionHeading icon={Sparkles}>The Solution</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <InfoCard 
              title="Multilingual Intelligence"
              description="Instant translation and response in Hindi, Tamil, Telugu, and more. Students speak naturally; Askly understands perfectly."
              icon={Globe}
              delay={0.1}
            />
            <InfoCard 
              title="Context-Aware RAG"
              description="Powered by Convex vector search, Askly retrieves precise answers from your uploaded documents, circulars, and guidelines."
              icon={BrainCircuit}
              delay={0.2}
            />
            <InfoCard 
              title="Voice & Text Interface"
              description="Seamless Vapi integration allows for real-time voice conversations, making support accessible to visually impaired users."
              icon={Mic}
              delay={0.3}
            />
            <InfoCard 
              title="Smart Escalation"
              description="When queries get too complex, the AI gracefully hands off the conversation context to human staff members."
              icon={ArrowUpRight}
              delay={0.4}
            />
          </div>

          {/* Impact Highlight */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 p-6 rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-900/10"
          >
            <div className="shrink-0 p-3 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-emerald-900 dark:text-emerald-400 font-medium">Measurable Impact</h4>
              <p className="text-emerald-800/80 dark:text-emerald-400/80 text-sm mt-1">
                Deployments show a <strong>70% reduction</strong> in repetitive front-desk queries, allowing staff to focus on complex student counseling.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Core Capabilities Grid */}
        <section>
          <SectionHeading icon={Zap}>Core Capabilities</SectionHeading>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Languages, label: "Auto-Translation", desc: "Native language detection" },
              { icon: BrainCircuit, label: "Conversation Memory", desc: "Multi-turn context retention" },
              { icon: Server, label: "Knowledge Integration", desc: "PDF, Docx, & Web sources" },
              { icon: Mic, label: "Voice Calls", desc: "Real-time audio processing" },
              { icon: BarChart3, label: "Analytics", desc: "Usage & query insights" },
              { icon: ShieldCheck, label: "Enterprise Security", desc: "Clerk Auth & Encryption" },
            ].map((feature, idx) => (
              <div key={idx} className="group p-4 rounded-lg border  bg-white dark:bg-zinc-900/20  flex items-start gap-3">
                <feature.icon className="w-5 h-5 text-zinc-400 group-hover:text-blue-500 transition-colors mt-0.5" />
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-white text-sm">{feature.label}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <SectionHeading icon={Workflow}>Modern Architecture</SectionHeading>
          <div className="grid md:grid-cols-3 gap-6">
            <TechStackItem 
              category="Frontend"
              items={["Next.js 15 (React 19)", "Tailwind CSS", "Framer Motion", "Shadcn/UI"]}
            />
            <TechStackItem 
              category="Backend & AI"
              items={["Convex (Serverless)", "OpenAI / Gemini / Claude", "Vapi Voice AI", "LangChain"]}
            />
            <TechStackItem 
              category="DevOps"
              items={["Turborepo Monorepo", "pnpm 10.4.1", "Vercel Deployment", "GitHub Actions"]}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 pt-10 border-t ">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-2xl border ">
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Ready to deploy?</h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                Jump straight into the installation guide to set up Askly on your local machine in under 5 minutes.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Link 
                href="/docs/features"
                className="flex-1 md:flex-none inline-flex items-center justify-center px-6 py-2.5 rounded-lg border  bg-white text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 transition-colors font-medium text-sm"
              >
                <LayoutTemplate className="w-4 h-4 mr-2" />
                Explore Features
              </Link>
              <Link 
                href="/docs/quick-start"
                className="flex-1 md:flex-none inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors font-medium text-sm"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </DocLayout>
  );
}