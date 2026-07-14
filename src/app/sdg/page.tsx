import SdgComponent from "@/components/sdg";

export const metadata = {
  title: "Brand Showcase — Orbiting Arc",
  description: "A premium, scroll-driven brand showcase with a semicircle arc motion powered by GSAP and ScrollTrigger.",
};

export default function SdgPage() {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
      {/* Figma: 1675×853px, top:-390px left:-82px — gradient fades to transparent so black shows outside */}
      <div
        className="pointer-events-none fixed"
        style={{
          width: "1675px",
          height: "853px",
          top: "-390px",
          left: "-82px",
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(184,110,249,0.95) 0%, rgba(120,1,255,0.85) 35%, rgba(60,0,130,0.4) 60%, transparent 75%)",
          zIndex: 0,
        }}
      />
      <div className="relative z-10 w-full">
        <SdgComponent />
      </div>
    </div>
  );
}
