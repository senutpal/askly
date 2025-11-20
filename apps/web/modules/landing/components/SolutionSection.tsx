"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from "motion/react";
import { 
  Globe2, 
  Zap, 
  Clock, 
  BarChart3, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Upload
} from "lucide-react";
import Image from "next/image";
import { cn } from "@workspace/ui/lib/utils";
import ShinyText from "@workspace/ui/components/shinytext";

const BackgroundPattern = () => (
  <div className="absolute inset-0 -z-10 h-full w-full ">
    <div className="absolute h-full w-full bg-[radial-gradient(#00000030_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#ffffff35_1px,transparent_1px)]" /> 
  </div>
);

const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "group relative border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 overflow-hidden rounded-3xl",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(34, 197, 94, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

export default function SolutionRedesign() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative mt-16 md:mt-0 overflow-hidden  ">
      <BackgroundPattern/>
    

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/50 dark:bg-green-900/40 border border-green-400 dark:border-green-800 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3 text-green-600 dark:text-green-500" />
            <span className="text-xs font-semibold tracking-wide uppercase text-green-700 dark:text-green-500">
              The Askly Advantage
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-neutral-600 to-neutral-800 dark:from-neutral-200 dark:to-neutral-600 mb-6"
          >
            Automate support without <br />
            <div className="md:mt-4 text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-600 dark:from-green-400 dark:to-green-600">
              losing the human touch.
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}

          >
            <ShinyText 
                text="Askly makes campus communication smoother and more efficient, taking care of everyday tasks so your team can dedicate their time and energy to supporting students." 
                disabled={false} 
                speed={5} 
                className='text-lg md:text-xl leading-relaxed' 
              />
           
          </motion.p>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          
          {/* CARD 1: Multilingual (Large Span) */}
          <SpotlightCard className="md:col-span-6 lg:col-span-8 min-h-[250px] lg:min-h-[400px] flex flex-col justify-between">
            <div className="p-8 md:p-10 z-10 relative">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3">
                Fluency in 50+ Languages
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                Break language barriers instantly. Askly detects and responds in your student's native tongue, ensuring inclusivity from day one.
              </p>
            </div>
            
            {/* Visual: Abstract Conversation Bubbles */}
            <div className="absolute hidden xl:block right-0 bottom-0 w-full h-1/2 md:w-1/2 md:h-full overflow-hidden ">

  {/* Spanish bubble */}
  <motion.div
    animate={{ y: [0, -5, 0] }} // moves left (towards AI bubble)
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    className="absolute bottom-12 right-12 bg-gradient-to-b from-white to-gray-100 dark:bg-neutral-800 shadow-xl border border-neutral-200 dark:border-neutral-700 p-4 rounded-t-3xl rounded-bl-3xl rounded-br-sm max-w-[200px] z-20"
  >
    <p className="text-sm text-neutral-600 dark:text-black font-medium">
    Aavedan agle Somvaar se shuru honge !
    </p>
  </motion.div>

  {/* English bubble */}
  <motion.div
    animate={{ y: [0, 5, 0] }} // moves right (towards Spanish bubble)
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    className="absolute bottom-36 right-32 bg-green-500 text-white shadow-lg bg-gradient-to-b from-green-400 to-green-600 p-4 rounded-t-3xl rounded-br-3xl rounded-bl-sm max-w-[200px] z-10"
  >
    <p className="text-sm font-medium">
      Applications open next Monday !
    </p>
  </motion.div>

</div>

          </SpotlightCard>

          {/* CARD 2: 24/7 Availability (Vertical) */}
          <SpotlightCard className="md:col-span-3 lg:col-span-4 min-h-[400px] flex flex-col">
            <div className="p-8 flex-1">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3">
                Always Awake
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                Midnight queries? Weekend worries? Askly provides instant answers 24/7, drastically reducing anxiety for students and workload for staff.
              </p>
            </div>
            <div className="relative h-32 w-full bg-gradient-to-t from-purple-50/50 dark:from-purple-900/10 to-transparent flex items-center justify-center">
               {/* Pulsing Indicator */}
               <div className="relative flex items-center justify-center">
                  <div className="absolute w-24 h-24 bg-green-500/20 rounded-full animate-ping" />
                  <div className="relative px-4 py-2 bg-white dark:bg-neutral-800 rounded-full shadow-sm border border-green-200 dark:border-green-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-green-700 dark:text-green-400">ONLINE NOW</span>
                  </div>
               </div>
            </div>
          </SpotlightCard>

          {/* CARD 3: ROI/Stats (Vertical) */}
          <SpotlightCard className="md:col-span-3 lg:col-span-4 min-h-[350px]">
             <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-500">ROI</div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tighter">70%</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 font-medium">Reduction in routine queries</p>
                </div>
                <div className="mt-8 h-16 flex items-end gap-1">
                    {[100, 90, 80, 70, 60, 50, 40].map((h, i) => (
                        <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="flex-1 bg-orange-500/20 rounded-t-sm dark:bg-orange-500/40 relative group hover:bg-orange-500 transition-colors"
                        >
                             <div className="absolute bottom-0 w-full h-1 bg-orange-500 rounded-full" />
                        </motion.div>
                    ))}
                </div>
             </div>
          </SpotlightCard>

          {/* CARD 4: Dashboard Preview (Large Span) */}
          <SpotlightCard className="md:col-span-6 lg:col-span-8 min-h-[350px] relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900" />
             
             <div className="relative z-10 p-8 md:p-10 h-full flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-6">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">Setup in Minutes</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                            Simply upload your documents. Askly trains itself instantly. No coding, no complex flowcharts.
                        </p>
                    </div>
                    
                </div>

                {/* Floating Abstract UI */}
                <div className="w-full md:w-1/2 perspective-1000">
                    <motion.div 
                        style={{ rotateY: -0, rotateX: 0 }}
                        whileHover={{ rotateY: 0, rotateX:10,rotateZ:0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="relative bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 p-4"
                    >
                        <div className="flex items-center gap-2 mb-4 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <div className="w-2 h-2 rounded-full bg-yellow-400" />
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded" />
                            <div className="h-2 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded" />
                            <div className="flex gap-2 mt-4">
                                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                                    <Upload className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="flex-1 h-8 bg-neutral-50 dark:bg-neutral-900 rounded border border-dashed border-neutral-200 dark:border-neutral-800 flex items-center px-2">
                                    <span className="text-[10px] text-neutral-400">Knowledge_Base.pdf</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
             </div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
}