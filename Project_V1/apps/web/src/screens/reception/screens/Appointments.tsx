import React, { useState, useEffect } from 'react';
import type { AppState, Appointment, QueueEntry } from '../types/reception.types';
import { DOCTORS } from '../data/mockReceptionData';

function nowTime() { return new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}); }

function statusClass(s: string) {
  if (s==='Scheduled')     return 'rc-chip pending';
  if (s==='Confirmed')     return 'rc-chip confirmed';
  if (s==='In Queue')      return 'rc-chip blue';
  if (s==='With Doctor')   return 'rc-chip withdoc';
  if (s==='Post-Consult')  return 'rc-chip purple';
  if (s==='Bill Pending')  return 'rc-chip orange';
  if (s==='Paid')          return 'rc-chip green';
  if (s==='Visit Complete')return 'rc-chip gray';
  if (s==='No-Show')       return 'rc-chip noshow';
  if (s==='Cancelled')     return 'rc-chip cancelled';
  return 'rc-chip gray';
}
function priorityClass(p: string) {
  if (p==='Emergency') return 'rc-chip rose';
  if (p==='Urgent')    return 'rc-chip amber';
  return 'rc-chip blue';
}

interface QuickAppt {
  id: string; name: string; phone: string;
  timeSlot: string; doctor: string; createdAt: number;
}

const PAGE_SIZE = 10;

// Simple Pagination component
const Pagination: React.FC<{
  total: number; page: number; onPage: (p: number) => void;
}> = ({ total, page, onPage }) => {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return null;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'flex-end', padding:'12px 22px', borderTop:'1px solid var(--line)' }}>
      <button className="rc-btn-outline" style={{ fontSize:12, padding:'4px 10px' }}
        disabled={page===1} onClick={()=>onPage(page-1)}>← Prev</button>
      {Array.from({length:pages},(_,i)=>i+1).map(n=>(
        <button key={n} onClick={()=>onPage(n)} style={{
          width:30, height:30, borderRadius:8, fontWeight:600, fontSize:12.5, cursor:'pointer', fontFamily:'inherit',
          border: n===page?'1.5px solid var(--primary)':'1.5px solid var(--border)',
          background: n===page?'var(--primary)':'var(--surface)',
          color: n===page?'white':'var(--text2)',
        }}>{n}</button>
      ))}
      <button className="rc-btn-outline" style={{ fontSize:12, padding:'4px 10px' }}
        disabled={page===pages} onClick={()=>onPage(page+1)}>Next →</button>
    </div>
  );
};

export const Appointments: React.FC<AppState> = ({
  appointments, setAppointments, queue, setQueue, patients, onNav,
  setPrefillName, setPrefillPhone,
}) => {
  type TabId = 'list' | 'scheduled' | 'nonreg';
  const [tab, setTab]        = useState<TabId>('list');
  const [doctorF, setDoctor] = useState('All Doctors');
  const [statusF, setStatus] = useState('All Status');
  const [search,  setSearch] = useState('');
  const [listPage, setListPage] = useState(1);

  const [showModal,      setModal]      = useState(false);
  const [showQuickModal, setQuickModal] = useState(false);
  const [confirmId,      setConfirmId]  = useState<string|null>(null);

  // Full appointment form
  const [nPatientId,    setNPatientId]    = useState('');
  const [nPatientName,  setNPatientName]  = useState('');
  const [nPhone,        setNPhone]        = useState('');
  const [nAadhar,       setNAadhar]       = useState('');
  const [nDoctor,       setNDoctor]       = useState(DOCTORS[0]);
  const [nVisitType,    setNVisitType]    = useState<Appointment['visitType']>('Walk-In');
  const [nPriority,     setNPriority]     = useState<Appointment['priority']>('Normal');
  const [nComplaint,    setNComplaint]    = useState('');
  const [patSearch,     setPatSearch]     = useState('');
  const [patResults,    setPatResults]    = useState<typeof patients>([]);

  // Quick appointment
  const [qName,    setQName]    = useState('');
  const [qPhone,   setQPhone]   = useState('');
  const [qSlot,    setQSlot]    = useState('');
  const [qDoctor,  setQDoctor]  = useState(DOCTORS[0]);
  const [quickAppts, setQuickAppts] = useState<QuickAppt[]>([]);
  const [nonRegSearch, setNonRegSearch] = useState('');
  const [nonRegPage,   setNonRegPage]   = useState(1);

  // Auto No-Show after 2 hrs
  useEffect(() => {
    const id = setInterval(() => {
      setAppointments(prev => prev.map(a =>
        a.status==='Scheduled' && Date.now()-a.createdAt >= 2*3600000
          ? {...a, status:'No-Show' as Appointment['status']} : a
      ));
    }, 30000);
    return () => clearInterval(id);
  }, [setAppointments]);

  // Filtered list
  const filtered = appointments.filter(a => {
    const mD  = doctorF==='All Doctors' || a.doctor===doctorF;
    const mS  = statusF==='All Status'  || a.status===statusF;
    const mSr = !search || a.patientName.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search);
    return mD && mS && mSr;
  });
  const listPageData = filtered.slice((listPage-1)*PAGE_SIZE, listPage*PAGE_SIZE);

  const scheduled = appointments.filter(a => a.status==='Scheduled');

  // Non-reg search + pagination
  const nonRegFiltered = quickAppts.filter(qa =>
    !nonRegSearch ||
    qa.name.toLowerCase().includes(nonRegSearch.toLowerCase()) ||
    qa.phone.includes(nonRegSearch)
  );
  const nonRegPageData = nonRegFiltered.slice((nonRegPage-1)*PAGE_SIZE, nonRegPage*PAGE_SIZE);

  const searchPatients = () => {
    const q = patSearch.trim().toLowerCase();
    if (!q) { setPatResults([]); return; }
    setPatResults(patients.filter(p =>
      p.name.toLowerCase().includes(q) || p.mobile.includes(q) ||
      (p.aadhar||'').replace(/\s/g,'').includes(q.replace(/\s/g,''))
    ));
  };
  const selectPatient = (p: typeof patients[0]) => {
    setNPatientId(p.id); setNPatientName(p.name); setNPhone(p.mobile); setNAadhar(p.aadhar||'');
    setPatSearch(p.name); setPatResults([]);
  };

  const resetNewApptForm = () => {
    setNPatientId(''); setNPatientName(''); setNPhone(''); setNAadhar('');
    setNDoctor(DOCTORS[0]); setNVisitType('Walk-In'); setNPriority('Normal'); setNComplaint('');
    setPatSearch(''); setPatResults([]);
  };

  // Create Appointment → always Scheduled (booking)
  const createAppointment = () => {
    if (!nPatientName.trim()) { alert('Please select a patient.'); return; }
    if (!nComplaint.trim()) { alert('Chief complaint is required.'); return; }
    const tokenNum = appointments.length + 1;
    const newA: Appointment = {
      id:`A${Date.now()}`, token:`OP-${String(tokenNum).padStart(3,'0')}`,
      arrivalTime: '',                        // blank — confirmed later
      scheduledTime: nowTime(),               // booking time auto-stamped
      patientName:nPatientName, patientId:nPatientId||`PT-${Date.now()}`,
      doctor:nDoctor, phone:nPhone, aadhar:nAadhar,
      visitType:nVisitType, priority:nPriority, chiefComplaint:nComplaint,
      status: 'Scheduled',                    // always Scheduled from New Appointment
      createdAt:Date.now(),
    };
    setAppointments(a=>[...a, newA]);
    setModal(false);
    resetNewApptForm();
    // Stay on All Appointments tab — show the new entry
  };

  const addQuickAppt = () => {
    if (!qName.trim())  { alert('Name is required.'); return; }
    if (!qPhone.trim()) { alert('Phone number is required.'); return; }
    const qa: QuickAppt = {
      id:`QA${Date.now()}`, name:qName.trim(), phone:qPhone.trim(),
      timeSlot:qSlot, doctor:qDoctor, createdAt:Date.now(),
    };
    setQuickAppts(q=>[qa,...q]);
    setQName(''); setQPhone(''); setQSlot(''); setQDoctor(DOCTORS[0]);
    setQuickModal(false);
    setTab('nonreg');
  };

  // Confirm Arrival → stamp arrival time, move to queue
  const confirmArrival = (apptId: string) => {
    const appt = appointments.find(a=>a.id===apptId);
    if (!appt) return;
    const arrivedAt = nowTime();
    setAppointments(a=>a.map(x=>x.id===apptId
      ? {...x, status:'In Queue' as Appointment['status'], arrivalTime: arrivedAt}
      : x
    ));
    const qEntry: QueueEntry = {
      apptId:appt.id, queueNo:queue.length+1, token:appt.token,
      patientName:appt.patientName, patientId:appt.patientId, doctor:appt.doctor,
      priority:appt.priority, status:'Waiting', chiefComplaint:appt.chiefComplaint, queuedAt:Date.now(),
    };
    setQueue(q=>[...q, qEntry]);
    setConfirmId(null);
    onNav('queue');
  };

  // Navigate to Patient Registration with name+phone prefilled via AppState
  const handleRegisterPatient = (qa: QuickAppt) => {
    if (setPrefillName)  setPrefillName(qa.name);
    if (setPrefillPhone) setPrefillPhone(qa.phone);
    onNav('patientreg');
  };

  const count = (s: string) => appointments.filter(a=>a.status===s).length;

  return (
    <div className="rc-scroll rc-fade">
      <div className="rc-content">
        {/* Stats */}
        <div className="rc-stat-row">
          {([
            ['Total today', appointments.length, 's-neutral'],
            ['Scheduled',   count('Scheduled'),  's-amber'],
            ['In queue',    count('In Queue'),    's-blue'],
            ['With doctor', count('With Doctor'), 's-mineral'],
            ['No-shows',    count('No-Show'),     's-neutral'],
          ] as [string,number,string][]).map(([l,n,cls])=>(
            <div key={l} className={`rc-stat-card ${cls}`}>
              <div className="rc-stat-label">{l}</div>
              <div className="rc-stat-value">{n}</div>
            </div>
          ))}
        </div>

        <div className="rc-card" style={{padding:0,overflow:'hidden'}}>
          {/* Header */}
          <div style={{padding:'18px 22px 0',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
            <div>
              <div style={{fontWeight:800,fontSize:15}}>Appointments</div>
              <div style={{fontSize:12.5,color:'var(--muted)'}}>Manage all OP appointments and confirm patient arrivals.</div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button className="rc-btn-secondary" onClick={()=>setQuickModal(true)}>
                ⚡ Quick Appointment
              </button>
              <button className="rc-btn-primary" onClick={()=>{resetNewApptForm();setModal(true);}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Appointment
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{padding:'0 22px'}}>
            <div className="rc-tabs">
              <button className={`rc-tab ${tab==='list'?'active':''}`} onClick={()=>setTab('list')}>All Appointments</button>
              <button className={`rc-tab ${tab==='scheduled'?'active':''}`} onClick={()=>setTab('scheduled')}>
                Awaiting Confirmation
                {scheduled.length>0&&<span className="rc-nav-badge" style={{marginLeft:8,background:'var(--amber)'}}>{scheduled.length}</span>}
              </button>
              <button className={`rc-tab ${tab==='nonreg'?'active':''}`} onClick={()=>setTab('nonreg')}>
                Non-Registered Patients
                {quickAppts.length>0&&<span className="rc-nav-badge" style={{marginLeft:8,background:'var(--purple)'}}>{quickAppts.length}</span>}
              </button>
            </div>
          </div>

          {/* ── All Appointments ── */}
          {tab==='list'&&(
            <>
              <div style={{padding:'0 22px 14px'}}>
                <div className="rc-filters">
                  <select className="rc-filter-select" value={doctorF} onChange={e=>{setDoctor(e.target.value);setListPage(1);}}>
                    <option>All Doctors</option>
                    {DOCTORS.map(d=><option key={d}>{d}</option>)}
                  </select>
                  <select className="rc-filter-select" value={statusF} onChange={e=>{setStatus(e.target.value);setListPage(1);}}>
                    {['All Status','Scheduled','In Queue','With Doctor','Post-Consult','Bill Pending','Paid','Visit Complete','No-Show','Cancelled'].map(s=><option key={s}>{s}</option>)}
                  </select>
                  <div className="rc-filter-wrap" style={{flex:1}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input className="rc-filter-search" placeholder="Search by patient name or phone"
                      value={search} onChange={e=>{setSearch(e.target.value);setListPage(1);}} />
                  </div>
                </div>
              </div>
              <div style={{overflowX:'auto'}}>
                <table className="rc-table">
                  <thead>
                    <tr>{['Token','Arrival','Patient','Doctor','Visit Type','Priority','Status','Action'].map(h=><th key={h} className="rc-th">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {listPageData.map(a=>(
                      <tr key={a.id} className="rc-tr">
                        <td className="rc-td" style={{fontWeight:700,color:'var(--primary)',fontFamily:'monospace'}}>{a.token}</td>
                        {/* Arrival: blank for Scheduled, show time once confirmed */}
                        <td className="rc-td" style={{color:'var(--muted)',fontSize:12}}>
                          {a.status==='Scheduled' ? '—' : (a.arrivalTime || '—')}
                        </td>
                        <td className="rc-td" style={{fontWeight:600}}>{a.patientName}</td>
                        <td className="rc-td" style={{fontSize:12.5,color:'var(--text2)'}}>{a.doctor}</td>
                        <td className="rc-td"><span style={{fontSize:12.5}}>{a.visitType}</span></td>
                        <td className="rc-td"><span className={priorityClass(a.priority)}>{a.priority}</span></td>
                        <td className="rc-td"><span className={statusClass(a.status)}>{a.status}</span></td>
                        <td className="rc-td">
                          {a.status==='Scheduled'&&(
                            <button className="rc-btn-primary" style={{padding:'5px 12px',fontSize:12}}
                              onClick={()=>setConfirmId(a.id)}>
                              Confirm Arrival
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {listPageData.length===0&&(
                      <tr><td colSpan={8} className="rc-td" style={{textAlign:'center',color:'var(--muted)',padding:32}}>No appointments found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{padding:'12px 22px',borderTop:'1px solid var(--line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:12.5,color:'var(--muted)'}}>Showing {Math.min(listPage*PAGE_SIZE,filtered.length)} of {filtered.length} appointments</span>
                <Pagination total={filtered.length} page={listPage} onPage={setListPage} />
              </div>
            </>
          )}

          {/* ── Awaiting Confirmation ── */}
          {tab==='scheduled'&&(
            <div style={{padding:'14px 22px'}}>
              {scheduled.length===0 ? (
                <div className="rc-empty">No appointments awaiting confirmation.</div>
              ) : (
                <table className="rc-table">
                  <thead>
                    <tr>{['Token','Booked At','Patient','Phone','Doctor','Visit Type','Action'].map(h=><th key={h} className="rc-th">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {scheduled.map(a=>(
                      <tr key={a.id} className="rc-tr">
                        <td className="rc-td" style={{fontWeight:700,color:'var(--primary)',fontFamily:'monospace'}}>{a.token}</td>
                        <td className="rc-td" style={{color:'var(--muted)'}}>{a.scheduledTime||'—'}</td>
                        <td className="rc-td" style={{fontWeight:600}}>{a.patientName}</td>
                        <td className="rc-td">{a.phone}</td>
                        <td className="rc-td" style={{fontSize:12.5}}>{a.doctor}</td>
                        <td className="rc-td">{a.visitType}</td>
                        <td className="rc-td">
                          <button className="rc-btn-primary" style={{padding:'5px 13px',fontSize:12}}
                            onClick={()=>setConfirmId(a.id)}>
                            ✓ Confirm Arrival
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── Non-Registered Patients ── */}
          {tab==='nonreg'&&(
            <div style={{padding:'14px 22px'}}>
              {/* Header row: full-width search bar */}
              <div style={{marginBottom:14}}>
                <div style={{position:'relative',width:'100%'}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'var(--muted)',pointerEvents:'none'}}>
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    style={{width:'100%',boxSizing:'border-box',padding:'9px 14px 9px 36px',border:'1.5px solid var(--border)',borderRadius:'var(--radius-xs)',fontSize:13,fontFamily:'inherit',color:'var(--text)',background:'var(--surface)',outline:'none',transition:'border-color 0.15s'}}
                    placeholder="Search by name or phone number"
                    value={nonRegSearch} onChange={e=>{setNonRegSearch(e.target.value);setNonRegPage(1);}}
                    onFocus={e=>(e.currentTarget.style.borderColor='var(--primary)')}
                    onBlur={e=>(e.currentTarget.style.borderColor='var(--border)')}
                  />
                </div>
              </div>

              {nonRegFiltered.length===0 ? (
                <div className="rc-empty">
                  {quickAppts.length===0
                    ? 'No quick appointments yet. Use ⚡ Quick Appointment to add one.'
                    : 'No results match your search.'}
                </div>
              ) : (
                <>
                  <table className="rc-table">
                    <thead>
                      <tr>{['Name','Phone','Time Slot','Doctor','Booked At','Action'].map(h=><th key={h} className="rc-th">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {nonRegPageData.map(qa=>(
                        <tr key={qa.id} className="rc-tr">
                          <td className="rc-td" style={{fontWeight:700}}>{qa.name}</td>
                          <td className="rc-td">{qa.phone}</td>
                          <td className="rc-td" style={{color:'var(--muted)'}}>{qa.timeSlot||'—'}</td>
                          <td className="rc-td" style={{fontSize:12.5}}>{qa.doctor}</td>
                          <td className="rc-td" style={{color:'var(--muted)',fontSize:12}}>
                            {new Date(qa.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                          </td>
                          <td className="rc-td">
                            {/* Single "Register Patient" button — pre-fills name+phone */}
                            <button className="rc-btn-primary" style={{fontSize:12,padding:'5px 12px'}}
                              onClick={()=>handleRegisterPatient(qa)}>
                              Register Patient
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination total={nonRegFiltered.length} page={nonRegPage} onPage={setNonRegPage} />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── QUICK APPOINTMENT MODAL ── */}
      {showQuickModal&&(
        <div className="rc-modal-backdrop" onClick={()=>setQuickModal(false)}>
          <div className="rc-modal" onClick={e=>e.stopPropagation()}>
            <div className="rc-modal-header">
              <div>
                <div className="rc-modal-title">⚡ Quick Appointment</div>
                <div style={{fontSize:12.5,color:'var(--muted)',marginTop:3}}>For phone bookings and unregistered patients</div>
              </div>
              <button className="rc-modal-close" onClick={()=>setQuickModal(false)}>✕</button>
            </div>
            <div className="rc-modal-body">
              <div className="rc-form-group">
                <div className="rc-field-label">Patient Name <span style={{color:'var(--rose)'}}>*</span></div>
                <input className="rc-field-input" placeholder="Enter patient name" value={qName} onChange={e=>setQName(e.target.value)} />
              </div>
              <div className="rc-form-group">
                <div className="rc-field-label">Phone Number <span style={{color:'var(--rose)'}}>*</span></div>
                <input className="rc-field-input" placeholder="Enter phone number" value={qPhone} onChange={e=>setQPhone(e.target.value)} />
              </div>
              <div className="rc-form-group">
                <div className="rc-field-label">Appointment Time Slot</div>
                <input className="rc-field-input" type="time" value={qSlot} onChange={e=>setQSlot(e.target.value)} />
              </div>
              <div className="rc-form-group">
                <div className="rc-field-label">Preferred Doctor</div>
                <select className="rc-field-select" value={qDoctor} onChange={e=>setQDoctor(e.target.value)}>
                  {DOCTORS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={{background:'var(--al)',border:'1px solid #fde68a',borderRadius:'var(--radius-xs)',padding:'10px 14px',fontSize:12.5,color:'var(--amber)',fontWeight:600}}>
                ⚠️ This patient is not yet registered. Once they arrive, click <strong>Register Patient</strong> in the Non-Registered tab.
              </div>
            </div>
            <div className="rc-modal-footer">
              <button className="rc-btn-secondary" onClick={()=>setQuickModal(false)}>Cancel</button>
              <button className="rc-btn-primary" onClick={addQuickAppt}>Create Quick Appointment</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM ARRIVAL MODAL ── */}
      {confirmId&&(()=>{
        const appt = appointments.find(a=>a.id===confirmId);
        if (!appt) return null;
        return (
          <div className="rc-modal-backdrop" onClick={()=>setConfirmId(null)}>
            <div className="rc-modal" onClick={e=>e.stopPropagation()}>
              <div className="rc-modal-header">
                <div className="rc-modal-title">Confirm Patient Arrival</div>
                <button className="rc-modal-close" onClick={()=>setConfirmId(null)}>✕</button>
              </div>
              <div className="rc-modal-body">
                <div style={{background:'var(--primary-light)',border:'1.5px solid var(--primary-mid)',borderRadius:'var(--radius-sm)',padding:'14px 16px',marginBottom:14}}>
                  <div style={{fontWeight:800,fontSize:15}}>{appt.patientName}</div>
                  <div style={{fontSize:12.5,color:'var(--muted)',marginTop:4}}>{appt.doctor} · {appt.visitType}</div>
                  <div style={{fontSize:12.5,color:'var(--muted)'}}>Booked at: {appt.scheduledTime}</div>
                </div>
                <p style={{fontSize:13.5,color:'var(--text)'}}>
                  Confirm that <strong>{appt.patientName}</strong> has arrived?
                  This will timestamp their arrival and move them to Queue Management.
                </p>
              </div>
              <div className="rc-modal-footer">
                <button className="rc-btn-secondary" onClick={()=>setConfirmId(null)}>Cancel</button>
                <button className="rc-btn-primary" onClick={()=>confirmArrival(confirmId)}>
                  ✓ Confirm &amp; Move to Queue
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── NEW APPOINTMENT MODAL ── */}
      {showModal&&(
        <div className="rc-modal-backdrop" onClick={()=>setModal(false)}>
          <div className="rc-modal rc-modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="rc-modal-header">
              <div className="rc-modal-title">New Appointment</div>
              <button className="rc-modal-close" onClick={()=>setModal(false)}>✕</button>
            </div>
            <div className="rc-modal-body">
              {/* Patient search */}
              <div className="rc-form-group">
                <div className="rc-field-label">Search Patient (Name / Mobile / Aadhar) <span style={{color:'var(--rose)'}}>*</span></div>
                <div style={{display:'flex',gap:8}}>
                  <input className="rc-field-input" style={{flex:1}} placeholder="Type name, mobile or Aadhar..."
                    value={patSearch} onChange={e=>{setPatSearch(e.target.value); if(!e.target.value) setPatResults([]);}} />
                  <button className="rc-btn-secondary" onClick={searchPatients}>Search</button>
                </div>
                {patResults.length>0&&(
                  <div style={{background:'var(--card)',border:'1.5px solid var(--border)',borderRadius:'var(--radius-sm)',marginTop:4,maxHeight:160,overflowY:'auto',boxShadow:'var(--shadow)'}}>
                    {patResults.map(p=>(
                      <div key={p.id} style={{padding:'9px 13px',cursor:'pointer',fontSize:13,borderBottom:'1px solid var(--line)',transition:'background 0.13s'}}
                        onMouseEnter={e=>(e.currentTarget.style.background='var(--primary-light)')}
                        onMouseLeave={e=>(e.currentTarget.style.background='')}
                        onClick={()=>selectPatient(p)}>
                        <strong>{p.name}</strong>
                        <span style={{color:'var(--muted)'}}> · {p.mobile} · {p.aadhar||'No Aadhar'}</span>
                      </div>
                    ))}
                  </div>
                )}
                {nPatientName&&(
                  <div style={{fontSize:12.5,color:'var(--green)',marginTop:4,fontWeight:600}}>
                    ✓ Selected: {nPatientName} ({nPatientId})
                  </div>
                )}
              </div>

              {/* Booking Time — auto, read-only */}
              <div className="rc-form-group">
                <div className="rc-field-label">Booking Time (Auto)</div>
                <input className="rc-field-input" value={nowTime()} readOnly
                  style={{background:'#f8fafc',color:'var(--muted)'}} />
              </div>

              <div className="rc-form-row">
                <div className="rc-form-group">
                  <div className="rc-field-label">Visit Type</div>
                  <select className="rc-field-select" value={nVisitType}
                    onChange={e=>setNVisitType(e.target.value as Appointment['visitType'])}>
                    {['Walk-In','Follow-Up','Consultation','Procedure'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="rc-form-group">
                  <div className="rc-field-label">Priority</div>
                  <select className="rc-field-select" value={nPriority}
                    onChange={e=>setNPriority(e.target.value as Appointment['priority'])}>
                    <option>Normal</option><option>Urgent</option><option>Emergency</option>
                  </select>
                </div>
              </div>

              <div className="rc-form-group">
                <div className="rc-field-label">Assigned Doctor</div>
                <select className="rc-field-select" value={nDoctor} onChange={e=>setNDoctor(e.target.value)}>
                  {DOCTORS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="rc-form-group">
                <div className="rc-field-label">Reason for Visit / Chief Complaint <span style={{color:'var(--rose)'}}>*</span></div>
                <textarea className="rc-field-textarea" rows={3}
                  placeholder="Enter chief complaint or reason for visit..."
                  value={nComplaint} onChange={e=>setNComplaint(e.target.value)} />
              </div>
            </div>
            <div className="rc-modal-footer">
              <button className="rc-btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
              <button className="rc-btn-primary" onClick={createAppointment}>
                Create Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};