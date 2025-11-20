"use client";

import dynamic from "next/dynamic";
import { useMobileDetect } from "@/hooks/use-mobile-detect";

// Lazy load heavy components for better code splitting and performance
// SplashCursor is the heaviest (WebGL fluid simulation), only load on medium+ devices
const SplashCursor = dynamic(
  () => import("../../../../packages/ui/src/components/splash-cursor"),
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
