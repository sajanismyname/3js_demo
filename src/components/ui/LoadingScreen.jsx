import React from 'react';
import { useProgress } from '@react-three/drei';

/**
 * 2D Loading screen overlay using Drei's useProgress hook.
 * Fades out automatically when assets reach 100%.
 */
export function LoadingScreen() {
  const { progress, active } = useProgress();

  if (!active && progress === 100) return null;

  return (
    <div className="loading-overlay" style={{ opacity: active ? 1 : 0, pointerEvents: active ? 'auto' : 'none' }}>
      <div className="spinner"></div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <p className="loading-text">Calibrating Shaders & Textures...</p>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#ffffff'
        }}>
          {Math.round(progress)}%
        </span>
      </div>
      <div style={{
        width: '200px',
        height: '3px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '999px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}
