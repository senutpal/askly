"use client";

import { SignInButton } from "@clerk/nextjs";
import { cn } from "@workspace/ui";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion, useScroll } from "motion/react";
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
			<div className="absolute inset-0 -z-10 animate-[shimmer_2s_infinite] bg-[linear-gradient(110deg,#00000000,45%,#ffffff50,55%,#00000000)]" />
			<span className="flex items-center gap-2">{children}</span>
		</button>
	);
};

const DesktopNavLink = ({ href, label }: { href: string; label: string }) => {
	const [isHovered, setHovered] = useState(false);

	return (
		<Link
			href={href}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
		>
			{isHovered && (
				<motion.span
					layoutId="nav-pill"
					className="absolute inset-0 -z-10 rounded-full bg-foreground/5 dark:bg-foreground/10"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{ type: "spring", stiffness: 350, damping: 25 }}
				/>
			)}
			{label}
		</Link>
	);
};

export default function Navbar() {
	const { scrollY } = useScroll();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		const unsubscribe = scrollY.on("change", (latest) => {
			setIsScrolled(latest > 50);
		});
		setMounted(true);
		return () => unsubscribe();
	}, [scrollY]);

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}, [isMobileMenuOpen]);

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<>
			<motion.header
				className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 pointer-events-none"
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
			>
				<motion.nav
					layout
					className={cn(
						"pointer-events-auto flex items-center justify-between rounded-full border border-transparent transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative",
						isScrolled
							? "w-[90%] max-w-5xl bg-background/70 backdrop-blur-xl border-gray-300/0 shadow-lg shadow-black/5 py-2 px-4 mt-2"
							: "w-full max-w-7xl bg-transparent py-4 px-6 md:px-8",
					)}
					style={{
						backdropFilter: isScrolled ? "blur(16px) saturate(180%)" : "none",
					}}
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
						<div
							className={cn(
								"flex items-center p-1 rounded-full transition-all duration-500",
								isScrolled ? "bg-muted/0" : "bg-muted/0",
							)}
						>
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
								<motion.div
									initial={false}
									animate={{
										rotate: theme === "dark" ? 180 : 0,
										scale: theme === "dark" ? 1 : 0,
									}}
									className="absolute"
								>
									<Sparkles className="h-4 w-4 text-yellow-400 fill-yellow-400/20" />
								</motion.div>
								<motion.div
									initial={false}
									animate={{
										rotate: theme === "dark" ? 0 : -180,
										scale: theme === "dark" ? 0 : 1,
									}}
									className="absolute"
								>
									<div className="h-3 w-3 rounded-full bg-slate-800" />
								</motion.div>
							</button>
						)}

						<div className="hidden md:block">
							<SignInButton mode="modal">
								<ShimmerButton>Sign In</ShimmerButton>
							</SignInButton>
						</div>

						<motion.button
							whileTap={{ scale: 0.9 }}
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="md:hidden relative z-50 p-2 text-foreground"
						>
							<AnimatePresence mode="wait">
								{isMobileMenuOpen ? (
									<motion.div
										key="close"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<X className="h-6 w-6" />
									</motion.div>
								) : (
									<motion.div
										key="menu"
										initial={{ rotate: 90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: -90, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<Menu className="h-6 w-6" />
									</motion.div>
								)}
							</AnimatePresence>
						</motion.button>
					</div>
				</motion.nav>
			</motion.header>

			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
						animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
						exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
						transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
						className="fixed inset-0 z-40 flex flex-col bg-background/95 backdrop-blur-3xl pt-28 px-6 md:hidden"
					>
						{/* Background Gradients for Luxury Feel */}
						<div className="absolute top-0 right-0 -z-10 h-[50vh] w-[50vw] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
						<div className="absolute bottom-0 left-0 -z-10 h-[50vh] w-[50vw] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

						<div className="flex flex-col gap-4">
							{navLinks.map((link, idx) => (
								<motion.div
									key={link.href}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{
										delay: 0.1 + idx * 0.05,
										type: "spring",
										stiffness: 300,
										damping: 24,
									}}
								>
									<Link
										href={link.href}
										onClick={() => setIsMobileMenuOpen(false)}
										className="group flex items-center justify-between text-2xl font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
										<ArrowRight className="h-5 w-5 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
									</Link>
									<div className="h-px w-full bg-border/50 mt-4" />
								</motion.div>
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
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
