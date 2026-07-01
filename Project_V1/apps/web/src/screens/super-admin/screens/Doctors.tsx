import React from 'react';
import { StatusBadge } from '../shared/Badges';
import type { Hospital } from '../types/admin.types';

const DOCTORS_DATA = [
  ['Dr. Amy Chen',    'Cardiology',     'Apollo',   'MCI/REG/12483', '5 yrs',  'active'   ],
  ['Dr. Raj Patel',   'Endocrinology',  'Maxcare',  'MCI/REG/09214', '8 yrs',  'active'   ],
  ['Dr. Yeon Kim',    'Pulmonology',    'PedsFirst','MCI/REG/17320', '3 yrs',  'active'   ],
  ['Dr. Arjun Mehta', 'Neurology',      'Apollo',   'MCI/REG/21905', '7 yrs',  'pending'  ],
  ['Dr. Priya Sundar','Paediatrics',    'PedsFirst','MCI/REG/15880', '4 yrs',  'pending'  ],
  ['Dr. Suman Rao',   'Orthopaedics',   'Orthocare','MCI/REG/08441', '10 yrs', 'suspended'],
] as const;

export const Doctors: React.FC = () => (
  <div style={{ padding:'24px 28px' }} className="vx-fade">
    <div className="card" style={{ padding:0, overflow:'hidden' }}>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--ink-200)', fontWeight:700, fontSize:15 }}>Doctor Registry</div>
      <div style={{ overflowX:'auto' }}>
        <table className="tbl">
          <thead><tr>{['Name','Speciality','Hospital','Reg. No.','Experience','Status',''].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {DOCTORS_DATA.map(([name,spec,hosp,reg,exp,status]) => (
              <tr key={reg}>
                <td style={{ fontWeight:700 }}>{name}</td>
                <td>{spec}</td>
                <td style={{ color:'var(--ink-500)' }}>{hosp}</td>
                <td style={{ fontFamily:'monospace', fontSize:12 }}>{reg}</td>
                <td>{exp}</td>
                <td><StatusBadge status={status as Hospital['status']} /></td>
                <td>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn-ghost btn-sm">View</button>
                    {status === 'pending' && <button className="btn-primary btn-sm">Approve</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
