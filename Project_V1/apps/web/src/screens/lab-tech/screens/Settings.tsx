/**
 * Settings.tsx — Lab Technician › Settings
 * ----------------------------------------------------------------------------
 *  Two sub-tabs (left sub-nav):
 *
 *   • Profile         Read-only mirror of everything this hospital submitted to
 *                     the Super Admin at registration — Hospital details,
 *                     Contact information, Licenses and Documents (downloadable).
 *
 *   • Billing & plans Current-subscription summary (with Cancel / Renew), the
 *                     four plan tiers (Pilot / Core / Scale / Enterprise) with
 *                     a "Current plan" tag on the active tier and "Most popular"
 *                     on Core — both stack on the same card when they coincide.
 *                     Upgrading opens an in-app payment page; on success the
 *                     subscription flips to "New", validity rolls forward, and a
 *                     paid invoice is added. Recent invoices are downloadable.
 *
 *  All persistence is local demo state. Real wiring points are flagged
 *  TODO(backend) at each call-site. Mirrors the Hospital Admin Settings section,
 *  re-namespaced lt-* with the lab portal's stroke icon + design tokens.
 * ============================================================================
 */
import React, { useState } from 'react';
import { exportTextPdf } from '../shared/LtExport';
import {
  LT_PROFILE, LT_PLAN_CARDS, LT_SUBSCRIPTION, LT_INVOICES, LT_PLAN_LABEL,
} from '../data/billingData';
import type {
  LtSettingsTab, LtPlanCard, LtSubscription, LtInvoice,
} from '../types/labtech.types';

/* ── local stroke icon (matches the lab portal's Feather-style SvgIcon) ── */
const Ic: React.FC<{ d: string; size?: number; color?: string }> = ({ d, size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

/* ── icon paths (stroke / Feather-style) ── */
const IC = {
  hospital: 'M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M10 9h2M11 8v2M10 13h2M11 12v2M10 17h2',
  user:     'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  license:  'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  file:     'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  check:    'M20 6L9 17l-5-5',
  card:     'M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M1 10h22',
  back:     'M19 12H5 M12 19l-7-7 7-7',
  shield:   'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
};

/* ── helpers ── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate   = (d: Date) => `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const addDays   = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n);   return x; };
const addMonths = (d: Date, n: number) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };

function nextInvoiceId(list: LtInvoice[]): string {
  const year = new Date().getFullYear();
  let max = 0;
  for (const i of list) { const m = i.id.match(/(\d+)$/); if (m) max = Math.max(max, parseInt(m[1], 10)); }
  return `INV-${year}-${String(max + 1).padStart(4, '0')}`;
}

/* Labelled key/value row (Profile tab). */
const KV: React.FC<{ k: string; v: React.ReactNode; mono?: boolean }> = ({ k, v, mono }) => (
  <div className="lt-kv-row">
    <div className="lt-kv-k">{k}</div>
    <div className={`lt-kv-v${mono ? ' lt-mono' : ''}`}>{v}</div>
  </div>
);

/* ============================================================================
   PROFILE TAB
   ============================================================================ */
const ProfileTab: React.FC = () => {
  const p = LT_PROFILE;

  const onDownload = (file: string) => {
    // TODO(backend): stream the stored document. Demo: emit a placeholder PDF.
    exportTextPdf(file.replace(/\.[a-z]+$/i, ''), `Vexoo · ${p.legalName}`, [
      `Document: ${file}`,
      '',
      'Placeholder copy of a document submitted during hospital registration.',
      '',
      '(Wire to document storage — TODO backend.)',
    ]);
  };

  return (
    <>
      <div className="lt-set-note">
        These details were submitted to Vexoo at registration and verified by the platform team.
        They are read-only here — to request a change, contact platform support.
      </div>

      <div className="lt-set-grid">
        {/* Hospital details */}
        <div className="lt-set-card">
          <div className="lt-set-card-title"><Ic d={IC.hospital} size={15} color="var(--mineral-700)" /> Hospital details</div>
          <KV k="Legal name"    v={p.legalName} />
          <KV k="Facility type" v={p.facilityType} />
          <KV k="Beds"          v={String(p.beds)} />
          <KV k="Established"   v={p.established} />
          <KV k="Address"       v={`${p.addressLine}, ${p.city} — ${p.pincode}`} />
          <KV k="State / UT"    v={p.state} />
          <KV k="GSTIN"         v={p.gstin} mono />
          <KV k="PAN"           v={p.pan} mono />
          <KV k="CEA reg. no."  v={p.cea} mono />
        </div>

        {/* Contact information */}
        <div className="lt-set-card">
          <div className="lt-set-card-title"><Ic d={IC.user} size={15} color="var(--mineral-700)" /> Contact information</div>
          <KV k="Lab lead"        v={p.contactName} />
          <KV k="Designation"     v={p.designation} />
          <KV k="Work email"      v={p.email} />
          <KV k="Phone"           v={p.phone} mono />
          <KV k="Alternate phone" v={p.altPhone} mono />
        </div>

        {/* Licenses */}
        <div className="lt-set-card">
          <div className="lt-set-card-title"><Ic d={IC.license} size={15} color="var(--mineral-700)" /> Licenses</div>
          <div className="lt-lic-list">
            {p.licenses.map(l => (
              <div className="lt-lic-row" key={l.no}>
                <div className="lt-lic-main">
                  <div className="lt-lic-name">{l.name}</div>
                  <div className="lt-lic-no lt-mono">{l.no}</div>
                </div>
                <div className="lt-lic-valid">valid until<br /><b>{l.valid}</b></div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="lt-set-card">
          <div className="lt-set-card-title"><Ic d={IC.file} size={15} color="var(--mineral-700)" /> Documents</div>
          <div className="lt-doc-list">
            {p.documents.map(d => (
              <div className="lt-doc-row" key={d.name}>
                <div className="lt-doc-badge">{d.kind}</div>
                <div className="lt-doc-main">
                  <div className="lt-doc-name">{d.name}</div>
                  <div className="lt-doc-size lt-mono">{d.size}</div>
                </div>
                <button className="lt-doc-dl" onClick={() => onDownload(d.name)}>
                  <Ic d={IC.download} size={14} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

/* ============================================================================
   PAYMENT PAGE  (shown inside the Billing tab when a plan is being purchased)
   ============================================================================ */
const PaymentPage: React.FC<{
  plan: LtPlanCard;
  onBack: () => void;
  onPaid: (plan: LtPlanCard) => void;
}> = ({ plan, onBack, onPaid }) => {
  const [name, setName]     = useState('');
  const [card, setCard]     = useState('');
  const [exp, setExp]       = useState('');
  const [cvv, setCvv]       = useState('');
  const [busy, setBusy]     = useState(false);

  const digits = card.replace(/\D/g, '');
  const valid  = name.trim().length > 2 && digits.length >= 12 && /^\d{2}\/\d{2}$/.test(exp) && /^\d{3,4}$/.test(cvv);

  const fmtCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp  = (v: string) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

  const pay = () => {
    if (!valid || busy) return;
    setBusy(true);
    // TODO(backend): capture payment via your gateway here, then on the
    // gateway's success callback call onPaid(). Demo: simulate a short delay.
    window.setTimeout(() => { setBusy(false); onPaid(plan); }, 900);
  };

  return (
    <div className="lt-pay-wrap lt-fade">
      <button className="lt-pay-back" onClick={onBack}>
        <Ic d={IC.back} size={14} /> Back to plans
      </button>

      <div className="lt-pay-grid">
        {/* Card form (demo only) */}
        <div className="lt-set-card">
          <div className="lt-set-card-title"><Ic d={IC.card} size={15} color="var(--mineral-700)" /> Payment details</div>

          <div className="lt-pay-demo">Demo checkout — no real payment is processed.</div>

          <label className="lt-pay-label">Name on card</label>
          <input className="lt-pay-input" value={name} onChange={e => setName(e.target.value)} placeholder="Kevin Liu" />

          <label className="lt-pay-label">Card number</label>
          <input className="lt-pay-input lt-mono" value={card} onChange={e => setCard(fmtCard(e.target.value))} placeholder="4242 4242 4242 4242" inputMode="numeric" />

          <div className="lt-pay-row2">
            <div>
              <label className="lt-pay-label">Expiry</label>
              <input className="lt-pay-input lt-mono" value={exp} onChange={e => setExp(fmtExp(e.target.value))} placeholder="MM/YY" inputMode="numeric" />
            </div>
            <div>
              <label className="lt-pay-label">CVV</label>
              <input className="lt-pay-input lt-mono" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" inputMode="numeric" />
            </div>
          </div>

          <button className="lt-pay-btn" disabled={!valid || busy} onClick={pay}>
            {busy ? 'Processing…' : `Pay ${plan.price}`}
          </button>
        </div>

        {/* Order summary */}
        <div className="lt-set-card lt-pay-summary">
          <div className="lt-set-card-title"><Ic d={IC.shield} size={15} color="var(--mineral-700)" /> Order summary</div>
          <div className="lt-sum-plan">{plan.name} plan</div>
          <div className="lt-sum-tag">{plan.tagline}</div>
          <ul className="lt-plan-feats">
            {plan.features.map(f => <li key={f}><Ic d={IC.check} size={11} color="var(--mineral-700)" /> {f}</li>)}
          </ul>
          <div className="lt-sum-line"><span>Billing period</span><b>{plan.cadence === '/month' ? 'Monthly' : plan.cadence.replace('/', '')}</b></div>
          <div className="lt-sum-line"><span>Amount due today</span><b>{plan.price}</b></div>
          <div className="lt-sum-total"><span>Total</span><span className="lt-sum-amt">{plan.price}</span></div>
          <div className="lt-sum-note">Inclusive of applicable taxes. Renews automatically — cancel anytime from Billing &amp; plans.</div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   BILLING TAB
   ============================================================================ */
const BillingTab: React.FC<{
  sub: LtSubscription;
  invoices: LtInvoice[];
  onUpgrade: (plan: LtPlanCard) => void;
  onCancel: () => void;
}> = ({ sub, invoices, onUpgrade, onCancel }) => {
  const current = LT_PLAN_CARDS.find(p => p.id === sub.plan);
  const active  = sub.status !== 'Cancelled';

  const downloadInvoice = (inv: LtInvoice) => {
    // TODO(backend): fetch the official invoice from billing. Demo: build a PDF.
    exportTextPdf(inv.id, 'Vexoo · Tax Invoice', [
      `Invoice no.    ${inv.id}`,
      `Date           ${inv.date}`,
      '',
      '## Billed to',
      LT_PROFILE.legalName,
      `${LT_PROFILE.addressLine}, ${LT_PROFILE.city} - ${LT_PROFILE.pincode}`,
      `GSTIN: ${LT_PROFILE.gstin}`,
      '',
      '## Subscription',
      `Plan           ${LT_PLAN_LABEL[inv.plan]}`,
      `Billing        Monthly`,
      '',
      '## Amount',
      `Plan charge    ${inv.amount}`,
      `Status         ${inv.status === 'paid' ? 'PAID' : 'FAILED'}`,
      '',
      'Vexoo - Clinic Operations Platform',
      '(Computer-generated invoice - TODO backend: replace with the',
      'official invoice from your billing service.)',
    ]);
  };

  return (
    <>
      {/* Current subscription summary */}
      <div className="lt-sub-card">
        <div className="lt-sub-main">
          <div className="lt-sub-eyebrow">Current subscription</div>
          <div className="lt-sub-plan">
            {current?.name ?? sub.plan}
            <span className={`lt-chip ${active ? 'primary' : 'rose'}`} style={{ marginLeft: 10, verticalAlign: 'middle' }}>{sub.status}</span>
          </div>
          <div className="lt-sub-meta">
            {active
              ? <>Started {sub.startedOn} · {current && current.priceValue ? `${current.price} ${current.cadence}` : 'Free'} · renews {sub.validUntil}</>
              : <>Cancelled · you retain access until {sub.validUntil}</>}
          </div>
        </div>
        <div className="lt-sub-actions">
          {active
            ? <button className="lt-sub-cancel" onClick={onCancel}>Cancel subscription</button>
            : current && <button className="lt-btn-primary" onClick={() => onUpgrade(current)}>Renew subscription</button>}
        </div>
      </div>

      {/* Plan cards */}
      <div className="lt-plan-grid">
        {LT_PLAN_CARDS.map(p => {
          const isCurrent = p.id === sub.plan && active;
          return (
            <article key={p.id} className={`lt-plan-card${p.popular ? ' popular' : ''}${isCurrent ? ' current' : ''}`}>
              {(p.popular || isCurrent) && (
                <div className="lt-plan-badges">
                  {p.popular   && <span className="lt-plan-badge pop">Most popular</span>}
                  {isCurrent   && <span className="lt-plan-badge cur">Current plan</span>}
                </div>
              )}
              <div className="lt-plan-name">{p.name}</div>
              <div className="lt-plan-price"><span className="amt">{p.price}</span><span className="cad">{p.cadence}</span></div>
              <div className="lt-plan-tag">{p.tagline}</div>
              <div className="lt-plan-seats"><Ic d={IC.user} size={12} color="var(--ink-500)" /> {p.seats}</div>
              <ul className="lt-plan-feats">
                {p.features.map(f => <li key={f}><Ic d={IC.check} size={11} color="var(--mineral-700)" /> {f}</li>)}
              </ul>
              <div className="lt-plan-foot">
                {isCurrent
                  ? <button className="lt-plan-btn current" disabled>Current plan</button>
                  : p.priceValue == null
                    ? <button className="lt-plan-btn ghost" onClick={() => onUpgrade(p)}>Contact sales</button>
                    : p.priceValue === 0
                      ? <button className="lt-plan-btn ghost" onClick={() => onUpgrade(p)}>Start trial</button>
                      : <button className="lt-plan-btn" onClick={() => onUpgrade(p)}>Upgrade</button>}
              </div>
            </article>
          );
        })}
      </div>

      {/* Recent invoices */}
      <div className="lt-inv-card">
        <div className="lt-inv-head">
          <div className="lt-inv-title">Recent invoices</div>
          <div className="lt-inv-sub">Invoices received for your subscription · downloadable</div>
        </div>
        <div className="lt-inv-table-wrap">
          <table className="lt-table">
            <thead>
              <tr>
                <th className="lt-th">Invoice</th>
                <th className="lt-th">Plan</th>
                <th className="lt-th">Amount</th>
                <th className="lt-th">Date</th>
                <th className="lt-th">Status</th>
                <th className="lt-th" style={{ textAlign: 'right' }}>Invoice PDF</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="lt-tr">
                  <td className="lt-td lt-mono" style={{ fontSize: 12.5, color: 'var(--ink-700)' }}>{inv.id}</td>
                  <td className="lt-td"><span className="lt-chip primary">{LT_PLAN_LABEL[inv.plan]}</span></td>
                  <td className="lt-td lt-mono" style={{ color: 'var(--ink-900)' }}>{inv.amount}</td>
                  <td className="lt-td" style={{ color: 'var(--ink-500)' }}>{inv.date}</td>
                  <td className="lt-td">
                    <span className={`lt-chip ${inv.status === 'paid' ? 'primary' : 'rose'}`}>{inv.status === 'paid' ? 'Paid' : 'Failed'}</span>
                  </td>
                  <td className="lt-td" style={{ textAlign: 'right' }}>
                    <button className="lt-doc-dl" onClick={() => downloadInvoice(inv)}>
                      <Ic d={IC.download} size={14} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

/* ============================================================================
   SETTINGS SCREEN (orchestrates the two tabs + payment view + demo state)
   ============================================================================ */
export const Settings: React.FC = () => {
  const [tab, setTab]           = useState<LtSettingsTab>('profile');
  const [sub, setSub]           = useState<LtSubscription>(LT_SUBSCRIPTION);
  const [invoices, setInvoices] = useState<LtInvoice[]>(LT_INVOICES);
  const [view, setView]         = useState<'plans' | 'payment'>('plans');
  const [payPlan, setPayPlan]   = useState<LtPlanCard | null>(null);
  const [toast, setToast]       = useState<string | null>(null);

  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(null), 3400); };

  const onUpgrade = (plan: LtPlanCard) => {
    if (plan.priceValue == null) { flash('Thanks — our team will reach out about Enterprise pricing.'); return; }
    setPayPlan(plan); setView('payment');
  };

  const onCancel = () => {
    setSub(s => ({ ...s, status: 'Cancelled' }));
    flash('Subscription cancelled. You keep access until the end of the current period.');
  };

  const onPaid = (plan: LtPlanCard) => {
    // TODO(backend): this runs after a confirmed gateway charge. Demo: roll state.
    const today = new Date();
    const validUntil = plan.id === 'pilot' ? addDays(today, 30) : addMonths(today, 1);
    setSub({ plan: plan.id, status: 'New', startedOn: fmtDate(today), validUntil: fmtDate(validUntil) });
    setInvoices(list => [
      { id: nextInvoiceId(list), plan: plan.id, amount: plan.price, date: fmtDate(today), status: 'paid' },
      ...list,
    ]);
    setView('plans'); setPayPlan(null);
    flash(`Payment successful — you're now on the ${plan.name} plan.`);
  };

  const NAV: { id: LtSettingsTab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile',         icon: IC.user },
    { id: 'billing', label: 'Billing & plans', icon: IC.card },
  ];

  return (
    <div className="lt-scroll lt-fade">
      <div className="lt-content">
        <div className="lt-set-shell">
          {/* sub-nav */}
          <nav className="lt-set-nav">
            {NAV.map(n => (
              <button
                key={n.id}
                className={`lt-set-nav-btn${tab === n.id ? ' active' : ''}`}
                onClick={() => { setTab(n.id); setView('plans'); }}
              >
                <Ic d={n.icon} size={16} />
                <span>{n.label}</span>
              </button>
            ))}
          </nav>

          {/* body */}
          <div className="lt-set-body">
            {tab === 'profile' && <ProfileTab />}
            {tab === 'billing' && view === 'plans' && (
              <BillingTab sub={sub} invoices={invoices} onUpgrade={onUpgrade} onCancel={onCancel} />
            )}
            {tab === 'billing' && view === 'payment' && payPlan && (
              <PaymentPage plan={payPlan} onBack={() => setView('plans')} onPaid={onPaid} />
            )}
          </div>
        </div>
      </div>

      {toast && <div className="lt-toast">{toast}</div>}
    </div>
  );
};
