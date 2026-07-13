"use client";

import { useEffect, useRef } from "react";

type WaterRippleImageProps = {
  imageUrl: string;
};

type RippleOptions = {
  imageUrl: string;
  resolution: number;
  perturbance: number;
  dropRadius: number;
  interactive: boolean;
  crossOrigin: string;
};

type RippleElement = JQuery<HTMLElement> & {
  ripples: (command: RippleOptions | "play" | "pause" | "destroy") => void;
};

/**
 * React wrapper around jquery.ripples' WebGL water simulation.
 * It remains paused while idle, then wakes for a brief, natural wave decay
 * whenever the viewer enters or moves across the image.
 */
export function WaterRippleImage({ imageUrl }: WaterRippleImageProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let disposed = false;
    let pauseTimer: ReturnType<typeof setTimeout> | undefined;
    let rippleArea: RippleElement | undefined;

    const resume = () => {
      if (!rippleArea) return;
      rippleArea.ripples("play");
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => rippleArea?.ripples("pause"), 1100);
    };

    const initialize = async () => {
      const jqueryModule = await import("jquery");
      await import("jquery.ripples");
      if (disposed) return;

      const $ = jqueryModule.default;
      rippleArea = $(element) as unknown as RippleElement;
      rippleArea.ripples({
        imageUrl,
        resolution: 256,
        perturbance: 0.018,
        dropRadius: 24,
        interactive: true,
        crossOrigin: "anonymous",
      });
      rippleArea.ripples("pause");

      element.addEventListener("pointerenter", resume);
      element.addEventListener("pointermove", resume);
    };

    void initialize();

    return () => {
      disposed = true;
      if (pauseTimer) clearTimeout(pauseTimer);
      element.removeEventListener("pointerenter", resume);
      element.removeEventListener("pointermove", resume);
      rippleArea?.ripples("destroy");
    };
  }, [imageUrl]);

  return (
    <div
      ref={elementRef}
      className="relative w-full bg-cover bg-center"
      style={{ backgroundImage: `url("${imageUrl}")` }}
    >
      <img src={imageUrl} alt="" className="pointer-events-none w-full opacity-0" />
    </div>
  );
}

export default WaterRippleImage;
