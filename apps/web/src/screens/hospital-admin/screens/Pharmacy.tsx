import React, { useState, useMemo } from 'react';
import { Badge, SvgIcon, Th, Td, statusColor, shortDateToISO } from '../shared/HaHelpers';
import { PRESCRIPTIONS, PRESCRIPTION_DETAILS } from '../data/mockHaData';
import type { Prescription } from '../types/hospitaladmin.types';

export const PharmacyModule: React.FC = () => {
  const [showRx,       setShowRx]       = useState(false);
  const [openMenu,     setOpenMenu]     = useState<string | null>(null);
  const [viewRx,       setViewRx]       = useState<Prescription | null>(null);
  const [filterFrom,   setFilterFrom]   = useState('');
  const [filterTo,     setFilterTo]     = useState('');
  const [filterDoc,    setFilterDoc]    = useState('All Doctors');
  const [filterStatus, setFilterStatus] = useState('All');

  const inpStyle: React.CSSProperties = { width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' };
  const selStyle: React.CSSProperties = { padding:'7px 28px 7px 12px', borderRadius:9, border:'1px solid var(--border)', background:'var(--bg)', fontSize:12.5, fontWeight:500, cursor:'pointer', fontFamily:'inherit', color:'var(--text)', outline:'none', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center' };

  const doctors = ['All Doctors', ...Array.from(new Set(PRESCRIPTIONS.map(r => r.doctor)))];

  const filtered = useMemo(() =>
    PRESCRIPTIONS.filter(rx => {
      const iso = shortDateToISO(rx.date);
      if (filterFrom && iso < filterFrom) return false;
      if (filterTo   && iso > filterTo)   return false;
      if (filterDoc !== 'All Doctors' && rx.doctor !== filterDoc)   return false;
      if (filterStatus !== 'All'      && rx.status !== filterStatus) return false;
      return true;
    }), [filterFrom, filterTo, filterDoc, filterStatus]);

  const handleDownloadRx = (rx: Prescription) => {
    const det = PRESCRIPTION_DETAILS[rx.id];
    const html = `<!DOCTYPE html><html><head><title>Prescription ${rx.id} — Vexoo</title>
    <style>body{font-family:Arial,sans-serif;padding:28px;color:#1a2540;}h1{font-size:20px;margin-bottom:4px;}.subtitle{font-size:13px;color:#64748b;margin-bottom:20px;}h2{font-size:13px;color:#0d9488;border-bottom:2px solid #e6faf8;padding-bottom:5px;margin-top:20px;margin-bottom:10px;}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}.item{background:#f4f8f7;border-radius:8px;padding:10px 12px;}.lbl{font-size:10px;color:#64748b;text-transform:uppercase;margin-bottom:3px;}.val{font-size:13px;font-weight:600;}.course{background:#fffef5;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;margin-top:12px;}.footer{margin-top:32px;color:#94a3b8;font-size:11px;border-top:1px solid #f0f0f0;padding-top:10px;}</style></head><body>
    <h1>Prescription — ${rx.id}</h1><div class="subtitle">Vexoo · Generated on ${new Date().toLocaleDateString('en-IN')}</div>
    <h2>Patient & Drug Details</h2>
    <div class="grid">
      <div class="item"><div class="lbl">Patient</div><div class="val">${rx.patient}</div></div>
      <div class="item"><div class="lbl">Prescribed By</div><div class="val">${rx.doctor}</div></div>
      <div class="item"><div class="lbl">Drug</div><div class="val">${rx.drug}</div></div>
      <div class="item"><div class="lbl">Quantity</div><div class="val">${rx.qty} units</div></div>
      <div class="item"><div class="lbl">Frequency</div><div class="val">${det?.frequency??'As directed'}</div></div>
      <div class="item"><div class="lbl">Duration</div><div class="val">${det?.duration??'As directed'}</div></div>
      <div class="item"><div class="lbl">Date</div><div class="val">${rx.date}</div></div>
      <div class="item"><div class="lbl">Status</div><div class="val">${rx.status}</div></div>
    </div>
    <h2>Instructions</h2><p style="font-size:13px;line-height:1.7;color:#374151;">${det?.instructions??'As directed by physician.'}</p>
    <div class="course"><strong>Course Progress:</strong> Tablets taken so far: ${det?.taken??0} / ${rx.qty} &nbsp;|&nbsp; Remaining: ${rx.qty-(det?.taken??0)} units</div>
    <div class="footer">Vexoo · Confidential — For internal and patient use only</div>
    </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <>
    <div className="ha-content ha-fade" onClick={() => setOpenMenu(null)}>
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Pharmacy</div>
          <div className="ha-section-sub">{filtered.length} prescription{filtered.length!==1?'s':''} shown</div>
        </div>
        <button className="ha-action-btn" onClick={() => setShowRx(true)}>
          <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
          New Prescription
        </button>
      </div>

      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:16, padding:'14px 18px', background:'var(--card)', borderRadius:14, border:'1px solid var(--border)' }}>
        <span style={{ fontSize:12.5, fontWeight:700, color:'var(--text-muted)' }}>Filter:</span>
        <select value={filterDoc} onChange={e => setFilterDoc(e.target.value)} style={selStyle}>{doctors.map(d => <option key={d}>{d}</option>)}</select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selStyle}><option>All</option><option>Pending</option><option>Ready</option><option>Dispensed</option></select>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>From</span>
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
          <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>To</span>
          <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
          {(filterFrom||filterTo) && (<button onClick={() => { setFilterFrom(''); setFilterTo(''); }} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--rose)', fontSize:12.5, fontWeight:700, fontFamily:'inherit' }}>✕ Clear</button>)}
        </div>
        <span style={{ fontSize:12.5, color:'var(--text-muted)', marginLeft:'auto' }}>{filtered.length} of {PRESCRIPTIONS.length} records</span>
      </div>

      <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
        <div className="ha-table-wrap">
          <table className="ha-table">
            <thead><tr>{['Rx ID','Patient','Drug / Dosage','Qty','Prescribed By','Date','Status',''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {filtered.map((rx,i) => {
                const isOpen = openMenu === rx.id;
                return (
                  <tr key={rx.id} className="ha-tr" style={{ borderBottom:i<filtered.length-1?'1px solid var(--border)':'none' }}>
                    <Td><span style={{ fontWeight:600, color:'var(--primary)' }}>{rx.id}</span></Td>
                    <Td style={{ fontWeight:500 }}>{rx.patient}</Td>
                    <Td>{rx.drug}</Td>
                    <Td>{rx.qty}</Td>
                    <Td style={{ color:'var(--text-muted)' }}>{rx.doctor}</Td>
                    <Td style={{ color:'var(--text-muted)' }}>{rx.date}</Td>
                    <Td><Badge label={rx.status} color={statusColor(rx.status)} /></Td>
                    <Td>
                      <div style={{ position:'relative' }}>
                        <button onClick={e => { e.stopPropagation(); setOpenMenu(isOpen?null:rx.id); }} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'4px 10px', fontSize:17, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)', lineHeight:1 }}>⋯</button>
                        {isOpen && (
                          <div onClick={e => e.stopPropagation()} style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'white', border:'1px solid var(--border)', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:50, minWidth:150, overflow:'hidden' }}>
                            <button onClick={() => { setViewRx(rx); setOpenMenu(null); }} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--text)' }}>View Prescription</button>
                            <div style={{ height:1, background:'var(--border)' }} />
                            <button onClick={() => { handleDownloadRx(rx); setOpenMenu(null); }} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--primary)' }}>Download PDF</button>
                          </div>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (<tr><td colSpan={8} style={{ padding:'40px 20px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No prescriptions match the selected filters</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {viewRx && (
      <>
        <div onClick={() => setViewRx(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100 }} />
        <div onClick={e => e.stopPropagation()} style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'white', borderRadius:18, width:560, maxWidth:'94vw', maxHeight:'90vh', overflowY:'auto', zIndex:101, boxShadow:'0 24px 80px rgba(0,0,0,0.2)' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div><div style={{ fontWeight:800, fontSize:17 }}>Prescription Detail</div><div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>{viewRx.id} · {viewRx.date}</div></div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => handleDownloadRx(viewRx)} style={{ display:'flex', alignItems:'center', gap:6, background:'var(--primary)', color:'white', border:'none', borderRadius:8, padding:'7px 14px', fontSize:12.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>⬇ Download PDF</button>
              <button onClick={() => setViewRx(null)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, width:34, height:34, cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>✕</button>
            </div>
          </div>
          <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {([['Patient',viewRx.patient],['Prescribed By',viewRx.doctor],['Drug / Dosage',viewRx.drug],['Quantity',`${viewRx.qty} units`],['Frequency',PRESCRIPTION_DETAILS[viewRx.id]?.frequency??'As directed'],['Duration',PRESCRIPTION_DETAILS[viewRx.id]?.duration??'As directed'],['Date',viewRx.date],['Refills Left',`${viewRx.refills}`],['Status',viewRx.status]] as [string,string][]).map(([k,v]) => (
                <div key={k} style={{ background:'var(--bg)', borderRadius:10, padding:'10px 14px' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{k}</div>
                  <div style={{ fontSize:13.5, fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13.5, marginBottom:8 }}>Instructions</div>
              <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.8, background:'var(--bg)', padding:'12px 16px', borderRadius:10, border:'1px solid var(--border)' }}>{PRESCRIPTION_DETAILS[viewRx.id]?.instructions??'Take as directed by the physician.'}</div>
            </div>
            <div style={{ background:'var(--amber-light)', border:'1px solid var(--amber)', borderRadius:12, padding:'14px 18px' }}>
              <div style={{ fontWeight:700, fontSize:13, color:'var(--amber)', marginBottom:10 }}>Course Progress</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <span style={{ fontSize:13, color:'var(--text-muted)' }}>Tablets / Units Taken</span>
                <span style={{ fontWeight:800, fontSize:18, color:'var(--amber)' }}>{PRESCRIPTION_DETAILS[viewRx.id]?.taken??0} / {viewRx.qty}</span>
              </div>
              <div style={{ background:'rgba(255,255,255,0.6)', borderRadius:6, height:10, overflow:'hidden', marginBottom:8 }}>
                <div style={{ width:`${Math.min(100,((PRESCRIPTION_DETAILS[viewRx.id]?.taken??0)/viewRx.qty)*100)}%`, height:'100%', background:'var(--amber)', borderRadius:6 }} />
              </div>
              <div style={{ fontSize:12.5, color:'var(--amber)', fontWeight:600 }}>{viewRx.qty-(PRESCRIPTION_DETAILS[viewRx.id]?.taken??0)} units remaining</div>
            </div>
          </div>
        </div>
      </>
    )}

    {showRx && (
      <>
        <div onClick={() => setShowRx(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
        <div style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div style={{ fontWeight:800, fontSize:17 }}>Add Prescription</div>
            <button onClick={() => setShowRx(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:12.5, fontFamily:'inherit' }}>✕ Close</button>
          </div>
          <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:14 }}>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Patient *</div><select style={{...inpStyle,cursor:'pointer'}}><option>— Select Patient —</option><option>Sarah Johnson · P-001</option><option>Marcus Williams · P-002</option></select></div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Prescribing Doctor *</div><select style={{...inpStyle,cursor:'pointer'}}><option>— Select Doctor —</option><option>Dr. Amy Chen</option><option>Dr. Raj Patel</option></select></div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Drug Name *</div><input style={inpStyle} placeholder="e.g. Lisinopril 10mg" /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Dosage</div><input style={inpStyle} placeholder="e.g. 10mg" /></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Quantity</div><input style={inpStyle} type="number" placeholder="30" /></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Frequency</div><select style={{...inpStyle,cursor:'pointer'}}><option>Once daily</option><option>Twice daily</option><option>Three times daily</option><option>As needed</option></select></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Duration</div><input style={inpStyle} placeholder="e.g. 30 days" /></div>
            </div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Instructions</div><textarea style={{...inpStyle,resize:'vertical',minHeight:70}} placeholder="Take with food. Monitor BP weekly..." /></div>
          </div>
          <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
            <button className="ha-action-btn" style={{ flex:1, justifyContent:'center' }} onClick={() => setShowRx(false)}>Submit Prescription</button>
            <button onClick={() => setShowRx(false)} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
          </div>
        </div>
      </>
    )}
    </>
  );
};
