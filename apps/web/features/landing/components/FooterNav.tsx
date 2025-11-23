"use client";

import { MagneticLink } from "@workspace/ui";
import { motion } from "motion/react";
import React from "react";
import { useMobileDetect } from "@/hooks/use-mobile-detect";

interface NavLink {
	label: string;
	href: string;
}

interface FooterNavProps {
	links: NavLink[];
}

/**
 * FooterNav - Navigation links column
 * Right-aligned list with magnetic link effects
 * Hidden on mobile devices for better performance
 */
export const FooterNav = React.memo<FooterNavProps>(({ links }) => {
	const { isMobile } = useMobileDetect();

	// Don't render on mobile
	if (isMobile) return null;

	return (
		<div className="lg:col-span-5 flex flex-col lg:items-end lg:text-right justify-end">
			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				className="space-y-1"
			>
				<div className="flex flex-col lg:items-end space-y-3">
					{links.map((link, idx) => (
						<motion.div
							key={link.label}
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1 * idx, duration: 0.5 }}
						>
							<MagneticLink href={link.href}>{link.label}</MagneticLink>
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
});

FooterNav.displayName = "FooterNav";
