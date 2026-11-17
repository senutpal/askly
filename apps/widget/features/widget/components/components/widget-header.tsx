import { Button, cn } from "@workspace/ui";
import { XIcon } from "lucide-react";
import type React from "react";
import { postToParent } from "../../lib/widget-post-message";

interface WidgetHeaderProps {
	title?: string;
	subtitle?: string;
	className?: string;
	children?: React.ReactNode;
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
	title,
	subtitle,
	className,
	children,
}) => {
	return (
		<header
			className={cn(
				"relative z-10 flex flex-col border-b border-black/5 bg-white/80 px-6 py-5 backdrop-blur-xl transition-all",
				className,
				"pr-14",
			)}
		>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				aria-label="Close chat"
				onClick={() => postToParent("askly:close")}
				className="absolute right-3 top-3 h-8 w-8 rounded-full text-gray-500 hover:bg-black/5 hover:text-gray-700"
			>
				<XIcon className="size-4" />
			</Button>
			{children ? (
				<div>{children}</div>
			) : (
				<div className="flex flex-col gap-0.5">
					{title && (
						<h1 className="text-lg font-semibold tracking-tight text-gray-900">
							{title}
						</h1>
					)}
					{subtitle && (
						<p className="text-xs font-medium text-gray-500">{subtitle}</p>
					)}
				</div>
			)}
		</header>
	);
};
