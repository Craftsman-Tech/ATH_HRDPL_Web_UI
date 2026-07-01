/**
 * Hospitals.tsx — tenant directory (matches the reference screenshot).
 * Status chips · live text search (shared with the topbar) · Plan filter · Sort.
 * Clicking any row opens that hospital's full registration detail.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { HOSPITALS, stateName } from '../data/mockData';
import { StatusBadge, PlanPill } from '../shared/Badges';
import { Icon } from '../shared/Icons';
import type { HospitalStatus, PlanTier } from '../types/admin.types';

type StatusFilter = 'all' | HospitalStatus;
type SortMode = 'newest' | 'oldest' | 'name';

const STATUS_CHIPS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'trial', label: 'Trial' },
  { id: 'suspended', label: 'Suspended' },
];
const PLANS: ('All' | PlanTier)[] = ['All', 'pilot', 'core', 'scale', 'enterprise'];
const SORT_LABEL: Record<SortMode, string> = { newest: 'Newest', oldest: 'Oldest', name: 'Name A–Z' };
const ORDER = HOSPITALS.map(h => h.id); // mock data is newest-first

export const Hospitals: React.FC<{ query: string; onOpen: (id: string) => void }> = ({ query, onOpen }) => {
  const [status, setStatus] = useState<StatusFilter>('all');
  const [planIdx, setPlanIdx] = useState(0);
  const [sort, setSort] = useState<SortMode>('newest');
  // Local, editable search box. Seeded from the topbar query so typing in either
  // place filters the directory; typing here works independently of the topbar.
  const [localQ, setLocalQ] = useState(query);
  useEffect(() => { setLocalQ(query); }, [query]);
  const plan = PLANS[planIdx];

  const rows = useMemo(() => {
    const q = localQ.trim().toLowerCase();
    let out = HOSPITALS.filter(h => {
      if (status !== 'all' && h.status !== status) return false;
      if (plan !== 'All' && h.plan !== plan) return false;
      if (q && ![h.name, h.city, h.regNo, h.admin, h.email, h.id].some(f => f.toLowerCase().includes(q))) return false;
      return true;
    });
    if (sort === 'name') out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'oldest') out = [...out].sort((a, b) => ORDER.indexOf(b.id) - ORDER.indexOf(a.id));
    else out = [...out].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
    return out;
  }, [localQ, status, plan, sort]);

  const cycleSort = () => setSort(s => (s === 'newest' ? 'oldest' : s === 'oldest' ? 'name' : 'newest'));

  return (
    <section className="view">
      <div className="toolbar">
        {STATUS_CHIPS.map(c => (
          <button key={c.id} className={`filter-chip ${status === c.id ? 'active' : ''}`} onClick={() => setStatus(c.id)}>
            {c.label}
            {c.id === 'all' && <span className="mono" style={{ opacity: 0.6, fontSize: 11 }}>{HOSPITALS.length}</span>}
          </button>
        ))}
        <div className="toolbar-search">
          <Icon.Search size={13} />
          <input
            placeholder="Filter by name, city, registration no…"
            value={localQ}
            onChange={e => setLocalQ(e.target.value)}
          />
          {localQ && <button className="toolbar-search-clear" title="Clear" onClick={() => setLocalQ('')}><Icon.Close size={12} /></button>}
        </div>
        <div className="toolbar-spacer" />
        <button className="filter-chip" onClick={() => setPlanIdx(i => (i + 1) % PLANS.length)}>
          Plan: {plan === 'All' ? 'All' : plan[0].toUpperCase() + plan.slice(1)} <Icon.Chevron size={11} />
        </button>
        <button className="filter-chip" onClick={cycleSort}>
          Sort: {SORT_LABEL[sort]} <Icon.Chevron size={11} />
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Hospital</th><th>Admin / Contact</th><th>City</th>
              <th>Plan</th><th>Status</th><th>Registered</th><th style={{ width: 90 }} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr className="empty-row"><td colSpan={7}>No hospitals match these filters.</td></tr>
            )}
            {rows.map(h => (
              <tr key={h.id} onClick={() => onOpen(h.id)}>
                <td>
                  <div className="hosp-cell">
                    <div className="hosp-mark" style={{ background: h.accent }}>{h.mark}</div>
                    <div>
                      <div className="hosp-name">{h.name}</div>
                      <div className="hosp-id mono">{h.id} · {h.regNo}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 13, color: 'var(--ink-800)', fontWeight: 500 }}>{h.admin}</div>
                  <div className="meta-line">{h.email}</div>
                </td>
                <td>
                  <div style={{ fontSize: 13, color: 'var(--ink-800)' }}>{h.city}</div>
                  <div className="meta-line">{stateName(h.state)}</div>
                </td>
                <td><PlanPill plan={h.plan} /></td>
                <td><StatusBadge status={h.status} /></td>
                <td><span className="meta-line">{h.registered}</span></td>
                <td onClick={e => e.stopPropagation()}>
                  <div className="row-actions">
                    <button className="icon-btn" title="View details" onClick={() => onOpen(h.id)}><Icon.Eye size={13} /></button>
                    <button className="icon-btn" title="Reset password"><Icon.Reset size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
