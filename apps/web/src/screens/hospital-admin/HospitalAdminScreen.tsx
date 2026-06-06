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
 *  Route:           /admin  (protected, requires role === 'Admin')
 *  Suggested path:  apps/web/src/screens/hospital-admin/HospitalAdminScreen.tsx
 *
 *  Props:
 *    adminName?  — injected from AuthContext (e.g. "Anita Reddy")
 *    onSignOut?  — called when Sign out is clicked
 *
 *  UPDATED (Jun 2026):
 *  - Header profile card now matches the Patient-screen style:
 *    avatar circle · name · role · email · divider · View/Edit Profile
 *    (opens modal) · Sign out (calls onSignOut). Card uses display:none/block
 *    so the hidden card is fully removed from hit-testing and never blocks
 *    clicks on the content behind it.
 *  - Header component now accepts onSignOut so the card's Sign out button
 *    works without going back to the sidebar.
 * ============================================================================
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ModuleId =
  | 'dashboard' | 'patients' | 'appointments' | 'emr'
  | 'pharmacy'  | 'lab'      | 'inventory'    | 'analytics' | 'notifications' | 'staff'| 'reviews';

type StatusColor = 'primary' | 'amber' | 'rose' | 'blue' | 'purple' | 'green' | 'gray';

interface NavItem { id: ModuleId; label: string; path: string; badge?: number; }

// ─── Staff types ──────────────────────────────────────────────────────────────
type StaffRole = 'Doctor' | 'Receptionist' | 'Pharmacist' | 'LabTech';
interface StaffMember {
  id: string; name: string; role: StaffRole;
  specialization?: string; department: string;
  email: string; phone: string; employeeId: string;
  joinDate: string; status: 'Active' | 'Inactive'; licenceNo?: string;
}

const STAFF_MEMBERS_INIT: StaffMember[] = [
  { id:'S-001', name:'Dr. Amy Chen',  role:'Doctor',       specialization:'Cardiologist',    department:'Cardiology',   email:'amy.chen@hospital.vexoo.in',  phone:'+91 98765 43210', employeeId:'EMP-D001', joinDate:'Jan 2024', status:'Active',   licenceNo:'MCI/REG/12483' },
  { id:'S-002', name:'Dr. Raj Patel', role:'Doctor',       specialization:'Endocrinologist', department:'Endocrinology',email:'raj.patel@hospital.vexoo.in', phone:'+91 98765 43211', employeeId:'EMP-D002', joinDate:'Feb 2024', status:'Active',   licenceNo:'MCI/REG/09214' },
  { id:'S-003', name:'Maria Lopez',   role:'Receptionist', department:'Reception',           email:'maria.l@hospital.vexoo.in',  phone:'+91 98765 43220', employeeId:'EMP-R001', joinDate:'Jan 2024', status:'Active' },
  { id:'S-004', name:'Kevin Liu',     role:'LabTech',      department:'Diagnostics',         email:'kevin.l@hospital.vexoo.in',  phone:'+91 98765 43230', employeeId:'EMP-L001', joinDate:'Mar 2024', status:'Active',   licenceNo:'LT/2019/TS/00482' },
  { id:'S-005', name:'Mei Perez',     role:'Pharmacist',   department:'Pharmacy',            email:'mei.p@hospital.vexoo.in',    phone:'+91 98765 43240', employeeId:'EMP-P001', joinDate:'Apr 2024', status:'Active',   licenceNo:'PH/2020/MH/04182' },
];

const ROLE_COLORS: Record<StaffRole, [string,string]> = {
  Doctor:       ['#dbeafe','#3b82f6'],
  Receptionist: ['#fce7f3','#ec4899'],
  Pharmacist:   ['#e6faf8','#0d9488'],
  LabTech:      ['#ede9fe','#7c3aed'],
};
const ROLE_LABELS: Record<StaffRole, string> = {
  Doctor:'Doctor', Receptionist:'Receptionist / Nurse',
  Pharmacist:'Pharmacist', LabTech:'Lab Technician',
};
const DOCTOR_SPECS = [
  'Cardiologist','General Physician','Endocrinologist','Pulmonologist',
  'Orthopaedic Surgeon','Neurologist','Paediatrician','Dermatologist',
  'Ophthalmologist','ENT Specialist','Gynaecologist','Oncologist',
  'Psychiatrist','Radiologist','Anaesthesiologist',
];

interface Patient {
  id: string; name: string; age: number; gender: 'M' | 'F';
  blood: string; condition: string; doctor: string;
  status: string; date: string; phone: string; email: string;
  lastVisit: string; visits: number; allergies: string; history: string;
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
  time: string; date: string; isoDate: string; room: string; status: string;
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

.ha-root ::-webkit-scrollbar { width: 5px; height: 5px; }
.ha-root ::-webkit-scrollbar-track { background: transparent; }
.ha-root ::-webkit-scrollbar-thumb { background: #d1cec8; border-radius: 4px; }

@keyframes ha-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.ha-fade { animation: ha-fade 0.22s ease both; }

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

/* ── Sidebar footer ── */
.ha-user-row { border-top: 1px solid rgba(255,255,255,0.07); padding: 12px 10px; }
.ha-user-identity {
  display: flex; align-items: center; gap: 10px; border-radius: 10px;
  padding: 8px 12px; margin-bottom: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
}
.ha-sidebar.collapsed .ha-user-identity { padding: 8px 10px; justify-content: center; margin-bottom: 6px; }
.ha-avatar {
  width: 34px; height: 34px; border-radius: 50%; background: var(--primary);
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 12px;
}
.ha-user-name { color: white; font-size: 12.5px; font-weight: 600; white-space: nowrap; }
.ha-user-role { color: rgba(255,255,255,0.4); font-size: 11px; }
.ha-signout-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 9px 14px; border-radius: 10px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.55); font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: background 0.13s, color 0.13s, border-color 0.13s;
}
.ha-signout-btn:hover { background: rgba(225,29,72,0.12); color: #f87171; border-color: rgba(225,29,72,0.25); }
.ha-signout-btn svg { flex-shrink: 0; }

/* mobile nav overlay */
.ha-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 9; }
.ha-overlay.open { display: block; }
.ha-hamburger {
  display: none; background: none; border: none; cursor: pointer;
  padding: 4px; color: var(--text); align-items: center; justify-content: center;
}

/* ── Header ── */
.ha-header {
  display: flex; align-items: center; padding: 0 24px; height: 60px;
  background: var(--card); border-bottom: 1px solid var(--border);
  gap: 14px; flex-shrink: 0;
  position: relative; z-index: 15;
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
.ha-help-btn {
  background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
  padding: 7px 14px; cursor: pointer; font-size: 13px; color: var(--text-muted);
  display: flex; align-items: center; gap: 6px; font-family: inherit;
  transition: background 0.13s;
}
.ha-help-btn:hover { background: var(--border); }

/* ── Profile wrap (header top-right) ── */
.ha-profile-wrap { position: relative; }

.ha-header-avatar {
  width: 36px; height: 36px; border-radius: 50%; background: var(--primary);
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 13px; cursor: pointer;
  transition: box-shadow 0.15s; user-select: none;
}
.ha-profile-wrap:hover .ha-header-avatar {
  box-shadow: 0 0 0 3px rgba(13,148,136,0.25);
}

/* ── Profile hover card — Patient-screen style ── */

.ha-profile-tooltip {
  display: none; position: absolute; top: calc(100% + 10px); right: 0;
  background: var(--card); border: 1px solid var(--border); border-radius: 14px;
  padding: 16px 18px; min-width: 230px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
  z-index: 1000;
  /* z-index overridden to 1000 by globals.css */
}
  
.ha-profile-wrap:hover .ha-profile-tooltip { display: block; }
.ha-profile-tooltip::before {
  content: ''; position: absolute;
  top: -12px; left: 0; right: 0; height: 12px;
}

.ha-tt-avatar {
  width: 46px; height: 46px; border-radius: 50%; background: var(--primary);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 16px; margin-bottom: 12px;
}
.ha-tt-name { font-size: 14px; font-weight: 700; color: var(--text); }
.ha-tt-sub  { font-size: 12px; color: var(--text-muted); margin-top: 3px; }
.ha-tt-divider { height: 1px; background: var(--border); margin: 12px 0; }
.ha-tt-action {
  display: flex; align-items: center; gap: 9px; width: 100%;
  padding: 8px 10px; border-radius: 9px; border: none; background: transparent;
  font-size: 13px; font-weight: 500; cursor: pointer; text-align: left;
  font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.13s;
}
.ha-tt-action svg { flex-shrink: 0; }
.ha-tt-action.profile { color: var(--primary); }
.ha-tt-action.profile:hover { background: var(--primary-light); }
.ha-tt-action.signout { color: var(--rose); }
.ha-tt-action.signout:hover { background: var(--rose-light); }

/* ── Shared UI ── */
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

/* ── Search ── */
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

/* ── EMR ── */
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

/* ── Notifications ── */
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

/* ── Toggle ── */
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

// ─── Mock data ────────────────────────────────────────────────────────────────

const PATIENTS: Patient[] = [
  { id:'P-001', name:'Sarah Johnson',   age:34, gender:'F', blood:'A+',  condition:'Hypertension',       doctor:'Dr. Chen',  status:'Stable',     date:'Apr 26', phone:'+91 98765 43210', email:'sarah.j@email.com',  lastVisit:'20-04-2026', visits:14, allergies:'Penicillin, Sulfonamides', history:'Diagnosed hypertension 2022. Family history of cardiac disease. Ex-smoker.' },
  { id:'P-002', name:'Marcus Williams', age:52, gender:'M', blood:'O+',  condition:'Type 2 Diabetes',    doctor:'Dr. Patel', status:'Monitoring', date:'Apr 26', phone:'+91 98765 43211', email:'marcus.w@email.com', lastVisit:'18-04-2026', visits:22, allergies:'None known', history:'T2DM diagnosed 2019. BMI 29.4. Hypertension co-morbidity managed.' },
  { id:'P-003', name:'Elena Rodriguez', age:28, gender:'F', blood:'B-',  condition:'Asthma',             doctor:'Dr. Kim',   status:'Stable',     date:'Apr 25', phone:'+91 98765 43212', email:'elena.r@email.com',  lastVisit:'22-04-2026', visits:8,  allergies:'Aspirin (mild)', history:'Childhood asthma. Seasonal allergic rhinitis. No hospitalisations in past 3 years.' },
  { id:'P-004', name:"James O'Brien",   age:67, gender:'M', blood:'AB+', condition:'Cardiac Arrhythmia', doctor:'Dr. Chen',  status:'Critical',   date:'Apr 25', phone:'+91 98765 43213', email:'james.o@email.com',  lastVisit:'24-04-2026', visits:31, allergies:'Warfarin (GI bleed risk)', history:'AF diagnosed 2020. Pacemaker implanted Jan 2023. Previous MI 2018.' },
  { id:'P-005', name:'Priya Sharma',    age:41, gender:'F', blood:'A-',  condition:'Migraine',           doctor:'Dr. Patel', status:'Stable',     date:'Apr 25', phone:'+91 98765 43214', email:'priya.s@email.com',  lastVisit:'19-04-2026', visits:11, allergies:'None known', history:'Chronic migraine with aura since 2017. Hormonal triggers identified. No structural abnormality on MRI.' },
  { id:'P-006', name:'Thomas Klein',    age:59, gender:'M', blood:'O-',  condition:'COPD',               doctor:'Dr. Kim',   status:'Monitoring', date:'Apr 24', phone:'+91 98765 43215', email:'thomas.k@email.com', lastVisit:'15-04-2026', visits:19, allergies:'Beta-blockers', history:'COPD Stage II diagnosed 2021. 30-pack-year smoking history. Quit 2020. Annual influenza vaccination.' },
  { id:'P-007', name:'Aisha Okonkwo',   age:31, gender:'F', blood:'B+',  condition:'Anxiety Disorder',   doctor:'Dr. Patel', status:'Stable',     date:'Apr 23', phone:'+91 98765 43216', email:'aisha.o@email.com',  lastVisit:'10-04-2026', visits:6,  allergies:'None known', history:'GAD diagnosed 2023. Concurrent CBT. No prior psychiatric admissions.' },
  { id:'P-008', name:'David Nguyen',    age:44, gender:'M', blood:'A+',  condition:'Hypertension',       doctor:'Dr. Chen',  status:'Stable',     date:'Apr 22', phone:'+91 98765 43217', email:'david.n@email.com',  lastVisit:'14-04-2026', visits:9,  allergies:'Codeine', history:'Hypertension diagnosed 2023. Lifestyle modification initiated. Monitoring lipid profile.' },
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
  { id:'L-0091', patient:'Marcus Williams', test:'HbA1c Panel',           ordered:'Dr. Patel', date:'Apr 26', status:'In Progress', priority:'Routine', result:'' },
  { id:'L-0092', patient:"James O'Brien",   test:'ECG + Troponin',        ordered:'Dr. Chen',  date:'Apr 26', status:'Critical',    priority:'STAT',    result:'Troponin elevated' },
  { id:'L-0093', patient:'Sarah Johnson',   test:'CBC + Metabolic Panel', ordered:'Dr. Chen',  date:'Apr 25', status:'Complete',    priority:'Routine', result:'Within normal range' },
  { id:'L-0094', patient:'Elena Rodriguez', test:'Spirometry',            ordered:'Dr. Kim',   date:'Apr 25', status:'Complete',    priority:'Routine', result:'FEV1 68% — mild obstruction' },
  { id:'L-0095', patient:'Priya Sharma',    test:'MRI Brain',             ordered:'Dr. Patel', date:'Apr 24', status:'Pending',     priority:'Urgent',  result:'' },
  { id:'L-0096', patient:'Thomas Klein',    test:'Pulmonary Function Test',ordered:'Dr. Kim',  date:'Apr 23', status:'Complete',    priority:'Routine', result:'Moderate COPD confirmed' },
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
  { id:6, type:'success',  title:'Prescription Dispensed',                body:"RX-4823 — Amiodarone 200mg dispensed to James O'Brien.",                    time:'3 hrs ago',  read:true  },
  { id:7, type:'info',     title:'Lab Results Ready',                     body:'CBC + Metabolic Panel for Sarah Johnson are ready for review.',              time:'4 hrs ago',  read:true  },
  { id:8, type:'success',  title:'Payment Processed',                     body:'Invoice #INV-2408 — ₹1,240 received from Marcus Williams.',                  time:'5 hrs ago',  read:true  },
];

const APPOINTMENTS: Appointment[] = [
  // ── Apr 26 (Sun) — Today (34 slots; 12 shown for pagination demo) ──────────
  { id:'A-001', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 104', status:'Confirmed'   },
  { id:'A-002', patient:'New Patient',     doctor:'Dr. Patel', type:'Consultation',time:'10:30 AM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 201', status:'Waiting'     },
  { id:'A-003', patient:"James O'Brien",   doctor:'Dr. Chen',  type:'Urgent',      time:'11:00 AM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 104', status:'In Progress' },
  { id:'A-004', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Check-up',    time:'01:00 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 302', status:'Confirmed'   },
  { id:'A-005', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'02:30 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 201', status:'Confirmed'   },
  { id:'A-006', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Lab Review',  time:'04:00 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 201', status:'Pending'     },
  { id:'A-007', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Consultation',time:'04:45 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 201', status:'Pending'     },
  { id:'A-008', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Follow-up',   time:'05:00 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 104', status:'Pending'     },
  { id:'A-009', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Consultation',time:'05:30 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 302', status:'Pending'     },
  { id:'A-010', patient:'Fatima Noor',     doctor:'Dr. Chen',  type:'Follow-up',   time:'06:00 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 104', status:'Pending'     },
  { id:'A-011', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Check-up',    time:'06:30 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 302', status:'Pending'     },
  { id:'A-012', patient:'Meena Iyer',      doctor:'Dr. Patel', type:'Consultation',time:'07:00 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 201', status:'Pending'     },
  // ── Apr 25 (Sat) ────────────────────────────────────────────────────────────
  { id:'A-013', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', date:'Apr 25', isoDate:'2026-04-25', room:'Room 104', status:'Completed'  },
  { id:'A-014', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Consultation',time:'10:00 AM', date:'Apr 25', isoDate:'2026-04-25', room:'Room 201', status:'Completed'  },
  { id:'A-015', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'11:30 AM', date:'Apr 25', isoDate:'2026-04-25', room:'Room 201', status:'No-Show'    },
  { id:'A-016', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Check-up',    time:'02:00 PM', date:'Apr 25', isoDate:'2026-04-25', room:'Room 302', status:'Completed'  },
  // ── Apr 24 (Fri) ────────────────────────────────────────────────────────────
  { id:'A-017', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Consultation',time:'08:30 AM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 302', status:'Completed'  },
  { id:'A-018', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 104', status:'Completed'  },
  { id:'A-019', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Lab Review',  time:'10:00 AM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 201', status:'No-Show'    },
  { id:'A-020', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Check-up',    time:'11:00 AM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 302', status:'Completed'  },
  { id:'A-021', patient:'Meena Iyer',      doctor:'Dr. Patel', type:'Consultation',time:'12:30 PM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 201', status:'Completed'  },
  { id:'A-022', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Urgent',      time:'02:00 PM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 104', status:'Completed'  },
  { id:'A-023', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Follow-up',   time:'03:00 PM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 302', status:'Completed'  },
  // ── Apr 23 (Thu) ────────────────────────────────────────────────────────────
  { id:'A-024', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Lab Review',  time:'08:00 AM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 201', status:'Completed'  },
  { id:'A-025', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'09:00 AM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 201', status:'Completed'  },
  { id:'A-026', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Check-up',    time:'10:30 AM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 104', status:'No-Show'    },
  { id:'A-027', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Consultation',time:'11:00 AM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 201', status:'Completed'  },
  { id:'A-028', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Follow-up',   time:'01:00 PM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 302', status:'Completed'  },
  { id:'A-029', patient:'Fatima Noor',     doctor:'Dr. Chen',  type:'Consultation',time:'02:30 PM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 104', status:'Completed'  },
  { id:'A-030', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Check-up',    time:'03:30 PM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 302', status:'Completed'  },
  { id:'A-031', patient:'Meena Iyer',      doctor:'Dr. Patel', type:'Follow-up',   time:'04:00 PM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 201', status:'No-Show'    },
  { id:'A-032', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Consultation',time:'04:30 PM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 302', status:'Completed'  },
  // ── Apr 22 (Wed) ────────────────────────────────────────────────────────────
  { id:'A-033', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 104', status:'Completed'  },
  { id:'A-034', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Consultation',time:'10:00 AM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 201', status:'No-Show'    },
  { id:'A-035', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Check-up',    time:'11:30 AM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 302', status:'Completed'  },
  { id:'A-036', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Lab Review',  time:'01:00 PM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 104', status:'Completed'  },
  { id:'A-037', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'02:30 PM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 201', status:'Completed'  },
  { id:'A-038', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Consultation',time:'04:00 PM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 201', status:'Completed'  },
  // ── Apr 21 (Tue) ────────────────────────────────────────────────────────────
  { id:'A-039', patient:'Fatima Noor',     doctor:'Dr. Chen',  type:'Consultation',time:'08:30 AM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 104', status:'Completed'  },
  { id:'A-040', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Check-up',    time:'09:30 AM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 302', status:'Completed'  },
  { id:'A-041', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Follow-up',   time:'10:30 AM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 302', status:'No-Show'    },
  { id:'A-042', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'12:00 PM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 104', status:'Completed'  },
  { id:'A-043', patient:'Meena Iyer',      doctor:'Dr. Patel', type:'Consultation',time:'01:30 PM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 201', status:'Completed'  },
  { id:'A-044', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Lab Review',  time:'02:30 PM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 201', status:'Completed'  },
  { id:'A-045', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Consultation',time:'04:00 PM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 302', status:'Completed'  },
  { id:'A-046', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Check-up',    time:'04:45 PM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 104', status:'Completed'  },
  // ── Apr 20 (Mon) ────────────────────────────────────────────────────────────
  { id:'A-047', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Consultation',time:'09:00 AM', date:'Apr 20', isoDate:'2026-04-20', room:'Room 201', status:'Completed'  },
  { id:'A-048', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Follow-up',   time:'10:00 AM', date:'Apr 20', isoDate:'2026-04-20', room:'Room 201', status:'Completed'  },
  { id:'A-049', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Check-up',    time:'11:30 AM', date:'Apr 20', isoDate:'2026-04-20', room:'Room 302', status:'No-Show'    },
  { id:'A-050', patient:'Fatima Noor',     doctor:'Dr. Chen',  type:'Consultation',time:'01:00 PM', date:'Apr 20', isoDate:'2026-04-20', room:'Room 104', status:'Completed'  },
  { id:'A-051', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Follow-up',   time:'02:30 PM', date:'Apr 20', isoDate:'2026-04-20', room:'Room 302', status:'Completed'  },
  // ── Apr 17 (Fri) — previous week ────────────────────────────────────────────
  { id:'A-052', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', date:'Apr 17', isoDate:'2026-04-17', room:'Room 104', status:'Completed'  },
  { id:'A-053', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Lab Review',  time:'10:30 AM', date:'Apr 17', isoDate:'2026-04-17', room:'Room 201', status:'No-Show'    },
  { id:'A-054', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Consultation',time:'12:00 PM', date:'Apr 17', isoDate:'2026-04-17', room:'Room 302', status:'Completed'  },
  { id:'A-055', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Check-up',    time:'02:00 PM', date:'Apr 17', isoDate:'2026-04-17', room:'Room 104', status:'Completed'  },
  { id:'A-056', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'03:30 PM', date:'Apr 17', isoDate:'2026-04-17', room:'Room 201', status:'Completed'  },
  // ── Apr 16 (Thu) ────────────────────────────────────────────────────────────
  { id:'A-057', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Consultation',time:'09:30 AM', date:'Apr 16', isoDate:'2026-04-16', room:'Room 201', status:'Completed'  },
  { id:'A-058', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Check-up',    time:'11:00 AM', date:'Apr 16', isoDate:'2026-04-16', room:'Room 302', status:'No-Show'    },
  { id:'A-059', patient:'Fatima Noor',     doctor:'Dr. Chen',  type:'Consultation',time:'01:30 PM', date:'Apr 16', isoDate:'2026-04-16', room:'Room 104', status:'Completed'  },
  { id:'A-060', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Follow-up',   time:'03:00 PM', date:'Apr 16', isoDate:'2026-04-16', room:'Room 302', status:'Completed'  },
  // ── Apr 14 (Tue) ────────────────────────────────────────────────────────────
  { id:'A-061', patient:'Meena Iyer',      doctor:'Dr. Patel', type:'Consultation',time:'09:00 AM', date:'Apr 14', isoDate:'2026-04-14', room:'Room 201', status:'Completed'  },
  { id:'A-062', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'10:30 AM', date:'Apr 14', isoDate:'2026-04-14', room:'Room 104', status:'Completed'  },
  { id:'A-063', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Lab Review',  time:'12:00 PM', date:'Apr 14', isoDate:'2026-04-14', room:'Room 201', status:'No-Show'    },
  { id:'A-064', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Check-up',    time:'02:00 PM', date:'Apr 14', isoDate:'2026-04-14', room:'Room 302', status:'Completed'  },
  { id:'A-065', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Consultation',time:'03:30 PM', date:'Apr 14', isoDate:'2026-04-14', room:'Room 201', status:'Completed'  },
];

// ── Prescription course details ───────────────────────────────────────────────
const PRESCRIPTION_DETAILS: Record<string, { frequency:string; duration:string; instructions:string; taken:number; isoDate:string }> = {
  'RX-4821': { frequency:'Once daily (morning)',    duration:'30 days', instructions:'Take in the morning with water. Monitor BP weekly.', taken:2,  isoDate:'2026-04-26' },
  'RX-4822': { frequency:'Twice daily with meals',  duration:'30 days', instructions:'Take with breakfast and dinner. Monitor blood glucose.', taken:4, isoDate:'2026-04-26' },
  'RX-4823': { frequency:'Once daily with food',    duration:'30 days', instructions:'Take with food. Regular ECG monitoring required.', taken:6,  isoDate:'2026-04-26' },
  'RX-4824': { frequency:'2 puffs as needed',       duration:'As directed', instructions:'Use when experiencing shortness of breath. Max 4 times daily.', taken:0, isoDate:'2026-04-25' },
  'RX-4825': { frequency:'Once at migraine onset',  duration:'As needed', instructions:'Take at onset. May repeat after 2 hrs if needed. Max 2/day.', taken:3, isoDate:'2026-04-25' },
  'RX-4826': { frequency:'Once daily (inhaled)',    duration:'30 days', instructions:'1 capsule inhaled via HandiHaler device each morning.', taken:8, isoDate:'2026-04-24' },
};

// ── Lab result detail values ───────────────────────────────────────────────────
const LAB_RESULT_DETAILS: Record<string, { parameter:string; value:string; unit:string; reference:string; flag:'NORMAL'|'HIGH'|'LOW'|'CRITICAL' }[]> = {
  'L-0091': [
    { parameter:'HbA1c',                 value:'7.2',  unit:'%',     reference:'< 5.7',      flag:'HIGH'     },
    { parameter:'Fasting Glucose',       value:'132',  unit:'mg/dL', reference:'70–99',       flag:'HIGH'     },
    { parameter:'Est. Avg Glucose',      value:'163',  unit:'mg/dL', reference:'< 154',       flag:'HIGH'     },
  ],
  'L-0092': [
    { parameter:'Troponin I',            value:'0.18', unit:'ng/mL', reference:'< 0.04',     flag:'CRITICAL' },
    { parameter:'Heart Rate',            value:'110',  unit:'bpm',   reference:'60–100',      flag:'HIGH'     },
    { parameter:'PR Interval',           value:'198',  unit:'ms',    reference:'120–200',     flag:'NORMAL'   },
    { parameter:'QRS Duration',          value:'115',  unit:'ms',    reference:'< 120',       flag:'NORMAL'   },
  ],
  'L-0093': [
    { parameter:'WBC',                   value:'6.8',  unit:'K/μL',  reference:'4.5–11.0',   flag:'NORMAL'   },
    { parameter:'RBC',                   value:'4.5',  unit:'M/μL',  reference:'4.2–5.4',    flag:'NORMAL'   },
    { parameter:'Hemoglobin',            value:'13.8', unit:'g/dL',  reference:'12.0–16.0',  flag:'NORMAL'   },
    { parameter:'Sodium',                value:'140',  unit:'mEq/L', reference:'136–145',     flag:'NORMAL'   },
    { parameter:'Potassium',             value:'4.1',  unit:'mEq/L', reference:'3.5–5.1',    flag:'NORMAL'   },
    { parameter:'Creatinine',            value:'0.9',  unit:'mg/dL', reference:'0.6–1.2',    flag:'NORMAL'   },
  ],
  'L-0094': [
    { parameter:'FVC',                   value:'2.8',  unit:'L',     reference:'≥ 3.5',       flag:'LOW'      },
    { parameter:'FEV1',                  value:'1.9',  unit:'L',     reference:'≥ 2.8',       flag:'LOW'      },
    { parameter:'FEV1/FVC',              value:'68',   unit:'%',     reference:'≥ 70',        flag:'LOW'      },
    { parameter:'TLC',                   value:'4.8',  unit:'L',     reference:'4.5–7.5',    flag:'NORMAL'   },
  ],
  'L-0095': [],
  'L-0096': [
    { parameter:'FVC',                   value:'2.6',  unit:'L',     reference:'≥ 3.5',       flag:'LOW'      },
    { parameter:'FEV1',                  value:'1.5',  unit:'L',     reference:'≥ 2.8',       flag:'LOW'      },
    { parameter:'FEV1/FVC',              value:'58',   unit:'%',     reference:'≥ 70',        flag:'LOW'      },
    { parameter:'DLCO',                  value:'62',   unit:'%pred', reference:'≥ 75',        flag:'LOW'      },
  ],
};

// ── Date helper: "Apr 26" → "2026-04-26" for range comparisons ───────────────
function shortDateToISO(d: string): string {
  const m: Record<string,string> = { Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12' };
  const [mon, day] = d.split(' ');
  return `2026-${m[mon] ?? '01'}-${(day ?? '01').padStart(2,'0')}`;
}


// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV: NavItem[] = [
  { id:'dashboard',     label:'Dashboard',        path:'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { id:'patients',      label:'Patients',         path:'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
  { id:'appointments',  label:'Appointments',     path:'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' },
  //{ id:'emr',           label:'Medical Records',  path:'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
  { id:'pharmacy',      label:'Pharmacy',         path:'M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
  { id:'lab',           label:'Lab & Diagnostics',path:'M6 2v6l2 2-6 10h16L12 10l2-2V2H6zm6 9.5L14.73 16H9.27L12 11.5zM10 4h4v3.17l1.17 1.17L12 12.5 8.83 8.34 10 7.17V4z' },
  { id:'inventory',     label:'Inventory',        path:'M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.58 1 13.5 3.08L12 4.58l-1.5-1.51C8.42 1 6 2.53 6 4.64c0 .48.11.92.18 1.36H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z' },
  { id:'analytics',     label:'Analytics',        path:'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z' },
  { id:'notifications', label:'Notifications',    path:'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z', badge: 5 },
  { id:'staff',   label:'Staff Management',      path:'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
  { id:'reviews', label:'Reviews & Feedback',    path:'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12l-3-3-3 3V6h6v8z' },
];

const MODULE_TITLES: Record<ModuleId, string> = {
  dashboard:'Dashboard', patients:'Patients', appointments:'Appointments',
  emr:'Medical Records', pharmacy:'Pharmacy', lab:'Lab & Diagnostics',
  inventory:'Inventory', analytics:'Analytics', notifications:'Notifications',
  staff:'Staff Management', reviews:'Reviews & Feedback',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) { return name.split(' ').map(n => n[0]).join(''); }

function statusColor(s: string): StatusColor {
  if (s === 'Critical' || s === 'STAT')                                          return 'rose';
  if (s === 'Monitoring' || s === 'Waiting' || s === 'Low' || s === 'Urgent')   return 'amber';
  if (s === 'In Progress' || s === 'Dispensed' || s === 'Complete')              return 'blue';
  if (s === 'Pending')                                                            return 'purple';
  if (s === 'Ready' || s === 'Stable' || s === 'OK')                            return 'primary';
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }} className="ha-stat-grid-4">
      <StatCard label="Total Patients"       value="1,248" sub="↑ 12 new today"     color="#0d9488" iconPath="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      <StatCard label="Today's Appointments" value="34"    sub="6 remaining"        color="#3b82f6" iconPath="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
      <StatCard label="Today's Revenue"      value="₹8,240" sub="↑ 8% vs yesterday" color="#d97706" iconPath="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
      <StatCard label="Pending Alerts"       value="12"    sub="3 critical"         color="#e11d48" iconPath="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 18 }} className="ha-grid-2-1">
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
              <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }} className="ha-grid-2-1">
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
      <div className="ha-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Today's Schedule</div>
          <button onClick={() => setModule('appointments')} style={{ fontSize: 12.5, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
        </div>
        {mockApptsDash.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < 4 ? 12 : 0, paddingBottom: i < 4 ? 12 : 0, borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 46, background: 'var(--primary-light)', borderRadius: 10, padding: '6px 4px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', lineHeight: 1.3 }}>
                {a.time.split(' ')[0]}<br /><span style={{ fontWeight: 400, fontSize: 9 }}>{a.time.split(' ')[1]}</span>
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
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [ptTab, setPtTab]       = useState<'overview' | 'prescriptions' | 'lab'>('overview');
  const inpStyle: React.CSSProperties = { width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', boxSizing:'border-box' };
  
  const filtered = useMemo(() =>
    PATIENTS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  if (selected) {
    const p   = selected;
    const ptRx  = PRESCRIPTIONS.filter(rx => rx.patient === p.name);
    const ptLab = LAB_ORDERS.filter(l  => l.patient  === p.name);

    const handlePatientPDF = () => {
      const rxRows  = ptRx.map(rx  => `<tr><td>${rx.id}</td><td>${rx.drug}</td><td>${rx.qty}</td><td>${rx.doctor}</td><td>${rx.date}</td><td>${rx.status}</td></tr>`).join('');
      const labRows = ptLab.map(l  => `<tr><td>${l.id}</td><td>${l.test}</td><td>${l.ordered}</td><td>${l.date}</td><td>${l.status}</td><td>${l.result || '—'}</td></tr>`).join('');
      const html = `<!DOCTYPE html><html><head><title>Patient Record — ${p.name}</title>
      <style>body{font-family:Arial,sans-serif;padding:28px;color:#1a2540;}h1{font-size:20px;}
      h2{font-size:14px;color:#0d9488;border-bottom:2px solid #e6faf8;padding-bottom:5px;margin-top:22px;margin-bottom:10px;}
      table{width:100%;border-collapse:collapse;font-size:12px;}
      th{background:#f4f8f7;padding:7px 10px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;}
      td{padding:8px 10px;border-bottom:1px solid #f0f0f0;}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;}
      .meta-item{background:#f4f8f7;border-radius:8px;padding:10px 12px;}
      .meta-lbl{font-size:10px;color:#64748b;text-transform:uppercase;margin-bottom:3px;}
      .meta-val{font-size:13px;font-weight:600;}
      .allergy{display:inline-block;background:#ffe4e6;color:#e11d48;border-radius:20px;padding:3px 10px;font-size:12px;font-weight:600;margin:2px;}
      .footer{margin-top:32px;color:#94a3b8;font-size:11px;border-top:1px solid #f0f0f0;padding-top:10px;}
      </style></head><body>
      <h1>Patient Medical Record</h1>
      <div class="meta">
        <div class="meta-item"><div class="meta-lbl">Name</div><div class="meta-val">${p.name}</div></div>
        <div class="meta-item"><div class="meta-lbl">Patient ID</div><div class="meta-val">${p.id}</div></div>
        <div class="meta-item"><div class="meta-lbl">Age / Gender</div><div class="meta-val">${p.age} yrs · ${p.gender==='F'?'Female':'Male'}</div></div>
        <div class="meta-item"><div class="meta-lbl">Blood Group</div><div class="meta-val">${p.blood}</div></div>
        <div class="meta-item"><div class="meta-lbl">Phone</div><div class="meta-val">${p.phone}</div></div>
        <div class="meta-item"><div class="meta-lbl">Total Visits</div><div class="meta-val">${p.visits} visits (Last: ${p.lastVisit})</div></div>
      </div>
      <h2>Allergies</h2>
      <div>${p.allergies.split(', ').map(a => `<span class="allergy">${a}</span>`).join('') || 'None known'}</div>
      <h2>Medical History</h2><p style="font-size:13px;color:#374151;line-height:1.7;">${p.history}</p>
      <h2>Prescriptions</h2>
      <table><thead><tr><th>Rx ID</th><th>Drug</th><th>Qty</th><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>${rxRows || '<tr><td colspan="6" style="color:#94a3b8">No prescriptions found</td></tr>'}</tbody></table>
      <h2>Lab Reports</h2>
      <table><thead><tr><th>Lab ID</th><th>Test</th><th>Ordered By</th><th>Date</th><th>Status</th><th>Result</th></tr></thead>
      <tbody>${labRows || '<tr><td colspan="6" style="color:#94a3b8">No lab orders found</td></tr>'}</tbody></table>
      <div class="footer">Vexoo · Generated on ${new Date().toLocaleDateString('en-IN')} · Confidential</div>
      </body></html>`;
      const w = window.open('', '_blank');
      if (w) { w.document.write(html); w.document.close(); w.print(); }
    };

    const tabBtnStyle = (active: boolean): React.CSSProperties => ({
      padding:'7px 18px', borderRadius:9, border:'none', cursor:'pointer',
      fontFamily:'inherit', fontSize:13, fontWeight:active?700:500,
      background:active?'var(--primary)':'transparent',
      color:active?'white':'var(--text-muted)',
      boxShadow:active?'none':'none',
    });

    return (
      <>
      <div className="ha-content ha-fade">
        {/* ── Header row ── */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button onClick={() => setSelected(null)} style={{ background:'#f1f5f9', border:'none', borderRadius:8, padding:'6px 14px', fontSize:13, cursor:'pointer', fontFamily:'inherit', fontWeight:500 }}>← Back</button>
          <span style={{ color:'var(--text-muted)', fontSize:13 }}>Patients / <strong>{p.name}</strong></span>
          <div style={{ marginLeft:'auto' }}>
            <button onClick={handlePatientPDF} style={{ display:'flex', alignItems:'center', gap:7, background:'var(--primary)', color:'white', border:'none', borderRadius:9, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={14} color="white" />
              Export PDF
            </button>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div style={{ display:'flex', gap:4, marginBottom:20, background:'var(--bg)', borderRadius:11, padding:4, width:'fit-content', border:'1px solid var(--border)' }}>
          {(['overview','prescriptions','lab'] as const).map(t => (
            <button key={t} onClick={() => setPtTab(t)} style={tabBtnStyle(ptTab===t)}>
              {t==='overview' ? 'Overview' : t==='prescriptions' ? `Prescriptions (${ptRx.length})` : `Lab Reports (${ptLab.length})`}
            </button>
          ))}
        </div>

        {/* ════ OVERVIEW TAB ════ */}
        {ptTab === 'overview' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:20 }}>
            {/* Left: patient info */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="ha-card">
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:10 }}>
                  <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:700, color:'var(--primary)' }}>{initials(p.name)}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16 }}>{p.name}</div>
                    <div style={{ fontSize:12.5, color:'var(--text-muted)' }}>{p.id}</div>
                  </div>
                  <Badge label={p.status} color={statusColor(p.status)} />
                </div>
                <div style={{ borderTop:'1px solid var(--border)', marginTop:16, paddingTop:16, display:'flex', flexDirection:'column', gap:10 }}>
                  {([
                    ['Age',`${p.age} years`],['Gender',p.gender==='F'?'Female':'Male'],
                    ['Blood Type',p.blood],['Phone',p.phone],['Email',p.email],
                    ['Last Visit',p.lastVisit],['Total Visits',String(p.visits)],
                  ] as [string,string][]).map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:12, color:'var(--text-muted)' }}>{k}</span>
                      <span style={{ fontSize:12.5, fontWeight:k==='Total Visits'?700:500, color:k==='Total Visits'?'var(--primary)':'var(--text)' }}>{v}{k==='Total Visits'?' visits':''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: medical content */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Vitals */}
              <div className="ha-card">
                <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Medical Summary</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:14 }}>
                  {([['Primary Condition',p.condition,'var(--primary-light)','var(--primary)'],
                     ['Blood Pressure','128/82 mmHg','var(--blue-light)','var(--blue)'],
                     ['Heart Rate','74 bpm','var(--green-light)','var(--green)']] as [string,string,string,string][]).map(([l,v,bg,c]) => (
                    <div key={l} style={{ background:bg, borderRadius:12, padding:'12px 14px' }}>
                      <div style={{ fontSize:11, color:c, fontWeight:600, marginBottom:4 }}>{l}</div>
                      <div style={{ fontSize:14, fontWeight:700 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7 }}>
                  Patient presents with well-managed {p.condition.toLowerCase()}. Recent lab results show stable trends. Medication compliance reported as good.
                </div>
              </div>

              {/* Allergies */}
              <div className="ha-card" style={{ borderLeft:'4px solid var(--rose)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:18 }}>⚠</span>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--rose)' }}>Known Allergies</div>
                </div>
                {p.allergies === 'None known'
                  ? <div style={{ fontSize:13.5, color:'var(--text-muted)', background:'var(--green-light)', padding:'8px 14px', borderRadius:9 }}>✓ No known drug or substance allergies</div>
                  : <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {p.allergies.split(', ').map(a => (
                        <span key={a} style={{ fontSize:13, fontWeight:600, padding:'5px 14px', borderRadius:20, background:'var(--rose-light)', color:'var(--rose)', border:'1px solid #fca5a5' }}>{a}</span>
                      ))}
                    </div>
                }
              </div>

              {/* Medical history */}
              <div className="ha-card">
                <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Medical History</div>
                <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.8, background:'var(--bg)', padding:'12px 16px', borderRadius:10, border:'1px solid var(--border)' }}>
                  {p.history}
                </div>
              </div>

              {/* Active medications */}
              <div className="ha-card">
                <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Active Medications</div>
                {(['Lisinopril 10mg · Once daily, morning','Hydrochlorothiazide 12.5mg · Once daily','Aspirin 81mg · Once daily'] as string[]).map(m => (
                  <div key={m} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'var(--bg)', borderRadius:10, marginBottom:8 }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{m.split(' · ')[0]}</div>
                      <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{m.split(' · ')[1]}</div>
                    </div>
                    <Badge label="Ongoing" color="primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ PRESCRIPTIONS TAB ════ */}
        {ptTab === 'prescriptions' && (
          <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', fontWeight:700, fontSize:15, borderBottom:'1px solid var(--border)' }}>
              Prescriptions — {p.name}
            </div>
            {ptRx.length === 0
              ? <div style={{ padding:'48px 20px', textAlign:'center', color:'var(--text-muted)' }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>💊</div>
                  <div style={{ fontWeight:700, fontSize:15 }}>No prescriptions found for this patient</div>
                </div>
              : <table className="ha-table" style={{ width:'100%' }}>
                  <thead><tr>{['Rx ID','Drug / Dosage','Qty','Prescribed By','Date','Status'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
                  <tbody>
                    {ptRx.map((rx, i) => (
                      <tr key={rx.id} className="ha-tr" style={{ borderBottom:i<ptRx.length-1?'1px solid var(--border)':'none' }}>
                        <Td><span style={{ fontWeight:600, color:'var(--primary)' }}>{rx.id}</span></Td>
                        <Td style={{ fontWeight:500 }}>{rx.drug}</Td>
                        <Td>{rx.qty}</Td>
                        <Td style={{ color:'var(--text-muted)' }}>{rx.doctor}</Td>
                        <Td style={{ color:'var(--text-muted)' }}>{rx.date}</Td>
                        <Td><Badge label={rx.status} color={statusColor(rx.status)} /></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}

        {/* ════ LAB REPORTS TAB ════ */}
        {ptTab === 'lab' && (
          <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', fontWeight:700, fontSize:15, borderBottom:'1px solid var(--border)' }}>
              Lab Reports — {p.name}
            </div>
            {ptLab.length === 0
              ? <div style={{ padding:'48px 20px', textAlign:'center', color:'var(--text-muted)' }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>🧪</div>
                  <div style={{ fontWeight:700, fontSize:15 }}>No lab orders found for this patient</div>
                </div>
              : <table className="ha-table" style={{ width:'100%' }}>
                  <thead><tr>{['Lab ID','Test','Ordered By','Date','Priority','Status','Result'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
                  <tbody>
                    {ptLab.map((l, i) => (
                      <tr key={l.id} className="ha-tr" style={{ borderBottom:i<ptLab.length-1?'1px solid var(--border)':'none', background:l.priority==='STAT'?'#fff8f8':undefined }}>
                        <Td><span style={{ fontWeight:600, color:'var(--primary)' }}>{l.id}</span></Td>
                        <Td style={{ fontWeight:500 }}>{l.test}</Td>
                        <Td style={{ color:'var(--text-muted)' }}>{l.ordered}</Td>
                        <Td style={{ color:'var(--text-muted)' }}>{l.date}</Td>
                        <Td><Badge label={l.priority} color={statusColor(l.priority)} /></Td>
                        <Td><Badge label={l.status} color={statusColor(l.status)} /></Td>
                        <Td style={{ fontSize:12.5, color:'var(--text-muted)' }}>{l.result || '—'}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            }
          </div>
        )}
      </div>
      </>
    );
  }

  return (
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Patients</div>
          <div className="ha-section-sub">{PATIENTS.length} registered patients</div>
        </div>
        <button className="ha-action-btn" onClick={() => setShowAdd(true)}>
          <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
          New Patient
        </button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="ha-search-input-wrap">
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" size={15} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, or condition..." />
        </div>
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
      {showAdd && (
        <>
          <div onClick={() => setShowAdd(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
          <div style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
            <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
              <div style={{ fontWeight:800, fontSize:17 }}>Register New Patient</div>
              <button onClick={() => setShowAdd(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:12.5, fontFamily:'inherit' }}>✕ Close</button>
            </div>
            <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>First Name *</div><input style={inpStyle} placeholder="First name" /></div>
                <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Last Name *</div><input style={inpStyle} placeholder="Last name" /></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Date of Birth *</div><input style={inpStyle} type="date" /></div>
                <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Gender</div><select style={{...inpStyle, cursor:'pointer'}}><option>Male</option><option>Female</option><option>Other</option></select></div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Phone *</div><input style={inpStyle} placeholder="+91 XXXXX XXXXX" /></div>
                <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Blood Group</div><select style={{...inpStyle, cursor:'pointer'}}>{['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b}>{b}</option>)}</select></div>
              </div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Email</div><input style={inpStyle} type="email" placeholder="patient@email.com" /></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Address</div><input style={inpStyle} placeholder="Street, City, State" /></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Emergency Contact Name</div><input style={inpStyle} placeholder="Guardian / Next of kin" /></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Emergency Contact Phone</div><input style={inpStyle} placeholder="+91 XXXXX XXXXX" /></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Known Allergies</div><input style={inpStyle} placeholder="e.g. Penicillin, Sulfonamides" /></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Assign Doctor</div><select style={{...inpStyle, cursor:'pointer'}}><option>— Select Doctor —</option><option>Dr. Amy Chen · Cardiologist</option><option>Dr. Raj Patel · Endocrinologist</option></select></div>
            </div>
            <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
              <button className="ha-action-btn" style={{ flex:1, justifyContent:'center' }} onClick={() => setShowAdd(false)}>Register Patient</button>
              <button onClick={() => setShowAdd(false)} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Module: Appointments

const APPT_PAGE_SIZE = 10;

function ApptPagination({ page, total, onChange }: { page:number; total:number; onChange:(p:number)=>void }) {
  const totalPages = Math.ceil(total / APPT_PAGE_SIZE);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', borderTop:'1px solid var(--border)', background:'var(--bg)', borderRadius:'0 0 16px 16px' }}>
      <span style={{ fontSize:13, color:'var(--text-muted)' }}>
        Showing {(page-1)*APPT_PAGE_SIZE + 1}–{Math.min(page*APPT_PAGE_SIZE, total)} of {total} appointments
      </span>
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        <button onClick={() => onChange(page-1)} disabled={page===1}
          style={{ padding:'5px 14px', borderRadius:8, border:'1px solid var(--border)', background:page===1?'var(--bg)':'white', cursor:page===1?'default':'pointer', fontSize:13, fontFamily:'inherit', color:page===1?'var(--text-muted)':'var(--text)', opacity:page===1?0.5:1 }}>
          ← Prev
        </button>
        {pages.map(p => (
          <button key={p} onClick={() => onChange(p)}
            style={{ width:34, height:34, borderRadius:8, border:'none', background:p===page?'var(--primary)':'transparent', cursor:'pointer', fontSize:13, fontFamily:'inherit', fontWeight:p===page?700:400, color:p===page?'white':'var(--text)' }}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(page+1)} disabled={page===totalPages}
          style={{ padding:'5px 14px', borderRadius:8, border:'1px solid var(--border)', background:page===totalPages?'var(--bg)':'white', cursor:page===totalPages?'default':'pointer', fontSize:13, fontFamily:'inherit', color:page===totalPages?'var(--text-muted)':'var(--text)', opacity:page===totalPages?0.5:1 }}>
          Next →
        </button>
      </div>
    </div>
  );
}

// Base Monday for week calculations
const APPT_BASE_MONDAY = new Date('2026-04-20T00:00:00');
const TODAY_ISO = '2026-04-26';

function apptAddDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}
function apptIso(d: Date): string {
  return d.toISOString().split('T')[0];
}
function apptFmtDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

const AppointmentsModule: React.FC = () => {
  const [mainTab,     setMainTab]     = useState<'schedule' | 'history'>('schedule');
  const [weekOffset,  setWeekOffset]  = useState(0);
  const [activeDay,   setActiveDay]   = useState(6); // 0=Mon ... 6=Sun
  const [schedPage,   setSchedPage]   = useState(1);
  const [histStatus,  setHistStatus]  = useState<'All' | 'Completed' | 'No-Show'>('All');
  const [histDoctor,  setHistDoctor]  = useState('All Doctors');
  const [histDateFrom,setHistDateFrom]= useState('');
  const [histDateTo,  setHistDateTo]  = useState('');
  const [histPage,    setHistPage]    = useState(1);
  const [showFlyout,  setShowFlyout]  = useState(false);

  // ── Week computation ─────────────────────────────────────────────────────────
  const weekStart = apptAddDays(APPT_BASE_MONDAY, weekOffset * 7);
  const weekDays  = Array.from({ length: 7 }, (_, i) => apptAddDays(weekStart, i));
  const DAY_LABELS= ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  const selectedISO = apptIso(weekDays[activeDay]);
  const isToday     = selectedISO === TODAY_ISO;
  const isPast      = selectedISO < TODAY_ISO;

  // ── Schedule tab: appointments for selected day ───────────────────────────────
  const dayAppts    = useMemo(() =>
    APPOINTMENTS.filter(a => a.isoDate === selectedISO)
  , [selectedISO]);
  const schedSlice  = dayAppts.slice((schedPage-1)*APPT_PAGE_SIZE, schedPage*APPT_PAGE_SIZE);
  const dayCounts   = useMemo(() =>
    weekDays.map(d => APPOINTMENTS.filter(a => a.isoDate === apptIso(d)).length)
  , [weekOffset]);

  // ── History tab: completed + no-show with filters ────────────────────────────
  const histAppts = useMemo(() =>
    APPOINTMENTS.filter(a => {
      if (a.status !== 'Completed' && a.status !== 'No-Show') return false;
      if (histStatus !== 'All'         && a.status  !== histStatus)  return false;
      if (histDoctor !== 'All Doctors' && a.doctor  !== histDoctor)  return false;
      if (histDateFrom && a.isoDate < histDateFrom) return false;
      if (histDateTo   && a.isoDate > histDateTo)   return false;
      return true;
    }).sort((a, b) => b.isoDate.localeCompare(a.isoDate))
  , [histStatus, histDoctor, histDateFrom, histDateTo]);
  const histSlice = histAppts.slice((histPage-1)*APPT_PAGE_SIZE, histPage*APPT_PAGE_SIZE);
  const histDoctors = ['All Doctors', ...Array.from(new Set(APPOINTMENTS.map(a => a.doctor)))];

  // Reset page when filters change
  useEffect(() => { setHistPage(1); }, [histStatus, histDoctor, histDateFrom, histDateTo]);
  useEffect(() => { setSchedPage(1); }, [selectedISO]);

  // ── Summary counts for selected day ─────────────────────────────────────────
  const summaryCounts = useMemo(() => ({
    total:      dayAppts.length,
    confirmed:  dayAppts.filter(a => a.status==='Confirmed').length,
    inProgress: dayAppts.filter(a => a.status==='In Progress').length,
    pending:    dayAppts.filter(a => a.status==='Pending').length,
    waiting:    dayAppts.filter(a => a.status==='Waiting').length,
    completed:  dayAppts.filter(a => a.status==='Completed').length,
  }), [dayAppts]);

  // ── Export handler ──────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = histAppts.map(a =>
      `<tr><td>${a.id}</td><td>${a.patient}</td><td>${a.doctor}</td><td>${a.type}</td><td>${a.date}</td><td>${a.time}</td><td>${a.room}</td><td>${a.status}</td></tr>`
    ).join('');
    const html = `<!DOCTYPE html><html><head><title>Appointment History — Vexoo</title>
    <style>body{font-family:Arial,sans-serif;padding:28px;color:#1a2540;}h1{font-size:20px;}
    table{width:100%;border-collapse:collapse;font-size:12px;margin-top:16px;}
    th{background:#f4f8f7;padding:7px 10px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;border-bottom:2px solid #e4e8f0;}
    td{padding:8px 10px;border-bottom:1px solid #f0f0f0;}
    .filter{background:#fffef5;border:1px solid #fde68a;border-radius:8px;padding:10px 14px;margin-bottom:16px;font-size:13px;}
    .footer{margin-top:32px;color:#94a3b8;font-size:11px;border-top:1px solid #f0f0f0;padding-top:10px;}
    </style></head><body>
    <h1>Appointment History Export — Vexoo</h1>
    <div class="filter">
      <strong>Filters Applied:</strong>
      Status: ${histStatus} &nbsp;|&nbsp;
      Doctor: ${histDoctor} &nbsp;|&nbsp;
      From: ${histDateFrom || 'All'} &nbsp;|&nbsp;
      To: ${histDateTo || 'All'} &nbsp;|&nbsp;
      Total Records: ${histAppts.length}
    </div>
    <table>
      <thead><tr><th>Appt ID</th><th>Patient</th><th>Doctor</th><th>Type</th><th>Date</th><th>Time</th><th>Room</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="footer">Exported from Vexoo · ${new Date().toLocaleDateString('en-IN')} · Confidential</div>
    </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  const inpStyle: React.CSSProperties = {
    width:'100%', padding:'9px 12px', border:'1px solid var(--border)',
    borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit',
    background:'var(--bg)', color:'var(--text)', boxSizing:'border-box',
  };
  const selStyle: React.CSSProperties = {
    padding:'7px 28px 7px 12px', borderRadius:9, border:'1px solid var(--border)',
    background:'var(--bg)', fontSize:12.5, fontWeight:500, cursor:'pointer',
    fontFamily:'inherit', color:'var(--text)', outline:'none', appearance:'none',
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center',
  };

  return (
    <>
    <div className="ha-content ha-fade">
      {/* ── Page header ── */}
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Appointments</div>
          <div className="ha-section-sub">
            {mainTab === 'schedule'
              ? `${apptFmtDate(weekDays[activeDay])}${isToday ? ' — Today' : ''}`
              : 'Past appointments — Completed & No-Show'}
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {/* Main tab switcher */}
          <div style={{ display:'flex', background:'var(--bg)', borderRadius:9, padding:3, border:'1px solid var(--border)', gap:2 }}>
            {(['schedule','history'] as const).map(t => (
              <button key={t} onClick={() => setMainTab(t)}
                style={{ padding:'6px 16px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:mainTab===t?700:400, background:mainTab===t?'white':'transparent', color:mainTab===t?'var(--text)':'var(--text-muted)', boxShadow:mainTab===t?'0 1px 4px rgba(0,0,0,0.1)':'none' }}>
                {t === 'schedule' ? 'Schedule' : 'Appointment History'}
              </button>
            ))}
          </div>
          {mainTab === 'schedule' && (
            <button className="ha-action-btn" onClick={() => setShowFlyout(true)}>
              <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
              New Appointment
            </button>
          )}
          {mainTab === 'history' && (
            <button onClick={handleExport} style={{ display:'flex', alignItems:'center', gap:7, background:'var(--card)', color:'var(--text-muted)', border:'1px solid var(--border)', borderRadius:9, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={14} color="currentColor" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════ SCHEDULE TAB ══════════════════════════════════ */}
      {mainTab === 'schedule' && (
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

            {/* Week picker with navigation */}
            <div className="ha-card" style={{ padding:'16px 20px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <button onClick={() => { setWeekOffset(o => o-1); setActiveDay(0); setSchedPage(1); }}
                  style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:13, fontFamily:'inherit', color:'var(--text-muted)' }}>
                  ← Prev Week
                </button>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:13.5, fontWeight:700 }}>
                    {apptFmtDate(weekStart)} — {apptFmtDate(weekDays[6])}
                  </div>
                  {weekOffset !== 0 && (
                    <button onClick={() => { setWeekOffset(0); setActiveDay(6); setSchedPage(1); }}
                      style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'var(--primary)', fontFamily:'inherit', fontWeight:600, marginTop:2 }}>
                      Back to Today
                    </button>
                  )}
                </div>
                <button onClick={() => { setWeekOffset(o => o+1); setActiveDay(0); setSchedPage(1); }}
                  style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:13, fontFamily:'inherit', color:'var(--text-muted)' }}>
                  Next Week →
                </button>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {weekDays.map((d, i) => {
                  const iso  = apptIso(d);
                  const cnt  = dayCounts[i];
                  const isTd = iso === TODAY_ISO;
                  const sel  = i === activeDay;
                  return (
                    <div key={i} onClick={() => { setActiveDay(i); setSchedPage(1); }}
                      style={{ flex:1, textAlign:'center', padding:'10px 4px', borderRadius:12, background: sel?'var(--primary)':isTd?'var(--primary-light)':'transparent', cursor:'pointer', border: isTd&&!sel?'1.5px solid var(--primary)':'1.5px solid transparent', position:'relative' }}>
                      <div style={{ fontSize:11, color: sel?'rgba(255,255,255,0.75)':isTd?'var(--primary)':'var(--text-muted)', fontWeight:500, marginBottom:3 }}>{DAY_LABELS[i]}</div>
                      <div style={{ fontWeight:700, fontSize:14, color: sel?'white':isTd?'var(--primary)':'var(--text)' }}>
                        {d.toLocaleDateString('en-IN',{month:'short',day:'numeric'})}
                      </div>
                      <div style={{ marginTop:5, fontSize:10, color: sel?'rgba(255,255,255,0.75)':cnt>0?'var(--primary)':'var(--text-muted)', fontWeight:cnt>0?700:400 }}>
                        {cnt > 0 ? `${cnt} appts` : 'None'}
                      </div>
                      {isTd && !sel && <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--primary)', position:'absolute', bottom:6, left:'50%', transform:'translateX(-50%)' }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Appointment list for selected day */}
            <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ padding:'14px 20px 12px', fontWeight:700, fontSize:15, borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span>
                  {apptFmtDate(weekDays[activeDay])}
                  {isToday && <span style={{ marginLeft:8, fontSize:11, fontWeight:700, padding:'2px 9px', borderRadius:20, background:'var(--primary)', color:'white' }}>TODAY</span>}
                  {isPast  && <span style={{ marginLeft:8, fontSize:11, fontWeight:700, padding:'2px 9px', borderRadius:20, background:'var(--amber-light)', color:'var(--amber)' }}>PAST DATE</span>}
                </span>
                <span style={{ fontSize:12.5, fontWeight:400, color:'var(--text-muted)' }}>{dayAppts.length} appointments</span>
              </div>

              {dayAppts.length === 0 ? (
                <div style={{ padding:'48px 20px', textAlign:'center', color:'var(--text-muted)' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>📅</div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>No appointments</div>
                  <div style={{ fontSize:13 }}>No appointments scheduled for this date.</div>
                </div>
              ) : (
                <>
                  {schedSlice.map((a, i) => (
                    <div key={a.id} style={{ display:'flex', alignItems:'center', gap:16, padding:'13px 20px', borderBottom: i < schedSlice.length-1?'1px solid var(--border)':'none', cursor:'pointer' }}>
                      <div style={{ width:52, textAlign:'center', flexShrink:0 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:'var(--primary)' }}>{a.time.split(' ')[0]}</div>
                        <div style={{ fontSize:10.5, color:'var(--text-muted)' }}>{a.time.split(' ')[1]}</div>
                      </div>
                      <div style={{ width:1, height:36, background:'var(--border)', flexShrink:0 }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, fontSize:13.5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.patient}</div>
                        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.doctor} · {a.type} · {a.room}</div>
                      </div>
                      <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                        <span style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'monospace' }}>{a.id}</span>
                        <Badge label={a.status} color={statusColor(a.status)} />
                      </div>
                    </div>
                  ))}
                  <ApptPagination page={schedPage} total={dayAppts.length} onChange={setSchedPage} />
                </>
              )}
            </div>
          </div>

          {/* Right summary */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="ha-card">
              <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>
                {isToday ? "Today's" : isPast ? 'Day'  : "Day's"} Summary
              </div>
              {([
                ['Total',       String(summaryCounts.total),      'var(--primary-light)', 'var(--primary)'],
                ['Confirmed',   String(summaryCounts.confirmed),  'var(--blue-light)',    'var(--blue)'   ],
                ['In Progress', String(summaryCounts.inProgress), 'var(--amber-light)',   'var(--amber)'  ],
                ['Waiting',     String(summaryCounts.waiting),    'var(--purple-light)',  'var(--purple)' ],
                ['Pending',     String(summaryCounts.pending),    'var(--rose-light)',    'var(--rose)'   ],
                ['Completed',   String(summaryCounts.completed),  'var(--green-light)',   'var(--green)'  ],
              ] as [string,string,string,string][]).map(([l,v,bg,c]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 12px', background:bg, borderRadius:10, marginBottom:8 }}>
                  <span style={{ fontSize:13, color:c, fontWeight:500 }}>{l}</span>
                  <span style={{ fontWeight:700, fontSize:17, color:c }}>{v}</span>
                </div>
              ))}
            </div>
            {isPast && dayAppts.some(a => a.status==='No-Show') && (
              <div className="ha-card" style={{ background:'var(--rose-light)', border:'1px solid var(--rose)' }}>
                <div style={{ fontWeight:700, fontSize:13, color:'var(--rose)', marginBottom:6 }}>⚠ No-Shows on this date</div>
                <div style={{ fontSize:12.5, color:'var(--rose)' }}>{dayAppts.filter(a => a.status==='No-Show').length} patient(s) did not attend. Check History tab for details.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════ HISTORY TAB ══════════════════════════════════ */}
      {mainTab === 'history' && (
        <div>
          {/* History KPI strip */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:16 }}>
            {([
              ['Total History Records', String(APPOINTMENTS.filter(a=>a.status==='Completed'||a.status==='No-Show').length), 'var(--text)',  'var(--bg)'         ],
              ['Completed',            String(APPOINTMENTS.filter(a=>a.status==='Completed').length),                        'var(--green)', 'var(--green-light)'],
              ['No-Show',              String(APPOINTMENTS.filter(a=>a.status==='No-Show').length),                          'var(--rose)',  'var(--rose-light)' ],
            ] as [string,string,string,string][]).map(([l,v,c,bg]) => (
              <div key={l} className="ha-card" style={{ background:bg, border:'none', textAlign:'center', padding:'14px 16px' }}>
                <div style={{ fontSize:11, color:c, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Sub-tab + filters row */}
          <div className="ha-card" style={{ marginBottom:16, padding:'14px 20px' }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
              {/* Status sub-tabs */}
              <div style={{ display:'flex', background:'var(--bg)', borderRadius:9, padding:3, border:'1px solid var(--border)', gap:2 }}>
                {(['All','Completed','No-Show'] as const).map(s => (
                  <button key={s} onClick={() => { setHistStatus(s); setHistPage(1); }}
                    style={{ padding:'5px 14px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:12.5, fontWeight:histStatus===s?700:400, background:histStatus===s?'white':'transparent', color:histStatus===s?'var(--text)':'var(--text-muted)', boxShadow:histStatus===s?'0 1px 4px rgba(0,0,0,0.1)':'none' }}>
                    {s}
                    {s !== 'All' && (
                      <span style={{ marginLeft:6, fontSize:10, fontWeight:800, padding:'1px 6px', borderRadius:20, background:histStatus===s?(s==='Completed'?'var(--green)':'var(--rose)'):'var(--border)', color:histStatus===s?'white':'var(--text-muted)' }}>
                        {APPOINTMENTS.filter(a=>a.status===s).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Doctor filter */}
              <select value={histDoctor} onChange={e => { setHistDoctor(e.target.value); setHistPage(1); }} style={selStyle}>
                {histDoctors.map(d => <option key={d}>{d}</option>)}
              </select>

              {/* Date range */}
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>From</span>
                <input type="date" value={histDateFrom} onChange={e => { setHistDateFrom(e.target.value); setHistPage(1); }}
                  style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
                <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>To</span>
                <input type="date" value={histDateTo} onChange={e => { setHistDateTo(e.target.value); setHistPage(1); }}
                  style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
                {(histDateFrom || histDateTo) && (
                  <button onClick={() => { setHistDateFrom(''); setHistDateTo(''); }} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--rose)', fontSize:12.5, fontWeight:700, fontFamily:'inherit' }}>✕ Clear</button>
                )}
              </div>

              <span style={{ fontSize:12.5, color:'var(--text-muted)', marginLeft:'auto' }}>
                {histAppts.length} record{histAppts.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* History list */}
          <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px 12px', fontWeight:700, fontSize:15, borderBottom:'1px solid var(--border)' }}>
              Appointment History
            </div>

            {histAppts.length === 0 ? (
              <div style={{ padding:'48px 20px', textAlign:'center', color:'var(--text-muted)' }}>
                <div style={{ fontSize:36, marginBottom:10 }}>🗂</div>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>No records found</div>
                <div style={{ fontSize:13 }}>Adjust the filters above to see appointment history.</div>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div style={{ display:'grid', gridTemplateColumns:'90px 1fr 130px 120px 90px 90px 100px', gap:0, padding:'8px 20px', background:'var(--bg)', borderBottom:'1px solid var(--border)' }}>
                  {['Appt ID','Patient / Doctor','Visit Type','Date','Time','Room','Status'].map(h => (
                    <div key={h} style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</div>
                  ))}
                </div>
                {histSlice.map((a, i) => (
                  <div key={a.id} style={{ display:'grid', gridTemplateColumns:'90px 1fr 130px 120px 90px 90px 100px', gap:0, padding:'12px 20px', borderBottom: i < histSlice.length-1?'1px solid var(--border)':'none', alignItems:'center' }}>
                    <div style={{ fontSize:12, fontFamily:'monospace', color:'var(--text-muted)', fontWeight:500 }}>{a.id}</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13.5 }}>{a.patient}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.doctor}</div>
                    </div>
                    <div style={{ fontSize:13 }}>{a.type}</div>
                    <div style={{ fontSize:13, fontWeight:500 }}>{a.date}</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)' }}>{a.time}</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)' }}>{a.room}</div>
                    <div>
                      <Badge
                        label={a.status}
                        color={a.status==='Completed'?'green':a.status==='No-Show'?'rose':'gray'}
                      />
                    </div>
                  </div>
                ))}
                <ApptPagination page={histPage} total={histAppts.length} onChange={setHistPage} />
              </>
            )}
          </div>
        </div>
      )}
    </div>

    {/* ── New Appointment Flyout — outside ha-fade to fix position:fixed ── */}
    {showFlyout && (
      <>
        <div onClick={() => setShowFlyout(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
        <div style={{ position:'fixed', right:0, top:0, bottom:0, width:460, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:18 }}>New Appointment</div>
              <div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>Fill in the details to schedule</div>
            </div>
            <button onClick={() => setShowFlyout(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 13px', cursor:'pointer', fontSize:13, fontFamily:'inherit', color:'var(--text-muted)' }}>✕ Close</button>
          </div>
          <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:18 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Patient Name *</div>
              <input style={inpStyle} placeholder="Search or enter patient name..." />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Date *</div>
                <input style={inpStyle} type="date" defaultValue="2026-04-26" />
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Time *</div>
                <input style={inpStyle} type="time" defaultValue="09:00" />
              </div>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Doctor *</div>
              <select style={{ ...inpStyle, cursor:'pointer' }}>
                <option value="">— Select Doctor —</option>
                <option>Dr. Amy Chen · Cardiologist</option>
                <option>Dr. Raj Patel · Endocrinologist</option>
                <option>Dr. Yeon Kim · General Physician</option>
                <option>Dr. Arjun Mehta · Neurologist</option>
                <option>Dr. Priya Sundar · Paediatrician</option>
                <option>Dr. Suman Rao · Orthopaedic Surgeon</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Visit Type</div>
              <select style={{ ...inpStyle, cursor:'pointer' }}>
                <option>Consultation</option><option>Follow-Up</option><option>Check-Up</option>
                <option>Procedure</option><option>Lab Review</option><option>Emergency</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Duration</div>
              <select style={{ ...inpStyle, cursor:'pointer' }}>
                <option>15 minutes</option><option>20 minutes</option><option>30 minutes</option>
                <option>45 minutes</option><option>60 minutes</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Notes (optional)</div>
              <textarea style={{ ...inpStyle, resize:'vertical', minHeight:80 }} placeholder="Any special instructions or reason for visit..." />
            </div>
          </div>
          <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
            <button className="ha-action-btn" style={{ flex:1, justifyContent:'center' }} onClick={() => setShowFlyout(false)}>
              <SvgIcon path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" size={15} color="white" />
              Schedule Appointment
            </button>
            <button onClick={() => setShowFlyout(false)} style={{ padding:'10px 20px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, color:'var(--text-muted)' }}>Cancel</button>
          </div>
        </div>
      </>
    )}
    </>
  );
};
// ─── Module: EMR ──────────────────────────────────────────────────────────────

const EMR_ALLERGIES: Record<string, string> = {
  'P-001': 'Penicillin, Sulfonamides',
  'P-002': 'None known',
  'P-003': 'Aspirin (mild)',
  'P-004': 'Warfarin (GI bleed risk)',
  'P-005': 'None known',
  'P-006': 'Beta-blockers',
  'P-007': 'None known',
  'P-008': 'Codeine',
};

const EMRModule: React.FC = () => {
  const [selId,  setSelId]  = useState('P-001');
  const [search, setSearch] = useState('');

  const filteredPts = useMemo(() =>
    PATIENTS.filter(pt =>
      pt.name.toLowerCase().includes(search.toLowerCase()) ||
      pt.id.toLowerCase().includes(search.toLowerCase()) ||
      pt.phone.includes(search)
    ), [search]);

  const p = PATIENTS.find(pt => pt.id === selId) ?? PATIENTS[0];

  const handleDownload = () => {
    const html = `<!DOCTYPE html><html><head><title>Medical Record — ${p.name}</title>
    <style>body{font-family:Arial,sans-serif;padding:32px;color:#1a2540;}h1{font-size:22px;}h2{font-size:15px;color:#0d9488;border-bottom:1px solid #e4e8f0;padding-bottom:6px;margin-top:24px;}table{width:100%;border-collapse:collapse;margin-top:8px;}td{padding:6px 10px;border-bottom:1px solid #f0f0f0;font-size:13px;}.label{color:#64748b;width:140px;}.val{font-weight:600;}.badge{display:inline-block;padding:2px 10px;border-radius:20px;background:#e6faf8;color:#0d9488;font-size:12px;font-weight:700;}</style>
    </head><body>
    <h1>Medical Record — ${p.name}</h1>
    <span class="badge">${p.status}</span><br/>
    <h2>Patient Information</h2>
    <table><tr><td class="label">Patient ID</td><td class="val">${p.id}</td></tr>
    <tr><td class="label">Age / Gender</td><td class="val">${p.age} yrs · ${p.gender === 'F' ? 'Female' : 'Male'}</td></tr>
    <tr><td class="label">Blood Group</td><td class="val">${p.blood}</td></tr>
    <tr><td class="label">Phone</td><td class="val">${p.phone}</td></tr>
    <tr><td class="label">Email</td><td class="val">${p.email}</td></tr>
    <tr><td class="label">Last Visit</td><td class="val">${p.lastVisit}</td></tr>
    <tr><td class="label">Total Visits</td><td class="val">${p.visits}</td></tr></table>
    <h2>Vitals</h2>
    <table><tr><td class="label">Blood Pressure</td><td class="val">128/82 mmHg</td></tr>
    <tr><td class="label">Heart Rate</td><td class="val">74 bpm</td></tr>
    <tr><td class="label">O₂ Saturation</td><td class="val">98%</td></tr></table>
    <h2>Known Allergies</h2><p>${p.allergies}</p>
    <h2>Medical History</h2><p>${p.history}</p>
    <h2>Primary Condition</h2><p>${p.condition}</p>
    <p style="margin-top:32px;color:#94a3b8;font-size:11px;">Generated by Vexoo · ${new Date().toLocaleDateString('en-IN')}</p>
    </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Electronic Medical Records</div>
          <div className="ha-section-sub">Viewing: {p.name} · {p.id}</div>
        </div>
        <button
          onClick={handleDownload}
          style={{ display:'flex', alignItems:'center', gap:7, background:'var(--primary)', color:'white', border:'none', borderRadius:9, padding:'8px 18px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
          <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={15} color="white" />
          Download PDF
        </button>
      </div>

      {/* ── Search bar ── */}
      <div style={{ marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
        <div className="ha-search-input-wrap" style={{ flex:1 }}>
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" size={15} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Patient Name, Patient ID, or Phone number..." />
        </div>
        {search && (
          <button onClick={() => setSearch('')} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'6px 12px', fontSize:12.5, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)' }}>
            Clear
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }} className="ha-emr-layout">

        {/* ── Patient list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY:'auto', maxHeight:'calc(100vh - 280px)' }}>
          {filteredPts.length === 0 && (
            <div style={{ textAlign:'center', padding:'32px 12px', color:'var(--text-muted)', fontSize:13 }}>No patients found</div>
          )}
          {filteredPts.map(pt => (
            <div key={pt.id}
              onClick={() => setSelId(pt.id)}
              className={`ha-emr-pt ${pt.id === selId ? 'active' : ''}`}
              style={{ cursor:'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="ha-emr-pt-avatar" style={{ background: pt.id === selId ? 'var(--primary)' : '#f1f5f9', color: pt.id === selId ? 'white' : 'var(--text-muted)' }}>
                  {initials(pt.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pt.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{pt.id} · {pt.age}y · {pt.phone}</div>
                </div>
                <Badge label={pt.status} color={statusColor(pt.status)} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Patient record panel ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:14, overflowY:'auto', maxHeight:'calc(100vh - 280px)' }}>

          {/* Header banner */}
          <div className="ha-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg,#1c2537,#253048)', padding: '20px 24px', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, flexShrink:0 }}>
                  {initials(p.name)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{p.name}</div>
                  <div style={{ fontSize: 13, opacity: 0.75 }}>{p.id} · {p.gender === 'F' ? 'Female' : 'Male'} · {p.age} years · Blood: {p.blood}</div>
                  <div style={{ fontSize: 12, opacity: 0.6, marginTop:3 }}>Last Visit: {p.lastVisit} · Total Visits: {p.visits}</div>
                </div>
              </div>
            </div>

            {/* Vitals */}
            <div style={{ padding: '18px 24px' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:12 }}>Current Vitals</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {([['Blood Pressure','128/82','mmHg','var(--primary-light)','var(--primary)'],
                   ['Heart Rate','74','bpm','var(--blue-light)','var(--blue)'],
                   ['O₂ Saturation','98','%','var(--green-light)','var(--green)']] as [string,string,string,string,string][]).map(([l,v,u,bg,c]) => (
                  <div key={l} style={{ padding: 16, background: bg, borderRadius: 14, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 6 }}>{l}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: c }}>{v} <span style={{ fontSize: 13, fontWeight: 400 }}>{u}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="ha-card" style={{ borderLeft:'4px solid var(--rose)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <span style={{ fontSize:18 }}>⚠</span>
              <div style={{ fontWeight:700, fontSize:14, color:'var(--rose)' }}>Known Allergies</div>
            </div>
            {p.allergies === 'None known'
              ? <div style={{ fontSize:13.5, color:'var(--text-muted)', background:'var(--green-light)', padding:'8px 14px', borderRadius:9 }}>✓ No known drug or substance allergies recorded</div>
              : <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {p.allergies.split(', ').map(a => (
                    <span key={a} style={{ fontSize:13, fontWeight:600, padding:'5px 14px', borderRadius:20, background:'var(--rose-light)', color:'var(--rose)', border:'1px solid #fca5a5' }}>{a}</span>
                  ))}
                </div>
            }
          </div>

          {/* Medical History */}
          <div className="ha-card">
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <SvgIcon path="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" size={16} color="var(--primary)" />
              <div style={{ fontWeight:700, fontSize:14 }}>Medical History</div>
            </div>
            <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.8, background:'var(--bg)', padding:'12px 16px', borderRadius:10, border:'1px solid var(--border)' }}>
              {p.history}
            </div>
          </div>

          {/* Active Medications */}
          <div className="ha-card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Active Medications</div>
            {(['Lisinopril 10mg · Once daily, morning', 'Hydrochlorothiazide 12.5mg · Once daily', 'Aspirin 81mg · Once daily'] as string[]).map(m => (
              <div key={m} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg)', borderRadius: 10, marginBottom: 8, border:'1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{m.split(' · ')[0]}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{m.split(' · ')[1]}</div>
                </div>
                <Badge label="Ongoing" color="primary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Module: Pharmacy ─────────────────────────────────────────────────────────

const PharmacyModule: React.FC = () => {
  const [showRx,       setShowRx]       = useState(false);
  const [openMenu,     setOpenMenu]     = useState<string | null>(null);
  const [viewRx,       setViewRx]       = useState<Prescription | null>(null);
  const [filterFrom,   setFilterFrom]   = useState('');
  const [filterTo,     setFilterTo]     = useState('');
  const [filterDoc,    setFilterDoc]    = useState('All Doctors');
  const [filterStatus, setFilterStatus] = useState('All');

  const inpStyle: React.CSSProperties = {
    width:'100%', padding:'9px 12px', border:'1px solid var(--border)',
    borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit',
    background:'var(--bg)', color:'var(--text)', boxSizing:'border-box',
  };
  const selStyle: React.CSSProperties = {
    padding:'7px 28px 7px 12px', borderRadius:9, border:'1px solid var(--border)',
    background:'var(--bg)', fontSize:12.5, fontWeight:500, cursor:'pointer',
    fontFamily:'inherit', color:'var(--text)', outline:'none', appearance:'none',
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center',
  };

  const doctors = ['All Doctors', ...Array.from(new Set(PRESCRIPTIONS.map(r => r.doctor)))];

  const filtered = useMemo(() =>
    PRESCRIPTIONS.filter(rx => {
      const iso = shortDateToISO(rx.date);
      if (filterFrom && iso < filterFrom) return false;
      if (filterTo   && iso > filterTo)   return false;
      if (filterDoc !== 'All Doctors' && rx.doctor !== filterDoc) return false;
      if (filterStatus !== 'All'      && rx.status !== filterStatus) return false;
      return true;
    }), [filterFrom, filterTo, filterDoc, filterStatus]);

  const handleDownloadRx = (rx: Prescription) => {
    const det = PRESCRIPTION_DETAILS[rx.id];
    const html = `<!DOCTYPE html><html><head><title>Prescription ${rx.id} — Vexoo</title>
    <style>body{font-family:Arial,sans-serif;padding:28px;color:#1a2540;}h1{font-size:20px;margin-bottom:4px;}
    .subtitle{font-size:13px;color:#64748b;margin-bottom:20px;}
    h2{font-size:13px;color:#0d9488;border-bottom:2px solid #e6faf8;padding-bottom:5px;margin-top:20px;margin-bottom:10px;}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}
    .item{background:#f4f8f7;border-radius:8px;padding:10px 12px;}
    .lbl{font-size:10px;color:#64748b;text-transform:uppercase;margin-bottom:3px;}
    .val{font-size:13px;font-weight:600;}
    .course{background:#fffef5;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;margin-top:12px;}
    .footer{margin-top:32px;color:#94a3b8;font-size:11px;border-top:1px solid #f0f0f0;padding-top:10px;}
    </style></head><body>
    <h1>Prescription — ${rx.id}</h1>
    <div class="subtitle">Vexoo · Generated on ${new Date().toLocaleDateString('en-IN')}</div>
    <h2>Patient & Drug Details</h2>
    <div class="grid">
      <div class="item"><div class="lbl">Patient</div><div class="val">${rx.patient}</div></div>
      <div class="item"><div class="lbl">Prescribed By</div><div class="val">${rx.doctor}</div></div>
      <div class="item"><div class="lbl">Drug</div><div class="val">${rx.drug}</div></div>
      <div class="item"><div class="lbl">Quantity</div><div class="val">${rx.qty} units</div></div>
      <div class="item"><div class="lbl">Frequency</div><div class="val">${det?.frequency ?? 'As directed'}</div></div>
      <div class="item"><div class="lbl">Duration</div><div class="val">${det?.duration ?? 'As directed'}</div></div>
      <div class="item"><div class="lbl">Date</div><div class="val">${rx.date}</div></div>
      <div class="item"><div class="lbl">Status</div><div class="val">${rx.status}</div></div>
    </div>
    <h2>Instructions</h2>
    <p style="font-size:13px;line-height:1.7;color:#374151;">${det?.instructions ?? 'As directed by physician.'}</p>
    <div class="course">
      <strong>Course Progress:</strong>
      Tablets taken so far: ${det?.taken ?? 0} / ${rx.qty} &nbsp;|&nbsp;
      Remaining: ${rx.qty - (det?.taken ?? 0)} units
    </div>
    <div class="footer">Vexoo · Confidential — For internal and patient use only</div>
    </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <>
    <div className="ha-content ha-fade" onClick={() => setOpenMenu(null)}>
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Pharmacy</div>
          <div className="ha-section-sub">{filtered.length} prescription{filtered.length !== 1 ? 's' : ''} shown</div>
        </div>
        <button className="ha-action-btn" onClick={() => setShowRx(true)}>
          <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
          New Prescription
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:16, padding:'14px 18px', background:'var(--card)', borderRadius:14, border:'1px solid var(--border)' }}>
        <span style={{ fontSize:12.5, fontWeight:700, color:'var(--text-muted)' }}>Filter:</span>
        <select value={filterDoc} onChange={e => setFilterDoc(e.target.value)} style={selStyle}>
          {doctors.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selStyle}>
          <option>All</option><option>Pending</option><option>Ready</option><option>Dispensed</option>
        </select>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>From</span>
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
            style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
          <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>To</span>
          <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
            style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
          {(filterFrom || filterTo) && (
            <button onClick={() => { setFilterFrom(''); setFilterTo(''); }} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--rose)', fontSize:12.5, fontWeight:700, fontFamily:'inherit' }}>✕ Clear</button>
          )}
        </div>
        <span style={{ fontSize:12.5, color:'var(--text-muted)', marginLeft:'auto' }}>{filtered.length} of {PRESCRIPTIONS.length} records</span>
      </div>

      {/* ── Table ── */}
      <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
        <div className="ha-table-wrap">
          <table className="ha-table">
            <thead><tr>{['Rx ID','Patient','Drug / Dosage','Qty','Prescribed By','Date','Status',''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {filtered.map((rx, i) => {
                const isOpen = openMenu === rx.id;
                return (
                  <tr key={rx.id} className="ha-tr" style={{ borderBottom:i<filtered.length-1?'1px solid var(--border)':'none' }}>
                    <Td><span style={{ fontWeight:600, color:'var(--primary)' }}>{rx.id}</span></Td>
                    <Td style={{ fontWeight:500 }}>{rx.patient}</Td>
                    <Td>{rx.drug}</Td>
                    <Td>{rx.qty}</Td>
                    <Td style={{ color:'var(--text-muted)' }}>{rx.doctor}</Td>
                    <Td style={{ color:'var(--text-muted)' }}>{rx.date}</Td>
                    <Td><Badge label={rx.status} color={statusColor(rx.status)} /></Td>
                    <Td>
                      <div style={{ position:'relative' }}>
                        <button onClick={e => { e.stopPropagation(); setOpenMenu(isOpen ? null : rx.id); }}
                          style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'4px 10px', fontSize:17, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)', lineHeight:1 }}>
                          ⋯
                        </button>
                        {isOpen && (
                          <div onClick={e => e.stopPropagation()} style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'white', border:'1px solid var(--border)', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:50, minWidth:150, overflow:'hidden' }}>
                            <button onClick={() => { setViewRx(rx); setOpenMenu(null); }}
                              style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--text)' }}>
                              View Prescription
                            </button>
                            <div style={{ height:1, background:'var(--border)' }} />
                            <button onClick={() => { handleDownloadRx(rx); setOpenMenu(null); }}
                              style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--primary)' }}>
                              Download PDF
                            </button>
                          </div>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding:'40px 20px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No prescriptions match the selected filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* ── View Prescription modal — outside ha-fade ── */}
    {viewRx && (
      <>
        <div onClick={() => setViewRx(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100 }} />
        <div onClick={e => e.stopPropagation()} style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'white', borderRadius:18, width:560, maxWidth:'94vw', maxHeight:'90vh', overflowY:'auto', zIndex:101, boxShadow:'0 24px 80px rgba(0,0,0,0.2)' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:17 }}>Prescription Detail</div>
              <div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>{viewRx.id} · {viewRx.date}</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => { handleDownloadRx(viewRx); }} style={{ display:'flex', alignItems:'center', gap:6, background:'var(--primary)', color:'white', border:'none', borderRadius:8, padding:'7px 14px', fontSize:12.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                ⬇ Download PDF
              </button>
              <button onClick={() => setViewRx(null)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, width:34, height:34, cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>✕</button>
            </div>
          </div>
          <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {([
                ['Patient',        viewRx.patient],
                ['Prescribed By',  viewRx.doctor],
                ['Drug / Dosage',  viewRx.drug],
                ['Quantity',       `${viewRx.qty} units`],
                ['Frequency',      PRESCRIPTION_DETAILS[viewRx.id]?.frequency ?? 'As directed'],
                ['Duration',       PRESCRIPTION_DETAILS[viewRx.id]?.duration  ?? 'As directed'],
                ['Date',           viewRx.date],
                ['Refills Left',   `${viewRx.refills}`],
                ['Status',         viewRx.status],
              ] as [string,string][]).map(([k,v]) => (
                <div key={k} style={{ background:'var(--bg)', borderRadius:10, padding:'10px 14px' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{k}</div>
                  <div style={{ fontSize:13.5, fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13.5, marginBottom:8 }}>Instructions</div>
              <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.8, background:'var(--bg)', padding:'12px 16px', borderRadius:10, border:'1px solid var(--border)' }}>
                {PRESCRIPTION_DETAILS[viewRx.id]?.instructions ?? 'Take as directed by the physician.'}
              </div>
            </div>
            <div style={{ background:'var(--amber-light)', border:'1px solid var(--amber)', borderRadius:12, padding:'14px 18px' }}>
              <div style={{ fontWeight:700, fontSize:13, color:'var(--amber)', marginBottom:10 }}>Course Progress</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <span style={{ fontSize:13, color:'var(--text-muted)' }}>Tablets / Units Taken</span>
                <span style={{ fontWeight:800, fontSize:18, color:'var(--amber)' }}>{PRESCRIPTION_DETAILS[viewRx.id]?.taken ?? 0} / {viewRx.qty}</span>
              </div>
              <div style={{ background:'rgba(255,255,255,0.6)', borderRadius:6, height:10, overflow:'hidden', marginBottom:8 }}>
                <div style={{ width:`${Math.min(100,((PRESCRIPTION_DETAILS[viewRx.id]?.taken ?? 0)/viewRx.qty)*100)}%`, height:'100%', background:'var(--amber)', borderRadius:6 }} />
              </div>
              <div style={{ fontSize:12.5, color:'var(--amber)', fontWeight:600 }}>
                {viewRx.qty - (PRESCRIPTION_DETAILS[viewRx.id]?.taken ?? 0)} units remaining
              </div>
            </div>
          </div>
        </div>
      </>
    )}

    {/* ── New Prescription drawer ── */}
    {showRx && (
      <>
        <div onClick={() => setShowRx(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
        <div style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div style={{ fontWeight:800, fontSize:17 }}>Add Prescription</div>
            <button onClick={() => setShowRx(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:12.5, fontFamily:'inherit' }}>✕ Close</button>
          </div>
          <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:14 }}>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Patient *</div><select style={{...inpStyle,cursor:'pointer'}}><option>— Select Patient —</option><option>Sarah Johnson · P-001</option><option>Marcus Williams · P-002</option></select></div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Prescribing Doctor *</div><select style={{...inpStyle,cursor:'pointer'}}><option>— Select Doctor —</option><option>Dr. Amy Chen</option><option>Dr. Raj Patel</option></select></div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Drug Name *</div><input style={inpStyle} placeholder="e.g. Lisinopril 10mg" /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Dosage</div><input style={inpStyle} placeholder="e.g. 10mg" /></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Quantity</div><input style={inpStyle} type="number" placeholder="30" /></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Frequency</div><select style={{...inpStyle,cursor:'pointer'}}><option>Once daily</option><option>Twice daily</option><option>Three times daily</option><option>As needed</option></select></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Duration</div><input style={inpStyle} placeholder="e.g. 30 days" /></div>
            </div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Instructions</div><textarea style={{...inpStyle,resize:'vertical',minHeight:70}} placeholder="Take with food. Monitor BP weekly..." /></div>
          </div>
          <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
            <button className="ha-action-btn" style={{ flex:1, justifyContent:'center' }} onClick={() => setShowRx(false)}>Submit Prescription</button>
            <button onClick={() => setShowRx(false)} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
          </div>
        </div>
      </>
    )}
    </>
  );
};

// ─── Module: Lab──────────────────────────────────────────────────────────────

const LabModule: React.FC = () => {
  const [openMenu,     setOpenMenu]     = useState<string | null>(null);
  const [viewLab,      setViewLab]      = useState<LabOrder | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [filterFrom,   setFilterFrom]   = useState('');
  const [filterTo,     setFilterTo]     = useState('');
  const [filterDoc,    setFilterDoc]    = useState('All Doctors');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority,setFilterPriority]= useState('All');

  const inpStyle: React.CSSProperties = {
    width:'100%', padding:'9px 12px', border:'1px solid var(--border)',
    borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit',
    background:'var(--bg)', color:'var(--text)', boxSizing:'border-box',
  };
  const selStyle: React.CSSProperties = {
    padding:'7px 28px 7px 12px', borderRadius:9, border:'1px solid var(--border)',
    background:'var(--bg)', fontSize:12.5, fontWeight:500, cursor:'pointer',
    fontFamily:'inherit', color:'var(--text)', outline:'none', appearance:'none',
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center',
  };

  const doctors = ['All Doctors', ...Array.from(new Set(LAB_ORDERS.map(l => l.ordered)))];

  const filtered = useMemo(() =>
    LAB_ORDERS.filter(l => {
      const iso = shortDateToISO(l.date);
      if (filterFrom && iso < filterFrom) return false;
      if (filterTo   && iso > filterTo)   return false;
      if (filterDoc      !== 'All Doctors' && l.ordered  !== filterDoc)      return false;
      if (filterStatus   !== 'All'         && l.status   !== filterStatus)   return false;
      if (filterPriority !== 'All'         && l.priority !== filterPriority) return false;
      return true;
    }), [filterFrom, filterTo, filterDoc, filterStatus, filterPriority]);

  const handleDownloadLab = (l: LabOrder) => {
    const details = LAB_RESULT_DETAILS[l.id] ?? [];
    const resultRows = details.length
      ? details.map(d => `<tr style="background:${d.flag!=='NORMAL'?'#fff8f8':'transparent'}"><td>${d.parameter}</td><td style="font-weight:700;color:${d.flag==='CRITICAL'?'#e11d48':d.flag==='LOW'||d.flag==='HIGH'?'#d97706':'#16a34a'}">${d.value}</td><td>${d.unit}</td><td>${d.reference}</td><td style="font-weight:700;color:${d.flag==='CRITICAL'?'#e11d48':d.flag==='LOW'||d.flag==='HIGH'?'#d97706':'#16a34a'}">${d.flag}</td></tr>`).join('')
      : '<tr><td colspan="5" style="color:#94a3b8">Results pending — not yet available</td></tr>';
    const html = `<!DOCTYPE html><html><head><title>Lab Report ${l.id} — Vexoo</title>
    <style>body{font-family:Arial,sans-serif;padding:28px;color:#1a2540;}h1{font-size:20px;margin-bottom:4px;}
    .subtitle{font-size:13px;color:#64748b;margin-bottom:20px;}
    h2{font-size:13px;color:#0d9488;border-bottom:2px solid #e6faf8;padding-bottom:5px;margin-top:20px;margin-bottom:10px;}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}
    .item{background:#f4f8f7;border-radius:8px;padding:10px 12px;}
    .lbl{font-size:10px;color:#64748b;text-transform:uppercase;margin-bottom:3px;}
    .val{font-size:13px;font-weight:600;}
    table{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px;}
    th{background:#f4f8f7;padding:7px 10px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;}
    td{padding:8px 10px;border-bottom:1px solid #f0f0f0;}
    .footer{margin-top:32px;color:#94a3b8;font-size:11px;border-top:1px solid #f0f0f0;padding-top:10px;}
    </style></head><body>
    <h1>Lab Report — ${l.id}</h1>
    <div class="subtitle">Vexoo · Generated on ${new Date().toLocaleDateString('en-IN')}</div>
    <h2>Order Details</h2>
    <div class="grid">
      <div class="item"><div class="lbl">Patient</div><div class="val">${l.patient}</div></div>
      <div class="item"><div class="lbl">Test</div><div class="val">${l.test}</div></div>
      <div class="item"><div class="lbl">Ordered By</div><div class="val">${l.ordered}</div></div>
      <div class="item"><div class="lbl">Date</div><div class="val">${l.date}</div></div>
      <div class="item"><div class="lbl">Priority</div><div class="val">${l.priority}</div></div>
      <div class="item"><div class="lbl">Status</div><div class="val">${l.status}</div></div>
    </div>
    <h2>Test Results</h2>
    <table><thead><tr><th>Parameter</th><th>Value</th><th>Unit</th><th>Reference</th><th>Flag</th></tr></thead>
    <tbody>${resultRows}</tbody></table>
    ${l.result ? `<h2>Summary</h2><p style="font-size:13px;line-height:1.7;">${l.result}</p>` : ''}
    <div class="footer">Vexoo · Confidential — For clinical use only</div>
    </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <>
    <div className="ha-content ha-fade" onClick={() => setOpenMenu(null)}>
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Lab & Diagnostics</div>
          <div className="ha-section-sub">{filtered.length} order{filtered.length !== 1 ? 's' : ''} shown</div>
        </div>
        <button className="ha-action-btn" onClick={() => setShowNewOrder(true)}>
          <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
          New Test Order
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:16, padding:'14px 18px', background:'var(--card)', borderRadius:14, border:'1px solid var(--border)' }}>
        <span style={{ fontSize:12.5, fontWeight:700, color:'var(--text-muted)' }}>Filter:</span>
        <select value={filterDoc} onChange={e => setFilterDoc(e.target.value)} style={selStyle}>
          {doctors.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selStyle}>
          <option>All</option><option>In Progress</option><option>Pending</option><option>Complete</option><option>Critical</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={selStyle}>
          <option>All</option><option>Routine</option><option>Urgent</option><option>STAT</option>
        </select>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>From</span>
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
            style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
          <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>To</span>
          <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
            style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
          {(filterFrom || filterTo) && (
            <button onClick={() => { setFilterFrom(''); setFilterTo(''); }} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--rose)', fontSize:12.5, fontWeight:700, fontFamily:'inherit' }}>✕ Clear</button>
          )}
        </div>
        <span style={{ fontSize:12.5, color:'var(--text-muted)', marginLeft:'auto' }}>{filtered.length} of {LAB_ORDERS.length} records</span>
      </div>

      {/* ── Table ── */}
      <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
        <div className="ha-table-wrap">
          <table className="ha-table">
            <thead><tr>{['Lab ID','Patient','Test','Ordered By','Date','Priority','Status','Result',''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {filtered.map((l, i) => {
                const isOpen = openMenu === l.id;
                return (
                  <tr key={l.id} className="ha-tr" style={{ borderBottom:i<filtered.length-1?'1px solid var(--border)':'none', background:l.priority==='STAT'?'#fff8f8':undefined }}>
                    <Td><span style={{ fontWeight:600, color:'var(--primary)' }}>{l.id}</span></Td>
                    <Td style={{ fontWeight:500 }}>{l.patient}</Td>
                    <Td>{l.test}</Td>
                    <Td style={{ color:'var(--text-muted)' }}>{l.ordered}</Td>
                    <Td style={{ color:'var(--text-muted)' }}>{l.date}</Td>
                    <Td><Badge label={l.priority} color={statusColor(l.priority)} /></Td>
                    <Td><Badge label={l.status} color={statusColor(l.status)} /></Td>
                    <Td style={{ fontSize:12.5, color:'var(--text-muted)', maxWidth:180 }}>{l.result || '—'}</Td>
                    <Td>
                      <div style={{ position:'relative' }}>
                        <button onClick={e => { e.stopPropagation(); setOpenMenu(isOpen ? null : l.id); }}
                          style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'4px 10px', fontSize:17, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)', lineHeight:1 }}>
                          ⋯
                        </button>
                        {isOpen && (
                          <div onClick={e => e.stopPropagation()} style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'white', border:'1px solid var(--border)', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:50, minWidth:160, overflow:'hidden' }}>
                            <button onClick={() => { setViewLab(l); setOpenMenu(null); }}
                              style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--text)' }}>
                              View Report
                            </button>
                            <div style={{ height:1, background:'var(--border)' }} />
                            <button onClick={() => { handleDownloadLab(l); setOpenMenu(null); }}
                              style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--primary)' }}>
                              Download PDF
                            </button>
                          </div>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ padding:'40px 20px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No lab orders match the selected filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* ── View Report modal — outside ha-fade ── */}
    {viewLab && (
      <>
        <div onClick={() => setViewLab(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100 }} />
        <div onClick={e => e.stopPropagation()} style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'white', borderRadius:18, width:620, maxWidth:'94vw', maxHeight:'90vh', overflowY:'auto', zIndex:101, boxShadow:'0 24px 80px rgba(0,0,0,0.2)' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:17 }}>Lab Report</div>
              <div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>{viewLab.id} · {viewLab.test} · {viewLab.date}</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => handleDownloadLab(viewLab)} style={{ display:'flex', alignItems:'center', gap:6, background:'var(--primary)', color:'white', border:'none', borderRadius:8, padding:'7px 14px', fontSize:12.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                ⬇ Download PDF
              </button>
              <button onClick={() => setViewLab(null)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, width:34, height:34, cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>✕</button>
            </div>
          </div>
          <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 }}>
            {/* Order info */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {([
                ['Patient',    viewLab.patient],
                ['Test',       viewLab.test],
                ['Ordered By', viewLab.ordered],
                ['Date',       viewLab.date],
                ['Priority',   viewLab.priority],
                ['Status',     viewLab.status],
              ] as [string,string][]).map(([k,v]) => (
                <div key={k} style={{ background:'var(--bg)', borderRadius:10, padding:'10px 14px' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{k}</div>
                  <div style={{ fontSize:13.5, fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Result values */}
            <div>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Test Results</div>
              {(LAB_RESULT_DETAILS[viewLab.id] ?? []).length === 0 ? (
                <div style={{ padding:'28px 20px', textAlign:'center', background:'var(--bg)', borderRadius:12, color:'var(--text-muted)' }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>⏳</div>
                  <div style={{ fontWeight:700, fontSize:14 }}>Results Pending</div>
                  <div style={{ fontSize:13, marginTop:4 }}>Test results will appear here once processed</div>
                </div>
              ) : (
                <div style={{ border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px 130px 90px', background:'var(--bg)', padding:'9px 14px', borderBottom:'1px solid var(--border)' }}>
                    {['Parameter','Value','Unit','Reference','Flag'].map(h => (
                      <div key={h} style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</div>
                    ))}
                  </div>
                  {(LAB_RESULT_DETAILS[viewLab.id] ?? []).map((d, i) => {
                    const flagColor = d.flag==='CRITICAL'?'var(--rose)':d.flag==='LOW'||d.flag==='HIGH'?'var(--amber)':'var(--green)';
                    const flagBg    = d.flag==='CRITICAL'?'var(--rose-light)':d.flag==='LOW'||d.flag==='HIGH'?'var(--amber-light)':'var(--green-light)';
                    return (
                      <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px 130px 90px', padding:'11px 14px', borderBottom:i<(LAB_RESULT_DETAILS[viewLab.id]??[]).length-1?'1px solid var(--border)':'none', alignItems:'center', background:d.flag!=='NORMAL'?'#fffcf5':undefined }}>
                        <div style={{ fontSize:13.5, fontWeight:500 }}>{d.parameter}</div>
                        <div style={{ fontSize:14, fontWeight:800, color:flagColor }}>{d.value}</div>
                        <div style={{ fontSize:12.5, color:'var(--text-muted)' }}>{d.unit}</div>
                        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{d.reference}</div>
                        <span style={{ fontSize:11, fontWeight:800, padding:'3px 9px', borderRadius:20, background:flagBg, color:flagColor, display:'inline-block' }}>{d.flag}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {viewLab.result && (
              <div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:8 }}>Summary / Interpretation</div>
                <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.8, background:'var(--bg)', padding:'12px 16px', borderRadius:10, border:'1px solid var(--border)' }}>
                  {viewLab.result}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )}

    {/* ── New Test Order drawer ── */}
    {showNewOrder && (
      <>
        <div onClick={() => setShowNewOrder(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
        <div style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div style={{ fontWeight:800, fontSize:17 }}>New Test Order</div>
            <button onClick={() => setShowNewOrder(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:12.5, fontFamily:'inherit' }}>✕ Close</button>
          </div>
          <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:14 }}>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Patient *</div><select style={{...inpStyle,cursor:'pointer'}}><option>— Select Patient —</option>{PATIENTS.map(p => <option key={p.id}>{p.name} · {p.id}</option>)}</select></div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Ordering Doctor *</div><select style={{...inpStyle,cursor:'pointer'}}><option>— Select Doctor —</option><option>Dr. Amy Chen</option><option>Dr. Raj Patel</option><option>Dr. Yeon Kim</option></select></div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Test Name *</div><input style={inpStyle} placeholder="e.g. CBC + Metabolic Panel" /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Priority</div><select style={{...inpStyle,cursor:'pointer'}}><option>Routine</option><option>Urgent</option><option>STAT</option></select></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Date</div><input style={inpStyle} type="date" defaultValue="2026-04-26" /></div>
            </div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Clinical Notes</div><textarea style={{...inpStyle,resize:'vertical',minHeight:70}} placeholder="Reason for test / clinical indication..." /></div>
          </div>
          <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
            <button className="ha-action-btn" style={{ flex:1, justifyContent:'center' }} onClick={() => setShowNewOrder(false)}>Submit Test Order</button>
            <button onClick={() => setShowNewOrder(false)} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
          </div>
        </div>
      </>
    )}
    </>
  );
};

// ─── Module: Inventory ────────────────────────────────────────────────────────

// ─── Drug inventory data (pulled from Pharmacy) ───────────────────────────────

const INV_DRUGS = [
  { id:'S-001', name:'Lisinopril 10mg',    category:'Cardiovascular', qty:1240, min:200,  max:2000, unit:'tabs',  expiry:'Dec 2026' },
  { id:'S-002', name:'Metformin 500mg',    category:'Diabetes',       qty:180,  min:200,  max:1500, unit:'tabs',  expiry:'Nov 2026' },
  { id:'S-003', name:'Amiodarone 200mg',   category:'Cardiac',        qty:95,   min:100,  max:500,  unit:'tabs',  expiry:'Sep 2026' },
  { id:'S-004', name:'Salbutamol Inhaler', category:'Respiratory',    qty:48,   min:20,   max:150,  unit:'units', expiry:'Mar 2027' },
  { id:'S-005', name:'Sumatriptan 50mg',   category:'Neurology',      qty:320,  min:100,  max:800,  unit:'tabs',  expiry:'Feb 2027' },
  { id:'S-006', name:'Paracetamol 500mg',  category:'Analgesics',     qty:2800, min:500,  max:5000, unit:'tabs',  expiry:'Aug 2027' },
  { id:'S-007', name:'Omeprazole 20mg',    category:'GI',             qty:640,  min:150,  max:1200, unit:'caps',  expiry:'Jul 2027' },
  { id:'S-008', name:'Atorvastatin 40mg',  category:'Cardiovascular', qty:880,  min:200,  max:1500, unit:'tabs',  expiry:'May 2027' },
];

const INV_EQUIPMENT = [
  { id:'ANA-001', name:'Hematology Analyzer',  model:'Sysmex XN-1000',        eqStatus:'Online',  load:'72%', lastCalib:'Apr 24, 2026', nextCalib:'May 8, 2026',  tests:['CBC','Reticulocytes'],             uptime:'99.2%' },
  { id:'ANA-002', name:'Chemistry Analyzer',   model:'Roche Cobas 8000',       eqStatus:'Online',  load:'45%', lastCalib:'Apr 22, 2026', nextCalib:'May 6, 2026',  tests:['Metabolic Panel','LFTs','Lipids'],  uptime:'98.8%' },
  { id:'ANA-003', name:'Immunoassay Analyzer', model:'Abbott Architect',        eqStatus:'Warning', load:'88%', lastCalib:'Apr 20, 2026', nextCalib:'May 4, 2026',  tests:['Troponin','HbA1c','TSH'],           uptime:'96.1%' },
  { id:'IMG-001', name:'MRI Scanner',          model:'Siemens MAGNETOM',        eqStatus:'Online',  load:'30%', lastCalib:'Apr 15, 2026', nextCalib:'May 15, 2026', tests:['MRI Brain','MRI Spine','MRI Body'], uptime:'99.7%' },
  { id:'PFT-001', name:'Spirometer',           model:'ndd EasyOne Air',         eqStatus:'Online',  load:'20%', lastCalib:'Apr 25, 2026', nextCalib:'May 9, 2026',  tests:['Spirometry','PFT'],                 uptime:'100%'  },
  { id:'ECG-001', name:'ECG Machine',          model:'Philips PageWriter TC70', eqStatus:'Offline', load:'0%',  lastCalib:'Apr 10, 2026', nextCalib:'—',            tests:['ECG','Holter'],                     uptime:'85.0%' },
];

function invDrugStatus(qty: number, min: number): 'Critical' | 'Low' | 'OK' {
  if (qty < min * 0.5) return 'Critical';
  if (qty < min)       return 'Low';
  return 'OK';
}
function eqBorderCol(s: string) {
  if (s === 'Online')  return 'var(--primary)';
  if (s === 'Warning') return 'var(--amber)';
  return 'var(--rose)';
}

const InventoryModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drugs' | 'equipment'>('drugs');

  // ── Drug state ──────────────────────────────────────────────────────────────
  const [drugs, setDrugs] = useState(INV_DRUGS);
  const [openDrugMenu, setOpenDrugMenu]       = useState<string | null>(null);
  const [showAddDrug, setShowAddDrug]         = useState(false);
  const [editingDrug, setEditingDrug]         = useState<typeof INV_DRUGS[0] | null>(null);
  const [confirmDeleteDrug, setConfirmDeleteDrug] = useState<string | null>(null);
  const [drugForm, setDrugForm] = useState({
    name:'', category:'Cardiovascular', qty:'', min:'', max:'', unit:'tabs', expiry:'',
  });

  // ── Equipment state ─────────────────────────────────────────────────────────
  const [equipment, setEquipment] = useState(INV_EQUIPMENT);
  const [openEqMenu, setOpenEqMenu]           = useState<string | null>(null);
  const [showAddEq, setShowAddEq]             = useState(false);
  const [editingEq, setEditingEq]             = useState<typeof INV_EQUIPMENT[0] | null>(null);
  const [confirmDeleteEq, setConfirmDeleteEq] = useState<string | null>(null);
  const [eqForm, setEqForm] = useState({
    name:'', model:'', eqStatus:'Online', load:'0%', lastCalib:'', nextCalib:'', uptime:'100%', tests:'',
  });

  // ── KPI counts ──────────────────────────────────────────────────────────────
  const drugOK       = drugs.filter(d => invDrugStatus(d.qty, d.min) === 'OK').length;
  const drugLow      = drugs.filter(d => invDrugStatus(d.qty, d.min) === 'Low').length;
  const drugCritical = drugs.filter(d => invDrugStatus(d.qty, d.min) === 'Critical').length;
  const eqOnline     = equipment.filter(e => e.eqStatus === 'Online').length;
  const eqWarning    = equipment.filter(e => e.eqStatus === 'Warning').length;
  const eqOffline    = equipment.filter(e => e.eqStatus === 'Offline').length;

  // ── Drug handlers ────────────────────────────────────────────────────────────
  const openEditDrug = (d: typeof INV_DRUGS[0]) => {
    setEditingDrug(d);
    setDrugForm({ name:d.name, category:d.category, qty:String(d.qty), min:String(d.min), max:String(d.max), unit:d.unit, expiry:d.expiry });
    setOpenDrugMenu(null);
  };
  const saveDrug = () => {
    if (editingDrug) {
      setDrugs(prev => prev.map(d => d.id === editingDrug.id
        ? { ...d, name:drugForm.name, category:drugForm.category, qty:Number(drugForm.qty), min:Number(drugForm.min), max:Number(drugForm.max), unit:drugForm.unit, expiry:drugForm.expiry }
        : d));
      setEditingDrug(null);
    } else {
      const newId = 'S-' + String(drugs.length + 1).padStart(3,'0');
      setDrugs(prev => [...prev, { id:newId, name:drugForm.name, category:drugForm.category, qty:Number(drugForm.qty), min:Number(drugForm.min), max:Number(drugForm.max), unit:drugForm.unit, expiry:drugForm.expiry }]);
      setShowAddDrug(false);
    }
    setDrugForm({ name:'', category:'Cardiovascular', qty:'', min:'', max:'', unit:'tabs', expiry:'' });
  };
  const deleteDrug = (id: string) => { setDrugs(prev => prev.filter(d => d.id !== id)); setConfirmDeleteDrug(null); };

  // ── Equipment handlers ───────────────────────────────────────────────────────
  const openEditEq = (e: typeof INV_EQUIPMENT[0]) => {
    setEditingEq(e);
    setEqForm({ name:e.name, model:e.model, eqStatus:e.eqStatus, load:e.load, lastCalib:e.lastCalib, nextCalib:e.nextCalib, uptime:e.uptime, tests:e.tests.join(', ') });
    setOpenEqMenu(null);
  };
  const saveEq = () => {
    if (editingEq) {
      setEquipment(prev => prev.map(e => e.id === editingEq.id
        ? { ...e, name:eqForm.name, model:eqForm.model, eqStatus:eqForm.eqStatus, load:eqForm.load, lastCalib:eqForm.lastCalib, nextCalib:eqForm.nextCalib, uptime:eqForm.uptime, tests:eqForm.tests.split(',').map(t => t.trim()).filter(Boolean) }
        : e));
      setEditingEq(null);
    } else {
      const newId = 'EQ-' + String(equipment.length + 1).padStart(3,'0');
      setEquipment(prev => [...prev, { id:newId, name:eqForm.name, model:eqForm.model, eqStatus:eqForm.eqStatus, load:eqForm.load, lastCalib:eqForm.lastCalib, nextCalib:eqForm.nextCalib, uptime:eqForm.uptime, tests:eqForm.tests.split(',').map(t => t.trim()).filter(Boolean) }]);
      setShowAddEq(false);
    }
    setEqForm({ name:'', model:'', eqStatus:'Online', load:'0%', lastCalib:'', nextCalib:'', uptime:'100%', tests:'' });
  };
  const deleteEq = (id: string) => { setEquipment(prev => prev.filter(e => e.id !== id)); setConfirmDeleteEq(null); };

  // ── Shared styles ────────────────────────────────────────────────────────────
  const inpStyle: React.CSSProperties = {
    width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9,
    fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', color:'var(--text)', boxSizing:'border-box',
  };
  const labelStyle: React.CSSProperties = { fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5, display:'block' };

  // ── Drug drawer (Add / Edit) ─────────────────────────────────────────────────
  const DrugDrawer = () => {
    const isEdit = !!editingDrug;
    const close = () => { setShowAddDrug(false); setEditingDrug(null); };
    return (
      <>
        <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
        <div style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:17 }}>{isEdit ? 'Edit Drug' : 'Add New Drug'}</div>
              <div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>{isEdit ? `Editing: ${editingDrug!.name}` : 'Add a new drug to inventory'}</div>
            </div>
            <button onClick={close} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:12.5, fontFamily:'inherit' }}>✕ Close</button>
          </div>
          <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:14 }}>
            <div><label style={labelStyle}>Drug Name *</label><input style={inpStyle} value={drugForm.name} onChange={e => setDrugForm(f => ({...f, name:e.target.value}))} placeholder="e.g. Lisinopril 10mg" /></div>
            <div>
              <label style={labelStyle}>Category *</label>
              <select style={{...inpStyle, cursor:'pointer'}} value={drugForm.category} onChange={e => setDrugForm(f => ({...f, category:e.target.value}))}>
                {['Cardiovascular','Diabetes','Cardiac','Respiratory','Neurology','Analgesics','GI','Antibiotics','Oncology','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              <div><label style={labelStyle}>Current Stock *</label><input style={inpStyle} type="number" value={drugForm.qty} onChange={e => setDrugForm(f => ({...f, qty:e.target.value}))} placeholder="e.g. 500" /></div>
              <div><label style={labelStyle}>Min Required</label><input style={inpStyle} type="number" value={drugForm.min} onChange={e => setDrugForm(f => ({...f, min:e.target.value}))} placeholder="e.g. 100" /></div>
              <div><label style={labelStyle}>Max Capacity</label><input style={inpStyle} type="number" value={drugForm.max} onChange={e => setDrugForm(f => ({...f, max:e.target.value}))} placeholder="e.g. 2000" /></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={labelStyle}>Unit</label>
                <select style={{...inpStyle, cursor:'pointer'}} value={drugForm.unit} onChange={e => setDrugForm(f => ({...f, unit:e.target.value}))}>
                  {['tabs','caps','units','vials','sachets','bottles','boxes','bags'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Expiry Date</label><input style={inpStyle} value={drugForm.expiry} onChange={e => setDrugForm(f => ({...f, expiry:e.target.value}))} placeholder="e.g. Dec 2026" /></div>
            </div>
          </div>
          <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
            <button className="ha-action-btn" style={{ flex:1, justifyContent:'center' }} onClick={saveDrug}>
              {isEdit ? '✓ Save Changes' : '+ Add Drug'}
            </button>
            <button onClick={close} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
          </div>
        </div>
      </>
    );
  };

  // ── Equipment drawer (Add / Edit) ────────────────────────────────────────────
  const EqDrawer = () => {
    const isEdit = !!editingEq;
    const close = () => { setShowAddEq(false); setEditingEq(null); };
    return (
      <>
        <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
        <div style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:17 }}>{isEdit ? 'Edit Equipment' : 'Add New Equipment'}</div>
              <div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>{isEdit ? `Editing: ${editingEq!.name}` : 'Register new lab equipment'}</div>
            </div>
            <button onClick={close} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:12.5, fontFamily:'inherit' }}>✕ Close</button>
          </div>
          <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:14 }}>
            <div><label style={labelStyle}>Equipment Name *</label><input style={inpStyle} value={eqForm.name} onChange={e => setEqForm(f => ({...f, name:e.target.value}))} placeholder="e.g. Hematology Analyzer" /></div>
            <div><label style={labelStyle}>Model / Manufacturer *</label><input style={inpStyle} value={eqForm.model} onChange={e => setEqForm(f => ({...f, model:e.target.value}))} placeholder="e.g. Sysmex XN-1000" /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={labelStyle}>Status</label>
                <select style={{...inpStyle, cursor:'pointer'}} value={eqForm.eqStatus} onChange={e => setEqForm(f => ({...f, eqStatus:e.target.value}))}>
                  <option>Online</option><option>Warning</option><option>Offline</option>
                </select>
              </div>
              <div><label style={labelStyle}>Current Load</label><input style={inpStyle} value={eqForm.load} onChange={e => setEqForm(f => ({...f, load:e.target.value}))} placeholder="e.g. 72%" /></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><label style={labelStyle}>Last Calibrated</label><input style={inpStyle} value={eqForm.lastCalib} onChange={e => setEqForm(f => ({...f, lastCalib:e.target.value}))} placeholder="e.g. Apr 24, 2026" /></div>
              <div><label style={labelStyle}>Next Calibration Due</label><input style={inpStyle} value={eqForm.nextCalib} onChange={e => setEqForm(f => ({...f, nextCalib:e.target.value}))} placeholder="e.g. May 8, 2026" /></div>
            </div>
            <div><label style={labelStyle}>Uptime</label><input style={inpStyle} value={eqForm.uptime} onChange={e => setEqForm(f => ({...f, uptime:e.target.value}))} placeholder="e.g. 99.2%" /></div>
            <div><label style={labelStyle}>Test Capabilities (comma-separated)</label><input style={inpStyle} value={eqForm.tests} onChange={e => setEqForm(f => ({...f, tests:e.target.value}))} placeholder="e.g. CBC, Reticulocytes, WBC" /></div>
          </div>
          <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
            <button className="ha-action-btn" style={{ flex:1, justifyContent:'center' }} onClick={saveEq}>
              {isEdit ? '✓ Save Changes' : '+ Add Equipment'}
            </button>
            <button onClick={close} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
          </div>
        </div>
      </>
    );
  };

  // ── Delete confirmation modal ─────────────────────────────────────────────────
  const DeleteModal = ({ label, onConfirm, onCancel }: { label:string; onConfirm:()=>void; onCancel:()=>void }) => (
    <>
      <div onClick={onCancel} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:200 }} />
      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'white', borderRadius:16, padding:28, width:380, maxWidth:'90vw', zIndex:201, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign:'center', marginBottom:18 }}>
          <div style={{ width:50, height:50, borderRadius:'50%', background:'var(--rose-light)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22 }}>🗑</div>
          <div style={{ fontWeight:800, fontSize:17, marginBottom:6 }}>Delete Item?</div>
          <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.6 }}>Are you sure you want to delete <strong>{label}</strong>? This cannot be undone.</div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'var(--rose)', color:'white', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, fontWeight:700 }}>Yes, Delete</button>
        </div>
      </div>
    </>
  );

  // ── Close menus when clicking outside ────────────────────────────────────────
  const closeMenus = () => { setOpenDrugMenu(null); setOpenEqMenu(null); };

  return (
    <div className="ha-content ha-fade" onClick={closeMenus}>

      {/* ── Section header with tab switcher + Add button ── */}
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Inventory</div>
          <div className="ha-section-sub">Drug stock · Lab equipment status</div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {/* Tab switcher */}
          <button onClick={() => setActiveTab('drugs')} style={{ padding:'7px 18px', borderRadius:9, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, background: activeTab==='drugs'?'var(--primary)':'var(--card)', color: activeTab==='drugs'?'white':'var(--text-muted)', boxShadow: activeTab==='drugs'?'none':'0 0 0 1px var(--border)' }}>
            Drug Inventory
          </button>
          <button onClick={() => setActiveTab('equipment')} style={{ padding:'7px 18px', borderRadius:9, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, background: activeTab==='equipment'?'var(--primary)':'var(--card)', color: activeTab==='equipment'?'white':'var(--text-muted)', boxShadow: activeTab==='equipment'?'none':'0 0 0 1px var(--border)' }}>
            Equipment Status
          </button>
          {/* Context-aware Add button */}
          <button className="ha-action-btn" onClick={e => { e.stopPropagation(); activeTab==='drugs' ? setShowAddDrug(true) : setShowAddEq(true); }}>
            <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
            {activeTab === 'drugs' ? 'Add Drug' : 'Add Equipment'}
          </button>
        </div>
      </div>

      {/* ── Drug Inventory Tab ── */}
      {activeTab === 'drugs' && (
        <>
          {/* KPI strip */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {([
              ['Total Items', String(drugs.length), 'var(--primary)', 'var(--primary-light)'],
              ['OK',          String(drugOK),        'var(--green)',   'var(--green-light)'],
              ['Low Stock',   String(drugLow),       'var(--amber)',   'var(--amber-light)'],
              ['Critical',    String(drugCritical),  'var(--rose)',    'var(--rose-light)'],
            ] as [string,string,string,string][]).map(([l,v,c,bg]) => (
              <div key={l} className="ha-card" style={{ background:bg, border:'none', textAlign:'center', padding:'14px 16px' }}>
                <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
                <div style={{ fontSize:12, color:c, marginTop:3, fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Drug table */}
          <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:15 }}>Drug Inventory</div>
            <div className="ha-table-wrap">
              <table className="ha-table">
                <thead>
                  <tr>{['Drug Name','Category','Stock','Min','Max','Stock Level','Expiry','Status','Actions'].map(h => <Th key={h}>{h}</Th>)}</tr>
                </thead>
                <tbody>
                  {drugs.map((d, i) => {
                    const st = invDrugStatus(d.qty, d.min);
                    const pct = Math.min(100, (d.qty / d.max) * 100);
                    const barColor = st==='Critical'?'var(--rose)':st==='Low'?'var(--amber)':'var(--primary)';
                    const menuOpen = openDrugMenu === d.id;
                    return (
                      <tr key={d.id} className="ha-tr" style={{ borderBottom: i < drugs.length-1?'1px solid var(--border)':'none', background: st==='Critical'?'#fff8f8':undefined }}>
                        <Td><span style={{ fontWeight:700 }}>{d.name}</span></Td>
                        <Td><Badge label={d.category} color="gray" /></Td>
                        <Td><span style={{ fontWeight:700, color: st==='Critical'?'var(--rose)':st==='Low'?'var(--amber)':'var(--text)' }}>{d.qty.toLocaleString()}</span></Td>
                        <Td style={{ color:'var(--text-muted)' }}>{d.min}</Td>
                        <Td style={{ color:'var(--text-muted)' }}>{d.max}</Td>
                        <Td style={{ minWidth:120 }}>
                          <div style={{ background:'#f1f5f9', borderRadius:4, height:7, overflow:'hidden' }}>
                            <div style={{ width:`${pct}%`, height:'100%', background:barColor, borderRadius:4 }} />
                          </div>
                        </Td>
                        <Td style={{ color:'var(--text-muted)' }}>{d.expiry}</Td>
                        <Td><Badge label={st} color={st==='Critical'?'rose':st==='Low'?'amber':'primary'} /></Td>
                        <Td>
                          {/* Ellipsis menu */}
                          <div style={{ position:'relative' }}>
                            <button
                              onClick={e => { e.stopPropagation(); setOpenDrugMenu(menuOpen ? null : d.id); }}
                              style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'4px 10px', fontSize:16, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)', lineHeight:1 }}>
                              ⋯
                            </button>
                            {menuOpen && (
                              <div onClick={e => e.stopPropagation()} style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'white', border:'1px solid var(--border)', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:50, minWidth:130, overflow:'hidden' }}>
                                <button onClick={() => openEditDrug(d)} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--text)' }}>
                                  ✏️ Edit
                                </button>
                                <div style={{ height:1, background:'var(--border)' }} />
                                <button onClick={() => { setConfirmDeleteDrug(d.id); setOpenDrugMenu(null); }} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--rose)' }}>
                                  🗑 Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Equipment Status Tab ── */}
      {activeTab === 'equipment' && (
        <>
          {/* KPI strip */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {([
              ['Online',  eqOnline,          'var(--green)', 'var(--green-light)'],
              ['Warning', eqWarning,         'var(--amber)', 'var(--amber-light)'],
              ['Offline', eqOffline,         'var(--rose)',  'var(--rose-light)'],
              ['Total',   equipment.length,  'var(--primary)','var(--primary-light)'],
            ] as [string,number,string,string][]).map(([l,n,c,bg]) => (
              <div key={l} className="ha-card" style={{ background:bg, border:'none', textAlign:'center', padding:'14px 16px' }}>
                <div style={{ fontSize:26, fontWeight:800, color:c }}>{n}</div>
                <div style={{ fontSize:12, color:c, marginTop:3, fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Equipment cards grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
            {equipment.map(e => {
              const menuOpen = openEqMenu === e.id;
              return (
                <div key={e.id} className="ha-card" style={{ borderLeft:`4px solid ${eqBorderCol(e.eqStatus)}`, padding:'18px 20px', display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:3 }}>{e.name}</div>
                      <div style={{ fontSize:12.5, color:'var(--text-muted)' }}>{e.model} · {e.id}</div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <Badge label={e.eqStatus} color={e.eqStatus==='Online'?'primary':e.eqStatus==='Warning'?'amber':'rose'} />
                      {/* Ellipsis menu */}
                      <div style={{ position:'relative' }}>
                        <button
                          onClick={ev => { ev.stopPropagation(); setOpenEqMenu(menuOpen ? null : e.id); }}
                          style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'4px 10px', fontSize:16, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)', lineHeight:1 }}>
                          ⋯
                        </button>
                        {menuOpen && (
                          <div onClick={ev => ev.stopPropagation()} style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'white', border:'1px solid var(--border)', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:50, minWidth:130, overflow:'hidden' }}>
                            <button onClick={() => openEditEq(e)} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--text)' }}>
                              ✏️ Edit
                            </button>
                            <div style={{ height:1, background:'var(--border)' }} />
                            <button onClick={() => { setConfirmDeleteEq(e.id); setOpenEqMenu(null); }} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--rose)' }}>
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Meta grid */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {([['Current Load',e.load],['Uptime',e.uptime],['Last Calibrated',e.lastCalib],['Next Due',e.nextCalib]] as [string,string][]).map(([k,v]) => (
                      <div key={k} style={{ background:'var(--bg)', borderRadius:8, padding:'8px 10px' }}>
                        <div style={{ fontSize:10.5, color:'var(--text-muted)', marginBottom:2 }}>{k}</div>
                        <div style={{ fontSize:13, fontWeight:700, color: k==='Current Load'&&parseInt(e.load)>80?'var(--amber)':'var(--text)' }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Test tags */}
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {e.tests.map(t => (
                      <span key={t} style={{ fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:20, background:'#f1f5f9', color:'var(--text-muted)' }}>{t}</span>
                    ))}
                  </div>

                  {/* Warning banner */}
                  {e.eqStatus !== 'Online' && (
                    <div style={{ padding:'8px 12px', borderRadius:9, fontSize:12.5, fontWeight:600, background: e.eqStatus==='Warning'?'var(--amber-light)':'var(--rose-light)', color: e.eqStatus==='Warning'?'var(--amber)':'var(--rose)' }}>
                      {e.eqStatus==='Warning' ? '⚠ High load — schedule maintenance' : '🔴 Offline — contact biomedical engineering'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Drawers and modals ── */}
      {(showAddDrug || editingDrug) && <DrugDrawer />}
      {(showAddEq   || editingEq)   && <EqDrawer />}
      {confirmDeleteDrug && (
        <DeleteModal
          label={drugs.find(d => d.id === confirmDeleteDrug)?.name ?? ''}
          onConfirm={() => deleteDrug(confirmDeleteDrug)}
          onCancel={() => setConfirmDeleteDrug(null)}
        />
      )}
      {confirmDeleteEq && (
        <DeleteModal
          label={equipment.find(e => e.id === confirmDeleteEq)?.name ?? ''}
          onConfirm={() => deleteEq(confirmDeleteEq)}
          onCancel={() => setConfirmDeleteEq(null)}
        />
      )}
    </div>
  );
};
// ─── Module: Analytics ────────────────────────────────────────────────────────

// ── Analytics rich data ──────────────────────────────────────────────────────
const ANALYTICS_DATA = {
  revenue: {
    weekly: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      values: [8400, 9200, 7800, 11000, 10500, 6800, 4200],
      total: '₹57,900', change: '↑ 4.2% vs last week',
    },
    monthly: {
      labels: ['Oct','Nov','Dec','Jan','Feb','Mar','Apr'],
      values: [42000,47000,51000,38000,54000,59000,62000],
      total: '₹62,000', change: '↑ 5.1% vs Mar',
    },
    yearly: {
      labels: ['2022','2023','2024','2025','2026 YTD'],
      values: [420000,510000,580000,640000,240000],
      total: '₹6.4L', change: '↑ 10.3% vs 2024',
    },
  },
  departments: [
    { name:'General Medicine', rev:'₹2.35 Cr', pct:28, color:'var(--primary)' },
    { name:'Orthopaedics',     rev:'₹1.85 Cr', pct:22, color:'var(--blue)'    },
    { name:'Dermatology',      rev:'₹1.25 Cr', pct:15, color:'var(--purple)'  },
    { name:'ENT',              rev:'₹0.95 Cr', pct:11, color:'var(--amber)'   },
    { name:'Others',           rev:'₹2.05 Cr', pct:24, color:'var(--green)'   },
  ],
  payers: [
    { name:'Self Pay',  rev:'₹4.20 Cr', pct:50, color:'var(--primary)' },
    { name:'Insurance', rev:'₹2.60 Cr', pct:31, color:'var(--blue)'    },
    { name:'TPA',       rev:'₹1.10 Cr', pct:13, color:'var(--amber)'   },
    { name:'Corporate', rev:'₹0.55 Cr', pct:6,  color:'var(--purple)'  },
  ],
  paymentModes: [
    { name:'Cash',         pct:38, color:'var(--primary)' },
    { name:'UPI / Online', pct:32, color:'var(--blue)'    },
    { name:'Card',         pct:18, color:'var(--amber)'   },
    { name:'Insurance',    pct:12, color:'var(--purple)'  },
  ],
  visits: {
    weekly:  { total:54,   doctors:[{ name:'Dr. Chen',count:18,color:'var(--primary)'},{ name:'Dr. Patel',count:22,color:'var(--amber)'},{ name:'Dr. Kim',count:14,color:'var(--green)'}] },
    monthly: { total:231,  doctors:[{ name:'Dr. Chen',count:78,color:'var(--primary)'},{ name:'Dr. Patel',count:91,color:'var(--amber)'},{ name:'Dr. Kim',count:62,color:'var(--green)'}] },
    yearly:  { total:2630, doctors:[{ name:'Dr. Chen',count:890,color:'var(--primary)'},{ name:'Dr. Patel',count:1020,color:'var(--amber)'},{ name:'Dr. Kim',count:720,color:'var(--green)'}] },
  },
};

type Period = 'weekly' | 'monthly' | 'yearly';
type FilterCat = 'datetime' | 'department' | 'doctor' | 'visittype' | 'payer' | 'payment' | 'pharmacy' | 'labdiag';
interface AppliedFilter { id: string; label: string; value: string; }

// ── Doctor revenue weights (used to scale data when doctor filter is applied)
const DOCTOR_WEIGHTS: Record<string, number> = {
  'Dr. Chen': 0.34, 'Dr. Patel': 0.39, 'Dr. Kim': 0.27,
};

// ── Maps a date preset string to a Period
function presetToPeriod(preset: string): Period {
  if (preset === 'Today' || preset === 'Yesterday' || preset === 'This Week') return 'weekly';
  if (preset === 'This Year' || preset === 'YTD vs Last YTD') return 'yearly';
  return 'monthly';
}

// ── Derive all chart/KPI data from applied filters
function computeFilteredData(appliedFilters: AppliedFilter[], revPeriod: Period, visitPeriod: Period) {
  // Date filter → override period if set
  const dateFilter  = appliedFilters.find(f => f.id === 'date');
  const effRevPeriod   = dateFilter ? presetToPeriod(dateFilter.value) : revPeriod;
  const effVisitPeriod = dateFilter ? presetToPeriod(dateFilter.value) : visitPeriod;

  // Doctor filter → revenue/visit multiplier
  const doctorFilter = appliedFilters.find(f => f.id === 'doctor');
  const selDoctors   = doctorFilter ? doctorFilter.value.split(', ') : [];
  const doctorMult   = selDoctors.length
    ? selDoctors.reduce((s, d) => s + (DOCTOR_WEIGHTS[d] ?? 0), 0)
    : 1;

  // Revenue data (scaled by doctor multiplier)
  const baseRev  = ANALYTICS_DATA.revenue[effRevPeriod];
  const revVals  = baseRev.values.map(v => Math.round(v * doctorMult));
  const lastVal  = revVals[revVals.length - 1];
  const totalRev = lastVal;
  const revLabel = effRevPeriod === 'yearly'
    ? `₹${(totalRev / 100000).toFixed(1)}L`
    : `₹${totalRev.toLocaleString()}`;

  // Visit type filter → splits consultation / procedure / other
  const visitTypeFilter = appliedFilters.find(f => f.id === 'visit');
  const selTypes = visitTypeFilter ? visitTypeFilter.value.split(', ') : [];
  const hasConsult   = !selTypes.length || selTypes.includes('Consultation') || selTypes.includes('Follow-Up');
  const hasProcedure = !selTypes.length || selTypes.includes('Procedure');
  const hasOther     = !selTypes.length || selTypes.includes('Emergency') || selTypes.includes('Wellness Check');
  const consultRev   = hasConsult   ? Math.round(totalRev * 0.46) : 0;
  const procedureRev = hasProcedure ? Math.round(totalRev * 0.40) : 0;
  const otherRev     = hasOther     ? Math.round(totalRev * 0.14) : 0;

  // Department filter
  const deptFilter = appliedFilters.find(f => f.id === 'dept');
  let departments = ANALYTICS_DATA.departments;
  if (deptFilter) {
    const selDepts = deptFilter.value.split(', ');
    departments = departments.filter(d => selDepts.includes(d.name));
    const totalPct = departments.reduce((s, d) => s + d.pct, 0) || 1;
    departments = departments.map(d => ({ ...d, pct: Math.round((d.pct / totalPct) * 100) }));
  }

  // Payer filter
  const payerFilter = appliedFilters.find(f => f.id === 'payer');
  let payers = ANALYTICS_DATA.payers;
  if (payerFilter) {
    const selPayers = payerFilter.value.split(', ');
    payers = payers.filter(p => selPayers.includes(p.name));
    const totalPct = payers.reduce((s, p) => s + p.pct, 0) || 1;
    payers = payers.map(p => ({ ...p, pct: Math.round((p.pct / totalPct) * 100) }));
  }

  // Payment mode filter
  const paymentFilter = appliedFilters.find(f => f.id === 'payment');
  let paymentModes = ANALYTICS_DATA.paymentModes;
  if (paymentFilter) {
    const selModes = paymentFilter.value.split(', ');
    paymentModes = paymentModes.filter(p => selModes.includes(p.name));
    const totalPct = paymentModes.reduce((s, p) => s + p.pct, 0) || 1;
    paymentModes = paymentModes.map(p => ({ ...p, pct: Math.round((p.pct / totalPct) * 100) }));
  }

  // Doctor visits
  const baseVisit = ANALYTICS_DATA.visits[effVisitPeriod];
  const visitsDoc = selDoctors.length
    ? baseVisit.doctors.filter(d => selDoctors.includes(d.name))
    : baseVisit.doctors;
  const visitsTotal = visitsDoc.reduce((s, d) => s + d.count, 0);

  // Pharmacy and Lab revenue (fixed splits of total, affected by visittype filter)
  const hasPharmacy = !selTypes.length || selTypes.includes('Pharmacy');
  const hasLab      = !selTypes.length || selTypes.includes('Lab & Diagnostics');
  const pharmacyRev = hasPharmacy ? Math.round(totalRev * 0.18) : 0;
  const labRev      = hasLab      ? Math.round(totalRev * 0.12) : 0;

  return {
    effRevPeriod, effVisitPeriod,
    revData: {
      labels: baseRev.labels,
      values: revVals,
      total:  revLabel,
      change: doctorMult < 1
        ? `Filtered · ${Math.round(doctorMult * 100)}% of total`
        : baseRev.change,
    },
    kpis: {
      total:     revLabel,
      totalSub:  doctorMult < 1 ? `Filtered — ${selDoctors.join(', ')}` : '↑ 5.1% vs last period',
      consult:   `₹${consultRev.toLocaleString()}`,
      procedure: `₹${procedureRev.toLocaleString()}`,
      other:     `₹${otherRev.toLocaleString()}`,
      pharmacy:  `₹${pharmacyRev.toLocaleString()}`,
      lab:       `₹${labRev.toLocaleString()}`,
    },
    departments,
    payers,
    paymentModes,
    visits: { total: visitsTotal, doctors: visitsDoc },
  };
}

const AnalyticsModule: React.FC = () => {
  const [revPeriod,   setRevPeriod]   = useState<Period>('monthly');
  const [visitPeriod, setVisitPeriod] = useState<Period>('monthly');
  const [showFilter,  setShowFilter]  = useState(false);
  const [filterCat,   setFilterCat]   = useState<FilterCat>('datetime');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  // Temp filter state (inside modal — only committed on Apply)
  const [tmpDatePreset,   setTmpDatePreset]   = useState('This Month');
  const [tmpDateFrom,     setTmpDateFrom]     = useState('2026-06-01');
  const [tmpDateTo,       setTmpDateTo]       = useState('2026-06-30');
  const [tmpDepts,        setTmpDepts]        = useState<string[]>([]);
  const [tmpDoctors,      setTmpDoctors]      = useState<string[]>([]);
  const [tmpVisitTypes,   setTmpVisitTypes]   = useState<string[]>([]);
  const [tmpPayers,       setTmpPayers]       = useState<string[]>([]);
  const [tmpPayModes,     setTmpPayModes]     = useState<string[]>([]);

  // ── COMPUTE FILTERED DATA ────────────────────────────────────────────────────
  const fd = useMemo(
    () => computeFilteredData(appliedFilters, revPeriod, visitPeriod),
    [appliedFilters, revPeriod, visitPeriod]
  );
  // Sync period dropdowns to what the filter computed
  useEffect(() => {
    if (appliedFilters.find(f => f.id === 'date')) {
      setRevPeriod(fd.effRevPeriod);
      setVisitPeriod(fd.effVisitPeriod);
    }
  }, [appliedFilters, fd.effRevPeriod, fd.effVisitPeriod]);

  const maxRev   = Math.max(...fd.revData.values, 1);
  const maxVisit = Math.max(...fd.visits.doctors.map(d => d.count), 1);

  const DEPTS       = ['General Medicine','Orthopaedics','Dermatology','ENT','Cardiology','Paediatrics','Others'];
  const DOCTORS     = ['Dr. Chen','Dr. Patel','Dr. Kim'];
  const VISIT_TYPES = ['Consultation','Follow-Up','Procedure','Emergency','Wellness Check'];
  const PAYER_TYPES = ['Self Pay','Insurance','TPA','Corporate'];
  const PAY_MODES   = ['Cash','UPI / Online','Card','Insurance / TPA'];
  const DATE_PRESETS= ['Today','Yesterday','This Week','This Month','This Quarter','This Year','Custom Range'];

  const periodLabel: Record<Period, string> = { weekly:'Weekly', monthly:'Monthly', yearly:'Yearly' };

  const openFilter = () => {
    setTmpDatePreset('This Month'); setTmpDateFrom('2026-06-01'); setTmpDateTo('2026-06-30');
    setTmpDepts([]); setTmpDoctors([]); setTmpVisitTypes([]); setTmpPayers([]); setTmpPayModes([]);
    setShowFilter(true);
  };

  const applyFilter = () => {
    const filters: AppliedFilter[] = [];
    const dateVal = tmpDatePreset === 'Custom Range'
      ? `${tmpDateFrom} → ${tmpDateTo}` : tmpDatePreset;
    filters.push({ id:'date', label:'Date', value: dateVal });
    if (tmpDepts.length)      filters.push({ id:'dept',    label:'Department', value: tmpDepts.join(', ')      });
    if (tmpDoctors.length)    filters.push({ id:'doctor',  label:'Doctor',     value: tmpDoctors.join(', ')    });
    if (tmpVisitTypes.length) filters.push({ id:'visit',   label:'Visit Type', value: tmpVisitTypes.join(', ') });
    if (tmpPayers.length)     filters.push({ id:'payer',   label:'Payer',      value: tmpPayers.join(', ')     });
    if (tmpPayModes.length)   filters.push({ id:'payment', label:'Payment',    value: tmpPayModes.join(', ')   });
    setAppliedFilters(filters);
    setShowFilter(false);
  };

  const toggleItem = (arr: string[], set: (v: string[]) => void, item: string) =>
    set(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);

  const dropdownStyle: React.CSSProperties = {
    padding:'7px 32px 7px 14px', borderRadius:9, border:'1px solid var(--border)',
    background:'var(--bg)', fontSize:13, fontWeight:600, cursor:'pointer',
    fontFamily:'inherit', color:'var(--text)', outline:'none', appearance:'none',
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center',
  };

  // ── Export handler ──────────────────────────────────────────────────────────
  const handleExport = () => {
    const filterSummary = appliedFilters.length
      ? appliedFilters.map(f => `${f.label}: ${f.value}`).join(' | ')
      : 'No filters applied — showing all data';
    const html = `<!DOCTYPE html><html><head><title>Revenue Report — Vexoo</title>
    <style>body{font-family:Arial,sans-serif;padding:32px;color:#1a2540;}h1{font-size:22px;}
    h2{font-size:14px;color:#0d9488;border-bottom:2px solid #e6faf8;padding-bottom:6px;margin-top:26px;margin-bottom:12px;}
    .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:8px;}
    .kpi{background:#f0f9f6;border-radius:10px;padding:14px 16px;}
    .kpi-lbl{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;}
    .kpi-val{font-size:22px;font-weight:800;color:#0d9488;}
    .kpi-sub{font-size:11px;color:#0d9488;margin-top:3px;}
    table{width:100%;border-collapse:collapse;font-size:13px;}
    th{background:#f4f8f7;padding:8px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;}
    td{padding:9px 12px;border-bottom:1px solid #f0f0f0;}
    .filter-box{background:#fffef5;border:1px solid #fde68a;border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:13px;}
    .footer{margin-top:40px;color:#94a3b8;font-size:11px;border-top:1px solid #f0f0f0;padding-top:12px;}
    </style></head><body>
    <h1>Revenue Analytics Report — Vexoo</h1>
    <div style="color:#64748b;font-size:13px;margin-bottom:20px;">Generated on ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})} · ${new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>
    <div class="filter-box"><strong>Applied Filters:</strong> ${filterSummary}</div>
    <h2>1. Revenue Summary</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-lbl">Total OP Revenue</div><div class="kpi-val">${fd.kpis.total}</div><div class="kpi-sub">${fd.kpis.totalSub}</div></div>
      <div class="kpi"><div class="kpi-lbl">Consultation Revenue</div><div class="kpi-val">${fd.kpis.consult}</div></div>
      <div class="kpi"><div class="kpi-lbl">Procedure Revenue</div><div class="kpi-val">${fd.kpis.procedure}</div></div>
      <div class="kpi"><div class="kpi-lbl">Other Charges</div><div class="kpi-val">${fd.kpis.other}</div></div>
      <div class="kpi" style="background:#f5f3ff"><div class="kpi-lbl">Pharmacy Revenue</div><div class="kpi-val" style="color:#7c3aed">${fd.kpis.pharmacy}</div></div>
      <div class="kpi" style="background:#fff1f2"><div class="kpi-lbl">Lab & Diagnostics Revenue</div><div class="kpi-val" style="color:#e11d48">${fd.kpis.lab}</div></div>
    </div>
    <h2>2. Revenue Trend (${periodLabel[fd.effRevPeriod]})</h2>
    <table><tr><th>Period</th><th>Revenue</th></tr>
    ${fd.revData.labels.map((l,i)=>`<tr><td>${l}</td><td>₹${fd.revData.values[i].toLocaleString()}</td></tr>`).join('')}
    </table>
    <h2>3. Doctor-Wise Patient Visits</h2>
    <table><tr><th>Doctor</th><th>Visits</th><th>% of Total</th></tr>
    ${fd.visits.doctors.map(d=>`<tr><td>${d.name}</td><td>${d.count}</td><td>${fd.visits.total?Math.round((d.count/fd.visits.total)*100):0}%</td></tr>`).join('')}
    </table>
    <h2>4. Department-Wise Revenue</h2>
    <table><tr><th>Department</th><th>Revenue</th><th>Share</th></tr>
    ${fd.departments.map(d=>`<tr><td>${d.name}</td><td>${d.rev}</td><td>${d.pct}%</td></tr>`).join('')}
    </table>
    <h2>5. Payer-Wise Revenue</h2>
    <table><tr><th>Payer Type</th><th>Revenue</th><th>Share</th></tr>
    ${fd.payers.map(p=>`<tr><td>${p.name}</td><td>${p.rev}</td><td>${p.pct}%</td></tr>`).join('')}
    </table>
    <h2>6. Payment Mode Split</h2>
    <table><tr><th>Payment Mode</th><th>Share</th></tr>
    ${fd.paymentModes.map(p=>`<tr><td>${p.name}</td><td>${p.pct}%</td></tr>`).join('')}
    </table>
    <div class="footer">Vexoo · Confidential — For internal hospital use only</div>
    </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  // ── Reusable checklist ──────────────────────────────────────────────────────
  const CheckList = ({ items, selected, onChange }: { items:string[]; selected:string[]; onChange:(v:string[])=>void }) => (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {items.map(item => {
        const checked = selected.includes(item);
        return (
          <div key={item} onClick={() => toggleItem(selected, onChange, item)}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, cursor:'pointer', border:`1.5px solid ${checked?'var(--primary)':'var(--border)'}`, background:checked?'var(--primary-light)':'white', transition:'all 0.13s' }}>
            <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${checked?'var(--primary)':'#d1d5db'}`, background:checked?'var(--primary)':'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.13s' }}>
              {checked && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5L4 7.5 8.5 2" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{ fontSize:13.5, fontWeight:checked?600:400, color:checked?'var(--primary)':'var(--text)' }}>{item}</span>
          </div>
        );
      })}
    </div>
  );

  const totalCriteria = [tmpDepts,tmpDoctors,tmpVisitTypes,tmpPayers,tmpPayModes].flat().length;

  return (
    <div className="ha-content ha-fade">

      {/* ── Page header ── */}
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Analytics & Reports</div>
          <div className="ha-section-sub">OP Revenue Dashboard · Hospital performance overview</div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={openFilter} style={{ display:'flex', alignItems:'center', gap:7, background:appliedFilters.length?'var(--primary)':'var(--card)', color:appliedFilters.length?'white':'var(--text-muted)', border:appliedFilters.length?'none':'1px solid var(--border)', borderRadius:9, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            <SvgIcon path="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A1 1 0 0018.95 4H5.04a1 1 0 00-.79 1.61z" size={14} color="currentColor" />
            Custom Filter
            {appliedFilters.length > 0 && (
              <span style={{ background:'white', color:'var(--primary)', borderRadius:20, padding:'1px 8px', fontSize:11, fontWeight:800, marginLeft:2 }}>
                {appliedFilters.length}
              </span>
            )}
          </button>
          <button onClick={handleExport} style={{ display:'flex', alignItems:'center', gap:7, background:'var(--card)', color:'var(--text-muted)', border:'1px solid var(--border)', borderRadius:9, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={14} color="currentColor" />
            Export
          </button>
        </div>
      </div>

      {/* ── Applied filter chips ── */}
      {appliedFilters.length > 0 && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16, padding:'10px 16px', background:'var(--primary-light)', borderRadius:12, alignItems:'center', border:'1px solid var(--primary)' }}>
          <span style={{ fontSize:12, fontWeight:700, color:'var(--primary)', flexShrink:0 }}>Filters Applied ({appliedFilters.length}):</span>
          {appliedFilters.map(f => (
            <span key={f.id} style={{ display:'flex', alignItems:'center', gap:5, background:'white', border:'1px solid var(--primary)', borderRadius:20, padding:'3px 12px', fontSize:12, fontWeight:500, color:'var(--primary)' }}>
              <strong>{f.label}:</strong>&nbsp;{f.value}
              <button onClick={() => setAppliedFilters(prev => prev.filter(x => x.id !== f.id))} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--primary)', padding:0, marginLeft:4, lineHeight:1, fontSize:15, fontWeight:700 }}>×</button>
            </span>
          ))}
          <button onClick={() => setAppliedFilters([])} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--rose)', fontSize:12, fontWeight:700, marginLeft:'auto' }}>✕ Clear All</button>
        </div>
      )}

      {/* ── KPI cards — driven by fd.kpis ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:12 }}>
        {([
          ['Total OP Revenue',     fd.kpis.total,     fd.kpis.totalSub,    'var(--primary-light)','var(--primary)'],
          ['Consultation Revenue', fd.kpis.consult,   '46% of filtered',   'var(--blue-light)',   'var(--blue)'  ],
          ['Procedure Revenue',    fd.kpis.procedure, '40% of filtered',   'var(--amber-light)',  'var(--amber)' ],
        ] as [string,string,string,string,string][]).map(([l,v,sub,bg,c]) => (
          <div key={l} className="ha-card" style={{ background:bg, border:'none' }}>
            <div style={{ fontSize:11, color:c, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c, letterSpacing:'-0.5px', marginBottom:4 }}>{v}</div>
            <div style={{ fontSize:12, color:c, opacity:0.8 }}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        {([
          ['Other Charges',           fd.kpis.other,    '14% of filtered',   'var(--green-light)',   'var(--green)'   ],
          ['Pharmacy Revenue',        fd.kpis.pharmacy, '18% of filtered',   'var(--purple-light)',  'var(--purple)'  ],
          ['Lab & Diagnostics Rev.', fd.kpis.lab,      '12% of filtered',   'var(--rose-light)',    'var(--rose)'    ],
        ] as [string,string,string,string,string][]).map(([l,v,sub,bg,c]) => (
          <div key={l} className="ha-card" style={{ background:bg, border:'none' }}>
            <div style={{ fontSize:11, color:c, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c, letterSpacing:'-0.5px', marginBottom:4 }}>{v}</div>
            <div style={{ fontSize:12, color:c, opacity:0.8 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Revenue trend — driven by fd.revData ── */}
      <div className="ha-card" style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:15 }}>Revenue Trend</div>
            <div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>{fd.revData.total} · {fd.revData.change}</div>
          </div>
          <select value={revPeriod} onChange={e => setRevPeriod(e.target.value as Period)} style={dropdownStyle}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:150 }}>
          {fd.revData.values.map((v, i) => (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:500 }}>
                {fd.effRevPeriod==='yearly' ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}k`}
              </div>
              <div style={{ width:'100%', height:`${(v/maxRev)*120}px`, borderRadius:'6px 6px 0 0', background:'var(--primary)', opacity: i===fd.revData.values.length-1 ? 1 : 0.3, transition:'height 0.4s ease' }} />
              <span style={{ fontSize:10.5, color:'var(--text-muted)', textAlign:'center' }}>{fd.revData.labels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Department + Payer — driven by fd.departments / fd.payers ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <div className="ha-card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Revenue by Department</div>
          {fd.departments.length === 0
            ? <div style={{ color:'var(--text-muted)', fontSize:13, padding:'20px 0', textAlign:'center' }}>No departments match the filter</div>
            : fd.departments.map(d => (
              <div key={d.name} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:13 }}>{d.name}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:d.color }}>{d.rev} <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:400 }}>({d.pct}%)</span></span>
                </div>
                <div style={{ background:'#f1f5f9', borderRadius:4, height:8, overflow:'hidden' }}>
                  <div style={{ width:`${d.pct}%`, height:'100%', background:d.color, borderRadius:4, transition:'width 0.4s' }} />
                </div>
              </div>
            ))}
        </div>
        <div className="ha-card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Revenue by Payer Type</div>
          {fd.payers.length === 0
            ? <div style={{ color:'var(--text-muted)', fontSize:13, padding:'20px 0', textAlign:'center' }}>No payer types match the filter</div>
            : fd.payers.map(p => (
              <div key={p.name} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:13 }}>{p.name}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:p.color }}>{p.rev} <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:400 }}>({p.pct}%)</span></span>
                </div>
                <div style={{ background:'#f1f5f9', borderRadius:4, height:8, overflow:'hidden' }}>
                  <div style={{ width:`${p.pct}%`, height:'100%', background:p.color, borderRadius:4, transition:'width 0.4s' }} />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ── Payment modes + Doctor visits — driven by fd.paymentModes / fd.visits ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div className="ha-card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Payment Mode Split</div>
          {fd.paymentModes.length === 0
            ? <div style={{ color:'var(--text-muted)', fontSize:13, padding:'20px 0', textAlign:'center' }}>No payment modes match the filter</div>
            : fd.paymentModes.map(p => (
              <div key={p.name} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:13 }}>{p.name}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:p.color }}>{p.pct}%</span>
                </div>
                <div style={{ background:'#f1f5f9', borderRadius:4, height:8, overflow:'hidden' }}>
                  <div style={{ width:`${p.pct}%`, height:'100%', background:p.color, borderRadius:4, transition:'width 0.4s' }} />
                </div>
              </div>
            ))}
        </div>
        <div className="ha-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <div style={{ fontWeight:700, fontSize:14 }}>Patient Visits — Doctor Wise</div>
            <select value={visitPeriod} onChange={e => setVisitPeriod(e.target.value as Period)}
              style={{ ...dropdownStyle, padding:'5px 28px 5px 10px', fontSize:12 }}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div style={{ background:'var(--primary-light)', borderRadius:10, padding:'10px 14px', marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:12, color:'var(--primary)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Total Visits</span>
            <span style={{ fontSize:22, fontWeight:800, color:'var(--primary)' }}>{fd.visits.total.toLocaleString()}</span>
          </div>
          {fd.visits.doctors.length === 0
            ? <div style={{ color:'var(--text-muted)', fontSize:13, padding:'16px 0', textAlign:'center' }}>No doctors match the filter</div>
            : fd.visits.doctors.map(d => (
              <div key={d.name} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:13, fontWeight:500 }}>{d.name}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:d.color }}>{d.count.toLocaleString()} <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:400 }}>({fd.visits.total ? Math.round((d.count/fd.visits.total)*100) : 0}%)</span></span>
                </div>
                <div style={{ background:'#f1f5f9', borderRadius:4, height:8, overflow:'hidden' }}>
                  <div style={{ width:`${(d.count/maxVisit)*100}%`, height:'100%', background:d.color, borderRadius:4, transition:'width 0.4s ease' }} />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ── Custom Filter Modal ── */}
      {showFilter && (
        <>
          <div onClick={() => setShowFilter(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:100 }} />
          <div onClick={e => e.stopPropagation()} style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'white', borderRadius:18, width:700, maxWidth:'96vw', maxHeight:'88vh', display:'flex', flexDirection:'column', zIndex:101, boxShadow:'0 24px 80px rgba(0,0,0,0.25)', overflow:'hidden' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
              <div>
                <div style={{ fontWeight:800, fontSize:17 }}>Custom Filter</div>
                <div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>Select criteria — the entire dashboard updates on Apply</div>
              </div>
              <button onClick={() => setShowFilter(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, width:34, height:34, cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'190px 1fr', flex:1, overflow:'hidden', minHeight:0 }}>
              <div style={{ borderRight:'1px solid var(--border)', overflowY:'auto', background:'var(--bg)', padding:'10px 8px' }}>
                {([
                  ['datetime',   '📅','Date & Time'        ],
                  ['department', '🏥','Department'          ],
                  ['doctor',     '👩‍⚕️','Doctor'              ],
                  ['visittype',  '📋','Service / Visit Type'],
                  ['payer',      '💳','Payer Type'          ],
                  ['payment',    '💰','Payment Mode'        ],
                  ['pharmacy',   '💊','Pharmacy'            ],
                  ['labdiag',    '🧪','Lab & Diagnostics'   ],
                ] as [FilterCat,string,string][]).map(([id, icon, label]) => (
                  <button key={id} onClick={() => setFilterCat(id)}
                    style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'10px 13px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight: filterCat===id?700:400, background:filterCat===id?'white':'transparent', color:filterCat===id?'var(--primary)':'var(--text-muted)', textAlign:'left', marginBottom:3, boxShadow: filterCat===id?'0 1px 4px rgba(0,0,0,0.08)':'none', transition:'all 0.13s' }}>
                    <span style={{ fontSize:15 }}>{icon}</span>{label}
                  </button>
                ))}
              </div>
              <div style={{ overflowY:'auto', padding:'20px 24px' }}>
                {filterCat === 'datetime' && (
                  <div>
                    <div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Date Range</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:22 }}>
                      {DATE_PRESETS.map(p => (
                        <button key={p} onClick={() => setTmpDatePreset(p)}
                          style={{ padding:'6px 14px', borderRadius:9, border:`1.5px solid ${tmpDatePreset===p?'var(--primary)':'var(--border)'}`, background:tmpDatePreset===p?'var(--primary)':'white', color:tmpDatePreset===p?'white':'var(--text-muted)', fontSize:12.5, fontWeight:tmpDatePreset===p?700:400, cursor:'pointer', fontFamily:'inherit', transition:'all 0.13s' }}>
                          {p}
                        </button>
                      ))}
                    </div>
                    {tmpDatePreset === 'Custom Range' && (
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:22 }}>
                        <div>
                          <div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, marginBottom:6 }}>From</div>
                          <input type="date" value={tmpDateFrom} onChange={e => setTmpDateFrom(e.target.value)} style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', boxSizing:'border-box' }} />
                        </div>
                        <div>
                          <div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, marginBottom:6 }}>To</div>
                          <input type="date" value={tmpDateTo} onChange={e => setTmpDateTo(e.target.value)} style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', boxSizing:'border-box' }} />
                        </div>
                      </div>
                    )}
                    <div style={{ fontWeight:700, fontSize:13.5, marginBottom:12 }}>Quick Presets</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {['MTD vs Last MTD','QTD vs Last QTD','YTD vs Last YTD','Last 7 Days vs Prev 7 Days'].map(p => (
                        <button key={p} style={{ padding:'6px 13px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg)', fontSize:12, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)' }}>{p}</button>
                      ))}
                    </div>
                  </div>
                )}
                {filterCat === 'department' && <div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Select Departments</div><CheckList items={DEPTS} selected={tmpDepts} onChange={setTmpDepts} /></div>}
                {filterCat === 'doctor'     && <div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Select Doctors</div><CheckList items={DOCTORS} selected={tmpDoctors} onChange={setTmpDoctors} /></div>}
                {filterCat === 'visittype'  && <div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Select Visit Types</div><CheckList items={VISIT_TYPES} selected={tmpVisitTypes} onChange={setTmpVisitTypes} /></div>}
                {filterCat === 'payer'      && <div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Select Payer Types</div><CheckList items={PAYER_TYPES} selected={tmpPayers} onChange={setTmpPayers} /></div>}
                {filterCat === 'payment'    && <div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Select Payment Modes</div><CheckList items={PAY_MODES} selected={tmpPayModes} onChange={setTmpPayModes} /></div>}
                {filterCat === 'pharmacy' && (
                  <div>
                    <div style={{ fontWeight:700, fontSize:13.5, marginBottom:8 }}>Pharmacy Revenue Filter</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7, marginBottom:14 }}>
                      Selecting "Pharmacy" from the Visit Type filter will isolate pharmacy revenue. Use the toggle below to include or exclude it from the KPI cards.
                    </div>
                    <CheckList items={['Pharmacy Sales','Over-the-Counter','Controlled Substances']} selected={tmpVisitTypes} onChange={setTmpVisitTypes} />
                  </div>
                )}
                {filterCat === 'labdiag' && (
                  <div>
                    <div style={{ fontWeight:700, fontSize:13.5, marginBottom:8 }}>Lab & Diagnostics Revenue Filter</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7, marginBottom:14 }}>
                      Isolate revenue from diagnostics tests and lab panels. Select the categories below to filter the Lab & Diagnostics revenue card.
                    </div>
                    <CheckList items={['Blood Tests','Imaging','Pulmonary Function','Cardiac Tests','Microbiology']} selected={tmpVisitTypes} onChange={setTmpVisitTypes} />
                  </div>
                )}
              </div>
            </div>
            <div style={{ padding:'14px 24px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0, background:'var(--bg)' }}>
              <span style={{ fontSize:12.5, color:'var(--text-muted)' }}>
                {totalCriteria > 0 ? `${totalCriteria} criteria selected` : 'No criteria selected'}
              </span>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => { setTmpDepts([]); setTmpDoctors([]); setTmpVisitTypes([]); setTmpPayers([]); setTmpPayModes([]); setTmpDatePreset('This Month'); }}
                  style={{ padding:'9px 22px', borderRadius:10, border:'1px solid var(--border)', background:'white', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, color:'var(--text-muted)', fontWeight:500 }}>
                  Reset
                </button>
                <button onClick={applyFilter} className="ha-action-btn">Apply Filter</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Module: Reviews & Feedback ───────────────────────────────────────────────

interface PatientReview {
  id: string;
  patient: string;
  patientId: string;
  doctor: string;
  department: string;
  visitDate: string;
  receivedDate: string;
  visitType: string;
  overallRating: number;
  recommend: boolean;
  comment: string;
  status: 'New' | 'Read';
  ratings: {
    hospitalization: number;
    doctorCare: number;
    nursingCare: number;
    waitTime: number;
    pharmacy: number;
    cleanliness: number;
    billing: number;
  };
}

const REVIEWS: PatientReview[] = [
  {
    id:'R-001', patient:'Sarah Johnson', patientId:'P-001',
    doctor:'Dr. Chen', department:'Cardiology',
    visitDate:'20-04-2026', receivedDate:'21-04-2026 09:14 AM',
    visitType:'Follow-Up', overallRating:5, recommend:true, status:'New',
    comment:'Dr. Chen was extremely thorough and explained everything clearly. The nursing staff was very attentive and the ward was spotless. Only minor issue was the 15-minute wait at the pharmacy counter, but overall a wonderful experience.',
    ratings:{ hospitalization:5, doctorCare:5, nursingCare:5, waitTime:3, pharmacy:4, cleanliness:5, billing:4 },
  },
  {
    id:'R-002', patient:'Marcus Williams', patientId:'P-002',
    doctor:'Dr. Patel', department:'Endocrinology',
    visitDate:'18-04-2026', receivedDate:'19-04-2026 11:32 AM',
    visitType:'Consultation', overallRating:4, recommend:true, status:'New',
    comment:'Dr. Patel is very knowledgeable and took time to answer all my questions. Appointment scheduling was smooth. The waiting area was comfortable. Lab results were available quickly.',
    ratings:{ hospitalization:4, doctorCare:5, nursingCare:4, waitTime:4, pharmacy:4, cleanliness:4, billing:3 },
  },
  {
    id:'R-003', patient:'Elena Rodriguez', patientId:'P-003',
    doctor:'Dr. Kim', department:'Pulmonology',
    visitDate:'22-04-2026', receivedDate:'23-04-2026 02:45 PM',
    visitType:'Check-Up', overallRating:3, recommend:true, status:'Read',
    comment:'Good doctor and helpful staff. However I had to wait almost 45 minutes past my appointment time. The billing process was also a bit confusing. Hope the wait time issue gets addressed.',
    ratings:{ hospitalization:3, doctorCare:4, nursingCare:3, waitTime:2, pharmacy:3, cleanliness:4, billing:2 },
  },
  {
    id:'R-004', patient:"James O'Brien", patientId:'P-004',
    doctor:'Dr. Chen', department:'Cardiology',
    visitDate:'24-04-2026', receivedDate:'25-04-2026 10:05 AM',
    visitType:'Urgent', overallRating:5, recommend:true, status:'New',
    comment:'Exceptional emergency care. The team acted immediately when I arrived and I felt safe throughout. Dr. Chen kept my family informed at every step. The ICU nursing staff went above and beyond. Cannot thank them enough.',
    ratings:{ hospitalization:5, doctorCare:5, nursingCare:5, waitTime:5, pharmacy:5, cleanliness:5, billing:4 },
  },
  {
    id:'R-005', patient:'Priya Sharma', patientId:'P-005',
    doctor:'Dr. Patel', department:'Neurology',
    visitDate:'19-04-2026', receivedDate:'20-04-2026 08:22 AM',
    visitType:'Follow-Up', overallRating:4, recommend:true, status:'Read',
    comment:'Pleasant experience overall. Dr. Patel is patient and explains the treatment plan very well. The pharmacy was well-stocked and the pharmacist explained dosage clearly. Minor issue with parking availability.',
    ratings:{ hospitalization:4, doctorCare:5, nursingCare:4, waitTime:3, pharmacy:5, cleanliness:4, billing:4 },
  },
  {
    id:'R-006', patient:'Thomas Klein', patientId:'P-006',
    doctor:'Dr. Kim', department:'Pulmonology',
    visitDate:'15-04-2026', receivedDate:'16-04-2026 03:10 PM',
    visitType:'Consultation', overallRating:2, recommend:false, status:'Read',
    comment:'Disappointed with this visit. The appointment took much longer than expected and the coordination between the doctor and pharmacy was poor. My prescription was not ready even after waiting 1 hour. Billing also had an error that took time to fix.',
    ratings:{ hospitalization:2, doctorCare:3, nursingCare:2, waitTime:1, pharmacy:1, cleanliness:3, billing:1 },
  },
  {
    id:'R-007', patient:'Aisha Okonkwo', patientId:'P-007',
    doctor:'Dr. Patel', department:'Psychiatry',
    visitDate:'10-04-2026', receivedDate:'11-04-2026 11:00 AM',
    visitType:'Consultation', overallRating:5, recommend:true, status:'Read',
    comment:'Dr. Patel created a very comfortable and non-judgmental environment. The reception was welcoming and the entire process from check-in to exit was well organised. I felt genuinely cared for.',
    ratings:{ hospitalization:5, doctorCare:5, nursingCare:5, waitTime:4, pharmacy:4, cleanliness:5, billing:5 },
  },
  {
    id:'R-008', patient:'David Nguyen', patientId:'P-008',
    doctor:'Dr. Chen', department:'Cardiology',
    visitDate:'14-04-2026', receivedDate:'15-04-2026 09:50 AM',
    visitType:'Follow-Up', overallRating:4, recommend:true, status:'Read',
    comment:'Solid experience. Dr. Chen is always well-prepared and refers to previous visit notes which shows he reviews history carefully. The lab turnaround time was impressive — results in under 2 hours.',
    ratings:{ hospitalization:4, doctorCare:5, nursingCare:4, waitTime:4, pharmacy:4, cleanliness:4, billing:4 },
  },
];

function StarRating({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= value ? '#f59e0b' : '#e2e8f0'}>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
    </div>
  );
}

const RATING_LABELS: Record<string, string> = {
  hospitalization: 'Hospitalization',
  doctorCare:      'Doctor Care',
  nursingCare:     'Nursing Care',
  waitTime:        'Wait Time',
  pharmacy:        'Pharmacy',
  cleanliness:     'Cleanliness',
  billing:         'Billing & Payment',
};

const ReviewsModule: React.FC = () => {
  const [filterDoc,  setFilterDoc]  = useState('All Doctors');
  const [filterStar, setFilterStar] = useState('All Ratings');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selected,   setSelected]   = useState<PatientReview | null>(null);

  const doctors = ['All Doctors', ...Array.from(new Set(REVIEWS.map(r => r.doctor)))];

  const filtered = useMemo(() =>
    REVIEWS.filter(r =>
      (filterDoc   === 'All Doctors' || r.doctor         === filterDoc) &&
      (filterStar  === 'All Ratings' || r.overallRating  === Number(filterStar)) &&
      (filterStatus === 'All'        || r.status          === filterStatus)
    ), [filterDoc, filterStar, filterStatus]);

  // ── Aggregate KPIs ───────────────────────────────────────────────────────────
  const avgOverall = (REVIEWS.reduce((s, r) => s + r.overallRating, 0) / REVIEWS.length).toFixed(1);
  const recPct     = Math.round((REVIEWS.filter(r => r.recommend).length / REVIEWS.length) * 100);
  const newCount   = REVIEWS.filter(r => r.status === 'New').length;

  const paramAvgs: Record<string, string> = {};
  for (const key of Object.keys(RATING_LABELS)) {
    const avg = REVIEWS.reduce((s, r) => s + (r.ratings as any)[key], 0) / REVIEWS.length;
    paramAvgs[key] = avg.toFixed(1);
  }

  // ── Doctor summary ───────────────────────────────────────────────────────────
  const docSummary = Array.from(new Set(REVIEWS.map(r => r.doctor))).map(doc => {
    const docRevs = REVIEWS.filter(r => r.doctor === doc);
    const avg = (docRevs.reduce((s, r) => s + r.overallRating, 0) / docRevs.length).toFixed(1);
    return { doctor: doc, count: docRevs.length, avg };
  });

  const selectStyle: React.CSSProperties = {
    padding:'7px 28px 7px 12px', borderRadius:9, border:'1px solid var(--border)',
    background:'var(--bg)', fontSize:12.5, fontWeight:500, cursor:'pointer',
    fontFamily:'inherit', color:'var(--text)', outline:'none', appearance:'none',
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center',
  };

  const ratingBg  = (v: number) => v >= 4 ? 'var(--green-light)'  : v === 3 ? 'var(--amber-light)'  : 'var(--rose-light)';
  const ratingCol = (v: number) => v >= 4 ? 'var(--green)'         : v === 3 ? 'var(--amber)'         : 'var(--rose)';

  return (
    <>
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Reviews & Feedback</div>
          <div className="ha-section-sub">Patient feedback received after hospital visits · Read-only</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, background:'var(--amber-light)', border:'1px solid var(--amber)', borderRadius:10, padding:'6px 14px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--amber)"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          <span style={{ fontSize:12.5, fontWeight:700, color:'var(--amber)' }}>{newCount} new unread</span>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {([
          ['Overall Rating',     `${avgOverall} / 5`, 'Based on all reviews',    'var(--amber-light)',   'var(--amber)' ],
          ['Total Reviews',      String(REVIEWS.length), `${newCount} new`,      'var(--primary-light)', 'var(--primary)'],
          ['Recommend Hospital', `${recPct}%`,           'Would recommend us',   'var(--green-light)',   'var(--green)' ],
          ['Avg Wait Time Score',`${paramAvgs.waitTime}/5`,'Across all visits',  'var(--blue-light)',    'var(--blue)'  ],
        ] as [string,string,string,string,string][]).map(([l,v,sub,bg,c]) => (
          <div key={l} className="ha-card" style={{ background:bg, border:'none' }}>
            <div style={{ fontSize:11, color:c, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c, letterSpacing:'-0.5px', marginBottom:3 }}>{v}</div>
            <div style={{ fontSize:12, color:c, opacity:0.75 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── 2-column: Parameter averages + Doctor summary ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {/* Parameter breakdown */}
        <div className="ha-card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Average Score by Parameter</div>
          {Object.entries(RATING_LABELS).map(([key, label]) => {
            const val = Number(paramAvgs[key]);
            return (
              <div key={key} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                  <span style={{ fontSize:13 }}>{label}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <StarRating value={Math.round(val)} size={12} />
                    <span style={{ fontSize:12, fontWeight:700, color:ratingCol(val), background:ratingBg(val), padding:'1px 8px', borderRadius:20 }}>{val}</span>
                  </div>
                </div>
                <div style={{ background:'#f1f5f9', borderRadius:4, height:7, overflow:'hidden' }}>
                  <div style={{ width:`${(val/5)*100}%`, height:'100%', background:ratingCol(val), borderRadius:4, transition:'width 0.4s' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Doctor summary */}
        <div className="ha-card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Doctor-wise Rating Summary</div>
          {docSummary.map(d => (
            <div key={d.doctor} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:'var(--primary)', flexShrink:0 }}>
                {d.doctor.split(' ').slice(0,2).map(n => n[0]).join('')}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13.5 }}>{d.doctor}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>{d.count} review{d.count > 1 ? 's' : ''}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:18, fontWeight:800, color:'var(--amber)' }}>{d.avg}</div>
                <StarRating value={Math.round(Number(d.avg))} size={12} />
              </div>
            </div>
          ))}
          <div style={{ marginTop:14, padding:'12px 14px', background:'var(--primary-light)', borderRadius:10 }}>
            <div style={{ fontSize:11.5, color:'var(--primary)', fontWeight:600, marginBottom:6 }}>DISTRIBUTION</div>
            {[5,4,3,2,1].map(star => {
              const cnt = REVIEWS.filter(r => r.overallRating === star).length;
              const pct = Math.round((cnt / REVIEWS.length) * 100);
              return (
                <div key={star} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                  <span style={{ fontSize:11, fontWeight:600, color:'var(--primary)', width:12 }}>{star}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <div style={{ flex:1, background:'rgba(255,255,255,0.5)', borderRadius:4, height:6, overflow:'hidden' }}>
                    <div style={{ width:`${pct}%`, height:'100%', background:'var(--primary)', borderRadius:4 }} />
                  </div>
                  <span style={{ fontSize:11, color:'var(--primary)', fontWeight:600, width:28, textAlign:'right' }}>{cnt}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
        <span style={{ fontSize:12.5, fontWeight:600, color:'var(--text-muted)' }}>Filter:</span>
        <select value={filterDoc} onChange={e => setFilterDoc(e.target.value)} style={selectStyle}>
          {doctors.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={filterStar} onChange={e => setFilterStar(e.target.value)} style={selectStyle}>
          <option>All Ratings</option>
          {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} Stars</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
          <option>All</option>
          <option>New</option>
          <option>Read</option>
        </select>
        <span style={{ fontSize:12.5, color:'var(--text-muted)', marginLeft:'auto' }}>
          Showing {filtered.length} of {REVIEWS.length} reviews
        </span>
      </div>

      {/* ── Review list ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.length === 0 && (
          <div className="ha-card" style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-muted)' }}>
            <div style={{ fontSize:36, marginBottom:12 }}>⭐</div>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>No reviews match this filter</div>
            <div style={{ fontSize:13 }}>Try adjusting the filters above.</div>
          </div>
        )}
        {filtered.map(r => (
          <div key={r.id} className="ha-card"
            style={{ borderLeft:`4px solid ${r.overallRating >= 4 ? 'var(--green)' : r.overallRating === 3 ? 'var(--amber)' : 'var(--rose)'}`, cursor:'pointer', transition:'box-shadow 0.15s' }}
            onClick={() => setSelected(r)}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:'var(--primary)', flexShrink:0 }}>
                  {r.patient.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{r.patient} <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:400 }}>· {r.patientId}</span></div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{r.doctor} · {r.department} · {r.visitType} · {r.visitDate}</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                {r.status === 'New' && (
                  <span style={{ fontSize:10, fontWeight:800, padding:'2px 9px', borderRadius:20, background:'var(--primary)', color:'white' }}>NEW</span>
                )}
                <StarRating value={r.overallRating} size={15} />
                <span style={{ fontSize:14, fontWeight:800, color:'var(--amber)' }}>{r.overallRating}.0</span>
                <span style={{ fontSize:12, color: r.recommend ? 'var(--green)' : 'var(--rose)', fontWeight:600 }}>
                  {r.recommend ? '👍 Recommends' : '👎 Does not recommend'}
                </span>
              </div>
            </div>

            {/* Parameter chips */}
            <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:10 }}>
              {Object.entries(r.ratings).map(([key, val]) => (
                <span key={key} style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:ratingBg(val as number), color:ratingCol(val as number) }}>
                  {RATING_LABELS[key]} {val}/5
                </span>
              ))}
            </div>

            {/* Comment */}
            <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.7, background:'var(--bg)', padding:'10px 14px', borderRadius:10, border:'1px solid var(--border)' }}>
              "{r.comment}"
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', marginTop:10 }}>
              <span style={{ fontSize:11.5, color:'var(--text-muted)' }}>Received: {r.receivedDate}</span>
              <span style={{ fontSize:12, color:'var(--primary)', fontWeight:600 }}>Click to view details →</span>
            </div>
          </div>
        ))}
      </div>

      </div>

      {/* ── Detail modal — outside ha-fade so position:fixed works correctly ── */}
      {selected && (
        <>
          <div onClick={() => setSelected(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100 }} />
          <div onClick={e => e.stopPropagation()} style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'white', borderRadius:18, width:600, maxWidth:'94vw', maxHeight:'90vh', overflowY:'auto', zIndex:101, boxShadow:'0 24px 80px rgba(0,0,0,0.2)' }}>
            {/* Modal header */}
            <div style={{ padding:'22px 26px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>Review Detail</div>
                <div style={{ fontSize:12.5, color:'var(--text-muted)' }}>Received: {selected.receivedDate}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, width:34, height:34, cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>✕</button>
            </div>

            <div style={{ padding:'22px 26px', display:'flex', flexDirection:'column', gap:18 }}>
              {/* Patient + doctor info */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {([
                  ['Patient',    `${selected.patient} (${selected.patientId})`],
                  ['Doctor',     selected.doctor],
                  ['Department', selected.department],
                  ['Visit Type', selected.visitType],
                  ['Visit Date', selected.visitDate],
                  ['Status',     selected.status],
                ] as [string,string][]).map(([k,v]) => (
                  <div key={k} style={{ background:'var(--bg)', borderRadius:10, padding:'10px 14px' }}>
                    <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{k}</div>
                    <div style={{ fontSize:13.5, fontWeight:600, color: k==='Status'&&v==='New'?'var(--primary)':'var(--text)' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Overall rating + recommend */}
              <div style={{ display:'flex', alignItems:'center', gap:20, background: selected.overallRating >= 4 ? 'var(--green-light)' : selected.overallRating === 3 ? 'var(--amber-light)' : 'var(--rose-light)', borderRadius:14, padding:'16px 20px' }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color: ratingCol(selected.overallRating), textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>Overall Rating</div>
                  <div style={{ fontSize:36, fontWeight:900, color: ratingCol(selected.overallRating) }}>{selected.overallRating}.0</div>
                </div>
                <StarRating value={selected.overallRating} size={22} />
                <div style={{ marginLeft:'auto', textAlign:'right' }}>
                  <div style={{ fontSize:11, fontWeight:700, color: selected.recommend ? 'var(--green)' : 'var(--rose)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>Recommendation</div>
                  <div style={{ fontSize:16, fontWeight:800, color: selected.recommend ? 'var(--green)' : 'var(--rose)' }}>
                    {selected.recommend ? '👍 Yes, recommends' : '👎 Does not recommend'}
                  </div>
                </div>
              </div>

              {/* Parameter-wise ratings */}
              <div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Parameter-wise Ratings</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {Object.entries(selected.ratings).map(([key, val]) => (
                    <div key={key} style={{ padding:'12px 14px', background:'var(--bg)', borderRadius:10, border:'1px solid var(--border)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                        <span style={{ fontSize:12.5, fontWeight:600 }}>{RATING_LABELS[key]}</span>
                        <span style={{ fontSize:13, fontWeight:800, color:ratingCol(val as number), background:ratingBg(val as number), padding:'1px 9px', borderRadius:20 }}>{val}/5</span>
                      </div>
                      <div style={{ background:'#e2e8f0', borderRadius:4, height:6, overflow:'hidden' }}>
                        <div style={{ width:`${((val as number)/5)*100}%`, height:'100%', background:ratingCol(val as number), borderRadius:4 }} />
                      </div>
                      <StarRating value={val as number} size={11} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Patient Comment</div>
                <div style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.8, background:'var(--bg)', padding:'16px 18px', borderRadius:12, border:'1px solid var(--border)', fontStyle:'italic' }}>
                  "{selected.comment}"
                </div>
              </div>

              {/* Read-only notice */}
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'var(--amber-light)', borderRadius:10, border:'1px solid var(--amber)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--amber)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                <span style={{ fontSize:12.5, color:'var(--amber)', fontWeight:600 }}>This feedback is read-only. Responses are managed by the patient communication team.</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
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

  return (
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Notifications</div>
          <div className="ha-section-sub">{notifs.filter(n => !n.read).length} unread</div>
        </div>
      </div>
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
            style={{ border: n.read ? '1px solid var(--border)' : '1.5px solid var(--border)' }}
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
  );
};

// ─── Staff Management Screen ──────────────────────────────────────────────────
type StaffTabId = 'all' | 'doctor' | 'reception' | 'pharmacy' | 'labtech';
const StaffScreen: React.FC<{ hospitalName?: string }> = ({ hospitalName = 'Hospital' }) => {
  const [tab, setTab]             = useState<StaffTabId>('all');
  const [staffList, setStaffList] = useState<StaffMember[]>(STAFF_MEMBERS_INIT);
  const [showDrawer, setShowDrawer]   = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);
  const [resetPwStaff, setResetPwStaff] = useState<(StaffMember & { newPass: string }) | null>(null);
  const [credentials, setCredentials] = useState<(StaffMember & { tempPass: string }) | null>(null);
  const [form, setForm] = useState({
    name:'', role:'Doctor' as StaffRole, specialization:'Cardiologist',
    email:'', phone:'', licenceNo:'',
  });

  const counts = {
    all:       staffList.length,
    doctor:    staffList.filter(s => s.role === 'Doctor').length,
    reception: staffList.filter(s => s.role === 'Receptionist').length,
    pharmacy:  staffList.filter(s => s.role === 'Pharmacist').length,
    labtech:   staffList.filter(s => s.role === 'LabTech').length,
  };

  const filtered = tab === 'all'       ? staffList
    : tab === 'doctor'    ? staffList.filter(s => s.role === 'Doctor')
    : tab === 'reception' ? staffList.filter(s => s.role === 'Receptionist')
    : tab === 'pharmacy'  ? staffList.filter(s => s.role === 'Pharmacist')
    : staffList.filter(s => s.role === 'LabTech');

  const nextId = (role: StaffRole) => {
    const prefix = { Doctor:'D', Receptionist:'R', Pharmacist:'P', LabTech:'L' }[role];
    const n = String(staffList.filter(s => s.role === role).length + 1).padStart(3,'0');
    return `EMP-${prefix}${n}`;
  };
  const genPass = () => 'Vex@' + Math.random().toString(36).slice(2,6).toUpperCase();

  // ── Open drawer for CREATE ───────────────────────────────────────────────────
  const openCreateDrawer = () => {
    setEditingStaff(null);
    setForm({ name:'', role:'Doctor', specialization:'Cardiologist', email:'', phone:'', licenceNo:'' });
    setShowDrawer(true);
  };

  // ── Open drawer for EDIT ─────────────────────────────────────────────────────
  const openEditDrawer = (s: StaffMember) => {
    setEditingStaff(s);
    setForm({
      name:           s.name,
      role:           s.role,
      specialization: s.specialization ?? 'Cardiologist',
      email:          s.email,
      phone:          s.phone,
      licenceNo:      s.licenceNo ?? '',
    });
    setShowDrawer(true);
  };

  // ── Save (create or update) ───────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const dept = form.role === 'Doctor'       ? form.specialization
               : form.role === 'Receptionist' ? 'Reception'
               : form.role === 'Pharmacist'   ? 'Pharmacy' : 'Diagnostics';

    if (editingStaff) {
      // UPDATE existing member
      setStaffList(prev => prev.map(s => s.id === editingStaff.id
        ? { ...s, name:form.name, role:form.role, specialization:form.role==='Doctor'?form.specialization:undefined,
            department:dept, email:form.email, phone:form.phone, licenceNo:form.licenceNo||undefined }
        : s));
      setShowDrawer(false);
      setEditingStaff(null);
    } else {
      // CREATE new member
      const member: StaffMember = {
        id: `S-${Date.now()}`, name:form.name, role:form.role,
        specialization: form.role === 'Doctor' ? form.specialization : undefined,
        department: dept, email: form.email, phone: form.phone,
        employeeId: nextId(form.role),
        joinDate: new Date().toLocaleDateString('en-IN',{month:'short',year:'numeric'}),
        status: 'Active', licenceNo: form.licenceNo || undefined,
      };
      const pass = genPass();
      setStaffList(s => [...s, member]);
      setShowDrawer(false);
      setCredentials({ ...member, tempPass: pass });
    }
    setForm({ name:'', role:'Doctor', specialization:'Cardiologist', email:'', phone:'', licenceNo:'' });
  };

  // ── Reset Password ────────────────────────────────────────────────────────────
  const handleResetPw = (s: StaffMember) => {
    setResetPwStaff({ ...s, newPass: genPass() });
  };

  const inpStyle: React.CSSProperties = {
    width:'100%', padding:'9px 12px', border:'1px solid var(--border)',
    borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit',
    background:'var(--bg)', color:'var(--text)', boxSizing:'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize:12, fontWeight:600, color:'var(--muted)', marginBottom:5, display:'block',
  };

  return (
    <>
    {/* ── Main content — note: drawers/modals are OUTSIDE this div ── */}
    <div className="ha-scroll ha-fade" style={{ padding:20 }}>

      {/* KPI strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:20 }}>
        {([['Total Staff',counts.all,'var(--text)'],['Doctors',counts.doctor,'#3b82f6'],
           ['Reception',counts.reception,'#ec4899'],['Pharmacy',counts.pharmacy,'#0d9488'],
           ['Lab Tech',counts.labtech,'#7c3aed']] as [string,number,string][]).map(([l,v,c]) => (
          <div key={l} className="ha-card">
            <div style={{ fontSize:10.5, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {([['all','All Staff'],['doctor','Doctors'],['reception','Reception'],
             ['pharmacy','Pharmacy'],['labtech','Lab Tech']] as [StaffTabId,string][]).map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding:'6px 14px', borderRadius:9, cursor:'pointer', fontFamily:'inherit',
              fontSize:12.5, fontWeight:tab===id?700:500,
              border:tab===id?'none':'1px solid var(--border)',
              background:tab===id?'var(--primary)':'var(--card)',
              color:tab===id?'white':'var(--muted)',
            }}>
              {label} ({counts[id]})
            </button>
          ))}
        </div>
        <button className="ha-new-btn" onClick={openCreateDrawer}>+ Create Staff Profile</button>
      </div>

      {/* Staff cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {filtered.map(s => {
          const [bg, color] = ROLE_COLORS[s.role];
          const abb = s.name.split(' ').map(n => n[0]).join('').slice(0,2);
          return (
            <div key={s.id} className="ha-card" style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:15, flexShrink:0 }}>{abb}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{s.name}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{s.specialization ?? ROLE_LABELS[s.role]}</div>
                </div>
                <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20, background:bg, color, flexShrink:0 }}>
                  {s.role === 'LabTech' ? 'Lab Tech' : s.role}
                </span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {([['Employee ID',s.employeeId],['Status',s.status],['Email',s.email],['Phone',s.phone||'—']] as [string,string][]).map(([k,v]) => (
                  <div key={k} style={{ background:'var(--bg)', borderRadius:8, padding:'7px 10px' }}>
                    <div style={{ fontSize:10.5, color:'var(--muted)', marginBottom:2 }}>{k}</div>
                    <div style={{ fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:k==='Status'?(v==='Active'?'#16a34a':'#e11d48'):'var(--text)' }}>{v}</div>
                  </div>
                ))}
              </div>
              {s.licenceNo && (
                <div style={{ background:ROLE_COLORS[s.role][0], borderRadius:8, padding:'7px 10px' }}>
                  <div style={{ fontSize:10.5, color:ROLE_COLORS[s.role][1], fontWeight:600, marginBottom:2 }}>Licence / Reg. No.</div>
                  <div style={{ fontSize:12, fontWeight:700, color:ROLE_COLORS[s.role][1], fontFamily:'monospace' }}>{s.licenceNo}</div>
                </div>
              )}
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => openEditDrawer(s)}
                  style={{ flex:1, padding:'7px', borderRadius:9, border:'1px solid var(--border)', background:'transparent', fontSize:12.5, cursor:'pointer', fontFamily:'inherit', color:'var(--muted)' }}>
                  Edit
                </button>
                <button onClick={() => setViewingStaff(s)}
                  style={{ flex:1, padding:'7px', borderRadius:9, border:'none', background:ROLE_COLORS[s.role][0], fontSize:12.5, cursor:'pointer', fontFamily:'inherit', color:ROLE_COLORS[s.role][1], fontWeight:600 }}>
                  Details
                </button>
                <button onClick={() => handleResetPw(s)}
                  style={{ flex:1, padding:'7px', borderRadius:9, border:'none', background:'var(--rose-light)', fontSize:12.5, cursor:'pointer', fontFamily:'inherit', color:'var(--rose)', fontWeight:600 }}>
                  Reset PW
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'48px 20px', color:'var(--muted)' }}>
            <div style={{ fontSize:40, marginBottom:10 }}>👤</div>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>No profiles created yet</div>
            <div style={{ fontSize:13, marginBottom:16 }}>Create the first staff profile for this role.</div>
            <button className="ha-new-btn" onClick={openCreateDrawer}>+ Create Staff Profile</button>
          </div>
        )}
      </div>
    </div>

    {/* ════ DRAWERS & MODALS — outside ha-fade so position:fixed works ════ */}

    {/* ── Create / Edit Drawer ── */}
    {showDrawer && (
      <>
        <div onClick={() => setShowDrawer(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
        <div style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          {/* Drawer header */}
          <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:17 }}>{editingStaff ? 'Edit Staff Profile' : 'Create Staff Profile'}</div>
              <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:2 }}>
                {editingStaff ? `Editing: ${editingStaff.name}` : hospitalName}
              </div>
            </div>
            <button onClick={() => setShowDrawer(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:12.5, fontFamily:'inherit' }}>✕ Close</button>
          </div>

          {/* Drawer body */}
          <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:16 }}>

            {/* Role picker — only show when creating */}
            {!editingStaff && (
              <div>
                <label style={labelStyle}>STAFF ROLE *</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {(['Doctor','Receptionist','Pharmacist','LabTech'] as StaffRole[]).map(role => {
                    const [bg, color] = ROLE_COLORS[role];
                    const sel = form.role === role;
                    return (
                      <button key={role} onClick={() => setForm(f => ({...f, role}))}
                        style={{ padding:'10px 12px', borderRadius:10, border:`2px solid ${sel?color:'var(--border)'}`, background:sel?bg:'transparent', cursor:'pointer', fontFamily:'inherit', fontWeight:sel?700:400, color:sel?color:'var(--muted)', fontSize:13, textAlign:'left' }}>
                        {ROLE_LABELS[role]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label style={labelStyle}>Full Name *</label>
              <input style={inpStyle} value={form.name} onChange={e => setForm(f => ({...f,name:e.target.value}))} placeholder="e.g. Dr. Arjun Mehta" />
            </div>

            {form.role === 'Doctor' && (
              <div>
                <label style={labelStyle}>Specialization *</label>
                <select style={{...inpStyle, cursor:'pointer'}} value={form.specialization} onChange={e => setForm(f => ({...f,specialization:e.target.value}))}>
                  {DOCTOR_SPECS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={labelStyle}>Work Email *</label>
                <input style={inpStyle} type="email" value={form.email} onChange={e => setForm(f => ({...f,email:e.target.value}))} placeholder="name@vexoo.in" />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input style={inpStyle} value={form.phone} onChange={e => setForm(f => ({...f,phone:e.target.value}))} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            {form.role !== 'Receptionist' && (
              <div>
                <label style={labelStyle}>
                  {form.role==='Doctor' ? 'MCI Registration No.' : form.role==='Pharmacist' ? 'Pharmacy Licence No.' : 'Lab Technician Licence No.'}
                </label>
                <input style={inpStyle} value={form.licenceNo} onChange={e => setForm(f => ({...f,licenceNo:e.target.value}))} placeholder={form.role==='Doctor'?'MCI/REG/XXXXX':'e.g. PH/2024/TS/XXXXX'} />
              </div>
            )}

            {/* Only show auto-generated info for new profiles */}
            {!editingStaff && (
              <div style={{ background:'#fffef5', border:'1px solid #fde68a', borderRadius:12, padding:14 }}>
                <div style={{ fontSize:11.5, fontWeight:700, color:'#92400e', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Auto-Generated on Creation</div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:12.5, color:'#78350f' }}>Employee ID</span>
                  <span style={{ fontSize:12.5, fontWeight:700, fontFamily:'monospace', color:'#92400e' }}>{nextId(form.role)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontSize:12.5, color:'#78350f' }}>Temp Password</span>
                  <span style={{ fontSize:12.5, fontWeight:700, fontFamily:'monospace', color:'#92400e' }}>Vex@••••••</span>
                </div>
                <div style={{ fontSize:11.5, color:'#92400e', marginTop:8, lineHeight:1.5 }}>Share these with the staff member. Password must be changed on first login.</div>
              </div>
            )}
          </div>

          {/* Drawer footer */}
          <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
            <button onClick={handleSave} style={{ flex:1, justifyContent:'center', display:'flex', alignItems:'center', padding:'11px 18px', borderRadius:10, border:'none', background:'#0d9488', color:'white', fontSize:13.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              {editingStaff ? '✓ Save Changes' : 'Create Profile & Generate Credentials'}
            </button>
            <button onClick={() => setShowDrawer(false)} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
          </div>
        </div>
      </>
    )}

    {/* ── Credentials reveal modal ── */}
    {credentials && (
      <div onClick={() => setCredentials(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, backdropFilter:'blur(2px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:16, padding:28, width:400, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign:'center', marginBottom:18 }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:26 }}>✓</div>
            <div style={{ fontWeight:800, fontSize:18 }}>Profile Created!</div>
            <div style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>Share these login credentials with {credentials.name}.</div>
          </div>
          {([['Name',credentials.name],['Role',ROLE_LABELS[credentials.role]],['Employee ID',credentials.employeeId],['Login Email',credentials.email]] as [string,string][]).map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 12px', background:'var(--bg)', borderRadius:9, marginBottom:8 }}>
              <span style={{ fontSize:13, color:'var(--muted)' }}>{k}</span>
              <span style={{ fontSize:13, fontWeight:700, fontFamily:k==='Employee ID'?'monospace':'inherit' }}>{v}</span>
            </div>
          ))}
          <div style={{ background:'#fffef5', border:'1px solid #fde68a', borderRadius:12, padding:14, marginBottom:18, textAlign:'center' }}>
            <div style={{ fontSize:12, color:'#92400e', fontWeight:600, marginBottom:6 }}>Temporary Password — Show Once</div>
            <div style={{ fontSize:24, fontWeight:800, fontFamily:'monospace', color:'#92400e', letterSpacing:3 }}>{credentials.tempPass}</div>
            <div style={{ fontSize:11.5, color:'#92400e', marginTop:6 }}>Must be changed on first login</div>
          </div>
          <button onClick={() => setCredentials(null)} className="ha-new-btn" style={{ width:'100%', justifyContent:'center' }}>Done</button>
        </div>
      </div>
    )}

    {/* ── Staff Details modal ── */}
    {viewingStaff && (
      <div onClick={() => setViewingStaff(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, backdropFilter:'blur(2px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:16, padding:28, width:480, maxWidth:'92vw', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:ROLE_COLORS[viewingStaff.role][0], color:ROLE_COLORS[viewingStaff.role][1], display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, flexShrink:0 }}>
              {viewingStaff.name.split(' ').map(n => n[0]).join('').slice(0,2)}
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:17 }}>{viewingStaff.name}</div>
              <div style={{ fontSize:13, color:'var(--muted)' }}>{viewingStaff.specialization ?? ROLE_LABELS[viewingStaff.role]} · {viewingStaff.department}</div>
            </div>
            <span style={{ marginLeft:'auto', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, background:ROLE_COLORS[viewingStaff.role][0], color:ROLE_COLORS[viewingStaff.role][1] }}>
              {viewingStaff.role === 'LabTech' ? 'Lab Tech' : viewingStaff.role}
            </span>
          </div>

          {/* Info grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {([
              ['Employee ID',  viewingStaff.employeeId],
              ['Status',       viewingStaff.status],
              ['Email',        viewingStaff.email],
              ['Phone',        viewingStaff.phone || '—'],
              ['Department',   viewingStaff.department],
              ['Joined',       viewingStaff.joinDate],
            ] as [string,string][]).map(([k,v]) => (
              <div key={k} style={{ background:'var(--bg)', borderRadius:10, padding:'10px 14px' }}>
                <div style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{k}</div>
                <div style={{ fontSize:13.5, fontWeight:600, color:k==='Status'?(v==='Active'?'#16a34a':'#e11d48'):'var(--text)' }}>{v}</div>
              </div>
            ))}
          </div>

          {viewingStaff.licenceNo && (
            <div style={{ background:ROLE_COLORS[viewingStaff.role][0], borderRadius:10, padding:'10px 14px', marginBottom:16 }}>
              <div style={{ fontSize:11, color:ROLE_COLORS[viewingStaff.role][1], fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>
                {viewingStaff.role==='Doctor' ? 'MCI Registration No.' : viewingStaff.role==='Pharmacist' ? 'Pharmacy Licence No.' : 'Lab Technician Licence No.'}
              </div>
              <div style={{ fontSize:14, fontWeight:800, fontFamily:'monospace', color:ROLE_COLORS[viewingStaff.role][1] }}>{viewingStaff.licenceNo}</div>
            </div>
          )}

          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button onClick={() => { setViewingStaff(null); openEditDrawer(viewingStaff); }}
              style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, fontWeight:600 }}>
              Edit Profile
            </button>
            <button onClick={() => setViewingStaff(null)}
              style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'var(--primary)', color:'white', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, fontWeight:600 }}>
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ── Reset Password modal ── */}
    {resetPwStaff && (
      <div onClick={() => setResetPwStaff(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, backdropFilter:'blur(2px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ background:'white', borderRadius:16, padding:28, width:380, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign:'center', marginBottom:18 }}>
            <div style={{ width:50, height:50, borderRadius:'50%', background:'var(--amber-light)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22 }}>🔑</div>
            <div style={{ fontWeight:800, fontSize:17 }}>Password Reset</div>
            <div style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>New temporary password for {resetPwStaff.name}</div>
          </div>
          <div style={{ background:'#fffef5', border:'1px solid #fde68a', borderRadius:12, padding:18, marginBottom:18, textAlign:'center' }}>
            <div style={{ fontSize:12, color:'#92400e', fontWeight:600, marginBottom:8 }}>New Temporary Password — Show Once</div>
            <div style={{ fontSize:26, fontWeight:800, fontFamily:'monospace', color:'#92400e', letterSpacing:4 }}>{resetPwStaff.newPass}</div>
            <div style={{ fontSize:11.5, color:'#92400e', marginTop:8 }}>Share this with {resetPwStaff.name}. They must change it on next login.</div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'var(--bg)', borderRadius:9, marginBottom:16 }}>
            <span style={{ fontSize:13, color:'var(--muted)' }}>Staff Member</span>
            <span style={{ fontSize:13, fontWeight:700 }}>{resetPwStaff.name}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'var(--bg)', borderRadius:9, marginBottom:16 }}>
            <span style={{ fontSize:13, color:'var(--muted)' }}>Login Email</span>
            <span style={{ fontSize:13, fontWeight:700 }}>{resetPwStaff.email}</span>
          </div>
          <button onClick={() => setResetPwStaff(null)} className="ha-new-btn" style={{ width:'100%', justifyContent:'center' }}>Done</button>
        </div>
      </div>
    )}
    </>
  );
};
// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC<{
  active:    ModuleId;
  onNav:     (m: ModuleId) => void;
  collapsed: boolean;
  onToggle:  () => void;
  mobileOpen: boolean;
  adminName:  string;
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
        <div className="ha-user-identity">
          <div className="ha-avatar">{abb}</div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div className="ha-user-name">{adminName}</div>
              <div className="ha-user-role">Administrator</div>
            </div>
          )}
        </div>
        <button className="ha-signout-btn" onClick={onSignOut} type="button" title="Sign out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </nav>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────
// UPDATED: accepts onSignOut so the hover-card "Sign out" link works;
// card now matches the Patient-screen style (avatar · name · role · email ·
// divider · View/Edit Profile · Sign out).

const Header: React.FC<{
  title: string;
  onHamburger: () => void;
  adminName: string;
  onProfileClick: () => void;
  onSignOut?: () => void;
}> = ({ title, onHamburger, adminName, onProfileClick, onSignOut }) => {
  const [search, setSearch] = useState('');
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const abb = initials(adminName);

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
      <button className="ha-help-btn" aria-label="Help">
        <SvgIcon path="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" size={15} color="currentColor" />
        <span>Help</span>
      </button>

      {/* ── Profile wrap — hover shows Patient-style card ── */}
      <div className="ha-profile-wrap">
        {/* Clicking the avatar opens the full-screen profile modal */}
        <div className="ha-header-avatar" onClick={onProfileClick}>{abb}</div>

        {/* Hover card */}
        <div className="ha-profile-tooltip">
          <div className="ha-tt-avatar">{abb}</div>
          <div className="ha-tt-name">{adminName}</div>
          <div className="ha-tt-sub">Administrator</div>
          <div className="ha-tt-sub">admin@vexoo.in</div>
          <div className="ha-tt-divider" />
          <button className="ha-tt-action profile" onClick={onProfileClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            View / Edit Profile
          </button>
          <button className="ha-tt-action signout" onClick={onSignOut}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────

export default function HospitalAdminScreen({ adminName = 'Anita Reddy', onSignOut }: HospitalAdminScreenProps) {
  const [module,     setModule]     = useState<ModuleId>('dashboard');
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

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
      case 'staff':         return <StaffScreen hospitalName="Apollo Multispecialty" />;
      case 'reviews':       return <ReviewsModule />;
      default:              return <Dashboard setModule={setModule} />;
    }
  }, [module]);

  return (
    <div className="ha-root">
      <style>{CSS}</style>

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
            onProfileClick={() => setShowProfile(true)}
            onSignOut={onSignOut}
          />
          {moduleEl}
        </div>
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
              <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--primary)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'white', fontSize:20, fontWeight:700 }}>{initials(adminName)}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:17 }}>{adminName}</div>
                <div style={{ fontSize:13, color:'var(--text-muted)' }}>Administrator · Hospital Admin Portal</div>
              </div>
            </div>
            {[['Full Name', adminName], ['Email', 'admin@vexoo.in'], ['Phone', '+91 98765 43210'], ['Role', 'Hospital Administrator']].map(([label, val]) => (
              <div key={label} style={{ marginBottom:14 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>{label}</div>
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
