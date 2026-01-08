'use client';

import React, { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Mesh } from 'three';

// This component represents the cube in the scene
function Box(props: React.JSX.IntrinsicElements['mesh']) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef<Mesh>(null!);

  // Set up state for the hovered and active state
  const [hovered, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  // Subscribe this component to the render loop
  // 'useFrame' executes code on every frame before it's rendered
  useFrame((state, delta) => (meshRef.current.rotation.x += delta));

  // Return the view, these are Three.js elements rendered by fiber
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={(event: ThreeEvent<MouseEvent>) => setActive(!active)}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => setHover(true)}
      onPointerOut={(event: ThreeEvent<PointerEvent>) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

// This is the main scene component that holds the <Canvas>
export default function Scene() {
  return (

    <> 
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      
      {/* Lights are now children of the fragment */}
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
    </>
  );
}