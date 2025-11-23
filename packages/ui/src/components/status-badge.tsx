import { motion } from "motion/react";
import React from "react";

interface StatusBadgeProps {
	children: React.ReactNode;
}

/**
 * StatusBadge - Animated badge with pulsing indicator
 * Used for showing live/active status
 */
export const StatusBadge = React.memo<StatusBadgeProps>(({ children }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 dark:bg-white/10 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 cursor-default"
		>
			<span className="relative flex h-2 w-2">
				<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
				<span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
			</span>
			<span className="text-xs font-medium text-gray-600 dark:text-gray-300 tracking-wide uppercase">
				{children}
			</span>
		</motion.div>
	);
});

StatusBadge.displayName = "StatusBadge";
