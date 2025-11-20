"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import {
  Clock,
  Users,
  MessageSquareX,
  Languages,
  TrendingDown,
  AlertCircle,
  ArrowRight,
  Zap,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

// --- Data Configuration ---
const problems = [
  {
    id: "time",
    icon: Clock,
    title: "The Efficiency Black Hole",
    subtitle: "Time Wasted on Repetition",
    description:
      "Administrative brilliance is being suffocated by repetitive queries. Your talented staff spends thousands of hours annually functioning as human search engines.",
    stat: "1,000+",
    statLabel: "Hours lost / year",
    accent: "from-red-400 to-orange-500",
    shadow: "shadow-red-500/20",
  },
  {
    id: "wait",
    icon: Users,
    title: "The Friction Point",
    subtitle: "Unacceptable Wait Times",
    description:
      "Students queue for hours for minutes of information. This friction creates a barrier between the institution and the learner, damaging the campus experience.",
    stat: "45m",
    statLabel: "Avg. wait time",
    accent: "from-orange-500 to-amber-500",
    shadow: "shadow-orange-500/20",
  },
  {
    id: "comms",
    icon: MessageSquareX,
    title: "Signal Lost",
    subtitle: "Communication Breakdown",
    description:
      "Critical updates die in email chains. When information doesn't flow, opportunities are missed and confusion becomes the default campus culture.",
    stat: "60%",
    statLabel: "Missed updates",
    accent: "from-amber-500 to-yellow-500",
    shadow: "shadow-amber-500/20",
  },
  {
    id: "lang",
    icon: Languages,
    title: "The Silent Barrier",
    subtitle: "Accessibility Gaps",
    description:
      "Education should have no borders. Yet, non-native speakers face a wall of silence, creating an inequitable environment for international talent.",
    stat: "40%",
    statLabel: "Language friction",
    accent: "from-blue-400 to-blue-600",
    shadow: "shadow-blue-500/20",
  },
  {
    id: "resource",
    icon: TrendingDown,
    title: "Misaligned Potential",
    subtitle: "Resource Drain",
    description:
      "High-value staff are tied up with low-value tasks. It is an invisible tax on your institution's growth and strategic capability.",
    stat: "70%",
    statLabel: "Resource misuse",
    accent: "from-purple-400 to-purple-600",
    shadow: "shadow-indigo-500/20",
  },
];

// --- Components ---

const NoiseOverlay = () => (
  <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.5] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.6"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const Badge = ({ text, icon: Icon }: { text: string; icon: any }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-md">
    <Icon className="w-3.5 h-3.5 text-red-500" />
    <span className="text-xs font-semibold tracking-wide text-red-600 dark:text-red-400 uppercase">
      {text}
    </span>
  </div>
);

// --- Main Section ---
const TopographyPattern = () => (
  <div className="absolute inset-0 -z-10 h-full w-full">
  {/* SVG Pattern Definition */}
  <div className="absolute inset-0 h-full w-full  [mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_80%)] opacity-[0.1] dark:opacity-[0.2]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }}
  ></div>
  
  {/* Vignette for focus */}
  
</div>
);

export default function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  // Scroll logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform scroll progress to index
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const cardCount = problems.length;
      // Divide scroll space into segments. slightly dampen the end to ensure last card shows.
      const step = 1 / cardCount;
      const index = Math.min(
        Math.floor(latest / step),
        cardCount - 1
      );
      setActiveCard(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section className="relative text-neutral-900 dark:text-white">
      <TopographyPattern/>
      {/* <NoiseOverlay /> */}
      
      {/* Spacer for previous content */}
      

      <div ref={containerRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden px-6 md:px-12 lg:px-24 py-12">
          
          {/* --- Left Side: Narrative Engine --- */}
          <div className="w-full lg:w-1/2 h-full flex flex-col justify-center z-10 mb-12 lg:mb-0 relative">
            <div className="absolute top-1/4 left-0 w-1 h-1/2 bg-neutral-200 dark:bg-neutral-800 rounded-full hidden lg:block">
              <motion.div 
                className="w-full bg-red-500 rounded-full"
                style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }} 
              />
            </div>

            <div className="lg:pl-12 space-y-8 max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              ><div className="hidden md:block">
                <Badge text="Critical Analysis" icon={AlertCircle} /></div>
                <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-black/60 to-black dark:from-neutral-400 dark:to-neutral-300">
                  Campus communication <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-600 to-neutral-800 dark:from-neutral-500 dark:to-neutral-300">
                    is broken.
                  </span>
                </h2>
              </motion.div>

              <div className="relative min-h-[180px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute top-0 left-0"
                  >
                    {(() => {
                      const activeProblem = problems[activeCard] || problems[0];
                      return (
                        <>
                          <h3 className={cn(
                            "text-2xl font-semibold mb-4 bg-gradient-to-b text-transparent bg-clip-text",
                            activeProblem?.accent
                          )}>
                            {activeProblem?.title}
                          </h3>
                          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {activeProblem?.description}
                          </p>
                        </>
                      );
                    })()}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-4 text-sm font-medium text-neutral-500 dark:text-neutral-500">
                <span>0{activeCard + 1}</span>
                <div className="w-12 h-[1px] bg-neutral-300 dark:bg-neutral-700" />
                <span>0{problems.length}</span>
              </div>
            </div>
          </div>

          {/* --- Right Side: Visual Stack --- */}
          <div className="w-full lg:w-1/2 h-[50vh] lg:h-full flex items-center justify-center lg:justify-end perspective-1000">
            <div className="relative w-full max-w-md aspect-square">
              {problems.map((card, index) => {
                return (
                  <ProblemCard
                    key={card.id}
                    card={card}
                    index={index}
                    activeCard={activeCard}
                    total={problems.length}
                  />
                );
              })}
            </div>
          </div>

        </div>
      </div>
    
      
    </section>
  );
}

// --- Isolated Card Component ---

function ProblemCard({
  card,
  index,
  activeCard,
  total,
}: {
  card: typeof problems[0];
  index: number;
  activeCard: number;
  total: number;
}) {
  // Physics-based springing for interactions
  const isActive = index === activeCard;
  const isPast = index < activeCard;
  const isUpcoming = index > activeCard;

  // Calculate visual state based on active index
  // We use direct values here but in a real app you might interpolate standard framer motion values
  // for buttery smoothness, we use 'animate' prop with spring transition
  
  return (
    <motion.div
      layout
      initial={false}
      animate={{
        y: isActive ? 0 : isPast ? -50 * (activeCard - index) : 20 * (index - activeCard),
        scale: isActive ? 1 : isPast ? 1 - (activeCard - index) * 0.05 : 0.9 - (index - activeCard) * 0.05,
        opacity: isActive ? 1 : isPast ? Math.max(0, 1 - (activeCard - index) * 0.3) : Math.max(0, 0.4 - (index - activeCard) * 0.1),
        rotateX: isActive ? 0 : isPast ? 10 : -10,
        z: isActive ? 0 : -100,
        filter: isActive ? "blur(0px)" : "blur(8px)",
      }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20,
        mass: 1,
      }}
      className={cn(
        "absolute inset-0 rounded-3xl p-1",
        "bg-gradient-to-b from-white/40 to-white/10 dark:from-white/10 dark:to-white/5",
        "border border-white/20 dark:border-white/10",
        "backdrop-blur-2xl shadow-2xl",
        isActive ? "z-30" : "z-0",
        // Dynamic shadow based on card color when active
        isActive && card.shadow
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative h-full w-full rounded-[20px] bg-white/50 dark:bg-neutral-900/80 overflow-hidden flex flex-col justify-between p-6 md:p-8 border border-white/40 dark:border-white/5">
        {/* Abstract Geometric Background decoration */}
        <div className={cn(
            "absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br",
            card.accent
        )} />

        {/* Header */}
        <div className="relative z-10 flex justify-between items-start">
            <div className={cn(
                "p-3 rounded-2xl bg-gradient-to-br shadow-lg text-white",
                card.accent
            )}>
                <card.icon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <Zap className="w-3 h-3" />
                <span>Pain Point</span>
            </div>
        </div>

        {/* Content */}
        <div className="relative z-10 mt-auto space-y-6">
            <div>
                <h4 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wider">
                    {card.subtitle}
                </h4>
                <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
                    {card.stat} 
                    <span className="text-lg md:text-xl text-neutral-500 dark:text-neutral-500 font-medium ml-2">
                        {card.statLabel}
                    </span>
                </h3>
            </div>

            {/* Visualization Bar (Dummy data for visual aesthetics) */}
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-medium text-neutral-400">
                    <span>Impact Level</span>
                    
                </div>
                <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: isActive ? "85%" : "0%" }}
                        transition={{ delay: 0.2, duration: 1, ease: "circOut" }}
                        className={cn("h-full rounded-full bg-gradient-to-r", card.accent)} 
                    />
                </div>
            </div>
        </div>

        
      </div>
    </motion.div>
  );
}