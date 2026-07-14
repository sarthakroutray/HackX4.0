"use client";

import { AnimatePresence, motion, useScroll, useVelocity, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useState, useEffect } from "react";
import WaterRippleImage from "@/components/WaterRippleImage";

const PROJECTS = [
  {
    id: "01",
    title: "Sonic Identity",
    category: "CGI Production",
    image: "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=1200&q=85",
    description: "A speculative visual identity for sound, rhythm, and the intimate technology that carries it.",
    hoverText: [
      { text: "Powered to Play All Day", className: "text-[#faebac]" }
    ],
  },
  {
    id: "02",
    title: "Solar Archive",
    category: "Experiential",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
    description: "An immersive installation designed around the warmth, scale, and quiet wonder of a manufactured sun.",
    hoverText: [
      { text: "Oriens Lum", className: "text-[#faebac]" },
      { text: "ina Walks", className: "text-[#00a3ff]" }
    ],
  },
  {
    id: "03",
    title: "Soft Hardware",
    category: "Brand Design",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=1200&q=85",
    description: "A tactile system that gives a small everyday object a generous, almost architectural presence.",
    hoverText: [
      { text: "Soft Hardware ", className: "text-[#faebac]" },
      { text: "V2", className: "text-[#ff5555]" }
    ],
  },
  {
    id: "04",
    title: "Night Signals",
    category: "Film",
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
    description: "A city-scale film installation that turns a familiar skyline into a live and luminous instrument.",
    hoverText: [
      { text: "Night ", className: "text-white" },
      { text: "Signals", className: "text-[#faebac]" }
    ],
  },
  {
    id: "05",
    title: "New Rituals",
    category: "Campaign",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85",
    description: "A campaign study in slow gestures, dimensional light, and memorable forms of everyday connection.",
    hoverText: [
      { text: "New ", className: "text-[#faebac]" },
      { text: "Rituals", className: "text-white" }
    ],
  },
  {
    id: "06",
    title: "Half Light",
    category: "CGI Production",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    description: "A monochrome image world that pairs quiet materiality with the restraint of editorial photography.",
    hoverText: [
      { text: "Half Light", className: "text-[#faebac]" }
    ],
  },
  {
    id: "07",
    title: "Digital Genesis",
    category: "CGI Production",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
    description: "A generative exploration of abstract digital terrains and simulated ecosystems.",
    hoverText: [
      { text: "Digital ", className: "text-[#faebac]" },
      { text: "Genesis", className: "text-[#00a3ff]" }
    ],
  },
  {
    id: "08",
    title: "Echo Chamber",
    category: "Experiential",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85",
    description: "An interactive sound installation reflecting the complexities of modern communication.",
    hoverText: [
      { text: "Echo Chamber", className: "text-[#faebac]" }
    ],
  },
  {
    id: "09",
    title: "Neon Pulse",
    category: "Campaign",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=1200&q=85",
    description: "Vibrant visual aesthetics capturing the energy of late-night urban landscapes.",
    hoverText: [
      { text: "Neon", className: "text-[#ff5555]" },
      { text: " Pulse", className: "text-white" }
    ],
  },
  {
    id: "10",
    title: "Quiet Form",
    category: "Brand Design",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85",
    description: "Minimalist brand identity focused on negative space and typographic clarity.",
    hoverText: [
      { text: "Quiet", className: "text-[#faebac]" },
      { text: " Form", className: "text-white" }
    ],
  },
  {
    id: "11",
    title: "Deep Current",
    category: "Film",
    image: "https://images.unsplash.com/photo-1472712739516-7ad2b786e1f7?auto=format&fit=crop&w=1200&q=85",
    description: "A short film navigating the subconscious through fluid dynamics and underwater cinematography.",
    hoverText: [
      { text: "Deep Current", className: "text-[#00a3ff]" }
    ],
  },
  {
    id: "12",
    title: "Prism Void",
    category: "CGI Production",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1200&q=85",
    description: "Volumetric light simulations refracting through impossible geometric objects.",
    hoverText: [
      { text: "Prism ", className: "text-white" },
      { text: "Void", className: "text-[#faebac]" }
    ],
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
  const [hoveredProject, setHoveredProject] = useState<typeof PROJECTS[0] | null>(null);
  const { scrollYProgress, scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const safeVelocity = useMotionValue(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
    const mountedTime = Date.now();
    return scrollVelocity.on("change", (latestVelocity) => {
      // Ignore massive scroll jumps on initial load for the first 500ms
      if (Date.now() - mountedTime > 500) {
        safeVelocity.set(latestVelocity);
      }
    });
  }, [scrollVelocity, safeVelocity]);

  const smoothVelocity = useSpring(safeVelocity, {
    damping: 50,
    stiffness: 400
  });

  const clipPathPolygon = useTransform(smoothVelocity, [-400, 0, 400], [
    "polygon(0% 2%, 12.5% 1.125%, 25% 0.5%, 37.5% 0.125%, 50% 0%, 62.5% 0.125%, 75% 0.5%, 87.5% 1.125%, 100% 2%, 100% 100%, 87.5% 99.125%, 75% 98.5%, 62.5% 98.125%, 50% 98%, 37.5% 98.125%, 25% 98.5%, 12.5% 99.125%, 0% 100%)",
    "polygon(0% 0%, 12.5% 0%, 25% 0%, 37.5% 0%, 50% 0%, 62.5% 0%, 75% 0%, 87.5% 0%, 100% 0%, 100% 100%, 87.5% 100%, 75% 100%, 62.5% 100%, 50% 100%, 37.5% 100%, 25% 100%, 12.5% 100%, 0% 100%)",
    "polygon(0% 0%, 12.5% 0.875%, 25% 1.5%, 37.5% 1.875%, 50% 2%, 62.5% 1.875%, 75% 1.5%, 87.5% 0.875%, 100% 0%, 100% 98%, 87.5% 98.875%, 75% 99.5%, 62.5% 99.875%, 50% 100%, 37.5% 99.875%, 25% 99.5%, 12.5% 98.875%, 0% 98%)"
  ]);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#051236] text-[#f3f0e6]">
      <motion.div
        className="fixed bottom-0 left-0 top-0 z-50 w-1 origin-top bg-[#faebac]"
        style={{ scaleY: scrollYProgress }}
      />
      <AnimatePresence mode="wait">
        <motion.h1
          key={activeProject.id + '-bg'}
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





      <AnimatePresence mode="wait">
        {hoveredProject && (
          <motion.div
            key={hoveredProject.id + '-hover'}
            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="w-full max-w-[1100px] px-6 text-center sm:px-10 lg:px-0">
              <h2 className="font-sans leading-none [font-size:clamp(2rem,6vw,5.5rem)] font-bold tracking-tight drop-shadow-2xl">
                {hoveredProject.hoverText.map((part, i) => (
                  <span key={i} className={part.className}>{part.text}</span>
                ))}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative z-20 mx-auto w-full max-w-[1100px] px-6 pb-28 pt-48 sm:px-10 lg:px-0">
        <div className="columns-1 gap-4 md:columns-2">
          {PROJECTS.map((project, index) => (
            <motion.article
              key={project.id}
              className="mb-4 break-inside-avoid"
              style={{ willChange: "transform, opacity" }}
              initial={{ 
                opacity: 0, 
                y: (index < 3 || (index >= 6 && index < 9)) ? "100vh" : 200, 
                scale: 0.95 
              }}
              animate={(index < 3 || (index >= 6 && index < 9)) ? { opacity: 1, y: 0, scale: 1 } : undefined}
              whileInView={!(index < 3 || (index >= 6 && index < 9)) ? { opacity: 1, y: 0, scale: 1 } : undefined}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.22, 1, 0.36, 1],
                delay: (index < 3 || (index >= 6 && index < 9)) 
                  ? ((index % 6) * 0.2 + (index < 6 ? 0 : 0.1)) 
                  : 0 
              }}
            >
              <motion.div
                aria-label={project.title}
                className="cursor-crosshair overflow-hidden bg-[#0d1424] transition-opacity duration-500 relative"
                style={{ 
                  opacity: hoveredProject && hoveredProject.id !== project.id ? 0.3 : 1,
                  // Applying an animated polygon clip to every card forces all
                  // images into repaint-heavy layers while scrolling.
                  ...(hoveredProject?.id === project.id
                    ? { clipPath: clipPathPolygon, WebkitClipPath: clipPathPolygon }
                    : {})
                }}
                onMouseEnter={() => {
                  setActiveProject(project);
                  setHoveredProject(project);
                }}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <WaterRippleImage
                  imageUrl={project.image}
                  isActive={hoveredProject?.id === project.id}
                  priority={index < 2}
                />
              </motion.div>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
