"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ITEMS = [
  {
    id: "01",
    title: "COLLABORATE & SKILL UP",
    description: "Connect with brilliant developers, designers, and innovators. Form high-performance teams, master cutting-edge technologies under intense hackathon pressure, and build impactful real-world projects that stand out in your portfolio."
  },
  {
    id: "02",
    title: "WIN EXCITING PRIZES",
    description: "Compete for a massive prize pool. The top three overall teams and the best projects in each specialized domain will walk away with premium tech gadgets, developer grants, and exclusive sponsor rewards."
  },
  {
    id: "03",
    title: "ENGAGING WORKSHOPS",
    description: "Participate in live hands-on coding bootcamps, tech talks, and interactive mini-challenges. Learn directly from platform architects and developer experts who build the tools you use every day."
  },
  {
    id: "04",
    title: "MENTORSHIP SESSIONS",
    description: "Receive direct 1-on-1 feedback and technical reviews from industry leaders, engineering directors, and seasoned developers. Refine your system architecture and perfect your pitch before the final judging rounds."
  },
  {
    id: "05",
    title: "RECRUITMENT OFFERS",
    description: "Showcase your coding skills, problem-solving speed, and teamwork to sponsor companies. Top-performing hackers will receive exclusive interview invites, fast-tracked internship opportunities, and full-time role offers."
  },
  {
    id: "06",
    title: "EXPAND NETWORK",
    description: "Engage with startup founders, venture capitalists, community leaders, and peers from across the country. Build lasting professional relationships and discover collaborators for your next big venture."
  }
];

export default function WhyHackX() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop layout: sticky left column, scrolling right column
      mm.add("(min-width: 769px)", () => {
        // Progress line height animation synced exactly with the entire scroll/sticky pinning duration
        gsap.fromTo(
          progressLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            }
          }
        );
      });

      // Mobile/Tablet layout: standard flow
      mm.add("(max-width: 768px)", () => {
        // Reset scaleY for mobile
        if (progressLineRef.current) {
          gsap.set(progressLineRef.current, { scaleY: 1 });
        }
      });
    }, containerRef.current || undefined);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-transparent text-[#FAF8F5] py-20 md:py-32"
    >
      <div className="max-w-[1300px] mx-auto w-full flex flex-col md:flex-row items-start justify-center px-6 md:px-12 md:pl-24 lg:pl-36 gap-16 md:gap-24 lg:gap-32">
        
        {/* Left Column: Sticky Title (Desktop only) */}
        <div className="w-full md:w-auto md:sticky md:top-0 md:h-screen flex items-center justify-start select-none flex-shrink-0">
          <div className="flex items-stretch gap-6 md:gap-8">
            {/* Vertical Glowing Indicator Line (Extended noticeably beyond text height using negative margin) */}
            <div className="w-[3px] bg-white/10 rounded-full relative overflow-hidden flex-shrink-0 my-[-24px]">
              <div
                ref={progressLineRef}
                className="absolute top-0 left-0 w-full h-full bg-[#8c19be] shadow-[0_0_15px_#ff7695] origin-top"
              />
            </div>

            {/* Huge Title Text */}
            <div className="flex flex-col font-anton tracking-normal uppercase leading-[0.9] text-[10vw] md:text-[6.66vw] text-white scale-x-[0.9] origin-left">
              <span>WHY</span>
              <span>CHOOSE</span>
              <span>HACKX?</span>
            </div>
          </div>
        </div>

        {/* Right Column: Scrolling Cards */}
        <div className="w-full md:w-[600px] flex flex-col gap-[90vh] pt-[60vh] pb-[60vh] px-2 flex-shrink-0 overflow-visible">
          {ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-start w-full origin-left overflow-visible"
            >
              {/* Card Header (Stretched horizontally by 2x, font-sans semibold, tighter tracking, wrapping enabled) */}
              <div className="mb-8 w-full overflow-visible">
                <h3 
                  className="font-sans font-semibold uppercase tracking-[-0.03em] text-lg md:text-xl lg:text-[1.8rem] leading-[2.45] text-[#ff7695] scale-x-[2] scale-y-[1] origin-left w-[48%] overflow-visible block"
                  style={{ wordSpacing: "0.08em" }}
                >
                  {item.title}
                </h3>
              </div>

              {/* Card Description */}
              <p className="font-sans font-normal text-white text-sm md:text-base lg:text-2xl leading-relaxed select-text">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
