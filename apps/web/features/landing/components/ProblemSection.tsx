"use client";

import { TopographyPattern } from "@workspace/ui";
import {
	Clock,
	Languages,
	MessageSquareX,
	TrendingDown,
	Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
			"Critical updates die in email chains. When information doesn't flow, opportunities are missed and confusion becomes culture.",
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

/**
 * ProblemSection - Scroll-based card stack section
 * Simplified: uses IntersectionObserver instead of framer-motion useScroll
 */
export default function ProblemSection() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeCard, setActiveCard] = useState(0);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const rect = container.getBoundingClientRect();
			const containerHeight = container.offsetHeight;
			const scrolled = -rect.top;
			const progress = Math.max(0, Math.min(1, scrolled / (containerHeight - window.innerHeight)));
			const cardCount = problems.length;
			const step = 1 / cardCount;
			const index = Math.min(Math.floor(progress / step), cardCount - 1);
			setActiveCard(index);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const activeProblem = problems[activeCard] || problems[0];

	return (
		<section
			id="problem"
			className="relative text-neutral-900 dark:text-white"
		>
			<TopographyPattern />

			<div ref={containerRef} className="relative h-[250vh]">
				<div className="sticky top-0 h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden px-6 md:px-12 lg:px-24 py-12">
					{/* Narrative - Left Side */}
					<div className="w-full lg:w-1/2 h-full flex flex-col justify-start md:justify-center z-10 mb-12 lg:mb-0 relative">
						<div className="lg:pl-12 space-y-8 max-w-lg">
							<div>
								<h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-black/60 to-black dark:from-neutral-400 dark:to-neutral-300">
									Campus communication <br />
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-neutral-800 dark:from-neutral-500 dark:to-neutral-300">
										is broken.
									</span>
								</h2>
							</div>

							<div className="relative min-h-[180px]">
								<div className="absolute top-0 left-0 transition-opacity duration-300">
									<h3 className={`text-2xl font-semibold mb-4 bg-gradient-to-b text-transparent bg-clip-text ${activeProblem?.accent}`}>
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

					{/* Card Stack - Right Side */}
					<div className="w-full lg:w-1/2 h-[20vh] md:h-[50vh] lg:h-full flex items-center justify-center lg:justify-end">
						<div className="relative w-full max-w-md aspect-square">
							{problems.map((card, index) => {
								const isActive = index === activeCard;
								const isPast = index < activeCard;

								return (
									<div
										key={card.id}
										className={`absolute inset-0 rounded-3xl p-1 h-[250px] md:h-full bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-lg transition-all duration-300 ease-out ${isActive ? "z-30" : "z-0"} ${isActive ? card.shadow : ""}`}
										style={{
											transform: `translateY(${isActive ? 0 : isPast ? -40 * (activeCard - index) : 15 * (index - activeCard)}px) scale(${isActive ? 1 : 0.95})`,
											opacity: isActive ? 1 : isPast ? (index === activeCard - 1 ? 0.6 : 0) : 0.3,
										}}
									>
										<div className="relative h-full w-full rounded-[20px] bg-white dark:bg-neutral-900 overflow-hidden flex flex-col justify-between p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
											<div className="relative z-10 flex justify-between items-start">
												<div className={`p-3 rounded-2xl bg-gradient-to-br shadow-lg text-white ${card.accent}`}>
													<card.icon className="w-6 h-6" />
												</div>
											</div>
											<div className="relative z-10 mt-auto space-y-6">
												<div>
													<h4 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
														{card.subtitle}
													</h4>
													<h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
														{card.stat}
														<span className="text-lg md:text-xl text-neutral-500 dark:text-neutral-500 font-medium ml-2">
															{card.statLabel}
														</span>
													</h3>
												</div>
												<div className="space-y-2">
													<div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
														<div
															className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${card.accent}`}
															style={{ width: isActive ? "85%" : "0%" }}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
