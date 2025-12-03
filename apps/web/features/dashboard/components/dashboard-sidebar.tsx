"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {
	cn,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from "@workspace/ui";
import {
	Blocks,
	Brain,
	ChevronRight,
	Inbox,
	LayoutDashboard,
	LibraryBig,
	Mic,
	Palette,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";



export const DashboardSidebar = () => {
	const pathname = usePathname();
	const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  const escalatedConversations = useQuery(api.private.conversations.getMany, {
    paginationOpts: { numItems: 100, cursor: null },
    status: "escalated",
  });

  const escalatedCount = escalatedConversations?.page.length ?? 0;

  const navigationGroups = [
    {
      label: "Platform",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "Customer Support",
      items: [
        {
          title: "Conversations",
          url: "/conversations",
          icon: Inbox,
          badge: escalatedConversations === undefined 
              ? undefined 
              : escalatedCount > 0 
                ? String(escalatedCount) 
                : undefined, 
        },
        {
          title: "Knowledge Base",
          url: "/files",
          icon: LibraryBig,
        },
      ],
    },
    {
      label: "Configuration",
      items: [
        {
          title: "Widget Styling",
          url: "/customization",
          icon: Palette,
        },
        {
          title: "Integrations",
          url: "/integrations",
          icon: Blocks,
        },
        {
          title: "Voice Assistant",
          url: "/plugins/vapi",
          icon: Mic,
        },
        {
          title: "Gemini",
          url: "/plugins/gemini",
          icon: Brain,
        },
      ],
    },
  ];

	const isActive = (url: string) => {
		if (url === "/") return pathname === "/";
		return pathname.startsWith(url);
	};

	return (
		<Sidebar
			collapsible="icon"
			className="border-r border-border/50 bg-sidebar/95 backdrop-blur-xl supports-[backdrop-filter]:bg-sidebar/60"
		>
			{/* Header: Organization Switcher */}
			<SidebarHeader className="h-[53px] justify-center border-b border-border/40 group-data-[collapsible=icon]:mx-auto px-2 transition-all">
				<SidebarMenu>
					<SidebarMenuItem>
						<div
							className={cn(
								"flex items-center gap-2 transition-all duration-300 ease-in-out",
								isCollapsed ? "justify-center" : "px-1",
							)}
						>
							<OrganizationSwitcher
								hidePersonal
								skipInvitationScreen
								appearance={{
									elements: {
										rootBox: "w-full! h-8!",
										avatarBox: "size-5! rounded-sm!",
										organizationSwitcherTrigger:
											"w-full! justify-center! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!",
										organsizationPreview:
											"group-data-[collapsible=icon]:justify-center! gap-2!",
										organizationPreviewTextContainer:
											"group-data-[collapsible=icon]:hidden! text-xs! font-medium! text-sidebar-foreground!",
										organizationSwitcherTriggerIcon:
											"group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground!",
									},
								}}
							/>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			{/* Content: Navigation */}
			<SidebarContent className="group-data-[collapsible=icon]:mx-auto px-2 py-4 gap-6 scrollbar-none">
				{navigationGroups.map((group) => (
					<SidebarGroup
						key={group.label}
						className="group-data-[collapsible=icon]:p-0"
					>
						<SidebarGroupLabel
							className={cn(
								"px-2 text-[10px] uppercase tracking-widest text-muted-foreground/70 font-bold transition-all duration-300",
								isCollapsed ? "hidden" : "block",
							)}
						>
							{group.label}
						</SidebarGroupLabel>
						<SidebarGroupContent className="pt-1">
							<SidebarMenu className="gap-1">
								{group.items.map((item) => {
									const active = isActive(item.url);
									return (
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton
												asChild
												isActive={active}
												tooltip={item.title}
												className={cn(
													"relative h-10 transition-all duration-200 ease-[cubic-bezier(0.2,0.0,0,1.0)] overflow-hidden rounded-lg",
													"hover:pl-3 hover:bg-sidebar-accent/40", // Micro-interaction: subtle shift right on hover
													active
														? "!bg-sidebar-accent !text-sidebar-accent-foreground shadow-sm font-medium"
														: "text-sidebar-foreground/80 opacity-80 hover:opacity-100",
												)}
											>
												<Link
													href={item.url}
													className="flex items-center gap-3"
												>
													<item.icon
														className={cn(
															"size-[18px] transition-transform duration-300",
															active ? "text-blue-600 dark:text-blue-400" : "",
															"group-hover:scale-110", // Subtle icon pop on hover
														)}
													/>

													<span className="truncate">{item.title}</span>

													{/* Optional Badge Logic */}
													{item.badge && !isCollapsed && (
														<span className="ml-6 flex size-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
															{item.badge}
														</span>
													)}

													{/* Chevron for "Go" indication on active/hover */}
													{!isCollapsed && active && (
														<ChevronRight className="ml-auto size-3.5 opacity-50" />
													)}
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<UserButton
							showName
							appearance={{
								elements: {
									rootBox: "w-full! h-8!",
									userButtonTrigger:
										"w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
									userButtonBox:
										"w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!",
									userButtonOuterIdentifier:
										"pl-0! group-data-[collapsible=icon]:hidden",
									avatarBox: "size-4!",
								},
							}}
						/>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
};
