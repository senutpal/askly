"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Terminal, 
  Check, 
  Copy, 
  ChevronRight, 
  Database, 
  Key, 
  Cpu, 
  Mic, 
  Layout, 
  MessageSquare, 
  Code2, 
  Rocket,
  Server,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { codeExamples } from "@/features/docs/config/content";
import { cn } from "@workspace/ui";
import { DocLayout } from "@/features/docs";


const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
  <div className="flex items-center gap-3 mb-6">
    {Icon && <Icon className="w-5 h-5 text-zinc-400" />}
    <h2 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-white">
      {children}
    </h2>
  </div>
);

const EnhancedCodeBlock = ({ code, language = "bash", filename }: { code: string, language?: string, filename?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl bg-[#0D0D0D] border border-white/10 shadow-2xl">
      {/* macOS-style Window Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        {filename && <span className="text-xs font-mono text-zinc-500">{filename}</span>}
      </div>

      <div className="relative p-6 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed text-zinc-300">
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

const StepItem = ({ number, title, children }: { number: string, title: string, children: React.ReactNode }) => {
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

const PrerequisiteCard = ({ title, icon: Icon, items }: { title: string, icon: any, items: { label: string, sub?: string, href?: string }[] }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 backdrop-blur-sm transition-all duration-300"
  >
    <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
      <Icon className="w-5 h-5" />
      <h4 className="font-medium">{title}</h4>
    </div>
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium text-zinc-900 dark:text-zinc-200">
              {item.label}
              {item.href && (
                <a href={item.href} target="_blank" rel="noopener" className="ml-1 text-blue-600 hover:underline dark:text-blue-400">↗</a>
              )}
            </span>
            {item.sub && <span className="text-xs opacity-70">{item.sub}</span>}
          </div>
        </li>
      ))}
    </ul>
  </motion.div>
);

const ActionCard = ({ title, desc, href, icon: Icon }: { title: string, desc: string, href: string, icon: any }) => (
  <Link href={href} className="block group">
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="h-full p-6 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900/40 dark:border-zinc-800 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
    >
      <Icon className="w-6 h-6 mb-4 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
      <h4 className="font-medium text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
        {title}
        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{desc}</p>
    </motion.div>
  </Link>
);


export default function GettingStartedPage() {
  return (
    <DocLayout
title="Quick Start"
description="Get your AI-powered campus assistant running locally in under 5 minutes. Follow this guide to set up your development environment"
>
        <div className="space-y-24">
          
          {/* Prerequisites Grid */}
          <section>
            <SectionHeading icon={Terminal}>System Requirements</SectionHeading>
            <div className="grid md:grid-cols-2 gap-6">
              <PrerequisiteCard 
                title="Environment"
                icon={Cpu}
                items={[
                  { label: "Node.js", sub: "Version 20.0.0 or higher", href: "https://nodejs.org" },
                  { label: "pnpm", sub: "Version 10.4.1+ (Preferred)", href: "https://pnpm.io" },
                  { label: "Git", sub: "Latest version", href: "https://git-scm.com" },
                ]}
              />
              <PrerequisiteCard 
                title="Services & Keys"
                icon={Key}
                items={[
                  { label: "Clerk", sub: "Authentication provider", href: "https://clerk.com" },
                  { label: "Convex", sub: "Real-time backend", href: "https://convex.dev" },
                  { label: "Vapi & Gemini", sub: "Voice & LLM Intelligence" },
                ]}
              />
            </div>
          </section>

          {/* Installation Steps - Vertical Timeline */}
          <section>
            <SectionHeading icon={Code2}>Installation</SectionHeading>
            <div className="mt-8">
              
              <StepItem number="01" title="Clone Repository">
                <p className="mb-4">
                  Start by cloning the monorepo to your local machine. 
                  
                </p>
                <EnhancedCodeBlock code={codeExamples.installCommands.clone} />
              </StepItem>

              <StepItem number="02" title="Install Dependencies">
                <p className="mb-4">
                  We use <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">pnpm</code> for workspace management. This will install packages across all applications.
                </p>
                <EnhancedCodeBlock code={codeExamples.installCommands.install} />
                <div className="mt-4 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">First installation may take a moment to cache dependencies.</p>
                </div>
              </StepItem>

              <StepItem number="03" title="Initialize Backend">
                <p className="mb-4">
                  Spin up your Convex deployment. This automatically generates your database schema and creates the necessary <code className="text-xs">.env</code> configurations.
                </p>
                <EnhancedCodeBlock code={codeExamples.installCommands.setupBackend} />
              </StepItem>

              <StepItem number="04" title="Environment Variables">
                <p className="mb-4">
                  Critical step. Create <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">.env.local</code> files in each application package.
                  Refer to the <Link href="/docs/setup" className="underline underline-offset-4 decoration-zinc-400 hover:decoration-blue-500 transition-colors">Configuration Guide</Link> for the complete list of keys.
                </p>
              </StepItem>

              <StepItem number="05" title="Launch Development Server">
                <p className="mb-4">
                  Start the turbo pipeline. This boots up the Dashboard, Widget, and Embed script simultaneously.
                </p>
                <EnhancedCodeBlock code={codeExamples.installCommands.dev} />
                
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: "Dashboard", port: "3000" },
                    { name: "Chat Widget", port: "3001" },
                    { name: "Embed Script", port: "3002" },
                  ].map((service) => (
                    <div key={service.port} className="flex items-center justify-between p-3 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                      <span className="text-sm font-medium">{service.name}</span>
                      <span className="text-xs font-mono text-zinc-500">:{service.port}</span>
                    </div>
                  ))}
                </div>
              </StepItem>

            </div>
          </section>

          {/* Verification Section */}
          <section>
            <SectionHeading icon={CheckCircle2}>Verify Integrity</SectionHeading>
            <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1">
              <div className="grid divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 md:grid-cols-3">
                <div className="p-6">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4">1</div>
                  <h4 className="font-medium mb-2">Access Dashboard</h4>
                  <p className="text-sm text-zinc-500">Visit localhost:3000. You should see the landing page.</p>
                </div>
                <div className="p-6">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4">2</div>
                  <h4 className="font-medium mb-2">Create Organization</h4>
                  <p className="text-sm text-zinc-500">Complete the onboarding flow to set up your workspace.</p>
                </div>
                <div className="p-6">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4">3</div>
                  <h4 className="font-medium mb-2">Test Chat</h4>
                  <p className="text-sm text-zinc-500">Ensure the AI responds in the preview window.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Next Steps Cards */}
          <section>
            <SectionHeading icon={Rocket}>Next Steps</SectionHeading>
            <div className="grid md:grid-cols-2 gap-4">
              <ActionCard 
                title="Customization" 
                desc="Configure brand colors, greetings, and widget behavior."
                href="/docs/customization"
                icon={Layout}
              />
              <ActionCard 
                title="Knowledge Base" 
                desc="Upload PDFs and text to train your specific AI model."
                href="/docs/usage-guide"
                icon={Database}
              />
              <ActionCard 
                title="Embed Widget" 
                desc="Get the script tag to drop Askly into your main site."
                href="/docs/integration"
                icon={Code2}
              />
              <ActionCard 
                title="Deployment" 
                desc="Best practices for deploying to Vercel or Netlify."
                href="/docs/deployment"
                icon={Server}
              />
            </div>
          </section>

          {/* Footer Help */}
          <div className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-sm text-zinc-500">
            <p>Stuck? We're here to help.</p>
            <Link href="/docs/troubleshooting" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
              Troubleshooting Guide
            </Link>
          </div>

        </div>
      </DocLayout>
  );
}