"use client";

import dynamic from "next/dynamic";
import { useMobileDetect } from "@/hooks/use-mobile-detect";
const SplashCursor = dynamic(
  () => import("@workspace/ui/components/splash-cursor"),
  { 
    ssr: false, // Disable SSR for client-only WebGL component
    loading: () => null // No loading state needed
  }
);

// Lazy load sections for progressive loading
const HeroSection = dynamic(() => import("./components/HeroSection"));
const ProblemSection = dynamic(() => import("./components/ProblemSection"));
const SolutionSection = dynamic(() => import("./components/SolutionSection"));
const FeaturesSection = dynamic(() => import("./components/FeaturesSection"));
const Footer = dynamic(() => import("./components/Footer"));

// Navbar loads immediately (above the fold and critical)
import Navbar from "./components/Navbar";

export default function LandingPage() {
  const { isMobile } = useMobileDetect();

  return (
    <main className="min-h-screen ">
      {/* Only render SplashCursor on medium+ devices (≥768px) for performance */}
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
