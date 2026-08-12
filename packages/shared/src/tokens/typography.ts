/**
 * ============================================================================
 *  TYPOGRAPHY — Vexoo Design Tokens
 * ============================================================================
 *
 *  Three type families, matching the shipped web portals:
 *    - `body`     — Inter Tight. Tight, slightly condensed grotesque; used for
 *                   99% of UI text. Reads dense without feeling cramped.
 *    - `display`  — Fraunces (serif). Hero headlines, page titles and big
 *                   metric numerals. Always set with negative tracking.
 *    - `mono`     — JetBrains Mono. IDs, tokens, codes, timers.
 *
 *  Web loads them via @import in each portal's CSS.
 *  Mobile loads them via expo-font in App.tsx (see apps/mobile/src/theme).
 *
 *  Sizes follow an 10/11/12/13/14/16/18/22/28/34/40 scale.
 *  Weights: 400 / 500 / 600 / 700 / 800.
 * ============================================================================
 */

export const fontFamily = {
  body:    'InterTight',
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
  h3:  24,
  h2:  28,
  h1:  34,
  hero:40,
} as const;

// Line heights — RN uses absolute pixels, not multipliers like CSS.
// We export both so each platform can pick what it needs.
export const lineHeight = {
  tight:    1.2,
  normal:   1.5,
  relaxed:  1.7,
} as const;

/**
 * Letter spacing. The display serif is always set tight (-0.035em on web);
 * small uppercase labels are always set loose. Values are in points at the
 * size they're named for — RN's `letterSpacing` is absolute, not relative.
 */
export const tracking = {
  display: -0.9,  // Fraunces headlines
  tight:   -0.3,  // large body / numerals
  normal:   0,
  label:    0.6,  // 11-12px uppercase field labels
  caps:     1.2,  // 10-11px uppercase eyebrows
} as const;
