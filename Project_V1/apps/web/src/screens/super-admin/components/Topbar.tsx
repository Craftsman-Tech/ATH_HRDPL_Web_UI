/**
 * Topbar.tsx — in-main sticky header (ATH · Support Console reference).
 *   breadcrumb · global search (⌘K / Ctrl-K) · notifications · profile menu.
 * The profile menu mirrors the reference: Your profile, My approval queue,
 * Settings, Reset demo state, Sign out. Menu classes are tb-prefixed so they
 * never collide with the ProfileModal's .pm-* styles.
 */
import React, { useEffect, useRef, useState } from 'react';
import type { ViewId } from '../types/admin.types';
import { CRUMB_LABELS, MY_QUEUE_COUNT } from '../data/mockData';
import { Icon } from '../shared/Icons';
import { initials } from '../shared/initials';

export const Topbar: React.FC<{
  view: ViewId;
  query: string;
  onQuery: (v: string) => void;
  onFocusSearch: () => void;     // switches to hospitals view when searching elsewhere
  adminName: string;
  adminEmail: string;
  onProfile: () => void;         // open the profile modal
  onNav: (v: ViewId) => void;    // navigate (approval queue / settings)
  onResetDemo: () => void;       // reset demo state
  onSignOut?: () => void;
  queueCount?: number;
}> = ({
  view, query, onQuery, onFocusSearch,
  adminName, adminEmail, onProfile, onNav, onResetDemo, onSignOut,
  queueCount = MY_QUEUE_COUNT,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // ⌘K / Ctrl-K focuses the search box
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // click-away closes the profile menu
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className="topbar">
      <nav className="breadcrumb">
        <span>ATH</span>
        <span className="sep">/</span>
        <span className="here">{CRUMB_LABELS[view]}</span>
      </nav>

      <div className="topbar-search">
        <Icon.Search size={14} />
        <input
          ref={inputRef}
          value={query}
          placeholder="Search hospitals, registrations, admins…"
          onChange={e => onQuery(e.target.value)}
          onFocus={onFocusSearch}
        />
        <span className="kbd">⌘K</span>
      </div>

      <button className="top-icon" title="Notifications" aria-label="Notifications">
        <Icon.Bell size={15} />
        <span className="ndot" />
      </button>

      <div className="profile-wrap" ref={wrapRef}>
        <button
          className="profile-btn"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span className="pf-av">{initials(adminName)}</span>
          <span className="pf-name">{adminName}</span>
          <Icon.Chevron size={13} strokeWidth={2.4} className="pf-caret" />
        </button>

        {menuOpen && (
          <div className="profile-menu" role="menu">
            <div className="tb-pm-head">
              <span className="tb-pm-av">{initials(adminName)}</span>
              <div style={{ minWidth: 0 }}>
                <div className="tb-pm-name">{adminName}</div>
                <div className="tb-pm-mail">{adminEmail}</div>
              </div>
            </div>

            <button className="tb-pm-item" role="menuitem" onClick={() => { close(); onProfile(); }}>
              <Icon.User size={15} /> Your profile
            </button>
            <button className="tb-pm-item" role="menuitem" onClick={() => { close(); onNav('approvals'); }}>
              <Icon.Approvals size={15} /> My approval queue
              <span className="nav-count mine">{queueCount}</span>
            </button>
            <button className="tb-pm-item" role="menuitem" onClick={() => { close(); onNav('settings'); }}>
              <Icon.Settings size={15} /> Settings
            </button>

            <div className="tb-pm-sep" />

            <button className="tb-pm-item" role="menuitem" onClick={() => { close(); onResetDemo(); }}>
              <Icon.Reset size={15} /> Reset demo state
            </button>
            <button className="tb-pm-item danger" role="menuitem" onClick={() => { close(); onSignOut?.(); }}>
              <Icon.SignOut size={15} /> Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
