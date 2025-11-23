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

export const MobileMenu = React.memo<MobileMenuProps>(
	({ isOpen, links, onClose }) => {
		const handleLinkClick = useCallback(() => {
			onClose();
		}, [onClose]);

		return (
			<AnimatePresence mode="wait">
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 0.2,
							ease: [0.4, 0, 0.2, 1],
						}}
						className="fixed inset-0 z-40 min-h-screen bg-background md:hidden flex flex-col"
						style={{ willChange: "opacity" }}
					>
						<motion.div
							className="container mx-auto px-6 pt-28 pb-10 flex flex-col h-full justify-between"
							initial={{ y: -10 }}
							animate={{ y: 0 }}
							transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
							style={{ willChange: "transform" }}
						>
							<div className="flex flex-col space-y-6">
								{links.map((link, index) => (
									<motion.div
										key={link.href}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{
											delay: index * 0.05,
											duration: 0.2,
											ease: [0.4, 0, 0.2, 1],
										}}
										style={{ willChange: "transform, opacity" }}
									>
										<Link
											href={link.href}
											onClick={handleLinkClick}
											className="group flex items-center justify-between text-3xl font-semibold text-foreground/80 hover:text-primary transition-colors"
										>
											<span>{link.label}</span>
											<ChevronRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary will-change-transform" />
										</Link>

										<div className="h-px w-full bg-border/30 mt-4" />
									</motion.div>
								))}
							</div>

							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.15, duration: 0.2 }}
								className="flex flex-col space-y-6"
								style={{ willChange: "opacity" }}
							>
								<SignInButton mode="modal">
									<Button className="w-full h-12 text-lg font-medium rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all ">
										Sign In
									</Button>
								</SignInButton>

								<p className="text-center text-xs text-muted-foreground pt-4">
									© 2024 Askly Inc. All rights reserved.
								</p>
							</motion.div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		);
	},
);

MobileMenu.displayName = "MobileMenu";
