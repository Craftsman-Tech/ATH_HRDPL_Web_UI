/**
 * ============================================================================
 *  PulseLoader — the Vexoo "waiting" signal
 * ============================================================================
 *  A heartbeat traced across an ECG monitor. This is the one loading affordance
 *  the portals use: switching modules, exporting a PDF, picking a file. A
 *  generic spinner says "something is happening"; on a clinical product the
 *  heartbeat says it in the product's own language.
 *
 *  Deliberately NOT used for app launch — that moment belongs to the V mark
 *  (see App.tsx). Identity on cold start, vitals for everything after.
 *
 *  Two layers, which is what sells the monitor read:
 *    1. the full trace, dimmed — the "screen" the beat runs across
 *    2. a bright segment swept along that exact path via strokeDashoffset
 *  Both share one point list, so the geometry can never drift between them and
 *  the dash length is exact rather than eyeballed.
 * ============================================================================
 */
import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../components/AppContexts';
import { T } from '../theme';
import { subscribePulse } from './pulseBus';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * One PQRST beat on a 100×40 grid: flat lead-in, P bump, Q dip, R spike,
 * S trough, back to baseline, T bump, flat lead-out.
 */
const POINTS: ReadonlyArray<readonly [number, number]> = [
  [0, 20], [30, 20], [34, 16], [38, 20], [42, 24],
  [46, 4], [50, 30], [54, 20], [60, 15], [66, 20], [100, 20],
];

const D = `M${POINTS.map(([x, y]) => `${x} ${y}`).join('L')}`;

/** Exact path length — every segment is a straight line, so this is not an estimate. */
const LENGTH = POINTS.reduce(
  (total, point, i) =>
    i === 0 ? 0 : total + Math.hypot(point[0] - POINTS[i - 1][0], point[1] - POINTS[i - 1][1]),
  0,
);

/** Visible fraction of the trace that sweeps. */
const SEGMENT = LENGTH * 0.3;

export function PulseLoader({
  width = 108,
  color,
  duration = 1500,
  style,
}: {
  width?: number;
  color?: string;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  const stroke = color ?? theme.primary;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(progress);
  }, [duration, progress]);

  // Sweeps the lit segment from before the start to past the end, so the beat
  // enters and leaves the screen instead of popping in place.
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: SEGMENT - progress.value * (LENGTH + SEGMENT),
  }));

  return (
    <View style={style}>
      <Svg width={width} height={width * 0.4} viewBox="0 0 100 40">
        <Path
          d={D}
          stroke={stroke}
          strokeOpacity={0.18}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <AnimatedPath
          animatedProps={animatedProps}
          d={D}
          stroke={stroke}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={[SEGMENT, LENGTH + SEGMENT]}
        />
      </Svg>
    </View>
  );
}

/**
 * Blocking wait — dims the screen behind a small card. Use when the user must
 * not act until the work finishes (exporting, sharing, switching module).
 */
export function PulseOverlay({
  visible,
  label,
  accent,
}: {
  visible: boolean;
  label?: string;
  accent?: string;
}) {
  const { theme } = useTheme();
  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <PulseLoader width={116} color={accent} />
        {label ? (
          <Text style={[T.small, styles.label, { color: theme.textMuted }]}>{label}</Text>
        ) : null}
      </View>
    </View>
  );
}

/**
 * Mounted once, in App.tsx. Renders the heartbeat for any work announced
 * through `withPulse` / `pulseFor`, wherever in the app it was started.
 */
export function GlobalPulseOverlay() {
  const [state, setState] = useState<{ active: boolean; label?: string }>({ active: false });

  useEffect(() => subscribePulse((active, label) => setState({ active, label })), []);

  return <PulseOverlay visible={state.active} label={state.label} />;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(11,15,14,0.32)',
    justifyContent: 'center',
    zIndex: 90,
  },
  card: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 26,
    paddingVertical: 22,
  },
  label: {
    letterSpacing: 0.2,
    marginTop: 6,
  },
});
