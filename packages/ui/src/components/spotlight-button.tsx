import { motion } from "motion/react";
import React from "react";
import { cn } from "../lib/utils";

interface SpotlightButtonProps {
	children: React.ReactNode;
	className?: string;
}

/**
 * SpotlightButton - Animated button with spotlight effect on hover
 * Features a sliding gradient animation and scale effects
 */
export const SpotlightButton = React.memo<SpotlightButtonProps>(
	({ children, className }) => {
		return (
			<motion.button
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				className={cn(
					"group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-neutral-950 dark:bg-white px-8 font-medium text-white dark:text-black transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-50",
					className,
				)}
			>
				<div className="absolute inset-0 -z-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position] duration-[1500ms] ease-in-out group-hover:bg-[position:200%_0,0_0]" />
				{children}
			</motion.button>
		);
	},
);

SpotlightButton.displayName = "SpotlightButton";
