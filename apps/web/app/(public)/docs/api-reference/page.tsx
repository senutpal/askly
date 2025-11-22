"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Code2,
  Server,
  Database,
  Copy,
  Check,
  Globe,
  Shield,
  Zap,
  AlertCircle,
  Terminal,
  Settings
} from "lucide-react";
import { DocLayout } from "@/features/docs/components/DocLayout";

// --- Reusable UI Components (Matched to Reference) ---

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
  <div className="flex items-center gap-3 mb-6">
    {Icon && <Icon className="w-5 h-5 text-zinc-400" />}
    <h2 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-white">
      {children}
    </h2>
  </div>
);

const EnhancedCodeBlock = ({ code, language = "typescript", filename }: { code: string, language?: string, filename?: string }) => {
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

const ApiCard = ({ title, description, children, label }: { title: string, description?: string, children: React.ReactNode, label?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 transition-all duration-300 mb-8"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-zinc-900 dark:text-white font-mono">{title}</h3>
      {label && (
        <span className="px-2 py-1 text-xs font-medium rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
    {description && (
      <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
        {description}
      </p>
    )}
    {children}
  </motion.div>
);

const InfoBox = ({ icon: Icon, title, children }: { icon: any, title: string, children: React.ReactNode }) => (
  <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3">
    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
    <div className="space-y-1">
      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">{title}</h4>
      <div className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{children}</div>
    </div>
  </div>
);

const ParamTable = ({ params }: { params: { name: string, type: string, desc: string, required?: boolean }[] }) => (
  <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
    <table className="w-full text-sm text-left">
      <thead className="bg-zinc-100 dark:bg-zinc-900/50">
        <tr>
          <th className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800">Property</th>
          <th className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800">Type</th>
          <th className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800">Description</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900/20">
        {params.map((row, i) => (
          <tr key={i}>
            <td className="px-4 py-3 font-mono text-zinc-700 dark:text-zinc-300">
              {row.name}
              {row.required && <span className="ml-2 text-red-500 text-xs">*</span>}
            </td>
            <td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-mono text-xs">{row.type}</td>
            <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{row.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Main Page Component ---

export default function ApiReferencePage() {
  return (
    <DocLayout
      title="API Reference"
      description="Comprehensive documentation for the Askly Widget JavaScript API and Convex Backend endpoints."
    >
      <div className="space-y-24">

        {/* Widget JavaScript API */}
        <section>
          <SectionHeading icon={Terminal}>Widget JavaScript API</SectionHeading>
          <p className="mb-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            The Askly widget exposes a global <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono text-zinc-900 dark:text-zinc-200">window.AsklyWidget</code> object 
            allows for programmatic control over the chat interface.
          </p>

          <ApiCard 
            title="init(config)" 
            label="Method"
            description="Initialize or reinitialize the widget with specific configuration options. This must be called before other methods."
          >
            <EnhancedCodeBlock
              language="javascript"
              code={`window.AsklyWidget.init({
  organizationId: 'org_xxxxxxxx',
  position: 'bottom-right',
  theme: 'dark'
});`}
            />
            <ParamTable
              params={[
                { name: "organizationId", type: "string", desc: "Your unique Clerk organization identifier.", required: true },
                { name: "position", type: "string", desc: "'bottom-right' or 'bottom-left'. Defaults to right." },
                { name: "theme", type: "string", desc: "Force 'light' or 'dark' mode. Defaults to system." },
              ]}
            />
          </ApiCard>

          <div className="grid md:grid-cols-2 gap-6">
            <ApiCard title="show()" label="Void">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Programmatically opens the widget interface.</p>
              <EnhancedCodeBlock code="window.AsklyWidget.show();" />
            </ApiCard>
            
            <ApiCard title="hide()" label="Void">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Minimizes the widget interface.</p>
              <EnhancedCodeBlock code="window.AsklyWidget.hide();" />
            </ApiCard>
          </div>

          <ApiCard title="destroy()" label="Void">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Removes the widget from the DOM and cleans up event listeners. Requires script reload to re-initialize.
            </p>
            <EnhancedCodeBlock code="window.AsklyWidget.destroy();" />
          </ApiCard>
        </section>

        {/* Convex Backend API */}
        <section>
          <SectionHeading icon={Server}>Convex Backend API</SectionHeading>
          <p className="mb-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Server-side queries and mutations exposed via the Convex client. These are utilized internally by the widget but can be accessed directly for custom implementations.
          </p>
          
          <InfoBox icon={Shield} title="Authentication Required">
             Direct backend API access is secured via Clerk. The widget handles token management automatically. Custom implementations must ensure a valid session.
          </InfoBox>

          <div className="mt-8 space-y-8">
            <ApiCard title="api.public.widgetSettings.get" label="Query">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Retrieves configuration for the chat interface.</p>
              <EnhancedCodeBlock
                code={`const settings = await convex.query(
  api.public.widgetSettings.get,
  { organizationId: "org_xxxxxxxx" }
);`}
              />
            </ApiCard>

            <ApiCard title="api.public.messages.send" label="Mutation">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Sends a new message to the AI agent or support thread.</p>
              <EnhancedCodeBlock
                code={`await convex.mutation(api.public.messages.send, {
  organizationId: "org_xxxxxxxx",
  threadId: "thread_abc123",
  content: "What are the admission requirements?",
  contactSessionId: "session_xyz"
});`}
              />
            </ApiCard>
          </div>
        </section>

        {/* Data Models */}
        <section>
          <SectionHeading icon={Database}>Data Models</SectionHeading>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-zinc-400" /> Conversation
              </h3>
              <EnhancedCodeBlock
                filename="types/conversation.ts"
                code={`interface Conversation {
  _id: Id<"conversations">;
  threadId: string;
  organizationId: string;
  contactSessionId: Id<"contactSessions">;
  status: "unresolved" | "escalated" | "resolved";
  _creationTime: number;
}`}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-zinc-400" /> Widget Settings
              </h3>
              <EnhancedCodeBlock
                filename="types/settings.ts"
                code={`interface WidgetSettings {
  _id: Id<"widgetSettings">;
  organizationId: string;
  greetMessage: string;
  defaultSuggestions: {
    suggestion1?: string;
    suggestion2?: string;
    suggestion3?: string;
  };
  vapiSettings: {
    assistantId?: string;
    phoneNumber?: string;
  };
}`}
              />
            </div>
          </div>
        </section>

        {/* Webhooks & Integration */}
        <section>
          <SectionHeading icon={Globe}>Webhooks (Beta)</SectionHeading>
          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1">
            <div className="grid divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 md:grid-cols-3">
              <div className="p-6">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Settings className="w-4 h-4" />
                </div>
                <h4 className="font-medium mb-2">Configuration</h4>
                <p className="text-sm text-zinc-500">Configure endpoints in the Dashboard settings panel.</p>
              </div>
              <div className="p-6">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-medium mb-2">Events</h4>
                <p className="text-sm text-zinc-500">Listen for `message.created` and `thread.escalated`.</p>
              </div>
              <div className="p-6">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="font-medium mb-2">Security</h4>
                <p className="text-sm text-zinc-500">All payloads are signed with your secret key.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Error Handling */}
        <section>
          <SectionHeading icon={AlertCircle}>Error Handling & Limits</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 transition-all"
            >
              <h4 className="font-medium mb-4 text-zinc-900 dark:text-white">Common Errors</h4>
              <ul className="space-y-3">
                {[
                  { code: "401", label: "Unauthorized - Check Organization ID" },
                  { code: "429", label: "Too Many Requests - Rate limit exceeded" },
                  { code: "500", label: "Internal Server Error - Retry operation" },
                ].map((err, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="font-mono font-bold text-red-500">{err.code}</span>
                    <span className="text-zinc-600 dark:text-zinc-400">{err.label}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 transition-all"
            >
              <h4 className="font-medium mb-4 text-zinc-900 dark:text-white">Rate Limits</h4>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  Standard API: Managed by Convex infrastructure
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  File Storage: Max 10MB per upload
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  AI Inference: Subject to LLM provider limits
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

      </div>
    </DocLayout>
  );
}