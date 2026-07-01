/**
 * Sidebar.tsx — dark left navigation for the Super Admin portal.
 * Matches the "ATH · Support Console" reference: a scrollable Operations +
 * Platform nav list, with a pinned foot showing the signed-in agent and an
 * explicit "Sign out" button (the profile menu itself lives in the topbar).
 */
import React from 'react';
import type { ViewId } from '../types/admin.types';
import { NAV_OPERATIONS, NAV_PLATFORM } from '../data/mockData';
import { Icon } from '../shared/Icons';
import { initials } from '../shared/initials';

const NAV_ICON: Record<ViewId, React.FC<{ size?: number }>> = {
  dashboard: Icon.Dashboard,
  hospitals: Icon.Hospital,
  approvals: Icon.Approvals,
  licenses:  Icon.License,
  activity:  Icon.Activity,
  analytics: Icon.Analytics,
  billing:   Icon.Billing,
  settings:  Icon.Settings,
};

export const Sidebar: React.FC<{
  view: ViewId;
  onNav: (v: ViewId) => void;
  adminName: string;
  adminRole: string;
  onSignOut?: () => void;
}> = ({ view, onNav, adminName, adminRole, onSignOut }) => {
  const renderItem = (item: { id: ViewId; label: string; count?: number; hot?: boolean }) => {
    const I = NAV_ICON[item.id];
    return (
      <button
        key={item.id}
        className={`nav-item ${view === item.id ? 'active' : ''}`}
        onClick={() => onNav(item.id)}
      >
        <I size={14} />
        {item.label}
        {item.count !== undefined && (
          <span className={`nav-count ${item.hot ? 'hot' : ''}`}>{item.count}</span>
        )}
      </button>
    );
  };

  return (
    <aside className="nav">
      <div className="nav-logo">
        <div className="nav-mark"><Icon.Logo size={18} style={{ color: '#FAFAF7' }} /></div>
        <div>
          <div className="nav-wordmark">Vexoo<span className="ath">ATH</span></div>
          <div className="nav-sub">Support Console</div>
        </div>
      </div>

      <div className="nav-scroll">
        <div className="nav-section">Operations</div>
        {NAV_OPERATIONS.map(renderItem)}

        <div className="nav-section">Platform</div>
        {NAV_PLATFORM.map(renderItem)}
      </div>

      <div className="nav-foot">
        <div className="nav-user">
          <div className="nav-avatar">{initials(adminName)}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="nav-user-name">{adminName}</div>
            <div className="nav-user-role">{adminRole}</div>
          </div>
        </div>
        <button className="nav-logout" onClick={() => onSignOut?.()}>
          <Icon.SignOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
};
