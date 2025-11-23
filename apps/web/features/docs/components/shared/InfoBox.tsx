"use client";

import type { LucideIcon } from "lucide-react";
import type React from "react";

interface InfoBoxProps {
	icon: LucideIcon;
	title: string;
	children: React.ReactNode;
}

export const InfoBox = ({ icon: Icon, title, children }: InfoBoxProps) => (
	<div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3">
		<Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
		<div className="space-y-1">
			<h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
				{title}
			</h4>
			<div className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
				{children}
			</div>
		</div>
	</div>
);
