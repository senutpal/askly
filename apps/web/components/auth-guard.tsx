"use client";

import { RedirectToSignIn } from "@clerk/nextjs";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { AuthLayout } from "@/features/auth";

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
				<RedirectToSignIn />
			</Unauthenticated>
		</>
	);
};
