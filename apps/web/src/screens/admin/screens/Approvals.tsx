import React, { useState } from 'react';
import { APPROVALS, APPROVAL_ICON_PATH, APPROVAL_ICON_COLOR } from '../data/mockData';
import { SvgIcon } from '../shared/SvgIcon';

export const Approvals: React.FC = () => {
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const pending = APPROVALS.filter(a => !approved.has(a.id) && !rejected.has(a.id));
  return (
    <div style={{ padding:'24px 28px' }} className="vx-fade">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
        {([['Pending',pending.length,'var(--amber)','var(--amber-bg)'],
           ['Approved This Week','12','var(--mineral-700)','var(--mineral-100)'],
           ['Avg Review Time','4.2h','var(--blue)','var(--blue-bg)']] as [string,number|string,string,string][]).map(([l,v,c,bg]) => (
          <div key={l} className="kpi-card" style={{ background:bg, borderColor:'transparent' }}>
            <div className="kpi-label">{l}</div>
            <div className="kpi-value" style={{ color:c }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding:0 }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--ink-200)', fontWeight:700, fontSize:15 }}>
          Items Awaiting Review ({pending.length})
        </div>
        {pending.length === 0 && (
          <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--ink-500)' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>✓</div>
            <div style={{ fontWeight:700 }}>All caught up!</div>
            <div style={{ fontSize:13, marginTop:4 }}>No pending approvals.</div>
          </div>
        )}
        {pending.map(a => {
          const [iconColor, iconBg] = APPROVAL_ICON_COLOR[a.type] ?? ['#64748b','#f1f5f9'];
          return (
            <div key={a.id} className="approval-row">
              <div className="approval-icon" style={{ background:iconBg }}>
                <SvgIcon path={APPROVAL_ICON_PATH[a.type] ?? ''} size={18} color={iconColor} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="approval-type">{a.type} · {a.id}</div>
                <div className="approval-name">{a.name}</div>
                <div className="approval-hosp">{a.hospital} · Submitted {a.submitted}</div>
                <div className="approval-docs">{a.docs} documents attached</div>
              </div>
              <span className={`badge badge-${a.priority}`}>{a.priority === 'high' ? '🔴 High Priority' : 'Normal'}</span>
              <div className="approval-actions">
                <button className="btn-ghost btn-sm">Review</button>
                <button className="btn-primary btn-sm" onClick={() => setApproved(s => new Set([...s, a.id]))}>Approve</button>
                <button className="btn-danger btn-sm" onClick={() => setRejected(s => new Set([...s, a.id]))}>Reject</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
