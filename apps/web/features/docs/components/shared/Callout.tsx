"use client";

import { AlertCircle, Server } from "lucide-react";
import type React from "react";

interface CalloutProps {
	variant?: "info" | "warning";
	children: React.ReactNode;
}

export const Callout = ({ variant = "info", children }: CalloutProps) => {
	const styles =
		variant === "warning"
			? "bg-yellow-50/50 border-yellow-200 text-yellow-900 dark:bg-yellow-900/10 dark:border-yellow-900/30 dark:text-yellow-200"
			: "bg-blue-50/50 border-blue-200 text-blue-900 dark:bg-blue-900/10 dark:border-blue-900/30 dark:text-blue-200";
	const Icon = variant === "warning" ? AlertCircle : Server;
	return (
		<div className={`p-4 rounded-lg border flex gap-3 ${styles} my-4`}>
			<Icon className="w-5 h-5 shrink-0 opacity-70" />
			<div className="text-sm leading-relaxed">{children}</div>
		</div>
	);
};
