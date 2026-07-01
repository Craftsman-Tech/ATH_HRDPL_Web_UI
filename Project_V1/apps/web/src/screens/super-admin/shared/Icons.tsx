/**
 * Icons.tsx — line/stroke icon set for the Super Admin portal.
 * Mirrors the reference design (Feather-style, 24x24, currentColor stroke).
 * Usage: <Icon.Hospital size={14} /> — colour follows currentColor.
 */
import React from 'react';

type P = { size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties };

const base = (size = 16, sw = 2): React.SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: '0 0 24 24',
  fill: 'none', stroke: 'currentColor', strokeWidth: sw,
  strokeLinecap: 'round', strokeLinejoin: 'round',
});

export const Icon = {
  Logo: ({ size = 18, strokeWidth = 2.2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
  ),
  Dashboard: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg>
  ),
  Hospital: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" /></svg>
  ),
  Approvals: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><polyline points="9 15 11 17 15 13" /></svg>
  ),
  License: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 13h6M9 17h3" /></svg>
  ),
  Activity: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
  ),
  Modules: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
  ),
  Billing: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M20 7h-7M14 17H4M17 12H7" /><circle cx="17" cy="7" r="3" /><circle cx="7" cy="17" r="3" /></svg>
  ),
  Settings: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
  ),
  Search: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
  ),
  Plus: ({ size = 14, strokeWidth = 2.5, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  ),
  Download: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
  ),
  Upload: ({ size = 16, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
  ),
  Filter: ({ size = 12, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
  ),
  Chevron: ({ size = 11, strokeWidth = 2.5, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><polyline points="6 9 12 15 18 9" /></svg>
  ),
  Eye: ({ size = 13, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  Reset: ({ size = 13, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><polyline points="21 3 21 8 16 8" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><polyline points="3 21 3 16 8 16" /></svg>
  ),
  More: ({ size = 13, strokeWidth = 2.5, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
  ),
  Check: ({ size = 11, strokeWidth = 3, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><polyline points="20 6 9 17 4 12" /></svg>
  ),
  CheckThin: ({ size = 22, strokeWidth = 2.2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><polyline points="20 6 9 17 4 12" /></svg>
  ),
  Close: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  ),
  File: ({ size = 16, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
  ),
  Info: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  Warning: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
  ),
  Mail: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
  ),
  User: ({ size = 14, strokeWidth = 2.2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  SignOut: ({ size = 14, strokeWidth = 2.2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  ),
  Bell: ({ size = 16, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
  ),
  Sliders: ({ size = 16, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
  ),
  Pill: ({ size = 16, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7z" /><line x1="8.5" y1="8.5" x2="15.5" y2="15.5" /></svg>
  ),
  Beaker: ({ size = 16, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M9 3h6M10 3v6.5L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-8.5V3" /><line x1="7" y1="14" x2="17" y2="14" /></svg>
  ),
  Scan: ({ size = 16, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="3" y1="12" x2="21" y2="12" /></svg>
  ),
  Users: ({ size = 16, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  Chart: ({ size = 16, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="3" y1="20" x2="21" y2="20" /></svg>
  ),
  Analytics: ({ size = 14, strokeWidth = 2, ...r }: P) => (
    <svg {...base(size, strokeWidth)} {...r}><path d="M3 3v18h18" /><rect x="7" y="11" width="3" height="6" rx="0.5" /><rect x="12" y="7" width="3" height="10" rx="0.5" /><rect x="17" y="13" width="3" height="4" rx="0.5" /></svg>
  ),
};
