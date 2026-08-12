import React from 'react';
import type { ScreenId } from '../types/pharmacist.types';
import { NAV } from '../data/mockPharmData';
import { SvgIcon, initials } from '../shared/PhHelpers';
import { VexooGlyph } from '../../../components/VexooMark';

export const Sidebar: React.FC<{
  active: ScreenId; onNav: (s: ScreenId) => void;
  collapsed: boolean; onToggle: () => void;
  mobileOpen: boolean; pharmacistName: string; onSignOut?: () => void;
}> = ({ active, onNav, collapsed, onToggle, mobileOpen, pharmacistName, onSignOut }) => {
  const abb = initials(pharmacistName);
  return (
    <nav className={`ph-sidebar ${collapsed ? 'collapsed' : 'expanded'} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="ph-logo-row">
        <div className="ph-logo-icon">
          <VexooGlyph size={20} />
        </div>
        {!collapsed && <span className="ph-logo-text">Vexoo One</span>}
        <button className="ph-collapse-btn" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
          <SvgIcon path={collapsed ? 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' : 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'} size={14} color="white" />
        </button>
      </div>
      {!collapsed && <div className="ph-nav-section-label">Pharmacy</div>}
      <div className="ph-nav">
        {NAV.map(item => (
          <button key={item.id} className={`ph-nav-btn ${active === item.id ? 'active' : ''}`}
            title={collapsed ? item.label : ''} onClick={() => onNav(item.id)}>
            <SvgIcon path={item.path} size={18} color="currentColor" />
            {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
            {!collapsed && item.badge && <span className="ph-nav-badge">{item.badge}</span>}
            {collapsed && item.badge && <span className="ph-nav-badge-dot" />}
          </button>
        ))}
      </div>
      <div className="ph-user-row">
        <div className="ph-user-identity">
          <div className="ph-avatar">{abb}</div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div className="ph-user-name">{pharmacistName}</div>
              <div className="ph-user-role">Clinical Pharmacist</div>
            </div>
          )}
        </div>
        <button className="ph-signout-btn" onClick={onSignOut} type="button" title="Sign out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </nav>
  );
};
