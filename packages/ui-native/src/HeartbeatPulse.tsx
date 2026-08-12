import React, { useEffect, useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

/** Authoring canvas. Matches the native Android view's dp box 1:1. */
const VB_W = 268;
const VB_H = 88;

const HEART_CX = 27;
const HEART_CY = VB_H / 2;
const HEART_SIZE = 40;

const TRACE_X0 = 62;
const TRACE_X1 = VB_W;
const MID_Y = VB_H / 2;
const AMP = 20;

/** One cardiac cycle — ~52 bpm, calm rather than urgent. */
const CYCLE_MS = 1150;
/** Fraction of the trace lit behind the sweep head. */
const TAIL_FRACTION = 0.34;
/** Frame shown when the OS reports reduced-motion: just past the beat. */
const RESTING_PHASE = 0.56;

/**
 * PQRST complex as fractions of the trace width, with vertical offsets in units
 * of AMP (negative is up). Bumps are cubic; the QRS is straight lines.
 */
type Seg =
  | { k: 'L'; x: number; y: number }
  | { k: 'C'; x1: number; y1: number; x2: number; y2: number; x: number; y: number };

const WAVE: Seg[] = [
  { k: 'L', x: 0.16, y: 0 },
  { k: 'C', x1: 0.185, y1: -0.34, x2: 0.225, y2: -0.34, x: 0.25, y: 0 }, // P
  { k: 'L', x: 0.34, y: 0 },
  { k: 'L', x: 0.4, y: 0.22 }, // Q
  { k: 'L', x: 0.5, y: -1.0 }, // R
  { k: 'L', x: 0.575, y: 0.4 }, // S
  { k: 'L', x: 0.625, y: 0 },
  { k: 'L', x: 0.68, y: 0 },
  { k: 'C', x1: 0.725, y1: -0.46, x2: 0.795, y2: -0.46, x: 0.84, y: 0 }, // T
  { k: 'L', x: 1, y: 0 },
];

/** Index into WAVE of the R peak — the instant the heart must contract. */
const R_SEGMENT_INDEX = 4;

const fx = (f: number) => TRACE_X0 + (TRACE_X1 - TRACE_X0) * f;
const fy = (a: number) => MID_Y + AMP * a;

const cubicAt = (
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number,
): number => {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
};

/**
 * Flattens the waveform to a polyline once. Rendering, arc-length lookup and the
 * beat trigger all read from this, so the drawn path and the sweep head can never
 * disagree — which is what `PathMeasure` guaranteed in the Android original.
 */
function buildWave() {
  const xs: number[] = [fx(0)];
  const ys: number[] = [fy(0)];
  let rVertex = 0;

  let cx = 0;
  let cy = 0;
  WAVE.forEach((seg, i) => {
    if (seg.k === 'L') {
      xs.push(fx(seg.x));
      ys.push(fy(seg.y));
    } else {
      const steps = 14; // enough that the bumps read as curves at any sane size
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        xs.push(fx(cubicAt(t, cx, seg.x1, seg.x2, seg.x)));
        ys.push(fy(cubicAt(t, cy, seg.y1, seg.y2, seg.y)));
      }
    }
    if (i === R_SEGMENT_INDEX) rVertex = xs.length - 1;
    cx = seg.x;
    cy = seg.y;
  });

  const cum: number[] = [0];
  for (let i = 1; i < xs.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]));
  }
  const total = cum[cum.length - 1];

  let d = `M${xs[0].toFixed(2)},${ys[0].toFixed(2)}`;
  for (let i = 1; i < xs.length; i++) {
    d += `L${xs[i].toFixed(2)},${ys[i].toFixed(2)}`;
  }

  return { xs, ys, cum, total, d, beatPhase: cum[rVertex] / total };
}

/** Two-lobe heart, authored in a unit box and mapped onto the canvas. */
function buildHeart() {
  const s = HEART_SIZE;
  const x = HEART_CX - s / 2;
  const y = HEART_CY - (s * 0.92) / 2;
  const px = (u: number) => (x + u * s).toFixed(2);
  const py = (v: number) => (y + v * s * 0.92).toFixed(2);
  return (
    `M${px(0.5)},${py(0.3)}` +
    `C${px(0.5)},${py(0.1)} ${px(0.2)},${py(0.04)} ${px(0.1)},${py(0.28)}` +
    `C${px(0.02)},${py(0.46)} ${px(0.14)},${py(0.66)} ${px(0.5)},${py(0.96)}` +
    `C${px(0.86)},${py(0.66)} ${px(0.98)},${py(0.46)} ${px(0.9)},${py(0.28)}` +
    `C${px(0.8)},${py(0.04)} ${px(0.5)},${py(0.1)} ${px(0.5)},${py(0.3)}Z`
  );
}

const withAlpha = (hex: string, alpha: number) => {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export interface HeartbeatPulseProps {
  /** Bright accent — trace, rings, sweep head. */
  accent?: string;
  /** Deep brand tone — heart gradient end and the resting trace. */
  deep?: string;
  /** Rendered height in dp. Width fills the parent and the canvas scales to fit. */
  height?: number;
  style?: StyleProp<ViewStyle>;
  /** Announced to screen readers while the loader is on screen. */
  accessibilityLabel?: string;
}

/**
 * The Vexoo loading signature — an ECG monitor strip instead of a spinner.
 *
 * A trace sweeps the width of the strip leaving a fading tail, and the heart on
 * the left lands its lub-dub exactly as the sweep crosses the R spike. The beat
 * is derived from the measured arc length to that spike, so the two halves stay
 * locked together at any width.
 *
 * This is the React Native port of the Android `HeartbeatPulseView`; the
 * waveform coordinates, tail fraction and beat keyframes are identical, so iOS,
 * Android and the native client all animate the same.
 */
export function HeartbeatPulse({
  accent = '#1FBFA0',
  deep = '#0E7C66',
  height = 88,
  style,
  accessibilityLabel = 'Loading',
}: HeartbeatPulseProps) {
  const wave = useMemo(buildWave, []);
  const heartPath = useMemo(buildHeart, []);
  const reduceMotion = useReducedMotion();

  const phase = useSharedValue(reduceMotion ? RESTING_PHASE : 0);

  useEffect(() => {
    if (reduceMotion) {
      phase.value = RESTING_PHASE;
      return;
    }
    phase.value = 0;
    phase.value = withRepeat(
      withTiming(1, { duration: CYCLE_MS, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(phase);
  }, [reduceMotion, phase]);

  const { xs, ys, cum, total, beatPhase } = wave;

  /** Point at an arc-length distance along the flattened polyline. */
  const pointAt = (distance: number) => {
    'worklet';
    const d = Math.max(0, Math.min(distance, total));
    let hi = cum.length - 1;
    let lo = 0;
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= d) lo = mid;
      else hi = mid;
    }
    const span = cum[hi] - cum[lo];
    const t = span > 0 ? (d - cum[lo]) / span : 0;
    return { x: xs[lo] + (xs[hi] - xs[lo]) * t, y: ys[lo] + (ys[hi] - ys[lo]) * t };
  };

  const headProps = useAnimatedProps(() => {
    const p = pointAt(phase.value * total);
    return { cx: p.x, cy: p.y };
  });

  const beatProps = useAnimatedProps(() => {
    const t = (phase.value - beatPhase + 1) % 1;
    // Lub, then a smaller dub before the muscle has fully relaxed, then rest.
    const scale = interpolate(
      t,
      [0, 0.05, 0.12, 0.17, 0.3, 1],
      [1, 1.26, 1.04, 1.15, 1, 1],
    );
    return { scale };
  });

  // Two rings, the second trailing the first. Written out rather than generated in
  // a loop so the hooks stay unconditional and in a fixed order.
  const ringOuter = useAnimatedProps(() => {
    const t = ((phase.value - beatPhase + 1) % 1) - 0;
    if (t <= 0 || t >= 1) return { r: HEART_SIZE / 2, opacity: 0 };
    return { r: HEART_SIZE / 2 + (1 - (1 - t) * (1 - t)) * 20, opacity: (1 - t) * (1 - t) * 0.6 };
  });
  const ringInner = useAnimatedProps(() => {
    const t = ((phase.value - beatPhase + 1) % 1) - 0.16;
    if (t <= 0 || t >= 1) return { r: HEART_SIZE / 2, opacity: 0 };
    return { r: HEART_SIZE / 2 + (1 - (1 - t) * (1 - t)) * 20, opacity: (1 - t) * (1 - t) * 0.6 };
  });

  return (
    <View style={[{ width: '100%', height }, style]} accessibilityRole="progressbar" accessibilityLabel={accessibilityLabel}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet">
        <Defs>
          <LinearGradient id="vexooHeart" x1="0" y1={HEART_CY - HEART_SIZE / 2} x2="0" y2={HEART_CY + HEART_SIZE / 2} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={accent} />
            <Stop offset="1" stopColor={deep} />
          </LinearGradient>
        </Defs>

        {/* Resting trace the sweep travels along. */}
        <Path d={wave.d} stroke={withAlpha(deep, 0.16)} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Lit tail. Three dashed copies of the same path with the same animated
            offset — widest and faintest first — read as one fading trail. */}
        <TailLayer d={wave.d} total={total} phase={phase} fraction={TAIL_FRACTION} width={7} color={withAlpha(accent, 0.18)} />
        <TailLayer d={wave.d} total={total} phase={phase} fraction={TAIL_FRACTION * 0.66} width={3.4} color={withAlpha(accent, 0.5)} />
        <TailLayer d={wave.d} total={total} phase={phase} fraction={TAIL_FRACTION * 0.33} width={2.6} color={accent} />

        {/* Sweep head. */}
        <AnimatedCircle animatedProps={headProps} r={7} fill={withAlpha(accent, 0.18)} />
        <AnimatedCircle animatedProps={headProps} r={3.2} fill="#FFFFFF" />
        <AnimatedCircle animatedProps={headProps} r={2.1} fill={accent} />

        {/* Rings released on the beat. */}
        <AnimatedCircle animatedProps={ringOuter} cx={HEART_CX} cy={HEART_CY} fill="none" stroke={accent} strokeWidth={1.4} />
        <AnimatedCircle animatedProps={ringInner} cx={HEART_CX} cy={HEART_CY} fill="none" stroke={accent} strokeWidth={1.4} />

        <AnimatedG animatedProps={beatProps} origin={`${HEART_CX}, ${HEART_CY}`}>
          <Path d={heartPath} fill="url(#vexooHeart)" />
        </AnimatedG>
      </Svg>
    </View>
  );
}

/**
 * One dashed copy of the trace. `strokeDasharray=[lit, total]` leaves exactly one
 * dash on the path; shifting the offset walks it along. Unlike the Android
 * original the tail does not wrap around the end of the strip — it enters cleanly
 * from the left instead, which reads better than a seam at the join.
 */
function TailLayer({
  d,
  total,
  phase,
  fraction,
  width,
  color,
}: {
  d: string;
  total: number;
  phase: SharedValue<number>;
  fraction: number;
  width: number;
  color: string;
}) {
  const lit = total * fraction;
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: lit - phase.value * total,
  }));
  return (
    <AnimatedPath
      d={d}
      animatedProps={animatedProps}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray={[lit, total]}
    />
  );
}

export default HeartbeatPulse;
