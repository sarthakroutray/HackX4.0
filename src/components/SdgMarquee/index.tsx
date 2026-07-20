"use client";

import React from "react";

const SDG_IMAGES = [
  { src: "/assets/sdg/sdg1.svg", alt: "Good Health and Well-being" },
  { src: "/assets/sdg/sdg2.svg", alt: "Quality Education" },
  { src: "/assets/sdg/sdg3.svg", alt: "Gender Equality" },
  { src: "/assets/sdg/sdg4.svg", alt: "Affordable and Clean Energy" },
  { src: "/assets/sdg/sdg5.svg", alt: "Decent Work and Economic Growth" },
  { src: "/assets/sdg/sdg6.svg", alt: "Industry, Innovation and Infrastructure" },
  { src: "/assets/sdg/sdg7.svg", alt: "Reduced Inequalities" },
  { src: "/assets/sdg/sdg8.svg", alt: "Climate Action" },
  { src: "/assets/sdg/sdg9.svg", alt: "Partnerships for the Goals" },
];

export default function SdgMarquee() {
  const marqueeItems = [...SDG_IMAGES, ...SDG_IMAGES];

  return (
    <div className="w-full py-6 select-none pointer-events-auto relative z-10 overflow-hidden mask-gradient">
      {/* Marquee Track container */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] cursor-pointer">
        <div className="flex items-center gap-16 md:gap-24 px-8 md:px-12">
          {marqueeItems.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:brightness-125 opacity-70 hover:opacity-100"
            >
              {/* Using native img for SVG assets */}
              <img
                src={item.src}
                alt={item.alt}
                className="h-14 sm:h-16 md:h-20 w-auto object-contain pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
