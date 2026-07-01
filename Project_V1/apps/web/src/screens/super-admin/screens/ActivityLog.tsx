/**
 * ActivityLog.tsx — platform audit timeline across the whole support team.
 * Chips filter by category; each event carries an actor line (mono-caps).
 * Titles/details contain trusted <b> markup from the data layer.
 */
import React, { useMemo, useState } from 'react';
import { ACTIVITY } from '../data/mockData';
import type { ActivityCategory } from '../types/admin.types';

type Filter = 'all' | ActivityCategory;

const CHIPS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'approval', label: 'Approvals' },
  { id: 'credential', label: 'Credentials' },
  { id: 'license', label: 'Licenses' },
  { id: 'suspension', label: 'Suspensions' },
];

export const ActivityLog: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const rows = useMemo(
    () => ACTIVITY.filter(e => filter === 'all' || e.category === filter),
    [filter],
  );

  return (
    <section className="view">
      <div className="toolbar">
        {CHIPS.map(c => (
          <button key={c.id} className={`filter-chip ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
        <div className="toolbar-spacer" />
        <span className="meta-line">Showing last 24 hours</span>
      </div>

      <div className="activity-list">
        {rows.length === 0 && (
          <div className="placeholder"><h3>No events</h3><p>Nothing logged for this category in the last 24 hours.</p></div>
        )}
        {rows.map(e => (
          <div key={e.id} className={`act-item ${e.kind}`}>
            <div className="act-time">{e.time}</div>
            <div className="act-body">
              <div className="act-title" dangerouslySetInnerHTML={{ __html: e.title }} />
              <div className="act-detail" dangerouslySetInnerHTML={{ __html: e.detail }} />
              <div className="act-actor mono">{e.actor}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
