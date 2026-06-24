// ============================================================================
//  Equipment.tsx — Monitor analyzers: status, calibration, maintenance, errors.
// ----------------------------------------------------------------------------
//  • Reads/writes the shared store (lab.equipment) so added analyzers persist
//    across navigation within the session.
//  • "Add Item" is the ONLY way to register new equipment — opens a modal form.
// ============================================================================
import React, { useState } from 'react';
import type { EquipmentItem, EqStatus } from '../types/labtech.types';
import { useLab } from '../data/labStore';
import { Chip, eqStatusChip } from '../shared/Chip';
import { Toast } from '../shared/Toast';
import { useToast } from '../hooks/useToast';

const EQ_STATUSES: EqStatus[] = ['Online', 'Calibration Due', 'Maintenance', 'Offline'];

const blankForm = {
  name: '', model: '', status: 'Online' as EqStatus,
  lastCalib: '', nextCalib: '', nextService: '',
};

export const Equipment: React.FC = () => {
  const { toast, msg } = useToast();
  const lab = useLab();
  const [detail, setDetail] = useState<EquipmentItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(blankForm);

  const items = lab.equipment;

  const STATS = [
    { label: 'Total Equipment', val: items.length, cls: 's-neutral' },
    { label: 'Online',          val: items.filter(e => e.status === 'Online').length, cls: 's-mineral' },
    { label: 'Needs Attention', val: items.filter(e => e.status === 'Calibration Due' || e.status === 'Maintenance').length, cls: 's-amber' },
    { label: 'Offline',         val: items.filter(e => e.status === 'Offline').length, cls: 's-red' },
  ];

  const upd = (patch: Partial<typeof form>) => setForm(f => ({ ...f, ...patch }));

  const saveItem = () => {
    if (!form.name.trim()) { toast('Please enter an equipment name'); return; }
    const id = `EQ-${String(items.length + 1).padStart(2, '0')}`;
    const item: EquipmentItem = {
      id, name: form.name.trim(), model: form.model.trim() || '—', status: form.status,
      load: 'Idle',
      lastCalib: form.lastCalib.trim() || '—',
      nextCalib: form.nextCalib.trim() || '—',
      nextService: form.nextService.trim() || '—',
      uptime: '100%', errors: [],
    };
    lab.addEquipment(item);
    toast(`Added ${item.name} (${item.id})`);
    setForm(blankForm);
    setAddOpen(false);
  };

  return (
    <div className="lt-scroll lt-fade">
      <div className="lt-content">
        <div className="lt-stat-row">
          {STATS.map(s => (
            <div key={s.label} className={`lt-stat-card ${s.cls}`}>
              <div className="lt-stat-label">{s.label}</div>
              <div className="lt-stat-value">{s.val}</div>
            </div>
          ))}
        </div>

        <div className="lt-section-head">
          <span className="lt-card-title" style={{ marginBottom: 0 }}>Analyzers &amp; Instruments</span>
          <div className="lt-head-actions">
            <button className="lt-btn-primary" onClick={() => setAddOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Item
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {items.map(e => {
            const ec = eqStatusChip(e.status);
            return (
              <div key={e.id} className="lt-card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink-900)' }}>{e.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-500)' }}>{e.model} · {e.id}</div>
                  </div>
                  <Chip {...ec} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  {[
                    ['Load', e.load], ['Uptime', e.uptime],
                    ['Last Calibration', e.lastCalib], ['Next Calibration', e.nextCalib],
                    ['Next Service', e.nextService], ['Running', e.runningTest ?? '— Idle —'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="lt-field-label" style={{ marginBottom: 2 }}>{k}</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-800)', fontWeight: 500 }}>{v}</div>
                    </div>
                  ))}
                </div>

                {e.errors.length > 0 && (
                  <div style={{ background: 'var(--rl)', borderRadius: 9, padding: '9px 11px', marginBottom: 12 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--rose)', marginBottom: 2 }}>Error Log</div>
                    {e.errors.map((er, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--rose)' }}>{er.time} — {er.msg}</div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="lt-btn-outline" onClick={() => setDetail(e)}>Service History</button>
                  <button className="lt-btn-outline" onClick={() => toast(`Calibration logged for ${e.name}`)}>Run Calibration</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {addOpen && (
        <div className="lt-modal-backdrop" onClick={() => setAddOpen(false)}>
          <div className="lt-modal" onClick={e => e.stopPropagation()}>
            <div className="lt-modal-header">
              <div className="lt-modal-title">Add Equipment</div>
              <button className="lt-modal-close" onClick={() => setAddOpen(false)}>✕</button>
            </div>
            <div className="lt-modal-body">
              <div className="lt-form-row">
                <div className="lt-form-group">
                  <label className="lt-field-label">Equipment Name</label>
                  <input className="lt-field-input" value={form.name} onChange={e => upd({ name: e.target.value })} placeholder="e.g. Sysmex XN-1000" />
                </div>
                <div className="lt-form-group">
                  <label className="lt-field-label">Model / Type</label>
                  <input className="lt-field-input" value={form.model} onChange={e => upd({ model: e.target.value })} placeholder="e.g. Hematology Analyzer" />
                </div>
              </div>
              <div className="lt-form-group">
                <label className="lt-field-label">Status</label>
                <select className="lt-field-select" value={form.status} onChange={e => upd({ status: e.target.value as EqStatus })}>
                  {EQ_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="lt-form-row">
                <div className="lt-form-group">
                  <label className="lt-field-label">Last Calibration</label>
                  <input className="lt-field-input" value={form.lastCalib} onChange={e => upd({ lastCalib: e.target.value })} placeholder="e.g. 18 Jun 2026 or —" />
                </div>
                <div className="lt-form-group">
                  <label className="lt-field-label">Next Calibration</label>
                  <input className="lt-field-input" value={form.nextCalib} onChange={e => upd({ nextCalib: e.target.value })} placeholder="e.g. 25 Jun 2026 or —" />
                </div>
              </div>
              <div className="lt-form-group">
                <label className="lt-field-label">Next Service</label>
                <input className="lt-field-input" value={form.nextService} onChange={e => upd({ nextService: e.target.value })} placeholder="e.g. 12 Jul 2026 or —" />
              </div>
            </div>
            <div className="lt-modal-footer">
              <button className="lt-btn-secondary" onClick={() => setAddOpen(false)}>Cancel</button>
              <button className="lt-btn-primary" onClick={saveItem}>Add Item</button>
            </div>
          </div>
        </div>
      )}

      {detail && (
        <div className="lt-modal-backdrop" onClick={() => setDetail(null)}>
          <div className="lt-modal" onClick={e => e.stopPropagation()}>
            <div className="lt-modal-header">
              <div className="lt-modal-title">{detail.name} · Service History</div>
              <button className="lt-modal-close" onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="lt-modal-body">
              {[
                { d: '02 Jun 2026', t: 'Preventive maintenance', who: 'BioServ Engineer' },
                { d: '18 May 2026', t: 'Calibration verified',    who: 'Kevin Liu' },
                { d: '02 May 2026', t: 'Probe replacement',       who: 'BioServ Engineer' },
              ].map((h, i) => (
                <div className="lt-feed-row" key={i}>
                  <div className="lt-feed-dot blue">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <div style={{ minWidth: 0 }}><div className="lt-feed-title">{h.t}</div><div className="lt-feed-sub">{h.who}</div></div>
                  <div className="lt-feed-time">{h.d}</div>
                </div>
              ))}
            </div>
            <div className="lt-modal-footer">
              <button className="lt-btn-secondary" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
      <Toast msg={msg} />
    </div>
  );
};
