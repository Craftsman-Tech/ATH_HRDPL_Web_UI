/**
 * RegisterFacilityDrawer.tsx — 3-step "Register a pharmacy / laboratory" flow.
 *   1 Pharmacy|Laboratory · 2 Contact · 3 License
 * A single config-driven drawer that mirrors the hospital RegisterDrawer look &
 * feel (same stepper, fields, upload toggles) but swaps every label/field for
 * the chosen facility. Step nav, the stepper and document-upload toggles are
 * interactive. "Generate & activate" (step 3) calls onGenerate → credentials.
 *
 * Rendered as a sibling of <main> (outside any transformed ancestor) so the
 * fixed drawer is never trapped by a CSS transform stacking context.
 */
import React, { useEffect, useState } from 'react';
import { Icon } from '../shared/Icons';

export type FacilityKind = 'pharmacy' | 'laboratory';

const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5 };
const monoSm: React.CSSProperties = { ...mono, fontSize: 12 };

type LicenseField = { label: string; placeholder?: string; mono?: boolean; date?: boolean };

interface FacilityConfig {
  Glyph: React.FC<{ size?: number }>;
  eyebrow: string;          // drawer eyebrow text
  titleEm: string;          // italic word in the drawer title
  stepLabel: string;        // first stepper label
  identityTitle: string;    // first section heading
  nameLabel: string;
  namePlaceholder: string;
  nameHelper: string;
  regPlaceholder: string;
  types: string[];
  capacityLabel: string;
  establishedPlaceholder: string;
  streetPlaceholder: string;
  adminRole: string;        // "...will become Pharmacy Admin"
  contactName: string;
  contactDesignation: string;
  contactPhone: string;
  contactEmail: string;
  subdomain: string;
  licenseTitle: string;
  licenseRows: [LicenseField, LicenseField][];
  preUploaded: { name: string; size: string };
  uploads: { label: string; meta: string }[];
}

const FACILITY: Record<FacilityKind, FacilityConfig> = {
  pharmacy: {
    Glyph: Icon.Pill,
    eyebrow: 'New pharmacy',
    titleEm: 'pharmacy',
    stepLabel: 'Pharmacy',
    identityTitle: 'Pharmacy identity',
    nameLabel: 'Pharmacy name',
    namePlaceholder: 'e.g. Suvarna Care Pharmacy',
    nameHelper: 'Public name as it should appear to patients and on bills.',
    regPlaceholder: 'PHARM/TS/2026/00518',
    types: ['Retail pharmacy', 'Hospital pharmacy', 'Wholesale / distribution', 'Compounding', 'Online / e-pharmacy'],
    capacityLabel: 'Billing counters',
    establishedPlaceholder: '2019',
    streetPlaceholder: 'Shop 4, Road No. 3, Banjara Hills',
    adminRole: 'Pharmacy Admin',
    contactName: 'Mr. Arun Verma',
    contactDesignation: 'Chief Pharmacist',
    contactPhone: '+91 98765 43210',
    contactEmail: 'arun@suvarnacare.in',
    subdomain: 'suvarnacare',
    licenseTitle: 'Legal & license details',
    licenseRows: [
      [{ label: 'Drug license — Form 20 (retail)', placeholder: '20B-TS-HYD/14782', mono: true }, { label: 'Valid until', date: true }],
      [{ label: 'Drug license — Form 21 (wholesale)', placeholder: '21B-TS-HYD/14783', mono: true }, { label: 'Valid until', date: true }],
      [{ label: 'Pharmacist-in-charge reg. (State Council)', placeholder: 'TSPC/2017/04821', mono: true }, { label: 'GSTIN', placeholder: '36AAAAA0000A1Z5', mono: true }],
    ],
    preUploaded: { name: 'drug-license-form20.pdf', size: '224 KB' },
    uploads: [
      { label: 'Upload Form 21 (wholesale)', meta: 'PDF · ≤ 5 MB' },
      { label: 'Upload GST certificate', meta: 'PDF · ≤ 5 MB' },
      { label: 'Upload pharmacist registration', meta: 'PDF, JPG · ≤ 2 MB' },
    ],
  },
  laboratory: {
    Glyph: Icon.Beaker,
    eyebrow: 'New laboratory',
    titleEm: 'laboratory',
    stepLabel: 'Laboratory',
    identityTitle: 'Laboratory identity',
    nameLabel: 'Laboratory name',
    namePlaceholder: 'e.g. Suvarna Diagnostics & Labs',
    nameHelper: 'Public name as it should appear to patients and on reports.',
    regPlaceholder: 'LAB/TS/2026/00731',
    types: ['Pathology lab', 'Radiology / imaging', 'Diagnostic centre', 'Collection centre', 'Reference lab'],
    capacityLabel: 'Collection points',
    establishedPlaceholder: '2018',
    streetPlaceholder: 'Plot 22, Road No. 1, Jubilee Hills',
    adminRole: 'Lab Admin',
    contactName: 'Dr. Meera Nair',
    contactDesignation: 'Lab Director',
    contactPhone: '+91 98765 43210',
    contactEmail: 'meera@suvarnadiagnostics.in',
    subdomain: 'suvarnalabs',
    licenseTitle: 'Legal & accreditation details',
    licenseRows: [
      [{ label: 'Clinical Establishments Act No.', placeholder: 'CEA/TS/HYD/2024/01182', mono: true }, { label: 'Valid until', date: true }],
      [{ label: 'NABL accreditation no.', placeholder: 'MC-2841', mono: true }, { label: 'Valid until', date: true }],
      [{ label: 'Bio-medical waste authorisation', placeholder: 'BMW/TSPCB/2024/4421', mono: true }, { label: 'PCPNDT registration', placeholder: 'PCPNDT/TS/2023/0912', mono: true }],
    ],
    preUploaded: { name: 'nabl-certificate.pdf', size: '262 KB' },
    uploads: [
      { label: 'Upload CEA certificate', meta: 'PDF · ≤ 5 MB' },
      { label: 'Upload BMW authorisation', meta: 'PDF · ≤ 5 MB' },
      { label: 'Upload PCPNDT registration', meta: 'PDF, JPG · ≤ 2 MB' },
    ],
  },
};

export const RegisterFacilityDrawer: React.FC<{
  kind: FacilityKind | null;
  onClose: () => void;
  onGenerate: () => void;
}> = ({ kind, onClose, onGenerate }) => {
  const open = kind !== null;
  const [step, setStep] = useState(1);
  const [uploaded, setUploaded] = useState<boolean[]>([]);

  // Use the last known kind so content stays stable while the drawer slides out.
  const [active, setActive] = useState<FacilityKind>('pharmacy');
  const cfg = FACILITY[active];

  // On open: remember the kind, reset to step 1 and clear upload toggles.
  useEffect(() => {
    if (!kind) return;
    setActive(kind);
    setStep(1);
    setUploaded(FACILITY[kind].uploads.map(() => false));
  }, [kind]);

  const steps = [cfg.stepLabel, 'Contact', 'License'] as const;
  const goto = (n: number) => setStep(Math.min(3, Math.max(1, n)));
  const next = () => { if (step === 3) { onGenerate(); return; } goto(step + 1); };

  return (
    <>
      <div className={`drawer-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <header className="drawer-head">
          <div>
            <div className="drawer-eyebrow"><cfg.Glyph size={11} /> {cfg.eyebrow}</div>
            <h2 className="drawer-title">Register a <em>{cfg.titleEm}</em></h2>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close"><Icon.Close size={14} /></button>
        </header>

        <nav className="stepper">
          {steps.map((label, i) => {
            const n = i + 1;
            return (
              <button
                key={label}
                className={`step ${n === step ? 'active' : ''} ${n < step ? 'done' : ''}`}
                onClick={() => goto(n)}
              >
                <span className="step-num">{n}</span>
                <span className="step-label">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="drawer-body">
          {/* STEP 1 — Pharmacy / Laboratory identity */}
          {step === 1 && (
            <div className="step-pane">
              <h3 className="form-section-title">{cfg.identityTitle}</h3>
              <div className="field">
                <div className="lbl">{cfg.nameLabel} <span className="req">*</span></div>
                <input className="inp" placeholder={cfg.namePlaceholder} />
                <div className="helper">{cfg.nameHelper}</div>
              </div>
              <div className="field-2col">
                <div>
                  <div className="lbl">Registration number <span className="req">*</span></div>
                  <input className="inp" placeholder={cfg.regPlaceholder} style={mono} />
                </div>
                <div>
                  <div className="lbl">Type</div>
                  <select className="sel">
                    {cfg.types.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="field-3col">
                <div><div className="lbl">{cfg.capacityLabel}</div><input className="inp" type="number" placeholder="0" /></div>
                <div><div className="lbl">Established</div><input className="inp" type="number" placeholder={cfg.establishedPlaceholder} /></div>
                <div><div className="lbl">GSTIN</div><input className="inp" placeholder="36AAAAA0000A1Z5" style={monoSm} /></div>
              </div>

              <h3 className="form-section-title">Address</h3>
              <div className="field">
                <div className="lbl">Street address <span className="req">*</span></div>
                <textarea className="ta" placeholder={cfg.streetPlaceholder} />
              </div>
              <div className="field-3col">
                <div><div className="lbl">City <span className="req">*</span></div><input className="inp" placeholder="Hyderabad" /></div>
                <div>
                  <div className="lbl">State <span className="req">*</span></div>
                  <select className="sel">
                    <option>Telangana</option><option>Andhra Pradesh</option><option>Karnataka</option>
                    <option>Tamil Nadu</option><option>Maharashtra</option><option>Other…</option>
                  </select>
                </div>
                <div><div className="lbl">PIN</div><input className="inp" placeholder="500034" maxLength={6} style={mono} /></div>
              </div>

              <h3 className="form-section-title">Plan &amp; modules</h3>
              <div className="field-2col">
                <div>
                  <div className="lbl">Initial plan <span className="req">*</span></div>
                  <select className="sel"><option>Pilot — 30-day trial</option><option>Core</option><option>Scale</option><option>Enterprise</option></select>
                </div>
                <div>
                  <div className="lbl">Billing cycle</div>
                  <select className="sel"><option>Monthly</option><option>Quarterly</option><option>Annual</option></select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Contact */}
          {step === 2 && (
            <div className="step-pane">
              <h3 className="form-section-title">Primary contact (will become {cfg.adminRole})</h3>
              <div className="field-2col">
                <div><div className="lbl">Full name <span className="req">*</span></div><input className="inp" placeholder={cfg.contactName} /></div>
                <div><div className="lbl">Designation</div><input className="inp" placeholder={cfg.contactDesignation} /></div>
              </div>
              <div className="field-2col">
                <div><div className="lbl">Phone <span className="req">*</span></div><input className="inp" placeholder={cfg.contactPhone} style={mono} /></div>
                <div><div className="lbl">WhatsApp (optional)</div><input className="inp" placeholder="+91 98765 43210" style={mono} /></div>
              </div>
              <div className="field">
                <div className="lbl">Email <span className="req">*</span></div>
                <input className="inp" type="email" placeholder={cfg.contactEmail} />
                <div className="helper">Credentials and onboarding emails will be sent here.</div>
              </div>
              <div className="field">
                <div className="lbl">Admin sub-domain</div>
                <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid var(--ink-200)', borderRadius: 6, overflow: 'hidden', background: 'white' }}>
                  <input className="inp" placeholder={cfg.subdomain} style={{ border: 'none', flex: 1 }} />
                  <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', background: 'var(--ink-50)', color: 'var(--ink-600)', borderLeft: '1px solid var(--ink-200)', fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>.vexoo.in</span>
                </div>
                <div className="helper">Tenant URL where staff will sign in.</div>
              </div>
              <h3 className="form-section-title">Secondary contact</h3>
              <div className="field-2col">
                <div><div className="lbl">Name</div><input className="inp" placeholder="Optional" /></div>
                <div><div className="lbl">Phone</div><input className="inp" placeholder="Optional" style={mono} /></div>
              </div>
            </div>
          )}

          {/* STEP 3 — License */}
          {step === 3 && (
            <div className="step-pane">
              <h3 className="form-section-title">{cfg.licenseTitle}</h3>
              {cfg.licenseRows.map((row, ri) => (
                <div className="field-2col" key={ri}>
                  {row.map((f, fi) => (
                    <div key={fi}>
                      <div className="lbl">{f.label}</div>
                      {f.date
                        ? <input className="inp" type="date" />
                        : <input className="inp" placeholder={f.placeholder} style={f.mono ? monoSm : undefined} />}
                    </div>
                  ))}
                </div>
              ))}

              <h3 className="form-section-title">Document uploads</h3>
              <div className="upload uploaded">
                <Icon.File size={16} />
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--mineral-800)' }}>{cfg.preUploaded.name}</div>
                  <div className="helper" style={{ marginTop: 1 }}>Uploaded · ready for review</div>
                </div>
                <div className="upload-meta">{cfg.preUploaded.size}</div>
              </div>
              {cfg.uploads.map((u, i) => (
                <div
                  key={u.label}
                  className={`upload ${uploaded[i] ? 'uploaded' : ''}`}
                  onClick={() => setUploaded(arr => arr.map((v, j) => (j === i ? !v : v)))}
                >
                  {uploaded[i] ? <Icon.File size={16} /> : <Icon.Upload size={16} />}
                  <div>{uploaded[i] ? u.label.replace('Upload ', '') + ' · attached' : u.label}</div>
                  <div className="upload-meta">{uploaded[i] ? 'Ready' : u.meta}</div>
                </div>
              ))}

              <div className="modal-note" style={{ marginTop: 18 }}>
                <Icon.Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>On <b>Generate &amp; activate</b>, Vexoo will create the tenant database, provision the
                  admin account, and email login credentials to the primary contact. This action is logged
                  and reversible within 24 hours.</div>
              </div>
            </div>
          )}
        </div>

        <footer className="drawer-foot">
          <span className="progress">Step {step} of 3</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" disabled={step === 1} onClick={() => goto(step - 1)}>Back</button>
            <button className="btn btn-primary" onClick={next}>
              {step === 3 ? <><Icon.Check size={14} strokeWidth={2.5} /> Generate &amp; activate</> : 'Continue →'}
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
};
