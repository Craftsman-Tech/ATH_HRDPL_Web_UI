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
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Role, LangCode } from '@vexoo/shared';
import { useAuth }  from '../components/AuthContext';
import { useTheme, useLang } from '../components/ThemeContext';
import '../styles/signin.css';

// Role list — order and demo-email mapping matches the original.
// SuperAdmin is listed first: it's the platform/founder account that approves
// hospitals and creates each hospital Admin's credentials.
const ROLES: { id: Role; demoEmail: string }[] = [
  { id: 'SuperAdmin',   demoEmail: 'superadmin@vexoo.in' },
  { id: 'Admin',        demoEmail: 'admin@vexoo.in'     },
  { id: 'Doctor',       demoEmail: 'doctor@vexoo.in'    },
  { id: 'Receptionist', demoEmail: 'reception@vexoo.in' },
  { id: 'Pharmacist',   demoEmail: 'pharmacy@vexoo.in'  },
  { id: 'Patient',      demoEmail: 'patient@vexoo.in'   },
];

// Where each role lands after signing in.
const ROLE_HOME: Record<Role, string> = {
  SuperAdmin:   '/super-admin',
  Admin:        '/admin',
  Doctor:       '/doctor',
  Receptionist: '/reception',
  Pharmacist:   '/pharmacy',
  LabTech:      '/lab',
  Patient:      '/patient',
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
  SuperAdmin:   'M3 7l4 4 5-7 5 7 4-4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z',
  Admin:        'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  Doctor:       'M22 12h-4l-3 9L9 3l-3 9H2',
  Receptionist: 'M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z',
  Pharmacist:   'M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z',
  LabTech:      'M6 2v6l2 2-6 10h16L12 10l2-2V2H6z',
  Patient:      'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
};

export default function SignInScreen() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const { mode, toggle } = useTheme();
  const { code: lang, set: setLang, t } = useLang();

  // Form state
  const [role,     setRole]     = useState<Role>('Receptionist');
  const [email,    setEmail]    = useState('reception@vexoo.in');
  const [password, setPassword] = useState('');
  const [err,      setErr]      = useState('');
  const [loading,  setLoading]  = useState(false);

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
            <Icon size={20} d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </div>
          <div>
            <div className="brand-logo-text">Vexoo</div>
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

        {/* Footer — normal document flow (no absolute overlay, so it can never
            sit on top of the language buttons and swallow their clicks). The
            .form-panel column layout pins this to the bottom of the panel. */}
        <div className="form-footer">
          <span>{t.signIn.newClinic}</span>
          <span className="sep">·</span>
          <a href="#">{t.signIn.register}</a>
          <span className="sep">·</span>
          <button type="button">{t.signIn.help}</button>
        </div>
      </section>
    </div>
  );
}
