import React from 'react';
import { Environment } from '@react-three/drei';

/**
 * Production Lighting Setup:
 * 1. Ambient Light: Balanced baseline illumination to avoid total black shadows.
 * 2. Key Directional Light: High-quality soft shadows with tuned bias and frustum bounds.
 * 3. Rim / Accent Light: Cool rim highlight to silhouette metallic bevels and glass edges.
 * 4. Drei Environment: HDR environment lighting for physically accurate specular reflections.
 */
export function Lighting() {
  return (
    <>
      {/* Base ambient illumination */}
      <ambientLight intensity={0.45} color="#dbeafe" />

      {/* Key directional light with high-fidelity soft shadows */}
      <directionalLight
        position={[6, 9, 6]}
        intensity={1.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.00015}
      />

      {/* Rim light for edge specular highlights */}
      <directionalLight
        position={[-6, 4, -5]}
        intensity={1.2}
        color="#38bdf8"
      />

      {/* Subtle warm under-bounce fill */}
      <pointLight
        position={[0, -2, 2]}
        intensity={0.6}
        color="#fef08a"
        distance={8}
      />

      {/* Realistic HDR environment map for metallic and glass reflections */}
      <Environment preset="city" environmentIntensity={0.8} />
    </>
  );
}
