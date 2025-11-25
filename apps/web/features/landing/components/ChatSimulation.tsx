"use client";

import { cn } from "@workspace/ui";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useMobileDetect } from "@/hooks/use-mobile-detect";

// Message data sets for chat simulation
const messageSets = [
	// 1. Admission deadline
	[
		{
			id: 1,
			role: "user",
			text: "Until when can we fill out the form?",
			lang: "English",
		},
		{
			id: 2,
			role: "ai",
			text: "Applications close on March 31st.",
			lang: "English",
		},
		{
			id: 3,
			role: "user",
			text: "ফর্ম আমরা কতদিন পর্যন্ত পূরণ করতে পারবো?",
			lang: "Bengali",
		},
		{
			id: 4,
			role: "ai",
			text: "ফর্ম জমা দেওয়ার শেষ তারিখ ৩১ মার্চ।",
			lang: "Bengali",
		},
	],

	// 2. Fee payment
	[
		{
			id: 1,
			role: "user",
			text: "When is the last date for fee payment?",
			lang: "English",
		},
		{ id: 2, role: "ai", text: "You must pay by April 10.", lang: "English" },
		{
			id: 3,
			role: "user",
			text: "शुल्क कब तक जमा कर सकते हैं?",
			lang: "Hindi",
		},
		{
			id: 4,
			role: "ai",
			text: "शुल्क 10 अप्रैल तक जमा किया जा सकता है।",
			lang: "Hindi",
		},
	],

	// 3. Class timings
	[
		{
			id: 1,
			role: "user",
			text: "What time do classes start?",
			lang: "English",
		},
		{ id: 2, role: "ai", text: "Classes begin at 9 AM.", lang: "English" },
		{
			id: 3,
			role: "user",
			text: "क्लास कितने बजे से शुरू होती है?",
			lang: "Hindi",
		},
		{
			id: 4,
			role: "ai",
			text: "क्लास सुबह 9 बजे शुरू होती है।",
			lang: "Hindi",
		},
	],

	// 4. Hostel check-in
	[
		{
			id: 1,
			role: "user",
			text: "When can we check into the hostel?",
			lang: "English",
		},
		{ id: 2, role: "ai", text: "Check-in starts on July 15.", lang: "English" },
		{ id: 3, role: "user", text: "হোস্টেলে কখন উঠতে পারবো?", lang: "Bengali" },
		{
			id: 4,
			role: "ai",
			text: "১৫ জুলাই থেকে হোস্টেলে ওঠা যাবে।",
			lang: "Bengali",
		},
	],

	// 5. ID card issue
	[
		{
			id: 1,
			role: "user",
			text: "How do I get my student ID card?",
			lang: "English",
		},
		{
			id: 2,
			role: "ai",
			text: "You can collect it from the admin office.",
			lang: "English",
		},
		{ id: 3, role: "user", text: "आईडी कार्ड कैसे मिलेगा?", lang: "Hindi" },
		{
			id: 4,
			role: "ai",
			text: "आईडी कार्ड प्रशासन कार्यालय से मिलेगा।",
			lang: "Hindi",
		},
	],

	// 6. Library card
	[
		{
			id: 1,
			role: "user",
			text: "How can I get a library card?",
			lang: "English",
		},
		{
			id: 2,
			role: "ai",
			text: "Apply online and collect it at the library desk.",
			lang: "English",
		},
		{
			id: 3,
			role: "user",
			text: "লাইব্রেরি কার্ড কিভাবে পাবো?",
			lang: "Bengali",
		},
		{
			id: 4,
			role: "ai",
			text: "অনলাইনে আবেদন করে লাইব্রেরি ডেস্ক থেকে সংগ্রহ করুন।",
			lang: "Bengali",
		},
	],

	// 7. Transport schedule
	[
		{
			id: 1,
			role: "user",
			text: "When does the college bus leave?",
			lang: "English",
		},
		{
			id: 2,
			role: "ai",
			text: "The first bus leaves at 8 AM.",
			lang: "English",
		},
		{ id: 3, role: "user", text: "बस कितने बजे चलती है?", lang: "Hindi" },
		{ id: 4, role: "ai", text: "पहली बस सुबह 8 बजे चलती है।", lang: "Hindi" },
	],

	// 8. Exam schedule
	[
		{
			id: 1,
			role: "user",
			text: "When are the semester exams?",
			lang: "English",
		},
		{
			id: 2,
			role: "ai",
			text: "Exams begin in the first week of December.",
			lang: "English",
		},
		{ id: 3, role: "user", text: "পরীক্ষা কবে শুরু হবে?", lang: "Bengali" },
		{
			id: 4,
			role: "ai",
			text: "ডিসেম্বরের প্রথম সপ্তাহে পরীক্ষা শুরু হবে।",
			lang: "Bengali",
		},
	],

	// 9. Certificate request
	[
		{
			id: 1,
			role: "user",
			text: "How to request a bonafide certificate?",
			lang: "English",
		},
		{
			id: 2,
			role: "ai",
			text: "Submit the form on the portal.",
			lang: "English",
		},
		{
			id: 3,
			role: "user",
			text: "बोनाफाइड सर्टिफिकेट कैसे मिलेगा?",
			lang: "Hindi",
		},
		{
			id: 4,
			role: "ai",
			text: "पोर्टल पर फ़ॉर्म भरकर प्राप्त किया जा सकता है।",
			lang: "Hindi",
		},
	],

	// 10. WiFi login
	[
		{
			id: 1,
			role: "user",
			text: "How do I log into the campus WiFi?",
			lang: "English",
		},
		{
			id: 2,
			role: "ai",
			text: "Use your student email to sign in.",
			lang: "English",
		},
		{
			id: 3,
			role: "user",
			text: "ক্যাম্পাস ওয়াইফাইতে লগইন কিভাবে করবো?",
			lang: "Bengali",
		},
		{
			id: 4,
			role: "ai",
			text: "স্টুডেন্ট ইমেইল দিয়ে লগইন করুন।",
			lang: "Bengali",
		},
	],
];

/**
 * ChatSimulation - Animated chat interface with cycling multilingual messages
 * Demonstrates the multilingual capabilities of the platform
 * Optimized with requestAnimationFrame and reduced layout thrashing
 */
export const ChatSimulation = React.memo(() => {
	const { isMobile } = useMobileDetect();
	const animationRef = useRef<number | undefined>(undefined);
	const lastUpdateRef = useRef<number>(0);

	const getRandomSet = useMemo(
		() => () => messageSets[Math.floor(Math.random() * messageSets.length)],
		[],
	);

	const [currentSet, setCurrentSet] = useState(getRandomSet);
	const [visibleIndex, setVisibleIndex] = useState(0);

	useEffect(() => {
		if (!currentSet) return;

		// Optimized interval for mobile devices
		const interval = isMobile ? 3500 : 2500;
		let startTime = performance.now();

		const animate = (currentTime: number) => {
			const elapsed = currentTime - lastUpdateRef.current;

			if (elapsed >= interval) {
				lastUpdateRef.current = currentTime;

				setVisibleIndex((prev) => {
					if (prev < currentSet.length - 1) {
						return prev + 1;
					}

					// Switch to next random set
					const nextSet = getRandomSet();
					setCurrentSet(nextSet);
					return -1;
				});
			}

			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [currentSet, getRandomSet, isMobile]);

	return (
		<div className="p-6 space-y-4 font-sans" style={{ contain: "layout style paint" }}>
			<div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
				<div className="flex items-center gap-3">
					<div className="w-3 h-3 rounded-full bg-red-500/80" />
					<div className="w-3 h-3 rounded-full bg-yellow-500/80" />
					<div className="w-3 h-3 rounded-full bg-green-500/80" />
				</div>
			</div>
			<div
				className="space-y-4 min-h-[280px] sm:h-[240px] md:h-[220px] overflow-hidden relative"
				style={{ contain: "layout" }}
			>
				<AnimatePresence mode="sync">
					{currentSet?.slice(0, visibleIndex + 1).map((msg) => (
						<motion.div
							key={`${msg.id}-${msg.text}`}
							initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20, y: 10 }}
							animate={{ opacity: 1, x: 0, y: 0 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className={cn(
								"flex w-full",
								msg.role === "user" ? "justify-end" : "justify-start",
							)}
							style={{ willChange: "opacity, transform" }}
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
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
});

ChatSimulation.displayName = "ChatSimulation";
