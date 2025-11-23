"use client";

import {
	Activity,
	ArrowRight,
	ArrowUpRight,
	BarChart3,
	BrainCircuit,
	Building2,
	Clock,
	Code2,
	Cpu,
	GraduationCap,
	Languages,
	Library,
	Palette,
	Server,
	Settings2,
	ShieldCheck,
	Smartphone,
	Zap,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { DocLayout } from "../DocLayout";
import { FeatureCard } from "../shared/FeatureCard";
import { SectionHeading } from "../shared/SectionHeading";
import { TechSpecItem } from "../shared/TechSpecItem";

export const FeaturesView = () => {
	return (
		<DocLayout
			title="Platform Features"
			description="Explore the intelligent capabilities that power the Askly campus experience."
		>
			<div className="space-y-24 pb-10">
				{/* Student Experience Section */}
				<section>
					<SectionHeading icon={GraduationCap}>
						Student Experience
					</SectionHeading>
					<div className="grid gap-6 md:grid-cols-2">
						<FeatureCard
							title="24/7 Instant Support"
							description="Eliminate queue times. Askly provides immediate answers to student queries regardless of office hours or holidays."
							icon={Clock}
							points={[
								"Immediate responses to FAQs",
								"Available on weekends & holidays",
								"Zero waiting periods",
							]}
						/>
						<FeatureCard
							title="Multilingual Voice & Chat"
							description="Break language barriers with real-time translation and voice synthesis in English, Hindi, and regional languages."
							icon={Languages}
							points={[
								"Automatic language detection",
								"Real-time voice calls via Vapi",
								"Mixed-language (Hinglish) support",
							]}
						/>
						<FeatureCard
							title="Cross-Platform Access"
							description="A unified experience across all devices. Whether on a library desktop or a mobile phone on the go."
							icon={Smartphone}
							points={[
								"Responsive web widget",
								"Future WhatsApp integration",
								"Future Telegram support",
							]}
						/>
						<FeatureCard
							title="Context-Aware AI"
							description="Askly remembers the conversation flow, allowing for natural follow-up questions without repeating context."
							icon={BrainCircuit}
							points={[
								"Multi-turn conversation memory",
								"Natural follow-up handling",
								"Intelligent context retention",
							]}
						/>
					</div>
				</section>

				{/* Administrative Tools Section */}
				<section>
					<SectionHeading icon={ShieldCheck}>
						Administrative Control
					</SectionHeading>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<FeatureCard
							title="Real-Time Dashboard"
							description="Monitor campus pulse with live conversation tracking and query volume metrics."
							icon={Activity}
							points={[
								"Live conversation monitoring",
								"Query volume trends",
								"Response accuracy metrics",
							]}
						/>
						<FeatureCard
							title="Knowledge Base"
							description="Ingest institutional data via PDFs and website crawling to ground AI responses in truth."
							icon={Library}
							points={[
								"PDF document processing",
								"Website content crawling",
								"RAG-powered retrieval",
							]}
						/>
						<FeatureCard
							title="Smart Escalation"
							description="Seamlessly hand off complex or sensitive queries to human staff with full context."
							icon={ArrowUpRight}
							points={[
								"Auto-escalation triggers",
								"Full history transfer",
								"Manual operator override",
							]}
						/>
						<FeatureCard
							title="Deep Analytics"
							description="Identify knowledge gaps and peak times to optimize administrative resources."
							icon={BarChart3}
							points={[
								"Most asked questions",
								"Peak usage analysis",
								"Satisfaction scoring",
							]}
						/>
						<FeatureCard
							title="Multi-Tenancy"
							description="Manage multiple campuses or departments with isolated data environments via Clerk."
							icon={Building2}
							points={[
								"Isolated workspaces",
								"Role-based access control",
								"Segregated knowledge bases",
							]}
						/>
						<FeatureCard
							title="Widget Studio"
							description="Customize the look and feel of the chat interface to match university branding."
							icon={Settings2}
							points={[
								"Custom greeting messages",
								"Brand color configuration",
								"Voice persona settings",
							]}
						/>
					</div>
				</section>

				{/* Technical Architecture Section */}
				<section>
					<SectionHeading icon={Cpu}>Technical Architecture</SectionHeading>
					<div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10 p-2">
						<div className="grid md:grid-cols-2 gap-2">
							<TechSpecItem
								title="Real-Time Sync"
								description="Powered by Convex Websockets for sub-millisecond message delivery without polling."
								icon={Zap}
							/>
							<TechSpecItem
								title="Modern Interface"
								description="Built with Next.js 15, React 19, and Tailwind CSS for best-in-class performance."
								icon={Palette}
							/>
							<TechSpecItem
								title="Universal Embed"
								description="Zero-config script tag deployment compatible with WordPress, Drupal, and React apps."
								icon={Code2}
							/>
							<TechSpecItem
								title="Serverless Scale"
								description="Auto-scaling backend infrastructure handles thousands of concurrent student sessions."
								icon={Server}
							/>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
					<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
					<div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
						<div className="space-y-2">
							<h3 className="text-2xl font-semibold text-zinc-900 dark:text-white">
								Ready to upgrade your campus?
							</h3>
							<p className="text-zinc-500 dark:text-zinc-400 max-w-md">
								Get started with Askly today and transform how your students
								interact with institutional knowledge.
							</p>
						</div>
						<Link href="/docs/quick-start">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
							>
								Start Integration
								<ArrowRight className="w-4 h-4" />
							</motion.button>
						</Link>
					</div>
				</section>
			</div>
		</DocLayout>
	);
};
