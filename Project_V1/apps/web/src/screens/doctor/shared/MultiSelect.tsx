// ============================================================================
//  MultiSelect.tsx — type-to-filter multi-select combobox
// ============================================================================
//  Selected items render as chips INSIDE the field itself (tag-input style),
//  with the text cursor continuing right after them so the doctor can keep
//  typing to filter and add more. Clicking a filtered option in the dropdown
//  adds it (it then drops out of the option list).
// ============================================================================
import React, { useState, useRef, useEffect } from 'react';

export const MultiSelect: React.FC<{
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}> = ({ options, selected, onChange, placeholder = 'Type to search…' }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) { setOpen(false); setQuery(''); }
    };
    if (open) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const filtered = options.filter(o => !selected.includes(o) && o.toLowerCase().includes(query.toLowerCase()));

  const add = (opt: string) => {
    onChange([...selected, opt]);
    setQuery('');
    inputRef.current?.focus();
  };
  const remove = (opt: string) => onChange(selected.filter(o => o !== opt));

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div className="dr-multiselect-field" onClick={() => { inputRef.current?.focus(); setOpen(true); }}>
        {selected.map(s => (
          <span key={s} className="dr-chip primary" style={{ paddingRight: 6 }}>
            {s}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); remove(s); }}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 14, height: 14, borderRadius: '50%', border: 'none',
                background: 'rgba(14,124,102,0.18)', color: 'var(--mineral-700)',
                cursor: 'pointer', fontSize: 10, lineHeight: 1, marginLeft: 2, padding: 0,
              }}
            >✕</button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          placeholder={selected.length ? '' : placeholder}
          autoComplete="off"
        />
      </div>

      {open && (
        <div className="dr-multiselect-panel">
          {filtered.length === 0 ? (
            <div style={{ padding: '10px 12px', fontSize: 13, color: 'var(--ink-400)' }}>
              {options.length === selected.length ? 'All options selected.' : 'No matches found.'}
            </div>
          ) : (
            filtered.map(opt => (
              <div key={opt} className="dr-multiselect-option" onClick={() => add(opt)}>{opt}</div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
