import React from 'react';
import { HOSPITALS } from '../data/mockData';
import { StatusBadge, PlanBadge } from '../shared/Badges';
import { SvgIcon } from '../shared/SvgIcon';

export const Hospitals: React.FC<{ onRegister: () => void }> = ({ onRegister }) => (
  <div style={{ padding:'24px 28px' }} className="vx-fade">
    <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
      <button className="btn-primary" onClick={onRegister}>
        <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
        Register New Hospital
      </button>
    </div>
    <div className="hospital-grid">
      {HOSPITALS.map(h => (
        <div key={h.id} className="hospital-card">
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
            <div>
              <div className="hosp-name">{h.name}</div>
              <div className="hosp-meta">{h.city} · {h.type}</div>
            </div>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <StatusBadge status={h.status} />
              <PlanBadge plan={h.plan} />
            </div>
          </div>
          <div className="hosp-stats">
            {([['Beds',h.beds],['Doctors',h.doctors],['Revenue',h.revenue],['Since',h.joined]] as [string,string|number][]).map(([l,v]) => (
              <div key={String(l)} className="hosp-stat">
                <div className="hosp-stat-val">{v}</div>
                <div className="hosp-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn-ghost btn-sm">View Details</button>
            {h.status === 'pending'   && <button className="btn-primary btn-sm">Approve</button>}
            {h.status === 'suspended' && <button className="btn-primary btn-sm">Reactivate</button>}
            {h.status === 'active'    && <button className="btn-danger btn-sm">Suspend</button>}
          </div>
        </div>
      ))}
    </div>
  </div>
);
