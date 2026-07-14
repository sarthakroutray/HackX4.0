"use client";

import React, { useEffect, useState } from "react";
import styles from "./Footer.module.css";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  if (pathname === "/stats" || pathname === "/sdg") return null;

  return (
    <footer className={styles["site-footer"]}>
      <div className={styles.glow} aria-hidden="true">
        <svg viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="g1" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#A223ED" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#A223ED" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="g2" cx="35%" cy="55%" r="45%">
              <stop offset="0%" stopColor="#572CE6" stopOpacity="0.55"/>
              <stop offset="100%" stopColor="#572CE6" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="g3" cx="65%" cy="55%" r="45%">
              <stop offset="0%" stopColor="#C076EC" stopOpacity="0.45"/>
              <stop offset="100%" stopColor="#C076EC" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="g4" cx="50%" cy="72%" r="40%">
              <stop offset="0%" stopColor="#3a1470" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#3a1470" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="1400" height="900" fill="url(#g1)"/>
          <rect width="1400" height="900" fill="url(#g2)"/>
          <rect width="1400" height="900" fill="url(#g3)"/>
          <rect width="1400" height="900" fill="url(#g4)"/>
          <g stroke="#A223ED" strokeOpacity="0.3" strokeWidth="60" strokeLinecap="round">
            <line x1="700" y1="450" x2="430" y2="180"/>
            <line x1="700" y1="450" x2="970" y2="180"/>
            <line x1="700" y1="450" x2="430" y2="720"/>
            <line x1="700" y1="450" x2="970" y2="720"/>
            <line x1="700" y1="450" x2="700" y2="150"/>
            <line x1="700" y1="450" x2="700" y2="800"/>
          </g>
        </svg>
      </div>

      <div className={styles["hero-row"]}>
        <h2 className={styles["hero-headline"]}>
          <span className={styles.line}>Let's</span>
          <span className={styles.line}>create</span>
          <span className={`${styles.line} ${styles.future}`}>future</span>
          <span className={styles.line}>together</span>
        </h2>

        <div className={styles["team-grid"]}>
          <div className={styles["team-card"]}>
            <p className={styles["team-name"]}>Aryan Verma</p>
            <p className={styles["team-phone"]}>+91 8287044755</p>
            <a className={styles["team-email"]} href="mailto:vermaryan1@gmail.com">vermaryan1@gmail.com</a>
          </div>
          <div className={styles["team-card"]}>
            <p className={styles["team-name"]}>Samaksh Gupta</p>
            <p className={styles["team-phone"]}>+91 9871340076</p>
            <a className={styles["team-email"]} href="mailto:samakshgupta04@gmail.com">samakshgupta04@gmail.com</a>
          </div>
          <div className={styles["team-card"]}>
            <p className={styles["team-name"]}>Tamanna Yadav</p>
            <p className={styles["team-phone"]}>+91 8860514740</p>
            <a className={styles["team-email"]} href="mailto:23yadav.tamanna@gmail.com">23yadav.tamanna@gmail.com</a>
          </div>
          <div className={styles["team-card"]}>
            <p className={styles["team-name"]}>Harshada Chandel</p>
            <p className={styles["team-phone"]}>+91 9821970872</p>
            <a className={styles["team-email"]} href="mailto:hcwork28@gmail.com">hcwork28@gmail.com</a>
          </div>
        </div>
      </div>

      <div className={styles["footer-bottom"]}>
        <div className={styles["contact-block"]}>
          <p className={styles["contact-us-label"]}>Contact us</p>
          <a className={styles["contact-email"]} href="mailto:HACKXMUJ@GMAIL.COM">HACKXMUJ@GMAIL.COM</a>
        </div>

        <div className={styles["footer-meta"]}>
          <div className={styles["social-links"]}>
            <a href="#facebook">Facebook</a>
            <a href="#linkedin">LinkedIn</a>
            <a href="#instagram">Instagram</a>
          </div>
          <p className={styles.copyright}>© <span className={styles.year}>{year || "2026"}</span> All rights reserved. MUJHACKX.</p>
        </div>
      </div>
    </footer>
  );
}
