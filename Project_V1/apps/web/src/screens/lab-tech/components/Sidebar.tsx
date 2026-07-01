import React from 'react';
import type { ScreenId, NavItem } from '../types/labtech.types';
import { initials } from '../shared/initials';

interface SidebarProps {
  active: ScreenId;
  onNav: (s: ScreenId) => void;
  mobileOpen: boolean;
  techName: string;
  onSignOut?: () => void;
  navItems: NavItem[];
}

const SI: React.FC<{ d: string; size?: number }> = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ active, onNav, mobileOpen, techName, onSignOut, navItems }) => {
  const abb = initials(techName);
  return (
    <aside className={`lt-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="lt-logo-row">
        <div className="lt-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
          </svg>
        </div>
        <div>
          <div style={{ color: 'white', fontWeight: 900, fontSize: 16, letterSpacing: '-0.3px' }}>Vexoo</div>
          <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Lab Technician Portal</div>
        </div>
      </div>

      <nav className="lt-nav" style={{ marginTop: 8 }}>
        {navItems.map(item => {
          const on = active === item.id;
          return (
            <button key={item.id} className={`lt-nav-btn ${on ? 'active' : 'inactive'}`} onClick={() => onNav(item.id)}>
              <SI d={item.path} size={17} />
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.badge !== undefined && <span className="lt-nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="lt-sidebar-footer">
        <div className="lt-user-identity">
          <div className="lt-user-avatar">{abb}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'white', fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{techName}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#4ade80', marginRight: 5 }} />
              Online
            </div>
          </div>
        </div>
        <button className="lt-signout-btn" onClick={onSignOut} type="button">
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
