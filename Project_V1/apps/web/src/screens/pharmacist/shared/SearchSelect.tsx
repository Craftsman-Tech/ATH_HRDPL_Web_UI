import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SvgIcon } from './PhHelpers';

// ============================================================================
//  SearchSelect.tsx — filter-as-you-type dropdown (single OR multi select).
//  - Type in the field → option list filters live.
//  - multi=false → picking an option fills the field and closes.
//  - multi=true  → picked options render as removable chips; field stays open.
// ============================================================================

interface Props {
  options: string[];
  value: string[];                 // currently selected option(s)
  onChange: (next: string[]) => void;
  multi?: boolean;
  placeholder?: string;
}

export const SearchSelect: React.FC<Props> = ({
  options, value, onChange, multi = false, placeholder = 'Search…',
}) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const filtered = useMemo(
    () => options.filter(o => o.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );

  const pick = (opt: string) => {
    if (multi) {
      onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);
      setQuery('');
    } else {
      onChange([opt]);
      setQuery('');
      setOpen(false);
    }
  };

  const removeChip = (opt: string) => onChange(value.filter(v => v !== opt));

  // Single-select shows the chosen value as the input text when closed.
  const inputValue = open ? query : (!multi && value[0] ? value[0] : query);

  return (
    <div className="ph-select" ref={wrapRef}>
      <div className="ph-select-field" onClick={() => setOpen(true)}>
        {multi && value.map(v => (
          <span key={v} className="ph-chip" onClick={e => e.stopPropagation()}>
            {v}
            <button type="button" className="ph-chip-x" onClick={() => removeChip(v)} aria-label="Remove">×</button>
          </span>
        ))}
        {!multi && (
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" size={15} color="var(--text-muted)" />
        )}
        <input
          value={inputValue}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={multi && value.length > 0 ? 'Add another…' : placeholder}
        />
        <SvgIcon path="M7 10l5 5 5-5z" size={18} color="var(--text-muted)" />
      </div>

      {open && (
        <div className="ph-select-menu">
          {filtered.length === 0 && <div className="ph-select-empty">No matches</div>}
          {filtered.map(opt => {
            const sel = value.includes(opt);
            return (
              <button
                type="button"
                key={opt}
                className={`ph-select-opt ${sel ? 'sel' : ''}`}
                onClick={() => pick(opt)}>
                {multi && <span className={`ph-check ${sel ? 'on' : ''}`}>{sel ? '✓' : ''}</span>}
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};