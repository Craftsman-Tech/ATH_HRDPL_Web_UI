/**
 * ============================================================================
 *  SignInScreen — Web
 * ============================================================================
 *  Pixel-faithful rewrite of the original Vexoo Sign In.html in proper React.
 *  Two-panel layout, role picker, English/Hindi/Telugu, light/dark theme.
 *
 *  Flow:
 *    1) User picks role + types email + password.
 *    2) Submit calls `signIn` from AuthContext.
 *    3) On success → react-router navigates to the role's dashboard.
 *    4) On failure → shows the i18n'd "Those credentials don't match…" note.
 * ============================================================================
 */
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Role, LangCode } from '@vexoo/shared';
import { useAuth }  from '../components/AuthContext';
import { useTheme, useLang } from '../components/ThemeContext';
import '../styles/signin.css';
import { VexooGlyph } from '../components/VexooMark';

// Role list — order and demo-email mapping matches the original.
const ROLES: { id: Role; demoEmail: string }[] = [
  { id: 'Admin',        demoEmail: 'admin@vexoo.in'     },
  { id: 'Doctor',       demoEmail: 'doctor@vexoo.in'    },
  { id: 'Receptionist', demoEmail: 'reception@vexoo.in' },
  { id: 'Pharmacist',   demoEmail: 'pharmacy@vexoo.in'  },
  { id: 'LabTech',      demoEmail: 'lab@vexoo.in'       },
];

// Where each role lands after signing in.
const ROLE_HOME: Record<Role, string> = {
  Admin:        '/admin',
  Doctor:       '/doctor',
  Receptionist: '/reception',
  Pharmacist:   '/pharmacy',
  LabTech:      '/lab',
};

// Simple SVG icon component to keep markup readable.
const Icon = ({ d, size = 13 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// SVG paths used in the role buttons (taken from the original mockup).
const ROLE_ICONS: Record<Role, string> = {
  Admin:        'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  Doctor:       'M22 12h-4l-3 9L9 3l-3 9H2',
  Receptionist: 'M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z',
  Pharmacist:   'M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z',
  LabTech:      'M6 2v6l2 2-6 10h16L12 10l2-2V2H6z',
};

// Self-contained styles for the two footer CTAs (clinic + patient registration)
// — injected via a <style> tag so styles/signin.css stays untouched. Scoped under
// .vx-cta-footer; uses the same mineral/ink palette vars as the rest of sign-in.
const VX_CTA_CSS = `
.vx-cta-footer{display:flex;flex-direction:column;align-items:stretch;gap:10px;margin-top:28px}
.vx-cta-row{display:flex;gap:10px}
.vx-cta-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:44px;padding:0 16px;border-radius:999px;font-family:'Inter Tight',Inter,system-ui,sans-serif;font-size:13px;font-weight:600;letter-spacing:.01em;cursor:pointer;transition:background .15s ease,border-color .15s ease,color .15s ease,transform .05s ease;white-space:nowrap}
.vx-cta-btn:active{transform:translateY(1px)}
.vx-cta-btn svg{flex:none}
.vx-cta-btn.primary{background:var(--vx-mineral,#0E7C66);border:1px solid var(--vx-mineral,#0E7C66);color:#FAFAF7}
.vx-cta-btn.primary:hover{background:var(--vx-mineral-deep,#0A4A3D);border-color:var(--vx-mineral-deep,#0A4A3D)}
.vx-cta-btn.ghost{background:transparent;border:1px solid var(--vx-line,#E4E6E4);color:var(--vx-text,#0B0F0E)}
.vx-cta-btn.ghost:hover{border-color:var(--vx-mineral,#0E7C66);color:var(--vx-mineral,#0E7C66)}
.vx-cta-help{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:2px;font-size:12px;color:var(--vx-muted,#6B7270)}
.vx-cta-help button{background:none;border:none;padding:0;cursor:pointer;color:var(--vx-mineral,#0E7C66);font-weight:600;font-family:inherit;font-size:12px}
.vx-cta-help button:hover{text-decoration:underline}
@media (max-width:420px){.vx-cta-row{flex-direction:column}}
`;

// Self-contained styles for the support modal — injected via a <style> tag so
// this works without touching styles/signin.css. Mineral/ink Vexoo palette;
// readable on both the light and dark sign-in themes.
const VX_HELP_CSS = `
.vx-help-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(11,15,14,.55);backdrop-filter:blur(3px);animation:vxHelpFade .16s ease}
@keyframes vxHelpFade{from{opacity:0}to{opacity:1}}
.vx-help-modal{width:100%;max-width:520px;max-height:92vh;overflow-y:auto;background:#FAFAF7;color:#0B0F0E;border:1px solid #E4E6E4;border-radius:18px;box-shadow:0 24px 60px rgba(11,15,14,.32);padding:24px;font-family:'Inter Tight',Inter,system-ui,sans-serif}
.vx-help-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:18px}
.vx-help-title{font-family:'Fraunces',Georgia,serif;font-size:21px;font-weight:500;letter-spacing:-.02em}
.vx-help-sub{font-size:13px;color:#6B7270;margin-top:3px}
.vx-help-x{width:34px;height:34px;flex-shrink:0;display:grid;place-items:center;border-radius:9px;border:1px solid #E4E6E4;background:#fff;color:#454C4B;cursor:pointer;transition:.15s}
.vx-help-x:hover{color:#0E7C66;border-color:#0E7C66}
.vx-help-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 14px;margin-bottom:14px}
.vx-help-field{margin-bottom:14px;display:flex;flex-direction:column}
.vx-help-grid .vx-help-field{margin-bottom:0}
.vx-help-label{font-size:11px;font-weight:600;color:#6B7270;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}
.vx-help-input,.vx-help-textarea{width:100%;box-sizing:border-box;font-family:inherit;font-size:14px;color:#0B0F0E;background:#fff;border:1px solid #E4E6E4;border-radius:10px;padding:10px 12px;transition:border-color .15s,box-shadow .15s}
.vx-help-input:focus,.vx-help-textarea:focus{outline:none;border-color:#0E7C66;box-shadow:0 0 0 3px rgba(14,124,102,.12)}
.vx-help-input[readonly]{background:#F5F6F4;color:#454C4B}
.vx-help-textarea{min-height:130px;resize:vertical;line-height:1.6}
.vx-help-upload{display:flex;align-items:center;gap:9px;width:100%;box-sizing:border-box;font-family:inherit;font-size:13.5px;font-weight:600;color:#454C4B;background:#F5F6F4;border:1px dashed #C4C8C6;border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:18px;transition:.15s}
.vx-help-upload:hover{border-color:#0E7C66;background:#EAF6F2;color:#0E7C66}
.vx-help-actions{display:flex;justify-content:flex-end;gap:10px}
.vx-help-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-family:inherit;font-size:14px;font-weight:600;color:#fff;background:#0E7C66;border:none;border-radius:11px;padding:11px 20px;cursor:pointer;transition:.15s}
.vx-help-btn:hover{background:#0A4A3D}
.vx-help-btn:disabled{opacity:.5;cursor:not-allowed}
.vx-help-btn.ghost{background:transparent;color:#454C4B;border:1px solid #E4E6E4}
.vx-help-btn.ghost:hover{background:#F5F6F4;color:#0B0F0E}
.vx-help-success{display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;padding:18px 6px 6px}
.vx-help-success-icon{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:#0E7C66;color:#fff;box-shadow:0 8px 20px rgba(14,124,102,.32)}
.vx-help-banner{background:#EAF6F2;color:#0A4A3D;border:1px solid #9FD6CD;border-radius:11px;padding:13px 16px;font-size:14px;font-weight:600;line-height:1.5}
@media(max-width:520px){.vx-help-grid{grid-template-columns:1fr}.vx-help-modal{padding:18px}}
`;

export default function SignInScreen() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const { mode, toggle } = useTheme();
  const { code: lang, set: setLang, t } = useLang();

  // Load the Vexoo type family (Fraunces + Inter Tight + JetBrains Mono) so the
  // sign-in matches the portals. Each portal injects this on mount; the sign-in
  // previously did not, so its Fraunces/Inter Tight fell back to system fonts.
  useEffect(() => {
    const id = 'vexoo-signin-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);

  // Form state
  const [role,     setRole]     = useState<Role>('Receptionist');
  const [email,    setEmail]    = useState('reception@vexoo.in');
  const [password, setPassword] = useState('');
  const [err,      setErr]      = useState('');
  const [loading,  setLoading]  = useState(false);

  // ── "Vexoo Customer Support" help form (self-contained; see modal below) ──
  const [showHelp,  setShowHelp]  = useState(false);
  const [helpName,  setHelpName]  = useState('');
  const [helpPhone, setHelpPhone] = useState('');
  const [helpEmail, setHelpEmail] = useState('');
  const [helpMsg,   setHelpMsg]   = useState('');
  const [helpFile,  setHelpFile]  = useState('');
  const [helpSent,  setHelpSent]  = useState(false);

  const openHelp = () => {
    // Prefill from whatever the user has already entered on the sign-in form.
    setHelpEmail(email);
    setHelpSent(false);
    setShowHelp(true);
  };
  const submitHelp = () => {
    if (!helpName.trim() || !helpMsg.trim()) return;
    // TODO(backend): POST to the Vexoo support endpoint.
    setHelpSent(true);
  };

  // Picking a role auto-fills the matching demo email — convenience that
  // shipped in the original design.
  const pickRole = (r: Role) => {
    setRole(r);
    const match = ROLES.find(x => x.id === r);
    if (match) setEmail(match.demoEmail);
    setErr('');
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    // 600ms delay simulates a network round-trip — keeps the spinner visible
    // long enough to feel realistic. Remove when wiring real auth.
    await new Promise(r => setTimeout(r, 600));
    const user = await signIn(email, password, role);
    setLoading(false);

    if (!user) { setErr(t.signIn.invalid); return; }
    nav(ROLE_HOME[user.role], { replace: true });
  };

  return (
    <div className="signin-shell">
      {/* ─── LEFT BRAND PANEL ─────────────────────────────────────── */}
      <section className="brand-panel" aria-hidden>
        <div className="orb-1" />
        <div className="orb-2" />

        <header className="brand-inner brand-logo">
          <div className="brand-logo-mark">
            <VexooGlyph size={21} />
          </div>
          <div>
            <div className="brand-logo-text">Vexoo One</div>
            <div className="brand-logo-sub">{t.signIn.estLine}</div>
          </div>
        </header>

        <div className="brand-inner brand-copy">
          <div className="brand-eyebrow">
            <span className="brand-eyebrow-dot" />
            {t.signIn.tagline1}
          </div>
          <h1 className="display brand-headline">
            {t.signIn.headlineA}<br />
            <em>{t.signIn.headlineB}</em> {t.signIn.headlineC}
          </h1>
          <p className="brand-desc">{t.signIn.desc}</p>

          <div className="brand-stats">
            <div className="brand-stat">
              <div className="brand-stat-val">6</div>
              <div className="brand-stat-label">{t.signIn.statRoles}</div>
            </div>
            <div className="brand-stat">
              <div className="brand-stat-val">14</div>
              <div className="brand-stat-label">{t.signIn.statModules}</div>
            </div>
            <div className="brand-stat">
              <div className="brand-stat-val mono" style={{ fontSize: 18, paddingTop: 4 }}>⌘K</div>
              <div className="brand-stat-label">{t.signIn.statSearch}</div>
            </div>
          </div>
        </div>

        <footer className="brand-inner brand-footer">
          <span>{t.signIn.copyright}</span>
          <span className="mono" style={{ fontSize: 11 }}>v1.0 · Hyderabad</span>
        </footer>
      </section>

      {/* ─── RIGHT FORM PANEL ─────────────────────────────────────── */}
      <section className="form-panel">
        {/* Theme toggle (top-right) */}
        <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme" title="Toggle theme">
          {mode === 'light'
            ? <Icon size={16} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            : <Icon size={16} d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4l1.4-1.4M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />}
        </button>

        <form className="form-wrap fade-up" onSubmit={onSubmit} noValidate autoComplete="off">
          <p className="form-welcome">{t.signIn.welcome}</p>
          <h2 className="display form-heading">{t.signIn.heading}</h2>
          <p className="form-sub">{t.signIn.sub}</p>

          {/* Role picker */}
          <div style={{ marginTop: 28 }}>
            <label className="field-label">{t.signIn.role}</label>
            <div className="role-picker">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  type="button"
                  data-role={r.id}
                  className={`role-btn ${role === r.id ? 'active' : ''}`}
                  onClick={() => pickRole(r.id)}
                >
                  <Icon d={ROLE_ICONS[r.id]} />
                  <span>{t.roles[r.id]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <div className="input-row">
              <label className="field-label" htmlFor="email">{t.signIn.email}</label>
            </div>
            <input
              id="email" type="email" className="input"
              value={email} onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <div className="input-row">
              <label className="field-label" htmlFor="password">{t.signIn.password}</label>
              <a href="#">{t.signIn.forgot}</a>
            </div>
            <input
              id="password" type="password" className="input"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? <><span className="spinner" />{t.common.loading}</>
              : <>{t.signIn.signin}
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg></>}
          </button>

          {err && <p className="error-note">{err}</p>}
          <p className="demo-note">{t.signIn.demo}</p>

          {/* Language switcher */}
          <div className="lang-row">
            <span className="lang-label">{t.signIn.language}</span>
            {(['en', 'hi', 'te'] as LangCode[]).map(c => (
              <button
                key={c} type="button"
                className={`lang-btn ${lang === c ? 'active' : ''}`}
                onClick={() => setLang(c)}
              >
                {c === 'en' ? 'English' : c === 'hi' ? 'हिंदी' : 'తెలుగు'}
              </button>
            ))}
          </div>
        </form>

        {/* Footer — clinic self-registration CTA plus a quiet help link.
            Normal document flow so it can never overlay the language buttons.
            Styles are injected (VX_CTA_CSS) to keep styles/signin.css untouched. */}
        <div className="vx-cta-footer">
          <style>{VX_CTA_CSS}</style>
          <div className="vx-cta-row">
            <button
              type="button"
              className="vx-cta-btn ghost"
              onClick={() => nav('/register')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" /></svg>
              {t.signIn.newClinic} {t.signIn.register}
            </button>
          </div>
          <div className="vx-cta-help">
            <button type="button" onClick={openHelp}>{t.signIn.help}</button>
          </div>
        </div>
      </section>

      {/* ─── VEXOO CUSTOMER SUPPORT (self-contained help modal) ─────────── */}
      {showHelp && (
        <div className="vx-help-overlay" onClick={() => setShowHelp(false)}>
          <style>{VX_HELP_CSS}</style>
          <div className="vx-help-modal" onClick={e => e.stopPropagation()}>
            <div className="vx-help-head">
              <div>
                <div className="vx-help-title">Vexoo Customer Support</div>
                <div className="vx-help-sub">Tell us what's going wrong — our team will reach out soon.</div>
              </div>
              <button className="vx-help-x" onClick={() => setShowHelp(false)} aria-label="Close">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {helpSent ? (
              <div className="vx-help-success">
                <div className="vx-help-success-icon">
                  <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>
                </div>
                <div className="vx-help-banner">Message Sent Successfully, Our team will Reach out soon</div>
                <button className="vx-help-btn" onClick={() => setShowHelp(false)}>Done</button>
              </div>
            ) : (
              <>
                <div className="vx-help-grid">
                  <div className="vx-help-field">
                    <label className="vx-help-label">Full Name</label>
                    <input className="vx-help-input" value={helpName} onChange={e => setHelpName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="vx-help-field">
                    <label className="vx-help-label">Phone</label>
                    <input className="vx-help-input" value={helpPhone} onChange={e => setHelpPhone(e.target.value)} placeholder="+91 …" />
                  </div>
                  <div className="vx-help-field">
                    <label className="vx-help-label">Email</label>
                    <input className="vx-help-input" value={helpEmail} onChange={e => setHelpEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div className="vx-help-field">
                    <label className="vx-help-label">Role</label>
                    <input className="vx-help-input" value={t.roles[role]} readOnly />
                  </div>
                </div>
                <div className="vx-help-field">
                  <label className="vx-help-label">Describe your issue</label>
                  <textarea className="vx-help-textarea" value={helpMsg} onChange={e => setHelpMsg(e.target.value)} placeholder="Tell us what happened, what you expected, and any error you saw…" />
                </div>
                <label className="vx-help-upload">
                  <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  {helpFile || 'Attach a screenshot (optional)'}
                  <input type="file" style={{ display: 'none' }} onChange={e => setHelpFile(e.target.files?.[0]?.name || '')} />
                </label>
                <div className="vx-help-actions">
                  <button className="vx-help-btn ghost" onClick={() => setShowHelp(false)}>Cancel</button>
                  <button className="vx-help-btn" disabled={!helpName.trim() || !helpMsg.trim()} onClick={submitHelp}>Submit Request</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
