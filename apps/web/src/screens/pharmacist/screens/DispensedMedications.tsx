import React, { useMemo, useState } from 'react';
import { Th, Td, Avatar, Badge, SvgIcon } from '../shared/PhHelpers';
import { FilterPopover, DEFAULT_FILTER, inRange } from '../shared/FilterPopover';
import type { RangeFilter, SourceSel } from '../shared/FilterPopover';
import { exportToExcel } from '../shared/exportXlsx';
import { DISPENSED } from '../data/mockPharmData';

const TABS: SourceSel[] = ['All', 'In-House', 'External'];

export const DispensedMedications: React.FC = () => {
  const [filter, setFilter] = useState<RangeFilter>(DEFAULT_FILTER);
  const [query, setQuery]   = useState('');

  // The source tab and the filter's source stay in sync (auto-switch).
  const applyFilter = (next: RangeFilter) => setFilter(next);
  const setTab = (s: SourceSel) => setFilter(f => ({ ...f, source: s }));

  const view = useMemo(() => DISPENSED.filter(d =>
    (filter.source === 'All' || d.source === filter.source) &&
    inRange(d.date, filter) &&
    (d.patient.toLowerCase().includes(query.toLowerCase()) ||
     d.drug.toLowerCase().includes(query.toLowerCase()) ||
     d.id.toLowerCase().includes(query.toLowerCase()))
  ), [filter, query]);

  const today = DISPENSED.filter(d => d.date === 'Jun 21, 2026').length;

  const handleExport = () => {
    const headers = ['Dispense ID', 'Patient', 'Patient ID', 'Rx ID', 'Medication', 'Qty', 'Batch', 'Source', 'Dispensed By', 'Date', 'Time'];
    const rows = view.map(d => [d.id, d.patient, d.pid, d.rxId, d.drug, d.qty, d.batch, d.source, d.dispensedBy, d.date, d.time]);
    exportToExcel('Vexoo_Dispensed_Medications', 'Dispensed', headers, rows);
  };

  return (
    <div className="ph-content ph-fade">
      <div className="ph-section-head">
        <div>
          <div className="ph-section-title">Dispensed Medications</div>
          <div className="ph-section-sub">Audit trail of every medication handed to a patient</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <FilterPopover value={filter} onApply={applyFilter} />
          <button className="ph-btn-outline" onClick={handleExport}>
            <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={16} color="currentColor" /> Export
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 18 }} className="ph-stat-grid-3">
        <div className="ph-stat-card"><div className="ph-stat-label">Dispensed Today</div><div className="ph-stat-value">{today}</div></div>
        <div className="ph-stat-card"><div className="ph-stat-label">From In-House</div><div className="ph-stat-value">{DISPENSED.filter(d => d.source === 'In-House').length}</div></div>
        <div className="ph-stat-card"><div className="ph-stat-label">From External</div><div className="ph-stat-value">{DISPENSED.filter(d => d.source === 'External').length}</div></div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div className="ph-search-input-wrap" style={{ maxWidth: 360 }}>
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" size={15} color="var(--text-muted)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search patient, drug, or dispense ID..." />
        </div>
        <div className="ph-tabs">
          {TABS.map(f => <button key={f} className={`ph-tab ${filter.source === f ? 'active' : ''}`} onClick={() => setTab(f)}>{f}</button>)}
        </div>
      </div>

      <div className="ph-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="ph-table-wrap">
          <table className="ph-table">
            <thead><tr>{['Dispense ID', 'Patient', 'Medication', 'Batch', 'Source', 'Dispensed By', 'Date / Time'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {view.map(d => (
                <tr key={d.id} className="ph-tr">
                  <Td><span className="ph-id">{d.id}</span></Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Avatar name={d.patient} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{d.patient}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.pid} · {d.rxId}</div>
                      </div>
                    </div>
                  </Td>
                  <Td><div style={{ fontWeight: 600 }}>{d.drug}</div><div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Qty {d.qty}</div></Td>
                  <Td><span className="ph-id">{d.batch}</span></Td>
                  <Td><Badge label={d.source} color={d.source === 'External' ? 'purple' : 'blue'} /></Td>
                  <Td style={{ fontSize: 12.5 }}>{d.dispensedBy}</Td>
                  <Td style={{ fontSize: 12.5 }}>{d.date}<div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.time}</div></Td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr><td className="ph-td" colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No dispensed records match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
