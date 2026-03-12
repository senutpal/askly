"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui";
import { ChevronRight } from "lucide-react";
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
 * MobileMenu - Mobile navigation menu
 * No framer-motion, uses CSS transitions
 */
export const MobileMenu = React.memo<MobileMenuProps>(
	({ isOpen, links, onClose }) => {
		const handleLinkClick = useCallback(() => {
			onClose();
		}, [onClose]);

		if (!isOpen) return null;

		return (
			<div className="fixed inset-0 z-40 min-h-screen bg-background md:hidden flex flex-col">
				<div className="container mx-auto px-6 pt-28 pb-10 flex flex-col h-full justify-between">
					<div className="flex flex-col space-y-6">
						{links.map((link) => (
							<div key={link.href}>
								<Link
									href={link.href}
									onClick={handleLinkClick}
									className="group flex items-center justify-between text-3xl font-semibold text-foreground/80 hover:text-primary transition-colors"
									style={{ WebkitTapHighlightColor: "transparent" }}
								>
									<span>{link.label}</span>
									<ChevronRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary" />
								</Link>
								<div className="h-px w-full bg-border/30 mt-4" />
							</div>
						))}
					</div>

					<div className="flex flex-col space-y-6">
						<SignInButton mode="modal">
							<Button
								className="w-full h-12 text-lg font-medium rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-95"
								style={{ WebkitTapHighlightColor: "transparent" }}
							>
								Sign In
							</Button>
						</SignInButton>

						<p className="text-center text-xs text-muted-foreground pt-4">
							&copy; {new Date().getFullYear()} Askly Inc. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		);
	},
);

MobileMenu.displayName = "MobileMenu";
