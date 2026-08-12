/**
 * ============================================================================
 *  Avatar — Vexoo Mobile
 * ============================================================================
 *  Initials on a tinted square, matching the web's `.dr-user-avatar` (a 9-10px
 *  rounded square rather than a circle — it reads as a record, not a contact).
 *
 *  The tint is derived from the name so the same patient keeps the same colour
 *  everywhere in the app, which makes long lists scannable without photos.
 * ============================================================================
 */
import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';
import { alpha, body } from '../theme';

/** "Meera Sharma" → "MS". Strips honorifics so doctors don't all read "DR". */
export function initials(name: string): string {
  const parts = name
    .replace(/^(dr|mr|mrs|ms|miss|prof)\.?\s+/i, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return '?';
  return parts.slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

// A small, deliberately harmonious set — all live in the mineral/ink family
// or the muted status hues, so no avatar ever fights the brand.
const SWATCHES = ['#0E7C66', '#0A7A8F', '#6D5BD0', '#C68A1F', '#B43A2C', '#2A7A4B', '#149E83'];

function swatchFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return SWATCHES[Math.abs(hash) % SWATCHES.length];
}

export interface AvatarProps {
  name: string;
  size?: number;
  /** Force a colour instead of deriving one — used for the signed-in user. */
  color?: string;
  /** Solid fill instead of a tint. For the current user in dark chrome. */
  solid?: boolean;
  /** Presence / status ring colour. */
  ring?: string;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({ name, size = 40, color, solid = false, ring, style }: AvatarProps) {
  const { mode } = useTheme();
  const base = color ?? swatchFor(name);

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          backgroundColor: solid ? base : alpha(base, mode === 'dark' ? 0.22 : 0.12),
          borderWidth: ring ? 2 : 0,
          borderColor: ring,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: solid ? '#FAFAF7' : base,
          fontFamily: body(700),
          fontSize: Math.round(size * 0.36),
          letterSpacing: 0.2,
        }}
      >
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
