/**
 * Modules.tsx — platform-wide capability catalogue. Each card toggles a module's
 * availability platform-wide (interactive) and shows tenants-using + adoption.
 */
import React, { useState } from 'react';
import { MODULES } from '../data/mockData';
import { Icon } from '../shared/Icons';
import type { ModuleCard } from '../types/admin.types';

const ICON: Record<string, React.FC<{ size?: number }>> = {
  user: Icon.User, hospital: Icon.Hospital, pill: Icon.Pill, beaker: Icon.Beaker,
  scan: Icon.Scan, billing: Icon.Billing, users: Icon.Users, chart: Icon.Chart,
};

const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
  <button className={`toggle ${on ? 'on' : ''}`} role="switch" aria-checked={on} onClick={onClick}>
    <span className="toggle-knob" />
  </button>
);

const Card: React.FC<{ m: ModuleCard }> = ({ m }) => {
  const [on, setOn] = useState(m.available);
  const I = ICON[m.icon] ?? Icon.Modules;
  return (
    <article className={`module-card ${on ? '' : 'off'}`}>
      <div className="module-top">
        <div className="module-ico"><I size={18} /></div>
        <div className="module-id">
          <div className="module-name">{m.name}</div>
          <div className="module-cat">{m.category}</div>
        </div>
        <Toggle on={on} onClick={() => setOn(v => !v)} />
      </div>
      <p className="module-desc">{m.desc}</p>
      <div className="module-foot">
        <div className="module-stat"><div className="module-stat-val">{m.tenants}</div><div className="module-stat-lbl">Tenants using</div></div>
        <div className="module-stat"><div className="module-stat-val">{m.adoption}%</div><div className="module-stat-lbl">Adoption</div></div>
        <div className={`module-avail ${on ? 'yes' : 'no'}`}>{on ? 'Available' : 'Disabled'}</div>
      </div>
    </article>
  );
};

export const Modules: React.FC = () => (
  <section className="view">
    <div className="page-head">
      <div className="page-head-row">
        <div>
          <p className="eyebrow">Platform</p>
          <h1 className="page-title">Application <em>modules</em></h1>
          <p className="page-sub">The capabilities every hospital can switch on. Toggle availability platform-wide and track adoption across tenants.</p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-primary"><Icon.Plus size={14} /> New module</button>
        </div>
      </div>
    </div>

    <div className="module-grid">
      {MODULES.map(m => <Card key={m.id} m={m} />)}
    </div>
  </section>
);
