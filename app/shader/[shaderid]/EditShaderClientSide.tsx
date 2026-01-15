// components/ShaderClientLayout.tsx
'use client'

import dynamic from 'next/dynamic';
import { ShaderProvider } from '../../context/ShaderContext';
import { Canvas } from '@react-three/fiber';
import ShaderEditor from '../../components/ShaderEditor/ShaderEditor';
import { SessionProvider } from 'next-auth/react';
import { Shader } from '@/prisma/app/generated/prisma/client';
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { useRef, useState } from 'react';
import Image from "next/image";

type ShaderWithAuthor = Prisma.ShaderGetPayload<{
  include: { author: true }
}>;

const ShaderPlane = dynamic(() => import('../../components/ShaderRenderer/shaderPlane'), {
  ssr: false,
});





export default function ShaderClientLayout({shader}: {shader: ShaderWithAuthor}) {

  //const [isPaused, setIsPaused] = useState(false);
  const isPaused = useRef(true);

  const [pauseIcon, setPauseIcon] = useState('/assets/icons/pause-button.png')

  //update var names to make proper sense
  const togglePaused = () =>
  {
    
    if(isPaused.current === false)
      {
        isPaused.current = true;
        setPauseIcon('/assets/icons/pause-button.png')
      }

    else
      {
        isPaused.current = false;
        setPauseIcon('/assets/icons/play-button.png')
      }
  }

  return (
    <ShaderProvider>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>


        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '30px', width: '100%', maxWidth: '1400px', alignItems: 'flex-start'}}>
          <div style={{ width: '800px', height: '400px', border: '2px solid #333', borderRadius: '10px', position: 'sticky', top: 'calc(50vh - 200px)', backgroundColor: '#000', flexShrink: 0 }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ShaderPlane shaderCode={shader.shaderText} ignoreArgs={true} paused={true} hoverRef={isPaused} />
            </Canvas>
            
            <Image className='m-2' onClick={togglePaused} src={pauseIcon} width={24} height={24} alt='pause icon'></Image>
          </div>

          <SessionProvider>
            <div style={{flex: 1}}>
          <ShaderEditor shader={shader}/>
          </div>
          </SessionProvider>
        </div>
      </div>
    </ShaderProvider>
  );
}