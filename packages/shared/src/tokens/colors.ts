/**
 * ============================================================================
 *  COLORS — Vexoo Design Tokens
 * ============================================================================
 *
 *  These are the EXACT colors extracted from the original HTML mockups.
 *  Both Web (CSS variables) and Mobile (RN StyleSheet) consume this file,
 *  so changing a value here changes it EVERYWHERE in the app.
 *
 *  Convention:
 *    - `light` and `dark` are full theme objects (sign-in supports both).
 *    - `palette` holds raw hex values for one-off needs.
 *    - Status colors (`statusBg`/`statusText`) are paired so chips always look
 *      right whether you're showing them on a card or a panel background.
 *
 *  When adding a new color: add it to `light` AND `dark` so dark-mode users
 *  don't break. If a color truly is theme-agnostic, put it in `palette`.
 * ============================================================================
 */

// Raw palette — never used directly by screens, only by themes below.
export const palette = {
  // Brand
  primary:        '#0d9488', // teal — main brand action color
  primaryDark:    '#0a7a70',
  primaryLight:   '#e6faf8',

  // Sign-in / brand panel deep ink (Vexoo's signature dark teal-navy)
  ink:            '#1c2537',
  inkSoft:        '#253048',

  // Neutrals
  white:          '#ffffff',
  bgWarm:         '#faf9f7', // the off-white used everywhere on light theme
  bgCool:         '#f4f6fb', // lab tech variant
  border:         '#e8e4dc',
  borderCool:     '#e4e8f0',
  text:           '#1c2537',
  textMuted:      '#64748b',

  // Status colors (used in chips, banners, alerts)
  amber:          '#d97706',
  amberLight:     '#fef3c7',
  rose:           '#e11d48',
  roseLight:      '#ffe4e6',
  blue:           '#3b82f6',
  blueLight:      '#dbeafe',
  green:          '#16a34a',
  greenLight:     '#dcfce7',
  purple:         '#7c3aed',
  purpleLight:    '#ede9fe',
  indigo:         '#4f6ef7',

  // Role accents (sign-in role picker)
  roleAdmin:        '#0E7C66',
  roleDoctor:       '#0A7A8F',
  roleReceptionist: '#0E7C66',
  rolePharmacist:   '#5C6BC0',
  rolePatient:      '#2A7A4B',
} as const;

// Light theme — the default for all portals.
export const light = {
  bg:           palette.bgWarm,
  card:         palette.white,
  sidebar:      palette.ink,
  sidebarHover: palette.inkSoft,
  primary:      palette.primary,
  primaryLight: palette.primaryLight,
  text:         palette.text,
  textMuted:    palette.textMuted,
  border:       palette.border,

  // Status background / text pairs — always use them together
  statusBg: {
    success: palette.primaryLight,
    warning: palette.amberLight,
    danger:  palette.roseLight,
    info:    palette.blueLight,
    purple:  palette.purpleLight,
    neutral: '#f1f5f9',
  },
  statusText: {
    success: palette.primary,
    warning: palette.amber,
    danger:  palette.rose,
    info:    palette.blue,
    purple:  palette.purple,
    neutral: palette.textMuted,
  },
} as const;

// Dark theme — currently used by the Nurse/Receptionist portal and
// available everywhere via the theme toggle on the Sign-In page.
export const dark = {
  bg:           '#0f1623',
  card:         '#1a2230',
  sidebar:      '#0a0f1a',
  sidebarHover: '#1a2230',
  primary:      '#2dd4bf',           // a brighter teal that pops on dark
  primaryLight: 'rgba(45,212,191,0.15)',
  text:         '#f1f5f9',
  textMuted:    '#94a3b8',
  border:       'rgba(255,255,255,0.08)',

  statusBg: {
    success: 'rgba(45,212,191,0.15)',
    warning: 'rgba(251,191,36,0.15)',
    danger:  'rgba(248,113,113,0.15)',
    info:    'rgba(96,165,250,0.15)',
    purple:  'rgba(192,132,252,0.15)',
    neutral: 'rgba(255,255,255,0.05)',
  },
  statusText: {
    success: '#2dd4bf',
    warning: '#fbbf24',
    danger:  '#f87171',
    info:    '#60a5fa',
    purple:  '#c084fc',
    neutral: '#94a3b8',
  },
} as const;

// Type-safe helper — every screen component imports `Theme` and types its props
// against this so light/dark stay in lockstep.
export type Theme = typeof light;
