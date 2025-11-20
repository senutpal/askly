"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if the current device is mobile (< 768px)
 * Updates on window resize for responsive behavior
 */
export function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    // Initial check
    checkDevice();
    
    // Update on resize
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);
  
  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
}
