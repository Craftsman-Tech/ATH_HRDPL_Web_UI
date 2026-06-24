// ============================================================================
//  Orders.tsx — Queue screen (used for BOTH In-House and External queues)
// ----------------------------------------------------------------------------
//  <Queue queue="inhouse" /> → In-House Tests Queue (doctor-raised)
//  <Queue queue="external" /> → External Tests Queue (adds "+ Add External
//      Walk-in" → dialog → new row in the same table).
//  Flow: New → Accept → Generate Barcode → order leaves the queue and appears
//  in Sample Collection (handled by the shared store).
// ============================================================================
import React, { useState, useMemo } from 'react';
import type { TestOrder, TestQueue, Priority } from '../types/labtech.types';
import { TEST_NAMES, catalogOf } from '../data/mockLabData';
import { useLab } from '../data/labStore';
import { Chip, priorityChip, orderStatusChip } from '../shared/Chip';
import { Toast } from '../shared/Toast';
import { useToast } from '../hooks/useToast';
import { MultiSelect } from '../shared/MultiSelect';

const uniq = (xs: string[]) => Array.from(new Set(xs));
const nowTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }).toUpperCase();

/* ── Add External Walk-in dialog ────────────────────────────────────────── */
const AddExternalModal: React.FC<{
  nextId: string;
  onClose: () => void;
  onCreate: (o: { patient: string; age: number; gender: 'Male' | 'Female' | 'Other'; tests: string[]; time: string; priority: Priority }) => void;
}> = ({ nextId, onClose, onCreate }) => {
  const [patient, setPatient]   = useState('');
  const [age, setAge]           = useState('');
  const [gender, setGender]     = useState<'Male' | 'Female' | 'Other'>('Male');
  const [tests, setTests]       = useState<string[]>([]);
  const [when, setWhen]         = useState(nowTime());
  const [priority, setPriority] = useState<Priority>('Routine');
  const [err, setErr]           = useState('');

  const create = () => {
    if (!patient.trim())      { setErr('Patient name is required.'); return; }
    if (!age || Number(age) <= 0) { setErr('Enter a valid age.'); return; }
    if (tests.length === 0)   { setErr('Select at least one test type.'); return; }
    onCreate({ patient: patient.trim(), age: Number(age), gender, tests, time: when, priority });
    onClose();
  };

  return (
    <div className="lt-modal-backdrop" onClick={onClose}>
      <div className="lt-modal lt-modal-lg" onClick={e => e.stopPropagation()}>
        <div className="lt-modal-header">
          <div className="lt-modal-title">Add External Walk-in</div>
          <button className="lt-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="lt-modal-body">
          <div className="lt-form-row">
            <div className="lt-form-group">
              <label className="lt-field-label">Order No. (auto-generated)</label>
              <input className="lt-field-input" value={nextId} readOnly style={{ fontFamily: 'monospace', background: 'var(--ink-50)', color: 'var(--ink-600)' }} />
            </div>
            <div className="lt-form-group">
              <label className="lt-field-label">Date &amp; Time (auto)</label>
              <input className="lt-field-input" value={when} onChange={e => setWhen(e.target.value)} />
            </div>
          </div>

          <div className="lt-form-row">
            <div className="lt-form-group">
              <label className="lt-field-label">Patient Name</label>
              <input className="lt-field-input" placeholder="Full name" value={patient} onChange={e => { setPatient(e.target.value); setErr(''); }} />
            </div>
            <div className="lt-form-row" style={{ marginBottom: 0 }}>
              <div className="lt-form-group">
                <label className="lt-field-label">Age</label>
                <input className="lt-field-input" type="number" min={0} placeholder="Age" value={age} onChange={e => { setAge(e.target.value); setErr(''); }} />
              </div>
              <div className="lt-form-group">
                <label className="lt-field-label">Gender</label>
                <select className="lt-field-select" value={gender} onChange={e => setGender(e.target.value as any)}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lt-form-group">
            <label className="lt-field-label">Type of Test (search &amp; multi-select)</label>
            <MultiSelect inline options={TEST_NAMES} value={tests} onChange={v => { setTests(v); setErr(''); }} placeholder="Type to search tests..." />
          </div>

          <div className="lt-form-group">
            <label className="lt-field-label">Priority</label>
            <select className="lt-field-select" value={priority} onChange={e => setPriority(e.target.value as Priority)} style={{ maxWidth: 220 }}>
              <option>STAT</option><option>Urgent</option><option>Routine</option>
            </select>
          </div>

          {err && <div className="lt-inline-error">{err}</div>}
        </div>
        <div className="lt-modal-footer">
          <button className="lt-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="lt-btn-primary" onClick={create}>Create Test Order</button>
        </div>
      </div>
    </div>
  );
};

/* ── Queue (shared by both tabs) ────────────────────────────────────────── */
export const Queue: React.FC<{ queue: TestQueue }> = ({ queue }) => {
  const { toast, msg } = useToast();
  const lab = useLab();
  const orders = queue === 'inhouse' ? lab.inhouse : lab.external;

  const [q, setQ]               = useState('');
  const [dept, setDept]         = useState('all');
  const [doctor, setDoctor]     = useState('all');
  const [priority, setPriority] = useState('all');
  const [type, setType]         = useState('all');
  const [detail, setDetail]     = useState<TestOrder | null>(null);
  const [showAdd, setShowAdd]   = useState(false);

  const depts   = uniq(orders.map(o => o.department));
  const doctors = uniq(orders.map(o => o.doctor));
  const types   = uniq(orders.map(o => o.testType));

  const rows = useMemo(() => orders.filter(o =>
    (q === '' || o.patient.toLowerCase().includes(q.toLowerCase()) || o.pid.toLowerCase().includes(q.toLowerCase()) || o.id.toLowerCase().includes(q.toLowerCase())) &&
    (dept === 'all' || o.department === dept) &&
    (doctor === 'all' || o.doctor === doctor) &&
    (priority === 'all' || o.priority === priority) &&
    (type === 'all' || o.testType === type)
  ), [orders, q, dept, doctor, priority, type]);

  const accept = (o: TestOrder) => { lab.acceptOrder(queue, o.id); toast(`Accepted ${o.id} — ${o.tests.join(', ')}`); };
  const generate = (o: TestOrder) => {
    const bc = lab.generateBarcode(queue, o.id);
    toast(`Barcode ${bc} generated — moved to Sample Collection`);
    if (detail) setDetail(null);
  };

  const nextExtId = `EXT-${7002 + lab.external.length}`;

  return (
    <div className="lt-scroll lt-fade">
      <div className="lt-content">
        {queue === 'external' && (
          <div className="lt-queue-actionbar">
            <button className="lt-btn-primary" onClick={() => setShowAdd(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add External Walk-in
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="lt-filters">
          <div className="lt-filter-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="lt-filter-search" placeholder="Search patient, ID or order no." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <select className="lt-filter-select" value={dept} onChange={e => setDept(e.target.value)}>
            <option value="all">All Departments</option>{depts.map(d => <option key={d}>{d}</option>)}
          </select>
          <select className="lt-filter-select" value={doctor} onChange={e => setDoctor(e.target.value)}>
            <option value="all">All Doctors</option>{doctors.map(d => <option key={d}>{d}</option>)}
          </select>
          <select className="lt-filter-select" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="all">All Priorities</option><option>STAT</option><option>Urgent</option><option>Routine</option>
          </select>
          <select className="lt-filter-select" value={type} onChange={e => setType(e.target.value)}>
            <option value="all">All Test Types</option>{types.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="lt-card pad0">
          <table className="lt-table">
            <thead>
              <tr>
                <th className="lt-th">Order</th><th className="lt-th">Patient</th><th className="lt-th">Test</th>
                <th className="lt-th">Doctor</th><th className="lt-th">Time</th><th className="lt-th">Priority</th>
                <th className="lt-th">Status</th><th className="lt-th" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td className="lt-td" colSpan={8}><div className="lt-empty">No {queue === 'inhouse' ? 'in-house' : 'external'} test orders.</div></td></tr>}
              {rows.map(o => {
                const pc = priorityChip(o.priority); const sc = orderStatusChip(o.status);
                return (
                  <tr key={o.id} className="lt-tr">
                    <td className="lt-td"><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{o.id}</span></td>
                    <td className="lt-td"><div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{o.patient}</div><div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{o.pid} · {o.age}/{o.gender[0]}</div></td>
                    <td className="lt-td">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {o.tests.map(t => <span key={t} className="lt-test-tag">{t}</span>)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>{catalogOf(o.tests[0])?.testType ?? o.testType}</div>
                    </td>
                    <td className="lt-td">{o.doctor}</td>
                    <td className="lt-td">{o.time}</td>
                    <td className="lt-td"><Chip {...pc} /></td>
                    <td className="lt-td"><Chip {...sc} /></td>
                    <td className="lt-td">
                      <div style={{ display: 'flex', gap: 7, justifyContent: 'flex-end' }}>
                        <button className="lt-btn-outline" onClick={() => setDetail(o)}>View</button>
                        {o.status === 'New'
                          ? <button className="lt-btn-outline" onClick={() => accept(o)}>Accept</button>
                          : <button className="lt-btn-outline" onClick={() => generate(o)}>Generate Barcode</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {detail && (
        <div className="lt-modal-backdrop" onClick={() => setDetail(null)}>
          <div className="lt-modal lt-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="lt-modal-header">
              <div className="lt-modal-title">Test Order · {detail.id}</div>
              <button className="lt-modal-close" onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="lt-modal-body">
              <dl className="lt-dl">
                <dt>Patient</dt><dd>{detail.patient} ({detail.pid})</dd>
                <dt>Age / Gender</dt><dd>{detail.age} · {detail.gender}</dd>
                <dt>Tests</dt><dd>{detail.tests.join(', ')}</dd>
                <dt>Department</dt><dd>{detail.department}</dd>
                <dt>Ordering Doctor</dt><dd>{detail.doctor}</dd>
                <dt>Ordered</dt><dd>{detail.ordered} · {detail.time}</dd>
                <dt>Priority</dt><dd><Chip {...priorityChip(detail.priority)} /></dd>
                <dt>Status</dt><dd><Chip {...orderStatusChip(detail.status)} /></dd>
                <dt>Barcode</dt><dd><span style={{ fontFamily: 'monospace' }}>{detail.barcode || '— not yet generated —'}</span></dd>
                <dt>Assigned Tech</dt><dd>{detail.assignedTech ?? '— Unassigned —'}</dd>
              </dl>
            </div>
            <div className="lt-modal-footer">
              {detail.status === 'New'
                ? <button className="lt-btn-primary" onClick={() => { accept(detail); setDetail(null); }}>Accept Test</button>
                : <button className="lt-btn-primary" onClick={() => generate(detail)}>Generate Barcode</button>}
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <AddExternalModal
          nextId={nextExtId}
          onClose={() => setShowAdd(false)}
          onCreate={(o) => { lab.addExternalOrder(o); toast(`Walk-in order created for ${o.patient}`); }}
        />
      )}

      <Toast msg={msg} />
    </div>
  );
};

/* Back-compat default for any old import path. */
export const Orders: React.FC = () => <Queue queue="inhouse" />;
