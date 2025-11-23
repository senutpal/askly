"use client";

import React from "react";
import { ProblemCard } from "./ProblemCard";

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

interface ProblemStackProps {
	problems: Problem[];
	activeCard: number;
}

/**
 * ProblemStack - Right side card stack visualization
 * Displays stacked problem cards with scroll-based animations
 */
export const ProblemStack = React.memo<ProblemStackProps>(
	({ problems, activeCard }) => {
		return (
			<div className="w-full lg:w-1/2 h-[30vh] md:h-[50vh] lg:h-full flex items-center justify-center lg:justify-end perspective-1000">
				<div className="relative w-full max-w-md aspect-square">
					{problems.map((card, index) => (
						<ProblemCard
							key={card.id}
							card={card}
							index={index}
							activeCard={activeCard}
							total={problems.length}
						/>
					))}
				</div>
			</div>
		);
	},
);

ProblemStack.displayName = "ProblemStack";
