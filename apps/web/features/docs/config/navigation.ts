import {
	BookCopy,
	BookOpen,
	Globe,
	Handshake,
	Layers,
	type LucideIcon,
	Palette,
	Plug,
	Rocket,
	Search,
	Settings,
	Sparkles,
	Wrench,
} from "lucide-react";
export interface NavigationSection {
	title: string;
	href: string;
	description: string;
	icon?: LucideIcon;
}

export interface NavigationGroup {
	group: string;
	sections: NavigationSection[];
}

export const documentationNavigation: NavigationGroup[] = [
	{
		group: "Getting Started",
		sections: [
			{
				title: "Introduction",
				href: "/docs/introduction",
				description: "Learn what Askly is and how it can help your campus",
				icon: BookOpen,
			},
			{
				title: "Features",
				href: "/docs/features",
				description: "Explore all the features Askly has to offer",
				icon: Sparkles,
			},
			{
				title: "Quick Start",
				href: "/docs/quick-start",
				description: "Quick start guide to get Askly running",
				icon: Rocket,
			},
		],
	},
	{
		group: "Configuration",
		sections: [
			{
				title: "Setup & Installation",
				href: "/docs/setup",
				description: "Detailed configuration and environment setup",
				icon: Settings,
			},
			{
				title: "Deployment",
				href: "/docs/deployment",
				description: "Deploy Askly to production",
				icon: Globe,
			},
		],
	},
	{
		group: "Integration",
		sections: [
			{
				title: "Widget Integration",
				href: "/docs/integration",
				description: "Embed Askly on your website",
				icon: Plug,
			},
			{
				title: "Customization",
				href: "/docs/customization",
				description: "Customize appearance and behavior",
				icon: Palette,
			},
		],
	},
	{
		group: "Reference",
		sections: [
			{
				title: "Architecture",
				href: "/docs/architecture",
				description: "Understand how Askly works under the hood",
				icon: Layers,
			},
			{
				title: "Usage Guide",
				href: "/docs/usage-guide",
				description: "Complete guide for administrators",
				icon: BookCopy,
			},
			{
				title: "API Reference",
				href: "/docs/api-reference",
				description: "API documentation and endpoints",
				icon: Wrench,
			},
		],
	},
	{
		group: "Help",
		sections: [
			{
				title: "Troubleshooting",
				href: "/docs/troubleshooting",
				description: "Common issues and solutions",
				icon: Search,
			},
			{
				title: "Contributing",
				href: "/docs/contributing",
				description: "Contribute to Askly open source project",
				icon: Handshake,
			},
		],
	},
];

export const sidebarNavigation = documentationNavigation.flatMap((group) =>
	group.sections.map((section) => ({
		...section,
		group: group.group,
	})),
);
