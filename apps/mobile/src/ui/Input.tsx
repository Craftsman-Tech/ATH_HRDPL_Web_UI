/**
 * ============================================================================
 *  Field / Input — Vexoo Mobile
 * ============================================================================
 *  Reproduces the web input treatment, including the focus ring:
 *
 *    .input:focus { border-color: var(--mineral);
 *                   box-shadow: 0 0 0 3px rgba(14,124,102,.14); }
 *
 *  React Native has no `box-shadow: 0 0 0 Npx`, so the ring is a 3pt tinted
 *  gutter drawn by the wrapper — visually identical, and it animates.
 *
 *  Also here: `ReadField`, the labelled read-only value used all over the
 *  portals for patient details. It was previously a bordered box with two
 *  lines of text; it's now a proper well with a micro-label.
 * ============================================================================
 */
import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { radius, spacing } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';
import { T, alpha, body } from '../theme';
import { Icon, type IconName } from './Icon';
import { Touchable } from './Touchable';

export interface FieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  /** Right-aligned helper next to the label — "Forgot?", "Optional". */
  labelAction?: React.ReactNode;
  icon?: IconName;
  /** Tap target on the right — password reveal, clear, calendar. */
  trailingIcon?: IconName;
  onTrailingPress?: () => void;
  error?: string;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  accent?: string;
}

export function Field({
  label,
  labelAction,
  icon,
  trailingIcon,
  onTrailingPress,
  error,
  hint,
  containerStyle,
  inputStyle,
  accent,
  multiline,
  editable = true,
  ...rest
}: FieldProps) {
  const { theme, mode } = useTheme();
  const [focused, setFocused] = useState(false);
  const ring = useRef(new Animated.Value(0)).current;

  const primary = accent ?? theme.primary;
  const borderColor = error ? theme.statusText.danger : focused ? primary : theme.border;

  const animate = (to: number) =>
    Animated.timing(ring, { toValue: to, duration: 140, useNativeDriver: false }).start();

  return (
    <View style={containerStyle}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={[T.label, { color: theme.textMuted }]}>{label}</Text>
          {labelAction}
        </View>
      ) : null}

      <Animated.View
        style={[
          styles.ring,
          {
            backgroundColor: ring.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(0,0,0,0)', alpha(error ? theme.statusText.danger : primary, 0.14)],
            }),
          },
        ]}
      >
        <View
          style={[
            styles.shell,
            {
              backgroundColor: editable ? theme.card : theme.bgSunken,
              borderColor,
              alignItems: multiline ? 'flex-start' : 'center',
            },
            inputStyle,
          ]}
        >
          {icon ? (
            <View style={multiline ? { paddingTop: 2 } : null}>
              <Icon name={icon} size={17} color={focused ? primary : theme.textFaint} strokeWidth={2} />
            </View>
          ) : null}

          <TextInput
            {...rest}
            editable={editable}
            multiline={multiline}
            onFocus={(e) => { setFocused(true); animate(1); rest.onFocus?.(e); }}
            onBlur={(e)  => { setFocused(false); animate(0); rest.onBlur?.(e); }}
            placeholderTextColor={theme.textFaint}
            style={[
              styles.input,
              {
                color: editable ? theme.text : theme.textMuted,
                minHeight: multiline ? 96 : undefined,
                textAlignVertical: multiline ? 'top' : 'center',
              },
            ]}
          />

          {trailingIcon ? (
            <Touchable press="sm" onPress={onTrailingPress} style={styles.trailing}>
              <Icon name={trailingIcon} size={17} color={theme.textMuted} strokeWidth={2} />
            </Touchable>
          ) : null}
        </View>
      </Animated.View>

      {error ? (
        <View style={styles.noteRow}>
          <Icon name="alertCircle" size={12} color={theme.statusText.danger} strokeWidth={2.2} />
          <Text style={[T.caption, { color: theme.statusText.danger }]}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={[T.caption, styles.hint, { color: theme.textFaint }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

/**
 * A labelled read-only value. Used across every portal's detail sheets.
 */
export function ReadField({
  label,
  value,
  mono: useMono = false,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: string;
}) {
  const { theme } = useTheme();
  return (
    <View style={[styles.readField, { backgroundColor: theme.bgSunken, borderColor: theme.hairline }]}>
      <Text style={[T.label, { color: theme.textFaint }]} numberOfLines={1}>
        {label}
      </Text>
      <Text
        style={[
          useMono ? T.mono : T.bodyStrong,
          { color: tone ?? theme.text, marginTop: 3 },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/** A search box — its own component because it appears on nearly every list. */
export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search',
  accent,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  accent?: string;
}) {
  return (
    <Field
      icon="search"
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      accent={accent}
      autoCorrect={false}
      trailingIcon={value ? 'close' : undefined}
      onTrailingPress={() => onChangeText('')}
      returnKeyType="search"
    />
  );
}

const styles = StyleSheet.create({
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    minHeight: 16,
  },
  ring: {
    borderRadius: radius.lg + 3,
    padding: 3,
  },
  shell: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    flexDirection: 'row',
    gap: spacing.sm + 2,
    minHeight: 48,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: body(500),
    fontSize: 15,
    lineHeight: 20,
    padding: 0,
  },
  trailing: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28,
    minWidth: 28,
  },
  noteRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 6,
  },
  hint: {
    marginTop: 6,
  },
  readField: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.md,
  },
});
