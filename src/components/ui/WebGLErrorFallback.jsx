import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Fallback screen displayed when WebGL is unavailable or crashes.
 * Provides a clean 2D alternative presentation instead of a broken blank screen.
 */
export function WebGLErrorFallback({ error }) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="fallback-container">
      <div className="glass-panel fallback-card">
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <AlertTriangle className="fallback-icon" size={28} />
        </div>
        
        <h2 className="fallback-title">3D Acceleration Unavailable</h2>
        
        <p className="fallback-desc">
          {error || 'Your browser or device does not have WebGL enabled, or hardware acceleration is currently disabled. Please enable hardware acceleration in your browser settings to explore the 3D model.'}
        </p>

        <div style={{
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          width: '100%',
          textAlign: 'left',
          fontSize: '0.82rem',
          lineHeight: '1.6',
          color: '#cbd5e1'
        }}>
          <strong style={{ color: '#38bdf8' }}>Product Summary:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
            <li>Model: AEROCRON X-1 Horology</li>
            <li>Caliber: AC-920 Dual-Tourbillon</li>
            <li>Case Material: Grade 5 Titanium / Ceramic</li>
            <li>Water Resistance: 300M (30 ATM)</li>
          </ul>
        </div>

        <button 
          onClick={handleReload}
          className="btn-control interactive active"
          style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
        >
          <RefreshCw size={16} />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
}
