import SplashCursor from "../../../../packages/ui/src/components/splash-cursor";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen ">
      <div>
        <Navbar />
        <HeroSection />
        <ProblemSection />
        <SplashCursor />
      </div>
      <SolutionSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
