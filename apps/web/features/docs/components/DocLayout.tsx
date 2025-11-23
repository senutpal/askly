"use client";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "@workspace/ui";
import { ChevronDown, ChevronRight, Home, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { documentationNavigation } from "../config/navigation";

interface DocLayoutProps {
	children: React.ReactNode;
	title: string;
	description?: string;
}

export const DocLayout = ({ children, title, description }: DocLayoutProps) => {
	const pathname = usePathname();
	const activeGroup = documentationNavigation.find((g) =>
		g.sections.some((s) => s.href === pathname),
	);

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "16.58rem",
				} as React.CSSProperties
			}
		>
			<div className="relative flex min-h-screen w-full">
				{/* Fixed Header at the very top */}
				<header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="flex items-center gap-3">
						<Link href="/" className="flex items-center space-x-2">
							<Image alt="Logo" height={25} width={25} src="/logo.svg" />
							<span className="text-xl font-bold tracking-tight">Askly</span>
						</Link>
						<SidebarTrigger className="ml-24 h-8 w-8 text-muted-foreground hover:text-foreground" />
						<div className="ml-1 mr-2 h-14 w-[1px] border-r bg-transparent" />

						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink
										href="/docs"
										className="flex items-center gap-1 hover:text-foreground"
									>
										<Home className="h-4 w-4" />
									</BreadcrumbLink>
								</BreadcrumbItem>

								{activeGroup && (
									<>
										<BreadcrumbSeparator>
											<ChevronRight className="h-3.5 w-3.5 text-muted-foreground/70" />
										</BreadcrumbSeparator>
										<BreadcrumbItem className="hidden md:block">
											<BreadcrumbLink className="cursor-default font-medium text-muted-foreground hover:text-muted-foreground">
												{activeGroup.group}
											</BreadcrumbLink>
										</BreadcrumbItem>
									</>
								)}

								<BreadcrumbSeparator>
									<ChevronRight className="h-3.5 w-3.5 text-muted-foreground/70" />
								</BreadcrumbSeparator>
								<BreadcrumbItem>
									<BreadcrumbPage className="font-medium text-foreground">
										{title}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>

					<div className="flex items-center gap-3">
						{/* Search Button */}
						<Button
							variant="outline"
							className="relative h-9 w-64 justify-start bg-background/50 text-sm font-normal text-muted-foreground shadow-sm hover:bg-accent/50"
						>
							<Search className="mr-2 h-4 w-4" />
							<span>Search docs...</span>
							<kbd className="pointer-events-none absolute right-2 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
								<span className="text-xs">⌘</span>K
							</kbd>
						</Button>

						<ModeToggle />
					</div>
				</header>

				<Sidebar className="pt-14">
					<SidebarContent className="px-2 py-2">
						{documentationNavigation.map((group, index) => (
							<Collapsible
								key={group.group}
								defaultOpen={index === 0}
								className="group/collapsible"
							>
								<SidebarGroup className="gap-1">
									<SidebarGroupLabel asChild>
										<CollapsibleTrigger className="w-full px-2  hover:text-foreground transition-colors">
											<span className="text-base font-semibold">
												{group.group}
											</span>
											<ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
										</CollapsibleTrigger>
									</SidebarGroupLabel>
									<CollapsibleContent className="ml-4">
										<SidebarGroupContent>
											<SidebarMenu>
												{group.sections.map((section) => {
													const isActive = pathname === section.href;
													const Icon = section.icon || ChevronRight;

													return (
														<SidebarMenuItem key={section.href}>
															<SidebarMenuButton
																asChild
																isActive={isActive}
																tooltip={section.title}
																className={`
                                  group/item relative h-9 px-2.5 text-sm transition-all duration-200 ease-in-out
                                  ${
																		isActive
																			? "bg-primary/5 font-bold text-primary"
																			: "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
																	}
                                `}
															>
																<Link
																	href={section.href}
																	className="flex items-center gap-3"
																>
																	<Icon
																		className={`
                                    h-4 w-4 shrink-0 transition-transform duration-200
                                    ${isActive ? "text-primary" : "text-muted-foreground/70 group-hover/item:text-foreground"}
                                  `}
																	/>
																	<span
																		className={`line-clamp-1 ${
																			isActive ? "font-semibold" : ""
																		}`}
																	>
																		{section.title}
																	</span>
																</Link>
															</SidebarMenuButton>
														</SidebarMenuItem>
													);
												})}
											</SidebarMenu>
										</SidebarGroupContent>
									</CollapsibleContent>
								</SidebarGroup>
							</Collapsible>
						))}
					</SidebarContent>

					{/* Bottom Rail for collapse action */}
					<SidebarRail />
				</Sidebar>

				<SidebarInset className="pt-14">
					{/* Content Area */}
					<main className="relative flex-1 overflow-hidden px-6 py-10 md:px-12 lg:px-16 lg:py-14">
						<div className="mx-auto w-full max-w-4xl">
							{/* Title Section with subtle animation entry */}
							<div className="mb-10 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
								<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
									{title}
								</h1>
								{description && (
									<p className="text-xl leading-8 text-muted-foreground">
										{description}
									</p>
								)}
							</div>

							{/* The actual MDX/Page Content */}
							<div
								className="
                prose prose-slate max-w-none dark:prose-invert
                prose-headings:scroll-m-20 prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:mt-10 prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:first:mt-0
                prose-h3:mt-8 prose-h3:text-2xl
                prose-p:leading-7 prose-p:text-muted-foreground/90
                prose-li:my-0.5 prose-li:text-muted-foreground/90
                prose-code:rounded-md prose-code:bg-muted/50 prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:font-mono prose-code:text-sm prose-code:font-medium
                prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50
                animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 ease-out fill-mode-backwards
              "
							>
								{children}
							</div>

							{/* Footer Navigation (Optional but Premium Touch) */}
							<div className="mt-16 flex justify-between border-t pt-8">
								{/* Logic for Next/Prev page would go here */}
							</div>
						</div>
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};
