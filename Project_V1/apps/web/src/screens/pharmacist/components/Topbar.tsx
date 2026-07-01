import React, { useState } from 'react';
import { SvgIcon, initials } from '../shared/PhHelpers';

export const Topbar: React.FC<{
  title: string; onHamburger: () => void;
  pharmacistName: string; onProfileClick: () => void; onSignOut?: () => void;
}> = ({ title, onHamburger, pharmacistName, onProfileClick, onSignOut }) => {
  const [search, setSearch] = useState('');
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const abb = initials(pharmacistName);

  return (
    <header className="ph-header">
      <button className="ph-hamburger" onClick={onHamburger} aria-label="Open menu">
        <SvgIcon path="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" size={22} color="var(--text)" />
      </button>
      <div>
        <div className="ph-header-title">{title}</div>
        <div className="ph-header-date">{today}</div>
      </div>
      <div className="ph-header-spacer" />
      <div className="ph-search-box">
        <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" size={14} color="var(--text-muted)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prescriptions, medicines..." />
      </div>
      <button className="ph-help-btn" aria-label="Help">
        <SvgIcon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" size={15} color="currentColor" />
        <span>Help</span>
      </button>
      <div className="ph-profile-wrap">
        <div className="ph-header-avatar" onClick={onProfileClick}>{abb}</div>
        <div className="ph-profile-tooltip">
          <div className="ph-tt-avatar">{abb}</div>
          <div className="ph-tt-name">{pharmacistName}</div>
          <div className="ph-tt-sub">Clinical Pharmacist</div>
          <div className="ph-tt-sub">pharmacy@vexoo.in</div>
          <div className="ph-tt-divider" />
          <button className="ph-tt-action profile" onClick={onProfileClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            View / Edit Profile
          </button>
          <button className="ph-tt-action signout" onClick={onSignOut}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};
