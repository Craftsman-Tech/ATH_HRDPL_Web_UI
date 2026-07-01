/**
 * ============================================================================
 *  ReceptionScreen.tsx — Vexoo Reception Portal (root orchestrator)
 * ============================================================================
 *  Route: /reception  (protected, role === 'Receptionist')
 *  Thin root — layout + screen routing only.
 *
 *  Folder structure:
 *    types/       reception.types.ts
 *    data/        mockReceptionData.ts
 *    shared/      ReceptionCSS.ts | Chip.tsx | SvgIcon.tsx | initials.ts
 *    components/  Sidebar.tsx | Topbar.tsx | ProfileModal.tsx
 *    screens/     CheckIn.tsx | Appointments.tsx | VitalsMonitor.tsx
 *                 BillPayments.tsx | Tasks.tsx | PatientManagement.tsx
 * ============================================================================
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { ScreenId, ReceptionScreenProps, Patient, PatientStatus } from './types/reception.types';
import { CSS } from './shared/ReceptionCSS';
import { SCREEN_TITLES, PATIENTS as INITIAL_PATIENTS } from './data/mockReceptionData';
import { Sidebar }        from './components/Sidebar';
import { Topbar }         from './components/Topbar';
import { ProfileModal }   from './components/ProfileModal';
import { CheckIn }        from './screens/CheckIn';
import { Appointments }   from './screens/Appointments';
import { VitalsMonitor }  from './screens/VitalsMonitor';
import { BillPayments }   from './screens/BillPayments';
import { Tasks }          from './screens/Tasks';
import { PatientManagement } from './screens/PatientManagement';

export default function ReceptionScreen({
  receptionistName = 'Anita Sharma',
  onSignOut,
}: ReceptionScreenProps) {
  const [screen, setScreen]     = useState<ScreenId>('checkin');
  const [mobileOpen, setMobile] = useState(false);
  const [showProfile, setProf]  = useState(false);

  // ── Shared patient state — flows through all screens ──────────────────
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);

  // ── Keyboard escape ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobile(false); setProf(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNav = useCallback((s: ScreenId) => {
    setScreen(s);
    setMobile(false);
  }, []);

  // ── Derived counts for sidebar ────────────────────────────────────────
  const waitingCount    = patients.filter(p => p.status === 'Checked-In').length;
  const inQueueCount    = patients.filter(p => p.status === 'In Queue').length;
  const checkedInCount  = patients.filter(p =>
    p.status !== 'Completed' && p.status !== 'With Doctor'
  ).length;

  // ── Screen render ─────────────────────────────────────────────────────
  const screenEl = useMemo(() => {
    const props = { patients, onPatientsChange: setPatients };
    switch (screen) {
      case 'checkin':      return <CheckIn {...props} />;
      case 'appointments': return <Appointments />;
      case 'vitals':       return <VitalsMonitor {...props} />;
      case 'billpayments': return <BillPayments {...props} />;
      case 'tasks':        return <Tasks />;
      case 'patientmgmt':  return <PatientManagement {...props} />;
    }
  }, [screen, patients]);

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="rc-root">
      <style>{CSS}</style>

      {mobileOpen && (
        <div className="rc-overlay open" onClick={() => setMobile(false)} />
      )}

      <Sidebar
        active={screen}
        onNav={handleNav}
        mobileOpen={mobileOpen}
        receptionistName={receptionistName}
        onSignOut={onSignOut}
        waitingCount={waitingCount}
        checkedInCount={checkedInCount}
        inQueueCount={inQueueCount}
      />

      <div className="rc-main">
        <Topbar
          title={SCREEN_TITLES[screen]}
          receptionistName={receptionistName}
          onHamburger={() => setMobile(o => !o)}
          onProfileClick={() => setProf(true)}
          onSignOut={onSignOut}
        />
        {screenEl}
      </div>

      {showProfile && (
        <ProfileModal
          receptionistName={receptionistName}
          onClose={() => setProf(false)}
        />
      )}
    </div>
  );
}
