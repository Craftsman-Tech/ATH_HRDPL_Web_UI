// ============================================================================
//  ConsultationForm.tsx — the multi-tab prescription / consultation modal
// ============================================================================
//  Opened from PatientTile's "Start Consultation" button. Tabs:
//    1. Patient Visit Details — read-only, pre-filled from the queue entry
//    2. Notes                 — Symptoms / Investigations / Lab Test
//                               Recommendation (multi-select)
//    3. Medications            — Active meds, Modify / Add New Medication
//    4. History                 — last 3–6 months, all hospitals
//    5. Attachments             — lab reports, last 3–6 months, all hospitals
//  "Review Completed" marks the appointment Completed and returns to the
//  queue/schedule list it was opened from.
// ============================================================================
import React, { useState } from 'react';
import type { Appointment, Medication } from '../types/doctor.types';
import { initials } from './initials';
import { Chip, resultChip } from './Chip';
import { MultiSelect } from './MultiSelect';
import { SearchSelect } from './SearchSelect';
import { PHARMACY_MEDICINES, DOSAGE_FREQUENCIES, DOSAGE_TIMINGS, LAB_TESTS } from '../data/mockPharmacy';
import { HISTORY_BY_PATIENT, ATTACHMENTS_BY_PATIENT, EMPTY_HISTORY, EMPTY_ATTACHMENTS } from '../data/mockHistory';

type TabId = 'visit' | 'notes' | 'medications' | 'history' | 'attachments';
const TABS: { id: TabId; label: string }[] = [
  { id: 'visit',        label: 'Patient Visit Details' },
  { id: 'notes',        label: 'Notes' },
  { id: 'medications',  label: 'Medications' },
  { id: 'history',      label: 'History' },
  { id: 'attachments',  label: 'Attachments' },
];

let medCounter = 1000;

export const ConsultationForm: React.FC<{
  appt: Appointment;
  onClose: () => void;
  onComplete: (updated: Appointment) => void;
}> = ({ appt, onClose, onComplete }) => {
  const [tab, setTab] = useState<TabId>('visit');

  // ── Notes tab state ──
  const [symptoms, setSymptoms]           = useState(appt.consultation?.symptoms || '');
  const [investigations, setInvestigations] = useState(appt.consultation?.investigations || '');
  const [labTests, setLabTests]           = useState<string[]>(appt.consultation?.labTests || []);

  // ── Medications tab state ──
  const [meds, setMeds] = useState<Medication[]>(appt.activeMedications);
  const [adding, setAdding]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftMed, setDraftMed]     = useState('');
  const [draftDose, setDraftDose]   = useState('');
  const [draftTimes, setDraftTimes] = useState<string[]>([]);
  const [draftDur, setDraftDur]     = useState('');

  // ── History tab — which record's read-only prescription is open ──
  const [viewHistoryId, setViewHistoryId] = useState<string | null>(null);

  const history     = HISTORY_BY_PATIENT[appt.patientId]     || EMPTY_HISTORY;
  const attachments = ATTACHMENTS_BY_PATIENT[appt.patientId] || EMPTY_ATTACHMENTS;
  const viewingHistory = history.find(h => h.id === viewHistoryId) || null;

  const resetDraft = () => { setDraftMed(''); setDraftDose(''); setDraftTimes([]); setDraftDur(''); };

  // Builds a Medication from the current draft fields, or returns null if
  // the draft isn't complete enough to save.
  const buildDraftMedication = (): Medication | null => {
    if (!draftMed.trim() || !draftDose.trim() || draftTimes.length === 0) return null;
    return {
      id: `MX-${++medCounter}`, name: draftMed.trim(), dosage: draftDose.trim(),
      timing: draftTimes.join(', '), duration: draftDur.trim() || undefined, status: 'Active',
      startDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    };
  };

  // "Add" — adds the current medicine to the list and keeps the form open
  // so the doctor can add the next one straight away.
  const addMedication = () => {
    if (!draftMed.trim()) { alert('Please select a medicine.'); return; }
    if (!draftDose.trim()) { alert('Please select a dosage frequency.'); return; }
    if (draftTimes.length === 0) { alert('Please select at least one consume time.'); return; }
    const m = buildDraftMedication()!;
    setMeds(m2 => [...m2, m]);
    resetDraft();
  };

  // "Done" — finishes adding. If the doctor filled in a complete medicine
  // but clicked Done instead of Add, save it first so nothing is lost.
  const finishAdding = () => {
    const m = buildDraftMedication();
    if (m) setMeds(m2 => [...m2, m]);
    setAdding(false);
    resetDraft();
  };

  const stopMedication = (id: string) => setMeds(m => m.filter(x => x.id !== id));
  const saveEdit = (id: string, patch: Partial<Medication>) => {
    setMeds(m => m.map(x => x.id === id ? { ...x, ...patch } : x));
    setEditingId(null);
  };

  // "Review Completed" asks for confirmation first — handleReviewCompleted
  // (the actual save) only runs once the doctor confirms.
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);

  const handleReviewCompleted = () => {
    const pendingDraft = buildDraftMedication();
    const finalMeds = pendingDraft ? [...meds, pendingDraft] : meds;
    const updated: Appointment = {
      ...appt,
      status: 'Completed',
      activeMedications: finalMeds,
      consultation: { symptoms, investigations, labTests, completedAt: Date.now() },
    };
    setShowConfirmComplete(false);
    onComplete(updated);
  };

  return (
    <div className="dr-modal-backdrop" onClick={onClose}>
      <div className="dr-consult-modal" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="dr-consult-header">
          <button className="dr-modal-close" style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }} onClick={onClose}>✕</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div className="dr-detail-avatar" style={{ width: 50, height: 50, fontSize: 17 }}>{initials(appt.name)}</div>
            <div>
              <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 21, fontWeight: 400, letterSpacing: '-0.02em' }}>
                {appt.name} <span style={{ opacity: 0.6, fontWeight: 400, fontSize: 14 }}>{appt.patientId}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12.5, opacity: 0.78, marginTop: 4, flexWrap: 'wrap' }}>
                <span>{appt.gender} · {appt.age} years</span>
                <span>Blood: {appt.bloodGroup || '—'}</span>
                <span>{appt.condition}</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{appt.token}</span>
              </div>
            </div>
          </div>
          <div className="dr-consult-tabs">
            {TABS.map(t => (
              <button key={t.id} className={`dr-consult-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="dr-consult-body">

          {tab === 'visit' && (
            <div>
              <div className="dr-field-label" style={{ marginBottom: 14, color: 'var(--mineral-700)' }}>Pre-filled from check-in — read only</div>
              <div className="dr-form-row">
                <div className="dr-form-group">
                  <label className="dr-field-label">Patient Name</label>
                  <input className="dr-field-input" value={appt.name} readOnly style={{ background: 'var(--ink-50)', color: 'var(--ink-700)' }} />
                </div>
                <div className="dr-form-group">
                  <label className="dr-field-label">Token Number</label>
                  <input className="dr-field-input" value={appt.token} readOnly style={{ background: 'var(--ink-50)', color: 'var(--ink-700)', fontFamily: "'JetBrains Mono',monospace" }} />
                </div>
              </div>
              <div className="dr-form-row">
                <div className="dr-form-group">
                  <label className="dr-field-label">Visit Type</label>
                  <input className="dr-field-input" value={appt.visitType} readOnly style={{ background: 'var(--ink-50)', color: 'var(--ink-700)' }} />
                </div>
                <div className="dr-form-group">
                  <label className="dr-field-label">Priority</label>
                  <input className="dr-field-input" value={appt.priority} readOnly style={{ background: 'var(--ink-50)', color: 'var(--ink-700)' }} />
                </div>
              </div>
              <div className="dr-form-row">
                <div className="dr-form-group">
                  <label className="dr-field-label">Age / Gender</label>
                  <input className="dr-field-input" value={`${appt.age} yrs · ${appt.gender}`} readOnly style={{ background: 'var(--ink-50)', color: 'var(--ink-700)' }} />
                </div>
                <div className="dr-form-group">
                  <label className="dr-field-label">Known Condition</label>
                  <input className="dr-field-input" value={appt.condition} readOnly style={{ background: 'var(--ink-50)', color: 'var(--ink-700)' }} />
                </div>
              </div>
              <div className="dr-form-group">
                <label className="dr-field-label">Chief Complaint</label>
                <textarea className="dr-field-textarea" value={appt.chiefComplaint} readOnly style={{ background: 'var(--ink-50)', color: 'var(--ink-700)' }} rows={3} />
              </div>
              {appt.vitals.length > 0 && (
                <div className="dr-form-group">
                  <label className="dr-field-label">Vitals Recorded at Check-in</label>
                  <div className="dr-vitals-grid" style={{ gridTemplateColumns: appt.vitals.length === 1 ? '1fr' : 'repeat(2,1fr)' }}>
                    {appt.vitals.map(v => (
                      <div key={v.label} className="dr-vital-card">
                        <div className="dr-vital-label">{v.label}</div>
                        <div className="dr-vital-value" style={{ color: v.color }}>{v.value} <span className="dr-vital-unit" style={{ display: 'inline' }}>{v.unit}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'notes' && (
            <div>
              <div className="dr-form-group">
                <label className="dr-field-label">Symptoms</label>
                <textarea className="dr-field-textarea" rows={3} placeholder="Describe symptoms observed during examination..."
                  value={symptoms} onChange={e => setSymptoms(e.target.value)} />
              </div>
              <div className="dr-form-group">
                <label className="dr-field-label">Investigations</label>
                <textarea className="dr-field-textarea" rows={3} placeholder="Clinical findings, examination notes..."
                  value={investigations} onChange={e => setInvestigations(e.target.value)} />
              </div>
              <div className="dr-form-group">
                <label className="dr-field-label">Lab Test Recommendation</label>
                <MultiSelect options={LAB_TESTS} selected={labTests} onChange={setLabTests} placeholder="Select recommended lab tests…" />
              </div>
            </div>
          )}

          {tab === 'medications' && (
            <div>
              {meds.length === 0 && !adding && (
                <div className="dr-empty" style={{ padding: '32px 16px', marginBottom: 14 }}>No Active Medications.</div>
              )}

              {meds.map(m => (
                <div key={m.id} className="dr-med-edit-row" style={editingId === m.id ? { alignItems: 'flex-start' } : undefined}>
                  {editingId === m.id ? (
                    <MedEditFields med={m} onSave={patch => saveEdit(m.id, patch)} onCancel={() => setEditingId(null)} />
                  ) : (
                    <>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5 }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>
                          {m.dosage} · {m.timing}{m.duration ? ` · ${m.duration}` : ''}
                        </div>
                      </div>
                      <Chip label="Active" color="green" />
                      <button className="dr-btn-outline" onClick={() => setEditingId(m.id)}>Modify</button>
                      <button className="dr-btn-outline danger" onClick={() => stopMedication(m.id)} title="Stop medication">Stop</button>
                    </>
                  )}
                </div>
              ))}

              {adding && (
                <div className="dr-med-add-row">
                  <div className="dr-form-group" style={{ marginBottom: 0 }}>
                    <label className="dr-field-label">Medicine</label>
                    <SearchSelect options={PHARMACY_MEDICINES} value={draftMed} onChange={setDraftMed} placeholder="Type to search medicine…" />
                  </div>
                  <div className="dr-form-group" style={{ marginBottom: 0 }}>
                    <label className="dr-field-label">Dosage</label>
                    <select className="dr-field-select" value={draftDose} onChange={e => setDraftDose(e.target.value)}>
                      <option value="">Select frequency…</option>
                      {DOSAGE_FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="dr-form-group" style={{ marginBottom: 0 }}>
                    <label className="dr-field-label">Consume Time</label>
                    <MultiSelect options={DOSAGE_TIMINGS} selected={draftTimes} onChange={setDraftTimes} placeholder="Select consume time(s)…" />
                  </div>
                  <div className="dr-form-group" style={{ marginBottom: 0 }}>
                    <label className="dr-field-label">Duration</label>
                    <input className="dr-field-input" placeholder="e.g. 5 days" value={draftDur} onChange={e => setDraftDur(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, gridColumn: '1 / -1', justifyContent: 'flex-end' }}>
                    <button className="dr-btn-secondary" onClick={addMedication}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      Add
                    </button>
                    <button className="dr-btn-primary" onClick={finishAdding}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      Done
                    </button>
                  </div>
                </div>
              )}

              {!adding && (
                <button className="dr-btn-add-med" onClick={() => setAdding(true)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  {meds.length === 0 ? 'Add Medication' : 'Add New Medication'}
                </button>
              )}
            </div>
          )}

          {tab === 'history' && (
            <div>
              <div className="dr-field-label" style={{ marginBottom: 14 }}>Last 6 months · all hospitals</div>
              {history.length === 0 ? (
                <div className="dr-empty" style={{ padding: '32px 16px' }}>No visit history available for the last 6 months.</div>
              ) : (
                <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--card)' }}>
                  <table className="dr-table">
                    <thead>
                      <tr>{['Date', 'Hospital', 'Doctor', 'Diagnosis', 'Action'].map(h => <th key={h} className="dr-th">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {history.map(h => (
                        <tr key={h.id} className="dr-tr">
                          <td className="dr-td" style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--mineral-700)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h.date}</td>
                          <td className="dr-td">{h.hospital}</td>
                          <td className="dr-td" style={{ color: 'var(--ink-600)' }}>{h.doctor}</td>
                          <td className="dr-td" style={{ fontWeight: 600 }}>{h.diagnosis}</td>
                          <td className="dr-td">
                            <button className="dr-btn-outline" onClick={() => setViewHistoryId(h.id)}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'attachments' && (
            <div>
              <div className="dr-field-label" style={{ marginBottom: 14 }}>Last 6 months · all hospitals</div>
              {attachments.length === 0 ? (
                <div className="dr-empty" style={{ padding: '32px 16px' }}>No lab reports available for the last 6 months.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {attachments.map(a => {
                    const rc = resultChip(a.result);
                    return (
                      <div key={a.id} className="dr-attachment-row">
                        <div className="dr-attachment-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 13.5 }}>{a.testName}</div>
                          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{a.hospital} · {a.date}</div>
                        </div>
                        <Chip label={rc.label} color={rc.color} />
                        <button className="dr-btn-outline" title="Demo only — file preview not available">View</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="dr-consult-footer">
          <button className="dr-btn-secondary" onClick={onClose}>Close</button>
          <button className="dr-btn-primary" onClick={() => setShowConfirmComplete(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            Review Completed
          </button>
        </div>
      </div>

      {/* ── Read-only viewer for a History row's full prescription ── */}
      {viewingHistory && (
        <div className="dr-modal-backdrop" style={{ zIndex: 260 }} onClick={e => { e.stopPropagation(); setViewHistoryId(null); }}>
          <div className="dr-modal dr-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="dr-modal-header">
              <div>
                <div className="dr-modal-title">{viewingHistory.diagnosis}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-500)', marginTop: 4 }}>
                  {viewingHistory.hospital} · {viewingHistory.doctor} · {viewingHistory.date}
                </div>
              </div>
              <button className="dr-modal-close" onClick={() => setViewHistoryId(null)}>✕</button>
            </div>
            <div className="dr-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="dr-field-label" style={{ color: 'var(--mineral-700)' }}>Read-only record from {viewingHistory.hospital}</div>

              {viewingHistory.symptoms && (
                <div>
                  <div className="dr-section-label">Symptoms</div>
                  <div className="dr-field-textarea" style={{ background: 'var(--ink-50)', color: 'var(--ink-700)', cursor: 'default' }}>{viewingHistory.symptoms}</div>
                </div>
              )}

              {viewingHistory.investigations && (
                <div>
                  <div className="dr-section-label">Investigations</div>
                  <div className="dr-field-textarea" style={{ background: 'var(--ink-50)', color: 'var(--ink-700)', cursor: 'default' }}>{viewingHistory.investigations}</div>
                </div>
              )}

              <div>
                <div className="dr-section-label">Medications</div>
                {viewingHistory.medications && viewingHistory.medications.length > 0 ? (
                  <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <table className="dr-table">
                      <thead><tr>{['Medicine', 'Dosage', 'Timing'].map(h => <th key={h} className="dr-th">{h}</th>)}</tr></thead>
                      <tbody>
                        {viewingHistory.medications.map((m, i) => (
                          <tr key={i} className="dr-tr">
                            <td className="dr-td" style={{ fontWeight: 600 }}>{m.name}</td>
                            <td className="dr-td">{m.dosage}</td>
                            <td className="dr-td">{m.timing}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ background: 'var(--ink-50)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 13.5, color: 'var(--ink-700)' }}>
                    {viewingHistory.prescriptionSummary}
                  </div>
                )}
              </div>

              {viewingHistory.labTests && viewingHistory.labTests.length > 0 && (
                <div>
                  <div className="dr-section-label">Lab Tests Recommended</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {viewingHistory.labTests.map(t => <Chip key={t} label={t} color="primary" />)}
                  </div>
                </div>
              )}
            </div>
            <div className="dr-modal-footer">
              <button className="dr-btn-secondary" onClick={() => setViewHistoryId(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm before completing the review ── */}
      {showConfirmComplete && (
        <div className="dr-modal-backdrop" style={{ zIndex: 260 }} onClick={e => { e.stopPropagation(); setShowConfirmComplete(false); }}>
          <div className="dr-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="dr-modal-header">
              <div className="dr-modal-title">Complete Consultation?</div>
              <button className="dr-modal-close" onClick={() => setShowConfirmComplete(false)}>✕</button>
            </div>
            <div className="dr-modal-body">
              <p style={{ fontSize: 13.5, color: 'var(--ink-700)', lineHeight: 1.6, margin: 0 }}>
                This will mark <strong>{appt.name}</strong>'s consultation as <strong>Completed</strong> and move them
                out of the active queue. Notes, medications, and lab test recommendations entered in this form will be saved.
              </p>
            </div>
            <div className="dr-modal-footer">
              <button className="dr-btn-secondary" onClick={() => setShowConfirmComplete(false)}>Cancel</button>
              <button className="dr-btn-primary" onClick={handleReviewCompleted}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Inline edit fields for an existing medication row ──
const MedEditFields: React.FC<{ med: Medication; onSave: (patch: Partial<Medication>) => void; onCancel: () => void }> = ({ med, onSave, onCancel }) => {
  const [dose, setDose]   = useState(DOSAGE_FREQUENCIES.includes(med.dosage) ? med.dosage : '');
  const [times, setTimes] = useState<string[]>(med.timing ? med.timing.split(',').map(t => t.trim()).filter(Boolean) : []);
  const [dur, setDur]     = useState(med.duration || '');

  const save = () => {
    if (!dose.trim())     { alert('Please select a dosage frequency.'); return; }
    if (times.length === 0) { alert('Please select at least one consume time.'); return; }
    onSave({ dosage: dose, timing: times.join(', '), duration: dur.trim() || undefined });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 10 }}>
        <select className="dr-field-select" style={{ height: 36 }} value={dose} onChange={e => setDose(e.target.value)}>
          <option value="">Select frequency…</option>
          {DOSAGE_FREQUENCIES.map(f => <option key={f}>{f}</option>)}
        </select>
        <MultiSelect options={DOSAGE_TIMINGS} selected={times} onChange={setTimes} placeholder="Select consume time(s)…" />
        <input className="dr-field-input" style={{ height: 36 }} value={dur} onChange={e => setDur(e.target.value)} placeholder="Duration" />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="dr-btn-outline" onClick={save}>Save</button>
        <button className="dr-btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};
