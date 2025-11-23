"use client";

import {
	Building,
	Code2,
	Database,
	FileText,
	Globe,
	Info,
	LayoutTemplate,
	MessageSquare,
	Mic,
	Move,
	PlayCircle,
	Settings,
	Shield,
	Users,
	Zap,
} from "lucide-react";
import { DocLayout } from "../DocLayout";
import { AlertBox } from "../shared/AlertBox";
import { DetailedInfoCard } from "../shared/DetailedInfoCard";
import { EnhancedCodeBlock } from "../shared/EnhancedCodeBlock";
import { SectionHeading } from "../shared/SectionHeading";
import { StepItem } from "../shared/StepItem";

export const CustomizationView = () => {
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
						Customize your Askly widget directly from the dashboard. These
						settings allow you to align the visual identity and interaction
						model with your institutional brand. Navigate to{" "}
						<strong>Customization</strong> in your dashboard sidebar to access
						these controls.
					</p>
				</section>

				{/* Greeting Message */}
				<section>
					<SectionHeading icon={MessageSquare}>Greeting Message</SectionHeading>
					<div className="grid gap-6">
						<DetailedInfoCard title="Configuration" icon={Info}>
							<p className="mb-4">
								The first message users see when they open the widget. Make it
								welcoming, concise, and indicative of the bot's capabilities.
							</p>
							<div className="space-y-3 mt-6">
								<h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
									Examples
								</h5>
								<div className="p-3 rounded bg-white dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 text-sm italic">
									"Hi! I am here to help answer your questions about our campus.
									What would you like to know?"
								</div>
								<div className="p-3 rounded bg-white dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 text-sm italic">
									"Welcome to campus support. Ask me anything about admissions,
									courses, fees, or facilities."
								</div>
							</div>

							<AlertBox type="tip">
								Keep it concise (1-2 sentences) and clearly indicate what topics
								the AI is trained on.
							</AlertBox>
						</DetailedInfoCard>
					</div>
				</section>

				{/* Quick Suggestions */}
				<section>
					<SectionHeading icon={Zap}>Quick Suggestions</SectionHeading>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<p className="text-zinc-600 dark:text-zinc-400 mb-6">
								Pre-defined question buttons that appear in the chat interface.
								These are effective for guiding users toward high-value or
								commonly requested information.
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
								<h4 className="text-sm font-medium mb-3 text-zinc-900 dark:text-white">
									Common Patterns
								</h4>
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
								Use your analytics dashboard to identify top queries and convert
								them into suggestions.
							</AlertBox>
						</div>
					</div>
				</section>

				{/* Voice Assistant */}
				<section>
					<SectionHeading icon={Mic}>Voice Assistant</SectionHeading>
					<DetailedInfoCard title="Vapi Integration" icon={Mic}>
						<p className="mb-4">
							Enable real-time voice conversations by connecting a Vapi
							assistant. This adds a call button to the widget header.
						</p>
						<div className="space-y-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="p-3 bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg">
									<h5 className="text-sm font-medium mb-1">Assistant ID</h5>
									<p className="text-xs text-zinc-500">
										Required. Copy this from your Vapi dashboard after creating
										an assistant.
									</p>
								</div>
								<div className="p-3 bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-lg">
									<h5 className="text-sm font-medium mb-1">Phone Number</h5>
									<p className="text-xs text-zinc-500">
										Optional. Allows users to dial a traditional phone number.
									</p>
								</div>
							</div>
						</div>
						<AlertBox type="warning">
							Voice calls require an active Vapi subscription. The call button
							will auto-hide if no ID is provided.
						</AlertBox>
					</DetailedInfoCard>
				</section>

				{/* Knowledge Base */}
				<section>
					<SectionHeading icon={Database}>Knowledge Base</SectionHeading>
					<p className="text-zinc-600 dark:text-zinc-400 mb-6">
						The intelligence of your AI relies on the data you provide. We
						support two primary methods of ingestion.
					</p>
					<div className="grid md:grid-cols-2 gap-6">
						<DetailedInfoCard title="File Uploads" icon={FileText}>
							<p className="mb-4">
								Upload static documents such as PDF brochures, fee structures,
								and course catalogs.
							</p>
							<ul className="space-y-2 text-sm text-zinc-500">
								<li>• Admission Brochures</li>
								<li>• Campus Maps</li>
								<li>• Policy Documents</li>
							</ul>
						</DetailedInfoCard>

						<DetailedInfoCard title="Web Crawling" icon={Globe}>
							<p className="mb-4">
								Automatically index your public website content. The crawler
								respects standard robots.txt rules.
							</p>
							<ul className="space-y-2 text-sm text-zinc-500">
								<li>• Set crawl depth</li>
								<li>• Select content types</li>
								<li>• Automatic re-indexing</li>
							</ul>
						</DetailedInfoCard>
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
								<p className="text-sm text-zinc-500">
									Set your institution's name as it appears in the dashboard
									header.
								</p>
							</div>
							<div className="p-6">
								<div className="flex items-center gap-2 mb-3">
									<Users className="w-4 h-4 text-zinc-500" />
									<h4 className="font-medium text-sm">Team</h4>
								</div>
								<p className="text-sm text-zinc-500">
									Invite staff members to manage conversations and view
									analytics.
								</p>
							</div>
							<div className="p-6">
								<div className="flex items-center gap-2 mb-3">
									<Shield className="w-4 h-4 text-zinc-500" />
									<h4 className="font-medium text-sm">Roles</h4>
								</div>
								<p className="text-sm text-zinc-500">
									Utilize Role-Based Access Control (RBAC) for granular
									permissions.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Widget Positioning */}
				<section>
					<SectionHeading icon={Move}>Widget Positioning</SectionHeading>
					<p className="text-zinc-600 dark:text-zinc-400 mb-6">
						Control the widget's placement on your site using the{" "}
						<code className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">
							data-position
						</code>{" "}
						attribute within your embed script.
					</p>

					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h4 className="text-sm font-medium mb-2">
								Bottom Right (Default)
							</h4>
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
								Askly automatically detects the user's input language and
								responds accordingly. The AI supports English, Hindi, and major
								regional Indian languages out of the box without additional
								configuration.
							</p>
						</div>

						<div className="p-6 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900/40 dark:border-zinc-800">
							<h4 className="font-medium mb-2 flex items-center gap-2">
								<Code2 className="w-4 h-4 text-zinc-500" />
								System Prompts
							</h4>
							<p className="text-sm text-zinc-500 mb-3">
								Developers can modify the core AI personality and instructions
								by editing the backend definitions.
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
							<p>
								Ensure all changes are saved in the dashboard. Settings are
								propagated instantly to the database.
							</p>
						</StepItem>

						<StepItem number="2" title="Clear Cache">
							<p>
								If the widget is cached, perform a hard refresh (Cmd+Shift+R) on
								your website to fetch the latest configuration.
							</p>
						</StepItem>

						<StepItem number="3" title="Functional Test">
							<p>
								Open the widget. Verify the greeting message matches your update
								and that suggestion buttons are responsive.
							</p>
						</StepItem>
					</div>
				</section>
			</div>
		</DocLayout>
	);
};
