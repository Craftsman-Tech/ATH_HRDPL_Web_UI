import React, { useState, useMemo, useEffect } from 'react';
import { Badge, SvgIcon, statusColor } from '../shared/HaHelpers';
import { APPOINTMENTS } from '../data/mockHaData';

const APPT_PAGE_SIZE = 10;
const APPT_BASE_MONDAY = new Date('2026-04-20T00:00:00');
const TODAY_ISO = '2026-04-26';

function apptAddDays(d: Date, n: number): Date { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function apptIso(d: Date): string { return d.toISOString().split('T')[0]; }
function apptFmtDate(d: Date): string { return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }); }

function ApptPagination({ page, total, onChange }: { page:number; total:number; onChange:(p:number)=>void }) {
  const totalPages = Math.ceil(total / APPT_PAGE_SIZE);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', borderTop:'1px solid var(--border)', background:'var(--bg)', borderRadius:'0 0 16px 16px' }}>
      <span style={{ fontSize:13, color:'var(--text-muted)' }}>Showing {(page-1)*APPT_PAGE_SIZE+1}–{Math.min(page*APPT_PAGE_SIZE,total)} of {total} appointments</span>
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        <button onClick={() => onChange(page-1)} disabled={page===1} style={{ padding:'5px 14px', borderRadius:8, border:'1px solid var(--border)', background:page===1?'var(--bg)':'white', cursor:page===1?'default':'pointer', fontSize:13, fontFamily:'inherit', color:page===1?'var(--text-muted)':'var(--text)', opacity:page===1?0.5:1 }}>← Prev</button>
        {pages.map(p => (<button key={p} onClick={() => onChange(p)} style={{ width:34, height:34, borderRadius:8, border:'none', background:p===page?'var(--primary)':'transparent', cursor:'pointer', fontSize:13, fontFamily:'inherit', fontWeight:p===page?700:400, color:p===page?'white':'var(--text)' }}>{p}</button>))}
        <button onClick={() => onChange(page+1)} disabled={page===totalPages} style={{ padding:'5px 14px', borderRadius:8, border:'1px solid var(--border)', background:page===totalPages?'var(--bg)':'white', cursor:page===totalPages?'default':'pointer', fontSize:13, fontFamily:'inherit', color:page===totalPages?'var(--text-muted)':'var(--text)', opacity:page===totalPages?0.5:1 }}>Next →</button>
      </div>
    </div>
  );
}

export const AppointmentsModule: React.FC = () => {
  const [mainTab, setMainTab]       = useState<'schedule'|'history'>('schedule');
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeDay, setActiveDay]   = useState(6);
  const [schedPage, setSchedPage]   = useState(1);
  const [histStatus, setHistStatus] = useState<'All'|'Completed'|'No-Show'>('All');
  const [histDoctor, setHistDoctor] = useState('All Doctors');
  const [histDateFrom, setHistDateFrom] = useState('');
  const [histDateTo,   setHistDateTo]   = useState('');
  const [histPage, setHistPage]     = useState(1);
  const [showFlyout, setShowFlyout] = useState(false);

  const weekStart = apptAddDays(APPT_BASE_MONDAY, weekOffset * 7);
  const weekDays  = Array.from({ length: 7 }, (_, i) => apptAddDays(weekStart, i));
  const DAY_LABELS= ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const selectedISO = apptIso(weekDays[activeDay]);
  const isToday = selectedISO === TODAY_ISO;
  const isPast  = selectedISO < TODAY_ISO;

  const dayAppts   = useMemo(() => APPOINTMENTS.filter(a => a.isoDate === selectedISO), [selectedISO]);
  const schedSlice = dayAppts.slice((schedPage-1)*APPT_PAGE_SIZE, schedPage*APPT_PAGE_SIZE);
  const dayCounts  = useMemo(() => weekDays.map(d => APPOINTMENTS.filter(a => a.isoDate === apptIso(d)).length), [weekOffset]);

  const histAppts = useMemo(() =>
    APPOINTMENTS.filter(a => {
      if (a.status !== 'Completed' && a.status !== 'No-Show') return false;
      if (histStatus !== 'All'         && a.status  !== histStatus)  return false;
      if (histDoctor !== 'All Doctors' && a.doctor  !== histDoctor)  return false;
      if (histDateFrom && a.isoDate < histDateFrom) return false;
      if (histDateTo   && a.isoDate > histDateTo)   return false;
      return true;
    }).sort((a, b) => b.isoDate.localeCompare(a.isoDate))
  , [histStatus, histDoctor, histDateFrom, histDateTo]);
  const histSlice   = histAppts.slice((histPage-1)*APPT_PAGE_SIZE, histPage*APPT_PAGE_SIZE);
  const histDoctors = ['All Doctors', ...Array.from(new Set(APPOINTMENTS.map(a => a.doctor)))];

  useEffect(() => { setHistPage(1); }, [histStatus, histDoctor, histDateFrom, histDateTo]);
  useEffect(() => { setSchedPage(1); }, [selectedISO]);

  const summaryCounts = useMemo(() => ({
    total:      dayAppts.length,
    confirmed:  dayAppts.filter(a => a.status==='Confirmed').length,
    inProgress: dayAppts.filter(a => a.status==='In Progress').length,
    pending:    dayAppts.filter(a => a.status==='Pending').length,
    waiting:    dayAppts.filter(a => a.status==='Waiting').length,
    completed:  dayAppts.filter(a => a.status==='Completed').length,
  }), [dayAppts]);

  const handleExport = () => {
    const rows = histAppts.map(a => `<tr><td>${a.id}</td><td>${a.patient}</td><td>${a.doctor}</td><td>${a.type}</td><td>${a.date}</td><td>${a.time}</td><td>${a.room}</td><td>${a.status}</td></tr>`).join('');
    const html = `<!DOCTYPE html><html><head><title>Appointment History — Vexoo</title><style>body{font-family:Arial,sans-serif;padding:28px;color:#1a2540;}h1{font-size:20px;}table{width:100%;border-collapse:collapse;font-size:12px;margin-top:16px;}th{background:#f4f8f7;padding:7px 10px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;border-bottom:2px solid #e4e8f0;}td{padding:8px 10px;border-bottom:1px solid #f0f0f0;}.footer{margin-top:32px;color:#94a3b8;font-size:11px;border-top:1px solid #f0f0f0;padding-top:10px;}</style></head><body><h1>Appointment History Export — Vexoo</h1><table><thead><tr><th>Appt ID</th><th>Patient</th><th>Doctor</th><th>Type</th><th>Date</th><th>Time</th><th>Room</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table><div class="footer">Exported from Vexoo · ${new Date().toLocaleDateString('en-IN')} · Confidential</div></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  const inpStyle: React.CSSProperties = { width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' };
  const selStyle: React.CSSProperties = { padding:'7px 28px 7px 12px', borderRadius:9, border:'1px solid var(--border)', background:'var(--bg)', fontSize:12.5, fontWeight:500, cursor:'pointer', fontFamily:'inherit', color:'var(--text)', outline:'none', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center' };

  return (
    <>
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div>
          <div className="ha-section-title">Appointments</div>
          <div className="ha-section-sub">{mainTab==='schedule'?`${apptFmtDate(weekDays[activeDay])}${isToday?' — Today':''}`:'Past appointments — Completed & No-Show'}</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ display:'flex', background:'var(--bg)', borderRadius:9, padding:3, border:'1px solid var(--border)', gap:2 }}>
            {(['schedule','history'] as const).map(t => (
              <button key={t} onClick={() => setMainTab(t)} style={{ padding:'6px 16px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:mainTab===t?700:400, background:mainTab===t?'white':'transparent', color:mainTab===t?'var(--text)':'var(--text-muted)', boxShadow:mainTab===t?'0 1px 4px rgba(0,0,0,0.1)':'none' }}>
                {t==='schedule'?'Schedule':'Appointment History'}
              </button>
            ))}
          </div>
          {mainTab === 'schedule' && (
            <button className="ha-action-btn" onClick={() => setShowFlyout(true)}>
              <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
              New Appointment
            </button>
          )}
          {mainTab === 'history' && (
            <button onClick={handleExport} style={{ display:'flex', alignItems:'center', gap:7, background:'var(--card)', color:'var(--text-muted)', border:'1px solid var(--border)', borderRadius:9, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={14} color="currentColor" />
              Export
            </button>
          )}
        </div>
      </div>

      {mainTab === 'schedule' && (
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="ha-card" style={{ padding:'16px 20px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <button onClick={() => { setWeekOffset(o => o-1); setActiveDay(0); setSchedPage(1); }} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:13, fontFamily:'inherit', color:'var(--text-muted)' }}>← Prev Week</button>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:13.5, fontWeight:700 }}>{apptFmtDate(weekStart)} — {apptFmtDate(weekDays[6])}</div>
                  {weekOffset !== 0 && (<button onClick={() => { setWeekOffset(0); setActiveDay(6); setSchedPage(1); }} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'var(--primary)', fontFamily:'inherit', fontWeight:600, marginTop:2 }}>Back to Today</button>)}
                </div>
                <button onClick={() => { setWeekOffset(o => o+1); setActiveDay(0); setSchedPage(1); }} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:13, fontFamily:'inherit', color:'var(--text-muted)' }}>Next Week →</button>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {weekDays.map((d, i) => {
                  const iso = apptIso(d); const cnt = dayCounts[i];
                  const isTd = iso === TODAY_ISO; const sel = i === activeDay;
                  return (
                    <div key={i} onClick={() => { setActiveDay(i); setSchedPage(1); }} style={{ flex:1, textAlign:'center', padding:'10px 4px', borderRadius:12, background:sel?'var(--primary)':isTd?'var(--primary-light)':'transparent', cursor:'pointer', border:isTd&&!sel?'1.5px solid var(--primary)':'1.5px solid transparent', position:'relative' }}>
                      <div style={{ fontSize:11, color:sel?'rgba(255,255,255,0.75)':isTd?'var(--primary)':'var(--text-muted)', fontWeight:500, marginBottom:3 }}>{DAY_LABELS[i]}</div>
                      <div style={{ fontWeight:700, fontSize:14, color:sel?'white':isTd?'var(--primary)':'var(--text)' }}>{d.toLocaleDateString('en-IN',{month:'short',day:'numeric'})}</div>
                      <div style={{ marginTop:5, fontSize:10, color:sel?'rgba(255,255,255,0.75)':cnt>0?'var(--primary)':'var(--text-muted)', fontWeight:cnt>0?700:400 }}>{cnt>0?`${cnt} appts`:'None'}</div>
                      {isTd&&!sel&&<div style={{ width:5, height:5, borderRadius:'50%', background:'var(--primary)', position:'absolute', bottom:6, left:'50%', transform:'translateX(-50%)' }} />}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ padding:'14px 20px 12px', fontWeight:700, fontSize:15, borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span>{apptFmtDate(weekDays[activeDay])}{isToday&&<span style={{ marginLeft:8, fontSize:11, fontWeight:700, padding:'2px 9px', borderRadius:20, background:'var(--primary)', color:'white' }}>TODAY</span>}{isPast&&<span style={{ marginLeft:8, fontSize:11, fontWeight:700, padding:'2px 9px', borderRadius:20, background:'var(--amber-light)', color:'var(--amber)' }}>PAST DATE</span>}</span>
                <span style={{ fontSize:12.5, fontWeight:400, color:'var(--text-muted)' }}>{dayAppts.length} appointments</span>
              </div>
              {dayAppts.length === 0
                ? <div style={{ padding:'48px 20px', textAlign:'center', color:'var(--text-muted)' }}><div style={{ fontSize:36, marginBottom:10 }}>📅</div><div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>No appointments</div></div>
                : (<>
                  {schedSlice.map((a,i) => (
                    <div key={a.id} style={{ display:'flex', alignItems:'center', gap:16, padding:'13px 20px', borderBottom:i<schedSlice.length-1?'1px solid var(--border)':'none', cursor:'pointer' }}>
                      <div style={{ width:52, textAlign:'center', flexShrink:0 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:'var(--primary)' }}>{a.time.split(' ')[0]}</div>
                        <div style={{ fontSize:10.5, color:'var(--text-muted)' }}>{a.time.split(' ')[1]}</div>
                      </div>
                      <div style={{ width:1, height:36, background:'var(--border)', flexShrink:0 }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:600, fontSize:13.5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.patient}</div>
                        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.doctor} · {a.type} · {a.room}</div>
                      </div>
                      <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
                        <span style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'monospace' }}>{a.id}</span>
                        <Badge label={a.status} color={statusColor(a.status)} />
                      </div>
                    </div>
                  ))}
                  <ApptPagination page={schedPage} total={dayAppts.length} onChange={setSchedPage} />
                </>)}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="ha-card">
              <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>{isToday?"Today's":isPast?'Day':"Day's"} Summary</div>
              {([['Total',String(summaryCounts.total),'var(--primary-light)','var(--primary)'],['Confirmed',String(summaryCounts.confirmed),'var(--blue-light)','var(--blue)'],['In Progress',String(summaryCounts.inProgress),'var(--amber-light)','var(--amber)'],['Waiting',String(summaryCounts.waiting),'var(--purple-light)','var(--purple)'],['Pending',String(summaryCounts.pending),'var(--rose-light)','var(--rose)'],['Completed',String(summaryCounts.completed),'var(--green-light)','var(--green)']] as [string,string,string,string][]).map(([l,v,bg,c]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 12px', background:bg, borderRadius:10, marginBottom:8 }}>
                  <span style={{ fontSize:13, color:c, fontWeight:500 }}>{l}</span>
                  <span style={{ fontWeight:700, fontSize:17, color:c }}>{v}</span>
                </div>
              ))}
            </div>
            {isPast && dayAppts.some(a => a.status==='No-Show') && (
              <div className="ha-card" style={{ background:'var(--rose-light)', border:'1px solid var(--rose)' }}>
                <div style={{ fontWeight:700, fontSize:13, color:'var(--rose)', marginBottom:6 }}>⚠ No-Shows on this date</div>
                <div style={{ fontSize:12.5, color:'var(--rose)' }}>{dayAppts.filter(a => a.status==='No-Show').length} patient(s) did not attend.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {mainTab === 'history' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:16 }}>
            {([['Total History Records',String(APPOINTMENTS.filter(a=>a.status==='Completed'||a.status==='No-Show').length),'var(--text)','var(--bg)'],['Completed',String(APPOINTMENTS.filter(a=>a.status==='Completed').length),'var(--green)','var(--green-light)'],['No-Show',String(APPOINTMENTS.filter(a=>a.status==='No-Show').length),'var(--rose)','var(--rose-light)']] as [string,string,string,string][]).map(([l,v,c,bg]) => (
              <div key={l} className="ha-card" style={{ background:bg, border:'none', textAlign:'center', padding:'14px 16px' }}>
                <div style={{ fontSize:11, color:c, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="ha-card" style={{ marginBottom:16, padding:'14px 20px' }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ display:'flex', background:'var(--bg)', borderRadius:9, padding:3, border:'1px solid var(--border)', gap:2 }}>
                {(['All','Completed','No-Show'] as const).map(s => (
                  <button key={s} onClick={() => { setHistStatus(s); setHistPage(1); }} style={{ padding:'5px 14px', borderRadius:7, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:12.5, fontWeight:histStatus===s?700:400, background:histStatus===s?'white':'transparent', color:histStatus===s?'var(--text)':'var(--text-muted)', boxShadow:histStatus===s?'0 1px 4px rgba(0,0,0,0.1)':'none' }}>
                    {s}{s !== 'All' && (<span style={{ marginLeft:6, fontSize:10, fontWeight:800, padding:'1px 6px', borderRadius:20, background:histStatus===s?(s==='Completed'?'var(--green)':'var(--rose)'):'var(--border)', color:histStatus===s?'white':'var(--text-muted)' }}>{APPOINTMENTS.filter(a=>a.status===s).length}</span>)}
                  </button>
                ))}
              </div>
              <select value={histDoctor} onChange={e => { setHistDoctor(e.target.value); setHistPage(1); }} style={selStyle}>{histDoctors.map(d => <option key={d}>{d}</option>)}</select>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>From</span>
                <input type="date" value={histDateFrom} onChange={e => { setHistDateFrom(e.target.value); setHistPage(1); }} style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
                <span style={{ fontSize:12.5, color:'var(--text-muted)', fontWeight:600 }}>To</span>
                <input type="date" value={histDateTo} onChange={e => { setHistDateTo(e.target.value); setHistPage(1); }} style={{ padding:'6px 10px', borderRadius:9, border:'1px solid var(--border)', fontSize:12.5, outline:'none', fontFamily:'inherit', background:'var(--bg)' }} />
                {(histDateFrom||histDateTo) && (<button onClick={() => { setHistDateFrom(''); setHistDateTo(''); }} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--rose)', fontSize:12.5, fontWeight:700, fontFamily:'inherit' }}>✕ Clear</button>)}
              </div>
              <span style={{ fontSize:12.5, color:'var(--text-muted)', marginLeft:'auto' }}>{histAppts.length} record{histAppts.length!==1?'s':''}</span>
            </div>
          </div>
          <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px 12px', fontWeight:700, fontSize:15, borderBottom:'1px solid var(--border)' }}>Appointment History</div>
            {histAppts.length === 0
              ? <div style={{ padding:'48px 20px', textAlign:'center', color:'var(--text-muted)' }}><div style={{ fontSize:36, marginBottom:10 }}>🗂</div><div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>No records found</div></div>
              : (<>
                <div style={{ display:'grid', gridTemplateColumns:'90px 1fr 130px 120px 90px 90px 100px', gap:0, padding:'8px 20px', background:'var(--bg)', borderBottom:'1px solid var(--border)' }}>
                  {['Appt ID','Patient / Doctor','Visit Type','Date','Time','Room','Status'].map(h => (<div key={h} style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</div>))}
                </div>
                {histSlice.map((a,i) => (
                  <div key={a.id} style={{ display:'grid', gridTemplateColumns:'90px 1fr 130px 120px 90px 90px 100px', gap:0, padding:'12px 20px', borderBottom:i<histSlice.length-1?'1px solid var(--border)':'none', alignItems:'center' }}>
                    <div style={{ fontSize:12, fontFamily:'monospace', color:'var(--text-muted)', fontWeight:500 }}>{a.id}</div>
                    <div><div style={{ fontWeight:600, fontSize:13.5 }}>{a.patient}</div><div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.doctor}</div></div>
                    <div style={{ fontSize:13 }}>{a.type}</div>
                    <div style={{ fontSize:13, fontWeight:500 }}>{a.date}</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)' }}>{a.time}</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)' }}>{a.room}</div>
                    <div><Badge label={a.status} color={a.status==='Completed'?'green':a.status==='No-Show'?'rose':'gray'} /></div>
                  </div>
                ))}
                <ApptPagination page={histPage} total={histAppts.length} onChange={setHistPage} />
              </>)}
          </div>
        </div>
      )}
    </div>

    {showFlyout && (
      <>
        <div onClick={() => setShowFlyout(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
        <div style={{ position:'fixed', right:0, top:0, bottom:0, width:460, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div><div style={{ fontWeight:800, fontSize:18 }}>New Appointment</div><div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>Fill in the details to schedule</div></div>
            <button onClick={() => setShowFlyout(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 13px', cursor:'pointer', fontSize:13, fontFamily:'inherit', color:'var(--text-muted)' }}>✕ Close</button>
          </div>
          <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:18 }}>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Patient Name *</div><input style={inpStyle} placeholder="Search or enter patient name..." /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Date *</div><input style={inpStyle} type="date" defaultValue="2026-04-26" /></div>
              <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Time *</div><input style={inpStyle} type="time" defaultValue="09:00" /></div>
            </div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Doctor *</div>
              <select style={{ ...inpStyle, cursor:'pointer' }}><option value="">— Select Doctor —</option><option>Dr. Amy Chen · Cardiologist</option><option>Dr. Raj Patel · Endocrinologist</option><option>Dr. Yeon Kim · General Physician</option></select>
            </div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Visit Type</div>
              <select style={{ ...inpStyle, cursor:'pointer' }}><option>Consultation</option><option>Follow-Up</option><option>Check-Up</option><option>Procedure</option><option>Lab Review</option><option>Emergency</option></select>
            </div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Duration</div>
              <select style={{ ...inpStyle, cursor:'pointer' }}><option>15 minutes</option><option>20 minutes</option><option>30 minutes</option><option>45 minutes</option><option>60 minutes</option></select>
            </div>
            <div><div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:6 }}>Notes (optional)</div><textarea style={{ ...inpStyle, resize:'vertical', minHeight:80 }} placeholder="Any special instructions or reason for visit..." /></div>
          </div>
          <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
            <button className="ha-action-btn" style={{ flex:1, justifyContent:'center' }} onClick={() => setShowFlyout(false)}>
              <SvgIcon path="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" size={15} color="white" />
              Schedule Appointment
            </button>
            <button onClick={() => setShowFlyout(false)} style={{ padding:'10px 20px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, color:'var(--text-muted)' }}>Cancel</button>
          </div>
        </div>
      </>
    )}
    </>
  );
};
