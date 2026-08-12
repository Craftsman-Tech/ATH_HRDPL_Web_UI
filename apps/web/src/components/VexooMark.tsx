/**
 * ============================================================================
 *  VexooMark — the brand mark (Web)
 * ============================================================================
 *  The Vexoo "V". Single source of truth for the logo glyph: before this
 *  existed each portal sidebar inlined its own SVG, so Doctor/Lab/Reception
 *  showed a heart, Admin/Pharmacy showed a bolt, and Sign-In showed a pulse.
 *
 *  Mirrors the same path as the mobile mark in apps/mobile/src/ui/VexooMark.tsx
 *  so both platforms draw an identical letter.
 * ============================================================================
 */

/** Solid V on a 24×24 grid, drawn outer-left → apex → outer-right. */
const V_PATH = 'M4 4H8.4L12 14.6L15.6 4H20L13.2 20H10.8Z';

export function VexooGlyph({
  size = 20,
  color = 'white',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={V_PATH} fill={color} />
    </svg>
  );
}
