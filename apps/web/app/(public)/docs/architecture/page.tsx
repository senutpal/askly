"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Layers,
  Server,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Database,
  Cpu,
  ShieldCheck,
  Workflow,
  Check,
  Copy,
  Zap,
  Code2,
  Lock,
  Share2,
  FileText,
  Search,
  ArrowRightLeft
} from "lucide-react";
import { DocLayout } from "@/features/docs/components/DocLayout";



const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
  <div className="flex items-center gap-3 mb-6">
    {Icon && <Icon className="w-5 h-5 text-zinc-400" />}
    <h2 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-white">
      {children}
    </h2>
  </div>
);

const EnhancedCodeBlock = ({ code, filename }: { code: string; filename?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl bg-[#0D0D0D] border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        {filename && <span className="text-xs font-mono text-zinc-500">{filename}</span>}
      </div>
      <div className="relative p-6 overflow-x-auto">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed text-zinc-300">
          <code>{code}</code>
        </pre>
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-14 right-4 p-2 rounded-md bg-white/5 text-zinc-400 opacity-0 transition-all duration-200 hover:bg-white/10 hover:text-white group-hover:opacity-100 focus:opacity-100"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

const StepItem = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative pl-12 pb-12 border-l border-zinc-200 dark:border-zinc-800 last:pb-0 last:border-l-0"
    >
      <div className="absolute -left-[17px] top-0 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-mono font-medium text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
        {number}
      </div>
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
      <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
};

const TechStackCard = ({ title, items }: { title: string; items: { label: string; desc: string }[] }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 backdrop-blur-sm transition-all duration-300"
  >
    <h4 className="font-medium text-zinc-900 dark:text-white mb-4">{title}</h4>
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              {item.label}
            </span>
            <span className="text-xs opacity-70">{item.desc}</span>
          </div>
        </li>
      ))}
    </ul>
  </motion.div>
);

const ComponentCard = ({ title, desc, icon: Icon, items }: { title: string, desc: string, icon: any, items: string[] }) => (
  <div className="p-6 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900/40 dark:border-zinc-800">
    <Icon className="w-6 h-6 mb-4 text-zinc-500 dark:text-zinc-400" />
    <h4 className="font-medium text-zinc-900 dark:text-white mb-2">{title}</h4>
    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
      {desc}
    </p>
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
          <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          {item}
        </div>
      ))}
    </div>
  </div>
);

// --- ASCII Diagram Content ---
const asciiDiagram = `┌─────────────────────────────────────────────────────────────┐
│                    User's Website                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Embed Script (Vite)                          │   │
│  │  • Single script tag integration                     │   │
│  │  • Loads widget in iframe                            │   │
│  └────────────────┬─────────────────────────────────────┘   │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    ├─────────────────────────┐
                    ▼                         ▼
          ┌─────────────────┐       ┌─────────────────┐
          │  Widget App     │       │  Web Dashboard  │
          │  (Next.js)      │       │  (Next.js)      │
          ├─────────────────┤       ├─────────────────┤
          │ • Chat UI       │       │ • Admin Panel   │
          │ • Voice calls   │       │ • Sessions      │
          └────────┬────────┘       └────────┬────────┘
                   │                         │
                   └────────┬────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Convex Backend  │
                  │  (Serverless)    │
                  └────────┬─────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   Gemini    │ │    Vapi     │ │   Clerk     │
    │     AI      │ │   (Voice)   │ │   (Auth)    │
    └─────────────┘ └─────────────┘ └─────────────┘`;

// --- Main Page Component ---

export default function ArchitecturePage() {
  return (
    <DocLayout
      title="Architecture"
      description="Deep dive into the technical design, data flow, and component structure of the Askly platform."
    >
      <div className="space-y-24">

        {/* High Level Overview */}
        <section>
          <SectionHeading icon={Layers}>High-Level Overview</SectionHeading>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            Askly is engineered as a modern, scalable monorepo comprising three distinct applications 
            unified by a serverless backend. The architecture prioritizes type safety, 
            real-time performance, and strict separation of concerns.
          </p>
          <EnhancedCodeBlock code={asciiDiagram} filename="system-architecture.txt" />
        </section>

        {/* Core Components Grid */}
        <section>
          <SectionHeading icon={Code2}>Core Components</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6">
            <ComponentCard 
              title="Embed Script"
              desc="Lightweight Vite build that injects the widget via iframe. Handles parent-window communication and configuration."
              icon={Globe}
              items={["apps/embed", "~10KB gzipped", "Zero-dependency"]}
            />
            <ComponentCard 
              title="Widget App"
              desc="The consumer-facing chat interface loaded inside the iframe. Optimized for high interactivity and streaming responses."
              icon={MessageSquare}
              items={["apps/widget", "Next.js App Router", "Vapi Voice Integration"]}
            />
            <ComponentCard 
              title="Web Dashboard"
              desc="Administrative interface for managing organizations, knowledge bases, and monitoring conversations."
              icon={LayoutDashboard}
              items={["apps/web", "Recharts Analytics", "Settings Management"]}
            />
            <ComponentCard 
              title="Convex Backend"
              desc="Serverless backend handling database operations, vector search, and third-party API orchestration."
              icon={Server}
              items={["packages/backend", "Real-time Database", "Vector Search"]}
            />
          </div>
        </section>

        {/* Data Flow Timeline */}
        <section>
          <SectionHeading icon={ArrowRightLeft}>Data Flow Lifecycle</SectionHeading>
          <div className="mt-8">
            <StepItem number="01" title="User Interaction">
              <p>
                The user types a message in the Widget interface. The client performs an optimistic update 
                to show the message immediately while sending a mutation to the Convex backend.
              </p>
            </StepItem>

            <StepItem number="02" title="Context Retrieval (RAG)">
              <p>
                The backend receives the message and generates a vector embedding. It performs a cosine similarity 
                search against the stored knowledge base chunks to retrieve relevant institutional context.
              </p>
            </StepItem>

            <StepItem number="03" title="AI Generation">
              <p>
                The retrieved context, along with conversation history, is injected into the system prompt. 
                This payload is sent to Google Gemini to generate a response grounded in the provided data.
              </p>
            </StepItem>

            <StepItem number="04" title="Real-time Sync">
              <p>
                The AI response is streamed back to Convex, which pushes updates to the Widget via WebSockets. 
                Simultaneously, the Dashboard receives these updates via reactive queries, allowing admins 
                to monitor the chat in real-time.
              </p>
            </StepItem>
          </div>
        </section>

        {/* RAG System Breakdown */}
        <section>
          <SectionHeading icon={Database}>RAG System Internals</SectionHeading>
          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1">
            <div className="grid divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 md:grid-cols-3">
              <div className="p-6">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="font-medium mb-2">Ingestion</h4>
                <p className="text-sm text-zinc-500">
                  PDFs and text documents are parsed, cleaned, and split into semantic chunks.
                </p>
              </div>
              <div className="p-6">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
                  <Search className="w-4 h-4" />
                </div>
                <h4 className="font-medium mb-2">Indexing</h4>
                <p className="text-sm text-zinc-500">
                  Chunks are converted to vector embeddings and stored in Convex's vector database.
                </p>
              </div>
              <div className="p-6">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-medium mb-2">Retrieval</h4>
                <p className="text-sm text-zinc-500">
                  Queries trigger vector searches to find the most relevant chunks for context injection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <SectionHeading icon={Cpu}>Technology Stack</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6">
            <TechStackCard 
              title="Frontend"
              items={[
                { label: "Next.js 15", desc: "App Router framework" },
                { label: "React 19", desc: "UI library" },
                { label: "Tailwind CSS 4", desc: "Styling engine" },
                { label: "Jotai", desc: "Atomic state management" }
              ]}
            />
            <TechStackCard 
              title="Backend & AI"
              items={[
                { label: "Convex", desc: "Serverless backend & database" },
                { label: "Google Gemini", desc: "Large Language Model" },
                { label: "Vapi", desc: "Voice AI infrastructure" },
                { label: "Clerk", desc: "Authentication & User Management" }
              ]}
            />
          </div>
        </section>

        {/* Multi-Tenancy & Security */}
        <section>
          <SectionHeading icon={ShieldCheck}>Security & Isolation</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-zinc-900 dark:text-white" />
                <h4 className="font-medium text-zinc-900 dark:text-white">Multi-Tenancy</h4>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                Data isolation is enforced at the database query level. Every operation requires an 
                Organization ID, ensuring complete separation of data between different campuses.
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-500" /> Isolated knowledge bases
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-500" /> Separate analytics pipelines
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-zinc-900 dark:text-white" />
                <h4 className="font-medium text-zinc-900 dark:text-white">Security Standards</h4>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                All communications are encrypted via TLS. Authentication is handled via Clerk JWTs, 
                and sensitive configuration is encrypted at rest using AES-256-GCM.
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-500" /> Zod schema validation
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-500" /> Row-level security policies
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Scalability Note */}
        <div className="p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
          <div className="flex gap-4">
            <Workflow className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Designed for Scale</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                The architecture leverages Edge functions for low-latency responses and serverless databases 
                that auto-scale with demand. Static assets are distributed via global CDNs, ensuring 
                fast load times regardless of user location.
              </p>
            </div>
          </div>
        </div>

      </div>
    </DocLayout>
  );
}