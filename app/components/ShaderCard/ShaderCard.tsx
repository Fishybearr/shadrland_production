"use client";

import { View } from "@react-three/drei";
import { Shader } from "@/prisma/app/generated/prisma/client";
import ShaderPlane from "../ShaderRenderer/shaderPlane"; // Your GLSL rendering component
import { useRouter } from 'next/navigation'
import { useRef } from "react";

export default function ShaderCard({ shader }: { shader: Shader }) {

  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null); // 1. Create a ref

  const handleEditClick = () => 
        {
            router.push(`/shader/${shader.id}`)
        }

  const handleLike = () => 
    {
      console.log("Liked Shader");
    }


  return (
    <div className="group flex flex-col bg-neutral-900 rounded-b-xl overflow-hidden border border-neutral-800 hover:border-blue-500 transition-colors">
      {/* 3D Viewport Area */}
      <div ref={trackRef} onClick={handleEditClick} className="relative w-full aspect-2/1 bg-black">
        <View track={trackRef as React.RefObject<HTMLElement>} className="absolute inset-0">
          {/*<ShaderPlane shaderCode={shader.shaderText} />*/}
          <ShaderPlane shaderCode={shader.shaderText} ignoreArgs={false}/>
          <perspectiveCamera position={[0, 0, 1]} />
        </View>
      </div>

      {/* Info Area */}
      <div className="p-4 z-10 bg-neutral-900">
        <h3 className="text-lg font-medium text-white truncate">{shader.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {new Date(shader.createdAt).toLocaleDateString()}
          </span>
          { /*<button className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white" onClick={handleEditClick}>
            Open Editor
          </button> */}
          <button onClick={handleLike} className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">Like</button>
        </div>
      </div>
    </div>
  );
}