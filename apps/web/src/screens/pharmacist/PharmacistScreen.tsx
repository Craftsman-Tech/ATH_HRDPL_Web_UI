/**
 * ============================================================================
 *  PharmacistScreen.tsx — Pharmacist Portal
 * ============================================================================
 *  Dark-green sidebar, light body portal for pharmacy staff.
 *  Faithfully ported from Vexoo_Pharmacist.html.
 *
 *  Screens (6):
 *    Prescription Queue · Verification · Drug Inventory
 *    Dispensing Log · Drug Interactions · Reports & Analytics
 *
 *  Route:           /pharmacy  (protected, role === 'Pharmacist')
 *  Suggested path:  apps/web/src/screens/pharmacist/PharmacistScreen.tsx
 *
 *  Props:
 *    pharmacistName?  — from AuthContext (e.g. "Mei Perez")
 *    onSignOut?       — called when Logout is clicked
 *
 *  FIX (Jun 2026):
 *  - Header now shows clickable profile avatar (top-right) with hover tooltip
 *    displaying user details. Click opens an editable profile modal.
 *  - Single Sign out button only in sidebar. No duplicate logout in header.
 * ============================================================================
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type ScreenId  = 'queue' | 'verify' | 'stock' | 'history' | 'interact' | 'reports';
type RxStatus  = 'Pending' | 'Verifying' | 'Ready' | 'Dispensed';
type ChipColor = 'primary' | 'amber' | 'rose' | 'blue' | 'green' | 'purple' | 'gray';

interface NavItem { id: ScreenId; label: string; path: string; badge?: number; }

interface Prescription {
  id: string; patient: string; pid: string; drug: string; qty: number;
  doctor: string; time: string; status: RxStatus; refills: number;
  dob: string; allergies: string; instructions: string;
}
interface StockItem {
  id: string; name: string; category: string; qty: number;
  min: number; max: number; unit: string; expiry: string;
  supplier: string; reorderQty: number;
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface PharmacistScreenProps {
  pharmacistName?: string;
  onSignOut?: () => void;
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.ph-root {
  --bg:      #f5f7fa;
  --sidebar: #1b2e2c;
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
  --border:  #e4e8f0;
  --card:    #fff;

  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--bg);
  color: var(--text);
  height: 100vh;
  overflow: hidden;
  display: flex;
}

.ph-root ::-webkit-scrollbar       { width: 5px; height: 5px; }
.ph-root ::-webkit-scrollbar-thumb { background: #cdd4d3; border-radius: 4px; }
.ph-root ::-webkit-scrollbar-track { background: transparent; }

@keyframes ph-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.ph-fade { animation: ph-fade 0.2s ease both; }

/* ── Sidebar ── */
.ph-sidebar {
  width: 228px; flex-shrink: 0;
  background: var(--sidebar);
  display: flex; flex-direction: column;
  height: 100vh; overflow-y: auto;
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
}
.ph-sidebar-logo {
  padding: 18px 20px;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.ph-logo-icon {
  width: 34px; height: 34px; background: var(--primary);
  border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ph-sidebar-stats {
  padding: 14px 14px 8px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
}
.ph-stat-pill {
  background: rgba(255,255,255,0.07); border-radius: 10px;
  padding: 10px 12px; text-align: center;
}
.ph-nav { flex: 1; padding: 8px 10px; }
.ph-nav-btn {
  display: flex; align-items: center; gap: 11px;
  width: 100%; padding: 10px 13px; border-radius: 10px;
  border: none; cursor: pointer; margin-bottom: 2px;
  font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.13s;
}
.ph-nav-btn.active   { background: var(--primary); color: white; font-weight: 600; }
.ph-nav-btn.inactive { background: transparent; color: rgba(255,255,255,0.55); font-weight: 400; }
.ph-nav-btn.inactive:hover { background: rgba(255,255,255,0.07); color: white; }
.ph-nav-badge {
  background: var(--rose); color: white;
  font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 10px;
}
.ph-sidebar-footer {
  border-top: 1px solid rgba(255,255,255,0.07); padding: 12px;
}
.ph-user-identity {
  display: flex; align-items: center; gap: 10px; padding: 8px 12px;
  border-radius: 10px; margin-bottom: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
}
.ph-user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #0891b2);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: white; font-size: 12px; flex-shrink: 0;
}
.ph-user-name { color: white; font-size: 12.5px; font-weight: 600; }
.ph-user-role { color: rgba(255,255,255,0.4); font-size: 11px; }
.ph-logout-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 9px 13px; border-radius: 10px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.55); font-size: 13px; font-weight: 500;
  font-family: inherit; cursor: pointer; width: 100%; transition: background 0.13s, color 0.13s, border-color 0.13s;
}
.ph-logout-btn:hover {
  background: rgba(225,29,72,0.12); color: #f87171;
  border-color: rgba(225,29,72,0.25);
}

/* mobile overlay */
.ph-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 9; }
.ph-overlay.open { display: block; }
.ph-hamburger {
  display: none; background: none; border: none; cursor: pointer;
  padding: 4px; color: var(--text); align-items: center; justify-content: center;
}

/* ── Main ── */
.ph-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.ph-header {
  display: flex; align-items: center; padding: 0 24px; height: 60px;
  background: var(--card); border-bottom: 1px solid var(--border);
  gap: 14px; flex-shrink: 0;
}
.ph-header-title  { font-weight: 700; font-size: 17px; }
.ph-header-spacer { flex: 1; }
.ph-search-box {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 10px; padding: 7px 14px; width: 220px;
}
.ph-search-box input {
  border: none; outline: none; background: transparent;
  font-size: 13px; width: 100%; font-family: inherit; color: var(--text);
}
.ph-header-date { font-size: 12px; color: var(--muted); }

/* ── Profile avatar + tooltip ── */
.ph-profile-wrap { position: relative; }
.ph-profile-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #0891b2);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 13px;
  cursor: pointer; flex-shrink: 0; transition: opacity 0.15s;
}
.ph-profile-avatar:hover { opacity: 0.85; }
.ph-profile-tooltip {
  position: absolute; top: calc(100% + 10px); right: 0;
  background: white; border: 1px solid var(--border);
  border-radius: 12px; padding: 14px 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  min-width: 200px; z-index: 100; pointer-events: none;
  opacity: 0; transform: translateY(-4px);
  transition: opacity 0.15s, transform 0.15s; white-space: nowrap;
}
.ph-profile-wrap:hover .ph-profile-tooltip { opacity: 1; transform: translateY(0); }

.ph-scroll { flex: 1; overflow-y: auto; }

/* ── Card ── */
.ph-card {
  background: var(--card); border-radius: 16px; padding: 20px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05); border: 1px solid var(--border);
}

/* ── Chip ── */
.ph-chip { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; white-space: nowrap; display: inline-block; }
.ph-chip-primary { background: var(--pl);  color: var(--primary); }
.ph-chip-amber   { background: var(--al);  color: var(--amber);   }
.ph-chip-rose    { background: var(--rl);  color: var(--rose);    }
.ph-chip-blue    { background: var(--bl);  color: var(--blue);    }
.ph-chip-green   { background: var(--gl);  color: var(--green);   }
.ph-chip-purple  { background: var(--pul); color: var(--purple);  }
.ph-chip-gray    { background: #f1f5f9;    color: var(--muted);   }

/* ── Table shared ── */
.ph-table { width: 100%; border-collapse: collapse; }
.ph-th { padding: 9px 18px; text-align: left; font-size: 11.5px; color: var(--muted); font-weight: 600; background: var(--bg); border-bottom: 1px solid var(--border); white-space: nowrap; }
.ph-td { padding: 12px 18px; font-size: 13px; }
.ph-tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
.ph-tr:hover { background: var(--bg) !important; }

/* ── Queue ── */
.ph-queue-layout { flex: 1; display: grid; grid-template-columns: 1fr 360px; overflow: hidden; }
.ph-queue-list   { overflow-y: auto; padding: 20px; }
.ph-queue-detail { border-left: 1px solid var(--border); overflow-y: auto; background: var(--card); }
.ph-queue-stats  { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 16px; }
.ph-queue-stat   { border-radius: 12px; padding: 12px 14px; text-align: center; border-width: 1px; border-style: solid; }
.ph-rx-row {
  border-radius: 13px; padding: 14px 18px; cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; gap: 14px; margin-bottom: 8px;
  border-style: solid;
}
.ph-rx-row.selected { background: var(--pl); border-color: var(--primary); border-width: 1.5px; }
.ph-rx-row.normal   { background: var(--card); border-color: var(--border); border-width: 1px; }
.ph-rx-row:hover    { border-color: var(--primary); }
.ph-detail-header { background: linear-gradient(135deg,#1b2e2c,#0d4038); padding: 20px 22px; color: white; }
.ph-detail-section {
  background: var(--bg); border-radius: 12px; padding: 14px 16px; border: 1px solid var(--border);
}
.ph-section-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; }
.ph-detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; gap: 12px; }
.ph-patient-avatar {
  width: 40px; height: 40px; border-radius: 50%; background: var(--pl);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: var(--primary); font-size: 13px; flex-shrink: 0;
}
.ph-interaction-box { background: #fffef5; border: 1px solid #fcd34d; border-radius: 12px; padding: 12px 14px; }
.ph-dispense-btn {
  background: var(--primary); color: white; border: none; border-radius: 12px;
  padding: 13px; font-size: 14px; font-weight: 700; cursor: pointer;
  width: 100%; font-family: inherit; transition: opacity 0.13s;
}
.ph-dispense-btn:hover { opacity: 0.88; }
.ph-dispensed-banner {
  background: var(--gl); border: 1px solid var(--green); border-radius: 12px;
  padding: 13px; text-align: center; color: var(--green); font-weight: 700; font-size: 14px;
}
.ph-print-btn {
  background: var(--bg); color: var(--muted); border: 1px solid var(--border);
  border-radius: 12px; padding: 10px; font-size: 13.5px; cursor: pointer;
  width: 100%; font-family: inherit; transition: background 0.13s;
}
.ph-print-btn:hover { background: var(--border); }

/* ── Verification ── */
.ph-verify-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 1px solid;
}
.ph-verify-item.done    { background: var(--gl); border-color: var(--green); }
.ph-verify-item.pending { background: var(--bg); border-color: var(--border); }
.ph-verify-recent-row {
  display: flex; align-items: center; gap: 14px;
  padding: 11px 0; border-bottom: 1px solid var(--border);
}
.ph-verify-recent-row:last-child { border-bottom: none; }

/* ── Stock ── */
.ph-stock-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 16px; }
.ph-stock-stat  { text-align: center; padding: 16px; }
.ph-stock-bar-wrap { background: #f1f5f9; border-radius: 4px; height: 7px; overflow: hidden; min-width: 60px; }
.ph-stock-bar { height: 100%; border-radius: 4px; transition: width 0.4s; }
.ph-stock-action-btn {
  border-radius: 8px; padding: 5px 12px; font-size: 12px;
  cursor: pointer; font-weight: 500; font-family: inherit;
}

/* ── History ── */
.ph-history-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 16px; }

/* ── Interactions ── */
.ph-interact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.ph-drug-input {
  padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px;
  font-size: 13.5px; outline: none; background: var(--bg);
  font-family: inherit; color: var(--text); width: 100%;
  transition: border-color 0.15s;
}
.ph-drug-input:focus { border-color: var(--primary); }
.ph-add-drug-btn {
  background: var(--bg); border: 1.5px dashed var(--border); border-radius: 10px;
  padding: 10px; font-size: 13px; color: var(--muted); cursor: pointer;
  font-family: inherit; width: 100%; transition: border-color 0.13s;
}
.ph-add-drug-btn:hover { border-color: var(--primary); color: var(--primary); }
.ph-check-btn {
  background: var(--primary); color: white; border: none; border-radius: 10px;
  padding: 12px; font-size: 14px; font-weight: 700; cursor: pointer;
  width: 100%; font-family: inherit; transition: opacity 0.13s;
}
.ph-check-btn:hover { opacity: 0.88; }

/* ── Reports ── */
.ph-reports-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.ph-bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
.ph-bar-col   { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.ph-bar-block { width: 100%; border-radius: 4px 4px 0 0; }

/* ── Responsive ── */
@media (max-width: 1080px) {
  .ph-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 20;
    transform: translateX(-100%);
  }
  .ph-sidebar.mobile-open { transform: translateX(0); }
  .ph-hamburger { display: flex !important; }
  .ph-queue-layout { grid-template-columns: 1fr; }
  .ph-queue-detail { display: none; }
  .ph-interact-layout { grid-template-columns: 1fr; }
  .ph-reports-layout  { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .ph-queue-stats  { grid-template-columns: repeat(2,1fr); }
  .ph-stock-stats  { grid-template-columns: repeat(2,1fr); }
  .ph-history-stats{ grid-template-columns: repeat(2,1fr); }
  .ph-search-box   { display: none; }
}
`;

// ─── Mock data ────────────────────────────────────────────────────────────────

const PRESCRIPTIONS: Prescription[] = [
  { id:'RX-4821', patient:'Sarah Johnson',   pid:'P-001', drug:'Lisinopril 10mg',    qty:30, doctor:'Dr. Chen',  time:'08:45 AM', status:'Pending',   refills:2, dob:'Mar 15, 1992', allergies:'Penicillin',      instructions:'Take once daily in the morning' },
  { id:'RX-4822', patient:'Marcus Williams', pid:'P-002', drug:'Metformin 500mg',    qty:60, doctor:'Dr. Patel', time:'09:30 AM', status:'Verifying',  refills:3, dob:'Jun 8, 1974',  allergies:'None known',      instructions:'Take twice daily with meals' },
  { id:'RX-4823', patient:"James O'Brien",   pid:'P-004', drug:'Amiodarone 200mg',   qty:30, doctor:'Dr. Chen',  time:'10:15 AM', status:'Ready',      refills:0, dob:'Nov 3, 1959',  allergies:'Sulfonamides',    instructions:'Take with food. Regular ECG monitoring required' },
  { id:'RX-4824', patient:'Elena Rodriguez', pid:'P-003', drug:'Salbutamol Inhaler', qty:1,  doctor:'Dr. Kim',   time:'11:00 AM', status:'Pending',    refills:1, dob:'Feb 22, 1998', allergies:'None known',      instructions:'2 puffs as needed for shortness of breath' },
  { id:'RX-4825', patient:'Priya Sharma',    pid:'P-005', drug:'Sumatriptan 50mg',   qty:9,  doctor:'Dr. Patel', time:'01:30 PM', status:'Dispensed',  refills:2, dob:'Jul 19, 1985', allergies:'Aspirin (mild)',  instructions:'Take at onset of migraine. Max 2 per day' },
  { id:'RX-4826', patient:'Thomas Klein',    pid:'P-006', drug:'Tiotropium 18mcg',   qty:30, doctor:'Dr. Kim',   time:'02:00 PM', status:'Dispensed',  refills:1, dob:'Sep 4, 1967',  allergies:'None known',      instructions:'1 capsule inhaled daily via HandiHaler device' },
];

const STOCK: StockItem[] = [
  { id:'S-001', name:'Lisinopril 10mg',    category:'Cardiovascular', qty:1240, min:200,  max:2000, unit:'tabs',  expiry:'Dec 2026', supplier:'MedSupply Co.',  reorderQty:500  },
  { id:'S-002', name:'Metformin 500mg',    category:'Diabetes',       qty:180,  min:200,  max:1500, unit:'tabs',  expiry:'Nov 2026', supplier:'PharmaDist Ltd.',reorderQty:600  },
  { id:'S-003', name:'Amiodarone 200mg',   category:'Cardiac',        qty:95,   min:100,  max:500,  unit:'tabs',  expiry:'Sep 2026', supplier:'CardioMeds Inc.',reorderQty:200  },
  { id:'S-004', name:'Salbutamol Inhaler', category:'Respiratory',    qty:48,   min:20,   max:150,  unit:'units', expiry:'Mar 2027', supplier:'RespiCare',      reorderQty:50   },
  { id:'S-005', name:'Sumatriptan 50mg',   category:'Neurology',      qty:320,  min:100,  max:800,  unit:'tabs',  expiry:'Feb 2027', supplier:'NeuroPharm',     reorderQty:300  },
  { id:'S-006', name:'Paracetamol 500mg',  category:'Analgesics',     qty:2800, min:500,  max:5000, unit:'tabs',  expiry:'Aug 2027', supplier:'GenPharma',      reorderQty:1000 },
  { id:'S-007', name:'Omeprazole 20mg',    category:'GI',             qty:640,  min:150,  max:1200, unit:'caps',  expiry:'Jul 2027', supplier:'GastroMeds',     reorderQty:400  },
  { id:'S-008', name:'Atorvastatin 40mg',  category:'Cardiovascular', qty:880,  min:200,  max:1500, unit:'tabs',  expiry:'May 2027', supplier:'MedSupply Co.',  reorderQty:500  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function initials(name: string) { return name.split(' ').map(n => n[0]).join(''); }

function stockStatus(qty: number, min: number): 'Critical' | 'Low' | 'OK' {
  if (qty < min * 0.5) return 'Critical';
  if (qty < min)       return 'Low';
  return 'OK';
}

function rxStatusColor(s: string): ChipColor {
  if (s === 'Pending')   return 'amber';
  if (s === 'Verifying') return 'blue';
  if (s === 'Ready')     return 'primary';
  if (s === 'Dispensed') return 'green';
  return 'gray';
}

function rxLeftBorderColor(s: string) {
  if (s === 'Pending')   return 'var(--amber)';
  if (s === 'Verifying') return 'var(--blue)';
  if (s === 'Ready')     return 'var(--primary)';
  return 'var(--green)';
}

function Chip({ label, color = 'primary' }: { label: string; color?: ChipColor }) {
  return <span className={`ph-chip ph-chip-${color}`}>{label}</span>;
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
  { id:'queue',    label:'Prescription Queue', badge:3, path:'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z' },
  { id:'verify',   label:'Verification',            path:'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
  { id:'stock',    label:'Drug Inventory',           path:'M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.58 1 13.5 3.08L12 4.58l-1.5-1.51C8.42 1 6 2.53 6 4.64c0 .48.11.92.18 1.36H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5.5-2.5c.72-.7 2.5-.21 2.5.97 0 .78-.59 1.53-1 2.03L14.2 8H12l2.5-4.5zM9 4.61c0-1.18 1.78-1.67 2.5-.97L14 8h-2.2C11.13 7.3 9 6.21 9 4.61zM4 19V8h6l4 4 4-4h6v11H4z' },
  { id:'history',  label:'Dispensing Log',           path:'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z' },
  { id:'interact', label:'Drug Interactions',        path:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
  { id:'reports',  label:'Reports',                  path:'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z' },
];

const SCREEN_TITLES: Record<ScreenId, string> = {
  queue:'Prescription Queue', verify:'Verification', stock:'Drug Inventory',
  history:'Dispensing Log', interact:'Drug Interaction Checker', reports:'Reports & Analytics',
};

// ─── Screen: Queue ────────────────────────────────────────────────────────────

const NEXT_STATUS: Record<RxStatus, RxStatus> = {
  Pending:'Verifying', Verifying:'Ready', Ready:'Dispensed', Dispensed:'Dispensed',
};
const ACTION_LABEL: Record<RxStatus, string> = {
  Pending:'Start Verification', Verifying:'Mark Ready', Ready:'Dispense', Dispensed:'Completed',
};

const QueueScreen: React.FC = () => {
  const [sel, setSel] = useState<Prescription>(PRESCRIPTIONS[0]);
  const [statuses, setStatuses] = useState<Record<string, RxStatus>>(
    () => Object.fromEntries(PRESCRIPTIONS.map(r => [r.id, r.status]))
  );

  const advance = () => {
    const cur = statuses[sel.id];
    if (cur === 'Dispensed') return;
    setStatuses(s => ({ ...s, [sel.id]: NEXT_STATUS[cur] }));
  };

  const counts: Record<string, number> = useMemo(() => {
    const c: Record<string, number> = { Pending:0, Verifying:0, Ready:0, Dispensed:0 };
    Object.values(statuses).forEach(s => { c[s] = (c[s] || 0) + 1; });
    return c;
  }, [statuses]);

  const curStatus = statuses[sel.id];
  const hasInteraction = sel.drug.includes('Amiodarone');

  return (
    <div className="ph-queue-layout ph-fade">
      <div className="ph-queue-list">
        <div className="ph-queue-stats">
          {([['Pending','var(--amber)','var(--al)'],['Verifying','var(--blue)','var(--bl)'],['Ready','var(--primary)','var(--pl)'],['Dispensed','var(--green)','var(--gl)']] as [string,string,string][]).map(([l,c,bg]) => (
            <div key={l} className="ph-queue-stat" style={{ background:bg, borderColor:'var(--border)' }}>
              <div style={{ fontSize:24, fontWeight:800, color:c }}>{counts[l] || 0}</div>
              <div style={{ fontSize:12, color:c, marginTop:2, fontWeight:500 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column' }}>
          {PRESCRIPTIONS.map(rx => {
            const st = statuses[rx.id];
            return (
              <div key={rx.id} className={`ph-rx-row ${sel.id === rx.id ? 'selected' : 'normal'}`}
                style={{ borderLeftWidth:4, borderLeftStyle:'solid', borderLeftColor: rxLeftBorderColor(st) }}
                onClick={() => setSel(rx)}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <span style={{ fontWeight:700, fontSize:14 }}>{rx.patient}</span>
                    <span style={{ fontSize:12, color:'var(--muted)' }}>{rx.time}</span>
                  </div>
                  <div style={{ fontSize:13, color:'var(--muted)', marginBottom:6 }}>{rx.id} · {rx.drug} × {rx.qty}</div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:12, color:'var(--muted)' }}>{rx.doctor}</span>
                    <Chip label={st} color={rxStatusColor(st)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ph-queue-detail">
        <div className="ph-detail-header">
          <div style={{ fontSize:12, opacity:0.6, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.8px' }}>Prescription Detail</div>
          <div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>{sel.id}</div>
          <div style={{ opacity:0.75, fontSize:13 }}>Prescribed by {sel.doctor}</div>
        </div>

        <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
          <div className="ph-detail-section">
            <div className="ph-section-label">Patient</div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div className="ph-patient-avatar">{initials(sel.patient)}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{sel.patient}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{sel.pid} · DOB: {sel.dob}</div>
              </div>
            </div>
            <div style={{ background:'var(--rl)', borderRadius:9, padding:'8px 12px', fontSize:12.5, color:'var(--rose)', fontWeight:600 }}>
              ⚠ Allergies: {sel.allergies}
            </div>
          </div>

          <div className="ph-detail-section">
            <div className="ph-section-label">Drug Details</div>
            {([['Medication', sel.drug], ['Quantity', `${sel.qty} units`], ['Refills Remaining', `${sel.refills} refills`], ['Instructions', sel.instructions]] as [string,string][]).map(([k, v]) => (
              <div key={k} className="ph-detail-row">
                <span style={{ fontSize:12, color:'var(--muted)', flexShrink:0 }}>{k}</span>
                <span style={{ fontSize:12.5, fontWeight:500, textAlign:'right' }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="ph-interaction-box">
            <div style={{ fontWeight:700, fontSize:13, color:'#92400e', marginBottom:6 }}>Interaction Check</div>
            <div style={{ fontSize:12.5, color:'#78350f', lineHeight:1.6 }}>
              {hasInteraction
                ? '⚠ Moderate interaction with Warfarin detected. Verify patient medication list.'
                : '✓ No significant drug interactions detected for this patient.'}
            </div>
          </div>

          {curStatus !== 'Dispensed' ? (
            <button className="ph-dispense-btn" onClick={advance}>{ACTION_LABEL[curStatus]}</button>
          ) : (
            <div className="ph-dispensed-banner">✓ Dispensed Successfully</div>
          )}
          <button className="ph-print-btn">Print Label</button>
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Verification ─────────────────────────────────────────────────────

type CheckItem = { label: string; checked: boolean };

const INITIAL_CHECKLIST: CheckItem[] = [
  { label:'Patient identity confirmed (ID checked)',         checked:true  },
  { label:'Prescriber credentials verified',                checked:true  },
  { label:'Drug name and strength correct',                 checked:true  },
  { label:'Dose appropriate for patient weight/age',        checked:false },
  { label:'No drug-drug interactions',                      checked:false },
  { label:'No contraindications with patient allergies',    checked:false },
  { label:'Correct quantity and directions',                checked:false },
  { label:'Insurance/payment verified',                     checked:false },
];

const VerifyScreen: React.FC = () => {
  const [items, setItems] = useState<CheckItem[]>(INITIAL_CHECKLIST);
  const toggle = (i: number) => setItems(list => list.map((x, j) => j === i ? { ...x, checked: !x.checked } : x));

  return (
    <div className="ph-scroll ph-fade" style={{ padding:20, display:'flex', flexDirection:'column', gap:16 }}>
      <div className="ph-card">
        <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Prescription Verification Checklist</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {items.map((item, i) => (
            <label key={i} className={`ph-verify-item ${item.checked ? 'done' : 'pending'}`} onClick={() => toggle(i)}>
              <input type="checkbox" checked={item.checked} onChange={() => toggle(i)}
                style={{ accentColor:'var(--primary)', width:16, height:16 }} />
              <span style={{ fontSize:13.5, fontWeight:500, color: item.checked ? 'var(--green)' : 'var(--text)', flex:1 }}>{item.label}</span>
              {item.checked && <SvgIcon path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" size={14} color="var(--green)" />}
            </label>
          ))}
        </div>
        <div style={{ display:'flex', gap:10, marginTop:16 }}>
          <button style={{ background:'var(--primary)', color:'white', border:'none', borderRadius:10, padding:'11px 24px', fontSize:13.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            Approve & Move to Ready
          </button>
          <button style={{ background:'var(--rl)', color:'var(--rose)', border:'1px solid var(--rose)', borderRadius:10, padding:'11px 22px', fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            Flag Issue
          </button>
        </div>
      </div>

      <div className="ph-card">
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Recent Verifications — Today</div>
        {([['RX-4821','Sarah Johnson','Lisinopril 10mg','Approved','08:52 AM'],
           ['RX-4822','Marcus Williams','Metformin 500mg','Approved','09:45 AM'],
           ['RX-4820','David Nguyen','Amlodipine 5mg','Flagged','10:10 AM']] as [string,string,string,string,string][]).map(([id, p, d, st, t]) => (
          <div key={id} className="ph-verify-recent-row">
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:13.5 }}>{p} — {d}</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>{id} · {t}</div>
            </div>
            <Chip label={st} color={st === 'Approved' ? 'primary' : st === 'Flagged' ? 'rose' : 'amber'} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Screen: Stock ────────────────────────────────────────────────────────────

const StockScreen: React.FC = () => (
  <div className="ph-scroll ph-fade" style={{ padding:20 }}>
    <div className="ph-stock-stats">
      {([['Total Items','8','var(--primary)'],['OK','5','var(--green)'],['Low','2','var(--amber)'],['Critical','1','var(--rose)']] as [string,string,string][]).map(([l, v, c]) => (
        <div key={l} className="ph-card ph-stock-stat">
          <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
          <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:2 }}>{l}</div>
        </div>
      ))}
    </div>

    <div className="ph-card" style={{ padding:0, overflow:'hidden' }}>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:15 }}>Drug Inventory</div>
      <div style={{ overflowX:'auto' }}>
        <table className="ph-table">
          <thead>
            <tr>
              {['Drug Name','Category','Stock','Min','Max','Stock Level','Expiry','Status',''].map(h => (
                <th key={h} className="ph-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STOCK.map((s, i) => {
              const st = stockStatus(s.qty, s.min);
              const pct = Math.min(100, (s.qty / s.max) * 100);
              const barColor = st === 'Critical' ? 'var(--rose)' : st === 'Low' ? 'var(--amber)' : 'var(--primary)';
              return (
                <tr key={s.id} className="ph-tr"
                  style={{ borderBottom: i < STOCK.length - 1 ? '1px solid var(--border)' : 'none', background: st === 'Critical' ? '#fff8f8' : undefined }}>
                  <td className="ph-td" style={{ fontWeight:700, fontSize:13.5 }}>{s.name}</td>
                  <td className="ph-td"><Chip label={s.category} color="gray" /></td>
                  <td className="ph-td" style={{ fontWeight:700, fontSize:14, color: st === 'Critical' ? 'var(--rose)' : st === 'Low' ? 'var(--amber)' : 'var(--text)' }}>
                    {s.qty.toLocaleString()}
                  </td>
                  <td className="ph-td" style={{ color:'var(--muted)' }}>{s.min}</td>
                  <td className="ph-td" style={{ color:'var(--muted)' }}>{s.max}</td>
                  <td className="ph-td" style={{ minWidth:120 }}>
                    <div className="ph-stock-bar-wrap">
                      <div className="ph-stock-bar" style={{ width:`${pct}%`, background:barColor }} />
                    </div>
                  </td>
                  <td className="ph-td" style={{ color:'var(--muted)' }}>{s.expiry}</td>
                  <td className="ph-td"><Chip label={st} color={st === 'Critical' ? 'rose' : st === 'Low' ? 'amber' : 'primary'} /></td>
                  <td className="ph-td">
                    <button className="ph-stock-action-btn"
                      style={{ background: st !== 'OK' ? 'var(--primary)' : 'transparent', color: st !== 'OK' ? 'white' : 'var(--muted)', border: st !== 'OK' ? 'none' : '1px solid var(--border)' }}>
                      {st !== 'OK' ? 'Reorder' : 'Adjust'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── Screen: History ──────────────────────────────────────────────────────────

const HistoryScreen: React.FC = () => (
  <div className="ph-scroll ph-fade" style={{ padding:20 }}>
    <div className="ph-history-stats">
      {([['Dispensed Today','24','var(--primary)'],['This Week','142','var(--blue)'],['This Month','538','var(--purple)']] as [string,string,string][]).map(([l, v, c]) => (
        <div key={l} className="ph-card" style={{ padding:'16px 20px' }}>
          <div style={{ fontSize:12, color:'var(--muted)', marginBottom:4 }}>{l}</div>
          <div style={{ fontSize:28, fontWeight:800, color:c }}>{v}</div>
        </div>
      ))}
    </div>

    <div className="ph-card" style={{ padding:0, overflow:'hidden' }}>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:15 }}>Dispensing Log — April 26, 2026</div>
      <div style={{ overflowX:'auto' }}>
        <table className="ph-table">
          <thead>
            <tr>
              {['Time','Rx ID','Patient','Drug','Qty','Pharmacist','Status'].map(h => (
                <th key={h} className="ph-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {([['08:52 AM','RX-4819','David Nguyen','Amlodipine 5mg',30,'M. Perez','Dispensed'],
               ['09:45 AM','RX-4820','Aisha Okonkwo','Sertraline 50mg',30,'M. Perez','Dispensed'],
               ['10:30 AM','RX-4823',"James O'Brien",'Amiodarone 200mg',30,'M. Perez','Dispensed'],
               ['11:15 AM','RX-4825','Priya Sharma','Sumatriptan 50mg',9,'M. Perez','Dispensed'],
               ['01:00 PM','RX-4826','Thomas Klein','Tiotropium 18mcg',30,'M. Perez','Dispensed']] as string[][]).map((row, i) => (
              <tr key={row[1]} className="ph-tr" style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                <td className="ph-td" style={{ color:'var(--muted)' }}>{row[0]}</td>
                <td className="ph-td" style={{ fontWeight:600, color:'var(--primary)' }}>{row[1]}</td>
                <td className="ph-td" style={{ fontWeight:500 }}>{row[2]}</td>
                <td className="ph-td">{row[3]}</td>
                <td className="ph-td">{row[4]}</td>
                <td className="ph-td" style={{ color:'var(--muted)' }}>{row[5]}</td>
                <td className="ph-td"><Chip label={row[6]} color="green" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── Screen: Interactions ─────────────────────────────────────────────────────

const InteractScreen: React.FC = () => {
  const [drugs, setDrugs] = useState(['', '']);
  const updateDrug = (i: number, val: string) => setDrugs(d => d.map((x, j) => j === i ? val : x));

  return (
    <div className="ph-scroll ph-fade" style={{ padding:20 }}>
      <div className="ph-interact-layout">
        <div className="ph-card">
          <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Drug Interaction Checker</div>
          <div style={{ fontSize:12.5, fontWeight:600, color:'var(--muted)', marginBottom:10 }}>Enter drugs to check</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
            {drugs.map((d, i) => (
              <input key={i} value={d} onChange={e => updateDrug(i, e.target.value)}
                placeholder={`Drug ${i + 1} name...`} className="ph-drug-input" />
            ))}
            <button className="ph-add-drug-btn" onClick={() => setDrugs(d => [...d, ''])}>+ Add Drug</button>
          </div>
          <button className="ph-check-btn">Check Interactions</button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div className="ph-card" style={{ background:'var(--rl)', borderColor:'#fca5a5' }}>
            <div style={{ fontWeight:700, fontSize:13.5, color:'var(--rose)', marginBottom:8 }}>🔴 Severe Interaction</div>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Amiodarone + Warfarin</div>
            <div style={{ fontSize:13, color:'#374151', lineHeight:1.6 }}>Amiodarone significantly increases Warfarin anticoagulant effect. Risk of bleeding. Reduce Warfarin dose by 30–50% and monitor INR closely.</div>
          </div>
          <div className="ph-card" style={{ background:'var(--al)', borderColor:'#fcd34d' }}>
            <div style={{ fontWeight:700, fontSize:13.5, color:'var(--amber)', marginBottom:8 }}>🟡 Moderate Interaction</div>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Lisinopril + NSAIDs</div>
            <div style={{ fontSize:13, color:'#374151', lineHeight:1.6 }}>NSAIDs may reduce antihypertensive effect of Lisinopril and increase risk of renal impairment. Avoid concurrent use if possible.</div>
          </div>
          <div className="ph-card" style={{ background:'var(--gl)', borderColor:'#86efac' }}>
            <div style={{ fontWeight:700, fontSize:13.5, color:'var(--green)', marginBottom:8 }}>🟢 No Known Interaction</div>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Metformin + Aspirin</div>
            <div style={{ fontSize:13, color:'#374151' }}>No clinically significant interaction known. Safe to use together.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Screen: Reports ──────────────────────────────────────────────────────────

const MONTHS     = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
const DISPENSED  = [420, 480, 510, 380, 540, 590, 538];
const MAX_DISP   = Math.max(...DISPENSED);
const TOP_DRUGS: [string, number, string][] = [
  ['Paracetamol 500mg',142,'var(--primary)'],
  ['Metformin 500mg',  98, 'var(--blue)'],
  ['Lisinopril 10mg',  87, 'var(--purple)'],
  ['Atorvastatin 40mg',72, 'var(--amber)'],
  ['Omeprazole 20mg',  65, 'var(--rose)'],
];

const ReportsScreen: React.FC = () => (
  <div className="ph-scroll ph-fade" style={{ padding:20 }}>
    <div className="ph-reports-layout">
      <div className="ph-card">
        <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Monthly Dispensing Volume</div>
        <div className="ph-bar-chart">
          {DISPENSED.map((v, i) => (
            <div key={i} className="ph-bar-col">
              {i === 6 && <div style={{ fontSize:10, color:'var(--primary)', fontWeight:700 }}>{v}</div>}
              <div className="ph-bar-block" style={{ height:`${(v / MAX_DISP) * 90}px`, background:'var(--primary)', opacity: i === 6 ? 1 : 0.3 }} />
              <span style={{ fontSize:10.5, color:'var(--muted)' }}>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ph-card">
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Top Dispensed Drugs — This Month</div>
        {TOP_DRUGS.map(([d, n, c]) => (
          <div key={d} style={{ marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontSize:13, fontWeight:500 }}>{d}</span>
              <span style={{ fontSize:12.5, color:'var(--muted)' }}>{n} units</span>
            </div>
            <div style={{ background:'var(--bg)', borderRadius:4, height:6, overflow:'hidden' }}>
              <div style={{ width:`${(n / 142) * 100}%`, height:'100%', background:c, borderRadius:4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC<{
  active: ScreenId; onNav: (s: ScreenId) => void;
  mobileOpen: boolean; pharmacistName: string; onSignOut?: () => void;
}> = ({ active, onNav, mobileOpen, pharmacistName, onSignOut }) => {
  const abb = initials(pharmacistName);
  return (
    <aside className={`ph-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="ph-sidebar-logo">
        <div className="ph-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
          </svg>
        </div>
        <div>
          <div style={{ color:'white', fontWeight:800, fontSize:15 }}>Vexoo</div>
          <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10.5 }}>Pharmacy Portal</div>
        </div>
      </div>

      <div className="ph-sidebar-stats">
        {([['Pending','3','var(--amber)'],['Ready','1','var(--primary)']] as [string,string,string][]).map(([l, v, c]) => (
          <div key={l} className="ph-stat-pill">
            <div style={{ fontSize:20, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.45)', marginTop:1 }}>{l}</div>
          </div>
        ))}
      </div>

      <nav className="ph-nav">
        {NAV.map(item => {
          const on = active === item.id;
          return (
            <button key={item.id} className={`ph-nav-btn ${on ? 'active' : 'inactive'}`} onClick={() => onNav(item.id)}>
              <SvgIcon path={item.path} size={17} color="currentColor" />
              <span style={{ flex:1, textAlign:'left' }}>{item.label}</span>
              {item.badge && <span className="ph-nav-badge">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sidebar footer: user identity (read-only) + sign out button */}
      <div className="ph-sidebar-footer">
        <div className="ph-user-identity">
          <div className="ph-user-avatar">{abb}</div>
          <div>
            <div className="ph-user-name">{pharmacistName}</div>
            <div className="ph-user-role">Lead Pharmacist</div>
          </div>
        </div>
        <button className="ph-logout-btn" onClick={onSignOut}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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

export default function PharmacistScreen({ pharmacistName = 'Mei Perez', onSignOut }: PharmacistScreenProps) {
  const [screen, setScreen]     = useState<ScreenId>('queue');
  const [mobileOpen, setMobile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const abb = initials(pharmacistName);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMobile(false); setShowProfile(false); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleNav = useCallback((s: ScreenId) => { setScreen(s); setMobile(false); }, []);

  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const screenEl = useMemo(() => {
    switch (screen) {
      case 'queue':    return <QueueScreen />;
      case 'verify':   return <VerifyScreen />;
      case 'stock':    return <StockScreen />;
      case 'history':  return <HistoryScreen />;
      case 'interact': return <InteractScreen />;
      case 'reports':  return <ReportsScreen />;
    }
  }, [screen]);

  return (
    <div className="ph-root">
      <style>{CSS}</style>

      {mobileOpen && <div className="ph-overlay open" onClick={() => setMobile(false)} />}

      <Sidebar active={screen} onNav={handleNav} mobileOpen={mobileOpen}
        pharmacistName={pharmacistName} onSignOut={onSignOut} />

      <div className="ph-main">
        {/* Header — NO logout button here. Single sign-out is in sidebar only. */}
        <div className="ph-header">
          <button className="ph-hamburger" onClick={() => setMobile(o => !o)} aria-label="Open menu" style={{ display:'none' }}>
            <SvgIcon path="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" size={22} color="var(--text)" />
          </button>
          <div className="ph-header-title">{SCREEN_TITLES[screen]}</div>
          <div className="ph-header-spacer" />
          <div className="ph-search-box">
            <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" size={14} color="var(--muted)" />
            <input placeholder="Search prescriptions, patients..." />
          </div>
          <div className="ph-header-date">{today}</div>

          {/* Clickable profile avatar with hover tooltip */}
          <div className="ph-profile-wrap">
            <div className="ph-profile-avatar" onClick={() => setShowProfile(true)}>
              {abb}
              <div className="ph-profile-tooltip">
                <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{pharmacistName}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>Lead Pharmacist</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>pharmacy@vexoo.in</div>
                <div style={{ fontSize:11, color:'var(--primary)', marginTop:8, fontWeight:600 }}>Click to view profile →</div>
              </div>
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
            background:'white', borderRadius:16, padding:28,
            width:420, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(0,0,0,0.2)',
            border:'1px solid var(--border)'
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
              <div style={{ width:60, height:60, borderRadius:'50%',
                background:'linear-gradient(135deg,var(--primary),#0891b2)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'white', fontSize:22, fontWeight:700 }}>{abb}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:17 }}>{pharmacistName}</div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>Lead Pharmacist · Pharmacy Portal</div>
              </div>
            </div>
            {[['Full Name', pharmacistName], ['Email', 'pharmacy@vexoo.in'], ['Phone', '+91 98765 43210'], ['Licence No.', 'PH/2020/MH/04182'], ['Role', 'Lead Pharmacist']].map(([label, val]) => (
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
