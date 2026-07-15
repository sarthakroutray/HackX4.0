"use client";

import React from "react";
import { motion } from "framer-motion";
import SdgComponent from "@/components/sdg";
import Stats from "@/components/Stats";
import Themes from "@/components/Themes";

export default function Home() {
  // Smooth staggered entry animations
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.25,
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

  const accentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <div className="relative w-full h-[100vh] flex flex-col items-center justify-center bg-transparent overflow-hidden px-6 md:px-12 select-none">
        
        {/* Relative container to keep typography and its side accents grouped and close */}
        <div className="relative flex flex-col items-center justify-center max-w-[85vw] md:max-w-[70vw]">
          {/* Main Center Typography Group */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center font-sans font-medium uppercase tracking-normal leading-[0.85] text-center text-[#FAF8F5]"
            style={{
              fontSize: "clamp(1.8rem, 5.4vw, 5.6rem)",
            }}
          >
            <div className="overflow-hidden py-1 md:py-2">
              <motion.span variants={lineVariants} className="block origin-bottom font-medium">
                Department of SCSE
              </motion.span>
            </div>
            <div className="overflow-hidden py-1 md:py-2">
              <motion.span variants={lineVariants} className="block origin-bottom font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FAF8F5] to-white/90">
                Muj HackX 4.0
              </motion.span>
            </div>
            <div className="overflow-hidden py-1 md:py-2">
              <motion.span variants={lineVariants} className="block origin-bottom font-medium">
                Muj's Largest
              </motion.span>
            </div>
            <div className="overflow-hidden py-1 md:py-2">
              <motion.span variants={lineVariants} className="block origin-bottom font-medium">
                Hackathon
              </motion.span>
            </div>
          </motion.h1>

          {/* Bottom Left Accent (corresponds to Since 2020) */}
          <motion.div
            variants={accentVariants}
            initial="hidden"
            animate="visible"
            className="absolute left-[-1.5vw] bottom-[0.5vh] md:left-[-4vw] md:bottom-[0.5vh] font-serif italic text-xs md:text-sm text-white hover:opacity-80 transition-opacity pointer-events-auto cursor-default whitespace-nowrap"
          >
            HackX 2026
          </motion.div>

          {/* Middle/Bottom Right Accent (corresponds to VN | CN | FR) */}
          <motion.div
            variants={accentVariants}
            initial="hidden"
            animate="visible"
            className="absolute right-[-1.5vw] bottom-[0.5vh] md:right-[-4vw] md:bottom-[0.5vh] font-serif italic text-xs md:text-sm tracking-widest text-white hover:opacity-80 transition-opacity pointer-events-auto cursor-default flex flex-col md:flex-row items-center gap-1.5 md:gap-3 whitespace-nowrap"
          >
            <span>SCSE</span>
            <span className="hidden md:inline text-white/30">|</span>
            <span>MUJ</span>
          </motion.div>
        </div>

        {/* Bottom Center Scroll Indicator (corresponds to circle and vertical line) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none z-10"
        >
          <span className="w-1.5 h-1.5 rounded-full border border-[#FAF8F5]/40 mb-2 animate-pulse"></span>
          <div className="w-[1px] h-16 md:h-20 bg-gradient-to-b from-[#FAF8F5]/30 via-[#FAF8F5]/10 to-transparent"></div>
        </motion.div>

      </div>

      <SdgComponent />
      <Stats />
      <Themes />
    </>
  );
}
