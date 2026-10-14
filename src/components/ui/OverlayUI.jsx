import React from 'react';
import { RotateCw, Eye, Sparkles, Compass, ShieldCheck } from 'lucide-react';

export const COLOR_VARIANTS = [
  { id: 'titanium', name: 'Grade 5 Titanium', caseColor: '#94a3b8', dialColor: '#0f172a', accentColor: '#38bdf8', metalness: 0.9, roughness: 0.25 },
  { id: 'midnight', name: 'Midnight Obsidian', caseColor: '#1e293b', dialColor: '#020617', accentColor: '#06b6d4', metalness: 0.95, roughness: 0.15 },
  { id: 'gold', name: 'Rose Gold & Carbon', caseColor: '#d97706', dialColor: '#18181b', accentColor: '#f59e0b', metalness: 0.85, roughness: 0.28 },
];

export function OverlayUI({
  activeVariant,
  onVariantChange,
  isAutoRotate,
  onToggleAutoRotate,
  isExploded,
  onToggleExploded,
  onResetView,
}) {
  return (
    <div className="ui-layer">
      {/* Top Header */}
      <header className="header-bar interactive">
        <div className="brand-badge">
          <div className="brand-logo-gem">AC</div>
          <div>
            <div className="brand-title">Aerocron X-1</div>
            <div className="brand-subtitle">Haute Horlogerie 3D</div>
          </div>
        </div>

        <div className="glass-panel nav-pill">
          <span className="status-dot"></span>
          <span>GPU WebGL Ready</span>
        </div>
      </header>

      {/* Left Specs & Info */}
      <div className="hero-details">
        <span className="edition-tag">Production Prototype • Series 01</span>
        <h1 className="hero-title">Precision in Motion</h1>
        <p className="hero-desc">
          Crafted with an ultra-lightweight exoskeleton, floating escapement cage, and antireflective sapphire crystal. Experience the mechanical harmony in full 3D.
        </p>

        <div className="glass-panel specs-grid interactive">
          <div className="spec-item">
            <span className="spec-label">Caliber</span>
            <span className="spec-value">AC-920 Tourbillon</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Power Reserve</span>
            <span className="spec-value">72 Hours</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Water Resistance</span>
            <span className="spec-value">30 ATM (300M)</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Frequency</span>
            <span className="spec-value">28,800 vph</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <footer className="bottom-bar">
        {/* Material & Color Selector */}
        <div className="glass-panel controls-palette interactive">
          <span className="palette-label">Material Finish:</span>
          {COLOR_VARIANTS.map((v) => (
            <button
              key={v.id}
              className={`color-option ${activeVariant.id === v.id ? 'active' : ''}`}
              style={{ backgroundColor: v.caseColor }}
              title={v.name}
              onClick={() => onVariantChange(v)}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons interactive">
          <button
            className={`btn-control ${isAutoRotate ? 'active' : ''}`}
            onClick={onToggleAutoRotate}
            title="Toggle turntable auto-rotation"
          >
            <RotateCw size={15} />
            <span>{isAutoRotate ? 'Turntable Active' : 'Turntable Off'}</span>
          </button>

          <button
            className={`btn-control ${isExploded ? 'active' : ''}`}
            onClick={onToggleExploded}
            title="Inspect internal layers & movement"
          >
            <Eye size={15} />
            <span>{isExploded ? 'Exploded View' : 'Inspect Layers'}</span>
          </button>

          <button
            className="btn-control"
            onClick={onResetView}
            title="Recenter camera"
          >
            <Compass size={15} />
            <span>Reset Cam</span>
          </button>
        </div>

        {/* Interaction hints */}
        <div className="glass-panel instructions-pill">
          <span>Drag to Rotate • Scroll to Zoom • Right Click to Pan</span>
        </div>
      </footer>
    </div>
  );
}
