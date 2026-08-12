/**
 * ============================================================================
 *  COLOUR HELPERS — Vexoo Mobile
 * ============================================================================
 *  Screens constantly need "this accent, but as a soft background". The old
 *  code did that by string-appending a hex alpha pair (`${accent}18`), which
 *  breaks silently on `rgba()` inputs and reads as a magic number.
 * ============================================================================
 */

/** Clamps to [0,1] and converts to a two-digit hex alpha suffix. */
function hexAlpha(a: number): string {
  const clamped = Math.max(0, Math.min(1, a));
  return Math.round(clamped * 255).toString(16).padStart(2, '0');
}

/**
 * Returns `color` at the given opacity.
 *
 * Handles `#rgb`, `#rrggbb` and `rgb()/rgba()` inputs; anything else is passed
 * through untouched so it degrades to a solid colour instead of an invalid one.
 */
export function alpha(color: string, a: number): string {
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length === 8) hex = hex.slice(0, 6);
    if (hex.length !== 6) return color;
    return `#${hex}${hexAlpha(a)}`;
  }

  const rgb = color.match(/rgba?\(([^)]+)\)/);
  if (rgb) {
    const [r, g, b] = rgb[1].split(',').map((v) => v.trim());
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, a))})`;
  }

  return color;
}

/**
 * The standard "soft fill" for an accent — a chip or icon well tinted with its
 * own colour. Light mode wants a very faint wash; dark mode needs more punch
 * to register against the near-black ground.
 */
export function tint(color: string, mode: 'light' | 'dark' = 'light'): string {
  return alpha(color, mode === 'dark' ? 0.18 : 0.1);
}

/** A slightly stronger tint for hover/pressed and selected states. */
export function tintStrong(color: string, mode: 'light' | 'dark' = 'light'): string {
  return alpha(color, mode === 'dark' ? 0.28 : 0.16);
}

function toRgb(color: string): [number, number, number] | null {
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length < 6) return null;
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b] = m[1].split(',').map((v) => parseFloat(v.trim()));
  return [r, g, b];
}

/**
 * Blends `overlay` into `base` and returns an OPAQUE colour.
 *
 * Needed wherever a tinted background sits on an elevated surface: Android
 * draws its elevation shadow behind the view, so a semi-transparent background
 * lets that shadow bleed through and the card reads as dirty grey rather than
 * tinted. Compositing up front keeps the surface opaque.
 */
export function mix(base: string, overlay: string, ratio: number): string {
  const a = toRgb(base);
  const b = toRgb(overlay);
  if (!a || !b) return base;
  const t = Math.max(0, Math.min(1, ratio));
  const out = a.map((channel, i) => Math.round(channel + (b[i] - channel) * t));
  return `#${out.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}
