/**
 * ============================================================================
 *  FONTS — Vexoo Mobile
 * ============================================================================
 *  The brand runs on three families (identical to the web portals):
 *
 *    Inter Tight   — body / UI.       Tight grotesque, dense but legible.
 *    Fraunces      — display serif.   Headlines, page titles, big numerals.
 *    JetBrains Mono— IDs and timers.
 *
 *  React Native cannot synthesise weights for custom fonts the way a browser
 *  can — asking for `fontWeight: '700'` on a Regular file silently does
 *  nothing on Android. So every weight is registered as its own family and
 *  selected by name through the helpers below.
 *
 *  The files ship inside the app bundle (via @expo-google-fonts), so there is
 *  no network dependency and no flash of unstyled text after first launch.
 * ============================================================================
 */
import { useFonts } from 'expo-font';

// Imported by exact sub-path, NOT from the package root. The root barrel
// re-exports every weight and italic in the family, and Metro's asset graph
// follows all of them — importing from '@expo-google-fonts/inter-tight' alone
// bundles ~30 unused .ttf files (several MB) into the app.
import { InterTight_400Regular }   from '@expo-google-fonts/inter-tight/400Regular';
import { InterTight_500Medium }    from '@expo-google-fonts/inter-tight/500Medium';
import { InterTight_600SemiBold }  from '@expo-google-fonts/inter-tight/600SemiBold';
import { InterTight_700Bold }      from '@expo-google-fonts/inter-tight/700Bold';
import { InterTight_800ExtraBold } from '@expo-google-fonts/inter-tight/800ExtraBold';

import { Fraunces_300Light }          from '@expo-google-fonts/fraunces/300Light';
import { Fraunces_400Regular }        from '@expo-google-fonts/fraunces/400Regular';
import { Fraunces_500Medium }         from '@expo-google-fonts/fraunces/500Medium';
import { Fraunces_600SemiBold }       from '@expo-google-fonts/fraunces/600SemiBold';
import { Fraunces_400Regular_Italic } from '@expo-google-fonts/fraunces/400Regular_Italic';

import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono/400Regular';
import { JetBrainsMono_500Medium }  from '@expo-google-fonts/jetbrains-mono/500Medium';

/** The map handed to expo-font. Keys become the `fontFamily` strings. */
export const FONT_MAP = {
  'InterTight-400': InterTight_400Regular,
  'InterTight-500': InterTight_500Medium,
  'InterTight-600': InterTight_600SemiBold,
  'InterTight-700': InterTight_700Bold,
  'InterTight-800': InterTight_800ExtraBold,

  'Fraunces-300': Fraunces_300Light,
  'Fraunces-400': Fraunces_400Regular,
  'Fraunces-500': Fraunces_500Medium,
  'Fraunces-600': Fraunces_600SemiBold,
  'Fraunces-400i': Fraunces_400Regular_Italic,

  'JetBrainsMono-400': JetBrainsMono_400Regular,
  'JetBrainsMono-500': JetBrainsMono_500Medium,
};

export type BodyWeight    = 400 | 500 | 600 | 700 | 800;
export type DisplayWeight = 300 | 400 | 500 | 600;
export type MonoWeight    = 400 | 500;

/** Body (Inter Tight) — the default for all UI text. */
export const body = (weight: BodyWeight = 400) => `InterTight-${weight}` as const;

/** Display (Fraunces) — headlines and hero numerals only. */
export const display = (weight: DisplayWeight = 400) => `Fraunces-${weight}` as const;

/** Display italic — used for the accented word in sign-in headlines. */
export const displayItalic = 'Fraunces-400i' as const;

/** Mono (JetBrains Mono) — patient IDs, tokens, timers. */
export const mono = (weight: MonoWeight = 400) => `JetBrainsMono-${weight}` as const;

/**
 * Loads every brand face. Returns `true` once they're ready.
 *
 * Rendering before this resolves would show the system font for a frame and
 * then reflow, so App.tsx holds a branded splash until it flips.
 */
export function useBrandFonts(): boolean {
  const [loaded, error] = useFonts(FONT_MAP);
  // If a face genuinely fails to decode we still let the app through rather
  // than trapping the user on a splash forever — RN falls back to the system
  // font for that one family.
  return loaded || !!error;
}
