"use client";

import { SpotlightCard } from "@workspace/ui";
import { Globe2 } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

export const MultilingualCard = React.memo(() => {
	return (
		<SpotlightCard className="md:col-span-6 lg:col-span-8 min-h-[250px] lg:min-h-[400px] flex flex-col justify-between">
			<div className="p-8 md:p-10 z-10 relative">
				<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
					<Globe2 className="w-6 h-6" />
				</div>
				<h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3">
					Fluency in 50+ Languages
				</h3>
				<p className="text-neutral-600 dark:text-neutral-400 max-w-md">
					Break language barriers instantly. Askly detects and responds in your
					student's native tongue, ensuring inclusivity from day one.
				</p>
			</div>

			<div className="absolute hidden xl:block right-0 bottom-0 w-full h-1/2 md:w-1/2 md:h-full overflow-hidden ">
				<motion.div
					animate={{ y: [0, -5, 0] }}
					transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-12 right-12 bg-gradient-to-b from-white to-gray-100 dark:bg-neutral-800 shadow-xl border border-neutral-200 dark:border-neutral-700 p-4 rounded-t-3xl rounded-bl-3xl rounded-br-sm max-w-[200px] z-20"
				>
					<p className="text-sm text-neutral-600 dark:text-black font-medium">
						Aavedan agle Somvaar se shuru honge !
					</p>
				</motion.div>

				<motion.div
					animate={{ y: [0, 5, 0] }}
					transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
					className="absolute bottom-36 right-32 bg-green-500 text-white shadow-lg bg-gradient-to-b from-green-400 to-green-600 p-4 rounded-t-3xl rounded-br-3xl rounded-bl-sm max-w-[200px] z-10"
				>
					<p className="text-sm font-medium">Applications open next Monday !</p>
				</motion.div>
			</div>
		</SpotlightCard>
	);
});

MultilingualCard.displayName = "MultilingualCard";
