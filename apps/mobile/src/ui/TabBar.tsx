/**
 * ============================================================================
 *  TabBar — Vexoo Mobile
 * ============================================================================
 *  The bottom navigation. Previously each tab was a 24×5 coloured rectangle
 *  above a label — a placeholder that never got replaced — so the bar read as
 *  a wireframe.
 *
 *  Now: real icons, a tinted well behind the active one, and the top hairline
 *  plus safe-area inset that make it sit on the screen edge properly.
 * ============================================================================
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';
import { T, alpha, elevation } from '../theme';
import { Icon, type IconName } from './Icon';
import { Touchable } from './Touchable';

export interface TabItem<T extends string> {
  value: T;
  label: string;
  icon: IconName;
  badge?: number;
}

export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  accent,
}: {
  tabs: TabItem<T>[];
  active: T;
  onChange: (value: T) => void;
  accent?: string;
}) {
  const { theme, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const primary = accent ?? theme.primary;

  return (
    <View
      style={[
        styles.bar,
        elevation('lg', mode),
        {
          backgroundColor: theme.card,
          borderTopColor: theme.hairline,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
    >
      {tabs.map((tab) => {
        const selected = tab.value === active;
        return (
          <Touchable
            key={tab.value}
            press="sm"
            onPress={() => onChange(tab.value)}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={tab.label}
          >
            <View
              style={[
                styles.well,
                selected && { backgroundColor: alpha(primary, mode === 'dark' ? 0.2 : 0.11) },
              ]}
            >
              <Icon
                name={tab.icon}
                size={20}
                color={selected ? primary : theme.textMuted}
                strokeWidth={selected ? 2.2 : 1.8}
              />
              {tab.badge ? (
                <View style={[styles.dot, { backgroundColor: theme.statusText.danger, borderColor: theme.card }]} />
              ) : null}
            </View>
            <Text
              style={[T.tab, { color: selected ? primary : theme.textMuted }]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Touchable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    flexDirection: 'row',
    paddingTop: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    gap: 3,
    paddingHorizontal: 2,
  },
  well: {
    alignItems: 'center',
    borderRadius: radius.md,
    height: 32,
    justifyContent: 'center',
    width: 52,
  },
  dot: {
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 9,
    position: 'absolute',
    right: 12,
    top: 3,
    width: 9,
  },
});
