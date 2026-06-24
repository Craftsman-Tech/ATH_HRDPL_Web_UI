// ============================================================================
//  Completed.tsx — Completed Tests. Validated reports ready to share.
//  Reads from the shared store so tests submitted on the Results screen
//  appear here immediately.
// ============================================================================
import React, { useState, useMemo } from 'react';
import type { CompletedTest } from '../types/labtech.types';
import { useLab } from '../data/labStore';
import { Chip, outcomeChip } from '../shared/Chip';
import { Toast } from '../shared/Toast';
import { useToast } from '../hooks/useToast';
import { buildReportPdf, downloadPdf, printReport, type ReportField } from '../shared/exportPdf';

export const Completed: React.FC = () => {
  const { toast, msg } = useToast();
  const lab = useLab();
  const [q, setQ] = useState('');
  const [outcome, setOutcome] = useState('all');
  const [detail, setDetail] = useState<CompletedTest | null>(null);

  const rows = useMemo(() => lab.completed.filter(c =>
    (q === '' || c.patient.toLowerCase().includes(q.toLowerCase()) || c.test.toLowerCase().includes(q.toLowerCase()) || c.id.toLowerCase().includes(q.toLowerCase())) &&
    (outcome === 'all' || c.outcome === outcome)
  ), [lab.completed, q, outcome]);

  // Build the key/value fields that make up the printable / downloadable report.
  const reportFields = (c: CompletedTest): ReportField[] => [
    { label: 'Report ID', value: c.id },
    { label: 'Patient', value: c.patient },
    { label: 'Patient ID', value: c.pid },
    { label: 'Test(s)', value: (c.tests && c.tests.length ? c.tests.join(', ') : c.test) },
    { label: 'Type', value: c.testType },
    { label: 'Ordering Doctor', value: c.doctor },
    { label: 'Completed', value: c.completed },
    { label: 'Validated By', value: c.validatedBy },
    { label: 'Outcome', value: c.outcome },
    { label: 'Contact', value: c.phone ?? '—' },
  ];

  const download = (c: CompletedTest) => {
    const blob = buildReportPdf(`Lab Report · ${c.id}`, `${c.patient} (${c.pid})`, reportFields(c));
    downloadPdf(`${c.id}.pdf`, blob);
    toast(`Downloaded ${c.id}.pdf`);
  };
  const print = (c: CompletedTest) => {
    printReport(`Lab Report · ${c.id}`, `${c.patient} (${c.pid})`, reportFields(c));
    toast(`Opening print dialog for ${c.id}...`);
  };
  const shareWhatsApp = (c: CompletedTest) => {
    const digits = (c.phone ?? '').replace(/\D/g, '');
    if (!digits) { toast('No patient phone number on file for this report'); return; }
    const msg =
      `Vexoo Lab Report\n` +
      `Report: ${c.id}\n` +
      `Patient: ${c.patient} (${c.pid})\n` +
      `Test(s): ${(c.tests && c.tests.length ? c.tests.join(', ') : c.test)}\n` +
      `Outcome: ${c.outcome}\n` +
      `Completed: ${c.completed}\n` +
      `Validated by: ${c.validatedBy}`;
    window.open(`https://wa.me/${digits}?text=${encodeURIComponent(msg)}`, '_blank');
    toast(`Sharing ${c.id} via WhatsApp to ${c.phone}`);
  };

  return (
    <div className="lt-scroll lt-fade">
      <div className="lt-content">
        <div className="lt-filters">
          <div className="lt-filter-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="lt-filter-search" placeholder="Search completed tests..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <select className="lt-filter-select" value={outcome} onChange={e => setOutcome(e.target.value)}>
            <option value="all">All Outcomes</option><option>Normal</option><option>Abnormal</option>
          </select>
        </div>

        <div className="lt-card pad0">
          <table className="lt-table">
            <thead>
              <tr>
                <th className="lt-th">Report</th><th className="lt-th">Patient</th><th className="lt-th">Test</th>
                <th className="lt-th">Doctor</th><th className="lt-th">Completed</th><th className="lt-th">Outcome</th>
                <th className="lt-th" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td className="lt-td" colSpan={7}><div className="lt-empty">No completed tests match.</div></td></tr>}
              {rows.map(c => (
                <tr key={c.id} className="lt-tr">
                  <td className="lt-td"><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{c.id}</span></td>
                  <td className="lt-td"><div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{c.patient}</div><div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{c.pid}</div></td>
                  <td className="lt-td">{c.test}<div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{c.testType}</div></td>
                  <td className="lt-td">{c.doctor}</td>
                  <td className="lt-td">{c.completed}</td>
                  <td className="lt-td"><Chip {...outcomeChip(c.outcome)} /></td>
                  <td className="lt-td">
                    <div style={{ display: 'flex', gap: 7, justifyContent: 'flex-end' }}>
                      <button className="lt-btn-outline" onClick={() => setDetail(c)}>View</button>
                      <button className="lt-btn-outline" onClick={() => download(c)}>Download</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="lt-modal-backdrop" onClick={() => { setDetail(null); }}>
          <div className="lt-modal lt-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="lt-modal-header">
              <div className="lt-modal-title">Report · {detail.id}</div>
              <button className="lt-modal-close" onClick={() => { setDetail(null); }}>✕</button>
            </div>
            <div className="lt-modal-body">
              <div className="lt-section-label">Patient Details</div>
              <dl className="lt-dl" style={{ marginBottom: 18 }}>
                <dt>Patient</dt><dd>{detail.patient}</dd>
                <dt>Patient ID</dt><dd>{detail.pid}</dd>
              </dl>
              <div className="lt-section-label">Test Details</div>
              <dl className="lt-dl">
                <dt>Test(s)</dt><dd>{detail.test}</dd>
                <dt>Type</dt><dd>{detail.testType}</dd>
                <dt>Ordering Doctor</dt><dd>{detail.doctor}</dd>
                <dt>Completed</dt><dd>{detail.completed}</dd>
                <dt>Validated By</dt><dd>{detail.validatedBy}</dd>
                <dt>Outcome</dt><dd><Chip {...outcomeChip(detail.outcome)} /></dd>
                <dt>Contact</dt><dd>{detail.phone ?? '—'}</dd>
              </dl>
            </div>
            <div className="lt-modal-footer">
              <button className="lt-btn-secondary" onClick={() => print(detail)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print
              </button>
              <button className="lt-btn-secondary" onClick={() => shareWhatsApp(detail)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.46-.15-.65.15-.2.3-.75.96-.92 1.15-.17.2-.34.22-.63.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.65-1.58-.9-2.16-.24-.57-.48-.5-.65-.5l-.56-.01c-.2 0-.5.07-.77.37-.26.3-1 .98-1 2.4 0 1.4 1.03 2.76 1.17 2.96.15.2 2.03 3.1 4.9 4.35.69.3 1.22.47 1.64.6.69.22 1.31.19 1.81.12.55-.08 1.74-.71 1.98-1.4.25-.68.25-1.27.17-1.39-.07-.12-.27-.2-.56-.34zM12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.9 9.9 0 004.73 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.45 17.5 2 12.04 2z"/></svg>
                Share via WhatsApp
              </button>
              <button className="lt-btn-primary" onClick={() => download(detail)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download
              </button>
            </div>
          </div>
        </div>
      )}
      <Toast msg={msg} />
    </div>
  );
};
