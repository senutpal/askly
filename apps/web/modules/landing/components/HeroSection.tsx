"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Globe, Sparkles, MessageCircle, CheckCircle2 } from "lucide-react";
import {cn} from "@workspace/ui/lib/utils";
import { useTheme } from "next-themes";
import {AnimatedBadge} from"@workspace/ui/components/animated-badge"
import ShinyText from "@workspace/ui/components/shinytext";

// --- Components ---
const messageSets = [
  // 1. Admission deadline
  [
    { id: 1, role: "user", text: "Until when can we fill out the form?", lang: "English" },
    { id: 2, role: "ai", text: "Applications close on March 31st.", lang: "English" },
    { id: 3, role: "user", text: "ফর্ম আমরা কতদিন পর্যন্ত পূরণ করতে পারবো?", lang: "Bengali" },
    { id: 4, role: "ai", text: "ফর্ম জমা দেওয়ার শেষ তারিখ ৩১ মার্চ।", lang: "Bengali" },
  ],

  // 2. Fee payment
  [
    { id: 1, role: "user", text: "When is the last date for fee payment?", lang: "English" },
    { id: 2, role: "ai", text: "You must pay by April 10.", lang: "English" },
    { id: 3, role: "user", text: "शुल्क कब तक जमा कर सकते हैं?", lang: "Hindi" },
    { id: 4, role: "ai", text: "शुल्क 10 अप्रैल तक जमा किया जा सकता है।", lang: "Hindi" },
  ],

  // 3. Class timings
  [
    { id: 1, role: "user", text: "What time do classes start?", lang: "English" },
    { id: 2, role: "ai", text: "Classes begin at 9 AM.", lang: "English" },
    { id: 3, role: "user", text: "क्लास कितने बजे से शुरू होती है?", lang: "Hindi" },
    { id: 4, role: "ai", text: "क्लास सुबह 9 बजे शुरू होती है।", lang: "Hindi" },
  ],

  // 4. Hostel check-in
  [
    { id: 1, role: "user", text: "When can we check into the hostel?", lang: "English" },
    { id: 2, role: "ai", text: "Check-in starts on July 15.", lang: "English" },
    { id: 3, role: "user", text: "হোস্টেলে কখন উঠতে পারবো?", lang: "Bengali" },
    { id: 4, role: "ai", text: "১৫ জুলাই থেকে হোস্টেলে ওঠা যাবে।", lang: "Bengali" },
  ],

  // 5. ID card issue
  [
    { id: 1, role: "user", text: "How do I get my student ID card?", lang: "English" },
    { id: 2, role: "ai", text: "You can collect it from the admin office.", lang: "English" },
    { id: 3, role: "user", text: "आईडी कार्ड कैसे मिलेगा?", lang: "Hindi" },
    { id: 4, role: "ai", text: "आईडी कार्ड प्रशासन कार्यालय से मिलेगा।", lang: "Hindi" },
  ],

  // 6. Library card
  [
    { id: 1, role: "user", text: "How can I get a library card?", lang: "English" },
    { id: 2, role: "ai", text: "Apply online and collect it at the library desk.", lang: "English" },
    { id: 3, role: "user", text: "লাইব্রেরি কার্ড কিভাবে পাবো?", lang: "Bengali" },
    { id: 4, role: "ai", text: "অনলাইনে আবেদন করে লাইব্রেরি ডেস্ক থেকে সংগ্রহ করুন।", lang: "Bengali" },
  ],

  // 7. Transport schedule
  [
    { id: 1, role: "user", text: "When does the college bus leave?", lang: "English" },
    { id: 2, role: "ai", text: "The first bus leaves at 8 AM.", lang: "English" },
    { id: 3, role: "user", text: "बस कितने बजे चलती है?", lang: "Hindi" },
    { id: 4, role: "ai", text: "पहली बस सुबह 8 बजे चलती है।", lang: "Hindi" },
  ],

  // 8. Exam schedule
  [
    { id: 1, role: "user", text: "When are the semester exams?", lang: "English" },
    { id: 2, role: "ai", text: "Exams begin in the first week of December.", lang: "English" },
    { id: 3, role: "user", text: "পরীক্ষা কবে শুরু হবে?", lang: "Bengali" },
    { id: 4, role: "ai", text: "ডিসেম্বরের প্রথম সপ্তাহে পরীক্ষা শুরু হবে।", lang: "Bengali" },
  ],

  // 9. Certificate request
  [
    { id: 1, role: "user", text: "How to request a bonafide certificate?", lang: "English" },
    { id: 2, role: "ai", text: "Submit the form on the portal.", lang: "English" },
    { id: 3, role: "user", text: "बोनाफाइड सर्टिफिकेट कैसे मिलेगा?", lang: "Hindi" },
    { id: 4, role: "ai", text: "पोर्टल पर फ़ॉर्म भरकर प्राप्त किया जा सकता है।", lang: "Hindi" },
  ],

  // 10. WiFi login
  [
    { id: 1, role: "user", text: "How do I log into the campus WiFi?", lang: "English" },
    { id: 2, role: "ai", text: "Use your student email to sign in.", lang: "English" },
    { id: 3, role: "user", text: "ক্যাম্পাস ওয়াইফাইতে লগইন কিভাবে করবো?", lang: "Bengali" },
    { id: 4, role: "ai", text: "স্টুডেন্ট ইমেইল দিয়ে লগইন করুন।", lang: "Bengali" },
  ],
];


const Badge = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 dark:bg-white/10 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 cursor-default"
  >
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
    </span>
    <span className="text-xs font-medium text-gray-600 dark:text-gray-300 tracking-wide uppercase">
      {children}
    </span>
  </motion.div>
);

const NoiseOverlay = () => (
  <div
    className="absolute inset-0 z-50 pointer-events-none opacity-[0.05] dark:opacity-[0.05]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

const SpotlightButton = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-neutral-950 dark:bg-white px-8 font-medium text-white dark:text-black transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-50",
        className
      )}
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position] duration-[1500ms] ease-in-out group-hover:bg-[position:200%_0,0_0]" />
      {children}
    </motion.button>
  );
};

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-2xl",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
    {children}
  </div>
);

// --- Chat Simulation Component ---
const ChatSimulation = () => {

  const getRandomSet = () => {
    return messageSets[Math.floor(Math.random() * messageSets.length)];
  };
  const [currentSet, setCurrentSet] = useState(getRandomSet);
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    if (!currentSet) return;
    const interval = setInterval(() => {
      setVisibleIndex((prev) => {
        if (prev < currentSet.length - 1) {
          // show next message inside same set
          return prev + 1;
        }
  
        // when last message finished -> switch to next random set
        const nextSet = getRandomSet();
        setCurrentSet(nextSet);
        return -1; // restart index
      });
    }, 2500);
  
    return () => clearInterval(interval);
  }, [currentSet]);
  

  return (
    <div className="p-6 space-y-4 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        
      </div>
      <div className="space-y-4 h-[240px] md:h-[220px] overflow-hidden relative">
        <AnimatePresence mode="popLayout">
          {currentSet?.slice(0, visibleIndex + 1).map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              layout
              className={cn(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm",
                  msg.role === "user"
                    ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white rounded-tr-sm"
                    : "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/5 rounded-tl-sm"
                )}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Fade gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 " />
      </div>
    </div>
  );
};

export default function HeroSection() {
  const { scrollY } = useScroll();
  const {theme} = useTheme()
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const badgeColor = useMemo(
    () => (theme === "dark" ? "#20a7db" : "#2d62ef"),
    [theme])
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden ">
      
      {/* --- Background FX --- */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_80%)]"></div>
      <div className="hidden md:block absolute left-[-10%] top-[0%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-10 blur-[100px] dark:opacity-10"></div>
      <div className="hidden md:block absolute right-[-10%] top-[0%] -z-10 h-[400px] w-[400px] rounded-full bg-purple-500 opacity-10 blur-[120px] dark:opacity-10"></div>
      <NoiseOverlay />

      <div className="container relative z-10 px-4 md:px-6 pt-32 md:pt-24 pb-20 mx-auto"> 
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* --- Text Content --- */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
            <AnimatedBadge
            text="Community-Driven • Free"
            color={badgeColor}
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-black/40 to-black dark:from-white dark:to-gray-300 ">
                Campus Communication
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-400 dark:from-blue-100 dark:to-blue-600 tracking-tight ">
              Revolutionized Effortlessly<span className="hidden md:inline">.</span>
              </span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className=" max-w-[90%] md:max-w-xl leading-relaxed"
            >
              <ShinyText 
                text="The AI-first communication layer for modern institutions.
                Multilingual answers for students, zero overhead for staff." 
                disabled={false} 
                speed={5} 
                className='text-lg md:text-xl leading-relaxed' 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex md:mt-3 flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <SignUpButton mode="modal">
                <SpotlightButton className="w-full sm:w-auto shadow-lg shadow-blue-500/20">
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </SpotlightButton>
              </SignUpButton>
              
              <Link href="#features" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-8 font-medium text-neutral-900 dark:text-white transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  View Demo
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* --- Visual Content (Right Side) --- */}
          <div className="relative lg:h-[600px] flex items-center justify-center lg:justify-end perspective-1000">
            {/* Decorative background blobs for the visual */}
            

            {/* Main Floating Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 10, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.2 }}
              className="relative w-full max-w-[500px] z-20"
            >
              <GlassCard className="border-t border-white/50 dark:border-white/20">
                <ChatSimulation />
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}