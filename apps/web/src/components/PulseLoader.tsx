/**
 * ============================================================================
 *  PulseLoader — the Vexoo "waiting" signal (Web)
 * ============================================================================
 *  A heartbeat traced across an ECG monitor — the same mark, geometry and
 *  timing as apps/mobile/src/ui/PulseLoader.tsx, so a Vexoo user sees one
 *  loading language whichever device they are on.
 *
 *  Two layers: the full trace dimmed (the "screen"), and a bright segment swept
 *  along that exact path. Both are driven from one point list, so the dash
 *  length is exact rather than eyeballed and the layers can never drift.
 *
 *  Styles are injected once under `.vx-pulse`, matching how the rest of this
 *  app scopes its CSS, so nothing leaks into a portal's stylesheet.
 * ============================================================================
 */
import { useEffect, useState } from 'react';
import { subscribePulse } from './pulseBus';

/** One PQRST beat on a 100×40 grid — identical to the mobile mark. */
const POINTS: ReadonlyArray<readonly [number, number]> = [
  [0, 20], [30, 20], [34, 16], [38, 20], [42, 24],
  [46, 4], [50, 30], [54, 20], [60, 15], [66, 20], [100, 20],
];

const D = `M${POINTS.map(([x, y]) => `${x} ${y}`).join('L')}`;

/** Exact length — every segment is a straight line, so this is not an estimate. */
const LENGTH = POINTS.reduce(
  (total, point, i) =>
    i === 0 ? 0 : total + Math.hypot(point[0] - POINTS[i - 1][0], point[1] - POINTS[i - 1][1]),
  0,
);

const SEGMENT = LENGTH * 0.3;

const CSS = `
.vx-pulse-track { stroke-opacity: .18 }
.vx-pulse-beat  { animation: vx-pulse-sweep var(--vx-dur,1.5s) linear infinite }
@keyframes vx-pulse-sweep {
  from { stroke-dashoffset: var(--vx-seg) }
  to   { stroke-dashoffset: calc(-1 * var(--vx-len)) }
}
.vx-pulse-overlay {
  position: fixed; inset: 0; z-index: 9998;
  display: flex; align-items: center; justify-content: center;
  background: rgba(11,15,14,.32);
}
.vx-pulse-card {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 22px 26px; border-radius: 20px;
  background: #FAFAF7; border: 1px solid #E4E6E4;
  box-shadow: 0 24px 60px rgba(11,15,14,.28);
  font-family: 'Inter Tight', Inter, system-ui, sans-serif;
}
.vx-pulse-label { font-size: 13px; color: #6B7270; letter-spacing: .01em }
@media (prefers-reduced-motion: reduce) {
  .vx-pulse-beat { animation-duration: 3s }
}
`;

let injected = false;
function usePulseStyles() {
  useEffect(() => {
    if (injected) return;
    const el = document.createElement('style');
    el.id = 'vx-pulse-css';
    el.textContent = CSS;
    document.head.appendChild(el);
    injected = true;
  }, []);
}

export function PulseLoader({
  width = 108,
  color = '#0E7C66',
  duration = 1.5,
}: {
  width?: number;
  color?: string;
  /** Seconds for one sweep. */
  duration?: number;
}) {
  usePulseStyles();

  return (
    <svg
      width={width}
      height={width * 0.4}
      viewBox="0 0 100 40"
      className="vx-pulse"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="vx-pulse-track"
        d={D}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        className="vx-pulse-beat"
        d={D}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={`${SEGMENT} ${LENGTH + SEGMENT}`}
        style={
          {
            '--vx-seg': SEGMENT,
            '--vx-len': LENGTH,
            '--vx-dur': `${duration}s`,
          } as React.CSSProperties
        }
      />
    </svg>
  );
}

/** Blocking wait — dims the page behind a small card. */
export function PulseOverlay({ visible, label }: { visible: boolean; label?: string }) {
  usePulseStyles();
  if (!visible) return null;

  return (
    <div className="vx-pulse-overlay" role="status" aria-live="polite">
      <div className="vx-pulse-card">
        <PulseLoader width={116} />
        {label ? <span className="vx-pulse-label">{label}</span> : null}
      </div>
    </div>
  );
}

/**
 * Mounted once, in main.tsx. Renders the heartbeat for any work announced
 * through `withPulse` / `pulseFor`, from any portal or module.
 */
export function GlobalPulseOverlay() {
  const [state, setState] = useState<{ active: boolean; label?: string }>({ active: false });

  useEffect(() => subscribePulse((active, label) => setState({ active, label })), []);

  return <PulseOverlay visible={state.active} label={state.label} />;
}
