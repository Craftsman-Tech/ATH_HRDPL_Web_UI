import React, { useState, useEffect, useRef } from 'react';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';
import { TITLES, SEARCH_INDEX, NOTIF_DATA } from '../data/mockNav';
import type { ScreenId, Member } from '../types/patient.types';

interface TopbarProps {
  screen: ScreenId;
  member: Member;
  onNav: (s: ScreenId) => void;
  onProfile: () => void;
  onMenuToggle: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ screen, member, onNav, onProfile, onMenuToggle }) => {
  const [q, setQ] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [dismissed, setDismissed] = useState<number[]>([]);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const bellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const results = q.trim()
    ? SEARCH_INDEX.filter(r => r.label.toLowerCase().includes(q.trim().toLowerCase()))
    : SEARCH_INDEX.slice(0, 4);

  const visibleNotifs = NOTIF_DATA.filter((_, i) => !dismissed.includes(i));

  return (
    <header className="topbar">
      <button className="mob-menu-btn" onClick={onMenuToggle} aria-label="Open menu"><Icon name="menu" size={20} /></button>
      <div className="topbar-title">
        <h1>{TITLES[screen].t}</h1>
        <p>{TITLES[screen].s}</p>
      </div>

      <div className="gsearch" ref={wrapRef}>
        <Icon name="search" size={17} />
        <input value={q} placeholder="Search records, meds, labs…"
          onFocus={() => setSearchOpen(true)}
          onChange={e => { setQ(e.target.value); setSearchOpen(true); }} />
        <span className="gsearch-kbd">⌘K</span>
        {searchOpen && (
          <div className="gsearch-pop">
            <div className="gsearch-cat">{q.trim() ? 'Results' : 'Quick links'}</div>
            {results.length
              ? results.map(r => (
                <button key={r.label} className="gsearch-res" onClick={() => { onNav(r.to); setSearchOpen(false); setQ(''); }}>
                  <span className="gsearch-ic"><Icon name={r.ic} size={15} /></span>
                  <span className="gsearch-label">{r.label}</span>
                  <span className="gsearch-type">{r.type}</span>
                </button>
              ))
              : <div className="gsearch-empty">No matches for "{q}"</div>}
          </div>
        )}
      </div>

      <div className="topbar-r">
        <div style={{ position: 'relative' }} ref={bellRef}>
          <button className="icon-btn" onClick={() => setBellOpen(o => !o)}>
            {visibleNotifs.length > 0 && <span className="icon-dot" />}
            <Icon name="bell" size={18} />
          </button>
          {bellOpen && (
            <div style={{ position:'absolute',top:50,right:0,width:340,background:'#fff',border:'1px solid var(--line)',borderRadius:16,boxShadow:'var(--shadow-lg)',zIndex:200,overflow:'hidden' }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',borderBottom:'1px solid var(--line)' }}>
                <span style={{ fontWeight:700,fontSize:14 }}>Notifications</span>
                <button className="icon-btn" style={{ width:28,height:28,borderRadius:8 }} onClick={() => setBellOpen(false)}><Icon name="x" size={15} /></button>
              </div>
              {visibleNotifs.length === 0
                ? <div className="empty" style={{ padding:28 }}><Icon name="check" size={22} /><div>All caught up!</div></div>
                : visibleNotifs.map((n, vi) => {
                    const origIdx = NOTIF_DATA.indexOf(n);
                    return (
                      <div key={origIdx} style={{ display:'flex',gap:12,padding:'13px 16px',borderBottom:'1px solid var(--line2)',background:n.bg }}>
                        <div style={{ width:34,height:34,borderRadius:10,background:'#fff',color:n.color,display:'grid',placeItems:'center',flexShrink:0 }}>
                          <Icon name={n.ic} size={16} />
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:'flex',justifyContent:'space-between',fontSize:13,fontWeight:700 }}>
                            {n.title}<span style={{ fontSize:11,color:'var(--ink3)',fontWeight:500 }}>{n.time}</span>
                          </div>
                          <div style={{ fontSize:12,color:'var(--ink2)',marginTop:2 }}>{n.text}</div>
                        </div>
                        <button onClick={() => setDismissed(d => [...d, origIdx])} style={{ color:'var(--ink3)',fontSize:18,lineHeight:1,alignSelf:'flex-start' }}>×</button>
                      </div>
                    );
                  })}
            </div>
          )}
        </div>

        <button className="topbar-user" onClick={onProfile}>
          <Avatar name={member.name} size={32} fs={12} />
          <div className="tu-text">
            <div className="tu-name">{member.name}</div>
            <div className="tu-role">View profile</div>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
