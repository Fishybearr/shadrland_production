"use client";

import { View } from "@react-three/drei";
import { Shader } from "@/prisma/app/generated/prisma/client";
import ShaderPlane from "../ShaderRenderer/shaderPlane"; // Your GLSL rendering component
import { useRouter } from 'next/navigation'
import { useRef, useState } from "react";

import { Prisma } from "@/prisma/app/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";

type ShaderWithAuthor = Prisma.ShaderGetPayload<{
  include: { author: true }
}>;

export default function ShaderCard({ shader }: { shader: ShaderWithAuthor }) {

  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null); // 1. Create a ref

  const [likeIcon, setLikeIcon] = useState('/assets/icons/LikeEmpty.png');

  const handleEditClick = () => 
        {
            router.push(`/shader/${shader.id}`)
        }

  //const [mouseHovered, setMouseHovered] = useState(false)

  const isHovered = useRef(false);

  
  //TODO: using setLikeIcon is refreshing the whole page which we
  // don't want
  //Also nned to implement the actual liking functionality
  const handleLike = () => 
    {
      setLikeIcon('/assets/icons/LikeFull.png');
      console.log("Liked Shader");
    }

  return (
    <div className="group flex flex-col bg-neutral-900 rounded-b-xl overflow-hidden border border-neutral-800 hover:border-blue-500 transition-colors">
      {/* 3D Viewport Area */}
      <div ref={trackRef} onClick={handleEditClick} className="relative w-full aspect-2/1 bg-black"
      onMouseEnter={() => {isHovered.current = true;}} 
      onMouseLeave={() => {isHovered.current = false;}}>
        <View track={trackRef as React.RefObject<HTMLElement>} className="absolute inset-0">
          {/*<ShaderPlane shaderCode={shader.shaderText} />*/}
          <ShaderPlane shaderCode={shader.shaderText} ignoreArgs={false} paused={true} hoverRef={isHovered}/>
          <perspectiveCamera position={[0, 0, 1]} />
        </View>
      </div>

      {/* Info Area */}
      <div className="p-4 z-10 bg-neutral-900">
        <h3 className="text-lg font-medium text-white truncate">{shader.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            <Link href={`/profile/${shader.author.name}`}>{shader.author.name}</Link> | {new Date(shader.createdAt).toLocaleDateString()}
          </span>
          { /*<button className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white" onClick={handleEditClick}>
            Open Editor
          </button> */}

          <Image onClick={handleLike} src={likeIcon} alt='heart icon' width={24} height={24}></Image>
          {/*<button onClick={handleLike} className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white">Like</button>*/}
        </div>
      </div>
    </div>
  );
}