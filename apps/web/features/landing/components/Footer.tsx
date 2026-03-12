"use client";

import { CrossDotPattern } from "@workspace/ui";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import React from "react";
import { FooterBottom } from "./FooterBottom";
import { FooterBrand } from "./FooterBrand";
import { FooterNav } from "./FooterNav";
import { SocialButtons } from "./SocialButtons";

const productLinks = [
	{ label: "Problem", href: "#problem" },
	{ label: "Features", href: "#features" },
	{ label: "How It Works", href: "/docs" },
];

const socialLinks = [
	{ icon: Twitter, href: "https://twitter.com/askly", label: "Twitter" },
	{ icon: Github, href: "https://github.com/askly", label: "GitHub" },
	{ icon: Linkedin, href: "https://linkedin.com/company/askly", label: "LinkedIn" },
	{ icon: Mail, href: "mailto:hello@askly.ai", label: "Email" },
];

/**
 * Footer - Main footer section
 * No parallax or ambient background animations
 */
export default function Footer() {
	return (
		<footer className="relative w-full overflow-hidden text-gray-900 dark:text-white pt-24 pb-12">
			<CrossDotPattern />

			<div className="max-w-[1232px] mx-auto xl:px-0 md:px-12 px-6 lg:px-24 sm:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-8 border-b border-gray-200/50 dark:border-white/10 pb-10">
					<FooterBrand />
					<FooterNav links={productLinks} />

					<div className="lg:col-span-7">
						<SocialButtons
							socialLinks={socialLinks}
							className="hidden lg:flex gap-4 mt-12"
						/>
					</div>

					<div className="lg:col-span-5">
						<SocialButtons
							socialLinks={socialLinks}
							className="flex lg:hidden gap-4 mt-12"
						/>
					</div>
				</div>

				<FooterBottom />
			</div>
		</footer>
	);
}
