/**
 * ============================================================================
 *  VexooMark — the brand mark
 * ============================================================================
 *  The Vexoo "V". This is the one glyph that identifies the product, so it is
 *  drawn as an SVG path rather than set in a typeface: the cold-start splash
 *  renders before `useBrandFonts()` resolves, and a text "V" there would flash
 *  in the system font and then reflow once Fraunces lands.
 *
 *  `VexooGlyph` is the bare letter — drop it inside whatever container a screen
 *  already has. `VexooMark` is the letter on its rounded mineral tile, for
 *  places that want the badge without restating the tile styling.
 * ============================================================================
 */
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/** Solid V on a 24×24 grid, drawn outer-left → apex → outer-right. */
const V_PATH = 'M4 4H8.4L12 14.6L15.6 4H20L13.2 20H10.8Z';

const MINERAL = '#0E7C66';
const PAPER   = '#FAFAF7';

export function VexooGlyph({
  size = 24,
  color = PAPER,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={V_PATH} fill={color} />
    </Svg>
  );
}

export function VexooMark({
  size = 44,
  background = MINERAL,
  color = PAPER,
  style,
}: {
  size?: number;
  background?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          alignItems: 'center',
          backgroundColor: background,
          borderRadius: size * 0.28,
          height: size,
          justifyContent: 'center',
          width: size,
        },
        style,
      ]}
    >
      <VexooGlyph size={size * 0.6} color={color} />
    </View>
  );
}
