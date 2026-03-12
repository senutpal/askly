"use client";

import React from "react";

/**
 * FeaturesHeader - Section header with title and description
 * No animations
 */
export const FeaturesHeader = React.memo(() => {
	return (
		<div className="max-w-3xl mb-24">
			<div className="flex items-center gap-3 mb-6">
				<div className="h-[1px] w-12 bg-foreground/30" />
				<span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
					System Capabilities
				</span>
			</div>

			<h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground mb-8 leading-[1.1]">
				Built for the <br />
				<span className="text-transparent bg-clip-text bg-gradient-to-b from-indigo-400 to-violet-600 dark:from-indigo-300 dark:to-violet-500">
					Intelligence Era.
				</span>
			</h2>
			<p className="text-lg md:text-xl leading-relaxed max-w-2xl text-muted-foreground">
				A unified cognitive architecture designed to handle the complexities of modern communication at enterprise scale.
			</p>
		</div>
	);
});

FeaturesHeader.displayName = "FeaturesHeader";
