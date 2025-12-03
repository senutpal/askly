"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AuthLayout, LandingLayout } from "@/features/auth";
import LandingPage from "@/features/landing/LandingPage";
import Loader from "@/features/landing/Loader";


export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthReady, setIsAuthReady] = useState(false);
	const startTimeRef = useRef<number>(Date.now());

	useEffect(() => {
		if (isLoading) {
			document.body.style.overflow = "hidden";
			window.scrollTo(0, 0);
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isLoading]);

	const handleLoaderComplete = () => {
		// Only hide loader if auth is ready
		if (isAuthReady) {
			setIsLoading(false);
		}
	};

	// Hide loader once auth completes
	useEffect(() => {
		if (isAuthReady && !isLoading) {
			// Already hidden
			return;
		}
		if (isAuthReady) {
			setIsLoading(false);
		}
	}, [isAuthReady, isLoading]);

	return (
		<>
			<AnimatePresence mode="wait">
				{isLoading && <Loader onComplete={handleLoaderComplete} />}
			</AnimatePresence>

			<AuthLoading>
				<div className="hidden" />
			</AuthLoading>

			<Authenticated>
				{/* Signal that auth is ready */}
				<AuthReadySignal onReady={() => setIsAuthReady(true)} />
				<AuthLayout>{children}</AuthLayout>
			</Authenticated>

			<Unauthenticated>
				{/* Signal that we're ready (no auth needed) */}
				<AuthReadySignal onReady={() => setIsAuthReady(true)} />
				<LandingLayout>
					<LandingPage />
				</LandingLayout>
			</Unauthenticated>
		</>
	);
};

// Helper component to signal when content is ready
const AuthReadySignal = ({ onReady }: { onReady: () => void }) => {
	useEffect(() => {
		// Small delay to ensure components are mounted
		const timer = setTimeout(() => {
			onReady();
		}, 50);
		return () => clearTimeout(timer);
	}, [onReady]);
	return null;
};
