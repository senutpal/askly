import React from "react";

/**
 * CrossDotPattern - Plus/cross shaped dot pattern with crosshair overlay
 * Creates a technical, grid-like background aesthetic
 */
export const CrossDotPattern = React.memo(() => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_80%)]">
      {/* The Plus Grid */}
      <div className="absolute h-full w-full bg-[radial-gradient(#00000020_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#ffffff33_1px,transparent_1px)]" />

      {/* The Crosshairs Overlay - Adds the technical feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000008_1px,transparent_1px),linear-gradient(to_bottom,#0000008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
});

CrossDotPattern.displayName = "CrossDotPattern";
