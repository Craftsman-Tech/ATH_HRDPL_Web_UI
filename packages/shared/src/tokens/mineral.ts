/**
 * ============================================================================
 *  MINERAL / INK — Vexoo customer-facing design tokens
 * ============================================================================
 *
 *  The clinic-operations portals use `light` / `dark` from ./colors. The
 *  customer-facing products (Customer web portal, Customer mobile) use a
 *  separate, warmer system called "mineral / ink". They are deliberately
 *  different palettes for different audiences — do not merge them.
 *
 *  Values are the ones already shipping in the React customer portal and the
 *  native Android client, so all three stay in lockstep. Changing a value here
 *  changes it on web, iOS and Android at once.
 * ============================================================================
 */

export const mineralPalette = {
  // Brand
  teal: '#0E7C66', // primary mineral
  tealDark: '#0A4A3D', // deep mineral, gradient end
  mineralBright: '#1FBFA0', // active accent, rails, pulse
  softTeal: '#E8F8F4', // icon chips, soft fills
  heroStart: '#062F26', // hero gradient origin

  // Ink / neutrals
  ink: '#0B0F0E', // near-black, dark surfaces and headings
  ink1: '#2C3330', // primary body text
  ink2: '#454C4B', // secondary text
  ink3: '#6B7270', // muted
  line: '#E4E6E4', // hairline borders
  line2: '#EFF0EE', // faint dividers
  mist: '#F4F6F4', // page background
  paper: '#FAFAF7', // warm paper, auth and hero surfaces
  cardFill: '#FBFDFC', // inset tiles inside cards
  white: '#FFFFFF',

  // Accents
  indigo: '#3B74F0',
  coral: '#E0414B', // alert / emergency only — never a default state
  amber: '#E0951A',
  violet: '#7B61D1',
} as const;

/** Customer-facing light theme. Mirrors the web portal's `.mineral` surface set. */
export const mineral = {
  bg: mineralPalette.paper,
  card: mineralPalette.white,
  cardInset: mineralPalette.cardFill,
  primary: mineralPalette.teal,
  primaryDeep: mineralPalette.tealDark,
  primaryBright: mineralPalette.mineralBright,
  primaryLight: mineralPalette.softTeal,
  heading: mineralPalette.ink,
  text: mineralPalette.ink1,
  textSecondary: mineralPalette.ink2,
  textMuted: mineralPalette.ink3,
  border: mineralPalette.line,
  borderFaint: mineralPalette.line2,
  surfaceDark: mineralPalette.ink,
  heroFrom: mineralPalette.heroStart,
  heroTo: mineralPalette.teal,

  statusBg: {
    success: mineralPalette.softTeal,
    warning: '#FCF0DA',
    danger: '#FBE3E5',
    info: '#E1EAFD',
    neutral: mineralPalette.mist,
  },
  statusText: {
    success: mineralPalette.tealDark,
    warning: mineralPalette.amber,
    danger: mineralPalette.coral,
    info: mineralPalette.indigo,
    neutral: mineralPalette.ink3,
  },
} as const;

export type MineralTheme = typeof mineral;

/**
 * Type family for the customer products. The font files ship with each app;
 * these are the family names to register with expo-font / @font-face.
 */
export const mineralType = {
  body: 'InterTight',
  display: 'Fraunces',
  mono: 'JetBrainsMono',
} as const;
