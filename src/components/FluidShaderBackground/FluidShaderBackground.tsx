// src/components/FluidShaderBackground/FluidShaderBackground.tsx
"use client";

import { useEffect, useRef } from "react";

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

  // Cubic Bezier point evaluation
  vec2 getCubicBezier(float t, vec2 p0, vec2 p1, vec2 p2, vec2 p3) {
    float mt = 1.0 - t;
    float mt2 = mt * mt;
    float mt3 = mt2 * mt;
    float t2 = t * t;
    float t3 = t2 * t;
    return mt3 * p0 + 3.0 * mt2 * t * p1 + 3.0 * mt * t2 * p2 + t3 * p3;
  }

  // Distance to Cubic Bezier curve using 8 unrolled segments
  float distToCubicBezier(vec2 p, vec2 p0, vec2 p1, vec2 p2, vec2 p3, float startThick, float endThick, float k_blend) {
    float d = 100.0;
    vec2 p_prev = p0;
    
    // Segment 1 (t = 0.125)
    vec2 p_curr = getCubicBezier(0.125, p0, p1, p2, p3);
    d = smin(d, distSegment(p, p_prev, p_curr) - mix(startThick, endThick, 0.125), k_blend);
    p_prev = p_curr;
    
    // Segment 2 (t = 0.25)
    p_curr = getCubicBezier(0.25, p0, p1, p2, p3);
    d = smin(d, distSegment(p, p_prev, p_curr) - mix(startThick, endThick, 0.25), k_blend);
    p_prev = p_curr;
    
    // Segment 3 (t = 0.375)
    p_curr = getCubicBezier(0.375, p0, p1, p2, p3);
    d = smin(d, distSegment(p, p_prev, p_curr) - mix(startThick, endThick, 0.375), k_blend);
    p_prev = p_curr;
    
    // Segment 4 (t = 0.5)
    p_curr = getCubicBezier(0.5, p0, p1, p2, p3);
    d = smin(d, distSegment(p, p_prev, p_curr) - mix(startThick, endThick, 0.5), k_blend);
    p_prev = p_curr;
    
    // Segment 5 (t = 0.625)
    p_curr = getCubicBezier(0.625, p0, p1, p2, p3);
    d = smin(d, distSegment(p, p_prev, p_curr) - mix(startThick, endThick, 0.625), k_blend);
    p_prev = p_curr;
    
    // Segment 6 (t = 0.75)
    p_curr = getCubicBezier(0.75, p0, p1, p2, p3);
    d = smin(d, distSegment(p, p_prev, p_curr) - mix(startThick, endThick, 0.75), k_blend);
    p_prev = p_curr;
    
    // Segment 7 (t = 0.875)
    p_curr = getCubicBezier(0.875, p0, p1, p2, p3);
    d = smin(d, distSegment(p, p_prev, p_curr) - mix(startThick, endThick, 0.875), k_blend);
    p_prev = p_curr;
    
    // Segment 8 (t = 1.0)
    p_curr = getCubicBezier(1.0, p0, p1, p2, p3);
    d = smin(d, distSegment(p, p_prev, p_curr) - mix(startThick, endThick, 1.0), k_blend);
    
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

    // 3. Smooth wiggling branch offsets (restored to original nice size)
    float speed1 = 0.5;
    float speed2 = 0.7;
    float speed3 = 0.9;
    float t = uTime;

    // Upper branch loops (Smooth figure-8 style outward flow)
    vec2 upper_offset1 = vec2(
      0.22 * sin(t * speed1),
      0.24 * cos(t * speed1 * 0.8)
    );
    vec2 upper_offset2 = vec2(
      0.20 * sin(t * speed2 + 0.5),
      0.14 * cos(t * speed2 * 0.9 + 0.5)
    );
    vec2 upper_offset3 = vec2(
      0.14 * sin(t * speed3 + 1.0),
      0.08 * cos(t * speed3 * 1.1 + 1.0)
    );

    // Lower branch loops (Smooth figure-8 style outward flow)
    vec2 lower_offset1 = vec2(
      0.22 * cos(t * speed1 * 0.9),
      -0.24 * sin(t * speed1 * 0.85)
    );
    vec2 lower_offset2 = vec2(
      0.20 * cos(t * speed2 * 1.05 + 0.8),
      -0.14 * sin(t * speed2 * 0.95 + 0.8)
    );
    vec2 lower_offset3 = vec2(
      0.14 * cos(t * speed3 * 0.9 + 1.2),
      -0.08 * sin(t * speed3 * 1.1 + 1.2)
    );

    vec2 base = vec2(0.0, 0.0);
    
    // Build hierarchical joint chains exactly as the original wiggling
    vec2 p_up1 = base + upper_offset1 * cycle;
    vec2 p_up2 = p_up1 + upper_offset2 * cycle;
    vec2 p_up3 = p_up2 + upper_offset3 * cycle;

    vec2 p_down1 = base + lower_offset1 * cycle;
    vec2 p_down2 = p_down1 + lower_offset2 * cycle;
    vec2 p_down3 = p_down2 + lower_offset3 * cycle;

    // Segment thickness (Sweet-spot thickness: not too bulky, not too thin)
    float t1 = 0.023 * cycle;
    float t3 = 0.008 * cycle;
    float k_blend = 0.030 * cycle;

    // 4. Evaluate Right Upper/Lower branches using cubic Bezier curves over the joint chain
    float d_right_up = distToCubicBezier(p, base, p_up1, p_up2, p_up3, t1, t3, k_blend);
    float d_right_down = distToCubicBezier(p, base, p_down1, p_down2, p_down3, t1, t3, k_blend);
    float d_right = smin(d_right_up, d_right_down, k_blend);

    // 5. Evaluate Left Upper/Lower branches by mirroring the X coordinate
    vec2 p_left = vec2(-p.x, p.y);
    float d_left_up = distToCubicBezier(p_left, base, p_up1, p_up2, p_up3, t1, t3, k_blend);
    float d_left_down = distToCubicBezier(p_left, base, p_down1, p_down2, p_down3, t1, t3, k_blend);
    float d_left = smin(d_left_up, d_left_down, k_blend);

    // 6. Merge left and right smoothly
    float d = smin(d_right, d_left, k_blend);

    // 7. Soft Glow Falloff - Balanced decay for a gorgeous, visible electric glow with a soft halo
    float glow = exp(-max(d, 0.0) * 16.0);

    // 8. Colors mapping - Perfectly matched to the X logo stops (Rich electric purples/lavenders)
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

    // 9. Add film grain scaled by alpha
    float grain = (fract(sin(dot(vUv + uTime * 0.005, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.026;
    finalColor += vec3(grain) * alpha;

    gl_FragColor = vec4(finalColor * alpha, alpha);
  }
`;

export default function FluidShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
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
  }, []);

  return (
    <>
      {/* 1. Deep premium CSS gradient background layer */}
      <div
        className="pointer-events-none fixed inset-0 bg-[#06040f] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#13002b] via-[#06040f] to-[#030206]"
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
            filter: "drop-shadow(0 0 15px rgba(82, 0, 199, 0.60)) drop-shadow(0 0 40px rgba(174, 115, 242, 0.35))",
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
          />
        </svg>
      </div>

      {/* 3. Transparent WebGL Canvas. Confined to max 90% of viewport and centered. */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh] opacity-80"
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
             layer over the blurred backdrop. */}
      <svg
        className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.09]"
        style={{ zIndex: -4 }}
      >
        <filter id="visionNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
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
}