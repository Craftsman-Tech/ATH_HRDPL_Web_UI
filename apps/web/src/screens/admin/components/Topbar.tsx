import React from 'react';
import type { ViewId, NavItem } from '../types/admin.types';
import { initials } from '../shared/initials';
import { SvgIcon } from '../shared/SvgIcon';
import { NAV_ITEMS } from '../data/mockData';

export const Topbar: React.FC<{
  view: ViewId; onNav: (v: ViewId) => void;
  adminName: string; adminRole: string;
  onProfileClick: () => void; onSignOut?: () => void;
}> = ({ view, onNav, adminName, adminRole, onProfileClick, onSignOut }) => {
  const abb = initials(adminName);
  return (
    <header className="topbar">
      <div className="topbar-logo">
        <div className="topbar-logo-icon">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
          </svg>
        </div>
        <div>
          <div style={{ fontWeight:900, fontSize:15, letterSpacing:'-0.4px' }}>Vexoo</div>
          <div style={{ fontSize:9.5, color:'rgba(255,255,255,0.4)', letterSpacing:'0.5px' }}>FOUNDERS' CONSOLE</div>
        </div>
      </div>
      <nav className="topbar-nav">
        {NAV_ITEMS.map(item => (
          <button key={item.id} className={`topbar-nav-btn ${view === item.id ? 'active' : ''}`} onClick={() => onNav(item.id)}>
            <SvgIcon path={item.path} size={14} color="currentColor" />
            {item.label}
            {item.badge && <span className="topbar-nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="topbar-spacer" />
      <div className="topbar-right">
        <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.35)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday:'short', year:'numeric', month:'short', day:'numeric' })}
        </div>
        <button className="topbar-alert-btn" aria-label="Notifications">
          <SvgIcon path="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" size={16} color="rgba(255,255,255,0.6)" />
          <span className="topbar-alert-dot" />
        </button>
        <div className="topbar-profile-wrap">
          <div className="topbar-profile-avatar" onClick={onProfileClick}>{abb}</div>
          <div className="topbar-profile-tooltip">
            <div className="vx-tt-avatar">{abb}</div>
            <div className="vx-tt-name">{adminName}</div>
            <div className="vx-tt-sub">{adminRole}</div>
            <div className="vx-tt-sub">superadmin@vexoo.in</div>
            <div className="vx-tt-divider" />
            <button className="vx-tt-action profile" onClick={onProfileClick}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              View / Edit Profile
            </button>
            <button className="vx-tt-action signout" onClick={onSignOut}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
