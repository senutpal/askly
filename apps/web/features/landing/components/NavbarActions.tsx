"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui";
import React from "react";
import { ModeToggle } from "@/components/mode-toggle";

export const NavbarActions = React.memo(() => {
	return (
		<div className="hidden md:flex items-center space-x-4">
			<ModeToggle />
			<SignInButton mode="modal">
				<Button
					size="sm"
					className="bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
				>
					Sign in
				</Button>
			</SignInButton>
		</div>
	);
});

NavbarActions.displayName = "NavbarActions";
