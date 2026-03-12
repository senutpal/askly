"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1.5;

export default function Loader({ onComplete }: { onComplete?: () => void }) {
	const [progress, setProgress] = useState(0);
	const animationRef = useRef<number | undefined>(undefined);
	const startTimeRef = useRef<number>(Date.now());

	useEffect(() => {
		const updateProgress = () => {
			const elapsed = Date.now() - startTimeRef.current;
			const newProgress = Math.min((elapsed / (DURATION * 1000)) * 100, 100);

			setProgress(newProgress);

			if (newProgress >= 100) {
				if (animationRef.current) {
					cancelAnimationFrame(animationRef.current);
				}
				setTimeout(() => {
					onComplete?.();
				}, 200);
			} else {
				animationRef.current = requestAnimationFrame(updateProgress);
			}
		};

		animationRef.current = requestAnimationFrame(updateProgress);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [onComplete]);

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-neutral-950 overflow-hidden">
			<div className="relative z-10 flex flex-col items-center justify-center gap-10 w-full max-w-md px-6">
				<div className="text-6xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-white/60">
					Askly
				</div>

				<div className="w-full flex flex-col gap-3 items-center">
					<div className="h-[2px] w-full bg-neutral-200 dark:bg-neutral-800 relative overflow-hidden rounded-full">
						<div
							className="h-full bg-neutral-900 dark:bg-white origin-left relative z-10"
							style={{ width: `${progress}%`, transition: "width 50ms linear" }}
						/>
					</div>
					<div className="w-full flex justify-between items-center text-xs font-semibold uppercase tracking-[0.2em]">
						<span className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500">
							<span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500" />
							Processing
						</span>
						<span className="tabular-nums text-neutral-900 dark:text-white">
							{Math.floor(progress)}%
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
