"use client";

import {
	AlertCircle,
	CheckCircle2,
	Code2,
	Cpu,
	Database,
	Key,
	Layout,
	MessageSquare,
	Rocket,
	Server,
	Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { codeExamples } from "../../config/content";
import { DocLayout } from "../DocLayout";
import { ActionCard } from "../shared/ActionCard";
import { EnhancedCodeBlock } from "../shared/EnhancedCodeBlock";
import { SectionHeading } from "../shared/SectionHeading";
import { StepItem } from "../shared/StepItem";

const PrerequisiteCard = ({
	title,
	icon: Icon,
	items,
}: {
	title: string;
	icon: any;
	items: { label: string; sub?: string; href?: string }[];
}) => (
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
				<li
					key={idx}
					className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400"
				>
					<div className="mt-1 w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 shrink-0" />
					<div className="flex flex-col">
						<span className="font-medium text-zinc-900 dark:text-zinc-200">
							{item.label}
							{item.href && (
								<a
									href={item.href}
									target="_blank"
									rel="noopener"
									className="ml-1 text-blue-600 hover:underline dark:text-blue-400"
								>
									↗
								</a>
							)}
						</span>
						{item.sub && <span className="text-xs opacity-70">{item.sub}</span>}
					</div>
				</li>
			))}
		</ul>
	</motion.div>
);

export const QuickStartView = () => {
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
								{
									label: "Node.js",
									sub: "Version 20.0.0 or higher",
									href: "https://nodejs.org",
								},
								{
									label: "pnpm",
									sub: "Version 10.4.1+ (Preferred)",
									href: "https://pnpm.io",
								},
								{
									label: "Git",
									sub: "Latest version",
									href: "https://git-scm.com",
								},
							]}
						/>
						<PrerequisiteCard
							title="Services & Keys"
							icon={Key}
							items={[
								{
									label: "Clerk",
									sub: "Authentication provider",
									href: "https://clerk.com",
								},
								{
									label: "Convex",
									sub: "Real-time backend",
									href: "https://convex.dev",
								},
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
								We use{" "}
								<code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">
									pnpm
								</code>{" "}
								for workspace management. This will install packages across all
								applications.
							</p>
							<EnhancedCodeBlock code={codeExamples.installCommands.install} />
							<div className="mt-4 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3">
								<AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
								<p className="text-sm text-blue-700 dark:text-blue-300">
									First installation may take a moment to cache dependencies.
								</p>
							</div>
						</StepItem>

						<StepItem number="03" title="Initialize Backend">
							<p className="mb-4">
								Spin up your Convex deployment. This automatically generates
								your database schema and creates the necessary{" "}
								<code className="text-xs">.env</code> configurations.
							</p>
							<EnhancedCodeBlock
								code={codeExamples.installCommands.setupBackend}
							/>
						</StepItem>

						<StepItem number="04" title="Environment Variables">
							<p className="mb-4">
								Critical step. Create{" "}
								<code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono">
									.env.local
								</code>{" "}
								files in each application package. Refer to the{" "}
								<Link
									href="/docs/setup"
									className="underline underline-offset-4 decoration-zinc-400 hover:decoration-blue-500 transition-colors"
								>
									Configuration Guide
								</Link>{" "}
								for the complete list of keys.
							</p>
						</StepItem>

						<StepItem number="05" title="Launch Development Server">
							<p className="mb-4">
								Start the turbo pipeline. This boots up the Dashboard, Widget,
								and Embed script simultaneously.
							</p>
							<EnhancedCodeBlock code={codeExamples.installCommands.dev} />

							<div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
								{[
									{ name: "Dashboard", port: "3000" },
									{ name: "Chat Widget", port: "3001" },
									{ name: "Embed Script", port: "3002" },
								].map((service) => (
									<div
										key={service.port}
										className="flex items-center justify-between p-3 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
									>
										<span className="text-sm font-medium">{service.name}</span>
										<span className="text-xs font-mono text-zinc-500">
											:{service.port}
										</span>
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
								<div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4">
									1
								</div>
								<h4 className="font-medium mb-2">Access Dashboard</h4>
								<p className="text-sm text-zinc-500">
									Visit localhost:3000. You should see the landing page.
								</p>
							</div>
							<div className="p-6">
								<div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4">
									2
								</div>
								<h4 className="font-medium mb-2">Create Organization</h4>
								<p className="text-sm text-zinc-500">
									Complete the onboarding flow to set up your workspace.
								</p>
							</div>
							<div className="p-6">
								<div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4">
									3
								</div>
								<h4 className="font-medium mb-2">Test Chat</h4>
								<p className="text-sm text-zinc-500">
									Ensure the AI responds in the preview window.
								</p>
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
					<Link
						href="/docs/troubleshooting"
						className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors"
					>
						<MessageSquare className="w-4 h-4" />
						Troubleshooting Guide
					</Link>
				</div>
			</div>
		</DocLayout>
	);
};
