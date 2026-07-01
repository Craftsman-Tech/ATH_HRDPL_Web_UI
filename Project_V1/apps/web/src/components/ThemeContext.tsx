/**
 * ============================================================================
 *  ThemeContext + LangContext — Web
 * ============================================================================
 *  Two small contexts bundled together because they're always used as a pair.
 *  Both persist to localStorage.
 * ============================================================================
 */
import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from 'react';
import { LANGS, type LangCode, type Strings } from '@vexoo/shared';

// ─── Theme ──────────────────────────────────────────────────────────────────
type ThemeMode = 'light' | 'dark';

interface ThemeCtx {
  mode:   ThemeMode;
  toggle: () => void;
}
const ThemeCtxObj = createContext<ThemeCtx | null>(null);

const THEME_KEY = 'vexoo.theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem(THEME_KEY) as ThemeMode) || 'light';
  });

  // Apply theme by toggling a `data-theme` attribute on <html>.
  // CSS variables in globals.css listen for it via `[data-theme="dark"]`.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  const toggle = () => setMode(m => (m === 'light' ? 'dark' : 'light'));

  return <ThemeCtxObj.Provider value={{ mode, toggle }}>{children}</ThemeCtxObj.Provider>;
}

export function useTheme(): ThemeCtx {
  const v = useContext(ThemeCtxObj);
  if (!v) throw new Error('useTheme must be used inside <ThemeProvider>');
  return v;
}

// ─── Language ───────────────────────────────────────────────────────────────
interface LangCtx {
  code: LangCode;
  set:  (c: LangCode) => void;
  t:    Strings;
}
const LangCtxObj = createContext<LangCtx | null>(null);

const LANG_KEY = 'vexoo.lang';

export function LangProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<LangCode>(() => {
    return (localStorage.getItem(LANG_KEY) as LangCode) || 'en';
  });
  useEffect(() => { localStorage.setItem(LANG_KEY, code); }, [code]);

  return (
    <LangCtxObj.Provider value={{ code, set: setCode, t: LANGS[code] }}>
      {children}
    </LangCtxObj.Provider>
  );
}

export function useLang(): LangCtx {
  const v = useContext(LangCtxObj);
  if (!v) throw new Error('useLang must be used inside <LangProvider>');
  return v;
}
