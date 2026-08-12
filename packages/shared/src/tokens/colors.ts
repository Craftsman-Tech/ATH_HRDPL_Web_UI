/**
 * ============================================================================
 *  COLORS — Vexoo Design Tokens
 * ============================================================================
 *
 *  These mirror the palette the SHIPPED web portals use (see the `--paper` /
 *  `--ink-*` / `--mineral-*` custom properties at the top of DoctorCSS.ts,
 *  HaCSS.ts, LabTechCSS.ts, PharmacistCSS.ts and ReceptionCSS.ts).
 *
 *  The system is three scales:
 *    - PAPER  — warm off-white grounds. Never pure #fff for the page itself.
 *    - INK    — the near-black green-grey used for text, chrome and sidebars.
 *    - MINERAL— the teal-green brand primary.
 *
 *  Convention:
 *    - `light` and `dark` are full theme objects.
 *    - `palette` holds raw hex values for one-off needs.
 *    - Status colors (`statusBg`/`statusText`) are paired so chips always look
 *      right whether you're showing them on a card or a panel background.
 *
 *  When adding a new color: add it to `light` AND `dark` so dark-mode users
 *  don't break. If a color truly is theme-agnostic, put it in `palette`.
 * ============================================================================
 */

// ── Scales ────────────────────────────────────────────────────────────────
// Ink — the near-black used for text and dark chrome. Slightly green-shifted
// so it sits with mineral instead of fighting it.
export const ink = {
  900: '#0B0F0E',
  800: '#171C1B',
  700: '#2A302F',
  600: '#454C4B',
  500: '#6B7270',
  400: '#9AA09E',
  300: '#C4C8C6',
  200: '#E4E6E4',
  100: '#EFF0EE',
  50:  '#F5F6F4',
} as const;

// Mineral — the brand teal-green. 700 is the primary action color.
export const mineral = {
  900: '#062F26',
  800: '#0A4A3D',
  700: '#0E7C66',
  600: '#149E83',
  500: '#1FBFA0',
  400: '#5BD4BC',
  300: '#A4E8DA',
  200: '#D1F2EB',
  100: '#E8F8F4',
} as const;

// Raw palette — never used directly by screens, only by themes below.
export const palette = {
  // Brand
  primary:        mineral[700],
  primaryDark:    mineral[800],
  primaryLight:   mineral[100],
  primaryBright:  mineral[500],
  primaryMid:     mineral[300],

  // Deep ink used by sidebars, the sign-in brand panel and portal headers
  ink:            ink[900],
  inkSoft:        ink[800],

  // Neutrals
  white:          '#ffffff',
  bgWarm:         '#FAFAF7', // paper — the off-white behind every light screen
  bgCool:         '#F4F2EC', // paper-warm — a slightly deeper ground
  border:         ink[200],
  borderCool:     ink[100],
  text:           ink[900],
  textMuted:      ink[500],

  // Status colors (used in chips, banners, alerts). These are the muted,
  // "editorial" versions the web portals use — not raw Tailwind brights.
  amber:          '#C68A1F',
  amberLight:     '#FBF1DC',
  rose:           '#B43A2C',
  roseLight:      '#FAE2DD',
  blue:           '#0A6E8F',
  blueLight:      '#E2F1F6',
  green:          mineral[700],
  greenLight:     mineral[100],
  purple:         '#6D5BD0',
  purpleLight:    '#ECE9FB',
  indigo:         '#4F5BC0',

  // Role accents — each portal tints its chrome with one of these.
  roleAdmin:        mineral[700],
  roleDoctor:       '#0A7A8F',
  roleReceptionist: mineral[700],
  rolePharmacist:   '#6D5BD0',
  roleLabTech:      '#C68A1F',
  rolePatient:      '#2A7A4B',
} as const;

// Light theme — the default for all portals.
export const light = {
  bg:           palette.bgWarm,
  bgSunken:     palette.bgCool,   // a recessed ground for inputs / wells
  card:         palette.white,
  cardMuted:    ink[50],
  sidebar:      ink[900],
  sidebarHover: ink[800],
  primary:      palette.primary,
  primaryLight: palette.primaryLight,
  primaryDark:  palette.primaryDark,
  text:         palette.text,
  textSecondary: ink[600],
  textMuted:    palette.textMuted,
  textFaint:    ink[400],
  border:       palette.border,
  borderStrong: ink[300],
  hairline:     ink[100],

  // Text / icons that sit ON a primary-filled surface
  onPrimary:    '#FAFAF7',
  onInk:        '#FAFAF7',

  // Status background / text pairs — always use them together
  statusBg: {
    success: palette.greenLight,
    warning: palette.amberLight,
    danger:  palette.roseLight,
    info:    palette.blueLight,
    purple:  palette.purpleLight,
    neutral: ink[50],
  },
  statusText: {
    success: palette.green,
    warning: palette.amber,
    danger:  palette.rose,
    info:    palette.blue,
    purple:  palette.purple,
    neutral: palette.textMuted,
  },
} as const;

// Dark theme — mirrors the `[data-theme="dark"] .signin-shell` block on web:
// a deep ink-green ground rather than a blue-grey one.
export const dark = {
  bg:           '#0E1413',
  bgSunken:     '#0A100F',
  card:         '#141A19',
  cardMuted:    '#1B2221',
  sidebar:      '#080C0B',
  sidebarHover: '#161D1C',
  primary:      '#16B597',
  primaryLight: 'rgba(31,191,160,0.14)',
  primaryDark:  '#0E7C66',
  text:         '#FAFAF7',
  textSecondary:'#C4C8C6',
  textMuted:    '#9AA3A1',
  textFaint:    '#6B7270',
  border:       'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.18)',
  hairline:     'rgba(255,255,255,0.06)',

  onPrimary:    '#04120F',
  onInk:        '#FAFAF7',

  statusBg: {
    success: 'rgba(31,191,160,0.15)',
    warning: 'rgba(233,178,74,0.15)',
    danger:  'rgba(226,116,99,0.15)',
    info:    'rgba(90,178,206,0.15)',
    purple:  'rgba(154,139,235,0.15)',
    neutral: 'rgba(255,255,255,0.06)',
  },
  statusText: {
    success: '#3FD6B8',
    warning: '#E9B24A',
    danger:  '#E27463',
    info:    '#5AB2CE',
    purple:  '#9A8BEB',
    neutral: '#9AA3A1',
  },
} as const;

// Type-safe helper — every screen component imports `Theme` and types its props
// against this so light/dark stay in lockstep.
export type Theme = typeof light | typeof dark;
