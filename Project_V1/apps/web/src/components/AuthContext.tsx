/**
 * ============================================================================
 *  AuthContext — Web
 * ============================================================================
 *  Holds the currently signed-in user. Persists to localStorage so a refresh
 *  doesn't kick the user back to the Sign-In page.
 *
 *  When a real backend exists, replace `signIn`'s body with an API call.
 *  The shape returned by that call must still match `AuthUser`.
 * ============================================================================
 */
import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from 'react';
import { findUserByEmail, type AuthUser, type Role } from '@vexoo/shared';

interface AuthCtx {
  user:    AuthUser | null;
  signIn:  (email: string, password: string, role: Role) => Promise<AuthUser | null>;
  /**
   * Demo patient self-sign-up. Reuses the demo Patient's AuthUser shape (so the
   * record stays valid for the Patient portal) with the supplied name/email and
   * the auto-generated Patient ID. Replace with a real account-creation API.
   */
  signUpPatient: (name: string, email: string, id?: string) => AuthUser | null;
  signOut: () => void;
}

const STORAGE_KEY = 'vexoo.auth.user';
const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Eagerly hydrate from localStorage on first render — no flash of Sign-In.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch { return null; }
  });

  // Persist on change.
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else      localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  // Demo sign-in — finds the user by email and verifies the role matches.
  // (Password is ignored in demo mode, per the original Sign-In page behavior.)
  const signIn: AuthCtx['signIn'] = async (email, _password, role) => {
    const found = findUserByEmail(email);
    if (!found || found.role !== role) return null;
    setUser(found);
    return found;
  };

  const signOut = () => setUser(null);

  // Demo patient self-sign-up — clones the demo Patient's valid AuthUser, then
  // overrides identity. In production findUserByEmail('patient@vexoo.in')
  // resolves the seed Patient; the real backend returns the created account.
  const signUpPatient: AuthCtx['signUpPatient'] = (name, email, id) => {
    const base = findUserByEmail('patient@vexoo.in');
    if (!base) return null;
    const u: AuthUser = {
      ...base,
      id: id || 'VX-PT-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      name,
      email,
    };
    setUser(u);
    return u;
  };

  return <Ctx.Provider value={{ user, signIn, signUpPatient, signOut }}>{children}</Ctx.Provider>;
}

/** Hook — `const { user, signIn, signOut } = useAuth();` */
export function useAuth(): AuthCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
}
