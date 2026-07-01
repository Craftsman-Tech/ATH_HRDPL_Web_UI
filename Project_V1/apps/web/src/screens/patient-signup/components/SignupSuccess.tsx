/**
 * SignupSuccess.tsx — confirmation panel after a successful sign-up.
 * Surfaces the auto-generated Patient ID and a "Continue to Patient Portal"
 * button that signs the new patient in and routes them to /patient.
 */
import React from 'react';
import { Icon } from '../shared/Icon';

export const SignupSuccess: React.FC<{
  firstName: string;
  patientId: string;
  familyCount: number;
  onContinue: () => void;
}> = ({ firstName, patientId, familyCount, onContinue }) => (
  <div className="vxpat-done">
    <div className="vxpat-done-ic"><Icon d="m20 6-11 11-5-5" size={28} sw={2.6} /></div>
    <div className="vxpat-done-title">You're all set{firstName ? `, ${firstName}` : ''}</div>
    <p className="vxpat-done-sub">
      Your patient account is ready{familyCount > 0 ? ` with ${familyCount} family member${familyCount > 1 ? 's' : ''} linked` : ''}.
      Keep your Patient ID handy — clinics use it to pull up your record.
    </p>
    <div className="vxpat-idcard">
      <span className="k">Patient ID</span>
      <span className="v">{patientId}</span>
    </div>
    <button className="vxpat-btn vxpat-btn-primary" onClick={onContinue}>
      Continue to Patient Portal <Icon d="M5 12h14M12 5l7 7-7 7" size={15} />
    </button>
  </div>
);
