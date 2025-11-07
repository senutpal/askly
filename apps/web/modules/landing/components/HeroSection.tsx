"use client";

import { Button } from "@workspace/ui/components/button";
import ShinyText from "@workspace/ui/components/shinytext";
import { AnimatedBadge } from "@workspace/ui/components/animated-badge";
import { ArrowRight, MessageSquare, Globe, Clock } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useMemo } from "react";

export default function HeroSection() {
  const { theme } = useTheme();

  const badgeColor = useMemo(
    () => (theme === "dark" ? "#20a7db" : "#2d62ef"),
    [theme]
  );

  return (
    <section className="relative pt-28 md:pt-32 lg:pt-28 pb-12 md:pb-36 lg:pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden animate-slide-up">
      <div className="max-w-7xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center px-4 rounded-full font-medium">
          <AnimatedBadge
            text="Multilingual AI-Powered Campus Support"
            color={badgeColor}
          />
        </div>

        {/* Heading */}
        <div className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight space-y-2">
          <div className="pb-2 font-sans-alt  dark:from-white dark:to-gray-400 bg-gradient-to-b from-gray-500 to-gray-900 text-transparent bg-clip-text">
            Break Language Barriers
          </div>
          <span className="font-sans-alt bg-gradient-to-b from-blue-400 to-blue-500 text-transparent bg-clip-text inline-block">
            Empower Every Student
          </span>
        </div>

        {/* Sub Heading */}
        <ShinyText
          text="Askly transforms campus communication with multilingual chatbot support. 
          Answer student queries in Hindi, English, and regional languages—24/7, instantly, and accurately"
          disabled={false}
          speed={6}
          className="max-w-2xl mx-auto text-xl leading-relaxed"
        />
        <p className="md:hidden max-w-[300px] mx-auto text-xl leading-relaxed text-muted-foreground">
          Answer queries in any language <br />
          24/7, instantly, and accurately
        </p>

        {/* Stats */}
        <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-4 md:gap-8 pt-4">
          {[
            {
              Icon: MessageSquare,
              number: "70%",
              label: "Reduced Query Load",
              color: "blue",
            },
            {
              Icon: Globe,
              number: "5+",
              label: "Languages Supported",
              color: "purple",
            },
            {
              Icon: Clock,
              number: "24/7",
              label: "Instant Answers",
              color: "green",
            },
          ].map(({ Icon, number, label, color }, i) => (
            <div
              key={i}
              className="flex items-center md:space-x-2 gap-2 md:gap-0"
            >
              <Icon
                className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                <span
                  className={`text-${color}-600 dark:text-${color}-400 font-bold`}
                >
                  {number}
                </span>{" "}
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <SignUpButton mode="modal">
            <Button
              size="default"
              className="group bg-gradient-to-b from-gray-800 to-black dark:from-white dark:to-gray-200 animate-slide-in-left hover:scale-105 transition-transform"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>

          <Button
            size="default"
            variant="outline"
            asChild
            className="animate-slide-in-right hover:scale-105 transition-transform"
          >
            <Link href="#features">Features</Link>
          </Button>
        </div>

        {/* Trust Line */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Trusted by educational institutions • Enterprise-grade security • No
          credit card required
        </p>
      </div>
    </section>
  );
}
