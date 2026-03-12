"use client";

import { SignUpButton } from "@clerk/nextjs";
import { SpotlightButton } from "@workspace/ui";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

/**
 * HeroContent - Left side text content of hero section
 * No animations, instant render
 */
export const HeroContent = React.memo(() => {
	return (
		<div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
			<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 text-xs font-semibold text-blue-600 dark:text-blue-400">
				Community-Driven &bull; Free
			</div>

			<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
				<span className="text-transparent bg-clip-text bg-gradient-to-b from-black/40 to-black dark:from-white dark:to-gray-300">
					Campus Communication
				</span>
				<br />
				<span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-100 dark:to-blue-600 tracking-tight">
					Revolutionized Effortlessly<span className="hidden md:inline">.</span>
				</span>
			</h1>

			<p className="text-lg md:text-xl leading-relaxed max-w-[90%] md:max-w-xl text-muted-foreground">
				The AI-first communication layer for modern institutions.
				Multilingual answers for students, zero overhead for staff.
			</p>

			<div className="flex md:mt-3 flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
				<SignUpButton mode="modal">
					<SpotlightButton className="w-full sm:w-auto shadow-lg shadow-blue-500/20">
						Get Started <ArrowRight className="ml-2 w-4 h-4" />
					</SpotlightButton>
				</SignUpButton>

				<Link href="#features" className="w-full sm:w-auto">
					<button
						className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-8 font-medium text-neutral-900 dark:text-white transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
						type="button"
					>
						View Demo
					</button>
				</Link>
			</div>
		</div>
	);
});

HeroContent.displayName = "HeroContent";
