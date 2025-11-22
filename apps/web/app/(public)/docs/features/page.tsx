"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Clock,
  Languages,
  Smartphone,
  BrainCircuit,
  Activity,
  Library,
  ArrowUpRight,
  BarChart3,
  Building2,
  Settings2,
  Zap,
  Palette,
  Code2,
  Server,
  ShieldCheck,
  GraduationCap,
  Cpu,
  ArrowRight
} from "lucide-react";
import { DocLayout } from "@/features/docs/components/DocLayout";

// --- Shared Components (Matching the Design System) ---

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
  <div className="flex items-center gap-3 mb-8">
    {Icon && <Icon className="w-5 h-5 text-zinc-400" />}
    <h2 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-white">
      {children}
    </h2>
  </div>
);

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  points 
}: { 
  title: string, 
  description: string, 
  icon: any, 
  points: string[] 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ y: -4 }}
    className="h-full p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 backdrop-blur-sm transition-all duration-300"
  >
    <div className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-5 shadow-sm">
      <Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
    </div>
    
    <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
      {description}
    </p>
    
    <ul className="space-y-3">
      {points.map((point, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const TechSpecItem = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => (
  <motion.div 
    whileHover={{ x: 4 }}
    className="group flex items-start gap-4 p-4 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900/50 transition-all duration-200"
  >
    <div className="mt-1 text-zinc-400 group-hover:text-blue-500 transition-colors">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
);

// --- Main Page Component ---

export default function FeaturesPage() {
  return (
    <DocLayout
      title="Platform Features"
      description="Explore the intelligent capabilities that power the Askly campus experience."
    >
      <div className="space-y-24 pb-10">
        
        {/* Student Experience Section */}
        <section>
          <SectionHeading icon={GraduationCap}>Student Experience</SectionHeading>
          <div className="grid gap-6 md:grid-cols-2">
            <FeatureCard
              title="24/7 Instant Support"
              description="Eliminate queue times. Askly provides immediate answers to student queries regardless of office hours or holidays."
              icon={Clock}
              points={[
                "Immediate responses to FAQs",
                "Available on weekends & holidays",
                "Zero waiting periods"
              ]}
            />
            <FeatureCard
              title="Multilingual Voice & Chat"
              description="Break language barriers with real-time translation and voice synthesis in English, Hindi, and regional languages."
              icon={Languages}
              points={[
                "Automatic language detection",
                "Real-time voice calls via Vapi",
                "Mixed-language (Hinglish) support"
              ]}
            />
            <FeatureCard
              title="Cross-Platform Access"
              description="A unified experience across all devices. Whether on a library desktop or a mobile phone on the go."
              icon={Smartphone}
              points={[
                "Responsive web widget",
                "Future WhatsApp integration",
                "Future Telegram support"
              ]}
            />
            <FeatureCard
              title="Context-Aware AI"
              description="Askly remembers the conversation flow, allowing for natural follow-up questions without repeating context."
              icon={BrainCircuit}
              points={[
                "Multi-turn conversation memory",
                "Natural follow-up handling",
                "Intelligent context retention"
              ]}
            />
          </div>
        </section>

        {/* Administrative Tools Section */}
        <section>
          <SectionHeading icon={ShieldCheck}>Administrative Control</SectionHeading>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Real-Time Dashboard"
              description="Monitor campus pulse with live conversation tracking and query volume metrics."
              icon={Activity}
              points={[
                "Live conversation monitoring",
                "Query volume trends",
                "Response accuracy metrics"
              ]}
            />
            <FeatureCard
              title="Knowledge Base"
              description="Ingest institutional data via PDFs and website crawling to ground AI responses in truth."
              icon={Library}
              points={[
                "PDF document processing",
                "Website content crawling",
                "RAG-powered retrieval"
              ]}
            />
            <FeatureCard
              title="Smart Escalation"
              description="Seamlessly hand off complex or sensitive queries to human staff with full context."
              icon={ArrowUpRight}
              points={[
                "Auto-escalation triggers",
                "Full history transfer",
                "Manual operator override"
              ]}
            />
            <FeatureCard
              title="Deep Analytics"
              description="Identify knowledge gaps and peak times to optimize administrative resources."
              icon={BarChart3}
              points={[
                "Most asked questions",
                "Peak usage analysis",
                "Satisfaction scoring"
              ]}
            />
            <FeatureCard
              title="Multi-Tenancy"
              description="Manage multiple campuses or departments with isolated data environments via Clerk."
              icon={Building2}
              points={[
                "Isolated workspaces",
                "Role-based access control",
                "Segregated knowledge bases"
              ]}
            />
            <FeatureCard
              title="Widget Studio"
              description="Customize the look and feel of the chat interface to match university branding."
              icon={Settings2}
              points={[
                "Custom greeting messages",
                "Brand color configuration",
                "Voice persona settings"
              ]}
            />
          </div>
        </section>

        {/* Technical Architecture Section */}
        <section>
          <SectionHeading icon={Cpu}>Technical Architecture</SectionHeading>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10 p-2">
            <div className="grid md:grid-cols-2 gap-2">
              <TechSpecItem 
                title="Real-Time Sync" 
                description="Powered by Convex Websockets for sub-millisecond message delivery without polling."
                icon={Zap}
              />
              <TechSpecItem 
                title="Modern Interface" 
                description="Built with Next.js 15, React 19, and Tailwind CSS for best-in-class performance."
                icon={Palette}
              />
              <TechSpecItem 
                title="Universal Embed" 
                description="Zero-config script tag deployment compatible with WordPress, Drupal, and React apps."
                icon={Code2}
              />
              <TechSpecItem 
                title="Serverless Scale" 
                description="Auto-scaling backend infrastructure handles thousands of concurrent student sessions."
                icon={Server}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                Ready to upgrade your campus?
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                Get started with Askly today and transform how your students interact with institutional knowledge.
              </p>
            </div>
            <Link href="/docs/quick-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
              >
                Start Integration
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </section>

      </div>
    </DocLayout>
  );
}