/**
 * ============================================================================
 *  Surface / Card / Well — Vexoo Mobile
 * ============================================================================
 *  Three ground levels, the same three the web portals use:
 *
 *    Well    — recessed. Inputs, read-only field displays, nested detail.
 *    Card    — raised. The default container for a row or a group.
 *    Panel   — floating. Sheets, menus, popovers.
 *
 *  Depth in light mode comes from a soft shadow; in dark mode a black shadow
 *  is invisible against a near-black ground, so the same components lift by
 *  brightening the surface and tightening the hairline instead. Both paths are
 *  handled here so screens never have to think about it.
 * ============================================================================
 */
import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { radius, spacing } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';
import { elevation, type ElevationLevel } from '../theme';
import { Touchable } from './Touchable';

export interface SurfaceProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Visual level. Defaults to 'card'. */
  variant?: 'well' | 'card' | 'panel' | 'ghost';
  /** Override the shadow depth. */
  lift?: ElevationLevel;
  /** Draw the hairline border. Cards do by default; wells always do. */
  bordered?: boolean;
  /** Inner padding. `false` for zero. */
  padded?: boolean;
  radiusSize?: keyof typeof radius;
  /** Tints the left edge with an accent rail — used for "needs attention" rows. */
  accent?: string;
  onPress?: () => void;
}

export function Surface({
  children,
  style,
  variant = 'card',
  lift,
  bordered,
  padded = true,
  radiusSize = 'xl',
  accent,
  onPress,
}: SurfaceProps) {
  const { theme, mode } = useTheme();

  const level: ElevationLevel =
    lift ?? (variant === 'panel' ? 'lg' : variant === 'card' ? 'sm' : 'none');

  const background =
    variant === 'well'  ? theme.bgSunken
    : variant === 'ghost' ? 'transparent'
    : variant === 'panel' ? theme.card
    : theme.card;

  const showBorder = bordered ?? variant !== 'ghost';

  const base: StyleProp<ViewStyle> = [
    {
      backgroundColor: background,
      borderRadius: radius[radiusSize],
      borderWidth: showBorder ? StyleSheet.hairlineWidth * 2 : 0,
      borderColor: variant === 'well' ? theme.hairline : theme.border,
      overflow: accent ? 'hidden' : 'visible',
    },
    padded && { padding: spacing.lg },
    elevation(level, mode),
    style,
  ];

  const content = (
    <>
      {accent ? <View style={[styles.rail, { backgroundColor: accent }]} /> : null}
      {children}
    </>
  );

  if (onPress) {
    return (
      <Touchable style={base} press="sm" onPress={onPress}>
        {content}
      </Touchable>
    );
  }

  return <View style={base}>{content}</View>;
}

/** A recessed container — the mobile equivalent of the web's `--surface` wells. */
export function Well(props: Omit<SurfaceProps, 'variant'>) {
  return <Surface {...props} variant="well" radiusSize={props.radiusSize ?? 'lg'} />;
}

/** A hairline divider that respects the theme. */
export function Divider({ style, inset = 0 }: { style?: StyleProp<ViewStyle>; inset?: number }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        { height: StyleSheet.hairlineWidth * 2, backgroundColor: theme.hairline, marginLeft: inset },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  rail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
});
