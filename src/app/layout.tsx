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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
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
