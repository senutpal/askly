import { cn } from "@workspace/ui";
import type React from "react";

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
			)}
		>
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
