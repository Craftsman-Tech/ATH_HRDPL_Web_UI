/**
 * ============================================================================
 *  Segmented / Pills — Vexoo Mobile
 * ============================================================================
 *  Two switchers:
 *
 *    <Segmented>  — equal-width tabs inside a well, with an indicator that
 *                   SLIDES between positions instead of snapping. Use when
 *                   there are 2-4 options and they all fit.
 *
 *    <PillRow>    — a horizontally scrolling strip of pills. Use for the long
 *                   filter rails (statuses, dates, departments) that the
 *                   portals lean on.
 *
 *  The old consultation tabs were fixed-width buttons that clipped their
 *  labels at five items; both of these handle overflow properly.
 * ============================================================================
 */
import React, { useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { radius, spacing } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';
import { T, alpha, elevation } from '../theme';
import { Icon, type IconName } from './Icon';
import { Touchable } from './Touchable';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: IconName;
  badge?: number;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  accent,
  style,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accent?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme, mode } = useTheme();
  const [width, setWidth] = useState(0);
  const slide = useRef(new Animated.Value(0)).current;
  const primary = accent ?? theme.primary;

  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const itemWidth = width ? (width - 8) / options.length : 0;

  React.useEffect(() => {
    Animated.spring(slide, {
      toValue: index,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  }, [index, slide]);

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.segmented, { backgroundColor: theme.bgSunken, borderColor: theme.hairline }, style]}
    >
      {itemWidth > 0 ? (
        <Animated.View
          style={[
            styles.indicator,
            elevation('xs', mode),
            {
              width: itemWidth,
              backgroundColor: theme.card,
              transform: [
                {
                  translateX: slide.interpolate({
                    inputRange: options.map((_, i) => i),
                    outputRange: options.map((_, i) => i * itemWidth),
                  }),
                },
              ],
            },
          ]}
        />
      ) : null}

      {options.map((option) => {
        const active = option.value === value;
        return (
          <Touchable
            key={option.value}
            press="none"
            onPress={() => onChange(option.value)}
            style={styles.segment}
          >
            <View style={styles.segmentInner}>
              {option.icon ? (
                <Icon
                  name={option.icon}
                  size={14}
                  color={active ? primary : theme.textMuted}
                  strokeWidth={2.2}
                />
              ) : null}
              <Text
                style={[T.captionStrong, { color: active ? theme.text : theme.textMuted }]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
              {option.badge ? (
                <View style={[styles.segBadge, { backgroundColor: alpha(primary, 0.16) }]}>
                  <Text style={[T.chip, { color: primary, letterSpacing: 0 }]}>{option.badge}</Text>
                </View>
              ) : null}
            </View>
          </Touchable>
        );
      })}
    </View>
  );
}

export function PillRow<T extends string>({
  options,
  value,
  onChange,
  accent,
  contentStyle,
}: {
  options: (SegmentedOption<T> & { sub?: string })[];
  value: T;
  onChange: (value: T) => void;
  accent?: string;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { theme, mode } = useTheme();
  const primary = accent ?? theme.primary;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.pillRow, contentStyle]}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Touchable
            key={option.value}
            press="sm"
            onPress={() => onChange(option.value)}
            style={[
              styles.pill,
              {
                backgroundColor: active ? primary : theme.card,
                borderColor: active ? primary : theme.border,
              },
            ]}
          >
            <View style={styles.pillInner}>
              {option.icon ? (
                <Icon
                  name={option.icon}
                  size={14}
                  color={active ? '#FAFAF7' : theme.textMuted}
                  strokeWidth={2.2}
                />
              ) : null}
              <View>
                <Text
                  style={[T.captionStrong, { color: active ? '#FAFAF7' : theme.text }]}
                  numberOfLines={1}
                >
                  {option.label}
                </Text>
                {option.sub ? (
                  <Text
                    style={[
                      T.caption,
                      { color: active ? alpha('#FAFAF7', 0.75) : theme.textFaint, fontSize: 11 },
                    ]}
                    numberOfLines={1}
                  >
                    {option.sub}
                  </Text>
                ) : null}
              </View>
              {option.badge ? (
                <View
                  style={[
                    styles.segBadge,
                    { backgroundColor: active ? alpha('#FAFAF7', 0.22) : alpha(primary, mode === 'dark' ? 0.22 : 0.13) },
                  ]}
                >
                  <Text style={[T.chip, { color: active ? '#FAFAF7' : primary, letterSpacing: 0 }]}>
                    {option.badge}
                  </Text>
                </View>
              ) : null}
            </View>
          </Touchable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  segmented: {
    borderRadius: radius.md + 2,
    borderWidth: StyleSheet.hairlineWidth * 2,
    flexDirection: 'row',
    padding: 4,
    position: 'relative',
  },
  indicator: {
    borderRadius: radius.sm,
    bottom: 4,
    left: 4,
    position: 'absolute',
    top: 4,
  },
  segment: {
    flex: 1,
  },
  segmentInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm + 1,
  },
  segBadge: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 17,
    justifyContent: 'center',
    minWidth: 17,
    paddingHorizontal: 4,
  },
  pillRow: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  pill: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm + 2,
  },
  pillInner: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
