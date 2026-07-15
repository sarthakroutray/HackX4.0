import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FluidShaderBackground from "@/components/FluidShaderBackground/FluidShaderBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  weight: "400",
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
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased flex flex-col min-h-screen justify-between bg-transparent text-white relative">
        <FluidShaderBackground />
        <Navbar />
        <main className="flex-grow z-10 relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
