// ============================================================================
//  Queue.tsx — Today's Queue
// ============================================================================
//  Lists every patient on today's calendar: Walk-Ins currently waiting AND
//  patients scheduled for later today. Clicking a row opens the patient tile
//  info card on the right; "Start Consultation" opens the multi-tab
//  Consultation form.
// ============================================================================
import React, { useState, useMemo } from 'react';
import type { Appointment, DoctorAppState } from '../types/doctor.types';
import { TODAY } from '../data/mockDoctorData';
import { statusChip, priorityChip } from '../shared/Chip';
import { useElapsed } from '../shared/useElapsed';
import { PatientTile } from '../shared/PatientTile';
import { ConsultationForm } from '../shared/ConsultationForm';

const QueueRow: React.FC<{ appt: Appointment; selected: boolean; onClick: () => void }> = ({ appt, selected, onClick }) => {
  const sc = statusChip(appt.status);
  const pc = priorityChip(appt.priority);
  const elapsed = useElapsed(appt.queuedAt, appt.status === 'Waiting');
  return (
    <div className={`dr-patient-row ${selected ? 'selected' : 'normal'}`} onClick={onClick}>
      <div className={`dr-token-badge ${appt.priority === 'Urgent' ? 'urgent' : appt.priority === 'Emergency' ? 'emergency' : ''}`}>
        {appt.token.replace('OP-', '')}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{appt.name}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{appt.chiefComplaint}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginBottom: 5 }}>
          <span className={`dr-chip ${pc.color}`}>{pc.label}</span>
          <span className={`dr-chip ${sc.color}`}>{sc.label}</span>
        </div>
        {appt.status === 'Waiting' ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: 'var(--amber)' }}>
            <span className="dr-wait-dot" />{elapsed}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>{appt.scheduledTime || '—'}</span>
        )}
      </div>
    </div>
  );
};

export const Queue: React.FC<DoctorAppState> = ({ appointments, setAppointments, onNav }) => {
  const todays = useMemo(() => appointments.filter(a => a.date === TODAY), [appointments]);
  const [selectedId, setSelectedId] = useState<string | null>(todays[0]?.id ?? null);
  const [consultId, setConsultId] = useState<string | null>(null);

  const selected = todays.find(a => a.id === selectedId) || todays[0];
  const consultAppt = appointments.find(a => a.id === consultId) || null;

  const count = (s: string) => todays.filter(a => a.status === s).length;
  const STATS = [
    { label: 'Waiting for Doctor', val: count('Waiting'),         cls: 's-amber'   },
    { label: 'In Consultation',    val: count('In Consultation'), cls: 's-mineral' },
    { label: 'Scheduled Later Today', val: count('Scheduled'),    cls: 's-blue'    },
    { label: 'Completed',          val: count('Completed'),       cls: 's-neutral' },
  ];

  const startConsultation = (appt: Appointment) => {
    if (appt.status === 'Waiting' || appt.status === 'Scheduled') {
      setAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, status: 'In Consultation' } : a));
    }
    setConsultId(appt.id);
  };

  const handleComplete = (updated: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
    setConsultId(null);
    onNav('queue');
  };

  return (
    <div className="dr-scroll dr-fade">
      <div className="dr-content" style={{ paddingBottom: 0 }}>
        <div className="dr-stat-row">
          {STATS.map(s => (
            <div key={s.label} className={`dr-stat-card ${s.cls}`}>
              <div className="dr-stat-label">{s.label}</div>
              <div className="dr-stat-value">{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dr-queue-grid" style={{ marginTop: 22 }}>
        <div className="dr-queue-list">
          {todays.length === 0 && <div className="dr-empty">No patients on today's queue.</div>}
          {todays.map(a => (
            <QueueRow key={a.id} appt={a} selected={selected?.id === a.id} onClick={() => setSelectedId(a.id)} />
          ))}
        </div>
        <div className="dr-queue-detail">
          {selected ? (
            <PatientTile appt={selected} variant="full" onStartConsultation={startConsultation} />
          ) : (
            <div className="dr-empty" style={{ margin: 20 }}>Select a patient to view details.</div>
          )}
        </div>
      </div>

      {consultAppt && (
        <ConsultationForm appt={consultAppt} onClose={() => setConsultId(null)} onComplete={handleComplete} />
      )}
    </div>
  );
};
