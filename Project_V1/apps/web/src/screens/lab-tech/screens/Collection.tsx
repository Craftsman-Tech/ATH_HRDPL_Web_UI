// ============================================================================
//  Collection.tsx — Sample Collection. Collect, verify and label samples.
// ----------------------------------------------------------------------------
//  • Barcode field is AUTO-POPULATED from the order's generated barcode (read-only).
//  • "Tests To Be Conducted" lists every test on the order (auto-populated).
//  • Only Print Labels + Confirm Collection actions (no Reject / Recollect).
//  • Confirm Collection moves the order into Sample Processing (shared store).
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useLab } from '../data/labStore';
import { Chip, sampleStatusChip } from '../shared/Chip';
import { Toast } from '../shared/Toast';
import { useToast } from '../hooks/useToast';
import { MultiSelect } from '../shared/MultiSelect';

const SAMPLE_TYPES = ['Whole Blood (EDTA)', 'Serum (SST)', 'Plasma (Citrate)', 'Fluoride Plasma', 'Urine', 'Swab', 'CSF'];
const nowStamp = () => new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const Collection: React.FC = () => {
  const { toast, msg } = useToast();
  const lab = useLab();
  const samples = lab.samples;

  const firstPending = samples.find(s => s.status === 'Pending')?.barcode ?? samples[0]?.barcode ?? '';
  const [selId, setSelId]       = useState<string>(firstPending);
  const [verified, setVerified] = useState(false);
  const [collector, setCollector] = useState(lab.profile.name);
  const [collectAt, setCollectAt] = useState<string>(nowStamp());

  // Keep a valid selection as the list changes (rows get added on Generate Barcode).
  useEffect(() => {
    if (!samples.some(s => s.barcode === selId)) {
      setSelId(samples.find(s => s.status === 'Pending')?.barcode ?? samples[0]?.barcode ?? '');
      setVerified(false);
    }
  }, [samples, selId]);

  const sel = samples.find(s => s.barcode === selId);

  const confirm = () => {
    if (!sel) return;
    if (!verified) { toast('Please verify the patient first'); return; }
    lab.confirmCollection(sel.barcode, collector, collectAt);
    toast(`Sample ${sel.barcode} collected — moved to Sample Processing`);
    setVerified(false);
  };
  const printLabel = () => sel && toast(`Printing barcode label ${sel.barcode} for the tube...`);

  return (
    <div className="lt-scroll lt-fade">
      <div className="lt-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, alignItems: 'start' }} className="lt-collect-grid">
          {/* Pending list */}
          <div className="lt-card pad0">
            <div className="lt-card-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="lt-card-title" style={{ marginBottom: 0 }}>Sample Collection List</span>
            </div>
            <div style={{ padding: 14 }}>
              {samples.length === 0 && <div className="lt-empty">No samples awaiting collection.</div>}
              {samples.map(s => (
                <div key={s.barcode}
                  className={`lt-patient-row ${selId === s.barcode ? 'selected' : 'normal'}`}
                  onClick={() => { setSelId(s.barcode); setVerified(false); }}>
                  <div className="lt-token-badge" style={{ fontSize: 10 }}>{s.barcode.replace('BC-', '')}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{s.patient}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{s.tests.join(', ')} · {s.sampleType.join(', ')}</div>
                  </div>
                  <Chip {...sampleStatusChip(s.status)} />
                </div>
              ))}
            </div>
          </div>

          {/* Collection form */}
          {!sel ? (
            <div className="lt-card"><div className="lt-empty">Select a sample to collect.</div></div>
          ) : (
            <div className="lt-card">
              <div className="lt-card-title">Collect Sample — {sel.patient}</div>

              <div className="lt-form-group">
                <label className="lt-field-label">Barcode Scanner</label>
                <input className="lt-field-input lt-field-readonly" value={sel.barcode} readOnly placeholder="Auto-populated on barcode generation" />
                <div className="lt-field-hint">Auto-populated from the generated barcode.</div>
              </div>

              <div className="lt-form-group">
                <label className="lt-field-label">Tests To Be Conducted</label>
                <div className="lt-tests-box">
                  {sel.tests.map(t => <span key={t} className="lt-test-tag">{t}</span>)}
                </div>
              </div>

              <div className="lt-form-group">
                <label className="lt-field-label">Patient Verification</label>
                <div onClick={() => setVerified(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', border: '1px solid var(--line)', borderRadius: 10, cursor: 'pointer', background: verified ? 'var(--mineral-100)' : 'var(--card)' }}>
                  <div className={`lt-multiselect-checkbox ${verified ? 'checked' : ''}`}>
                    {verified && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: verified ? 'var(--mineral-700)' : 'var(--ink-700)' }}>
                    Identity confirmed: {sel.patient} ({sel.pid})
                  </span>
                </div>
              </div>

              <div className="lt-form-row">
                <div className="lt-form-group">
                  <label className="lt-field-label">Sample Type</label>
                  <MultiSelect
                    inline
                    options={SAMPLE_TYPES}
                    value={sel.sampleType}
                    onChange={next => lab.setSampleType(sel.barcode, next)}
                    placeholder="Select sample type(s)..."
                  />
                </div>
                <div className="lt-form-group">
                  <label className="lt-field-label">Collection Date &amp; Time</label>
                  <input className="lt-field-input" value={collectAt} onChange={e => setCollectAt(e.target.value)} />
                </div>
              </div>

              <div className="lt-form-group">
                <label className="lt-field-label">Collector Name</label>
                <input className="lt-field-input" value={collector} onChange={e => setCollector(e.target.value)} />
              </div>

              <div className="lt-form-group">
                <label className="lt-field-label">Sample Status</label>
                <div><Chip {...sampleStatusChip(sel.status)} />{sel.collectedAt && <span style={{ fontSize: 12, color: 'var(--ink-500)', marginLeft: 8 }}>· {sel.collectedAt} by {sel.collector}</span>}</div>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                <button className="lt-btn-primary" onClick={confirm} disabled={sel.status === 'Collected'}>Confirm Collection</button>
                <button className="lt-btn-secondary" onClick={printLabel}>Print Labels</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast msg={msg} />
    </div>
  );
};
