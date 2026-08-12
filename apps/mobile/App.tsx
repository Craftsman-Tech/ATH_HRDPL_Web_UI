/**
 * ============================================================================
 *  App.tsx — Mobile entry point
 * ============================================================================
 *  Loads custom fonts (Plus Jakarta Sans + Fraunces) before rendering, then
 *  layers providers Theme → Lang → Auth → Navigator (matches the web order).
 *
 *  If you switch from the Expo managed workflow to bare RN, the only thing
 *  that changes is how fonts get registered — everything else stays.
 * ============================================================================
 */
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider }       from 'react-native-safe-area-context';
import {
  ThemeProvider, LangProvider, AuthProvider, useTheme,
} from './src/components/AppContexts';
import RootNavigator             from './src/navigation/RootNavigator';

// Inner shell — needs to live below the providers so it can read the theme
// for the StatusBar / loader background.
function AppShell() {
  const { mode, theme } = useTheme();
  return (
    <>
      <StatusBar barStyle={mode === 'light' ? 'dark-content' : 'light-content'}
                 backgroundColor={theme.bg} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  // Load fonts up-front — the brand depends on Fraunces + Plus Jakarta.
  // For Phase 1 we reference Google's hosted ttf files; in production you'd
  // bundle them locally for offline support.
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LangProvider>
            <AuthProvider>
              <AppShell />
            </AuthProvider>
          </LangProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
