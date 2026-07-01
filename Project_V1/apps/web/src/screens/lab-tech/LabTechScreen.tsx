/**
 * ============================================================================
 *  LabTechScreen.tsx — Lab Technician Portal (root)
 * ============================================================================
 *  Route: /lab  (protected, role === 'LabTech')
 *  Thin orchestrator — owns layout, active-screen state, mobile drawer and the
 *  profile modal. Wraps the whole portal in <LabProvider> so every screen
 *  shares one live pipeline store (Orders -> Collection -> Processing ->
 *  Results -> Completed) plus the editable technician profile.
 *
 *    screens/     Dashboard, Orders(Queue), Collection, Processing, Results,
 *                 Completed, Inventory, Equipment, Reports
 *    components/  Sidebar, Topbar, ProfileModal
 *    shared/      LabTechCSS, Chip, Toast, SvgIcon, initials
 *    data/        mockLabData, labStore
 *    types/       labtech.types
 * ============================================================================
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { ScreenId, NavItem, LabTechScreenProps } from './types/labtech.types';
import { CSS } from './shared/LabTechCSS';
import { NAV, SCREEN_TITLES, SUBTITLES } from './data/mockLabData';
import { LabProvider, useLab } from './data/labStore';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ProfileModal } from './components/ProfileModal';
import { Dashboard } from './screens/Dashboard';
import { Queue } from './screens/Orders';
import { Collection } from './screens/Collection';
import { Processing } from './screens/Processing';
import { Results } from './screens/Results';
import { Completed } from './screens/Completed';
import { Inventory } from './screens/Inventory';
import { Equipment } from './screens/Equipment';
import { Reports } from './screens/Reports';
import { Settings } from './screens/Settings';

/* ------------------------------------------------------------------ *
 *  Inner app — lives inside <LabProvider>, so it can read live store
 *  counts for the sidebar badges and feed the live profile name down.
 * ------------------------------------------------------------------ */
function LabApp({ onSignOut }: { onSignOut?: () => void }) {
  const lab = useLab();
  const [screen, setScreen]           = useState<ScreenId>('dashboard');
  const [mobileOpen, setMobile]       = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMobile(false); setShowProfile(false); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNav = useCallback((s: ScreenId) => { setScreen(s); setMobile(false); }, []);

  // Live badges sourced from the shared store so they update as orders flow.
  const navWithBadges: NavItem[] = useMemo(() => NAV.map(n => {
    if (n.id === 'inhouse')    { const c = lab.inhouse.filter(o => o.status === 'New').length;  return { ...n, badge: c || undefined }; }
    if (n.id === 'external')   { const c = lab.external.filter(o => o.status === 'New').length; return { ...n, badge: c || undefined }; }
    if (n.id === 'collection') { const c = lab.samples.filter(s => s.status === 'Pending').length; return { ...n, badge: c || undefined }; }
    if (n.id === 'results')    { const c = lab.results.length;                                  return { ...n, badge: c || undefined }; }
    return { ...n, badge: undefined };
  }), [lab.inhouse, lab.external, lab.samples, lab.results]);

  const screenEl = useMemo(() => {
    switch (screen) {
      case 'dashboard':  return <Dashboard onNav={handleNav} />;
      case 'inhouse':    return <Queue queue="inhouse" />;
      case 'external':   return <Queue queue="external" />;
      case 'collection': return <Collection />;
      case 'processing': return <Processing />;
      case 'results':    return <Results />;
      case 'completed':  return <Completed />;
      case 'inventory':  return <Inventory />;
      case 'equipment':  return <Equipment />;
      case 'reports':    return <Reports />;
      case 'settings':   return <Settings />;
    }
  }, [screen, handleNav]);

  const name = lab.profile.name;

  return (
    <div className="lt-root">
      <style>{CSS}</style>
      {mobileOpen && <div className="lt-overlay open" onClick={() => setMobile(false)} />}
      <Sidebar active={screen} onNav={handleNav} mobileOpen={mobileOpen}
        techName={name} onSignOut={onSignOut} navItems={navWithBadges} />
      <div className="lt-main">
        <Topbar
          title={SCREEN_TITLES[screen]}
          subtitle={SUBTITLES[screen]}
          techName={name}
          onHamburger={() => setMobile(o => !o)}
          onProfileClick={() => setShowProfile(true)}
          onSignOut={onSignOut}
        />
        {screenEl}
      </div>

      {showProfile && <ProfileModal techName={name} onClose={() => setShowProfile(false)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Root export — injects fonts once, then mounts the provider + app.
 * ------------------------------------------------------------------ */
export default function LabTechScreen({ techName = 'Kevin Liu', onSignOut }: LabTechScreenProps) {
  // Inject Google Fonts link (Fraunces + Inter Tight + JetBrains Mono) — same
  // approach as the Doctor portal so both render with identical typography.
  useEffect(() => {
    const id = 'vexoo-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id   = id;
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);

  return (
    <LabProvider techName={techName}>
      <LabApp onSignOut={onSignOut} />
    </LabProvider>
  );
}
