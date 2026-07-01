import React from 'react';
import { initials } from '../shared/PhHelpers';

export const ProfileModal: React.FC<{ pharmacistName: string; onClose: () => void }> = ({ pharmacistName, onClose }) => (
  <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(11,15,14,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, backdropFilter: 'blur(2px)' }}>
    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 16, padding: 28, width: 420, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(11,15,14,0.2)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
        <div style={{ width: 56, height: 56, borderRadius: 13, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 700 }}>{initials(pharmacistName)}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{pharmacistName}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Clinical Pharmacist · Pharmacy Portal</div>
        </div>
      </div>
      {[['Full Name', pharmacistName], ['Email', 'pharmacy@vexoo.in'], ['Phone', '+91 98765 11223'], ['Reg. No.', 'PHARM/2017/AP/00731'], ['Role', 'Clinical Pharmacist']].map(([label, val]) => (
        <div key={label} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5 }}>{label}</div>
          <input defaultValue={val} style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)' }} />
        </div>
      ))}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5 }}>Close</button>
        <button style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600 }}>Save Changes</button>
      </div>
    </div>
  </div>
);
