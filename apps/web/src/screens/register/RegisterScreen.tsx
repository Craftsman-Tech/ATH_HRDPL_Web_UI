/**
 * ============================================================================
 *  RegisterScreen.tsx — public hospital registration (root orchestrator)
 * ============================================================================
 *  Route: /register  (PUBLIC — a registering hospital has no account yet)
 *  Reached from Sign-In via "Register Here".
 *
 *  Mirrors the Super-Admin "+ Register Hospital" drawer, trimmed to THREE steps
 *  and tailored to Indian hospital registrations:
 *      1 Hospital · 2 Contact · 3 License (with document upload)
 *  (The drawer's 4th "Approvals" step is intentionally omitted — approvals are
 *   a founder action, not part of self-service registration.)
 *
 *  Folder layout matches every portal:
 *    components/  RegisterStepper, HospitalStep, ContactStep, LicenseStep,
 *                 UploadTile, RegisterSuccess
 *    data/        registerOptions (states, types, document checklist)
 *    shared/      RegisterCSS (scoped .vxreg styles), Icon
 *    types/       register.types
 *
 *  Self-contained: only React + react-router. Styles are scoped under `.vxreg`
 *  via <style>{CSS}</style>, so nothing leaks into/out of any portal.
 * ============================================================================
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CSS } from './shared/RegisterCSS';
import { Icon } from './shared/Icon';
import { DOCS } from './data/registerOptions';

import { RegisterStepper } from './components/RegisterStepper';
import { HospitalStep } from './components/HospitalStep';
import { ContactStep } from './components/ContactStep';
import { LicenseStep } from './components/LicenseStep';
import { RegisterSuccess } from './components/RegisterSuccess';

import { VexooGlyph } from '../../components/VexooMark';

import type {
  DocId,
  RegistrationForm,
  StepId,
  UploadedFiles,
} from './types/register.types';

export default function RegisterScreen() {
  const nav = useNavigate();

  const [step, setStep] = useState<StepId>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<RegistrationForm>({});
  const [files, setFiles] = useState<UploadedFiles>({});

  // set('name') -> onChange handler (works for input / select / textarea).
  const set =
    (key: keyof RegistrationForm) =>
    (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const pickFile = (id: DocId, name: string) => setFiles((f) => ({ ...f, [id]: name }));
  const clearFile = (id: DocId) =>
    setFiles((f) => {
      const next = { ...f };
      delete next[id];
      return next;
    });

  // Load Vexoo fonts so a direct /register visit still renders the type family.
  useEffect(() => {
    const id = 'vexoo-register-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  const goto = (n: StepId) => setStep(Math.min(3, Math.max(1, n)) as StepId);

  // Minimal gating. Step 1 needs identity + address basics; final submit needs
  // the primary-contact essentials and every required document.
  const step1ok = !!(form.name && form.city && form.district && form.state && form.pin && form.street);
  const canSubmit = useMemo(
    () =>
      !!(form.name && form.contactName && form.email && form.mobile) &&
      DOCS.filter((d) => d.required).every((d) => files[d.id]),
    [form, files],
  );

  const reference = useMemo(() => 'VX-REG-' + Math.random().toString(36).slice(2, 8).toUpperCase(), []);

  const next = () => {
    if (step < 3) { goto((step + 1) as StepId); return; }
    if (!canSubmit) return;
    // TODO(backend): POST `form` + uploaded files to the Vexoo onboarding
    // endpoint; the Super-Admin "Approvals" queue then picks it up.
    setSubmitted(true);
  };

  // Shared header (used by both the form and the success view).
  const Bar = (
    <div className="vxreg-bar">
      <div className="vxreg-brand">
        <div className="vxreg-mark"><VexooGlyph size={19} /></div>
        <div>
          <div className="vxreg-word">Vexoo One<span className="ath">ATH</span></div>
          <div className="vxreg-sub">Hospital registration</div>
        </div>
      </div>
      {!submitted && (
        <button className="vxreg-back" onClick={() => nav(-1)}>
          <Icon d="M19 12H5M12 19l-7-7 7-7" size={15} /> Back to sign in
        </button>
      )}
    </div>
  );

  if (submitted) {
    return (
      <div className="vxreg">
        <style>{CSS}</style>
        {Bar}
        <div className="vxreg-shell">
          <div className="vxreg-card">
            <RegisterSuccess form={form} reference={reference} onBack={() => nav(-1)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vxreg">
      <style>{CSS}</style>
      {Bar}

      <div className="vxreg-shell">
        <div className="vxreg-eyebrow"><span className="dot" /> New hospital</div>
        <h1 className="vxreg-title">Register your <em>hospital</em></h1>
        <p className="vxreg-lede">
          Tell us about your establishment and upload your statutory documents. Our team reviews every
          submission before activating a tenant and issuing admin credentials.
        </p>
        <div className="vxreg-india">
          <Icon d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" size={13} /> Fields follow Indian hospital registration norms
        </div>

        <div className="vxreg-card">
          <RegisterStepper step={step} onGoto={goto} />

          <div className="vxreg-body">
            {step === 1 && <HospitalStep form={form} set={set} />}
            {step === 2 && <ContactStep form={form} set={set} />}
            {step === 3 && (
              <LicenseStep form={form} set={set} files={files} onPick={pickFile} onClear={clearFile} />
            )}
          </div>

          <div className="vxreg-foot">
            <span className="vxreg-prog">Step {step} of 3</span>
            <div className="vxreg-actions">
              <button className="vxreg-btn vxreg-btn-ghost" disabled={step === 1} onClick={() => goto((step - 1) as StepId)}>
                Back
              </button>
              <button
                className="vxreg-btn vxreg-btn-primary"
                disabled={(step === 1 && !step1ok) || (step === 3 && !canSubmit)}
                onClick={next}
              >
                {step === 3 ? (
                  <><Icon d="m20 6-11 11-5-5" size={15} sw={2.4} /> Submit registration</>
                ) : (
                  <>Continue <Icon d="M5 12h14M12 5l7 7-7 7" size={15} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
