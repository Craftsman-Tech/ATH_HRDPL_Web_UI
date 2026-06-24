import React, { useState, useEffect, useRef } from 'react';
import type { AppState, QueueEntry, QueueStatus, Appointment, Bill, BillLine } from '../types/reception.types';
import { INITIAL_QUEUE as SEED, DOCTORS } from '../data/mockReceptionData';

// ── Live wait timer ────────────────────────────────────────────────────────
function useElapsed(queuedAt: number, active: boolean): string {
  const [t, setT] = useState('');
  useEffect(() => {
    if (!active) { setT('—'); return; }
    const tick = () => {
      const s = Math.floor((Date.now() - queuedAt) / 1000);
      setT(`${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [queuedAt, active]);
  return t;
}

function priorityChip(p: string) {
  if (p === 'Emergency') return { bg: 'var(--rl)',  color: 'var(--rose)',         label: 'Emergency' };
  if (p === 'Urgent')    return { bg: 'var(--al)',  color: 'var(--amber)',        label: 'Urgent' };
  return                        { bg: 'var(--bl)',  color: 'var(--blue)',         label: 'Normal' };
}

// Map internal QueueStatus → display label + chip style
function statusDisplay(s: QueueStatus): { label: string; bg: string; color: string } {
  if (s === 'Waiting')     return { label: 'Waiting for Doctor',      bg: 'var(--al)',           color: 'var(--amber)'        };
  if (s === 'With Doctor') return { label: 'In Consultation',         bg: 'var(--mineral-100)',  color: 'var(--mineral-700)'  };
  if (s === 'Completed')   return { label: 'Consultation Completed',  bg: 'var(--bl)',           color: 'var(--blue)'         };
  return { label: s, bg: 'var(--ink-100)', color: 'var(--ink-500)' };
}

interface CallNotif { id: number; patientName: string; doctor: string; token: string; }

// ── Queue table row ────────────────────────────────────────────────────────
const QueueRow: React.FC<{
  entry:         QueueEntry;
  onDoctorCalls: (e: QueueEntry) => void;
  onDoctorDone:  (queueNo: number) => void;
}> = ({ entry, onDoctorCalls, onDoctorDone }) => {
  const isWaiting = entry.status === 'Waiting';
  const isWithDoc = entry.status === 'With Doctor';
  const isDone    = entry.status === 'Completed';
  const elapsed   = useElapsed(entry.queuedAt, isWaiting);
  const pc        = priorityChip(entry.priority);
  const sc        = statusDisplay(entry.status);

  return (
    <tr className="rc-tr" style={{ opacity: isDone ? 0.6 : 1 }}>
      <td className="rc-td" style={{ fontWeight: 600, color: 'var(--muted)' }}>{entry.queueNo}</td>
      <td className="rc-td" style={{ fontWeight: 700, color: 'var(--mineral-700)', fontFamily: 'monospace' }}>{entry.token}</td>
      <td className="rc-td" style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{entry.patientName}</td>
      <td className="rc-td" style={{ color: 'var(--ink-600)' }}>{entry.doctor}</td>
      <td className="rc-td" style={{ color: 'var(--ink-500)', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={entry.chiefComplaint}>
        {entry.chiefComplaint}
      </td>
      <td className="rc-td">
        <span style={{ background: pc.bg, color: pc.color, fontWeight: 600, fontSize: 12, padding: '3px 10px', borderRadius: 999, display: 'inline-block' }}>
          {pc.label}
        </span>
      </td>
      {/* Single STATUS column — shows all three descriptive states */}
      <td className="rc-td">
        <span style={{ background: sc.bg, color: sc.color, fontWeight: 700, fontSize: 12, padding: '4px 12px', borderRadius: 999, display: 'inline-block', whiteSpace: 'nowrap' }}>
          {sc.label}
        </span>
      </td>
      <td className="rc-td">
        {isWaiting ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 700, color: 'var(--amber)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block', animation: 'rc-pulse-dot 1.5s ease-in-out infinite' }} />
            {elapsed}
          </span>
        ) : (
          <span style={{ color: 'var(--ink-400)', fontSize: 13 }}>—</span>
        )}
      </td>
      {/* ACTION column — clear step labels for demo */}
      <td className="rc-td">
        {isWaiting && (
          <button
            onClick={() => onDoctorCalls(entry)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 9, border: '1.5px solid var(--mineral-300)',
              background: 'var(--mineral-100)', color: 'var(--mineral-700)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--mineral-200)'; e.currentTarget.style.borderColor = 'var(--mineral-700)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--mineral-100)'; e.currentTarget.style.borderColor = 'var(--mineral-300)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Step 1 — Doctor Calls Patient
          </button>
        )}
        {isWithDoc && (
          <button
            onClick={() => onDoctorDone(entry.queueNo)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 9, border: '1.5px solid var(--mineral-700)',
              background: 'var(--mineral-700)', color: '#FAFAF7',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--mineral-800)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--mineral-700)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Step 2 — Doctor Done
          </button>
        )}
        {isDone && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--blue)', fontSize: 13, fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Moved to Billing
          </span>
        )}
      </td>
    </tr>
  );
};

// ── Notification banner (fires when Doctor Calls is clicked) ───────────────
const CallNotification: React.FC<{ notif: CallNotif; onDismiss: () => void }> = ({ notif, onDismiss }) => (
  <div className="rc-fade" style={{
    position: 'fixed', top: 74, right: 20, zIndex: 500,
    background: 'var(--card)', border: '2px solid var(--mineral-700)',
    borderRadius: 'var(--radius)', padding: '16px 20px',
    boxShadow: '0 8px 32px rgba(14,124,102,.22)',
    minWidth: 320, maxWidth: 420,
    display: 'flex', alignItems: 'flex-start', gap: 14,
  }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--mineral-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24 }}>
      🔔
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--mineral-700)', marginBottom: 4 }}>
        Doctor called the patient — please inform them
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-900)' }}>{notif.patientName}</div>
      <div style={{ fontSize: 12.5, color: 'var(--ink-500)', marginTop: 2 }}>{notif.doctor} · Token {notif.token}</div>
      <div style={{ fontSize: 12.5, marginTop: 8, background: 'var(--mineral-100)', padding: '8px 11px', borderRadius: 8, fontWeight: 600, color: 'var(--mineral-700)' }}>
        📢 Ask the patient to proceed to the doctor's room now.
      </div>
    </div>
    <button onClick={onDismiss}
      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 20, lineHeight: 1, padding: 0, flexShrink: 0 }}>
      ✕
    </button>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────
export const QueueManagement: React.FC<AppState> = ({
  queue: propQueue, setQueue: setPropQueue,
  appointments, setAppointments, bills, setBills, addBellNotif,
}) => {
  const [localQueue, setLocalQueue] = useState<QueueEntry[]>(
    propQueue && propQueue.length > 0 ? propQueue : SEED
  );
  const queue    = localQueue;
  const setQueue = (fn: QueueEntry[] | ((q: QueueEntry[]) => QueueEntry[])) => {
    const next = typeof fn === 'function' ? fn(localQueue) : fn;
    setLocalQueue(next);
    setPropQueue(next);
  };

  const [doctorF, setDoctorF] = useState('All Doctors');
  const [search,  setSearch]  = useState('');
  const [notifs,  setNotifs]  = useState<CallNotif[]>([]);
  const notifId               = useRef(0);

  // Step 1: Doctor calls patient → status becomes "With Doctor" = "In Consultation"
  const onDoctorCalls = (entry: QueueEntry) => {
    const id = ++notifId.current;
    setQueue(q => q.map(e => e.queueNo === entry.queueNo ? { ...e, status: 'With Doctor' as QueueStatus } : e));
    setAppointments(a => a.map(x => x.id === entry.apptId ? { ...x, status: 'With Doctor' as Appointment['status'] } : x));
    setNotifs(n => [...n, { id, patientName: entry.patientName, doctor: entry.doctor, token: entry.token }]);
    // Also add to bell notification centre
    if (addBellNotif) addBellNotif({ patientName: entry.patientName, doctor: entry.doctor, token: entry.token });
    setTimeout(() => setNotifs(n => n.filter(x => x.id !== id)), 9000);
  };

  // Step 2: Doctor done → status becomes "Completed" = "Consultation Completed" + auto bill
  const onDoctorDone = (queueNo: number) => {
    const entry = queue.find(e => e.queueNo === queueNo);
    if (!entry) return;
    setQueue(q => q.map(e => e.queueNo === queueNo ? { ...e, status: 'Completed' as QueueStatus } : e));
    setAppointments(a => a.map(x => x.id === entry.apptId ? { ...x, status: 'Bill Pending' as Appointment['status'] } : x));
    const appt = appointments.find(a => a.id === entry.apptId);
    const newBill: Bill = {
      apptId: entry.apptId, patientId: entry.patientId, patientName: entry.patientName,
      doctor: entry.doctor,
      visitDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      lines: [{ id: 'L1', service: 'Consultation Fee', charge: 600, qty: 1 }] as BillLine[],
      prescription: appt?.prescription,
      testsRecommended: appt?.testsRecommended,
    };
    setBills(b => {
      const exists = b.find(x => x.apptId === entry.apptId);
      return exists ? b.map(x => x.apptId === entry.apptId ? newBill : x) : [...b, newBill];
    });
  };

  const count = (s: QueueStatus) => queue.filter(e => e.status === s).length;

  const filtered = [...queue]
    .sort((a, b) => {
      if (a.status === 'With Doctor' && b.status !== 'With Doctor') return -1;
      if (b.status === 'With Doctor' && a.status !== 'With Doctor') return 1;
      if (a.status === 'Completed'   && b.status !== 'Completed')   return 1;
      if (b.status === 'Completed'   && a.status !== 'Completed')   return -1;
      const po = (p: string) => p === 'Emergency' ? 0 : p === 'Urgent' ? 1 : 2;
      return po(a.priority) - po(b.priority) || a.queuedAt - b.queuedAt;
    })
    .filter(e =>
      (doctorF === 'All Doctors' || e.doctor === doctorF) &&
      (e.patientName.toLowerCase().includes(search.toLowerCase()) || e.token.includes(search))
    );

  const STATS = [
    { label: 'Total in queue',         val: queue.filter(e => e.status !== 'Completed').length, cls: 's-neutral' },
    { label: 'Waiting for Doctor',     val: count('Waiting'),                                   cls: 's-amber'   },
    { label: 'In Consultation',        val: count('With Doctor'),                               cls: 's-mineral' },
    { label: 'Consultation Completed', val: count('Completed'),                                 cls: 's-blue'    },
  ];

  return (
    <div className="rc-scroll rc-fade">
      {/* Notification banners */}
      {notifs.map(n => (
        <CallNotification key={n.id} notif={n} onDismiss={() => setNotifs(x => x.filter(i => i.id !== n.id))} />
      ))}

      <div className="rc-content">
        {/* Stat cards */}
        <div className="rc-stat-row">
          {STATS.map(s => (
            <div key={s.label} className={`rc-stat-card ${s.cls}`}>
              <div className="rc-stat-label">{s.label}</div>
              <div className="rc-stat-value">{s.val}</div>
            </div>
          ))}
        </div>

        {/* How-to banner */}
        <div style={{ background: 'var(--mineral-100)', border: '1px solid var(--mineral-300)', borderRadius: 'var(--radius-sm)', padding: '14px 18px' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--mineral-700)', marginBottom: 8 }}>
            How queue simulation works
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-700)' }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--mineral-700)', color: 'white', fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
              Click <strong style={{ color: 'var(--mineral-700)', margin: '0 4px' }}>Step 1 — Doctor Calls Patient</strong> → status changes to <strong style={{ margin: '0 4px' }}>In Consultation</strong> + you get a notification
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-700)' }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--mineral-700)', color: 'white', fontSize: 11, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</span>
              Click <strong style={{ color: 'var(--mineral-700)', margin: '0 4px' }}>Step 2 — Doctor Done</strong> → status changes to <strong style={{ margin: '0 4px' }}>Consultation Completed</strong> + patient auto-moves to Billing
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rc-card" style={{ padding: 0 }}>
          <div style={{ padding: '18px 24px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid var(--line)' }}>
            <div>
              <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 19, fontWeight: 400, letterSpacing: '-0.02em' }}>Queue Management</div>
              <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 2 }}>Priority-sorted. Once Doctor Done → patient moves to Billing automatically.</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <select className="rc-filter-select" value={doctorF} onChange={e => setDoctorF(e.target.value)}>
                <option>All Doctors</option>
                {DOCTORS.map(d => <option key={d}>{d}</option>)}
              </select>
              <div style={{ position: 'relative' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-400)', pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  style={{ height: 44, paddingLeft: 38, paddingRight: 14, border: '1px solid var(--line)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', color: 'var(--ink-900)', background: 'var(--card)', outline: 'none', width: 260, boxSizing: 'border-box' }}
                  placeholder="Search by patient name or token"
                  value={search} onChange={e => setSearch(e.target.value)}
                  onFocus={ev => (ev.currentTarget.style.borderColor = 'var(--mineral-700)')}
                  onBlur={ev  => (ev.currentTarget.style.borderColor = 'var(--line)')}
                />
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="rc-table">
              <thead>
                <tr>
                  {['#', 'Token', 'Patient', 'Doctor', 'Chief Complaint', 'Priority', 'Status', 'Wait Time', 'Action'].map(h => (
                    <th key={h} className="rc-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <QueueRow key={e.queueNo} entry={e} onDoctorCalls={onDoctorCalls} onDoctorDone={onDoctorDone} />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="rc-td" style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 40 }}>
                      Queue is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};