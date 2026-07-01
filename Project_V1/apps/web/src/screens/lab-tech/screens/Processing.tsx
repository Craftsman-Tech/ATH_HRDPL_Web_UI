// ============================================================================
//  Processing.tsx — Sample Processing. Run collected samples on equipment.
// ----------------------------------------------------------------------------
//  • "Patient / Test" column shows EVERY test on the order.
//  • Equipment column is a MULTI-SELECT (one analyzer per test if needed).
//  • Complete moves the order to Test Results (shared store).
// ============================================================================
import React, { useState, useEffect } from 'react';
import type { ProcessSample } from '../types/labtech.types';
import { EQUIPMENT_NAMES } from '../data/mockLabData';
import { useLab } from '../data/labStore';
import { Chip, procStatusChip, qcChip } from '../shared/Chip';
import { Toast } from '../shared/Toast';
import { useToast } from '../hooks/useToast';
import { MultiSelect } from '../shared/MultiSelect';

function fmt(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const Timer: React.FC<{ startedAt?: number; running: boolean }> = ({ startedAt, running }) => {
  const [, force] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => force(x => x + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  if (!startedAt) return <span style={{ color: 'var(--ink-400)' }}>—</span>;
  return <span className="lt-timer-pill"><span className="lt-wait-dot" style={{ background: 'var(--mineral-600)' }} />{fmt(Date.now() - startedAt)}</span>;
};

export const Processing: React.FC = () => {
  const { toast, msg } = useToast();
  const lab = useLab();
  const rows = lab.processing;

  const start  = (r: ProcessSample) => { lab.startProcessing(r.barcode);  toast(`Started ${r.barcode} on ${r.equipments.join(', ')}`); };
  const pause  = (r: ProcessSample) => { lab.pauseProcessing(r.barcode);  toast(`Paused ${r.barcode}`); };
  const resume = (r: ProcessSample) => { lab.resumeProcessing(r.barcode); toast(`Resumed ${r.barcode}`); };
  const finish = (r: ProcessSample) => { lab.completeProcessing(r.barcode); toast(`Completed ${r.barcode} — moved to Test Results`); };

  const ready   = rows.filter(r => r.status === 'Ready').length;
  const running = rows.filter(r => r.status === 'Running').length;
  const STATS = [
    { label: 'Ready for Processing', val: ready,   cls: 's-blue' },
    { label: 'Currently Running',    val: running, cls: 's-mineral' },
    { label: 'Paused',               val: rows.filter(r => r.status === 'Paused').length, cls: 's-amber' },
    { label: 'Completed',            val: rows.filter(r => r.status === 'Completed').length, cls: 's-neutral' },
  ];

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

        <div className="lt-card pad0">
          <table className="lt-table">
            <thead>
              <tr>
                <th className="lt-th">Barcode</th><th className="lt-th">Collected</th><th className="lt-th">Patient / Test</th>
                <th className="lt-th" style={{ minWidth: 230 }}>Equipment</th><th className="lt-th">Timer</th>
                <th className="lt-th">QC</th><th className="lt-th">Status</th>
                <th className="lt-th" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td className="lt-td" colSpan={8}><div className="lt-empty">No samples in processing.</div></td></tr>}
              {rows.map(r => (
                <tr key={r.barcode} className="lt-tr">
                  <td className="lt-td"><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.barcode}</span></td>
                  <td className="lt-td" style={{ whiteSpace: 'nowrap', color: 'var(--ink-700)' }}>{r.collectedAt ?? '—'}</td>
                  <td className="lt-td">
                    <div style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{r.patient}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
                      {r.tests.map(t => <span key={t} className="lt-test-tag">{t}</span>)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 3 }}>~{r.durationMin} min</div>
                  </td>
                  <td className="lt-td" style={{ minWidth: 230 }}>
                    {r.status === 'Ready'
                      ? <MultiSelect compact inline options={EQUIPMENT_NAMES} value={r.equipments} onChange={v => lab.setEquipments(r.barcode, v)} placeholder="Select equipment..." />
                      : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{r.equipments.map(e => <span key={e} className="lt-test-tag">{e}</span>)}</div>}
                  </td>
                  <td className="lt-td"><Timer startedAt={r.startedAt} running={r.status === 'Running'} /></td>
                  <td className="lt-td"><Chip {...qcChip(r.qc)} /></td>
                  <td className="lt-td"><Chip {...procStatusChip(r.status)} /></td>
                  <td className="lt-td">
                    <div style={{ display: 'flex', gap: 7, justifyContent: 'flex-end' }}>
                      {r.status === 'Ready'   && <button className="lt-btn-outline" onClick={() => start(r)} disabled={r.equipments.length === 0}>Start</button>}
                      {r.status === 'Running' && <><button className="lt-btn-outline" onClick={() => pause(r)}>Pause</button><button className="lt-btn-outline" onClick={() => finish(r)}>Complete</button></>}
                      {r.status === 'Paused'  && <><button className="lt-btn-outline" onClick={() => resume(r)}>Resume</button><button className="lt-btn-outline" onClick={() => finish(r)}>Complete</button></>}
                      {r.status === 'Completed' && <span style={{ fontSize: 12, color: 'var(--mineral-700)', fontWeight: 600 }}>Done</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Toast msg={msg} />
    </div>
  );
};
