"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AuthLayout } from "@/features/auth";
import LandingPage from "@/features/landing/LandingPage";
import Loader from "@/features/landing/Loader";
import LandingLayout from "@/features/auth/components/layouts/landing-layout";

const MINIMUM_LOADING_TIME = 1500;

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [_canHide, setCanHide] = useState(false);
	const startTimeRef = useRef<number>(Date.now());

	useEffect(() => {
		if (isLoading) {
			document.body.style.overflow = "hidden";
			window.scrollTo(0, 0);
		} else {
			document.body.style.overflow = "auto";
		}
  }, [isLoading]);
  
	useEffect(() => {
		const timer = setTimeout(() => {
			setCanHide(true);
		}, MINIMUM_LOADING_TIME);

		return () => clearTimeout(timer);
	}, []);

	const handleLoaderComplete = () => {
		const elapsed = Date.now() - startTimeRef.current;
		const remaining = MINIMUM_LOADING_TIME - elapsed;

		if (remaining > 0) {
			setTimeout(() => {
				setIsLoading(false);
			}, remaining);
		} else {
			setIsLoading(false);
		}
	};

	return (
		<>
			<AnimatePresence mode="wait">
				{isLoading && <Loader onComplete={handleLoaderComplete} />}
			</AnimatePresence>

			<AuthLoading>
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
