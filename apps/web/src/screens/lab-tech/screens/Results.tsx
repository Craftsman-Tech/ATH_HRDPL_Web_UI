// ============================================================================
//  Results.tsx — Test Results. Enter and submit laboratory findings.
// ----------------------------------------------------------------------------
//  • If the order has multiple tests, the entry card shows ONE TAB PER TEST
//    (tab labelled by the test name). Each tab has its own parameters,
//    attachments and remarks.
//  • Attach Images / Documents opens a real file picker; chosen files are listed.
//  • Submit for Validation moves the order to Completed Tests (shared store).
// ============================================================================
import React, { useState, useEffect, useRef } from 'react';
import type { ResultFlag } from '../types/labtech.types';
import { useLab } from '../data/labStore';
import { Toast } from '../shared/Toast';
import { useToast } from '../hooks/useToast';

const FLAGS: ResultFlag[] = ['normal', 'high', 'low', 'critical'];
const flagLabel = (f: ResultFlag) =>
  f === 'critical' ? 'Critical' : f === 'high' ? 'High' : f === 'low' ? 'Low' : 'Normal';

export const Results: React.FC = () => {
  const { toast, msg } = useToast();
  const lab = useLab();
  const list = lab.results;

  const [selId, setSelId] = useState<string>(list[0]?.id ?? '');
  const [tab, setTab]     = useState(0);
  const [q, setQ]         = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Keep selection valid as the list shrinks (items leave on Submit).
  useEffect(() => {
    if (!list.some(r => r.id === selId)) { setSelId(list[0]?.id ?? ''); setTab(0); }
  }, [list, selId]);

  const sel = list.find(r => r.id === selId);
  const filtered = list.filter(r =>
    q === '' || r.patient.toLowerCase().includes(q.toLowerCase()) || r.test.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase()));

  const activeTest = sel?.tests[tab];

  const saveDraft = () => toast(`Draft saved for ${sel?.id}`);
  const submit    = () => { if (sel) { lab.submitResult(sel.id); toast(`${sel.id} submitted for validation — moved to Completed Tests`); } };

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!sel || !e.target.files) return;
    const names = Array.from(e.target.files).map(f => f.name);
    if (names.length) { lab.addResultAttachments(sel.id, tab, names); toast(`Attached ${names.length} file(s)`); }
    e.target.value = '';
  };

  return (
    <div className="lt-scroll lt-fade">
      <div className="lt-content">
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 22, alignItems: 'start' }} className="lt-results-grid">
          {/* Pending list */}
          <div className="lt-card pad0">
            <div className="lt-card-head">
              <div className="lt-filter-wrap" style={{ width: '100%' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input className="lt-filter-search" placeholder="Search test..." value={q} onChange={e => setQ(e.target.value)} />
              </div>
            </div>
            <div style={{ padding: 14 }}>
              {filtered.length === 0 && <div className="lt-empty">No pending results.</div>}
              {filtered.map(r => (
                <div key={r.id} className={`lt-patient-row ${selId === r.id ? 'selected' : 'normal'}`} onClick={() => { setSelId(r.id); setTab(0); }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.patient}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{r.tests.map(t => t.name).join(', ')} · {r.id}</div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--ink-500)' }}>{r.collected}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Entry form */}
          <div className="lt-card">
            {!sel || !activeTest ? <div className="lt-empty">Select a test to enter results.</div> : (
              <>
                <div className="lt-section-head">
                  <div>
                    <div className="lt-card-title" style={{ marginBottom: 2 }}>{sel.patient} <span style={{ fontWeight: 400, color: 'var(--ink-500)', fontSize: 15 }}>({sel.pid})</span></div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-500)' }}>{sel.id} · Ordered by {sel.doctor}</div>
                  </div>
                </div>

                {/* One tab per test */}
                {sel.tests.length > 1 && (
                  <div className="lt-tabs" style={{ marginBottom: 16 }}>
                    {sel.tests.map((t, i) => (
                      <button key={t.name} className={`lt-tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t.name}</button>
                    ))}
                  </div>
                )}

                <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: 18, marginBottom: 12 }}>{activeTest.name}
                  <span style={{ fontSize: 12.5, color: 'var(--ink-500)', fontFamily: 'inherit', marginLeft: 8 }}>{activeTest.testType}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1fr 110px', gap: 12, padding: '0 14px 8px' }}>
                  {['Parameter', 'Normal Range', 'Result', 'Flag'].map(h => <div key={h} className="lt-field-label" style={{ marginBottom: 0 }}>{h}</div>)}
                </div>
                {activeTest.params.map((p, i) => (
                  <div className="lt-param-row" key={p.name}>
                    <div style={{ fontWeight: 600, color: 'var(--ink-800)' }}>{p.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-500)', fontFamily: 'monospace' }}>{p.range}</div>
                    <input className="lt-field-input" style={{ height: 38 }} placeholder="Enter..." value={p.value} onChange={e => lab.updateResultParam(sel.id, tab, i, { value: e.target.value })} />
                    <select className="lt-field-select" style={{ height: 38 }} value={p.flag} onChange={e => lab.updateResultParam(sel.id, tab, i, { flag: e.target.value as ResultFlag })}>
                      {FLAGS.map(f => <option key={f} value={f}>{flagLabel(f)}</option>)}
                    </select>
                  </div>
                ))}

                <div className="lt-form-group" style={{ marginTop: 16 }}>
                  <label className="lt-field-label">Attach Images / Documents</label>
                  <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={onFiles} />
                  <button className="lt-btn-add-med" onClick={() => fileRef.current?.click()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Attach files
                  </button>
                  {(activeTest.attachments?.length ?? 0) > 0 && (
                    <div className="lt-attach-list">
                      {activeTest.attachments!.map((f, i) => (
                        <span key={i} className="lt-attach-pill">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lt-form-group">
                  <label className="lt-field-label">Remarks</label>
                  <textarea className="lt-field-textarea" placeholder="Observations, comments..." value={activeTest.remarks ?? ''} onChange={e => lab.updateResultRemarks(sel.id, tab, e.target.value)} />
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button className="lt-btn-secondary" onClick={saveDraft}>Save Draft</button>
                  <button className="lt-btn-primary" onClick={submit}>Submit for Validation</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Toast msg={msg} />
    </div>
  );
};
