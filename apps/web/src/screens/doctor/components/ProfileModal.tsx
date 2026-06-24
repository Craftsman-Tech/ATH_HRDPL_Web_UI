import React, { useState } from 'react';
import { initials } from '../shared/initials';

interface ProfileModalProps { doctorName: string; onClose: () => void; }

interface ProfileData {
  name: string;
  specialisation: string;
  department: string;
  phone: string;
  email: string;
  employeeId: string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ doctorName, onClose }) => {
  // Seed editable profile from props + sensible defaults (mock — no backend yet).
  const [profile, setProfile] = useState<ProfileData>({
    name: doctorName,
    specialisation: 'Cardiologist',
    department: 'Outpatient',
    phone: '+91 98765 43210',
    email: 'doctor@vexoo.in',
    employeeId: 'DOC-2024-14',
  });
  const [mode, setMode]   = useState<'view' | 'edit'>('view');
  const [draft, setDraft] = useState<ProfileData>(profile);
  const [saved, setSaved] = useState(false);

  const abb = initials(profile.name);

  const startEdit  = () => { setDraft(profile); setSaved(false); setMode('edit'); };
  const cancelEdit = () => { setDraft(profile); setMode('view'); };
  const saveEdit   = () => {
    setProfile(draft);
    setMode('view');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };
  const set = (k: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft(d => ({ ...d, [k]: e.target.value }));

  return (
    <div className="dr-modal-backdrop" onClick={onClose}>
      <div className="dr-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div className="dr-modal-header">
          <div className="dr-modal-title">{mode === 'view' ? 'My Profile' : 'Edit Profile'}</div>
          <button className="dr-modal-close" onClick={onClose}>✕</button>
        </div>

        {mode === 'view' ? (
          <div className="dr-modal-body" style={{ textAlign: 'center', padding: '28px 24px' }}>
            {saved && <div className="dr-help-banner" style={{ marginBottom: 16 }}>Profile updated successfully.</div>}
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--mineral-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 26, margin: '0 auto 14px' }}>{abb}</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{profile.name}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{profile.specialisation}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{profile.email}</div>
            <div style={{ height: 1, background: 'var(--line)', margin: '16px 0' }} />
            {[['Employee ID', profile.employeeId], ['Specialisation', profile.specialisation], ['Department', profile.department], ['Phone', profile.phone]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="dr-modal-body" style={{ padding: '22px 26px' }}>
            <div className="dr-help-field">
              <label className="dr-help-label">Full Name</label>
              <input className="dr-help-input" value={draft.name} onChange={set('name')} />
            </div>
            <div className="dr-help-field">
              <label className="dr-help-label">Specialisation</label>
              <input className="dr-help-input" value={draft.specialisation} onChange={set('specialisation')} />
            </div>
            <div className="dr-help-field">
              <label className="dr-help-label">Department</label>
              <input className="dr-help-input" value={draft.department} onChange={set('department')} />
            </div>
            <div className="dr-help-field">
              <label className="dr-help-label">Phone</label>
              <input className="dr-help-input" value={draft.phone} onChange={set('phone')} />
            </div>
            <div className="dr-help-field" style={{ marginBottom: 0 }}>
              <label className="dr-help-label">Email</label>
              <input className="dr-help-input" value={draft.email} onChange={set('email')} />
            </div>
          </div>
        )}

        <div className="dr-modal-footer">
          {mode === 'view' ? (
            <>
              <button className="dr-btn-secondary" onClick={onClose}>Close</button>
              <button className="dr-btn-primary" onClick={startEdit}>Edit Profile</button>
            </>
          ) : (
            <>
              <button className="dr-btn-secondary" onClick={cancelEdit}>Cancel</button>
              <button className="dr-btn-primary" onClick={saveEdit}>Save Changes</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
