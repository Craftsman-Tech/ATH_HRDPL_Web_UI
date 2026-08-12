/**
 * ============================================================================
 *  ELEVATION — Vexoo Mobile
 * ============================================================================
 *  The web draws depth with two-layer box-shadows:
 *
 *    --shadow: 0 2px 8px rgba(11,15,14,.06), 0 12px 28px rgba(11,15,14,.07);
 *
 *  React Native only supports a single shadow per view, so each web profile
 *  collapses to its larger layer, with the opacity nudged up to compensate for
 *  the missing contact shadow.
 *
 *  Dark mode is the important subtlety: a black shadow on a near-black ground
 *  is invisible, so depth there is carried by a lifted surface colour and a
 *  hairline border instead. `elevation()` returns a much softer shadow in dark
 *  and the components pair it with `theme.cardMuted` / `theme.border`.
 * ============================================================================
 */
import { Platform, type ViewStyle } from 'react-native';
import { elevation as profiles } from '@vexoo/shared';

export type ElevationLevel = keyof typeof profiles; // none | xs | sm | md | lg | xl

/**
 * Builds a platform-correct shadow style.
 *
 * @param level  which profile to use
 * @param mode   'light' | 'dark' — dark mode damps the shadow heavily
 */
export function elevation(level: ElevationLevel, mode: 'light' | 'dark' = 'light'): ViewStyle {
  const p = profiles[level];
  if (!p || p.opacity === 0) return {};

  // In dark mode a cast shadow reads as mud. Keep a trace of it for the
  // largest surfaces (sheets, menus) and drop it entirely for cards.
  const opacity = mode === 'dark' ? p.opacity * 0.55 : p.opacity;

  return Platform.select<ViewStyle>({
    ios: {
      shadowColor:   '#0B0F0E',
      shadowOffset:  { width: 0, height: p.y },
      shadowOpacity: opacity,
      shadowRadius:  p.blur / 2, // iOS radius is roughly half the CSS blur
    },
    android: {
      // Android's elevation also paints a system shadow; it ignores opacity,
      // so dark mode simply asks for a shallower one.
      elevation: mode === 'dark' ? Math.round(p.android * 0.6) : p.android,
      shadowColor: '#0B0F0E',
    },
    default: {
      shadowColor:   '#0B0F0E',
      shadowOffset:  { width: 0, height: p.y },
      shadowOpacity: opacity,
      shadowRadius:  p.blur / 2,
    },
  }) as ViewStyle;
}

/**
 * A coloured glow, used sparingly for primary CTAs and the active role chip —
 * the mobile equivalent of the web's `box-shadow: 0 8px 20px rgba(14,124,102,.26)`.
 */
export function glow(color: string, strength: 'sm' | 'md' = 'md'): ViewStyle {
  const p = strength === 'sm'
    ? { y: 4,  blur: 12, opacity: 0.28, android: 4 }
    : { y: 8,  blur: 22, opacity: 0.34, android: 8 };

  return Platform.select<ViewStyle>({
    ios: {
      shadowColor:   color,
      shadowOffset:  { width: 0, height: p.y },
      shadowOpacity: p.opacity,
      shadowRadius:  p.blur / 2,
    },
    android: { elevation: p.android, shadowColor: color },
    default: {
      shadowColor:   color,
      shadowOffset:  { width: 0, height: p.y },
      shadowOpacity: p.opacity,
      shadowRadius:  p.blur / 2,
    },
  }) as ViewStyle;
}
