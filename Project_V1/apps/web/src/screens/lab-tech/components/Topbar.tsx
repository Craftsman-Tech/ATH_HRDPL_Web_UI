import React, { useState, useEffect } from 'react';
import { initials } from '../shared/initials';
import { useLab } from '../data/labStore';

interface TopbarProps {
  title: string;
  subtitle?: string;
  techName: string;
  onHamburger: () => void;
  onProfileClick: () => void;
  onSignOut?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ title, subtitle, techName, onHamburger, onProfileClick, onSignOut }) => {
  const { profile } = useLab();
  const name = profile.name || techName;
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'long' });
  const abb = initials(name);

  return (
    <div className="lt-header">
      <button className="lt-hamburger" onClick={onHamburger}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div>
        <div className="lt-header-title">{title}</div>
        {subtitle && <div className="lt-header-date">{subtitle}</div>}
      </div>

      <div className="lt-header-spacer" />

      <div className="lt-meta-chip">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {today}
      </div>

      <div className="lt-meta-chip">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        {time}
      </div>

      <div style={{ width: 1, height: 22, background: 'var(--border)' }} />

      <div className="lt-profile-wrap">
        <div className="lt-profile-avatar" onClick={onProfileClick}>{abb}</div>
        <div className="lt-profile-tooltip">
          <div className="lt-tt-avatar">{abb}</div>
          <div className="lt-tt-name">{name}</div>
          <div className="lt-tt-sub">{profile.role}</div>
          <div className="lt-tt-sub">{profile.email}</div>
          <div className="lt-tt-divider" />
          <button className="lt-tt-action profile" onClick={onProfileClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            View / Edit Profile
          </button>
          <button className="lt-tt-action signout" onClick={onSignOut}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
