"use client";

import { TopographyPattern } from "@workspace/ui";
import {
	Clock,
	Languages,
	MessageSquareX,
	TrendingDown,
	Users,
} from "lucide-react";
import { useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMobileDetect } from "@/hooks/use-mobile-detect";
import { ProblemNarrative } from "./ProblemNarrative";
import { ProblemStack } from "./ProblemStack";

const problems = [
	{
		id: "time",
		icon: Clock,
		title: "The Efficiency Black Hole",
		subtitle: "Time Wasted on Repetition",
		description:
			"Administrative brilliance is being suffocated by repetitive queries. Your staff spends hours functioning as human search engines.",
		stat: "1,000+",
		statLabel: "Hours lost / year",
		accent: "from-red-400 to-orange-500",
		shadow: "shadow-red-500/20",
	},
	{
		id: "wait",
		icon: Users,
		title: "The Friction Point",
		subtitle: "Unacceptable Wait Times",
		description:
			"Students queue for hours for minutes of information. This friction creates a barrier between the institution and the learner, damaging the campus experience.",
		stat: "45m",
		statLabel: "Avg. wait time",
		accent: "from-orange-500 to-amber-500",
		shadow: "shadow-orange-500/20",
	},
	{
		id: "comms",
		icon: MessageSquareX,
		title: "Signal Lost",
		subtitle: "Communication Breakdown",
		description:
			"Critical updates die in email chains. When information doesn't flow, opportunities are missed and confusion becomes the default campus culture.",
		stat: "60%",
		statLabel: "Missed updates",
		accent: "from-amber-500 to-yellow-500",
		shadow: "shadow-amber-500/20",
	},
	{
		id: "lang",
		icon: Languages,
		title: "The Silent Barrier",
		subtitle: "Accessibility Gaps",
		description:
			"Education should have no borders. Yet, non-native speakers face a wall of silence, creating an inequitable environment for international talent.",
		stat: "40%",
		statLabel: "Language friction",
		accent: "from-blue-400 to-blue-600",
		shadow: "shadow-blue-500/20",
	},
	{
		id: "resource",
		icon: TrendingDown,
		title: "Misaligned Potential",
		subtitle: "Resource Drain",
		description:
			"High-value staff are tied up with low-value tasks. It is an invisible tax on your institution's growth and strategic capability.",
		stat: "70%",
		statLabel: "Resource misuse",
		accent: "from-purple-400 to-purple-600",
		shadow: "shadow-indigo-500/20",
	},
];

export default function ProblemSection() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeCard, setActiveCard] = useState(0);
	const { isMobile } = useMobileDetect();

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	useEffect(() => {
		let lastUpdate = 0;
		const throttleDelay = isMobile ? 50 : 16;

		const unsubscribe = scrollYProgress.on("change", (latest) => {
			const now = Date.now();
			if (now - lastUpdate < throttleDelay) return;
			lastUpdate = now;

			const cardCount = problems.length;
			const step = 1 / cardCount;
			const index = Math.min(Math.floor(latest / step), cardCount - 1);
			setActiveCard(index);
		});
		return () => unsubscribe();
	}, [scrollYProgress, isMobile]);

	return (
		<section className="relative text-neutral-900 dark:text-white">
			<TopographyPattern />

			<div
				ref={containerRef}
				className={isMobile ? "relative h-[200vh]" : "relative h-[300vh]"}
			>
				<div className="sticky top-0 h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden px-6 md:px-12 lg:px-24 py-12">
					<ProblemNarrative
						activeCard={activeCard}
						problems={problems}
						scrollYProgress={scrollYProgress}
					/>

					<ProblemStack problems={problems} activeCard={activeCard} />
				</div>
			</div>
		</section>
	);
}
