/**
 * TweaksPanel.tsx — floating "Tweaks" controls: accent swatch, density, grain.
 * Fully functional; all state is lifted to AdminScreen and applied to the
 * `.vx-admin` root (accent via CSS var, density via class, grain via class).
 */
import React, { useState } from 'react';
import { Icon } from '../shared/Icons';

const SWATCHES = ['#0E7C66', '#0A7A8F', '#5C6BC0', '#2A7A4B'];

export const TweaksPanel: React.FC<{
  accent: string;
  onAccent: (c: string) => void;
  density: 'cozy' | 'compact';
  onDensity: (d: 'cozy' | 'compact') => void;
  grain: boolean;
  onGrain: (g: boolean) => void;
}> = ({ accent, onAccent, density, onDensity, grain, onGrain }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="tweaks-toggle"
        title="Tweaks"
        aria-label="Tweaks"
        onClick={() => setOpen(o => !o)}
      >
        <Icon.Sliders size={16} />
      </button>

      {open && (
        <div className="tweaks open">
          <h4>Tweaks</h4>
          <div className="row">
            <label>Accent</label>
            {SWATCHES.map(c => (
              <div
                key={c}
                className={`swatch ${accent === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => onAccent(c)}
                role="button"
                aria-label={`Accent ${c}`}
              />
            ))}
          </div>
          <div className="row">
            <label>Row density</label>
            <select
              value={density}
              onChange={e => onDensity(e.target.value as 'cozy' | 'compact')}
              style={{ background: '#262C2B', color: '#FAFAF7', border: '1px solid #454C4B', borderRadius: 5, padding: '3px 6px', fontFamily: 'inherit', fontSize: 11.5 }}
            >
              <option value="cozy">Cozy</option>
              <option value="compact">Compact</option>
            </select>
          </div>
          <div className="row">
            <label>Show grain</label>
            <input type="checkbox" checked={grain} onChange={e => onGrain(e.target.checked)} />
          </div>
        </div>
      )}
    </>
  );
};
