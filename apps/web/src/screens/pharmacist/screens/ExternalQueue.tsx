import React, { useMemo, useState } from 'react';
import type { Prescription, RxStatus } from '../types/pharmacist.types';
import { NEXT_STATUS } from '../types/pharmacist.types';
import { Badge, Th, Td, Avatar, SvgIcon, statusColor } from '../shared/PhHelpers';
import { SearchSelect } from '../shared/SearchSelect';
import { PRESCRIPTIONS, MEDICINE_CATALOG } from '../data/mockPharmData';

// External-queue vocabulary: the "Verifying" stage is shown as "In Work"
// (display only — the internal RxStatus value stays 'Verifying').
const EXT_STATUS_LABEL: Record<RxStatus, string> = {
  Pending: 'Pending', Verifying: 'In Work', Ready: 'Ready', Dispensed: 'Dispensed',
};

// Tab labels (display) → internal status they filter on.
const EXT_TABS: { label: string; status: RxStatus | 'All' }[] = [
  { label: 'All',       status: 'All'       },
  { label: 'Pending',   status: 'Pending'   },
  { label: 'In Work',   status: 'Verifying' },
  { label: 'Ready',     status: 'Ready'     },
  { label: 'Dispensed', status: 'Dispensed' },
];

// Only OTC (no-prescription) medicines appear in the walk-in dropdown.
const OTC_NAMES = MEDICINE_CATALOG.filter(m => m.otc).map(m => m.name);

// Local action-button labels for the External queue. There is no separate
// "verification" step here, so the first action reads "Start Working" rather
// than "Start Verification". (Local override — never mutate the shared
// ACTION_LABEL constant.)
const EXT_ACTION_LABEL: Record<RxStatus, string> = {
  Pending: 'Start Working', Verifying: 'Mark Ready', Ready: 'Dispense', Dispensed: 'Completed',
};

export const ExternalQueue: React.FC = () => {
  const [rows, setRows]   = useState<Prescription[]>(PRESCRIPTIONS.filter(p => p.source === 'External'));
  const [filter, setFilter] = useState<RxStatus | 'All'>('All');
  const [query, setQuery]   = useState('');

  // ── Walk-in OTC dispense form state ──
  const [showForm, setShowForm] = useState(false);
  const [rxId, setRxId]       = useState('');
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [meds, setMeds]       = useState<string[]>([]);
  const [qtys, setQtys]       = useState<Record<string, number>>({});
  const [toast, setToast]     = useState<string | null>(null);

  const advance = (id: string) =>
    setRows(rs => rs.map(r => r.id === id ? { ...r, status: NEXT_STATUS[r.status] } : r));
  const toggleVerify = (id: string) =>
    setRows(rs => rs.map(r => r.id === id ? { ...r, verified: !r.verified } : r));

  const view = useMemo(() => rows.filter(r =>
    (filter === 'All' || r.status === filter) &&
    (r.patient.toLowerCase().includes(query.toLowerCase()) ||
     r.id.toLowerCase().includes(query.toLowerCase()) ||
     (r.clinic ?? '').toLowerCase().includes(query.toLowerCase()))
  ), [rows, filter, query]);

  const openForm = () => {
    // Auto-generate a unique walk-in Rx-ID.
    const n = 200 + rows.filter(r => r.id.startsWith('RX-W')).length + 1;
    setRxId(`RX-W${n}`);
    setName(''); setPhone(''); setMeds([]); setQtys({});
    setShowForm(true);
  };

  const setQty = (med: string, q: number) =>
    setQtys(prev => ({ ...prev, [med]: Math.max(1, q) }));

  const canDispense = name.trim() !== '' && meds.length > 0;

  const dispense = () => {
    if (!canDispense) return;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newRows: Prescription[] = meds.map(m => ({
      id: rxId, patient: name.trim(), pid: '—', drug: m, qty: qtys[m] ?? 1,
      doctor: '—', time, status: 'Dispensed', source: 'External', priority: 'Routine',
      refills: 0, dob: '—', allergies: '—', instructions: 'Over-the-counter sale',
      clinic: 'Walk-in (OTC)', verified: true,
    }));
    setRows(rs => [...newRows, ...rs]);
    setShowForm(false);
    setToast(`Dispensed ${meds.length} item${meds.length > 1 ? 's' : ''} · ${rxId}`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="ph-content ph-fade">
      <div className="ph-section-head">
        <div>
          <div className="ph-section-title">External Prescription Queue</div>
          <div className="ph-section-sub">Verify the prescribing clinic & details before dispensing external scripts</div>
        </div>
        <button className="ph-action-btn" onClick={openForm}>
          <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={16} color="white" /> Add External Walk In
        </button>
      </div>

      {toast && (
        <div className="ph-toast">
          <SvgIcon path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" size={16} color="var(--mineral-700)" /> {toast}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div className="ph-search-input-wrap" style={{ maxWidth: 360 }}>
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" size={15} color="var(--text-muted)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search patient, Rx ID, or clinic..." />
        </div>
        <div className="ph-tabs">
          {EXT_TABS.map(t => (
            <button key={t.label} className={`ph-tab ${filter === t.status ? 'active' : ''}`} onClick={() => setFilter(t.status)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="ph-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="ph-table-wrap">
          <table className="ph-table">
            <thead><tr>{['Rx ID', 'Patient', 'Medication', 'Source Clinic', 'Verified', 'Status', 'Action'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {view.map(r => (
                <tr key={`${r.id}-${r.drug}`} className="ph-tr">
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
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Qty {r.qty} · {r.doctor}</div>
                  </Td>
                  <Td style={{ fontSize: 12.5 }}>{r.clinic ?? '—'}</Td>
                  <Td>
                    <button
                      onClick={() => toggleVerify(r.id)}
                      className={`ph-badge ${r.verified ? 'primary' : 'amber'}`}
                      style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {r.verified ? '✓ Verified' : 'Verify'}
                    </button>
                  </Td>
                  <Td><Badge label={EXT_STATUS_LABEL[r.status]} color={statusColor(r.status)} /></Td>
                  <Td>
                    {r.status === 'Dispensed'
                      ? <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>—</span>
                      : <button
                          className="ph-btn-outline"
                          style={{ height: 34, padding: '0 14px', fontSize: 12.5, opacity: !r.verified && r.status === 'Ready' ? 0.5 : 1 }}
                          disabled={!r.verified && r.status === 'Ready'}
                          title={!r.verified && r.status === 'Ready' ? 'Verify before dispensing' : ''}
                          onClick={() => advance(r.id)}>{EXT_ACTION_LABEL[r.status]}</button>}
                  </Td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr><td className="ph-td" colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No external prescriptions match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Walk-in OTC dispense form ── */}
      {showForm && (
        <div className="ph-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="ph-modal" onClick={e => e.stopPropagation()}>
            <div className="ph-modal-head">
              <div>
                <div className="ph-modal-title">Walk-in Medicine Sale</div>
                <div className="ph-modal-sub">Dispense over-the-counter medicines that do not need a prescription</div>
              </div>
              <button className="ph-modal-x" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="ph-modal-body">
              <div className="ph-form-grid">
                <div className="ph-field">
                  <label>Rx ID (auto-generated)</label>
                  <input value={rxId} readOnly className="ph-input ph-input-readonly" />
                </div>
                <div className="ph-field">
                  <label>Patient Name<span className="ph-req">*</span></label>
                  <input value={name} onChange={e => setName(e.target.value)} className="ph-input" placeholder="Full name" />
                </div>
                <div className="ph-field">
                  <label>Patient Phone Number</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="ph-input" placeholder="+91 …" />
                </div>
              </div>

              <div className="ph-field" style={{ marginTop: 4 }}>
                <label>Medication<span className="ph-req">*</span> <span className="ph-hint">(over-the-counter only)</span></label>
                <SearchSelect options={OTC_NAMES} value={meds} onChange={setMeds} multi placeholder="Type to search OTC medicines…" />
              </div>

              {meds.length > 0 && (
                <div className="ph-qty-list">
                  <div className="ph-qty-head">
                    <span>Selected medicines &amp; quantity</span>
                    <span className="ph-qty-count">{meds.length}</span>
                  </div>
                  {meds.map(m => {
                    const cat = MEDICINE_CATALOG.find(x => x.name === m);
                    return (
                      <div key={m} className="ph-qty-row">
                        <div className="ph-qty-meta">
                          <span className="ph-qty-dot">{m.charAt(0).toUpperCase()}</span>
                          <div style={{ minWidth: 0 }}>
                            <div className="ph-qty-name">{m}</div>
                            {cat && <div className="ph-qty-sub">₹{cat.price}/{cat.unit.replace(/s$/, '')} · OTC</div>}
                          </div>
                        </div>
                        <div className="ph-stepper">
                          <button type="button" onClick={() => setQty(m, (qtys[m] ?? 1) - 1)}>−</button>
                          <input type="number" min={1} value={qtys[m] ?? 1}
                            onChange={e => setQty(m, parseInt(e.target.value || '1', 10))} />
                          <button type="button" onClick={() => setQty(m, (qtys[m] ?? 1) + 1)}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="ph-modal-foot">
              <button className="ph-btn-text" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="ph-action-btn" disabled={!canDispense} style={{ opacity: canDispense ? 1 : 0.5 }} onClick={dispense}>
                <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={16} color="white" /> Dispense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};