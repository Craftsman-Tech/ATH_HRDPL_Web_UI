// ============================================================================
//  PatientTile.tsx — the right-hand "patient tile info card"
// ============================================================================
//  Shown when a patient is selected in Today's Queue, or in My Schedule when
//  the selected date is TODAY. Two variants:
//    'full'    — vitals, chief complaint, active medications, Start/Resume
//                Consultation button (Today's Queue + My Schedule→today)
//    'limited' — patient details + appointment time + chief complaint only
//                (My Schedule → a future date, per requirement #3)
// ============================================================================
import React from 'react';
import type { Appointment } from '../types/doctor.types';
import { initials } from './initials';
import { Chip, statusChip, riskChip } from './Chip';
import { useElapsed } from './useElapsed';

export const PatientTile: React.FC<{
  appt: Appointment;
  variant: 'full' | 'limited';
  onStartConsultation?: (appt: Appointment) => void;
}> = ({ appt, variant, onStartConsultation }) => {
  const sc = statusChip(appt.status);
  const rc = riskChip(appt.riskLevel);
  const elapsed = useElapsed(appt.queuedAt, appt.status === 'Waiting');

  // Per requirement: Active Medications only surface for a Follow-Up visit
  // that already has at least one active medication on file.
  const showMeds = appt.visitType === 'Follow-Up' && appt.activeMedications.length > 0;

  return (
    <div className="dr-fade">
      <div className="dr-detail-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div className="dr-detail-avatar">{initials(appt.name)}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 400, fontSize: 19, letterSpacing: '-0.02em' }}>{appt.name}</div>
            <div style={{ fontSize: 12.5, opacity: 0.78, marginTop: 2 }}>{appt.patientId} · Age {appt.age} · {appt.condition}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Chip label={sc.label} color={sc.color} />
          <Chip label={rc.label} color={rc.color} />
          {appt.token && <span className="dr-chip gray mono" style={{ fontFamily: "'JetBrains Mono',monospace" }}>{appt.token}</span>}
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Appointment meta row ── */}
        <div className="dr-detail-section" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 22px' }}>
          <MetaItem label="Visit Type" value={appt.visitType} />
          <MetaItem label={appt.scheduledTime ? 'Scheduled Time' : 'Wait Time'} value={appt.scheduledTime || (appt.status === 'Waiting' ? elapsed : '—')} />
          <MetaItem label="Priority" value={appt.priority} />
        </div>

        {/* ── Chief Complaint (renamed from "Clinical Notes") ── */}
        <div>
          <div className="dr-section-label">Chief Complaint</div>
          <div style={{ background: 'var(--al)', border: '1px solid #f3dfa8', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 13.5, color: 'var(--ink-700)', lineHeight: 1.7 }}>
            {appt.chiefComplaint || '—'}
          </div>
        </div>

        {variant === 'full' && (
          <>
            {/* ── Current Vitals ── */}
            <div>
              <div className="dr-section-label">Current Vitals</div>
              {appt.vitals.length === 0 ? (
                <div className="dr-empty" style={{ padding: '22px 16px' }}>No Vitals recorded for this visit.</div>
              ) : (
                <div className="dr-vitals-grid" style={{ gridTemplateColumns: appt.vitals.length === 1 ? '1fr' : 'repeat(2,1fr)' }}>
                  {appt.vitals.map(v => (
                    <div key={v.label} className="dr-vital-card">
                      <div className="dr-vital-label">{v.label}</div>
                      <div className="dr-vital-value" style={{ color: v.color }}>
                        {v.value} <span className="dr-vital-unit" style={{ display: 'inline' }}>{v.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Active Medications ── */}
            <div>
              <div className="dr-section-label">Active Medications</div>
              {!showMeds ? (
                <div className="dr-empty" style={{ padding: '22px 16px' }}>No Active Medications.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {appt.activeMedications.map(m => (
                    <div key={m.id} className="dr-med-row">
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</span>
                        <span style={{ fontSize: 12, color: 'var(--ink-500)' }}> · {m.dosage} · {m.timing}</span>
                      </div>
                      <Chip label="Active" color="green" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Start / Resume Consultation ──
                 Per requirement: the action button only appears for a patient
                 who is physically present and "Waiting for Doctor".
                   Waiting          → Start Consultation
                   In Consultation  → Resume Consultation
                   Completed        → Completed banner
                   Scheduled        → no button (patient hasn't checked in yet) */}
            {appt.status === 'Waiting' && (
              <button className="dr-start-btn" onClick={() => onStartConsultation?.(appt)}>
                Start Consultation
              </button>
            )}
            {appt.status === 'In Consultation' && (
              <button className="dr-start-btn" onClick={() => onStartConsultation?.(appt)}>
                Resume Consultation
              </button>
            )}
            {appt.status === 'Completed' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 13, borderRadius: 12, background: 'var(--bl)', color: 'var(--blue)', fontWeight: 700, fontSize: 13.5 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Consultation Completed
              </div>
            )}
            {appt.status === 'Scheduled' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 13, borderRadius: 12, background: 'var(--ink-50)', color: 'var(--ink-500)', fontWeight: 600, fontSize: 13 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Patient has not checked in yet
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const MetaItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)', marginTop: 2 }}>{value}</div>
  </div>
);
