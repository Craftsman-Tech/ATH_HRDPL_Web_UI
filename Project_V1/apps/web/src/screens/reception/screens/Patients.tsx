import React, { useState } from 'react';
import type { Patient, AppState, Appointment, QueueEntry } from '../types/reception.types';
import { INITIAL_PATIENTS as PATIENTS, DOCTORS } from '../data/mockReceptionData';

function nowTime() { return new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}); }

export const Patients: React.FC<AppState> = ({ appointments, setAppointments, queue, setQueue, onNav }) => {
  const [patients]          = useState<Patient[]>(PATIENTS);
  const [search, setSearch] = useState('');
  const [showDetail, setDetail]     = useState<Patient|null>(null);
  const [apptPatient, setApptPat]   = useState<Patient|null>(null);

  // Appointment modal state — all individual to avoid cursor bug
  const [aVisitType, setAVisitType]  = useState<Appointment['visitType']>('Walk-In');
  const [aPriority,  setAPriority]   = useState<Appointment['priority']>('Normal');
  const [aDoctor,    setADoctor]     = useState(DOCTORS[0]);
  const [aComplaint, setAComplaint]  = useState('');
  const [aScheduled, setAScheduled]  = useState('');

  const [page, setPage]               = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = patients.filter(p => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) || p.mobile.includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (p.aadhar||'').replace(/\s/g,'').includes(q.replace(/\s/g,''))
    );
  });

  const pages    = Math.ceil(filtered.length / rowsPerPage);
  const pageData = filtered.slice((page-1)*rowsPerPage, page*rowsPerPage);

  const handleRowsChange = (n: number) => { setRowsPerPage(n); setPage(1); };
  const handleSearch     = (v: string) => { setSearch(v); setPage(1); };

  const openApptModal = (p: Patient) => {
    setDetail(null);
    setApptPat(p);
    setAVisitType('Walk-In'); setAPriority('Normal');
    setADoctor(DOCTORS[0]); setAComplaint(''); setAScheduled('');
  };

  const saveAndAddToQueue = () => {
    if (!apptPatient) return;
    if (!aComplaint.trim()) { alert('Chief complaint is required.'); return; }
    const tokenNum = appointments.length+1;
    const isScheduled = !!aScheduled;
    const newA: Appointment = {
      id:`A${Date.now()}`, token:`OP-${String(tokenNum).padStart(3,'0')}`,
      arrivalTime: isScheduled ? '' : nowTime(),
      scheduledTime: aScheduled || nowTime(),
      patientName:apptPatient.name, patientId:apptPatient.id,
      doctor:aDoctor, phone:apptPatient.mobile, aadhar:apptPatient.aadhar,
      visitType:aVisitType, priority:aPriority, chiefComplaint:aComplaint,
      status: isScheduled ? 'Scheduled' : 'In Queue', createdAt:Date.now(),
    };
    setAppointments(a=>[...a,newA]);
    if (!isScheduled) {
      const qEntry: QueueEntry = {
        apptId:newA.id, queueNo:queue.length+1, token:newA.token,
        patientName:apptPatient.name, patientId:apptPatient.id,
        doctor:aDoctor, priority:aPriority,
        status:'Waiting', chiefComplaint:aComplaint, queuedAt:Date.now(),
      };
      setQueue(q=>[...q,qEntry]);
    }
    setApptPat(null);
    onNav(isScheduled ? 'appointments' : 'queue');
  };

  return (
    <div className="rc-scroll rc-fade">
      <div className="rc-content">
        <div className="rc-card" style={{padding:0,overflow:'hidden'}}>
          <div style={{padding:'18px 22px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid var(--line)'}}>
            <div>
              <div style={{fontWeight:800,fontSize:15}}>Patients</div>
              <div style={{fontSize:12.5,color:'var(--muted)'}}>Search by name, phone number or Aadhar to find and manage patients.</div>
            </div>
          </div>

          <div style={{padding:'14px 22px',borderBottom:'1px solid var(--line)'}}>
            <div className="rc-filter-wrap" style={{width:'100%',maxWidth:'100%'}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="rc-filter-search" style={{width:'100%'}}
                placeholder="Search by Phone Number, Aadhar Number or Patient Name"
                value={search} onChange={e=>handleSearch(e.target.value)} />
            </div>
            {search.trim()&&<div style={{marginTop:6,fontSize:12.5,color:'var(--muted)'}}>{filtered.length} result{filtered.length!==1?'s':''} found</div>}
          </div>

          {/* Scrollable container — shows 7 rows then scrolls */}
          <div style={{overflowX:'auto', overflowY:'auto', maxHeight: rowsPerPage <= 10 ? '480px' : undefined}}>
            <table className="rc-table">
              <thead style={{position:'sticky', top:0, background:'var(--card)', zIndex:1}}>
                <tr>{['Patient ID','Name','Mobile','Aadhar','Age/Gender','Last Visit','Actions'].map(h=><th key={h} className="rc-th">{h}</th>)}</tr>
              </thead>
              <tbody>
                {pageData.map(p=>(
                  <tr key={p.id} className="rc-tr">
                    <td className="rc-td" style={{color:'var(--primary)',fontWeight:600,fontFamily:'monospace'}}>{p.id}</td>
                    <td className="rc-td" style={{fontWeight:600}}>{p.name}</td>
                    <td className="rc-td">{p.mobile}</td>
                    <td className="rc-td" style={{color:'var(--muted)',fontFamily:'monospace',fontSize:12}}>{p.aadhar||'—'}</td>
                    <td className="rc-td">{p.age}/{p.gender}</td>
                    <td className="rc-td" style={{color:'var(--muted)'}}>{p.lastVisit}</td>
                    <td className="rc-td">
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <button className="rc-tbl-action" title="View" onClick={()=>setDetail(p)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="rc-btn-primary" style={{padding:'6px 14px',fontSize:12.5,whiteSpace:'nowrap'}} onClick={()=>openApptModal(p)}>
                          Add to Queue
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length===0&&(
                  <tr><td colSpan={7} className="rc-td" style={{textAlign:'center',color:'var(--muted)',padding:36}}>
                    {search.trim()?'No patients found. Try a different search.':'No patients registered yet.'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{padding:'12px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid var(--line)',flexWrap:'wrap',gap:10}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:12.5,color:'var(--muted)'}}>
                Showing {Math.min(page*rowsPerPage, filtered.length)} of {filtered.length} patients
              </span>
              <span style={{fontSize:12.5,color:'var(--muted)'}}>·</span>
              <span style={{fontSize:12.5,color:'var(--muted)'}}>Rows per page:</span>
              {[5,10,20,50].map(n=>(
                <button key={n} onClick={()=>handleRowsChange(n)}
                  style={{
                    padding:'3px 10px', borderRadius:7, fontFamily:'inherit',
                    fontSize:12.5, fontWeight:600, cursor:'pointer', transition:'all 0.13s',
                    border: n===rowsPerPage?'1.5px solid var(--mineral-700)':'1.5px solid var(--border)',
                    background: n===rowsPerPage?'var(--mineral-100)':'var(--surface)',
                    color: n===rowsPerPage?'var(--mineral-700)':'var(--text2)',
                  }}>
                  {n}
                </button>
              ))}
            </div>
            {pages>1&&(
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                <button className="rc-btn-outline" style={{fontSize:12,padding:'4px 10px'}}
                  disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
                {Array.from({length:pages},(_,i)=>i+1).map(n=>(
                  <button key={n} onClick={()=>setPage(n)} style={{
                    width:30,height:30,borderRadius:8,fontWeight:600,fontSize:12.5,cursor:'pointer',fontFamily:'inherit',
                    border:n===page?'1.5px solid var(--mineral-700)':'1.5px solid var(--border)',
                    background:n===page?'var(--mineral-700)':'var(--surface)',
                    color:n===page?'white':'var(--text2)',
                  }}>{n}</button>
                ))}
                <button className="rc-btn-outline" style={{fontSize:12,padding:'4px 10px'}}
                  disabled={page===pages} onClick={()=>setPage(p=>p+1)}>Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail&&(
        <div className="rc-modal-backdrop" onClick={()=>setDetail(null)}>
          <div className="rc-modal" onClick={e=>e.stopPropagation()}>
            <div className="rc-modal-header">
              <div className="rc-modal-title">Patient Details</div>
              <button className="rc-modal-close" onClick={()=>setDetail(null)}>✕</button>
            </div>
            <div className="rc-modal-body">
              <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:18,padding:'14px 16px',background:'var(--primary-light)',borderRadius:'var(--radius-sm)'}}>
                <div style={{width:48,height:48,borderRadius:'50%',background:'var(--primary)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:17}}>
                  {showDetail.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:16}}>{showDetail.name}</div>
                  <div style={{fontSize:12.5,color:'var(--muted)'}}>{showDetail.id} · {showDetail.age} yrs · {showDetail.gender}</div>
                </div>
              </div>
              {[['Mobile',showDetail.mobile],['Aadhar',showDetail.aadhar||'—'],['Blood Group',showDetail.bloodGroup||'—'],['Last Visit',showDetail.lastVisit],['Email',showDetail.email||'—']].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--line)',fontSize:13}}>
                  <span style={{color:'var(--muted)'}}>{k}</span>
                  <span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
            <div className="rc-modal-footer">
              <button className="rc-btn-secondary" onClick={()=>setDetail(null)}>Close</button>
              <button className="rc-btn-primary" onClick={()=>openApptModal(showDetail)}>Add to Queue</button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Queue / Appointment Modal */}
      {apptPatient&&(
        <div className="rc-modal-backdrop" onClick={()=>setApptPat(null)}>
          <div className="rc-modal rc-modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="rc-modal-header">
              <div>
                <div className="rc-modal-title">New Appointment</div>
                <div style={{fontSize:12.5,color:'var(--muted)',marginTop:3}}>
                  {apptPatient.name} · {apptPatient.mobile} · {apptPatient.id}
                </div>
              </div>
              <button className="rc-modal-close" onClick={()=>setApptPat(null)}>✕</button>
            </div>
            <div className="rc-modal-body">
              {/* Selected patient banner */}
              <div style={{background:'var(--primary-light)',border:'1.5px solid var(--primary-mid)',borderRadius:'var(--radius-sm)',padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:38,height:38,borderRadius:'50%',background:'var(--primary)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:14,flexShrink:0}}>
                  {apptPatient.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <div style={{fontWeight:800,fontSize:14}}>{apptPatient.name}</div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>{apptPatient.mobile} · {apptPatient.aadhar||'No Aadhar'}</div>
                </div>
                <span className="rc-chip green" style={{marginLeft:'auto'}}>✓ Patient Selected</span>
              </div>

              <div className="rc-form-group">
                <div className="rc-field-label">Arrival Time (Auto)</div>
                <input className="rc-field-input" value={nowTime()} readOnly style={{background:'#f8fafc',color:'var(--muted)'}} />
              </div>

              <div className="rc-form-group">
                <div className="rc-field-label">Schedule for later (optional — leave blank for immediate queue)</div>
                <input className="rc-field-input" type="time" value={aScheduled} onChange={e=>setAScheduled(e.target.value)} />
              </div>

              <div className="rc-form-row">
                <div className="rc-form-group">
                  <div className="rc-field-label">Visit Type</div>
                  <select className="rc-field-select" value={aVisitType} onChange={e=>setAVisitType(e.target.value as Appointment['visitType'])}>
                    {['Walk-In','Follow-Up','Consultation','Procedure'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="rc-form-group">
                  <div className="rc-field-label">Priority</div>
                  <select className="rc-field-select" value={aPriority} onChange={e=>setAPriority(e.target.value as Appointment['priority'])}>
                    <option>Normal</option><option>Urgent</option><option>Emergency</option>
                  </select>
                </div>
              </div>

              <div className="rc-form-group">
                <div className="rc-field-label">Assigned Doctor</div>
                <select className="rc-field-select" value={aDoctor} onChange={e=>setADoctor(e.target.value)}>
                  {DOCTORS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="rc-form-group">
                <div className="rc-field-label">Reason for Visit / Chief Complaint <span style={{color:'var(--rose)'}}>*</span></div>
                <textarea className="rc-field-textarea" rows={3} placeholder="Enter chief complaint or reason for visit..."
                  value={aComplaint} onChange={e=>setAComplaint(e.target.value)} />
              </div>
            </div>
            <div className="rc-modal-footer">
              <button className="rc-btn-secondary" onClick={()=>setApptPat(null)}>Cancel</button>
              <button className="rc-btn-primary" onClick={saveAndAddToQueue}>
                {aScheduled ? 'Save Appointment' : '✓ Save & Add to Queue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
