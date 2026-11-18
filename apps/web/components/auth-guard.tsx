"use client";

import { RedirectToSignIn, useAuth } from "@clerk/nextjs";
import { Button } from "@workspace/ui";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { AuthLayout } from "@/features/auth";

const UnauthenticatedFallback = () => {
	const { isSignedIn, signOut } = useAuth();

	if (isSignedIn) {
		return (
			<AuthLayout>
				<div className="flex flex-col items-center gap-4 text-center">
					<p className="text-sm text-muted-foreground">
						Your session could not be verified. Please sign out and sign in
						again.
					</p>
					<Button onClick={() => signOut()}>Sign out</Button>
				</div>
			</AuthLayout>
		);
	}

	return <RedirectToSignIn />;
};

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
				<UnauthenticatedFallback />
			</Unauthenticated>
		</>
	);
};
