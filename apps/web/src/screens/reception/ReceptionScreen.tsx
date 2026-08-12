/**
 * ReceptionScreen.tsx — Vexoo Reception Portal v3
 * All shared state lives here and flows as props to every screen.
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { ScreenId, ReceptionScreenProps, Patient, Appointment, QueueEntry, Bill, AppState, BellNotif } from './types/reception.types';
import { CSS } from './shared/ReceptionCSS';
import { SCREEN_TITLES, NAV, INITIAL_PATIENTS, INITIAL_APPOINTMENTS, INITIAL_QUEUE, INITIAL_BILLS } from './data/mockReceptionData';
import { Sidebar }            from './components/Sidebar';
import { Topbar }             from './components/Topbar';
import { ProfileModal, DEFAULT_RECEPTION_PROFILE } from './components/ProfileModal';
import type { ReceptionProfile } from './components/ProfileModal';
import { Dashboard }          from './screens/Dashboard';
import { Appointments }       from './screens/Appointments';
import { PatientRegistration }from './screens/PatientRegistration';
import { Patients }           from './screens/Patients';
import { QueueManagement }    from './screens/QueueManagement';
import { BillingPayments }    from './screens/BillingPayments';
import { Reports }            from './screens/Reports';
import { Communication }      from './screens/Communication';
import { pulseFor } from '../../components/pulseBus';

export default function ReceptionScreen({ receptionistName = 'Anita Sharma', onSignOut }: ReceptionScreenProps) {
  const [screen, setScreen]     = useState<ScreenId>('dashboard');
  const [mobileOpen, setMobile] = useState(false);
  const [showProfile, setProf]  = useState(false);

  // Editable receptionist profile — seeded once from the signed-in name.
  // Lives here (like all other shared state) so edits made in ProfileModal
  // persist for the session and survive the modal being closed/reopened.
  const [profile, setProfile] = useState<ReceptionProfile>(
    () => ({ ...DEFAULT_RECEPTION_PROFILE, name: receptionistName }),
  );

  const [patients,     setPatients]     = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [queue,        setQueue]        = useState<QueueEntry[]>(INITIAL_QUEUE);
  const [bills,        setBills]        = useState<Bill[]>(INITIAL_BILLS);
  const [prefillName,  setPrefillName]  = useState('');

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
  const [prefillPhone, setPrefillPhone] = useState('');

  // Bell notifications — populated whenever doctor calls a patient
  const [bellNotifs, setBellNotifs]  = useState<BellNotif[]>([]);
  const bellNotifIdRef               = React.useRef(0);
  const addBellNotif = (n: Omit<BellNotif,'id'|'timestamp'|'read'>) => {
    const id = ++bellNotifIdRef.current;
    setBellNotifs(prev => [{ ...n, id, timestamp: Date.now(), read: false }, ...prev]);
  };
  const markBellRead = () =>
    setBellNotifs(prev => prev.map(n => ({ ...n, read: true })));

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMobile(false); setProf(false); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Auto timers: No-Show after 2 hrs from createdAt; Visit Complete 6 hrs after paidAt
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      setAppointments(prev => prev.map(a => {
        if (a.status === 'Scheduled' && now - a.createdAt >= 2 * 3600000)
          return { ...a, status: 'No-Show' as Appointment['status'] };
        if (a.status === 'Paid' && a.paidAt && now - a.paidAt >= 6 * 3600000)
          return { ...a, status: 'Visit Complete' as Appointment['status'] };
        return a;
      }));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const handleNav = useCallback((s: ScreenId) => { setScreen(s); setMobile(false); pulseFor(420, 'Loading module'); }, []);

  const navWithBadges = useMemo(() => NAV.map(n => {
    if (n.id === 'appointments') {
      const cnt = appointments.filter(a => a.status === 'Scheduled').length;
      return { ...n, badge: cnt > 0 ? cnt : undefined };
    }
    if (n.id === 'queue') {
      const cnt = queue.filter(q => q.status === 'Waiting').length;
      return { ...n, badge: cnt > 0 ? cnt : undefined };
    }
    if (n.id === 'billing') {
      const cnt = bills.filter(b => !b.paidAt).length;
      return { ...n, badge: cnt > 0 ? cnt : undefined };
    }
    return { ...n, badge: undefined };
  }), [appointments, queue, bills]);

  const appState: AppState = {
    patients, setPatients,
    appointments, setAppointments,
    queue, setQueue,
    bills, setBills,
    onNav: handleNav,
    prefillName,  setPrefillName,
    prefillPhone, setPrefillPhone,
    bellNotifs, addBellNotif, markBellRead,
  };

  const SUBTITLES: Record<ScreenId, string> = {
    dashboard:'Manage outpatient services efficiently.',
    appointments:'Schedule, view and manage OP appointments.',
    patientreg:'Register new outpatient and capture demographic details.',
    patients:'Search, view and manage patient information.',
    queue:'Manage OP queue, call patients and track waiting status.',
    billing:'Collect consultation fees and manage payments.',
    reports:'View OP reports and analytics.',
    communication:'Send SMS/notifications to patients.',
  };

  const screenEl = useMemo(() => {
    switch (screen) {
      case 'dashboard':    return <Dashboard receptionistName={receptionistName} onNav={handleNav} />;
      case 'appointments': return <Appointments {...appState} />;
      case 'patientreg':   return <PatientRegistration {...appState} />;
      case 'patients':     return <Patients {...appState} />;
      case 'queue':        return <QueueManagement {...appState} />;
      case 'billing':      return <BillingPayments {...appState} />;
      case 'reports':      return <Reports {...appState} />;
      case 'communication':return <Communication />;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, patients, appointments, queue, bills, receptionistName]);

  return (
    <div className="rc-root">
      <style>{CSS}</style>
      {mobileOpen && <div className="rc-overlay open" onClick={() => setMobile(false)} />}
      <Sidebar active={screen} onNav={handleNav} mobileOpen={mobileOpen}
        receptionistName={receptionistName} onSignOut={onSignOut} navItems={navWithBadges} />
      <div className="rc-main">
        <Topbar title={SCREEN_TITLES[screen]}
          subtitle={screen !== 'dashboard' ? SUBTITLES[screen as ScreenId] : undefined}
          receptionistName={receptionistName}
          onHamburger={() => setMobile(o => !o)}
          onProfileClick={() => setProf(true)}
          onSignOut={onSignOut}
          bellNotifs={bellNotifs}
          markBellRead={markBellRead} />
        {screenEl}
      </div>
      {showProfile && <ProfileModal profile={profile} onSave={setProfile} onClose={() => setProf(false)} />}
    </div>
  );
}
