// src/components/FluidShaderBackground/FluidShaderBackground.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VERTEX_SHADER_SOURCE = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Smooth minimum for organic shape merging
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  // Distance to line segment (capsule)
  float distSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  // Rotated Figure-8 point generator (optimized with precalculated cos/sin)
  vec2 getFigure8Point(float theta, float cos_p, float sin_p, float A, float B) {
    float x_base = A * sin(theta);
    float y_base = B * sin(2.0 * theta);
    return vec2(
      x_base * cos_p - y_base * sin_p,
      x_base * sin_p + y_base * cos_p
    );
  }

  // Distance to a single Figure-8 stroke using 6 unrolled segments (optimized)
  float distToFigure8Stroke(vec2 p, float phi, float phase, float A, float B, float startThick, float k_blend, float t) {
    float d = 100.0;
    
    float omega = 0.28; // Speed of motion (slow, majestic movement)
    float theta0 = omega * t + phase;
    
    // Precompute rotation factors to avoid redundant trig functions
    float cos_p = cos(phi);
    float sin_p = sin(phi);
    
    vec2 p_prev = getFigure8Point(theta0, cos_p, sin_p, A, B);
    
    // Segment 1 (u = 0.167, L = 1.65, u*L = 0.27555, pow(1.0-0.167, 1.5) = 0.76027)
    vec2 p_curr = getFigure8Point(theta0 - 0.27555, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.76027, k_blend);
    p_prev = p_curr;
    
    // Segment 2 (u = 0.333, L = 1.65, u*L = 0.54945, pow(1.0-0.333, 1.5) = 0.54474)
    p_curr = getFigure8Point(theta0 - 0.54945, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.54474, k_blend);
    p_prev = p_curr;
    
    // Segment 3 (u = 0.500, L = 1.65, u*L = 0.825, pow(1.0-0.500, 1.5) = 0.35355)
    p_curr = getFigure8Point(theta0 - 0.825, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.35355, k_blend);
    p_prev = p_curr;
    
    // Segment 4 (u = 0.667, L = 1.65, u*L = 1.10055, pow(1.0-0.667, 1.5) = 0.19216)
    p_curr = getFigure8Point(theta0 - 1.10055, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.19216, k_blend);
    p_prev = p_curr;
    
    // Segment 5 (u = 0.833, L = 1.65, u*L = 1.37445, pow(1.0-0.833, 1.5) = 0.06824)
    p_curr = getFigure8Point(theta0 - 1.37445, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr) - startThick * 0.06824, k_blend);
    p_prev = p_curr;
    
    // Segment 6 (u = 1.000, L = 1.65, u*L = 1.65, pow(1.0-1.000, 1.5) = 0.0)
    p_curr = getFigure8Point(theta0 - 1.65, cos_p, sin_p, A, B);
    d = smin(d, distSegment(p, p_prev, p_curr), k_blend);
    
    return d;
  }

  void main() {
    // 1. Correct coordinates for viewport aspect ratio
    vec2 p = vUv - 0.5;
    float aspect = uResolution.x / uResolution.y;
    p.x *= aspect;
    p *= 1.25; // Zoom out to original nice size to prevent excessive screen-edge stretching

    // 2. Define breathing cycle biased to keep the strokes extended outside the X longer
    float cycle = 0.88 + 0.12 * sin(uTime * 0.35);

    // 3. Setup thickness parameters (Sweet-spot thickness: not too bulky, not too thin)
    float t1 = 0.029 * cycle;
    float k_blend = 0.030 * cycle;

    // 4. Evaluate 6 desynchronized strokes wiggling along figure-8 loops
    float d = 100.0;

    // Stroke 1: Loop 1 (phi = 0.0 - horizontal), phase = 0.0 (goes further, oval/elongated)
    float d1 = distToFigure8Stroke(p, 0.0, 0.0, 0.58, 0.11, t1, k_blend, uTime);
    d = smin(d, d1, k_blend);

    // Stroke 2: Loop 1 (phi = 0.0 - horizontal), phase = 3.14159 + 0.5 (opposite direction, staggered) (goes further, oval/elongated)
    float d2 = distToFigure8Stroke(p, 0.0, 3.14159 + 0.5, 0.58, 0.11, t1, k_blend, uTime);
    d = smin(d, d2, k_blend);

    // Stroke 3: Loop 2 (phi = 1.0472 - 60 degrees up-right/down-left), phase = 1.0 (oval/elongated)
    float d3 = distToFigure8Stroke(p, 1.0472, 1.0, 0.44, 0.09, t1, k_blend, uTime);
    d = smin(d, d3, k_blend);

    // Stroke 4: Loop 2 (phi = 1.0472 - 60 degrees up-right/down-left), phase = 3.14159 + 1.5 (oval/elongated)
    float d4 = distToFigure8Stroke(p, 1.0472, 3.14159 + 1.5, 0.44, 0.09, t1, k_blend, uTime);
    d = smin(d, d4, k_blend);

    // Stroke 5: Loop 3 (phi = 2.0944 - 120 degrees up-left/down-right), phase = 2.0 (oval/elongated)
    float d5 = distToFigure8Stroke(p, 2.0944, 2.0, 0.44, 0.09, t1, k_blend, uTime);
    d = smin(d, d5, k_blend);

    // Stroke 6: Loop 3 (phi = 2.0944 - 120 degrees up-left/down-right), phase = 3.14159 + 2.5 (oval/elongated)
    float d6 = distToFigure8Stroke(p, 2.0944, 3.14159 + 2.5, 0.44, 0.09, t1, k_blend, uTime);
    d = smin(d, d6, k_blend);

    // 5. Soft Glow Falloff
    float glow = exp(-max(d, 0.0) * 16.0);

    // 6. Colors mapping - Perfectly matched to the X logo stops (Rich electric purples/lavenders)
    vec3 colDeepPurple = vec3(0.09, 0.00, 0.23); // #16003b (Deep indigo/purple glow)
    vec3 colPurple     = vec3(0.32, 0.00, 0.78); // #5200c7 (Royal electric violet)
    vec3 colBright     = vec3(0.47, 0.00, 1.00); // #7801ff (Vibrant electric purple)
    vec3 colCore       = vec3(0.68, 0.45, 0.95); // #ae73f2 (Soft vibrant lavender core)

    // Dynamic color wave shifting (matching the SVG logo gradient rotation effect)
    float wave = sin(uTime * 0.3) * 0.5 + 0.5;
    vec3 dynamicBright = mix(colBright, vec3(0.32, 0.0, 0.78), wave * 0.2);
    vec3 dynamicCyan = mix(colCore, vec3(0.47, 0.0, 1.0), wave * 0.2);

    // Blending weights
    float mDeepBlue = smoothstep(0.01, 0.22, glow);
    float mBlue     = smoothstep(0.15, 0.58, glow);
    float mBright   = smoothstep(0.38, 0.80, glow);
    float mCyan     = smoothstep(0.62, 0.98, glow);

    // Alpha gradient based on fluid glow strength (rich and visible, matching the logo)
    float alpha = clamp(glow * 1.35, 0.0, 1.0);

    // Mix colors over transparent base
    vec3 finalColor = vec3(0.0);
    finalColor = mix(finalColor, colDeepPurple, mDeepBlue);
    finalColor = mix(finalColor, colPurple, mBlue);
    finalColor = mix(finalColor, dynamicBright, mBright);
    finalColor = mix(finalColor, dynamicCyan, mCyan);

    // 7. Add film grain scaled by alpha
    float grain = (fract(sin(dot(vUv + uTime * 0.005, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.026;
    finalColor += vec3(grain) * alpha;

    gl_FragColor = vec4(finalColor * alpha, alpha);
  }
`;


export default function FluidShaderBackground() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      1.0, 1.0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "uTime");
    const resolutionLoc = gl.getUniformLocation(program, "uResolution");

    let animationFrameId: number;
    const startTime = performance.now();

    const resize = () => {
      // Capped at 1.0 because the canvas has a 10px blur filter overlay,
      // rendering at higher DPR yields no visual gain but wastes massive GPU fill rate.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.0);
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const elapsedSeconds = (performance.now() - startTime) / 1000;
      gl.uniform1f(timeLoc, elapsedSeconds);

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);

      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []); // WebGL initialized once on component mount

  /* Scroll zoom for team page - optimized using direct DOM manipulation to bypass React render passes */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (pathname !== "/team") {
      container.style.transform = "scale(1)";
      container.style.opacity = "1";
      return;
    }

    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const progress = window.scrollY / scrollableHeight;
      const scaleProgress = Math.min(Math.max(progress / 0.55, 0), 1);
      const scale = 1 + scaleProgress * 44;
      let opacity = 1;
      if (progress > 0.25) {
        opacity = 1 - Math.min((progress - 0.25) / 0.25, 1);
      }

      container.style.transform = `scale(${scale})`;
      container.style.opacity = `${opacity}`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const content = (
    <>
      {/* 1. Deep premium CSS gradient background layer */}
      <div
        className="pointer-events-none fixed inset-0 bg-[#090416] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1f093f] via-[#090416] to-[#04020a]"
        style={{ zIndex: -20 }}
      />

      {/* 2. SVG Logo in the middle. Filled with an animated electric gradient stop-set. */}
      <div
        className="pointer-events-none fixed inset-0 flex items-center justify-center select-none"
        style={{ zIndex: -10 }}
      >
        <svg
          viewBox="0 0 895 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-opacity duration-700"
          style={{
            height: "28vh",
            width: "25.06vh",
            opacity: 1.0,
            filter: "drop-shadow(0 0 25px rgba(174, 115, 242, 0.80)) drop-shadow(0 0 50px rgba(82, 0, 199, 0.70)) drop-shadow(0 0 15px rgba(255, 255, 255, 0.50))",
          }}
        >
          <defs>
            <linearGradient id="movingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5200c7" />
              <stop offset="33%" stopColor="#ae73f2" />
              <stop offset="66%" stopColor="#7801ff" />
              <stop offset="100%" stopColor="#5200c7" />
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                from="0 447.5 500"
                to="360 447.5 500"
                dur="15s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>
          <path
            d="M335.279 0.25L559.355 400.69L894.574 999.75H559.721L335.645 599.31L0.425781 0.25H335.279ZM335.177 999.75H0.535156L335.177 600.119V999.75ZM894.465 0.25L559.823 399.88V0.25H894.465Z"
            fill="url(#movingGradient)"
            stroke="#ffffff"
            strokeWidth="24.0"
            strokeLinejoin="round"
            strokeOpacity="1.0"
          />
        </svg>
      </div>

      {/* 3. Transparent WebGL Canvas. Confined to max 90% of viewport and centered. */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh] opacity-45"
        style={{ zIndex: -15 }}
      />

      {/* 4. Vision Blur Overlay. This blurs both the SVG and the canvas together,
             making them dissolve into a single atmospheric entity. */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -5,
          backdropFilter: "blur(10px) saturate(1.3) contrast(1.02)",
          WebkitBackdropFilter: "blur(10px) saturate(1.3) contrast(1.02)",
        }}
      />

      {/* 5. Monochrome Film Grain Overlay. Adds a highly premium, textured grain
             layer over the blurred backdrop. Optimized to 1 octave for rasterizer performance. */}
      <svg
        className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.09]"
        style={{ zIndex: -4 }}
      >
        <filter id="visionNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="1"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#visionNoise)" />
      </svg>
    </>
  );

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -30,
        transformOrigin: "center center",
        willChange: "transform, opacity",
        pointerEvents: "none",
      }}
    >
      {content}
    </div>
  );
}