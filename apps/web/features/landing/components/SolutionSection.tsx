"use client";

import { RadialPattern } from "@workspace/ui";
import React from "react";
import { AvailabilityCard } from "./AvailabilityCard";
import { MultilingualCard } from "./MultilingualCard";
import { ROICard } from "./ROICard";
import { SetupCard } from "./SetupCard";
import { SolutionHeader } from "./SolutionHeader";

/**
 * SolutionSection - Solution showcase section
 * Optimized by removing unused scroll effects and adding CSS containment
 */
export default function SolutionRedesign() {
	return (
		<section id="solution" className="relative mt-16 md:mt-0 overflow-hidden">
			<RadialPattern />
			<div className="container mx-auto px-4 sm:px-6 relative z-10">
				<SolutionHeader />
				<div
					className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 max-w-7xl mx-auto"
					style={{ contain: "layout" }}
				>
					<MultilingualCard />
					<AvailabilityCard />
					<ROICard />
					<SetupCard />
				</div>
			</div>
		</section>
	);
}
