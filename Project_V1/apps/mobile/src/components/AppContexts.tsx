/**
 * ============================================================================
 *  Mobile contexts — Theme, Lang, Auth
 * ============================================================================
 *  Same shape as the web contexts (see apps/web/src/components/*) but uses
 *  AsyncStorage instead of localStorage. Screen code calling `useAuth()`,
 *  `useTheme()`, `useLang()` is interchangeable across platforms.
 * ============================================================================
 */
import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LANGS, light as lightTheme, dark as darkTheme,
  findUserByEmail,
  type LangCode, type Strings, type Theme, type AuthUser, type Role,
} from '@vexoo/shared';

// ─── Theme ──────────────────────────────────────────────────────────────────
type ThemeMode = 'light' | 'dark';
interface ThemeCtx { mode: ThemeMode; theme: Theme; toggle: () => void; }
const ThemeContext = createContext<ThemeCtx | null>(null);

const KEY_THEME = '@vexoo/theme';
const KEY_LANG  = '@vexoo/lang';
const KEY_AUTH  = '@vexoo/auth';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  // Hydrate from AsyncStorage on mount.
  useEffect(() => {
    AsyncStorage.getItem(KEY_THEME).then(v => v && setMode(v as ThemeMode));
  }, []);

  const toggle = () => {
    setMode(m => {
      const next = m === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem(KEY_THEME, next);
      return next;
    });
  };

  const theme = mode === 'light' ? lightTheme : darkTheme;
  return <ThemeContext.Provider value={{ mode, theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeCtx {
  const v = useContext(ThemeContext);
  if (!v) throw new Error('useTheme must be inside <ThemeProvider>');
  return v;
}

// ─── Language ───────────────────────────────────────────────────────────────
interface LangCtx { code: LangCode; set: (c: LangCode) => void; t: Strings; }
const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<LangCode>('en');

  useEffect(() => {
    AsyncStorage.getItem(KEY_LANG).then(v => v && setCode(v as LangCode));
  }, []);

  const set = (c: LangCode) => { setCode(c); AsyncStorage.setItem(KEY_LANG, c); };

  return <LangContext.Provider value={{ code, set, t: LANGS[code] }}>{children}</LangContext.Provider>;
}

export function useLang(): LangCtx {
  const v = useContext(LangContext);
  if (!v) throw new Error('useLang must be inside <LangProvider>');
  return v;
}

// ─── Auth ───────────────────────────────────────────────────────────────────
interface AuthCtx {
  user:    AuthUser | null;
  ready:   boolean;                // false while we hydrate from storage
  signIn:  (email: string, password: string, role: Role) => Promise<AuthUser | null>;
  signOut: () => void;
}
const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,  setUser]  = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  // Hydrate persisted user on mount.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY_AUTH);
        if (raw) setUser(JSON.parse(raw) as AuthUser);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const signIn: AuthCtx['signIn'] = async (email, _password, role) => {
    const found = findUserByEmail(email);
    if (!found || found.role !== role) return null;
    setUser(found);
    AsyncStorage.setItem(KEY_AUTH, JSON.stringify(found));
    return found;
  };

  const signOut = () => {
    setUser(null);
    AsyncStorage.removeItem(KEY_AUTH);
  };

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthCtx {
  const v = useContext(AuthContext);
  if (!v) throw new Error('useAuth must be inside <AuthProvider>');
  return v;
}
