/**
 * ============================================================================
 *  Chip / Tag / Badge — Vexoo Mobile
 * ============================================================================
 *  Status chips are the densest signal in a clinical UI — a queue row can
 *  carry priority, state and risk at once — so they're deliberately quiet:
 *  a tinted capsule, uppercase micro-text, and an optional dot. No borders,
 *  no shadows, nothing that competes with the row's own title.
 *
 *  `tone` maps onto the paired statusBg/statusText tokens so a chip is legible
 *  on card and panel grounds in both themes.
 * ============================================================================
 */
import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, spacing } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';
import { T, alpha } from '../theme';
import { Icon, type IconName } from './Icon';

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';

/**
 * Infers a tone from free-text status strings ("Urgent", "Completed", …).
 * The portals carry status as display text rather than enums, so this keeps
 * colour consistent without a migration.
 */
export function toneFor(value: string): Tone {
  const v = value.toLowerCase();
  if (/urgent|critical|high|emergency|overdue|failed|rejected|expired|out of stock/.test(v)) return 'danger';
  if (/waiting|pending|scheduled|medium|low stock|due|hold|review/.test(v))                  return 'warning';
  if (/completed|done|active|paid|ready|approved|in stock|normal|verified|low/.test(v))      return 'success';
  if (/consultation|processing|dispensing|in progress|transit/.test(v))                      return 'purple';
  if (/new|info|draft|requested|booked/.test(v))                                             return 'info';
  return 'neutral';
}

export interface ChipProps {
  label: string;
  tone?: Tone;
  /** Show a leading status dot. */
  dot?: boolean;
  icon?: IconName;
  /** Force a specific colour (role accents). Overrides `tone`. */
  color?: string;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export function Chip({ label, tone, dot = false, icon, color, size = 'md', style }: ChipProps) {
  const { theme, mode } = useTheme();
  const key = tone ?? toneFor(label);

  const fg = color ?? theme.statusText[key];
  const bg = color ? alpha(color, mode === 'dark' ? 0.18 : 0.1) : theme.statusBg[key];

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: bg,
          paddingHorizontal: size === 'sm' ? spacing.sm : spacing.md - 2,
          paddingVertical: size === 'sm' ? 3 : 5,
        },
        style,
      ]}
    >
      {dot ? <View style={[styles.dot, { backgroundColor: fg }]} /> : null}
      {icon ? <Icon name={icon} size={11} color={fg} strokeWidth={2.4} /> : null}
      <Text style={[T.chip, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/**
 * A count badge — nav items, unread markers. Sits on ink or paper equally.
 */
export function Badge({ value, color, muted = false }: { value: number | string; color?: string; muted?: boolean }) {
  const { theme } = useTheme();
  const bg = muted ? theme.statusBg.neutral : color ?? theme.statusText.danger;
  const fg = muted ? theme.textMuted : '#FAFAF7';
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[T.chip, { color: fg, letterSpacing: 0 }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    borderRadius: radius.pill,
    height: 5,
    width: 5,
  },
  badge: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 19,
    justifyContent: 'center',
    minWidth: 19,
    paddingHorizontal: 5,
  },
});
