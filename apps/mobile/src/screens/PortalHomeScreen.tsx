/**
 * ============================================================================
 *  PortalHomeScreen — Mobile
 * ============================================================================
 *  Sends the signed-in user to their role's portal. Every role has a bespoke
 *  portal, and `Record<Role, …>` makes that total — adding a role to `Role`
 *  without building its portal is a compile error rather than a blank screen.
 * ============================================================================
 */
import React from 'react';
import type { Role } from '@vexoo/shared';
import { useAuth } from '../components/AppContexts';
import HospitalAdminPortalScreen from './hospital-admin/HospitalAdminPortalScreen';
import DoctorPortalScreen from './doctor/DoctorPortalScreen';
import ReceptionPortalScreen from './reception/ReceptionPortalScreen';
import PharmacyPortalScreen from './pharmacy/PharmacyPortalScreen';
import LabTechPortalScreen from './lab-tech/LabTechPortalScreen';

const PORTAL_BY_ROLE: Record<Role, React.ComponentType> = {
  Admin:        HospitalAdminPortalScreen,
  Doctor:       DoctorPortalScreen,
  Receptionist: ReceptionPortalScreen,
  Pharmacist:   PharmacyPortalScreen,
  LabTech:      LabTechPortalScreen,
};

export default function PortalHomeScreen() {
  const { user } = useAuth();
  // RootNavigator only mounts this stack once a user exists, so the fallback
  // is belt-and-braces rather than a state the app actually reaches.
  const Portal = PORTAL_BY_ROLE[user?.role ?? 'Receptionist'];
  return <Portal />;
}
