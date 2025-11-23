import React from "react";

interface InfoBadgeProps {
	text: string;
	icon?: string;
}

/**
 * InfoBadge - Simple informational badge
 * Used for showing metadata and additional context
 */
export const InfoBadge = React.memo<InfoBadgeProps>(({ text, icon }) => {
	return (
		<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 backdrop-blur-sm">
			{icon && <span>{icon}</span>}
			<span className="font-medium text-xs tracking-wide text-gray-600 dark:text-gray-400">
				{text}
			</span>
		</div>
	);
});

InfoBadge.displayName = "InfoBadge";
