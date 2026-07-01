/**
 * ============================================================================
 *  AppRoutes — Web
 * ============================================================================
 *  Defines every URL the app responds to and which screen renders for it.
 *  Routes that need a signed-in user are wrapped in <RequireAuth>; routes
 *  that should redirect already-signed-in users (Sign-In) use <RedirectIfAuth>.
 *
 *  Active portals:
 *    /admin       → Hospital Admin         (Admin)
 *    /doctor      → Doctor Portal          (Doctor)
 *    /reception   → Nurse/Receptionist     (Receptionist)
 *    /pharmacy    → Pharmacist Portal      (Pharmacist)
 *    /lab         → Lab Technician Portal  (LabTech)
 * ============================================================================
 */
import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth }         from '../components/AuthContext';
import SignInScreen        from '../screens/SignInScreen';
import RegisterScreen      from '../screens/register/RegisterScreen';
import HospitalAdminScreen    from '../screens/hospital-admin/HospitalAdminScreen';
import ReceptionScreen        from '../screens/reception/ReceptionScreen';
import DoctorScreen           from '../screens/doctor/DoctorScreen';
import PharmacistScreen       from '../screens/pharmacist/PharmacistScreen';
import LabTechScreen          from '../screens/lab-tech/LabTechScreen';

// ─── Route guards ───────────────────────────────────────────────────────────
function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const loc = useLocation();
  // Capture the user's intended destination so we can return them after sign-in.
  if (!user) return <Navigate to="/signin" state={{ from: loc }} replace />;
  return <>{children}</>;
}

function RedirectIfAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // If already signed in, route them to their portal home.
  if (user) {
    const home = {
      Admin:'/admin', Doctor:'/doctor', Receptionist:'/reception',
      Pharmacist:'/pharmacy', LabTech:'/lab',
    }[user.role];
    return <Navigate to={home} replace />;
  }
  return <>{children}</>;
}

// ─── Connected screens ───────────────────────────────────────────────────────
// Hospital Admin portal — the account a hospital signs in with.
// Bridges the signed-in user's name and sign-out into HospitalAdminScreen.
function HospitalAdminRoute() {
  const { user, signOut } = useAuth();
  return <HospitalAdminScreen adminName={user?.name} onSignOut={signOut} />;
}

// Nurse / Receptionist portal.
function ReceptionRoute() {
  const { user, signOut } = useAuth();
  return <ReceptionScreen receptionistName={user?.name} onSignOut={signOut} />;
}

function DoctorRoute() {
  const { user, signOut } = useAuth();
  return <DoctorScreen doctorName={user?.name} onSignOut={signOut} />;
}

function PharmacistRoute() {
  const { user, signOut } = useAuth();
  return <PharmacistScreen pharmacistName={user?.name} onSignOut={signOut} />;
}

function LabTechRoute() {
  const { user, signOut } = useAuth();
  return <LabTechScreen techName={user?.name} onSignOut={signOut} />;
}

// ─── Routes ─────────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default → Sign-In */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Auth */}
        <Route path="/signin" element={
          <RedirectIfAuth><SignInScreen /></RedirectIfAuth>
        } />

        {/* Public — hospital self-registration (no account yet) */}
        <Route path="/register" element={<RegisterScreen />} />

        {/* Hospital Admin — the account a hospital signs in with */}
        <Route path="/admin/*" element={
          <RequireAuth><HospitalAdminRoute /></RequireAuth>
        } />
        <Route path="/doctor/*" element={
          <RequireAuth><DoctorRoute /></RequireAuth>
        } />
        <Route path="/reception/*" element={
          <RequireAuth><ReceptionRoute /></RequireAuth>
        } />
        <Route path="/pharmacy/*" element={
          <RequireAuth><PharmacistRoute /></RequireAuth>
        } />
        <Route path="/lab/*" element={
          <RequireAuth><LabTechRoute /></RequireAuth>
        } />

        {/* 404 → Sign-In */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
