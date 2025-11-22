"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Terminal,
  Check,
  Copy,
  GitPullRequest,
  GitMerge,
  Bug,
  Sparkles,
  FileText,
  Code2,
  MessageSquare,
  Scale,
  Heart,
  Users,
  Github,
  CheckCircle2,
  AlertCircle
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

const InfoCard = ({ title, desc, icon: Icon, href }: { title: string, desc: string, icon: any, href?: string }) => {
  const Content = (
    <div className="h-full p-6 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
      <Icon className="w-6 h-6 mb-4 text-zinc-500 dark:text-zinc-400" />
      <h4 className="font-medium text-zinc-900 dark:text-white mb-2">
        {title}
      </h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer" className="block group h-full">
        <motion.div whileHover={{ y: -4 }} className="h-full">
          {Content}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      {Content}
    </motion.div>
  );
};

const GuidelineItem = ({ label }: { label: string }) => (
  <div className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
    <span className="font-medium text-zinc-900 dark:text-zinc-200">{label}</span>
  </div>
);

// --- Main Page Component ---

export default function ContributingPage() {
  return (
    <DocLayout
      title="Contributing"
      description="Help us make Askly better. Whether you're fixing bugs, improving docs, or adding features, we welcome your contribution."
    >
      <div className="space-y-24">

        {/* Intro */}
        <section className="border-b border-zinc-200 dark:border-zinc-800 pb-12">
          <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Thank you for your interest in contributing to Askly! This project is open source under the
            <span className="font-semibold text-zinc-900 dark:text-white"> GNU GPL v3.0 license</span>. 
            We value all contributions from the community.
          </p>
        </section>

        {/* Ways to Contribute Grid */}
        <section>
          <SectionHeading icon={Heart}>Ways to Contribute</SectionHeading>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoCard
              title="Report Bugs"
              desc="Found a bug? Create an issue on GitHub with detailed reproduction steps to help us squash it."
              icon={Bug}
              href="https://github.com/senutpal/askly/issues"
            />
            <InfoCard
              title="Suggest Features"
              desc="Have an idea? Share it! Open an issue labeled 'feature request' and discuss it with the community."
              icon={Sparkles}
              href="https://github.com/senutpal/askly/issues"
            />
            <InfoCard
              title="Improve Docs"
              desc="Help others learn! Submit pull requests to fix typos, clarify guides, or add missing examples."
              icon={FileText}
              href="https://github.com/senutpal/askly"
            />
            <InfoCard
              title="Write Code"
              desc="Fix bugs, add features, or refactor code. Check out 'good first issues' if you're just starting."
              icon={Code2}
              href="https://github.com/senutpal/askly/pulls"
            />
          </div>
        </section>

        {/* Development Flow Timeline */}
        <section>
          <SectionHeading icon={Terminal}>Development Setup</SectionHeading>
          <div className="mt-8">
            
            <StepItem number="01" title="Fork and Clone">
              <p className="mb-4">
                Start by forking the repository to your GitHub account, then clone it locally.
              </p>
              <EnhancedCodeBlock 
                code={`# Replace YOUR_USERNAME with your GitHub handle
git clone https://github.com/YOUR_USERNAME/askly.git
cd askly`} 
              />
            </StepItem>

            <StepItem number="02" title="Install Dependencies">
              <p className="mb-4">
                We use <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">pnpm</code> for package management.
              </p>
              <EnhancedCodeBlock code="pnpm install" />
            </StepItem>

            <StepItem number="03" title="Create Branch">
              <p className="mb-4">
                Create a descriptive branch for your work. Avoid working directly on <code className="text-xs font-mono">main</code>.
              </p>
              <EnhancedCodeBlock code="git checkout -b feature/your-feature-name" />
            </StepItem>

            <StepItem number="04" title="Code Standards">
              <p className="mb-4">
                Ensure your code meets our quality guidelines before submitting.
              </p>
              <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800">
                <div className="space-y-3">
                  <GuidelineItem label="Use TypeScript for type safety" />
                  <GuidelineItem label="Format code with Prettier before committing" />
                  <GuidelineItem label="Run linter: pnpm lint" />
                  <GuidelineItem label="Write meaningful commit messages" />
                  <GuidelineItem label="Keep pull requests focused on a single feature" />
                </div>
              </div>
            </StepItem>

          </div>
        </section>

        {/* Pull Request Process */}
        <section>
          <SectionHeading icon={GitPullRequest}>Submitting Pull Requests</SectionHeading>
          <div className="space-y-8">
            <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1">
              <div className="grid divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 md:grid-cols-2">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-mono">1</div>
                    <h4 className="font-medium">Pre-Submission Checks</h4>
                  </div>
                  <p className="text-sm text-zinc-500 mb-4">Run these commands to ensure CI will pass.</p>
                  <EnhancedCodeBlock 
                    code={`pnpm format
pnpm lint
pnpm typecheck
pnpm build`} 
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-mono">2</div>
                    <h4 className="font-medium">Push & Open PR</h4>
                  </div>
                  <p className="text-sm text-zinc-500 mb-4">Push your changes and open a request on GitHub.</p>
                  <EnhancedCodeBlock 
                    code={`git add .
git commit -m "feat: add amazing feature"
git push origin feature/your-feature-name`} 
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">PR Checklist</p>
                <ul className="list-disc list-inside opacity-90 space-y-1">
                  <li>Describe your changes clearly in the PR description.</li>
                  <li>Reference any related issues (e.g., "Fixes #123").</li>
                  <li>Wait for review and address any feedback promptly.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Commit Convention */}
        <section>
          <SectionHeading icon={GitMerge}>Commit Convention</SectionHeading>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            We follow the Conventional Commits specification. This helps us generate changelogs automatically.
          </p>
          <div className="grid gap-4">
            <EnhancedCodeBlock 
              filename="Example Commits"
              language="text"
              code={`feat: add new feature
fix: resolve bug in widget loading
docs: update installation guide
refactor: improve code structure
chore: update dependencies`} 
            />
          </div>
        </section>

        {/* License & Community */}
        <section>
          <SectionHeading icon={Users}>Community & License</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* License Card */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="w-5 h-5 text-zinc-900 dark:text-white" />
                <h4 className="font-medium text-zinc-900 dark:text-white">License</h4>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                Askly is licensed under the GNU General Public License v3.0. By contributing, you
                agree that your contributions will be licensed under the same license.
              </p>
              <a
                href="https://github.com/senutpal/askly/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
              >
                View Full License <CheckCircle2 className="w-3 h-3" />
              </a>
            </div>

            {/* Community Card */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/20 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-zinc-900 dark:text-white" />
                <h4 className="font-medium text-zinc-900 dark:text-white">Join the Conversation</h4>
              </div>
              <div className="space-y-4">
                <a href="https://github.com/senutpal/askly" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-colors">
                    <Github className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Star on GitHub</span>
                </a>
                
                <a href="https://github.com/senutpal/askly/issues" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-colors">
                    <Bug className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Report Issues</span>
                </a>

                <a href="https://github.com/senutpal/askly/discussions" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group-hover:border-zinc-300 dark:group-hover:border-zinc-600 transition-colors">
                    <MessageSquare className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  </div>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Join Discussions</span>
                </a>
              </div>
            </div>

          </div>
        </section>

      </div>
    </DocLayout>
  );
}