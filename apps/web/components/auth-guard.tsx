"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import LandingLayout from "@/modules/auth/ui/layouts/landing-layout";
import LandingPage from "@/modules/landing/LandingPage";
import Loader from "@/modules/landing/Loader";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

const MINIMUM_LOADING_TIME = 1500; // 3 seconds minimum

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [canHide, setCanHide] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  // Lock scroll when loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  // Ensure minimum loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanHide(true);
    }, MINIMUM_LOADING_TIME);

    return () => clearTimeout(timer);
  }, []);

  // Handle loader completion
  const handleLoaderComplete = () => {
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = MINIMUM_LOADING_TIME - elapsed;

    if (remaining > 0) {
      // Wait for the remaining time before hiding
      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    } else {
      // Time already exceeded, hide immediately
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      <AuthLoading>
        {/* Keep empty or minimal during auth check - loader handles the UI */}
        <div className="hidden" />
      </AuthLoading>
      <Authenticated>
        <AuthLayout>{children}</AuthLayout>
      </Authenticated>
      <Unauthenticated>
        <LandingLayout>
          <LandingPage />
        </LandingLayout>
      </Unauthenticated>
    </>
  );
};
