"use client";

import { SocialButton } from "@workspace/ui";
import type { LucideIcon } from "lucide-react";
import React from "react";

interface SocialLink {
	icon: LucideIcon;
	href: string;
	label: string;
}

interface SocialButtonsProps {
	socialLinks: SocialLink[];
	className?: string;
}

export const SocialButtons = React.memo<SocialButtonsProps>(
	({ socialLinks, className = "" }) => {
		return (
			<div className={className}>
				{socialLinks.map((social) => (
					<SocialButton key={social.label} {...social} />
				))}
			</div>
		);
	},
);

SocialButtons.displayName = "SocialButtons";
