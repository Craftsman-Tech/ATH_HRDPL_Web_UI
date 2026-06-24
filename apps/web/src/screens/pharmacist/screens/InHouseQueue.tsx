import React, { useMemo, useState } from 'react';
import type { Prescription, RxStatus } from '../types/pharmacist.types';
import { NEXT_STATUS } from '../types/pharmacist.types';
import { Badge, Th, Td, Avatar, SvgIcon, statusColor } from '../shared/PhHelpers';
import { PRESCRIPTIONS } from '../data/mockPharmData';

// In-House vocabulary: the internal "Verifying" stage is shown as "In Work",
// and the button that starts it reads "Start Working" (no clinic to verify here).
const IH_STATUS_LABEL: Record<RxStatus, string> = {
  Pending: 'Pending', Verifying: 'In Work', Ready: 'Ready', Dispensed: 'Dispensed',
};
const IH_ACTION_LABEL: Record<RxStatus, string> = {
  Pending: 'Start Working', Verifying: 'Mark Ready', Ready: 'Dispense', Dispensed: 'Completed',
};

// Tab labels (display) → internal status they filter on.
const TABS: { label: string; status: RxStatus | 'All' }[] = [
  { label: 'All',       status: 'All'       },
  { label: 'Pending',   status: 'Pending'   },
  { label: 'In Work',   status: 'Verifying' },
  { label: 'Ready',     status: 'Ready'     },
  { label: 'Dispensed', status: 'Dispensed' },
];

export const InHouseQueue: React.FC = () => {
  const [rows, setRows]   = useState<Prescription[]>(PRESCRIPTIONS.filter(p => p.source === 'In-House'));
  const [filter, setFilter] = useState<RxStatus | 'All'>('All');
  const [query, setQuery]   = useState('');

  const advance = (id: string) =>
    setRows(rs => rs.map(r => r.id === id ? { ...r, status: NEXT_STATUS[r.status] } : r));

  const view = useMemo(() => rows.filter(r =>
    (filter === 'All' || r.status === filter) &&
    (r.patient.toLowerCase().includes(query.toLowerCase()) ||
     r.id.toLowerCase().includes(query.toLowerCase()) ||
     r.drug.toLowerCase().includes(query.toLowerCase()))
  ), [rows, filter, query]);

  return (
    <div className="ph-content ph-fade">
      <div className="ph-section-head">
        <div>
          <div className="ph-section-title">In-House Prescription Queue</div>
          <div className="ph-section-sub">{rows.filter(r => r.status !== 'Dispensed').length} active · prescriptions raised within the hospital</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div className="ph-search-input-wrap" style={{ maxWidth: 360 }}>
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" size={15} color="var(--text-muted)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search patient, Rx ID, or drug..." />
        </div>
        <div className="ph-tabs">
          {TABS.map(t => (
            <button key={t.label} className={`ph-tab ${filter === t.status ? 'active' : ''}`} onClick={() => setFilter(t.status)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="ph-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="ph-table-wrap">
          <table className="ph-table">
            <thead><tr>{['Rx ID', 'Patient', 'Medication', 'Doctor', 'Priority', 'Status', 'Action'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {view.map(r => (
                <tr key={r.id} className="ph-tr">
                  <Td><span className="ph-id">{r.id}</span></Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Avatar name={r.patient} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.patient}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.pid} · {r.time}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{r.drug}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Qty {r.qty} · {r.refills} refills</div>
                  </Td>
                  <Td style={{ fontSize: 12.5 }}>{r.doctor}</Td>
                  <Td><Badge label={r.priority} color={statusColor(r.priority)} /></Td>
                  <Td><Badge label={IH_STATUS_LABEL[r.status]} color={statusColor(r.status)} /></Td>
                  <Td>
                    {r.status === 'Dispensed'
                      ? <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>—</span>
                      : <button className="ph-btn-outline" style={{ height: 34, padding: '0 14px', fontSize: 12.5 }} onClick={() => advance(r.id)}>{IH_ACTION_LABEL[r.status]}</button>}
                  </Td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr><td className="ph-td" colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No prescriptions match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
