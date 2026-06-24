import React, { useState, useMemo } from 'react';
import { Badge, SvgIcon, Th, Td, statusColor, shortDateToISO } from '../shared/HaHelpers';
import { LAB_ORDERS, LAB_RESULT_DETAILS } from '../data/mockHaData';
import type { LabOrder } from '../types/hospitaladmin.types';

export const LabModule: React.FC = () => {
  const [openMenu,      setOpenMenu]      = useState<string | null>(null);
  const [viewLab,       setViewLab]       = useState<LabOrder | null>(null);
  const [showNewOrder,  setShowNewOrder]  = useState(false);
  const [filterFrom,    setFilterFrom]    = useState('');
  const [filterTo,      setFilterTo]      = useState('');
  const [filterDoc,     setFilterDoc]     = useState('All Doctors');
  const [filterStatus,  setFilterStatus]  = useState('All');
  const [filterPriority,setFilterPriority]= useState('All');

  const inpStyle: React.CSSProperties = { width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' };
  const selStyle: React.CSSProperties = { padding:'7px 28px 7px 12px', borderRadius:9, border:'1px solid var(--border)', background:'var(--bg)', fontSize:12.5, fontWeight:500, cursor:'pointer', fontFamily:'inherit', color:'var(--text)', outline:'none', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center' };

  const doctors = ['All Doctors', ...Array.from(new Set(LAB_ORDERS.map(l => l.ordered)))];
  const filtered = useMemo(() =>
    LAB_ORDERS.filter(l => {
      const iso = shortDateToISO(l.date);
      if (filterFrom && iso < filterFrom) return false;
      if (filterTo   && iso > filterTo)   return false;
      if (filterDoc      !== 'All Doctors' && l.ordered  !== filterDoc)      return false;
      if (filterStatus   !== 'All'         && l.status   !== filterStatus)   return false;
      if (filterPriority !== 'All'         && l.priority !== filterPriority) return false;
      return true;
    }), [filterFrom, filterTo, filterDoc, filterStatus, filterPriority]);

  const handleDownloadLab = (l: LabOrder) => {
    const details = LAB_RESULT_DETAILS[l.id] ?? [];
    const resultRows = details.length
      ? details.map(d => `<tr style="background:${d.flag!=='NORMAL'?'#fff8f8':'transparent'}"><td>${d.parameter}</td><td style="font-weight:700;color:${d.flag==='CRITICAL'?'#e11d48':d.flag==='LOW'||d.flag==='HIGH'?'#d97706':'#16a34a'}">${d.value}</td><td>${d.unit}</td><td>${d.reference}</td><td style="font-weight:700;color:${d.flag==='CRITICAL'?'#e11d48':d.flag==='LOW'||d.flag==='HIGH'?'#d97706':'#16a34a'}">${d.flag}</td></tr>`).join('')
      : '<tr><td colspan="5" style="color:#94a3b8">Results pending — not yet available</td></tr>';
    const html = `<!DOCTYPE html><html><head><title>Lab Report ${l.id} — Vexoo</title><style>body{font-family:Arial,sans-serif;padding:28px;color:#1a2540;}h1{font-size:20px;margin-bottom:4px;}.subtitle{font-size:13px;color:#64748b;margin-bottom:20px;}h2{font-size:13px;color:#0d9488;border-bottom:2px solid #e6faf8;padding-bottom:5px;margin-top:20px;margin-bottom:10px;}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}.item{background:#f4f8f7;border-radius:8px;padding:10px 12px;}.lbl{font-size:10px;color:#64748b;text-transform:uppercase;margin-bottom:3px;}.val{font-size:13px;font-weight:600;}table{width:100%;border-collapse:collapse;font-size:12px;margin-top:8px;}th{background:#f4f8f7;padding:7px 10px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;}td{padding:8px 10px;border-bottom:1px solid #f0f0f0;}.footer{margin-top:32px;color:#94a3b8;font-size:11px;border-top:1px solid #f0f0f0;padding-top:10px;}</style></head><body>
    <h1>Lab Report — ${l.id}</h1><div class="subtitle">Vexoo · Generated on ${new Date().toLocaleDateString('en-IN')}</div>
    <h2>Order Details</h2>
    <div class="grid"><div class="item"><div class="lbl">Patient</div><div class="val">${l.patient}</div></div><div class="item"><div class="lbl">Test</div><div class="val">${l.test}</div></div><div class="item"><div class="lbl">Ordered By</div><div class="val">${l.ordered}</div></div><div class="item"><div class="lbl">Date</div><div class="val">${l.date}</div></div><div class="item"><div class="lbl">Priority</div><div class="val">${l.priority}</div></div><div class="item"><div class="lbl">Status</div><div class="val">${l.status}</div></div></div>
    <h2>Test Results</h2><table><thead><tr><th>Parameter</th><th>Value</th><th>Unit</th><th>Reference</th><th>Flag</th></tr></thead><tbody>${resultRows}</tbody></table>
    ${l.result?`<h2>Summary</h2><p style="font-size:13px;line-height:1.7;">${l.result}</p>`:''}
    <div class="footer">Vexoo · Confidential — For clinical use only</div></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <>
    <div className="ha-content ha-fade" onClick={() => setOpenMenu(null)}>
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Lab & Diagnostics</div>
          <div className="ha-section-sub">{filtered.length} order{filtered.length!==1?'s':''} shown</div>
        </div>
        <button className="ha-action-btn" onClick={() => setShowNewOrder(true)}>
          <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
          New Test Order
        </button>
      </div>

      <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:16, padding:'14px 18px', background:'var(--card)', borderRadius:14, border:'1px solid var(--border)' }}>
        <span style={{ fontSize:12.5, fontWeight:700, color:'var(--text-muted)' }}>Filter:</span>
        <select value={filterDoc}      onChange={e => setFilterDoc(e.target.value)}      style={selStyle}>{doctors.map(d => <option key={d}>{d}</option>)}</select>
        <select value={filterStatus}   onChange={e => setFilterStatus(e.target.value)}   style={selStyle}><option>All</option><option>In Progress</option><option>Pending</option><option>Complete</option><option>Critical</option></select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={selStyle}><option>All</option><option>Routine</option><option>Urgent</option><option>STAT</option></select>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>From</span>
          <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
          <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>To</span>
          <input type="date" value={filterTo}   onChange={e => setFilterTo(e.target.value)}   style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
          {(filterFrom||filterTo) && (<button onClick={() => { setFilterFrom(''); setFilterTo(''); }} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--rose)', fontSize:12.5, fontWeight:700, fontFamily:'inherit' }}>✕ Clear</button>)}
        </div>
        <span style={{ fontSize:12.5, color:'var(--text-muted)', marginLeft:'auto' }}>{filtered.length} of {LAB_ORDERS.length} records</span>
      </div>

      <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
        <div className="ha-table-wrap">
          <table className="ha-table">
            <thead><tr>{['Lab ID','Patient','Test','Ordered By','Date','Priority','Status','Result',''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {filtered.map((l,i) => {
                const isOpen = openMenu === l.id;
                return (
                  <tr key={l.id} className="ha-tr" style={{ borderBottom:i<filtered.length-1?'1px solid var(--border)':'none', background:l.priority==='STAT'?'#fff8f8':undefined }}>
                    <Td><span style={{ fontWeight:600, color:'var(--primary)' }}>{l.id}</span></Td>
                    <Td style={{ fontWeight:500 }}>{l.patient}</Td>
                    <Td>{l.test}</Td>
                    <Td style={{ color:'var(--text-muted)' }}>{l.ordered}</Td>
                    <Td style={{ color:'var(--text-muted)' }}>{l.date}</Td>
                    <Td><Badge label={l.priority} color={l.priority==='STAT'?'rose':l.priority==='Urgent'?'amber':'gray'} /></Td>
                    <Td><Badge label={l.status} color={statusColor(l.status)} /></Td>
                    <Td style={{ fontSize:12.5, color:'var(--text-muted)', maxWidth:180 }}>{l.result||'—'}</Td>
                    <Td>
                      <div style={{ position:'relative' }}>
                        <button onClick={e => { e.stopPropagation(); setOpenMenu(isOpen?null:l.id); }} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'4px 10px', fontSize:17, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)', lineHeight:1 }}>⋯</button>
                        {isOpen && (
                          <div onClick={e => e.stopPropagation()} style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'white', border:'1px solid var(--border)', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:50, minWidth:150, overflow:'hidden' }}>
                            <button onClick={() => { setViewLab(l); setOpenMenu(null); }} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--text)' }}>View Report</button>
                            <div style={{ height:1, background:'var(--border)' }} />
                            <button onClick={() => { handleDownloadLab(l); setOpenMenu(null); }} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--primary)' }}>Download PDF</button>
                          </div>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}
              {filtered.length===0 && (<tr><td colSpan={9} style={{ padding:'40px 20px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No lab orders match the selected filters</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {viewLab && (
      <>
        <div onClick={() => setViewLab(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100 }} />
        <div onClick={e => e.stopPropagation()} style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'white', borderRadius:18, width:620, maxWidth:'94vw', maxHeight:'90vh', overflowY:'auto', zIndex:101, boxShadow:'0 24px 80px rgba(0,0,0,0.2)' }}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div><div style={{ fontWeight:800, fontSize:17 }}>Lab Report Detail</div><div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>{viewLab.id} · {viewLab.date}</div></div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => handleDownloadLab(viewLab)} style={{ display:'flex', alignItems:'center', gap:6, background:'var(--primary)', color:'white', border:'none', borderRadius:8, padding:'7px 14px', fontSize:12.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>⬇ Download PDF</button>
              <button onClick={() => setViewLab(null)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, width:34, height:34, cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>✕</button>
            </div>
          </div>
          <div style={{ padding:'22px 24px', display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {([['Patient',viewLab.patient],['Test',viewLab.test],['Ordered By',viewLab.ordered],['Date',viewLab.date],['Priority',viewLab.priority],['Status',viewLab.status]] as [string,string][]).map(([k,v]) => (
                <div key={k} style={{ background:'var(--bg)', borderRadius:10, padding:'10px 14px' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{k}</div>
                  <div style={{ fontSize:13.5, fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
            {(LAB_RESULT_DETAILS[viewLab.id]??[]).length > 0 ? (
              <div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Test Results</div>
                <table className="ha-table">
                  <thead><tr>{['Parameter','Value','Unit','Reference Range','Flag'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
                  <tbody>
                    {(LAB_RESULT_DETAILS[viewLab.id]??[]).map((d,i) => (
                      <tr key={i} style={{ background:d.flag!=='NORMAL'?'#fff8f8':'transparent', borderBottom:'1px solid var(--border)' }}>
                        <Td style={{ fontWeight:500 }}>{d.parameter}</Td>
                        <Td><span style={{ fontWeight:800, color:d.flag==='CRITICAL'?'var(--rose)':d.flag==='LOW'||d.flag==='HIGH'?'var(--amber)':'var(--green)' }}>{d.value}</span></Td>
                        <Td style={{ color:'var(--text-muted)' }}>{d.unit}</Td>
                        <Td style={{ color:'var(--text-muted)' }}>{d.reference}</Td>
                        <Td><Badge label={d.flag} color={d.flag==='CRITICAL'?'rose':d.flag==='LOW'||d.flag==='HIGH'?'amber':'green'} /></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ background:'var(--amber-light)', border:'1px solid var(--amber)', borderRadius:12, padding:'14px 18px', textAlign:'center', color:'var(--amber)', fontWeight:600 }}>⏳ Results pending — not yet available</div>
            )}
            {viewLab.result && (
              <div>
                <div style={{ fontWeight:700, fontSize:13.5, marginBottom:8 }}>Summary</div>
                <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.8, background:'var(--bg)', padding:'12px 16px', borderRadius:10, border:'1px solid var(--border)' }}>{viewLab.result}</div>
              </div>
            )}
          </div>
        </div>
      </>
    )}

    {showNewOrder && (
      <>
        <div onClick={() => setShowNewOrder(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
        <div style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div style={{ fontWeight:800, fontSize:17 }}>New Test Order</div>
            <button onClick={() => setShowNewOrder(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:12.5, fontFamily:'inherit' }}>✕ Close</button>
          </div>
          <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:14 }}>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Patient *</div><select style={{...inpStyle,cursor:'pointer'}}><option>— Select Patient —</option><option>Sarah Johnson · P-001</option><option>Marcus Williams · P-002</option></select></div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Ordering Doctor *</div><select style={{...inpStyle,cursor:'pointer'}}><option>— Select Doctor —</option><option>Dr. Amy Chen</option><option>Dr. Raj Patel</option><option>Dr. Yeon Kim</option></select></div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Test / Panel *</div><input style={inpStyle} placeholder="e.g. CBC + Metabolic Panel" /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Priority</div><select style={{...inpStyle,cursor:'pointer'}}><option>Routine</option><option>Urgent</option><option>STAT</option></select></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Date</div><input style={inpStyle} type="date" defaultValue="2026-04-26" /></div>
            </div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>Clinical Notes</div><textarea style={{...inpStyle,resize:'vertical',minHeight:80}} placeholder="Clinical indication for ordering this test..." /></div>
          </div>
          <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
            <button className="ha-action-btn" style={{ flex:1, justifyContent:'center' }} onClick={() => setShowNewOrder(false)}>Submit Order</button>
            <button onClick={() => setShowNewOrder(false)} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
          </div>
        </div>
      </>
    )}
    </>
  );
};
