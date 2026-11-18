"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import type { Doc, Id } from "@workspace/backend/_generated/dataModel";
import { Button, DiceBearAvatar, SidebarTrigger } from "@workspace/ui";
import { cn } from "@workspace/ui/lib/utils";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { formatDistanceToNow } from "date-fns";
import {
	ArrowUpRight,
	AudioWaveform,
	ChevronRight,
	Clock,
	Command,
	FileText,
	HelpCircle,
	LayoutGrid,
	MessageSquare,
	MoreHorizontal,
	Settings2,
	Sparkles,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

export default function Page() {
	const conversations = useQuery(api.private.conversations.getMany, {
		paginationOpts: { numItems: 5, cursor: null },
	});
	const conversationStats = useQuery(api.private.conversations.getStats);
	const files = useQuery(api.private.files.list, {
		paginationOpts: { numItems: 3, cursor: null },
	});
	const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });
	const widgetSettings = useQuery(api.private.widgetSettings.getOne);

	const stats = conversationStats ?? {
		unresolved: 0,
		escalated: 0,
		resolved: 0,
		total: 0,
		approximate: false,
	};

	const efficiency =
		stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
	const approximateSuffix = stats.approximate ? "+" : "";

	return (
		<div className="min-h-screen w-full bg-background dark:bg-neutral-900 text-foreground selection:bg-primary/10 selection:text-primary">
			<div className="mx-auto max-w-[1400px] p-6 sm:p-8 lg:p-12">
				<header className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-4">
						<SidebarTrigger className="h-10 w-10 rounded-xl border border-border/40 bg-background/50 hover:bg-accent hover:text-accent-foreground transition-all" />
						<div className="space-y-1">
							<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
								Overview
							</h1>
							<p className="text-sm font-medium text-muted-foreground/80">
								Welcome back to your command center.
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="hidden md:flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-3 py-1.5">
							<div className="h-2 w-2 rounded-full bg-emerald-500" />
							<span className="text-xs font-medium">System Operational</span>
						</div>
						<ModeToggle />
						<OrganizationSwitcher
							appearance={{
								elements: {
									rootBox: "flex justify-center items-center",
									organizationSwitcherTrigger:
										"h-10 px-3 rounded-xl border border-border/40 bg-background/50 hover:bg-accent transition-all",
								},
							}}
							hidePersonal={true}
						/>
					</div>
				</header>

				<div className="grid gap-6 md:grid-cols-12 lg:gap-8">
					{conversationStats === undefined ? (
						[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-32 rounded-3xl bg-muted/50 animate-pulse md:col-span-4"
							/>
						))
					) : (
						<>
							<div className="md:col-span-4">
								<StatCard
									label="Active Inquiries"
									value={`${stats.unresolved}${approximateSuffix}`}
									icon={<MessageSquare className="h-4 w-4" />}
								/>
							</div>
							<div className="md:col-span-4">
								<StatCard
									label="Resolution Rate"
									value={`${stats.approximate ? "~" : ""}${efficiency}%`}
									icon={<Zap className="h-4 w-4" />}
								/>
							</div>
							<div className="md:col-span-4">
								<StatCard
									label="Escalations"
									value={`${stats.escalated}${approximateSuffix}`}
									icon={<Users className="h-4 w-4" />}
								/>
							</div>
						</>
					)}

					<div className="flex flex-col gap-6 md:col-span-12 lg:col-span-8">
						<div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
							<div className="flex items-center justify-between border-b border-border/40 p-6">
								<div className="flex items-center gap-4">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
										<MessageSquare className="h-4 w-4" />
									</div>
									<h2 className="font-semibold tracking-tight">
										Conversations
									</h2>
								</div>
								<Link
									href="/conversations"
									className="flex items-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
								>
									View All <ArrowUpRight className="ml-1 h-3 w-3" />
								</Link>
							</div>

							<div className="p-2">
								{conversations === undefined ? (
									<div className="flex flex-col gap-2 p-2">
										{[1, 2, 3].map((i) => (
											<div
												key={i}
												className="h-16 rounded-2xl bg-muted/50 animate-pulse"
											/>
										))}
									</div>
								) : conversations.page.length === 0 ? (
									<div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
										<div className="rounded-full bg-muted p-4">
											<Sparkles className="h-6 w-6 text-muted-foreground/50" />
										</div>
										<p className="text-sm text-muted-foreground">
											All caught up. No active sessions.
										</p>
									</div>
								) : (
									<div className="flex flex-col gap-1">
										{conversations.page.map((conv) => (
											<ConversationRow key={conv._id} data={conv} />
										))}
									</div>
								)}
							</div>
						</div>

						<div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
							<div className="flex items-center justify-between border-b border-border/40 p-6">
								<div className="flex items-center gap-2">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
										<FileText className="h-4 w-4" />
									</div>
									<h2 className="font-semibold tracking-tight">
										Knowledge Base
									</h2>
								</div>
								<Link
									href="/files"
									className="flex items-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
								>
									Manage <ChevronRight className="ml-1 h-3 w-3" />
								</Link>
							</div>
							<div className="p-6">
								{files === undefined ? (
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
										{[1, 2, 3].map((i) => (
											<div
												key={i}
												className="h-14 rounded-xl bg-muted/50 animate-pulse"
											/>
										))}
									</div>
								) : files.page.length === 0 ? (
									<div className="text-center py-8">
										<p className="text-sm text-muted-foreground">
											No knowledge loaded.
										</p>
									</div>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
										{files.page.slice(0, 3).map((file) => (
											<div
												key={file.id}
												className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3 transition-colors hover:bg-accent/50"
											>
												<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
													<FileText className="h-4 w-4 text-muted-foreground" />
												</div>
												<div className="min-w-0">
													<p className="truncate text-sm font-medium">
														{file.name}
													</p>
													<p className="text-[10px] uppercase tracking-wider text-muted-foreground">
														{file.type}
													</p>
												</div>
											</div>
										))}
										<Link
											href="/files"
											className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
										>
											<Sparkles className="h-3 w-3" /> Add New
										</Link>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-6 md:col-span-12 lg:col-span-4">
						<div className="rounded-3xl border border-border/40 bg-card/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
							<h3 className="mb-6 font-semibold tracking-tight">
								Quick Actions
							</h3>
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
								<ActionTile
									icon={LayoutGrid}
									title="Widget Design"
									subtitle="Customize appearance"
									href="/customization"
									status={widgetSettings ? "active" : "pending"}
								/>
								<ActionTile
									icon={Command}
									title="Integrations"
									subtitle="Connect your apps"
									href="/integrations"
									status="active"
								/>
								<ActionTile
									icon={AudioWaveform}
									title="Voice Engine"
									subtitle={vapiPlugin ? "Connected to Vapi" : "Setup Required"}
									href="/plugins/vapi"
									status={vapiPlugin ? "active" : "inactive"}
								/>
								<ActionTile
									icon={Settings2}
									title="Settings"
									subtitle="General configuration"
									href="/customization"
									status="neutral"
								/>
							</div>
						</div>

						<div className="relative overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-800 p-6 text-primary/80 shadow-lg">
							<div className="relative z-10">
								<HelpCircle className="mb-4 h-6 w-6" />
								<h3 className="mb-1 text-lg font-semibold">Need Help ?</h3>
								<p className="mb-4 text-sm">
									Check Our Technical Documentation
								</p>
								<Button variant="secondary">
									<Link href="/docs">View Docs</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function StatCard({
	label,
	value,
	icon,
}: {
	label: string;
	value: string | number;
	icon: React.ReactNode;
}) {
	return (
		<div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/50 p-6 transition-all hover:bg-card hover:shadow-lg">
			<div className="flex items-start justify-between">
				<div className="space-y-4">
					<div className="flex items-center gap-2 text-muted-foreground">
						{icon}
						<span className="text-sm font-medium">{label}</span>
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-4xl font-semibold tracking-tighter text-foreground">
							{value}
						</span>
					</div>
				</div>
				<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
					{icon}
				</div>
			</div>
		</div>
	);
}

function ConversationRow({
	data,
}: {
	data: {
		_id: Id<"conversations">;
		_creationTime: number;
		contactSession: {
			_id: Id<"contactSessions">;
			name: string;
			email: string;
		};
		status: Doc<"conversations">["status"];
		lastMessage?: { text: string; role: string; at: number } | null;
	};
}) {
	const statusConfig = {
		unresolved: {
			badge:
				"bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
			dot: "bg-amber-500",
			label: "Active",
		},
		escalated: {
			badge:
				"bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
			dot: "bg-rose-500",
			label: "Escalated",
		},
		resolved: {
			badge:
				"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
			dot: "bg-emerald-500",
			label: "Resolved",
		},
	};

	const currentStatus = statusConfig[data.status] || statusConfig.unresolved;

	return (
		<Link
			href={`/conversations/${data._id}`}
			className="group flex items-center justify-between gap-4 rounded-2xl p-4 transition-all hover:bg-muted/50"
		>
			<div className="flex items-center gap-4 min-w-0">
				<div className="relative">
					<DiceBearAvatar seed={data.contactSession._id} size={40} />
					<div
						className={cn(
							"absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
							currentStatus.dot,
						)}
					/>
				</div>
				<div className="min-w-0">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
							{data.contactSession.name}
						</span>
						<span className="text-xs text-muted-foreground/60 hidden sm:inline">
							•
						</span>
						<span className="text-xs text-muted-foreground truncate hidden sm:inline">
							{data.contactSession.email}
						</span>
					</div>
					<p className="truncate text-xs text-muted-foreground mt-0.5">
						{data.lastMessage?.text || "No messages yet"}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-4 shrink-0">
				<div className="flex items-center gap-1.5 text-xs text-muted-foreground hidden md:flex">
					<Clock className="h-3.5 w-3.5" />
					<span>
						{formatDistanceToNow(data.lastMessage?.at || data._creationTime, {
							addSuffix: true,
						})}
					</span>
				</div>
				<div
					className={cn(
						"flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border",
						currentStatus.badge,
					)}
				>
					{currentStatus.label}
				</div>
			</div>
		</Link>
	);
}

function ActionTile({
	icon: Icon,
	title,
	subtitle,
	href,
	status,
}: {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	subtitle: string;
	href: string;
	status: "active" | "inactive" | "pending" | "neutral";
}) {
	const statusColor = {
		active: "bg-emerald-500",
		inactive: "bg-destructive",
		pending: "bg-amber-500",
		neutral: "bg-muted-foreground",
	};

	return (
		<Link href={href} className="block h-full">
			<div className="group flex h-full items-center gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 transition-all hover:bg-accent hover:border-border/80">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-background group-hover:shadow-sm">
					<Icon className="h-5 w-5" />
				</div>
				<div className="min-w-0 flex-1">
					<h4 className="text-sm font-medium leading-none text-foreground">
						{title}
					</h4>
					<p className="mt-1 text-xs text-muted-foreground truncate">
						{subtitle}
					</p>
				</div>
				{status !== "neutral" && (
					<div className={cn("h-2 w-2 rounded-full", statusColor[status])} />
				)}
				{status === "neutral" && (
					<MoreHorizontal className="h-4 w-4 text-muted-foreground/50" />
				)}
			</div>
		</Link>
	);
}
