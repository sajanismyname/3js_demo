import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the client device/browser supports WebGL.
 * Returns { isSupported: boolean, error: string | null }
 */
export function useWebGLSupport() {
  const [supportState, setSupportState] = useState({
    isSupported: true,
    error: null,
  });

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');

      if (!gl) {
        setSupportState({
          isSupported: false,
          error: 'WebGL is not supported or hardware acceleration is disabled in your browser settings.',
        });
      } else {
        setSupportState({ isSupported: true, error: null });
      }
    } catch (e) {
      setSupportState({
        isSupported: false,
        error: e.message || 'Failed to initialize WebGL context.',
      });
    }
  }, []);

  return supportState;
}
