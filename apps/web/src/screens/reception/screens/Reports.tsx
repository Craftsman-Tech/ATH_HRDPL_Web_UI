import React, { useState, useRef, useEffect } from 'react';
import type { AppState } from '../types/reception.types';
import { DOCTORS } from '../data/mockReceptionData';

/* ── Ellipsis menu ─────────────────────────────────────────────────────── */
const EllipsisMenu: React.FC<{
  onPrintInvoice:()=>void; onWAInvoice:()=>void;
  onPrintPrescription:()=>void; onWAPrescription:()=>void;
}> = ({ onPrintInvoice, onWAInvoice, onPrintPrescription, onWAPrescription }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const items = [
    { label:'🖨️  Print Invoice',          action: onPrintInvoice },
    { label:'📲  WhatsApp Invoice',        action: onWAInvoice },
    { label:'📋  Print Prescription',      action: onPrintPrescription },
    { label:'💬  WhatsApp Prescription',   action: onWAPrescription },
  ];
  return (
    <div ref={ref} style={{ position:'relative', display:'inline-block' }}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{ width:34,height:34,borderRadius:9,border:'1.5px solid var(--border)',background:'var(--surface)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:'var(--text2)',transition:'all 0.13s',fontFamily:'inherit' }}>
        ⋯
      </button>
      {open&&(
        <div style={{ position:'absolute',right:0,top:40,zIndex:300,background:'var(--card)',border:'1.5px solid var(--border)',borderRadius:'var(--radius-sm)',boxShadow:'var(--shadow-lg)',minWidth:230,overflow:'hidden' }}>
          {items.map((item,i)=>(
            <button key={i} onClick={()=>{ item.action(); setOpen(false); }}
              style={{ display:'block',width:'100%',padding:'11px 16px',textAlign:'left',border:'none',borderBottom:i<items.length-1?'1px solid var(--line)':'none',background:'transparent',cursor:'pointer',fontSize:13.5,fontWeight:500,fontFamily:'inherit',color:'var(--text)',transition:'background 0.12s' }}
              onMouseEnter={e=>(e.currentTarget.style.background='var(--primary-light)')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Data ──────────────────────────────────────────────────────────────── */
interface PatientRecord {
  id:string; patientName:string; doctor:string; visitDate:string;
  month:string; year:string; prescription:string; testsRecommended?:string; invoiceAmt:number;
  dateObj: Date;
}

const BASE_RECORDS: Omit<PatientRecord,'dateObj'>[] = [
  { id:'R1', patientName:'Suresh Yadav', doctor:'Dr. Meera Sharma', visitDate:'18 Jun 2026', month:'June',  year:'2026', prescription:'Tab Ibuprofen 400mg TDS. Rest advised.',             invoiceAmt:1000 },
  { id:'R2', patientName:'Priya Singh',  doctor:'Dr. Arjun Verma',  visitDate:'18 Jun 2026', month:'June',  year:'2026', prescription:'Tab Amlodipine 5mg OD morning. Monitor BP daily.',   invoiceAmt:500  },
  { id:'R3', patientName:'Ravi Kumar',   doctor:'Dr. Meera Sharma', visitDate:'18 Jun 2026', month:'June',  year:'2026', prescription:'Tab Atorvastatin 10mg OD', testsRecommended:'ECG, Lipid Profile', invoiceAmt:600 },
  { id:'R4', patientName:'Amit Patel',   doctor:'Dr. Meera Sharma', visitDate:'17 Jun 2026', month:'June',  year:'2026', prescription:'Tab Paracetamol 500mg TID. Fluids advised.',          invoiceAmt:600  },
  { id:'R5', patientName:'Neha Gupta',   doctor:'Dr. Arjun Verma',  visitDate:'17 Jun 2026', month:'June',  year:'2026', prescription:'Tab Cetirizine 10mg OD night.',                      invoiceAmt:500  },
];

const RECORDS: PatientRecord[] = BASE_RECORDS.map(r => ({
  ...r, dateObj: new Date(r.visitDate.replace(/(\d+) (\w+) (\d+)/, '$2 $1 $3')),
}));

const PAGE_SIZE = 10;

const DATE_RANGE_OPTIONS = [
  'All Time', 'Today', 'Last 7 Days', 'Last Month',
  'Last 3 Months', 'Last 6 Months', 'Last 9 Months',
  'This Month', 'This Year',
];

/* ── Print modal ─────────────────────────────────────────────────────────── */
const PrintModal: React.FC<{ type:string; rec:PatientRecord; onClose:()=>void }> = ({ type, rec, onClose }) => (
  <div className="rc-modal-backdrop" onClick={onClose}>
    <div className="rc-modal rc-modal-lg" onClick={e=>e.stopPropagation()}>
      <div className="rc-modal-header">
        <div className="rc-modal-title">{type==='printInvoice'?'Invoice':'Prescription'} — {rec.patientName}</div>
        <button className="rc-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="rc-modal-body">
        <div style={{ border:'2px solid var(--border)',borderRadius:'var(--radius-sm)',padding:24 }}>
          <div style={{ fontWeight:900,fontSize:22,color:'var(--mineral-700)',marginBottom:4 }}>Vexoo Hospital</div>
          <div style={{ fontSize:12.5,color:'var(--muted)',marginBottom:18 }}>
            {type==='printInvoice'?'Tax Invoice':'Prescription'} · {rec.visitDate}
          </div>
          {[['Patient',rec.patientName],['Doctor',rec.doctor],
            ...(type==='printInvoice'?[['Amount',`₹${rec.invoiceAmt.toLocaleString('en-IN')}`]]:[])
          ].map(([k,v])=>(
            <div key={k} style={{ display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--line)',fontSize:13 }}>
              <span style={{ color:'var(--muted)' }}>{k}</span>
              <span style={{ fontWeight:700 }}>{v}</span>
            </div>
          ))}
          {type==='printPresc'&&(
            <>
              <div style={{ marginTop:14,fontSize:13.5,fontWeight:700,marginBottom:8 }}>Rx:</div>
              <div style={{ fontSize:14,lineHeight:1.8 }}>{rec.prescription}</div>
              {rec.testsRecommended&&(
                <div style={{ marginTop:10,fontSize:13,color:'var(--muted)' }}>
                  <strong>Tests:</strong> {rec.testsRecommended}
                </div>
              )}
            </>
          )}
          {type==='printInvoice'&&(
            <div style={{ marginTop:16,textAlign:'center',color:'var(--green)',fontWeight:800,fontSize:15 }}>✓ PAID IN FULL</div>
          )}
        </div>
      </div>
      <div className="rc-modal-footer">
        <button className="rc-btn-secondary" onClick={onClose}>Close</button>
        <button className="rc-btn-primary" onClick={()=>{window.print();onClose();}}>🖨️ Print</button>
      </div>
    </div>
  </div>
);

/* ── Main ─────────────────────────────────────────────────────────────────── */
export const Reports: React.FC<Partial<AppState>> = () => {
  const [dateRange,    setDateRange]    = useState('All Time');
  const [filterDoctor, setFilterDoctor] = useState('All Doctors');
  const [page,         setPage]         = useState(1);
  const [showModal,    setShowModal]    = useState<{type:string;rec:PatientRecord}|null>(null);

  const now = new Date();

  const inRange = (d: Date): boolean => {
    if (dateRange==='All Time')       return true;
    if (dateRange==='Today')          return d.toDateString()===now.toDateString();
    if (dateRange==='Last 7 Days')    return (now.getTime()-d.getTime()) <= 7*86400000;
    if (dateRange==='Last Month')     return (now.getTime()-d.getTime()) <= 30*86400000;
    if (dateRange==='Last 3 Months')  return (now.getTime()-d.getTime()) <= 90*86400000;
    if (dateRange==='Last 6 Months')  return (now.getTime()-d.getTime()) <= 180*86400000;
    if (dateRange==='Last 9 Months')  return (now.getTime()-d.getTime()) <= 270*86400000;
    if (dateRange==='This Month')     return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
    if (dateRange==='This Year')      return d.getFullYear()===now.getFullYear();
    return true;
  };

  const filtered = RECORDS.filter(r => {
    const mD = filterDoctor==='All Doctors' || r.doctor===filterDoctor;
    const mR = inRange(r.dateObj);
    return mD && mR;
  });

  const totalRevenue = filtered.reduce((s,r)=>s+r.invoiceAmt,0);
  const pages        = Math.ceil(filtered.length/PAGE_SIZE);
  const pageData     = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const handleAction = (type:string, rec:PatientRecord) => {
    if (type==='waInvoice')  { alert(`WhatsApp Invoice sent to ${rec.patientName}`); return; }
    if (type==='waPresc')    { alert(`WhatsApp Prescription sent to ${rec.patientName}`); return; }
    setShowModal({ type, rec });
  };

  const resetFilters = () => { setDateRange('All Time'); setFilterDoctor('All Doctors'); setPage(1); };
  const setFilter    = (fn:()=>void) => { fn(); setPage(1); };

  return (
    <div className="rc-scroll rc-fade">
      <div className="rc-content">
        {/* Title */}
        <div>
          <div style={{ fontFamily:"'Fraunces',Georgia,serif",fontSize:24,fontWeight:400,letterSpacing:'-0.03em',color:'var(--ink-900)',marginBottom:4 }}>
            Patient Reports
          </div>
          <div style={{ fontSize:13.5,color:'var(--ink-500)' }}>View and manage patient visit records, prescriptions and invoices.</div>
        </div>

        {/* ── Custom Filter Card — above the records table ── */}
        <div className="rc-card" style={{ padding:'20px 24px' }}>
          <div style={{ fontWeight:700,marginBottom:16,color:'var(--ink-700)',letterSpacing:'0.04em',textTransform:'uppercase' as const,fontSize:11 }}>Filter Records</div>
          <div style={{ display:'flex',gap:14,flexWrap:'wrap',alignItems:'flex-end' }}>
            {/* Date Range */}
            <div>
              <div style={{ fontSize:11,fontWeight:600,color:'var(--ink-500)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6 }}>Date Range</div>
              <select className="rc-filter-select" value={dateRange}
                onChange={e=>setFilter(()=>setDateRange(e.target.value))}>
                {DATE_RANGE_OPTIONS.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>

            {/* Doctor */}
            <div>
              <div style={{ fontSize:11,fontWeight:600,color:'var(--ink-500)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6 }}>Doctor</div>
              <select className="rc-filter-select" value={filterDoctor}
                onChange={e=>setFilter(()=>setFilterDoctor(e.target.value))}>
                <option>All Doctors</option>
                {DOCTORS.map(d=><option key={d}>{d}</option>)}
              </select>
            </div>

            {/* Reset */}
            <button className="rc-btn-secondary" onClick={resetFilters}
              style={{ display:'inline-flex',alignItems:'center',gap:7,height:44,marginTop:'auto' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
              </svg>
              Reset
            </button>
          </div>

          {/* Active filter chips */}
          {(dateRange!=='All Time' || filterDoctor!=='All Doctors') && (
            <div style={{ marginTop:12,display:'flex',gap:8,flexWrap:'wrap' }}>
              {dateRange!=='All Time' && (
                <span style={{ background:'var(--mineral-100)',color:'var(--mineral-700)',fontSize:12,fontWeight:600,padding:'3px 10px',borderRadius:999,display:'inline-flex',alignItems:'center',gap:6 }}>
                  📅 {dateRange}
                  <button onClick={()=>setFilter(()=>setDateRange('All Time'))} style={{ border:'none',background:'transparent',cursor:'pointer',color:'var(--mineral-700)',fontWeight:800,fontSize:14,padding:0,lineHeight:1 }}>×</button>
                </span>
              )}
              {filterDoctor!=='All Doctors' && (
                <span style={{ background:'var(--bl)',color:'var(--blue)',fontSize:12,fontWeight:600,padding:'3px 10px',borderRadius:999,display:'inline-flex',alignItems:'center',gap:6 }}>
                  🩺 {filterDoctor}
                  <button onClick={()=>setFilter(()=>setFilterDoctor('All Doctors'))} style={{ border:'none',background:'transparent',cursor:'pointer',color:'var(--blue)',fontWeight:800,fontSize:14,padding:0,lineHeight:1 }}>×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Summary stat cards ── */}
        <div className="rc-stat-row" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
          <div className="rc-stat-card s-mineral">
            <div className="rc-stat-label">Total patients</div>
            <div className="rc-stat-value">{filtered.length}</div>
          </div>
          <div className="rc-stat-card s-mineral">
            <div className="rc-stat-label">Visited today</div>
            <div className="rc-stat-value">{filtered.filter(r=>r.dateObj.toDateString()===now.toDateString()).length}</div>
          </div>
          <div className="rc-stat-card s-blue">
            <div className="rc-stat-label">Prescriptions</div>
            <div className="rc-stat-value">{filtered.length}</div>
          </div>
          <div className="rc-stat-card s-amber">
            <div className="rc-stat-label">Revenue</div>
            <div className="rc-stat-value" style={{ fontSize:32 }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* ── Patient Records TABLE ── */}
        <div className="rc-card" style={{ padding:0 }}>
          <div style={{ padding:'16px 24px',borderBottom:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
            <div style={{ fontFamily:"'Fraunces',Georgia,serif",fontSize:18,fontWeight:400,letterSpacing:'-0.02em' }}>
              Patient Records — Prescriptions &amp; Invoices
            </div>
            <span style={{ fontSize:13,color:'var(--ink-500)',fontWeight:500 }}>
              {filtered.length} record{filtered.length!==1?'s':''}
            </span>
          </div>

          {filtered.length===0 ? (
            <div className="rc-empty">No records match the selected filters.</div>
          ) : (
            <>
              <div style={{ overflowX:'auto' }}>
                <table className="rc-table">
                  <thead>
                    <tr>
                      <th className="rc-th">Patient</th>
                      <th className="rc-th">Doctor</th>
                      <th className="rc-th">Visit Date</th>
                      <th className="rc-th">Invoice Amount</th>
                      <th className="rc-th" style={{ textAlign:'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map(rec=>(
                      <tr key={rec.id} className="rc-tr">
                        <td className="rc-td">
                          <div style={{ display:'flex',alignItems:'center',gap:11 }}>
                            <div style={{ width:36,height:36,borderRadius:9,background:'var(--mineral-100)',color:'var(--mineral-700)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,flexShrink:0 }}>
                              {rec.patientName.split(' ').map(n=>n[0]).join('').slice(0,2)}
                            </div>
                            <span style={{ fontWeight:600,color:'var(--ink-900)' }}>{rec.patientName}</span>
                          </div>
                        </td>
                        <td className="rc-td" style={{ color:'var(--ink-600)' }}>{rec.doctor}</td>
                        <td className="rc-td" style={{ color:'var(--ink-500)',fontSize:13 }}>{rec.visitDate}</td>
                        <td className="rc-td">
                          <span style={{ fontWeight:700,fontSize:14,color:'var(--mineral-700)' }}>
                            ₹{rec.invoiceAmt.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="rc-td" style={{ textAlign:'right' }}>
                          <EllipsisMenu
                            onPrintInvoice    ={()=>handleAction('printInvoice', rec)}
                            onWAInvoice       ={()=>handleAction('waInvoice',    rec)}
                            onPrintPrescription={()=>handleAction('printPresc',  rec)}
                            onWAPrescription  ={()=>handleAction('waPresc',      rec)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ padding:'14px 24px',borderTop:'1px solid var(--line)',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <span style={{ fontSize:13,color:'var(--ink-500)' }}>
                  Showing {Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length} records
                </span>
                {pages>1&&(
                  <div style={{ display:'flex',gap:6,alignItems:'center' }}>
                    <button className="rc-btn-outline" style={{ fontSize:12,padding:'4px 10px' }}
                      disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
                    {Array.from({length:pages},(_,i)=>i+1).map(n=>(
                      <button key={n} onClick={()=>setPage(n)} style={{
                        width:30,height:30,borderRadius:8,fontWeight:600,fontSize:12.5,cursor:'pointer',fontFamily:'inherit',
                        border:n===page?'1.5px solid var(--mineral-700)':'1.5px solid var(--border)',
                        background:n===page?'var(--mineral-700)':'var(--surface)',
                        color:n===page?'white':'var(--text2)',
                      }}>{n}</button>
                    ))}
                    <button className="rc-btn-outline" style={{ fontSize:12,padding:'4px 10px' }}
                      disabled={page===pages} onClick={()=>setPage(p=>p+1)}>Next →</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showModal&&<PrintModal type={showModal.type} rec={showModal.rec} onClose={()=>setShowModal(null)} />}
    </div>
  );
};
