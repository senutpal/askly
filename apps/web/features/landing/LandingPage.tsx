"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useMobileDetect } from "@/hooks/use-mobile-detect";

// Critical above-fold component - load immediately
import Navbar from "./components/Navbar";

// SplashCursor - client-side only, no SSR
const SplashCursor = dynamic(
	() => import("@workspace/ui/components/splash-cursor"),
	{
		ssr: false,
		loading: () => null,
	},
);

// Hero - above-fold, high priority
const HeroSection = dynamic(() => import("./components/HeroSection"), {
	loading: () => (
		<div className="min-h-screen flex items-center justify-center">
			<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
		</div>
	),
});

// Below-fold sections - lazy load with lower priority
const ProblemSection = dynamic(() => import("./components/ProblemSection"), {
	loading: () => <div className="min-h-screen" />,
	ssr: true,
});

const SolutionSection = dynamic(() => import("./components/SolutionSection"), {
	loading: () => <div className="min-h-screen" />,
	ssr: true,
});

const FeaturesSection = dynamic(() => import("./components/FeaturesSection"), {
	loading: () => <div className="min-h-screen" />,
	ssr: true,
});

const Footer = dynamic(() => import("./components/Footer"), {
	loading: () => <div className="min-h-[400px]" />,
	ssr: true,
});

export default function LandingPage() {
	const { isMobile } = useMobileDetect();

	return (
		<main className="min-h-screen">
			{/* Navbar - critical, always rendered */}
			<Navbar />

			{/* SplashCursor - desktop only, non-critical */}
			{!isMobile && (
				<Suspense fallback={null}>
					<SplashCursor />
				</Suspense>
			)}

			{/* Above-fold content - high priority */}
			<Suspense
				fallback={
					<div className="min-h-screen flex items-center justify-center">
						<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
					</div>
				}
			>
				<HeroSection />
			</Suspense>

			{/* Below-fold sections - progressive loading */}
			<Suspense fallback={<div className="min-h-screen" />}>
				<ProblemSection />
			</Suspense>

			<Suspense fallback={<div className="min-h-screen" />}>
				<SolutionSection />
			</Suspense>

			<Suspense fallback={<div className="min-h-screen" />}>
				<FeaturesSection />
			</Suspense>

			<Suspense fallback={<div className="min-h-[400px]" />}>
				<Footer />
			</Suspense>
		</main>
	);
}
