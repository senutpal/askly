"use client";

import { cn } from "@workspace/ui";
import React, { useEffect, useMemo, useRef, useState } from "react";

const messageSets = [
	[
		{ id: 1, role: "user", text: "Until when can we fill out the form?", lang: "English" },
		{ id: 2, role: "ai", text: "Applications close on March 31st.", lang: "English" },
		{ id: 3, role: "user", text: "ফর্ম আমরা কতদিন পর্যন্ত পূরণ করতে পারবো?", lang: "Bengali" },
		{ id: 4, role: "ai", text: "ফর্ম জমা দেওয়ার শেষ তারিখ ৩১ মার্চ।", lang: "Bengali" },
	],
	[
		{ id: 1, role: "user", text: "When is the last date for fee payment?", lang: "English" },
		{ id: 2, role: "ai", text: "You must pay by April 10.", lang: "English" },
		{ id: 3, role: "user", text: "शुल्क कब तक जमा कर सकते हैं?", lang: "Hindi" },
		{ id: 4, role: "ai", text: "शुल्क 10 अप्रैल तक जमा किया जा सकता है।", lang: "Hindi" },
	],
	[
		{ id: 1, role: "user", text: "What time do classes start?", lang: "English" },
		{ id: 2, role: "ai", text: "Classes begin at 9 AM.", lang: "English" },
		{ id: 3, role: "user", text: "क्लास कितने बजे से शुरू होती है?", lang: "Hindi" },
		{ id: 4, role: "ai", text: "क्लास सुबह 9 बजे शुरू होती है।", lang: "Hindi" },
	],
	[
		{ id: 1, role: "user", text: "When can we check into the hostel?", lang: "English" },
		{ id: 2, role: "ai", text: "Check-in starts on July 15.", lang: "English" },
		{ id: 3, role: "user", text: "হোস্টেলে কখন উঠতে পারবো?", lang: "Bengali" },
		{ id: 4, role: "ai", text: "১৫ জুলাই থেকে হোস্টেলে ওঠা যাবে।", lang: "Bengali" },
	],
	[
		{ id: 1, role: "user", text: "How do I get my student ID card?", lang: "English" },
		{ id: 2, role: "ai", text: "You can collect it from the admin office.", lang: "English" },
		{ id: 3, role: "user", text: "আইডी কার্ড কিভাবে মিলবে?", lang: "Hindi" },
		{ id: 4, role: "ai", text: "আইডী কার্ড প্রশাসন কার্যালয় থেকে পাবেন।", lang: "Hindi" },
	],
];

/**
 * ChatSimulation - Chat interface with cycling multilingual messages
 * Uses simple setInterval instead of requestAnimationFrame
 */
export const ChatSimulation = React.memo(() => {
	const getRandomSet = useMemo(
		() => () => messageSets[Math.floor(Math.random() * messageSets.length)],
		[],
	);

	const [currentSet, setCurrentSet] = useState(getRandomSet);
	const [visibleIndex, setVisibleIndex] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			setVisibleIndex((prev) => {
				if (prev < (currentSet?.length ?? 0) - 1) {
					return prev + 1;
				}
				setCurrentSet(getRandomSet());
				return -1;
			});
		}, 3000);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [currentSet, getRandomSet]);

	return (
		<div className="p-6 space-y-4 font-sans">
			<div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
				<div className="flex items-center gap-3">
					<div className="w-3 h-3 rounded-full bg-red-500/80" />
					<div className="w-3 h-3 rounded-full bg-yellow-500/80" />
					<div className="w-3 h-3 rounded-full bg-green-500/80" />
				</div>
			</div>
			<div className="space-y-4 min-h-[280px] sm:h-[240px] md:h-[220px] overflow-hidden relative">
				{currentSet?.slice(0, visibleIndex + 1).map((msg) => (
					<div
						key={`${msg.id}-${msg.text}`}
						className={cn(
							"flex w-full transition-opacity duration-300",
							msg.role === "user" ? "justify-end" : "justify-start",
						)}
					>
						<div
							className={cn(
								"max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm",
								msg.role === "user"
									? "bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-tr-sm"
									: "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/5 rounded-tl-sm",
							)}
						>
							{msg.text}
						</div>
					</div>
				))}
			</div>
		</div>
	);
});

ChatSimulation.displayName = "ChatSimulation";
