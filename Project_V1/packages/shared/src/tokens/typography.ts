/**
 * ============================================================================
 *  TYPOGRAPHY — Vexoo Design Tokens
 * ============================================================================
 *
 *  Two type families:
 *    - `body`     — Plus Jakarta Sans. Used for 99% of UI text.
 *    - `display`  — Fraunces (serif). Used only for hero headlines (Sign-In).
 *
 *  Web loads them via Google Fonts in index.html.
 *  Mobile loads them via expo-font in App.tsx.
 *
 *  Sizes follow an 11/12/13/14/16/18/22/28/40 scale.
 *  Weights: 400 / 500 / 600 / 700 / 800.
 * ============================================================================
 */

export const fontFamily = {
  body:    'PlusJakartaSans',
  display: 'Fraunces',
  mono:    'JetBrainsMono',
} as const;

// Font weights — RN doesn't accept 'bold'/'semibold' reliably; use numeric.
export const fontWeight = {
  regular:  '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
  heavy:    '800',
} as const;

// Type scale. Use these constants instead of magic numbers in screens.
export const fontSize = {
  xxs: 10,
  xs:  11,
  sm:  12,
  base:13,
  md:  14,
  lg:  16,
  xl:  18,
  xxl: 22,
  h2:  28,
  h1:  40,
} as const;

// Line heights — RN uses absolute pixels, not multipliers like CSS.
// We export both so each platform can pick what it needs.
export const lineHeight = {
  tight:    1.2,
  normal:   1.5,
  relaxed:  1.7,
} as const;
