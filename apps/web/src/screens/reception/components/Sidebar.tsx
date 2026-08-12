import React from 'react';
import type { ScreenId, NavItem } from '../types/reception.types';
import { initials } from '../shared/initials';
import { VexooGlyph } from '../../../components/VexooMark';

interface SidebarProps {
  active: ScreenId;
  onNav: (s: ScreenId) => void;
  mobileOpen: boolean;
  receptionistName: string;
  onSignOut?: () => void;
  navItems: NavItem[];
}

const SI: React.FC<{ d: string; size?: number }> = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
    <path d={d} />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ active, onNav, mobileOpen, receptionistName, onSignOut, navItems }) => {
  const abb = initials(receptionistName);
  return (
    <aside className={`rc-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="rc-logo-row">
        <div className="rc-logo-icon">
          <VexooGlyph size={20} />
        </div>
        <div>
          <div style={{ color:'white', fontWeight:900, fontSize:16, letterSpacing:'-0.3px' }}>Vexoo One</div>
          <div style={{ color:'rgba(255,255,255,0.38)', fontSize:10, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>Reception Portal</div>
        </div>
      </div>

      <nav className="rc-nav" style={{ marginTop:8 }}>
        {navItems.map(item => {
          const on = active === item.id;
          return (
            <button key={item.id} className={`rc-nav-btn ${on ? 'active' : 'inactive'}`} onClick={() => onNav(item.id)}>
              <SI d={item.icon} size={17} />
              <span style={{ flex:1, textAlign:'left' }}>{item.label}</span>
              {item.badge !== undefined && <span className="rc-nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="rc-sidebar-footer">
        <div className="rc-user-identity">
          <div className="rc-user-avatar">{abb}</div>
          <div>
            <div style={{ color:'white', fontSize:12.5, fontWeight:700 }}>{receptionistName}</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>
              <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:'#4ade80', marginRight:5 }} />
              Logged In
            </div>
          </div>
        </div>
        <button className="rc-logout-btn" onClick={onSignOut}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};
