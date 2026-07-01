import React, { useState, useMemo } from 'react';
import { Badge, SvgIcon, Th, Td, statusColor, initials } from '../shared/HaHelpers';
import { PATIENTS, PRESCRIPTIONS, LAB_ORDERS } from '../data/mockHaData';
import type { Patient } from '../types/hospitaladmin.types';

export const PatientsModule: React.FC = () => {
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState<Patient | null>(null);
  const [ptTab,    setPtTab]    = useState<'overview' | 'prescriptions' | 'lab'>('overview');
  const inpStyle: React.CSSProperties = { width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', boxSizing:'border-box' };

  const filtered = useMemo(() =>
    PATIENTS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  if (selected) {
    const p      = selected;
    const ptRx   = PRESCRIPTIONS.filter(rx => rx.patient === p.name);
    const ptLab  = LAB_ORDERS.filter(l  => l.patient  === p.name);

    const handlePatientPDF = () => {
      const rxRows  = ptRx.map(rx  => `<tr><td>${rx.id}</td><td>${rx.drug}</td><td>${rx.qty}</td><td>${rx.doctor}</td><td>${rx.date}</td><td>${rx.status}</td></tr>`).join('');
      const labRows = ptLab.map(l  => `<tr><td>${l.id}</td><td>${l.test}</td><td>${l.ordered}</td><td>${l.date}</td><td>${l.status}</td><td>${l.result||'—'}</td></tr>`).join('');
      const html = `<!DOCTYPE html><html><head><title>Patient Record — ${p.name}</title>
      <style>body{font-family:Arial,sans-serif;padding:28px;color:#1a2540;}h1{font-size:20px;}
      h2{font-size:14px;color:#0d9488;border-bottom:2px solid #e6faf8;padding-bottom:5px;margin-top:22px;margin-bottom:10px;}
      table{width:100%;border-collapse:collapse;font-size:12px;}
      th{background:#f4f8f7;padding:7px 10px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;}
      td{padding:8px 10px;border-bottom:1px solid #f0f0f0;}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;}
      .meta-item{background:#f4f8f7;border-radius:8px;padding:10px 12px;}
      .meta-lbl{font-size:10px;color:#64748b;text-transform:uppercase;margin-bottom:3px;}
      .meta-val{font-size:13px;font-weight:600;}
      .allergy{display:inline-block;background:#ffe4e6;color:#e11d48;border-radius:20px;padding:3px 10px;font-size:12px;font-weight:600;margin:2px;}
      .footer{margin-top:32px;color:#94a3b8;font-size:11px;border-top:1px solid #f0f0f0;padding-top:10px;}
      </style></head><body>
      <h1>Patient Medical Record</h1>
      <div class="meta">
        <div class="meta-item"><div class="meta-lbl">Name</div><div class="meta-val">${p.name}</div></div>
        <div class="meta-item"><div class="meta-lbl">Patient ID</div><div class="meta-val">${p.id}</div></div>
        <div class="meta-item"><div class="meta-lbl">Age / Gender</div><div class="meta-val">${p.age} yrs · ${p.gender==='F'?'Female':'Male'}</div></div>
        <div class="meta-item"><div class="meta-lbl">Blood Group</div><div class="meta-val">${p.blood}</div></div>
        <div class="meta-item"><div class="meta-lbl">Phone</div><div class="meta-val">${p.phone}</div></div>
        <div class="meta-item"><div class="meta-lbl">Total Visits</div><div class="meta-val">${p.visits} visits (Last: ${p.lastVisit})</div></div>
      </div>
      <h2>Allergies</h2>
      <div>${p.allergies.split(', ').map(a => `<span class="allergy">${a}</span>`).join('')||'None known'}</div>
      <h2>Medical History</h2><p style="font-size:13px;color:#374151;line-height:1.7;">${p.history}</p>
      <h2>Prescriptions</h2>
      <table><thead><tr><th>Rx ID</th><th>Drug</th><th>Qty</th><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>${rxRows||'<tr><td colspan="6" style="color:#94a3b8">No prescriptions found</td></tr>'}</tbody></table>
      <h2>Lab Reports</h2>
      <table><thead><tr><th>Lab ID</th><th>Test</th><th>Ordered By</th><th>Date</th><th>Status</th><th>Result</th></tr></thead>
      <tbody>${labRows||'<tr><td colspan="6" style="color:#94a3b8">No lab orders found</td></tr>'}</tbody></table>
      <div class="footer">Vexoo · Generated on ${new Date().toLocaleDateString('en-IN')} · Confidential</div>
      </body></html>`;
      const w = window.open('', '_blank');
      if (w) { w.document.write(html); w.document.close(); w.print(); }
    };

    const tabBtnStyle = (active: boolean): React.CSSProperties => ({
      padding:'7px 18px', borderRadius:9, border:'none', cursor:'pointer',
      fontFamily:'inherit', fontSize:13, fontWeight:active?700:500,
      background:active?'var(--primary)':'transparent',
      color:active?'white':'var(--text-muted)',
    });

    return (
      <>
      <div className="ha-content ha-fade">
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <button onClick={() => setSelected(null)} style={{ background:'#f1f5f9', border:'none', borderRadius:8, padding:'6px 14px', fontSize:13, cursor:'pointer', fontFamily:'inherit', fontWeight:500 }}>← Back</button>
          <span style={{ color:'var(--text-muted)', fontSize:13 }}>Patients / <strong>{p.name}</strong></span>
          <div style={{ marginLeft:'auto' }}>
            <button onClick={handlePatientPDF} style={{ display:'flex', alignItems:'center', gap:7, background:'var(--primary)', color:'white', border:'none', borderRadius:9, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={14} color="white" />
              Export PDF
            </button>
          </div>
        </div>
        <div style={{ display:'flex', gap:4, marginBottom:20, background:'var(--bg)', borderRadius:11, padding:4, width:'fit-content', border:'1px solid var(--border)' }}>
          {(['overview','prescriptions','lab'] as const).map(t => (
            <button key={t} onClick={() => setPtTab(t)} style={tabBtnStyle(ptTab===t)}>
              {t==='overview'?'Overview':t==='prescriptions'?`Prescriptions (${ptRx.length})`:`Lab Reports (${ptLab.length})`}
            </button>
          ))}
        </div>

        {ptTab === 'overview' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:20 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="ha-card">
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:10 }}>
                  <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:700, color:'var(--primary)' }}>{initials(p.name)}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16 }}>{p.name}</div>
                    <div style={{ fontSize:12.5, color:'var(--text-muted)' }}>{p.id}</div>
                  </div>
                  <Badge label={p.status} color={statusColor(p.status)} />
                </div>
                <div style={{ borderTop:'1px solid var(--border)', marginTop:16, paddingTop:16, display:'flex', flexDirection:'column', gap:10 }}>
                  {([['Age',`${p.age} years`],['Gender',p.gender==='F'?'Female':'Male'],['Blood Type',p.blood],['Phone',p.phone],['Email',p.email],['Last Visit',p.lastVisit],['Total Visits',String(p.visits)]] as [string,string][]).map(([k,v]) => (
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:12, color:'var(--text-muted)' }}>{k}</span>
                      <span style={{ fontSize:12.5, fontWeight:k==='Total Visits'?700:500, color:k==='Total Visits'?'var(--primary)':'var(--text)' }}>{v}{k==='Total Visits'?' visits':''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="ha-card">
                <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Medical Summary</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:14 }}>
                  {([['Primary Condition',p.condition,'var(--primary-light)','var(--primary)'],['Blood Pressure','128/82 mmHg','var(--blue-light)','var(--blue)'],['Heart Rate','74 bpm','var(--green-light)','var(--green)']] as [string,string,string,string][]).map(([l,v,bg,c]) => (
                    <div key={l} style={{ background:bg, borderRadius:12, padding:'12px 14px' }}>
                      <div style={{ fontSize:11, color:c, fontWeight:600, marginBottom:4 }}>{l}</div>
                      <div style={{ fontSize:14, fontWeight:700 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7 }}>Patient presents with well-managed {p.condition.toLowerCase()}. Recent lab results show stable trends. Medication compliance reported as good.</div>
              </div>
              <div className="ha-card" style={{ borderLeft:'4px solid var(--rose)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:18 }}>⚠</span>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--rose)' }}>Known Allergies</div>
                </div>
                {p.allergies === 'None known'
                  ? <div style={{ fontSize:13.5, color:'var(--text-muted)', background:'var(--green-light)', padding:'8px 14px', borderRadius:9 }}>✓ No known drug or substance allergies recorded</div>
                  : <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>{p.allergies.split(', ').map(a => (<span key={a} style={{ fontSize:13, fontWeight:600, padding:'5px 14px', borderRadius:20, background:'var(--rose-light)', color:'var(--rose)', border:'1px solid #fca5a5' }}>{a}</span>))}</div>}
              </div>
              <div className="ha-card">
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <SvgIcon path="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" size={16} color="var(--primary)" />
                  <div style={{ fontWeight:700, fontSize:14 }}>Medical History</div>
                </div>
                <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.8, background:'var(--bg)', padding:'12px 16px', borderRadius:10, border:'1px solid var(--border)' }}>{p.history}</div>
              </div>
              <div className="ha-card">
                <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Active Medications</div>
                {(['Lisinopril 10mg · Once daily, morning','Hydrochlorothiazide 12.5mg · Once daily','Aspirin 81mg · Once daily'] as string[]).map(m => (
                  <div key={m} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'var(--bg)', borderRadius:10, marginBottom:8, border:'1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{m.split(' · ')[0]}</div>
                      <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{m.split(' · ')[1]}</div>
                    </div>
                    <Badge label="Ongoing" color="primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {ptTab === 'prescriptions' && (
          <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', fontWeight:700, fontSize:15, borderBottom:'1px solid var(--border)' }}>Prescriptions — {p.name}</div>
            {ptRx.length === 0
              ? <div style={{ padding:'48px 20px', textAlign:'center', color:'var(--text-muted)' }}><div style={{ fontSize:32, marginBottom:10 }}>💊</div><div style={{ fontWeight:700, fontSize:15 }}>No prescriptions found for this patient</div></div>
              : <table className="ha-table" style={{ width:'100%' }}>
                  <thead><tr>{['Rx ID','Drug / Dosage','Qty','Prescribed By','Date','Status'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
                  <tbody>
                    {ptRx.map((rx,i) => (
                      <tr key={rx.id} className="ha-tr" style={{ borderBottom:i<ptRx.length-1?'1px solid var(--border)':'none' }}>
                        <Td><span style={{ fontWeight:600, color:'var(--primary)' }}>{rx.id}</span></Td>
                        <Td style={{ fontWeight:500 }}>{rx.drug}</Td>
                        <Td>{rx.qty}</Td>
                        <Td style={{ color:'var(--text-muted)' }}>{rx.doctor}</Td>
                        <Td style={{ color:'var(--text-muted)' }}>{rx.date}</Td>
                        <Td><Badge label={rx.status} color={statusColor(rx.status)} /></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>}
          </div>
        )}

        {ptTab === 'lab' && (
          <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', fontWeight:700, fontSize:15, borderBottom:'1px solid var(--border)' }}>Lab Reports — {p.name}</div>
            {ptLab.length === 0
              ? <div style={{ padding:'48px 20px', textAlign:'center', color:'var(--text-muted)' }}><div style={{ fontSize:32, marginBottom:10 }}>🧪</div><div style={{ fontWeight:700, fontSize:15 }}>No lab orders found for this patient</div></div>
              : <table className="ha-table" style={{ width:'100%' }}>
                  <thead><tr>{['Lab ID','Test','Ordered By','Date','Priority','Status','Result'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
                  <tbody>
                    {ptLab.map((l,i) => (
                      <tr key={l.id} className="ha-tr" style={{ borderBottom:i<ptLab.length-1?'1px solid var(--border)':'none', background:l.priority==='STAT'?'#fff8f8':undefined }}>
                        <Td><span style={{ fontWeight:600, color:'var(--primary)' }}>{l.id}</span></Td>
                        <Td style={{ fontWeight:500 }}>{l.test}</Td>
                        <Td style={{ color:'var(--text-muted)' }}>{l.ordered}</Td>
                        <Td style={{ color:'var(--text-muted)' }}>{l.date}</Td>
                        <Td><Badge label={l.priority} color={statusColor(l.priority)} /></Td>
                        <Td><Badge label={l.status} color={statusColor(l.status)} /></Td>
                        <Td style={{ fontSize:12.5, color:'var(--text-muted)' }}>{l.result||'—'}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>}
          </div>
        )}
      </div>
      </>
    );
  }

  return (
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Patients</div>
          <div className="ha-section-sub">{PATIENTS.length} registered patients</div>
        </div>
        <button className="ha-action-btn" onClick={() => {}}>
          <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
          New Patient
        </button>
      </div>
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <div className="ha-search-input-wrap">
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" size={15} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, or condition..." />
        </div>
      </div>
      <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
        <div className="ha-table-wrap">
          <table className="ha-table">
            <thead><tr>{['Patient','ID','Age','Blood','Condition','Doctor','Last Visit','Status',''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {filtered.map((p,i) => (
                <tr key={p.id} className="ha-tr" style={{ borderBottom:i<filtered.length-1?'1px solid var(--border)':'none' }} onClick={() => setSelected(p)}>
                  <Td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12, color:'var(--primary)', flexShrink:0 }}>{initials(p.name)}</div>
                      <span style={{ fontWeight:600 }}>{p.name}</span>
                    </div>
                  </Td>
                  <Td style={{ color:'var(--text-muted)' }}>{p.id}</Td>
                  <Td>{p.age}y · {p.gender}</Td>
                  <Td><Badge label={p.blood} color="gray" /></Td>
                  <Td style={{ color:'var(--text-muted)' }}>{p.condition}</Td>
                  <Td>{p.doctor}</Td>
                  <Td style={{ color:'var(--text-muted)' }}>{p.lastVisit}</Td>
                  <Td><Badge label={p.status} color={statusColor(p.status)} /></Td>
                  <Td><SvgIcon path="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" size={16} color="var(--text-muted)" /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
