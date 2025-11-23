"use client";

import {
	Check,
	Cloud,
	Database,
	FileCode,
	GitBranch,
	Globe,
	Server,
	Settings,
	ShieldCheck,
	Terminal,
} from "lucide-react";
import { DocLayout } from "../DocLayout";
import { Callout } from "../shared/Callout";
import { ChecklistCard } from "../shared/ChecklistCard";
import { EnhancedCodeBlock } from "../shared/EnhancedCodeBlock";
import { SectionHeading } from "../shared/SectionHeading";
import { StepItem } from "../shared/StepItem";

export const DeploymentView = () => {
	return (
		<DocLayout
			title="Deployment"
			description="Deploy Askly to production with Vercel and Convex. A step-by-step guide to going live."
		>
			<div className="space-y-24">
				{/* Overview */}
				<section>
					<p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
						This guide covers deploying all Askly applications to production. We
						recommend using Vercel for Next.js apps due to seamless integration,
						but you can use any hosting platform that supports Next.js.
					</p>

					<Callout variant="info">
						<strong>Deployment Order:</strong> Always deploy the Convex backend
						first, then the web apps. This ensures database and API endpoints
						are available when apps start.
					</Callout>
				</section>

				{/* Main Deployment Pipeline */}
				<section>
					<SectionHeading icon={Terminal}>Deployment Pipeline</SectionHeading>
					<div className="mt-8">
						{/* Step 1: Backend */}
						<StepItem number="01" title="Deploy Convex Backend">
							<p className="mb-4">
								The Convex backend must be deployed first as all other apps
								depend on it.
							</p>
							<EnhancedCodeBlock
								code={`cd packages/backend\nnpx convex deploy`}
								filename="Terminal"
							/>

							<div className="grid gap-4 mt-6">
								<div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/50">
									<h4 className="font-medium text-sm mb-2 text-zinc-900 dark:text-zinc-100">
										What This Does
									</h4>
									<ul className="space-y-2 text-sm text-zinc-500">
										<li className="flex items-center gap-2">
											<div className="w-1 h-1 rounded-full bg-zinc-400" />
											Deploys all functions to Convex cloud
										</li>
										<li className="flex items-center gap-2">
											<div className="w-1 h-1 rounded-full bg-zinc-400" />
											Updates database schema in production
										</li>
										<li className="flex items-center gap-2">
											<div className="w-1 h-1 rounded-full bg-zinc-400" />
											Generates production deployment URL
										</li>
									</ul>
								</div>

								<Callout variant="warning">
									<strong>Critical:</strong> Ensure all environment variables
									are set in{" "}
									<code className="px-1 py-0.5 bg-black/5 dark:bg-white/10 rounded font-mono text-xs">
										packages/backend/convex/.env
									</code>{" "}
									before deploying.
								</Callout>

								<p className="text-sm text-zinc-500 mt-2">
									After deployment, copy the production URL (e.g.,{" "}
									<span className="font-mono text-zinc-700 dark:text-zinc-300">
										https://your-project.convex.cloud
									</span>
									) and update it in all app .env files.
								</p>
							</div>
						</StepItem>

						{/* Step 2: Web Dashboard */}
						<StepItem number="02" title="Deploy Web Dashboard">
							<p className="mb-4">
								We recommend Vercel for the main application dashboard.
							</p>

							<div className="space-y-6">
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white">
										<span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs">
											1
										</span>
										Install Vercel CLI & Deploy
									</div>
									<EnhancedCodeBlock
										code={`pnpm add -g vercel\ncd apps/web\nvercel --prod`}
										filename="Terminal"
									/>
								</div>

								<div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
									<h4 className="font-medium text-sm mb-3 text-zinc-900 dark:text-zinc-100">
										Configure Vercel Environment
									</h4>
									<p className="text-sm text-zinc-500 mb-3">
										Add these variables in your Vercel Project Settings:
									</p>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
										{[
											"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
											"CLERK_SECRET_KEY",
											"NEXT_PUBLIC_CONVEX_URL",
											"CONVEX_DEPLOYMENT",
											"NEXT_PUBLIC_WIDGET_URL",
											"NEXT_PUBLIC_APP_URL",
										].map((v) => (
											<code
												key={v}
												className="text-xs bg-zinc-100 dark:bg-zinc-800 p-2 rounded block"
											>
												{v}
											</code>
										))}
									</div>
								</div>

								<p className="text-sm text-zinc-500">
									<span className="font-medium text-zinc-900 dark:text-zinc-200">
										Note:
									</span>{" "}
									Don't forget to add your production domain to the allowed
									callback URLs in your Clerk Dashboard.
								</p>
							</div>
						</StepItem>

						{/* Step 3: Widget */}
						<StepItem number="03" title="Deploy Widget">
							<p className="mb-4">Deploy the standalone widget application.</p>
							<EnhancedCodeBlock
								code={`cd apps/widget\nvercel --prod`}
								filename="Terminal"
							/>

							<div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl">
								<div className="flex items-start gap-3">
									<Globe className="w-5 h-5 text-blue-500 mt-0.5" />
									<div>
										<h4 className="font-medium text-sm text-zinc-900 dark:text-white">
											Cross-Referencing URLs
										</h4>
										<p className="text-sm text-zinc-500 mt-1">
											Once deployed, copy the widget URL (e.g.,{" "}
											<code className="text-xs">
												https://widget.yourdomain.com
											</code>
											) and go back to update{" "}
											<code className="text-xs">NEXT_PUBLIC_WIDGET_URL</code> in
											your Web Dashboard environment variables.
										</p>
									</div>
								</div>
							</div>
						</StepItem>

						{/* Step 4: Embed Script */}
						<StepItem number="04" title="Deploy Embed Script">
							<p className="mb-4">
								The embed script is the bridge between your client's website and
								the Askly widget.
							</p>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
									<h4 className="font-medium text-sm mb-2 flex items-center gap-2">
										<Cloud className="w-4 h-4" /> Option A: Vercel
									</h4>
									<p className="text-xs text-zinc-500 mb-3">
										Simplest method. Deploys as a static asset.
									</p>
									<code className="text-xs bg-zinc-100 dark:bg-zinc-800 p-2 rounded block mb-2">
										cd apps/embed
									</code>
									<code className="text-xs bg-zinc-100 dark:bg-zinc-800 p-2 rounded block">
										vercel --prod
									</code>
								</div>

								<div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
									<h4 className="font-medium text-sm mb-2 flex items-center gap-2">
										<Database className="w-4 h-4" /> Option B: CDN
									</h4>
									<p className="text-xs text-zinc-500 mb-3">
										For high-traffic production use (S3, Cloudflare).
									</p>
									<code className="text-xs bg-zinc-100 dark:bg-zinc-800 p-2 rounded block mb-2">
										pnpm build
									</code>
									<p className="text-xs text-zinc-400 mt-2">
										Upload <code className="text-zinc-300">dist/widget.js</code>{" "}
										to your bucket.
									</p>
								</div>
							</div>
						</StepItem>
					</div>
				</section>

				{/* Post Deployment Checklist */}
				<section>
					<SectionHeading icon={ShieldCheck}>
						Post-Deployment Verification
					</SectionHeading>
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{[
							{
								title: "Clerk Config",
								desc: "Add production URLs to allowed origins",
								icon: Settings,
							},
							{
								title: "Test Auth",
								desc: "Verify sign up & organization creation",
								icon: Check,
							},
							{
								title: "Custom Domain",
								desc: "Set up branded domains in Vercel",
								icon: Globe,
							},
							{
								title: "Monitoring",
								desc: "Check Vercel Analytics for errors",
								icon: Server,
							},
						].map((item, i) => (
							<div
								key={i}
								className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20"
							>
								<item.icon className="w-5 h-5 text-zinc-400 mb-3" />
								<h4 className="font-medium text-sm text-zinc-900 dark:text-white mb-1">
									{item.title}
								</h4>
								<p className="text-xs text-zinc-500">{item.desc}</p>
							</div>
						))}
					</div>
				</section>

				{/* Env Vars Checklist */}
				<section>
					<SectionHeading icon={FileCode}>
						Environment Variables Checklist
					</SectionHeading>
					<p className="mb-8 text-zinc-600 dark:text-zinc-400">
						Ensure these keys are present in your production configuration.
					</p>
					<div className="grid md:grid-cols-3 gap-6">
						<ChecklistCard
							title="Web Dashboard"
							items={[
								"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
								"CLERK_SECRET_KEY",
								"NEXT_PUBLIC_CONVEX_URL",
								"CONVEX_DEPLOYMENT",
								"NEXT_PUBLIC_WIDGET_URL",
								"NEXT_PUBLIC_APP_URL",
							]}
						/>
						<ChecklistCard
							title="Widget App"
							items={[
								"NEXT_PUBLIC_CONVEX_URL",
								"NEXT_PUBLIC_VAPI_PUBLIC_KEY",
								"VAPI_PRIVATE_KEY",
							]}
						/>
						<ChecklistCard
							title="Convex Backend"
							items={[
								"GOOGLE_GENERATIVE_AI_API_KEY",
								"VAPI_API_KEY",
								"CLERK_SECRET_KEY",
								"MASTER_KEY",
							]}
						/>
					</div>
				</section>

				{/* CI/CD */}
				<section>
					<SectionHeading icon={GitBranch}>
						Continuous Deployment
					</SectionHeading>
					<div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/20">
						<div className="flex flex-col md:flex-row gap-8">
							<div className="flex-1">
								<h4 className="font-medium text-zinc-900 dark:text-white mb-4">
									Automated Builds
								</h4>
								<p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
									Connect your Git repository to Vercel for automatic
									deployments on push.
								</p>
								<div className="space-y-4">
									<div className="flex gap-4">
										<div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-mono shrink-0">
											1
										</div>
										<p className="text-sm text-zinc-600 dark:text-zinc-400">
											Import repository in Vercel Dashboard
										</p>
									</div>
									<div className="flex gap-4">
										<div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-mono shrink-0">
											2
										</div>
										<div>
											<p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
												Configure Build Settings
											</p>
											<div className="flex gap-2 text-xs font-mono text-zinc-500">
												<span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
													Framework: Next.js
												</span>
												<span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
													Command: pnpm build
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="flex-1 bg-zinc-50 dark:bg-black/20 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800/50 flex items-center justify-center">
								<div className="text-center">
									<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-3">
										<GitBranch className="w-6 h-6" />
									</div>
									<p className="text-sm font-medium text-zinc-900 dark:text-white">
										Git Integration
									</p>
									<p className="text-xs text-zinc-500 mt-1">
										Push to main → Auto Deploy
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</DocLayout>
	);
};
