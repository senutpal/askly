"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import React, { useCallback } from "react";

interface NavLink {
	href: string;
	label: string;
}

interface MobileMenuProps {
	isOpen: boolean;
	links: NavLink[];
	onClose: () => void;
}

/**
 * MobileMenu - Optimized mobile navigation menu
 * Uses GPU acceleration and simplified animations for smooth performance
 */
export const MobileMenu = React.memo<MobileMenuProps>(
	({ isOpen, links, onClose }) => {
		const handleLinkClick = useCallback(() => {
			onClose();
		}, [onClose]);

		return (
			<AnimatePresence mode="wait">
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{
							duration: 0.2,
							ease: [0.4, 0, 0.2, 1],
						}}
						className="fixed inset-0 z-40 min-h-screen bg-background md:hidden flex flex-col"
						style={{
							willChange: "opacity, transform",
							transform: "translate3d(0, 0, 0)", // Force GPU acceleration
						}}
					>
						<div
							className="container mx-auto px-6 pt-28 pb-10 flex flex-col h-full justify-between"
							style={{ contain: "layout style paint" }}
						>
							<div className="flex flex-col space-y-6">
								{links.map((link) => (
									<div key={link.href}>
										<Link
											href={link.href}
											onClick={handleLinkClick}
											className="group flex items-center justify-between text-3xl font-semibold text-foreground/80 hover:text-primary transition-colors `"
											style={{ WebkitTapHighlightColor: "transparent" }}
										>
											<span>{link.label}</span>
											<ChevronRight
												className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary"
												style={{ willChange: "transform, opacity" }}
											/>
										</Link>
										<div className="h-px w-full bg-border/30 mt-4" />
									</div>
								))}
							</div>

							{/* Footer CTA */}
							<div className="flex flex-col space-y-6">
								<SignInButton mode="modal">
									<Button
										className="w-full h-12 text-lg font-medium rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-95"
										style={{
											WebkitTapHighlightColor: "transparent",
											willChange: "transform",
										}}
									>
										Sign In
									</Button>
								</SignInButton>

								<p className="text-center text-xs text-muted-foreground pt-4">
									© {new Date().getFullYear()} Askly Inc. All rights reserved.
								</p>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		);
	},
);

MobileMenu.displayName = "MobileMenu";
