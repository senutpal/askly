"use client";

import { SpotlightCard } from "@workspace/ui";
import { BarChart3 } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

export const ROICard = React.memo(() => {
	return (
		<SpotlightCard className="md:col-span-3 lg:col-span-4 min-h-[350px]">
			<div className="p-8">
				<div className="flex items-center justify-between mb-8">
					<div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
						<BarChart3 className="w-6 h-6" />
					</div>
					<div className="text-xs font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-500">
						ROI
					</div>
				</div>
				<div className="space-y-2">
					<h3 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tighter">
						70%
					</h3>
					<p className="text-neutral-600 dark:text-neutral-400 font-medium">
						Reduction in routine queries
					</p>
				</div>
				<div className="mt-8 h-16 flex items-end gap-1">
					{[100, 90, 80, 70, 60, 50, 40].map((h, i) => (
						<motion.div
							key={i}
							initial={{ height: 0 }}
							whileInView={{ height: `${h}%` }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className="flex-1 bg-orange-500/20 rounded-t-sm dark:bg-orange-500/40 relative group hover:bg-orange-500 transition-colors"
						>
							<div className="absolute bottom-0 w-full h-1 bg-orange-500 rounded-full" />
						</motion.div>
					))}
				</div>
			</div>
		</SpotlightCard>
	);
});

ROICard.displayName = "ROICard";
