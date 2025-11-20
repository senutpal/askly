import { useCallback, useRef } from "react";

/**
 * Throttle hook to limit the rate at which a function can fire
 * Useful for scroll and resize event handlers
 * 
 * @param callback - Function to throttle
 * @param delay - Minimum time between function calls in milliseconds
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
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
    [callback, delay]
  );
}
