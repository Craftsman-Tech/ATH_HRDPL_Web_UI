// ============================================================================
//  MultiSelect.tsx — reusable multi-select with filterable, searchable panel
// ============================================================================
//  Selected values render as chips INSIDE the field box. Typing filters the
//  dropdown options. Closes on outside-click. Styles use the existing
//  .lt-multiselect-* classes (plus .lt-ms-* added in LabTechCSS).
//
//  inline?  When true the options panel renders IN NORMAL FLOW (not absolute),
//           so the surrounding row / card / modal grows while the panel is open
//           and collapses back when it closes — no overlap, no clipping.
// ============================================================================
import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  compact?: boolean;   // tighter styling for use inside a table cell
  inline?: boolean;    // panel grows the container instead of floating over it
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, value, onChange, placeholder = 'Search...', compact, inline }) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));
  const toggle = (o: string) =>
    onChange(value.includes(o) ? value.filter(v => v !== o) : [...value, o]);
  const remove = (o: string) => onChange(value.filter(v => v !== o));

  return (
    <div ref={ref} className={`lt-ms-root ${inline ? 'lt-ms-inline-root' : ''}`} style={{ position: 'relative' }}>
      <div className={`lt-multiselect-field ${compact ? 'lt-ms-compact' : ''}`} onClick={() => setOpen(true)}>
        {value.map(v => (
          <span key={v} className="lt-ms-chip">
            {v}
            <button type="button" className="lt-ms-chip-x" onClick={e => { e.stopPropagation(); remove(v); }}>✕</button>
          </span>
        ))}
        <input
          value={query}
          placeholder={value.length === 0 ? placeholder : ''}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (
        <div className={`lt-multiselect-panel ${inline ? 'lt-ms-inline' : ''}`}>
          {filtered.length === 0 && <div className="lt-multiselect-option" style={{ cursor: 'default', color: 'var(--ink-400)' }}>No matches</div>}
          {filtered.map(o => {
            const on = value.includes(o);
            return (
              <div key={o} className={`lt-multiselect-option ${on ? 'is-selected' : ''}`} onClick={() => toggle(o)}>
                <div className={`lt-multiselect-checkbox ${on ? 'checked' : ''}`}>
                  {on && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                {o}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
