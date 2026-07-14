"use client";

import { useEffect, useRef } from "react";

type RippleOptions = {
  imageUrl: string;
  resolution: number;
  perturbance: number;
  dropRadius: number;
  interactive: boolean;
};

type RippleElement = {
  ripples: (command: RippleOptions | string, ...args: number[]) => void;
};

/** A non-intercepting, viewport-wide water surface driven by global pointer motion. */
export default function PageRippleBackground() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let disposed = false;
    let pauseTimer: ReturnType<typeof setTimeout> | undefined;
    let rippleArea: RippleElement | undefined;
    let lastDrop = 0;
    let animationFrame: number | undefined;
    let lastFrame = 0;
    let lastInput = 0;
    let target: { x: number; y: number } | undefined;
    let waterPoint: { x: number; y: number } | undefined;

    const animate = (now: number) => {
      const area = rippleArea;
      if (!area || !target || !waterPoint) {
        animationFrame = undefined;
        return;
      }

      const elapsed = Math.min(now - lastFrame, 32);
      lastFrame = now;
      const ease = 1 - Math.exp(-elapsed * 0.022);
      const dx = target.x - waterPoint.x;
      const dy = target.y - waterPoint.y;
      const distance = Math.hypot(dx, dy);

      waterPoint.x += dx * ease;
      waterPoint.y += dy * ease;

      // Feed the simulation a close-spaced trail instead of intermittent,
      // full-strength drops. This is what makes a cursor wake look fluid.
      if (now - lastDrop > 42 && distance > 0.75) {
        area.ripples("play");
        area.ripples("drop", waterPoint.x, waterPoint.y, 14, 0.026);
        lastDrop = now;
      }

      if (now - lastInput < 120 || distance > 0.75) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      animationFrame = undefined;
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => area.ripples("pause"), 1050);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!rippleArea || event.pointerType === "touch") return;

      const bounds = element.getBoundingClientRect();
      target = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      if (!waterPoint) {
        waterPoint = { ...target };
        rippleArea.ripples("play");
        rippleArea.ripples("drop", target.x, target.y, 14, 0.026);
        lastDrop = performance.now();
      }
      lastInput = performance.now();

      if (pauseTimer) clearTimeout(pauseTimer);
      if (!animationFrame) {
        lastFrame = lastInput;
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const initialize = async () => {
      const jqueryModule = await import("jquery");
      await import("jquery.ripples");
      if (disposed) return;

      const $ = jqueryModule.default;
      rippleArea = $(element) as unknown as RippleElement;
      rippleArea.ripples({
        imageUrl: "/assets/backgrounds/water-surface.svg",
        resolution: 512,
        perturbance: 0.016,
        dropRadius: 14,
        interactive: false,
      });
      rippleArea.ripples("pause");
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    };

    void initialize();

    return () => {
      disposed = true;
      if (pauseTimer) clearTimeout(pauseTimer);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      rippleArea?.ripples("destroy");
    };
  }, []);

  return <div ref={elementRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-90" />;
}
