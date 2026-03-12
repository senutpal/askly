"use client";

import { AlertBadge, cn } from "@workspace/ui";
import { AlertCircle } from "lucide-react";
import React from "react";

interface Problem {
	id: string;
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	subtitle: string;
	description: string;
	stat: string;
	statLabel: string;
	accent: string;
	shadow: string;
}

interface ProblemNarrativeProps {
	activeCard: number;
	problems: Problem[];
}

/**
 * ProblemNarrative - Left side narrative content
 * No framer-motion animations
 */
export const ProblemNarrative = React.memo<ProblemNarrativeProps>(
	({ activeCard, problems }) => {
		const activeProblem = problems[activeCard] || problems[0];

		return (
			<div className="w-full lg:w-1/2 h-full flex flex-col justify-start md:justify-center z-10 mb-12 lg:mb-0 relative">
				<div className="lg:pl-12 space-y-8 max-w-lg">
					<div>
						<div className="hidden md:block">
							<AlertBadge
								text="Critical Analysis"
								icon={AlertCircle}
								variant="error"
							/>
						</div>
						<h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-black/60 to-black dark:from-neutral-400 dark:to-neutral-300">
							Campus communication <br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-neutral-800 dark:from-neutral-500 dark:to-neutral-300">
								is broken.
							</span>
						</h2>
					</div>

					<div className="relative min-h-[180px]">
						<div className="absolute top-0 left-0">
							<h3
								className={cn(
									"text-2xl font-semibold mb-4 bg-gradient-to-b text-transparent bg-clip-text",
									activeProblem?.accent,
								)}
							>
								{activeProblem?.title}
							</h3>
							<p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
								{activeProblem?.description}
							</p>
						</div>
					</div>

					<div className="hidden lg:flex items-center gap-4 text-sm font-medium text-neutral-500 dark:text-neutral-500">
						<span>0{activeCard + 1}</span>
						<div className="w-12 h-[1px] bg-neutral-300 dark:bg-neutral-700" />
						<span>0{problems.length}</span>
					</div>
				</div>
			</div>
		);
	},
);

ProblemNarrative.displayName = "ProblemNarrative";
