import React, { useRef, useEffect } from 'react';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CameraRig Component:
 * - Declarative PerspectiveCamera with calibrated FOV and cinematic vantage point.
 * - OrbitControls configured with inertia damping, zoom clamps, and polar constraints.
 * - Smooth auto-rotation or floating parallax when active.
 */
export function CameraRig({ isAutoRotate, controlsRef }) {
  const cameraRef = useRef();

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0.8, 4.2]}
        fov={42}
        near={0.1}
        far={100}
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        autoRotate={isAutoRotate}
        autoRotateSpeed={1.2}
        minDistance={2.2}
        maxDistance={7.5}
        maxPolarAngle={Math.PI / 2 + 0.08} // Prevent viewing under the floor
        minPolarAngle={0.1} // Prevent gimbal lock at top pole
        target={[0, 0, 0]}
      />
    </>
  );
}
