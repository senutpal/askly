"use client";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import React, { useCallback, useRef, useState } from "react";

interface MagneticLinkProps {
	children: React.ReactNode;
	href: string;
}

/**
 * MagneticLink - Interactive link that pulls towards cursor
 * Creates a subtle magnetic attraction effect on hover
 */
export const MagneticLink = React.memo<MagneticLinkProps>(
	({ children, href }) => {
		const ref = useRef<HTMLAnchorElement>(null);
		const [position, setPosition] = useState({ x: 0, y: 0 });

		const handleMouse = useCallback((e: React.MouseEvent) => {
			const { clientX, clientY } = e;
			const { height, width, left, top } = ref.current!.getBoundingClientRect();
			const middleX = clientX - (left + width / 2);
			const middleY = clientY - (top + height / 2);
			setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
		}, []);

		const reset = useCallback(() => setPosition({ x: 0, y: 0 }), []);

		const { x, y } = position;

		return (
			<motion.div
				style={{ x, y }}
				transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
			>
				<a
					href={href}
					ref={ref}
					onMouseMove={handleMouse}
					onMouseLeave={reset}
					className="group relative flex items-center gap-2 text-lg font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 hover:text-black dark:hover:text-white"
				>
					<span className="relative overflow-hidden">
						<span className="block transition-transform duration-500 group-hover:-translate-y-full">
							{children}
						</span>
						<span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0">
							{children}
						</span>
					</span>
					<ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
				</a>
			</motion.div>
		);
	},
);

MagneticLink.displayName = "MagneticLink";
