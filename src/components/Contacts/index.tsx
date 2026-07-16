"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import FAQ from "@/components/FAQ";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FAQ_ITEMS = [
  {
    question: "HOW DO I REGISTER ?",
    answer: "To register for the hackathon, click the 'REGISTER NOW' button and fill out the registration form with your details."
  },
  {
    question: "HOW MANY TEAM MEMBERS DO I NEED?",
    answer: "Teams can consist of 2-4 members."
  },
  {
    question: "HOW MUCH IS THE PARTICIPATION FEES?",
    answer: "Round 1 is online shortlisting based on the team’s LinkedIn and Github profiles. There is no fee for Round 1. Only teams shortlisted for Round 2 will have to pay a fee of INR 899."
  },
  {
    question: "WILL THE HACKATHON BE IN PERSON OR ONLINE ?",
    answer: "This hackathon will be conducted in a hybrid format - both in-person and online participation options are available."
  },
  {
    question: "WHAT IS THE VENUE FOR MUJHACKX 4.0 ?",
    answer: "The in-person venue details will be shared with registered participants via email closer to the event date."
  },
  {
    question: "WHAT ARE THE PREREQUISITES TO PARTICIPATE IN THIS HACKATHON ?",
    answer: "Basic programming knowledge and enthusiasm to learn and build innovative solutions. All skill levels are welcome!"
  },
  {
    question: "CAN MY FRIEND JOIN OUR TEAM AFTER WE HAVE ALREADY SUBMITTED THE APPLICATION FOR REVIEW ?",
    answer: "Yes, team modifications are possible before the final deadline. Please contact our support team for assistance with team changes."
  }
];

const TRANSIT_INFO = [
  {
    type: "BY TRAIN",
    desc: "Book tickets from IRCTC. The campus is 25 KMs from Jaipur Railway Station and cab fare is around ₹500–₹600.",
    icon: <i className="fa-solid fa-train-tram text-purple-400 text-[20px] w-6 h-6 flex items-center justify-center"></i>
  },
  {
    type: "BY AIR",
    desc: "Flights from Delhi, Mumbai, Hyderabad, Bangalore. The campus is 35 KMs from Jaipur Airport.",
    icon: <i className="fa-solid fa-plane-departure text-purple-400 text-[20px] w-6 h-6 flex items-center justify-center"></i>
  },
  {
    type: "BY BUS",
    desc: "Only if nearby. Sindhi Camp is 30 KMs away. Auto fare is approx ₹400–₹450.",
    icon: <i className="fa-solid fa-bus text-purple-400 text-[20px] w-6 h-6 flex items-center justify-center"></i>
  }
];

const CONVENERS = [
  {
    name: "Aryan Verma",
    role: "STUDENT CONVENER",
    phone: "+91 8287044755",
    email: "vermaryan1@gmail.com"
  },
  {
    name: "Samaksh Gupta",
    role: "STUDENT CONVENER",
    phone: "+91 9871340076",
    email: "samakshgupta04@gmail.com"
  },
  {
    name: "Tamanna Yadav",
    role: "STUDENT CONVENER",
    phone: "+91 8805147140",
    email: "23yadav.tamanna@gmail.com"
  },
  {
    name: "Harshada Chandel",
    role: "STUDENT CONVENER",
    phone: "+91 9821970872",
    email: "hcwork28@gmail.com"
  }
];

export default function Contacts() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Animation refs
  const heroLeftRef = useRef<HTMLDivElement>(null);
  const heroRightRef = useRef<HTMLDivElement>(null);
  const heroWordmarkRef = useRef<HTMLDivElement>(null);

  const transitSectionRef = useRef<HTMLDivElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const convenersSectionRef = useRef<HTMLDivElement>(null);

  // Card interactive mouse tilt and cursor glow (Awwwards style)
  const handleCardInteractionMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
  };

  // Magnetic button animation for Call Buttons
  const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.4,
      y: y * 0.4,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  // GSAP animations
  useGSAP(() => {
    // 1. Hero Left Items staggered fade-in & slide-up
    if (heroLeftRef.current) {
      const items = heroLeftRef.current.querySelectorAll(".hero-fade-item");
      gsap.fromTo(
        items,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power3.out" }
      );
    }

    // 2. Hero Right Image slide-up & scale-in
    if (heroRightRef.current) {
      gsap.fromTo(
        heroRightRef.current,
        { y: 50, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1.4, ease: "power4.out", delay: 0.2 }
      );
    }

    // 3. Hero Bottom Wordmark characters slide-up
    if (heroWordmarkRef.current) {
      const chars = heroWordmarkRef.current.querySelectorAll(".wordmark-char");
      gsap.fromTo(
        chars,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.4, ease: "power4.out", delay: 0.4 }
      );
    }

    // 4. Scroll triggered animation for Transit section
    if (transitSectionRef.current) {
      const title = transitSectionRef.current.querySelector(".section-title");
      const cards = transitSectionRef.current.querySelectorAll(".transit-card");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: transitSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
      if (title) tl.fromTo(title, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
      tl.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.3");
    }

    // 5. Scroll triggered animation for Map section
    if (mapSectionRef.current) {
      gsap.fromTo(
        mapSectionRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: mapSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // 6. Scroll triggered animation for Conveners
    if (convenersSectionRef.current) {
      const title = convenersSectionRef.current.querySelector(".section-title");
      const cards = convenersSectionRef.current.querySelectorAll(".convener-card");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: convenersSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
      if (title) tl.fromTo(title, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
      tl.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.3");
    }

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full text-white font-sans relative overflow-x-clip">

      {/* SECTION 1: HERO (Minimal editorial layout) */}
      <section className="relative w-full min-h-[85vh] lg:min-h-0 flex flex-col justify-between pt-2 pb-6 px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto">

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start w-full pt-2 md:pt-4">

          {/* Left Column: Multi-column Contact Info & Paragraph */}
          <div ref={heroLeftRef} className="lg:col-span-7 flex flex-col justify-between gap-12 lg:min-h-[420px]">

            {/* 3-Column Info Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-[13px] tracking-wider leading-relaxed">

              {/* Col 1: Venue/Address */}
              <div className="hero-fade-item flex flex-col gap-3">
                <span className="text-white/40 uppercase font-sans font-semibold text-[12px]">Venue</span>
                <div className="flex flex-col gap-1 text-white/90 font-sans">
                  <p>MANIPAL UNIVERSITY JAIPUR</p>
                  <p>JAIPUR-AJMER EXPRESS HWY</p>
                  <p>DEHMI KALAN, JAIPUR</p>
                  <p>RAJASTHAN 303007</p>
                  <a
                    href="tel:+918287044755"
                    className="mt-2 text-white/60 hover:text-white transition-colors"
                  >
                    (+91) 8287044755
                  </a>
                </div>
              </div>

              {/* Col 2: Enquiries & Quick Contacts */}
              <div className="hero-fade-item flex flex-col gap-3">
                <span className="text-white/40 uppercase font-sans font-semibold text-[12px]">General Enquiries</span>
                <div className="flex flex-col gap-4 text-white/90 font-sans">
                  <div>
                    <a
                      href="mailto:hackxmuj@gmail.com"
                      className="underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all font-semibold break-all"
                    >
                      HACKXMUJ@GMAIL.COM
                    </a>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-white/30 uppercase text-[11px] font-semibold tracking-widest">Student Conveners</span>
                    <div className="flex flex-col gap-1 text-white/60">
                      <p className="text-white/80 font-medium">Aryan Verma</p>
                      <a href="mailto:vermaryan1@gmail.com" className="hover:text-white transition-colors underline decoration-white/20 underline-offset-2 break-all">vermaryan1@gmail.com</a>

                      <p className="text-white/80 font-medium mt-1">Samaksh Gupta</p>
                      <a href="mailto:samakshgupta04@gmail.com" className="hover:text-white transition-colors underline decoration-white/20 underline-offset-2 break-all">samakshgupta04@gmail.com</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 3: Follow Links */}
              <div className="hero-fade-item flex flex-col gap-3">
                <span className="text-white/40 uppercase font-sans font-semibold text-[12px]">Follow</span>
                <div className="flex flex-col gap-2 text-white/90 font-sans font-semibold">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all"
                  >
                    INSTAGRAM
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all"
                  >
                    LINKEDIN
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all"
                  >
                    FACEBOOK
                  </a>
                </div>
              </div>

            </div>


          </div>

          {/* Right Column: Premium Image container */}
          <div ref={heroRightRef} className="lg:col-span-5 w-full flex items-center justify-center lg:justify-end">
            <div
              onMouseMove={handleCardInteractionMove}
              className="relative aspect-[1.5] w-full max-w-[460px] lg:max-w-[480px] rounded-none overflow-hidden border border-white/10 shadow-2xl group lg:ml-auto"
            >
              {/* Hover radial border light */}
              <div
                className="pointer-events-none absolute -inset-px rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                style={{
                  background: "radial-gradient(350px circle at var(--x, 0px) var(--y, 0px), rgba(168, 85, 247, 0.2), transparent 80%)",
                  border: "1px solid rgba(168, 85, 247, 0.3)"
                }}
              />
              <img
                src="/assets/hero/venue.png"
                alt="HackX Venue Concept"
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Large screen-spanning bottom text */}
        <div ref={heroWordmarkRef} className="w-full overflow-hidden mt-12 md:mt-16 lg:mt-20 pointer-events-none select-none">
          <h1 className="font-serif italic text-white text-[16vw] lg:text-[14vw] leading-[0.8] text-center uppercase tracking-tighter flex justify-center items-center gap-1.5 md:gap-4">
            <span className="wordmark-char block">c</span>
            <span className="wordmark-char block">o</span>
            <span className="wordmark-char block">n</span>
            <span className="wordmark-char block">t</span>
            <span className="wordmark-char block">a</span>
            <span className="wordmark-char block">c</span>
            <span className="wordmark-char block">t</span>
          </h1>
        </div>

      </section>

      {/* SECTION 2: VENUE & DIRECTIONS */}
      <section ref={transitSectionRef} className="py-24 px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-20">
        <div className="section-title mb-16 flex flex-col gap-2">
          <h2 className="text-3xl md:text-5xl font-black font-sans uppercase tracking-wide text-white">REACHING THE CAMPUS</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Styled Dark Google Map */}
          <div
            ref={mapSectionRef}
            onMouseMove={handleCardInteractionMove}
            className="lg:col-span-7 border border-white/10 bg-white/[0.01] backdrop-blur-xl rounded-2xl p-2 min-h-[400px] relative overflow-hidden group"
          >
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
              style={{
                background: "radial-gradient(400px circle at var(--x, 0px) var(--y, 0px), rgba(168, 85, 247, 0.1), transparent 80%)",
                border: "1px solid rgba(168, 85, 247, 0.2)"
              }}
            />
            <iframe
              title="Manipal University Jaipur Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.8906963283287!2d75.56306507611846!3d26.84340326305417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4850e05b7b15%3A0xc95f68a8559e21b2!2sManipal%20University%20Jaipur!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{
                border: 0,
                borderRadius: "12px",
                filter: "invert(90%) hue-rotate(180deg) saturate(60%) contrast(90%)",
                minHeight: "385px"
              }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>

          {/* Transit options list */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {TRANSIT_INFO.map((info, idx) => (
              <div
                key={idx}
                onMouseMove={handleCardInteractionMove}
                className="transit-card relative border border-white/10 bg-white/[0.01] backdrop-blur-xl rounded-2xl p-6 hover:bg-white/[0.03] transition-colors duration-300 group flex items-start gap-5 overflow-hidden"
              >
                <div
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(250px circle at var(--x, 0px) var(--y, 0px), rgba(168, 85, 247, 0.12), transparent 80%)",
                    border: "1px solid rgba(168, 85, 247, 0.25)"
                  }}
                />

                <div className="p-3 bg-purple-950/40 rounded-xl w-fit border border-purple-500/20 group-hover:border-purple-500/40 transition-colors duration-300 relative z-10 flex-shrink-0">
                  {info.icon}
                </div>

                <div className="relative z-10 flex flex-col">
                  <h3 className="text-lg font-bold tracking-wider mb-2 font-sans text-white">{info.type}</h3>
                  <p className="text-white/60 leading-relaxed text-sm font-sans font-light">
                    {info.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: STUDENT CONVENERS & SUPPORT */}
      <section ref={convenersSectionRef} className="py-24 px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto relative z-20">
        <div className="section-title mb-16 flex flex-col gap-2">
          <h2 className="text-3xl md:text-5xl font-black font-sans uppercase tracking-wide text-white">STUDENT CONVENERS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {CONVENERS.map((c, idx) => (
            <div
              key={idx}
              onMouseMove={handleCardInteractionMove}
              className="convener-card relative border border-white/10 bg-white/[0.01] backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center justify-between hover:bg-white/[0.03] transition-all duration-300 text-center min-h-[300px] overflow-hidden group"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "radial-gradient(280px circle at var(--x, 0px) var(--y, 0px), rgba(168, 85, 247, 0.15), transparent 80%)",
                  border: "1px solid rgba(168, 85, 247, 0.3)"
                }}
              />

              <div className="flex flex-col items-center relative z-10 w-full">
                {/* Initials Avatar Bubble */}
                <div className="w-16 h-16 rounded-full bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-lg font-bold text-purple-300 mb-4 group-hover:scale-105 group-hover:border-purple-500/50 transition-all duration-300">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>

                <h3 className="text-lg md:text-xl font-bold font-sans text-white">{c.name}</h3>
                <span className="text-[10px] tracking-widest text-purple-400/80 font-semibold uppercase block mt-1.5 mb-6">
                  {c.role}
                </span>
                <p className="text-white/60 text-xs md:text-sm font-light select-all">{c.phone}</p>
                <a href={`mailto:${c.email}`} className="text-white/40 hover:text-white/70 transition-colors text-xs font-light block mt-1 select-all hover:underline">
                  {c.email}
                </a>
              </div>

              {/* Call shortcut button */}
              <a
                href={`tel:${c.phone}`}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="mt-8 flex items-center justify-center w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black text-white transition-all duration-300 ease-out relative z-10"
                aria-label={`Call ${c.name}`}
              >
                <i className="fa-solid fa-phone text-[16px] pointer-events-none"></i>
              </a>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm md:text-base font-medium tracking-wider text-white/50 uppercase font-sans">
            OR MAIL US DIRECTLY AT:{" "}
            <a href="mailto:hackxmuj@gmail.com" className="text-purple-400 hover:text-purple-300 transition-colors border-b border-purple-500/30 hover:border-purple-300 pb-0.5 font-bold font-sans">
              HACKXMUJ@GMAIL.COM
            </a>
          </p>
        </div>
      </section>

      {/* SECTION 4: FREQUENTLY ASKED QUESTIONS */}
      <FAQ 
        data={FAQ_ITEMS} 
        heading={
          <>
            Frequently Asked <br />Questions.
          </>
        } 
      />

    </div>
  );
}
