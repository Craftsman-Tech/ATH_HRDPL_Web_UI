/**
 * ============================================================================
 *  SPACING, RADII & ELEVATION — Vexoo Design Tokens
 * ============================================================================
 *
 *  Both apps use a 4px base grid. Always reach for these constants instead of
 *  hard-coding pixel values in screens — it keeps everything visually rhythmic.
 *
 *  Naming: t-shirt sizes (xs/sm/md/lg/xl) plus numeric escape hatches when
 *  layout precision matters (e.g. `gap14` for the 14px gaps used throughout
 *  the original card grids).
 * ============================================================================
 */

export const spacing = {
  // Base scale — for padding/margin/gap
  xxs:  2,
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  xxxl: 32,
  huge: 44,

  // Numeric escape hatches matching the existing mockups
  gap14: 14,
  gap18: 18,
  pad22: 22,
} as const;

/**
 * Corner radii. The web design system runs on a 10 / 11 / 14 trio
 * (`--radius-xs`, `--radius-sm`, `--radius`); mobile rounds a touch softer
 * because touch targets are physically larger.
 */
export const radius = {
  xs:   6,   // tiny chips, dots
  sm:   10,  // small buttons, segmented items
  md:   12,  // standard buttons, status chips
  lg:   14,  // input fields, list rows  (= web --radius)
  xl:   18,  // cards
  xxl:  24,  // large cards, bottom sheets
  xxxl: 32,  // hero panels
  pill: 999, // pill / capsule
} as const;

/**
 * Elevation profiles, expressed in a platform-neutral way. The web maps these
 * to `box-shadow`; mobile maps them to iOS shadow* props + Android elevation
 * (see apps/mobile/src/theme/elevation.ts).
 *
 * `y` is the vertical offset, `blur` the spread, `opacity` the shadow alpha
 * against the ink-900 shadow color. Two-layer shadows on web collapse to the
 * larger of the pair on native.
 */
export const elevation = {
  none: { y: 0, blur: 0,  opacity: 0,    android: 0 },
  xs:   { y: 1, blur: 3,  opacity: 0.05, android: 1 },
  sm:   { y: 2, blur: 8,  opacity: 0.07, android: 2 },
  md:   { y: 6, blur: 18, opacity: 0.09, android: 5 },
  lg:   { y: 12, blur: 28, opacity: 0.12, android: 10 },
  xl:   { y: 20, blur: 44, opacity: 0.18, android: 18 },
} as const;

/** Legacy alias — older screens import `shadow`. Kept pointing at `elevation`. */
export const shadow = elevation;

/**
 * Motion. The web uses `cubic-bezier(0.2,0.9,0.3,1)` for entrances — a quick
 * start with a long settle. Durations are milliseconds.
 */
export const motion = {
  fast:    140,
  base:    220,
  slow:    320,
  entrance:400,
} as const;
