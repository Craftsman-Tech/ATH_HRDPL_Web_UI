/**
 * ============================================================================
 *  StatTile — Vexoo Mobile
 * ============================================================================
 *  The KPI tile used at the top of every portal dashboard.
 *
 *  The old version stacked a coloured bar, an uppercase label, a number and a
 *  caption — four left-aligned elements of similar weight, which read as flat.
 *  This one gives the number the Fraunces display face at 30pt and demotes
 *  everything else, so a glance lands on the figure. The icon sits in a tinted
 *  well top-right, mirroring the web dashboard cards.
 * ============================================================================
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';
import { T, alpha } from '../theme';
import { Icon, type IconName } from './Icon';
import { Surface } from './Surface';

export interface StatTileProps {
  label: string;
  value: string | number;
  /** Supporting line under the value. */
  detail?: string;
  icon?: IconName;
  /** Accent for the icon well and the delta. Defaults to the theme primary. */
  color?: string;
  /** Period-over-period movement, e.g. "+12%". */
  delta?: string;
  deltaDirection?: 'up' | 'down';
  onPress?: () => void;
  /** Two per row (default) or full width. */
  wide?: boolean;
}

export function StatTile({
  label,
  value,
  detail,
  icon,
  color,
  delta,
  deltaDirection = 'up',
  onPress,
  wide = false,
}: StatTileProps) {
  const { theme, mode } = useTheme();
  const accent = color ?? theme.primary;
  const deltaColor = deltaDirection === 'up' ? theme.statusText.success : theme.statusText.danger;

  return (
    <Surface
      onPress={onPress}
      style={[styles.tile, wide ? styles.wide : styles.half]}
      radiusSize="xl"
    >
      <View style={styles.head}>
        <Text style={[T.label, styles.label, { color: theme.textMuted }]} numberOfLines={2}>
          {label}
        </Text>
        {icon ? (
          <View style={[styles.well, { backgroundColor: alpha(accent, mode === 'dark' ? 0.2 : 0.11) }]}>
            <Icon name={icon} size={15} color={accent} strokeWidth={2} />
          </View>
        ) : null}
      </View>

      <View style={styles.valueRow}>
        <Text style={[T.numeral, { color: theme.text }]} numberOfLines={1}>
          {value}
        </Text>
        {delta ? (
          <View style={styles.delta}>
            <Icon
              name={deltaDirection === 'up' ? 'trendingUp' : 'trendingDown'}
              size={12}
              color={deltaColor}
              strokeWidth={2.4}
            />
            <Text style={[T.captionStrong, { color: deltaColor }]}>{delta}</Text>
          </View>
        ) : null}
      </View>

      {detail ? (
        <Text style={[T.caption, styles.detail, { color: theme.textFaint }]} numberOfLines={2}>
          {detail}
        </Text>
      ) : null}
    </Surface>
  );
}

/** Lays out tiles on the standard two-column grid. */
export function StatGrid({ children }: { children: React.ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    minHeight: 128,
    padding: spacing.lg - 1,
  },
  half: {
    // `minWidth` is what actually guarantees two-up on a phone. A percentage
    // flexBasis alone does not reliably resolve inside a wrapping row in Yoga
    // — the tiles collapsed to their content size and packed three across,
    // truncating labels to "IN-H…" / "READ Y". A 150pt floor means three can
    // never fit on a phone-width row, while flexGrow still stretches the pair
    // edge to edge. On a tablet three or four fit, which is what we want.
    flexBasis: '47%',
    flexGrow: 1,
    flexShrink: 0,
    minWidth: 150,
  },
  wide: {
    width: '100%',
  },
  head: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    paddingTop: 3,
  },
  well: {
    alignItems: 'center',
    borderRadius: radius.sm,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  valueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  delta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  detail: {
    marginTop: 2,
  },
});
