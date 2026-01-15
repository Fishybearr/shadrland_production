// components/ShaderClientLayout.tsx
'use client'

import dynamic from 'next/dynamic';
import { ShaderProvider } from '../context/ShaderContext';
import { Canvas } from '@react-three/fiber';
import ShaderEditor from '../components/ShaderCreator/ShaderEditor';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';

const ShaderPlane = dynamic(() => import('../components/ShaderRenderer/shaderPlane'), {
  ssr: false,
});

export default function ShaderClientLayout() {

  const [isPaused, setIsPaused] = useState(false);
  
  const [pauseIcon, setPauseIcon] = useState('/assets/icons/pause-button.png')
  
  const togglePaused = () =>
    {
      
      if(isPaused)
        {
          setIsPaused(false);
          setPauseIcon('/assets/icons/pause-button.png')
        }
  
      else
        {
          setIsPaused(true);
          setPauseIcon('/assets/icons/play-button.png')
        }
    }

  return (
    <ShaderProvider>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        {/*<h1>Shader Preview</h1>*/}
        
        {/* 1. This wrapper must have an align-items: flex-start to allow sticking */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'center', 
          gap: '30px',
          width: '100%',
          maxWidth: '1400px',
          alignItems: 'flex-start' // Critical: allows children to slide
        }}>
          
          {/* 2. The Sticky Container */}
          <div style={{ 
            width: '800px', 
            height: '400px', 
            border: '2px solid #333', 
            borderRadius: '10px',
            position: 'sticky',      // The Magic
            top: 'calc(50vh - 200px)', // Centers it vertically (50% height - half of container height)
            backgroundColor: '#000',
            flexShrink: 0,
          }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ShaderPlane shaderCode='' ignoreArgs={true} paused={isPaused} />
            </Canvas>

            <Image className='m-2' onClick={togglePaused} src={pauseIcon} width={24} height={24} alt='pause icon'></Image>
          </div>

          <SessionProvider>
            <div style={{ flex: 1}}>
              <ShaderEditor />
            </div>
          </SessionProvider>
        </div>
      </div>
    </ShaderProvider>
  );
}