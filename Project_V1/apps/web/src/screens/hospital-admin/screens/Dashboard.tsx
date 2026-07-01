import React from 'react';
import type { ModuleId } from '../types/hospitaladmin.types';
import { Badge, StatCard, BarChart, Th, Td, statusColor, initials } from '../shared/HaHelpers';
import { PATIENTS } from '../data/mockHaData';

const weeklyAppts = [28, 35, 31, 42, 38, 45, 34];
const weekDays    = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mockPatientsDash = PATIENTS.slice(0, 5);
const mockApptsDash = [
  { patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', status:'Confirmed'   },
  { patient:'New Patient',     doctor:'Dr. Patel', type:'Consultation',time:'10:30 AM', status:'Waiting'     },
  { patient:"James O'Brien",   doctor:'Dr. Chen',  type:'Urgent',      time:'11:00 AM', status:'In Progress' },
  { patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Check-up',    time:'01:00 PM', status:'Confirmed'   },
  { patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'02:30 PM', status:'Confirmed'   },
];

export const Dashboard: React.FC<{ setModule: (m: ModuleId) => void }> = ({ setModule }) => (
  <div className="ha-content ha-fade">
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:18 }} className="ha-stat-grid-4">
      <StatCard label="Total Patients"       value="1,248" sub="↑ 12 new today"     color="#0d9488" iconPath="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      <StatCard label="Today's Appointments" value="34"    sub="6 remaining"        color="#3b82f6" iconPath="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
      <StatCard label="Today's Revenue"      value="₹8,240" sub="↑ 8% vs yesterday" color="#d97706" iconPath="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
      <StatCard label="Pending Alerts"       value="12"    sub="3 critical"         color="#e11d48" iconPath="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:18 }} className="ha-grid-2-1">
      <div className="ha-card">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:15 }}>Weekly Appointments</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Apr 20 – Apr 26, 2026</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <span className="ha-badge primary">253 This Week</span>
            <span className="ha-badge green">↑ 9.1%</span>
          </div>
        </div>
        <BarChart data={weeklyAppts} labels={weekDays} />
      </div>
      <div className="ha-card">
        <div style={{ fontWeight:700, fontSize:15, marginBottom:18 }}>Department Load</div>
        {([['Cardiology',12,'#e11d48',80],['General Practice',9,'#0d9488',60],
           ['Pediatrics',7,'#3b82f6',47],['Orthopedics',6,'#d97706',40],
           ['Pulmonology',4,'#7c3aed',27]] as [string,number,string,number][]).map(([dept,count,color,pct]) => (
          <div key={dept} style={{ marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontSize:12.5, fontWeight:500 }}>{dept}</span>
              <span style={{ fontSize:12, color:'var(--text-muted)' }}>{count} pts</span>
            </div>
            <div style={{ background:'var(--bg)', borderRadius:4, height:6, overflow:'hidden' }}>
              <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14 }} className="ha-grid-2-1">
      <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 22px 12px' }}>
          <div style={{ fontWeight:700, fontSize:15 }}>Recent Patients</div>
          <button onClick={() => setModule('patients')} style={{ fontSize:12.5, color:'var(--primary)', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>View all →</button>
        </div>
        <div className="ha-table-wrap">
          <table className="ha-table">
            <thead><tr>{['Patient','Condition','Doctor','Status'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {mockPatientsDash.map((p, i) => (
                <tr key={p.id} className="ha-tr" style={{ borderBottom:i<4?'1px solid var(--border)':'none' }}>
                  <Td>
                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:11, color:'var(--primary)', flexShrink:0 }}>{initials(p.name)}</div>
                      <div>
                        <div style={{ fontWeight:600 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)' }}>{p.id} · {p.age}y</div>
                      </div>
                    </div>
                  </Td>
                  <Td style={{ color:'var(--text-muted)', fontSize:12.5 }}>{p.condition}</Td>
                  <Td style={{ fontSize:12.5 }}>{p.doctor}</Td>
                  <Td><Badge label={p.status} color={statusColor(p.status)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ha-card">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontWeight:700, fontSize:15 }}>Today's Schedule</div>
          <button onClick={() => setModule('appointments')} style={{ fontSize:12.5, color:'var(--primary)', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>View all →</button>
        </div>
        {mockApptsDash.map((a, i) => (
          <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:i<4?12:0, paddingBottom:i<4?12:0, borderBottom:i<4?'1px solid var(--border)':'none' }}>
            <div style={{ width:46, background:'var(--primary-light)', borderRadius:10, padding:'6px 4px', textAlign:'center', flexShrink:0 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--primary)', lineHeight:1.3 }}>
                {a.time.split(' ')[0]}<br /><span style={{ fontWeight:400, fontSize:9 }}>{a.time.split(' ')[1]}</span>
              </div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:600, fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.patient}</div>
              <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{a.doctor} · {a.type}</div>
            </div>
            <Badge label={a.status} color={statusColor(a.status)} />
          </div>
        ))}
      </div>
    </div>
  </div>
);
