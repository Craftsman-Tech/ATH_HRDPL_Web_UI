import React from 'react';
import type { ModuleId } from '../types/hospitaladmin.types';
import { NAV } from '../data/mockHaData';
import { SvgIcon, initials } from '../shared/HaHelpers';

export const Sidebar: React.FC<{
  active: ModuleId; onNav: (m: ModuleId) => void;
  collapsed: boolean; onToggle: () => void;
  mobileOpen: boolean; adminName: string; onSignOut?: () => void;
}> = ({ active, onNav, collapsed, onToggle, mobileOpen, adminName, onSignOut }) => {
  const abb = initials(adminName);
  return (
    <nav className={`ha-sidebar ${collapsed ? 'collapsed' : 'expanded'} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="ha-logo-row">
        <div className="ha-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
          </svg>
        </div>
        {!collapsed && <span className="ha-logo-text">Vexoo</span>}
        <button className="ha-collapse-btn" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
          <SvgIcon path={collapsed ? 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' : 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'} size={14} color="white" />
        </button>
      </div>
      {!collapsed && <div className="ha-nav-section-label">Main Menu</div>}
      <div className="ha-nav">
        {NAV.map(item => (
          <button key={item.id} className={`ha-nav-btn ${active===item.id ? 'active' : ''}`}
            title={collapsed ? item.label : ''} onClick={() => onNav(item.id)}>
            <SvgIcon path={item.path} size={18} color="currentColor" />
            {!collapsed && <span style={{ whiteSpace:'nowrap' }}>{item.label}</span>}
            {!collapsed && item.badge && <span className="ha-nav-badge">{item.badge}</span>}
            {collapsed  && item.badge && <span className="ha-nav-badge-dot" />}
          </button>
        ))}
      </div>
      <div className="ha-user-row">
        <div className="ha-user-identity">
          <div className="ha-avatar">{abb}</div>
          {!collapsed && (
            <div style={{ minWidth:0 }}>
              <div className="ha-user-name">{adminName}</div>
              <div className="ha-user-role">Administrator</div>
            </div>
          )}
        </div>
        <button className="ha-signout-btn" onClick={onSignOut} type="button" title="Sign out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </nav>
  );
};
