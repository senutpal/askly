"use client";

import Link from "next/link";
import React from "react";

interface NavLink {
	label: string;
	href: string;
}

interface FooterNavProps {
	links: NavLink[];
}

export const FooterNav = React.memo<FooterNavProps>(({ links }) => {
	return (
		<div className="hidden lg:flex lg:col-span-5 flex-col lg:items-end lg:text-right justify-end">
			<div className="space-y-1">
				<div className="flex flex-col lg:items-end space-y-3">
					{links.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className="text-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
						>
							{link.label}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
});

FooterNav.displayName = "FooterNav";
