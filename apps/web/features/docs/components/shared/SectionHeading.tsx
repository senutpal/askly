import type { LucideIcon } from "lucide-react";
import type React from "react";

interface SectionHeadingProps {
	children: React.ReactNode;
	icon?: LucideIcon;
}

export const SectionHeading = ({
	children,
	icon: Icon,
}: SectionHeadingProps) => (
	<div className="flex items-center gap-3 mb-6">
		{Icon && <Icon className="w-5 h-5 text-zinc-400" />}
		<h2 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-white">
			{children}
		</h2>
	</div>
);
