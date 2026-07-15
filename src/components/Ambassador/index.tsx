"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Themes from "@/components/Themes";
import PuzzleJoin from "@/components/PuzzleJoin";
import FAQ from "@/components/FAQ";

const AMBASSADOR_FAQ_DATA = [
  {
    question: "What is the Campus Ambassador Program?",
    answer: "It is a student leadership initiative where you serve as the primary link between MUJ HackX 4.0 and your college. You will lead outreach efforts, promote the hackathon, and guide teams on your campus to register."
  },
  {
    question: "Who is eligible to apply?",
    answer: "Any undergraduate or postgraduate student currently enrolled in a college or university is eligible. We look for passionate individuals, student developers, tech club leaders, and marketing enthusiasts."
  },
  {
    question: "What are my responsibilities as a Campus Ambassador?",
    answer: "Your core responsibilities include promoting HackX 4.0 on social media, sharing registration links within your student network, encouraging teams to register, and acting as the point-of-contact for college-wide queries."
  },
  {
    question: "What incentives and perks do I get?",
    answer: "You will receive an official Certificate of Appreciation, exclusive HackX schwags, cash incentives for top-performing ambassadors based on registrations, priority entry/selection for your own team in the hackathon, and valuable network connections."
  },
  {
    question: "Is there a registration fee or commitment requirement?",
    answer: "No, joining the program is completely free. The commitment is flexible, and you can carry out outreach activities around your academic schedule."
  },
  {
    question: "How are ambassadors selected?",
    answer: "Selection is based on your application details, engagement with student communities, communication skills, and enthusiasm for technology and community building."
  }
];

export default function Ambassador() {
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

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        delay: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative w-full min-h-screen bg-transparent text-white flex flex-col">
      {/* Background soft glows */}
      <div 
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none select-none z-0 filter blur-[150px] opacity-20"
        style={{
          background: "radial-gradient(circle, var(--color-violet) 0%, var(--color-magenta) 50%, transparent 100%)",
        }}
      />

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center px-6 md:px-12 select-none z-10">
        <div className="relative flex flex-col items-center justify-center max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] text-center">
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center font-sans font-black uppercase tracking-normal leading-[0.9] text-center text-[#FAF8F5]"
            style={{
              fontSize: "clamp(2rem, 6.2vw, 6.8rem)",
            }}
          >
            {/* Subtitle / First line */}
            <div className="overflow-hidden py-1 md:py-2 mb-2 md:mb-4">
              <motion.span
                variants={lineVariants}
                className="block origin-bottom font-serif italic font-normal text-white/60 tracking-normal text-2xl md:text-3xl lg:text-4xl normal-case"
              >
                Be the representative of your campus!
              </motion.span>
            </div>
            
            {/* Heading Line 1 */}
            <div className="overflow-hidden py-1 md:py-2">
              <motion.span
                variants={lineVariants}
                className="block origin-bottom font-extrabold text-[#FAF8F5]"
              >
                CAMPUS AMBASSADOR
              </motion.span>
            </div>

            {/* Heading Line 2 */}
            <div className="overflow-hidden py-1 md:py-2">
              <motion.span
                variants={lineVariants}
                className="block origin-bottom text-transparent bg-clip-text bg-gradient-to-r from-[#D242D7] via-[#B86EF9] to-white/95 font-black shadow-sm"
              >
                OF MUJ HACKX 4.0!
              </motion.span>
            </div>
          </motion.h1>

          {/* Apply Now Button */}
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 pointer-events-auto"
          >
            <Link
              href="#apply"
              className="relative inline-flex items-center justify-center px-10 py-5 rounded-full font-sans text-sm md:text-base font-semibold tracking-wider text-white uppercase border border-white/10 overflow-hidden group transition-all duration-300 hover:border-white/30 shadow-[0_0_20px_rgba(120,1,255,0.15)] hover:shadow-[0_0_35px_rgba(120,1,255,0.35)] bg-white/[0.03] backdrop-blur-md"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7801FF]/20 to-[#D242D7]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Apply Now
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Themes Component Section */}
      <section id="themes" className="relative w-full z-10">
        <Themes />
      </section>

      {/* Puzzle Component Section */}
      <section id="puzzle" className="relative w-full z-10">
        <PuzzleJoin />
      </section>

      {/* FAQ Component Section */}
      <section id="faq" className="relative w-full z-10">
        <FAQ 
          data={AMBASSADOR_FAQ_DATA} 
          heading={
            <>
              Campus Ambassador <br />program faqs.
            </>
          } 
        />
      </section>
    </div>
  );
}
