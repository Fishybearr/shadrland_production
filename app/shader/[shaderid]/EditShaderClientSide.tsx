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


        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '30px', width: '100%', maxWidth: '1400px', alignItems: 'flex-start'}}>
          <div style={{ width: '800px', height: '400px', border: '2px solid #333', borderRadius: '10px', position: 'sticky', top: 'calc(50vh - 200px)', backgroundColor: '#000', flexShrink: 0 }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ShaderPlane shaderCode={shader.shaderText} ignoreArgs={true} />
            </Canvas>
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