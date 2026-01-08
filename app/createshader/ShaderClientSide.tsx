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
        <h1>Shader Preview</h1>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '30px' }}>
          <div style={{ width: '800px', height: '400px', border: '2px solid #333', borderRadius: '10px' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ShaderPlane shaderCode='' ignoreArgs={true} />
            </Canvas>
          </div>
          <SessionProvider>
          <ShaderEditor />
          </SessionProvider>
        </div>
      </div>
    </ShaderProvider>
  );
}