// components/ShaderClientLayout.tsx
'use client'

import dynamic from 'next/dynamic';
import { ShaderProvider } from '../../context/ShaderContext';
import { Canvas } from '@react-three/fiber';
import ShaderEditor from '../../components/ShaderEditor/ShaderEditor';
import { SessionProvider } from 'next-auth/react';
import { Shader } from '@/prisma/app/generated/prisma/client';

const ShaderPlane = dynamic(() => import('../../components/ShaderRenderer/shaderPlane'), {
  ssr: false,
});

export default function ShaderClientLayout({shader}: {shader: Shader}) {
  return (
    <ShaderProvider>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '30px' }}>
          <div style={{ width: '800px', height: '400px', border: '2px solid #333', borderRadius: '10px' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ShaderPlane shaderCode={shader.shaderText} ignoreArgs={true} />
            </Canvas>
          </div>
          <SessionProvider>
          <ShaderEditor shader={shader}/>
          </SessionProvider>
        </div>
      </div>
    </ShaderProvider>
  );
}