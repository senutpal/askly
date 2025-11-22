"use client";

import * as React from "react";
import { HTMLMotionProps, motion } from "motion/react";
import { cn } from "@workspace/ui";

interface CardStickyProps extends HTMLMotionProps<"div"> {
  index: number;
  incrementY?: number;
  scale?: number;
  stickyTop?: number;
}

const ContainerScroll = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("relative w-full", className)} {...props}>
      {children}
    </div>
  );
});

ContainerScroll.displayName = "ContainerScroll";

const CardSticky = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      index,
      incrementY = 40,
      scale = 0.95,
      stickyTop = 0,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const card = cardRef.current;
      if (!card) return;

      const handleScroll = () => {
        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const cardTop = rect.top;
        const effectiveStickyTop = stickyTop + incrementY * index;

        const scrollProgress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - cardTop - effectiveStickyTop) / windowHeight
          )
        );
        setProgress(scrollProgress);
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    }, [index, incrementY, stickyTop]);

    const currentScale = 1 - (1 - scale) * progress * 0.5;

    return (
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        style={{
          top: `${stickyTop + incrementY * index}px`, // UPDATED
          scale: currentScale,
          transformOrigin: "center top",
          ...style,
        }}
        className={cn(
          "sticky",
          "bg-white border border-gray-200",
          "dark:bg-gray-900 dark:border-gray-700",
          "shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
          "dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
          "hover:shadow-[0_20px_50px_rgb(0,0,0,0.15)]",
          "dark:hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]",
          "transition-shadow duration-300",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

CardSticky.displayName = "CardSticky";

export { ContainerScroll, CardSticky };
