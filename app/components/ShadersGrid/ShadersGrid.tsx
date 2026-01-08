"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { Shader } from "@/prisma/app/generated/prisma/client";
import ShaderCard from "../ShaderCard/ShaderCard";

export default function ShadersGrid({ shaders }: { shaders: Shader[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  //TODO Make sure private shaders are only rendered for owners
  return (
    <div ref={containerRef} className="relative w-full">
      {/* 1. The HTML Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shaders.map((shader) => (
         <ShaderCard key={shader.id} shader={shader} />
        ))}
      </div>

      {/* 2. The Single Global Canvas (Fixed Background) */}
      <Canvas
      style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
  }}
  // 'frames: Infinity' ensures the canvas doesn't "sleep" when you scroll
  frameloop="always"
  dpr={[1, 2]}
        
        //eventSource={containerRef as React.RefObject<HTMLElement>}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        
      >
        <View.Port />
      </Canvas>
    </div>
  );
}