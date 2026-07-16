"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function WhyApply() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-32 lg:py-40">


      {/* Large outlined background text */}
      <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none select-none overflow-hidden">
        <div className="flex flex-col items-center justify-center leading-[0.85] w-full">
          <span
            className="block font-sans font-black uppercase text-center"
            style={{
              fontSize: "clamp(3rem, 12vw, 14rem)",
              WebkitTextStroke: "2px rgba(255,255,255,0.70)",
              color: "transparent",
              opacity: 0.4,
              letterSpacing: "-0.02em",
            }}
          >
            WHY SHOULD
          </span>
          <div className="h-60 md:h-80 lg:h-[200px]" />
          <span
            className="block font-sans font-black uppercase text-center translate-y-3 md:translate-y-11"
            style={{
              fontSize: "clamp(3rem, 12vw, 14rem)",
              WebkitTextStroke: "2px rgba(255,255,255,0.70)",
              color: "transparent",
              opacity: 0.4,
              letterSpacing: "-0.02em",
            }}
          >
            YOU APPLY?
          </span>
        </div>
      </div>

      {/* Floating card + heart icon */}
      <div className="relative z-10 flex items-center justify-center px-6 md:px-12 min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-3xl w-full -translate-y-8 md:-translate-y-12"
        >
          {/* Heart badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="absolute -top-12 -right-6 md:-top-16 md:-right-8 z-20"
          >
            <Image
              src="/assets/logos/HACKX White@2x.png"
              alt="HackX Logo"
              width={140}
              height={140}
              className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Main card */}
          <div
            className="relative rounded-3xl p-10 md:p-14 overflow-hidden border border-white/10"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.2), 0 8px 20px rgba(0,0,0,0.15)",
            }}
          >


            <p
              className="font-sans text-white/90 text-lg md:text-xl lg:text-2xl leading-relaxed font-medium"
              style={{ letterSpacing: "0.01em" }}
            >
              Becoming a Campus Ambassador offers a unique opportunity to develop
              your professional skills, network with industry leaders, and gain
              invaluable experience that will set you apart in the job market.
            </p>


          </div>
        </motion.div>
      </div>
    </section>
  );
}
