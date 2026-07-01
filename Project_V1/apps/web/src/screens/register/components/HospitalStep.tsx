/**
 * HospitalStep.tsx — Step 1: hospital identity, GST/PAN, and address.
 * India-first field set (GSTIN 15, PAN 10, 6-digit PIN, full State/UT list).
 */
import React from 'react';
import { ESTABLISHMENT_TYPES, OWNERSHIP_TYPES, STATES } from '../data/registerOptions';
import type { StepProps } from '../types/register.types';

export const HospitalStep: React.FC<StepProps> = ({ form, set }) => (
  <>
    <h3 className="vxreg-sec">Hospital identity</h3>

    <div className="vxreg-f">
      <div className="vxreg-lbl">Hospital / establishment name <span className="req">*</span></div>
      <input className="vxreg-inp" placeholder="e.g. Suvarna Multi-Speciality Hospital" value={form.name || ''} onChange={set('name')} />
      <div className="vxreg-help">Public name as it should appear to patients and on prescriptions.</div>
    </div>

    <div className="vxreg-2">
      <div>
        <div className="vxreg-lbl">Type of establishment</div>
        <select className="vxreg-sel" value={form.type || ''} onChange={set('type')}>
          <option value="">Select…</option>
          {ESTABLISHMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <div className="vxreg-lbl">Ownership</div>
        <select className="vxreg-sel" value={form.ownership || ''} onChange={set('ownership')}>
          <option value="">Select…</option>
          {OWNERSHIP_TYPES.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
    </div>

    <div className="vxreg-3">
      <div><div className="vxreg-lbl">Bed capacity</div><input className="vxreg-inp" type="number" placeholder="0" value={form.beds || ''} onChange={set('beds')} /></div>
      <div><div className="vxreg-lbl">Established</div><input className="vxreg-inp" type="number" placeholder="2018" value={form.est || ''} onChange={set('est')} /></div>
      <div><div className="vxreg-lbl">GSTIN</div><input className="vxreg-inp vxreg-mono" placeholder="36AAAAA0000A1Z5" maxLength={15} value={form.gstin || ''} onChange={set('gstin')} /></div>
    </div>

    <div className="vxreg-2">
      <div><div className="vxreg-lbl">PAN (establishment)</div><input className="vxreg-inp vxreg-mono" placeholder="AAAAA0000A" maxLength={10} value={form.pan || ''} onChange={set('pan')} /></div>
      <div><div className="vxreg-lbl">Specialities offered</div><input className="vxreg-inp" placeholder="Cardiology, Ortho, OB-GYN…" value={form.specialities || ''} onChange={set('specialities')} /></div>
    </div>

    <h3 className="vxreg-sec">Address</h3>

    <div className="vxreg-f">
      <div className="vxreg-lbl">Street / building <span className="req">*</span></div>
      <textarea className="vxreg-ta" placeholder="Plot 14, Road No. 3, Banjara Hills" value={form.street || ''} onChange={set('street')} />
    </div>

    <div className="vxreg-3">
      <div><div className="vxreg-lbl">City <span className="req">*</span></div><input className="vxreg-inp" placeholder="Hyderabad" value={form.city || ''} onChange={set('city')} /></div>
      <div><div className="vxreg-lbl">District <span className="req">*</span></div><input className="vxreg-inp" placeholder="Hyderabad" value={form.district || ''} onChange={set('district')} /></div>
      <div><div className="vxreg-lbl">PIN <span className="req">*</span></div><input className="vxreg-inp vxreg-mono" placeholder="500034" maxLength={6} value={form.pin || ''} onChange={set('pin')} /></div>
    </div>

    <div className="vxreg-f">
      <div className="vxreg-lbl">State / UT <span className="req">*</span></div>
      <select className="vxreg-sel" value={form.state || ''} onChange={set('state')}>
        <option value="">Select state…</option>
        {STATES.map((s) => <option key={s}>{s}</option>)}
      </select>
    </div>
  </>
);
