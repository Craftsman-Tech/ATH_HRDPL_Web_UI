import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { mineral, mineralPalette } from '@vexoo/shared';
import { Icon } from './Icon';

/**
 * Mineral / ink design primitives.
 *
 * These are the mobile counterpart of the web portal's PatientCSS.ts. Every
 * customer screen composes from here rather than writing raw styles, so a change
 * to card radius or shadow lands everywhere at once.
 */

// ── Type ─────────────────────────────────────────────────────────────────────

type TextTone = 'heading' | 'body' | 'secondary' | 'muted' | 'inverse' | 'brand';

const TONE: Record<TextTone, string> = {
  heading: mineral.heading,
  body: mineral.text,
  secondary: mineral.textSecondary,
  muted: mineral.textMuted,
  inverse: '#FFFFFF',
  brand: mineral.primary,
};

export interface TxtProps {
  children?: React.ReactNode;
  size?: number;
  tone?: TextTone;
  weight?: '400' | '500' | '600' | '700';
  /** Tabular figures for IDs, amounts and readings. */
  mono?: boolean;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

export function Txt({
  children,
  size = 13,
  tone = 'body',
  weight = '400',
  mono = false,
  center = false,
  style,
  numberOfLines,
}: TxtProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize: size,
          color: TONE[tone],
          fontWeight: weight,
          lineHeight: Math.round(size * 1.35),
        },
        mono && { fontVariant: ['tabular-nums'] as TextStyle['fontVariant'] },
        center && { textAlign: 'center' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

/** Small all-caps label above a group. */
export function Eyebrow({ children, color = mineral.textMuted }: { children?: React.ReactNode; color?: string }) {
  return (
    <Text style={{ fontSize: 10, letterSpacing: 1.3, fontWeight: '700', color, textTransform: 'uppercase' }}>
      {children}
    </Text>
  );
}

// ── Surfaces ─────────────────────────────────────────────────────────────────

/** Standard content card: hairline border, soft shadow, 18px radius. */
export function Card({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Dark mineral hero — the gradient used for the dashboard and drawer header. */
export function Hero({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient
      colors={[mineral.heroFrom, mineral.heroTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.hero, style]}
    >
      {children}
    </LinearGradient>
  );
}

/** Section heading with the tinted initial chip. */
export function Section({ title, icon }: { title: string; icon?: string }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionChip}>
        {icon ? (
          <Icon name={icon} size={16} color={mineral.primary} />
        ) : (
          <Text style={{ color: mineral.primary, fontWeight: '700', fontSize: 13 }}>
            {title.slice(0, 1).toUpperCase()}
          </Text>
        )}
      </View>
      <Txt size={17} weight="700" tone="heading">
        {title}
      </Txt>
    </View>
  );
}

/** Rounded tinted square holding an icon — used on every list row. */
export function IconChip({
  icon,
  color = mineral.primary,
  bg = mineral.primaryLight,
  size = 40,
}: {
  icon: string;
  color?: string;
  bg?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name={icon} size={size * 0.45} color={color} />
    </View>
  );
}

export function Badge({
  children,
  color = mineral.statusText.success,
  bg = mineral.statusBg.success,
}: {
  children?: React.ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 }}>
      <Text style={{ color, fontSize: 10.5, fontWeight: '700' }}>{children}</Text>
    </View>
  );
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <LinearGradient
      colors={[mineral.primaryBright, mineral.primaryDeep]}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: size * 0.34 }}>{initials}</Text>
    </LinearGradient>
  );
}

/** Horizontal progress bar used by wellness, coverage and adherence. */
export function Bar({ pct, color = mineral.primary }: { pct: number; color?: string }) {
  return (
    <View style={styles.barTrack}>
      <View style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: '100%', borderRadius: 4, backgroundColor: color }} />
    </View>
  );
}

// ── Controls ─────────────────────────────────────────────────────────────────

export interface BtnProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'light' | 'danger';
  icon?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Btn({ label, onPress, variant = 'primary', icon, disabled, style }: BtnProps) {
  const solid = variant === 'primary' || variant === 'danger';
  const bg =
    variant === 'primary' ? mineral.primary
    : variant === 'danger' ? mineralPalette.coral
    : variant === 'light' ? '#FFFFFF'
    : '#FFFFFF';
  const fg = solid ? '#FFFFFF' : variant === 'light' ? mineral.primaryDeep : mineral.primaryDeep;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === 'outline' && { borderWidth: 1, borderColor: mineral.border },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={16} color={fg} /> : null}
      <Text style={{ color: fg, fontSize: 15, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

export interface FieldProps {
  value: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  label?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  editable?: boolean;
  onPress?: () => void;
  multiline?: boolean;
}

export function Field({ value, onChangeText, placeholder, label, secureTextEntry, keyboardType, editable = true, onPress, multiline }: FieldProps) {
  const input = (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={mineral.textMuted}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      editable={editable && !onPress}
      autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
      multiline={multiline}
      style={[styles.field, multiline && { height: 96, paddingTop: 12, textAlignVertical: 'top' }]}
    />
  );
  return (
    <View>
      {label ? (
        <Text style={styles.fieldLabel}>{label}</Text>
      ) : null}
      {onPress ? (
        <Pressable onPress={onPress} accessibilityRole="button">
          <View pointerEvents="none">{input}</View>
        </Pressable>
      ) : (
        input
      )}
    </View>
  );
}

/** Horizontally scrolling filter chips. */
export function ChipRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.chip, active && { backgroundColor: mineral.primary, borderColor: mineral.primary }]}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: active ? '#FFFFFF' : mineral.textSecondary }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** Tappable list row with icon, title, subtitle and chevron. */
export function ListRow({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  right,
  onPress,
}: {
  icon?: string;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [styles.card, styles.row, { opacity: pressed && onPress ? 0.7 : 1 }]}
    >
      {icon ? <IconChip icon={icon} color={iconColor} bg={iconBg} /> : null}
      <View style={{ flex: 1, marginLeft: icon ? 12 : 0 }}>
        <Txt size={14} weight="600" tone="heading">{title}</Txt>
        {subtitle ? <Txt size={12} tone="muted" style={{ marginTop: 2 }}>{subtitle}</Txt> : null}
      </View>
      {right ?? (onPress ? <Icon name="chevron" size={16} color={mineral.textMuted} /> : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: mineral.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: mineral.border,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#101512', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 1 },
      default: {},
    }),
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  hero: { borderRadius: 20, padding: 20, marginBottom: 14 },
  section: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 18, marginBottom: 10 },
  sectionChip: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: mineral.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: mineral.borderFaint, overflow: 'hidden' },
  btn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  field: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: mineral.border,
    backgroundColor: mineral.cardInset,
    paddingHorizontal: 14,
    fontSize: 15,
    color: mineral.text,
  },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: mineral.textSecondary, marginBottom: 7, marginLeft: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: mineral.border,
    backgroundColor: '#FFFFFF',
  },
});
