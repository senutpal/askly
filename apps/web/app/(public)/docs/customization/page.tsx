"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Settings,
  MessageSquare,
  Zap,
  Mic,
  Database,
  FileText,
  Globe,
  Building,
  Users,
  Shield,
  Move,
  Code2,
  Check,
  Copy,
  PlayCircle,
  LayoutTemplate,
  AlertCircle,
  Lightbulb,
  Info
} from "lucide-react";
import { DocLayout } from "@/features/docs/components/DocLayout";

// --- Reusable Components (Matching GettingStartedPage) ---

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
  <div className="flex items-center gap-3 mb-6">
    {Icon && <Icon className="w-5 h-5 text-zinc-400" />}
    <h2 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-white">
      {children}
    </h2>
  </div>
);

const EnhancedCodeBlock = ({ code, filename }: { code: string, filename?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl bg-[#0D0D0D] border border-white/10 shadow-2xl">
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

const InfoCard = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 backdrop-blur-sm transition-all duration-300"
  >
    <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
      <Icon className="w-5 h-5 text-zinc-500" />
      <h4 className="font-medium">{title}</h4>
    </div>
    <div className="text-sm text-zinc-600 dark:text-zinc-400">
      {children}
    </div>
  </motion.div>
);

const AlertBox = ({ type = "info", children }: { type?: "info" | "tip" | "warning", children: React.ReactNode }) => {
  const styles = {
    info: "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300",
    tip: "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    warning: "bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-300",
  };

  const icons = {
    info: Info,
    tip: Lightbulb,
    warning: AlertCircle
  };
  
  const Icon = icons[type];

  return (
    <div className={`mt-4 p-4 rounded-lg border flex gap-3 ${styles[type]}`}>
      <Icon className="w-5 h-5 shrink-0" />
      <div className="text-sm">{children}</div>
    </div>
  );
};

const StepItem = ({ number, title, children }: { number: string, title: string, children: React.ReactNode }) => (
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

// --- Main Component ---

export default function CustomizationPage() {
  return (
    <DocLayout
      title="Customization"
      description="Configure appearance, behavior, and intelligence settings to match your brand and requirements."
    >
      <div className="space-y-24">
        
        {/* Widget Settings Intro */}
        <section>
          <SectionHeading icon={Settings}>Widget Settings</SectionHeading>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            Customize your Askly widget directly from the dashboard. These settings allow you to align the visual identity and interaction model with your institutional brand.
            Navigate to <strong>Customization</strong> in your dashboard sidebar to access these controls.
          </p>
        </section>

        {/* Greeting Message */}
        <section>
          <SectionHeading icon={MessageSquare}>Greeting Message</SectionHeading>
          <div className="grid gap-6">
            <InfoCard title="Configuration" icon={Info}>
              <p className="mb-4">
                The first message users see when they open the widget. Make it welcoming, concise, and indicative of the bot's capabilities.
              </p>
              <div className="space-y-3 mt-6">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Examples</h5>
                <div className="p-3 rounded bg-white dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 text-sm italic">
                  "Hi! I am here to help answer your questions about our campus. What would you like to know?"
                </div>
                <div className="p-3 rounded bg-white dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 text-sm italic">
                  "Welcome to campus support. Ask me anything about admissions, courses, fees, or facilities."
                </div>
              </div>
              
              <AlertBox type="tip">
                Keep it concise (1-2 sentences) and clearly indicate what topics the AI is trained on.
              </AlertBox>
            </InfoCard>
          </div>
        </section>

        {/* Quick Suggestions */}
        <section>
          <SectionHeading icon={Zap}>Quick Suggestions</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Pre-defined question buttons that appear in the chat interface. These are effective for guiding users toward high-value or commonly requested information.
              </p>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  Configure up to 3 unique suggestions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  Suggestions appear as pill-shaped buttons
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  Triggers instant response when clicked
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
               <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-sm font-medium mb-3 text-zinc-900 dark:text-white">Common Patterns</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 text-xs rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                      Admission requirements?
                    </span>
                    <span className="px-3 py-1.5 text-xs rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                      How do I pay fees?
                    </span>
                    <span className="px-3 py-1.5 text-xs rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                      Library location
                    </span>
                  </div>
               </div>
               <AlertBox type="tip">
                  Use your analytics dashboard to identify top queries and convert them into suggestions.
               </AlertBox>
            </div>
          </div>
        </section>

        {/* Voice Assistant */}
        <section>
          <SectionHeading icon={Mic}>Voice Assistant</SectionHeading>
          <InfoCard title="Vapi Integration" icon={Mic}>
             <p className="mb-4">
               Enable real-time voice conversations by connecting a Vapi assistant. This adds a call button to the widget header.
             </p>
             <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-3 bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <h5 className="text-sm font-medium mb-1">Assistant ID</h5>
                    <p className="text-xs text-zinc-500">Required. Copy this from your Vapi dashboard after creating an assistant.</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <h5 className="text-sm font-medium mb-1">Phone Number</h5>
                    <p className="text-xs text-zinc-500">Optional. Allows users to dial a traditional phone number.</p>
                  </div>
                </div>
             </div>
             <AlertBox type="warning">
                Voice calls require an active Vapi subscription. The call button will auto-hide if no ID is provided.
             </AlertBox>
          </InfoCard>
        </section>

        {/* Knowledge Base */}
        <section>
          <SectionHeading icon={Database}>Knowledge Base</SectionHeading>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            The intelligence of your AI relies on the data you provide. We support two primary methods of ingestion.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard title="File Uploads" icon={FileText}>
              <p className="mb-4">
                Upload static documents such as PDF brochures, fee structures, and course catalogs.
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>• Admission Brochures</li>
                <li>• Campus Maps</li>
                <li>• Policy Documents</li>
              </ul>
            </InfoCard>

            <InfoCard title="Web Crawling" icon={Globe}>
              <p className="mb-4">
                Automatically index your public website content. The crawler respects standard robots.txt rules.
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>• Set crawl depth</li>
                <li>• Select content types</li>
                <li>• Automatic re-indexing</li>
              </ul>
            </InfoCard>
          </div>
        </section>

        {/* Organization Branding */}
        <section>
          <SectionHeading icon={Building}>Organization Settings</SectionHeading>
          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1">
            <div className="grid divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 md:grid-cols-3">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="w-4 h-4 text-zinc-500" />
                  <h4 className="font-medium text-sm">Identity</h4>
                </div>
                <p className="text-sm text-zinc-500">Set your institution's name as it appears in the dashboard header.</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-zinc-500" />
                  <h4 className="font-medium text-sm">Team</h4>
                </div>
                <p className="text-sm text-zinc-500">Invite staff members to manage conversations and view analytics.</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-zinc-500" />
                  <h4 className="font-medium text-sm">Roles</h4>
                </div>
                <p className="text-sm text-zinc-500">Utilize Role-Based Access Control (RBAC) for granular permissions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Widget Positioning */}
        <section>
          <SectionHeading icon={Move}>Widget Positioning</SectionHeading>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Control the widget's placement on your site using the <code className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">data-position</code> attribute within your embed script.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
               <h4 className="text-sm font-medium mb-2">Bottom Right (Default)</h4>
               <EnhancedCodeBlock code='data-position="bottom-right"' />
            </div>
            <div>
               <h4 className="text-sm font-medium mb-2">Bottom Left</h4>
               <EnhancedCodeBlock code='data-position="bottom-left"' />
            </div>
          </div>
        </section>

        {/* Advanced Customization */}
        <section>
          <SectionHeading icon={Code2}>Advanced Configuration</SectionHeading>
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900/40 dark:border-zinc-800">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-zinc-500" />
                Multi-Language Support
              </h4>
              <p className="text-sm text-zinc-500">
                Askly automatically detects the user's input language and responds accordingly. The AI supports English, Hindi, and major regional Indian languages out of the box without additional configuration.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900/40 dark:border-zinc-800">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-zinc-500" />
                System Prompts
              </h4>
              <p className="text-sm text-zinc-500 mb-3">
                Developers can modify the core AI personality and instructions by editing the backend definitions.
              </p>
              <div className="text-xs font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 px-3 py-2 rounded border border-zinc-200 dark:border-zinc-800 w-fit">
                packages/backend/convex/private/chat.ts
              </div>
            </div>
          </div>
        </section>

        {/* Testing Changes */}
        <section>
          <SectionHeading icon={PlayCircle}>Verifying Changes</SectionHeading>
          <div className="mt-8">
            <StepItem number="1" title="Save Configuration">
              <p>Ensure all changes are saved in the dashboard. Settings are propagated instantly to the database.</p>
            </StepItem>
            
            <StepItem number="2" title="Clear Cache">
              <p>If the widget is cached, perform a hard refresh (Cmd+Shift+R) on your website to fetch the latest configuration.</p>
            </StepItem>
            
            <StepItem number="3" title="Functional Test">
              <p>Open the widget. Verify the greeting message matches your update and that suggestion buttons are responsive.</p>
            </StepItem>
          </div>
        </section>

      </div>
    </DocLayout>
  );
}