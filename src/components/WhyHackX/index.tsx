"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Timeline configuration units
const SEGMENT_DURATION = 10;
const TRANSITION_DURATION = 4.5;
const SLIDE_START_OFFSET = 8;
const BUFFER_DURATION = 7.4;

const ITEMS = [
  {
    id: "01",
    title: "COLLABORATE & SKILL UP",
    description:
      "Connect with brilliant developers, designers, and innovators. Form high-performance teams, master cutting-edge technologies under intense hackathon pressure, and build impactful real-world projects that stand out in your portfolio.",
  },
  {
    id: "02",
    title: "WIN EXCITING PRIZES",
    description:
      "Compete for a massive prize pool. The top three overall teams and the best projects in each specialized domain will walk away with premium tech gadgets, developer grants, and exclusive sponsor rewards.",
  },
  {
    id: "03",
    title: "ENGAGING WORKSHOPS",
    description:
      "Participate in live hands-on coding bootcamps, tech talks, and interactive mini-challenges. Learn directly from platform architects and developer experts who build the tools you use every day.",
  },
  {
    id: "04",
    title: "MENTORSHIP SESSIONS",
    description:
      "Receive direct 1-on-1 feedback and technical reviews from industry leaders, engineering directors, and seasoned developers. Refine your system architecture and perfect your pitch before the final judging rounds.",
  },
  {
    id: "05",
    title: "RECRUITMENT OFFERS",
    description:
      "Showcase your coding skills, problem-solving speed, and teamwork to sponsor companies. Top-performing hackers will receive exclusive interview invites, fast-tracked internship opportunities, and full-time role offers.",
  },
  {
    id: "06",
    title: "EXPAND NETWORK",
    description:
      "Engage with startup founders, venture capitalists, community leaders, and peers from across the country. Build lasting professional relationships and discover collaborators for your next big venture.",
  },
];

// Constants for layout heights
const ITEM_VH = 95;
const BUFFER_VH = 70;
const TOTAL_VH = ITEMS.length * ITEM_VH + BUFFER_VH;

const ENTRANCE_OFFSET_VH_FRACTION = 0.8;
const ENTRANCE_OFFSET_MIN_PX = 480;

export default function WhyHackX() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  
  // Refs to each item's wrapper for scroll entrance translations
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Refs for the title, description wrappers and description texts to animate via GSAP
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descTextRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // Entirely scroll-bound animations built into a single scrubbed GSAP timeline.
  // This removes React activeIndex state triggers, preventing snappy snaps or re-render flashes.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 769px)", () => {
        let offsetPx = Math.max(
          window.innerHeight * ENTRANCE_OFFSET_VH_FRACTION,
          ENTRANCE_OFFSET_MIN_PX
        );

        // Create main timeline linked to ScrollTrigger
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: spacerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.6, // Silky catching-up interpolation
          },
        });

        const totalDuration = ITEMS.length * SEGMENT_DURATION + BUFFER_DURATION;

        // 1. Progress line scale animation
        tl.fromTo(
          progressLineRef.current,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", duration: totalDuration },
          0
        );

        // Initialize element styles immediately to handle custom scroll positions on load
        ITEMS.forEach((_, i) => {
          const itemEl = itemRefs.current[i];
          const titleEl = titleRefs.current[i];
          const descWrapEl = descWrapRefs.current[i];
          const descTextEl = descTextRefs.current[i];

          if (!itemEl || !titleEl || !descWrapEl || !descTextEl) return;

          gsap.set(itemEl, { y: i === 0 ? 0 : offsetPx });
          gsap.set(titleEl, { opacity: i === 0 ? 1 : 0.5, color: "#ff7695" });
          gsap.set(descWrapEl, { height: i === 0 ? "auto" : 0 });
          gsap.set(descTextEl, {
            opacity: i === 0 ? 1 : 0,
            filter: i === 0 ? "blur(0px)" : "blur(10px)",
            y: i === 0 ? 0 : 10,
          });
        });

        // 2. Programmatically build scroll transitions for each item
        ITEMS.forEach((_, i) => {
          const itemEl = itemRefs.current[i];
          const titleEl = titleRefs.current[i];
          const descWrapEl = descWrapRefs.current[i];
          const descTextEl = descTextRefs.current[i];

          if (!itemEl || !titleEl || !descWrapEl || !descTextEl) return;

          // A. Item entrance slide-up (except item 0 which starts in place)
          if (i > 0) {
            const entranceStart = (i - 1) * SEGMENT_DURATION + (SEGMENT_DURATION - SLIDE_START_OFFSET);
            tl.fromTo(
              itemEl,
              { y: offsetPx },
              { y: 0, ease: "power3.out", duration: SLIDE_START_OFFSET },
              entranceStart
            );
          }

          // B. Active item transition (open description, highlight title)
          if (i > 0) {
            const actStart = i * SEGMENT_DURATION;
            tl.to(titleEl, { opacity: 1, color: "#ff7695", ease: "power3.out", duration: TRANSITION_DURATION }, actStart);
            tl.to(descWrapEl, { height: "auto", ease: "power3.out", duration: TRANSITION_DURATION }, actStart);
            tl.to(descTextEl, {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              ease: "power3.out",
              duration: TRANSITION_DURATION,
            }, actStart);
          }

          // C. Collapsed/Deactivated item transition (close description, dim title)
          const deactStart = (i + 1) * SEGMENT_DURATION;
          if (i < ITEMS.length - 1) {
            tl.to(titleEl, { opacity: 0.5, color: "#ff7695", ease: "power3.inOut", duration: TRANSITION_DURATION }, deactStart);
            tl.to(descWrapEl, { height: 0, ease: "power3.inOut", duration: TRANSITION_DURATION }, deactStart);
            tl.to(descTextEl, {
              opacity: 0,
              filter: "blur(10px)",
              y: 10,
              ease: "power3.inOut",
              duration: TRANSITION_DURATION,
            }, deactStart);
          } else {
            // Last item collapses at the very end of active scroll range
            tl.to(titleEl, { opacity: 0.5, color: "#ff7695", ease: "power3.inOut", duration: TRANSITION_DURATION }, deactStart);
            tl.to(descWrapEl, { height: 0, ease: "power3.inOut", duration: TRANSITION_DURATION }, deactStart);
            tl.to(descTextEl, {
              opacity: 0,
              filter: "blur(10px)",
              y: 10,
              ease: "power3.inOut",
              duration: TRANSITION_DURATION,
            }, deactStart);
          }
        });

        // Handle resize offset recalculation
        ScrollTrigger.addEventListener("refresh", () => {
          offsetPx = Math.max(
            window.innerHeight * ENTRANCE_OFFSET_VH_FRACTION,
            ENTRANCE_OFFSET_MIN_PX
          );
        });
      });

      mm.add("(max-width: 768px)", () => {
        if (progressLineRef.current) {
          gsap.set(progressLineRef.current, { scaleY: 1 });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-transparent text-[#FAF8F5] py-20 md:py-0"
    >
      <div className="max-w-[1300px] mx-auto w-full flex flex-col md:flex-row items-start justify-center px-6 md:px-12 md:pl-24 lg:pl-36 gap-16 md:gap-24 lg:gap-32">
        {/* Left Column: Sticky Title */}
        <div className="w-full md:w-auto md:sticky md:top-0 md:h-screen flex items-center justify-start select-none flex-shrink-0">
          <div className="flex items-stretch gap-6 md:gap-8">
            <div className="w-[3px] bg-white/10 rounded-full relative overflow-hidden flex-shrink-0 my-[-24px]">
              <div
                ref={progressLineRef}
                className="absolute top-0 left-0 w-full h-full bg-[#8c19be] shadow-[0_0_15px_#ff7695] origin-top"
              />
            </div>
            <div className="flex flex-col font-anton tracking-normal uppercase leading-[0.9] text-[7vw] md:text-[4vw] text-white scale-x-[0.9] origin-left">
              <span>WHY</span>
              <span>SHOULD</span>
              <span>YOU</span>
              <span>PARTICIPATE</span>
              <span>IN MUJ</span>
              <span>HACKX 4.0?</span>
            </div>
          </div>
        </div>

        {/* Right Column: tall scroll spacer that pins the stage below it */}
        <div
          ref={spacerRef}
          className="relative w-full md:flex-grow md:max-w-[600px] flex-shrink-0 max-md:!h-auto"
          style={{ height: `${TOTAL_VH}vh` }}
        >
          <div
            className="relative md:sticky md:top-0 md:h-screen w-full flex flex-col justify-start pt-[12vh] md:pt-[25vh] items-start gap-5 md:gap-6 py-16 md:py-0"
          >
            {ITEMS.map((item, i) => {
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="w-full translate-y-0 md:translate-y-[60vh] will-change-transform"
                >
                  <h3
                    ref={(el) => {
                      titleRefs.current[i] = el;
                    }}
                    className="font-sans font-semibold uppercase tracking-[-0.02em] text-xl md:text-2xl lg:text-[2rem] leading-snug cursor-default text-[#ff7695] max-md:!opacity-100"
                    style={{
                      opacity: i === 0 ? 1 : 0.5,
                      wordSpacing: "0.06em",
                    }}
                  >
                    {item.title}
                  </h3>

                  <div
                    ref={(el) => {
                      descWrapRefs.current[i] = el;
                    }}
                    className="overflow-hidden max-md:!h-auto"
                    style={{
                      height: i === 0 ? "auto" : 0,
                    }}
                  >
                    <div className="overflow-hidden min-h-0">
                      <p
                        ref={(el) => {
                          descTextRefs.current[i] = el;
                        }}
                        className="pt-3 md:pt-4 font-sans font-normal text-white/90 text-base md:text-lg lg:text-xl leading-relaxed max-w-[600px] opacity-0 blur-md translate-y-2 md:opacity-0 md:blur-md md:translate-y-2 max-md:!opacity-100 max-md:!blur-none max-md:!transform-none"
                        style={{
                          opacity: i === 0 ? 1 : 0,
                          filter: i === 0 ? "none" : "blur(10px)",
                          transform: i === 0 ? "none" : "translateY(10px)",
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}