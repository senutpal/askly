"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { NavbarActions } from "./NavbarActions";

const navLinks = [
	{ href: "#problem", label: "Problem" },
	{ href: "#solution", label: "Solution" },
	{ href: "#features", label: "Features" },
	{ href: "/docs", label: "Docs" },
];

// Logo component - memoized to prevent re-renders
const Logo = () => (
	<Link href="/" className="flex items-center space-x-2 z-50">
		<Image
			alt="Logo"
			height={25}
			width={25}
			src="/logo.svg"
			priority
			loading="eager"
		/>
		<span className="text-xl font-bold tracking-tight">Askly</span>
	</Link>
);

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Optimized scroll handler - inline to avoid throttle hook overhead
	useEffect(() => {
		let ticking = false;
		let lastScrollY = 0;

		const handleScroll = () => {
			lastScrollY = window.scrollY;

			if (!ticking) {
				window.requestAnimationFrame(() => {
					setIsScrolled(lastScrollY >= 20);
					ticking = false;
				});
				ticking = true;
			}
		};

		// Passive listener for better scroll performance
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Body overflow management
	useEffect(() => {
		document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isMobileMenuOpen]);

	const toggleMobileMenu = useCallback(() => {
		setIsMobileMenuOpen((prev) => !prev);
	}, []);

	const closeMobileMenu = useCallback(() => {
		setIsMobileMenuOpen(false);
	}, []);

	// Memoize navbar classes
	const navbarClasses = useMemo(
		() =>
			`fixed w-full z-50 transition-all duration-300 ${
				isScrolled || isMobileMenuOpen
					? "bg-background/80 backdrop-blur-md border-b border-border/40"
					: "bg-transparent"
			}`,
		[isScrolled, isMobileMenuOpen],
	);

	return (
		<nav className={navbarClasses} style={{ willChange: "transform" }}>
			<div className="container relative mx-auto px-4 sm:px-6">
				<div className="flex justify-between items-center h-16">
					<Logo />

					<DesktopNav links={navLinks} />

					<NavbarActions />

					<div className="flex items-center md:hidden gap-2 z-50">
						<ModeToggle />
						<button
							className="p-2 rounded-full hover:bg-secondary transition-colors"
							onClick={toggleMobileMenu}
							aria-label="Toggle mobile menu"
							type="button"
						>
							<AnimatePresence mode="wait" initial={false}>
								{isMobileMenuOpen ? (
									<motion.div
										key="close"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.2 }}
										style={{ willChange: "transform, opacity" }}
									>
										<X className="w-6 h-6" />
									</motion.div>
								) : (
									<motion.div
										key="menu"
										initial={{ rotate: 90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: -90, opacity: 0 }}
										transition={{ duration: 0.2 }}
										style={{ willChange: "transform, opacity" }}
									>
										<Menu className="w-6 h-6" />
									</motion.div>
								)}
							</AnimatePresence>
						</button>
					</div>
				</div>
			</div>

			<MobileMenu
				isOpen={isMobileMenuOpen}
				links={navLinks}
				onClose={closeMobileMenu}
			/>
		</nav>
	);
}
