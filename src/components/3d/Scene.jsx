import React from 'react';
import { Lighting } from './Lighting';
import { CameraRig } from './CameraRig';
import { Pedestal } from './Pedestal';
import { ProductWatch } from './ProductWatch';

/**
 * Scene Orchestration Component:
 * Composes all 3D subsystems: Lighting, Camera Rig, Pedestal/Shadows, and Product Model.
 */
export function Scene({
  variant,
  isAutoRotate,
  isExploded,
  controlsRef,
}) {
  return (
    <>
      {/* Dynamic Cinematic Camera & OrbitControls */}
      <CameraRig
        isAutoRotate={isAutoRotate}
        controlsRef={controlsRef}
      />

      {/* 3-Point Lighting, Shadow Key Light & HDR Reflections */}
      <Lighting />

      {/* Visual Pedestal & Ground Contact AO Shadows */}
      <Pedestal />

      {/* Main Interactive 3D Product */}
      <ProductWatch
        variant={variant}
        isExploded={isExploded}
        position={[0, 0, 0]}
        rotation={[0.3, -0.4, 0.1]}
      />
    </>
  );
}
