"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const FragmentShader = `
uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;
varying float vElevation;

void main() {
  // Distort the UV coordinates based on elevation to simulate the image printed on the fabric
  vec2 distortedUv = vUv;
  distortedUv.y -= (vElevation * 0.15);
  distortedUv.x -= (vElevation * 0.15);
  
  // Sample the texture
  vec4 texColor = texture2D(uTexture, distortedUv);
  
  // Add luxury sheen based on the peaks of the fabric folds
  float sheen = smoothstep(-0.2, 0.4, vElevation) * 0.4;
  vec3 finalColor = mix(texColor.rgb, vec3(1.0, 0.95, 0.8), sheen * 0.3); // slight gold sheen
  
  // Darken the valleys for realistic shadows
  float shadow = smoothstep(0.2, -0.4, vElevation) * 0.5;
  finalColor = mix(finalColor, vec3(0.0), shadow);
  
  // Apply a subtle vignette to blend the edges into the dark theme
  float distToCenter = distance(vUv, vec2(0.5));
  float vignette = smoothstep(0.8, 0.3, distToCenter);
  finalColor *= vignette;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const VertexShader = `
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  // Create a flowing fabric effect using sine waves
  float elevation = sin(modelPosition.x * 1.5 - uTime * 0.8) * 0.15;
  elevation += sin(modelPosition.y * 1.0 - uTime * 0.4) * 0.15;
  
  // Subtle interactive ripple based on mouse distance
  float dist = distance(uMouse, vec2(vUv.x, vUv.y));
  float ripple = sin(dist * 15.0 - uTime * 3.0) * 0.1;
  ripple *= smoothstep(0.4, 0.0, dist);
  
  elevation += ripple;
  
  modelPosition.z += elevation;
  vElevation = elevation;
  
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;
}
`;

const FabricMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Load the hero image to use as the fabric texture
  const texture = useTexture("/images/hero-image.jpg");
  texture.wrapS = THREE.MirroredRepeatWrapping;
  texture.wrapT = THREE.MirroredRepeatWrapping;
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTexture: { value: texture }
    }),
    [texture]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Convert mouse coordinates (-1 to 1) to UV coordinates (0 to 1)
      const targetX = (state.pointer.x * 0.5) + 0.5;
      const targetY = (state.pointer.y * 0.5) + 0.5;
      
      // Smoothly interpolate mouse position for a fluid feeling
      materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.05;
      materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]} scale={[1.2, 1.2, 1.0]}>
      {/* High segment count for smooth fabric deformation */}
      <planeGeometry args={[7, 5, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={FragmentShader}
        vertexShader={VertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};

export default function HeroFabric() {
  return (
    <div className="absolute inset-0 z-0 bg-onyx pointer-events-auto opacity-70">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <FabricMesh />
      </Canvas>
    </div>
  );
}
