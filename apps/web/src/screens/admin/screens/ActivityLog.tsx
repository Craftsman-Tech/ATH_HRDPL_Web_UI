import React from 'react';

const EVENTS = [
  { text:'Sunrise General Hospital submitted 8 registration documents for review.',  time:'10:42 AM', color:'#3b82f6', actor:'System'    },
  { text:'Super Admin approved Dr. Arjun Mehta (Neurology) credentials.',            time:'10:15 AM', color:'#16a34a', actor:'You'        },
  { text:'Apollo Multispecialty added Dr. Riya Shah to the doctor registry.',        time:'09:50 AM', color:'#0d9488', actor:'Apollo IT'  },
  { text:'Maxcare Heart Institute requested upgrade to Enterprise plan.',             time:'08:30 AM', color:'#7c3aed', actor:'Maxcare IT' },
  { text:'Orthocare Speciality payment failed — account auto-suspended.',            time:'Yesterday 11:22 PM', color:'#e11d48', actor:'System' },
  { text:'PedsFirst Children added 3 new nurses to the staff registry.',             time:'Yesterday 04:30 PM', color:'#0d9488', actor:'PedsFirst' },
  { text:'Greenfield Wellness completed annual data export.',                         time:'Yesterday 02:00 PM', color:'#64748b', actor:'Greenfield' },
  { text:'Super Admin updated platform-wide notification settings.',                 time:'Apr 24, 2:15 PM', color:'#64748b', actor:'You' },
];

export const ActivityLog: React.FC = () => (
  <div style={{ padding:'24px 28px' }} className="vx-fade">
    <div className="card">
      <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Recent Platform Events</div>
      {EVENTS.map((e, i) => (
        <div key={i} className="activity-row">
          <div className="act-dot" style={{ background:e.color }} />
          <div style={{ flex:1 }}>
            <div className="act-text">{e.text}</div>
            <div style={{ fontSize:11.5, color:'var(--ink-400)', marginTop:2 }}>By: {e.actor}</div>
          </div>
          <div className="act-time">{e.time}</div>
        </div>
      ))}
    </div>
  </div>
);
