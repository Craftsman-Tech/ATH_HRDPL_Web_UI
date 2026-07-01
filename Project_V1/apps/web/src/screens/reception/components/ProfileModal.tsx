import React, { useState } from 'react';
import { initials } from '../shared/initials';

// ── Editable profile shape ──────────────────────────────────────────────────
// Lives here so both this modal and ReceptionScreen can share the same type.
export interface ReceptionProfile {
  name: string;
  role: string;
  email: string;
  employeeId: string;
  department: string;
  shift: string;
  phone: string;
}

// Seed values (the `name` field is overridden by the signed-in receptionist
// name inside ReceptionScreen). Kept here so the default is colocated with the
// type that describes it.
export const DEFAULT_RECEPTION_PROFILE: ReceptionProfile = {
  name:       'Maria Lopez',
  role:       'Senior Receptionist',
  email:      'reception@vexoo.in',
  employeeId: 'REC-2024-07',
  department: 'Front Desk',
  shift:      'Morning (8 AM – 4 PM)',
  phone:      '+91 91234 56789',
};

interface ProfileModalProps {
  profile: ReceptionProfile;
  onSave: (p: ReceptionProfile) => void;
  onClose: () => void;
}

// Inline input styling so we don't have to touch ReceptionCSS for this fix.
const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  border: '1px solid var(--line)',
  borderRadius: 9,
  fontSize: 13.5,
  fontFamily: 'inherit',
  color: 'var(--ink-900)',
  background: 'var(--card)',
  outline: 'none',
  boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  marginBottom: 5,
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onSave, onClose }) => {
  // `editing` flips the body between read-only rows and an editable form.
  // `draft` holds in-progress edits so Cancel can discard them cleanly.
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState<ReceptionProfile>(profile);

  const abb = initials(editing ? draft.name : profile.name);

  const startEdit  = () => { setDraft(profile); setEditing(true); };
  const cancelEdit = () => { setDraft(profile); setEditing(false); };
  const save       = () => { onSave(draft); setEditing(false); };

  const set = (k: keyof ReceptionProfile) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setDraft(d => ({ ...d, [k]: e.target.value }));

  // Disable Save if the two required fields are blank.
  const canSave = draft.name.trim() !== '' && draft.email.trim() !== '';

  return (
    <div className="rc-modal-backdrop" onClick={onClose}>
      <div className="rc-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div className="rc-modal-header">
          <div className="rc-modal-title">{editing ? 'Edit Profile' : 'My Profile'}</div>
          <button className="rc-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="rc-modal-body" style={{ padding: '24px' }}>
          {/* Avatar + identity — shared by both modes */}
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--mineral-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 26, margin: '0 auto 14px' }}>{abb}</div>
            {!editing && (
              <>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{profile.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{profile.role}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{profile.email}</div>
              </>
            )}
          </div>

          <div style={{ height: 1, background: 'var(--line)', margin: '0 0 18px' }} />

          {editing ? (
            // ── EDIT MODE ──────────────────────────────────────────────
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} value={draft.name} onChange={set('name')} placeholder="Full name" />
              </div>
              <div>
                <label style={labelStyle}>Role / Designation</label>
                <input style={inputStyle} value={draft.role} onChange={set('role')} placeholder="Role" />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" value={draft.email} onChange={set('email')} placeholder="name@vexoo.in" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Employee ID</label>
                  <input style={inputStyle} value={draft.employeeId} onChange={set('employeeId')} placeholder="REC-0000-00" />
                </div>
                <div>
                  <label style={labelStyle}>Department</label>
                  <input style={inputStyle} value={draft.department} onChange={set('department')} placeholder="Front Desk" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Shift</label>
                <input style={inputStyle} value={draft.shift} onChange={set('shift')} placeholder="Morning (8 AM – 4 PM)" />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle} value={draft.phone} onChange={set('phone')} placeholder="+91 …" />
              </div>
            </div>
          ) : (
            // ── VIEW MODE ──────────────────────────────────────────────
            <div>
              {([
                ['Employee ID', profile.employeeId],
                ['Department',  profile.department],
                ['Shift',       profile.shift],
                ['Phone',       profile.phone],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rc-modal-footer">
          {editing ? (
            <>
              <button className="rc-btn-secondary" onClick={cancelEdit}>Cancel</button>
              <button className="rc-btn-primary" onClick={save} disabled={!canSave} style={!canSave ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}>Save Changes</button>
            </>
          ) : (
            <>
              <button className="rc-btn-secondary" onClick={onClose}>Close</button>
              <button className="rc-btn-primary" onClick={startEdit}>Edit Profile</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
