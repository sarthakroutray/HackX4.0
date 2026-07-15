import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FluidShaderBackground from "@/components/FluidShaderBackground/FluidShaderBackground";
import LenisProvider from "@/components/LenisProvider";

const oskariG2Sans = localFont({
  src: "../../public/assets/fonts/OskariG2Medium.otf",
  variable: "--font-sans",
});

const instrumentSerifItalic = localFont({
  src: "../../public/assets/fonts/InstrumentSerif-Italic.ttf",
  variable: "--font-serif",
});

const antonFallback = localFont({
  src: "../../public/assets/fonts/OskariG2Medium.otf",
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: "HackX 4.0 — MUJ's Largest Hackathon",
  description: "HackX 4.0 — Join MUJ's biggest hackathon and ignite innovation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${oskariG2Sans.variable} ${instrumentSerifItalic.variable} ${antonFallback.variable}`}>
      <body className="antialiased flex flex-col min-h-screen justify-between bg-transparent text-white relative">
        <LenisProvider>
          <FluidShaderBackground />
          <Navbar />
          <main className="flex-grow z-10 relative">
            {children}
          </main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
