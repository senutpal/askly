"use client";

import React from "react";

/**
 * HeroBackground - Lightweight background for hero section
 * Grid pattern only, no blur effects
 */
export const HeroBackground = React.memo(() => {
	return (
		<div
			className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_80%)]"
			style={{ contain: "layout style paint" }}
		/>
	);
});

HeroBackground.displayName = "HeroBackground";
