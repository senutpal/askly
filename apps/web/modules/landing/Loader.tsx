"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

// --- Configuration ---
const DURATION = 3; // seconds
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Clean, technical decryption characters

// --- Sub-component: Scramble Text Effect ---
const ScrambleText = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let iteration = 0;

    interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      // Speed of decryption
      iteration += 1 / 3; 
    }, 40); // Slightly slower for more dramatic effect

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
};

// --- Main Loader Component ---
export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const newProgress = Math.min((elapsed / (DURATION * 1000)) * 100, 100);
      
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete && onComplete();
        }, 500);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      // Container: Adapts background color from crisp white to deep black
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-neutral-950 overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      {/* Noise Overlay: Uses mix-blend-mode to work on both white and black backgrounds */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-difference" />
      
      {/* Ambient Glow: Blue in dark mode, subtle purple/blue tint in light mode */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DURATION, ease: "easeOut" }}
          className="w-[500px] h-[500px] rounded-full blur-[120px] bg-blue-500/10 dark:bg-blue-600/20" 
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-10 w-full max-w-md px-6">
        
        {/* Brand Name */}
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            // Gradient Text: Dark Grey->Black (Light Mode) | White->Translucent (Dark Mode)
            className="text-6xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-white dark:to-white/60"
          >
            <ScrambleText text="Askly" />
          </motion.div>
        </div>

        {/* Progress System */}
        <div className="w-full flex flex-col gap-3 items-center">
          
          {/* The Track */}
          <div className="h-[2px] w-full bg-neutral-200 dark:bg-neutral-800 relative overflow-hidden rounded-full">
            {/* The glowing lead pixel (simulating data flow) */}
            <motion.div
              className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 w-1/2 z-20"
              animate={{ 
                x: ["-100%", "200%"],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "linear" 
              }}
            />
            {/* The Fill: Black in Light Mode, White in Dark Mode */}
            <motion.div 
              className="h-full bg-neutral-900 dark:bg-white origin-left relative z-10"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          {/* Metrics & Status */}
          <div className="w-full flex justify-between items-center text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse"/>
               Processing
            </span>
            {/* Percentage: Dark text in Light mode, White in Dark mode */}
            <span className="tabular-nums text-neutral-900 dark:text-white">
              {Math.floor(progress)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}