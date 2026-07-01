/**
 * ============================================================================
 *  AdminScreen.tsx — Super Admin / ATH · Support Console (root orchestrator)
 * ============================================================================
 *  Multi-agent support console. Layout: dark Sidebar + main column (Topbar ·
 *  per-view content). Wrapped in <ApprovalsProvider> so the shared / personal
 *  approval queues stay in sync across every screen.
 *
 *    Dashboard    → header + KPI strip + Quick actions + summary panels
 *    Hospitals    → directory → HospitalDetail (read-only registration detail)
 *    Approvals    → My / All queue tables → ApprovalDetail (approve/reject/info)
 *    Licenses     → renewals table (Send reminder / Remind all)
 *    Activity     → audit timeline
 *    Analytics    → platform intelligence (Overview / Engagement / Operations / Growth)
 *    Billing      → tiers, KPIs & invoices
 *    Settings     → profile form + sub-nav
 * ============================================================================
 */
import React, { useEffect, useState } from 'react';
import type { ViewId, SuperAdminScreenProps, MainTab, DetailRoute } from './types/admin.types';
import { CSS } from './shared/AdminCSS';
import { Icon } from './shared/Icons';
import { exportExcel } from './shared/exportExcel';
import { HOSPITALS, PAGE_HEAD, FOUNDER } from './data/mockData';
import { ApprovalsProvider } from './shared/approvalsStore';

import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { RegisterDrawer } from './components/RegisterDrawer';
import { RegisterFacilityDrawer, type FacilityKind } from './components/RegisterFacilityDrawer';
import { CredentialsModal } from './components/CredentialsModal';
import { ProfileModal } from './components/ProfileModal';
import { TweaksPanel } from './components/TweaksPanel';

import { Dashboard } from './screens/Dashboard';
import { Hospitals } from './screens/Hospitals';
import { HospitalDetail } from './screens/HospitalDetail';
import { Approvals } from './screens/Approvals';
import { ApprovalDetail } from './screens/ApprovalDetail';
import { Licenses } from './screens/Licenses';
import { ActivityLog } from './screens/ActivityLog';
import { Analytics } from './screens/Analytics';
import { Billing } from './screens/Billing';
import { Settings } from './screens/Settings';

const isOperational = (v: ViewId): v is Exclude<MainTab, 'dashboard'> =>
  v === 'hospitals' || v === 'approvals' || v === 'licenses' || v === 'activity';

export default function AdminScreen({
  adminName = FOUNDER.name,
  adminRole = FOUNDER.role,
  adminEmail = FOUNDER.email,
  onSignOut,
}: SuperAdminScreenProps) {
  const [view, setView]   = useState<ViewId>('dashboard');
  const [detail, setDetail] = useState<DetailRoute | null>(null);
  const [query, setQuery] = useState('');
  const [showDrawer, setDrawer] = useState(false);
  const [facility, setFacility] = useState<FacilityKind | null>(null);
  const [showCred, setCred]   = useState(false);
  const [credName, setCredName] = useState<string | undefined>(undefined);
  const [showProfile, setProfile] = useState(false);

  // Tweaks
  const [accent, setAccent]   = useState('#0E7C66');
  const [density, setDensity] = useState<'cozy' | 'compact'>('cozy');
  const [grain, setGrain]     = useState(true);

  const nav = (v: ViewId) => { setDetail(null); setView(v); };

  // Inject Google Fonts once.
  useEffect(() => {
    const id = 'vx-admin-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  // Esc closes overlays
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDrawer(false); setFacility(null); setCred(false); setProfile(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openCredFor = (name?: string) => { setCredName(name); setDrawer(false); setFacility(null); window.setTimeout(() => setCred(true), 200); };

  const exportHospitals = () => {
    exportExcel(
      'vexoo-hospitals',
      ['Tenant ID', 'Hospital', 'Reg. No.', 'City', 'State', 'Admin', 'Email', 'Plan', 'Status', 'Registered'],
      HOSPITALS.map(h => [h.id, h.name, h.regNo, h.city, h.state, h.admin, h.email, h.plan, h.status, h.registered]),
    );
  };

  const rootClass = `vx-admin ${density === 'compact' ? 'density-compact' : ''} ${grain ? '' : 'no-grain'}`.trim();
  const rootStyle = { ['--mineral-700' as string]: accent } as React.CSSProperties;

  const ph = !detail && isOperational(view) ? PAGE_HEAD[view] : null;

  /* Body content (detail routes take precedence over the list view). */
  let body: React.ReactNode;
  if (detail?.kind === 'hospital') {
    body = <HospitalDetail hospitalId={detail.id} onBack={() => setDetail(null)} />;
  } else if (detail?.kind === 'approval') {
    body = <ApprovalDetail registrationId={detail.id} onBack={() => setDetail(null)} onApproved={openCredFor} />;
  } else if (view === 'dashboard') {
    body = <Dashboard onNav={nav} onRegister={() => setDrawer(true)} onRegisterPharmacy={() => setFacility('pharmacy')} onRegisterLaboratory={() => setFacility('laboratory')} onExport={exportHospitals} />;
  } else if (view === 'analytics') {
    body = <Analytics />;
  } else if (view === 'billing') {
    body = <Billing />;
  } else if (view === 'settings') {
    body = <Settings />;
  } else {
    // operational list views — shared page-head + screen
    const screen =
      view === 'hospitals' ? <Hospitals query={query} onOpen={id => setDetail({ kind: 'hospital', id })} /> :
      view === 'approvals' ? <Approvals onOpen={id => setDetail({ kind: 'approval', id })} /> :
      view === 'licenses'  ? <Licenses /> :
      <ActivityLog />;
    body = (
      <>
        {ph && (
          <div className="page-head">
            <div className="page-head-row">
              <div>
                <p className="eyebrow">{ph.eyebrow}</p>
                <h1 className="page-title">{ph.title} <em>{ph.em}</em></h1>
                <p className="page-sub">{ph.sub}</p>
              </div>
              <div className="page-head-actions">
                {ph.export && <button className="btn btn-ghost" onClick={exportHospitals}><Icon.Download size={14} /> Export</button>}
                {ph.register && <button className="btn btn-primary" onClick={() => setDrawer(true)}><Icon.Plus size={14} /> Register hospital</button>}
              </div>
            </div>
          </div>
        )}
        {screen}
      </>
    );
  }

  return (
    <ApprovalsProvider>
      <div className={rootClass} style={rootStyle}>
        <style>{CSS}</style>

        <Sidebar view={view} onNav={nav} adminName={adminName} adminRole={adminRole} onSignOut={onSignOut} />

        <main className="main">
          <Topbar
            view={view}
            query={query}
            onQuery={setQuery}
            onFocusSearch={() => { if (view !== 'hospitals' || detail) nav('hospitals'); }}
            adminName={adminName}
            adminEmail={adminEmail}
            onProfile={() => setProfile(true)}
            onNav={nav}
            onResetDemo={() => window.location.reload()}
            onSignOut={onSignOut}
          />

          {body}
        </main>

        <RegisterDrawer open={showDrawer} onClose={() => setDrawer(false)} onGenerate={() => openCredFor('Suvarna Hospital')} />
        <RegisterFacilityDrawer
          kind={facility}
          onClose={() => setFacility(null)}
          onGenerate={() => openCredFor(facility === 'pharmacy' ? 'Suvarna Care Pharmacy' : 'Suvarna Diagnostics & Labs')}
        />
        {showCred && <CredentialsModal hospitalName={credName} onClose={() => setCred(false)} />}
        {showProfile && (
          <ProfileModal adminName={adminName} adminRole={adminRole} adminEmail={adminEmail} onClose={() => setProfile(false)} />
        )}

        <TweaksPanel accent={accent} onAccent={setAccent} density={density} onDensity={setDensity} grain={grain} onGrain={setGrain} />
      </div>
    </ApprovalsProvider>
  );
}
