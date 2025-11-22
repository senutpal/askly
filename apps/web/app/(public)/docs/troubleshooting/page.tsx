"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Terminal,
  Check,
  Copy,
  ChevronRight,
  AlertCircle,
  Server,
  Globe,
  Settings,
  ShieldAlert,
  Bug,
  HelpCircle,
  Search,
  FileWarning,
  RefreshCw
} from "lucide-react";
import { DocLayout } from "@/features/docs/components/DocLayout"; // Adjust import path as needed

// --- Reusable Design Components ---

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
    <div className="group relative my-4 overflow-hidden rounded-xl bg-[#0D0D0D] border border-white/10 shadow-lg">
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

const SolutionCard = ({ 
  title, 
  children, 
  severity = "default" 
}: { 
  title: string; 
  children: React.ReactNode; 
  severity?: "default" | "warning" 
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`p-6 rounded-2xl border transition-all duration-300 ${
      severity === "warning" 
        ? "border-orange-200 bg-orange-50/30 dark:border-orange-900/30 dark:bg-orange-900/10" 
        : "border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800"
    }`}
  >
    <div className="flex items-center gap-2 mb-4">
      {severity === "warning" ? (
        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
      ) : (
        <ShieldAlert className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      )}
      <h4 className="font-medium text-zinc-900 dark:text-white">{title}</h4>
    </div>
    <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-3">
      {children}
    </div>
  </motion.div>
);

const ChecklistItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0" />
    <span className="leading-relaxed">{children}</span>
  </div>
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

// --- Main Page Component ---

export default function TroubleshootingPage() {
  return (
    <DocLayout
      title="Troubleshooting"
      description="Diagnose and resolve common issues encountered during installation, configuration, and deployment."
    >
      <div className="space-y-24">
        
        {/* Installation Section */}
        <section>
          <SectionHeading icon={Terminal}>Installation Issues</SectionHeading>
          <div className="grid md:grid-cols-1 gap-6">
            <SolutionCard title="pnpm command not found">
              <p className="mb-2">The system cannot locate the package manager.</p>
              <EnhancedCodeBlock code="npm install -g pnpm" />
            </SolutionCard>

            <SolutionCard title="Node version mismatch" severity="warning">
              <p className="mb-2">
                This project requires Node.js <span className="font-mono font-medium text-zinc-900 dark:text-zinc-200">v20.0.0</span> or higher.
              </p>
              <EnhancedCodeBlock code="nvm install 20&#10;nvm use 20" />
            </SolutionCard>
          </div>
        </section>

        {/* Environment Section */}
        <section>
          <SectionHeading icon={Settings}>Environment Configuration</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6">
            <SolutionCard title="Missing Convex URL">
              <p className="mb-4 leading-relaxed">
                The application cannot connect to the backend. Ensure the variable is defined in your local environment file.
              </p>
              <div className="p-3 rounded bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
                NEXT_PUBLIC_CONVEX_URL=...
              </div>
              <p className="mt-4 text-xs italic opacity-70">Restart the dev server after changing .env files.</p>
            </SolutionCard>

            <SolutionCard title="Clerk Auth Failed">
              <p className="mb-4 leading-relaxed">
                Authentication errors usually stem from mismatched API keys or incorrect callback configurations.
              </p>
              <div className="space-y-2">
                <ChecklistItem>Verify keys match Clerk dashboard</ChecklistItem>
                <ChecklistItem>Check allowed callback URLs</ChecklistItem>
              </div>
            </SolutionCard>
          </div>
        </section>

        {/* Widget Section */}
        <section>
          <SectionHeading icon={Bug}>Widget Behavior</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6">
            <SolutionCard title="Widget Not Appearing">
              <div className="space-y-2 mt-2">
                <ChecklistItem>Check browser console for red errors</ChecklistItem>
                <ChecklistItem>Verify Organization ID is correct</ChecklistItem>
                <ChecklistItem>Clear browser cache and local storage</ChecklistItem>
              </div>
            </SolutionCard>

            <SolutionCard title="Messages Not Sending">
              <div className="space-y-2 mt-2">
                <ChecklistItem>Verify Convex backend is running</ChecklistItem>
                <ChecklistItem>Check <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">NEXT_PUBLIC_CONVEX_URL</code></ChecklistItem>
                <ChecklistItem>Review network tab for 500/404 errors</ChecklistItem>
              </div>
            </SolutionCard>
          </div>
        </section>

        {/* Build Section */}
        <section>
          <SectionHeading icon={Server}>Build & Deploy</SectionHeading>
          <div className="space-y-6">
            <SolutionCard title="TypeScript Errors">
              <p className="mb-2">Run the type checker locally before pushing to catch inconsistencies.</p>
              <EnhancedCodeBlock code="pnpm typecheck&#10;pnpm build" />
            </SolutionCard>

            <SolutionCard title="Vercel Deployment Failed">
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <ChecklistItem>Check Environment Variables in Vercel Settings</ChecklistItem>
                <ChecklistItem>Verify Build Command is <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">pnpm build</code></ChecklistItem>
                <ChecklistItem>Check Root Directory configuration</ChecklistItem>
                <ChecklistItem>Review Build Logs for specific error stacks</ChecklistItem>
              </div>
            </SolutionCard>
          </div>
        </section>

        {/* Help Section */}
        <section>
          <SectionHeading icon={HelpCircle}>Need More Help?</SectionHeading>
          <div className="grid md:grid-cols-2 gap-4">
            <ActionCard 
              title="GitHub Issues" 
              desc="Search existing issues or report a new bug to the maintainers."
              href="https://github.com/senutpal/askly/issues"
              icon={FileWarning}
            />
            <ActionCard 
              title="Browser Console" 
              desc="Check F12 Developer Tools for specific error messages."
              href="#"
              icon={Search}
            />
          </div>
          <div className="mt-6 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3">
             <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
             <p className="text-sm text-blue-700 dark:text-blue-300">
               Tip: Always try deleting <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40">node_modules</code> and running <code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40">pnpm install</code> if you encounter inexplicable dependency errors.
             </p>
          </div>
        </section>

        {/* Navigation Footer */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-sm text-zinc-500">
          <p>Resolved your issue?</p>
          <Link href="/docs" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <Globe className="w-4 h-4" />
            Return to Documentation
          </Link>
        </div>

      </div>
    </DocLayout>
  );
}