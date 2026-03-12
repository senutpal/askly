"use client";

import React from "react";

/**
 * FooterBrand - Brand section with tagline
 * No animations
 */
export const FooterBrand = React.memo(() => {
	return (
		<div className="lg:col-span-7 flex flex-col justify-between">
			<div className="space-y-8">
				<h2 className="text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight text-gray-900 dark:text-white max-w-2xl">
					Transforming campus communication with{" "}
					<span className="text-gray-400 dark:text-neutral-500">
						intelligent AI.
					</span>
				</h2>

				<p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
					Making education accessible in every language. Built for the
					institutions of tomorrow.
				</p>
			</div>
		</div>
	);
});

FooterBrand.displayName = "FooterBrand";
