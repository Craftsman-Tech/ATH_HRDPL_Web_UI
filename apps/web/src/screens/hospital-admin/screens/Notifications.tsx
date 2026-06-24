import React, { useState, useCallback } from 'react';
import { NOTIFICATIONS_DATA } from '../data/mockHaData';
import type { Notification } from '../types/hospitaladmin.types';

export const NotificationsModule: React.FC = () => {
  const [notifs, setNotifs] = useState<Notification[]>(NOTIFICATIONS_DATA);
  const markRead    = useCallback((id: number) => setNotifs(prev => prev.map(n => n.id===id?{...n,read:true}:n)), []);
  const markAllRead = useCallback(() => setNotifs(prev => prev.map(n => ({...n,read:true}))), []);
  const typeIcon = (t: string) => t==='critical'?'🔴':t==='alert'?'🟡':t==='success'?'🟢':'🔵';
  const notifBg  = (t: string) => t==='critical'?'var(--rose-light)':t==='alert'?'var(--amber-light)':t==='success'?'var(--green-light)':'var(--blue-light)';
  return (
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div><div className="ha-section-title">Notifications</div><div className="ha-section-sub">{notifs.filter(n=>!n.read).length} unread</div></div>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {['All','Unread','Critical','Alerts'].map(f => (
          <button key={f} style={{ padding:'6px 16px', borderRadius:20, border:'1px solid var(--border)', background:f==='All'?'var(--primary)':'var(--card)', color:f==='All'?'white':'var(--text-muted)', fontSize:13, cursor:'pointer', fontFamily:'inherit', fontWeight:f==='All'?600:400 }}>{f}</button>
        ))}
        <button onClick={markAllRead} style={{ marginLeft:'auto', background:'none', border:'none', fontSize:13, color:'var(--primary)', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>Mark all as read</button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {notifs.map(n => (
          <div key={n.id} className={`ha-notif-item ${!n.read?'unread':''}`} style={{ border:n.read?'1px solid var(--border)':'1.5px solid var(--border)' }} onClick={() => markRead(n.id)}>
            <div className="ha-notif-icon" style={{ background:notifBg(n.type) }}>{typeIcon(n.type)}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ fontWeight:n.read?500:700, fontSize:13.5 }}>{n.title}</div>
                <span style={{ fontSize:11.5, color:'var(--text-muted)', flexShrink:0, marginLeft:12 }}>{n.time}</span>
              </div>
              <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:3, lineHeight:1.5 }}>{n.body}</div>
            </div>
            {!n.read && <div className="ha-notif-dot" />}
          </div>
        ))}
      </div>
    </div>
  );
};
