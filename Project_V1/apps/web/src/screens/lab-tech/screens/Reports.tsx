// ============================================================================
//  Reports.tsx — Laboratory analytics with custom filters + Excel export.
// ----------------------------------------------------------------------------
//  A single cohesive filter bar (date range + report type + department +
//  priority + status) drives a live results table and KPI cards. Export is
//  Excel-only and dependency-free (SpreadsheetML, see shared/exportExcel).
// ============================================================================
import React, { useState, useMemo } from 'react';
import type { ReportRow } from '../types/labtech.types';
import { REPORT_ROWS } from '../data/mockLabData';
import { Chip, priorityChip } from '../shared/Chip';
import { Toast } from '../shared/Toast';
import { useToast } from '../hooks/useToast';
import { exportExcel } from '../shared/exportExcel';

const uniq = (xs: string[]) => Array.from(new Set(xs));
const fmtTat = (m: number) => m <= 0 ? '—' : m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;

const statusChip = (s: ReportRow['status']) =>
  s === 'Completed' ? { label: 'Completed', color: 'green' as const }
  : s === 'Processing' ? { label: 'Processing', color: 'primary' as const }
  : s === 'Rejected' ? { label: 'Rejected', color: 'rose' as const }
  : { label: 'Pending', color: 'amber' as const };

export const Reports: React.FC = () => {
  const { toast, msg } = useToast();

  const [from, setFrom]     = useState('2026-06-17');
  const [to, setTo]         = useState('2026-06-21');
  const [dept, setDept]     = useState('all');
  const [priority, setPriority] = useState('all');
  const [status, setStatus] = useState('all');
  const [tech, setTech]     = useState('all');

  const depts = uniq(REPORT_ROWS.map(r => r.department));
  const techs = uniq(REPORT_ROWS.map(r => r.technician));

  const rows = useMemo(() => REPORT_ROWS.filter(r =>
    (!from || r.date >= from) && (!to || r.date <= to) &&
    (dept === 'all' || r.department === dept) &&
    (priority === 'all' || r.priority === priority) &&
    (status === 'all' || r.status === status) &&
    (tech === 'all' || r.technician === tech)
  ), [from, to, dept, priority, status, tech]);

  const completed = rows.filter(r => r.status === 'Completed');
  const KPIS = [
    { label: 'Total Tests',       val: rows.length, cls: 's-blue' },
    { label: 'Completed',         val: completed.length, cls: 's-mineral' },
    { label: 'Rejected',          val: rows.filter(r => r.status === 'Rejected').length, cls: 's-amber' },
    { label: 'Avg TAT',           val: completed.length ? fmtTat(Math.round(completed.reduce((s, r) => s + r.tatMin, 0) / completed.length)) : '—', cls: 's-neutral' },
  ];

  const reset = () => { setFrom('2026-06-17'); setTo('2026-06-21'); setDept('all'); setPriority('all'); setStatus('all'); setTech('all'); };

  const onExport = () => {
    if (rows.length === 0) { toast('No rows to export for the current filters'); return; }
    const headers = ['Date', 'Patient', 'Patient ID', 'Test', 'Department', 'Priority', 'Technician', 'Status', 'TAT (min)'];
    const body = rows.map(r => [r.dateLabel, r.patient, r.pid, r.test, r.department, r.priority, r.technician, r.status, r.tatMin]);
    exportExcel(`lab-report-${from}_to_${to}`, headers, body, 'Lab Report');
    toast(`Exported ${rows.length} row(s) to Excel`);
  };

  return (
    <div className="lt-scroll lt-fade">
      <div className="lt-content">
        {/* Custom filter bar */}
        <div className="lt-card lt-report-filters">
          <div className="lt-report-filter-grid">
            <div className="lt-form-group" style={{ marginBottom: 0 }}>
              <label className="lt-field-label">From</label>
              <input className="lt-field-input" type="date" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div className="lt-form-group" style={{ marginBottom: 0 }}>
              <label className="lt-field-label">To</label>
              <input className="lt-field-input" type="date" value={to} onChange={e => setTo(e.target.value)} />
            </div>
            <div className="lt-form-group" style={{ marginBottom: 0 }}>
              <label className="lt-field-label">Department</label>
              <select className="lt-field-select" value={dept} onChange={e => setDept(e.target.value)}>
                <option value="all">All Departments</option>{depts.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="lt-form-group" style={{ marginBottom: 0 }}>
              <label className="lt-field-label">Priority</label>
              <select className="lt-field-select" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="all">All Priorities</option><option>STAT</option><option>Urgent</option><option>Routine</option>
              </select>
            </div>
            <div className="lt-form-group" style={{ marginBottom: 0 }}>
              <label className="lt-field-label">Status</label>
              <select className="lt-field-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="all">All Statuses</option><option>Completed</option><option>Processing</option><option>Pending</option><option>Rejected</option>
              </select>
            </div>
            <div className="lt-form-group" style={{ marginBottom: 0 }}>
              <label className="lt-field-label">Technician</label>
              <select className="lt-field-select" value={tech} onChange={e => setTech(e.target.value)}>
                <option value="all">All Technicians</option>{techs.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="lt-report-filter-actions">
            <button className="lt-btn-secondary" onClick={reset}>Reset Filters</button>
            <button className="lt-btn-primary" onClick={onExport}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Excel
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="lt-stat-row">
          {KPIS.map(k => (
            <div key={k.label} className={`lt-stat-card ${k.cls}`}>
              <div className="lt-stat-label">{k.label}</div>
              <div className="lt-stat-value">{k.val}</div>
            </div>
          ))}
        </div>

        {/* Results table */}
        <div className="lt-card pad0">
          <div className="lt-card-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="lt-card-title" style={{ marginBottom: 0 }}>Lab Activity</span>
            <span style={{ fontSize: 12.5, color: 'var(--ink-500)' }}>{rows.length} result(s)</span>
          </div>
          <table className="lt-table">
            <thead>
              <tr>
                <th className="lt-th">Date</th><th className="lt-th">Patient</th><th className="lt-th">Test</th>
                <th className="lt-th">Department</th><th className="lt-th">Priority</th><th className="lt-th">Technician</th>
                <th className="lt-th">Status</th><th className="lt-th" style={{ textAlign: 'right' }}>TAT</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td className="lt-td" colSpan={8}><div className="lt-empty">No results match the selected filters.</div></td></tr>}
              {rows.map((r, i) => (
                <tr key={i} className="lt-tr">
                  <td className="lt-td">{r.dateLabel}</td>
                  <td className="lt-td"><div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{r.patient}</div><div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{r.pid}</div></td>
                  <td className="lt-td">{r.test}</td>
                  <td className="lt-td">{r.department}</td>
                  <td className="lt-td"><Chip {...priorityChip(r.priority)} /></td>
                  <td className="lt-td">{r.technician}</td>
                  <td className="lt-td"><Chip {...statusChip(r.status)} /></td>
                  <td className="lt-td" style={{ textAlign: 'right' }}>{fmtTat(r.tatMin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Toast msg={msg} />
    </div>
  );
};
