/**
 * ============================================================================
 *  AppRoutes — Web
 * ============================================================================
 *  Defines every URL the app responds to and which screen renders for it.
 *  Routes that need a signed-in user are wrapped in <RequireAuth>; routes
 *  that should redirect already-signed-in users (Sign-In) use <RedirectIfAuth>.
 *
 *  Today most portal routes are STUBS — they show a placeholder. They get
 *  filled in during their respective build phases.
 *
 *  Portal status:
 *    /super-admin → Founders' Console (BUILT — the platform/founder portal that
 *                   approves hospitals and issues hospital Admin credentials).
 *    /admin       → Hospital Admin portal (placeholder — built in a later phase;
 *                   this is the account a SuperAdmin creates for each hospital).
 *    others       → placeholders.
 * ============================================================================
 */
import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth }         from '../components/AuthContext';
import SignInScreen        from '../screens/SignInScreen';
import AdminScreen         from '../screens/admin/AdminScreen';
import GenericPlaceholder  from '../screens/placeholders/GenericPlaceholder';

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
      SuperAdmin:'/super-admin',
      Admin:'/admin', Doctor:'/doctor', Receptionist:'/reception',
      Pharmacist:'/pharmacy', LabTech:'/lab', Patient:'/patient',
    }[user.role];
    return <Navigate to={home} replace />;
  }
  return <>{children}</>;
}

// ─── Connected screens ───────────────────────────────────────────────────────
// The Founders' Console UI lives in AdminScreen.tsx; it is the SUPER ADMIN
// portal. This wrapper bridges the real signed-in user into its props, so the
// sidebar shows the actual signed-in name and Sign-out logs them out for real.
// (The file is named AdminScreen for historical reasons — it can be renamed to
//  SuperAdminScreen later; routing is what matters and is correct below.)
function SuperAdminRoute() {
  const { user, signOut } = useAuth();
  // adminRole is left at its default ("Founder · root") to match the design.
  return <AdminScreen adminName={user?.name} onSignOut={signOut} />;
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

        {/* Super Admin — the Founders' Console (BUILT) */}
        <Route path="/super-admin/*" element={
          <RequireAuth><SuperAdminRoute /></RequireAuth>
        } />

        {/* Hospital Admin — placeholder until its build phase */}
        <Route path="/admin/*" element={
          <RequireAuth><GenericPlaceholder portal="Admin" /></RequireAuth>
        } />
        <Route path="/doctor/*" element={
          <RequireAuth><GenericPlaceholder portal="Doctor" /></RequireAuth>
        } />
        <Route path="/reception/*" element={
          <RequireAuth><GenericPlaceholder portal="Reception" /></RequireAuth>
        } />
        <Route path="/pharmacy/*" element={
          <RequireAuth><GenericPlaceholder portal="Pharmacy" /></RequireAuth>
        } />
        <Route path="/lab/*" element={
          <RequireAuth><GenericPlaceholder portal="Lab" /></RequireAuth>
        } />
        <Route path="/patient/*" element={
          <RequireAuth><GenericPlaceholder portal="Patient" /></RequireAuth>
        } />

        {/* 404 → Sign-In */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
