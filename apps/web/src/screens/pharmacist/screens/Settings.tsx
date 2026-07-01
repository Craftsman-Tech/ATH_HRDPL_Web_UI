/**
 * Settings.tsx — Pharmacist › Settings
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
 *  TODO(backend) at each call-site. Mirrors the Hospital Admin Settings section.
 * ============================================================================
 */
import React, { useState } from 'react';
import { SvgIcon } from '../shared/PhHelpers';
import { exportTextPdf } from '../shared/PhExport';
import {
  PH_PROFILE, PH_PLAN_CARDS, PH_SUBSCRIPTION, PH_INVOICES, PH_PLAN_LABEL,
} from '../data/billingData';
import type {
  PhSettingsTab, PhPlanCard, PhSubscription, PhInvoice,
} from '../types/pharmacist.types';

/* ── icon paths (Material-ish, drawn through PhHelpers.SvgIcon) ── */
const IC = {
  hospital: 'M19 7h-8v6H5V3H3v18h2v-4h14v4h2V11c0-2.21-1.79-4-4-4zm-2 8h-2v-2h2v2zm0-4h-2V9h2v2z',
  user:     'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  license:  'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
  file:     'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
  download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
  check:    'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  card:     'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z',
  back:     'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  shield:   'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
};

/* ── helpers ── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate   = (d: Date) => `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const addDays   = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n);   return x; };
const addMonths = (d: Date, n: number) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };

function nextInvoiceId(list: PhInvoice[]): string {
  const year = new Date().getFullYear();
  let max = 0;
  for (const i of list) { const m = i.id.match(/(\d+)$/); if (m) max = Math.max(max, parseInt(m[1], 10)); }
  return `INV-${year}-${String(max + 1).padStart(4, '0')}`;
}

/* Labelled key/value row (Profile tab). */
const KV: React.FC<{ k: string; v: React.ReactNode; mono?: boolean }> = ({ k, v, mono }) => (
  <div className="ph-kv-row">
    <div className="ph-kv-k">{k}</div>
    <div className={`ph-kv-v${mono ? ' mono' : ''}`}>{v}</div>
  </div>
);

/* ============================================================================
   PROFILE TAB
   ============================================================================ */
const ProfileTab: React.FC = () => {
  const p = PH_PROFILE;

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
      <div className="ph-set-note">
        These details were submitted to Vexoo at registration and verified by the platform team.
        They are read-only here — to request a change, contact platform support.
      </div>

      <div className="ph-set-grid">
        {/* Hospital details */}
        <div className="ph-set-card">
          <div className="ph-set-card-title"><SvgIcon path={IC.hospital} size={15} color="var(--mineral-700)" /> Hospital details</div>
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
        <div className="ph-set-card">
          <div className="ph-set-card-title"><SvgIcon path={IC.user} size={15} color="var(--mineral-700)" /> Contact information</div>
          <KV k="Pharmacy lead"   v={p.contactName} />
          <KV k="Designation"     v={p.designation} />
          <KV k="Work email"      v={p.email} />
          <KV k="Phone"           v={p.phone} mono />
          <KV k="Alternate phone" v={p.altPhone} mono />
        </div>

        {/* Licenses */}
        <div className="ph-set-card">
          <div className="ph-set-card-title"><SvgIcon path={IC.license} size={15} color="var(--mineral-700)" /> Licenses</div>
          <div className="ph-lic-list">
            {p.licenses.map(l => (
              <div className="ph-lic-row" key={l.no}>
                <div className="ph-lic-main">
                  <div className="ph-lic-name">{l.name}</div>
                  <div className="ph-lic-no mono">{l.no}</div>
                </div>
                <div className="ph-lic-valid">valid until<br /><b>{l.valid}</b></div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="ph-set-card">
          <div className="ph-set-card-title"><SvgIcon path={IC.file} size={15} color="var(--mineral-700)" /> Documents</div>
          <div className="ph-doc-list">
            {p.documents.map(d => (
              <div className="ph-doc-row" key={d.name}>
                <div className="ph-doc-badge">{d.kind}</div>
                <div className="ph-doc-main">
                  <div className="ph-doc-name">{d.name}</div>
                  <div className="ph-doc-size mono">{d.size}</div>
                </div>
                <button className="ph-doc-dl" onClick={() => onDownload(d.name)}>
                  <SvgIcon path={IC.download} size={14} color="currentColor" /> Download
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
  plan: PhPlanCard;
  onBack: () => void;
  onPaid: (plan: PhPlanCard) => void;
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
    <div className="ph-pay-wrap ph-fade">
      <button className="ph-pay-back" onClick={onBack}>
        <SvgIcon path={IC.back} size={14} color="currentColor" /> Back to plans
      </button>

      <div className="ph-pay-grid">
        {/* Card form (demo only) */}
        <div className="ph-set-card">
          <div className="ph-set-card-title"><SvgIcon path={IC.card} size={15} color="var(--mineral-700)" /> Payment details</div>

          <div className="ph-pay-demo">Demo checkout — no real payment is processed.</div>

          <label className="ph-pay-label">Name on card</label>
          <input className="ph-pay-input" value={name} onChange={e => setName(e.target.value)} placeholder="Maria Perez" />

          <label className="ph-pay-label">Card number</label>
          <input className="ph-pay-input mono" value={card} onChange={e => setCard(fmtCard(e.target.value))} placeholder="4242 4242 4242 4242" inputMode="numeric" />

          <div className="ph-pay-row2">
            <div>
              <label className="ph-pay-label">Expiry</label>
              <input className="ph-pay-input mono" value={exp} onChange={e => setExp(fmtExp(e.target.value))} placeholder="MM/YY" inputMode="numeric" />
            </div>
            <div>
              <label className="ph-pay-label">CVV</label>
              <input className="ph-pay-input mono" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" inputMode="numeric" />
            </div>
          </div>

          <button className="ph-pay-btn" disabled={!valid || busy} onClick={pay}>
            {busy ? 'Processing…' : `Pay ${plan.price}`}
          </button>
        </div>

        {/* Order summary */}
        <div className="ph-set-card ph-pay-summary">
          <div className="ph-set-card-title"><SvgIcon path={IC.shield} size={15} color="var(--mineral-700)" /> Order summary</div>
          <div className="ph-sum-plan">{plan.name} plan</div>
          <div className="ph-sum-tag">{plan.tagline}</div>
          <ul className="ph-plan-feats">
            {plan.features.map(f => <li key={f}><SvgIcon path={IC.check} size={11} color="var(--mineral-700)" /> {f}</li>)}
          </ul>
          <div className="ph-sum-line"><span>Billing period</span><b>{plan.cadence === '/month' ? 'Monthly' : plan.cadence.replace('/', '')}</b></div>
          <div className="ph-sum-line"><span>Amount due today</span><b>{plan.price}</b></div>
          <div className="ph-sum-total"><span>Total</span><span className="ph-sum-amt">{plan.price}</span></div>
          <div className="ph-sum-note">Inclusive of applicable taxes. Renews automatically — cancel anytime from Billing &amp; plans.</div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   BILLING TAB
   ============================================================================ */
const BillingTab: React.FC<{
  sub: PhSubscription;
  invoices: PhInvoice[];
  onUpgrade: (plan: PhPlanCard) => void;
  onCancel: () => void;
}> = ({ sub, invoices, onUpgrade, onCancel }) => {
  const current = PH_PLAN_CARDS.find(p => p.id === sub.plan);
  const active  = sub.status !== 'Cancelled';

  const downloadInvoice = (inv: PhInvoice) => {
    // TODO(backend): fetch the official invoice from billing. Demo: build a PDF.
    exportTextPdf(inv.id, 'Vexoo · Tax Invoice', [
      `Invoice no.    ${inv.id}`,
      `Date           ${inv.date}`,
      '',
      '## Billed to',
      PH_PROFILE.legalName,
      `${PH_PROFILE.addressLine}, ${PH_PROFILE.city} - ${PH_PROFILE.pincode}`,
      `GSTIN: ${PH_PROFILE.gstin}`,
      '',
      '## Subscription',
      `Plan           ${PH_PLAN_LABEL[inv.plan]}`,
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
      <div className="ph-sub-card">
        <div className="ph-sub-main">
          <div className="ph-sub-eyebrow">Current subscription</div>
          <div className="ph-sub-plan">
            {current?.name ?? sub.plan}
            <span className={`ph-badge ${active ? 'primary' : 'rose'}`} style={{ marginLeft: 10, verticalAlign: 'middle' }}>{sub.status}</span>
          </div>
          <div className="ph-sub-meta">
            {active
              ? <>Started {sub.startedOn} · {current && current.priceValue ? `${current.price} ${current.cadence}` : 'Free'} · renews {sub.validUntil}</>
              : <>Cancelled · you retain access until {sub.validUntil}</>}
          </div>
        </div>
        <div className="ph-sub-actions">
          {active
            ? <button className="ph-sub-cancel" onClick={onCancel}>Cancel subscription</button>
            : current && <button className="ph-action-btn" onClick={() => onUpgrade(current)}>Renew subscription</button>}
        </div>
      </div>

      {/* Plan cards */}
      <div className="ph-plan-grid">
        {PH_PLAN_CARDS.map(p => {
          const isCurrent = p.id === sub.plan && active;
          return (
            <article key={p.id} className={`ph-plan-card${p.popular ? ' popular' : ''}${isCurrent ? ' current' : ''}`}>
              {(p.popular || isCurrent) && (
                <div className="ph-plan-badges">
                  {p.popular   && <span className="ph-plan-badge pop">Most popular</span>}
                  {isCurrent   && <span className="ph-plan-badge cur">Current plan</span>}
                </div>
              )}
              <div className="ph-plan-name">{p.name}</div>
              <div className="ph-plan-price"><span className="amt">{p.price}</span><span className="cad">{p.cadence}</span></div>
              <div className="ph-plan-tag">{p.tagline}</div>
              <div className="ph-plan-seats"><SvgIcon path={IC.user} size={12} color="var(--ink-500)" /> {p.seats}</div>
              <ul className="ph-plan-feats">
                {p.features.map(f => <li key={f}><SvgIcon path={IC.check} size={11} color="var(--mineral-700)" /> {f}</li>)}
              </ul>
              <div className="ph-plan-foot">
                {isCurrent
                  ? <button className="ph-plan-btn current" disabled>Current plan</button>
                  : p.priceValue == null
                    ? <button className="ph-plan-btn ghost" onClick={() => onUpgrade(p)}>Contact sales</button>
                    : p.priceValue === 0
                      ? <button className="ph-plan-btn ghost" onClick={() => onUpgrade(p)}>Start trial</button>
                      : <button className="ph-plan-btn" onClick={() => onUpgrade(p)}>Upgrade</button>}
              </div>
            </article>
          );
        })}
      </div>

      {/* Recent invoices */}
      <div className="ph-inv-card">
        <div className="ph-inv-head">
          <div>
            <div className="ph-inv-title">Recent invoices</div>
            <div className="ph-section-sub">Invoices received for your subscription · downloadable</div>
          </div>
        </div>
        <div className="ph-table-wrap">
          <table className="ph-table">
            <thead>
              <tr>
                <th className="ph-th">Invoice</th>
                <th className="ph-th">Plan</th>
                <th className="ph-th">Amount</th>
                <th className="ph-th">Date</th>
                <th className="ph-th">Status</th>
                <th className="ph-th" style={{ textAlign: 'right' }}>Invoice PDF</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="ph-tr">
                  <td className="ph-td mono" style={{ fontSize: 12.5, color: 'var(--ink-700)' }}>{inv.id}</td>
                  <td className="ph-td"><span className="ph-badge primary">{PH_PLAN_LABEL[inv.plan]}</span></td>
                  <td className="ph-td mono" style={{ color: 'var(--ink-900)' }}>{inv.amount}</td>
                  <td className="ph-td" style={{ color: 'var(--ink-500)' }}>{inv.date}</td>
                  <td className="ph-td">
                    <span className={`ph-badge ${inv.status === 'paid' ? 'primary' : 'rose'}`}>{inv.status === 'paid' ? 'Paid' : 'Failed'}</span>
                  </td>
                  <td className="ph-td" style={{ textAlign: 'right' }}>
                    <button className="ph-doc-dl" onClick={() => downloadInvoice(inv)}>
                      <SvgIcon path={IC.download} size={14} color="currentColor" /> Download
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
export const Settings: React.FC<{ hospitalName?: string }> = () => {
  const [tab, setTab]           = useState<PhSettingsTab>('profile');
  const [sub, setSub]           = useState<PhSubscription>(PH_SUBSCRIPTION);
  const [invoices, setInvoices] = useState<PhInvoice[]>(PH_INVOICES);
  const [view, setView]         = useState<'plans' | 'payment'>('plans');
  const [payPlan, setPayPlan]   = useState<PhPlanCard | null>(null);
  const [toast, setToast]       = useState<string | null>(null);

  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(null), 3400); };

  const onUpgrade = (plan: PhPlanCard) => {
    if (plan.priceValue == null) { flash('Thanks — our team will reach out about Enterprise pricing.'); return; }
    setPayPlan(plan); setView('payment');
  };

  const onCancel = () => {
    setSub(s => ({ ...s, status: 'Cancelled' }));
    flash('Subscription cancelled. You keep access until the end of the current period.');
  };

  const onPaid = (plan: PhPlanCard) => {
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

  const NAV: { id: PhSettingsTab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Profile',         icon: IC.user },
    { id: 'billing', label: 'Billing & plans', icon: IC.card },
  ];

  return (
    <div className="ph-content ph-fade">
      <div className="ph-section-head">
        <div>
          <div className="ph-section-title">Settings</div>
          <div className="ph-section-sub">Your hospital profile and subscription</div>
        </div>
      </div>

      <div className="ph-set-shell">
        {/* sub-nav */}
        <nav className="ph-set-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`ph-set-nav-btn${tab === n.id ? ' active' : ''}`}
              onClick={() => { setTab(n.id); setView('plans'); }}
            >
              <SvgIcon path={n.icon} size={16} color="currentColor" />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        {/* body */}
        <div className="ph-set-body">
          {tab === 'profile' && <ProfileTab />}
          {tab === 'billing' && view === 'plans' && (
            <BillingTab sub={sub} invoices={invoices} onUpgrade={onUpgrade} onCancel={onCancel} />
          )}
          {tab === 'billing' && view === 'payment' && payPlan && (
            <PaymentPage plan={payPlan} onBack={() => setView('plans')} onPaid={onPaid} />
          )}
        </div>
      </div>

      {toast && <div className="ph-toast">{toast}</div>}
    </div>
  );
};
