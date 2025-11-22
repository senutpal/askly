export interface NavigationSection {
  title: string;
  href: string;
  description: string;
  icon?: string;
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
        icon: "📖",
      },
      {
        title: "Features",
        href: "/docs/features",
        description: "Explore all the features Askly has to offer",
        icon: "✨",
      },
      {
        title: "Getting Started",
        href: "/docs/getting-started",
        description: "Quick start guide to get Askly running",
        icon: "🚀",
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
        icon: "⚙️",
      },
      {
        title: "Deployment",
        href: "/docs/deployment",
        description: "Deploy Askly to production",
        icon: "🌐",
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
        icon: "🔌",
      },
      {
        title: "Customization",
        href: "/docs/customization",
        description: "Customize appearance and behavior",
        icon: "🎨",
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
        icon: "🏗️",
      },
      {
        title: "Usage Guide",
        href: "/docs/usage-guide",
        description: "Complete guide for administrators",
        icon: "📚",
      },
      {
        title: "API Reference",
        href: "/docs/api-reference",
        description: "API documentation and endpoints",
        icon: "🔧",
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
        icon: "🔍",
      },
      {
        title: "Contributing",
        href: "/docs/contributing",
        description: "Contribute to Askly open source project",
        icon: "🤝",
      },
    ],
  },
];

export const sidebarNavigation = documentationNavigation.flatMap((group) =>
  group.sections.map((section) => ({
    ...section,
    group: group.group,
  }))
);
