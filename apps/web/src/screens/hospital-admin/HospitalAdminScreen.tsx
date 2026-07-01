/**
 * ============================================================================
 *  HospitalAdminScreen.tsx — Hospital Admin Portal (root)
 * ============================================================================
 *  Route: /admin  (protected, role === 'HospitalAdmin')
 *  Thin orchestrator — layout + module routing only.
 *    screens/  Dashboard, Patients, Appointments, EMR, Pharmacy, Lab,
 *              Inventory, Analytics, Notifications, Staff, Reviews
 *    components/ Sidebar, Header
 *    shared/   HaCSS, HaHelpers (Badge, SvgIcon, StatCard, BarChart, Th, Td)
 *    data/     mockHaData
 *    types/    hospitaladmin.types
 * ============================================================================
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { ModuleId, HospitalAdminScreenProps } from './types/hospitaladmin.types';
import { CSS } from './shared/HaCSS';
import { MODULE_TITLES } from './data/mockHaData';
import { initials } from './shared/HaHelpers';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './screens/Dashboard';
import { PatientsModule } from './screens/Patients';
import { AppointmentsModule } from './screens/Appointments';
import { EMRModule } from './screens/EMR';
import { PharmacyModule } from './screens/Pharmacy';
import { LabModule } from './screens/Lab';
import { InventoryModule } from './screens/Inventory';
import { AnalyticsModule } from './screens/Analytics';
import { NotificationsModule } from './screens/Notifications';
import { StaffScreen } from './screens/Staff';
import { ReviewsModule } from './screens/Reviews';
import { SettingsScreen } from './screens/Settings';

export default function HospitalAdminScreen({
  adminName = 'Anita Reddy',
  onSignOut,
}: HospitalAdminScreenProps) {
  useEffect(() => {
    const id = 'vexoo-admin-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600&family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);

  const [module,      setModule]      = useState<ModuleId>('dashboard');
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNav = useCallback((m: ModuleId) => {
    setModule(m); setMobileOpen(false);
  }, []);

  const moduleEl = useMemo(() => {
    switch (module) {
      case 'patients':      return <PatientsModule />;
      case 'appointments':  return <AppointmentsModule />;
      case 'emr':           return <EMRModule />;
      case 'pharmacy':      return <PharmacyModule />;
      case 'lab':           return <LabModule />;
      case 'inventory':     return <InventoryModule />;
      case 'analytics':     return <AnalyticsModule />;
      case 'notifications': return <NotificationsModule />;
      case 'staff':         return <StaffScreen hospitalName="Apollo Multispecialty" />;
      case 'reviews':       return <ReviewsModule />;
      case 'settings':      return <SettingsScreen hospitalName="Apollo Multispecialty" />;
      default:              return <Dashboard setModule={setModule} />;
    }
  }, [module]);

  const abb = initials(adminName);

  return (
    <div className="ha-root">
      <style>{CSS}</style>
      <div className={`ha-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className="ha-shell">
        <Sidebar
          active={module} onNav={handleNav}
          collapsed={collapsed} onToggle={() => setCollapsed(c => !c)}
          mobileOpen={mobileOpen} adminName={adminName} onSignOut={onSignOut}
        />
        <div className="ha-main">
          <Header
            title={MODULE_TITLES[module]}
            onHamburger={() => setMobileOpen(o => !o)}
            adminName={adminName}
            onProfileClick={() => setShowProfile(true)}
            onSignOut={onSignOut}
          />
          {moduleEl}
        </div>
      </div>

      {showProfile && (
        <div onClick={() => setShowProfile(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, backdropFilter:'blur(2px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:16, padding:28, width:420, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:20, fontWeight:700 }}>{abb}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:17 }}>{adminName}</div>
                <div style={{ fontSize:13, color:'var(--text-muted)' }}>Administrator · Hospital Admin Portal</div>
              </div>
            </div>
            {[['Full Name',adminName],['Email','admin@vexoo.in'],['Phone','+91 98765 43210'],['Role','Hospital Administrator']].map(([label,val]) => (
              <div key={label} style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>{label}</div>
                <input defaultValue={val} style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', color:'var(--text)', background:'var(--bg)' }} />
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button onClick={() => setShowProfile(false)} style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid var(--border)', background:'white', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Close</button>
              <button style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'var(--primary)', color:'white', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, fontWeight:600 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
