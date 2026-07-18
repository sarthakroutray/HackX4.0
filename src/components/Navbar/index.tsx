"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isSafari, setIsSafari] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      const isSafariBrowser =
        ua.includes("safari") &&
        !ua.includes("chrome") &&
        !ua.includes("chromium") &&
        !ua.includes("android");
      setIsSafari(isSafariBrowser);
    }
  }, []);

  const handleMouseEnter = () => {
    const lines = buttonRef.current?.querySelectorAll("span");
    if (!lines || lines.length < 2) return;

    // Kill any active hover animations and timelines
    hoverTimelineRef.current?.kill();
    gsap.killTweensOf(lines);

    const tl = gsap.timeline();
    hoverTimelineRef.current = tl;

    if (isOpen) {
      // Premium diagonal scissor slide-out-in (the cross "builds" itself)
      tl.to(lines[0], { x: -24, y: -24, opacity: 0, duration: 0.2, ease: "power2.in" }, 0)
        .to(lines[1], { x: 24, y: -24, opacity: 0, duration: 0.2, ease: "power2.in" }, 0)
        // Teleport to opposite diagonal corners
        .set(lines[0], { x: 24, y: 24 })
        .set(lines[1], { x: -24, y: 24 })
        // Slide back to center from opposite corners
        .to(lines[0], { x: 0, y: 0, opacity: 1, duration: 0.25, ease: "power2.out" }, ">")
        .to(lines[1], { x: 0, y: 0, opacity: 1, duration: 0.25, ease: "power2.out" }, "<");
    } else {
      // Top line slides right (135%), bottom line slides left (-135%)
      tl.to(lines[0], { x: "135%", duration: 0.2, ease: "power2.in" }, 0)
        .to(lines[1], { x: "-135%", duration: 0.2, ease: "power2.in" }, 0)
        // Teleport to opposite sides
        .set(lines[0], { x: "-135%" })
        .set(lines[1], { x: "135%" })
        // Slide back to center from opposite sides
        .to(lines[0], { x: "0%", duration: 0.25, ease: "power2.out" }, ">")
        .to(lines[1], { x: "0%", duration: 0.25, ease: "power2.out" }, "<");
    }
  };

  const handleMouseLeave = () => {
    if (!isOpen) return;
    const lines = buttonRef.current?.querySelectorAll("span");
    if (!lines || lines.length < 2) return;

    hoverTimelineRef.current?.kill();
    gsap.killTweensOf(lines);
    // Smoothly slide back to the base cross state (45deg / -45deg)
    gsap.to(lines[0], { x: 0, y: 0, rotation: 45, opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(lines[1], { x: 0, y: 0, rotation: -45, opacity: 1, duration: 0.35, ease: "power2.out" });
  };

  const isInitialRender = useRef(true);

  // Synchronized state transformations
  useEffect(() => {
    const lines = buttonRef.current?.querySelectorAll("span");
    if (!lines || lines.length < 2) return;

    hoverTimelineRef.current?.kill();
    gsap.killTweensOf(lines);

    if (isInitialRender.current) {
      isInitialRender.current = false;
      gsap.set(lines[0], { y: -4, rotation: 0, x: 0, opacity: 1 });
      gsap.set(lines[1], { y: 4, rotation: 0, x: 0, opacity: 1 });
      return;
    }

    if (isOpen) {
      gsap.to(lines[0], {
        y: 0,
        rotation: 45,
        x: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out"
      });
      gsap.to(lines[1], {
        y: 0,
        rotation: -45,
        x: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out"
      });
    } else {
      gsap.to(lines[0], {
        y: -4,
        rotation: 0,
        x: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out"
      });
      gsap.to(lines[1], {
        y: 4,
        rotation: 0,
        x: 0,
        opacity: 1,
        duration: 0.35,
        ease: "power2.out"
      });
    }
  }, [isOpen]);

  // Clean up all running GSAP timelines on unmount
  useEffect(() => {
    return () => {
      hoverTimelineRef.current?.kill();
      const lines = buttonRef.current?.querySelectorAll("span");
      if (lines) {
        gsap.killTweensOf(lines);
      }
    };
  }, []);

  // Keyboard navigation event handler (a11y)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Timeline", href: "/timeline" },
    { label: "Ambassador", href: "/ambassador" },
    { label: "Team", href: "/team" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
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

  if (pathname === "/test-shader") return null;

  return (
    <>
      {/* Sleek Floating Header Bar */}
      <header className="fixed top-0 left-0 z-[100] isolate h-24 w-full overflow-hidden px-7 md:h-32 md:px-12 flex justify-between items-center pointer-events-none">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 will-change-[backdrop-filter]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(4, 5, 16, 0.78) 0%, rgba(4, 5, 16, 0.48) 56%, rgba(4, 5, 16, 0.16) 82%, rgba(4, 5, 16, 0) 100%)",
            backdropFilter: isSafari ? "none" : "blur(52px) saturate(1.7)",
            WebkitBackdropFilter: isSafari ? "none" : "blur(52px) saturate(1.7)",
          }}
        />
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="pointer-events-auto relative z-10 group flex items-center gap-2.5 justify-center text-white hover:opacity-85 transition-opacity mix-blend-difference"
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
            <span className="absolute w-4 h-[0.5px] bg-white" style={{ transform: "translateY(-4px)" }}></span>
            <span className="absolute w-4 h-[0.5px] bg-white" style={{ transform: "translateY(4px)" }}></span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold font-sans h-4 flex items-center overflow-hidden relative select-none">
            <AnimatePresence mode="wait">
              <motion.span
                key={isOpen ? "close" : "menu"}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="block"
              >
                {isOpen ? "Close" : "Menu"}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>

        <div className="pointer-events-auto absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-difference">
          <Link href="/">
            <img
              src="/assets/logos/HACKX%20White@2x.png"
              alt="HACKX Logo"
              className="h-8 md:h-11 w-auto hover:opacity-80 transition-opacity"
              style={{
                filter: "hue-rotate(var(--logo-hue-rotate, 0deg))",
              }}
            />
          </Link>
        </div>

        <a
          href="#register"
          className="pointer-events-auto relative z-10 group/btn font-sans text-xs md:text-sm font-normal tracking-tight text-white hover:opacity-85 transition-opacity flex items-center gap-1.5 mix-blend-difference"
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
            className="fixed inset-0 w-screen h-screen z-[90] flex flex-col justify-between px-6 py-8 md:px-12 md:py-12 select-none overflow-hidden"
          >
            {/* Overlay Spacer to maintain layout alignment */}
            <div className="flex justify-start items-center w-full h-6 pointer-events-none" />

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
                  
                  // Distance-based blur cap to handle 7 items elegantly, disabled on mobile view
                  const blurVal = !isMobile && isAnyHovered ? (isHovered ? 0 : Math.min(12, 4 + distance * 3.5)) : 0;
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
                          className="origin-center will-change-[filter,opacity,transform]"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-normal text-[#F9F6F0] font-sans cursor-pointer select-none"
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
                href="mailto:hackxmuj@gmail.com"
                className="text-[#F9F6F0] text-xs md:text-sm font-sans tracking-wide hover:opacity-75 transition-opacity border-b border-[#F9F6F0] pb-0.5"
              >
                hackxmuj@gmail.com
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
