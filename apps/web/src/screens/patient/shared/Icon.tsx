import React from 'react';

const ICONS: Record<string, React.ReactNode> = {
  home:      <path d="M3 10.5 12 3l9 7.5M5 9.5V21h5v-6h4v6h5V9.5" />,
  calendar:  <><rect x="3" y="4.5" width="18" height="17" rx="2.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></>,
  records:   <><path d="M6 2.5h8l5 5V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" /><path d="M14 2.5v5h5M8.5 13h7M8.5 17h7" /></>,
  pill:      <><path d="M10.5 13.5 6 18a4.2 4.2 0 0 1-6-6l7.5-7.5a4.2 4.2 0 0 1 6 6Z" transform="translate(4 0)" /><path d="M8.5 8.5 15 15" /></>,
  lab:       <path d="M9 3v6.5L4 19a1.5 1.5 0 0 0 1.3 2.3h13.4A1.5 1.5 0 0 0 20 19l-5-9.5V3M8 3h8M7 14h10" />,
  message:   <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2Z" />,
  billing:   <><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19" /></>,
  search:    <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>,
  bell:      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />,
  chevron:   <path d="m6 9 6 6 6-6" />,
  logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>,
  heart:     <path d="M12 21s-7.5-4.6-10-9.2A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 10 5.8C19.5 16.4 12 21 12 21Z" />,
  plus:      <path d="M12 5v14M5 12h14" />,
  check:     <path d="m20 6-11 11-5-5" />,
  arrowR:    <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowL:    <path d="M19 12H5m6 6-6-6 6-6" />,
  user:      <><circle cx="12" cy="8" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" /></>,
  users:     <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 21a6.5 6.5 0 0 1 13 0M16 5.2a3.5 3.5 0 0 1 0 6.6M21.5 21a6.4 6.4 0 0 0-4-6" /></>,
  shield:    <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5Z" />,
  clock:     <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pin:       <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  phone:     <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />,
  droplet:   <path d="M12 2.7 6.3 9a8 8 0 1 0 11.4 0Z" />,
  alert:     <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
  x:         <path d="M18 6 6 18M6 6l12 12" />,
  download:  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />,
  send:      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />,
  up:        <path d="M3 17l6-6 4 4 8-8m0 0h-6m6 0v6" />,
  down:      <path d="M3 7l6 6 4-4 8 8m0 0h-6m6 0v-6" />,
  target:    <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" /></>,
  award:     <><circle cx="12" cy="8" r="6" /><path d="m8.5 13-1.5 8 5-3 5 3-1.5-8" /></>,
  bulb:      <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2.5h6c0-1.3.3-1.8 1-2.5A6 6 0 0 0 12 3Z" /></>,
  spark:     <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1" />,
  stetho:    <path d="M4 3v6a5 5 0 0 0 10 0V3M4 3H2m2 0h2m6 0h2m-2 0h-2M9 19a4 4 0 0 0 8 0v-3M19 13a2 2 0 1 0 0 .01" />,
  syringe:   <path d="m18 2 4 4M17 3l4 4-9 9-4 1 1-4 8-8ZM7 13l4 4M5 15l4 4-2 2-4-4 2-2Z" />,
  scale:     <path d="M12 3v3M5 6h14l-2.5 6a4 4 0 0 1-9 0L5 6Zm0 0-2 4m16-4 2 4M8 21h8" />,
  wind:      <path d="M9.6 4.6A2 2 0 1 1 11 8H2m6.6 11.4A2 2 0 1 0 10 16H2m10.6-9.4A2.5 2.5 0 1 1 14 11H2" />,
  flame:     <path d="M12 2c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3 .5 2 2 2.5 2 2.5C9 8 11 6 12 2Z" />,
  moon:      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z" />,
  foot:      <path d="M8 6.5C8 4 9 2 11 2s2.5 1.5 2.5 4-1 5-3 5S8 9 8 6.5ZM7 16c0-2 1.5-3 3-3s3 1 3 3-1 5-3 5-3-3-3-5Z" />,
  edit:      <path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z" />,
  print:     <><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="7" rx="1" /></>,
  refresh:   <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />,
  doc:       <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></>,
  dot:       <circle cx="12" cy="12" r="3" />,
  menu:      <path d="M3 6h18M3 12h18M3 18h18" />,
};

interface IconProps { name: string; size?: number; sw?: number; }

const Icon: React.FC<IconProps> = ({ name, size = 18, sw = 1.9 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {ICONS[name] ?? ICONS.dot}
  </svg>
);

export default Icon;
