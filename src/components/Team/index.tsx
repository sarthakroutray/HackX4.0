"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import NetflixCurtainBackground from "@/components/NetflixCurtainBackground/NetflixCurtainBackground";

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const TEAM_MEMBERS = [
  {
    name: "Aryan Verma",
    role: "Student Convener",
    initials: "AV",
    image: "/assets/team/aryan.jpg",
    socials: {
      instagram: "#",
      linkedin: "#",
      phone: "tel:+918287044755",
    },
  },
  {
    name: "Samaksh Gupta",
    role: "Student Convener",
    initials: "SG",
    image: "/assets/team/samaksh.jpg",
    socials: {
      instagram: "#",
      linkedin: "#",
      phone: "tel:+919871340076",
    },
  },
  {
    name: "Tamanna Yadav",
    role: "Student Convener",
    initials: "TY",
    image: "/assets/team/tamanna.jpg",
    socials: {
      linkedin: "#",
      phone: "tel:+918860514740",
    },
  },
  {
    name: "Harshada Chandel",
    role: "Student Convener",
    initials: "HC",
    image: "/assets/team/harshada.jpg",
    socials: {
      linkedin: "#",
      phone: "tel:+919821970872",
    },
  },
];

export default function Team() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── scroll progress through the tall container ── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scale: 1 → 45
  const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 45]);
  // Opacity: visible → gone (overlapping with card entry)
  const heroOpacity = useTransform(scrollYProgress, [0.3, 0.55], [1, 0]);
  // Blur: 0px → 20px (diffuses the text as it zooms close)
  const heroBlur = useTransform(scrollYProgress, [0.25, 0.55], ["blur(0px)", "blur(20px)"]);
  // Curtains fade out
  const curtainOpacity = useTransform(scrollYProgress, [0, 0.35], [0.85, 0]);

  /* ── Staggered Team grid transforms ── */
  const labelOpacity = useTransform(scrollYProgress, [0.40, 0.54], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.40, 0.54], [40, 0]);

  const cardOpacity0 = useTransform(scrollYProgress, [0.43, 0.57], [0, 1]);
  const cardOpacity1 = useTransform(scrollYProgress, [0.46, 0.60], [0, 1]);
  const cardOpacity2 = useTransform(scrollYProgress, [0.49, 0.63], [0, 1]);
  const cardOpacity3 = useTransform(scrollYProgress, [0.52, 0.66], [0, 1]);

  const cardY0 = useTransform(scrollYProgress, [0.43, 0.57], [60, 0]);
  const cardY1 = useTransform(scrollYProgress, [0.46, 0.60], [60, 0]);
  const cardY2 = useTransform(scrollYProgress, [0.49, 0.63], [60, 0]);
  const cardY3 = useTransform(scrollYProgress, [0.52, 0.66], [60, 0]);

  const cardOpacities = [cardOpacity0, cardOpacity1, cardOpacity2, cardOpacity3];
  const cardYs = [cardY0, cardY1, cardY2, cardY3];

  /* ── Entry animations ── */
  const titleContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const lineVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, delay: 0.7, ease: "easeOut" },
    },
  };

  return (
    /* The tall scroll container – 700vh gives enough room for
       the zoom-in + team reveal + breathing space */
    <div ref={containerRef} className="relative" style={{ height: "700vh" }}>

      <div className="sticky top-0 w-full h-screen overflow-hidden bg-transparent">
        <NetflixCurtainBackground scrollYProgress={scrollYProgress} />

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 select-none z-10"
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            filter: heroBlur,
            transformOrigin: "54% 61%",
          }}
        >
          <div className="relative flex flex-col items-center justify-center max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw]">
            {/* Subtitle */}
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mb-6 md:mb-8 pointer-events-auto"
            >
              <span className="text-[#FAF8F5]/60 text-2xl md:text-3xl lg:text-4xl font-serif italic tracking-wide">
                Meet The Humans Behind The Curtains
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={titleContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center justify-center font-sans font-black uppercase tracking-normal leading-[0.98] text-center"
              style={{ fontSize: "clamp(2.5rem, 8.5vw, 8.8rem)" }}
            >
              <div className="overflow-hidden py-1 md:py-2">
                <motion.span
                  variants={lineVariants}
                  className="block origin-bottom font-extrabold text-[#FAF8F5]"
                >
                  TEAM MUJ
                </motion.span>
              </div>
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
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center z-20 px-6 md:px-12 bg-transparent">
          <div className="w-full max-w-6xl">
            {/* Section label */}
            <motion.p
              className="text-center text-[#FAF8F5]/50 text-sm md:text-base tracking-[0.3em] uppercase font-sans font-medium mb-10 md:mb-14"
              style={{ opacity: labelOpacity, y: labelY }}
            >
              The Team
            </motion.p>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {TEAM_MEMBERS.map((member, i) => (
                <motion.div
                  key={member.name}
                  className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.07] overflow-hidden"
                  style={{
                    opacity: cardOpacities[i] || 1,
                    y: cardYs[i] || 0
                  }}
                >
                  {/* Photo area */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden m-3 md:m-4 rounded-xl" style={{ width: 'calc(100% - 1.5rem)', marginLeft: '0.75rem' }}>
                    {/* Gradient background with initials (fallback / avatar) */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(145deg, #7801FF ${10 + i * 8}%, #D242D7 ${45 + i * 5}%, #B86EF9 ${75 + i * 3}%, #E1E1F5 100%)`,
                      }}
                    >
                      <span className="text-white/80 font-bold text-4xl md:text-5xl tracking-wider select-none">
                        {member.initials}
                      </span>
                    </div>
                    {/* Subtle top shine */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 pointer-events-none" />
                  </div>

                  {/* Info area */}
                  <div className="flex flex-col items-center text-center px-3 md:px-4 pt-3 pb-2">
                    <h3 className="text-[#FAF8F5] text-sm md:text-base font-semibold tracking-wide mb-1 transition-colors duration-300 group-hover:text-white">
                      {member.name}
                    </h3>
                    <p className="text-[#FAF8F5]/40 text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase mb-4">
                      {member.role}
                    </p>

                    {/* Social icons row */}
                    <div className="flex items-center gap-2 mb-3">
                      {member.socials.instagram && (
                        <a
                          href={member.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/[0.12] flex items-center justify-center text-[#FAF8F5]/40 transition-all duration-300 hover:border-[#D242D7]/50 hover:text-[#D242D7] hover:bg-white/[0.05]"
                        >
                          <InstagramIcon />
                        </a>
                      )}
                      {member.socials.linkedin && (
                        <a
                          href={member.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/[0.12] flex items-center justify-center text-[#FAF8F5]/40 transition-all duration-300 hover:border-[#7801FF]/50 hover:text-[#7801FF] hover:bg-white/[0.05]"
                        >
                          <LinkedInIcon />
                        </a>
                      )}
                      {member.socials.phone && (
                        <a
                          href={member.socials.phone}
                          className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/[0.12] flex items-center justify-center text-[#FAF8F5]/40 transition-all duration-300 hover:border-[#B86EF9]/50 hover:text-[#B86EF9] hover:bg-white/[0.05]"
                        >
                          <PhoneIcon />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
