/**
 * RegisterDrawer.tsx — 4-step "Register a hospital" flow.
 *   1 Hospital · 2 Contact · 3 License · 4 Approvals
 * Step nav, stepper, document-upload toggles and founder checkboxes are all
 * interactive. "Generate & activate" (step 4) calls onGenerate → credentials.
 *
 * Rendered as a sibling of <main> (outside any transformed ancestor) so the
 * fixed drawer is never trapped by a CSS transform stacking context.
 */
import React, { useEffect, useState } from 'react';
import { Icon } from '../shared/Icons';

const STEPS = ['Hospital', 'Contact', 'License', 'Approvals'] as const;

const CHECKS = [
  { title: 'Identity & documents verified', desc: 'CEA, drug license, GSTIN and signatory ID match the registered entity.', init: true },
  { title: 'DPDP / data-processing agreement signed', desc: 'Hospital has accepted the data-protection addendum and patient-consent flow.', init: true },
  { title: 'Onboarding call scheduled', desc: 'A 45-min walkthrough is on the calendar with the hospital admin.', init: false },
  { title: 'Billing & payment method on file', desc: 'Pilot tenants can be activated without billing; Core+ requires a method on file.', init: false },
];

const UPLOADS = [
  { label: 'Upload drug-license PDF', meta: 'PDF · ≤ 5 MB' },
  { label: 'Upload GST certificate', meta: 'PDF · ≤ 5 MB' },
  { label: 'Upload signatory PAN / ID', meta: 'PDF, JPG · ≤ 2 MB' },
];

export const RegisterDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  onGenerate: () => void;
}> = ({ open, onClose, onGenerate }) => {
  const [step, setStep] = useState(1);
  const [checks, setChecks] = useState<boolean[]>(CHECKS.map(c => c.init));
  const [uploaded, setUploaded] = useState<boolean[]>(UPLOADS.map(() => false));

  // reset to step 1 each time the drawer is opened
  useEffect(() => { if (open) { setStep(1); } }, [open]);

  const goto = (n: number) => setStep(Math.min(4, Math.max(1, n)));
  const next = () => { if (step === 4) { onGenerate(); return; } goto(step + 1); };

  const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5 };

  return (
    <>
      <div className={`drawer-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <header className="drawer-head">
          <div>
            <div className="drawer-eyebrow"><Icon.Plus size={11} /> New tenant</div>
            <h2 className="drawer-title">Register a <em>hospital</em></h2>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close"><Icon.Close size={14} /></button>
        </header>

        <nav className="stepper">
          {STEPS.map((label, i) => {
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
          {/* STEP 1 — Hospital */}
          {step === 1 && (
            <div className="step-pane">
              <h3 className="form-section-title">Hospital identity</h3>
              <div className="field">
                <div className="lbl">Hospital name <span className="req">*</span></div>
                <input className="inp" placeholder="e.g. Suvarna Multi-Speciality Hospital" />
                <div className="helper">Public name as it should appear to patients and on prescriptions.</div>
              </div>
              <div className="field-2col">
                <div>
                  <div className="lbl">Registration number <span className="req">*</span></div>
                  <input className="inp" placeholder="HOSP/AP/2026/00824" style={mono} />
                </div>
                <div>
                  <div className="lbl">Type</div>
                  <select className="sel">
                    <option>Multi-speciality</option><option>Single-speciality</option>
                    <option>Day-care / OPD</option><option>Maternity</option>
                    <option>Dental</option><option>Diagnostic centre</option>
                  </select>
                </div>
              </div>
              <div className="field-3col">
                <div><div className="lbl">Bed capacity</div><input className="inp" type="number" placeholder="0" /></div>
                <div><div className="lbl">Established</div><input className="inp" type="number" placeholder="2018" /></div>
                <div><div className="lbl">GSTIN</div><input className="inp" placeholder="36AAAAA0000A1Z5" style={{ ...mono, fontSize: 12 }} /></div>
              </div>

              <h3 className="form-section-title">Address</h3>
              <div className="field">
                <div className="lbl">Street address <span className="req">*</span></div>
                <textarea className="ta" placeholder="Plot 14, Road No. 3, Banjara Hills" />
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
              <h3 className="form-section-title">Primary contact (will become Hospital Admin)</h3>
              <div className="field-2col">
                <div><div className="lbl">Full name <span className="req">*</span></div><input className="inp" placeholder="Dr. Priya Iyer" /></div>
                <div><div className="lbl">Designation</div><input className="inp" placeholder="Medical Director" /></div>
              </div>
              <div className="field-2col">
                <div><div className="lbl">Phone <span className="req">*</span></div><input className="inp" placeholder="+91 98765 43210" style={mono} /></div>
                <div><div className="lbl">WhatsApp (optional)</div><input className="inp" placeholder="+91 98765 43210" style={mono} /></div>
              </div>
              <div className="field">
                <div className="lbl">Email <span className="req">*</span></div>
                <input className="inp" type="email" placeholder="priya@suvarnahospital.in" />
                <div className="helper">Credentials and onboarding emails will be sent here.</div>
              </div>
              <div className="field">
                <div className="lbl">Admin sub-domain</div>
                <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid var(--ink-200)', borderRadius: 6, overflow: 'hidden', background: 'white' }}>
                  <input className="inp" placeholder="suvarna" style={{ border: 'none', flex: 1 }} />
                  <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', background: 'var(--ink-50)', color: 'var(--ink-600)', borderLeft: '1px solid var(--ink-200)', fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>.vexoo.in</span>
                </div>
                <div className="helper">Tenant URL where hospital staff will sign in.</div>
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
              <h3 className="form-section-title">Legal &amp; license details</h3>
              <div className="field-2col">
                <div><div className="lbl">Clinical Establishments Act No.</div><input className="inp" placeholder="CEA/TS/HYD/2024/01182" style={{ ...mono, fontSize: 12 }} /></div>
                <div><div className="lbl">Valid until</div><input className="inp" type="date" /></div>
              </div>
              <div className="field-2col">
                <div><div className="lbl">Drug license (Form 20/21)</div><input className="inp" placeholder="20B-AP-HYD/14782" style={{ ...mono, fontSize: 12 }} /></div>
                <div><div className="lbl">Valid until</div><input className="inp" type="date" /></div>
              </div>
              <div className="field-2col">
                <div><div className="lbl">Bio-medical waste authorisation</div><input className="inp" placeholder="BMW/TSPCB/2024/4421" style={{ ...mono, fontSize: 12 }} /></div>
                <div>
                  <div className="lbl">NABH / NABL</div>
                  <select className="sel"><option>None</option><option>NABH — Entry level</option><option>NABH — Full</option><option>NABL accredited lab</option></select>
                </div>
              </div>

              <h3 className="form-section-title">Document uploads</h3>
              <div className="upload uploaded">
                <Icon.File size={16} />
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--mineral-800)' }}>cea-certificate.pdf</div>
                  <div className="helper" style={{ marginTop: 1 }}>Uploaded · ready for review</div>
                </div>
                <div className="upload-meta">218 KB</div>
              </div>
              {UPLOADS.map((u, i) => (
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
            </div>
          )}

          {/* STEP 4 — Approvals */}
          {step === 4 && (
            <div className="step-pane">
              <h3 className="form-section-title">Founder approvals (your sign-off)</h3>
              <p className="helper" style={{ marginBottom: 12 }}>
                Confirm each item before generating credentials. Founders must approve all four to activate the tenant.
              </p>
              {CHECKS.map((c, i) => (
                <div
                  key={c.title}
                  className={`check-row ${checks[i] ? 'checked' : ''}`}
                  onClick={() => setChecks(arr => arr.map((v, j) => (j === i ? !v : v)))}
                >
                  <div className="check-box"><Icon.Check size={11} /></div>
                  <div>
                    <div className="check-title">{c.title}</div>
                    <div className="check-desc">{c.desc}</div>
                  </div>
                </div>
              ))}

              <h3 className="form-section-title">Founder note (internal)</h3>
              <textarea className="ta" placeholder="Anything the team should know — referral source, special pricing, deployment quirks…" />

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
          <span className="progress">Step {step} of 4</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" disabled={step === 1} onClick={() => goto(step - 1)}>Back</button>
            <button className="btn btn-primary" onClick={next}>
              {step === 4 ? <><Icon.Check size={14} strokeWidth={2.5} /> Generate &amp; activate</> : 'Continue →'}
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
};
