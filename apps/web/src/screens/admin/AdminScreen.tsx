/**
 * ============================================================================
 *  AdminScreen.tsx — Super Admin / Founders' Console (root)
 * ============================================================================
 *  Route: /super-admin  (protected, role === 'SuperAdmin')
 *  Thin orchestrator — layout + view routing only.
 *    screens/  Dashboard, Hospitals, Doctors, Approvals, Licenses, ActivityLog
 *    components/ Topbar, RegisterDrawer, ProfileModal
 *    shared/   AdminCSS, SvgIcon, Badges, initials
 *    data/     mockData
 *    types/    admin.types
 * ============================================================================
 */
import React, { useState, useEffect, useMemo } from 'react';
import type { ViewId, SuperAdminScreenProps } from './types/admin.types';
import { CSS } from './shared/AdminCSS';
import { PAGE_TITLES } from './data/mockData';
import { Topbar } from './components/Topbar';
import { RegisterDrawer } from './components/RegisterDrawer';
import { ProfileModal } from './components/ProfileModal';
import { Dashboard } from './screens/Dashboard';
import { Hospitals } from './screens/Hospitals';
import { Doctors } from './screens/Doctors';
import { Approvals } from './screens/Approvals';
import { Licenses } from './screens/Licenses';
import { ActivityLog } from './screens/ActivityLog';
import { SvgIcon } from './shared/SvgIcon';

export default function AdminScreen({
  adminName = 'Ravi Shankar',
  adminRole = 'Co-Founder & CTO',
  onSignOut,
}: SuperAdminScreenProps) {
  const [view, setView]         = useState<ViewId>('dashboard');
  const [showRegister, setReg]  = useState(false);
  const [showProfile, setProf]  = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setReg(false); setProf(false); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const [title, subtitle] = PAGE_TITLES[view] ?? ['', ''];

  const viewEl = useMemo(() => {
    switch (view) {
      case 'dashboard': return <Dashboard setView={setView} />;
      case 'hospitals': return <Hospitals onRegister={() => setReg(true)} />;
      case 'doctors':   return <Doctors />;
      case 'approvals': return <Approvals />;
      case 'licenses':  return <Licenses />;
      case 'activity':  return <ActivityLog />;
    }
  }, [view]);

  return (
    <div className="vx-admin">
      <style>{CSS}</style>

      <Topbar
        view={view} onNav={setView}
        adminName={adminName} adminRole={adminRole}
        onProfileClick={() => setProf(true)} onSignOut={onSignOut}
      />

      {/* Page sub-header */}
      <div className="page-header">
        <div>
          <div className="page-title">{title}</div>
          <div className="page-subtitle">{subtitle}</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {view === 'hospitals' && (
            <button className="btn-primary" onClick={() => setReg(true)}>
              <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
              Register Hospital
            </button>
          )}
          {view === 'approvals' && (
            <span style={{ fontSize:13, color:'var(--amber)', fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--amber)', display:'inline-block' }} />
              5 pending items
            </span>
          )}
        </div>
      </div>

      <div className="main-area">{viewEl}</div>

      {showRegister && <RegisterDrawer onClose={() => setReg(false)} />}
      {showProfile  && <ProfileModal adminName={adminName} adminRole={adminRole} onClose={() => setProf(false)} />}
    </div>
  );
}
