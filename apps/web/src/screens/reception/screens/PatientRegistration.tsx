import React, { useState, useEffect, useCallback } from 'react';
import type { Patient, AppState, Appointment, QueueEntry } from '../types/reception.types';
import { INITIAL_PATIENTS as PATIENTS, DOCTORS } from '../data/mockReceptionData';

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const PAGE_SIZE = 10;

const BLINK_CSS = `
@keyframes row-highlight { 0%,100%{background:transparent;} 50%{background:#ccfbf1;} }
.rc-row-blink { animation: row-highlight 0.6s ease-in-out 3; }
`;

function nowTime() { return new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}); }

// Simple Pagination
const Pagination: React.FC<{total:number;page:number;onPage:(p:number)=>void}> = ({total,page,onPage}) => {
  const pages = Math.ceil(total/PAGE_SIZE);
  if (pages<=1) return null;
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,justifyContent:'flex-end',padding:'12px 0 0'}}>
      <button className="rc-btn-outline" style={{fontSize:12,padding:'4px 10px'}} disabled={page===1} onClick={()=>onPage(page-1)}>← Prev</button>
      {Array.from({length:pages},(_,i)=>i+1).map(n=>(
        <button key={n} onClick={()=>onPage(n)} style={{width:30,height:30,borderRadius:8,fontWeight:600,fontSize:12.5,cursor:'pointer',fontFamily:'inherit',border:n===page?'1.5px solid var(--primary)':'1.5px solid var(--border)',background:n===page?'var(--primary)':'var(--surface)',color:n===page?'white':'var(--text2)'}}>
          {n}
        </button>
      ))}
      <button className="rc-btn-outline" style={{fontSize:12,padding:'4px 10px'}} disabled={page===Math.ceil(total/PAGE_SIZE)} onClick={()=>onPage(page+1)}>Next →</button>
    </div>
  );
};

export const PatientRegistration: React.FC<AppState> = ({
  appointments, setAppointments, queue, setQueue, onNav,
  prefillName, prefillPhone, setPrefillName, setPrefillPhone,
}) => {
  const [tab, setTab]           = useState<'new'|'recent'>('new');
  // Patients state — today's registrations first
  const todayStr = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
  // Only show patients registered today in Recent Registrations
  // We maintain a separate list of newly registered today
  const [patients, setPatients] = useState<Patient[]>(
    PATIENTS.filter(p => p.lastVisit === 'Today')
  );
  const [allPatients]           = useState<Patient[]>(PATIENTS);
  const [newId, setNewId]       = useState<string|null>(null);
  const [searchQ, setSearchQ]   = useState('');
  const [page, setPage]         = useState(1);

  // Add to Queue modal
  const [apptPat, setApptPat]       = useState<Patient|null>(null);
  const [aVisitType, setAVisitType] = useState<Appointment['visitType']>('Walk-In');
  const [aPriority,  setAPriority]  = useState<Appointment['priority']>('Normal');
  const [aDoctor,    setADoctor]    = useState(DOCTORS[0]);
  const [aComplaint, setAComplaint] = useState('');

  // Form fields (individual state — fixes cursor bug)
  const [fName,    setFName]    = useState('');
  const [fGender,  setFGender]  = useState('Male');
  const [fAge,     setFAge]     = useState('');
  const [fMobile,  setFMobile]  = useState('');
  const [fAadhar,  setFAadhar]  = useState('');
  const [fEmail,   setFEmail]   = useState('');
  const [fAddress, setFAddress] = useState('');
  const [fBlood,   setFBlood]   = useState('');
  const [fOccup,   setFOccup]   = useState('');
  const [fRefBy,   setFRefBy]   = useState('');
  const [fEmName,  setFEmName]  = useState('');
  const [fEmPhone, setFEmPhone] = useState('');

  const nextId = `PT-${String(allPatients.length + patients.length + 124).padStart(6,'0')}`;

  // Auto-populate name and phone from Quick Appointment prefill
  useEffect(() => {
    if (prefillName || prefillPhone) {
      if (prefillName)  setFName(prefillName);
      if (prefillPhone) setFMobile(prefillPhone);
      // Clear the prefill so it doesn't re-trigger
      if (setPrefillName)  setPrefillName('');
      if (setPrefillPhone) setPrefillPhone('');
      // Switch to New Registration tab so user sees the form
      setTab('new');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillName, prefillPhone]);

  const clearForm = useCallback(() => {
    setFName('');setFGender('Male');setFAge('');setFMobile('');
    setFAadhar('');setFEmail('');setFAddress('');
    setFBlood('');setFOccup('');setFRefBy('');setFEmName('');setFEmPhone('');
  }, []);

  const save = () => {
    if (!fName.trim())   { alert('Full name is required.'); return; }
    if (!fMobile.trim()) { alert('Mobile number is required.'); return; }
    if (!fAadhar.trim()) { alert('Aadhar number is required.'); return; }
    if (!fAge.trim() || isNaN(Number(fAge))) { alert('Age is required.'); return; }
    const p: Patient = {
      id:nextId, name:fName.trim(), mobile:fMobile.trim(),
      aadhar:fAadhar.trim(), age:Number(fAge),
      gender:fGender as Patient['gender'], lastVisit:'Today',
      bloodGroup:fBlood, email:fEmail, address:fAddress, occupation:fOccup,
    };
    setPatients(prev => [p, ...prev]);
    setNewId(p.id);
    clearForm();
    setPage(1);
    setTab('recent');
  };

  useEffect(() => {
    if (!newId) return;
    const t = setTimeout(() => setNewId(null), 2200);
    return () => clearTimeout(t);
  }, [newId]);

  const recentFiltered = patients.filter(p => {
    const q = searchQ.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.mobile.includes(q) ||
           (p.aadhar||'').replace(/\s/g,'').includes(q.replace(/\s/g,''));
  });
  const pageData = recentFiltered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const openApptModal = (p: Patient) => {
    setApptPat(p);
    setAVisitType('Walk-In'); setAPriority('Normal'); setADoctor(DOCTORS[0]); setAComplaint('');
  };

  const saveAndAddToQueue = () => {
    if (!apptPat) return;
    if (!aComplaint.trim()) { alert('Chief complaint is required.'); return; }
    const tokenNum = appointments.length+1;
    const newA: Appointment = {
      id:`A${Date.now()}`, token:`OP-${String(tokenNum).padStart(3,'0')}`,
      arrivalTime:nowTime(), scheduledTime:nowTime(),
      patientName:apptPat.name, patientId:apptPat.id,
      doctor:aDoctor, phone:apptPat.mobile, aadhar:apptPat.aadhar,
      visitType:aVisitType, priority:aPriority, chiefComplaint:aComplaint,
      status:'In Queue', createdAt:Date.now(),
    };
    setAppointments(a=>[...a,newA]);
    const qEntry: QueueEntry = {
      apptId:newA.id, queueNo:queue.length+1, token:newA.token,
      patientName:apptPat.name, patientId:apptPat.id, doctor:aDoctor,
      priority:aPriority, status:'Waiting', chiefComplaint:aComplaint, queuedAt:Date.now(),
    };
    setQueue(q=>[...q,qEntry]);
    setApptPat(null);
    onNav('queue');
  };

  const L = ({label,required=false}:{label:string;required?:boolean}) => (
    <div className="rc-field-label">{label}{required&&<span style={{color:'var(--rose)'}}> *</span>}</div>
  );

  return (
    <div className="rc-scroll rc-fade">
      <style>{BLINK_CSS}</style>
      <div className="rc-content">
        <div className="rc-card" style={{padding:0}}>
          <div style={{padding:'16px 22px 0'}}>
            <div style={{fontWeight:800,fontSize:15,marginBottom:3}}>Patient Registration</div>
            <div style={{fontSize:12.5,color:'var(--muted)',marginBottom:14}}>Register new outpatient and capture demographic details.</div>
            <div className="rc-tabs">
              <button className={`rc-tab ${tab==='new'?'active':''}`} onClick={()=>setTab('new')}>New Registration</button>
              <button className={`rc-tab ${tab==='recent'?'active':''}`} onClick={()=>setTab('recent')}>Recent Registrations</button>
            </div>
          </div>

          {/* ── NEW REGISTRATION ── */}
          {tab==='new'&&(
            <div style={{padding:'20px 22px'}}>
              <div className="rc-reg-grid">
                <div className="rc-reg-panel">
                  <div className="rc-reg-section-title">Patient Information</div>
                  <div className="rc-form-group">
                    <L label="Patient ID (Auto)" />
                    <input className="rc-field-input" value={nextId} readOnly style={{background:'#f8fafc',color:'var(--muted)'}} />
                  </div>
                  <div className="rc-form-group"><L label="Full Name" required /><input className="rc-field-input" placeholder="Enter full name" value={fName} onChange={e=>setFName(e.target.value)} /></div>
                  <div className="rc-form-row">
                    <div className="rc-form-group">
                      <L label="Gender" required />
                      <select className="rc-field-select" value={fGender} onChange={e=>setFGender(e.target.value)}>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                    <div className="rc-form-group"><L label="Age" required /><input className="rc-field-input" placeholder="e.g. 35" type="number" min="0" max="120" value={fAge} onChange={e=>setFAge(e.target.value)} /></div>
                  </div>
                  <div className="rc-form-group"><L label="Mobile Number" required /><input className="rc-field-input" placeholder="Enter mobile number" value={fMobile} onChange={e=>setFMobile(e.target.value)} /></div>
                  <div className="rc-form-group"><L label="Aadhar Number" required /><input className="rc-field-input" placeholder="XXXX XXXX XXXX" value={fAadhar} onChange={e=>setFAadhar(e.target.value)} /></div>
                  <div className="rc-form-group"><L label="Email ID" /><input className="rc-field-input" placeholder="Enter email id" type="email" value={fEmail} onChange={e=>setFEmail(e.target.value)} /></div>
                  <div className="rc-form-group"><L label="Address" /><input className="rc-field-input" placeholder="Enter complete address" value={fAddress} onChange={e=>setFAddress(e.target.value)} /></div>
                </div>
                <div className="rc-reg-panel">
                  <div className="rc-reg-section-title">Additional Information</div>
                  <div className="rc-form-group">
                    <L label="Blood Group" />
                    <select className="rc-field-select" value={fBlood} onChange={e=>setFBlood(e.target.value)}>
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map(b=><option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="rc-form-group"><L label="Occupation" /><input className="rc-field-input" placeholder="Enter occupation" value={fOccup} onChange={e=>setFOccup(e.target.value)} /></div>
                  <div className="rc-form-group">
                    <L label="Referred By" />
                    <select className="rc-field-select" value={fRefBy} onChange={e=>setFRefBy(e.target.value)}>
                      <option value="">Select or enter</option>
                      {['Self','Doctor Referral','Hospital Referral','Online'].map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="rc-form-group"><L label="Emergency Contact Name" /><input className="rc-field-input" placeholder="Enter name" value={fEmName} onChange={e=>setFEmName(e.target.value)} /></div>
                  <div className="rc-form-group"><L label="Emergency Contact Number" /><input className="rc-field-input" placeholder="Enter mobile number" value={fEmPhone} onChange={e=>setFEmPhone(e.target.value)} /></div>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:20}}>
                <button className="rc-btn-secondary" onClick={clearForm}>Clear</button>
                <button className="rc-btn-primary" onClick={save}>Save &amp; Register</button>
              </div>
            </div>
          )}

          {/* ── RECENT REGISTRATIONS (today only) ── */}
          {tab==='recent'&&(
            <div style={{padding:'0 22px 22px',overflowX:'auto'}}>
              {/* Wider search bar */}
              <div style={{margin:'16px 0 12px'}}>
                <div className="rc-filter-wrap" style={{width:'100%',maxWidth:'100%'}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input className="rc-filter-search" style={{width:'100%'}}
                    placeholder="Search by name, mobile or Aadhar number"
                    value={searchQ} onChange={e=>{setSearchQ(e.target.value);setPage(1);}} />
                </div>
                {searchQ&&<div style={{marginTop:6,fontSize:12.5,color:'var(--muted)'}}>{recentFiltered.length} result(s)</div>}
              </div>

              {patients.length===0 ? (
                <div className="rc-empty">No patients registered today yet.</div>
              ) : (
                <>
                  <table className="rc-table">
                    <thead>
                      <tr>{['Patient ID','Name','Mobile','Aadhar','Age/Gender','Last Visit','Actions'].map(h=><th key={h} className="rc-th">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {pageData.map(p=>(
                        <tr key={p.id} className={`rc-tr ${p.id===newId?'rc-row-blink':''}`}>
                          <td className="rc-td" style={{color:'var(--primary)',fontWeight:600,fontFamily:'monospace'}}>{p.id}</td>
                          <td className="rc-td" style={{fontWeight:600}}>
                            {p.id===newId&&<span style={{background:'var(--primary)',color:'white',fontSize:10,fontWeight:700,padding:'2px 7px',borderRadius:20,marginRight:7,verticalAlign:'middle'}}>NEW</span>}
                            {p.name}
                          </td>
                          <td className="rc-td">{p.mobile}</td>
                          <td className="rc-td" style={{color:'var(--muted)',fontFamily:'monospace',fontSize:12}}>{(p as Patient&{aadhar?:string}).aadhar||'—'}</td>
                          <td className="rc-td">{p.age}/{p.gender}</td>
                          <td className="rc-td" style={{color:'var(--muted)'}}>{p.lastVisit}</td>
                          <td className="rc-td">
                            {/* No view button — only Add to Queue */}
                            <button className="rc-btn-primary" style={{padding:'6px 14px',fontSize:12.5,whiteSpace:'nowrap'}}
                              onClick={()=>openApptModal(p)}>
                              Add to Queue
                            </button>
                          </td>
                        </tr>
                      ))}
                      {pageData.length===0&&searchQ&&(
                        <tr><td colSpan={7} className="rc-td" style={{textAlign:'center',color:'var(--muted)',padding:32}}>No patients found for this search.</td></tr>
                      )}
                    </tbody>
                  </table>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
                    <span style={{fontSize:12.5,color:'var(--muted)'}}>
                      Showing {Math.min(page*PAGE_SIZE,recentFiltered.length)} of {recentFiltered.length} patients registered today
                    </span>
                    <Pagination total={recentFiltered.length} page={page} onPage={setPage} />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── ADD TO QUEUE MODAL ── */}
      {apptPat&&(
        <div className="rc-modal-backdrop" onClick={()=>setApptPat(null)}>
          <div className="rc-modal rc-modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="rc-modal-header">
              <div>
                <div className="rc-modal-title">New Appointment</div>
                <div style={{fontSize:12.5,color:'var(--muted)',marginTop:3}}>{apptPat.name} · {apptPat.mobile} · {apptPat.id}</div>
              </div>
              <button className="rc-modal-close" onClick={()=>setApptPat(null)}>✕</button>
            </div>
            <div className="rc-modal-body">
              {/* Pre-filled patient banner */}
              <div style={{background:'var(--primary-light)',border:'1.5px solid var(--primary-mid)',borderRadius:'var(--radius-sm)',padding:'12px 16px',marginBottom:18,display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:'var(--primary)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:14,flexShrink:0}}>
                  {apptPat.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:14}}>{apptPat.name}</div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>{apptPat.mobile} · {(apptPat as Patient&{aadhar?:string}).aadhar||'No Aadhar'}</div>
                </div>
                <span className="rc-chip green">✓ Patient Selected</span>
              </div>

              <div className="rc-form-group">
                <div className="rc-field-label">Arrival Time (Auto)</div>
                <input className="rc-field-input" value={nowTime()} readOnly style={{background:'#f8fafc',color:'var(--muted)'}} />
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
              <button className="rc-btn-primary" onClick={saveAndAddToQueue}>✓ Save &amp; Add to Queue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
