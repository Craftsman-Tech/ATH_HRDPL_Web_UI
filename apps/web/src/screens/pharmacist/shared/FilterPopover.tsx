import React, { useEffect, useRef, useState } from 'react';
import { SvgIcon } from './PhHelpers';

// ============================================================================
//  FilterPopover.tsx — "Custom Filter" used by Dispensed & Completed screens.
//  Lets the user pick a date range (This Week / Month / Year / Custom range)
//  plus a source (All / In-House / External). On Apply it returns the filter;
//  the parent screen also switches its source tab to match the chosen source.
// ============================================================================

export type DatePreset = 'all' | 'week' | 'month' | 'year' | 'custom';
export type SourceSel  = 'All' | 'In-House' | 'External';

export interface RangeFilter {
  preset: DatePreset;
  from: string;   // yyyy-mm-dd (used only when preset === 'custom')
  to: string;     // yyyy-mm-dd
  source: SourceSel;
}

export const DEFAULT_FILTER: RangeFilter = { preset: 'all', from: '', to: '', source: 'All' };

// Parse mock date strings like "Jun 21, 2026" into a real Date.
export function parseMockDate(s: string): Date | null {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

// "Today" anchor for the app's mock data.
const TODAY = new Date('Jun 21, 2026');

/** Does a row's date string fall inside the active filter's date range? */
export function inRange(dateStr: string, f: RangeFilter): boolean {
  if (f.preset === 'all') return true;
  const d = parseMockDate(dateStr);
  if (!d) return true;

  if (f.preset === 'custom') {
    const from = f.from ? new Date(f.from + 'T00:00:00') : null;
    const to   = f.to   ? new Date(f.to   + 'T23:59:59') : null;
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  }

  const start = new Date(TODAY);
  if (f.preset === 'week')  start.setDate(TODAY.getDate() - 7);
  if (f.preset === 'month') start.setMonth(TODAY.getMonth() - 1);
  if (f.preset === 'year')  start.setFullYear(TODAY.getFullYear() - 1);
  return d >= start && d <= new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), 23, 59, 59);
}

const PRESETS: { id: DatePreset; label: string }[] = [
  { id: 'all',    label: 'All time'   },
  { id: 'week',   label: 'This Week'  },
  { id: 'month',  label: 'This Month' },
  { id: 'year',   label: 'This Year'  },
  { id: 'custom', label: 'Custom'     },
];
const SOURCES: SourceSel[] = ['All', 'In-House', 'External'];

interface Props {
  value: RangeFilter;
  onApply: (next: RangeFilter) => void;
}

export const FilterPopover: React.FC<Props> = ({ value, onApply }) => {
  const [open, setOpen]   = useState(false);
  const [draft, setDraft] = useState<RangeFilter>(value);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const active = value.preset !== 'all' || value.source !== 'All';

  const apply = () => { onApply(draft); setOpen(false); };
  const reset = () => { setDraft(DEFAULT_FILTER); onApply(DEFAULT_FILTER); setOpen(false); };

  return (
    <div className="ph-filter-wrap" ref={wrapRef}>
      <button className={`ph-btn-outline ${active ? 'ph-btn-active' : ''}`} onClick={() => setOpen(o => !o)}>
        <SvgIcon path="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" size={16} color="currentColor" />
        Filter{active ? ' ·' : ''}
      </button>

      {open && (
        <div className="ph-filter-pop">
          <div className="ph-filter-group-label">Date range</div>
          <div className="ph-filter-chips">
            {PRESETS.map(p => (
              <button key={p.id}
                className={`ph-filter-chip ${draft.preset === p.id ? 'active' : ''}`}
                onClick={() => setDraft(d => ({ ...d, preset: p.id }))}>{p.label}</button>
            ))}
          </div>

          {draft.preset === 'custom' && (
            <div className="ph-filter-dates">
              <label>From
                <input type="date" value={draft.from} onChange={e => setDraft(d => ({ ...d, from: e.target.value }))} />
              </label>
              <label>To
                <input type="date" value={draft.to} onChange={e => setDraft(d => ({ ...d, to: e.target.value }))} />
              </label>
            </div>
          )}

          <div className="ph-filter-group-label" style={{ marginTop: 14 }}>Source</div>
          <div className="ph-filter-chips">
            {SOURCES.map(s => (
              <button key={s}
                className={`ph-filter-chip ${draft.source === s ? 'active' : ''}`}
                onClick={() => setDraft(d => ({ ...d, source: s }))}>{s}</button>
            ))}
          </div>

          <div className="ph-filter-actions">
            <button className="ph-btn-text" onClick={reset}>Reset</button>
            <button className="ph-action-btn" style={{ height: 36, padding: '0 18px' }} onClick={apply}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};
