import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { NavigationSection } from "../../config/navigation";

export const SectionLink = ({ section }: { section: NavigationSection }) => {
	const Icon = section.icon;
	return (
		<Link
			href={section.href}
			className="group/item flex items-center gap-4 rounded-xl p-3 -mx-3 transition-colors hover:bg-zinc-100 dark:hover:bg-white/10"
		>
			<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition-colors group-hover/item:bg-blue-600 group-hover/item:text-white dark:bg-zinc-800 dark:text-white dark:group-hover/item:bg-blue-500">
				{Icon && <Icon className="h-5 w-5" />}
			</div>
			<div className="flex flex-col overflow-hidden">
				<span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
					{section.title}
				</span>
				<span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
					{section.description}
				</span>
			</div>
			<ArrowRight className="ml-auto h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100 text-blue-600 dark:text-blue-400" />
		</Link>
	);
};
