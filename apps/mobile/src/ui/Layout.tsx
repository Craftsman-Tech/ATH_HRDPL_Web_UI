/**
 * ============================================================================
 *  Layout primitives — Vexoo Mobile
 * ============================================================================
 *  SectionHeader — the eyebrow + title + action triplet above every list.
 *  ListRow       — the standard record row (leading slot, content, chips).
 *  EmptyState    — what a list shows when it has nothing, instead of one
 *                  grey sentence floating in the void.
 *  Skeleton      — shimmering placeholders for loading states.
 * ============================================================================
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { radius, spacing } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';
import { T, alpha } from '../theme';
import { Icon, type IconName } from './Icon';
import { Surface } from './Surface';
import { Touchable } from './Touchable';

/**
 * A section divider that carries meaning: a wide-tracked eyebrow over a serif
 * title, with an optional trailing action or count.
 */
export function SectionHeader({
  title,
  eyebrow,
  action,
  onAction,
  accent,
  style,
  tight = false,
}: {
  title: string;
  eyebrow?: string;
  action?: string;
  onAction?: () => void;
  accent?: string;
  style?: StyleProp<ViewStyle>;
  /** Halves the top margin — use when it directly follows another header. */
  tight?: boolean;
}) {
  const { theme } = useTheme();
  const primary = accent ?? theme.primary;

  return (
    <View style={[styles.sectionRow, tight && styles.sectionTight, style]}>
      <View style={styles.sectionText}>
        {eyebrow ? (
          <Text style={[T.eyebrow, { color: primary, marginBottom: 3 }]} numberOfLines={1}>
            {eyebrow}
          </Text>
        ) : null}
        <Text style={[T.h3, { color: theme.text }]} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {action ? (
        onAction ? (
          <Touchable press="sm" onPress={onAction} style={styles.sectionAction}>
            <Text style={[T.captionStrong, { color: primary }]}>{action}</Text>
            <Icon name="chevronRight" size={14} color={primary} strokeWidth={2.4} />
          </Touchable>
        ) : (
          <Text style={[T.captionStrong, { color: theme.textMuted }]}>{action}</Text>
        )
      ) : null}
    </View>
  );
}

/**
 * The workhorse record row: an optional leading element (avatar, token, icon
 * well), a title/subtitle/meta stack, and trailing chips.
 */
export function ListRow({
  leading,
  title,
  subtitle,
  meta,
  trailing,
  chips,
  accent,
  onPress,
  footer,
  style,
}: {
  leading?: React.ReactNode;
  title: string;
  subtitle?: string;
  meta?: string;
  metaTone?: string;
  trailing?: React.ReactNode;
  chips?: React.ReactNode;
  accent?: string;
  onPress?: () => void;
  footer?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();

  return (
    <Surface onPress={onPress} accent={accent} style={[styles.row, style]} radiusSize="xl">
      <View style={styles.rowMain}>
        {leading ? <View style={styles.rowLeading}>{leading}</View> : null}

        <View style={styles.rowBody}>
          <Text style={[T.title, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[T.small, { color: theme.textSecondary, marginTop: 2 }]} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
          {meta ? (
            <Text style={[T.caption, { color: theme.textFaint, marginTop: 5 }]} numberOfLines={1}>
              {meta}
            </Text>
          ) : null}
          {chips ? <View style={styles.chipLine}>{chips}</View> : null}
        </View>

        {trailing ? <View style={styles.rowTrailing}>{trailing}</View> : null}
      </View>

      {footer ? <View style={[styles.rowFooter, { borderTopColor: theme.hairline }]}>{footer}</View> : null}
    </Surface>
  );
}

/**
 * A square, tinted well holding an icon or a short token — the leading slot on
 * queue rows and quick actions.
 */
export function IconWell({
  icon,
  label,
  color,
  size = 44,
}: {
  icon?: IconName;
  label?: string;
  color: string;
  size?: number;
}) {
  const { mode } = useTheme();
  return (
    <View
      style={[
        styles.iconWell,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.29),
          backgroundColor: alpha(color, mode === 'dark' ? 0.2 : 0.11),
        },
      ]}
    >
      {icon ? <Icon name={icon} size={size * 0.45} color={color} strokeWidth={2} /> : null}
      {label ? (
        <Text style={[T.mono, { color, fontSize: size * 0.3 }]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

export function EmptyState({
  icon = 'inbox',
  title,
  message,
  action,
  accent,
}: {
  icon?: IconName;
  title: string;
  message?: string;
  action?: React.ReactNode;
  accent?: string;
}) {
  const { theme, mode } = useTheme();
  const primary = accent ?? theme.primary;

  return (
    <View style={styles.empty}>
      <View style={[styles.emptyWell, { backgroundColor: alpha(primary, mode === 'dark' ? 0.14 : 0.08) }]}>
        <Icon name={icon} size={26} color={primary} strokeWidth={1.7} />
      </View>
      <Text style={[T.title, styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      {message ? (
        <Text style={[T.small, styles.emptyMessage, { color: theme.textMuted }]}>{message}</Text>
      ) : null}
      {action ? <View style={styles.emptyAction}>{action}</View> : null}
    </View>
  );
}

/** A shimmering placeholder block. */
export function Skeleton({
  width = '100%',
  height = 14,
  style,
}: {
  width?: number | `${number}%`;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius.xs, backgroundColor: theme.cardMuted, opacity: pulse },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  sectionRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.xxl,
  },
  sectionTight: {
    marginTop: spacing.lg,
  },
  sectionText: {
    flex: 1,
    minWidth: 0,
  },
  sectionAction: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
    paddingVertical: 4,
  },
  row: {
    marginBottom: spacing.md,
    padding: spacing.lg - 1,
  },
  rowMain: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowLeading: {
    paddingTop: 1,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
  },
  rowTrailing: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  chipLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.sm + 2,
  },
  rowFooter: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  iconWell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  emptyWell: {
    alignItems: 'center',
    borderRadius: radius.xl,
    height: 62,
    justifyContent: 'center',
    width: 62,
  },
  emptyTitle: {
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  emptyMessage: {
    marginTop: 5,
    maxWidth: 300,
    textAlign: 'center',
  },
  emptyAction: {
    marginTop: spacing.lg,
  },
});
