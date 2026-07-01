// ============================================================================
//  Schedule.tsx — My Schedule
// ============================================================================
//  7-day strip + a list of appointments for the selected date. If the
//  selected date is TODAY, behaves exactly like Today's Queue (full patient
//  tile, Start Consultation). For a future date, patients show status
//  "Scheduled" and the tile is limited to patient details + appointment
//  time + chief complaint (no vitals / meds / Start Consultation).
// ============================================================================
import React, { useState, useMemo } from 'react';
import type { Appointment, DoctorAppState } from '../types/doctor.types';
import { TODAY, toDateStr } from '../data/mockDoctorData';
import { statusChip, priorityChip } from '../shared/Chip';
import { useElapsed } from '../shared/useElapsed';
import { PatientTile } from '../shared/PatientTile';
import { ConsultationForm } from '../shared/ConsultationForm';

function parseDate(s: string) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }

function weekDates(): string[] {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun..6=Sat
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toDateStr(d);
  });
}

const QueueRow: React.FC<{ appt: Appointment; selected: boolean; onClick: () => void; isToday: boolean }> = ({ appt, selected, onClick, isToday }) => {
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
          <span className={`dr-chip ${isToday ? sc.color : 'gray'}`}>{isToday ? sc.label : 'Scheduled'}</span>
        </div>
        {isToday && appt.status === 'Waiting' ? (
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

export const Schedule: React.FC<DoctorAppState> = ({ appointments, setAppointments, onNav }) => {
  const dates = useMemo(weekDates, []);
  const [activeDate, setActiveDate] = useState(TODAY);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [consultId, setConsultId] = useState<string | null>(null);

  const dayAppts = useMemo(() => appointments.filter(a => a.date === activeDate), [appointments, activeDate]);
  const selected = dayAppts.find(a => a.id === selectedId) || dayAppts[0];
  const isToday = activeDate === TODAY;
  const consultAppt = appointments.find(a => a.id === consultId) || null;

  const handleSelectDay = (d: string) => { setActiveDate(d); setSelectedId(null); };

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
        <div className="dr-schedule-week">
          {dates.map(d => {
            const dt = parseDate(d);
            const dayCount = appointments.filter(a => a.date === d).length;
            const active = d === activeDate;
            const today = d === TODAY;
            return (
              <div key={d} className={`dr-week-day ${active ? 'today' : 'other'}`} onClick={() => handleSelectDay(d)}>
                <div style={{ fontSize: 11, color: active ? 'rgba(255,255,255,0.75)' : 'var(--ink-500)', marginBottom: 3, fontWeight: 600 }}>
                  {dt.toLocaleDateString('en-IN', { weekday: 'short' })}{today && !active ? ' · Today' : ''}
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: active ? 'white' : 'var(--ink-900)', fontFamily: "'Fraunces',Georgia,serif" }}>
                  {dt.getDate()}
                </div>
                <div style={{ fontSize: 10.5, color: active ? 'rgba(255,255,255,0.7)' : 'var(--ink-500)', marginTop: 4 }}>
                  {dayCount} appt{dayCount !== 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dr-queue-grid" style={{ marginTop: 22 }}>
        <div className="dr-queue-list">
          {dayAppts.length === 0 && <div className="dr-empty">No appointments on this date.</div>}
          {dayAppts.map(a => (
            <QueueRow key={a.id} appt={a} selected={selected?.id === a.id} onClick={() => setSelectedId(a.id)} isToday={isToday} />
          ))}
        </div>
        <div className="dr-queue-detail">
          {selected ? (
            <PatientTile appt={selected} variant={isToday ? 'full' : 'limited'} onStartConsultation={isToday ? startConsultation : undefined} />
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
