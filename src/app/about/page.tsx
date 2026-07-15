"use client";

import React from "react";
import { motion } from "framer-motion";
import WhyHackX from "@/components/WhyHackX";

export default function AboutPage() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const lineVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1], // easeOutExponential
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        delay: 0.65,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full min-h-screen bg-transparent flex flex-col">
      {/* Full-Height Hero Section */}
      <div className="w-full h-[100vh] flex flex-col items-center justify-center text-center px-6 md:px-12 select-none relative overflow-hidden">
        
        {/* Centered Hero Typography */}
        <div className="relative flex flex-col items-center justify-center max-w-[90vw] md:max-w-[75vw]">
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center font-sans font-black uppercase tracking-tighter leading-[0.82] text-center"
            style={{
              fontSize: "clamp(2rem, 5.8vw, 6.2rem)",
            }}
          >
            <div className="overflow-hidden py-1 md:py-2">
              <motion.span
                variants={lineVariants}
                className="block origin-bottom font-serif italic font-normal text-white/50 lowercase tracking-normal"
              >
                why participate in
              </motion.span>
            </div>
            
            <div className="overflow-hidden py-1 md:py-2">
              <motion.span
                variants={lineVariants}
                className="block origin-bottom text-white font-extrabold"
              >
                THE ARENA OF
              </motion.span>
            </div>

            <div className="overflow-hidden py-1 md:py-2">
              <motion.span
                variants={lineVariants}
                className="block origin-bottom text-transparent bg-clip-text bg-gradient-to-r from-[#D242D7] via-[#B86EF9] to-white/95 font-black shadow-sm"
              >
                HACKX 4.0?
              </motion.span>
            </div>
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 md:mt-10 max-w-2xl text-[#F9F6F0]/70 text-sm md:text-base lg:text-lg font-sans font-normal leading-relaxed"
          >
            Step into a 36-hour sandbox of pure innovation. Turn your wildest ideas into reality, 
            collaborate with exceptional minds, and pitch to leading tech founders. This is where 
            your journey accelerates.
          </motion.p>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-10"
        >
          <span className="w-1.5 h-1.5 rounded-full border border-[#FAF8F5]/40 mb-2 animate-pulse shadow-[0_0_8px_#D242D7]"></span>
          <div className="w-[1px] h-16 md:h-20 bg-gradient-to-b from-[#B86EF9]/40 via-[#B86EF9]/10 to-transparent"></div>
        </motion.div>

      </div>

      {/* Sticky Content Section */}
      <WhyHackX />
    </div>
  );
}
