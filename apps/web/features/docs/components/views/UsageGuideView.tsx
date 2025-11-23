"use client";

import {
	BarChart3,
	Building2,
	CheckCircle2,
	Database,
	FileText,
	Globe,
	Layout,
	MessageSquare,
	Search,
	Settings,
	Shield,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { DocLayout } from "../DocLayout";
import { AlertBox } from "../shared/AlertBox";
import { BestPracticeItem } from "../shared/BestPracticeItem";
import { DetailedInfoCard } from "../shared/DetailedInfoCard";
import { SectionHeading } from "../shared/SectionHeading";
import { StepItem } from "../shared/StepItem";

export const UsageGuideView = () => {
	return (
		<DocLayout
			title="Usage Guide"
			description="Complete guide for administrators to manage Askly. From setting up your organization to monitoring conversations and analytics."
		>
			<div className="space-y-24">
				{/* Introduction Section */}
				<section>
					<SectionHeading icon={Building2}>
						Creating Your Organization
					</SectionHeading>
					<div className="mt-8">
						<StepItem number="01" title="Sign Up">
							<p className="mb-4">
								Navigate to your Askly dashboard and create an account using
								email or social login providers like Google or GitHub.
							</p>
						</StepItem>

						<StepItem number="02" title="Create Organization">
							<p className="mb-4">
								You will be prompted to create or select an organization. Enter
								your campus or institution name to complete the initial
								workspace setup.
							</p>
						</StepItem>

						<StepItem number="03" title="Get Organization ID">
							<p className="mb-4">
								Go to{" "}
								<span className="font-medium text-zinc-900 dark:text-white">
									Settings &rarr; Organization
								</span>
								. Copy your unique organization ID. You will need this
								identifier when configuring the widget embed code.
							</p>
						</StepItem>
					</div>
				</section>

				{/* Knowledge Base Section */}
				<section>
					<SectionHeading icon={Database}>
						Managing Knowledge Base
					</SectionHeading>
					<p className="text-zinc-600 dark:text-zinc-400 mb-8 text-lg leading-relaxed">
						The knowledge base is the foundation of intelligent responses. Add
						comprehensive information to ensure accurate answers.
					</p>

					<div className="grid md:grid-cols-2 gap-6 mb-8">
						<DetailedInfoCard title="Uploading Files" icon={FileText}>
							<p>
								Navigate to{" "}
								<span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
									Files
								</span>{" "}
								in the dashboard sidebar.
							</p>
							<ul className="space-y-2 ml-2">
								<li className="flex items-center gap-2">
									<div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
									<span>Select PDF files or documents</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
									<span>Wait for OCR processing</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
									<span>Files are indexed automatically</span>
								</li>
							</ul>
						</DetailedInfoCard>

						<DetailedInfoCard title="Web Crawling" icon={Globe}>
							<p>
								Navigate to{" "}
								<span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
									Integrations &rarr; Web Crawling
								</span>
								.
							</p>
							<ul className="space-y-2 ml-2">
								<li className="flex items-center gap-2">
									<div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
									<span>Enter website URL</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
									<span>Set crawl depth (1-3 recommended)</span>
								</li>
								<li className="flex items-center gap-2">
									<div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
									<span>Review and select content</span>
								</li>
							</ul>
						</DetailedInfoCard>
					</div>

					<AlertBox type="tip">
						<strong>Pro Tip:</strong> Upload admission brochures, fee
						structures, course catalogs, FAQs, policies, and any other
						frequently referenced documents to improve AI accuracy.
					</AlertBox>
				</section>

				{/* Widget Settings */}
				<section>
					<SectionHeading icon={Settings}>Widget Configuration</SectionHeading>
					<div className="grid md:grid-cols-3 gap-6">
						<DetailedInfoCard title="Greeting Message" icon={MessageSquare}>
							<p className="mb-2">
								Set a welcoming first message that users see when opening the
								chat.
							</p>
							<div className="p-3 bg-white dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 rounded text-sm font-mono text-zinc-500">
								"Hi! How can I help you today?"
							</div>
						</DetailedInfoCard>

						<DetailedInfoCard title="Quick Suggestions" icon={Layout}>
							<p>Add up to 3 quick suggestion buttons for common queries:</p>
							<div className="space-y-1">
								<span className="block text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
									Admission requirements?
								</span>
								<span className="block text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600 dark:text-zinc-400">
									How do I pay fees?
								</span>
							</div>
						</DetailedInfoCard>

						<DetailedInfoCard title="Voice Settings" icon={Zap}>
							<p>
								Configure Vapi assistant ID and optional phone number for voice
								call integration.
							</p>
						</DetailedInfoCard>
					</div>
				</section>

				{/* Monitoring & Analytics */}
				<section>
					<SectionHeading icon={BarChart3}>
						Monitoring & Analytics
					</SectionHeading>
					<div className="space-y-6">
						<div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1">
							<div className="grid divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800 md:grid-cols-3">
								<div className="p-6">
									<h4 className="font-medium mb-2 flex items-center gap-2">
										<MessageSquare className="w-4 h-4 text-zinc-400" />
										Conversations
									</h4>
									<p className="text-sm text-zinc-500">
										View interactions in real-time. See student details, device
										metadata, and AI confidence scores. Take over chats manually
										when needed.
									</p>
								</div>
								<div className="p-6">
									<h4 className="font-medium mb-2 flex items-center gap-2">
										<Search className="w-4 h-4 text-zinc-400" />
										Knowledge Gaps
									</h4>
									<p className="text-sm text-zinc-500">
										Monitor questions where AI lacked confidence. This
										highlights missing information in your knowledge base.
									</p>
								</div>
								<div className="p-6">
									<h4 className="font-medium mb-2 flex items-center gap-2">
										<BarChart3 className="w-4 h-4 text-zinc-400" />
										Metrics
									</h4>
									<p className="text-sm text-zinc-500">
										Track total volume, average response times, and resolution
										rates to optimize your support strategy.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Team & Security */}
				<section>
					<SectionHeading icon={Shield}>Team & Security</SectionHeading>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-zinc-900 dark:text-white">
								Managing Members
							</h3>
							<div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-4">
								<div>
									<span className="block text-sm font-medium text-zinc-900 dark:text-white">
										Invitation Flow
									</span>
									<p className="text-sm text-zinc-500">
										Go to Settings &rarr; Organization &rarr; Invite Members.
										Enter email addresses to send access links.
									</p>
								</div>
								<div>
									<span className="block text-sm font-medium text-zinc-900 dark:text-white">
										Roles
									</span>
									<ul className="mt-1 space-y-1 text-sm text-zinc-500">
										<li>
											<strong className="text-zinc-700 dark:text-zinc-300">
												Admin:
											</strong>{" "}
											Full access including billing.
										</li>
										<li>
											<strong className="text-zinc-700 dark:text-zinc-300">
												Member:
											</strong>{" "}
											View conversations and analytics only.
										</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-lg font-medium text-zinc-900 dark:text-white">
								Plugin Security
							</h3>
							<div className="p-5 rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900/40 dark:border-zinc-800">
								<p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
									When configuring integrations like Vapi Voice:
								</p>
								<div className="flex items-center gap-3 text-sm text-zinc-500">
									<Shield className="w-4 h-4 text-green-500" />
									<span>Secrets are encrypted (AES-256-GCM)</span>
								</div>
								<div className="flex items-center gap-3 text-sm text-zinc-500 mt-2">
									<Shield className="w-4 h-4 text-green-500" />
									<span>Keys are never exposed to the client</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Best Practices */}
				<section>
					<SectionHeading icon={CheckCircle2}>Best Practices</SectionHeading>
					<div className="grid md:grid-cols-2 gap-4">
						<BestPracticeItem text="Update the Knowledge Base regularly with new policies and announcements." />
						<BestPracticeItem text="Monitor conversations daily to identify issues and opportunities." />
						<BestPracticeItem text="Review weekly analytics to understand peak usage patterns." />
						<BestPracticeItem text="Respond promptly when the AI escalates complex queries." />
						<BestPracticeItem text="Refresh quick suggestions seasonally based on student trends." />
					</div>
				</section>

				{/* Footer Help */}
				<div className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-sm text-zinc-500">
					<p>Need assistance?</p>
					<Link
						href="/docs/troubleshooting"
						className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors"
					>
						<MessageSquare className="w-4 h-4" />
						Contact Support
					</Link>
				</div>
			</div>
		</DocLayout>
	);
};
