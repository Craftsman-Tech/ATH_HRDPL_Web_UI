import React from 'react';
import type { ScreenId, NavItem } from '../types/doctor.types';
import { initials } from '../shared/initials';

interface SidebarProps {
  active: ScreenId;
  onNav: (s: ScreenId) => void;
  mobileOpen: boolean;
  doctorName: string;
  onSignOut?: () => void;
  navItems: NavItem[];
}

const SI: React.FC<{ d: string; size?: number }> = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

// Only 4 items remain per requirements — Medical Records / Prescriptions /
// Lab Orders were folded into the Consultation form.
export const NAV: NavItem[] = [
  { id: 'queue',    label: "Today's Queue", path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { id: 'patients', label: 'My Patients',    path: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'messages', label: 'Messages',       path: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { id: 'schedule', label: 'My Schedule',    path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

export const Sidebar: React.FC<SidebarProps> = ({ active, onNav, mobileOpen, doctorName, onSignOut, navItems }) => {
  const abb = initials(doctorName);
  return (
    <aside className={`dr-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="dr-logo-row">
        <div className="dr-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>
        </div>
        <div>
          <div style={{ color: 'white', fontWeight: 900, fontSize: 16, letterSpacing: '-0.3px' }}>Vexoo</div>
          <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Doctor Portal</div>
        </div>
      </div>

      <nav className="dr-nav" style={{ marginTop: 8 }}>
        {navItems.map(item => {
          const on = active === item.id;
          return (
            <button key={item.id} className={`dr-nav-btn ${on ? 'active' : 'inactive'}`} onClick={() => onNav(item.id)}>
              <SI d={item.path} size={17} />
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.badge !== undefined && <span className="dr-nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="dr-sidebar-footer">
        <div className="dr-user-identity">
          <div className="dr-user-avatar">{abb}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'white', fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doctorName}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#4ade80', marginRight: 5 }} />
              Online
            </div>
          </div>
        </div>
        <button className="dr-signout-btn" onClick={onSignOut} type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
};
