"use client";

import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform, useVelocity, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import WaterRippleImage from "@/components/WaterRippleImage";

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return imagePath
    .replace("/assets/images/", "/assets/images/gallery/")
    .replace(/\.(avif|jpe?g)$/i, ".webp");
};

const NEUTRAL =
  "polygon(0% 0%, 33.3% 0%, 66.7% 0%, 100% 0%, 100% 100%, 66.7% 100%, 33.3% 100%, 0% 100%)";
const DOWN =
  "polygon(0% 5%, 33.3% 0.4%, 66.7% 0.4%, 100% 5%, 100% 100%, 66.7% 99.6%, 33.3% 99.6%, 0% 100%)";
const UP =
  "polygon(0% 0%, 33.3% 4.6%, 66.7% 4.6%, 100% 0%, 100% 95%, 66.7% 99.6%, 33.3% 99.6%, 0% 95%)";

const RAW_PROJECTS = [
  {
    id: "02",
    title: "Solar Archive",
    category: "Experiential",
    image: "/assets/images/pic2_converted.avif",
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
    image: "/assets/images/pic3_converted.avif",
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
    image: "/assets/images/pic4_converted.avif",
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
    image: "/assets/images/pic6_converted.avif",
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
    image: "/assets/images/pic7_converted.avif",
    description: "A monochrome image world that pairs quiet materiality with the restraint of editorial photography.",
    hoverText: [
      { text: "Half Light", className: "text-[#faebac]" }
    ],
  },
  {
    id: "07",
    title: "Digital Genesis",
    category: "CGI Production",
    image: "/assets/images/pic8_converted.avif",
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
    image: "/assets/images/pic9_converted.avif",
    description: "An interactive sound installation reflecting the complexities of modern communication.",
    hoverText: [
      { text: "Echo Chamber", className: "text-[#faebac]" }
    ],
  },
  {
    id: "09",
    title: "Neon Pulse",
    category: "Campaign",
    image: "/assets/images/pic10_converted.avif",
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
    image: "/assets/images/pic11_converted.avif",
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
    image: "/assets/images/pic12_converted.avif",
    description: "A short film navigating the subconscious through fluid dynamics and underwater cinematography.",
    hoverText: [
      { text: "Deep Current", className: "text-[#00a3ff]" }
    ],
  },
  {
    id: "12",
    title: "Prism Void",
    category: "CGI Production",
    image: "/assets/images/pic14_converted.avif",
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
    image: "/assets/images/pic15_converted.avif",
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
    image: "/assets/images/pic16_converted.avif",
    description: "An installation translating mechanical motion into tactile, sculptural presence.",
    hoverText: [
      { text: "Kinetic ", className: "text-[#00a3ff]" },
      { text: "Form", className: "text-[#faebac]" }
    ],
  },
  {
    id: "16",
    title: "Monochrome Study",
    category: "Brand Design",
    image: "/assets/images/image_converted.avif",
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
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.16_converted.avif",
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
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.16 (1)_converted.avif",
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
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.17_converted.avif",
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
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.17 (1)_converted.avif",
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
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.18_converted.avif",
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
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.18 (1)_converted.avif",
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
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.18 (2)_converted.avif",
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
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.19_converted.avif",
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
    image: "/assets/images/WhatsApp Image 2026-07-21 at 09.04.19 (1)_converted.avif",
    description: "Seamlessly looping 3D renders exploring perpetual motions.",
    hoverText: [
      { text: "Infinite ", className: "text-white" },
      { text: "Loop", className: "text-[#00a3ff]" }
    ],
  },
  {
    id: "27",
    title: "Chroma Field",
    category: "CGI Production",
    image: "/assets/images/WhatsApp Image 2026-07-21 at 10.01.12 copy.jpeg",
    description: "Prismatic shader fields shifting based on camera proximity.",
    hoverText: [
      { text: "Chroma ", className: "text-[#00a3ff]" },
      { text: "Field", className: "text-[#faebac]" }
    ],
  },
];

const FILTERS = [
  ["All projects", "27"],
  ["CGI Production", "9"],
  ["Brand Design", "4"],
  ["Film", "4"],
  ["Campaign", "4"],
  ["Experiential", "6"],
];

const PROJECTS = RAW_PROJECTS.map((project) => ({
  ...project,
  image: getImageUrl(project.image),
}));

type Project = (typeof PROJECTS)[number];

function GalleryCard({
  project,
  isActive,
  isDimmed,
  priority,
  scrollClipPath,
  onEnter,
  onLeave,
  onClick,
}: {
  project: Project;
  isActive: boolean;
  isDimmed: boolean;
  priority: boolean;
  scrollClipPath: MotionValue<string>;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isNearViewport = useInView(cardRef, { margin: "200px 0px", amount: 0 });

  return (
    <article className="mb-4 break-inside-avoid [contain:paint]">
      <motion.div
        ref={cardRef}
        aria-label={project.title}
        role="button"
        tabIndex={0}
        className="cursor-crosshair overflow-hidden bg-transparent transition-opacity duration-500 relative"
        style={{
          opacity: isDimmed ? 0.3 : 1,
          clipPath: isNearViewport ? scrollClipPath : NEUTRAL,
          WebkitClipPath: isNearViewport ? scrollClipPath : NEUTRAL,
          transform: "translateZ(0)",
          willChange: isNearViewport ? "clip-path" : "auto",
        }}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onPointerCancel={onLeave}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
      >
        <WaterRippleImage imageUrl={project.image} isActive={isActive} priority={priority} />
      </motion.div>
    </article>
  );
}

export default function Home() {
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);
  const [hoveredProject, setHoveredProject] = useState<typeof PROJECTS[0] | null>(null);
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 60, stiffness: 380 });
  const scrollClipPath = useTransform(smoothVelocity, [-120, 0, 120], [UP, NEUTRAL, DOWN]);

  const closeLightbox = useCallback(() => setSelectedProject(null), []);

  useEffect(() => {
    if (!selectedProject) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeLightbox(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [selectedProject, closeLightbox]);



  if (typeof window !== "undefined") {
    window.history.scrollRestoration = "manual";
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-transparent text-[#f3f0e6]">


      <AnimatePresence initial={false}>
        {hoveredProject && (
          <motion.div
            key={hoveredProject.id + '-hover'}
            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
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

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
            onClick={closeLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-black/90"
              onClick={closeLightbox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            <motion.div
              className="relative z-10 flex flex-col items-center w-full max-w-[90vw] max-h-[90vh]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="relative w-full max-h-[80vh] rounded-lg overflow-hidden">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  width={0}
                  height={0}
                  sizes="90vw"
                  unoptimized
                  priority
                  className="w-full h-auto max-h-[80vh] object-contain"
                  style={{ height: "auto" }}
                />
              </div>

              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
              >
                <h2 className="font-sans leading-none [font-size:clamp(1.5rem,4vw,3rem)] font-bold tracking-tight">
                  {selectedProject.hoverText.map((part, i) => (
                    <span key={i} className={part.className}>{part.text}</span>
                  ))}
                </h2>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] opacity-50">{selectedProject.category}</p>
                <p className="mt-3 max-w-md mx-auto text-base leading-relaxed opacity-70">
                  {selectedProject.description}
                </p>
              </motion.div>

              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors text-sm uppercase tracking-[0.2em]"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative z-20 mx-auto w-full max-w-[1100px] px-6 pb-28 pt-48 sm:px-10 lg:px-0">
        <div className="columns-1 gap-4 md:columns-2">
          {PROJECTS.map((project, index) => (
            <GalleryCard
              key={project.id}
              project={project}
              isActive={hoveredProject?.id === project.id}
              isDimmed={Boolean(hoveredProject && hoveredProject.id !== project.id)}
              priority={index < 7}
              scrollClipPath={scrollClipPath}
              onEnter={() => {
                  setActiveProject(project);
                  setHoveredProject(project);
                }}
              onLeave={() => setHoveredProject(null)}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
