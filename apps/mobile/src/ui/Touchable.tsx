/**
 * ============================================================================
 *  Touchable — Vexoo Mobile
 * ============================================================================
 *  Every tappable surface in the app scales down a hair on press and springs
 *  back on release. It's a small thing, but it's most of the difference
 *  between an interface that feels physical and one that feels like a web page
 *  in a WebView — `TouchableOpacity`'s flat opacity fade is the giveaway.
 *
 *  Runs on the native driver, so it stays smooth while lists scroll.
 *
 *  ── Why the style is split ────────────────────────────────────────────────
 *  The visual box (background, border, padding) lives on the animated child so
 *  the WHOLE box scales on press. But that means the Pressable is the real
 *  flex item, and any layout the caller intended for the item — `flex: 1` on a
 *  button in a row, a margin between cards — would land on the wrong node.
 *
 *  `flex: 1` was the sharp edge: on the inner view it resolves against the
 *  Pressable's column axis, so `flexBasis: 0` collapsed the height and footer
 *  buttons rendered 4px tall. So positioning/sizing props are hoisted to the
 *  Pressable and everything else stays on the animated child, which stretches
 *  to fill it.
 * ============================================================================
 */
import React, { useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export interface TouchableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** How far it compresses. 'sm' for rows, 'md' for buttons and tiles. */
  press?: 'none' | 'sm' | 'md';
  children?: React.ReactNode;
}

const SCALE = { none: 1, sm: 0.985, md: 0.96 };

/**
 * Style props that belong to the flex ITEM (the Pressable) rather than to the
 * painted box inside it.
 */
const OUTER_KEYS = [
  'flex', 'flexGrow', 'flexShrink', 'flexBasis', 'alignSelf',
  'width', 'minWidth', 'maxWidth',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'marginHorizontal', 'marginVertical', 'marginStart', 'marginEnd',
  'position', 'top', 'left', 'right', 'bottom', 'zIndex',
] as const;

export function Touchable({
  style,
  press = 'md',
  disabled,
  children,
  ...rest
}: TouchableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const target = SCALE[press];

  const [outerStyle, innerStyle] = useMemo(() => {
    const flat = StyleSheet.flatten(style) as Record<string, unknown> | undefined;
    if (!flat) return [undefined, undefined] as const;

    const outer: Record<string, unknown> = {};
    const inner: Record<string, unknown> = { ...flat };
    for (const key of OUTER_KEYS) {
      if (flat[key] !== undefined) {
        outer[key] = flat[key];
        delete inner[key];
      }
    }
    // Fill the item horizontally so a hoisted `flex: 1` still produces a
    // full-width box, and keep the child's own height.
    inner.alignSelf = 'stretch';
    return [outer as ViewStyle, inner as ViewStyle] as const;
  }, [style]);

  const to = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => press !== 'none' && to(target)}
      onPressOut={() => press !== 'none' && to(1)}
      style={outerStyle}
      {...rest}
    >
      <Animated.View
        style={[innerStyle, { transform: [{ scale }] }, disabled && { opacity: 0.45 }]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
