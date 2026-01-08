// components/ShaderClientLayout.tsx
'use client'

import dynamic from 'next/dynamic';
import { ShaderProvider } from '../context/ShaderContext';
import { Canvas } from '@react-three/fiber';
import ShaderEditor from '../components/ShaderCreator/ShaderEditor';
import { SessionProvider } from 'next-auth/react';

const ShaderPlane = dynamic(() => import('../components/ShaderRenderer/shaderPlane'), {
  ssr: false,
});

export default function ShaderClientLayout() {
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
              <ShaderPlane shaderCode='' ignoreArgs={true} />
            </Canvas>
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