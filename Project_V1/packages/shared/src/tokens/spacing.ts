/**
 * ============================================================================
 *  SPACING & RADII — Vexoo Design Tokens
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

  // Numeric escape hatches matching the existing mockups
  gap14: 14,
  gap18: 18,
  pad22: 22,
} as const;

export const radius = {
  xs:   4,   // tiny chips
  sm:   8,   // small buttons, inputs
  md:   10,  // standard buttons, status chips
  lg:   12,  // input fields, secondary cards
  xl:   14,  // cards
  xxl:  18,  // large cards (Patient portal)
  pill: 999, // pill / capsule
} as const;

// Standard shadow profiles — RN and CSS represent shadows differently, so each
// platform's theme provider will translate these to its native format.
export const shadow = {
  none:   { offset: 0, blur: 0,  opacity: 0    },
  sm:     { offset: 1, blur: 4,  opacity: 0.04 },
  md:     { offset: 2, blur: 8,  opacity: 0.06 },
  lg:     { offset: 4, blur: 16, opacity: 0.08 },
  card:   { offset: 2, blur: 16, opacity: 0.05 }, // matches Patient portal cards
} as const;
