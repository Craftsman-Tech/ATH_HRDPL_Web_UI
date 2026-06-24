import React, { useState } from 'react';
import { initials } from '../shared/initials';
import { useLab } from '../data/labStore';
import type { LabProfile } from '../types/labtech.types';

interface ProfileModalProps { techName: string; onClose: () => void; }

/** Editable rows shown in the body. key maps to a LabProfile field. */
const ROWS: { key: keyof LabProfile; label: string }[] = [
  { key: 'employeeId', label: 'Employee ID' },
  { key: 'section',    label: 'Section' },
  { key: 'shift',      label: 'Shift' },
  { key: 'phone',      label: 'Phone' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const lab = useLab();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [draft, setDraft]     = useState<LabProfile>(() => ({ ...lab.profile }));

  const abb = initials(draft.name || lab.profile.name);

  const setField = (k: keyof LabProfile, v: string) => setDraft(d => ({ ...d, [k]: v }));

  const handleSave = () => {
    lab.updateProfile(draft);
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => { setDraft({ ...lab.profile }); setEditing(false); };

  return (
    <div className="lt-modal-backdrop" onClick={onClose}>
      <div className="lt-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="lt-modal-header">
          <div className="lt-modal-title">{editing ? 'Edit Profile' : 'My Profile'}</div>
          <button className="lt-modal-close" onClick={onClose}>✕</button>
        </div>

        {saved && (
          <div className="lt-profile-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Profile edited successfully
          </div>
        )}

        <div className="lt-modal-body" style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--mineral-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 26, margin: '0 auto 14px' }}>{abb}</div>

            {editing ? (
              <>
                <input className="lt-profile-input center" value={draft.name}
                  onChange={e => setField('name', e.target.value)} placeholder="Full name" />
                <input className="lt-profile-input center sub" value={draft.role}
                  onChange={e => setField('role', e.target.value)} placeholder="Role / Designation" />
                <input className="lt-profile-input center sub" value={draft.email}
                  onChange={e => setField('email', e.target.value)} placeholder="Email" />
              </>
            ) : (
              <>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{lab.profile.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{lab.profile.role}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{lab.profile.email}</div>
              </>
            )}
          </div>

          <div style={{ height: 1, background: 'var(--line)', margin: '4px 0 14px' }} />

          {ROWS.map(({ key, label }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, marginBottom: 10, gap: 12 }}>
              <span style={{ color: 'var(--muted)', flexShrink: 0 }}>{label}</span>
              {editing ? (
                <input className="lt-profile-input" value={draft[key]}
                  onChange={e => setField(key, e.target.value)} />
              ) : (
                <span style={{ fontWeight: 600, textAlign: 'right' }}>{lab.profile[key]}</span>
              )}
            </div>
          ))}
        </div>

        <div className="lt-modal-footer">
          {editing ? (
            <>
              <button className="lt-btn-secondary" onClick={handleCancel}>Cancel</button>
              <button className="lt-btn-primary" onClick={handleSave}>Save Changes</button>
            </>
          ) : (
            <>
              <button className="lt-btn-secondary" onClick={onClose}>Close</button>
              <button className="lt-btn-primary" onClick={() => { setDraft({ ...lab.profile }); setEditing(true); }}>Edit Profile</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
