import React from 'react';
import { ContactShadows } from '@react-three/drei';

/**
 * Pedestal and Ground Shadow Setup:
 * Uses ContactShadows for performant, blurred contact ambient occlusion shadows.
 * Includes a subtle floor grid / disc for spatial orientation.
 */
export function Pedestal() {
  return (
    <group position={[0, -1.2, 0]}>
      {/* High-fidelity ground contact shadow */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.65}
        scale={8}
        blur={2.4}
        far={3.5}
        color="#020617"
      />

      {/* Modern minimal exhibition stage ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[1.6, 1.62, 64]} />
        <meshBasicMaterial color="#38bdf8" opacity={0.3} transparent />
      </mesh>

      {/* Subtle outer platform ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[2.4, 2.41, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.08} transparent />
      </mesh>
    </group>
  );
}
