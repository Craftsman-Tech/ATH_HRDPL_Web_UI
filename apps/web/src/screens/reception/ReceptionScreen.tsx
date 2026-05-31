/**
 * ============================================================================
 *  ReceptionScreen.tsx — Nurse / Receptionist Portal
 * ============================================================================
 *  Dark-themed portal for front-desk reception and ward nursing staff.
 *  Faithfully ported from Vexoo_Nurse_Receptionist.html reference design.
 *
 *  Tabs (7):
 *    Patient Check-In · Appointments · Vitals Monitor · Care Plans
 *    Shift Handover · My Tasks · Ward Overview
 *
 *  Route:           /reception  (protected, role === 'Receptionist')
 *  Suggested path:  apps/web/src/screens/reception/ReceptionScreen.tsx
 *
 *  Props:
 *    nurseName?  — from AuthContext (e.g. "Maria Lopez")
 *    onSignOut?  — called when Logout is clicked
 *
 *  Aesthetic: dark navy (#0f1629), pink accent (#ec4899 / #f472b6),
 *             glassmorphism panels, subtle grid + radial gradient overlays,
 *             Plus Jakarta Sans typeface.
 * ============================================================================
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId =
  | 'checkin' | 'schedule' | 'vitals' | 'careplans'
  | 'handover' | 'tasks' | 'ward';

type ChipVariant = 'waiting' | 'checkedin' | 'progress' | 'ready' | 'urgent' | 'upcoming';
type Priority    = 'high' | 'med' | 'low';

interface QueuePatient {
  id: string; initials: string; name: string; meta: string;
  status: ChipVariant; avatarColor: string;
}
interface Appointment {
  time: string; patient: string; detail: string; status: ChipVariant; dotColor: string;
}
interface VitalsPatient {
  name: string; room: string; doctor: string; recorded: string;
  status: ChipVariant;
  bp: { val: string; trend: string; color: string };
  hr: { val: string; trend: string; color: string };
  spo2: { val: string; trend: string; color: string };
  temp: { val: string; trend: string; color: string };
  rr: number; pain: number;
}
interface CarePlan {
  initials: string; name: string; plan: string;
  status: ChipVariant; avatarColor: string;
}
interface Task {
  id: number; text: string; dueTime: string; priority: Priority; done: boolean;
  patient?: string;
}
interface HandoverNote {
  initials: string; author: string; when: string; text: string;
}
interface BedSlot {
  id: string; label: string; patient?: string; doctor?: string;
  status?: ChipVariant; statusLabel?: string;
  color: string; borderColor: string; available?: boolean;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.nr-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #0f1629;
  color: white;
  height: 100vh;
  overflow: hidden;
  display: flex;
  position: relative;
}

/* ── Background effects ── */
.nr-root::before {
  content: '';
  position: fixed; inset: 0;
  background:
    radial-gradient(ellipse 70% 50% at 10% 20%, rgba(236,72,153,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 90% 80%, rgba(79,110,247,0.10) 0%, transparent 60%);
  pointer-events: none; z-index: 0;
}
.nr-root::after {
  content: '';
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none; z-index: 0;
}

/* ── Scrollbars ── */
.nr-root ::-webkit-scrollbar { width: 6px; }
.nr-root ::-webkit-scrollbar-track { background: transparent; }
.nr-root ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

/* ── Animations ── */
@keyframes nr-fade-up  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes nr-slide-in { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
@keyframes nr-pulse    { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
.nr-fade-up  { animation: nr-fade-up  0.4s ease both; }
.nr-slide-in { animation: nr-slide-in 0.3s ease both; }

/* ── Sidebar ── */
.nr-sidebar {
  width: 240px; flex-shrink: 0;
  background: rgba(255,255,255,0.03);
  border-right: 1px solid rgba(255,255,255,0.07);
  display: flex; flex-direction: column;
  position: relative; z-index: 10;
  padding: 0 0 24px;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
}
.nr-sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 24px 20px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.nr-logo-icon {
  width: 34px; height: 34px;
  background: linear-gradient(135deg,#4f6ef7,#0d9488);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.nr-role-badge {
  margin: 14px 16px;
  background: rgba(236,72,153,0.12);
  border: 1px solid rgba(236,72,153,0.25);
  border-radius: 10px; padding: 10px 14px;
  display: flex; align-items: center; gap: 10px;
}
.nr-role-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg,rgba(236,72,153,0.4),rgba(236,72,153,0.15));
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #f472b6; flex-shrink: 0;
}
.nr-nav-section {
  padding: 8px 12px 4px;
  font-size: 10px; font-weight: 700; letter-spacing: 1px;
  color: rgba(255,255,255,0.25); text-transform: uppercase;
}
.nr-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 16px; margin: 1px 8px;
  border-radius: 10px; cursor: pointer;
  font-size: 13.5px; font-weight: 500;
  color: rgba(255,255,255,0.5);
  transition: all 0.15s; border: none;
  background: transparent; font-family: inherit; width: calc(100% - 16px);
  text-align: left;
}
.nr-nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); }
.nr-nav-item.active { background: rgba(236,72,153,0.15); color: #f9a8d4; }
.nr-nav-item.active svg { color: #f472b6; }
.nr-nav-badge {
  margin-left: auto; background: #f472b6; color: #0f1629;
  font-size: 10px; font-weight: 800;
  border-radius: 20px; padding: 1px 7px; min-width: 20px; text-align: center;
}
.nr-nav-badge.warn   { background: #fbbf24; }
.nr-nav-badge.danger { background: #f87171; }
.nr-sidebar-footer {
  margin-top: auto; padding: 14px 16px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.nr-logout-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 14px; border-radius: 10px; width: 100%;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.45); font-size: 12.5px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; font-family: inherit;
}
.nr-logout-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }

/* mobile overlay */
.nr-overlay {
  display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9;
}
.nr-overlay.open { display: block; }
.nr-hamburger {
  display: none; background: none; border: none;
  cursor: pointer; padding: 4px; color: white;
  align-items: center; justify-content: center;
}

/* ── Main ── */
.nr-main {
  flex: 1; overflow-y: auto; position: relative; z-index: 1;
  display: flex; flex-direction: column;
}
.nr-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 32px; border-bottom: 1px solid rgba(255,255,255,0.06);
  position: sticky; top: 0; z-index: 5;
  background: rgba(15,22,41,0.85); backdrop-filter: blur(12px);
  gap: 12px;
}
.nr-page-title    { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
.nr-page-subtitle { font-size: 12.5px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.nr-topbar-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.nr-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; animation: nr-pulse 2s ease-in-out infinite; }
.nr-live-pill {
  display: flex; align-items: center; gap: 6px;
  font-size: 12.5px; color: rgba(255,255,255,0.45);
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; padding: 7px 12px;
}

/* ── Buttons ── */
.nr-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: 10px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  border: none; transition: all 0.15s; font-family: inherit;
}
.nr-btn-primary {
  background: linear-gradient(135deg,#ec4899,#be185d);
  color: white; box-shadow: 0 4px 14px rgba(236,72,153,0.3);
}
.nr-btn-primary:hover { box-shadow: 0 6px 20px rgba(236,72,153,0.45); transform: translateY(-1px); }
.nr-btn-ghost {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
}
.nr-btn-ghost:hover { background: rgba(255,255,255,0.1); }
.nr-btn-sm { padding: 5px 11px; font-size: 11.5px; }

/* ── Content area ── */
.nr-content { padding: 28px 32px; animation: nr-fade-up 0.4s ease both; }

/* ── Stat cards ── */
.nr-stats-row {
  display: grid; gap: 14px; margin-bottom: 26px;
  grid-template-columns: repeat(5, 1fr);
}
.nr-stat-card {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px; padding: 18px 20px;
}
.nr-stat-label { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
.nr-stat-value { font-size: 28px; font-weight: 800; line-height: 1; }
.nr-stat-sub   { font-size: 11.5px; color: rgba(255,255,255,0.35); margin-top: 4px; }

/* ── Grid layouts ── */
.nr-two-col   { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 18px; margin-bottom: 18px; }
.nr-three-col { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; margin-bottom: 18px; }

/* ── Panels ── */
.nr-panel {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px; overflow: hidden;
}
.nr-panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
}
.nr-panel-title { font-size: 14px; font-weight: 700; }
.nr-panel-sub   { font-size: 11.5px; color: rgba(255,255,255,0.4); margin-top: 1px; }
.nr-panel-body  { padding: 16px 20px; }

/* ── Status chips ── */
.nr-chip {
  padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
  white-space: nowrap; flex-shrink: 0;
}
.nr-chip-waiting   { background: rgba(251,191,36,0.15);  color: #fbbf24; }
.nr-chip-checkedin { background: rgba(74,222,128,0.15);  color: #4ade80; }
.nr-chip-progress  { background: rgba(96,165,250,0.15);  color: #60a5fa; }
.nr-chip-ready     { background: rgba(196,132,252,0.15); color: #c084fc; }
.nr-chip-urgent    { background: rgba(248,113,113,0.15); color: #f87171; }
.nr-chip-upcoming  { background: rgba(148,163,184,0.15); color: #94a3b8; }

/* ── Queue rows ── */
.nr-queue-row {
  display: flex; align-items: center; gap: 14px;
  padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
}
.nr-queue-row:last-child { border-bottom: none; }
.nr-q-avatar {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
}
.nr-q-name { font-size: 13.5px; font-weight: 600; }
.nr-q-meta { font-size: 11.5px; color: rgba(255,255,255,0.4); margin-top: 1px; }

/* ── Appointment rows ── */
.nr-appt-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
}
.nr-appt-row:last-child { border-bottom: none; }
.nr-appt-time {
  width: 52px; text-align: center; flex-shrink: 0;
  font-size: 12px; font-weight: 700; color: #f9a8d4;
  background: rgba(236,72,153,0.1); border-radius: 8px; padding: 5px 4px;
}
.nr-appt-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.nr-appt-patient { font-size: 13px; font-weight: 600; }
.nr-appt-detail  { font-size: 11.5px; color: rgba(255,255,255,0.4); margin-top: 1px; }

/* ── Vitals ── */
.nr-vitals-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
}
.nr-vital-box {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px; padding: 14px;
}
.nr-vital-label { font-size: 10.5px; color: rgba(255,255,255,0.4); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.nr-vital-val   { font-size: 20px; font-weight: 800; }
.nr-vital-unit  { font-size: 12px; color: rgba(255,255,255,0.4); margin-left: 3px; }
.nr-vital-trend { font-size: 11px; margin-top: 3px; }

/* ── Task rows ── */
.nr-task-row {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
}
.nr-task-row:last-child { border-bottom: none; }
.nr-task-check {
  width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0; margin-top: 1px;
  border: 1.5px solid rgba(255,255,255,0.2); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; background: transparent;
}
.nr-task-check.done { background: #f472b6; border-color: #f472b6; }
.nr-task-text { font-size: 13px; font-weight: 500; flex: 1; }
.nr-task-text.done { text-decoration: line-through; color: rgba(255,255,255,0.3); }
.nr-task-time { font-size: 11px; color: rgba(255,255,255,0.35); white-space: nowrap; margin-top: 1px; }
.nr-task-priority { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }
.nr-prio-high { background: rgba(248,113,113,0.15); color: #f87171; }
.nr-prio-med  { background: rgba(251,191,36,0.15);  color: #fbbf24; }
.nr-prio-low  { background: rgba(74,222,128,0.12);  color: #4ade80; }
.nr-prio-done { background: rgba(74,222,128,0.12);  color: #4ade80; }

/* ── Handover notes ── */
.nr-note-card {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;
}
.nr-note-card:last-child { margin-bottom: 0; }
.nr-note-meta   { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
.nr-note-author { font-size: 12px; font-weight: 700; }
.nr-note-when   { font-size: 11px; color: rgba(255,255,255,0.35); }
.nr-note-text   { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.6; }
.nr-note-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  background: linear-gradient(135deg,rgba(236,72,153,0.4),rgba(236,72,153,0.15));
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: #f472b6; flex-shrink: 0;
}

/* ── Forms ── */
.nr-form-field  { margin-bottom: 14px; }
.nr-form-label  { font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,0.5); margin-bottom: 6px; display: block; }
.nr-form-input, .nr-form-select, .nr-form-textarea {
  width: 100%; padding: 9px 12px; border-radius: 10px;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  color: white; font-family: inherit; font-size: 13.5px; outline: none;
  transition: border-color 0.15s;
}
.nr-form-input:focus, .nr-form-select:focus, .nr-form-textarea:focus {
  border-color: rgba(236,72,153,0.5);
}
.nr-form-input::placeholder, .nr-form-textarea::placeholder { color: rgba(255,255,255,0.25); }
.nr-form-select { appearance: none; cursor: pointer; }
.nr-form-select option { background: #1a2440; }
.nr-form-textarea { resize: none; }
.nr-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.nr-radio-row { display: flex; gap: 16px; align-items: center; }
.nr-radio-label { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; }

/* ── Ward bed cards ── */
.nr-bed-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.nr-bed-card { border-radius: 14px; padding: 16px; }
.nr-bed-label { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4); margin-bottom: 8px; }
.nr-bed-patient { font-size: 15px; font-weight: 800; margin-bottom: 4px; }
.nr-bed-doctor  { font-size: 12px; color: rgba(255,255,255,0.45); margin-bottom: 10px; }
.nr-bed-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 8px; min-height: 100px;
  background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.1);
  border-radius: 14px; padding: 16px;
}
.nr-bed-empty-label { font-size: 12px; color: rgba(255,255,255,0.25); font-weight: 600; }

/* ── Responsive ── */
@media (max-width: 1080px) {
  .nr-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 20;
    transform: translateX(-100%);
  }
  .nr-sidebar.mobile-open { transform: translateX(0); }
  .nr-hamburger { display: flex !important; }
  .nr-topbar { padding: 14px 16px; }
  .nr-stats-row { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 760px) {
  .nr-content { padding: 16px; }
  .nr-stats-row { grid-template-columns: repeat(2, 1fr); }
  .nr-stats-4col { grid-template-columns: repeat(2, 1fr) !important; }
  .nr-two-col   { grid-template-columns: 1fr !important; }
  .nr-three-col { grid-template-columns: 1fr !important; }
  .nr-bed-grid  { grid-template-columns: repeat(2, 1fr); }
  .nr-form-row  { grid-template-columns: 1fr; }
}
`;

// ─── Mock data ────────────────────────────────────────────────────────────────

const QUEUE: QueuePatient[] = [
  { id:'MK', initials:'MK', name:'Mohammed Khan',  meta:'Waiting 28 min · Dr. Patel · Cardiology', status:'urgent',    avatarColor:'rgba(248,113,113,0.15)', },
  { id:'AL', initials:'AL', name:'Anna Lindqvist',  meta:'Waiting 21 min · Dr. Chen · General',    status:'waiting',   avatarColor:'rgba(251,191,36,0.15)',  },
  { id:'RB', initials:'RB', name:'Robert Baines',   meta:'Arrived 09:30 · Dr. Osei · Ortho',       status:'checkedin', avatarColor:'rgba(74,222,128,0.15)', },
  { id:'YM', initials:'YM', name:'Yuki Matsuda',    meta:'With doctor · Dr. Chen · Room 4',         status:'progress',  avatarColor:'rgba(96,165,250,0.15)', },
  { id:'FN', initials:'FN', name:'Fatima Nour',     meta:'Waiting 9 min · Dr. Patel · Follow-up',  status:'waiting',   avatarColor:'rgba(196,132,252,0.15)',},
  { id:'JT', initials:'JT', name:'James Thornton',  meta:'Waiting 5 min · Dr. Osei · Wellness',    status:'waiting',   avatarColor:'rgba(251,191,36,0.15)', },
  { id:'PR', initials:'PR', name:'Priya Rao',       meta:'Tests ready · Room 2 · Post-consult',     status:'ready',     avatarColor:'rgba(196,132,252,0.15)',},
];

const APPOINTMENTS: Appointment[] = [
  { time:'08:00', patient:'Robert Baines',   detail:'Dr. Osei · Ortho · Room 3 · 30 min',          status:'checkedin', dotColor:'#4ade80'  },
  { time:'08:30', patient:'Yuki Matsuda',    detail:'Dr. Chen · General · Room 4 · 20 min',         status:'progress',  dotColor:'#60a5fa'  },
  { time:'09:00', patient:'Mohammed Khan',   detail:'Dr. Patel · Cardiology · Room 1 · 45 min',     status:'urgent',    dotColor:'#f87171'  },
  { time:'09:15', patient:'Anna Lindqvist',  detail:'Dr. Chen · General · Room 4 · 20 min',         status:'waiting',   dotColor:'#fbbf24'  },
  { time:'09:30', patient:'Fatima Nour',     detail:'Dr. Patel · Follow-up · Room 1 · 15 min',      status:'waiting',   dotColor:'#fbbf24'  },
  { time:'10:00', patient:'James Thornton',  detail:'Dr. Osei · Wellness · Room 3 · 30 min',        status:'checkedin', dotColor:'#c084fc'  },
  { time:'10:30', patient:'Clare Hutchins',  detail:'Dr. Williams · Neurology · Room 2 · 60 min',   status:'upcoming',  dotColor:'#94a3b8'  },
  { time:'11:00', patient:'David Okafor',    detail:'Dr. Patel · Cardio review · Room 1 · 30 min',  status:'upcoming',  dotColor:'#94a3b8'  },
];

const VITALS_PATIENTS: VitalsPatient[] = [
  {
    name:'Mohammed Khan', room:'Room 1', doctor:'Dr. Patel', recorded:'09:40', status:'urgent',
    bp:   { val:'158/94', trend:'↑ High',    color:'#f87171' },
    hr:   { val:'96',     trend:'↑ Elevated',color:'#fbbf24' },
    spo2: { val:'97',     trend:'✓ Normal',  color:'#4ade80' },
    temp: { val:'37.1',   trend:'✓ Normal',  color:'#4ade80' },
    rr:6, pain:6,
  },
  {
    name:'Yuki Matsuda', room:'Room 4', doctor:'Dr. Chen', recorded:'09:25', status:'progress',
    bp:   { val:'118/76', trend:'✓ Normal', color:'#4ade80' },
    hr:   { val:'72',     trend:'✓ Normal', color:'#4ade80' },
    spo2: { val:'99',     trend:'✓ Normal', color:'#4ade80' },
    temp: { val:'36.8',   trend:'✓ Normal', color:'#4ade80' },
    rr:16, pain:2,
  },
  {
    name:'Robert Baines', room:'Room 3', doctor:'Dr. Osei', recorded:'08:05', status:'checkedin',
    bp:   { val:'122/80', trend:'✓ Normal', color:'#4ade80' },
    hr:   { val:'68',     trend:'✓ Normal', color:'#4ade80' },
    spo2: { val:'98',     trend:'✓ Normal', color:'#4ade80' },
    temp: { val:'37.8',   trend:'↑ Slight', color:'#fbbf24' },
    rr:17, pain:3,
  },
];

const CARE_PLANS: CarePlan[] = [
  { initials:'MK', name:'Mohammed Khan', plan:'Hypertension management · Started Apr 28', status:'urgent',    avatarColor:'rgba(248,113,113,0.15)', },
  { initials:'YM', name:'Yuki Matsuda',  plan:'Post-op recovery · Started May 1',          status:'progress',  avatarColor:'rgba(96,165,250,0.15)', },
  { initials:'RB', name:'Robert Baines', plan:'Fracture rehabilitation · Started Apr 20',  status:'checkedin', avatarColor:'rgba(74,222,128,0.15)', },
  { initials:'FN', name:'Fatima Nour',   plan:'Diabetes monitoring · Started Apr 10',      status:'checkedin', avatarColor:'rgba(196,132,252,0.15)',},
];

const HANDOVER_NOTES: HandoverNote[] = [
  { initials:'TJ', author:'Nurse T. James', when:'07:45 AM · Night → Morning handover', text:"Mohammed Khan (Room 1) had an elevated BP reading at 3am — 162/96. Dr. Patel was notified and ordered an extra dose of Amlodipine. Patient is resting but needs close monitoring this morning. BP cuff alert set for every 30 mins." },
  { initials:'TJ', author:'Nurse T. James', when:'07:50 AM · Ward update',               text:"Yuki Matsuda (Room 4) post-op dressing changed at 06:00. No signs of infection. Drain output was 15ml overnight — within expected range. Next dressing review due at noon." },
  { initials:'TJ', author:'Nurse T. James', when:'07:55 AM · General note',              text:"Crash trolley in Bay B was restocked at 05:30 and checked by on-call doctor. Defibrillator pads replaced. Equipment checklist signed and filed." },
];

const INITIAL_TASKS: Task[] = [
  { id:1, text:'Re-check BP — Mohammed Khan (Room 1)',            dueTime:'Due: 10:00 AM', priority:'high', done:false, patient:'Mohammed Khan'  },
  { id:2, text:'Midday dressing change — Yuki Matsuda (Room 4)',  dueTime:'Due: 12:00 PM', priority:'high', done:false, patient:'Yuki Matsuda'   },
  { id:3, text:'Confirm lab results for Robert Baines',           dueTime:'Due: 11:00 AM', priority:'med',  done:false, patient:'Robert Baines'  },
  { id:4, text:'Remind Fatima Nour to complete glucose log',      dueTime:'Due: 10:30 AM', priority:'med',  done:false, patient:'Fatima Nour'    },
  { id:5, text:'Morning vitals round complete',                   dueTime:'Done: 08:45 AM',priority:'low',  done:true  },
  { id:6, text:'Handover notes reviewed',                         dueTime:'Done: 08:00 AM',priority:'low',  done:true  },
];

const BEDS: BedSlot[] = [
  { id:'r1', label:'ROOM 1', patient:'Mohammed Khan', doctor:'Dr. Patel · Cardiology', status:'urgent',    statusLabel:'URGENT — BP High', color:'rgba(248,113,113,0.08)', borderColor:'rgba(248,113,113,0.2)' },
  { id:'r2', label:'ROOM 2', patient:'Clare Hutchins', doctor:'Dr. Williams · Neurology', status:'progress', statusLabel:'Awaiting Scan',   color:'rgba(96,165,250,0.08)',  borderColor:'rgba(96,165,250,0.2)'  },
  { id:'r3', label:'ROOM 3', patient:'Robert Baines', doctor:'Dr. Osei · Orthopaedics', status:'checkedin', statusLabel:'Stable',          color:'rgba(74,222,128,0.08)',  borderColor:'rgba(74,222,128,0.2)'  },
  { id:'r4', label:'ROOM 4', patient:'Yuki Matsuda',  doctor:'Dr. Chen · Post-Op',      status:'progress',  statusLabel:'In Consult',      color:'rgba(96,165,250,0.08)',  borderColor:'rgba(96,165,250,0.2)'  },
  { id:'ba', label:'BAY A',  patient:'Fatima Nour',   doctor:'Dr. Patel · Follow-Up',   status:'waiting',   statusLabel:'Waiting Rx',      color:'rgba(196,132,252,0.08)',  borderColor:'rgba(196,132,252,0.2)'},
  { id:'bb', label:'BAY B',  patient:'James Thornton',doctor:'Dr. Osei · Wellness',     status:'checkedin', statusLabel:'Checked In',      color:'rgba(251,191,36,0.08)',  borderColor:'rgba(251,191,36,0.2)'  },
  { id:'r5', label:'ROOM 5 — Available', available:true, color:'', borderColor:'' },
  { id:'bc', label:'BAY C — Available',  available:true, color:'', borderColor:'' },
];

// ─── Tab config ───────────────────────────────────────────────────────────────

interface TabConfig { id: TabId; label: string; iconPath: string; badge?: string; badgeClass?: string; section: string; }

const TABS: TabConfig[] = [
  { id:'checkin',   label:'Patient Check-In', iconPath:'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z', badge:'7', section:'Reception' },
  { id:'schedule',  label:'Appointments',     iconPath:'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z', badge:'3', badgeClass:'warn', section:'Reception' },
  { id:'vitals',    label:'Vitals Monitor',   iconPath:'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z', section:'Clinical' },
  { id:'careplans', label:'Care Plans',       iconPath:'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z', section:'Clinical' },
  { id:'handover',  label:'Shift Handover',   iconPath:'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z', badge:'2', section:'Clinical' },
  { id:'tasks',     label:'My Tasks',         iconPath:'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', badge:'4', badgeClass:'danger', section:'Clinical' },
  { id:'ward',      label:'Ward Overview',    iconPath:'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z', section:'Ward' },
];

const PAGE_LABELS: Record<TabId, [string, string]> = {
  checkin:   ['Patient Check-In',  'Live queue & walk-in registration'],
  schedule:  ['Appointments',      "Today's schedule — May 2, 2026"],
  vitals:    ['Vitals Monitor',    'Record & review patient observations'],
  careplans: ['Care Plans',        'Active plans — Ward B'],
  handover:  ['Shift Handover',    'Incoming notes & outgoing log'],
  tasks:     ['My Tasks',         'Morning shift task list'],
  ward:      ['Ward Overview',    'Ward B — bed status & staff'],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) { return name.split(' ').map(n => n[0]).join(''); }

function Chip({ status, label }: { status: ChipVariant; label?: string }) {
  const labels: Record<ChipVariant, string> = {
    waiting:'Waiting', checkedin:'Checked In', progress:'In Progress',
    ready:'Ready', urgent:'URGENT', upcoming:'Upcoming',
  };
  return <span className={`nr-chip nr-chip-${status}`}>{label ?? labels[status]}</span>;
}

function SvgIcon({ path, size = 16, color = 'currentColor' }: { path: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d={path} />
    </svg>
  );
}

// ─── Tab: Check-In ────────────────────────────────────────────────────────────

const CheckInTab: React.FC = () => {
  const [search, setSearch] = useState('');
  return (
    <div className="nr-content">
      {/* Stats */}
      <div className="nr-stats-row">
        {([['Waiting','7','#fbbf24','In queue now'],['Checked In','18','#4ade80','Today total'],
           ['Avg Wait','12','#f472b6','This morning'],['Appts Today','34','#60a5fa','Scheduled'],
           ['No-Shows','2','#f87171','So far today']] as [string,string,string,string][]).map(([l,v,c,s]) => (
          <div key={l} className="nr-stat-card">
            <div className="nr-stat-label">{l}</div>
            <div className="nr-stat-value" style={{ color: c }}>{v}{l==='Avg Wait'&&<span style={{ fontSize:14, color:'rgba(255,255,255,0.4)' }}>min</span>}</div>
            <div className="nr-stat-sub">{s}</div>
          </div>
        ))}
      </div>

      <div className="nr-two-col">
        {/* Queue */}
        <div className="nr-panel">
          <div className="nr-panel-header">
            <div>
              <div className="nr-panel-title">Patient Queue</div>
              <div className="nr-panel-sub">Live waiting list — updated in real time</div>
            </div>
            <button className="nr-btn nr-btn-ghost" style={{ padding:'6px 12px', fontSize:12 }}>Refresh</button>
          </div>
          <div className="nr-panel-body">
            {QUEUE.map((q, i) => (
              <div key={q.id} className="nr-queue-row nr-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="nr-q-avatar" style={{ background: q.avatarColor, color: q.status === 'urgent' ? '#f87171' : q.status === 'waiting' ? '#fbbf24' : q.status === 'checkedin' ? '#4ade80' : q.status === 'progress' ? '#60a5fa' : '#c084fc' }}>
                  {q.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nr-q-name">{q.name}</div>
                  <div className="nr-q-meta">{q.meta}</div>
                </div>
                <Chip status={q.status} />
                <button className="nr-btn nr-btn-ghost nr-btn-sm">
                  {q.status === 'waiting' || q.status === 'urgent' ? 'Check In' : 'View'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Check-In form */}
        <div className="nr-panel">
          <div className="nr-panel-header">
            <div>
              <div className="nr-panel-title">Quick Check-In</div>
              <div className="nr-panel-sub">Walk-in or appointment arrival</div>
            </div>
          </div>
          <div className="nr-panel-body">
            <div className="nr-form-field">
              <label className="nr-form-label">Patient Name or ID</label>
              <input className="nr-form-input" type="text" placeholder="Search by name, DOB or patient ID…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="nr-form-row">
              <div className="nr-form-field">
                <label className="nr-form-label">Arrival Time</label>
                <input className="nr-form-input" type="time" defaultValue="09:42" />
              </div>
              <div className="nr-form-field">
                <label className="nr-form-label">Visit Type</label>
                <select className="nr-form-select">
                  <option>Scheduled Appt</option><option>Walk-In</option>
                  <option>Emergency</option><option>Follow-Up</option>
                </select>
              </div>
            </div>
            <div className="nr-form-field">
              <label className="nr-form-label">Assigned Doctor</label>
              <select className="nr-form-select">
                <option>Dr. Patel · Cardiology</option><option>Dr. Chen · General</option>
                <option>Dr. Osei · Orthopaedics</option><option>Dr. Williams · Neurology</option>
              </select>
            </div>
            <div className="nr-form-row">
              <div className="nr-form-field">
                <label className="nr-form-label">Room / Bay</label>
                <select className="nr-form-select">
                  <option>— Assign —</option><option>Room 1</option><option>Room 2</option>
                  <option>Room 3</option><option>Room 4</option><option>Bay A</option><option>Bay B</option>
                </select>
              </div>
              <div className="nr-form-field">
                <label className="nr-form-label">Priority</label>
                <select className="nr-form-select">
                  <option>Normal</option><option>Urgent</option><option>Emergency</option>
                </select>
              </div>
            </div>
            <div className="nr-form-field">
              <label className="nr-form-label">Chief Complaint / Notes</label>
              <textarea className="nr-form-textarea" rows={3} placeholder="Brief reason for visit…" />
            </div>
            <button className="nr-btn nr-btn-primary" style={{ width:'100%', justifyContent:'center' }}>
              <SvgIcon path="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" color="white" />
              Confirm Check-In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Tab: Appointments ────────────────────────────────────────────────────────

const ScheduleTab: React.FC = () => (
  <div className="nr-content">
    <div className="nr-stats-row nr-stats-4col" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
      {([['Total Today','34','#60a5fa','Scheduled'],['Confirmed','29','#4ade80','Responded'],
         ['Unconfirmed','3','#fbbf24','Awaiting reply'],['Cancelled','2','#f87171','Today']] as [string,string,string,string][]).map(([l,v,c,s]) => (
        <div key={l} className="nr-stat-card">
          <div className="nr-stat-label">{l}</div>
          <div className="nr-stat-value" style={{ color:c }}>{v}</div>
          <div className="nr-stat-sub">{s}</div>
        </div>
      ))}
    </div>
    <div className="nr-two-col">
      <div className="nr-panel">
        <div className="nr-panel-header">
          <div><div className="nr-panel-title">Today's Schedule</div><div className="nr-panel-sub">Morning shift · May 2, 2026</div></div>
          <button className="nr-btn nr-btn-primary" style={{ padding:'6px 14px', fontSize:12 }}>+ Book Slot</button>
        </div>
        <div className="nr-panel-body">
          {APPOINTMENTS.map(a => (
            <div key={a.time + a.patient} className="nr-appt-row">
              <div className="nr-appt-time">{a.time}</div>
              <div className="nr-appt-dot" style={{ background: a.dotColor }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div className="nr-appt-patient">{a.patient}</div>
                <div className="nr-appt-detail">{a.detail}</div>
              </div>
              <Chip status={a.status} label={a.status === 'checkedin' ? 'Present' : a.status === 'upcoming' ? 'Upcoming' : undefined} />
            </div>
          ))}
        </div>
      </div>
      <div className="nr-panel">
        <div className="nr-panel-header">
          <div><div className="nr-panel-title">Book Appointment</div><div className="nr-panel-sub">Schedule a new slot</div></div>
        </div>
        <div className="nr-panel-body">
          <div className="nr-form-field"><label className="nr-form-label">Patient</label><input className="nr-form-input" type="text" placeholder="Search patient…" /></div>
          <div className="nr-form-row">
            <div className="nr-form-field"><label className="nr-form-label">Date</label><input className="nr-form-input" type="date" defaultValue="2026-05-02" /></div>
            <div className="nr-form-field"><label className="nr-form-label">Time</label><input className="nr-form-input" type="time" defaultValue="10:00" /></div>
          </div>
          <div className="nr-form-field">
            <label className="nr-form-label">Doctor</label>
            <select className="nr-form-select"><option>Dr. Patel · Cardiology</option><option>Dr. Chen · General</option><option>Dr. Osei · Orthopaedics</option><option>Dr. Williams · Neurology</option></select>
          </div>
          <div className="nr-form-row">
            <div className="nr-form-field"><label className="nr-form-label">Duration</label><select className="nr-form-select"><option>15 min</option><option>20 min</option><option>30 min</option><option>45 min</option><option>60 min</option></select></div>
            <div className="nr-form-field"><label className="nr-form-label">Type</label><select className="nr-form-select"><option>Consultation</option><option>Follow-Up</option><option>Procedure</option><option>Wellness</option></select></div>
          </div>
          <div className="nr-form-field"><label className="nr-form-label">Notes</label><textarea className="nr-form-textarea" rows={3} placeholder="Additional notes…" /></div>
          <button className="nr-btn nr-btn-primary" style={{ width:'100%', justifyContent:'center' }}>Schedule Appointment</button>
        </div>
      </div>
    </div>
  </div>
);

// ─── Tab: Vitals ──────────────────────────────────────────────────────────────

const VitalsTab: React.FC = () => {
  const [rrValues, setRrValues] = useState(VITALS_PATIENTS.map(p => p.rr));
  const [painValues, setPainValues] = useState(VITALS_PATIENTS.map(p => p.pain));
  return (
    <div className="nr-content">
      <div className="nr-three-col">
        {VITALS_PATIENTS.map((p, idx) => (
          <div key={p.name} className="nr-panel">
            <div className="nr-panel-header">
              <div><div className="nr-panel-title">{p.name}</div><div className="nr-panel-sub">{p.room} · {p.doctor} · Recorded {p.recorded}</div></div>
              <Chip status={p.status} label={p.status === 'checkedin' ? 'Stable' : undefined} />
            </div>
            <div className="nr-panel-body">
              <div className="nr-vitals-grid">
                {([['Blood Pressure', p.bp.val, '',    p.bp.trend,   p.bp.color],
                   ['Heart Rate',     p.hr.val, 'bpm', p.hr.trend,   p.hr.color],
                   ['SpO₂',          p.spo2.val,'%',  p.spo2.trend, p.spo2.color],
                   ['Temperature',   p.temp.val,'°C',  p.temp.trend, p.temp.color]] as [string,string,string,string,string][]).map(([label,val,unit,trend,color]) => (
                  <div key={label} className="nr-vital-box">
                    <div className="nr-vital-label">{label}</div>
                    <div className="nr-vital-val" style={{ color }}>
                      {val}<span className="nr-vital-unit">{unit}</span>
                    </div>
                    <div className="nr-vital-trend" style={{ color }}>{trend}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12 }}>
                <div className="nr-form-field">
                  <label className="nr-form-label">Respiratory Rate <span style={{ color:'rgba(255,255,255,0.3)' }}>(breaths/min)</span></label>
                  <input className="nr-form-input" type="number" value={rrValues[idx]}
                    onChange={e => setRrValues(v => v.map((x,i) => i===idx ? +e.target.value : x))} />
                </div>
                <div className="nr-form-field">
                  <label className="nr-form-label">Pain Score <span style={{ color:'rgba(255,255,255,0.3)' }}>(0-10)</span></label>
                  <input className="nr-form-input" type="number" value={painValues[idx]} min={0} max={10}
                    onChange={e => setPainValues(v => v.map((x,i) => i===idx ? +e.target.value : x))} />
                </div>
                <button className="nr-btn nr-btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:4 }}>Save Vitals</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Tab: Care Plans ──────────────────────────────────────────────────────────

type CarePlanGoal = { text: string; done: boolean; priority: Priority };

const PLAN_GOALS: CarePlanGoal[] = [
  { text:'BP below 140/90 within 2 weeks',         done:true,  priority:'high' },
  { text:'Daily BP monitoring logged',              done:true,  priority:'med'  },
  { text:'Patient education — diet & sodium',      done:false, priority:'med'  },
  { text:'Referral to cardiologist if no improvement', done:false, priority:'high' },
];

const CarePlansTab: React.FC = () => {
  const [goals, setGoals] = useState<CarePlanGoal[]>(PLAN_GOALS);
  const toggleGoal = (i: number) => setGoals(g => g.map((x, j) => j === i ? { ...x, done: !x.done } : x));
  return (
    <div className="nr-content">
      <div className="nr-two-col">
        <div className="nr-panel">
          <div className="nr-panel-header">
            <div><div className="nr-panel-title">Active Care Plans</div><div className="nr-panel-sub">Ward B — ongoing</div></div>
            <button className="nr-btn nr-btn-primary" style={{ padding:'6px 14px', fontSize:12 }}>+ New Plan</button>
          </div>
          <div className="nr-panel-body">
            {CARE_PLANS.map(cp => (
              <div key={cp.name} className="nr-queue-row">
                <div className="nr-q-avatar" style={{ background:cp.avatarColor, color: cp.status==='urgent'?'#f87171':cp.status==='progress'?'#60a5fa':'#4ade80' }}>{cp.initials}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="nr-q-name">{cp.name}</div>
                  <div className="nr-q-meta">{cp.plan}</div>
                </div>
                <Chip status={cp.status} label={cp.status==='checkedin'?'On Track':cp.status==='progress'?'Review Due':undefined} />
                <button className="nr-btn nr-btn-ghost nr-btn-sm">View</button>
              </div>
            ))}
          </div>
        </div>
        <div className="nr-panel">
          <div className="nr-panel-header">
            <div><div className="nr-panel-title">Mohammed Khan — Care Plan</div><div className="nr-panel-sub">Hypertension Management</div></div>
          </div>
          <div className="nr-panel-body">
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>Goals</div>
            {goals.map((g, i) => (
              <div key={i} className="nr-task-row">
                <button className={`nr-task-check ${g.done ? 'done' : ''}`} onClick={() => toggleGoal(i)}>
                  {g.done && <SvgIcon path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" size={10} color="white" />}
                </button>
                <div style={{ flex:1 }}>
                  <div className={`nr-task-text ${g.done ? 'done' : ''}`}>{g.text}</div>
                </div>
                <span className={`nr-task-priority nr-prio-${g.priority}`}>{g.priority === 'high' ? 'High' : 'Med'}</span>
              </div>
            ))}
            <div style={{ marginTop:16, fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>Medications</div>
            {[['Amlodipine 5mg','Once daily · Morning · With food'],['Ramipril 2.5mg','Once daily · Evening · Monitor potassium']].map(([name, schedule]) => (
              <div key={name} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 14px', marginBottom:8 }}>
                <div style={{ fontSize:13, fontWeight:700 }}>{name}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>{schedule}</div>
              </div>
            ))}
            <button className="nr-btn nr-btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:16 }}>Update Care Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Tab: Handover ────────────────────────────────────────────────────────────

const HandoverTab: React.FC = () => {
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  return (
    <div className="nr-content">
      <div className="nr-two-col">
        <div className="nr-panel">
          <div className="nr-panel-header">
            <div><div className="nr-panel-title">Incoming Handover Notes</div><div className="nr-panel-sub">From Night Shift · Nurse T. James</div></div>
          </div>
          <div className="nr-panel-body">
            {HANDOVER_NOTES.map((n, i) => (
              <div key={i} className="nr-note-card">
                <div className="nr-note-meta">
                  <div className="nr-note-avatar">{n.initials}</div>
                  <span className="nr-note-author">{n.author}</span>
                  <span className="nr-note-when">{n.when}</span>
                </div>
                <div className="nr-note-text">{n.text}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="nr-panel">
          <div className="nr-panel-header">
            <div><div className="nr-panel-title">Write Handover Note</div><div className="nr-panel-sub">For outgoing shift — Evening Team</div></div>
          </div>
          <div className="nr-panel-body">
            <div className="nr-form-field">
              <label className="nr-form-label">Patient (optional)</label>
              <select className="nr-form-select">
                <option value="">— Ward-wide note —</option>
                <option>Mohammed Khan · Room 1</option><option>Yuki Matsuda · Room 4</option>
                <option>Robert Baines · Room 3</option><option>Fatima Nour · Bay A</option>
              </select>
            </div>
            <div className="nr-form-field">
              <label className="nr-form-label">Priority</label>
              <div className="nr-radio-row">
                {(['normal','important','urgent'] as const).map(p => (
                  <label key={p} className="nr-radio-label">
                    <input type="radio" name="handover-prio" value={p} checked={priority===p} onChange={() => setPriority(p)} />
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="nr-form-field">
              <label className="nr-form-label">Note</label>
              <textarea className="nr-form-textarea" rows={7} placeholder="Describe patient status, outstanding tasks, medication changes, concerns for next shift…" />
            </div>
            <div className="nr-form-field">
              <label className="nr-form-label">Flag for Doctor</label>
              <select className="nr-form-select">
                <option value="">— None —</option>
                <option>Dr. Patel</option><option>Dr. Chen</option><option>Dr. Osei</option><option>Dr. Williams</option>
              </select>
            </div>
            <button className="nr-btn nr-btn-primary" style={{ width:'100%', justifyContent:'center' }}>Submit Handover Note</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Tab: Tasks ───────────────────────────────────────────────────────────────

const TasksTab: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('high');

  const toggleTask = (id: number) =>
    setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));

  const addTask = () => {
    if (!newTask.trim()) return;
    const next: Task = { id: Date.now(), text: newTask.trim(), dueTime: newTime ? `Due: ${newTime}` : 'Due: —', priority: newPriority, done: false };
    setTasks(t => [next, ...t]);
    setNewTask(''); setNewTime('');
  };

  const pendingCount = tasks.filter(t => !t.done).length;
  return (
    <div className="nr-content">
      <div className="nr-two-col">
        <div className="nr-panel">
          <div className="nr-panel-header">
            <div><div className="nr-panel-title">My Task List</div><div className="nr-panel-sub">Morning shift · {pendingCount} pending</div></div>
            <button onClick={addTask} className="nr-btn nr-btn-primary" style={{ padding:'6px 14px', fontSize:12 }}>+ Add Task</button>
          </div>
          <div className="nr-panel-body">
            {tasks.map(task => (
              <div key={task.id} className="nr-task-row">
                <button className={`nr-task-check ${task.done ? 'done' : ''}`} onClick={() => toggleTask(task.id)}>
                  {task.done && <SvgIcon path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" size={10} color="white" />}
                </button>
                <div style={{ flex:1 }}>
                  <div className={`nr-task-text ${task.done ? 'done' : ''}`}>{task.text}</div>
                  <div className="nr-task-time">{task.dueTime}</div>
                </div>
                <span className={`nr-task-priority nr-prio-${task.done ? 'done' : task.priority}`}>
                  {task.done ? 'Done' : task.priority === 'high' ? 'High' : task.priority === 'med' ? 'Med' : 'Low'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="nr-panel">
          <div className="nr-panel-header">
            <div><div className="nr-panel-title">Add New Task</div><div className="nr-panel-sub">Assign to yourself or team</div></div>
          </div>
          <div className="nr-panel-body">
            <div className="nr-form-field">
              <label className="nr-form-label">Task Description</label>
              <input className="nr-form-input" type="text" placeholder="What needs to be done?" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} />
            </div>
            <div className="nr-form-row">
              <div className="nr-form-field">
                <label className="nr-form-label">Due Time</label>
                <input className="nr-form-input" type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
              </div>
              <div className="nr-form-field">
                <label className="nr-form-label">Priority</label>
                <select className="nr-form-select" value={newPriority} onChange={e => setNewPriority(e.target.value as Priority)}>
                  <option value="high">High</option><option value="med">Medium</option><option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="nr-form-field">
              <label className="nr-form-label">Linked Patient (optional)</label>
              <select className="nr-form-select">
                <option value="">— None —</option>
                <option>Mohammed Khan</option><option>Yuki Matsuda</option>
                <option>Robert Baines</option><option>Fatima Nour</option>
              </select>
            </div>
            <div className="nr-form-field">
              <label className="nr-form-label">Assign To</label>
              <select className="nr-form-select"><option>Me (Sarah R.)</option><option>Nurse T. James</option><option>Nurse A. Bloom</option></select>
            </div>
            <div className="nr-form-field"><label className="nr-form-label">Notes</label><textarea className="nr-form-textarea" rows={3} placeholder="Additional details…" /></div>
            <button onClick={addTask} className="nr-btn nr-btn-primary" style={{ width:'100%', justifyContent:'center' }}>Add to Task List</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Tab: Ward Overview ───────────────────────────────────────────────────────

const WardTab: React.FC = () => (
  <div className="nr-content">
    <div className="nr-stats-row nr-stats-4col" style={{ gridTemplateColumns:'repeat(5,1fr)' }}>
      {([['Beds Occupied','8/12','#f472b6','Ward B'],['Available','4','#4ade80','Open beds'],
         ['Discharges','2','#60a5fa','Today'],['Transfers','1','#c084fc','Incoming'],
         ['Staff on Shift','5','#fbbf24','Ward B now']] as [string,string,string,string][]).map(([l,v,c,s]) => (
        <div key={l} className="nr-stat-card">
          <div className="nr-stat-label">{l}</div>
          <div className="nr-stat-value" style={{ color:c }}>
            {v.includes('/') ? <>{v.split('/')[0]}<span style={{ fontSize:16, color:'rgba(255,255,255,0.4)' }}>/{v.split('/')[1]}</span></> : v}
          </div>
          <div className="nr-stat-sub">{s}</div>
        </div>
      ))}
    </div>
    <div className="nr-panel">
      <div className="nr-panel-header">
        <div><div className="nr-panel-title">Ward B — Bed Overview</div><div className="nr-panel-sub">Real-time status</div></div>
      </div>
      <div className="nr-panel-body">
        <div className="nr-bed-grid">
          {BEDS.map(bed => bed.available ? (
            <div key={bed.id} className="nr-bed-empty">
              <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={22} color="rgba(255,255,255,0.2)" />
              <div className="nr-bed-empty-label">{bed.label}</div>
            </div>
          ) : (
            <div key={bed.id} className="nr-bed-card" style={{ background: bed.color, border: `1px solid ${bed.borderColor}` }}>
              <div className="nr-bed-label">{bed.label}</div>
              <div className="nr-bed-patient">{bed.patient}</div>
              <div className="nr-bed-doctor">{bed.doctor}</div>
              <Chip status={bed.status!} label={bed.statusLabel} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC<{
  active: TabId; onNav: (t: TabId) => void;
  mobileOpen: boolean; nurseName: string; onSignOut?: () => void;
}> = ({ active, onNav, mobileOpen, nurseName, onSignOut }) => {
  const abb = initials(nurseName);
  const sections = ['Reception', 'Clinical', 'Ward'];
  return (
    <aside className={`nr-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="nr-sidebar-logo">
        <div className="nr-logo-icon">
          <SvgIcon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" size={18} color="white" />
        </div>
        <div>
          <div style={{ fontWeight:800, fontSize:16, letterSpacing:'-0.5px' }}>Vexoo</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>Healthcare Platform</div>
        </div>
      </div>

      <div className="nr-role-badge">
        <div className="nr-role-avatar">{abb}</div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:'#f9a8d4' }}>{nurseName}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Head Nurse · Ward B</div>
        </div>
      </div>

      {sections.map(section => (
        <React.Fragment key={section}>
          <div className="nr-nav-section">{section}</div>
          {TABS.filter(t => t.section === section).map(tab => (
            <button key={tab.id} className={`nr-nav-item ${active === tab.id ? 'active' : ''}`} onClick={() => onNav(tab.id)}>
              <SvgIcon path={tab.iconPath} size={16} color="currentColor" />
              {tab.label}
              {tab.badge && <span className={`nr-nav-badge ${tab.badgeClass ?? ''}`}>{tab.badge}</span>}
            </button>
          ))}
        </React.Fragment>
      ))}

      <div className="nr-sidebar-footer">
        <button className="nr-logout-btn" onClick={onSignOut}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────

interface ReceptionScreenProps {
  nurseName?: string;
  onSignOut?: () => void;
}

export default function ReceptionScreen({ nurseName = 'Maria Lopez', onSignOut }: ReceptionScreenProps) {
  const [tab, setTab]           = useState<TabId>('checkin');
  const [mobileOpen, setMobile] = useState(false);
  const [time, setTime]         = useState('');
  const timerRef                = useRef<ReturnType<typeof setInterval>>();

  // Live clock in topbar
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }));
    tick();
    timerRef.current = setInterval(tick, 60_000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Close mobile nav on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobile(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNav = useCallback((t: TabId) => { setTab(t); setMobile(false); }, []);

  const [title, subtitle] = PAGE_LABELS[tab];

  const tabContent = (() => {
    switch (tab) {
      case 'checkin':   return <CheckInTab />;
      case 'schedule':  return <ScheduleTab />;
      case 'vitals':    return <VitalsTab />;
      case 'careplans': return <CarePlansTab />;
      case 'handover':  return <HandoverTab />;
      case 'tasks':     return <TasksTab />;
      case 'ward':      return <WardTab />;
    }
  })();

  return (
    <div className="nr-root">
      <style>{CSS}</style>

      {/* Mobile overlay */}
      {mobileOpen && <div className="nr-overlay open" onClick={() => setMobile(false)} />}

      <Sidebar active={tab} onNav={handleNav} mobileOpen={mobileOpen} nurseName={nurseName} onSignOut={onSignOut} />

      <main className="nr-main">
        {/* Topbar */}
        <div className="nr-topbar">
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="nr-hamburger" onClick={() => setMobile(o => !o)} aria-label="Open menu"
              style={{ display:'none' }}>
              <SvgIcon path="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" size={22} color="white" />
            </button>
            <div>
              <div className="nr-page-title">{title}</div>
              <div className="nr-page-subtitle">{subtitle}</div>
            </div>
          </div>
          <div className="nr-topbar-actions">
            <div className="nr-live-pill">
              <div className="nr-live-dot" />
              Live · {time || '09:42 AM'}
            </div>
            <button className="nr-btn nr-btn-ghost">
              <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" size={14} color="currentColor" />
              Search Patient
            </button>
            <button className="nr-btn nr-btn-primary" onClick={() => handleNav('checkin')}>
              <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
              New Check-In
            </button>
          </div>
        </div>

        {/* Tab content */}
        {tabContent}
      </main>
    </div>
  );
}
