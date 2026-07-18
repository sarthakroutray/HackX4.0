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

  // Simple 2D hash for the very subtle film grain.
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Value noise function
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Hermite interpolation (smoothstep)
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // Fractional Brownian Motion (4 octaves)
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce grid axis artifacts
    mat2 rot = mat2(0.8776, 0.4794, -0.4794, 0.8776);
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Work in aspect-corrected coordinates so the moving light stays circular
    // on every viewport.
    vec2 uv = vUv - 0.5;
    float aspect = uResolution.x / uResolution.y;
    uv.x *= aspect;

    // Keep the existing black field and purple palette; only the left light's
    // motion treatment changes.
    vec3 finalColor = vec3(0.0);
    vec3 glowColor = vec3(0.55, 0.22, 0.90);

    // The emitter travels just outside the left edge. Instead of one blurred
    // blob, draw its recent positions along the same circular path.
    float orbitRadius = aspect * 0.5 + 0.15;
    float orbitSpeed = 0.5;
    float phase = uTime * orbitSpeed;
    vec2 orbitCenter = vec2(0.2, 0.0);
    float trailGlow = 0.0;

    // Dense sampling makes the wake a continuous ribbon when the orbit crosses
    // the viewport edge. Normalize each sample so the total brightness stays
    // consistent with the previous 22-sample trail.
    for (int i = 0; i < 42; i++) {
      float index = float(i);
      float age = index / 41.0;
      // The tail samples further apart as it ages, giving it a natural fade
      // instead of a stack of visible circular stamps.
      float trailPhase = phase - age * 2.85;
      vec2 trailPoint = orbitCenter + vec2(cos(trailPhase), -sin(trailPhase)) * orbitRadius;
      vec2 toTrail = uv - trailPoint;

      // Broad, vertically feathered ellipses create the soft edge bloom.
      float horizontalCompression = mix(3.9, 1.45, age);
      float verticalStretch = mix(1.60, 0.42, age);
      vec2 ellipse = vec2(toTrail.x * horizontalCompression, toTrail.y * verticalStretch);
      float width = mix(44.0, 5.0, age);
      float fade = exp(-age * 1.65) * mix(0.78, 0.07, age) * 0.52;
      trailGlow += exp(-dot(ellipse, ellipse) * width) * fade;
    }

    // A restrained broad bloom joins the individual trail samples together.
    vec2 head = orbitCenter + vec2(cos(phase), -sin(phase)) * orbitRadius;
    vec2 headOffset = uv - head;
    headOffset.x *= 3.45;
    headOffset.y *= 1.30;
    float atmosphericBloom = exp(-dot(headOffset, headOffset) * 10.0) * 0.18;
    float light = min(trailGlow * 0.30 + atmosphericBloom, 1.0);
    // Intensity only: preserve the point and trail's current geometry.
    finalColor += glowColor * light * 1.85;

    // Original pulsating nebula on the right.
    vec2 nebulaCenter = vec2(aspect * 0.5 + 0.07, 0.0);
    nebulaCenter.x += sin(uTime * 0.2) * 0.04;
    nebulaCenter.y += cos(uTime * 0.3) * 0.04;
    float pulse = sin(uTime * 0.75) * 0.5 + 0.5;
    vec2 noisyUv = uv * 1.5;
    noisyUv.x -= uTime * 0.03;
    noisyUv.y += uTime * 0.02;
    float n1 = fbm(noisyUv + uTime * 0.02);
    float n2 = fbm(noisyUv * 2.0 - vec2(uTime * 0.04, uTime * 0.01));
    float gasNoise = mix(n1, n2, 0.5);
    vec2 toNebula = uv - nebulaCenter;
    toNebula.x *= 2.0;
    float baseRadius = mix(0.05, 0.15, pulse);
    float distToNebula = length(toNebula) - gasNoise * (0.09 + pulse * 0.07);
    float outerGlow = exp(-max(distToNebula - baseRadius, 0.0) * 5.0) * mix(0.22, 0.50, pulse);
    float coreRadius = mix(0.012, 0.04, pulse);
    float innerGlow = exp(-max(length(toNebula) - coreRadius - gasNoise * 0.045, 0.0) * 11.0) * mix(0.12, 0.35, pulse);
    // Intensity only: preserve the existing nebula radius and falloff.
    finalColor += glowColor * (outerGlow + innerGlow) * 1.05;

    float grain = (fract(sin(dot(vUv + uTime * 0.005, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.022;
    finalColor += vec3(grain);

    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
  }
`;

export default function CircularNebulaShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: true });
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
      const dpr = Math.min(window.devicePixelRatio || 1, 1.0); // Capped for performance
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      gl.viewport(0, 0, canvas.width, canvas.height);
      if (resolutionLoc) {
        gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      }
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const elapsedSeconds = (performance.now() - startTime) / 1000;
      if (timeLoc) {
        gl.uniform1f(timeLoc, elapsedSeconds);
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
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
      {/* 1. Transparent WebGL Canvas covering the background */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 w-full h-full"
        style={{ zIndex: -15 }}
      />

      {/* 2. Backdrop Atmospheric Blur for depth */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -12,
          backdropFilter: "blur(6px) saturate(1.1) contrast(1.02)",
          WebkitBackdropFilter: "blur(6px) saturate(1.1) contrast(1.02)",
        }}
      />

      {/* 3. High-Fidelity Monochrome Film Grain SVG Overlay */}
      <svg
        className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.06]"
        style={{ zIndex: -10 }}
      >
        <filter id="neutralNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="1"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#neutralNoise)" />
      </svg>
    </>
  );
}
