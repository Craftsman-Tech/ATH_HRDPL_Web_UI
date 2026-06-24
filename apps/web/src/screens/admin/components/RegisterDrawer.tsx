import React from 'react';

export const RegisterDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <>
    <div className="drawer-overlay" onClick={onClose} />
    <div className="drawer">
      <div className="drawer-header">
        <div className="drawer-title">Register New Hospital</div>
        <button className="btn-ghost btn-sm" onClick={onClose}>✕ Close</button>
      </div>
      <div className="drawer-body">
        <div className="field-row">
          <div><div className="field-label">Hospital Name</div><input className="field-input" placeholder="e.g. City Medical Centre" /></div>
          <div><div className="field-label">City</div><input className="field-input" placeholder="e.g. Hyderabad" /></div>
        </div>
        <div className="field-row">
          <div><div className="field-label">State</div><select className="field-select"><option>Telangana</option><option>Maharashtra</option><option>Tamil Nadu</option><option>Karnataka</option><option>Delhi</option></select></div>
          <div><div className="field-label">Hospital Type</div><select className="field-select"><option>Multi-speciality</option><option>General</option><option>Cardiac</option><option>Paediatric</option><option>Orthopaedic</option><option>Wellness</option></select></div>
        </div>
        <div className="field-row">
          <div><div className="field-label">Bed Count</div><input className="field-input" type="number" placeholder="e.g. 200" /></div>
          <div><div className="field-label">Subscription Plan</div><select className="field-select"><option>Starter</option><option>Professional</option><option>Enterprise</option></select></div>
        </div>
        <div className="field-full"><div className="field-label">Admin Contact Name</div><input className="field-input" placeholder="Hospital admin full name" /></div>
        <div className="field-row">
          <div><div className="field-label">Admin Email</div><input className="field-input" type="email" placeholder="admin@hospital.com" /></div>
          <div><div className="field-label">Admin Phone</div><input className="field-input" placeholder="+91 XXXXX XXXXX" /></div>
        </div>
        <div className="field-full"><div className="field-label">NABH / Accreditation No.</div><input className="field-input" placeholder="e.g. NABH/2024/MH/00182" /></div>
        <div className="field-full"><div className="field-label">Notes / Special Instructions</div><textarea className="field-textarea" rows={3} placeholder="Any notes for the registration team…" /></div>
      </div>
      <div className="drawer-footer">
        <button className="btn-primary" style={{ flex:1, justifyContent:'center' }}>Submit Registration</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  </>
);
