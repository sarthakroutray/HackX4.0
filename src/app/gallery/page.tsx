"use client";

import { AnimatePresence, motion, useScroll, useVelocity, useTransform, useSpring } from "framer-motion";
import { useState } from "react";
import WaterRippleImage from "@/components/WaterRippleImage";

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const domain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "";
  const cleanDomain = domain.replace(/\/$/, "");
  const cleanPath = imagePath.replace(/^\//, "");
  return `${cleanDomain}/${cleanPath}`;
};

const PROJECTS = [
  {
    id: "01",
    title: "Sonic Identity",
    category: "CGI Production",
    image: "media/1784607985788_g8i8mb.avif",
    description: "A speculative visual identity for sound, rhythm, and the intimate technology that carries it.",
    hoverText: [
      { text: "Powered to Play All Day", className: "text-[#faebac]" }
    ],
  },
  {
    id: "02",
    title: "Solar Archive",
    category: "Experiential",
    image: "media/1784608005475_xk2j89.avif",
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
    image: "media/1784608017647_eog9o3.avif",
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
    image: "media/1784608028034_6t389r.avif",
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
    image: "media/1784608037097_g0elf9.avif",
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
    image: "media/1784608048555_etx2d.avif",
    description: "A monochrome image world that pairs quiet materiality with the restraint of editorial photography.",
    hoverText: [
      { text: "Half Light", className: "text-[#faebac]" }
    ],
  },
  {
    id: "07",
    title: "Digital Genesis",
    category: "CGI Production",
    image: "media/1784608059845_d4aoi.avif",
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
    image: "media/1784608070043_uxx8wm.avif",
    description: "An interactive sound installation reflecting the complexities of modern communication.",
    hoverText: [
      { text: "Echo Chamber", className: "text-[#faebac]" }
    ],
  },
  {
    id: "09",
    title: "Neon Pulse",
    category: "Campaign",
    image: "media/1784608092419_48zjlg.avif",
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
    image: "media/1784608103375_r4ams.avif",
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
    image: "media/1784608116679_9458i.avif",
    description: "A short film navigating the subconscious through fluid dynamics and underwater cinematography.",
    hoverText: [
      { text: "Deep Current", className: "text-[#00a3ff]" }
    ],
  },
  {
    id: "12",
    title: "Prism Void",
    category: "CGI Production",
    image: "media/1784608137773_9ys66p.avif",
    description: "Volumetric light simulations refracting through impossible geometric objects.",
    hoverText: [
      { text: "Prism ", className: "text-white" },
      { text: "Void", className: "text-[#faebac]" }
    ],
  },
  {
    id: "13",
    title: "Fluid Motion",
    category: "Film",
    image: "media/1784608190932_7rsoox.avif",
    description: "A study of liquid physics, momentum, and abstract kinetic motion.",
    hoverText: [
      { text: "Fluid ", className: "text-[#faebac]" },
      { text: "Motion", className: "text-white" }
    ],
  },
  {
    id: "14",
    title: "Kinetic Form",
    category: "Experiential",
    image: "media/1784608201460_on4kmk.avif",
    description: "An installation translating mechanical motion into tactile, sculptural presence.",
    hoverText: [
      { text: "Kinetic ", className: "text-[#00a3ff]" },
      { text: "Form", className: "text-[#faebac]" }
    ],
  },
  {
    id: "15",
    title: "Light Wave",
    category: "CGI Production",
    image: "media/1784608344563_ju2zpg.jpeg",
    description: "Raymarching visual study of glowing dynamic waves and particles.",
    hoverText: [
      { text: "Light ", className: "text-white" },
      { text: "Wave", className: "text-[#faebac]" }
    ],
  },
  {
    id: "16",
    title: "Monochrome Study",
    category: "Brand Design",
    image: "media/1784608353063_n9xtko.jpeg",
    description: "Design experiment focusing purely on contrast, texture, and structural layouts.",
    hoverText: [
      { text: "Mono", className: "text-[#ff5555]" },
      { text: "chrome", className: "text-[#faebac]" }
    ],
  },
  {
    id: "17",
    title: "Future Shift",
    category: "Campaign",
    image: "media/1784608379377_heyq43.avif",
    description: "Bold marketing assets capturing the transition to next-generation interfaces.",
    hoverText: [
      { text: "Future ", className: "text-white" },
      { text: "Shift", className: "text-[#00a3ff]" }
    ],
  },
  {
    id: "18",
    title: "Hidden Layer",
    category: "CGI Production",
    image: "media/1784608393114_5szzgo9.avif",
    description: "Visualizing the unseen computational layers of neural networks and machine intelligence.",
    hoverText: [
      { text: "Hidden ", className: "text-[#faebac]" },
      { text: "Layer", className: "text-white" }
    ],
  },
  {
    id: "19",
    title: "Tactile Space",
    category: "Experiential",
    image: "media/1784608404556_uf04g.avif",
    description: "Physical spaces designed to react dynamically to touch, pressure, and proximity.",
    hoverText: [
      { text: "Tactile ", className: "text-white" },
      { text: "Space", className: "text-[#faebac]" }
    ],
  },
  {
    id: "20",
    title: "Quantum Shift",
    category: "CGI Production",
    image: "media/1784608423169_6kz4sp.avif",
    description: "Simulating subatomic particle behaviors and light refraction fields.",
    hoverText: [
      { text: "Quantum ", className: "text-[#00a3ff]" },
      { text: "Shift", className: "text-[#faebac]" }
    ],
  },
  {
    id: "21",
    title: "Spectral Glow",
    category: "Campaign",
    image: "media/1784608439157_w2n5xp.avif",
    description: "Prismatic color gradients designed to stand out in digital environments.",
    hoverText: [
      { text: "Spectral ", className: "text-white" },
      { text: "Glow", className: "text-[#ff5555]" }
    ],
  },
  {
    id: "22",
    title: "Visual Rhythm",
    category: "Film",
    image: "media/1784608451276_zelm0o.avif",
    description: "Syncing rhythmic musical beats with custom procedural visuals.",
    hoverText: [
      { text: "Visual ", className: "text-[#faebac]" },
      { text: "Rhythm", className: "text-[#00a3ff]" }
    ],
  },
  {
    id: "23",
    title: "Silent Echo",
    category: "Experiential",
    image: "media/1784608466861_f0swwg.avif",
    description: "An installation designed around the resonance and echo of quiet places.",
    hoverText: [
      { text: "Silent ", className: "text-white" },
      { text: "Echo", className: "text-[#faebac]" }
    ],
  },
  {
    id: "24",
    title: "Static Frame",
    category: "Brand Design",
    image: "media/1784608482029_0qqva.avif",
    description: "Clean typographical and layout designs exploring grid-based minimalism.",
    hoverText: [
      { text: "Static ", className: "text-[#faebac]" },
      { text: "Frame", className: "text-white" }
    ],
  },
  {
    id: "25",
    title: "Infinite Loop",
    category: "CGI Production",
    image: "media/1784608496581_i2bieq.avif",
    description: "Seamlessly looping 3D renders exploring perpetual motions.",
    hoverText: [
      { text: "Infinite ", className: "text-white" },
      { text: "Loop", className: "text-[#00a3ff]" }
    ],
  },
];

const FILTERS = [
  ["All projects", "25"],
  ["CGI Production", "8"],
  ["Brand Design", "4"],
  ["Film", "4"],
  ["Campaign", "4"],
  ["Experiential", "5"],
];

const NEUTRAL =
  "polygon(0% 0%, 33.3% 0%, 66.7% 0%, 100% 0%, 100% 100%, 66.7% 100%, 33.3% 100%, 0% 100%)";
const DOWN =
  "polygon(0% 1.2%, 33.3% 0.13%, 66.7% 0.13%, 100% 1.2%, 100% 100%, 66.7% 99.87%, 33.3% 99.87%, 0% 100%)";
const UP =
  "polygon(0% 0%, 33.3% 1.07%, 66.7% 1.07%, 100% 0%, 100% 98.8%, 66.7% 99.13%, 33.3% 99.13%, 0% 98.8%)";

export default function Home() {
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);
  const [hoveredProject, setHoveredProject] = useState<typeof PROJECTS[0] | null>(null);
  const { scrollYProgress, scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 100,
    stiffness: 200,
  });

  const clipPathPolygon = useTransform(smoothVelocity, [-400, 0, 400], [UP, NEUTRAL, DOWN]);

  if (typeof window !== "undefined") {
    window.history.scrollRestoration = "manual";
  }

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
                  clipPath: clipPathPolygon,
                  WebkitClipPath: clipPathPolygon,
                  willChange: "clip-path",
                }}
                onMouseEnter={() => {
                  setActiveProject(project);
                  setHoveredProject(project);
                }}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <WaterRippleImage
                  imageUrl={getImageUrl(project.image)}
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
