/**
 * ============================================================================
 *  main.tsx — Web entry point
 * ============================================================================
 *  Provider order matters: Theme → Lang → Auth → Routes.
 *  Auth depends on nothing app-level, but goes inside Theme/Lang so toasts
 *  it might raise can be themed/translated.
 * ============================================================================
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, LangProvider } from './components/ThemeContext';
import { AuthProvider }                from './components/AuthContext';
import { GlobalPulseOverlay }          from './components/PulseLoader';
import AppRoutes                       from './routes/AppRoutes';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <AppRoutes />
          {/*
            Renders the heartbeat for any work announced through `withPulse` /
            `pulseFor` — from any portal, any module, any export. Draws nothing
            until work is registered.
          */}
          <GlobalPulseOverlay />
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
