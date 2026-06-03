/**
 * ============================================================================
 *  PatientScreen.tsx — Patient Portal
 * ============================================================================
 *  Light-teal patient-facing portal. Faithfully ported from Vexoo_Patient.html.
 *
 *  Screens (7):
 *    My Health (home) · Appointments · My Records · Medications
 *    Lab Results · Messages · Billing & Payments
 *
 *  Route:           /patient  (protected, role === 'Patient')
 *  Suggested path:  apps/web/src/screens/patient/PatientScreen.tsx
 *
 *  Props:
 *    patientName?  — from AuthContext (e.g. "Sarah Johnson")
 *    onSignOut?    — called when Logout is clicked
 *
 *  FIXES (May 2026):
 *  - Header profile avatar now shows hover tooltip with user details + sign out
 *  - Sidebar has single "Logout" button (no duplicate in header)
 *  - Profile avatar is the reference design from the screenshot (SJ initials, top-right)
 * ============================================================================
 */

import React, {
  useState, useMemo, useCallback, useEffect, useRef,
} from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ScreenId = 'home' | 'appts' | 'records' | 'meds' | 'lab' | 'messages' | 'billing';
type ChipColor = 'primary' | 'amber' | 'rose' | 'blue' | 'green' | 'purple';
type ApptTab   = 'upcoming' | 'past' | 'book';
type MsgFrom   = 'doctor' | 'patient';

interface NavItem { id: ScreenId; label: string; path: string; badge?: number; }

interface Medication {
  name: string; cls: string; schedule: string;
  refill: string; pillsLeft: number; status: string; instructions: string;
}
interface LabResult {
  test: string; date: string; doctor: string; status: string;
  results: [string, string, string, 'normal' | 'high' | 'low'][];
}
interface ChatMsg { from: MsgFrom; text: string; time: string; }

// ─── Props ───────────────────────────────────────────────────────────────────

interface PatientScreenProps {
  patientName?: string;
  onSignOut?: () => void;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.pt-root {
  --bg:      #f4f7fb;
  --primary: #0d9488;
  --pl:      #e6faf8;
  --amber:   #d97706;
  --al:      #fef3c7;
  --rose:    #e11d48;
  --rl:      #ffe4e6;
  --blue:    #3b82f6;
  --bl:      #dbeafe;
  --purple:  #7c3aed;
  --pul:     #ede9fe;
  --green:   #16a34a;
  --gl:      #dcfce7;
  --text:    #1e293b;
  --muted:   #64748b;
  --border:  #e2e8f0;
  --card:    #fff;

  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  height: 100vh;
  overflow: hidden;
  display: flex;
}

.pt-root ::-webkit-scrollbar       { width: 5px; }
.pt-root ::-webkit-scrollbar-thumb { background: #d1d5e0; border-radius: 4px; }
.pt-root ::-webkit-scrollbar-track { background: transparent; }

@keyframes pt-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.pt-fade { animation: pt-fade 0.2s ease both; }

/* ── Sidebar ── */
.pt-sidebar {
  width: 220px; flex-shrink: 0;
  background: var(--card);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  height: 100vh; overflow-y: auto;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
}
.pt-sidebar-logo {
  padding: 20px 18px;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid var(--border);
}
.pt-logo-icon {
  width: 34px; height: 34px; background: var(--primary);
  border-radius: 9px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.pt-patient-card {
  margin: 14px 12px; padding: 14px;
  background: linear-gradient(135deg, var(--primary), #0891b2);
  border-radius: 14px;
}
.pt-patient-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.25);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: white; font-size: 15px; flex-shrink: 0;
}
.pt-patient-stats { display: flex; gap: 12px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 10px; }
.pt-nav { flex: 1; padding: 0 10px; }
.pt-nav-btn {
  display: flex; align-items: center; gap: 11px;
  width: 100%; padding: 10px 13px; border-radius: 10px;
  border: none; cursor: pointer; margin-bottom: 2px;
  font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.13s;
}
.pt-nav-btn.active   { background: var(--pl); color: var(--primary); font-weight: 700; }
.pt-nav-btn.inactive { background: transparent; color: var(--muted); font-weight: 400; }
.pt-nav-btn.inactive:hover { background: var(--bg); color: var(--text); }
.pt-nav-badge {
  background: var(--rose); color: white;
  font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 10px;
}

/* ── Sidebar footer — single logout button ── */
.pt-sidebar-footer { border-top: 1px solid var(--border); padding: 12px; }
.pt-logout-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 13px; border-radius: 10px;
  background: var(--bg); border: 1px solid var(--border);
  color: var(--muted); font-size: 13px; font-family: inherit;
  cursor: pointer; width: 100%; transition: background 0.13s;
}
.pt-logout-btn:hover { background: var(--border); }

/* mobile overlay */
.pt-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 9; }
.pt-overlay.open { display: block; }
.pt-hamburger {
  display: none; background: none; border: none; cursor: pointer;
  padding: 4px; color: var(--text); align-items: center; justify-content: center;
}

/* ── Main ── */
.pt-main   { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.pt-header {
  display: flex; align-items: center; padding: 0 24px; height: 60px;
  background: var(--card); border-bottom: 1px solid var(--border);
  gap: 14px; flex-shrink: 0;
}
.pt-header-title  { font-weight: 700; font-size: 17px; }
.pt-header-spacer { flex: 1; }
.pt-book-btn {
  background: var(--primary); color: white; border: none;
  border-radius: 10px; padding: 9px 20px; font-size: 13.5px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: opacity 0.13s;
}
.pt-book-btn:hover { opacity: 0.88; }

/* ── Header profile avatar with hover tooltip ── */
.pt-header-profile { position: relative; cursor: pointer; }
.pt-header-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #0891b2);
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 13px; cursor: pointer;
  transition: box-shadow 0.13s;
}
.pt-header-avatar:hover { box-shadow: 0 0 0 3px rgba(13,148,136,0.3); }
.pt-profile-tooltip {
  display: none; position: absolute; top: calc(100% + 10px); right: 0;
  background: var(--card); border: 1px solid var(--border); border-radius: 12px;
  padding: 14px 16px; min-width: 200px; z-index: 100;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.pt-header-profile:hover .pt-profile-tooltip { display: block; }
.pt-profile-tooltip-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #0891b2);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 15px; margin-bottom: 10px;
}
.pt-profile-tooltip-name { font-size: 14px; font-weight: 700; color: var(--text); }
.pt-profile-tooltip-id   { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
.pt-profile-tooltip-divider { height: 1px; background: var(--border); margin: 10px 0; }
.pt-profile-tooltip-signout {
  display: flex; align-items: center; gap: 7px; width: 100%;
  padding: 7px 10px; border-radius: 8px; border: none; background: transparent;
  color: var(--rose); font-size: 13px; font-weight: 500; cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.13s;
}
.pt-profile-tooltip-signout:hover { background: var(--rl); }

.pt-scroll { flex: 1; overflow-y: auto; }

/* ── Card ── */
.pt-card {
  background: var(--card); border-radius: 18px; padding: 22px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05); border: 1px solid var(--border);
}

/* ── Chip ── */
.pt-chip {
  font-size: 11px; font-weight: 600; padding: 3px 10px;
  border-radius: 20px; white-space: nowrap; display: inline-block;
}
.pt-chip-primary { background: var(--pl);  color: var(--primary); }
.pt-chip-amber   { background: var(--al);  color: var(--amber);   }
.pt-chip-rose    { background: var(--rl);  color: var(--rose);    }
.pt-chip-blue    { background: var(--bl);  color: var(--blue);    }
.pt-chip-green   { background: var(--gl);  color: var(--green);   }
.pt-chip-purple  { background: var(--pul); color: var(--purple);  }

/* ── Home screen ── */
.pt-welcome-banner {
  background: linear-gradient(135deg, #0d9488, #0891b2);
  border-radius: 20px; padding: 24px 28px; color: white;
  margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;
  gap: 16px;
}
.pt-banner-btn {
  background: rgba(255,255,255,0.2); color: white;
  border: 1.5px solid rgba(255,255,255,0.4); border-radius: 12px;
  padding: 10px 20px; font-size: 13.5px; font-weight: 600;
  cursor: pointer; white-space: nowrap; font-family: inherit;
  transition: background 0.13s; flex-shrink: 0;
}
.pt-banner-btn:hover { background: rgba(255,255,255,0.32); }
.pt-vitals-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 20px; }
.pt-home-mid-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; margin-bottom: 16px; }
.pt-home-bot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.pt-appt-cal {
  width: 48px; height: 48px; background: var(--pl); border-radius: 12px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;
}
.pt-cond-box { padding: 12px 14px; background: var(--bg); border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--border); }
.pt-allergy-box { padding: 12px 14px; background: var(--pl); border-radius: 12px; border: 1.5px dashed var(--primary); text-align: center; cursor: pointer; }
.pt-med-icon {
  width: 36px; height: 36px; background: var(--pl); border-radius: 9px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pt-view-all-btn {
  margin-top: 12px; width: 100%; padding: 9px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
  font-size: 13px; color: var(--muted); cursor: pointer; font-family: inherit;
  font-weight: 500; transition: background 0.13s;
}
.pt-view-all-btn:hover { background: var(--border); }

/* ── Appointments ── */
.pt-tab-bar { display: flex; gap: 8px; margin-bottom: 20px; }
.pt-tab-btn {
  padding: 8px 22px; border-radius: 20px; border: 1px solid var(--border);
  font-size: 13.5px; cursor: pointer; font-family: inherit; transition: all 0.13s;
}
.pt-tab-btn.active   { background: var(--primary); color: white; font-weight: 600; border-color: var(--primary); }
.pt-tab-btn.inactive { background: var(--card); color: var(--muted); font-weight: 400; }
.pt-appt-card { display: flex; gap: 18px; align-items: center; }
.pt-appt-cal-lg {
  width: 60px; height: 60px; background: var(--pl); border-radius: 14px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;
}
.pt-appt-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
.pt-reschedule-btn {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 9px; padding: 6px 14px; font-size: 12.5px;
  cursor: pointer; font-family: inherit; color: var(--muted);
}
.pt-cancel-btn {
  background: var(--rl); border: none; border-radius: 9px;
  padding: 6px 14px; font-size: 12.5px; cursor: pointer;
  font-family: inherit; color: var(--rose); font-weight: 500;
}
.pt-past-card { display: flex; align-items: center; gap: 16px; padding: 16px 20px; }
.pt-view-summary-btn {
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 9px; padding: 7px 14px; font-size: 12.5px;
  cursor: pointer; font-family: inherit; color: var(--muted);
}
.pt-book-form { max-width: 560px; }
.pt-field-label { font-size: 12.5px; font-weight: 600; color: var(--muted); margin-bottom: 5px; }
.pt-input, .pt-select, .pt-textarea {
  width: 100%; padding: 10px 13px; border-radius: 10px;
  border: 1px solid var(--border); font-size: 13.5px; outline: none;
  background: var(--bg); font-family: inherit; color: var(--text);
  transition: border-color 0.15s;
}
.pt-input:focus, .pt-select:focus, .pt-textarea:focus { border-color: var(--primary); }
.pt-textarea { resize: vertical; }
.pt-confirm-btn {
  background: var(--primary); color: white; border: none;
  border-radius: 12px; padding: 13px; font-size: 14px; font-weight: 700;
  cursor: pointer; width: 100%; font-family: inherit; margin-top: 4px;
  transition: opacity 0.13s;
}
.pt-confirm-btn:hover { opacity: 0.88; }

/* ── Records ── */
.pt-records-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; margin-bottom: 20px; }
.pt-record-card {
  display: flex; align-items: center; gap: 14px; cursor: pointer;
  transition: border-color 0.15s; padding: 18px 20px;
}
.pt-record-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pt-timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary); flex-shrink: 0; margin-top: 4px; }

/* ── Medications ── */
.pt-meds-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 20px; }
.pt-med-card { padding: 0; overflow: hidden; }
.pt-med-card-body { display: flex; align-items: center; gap: 16px; padding: 16px 20px; }
.pt-med-icon-lg {
  width: 52px; height: 52px; background: var(--pl); border-radius: 14px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pt-med-info { flex: 1; }
.pt-med-meta { text-align: right; flex-shrink: 0; }
.pt-refill-bar {
  background: var(--al); padding: 9px 20px;
  display: flex; justify-content: space-between; align-items: center;
}
.pt-refill-btn {
  background: var(--amber); color: white; border: none;
  border-radius: 8px; padding: 5px 14px; font-size: 12px;
  font-weight: 600; cursor: pointer; font-family: inherit;
}

/* ── Lab results ── */
.pt-lab-card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid var(--border);
}
.pt-lab-table { width: 100%; border-collapse: collapse; }
.pt-lab-th {
  padding: 7px 12px; text-align: left; font-size: 11.5px;
  color: var(--muted); font-weight: 600; border-bottom: 1px solid var(--border);
  background: var(--bg);
}
.pt-lab-td { padding: 9px 12px; font-size: 13px; }

/* ── Messages ── */
.pt-msg-layout { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.pt-msg-top {
  padding: 14px 24px; background: var(--card);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 12px;
}
.pt-msg-dr-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--bl); display: flex; align-items: center;
  justify-content: center; font-weight: 700; color: var(--blue); font-size: 14px;
}
.pt-msg-thread { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.pt-bubble {
  max-width: 60%; padding: 12px 16px;
  font-size: 14px; line-height: 1.6;
}
.pt-bubble.patient {
  border-radius: 18px 18px 4px 18px;
  background: var(--primary); color: white;
}
.pt-bubble.doctor {
  border-radius: 18px 18px 18px 4px;
  background: var(--card); color: var(--text); border: 1px solid var(--border);
}
.pt-bubble-time { font-size: 11px; color: var(--muted); margin-top: 4px; }
.pt-msg-compose {
  padding: 14px 24px; border-top: 1px solid var(--border);
  background: var(--card); display: flex; gap: 10px;
}
.pt-msg-input {
  flex: 1; padding: 12px 16px; border: 1px solid var(--border);
  border-radius: 12px; font-size: 13.5px; outline: none;
  background: var(--bg); font-family: inherit; color: var(--text);
  transition: border-color 0.15s;
}
.pt-msg-input:focus { border-color: var(--primary); }
.pt-msg-send {
  background: var(--primary); color: white; border: none;
  border-radius: 12px; padding: 12px 22px; font-size: 13.5px;
  font-weight: 600; cursor: pointer; font-family: inherit;
  transition: opacity 0.13s;
}
.pt-msg-send:hover { opacity: 0.88; }

/* ── Billing ── */
.pt-billing-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 20px; }
.pt-billing-table { width: 100%; border-collapse: collapse; }
.pt-billing-th {
  padding: 9px 18px; text-align: left; font-size: 11.5px;
  color: var(--muted); font-weight: 600; border-bottom: 1px solid var(--border);
  background: var(--bg);
}
.pt-billing-td { padding: 12px 18px; font-size: 13px; }
.pt-billing-row { border-bottom: 1px solid var(--border); transition: background 0.1s; }
.pt-billing-row:hover { background: var(--bg); }

/* ── Responsive ── */
@media (max-width: 1080px) {
  .pt-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 20;
    transform: translateX(-100%);
  }
  .pt-sidebar.mobile-open { transform: translateX(0); }
  .pt-hamburger { display: flex !important; }
  .pt-vitals-grid { grid-template-columns: repeat(2,1fr); }
  .pt-home-mid-grid { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .pt-header { padding: 0 14px; }
  .pt-vitals-grid { grid-template-columns: repeat(2,1fr); }
  .pt-home-bot-grid { grid-template-columns: 1fr; }
  .pt-records-grid  { grid-template-columns: 1fr; }
  .pt-meds-stats    { grid-template-columns: repeat(2,1fr); }
  .pt-billing-stats { grid-template-columns: 1fr; }
  .pt-appt-card { flex-wrap: wrap; }
  .pt-appt-actions { flex-direction: row; align-items: center; }
}
`;

// ─── Mock data ────────────────────────────────────────────────────────────────

const MEDS: Medication[] = [
  { name:'Lisinopril 10mg', cls:'ACE Inhibitor', schedule:'1 tablet every morning', refill:'May 20, 2026', pillsLeft:12, status:'Active', instructions:'Take with water. Avoid potassium-rich foods in excess. Monitor BP.' },
  { name:'HCTZ 12.5mg',     cls:'Diuretic',      schedule:'1 tablet every morning', refill:'May 20, 2026', pillsLeft:12, status:'Active', instructions:'Take in the morning to avoid nighttime urination.' },
  { name:'Aspirin 81mg',    cls:'Antiplatelet',  schedule:'1 tablet daily',          refill:'Jun 10, 2026', pillsLeft:28, status:'Active', instructions:'Take with food to reduce stomach irritation.' },
];

const LAB_RESULTS: LabResult[] = [
  { test:'Complete Blood Count (CBC)', date:'Apr 25, 2026', doctor:'Dr. Amy Chen', status:'Normal', results:[
    ['WBC','6.8','4.5–11.0 K/μL','normal'],['RBC','4.5','4.2–5.4 M/μL','normal'],
    ['Hemoglobin','13.8','12.0–16.0 g/dL','normal'],['Platelets','250','150–400 K/μL','normal'],
  ]},
  { test:'Lipid Panel', date:'Mar 15, 2026', doctor:'Dr. Amy Chen', status:'Borderline', results:[
    ['Total Cholesterol','210','< 200 mg/dL','high'],['LDL','130','< 100 mg/dL','high'],
    ['HDL','55','> 40 mg/dL','normal'],['Triglycerides','145','< 150 mg/dL','normal'],
  ]},
];

const INITIAL_MSGS: ChatMsg[] = [
  { from:'doctor',  text:"Hi Sarah, your blood pressure readings are looking much better! Keep up the great work with the lifestyle changes.", time:'Yesterday 3:42 PM' },
  { from:'patient', text:"Thank you Dr. Chen! I've been walking 30 minutes every day and reduced my sodium intake.", time:'Yesterday 4:15 PM' },
  { from:'doctor',  text:"That's excellent! Those changes can make a huge difference. Keep it up and we'll review your progress at the next appointment.", time:'Yesterday 4:20 PM' },
  { from:'patient', text:'Quick question — should I take my Lisinopril if my BP reads below 110/70?', time:'Today 9:30 AM' },
];

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV: NavItem[] = [
  { id:'home',     label:'My Health',     path:'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { id:'appts',    label:'Appointments',  path:'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z', badge:1 },
  { id:'records',  label:'My Records',    path:'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
  { id:'meds',     label:'Medications',   path:'M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
  { id:'lab',      label:'Lab Results',   path:'M6 2v6l2 2-6 10h16L12 10l2-2V2H6zm6 9.5L14.73 16H9.27L12 11.5zM10 4h4v3.17l1.17 1.17L12 12.5 8.83 8.34 10 7.17V4z' },
  { id:'messages', label:'Messages',      path:'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z', badge:1 },
  { id:'billing',  label:'Billing',       path:'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' },
];

const SCREEN_TITLES: Record<ScreenId, string> = {
  home:'My Health Overview', appts:'Appointments', records:'My Records',
  meds:'Medications', lab:'Lab Results', messages:'Messages', billing:'Billing & Payments',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) { return name.split(' ').map(n => n[0]).join(''); }

function Chip({ label, color = 'primary' }: { label: string; color?: ChipColor }) {
  return <span className={`pt-chip pt-chip-${color}`}>{label}</span>;
}

function SvgIcon({ path, size = 17, color = 'currentColor' }: { path: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink:0 }}>
      <path d={path} />
    </svg>
  );
}

// ─── Screen: Home ─────────────────────────────────────────────────────────────

const VITALS = [
  { label:'Blood Pressure', val:'128/82', unit:'mmHg', color:'#4f6ef7', spark:'M 0,20 Q 10,8 20,16 Q 30,24 40,12 Q 50,0 60,10' },
  { label:'Heart Rate',     val:'74',     unit:'bpm',  color:'#e11d48', spark:'M 0,20 Q 10,16 20,10 Q 30,4 40,14 Q 50,22 60,8' },
  { label:'Weight',         val:'68.2',   unit:'kg',   color:'#d97706', spark:'M 0,22 Q 15,20 30,18 Q 45,16 60,14' },
  { label:'O₂ Saturation',  val:'98',     unit:'%',    color:'#16a34a', spark:'M 0,16 Q 10,14 20,16 Q 30,18 40,14 Q 50,12 60,14' },
];

const HomeScreen: React.FC<{ onNav: (s: ScreenId) => void; patientName: string }> = ({ onNav, patientName }) => {
  const firstName = patientName.split(' ')[0];
  return (
    <div className="pt-scroll pt-fade" style={{ padding:24 }}>
      <div className="pt-welcome-banner">
        <div>
          <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Good morning, {firstName} 👋</div>
          <div style={{ opacity:0.8, fontSize:14 }}>Your next appointment is in <strong>2 days</strong> — May 15 with Dr. Chen.</div>
        </div>
        <button className="pt-banner-btn" onClick={() => onNav('appts')}>View Appointment</button>
      </div>

      <div className="pt-vitals-grid">
        {VITALS.map(v => (
          <div key={v.label} className="pt-card">
            <div style={{ fontSize:12, color:'var(--muted)', marginBottom:6 }}>{v.label}</div>
            <div style={{ fontSize:26, fontWeight:800, color:v.color, letterSpacing:'-0.5px', marginBottom:8 }}>
              {v.val} <span style={{ fontSize:12, fontWeight:400, color:'var(--muted)' }}>{v.unit}</span>
            </div>
            <svg viewBox="0 0 60 30" style={{ width:'100%', height:30 }}>
              <path d={v.spark} fill="none" stroke={v.color} strokeWidth="2" opacity="0.5" />
            </svg>
            <div style={{ fontSize:11, color:'var(--primary)', marginTop:4, fontWeight:500 }}>↑ Normal range</div>
          </div>
        ))}
      </div>

      <div className="pt-home-mid-grid">
        <div className="pt-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:15 }}>Upcoming Appointments</div>
            <button style={{ fontSize:12.5, color:'var(--primary)', background:'none', border:'none', cursor:'pointer', fontWeight:600 }} onClick={() => onNav('appts')}>View all →</button>
          </div>
          {[{ date:'May 15, 2026', time:'10:00 AM', doctor:'Dr. Amy Chen', type:'Follow-up · Cardiology', room:'Room 104', status:'Confirmed' as const },
            { date:'Jun 3, 2026',  time:'2:30 PM',  doctor:'Dr. Raj Patel',  type:'Blood Work Review',     room:'Lab B',     status:'Pending' as const }].map((a, i) => (
            <div key={i} style={{ display:'flex', gap:14, alignItems:'center', padding:'13px 0', borderBottom: i < 1 ? '1px solid var(--border)' : 'none' }}>
              <div className="pt-appt-cal">
                <div style={{ fontSize:16, fontWeight:800, color:'var(--primary)', lineHeight:1 }}>{a.date.split(' ')[1].replace(',','')}</div>
                <div style={{ fontSize:9.5, color:'var(--primary)', fontWeight:600 }}>{a.date.split(' ')[0].toUpperCase()}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{a.doctor}</div>
                <div style={{ fontSize:12.5, color:'var(--muted)' }}>{a.type} · {a.time}</div>
              </div>
              <Chip label={a.status} color={a.status === 'Confirmed' ? 'primary' : 'amber'} />
            </div>
          ))}
        </div>

        <div className="pt-card">
          <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>My Conditions</div>
          {([['Hypertension (Stage 1)','Managed','primary'],['Elevated Cholesterol','Monitoring','amber']] as [string,string,ChipColor][]).map(([c, s, col]) => (
            <div key={c} className="pt-cond-box">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                <span style={{ fontWeight:600, fontSize:13.5 }}>{c}</span>
                <Chip label={s} color={col} />
              </div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>Primary condition · Diagnosed Feb 2024</div>
            </div>
          ))}
          <div className="pt-allergy-box">
            <div style={{ fontSize:13, color:'var(--primary)', fontWeight:600 }}>+ Allergies: Penicillin, Sulfonamides</div>
          </div>
        </div>
      </div>

      <div className="pt-home-bot-grid">
        <div className="pt-card">
          <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Recent Lab Results</div>
          {([['CBC Panel','Apr 25, 2026','Normal','primary'],['Metabolic Panel','Apr 20, 2026','Normal','primary'],['Lipid Panel','Mar 15, 2026','Borderline','amber']] as [string,string,string,ChipColor][]).map(([t, d, r, c]) => (
            <div key={t} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight:600, fontSize:13.5 }}>{t}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{d}</div>
              </div>
              <Chip label={r} color={c} />
            </div>
          ))}
          <button className="pt-view-all-btn" onClick={() => onNav('lab')}>View All Results →</button>
        </div>

        <div className="pt-card">
          <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Active Medications</div>
          {(['Lisinopril 10mg · Once daily · AM','HCTZ 12.5mg · Once daily','Aspirin 81mg · Once daily'] as string[]).map(m => (
            <div key={m} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
              <div className="pt-med-icon">
                <SvgIcon path="M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" size={18} color="var(--primary)" />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13.5 }}>{m.split(' · ')[0]}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{m.split(' · ').slice(1).join(' · ')}</div>
              </div>
              <Chip label="Ongoing" color="primary" />
            </div>
          ))}
          <button className="pt-view-all-btn" onClick={() => onNav('meds')}>Manage Medications →</button>
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Appointments ─────────────────────────────────────────────────────

const ApptsScreen: React.FC = () => {
  const [tab, setTab] = useState<ApptTab>('upcoming');

  return (
    <div className="pt-scroll pt-fade" style={{ padding:24 }}>
      <div className="pt-tab-bar">
        {(['upcoming','past','book'] as ApptTab[]).map(t => (
          <button key={t} className={`pt-tab-btn ${tab === t ? 'active' : 'inactive'}`} onClick={() => setTab(t)}>
            {t === 'book' ? '+ Book New' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'upcoming' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[{ date:'May 15', month:'MAY', day:'Thu', doctor:'Dr. Amy Chen',  dept:'Cardiology', type:'Routine Follow-up',  time:'10:00 AM', room:'Room 104', status:'Confirmed' as const },
            { date:'Jun 3',  month:'JUN', day:'Wed', doctor:'Dr. Raj Patel', dept:'General',    type:'Lab Results Review', time:'2:30 PM',  room:'Room 201', status:'Pending' as const }].map((a, i) => (
            <div key={i} className="pt-card pt-appt-card">
              <div className="pt-appt-cal-lg">
                <div style={{ fontSize:20, fontWeight:800, color:'var(--primary)', lineHeight:1 }}>{a.date.split(' ')[1]}</div>
                <div style={{ fontSize:10, fontWeight:700, color:'var(--primary)', letterSpacing:'0.5px' }}>{a.month}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:16, marginBottom:3 }}>{a.doctor}</div>
                <div style={{ fontSize:13.5, color:'var(--muted)', marginBottom:6 }}>{a.type} · {a.dept}</div>
                <div style={{ display:'flex', gap:16, fontSize:12.5, color:'var(--muted)' }}>
                  <span>🕐 {a.time}</span><span>📍 {a.room}</span><span>📅 {a.day}</span>
                </div>
              </div>
              <div className="pt-appt-actions">
                <Chip label={a.status} color={a.status === 'Confirmed' ? 'primary' : 'amber'} />
                <div style={{ display:'flex', gap:8 }}>
                  <button className="pt-reschedule-btn">Reschedule</button>
                  <button className="pt-cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'past' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {([['Apr 20, 2026','Dr. Chen','Follow-up','Completed'],
             ['Mar 15, 2026','Dr. Chen','Lab Review','Completed'],
             ['Feb 8, 2026', 'Dr. Chen','Annual Physical','Completed']] as [string,string,string,string][]).map(([d, dr, t, s], i) => (
            <div key={i} className="pt-card pt-past-card">
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{dr} <span style={{ fontWeight:400, color:'var(--muted)', fontSize:13 }}>· {t}</span></div>
                <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:3 }}>{d}</div>
              </div>
              <Chip label={s} color="green" />
              <button className="pt-view-summary-btn">View Summary</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'book' && (
        <div className="pt-card pt-book-form">
          <div style={{ fontWeight:700, fontSize:17, marginBottom:18 }}>Book an Appointment</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {([['Department',       ['Cardiology','General Practice','Orthopedics','Pediatrics'],         'select'],
               ['Preferred Doctor', ['Dr. Amy Chen','Dr. Raj Patel','Dr. Sarah Kim','Any Available'],    'select'],
               ['Appointment Type', ['Routine Follow-up','Consultation','Annual Physical','Urgent'],     'select'],
               ['Preferred Date',   '',                                                                   'date'],
               ['Preferred Time',   ['Morning (8-12)','Afternoon (12-5)','Evening (5-8)'],              'select'],
               ['Reason for Visit', 'Briefly describe your symptoms or reason...',                       'textarea']] as [string, string | string[], string][]).map(([l, v, type]) => (
              <div key={l as string}>
                <div className="pt-field-label">{l}</div>
                {type === 'select' ? (
                  <select className="pt-select">
                    {(Array.isArray(v) ? v : [v]).map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : type === 'textarea' ? (
                  <textarea className="pt-textarea" rows={4} placeholder={v as string} />
                ) : (
                  <input type={type} className="pt-input" />
                )}
              </div>
            ))}
            <button className="pt-confirm-btn">Confirm Booking</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Screen: Records ──────────────────────────────────────────────────────────

const RecordsScreen: React.FC = () => (
  <div className="pt-scroll pt-fade" style={{ padding:24 }}>
    <div className="pt-records-grid">
      {([['Medical Summary','Primary condition, diagnoses, allergies','var(--pl)','var(--primary)'],
         ['Vital Signs History','BP, HR, weight trends over time','var(--bl)','var(--blue)'],
         ['Visit Notes','Doctor notes from each consultation','#fef3c7','var(--amber)'],
         ['Imaging & Reports','X-rays, MRIs, ultrasounds','var(--pul)','var(--purple)']] as [string,string,string,string][]).map(([t, s, bg, c]) => (
        <div key={t} className="pt-card pt-record-card"
          onMouseEnter={e => (e.currentTarget.style.borderColor = c)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
          <div className="pt-record-icon" style={{ background: bg }}>
            <SvgIcon path="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" size={22} color={c} />
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{t}</div>
            <div style={{ fontSize:12.5, color:'var(--muted)' }}>{s}</div>
          </div>
          <SvgIcon path="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" size={16} color="var(--muted)" />
        </div>
      ))}
    </div>

    <div className="pt-card">
      <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Visit History</div>
      {([['Apr 20, 2026','Routine Follow-up','Dr. Amy Chen','Hypertension management. BP 128/82. Meds continued.'],
         ['Mar 15, 2026','Lab Results Review','Dr. Amy Chen','CBC and metabolic panel reviewed. All within normal range.'],
         ['Feb 8, 2026','Annual Physical Exam','Dr. Amy Chen','Full physical. EKG normal. Weight stable. Dietary advice given.'],
         ['Jan 5, 2026','Medication Adjustment','Dr. Amy Chen','Increased Lisinopril from 5mg to 10mg due to BP reading.']] as [string,string,string,string][]).map(([d, t, dr, note], i) => (
        <div key={i} style={{ display:'flex', gap:14, padding:'14px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
          <div className="pt-timeline-dot" />
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontWeight:700, fontSize:14 }}>{t}</span>
              <span style={{ fontSize:12.5, color:'var(--muted)' }}>{d} · {dr}</span>
            </div>
            <div style={{ fontSize:13, color:'#374151', lineHeight:1.6 }}>{note}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Screen: Medications ──────────────────────────────────────────────────────

const MedsScreen: React.FC = () => (
  <div className="pt-scroll pt-fade" style={{ padding:24 }}>
    <div className="pt-meds-stats">
      {([['Active','3','var(--primary)','var(--pl)'],['Completed','2','var(--muted)','var(--bg)'],['Refill Due','1','var(--amber)','var(--al)']] as [string,string,string,string][]).map(([l, v, c, bg]) => (
        <div key={l} className="pt-card" style={{ textAlign:'center', background:bg }}>
          <div style={{ fontSize:32, fontWeight:800, color:c, marginBottom:4 }}>{v}</div>
          <div style={{ fontSize:13, color:'var(--muted)' }}>{l}</div>
        </div>
      ))}
    </div>

    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {MEDS.map((m, i) => (
        <div key={i} className="pt-card pt-med-card">
          <div className="pt-med-card-body">
            <div className="pt-med-icon-lg">
              <SvgIcon path="M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" size={26} color="var(--primary)" />
            </div>
            <div className="pt-med-info">
              <div style={{ fontWeight:700, fontSize:16, marginBottom:2 }}>
                {m.name} <span style={{ fontSize:12, color:'var(--muted)', fontWeight:400 }}>— {m.cls}</span>
              </div>
              <div style={{ fontSize:13, color:'var(--muted)', marginBottom:6 }}>{m.schedule}</div>
              <div style={{ fontSize:12.5, color:'#374151', background:'#fffef5', padding:'6px 10px', borderRadius:8, border:'1px solid #fef3c7' }}>
                {m.instructions}
              </div>
            </div>
            <div className="pt-med-meta">
              <Chip label={m.status} color="primary" />
              <div style={{ fontSize:12, color:'var(--muted)', marginTop:6 }}>Refill by {m.refill}</div>
              <div style={{ fontSize:12, color: m.pillsLeft < 15 ? 'var(--amber)' : 'var(--muted)', fontWeight: m.pillsLeft < 15 ? 600 : 400, marginTop:2 }}>
                {m.pillsLeft} pills left
              </div>
            </div>
          </div>
          {m.pillsLeft < 15 && (
            <div className="pt-refill-bar">
              <span style={{ fontSize:12.5, color:'var(--amber)', fontWeight:600 }}>⚠ Refill due soon</span>
              <button className="pt-refill-btn">Request Refill</button>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ─── Screen: Lab Results ──────────────────────────────────────────────────────

const LabScreen: React.FC = () => (
  <div className="pt-scroll pt-fade" style={{ padding:24, display:'flex', flexDirection:'column', gap:12 }}>
    {LAB_RESULTS.map((r, i) => (
      <div key={i} className="pt-card" style={{ padding:0, overflow:'hidden' }}>
        <div className="pt-lab-card-header">
          <div>
            <div style={{ fontWeight:700, fontSize:15 }}>{r.test}</div>
            <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:2 }}>{r.date} · Ordered by {r.doctor}</div>
          </div>
          <Chip label={r.status} color={r.status === 'Normal' ? 'primary' : 'amber'} />
        </div>
        <div style={{ padding:'14px 20px' }}>
          <table className="pt-lab-table">
            <thead>
              <tr style={{ background:'var(--bg)' }}>
                {['Test','Result','Reference Range','Status'].map(h => (
                  <th key={h} className="pt-lab-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {r.results.map(([name, val, ref, st]) => (
                <tr key={name}>
                  <td className="pt-lab-td" style={{ fontWeight:500 }}>{name}</td>
                  <td className="pt-lab-td" style={{ fontWeight:700, color: st==='high' ? 'var(--rose)' : st==='low' ? 'var(--amber)' : 'var(--green)' }}>{val}</td>
                  <td className="pt-lab-td" style={{ color:'var(--muted)' }}>{ref}</td>
                  <td className="pt-lab-td">
                    <Chip label={st === 'normal' ? 'Normal' : st === 'high' ? 'High' : 'Low'} color={st === 'normal' ? 'primary' : st === 'high' ? 'rose' : 'amber'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ))}
  </div>
);

// ─── Screen: Messages ─────────────────────────────────────────────────────────

const MessagesScreen: React.FC = () => {
  const [msgs, setMsgs] = useState<ChatMsg[]>(INITIAL_MSGS);
  const [draft, setDraft] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [msgs]);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
    setMsgs(m => [...m, { from:'patient', text:draft.trim(), time:`Today ${now}` }]);
    setDraft('');
  };

  return (
    <div className="pt-msg-layout pt-fade">
      <div className="pt-msg-top">
        <div className="pt-msg-dr-avatar">AC</div>
        <div>
          <div style={{ fontWeight:700, fontSize:15 }}>Dr. Amy Chen</div>
          <div style={{ fontSize:12.5, color:'var(--primary)' }}>● Online</div>
        </div>
      </div>

      <div className="pt-msg-thread" ref={threadRef}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent: m.from === 'patient' ? 'flex-end' : 'flex-start', gap:10 }}>
            {m.from === 'doctor' && <div className="pt-msg-dr-avatar" style={{ width:32, height:32, fontSize:12, flexShrink:0 }}>AC</div>}
            <div>
              <div className={`pt-bubble ${m.from}`}>{m.text}</div>
              <div className="pt-bubble-time" style={{ textAlign: m.from === 'patient' ? 'right' : 'left' }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-msg-compose">
        <input className="pt-msg-input" placeholder="Message Dr. Chen..." value={draft}
          onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
        <button className="pt-msg-send" onClick={send}>Send</button>
      </div>
    </div>
  );
};

// ─── Screen: Billing ──────────────────────────────────────────────────────────

const BillingScreen: React.FC = () => (
  <div className="pt-scroll pt-fade" style={{ padding:24 }}>
    <div className="pt-billing-stats">
      {([['Outstanding Balance','₹0.00','var(--primary)','var(--pl)'],['Last Payment','₹420.00','var(--muted)','var(--bg)'],['Insurance Coverage','80%','var(--blue)','var(--bl)']] as [string,string,string,string][]).map(([l,v,c,bg]) => (
        <div key={l} className="pt-card" style={{ background:bg }}>
          <div style={{ fontSize:12, color:'var(--muted)', marginBottom:6 }}>{l}</div>
          <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
        </div>
      ))}
    </div>

    <div className="pt-card" style={{ padding:0, overflow:'hidden' }}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:15 }}>Invoice History</div>
      <div style={{ overflowX:'auto' }}>
        <table className="pt-billing-table">
          <thead>
            <tr style={{ background:'var(--bg)' }}>
              {['Invoice #','Date','Description','Amount','Insurance','Your Cost','Status'].map(h => (
                <th key={h} className="pt-billing-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {([['INV-2408','Apr 20, 2026','Routine Follow-up','₹200','₹160','₹40','Paid'],
               ['INV-2315','Mar 15, 2026','Lab Work + Consultation','₹480','₹380','₹100','Paid'],
               ['INV-2201','Feb 8, 2026','Annual Physical','₹350','₹280','₹70','Paid'],
               ['INV-2098','Jan 5, 2026','Medication Review','₹150','₹120','₹30','Paid']] as string[][]).map((row) => (
              <tr key={row[0]} className="pt-billing-row">
                <td className="pt-billing-td" style={{ fontWeight:600, color:'var(--primary)' }}>{row[0]}</td>
                <td className="pt-billing-td" style={{ color:'var(--muted)' }}>{row[1]}</td>
                <td className="pt-billing-td">{row[2]}</td>
                <td className="pt-billing-td" style={{ fontWeight:600 }}>{row[3]}</td>
                <td className="pt-billing-td" style={{ color:'var(--muted)' }}>{row[4]}</td>
                <td className="pt-billing-td" style={{ fontWeight:700, color:'var(--primary)' }}>{row[5]}</td>
                <td className="pt-billing-td"><Chip label={row[6]} color="green" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC<{
  active: ScreenId; onNav: (s: ScreenId) => void;
  mobileOpen: boolean; patientName: string; onSignOut?: () => void;
}> = ({ active, onNav, mobileOpen, patientName, onSignOut }) => {
  const abb = initials(patientName);
  return (
    <aside className={`pt-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="pt-sidebar-logo">
        <div className="pt-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
          </svg>
        </div>
        <div>
          <div style={{ fontWeight:800, fontSize:15, letterSpacing:'-0.3px', color:'var(--text)' }}>Vexoo</div>
          <div style={{ color:'var(--muted)', fontSize:10.5 }}>Patient Portal</div>
        </div>
      </div>

      {/* Patient identity card */}
      <div className="pt-patient-card">
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <div className="pt-patient-avatar">{abb}</div>
          <div>
            <div style={{ color:'white', fontWeight:700, fontSize:14 }}>{patientName}</div>
            <div style={{ color:'rgba(255,255,255,0.7)', fontSize:11 }}>Patient ID: P-001</div>
          </div>
        </div>
        <div className="pt-patient-stats">
          {([['Age','34'],['Blood','A+'],['Dr.','Chen']] as [string,string][]).map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize:9.5, color:'rgba(255,255,255,0.6)', letterSpacing:'0.5px', textTransform:'uppercase' }}>{l}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'white' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <nav className="pt-nav">
        {NAV.map(item => {
          const on = active === item.id;
          return (
            <button key={item.id} className={`pt-nav-btn ${on ? 'active' : 'inactive'}`} onClick={() => onNav(item.id)}>
              <SvgIcon path={item.path} size={17} color="currentColor" />
              <span style={{ flex:1, textAlign:'left' }}>{item.label}</span>
              {item.badge && <span className="pt-nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Single logout button in sidebar footer */}
      <div className="pt-sidebar-footer">
        <button className="pt-logout-btn" onClick={onSignOut}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────

export default function PatientScreen({ patientName = 'Sarah Johnson', onSignOut }: PatientScreenProps) {
  const [screen, setScreen]     = useState<ScreenId>('home');
  const [mobileOpen, setMobile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobile(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNav = useCallback((s: ScreenId) => { setScreen(s); setMobile(false); }, []);

  const screenEl = useMemo(() => {
    switch (screen) {
      case 'home':     return <HomeScreen onNav={handleNav} patientName={patientName} />;
      case 'appts':    return <ApptsScreen />;
      case 'records':  return <RecordsScreen />;
      case 'meds':     return <MedsScreen />;
      case 'lab':      return <LabScreen />;
      case 'messages': return <MessagesScreen />;
      case 'billing':  return <BillingScreen />;
    }
  }, [screen, patientName, handleNav]);

  const abb = initials(patientName);

  return (
    <div className="pt-root">
      <style>{CSS}</style>

      {mobileOpen && <div className="pt-overlay open" onClick={() => setMobile(false)} />}

      <Sidebar active={screen} onNav={handleNav} mobileOpen={mobileOpen}
        patientName={patientName} onSignOut={onSignOut} />

      <div className="pt-main">
        {/* Header — action button + profile avatar (no duplicate logout) */}
        <div className="pt-header">
          <button className="pt-hamburger" onClick={() => setMobile(o => !o)} aria-label="Open menu" style={{ display:'none' }}>
            <SvgIcon path="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" size={22} color="var(--text)" />
          </button>
          <div className="pt-header-title">{SCREEN_TITLES[screen]}</div>
          <div className="pt-header-spacer" />
          <button className="pt-book-btn" onClick={() => handleNav('appts')}>+ Book Appointment</button>

          {/* Profile avatar — hover to see details + sign out */}
          <div className="pt-header-profile" onClick={() => setShowProfile(true)}>
            <div className="pt-header-avatar">{abb}</div>
            <div className="pt-profile-tooltip">
              <div className="pt-profile-tooltip-avatar">{abb}</div>
              <div className="pt-profile-tooltip-name">{patientName}</div>
              <div className="pt-profile-tooltip-id">Patient ID: P-001</div>
              <div className="pt-profile-tooltip-divider" />
              <button
                className="pt-profile-tooltip-signout"
                onClick={e => { e.stopPropagation(); setShowProfile(true); }}
                style={{ color: 'var(--primary)', marginBottom: 4 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                View / Edit Profile
              </button>
              <button className="pt-profile-tooltip-signout" onClick={e => { e.stopPropagation(); onSignOut?.(); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>

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
            background:'white', borderRadius:18, padding:28,
            width:420, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(0,0,0,0.2)',
            border:'1px solid var(--border)'
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
              <div style={{ width:60, height:60, borderRadius:'50%',
                background:'linear-gradient(135deg,var(--primary),#0891b2)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'white', fontSize:22, fontWeight:700 }}>{abb}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:17 }}>{patientName}</div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>Patient · P-001</div>
              </div>
            </div>
            {[['Full Name', patientName], ['Email', 'sarah.j@email.com'], ['Phone', '+1 555-0101'], ['Date of Birth', 'Mar 15, 1992'], ['Blood Group', 'A+']].map(([label, val]) => (
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
