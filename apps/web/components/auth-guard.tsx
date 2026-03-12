"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { AuthLayout, LandingLayout } from "@/features/auth";
import LandingPage from "@/features/landing/LandingPage";
import Loader from "@/features/landing/Loader";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthReady, setIsAuthReady] = useState(false);

	useEffect(() => {
		if (isLoading) {
			document.body.style.overflow = "hidden";
			window.scrollTo(0, 0);
		} else {
			document.body.style.overflow = "auto";
		}
	}, [isLoading]);

	const handleLoaderComplete = () => {
		if (isAuthReady) {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isAuthReady && !isLoading) {
			return;
		}
		if (isAuthReady) {
			setIsLoading(false);
		}
	}, [isAuthReady, isLoading]);

	return (
		<>
			{isLoading && <Loader onComplete={handleLoaderComplete} />}

			<AuthLoading>
				<div className="hidden" />
			</AuthLoading>

			<Authenticated>
				<AuthReadySignal onReady={() => setIsAuthReady(true)} />
				<AuthLayout>{children}</AuthLayout>
			</Authenticated>

			<Unauthenticated>
				<AuthReadySignal onReady={() => setIsAuthReady(true)} />
				<LandingLayout>
					<LandingPage />
				</LandingLayout>
			</Unauthenticated>
		</>
	);
};

const AuthReadySignal = ({ onReady }: { onReady: () => void }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onReady();
		}, 50);
		return () => clearTimeout(timer);
	}, [onReady]);
	return null;
};
