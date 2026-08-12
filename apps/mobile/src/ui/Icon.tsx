/**
 * ============================================================================
 *  Icon — Vexoo Mobile
 * ============================================================================
 *  A single stroked icon set at a 24×24 grid, matching the line icons the web
 *  portals use in their sidebars and toolbars.
 *
 *  This exists because the previous UI stood in for icons with coloured dots,
 *  bars and literal "X" / "?" text characters — the single loudest signal that
 *  a screen is a prototype rather than a product.
 *
 *  `react-native-svg` inherits `stroke` / `strokeWidth` / `fill` from the
 *  parent <Svg>, so each glyph below is declared as bare geometry.
 * ============================================================================
 */
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const GLYPHS = {
  menu:        <Path d="M3 6h18M3 12h18M3 18h18" />,
  close:       <Path d="M18 6L6 18M6 6l12 12" />,
  chevronRight:<Path d="M9 18l6-6-6-6" />,
  chevronLeft: <Path d="M15 18l-6-6 6-6" />,
  chevronDown: <Path d="M6 9l6 6 6-6" />,
  chevronUp:   <Path d="M18 15l-6-6-6 6" />,
  arrowRight:  <Path d="M5 12h14M12 5l7 7-7 7" />,
  arrowLeft:   <Path d="M19 12H5M12 19l-7-7 7-7" />,

  search: <>
    <Circle cx={11} cy={11} r={8} />
    <Path d="M21 21l-4.35-4.35" />
  </>,
  filter: <Path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
  bell: <>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </>,

  sun: <>
    <Circle cx={12} cy={12} r={4.5} />
    <Path d="M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </>,
  moon: <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,

  user: <>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </>,
  users: <>
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx={9} cy={7} r={4} />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </>,
  logout: <>
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Path d="M16 17l5-5-5-5M21 12H9" />
  </>,
  help: <>
    <Circle cx={12} cy={12} r={10} />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <Path d="M12 17h.01" />
  </>,
  shield: <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  lock: <>
    <Rect x={3} y={11} width={18} height={11} rx={2} />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>,
  eye: <>
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx={12} cy={12} r={3} />
  </>,
  eyeOff: <>
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <Path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <Path d="M1 1l22 22" />
  </>,

  plus:   <Path d="M12 5v14M5 12h14" />,
  minus:  <Path d="M5 12h14" />,
  check:  <Path d="M20 6L9 17l-5-5" />,
  checkCircle: <>
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </>,
  edit: <>
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </>,
  trash: <>
    <Path d="M3 6h18" />
    <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </>,
  moreVertical: <>
    <Circle cx={12} cy={5} r={1} />
    <Circle cx={12} cy={12} r={1} />
    <Circle cx={12} cy={19} r={1} />
  </>,

  calendar: <>
    <Rect x={3} y={4} width={18} height={18} rx={2} />
    <Path d="M16 2v4M8 2v4M3 10h18" />
  </>,
  clock: <>
    <Circle cx={12} cy={12} r={10} />
    <Path d="M12 6v6l4 2" />
  </>,

  activity: <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  heart: <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  pill: <>
    <Path d="M10.5 20.5a5 5 0 0 1-7-7l7-7a5 5 0 0 1 7 7z" />
    <Path d="M8.5 8.5l7 7" />
  </>,
  flask: <>
    <Path d="M9 2v6.5L3.6 17.4A2 2 0 0 0 5.3 20.5h13.4a2 2 0 0 0 1.7-3.1L15 8.5V2" />
    <Path d="M7.5 2h9M6.6 14h10.8" />
  </>,
  droplet: <Path d="M12 2.7l5.7 5.6a8 8 0 1 1-11.4 0z" />,
  clipboard: <>
    <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <Rect x={8} y={2} width={8} height={4} rx={1} />
  </>,
  stethoscope: <>
    <Path d="M4.8 2.3A1 1 0 0 0 3.5 3v6a6 6 0 0 0 12 0V3a1 1 0 0 0-1.3-.7" />
    <Path d="M8 15v1a5 5 0 0 0 10 0v-1" />
    <Circle cx={20} cy={11} r={2} />
  </>,

  home: <>
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Path d="M9 22V12h6v10" />
  </>,
  grid: <>
    <Rect x={3} y={3} width={7} height={7} rx={1.5} />
    <Rect x={14} y={3} width={7} height={7} rx={1.5} />
    <Rect x={14} y={14} width={7} height={7} rx={1.5} />
    <Rect x={3} y={14} width={7} height={7} rx={1.5} />
  </>,
  list: <Path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
  layers: <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
  inbox: <>
    <Path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <Path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </>,
  message: <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  send: <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 21-7z" />,

  settings: <>
    <Circle cx={12} cy={12} r={3} />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </>,

  phone: <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
  mail: <>
    <Rect x={2} y={4} width={20} height={16} rx={2} />
    <Path d="M22 6l-10 7L2 6" />
  </>,
  mapPin: <>
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx={12} cy={10} r={3} />
  </>,
  building: <>
    <Path d="M3 21h18" />
    <Path d="M5 21V7l8-4v18M19 21V11l-6-4" />
    <Path d="M9 9h.01M9 12h.01M9 15h.01M9 18h.01" />
  </>,

  fileText: <>
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </>,
  paperclip: <Path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />,
  download: <>
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Path d="M7 10l5 5 5-5M12 15V3" />
  </>,
  upload: <>
    <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <Path d="M17 8l-5-5-5 5M12 3v12" />
  </>,
  printer: <>
    <Path d="M6 9V2h12v7" />
    <Path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <Rect x={6} y={14} width={12} height={8} rx={1} />
  </>,

  package: <>
    <Path d="M16.5 9.4l-9-5.19" />
    <Path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <Path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
  </>,
  truck: <>
    <Rect x={1} y={3} width={15} height={13} rx={1.5} />
    <Path d="M16 8h4l3 3v5h-7z" />
    <Circle cx={5.5} cy={18.5} r={2.5} />
    <Circle cx={18.5} cy={18.5} r={2.5} />
  </>,

  barChart: <Path d="M18 20V10M12 20V4M6 20v-6" />,
  trendingUp: <>
    <Path d="M23 6l-9.5 9.5-5-5L1 18" />
    <Path d="M17 6h6v6" />
  </>,
  trendingDown: <>
    <Path d="M23 18l-9.5-9.5-5 5L1 6" />
    <Path d="M17 18h6v-6" />
  </>,
  creditCard: <>
    <Rect x={1} y={4} width={22} height={16} rx={2} />
    <Path d="M1 10h22" />
  </>,
  refresh: <>
    <Path d="M23 4v6h-6M1 20v-6h6" />
    <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </>,

  alert: <>
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <Path d="M12 9v4M12 17h.01" />
  </>,
  alertCircle: <>
    <Circle cx={12} cy={12} r={10} />
    <Path d="M12 8v4M12 16h.01" />
  </>,
  info: <>
    <Circle cx={12} cy={12} r={10} />
    <Path d="M12 16v-4M12 8h.01" />
  </>,
  zap: <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  star: <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  briefcase: <>
    <Rect x={2} y={7} width={20} height={14} rx={2} />
    <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </>,
} as const;

export type IconName = keyof typeof GLYPHS;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  /** Stroke weight. 1.75 is the default; use 2.2 for small sizes. */
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color = '#0B0F0E', strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {GLYPHS[name]}
    </Svg>
  );
}

/** True when `name` is part of the set — lets data files carry icon names safely. */
export function isIconName(name: string): name is IconName {
  return name in GLYPHS;
}
