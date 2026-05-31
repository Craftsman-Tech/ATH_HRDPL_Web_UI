/**
 * ============================================================================
 *  LabTechScreen.tsx — Lab Technician Portal
 * ============================================================================
 *  Dark navy sidebar, light blue-tinted body portal for lab staff.
 *  Faithfully ported from Vexoo_Lab_Tech.html.
 *
 *  Screens (6):
 *    Test Orders · Sample Tracking · Enter Results
 *    Results Review · Equipment Status · Lab Reports
 *
 *  Route:           /lab  (protected, role === 'LabTech')
 *  Suggested path:  apps/web/src/screens/lab-tech/LabTechScreen.tsx
 *
 *  Props:
 *    techName?   — from AuthContext (e.g. "Kevin Liu")
 *    onSignOut?  — called when Logout is clicked
 *
 *  Aesthetic: dark navy sidebar (#1e2a4a), light #f4f6fb body, blue primary
 *             (#3b82f6), STAT alerts in rose, Plus Jakarta Sans.
 * ============================================================================
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ScreenId   = 'orders' | 'samples' | 'results' | 'review' | 'equipment' | 'reports';
type Priority   = 'STAT' | 'Urgent' | 'Routine';
type OrderStatus= 'Processing' | 'Complete' | 'Pending';
type SampleStatus = 'Processing' | 'Complete' | 'Awaiting' | 'Scheduled';
type EqStatus   = 'Online' | 'Warning' | 'Offline';
type ChipColor  = 'primary' | 'amber' | 'rose' | 'blue' | 'green' | 'purple' | 'gray';

interface NavItem { id: ScreenId; label: string; path: string; badge?: number; }

interface LabOrder {
  id: string; patient: string; pid: string; test: string;
  ordered: string; time: string; priority: Priority; status: OrderStatus;
  type: string; collected: string; barcode: string;
}
interface Sample {
  barcode: string; patient: string; test: string; collected: string;
  location: string; status: SampleStatus; eta: string;
}
interface Equipment {
  id: string; name: string; model: string; status: EqStatus;
  load: string; lastCalib: string; nextCalib: string;
  tests: string[]; uptime: string;
}
interface ReviewResult {
  id: string; patient: string; test: string; date: string;
  status: 'Normal' | 'Abnormal'; doctor: string;
  results: [string, string, string, 'normal' | 'high' | 'low'][];
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface LabTechScreenProps {
  techName?: string;
  onSignOut?: () => void;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.lt-root {
  --bg:      #f4f6fb;
  --sidebar: #1e2a4a;
  --primary: #3b82f6;
  --pl:      #dbeafe;
  --teal:    #0d9488;
  --tl:      #e6faf8;
  --amber:   #d97706;
  --al:      #fef3c7;
  --rose:    #e11d48;
  --rl:      #ffe4e6;
  --green:   #16a34a;
  --gl:      #dcfce7;
  --purple:  #7c3aed;
  --pul:     #ede9fe;
  --text:    #1e293b;
  --muted:   #64748b;
  --border:  #e4e8f0;
  --card:    #fff;

  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  height: 100vh;
  overflow: hidden;
  display: flex;
}

.lt-root ::-webkit-scrollbar       { width: 5px; height: 5px; }
.lt-root ::-webkit-scrollbar-thumb { background: #cdd4e0; border-radius: 4px; }
.lt-root ::-webkit-scrollbar-track { background: transparent; }

@keyframes lt-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.lt-fade { animation: lt-fade 0.2s ease both; }
@keyframes lt-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
.lt-pulse { animation: lt-pulse 2s ease-in-out infinite; }

/* ── Sidebar ── */
.lt-sidebar {
  width: 226px; flex-shrink: 0;
  background: var(--sidebar);
  display: flex; flex-direction: column;
  height: 100vh; overflow-y: auto;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
}
.lt-logo-row {
  padding: 18px 20px;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.lt-logo-icon {
  width: 34px; height: 34px; background: var(--primary);
  border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.lt-sidebar-stats {
  padding: 12px 14px 8px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
}
.lt-stat-pill { background: rgba(255,255,255,0.07); border-radius: 10px; padding: 10px 12px; text-align: center; }
.lt-nav { flex: 1; padding: 8px 10px; }
.lt-nav-btn {
  display: flex; align-items: center; gap: 11px;
  width: 100%; padding: 10px 13px; border-radius: 10px;
  border: none; cursor: pointer; margin-bottom: 2px;
  font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.13s;
}
.lt-nav-btn.active   { background: var(--primary); color: white; font-weight: 600; }
.lt-nav-btn.inactive { background: transparent; color: rgba(255,255,255,0.55); font-weight: 400; }
.lt-nav-btn.inactive:hover { background: rgba(255,255,255,0.07); color: white; }
.lt-nav-badge { background: var(--rose); color: white; font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 10px; }
.lt-sidebar-footer { border-top: 1px solid rgba(255,255,255,0.07); padding: 12px; }
.lt-logout-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 13px; border-radius: 10px; margin-bottom: 6px;
  background: rgba(255,255,255,0.07); border: none;
  color: rgba(255,255,255,0.55); font-size: 13px;
  font-family: inherit; cursor: pointer; width: 100%; transition: background 0.13s;
}
.lt-logout-btn:hover { background: rgba(255,255,255,0.12); color: white; }
.lt-user-row { display: flex; align-items: center; gap: 10px; padding: 8px 13px; }
.lt-user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--purple));
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: white; font-size: 12px; flex-shrink: 0;
}

/* mobile overlay */
.lt-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 9; }
.lt-overlay.open { display: block; }
.lt-hamburger {
  display: none; background: none; border: none; cursor: pointer;
  padding: 4px; color: var(--text); align-items: center; justify-content: center;
}

/* ── Main ── */
.lt-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.lt-header {
  display: flex; align-items: center; padding: 0 24px; height: 60px;
  background: var(--card); border-bottom: 1px solid var(--border);
  gap: 14px; flex-shrink: 0;
}
.lt-header-title  { font-weight: 700; font-size: 17px; }
.lt-header-spacer { flex: 1; }
.lt-stat-alert {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 10px; background: var(--rl);
  border-radius: 9px; border: 1px solid #fca5a5;
}
.lt-stat-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--rose); }
.lt-scroll { flex: 1; overflow-y: auto; }

/* ── Card ── */
.lt-card {
  background: var(--card); border-radius: 16px; padding: 20px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05); border: 1px solid var(--border);
}

/* ── Chip ── */
.lt-chip { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; white-space: nowrap; display: inline-block; }
.lt-chip-primary { background: var(--pl);  color: var(--primary); }
.lt-chip-amber   { background: var(--al);  color: var(--amber);   }
.lt-chip-rose    { background: var(--rl);  color: var(--rose);    }
.lt-chip-blue    { background: var(--pl);  color: var(--primary); }
.lt-chip-green   { background: var(--gl);  color: var(--green);   }
.lt-chip-purple  { background: var(--pul); color: var(--purple);  }
.lt-chip-gray    { background: #f1f5f9;    color: var(--muted);   }

/* ── Table ── */
.lt-table { width: 100%; border-collapse: collapse; }
.lt-th { padding: 9px 18px; text-align: left; font-size: 11.5px; color: var(--muted); font-weight: 600; background: var(--bg); border-bottom: 1px solid var(--border); white-space: nowrap; }
.lt-td { padding: 12px 18px; font-size: 13px; }
.lt-tr { border-bottom: 1px solid var(--border); transition: background 0.1s; cursor: pointer; }
.lt-tr:hover { background: var(--bg) !important; }
.lt-tr:last-child { border-bottom: none; }

/* ── Orders ── */
.lt-orders-layout { flex: 1; display: grid; grid-template-columns: 1fr 380px; overflow: hidden; }
.lt-orders-list   { overflow-y: auto; padding: 20px; }
.lt-orders-detail { border-left: 1px solid var(--border); overflow-y: auto; background: var(--card); }
.lt-orders-stats  { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 14px; }
.lt-order-stat    { border-radius: 12px; padding: 12px 14px; text-align: center; border: 1px solid transparent; }
.lt-order-row {
  border-radius: 13px; padding: 14px 18px; cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; gap: 14px; margin-bottom: 8px;
  border-style: solid;
}
.lt-order-row.selected { background: var(--pl); border-width: 1.5px; border-color: var(--primary); }
.lt-order-row.normal   { background: var(--card); border-width: 1px; border-color: var(--border); }
.lt-order-row:hover    { border-color: var(--primary); }
.lt-detail-header { padding: 20px 22px; color: white; }
.lt-detail-section { background: var(--bg); border-radius: 12px; padding: 14px 16px; border: 1px solid var(--border); }
.lt-detail-label  { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
.lt-detail-row    { display: flex; justify-content: space-between; margin-bottom: 7px; gap: 12px; }
.lt-step-dot {
  width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.lt-action-btn {
  background: var(--primary); color: white; border: none; border-radius: 12px;
  padding: 13px; font-size: 14px; font-weight: 700; cursor: pointer;
  width: 100%; font-family: inherit; transition: opacity 0.13s;
}
.lt-action-btn:hover { opacity: 0.88; }
.lt-complete-banner {
  background: var(--gl); border: 1px solid var(--green); border-radius: 12px;
  padding: 13px; text-align: center; color: var(--green); font-weight: 700; font-size: 14px;
}

/* ── Results entry ── */
.lt-results-layout { display: grid; grid-template-columns: 260px 1fr; gap: 16px; }
.lt-order-pick {
  padding: 12px 14px; border-radius: 11px; cursor: pointer; transition: all 0.13s;
  margin-bottom: 8px;
}
.lt-order-pick.active  { background: var(--pl); border: 1.5px solid var(--primary); }
.lt-order-pick.inactive{ background: var(--card); border: 1px solid var(--border); }
.lt-result-field { background: var(--bg); border-radius: 12px; padding: 14px 16px; border: 1px solid var(--border); }
.lt-result-input {
  flex: 1; padding: 8px 12px; border: 1px solid var(--border); border-radius: 9px;
  font-size: 14px; font-weight: 600; outline: none; background: var(--card);
  font-family: inherit; color: var(--text); transition: border-color 0.15s;
}
.lt-result-input:focus { border-color: var(--primary); }
.lt-notes-textarea {
  width: 100%; padding: 10px 14px; border: 1px solid var(--border);
  border-radius: 10px; font-size: 13.5px; outline: none; resize: vertical;
  min-height: 80px; background: var(--bg); line-height: 1.6; font-family: inherit;
  color: var(--text); transition: border-color 0.15s;
}
.lt-notes-textarea:focus { border-color: var(--primary); }
.lt-submit-btn {
  background: var(--primary); color: white; border: none; border-radius: 10px;
  padding: 11px 24px; font-size: 13.5px; font-weight: 700; cursor: pointer; font-family: inherit;
}
.lt-ghost-btn {
  background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
  padding: 11px 20px; font-size: 13.5px; cursor: pointer; color: var(--muted); font-family: inherit;
}
.lt-flag-btn {
  background: var(--rl); color: var(--rose); border: 1px solid var(--rose);
  border-radius: 10px; padding: 11px 18px; font-size: 13.5px; font-weight: 600; cursor: pointer; font-family: inherit;
}

/* ── Review ── */
.lt-review-card-header {
  padding: 16px 20px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.lt-print-btn {
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  padding: 5px 14px; font-size: 12.5px; cursor: pointer; color: var(--muted); font-family: inherit;
}
.lt-result-th { padding: 7px 12px; text-align: left; font-size: 11.5px; color: var(--muted); font-weight: 600; border-bottom: 1px solid var(--border); }
.lt-result-td { padding: 9px 12px; font-size: 13.5px; }

/* ── Equipment ── */
.lt-eq-stats   { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 16px; }
.lt-eq-grid    { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
.lt-eq-card    { border-radius: 16px; padding: 20px; border-left-width: 4px; border-left-style: solid; }
.lt-eq-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
.lt-eq-meta-box { background: var(--bg); border-radius: 8px; padding: 8px 10px; }

/* ── Reports ── */
.lt-reports-top  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.lt-reports-bot  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.lt-bar-chart    { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
.lt-bar-col      { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.lt-bar-block    { width: 100%; border-radius: 4px 4px 0 0; }
.lt-kpi-row      { display: flex; justify-content: space-between; align-items: center; padding: 9px 12px; background: var(--bg); border-radius: 10px; margin-bottom: 7px; }

/* ── Responsive ── */
@media (max-width: 1080px) {
  .lt-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 20;
    transform: translateX(-100%);
  }
  .lt-sidebar.mobile-open { transform: translateX(0); }
  .lt-hamburger { display: flex !important; }
  .lt-orders-layout  { grid-template-columns: 1fr; }
  .lt-orders-detail  { display: none; }
  .lt-results-layout { grid-template-columns: 1fr; }
  .lt-eq-grid        { grid-template-columns: 1fr; }
  .lt-reports-top    { grid-template-columns: 1fr; }
  .lt-reports-bot    { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .lt-orders-stats { grid-template-columns: repeat(2,1fr); }
  .lt-eq-stats     { grid-template-columns: repeat(2,1fr); }
}
`;

// ─── Mock data ────────────────────────────────────────────────────────────────

const ORDERS: LabOrder[] = [
  { id:'L-0091', patient:'Marcus Williams', pid:'P-002', test:'HbA1c Panel',           ordered:'Dr. Patel', time:'08:30 AM', priority:'Routine', status:'Processing', type:'Blood',       collected:'08:45 AM', barcode:'VX-20260426-0091' },
  { id:'L-0092', patient:"James O'Brien",   pid:'P-004', test:'ECG + Troponin I',       ordered:'Dr. Chen',  time:'09:00 AM', priority:'STAT',    status:'Processing', type:'Blood + ECG', collected:'09:05 AM', barcode:'VX-20260426-0092' },
  { id:'L-0093', patient:'Sarah Johnson',   pid:'P-001', test:'CBC + Metabolic Panel',  ordered:'Dr. Chen',  time:'07:45 AM', priority:'Routine', status:'Complete',   type:'Blood',       collected:'08:00 AM', barcode:'VX-20260426-0093' },
  { id:'L-0094', patient:'Elena Rodriguez', pid:'P-003', test:'Spirometry + PFT',       ordered:'Dr. Kim',   time:'10:00 AM', priority:'Routine', status:'Pending',    type:'Pulmonary',   collected:'—',        barcode:'VX-20260426-0094' },
  { id:'L-0095', patient:'Priya Sharma',    pid:'P-005', test:'MRI Brain w/ Contrast',  ordered:'Dr. Patel', time:'11:30 AM', priority:'Urgent',  status:'Pending',    type:'Imaging',     collected:'—',        barcode:'VX-20260426-0095' },
  { id:'L-0096', patient:'Thomas Klein',    pid:'P-006', test:'Pulmonary Function Test', ordered:'Dr. Kim',   time:'01:00 PM', priority:'Routine', status:'Complete',   type:'Pulmonary',   collected:'01:10 PM', barcode:'VX-20260426-0096' },
];

const SAMPLES: Sample[] = [
  { barcode:'VX-20260426-0091', patient:'Marcus Williams', test:'HbA1c Panel',  collected:'08:45 AM', location:'Analyzer A',     status:'Processing', eta:'~30 min'  },
  { barcode:'VX-20260426-0092', patient:"James O'Brien",   test:'Troponin I',   collected:'09:05 AM', location:'Analyzer B',     status:'Processing', eta:'~15 min'  },
  { barcode:'VX-20260426-0093', patient:'Sarah Johnson',   test:'CBC',          collected:'08:00 AM', location:'Archive',        status:'Complete',   eta:'Done'     },
  { barcode:'VX-20260426-0094', patient:'Elena Rodriguez', test:'Spirometry',   collected:'—',        location:'Collection Bay', status:'Awaiting',   eta:'—'        },
  { barcode:'VX-20260426-0095', patient:'Priya Sharma',    test:'MRI Brain',    collected:'—',        location:'Imaging Suite',  status:'Scheduled',  eta:'11:30 AM' },
  { barcode:'VX-20260426-0096', patient:'Thomas Klein',    test:'PFT',          collected:'01:10 PM', location:'Archive',        status:'Complete',   eta:'Done'     },
];

const RESULT_FIELDS: Record<string, [string, string, string][]> = {
  'HbA1c Panel':           [['HbA1c','%','< 5.7'],['Fasting Glucose','mg/dL','70–99'],['Estimated Avg Glucose','mg/dL','—']],
  'ECG + Troponin I':      [['Troponin I','ng/mL','< 0.04'],['Heart Rate','bpm','60–100'],['PR Interval','ms','120–200'],['QRS Duration','ms','< 120']],
  'CBC + Metabolic Panel': [['WBC','K/μL','4.5–11.0'],['RBC','M/μL','4.2–5.4'],['Hemoglobin','g/dL','12.0–16.0'],['Sodium','mEq/L','136–145'],['Potassium','mEq/L','3.5–5.1']],
  'Spirometry + PFT':      [['FVC','L','≥ 3.5'],['FEV1','L','≥ 2.8'],['FEV1/FVC','%','≥ 70'],['TLC','L','4.5–7.5']],
  'MRI Brain w/ Contrast': [['Lesions','Y/N','None'],['Edema','Y/N','None'],['Enhancement','Y/N','None']],
  'Pulmonary Function Test':[['FVC','L','≥ 3.5'],['FEV1','L','≥ 2.8'],['DLCO','%pred','≥ 75']],
};

const REVIEW_RESULTS: ReviewResult[] = [
  { id:'L-0093', patient:'Sarah Johnson', test:'CBC + Metabolic Panel', date:'Apr 26, 2026', status:'Normal', doctor:'Dr. Chen', results:[
    ['WBC','6.8','4.5–11.0 K/μL','normal'],['RBC','4.5','4.2–5.4 M/μL','normal'],
    ['Hemoglobin','13.8','12.0–16.0 g/dL','normal'],['Sodium','140','136–145 mEq/L','normal'],
    ['Potassium','4.1','3.5–5.1 mEq/L','normal'],
  ]},
  { id:'L-0096', patient:'Thomas Klein', test:'Pulmonary Function Test', date:'Apr 26, 2026', status:'Abnormal', doctor:'Dr. Kim', results:[
    ['FVC','2.8','≥ 3.5 L','low'],['FEV1','1.6','≥ 2.8 L','low'],
    ['FEV1/FVC','57','≥ 70 %','low'],['DLCO','62','≥ 75 %pred','low'],
  ]},
];

const EQUIPMENT: Equipment[] = [
  { id:'ANA-001', name:'Hematology Analyzer',  model:'Sysmex XN-1000',        status:'Online',   load:'72%', lastCalib:'Apr 24, 2026', nextCalib:'May 8, 2026',  tests:['CBC','Reticulocytes'],                uptime:'99.2%' },
  { id:'ANA-002', name:'Chemistry Analyzer',   model:'Roche Cobas 8000',       status:'Online',   load:'45%', lastCalib:'Apr 22, 2026', nextCalib:'May 6, 2026',  tests:['Metabolic Panel','LFTs','Lipids'],    uptime:'98.8%' },
  { id:'ANA-003', name:'Immunoassay Analyzer', model:'Abbott Architect',        status:'Warning',  load:'88%', lastCalib:'Apr 20, 2026', nextCalib:'May 4, 2026',  tests:['Troponin','HbA1c','TSH'],            uptime:'96.1%' },
  { id:'IMG-001', name:'MRI Scanner',          model:'Siemens MAGNETOM',        status:'Online',   load:'30%', lastCalib:'Apr 15, 2026', nextCalib:'May 15, 2026', tests:['MRI Brain','MRI Spine','MRI Body'],  uptime:'99.7%' },
  { id:'PFT-001', name:'Spirometer',           model:'ndd EasyOne Air',         status:'Online',   load:'20%', lastCalib:'Apr 25, 2026', nextCalib:'May 9, 2026',  tests:['Spirometry','PFT'],                  uptime:'100%'  },
  { id:'ECG-001', name:'ECG Machine',          model:'Philips PageWriter TC70', status:'Offline',  load:'0%',  lastCalib:'Apr 10, 2026', nextCalib:'—',            tests:['ECG','Holter'],                      uptime:'85.0%' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) { return name.split(' ').map(n => n[0]).join(''); }

function statusColor(s: string): ChipColor {
  if (s === 'STAT')       return 'rose';
  if (s === 'Urgent')     return 'amber';
  if (s === 'Complete')   return 'green';
  if (s === 'Processing') return 'primary';
  if (s === 'Pending')    return 'purple';
  if (s === 'Online')     return 'green';
  if (s === 'Warning')    return 'amber';
  if (s === 'Offline')    return 'rose';
  if (s === 'Awaiting')   return 'amber';
  if (s === 'Scheduled')  return 'purple';
  return 'gray';
}

function eqBorderColor(s: EqStatus) {
  if (s === 'Online')  return 'var(--green)';
  if (s === 'Warning') return 'var(--amber)';
  return 'var(--rose)';
}

function priorityLeftBorder(p: Priority) {
  if (p === 'STAT')   return 'var(--rose)';
  if (p === 'Urgent') return 'var(--amber)';
  return 'var(--border)';
}

function Chip({ label, color = 'primary' }: { label: string; color?: ChipColor }) {
  return <span className={`lt-chip lt-chip-${color}`}>{label}</span>;
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
  { id:'orders',    label:'Test Orders',      badge:2, path:'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z' },
  { id:'samples',   label:'Sample Tracking',          path:'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 8H8V9h4V7l4 4-4 4v-4z' },
  { id:'results',   label:'Enter Results',            path:'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
  { id:'review',    label:'Results Review',           path:'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' },
  { id:'equipment', label:'Equipment Status',         path:'M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z' },
  { id:'reports',   label:'Reports',                  path:'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z' },
];

const SCREEN_TITLES: Record<ScreenId, string> = {
  orders:'Test Orders', samples:'Sample Tracking', results:'Enter Results',
  review:'Results Review', equipment:'Equipment Status', reports:'Lab Reports',
};

const PROCESSING_STEPS = ['Sample Received & Logged','Sample Centrifuged','Analysis Running','Results Verified','Report Released'];

// ─── Screen: Orders ───────────────────────────────────────────────────────────

const OrdersScreen: React.FC = () => {
  const [sel, setSel] = useState<LabOrder>(ORDERS[1]);

  const sorted = useMemo(() => [...ORDERS].sort((a, b) => {
    const p: Record<Priority, number> = { STAT:0, Urgent:1, Routine:2 };
    return p[a.priority] - p[b.priority];
  }), []);

  const statCount = (key: string, val: string) =>
    ORDERS.filter(o => (o.priority === val || o.status === val)).length;

  return (
    <div className="lt-orders-layout lt-fade">
      {/* List */}
      <div className="lt-orders-list">
        <div className="lt-orders-stats">
          {([['STAT',   ORDERS.filter(o=>o.priority==='STAT').length,   'var(--rose)',    'var(--rl)'],
             ['Urgent', ORDERS.filter(o=>o.priority==='Urgent').length,  'var(--amber)',   'var(--al)'],
             ['Processing',ORDERS.filter(o=>o.status==='Processing').length,'var(--primary)','var(--pl)'],
             ['Complete',  ORDERS.filter(o=>o.status==='Complete').length,  'var(--green)', 'var(--gl)']] as [string,number,string,string][]).map(([l, n, c, bg]) => (
            <div key={l} className="lt-order-stat" style={{ background:bg }}>
              <div style={{ fontSize:24, fontWeight:800, color:c }}>{n}</div>
              <div style={{ fontSize:12, color:c, marginTop:2, fontWeight:500 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column' }}>
          {sorted.map(o => (
            <div key={o.id} className={`lt-order-row ${sel.id === o.id ? 'selected' : 'normal'}`}
              style={{ borderLeftWidth:4, borderLeftStyle:'solid', borderLeftColor: priorityLeftBorder(o.priority) }}
              onClick={() => setSel(o)}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <span style={{ fontWeight:700, fontSize:14 }}>{o.patient}</span>
                  <div style={{ display:'flex', gap:6 }}>
                    <Chip label={o.priority} color={statusColor(o.priority)} />
                    <Chip label={o.status}   color={statusColor(o.status)}   />
                  </div>
                </div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{o.test}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{o.id} · {o.type} · Ordered by {o.ordered} · {o.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="lt-orders-detail">
        <div className="lt-detail-header"
          style={{ background: sel.priority === 'STAT' ? 'linear-gradient(135deg,#7f1d1d,#991b1b)' : 'linear-gradient(135deg,#1e2a4a,#2a3a6a)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            {sel.priority === 'STAT' && (
              <span style={{ background:'rgba(255,255,255,0.2)', padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>🚨 STAT</span>
            )}
            <span style={{ fontSize:12, opacity:0.6 }}>{sel.id}</span>
          </div>
          <div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>{sel.test}</div>
          <div style={{ opacity:0.75, fontSize:13 }}>{sel.patient} · {sel.type} · Ordered {sel.time}</div>
        </div>

        <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
          {/* Order details */}
          <div className="lt-detail-section">
            <div className="lt-detail-label">Order Details</div>
            {([['Patient', sel.patient],['Patient ID', sel.pid],['Test', sel.test],
               ['Sample Type', sel.type],['Ordered By', sel.ordered],['Order Time', sel.time],
               ['Priority', sel.priority],['Sample Collected', sel.collected],
               ['Barcode', sel.barcode]] as [string, string][]).map(([k, v]) => (
              <div key={k} className="lt-detail-row">
                <span style={{ fontSize:12, color:'var(--muted)', flexShrink:0 }}>{k}</span>
                <span style={{ fontSize:12.5, fontWeight:500, textAlign:'right',
                  color: k === 'Priority' && sel.priority === 'STAT' ? 'var(--rose)' : 'var(--text)',
                  fontFamily: k === 'Barcode' ? 'monospace' : 'inherit' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Processing steps */}
          <div>
            <div className="lt-detail-label">Processing Steps</div>
            {PROCESSING_STEPS.map((step, i) => {
              const done   = sel.status === 'Complete' ? true : sel.status === 'Processing' ? i < 2 ? true : i === 2 ? false : false : i < 1;
              const active = sel.status === 'Processing' && i === 2;
              return (
                <div key={step} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                  <div className="lt-step-dot" style={{
                    background: done ? 'var(--green)' : active ? 'var(--primary)' : 'var(--bg)',
                    border: done ? 'none' : active ? '2px solid var(--primary)' : '2px solid var(--border)',
                  }}>
                    {done
                      ? <SvgIcon path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" size={12} color="white" />
                      : <div style={{ width:8, height:8, borderRadius:'50%', background: active ? 'var(--primary)' : 'var(--border)' }} />}
                  </div>
                  <span style={{ fontSize:13, fontWeight: done ? 500 : 400, color: done ? 'var(--text)' : active ? 'var(--primary)' : 'var(--muted)', flex:1 }}>{step}</span>
                  {active && <span style={{ fontSize:11, color:'var(--primary)', fontWeight:600 }}>In progress...</span>}
                </div>
              );
            })}
          </div>

          {sel.status !== 'Complete' ? (
            <button className="lt-action-btn">
              {sel.status === 'Pending' ? 'Collect Sample' : 'Mark Step Complete'}
            </button>
          ) : (
            <div className="lt-complete-banner">✓ Results Released to Doctor</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Sample Tracking ──────────────────────────────────────────────────

const SamplesScreen: React.FC = () => (
  <div className="lt-scroll lt-fade" style={{ padding:20 }}>
    <div className="lt-card" style={{ padding:0, overflow:'hidden' }}>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:15 }}>Sample Tracking Board</div>
      <div style={{ overflowX:'auto' }}>
        <table className="lt-table">
          <thead>
            <tr>{['Barcode','Patient','Test','Collected','Location','Status','ETA',''].map(h => <th key={h} className="lt-th">{h}</th>)}</tr>
          </thead>
          <tbody>
            {SAMPLES.map((s, i) => (
              <tr key={s.barcode} className="lt-tr">
                <td className="lt-td" style={{ fontWeight:600, color:'var(--primary)', fontSize:12.5, fontFamily:'monospace' }}>{s.barcode}</td>
                <td className="lt-td" style={{ fontWeight:600 }}>{s.patient}</td>
                <td className="lt-td">{s.test}</td>
                <td className="lt-td" style={{ color:'var(--muted)' }}>{s.collected}</td>
                <td className="lt-td">{s.location}</td>
                <td className="lt-td"><Chip label={s.status} color={statusColor(s.status)} /></td>
                <td className="lt-td" style={{ color:'var(--muted)', fontWeight: s.status === 'Processing' ? 600 : 400 }}>{s.eta}</td>
                <td className="lt-td">
                  <button style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', fontSize:12, cursor:'pointer', color:'var(--muted)', fontFamily:'inherit' }}>Track</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── Screen: Enter Results ────────────────────────────────────────────────────

const ResultsScreen: React.FC = () => {
  const activeOrders = ORDERS.filter(o => o.status !== 'Complete');
  const [selOrder, setSelOrder] = useState<LabOrder>(activeOrders[0]);
  const fields = RESULT_FIELDS[selOrder.test] ?? [];

  return (
    <div className="lt-scroll lt-fade" style={{ padding:20 }}>
      <div className="lt-results-layout">
        {/* Order picker */}
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:4, padding:'0 4px' }}>Active Orders</div>
          {activeOrders.map(o => (
            <div key={o.id} className={`lt-order-pick ${selOrder.id === o.id ? 'active' : 'inactive'}`} onClick={() => setSelOrder(o)}>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{o.patient}</div>
              <div style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>{o.test}</div>
              <Chip label={o.priority} color={statusColor(o.priority)} />
            </div>
          ))}
        </div>

        {/* Result form */}
        <div className="lt-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:17, marginBottom:3 }}>{selOrder.test}</div>
              <div style={{ fontSize:13, color:'var(--muted)' }}>{selOrder.patient} · {selOrder.id} · Ordered by {selOrder.ordered}</div>
            </div>
            <Chip label={selOrder.priority} color={statusColor(selOrder.priority)} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:20 }}>
            {fields.map(([name, unit, ref]) => (
              <div key={name} className="lt-result-field">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:13, fontWeight:600 }}>{name}</span>
                  <span style={{ fontSize:11.5, color:'var(--muted)' }}>Ref: {ref} {unit}</span>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <input type="number" step="0.01" placeholder="Value" className="lt-result-input" />
                  <span style={{ fontSize:13, color:'var(--muted)', fontWeight:500, flexShrink:0 }}>{unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:12.5, fontWeight:600, color:'var(--muted)', marginBottom:6 }}>Interpretation / Notes</div>
            <textarea className="lt-notes-textarea" placeholder="Add interpretation or notes for the physician..." />
          </div>

          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button className="lt-submit-btn">Submit & Release Results</button>
            <button className="lt-ghost-btn">Save Draft</button>
            {selOrder.priority === 'STAT' && (
              <button className="lt-flag-btn">🚨 Flag Critical</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Results Review ───────────────────────────────────────────────────

const ReviewScreen: React.FC = () => (
  <div className="lt-scroll lt-fade" style={{ padding:20, display:'flex', flexDirection:'column', gap:12 }}>
    {REVIEW_RESULTS.map((r, i) => (
      <div key={i} className="lt-card" style={{ padding:0, overflow:'hidden' }}>
        <div className="lt-review-card-header" style={{ background: r.status === 'Abnormal' ? '#fff8f8' : 'var(--card)' }}>
          <div>
            <div style={{ fontWeight:700, fontSize:15 }}>{r.test}</div>
            <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:2 }}>{r.patient} · {r.id} · {r.date} · Ordered by {r.doctor}</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Chip label={r.status} color={r.status === 'Normal' ? 'green' : 'rose'} />
            <button className="lt-print-btn">Print Report</button>
          </div>
        </div>
        <div style={{ padding:'14px 20px' }}>
          <table className="lt-table">
            <thead>
              <tr>{['Parameter','Result','Reference Range','Flag'].map(h => <th key={h} className="lt-result-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {r.results.map(([name, val, ref, st]) => (
                <tr key={name} style={{ background: st !== 'normal' ? '#fff8f8' : 'transparent' }}>
                  <td className="lt-result-td" style={{ fontWeight:500 }}>{name}</td>
                  <td className="lt-result-td" style={{ fontWeight:800, color: st === 'low' ? 'var(--rose)' : st === 'high' ? 'var(--amber)' : 'var(--green)' }}>{val}</td>
                  <td className="lt-result-td" style={{ fontSize:12.5, color:'var(--muted)' }}>{ref}</td>
                  <td className="lt-result-td">
                    {st !== 'normal'
                      ? <span style={{ background:'var(--rl)', color:'var(--rose)', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>▼ {st.toUpperCase()}</span>
                      : <span style={{ background:'var(--gl)', color:'var(--green)', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>✓ NORMAL</span>}
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

// ─── Screen: Equipment Status ─────────────────────────────────────────────────

const EquipmentScreen: React.FC = () => {
  const online  = EQUIPMENT.filter(e => e.status === 'Online').length;
  const warning = EQUIPMENT.filter(e => e.status === 'Warning').length;
  const offline = EQUIPMENT.filter(e => e.status === 'Offline').length;

  return (
    <div className="lt-scroll lt-fade" style={{ padding:20 }}>
      <div className="lt-eq-stats">
        {([['Online', online,          'var(--green)',   'var(--gl)'],
           ['Warning', warning,        'var(--amber)',   'var(--al)'],
           ['Offline', offline,        'var(--rose)',    'var(--rl)'],
           ['Total',   EQUIPMENT.length,'var(--primary)', 'var(--pl)']] as [string,number,string,string][]).map(([l, n, c, bg]) => (
          <div key={l} className="lt-card" style={{ padding:'14px 16px', background:bg }}>
            <div style={{ fontSize:24, fontWeight:800, color:c }}>{n}</div>
            <div style={{ fontSize:12, color:c, marginTop:2, fontWeight:500 }}>{l}</div>
          </div>
        ))}
      </div>

      <div className="lt-eq-grid">
        {EQUIPMENT.map(e => (
          <div key={e.id} className="lt-card lt-eq-card" style={{ borderLeftColor: eqBorderColor(e.status) }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>{e.name}</div>
                <div style={{ fontSize:12.5, color:'var(--muted)' }}>{e.model} · {e.id}</div>
              </div>
              <Chip label={e.status} color={statusColor(e.status)} />
            </div>
            <div className="lt-eq-meta-grid">
              {([['Current Load', e.load],['Uptime', e.uptime],['Last Calibrated', e.lastCalib],['Next Due', e.nextCalib]] as [string,string][]).map(([k, v]) => (
                <div key={k} className="lt-eq-meta-box">
                  <div style={{ fontSize:10.5, color:'var(--muted)', marginBottom:2 }}>{k}</div>
                  <div style={{ fontSize:13, fontWeight:700, color: k === 'Current Load' && parseInt(e.load) > 80 ? 'var(--amber)' : 'var(--text)' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {e.tests.map(t => <Chip key={t} label={t} color="gray" />)}
            </div>
            {e.status !== 'Online' && (
              <div style={{ marginTop:10, padding:'8px 12px', background: e.status === 'Warning' ? 'var(--al)' : 'var(--rl)', borderRadius:9, fontSize:12.5, color: e.status === 'Warning' ? 'var(--amber)' : 'var(--rose)', fontWeight:600 }}>
                {e.status === 'Warning' ? '⚠ High load — schedule maintenance' : '🔴 Offline — contact biomedical engineering'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Screen: Reports ──────────────────────────────────────────────────────────

const MONTHS   = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
const VOL_DATA = [320, 380, 350, 290, 420, 460, 430];
const MAX_VOL  = Math.max(...VOL_DATA);

const ReportsScreen: React.FC = () => (
  <div className="lt-scroll lt-fade" style={{ padding:20 }}>
    <div className="lt-reports-top">
      <div className="lt-card">
        <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Monthly Test Volume</div>
        <div className="lt-bar-chart">
          {VOL_DATA.map((v, i) => (
            <div key={i} className="lt-bar-col">
              {i === 6 && <div style={{ fontSize:10, color:'var(--primary)', fontWeight:700 }}>{v}</div>}
              <div className="lt-bar-block" style={{ height:`${(v / MAX_VOL) * 90}px`, background:'var(--primary)', opacity: i === 6 ? 1 : 0.3 }} />
              <span style={{ fontSize:10.5, color:'var(--muted)' }}>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="lt-card">
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Test Type Distribution</div>
        {([['Blood Tests','58%','var(--primary)',58],['Imaging','22%','var(--purple)',22],['Pulmonary','12%','var(--teal)',12],['Cardiac','8%','var(--rose)',8]] as [string,string,string,number][]).map(([t, p, c, w]) => (
          <div key={t} style={{ marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontSize:13, fontWeight:500 }}>{t}</span>
              <span style={{ fontSize:12.5, color:'var(--muted)' }}>{p}</span>
            </div>
            <div style={{ background:'var(--bg)', borderRadius:4, height:7, overflow:'hidden' }}>
              <div style={{ width:`${w}%`, height:'100%', background:c, borderRadius:4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="lt-reports-bot">
      <div className="lt-card">
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Turnaround Times</div>
        {([['CBC Panel','45 min','Target: 60 min','✓ On Track','var(--green)'],
           ['Metabolic Panel','52 min','Target: 60 min','✓ On Track','var(--green)'],
           ['Troponin (STAT)','18 min','Target: 30 min','↑ Excellent','var(--primary)'],
           ['HbA1c','2.1 hrs','Target: 4 hrs','✓ On Track','var(--green)'],
           ['MRI Brain','4.5 hrs','Target: 6 hrs','✓ On Track','var(--green)']] as [string,string,string,string,string][]).map(([test, time, target, status, c]) => (
          <div key={test} className="lt-kpi-row">
            <div>
              <div style={{ fontSize:13, fontWeight:500 }}>{test}</div>
              <div style={{ fontSize:11.5, color:'var(--muted)' }}>{target}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:15, fontWeight:800 }}>{time}</div>
              <div style={{ fontSize:11.5, color:c }}>{status}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="lt-card">
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Quality Metrics — April</div>
        {([['Sample Rejection Rate','0.8%','< 2%','var(--green)'],
           ['Critical Value Reporting','100%','> 98%','var(--green)'],
           ['Result Accuracy','99.3%','> 99%','var(--green)'],
           ['STAT Compliance','94%','> 90%','var(--green)'],
           ['Equipment Uptime','96.8%','> 95%','var(--green)']] as [string,string,string,string][]).map(([metric, val, target, c]) => (
          <div key={metric} className="lt-kpi-row">
            <div>
              <div style={{ fontSize:13, fontWeight:500 }}>{metric}</div>
              <div style={{ fontSize:11.5, color:'var(--muted)' }}>Target: {target}</div>
            </div>
            <div style={{ fontSize:17, fontWeight:800, color:c }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC<{
  active: ScreenId; onNav: (s: ScreenId) => void;
  mobileOpen: boolean; techName: string; onSignOut?: () => void;
}> = ({ active, onNav, mobileOpen, techName, onSignOut }) => {
  const abb = initials(techName);
  return (
    <aside className={`lt-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="lt-logo-row">
        <div className="lt-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
          </svg>
        </div>
        <div>
          <div style={{ color:'white', fontWeight:800, fontSize:15 }}>Vexoo</div>
          <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10.5 }}>Lab Portal</div>
        </div>
      </div>

      <div className="lt-sidebar-stats">
        {([['STAT','1','var(--rose)'],['Pending','2','var(--amber)']] as [string,string,string][]).map(([l, v, c]) => (
          <div key={l} className="lt-stat-pill">
            <div style={{ fontSize:20, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.45)', marginTop:1 }}>{l}</div>
          </div>
        ))}
      </div>

      <nav className="lt-nav">
        {NAV.map(item => {
          const on = active === item.id;
          return (
            <button key={item.id} className={`lt-nav-btn ${on ? 'active' : 'inactive'}`} onClick={() => onNav(item.id)}>
              <SvgIcon path={item.path} size={17} color="currentColor" />
              <span style={{ flex:1, textAlign:'left' }}>{item.label}</span>
              {item.badge && <span className="lt-nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="lt-sidebar-footer">
        <button className="lt-logout-btn" onClick={onSignOut}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
        <div className="lt-user-row">
          <div className="lt-user-avatar">{abb}</div>
          <div>
            <div style={{ color:'white', fontSize:12.5, fontWeight:600 }}>{techName}</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>Senior Lab Technician</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────

export default function LabTechScreen({ techName = 'Kevin Liu', onSignOut }: LabTechScreenProps) {
  const [screen, setScreen]     = useState<ScreenId>('orders');
  const [mobileOpen, setMobile] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobile(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNav = useCallback((s: ScreenId) => { setScreen(s); setMobile(false); }, []);

  const today = new Date().toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' });

  const screenEl = useMemo(() => {
    switch (screen) {
      case 'orders':    return <OrdersScreen />;
      case 'samples':   return <SamplesScreen />;
      case 'results':   return <ResultsScreen />;
      case 'review':    return <ReviewScreen />;
      case 'equipment': return <EquipmentScreen />;
      case 'reports':   return <ReportsScreen />;
    }
  }, [screen]);

  return (
    <div className="lt-root">
      <style>{CSS}</style>

      {mobileOpen && <div className="lt-overlay open" onClick={() => setMobile(false)} />}

      <Sidebar active={screen} onNav={handleNav} mobileOpen={mobileOpen}
        techName={techName} onSignOut={onSignOut} />

      <div className="lt-main">
        <div className="lt-header">
          <button className="lt-hamburger" onClick={() => setMobile(o => !o)} aria-label="Open menu" style={{ display:'none' }}>
            <SvgIcon path="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" size={22} color="var(--text)" />
          </button>
          <div className="lt-header-title">{SCREEN_TITLES[screen]}</div>
          <div className="lt-header-spacer" />
          <div className="lt-stat-alert">
            <div className="lt-stat-dot lt-pulse" />
            <span style={{ fontSize:12.5, fontWeight:600, color:'var(--rose)' }}>1 STAT Pending</span>
          </div>
          <div style={{ fontSize:12.5, color:'var(--muted)' }}>{today}</div>
        </div>

        {screenEl}
      </div>
    </div>
  );
}
