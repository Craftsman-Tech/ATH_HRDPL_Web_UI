/**
 * ============================================================================
 *  DoctorScreen.tsx — Doctor Portal
 * ============================================================================
 *  Light-themed portal for doctors. Faithfully ported from Vexoo_Doctor.html.
 *
 *  Screens (7):
 *    Today's Queue · My Patients · Medical Records (EMR)
 *    Prescriptions · Lab Orders · Messages · My Schedule
 *
 *  Route:           /doctor  (protected, role === 'Doctor')
 *  Suggested path:  apps/web/src/screens/doctor/DoctorScreen.tsx
 *
 *  Props:
 *    doctorName?  — from AuthContext (e.g. "Dr. Amy Chen")
 *    onSignOut?   — called when Logout is clicked
 *
 *  FIX (May 2026): Sidebar footer now shows a clearly-labelled "Sign out"
 *  button with a logout icon, separate from the user identity row.
 *  Previously the dr-user-row div had onClick={onSignOut} with no visible
 *  label, making it impossible for users to know they could sign out.
 * ============================================================================
 */

import React, {
  useState, useMemo, useCallback, useEffect, useRef,
} from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ScreenId = 'queue' | 'patients' | 'emr' | 'rx' | 'lab' | 'messages' | 'schedule';
type BadgeKey =
  | 'low' | 'medium' | 'high'
  | 'in room' | 'waiting' | 'urgent' | 'scheduled' | 'done'
  | 'pending' | 'sent' | 'stat' | 'active' | 'normal' | 'abnormal'
  | 'in progress';

interface NavItem { id: ScreenId; label: string; path: string; badge?: number; }

interface Patient {
  id: string; name: string; age: number; condition: string;
  time: string; status: string; risk: string;
  bp: string; hr: number; notes: string;
}
interface Message { from: 'doctor' | 'patient'; text: string; time: string; }
interface Convo { name: string; last: string; time: string; unread: number; msgs: Message[]; }

// ─── Props ───────────────────────────────────────────────────────────────────

interface DoctorScreenProps {
  doctorName?: string;
  onSignOut?: () => void;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.dr-root {
  --bg:           #f7f8fc;
  --sidebar:      #1a2540;
  --primary:      #4f6ef7;
  --primary-light:#eef1fe;
  --teal:         #0d9488;
  --teal-light:   #e6faf8;
  --amber:        #d97706;
  --amber-light:  #fef3c7;
  --rose:         #e11d48;
  --rose-light:   #ffe4e6;
  --green:        #16a34a;
  --green-light:  #dcfce7;
  --purple:       #7c3aed;
  --blue:         #3b82f6;
  --blue-light:   #dbeafe;
  --text:         #1a2540;
  --muted:        #64748b;
  --border:       #e4e8f0;
  --card:         #fff;

  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  height: 100vh;
  overflow: hidden;
  display: flex;
}

.dr-root ::-webkit-scrollbar       { width: 5px; height: 5px; }
.dr-root ::-webkit-scrollbar-thumb { background: #d1d5e0; border-radius: 4px; }
.dr-root ::-webkit-scrollbar-track { background: transparent; }

@keyframes dr-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.dr-fade { animation: dr-fade 0.2s ease both; }

/* ── Sidebar ── */
.dr-sidebar {
  width: 230px; flex-shrink: 0;
  background: var(--sidebar);
  display: flex; flex-direction: column;
  height: 100vh; overflow-y: auto;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
}
.dr-sidebar-logo {
  padding: 18px 20px;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.dr-logo-icon {
  width: 34px; height: 34px; background: var(--primary);
  border-radius: 9px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.dr-nav-label {
  padding: 14px 12px 4px;
  font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.25);
  letter-spacing: 1px; text-transform: uppercase;
}
.dr-nav { flex: 1; padding: 0 10px; }
.dr-nav-btn {
  display: flex; align-items: center; gap: 11px;
  width: 100%; padding: 10px 13px; border-radius: 10px;
  border: none; cursor: pointer; margin-bottom: 2px;
  font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.13s;
}
.dr-nav-btn.active  { background: var(--primary); color: white; font-weight: 600; }
.dr-nav-btn.inactive { background: transparent; color: rgba(255,255,255,0.55); font-weight: 400; }
.dr-nav-btn.inactive:hover { background: rgba(255,255,255,0.07); color: white; }
.dr-nav-badge {
  font-size: 10px; font-weight: 700; padding: 1px 7px;
  border-radius: 10px; color: white;
}
.dr-nav-badge.active-badge { background: rgba(255,255,255,0.25); }
.dr-nav-badge.default      { background: var(--rose); }

/* ── Sidebar footer: user identity + sign out button ── */
.dr-sidebar-user {
  border-top: 1px solid rgba(255,255,255,0.07); padding: 12px;
}
.dr-user-identity {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border-radius: 10px; margin-bottom: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
}
.dr-user-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg,#4f6ef7,#7c3aed);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: white; font-size: 13px; flex-shrink: 0;
}
.dr-signout-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 9px 14px; border-radius: 10px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.55); font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: background 0.13s, color 0.13s, border-color 0.13s;
}
.dr-signout-btn:hover {
  background: rgba(225,29,72,0.12); color: #f87171;
  border-color: rgba(225,29,72,0.25);
}
.dr-signout-btn svg { flex-shrink: 0; }

/* ── Profile avatar tooltip & modal ── */
.dr-profile-wrap { position: relative; }
.dr-profile-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg,#4f6ef7,#7c3aed);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 13px;
  cursor: pointer; flex-shrink: 0; transition: opacity 0.15s;
}
.dr-profile-avatar:hover { opacity: 0.85; }
.dr-profile-tooltip {
  position: absolute; top: calc(100% + 10px); right: 0;
  background: white; border: 1px solid var(--border);
  border-radius: 12px; padding: 14px 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  min-width: 200px; z-index: 100; pointer-events: none;
  opacity: 0; transform: translateY(-4px);
  transition: opacity 0.15s, transform 0.15s; white-space: nowrap;
}
.dr-profile-wrap:hover .dr-profile-tooltip { opacity: 1; transform: translateY(0); }

/* mobile overlay */
.dr-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 9; }
.dr-overlay.open { display: block; }
.dr-hamburger {
  display: none; background: none; border: none; cursor: pointer;
  padding: 4px; color: var(--text); align-items: center; justify-content: center;
}

/* ── Main ── */
.dr-main   { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.dr-header {
  display: flex; align-items: center; padding: 0 24px; height: 60px;
  background: var(--card); border-bottom: 1px solid var(--border);
  gap: 14px; flex-shrink: 0;
}
.dr-header-title { font-weight: 700; font-size: 16px; }
.dr-header-date  { font-size: 11.5px; color: var(--muted); }
.dr-header-spacer { flex: 1; }
.dr-logout-btn {
  display: flex; align-items: center; gap: 6px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 9px;
  padding: 6px 14px; font-size: 12.5px; color: var(--muted);
  font-family: inherit; cursor: pointer; font-weight: 500; transition: background 0.13s;
}
.dr-logout-btn:hover { background: var(--border); }
.dr-new-btn {
  background: var(--primary); color: white; border: none;
  border-radius: 9px; padding: 8px 18px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: opacity 0.13s;
}
.dr-new-btn:hover { opacity: 0.88; }

/* ── Badge ── */
.dr-badge {
  font-size: 11px; font-weight: 600; padding: 3px 10px;
  border-radius: 20px; white-space: nowrap; display: inline-block;
}

/* ── Card ── */
.dr-card {
  background: var(--card); border-radius: 16px; padding: 20px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05); border: 1px solid var(--border);
}

/* ── Scrollable content areas ── */
.dr-scroll { flex: 1; overflow-y: auto; }

/* ── Queue ── */
.dr-queue-grid {
  flex: 1; display: grid; grid-template-columns: 1fr 380px; overflow: hidden;
}
.dr-queue-list { overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.dr-queue-detail { border-left: 1px solid var(--border); overflow-y: auto; background: var(--card); }
.dr-queue-status-row { display: flex; gap: 10px; margin-bottom: 4px; }
.dr-queue-status-pill {
  flex: 1; background: var(--card); border: 1px solid var(--border);
  border-radius: 12px; padding: 10px 14px; text-align: center;
}
.dr-queue-pill-val { font-size: 20px; font-weight: 800; }
.dr-queue-pill-label { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
.dr-queue-item {
  border-radius: 14px; padding: 14px 18px;
  cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; gap: 14px;
}
.dr-queue-item.selected { background: var(--primary-light); border: 1.5px solid var(--primary); }
.dr-queue-item.normal   { background: var(--card); border: 1px solid var(--border); }
.dr-queue-item:hover    { border-color: var(--primary); }
.dr-queue-avatar { width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
.dr-detail-header {
  background: linear-gradient(135deg,#1a2540,#2a3a6a); padding: 20px 22px; color: white;
}
.dr-detail-avatar {
  width: 48px; height: 48px; border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;
}
.dr-section-label {
  font-size: 11px; font-weight: 700; color: var(--muted);
  letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 10px;
}
.dr-vitals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.dr-vital-box {
  background: var(--bg); border-radius: 12px; padding: 12px 14px;
  border: 1px solid var(--border);
}
.dr-action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.dr-action-btn {
  border-radius: 10px; padding: 10px 12px; font-size: 12.5px;
  font-weight: 600; cursor: pointer; text-align: center; border: 1px solid transparent;
  font-family: inherit; transition: opacity 0.13s;
}
.dr-action-btn:hover { opacity: 0.8; }
.dr-med-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 9px 12px; background: var(--bg); border-radius: 9px;
  margin-bottom: 6px; border: 1px solid var(--border);
}
.dr-start-btn {
  background: var(--primary); color: white; border: none;
  border-radius: 12px; padding: 13px; font-size: 14px; font-weight: 700;
  cursor: pointer; width: 100%; font-family: inherit; transition: opacity 0.13s;
}
.dr-start-btn:hover { opacity: 0.88; }

/* ── Patients grid ── */
.dr-patients-search {
  display: flex; align-items: center; gap: 8px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 8px 14px; flex: 1;
}
.dr-patients-search input {
  border: none; outline: none; background: transparent;
  font-size: 13px; width: 100%; font-family: inherit; color: var(--text);
}
.dr-patients-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
.dr-patient-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 16px;
  padding: 16px; cursor: pointer; transition: border-color 0.13s;
}
.dr-patient-card:hover { border-color: var(--primary); }
.dr-patient-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--primary-light);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 12px; color: var(--primary); flex-shrink: 0;
}

/* ── EMR ── */
.dr-emr-layout { display: grid; grid-template-columns: 260px 1fr; gap: 16px; }
.dr-emr-pt-item {
  padding: 11px 14px; border-radius: 11px;
  background: var(--card); border: 1px solid var(--border);
  cursor: pointer; transition: all 0.13s; margin-bottom: 8px;
}
.dr-emr-pt-item:hover { border-color: var(--primary); }
.dr-emr-header { background: linear-gradient(135deg,#1a2540,#2a3a6a); padding: 18px 22px; color: white; }
.dr-emr-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.dr-emr-tab {
  padding: 5px 14px; border-radius: 7px; border: none; cursor: pointer;
  font-size: 12.5px; font-family: inherit; text-transform: capitalize;
  transition: background 0.13s;
}
.dr-emr-tab.active   { background: rgba(255,255,255,0.2); color: white; font-weight: 600; }
.dr-emr-tab.inactive { background: transparent; color: white; font-weight: 400; }
.dr-emr-med-row {
  display: flex; align-items: center; gap: 14px;
  padding: 13px 16px; background: var(--bg); border-radius: 12px;
  border: 1px solid var(--border); margin-bottom: 10px;
}
.dr-emr-med-icon {
  width: 36px; height: 36px; background: var(--primary-light); border-radius: 9px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.dr-emr-vitals-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
.dr-emr-vital-box { padding: 16px; background: var(--bg); border-radius: 13px; border: 1px solid var(--border); }
.dr-note-textarea {
  width: 100%; min-height: 200px; border: 1px solid var(--border);
  border-radius: 12px; padding: 14px 16px; font-size: 13.5px;
  line-height: 1.8; outline: none; resize: vertical;
  color: var(--text); background: var(--bg); font-family: inherit;
}

/* ── Rx ── */
.dr-rx-layout { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
.dr-rx-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.dr-field-label { font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 5px; }
.dr-input, .dr-select, .dr-textarea {
  width: 100%; padding: 9px 12px; border-radius: 9px;
  border: 1px solid var(--border); font-size: 13px;
  outline: none; background: var(--bg); color: var(--text); font-family: inherit;
  transition: border-color 0.15s;
}
.dr-input:focus, .dr-select:focus, .dr-textarea:focus { border-color: var(--primary); }
.dr-textarea { resize: vertical; }
.dr-rx-recent-row {
  margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border);
}
.dr-rx-recent-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.dr-alert-card {
  background: #fff8f0; border-color: #fde68a;
  padding: 14px 16px; border-radius: 12px; border: 1px solid #fde68a; margin-top: 12px;
}

/* ── Lab ── */
.dr-lab-layout { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
.dr-lab-test-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
.dr-lab-test-label {
  display: flex; align-items: center; gap: 9px;
  padding: 9px 12px; background: var(--bg);
  border-radius: 9px; border: 1px solid var(--border);
  cursor: pointer; font-size: 13px;
}
.dr-lab-pending-row {
  margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border);
}
.dr-lab-pending-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.dr-lab-result-row {
  padding: 10px 12px; border-radius: 9px; border: 1px solid var(--border); margin-bottom: 8px;
}

/* ── Messages ── */
.dr-msg-layout { flex: 1; display: grid; grid-template-columns: 280px 1fr; overflow: hidden; }
.dr-msg-sidebar { border-right: 1px solid var(--border); overflow-y: auto; background: var(--card); }
.dr-msg-list-header { padding: 14px 16px; border-bottom: 1px solid var(--border); font-weight: 700; font-size: 15px; }
.dr-msg-convo-item {
  padding: 13px 16px; cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.13s; border-bottom: 1px solid var(--border);
}
.dr-msg-convo-item.active { background: var(--primary-light); border-left-color: var(--primary); }
.dr-msg-convo-item:not(.active):hover { background: var(--bg); }
.dr-msg-unread {
  background: var(--primary); color: white;
  border-radius: 10px; font-size: 10px; font-weight: 700;
  padding: 1px 7px; flex-shrink: 0;
}
.dr-msg-main { display: flex; flex-direction: column; overflow: hidden; }
.dr-msg-thread-header { padding: 14px 20px; border-bottom: 1px solid var(--border); background: var(--card); font-weight: 700; font-size: 15px; }
.dr-msg-thread { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.dr-msg-bubble {
  max-width: 68%; padding: 10px 14px; border-radius: 14px;
  font-size: 13.5px; line-height: 1.6;
}
.dr-msg-bubble.doctor  { background: var(--primary); color: white; }
.dr-msg-bubble.patient { background: var(--card); border: 1px solid var(--border); color: var(--text); }
.dr-msg-bubble-time { font-size: 10.5px; opacity: 0.6; margin-top: 4px; text-align: right; }
.dr-msg-compose { padding: 12px 20px; border-top: 1px solid var(--border); background: var(--card); display: flex; gap: 10px; }
.dr-msg-input {
  flex: 1; padding: 10px 14px; border: 1px solid var(--border);
  border-radius: 10px; font-size: 13.5px; outline: none;
  background: var(--bg); font-family: inherit; color: var(--text);
}
.dr-msg-input:focus { border-color: var(--primary); }
.dr-msg-send {
  background: var(--primary); color: white; border: none;
  border-radius: 10px; padding: 10px 18px; font-size: 13px;
  font-weight: 600; cursor: pointer; font-family: inherit;
}

/* ── Schedule ── */
.dr-schedule-week { display: grid; grid-template-columns: repeat(7,1fr); gap: 8px; margin-bottom: 20px; }
.dr-week-day {
  text-align: center; padding: 12px 8px; border-radius: 12px;
  cursor: pointer; transition: all 0.13s;
}
.dr-week-day.today  { background: var(--primary); border: none; }
.dr-week-day.other  { background: var(--card); border: 1px solid var(--border); }
.dr-week-day:not(.today):hover { border-color: var(--primary); }
.dr-schedule-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px; background: var(--card);
  border-radius: 13px; border: 1px solid var(--border);
}
.dr-schedule-time { width: 56px; text-align: center; flex-shrink: 0; }
.dr-schedule-divider { width: 1px; height: 36px; background: var(--border); flex-shrink: 0; }
.dr-schedule-view-btn {
  background: var(--primary-light); color: var(--primary); border: none;
  border-radius: 9px; padding: 7px 16px; font-size: 12.5px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: opacity 0.13s;
}
.dr-schedule-view-btn:hover { opacity: 0.8; }

/* ── Buttons ── */
.dr-btn-primary {
  background: var(--primary); color: white; border: none;
  border-radius: 10px; padding: 11px 24px;
  font-size: 13.5px; font-weight: 700; cursor: pointer; font-family: inherit;
  transition: opacity 0.13s;
}
.dr-btn-primary.teal { background: var(--teal); }
.dr-btn-primary:hover { opacity: 0.88; }
.dr-btn-ghost {
  background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
  padding: 11px 22px; font-size: 13.5px; cursor: pointer;
  color: var(--muted); font-family: inherit; transition: background 0.13s;
}
.dr-btn-ghost:hover { background: var(--border); }

/* ── Responsive ── */
@media (max-width: 1080px) {
  .dr-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 20;
    transform: translateX(-100%);
  }
  .dr-sidebar.mobile-open { transform: translateX(0); }
  .dr-hamburger { display: flex !important; }
  .dr-queue-grid { grid-template-columns: 1fr; }
  .dr-queue-detail { display: none; }
  .dr-patients-grid { grid-template-columns: repeat(2,1fr); }
  .dr-emr-layout { grid-template-columns: 1fr; }
  .dr-rx-layout  { grid-template-columns: 1fr; }
  .dr-lab-layout { grid-template-columns: 1fr; }
  .dr-msg-layout { grid-template-columns: 1fr; }
  .dr-msg-sidebar { display: none; }
}
@media (max-width: 760px) {
  .dr-patients-grid { grid-template-columns: 1fr; }
  .dr-rx-form-grid  { grid-template-columns: 1fr; }
  .dr-lab-test-grid { grid-template-columns: 1fr; }
  .dr-emr-vitals-grid { grid-template-columns: repeat(2,1fr); }
  .dr-schedule-week { grid-template-columns: repeat(4,1fr); }
  .dr-action-grid   { grid-template-columns: 1fr; }
  .dr-vitals-grid   { grid-template-columns: 1fr; }
}
`;

// ─── Mock data ────────────────────────────────────────────────────────────────

const PATIENTS: Patient[] = [
  { id:'P-001', name:'Sarah Johnson',   age:34, condition:'Hypertension',       time:'09:00 AM', status:'In Room',   risk:'Low',    bp:'128/82', hr:74,  notes:'Routine follow-up. BP trending down.' },
  { id:'P-002', name:'Marcus Williams', age:52, condition:'Type 2 Diabetes',    time:'10:00 AM', status:'Waiting',   risk:'Medium', bp:'135/88', hr:82,  notes:'HbA1c review, adjust Metformin dose.' },
  { id:'P-003', name:"James O'Brien",   age:67, condition:'Cardiac Arrhythmia', time:'11:00 AM', status:'Urgent',    risk:'High',   bp:'148/95', hr:110, notes:'Reported palpitations last night. ECG ordered.' },
  { id:'P-004', name:'Elena Rodriguez', age:28, condition:'Asthma',             time:'01:00 PM', status:'Scheduled', risk:'Low',    bp:'118/76', hr:68,  notes:'Inhaler technique review.' },
  { id:'P-005', name:'David Nguyen',    age:44, condition:'Hypertension',       time:'02:00 PM', status:'Scheduled', risk:'Medium', bp:'142/90', hr:78,  notes:'Second visit post medication start.' },
  { id:'P-006', name:'Priya Sharma',    age:41, condition:'Migraine',           time:'03:00 PM', status:'Scheduled', risk:'Low',    bp:'120/78', hr:72,  notes:'Frequency increased, consider prophylaxis.' },
  { id:'P-007', name:'Thomas Klein',    age:59, condition:'COPD',               time:'03:45 PM', status:'Scheduled', risk:'Medium', bp:'130/84', hr:80,  notes:'Spirometry results review.' },
  { id:'P-008', name:'Aisha Okonkwo',   age:31, condition:'Anxiety Disorder',   time:'04:30 PM', status:'Scheduled', risk:'Low',    bp:'116/74', hr:76,  notes:'Monthly check-in, therapy progress.' },
];

const CONVOS: Convo[] = [
  { name:'Sarah Johnson', last:'When should I take my medication?', time:'2m', unread:2, msgs:[
    { from:'patient', text:'Hi Dr. Chen, when exactly should I take my Lisinopril?', time:'9:45 AM' },
    { from:'doctor',  text:'Good morning Sarah! Take it first thing in the morning, ideally at the same time each day.', time:'9:52 AM' },
    { from:'patient', text:'Should I take it with food or on an empty stomach?', time:'9:53 AM' },
  ]},
  { name:'Marcus Williams', last:'Thank you doctor', time:'1h', unread:0, msgs:[
    { from:'patient', text:'Doctor, my blood sugar has been high this week.', time:'8:00 AM' },
    { from:'doctor',  text:'Please check your levels after each meal and share the readings.', time:'8:30 AM' },
    { from:'patient', text:'Will do. Thank you doctor.', time:'8:35 AM' },
  ]},
  { name:'Pharmacy Team', last:'RX-4823 dispensed', time:'3h', unread:1, msgs:[
    { from:'patient', text:"RX-4823 — Amiodarone 200mg has been dispensed to James O'Brien.", time:'6:30 AM' },
  ]},
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) { return name.split(' ').map(n => n[0]).join(''); }

const BADGE_COLORS: Record<BadgeKey, [string, string]> = {
  'low':         ['#dcfce7','#16a34a'],
  'medium':      ['#fef3c7','#d97706'],
  'high':        ['#ffe4e6','#e11d48'],
  'in room':     ['#dbeafe','#3b82f6'],
  'waiting':     ['#fef3c7','#d97706'],
  'urgent':      ['#ffe4e6','#e11d48'],
  'scheduled':   ['#f1f5f9','#64748b'],
  'done':        ['#dcfce7','#16a34a'],
  'pending':     ['#ede9fe','#7c3aed'],
  'sent':        ['#dcfce7','#16a34a'],
  'stat':        ['#ffe4e6','#e11d48'],
  'active':      ['#dcfce7','#16a34a'],
  'normal':      ['#dcfce7','#16a34a'],
  'abnormal':    ['#ffe4e6','#e11d48'],
  'in progress': ['#dbeafe','#3b82f6'],
};

function Badge({ label }: { label: string }) {
  const [bg, color] = BADGE_COLORS[label.toLowerCase() as BadgeKey] ?? ['#f1f5f9','#64748b'];
  return <span className="dr-badge" style={{ background: bg, color }}>{label}</span>;
}

function SvgIcon({ path, size = 17, color = 'currentColor' }: { path: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d={path} />
    </svg>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV: NavItem[] = [
  { id:'queue',    label:"Today's Queue",  badge:8, path:'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z' },
  { id:'patients', label:'My Patients',                path:'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
  { id:'emr',      label:'Medical Records',             path:'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
  { id:'rx',       label:'Prescriptions',               path:'M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
  { id:'lab',      label:'Lab Orders',                  path:'M6 2v6l2 2-6 10h16L12 10l2-2V2H6zm6 9.5L14.73 16H9.27L12 11.5zM10 4h4v3.17l1.17 1.17L12 12.5 8.83 8.34 10 7.17V4z' },
  { id:'messages', label:'Messages',       badge:3,    path:'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z' },
  { id:'schedule', label:'My Schedule',               path:'M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z' },
];

const SCREEN_TITLES: Record<ScreenId, string> = {
  queue:"Today's Queue", patients:'My Patients', emr:'Medical Records',
  rx:'Prescriptions', lab:'Lab Orders', messages:'Messages', schedule:'My Schedule',
};

// ─── Screen: Queue ────────────────────────────────────────────────────────────

const QueueScreen: React.FC<{ onNav: (s: ScreenId) => void; doctorName: string }> = ({ onNav }) => {
  const [sel, setSel] = useState<Patient>(PATIENTS[0]);

  const avatarStyle = (p: Patient) => {
    if (p.status === 'Urgent')  return { bg:'#ffe4e6', color:'#e11d48' };
    if (p.status === 'In Room') return { bg:'#dbeafe', color:'#3b82f6' };
    return { bg:'var(--primary-light)', color:'var(--primary)' };
  };

  return (
    <div className="dr-queue-grid dr-fade">
      <div className="dr-queue-list">
        <div className="dr-queue-status-row">
          {([['In Room',1,'#3b82f6'],['Urgent',1,'#e11d48'],['Waiting',1,'#d97706'],['Scheduled',5,'#64748b']] as [string,number,string][]).map(([l,n,c]) => (
            <div key={l} className="dr-queue-status-pill">
              <div className="dr-queue-pill-val" style={{ color:c }}>{n}</div>
              <div className="dr-queue-pill-label">{l}</div>
            </div>
          ))}
        </div>
        {PATIENTS.map(p => {
          const av = avatarStyle(p);
          return (
            <div key={p.id} className={`dr-queue-item ${sel.id === p.id ? 'selected' : 'normal'}`} onClick={() => setSel(p)}>
              <div className="dr-queue-avatar" style={{ background:av.bg, color:av.color }}>{initials(p.name)}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{p.name}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>Age {p.age} · {p.condition}</div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--primary)', marginBottom:4 }}>{p.time}</div>
                <Badge label={p.status} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="dr-queue-detail">
        <div className="dr-detail-header">
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <div className="dr-detail-avatar">{initials(sel.name)}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:17 }}>{sel.name}</div>
              <div style={{ fontSize:12.5, opacity:0.7 }}>{sel.id} · Age {sel.age} · {sel.condition}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Badge label={sel.status} />
            <Badge label={`${sel.risk} Risk`} />
          </div>
        </div>

        <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div className="dr-section-label">Current Vitals</div>
            <div className="dr-vitals-grid">
              {([['Blood Pressure', sel.bp, 'mmHg','#4f6ef7'],
                 ['Heart Rate', String(sel.hr), 'bpm','#e11d48'],
                 ['O₂ Saturation','98','%','#16a34a'],
                 ['Temperature','98.4','°F','#d97706']] as [string,string,string,string][]).map(([l,v,u,c]) => (
                <div key={l} className="dr-vital-box">
                  <div style={{ fontSize:11, color:'var(--muted)', marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:20, fontWeight:800, color:c }}>
                    {v} <span style={{ fontSize:11, fontWeight:400 }}>{u}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="dr-section-label">Clinical Notes</div>
            <div style={{ background:'#fffef5', border:'1px solid #fef3c7', borderRadius:12, padding:'12px 14px', fontSize:13.5, color:'#374151', lineHeight:1.7 }}>
              {sel.notes}
            </div>
          </div>

          <div>
            <div className="dr-section-label">Quick Actions</div>
            <div className="dr-action-grid">
              {([['Write Prescription','#4f6ef7'],['Order Lab Test','#0d9488'],['Add Clinical Note','#d97706'],['Refer Specialist','#7c3aed']] as [string,string][]).map(([a,c]) => (
                <button key={a} className="dr-action-btn"
                  style={{ background:`${c}12`, color:c, borderColor:`${c}30` }}
                  onClick={() => a === 'Write Prescription' ? onNav('rx') : a === 'Order Lab Test' ? onNav('lab') : undefined}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="dr-section-label">Active Medications</div>
            {['Lisinopril 10mg · Daily','Aspirin 81mg · Daily','Amlodipine 5mg · Daily'].map(m => (
              <div key={m} className="dr-med-row">
                <span style={{ fontSize:13 }}>{m}</span>
                <span style={{ fontSize:11, color:'var(--primary)', fontWeight:600 }}>Active</span>
              </div>
            ))}
          </div>

          <button className="dr-start-btn">Start Consultation</button>
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Patients ─────────────────────────────────────────────────────────

const PatientsScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() =>
    PATIENTS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  return (
    <div className="dr-scroll dr-fade" style={{ padding:20 }}>
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <div className="dr-patients-search">
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" size={14} color="var(--muted)" />
          <input placeholder="Search my patients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="dr-patients-grid">
        {filtered.map(p => (
          <div key={p.id} className="dr-patient-card">
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div className="dr-patient-avatar">{initials(p.name)}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:13.5 }}>{p.name}</div>
                <div style={{ fontSize:11.5, color:'var(--muted)' }}>Age {p.age} · {p.id}</div>
              </div>
            </div>
            <div style={{ fontSize:12.5, color:'var(--muted)', marginBottom:10, padding:'8px 10px', background:'var(--bg)', borderRadius:8 }}>{p.condition}</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:11.5, color:'var(--muted)' }}>{p.time}</span>
              <Badge label={`${p.risk} Risk`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Screen: EMR ─────────────────────────────────────────────────────────────

type EMRTab = 'notes' | 'medications' | 'vitals' | 'history' | 'attachments';

const EMRScreen: React.FC = () => {
  const [tab, setTab] = useState<EMRTab>('notes');
  const EMR_TABS: EMRTab[] = ['notes','medications','vitals','history','attachments'];

  return (
    <div className="dr-scroll dr-fade" style={{ padding:20 }}>
      <div className="dr-emr-layout">
        <div>
          {PATIENTS.map(p => (
            <div key={p.id} className="dr-emr-pt-item">
              <div style={{ fontWeight:600, fontSize:13 }}>{p.name}</div>
              <div style={{ fontSize:11.5, color:'var(--muted)' }}>{p.condition} · {p.id}</div>
            </div>
          ))}
        </div>

        <div className="dr-card" style={{ padding:0, overflow:'hidden' }}>
          <div className="dr-emr-header">
            <div style={{ fontWeight:700, fontSize:17, marginBottom:4 }}>
              Sarah Johnson <span style={{ opacity:0.5, fontWeight:400, fontSize:13 }}>P-001</span>
            </div>
            <div style={{ display:'flex', gap:20, fontSize:12.5, opacity:0.75, marginBottom:14 }}>
              <span>Female · 34 years</span><span>Blood: A+</span><span>Hypertension</span>
            </div>
            <div className="dr-emr-tabs">
              {EMR_TABS.map(t => (
                <button key={t} className={`dr-emr-tab ${tab === t ? 'active' : 'inactive'}`} onClick={() => setTab(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ padding:22 }}>
            {tab === 'notes' && (
              <div>
                <div style={{ fontWeight:600, fontSize:11, marginBottom:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.8px' }}>Clinical Note — Apr 26, 2026</div>
                <textarea className="dr-note-textarea" defaultValue={`S: Patient reports feeling well. BP readings at home averaging 125/80. No chest pain or dyspnea. Medication compliance good.\n\nO: BP 128/82. HR 74 reg. RR 16. O2 98%. Weight stable at 68.2 kg.\n\nA: Hypertension well-controlled on current regimen.\n\nP: Continue Lisinopril 10mg + HCTZ 12.5mg. Lifestyle modifications reinforced. Follow-up in 8 weeks or PRN.`} />
                <div style={{ display:'flex', gap:10, marginTop:12 }}>
                  <button className="dr-btn-primary">Save & Sign</button>
                  <button className="dr-btn-ghost">Save Draft</button>
                </div>
              </div>
            )}
            {tab === 'medications' && (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {([['Lisinopril 10mg','ACE Inhibitor','1 tab daily AM','Jan 2024','Active'],
                   ['HCTZ 12.5mg','Diuretic','1 tab daily','Jan 2024','Active'],
                   ['Aspirin 81mg','Antiplatelet','1 tab daily','Mar 2024','Active']] as [string,string,string,string,string][]).map(([n,c,s,d,st]) => (
                  <div key={n} className="dr-emr-med-row">
                    <div className="dr-emr-med-icon">
                      <SvgIcon path="M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" size={18} color="var(--primary)" />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{n} <span style={{ fontWeight:400, color:'var(--muted)', fontSize:12 }}>— {c}</span></div>
                      <div style={{ fontSize:12.5, color:'var(--muted)' }}>Schedule: {s} · Since {d}</div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <Badge label={st} />
                      <button style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', fontSize:12, cursor:'pointer', color:'var(--muted)', fontFamily:'inherit' }}>Modify</button>
                    </div>
                  </div>
                ))}
                <button style={{ background:'var(--primary-light)', color:'var(--primary)', border:'1.5px dashed var(--primary)', borderRadius:12, padding:12, fontSize:13, fontWeight:600, cursor:'pointer', textAlign:'center', fontFamily:'inherit' }}>
                  + Add Medication
                </button>
              </div>
            )}
            {tab === 'vitals' && (
              <div className="dr-emr-vitals-grid">
                {([['Blood Pressure','128/82','mmHg','#4f6ef7'],
                   ['Heart Rate','74','bpm','#e11d48'],
                   ['Temperature','98.4','°F','#d97706'],
                   ['O₂ Saturation','98','%','#16a34a'],
                   ['Weight','68.2','kg','#64748b'],
                   ['BMI','24.1','','#7c3aed']] as [string,string,string,string][]).map(([l,v,u,c]) => (
                  <div key={l} className="dr-emr-vital-box">
                    <div style={{ fontSize:11.5, color:'var(--muted)', marginBottom:6 }}>{l}</div>
                    <div style={{ fontSize:26, fontWeight:800, color:c }}>{v} <span style={{ fontSize:12, fontWeight:400 }}>{u}</span></div>
                  </div>
                ))}
              </div>
            )}
            {(tab === 'history' || tab === 'attachments') && (
              <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--muted)' }}>
                <div style={{ fontSize:40, marginBottom:10 }}>{tab === 'history' ? '📋' : '🗂️'}</div>
                <div style={{ fontSize:14, fontWeight:600 }}>{tab === 'history' ? 'Visit History' : 'Attachments & Imaging'}</div>
                <div style={{ fontSize:13, marginTop:4 }}>3 records available</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Prescriptions ────────────────────────────────────────────────────

const RxScreen: React.FC = () => (
  <div className="dr-scroll dr-fade" style={{ padding:20 }}>
    <div className="dr-rx-layout">
      <div className="dr-card">
        <div style={{ fontWeight:700, fontSize:16, marginBottom:18 }}>Write Prescription</div>
        <div className="dr-rx-form-grid">
          <div>
            <div className="dr-field-label">Patient</div>
            <select className="dr-select">
              {PATIENTS.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <div className="dr-field-label">Medication / Drug</div>
            <input className="dr-input" placeholder="e.g. Lisinopril 10mg" />
          </div>
          <div>
            <div className="dr-field-label">Dosage</div>
            <input className="dr-input" placeholder="e.g. 10mg" />
          </div>
          <div>
            <div className="dr-field-label">Frequency</div>
            <select className="dr-select">
              {['Once daily','Twice daily','Three times daily','As needed'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <div className="dr-field-label">Duration</div>
            <input className="dr-input" placeholder="e.g. 30 days" />
          </div>
          <div>
            <div className="dr-field-label">Refills</div>
            <input className="dr-input" placeholder="e.g. 2" />
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <div className="dr-field-label" style={{ marginBottom:5 }}>Special Instructions</div>
          <textarea className="dr-textarea" rows={3} placeholder="Take with food. Monitor BP weekly..." />
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="dr-btn-primary">Send Prescription</button>
          <button className="dr-btn-ghost">Save Draft</button>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div className="dr-card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Recent Prescriptions</div>
          {([['RX-4821','Sarah Johnson','Lisinopril 10mg','Sent'],
             ['RX-4818','Marcus Williams','Metformin 500mg','Sent'],
             ["RX-4815","James O'Brien","Amiodarone 200mg",'Pending']] as [string,string,string,string][]).map(([id,p,d,s]) => (
            <div key={id} className="dr-rx-recent-row">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{p}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{id} · {d}</div>
                </div>
                <Badge label={s} />
              </div>
            </div>
          ))}
        </div>
        <div className="dr-alert-card">
          <div style={{ fontWeight:700, fontSize:13.5, color:'#92400e', marginBottom:8 }}>⚠ Drug Interaction Alert</div>
          <div style={{ fontSize:12.5, color:'#78350f', lineHeight:1.6 }}>Potential interaction between Lisinopril and NSAIDs. Avoid concurrent use. Monitor renal function.</div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Screen: Lab Orders ───────────────────────────────────────────────────────

const LAB_TESTS = [
  'CBC (Complete Blood Count)','Metabolic Panel','HbA1c','Lipid Panel',
  'Thyroid Function (TSH)','Troponin','Urinalysis','Coagulation (PT/INR)',
  'Liver Function','CRP / ESR','ECG','Chest X-Ray',
];

const LabScreen: React.FC = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (t: string) => setSelected(s => {
    const next = new Set(s);
    next.has(t) ? next.delete(t) : next.add(t);
    return next;
  });

  return (
    <div className="dr-scroll dr-fade" style={{ padding:20 }}>
      <div className="dr-lab-layout">
        <div className="dr-card">
          <div style={{ fontWeight:700, fontSize:16, marginBottom:18 }}>Order Lab Test</div>
          <div className="dr-rx-form-grid">
            <div>
              <div className="dr-field-label">Patient</div>
              <select className="dr-select">{PATIENTS.map(p => <option key={p.id}>{p.name}</option>)}</select>
            </div>
            <div>
              <div className="dr-field-label">Priority</div>
              <select className="dr-select">{['Routine','Urgent','STAT'].map(o => <option key={o}>{o}</option>)}</select>
            </div>
          </div>
          <div className="dr-field-label" style={{ marginBottom:10 }}>Select Tests</div>
          <div className="dr-lab-test-grid">
            {LAB_TESTS.map(t => (
              <label key={t} className="dr-lab-test-label" onClick={() => toggle(t)}>
                <input type="checkbox" checked={selected.has(t)} onChange={() => toggle(t)}
                  style={{ accentColor:'var(--primary)', width:14, height:14 }} />
                {t}
              </label>
            ))}
          </div>
          <div style={{ marginBottom:14 }}>
            <div className="dr-field-label" style={{ marginBottom:5 }}>Clinical Indication</div>
            <textarea className="dr-textarea" rows={3} placeholder="Reason for ordering this test..." />
          </div>
          <button className="dr-btn-primary teal">Submit Lab Order</button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div className="dr-card">
            <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Pending Results</div>
            {([['L-0091','Marcus Williams','HbA1c Panel','In Progress'],
               ['L-0095','Priya Sharma','MRI Brain','Pending'],
               ["L-0092","James O'Brien",'ECG + Troponin','STAT']] as [string,string,string,string][]).map(([id,p,t,s]) => (
              <div key={id} className="dr-lab-pending-row">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>{p}</div>
                    <div style={{ fontSize:12, color:'var(--muted)' }}>{id} · {t}</div>
                  </div>
                  <Badge label={s} />
                </div>
              </div>
            ))}
          </div>
          <div className="dr-card">
            <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Completed Today</div>
            {([['L-0093','Sarah Johnson','CBC Panel','Normal'],
               ['L-0094','Elena Rodriguez','Spirometry','Abnormal']] as [string,string,string,string][]).map(([id,p,t,r]) => (
              <div key={id} className="dr-lab-result-row"
                style={{ background: r === 'Abnormal' ? '#fff8f8' : 'var(--bg)', borderColor: r === 'Abnormal' ? '#fca5a5' : 'var(--border)' }}>
                <div style={{ fontWeight:600, fontSize:13 }}>{p} <span style={{ fontWeight:400, color:'var(--muted)', fontSize:12 }}>· {t}</span></div>
                <div style={{ fontSize:12, color: r === 'Abnormal' ? '#e11d48' : '#16a34a', fontWeight:600, marginTop:2 }}>Result: {r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Messages ─────────────────────────────────────────────────────────

const MessagesScreen: React.FC = () => {
  const [sel, setSel] = useState(0);
  const [draft, setDraft] = useState('');
  const [convos, setConvos] = useState<Convo[]>(CONVOS);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [sel, convos]);

  const send = () => {
    if (!draft.trim()) return;
    const msg: Message = { from:'doctor', text:draft.trim(), time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) };
    setConvos(c => c.map((cv,i) => i === sel ? { ...cv, msgs:[...cv.msgs,msg], last:draft.trim() } : cv));
    setDraft('');
  };

  return (
    <div className="dr-msg-layout dr-fade">
      <div className="dr-msg-sidebar">
        <div className="dr-msg-list-header">Messages</div>
        {convos.map((c, i) => (
          <div key={i} className={`dr-msg-convo-item ${sel === i ? 'active' : ''}`} onClick={() => setSel(i)}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
              <span style={{ fontWeight:700, fontSize:13.5 }}>{c.name}</span>
              <span style={{ fontSize:11, color:'var(--muted)' }}>{c.time}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:12.5, color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:180 }}>{c.last}</span>
              {c.unread > 0 && <span className="dr-msg-unread">{c.unread}</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="dr-msg-main">
        <div className="dr-msg-thread-header">{convos[sel].name}</div>
        <div className="dr-msg-thread" ref={threadRef}>
          {convos[sel].msgs.map((m, i) => (
            <div key={i} style={{ display:'flex', justifyContent: m.from === 'doctor' ? 'flex-end' : 'flex-start' }}>
              <div className={`dr-msg-bubble ${m.from}`}>
                {m.text}
                <div className="dr-msg-bubble-time">{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="dr-msg-compose">
          <input className="dr-msg-input" placeholder="Type a message..." value={draft}
            onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
          <button className="dr-msg-send" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Schedule ─────────────────────────────────────────────────────────

const WEEK_DAYS = ['Mon Apr 21','Tue Apr 22','Wed Apr 23','Thu Apr 24','Fri Apr 25','Sat Apr 26','Sun Apr 27'];
const WEEK_COUNTS = [3,5,6,4,7,8,0];

const ScheduleScreen: React.FC = () => {
  const [activeDay, setActiveDay] = useState(5);
  return (
    <div className="dr-scroll dr-fade" style={{ padding:20 }}>
      <div className="dr-schedule-week">
        {WEEK_DAYS.map((d, i) => (
          <div key={d} className={`dr-week-day ${i === activeDay ? 'today' : 'other'}`} onClick={() => setActiveDay(i)}>
            <div style={{ fontSize:11, color: i === activeDay ? 'rgba(255,255,255,0.75)' : 'var(--muted)', marginBottom:3 }}>{d.split(' ')[0]}</div>
            <div style={{ fontWeight:700, fontSize:15, color: i === activeDay ? 'white' : 'var(--text)' }}>{d.split(' ')[1]}</div>
            <div style={{ fontSize:10.5, color: i === activeDay ? 'rgba(255,255,255,0.7)' : 'var(--muted)', marginTop:4 }}>{WEEK_COUNTS[i]} appts</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {PATIENTS.map(p => (
          <div key={p.id} className="dr-schedule-item">
            <div className="dr-schedule-time">
              <div style={{ fontSize:13.5, fontWeight:700, color:'var(--primary)' }}>{p.time.split(' ')[0]}</div>
              <div style={{ fontSize:10.5, color:'var(--muted)' }}>{p.time.split(' ')[1]}</div>
            </div>
            <div className="dr-schedule-divider" />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{p.name}</div>
              <div style={{ fontSize:12.5, color:'var(--muted)' }}>{p.condition} · Age {p.age}</div>
            </div>
            <Badge label={p.status} />
            <button className="dr-schedule-view-btn">View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
// FIX: Footer is now split into two elements:
//   1. dr-user-identity  — read-only display of name + avatar (not clickable)
//   2. dr-signout-btn    — clearly labelled "Sign out" button with logout icon

const Sidebar: React.FC<{
  active: ScreenId; onNav: (s: ScreenId) => void;
  mobileOpen: boolean; doctorName: string; onSignOut?: () => void;
}> = ({ active, onNav, mobileOpen, doctorName, onSignOut }) => {
  const abb = initials(doctorName);
  return (
    <aside className={`dr-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="dr-sidebar-logo">
        <div className="dr-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
          </svg>
        </div>
        <div>
          <div style={{ color:'white', fontWeight:800, fontSize:15, letterSpacing:'-0.3px' }}>Vexoo</div>
          <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10.5 }}>Doctor Portal</div>
        </div>
      </div>

      <div className="dr-nav-label">Clinical</div>
      <nav className="dr-nav">
        {NAV.map(item => {
          const on = active === item.id;
          return (
            <button key={item.id} className={`dr-nav-btn ${on ? 'active' : 'inactive'}`} onClick={() => onNav(item.id)}>
              <SvgIcon path={item.path} size={17} color="currentColor" />
              <span style={{ flex:1, textAlign:'left' }}>{item.label}</span>
              {item.badge && (
                <span className={`dr-nav-badge ${on ? 'active-badge' : 'default'}`}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar footer: user identity (read-only) + sign out button */}
      <div className="dr-sidebar-user">
        {/* User identity row — not clickable, just shows who is signed in */}
        <div className="dr-user-identity">
          <div className="dr-user-avatar">{abb}</div>
          <div>
            <div style={{ color:'white', fontSize:12.5, fontWeight:600 }}>{doctorName}</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>Cardiologist</div>
          </div>
        </div>

        {/* Sign out button — clearly labelled with icon */}
        <button className="dr-signout-btn" onClick={onSignOut} type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────

export default function DoctorScreen({ doctorName = 'Dr. Amy Chen', onSignOut }: DoctorScreenProps) {
  const [screen, setScreen]     = useState<ScreenId>('queue');
  const [mobileOpen, setMobile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobile(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNav = useCallback((s: ScreenId) => { setScreen(s); setMobile(false); }, []);

  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const screenEl = useMemo(() => {
    switch (screen) {
      case 'queue':    return <QueueScreen onNav={handleNav} doctorName={doctorName} />;
      case 'patients': return <PatientsScreen />;
      case 'emr':      return <EMRScreen />;
      case 'rx':       return <RxScreen />;
      case 'lab':      return <LabScreen />;
      case 'messages': return <MessagesScreen />;
      case 'schedule': return <ScheduleScreen />;
    }
  }, [screen, doctorName, handleNav]);

  return (
    <div className="dr-root">
      <style>{CSS}</style>

      {mobileOpen && <div className="dr-overlay open" onClick={() => setMobile(false)} />}

      <Sidebar active={screen} onNav={handleNav} mobileOpen={mobileOpen}
        doctorName={doctorName} onSignOut={onSignOut} />

      <div className="dr-main">
        {/* Header */}
        <div className="dr-header">
          <button className="dr-hamburger" onClick={() => setMobile(o => !o)} aria-label="Open menu" style={{ display:'none' }}>
            <SvgIcon path="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" size={22} color="var(--text)" />
          </button>
          <div>
            <div className="dr-header-title">{SCREEN_TITLES[screen]}</div>
            <div className="dr-header-date">{today}</div>
          </div>
          <div className="dr-header-spacer" />
          <div className="dr-profile-wrap">
            <div className="dr-profile-avatar" onClick={() => setShowProfile(true)}>
              {initials(doctorName)}
              <div className="dr-profile-tooltip">
                <div style={{ fontWeight:700, fontSize:13 }}>{doctorName}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>Cardiologist</div>
                <div style={{ fontSize:11, color:'var(--primary)', marginTop:8, fontWeight:600 }}>Click to view profile →</div>
              </div>
            </div>
          </div>
        </div>

        {/* Screen */}
        {screenEl}
      </div>

      {/* ── Profile Modal ── */}
      {showProfile && (
        <div onClick={() => setShowProfile(false)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:200, backdropFilter:'blur(2px)'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:'white', borderRadius:16, padding:28,
            width:420, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
              <div style={{ width:56, height:56, borderRadius:'50%',
                background:'linear-gradient(135deg,#4f6ef7,#7c3aed)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'white', fontSize:20, fontWeight:700 }}>{initials(doctorName)}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:17 }}>{doctorName}</div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>Cardiologist · Doctor Portal</div>
              </div>
            </div>
            {[['Full Name', doctorName], ['Email', 'doctor@vexoo.in'], ['Phone', '+91 98765 43210'], ['Specialisation', 'Cardiologist']].map(([label, val]) => (
              <div key={label} style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:5 }}>{label}</div>
                <input defaultValue={val} style={{
                  width:'100%', padding:'9px 12px', border:'1px solid var(--border)',
                  borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit',
                  color:'var(--text)', background:'var(--bg)'
                }} />
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button onClick={() => setShowProfile(false)} style={{
                flex:1, padding:'10px', borderRadius:10, border:'1px solid var(--border)',
                background:'white', cursor:'pointer', fontFamily:'inherit', fontSize:13.5
              }}>Close</button>
              <button style={{
                flex:1, padding:'10px', borderRadius:10, border:'none',
                background:'var(--primary)', color:'white', cursor:'pointer',
                fontFamily:'inherit', fontSize:13.5, fontWeight:600
              }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
