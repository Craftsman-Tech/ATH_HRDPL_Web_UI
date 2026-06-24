/**
 * ============================================================================
 *  DoctorScreen.tsx — Doctor Portal (root)
 * ============================================================================
 *  Thin orchestrator: owns layout, active-screen state, and the shared
 *  `appointments` state (Today's Queue + My Schedule both read/write this
 *  same array, lifted here exactly like the Reception portal's AppState
 *  pattern) so a consultation started from either screen stays in sync.
 * ============================================================================
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { ScreenId, DoctorScreenProps, Appointment, NavItem, DoctorAppState } from './types/doctor.types';
import { CSS } from './shared/DoctorCSS';
import { INITIAL_APPOINTMENTS, TODAY } from './data/mockDoctorData';
import { Sidebar, NAV } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ProfileModal } from './components/ProfileModal';
import { HelpModal } from './components/HelpModal';
import { Queue } from './screens/Queue';
import { Patients } from './screens/Patients';
import { Messages } from './screens/Messages';
import { Schedule } from './screens/Schedule';

const SCREEN_TITLES: Record<ScreenId, string> = {
  queue: "Today's Queue", patients: 'My Patients', messages: 'Messages', schedule: 'My Schedule',
};
const SUBTITLES: Record<ScreenId, string> = {
  queue: 'Walk-ins and patients scheduled for later today.',
  patients: 'Search, view and manage your patients.',
  messages: 'Conversations with your patients.',
  schedule: 'View today and upcoming appointments.',
};

export default function DoctorScreen({ doctorName = 'Dr. Meera Sharma', onSignOut }: DoctorScreenProps) {
  const [screen, setScreen]     = useState<ScreenId>('queue');
  const [mobileOpen, setMobile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // Inject Google Fonts link reliably (more reliable than @import in injected <style>)
  useEffect(() => {
    const id = 'vexoo-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id   = id;
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMobile(false); setShowProfile(false); setShowHelp(false); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNav = useCallback((s: ScreenId) => { setScreen(s); setMobile(false); }, []);

  const navWithBadges: NavItem[] = useMemo(() => NAV.map(n => {
    if (n.id === 'queue') {
      const cnt = appointments.filter(a => a.date === TODAY && a.status === 'Waiting').length;
      return { ...n, badge: cnt > 0 ? cnt : undefined };
    }
    return { ...n, badge: undefined };
  }), [appointments]);

  const appState: DoctorAppState = { appointments, setAppointments, onNav: handleNav };

  const screenEl = useMemo(() => {
    switch (screen) {
      case 'queue':    return <Queue {...appState} />;
      case 'patients': return <Patients />;
      case 'messages': return <Messages />;
      case 'schedule': return <Schedule {...appState} />;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, appointments]);

  return (
    <div className="dr-root">
      <style>{CSS}</style>
      {mobileOpen && <div className="dr-overlay open" onClick={() => setMobile(false)} />}
      <Sidebar active={screen} onNav={handleNav} mobileOpen={mobileOpen}
        doctorName={doctorName} onSignOut={onSignOut} navItems={navWithBadges} />
      <div className="dr-main">
        <Topbar
          title={SCREEN_TITLES[screen]}
          subtitle={SUBTITLES[screen]}
          doctorName={doctorName}
          onHamburger={() => setMobile(o => !o)}
          onProfileClick={() => setShowProfile(true)}
          onHelpClick={() => setShowHelp(true)}
          onSignOut={onSignOut}
        />
        {screenEl}
      </div>

      {showProfile && <ProfileModal doctorName={doctorName} onClose={() => setShowProfile(false)} />}
      {showHelp && (
        <HelpModal
          userName={doctorName}
          phone="+91 98765 43210"
          hospital="Vexoo General Hospital"
          role="Doctor"
          onClose={() => setShowHelp(false)}
        />
      )}
    </div>
  );
}
