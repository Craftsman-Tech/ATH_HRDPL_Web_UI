/**
 * ============================================================================
 *  PharmacistScreen.tsx — Pharmacist Portal (root)
 * ============================================================================
 *  Route: /pharmacy  (protected, role === 'Pharmacist')
 *  Thin orchestrator — layout + screen routing only. Design system matched
 *  1:1 to the Hospital Admin portal (Fraunces / Inter Tight · ph-* namespace).
 *
 *    screens/    Dashboard, InHouseQueue, ExternalQueue, DispensedMedications,
 *                CompletedPrescriptions, Inventory, PurchaseOrders, Suppliers, Reports
 *    components/ Sidebar, Topbar, ProfileModal
 *    shared/     PharmacistCSS, PhHelpers (Badge, SvgIcon, StatCard, BarChart, Th, Td, Avatar)
 *    data/       mockPharmData
 *    types/      pharmacist.types
 * ============================================================================
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { ScreenId, PharmacistScreenProps } from './types/pharmacist.types';
import { CSS } from './shared/PharmacistCSS';
import { SCREEN_TITLES } from './data/mockPharmData';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ProfileModal } from './components/ProfileModal';
import { Dashboard } from './screens/Dashboard';
import { InHouseQueue } from './screens/InHouseQueue';
import { ExternalQueue } from './screens/ExternalQueue';
import { DispensedMedications } from './screens/DispensedMedications';
import { CompletedPrescriptions } from './screens/CompletedPrescriptions';
import { Inventory } from './screens/Inventory';
import { PurchaseOrders } from './screens/PurchaseOrders';
import { Suppliers } from './screens/Suppliers';
import { Reports } from './screens/Reports';

export default function PharmacistScreen({
  pharmacistName = 'Maria Perez',
  onSignOut,
}: PharmacistScreenProps) {
  // Inject Google Fonts once (link tag is more reliable than @import in injected <style>)
  useEffect(() => {
    const id = 'vexoo-pharmacist-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600&family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);

  const [screen,      setScreen]      = useState<ScreenId>('dashboard');
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [invFilter,   setInvFilter]   = useState<string | undefined>(undefined);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileOpen(false); setShowProfile(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Navigate (used by sidebar + dashboard cards). Optional inventory filter
  // lets dashboard critical-alert cards deep-link into a filtered Inventory.
  const goTo = useCallback((s: ScreenId, filter?: string) => {
    setInvFilter(s === 'inventory' ? filter : undefined);
    setScreen(s);
    setMobileOpen(false);
  }, []);

  const handleNav = useCallback((s: ScreenId) => goTo(s), [goTo]);

  const screenEl = useMemo(() => {
    switch (screen) {
      case 'inhouse':   return <InHouseQueue />;
      case 'external':  return <ExternalQueue />;
      case 'dispensed': return <DispensedMedications />;
      case 'completed': return <CompletedPrescriptions />;
      case 'inventory': return <Inventory initialFilter={invFilter} />;
      case 'purchase':  return <PurchaseOrders />;
      case 'suppliers': return <Suppliers />;
      case 'reports':   return <Reports />;
      default:          return <Dashboard goTo={goTo} />;
    }
  }, [screen, invFilter, goTo]);

  return (
    <div className="ph-root">
      <style>{CSS}</style>
      <div className={`ph-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className="ph-shell">
        <Sidebar
          active={screen} onNav={handleNav}
          collapsed={collapsed} onToggle={() => setCollapsed(c => !c)}
          mobileOpen={mobileOpen} pharmacistName={pharmacistName} onSignOut={onSignOut}
        />
        <div className="ph-main">
          <Topbar
            title={SCREEN_TITLES[screen]}
            onHamburger={() => setMobileOpen(o => !o)}
            pharmacistName={pharmacistName}
            onProfileClick={() => setShowProfile(true)}
            onSignOut={onSignOut}
          />
          {screenEl}
        </div>
      </div>

      {showProfile && <ProfileModal pharmacistName={pharmacistName} onClose={() => setShowProfile(false)} />}
    </div>
  );
}
