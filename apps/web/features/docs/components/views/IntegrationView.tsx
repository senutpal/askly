"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Globe,
  Settings,
  Cpu,
  Code2,
  Layout,
  CheckCircle2,
  Layers,
  Zap,
  Smartphone,
  MousePointerClick,
  MessageSquare,
  Maximize
} from "lucide-react";
import { codeExamples } from "../../config/content";
import { DocLayout } from "../DocLayout";
import { SectionHeading } from "../shared/SectionHeading";
import { EnhancedCodeBlock } from "../shared/EnhancedCodeBlock";
import { ConfigItem } from "../shared/ConfigItem";
import { MethodCard } from "../shared/MethodCard";
import { AlertBox } from "../shared/AlertBox";

export const IntegrationView = () => {
  return (
    <DocLayout
      title="Widget Integration"
      description="Embed the Askly chat widget on any website with a simple script tag or programmatic API."
    >
      <div className="space-y-24">
        
        {/* Basic Integration */}
        <section>
          <SectionHeading icon={Globe}>Basic Integration</SectionHeading>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            The easiest way to add Askly to your website is with a single script tag. Add this to
            your HTML before the closing <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">&lt;/body&gt;</code> tag.
          </p>
          
          <EnhancedCodeBlock code={codeExamples.embedBasic} language="html" />

          <div className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 flex items-center gap-2">
              <Settings className="w-4 h-4 text-zinc-500" />
              <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-200">Configuration Attributes</h3>
            </div>
            <div>
              <ConfigItem 
                label="src" 
                desc="URL to your deployed embed script." 
              />
              <ConfigItem 
                label="data-organization-id" 
                desc="Your unique Clerk organization ID. Required for authentication." 
              />
              <ConfigItem 
                label="data-position" 
                desc="Controls where the widget appears on the screen. Defaults to bottom-right." 
              />
            </div>
          </div>

          <div className="mt-6">
            <AlertBox type="info" title="Finding Your Organization ID">
              Go to your Askly dashboard, then navigate to <strong>Configurations → Integrations</strong>. 
              Copy the Organization ID shown there to connect the widget to your knowledge base.
            </AlertBox>
          </div>
        </section>

        {/* Programmatic Control */}
        <section>
          <SectionHeading icon={Cpu}>Programmatic Control</SectionHeading>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Once the script is loaded, you can control the widget programmatically using the global window object.
          </p>
          
          <EnhancedCodeBlock code={codeExamples.programmaticControl} language="javascript" />
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MethodCard 
              name="init(config)" 
              desc="Initialize or re-initialize with new settings. Accepts organizationId and position."
            />
            <MethodCard 
              name="show()" 
              desc="Manually opens the chat widget interface."
            />
            <MethodCard 
              name="hide()" 
              desc="Minimizes or closes the chat widget interface."
            />
            <MethodCard 
              name="destroy()" 
              desc="Completely removes the widget from the DOM and cleans up event listeners."
            />
          </div>
        </section>

        {/* Framework Examples */}
        <section>
          <SectionHeading icon={Code2}>Framework Specifics</SectionHeading>
          
          <div className="space-y-12">
            {/* React */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">React</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Use the <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-sm font-mono">useEffect</code> hook to load the widget when the component mounts.
              </p>
              <EnhancedCodeBlock code={codeExamples.embedReact} language="javascript" filename="App.jsx" />
            </div>

            {/* Next.js */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Next.js</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Use the optimized <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-sm font-mono">Script</code> component.
              </p>
              <EnhancedCodeBlock code={codeExamples.embedNextjs} language="javascript" filename="layout.js" />
              <div className="mt-4 text-sm text-zinc-500">
                <span className="font-medium text-zinc-900 dark:text-zinc-200">Pro Tip:</span> Use <code className="font-mono text-xs">strategy="lazyOnload"</code> to improve your Core Web Vitals by deferring the widget load.
              </div>
            </div>

            {/* Vue */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Vue.js</h3>
              </div>
              <EnhancedCodeBlock 
                code={`<template>
  <div id="app">
    <!-- Your app content -->
  </div>
</template>

<script>
export default {
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://your-domain.com/widget.js';
    script.setAttribute('data-organization-id', 'org_xxxxxxxx');
    document.body.appendChild(script);
  },
  beforeUnmount() {
    window.AsklyWidget?.destroy();
  }
}
</script>`} 
                language="html" 
                filename="App.vue" 
              />
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section>
          <SectionHeading icon={Layout}>Positioning</SectionHeading>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Control the widget placement using the <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-sm font-mono">data-position</code> attribute.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -2 }}
              className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800"
            >
              <div className="flex items-center gap-2 mb-3">
                <Maximize className="w-5 h-5 text-zinc-500 rotate-90" />
                <h4 className="font-medium text-zinc-900 dark:text-white">Bottom Right</h4>
                <span className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full">Default</span>
              </div>
              <p className="text-sm text-zinc-500 mb-4">Standard placement. Recommended for most websites to align with common user patterns.</p>
              <code className="text-xs bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
                data-position="bottom-right"
              </code>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800"
            >
              <div className="flex items-center gap-2 mb-3">
                <Maximize className="w-5 h-5 text-zinc-500" />
                <h4 className="font-medium text-zinc-900 dark:text-white">Bottom Left</h4>
              </div>
              <p className="text-sm text-zinc-500 mb-4">Alternative placement. Useful if you have back-to-top buttons or other FABs on the right.</p>
              <code className="text-xs bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
                data-position="bottom-left"
              </code>
            </motion.div>
          </div>
        </section>

        {/* Testing Section */}
        <section>
          <SectionHeading icon={CheckCircle2}>Testing Integration</SectionHeading>
          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1">
            <div className="grid divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Widget Load", desc: "Reload page to confirm the button appears in the configured position." },
                { title: "Open Interface", desc: "Click the launcher. Ensure the chat window opens smoothly." },
                { title: "AI Response", desc: "Send a test message. Verify the AI answers from your knowledge base." },
                { title: "Dashboard", desc: "Check your Askly dashboard logs to see the conversation recorded." }
              ].map((step, idx) => (
                <div key={idx} className="p-6">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    {idx + 1}
                  </div>
                  <h4 className="font-medium text-zinc-900 dark:text-white mb-2">{step.title}</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <SectionHeading icon={Layers}>Best Practices</SectionHeading>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { text: "Load script asynchronously to avoid blocking UI", icon: Zap },
              { text: "Test on mobile devices for responsiveness", icon: Smartphone },
              { text: "Include on all pages needing support", icon: Globe },
              { text: "Monitor analytics for engagement stats", icon: MousePointerClick },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-green-200/50 bg-green-50/30 dark:border-green-900/30 dark:bg-green-900/10">
                <item.icon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Help */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-sm text-zinc-500">
          <p>Having issues with the widget?</p>
          <Link href="/docs/troubleshooting" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <MessageSquare className="w-4 h-4" />
            View Troubleshooting Guide
          </Link>
        </div>

      </div>
    </DocLayout>
  );
}
