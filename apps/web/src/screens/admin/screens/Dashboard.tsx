import React from 'react';
import { HOSPITALS } from '../data/mockData';
import { StatusBadge, PlanBadge } from '../shared/Badges';
import { SvgIcon } from '../shared/SvgIcon';
import type { ViewId } from '../types/admin.types';

const WEEKLY_APPTS = [28,35,31,42,38,45,34];
const WEEK_DAYS    = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const ACTIVITY = [
  { text:'Sunrise General Hospital submitted registration documents.', time:'10 min ago', color:'#3b82f6' },
  { text:'Dr. Arjun Mehta credentials approved by Super Admin.', time:'45 min ago', color:'#16a34a' },
  { text:'Maxcare Heart Institute upgraded to Enterprise plan.', time:'2 h ago', color:'#7c3aed' },
  { text:'Orthocare Speciality subscription payment failed.', time:'5 h ago', color:'#e11d48' },
  { text:'PedsFirst Children added 3 new doctors.', time:'Yesterday', color:'#0d9488' },
];

export const Dashboard: React.FC<{ setView: (v: ViewId) => void }> = ({ setView }) => {
  const KPIs = [
    { label:'Active Hospitals', value:'5', sub:'1 pending onboard', color:'var(--mineral-700)' },
    { label:'Total Doctors',    value:'243', sub:'+4 this week', color:'var(--blue)' },
    { label:'Patients (MTD)',   value:'12,840', sub:'↑ 8% vs Mar', color:'var(--ink-800)' },
    { label:'Appointments',     value:'4,320', sub:'This month', color:'var(--amber)' },
    { label:'MRR',              value:'₹7.2L', sub:'↑ 12% vs Mar', color:'var(--mineral-700)' },
  ];
  const max = Math.max(...WEEKLY_APPTS);
  return (
    <div style={{ padding:'24px 28px' }} className="vx-fade">
      <div className="dash-kpi-row">
        {KPIs.map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color:k.color }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="dash-grid">
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px 12px', borderBottom:'1px solid var(--ink-200)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontWeight:700, fontSize:15 }}>Weekly Appointments</div>
            <span style={{ fontSize:12, color:'var(--ink-400)' }}>Apr 20–26, 2026</span>
          </div>
          <div style={{ padding:'20px', display:'flex', alignItems:'flex-end', gap:8, height:120 }}>
            {WEEKLY_APPTS.map((v,i) => (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                {i===6 && <div style={{ fontSize:10, color:'var(--mineral-700)', fontWeight:700 }}>{v}</div>}
                <div style={{ width:'100%', height:`${(v/max)*80}px`, borderRadius:'4px 4px 0 0', background:'var(--mineral-700)', opacity:i===6?1:0.3 }} />
                <span style={{ fontSize:10.5, color:'var(--ink-400)' }}>{WEEK_DAYS[i]}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:'0 20px 14px' }}>
            <table className="tbl">
              <thead><tr>{['Hospital','City','Beds','Doctors','Status','Plan'].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {HOSPITALS.map(h => (
                  <tr key={h.id}>
                    <td style={{ fontWeight:600 }}>{h.name}</td>
                    <td style={{ color:'var(--ink-500)' }}>{h.city}</td>
                    <td style={{ fontWeight:600 }}>{h.beds}</td>
                    <td style={{ fontWeight:600 }}>{h.doctors}</td>
                    <td><StatusBadge status={h.status} /></td>
                    <td><PlanBadge plan={h.plan} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Recent Activity</div>
          {ACTIVITY.map((a, i) => (
            <div key={i} className="activity-row">
              <div className="act-dot" style={{ background:a.color }} />
              <div className="act-text">{a.text}</div>
              <div className="act-time">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
