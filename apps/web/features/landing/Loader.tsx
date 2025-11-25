"use client";

import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";

const DURATION = 4;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * ScrambleText - Optimized text scramble animation using requestAnimationFrame
 */
const ScrambleText = ({
	text,
	className,
}: {
	text: string;
	className?: string;
}) => {
	const [displayText, setDisplayText] = useState(text);
	const animationRef = useRef<number | undefined>(undefined);
	const iterationRef = useRef(0);

	useEffect(() => {
		let lastTime = 0;
		const frameTime = 40; // ~25 fps for scramble effect

		const animate = (currentTime: number) => {
			if (currentTime - lastTime >= frameTime) {
				lastTime = currentTime;

				setDisplayText(
					text
						.split("")
						.map((char, index) => {
							if (index < iterationRef.current) {
								return text[index];
							}
							return CHARS[Math.floor(Math.random() * CHARS.length)];
						})
						.join(""),
				);

				if (iterationRef.current >= text.length) {
					if (animationRef.current) {
						cancelAnimationFrame(animationRef.current);
					}
					return;
				}
				iterationRef.current += 1 / 3;
			}

			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [text]);

	return <span className={className}>{displayText}</span>;
};

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
				}, 500);
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
		<motion.div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-neutral-950 overflow-hidden"
			initial={{ opacity: 1 }}
			exit={{
				y: "-100%",
				transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
			}}
			style={{ willChange: "transform" }}
		>
			<div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-difference" />
			<div className="relative z-10 flex flex-col items-center justify-center gap-10 w-full max-w-md px-6">
				<div className="relative overflow-hidden">
					<motion.div
						initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
						animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="text-6xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-white/60"
						style={{ willChange: "opacity, transform, filter" }}
					>
						<ScrambleText text="Askly" />
					</motion.div>
				</div>

				<div className="w-full flex flex-col gap-3 items-center">
					<div className="h-[2px] w-full bg-neutral-200 dark:bg-neutral-800 relative overflow-hidden rounded-full">
						<motion.div
							className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 w-1/2 z-20"
							animate={{
								x: ["-100%", "200%"],
								opacity: [0, 0.5, 0],
							}}
							transition={{
								repeat: Number.POSITIVE_INFINITY,
								duration: 1.5,
								ease: "linear",
							}}
							style={{ contain: "layout style paint" }}
						/>
						<motion.div
							className="h-full bg-neutral-900 dark:bg-white origin-left relative z-10"
							style={{ width: `${progress}%`, contain: "layout style paint" }}
							transition={{ ease: "linear" }}
						/>
					</div>
					<div className="w-full flex justify-between items-center text-xs font-semibold uppercase tracking-[0.2em]">
						<span className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500">
							<span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
							Processing
						</span>
						<span className="tabular-nums text-neutral-900 dark:text-white">
							{Math.floor(progress)}%
						</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
