import type { LucideIcon } from "lucide-react";
import React from "react";

interface AlertBadgeProps {
	text: string;
	icon: LucideIcon;
	variant?: "error" | "warning" | "info";
}

/**
 * AlertBadge - Colored badge with icon for alerts and warnings
 * Supports multiple visual variants
 */
export const AlertBadge = React.memo<AlertBadgeProps>(
	({ text, icon: Icon, variant = "error" }) => {
		const variantStyles = {
			error: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
			warning:
				"bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
			info: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
		};

		const iconStyles = {
			error: "text-red-500",
			warning: "text-yellow-500",
			info: "text-blue-500",
		};

		return (
			<div
				className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md ${variantStyles[variant]}`}
			>
				<Icon className={`w-3.5 h-3.5 ${iconStyles[variant]}`} />
				<span className="text-xs font-semibold tracking-wide uppercase">
					{text}
				</span>
			</div>
		);
	},
);

AlertBadge.displayName = "AlertBadge";
