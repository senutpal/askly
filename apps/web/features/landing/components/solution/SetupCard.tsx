"use client";

import { SpotlightCard } from "@workspace/ui";
import { Upload, Zap } from "lucide-react";
import { motion } from "motion/react";
import React from "react";


export const SetupCard = React.memo(() => {
	return (
		<SpotlightCard className="md:col-span-6 lg:col-span-8 min-h-[350px] relative group">
			<div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900" />

			<div className="relative z-10 p-8 md:p-10 h-full flex flex-col md:flex-row items-center gap-8">
				<div className="flex-1 space-y-6">
					<div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
						<Zap className="w-6 h-6" />
					</div>
					<div>
						<h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
							Setup in Minutes
						</h3>
						<p className="text-neutral-600 dark:text-neutral-400 text-sm">
							Simply upload your documents. Askly trains itself instantly. No
							coding, no complex flowcharts.
						</p>
					</div>
				</div>

				<div className="w-full md:w-1/2 perspective-1000">
					<motion.div
						style={{ rotateY: -0, rotateX: 0 }}
						whileHover={{ rotateY: 0, rotateX: 10, rotateZ: 0 }}
						transition={{ type: "spring", stiffness: 100 }}
						className="relative bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 p-4"
					>
						<div className="flex items-center gap-2 mb-4 border-b border-neutral-100 dark:border-neutral-900 pb-2">
							<div className="w-2 h-2 rounded-full bg-red-400" />
							<div className="w-2 h-2 rounded-full bg-yellow-400" />
							<div className="w-2 h-2 rounded-full bg-green-400" />
						</div>
						<div className="space-y-3">
							<div className="h-2 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded" />
							<div className="h-2 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded" />
							<div className="flex gap-2 mt-4">
								<div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
									<Upload className="w-4 h-4 text-green-600" />
								</div>
								<div className="flex-1 h-8 bg-neutral-50 dark:bg-neutral-900 rounded border border-dashed border-neutral-200 dark:border-neutral-800 flex items-center px-2">
									<span className="text-[10px] text-neutral-400">
										Knowledge_Base.pdf
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</SpotlightCard>
	);
});

SetupCard.displayName = "SetupCard";
