/**
 * ============================================================================
 *  AppRoutes — Web
 * ============================================================================
 *  Defines every URL the app responds to and which screen renders for it.
 *  Routes that need a signed-in user are wrapped in <RequireAuth>; routes
 *  that should redirect already-signed-in users (Sign-In) use <RedirectIfAuth>.
 *
 *  Today most portal routes are STUBS — they show a placeholder. They get
 *  filled in during their respective build phases (Admin is next).
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
      Admin:'/admin', Doctor:'/doctor', Receptionist:'/reception',
      Pharmacist:'/pharmacy', LabTech:'/lab', Patient:'/patient',
    }[user.role];
    return <Navigate to={home} replace />;
  }
  return <>{children}</>;
}

// ─── Connected screens ───────────────────────────────────────────────────────
// Bridges the real signed-in user into AdminScreen's props, so the sidebar shows
// the actual signed-in name and the Sign-out button logs them out for real.
function AdminRoute() {
  const { user, signOut } = useAuth();
  // adminRole is left at its default ("Founder · root") to match the design.
  // Prefer the literal account role instead? Pass adminRole={user?.role}.
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

        {/* Portals — Admin is real, others are placeholders for now */}
        <Route path="/admin/*" element={
          <RequireAuth><AdminRoute /></RequireAuth>
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
