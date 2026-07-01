/**
 * Licenses.tsx — compliance table of licenses expiring soon / due for renewal.
 * Chips filter by urgency & kind. Each row has a "Send reminder" action; the
 * toolbar has "Remind all". The TIME LEFT column shows a colour-graded urgency
 * bar (red < 7d · amber < 30d · green otherwise).
 */
import React, { useMemo, useState } from 'react';
import { LICENSES, stateName } from '../data/mockData';
import { Icon } from '../shared/Icons';
import type { LicenseKind } from '../types/admin.types';

type Filter = 'attention' | 'lt7' | 'lt30' | 'CEA' | 'Drug license';

const CHIPS: { id: Filter; label: string; count?: boolean }[] = [
  { id: 'attention', label: 'Needs attention', count: true },
  { id: 'lt7', label: 'Expiring < 7d' },
  { id: 'lt30', label: 'Expiring < 30d' },
  { id: 'CEA', label: 'CEA' },
  { id: 'Drug license', label: 'Drug license' },
];

const barColor = (d: number) => (d < 7 ? 'var(--signal-red)' : d < 30 ? 'var(--amber)' : 'var(--mineral-600)');
const barText  = (d: number) => (d < 7 ? 'lt7' : d < 30 ? 'lt30' : 'ok');

export const Licenses: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('attention');
  const [sent, setSent] = useState<Set<string>>(new Set());

  const rows = useMemo(() => LICENSES.filter(l => {
    if (filter === 'attention') return true;
    if (filter === 'lt7') return l.daysLeft < 7;
    if (filter === 'lt30') return l.daysLeft < 30;
    return l.kind === (filter as LicenseKind);
  }), [filter]);

  const remind = (id: string) => setSent(s => new Set(s).add(id));
  const remindAll = () => setSent(new Set(rows.map(r => r.id)));

  return (
    <section className="view">
      <div className="toolbar">
        {CHIPS.map(c => (
          <button key={c.id} className={`filter-chip ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
            {c.label}
            {c.count && <span className="mono" style={{ opacity: 0.6, fontSize: 11 }}>{LICENSES.length}</span>}
          </button>
        ))}
        <div className="toolbar-spacer" />
        <button className="btn btn-ghost btn-sm" onClick={remindAll}><Icon.Mail size={13} /> Remind all</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>License</th><th>Hospital</th><th>License no.</th><th>Valid until</th><th style={{ width: 180 }}>Time left</th><th style={{ width: 150, textAlign: 'right' }}>Action</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr className="empty-row"><td colSpan={6}>No licenses match this filter.</td></tr>}
            {rows.map(l => {
              const pct = Math.max(8, Math.min(100, Math.round((l.daysLeft / 180) * 100)));
              return (
                <tr key={l.id} className="no-pointer">
                  <td>
                    <div className="lic-cell">
                      <div className="lic-doc"><Icon.License size={15} /></div>
                      <div className="lic-name">{l.name}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, color: 'var(--ink-800)', fontWeight: 500 }}>{l.hosp}</div>
                    <div className="meta-line">{l.city}, {l.state}</div>
                  </td>
                  <td><span className="mono" style={{ fontSize: 12, color: 'var(--ink-700)' }}>{l.no}</span></td>
                  <td><span style={{ fontSize: 13, color: 'var(--ink-800)' }}>{l.valid}</span></td>
                  <td>
                    <div className={`time-left ${barText(l.daysLeft)}`}>
                      <div className="time-left-val"><b>{l.daysLeft}</b> days</div>
                      <div className="time-bar"><span style={{ width: `${pct}%`, background: barColor(l.daysLeft) }} /></div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className={`btn btn-sm ${sent.has(l.id) ? 'btn-primary' : 'btn-ghost'}`} onClick={() => remind(l.id)} disabled={sent.has(l.id)}>
                      {sent.has(l.id) ? <><Icon.Check size={12} strokeWidth={3} /> Sent</> : <><Icon.Mail size={13} /> Send reminder</>}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
