// components/ShaderPlane.tsx
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, Color } from 'three';
import { useShaderContext } from '../context/ShaderContext';
import { useEffect } from 'react';

// Import the raw GLSL code
 

function ShaderPlane() {
  let shaderCode = `
// A fragment shader for a simple animated effect
uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Normalize UV coordinates to the 0-1 range
  vec2 uv = vUv;

  // Simple wave effect using sine of time and position
  float wave = sin(uv.x * 20.0 + uTime * 2.0) * 0.1 + 0.1;

  // Use the wave effect to perturb the color
  vec3 color = mix(uColor, vec3(0.0, 0.0, 1.0), wave * 5.0); // Blend with blue

  // Final color output
  gl_FragColor = vec4(color, 1.0);
}`;

  const { shaderText } = useShaderContext();
  
  if(shaderText)
    {
      console.log(shaderText);
      shaderCode = shaderText;
    }

  const materialRef = useRef<ShaderMaterial>(null!);

  // Define the uniform values for the shader
  // useMemo ensures this object is only created once
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uColor: { value: new Color(0.8, 0.2, 0.5) }, // A purplish-pink base color
      //create a uResolution here as well
      //also remove uColor eventually
    }),
    []
  );

  useEffect(() => {
    if (materialRef.current && shaderText) {
      // 3. Update the material's fragment shader source
      materialRef.current.fragmentShader = shaderText; 
      
      // 4. IMPORTANT: Flag the material for recompilation
      materialRef.current.needsUpdate = true; 
    }
  }, [shaderText]); // Rerun this effect every time shaderText changes

  // Update the uniform uTime on every frame
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    // <mesh> with PlaneGeometry sized to cover the view (adjust 'args' as needed)
    // We use a large plane and position the camera away from it for full coverage.
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[10, 10]} /> 
      {/* The <shaderMaterial> loads the GLSL code and uniforms.
        Note: The properties must match the Three.js ShaderMaterial keys.
      */}
      <shaderMaterial
        ref={materialRef}
        fragmentShader={shaderText || "void main() { gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0); }"}
        vertexShader={`// A simple vertex shader
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`}
        uniforms={uniforms}
        // This is a TSX shortcut for new THREE.ShaderMaterial({...})
      />
    </mesh>
  );
}

export default ShaderPlane;