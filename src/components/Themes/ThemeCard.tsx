"use client";

import React from "react";

export interface ThemeCardData {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  image?: string;
  styleType: "night-goggles" | "loss" | "now" | "saigon-souls" | "fromanother" | "fwa" | "site-of-the-day";
}

interface ThemeCardProps {
  card: ThemeCardData;
}

// Cyber Wreath SVG Component
const CyberWreath = ({ label1, label2, trackNo, colorClass = "text-violet-500" }: { label1: string; label2: string; trackNo: string; colorClass?: string }) => (
  <div className="flex flex-col items-center justify-center text-center scale-75 md:scale-90 opacity-80 transition-all duration-300">
    <div className={`relative w-12 h-12 flex items-center justify-center ${colorClass}`}>
      <svg className="absolute inset-0 w-full h-full text-current" viewBox="0 0 50 50" fill="currentColor">
        {/* Left branch */}
        <path d="M 25 43 C 18 43, 11 36, 11 25 C 11 18, 14 11, 21 8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        {/* Right branch */}
        <path d="M 25 43 C 32 43, 39 36, 39 25 C 39 18, 36 11, 29 8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        {/* Left leaves */}
        <path d="M 13 33 C 11 32, 9 33, 9 35 C 9 37, 12 36, 13 34 Z"/>
        <path d="M 11 26 C 9 24, 7 25, 6 27 C 6 29, 9 29, 11 27 Z"/>
        <path d="M 12 19 C 10 17, 8 17, 7 19 C 6 21, 9 22, 11 20 Z"/>
        <path d="M 15 12 C 13 10, 11 10, 10 12 C 9 14, 12 15, 14 13 Z"/>
        <path d="M 20 8 C 18 6, 17 6, 16 8 C 15 10, 17 11, 19 9 Z"/>
        {/* Right leaves */}
        <path d="M 37 33 C 39 32, 41 33, 41 35 C 41 37, 38 36, 37 34 Z"/>
        <path d="M 39 26 C 41 24, 43 25, 44 27 C 44 29, 41 29, 39 27 Z"/>
        <path d="M 38 19 C 40 17, 42 17, 43 19 C 44 21, 41 22, 39 20 Z"/>
        <path d="M 35 12 C 37 10, 39 10, 40 12 C 41 14, 38 15, 36 13 Z"/>
        <path d="M 30 8 C 32 6, 33 6, 34 8 C 35 10, 33 11, 31 9 Z"/>
      </svg>
      <span className="text-[7px] font-mono font-bold tracking-widest leading-none mt-[2px] uppercase z-10 text-white">{trackNo}</span>
    </div>
    <div className="text-[5px] font-mono uppercase tracking-[0.2em] font-medium text-white/50 leading-[1.3] mt-1 max-w-[70px]">
      <div>{label1}</div>
      <div>{label2}</div>
    </div>
  </div>
);

export default function ThemeCard({ card }: ThemeCardProps) {
  const renderCardContent = () => {
    switch (card.styleType) {
      case "night-goggles":
        return (
          <div className="relative w-full h-full bg-[#0a0514] flex flex-col justify-between p-6 rounded border border-violet-500/20 shadow-[0_0_30px_rgba(120,1,255,0.05)] text-white overflow-hidden group">
            {/* Background image */}
            {card.image && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${card.image})` }}
              />
            )}
            {/* Violet Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0514] via-[#0a0514]/40 to-violet-950/20 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center flex-grow mt-12 text-center">
              <span className="text-[7px] font-mono tracking-[0.4em] text-violet-400 font-bold mb-2 uppercase">TRACK 01 // CORE</span>
              <h3 className="font-serif italic text-3xl font-light tracking-wide text-[#F3EFE0] group-hover:text-violet-200 transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/40 mt-3">
                INTELLIGENT AGENTS
              </p>
            </div>

            <div className="relative z-10 flex justify-center gap-4 border-t border-violet-500/10 pt-4">
              <CyberWreath label1="HackX 4.0" label2="Track" trackNo="AI" colorClass="text-violet-500" />
              <CyberWreath label1="Neural" label2="Core" trackNo="01" colorClass="text-violet-500" />
              <CyberWreath label1="ML" label2="Special" trackNo="AGI" colorClass="text-violet-500" />
            </div>
          </div>
        );

      case "loss":
        return (
          <div className="relative w-full h-full bg-[#030d14] flex flex-col justify-between p-6 rounded border border-cyan-500/20 shadow-[0_0_30px_rgba(0,240,255,0.05)] text-white overflow-hidden group">
            {card.image && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-color-dodge transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${card.image})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030d14] via-[#030d14]/40 to-cyan-950/20 pointer-events-none" />

            <div className="relative z-10 pt-4 text-center mt-6">
              <span className="text-[7px] font-mono tracking-[0.4em] text-cyan-400 font-bold uppercase block mb-3">TRACK 02 // NETWORK</span>
              <h3 className="font-mono text-2xl font-light tracking-[0.15em] text-[#FCFBF8] leading-tight group-hover:text-cyan-200 transition-colors duration-300">
                {card.title}
              </h3>
            </div>

            <div className="relative z-10 flex justify-center gap-4 border-t border-cyan-500/10 pt-4">
              <CyberWreath label1="Blockchain" label2="Ledger" trackNo="W3" colorClass="text-cyan-400" />
              <CyberWreath label1="HackX 4.0" label2="Web3" trackNo="02" colorClass="text-cyan-400" />
              <CyberWreath label1="Contract" label2="Solidity" trackNo="ETH" colorClass="text-cyan-400" />
            </div>
          </div>
        );

      case "now":
        return (
          <div className="relative w-full h-full bg-[#0a0f05] flex flex-col justify-between p-5 rounded border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] text-white overflow-hidden group">
            <div className="relative flex-grow w-full rounded overflow-hidden mt-2 bg-[#050703] border border-emerald-500/10 aspect-[4/5]">
              {card.image && (
                <div 
                  className="w-full h-full bg-cover bg-center opacity-50 mix-blend-luminosity transition-transform duration-700 group-hover:scale-105 group-hover:opacity-75"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
              )}
            </div>

            <div className="flex flex-col items-center mt-4 text-center">
              <span className="text-[7px] font-mono tracking-[0.4em] text-emerald-400 font-bold uppercase block mb-1">TRACK 03 // SYSTEMS</span>
              <h3 className="font-sans font-normal text-xl tracking-[0.2em] uppercase text-white group-hover:text-emerald-300 transition-colors duration-300">
                {card.title}
              </h3>
            </div>

            <div className="flex justify-center gap-4 border-t border-emerald-500/10 pt-4">
              <CyberWreath label1="Finance" label2="DeFi" trackNo="FT" colorClass="text-emerald-400" />
              <CyberWreath label1="HackX 4.0" label2="Smart" trackNo="03" colorClass="text-emerald-400" />
              <CyberWreath label1="Ledger" label2="Banking" trackNo="PAY" colorClass="text-emerald-400" />
            </div>
          </div>
        );

      case "saigon-souls":
        return (
          <div className="relative w-full h-full bg-[#050d0a] flex flex-col justify-between p-6 rounded border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.05)] text-white overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#14b8a610_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10 text-center pt-2">
              <p className="text-[7px] font-mono uppercase tracking-[0.3em] text-teal-400 font-bold">TRACK 04 // BIOLOGY</p>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center flex-grow text-center py-6">
              {card.image && (
                <div 
                  className="w-20 h-20 rounded-full bg-cover bg-center border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.2)] mb-4 transition-all duration-700 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] mix-blend-screen"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
              )}
              <h3 className="font-serif text-2xl font-light tracking-[0.15em] text-[#EBEFEA] uppercase group-hover:text-teal-200 transition-colors duration-300">
                HEALTHCARE
              </h3>
              <h3 className="font-serif text-2xl font-light tracking-[0.15em] text-[#EBEFEA] uppercase -mt-1 group-hover:text-teal-200 transition-colors duration-300">
                & MEDTECH
              </h3>
              <p className="text-[7px] font-mono uppercase tracking-[0.2em] text-teal-500/70 mt-2">COMPUTATIONAL CORE</p>
            </div>

            <div className="relative z-10 text-center border-t border-teal-500/10 pt-4">
              <p className="text-[6px] font-mono tracking-[0.25em] uppercase font-semibold text-teal-400">BioTech / Diagnostics / Assistive</p>
              <p className="text-[5px] font-mono tracking-[0.2em] uppercase text-white/40 mt-1">HackX 4.0 Interactive Health Challenge</p>
            </div>
          </div>
        );

      case "fromanother":
        return (
          <div className="relative w-full h-full bg-[#0a0512] flex flex-col justify-between p-6 rounded border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.05)] text-white overflow-hidden group">
            {/* Tech line background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-56 h-56 border-[2px] border-purple-500 rounded-full animate-[spin_30s_linear_infinite]" />
              <div className="absolute w-40 h-40 border border-purple-500 rotate-45" />
            </div>

            <div className="relative z-10 flex justify-between items-start text-[7px] tracking-wider text-purple-400/60 font-mono">
              <span>TRACK 05</span>
              <span>LEARNING FUTURES</span>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-4">
              <div className="text-center rotate-[-5deg] transition-all duration-500 group-hover:rotate-0">
                <span className="block font-mono text-[9px] tracking-[0.3em] text-purple-400 uppercase font-bold">EDTECH</span>
                <span className="block font-sans text-4xl font-black tracking-tighter text-purple-500 leading-none my-1 group-hover:text-purple-400 transition-colors duration-300">
                  VR CORE
                </span>
                <span className="block font-mono text-[9px] tracking-[0.2em] text-white/40 uppercase font-semibold">IMMERSIVE</span>
              </div>
            </div>

            <div className="relative z-10 border-t border-purple-500/10 pt-4 text-center">
              <p className="text-[7px] font-mono uppercase tracking-[0.25em] font-medium text-neutral-400">
                HackX 4.0 Interactive Showcase
              </p>
              <p className="text-[6px] tracking-[0.2em] font-mono text-purple-400 mt-1 uppercase">
                AR/VR Development / Future Classrooms
              </p>
            </div>
          </div>
        );

      case "fwa":
        return (
          <div className="relative w-full h-full bg-[#120703] flex flex-col justify-between p-6 rounded border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.05)] text-white overflow-hidden group">
            {/* Orange grid bars */}
            <div className="absolute right-0 top-0 bottom-0 w-2/5 flex flex-col justify-between py-6 pr-4 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-[3px] bg-orange-500 rounded-sm transition-all duration-500"
                  style={{
                    width: `${50 + Math.sin(i * 0.6) * 35}%`,
                    opacity: 0.3 + (i % 3) * 0.2
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 flex justify-between items-start">
              <span className="font-mono text-[8px] font-bold text-orange-500 tracking-widest">TRACK 06</span>
              <span className="font-mono text-[7px] text-orange-400/60 font-bold uppercase">Smart Cities</span>
            </div>

            <div className="relative z-10 flex-grow flex flex-col justify-center max-w-[60%]">
              <h3 className="font-sans text-2xl font-extrabold tracking-tight leading-none text-white uppercase group-hover:text-orange-400 transition-colors duration-300">
                SMART CITIES
              </h3>
              <h4 className="font-serif italic text-lg text-orange-500 mt-1">
                & IoT Core
              </h4>
              <p className="text-[8px] font-mono text-neutral-400 mt-4 leading-relaxed">
                Connecting infrastructure, micro-controllers, and smart robotics.
              </p>
            </div>

            <div className="relative z-10 border-t border-orange-500/10 pt-4 font-mono text-[7px] text-neutral-400 flex justify-between">
              <span>HACKX 4.0</span>
              <span className="text-orange-500 font-bold">HARDWARE & EMBEDDED</span>
            </div>
          </div>
        );

      case "site-of-the-day":
        return (
          <div className="relative w-full h-full bg-[#12030a] flex flex-col justify-between p-6 rounded border border-magenta-500/20 shadow-[0_0_30px_rgba(210,66,215,0.05)] text-white overflow-hidden group">
            {/* Diagonal line patterns in magenta */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#d242d7_25%,transparent_25%,transparent_50%,#d242d7_50%,#d242d7_75%,transparent_75%,transparent)] bg-[size:30px_30px]" />
            
            <div className="relative z-10 flex justify-between items-center">
              <span className="text-xl font-bold tracking-tighter text-magenta-500 font-mono">HX</span>
              <span className="text-[7px] font-mono uppercase tracking-[0.2em] text-magenta-400/80 font-bold">TRACK 07</span>
            </div>

            <div className="relative z-10 flex flex-col flex-grow justify-center mt-4">
              <span className="text-[8px] font-mono tracking-widest text-magenta-400 uppercase font-bold">Open Innovation</span>
              <h3 className="font-sans text-2xl font-black tracking-tight leading-tight my-1 uppercase group-hover:text-magenta-300 transition-colors duration-300">
                COSMIC TRACK
              </h3>
              <p className="text-[8px] font-mono text-neutral-400 mt-1 uppercase">
                ANY TECH / CHOOSE YOUR PROBLEM
              </p>
            </div>

            <div className="relative z-10 border-t border-magenta-500/10 pt-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[7px] font-mono text-magenta-400">
                <span>HACKX 4.0 SPECIAL</span>
                <span className="font-bold">UNRESTRICTED</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[5px] font-mono uppercase tracking-wider text-neutral-500">Cross-Disciplinary Dev</span>
                <div className="flex gap-2">
                  <div className="w-6 h-3 border border-magenta-500/30 rounded-sm opacity-50 bg-magenta-500/10" />
                  <div className="w-6 h-3 border border-magenta-500/30 rounded-sm opacity-50 bg-magenta-500/10" />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-[280px] sm:w-[320px] md:w-[350px] aspect-[1/1.4] flex-shrink-0 relative transition-transform duration-300 hover:scale-[1.03] cursor-pointer">
      {renderCardContent()}
    </div>
  );
}
