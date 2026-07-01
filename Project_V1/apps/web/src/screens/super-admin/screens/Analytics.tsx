/**
 * Analytics.tsx — Super-Admin "Platform analytics" (replaces the old Modules
 * catalogue). Four tabs of platform intelligence:
 *   Overview · Engagement · Operations · Growth & revenue
 *
 * Everything is interactive:
 *   • tab strip switches the active board
 *   • custom date-range picker (presets + From/To) rescales range-aware figures
 *   • Export downloads the active tab's primary table (SpreadsheetML, no deps)
 *   • KPI cards and every data row open a right-hand detail drawer
 *
 * Charts are dependency-free inline SVG (area / donut / bars / sparkline /
 * heatmap), matching the portal's no-extra-deps convention. All styling is
 * scoped under `.vx-admin .an-*` (appended to AdminCSS.ts).
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../shared/Icons';
import { exportExcel } from '../shared/exportExcel';
import {
  AN_TABS, type AnalyticsTab, type AnKpi,
  type DonutSlice, type BarRow,
  OV_KPIS, OV_EVENTS_SERIES, OV_EVENTS_PEAK, OV_CATEGORY,
  OV_CATEGORY_CENTER, OV_FUNNEL, OV_STREAM, OV_HEALTH,
  EN_KPIS, EN_SESSIONS_SERIES, EN_PLATFORM, EN_PLATFORM_CENTER, EN_STAFF_ROLES,
  EN_PATIENT, EN_HEATMAP, EN_HEATMAP_DAYS, EN_ACTIVE_HOSPITALS,
  OP_KPIS, OP_LEDGER, OP_MODULE_ADOPTION, OP_ROLE_ACTIONS,
  GR_KPIS, GR_MRR_SERIES, GR_REVENUE_PLAN, GR_REVENUE_CENTER, GR_NEW_CHURN,
  GR_BY_STATE, GR_LEADERBOARD,
} from '../data/analyticsData';

/* icon map for KPI chips (keys match analyticsData `icon` fields) */
const KPI_ICON: Record<string, React.FC<{ size?: number }>> = {
  hospital: Icon.Hospital, users: Icon.Users, activity: Icon.Activity,
  billing: Icon.Billing, file: Icon.File, shield: Icon.License,
  doctor: Icon.Activity, beaker: Icon.Beaker, check: Icon.Check,
};

/* ── custom date-range filter ────────────────────────────────────────────
   The chosen window drives range-aware figures: factor = days / 30 (a 30-day
   window = baseline ×1). Literal cards are untouched. */
const DAY_MS = 86_400_000;
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const parseISO = (s: string) => new Date(`${s}T00:00:00`);
const fmtShort = (iso: string) => parseISO(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const rangeDays = (from: string, to: string) =>
  Math.max(1, Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / DAY_MS) + 1);

const RANGE_PRESETS: { label: string; days: number }[] = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'Last 12 months', days: 365 },
];

const CustomRange: React.FC<{ from: string; to: string; onApply: (from: string, to: string) => void }> = ({ from, to, onApply }) => {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(from);
  const [t, setT] = useState(to);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setF(from); setT(to); }, [from, to]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const applyPreset = (days: number) => {
    const nt = toISO(new Date());
    const nf = toISO(new Date(Date.now() - (days - 1) * DAY_MS));
    onApply(nf, nt); setOpen(false);
  };
  const apply = () => {
    if (!f || !t) return;
    const [lo, hi] = f <= t ? [f, t] : [t, f];
    onApply(lo, hi); setOpen(false);
  };

  return (
    <div className="an-cr" ref={ref}>
      <button className="an-cr-btn" type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="dialog" aria-expanded={open ? 'true' : 'false'}>
        <Icon.Filter size={13} />
        <span>{fmtShort(from)} – {fmtShort(to)}</span>
        <span className="an-cr-days">{rangeDays(from, to)}d</span>
        <Icon.Chevron size={12} />
      </button>
      {open && (
        <div className="an-cr-pop" role="dialog" aria-label="Custom date range">
          <div className="an-cr-presets">
            {RANGE_PRESETS.map((p) => (
              <button key={p.label} type="button" className="an-cr-preset" onClick={() => applyPreset(p.days)}>{p.label}</button>
            ))}
          </div>
          <div className="an-cr-fields">
            <label className="an-cr-field"><span>From</span><input type="date" value={f} max={t} onChange={(e) => setF(e.target.value)} /></label>
            <label className="an-cr-field"><span>To</span><input type="date" value={t} min={f} onChange={(e) => setT(e.target.value)} /></label>
          </div>
          <div className="an-cr-actions">
            <button type="button" className="an-cr-cancel" onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" className="an-cr-apply" onClick={apply} disabled={!f || !t}>Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── small inline-SVG chart helpers ─────────────────────────────────────── */

const AreaChart: React.FC<{ data: number[]; h?: number; stroke?: string }> = ({
  data, h = 150, stroke = 'var(--mineral-700)',
}) => {
  const w = 1000;
  const max = Math.max(...data), min = Math.min(...data);
  const span = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, h - ((v - min) / span) * (h - 16) - 8] as const);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${w} ${h} L0 ${h} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg className="an-area" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label="trend">
      <defs>
        <linearGradient id="anAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#anAreaGrad)" stroke="none" />
      <path d={line} fill="none" stroke={stroke} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="4" fill="#fff" stroke={stroke} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const Donut: React.FC<{ slices: DonutSlice[]; center: string; sub?: string }> = ({ slices, center, sub }) => {
  const r = 56, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="an-donut-wrap">
      <svg viewBox="0 0 150 150" className="an-donut">
        <circle cx="75" cy="75" r={r} fill="none" stroke="var(--ink-100)" strokeWidth="18" />
        {slices.map((s) => {
          const len = (s.pct / 100) * c;
          const el = (
            <circle key={s.label} cx="75" cy="75" r={r} fill="none" stroke={s.color} strokeWidth="18"
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
              transform="rotate(-90 75 75)" strokeLinecap="butt" />
          );
          offset += len;
          return el;
        })}
        <text x="75" y="72" textAnchor="middle" className="an-donut-c">{center}</text>
        {sub && <text x="75" y="90" textAnchor="middle" className="an-donut-s">{sub}</text>}
      </svg>
    </div>
  );
};

const Legend: React.FC<{ slices: DonutSlice[] }> = ({ slices }) => (
  <ul className="an-legend">
    {slices.map((s) => (
      <li key={s.label}>
        <span className="an-dot" style={{ background: s.color }} />
        <span className="an-legend-label">{s.label}</span>
        <span className="an-legend-pct">{s.pct}%</span>
      </li>
    ))}
  </ul>
);

const Sparkline: React.FC<{ data: number[]; up?: boolean }> = ({ data, up = true }) => {
  const w = 80, h = 22, max = Math.max(...data), min = Math.min(...data), span = max - min || 1;
  const step = w / (data.length - 1);
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)} ${(h - ((v - min) / span) * (h - 4) - 2).toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} className="an-spark" aria-hidden>
      <path d={d} fill="none" stroke={up ? 'var(--mineral-600)' : 'var(--signal-red)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const HBars: React.FC<{ rows: BarRow[]; unit?: string; onPick?: (r: BarRow) => void }> = ({ rows, unit, onPick }) => {
  const max = Math.max(...rows.map((r) => r.value)) || 1;
  return (
    <div className="an-bars">
      {rows.map((r) => (
        <button key={r.label} className="an-bar-row" onClick={() => onPick?.(r)} type="button">
          <span className="an-bar-label">{r.label}</span>
          <span className="an-bar-track"><span className="an-bar-fill" style={{ width: `${(r.value / max) * 100}%`, background: r.color }} /></span>
          <span className="an-bar-val">{r.value.toLocaleString('en-IN')}{unit || ''}</span>
        </button>
      ))}
    </div>
  );
};

/* ── detail drawer (opened by any clickable element) ─────────────────────── */
interface DrawerData { title: string; sub?: string; rows: [string, string][]; }

const Drawer: React.FC<{ data: DrawerData | null; onClose: () => void }> = ({ data, onClose }) => {
  if (!data) return null;
  return (
    <>
      <div className="an-drawer-back" onClick={onClose} />
      <aside className="an-drawer" role="dialog" aria-label={data.title}>
        <div className="an-drawer-head">
          <div>
            <div className="an-drawer-title">{data.title}</div>
            {data.sub && <div className="an-drawer-sub">{data.sub}</div>}
          </div>
          <button className="an-drawer-x" onClick={onClose} aria-label="Close"><Icon.Close size={15} /></button>
        </div>
        <div className="an-drawer-body">
          {data.rows.map(([k, v]) => (
            <div className="an-drawer-row" key={k}><span>{k}</span><b>{v}</b></div>
          ))}
        </div>
        <div className="an-drawer-foot">
          <Icon.Info size={13} /> Figures are seed data — wired to live endpoints during backend integration.
        </div>
      </aside>
    </>
  );
};

/* ── KPI strip ───────────────────────────────────────────────────────────── */
const KpiStrip: React.FC<{ kpis: AnKpi[]; onPick: (k: AnKpi) => void }> = ({ kpis, onPick }) => (
  <div className="an-kpis">
    {kpis.map((k) => {
      const I = KPI_ICON[k.icon] ?? Icon.Activity;
      return (
        <button key={k.id} className="an-kpi" onClick={() => onPick(k)} type="button">
          <div className="an-kpi-head">
            <span className="an-kpi-label">{k.label}</span>
            <span className="an-kpi-ico"><I size={15} /></span>
          </div>
          <div className="an-kpi-val">{k.value}</div>
          <div className={`an-kpi-delta ${k.tone}`}>{k.delta}</div>
        </button>
      );
    })}
  </div>
);

const Card: React.FC<{ title: string; sub?: string; right?: React.ReactNode; className?: string; children: React.ReactNode }> = ({
  title, sub, right, className, children,
}) => (
  <section className={`an-card ${className || ''}`}>
    <div className="an-card-head">
      <div>
        <h3 className="an-card-title">{title}</h3>
        {sub && <p className="an-card-sub">{sub}</p>}
      </div>
      {right}
    </div>
    {children}
  </section>
);

/* ════════════════════════════════════════════════════════════════════════ */
export const Analytics: React.FC = () => {
  const [tab, setTab] = useState<AnalyticsTab>('overview');
  const [{ from, to }, setRange] = useState(() => ({
    from: toISO(new Date(Date.now() - 29 * DAY_MS)),
    to: toISO(new Date()),
  }));
  const [drawer, setDrawer] = useState<DrawerData | null>(null);

  const days = rangeDays(from, to);
  const factor = days / 30;
  const rangeLabel = `${fmtShort(from)} – ${fmtShort(to)}`;

  const openKpi = (k: AnKpi) => setDrawer({ title: k.label, sub: `Value · ${k.value}`, rows: k.detail });

  /* Export the active tab's primary table. */
  const onExport = () => {
    if (tab === 'overview') {
      exportExcel('vexoo-analytics-overview',
        ['Category', 'Share %'], OV_CATEGORY.map((s) => [s.label, String(s.pct)]));
    } else if (tab === 'engagement') {
      exportExcel('vexoo-analytics-active-hospitals',
        ['Hospital', 'City', 'Active users', 'Events 24h'],
        EN_ACTIVE_HOSPITALS.map((h) => [h.name, h.city, String(h.users), h.events]));
    } else if (tab === 'operations') {
      exportExcel('vexoo-analytics-action-ledger',
        ['Action', 'Role', 'Today', '7 days', '30 days', 'Trend'],
        OP_LEDGER.map((r) => [r.action, r.role, r.today, r.d7, r.d30, r.delta]));
    } else {
      exportExcel('vexoo-analytics-leaderboard',
        ['Agent', 'Approved', 'Avg time'],
        GR_LEADERBOARD.map((l) => [l.name, String(l.approved), l.avg]));
    }
  };

  return (
    <section className="view an-view">
      {/* page head */}
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <p className="eyebrow">Platform intelligence</p>
            <h1 className="page-title">Platform <em>analytics</em></h1>
            <p className="page-sub">Every action across every role app — instrumented inch to inch. Track adoption,
              engagement, clinical throughput and revenue to steer where Vexoo goes next.</p>
          </div>
          <div className="page-head-actions an-head-actions">
            <CustomRange from={from} to={to} onApply={(nf, nt) => setRange({ from: nf, to: nt })} />
            <button className="btn btn-ghost" onClick={onExport}><Icon.Download size={14} /> Export</button>
          </div>
        </div>
      </div>

      {/* tab strip */}
      <div className="an-tabs">
        {AN_TABS.map((t) => (
          <button key={t.id} className={`an-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)} type="button">{t.label}</button>
        ))}
      </div>

      {tab === 'overview' && <Overview factor={factor} days={days} rangeLabel={rangeLabel} onKpi={openKpi} onRow={setDrawer} />}
      {tab === 'engagement' && <Engagement onKpi={openKpi} onRow={setDrawer} />}
      {tab === 'operations' && <Operations onKpi={openKpi} onRow={setDrawer} />}
      {tab === 'growth' && <Growth onKpi={openKpi} onRow={setDrawer} />}

      <Drawer data={drawer} onClose={() => setDrawer(null)} />
    </section>
  );
};

/* ─────────────── OVERVIEW BOARD ─────────────── */
const Overview: React.FC<{ factor: number; days: number; rangeLabel: string; onKpi: (k: AnKpi) => void; onRow: (d: DrawerData) => void }> = ({ factor, days, rangeLabel, onKpi, onRow }) => {
  const series = useMemo(
    () => OV_EVENTS_SERIES.map((v) => Math.round(v * factor)),
    [factor],
  );
  const eventsTotal = useMemo(() => series.reduce((a, b) => a + b, 0), [series]);
  const funnelMax = OV_FUNNEL[0].value;
  return (
    <>
      <KpiStrip kpis={OV_KPIS} onPick={onKpi} />

      <div className="an-grid an-grid-2-1">
        <Card title="Platform events" sub={`Total instrumented actions per day · ${rangeLabel} (${days} days)`}
          right={<span className="an-chip mono">{eventsTotal.toLocaleString('en-IN')} total</span>}>
          <AreaChart data={series} />
          <div className="an-axis"><span>{days} days ago</span><span>{OV_EVENTS_PEAK}</span><span>today</span></div>
        </Card>

        <Card title="Events by category" sub="Share of all platform actions">
          <div className="an-donut-row">
            <Donut slices={OV_CATEGORY} center={OV_CATEGORY_CENTER} sub="TODAY" />
            <Legend slices={OV_CATEGORY} />
          </div>
        </Card>
      </div>

      <div className="an-grid an-grid-2-1">
        <Card title="Acquisition funnel" sub="Registration → live · trailing 30 days">
          <div className="an-funnel">
            {OV_FUNNEL.map((f, i) => (
              <button key={f.label} className="an-funnel-step" type="button"
                onClick={() => onRow({ title: f.label, sub: `${f.value} hospitals`, rows: [['Count', String(f.value)], ['Note', f.note]] })}>
                <span className="an-funnel-bar" style={{ width: `${(f.value / funnelMax) * 100}%`, background: `var(--mineral-${800 - i * 100 < 400 ? 400 : 800 - i * 100})` }}>
                  <span className="an-funnel-label">{f.label}</span>
                  <span className="an-funnel-val">{f.value}</span>
                </span>
                <span className="an-funnel-note">{f.note}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Live event stream" sub="Sampled across all tenants" right={<span className="an-live"><span className="an-live-dot" /></span>}>
          <ul className="an-stream">
            {OV_STREAM.map((s, i) => (
              <li key={i}>
                <span className="an-stream-tag" style={{ color: s.tagColor, borderColor: s.tagColor }}>{s.tag}</span>
                <span className="an-stream-text">{s.text}</span>
                <span className="an-stream-ago">{s.ago}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="System health" sub="Infrastructure powering every action" right={<span className="an-ok"><span className="an-ok-dot" /> All systems operational</span>}>
        <div className="an-health">
          {OV_HEALTH.map((h) => (
            <div className="an-health-stat" key={h.label}>
              <div className="an-health-label">{h.label}</div>
              <div className="an-health-val">{h.value}</div>
              <div className="an-health-sub">{h.sub}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

/* ─────────────── ENGAGEMENT BOARD ─────────────── */
const Engagement: React.FC<{ onKpi: (k: AnKpi) => void; onRow: (d: DrawerData) => void }> = ({ onKpi, onRow }) => (
  <>
    <KpiStrip kpis={EN_KPIS} onPick={onKpi} />

    <div className="an-grid an-grid-2-1">
      <Card title="Sessions trend" sub="Combined staff + patient sessions · 11 days">
        <AreaChart data={EN_SESSIONS_SERIES} stroke="var(--slate)" />
        <div className="an-axis"><span>3 weeks ago</span><span>today</span></div>
      </Card>
      <Card title="Access by platform" sub="How users reach Vexoo">
        <div className="an-donut-row">
          <Donut slices={EN_PLATFORM} center={EN_PLATFORM_CENTER} sub="APP INSTALLS" />
          <Legend slices={EN_PLATFORM} />
        </div>
      </Card>
    </div>

    <div className="an-grid an-grid-1-1">
      <Card title="Staff sessions by role" sub="Daily logins per role app">
        <HBars rows={EN_STAFF_ROLES} onPick={(r) => onRow({ title: r.label, sub: 'Daily logins', rows: [['Sessions / day', r.value.toLocaleString('en-IN')]] })} />
      </Card>
      <Card title="Patient engagement" sub="Self-service across the patient app">
        <div className="an-pstats">
          {EN_PATIENT.map((p) => (
            <div className="an-pstat" key={p.label}><div className="an-pstat-val">{p.value}</div><div className="an-pstat-label">{p.label}</div></div>
          ))}
        </div>
      </Card>
    </div>

    <Card title="Usage heatmap" sub="When the platform is busiest · hour of day × day of week (IST)">
      <div className="an-heat">
        {EN_HEATMAP.map((row, d) => (
          <div className="an-heat-row" key={d}>
            <span className="an-heat-day">{EN_HEATMAP_DAYS[d]}</span>
            <div className="an-heat-cells">
              {row.map((v, h) => (
                <span key={h} className="an-heat-cell" title={`${EN_HEATMAP_DAYS[d]} ${h}:00`}
                  style={{ background: `rgba(14,124,102,${(0.08 + v * 0.82).toFixed(2)})` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="an-heat-scale"><span>Quieter</span><span className="an-heat-grad" /><span>Busier</span></div>
    </Card>

    <Card title="Most active hospitals" sub="By total events in the last 24 hours">
      <div className="an-table">
        <div className="an-th an-th-active"><span>Hospital</span><span>City</span><span>Active users</span><span>Events · 24h</span><span>Trend</span></div>
        {EN_ACTIVE_HOSPITALS.map((h) => (
          <button key={h.name} className="an-tr an-tr-active" type="button"
            onClick={() => onRow({ title: h.name, sub: `${h.city} · last 24h`, rows: [['Active users', String(h.users)], ['Events (24h)', h.events], ['City', h.city]] })}>
            <span className="an-hosp"><span className="an-hosp-av" style={{ background: h.accent }}>{h.mark}</span>{h.name}</span>
            <span className="an-muted">{h.city}</span>
            <span>{h.users}</span>
            <span className="mono">{h.events}</span>
            <span><Sparkline data={h.trend} /></span>
          </button>
        ))}
      </div>
    </Card>
  </>
);

/* ─────────────── OPERATIONS BOARD ─────────────── */
const Operations: React.FC<{ onKpi: (k: AnKpi) => void; onRow: (d: DrawerData) => void }> = ({ onKpi, onRow }) => (
  <>
    <KpiStrip kpis={OP_KPIS} onPick={onKpi} />

    <Card title="Action ledger — every tracked event" sub="Inch-to-inch instrumentation across all role apps" right={<span className="an-live"><span className="an-live-dot" /> Live</span>}>
      <div className="an-table">
        <div className="an-th an-th-ledger"><span>Action</span><span>Role</span><span>Today</span><span>7 days</span><span>30 days</span><span>30-day trend</span></div>
        {OP_LEDGER.map((r) => (
          <button key={r.action} className="an-tr an-tr-ledger" type="button"
            onClick={() => onRow({ title: r.action, sub: `${r.role} · ${r.delta} vs prior`, rows: [['Today', r.today], ['7 days', r.d7], ['30 days', r.d30], ['Role app', r.role], ['Trend', r.delta]] })}>
            <span className="an-ledger-act">{r.action}</span>
            <span><span className="an-rolepill">{r.role}</span></span>
            <span className="mono">{r.today}</span>
            <span className="mono an-muted">{r.d7}</span>
            <span className="mono an-muted">{r.d30}</span>
            <span className="an-ledger-trend"><Sparkline data={r.trend} up={r.up} /><span className={r.up ? 'an-up' : 'an-down'}>{r.delta}</span></span>
          </button>
        ))}
      </div>
    </Card>

    <div className="an-grid an-grid-1-1">
      <Card title="Module adoption" sub="Share of hospitals actively using each module">
        <HBars rows={OP_MODULE_ADOPTION} unit="%" onPick={(r) => onRow({ title: r.label, sub: 'Module adoption', rows: [['Hospitals using', `${r.value}%`]] })} />
      </Card>
      <Card title="Actions by role app" sub="Where the work happens · today">
        <HBars rows={OP_ROLE_ACTIONS} onPick={(r) => onRow({ title: r.label, sub: 'Actions today', rows: [['Actions', r.value.toLocaleString('en-IN')]] })} />
      </Card>
    </div>
  </>
);

/* ─────────────── GROWTH & REVENUE BOARD ─────────────── */
const Growth: React.FC<{ onKpi: (k: AnKpi) => void; onRow: (d: DrawerData) => void }> = ({ onKpi, onRow }) => {
  const max = Math.max(...GR_NEW_CHURN.map((m) => m.added));
  return (
    <>
      <KpiStrip kpis={GR_KPIS} onPick={onKpi} />

      <div className="an-grid an-grid-2-1">
        <Card title="Recurring revenue" sub="MRR growth · trailing 12 months" right={<span className="an-chip mono">{GR_REVENUE_CENTER}</span>}>
          <AreaChart data={GR_MRR_SERIES} />
          <div className="an-axis"><span>12 mo ago</span><span>₹18.4L today</span></div>
        </Card>
        <Card title="Revenue by plan" sub="Contribution to MRR">
          <div className="an-donut-row">
            <Donut slices={GR_REVENUE_PLAN} center={GR_REVENUE_CENTER} sub="MRR" />
            <Legend slices={GR_REVENUE_PLAN} />
          </div>
        </Card>
      </div>

      <div className="an-grid an-grid-1-1">
        <Card title="New vs churned" sub="Tenant movement · last 6 months">
          <div className="an-colchart">
            {GR_NEW_CHURN.map((m) => (
              <button key={m.month} className="an-col" type="button"
                onClick={() => onRow({ title: m.month, sub: 'Tenant movement', rows: [['Added', String(m.added)], ['Churned', String(m.churned)], ['Net', `+${m.added - m.churned}`]] })}>
                <span className="an-col-bars">
                  <span className="an-col-add" style={{ height: `${(m.added / max) * 100}%` }} />
                  <span className="an-col-churn" style={{ height: `${(m.churned / max) * 100}%` }} />
                </span>
                <span className="an-col-label">{m.month}</span>
              </button>
            ))}
          </div>
          <div className="an-col-legend"><span><span className="an-dot" style={{ background: 'var(--mineral-700)' }} /> New</span><span><span className="an-dot" style={{ background: 'var(--signal-red)' }} /> Churned</span></div>
        </Card>
        <Card title="Hospitals by state" sub="Geographic footprint">
          <HBars rows={GR_BY_STATE} onPick={(r) => onRow({ title: r.label, sub: 'Hospitals on Vexoo', rows: [['Hospitals', String(r.value)]] })} />
        </Card>
      </div>

      <Card title="Approvals leaderboard" sub="Support team throughput · last 30 days">
        <div className="an-table">
          <div className="an-th an-th-leader"><span>Agent</span><span>Approved</span><span>Avg. time</span><span>Volume</span></div>
          {GR_LEADERBOARD.map((l) => {
            const lmax = GR_LEADERBOARD[0].approved;
            return (
              <button key={l.name} className="an-tr an-tr-leader" type="button"
                onClick={() => onRow({ title: l.name, sub: 'Approvals agent', rows: [['Approved (30d)', String(l.approved)], ['Avg handling time', l.avg]] })}>
                <span className="an-hosp"><span className="an-hosp-av" style={{ background: l.accent }}>{l.mark}</span>{l.name}</span>
                <span className="mono">{l.approved}</span>
                <span className="an-muted">{l.avg}</span>
                <span className="an-bar-track"><span className="an-bar-fill" style={{ width: `${(l.approved / lmax) * 100}%`, background: l.accent }} /></span>
              </button>
            );
          })}
        </div>
      </Card>
    </>
  );
};
