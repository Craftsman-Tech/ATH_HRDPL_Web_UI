/**
 * RegisterSuccess.tsx — confirmation panel shown after a successful submit.
 * Carries a generated reference number; "Back to sign in" returns the user.
 */
import React from 'react';
import { Icon } from '../shared/Icon';
import type { RegistrationForm } from '../types/register.types';

export const RegisterSuccess: React.FC<{
  form: RegistrationForm;
  reference: string;
  onBack: () => void;
}> = ({ form, reference, onBack }) => (
  <div className="vxreg-done">
    <div className="vxreg-done-ic"><Icon d="m20 6-11 11-5-5" size={28} sw={2.6} /></div>
    <div className="vxreg-done-title">Registration submitted</div>
    <p className="vxreg-done-sub">
      Thanks{form.contactName ? `, ${form.contactName.split(' ')[0]}` : ''}. Our onboarding team will verify
      your documents and reach out at <b>{form.email || 'your email'}</b> shortly. You'll receive admin
      credentials once your hospital is approved.
    </p>
    <div className="vxreg-ref">Reference&nbsp;·&nbsp;{reference}</div>
    <button className="vxreg-btn vxreg-btn-primary" onClick={onBack}>Back to sign in</button>
  </div>
);
