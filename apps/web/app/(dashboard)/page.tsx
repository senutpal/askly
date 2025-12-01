"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { Button, DiceBearAvatar, SidebarTrigger } from "@workspace/ui";
import { cn } from "@workspace/ui/lib/utils";
import { useQuery } from "convex/react";
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
import { motion } from "motion/react";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function Page() {
  const conversations = useQuery(api.private.conversations.getMany, {
    paginationOpts: { numItems: 100, cursor: null },
  });
  const files = useQuery(api.private.files.list, {
    paginationOpts: { numItems: 3, cursor: null },
  });
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);

  const isLoading =
    conversations === undefined ||
    files === undefined ||
    vapiPlugin === undefined ||
    widgetSettings === undefined;

  const conversationStats = conversations?.page.reduce(
    (acc, conv) => {
      if (conv.status === "resolved") acc.resolved++;
      else if (conv.status === "escalated") acc.escalated++;
      else acc.active++;
      return acc;
    },
    { active: 0, resolved: 0, escalated: 0 }
  ) || { active: 0, resolved: 0, escalated: 0 };

  const total =
    conversationStats.active +
    conversationStats.resolved +
    conversationStats.escalated;
  const efficiency =
    total > 0 ? Math.round((conversationStats.resolved / total) * 100) : 0;

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
            <div className="hidden md:flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-3 py-1.5 backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
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

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-12 lg:gap-8"
          >
            {/* --- Stats Row (Bento Top) --- */}
            <motion.div variants={itemVariants} className="md:col-span-4">
              <StatCard
                label="Active Inquiries"
                value={conversationStats.active}
                trend="+4.5%"
                trendUp={true}
                icon={<MessageSquare className="h-4 w-4" />}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="md:col-span-4">
              <StatCard
                label="Resolution Rate"
                value={`${efficiency}%`}
                trend="+12% this week"
                trendUp={true}
                icon={<Zap className="h-4 w-4" />}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="md:col-span-4">
              <StatCard
                label="Escalations"
                value={conversationStats.escalated}
                trend="-2.1%"
                trendUp={false} // Good that it's down, but functionally a negative number
                isNegativeStat={true}
                icon={<Users className="h-4 w-4" />}
              />
            </motion.div>

            {/* --- Main Content Area --- */}

            {/* Left Column: Conversations (Span 8) */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-6 md:col-span-12 lg:col-span-8"
            >
              <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
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
                  {conversations?.page.length === 0 ? (
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
                      {conversations?.page.slice(0, 5).map((conv) => (
                        <ConversationRow key={conv._id} data={conv} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Knowledge Base Section */}
              <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
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
                  {files?.page.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No knowledge loaded.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {files?.page.slice(0, 3).map((file) => (
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
            </motion.div>

            {/* Right Column: Quick Actions (Span 4) */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-6 md:col-span-12 lg:col-span-4"
            >
              <div className="rounded-3xl border border-border/40 bg-card/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
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
                    subtitle={
                      vapiPlugin ? "Connected to Vapi" : "Setup Required"
                    }
                    href="/plugins/vapi"
                    status={vapiPlugin ? "active" : "inactive"}
                  />
                  <ActionTile
                    icon={Settings2}
                    title="Settings"
                    subtitle="General configuration"
                    href="/settings"
                    status="neutral"
                  />
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-800 p-6 text-primary/80 shadow-lg">
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                <div className="relative z-10">
                  <HelpCircle className="mb-4 h-6 w-6 " />
                  <h3 className="mb-1 text-lg font-semibold">Need Help ?</h3>
                  <p className="mb-4 text-sm ">
                    Check Our Technical Documentation
                  </p>
                  <Button variant="secondary">
                    <Link href="/docs">View Docs</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Sub Components ---

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  isNegativeStat?: boolean;
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
      </div>
      {/* Decorative background element */}
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-2xl transition-all group-hover:from-primary/20" />
    </div>
  );
}

function ConversationRow({ data }: { data: any }) {
  const statusColors = {
    resolved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    escalated: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    active: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  };

  // Determine status key safely
  const statusKey = (
    ["resolved", "escalated"].includes(data.status) ? data.status : "active"
  ) as keyof typeof statusColors;

  return (
    <Link href={`/conversations/${data._id}`}>
      <motion.div
        whileHover={{ scale: 1.01, x: 4 }}
        className="group flex items-center justify-between rounded-xl p-3 transition-all hover:bg-accent/50"
      >
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/50 bg-muted flex items-center justify-center">
            <DiceBearAvatar seed={data._id} size={42} />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">
              {data.contactSession?.name || "Anonymous Visitor"}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatDistanceToNow(data._creationTime)} ago</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
              statusColors[statusKey]
            )}
          >
            {statusKey}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-foreground transition-colors" />
        </div>
      </motion.div>
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
  icon: React.ElementType;
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
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group flex h-full items-center gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 transition-all hover:bg-accent hover:border-border/80"
      >
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
      </motion.div>
    </Link>
  );
}

// --- Skeleton Loader ---
function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-12 lg:gap-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-32 rounded-3xl bg-muted/50 animate-pulse md:col-span-4"
        />
      ))}
      <div className="h-[500px] rounded-3xl bg-muted/50 animate-pulse md:col-span-12 lg:col-span-8" />
      <div className="space-y-6 md:col-span-12 lg:col-span-4">
        <div className="h-[300px] rounded-3xl bg-muted/50 animate-pulse" />
        <div className="h-[180px] rounded-3xl bg-muted/50 animate-pulse" />
      </div>
    </div>
  );
}
