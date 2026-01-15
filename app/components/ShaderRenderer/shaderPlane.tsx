// components/ShaderPlane.tsx
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ShaderMaterial, Color, Clock, Vector2,Vector4 } from 'three';
import { useShaderContext } from '../../context/ShaderContext';
import { useEffect } from 'react';

interface shaderPlaneParams
{
  shaderCode: string,
  ignoreArgs: boolean
  paused: boolean
}

function ShaderPlane(params: shaderPlaneParams) {

  const { shaderText } = useShaderContext();

  const materialRef = useRef<ShaderMaterial>(null!);

  const { clock } = useThree();

  // 1. Get the size of the specific card/viewport
  const { size } = useThree()

  //String to hold source from user
  const rawSource = shaderText || params.shaderCode;

  //the new time var
  const timeRef = useRef(0);

  //This is the wrapper that I need to figure out
  //Making this work will fix all of the reslution issues
  //However, writing glsl will be more like shadertoy now
  // eg. mainImage(out vec4 fragColor, out vec)

  /*
   const wrappedFragShader = `uniform float uTime;
   uniform vec2 uResolution;
   varying vec2 vUv;

   #define iTime uTime
   #define iResolution vec3(uResolution, 1.0)

   //This is where we need to sub in another sample shader
   //for the OR
   ${shaderText || "test"}

   void main()
   {
    vec2 localFragCoord = vUv * uResolution;
    mainImage(gl_FragColor,localFragCoord);
   }
   `
   */

   const finalFragment = useMemo(() => {
    // If we have no code, show our 4 corner gradient
    if (!rawSource) {
      return `varying vec2 vUv;varying vec3 vPosition;void main(){vec2 uv=vUv;vec3 colorTL=vec3(0.9,0.1,0.5);vec3 colorTR=vec3(0.1,0.8,0.3);vec3 colorBL=vec3(0.0,0.5,0.9);vec3 colorBR=vec3(0.9,0.9,0.1);float blendX_L=1.0-uv.x;float blendX_R=uv.x;float blendY_B=1.0-uv.y;float blendY_T=uv.y;vec3 topColor=mix(colorTL,colorTR,blendX_R);vec3 bottomColor=mix(colorBL,colorBR,blendX_R);vec3 finalColor=mix(bottomColor,topColor,blendY_T);gl_FragColor=vec4(finalColor,1.0);}`;
    }

    return `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform vec4 uDate;

      #define iTime uTime
      #define iResolution vec3(uResolution, 1.0)
      #define iDate uDate

      ${rawSource}

      void main() {
        // We use vUv to generate local coordinates so scrolling doesn't distort
        vec2 localFragCoord = vUv * uResolution;
        mainImage(gl_FragColor, localFragCoord);
      }
    `;
  }, [rawSource]);

  // Define the uniform values for the shader
  // useMemo ensures this object is only created once
  //TODO: make sure that this resolution is same as in create shader
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
      uResolution: {value: new Vector2(size.width, size.height)},
      uDate: {value: new Vector4()}
    }),
    []
  );

  //reset time when we update the shader
  useEffect(() => {
    timeRef.current = 0;
  }, [rawSource]);

  //reset the shader when we pause
  useEffect(() => {
    if(params.paused)
      {
        timeRef.current = 0;
      }
  })

  // Update loop
  useFrame((state, delta) => {
    if (materialRef.current) {
      // 2. Only increment time if NOT paused
      if (!params.paused) {
        timeRef.current += delta;

        const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const secToMid = (now.getTime() - midnight.getTime()) / 1000;
      
      materialRef.current.uniforms.uDate.value.set(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        secToMid
      );
      }

      // 3. Set uTime to our manual accumulator instead of clock.getElapsedTime()
      materialRef.current.uniforms.uTime.value = timeRef.current;

      // Update resolution
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);

      // Update Date (only do this if not paused to save minor CPU cycles, 
      // or keep it outside if you want iDate to be real-time)
      
    }
  });

  return (
    // <mesh> with PlaneGeometry sized to cover the view (adjust 'args' as needed)
    // We use a large plane and position the camera away from it for full coverage.
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} /> {/*Standard scale for rendering*/}
      {/* The <shaderMaterial> loads the GLSL code and uniforms.
        Note: The properties must match the Three.js ShaderMaterial keys.
      */}

      {/*This is our shader material that holds our entire wrapped fragment shader*/}
      <shaderMaterial
        ref={materialRef}
        key={rawSource?.valueOf()}
        fragmentShader={finalFragment || "varying vec2 vUv;varying vec3 vPosition;void main(){vec2 uv=vUv;vec3 colorTL=vec3(0.9,0.1,0.5);vec3 colorTR=vec3(0.1,0.8,0.3);vec3 colorBL=vec3(0.0,0.5,0.9);vec3 colorBR=vec3(0.9,0.9,0.1);float blendX_L=1.0-uv.x;float blendX_R=uv.x;float blendY_B=1.0-uv.y;float blendY_T=uv.y;vec3 topColor=mix(colorTL,colorTR,blendX_R);vec3 bottomColor=mix(colorBL,colorBR,blendX_R);vec3 finalColor=mix(bottomColor,topColor,blendY_T);gl_FragColor=vec4(finalColor,1.0);}"}
        vertexShader={`varying vec2 vUv; varying vec3 vPosition; void main() { vUv = uv; vPosition = position; gl_Position = vec4(position.xy, 0.0, 1.0);}`}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default ShaderPlane;