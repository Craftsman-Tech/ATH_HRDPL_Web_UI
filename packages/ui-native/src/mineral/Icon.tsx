import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

/**
 * Line-icon set for the customer products, ported 1:1 from the web portal's
 * Icon.tsx so mobile and web draw the identical glyph for a given key. The data
 * layer refers to icons by name (e.g. `ic: 'heart'` on a Stat), so these keys
 * are a contract — renaming one silently falls back to the dot.
 */
const ICONS: Record<string, React.ReactNode> = {
  home:      <Path d="M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5" />,
  calendar:  <><Rect x="3" y="4.5" width="18" height="17" rx="2.5" /><Path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></>,
  records:   <><Path d="M6 2.5h8l5 5V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" /><Path d="M14 2.5v5h5M8.5 13h7M8.5 17h7" /></>,
  pill:      <><Path d="M10.5 13.5 6 18a4.2 4.2 0 0 1-6-6l7.5-7.5a4.2 4.2 0 0 1 6 6Z" transform="translate(4 0)" /><Path d="M8.5 8.5 15 15" /></>,
  lab:       <Path d="M9 3v6.5L4 19a1.5 1.5 0 0 0 1.3 2.3h13.4A1.5 1.5 0 0 0 20 19l-5-9.5V3M8 3h8M7 14h10" />,
  message:   <Path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2Z" />,
  billing:   <><Rect x="2.5" y="5" width="19" height="14" rx="2.5" /><Path d="M2.5 10h19" /></>,
  search:    <><Circle cx="11" cy="11" r="7" /><Path d="m20 20-3.2-3.2" /></>,
  bell:      <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />,
  chevron:   <Path d="m6 9 6 6 6-6" />,
  logout:    <><Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><Path d="m16 17 5-5-5-5M21 12H9" /></>,
  heart:     <Path d="M12 21s-7.5-4.6-10-9.2A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 10 5.8C19.5 16.4 12 21 12 21Z" />,
  plus:      <Path d="M12 5v14M5 12h14" />,
  check:     <Path d="m20 6-11 11-5-5" />,
  arrowR:    <Path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowL:    <Path d="M19 12H5m6 6-6-6 6-6" />,
  user:      <><Circle cx="12" cy="8" r="4" /><Path d="M5.5 21a6.5 6.5 0 0 1 13 0" /></>,
  users:     <><Circle cx="9" cy="8" r="3.5" /><Path d="M2.5 21a6.5 6.5 0 0 1 13 0M16 5.2a3.5 3.5 0 0 1 0 6.6M21.5 21a6.4 6.4 0 0 0-4-6" /></>,
  shield:    <Path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5Z" />,
  clock:     <><Circle cx="12" cy="12" r="9" /><Path d="M12 7v5l3 2" /></>,
  pin:       <><Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><Circle cx="12" cy="10" r="3" /></>,
  phone:     <Path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />,
  droplet:   <Path d="M12 2.7 6.3 9a8 8 0 1 0 11.4 0Z" />,
  alert:     <><Path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><Path d="M12 9v4M12 17h.01" /></>,
  x:         <Path d="M18 6 6 18M6 6l12 12" />,
  download:  <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />,
  send:      <Path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />,
  up:        <Path d="M3 17l6-6 4 4 8-8m0 0h-6m6 0v6" />,
  down:      <Path d="M3 7l6 6 4-4 8 8m0 0h-6m6 0v-6" />,
  target:    <><Circle cx="12" cy="12" r="9" /><Circle cx="12" cy="12" r="5" /><Circle cx="12" cy="12" r="1.4" /></>,
  award:     <><Circle cx="12" cy="8" r="6" /><Path d="m8.5 13-1.5 8 5-3 5 3-1.5-8" /></>,
  bulb:      <><Path d="M9 18h6M10 21h4" /><Path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2.5h6c0-1.3.3-1.8 1-2.5A6 6 0 0 0 12 3Z" /></>,
  spark:     <Path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1" />,
  stetho:    <Path d="M4 3v6a5 5 0 0 0 10 0V3M4 3H2m2 0h2m6 0h2m-2 0h-2M9 19a4 4 0 0 0 8 0v-3M19 13a2 2 0 1 0 0 .01" />,
  syringe:   <Path d="m18 2 4 4M17 3l4 4-9 9-4 1 1-4 8-8ZM7 13l4 4M5 15l4 4-2 2-4-4 2-2Z" />,
  scale:     <Path d="M12 3v3M5 6h14l-2.5 6a4 4 0 0 1-9 0L5 6Zm0 0-2 4m16-4 2 4M8 21h8" />,
  wind:      <Path d="M9.6 4.6A2 2 0 1 1 11 8H2m6.6 11.4A2 2 0 1 0 10 16H2m10.6-9.4A2.5 2.5 0 1 1 14 11H2" />,
  flame:     <Path d="M12 2c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3 .5 2 2 2.5 2 2.5C9 8 11 6 12 2Z" />,
  moon:      <Path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z" />,
  foot:      <Path d="M8 6.5C8 4 9 2 11 2s2.5 1.5 2.5 4-1 5-3 5S8 9 8 6.5ZM7 16c0-2 1.5-3 3-3s3 1 3 3-1 5-3 5-3-3-3-5Z" />,
  edit:      <Path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z" />,
  print:     <><Path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><Rect x="6" y="14" width="12" height="7" rx="1" /></>,
  refresh:   <Path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />,
  doc:       <><Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><Path d="M14 2v6h6M9 13h6M9 17h6" /></>,
  dot:       <Circle cx="12" cy="12" r="3" />,
  menu:      <Path d="M3 6h18M3 12h18M3 18h18" />,
};

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  /** Stroke width in viewBox units. */
  sw?: number;
}

// react-native-svg has no `currentColor` inheritance the way the DOM does, so the
// stroke must always be a concrete value — this default is the mineral body tone.
export function Icon({ name, size = 18, color = '#2C3330', sw = 1.9 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name] ?? ICONS.dot}
    </Svg>
  );
}

export default Icon;
