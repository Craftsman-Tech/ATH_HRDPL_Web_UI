// ============================================================================
//  Patients.tsx — My Patients
// ============================================================================
//  Searchable roster of every patient this doctor has seen (not date-bound,
//  unlike Today's Queue / My Schedule). Clicking "View" opens a lightweight
//  read-only profile — this is not the full Consultation form.
// ============================================================================
import React, { useState, useMemo } from 'react';
import { PATIENT_ROSTER } from '../data/mockDoctorData';
import { initials } from '../shared/initials';
import { Chip, riskChip } from '../shared/Chip';
import type { PatientRecord } from '../types/doctor.types';

export const Patients: React.FC = () => {
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<PatientRecord | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PATIENT_ROSTER;
    return PATIENT_ROSTER.filter(p =>
      p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="dr-scroll dr-fade">
      <div className="dr-content">
        <div className="dr-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px 16px', borderBottom: '1px solid var(--line)' }}>
            <div className="dr-card-title" style={{ marginBottom: 4, fontSize: 19 }}>My Patients</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Search by name, patient ID, or condition.</div>
          </div>

          <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--line)' }}>
            <div className="dr-filter-wrap" style={{ minWidth: '100%' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="dr-filter-search" placeholder="Search my patients…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="dr-table">
              <thead>
                <tr>{['Patient ID', 'Name', 'Age/Gender', 'Condition', 'Risk', 'Last Visit', 'Active Meds', 'Actions'].map(h => <th key={h} className="dr-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const rc = riskChip(p.riskLevel);
                  return (
                    <tr key={p.id} className="dr-tr">
                      <td className="dr-td" style={{ fontWeight: 600, color: 'var(--mineral-700)', fontFamily: "'JetBrains Mono',monospace" }}>{p.id}</td>
                      <td className="dr-td" style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--mineral-100)', color: 'var(--mineral-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11.5, flexShrink: 0 }}>{initials(p.name)}</div>
                          {p.name}
                        </div>
                      </td>
                      <td className="dr-td">{p.age} / {p.gender}</td>
                      <td className="dr-td" style={{ color: 'var(--ink-600)' }}>{p.condition}</td>
                      <td className="dr-td"><Chip label={rc.label} color={rc.color} /></td>
                      <td className="dr-td" style={{ color: 'var(--muted)' }}>{p.lastVisit}</td>
                      <td className="dr-td">{p.activeMedications.length > 0 ? `${p.activeMedications.length} active` : '—'}</td>
                      <td className="dr-td">
                        <button className="dr-tbl-action" title="View" onClick={() => setDetail(p)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="dr-td" style={{ textAlign: 'center', color: 'var(--muted)', padding: 36 }}>No patients found. Try a different search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {detail && (
        <div className="dr-modal-backdrop" onClick={() => setDetail(null)}>
          <div className="dr-modal" onClick={e => e.stopPropagation()}>
            <div className="dr-modal-header">
              <div className="dr-modal-title">Patient Profile</div>
              <button className="dr-modal-close" onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="dr-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, padding: '14px 16px', background: 'var(--mineral-100)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--mineral-700)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 17 }}>
                  {initials(detail.name)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{detail.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{detail.id} · {detail.age} yrs · {detail.gender}</div>
                </div>
              </div>
              {[['Phone', detail.phone], ['Blood Group', detail.bloodGroup || '—'], ['Condition', detail.condition], ['Last Visit', detail.lastVisit]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <div className="dr-section-label">Active Medications</div>
                {detail.activeMedications.length === 0 ? (
                  <div className="dr-empty" style={{ padding: '18px 14px' }}>No Active Medications.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {detail.activeMedications.map(m => (
                      <div key={m.id} className="dr-med-row">
                        <span style={{ fontSize: 13 }}>{m.name} · {m.dosage} · {m.timing}</span>
                        <Chip label="Active" color="green" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="dr-modal-footer">
              <button className="dr-btn-secondary" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
