"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

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

let rippleDependencies: Promise<any> | undefined;

function loadRippleDependencies() {
  rippleDependencies ??= Promise.all([import("jquery"), import("jquery.ripples")])
    .then(([jqueryModule]) => jqueryModule.default);
  return rippleDependencies;
}

/**
 * React wrapper around jquery.ripples' WebGL water simulation.
 * Only the currently hovered card has an active canvas.
 */
export function WaterRippleImage({ imageUrl, isActive, priority = false }: WaterRippleImageProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  // Load the shared plugin while initial gallery images are loading, so the
  // first hover after scrolling does not wait on a dynamic import.
  useEffect(() => {
    if (priority) void loadRippleDependencies();
  }, [priority]);

  useEffect(() => {
    if (!isActive) return;

    const element = elementRef.current;
    if (!element) return;

    let disposed = false;
    let rippleArea: RippleElement | undefined;

    const initialize = async () => {
      const $ = await loadRippleDependencies();
      if (disposed) return;

      rippleArea = $(element) as unknown as RippleElement;
      rippleArea.ripples({
        imageUrl,
        // A single, lower-resolution canvas is visually smooth without
        // competing with the page's other animations.
        resolution: 128,
        perturbance: 0.018,
        dropRadius: 24,
        // One active canvas keeps the pointer-driven effect responsive without
        // the overload caused by every gallery card listening at once.
        interactive: true,
        crossOrigin: "anonymous",
      });
      rippleArea.ripples("play");

      // The pointer may already be resting on the card when the canvas becomes
      // ready. Seed the simulation immediately instead of waiting for another
      // mousemove event.
      const pointer = lastPointerRef.current;
      if (pointer) {
        const bounds = element.getBoundingClientRect();
        rippleArea.ripples("drop", pointer.x - bounds.left, pointer.y - bounds.top, 24, 0.03);
      }
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
      onPointerEnter={(event) => {
        lastPointerRef.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerMove={(event) => {
        lastPointerRef.current = { x: event.clientX, y: event.clientY };
      }}
    >
      <Image
        src={imageUrl}
        alt=""
        width={0}
        height={0}
        sizes="(max-width: 768px) 100vw, 550px"
        unoptimized
        className={`pointer-events-none w-full ${isActive ? "opacity-0" : "opacity-100"}`}
        style={{ height: "auto" }}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
      />
    </div>
  );
}

export default WaterRippleImage;
