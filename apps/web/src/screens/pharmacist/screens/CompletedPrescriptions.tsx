import React, { useMemo, useState } from 'react';
import type { CompletedRx } from '../types/pharmacist.types';
import { Th, Td, Avatar, Badge, SvgIcon } from '../shared/PhHelpers';
import { FilterPopover, DEFAULT_FILTER, inRange } from '../shared/FilterPopover';
import type { RangeFilter, SourceSel } from '../shared/FilterPopover';
import { exportToExcel } from '../shared/exportXlsx';
import { downloadPrescriptionPdf } from '../shared/prescriptionPdf';
import { COMPLETED } from '../data/mockPharmData';

const TABS: SourceSel[] = ['All', 'In-House', 'External'];

export const CompletedPrescriptions: React.FC = () => {
  const [filter, setFilter] = useState<RangeFilter>(DEFAULT_FILTER);
  const [query, setQuery]   = useState('');
  const [viewRx, setViewRx] = useState<CompletedRx | null>(null);

  const applyFilter = (next: RangeFilter) => setFilter(next);
  const setTab = (s: SourceSel) => setFilter(f => ({ ...f, source: s }));

  const view = useMemo(() => COMPLETED.filter(c =>
    (filter.source === 'All' || c.source === filter.source) &&
    inRange(c.completedDate, filter) &&
    (c.patient.toLowerCase().includes(query.toLowerCase()) ||
     c.drug.toLowerCase().includes(query.toLowerCase()) ||
     c.id.toLowerCase().includes(query.toLowerCase()))
  ), [filter, query]);

  const totalAmount = COMPLETED.reduce((s, c) => s + c.amount, 0);

  const handleExport = () => {
    const headers = ['Rx ID', 'Patient', 'Patient ID', 'Medication', 'Qty', 'Doctor', 'Source', 'Turnaround', 'Completed', 'Amount (Rs.)'];
    const rows = view.map(c => [c.id, c.patient, c.pid, c.drug, c.qty, c.doctor, c.source, c.turnaround, c.completedDate, c.amount]);
    exportToExcel('Vexoo_Completed_Prescriptions', 'Completed', headers, rows);
  };

  return (
    <div className="ph-content ph-fade">
      <div className="ph-section-head">
        <div>
          <div className="ph-section-title">Completed Prescriptions</div>
          <div className="ph-section-sub">Closed-out prescriptions with turnaround & billing history</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <FilterPopover value={filter} onApply={applyFilter} />
          <button className="ph-btn-outline" onClick={handleExport}>
            <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={16} color="currentColor" /> Export
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 18 }} className="ph-stat-grid-3">
        <div className="ph-stat-card"><div className="ph-stat-label">Completed</div><div className="ph-stat-value">{COMPLETED.length}</div></div>
        <div className="ph-stat-card"><div className="ph-stat-label">Avg Turnaround</div><div className="ph-stat-value">11<span style={{ fontSize: 16 }}> min</span></div></div>
        <div className="ph-stat-card"><div className="ph-stat-label">Total Billed</div><div className="ph-stat-value">₹{totalAmount}</div></div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div className="ph-search-input-wrap" style={{ maxWidth: 360 }}>
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" size={15} color="var(--text-muted)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search patient, drug, or Rx ID..." />
        </div>
        <div className="ph-tabs">
          {TABS.map(f => <button key={f} className={`ph-tab ${filter.source === f ? 'active' : ''}`} onClick={() => setTab(f)}>{f}</button>)}
        </div>
      </div>

      <div className="ph-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="ph-table-wrap">
          <table className="ph-table">
            <thead><tr>{['Rx ID', 'Patient', 'Medication', 'Doctor', 'Source', 'Turnaround', 'Completed', 'Amount', 'Action'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {view.map(c => (
                <tr key={c.id} className="ph-tr">
                  <Td><span className="ph-id">{c.id}</span></Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Avatar name={c.patient} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.patient}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.pid}</div>
                      </div>
                    </div>
                  </Td>
                  <Td><div style={{ fontWeight: 600 }}>{c.drug}</div><div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Qty {c.qty}</div></Td>
                  <Td style={{ fontSize: 12.5 }}>{c.doctor}</Td>
                  <Td><Badge label={c.source} color={c.source === 'External' ? 'purple' : 'blue'} /></Td>
                  <Td><Badge label={c.turnaround} color="primary" /></Td>
                  <Td style={{ fontSize: 12.5 }}>{c.completedDate}</Td>
                  <Td style={{ fontWeight: 600 }}>₹{c.amount}</Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="ph-btn-outline" style={{ height: 32, padding: '0 12px', fontSize: 12 }} onClick={() => setViewRx(c)}>
                        <SvgIcon path="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" size={14} color="currentColor" /> View
                      </button>
                      <button className="ph-btn-outline" style={{ height: 32, padding: '0 12px', fontSize: 12 }} onClick={() => downloadPrescriptionPdf(c)}>
                        <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={14} color="currentColor" /> Download
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr><td className="ph-td" colSpan={9} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No completed prescriptions match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View Prescription modal ── */}
      {viewRx && (
        <div className="ph-modal-overlay" onClick={() => setViewRx(null)}>
          <div className="ph-modal" onClick={e => e.stopPropagation()}>
            <div className="ph-modal-head">
              <div>
                <div className="ph-modal-title">Prescription · {viewRx.id}</div>
                <div className="ph-modal-sub">{viewRx.clinic ?? 'Vexoo General Hospital'} · {viewRx.completedDate}</div>
              </div>
              <button className="ph-modal-x" onClick={() => setViewRx(null)}>×</button>
            </div>

            <div className="ph-modal-body">
              <div className="ph-rx-sheet">
                <div className="ph-rx-letterhead">
                  <div className="ph-rx-brand">Vexoo Pharmacy</div>
                  <div className="ph-rx-sub">{viewRx.clinic ?? 'Vexoo General Hospital'}</div>
                </div>

                <div className="ph-rx-grid">
                  <div><span className="ph-rx-k">Patient</span><span className="ph-rx-v">{viewRx.patient}</span></div>
                  <div><span className="ph-rx-k">Patient ID</span><span className="ph-rx-v">{viewRx.pid}</span></div>
                  <div><span className="ph-rx-k">Date of Birth</span><span className="ph-rx-v">{viewRx.dob ?? '—'}</span></div>
                  <div><span className="ph-rx-k">Phone</span><span className="ph-rx-v">{viewRx.phone ?? '—'}</span></div>
                  <div><span className="ph-rx-k">Prescriber</span><span className="ph-rx-v">{viewRx.doctor}</span></div>
                  <div><span className="ph-rx-k">Source</span><span className="ph-rx-v">{viewRx.source}</span></div>
                </div>

                <div className="ph-rx-divider" />

                <div className="ph-rx-med-head">℞</div>
                <div className="ph-rx-med">{viewRx.drug}</div>
                <div className="ph-rx-qty">Quantity: {viewRx.qty}</div>
                {viewRx.instructions && (
                  <div className="ph-rx-sig"><span>Instructions / Sig:</span> {viewRx.instructions}</div>
                )}

                <div className="ph-rx-divider" />

                <div className="ph-rx-foot">
                  <div><span className="ph-rx-k">Amount Billed</span><span className="ph-rx-v" style={{ fontWeight: 700 }}>₹{viewRx.amount}</span></div>
                  <div><span className="ph-rx-k">Turnaround</span><span className="ph-rx-v">{viewRx.turnaround}</span></div>
                  <div><span className="ph-rx-k">Dispensed By</span><span className="ph-rx-v">Maria Perez</span></div>
                </div>
              </div>
            </div>

            <div className="ph-modal-foot">
              <button className="ph-btn-text" onClick={() => setViewRx(null)}>Close</button>
              <button className="ph-action-btn" onClick={() => downloadPrescriptionPdf(viewRx)}>
                <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={16} color="white" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
