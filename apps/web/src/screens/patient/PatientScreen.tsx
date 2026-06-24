/**
 * ============================================================================
 *  PatientScreen.tsx  — Root orchestrator  (~80 lines)
 * ============================================================================
 *  This file only does three things:
 *    1. Manages top-level state (active screen, mobile sidebar, profile modal)
 *    2. Renders the shell (CSS injection, Sidebar, Topbar, content area)
 *    3. Routes to the correct screen component
 *
 *  All business logic, data, and UI details live in their own files under:
 *    screens/   components/   shared/   hooks/   data/   types/
 * ============================================================================
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { CSS }          from './shared/PatientCSS';
import Sidebar          from './components/Sidebar';
import Topbar           from './components/Topbar';
import ProfileModal     from './components/ProfileModal';
import Dashboard        from './screens/Dashboard';
import Appointments     from './screens/Appointments';
import Records          from './screens/Records';
import Medications      from './screens/Medications';
import LabResults       from './screens/LabResults';
import Messages         from './screens/Messages';
import Billing          from './screens/Billing';
import Insurance        from './screens/Insurance';
import Vaccinations     from './screens/Vaccinations';
import Family           from './screens/Family';
import { useToast }     from './hooks/useToast';
import { MEMBERS }      from './data/mockRecords';
import type { PatientScreenProps, ScreenId, Member } from './types/patient.types';

export default function PatientScreen({ patientName = 'Sarah Johnson', onSignOut }: PatientScreenProps) {
  useEffect(() => {
    const id = 'vexoo-patient-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600&family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);

  const [screen, setScreen]       = useState<ScreenId>('home');
  const [showProfile, setProfile] = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const { toast, el: toastEl }    = useToast();

  const member = useMemo<Member>(() => ({ ...MEMBERS[0], name: patientName }), [patientName]);
  const onNav  = useCallback((s: ScreenId) => { setScreen(s); setMobile(false); }, []);

  const body = useMemo(() => {
    switch (screen) {
      case 'home':      return <Dashboard    member={member} onNav={onNav} toast={toast} />;
      case 'appts':     return <Appointments member={member}              toast={toast} />;
      case 'records':   return <Records      member={member}              toast={toast} />;
      case 'meds':      return <Medications  member={member}              toast={toast} />;
      case 'lab':       return <LabResults   member={member}              toast={toast} />;
      case 'vax':       return <Vaccinations member={member} />;
      case 'family':    return <Family       member={member}              toast={toast} />;
      case 'messages':  return <Messages                                  toast={toast} />;
      case 'billing':   return <Billing                                   toast={toast} />;
      case 'insurance': return <Insurance    member={member}              toast={toast} />;
    }
  }, [screen, member, onNav, toast]);

  return (
    <div className="Vexoo-root">
      <style>{CSS}</style>
      {toastEl}
      <div className="app">
        {mobileOpen && <div className="mob-overlay" onClick={() => setMobile(false)} />}
        <Sidebar active={screen} onNav={onNav} onSignOut={onSignOut} mobileOpen={mobileOpen} />
        <div className="main">
          <Topbar screen={screen} member={member} onNav={onNav}
            onProfile={() => setProfile(true)} onMenuToggle={() => setMobile(o => !o)} />
          <div className="content">{body}</div>
        </div>
      </div>
      {showProfile && <ProfileModal member={member} onClose={() => setProfile(false)} toast={toast} />}
    </div>
  );
}
