"use client";

import dynamic from "next/dynamic";
import { useMobileDetect } from "@/hooks/use-mobile-detect";

const SplashCursor = dynamic(
	() => import("@workspace/ui/components/splash-cursor"),
	{
		ssr: false, 
		loading: () => null,
	},
);

const HeroSection = dynamic(() => import("./components/HeroSection"));
const ProblemSection = dynamic(() => import("./components/ProblemSection"));
const SolutionSection = dynamic(() => import("./components/SolutionSection"));
const FeaturesSection = dynamic(() => import("./components/FeaturesSection"));
const Footer = dynamic(() => import("./components/Footer"));

import Navbar from "./components/Navbar";

export default function LandingPage() {
	const { isMobile } = useMobileDetect();

	return (
		<main className="min-h-screen ">
			{!isMobile && <SplashCursor />}
			<Navbar />
			<HeroSection />
			<ProblemSection />
			<SolutionSection />
			<FeaturesSection />
			<Footer />
		</main>
	);
}
