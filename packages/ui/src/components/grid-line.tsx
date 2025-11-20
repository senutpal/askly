import React from "react";
import { cn } from "../lib/utils";

interface GridLineProps {
  vertical?: boolean;
  index?: number;
}

/**
 * GridLine - Single grid line component (horizontal or vertical)
 * Used in feature grids and bento layouts
 */
export const GridLine = React.memo<GridLineProps>(({ vertical = false, index }) => {
  return (
    <div
      className={cn(
        "absolute bg-gradient-to-b from-transparent via-border/40 to-transparent",
        vertical
          ? "w-[1px] h-full left-0 top-0"
          : "h-[1px] w-full top-0 left-0"
      )}
    />
  );
});

GridLine.displayName = "GridLine";
