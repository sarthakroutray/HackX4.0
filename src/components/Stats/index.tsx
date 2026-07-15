"use client";

import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATS_DATA = [
  {
    id: "01",
    title: "genesis",
    caption: "What started in China as a creative partnership which became the foundation of everything we've built. The curiosity never stops there.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "02",
    title: "footing",
    caption: "Saigon is where we found our footing. Fast, ambitious, never satisfied — shaped how we work and what we expect from ourselves.",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "03",
    title: "expansion",
    caption: "But good work doesn't stay in one place — and neither did we. We go wherever the next brief takes us.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "04",
    title: "synergy",
    caption: "The offices gave us roots in new places. The people gave us reasons to keep going.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: "05",
    title: "future",
    caption: "We build digital products that move people, redefine categories, and stand the test of time.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=85",
  }
];

export default function Stats() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railDotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const scrollToSection = (index: number) => {
    if (typeof window === "undefined") return;

    window.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          // Measure the image card's active container dimensions dynamically
          const cardEl = imageRefs.current[0];
          let cardWidth = window.innerWidth * 0.3; // safe defaults
          let cardHeight = window.innerHeight * 0.48;
          if (cardEl) {
            const rect = cardEl.getBoundingClientRect();
            cardWidth = rect.width;
            cardHeight = rect.height;
          }

          // Spacing offsets: slightly larger than card dimensions to add a small, elegant gap between adjacent edges
          const xOffsetVal = isDesktop ? cardWidth * 1.06 : cardWidth * 0.45;
          const yOffsetVal = isDesktop ? cardHeight * 1.06 : cardHeight * 0.65;

          // Set initial element positions
          STATS_DATA.forEach((_, idx) => {
            // Text caption position and opacity
            gsap.set(textRefs.current[idx], {
              opacity: idx === 0 ? 1 : 0,
              y: idx === 0 ? 0 : 25,
              pointerEvents: idx === 0 ? "auto" : "none",
            });

            // Images along slanted conveyor positions (flat, no rotation, constant scale 1.0)
            if (idx === 0) {
              gsap.set(imageRefs.current[0], {
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                filter: "grayscale(0%)",
                zIndex: 10,
                rotation: 0,
              });
            } else if (idx === 1) {
              // Image 1 enters from Bottom-Right
              gsap.set(imageRefs.current[1], {
                x: xOffsetVal,
                y: yOffsetVal,
                scale: 1,
                opacity: 0.15,
                filter: "grayscale(100%)",
                zIndex: 5,
                rotation: 0,
              });
            } else {
              // Image 2 and up start offscreen below Bottom-Right along the slanted line
              const offX = xOffsetVal * 2;
              const offY = yOffsetVal * 2;
              gsap.set(imageRefs.current[idx], {
                x: offX,
                y: offY,
                scale: 1,
                opacity: 0,
                filter: "grayscale(100%)",
                zIndex: 1,
                rotation: 0,
              });
            }
          });

          // Create standard timeline linked to ScrollTrigger pinning (smooth scroll-scrub without snapping)
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: () => `+=${(STATS_DATA.length - 1) * window.innerHeight}`,
              scrub: 1,
              pin: true,
              onUpdate: (self) => {
                const progress = self.progress;
                const index = Math.round(progress * (STATS_DATA.length - 1));
                if (index !== activeIndexRef.current) {
                  activeIndexRef.current = index;
                  setActiveIndex(index);
                }
              },
            },
          });

          // Register section timeline labels
          STATS_DATA.forEach((_, index) => {
            tl.addLabel(`section_${index}`, index);
          });

          // Build scroll scrub animation transitions
          for (let i = 0; i < STATS_DATA.length - 1; i++) {
            const labelFrom = `section_${i}`;

            // Text caption out/in
            tl.to(textRefs.current[i], {
              opacity: 0,
              y: -25,
              pointerEvents: "none",
              duration: 0.35,
              ease: "none",
            }, labelFrom);

            tl.to(textRefs.current[i + 1], {
              opacity: 1,
              y: 0,
              pointerEvents: "auto",
              duration: 0.4,
              ease: "none",
            }, `${labelFrom}+=0.55`); // Delay caption fade-in for near-center timing

            // Conveyor transitions: current active image (i) exits to Top-Left (constant scale 1.0)
            tl.to(imageRefs.current[i], {
              x: -xOffsetVal,
              y: -yOffsetVal,
              scale: 1,
              opacity: 0.15,
              filter: "grayscale(100%)",
              zIndex: 1,
              rotation: 0,
              duration: 1,
              ease: "none",
            }, labelFrom);

            // Previous exited image (i - 1) fades completely to 0 as it moves further Top-Left
            if (i - 1 >= 0) {
              tl.to(imageRefs.current[i - 1], {
                x: -xOffsetVal * 2,
                y: -yOffsetVal * 2,
                scale: 1,
                opacity: 0,
                filter: "grayscale(100%)",
                zIndex: 1,
                rotation: 0,
                duration: 1,
                ease: "none",
              }, labelFrom);
            }

            // Next preview image (i + 1) scales up and moves to Center-Stage (grayscale 0%, opacity 1.0, zIndex 10)
            tl.to(imageRefs.current[i + 1], {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              filter: "grayscale(0%)",
              zIndex: 10,
              rotation: 0,
              duration: 1,
              ease: "none",
            }, labelFrom);

            // Next next image (i + 2) moves from Far Bottom-Right to Bottom-Right preview zone (constant scale 1.0)
            if (i + 2 < STATS_DATA.length) {
              tl.to(imageRefs.current[i + 2], {
                x: xOffsetVal,
                y: yOffsetVal,
                scale: 1,
                opacity: 0.15,
                filter: "grayscale(100%)",
                zIndex: 5,
                rotation: 0,
                duration: 1,
                ease: "none",
              }, labelFrom);
            }
          }
        }
      );
    }, containerRef.current || undefined);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-transparent"
      id="stats-archive-page"
    >

      {/* Left-side vertical rail */}
      <nav
        className="fixed left-6 md:left-12 lg:left-16 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-4 font-sans text-[10px] uppercase tracking-[0.25em] select-none"
        aria-label="Stats Navigation Rail"
      >
        {STATS_DATA.map((sec, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={sec.id}
              ref={(el) => { railDotRefs.current[idx] = el; }}
              onClick={() => scrollToSection(idx)}
              className="flex items-center gap-3 py-1.5 text-left group transition-all duration-300 pointer-events-auto"
              id={`rail-link-${sec.id}`}
              aria-label={`Go to section ${sec.id} - ${sec.title}`}
            >
              {/* Number */}
              <span
                className={`font-semibold transition-all duration-300 ${isActive ? "text-cream scale-110" : "text-cream/30 group-hover:text-cream/70"
                  }`}
              >
                {idx + 1}
              </span>

              {/* Slide/Fade text label */}
              <span
                className={`font-serif italic lowercase text-xs tracking-wider transition-all duration-500 overflow-hidden whitespace-nowrap ${isActive
                    ? "w-32 opacity-100 text-[#faebac] translate-x-0"
                    : "w-0 opacity-0 -translate-x-2"
                  }`}
              >
                — {sec.title}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Central image archive conveyor belt */}
      <section className="relative w-full h-full flex items-center justify-center z-20 select-none">
        <div className="relative w-[65vw] h-[36vh] sm:w-[310px] sm:h-[370px] md:w-[360px] md:h-[430px] lg:w-[400px] lg:h-[480px]">
          {STATS_DATA.map((sec, idx) => (
            <article
              key={sec.id}
              ref={(el) => { imageRefs.current[idx] = el; }}
              className="absolute inset-0 w-full h-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.65)] rounded-sm will-change-[transform,opacity,filter]"
              style={{
                zIndex: idx === 0 ? 10 : 1,
                opacity: idx === 0 ? 1 : 0
              }}
              id={`stats-article-${sec.id}`}
            >
              {/* Soft overlay vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15 pointer-events-none z-10" />
              {/* Editorial Image */}
              <img
                src={sec.image}
                alt={`Editorial illustration for ${sec.title}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </article>
          ))}
        </div>
      </section>

      {/* Right-side text block / Mobile bottom text block */}
      <aside className="fixed max-md:bottom-[8vh] max-md:left-1/2 max-md:-translate-x-1/2 max-md:w-[85vw] max-md:text-center md:right-16 lg:right-24 md:top-1/2 md:-translate-y-1/2 md:w-[320px] lg:w-[380px] text-left z-40 pointer-events-none select-none">
        <div className="relative w-full h-12 md:h-24">
          {STATS_DATA.map((sec, idx) => (
            <div
              key={sec.id}
              ref={(el) => { textRefs.current[idx] = el; }}
              className="absolute top-0 right-0 left-0 max-md:-translate-y-1/2 md:-translate-y-1/2 font-serif text-[15px] sm:text-base md:text-lg lg:text-xl text-cream/90 leading-relaxed font-light pointer-events-auto"
              style={{ display: "block", opacity: idx === 0 ? 1 : 0 }}
              id={`stats-caption-${sec.id}`}
            >
              {sec.caption}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
