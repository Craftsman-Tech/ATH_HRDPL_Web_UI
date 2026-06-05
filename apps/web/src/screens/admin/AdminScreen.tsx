/**
 * ============================================================================
 *  AdminScreen.tsx — Super Admin / Founders' Console
 * ============================================================================
 *  Route:           /super-admin  (protected, role === 'SuperAdmin')
 *  Suggested path:  apps/web/src/screens/admin/AdminScreen.tsx
 *
 *  UPDATED (Jun 2026):
 *  - Header profile card matches the Patient-screen style:
 *    avatar · name · role · email · divider · View/Edit Profile · Sign out.
 *    Tooltip is now a SIBLING of the avatar (not nested inside it).
 *  - ::before bridge eliminates the hover-gap so the card stays open while
 *    the user moves the cursor down toward the Sign out button.
 * ============================================================================
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';

type ViewId = 'dashboard' | 'hospitals' | 'doctors' | 'approvals' | 'licenses' | 'activity';

interface SuperAdminScreenProps {
  adminName?: string;
  adminRole?: string;
  onSignOut?: () => void;
}

interface Hospital {
  id: string; name: string; city: string; type: string;
  status: 'active' | 'pending' | 'suspended'; beds: number;
  doctors: number; joined: string; plan: string; revenue: string;
}
interface Approval {
  id: string; type: string; name: string; hospital: string;
  submitted: string; priority: 'high' | 'normal'; docs: number;
}

const HOSPITALS: Hospital[] = [
  { id:'H-001', name:'Apollo Multispecialty',   city:'Hyderabad', type:'Multi-speciality', status:'active',    beds:420, doctors:84, joined:'Jan 2024', plan:'Enterprise', revenue:'₹3.2L' },
  { id:'H-002', name:'Maxcare Heart Institute',  city:'Chennai',   type:'Cardiac',          status:'active',    beds:180, doctors:36, joined:'Mar 2024', plan:'Professional', revenue:'₹1.8L' },
  { id:'H-003', name:'Sunrise General Hospital', city:'Mumbai',    type:'General',          status:'pending',   beds:260, doctors:52, joined:'Apr 2026', plan:'Starter',      revenue:'—'     },
  { id:'H-004', name:'Greenfield Wellness',      city:'Bengaluru', type:'Wellness',         status:'active',    beds:95,  doctors:22, joined:'Sep 2024', plan:'Professional', revenue:'₹0.9L' },
  { id:'H-005', name:'PedsFirst Children',       city:'Pune',      type:'Paediatric',       status:'active',    beds:140, doctors:31, joined:'Nov 2024', plan:'Professional', revenue:'₹1.1L' },
  { id:'H-006', name:'Orthocare Speciality',     city:'Delhi',     type:'Orthopaedic',      status:'suspended', beds:110, doctors:18, joined:'Feb 2024', plan:'Starter',      revenue:'₹0.2L' },
];

const APPROVALS: Approval[] = [
  { id:'APR-081', type:'Hospital Registration', name:'Sunrise General Hospital',  hospital:'Mumbai',    submitted:'Apr 25, 2026', priority:'high',   docs:8  },
  { id:'APR-082', type:'Doctor Credentials',    name:'Dr. Arjun Mehta',           hospital:'Apollo',    submitted:'Apr 25, 2026', priority:'high',   docs:5  },
  { id:'APR-083', type:'Speciality Expansion',  name:'Maxcare — Neuro Wing',      hospital:'Maxcare',   submitted:'Apr 24, 2026', priority:'normal', docs:12 },
  { id:'APR-084', type:'Plan Upgrade',          name:'Greenfield Wellness',       hospital:'Bengaluru', submitted:'Apr 24, 2026', priority:'normal', docs:3  },
  { id:'APR-085', type:'Doctor Credentials',    name:'Dr. Priya Sundar',          hospital:'PedsFirst', submitted:'Apr 23, 2026', priority:'normal', docs:4  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800;900&display=swap');

.vx-admin {
  --ink-900:   #0B0F0E;
  --ink-800:   #1A2120;
  --ink-700:   #2B3533;
  --ink-600:   #3D4A48;
  --ink-500:   #5A6866;
  --ink-400:   #7E8E8C;
  --ink-300:   #A8B5B3;
  --ink-200:   #D0D8D7;
  --ink-100:   #EAF0EF;
  --ink-050:   #F4F8F7;
  --mineral-700: #0E7C66;
  --mineral-600: #0F9679;
  --mineral-100: #E0F3EE;
  --mineral-050: #F0F9F6;
  --signal-red: #C0392B;
  --signal-red-bg: #FDECEA;
  --amber:      #B45309;
  --amber-bg:   #FEF3C7;
  --blue:       #1D4ED8;
  --blue-bg:    #DBEAFE;
  --card:       #FFFFFF;
  --bg:         #F4F7F6;
  font-family: 'Inter Tight', Inter, system-ui, sans-serif;
  background: var(--bg); color: var(--ink-900);
  height: 100vh; overflow: hidden; display: flex; flex-direction: column;
}
.vx-admin ::-webkit-scrollbar { width: 5px; height: 5px; }
.vx-admin ::-webkit-scrollbar-thumb { background: var(--ink-200); border-radius: 4px; }
.vx-admin ::-webkit-scrollbar-track { background: transparent; }

@keyframes vx-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.vx-fade { animation: vx-fade 0.22s ease both; }

/* ── Top navigation bar ── */
.vx-admin .topbar {
  background: var(--ink-900); color: white;
  display: flex; align-items: center; height: 54px;
  padding: 0 28px; gap: 10px; flex-shrink: 0;
  position: relative; z-index: 15;
}

.vx-admin .topbar-logo { display: flex; align-items: center; gap: 9px; flex-shrink: 0; }
.vx-admin .topbar-logo-icon {
  width: 30px; height: 30px; background: var(--mineral-700);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
}
.vx-admin .topbar-nav { display: flex; align-items: center; gap: 2px; margin-left: 28px; flex: 1; }
.vx-admin .topbar-nav-btn {
  display: flex; align-items: center; gap: 6px; padding: 6px 13px;
  border-radius: 8px; border: none; background: transparent; color: rgba(255,255,255,0.5);
  font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.14s;
  font-family: inherit; white-space: nowrap;
}
.vx-admin .topbar-nav-btn:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
.vx-admin .topbar-nav-btn.active { background: rgba(255,255,255,0.1); color: white; font-weight: 600; }
.vx-admin .topbar-nav-badge {
  background: #C0392B; color: white; font-size: 10px; font-weight: 700;
  border-radius: 10px; padding: 1px 6px; min-width: 16px; text-align: center;
}
.vx-admin .topbar-spacer { flex: 1; }
.vx-admin .topbar-right  { display: flex; align-items: center; gap: 10px; }
.vx-admin .topbar-alert-btn {
  position: relative; background: rgba(255,255,255,0.07); border: none;
  border-radius: 8px; padding: 6px 9px; cursor: pointer; color: rgba(255,255,255,0.6);
  transition: background 0.14s;
}
.vx-admin .topbar-alert-btn:hover { background: rgba(255,255,255,0.14); }
.vx-admin .topbar-alert-dot {
  position: absolute; top: 5px; right: 5px;
  width: 7px; height: 7px; background: #C0392B; border-radius: 50%;
  border: 1.5px solid var(--ink-900);
}

/* ── Profile wrap — Patient-style hover card (light theme) ── */
.vx-admin .topbar-profile-wrap { position: relative; }
.vx-admin .topbar-profile-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--mineral-700); color: #FAFAF7;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0;
  transition: box-shadow 0.15s;
}
.vx-admin .topbar-profile-wrap:hover .topbar-profile-avatar {
  box-shadow: 0 0 0 3px rgba(14,124,102,0.35);
}
.vx-admin .topbar-profile-tooltip {
  display: none; position: absolute; top: calc(100% + 10px); right: 0;
  background: #FAFAF7; border: 1px solid var(--ink-200); border-radius: 14px;
  padding: 16px 18px; min-width: 232px;
  box-shadow: 0 12px 32px rgba(11,15,14,0.18);
  z-index: 1000;
}
  
.vx-admin .topbar-profile-wrap:hover .topbar-profile-tooltip { display: block; }
.vx-admin .topbar-profile-tooltip::before {
  content: ''; position: absolute;
  top: -12px; left: 0; right: 0; height: 12px;
}
.vx-admin .vx-tt-avatar {
  width: 46px; height: 46px; border-radius: 50%;
  background: var(--mineral-700); color: #FAFAF7;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 16px; margin-bottom: 12px;
}
.vx-admin .vx-tt-name { font-size: 14px; font-weight: 700; color: var(--ink-900); }
.vx-admin .vx-tt-sub  { font-size: 12px; color: var(--ink-500); margin-top: 3px; }
.vx-admin .vx-tt-divider { height: 1px; background: var(--ink-200); margin: 12px 0; }
.vx-admin .vx-tt-action {
  display: flex; align-items: center; gap: 9px; width: 100%;
  padding: 8px 10px; border-radius: 9px; border: none; background: transparent;
  font-size: 13px; font-weight: 500; cursor: pointer; text-align: left;
  font-family: 'Inter Tight', Inter, system-ui, sans-serif; transition: background 0.13s;
}
.vx-admin .vx-tt-action svg { flex-shrink: 0; }
.vx-admin .vx-tt-action.profile { color: var(--mineral-700); }
.vx-admin .vx-tt-action.profile:hover { background: var(--mineral-100); }
.vx-admin .vx-tt-action.signout { color: var(--signal-red); }
.vx-admin .vx-tt-action.signout:hover { background: var(--signal-red-bg); }

/* ── Main content area ── */
.vx-admin .main-area { flex: 1; overflow-y: auto; }

/* ── Page header ── */
.vx-admin .page-header {
  background: var(--card); border-bottom: 1px solid var(--ink-200);
  padding: 18px 28px; display: flex; align-items: center; justify-content: space-between;
}
.vx-admin .page-title    { font-size: 18px; font-weight: 800; letter-spacing: -0.4px; }
.vx-admin .page-subtitle { font-size: 12.5px; color: var(--ink-500); margin-top: 2px; }

/* ── Buttons ── */
.vx-admin .btn-primary {
  display: flex; align-items: center; gap: 7px;
  background: var(--mineral-700); color: white; border: none;
  border-radius: 9px; padding: 8px 18px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: opacity 0.14s;
}
.vx-admin .btn-primary:hover { opacity: 0.88; }
.vx-admin .btn-ghost {
  display: flex; align-items: center; gap: 7px;
  background: transparent; border: 1px solid var(--ink-200); color: var(--ink-600);
  border-radius: 9px; padding: 7px 16px; font-size: 13px; font-weight: 500;
  cursor: pointer; font-family: inherit; transition: background 0.14s;
}
.vx-admin .btn-ghost:hover { background: var(--ink-050); }
.vx-admin .btn-danger {
  background: var(--signal-red-bg); color: var(--signal-red); border: 1px solid #fca5a5;
  border-radius: 9px; padding: 7px 16px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: background 0.14s;
}
.vx-admin .btn-danger:hover { background: #fdecea; }
.vx-admin .btn-sm { padding: 5px 12px; font-size: 12px; border-radius: 8px; }

/* ── Card ── */
.vx-admin .card {
  background: var(--card); border: 1px solid var(--ink-200); border-radius: 16px; padding: 20px;
}

/* ── Badge / chip ── */
.vx-admin .badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; white-space: nowrap; display: inline-block; }
.vx-admin .badge-active    { background: var(--mineral-100); color: var(--mineral-700); }
.vx-admin .badge-pending   { background: var(--amber-bg);    color: var(--amber); }
.vx-admin .badge-suspended { background: var(--signal-red-bg); color: var(--signal-red); }
.vx-admin .badge-high      { background: var(--signal-red-bg); color: var(--signal-red); }
.vx-admin .badge-normal    { background: var(--blue-bg);     color: var(--blue); }
.vx-admin .badge-enterprise   { background: #ede9fe; color: #7c3aed; }
.vx-admin .badge-professional { background: var(--blue-bg); color: var(--blue); }
.vx-admin .badge-starter      { background: var(--ink-100); color: var(--ink-500); }

/* ── Dashboard ── */
.vx-admin .dash-kpi-row { display: grid; grid-template-columns: repeat(5,1fr); gap: 14px; margin-bottom: 22px; }
.vx-admin .kpi-card     { background: var(--card); border: 1px solid var(--ink-200); border-radius: 16px; padding: 18px 20px; }
.vx-admin .kpi-label    { font-size: 11px; color: var(--ink-500); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.vx-admin .kpi-value    { font-size: 28px; font-weight: 800; line-height: 1.1; }
.vx-admin .kpi-sub      { font-size: 12px; color: var(--ink-400); margin-top: 4px; }
.vx-admin .dash-grid    { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 18px; margin-bottom: 18px; }
.vx-admin .dash-grid-3  { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }

/* ── Table ── */
.vx-admin .tbl { width: 100%; border-collapse: expand; }
.vx-admin .tbl th { padding: 9px 16px; text-align: left; font-size: 11px; color: var(--ink-500); font-weight: 600; background: var(--ink-050); border-bottom: 1px solid var(--ink-200); white-space: nowrap; text-transform: uppercase; letter-spacing: 0.5px; }
.vx-admin .tbl td { padding: 13px 16px; font-size: 13px; border-bottom: 1px solid var(--ink-100); }
.vx-admin .tbl tr:last-child td { border-bottom: none; }
.vx-admin .tbl tr:hover td { background: var(--ink-050); }

/* ── Hospitals ── */
.vx-admin .hospital-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.vx-admin .hospital-card { background: var(--card); border: 1px solid var(--ink-200); border-radius: 16px; padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
.vx-admin .hosp-name  { font-size: 15px; font-weight: 700; }
.vx-admin .hosp-meta  { font-size: 12.5px; color: var(--ink-500); }
.vx-admin .hosp-stats { display: flex; gap: 16px; }
.vx-admin .hosp-stat  { text-align: center; }
.vx-admin .hosp-stat-val { font-size: 18px; font-weight: 800; color: var(--mineral-700); }
.vx-admin .hosp-stat-lbl { font-size: 10.5px; color: var(--ink-400); }

/* ── Approvals ── */
.vx-admin .approval-row {
  display: flex; align-items: center; gap: 16px; padding: 16px 20px;
  border-bottom: 1px solid var(--ink-100); transition: background 0.12s;
}
.vx-admin .approval-row:hover { background: var(--ink-050); }
.vx-admin .approval-row:last-child { border-bottom: none; }
.vx-admin .approval-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.vx-admin .approval-type  { font-size: 11px; font-weight: 600; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
.vx-admin .approval-name  { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
.vx-admin .approval-hosp  { font-size: 12px; color: var(--ink-500); }
.vx-admin .approval-docs  { font-size: 12px; color: var(--ink-400); font-weight: 500; margin-top: 2px; }
.vx-admin .approval-actions { display: flex; gap: 8px; flex-shrink: 0; }

/* ── Licenses ── */
.vx-admin .lic-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
.vx-admin .lic-card { background: var(--card); border: 1px solid var(--ink-200); border-radius: 16px; padding: 18px 20px; }
.vx-admin .lic-plan   { font-size: 15px; font-weight: 800; margin-bottom: 4px; }
.vx-admin .lic-count  { font-size: 28px; font-weight: 800; margin: 8px 0 4px; }
.vx-admin .lic-detail { font-size: 12px; color: var(--ink-500); line-height: 1.6; }
.vx-admin .lic-feature { display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: var(--ink-600); margin-bottom: 6px; }

/* ── Activity log ── */
.vx-admin .activity-row { display: flex; align-items: flex-start; gap: 12px; padding: 13px 0; border-bottom: 1px solid var(--ink-100); }
.vx-admin .activity-row:last-child { border-bottom: none; }
.vx-admin .act-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.vx-admin .act-text  { font-size: 13.5px; font-weight: 500; flex: 1; }
.vx-admin .act-time  { font-size: 12px; color: var(--ink-400); white-space: nowrap; flex-shrink: 0; }

/* ── Forms (drawers) ── */
.vx-admin .field-label { font-size: 12px; font-weight: 600; color: var(--ink-500); margin-bottom: 5px; }
.vx-admin .field-input, .vx-admin .field-select, .vx-admin .field-textarea {
  width: 100%; padding: 9px 12px; border: 1px solid var(--ink-200); border-radius: 9px;
  font-size: 13.5px; outline: none; background: var(--ink-050); color: var(--ink-900);
  font-family: inherit; transition: border-color 0.15s;
}
.vx-admin .field-input:focus, .vx-admin .field-select:focus, .vx-admin .field-textarea:focus { border-color: var(--mineral-700); }
.vx-admin .field-textarea { resize: vertical; }
.vx-admin .field-row  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.vx-admin .field-full { margin-bottom: 12px; }

/* ── Drawer ── */
.vx-admin .drawer-overlay { position: fixed; inset: 0; background: rgba(11,15,14,0.35); z-index: 100; }
.vx-admin .drawer { position: fixed; right: 0; top: 0; bottom: 0; width: 440px; background: white; box-shadow: -8px 0 40px rgba(11,15,14,0.12); z-index: 101; overflow-y: auto; display: flex; flex-direction: column; }
.vx-admin .drawer-header { padding: 22px 24px; border-bottom: 1px solid var(--ink-200); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.vx-admin .drawer-title  { font-size: 17px; font-weight: 800; }
.vx-admin .drawer-body   { padding: 24px; flex: 1; }
.vx-admin .drawer-footer { padding: 16px 24px; border-top: 1px solid var(--ink-200); display: flex; gap: 10px; flex-shrink: 0; }

/* ── Responsive ── */
@media (max-width: 1080px) {
  .vx-admin .dash-kpi-row   { grid-template-columns: repeat(3,1fr); }
  .vx-admin .dash-grid      { grid-template-columns: 1fr; }
  .vx-admin .dash-grid-3    { grid-template-columns: 1fr; }
  .vx-admin .hospital-grid  { grid-template-columns: 1fr; }
  .vx-admin .lic-grid       { grid-template-columns: 1fr; }
  .vx-admin .topbar-nav     { display: none; }
}
@media (max-width: 760px) {
  .vx-admin .dash-kpi-row   { grid-template-columns: repeat(2,1fr); }
}
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) { return name.split(' ').slice(0,2).map(p => p[0]).join('').toUpperCase(); }

function SvgIcon({ path, size = 16, color = 'currentColor' }: { path: string; size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}><path d={path} /></svg>;
}

function StatusBadge({ status }: { status: Hospital['status'] }) {
  const map: Record<Hospital['status'], string> = { active:'badge-active', pending:'badge-pending', suspended:'badge-suspended' };
  const labels: Record<Hospital['status'], string> = { active:'Active', pending:'Pending', suspended:'Suspended' };
  return <span className={`badge ${map[status]}`}>{labels[status]}</span>;
}
function PlanBadge({ plan }: { plan: string }) {
  const cls = plan === 'Enterprise' ? 'badge-enterprise' : plan === 'Professional' ? 'badge-professional' : 'badge-starter';
  return <span className={`badge ${cls}`}>{plan}</span>;
}

const NAV_ITEMS: { id: ViewId; label: string; path: string; badge?: number }[] = [
  { id:'dashboard', label:'Dashboard',   path:'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { id:'hospitals', label:'Hospitals',   path:'M12 7V3H2v18h20V7H12zm-2 12H4v-2h6v2zm0-4H4v-2h6v2zm0-4H4V9h6v2zm0-4H4V5h6v2zm10 12h-8V9h8v10zm-2-8h-4v2h4v-2zm0 4h-4v2h4v-2z' },
  { id:'doctors',   label:'Doctors',     path:'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z' },
  { id:'approvals', label:'Approvals',   path:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', badge:5 },
  { id:'licenses',  label:'Licenses',    path:'M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.58 1 13.5 3.08L12 4.58l-1.5-1.51C8.42 1 6 2.53 6 4.64c0 .48.11.92.18 1.36H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5.5-2.5c.72-.7 2.5-.21 2.5.97 0 .78-.59 1.53-1 2.03L14.2 8H12l2.5-4.5zM9 4.61c0-1.18 1.78-1.67 2.5-.97L14 8h-2.2C11.13 7.3 9 6.21 9 4.61zM4 19V8h6l4 4 4-4h6v11H4z' },
  { id:'activity',  label:'Activity Log',path:'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z' },
];

const PAGE_TITLES: Record<ViewId, [string,string]> = {
  dashboard: ['Founders\' Console', 'Platform-wide overview — May 2026'],
  hospitals: ['Registered Hospitals', '6 hospitals on the platform'],
  doctors:   ['Doctor Registry', '243 registered doctors across 6 hospitals'],
  approvals: ['Pending Approvals', '5 items awaiting review'],
  licenses:  ['Licence Management', 'Subscription plans and billing'],
  activity:  ['Activity Log', 'Recent system events'],
};

// ─── View: Dashboard ──────────────────────────────────────────────────────────

const DashboardView: React.FC = () => {
  const KPIs = [
    { label:'Active Hospitals', value:'5', sub:'1 pending onboard', color:'var(--mineral-700)' },
    { label:'Total Doctors',    value:'243', sub:'+4 this week',     color:'var(--blue)' },
    { label:'Patients (MTD)',   value:'12,840', sub:'↑ 8% vs Mar',   color:'var(--ink-800)' },
    { label:'Appointments',     value:'4,320', sub:'This month',     color:'var(--amber)' },
    { label:'MRR',              value:'₹7.2L', sub:'↑ 12% vs Mar',  color:'var(--mineral-700)' },
  ];

  const RECENT_REGS = [
    { name:'Sunrise General Hospital', city:'Mumbai', status:'pending' as const, submitted:'Apr 25' },
    { name:'Apollo Multispecialty',    city:'Hyderabad', status:'active' as const, submitted:'Jan 2024' },
    { name:'Maxcare Heart Institute',  city:'Chennai', status:'active' as const, submitted:'Mar 2024' },
    { name:'PedsFirst Children',       city:'Pune', status:'active' as const, submitted:'Nov 2024' },
  ];

  const ACTIVITY = [
    { text:'Sunrise General Hospital submitted registration documents.', time:'10 min ago', color:'#3b82f6' },
    { text:'Dr. Arjun Mehta credentials approved by Super Admin.', time:'45 min ago', color:'#16a34a' },
    { text:'Maxcare Heart Institute upgraded to Enterprise plan.', time:'2 h ago', color:'#7c3aed' },
    { text:'Orthocare Speciality subscription payment failed.', time:'5 h ago', color:'#e11d48' },
    { text:'PedsFirst Children added 3 new doctors.', time:'Yesterday', color:'#0d9488' },
  ];

  return (
    <div style={{ padding:'24px 28px' }} className="vx-fade">
      <div className="dash-kpi-row">
        {KPIs.map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color:k.color }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="dash-grid">
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--ink-200)', fontWeight:700, fontSize:15 }}>Hospital Overview</div>
          <div style={{ overflowX:'auto' }}>
            <table className="tbl">
              <thead><tr>{['Hospital','City','Type','Beds','Doctors','Status','Plan'].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {HOSPITALS.map(h => (
                  <tr key={h.id}>
                    <td style={{ fontWeight:600 }}>{h.name}</td>
                    <td style={{ color:'var(--ink-500)' }}>{h.city}</td>
                    <td style={{ color:'var(--ink-500)' }}>{h.type}</td>
                    <td style={{ fontWeight:600 }}>{h.beds}</td>
                    <td style={{ fontWeight:600 }}>{h.doctors}</td>
                    <td><StatusBadge status={h.status} /></td>
                    <td><PlanBadge plan={h.plan} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Recent Activity</div>
          {ACTIVITY.map((a, i) => (
            <div key={i} className="activity-row">
              <div className="act-dot" style={{ background:a.color }} />
              <div className="act-text">{a.text}</div>
              <div className="act-time">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── View: Hospitals ──────────────────────────────────────────────────────────

const HospitalsView: React.FC<{ onRegister: () => void }> = ({ onRegister }) => (
  <div style={{ padding:'24px 28px' }} className="vx-fade">
    <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
      <button className="btn-primary" onClick={onRegister}>
        <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
        Register New Hospital
      </button>
    </div>
    <div className="hospital-grid">
      {HOSPITALS.map(h => (
        <div key={h.id} className="hospital-card">
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
            <div>
              <div className="hosp-name">{h.name}</div>
              <div className="hosp-meta">{h.city} · {h.type}</div>
            </div>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <StatusBadge status={h.status} />
              <PlanBadge plan={h.plan} />
            </div>
          </div>
          <div className="hosp-stats">
            {[['Beds',h.beds],['Doctors',h.doctors],['Revenue',h.revenue],['Since',h.joined]].map(([l,v]) => (
              <div key={String(l)} className="hosp-stat">
                <div className="hosp-stat-val">{v}</div>
                <div className="hosp-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn-ghost btn-sm">View Details</button>
            {h.status === 'pending'    && <button className="btn-primary btn-sm">Approve</button>}
            {h.status === 'suspended'  && <button className="btn-primary btn-sm">Reactivate</button>}
            {h.status === 'active'     && <button className="btn-danger btn-sm">Suspend</button>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── View: Doctors ────────────────────────────────────────────────────────────

const DOCTORS_DATA = [
  ['Dr. Amy Chen',    'Cardiology',     'Apollo',   'MCI/REG/12483', '5 yrs',  'active'   ],
  ['Dr. Raj Patel',   'Endocrinology',  'Maxcare',  'MCI/REG/09214', '8 yrs',  'active'   ],
  ['Dr. Yeon Kim',    'Pulmonology',    'PedsFirst','MCI/REG/17320', '3 yrs',  'active'   ],
  ['Dr. Arjun Mehta', 'Neurology',      'Apollo',   'MCI/REG/21905', '7 yrs',  'pending'  ],
  ['Dr. Priya Sundar','Paediatrics',    'PedsFirst','MCI/REG/15880', '4 yrs',  'pending'  ],
  ['Dr. Suman Rao',   'Orthopaedics',   'Orthocare','MCI/REG/08441', '10 yrs', 'suspended'],
] as const;

const DoctorsView: React.FC = () => (
  <div style={{ padding:'24px 28px' }} className="vx-fade">
    <div className="card" style={{ padding:0, overflow:'hidden' }}>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--ink-200)', fontWeight:700, fontSize:15 }}>Doctor Registry</div>
      <div style={{ overflowX:'auto' }}>
        <table className="tbl">
          <thead><tr>{['Name','Speciality','Hospital','Reg. No.','Experience','Status',''].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {DOCTORS_DATA.map(([name,spec,hosp,reg,exp,status]) => (
              <tr key={reg}>
                <td style={{ fontWeight:700 }}>{name}</td>
                <td>{spec}</td>
                <td style={{ color:'var(--ink-500)' }}>{hosp}</td>
                <td style={{ fontFamily:'monospace', fontSize:12 }}>{reg}</td>
                <td>{exp}</td>
                <td><StatusBadge status={status as Hospital['status']} /></td>
                <td>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn-ghost btn-sm">View</button>
                    {status === 'pending' && <button className="btn-primary btn-sm">Approve</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── View: Approvals ─────────────────────────────────────────────────────────

const ApprovalIconPath: Record<string, string> = {
  'Hospital Registration':'M12 7V3H2v18h20V7H12zm-2 12H4v-2h6v2zm0-4H4v-2h6v2zm0-4H4V9h6v2zm0-4H4V5h6v2zm10 12h-8V9h8v10zm-2-8h-4v2h4v-2zm0 4h-4v2h4v-2z',
  'Doctor Credentials':    'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z',
  'Speciality Expansion':  'M13 7.5h5v2h-5zm0 7h5v2h-5zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8.5-6.25h-2v2h-2v-2h-2v-2h2v-2h2v2h2z',
  'Plan Upgrade':          'M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.58 1 13.5 3.08L12 4.58l-1.5-1.51C8.42 1 6 2.53 6 4.64c0 .48.11.92.18 1.36H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5.5-2.5c.72-.7 2.5-.21 2.5.97 0 .78-.59 1.53-1 2.03L14.2 8H12l2.5-4.5zM9 4.61c0-1.18 1.78-1.67 2.5-.97L14 8h-2.2C11.13 7.3 9 6.21 9 4.61zM4 19V8h6l4 4 4-4h6v11H4z',
};
const ApprovalIconColor: Record<string, [string,string]> = {
  'Hospital Registration': ['#1D4ED8','#DBEAFE'],
  'Doctor Credentials':    ['#0E7C66','#E0F3EE'],
  'Speciality Expansion':  ['#7c3aed','#ede9fe'],
  'Plan Upgrade':          ['#B45309','#FEF3C7'],
};

const ApprovalsView: React.FC = () => {
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const pending = APPROVALS.filter(a => !approved.has(a.id) && !rejected.has(a.id));
  return (
    <div style={{ padding:'24px 28px' }} className="vx-fade">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
        {([['Pending',pending.length,'var(--amber)','var(--amber-bg)'],
           ['Approved This Week','12','var(--mineral-700)','var(--mineral-100)'],
           ['Avg Review Time','4.2h','var(--blue)','var(--blue-bg)']] as [string,number|string,string,string][]).map(([l,v,c,bg]) => (
          <div key={l} className="kpi-card" style={{ background:bg, borderColor:'transparent' }}>
            <div className="kpi-label">{l}</div>
            <div className="kpi-value" style={{ color:c }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ padding:0 }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--ink-200)', fontWeight:700, fontSize:15 }}>
          Items Awaiting Review ({pending.length})
        </div>
        {pending.length === 0 && (
          <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--ink-500)' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>✓</div>
            <div style={{ fontWeight:700 }}>All caught up!</div>
            <div style={{ fontSize:13, marginTop:4 }}>No pending approvals.</div>
          </div>
        )}
        {pending.map(a => {
          const [iconColor, iconBg] = ApprovalIconColor[a.type] ?? ['#64748b','#f1f5f9'];
          return (
            <div key={a.id} className="approval-row">
              <div className="approval-icon" style={{ background:iconBg }}>
                <SvgIcon path={ApprovalIconPath[a.type] ?? ''} size={18} color={iconColor} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="approval-type">{a.type} · {a.id}</div>
                <div className="approval-name">{a.name}</div>
                <div className="approval-hosp">{a.hospital} · Submitted {a.submitted}</div>
                <div className="approval-docs">{a.docs} documents attached</div>
              </div>
              <span className={`badge badge-${a.priority}`}>{a.priority === 'high' ? '🔴 High Priority' : 'Normal'}</span>
              <div className="approval-actions">
                <button className="btn-ghost btn-sm">Review</button>
                <button className="btn-primary btn-sm" onClick={() => setApproved(s => new Set([...s, a.id]))}>Approve</button>
                <button className="btn-danger btn-sm" onClick={() => setRejected(s => new Set([...s, a.id]))}>Reject</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── View: Licenses ───────────────────────────────────────────────────────────

const LicensesView: React.FC = () => {
  const PLANS = [
    { plan:'Starter',      count:2, color:'var(--ink-500)', mrr:'₹0.8L', hospitals:['Orthocare Speciality (Suspended)','(1 inactive)'],
      features:['Up to 50 beds','Up to 20 doctors','Basic EMR','Email support'] },
    { plan:'Professional', count:3, color:'var(--blue)',    mrr:'₹3.9L', hospitals:['Maxcare Heart Institute','Greenfield Wellness','PedsFirst Children'],
      features:['Up to 300 beds','Up to 60 doctors','Full EMR + Pharmacy','Priority support','Analytics dashboard'] },
    { plan:'Enterprise',   count:1, color:'#7c3aed',        mrr:'₹3.2L', hospitals:['Apollo Multispecialty'],
      features:['Unlimited beds & doctors','All modules','Dedicated CSM','Custom integrations','SLA 99.9%'] },
  ];
  return (
    <div style={{ padding:'24px 28px' }} className="vx-fade">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:22 }}>
        {([['Total MRR','₹7.2L','var(--mineral-700)'],['Active Licences','6','var(--blue)'],['Expiring Soon','1','var(--amber)']] as [string,string,string][]).map(([l,v,c]) => (
          <div key={l} className="kpi-card"><div className="kpi-label">{l}</div><div className="kpi-value" style={{ color:c }}>{v}</div></div>
        ))}
      </div>
      <div className="lic-grid">
        {PLANS.map(p => (
          <div key={p.plan} className="lic-card">
            <div className="lic-plan" style={{ color:p.color }}>{p.plan}</div>
            <div className="lic-count" style={{ color:p.color }}>{p.count}<span style={{ fontSize:14, color:'var(--ink-400)', fontWeight:400 }}> hospitals</span></div>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--mineral-700)', marginBottom:14 }}>{p.mrr} / month</div>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--ink-400)', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.5px' }}>Features</div>
            {p.features.map(f => (
              <div key={f} className="lic-feature">
                <SvgIcon path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" size={13} color={p.color} />
                {f}
              </div>
            ))}
            <div style={{ marginTop:14, fontSize:12, color:'var(--ink-400)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Assigned To</div>
            {p.hospitals.map(h => (
              <div key={h} className="lic-detail" style={{ marginBottom:3 }}>• {h}</div>
            ))}
            <button className="btn-ghost" style={{ marginTop:14, width:'100%', justifyContent:'center' }}>Manage Licences</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── View: Activity Log ───────────────────────────────────────────────────────

const ActivityView: React.FC = () => {
  const EVENTS = [
    { text:'Sunrise General Hospital submitted 8 registration documents for review.',  time:'10:42 AM', color:'#3b82f6', actor:'System'    },
    { text:'Super Admin approved Dr. Arjun Mehta (Neurology) credentials.',            time:'10:15 AM', color:'#16a34a', actor:'You'        },
    { text:'Apollo Multispecialty added Dr. Riya Shah to the doctor registry.',        time:'09:50 AM', color:'#0d9488', actor:'Apollo IT'  },
    { text:'Maxcare Heart Institute requested upgrade to Enterprise plan.',             time:'08:30 AM', color:'#7c3aed', actor:'Maxcare IT' },
    { text:'Orthocare Speciality payment failed — account auto-suspended.',            time:'Yesterday 11:22 PM', color:'#e11d48', actor:'System' },
    { text:'PedsFirst Children added 3 new nurses to the staff registry.',             time:'Yesterday 04:30 PM', color:'#0d9488', actor:'PedsFirst' },
    { text:'Greenfield Wellness completed annual data export.',                         time:'Yesterday 02:00 PM', color:'#64748b', actor:'Greenfield' },
    { text:'Super Admin updated platform-wide notification settings.',                 time:'Apr 24, 2:15 PM', color:'#64748b', actor:'You' },
  ];
  return (
    <div style={{ padding:'24px 28px' }} className="vx-fade">
      <div className="card">
        <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Recent Platform Events</div>
        {EVENTS.map((e, i) => (
          <div key={i} className="activity-row">
            <div className="act-dot" style={{ background:e.color }} />
            <div style={{ flex:1 }}>
              <div className="act-text">{e.text}</div>
              <div style={{ fontSize:11.5, color:'var(--ink-400)', marginTop:2 }}>By: {e.actor}</div>
            </div>
            <div className="act-time">{e.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Hospital Registration Drawer ─────────────────────────────────────────────

const RegisterDrawer: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <>
    <div className="drawer-overlay" onClick={onClose} />
    <div className="drawer">
      <div className="drawer-header">
        <div className="drawer-title">Register New Hospital</div>
        <button className="btn-ghost btn-sm" onClick={onClose}>✕ Close</button>
      </div>
      <div className="drawer-body">
        <div className="field-row">
          <div><div className="field-label">Hospital Name</div><input className="field-input" placeholder="e.g. City Medical Centre" /></div>
          <div><div className="field-label">City</div><input className="field-input" placeholder="e.g. Hyderabad" /></div>
        </div>
        <div className="field-row">
          <div><div className="field-label">State</div><select className="field-select"><option>Telangana</option><option>Maharashtra</option><option>Tamil Nadu</option><option>Karnataka</option><option>Delhi</option></select></div>
          <div><div className="field-label">Hospital Type</div><select className="field-select"><option>Multi-speciality</option><option>General</option><option>Cardiac</option><option>Paediatric</option><option>Orthopaedic</option><option>Wellness</option></select></div>
        </div>
        <div className="field-row">
          <div><div className="field-label">Bed Count</div><input className="field-input" type="number" placeholder="e.g. 200" /></div>
          <div><div className="field-label">Subscription Plan</div><select className="field-select"><option>Starter</option><option>Professional</option><option>Enterprise</option></select></div>
        </div>
        <div className="field-full">
          <div className="field-label">Admin Contact Name</div>
          <input className="field-input" placeholder="Hospital admin full name" />
        </div>
        <div className="field-row">
          <div><div className="field-label">Admin Email</div><input className="field-input" type="email" placeholder="admin@hospital.com" /></div>
          <div><div className="field-label">Admin Phone</div><input className="field-input" placeholder="+91 XXXXX XXXXX" /></div>
        </div>
        <div className="field-full">
          <div className="field-label">NABH / Accreditation No.</div>
          <input className="field-input" placeholder="e.g. NABH/2024/MH/00182" />
        </div>
        <div className="field-full">
          <div className="field-label">Notes / Special Instructions</div>
          <textarea className="field-textarea" rows={3} placeholder="Any notes for the registration team…" />
        </div>
      </div>
      <div className="drawer-footer">
        <button className="btn-primary" style={{ flex:1, justifyContent:'center' }}>Submit Registration</button>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
      </div>
    </div>
  </>
);

// ─── Profile Modal ────────────────────────────────────────────────────────────

const ProfileModal: React.FC<{ adminName: string; adminRole: string; onClose: () => void }> = ({ adminName, adminRole, onClose }) => {
  const abb = initials(adminName);
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(11,15,14,0.3)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, backdropFilter:'blur(3px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#FAFAF7', borderRadius:16, padding:28, width:420, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(11,15,14,0.2)', border:'1px solid var(--ink-200)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
          <div style={{ width:60, height:60, borderRadius:'50%', background:'var(--mineral-700)', display:'flex', alignItems:'center', justifyContent:'center', color:'#FAFAF7', fontSize:22, fontWeight:700 }}>{abb}</div>
          <div>
            <div style={{ fontWeight:800, fontSize:17, color:'var(--ink-900)' }}>{adminName}</div>
            <div style={{ fontSize:13, color:'var(--ink-500)' }}>{adminRole} · Founders' Console</div>
          </div>
        </div>
        {[['Full Name',adminName],['Email','superadmin@vexoo.in'],['Phone','+91 99887 76655'],['Role',adminRole],['Access Level','Full Platform Access']].map(([label,val]) => (
          <div key={label} style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--ink-500)', marginBottom:5 }}>{label}</div>
            <input defaultValue={val} style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--ink-200)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', color:'var(--ink-900)', background:'var(--ink-050)' }} />
          </div>
        ))}
        <div style={{ display:'flex', gap:10, marginTop:20 }}>
          <button onClick={onClose} style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid var(--ink-200)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, color:'var(--ink-600)' }}>Close</button>
          <button style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'var(--mineral-700)', color:'#FAFAF7', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, fontWeight:600 }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────

export default function AdminScreen({
  adminName = 'Ravi Shankar',
  adminRole = 'Co-Founder & CTO',
  onSignOut,
}: SuperAdminScreenProps) {
  const [view, setView]         = useState<ViewId>('dashboard');
  const [showRegister, setReg]  = useState(false);
  const [showProfile, setProf]  = useState(false);
  const abb = initials(adminName);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setReg(false); setProf(false); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const [title, subtitle] = PAGE_TITLES[view];

  return (
    <div className="vx-admin">
      <style>{CSS}</style>

      {/* ── Top navigation bar ── */}
      <header className="topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight:900, fontSize:15, letterSpacing:'-0.4px' }}>Vexoo</div>
            <div style={{ fontSize:9.5, color:'rgba(255,255,255,0.4)', letterSpacing:'0.5px' }}>FOUNDERS' CONSOLE</div>
          </div>
        </div>
        <nav className="topbar-nav">
          {NAV_ITEMS.map(item => (
            <button key={item.id} className={`topbar-nav-btn ${view === item.id ? 'active' : ''}`} onClick={() => setView(item.id)}>
              <SvgIcon path={item.path} size={14} color="currentColor" />
              {item.label}
              {item.badge && <span className="topbar-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="topbar-spacer" />
        <div className="topbar-right">
          <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.35)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday:'short', year:'numeric', month:'short', day:'numeric' })}
          </div>
          <button className="topbar-alert-btn" aria-label="Notifications">
            <SvgIcon path="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" size={16} color="rgba(255,255,255,0.6)" />
            <span className="topbar-alert-dot" />
          </button>

          {/* ── Profile wrap — Patient-style hover card ── */}
          <div className="topbar-profile-wrap">
            <div className="topbar-profile-avatar" onClick={() => setProf(true)}>{abb}</div>
            <div className="topbar-profile-tooltip">
              <div className="vx-tt-avatar">{abb}</div>
              <div className="vx-tt-name">{adminName}</div>
              <div className="vx-tt-sub">{adminRole}</div>
              <div className="vx-tt-sub">superadmin@vexoo.in</div>
              <div className="vx-tt-divider" />
              <button className="vx-tt-action profile" onClick={() => setProf(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                View / Edit Profile
              </button>
              <button className="vx-tt-action signout" onClick={onSignOut}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <div className="page-title">{title}</div>
          <div className="page-subtitle">{subtitle}</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {view === 'hospitals' && (
            <button className="btn-primary" onClick={() => setReg(true)}>
              <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
              Register Hospital
            </button>
          )}
          {view === 'approvals' && (
            <span style={{ fontSize:13, color:'var(--amber)', fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--amber)', display:'inline-block' }} />
              5 pending items
            </span>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="main-area">
        {view === 'dashboard' && <DashboardView />}
        {view === 'hospitals' && <HospitalsView onRegister={() => setReg(true)} />}
        {view === 'doctors'   && <DoctorsView />}
        {view === 'approvals' && <ApprovalsView />}
        {view === 'licenses'  && <LicensesView />}
        {view === 'activity'  && <ActivityView />}
      </div>

      {/* ── Registration Drawer ── */}
      {showRegister && <RegisterDrawer onClose={() => setReg(false)} />}

      {/* ── Profile Modal ── */}
      {showProfile && <ProfileModal adminName={adminName} adminRole={adminRole} onClose={() => setProf(false)} />}
    </div>
  );
}
