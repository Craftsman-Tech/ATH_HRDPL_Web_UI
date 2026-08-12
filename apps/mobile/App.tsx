/**
 * ============================================================================
 *  App.tsx — Mobile entry point
 * ============================================================================
 *  Loads the brand faces (Inter Tight + Fraunces + JetBrains Mono) before
 *  rendering, then layers providers Theme → Lang → Auth → Navigator (matching
 *  the web order).
 *
 *  The fonts ship in the bundle via @expo-google-fonts, so this resolves in a
 *  frame or two after a cold start and never hits the network. While it does,
 *  we hold a branded splash rather than flashing system-font text and
 *  reflowing — that flash is the classic tell of a hybrid app.
 * ============================================================================
 */
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider }       from 'react-native-safe-area-context';
import {
  ThemeProvider, LangProvider, AuthProvider, useTheme,
} from './src/components/AppContexts';
import RootNavigator             from './src/navigation/RootNavigator';
import { useBrandFonts }         from './src/theme';
import { GlobalPulseOverlay, InkPanel, VexooGlyph } from './src/ui';

/**
 * Cold-start splash. Deliberately built from raw primitives — it has to render
 * correctly before the type system's fonts exist.
 */
function BrandSplash() {
  return (
    <InkPanel accent="#0E7C66" glowPosition="top" height={900} style={styles.splash}>
      <View style={styles.splashInner}>
        <View style={styles.splashRing}>
          <View style={styles.splashMark}>
            <VexooGlyph size={34} color="#FAFAF7" />
          </View>
        </View>
        <Text style={styles.splashWord}>Vexoo One</Text>
        <Text style={styles.splashSub}>CLINIC OPERATIONS</Text>
      </View>
    </InkPanel>
  );
}

// Inner shell — needs to live below the providers so it can read the theme
// for the StatusBar / loader background.
function AppShell() {
  return (
    <>
      {/*
        Every screen in the app opens with an ink surface at the top — the
        sign-in hero, the register top bar, and AppHeader on every portal. So
        the status bar is translucent and always light-content, letting the ink
        (and its grid + orb glow) run edge-to-edge under the system clock
        instead of being capped by a pale strip.

        Each of those surfaces pads itself by `useSafeAreaInsets().top`, so
        nothing ends up underneath the clock.
      */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <RootNavigator />
      {/*
        Mounted above the navigator so any work announced through `withPulse`
        / `pulseFor` — from any portal, any module — shows the heartbeat over
        whatever is on screen. It renders nothing until work is registered, so
        cold start stays the V splash above.
      */}
      <GlobalPulseOverlay />
    </>
  );
}

export default function App() {
  const fontsReady = useBrandFonts();

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LangProvider>
            <AuthProvider>
              {fontsReady ? <AppShell /> : <BrandSplash />}
            </AuthProvider>
          </LangProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  splash: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  splashInner: {
    alignItems: 'center',
  },
  // Thin halo around the tile — the only "loading" affordance on the splash,
  // so the mark itself stays the V rather than a spinner.
  splashRing: {
    alignItems: 'center',
    borderColor: 'rgba(250,250,247,0.16)',
    borderRadius: 51,
    borderWidth: 1,
    height: 102,
    justifyContent: 'center',
    width: 102,
  },
  splashMark: {
    alignItems: 'center',
    backgroundColor: '#0E7C66',
    borderRadius: 18,
    height: 66,
    justifyContent: 'center',
    width: 66,
  },
  splashWord: {
    color: '#FAFAF7',
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginTop: 18,
  },
  splashSub: {
    color: 'rgba(250,250,247,0.45)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 5,
  },
});
