"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValue } from "motion/react";
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";

// --- Data ---
const productLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Technology", href: "#tech-stack" },
  { label: "Pricing", href: "#pricing" },
];

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/askly", label: "Twitter" },
  { icon: Github, href: "https://github.com/askly", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/company/askly", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@askly.ai", label: "Email" },
];

// --- Micro-Interaction Components ---

// 1. Magnetic Link: Pulls towards the cursor slightly
const MagneticLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const { x, y } = position;

  return (
    <motion.div
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      <Link
        href={href}
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        className="group relative flex items-center gap-2 text-lg font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300 hover:text-black dark:hover:text-white"
      >
        <span className="relative overflow-hidden">
            <span className="block transition-transform duration-500 group-hover:-translate-y-full">
                {children}
            </span>
            <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                {children}
            </span>
        </span>
        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
      </Link>
    </motion.div>
  );
};

// 2. Animated Social Button
const SocialButton = ({ icon: Icon, href }: { icon: any; href: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.95 }}
    className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
  >
    <Icon className="h-5 w-5" />
  </motion.a>
);

// 3. Background Gradient Mesh
const AmbientBackground = () => {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[120px] animate-pulse-slow" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/5 blur-[120px] animate-pulse-slow delay-700" />
        </div>
    )
}

const CrossDotPattern = () => (
  <div className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_80%)]">
      {/* The Plus Grid */}
      <div className="absolute h-full w-full bg-[radial-gradient(#00000020_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#ffffff33_1px,transparent_1px)]" />
      
      {/* The Crosshairs Overlay - Adds the technical feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000008_1px,transparent_1px),linear-gradient(to_bottom,#0000008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>
);

export default function Footer() {
  // Scroll parallax effect for the container
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  return (
    <footer 
      ref={containerRef}
      className="relative w-full overflow-hidden  text-gray-900 dark:text-white pt-24 pb-12"
    ><CrossDotPattern/>
      <AmbientBackground />

      <motion.div 
        style={{ y, opacity }}
        className="max-w-[1232px] mx-auto xl:px-0 md:px-12 px-6 lg:px-24 sm:px-12"
      >
        {/* --- Top Section: Brand & Navigation --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-8 border-b border-gray-200/50 dark:border-white/10 pb-10">
          
          {/* Brand Column (Huge Impact) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-8">
              

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl md:text-5xl font-medium leading-[1.1] tracking-tight text-gray-900 dark:text-white max-w-2xl"
              >
                Transforming campus communication with <span className="text-gray-400 dark:text-neutral-500">intelligent AI.</span>
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed"
              >
                Making education accessible in every language. Built for the institutions of tomorrow.
              </motion.p>
            </div>
            
            {/* Socials (Desktop position) */}
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="hidden lg:flex gap-4 mt-12"
            >
              {socialLinks.map((social) => (
                <SocialButton key={social.label} {...social} />
              ))}
            </motion.div>
          </div>

          {/* Navigation Column (Minimalist List) */}
          <div className="lg:col-span-5 flex flex-col lg:items-end lg:text-right justify-end">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-1"
            >
                
                <div className="flex flex-col lg:items-end space-y-3">
                    {productLinks.map((link, idx) => (
                        <motion.div
                            key={link.label}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx, duration: 0.5 }}
                        >
                            <MagneticLink href={link.href}>{link.label}</MagneticLink>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

             {/* Mobile Socials */}
             <div className="flex lg:hidden gap-4 mt-12">
              {socialLinks.map((social) => (
                <SocialButton key={social.label} {...social} />
              ))}
            </div>
          </div>
        </div>

        {/* --- Bottom Section: Legal & Credits --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 text-sm text-gray-500 dark:text-gray-500">
          <div className="space-y-2">
            <p>© {new Date().getFullYear()} ASKLY. All rights reserved.</p>
            <p>Built for educational institutions by Utpal Sen</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
             <Badge text="Next.js 15" />
             <Badge text="Powered by AI" />
             <Badge text="Made in India" icon="🇮🇳" />
          </div>
        </div>

      </motion.div>
    </footer>
  );
}
const FooterBackground = () => {
  // 1. Mouse tracking for the spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement (butter smooth physics)
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // 2. Scroll Parallax: Text moves slightly slower than the footer (depth perception)
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0.6, 1], [-50, 50]); 

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ y: parallaxY }}
    >
      <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-full h-full flex items-end justify-center">
        
        <div className="relative group cursor-default pointer-events-auto">
            {/* The Text Container */}
            <h1 className="text-[23vw] font-black tracking-tighter text-center leading-none text-transparent">
              Askly
            </h1>

            {/* Layer 1: The Stroke/Outline (Always visible but faint) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <h1 className="text-[23vw] font-black tracking-tighter text-center leading-none text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-400 dark:from-white/10 dark:to-white/5 opacity-30 dark:opacity-20"
                   style={{ WebkitTextStroke: '1px rgba(156, 163, 175, 0.2)' }}>
                  ASKLY
               </h1>
            </div>

            {/* Layer 2: The Spotlight Reveal (Masked inside text) */}
            <motion.div 
              className="absolute inset-0 z-10 mix-blend-overlay dark:mix-blend-screen"
              style={{
                // This creates the mask. The text is transparent, background clips to text.
                background: useMotionTemplate`
                  radial-gradient(
                    circle 350px at ${x}px ${y}px,
                    rgba(59, 130, 246, 0.8),
                    rgba(147, 51, 234, 0.6),
                    transparent 80%
                  )
                `,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              <h1 className="text-[23vw] font-black tracking-tighter text-center leading-none">
                ASKLY
              </h1>
            </motion.div>

            {/* Surprise Element: Floating Particles/Sparkles inside the text on Hover */}
             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                 <div className="absolute bottom-[20%] left-[20%] w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                 <div className="absolute top-[30%] right-[25%] w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
             </div>
        </div>

      </div>
    </motion.div>
  );
};

// Small Badge Component
const Badge = ({ text, icon }: { text: string; icon?: string }) => (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 backdrop-blur-sm">
        {icon && <span>{icon}</span>}
        <span className="font-medium text-xs tracking-wide text-gray-600 dark:text-gray-400">{text}</span>
    </div>
)