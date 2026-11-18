"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { AuthLayout, LandingLayout } from "@/features/auth";
import LandingPage from "@/features/landing/LandingPage";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<AuthLoading>
				<AuthLayout>{children}</AuthLayout>
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
