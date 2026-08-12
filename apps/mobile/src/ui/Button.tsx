/**
 * ============================================================================
 *  Button — Vexoo Mobile
 * ============================================================================
 *  Four variants, mirroring the web CTAs:
 *
 *    primary   — filled mineral, with a coloured glow beneath it. The single
 *                most important action on a screen. Never two per view.
 *    secondary — filled ink/neutral. Confirmatory but not the hero action.
 *    ghost     — hairline outline on the card ground. Cancel, Close, Back.
 *    danger    — filled rose. Destructive only.
 *
 *  Sizes are 52 / 44 / 36pt tall so every variant clears the 44pt touch
 *  minimum at `md` and above; `sm` is reserved for inline row actions where
 *  the whole row is also tappable.
 * ============================================================================
 */
import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, spacing } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';
import { T, glow, alpha } from '../theme';
import { Icon, type IconName } from './Icon';
import { PulseLoader } from './PulseLoader';
import { Touchable } from './Touchable';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet';
export type ButtonSize    = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  /** Puts the icon after the label — for "Continue →" style CTAs. */
  iconRight?: IconName;
  loading?: boolean;
  disabled?: boolean;
  /** Stretch to fill the parent instead of hugging its content. */
  full?: boolean;
  /** Override the fill (role accents — each portal tints its own primary). */
  accent?: string;
  style?: StyleProp<ViewStyle>;
}

const HEIGHT: Record<ButtonSize, number> = { sm: 36, md: 46, lg: 52 };
const PAD:    Record<ButtonSize, number> = { sm: spacing.md, md: spacing.lg, lg: spacing.xl };

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  full = false,
  accent,
  style,
}: ButtonProps) {
  const { theme, mode } = useTheme();
  const primary = accent ?? theme.primary;

  const skin = (() => {
    switch (variant) {
      case 'primary':
        return { bg: primary, fg: '#FAFAF7', border: primary, lift: glow(primary, size === 'sm' ? 'sm' : 'md') };
      case 'secondary':
        return { bg: theme.text, fg: theme.bg, border: theme.text, lift: {} };
      case 'danger':
        return { bg: theme.statusText.danger, fg: '#FAFAF7', border: theme.statusText.danger, lift: glow(theme.statusText.danger, 'sm') };
      case 'quiet':
        return { bg: alpha(primary, mode === 'dark' ? 0.16 : 0.09), fg: primary, border: 'transparent', lift: {} };
      case 'ghost':
      default:
        return { bg: 'transparent', fg: theme.text, border: theme.border, lift: {} };
    }
  })();

  const busy = loading || disabled;
  const textStyle = size === 'sm' ? T.buttonSm : T.button;
  const iconSize = size === 'sm' ? 15 : 17;

  return (
    <Touchable
      onPress={onPress}
      disabled={busy}
      press={size === 'sm' ? 'sm' : 'md'}
      style={[
        styles.base,
        {
          height: HEIGHT[size],
          paddingHorizontal: PAD[size],
          borderRadius: size === 'sm' ? radius.md : radius.lg,
          backgroundColor: skin.bg,
          borderColor: skin.border,
        },
        !disabled && !loading ? skin.lift : null,
        full ? styles.full : null,
        style,
      ]}
    >
      {loading ? (
        // Heartbeat rather than a stock spinner — same waiting language the
        // portals use everywhere else.
        <PulseLoader width={54} color={skin.fg} duration={1100} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={iconSize} color={skin.fg} strokeWidth={2} /> : null}
          <Text style={[textStyle, { color: skin.fg }]} numberOfLines={1}>
            {label}
          </Text>
          {iconRight ? <Icon name={iconRight} size={iconSize} color={skin.fg} strokeWidth={2} /> : null}
        </View>
      )}
    </Touchable>
  );
}

/**
 * A square icon-only control — header actions, close buttons, row affordances.
 * Replaces the old text "X" / "?" glyphs.
 */
export function IconButton({
  name,
  onPress,
  size = 40,
  color,
  background,
  bordered = true,
  style,
  accessibilityLabel,
}: {
  name: IconName;
  onPress?: () => void;
  size?: number;
  color?: string;
  background?: string;
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const { theme } = useTheme();
  return (
    <Touchable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
      style={[
        styles.iconBtn,
        {
          width: size,
          height: size,
          borderRadius: radius.md,
          backgroundColor: background ?? 'transparent',
          borderWidth: bordered ? StyleSheet.hairlineWidth * 2 : 0,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      <Icon name={name} size={size * 0.46} color={color ?? theme.textSecondary} strokeWidth={2} />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignSelf: 'flex-start',
  },
  full: {
    alignSelf: 'stretch',
    width: '100%',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
