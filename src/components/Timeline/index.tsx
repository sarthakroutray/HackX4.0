"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useLenis } from "lenis/react";

const milestones = [
  {
    number: "1.",
    title: "REGISTRATION & CHECK-IN",
    time: "09:00 AM - 10:30 AM",
    description: "Get your badges, goodie bags, and settle into your hacking stations."
  },
  {
    number: "2.",
    title: "OPENING CEREMONY",
    time: "10:30 AM - 11:30 AM",
    description: "Keynote speech, theme reveals, guidelines briefing, and official kickoff."
  },
  {
    number: "3.",
    title: "HACKING BEGINS",
    time: "12:00 PM",
    description: "Brainstorming session, repository initialization, and design begins."
  },
  {
    number: "4.",
    title: "MENTORING ROUND 1",
    time: "04:00 PM - 06:00 PM",
    description: "First interaction with industry experts to refine prototypes and validate ideas."
  },
  {
    number: "5.",
    title: "MIDNIGHT SNACKS & FUN",
    time: "12:00 AM",
    description: "Unwind with mini-games, dynamic music, and late-night caffeine refills."
  },
  {
    number: "6.",
    title: "FINAL PITCH & JUDGING",
    time: "09:00 AM - 12:00 PM",
    description: "Project submissions, final presentations to the panel, and declaration of winners."
  }
];

export default function Timeline() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress manually to bypass hydration/ref lifecycle issues
  const scrollYProgress = useMotionValue(0);

  // Smooth scroll progress using a spring
  const progressSpring = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress from start center to end center
      const startPos = viewportHeight / 2;
      const currentPos = startPos - rect.top;
      const totalDist = rect.height;
      
      const progress = Math.max(0, Math.min(1, currentPos / totalDist));
      scrollYProgress.set(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run on mount
    handleScroll();

    // Run on a short delay to ensure Lenis has fully initialized and page layout is stable
    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [mounted, scrollYProgress]);

  // Scroll-snapping: stop at each milestone checkpoint step by step
  const lenis = useLenis();
  const isSnappingRef = useRef(false);
  const activeIndexRef = useRef(0);
  const cooldownRef = useRef(false);

  useEffect(() => {
    if (!mounted) return;

    // Compute the document scroll position that centers a given milestone's dot in the viewport
    const getTargetScrollY = (idx: number) => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalDist = rect.height;
      const containerTop = rect.top + window.scrollY;
      const milestoneProgress = ((idx + 0.5) * 1000) / 5500;
      return milestoneProgress * totalDist - viewportHeight / 2 + containerTop;
    };

    // Find the milestone index nearest to the current scroll position
    const getNearestIndex = () => {
      const currentY = window.scrollY;
      let nearestIdx = 0;
      let nearestDist = Infinity;
      milestones.forEach((_, idx) => {
        const dist = Math.abs(getTargetScrollY(idx) - currentY);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = idx;
        }
      });
      return nearestIdx;
    };

    const goToIndex = (idx: number) => {
      const clamped = Math.max(0, Math.min(milestones.length - 1, idx));
      activeIndexRef.current = clamped;
      const target = getTargetScrollY(clamped);
      isSnappingRef.current = true;
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          onComplete: () => {
            isSnappingRef.current = false;
          },
        });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
        setTimeout(() => (isSnappingRef.current = false), 800);
      }
    };

    // Is the timeline section currently the focus of the viewport?
    const isSectionActive = () => {
      if (!containerRef.current) return false;
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      return rect.top <= vh * 0.5 && rect.bottom >= vh * 0.5;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isSectionActive()) return;

      const direction = e.deltaY > 0 ? 1 : -1;

      // Allow the page to scroll away normally past the first/last checkpoint
      const nearest = getNearestIndex();
      const atEdge =
        (direction > 0 && nearest >= milestones.length - 1) ||
        (direction < 0 && nearest <= 0);
      if (atEdge && !isSnappingRef.current) return;

      // Take over scrolling entirely: block Lenis and native scroll for this gesture
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      if (cooldownRef.current || isSnappingRef.current) return;

      cooldownRef.current = true;
      activeIndexRef.current = nearest;
      goToIndex(activeIndexRef.current + direction);

      // Lock further stepping until this gesture's momentum settles
      setTimeout(() => {
        cooldownRef.current = false;
      }, 900);
    };

    // Capture phase + non-passive so we run before Lenis and can cancel the event
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true } as any);
    };
  }, [mounted, lenis]);

  // Map scroll progress to the Y position along the SVG viewBox (0 to 5500)
  const yPosition = useTransform(progressSpring, [0, 1], [0, 5500], { clamp: true });

  // Derived X position based on the sine wave formula
  const xPosition = useTransform(yPosition, (y) => {
    return 500 + 150 * Math.sin(y * (Math.PI / 1000) + Math.PI);
  });

  // Calculate pathLength progress to align exactly with the dot's Y position
  const lineProgress = useTransform(yPosition, [0, 5500], [0, 1], { clamp: true });

  // Generate the full SVG path Y=0 to Y=5500
  const generateFullPath = () => {
    let path = "";
    for (let y = 0; y <= 5500; y += 15) {
      const x = 500 + 150 * Math.sin(y * (Math.PI / 1000) + Math.PI);
      if (y === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += `L ${x} ${y}`;
      }
    }
    return path;
  };

  const fullPathD = generateFullPath();


  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[5500px] bg-transparent text-white select-none overflow-visible pt-24 pb-48 mb-[300px]"
    >
      <div className="absolute inset-y-0 left-6 md:left-1/2 -translate-x-0 md:-translate-x-1/2 w-[80px] md:w-[1000px] pointer-events-none z-10 overflow-visible">
        {mounted && (
        <svg 
          viewBox="0 0 1000 5500" 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradient for the animated timeline line */}
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#C076EC" />
              <stop offset="70%" stopColor="#572CE6" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            {/* Glowing filter for the active point */}
            <filter id="active-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background thin trace line */}
          <path
            d={fullPathD}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="3"
          />

          {/* Animated active drawing line */}
          <motion.path
            d={fullPathD}
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="4.5"
            style={{ pathLength: lineProgress }}
          />

          {/* Milestone static indicators */}
          {milestones.map((_, idx) => {
            const yVal = (idx + 0.5) * 1000;
            const xVal = 500 + 150 * Math.sin(yVal * (Math.PI / 1000) + Math.PI);
            return (
              <g key={idx}>
                {/* Outermost ring */}
                <circle
                  cx={xVal}
                  cy={yVal}
                  r="14"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1"
                />
                {/* Inner dot */}
                <circle
                  cx={xVal}
                  cy={yVal}
                  r="5"
                  fill="#ffffff"
                  opacity="0.65"
                />
              </g>
            );
          })}

          {/* Moving Active Tracker Dot with direct SVG circle coordinate animation (avoids Safari CSS transform bugs on SVG groups) */}
          <motion.circle
            cx={xPosition}
            cy={yPosition}
            r="22"
            fill="#ffffff"
            opacity="0.25"
          />
          <motion.circle
            cx={xPosition}
            cy={yPosition}
            r="9"
            fill="#ffffff"
          />

        </svg>
        )}
      </div>

      {/* Cards list absolutely positioned corresponding to their coordinates */}
      <div className="relative w-full max-w-[1200px] mx-auto h-full px-6 md:px-12 pointer-events-none">
        {milestones.map((item, idx) => {
          const yVal = (idx + 0.5) * 1000;
          const isLeft = idx % 2 !== 0; // Alternating cards left/right
          
          return (
            <div
              key={idx}
              style={{ top: `${yVal}px` }}
              className={`absolute -translate-y-1/2 left-[80px] md:left-[55%] w-[calc(100%-120px)] md:w-[38%] ${
                isLeft ? "md:left-auto md:right-[55%]" : ""
              } pointer-events-auto`}
            >
              <motion.div
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-25% 0px -25% 0px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col ${isLeft ? "md:items-end md:text-right" : "items-start text-left"}`}
              >
                {/* Milestone Big Number */}
                <span className="font-serif italic text-7xl md:text-8xl text-white leading-none mb-4 block select-none">
                  {item.number}
                </span>
                
                {/* Milestone Title */}
                <h3 className="font-sans font-bold text-white text-xl md:text-2xl tracking-wider mb-2">
                  {item.title}
                </h3>
                
                {/* Milestone Time */}
                <span className="font-serif italic text-xl md:text-2xl text-white/80 tracking-wide mb-3 block select-none">
                  {item.time}
                </span>
                
                {/* Milestone Description */}
                <p className="font-sans text-white/70 text-sm md:text-base leading-relaxed max-w-sm">
                  {item.description}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
