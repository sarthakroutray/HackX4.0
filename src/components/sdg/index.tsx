"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Brand {
  name: string;
  logo: React.ReactNode;
  description: string;
}

const brands: Brand[] = [
  {
    name: "Health",
    logo: (
      <svg className="w-full max-h-[75px] fill-current text-[#f9f6f0]" viewBox="0 0 200 50">
        <text x="50%" y="14" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">GOOD HEALTH</text>
        <text x="50%" y="26" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">AND WELL-BEING</text>
        <path d="M100 32 Q100 28 104 28 Q108 28 108 32 Q108 36 100 42 Q92 36 92 32 Q92 28 96 28 Q100 28 100 32Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M88 38 L90 35 M88 38 L92 40" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>
    ),
    description: "Ensuring healthy lives and promoting well-being for all at every age.",
  },
  {
    name: "Education",
    logo: (
      <svg className="w-full max-h-[75px] fill-current text-[#f9f6f0]" viewBox="0 0 200 50">
        <text x="50%" y="14" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">QUALITY</text>
        <text x="50%" y="26" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">EDUCATION</text>
        <rect x="90" y="30" width="12" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <line x1="96" y1="30" x2="96" y2="44" stroke="currentColor" strokeWidth="1" />
        <rect x="100" y="32" width="10" height="12" rx="1" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
    description: "Inclusive and equitable quality education for lifelong learning.",
  },
  {
    name: "Equality",
    logo: (
      <svg className="w-full max-h-[75px] fill-current text-[#f9f6f0]" viewBox="0 0 200 50">
        <text x="50%" y="14" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">GENDER</text>
        <text x="50%" y="26" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">EQUALITY</text>
        <circle cx="100" cy="36" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="100" y1="41" x2="100" y2="48" stroke="currentColor" strokeWidth="1.5" />
        <line x1="97" y1="44" x2="103" y2="44" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    description: "Empowering all women and girls through equal opportunities.",
  },
  {
    name: "Clean Energy",
    logo: (
      <svg className="w-full max-h-[75px] fill-current text-[#f9f6f0]" viewBox="0 0 200 50">
        <text x="50%" y="14" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">AFFORDABLE AND</text>
        <text x="50%" y="26" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">CLEAN ENERGY</text>
        <circle cx="100" cy="38" r="6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="100" cy="38" r="2" fill="currentColor" />
        <line x1="100" y1="30" x2="100" y2="32" stroke="currentColor" strokeWidth="1.2" />
        <line x1="100" y1="44" x2="100" y2="46" stroke="currentColor" strokeWidth="1.2" />
        <line x1="94" y1="38" x2="92" y2="38" stroke="currentColor" strokeWidth="1.2" />
        <line x1="106" y1="38" x2="108" y2="38" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    description: "Affordable, reliable, sustainable and modern energy for all.",
  },
  {
    name: "Decent Work",
    logo: (
      <svg className="w-full max-h-[75px] fill-current text-[#f9f6f0]" viewBox="0 0 200 50">
        <text x="50%" y="14" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">DECENT WORK AND</text>
        <text x="50%" y="26" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">ECONOMIC GROWTH</text>
        <rect x="88" y="44" width="4" height="3" fill="currentColor" />
        <rect x="93" y="41" width="4" height="6" fill="currentColor" />
        <rect x="98" y="37" width="4" height="10" fill="currentColor" />
        <rect x="103" y="33" width="4" height="14" fill="currentColor" />
        <polyline points="88,36 95,33 101,30 108,28" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
    description: "Sustained, inclusive economic growth and decent work for all.",
  },
  {
    name: "Innovation",
    logo: (
      <svg className="w-full max-h-[75px] fill-current text-[#f9f6f0]" viewBox="0 0 200 50">
        <text x="50%" y="14" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">INDUSTRY, INNOVATION</text>
        <text x="50%" y="26" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">AND INFRASTRUCTURE</text>
        <path d="M90 45 L95 30 L100 45 Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M98 45 L103 30 L108 45 Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
    description: "Resilient infrastructure and inclusive industrialization.",
  },
  {
    name: "Equality",
    logo: (
      <svg className="w-full max-h-[75px] fill-current text-[#f9f6f0]" viewBox="0 0 200 50">
        <text x="50%" y="14" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">REDUCED</text>
        <text x="50%" y="26" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">INEQUALITIES</text>
        <polygon points="100,32 95,40 105,40" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <text x="100" y="47" fontFamily="sans-serif" fontWeight="700" fontSize="10" textAnchor="middle" fill="currentColor">=</text>
      </svg>
    ),
    description: "Reducing inequality within and among countries.",
  },
  {
    name: "Climate",
    logo: (
      <svg className="w-full max-h-[75px] fill-current text-[#f9f6f0]" viewBox="0 0 200 50">
        <text x="50%" y="14" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">CLIMATE</text>
        <text x="50%" y="26" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">ACTION</text>
        <circle cx="100" cy="38" r="7" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <ellipse cx="100" cy="38" rx="3" ry="7" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <line x1="93" y1="38" x2="107" y2="38" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    ),
    description: "Urgent action to combat climate change and its impacts.",
  },
  {
    name: "Partnerships",
    logo: (
      <svg className="w-full max-h-[75px] fill-current text-[#f9f6f0]" viewBox="0 0 200 50">
        <text x="50%" y="14" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">PARTNERSHIPS</text>
        <text x="50%" y="26" dominantBaseline="middle" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="9" letterSpacing="0.05em" fill="currentColor">FOR THE GOALS</text>
        <circle cx="100" cy="38" r="7" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="100" cy="38" r="4" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="38" r="1.5" fill="currentColor" />
      </svg>
    ),
    description: "Global partnerships for sustainable development.",
  },
];

export default function SdgComponent() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stackGroupRef = useRef<HTMLDivElement>(null);

  const brandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [settledIndex, setSettledIndex] = useState(0);
  const prevSettledIndexRef = useRef(0);
  const activeIndexRef = useRef(0);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Debounce activeIndex updates by 120ms to settle scroll targets before transitioning
  useEffect(() => {
    const timer = setTimeout(() => {
      setSettledIndex(activeIndex);
    }, 120);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Smooth, constant-speed time-based transition played when selection changes
  useEffect(() => {
    const prevIdx = prevSettledIndexRef.current;
    if (prevIdx === settledIndex) return;

    // Fade/blur out previous card
    if (cardRefs.current[prevIdx]) {
      gsap.to(cardRefs.current[prevIdx], {
        opacity: 0,
        filter: "blur(20px)",
        pointerEvents: "none",
        duration: 0.55,
        ease: "power2.inOut",
      });
    }

    // Fade/blur in next active card
    if (cardRefs.current[settledIndex]) {
      gsap.to(cardRefs.current[settledIndex], {
        opacity: 1,
        filter: "blur(0px)",
        pointerEvents: "auto",
        duration: 0.55,
        ease: "power2.out",
      });
    }

    prevSettledIndexRef.current = settledIndex;
  }, [settledIndex]);

  const getArcPosition = (diff: number) => {
    const absDiff = Math.abs(diff);
    const R = 850; // Radius of the arc (increased for more vertical spacing and less left-shift)
    const angleDeg = 7.5; // Spacing angle in degrees (increased to spread out brand items)
    const angleRad = (absDiff * angleDeg * Math.PI) / 180;

    // x always shifts LEFT as distance from center increases (same for above & below)
    const x = -(R - R * Math.cos(angleRad));
    // y shifts UP for items above (diff < 0) and DOWN for items below (diff > 0)
    const yMagnitude = R * Math.sin(angleRad);
    const y = diff < 0 ? -yMagnitude : diff > 0 ? yMagnitude : 0;
    const rotation = diff * angleDeg;

    return { x, y, rotation };
  };

  // Helper: get visual properties (scale, opacity, blur, fill, stroke) based on distance from active
  const getVisualProps = (diff: number) => {
    const absDiff = Math.abs(diff);
    return {
      scale: 1.0 - Math.min(absDiff * 0.03, 0.2), // Gentler scale reduction for better readability
      opacity: absDiff === 0 ? 1 : Math.max(0.4 - absDiff * 0.07, 0.12), // Faded opacity for non-selected items
      blur: Math.min(absDiff * 0.4, 2.5), // Faded items are blurred for an editorial depth effect
      fill: "#f9f6f0", // Keep all texts white (no stroking/transparency)
      stroke: "0px transparent", // Disable stroke outline entirely
    };
  };

  useGSAP(() => {
    if (!isReady) return;
    if (!sectionRef.current) return;

    // Setup initial states — active is index 0
    brands.forEach((_, k) => {
      if (brandRefs.current[k]) {
        const diff = k - 0;
        const pos = getArcPosition(diff);
        const vis = getVisualProps(diff);

        gsap.set(brandRefs.current[k], {
          x: pos.x,
          y: pos.y,
          yPercent: -50, // Center item vertically on its position
          rotation: pos.rotation,
          scale: vis.scale,
          opacity: vis.opacity,
          filter: `blur(${vis.blur}px)`,
          transformOrigin: "left center",
        });
      }

      if (cardRefs.current[k]) {
        gsap.set(cardRefs.current[k], {
          opacity: k === 0 ? 1 : 0,
          y: 0, // Stay in place (no initial offset)
          filter: k === 0 ? "blur(0px)" : "blur(20px)", // Start blurred if not active
          pointerEvents: k === 0 ? "auto" : "none",
        });
      }
    });

    const mm = gsap.matchMedia();

    // Desktop layout
    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (brands.length - 1) * 0.45}`,
          scrub: 0.5, // Faster and more responsive wheel tracking
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progressIdx = Math.round(self.progress * (brands.length - 1));
            if (progressIdx !== activeIndexRef.current) {
              activeIndexRef.current = progressIdx;
              setActiveIndex(progressIdx);
            }
          },
        },
      });

      // Core transitions for each brand item
      for (let s = 1; s < brands.length; s++) {
        // Transition each brand along the mirrored arc trajectory
        for (let k = 0; k < brands.length; k++) {
          const diff = k - s; // negative = above active, positive = below
          const pos = getArcPosition(diff);
          const vis = getVisualProps(diff);

          tl.to(brandRefs.current[k], {
            x: pos.x,
            y: pos.y,
            rotation: pos.rotation,
            scale: vis.scale,
            opacity: vis.opacity,
            filter: `blur(${vis.blur}px)`,
            duration: 1,
            ease: "none",
          }, s - 1);
        }
      }
    });

    // Mobile/Tablet layout
    mm.add("(max-width: 768px)", () => {
      brands.forEach((_, k) => {
        if (brandRefs.current[k]) {
          gsap.set(brandRefs.current[k], {
            transformOrigin: "center center",
            rotation: 0,
            scale: k === 0 ? 1.1 : 0.7,
            opacity: k === 0 ? 1 : 0,
            filter: k === 0 ? "blur(0px)" : "blur(2px)",
            x: 0,
            y: k === 0 ? 0 : 50,
          });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (brands.length - 1) * 0.45}`,
          scrub: 0.5, // Faster and more responsive scroll experience on mobile
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progressIdx = Math.round(self.progress * (brands.length - 1));
            if (progressIdx !== activeIndexRef.current) {
              activeIndexRef.current = progressIdx;
              setActiveIndex(progressIdx);
            }
          },
        },
      });

      for (let s = 1; s < brands.length; s++) {
        for (let k = 0; k < brands.length; k++) {
          const targetDiff = k - s;
          let scaleVal = 0.6;
          let opacityVal = 0;
          let blurVal = 3;
          let yVal = 100;

          if (targetDiff === 0) {
            scaleVal = 1.1;
            opacityVal = 1;
            blurVal = 0;
            yVal = 0;
          } else if (targetDiff === -1) {
            scaleVal = 0.85;
            opacityVal = 0.45;
            blurVal = 1;
            yVal = -45;
          } else if (targetDiff === 1) {
            scaleVal = 0.85;
            opacityVal = 0.45;
            blurVal = 1;
            yVal = 45;
          } else if (targetDiff < -1) {
            yVal = -100;
          }

          tl.to(brandRefs.current[k], {
            scale: scaleVal,
            opacity: opacityVal,
            filter: `blur(${blurVal}px)`,
            y: yVal,
            duration: 1,
            ease: "none",
          }, s - 1);
        }
      }
    });

    // Fade in section after paint/measure delay
    gsap.to(sectionRef.current, { opacity: 1, duration: 0.4 });

    // Refresh ScrollTrigger to recalculate heights and sizes
    ScrollTrigger.refresh();
  }, { scope: sectionRef, dependencies: [isReady], revertOnUpdate: true });

  return (
    <section id="sdg-section" ref={sectionRef} className="w-full h-screen relative flex items-center bg-transparent select-none opacity-0">


      {/* Brand Stack (Arc Motion Area) */}
      {/* Shifted left position to left-[12vw] and md:left-[24vw] for more breathing room from edge */}
      <div className="absolute left-[12vw] md:left-[24vw] top-0 h-full w-[80vw] md:w-[50vw] flex items-start pt-[48vh] justify-start z-20 pointer-events-none">
        <div ref={stackGroupRef} className="relative w-full">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              ref={(el) => {
                brandRefs.current[idx] = el;
              }}
              /* Changed font from font-black tracking-tighter to font-semibold tracking-normal to match the reference site */
              className="absolute left-0 font-sans font-semibold text-[6.5vw] md:text-[5vw] lg:text-[4.5vw] tracking-normal leading-none text-[#f9f6f0] select-none cursor-pointer whitespace-nowrap origin-left pointer-events-auto"
              onClick={() => {
                const scrollTriggerInstance = ScrollTrigger.getAll().find(
                  (st) => st.trigger === sectionRef.current
                );
                if (scrollTriggerInstance) {
                  const startPos = scrollTriggerInstance.start;
                  const endPos = scrollTriggerInstance.end;
                  const scrollRange = endPos - startPos;
                  const targetScroll = startPos + (idx / (brands.length - 1)) * scrollRange;
                  window.scrollTo({
                    top: targetScroll,
                    behavior: "smooth",
                  });
                }
              }}
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity, filter",
                color: "#f9f6f0",
              }}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>

      {/* Right Active Brand Info Panel */}
      {/* Centered vertically around the pt-[48vh] scroll center line using items-start and translate-y-1/2 on inner container */}
      <div className="absolute right-[4vw] md:right-[6.5vw] top-0 h-full w-[90vw] md:w-[32vw] flex items-start pt-[48vh] z-30 pointer-events-none md:pointer-events-auto">
        <div className="relative w-full h-[120px] flex items-center -translate-y-1/2">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="absolute left-0 w-full grid grid-cols-1 md:grid-cols-[1.2fr_1.6fr] items-center gap-4 md:gap-10 pointer-events-none"
            >
              <div className="flex items-center justify-start h-full">
                {brand.logo}
              </div>
              <p className="font-sans text-xs md:text-sm leading-relaxed font-normal text-[#f9f6f0]/70 select-text">
                {brand.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
