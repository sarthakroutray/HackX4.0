// src/app/test-shader/page.tsx
"use client";

import CircularNebulaShader from "@/components/CircularNebulaShader/CircularNebulaShader";

export default function TestShaderPage() {
  return (
    <main className="relative min-h-screen w-full bg-transparent overflow-hidden">
      <CircularNebulaShader />
    </main>
  );
}
