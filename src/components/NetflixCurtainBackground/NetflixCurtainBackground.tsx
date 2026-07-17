// src/components/NetflixCurtainBackground/NetflixCurtainBackground.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { MotionValue, useMotionValueEvent } from "framer-motion";

interface NetflixCurtainBackgroundProps {
  scrollYProgress: MotionValue<number>;
}

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
  uniform float uOpen; // range [0, 1]

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    vec2 p = vUv - 0.5;
    float aspect = uResolution.x / uResolution.y;
    p.x *= aspect;
    p *= 1.05; // Slightly zoom in to prevent edge issues

    float progress = uOpen; // [0, 1]

    // Symmetrical split that parts and settles at the left/right sides (max 72% of aspect)
    // This keeps the curtains visible at the sides as a framing element
    float splitCenter = progress * aspect * 0.72;

    // Distance to the moving split edge
    float distToSplit = abs(p.x) - splitCenter;
    
    // Very wide, soft feathered edge (fading from the middle) to match the layout
    float splitAlpha = smoothstep(0.0, 0.38, distToSplit);
    
    // If completely transparent, return early
    if (splitAlpha <= 0.0) {
      gl_FragColor = vec4(0.0);
      return;
    }

    // Shift curtain coordinate to move the fabric left and right (mirrored)
    float curtainX = p.x - sign(p.x) * splitCenter;
    float curtainY = p.y;

    // MIRRORED COORDINATE: Distance from the split edge
    float foldX = abs(curtainX);

    // CONTINUOUS SLIDING ANIMATION: Increased sliding speed (3x faster)
    float foldX_anim = foldX - uTime * 0.24;

    // ULTRA DENSE MULTI-SCALE VERTICAL FOLDS: Generates multiple lines of varying widths
    float f0 = 6.0;
    float f1 = 14.0;
    float f2 = 28.0;
    float f3 = 56.0;
    float f4 = 112.0;

    float foldVal = sin(foldX_anim * f1) * 0.35;
    foldVal += sin(foldX_anim * f2 + 1.2) * 0.25;
    foldVal += sin(foldX_anim * f3 + 2.4) * 0.18;
    foldVal += sin(foldX_anim * f4 + 3.6) * 0.08;
    foldVal += cos(foldX_anim * f0) * 0.14; // wide grouping waves

    // Normal vector calculation via partial derivative of folds shape
    float dfdx = cos(foldX_anim * f1) * 0.35 * f1;
    dfdx += cos(foldX_anim * f2 + 1.2) * 0.25 * f2;
    dfdx += cos(foldX_anim * f3 + 2.4) * 0.18 * f3;
    dfdx += cos(foldX_anim * f4 + 3.6) * 0.08 * f4;
    dfdx -= sin(foldX_anim * f0) * 0.14 * f0;

    // Derivative scaled down to 0.06 and multiplied by sign(p.x) to mirror normals smoothly
    vec3 normal = normalize(vec3(-dfdx * 0.06 * sign(p.x), 0.10 * cos(curtainY * 4.5), 1.0));

    // Simulated Spotlight Source
    vec3 lightPos = vec3(0.0, 1.4, 1.4);
    vec3 worldPos = vec3(p, 0.0);
    vec3 lightDir = normalize(lightPos - worldPos);
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    // Spotlight falloff
    float distToLight = length(lightPos - worldPos);
    float spot = smoothstep(3.0, 0.4, distToLight);

    // Harder light/shade transition using power on diffuse term
    float diff = pow(max(dot(normal, lightDir), 0.0), 1.6);
    
    // Hard spec highlight catch
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 40.0);
    
    // Rim lighting (sheen on perpendicular fold facets)
    float sheen = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.5) * 0.40;

    // HackX Theme Color Scheme (Royal electric purples, vibrant magentas, soft lavenders)
    vec3 shadowColor = vec3(0.04, 0.01, 0.09); // #0a0217 (Deep violet shadow)
    vec3 baseColor   = vec3(0.26, 0.00, 0.62); // #42009e (Royal electric purple)
    vec3 brightColor = vec3(0.47, 0.00, 1.00); // #7801ff (Vibrant electric purple)
    vec3 highlight   = vec3(0.82, 0.26, 0.84); // #d242d7 (Bright HackX magenta)
    vec3 sheenColor  = vec3(0.88, 0.88, 0.96); // #e1e1f5 (Silver/lavender sheen)

    // ULTRA SHARP FOLDS: Concentrates lighting highlights into distinct glowing tubes
    float foldNorm = pow(foldVal * 0.5 + 0.5, 2.5); // power 2.5 makes vertical light tubes!
    vec3 color = mix(shadowColor, baseColor, foldNorm);

    // Apply lighting and highlights
    color += brightColor * diff * 0.80 + highlight * spec * 0.52 + sheen * sheenColor * 0.45;
    
    // Ambient boost
    color += baseColor * 0.10;

    // Apply spotlight falloff
    color *= mix(0.50, 1.0, spot);

    // Soft neon magenta glowing border at the inner opening edge of the curtain
    float trimMask = smoothstep(0.08, 0.0, distToSplit);
    color = mix(color, highlight * (0.6 + 0.4 * diff + 0.85 * spec) + sheenColor * spec * 0.5, trimMask);

    // Edge shadows representing self-occlusion at the split cut
    float edgeShadow = smoothstep(0.0, 0.15, distToSplit);
    color *= edgeShadow;

    // Extremely low noise to maintain rigid curtain texture
    float tex = noise(vUv * 500.0) * 0.015;
    color += vec3(tex) * (0.2 + 0.8 * diff);

    // Global vignette
    float vignette = smoothstep(1.35, 0.45, length(vUv - 0.5));
    color *= mix(0.3, 1.0, vignette);

    // Ambient occlusion folds
    float bigFolds = sin(foldX_anim * 2.0) * 0.1 + 0.9;
    color *= bigFolds;

    // Combine split alpha and overall scroll-linked framing opacity (settles at 0.85 opacity)
    float alpha = splitAlpha * mix(1.0, 0.85, progress);

    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

export default function NetflixCurtainBackground({ scrollYProgress }: NetflixCurtainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const openUniformRef = useRef<number>(0.0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const openLocRef = useRef<WebGLUniformLocation | null>(null);

  // Translate scrollYProgress (0 to 1) into curtain open progress (0 to 1)
  // Curtain opens completely by scroll progress 0.35
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const progress = Math.min(latest / 0.35, 1.0);
    openUniformRef.current = progress;
    if (glRef.current && openLocRef.current) {
      glRef.current.uniform1f(openLocRef.current, progress);
    }
    if (containerRef.current) {
      containerRef.current.style.display = progress >= 0.95 ? "none" : "block";
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true });
    if (!gl) {
      console.error("WebGL not supported for NetflixCurtainBackground");
      return;
    }
    glRef.current = gl;

    // Enable standard alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "uTime");
    const resolutionLoc = gl.getUniformLocation(program, "uResolution");
    const openLoc = gl.getUniformLocation(program, "uOpen");
    openLocRef.current = openLoc;

    // Apply the initial uniform value
    gl.uniform1f(openLoc, openUniformRef.current);

    let animationFrameId: number;
    const startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.0);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const elapsedSeconds = (performance.now() - startTime) / 1000;
      gl.uniform1f(timeLoc, elapsedSeconds);
      gl.uniform1f(openLoc, openUniformRef.current);

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
      glRef.current = null;
      openLocRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* 1. Deep premium backdrop for when curtains open */}
      <div
        className="pointer-events-none absolute inset-0 bg-[#090416] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#280c52] via-[#090416] to-[#04020a]"
        style={{ zIndex: -2 }}
      />

      {/* 2. WebGL Canvas containing curtains */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ zIndex: -1 }}
      />
    </div>
  );
}
