"use client";

import { SignInButton } from "@clerk/nextjs";
import { cn } from "@workspace/ui";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const navLinks = [
	{ href: "#problem", label: "Problem" },
	{ href: "#solution", label: "Solution" },
	{ href: "#features", label: "Features" },
	{ href: "#testimonials", label: "Stories" },
];

const ShimmerButton = ({ children, className, ...props }: any) => {
	return (
		<button
			className={cn(
				"group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-full bg-foreground px-6 font-medium text-background transition-all hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
				className,
			)}
			{...props}
		>
			<span className="flex items-center gap-2">{children}</span>
		</button>
	);
};

const DesktopNavLink = ({ href, label }: { href: string; label: string }) => {
	return (
		<Link
			href={href}
			className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-foreground/5 rounded-full"
		>
			{label}
		</Link>
	);
};

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					setIsScrolled(window.scrollY > 50);
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
	}, [isMobileMenuOpen]);

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 pointer-events-none">
				<nav
					className={cn(
						"pointer-events-auto flex items-center justify-between rounded-full border border-transparent transition-all duration-300 relative",
						isScrolled
							? "w-[90%] max-w-5xl bg-background/70 backdrop-blur-xl border-gray-300/0 shadow-lg shadow-black/5 py-2 px-4 mt-2"
							: "w-full max-w-7xl bg-transparent py-4 px-6 md:px-8",
					)}
				>
					<div className="flex items-center gap-1 cursor-pointer group">
						<Link href="/" className="flex items-center gap-2 relative z-10">
							<div className="relative h-8 w-8 overflow-hidden rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 p-[1px] shadow-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105">
								<div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-black">
									<Image
										alt="Askly"
										src="/logo.svg"
										width={20}
										height={20}
										className="w-5 h-5"
									/>
								</div>
							</div>
							<span
								className={cn(
									"text-xl font-bold tracking-tight transition-opacity duration-300",
									isScrolled && !isMobileMenuOpen ? "hidden sm:block" : "block",
								)}
							>
								Askly
							</span>
						</Link>
					</div>

					<div className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
						<div className="flex items-center p-1 rounded-full">
							{navLinks.map((link) => (
								<DesktopNavLink key={link.href} {...link} />
							))}
						</div>
					</div>

					<div className="flex items-center gap-3">
						{mounted && (
							<button
								onClick={toggleTheme}
								className="relative group flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-colors"
								aria-label="Toggle theme"
							>
								{theme === "dark" ? (
									<Sparkles className="h-4 w-4 text-yellow-400 fill-yellow-400/20" />
								) : (
									<div className="h-3 w-3 rounded-full bg-slate-800" />
								)}
							</button>
						)}

						<div className="hidden md:block">
							<SignInButton mode="modal">
								<ShimmerButton>Sign In</ShimmerButton>
							</SignInButton>
						</div>

						<button
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden relative z-50 p-2 text-foreground"
						>
							{isMobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</button>
					</div>
				</nav>
			</header>

			{isMobileMenuOpen && (
				<div className="fixed inset-0 z-40 flex flex-col bg-background/95 backdrop-blur-md pt-28 px-6 md:hidden">
					<div className="flex flex-col gap-4">
						{navLinks.map((link) => (
							<div key={link.href}>
								<Link
									href={link.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className="group flex items-center justify-between text-2xl font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground"
								>
									{link.label}
									<ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
								</Link>
								<div className="h-px w-full bg-border/50 mt-4" />
							</div>
						))}
					</div>

					<div className="mt-auto mb-10 flex flex-col gap-4">
						<SignInButton mode="modal">
							<button className="w-full rounded-xl bg-foreground py-4 text-lg font-medium text-background transition-transform active:scale-95">
								Get Started Now
							</button>
						</SignInButton>

						<p className="text-center text-xs text-muted-foreground">
							Experience the future of interaction.
						</p>
					</div>
				</div>
			)}
		</>
	);
}
