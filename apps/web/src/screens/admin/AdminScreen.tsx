/**
 * AdminScreen.tsx — Vexoo · Founders' Console (Super Admin portal)
 * ---------------------------------------------------------------------------
 * Faithful React port of the reference design (Vexoo_Super_Admin.html), made
 * fully responsive (off-canvas nav, horizontally-scrolling KPIs + table,
 * stacked forms on mobile).
 *
 * INTEGRATION NOTES (for the Vexoo monorepo)
 * - Drop this file in: apps/web/src/screens/admin/AdminScreen.tsx
 * - Route it after auth, e.g. <Route path="/admin" element={<AdminScreen />} />.
 * - Fonts: this component @imports its fonts inside the injected <style> so it
 *   works standalone. For production, move the Google Fonts <link> into
 *   index.html and delete the @import line at the top of ADMIN_CSS.
 * - Mock data (HOSPITALS / APPROVALS / LICENSES / ACTIVITY) is inline so the
 *   screen renders with no backend. Move these into packages/shared/mockData
 *   and import them, so web + mobile share one source of truth.
 * - User identity (nav footer) is prop-driven so you can wire AuthContext:
 *       const { user } = useAuth();
 *       <AdminScreen adminName={user.name} adminRole={user.roleLabel} />
 * - Design tokens are defined on the .vx-admin root, so this screen does not
 *   depend on, nor override, any global tokens you already ship.
 * - The reference "Tweaks" dev panel (accent swatches / density / grain) was a
 *   prototyping affordance, not a clinic feature, so it is intentionally omitted.
 * ---------------------------------------------------------------------------
 * FIX (May 2026): Sidebar footer now shows a clearly-labelled "Sign out" button
 * with a logout icon, separate from the user identity row. Previously the user
 * row itself was the only sign-out trigger with no visible label.
 * ---------------------------------------------------------------------------
 */

import React, { useEffect, useState, useCallback } from "react";

/* ───────────────────────── Types ───────────────────────── */

type ViewName = "hospitals" | "approvals" | "licenses" | "activity";
type Status = "active" | "pending" | "suspended" | "onboarding" | "trial";
type Plan = "core" | "scale" | "pilot";

interface Hospital {
  id: string;
  name: string;
  regNo: string;
  city: string;
  state: string;
  admin: string;
  email: string;
  plan: Plan;
  status: Status;
  registered: string;
  mark: string;
  accent: string;
}

interface Approval {
  name: string;
  loc: string;
  regNo: string;
  contact: string;
  phone: string;
  email: string;
  submitted: string;
  overdue: boolean;
  mark: string;
  accent: string;
}

interface License {
  hosp: string;
  name: string;
  no: string;
  valid: string;
  status: "ok" | "expiring";
  size: number;
}

interface Activity {
  time: string;
  kind: "ok" | "warn" | "danger";
  title: string;
  detail: string;
}

interface AdminScreenProps {
  adminName?: string;
  adminRole?: string;
  onSignOut?: () => void;
}

/* ───────────────────────── Mock data ───────────────────── */

const HOSPITALS: Hospital[] = [
  { id: "VX-T-00128", name: "Suvarna Multi-Speciality", regNo: "HOSP/AP/2026/00824", city: "Hyderabad", state: "TS", admin: "Dr. Priya Iyer", email: "priya@suvarnahospital.in", plan: "core", status: "active", registered: "May 2, 2026", mark: "S", accent: "#0E7C66" },
  { id: "VX-T-00127", name: "Akash Children's Clinic", regNo: "HOSP/KA/2026/01993", city: "Bengaluru", state: "KA", admin: "Dr. Rohan Mehta", email: "rohan@akashclinic.in", plan: "pilot", status: "trial", registered: "Apr 28, 2026", mark: "A", accent: "#5C6BC0" },
  { id: "VX-T-00126", name: "Karuna Maternity Centre", regNo: "HOSP/MH/2026/02014", city: "Pune", state: "MH", admin: "Dr. Anjali Deshpande", email: "anjali@karunacare.in", plan: "core", status: "onboarding", registered: "Apr 25, 2026", mark: "K", accent: "#0A7A8F" },
  { id: "VX-T-00125", name: "Citadel Diagnostics", regNo: "HOSP/TN/2026/00761", city: "Chennai", state: "TN", admin: "Mr. Hari Krishnan", email: "hari@citadeldx.in", plan: "scale", status: "active", registered: "Apr 21, 2026", mark: "C", accent: "#2A7A4B" },
  { id: "VX-T-00124", name: "Aarogyam Wellness", regNo: "HOSP/AP/2026/00671", city: "Vijayawada", state: "AP", admin: "Dr. Naveen Reddy", email: "naveen@aarogyam.in", plan: "core", status: "active", registered: "Apr 18, 2026", mark: "A", accent: "#149E83" },
  { id: "VX-T-00123", name: "Helix Dental Studio", regNo: "HOSP/KA/2026/01740", city: "Bengaluru", state: "KA", admin: "Dr. Sneha Pillai", email: "sneha@helixdental.in", plan: "pilot", status: "trial", registered: "Apr 14, 2026", mark: "H", accent: "#7A5BC9" },
  { id: "VX-T-00122", name: "Maitri Multi-Specialty", regNo: "HOSP/TS/2026/00428", city: "Warangal", state: "TS", admin: "Dr. Vivek Sharma", email: "vivek@maitri.in", plan: "core", status: "active", registered: "Apr 10, 2026", mark: "M", accent: "#B43A2C" },
  { id: "VX-T-00121", name: "Lotus Eye Hospital", regNo: "HOSP/MH/2026/01228", city: "Mumbai", state: "MH", admin: "Dr. Ritu Kapoor", email: "ritu@lotuseye.in", plan: "scale", status: "active", registered: "Apr 6, 2026", mark: "L", accent: "#0E7C66" },
  { id: "VX-T-00120", name: "Surya Skin & Cosmetic", regNo: "HOSP/KL/2026/00094", city: "Kochi", state: "KL", admin: "Dr. Meera Nair", email: "meera@suryaskin.in", plan: "core", status: "suspended", registered: "Mar 30, 2026", mark: "S", accent: "#C68A1F" },
  { id: "VX-T-00119", name: "Anand Dental Care", regNo: "HOSP/GJ/2026/00518", city: "Ahmedabad", state: "GJ", admin: "Dr. Pinal Shah", email: "pinal@ananddental.in", plan: "pilot", status: "onboarding", registered: "Mar 27, 2026", mark: "A", accent: "#3F5165" },
];

const APPROVALS: Approval[] = [
  { name: "Trinetra Eye & ENT", loc: "Visakhapatnam, AP", regNo: "HOSP/AP/2026/00904", contact: "Dr. Lakshmi Rao", phone: "+91 90142 77821", email: "lakshmi@trinetra.in", submitted: "4 days ago", overdue: true, mark: "T", accent: "#0E7C66" },
  { name: "Niramay Holistic Centre", loc: "Pune, MH", regNo: "HOSP/MH/2026/02041", contact: "Dr. Aniket Patil", phone: "+91 98214 33890", email: "aniket@niramay.in", submitted: "2 days ago", overdue: false, mark: "N", accent: "#5C6BC0" },
  { name: "Krishna Heart Institute", loc: "Hyderabad, TS", regNo: "HOSP/TS/2026/00541", contact: "Dr. Srikanth K.", phone: "+91 99812 70014", email: "srikanth@krishnaheart.in", submitted: "1 day ago", overdue: false, mark: "K", accent: "#B43A2C" },
  { name: "Sangam Diagnostics", loc: "Nashik, MH", regNo: "HOSP/MH/2026/02055", contact: "Mrs. Vidya Joshi", phone: "+91 90282 14998", email: "vidya@sangamdx.in", submitted: "14 hours ago", overdue: false, mark: "S", accent: "#0A7A8F" },
];

const LICENSES: License[] = [
  { hosp: "Suvarna Multi-Speciality", name: "CEA Certificate", no: "CEA/TS/HYD/2024/01182", valid: "31 Dec 2027", status: "ok", size: 218 },
  { hosp: "Suvarna Multi-Speciality", name: "Drug License (Form 20B)", no: "20B-AP-HYD/14782", valid: "14 Aug 2026", status: "ok", size: 184 },
  { hosp: "Akash Children's Clinic", name: "CEA Certificate", no: "CEA/KA/BLR/2024/00781", valid: "12 Jun 2026", status: "expiring", size: 402 },
  { hosp: "Karuna Maternity Centre", name: "BMW Authorisation", no: "BMW/MPCB/2024/4421", valid: "30 May 2026", status: "expiring", size: 156 },
  { hosp: "Citadel Diagnostics", name: "NABL Accreditation", no: "NABL/M-7741/2024", valid: "18 Apr 2027", status: "ok", size: 521 },
  { hosp: "Lotus Eye Hospital", name: "NABH Full", no: "NABH/F-2210/2024", valid: "09 Sep 2027", status: "ok", size: 348 },
];

const ACTIVITY: Activity[] = [
  { time: "2 min ago", kind: "ok", title: "Credentials issued · <b>Suvarna Multi-Speciality</b>", detail: "Tenant VX-T-00128 activated · admin email priya@suvarnahospital.in" },
  { time: "12 min ago", kind: "ok", title: "<b>Aarav Rao</b> approved registration of <b>Niramay Holistic Centre</b>", detail: "Stage 4/4 · DPDP signed · onboarding call: May 9, 11:00" },
  { time: "46 min ago", kind: "warn", title: "License expiring · <b>Akash Children's Clinic</b>", detail: "CEA Certificate expires in 36 days — reminder sent to admin" },
  { time: "1 h 12 min", kind: "ok", title: "New registration submitted · <b>Krishna Heart Institute</b>", detail: "4 documents uploaded · awaiting founder review" },
  { time: "3 h 02 min", kind: "danger", title: "Tenant suspended · <b>Surya Skin & Cosmetic</b>", detail: "Reason: payment failure (3 attempts) · grace period 7 days" },
  { time: "5 h 18 min", kind: "ok", title: "Plan changed · <b>Citadel Diagnostics</b>", detail: "Core → Scale · effective immediately · prorated invoice generated" },
  { time: "Yesterday", kind: "ok", title: "Document verified · <b>Maitri Multi-Specialty</b>", detail: "Drug License (Form 21) — verified by Aarav Rao" },
];

const TAB_LABELS: Record<ViewName, string> = {
  hospitals: "All hospitals",
  approvals: "Pending approvals",
  licenses: "Licenses & legal",
  activity: "Audit activity",
};

const STATUS_LABEL: Record<Status, string> = {
  active: "Active", pending: "Pending", suspended: "Suspended", onboarding: "Onboarding", trial: "Trial",
};
const PLAN_LABEL: Record<Plan, string> = { core: "Core", scale: "Scale", pilot: "Pilot" };

const STEPS = ["Hospital", "Contact", "License", "Approvals"] as const;

/* ───────────────────────── Icons ───────────────────────── */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Icon = {
  hospital: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" /></svg>),
  approvals: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><polyline points="9 15 11 17 15 13" /></svg>),
  licenses: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 13h6M9 17h3" /></svg>),
  activity: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>),
  modules: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>),
  billing: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><path d="M20 7h-7M14 17H4M17 12H7" /><circle cx="17" cy="7" r="3" /><circle cx="7" cy="17" r="3" /></svg>),
  settings: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>),
  search: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>),
  download: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>),
  plus: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke} strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>),
  close: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>),
  chevron: (<svg width="11" height="11" viewBox="0 0 24 24" {...stroke} strokeWidth={2.5}><polyline points="6 9 12 15 18 9" /></svg>),
  funnel: (<svg width="12" height="12" viewBox="0 0 24 24" {...stroke}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>),
  eye: (<svg width="13" height="13" viewBox="0 0 24 24" {...stroke}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>),
  reset: (<svg width="13" height="13" viewBox="0 0 24 24" {...stroke}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><polyline points="21 3 21 8 16 8" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><polyline points="3 21 3 16 8 16" /></svg>),
  dots: (<svg width="13" height="13" viewBox="0 0 24 24" {...stroke} strokeWidth={2.5}><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>),
  check: (<svg width="11" height="11" viewBox="0 0 24 24" {...stroke} strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>),
  checkBig: (<svg width="22" height="22" viewBox="0 0 24 24" {...stroke} strokeWidth={2.2}><polyline points="20 6 9 17 4 12" /></svg>),
  file: (<svg width="16" height="16" viewBox="0 0 24 24" {...stroke}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>),
  upload: (<svg width="16" height="16" viewBox="0 0 24 24" {...stroke}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>),
  info: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>),
  warn: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>),
  mail: (<svg width="14" height="14" viewBox="0 0 24 24" {...stroke}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>),
  logo: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAFAF7" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l3 8 4-16 3 8h4" /></svg>),
  menu: (<svg width="18" height="18" viewBox="0 0 24 24" {...stroke}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>),
  signout: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

function RichText({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ───────────────────────── Component ───────────────────── */

export default function AdminScreen({
  adminName = "Aarav Rao",
  adminRole = "Founder · root",
  onSignOut,
}: AdminScreenProps) {
  const [view, setView] = useState<ViewName>("hospitals");
  const [navOpen, setNavOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [credOpen, setCredOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [checks, setChecks] = useState<boolean[]>([true, true, false, false]);

  const initials = adminName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const openDrawer = useCallback(() => { setStep(1); setDrawerOpen(true); }, []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openCred = useCallback(() => setCredOpen(true), []);
  const closeCred = useCallback(() => setCredOpen(false), []);

  const nextStep = () => {
    if (step === 4) { closeDrawer(); setTimeout(openCred, 240); return; }
    setStep((s) => Math.min(4, s + 1));
  };
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const copyCred = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1400);
  };

  const goToView = (name: ViewName) => { setView(name); setNavOpen(false); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (credOpen) setCredOpen(false);
        else if (drawerOpen) setDrawerOpen(false);
        else if (navOpen) setNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [credOpen, drawerOpen, navOpen]);

  const navLinks: { key?: ViewName; label: string; icon: React.ReactNode; count?: string; hot?: boolean }[] = [
    { key: "hospitals", label: "Hospitals", icon: Icon.hospital, count: "128" },
    { key: "approvals", label: "Approvals", icon: Icon.approvals, count: "7", hot: true },
    { key: "licenses", label: "Licenses", icon: Icon.licenses, count: "214" },
    { key: "activity", label: "Activity", icon: Icon.activity },
  ];

  const StatusBadge = ({ s }: { s: Status }) => (
    <span className={`badge b-${s}`}><span className="dot" />{STATUS_LABEL[s]}</span>
  );

  const SidebarInner = (
    <>
      <div className="nav-logo">
        <div className="nav-mark">{Icon.logo}</div>
        <div>
          <div className="nav-wordmark">Vexoo<span className="ath">ATH</span></div>
          <div className="nav-sub">Founders' Console</div>
        </div>
      </div>

      <div className="nav-section">Operations</div>
      {navLinks.map((l) => (
        <a
          key={l.label}
          className={`nav-item${l.key && view === l.key ? " active" : ""}`}
          onClick={(e) => { e.preventDefault(); if (l.key) goToView(l.key); }}
          href="#"
        >
          {l.icon}
          {l.label}
          {l.count && <span className={`nav-count${l.hot ? " hot" : ""}`}>{l.count}</span>}
        </a>
      ))}

      <div className="nav-section">Platform</div>
      <a className="nav-item" href="#" onClick={(e) => e.preventDefault()}>{Icon.modules}Modules</a>
      <a className="nav-item" href="#" onClick={(e) => e.preventDefault()}>{Icon.billing}Billing &amp; plans</a>
      <a className="nav-item" href="#" onClick={(e) => e.preventDefault()}>{Icon.settings}Settings</a>

      <div className="nav-spacer" />

      <div className="nav-user-identity">
        <div className="nav-avatar">{initials}</div>
        <div style={{ minWidth: 0, textAlign: "left" }}>
          <div className="nav-user-name">{adminName}</div>
          <div className="nav-user-role">{adminRole}</div>
        </div>
      </div>

      <button
        className="nav-signout-btn"
        onClick={onSignOut}
        type="button"
      >
        {Icon.signout}
        Sign out
      </button>
    </>
  );

  return (
    <div className="vx-admin">
      <style>{ADMIN_CSS}</style>

      <div className="shell">
        <aside className="nav nav-desktop">{SidebarInner}</aside>

        <div className={`nav-backdrop${navOpen ? " open" : ""}`} onClick={() => setNavOpen(false)} />
        <aside className={`nav nav-mobile${navOpen ? " open" : ""}`}>{SidebarInner}</aside>

        <main className="main">
          <header className="topbar">
            <button className="hamburger" onClick={() => setNavOpen(true)} aria-label="Open menu">{Icon.menu}</button>
            <nav className="breadcrumb">
              <span>ATH</span><span className="sep">/</span>
              <span>{TAB_LABELS[view].split(" ")[0]}</span><span className="sep">/</span>
              <span className="here">{TAB_LABELS[view]}</span>
            </nav>
            <div className="topbar-search">
              {Icon.search}
              <input placeholder="Search hospitals, admins, registrations…" />
              <span className="kbd">⌘K</span>
            </div>
            <span className="top-pill"><span className="dot" />All systems · 99.98%</span>
            <div className="topbar-profile-wrap">
              <div className="topbar-profile-avatar" onClick={() => setShowProfile(true)}>
                {initials}
                <div className="topbar-profile-tooltip">
                  <div style={{ fontWeight:700, fontSize:13, color:"var(--ink-900)" }}>{adminName}</div>
                  <div style={{ fontSize:12, color:"var(--ink-500)", marginTop:2 }}>{adminRole}</div>
                  <div style={{ fontSize:12, color:"var(--ink-500)", marginTop:2 }}>superadmin@vexoo.in</div>
                  <div style={{ fontSize:11, color:"var(--mineral-700)", marginTop:8, fontWeight:600 }}>Click to view profile →</div>
                </div>
              </div>
            </div>
          </header>

          <div className="page-head">
            <div className="page-head-row">
              <div>
                <p className="eyebrow">Tenant administration</p>
                <h1 className="page-title">Hospitals on <em>Vexoo</em></h1>
                <p className="page-sub">Register hospitals, generate admin credentials, review licenses and approvals. Every tenant on the platform begins here.</p>
              </div>
              <div className="page-head-actions">
                <button className="btn btn-ghost">{Icon.download}Export</button>
                <button className="btn btn-primary" onClick={openDrawer}>{Icon.plus}Register hospital</button>
              </div>
            </div>
          </div>

          <div className="kpis">
            <div className="kpi" style={{ ["--accent" as any]: "var(--mineral-100)" }}>
              <div className="kpi-label">Active tenants</div>
              <div className="kpi-val">128</div>
              <div className="kpi-delta"><span className="up">▲ 6</span> this month</div>
            </div>
            <div className="kpi" style={{ ["--accent" as any]: "var(--amber-bg)" }}>
              <div className="kpi-label">Pending approval</div>
              <div className="kpi-val">7</div>
              <div className="kpi-delta">2 overdue · oldest 4d</div>
            </div>
            <div className="kpi" style={{ ["--accent" as any]: "#F0EAFA" }}>
              <div className="kpi-label">In trial</div>
              <div className="kpi-val">19</div>
              <div className="kpi-delta">3 converting this week</div>
            </div>
            <div className="kpi" style={{ ["--accent" as any]: "var(--signal-red-bg)" }}>
              <div className="kpi-label">Licenses expiring &lt;30d</div>
              <div className="kpi-val">4</div>
              <div className="kpi-delta"><span className="dn">▲ 1</span> from last week</div>
            </div>
          </div>

          <div className="tabs">
            <button className={`tab${view === "hospitals" ? " active" : ""}`} onClick={() => setView("hospitals")}>Hospitals <span className="count">128</span></button>
            <button className={`tab${view === "approvals" ? " active" : ""}`} onClick={() => setView("approvals")}>Approvals <span className="count">7</span></button>
            <button className={`tab${view === "licenses" ? " active" : ""}`} onClick={() => setView("licenses")}>Licenses</button>
            <button className={`tab${view === "activity" ? " active" : ""}`} onClick={() => setView("activity")}>Activity</button>
          </div>

          {/* ── Hospitals view ── */}
          {view === "hospitals" && (
            <section className="view active">
              <div className="toolbar">
                <button className="filter-chip active">All <span className="mono" style={{ opacity: 0.6, fontSize: 11 }}>128</span></button>
                <button className="filter-chip">Active</button>
                <button className="filter-chip">Onboarding</button>
                <button className="filter-chip">Trial</button>
                <button className="filter-chip">Suspended</button>
                <div className="toolbar-search">{Icon.search}<input placeholder="Filter by name, city, registration no…" /></div>
                <div className="toolbar-spacer" />
                <button className="filter-chip">{Icon.funnel}City: All</button>
                <button className="filter-chip">Plan: All</button>
                <button className="filter-chip">Sort: Newest {Icon.chevron}</button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 32 }}><input type="checkbox" /></th>
                      <th>Hospital</th><th>Admin / Contact</th><th>City</th>
                      <th>Plan</th><th>Status</th><th>Registered</th>
                      <th style={{ width: 100 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {HOSPITALS.map((h) => (
                      <tr key={h.id}>
                        <td><input type="checkbox" /></td>
                        <td>
                          <div className="hosp-cell">
                            <div className="hosp-mark" style={{ background: h.accent }}>{h.mark}</div>
                            <div>
                              <div className="hosp-name">{h.name}</div>
                              <div className="hosp-id mono">{h.id} · {h.regNo}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: 13, color: "var(--ink-800)", fontWeight: 500 }}>{h.admin}</div>
                          <div className="meta-line">{h.email}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: 13, color: "var(--ink-800)" }}>{h.city}</div>
                          <div className="meta-line mono" style={{ fontSize: 11 }}>{h.state}</div>
                        </td>
                        <td><span className={`plan-pill ${h.plan}`}>{PLAN_LABEL[h.plan]}</span></td>
                        <td><StatusBadge s={h.status} /></td>
                        <td><span className="meta-line">{h.registered}</span></td>
                        <td>
                          <div className="row-actions">
                            <button className="icon-btn" title="View" onClick={(e) => e.stopPropagation()}>{Icon.eye}</button>
                            <button className="icon-btn" title="Reset password" onClick={(e) => e.stopPropagation()}>{Icon.reset}</button>
                            <button className="icon-btn" title="More" onClick={(e) => e.stopPropagation()}>{Icon.dots}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ── Approvals view ── */}
          {view === "approvals" && (
            <section className="view active">
              <div className="toolbar">
                <button className="filter-chip active">Pending <span className="mono" style={{ opacity: 0.6, fontSize: 11 }}>7</span></button>
                <button className="filter-chip">Needs info</button>
                <button className="filter-chip">Approved (30d)</button>
                <button className="filter-chip">Rejected (30d)</button>
                <div className="toolbar-spacer" />
                <button className="filter-chip">Oldest first ▾</button>
              </div>
              <div className="approvals-grid">
                {APPROVALS.map((a) => (
                  <article className="approval-card" key={a.name} style={a.overdue ? undefined : { ["--amber" as any]: "var(--ink-300)" }}>
                    <div className="approval-head">
                      <div className="hosp-mark" style={{ background: a.accent, width: 38, height: 38, fontSize: 15 }}>{a.mark}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="approval-name">{a.name}</div>
                          {a.overdue
                            ? <span className="badge b-pending"><span className="dot" />Overdue</span>
                            : <span className="badge b-onboarding"><span className="dot" />In review</span>}
                        </div>
                        <div className="approval-loc">{a.loc} · <span className="mono" style={{ fontSize: 11 }}>{a.regNo}</span></div>
                      </div>
                    </div>
                    <div className="approval-grid2">
                      <div><div className="k">Contact</div><div className="v">{a.contact}</div></div>
                      <div><div className="k">Phone</div><div className="v mono">{a.phone}</div></div>
                      <div style={{ gridColumn: "1/-1" }}><div className="k">Email</div><div className="v">{a.email}</div></div>
                    </div>
                    <div className="approval-foot">
                      <span className="submitted">Submitted {a.submitted}</span>
                      <div className="actions">
                        <button className="btn btn-ghost btn-sm">Review</button>
                        <button className="btn btn-danger-ghost btn-sm">Reject</button>
                        <button className="btn btn-primary btn-sm" onClick={openCred}>Approve &amp; create</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ── Licenses view ── */}
          {view === "licenses" && (
            <section className="view active">
              <div className="toolbar">
                <button className="filter-chip active">All</button>
                <button className="filter-chip">NABH</button>
                <button className="filter-chip">Drug license</button>
                <button className="filter-chip">Bio-medical waste</button>
                <button className="filter-chip">Expiring &lt;30d</button>
                <div className="toolbar-spacer" />
              </div>
              <div className="license-grid">
                {LICENSES.map((l, i) => (
                  <article className="license-card" key={i}>
                    <div className="license-head">
                      <div className="license-doc">PDF<span className="ext">{l.size} KB</span></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="license-name">{l.name}</div>
                        <div className="license-hosp">{l.hosp}</div>
                      </div>
                      {l.status === "expiring"
                        ? <span className="badge b-pending"><span className="dot" />Expiring</span>
                        : <span className="badge b-active"><span className="dot" />Valid</span>}
                    </div>
                    <div className="license-meta">
                      <div>License no.<br /><span className="v">{l.no}</span></div>
                      <div style={{ textAlign: "right" }}>Valid until<br /><span className="v">{l.valid}</span></div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* ── Activity view ── */}
          {view === "activity" && (
            <section className="view active">
              <div className="toolbar">
                <button className="filter-chip active">All</button>
                <button className="filter-chip">Registrations</button>
                <button className="filter-chip">Approvals</button>
                <button className="filter-chip">Credentials</button>
                <button className="filter-chip">Suspensions</button>
                <div className="toolbar-spacer" />
                <span className="meta-line">Showing last 24 hours</span>
              </div>
              <div className="activity-list">
                {ACTIVITY.map((a, i) => (
                  <div className={`act-item ${a.kind}`} key={i}>
                    <div className="act-time">{a.time}</div>
                    <div className="act-body">
                      <div className="act-title"><RichText html={a.title} /></div>
                      <div className="act-detail">{a.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ── Drawer: Register hospital ── */}
      <div className={`drawer-backdrop${drawerOpen ? " open" : ""}`} onClick={closeDrawer} />
      <aside className={`drawer${drawerOpen ? " open" : ""}`} aria-hidden={!drawerOpen}>
        <header className="drawer-head">
          <div>
            <div className="drawer-eyebrow">{Icon.plus}New tenant</div>
            <h2 className="drawer-title">Register a <em>hospital</em></h2>
          </div>
          <button className="drawer-close" onClick={closeDrawer} aria-label="Close">{Icon.close}</button>
        </header>

        <nav className="stepper">
          {STEPS.map((label, i) => {
            const n = i + 1;
            return (
              <div key={label} className={`step${step === n ? " active" : ""}${n < step ? " done" : ""}`} onClick={() => setStep(n)}>
                <span className="step-num">{n}</span><span className="step-label">{label}</span>
              </div>
            );
          })}
        </nav>

        <div className="drawer-body" key={step}>
          {step === 1 && (
            <>
              <h3 className="form-section-title">Hospital identity</h3>
              <div className="field">
                <div className="lbl">Hospital name <span className="req">*</span></div>
                <input className="inp" placeholder="e.g. Suvarna Multi-Speciality Hospital" />
                <div className="helper">Public name as it should appear to patients and on prescriptions.</div>
              </div>
              <div className="field-2col">
                <div>
                  <div className="lbl">Registration number <span className="req">*</span></div>
                  <input className="inp mono" placeholder="HOSP/AP/2026/00824" />
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
                <div><div className="lbl">GSTIN</div><input className="inp mono" placeholder="36AAAAA0000A1Z5" /></div>
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
                <div><div className="lbl">PIN</div><input className="inp mono" placeholder="500034" maxLength={6} /></div>
              </div>
              <h3 className="form-section-title">Plan &amp; modules</h3>
              <div className="field-2col">
                <div>
                  <div className="lbl">Initial plan <span className="req">*</span></div>
                  <select className="sel">
                    <option>Pilot — 30-day trial</option><option>Core</option>
                    <option>Scale</option><option>Enterprise</option>
                  </select>
                </div>
                <div>
                  <div className="lbl">Billing cycle</div>
                  <select className="sel"><option>Monthly</option><option>Quarterly</option><option>Annual</option></select>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="form-section-title">Primary contact (will become Hospital Admin)</h3>
              <div className="field-2col">
                <div><div className="lbl">Full name <span className="req">*</span></div><input className="inp" placeholder="Dr. Priya Iyer" /></div>
                <div><div className="lbl">Designation</div><input className="inp" placeholder="Medical Director" /></div>
              </div>
              <div className="field-2col">
                <div><div className="lbl">Phone <span className="req">*</span></div><input className="inp mono" placeholder="+91 98765 43210" /></div>
                <div><div className="lbl">WhatsApp (optional)</div><input className="inp mono" placeholder="+91 98765 43210" /></div>
              </div>
              <div className="field">
                <div className="lbl">Email <span className="req">*</span></div>
                <input className="inp" type="email" placeholder="priya@suvarnahospital.in" />
                <div className="helper">Credentials and onboarding emails will be sent here.</div>
              </div>
              <div className="field">
                <div className="lbl">Admin sub-domain</div>
                <div className="subdomain">
                  <input className="inp" placeholder="suvarna" style={{ border: "none", flex: 1 }} />
                  <span className="subdomain-suffix mono">.vexoo.in</span>
                </div>
                <div className="helper">Tenant URL where hospital staff will sign in.</div>
              </div>
              <h3 className="form-section-title">Secondary contact</h3>
              <div className="field-2col">
                <div><div className="lbl">Name</div><input className="inp" placeholder="Optional" /></div>
                <div><div className="lbl">Phone</div><input className="inp mono" placeholder="Optional" /></div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="form-section-title">Legal &amp; license details</h3>
              <div className="field-2col">
                <div><div className="lbl">Clinical Establishments Act No.</div><input className="inp mono" placeholder="CEA/TS/HYD/2024/01182" /></div>
                <div><div className="lbl">Valid until</div><input className="inp" type="date" /></div>
              </div>
              <div className="field-2col">
                <div><div className="lbl">Drug license (Form 20/21)</div><input className="inp mono" placeholder="20B-AP-HYD/14782" /></div>
                <div><div className="lbl">Valid until</div><input className="inp" type="date" /></div>
              </div>
              <div className="field-2col">
                <div><div className="lbl">Bio-medical waste authorisation</div><input className="inp mono" placeholder="BMW/TSPCB/2024/4421" /></div>
                <div>
                  <div className="lbl">NABH / NABL</div>
                  <select className="sel">
                    <option>None</option><option>NABH — Entry level</option>
                    <option>NABH — Full</option><option>NABL accredited lab</option>
                  </select>
                </div>
              </div>
              <h3 className="form-section-title">Document uploads</h3>
              <div className="upload uploaded">
                {Icon.file}
                <div>
                  <div style={{ fontWeight: 500, color: "var(--mineral-800)" }}>cea-certificate.pdf</div>
                  <div className="helper" style={{ marginTop: 1 }}>Uploaded · ready for review</div>
                </div>
                <div className="upload-meta">218 KB</div>
              </div>
              {["Upload drug-license PDF", "Upload GST certificate", "Upload signatory PAN / ID"].map((t, i) => (
                <div className="upload" key={t}>
                  {Icon.upload}<div>{t}</div>
                  <div className="upload-meta">{i === 2 ? "PDF, JPG · ≤ 2 MB" : "PDF · ≤ 5 MB"}</div>
                </div>
              ))}
            </>
          )}

          {step === 4 && (
            <>
              <h3 className="form-section-title">Founder approvals (your sign-off)</h3>
              <p className="helper" style={{ marginBottom: 12 }}>Confirm each item before generating credentials. Founders must approve all four to activate the tenant.</p>
              {[
                { t: "Identity & documents verified", d: "CEA, drug license, GSTIN and signatory ID match the registered entity." },
                { t: "DPDP / data-processing agreement signed", d: "Hospital has accepted the data-protection addendum and patient-consent flow." },
                { t: "Onboarding call scheduled", d: "A 45-min walkthrough is on the calendar with the hospital admin." },
                { t: "Billing & payment method on file", d: "Pilot tenants can be activated without billing; Core+ requires a method on file." },
              ].map((c, i) => (
                <div
                  key={c.t}
                  className={`check-row${checks[i] ? " checked" : ""}`}
                  onClick={() => setChecks((arr) => arr.map((v, j) => (j === i ? !v : v)))}
                >
                  <div className="check-box">{Icon.check}</div>
                  <div><div className="check-title">{c.t}</div><div className="check-desc">{c.d}</div></div>
                </div>
              ))}
              <h3 className="form-section-title">Founder note (internal)</h3>
              <textarea className="ta" placeholder="Anything the team should know — referral source, special pricing, deployment quirks…" />
              <div className="modal-note" style={{ marginTop: 18 }}>
                {Icon.info}
                <div>On <b>Generate &amp; activate</b>, Vexoo will create the tenant database, provision the admin account, and email login credentials to the primary contact. This action is logged and reversible within 24 hours.</div>
              </div>
            </>
          )}
        </div>

        <footer className="drawer-foot">
          <span className="progress">Step {step} of 4</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={prevStep} disabled={step === 1}>Back</button>
            <button className="btn btn-primary" onClick={nextStep}>
              {step === 4 ? <>{Icon.check} Generate &amp; activate</> : "Continue →"}
            </button>
          </div>
        </footer>
      </aside>

      {/* ── Credentials modal ── */}
      {credOpen && (
        <div className="modal-back open" onClick={(e) => { if (e.target === e.currentTarget) closeCred(); }}>
          <div className="modal">
            <div className="modal-icon">{Icon.checkBig}</div>
            <p className="modal-eyebrow">Tenant activated</p>
            <h2 className="modal-title">Suvarna Hospital is <em>live</em></h2>
            <p className="modal-sub">Generated admin credentials below. Copy or download — Vexoo only stores a hash, so this is the last time the password is shown in plaintext.</p>

            {[
              { key: "tenant", k: "Tenant", v: "suvarna.vexoo.in" },
              { key: "email", k: "Admin email", v: "priya@suvarnahospital.in" },
              { key: "pw", k: "Temp password", v: "vx-Helix·8204·Quiet" },
              { key: "id", k: "Tenant ID", v: "VX-T-00129" },
            ].map((row) => (
              <div className="cred-row" key={row.key}>
                <span className="k">{row.k}</span>
                <span className="v">{row.v}</span>
                <button
                  className={`cred-copy${copied === row.key ? " copied" : ""}`}
                  onClick={() => copyCred(row.key, row.v)}
                >
                  {copied === row.key ? "Copied" : "Copy"}
                </button>
              </div>
            ))}

            <div className="modal-note">
              {Icon.warn}
              <div>The temporary password expires in <b>24 hours</b>. The admin will be forced to set a new one and enable 2FA on first sign-in.</div>
            </div>

            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={closeCred}>Close</button>
              <button className="btn btn-ghost">{Icon.download}Download .pdf</button>
              <button className="btn btn-primary" onClick={closeCred}>{Icon.mail}Email to admin</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Profile Modal — ONLY ONE INSTANCE, INSIDE ROOT ── */}
      {showProfile && (
        <div onClick={() => setShowProfile(false)} style={{
          position:"fixed", inset:0, background:"rgba(11,15,14,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:200, backdropFilter:"blur(3px)"
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:"#FAFAF7", borderRadius:14, padding:28,
            width:420, maxWidth:"90vw", boxShadow:"0 20px 60px rgba(11,15,14,0.25)",
            border:"1px solid var(--ink-200)"
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"var(--mineral-700)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#FAFAF7", fontSize:20, fontWeight:700 }}>{initials}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:17, color:"var(--ink-900)" }}>{adminName}</div>
                <div style={{ fontSize:13, color:"var(--ink-500)", marginTop:2 }}>{adminRole}</div>
              </div>
            </div>
            {[["Full Name", adminName], ["Email", "superadmin@vexoo.in"], ["Phone", "+91 98765 43210"], ["Role", adminRole]].map(([label, val]) => (
              <div key={label} style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:500, color:"var(--ink-500)", marginBottom:6 }}>{label}</div>
                <input defaultValue={val} style={{
                  width:"100%", padding:"9px 12px", border:"1px solid var(--ink-200)",
                  borderRadius:7, fontSize:13.5, outline:"none", fontFamily:"inherit",
                  color:"var(--ink-900)", background:"white"
                }} />
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button onClick={() => setShowProfile(false)} style={{
                flex:1, padding:"10px", borderRadius:8, border:"1px solid var(--ink-200)",
                background:"white", cursor:"pointer", fontFamily:"inherit", fontSize:13.5,
                color:"var(--ink-700)"
              }}>Close</button>
              <button style={{
                flex:1, padding:"10px", borderRadius:8, border:"none",
                background:"var(--mineral-700)", color:"#FAFAF7", cursor:"pointer",
                fontFamily:"inherit", fontSize:13.5, fontWeight:600
              }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Styles ─────────────────────── */

const ADMIN_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

.vx-admin{
  --paper:#FAFAF7; --paper-warm:#F4F2EC;
  --ink-900:#0B0F0E; --ink-800:#171C1B; --ink-700:#2A302F; --ink-600:#454C4B;
  --ink-500:#6B7270; --ink-400:#9AA09E; --ink-300:#C4C8C6; --ink-200:#E4E6E4;
  --ink-100:#EFF0EE; --ink-50:#F5F6F4;
  --mineral-900:#062F26; --mineral-800:#0A4A3D; --mineral-700:#0E7C66; --mineral-600:#149E83;
  --mineral-500:#1FBFA0; --mineral-400:#5BD4BC; --mineral-300:#A4E8DA; --mineral-200:#D1F2EB; --mineral-100:#E8F8F4;
  --signal-red:#B43A2C; --signal-red-bg:#FAE2DD; --amber:#C68A1F; --amber-bg:#FCF1D9; --slate:#3F5165; --slate-bg:#E5EAF0;
  --grain:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.04 0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  font-family:'Inter Tight',Inter,system-ui,sans-serif;
  background:var(--paper); background-image:var(--grain); background-size:220px;
  color:var(--ink-900); min-height:100vh; -webkit-font-smoothing:antialiased;
  font-feature-settings:"ss01","cv11";
}
.vx-admin *,.vx-admin *::before,.vx-admin *::after{ box-sizing:border-box; margin:0; padding:0; }
.vx-admin ::selection{ background:var(--mineral-700); color:#FAFAF7; }
.vx-admin *:focus-visible{ outline:2px solid var(--mineral-700); outline-offset:2px; border-radius:3px; }
.vx-admin ::-webkit-scrollbar{ width:8px; height:8px; }
.vx-admin ::-webkit-scrollbar-thumb{ background:rgba(11,15,14,0.12); border-radius:6px; }
.vx-admin .mono{ font-family:'JetBrains Mono',Menlo,monospace; }
.vx-admin .eyebrow{ font-size:0.6875rem; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink-500); }

.vx-admin .shell{ display:grid; grid-template-columns:240px 1fr; min-height:100vh; }

/* nav */
.vx-admin .nav{
  background:#0B0F0E; color:#FAFAF7; padding:20px 16px 24px;
  position:sticky; top:0; height:100vh; display:flex; flex-direction:column;
  border-right:1px solid rgba(255,255,255,0.06); overflow:hidden;
}
.vx-admin .nav::before{ content:''; position:absolute; top:-180px; right:-120px; width:340px; height:340px; border-radius:50%; background:rgba(14,124,102,0.22); filter:blur(80px); pointer-events:none; }
.vx-admin .nav > *{ position:relative; z-index:1; }
.vx-admin .nav-logo{ display:flex; align-items:center; gap:10px; padding:6px 8px 18px; }
.vx-admin .nav-mark{ width:32px; height:32px; border-radius:7px; background:var(--mineral-700); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.3); }
.vx-admin .nav-wordmark{ font-family:'Fraunces',Georgia,serif; font-size:18px; letter-spacing:-0.04em; }
.vx-admin .nav-wordmark .ath{ color:var(--mineral-400); font-style:italic; font-weight:300; margin-left:4px; }
.vx-admin .nav-sub{ font-size:9.5px; text-transform:uppercase; letter-spacing:0.2em; color:var(--mineral-400); margin-top:2px; }
.vx-admin .nav-section{ font-size:10px; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:rgba(250,250,247,0.4); padding:14px 10px 6px; }
.vx-admin .nav-item{ display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:6px; font-size:13.5px; font-weight:500; color:rgba(250,250,247,0.72); cursor:pointer; transition:background .15s,color .15s; text-decoration:none; margin-bottom:1px; }
.vx-admin .nav-item:hover{ background:rgba(255,255,255,0.04); color:#FAFAF7; }
.vx-admin .nav-item.active{ background:rgba(14,124,102,0.18); color:#FAFAF7; box-shadow:inset 2px 0 0 var(--mineral-500); }
.vx-admin .nav-item svg{ flex-shrink:0; opacity:0.75; }
.vx-admin .nav-item.active svg{ opacity:1; color:var(--mineral-400); }
.vx-admin .nav-count{ margin-left:auto; font-size:11px; font-weight:600; background:rgba(255,255,255,0.07); color:rgba(250,250,247,0.85); padding:1px 7px; border-radius:999px; font-family:'JetBrains Mono',monospace; }
.vx-admin .nav-count.hot{ background:rgba(180,58,44,0.25); color:#F4B5AB; }
.vx-admin .nav-spacer{ flex:1; }

/* ── Sidebar footer: user identity + sign out button ── */
.vx-admin .nav-user-identity{
  display:flex; align-items:center; gap:10px; padding:10px;
  border-radius:8px; background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.06); width:100%; margin-bottom:8px;
}
.vx-admin .nav-avatar{ width:30px; height:30px; border-radius:50%; background:var(--mineral-700); color:#FAFAF7; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0; }
.vx-admin .nav-user-name{ font-size:13px; font-weight:500; color:#FAFAF7; }
.vx-admin .nav-user-role{ font-size:11px; color:rgba(250,250,247,0.5); }
.vx-admin .nav-signout-btn{
  display:flex; align-items:center; justify-content:center; gap:8px;
  width:100%; padding:9px 14px; border-radius:8px;
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
  color:rgba(250,250,247,0.6); font-family:'Inter Tight',Inter,system-ui,sans-serif;
  font-size:13px; font-weight:500; cursor:pointer;
  transition:background .15s, color .15s, border-color .15s;
}
.vx-admin .nav-signout-btn:hover{
  background:rgba(180,58,44,0.15); color:#F4B5AB;
  border-color:rgba(180,58,44,0.3);
}

.vx-admin .nav-mobile{ display:none; }
.vx-admin .nav-backdrop{ position:fixed; inset:0; background:rgba(11,15,14,0.45); z-index:55; opacity:0; pointer-events:none; transition:opacity .2s; }
.vx-admin .nav-backdrop.open{ opacity:1; pointer-events:auto; }

/* main */
.vx-admin .main{ display:flex; flex-direction:column; min-width:0; }
.vx-admin .topbar{ height:56px; padding:0 28px; display:flex; align-items:center; gap:16px; border-bottom:1px solid var(--ink-200); background:rgba(250,250,247,0.85); backdrop-filter:blur(8px); position:sticky; top:0; z-index:10; }
.vx-admin .hamburger{ display:none; width:36px; height:36px; border-radius:7px; border:1px solid var(--ink-200); background:white; color:var(--ink-700); align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; }
.vx-admin .breadcrumb{ display:flex; align-items:center; gap:8px; font-size:13px; color:var(--ink-500); }
.vx-admin .breadcrumb .sep{ color:var(--ink-300); }
.vx-admin .breadcrumb .here{ color:var(--ink-900); font-weight:500; }
.vx-admin .topbar-search{ margin-left:auto; position:relative; width:300px; }
.vx-admin .topbar-search input{ width:100%; height:34px; padding:0 12px 0 34px; border:1px solid var(--ink-200); border-radius:6px; background:white; font-family:inherit; font-size:13px; color:var(--ink-900); outline:none; }
.vx-admin .topbar-search input::placeholder{ color:var(--ink-400); }
.vx-admin .topbar-search input:focus{ border-color:var(--mineral-700); box-shadow:0 0 0 3px rgba(14,124,102,0.1); }
.vx-admin .topbar-search svg{ position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--ink-400); }
.vx-admin .topbar-search .kbd{ position:absolute; right:8px; top:50%; transform:translateY(-50%); font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--ink-400); background:var(--ink-50); border:1px solid var(--ink-200); padding:1px 5px; border-radius:4px; }
.vx-admin .top-pill{ display:inline-flex; align-items:center; gap:6px; padding:5px 10px; border-radius:999px; font-size:11.5px; font-weight:500; background:var(--mineral-100); color:var(--mineral-800); border:1px solid var(--mineral-200); white-space:nowrap; }
.vx-admin .top-pill .dot{ width:6px; height:6px; border-radius:50%; background:var(--mineral-600); animation:vxpulse 2s infinite; }
@keyframes vxpulse{ 0%,100%{opacity:1;} 50%{opacity:0.4;} }

/* ── Profile avatar tooltip ── */
.vx-admin .topbar-profile-wrap{ position:relative; }
.vx-admin .topbar-profile-avatar{
  width:34px; height:34px; border-radius:50%;
  background:var(--mineral-700); color:#FAFAF7;
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:600; cursor:pointer; flex-shrink:0;
  transition:opacity .15s;
}
.vx-admin .topbar-profile-avatar:hover{ opacity:0.85; }
.vx-admin .topbar-profile-tooltip{
  position:absolute; top:calc(100% + 10px); right:0;
  background:#FAFAF7; border:1px solid var(--ink-200);
  border-radius:10px; padding:14px 16px;
  box-shadow:0 8px 24px rgba(11,15,14,0.14);
  min-width:200px; z-index:100; pointer-events:none;
  opacity:0; transform:translateY(-4px);
  transition:opacity .15s,transform .15s; white-space:nowrap;
}
.vx-admin .topbar-profile-wrap:hover .vx-admin .topbar-profile-tooltip{ opacity:1; transform:translateY(0); }
.vx-admin .topbar-profile-wrap:hover .topbar-profile-tooltip{ opacity:1; transform:translateY(0); }

/* page header */
.vx-admin .page-head{ padding:32px 28px 16px; }
.vx-admin .page-head .eyebrow{ display:flex; align-items:center; gap:8px; }
.vx-admin .page-head .eyebrow::before{ content:''; width:24px; height:1px; background:var(--ink-300); }
.vx-admin .page-title{ font-family:'Fraunces',Georgia,serif; font-size:38px; line-height:1.05; letter-spacing:-0.04em; margin-top:6px; color:var(--ink-900); font-weight:400; }
.vx-admin .page-title em{ font-style:italic; font-weight:300; color:var(--mineral-700); }
.vx-admin .page-sub{ font-size:14px; color:var(--ink-500); margin-top:8px; max-width:560px; line-height:1.55; }
.vx-admin .page-head-row{ display:flex; align-items:flex-end; justify-content:space-between; gap:24px; flex-wrap:wrap; }
.vx-admin .page-head-actions{ display:flex; gap:10px; align-items:center; }

/* buttons */
.vx-admin .btn{ display:inline-flex; align-items:center; gap:7px; height:38px; padding:0 14px; border-radius:6px; font-family:inherit; font-size:13.5px; font-weight:500; cursor:pointer; transition:all .15s; border:1px solid transparent; white-space:nowrap; }
.vx-admin .btn:disabled{ opacity:0.45; cursor:not-allowed; }
.vx-admin .btn-primary{ background:var(--mineral-700); color:#FAFAF7; box-shadow:0 1px 0 rgba(11,15,14,0.1), inset 0 1px 0 rgba(255,250,247,0.08); }
.vx-admin .btn-primary:hover{ background:var(--mineral-800); }
.vx-admin .btn-ghost{ background:white; border-color:var(--ink-200); color:var(--ink-700); }
.vx-admin .btn-ghost:hover{ background:var(--ink-50); border-color:var(--ink-300); }
.vx-admin .btn-danger-ghost{ background:white; border-color:var(--ink-200); color:var(--signal-red); }
.vx-admin .btn-danger-ghost:hover{ background:var(--signal-red-bg); border-color:rgba(180,58,44,0.25); }
.vx-admin .btn-sm{ height:30px; padding:0 11px; font-size:12.5px; }

/* KPIs */
.vx-admin .kpis{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; padding:0 28px 22px; }
.vx-admin .kpi{ background:white; border:1px solid var(--ink-200); border-radius:8px; padding:16px 18px; position:relative; overflow:hidden; }
.vx-admin .kpi::after{ content:''; position:absolute; right:-30px; top:-30px; width:80px; height:80px; border-radius:50%; background:var(--accent,var(--mineral-100)); opacity:0.5; }
.vx-admin .kpi-label{ font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink-500); font-weight:500; }
.vx-admin .kpi-val{ font-family:'Fraunces',Georgia,serif; font-size:32px; line-height:1; letter-spacing:-0.04em; color:var(--ink-900); margin-top:8px; position:relative; z-index:1; }
.vx-admin .kpi-delta{ margin-top:8px; font-size:11.5px; color:var(--ink-500); display:flex; align-items:center; gap:5px; position:relative; z-index:1; }
.vx-admin .kpi-delta .up{ color:var(--mineral-700); font-weight:600; }
.vx-admin .kpi-delta .dn{ color:var(--signal-red); font-weight:600; }

/* tabs */
.vx-admin .tabs{ display:flex; gap:4px; padding:0 28px; border-bottom:1px solid var(--ink-200); margin-top:8px; }
.vx-admin .tab{ padding:11px 14px; font-size:13.5px; font-weight:500; color:var(--ink-500); cursor:pointer; border:none; background:none; font-family:inherit; border-bottom:2px solid transparent; margin-bottom:-1px; display:inline-flex; align-items:center; gap:8px; transition:color .15s,border-color .15s; white-space:nowrap; }
.vx-admin .tab:hover{ color:var(--ink-800); }
.vx-admin .tab.active{ color:var(--ink-900); border-bottom-color:var(--mineral-700); font-weight:600; }
.vx-admin .tab .count{ font-family:'JetBrains Mono',monospace; font-size:11px; padding:1px 6px; border-radius:999px; background:var(--ink-100); color:var(--ink-600); }
.vx-admin .tab.active .count{ background:var(--mineral-100); color:var(--mineral-800); }

/* toolbar */
.vx-admin .toolbar{ display:flex; align-items:center; gap:10px; padding:16px 28px; flex-wrap:wrap; }
.vx-admin .filter-chip{ display:inline-flex; align-items:center; gap:6px; height:30px; padding:0 11px; border-radius:999px; font-size:12.5px; font-weight:500; color:var(--ink-700); background:white; border:1px solid var(--ink-200); cursor:pointer; transition:all .15s; font-family:inherit; white-space:nowrap; }
.vx-admin .filter-chip:hover{ background:var(--ink-50); }
.vx-admin .filter-chip.active{ background:var(--ink-900); color:#FAFAF7; border-color:var(--ink-900); }
.vx-admin .toolbar-search{ position:relative; min-width:240px; }
.vx-admin .toolbar-search input{ width:100%; height:32px; padding:0 12px 0 32px; border:1px solid var(--ink-200); border-radius:6px; background:white; font-family:inherit; font-size:12.5px; outline:none; }
.vx-admin .toolbar-search svg{ position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--ink-400); }
.vx-admin .toolbar-spacer{ flex:1; }

/* table */
.vx-admin .table-wrap{ margin:0 28px 32px; background:white; border:1px solid var(--ink-200); border-radius:8px; overflow-x:auto; }
.vx-admin table{ width:100%; border-collapse:collapse; font-size:13px; min-width:760px; }
.vx-admin thead th{ text-align:left; padding:11px 16px; font-size:10.5px; text-transform:uppercase; letter-spacing:0.12em; font-weight:600; color:var(--ink-500); background:var(--ink-50); border-bottom:1px solid var(--ink-200); white-space:nowrap; }
.vx-admin tbody td{ padding:14px 16px; border-bottom:1px solid var(--ink-100); vertical-align:middle; }
.vx-admin tbody tr{ cursor:pointer; transition:background .1s; }
.vx-admin tbody tr:hover{ background:var(--ink-50); }
.vx-admin tbody tr:last-child td{ border-bottom:none; }
.vx-admin .hosp-cell{ display:flex; align-items:center; gap:11px; }
.vx-admin .hosp-mark{ width:34px; height:34px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-family:'Fraunces',Georgia,serif; font-size:14px; font-weight:500; color:#FAFAF7; flex-shrink:0; }
.vx-admin .hosp-name{ font-weight:600; color:var(--ink-900); font-size:13.5px; }
.vx-admin .hosp-id{ font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--ink-500); margin-top:1px; }

/* badges */
.vx-admin .badge{ display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:999px; font-size:11.5px; font-weight:500; line-height:1; border:1px solid transparent; white-space:nowrap; }
.vx-admin .badge .dot{ width:6px; height:6px; border-radius:50%; }
.vx-admin .b-active{ background:var(--mineral-100); color:var(--mineral-800); border-color:var(--mineral-200); }
.vx-admin .b-active .dot{ background:var(--mineral-600); }
.vx-admin .b-pending{ background:var(--amber-bg); color:#8C5F0E; border-color:#F2DEA8; }
.vx-admin .b-pending .dot{ background:var(--amber); }
.vx-admin .b-suspended{ background:var(--signal-red-bg); color:var(--signal-red); border-color:#F2C7C0; }
.vx-admin .b-suspended .dot{ background:var(--signal-red); }
.vx-admin .b-onboarding{ background:var(--slate-bg); color:var(--slate); border-color:#CFD7E0; }
.vx-admin .b-onboarding .dot{ background:var(--slate); }
.vx-admin .b-trial{ background:#F0EAFA; color:#5A3FA0; border-color:#DCD0F2; }
.vx-admin .b-trial .dot{ background:#7A5BC9; }

.vx-admin .plan-pill{ display:inline-block; padding:2px 8px; border-radius:4px; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:500; background:var(--ink-100); color:var(--ink-700); }
.vx-admin .plan-pill.scale{ background:#262C2B; color:#FAFAF7; }
.vx-admin .plan-pill.core{ background:var(--mineral-100); color:var(--mineral-800); }
.vx-admin .plan-pill.pilot{ background:var(--amber-bg); color:#8C5F0E; }

.vx-admin .row-actions{ display:flex; gap:6px; opacity:0; transition:opacity .12s; }
.vx-admin tr:hover .row-actions{ opacity:1; }
.vx-admin .icon-btn{ width:28px; height:28px; border-radius:5px; background:transparent; border:1px solid transparent; color:var(--ink-500); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .12s; }
.vx-admin .icon-btn:hover{ background:white; border-color:var(--ink-200); color:var(--ink-800); }
.vx-admin .meta-line{ font-size:12px; color:var(--ink-500); }
.vx-admin .meta-line.mono{ color:var(--ink-700); }

/* approvals */
.vx-admin .approvals-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(min(380px,100%),1fr)); gap:14px; padding:8px 28px 32px; }
.vx-admin .approval-card{ background:white; border:1px solid var(--ink-200); border-radius:10px; padding:18px 20px; display:flex; flex-direction:column; gap:14px; position:relative; }
.vx-admin .approval-card::before{ content:''; position:absolute; left:0; top:18px; bottom:18px; width:3px; background:var(--amber); border-radius:0 3px 3px 0; }
.vx-admin .approval-head{ display:flex; align-items:flex-start; gap:12px; }
.vx-admin .approval-name{ font-weight:600; font-size:15px; color:var(--ink-900); }
.vx-admin .approval-loc{ font-size:12.5px; color:var(--ink-500); margin-top:2px; }
.vx-admin .approval-grid2{ display:grid; grid-template-columns:1fr 1fr; gap:10px 14px; padding:12px 14px; background:var(--ink-50); border-radius:6px; font-size:12.5px; }
.vx-admin .approval-grid2 .k{ font-size:10px; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-500); font-weight:500; margin-bottom:2px; }
.vx-admin .approval-grid2 .v{ color:var(--ink-800); font-weight:500; }
.vx-admin .approval-foot{ display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; }
.vx-admin .approval-foot .submitted{ font-size:11.5px; color:var(--ink-500); }
.vx-admin .approval-foot .actions{ display:flex; gap:6px; flex-wrap:wrap; }

/* drawer */
.vx-admin .drawer-backdrop{ position:fixed; inset:0; background:rgba(11,15,14,0.4); backdrop-filter:blur(2px); opacity:0; pointer-events:none; transition:opacity .2s; z-index:50; }
.vx-admin .drawer-backdrop.open{ opacity:1; pointer-events:auto; }
.vx-admin .drawer{ position:fixed; top:0; right:0; bottom:0; width:560px; max-width:100vw; background:var(--paper); background-image:var(--grain); background-size:220px; border-left:1px solid var(--ink-200); box-shadow:-24px 0 40px rgba(11,15,14,0.08); transform:translateX(100%); transition:transform .28s cubic-bezier(0.2,0.9,0.3,1); z-index:60; display:flex; flex-direction:column; }
.vx-admin .drawer.open{ transform:translateX(0); }
.vx-admin .drawer-head{ padding:20px 24px 14px; border-bottom:1px solid var(--ink-200); display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
.vx-admin .drawer-eyebrow{ font-size:10.5px; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:var(--mineral-700); margin-bottom:4px; display:flex; align-items:center; gap:6px; }
.vx-admin .drawer-title{ font-family:'Fraunces',Georgia,serif; font-size:24px; line-height:1.1; letter-spacing:-0.03em; color:var(--ink-900); font-weight:400; }
.vx-admin .drawer-title em{ font-style:italic; font-weight:300; color:var(--mineral-700); }
.vx-admin .drawer-close{ width:32px; height:32px; border-radius:6px; border:1px solid var(--ink-200); background:white; cursor:pointer; color:var(--ink-600); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.vx-admin .drawer-close:hover{ background:var(--ink-50); }
.vx-admin .stepper{ display:flex; gap:0; padding:14px 24px 0; border-bottom:1px solid var(--ink-200); background:rgba(244,242,236,0.5); }
.vx-admin .step{ flex:1; padding:0 0 12px; cursor:pointer; position:relative; border-bottom:2px solid transparent; }
.vx-admin .step.active{ border-bottom-color:var(--mineral-700); }
.vx-admin .step-num{ width:22px; height:22px; border-radius:50%; background:var(--ink-100); color:var(--ink-500); font-size:11px; font-weight:600; font-family:'JetBrains Mono',monospace; display:inline-flex; align-items:center; justify-content:center; margin-right:8px; }
.vx-admin .step.active .step-num{ background:var(--mineral-700); color:#FAFAF7; }
.vx-admin .step.done .step-num{ background:var(--mineral-100); color:var(--mineral-800); }
.vx-admin .step-label{ font-size:12px; font-weight:500; color:var(--ink-600); }
.vx-admin .step.active .step-label{ color:var(--ink-900); }
.vx-admin .drawer-body{ padding:22px 24px 100px; overflow-y:auto; flex:1; }
.vx-admin .form-section-title{ font-family:'Fraunces',Georgia,serif; font-size:15px; color:var(--ink-700); margin:18px 0 12px; display:flex; align-items:center; gap:10px; font-weight:400; }
.vx-admin .form-section-title::after{ content:''; flex:1; height:1px; background:var(--ink-200); }
.vx-admin .form-section-title:first-child{ margin-top:0; }
.vx-admin .field{ margin-bottom:14px; }
.vx-admin .field-2col{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
.vx-admin .field-3col{ display:grid; grid-template-columns:1.4fr 1fr 1fr; gap:12px; margin-bottom:14px; }
.vx-admin .lbl{ font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-500); font-weight:500; margin-bottom:6px; display:flex; align-items:center; gap:4px; }
.vx-admin .lbl .req{ color:var(--signal-red); }
.vx-admin .inp,.vx-admin .sel,.vx-admin .ta{ width:100%; height:38px; padding:0 12px; border:1px solid var(--ink-200); border-radius:6px; background:white; color:var(--ink-900); font-family:inherit; font-size:13.5px; outline:none; transition:border-color .15s,box-shadow .15s; }
.vx-admin .inp.mono{ font-family:'JetBrains Mono',monospace; font-size:12.5px; }
.vx-admin .ta{ height:auto; padding:10px 12px; resize:vertical; min-height:80px; line-height:1.5; }
.vx-admin .inp:focus,.vx-admin .sel:focus,.vx-admin .ta:focus{ border-color:var(--mineral-700); box-shadow:0 0 0 3px rgba(14,124,102,0.1); }
.vx-admin .inp::placeholder,.vx-admin .ta::placeholder{ color:var(--ink-400); }
.vx-admin .helper{ font-size:11.5px; color:var(--ink-500); margin-top:5px; line-height:1.45; }
.vx-admin .subdomain{ display:flex; align-items:stretch; border:1px solid var(--ink-200); border-radius:6px; overflow:hidden; background:white; }
.vx-admin .subdomain-suffix{ display:flex; align-items:center; padding:0 12px; background:var(--ink-50); color:var(--ink-600); border-left:1px solid var(--ink-200); font-size:12px; }
.vx-admin .upload{ display:flex; align-items:center; gap:10px; padding:10px 12px; border:1px dashed var(--ink-300); border-radius:6px; background:var(--ink-50); font-size:12.5px; color:var(--ink-600); cursor:pointer; transition:all .15s; margin-bottom:8px; }
.vx-admin .upload:hover{ border-color:var(--mineral-600); background:var(--mineral-100); color:var(--mineral-800); }
.vx-admin .upload.uploaded{ border-style:solid; border-color:var(--mineral-300); background:var(--mineral-100); color:var(--mineral-800); }
.vx-admin .upload svg{ flex-shrink:0; }
.vx-admin .upload-meta{ margin-left:auto; font-family:'JetBrains Mono',monospace; font-size:11px; }
.vx-admin .check-row{ display:flex; gap:12px; align-items:flex-start; padding:11px 12px; border:1px solid var(--ink-200); border-radius:6px; background:white; margin-bottom:8px; cursor:pointer; transition:border-color .15s,background .15s; }
.vx-admin .check-row:hover{ border-color:var(--ink-300); }
.vx-admin .check-row.checked{ border-color:var(--mineral-300); background:var(--mineral-100); }
.vx-admin .check-box{ width:18px; height:18px; border-radius:4px; border:1.5px solid var(--ink-300); background:white; flex-shrink:0; margin-top:1px; display:flex; align-items:center; justify-content:center; color:transparent; transition:all .15s; }
.vx-admin .check-row.checked .check-box{ border-color:var(--mineral-700); background:var(--mineral-700); color:white; }
.vx-admin .check-title{ font-size:13px; font-weight:500; color:var(--ink-900); }
.vx-admin .check-desc{ font-size:11.5px; color:var(--ink-500); margin-top:2px; line-height:1.4; }
.vx-admin .drawer-foot{ position:absolute; bottom:0; left:0; right:0; padding:14px 24px; background:rgba(250,250,247,0.95); backdrop-filter:blur(8px); border-top:1px solid var(--ink-200); display:flex; gap:10px; align-items:center; justify-content:space-between; }
.vx-admin .drawer-foot .progress{ font-size:12px; color:var(--ink-500); font-family:'JetBrains Mono',monospace; }

/* modal */
.vx-admin .modal-back{ position:fixed; inset:0; background:rgba(11,15,14,0.55); backdrop-filter:blur(4px); display:none; align-items:center; justify-content:center; z-index:80; padding:24px; }
.vx-admin .modal-back.open{ display:flex; }
.vx-admin .modal{ width:100%; max-width:480px; background:var(--paper); background-image:var(--grain); background-size:220px; border-radius:12px; padding:28px; box-shadow:0 20px 60px rgba(0,0,0,0.3); border:1px solid var(--ink-200); animation:vxModalIn .22s cubic-bezier(0.2,0.9,0.3,1); }
@keyframes vxModalIn{ from{ opacity:0; transform:translateY(8px) scale(0.98); } to{ opacity:1; transform:translateY(0) scale(1); } }
.vx-admin .modal-icon{ width:44px; height:44px; border-radius:10px; background:var(--mineral-100); color:var(--mineral-700); display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
.vx-admin .modal-eyebrow{ font-size:10.5px; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:var(--mineral-700); }
.vx-admin .modal-title{ font-family:'Fraunces',Georgia,serif; font-size:24px; line-height:1.1; letter-spacing:-0.03em; margin:6px 0 6px; font-weight:400; }
.vx-admin .modal-title em{ font-style:italic; font-weight:300; color:var(--mineral-700); }
.vx-admin .modal-sub{ font-size:13.5px; color:var(--ink-500); line-height:1.55; margin-bottom:18px; }
.vx-admin .cred-row{ display:flex; align-items:center; gap:10px; padding:11px 14px; background:white; border:1px solid var(--ink-200); border-radius:6px; margin-bottom:8px; font-family:'JetBrains Mono',monospace; font-size:13px; }
.vx-admin .cred-row .k{ font-size:10.5px; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink-500); font-family:'Inter Tight',sans-serif; font-weight:500; min-width:80px; }
.vx-admin .cred-row .v{ flex:1; color:var(--ink-900); font-weight:500; user-select:all; word-break:break-all; }
.vx-admin .cred-copy{ background:var(--ink-50); border:1px solid var(--ink-200); color:var(--ink-600); padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px; font-family:'Inter Tight',sans-serif; font-weight:500; transition:all .15s; }
.vx-admin .cred-copy:hover{ background:var(--ink-100); color:var(--ink-900); }
.vx-admin .cred-copy.copied{ background:var(--mineral-700); color:#FAFAF7; border-color:var(--mineral-700); }
.vx-admin .modal-note{ margin:16px 0 18px; padding:11px 14px; background:var(--amber-bg); border:1px solid #F2DEA8; border-radius:6px; font-size:12.5px; color:#7A4F0A; line-height:1.5; display:flex; gap:10px; align-items:flex-start; }
.vx-admin .modal-note svg{ flex-shrink:0; margin-top:1px; }
.vx-admin .modal-foot{ display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }

.vx-admin .license-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(min(320px,100%),1fr)); gap:14px; padding:8px 28px 32px; }
.vx-admin .license-card{ background:white; border:1px solid var(--ink-200); border-radius:10px; padding:18px; display:flex; flex-direction:column; gap:10px; }
.vx-admin .license-head{ display:flex; align-items:center; gap:10px; }
.vx-admin .license-doc{ width:36px; height:44px; border-radius:4px; background:var(--paper-warm); border:1px solid var(--ink-200); display:flex; align-items:center; justify-content:center; color:var(--mineral-700); flex-shrink:0; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:600; flex-direction:column; line-height:1.1; }
.vx-admin .license-doc .ext{ font-size:8px; color:var(--ink-500); }
.vx-admin .license-name{ font-weight:600; font-size:13.5px; color:var(--ink-900); }
.vx-admin .license-hosp{ font-size:11.5px; color:var(--ink-500); }
.vx-admin .license-meta{ display:flex; justify-content:space-between; font-size:11.5px; color:var(--ink-500); padding-top:8px; border-top:1px dashed var(--ink-200); }
.vx-admin .license-meta .v{ color:var(--ink-800); font-family:'JetBrains Mono',monospace; }

.vx-admin .activity-list{ padding:0 28px 32px; }
.vx-admin .act-item{ display:flex; gap:14px; padding:14px 16px; border-left:2px solid var(--ink-200); margin-left:8px; position:relative; }
.vx-admin .act-item::before{ content:''; position:absolute; left:-7px; top:18px; width:11px; height:11px; border-radius:50%; background:white; border:2px solid var(--ink-300); }
.vx-admin .act-item.ok::before{ border-color:var(--mineral-600); background:var(--mineral-500); }
.vx-admin .act-item.warn::before{ border-color:var(--amber); background:var(--amber); }
.vx-admin .act-item.danger::before{ border-color:var(--signal-red); background:var(--signal-red); }
.vx-admin .act-time{ font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--ink-500); width:90px; flex-shrink:0; padding-top:2px; }
.vx-admin .act-body{ flex:1; }
.vx-admin .act-title{ font-size:13px; color:var(--ink-900); }
.vx-admin .act-title b{ font-weight:600; }
.vx-admin .act-detail{ font-size:11.5px; color:var(--ink-500); margin-top:2px; }

/* ── Responsive ── */
@media (max-width:1080px){
  .vx-admin .shell{ grid-template-columns:1fr; }
  .vx-admin .nav-desktop{ display:none; }
  .vx-admin .nav-mobile{ display:flex; position:fixed; left:0; top:0; bottom:0; height:100vh; width:260px; max-width:84vw; transform:translateX(-100%); transition:transform .25s cubic-bezier(0.2,0.9,0.3,1); z-index:60; }
  .vx-admin .nav-mobile.open{ transform:translateX(0); }
  .vx-admin .hamburger{ display:flex; }
  .vx-admin .kpis{ grid-template-columns:repeat(2,1fr); }
}
@media (max-width:760px){
  .vx-admin .topbar{ padding:0 16px; gap:10px; }
  .vx-admin .breadcrumb,.vx-admin .top-pill{ display:none; }
  .vx-admin .topbar-search{ margin-left:auto; width:auto; flex:1; max-width:none; }
  .vx-admin .topbar-search .kbd{ display:none; }
  .vx-admin .page-head{ padding:22px 16px 12px; }
  .vx-admin .page-title{ font-size:28px; }
  .vx-admin .page-head-actions{ width:100%; }
  .vx-admin .page-head-actions .btn{ flex:1; justify-content:center; }
  .vx-admin .kpis{ display:flex; overflow-x:auto; scroll-snap-type:x mandatory; padding:0 16px 18px; -webkit-overflow-scrolling:touch; }
  .vx-admin .kpi{ min-width:210px; scroll-snap-align:start; }
  .vx-admin .tabs{ padding:0 16px; overflow-x:auto; }
  .vx-admin .toolbar{ padding:14px 16px; }
  .vx-admin .toolbar-search{ min-width:0; flex:1 1 100%; order:99; }
  .vx-admin .table-wrap{ margin:0 16px 24px; }
  .vx-admin .approvals-grid,.vx-admin .license-grid,.vx-admin .activity-list{ padding-left:16px; padding-right:16px; }
  .vx-admin .field-2col,.vx-admin .field-3col{ grid-template-columns:1fr; }
  .vx-admin .row-actions{ opacity:1; }
}
`;
