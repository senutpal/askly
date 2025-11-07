"use client";

import {
  ContainerScroll,
  CardSticky,
} from "@workspace/ui/components/cardsticky";
import { GlowingEffect } from "@workspace/ui/components/glowing-effect";
import {
  Clock,
  Users,
  MessageSquareX,
  Languages,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const problemCards = [
  {
    icon: Clock,
    title: "Time Wasted on Repetitive Queries",
    description:
      "Administrative staff spend countless hours answering the same questions every day.",
    stat: "1000+",
    statLabel: "Hours wasted annually",
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    icon: Users,
    title: "Long Wait Times for Students",
    description:
      "Students queue for hours just to get simple information about fees, exams, or schedules.",
    stat: "45 min",
    statLabel: "Average wait time",
    color: "text-orange-500 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: MessageSquareX,
    title: "Communication Breakdown",
    description:
      "Important announcements and updates get lost in email chains and notice boards.",
    stat: "60%",
    statLabel: "Miss critical updates",
    color: "text-yellow-500 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
  },
  {
    icon: Languages,
    title: "Language Barriers",
    description:
      "Non-English speakers struggle to get help, creating accessibility issues across campus.",
    stat: "40%",
    statLabel: "Face language issues",
    color: "text-purple-500 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: TrendingDown,
    title: "Inefficient Resource Allocation",
    description:
      "Staff resources are tied up with simple queries instead of complex student needs.",
    stat: "70%",
    statLabel: "Are simple queries",
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
];

export default function ProblemSection() {
  const [isMd, setIsMd] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = (event: MediaQueryListEvent) => setIsMd(event.matches);

    setIsMd(mql.matches);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return (
    <section
      id="problem"
      className="relative py-8 -mb-60 md:mb-0 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-6 md:space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
              >
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  The Problem
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
              >
                <span className="bg-gradient-to-b from-gray-600 to-gray-900 dark:from-white dark:to-gray-400 text-transparent bg-clip-text">
                  Campus Communication
                </span>
                <br />
                <span className="bg-gradient-to-b from-red-400 to-red-600 dark:from-red-400 dark:to-red-600 text-transparent bg-clip-text">
                  Is Broken
                </span>
              </motion.h2>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative pl-4 md:pl-6 border-l-4 border-red-500 dark:border-red-400"
              >
                <blockquote className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300 italic">
                  &quot;We spend thousands of hours answering the same
                  questions, while students wait in long queues for simple
                  information.&quot;
                </blockquote>
                <cite className="block mt-3 md:mt-4 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 not-italic">
                  — Common frustration across campus administrative offices
                </cite>
              </motion.div>

              {/* Stats Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-2 gap-3 md:gap-4 pt-2 md:pt-4"
              >
                <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-1 md:rounded-[1.5rem] md:p-2">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                  />
                  <div className="p-4 md:p-5 rounded-lg   md:rounded-xl bg-gradient-to-b from-white to-gray-200/50 dark:bg-gradient-to-b dark:from-gray-800 dark:to-black/5 border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">
                      85%
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Staff overwhelmed
                    </div>
                  </div>
                </div>
                <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-1 md:rounded-[1.5rem] md:p-2">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                  />
                  <div className="p-4 md:p-5 rounded-lg   md:rounded-xl bg-gradient-to-b from-white to-gray-200/50 dark:bg-gradient-to-b dark:from-gray-800 dark:to-black/5 border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">
                      92%
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Students frustrated
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mobile hint */}
              <p className="lg:hidden text-sm text-gray-500 dark:text-gray-400 pt-4 text-center">
                Scroll to see the challenges →
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 relative ">
            <ContainerScroll className="space-y-6">
              {problemCards.map((card, index) => (
                <CardSticky
                  key={index}
                  index={index}
                  incrementY={isMd ? 40 : 85}
                  scale={0.95}
                  stickyTop={isMd ? 180 : 160}
                  className="bg-gradient-to-b from-white to-gray-100 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-950 rounded-xl md:rounded-2xl p-5 md:p-6 lg:p-8 min-h-[280px] md:min-h-[320px]"
                >
                  {/* Icon */}
                  <div
                    className={`inline-flex p-3 md:p-4 rounded-xl ${card.bgColor} mb-4 md:mb-5`}
                  >
                    <card.icon
                      className={`w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 ${card.color}`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold font-sans-alt text-gray-900 dark:text-white mb-2 md:mb-3 leading-tight">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4 md:mb-6">
                    {card.description}
                  </p>

                  {/* Stat */}
                  <div
                    className={`inline-flex items-baseline gap-2 px-3 md:px-4 py-2 rounded-lg ${card.bgColor}`}
                  >
                    <span
                      className={`text-xl md:text-2xl lg:text-3xl font-bold ${card.color}`}
                    >
                      {card.stat}
                    </span>
                    <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      {card.statLabel}
                    </span>
                  </div>
                </CardSticky>
              ))}
            </ContainerScroll>

            {/* Add spacing at the bottom so last card can stick */}
            <div className="h-96" />
          </div>
        </div>
      </div>
    </section>
  );
}
