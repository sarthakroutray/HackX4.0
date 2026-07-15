"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Team() {
  // Animations setup
  const titleContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
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
        delay: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full min-h-screen bg-transparent flex flex-col relative overflow-hidden">
      
      <div 
        className="absolute inset-y-0 left-0 w-[40vw] md:w-[35vw] pointer-events-none opacity-85 select-none z-0"
        style={{
          background: "linear-gradient(to right, #000000 0%, #1a0000 5%, #420202 12%, #8c0a0a 20%, #d41c1c 28%, #ff4d4d 34%, #ffaa66 38%, #fff0cc 42%, #ff4d4d 48%, #b81414 55%, #7a0808 63%, #420202 72%, #1e0000 82%, #090416 100%)",
          filter: "blur(18px) contrast(1.15) saturate(1.3)",
        }}
      />

      {/* Right Netflix Curtain */}
      <div 
        className="absolute inset-y-0 right-0 w-[40vw] md:w-[35vw] pointer-events-none opacity-85 select-none z-0"
        style={{
          background: "linear-gradient(to left, #000000 0%, #1a0000 5%, #420202 12%, #8c0a0a 20%, #d41c1c 28%, #ff4d4d 34%, #ffaa66 38%, #fff0cc 42%, #ff4d4d 48%, #b81414 55%, #7a0808 63%, #420202 72%, #1e0000 82%, #090416 100%)",
          filter: "blur(18px) contrast(1.15) saturate(1.3)",
        }}
      />

      {/* Subtle vignette/center darkness mapping the theater screen visual */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090416]/40 to-[#090416]/90 pointer-events-none z-0" />

      <div className="w-full h-screen flex flex-col items-center justify-center text-center px-6 md:px-12 select-none relative z-10">
        
        {/* Centered Typography Container */}
        <div className="relative flex flex-col items-center justify-center max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw]">
          
          {/* Plain Text above the heading */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="mb-4 pointer-events-auto"
          >
            <span className="text-[#FAF8F5]/60 text-2xl md:text-3xl lg:text-4xl font-serif italic tracking-wide lowercase">
              meet the humans behind the curtains
            </span>
          </motion.div>

          <motion.h1
            variants={titleContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center font-sans font-black uppercase tracking-tight leading-[0.88] text-center"
            style={{
              fontSize: "clamp(2.5rem, 8.5vw, 8.8rem)",
            }}
          >
            {/* Row 1: TEAM MUJ */}
            <div className="overflow-hidden py-1 md:py-2">
              <motion.span
                variants={lineVariants}
                className="block origin-bottom font-extrabold text-[#FAF8F5]"
              >
                TEAM MUJ
              </motion.span>
            </div>
            
            {/* Row 2: HACKX 4.0 */}
            <div className="overflow-hidden py-1 md:py-2">
              <motion.span
                variants={lineVariants}
                className="block origin-bottom text-[#FAF8F5] font-extrabold"
              >
                HACKX 4.0
              </motion.span>
            </div>
          </motion.h1>
        </div>
      </div>
    </div>
  );
}
