/**
 * ContactStep.tsx — Step 2: primary contact (becomes the Hospital Admin),
 * preferred .vexoo.in sub-domain, and an optional secondary contact.
 */
import React from 'react';
import type { StepProps } from '../types/register.types';

export const ContactStep: React.FC<StepProps> = ({ form, set }) => (
  <>
    <h3 className="vxreg-sec">Primary contact (becomes Hospital Admin)</h3>

    <div className="vxreg-2">
      <div><div className="vxreg-lbl">Full name <span className="req">*</span></div><input className="vxreg-inp" placeholder="Dr. Priya Iyer" value={form.contactName || ''} onChange={set('contactName')} /></div>
      <div><div className="vxreg-lbl">Designation</div><input className="vxreg-inp" placeholder="Medical Director" value={form.designation || ''} onChange={set('designation')} /></div>
    </div>

    <div className="vxreg-2">
      <div><div className="vxreg-lbl">Mobile <span className="req">*</span></div><input className="vxreg-inp vxreg-mono" placeholder="+91 98765 43210" value={form.mobile || ''} onChange={set('mobile')} /></div>
      <div><div className="vxreg-lbl">WhatsApp (optional)</div><input className="vxreg-inp vxreg-mono" placeholder="+91 98765 43210" value={form.whatsapp || ''} onChange={set('whatsapp')} /></div>
    </div>

    <div className="vxreg-f">
      <div className="vxreg-lbl">Email <span className="req">*</span></div>
      <input className="vxreg-inp" type="email" placeholder="priya@suvarnahospital.in" value={form.email || ''} onChange={set('email')} />
      <div className="vxreg-help">Verification and onboarding emails — including admin credentials on approval — go here.</div>
    </div>

    <div className="vxreg-f">
      <div className="vxreg-lbl">Preferred admin sub-domain</div>
      <div className="vxreg-combo">
        <input className="vxreg-inp" placeholder="suvarna" value={form.subdomain || ''} onChange={set('subdomain')} />
        <span className="suffix">.vexoo.in</span>
      </div>
      <div className="vxreg-help">Tenant URL where your staff will sign in. Subject to availability.</div>
    </div>

    <h3 className="vxreg-sec">Secondary contact (optional)</h3>

    <div className="vxreg-2">
      <div><div className="vxreg-lbl">Name</div><input className="vxreg-inp" placeholder="Optional" value={form.contact2Name || ''} onChange={set('contact2Name')} /></div>
      <div><div className="vxreg-lbl">Phone</div><input className="vxreg-inp vxreg-mono" placeholder="Optional" value={form.contact2Phone || ''} onChange={set('contact2Phone')} /></div>
    </div>
  </>
);
