import { useCallback, useRef } from "react";

export function useThrottle<Args extends unknown[]>(
	callback: (...args: Args) => void,
	delay: number,
) {
	const lastRun = useRef(Date.now());

	return useCallback(
		(...args: Args) => {
			const now = Date.now();
			if (now - lastRun.current >= delay) {
				lastRun.current = now;
				callback(...args);
			}
		},
		[callback, delay],
	);
}
