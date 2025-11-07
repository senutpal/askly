"use client";

import { Badge } from "@workspace/ui/components/badge";
import ShinyText from "@workspace/ui/components/shinytext";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const benefits = [
  "Reduce routine query load by 70%",
  "Provide 24/7 instant answers in 5+ languages",
  "Free staff to handle complex issues",
  "Improve student satisfaction and accessibility",
  "Scale effortlessly with growing student base",
  "Maintain complete conversation history",
];

export default function SolutionSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div
          className={`text-center space-y-4 mb-16 sm:mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Badge
            id="solution"
            className="mb-4 md:mb-8 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors-smooth animate-fade-in"
          >
            The Solution
          </Badge>

          <div
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sans-alt font-bold"
            style={{ animationDelay: "150ms" }}
          >
            <div
              className={` pb-2 md:pb-5 transition-all duration-1000 delay-150  dark:from-white dark:to-gray-400 bg-gradient-to-b from-gray-500 to-gray-900 text-transparent bg-clip-text ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Meet Askly
            </div>
            <span
              className={`bg-gradient-to-b from-green-500 to-green-600 text-transparent bg-clip-text animate-shine transition-all duration-1000 delay-300 inline-block ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Your Multilingual AI Assistant
            </span>
          </div>

          <p
            className={`max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-all duration-1000 delay-[450ms] ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <ShinyText
              text=" Transform campus communication with an intelligent chatbot that
              understands and responds in your students' native languages."
              disabled={false}
              speed={6}
              className="max-w-2xl mx-auto text-xl leading-relaxed"
            />
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center mb-16">
          {/* Benefits List */}
          <div
            className={`space-y-6 transition-all duration-1000 delay-[600ms] ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-muted-foreground">
              What Askly Does For You ?
            </h3>

            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 group transition-all duration-500 hover:translate-x-2 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
                style={{
                  transitionDelay: `${700 + index * 100}ms`,
                }}
              >
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5 transition-transform-smooth group-hover:scale-110" />
                <span className="text-base sm:text-lg text-gray-700 dark:text-gray-200">
                  {benefit}
                </span>
              </div>
            ))}

            <div
              className={`pt-6 transition-all duration-1000 delay-[1300ms] ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-sm border-2 border-blue-200 dark:border-blue-800/50 hover:shadow-md dark:hover:shadow-blue-900/20 transition-all-smooth hover:scale-[1.02] backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center transition-colors-smooth">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                    Quick Setup
                  </h4>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Get started in minutes, not months. Upload your documents,
                  customize your widget, and start helping students
                  immediately—no coding required.
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div
            className={`relative transition-all duration-1000 delay-[800ms] ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl dark:shadow-purple-900/20 border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-3xl dark:hover:shadow-purple-900/30 transition-all-smooth hover:scale-[1.02] group">
              {/* Browser Chrome */}
              <div className="bg-gradient-to-r from-muted-foreground to-secondary p-4 flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors-smooth" />
                  <div className="w-3 h-3 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors-smooth" />
                  <div className="w-3 h-3 bg-white/30 rounded-full group-hover:bg-white/50 transition-colors-smooth" />
                </div>
                <span className="text-white text-sm font-medium ml-4">
                  Askly Dashboard
                </span>
              </div>

              {/* Dashboard Image */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
                <Image
                  alt="ASKLY Dashboard Preview"
                  height={582}
                  width={1080}
                  src="/dashboard.png"
                  className="object-cover w-full h-auto"
                />

                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/0 to-transparent group-hover:from-blue-600/5 dark:group-hover:from-blue-400/10 transition-all-smooth pointer-events-none" />
              </div>
            </div>

            {/* Floating Stats Cards */}
            <div
              className={`absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-blue-900/30 p-3 sm:p-4 border-2 border-blue-200 dark:border-blue-800 hover:shadow-xl dark:hover:shadow-blue-900/40 transition-all-smooth hover:scale-110 animate-float ${
                isVisible ? "animate-slide-in-right" : "opacity-0"
              }`}
              style={{
                animationDelay: "1000ms",
                animationDuration: "3s",
                animationIterationCount: "infinite",
              }}
            >
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                70%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                Less Queries
              </div>
            </div>

            <div
              className={`absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-purple-900/30 p-3 sm:p-4 border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl dark:hover:shadow-purple-900/40 transition-all-smooth hover:scale-110 animate-float ${
                isVisible ? "animate-slide-in-left" : "opacity-0"
              }`}
              style={{
                animationDelay: "1200ms",
                animationDuration: "3s",
                animationIterationCount: "infinite",
                animationDirection: "alternate",
              }}
            >
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
