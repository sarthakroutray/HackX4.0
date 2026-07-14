"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { ReactLenis } from 'lenis/react';
import WaterRippleImage from "@/components/WaterRippleImage";
import PageRippleBackground from "@/components/PageRippleBackground";

const PROJECTS = [
  {
    id: "01",
    title: "Sonic Identity",
    category: "CGI Production",
    image: "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=1200&q=85",
    description: "A speculative visual identity for sound, rhythm, and the intimate technology that carries it.",
  },
  {
    id: "02",
    title: "Solar Archive",
    category: "Experiential",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
    description: "An immersive installation designed around the warmth, scale, and quiet wonder of a manufactured sun.",
  },
  {
    id: "03",
    title: "Soft Hardware",
    category: "Brand Design",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=1200&q=85",
    description: "A tactile system that gives a small everyday object a generous, almost architectural presence.",
  },
  {
    id: "04",
    title: "Night Signals",
    category: "Film",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
    description: "A city-scale film installation that turns a familiar skyline into a live and luminous instrument.",
  },
  {
    id: "05",
    title: "New Rituals",
    category: "Campaign",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85",
    description: "A campaign study in slow gestures, dimensional light, and memorable forms of everyday connection.",
  },
  {
    id: "06",
    title: "Half Light",
    category: "CGI Production",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    description: "A monochrome image world that pairs quiet materiality with the restraint of editorial photography.",
  },
];

const FILTERS = [
  ["All projects", "16"],
  ["CGI Production", "13"],
  ["Brand Design", "2"],
  ["Film", "9"],
  ["Campaign", "9"],
  ["Experiential", "5"],
];

export default function Home() {
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);
  const { scrollYProgress } = useScroll();

  return (
    <ReactLenis root>
    <main className="min-h-screen overflow-x-clip bg-[#051236] text-[#f3f0e6]">
      <motion.div
        className="fixed bottom-0 left-0 top-0 z-50 w-1 origin-top bg-[#faebac]"
        style={{ scaleY: scrollYProgress }}
      />
      <PageRippleBackground />
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-7 py-7 text-xs font-semibold tracking-tight md:px-12">
        <button className="flex items-center gap-3 transition-opacity hover:opacity-60" type="button">
          <span className="h-px w-4 bg-current" /> Menu
        </button>
        <img 
          src="/assets/logos/HACKX Black Color@2x.png" 
          alt="HACKX Logo" 
          className="absolute left-1/2 -translate-x-1/2 h-8 w-auto md:h-12"
        />
        <button className="transition-opacity hover:opacity-60" type="button">Let&apos;s chat&nbsp; →</button>
      </header>

      <AnimatePresence mode="wait">
        <motion.h1
          key={activeProject.id}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-4 text-center font-serif leading-none [font-size:clamp(5rem,14vw,10rem)]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.1)", mixBlendMode: "overlay" }}
        >
          {activeProject.title}
        </motion.h1>
      </AnimatePresence>


      <aside className="fixed right-12 top-1/2 z-30 hidden w-56 -translate-y-1/2 xl:block">
        <motion.p
          key={activeProject.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm leading-relaxed text-[#697080]"
        >
          {activeProject.description}
        </motion.p>
      </aside>

      <section className="relative z-20 mx-auto w-full max-w-[1100px] px-6 pb-28 pt-48 sm:px-10 lg:px-0">
        <div className="columns-1 gap-4 md:columns-2">
          {PROJECTS.map((project, index) => (
            <motion.article
              key={project.id}
              className="mb-4 break-inside-avoid"
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                aria-label={project.title}
                className="cursor-crosshair overflow-hidden bg-[#0d1424]"
                onMouseEnter={() => setActiveProject(project)}
              >
                <WaterRippleImage imageUrl={project.image} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
    </ReactLenis>
  );
}
