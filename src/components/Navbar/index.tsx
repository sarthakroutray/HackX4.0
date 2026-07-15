"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "#about" },
    { label: "Timeline", href: "#timeline" },
    { label: "Ambassador", href: "#ambassador" },
    { label: "Team", href: "#team" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ];

  // Wipe animation
  const menuVariants = {
    initial: {
      y: "-100%",
    },
    animate: {
      y: "0%",
      transition: {
        duration: 0.95,
        ease: [0.76, 0, 0.24, 1], 
      },
    },
    exit: {
      y: "-100%",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const navLinksVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.5, 
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const linkVariants = {
    initial: {
      y: 60,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
    exit: {
      y: 30,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  const footerVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.75, 
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.35,
        ease: "easeIn",
      },
    },
  };

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <>
      {/* Sleek Floating Header Bar */}
      <header className="fixed top-0 left-0 w-full z-50 h-24 md:h-32 px-7 md:px-12 flex justify-between items-center mix-blend-difference pointer-events-none">
        <button
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto group flex items-center gap-3 text-white hover:opacity-85 transition-opacity font-sans text-xs md:text-sm font-normal tracking-tight"
          aria-label="Open Menu"
        >
          <div className="flex flex-col gap-1.5 justify-center items-start w-5">
            <span className="w-5 h-[1.2px] bg-white transition-all duration-300 group-hover:w-3.5"></span>
            <span className="w-3.5 h-[1.2px] bg-white transition-all duration-300 group-hover:w-5"></span>
          </div>
          <span className="relative top-[-0.5px]">Menu</span>
        </button>

        <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/">
            <img
              src="/assets/logos/HACKX%20White@2x.png"
              alt="HACKX Logo"
              className="h-8 md:h-11 w-auto hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        <a
          href="#register"
          className="pointer-events-auto group/btn font-sans text-xs md:text-sm font-normal tracking-tight text-white hover:opacity-85 transition-opacity flex items-center gap-1.5"
        >
          <span>Register</span>
          <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
        </a>
      </header>

      {/* Fullscreen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              background: "radial-gradient(ellipse at center, rgba(192, 118, 236, 0.42) 0%, rgba(162, 35, 237, 0.28) 45%, rgba(87, 44, 230, 0.15) 75%, #08010F 100%)",
              backgroundColor: "#08010F",
            }}
            className="fixed inset-0 w-screen h-screen z-50 flex flex-col justify-between px-6 py-8 md:px-12 md:py-12 select-none overflow-hidden"
          >
            {/* Overlay Header with Close Button */}
            <div className="flex justify-start items-center w-full">
              <button
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-center text-[#F9F6F0] hover:opacity-75 transition-opacity"
                aria-label="Close Menu"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <span className="absolute w-6 h-[1.5px] bg-[#F9F6F0] rotate-45 transition-transform duration-300 group-hover:rotate-90"></span>
                  <span className="absolute w-6 h-[1.5px] bg-[#F9F6F0] -rotate-45 transition-transform duration-300 group-hover:rotate-0"></span>
                </div>
              </button>
            </div>

            {/* Menu Items Centered */}
            <div className="flex-grow flex items-center justify-center">
              <motion.nav
                variants={navLinksVariants}
                className="flex flex-col items-center justify-center gap-2 text-center"
              >
                {menuItems.map((item, idx) => {
                  const isHovered = hoveredIdx === idx;
                  const isAnyHovered = hoveredIdx !== null;
                  const distance = isAnyHovered ? Math.abs((hoveredIdx as number) - idx) : 0;
                  
                  // Distance-based blur cap to handle 7 items elegantly
                  const blurVal = isAnyHovered ? (isHovered ? 0 : Math.min(12, 4 + distance * 3.5)) : 0;
                  const opacityVal = isAnyHovered ? (isHovered ? 1 : Math.max(0.12, 0.45 - distance * 0.05)) : 1;
                  const scaleVal = isHovered ? 1.03 : 1;

                  return (
                    <div key={idx} className="py-1 px-4 overflow-visible">
                      <motion.div variants={linkVariants}>
                        <motion.div
                          animate={{
                            filter: `blur(${blurVal}px)`,
                            opacity: opacityVal,
                            scale: scaleVal,
                          }}
                          transition={{
                            duration: 0.45,
                            ease: [0.25, 1, 0.5, 1], 
                          }}
                          className="origin-center"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-[#F9F6F0] font-sans cursor-pointer select-none"
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.nav>
            </div>

            {/* Contact Info at bottom */}
            <motion.div
              variants={footerVariants}
              className="flex flex-col items-center justify-center text-center mt-auto"
            >
              <span className="font-serif italic text-xs md:text-sm text-[#F9F6F0]/80 mb-1">
                Contact us
              </span>
              <a
                href="mailto:HACKXMUJ@GMAIL.COM"
                className="text-[#F9F6F0] text-xs md:text-sm font-sans tracking-wide hover:opacity-75 transition-opacity border-b border-[#F9F6F0] pb-0.5"
              >
                HACKXMUJ@GMAIL.COM
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
