"use client";

import React from "react";
import { motion } from "motion/react";
import { 
  Layout, 
  MessageSquare, 
  Code2, 
  Server, 
  Lock, 
  Database, 
  ShieldAlert, 
  Terminal,
  Settings,
  Globe
} from "lucide-react";
import { DocLayout } from "../DocLayout";
import { SectionHeading } from "../shared/SectionHeading";
import { EnhancedCodeBlock } from "../shared/EnhancedCodeBlock";
import { StepItem } from "../shared/StepItem";
import { envExamples } from "../../config/content";
import { ConfigCard } from "../shared/ConfigCard";

export const SetupView = () => {
  return (
    <DocLayout
      title="Setup & Configuration"
      description="Detailed configuration and environment setup guide for all Askly application services."
    >
      <div className="space-y-16">
        
        {/* Overview */}
        <section>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Askly operates as a monorepo requiring specific environment variables for each application. 
            Ensure these are configured correctly to enable communication between the dashboard, widget, and backend services.
          </p>
        </section>

        {/* Web Dashboard */}
        <section>
          <SectionHeading icon={Layout}>Web Dashboard</SectionHeading>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            Create <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">apps/web/.env.local</code> with the following variables:
          </p>
          <EnhancedCodeBlock code={envExamples.web} language="bash" filename="apps/web/.env.local" />
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <ConfigCard 
              title="Clerk Authentication"
              items={[
                { key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", desc: "Found in Clerk Dashboard → API Keys." },
                { key: "CLERK_SECRET_KEY", desc: "Secret key from the same page. Keep this private." },
              ]}
            />
            <ConfigCard 
              title="Convex Database"
              items={[
                { key: "NEXT_PUBLIC_CONVEX_URL", desc: "Your deployment URL from the Convex dashboard." },
                { key: "CONVEX_DEPLOYMENT", desc: "The deployment name generated during setup." },
              ]}
            />
            <ConfigCard 
              title="Service URLs"
              items={[
                { key: "NEXT_PUBLIC_WIDGET_URL", desc: "Where the widget runs (localhost:3001 for dev)." },
                { key: "NEXT_PUBLIC_APP_URL", desc: "The main dashboard URL (localhost:3000 for dev)." },
              ]}
            />
          </div>
        </section>

        {/* Widget */}
        <section>
          <SectionHeading icon={MessageSquare}>Chat Widget</SectionHeading>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            Create <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">apps/widget/.env.local</code>:
          </p>
          <EnhancedCodeBlock code={envExamples.widget} language="bash" filename="apps/widget/.env.local" />
          
          <div className="mt-6">
            <ConfigCard 
              title="Voice Intelligence"
              items={[
                { key: "NEXT_PUBLIC_VAPI_PUBLIC_KEY", desc: "Public key available in your Vapi dashboard." },
                { key: "VAPI_PRIVATE_KEY", desc: "Private key used for server-side signing." },
              ]}
            />
            <p className="mt-4 text-sm text-zinc-500">
              Don't have keys? Sign up at <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vapi.ai</a> to get started.
            </p>
          </div>
        </section>

        {/* Embed */}
        <section>
          <SectionHeading icon={Code2}>Embed Script</SectionHeading>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            Create <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">apps/embed/.env</code>:
          </p>
          <EnhancedCodeBlock code={envExamples.embed} language="bash" filename="apps/embed/.env" />
          
          <div className="mt-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex gap-3">
            <Globe className="w-5 h-5 text-zinc-400 shrink-0" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <strong>Widget URL:</strong> This points to your hosted widget application. In production, this would be <code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded">https://widget.yourdomain.com</code>.
            </p>
          </div>
        </section>

        {/* Backend */}
        <section>
          <SectionHeading icon={Server}>Backend & Intelligence</SectionHeading>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            Create <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">packages/backend/convex/.env</code>:
          </p>
          <EnhancedCodeBlock code={envExamples.backend} language="bash" filename="packages/backend/convex/.env" />
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <ConfigCard 
              title="AI Providers"
              items={[
                { key: "GOOGLE_API_KEY", desc: <span>Get your key from <a href="https://aistudio.google.com" className="text-blue-600 hover:underline">Google AI Studio</a>.</span> },
                { key: "VAPI_API_KEY", desc: "Server-side API key (different from the public key)." },
              ]}
            />
            <ConfigCard 
              title="Security"
              items={[
                { key: "MASTER_KEY", desc: "32+ char random string used for internal encryption." },
              ]}
            />
          </div>
        </section>

        {/* Clerk Setup Guide */}
        <section>
          <SectionHeading icon={Lock}>Clerk Authentication Setup</SectionHeading>
          <div className="mt-8">
            <StepItem number="01" title="Create Application">
              Go to <a href="https://clerk.com" className="text-blue-600 hover:underline">clerk.com</a>, create a new application, and select your preferred social login providers.
            </StepItem>
            
            <StepItem number="02" title="Enable Organizations">
              Navigate to the <strong>Organizations</strong> tab in the Clerk sidebar and toggle the feature on. This is required for multi-tenancy support.
            </StepItem>

            <StepItem number="03" title="Configure Callbacks">
              Add the following URLs to your allowed callback list in the Clerk dashboard:
              <ul className="mt-2 space-y-1 font-mono text-xs text-zinc-500">
                <li>http://localhost:3000</li>
                <li>http://localhost:3001</li>
              </ul>
            </StepItem>

            <StepItem number="04" title="Retrieve Keys">
              Copy the <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">CLERK_SECRET_KEY</code> into your environment files.
            </StepItem>
          </div>
        </section>

        {/* Convex Setup Guide */}
        <section>
          <SectionHeading icon={Database}>Convex Setup</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white dark:bg-zinc-900/40 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-zinc-900 dark:text-white" />
                <h3 className="font-medium text-zinc-900 dark:text-white">Automated Setup</h3>
              </div>
              <p className="text-sm text-zinc-500 mb-4">
                Run the setup script to automatically create your project and configure schemas.
              </p>
              <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                <code className="text-xs font-mono text-zinc-300">
                  cd packages/backend<br/>
                  pnpm run setup
                </code>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 bg-white dark:bg-zinc-900/40 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-zinc-900 dark:text-white" />
                <h3 className="font-medium text-zinc-900 dark:text-white">Manual Config</h3>
              </div>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>1. Create project at <a href="https://convex.dev" className="text-blue-600 hover:underline">convex.dev</a></li>
                <li>2. Copy Deployment URL to env files</li>
                <li>3. Run <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">npx convex dev</code> to sync</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security Warning */}
        <section>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-900/30 p-6"
          >
            <div className="flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-200 mb-2">
                  Security Requirements
                </h3>
                <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-400/80">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    Never commit .env files to version control.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    Use distinct API keys for development vs. production environments.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    Ensure your <code className="font-mono text-xs">MASTER_KEY</code> is a cryptographically secure random string.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </DocLayout>
  );
}
