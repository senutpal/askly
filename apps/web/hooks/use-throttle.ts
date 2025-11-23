import { useCallback, useRef } from "react";

export function useThrottle<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
) {
	const lastRun = useRef(Date.now());

	return useCallback(
		(...args: Parameters<T>) => {
			const now = Date.now();
			if (now - lastRun.current >= delay) {
				lastRun.current = now;
				callback(...args);
			}
		},
		[callback, delay],
	);
}
