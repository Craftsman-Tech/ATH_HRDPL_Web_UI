import React from 'react';
import { SvgIcon } from '../shared/SvgIcon';

const PLANS = [
  { plan:'Starter',      count:2, color:'var(--ink-500)', mrr:'₹0.8L', hospitals:['Orthocare Speciality (Suspended)','(1 inactive)'],
    features:['Up to 50 beds','Up to 20 doctors','Basic EMR','Email support'] },
  { plan:'Professional', count:3, color:'var(--blue)',    mrr:'₹3.9L', hospitals:['Maxcare Heart Institute','Greenfield Wellness','PedsFirst Children'],
    features:['Up to 300 beds','Up to 60 doctors','Full EMR + Pharmacy','Priority support','Analytics dashboard'] },
  { plan:'Enterprise',   count:1, color:'#7c3aed',        mrr:'₹3.2L', hospitals:['Apollo Multispecialty'],
    features:['Unlimited beds & doctors','All modules','Dedicated CSM','Custom integrations','SLA 99.9%'] },
];

export const Licenses: React.FC = () => (
  <div style={{ padding:'24px 28px' }} className="vx-fade">
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
      {([['Total MRR','₹7.2L','var(--mineral-700)'],['Active Licences','6','var(--blue)'],['Expiring Soon','1','var(--amber)']] as [string,string,string][]).map(([l,v,c]) => (
        <div key={l} className="kpi-card"><div className="kpi-label">{l}</div><div className="kpi-value" style={{ color:c }}>{v}</div></div>
      ))}
    </div>
    <div className="lic-grid">
      {PLANS.map(p => (
        <div key={p.plan} className="lic-card">
          <div className="lic-plan" style={{ color:p.color }}>{p.plan}</div>
          <div className="lic-count" style={{ color:p.color }}>{p.count}<span style={{ fontSize:14, color:'var(--ink-400)', fontWeight:400 }}> hospitals</span></div>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--mineral-700)', marginBottom:14 }}>{p.mrr} / month</div>
          <div style={{ fontSize:12, fontWeight:600, color:'var(--ink-400)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.5px' }}>Features</div>
          {p.features.map(f => (
            <div key={f} className="lic-feature">
              <SvgIcon path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" size={13} color={p.color} />
              {f}
            </div>
          ))}
          <div style={{ marginTop:14, fontSize:12, color:'var(--ink-400)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Assigned To</div>
          {p.hospitals.map(h => <div key={h} className="lic-detail" style={{ marginBottom:3 }}>• {h}</div>)}
          <button className="btn-ghost" style={{ marginTop:14, width:'100%', justifyContent:'center' }}>Manage Licences</button>
        </div>
      ))}
    </div>
  </div>
);
