/**
 * ProfileModal.tsx — founder profile view/edit, themed to the paper aesthetic.
 * Opened from the sidebar profile menu. Save Changes is a local mock (no API).
 */
import React, { useState } from 'react';
import { initials } from '../shared/initials';
import { FOUNDER } from '../data/mockData';

export const ProfileModal: React.FC<{
  adminName: string;
  adminRole: string;
  adminEmail?: string;
  onClose: () => void;
}> = ({ adminName, adminRole, adminEmail = FOUNDER.email, onClose }) => {
  const [saved, setSaved] = useState(false);

  const fields: [string, string][] = [
    ['Full name', adminName],
    ['Email', adminEmail],
    ['Phone', FOUNDER.phone],
    ['Role', adminRole],
    ['Access level', FOUNDER.access],
  ];

  return (
    <div className="pm-overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pm-card" role="dialog" aria-modal="true">
        <div className="pm-head">
          <div className="pm-avatar">{initials(adminName)}</div>
          <div>
            <div className="pm-name">{adminName}</div>
            <div className="pm-role">{adminRole} · Support Console</div>
          </div>
        </div>

        {fields.map(([label, val]) => (
          <div className="field" key={label}>
            <div className="lbl">{label}</div>
            <input className="inp" defaultValue={val} />
          </div>
        ))}

        <div className="pm-foot">
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => { setSaved(true); window.setTimeout(onClose, 650); }}
          >
            {saved ? 'Saved ✓' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
