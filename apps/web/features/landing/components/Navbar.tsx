"use client";

import { Menu, X } from "lucide-react";
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

	useEffect(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					setIsScrolled(window.scrollY >= 20);
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

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

	const navbarClasses = useMemo(
		() =>
			`fixed w-full z-50 transition-colors duration-200 ${
				isScrolled || isMobileMenuOpen
					? "bg-background/80 backdrop-blur-md border-b border-border/40"
					: "bg-transparent"
			}`,
		[isScrolled, isMobileMenuOpen],
	);

	return (
		<nav className={navbarClasses}>
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
							{isMobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
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
