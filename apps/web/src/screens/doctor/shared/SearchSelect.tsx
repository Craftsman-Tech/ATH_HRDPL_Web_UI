// ============================================================================
//  SearchSelect.tsx — type-to-filter single-select combobox
// ============================================================================
//  Used for the Medications tab's "Medicine" field. A real text input that
//  filters the option list as the doctor types; selecting an option fills
//  the field with that value.
// ============================================================================
import React, { useState, useRef, useEffect } from 'react';

export const SearchSelect: React.FC<{
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ options, value, onChange, placeholder = 'Type to search…' }) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState(value);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) { setOpen(false); setQuery(value); }
    };
    if (open) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, value]);

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));

  const select = (opt: string) => { onChange(opt); setQuery(opt); setOpen(false); };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        type="text"
        className="dr-field-input"
        value={query}
        onFocus={() => { setOpen(true); setQuery(''); }}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && (
        <div className="dr-multiselect-panel">
          {filtered.length === 0 ? (
            <div style={{ padding: '10px 12px', fontSize: 13, color: 'var(--ink-400)' }}>No matches found.</div>
          ) : (
            filtered.map(opt => (
              <div key={opt} className={`dr-multiselect-option ${opt === value ? 'is-selected' : ''}`} onClick={() => select(opt)}>{opt}</div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
