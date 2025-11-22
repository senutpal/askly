"use client";

import React from "react";
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
  Code2,
  Share2,
  Lock,
  FileText,
  Search,
  Zap,
  ArrowRightLeft
} from "lucide-react";
import { DocLayout } from "../DocLayout";
import { SectionHeading } from "../shared/SectionHeading";
import { EnhancedCodeBlock } from "../shared/EnhancedCodeBlock";
import { StepItem } from "../shared/StepItem";
import { ComponentCard } from "../shared/ComponentCard";
import { TechStackCard } from "../shared/TechStackCard";

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

export const ArchitectureView = () => {
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
                  <div className="w-4 h-4 text-green-500">✓</div> Isolated knowledge bases
                </li>
                <li className="flex gap-2">
                  <div className="w-4 h-4 text-green-500">✓</div> Separate analytics pipelines
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
                  <div className="w-4 h-4 text-green-500">✓</div> Zod schema validation
                </li>
                <li className="flex gap-2">
                  <div className="w-4 h-4 text-green-500">✓</div> Row-level security policies
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
