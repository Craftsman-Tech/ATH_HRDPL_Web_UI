/**
 * ============================================================================
 *  InkPanel — Vexoo Mobile
 * ============================================================================
 *  The signature dark surface. On web it's the portal sidebar and the sign-in
 *  brand panel, and it's built from three stacked layers:
 *
 *    .dr-sidebar         background: #0B0F0E
 *    .dr-sidebar::before 40px grid of 3.5%-white hairlines
 *    .dr-sidebar::after  a 380px mineral orb at 22%, blurred 80px
 *
 *  React Native has no `filter: blur()`, so the orbs are drawn as SVG radial
 *  gradients instead — which is what a blurred circle approximates anyway, and
 *  it composites on the GPU for free.
 *
 *  This is what stops the dark chrome reading as a flat navy rectangle.
 * ============================================================================
 */
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, Line, RadialGradient, Rect, Stop } from 'react-native-svg';
import { alpha } from '../theme';

export interface InkPanelProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Base ink. Defaults to the brand ink-900. */
  color?: string;
  /** Orb tint — each portal glows in its own accent. */
  accent?: string;
  /** Draw the hairline grid. */
  grid?: boolean;
  /** Orb placement. 'top' suits headers, 'corner' suits tall panels. */
  glowPosition?: 'top' | 'corner' | 'none';
  /** Rough panel height, used to size the SVG canvas. */
  height?: number;
  /**
   * Makes the content wrapper fill the panel. Needed when the panel is itself
   * a flex container and its children rely on that height — the NavDrawer's
   * footer pins to the bottom via a flexed nav list, which collapses without
   * this. Headers leave it off so they hug their content.
   */
  fill?: boolean;
}

const GRID_STEP = 40;

export function InkPanel({
  children,
  style,
  color = '#0B0F0E',
  accent = '#0E7C66',
  grid = true,
  glowPosition = 'top',
  height = 320,
  fill = false,
}: InkPanelProps) {
  // The canvas is generously oversized so the gradients stay soft when the
  // panel is wider than expected; it's clipped by the parent's overflow.
  const W = 460;
  const H = Math.max(height, 160);

  const orbs =
    glowPosition === 'none'
      ? []
      : glowPosition === 'top'
        ? [
            { cx: W * 0.86, cy: -20,      r: 240, color: accent,   opacity: 0.34 },
            { cx: W * 0.06, cy: H * 0.95, r: 190, color: '#1FBFA0', opacity: 0.15 },
          ]
        : [
            { cx: -40,      cy: -60,      r: 260, color: accent,   opacity: 0.3 },
            { cx: W * 0.95, cy: H * 1.02, r: 200, color: '#1FBFA0', opacity: 0.12 },
          ];

  return (
    <View style={[styles.root, { backgroundColor: color }, style]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
          <Defs>
            {orbs.map((orb, i) => (
              <RadialGradient key={i} id={`orb${i}`} cx="50%" cy="50%" r="50%">
                <Stop offset="0%"   stopColor={orb.color} stopOpacity={orb.opacity} />
                <Stop offset="55%"  stopColor={orb.color} stopOpacity={orb.opacity * 0.4} />
                <Stop offset="100%" stopColor={orb.color} stopOpacity={0} />
              </RadialGradient>
            ))}
          </Defs>

          {/* Hairline grid — the texture that keeps the ink from going flat. */}
          {grid ? (
            <>
              {Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => (
                <Line
                  key={`v${i}`}
                  x1={i * GRID_STEP} y1={0} x2={i * GRID_STEP} y2={H}
                  stroke={alpha('#FFFFFF', 0.035)} strokeWidth={1}
                />
              ))}
              {Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => (
                <Line
                  key={`h${i}`}
                  x1={0} y1={i * GRID_STEP} x2={W} y2={i * GRID_STEP}
                  stroke={alpha('#FFFFFF', 0.035)} strokeWidth={1}
                />
              ))}
            </>
          ) : null}

          {orbs.map((orb, i) => (
            <Rect
              key={i}
              x={orb.cx - orb.r}
              y={orb.cy - orb.r}
              width={orb.r * 2}
              height={orb.r * 2}
              fill={`url(#orb${i})`}
            />
          ))}
        </Svg>
      </View>

      <View style={[styles.content, fill && styles.contentFill]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  contentFill: {
    flex: 1,
  },
});
