import React from "react";

/**
 * NoiseOverlay - Adds a subtle noise/grain texture overlay
 * Used for adding depth and texture to backgrounds
 */
export const NoiseOverlay = React.memo(() => {
  return (
    <div
      className="absolute inset-0 z-50 pointer-events-none opacity-[0.05] dark:opacity-[0.05]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
});

NoiseOverlay.displayName = "NoiseOverlay";
