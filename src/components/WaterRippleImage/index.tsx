"use client";

import { useEffect, useRef } from "react";

type WaterRippleImageProps = {
  imageUrl: string;
  isActive: boolean;
  priority?: boolean;
};

type RippleOptions = {
  imageUrl: string;
  resolution: number;
  perturbance: number;
  dropRadius: number;
  interactive: boolean;
  crossOrigin: string;
};

type RippleElement = {
  ripples: (command: RippleOptions | string, ...args: number[]) => void;
};

/**
 * React wrapper around jquery.ripples' WebGL water simulation.
 * Only the currently hovered card has an active canvas.
 */
export function WaterRippleImage({ imageUrl, isActive, priority = false }: WaterRippleImageProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const element = elementRef.current;
    if (!element) return;

    let disposed = false;
    let rippleArea: RippleElement | undefined;

    const initialize = async () => {
      const jqueryModule = await import("jquery");
      await import("jquery.ripples");
      if (disposed) return;

      const $ = jqueryModule.default;
      rippleArea = $(element) as unknown as RippleElement;
      rippleArea.ripples({
        imageUrl,
        // A single, lower-resolution canvas is visually smooth without
        // competing with the page's other animations.
        resolution: 128,
        perturbance: 0.058,
        dropRadius: 24,
        // One active canvas keeps the pointer-driven effect responsive without
        // the overload caused by every gallery card listening at once.
        interactive: true,
        crossOrigin: "anonymous",
      });
      rippleArea.ripples("play");
    };

    // Only the image under the pointer owns a WebGL canvas. Initialising one
    // canvas per card creates a large GPU workload and eventually stalls hover.
    void initialize();

    return () => {
      disposed = true;
      rippleArea?.ripples("destroy");
    };
  }, [imageUrl, isActive]);

  return (
    <div
      ref={elementRef}
      className="relative w-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: isActive ? `url("${imageUrl}")` : undefined }}
    >
      <img
        src={imageUrl}
        alt=""
        className={`pointer-events-none w-full ${isActive ? "opacity-0" : "opacity-100"}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
      />
    </div>
  );
}

export default WaterRippleImage;
