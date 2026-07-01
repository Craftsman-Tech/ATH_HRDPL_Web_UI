import React, { useState } from 'react';
import type { AppState, BillLine, PaymentMode, Appointment } from '../types/reception.types';
import { INITIAL_BILLS } from '../data/mockReceptionData';

// Demo static pending entries that always appear
const STATIC_PENDING = [
  { apptId:'A5', patientName:'Suresh Yadav', doctor:'Dr. Meera Sharma', visitDate:'Today',       amount:1000 },
  { apptId:'A2', patientName:'Priya Singh',  doctor:'Dr. Arjun Verma',  visitDate:'Today',       amount:500  },
  { apptId:'AX', patientName:'Ravi Kumar',   doctor:'Dr. Meera Sharma', visitDate:'18 Jun 2026', amount:600  },
  { apptId:'AY', patientName:'Amit Patel',   doctor:'Dr. Meera Sharma', visitDate:'18 Jun 2026', amount:600  },
];

interface PaidEntry {
  id: string; patientName: string; doctor: string; visitDate: string;
  amount: number; payMode: PaymentMode; reference: string; visitDone: boolean;
}

export const BillingPayments: React.FC<AppState> = ({ bills, setBills, appointments, setAppointments }) => {
  const visitDateFmt = new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});

  // Merge INITIAL_BILLS with any AppState bills
  const allBills = [...INITIAL_BILLS, ...bills.filter(b => !INITIAL_BILLS.find(x=>x.apptId===b.apptId))];
  const pendingBills = allBills.filter(b => !b.paidAt);

  // Build combined pending list (static demo + real pending)
  const pendingList = [
    ...STATIC_PENDING,
    ...pendingBills
      .filter(b => !STATIC_PENDING.find(s=>s.apptId===b.apptId))
      .map(b=>({ apptId:b.apptId, patientName:b.patientName, doctor:b.doctor, visitDate:b.visitDate, amount:b.lines.reduce((s,l)=>s+l.charge*l.qty,0) }))
  ];

  const [selApptId, setSelApptId] = useState<string|null>(null);
  const [lines, setLines]         = useState<BillLine[]>([
    {id:'L1',service:'Consultation Fee',charge:600,qty:1},
  ]);
  const [newSvc,   setNewSvc]   = useState('');
  const [payMode,  setPayMode]  = useState<PaymentMode>('Cash');

  const [paidList, setPaidList] = useState<PaidEntry[]>([]);
  const [receipt,  setReceipt]  = useState<PaidEntry|null>(null);
  const [waEntry,  setWaEntry]  = useState<PaidEntry|null>(null);

  const selEntry = selApptId ? pendingList.find(p=>p.apptId===selApptId) ?? null : null;
  const subtotal = lines.reduce((s,l)=>s+l.charge*l.qty, 0);

  const selectPatient = (apptId: string) => {
    setSelApptId(apptId);
    const entry = pendingList.find(p=>p.apptId===apptId);
    // Pre-load lines from bill if available
    const bill = allBills.find(b=>b.apptId===apptId);
    if (bill) setLines(bill.lines.map(l=>({...l})));
    else setLines([{id:'L1',service:'Consultation Fee',charge:entry?.amount??600,qty:1}]);
    setPayMode('Cash');
  };

  const updateLine = (id:string,field:keyof BillLine,val:string|number) =>
    setLines(ls=>ls.map(l=>l.id===id?{...l,[field]:field==='service'?val:Number(val)}:l));
  const removeLine = (id:string) => setLines(ls=>ls.filter(l=>l.id!==id));
  const addLine    = () => {
    if (!newSvc.trim()) return;
    setLines(ls=>[...ls,{id:`L${ls.length+1}`,service:newSvc.trim(),charge:0,qty:1}]);
    setNewSvc('');
  };

  const collectPayment = () => {
    if (!selEntry) return;
    const entry: PaidEntry = {
      id:`BILL-${Date.now()}`, patientName:selEntry.patientName, doctor:selEntry.doctor,
      visitDate:visitDateFmt, amount:subtotal, payMode, reference:'', visitDone:false,
    };
    setPaidList(p=>[entry,...p]);
    setReceipt(entry);
    const paidAt = Date.now();
    setBills(bs=>bs.map(b=>b.apptId===selApptId?{...b,paymentMode:payMode,amountPaid:subtotal,paidAt}:b));
    setAppointments(a=>a.map(x=>x.id===selApptId?{...x,status:'Paid' as Appointment['status'],paidAt}:x));
    setSelApptId(null);
    setLines([{id:'L1',service:'Consultation Fee',charge:600,qty:1}]);
  };

  const markVisitDone = (id:string) =>
    setPaidList(p=>p.map(e=>e.id===id?{...e,visitDone:true}:e));

  const totalPaid = paidList.reduce((s,e)=>s+e.amount,0);
  const pendingCount = pendingList.length - paidList.length;

  return (
    <div className="rc-scroll rc-fade">
      <div className="rc-content">
        {/* Summary stats */}
        <div className="rc-stat-row" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          <div className="rc-stat-card s-red">
            <div className="rc-stat-label">Pending bills</div>
            <div className="rc-stat-value">{Math.max(0,pendingCount)}</div>
          </div>
          <div className="rc-stat-card s-mineral">
            <div className="rc-stat-label">Paid today</div>
            <div className="rc-stat-value">{paidList.length}</div>
          </div>
          <div className="rc-stat-card s-neutral">
            <div className="rc-stat-label">Total collected</div>
            <div className="rc-stat-value">₹{totalPaid.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div style={{display:'grid',gridTemplateColumns:'340px 1fr',gap:18,alignItems:'flex-start'}}>

          {/* LEFT — Patient list */}
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {/* Pending */}
            <div className="rc-card" style={{padding:0}}>
              <div style={{padding:'14px 18px',fontWeight:800,fontSize:14,borderBottom:'1px solid var(--line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span>Pending Bills ({Math.max(0,pendingCount)})</span>
                <span style={{fontSize:11.5,color:'var(--muted)',fontWeight:400}}>Click to pay</span>
              </div>
              {pendingList.filter(p=>!paidList.find(pd=>pd.patientName===p.patientName&&pd.doctor===p.doctor)).map((p,i)=>(
                <div key={p.apptId} onClick={()=>selectPatient(p.apptId)}
                  style={{
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    padding:'13px 18px',
                    borderBottom: i<pendingList.length-1?'1px solid var(--line)':'none',
                    cursor:'pointer',
                    background:selApptId===p.apptId?'var(--primary-light)':'transparent',
                    borderLeft:`3px solid ${selApptId===p.apptId?'var(--primary)':'transparent'}`,
                    transition:'all 0.13s',
                  }}
                  onMouseEnter={e=>{if(selApptId!==p.apptId)e.currentTarget.style.background='#f8fffe';}}
                  onMouseLeave={e=>{if(selApptId!==p.apptId)e.currentTarget.style.background='transparent';}}
                >
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:38,height:38,borderRadius:10,background:'var(--rl)',color:'var(--rose)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>
                      {p.patientName.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13.5}}>{p.patientName}</div>
                      <div style={{fontSize:11.5,color:'var(--muted)',marginTop:2}}>{p.doctor} · {p.visitDate}</div>
                    </div>
                  </div>
                  <div style={{fontWeight:800,fontSize:14,color:'var(--rose)',flexShrink:0}}>
                    ₹{p.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Paid */}
            {paidList.length>0&&(
              <div className="rc-card" style={{padding:0}}>
                <div style={{padding:'14px 18px',fontWeight:800,fontSize:14,borderBottom:'1px solid var(--line)',color:'var(--muted)'}}>
                  Paid Today ({paidList.length})
                </div>
                <div style={{maxHeight:paidList.length>5?320:undefined,overflowY:paidList.length>5?'auto':undefined}}>
                  {paidList.map((e,i)=>(
                    <div key={e.id} style={{
                      padding:'12px 18px',
                      borderBottom:i<paidList.length-1?'1px solid var(--line)':'none',
                      background:e.visitDone?'#f8fffe':'white',
                    }}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div style={{width:34,height:34,borderRadius:9,background:'var(--gl)',color:'var(--green)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:12,flexShrink:0}}>
                            {e.patientName.split(' ').map(n=>n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <div style={{fontWeight:700,fontSize:13}}>{e.patientName}</div>
                            <div style={{fontSize:11.5,color:'var(--muted)'}}>via {e.payMode} · ₹{e.amount.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                        <span className={e.visitDone?'rc-chip green':'rc-chip amber'} style={{fontSize:11}}>
                          {e.visitDone?'Visit Complete':'Paid'}
                        </span>
                      </div>
                      <div style={{display:'flex',gap:6}}>
                        <button className="rc-btn-secondary" style={{fontSize:11,padding:'4px 10px'}} onClick={()=>setReceipt(e)}>🖨️ Receipt</button>
                        <button className="rc-btn-wa" style={{fontSize:11,padding:'4px 10px', fill:'currentColor'}} onClick={()=>setWaEntry(e)}>💬WhatsApp</button>
                        {!e.visitDone&&<button className="rc-btn-primary" style={{fontSize:11,padding:'4px 10px',background:'var(--green)'}} onClick={()=>markVisitDone(e.id)}>Mark Visit Completed</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Bill form or empty state */}
          <div>
            {!selEntry ? (
              <div className="rc-card" style={{textAlign:'center',padding:'56px 24px',color:'var(--muted)'}}>
                <div style={{fontSize:48,marginBottom:16}}>💳</div>
                <div style={{fontWeight:700,fontSize:15,color:'var(--text)',marginBottom:8}}>Select a patient to collect payment</div>
                <div style={{fontSize:13}}>Click on any patient from the Pending Bills list on the left.</div>
              </div>
            ) : (
              <div className="rc-card">
                {/* Patient header */}
                <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20,padding:'14px 18px',background:'var(--primary-light)',border:'1.5px solid var(--primary-mid)',borderRadius:'var(--radius-sm)'}}>
                  <div style={{width:46,height:46,borderRadius:12,background:'var(--primary)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:16,flexShrink:0}}>
                    {selEntry.patientName.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:16}}>{selEntry.patientName}</div>
                    <div style={{fontSize:12.5,color:'var(--muted)',marginTop:2}}>{selEntry.doctor} · {selEntry.visitDate}</div>
                  </div>
                  <button className="rc-modal-close" onClick={()=>setSelApptId(null)}>✕</button>
                </div>

                {/* Bill lines */}
                <div style={{fontWeight:700,fontSize:13.5,marginBottom:12}}>Services &amp; Charges</div>
                <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'var(--radius-sm)',padding:'14px 16px',marginBottom:20}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 110px 100px 32px',gap:10,marginBottom:10}}>
                    {['Service','Charge (₹)','Amount',''].map(h=><div key={h} style={{fontSize:10.5,fontWeight:700,color:'var(--muted)',textTransform:'uppercase'}}>{h}</div>)}
                  </div>
                  {lines.map(l=>(
                    <div key={l.id} style={{display:'grid',gridTemplateColumns:'1fr 110px 100px 32px',gap:10,marginBottom:10,alignItems:'center'}}>
                      <input className="rc-field-input" style={{padding:'8px 12px',fontSize:13.5}} value={l.service} onChange={e=>updateLine(l.id,'service',e.target.value)} />
                      <input className="rc-field-input" style={{padding:'8px 12px',fontSize:13.5,textAlign:'right'}} type="number" value={l.charge} onChange={e=>updateLine(l.id,'charge',e.target.value)} />
                      <div style={{fontSize:14,fontWeight:700,color:'var(--mineral-700)',display:'flex',alignItems:'center',justifyContent:'flex-end'}}>₹{(l.charge*l.qty).toLocaleString('en-IN')}</div>
                      <button onClick={()=>removeLine(l.id)} style={{width:30,height:30,borderRadius:8,border:'1.5px solid var(--rl)',background:'var(--rl)',cursor:'pointer',color:'var(--rose)',fontWeight:800,fontSize:16,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.13s'}}>×</button>
                    </div>
                  ))}
                  <div style={{display:'flex',gap:8,marginTop:8}}>
                    <input className="rc-field-input" style={{flex:1,padding:'6px 9px',fontSize:13}} placeholder="Add service..." value={newSvc} onChange={e=>setNewSvc(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addLine()} />
                    <button className="rc-btn-outline" onClick={addLine} style={{whiteSpace:'nowrap'}}>+ Add</button>
                  </div>
                  <div style={{borderTop:'2px solid var(--border)',marginTop:14,paddingTop:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}><span style={{color:'var(--muted)'}}>Subtotal</span><span style={{fontWeight:600}}>₹{subtotal.toLocaleString('en-IN')}</span></div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:17,fontWeight:800}}>
                      <span>Total</span><span style={{color:'var(--primary)'}}>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Payment section — simplified */}
                <div style={{marginTop:20,paddingTop:20,borderTop:'2px solid var(--border)'}}>
                  <div style={{fontWeight:700,fontSize:13.5,marginBottom:14}}>Payment Mode</div>
                  <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:20}}>
                    {(['Cash','Card','UPI','Insurance'] as PaymentMode[]).map(m=>(
                      <button key={m} onClick={()=>setPayMode(m)}
                        style={{padding:'9px 22px',borderRadius:'var(--radius-xs)',fontSize:13.5,fontWeight:600,fontFamily:'inherit',cursor:'pointer',transition:'all 0.15s',
                          background:payMode===m?'var(--primary)':'var(--surface)',
                          color:payMode===m?'white':'var(--text2)',
                          border:`1.5px solid ${payMode===m?'var(--primary)':'var(--border)'}`,
                          boxShadow:payMode===m?'0 2px 8px rgba(13,148,136,.25)':'none'}}>
                        {m}
                      </button>
                    ))}
                  </div>
                  <button className="rc-btn-primary" style={{width:'100%',justifyContent:'center',padding:'13px',fontSize:15}} onClick={collectPayment}>
                    ✓ Confirm Payment — ₹{subtotal.toLocaleString('en-IN')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {receipt&&(
        <div className="rc-modal-backdrop" onClick={()=>setReceipt(null)}>
          <div className="rc-modal rc-modal-lg" onClick={e=>e.stopPropagation()}>
            <div className="rc-modal-header">
              <div className="rc-modal-title">Payment Receipt</div>
              <button className="rc-modal-close" onClick={()=>setReceipt(null)}>✕</button>
            </div>
            <div className="rc-modal-body">
              <div style={{textAlign:'center',marginBottom:20}}>
                <div style={{fontWeight:900,fontSize:22,color:'var(--primary)'}}>Vexoo Hospital</div>
                <div style={{fontSize:12.5,color:'var(--muted)'}}>Tax Invoice / Receipt · {receipt.visitDate}</div>
              </div>
              <div style={{border:'1.5px solid var(--border)',borderRadius:'var(--radius-sm)',padding:20}}>
                {[['Patient',receipt.patientName],['Doctor',receipt.doctor],['Payment Mode',receipt.payMode],['Amount Paid',`₹${receipt.amount.toLocaleString('en-IN')}`],['Reference',receipt.reference||'—']].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--line)',fontSize:13}}>
                    <span style={{color:'var(--muted)'}}>{k}</span>
                    <span style={{fontWeight:700}}>{v}</span>
                  </div>
                ))}
                <div style={{marginTop:16,textAlign:'center',color:'var(--green)',fontWeight:800,fontSize:16}}>✓ PAID IN FULL</div>
              </div>
            </div>
            <div className="rc-modal-footer">
              <button className="rc-btn-secondary" onClick={()=>setReceipt(null)}>Close</button>
              <button className="rc-btn-primary" onClick={()=>{window.print();setReceipt(null);}}>🖨️ Print Receipt</button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      {waEntry&&(
        <div className="rc-modal-backdrop" onClick={()=>setWaEntry(null)}>
          <div className="rc-modal" onClick={e=>e.stopPropagation()}>
            <div className="rc-modal-header">
              <div className="rc-modal-title">Send Receipt via WhatsApp</div>
              <button className="rc-modal-close" onClick={()=>setWaEntry(null)}>✕</button>
            </div>
            <div className="rc-modal-body">
              <p style={{fontSize:13.5}}>Send the bill receipt to <strong>{waEntry.patientName}</strong> for <strong>₹{waEntry.amount.toLocaleString('en-IN')}</strong>?</p>
            </div>
            <div className="rc-modal-footer">
              <button className="rc-btn-secondary" onClick={()=>setWaEntry(null)}>Cancel</button>
              <button className="rc-btn-wa" onClick={()=>{alert(`Receipt sent to ${waEntry!.patientName}`);setWaEntry(null);}}>📲 Send via WhatsApp</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
