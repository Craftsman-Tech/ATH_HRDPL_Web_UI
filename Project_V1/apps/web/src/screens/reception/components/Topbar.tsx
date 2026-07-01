import React, { useState, useEffect, useRef } from 'react';
import { initials } from '../shared/initials';
import type { BellNotif } from '../types/reception.types';


interface TopbarProps {
  title: string;
  subtitle?: string;
  receptionistName: string;
  onHamburger: () => void;
  onProfileClick: () => void;
  onSignOut?: () => void;
  bellNotifs?: BellNotif[];
  markBellRead?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  title, subtitle, receptionistName, onHamburger, onProfileClick, onSignOut,
  bellNotifs = [] as BellNotif[], markBellRead,
}) => {
  const [time, setTime] = useState('');
  const [showBell, setShowBell] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Close bell panel on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setShowBell(false);
    };
    if (showBell) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showBell]);

  const unreadCount = bellNotifs.filter(n => !n.read).length;
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'long' });
  const abb = initials(receptionistName);

  const handleBellOpen = () => {
    setShowBell(o => !o);
    if (!showBell && markBellRead) markBellRead();
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="rc-header">
      <button className="rc-hamburger" onClick={onHamburger}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div>
        <div className="rc-header-title">{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 1 }}>{subtitle}</div>}
      </div>

      <div className="rc-header-spacer" />

      {/* Date */}
      <div className="rc-header-meta" style={{ display:'flex',alignItems:'center',gap:6,fontSize:13,color:'var(--ink-600)',fontWeight:500 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {today}
      </div>

      {/* Time */}
      <div className="rc-header-meta" style={{ display:'flex',alignItems:'center',gap:6,fontSize:13,color:'var(--ink-600)',fontWeight:500 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        {time}
      </div>

      {/* ── Bell icon with notification panel ── */}
      <div ref={bellRef} style={{ position:'relative' }}>
        <button
          onClick={handleBellOpen}
          style={{ position:'relative',width:38,height:38,borderRadius:9,border:'1px solid var(--line)',background:'var(--card)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.15s' }}
          onMouseEnter={e=>(e.currentTarget.style.background='var(--ink-50)')}
          onMouseLeave={e=>(e.currentTarget.style.background='var(--card)')}
          title="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-600)" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {/* Count badge */}
          {bellNotifs.length > 0 && (
            <span style={{
              position:'absolute', top:-5, right:-5,
              minWidth:18, height:18, padding:'0 5px',
              borderRadius:999, background: unreadCount>0?'var(--rose)':'var(--ink-400)',
              color:'white', fontSize:10.5, fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center',
              border:'2px solid white', lineHeight:1,
            }}>
              {bellNotifs.length > 99 ? '99+' : bellNotifs.length}
            </span>
          )}
        </button>

        {/* Notification panel */}
        {showBell && (
          <div style={{
            position:'fixed', top:72, right:16, zIndex:400,
            width:360, maxHeight:440, overflowY:'auto',
            background:'var(--card)', border:'1px solid var(--line)',
            borderRadius:'var(--radius)', boxShadow:'var(--shadow-lg)',
          }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontWeight:700, fontSize:14 }}>Notifications</div>
              {bellNotifs.length > 0 && (
                <span style={{ fontSize:12, color:'var(--ink-500)' }}>{bellNotifs.length} total</span>
              )}
            </div>

            {bellNotifs.length === 0 ? (
              <div style={{ padding:'36px 20px', textAlign:'center', color:'var(--ink-400)', fontSize:13.5 }}>
                <div style={{ fontSize:28, marginBottom:10 }}>🔔</div>
                No notifications yet.<br/>
                <span style={{ fontSize:12 }}>Doctor call notifications will appear here.</span>
              </div>
            ) : (
              bellNotifs.map((n, i) => (
                <div key={n.id} style={{
                  padding:'13px 18px',
                  borderBottom: i < bellNotifs.length-1 ? '1px solid var(--line)' : 'none',
                  background: n.read ? 'transparent' : 'var(--mineral-100)',
                  display:'flex', alignItems:'flex-start', gap:12,
                }}>
                  <div style={{ width:36,height:36,borderRadius:9,background:'var(--mineral-700)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>
                    🔔
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:700,fontSize:13,color:'var(--ink-900)',marginBottom:2 }}>
                      Doctor called — {n.patientName}
                    </div>
                    <div style={{ fontSize:12.5,color:'var(--ink-500)' }}>
                      {n.doctor} · Token {n.token}
                    </div>
                    <div style={{ fontSize:12,color:'var(--mineral-700)',marginTop:4,fontWeight:600 }}>
                      📢 Ask patient to proceed to the doctor's room
                    </div>
                  </div>
                  <div style={{ fontSize:11,color:'var(--ink-400)',flexShrink:0,marginTop:2 }}>
                    {formatTime(n.timestamp)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div style={{ width:1, height:22, background:'var(--border)' }} />

      {/* Profile */}
      <div className="rc-profile-wrap">
        <div className="rc-profile-avatar" onClick={onProfileClick}>{abb}</div>
        <div className="rc-profile-tooltip">
          <div className="rc-tt-avatar">{abb}</div>
          <div className="rc-tt-name">{receptionistName}</div>
          <div className="rc-tt-sub">Senior Receptionist</div>
          <div className="rc-tt-sub">reception@vexoo.in</div>
          <div className="rc-tt-divider" />
          <button className="rc-tt-action profile" onClick={onProfileClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            View / Edit Profile
          </button>
          <button className="rc-tt-action signout" onClick={onSignOut}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
