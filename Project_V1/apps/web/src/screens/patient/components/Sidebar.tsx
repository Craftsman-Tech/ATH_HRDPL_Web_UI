import React from 'react';
import Icon from '../shared/Icon';
import { NAV } from '../data/mockNav';
import type { ScreenId } from '../types/patient.types';

interface SidebarProps {
  active: ScreenId;
  onNav: (s: ScreenId) => void;
  onSignOut?: () => void;
  mobileOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onNav, onSignOut, mobileOpen }) => (
  <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
    <div className="brand">
      <div className="brand-mark">
        <svg width="22" height="22" viewBox="0 0 100 100">
          <path d="M50 72s-18-10-18-25a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 15-18 25-18 25z" fill="none" stroke="#fff" strokeWidth="6" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <div className="brand-name">Vexoo</div>
        <div className="brand-tag">Patient Portal</div>
      </div>
    </div>

    <nav className="nav">
      {NAV.map(n => (
        <button key={n.id} className={`nav-item ${active === n.id ? 'on' : ''}`} onClick={() => onNav(n.id)}>
          {active === n.id && <span className="nav-active" />}
          <span className="nav-ic"><Icon name={n.ic} size={19} /></span>
          <span className="nav-label">{n.label}</span>
          {n.badge && <span className="nav-badge">{n.badge}</span>}
        </button>
      ))}
    </nav>

    <div className="sidebar-foot">
      <div className="side-card">
        <div className="side-card-ic"><Icon name="heart" size={17} /></div>
        <div><div className="sct-title">Wellness 87</div><div className="sct-sub">Excellent · keep it up</div></div>
      </div>
      <button className="nav-item logout" onClick={onSignOut}>
        <span className="nav-ic"><Icon name="logout" size={18} /></span>
        <span className="nav-label">Logout</span>
      </button>
    </div>
  </aside>
);

export default Sidebar;
