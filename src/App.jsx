import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/3d/Scene';
import { OverlayUI, COLOR_VARIANTS } from './components/ui/OverlayUI';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { WebGLErrorFallback } from './components/ui/WebGLErrorFallback';
import { useWebGLSupport } from './hooks/useWebGLSupport';

/**
 * Main Application Component:
 * - Performs hardware WebGL capability check with graceful 2D fallback.
 * - Houses the R3F Canvas configured with performance safeguards (DPR clamp, high-performance power preference, soft shadows).
 * - Implements a React Suspense boundary with smooth 2D loading screen.
 * - Controls reactive state for variant finishes, auto-rotation turntable, and exploded inspection view.
 */
export default function App() {
  const { isSupported, error: webglError } = useWebGLSupport();
  const [activeVariant, setActiveVariant] = useState(COLOR_VARIANTS[0]);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const controlsRef = useRef();

  // Reset OrbitControls camera angle and target back to primary vantage point
  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Hardware/Browser WebGL Fallback Protection
  if (!isSupported) {
    return <WebGLErrorFallback error={webglError} />;
  }

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 2D Loading Screen (Connected to Drei's useProgress) */}
      <LoadingScreen />

      {/* 2D Glassmorphic HUD & Controls Overlay */}
      <OverlayUI
        activeVariant={activeVariant}
        onVariantChange={setActiveVariant}
        isAutoRotate={isAutoRotate}
        onToggleAutoRotate={() => setIsAutoRotate((prev) => !prev)}
        isExploded={isExploded}
        onToggleExploded={() => setIsExploded((prev) => !prev)}
        onResetView={handleResetView}
      />

      {/* 3D WebGL Canvas Viewport */}
      <div className="canvas-wrapper">
        <Canvas
          shadows
          // Clamps device pixel ratio between 1 and 2 to protect against GPU thermal throttling on 4K/Retina displays
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#0a0b0e');
          }}
        >
          <Suspense fallback={null}>
            <Scene
              variant={activeVariant}
              isAutoRotate={isAutoRotate}
              isExploded={isExploded}
              controlsRef={controlsRef}
            />
          </Suspense>
        </Canvas>
      </div>
    </main>
  );
}
