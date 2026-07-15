"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function PuzzleJoin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPieceRef = useRef<HTMLDivElement>(null);
  const rightPieceRef = useRef<HTMLDivElement>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isReady, setIsReady] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    if (!isReady) return;

    const leftPiece = leftPieceRef.current;
    const rightPiece = rightPieceRef.current;
    const container = containerRef.current;

    if (!leftPiece || !rightPiece || !container) return;

    // Reset initial states to ensure clean dimensions
    gsap.set([leftPiece, rightPiece], { xPercent: 0, rotate: 0, opacity: 1 });

    // Create GSAP timeline for scroll scrubbing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=120%", // Scroll height to trigger join
        scrub: 1,      // Smooth scrubbing lag
        pin: true,     // Pin the section while scrolling
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Snap threshold: if scroll progress is near 100% (e.g., > 90%), mark as joined
          if (self.progress > 0.9) {
            setIsJoined(true);
          } else {
            setIsJoined(false);
          }
        },
      },
    });

    // Animate puzzle pieces coming together from left and right using relative percentage translation
    tl.fromTo(
      leftPiece,
      { xPercent: -150, opacity: 0.4, rotate: -8 },
      { xPercent: 0, opacity: 1, rotate: 0, ease: "power1.out" },
      0
    );

    tl.fromTo(
      rightPiece,
      { xPercent: 150, opacity: 0.4, rotate: 8 },
      { xPercent: 0, opacity: 1, rotate: 0, ease: "power1.out" },
      0
    );

    // Force ScrollTrigger to refresh *after* this trigger is created,
    // ensuring the heights and offsets of preceding pinned containers are accounted for.
    ScrollTrigger.refresh();
  }, { scope: containerRef, dependencies: [isReady] });

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-transparent py-20 px-6 select-none"
    >
      {/* Background Soft Ambient Glows */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full pointer-events-none filter blur-[120px] opacity-25"
        style={{
          background: "radial-gradient(circle, var(--color-violet) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full pointer-events-none filter blur-[120px] opacity-25"
        style={{
          background: "radial-gradient(circle, var(--color-magenta) 0%, transparent 70%)",
        }}
      />

      {/* Title & Heading */}
      <div className="relative z-10 text-center mb-12 max-w-2xl px-4 flex flex-col items-center">
        <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tight text-white leading-[1.15]">
          BECOME THE CAMPUS AMBASSADOR!
        </h2>
      </div>

      {/* Main Puzzle Area */}
      <div className="relative w-full max-w-[360px] sm:max-w-[480px] md:max-w-[580px] aspect-[1.75/1] flex items-center justify-center z-10">
        {/* Left Puzzle Piece Container */}
        <div
          ref={leftPieceRef}
          className="absolute left-0 top-0 w-[57.14%] h-full will-change-transform cursor-pointer group"
          style={{
            transformStyle: "preserve-3d",
            transform: !isReady ? "translateX(-150%)" : undefined,
          }}
        >
          {/* SVG Shape */}
          <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.08)]">
            <path
              d="M 30,30 L 100,30 C 100,45 110,55 120,55 C 130,55 140,45 140,30 L 210,30 L 210,100 C 195,100 185,110 185,120 C 185,130 195,140 210,140 L 210,210 L 140,210 C 140,225 130,235 120,235 C 110,235 100,225 100,210 L 30,210 L 30,140 C 15,140 5,130 5,120 C 5,110 15,100 30,100 Z"
              fill="#FFFFFF"
              stroke="#7801FF"
              strokeWidth="3.5"
              className="transition-all duration-500"
            />
          </svg>

          {/* Centered HTML Text overlay */}
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-center pointer-events-none select-none">
            <h3
              className={`font-sans font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest transition-all duration-500 text-[#7801FF] ${
                isJoined ? "scale-110" : ""
              }`}
            >
              JOIN
            </h3>
          </div>
        </div>

        {/* Right Puzzle Piece Container */}
        <div
          ref={rightPieceRef}
          className="absolute right-0 top-0 w-[57.14%] h-full will-change-transform cursor-pointer group"
          style={{
            transformStyle: "preserve-3d",
            transform: !isReady ? "translateX(150%)" : undefined,
          }}
        >
          {/* SVG Shape */}
          <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.08)]">
            <path
              d="M 30,30 L 100,30 C 100,15 110,5 120,5 C 130,5 140,15 140,30 L 210,30 L 210,100 C 195,100 185,110 185,120 C 185,130 195,140 210,140 L 210,210 L 140,210 C 140,195 130,185 120,185 C 110,185 100,195 100,210 L 30,210 L 30,140 C 15,140 5,130 5,120 C 5,110 15,100 30,100 Z"
              fill="#FFFFFF"
              stroke="#D242D7"
              strokeWidth="3.5"
              className="transition-all duration-500"
            />
          </svg>

          {/* Centered HTML Text overlay */}
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] text-center pointer-events-none select-none">
            <h3
              className={`font-sans font-black text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest transition-all duration-500 text-[#D242D7] ${
                isJoined ? "scale-110" : ""
              }`}
            >
              NOW
            </h3>
          </div>
        </div>

      </div>

      {/* CTA Button that appears when joined */}
      <div
        className={`relative z-20 mt-12 transition-all duration-700 transform ${
          isJoined ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <Link
          href="#apply"
          className="relative inline-flex items-center justify-center px-8 py-3.5 rounded-full font-sans text-xs md:text-sm font-semibold tracking-wider text-white uppercase border border-white/10 overflow-hidden group transition-all duration-300 hover:border-white/30 shadow-[0_0_20px_rgba(120,1,255,0.15)] hover:shadow-[0_0_35px_rgba(210,66,215,0.35)] bg-white/[0.03] backdrop-blur-md"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#7801FF]/20 to-[#D242D7]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center gap-1.5">
            apply now
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
