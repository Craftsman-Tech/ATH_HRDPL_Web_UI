/**
 * MethodStep.tsx — first step: choose how to sign up.
 *
 *  • "Sign up using Google" — simulates Google auth, then hands back a mock
 *    gmail address + display name to the orchestrator (which auto-generates the
 *    Patient ID and advances to the details step).
 *  • "Sign up with Email"  — reveals a small name + email form; Continue does
 *    the same hand-off without the Google round-trip.
 *
 *  No real OAuth here — the backend will own account creation + Patient-ID
 *  issuance. This screen only collects identity.  TODO(backend): replace the
 *  simulated Google flow with the real OAuth redirect + token exchange.
 */
import React, { useState } from 'react';
import { Icon } from '../shared/Icon';

const GOOGLE_G =
  'M21.35 11.1H12v3.83h5.32c-.23 1.5-1.6 4.4-5.32 4.4a5.83 5.83 0 0 1 0-11.66c1.86 0 3.1.79 3.82 1.48l2.6-2.5C16.46 3.6 14.43 2.7 12 2.7a9.3 9.3 0 1 0 0 18.6c5.37 0 8.92-3.78 8.92-9.1 0-.61-.07-1.08-.17-1.55z';

export const MethodStep: React.FC<{
  onIdentity: (fullName: string, email: string) => void;
}> = ({ onIdentity }) => {
  const [mode, setMode] = useState<'pick' | 'email'>('pick');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  // Simulated Google sign-in: brief "redirect", then a mock account.
  const google = () => {
    setBusy(true);
    setTimeout(() => {
      // TODO(backend): real values come from the Google OAuth profile.
      onIdentity('Aarav Sharma', 'aarav.sharma@gmail.com');
    }, 650);
  };

  const emailOk = name.trim().length > 1 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  return (
    <div className="vxpat-body">
      <div className="vxpat-methods">
        <button className="vxpat-method" onClick={google} disabled={busy}>
          <span className="vxpat-method-ic g">
            <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#0E7C66" d={GOOGLE_G} /></svg>
          </span>
          <span className="vxpat-method-tx">
            <span className="vxpat-method-h">{busy ? 'Connecting to Google…' : 'Sign up using Google'}</span>
            <span className="vxpat-method-s">Fastest — we'll use your Google name &amp; email</span>
          </span>
          <span className="vxpat-method-arrow"><Icon d="M5 12h14M12 5l7 7-7 7" size={16} /></span>
        </button>

        {mode === 'pick' && (
          <>
            <div className="vxpat-or">or</div>
            <button className="vxpat-method" onClick={() => setMode('email')} disabled={busy}>
              <span className="vxpat-method-ic m">
                <Icon d="M4 4h16v16H4zM4 7l8 6 8-6" size={20} />
              </span>
              <span className="vxpat-method-tx">
                <span className="vxpat-method-h">Sign up with Email</span>
                <span className="vxpat-method-s">Use your name and an email address</span>
              </span>
              <span className="vxpat-method-arrow"><Icon d="M5 12h14M12 5l7 7-7 7" size={16} /></span>
            </button>
          </>
        )}

        {mode === 'email' && (
          <div className="vxpat-mailform">
            <div>
              <div className="vxpat-lbl">Full name <span className="req">*</span></div>
              <input
                className="vxpat-inp"
                placeholder="e.g. Aarav Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <div className="vxpat-lbl">Email <span className="req">*</span></div>
              <input
                className="vxpat-inp"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="vxpat-btn vxpat-btn-primary vxpat-btn-block"
              disabled={!emailOk}
              onClick={() => onIdentity(name.trim(), email.trim())}
            >
              Continue <Icon d="M5 12h14M12 5l7 7-7 7" size={15} />
            </button>
          </div>
        )}
      </div>

      <div className="vxpat-note">
        <Icon d="M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" size={16} />
        <span>Your Patient ID is generated automatically once you continue — no need to choose one.</span>
      </div>
    </div>
  );
};
