"use client";

import {
	Bug,
	FileWarning,
	Globe,
	HelpCircle,
	RefreshCw,
	Search,
	Server,
	Settings,
	Terminal,
} from "lucide-react";
import Link from "next/link";
import { DocLayout } from "../DocLayout";
import { ActionCard } from "../shared/ActionCard";
import { ChecklistItem } from "../shared/ChecklistItem";
import { EnhancedCodeBlock } from "../shared/EnhancedCodeBlock";
import { SectionHeading } from "../shared/SectionHeading";
import { SolutionCard } from "../shared/SolutionCard";

export const TroubleshootingView = () => {
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
							<p className="mb-2">
								The system cannot locate the package manager.
							</p>
							<EnhancedCodeBlock code="npm install -g pnpm" />
						</SolutionCard>

						<SolutionCard title="Node version mismatch" severity="warning">
							<p className="mb-2">
								This project requires Node.js{" "}
								<span className="font-mono font-medium text-zinc-900 dark:text-zinc-200">
									v20.0.0
								</span>{" "}
								or higher.
							</p>
							<EnhancedCodeBlock code="nvm install 20&#10;nvm use 20" />
						</SolutionCard>
					</div>
				</section>

				{/* Environment Section */}
				<section>
					<SectionHeading icon={Settings}>
						Environment Configuration
					</SectionHeading>
					<div className="grid md:grid-cols-2 gap-6">
						<SolutionCard title="Missing Convex URL">
							<p className="mb-4 leading-relaxed">
								The application cannot connect to the backend. Ensure the
								variable is defined in your local environment file.
							</p>
							<div className="p-3 rounded bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
								NEXT_PUBLIC_CONVEX_URL=...
							</div>
							<p className="mt-4 text-xs italic opacity-70">
								Restart the dev server after changing .env files.
							</p>
						</SolutionCard>

						<SolutionCard title="Clerk Auth Failed">
							<p className="mb-4 leading-relaxed">
								Authentication errors usually stem from mismatched API keys or
								incorrect callback configurations.
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
								<ChecklistItem>
									Check browser console for red errors
								</ChecklistItem>
								<ChecklistItem>Verify Organization ID is correct</ChecklistItem>
								<ChecklistItem>
									Clear browser cache and local storage
								</ChecklistItem>
							</div>
						</SolutionCard>

						<SolutionCard title="Messages Not Sending">
							<div className="space-y-2 mt-2">
								<ChecklistItem>Verify Convex backend is running</ChecklistItem>
								<ChecklistItem>
									Check{" "}
									<code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
										NEXT_PUBLIC_CONVEX_URL
									</code>
								</ChecklistItem>
								<ChecklistItem>
									Review network tab for 500/404 errors
								</ChecklistItem>
							</div>
						</SolutionCard>
					</div>
				</section>

				{/* Build Section */}
				<section>
					<SectionHeading icon={Server}>Build & Deploy</SectionHeading>
					<div className="space-y-6">
						<SolutionCard title="TypeScript Errors">
							<p className="mb-2">
								Run the type checker locally before pushing to catch
								inconsistencies.
							</p>
							<EnhancedCodeBlock code="pnpm typecheck&#10;pnpm build" />
						</SolutionCard>

						<SolutionCard title="Vercel Deployment Failed">
							<div className="grid md:grid-cols-2 gap-4 mt-2">
								<ChecklistItem>
									Check Environment Variables in Vercel Settings
								</ChecklistItem>
								<ChecklistItem>
									Verify Build Command is{" "}
									<code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
										pnpm build
									</code>
								</ChecklistItem>
								<ChecklistItem>
									Check Root Directory configuration
								</ChecklistItem>
								<ChecklistItem>
									Review Build Logs for specific error stacks
								</ChecklistItem>
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
							Tip: Always try deleting{" "}
							<code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40">
								node_modules
							</code>{" "}
							and running{" "}
							<code className="px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40">
								pnpm install
							</code>{" "}
							if you encounter inexplicable dependency errors.
						</p>
					</div>
				</section>

				{/* Navigation Footer */}
				<div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-sm text-zinc-500">
					<p>Resolved your issue?</p>
					<Link
						href="/docs"
						className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors"
					>
						<Globe className="w-4 h-4" />
						Return to Documentation
					</Link>
				</div>
			</div>
		</DocLayout>
	);
};
