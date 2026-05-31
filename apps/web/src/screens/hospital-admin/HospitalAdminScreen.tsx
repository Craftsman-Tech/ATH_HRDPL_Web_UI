/**
 * ============================================================================
 *  HospitalAdminScreen.tsx — Hospital Admin Portal
 * ============================================================================
 *  The "Integrated Healthcare Platform" portal for a single hospital.
 *  This account is created by a SuperAdmin after approving the hospital.
 *
 *  Modules (9):
 *    Dashboard · Patients · Appointments · Medical Records (EMR)
 *    Pharmacy · Lab & Diagnostics · Inventory · Analytics · Notifications
 *
 *  Reference designs:
 *    apps/web/src/screens/hospital-admin/HospitalAdminScreen.tsx ← this file
 *    /mnt/project/Vexoo.html                    — shell + Dashboard
 *    /mnt/project/vexoo-screens.jsx             — all 8 module screens
 *
 *  Route:           /admin  (protected, requires role === 'Admin')
 *  Suggested path:  apps/web/src/screens/hospital-admin/HospitalAdminScreen.tsx
 *
 *  Props:
 *    adminName?  — injected from AuthContext (e.g. "Anita Reddy")
 *    onSignOut?  — called when Sign out is clicked
 *
 *  TODO (future phases):
 *    - Move all mock data into packages/shared/src/mock/
 *    - Replace in-line date strings with dayjs/date-fns
 *    - Add real API calls per module
 *    - Patient detail drill-down is scaffolded; wire to real EMR data
 * ============================================================================
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ModuleId =
  | 'dashboard' | 'patients' | 'appointments' | 'emr'
  | 'pharmacy'  | 'lab'      | 'inventory'    | 'analytics' | 'notifications';

type StatusColor = 'primary' | 'amber' | 'rose' | 'blue' | 'purple' | 'green' | 'gray';

interface NavItem { id: ModuleId; label: string; path: string; badge?: number; }

interface Patient {
  id: string; name: string; age: number; gender: 'M' | 'F';
  blood: string; condition: string; doctor: string;
  status: string; date: string; phone: string; email: string; lastVisit: string;
}
interface Prescription {
  id: string; patient: string; drug: string; qty: number;
  doctor: string; date: string; status: string; refills: number;
}
interface LabOrder {
  id: string; patient: string; test: string; ordered: string;
  date: string; status: string; priority: string; result: string;
}
interface InventoryItem {
  id: string; name: string; category: string; stock: number;
  min: number; unit: string; expiry: string; status: string;
}
interface Notification {
  id: number; type: 'critical' | 'alert' | 'info' | 'success';
  title: string; body: string; time: string; read: boolean;
}
interface Appointment {
  id: string; patient: string; doctor: string; type: string;
  time: string; date: string; room: string; status: string;
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface HospitalAdminScreenProps {
  adminName?: string;
  onSignOut?: () => void;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.ha-root {
  --bg:           #faf9f7;
  --sidebar:      #1c2537;
  --sidebar-hover:#253048;
  --primary:      #0d9488;
  --primary-light:#e6faf8;
  --amber:        #d97706;
  --amber-light:  #fef3c7;
  --rose:         #e11d48;
  --rose-light:   #ffe4e6;
  --blue:         #3b82f6;
  --blue-light:   #dbeafe;
  --purple:       #7c3aed;
  --purple-light: #ede9fe;
  --green:        #16a34a;
  --green-light:  #dcfce7;
  --text:         #1c2537;
  --text-muted:   #64748b;
  --border:       #e8e4dc;
  --card:         #ffffff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--text);
  background: var(--bg);
  height: 100vh;
  overflow: hidden;
  display: flex;
}

/* ── Scrollbars ── */
.ha-root ::-webkit-scrollbar { width: 5px; height: 5px; }
.ha-root ::-webkit-scrollbar-track { background: transparent; }
.ha-root ::-webkit-scrollbar-thumb { background: #d1cec8; border-radius: 4px; }

/* ── Animations ── */
@keyframes ha-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.ha-fade { animation: ha-fade 0.22s ease both; }

/* ── Layout ── */
.ha-shell    { display:flex; height:100vh; overflow:hidden; width:100%; }
.ha-main     { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
.ha-content  { flex:1; overflow-y:auto; padding:24px; }

/* ── Sidebar ── */
.ha-sidebar {
  background: var(--sidebar);
  display: flex; flex-direction: column;
  height: 100vh; overflow-y: auto; overflow-x: hidden;
  transition: width 0.22s cubic-bezier(.4,0,.2,1);
  position: relative; z-index: 10; flex-shrink: 0;
}
.ha-sidebar.expanded { width: 236px; }
.ha-sidebar.collapsed { width: 68px; }

.ha-logo-row {
  display: flex; align-items: center; gap: 10px;
  padding: 18px 20px; margin-bottom: 4px; min-height: 64px;
}
.ha-sidebar.collapsed .ha-logo-row { padding: 18px 16px; }
.ha-logo-icon {
  width: 36px; height: 36px; background: var(--primary); border-radius: 10px;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
}
.ha-logo-text {
  color: white; font-weight: 800; font-size: 17px; letter-spacing: -0.5px; white-space: nowrap;
}
.ha-collapse-btn {
  margin-left: auto; background: rgba(255,255,255,0.08); border: none;
  border-radius: 7px; color: white; cursor: pointer; padding: 5px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ha-nav-section-label {
  padding: 0 20px 10px; font-size: 10.5px; font-weight: 600;
  color: rgba(255,255,255,0.3); letter-spacing: 1px; text-transform: uppercase;
}
.ha-nav { flex: 1; padding: 0 10px; }
.ha-nav-btn {
  display: flex; align-items: center; gap: 11px; width: 100%;
  border-radius: 11px; border: none; cursor: pointer; margin-bottom: 2px;
  font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif;
  transition: background 0.13s, color 0.13s; position: relative;
  background: transparent; color: rgba(255,255,255,0.55);
}
.ha-sidebar.expanded .ha-nav-btn  { padding: 10px 14px; justify-content: flex-start; }
.ha-sidebar.collapsed .ha-nav-btn { padding: 10px 16px; justify-content: center; }
.ha-nav-btn:hover   { background: rgba(255,255,255,0.07) !important; color: white !important; }
.ha-nav-btn.active  { background: var(--primary) !important; color: white !important; font-weight: 600; }
.ha-nav-badge {
  margin-left: auto; background: var(--rose); color: white;
  border-radius: 10px; font-size: 10px; font-weight: 700; padding: 2px 7px; line-height: 1.4;
}
.ha-nav-badge-dot {
  position: absolute; top: 6px; right: 6px;
  width: 8px; height: 8px; background: var(--rose); border-radius: 50%;
}
.ha-user-row {
  border-top: 1px solid rgba(255,255,255,0.07); padding: 12px 10px;
}
.ha-user-inner {
  display: flex; align-items: center; gap: 10px; border-radius: 10px; cursor: pointer;
}
.ha-sidebar.expanded  .ha-user-inner { padding: 8px 12px; }
.ha-sidebar.collapsed .ha-user-inner { padding: 8px 10px; }
.ha-avatar {
  width: 34px; height: 34px; border-radius: 50%; background: var(--primary);
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 12px;
}
.ha-user-name { color: white; font-size: 12.5px; font-weight: 600; white-space: nowrap; }
.ha-user-role { color: rgba(255,255,255,0.4); font-size: 11px; }

/* mobile nav overlay */
.ha-overlay {
  display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 9;
}
.ha-overlay.open { display: block; }
.ha-hamburger {
  display: none; background: none; border: none; cursor: pointer;
  padding: 4px; color: var(--text); align-items: center; justify-content: center;
}

/* ── Header ── */
.ha-header {
  display: flex; align-items: center; padding: 0 24px; height: 62px;
  background: var(--card); border-bottom: 1px solid var(--border);
  gap: 14px; flex-shrink: 0;
}
.ha-header-title    { font-weight: 700; font-size: 16.5px; }
.ha-header-date     { font-size: 11.5px; color: var(--text-muted); }
.ha-header-spacer   { flex: 1; }
.ha-search-box {
  display: flex; align-items: center; gap: 8px; background: var(--bg);
  border: 1px solid var(--border); border-radius: 10px; padding: 7px 14px; width: 240px;
}
.ha-search-box input {
  border: none; background: transparent; font-size: 13px; outline: none;
  color: var(--text); width: 100%; font-family: inherit;
}
.ha-icon-btn {
  background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
  padding: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  position: relative; transition: background 0.13s;
}
.ha-icon-btn:hover { background: var(--border); }
.ha-notif-dot {
  position: absolute; top: 7px; right: 7px;
  width: 7px; height: 7px; background: var(--rose);
  border-radius: 50%; border: 2px solid white;
}
.ha-help-btn {
  background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
  padding: 7px 14px; cursor: pointer; font-size: 13px; color: var(--text-muted);
  display: flex; align-items: center; gap: 6px; font-family: inherit;
  transition: background 0.13s;
}
.ha-help-btn:hover { background: var(--border); }
.ha-header-avatar {
  width: 36px; height: 36px; border-radius: 50%; background: var(--primary);
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 13px; cursor: pointer;
}

/* ── Shared UI components ── */
.ha-card {
  background: var(--card); border-radius: 16px; padding: 24px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05); border: 1px solid var(--border);
}
.ha-badge {
  font-size: 11px; font-weight: 600; padding: 3px 10px;
  border-radius: 20px; display: inline-block; white-space: nowrap;
}
.ha-badge.primary { background: var(--primary-light); color: var(--primary); }
.ha-badge.amber   { background: var(--amber-light);   color: var(--amber);   }
.ha-badge.rose    { background: var(--rose-light);     color: var(--rose);    }
.ha-badge.blue    { background: var(--blue-light);     color: var(--blue);    }
.ha-badge.purple  { background: var(--purple-light);   color: var(--purple);  }
.ha-badge.green   { background: var(--green-light);    color: var(--green);   }
.ha-badge.gray    { background: #f1f5f9;               color: var(--text-muted); }

.ha-section-head {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;
}
.ha-section-title { font-weight: 700; font-size: 17px; }
.ha-section-sub   { font-size: 12.5px; color: var(--text-muted); margin-top: 2px; }
.ha-action-btn {
  display: flex; align-items: center; gap: 6px; background: var(--primary);
  color: white; border: none; border-radius: 10px; padding: 9px 16px;
  font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
  transition: opacity 0.13s;
}
.ha-action-btn:hover { opacity: 0.88; }

/* ── Table ── */
.ha-table-wrap { overflow-x: auto; }
.ha-table { width: 100%; border-collapse: collapse; }
.ha-th {
  padding: 10px 20px; text-align: left; font-size: 11.5px; color: var(--text-muted);
  font-weight: 600; background: var(--bg); border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.ha-td { padding: 12px 20px; font-size: 13px; }
.ha-tr { transition: background 0.1s; cursor: pointer; }
.ha-tr:hover { background: var(--bg) !important; }

/* ── Search input ── */
.ha-search-input-wrap {
  flex: 1; display: flex; align-items: center; gap: 8px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 9px 16px;
}
.ha-search-input-wrap input {
  border: none; outline: none; background: transparent;
  font-size: 13.5px; font-family: inherit; width: 100%; color: var(--text);
}

/* ── Stat card ── */
.ha-stat-card {
  background: var(--card); border-radius: 16px; padding: 20px 22px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05); border: 1px solid var(--border);
}
.ha-stat-label  { font-size: 12px; color: var(--text-muted); font-weight: 500; margin-bottom: 7px; }
.ha-stat-value  { font-size: 28px; font-weight: 800; letter-spacing: -1px; margin-bottom: 5px; color: var(--text); }
.ha-stat-sub    { font-size: 12px; font-weight: 500; }
.ha-stat-icon   {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

/* ── Bar chart ── */
.ha-bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 100px; }
.ha-bar-col   { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; }
.ha-bar-val   { font-size: 10px; color: var(--text-muted); font-weight: 500; }
.ha-bar       { width: 100%; border-radius: 5px 5px 0 0; transition: height 0.4s ease; }
.ha-bar-label { font-size: 10.5px; color: var(--text-muted); }

/* ── EMR patient list ── */
.ha-emr-pt {
  padding: 12px 16px; border-radius: 12px; cursor: pointer;
  border: 1px solid var(--border); transition: all 0.15s;
  background: var(--card);
}
.ha-emr-pt.active { background: var(--primary-light); border-color: var(--primary); border-width: 1.5px; }
.ha-emr-pt-avatar {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px;
}

/* ── Notification items ── */
.ha-notif-item {
  padding: 16px 20px; border: 1px solid var(--border);
  border-radius: 14px; cursor: pointer; transition: all 0.15s;
  display: flex; gap: 14px; align-items: flex-start;
}
.ha-notif-item.unread { background: #fffef5; }
.ha-notif-icon {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 16px;
}
.ha-notif-dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; flex-shrink: 0; margin-top: 4px; }

/* ── Toggle switch (Notifications settings) ── */
.ha-toggle {
  width: 36px; height: 20px; background: var(--primary);
  border-radius: 20px; cursor: pointer; position: relative; flex-shrink: 0;
}
.ha-toggle::after {
  content: ''; position: absolute; right: 2px; top: 2px;
  width: 16px; height: 16px; background: white; border-radius: 50%;
}

/* ── Responsive ── */
@media (max-width: 1080px) {
  .ha-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 20;
    width: 236px !important;
    transform: translateX(-100%);
    transition: transform 0.25s cubic-bezier(.4,0,.2,1);
  }
  .ha-sidebar.mobile-open { transform: translateX(0); }
  .ha-hamburger { display: flex !important; }
  .ha-search-box { width: 160px; }
  .ha-help-btn span { display: none; }
}
@media (max-width: 760px) {
  .ha-header { padding: 0 14px; gap: 8px; }
  .ha-search-box { display: none; }
  .ha-content { padding: 14px; }
  .ha-stat-grid-4 { grid-template-columns: repeat(2,1fr) !important; }
  .ha-stat-grid-3 { grid-template-columns: repeat(2,1fr) !important; }
  .ha-grid-2-1   { grid-template-columns: 1fr !important; }
  .ha-grid-1-2   { grid-template-columns: 1fr !important; }
  .ha-grid-4col  { grid-template-columns: 1fr !important; }
  .ha-emr-layout { grid-template-columns: 1fr !important; }
}
`;

// ─── Mock data (TODO: move to packages/shared/src/mock/) ─────────────────────

const PATIENTS: Patient[] = [
  { id:'P-001', name:'Sarah Johnson',   age:34, gender:'F', blood:'A+',  condition:'Hypertension',       doctor:'Dr. Chen',  status:'Stable',     date:'Apr 26', phone:'+1 555-0101', email:'sarah.j@email.com',  lastVisit:'Apr 20' },
  { id:'P-002', name:'Marcus Williams', age:52, gender:'M', blood:'O+',  condition:'Type 2 Diabetes',    doctor:'Dr. Patel', status:'Monitoring', date:'Apr 26', phone:'+1 555-0102', email:'marcus.w@email.com', lastVisit:'Apr 18' },
  { id:'P-003', name:'Elena Rodriguez', age:28, gender:'F', blood:'B-',  condition:'Asthma',             doctor:'Dr. Kim',   status:'Stable',     date:'Apr 25', phone:'+1 555-0103', email:'elena.r@email.com',  lastVisit:'Apr 22' },
  { id:'P-004', name:"James O'Brien",   age:67, gender:'M', blood:'AB+', condition:'Cardiac Arrhythmia', doctor:'Dr. Chen',  status:'Critical',   date:'Apr 25', phone:'+1 555-0104', email:'james.o@email.com',  lastVisit:'Apr 24' },
  { id:'P-005', name:'Priya Sharma',    age:41, gender:'F', blood:'A-',  condition:'Migraine',           doctor:'Dr. Patel', status:'Stable',     date:'Apr 25', phone:'+1 555-0105', email:'priya.s@email.com',  lastVisit:'Apr 19' },
  { id:'P-006', name:'Thomas Klein',    age:59, gender:'M', blood:'O-',  condition:'COPD',               doctor:'Dr. Kim',   status:'Monitoring', date:'Apr 24', phone:'+1 555-0106', email:'thomas.k@email.com', lastVisit:'Apr 15' },
  { id:'P-007', name:'Aisha Okonkwo',   age:31, gender:'F', blood:'B+',  condition:'Anxiety Disorder',   doctor:'Dr. Patel', status:'Stable',     date:'Apr 23', phone:'+1 555-0107', email:'aisha.o@email.com',  lastVisit:'Apr 10' },
  { id:'P-008', name:'David Nguyen',    age:44, gender:'M', blood:'A+',  condition:'Hypertension',       doctor:'Dr. Chen',  status:'Stable',     date:'Apr 22', phone:'+1 555-0108', email:'david.n@email.com',  lastVisit:'Apr 14' },
];

const PRESCRIPTIONS: Prescription[] = [
  { id:'RX-4821', patient:'Sarah Johnson',   drug:'Lisinopril 10mg',    qty:30, doctor:'Dr. Chen',  date:'Apr 26', status:'Pending',   refills:2 },
  { id:'RX-4822', patient:'Marcus Williams', drug:'Metformin 500mg',    qty:60, doctor:'Dr. Patel', date:'Apr 26', status:'Ready',     refills:3 },
  { id:'RX-4823', patient:"James O'Brien",   drug:'Amiodarone 200mg',   qty:30, doctor:'Dr. Chen',  date:'Apr 26', status:'Dispensed', refills:0 },
  { id:'RX-4824', patient:'Elena Rodriguez', drug:'Salbutamol Inhaler', qty:1,  doctor:'Dr. Kim',   date:'Apr 25', status:'Pending',   refills:1 },
  { id:'RX-4825', patient:'Priya Sharma',    drug:'Sumatriptan 50mg',   qty:9,  doctor:'Dr. Patel', date:'Apr 25', status:'Ready',     refills:2 },
  { id:'RX-4826', patient:'Thomas Klein',    drug:'Tiotropium 18mcg',   qty:30, doctor:'Dr. Kim',   date:'Apr 24', status:'Dispensed', refills:1 },
];

const LAB_ORDERS: LabOrder[] = [
  { id:'L-0091', patient:'Marcus Williams', test:'HbA1c Panel',          ordered:'Dr. Patel', date:'Apr 26', status:'In Progress', priority:'Routine', result:'' },
  { id:'L-0092', patient:"James O'Brien",   test:'ECG + Troponin',       ordered:'Dr. Chen',  date:'Apr 26', status:'Critical',    priority:'STAT',    result:'Troponin elevated' },
  { id:'L-0093', patient:'Sarah Johnson',   test:'CBC + Metabolic Panel',ordered:'Dr. Chen',  date:'Apr 25', status:'Complete',    priority:'Routine', result:'Within normal range' },
  { id:'L-0094', patient:'Elena Rodriguez', test:'Spirometry',           ordered:'Dr. Kim',   date:'Apr 25', status:'Complete',    priority:'Routine', result:'FEV1 68% — mild obstruction' },
  { id:'L-0095', patient:'Priya Sharma',    test:'MRI Brain',            ordered:'Dr. Patel', date:'Apr 24', status:'Pending',     priority:'Urgent',  result:'' },
  { id:'L-0096', patient:'Thomas Klein',    test:'Pulmonary Function Test',ordered:'Dr. Kim', date:'Apr 23', status:'Complete',    priority:'Routine', result:'Moderate COPD confirmed' },
];

const INVENTORY: InventoryItem[] = [
  { id:'INV-001', name:'Lisinopril 10mg',    category:'Cardiovascular', stock:1240, min:200,  unit:'tabs',  expiry:'Dec 2026', status:'OK'       },
  { id:'INV-002', name:'Metformin 500mg',    category:'Diabetes',       stock:180,  min:200,  unit:'tabs',  expiry:'Nov 2026', status:'Low'      },
  { id:'INV-003', name:'Amiodarone 200mg',   category:'Cardiac',        stock:95,   min:100,  unit:'tabs',  expiry:'Sep 2026', status:'Low'      },
  { id:'INV-004', name:'Salbutamol Inhaler', category:'Respiratory',    stock:48,   min:20,   unit:'units', expiry:'Mar 2027', status:'OK'       },
  { id:'INV-005', name:'Surgical Gloves L',  category:'Supplies',       stock:12,   min:50,   unit:'boxes', expiry:'—',        status:'Critical' },
  { id:'INV-006', name:'IV Saline 0.9%',     category:'Fluids',         stock:340,  min:100,  unit:'bags',  expiry:'Jan 2027', status:'OK'       },
  { id:'INV-007', name:'Syringes 5ml',       category:'Supplies',       stock:22,   min:100,  unit:'boxes', expiry:'—',        status:'Critical' },
  { id:'INV-008', name:'Paracetamol 500mg',  category:'Analgesics',     stock:2800, min:500,  unit:'tabs',  expiry:'Aug 2027', status:'OK'       },
];

const NOTIFICATIONS_DATA: Notification[] = [
  { id:1, type:'critical', title:"Critical Lab Result — James O'Brien",  body:'Troponin levels elevated. Immediate cardiology review required.',            time:'2 min ago',  read:false },
  { id:2, type:'alert',    title:'Low Inventory: Surgical Gloves',        body:'Stock at 12 boxes, below minimum threshold of 50. Reorder required.',        time:'18 min ago', read:false },
  { id:3, type:'alert',    title:'Low Inventory: Syringes 5ml',           body:'Only 22 boxes remaining. Critical shortage expected within 48 hours.',       time:'25 min ago', read:false },
  { id:4, type:'info',     title:'Appointment Reminder',                  body:'Dr. Patel has 6 appointments starting at 10:30 AM today.',                   time:'1 hr ago',   read:false },
  { id:5, type:'info',     title:'New Patient Registration',              body:'Thomas Klein has been registered and assigned to Dr. Kim.',                  time:'2 hrs ago',  read:false },
  { id:6, type:'success',  title:'Prescription Dispensed',                body:'RX-4823 — Amiodarone 200mg dispensed to James O\'Brien.',                   time:'3 hrs ago',  read:true  },
  { id:7, type:'info',     title:'Lab Results Ready',                     body:'CBC + Metabolic Panel for Sarah Johnson are ready for review.',              time:'4 hrs ago',  read:true  },
  { id:8, type:'success',  title:'Payment Processed',                     body:'Invoice #INV-2408 — $1,240 received from Marcus Williams.',                  time:'5 hrs ago',  read:true  },
];

const APPOINTMENTS: Appointment[] = [
  { id:'A-001', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', date:'Apr 26', room:'Room 104', status:'Confirmed'   },
  { id:'A-002', patient:'New Patient',     doctor:'Dr. Patel', type:'Consultation',time:'10:30 AM', date:'Apr 26', room:'Room 201', status:'Waiting'     },
  { id:'A-003', patient:"James O'Brien",   doctor:'Dr. Chen',  type:'Urgent',      time:'11:00 AM', date:'Apr 26', room:'Room 104', status:'In Progress' },
  { id:'A-004', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Check-up',    time:'01:00 PM', date:'Apr 26', room:'Room 302', status:'Confirmed'   },
  { id:'A-005', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'02:30 PM', date:'Apr 26', room:'Room 201', status:'Confirmed'   },
  { id:'A-006', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Lab Review',  time:'04:00 PM', date:'Apr 26', room:'Room 201', status:'Pending'     },
  { id:'A-007', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Consultation',time:'04:45 PM', date:'Apr 26', room:'Room 201', status:'Pending'     },
];

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV: NavItem[] = [
  { id:'dashboard',     label:'Dashboard',        path:'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { id:'patients',      label:'Patients',         path:'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
  { id:'appointments',  label:'Appointments',     path:'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' },
  { id:'emr',           label:'Medical Records',  path:'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
  { id:'pharmacy',      label:'Pharmacy',         path:'M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
  { id:'lab',           label:'Lab & Diagnostics',path:'M6 2v6l2 2-6 10h16L12 10l2-2V2H6zm6 9.5L14.73 16H9.27L12 11.5zM10 4h4v3.17l1.17 1.17L12 12.5 8.83 8.34 10 7.17V4z' },
  { id:'inventory',     label:'Inventory',        path:'M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.58 1 13.5 3.08L12 4.58l-1.5-1.51C8.42 1 6 2.53 6 4.64c0 .48.11.92.18 1.36H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z' },
  { id:'analytics',     label:'Analytics',        path:'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z' },
  { id:'notifications', label:'Notifications',    path:'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z', badge: 5 },
];

const MODULE_TITLES: Record<ModuleId, string> = {
  dashboard:'Dashboard', patients:'Patients', appointments:'Appointments',
  emr:'Medical Records', pharmacy:'Pharmacy', lab:'Lab & Diagnostics',
  inventory:'Inventory', analytics:'Analytics', notifications:'Notifications',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) { return name.split(' ').map(n => n[0]).join(''); }

function statusColor(s: string): StatusColor {
  if (s === 'Critical' || s === 'STAT')                                 return 'rose';
  if (s === 'Monitoring' || s === 'Waiting' || s === 'Low' || s === 'Urgent') return 'amber';
  if (s === 'In Progress' || s === 'Dispensed' || s === 'Complete')     return 'blue';
  if (s === 'Pending')                                                   return 'purple';
  if (s === 'Ready' || s === 'Stable' || s === 'OK')                    return 'primary';
  return 'gray';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const Badge: React.FC<{ label: string; color?: StatusColor }> = ({ label, color = 'primary' }) => (
  <span className={`ha-badge ${color}`}>{label}</span>
);

const SvgIcon: React.FC<{ path: string; size?: number; color?: string }> = ({ path, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d={path} />
  </svg>
);

const StatCard: React.FC<{ label: string; value: string; sub: string; color: string; iconPath: string }> =
  ({ label, value, sub, color, iconPath }) => (
    <div className="ha-stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="ha-stat-label">{label}</div>
          <div className="ha-stat-value">{value}</div>
          <div className="ha-stat-sub" style={{ color }}>{sub}</div>
        </div>
        <div className="ha-stat-icon" style={{ background: `${color}18` }}>
          <SvgIcon path={iconPath} size={22} color={color} />
        </div>
      </div>
    </div>
  );

const BarChart: React.FC<{ data: number[]; labels: string[]; color?: string; todayIndex?: number }> =
  ({ data, labels, color = 'var(--primary)', todayIndex = 6 }) => {
    const max = Math.max(...data);
    return (
      <div className="ha-bar-chart">
        {data.map((val, i) => (
          <div key={i} className="ha-bar-col">
            <div className="ha-bar-val" style={{ visibility: i === todayIndex ? 'visible' : 'hidden' }}>{val}</div>
            <div className="ha-bar" style={{
              height: `${(val / max) * 74}px`, background: color,
              opacity: i === todayIndex ? 1 : 0.3,
              boxShadow: i === todayIndex ? `0 4px 12px ${color}40` : 'none',
            }} />
            <span className="ha-bar-label">{labels[i]}</span>
          </div>
        ))}
      </div>
    );
  };

const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="ha-th">{children}</th>
);
const Td: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <td className="ha-td" style={style}>{children}</td>
);

// ─── Module: Dashboard ────────────────────────────────────────────────────────

const weeklyAppts = [28, 35, 31, 42, 38, 45, 34];
const weekDays    = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const mockPatientsDash = PATIENTS.slice(0, 5);
const mockApptsDash = [
  { patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', status:'Confirmed'   },
  { patient:'New Patient',     doctor:'Dr. Patel', type:'Consultation',time:'10:30 AM', status:'Waiting'     },
  { patient:"James O'Brien",   doctor:'Dr. Chen',  type:'Urgent',      time:'11:00 AM', status:'In Progress' },
  { patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Check-up',    time:'01:00 PM', status:'Confirmed'   },
  { patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'02:30 PM', status:'Confirmed'   },
];

const Dashboard: React.FC<{ setModule: (m: ModuleId) => void }> = ({ setModule }) => (
  <div className="ha-content ha-fade">
    {/* KPIs */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }} className="ha-stat-grid-4">
      <StatCard label="Total Patients"         value="1,248" sub="↑ 12 new today"     color="#0d9488" iconPath="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      <StatCard label="Today's Appointments"   value="34"    sub="6 remaining"        color="#3b82f6" iconPath="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
      <StatCard label="Today's Revenue"        value="₹8,240" sub="↑ 8% vs yesterday" color="#d97706" iconPath="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
      <StatCard label="Pending Alerts"         value="12"    sub="3 critical"         color="#e11d48" iconPath="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </div>

    {/* Mid row */}
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 18 }} className="ha-grid-2-1">
      {/* Weekly appointments chart */}
      <div className="ha-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Weekly Appointments</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Apr 20 – Apr 26, 2026</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="ha-badge primary">253 This Week</span>
            <span className="ha-badge green">↑ 9.1%</span>
          </div>
        </div>
        <BarChart data={weeklyAppts} labels={weekDays} />
      </div>

      {/* Department load */}
      <div className="ha-card">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Department Load</div>
        {([['Cardiology', 12, '#e11d48', 80], ['General Practice', 9, '#0d9488', 60],
           ['Pediatrics', 7, '#3b82f6', 47], ['Orthopedics', 6, '#d97706', 40],
           ['Pulmonology', 4, '#7c3aed', 27]] as [string, number, string, number][]).map(([dept, count, color, pct]) => (
          <div key={dept} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 12.5, fontWeight: 500 }}>{dept}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{count} pts</span>
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom row */}
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }} className="ha-grid-2-1">
      {/* Recent patients table */}
      <div className="ha-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px 12px' }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Patients</div>
          <button onClick={() => setModule('patients')} style={{ fontSize: 12.5, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
        </div>
        <div className="ha-table-wrap">
          <table className="ha-table">
            <thead><tr>{['Patient', 'Condition', 'Doctor', 'Status'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {mockPatientsDash.map((p, i) => (
                <tr key={p.id} className="ha-tr" style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: 'var(--primary)', flexShrink: 0 }}>
                        {initials(p.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.id} · {p.age}y</div>
                      </div>
                    </div>
                  </Td>
                  <Td style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>{p.condition}</Td>
                  <Td style={{ fontSize: 12.5 }}>{p.doctor}</Td>
                  <Td><Badge label={p.status} color={statusColor(p.status)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's schedule */}
      <div className="ha-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Today's Schedule</div>
          <button onClick={() => setModule('appointments')} style={{ fontSize: 12.5, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
        </div>
        {mockApptsDash.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 4 ? 12 : 0, paddingBottom: i < 4 ? 12 : 0, borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 46, background: 'var(--primary-light)', borderRadius: 10, padding: '6px 4px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', lineHeight: 1.3 }}>
                {a.time.split(' ')[0]}<br />
                <span style={{ fontWeight: 400, fontSize: 9 }}>{a.time.split(' ')[1]}</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.patient}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{a.doctor} · {a.type}</div>
            </div>
            <Badge label={a.status} color={statusColor(a.status)} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Module: Patients ─────────────────────────────────────────────────────────

const PatientsModule: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Patient | null>(null);

  const filtered = useMemo(() =>
    PATIENTS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  if (selected) {
    const p = selected;
    return (
      <div className="ha-content ha-fade">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => setSelected(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>← Back</button>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Patients / <strong>{p.name}</strong></span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }} className="ha-grid-1-2">
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="ha-card">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: 'var(--primary)' }}>
                  {initials(p.name)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{p.id}</div>
                </div>
                <Badge label={p.status} color={statusColor(p.status)} />
              </div>
              <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {([['Age', `${p.age} years`], ['Gender', p.gender === 'F' ? 'Female' : 'Male'],
                   ['Blood Type', p.blood], ['Phone', p.phone], ['Email', p.email],
                   ['Last Visit', p.lastVisit]] as [string, string][]).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ha-card">
              <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Assigned Doctor</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--blue)', fontSize: 13 }}>
                  {p.doctor.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.doctor}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Attending Physician</div>
                </div>
              </div>
            </div>
          </div>
          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="ha-card">
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Medical Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }} className="ha-stat-grid-3">
                {([['Primary Condition', p.condition, 'var(--primary-light)', 'var(--primary)'],
                   ['Blood Pressure', '128/82 mmHg', 'var(--blue-light)', 'var(--blue)'],
                   ['Heart Rate', '74 bpm', 'var(--green-light)', 'var(--green)']] as [string, string, string, string][]).map(([l, v, bg, c]) => (
                  <div key={l} style={{ background: bg, borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: c, fontWeight: 600, marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Patient presents with well-managed {p.condition.toLowerCase()}. Recent lab results show stable trends. Medication compliance reported as good. Follow-up scheduled per routine protocol.
              </div>
            </div>
            <div className="ha-card">
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Visit History</div>
              {['Apr 20, 2026 — Routine Follow-up · Dr. Chen', 'Mar 15, 2026 — Lab Review · Dr. Chen',
                'Feb 8, 2026 — Annual Physical · Dr. Chen', 'Jan 5, 2026 — Medication Adjustment · Dr. Chen'].map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < 3 ? 12 : 0, paddingBottom: i < 3 ? 12 : 0, borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#374151' }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="ha-card">
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Active Medications</div>
              {([['Lisinopril 10mg', 'Once daily, morning', 'Ongoing'],
                 ['Hydrochlorothiazide 12.5mg', 'Once daily', 'Ongoing'],
                 ['Aspirin 81mg', 'Once daily', 'Ongoing']] as [string, string, string][]).map(([name, schedule, status]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg)', borderRadius: 10, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{schedule}</div>
                  </div>
                  <Badge label={status} color="primary" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Patients</div>
          <div className="ha-section-sub">{PATIENTS.length} registered patients</div>
        </div>
        <button className="ha-action-btn">
          <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
          New Patient
        </button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="ha-search-input-wrap">
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" size={15} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, or condition..." />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-muted)' }}>
          <SvgIcon path="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" size={14} color="currentColor" />
          Filter
        </button>
      </div>
      <div className="ha-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="ha-table-wrap">
          <table className="ha-table">
            <thead><tr>{['Patient', 'ID', 'Age', 'Blood', 'Condition', 'Doctor', 'Last Visit', 'Status', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className="ha-tr" style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }} onClick={() => setSelected(p)}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: 'var(--primary)', flexShrink: 0 }}>{initials(p.name)}</div>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </Td>
                  <Td style={{ color: 'var(--text-muted)' }}>{p.id}</Td>
                  <Td>{p.age}y · {p.gender}</Td>
                  <Td><Badge label={p.blood} color="gray" /></Td>
                  <Td style={{ color: 'var(--text-muted)' }}>{p.condition}</Td>
                  <Td>{p.doctor}</Td>
                  <Td style={{ color: 'var(--text-muted)' }}>{p.lastVisit}</Td>
                  <Td><Badge label={p.status} color={statusColor(p.status)} /></Td>
                  <Td><SvgIcon path="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" size={16} color="var(--text-muted)" /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Module: Appointments ────────────────────────────────────────────────────

const AppointmentsModule: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = [20, 21, 22, 23, 24, 25, 26];
  const counts = [5, 8, 6, 9, 7, 4, 34];
  const [activeDay, setActiveDay] = useState(6);

  return (
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Appointments</div>
          <div className="ha-section-sub">April 26, 2026</div>
        </div>
        <button className="ha-action-btn">
          <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
          New Appointment
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }} className="ha-grid-2-1">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Week strip */}
          <div className="ha-card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {days.map((d, i) => (
                <div key={d} onClick={() => setActiveDay(i)} style={{ flex: 1, textAlign: 'center', padding: '10px 6px', borderRadius: 12, background: activeDay === i ? 'var(--primary)' : 'transparent', cursor: 'pointer', transition: 'background 0.15s' }}>
                  <div style={{ fontSize: 11, color: activeDay === i ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>{d}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: activeDay === i ? 'white' : 'var(--text)' }}>Apr {dates[i]}</div>
                  <div style={{ marginTop: 6, fontSize: 10.5, color: activeDay === i ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>{counts[i]} appts</div>
                </div>
              ))}
            </div>
          </div>
          {/* Appointments list */}
          <div className="ha-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px 12px', fontWeight: 700, fontSize: 15, borderBottom: '1px solid var(--border)' }}>
              Today — April 26 <span style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>{APPOINTMENTS.length} appointments</span>
            </div>
            {APPOINTMENTS.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < APPOINTMENTS.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ width: 52, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{a.time.split(' ')[0]}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{a.time.split(' ')[1]}</div>
                </div>
                <div style={{ width: 1, height: 36, background: 'var(--border)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.patient}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.doctor} · {a.type} · {a.room}</div>
                </div>
                <Badge label={a.status} color={statusColor(a.status)} />
                <button style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>Check In</button>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="ha-card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Today's Summary</div>
            {([['Total', '34', 'var(--primary-light)', 'var(--primary)'], ['Confirmed', '18', 'var(--blue-light)', 'var(--blue)'],
               ['In Progress', '6', 'var(--amber-light)', 'var(--amber)'], ['Pending', '8', 'var(--purple-light)', 'var(--purple)'],
               ['Completed', '2', 'var(--green-light)', 'var(--green)']] as [string, string, string, string][]).map(([l, v, bg, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: bg, borderRadius: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: c, fontWeight: 500 }}>{l}</span>
                <span style={{ fontWeight: 700, fontSize: 17, color: c }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="ha-card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Doctors On Duty</div>
            {([['Dr. Chen', 'Cardiology', 12], ['Dr. Patel', 'General', 14], ['Dr. Kim', 'Pulmonology', 8]] as [string, string, number][]).map(([d, dept, n]) => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--blue)', fontSize: 12 }}>
                  {d.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{d}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{dept}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n} pts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Module: EMR ──────────────────────────────────────────────────────────────

type EMRTab = 'overview' | 'vitals' | 'medications' | 'history' | 'notes';

const EMRModule: React.FC = () => {
  const [tab, setTab] = useState<EMRTab>('overview');
  const p = PATIENTS[0];
  const tabs: EMRTab[] = ['overview', 'vitals', 'medications', 'history', 'notes'];

  return (
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Electronic Medical Records</div>
          <div className="ha-section-sub">Viewing: {p.name} · {p.id}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }} className="ha-emr-layout">
        {/* Patient list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PATIENTS.map(pt => (
            <div key={pt.id} className={`ha-emr-pt ${pt.id === p.id ? 'active' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="ha-emr-pt-avatar" style={{ background: pt.id === p.id ? 'var(--primary)' : '#f1f5f9', color: pt.id === p.id ? 'white' : 'var(--text-muted)' }}>
                  {initials(pt.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pt.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{pt.id} · {pt.age}y</div>
                </div>
                <Badge label={pt.status} color={statusColor(pt.status)} />
              </div>
            </div>
          ))}
        </div>

        {/* Record pane */}
        <div className="ha-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg,#1c2537,#253048)', padding: '20px 24px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                {initials(p.name)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{p.name}</div>
                <div style={{ fontSize: 13, opacity: 0.75 }}>{p.id} · {p.gender === 'F' ? 'Female' : 'Male'} · {p.age} years · Blood: {p.blood}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}><Badge label={p.status} color={statusColor(p.status)} /></div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', background: tab === t ? 'rgba(255,255,255,0.2)' : 'transparent', color: 'white', fontSize: 12.5, fontWeight: tab === t ? 600 : 400, fontFamily: 'inherit', textTransform: 'capitalize' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: 24 }}>
            {tab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="ha-grid-2-1">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Primary Diagnosis</div>
                  <div style={{ padding: '12px 16px', background: 'var(--primary-light)', borderRadius: 12, borderLeft: '3px solid var(--primary)', marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--primary)' }}>{p.condition}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--primary)', marginTop: 4, opacity: 0.8 }}>Diagnosed Jan 2024 · Ongoing management</div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent Vitals</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {([['BP', '128/82', 'var(--primary)'], ['HR', '74 bpm', 'var(--blue)'], ['Temp', '98.4°F', 'var(--green)'], ['O₂', '98%', 'var(--blue)']] as [string, string, string][]).map(([l, v, c]) => (
                      <div key={l} style={{ padding: '10px 12px', background: 'var(--bg)', borderRadius: 10 }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l}</div>
                        <div style={{ fontWeight: 700, color: c }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Allergies & Alerts</div>
                  {([['Penicillin', 'Severe — Anaphylaxis', 'var(--rose-light)', 'var(--rose)'],
                     ['Sulfonamides', 'Moderate — Rash', 'var(--amber-light)', 'var(--amber)']] as [string, string, string, string][]).map(([a, r, bg, c]) => (
                    <div key={a} style={{ padding: '10px 14px', background: bg, borderRadius: 10, borderLeft: `3px solid ${c}`, marginBottom: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: c }}>{a}</div>
                      <div style={{ fontSize: 12, color: c, opacity: 0.8 }}>{r}</div>
                    </div>
                  ))}
                  <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 12, marginTop: 16, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Next Appointment</div>
                  <div style={{ padding: '12px 14px', background: 'var(--primary-light)', borderRadius: 10 }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>May 15, 2026 — 10:00 AM</div>
                    <div style={{ fontSize: 12.5, color: 'var(--primary)', opacity: 0.8 }}>Routine Follow-up · Dr. Chen · Room 104</div>
                  </div>
                </div>
              </div>
            )}
            {tab === 'vitals' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }} className="ha-stat-grid-3">
                {([['Blood Pressure', '128/82', 'mmHg', 'var(--primary-light)', 'var(--primary)', 'Normal range'],
                   ['Heart Rate', '74', 'bpm', 'var(--blue-light)', 'var(--blue)', 'Normal'],
                   ['Temperature', '98.4', '°F', 'var(--green-light)', 'var(--green)', 'Normal'],
                   ['O₂ Saturation', '98', '%', 'var(--blue-light)', 'var(--blue)', 'Normal'],
                   ['Weight', '68.2', 'kg', 'var(--bg)', 'var(--text-muted)', 'BMI: 24.1'],
                   ['Height', '167', 'cm', 'var(--bg)', 'var(--text-muted)', '']] as [string, string, string, string, string, string][]).map(([l, v, u, bg, c, note]) => (
                  <div key={l} style={{ padding: 16, background: bg, borderRadius: 14, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 6 }}>{l}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: c, letterSpacing: '-1px' }}>{v} <span style={{ fontSize: 13, fontWeight: 400 }}>{u}</span></div>
                    {note && <div style={{ fontSize: 11.5, color: c, marginTop: 4 }}>{note}</div>}
                  </div>
                ))}
              </div>
            )}
            {tab === 'medications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {([['Lisinopril 10mg', 'Antihypertensive', '1 tab daily, morning', 'Ongoing', 'Dr. Chen', 'Jan 2024'],
                   ['Hydrochlorothiazide 12.5mg', 'Diuretic', '1 tab daily', 'Ongoing', 'Dr. Chen', 'Jan 2024'],
                   ['Aspirin 81mg', 'Antiplatelet', '1 tab daily', 'Ongoing', 'Dr. Chen', 'Mar 2024']] as [string, string, string, string, string, string][]).map(([name, cls, schedule, status, dr, since]) => (
                  <div key={name} style={{ padding: '14px 18px', background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 40, height: 40, background: 'var(--primary-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SvgIcon path="M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" size={20} color="var(--primary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cls} · {schedule}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge label={status} color="primary" />
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>Since {since}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === 'history' && (
              <div style={{ position: 'relative', paddingLeft: 20 }}>
                <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 2, background: 'var(--border)' }} />
                {([['Apr 20, 2026', 'Routine Follow-up', 'BP 128/82. Medication compliance good. Continue current regimen.', 'Dr. Chen'],
                   ['Mar 15, 2026', 'Lab Review', 'HbA1c, CBC results reviewed. All within normal limits.', 'Dr. Chen'],
                   ['Feb 8, 2026', 'Annual Physical', 'Full physical exam. EKG normal. Recommended dietary changes.', 'Dr. Chen'],
                   ['Jan 5, 2026', 'Medication Adjustment', 'Increased Lisinopril from 5mg to 10mg due to BP elevation.', 'Dr. Chen'],
                   ['Nov 12, 2025', 'Emergency Visit', 'Reported severe headache. BP 156/94. Stabilized with medication.', 'Dr. Park']] as [string, string, string, string][]).map(([date, type, note, dr], i) => (
                  <div key={i} style={{ marginBottom: 20, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -16, top: 4, width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', border: '2px solid white' }} />
                    <div style={{ padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{type}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{date} · {dr}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{note}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === 'notes' && (
              <div>
                <textarea defaultValue="Patient is responding well to current antihypertensive regimen. BP has been trending towards normal over the past 3 months. Dietary modifications show positive effect — patient reports reduced sodium intake and improved physical activity (30 min walking, 5x/week)."
                  style={{ width: '100%', minHeight: 120, border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', fontSize: 13.5, fontFamily: 'inherit', outline: 'none', color: '#374151', resize: 'vertical', lineHeight: 1.7 }}
                  placeholder="Add clinical notes..." />
                <button style={{ marginTop: 10, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Save Note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Module: Pharmacy ─────────────────────────────────────────────────────────

const PharmacyModule: React.FC = () => (
  <div className="ha-content ha-fade">
    <div className="ha-section-head">
      <div>
        <div className="ha-section-title">Pharmacy</div>
        <div className="ha-section-sub">{PRESCRIPTIONS.length} prescriptions today</div>
      </div>
      <button className="ha-action-btn">
        <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
        New Prescription
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }} className="ha-stat-grid-3">
      {([['Pending', '3', 'var(--amber-light)', 'var(--amber)'],
         ['Ready for Pickup', '2', 'var(--primary-light)', 'var(--primary)'],
         ['Dispensed Today', '1', 'var(--blue-light)', 'var(--blue)']] as [string, string, string, string][]).map(([l, v, bg, c]) => (
        <div key={l} className="ha-card" style={{ padding: '16px 20px', background: bg }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{l}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: c }}>{v}</div>
        </div>
      ))}
    </div>
    <div className="ha-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 15 }}>Prescription Queue</div>
      <div className="ha-table-wrap">
        <table className="ha-table">
          <thead><tr>{['Rx ID', 'Patient', 'Drug / Dosage', 'Qty', 'Prescribed By', 'Date', 'Refills', 'Status', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {PRESCRIPTIONS.map((rx, i) => (
              <tr key={rx.id} className="ha-tr" style={{ borderBottom: i < PRESCRIPTIONS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <Td><span style={{ fontWeight: 600, color: 'var(--primary)' }}>{rx.id}</span></Td>
                <Td style={{ fontWeight: 500 }}>{rx.patient}</Td>
                <Td>{rx.drug}</Td>
                <Td>{rx.qty}</Td>
                <Td style={{ color: 'var(--text-muted)' }}>{rx.doctor}</Td>
                <Td style={{ color: 'var(--text-muted)' }}>{rx.date}</Td>
                <Td><Badge label={`${rx.refills} left`} color={rx.refills === 0 ? 'rose' : 'gray'} /></Td>
                <Td><Badge label={rx.status} color={statusColor(rx.status)} /></Td>
                <Td>
                  <button style={{ background: rx.status === 'Pending' ? 'var(--primary)' : 'transparent', color: rx.status === 'Pending' ? 'white' : 'var(--text-muted)', border: rx.status === 'Pending' ? 'none' : '1px solid var(--border)', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                    {rx.status === 'Pending' ? 'Dispense' : 'View'}
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── Module: Lab ──────────────────────────────────────────────────────────────

const LabModule: React.FC = () => (
  <div className="ha-content ha-fade">
    <div className="ha-section-head">
      <div>
        <div className="ha-section-title">Lab & Diagnostics</div>
        <div className="ha-section-sub">6 active orders</div>
      </div>
      <button className="ha-action-btn">
        <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
        New Test Order
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }} className="ha-stat-grid-4">
      {([['STAT', '1', 'var(--rose-light)', 'var(--rose)'],
         ['In Progress', '1', 'var(--amber-light)', 'var(--amber)'],
         ['Pending', '1', 'var(--purple-light)', 'var(--purple)'],
         ['Completed', '3', 'var(--green-light)', 'var(--green)']] as [string, string, string, string][]).map(([l, v, bg, c]) => (
        <div key={l} className="ha-card" style={{ padding: '16px 20px', background: bg }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{l}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: c }}>{v}</div>
        </div>
      ))}
    </div>
    <div className="ha-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 15 }}>Test Orders</div>
      <div className="ha-table-wrap">
        <table className="ha-table">
          <thead><tr>{['Lab ID', 'Patient', 'Test', 'Ordered By', 'Date', 'Priority', 'Status', 'Result', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {LAB_ORDERS.map((l, i) => (
              <tr key={l.id} className="ha-tr" style={{ borderBottom: i < LAB_ORDERS.length - 1 ? '1px solid var(--border)' : 'none', background: l.priority === 'STAT' ? '#fff8f8' : undefined }}>
                <Td><span style={{ fontWeight: 600, color: 'var(--primary)' }}>{l.id}</span></Td>
                <Td style={{ fontWeight: 500 }}>{l.patient}</Td>
                <Td>{l.test}</Td>
                <Td style={{ color: 'var(--text-muted)' }}>{l.ordered}</Td>
                <Td style={{ color: 'var(--text-muted)' }}>{l.date}</Td>
                <Td><Badge label={l.priority} color={statusColor(l.priority)} /></Td>
                <Td><Badge label={l.status} color={statusColor(l.status)} /></Td>
                <Td style={{ fontSize: 12.5, color: 'var(--text-muted)', maxWidth: 200 }}>{l.result || '—'}</Td>
                <Td>
                  <button style={{ background: l.status === 'Complete' ? 'transparent' : 'var(--primary)', color: l.status === 'Complete' ? 'var(--text-muted)' : 'white', border: l.status === 'Complete' ? '1px solid var(--border)' : 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                    {l.status === 'Complete' ? 'View Report' : 'Process'}
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── Module: Inventory ────────────────────────────────────────────────────────

const InventoryModule: React.FC = () => (
  <div className="ha-content ha-fade">
    <div className="ha-section-head">
      <div>
        <div className="ha-section-title">Inventory</div>
        <div className="ha-section-sub">{INVENTORY.length} items tracked</div>
      </div>
      <button className="ha-action-btn">
        <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
        Add Item
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }} className="ha-stat-grid-4">
      {([['Total Items', '8', 'var(--primary-light)', 'var(--primary)'],
         ['Low Stock', '2', 'var(--amber-light)', 'var(--amber)'],
         ['Critical', '2', 'var(--rose-light)', 'var(--rose)'],
         ['OK', '4', 'var(--green-light)', 'var(--green)']] as [string, string, string, string][]).map(([l, v, bg, c]) => (
        <div key={l} className="ha-card" style={{ padding: '16px 20px', background: bg }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{l}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: c }}>{v}</div>
        </div>
      ))}
    </div>
    <div className="ha-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 15 }}>Stock Levels</div>
      <div className="ha-table-wrap">
        <table className="ha-table">
          <thead><tr>{['Item', 'Category', 'Current Stock', 'Min Required', 'Unit', 'Expiry', 'Status', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
          <tbody>
            {INVENTORY.map((item, i) => (
              <tr key={item.id} className="ha-tr" style={{ borderBottom: i < INVENTORY.length - 1 ? '1px solid var(--border)' : 'none', background: item.status === 'Critical' ? '#fff8f8' : undefined }}>
                <Td><span style={{ fontWeight: 600 }}>{item.name}</span></Td>
                <Td><Badge label={item.category} color="gray" /></Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 4, height: 6, overflow: 'hidden', minWidth: 60 }}>
                      <div style={{ width: `${Math.min(100, (item.stock / Math.max(item.min * 3, item.stock)) * 100)}%`, height: '100%', background: item.status === 'Critical' ? 'var(--rose)' : item.status === 'Low' ? 'var(--amber)' : 'var(--primary)', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{item.stock.toLocaleString()}</span>
                  </div>
                </Td>
                <Td style={{ color: 'var(--text-muted)' }}>{item.min}</Td>
                <Td style={{ color: 'var(--text-muted)' }}>{item.unit}</Td>
                <Td style={{ color: 'var(--text-muted)' }}>{item.expiry}</Td>
                <Td><Badge label={item.status} color={statusColor(item.status)} /></Td>
                <Td>
                  <button style={{ background: item.status !== 'OK' ? 'var(--primary)' : 'transparent', color: item.status !== 'OK' ? 'white' : 'var(--text-muted)', border: item.status !== 'OK' ? 'none' : '1px solid var(--border)', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                    {item.status !== 'OK' ? 'Reorder' : 'Manage'}
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── Module: Analytics ────────────────────────────────────────────────────────

const AnalyticsModule: React.FC = () => {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const revenue = [42000, 47000, 51000, 38000, 54000, 59000, 62000];
  const patients = [180, 210, 195, 160, 230, 245, 248];
  const maxRev = Math.max(...revenue);
  const maxPat = Math.max(...patients);

  return (
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Analytics & Reports</div>
          <div className="ha-section-sub">April 2026 · YTD Overview</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }} className="ha-stat-grid-4">
        {([['Total Revenue', '₹62,000', '↑ 5.1% vs Mar', 'var(--primary-light)', 'var(--primary)'],
           ['Total Patients', '1,248', '↑ 12 new today', 'var(--blue-light)', 'var(--blue)'],
           ['Avg. Revenue/Patient', '₹49.7', '', 'var(--amber-light)', 'var(--amber)'],
           ['Bed Occupancy', '78%', '12 beds in use', 'var(--green-light)', 'var(--green)']] as [string, string, string, string, string][]).map(([l, v, sub, bg, c]) => (
          <div key={l} className="ha-card">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: c, letterSpacing: '-0.5px' }}>{v}</div>
            {sub && <div style={{ fontSize: 12, color: c, marginTop: 4 }}>{sub}</div>}
          </div>
        ))}
      </div>
      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="ha-grid-2-1">
        <div className="ha-card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Monthly Revenue</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 130 }}>
            {revenue.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>₹{(v / 1000).toFixed(0)}k</div>
                <div style={{ width: '100%', height: `${(v / maxRev) * 90}px`, borderRadius: '6px 6px 0 0', background: 'var(--primary)', opacity: i === 6 ? 1 : 0.35, transition: 'height 0.4s ease' }} />
                <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ha-card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Patient Growth</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 130 }}>
            {patients.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{v}</div>
                <div style={{ width: '100%', height: `${(v / maxPat) * 90}px`, borderRadius: '6px 6px 0 0', background: 'var(--blue)', opacity: i === 6 ? 1 : 0.35, transition: 'height 0.4s ease' }} />
                <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="ha-grid-2-1">
        <div className="ha-card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Top Diagnoses</div>
          {([['Hypertension', 340, 'var(--rose)'], ['Type 2 Diabetes', 218, 'var(--amber)'], ['Respiratory Issues', 142, 'var(--blue)'], ['Cardiac Conditions', 98, 'var(--purple)'], ['Mental Health', 87, 'var(--primary)']] as [string, number, string][]).map(([name, count, c]) => (
            <div key={name} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{count} pts</span>
              </div>
              <div style={{ background: '#f1f5f9', borderRadius: 4, height: 7, overflow: 'hidden' }}>
                <div style={{ width: `${(count / 340) * 100}%`, height: '100%', background: c, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
        <div className="ha-card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Performance KPIs</div>
          {([['Avg. Wait Time', '12 min', 'Target: 15 min', '↑ Good', 'var(--green)'],
             ['Patient Satisfaction', '94.2%', 'Target: 90%', '↑ Exceeding', 'var(--green)'],
             ['Appointment No-show', '6.8%', 'Target: < 10%', '✓ On Track', 'var(--primary)'],
             ['Prescription Accuracy', '99.1%', 'Target: 99%', '↑ Good', 'var(--green)'],
             ['Lab Turnaround', '4.2 hrs', 'Target: 6 hrs', '↑ Good', 'var(--green)']] as [string, string, string, string, string][]).map(([kpi, val, target, status, c]) => (
            <div key={kpi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 10, background: 'var(--bg)', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{kpi}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{target}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: 11.5, color: c }}>{status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Module: Notifications ────────────────────────────────────────────────────

const NotificationsModule: React.FC = () => {
  const [notifs, setNotifs] = useState<Notification[]>(NOTIFICATIONS_DATA);

  const markRead = useCallback((id: number) =>
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);

  const markAllRead = useCallback(() =>
    setNotifs(prev => prev.map(n => ({ ...n, read: true }))), []);

  const typeIcon = (t: string) =>
    t === 'critical' ? '🔴' : t === 'alert' ? '🟡' : t === 'success' ? '🟢' : '🔵';
  const notifBg = (t: string) =>
    t === 'critical' ? 'var(--rose-light)' : t === 'alert' ? 'var(--amber-light)' : t === 'success' ? 'var(--green-light)' : 'var(--blue-light)';
  const unreadBorder = (t: string) =>
    t === 'critical' ? '#fca5a5' : t === 'alert' ? '#fcd34d' : 'var(--border)';

  return (
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Notifications</div>
          <div className="ha-section-sub">{notifs.filter(n => !n.read).length} unread</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }} className="ha-grid-2-1">
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {['All', 'Unread', 'Critical', 'Alerts'].map(f => (
              <button key={f} style={{ padding: '6px 16px', borderRadius: 20, border: '1px solid var(--border)', background: f === 'All' ? 'var(--primary)' : 'var(--card)', color: f === 'All' ? 'white' : 'var(--text-muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', fontWeight: f === 'All' ? 600 : 400 }}>
                {f}
              </button>
            ))}
            <button onClick={markAllRead} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 13, color: 'var(--primary)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
              Mark all as read
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifs.map(n => (
              <div key={n.id} className={`ha-notif-item ${!n.read ? 'unread' : ''}`}
                style={{ border: n.read ? '1px solid var(--border)' : `1.5px solid ${unreadBorder(n.type)}` }}
                onClick={() => markRead(n.id)}>
                <div className="ha-notif-icon" style={{ background: notifBg(n.type) }}>{typeIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: n.read ? 500 : 700, fontSize: 13.5 }}>{n.title}</div>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)', flexShrink: 0, marginLeft: 12 }}>{n.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>{n.body}</div>
                </div>
                {!n.read && <div className="ha-notif-dot" />}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="ha-card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Alert Summary</div>
            {([['Critical', '1', 'var(--rose-light)', 'var(--rose)'],
               ['Alerts', '2', 'var(--amber-light)', 'var(--amber)'],
               ['Info', '3', 'var(--blue-light)', 'var(--blue)'],
               ['Success', '2', 'var(--green-light)', 'var(--green)']] as [string, string, string, string][]).map(([l, v, bg, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: bg, borderRadius: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: c, fontWeight: 500 }}>{l}</span>
                <span style={{ fontWeight: 700, fontSize: 16, color: c }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="ha-card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Notification Settings</div>
            {['Critical lab results', 'Low inventory alerts', 'Appointment reminders', 'New registrations', 'Billing updates'].map(s => (
              <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: '#374151' }}>{s}</span>
                <div className="ha-toggle" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC<{
  active:   ModuleId;
  onNav:    (m: ModuleId) => void;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  adminName: string;
  onSignOut?: () => void;
}> = ({ active, onNav, collapsed, onToggle, mobileOpen, adminName, onSignOut }) => {
  const abb = initials(adminName);

  return (
    <nav className={`ha-sidebar ${collapsed ? 'collapsed' : 'expanded'} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="ha-logo-row">
        <div className="ha-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
          </svg>
        </div>
        {!collapsed && <span className="ha-logo-text">Vexoo</span>}
        <button className="ha-collapse-btn" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
          <SvgIcon path={collapsed ? 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' : 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'} size={14} color="white" />
        </button>
      </div>

      {!collapsed && <div className="ha-nav-section-label">Main Menu</div>}

      <div className="ha-nav">
        {NAV.map(item => (
          <button key={item.id} className={`ha-nav-btn ${active === item.id ? 'active' : ''}`}
            title={collapsed ? item.label : ''} onClick={() => onNav(item.id)}>
            <SvgIcon path={item.path} size={18} color="currentColor" />
            {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
            {!collapsed && item.badge && <span className="ha-nav-badge">{item.badge}</span>}
            {collapsed && item.badge && <span className="ha-nav-badge-dot" />}
          </button>
        ))}
      </div>

      <div className="ha-user-row">
        <div className="ha-user-inner" onClick={onSignOut} title={onSignOut ? 'Sign out' : ''}>
          <div className="ha-avatar">{abb}</div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div className="ha-user-name">{adminName}</div>
              <div className="ha-user-role">Administrator</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────

const Header: React.FC<{ title: string; onHamburger: () => void; adminName: string }> =
  ({ title, onHamburger, adminName }) => {
    const [search, setSearch] = useState('');
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return (
      <header className="ha-header">
        <button className="ha-hamburger" onClick={onHamburger} aria-label="Open menu">
          <SvgIcon path="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" size={22} color="var(--text)" />
        </button>
        <div>
          <div className="ha-header-title">{title}</div>
          <div className="ha-header-date">{today}</div>
        </div>
        <div className="ha-header-spacer" />
        <div className="ha-search-box">
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" size={14} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients, records..." />
        </div>
        <button className="ha-icon-btn" aria-label="Notifications">
          <SvgIcon path="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" size={18} color="var(--text-muted)" />
          <span className="ha-notif-dot" />
        </button>
        <button className="ha-help-btn">
          <SvgIcon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" size={15} color="currentColor" />
          <span>Help</span>
        </button>
        <div className="ha-header-avatar">{initials(adminName)}</div>
      </header>
    );
  };

// ─── Root component ───────────────────────────────────────────────────────────

export default function HospitalAdminScreen({ adminName = 'Anita Reddy', onSignOut }: HospitalAdminScreenProps) {
  const [module,     setModule]     = useState<ModuleId>('dashboard');
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile nav on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNav = useCallback((m: ModuleId) => {
    setModule(m);
    setMobileOpen(false);
  }, []);

  const moduleEl = useMemo(() => {
    switch (module) {
      case 'patients':      return <PatientsModule />;
      case 'appointments':  return <AppointmentsModule />;
      case 'emr':           return <EMRModule />;
      case 'pharmacy':      return <PharmacyModule />;
      case 'lab':           return <LabModule />;
      case 'inventory':     return <InventoryModule />;
      case 'analytics':     return <AnalyticsModule />;
      case 'notifications': return <NotificationsModule />;
      default:              return <Dashboard setModule={setModule} />;
    }
  }, [module]);

  return (
    <div className="ha-root">
      <style>{CSS}</style>

      {/* Mobile overlay — tap to close nav */}
      <div className={`ha-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

      <div className="ha-shell">
        <Sidebar
          active={module}
          onNav={handleNav}
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          mobileOpen={mobileOpen}
          adminName={adminName}
          onSignOut={onSignOut}
        />

        <div className="ha-main">
          <Header
            title={MODULE_TITLES[module]}
            onHamburger={() => setMobileOpen(o => !o)}
            adminName={adminName}
          />
          {moduleEl}
        </div>
      </div>
    </div>
  );
}
