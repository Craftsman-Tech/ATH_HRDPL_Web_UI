import React, { useState, useMemo, useEffect } from 'react';
import { SvgIcon } from '../shared/HaHelpers';

type Period = 'weekly' | 'monthly' | 'yearly';
type FilterCat = 'datetime' | 'department' | 'doctor' | 'visittype' | 'payer' | 'payment' | 'pharmacy' | 'labdiag';
interface AppliedFilter { id: string; label: string; value: string; }

const ANALYTICS_DATA = {
  revenue: {
    weekly:  { labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],       values:[8400,9200,7800,11000,10500,6800,4200],   total:'₹4,200',  change:'↑ 4.2% vs last week' },
    monthly: { labels:['Oct','Nov','Dec','Jan','Feb','Mar','Apr'],        values:[42000,47000,51000,38000,54000,59000,62000], total:'₹62,000', change:'↑ 5.1% vs Mar'       },
    yearly:  { labels:['2022','2023','2024','2025','2026 YTD'],          values:[420000,510000,580000,640000,240000],         total:'₹6.4L',   change:'↑ 10.3% vs 2024'     },
  },
  departments:[
    {name:'General Medicine',rev:'₹2.35 Cr',pct:28,color:'var(--primary)'},{name:'Orthopaedics',rev:'₹1.85 Cr',pct:22,color:'var(--blue)'},
    {name:'Dermatology',rev:'₹1.25 Cr',pct:15,color:'var(--purple)'},{name:'ENT',rev:'₹0.95 Cr',pct:11,color:'var(--amber)'},{name:'Others',rev:'₹2.05 Cr',pct:24,color:'var(--green)'},
  ],
  payers:[
    {name:'Self Pay',rev:'₹4.20 Cr',pct:50,color:'var(--primary)'},{name:'Insurance',rev:'₹2.60 Cr',pct:31,color:'var(--blue)'},
    {name:'TPA',rev:'₹1.10 Cr',pct:13,color:'var(--amber)'},{name:'Corporate',rev:'₹0.55 Cr',pct:6,color:'var(--purple)'},
  ],
  paymentModes:[
    {name:'Cash',pct:38,color:'var(--primary)'},{name:'UPI / Online',pct:32,color:'var(--blue)'},
    {name:'Card',pct:18,color:'var(--amber)'},{name:'Insurance',pct:12,color:'var(--purple)'},
  ],
  visits:{
    weekly:  {total:54,  doctors:[{name:'Dr. Chen',count:18,color:'var(--primary)'},{name:'Dr. Patel',count:22,color:'var(--amber)'},{name:'Dr. Kim',count:14,color:'var(--green)'}]},
    monthly: {total:231, doctors:[{name:'Dr. Chen',count:78,color:'var(--primary)'},{name:'Dr. Patel',count:91,color:'var(--amber)'},{name:'Dr. Kim',count:62,color:'var(--green)'}]},
    yearly:  {total:2630,doctors:[{name:'Dr. Chen',count:890,color:'var(--primary)'},{name:'Dr. Patel',count:1020,color:'var(--amber)'},{name:'Dr. Kim',count:720,color:'var(--green)'}]},
  },
};

const DOCTOR_WEIGHTS: Record<string,number> = {'Dr. Chen':0.34,'Dr. Patel':0.39,'Dr. Kim':0.27};
function presetToPeriod(p: string): Period { if(p==='Today'||p==='Yesterday'||p==='This Week') return 'weekly'; if(p==='This Year'||p==='YTD vs Last YTD') return 'yearly'; return 'monthly'; }

function computeFilteredData(appliedFilters: AppliedFilter[], revPeriod: Period, visitPeriod: Period) {
  const dateFilter = appliedFilters.find(f=>f.id==='date');
  const effRevPeriod   = dateFilter?presetToPeriod(dateFilter.value):revPeriod;
  const effVisitPeriod = dateFilter?presetToPeriod(dateFilter.value):visitPeriod;
  const doctorFilter = appliedFilters.find(f=>f.id==='doctor');
  const selDoctors   = doctorFilter?doctorFilter.value.split(', '):[];
  const doctorMult   = selDoctors.length?selDoctors.reduce((s,d)=>s+(DOCTOR_WEIGHTS[d]??0),0):1;
  const baseRev = ANALYTICS_DATA.revenue[effRevPeriod];
  const revVals = baseRev.values.map(v=>Math.round(v*doctorMult));
  const totalRev = revVals[revVals.length-1];
  const revLabel = effRevPeriod==='yearly'?`₹${(totalRev/100000).toFixed(1)}L`:`₹${totalRev.toLocaleString()}`;
  const visitTypeFilter = appliedFilters.find(f=>f.id==='visit');
  const selTypes = visitTypeFilter?visitTypeFilter.value.split(', '):[];
  const hasConsult   = !selTypes.length||selTypes.includes('Consultation')||selTypes.includes('Follow-Up');
  const hasProcedure = !selTypes.length||selTypes.includes('Procedure');
  const hasOther     = !selTypes.length||selTypes.includes('Emergency')||selTypes.includes('Wellness Check');
  const consultRev   = hasConsult   ?Math.round(totalRev*0.46):0;
  const procedureRev = hasProcedure ?Math.round(totalRev*0.40):0;
  const otherRev     = hasOther     ?Math.round(totalRev*0.14):0;
  const deptFilter = appliedFilters.find(f=>f.id==='dept');
  let departments = ANALYTICS_DATA.departments;
  if(deptFilter){const s=deptFilter.value.split(', ');departments=departments.filter(d=>s.includes(d.name));const t=departments.reduce((s2,d)=>s2+d.pct,0)||1;departments=departments.map(d=>({...d,pct:Math.round((d.pct/t)*100)}));}
  const payerFilter = appliedFilters.find(f=>f.id==='payer');
  let payers = ANALYTICS_DATA.payers;
  if(payerFilter){const s=payerFilter.value.split(', ');payers=payers.filter(p=>s.includes(p.name));const t=payers.reduce((s2,p)=>s2+p.pct,0)||1;payers=payers.map(p=>({...p,pct:Math.round((p.pct/t)*100)}));}
  const paymentFilter = appliedFilters.find(f=>f.id==='payment');
  let paymentModes = ANALYTICS_DATA.paymentModes;
  if(paymentFilter){const s=paymentFilter.value.split(', ');paymentModes=paymentModes.filter(p=>s.includes(p.name));const t=paymentModes.reduce((s2,p)=>s2+p.pct,0)||1;paymentModes=paymentModes.map(p=>({...p,pct:Math.round((p.pct/t)*100)}));}
  const baseVisit = ANALYTICS_DATA.visits[effVisitPeriod];
  const visitsDoc = selDoctors.length?baseVisit.doctors.filter(d=>selDoctors.includes(d.name)):baseVisit.doctors;
  const visitsTotal = visitsDoc.reduce((s,d)=>s+d.count,0);
  const hasPharmacy = !selTypes.length||selTypes.includes('Pharmacy');
  const hasLab      = !selTypes.length||selTypes.includes('Lab & Diagnostics');
  const pharmacyRev = hasPharmacy?Math.round(totalRev*0.18):0;
  const labRev      = hasLab     ?Math.round(totalRev*0.12):0;
  return { effRevPeriod, effVisitPeriod, revData:{labels:baseRev.labels,values:revVals,total:revLabel,change:doctorMult<1?`Filtered · ${Math.round(doctorMult*100)}% of total`:baseRev.change}, kpis:{total:revLabel,totalSub:doctorMult<1?`Filtered — ${selDoctors.join(', ')}`:'↑ 5.1% vs last period',consult:`₹${consultRev.toLocaleString()}`,procedure:`₹${procedureRev.toLocaleString()}`,other:`₹${otherRev.toLocaleString()}`,pharmacy:`₹${pharmacyRev.toLocaleString()}`,lab:`₹${labRev.toLocaleString()}`}, departments, payers, paymentModes, visits:{total:visitsTotal,doctors:visitsDoc} };
}

export const AnalyticsModule: React.FC = () => {
  const [revPeriod,   setRevPeriod]   = useState<Period>('monthly');
  const [visitPeriod, setVisitPeriod] = useState<Period>('monthly');
  const [showFilter,  setShowFilter]  = useState(false);
  const [filterCat,   setFilterCat]   = useState<FilterCat>('datetime');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);
  const [tmpDatePreset, setTmpDatePreset] = useState('This Month');
  const [tmpDateFrom,   setTmpDateFrom]   = useState('2026-06-01');
  const [tmpDateTo,     setTmpDateTo]     = useState('2026-06-30');
  const [tmpDepts,      setTmpDepts]      = useState<string[]>([]);
  const [tmpDoctors,    setTmpDoctors]    = useState<string[]>([]);
  const [tmpVisitTypes, setTmpVisitTypes] = useState<string[]>([]);
  const [tmpPayers,     setTmpPayers]     = useState<string[]>([]);
  const [tmpPayModes,   setTmpPayModes]   = useState<string[]>([]);

  const fd = useMemo(() => computeFilteredData(appliedFilters,revPeriod,visitPeriod), [appliedFilters,revPeriod,visitPeriod]);
  useEffect(() => { if(appliedFilters.find(f=>f.id==='date')){setRevPeriod(fd.effRevPeriod);setVisitPeriod(fd.effVisitPeriod);} }, [appliedFilters,fd.effRevPeriod,fd.effVisitPeriod]);

  const maxRev   = Math.max(...fd.revData.values,1);
  const maxVisit = Math.max(...fd.visits.doctors.map(d=>d.count),1);

  const DEPTS=['General Medicine','Orthopaedics','Dermatology','ENT','Cardiology','Paediatrics','Others'];
  const DOCTORS=['Dr. Chen','Dr. Patel','Dr. Kim'];
  const VISIT_TYPES=['Consultation','Follow-Up','Procedure','Emergency','Wellness Check'];
  const PAYER_TYPES=['Self Pay','Insurance','TPA','Corporate'];
  const PAY_MODES=['Cash','UPI / Online','Card','Insurance / TPA'];
  const DATE_PRESETS=['Today','Yesterday','This Week','This Month','This Quarter','This Year','Custom Range'];
  const periodLabel: Record<Period,string>={weekly:'Weekly',monthly:'Monthly',yearly:'Yearly'};

  const openFilter = () => { setTmpDatePreset('This Month');setTmpDateFrom('2026-06-01');setTmpDateTo('2026-06-30');setTmpDepts([]);setTmpDoctors([]);setTmpVisitTypes([]);setTmpPayers([]);setTmpPayModes([]);setShowFilter(true); };
  const applyFilter = () => {
    const filters: AppliedFilter[] = [];
    filters.push({id:'date',label:'Date',value:tmpDatePreset==='Custom Range'?`${tmpDateFrom} → ${tmpDateTo}`:tmpDatePreset});
    if(tmpDepts.length)      filters.push({id:'dept',    label:'Department',value:tmpDepts.join(', ')});
    if(tmpDoctors.length)    filters.push({id:'doctor',  label:'Doctor',    value:tmpDoctors.join(', ')});
    if(tmpVisitTypes.length) filters.push({id:'visit',   label:'Visit Type',value:tmpVisitTypes.join(', ')});
    if(tmpPayers.length)     filters.push({id:'payer',   label:'Payer',     value:tmpPayers.join(', ')});
    if(tmpPayModes.length)   filters.push({id:'payment', label:'Payment',   value:tmpPayModes.join(', ')});
    setAppliedFilters(filters); setShowFilter(false);
  };
  const toggleItem = (arr: string[], set: (v:string[])=>void, item: string) => set(arr.includes(item)?arr.filter(x=>x!==item):[...arr,item]);

  const dropdownStyle: React.CSSProperties = { padding:'7px 32px 7px 14px', borderRadius:9, border:'1px solid var(--border)', background:'var(--bg)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', color:'var(--text)', outline:'none', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center' };

  const handleExport = () => {
    const filterSummary = appliedFilters.length?appliedFilters.map(f=>`${f.label}: ${f.value}`).join(' | '):'No filters applied — showing all data';
    const html = `<!DOCTYPE html><html><head><title>Revenue Report — Vexoo</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#1a2540;}h1{font-size:22px;}h2{font-size:14px;color:#0d9488;border-bottom:2px solid #e6faf8;padding-bottom:6px;margin-top:26px;margin-bottom:12px;}.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:8px;}.kpi{background:#f0f9f6;border-radius:10px;padding:14px 16px;}.kpi-lbl{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;}.kpi-val{font-size:22px;font-weight:800;color:#0d9488;}.kpi-sub{font-size:11px;color:#0d9488;margin-top:3px;}table{width:100%;border-collapse:collapse;font-size:13px;}th{background:#f4f8f7;padding:8px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;}td{padding:9px 12px;border-bottom:1px solid #f0f0f0;}.filter-box{background:#fffef5;border:1px solid #fde68a;border-radius:10px;padding:12px 16px;margin-bottom:20px;font-size:13px;}.footer{margin-top:40px;color:#94a3b8;font-size:11px;border-top:1px solid #f0f0f0;padding-top:12px;}</style></head><body>
    <h1>Revenue Analytics Report — Vexoo</h1>
    <div style="color:#64748b;font-size:13px;margin-bottom:20px;">Generated on ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>
    <div class="filter-box"><strong>Applied Filters:</strong> ${filterSummary}</div>
    <h2>1. Revenue Summary</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-lbl">Total OP Revenue</div><div class="kpi-val">${fd.kpis.total}</div><div class="kpi-sub">${fd.kpis.totalSub}</div></div>
      <div class="kpi"><div class="kpi-lbl">Consultation Revenue</div><div class="kpi-val">${fd.kpis.consult}</div></div>
      <div class="kpi"><div class="kpi-lbl">Procedure Revenue</div><div class="kpi-val">${fd.kpis.procedure}</div></div>
      <div class="kpi"><div class="kpi-lbl">Other Charges</div><div class="kpi-val">${fd.kpis.other}</div></div>
    </div>
    <h2>2. Revenue Trend (${periodLabel[fd.effRevPeriod]})</h2>
    <table><tr><th>Period</th><th>Revenue</th></tr>${fd.revData.labels.map((l,i)=>`<tr><td>${l}</td><td>₹${fd.revData.values[i].toLocaleString()}</td></tr>`).join('')}</table>
    <h2>3. Doctor-Wise Patient Visits</h2>
    <table><tr><th>Doctor</th><th>Visits</th><th>% of Total</th></tr>${fd.visits.doctors.map(d=>`<tr><td>${d.name}</td><td>${d.count}</td><td>${fd.visits.total?Math.round((d.count/fd.visits.total)*100):0}%</td></tr>`).join('')}</table>
    <div class="footer">Vexoo · Confidential — For internal hospital use only</div></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  const CheckList = ({ items, selected, onChange }: { items:string[]; selected:string[]; onChange:(v:string[])=>void }) => (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {items.map(item => {
        const checked = selected.includes(item);
        return (
          <div key={item} onClick={() => toggleItem(selected,onChange,item)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, cursor:'pointer', border:`1.5px solid ${checked?'var(--primary)':'var(--border)'}`, background:checked?'var(--primary-light)':'white', transition:'all 0.13s' }}>
            <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${checked?'var(--primary)':'#d1d5db'}`, background:checked?'var(--primary)':'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {checked && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5L4 7.5 8.5 2" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{ fontSize:13.5, fontWeight:checked?600:400, color:checked?'var(--primary)':'var(--text)' }}>{item}</span>
          </div>
        );
      })}
    </div>
  );

  const totalCriteria = [tmpDepts,tmpDoctors,tmpVisitTypes,tmpPayers,tmpPayModes].flat().length;

  return (
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div><div className="ha-section-title">Analytics & Reports</div><div className="ha-section-sub">OP Revenue Dashboard · Hospital performance overview</div></div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={openFilter} style={{ display:'flex', alignItems:'center', gap:7, background:appliedFilters.length?'var(--primary)':'var(--card)', color:appliedFilters.length?'white':'var(--text-muted)', border:appliedFilters.length?'none':'1px solid var(--border)', borderRadius:9, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            <SvgIcon path="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A1 1 0 0018.95 4H5.04a1 1 0 00-.79 1.61z" size={14} color="currentColor" />
            Custom Filter
            {appliedFilters.length>0 && (<span style={{ background:'white', color:'var(--primary)', borderRadius:20, padding:'1px 8px', fontSize:11, fontWeight:800, marginLeft:2 }}>{appliedFilters.length}</span>)}
          </button>
          <button onClick={handleExport} style={{ display:'flex', alignItems:'center', gap:7, background:'var(--card)', color:'var(--text-muted)', border:'1px solid var(--border)', borderRadius:9, padding:'8px 16px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={14} color="currentColor" />
            Export
          </button>
        </div>
      </div>

      {appliedFilters.length>0 && (
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16, padding:'10px 16px', background:'var(--primary-light)', borderRadius:12, alignItems:'center', border:'1px solid var(--primary)' }}>
          <span style={{ fontSize:12, fontWeight:700, color:'var(--primary)', flexShrink:0 }}>Filters Applied ({appliedFilters.length}):</span>
          {appliedFilters.map(f => (
            <span key={f.id} style={{ display:'flex', alignItems:'center', gap:5, background:'white', border:'1px solid var(--primary)', borderRadius:20, padding:'3px 12px', fontSize:12, fontWeight:500, color:'var(--primary)' }}>
              <strong>{f.label}:</strong>&nbsp;{f.value}
              <button onClick={()=>setAppliedFilters(prev=>prev.filter(x=>x.id!==f.id))} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--primary)', padding:0, marginLeft:4, lineHeight:1, fontSize:15, fontWeight:700 }}>×</button>
            </span>
          ))}
          <button onClick={() => setAppliedFilters([])} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--rose)', fontSize:12, fontWeight:700, marginLeft:'auto' }}>✕ Clear All</button>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:12 }}>
        {([['Total OP Revenue',fd.kpis.total,fd.kpis.totalSub,'var(--primary-light)','var(--primary)'],['Consultation Revenue',fd.kpis.consult,'46% of filtered','var(--blue-light)','var(--blue)'],['Procedure Revenue',fd.kpis.procedure,'40% of filtered','var(--amber-light)','var(--amber)']] as [string,string,string,string,string][]).map(([l,v,sub,bg,c]) => (
          <div key={l} className="ha-card" style={{ background:bg, border:'none' }}>
            <div style={{ fontSize:11, color:c, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c, letterSpacing:'-0.5px', marginBottom:4 }}>{v}</div>
            <div style={{ fontSize:12, color:c, opacity:0.8 }}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
        {([['Other Charges',fd.kpis.other,'14% of filtered','var(--green-light)','var(--green)'],['Pharmacy Revenue',fd.kpis.pharmacy,'18% of filtered','var(--purple-light)','var(--purple)'],['Lab & Diagnostics Rev.',fd.kpis.lab,'12% of filtered','var(--rose-light)','var(--rose)']] as [string,string,string,string,string][]).map(([l,v,sub,bg,c]) => (
          <div key={l} className="ha-card" style={{ background:bg, border:'none' }}>
            <div style={{ fontSize:11, color:c, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c, letterSpacing:'-0.5px', marginBottom:4 }}>{v}</div>
            <div style={{ fontSize:12, color:c, opacity:0.8 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div className="ha-card" style={{ marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div><div style={{ fontWeight:700, fontSize:15 }}>Revenue Trend</div><div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>{fd.revData.total} · {fd.revData.change}</div></div>
          <select value={revPeriod} onChange={e=>setRevPeriod(e.target.value as Period)} style={dropdownStyle}><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:150 }}>
          {fd.revData.values.map((v,i) => (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:500 }}>{fd.effRevPeriod==='yearly'?`₹${(v/100000).toFixed(1)}L`:`₹${(v/1000).toFixed(0)}k`}</div>
              <div style={{ width:'100%', height:`${(v/maxRev)*120}px`, borderRadius:'6px 6px 0 0', background:'var(--primary)', opacity:i===fd.revData.values.length-1?1:0.3, transition:'height 0.4s ease' }} />
              <span style={{ fontSize:10.5, color:'var(--text-muted)', textAlign:'center' }}>{fd.revData.labels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <div className="ha-card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Revenue by Department</div>
          {fd.departments.length===0?<div style={{ color:'var(--text-muted)', fontSize:13, padding:'20px 0', textAlign:'center' }}>No departments match the filter</div>:fd.departments.map(d=>(
            <div key={d.name} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}><span style={{ fontSize:13 }}>{d.name}</span><span style={{ fontSize:13, fontWeight:700, color:d.color }}>{d.rev} <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:400 }}>({d.pct}%)</span></span></div>
              <div style={{ background:'#f1f5f9', borderRadius:4, height:8, overflow:'hidden' }}><div style={{ width:`${d.pct}%`, height:'100%', background:d.color, borderRadius:4, transition:'width 0.4s' }} /></div>
            </div>
          ))}
        </div>
        <div className="ha-card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Revenue by Payer Type</div>
          {fd.payers.length===0?<div style={{ color:'var(--text-muted)', fontSize:13, padding:'20px 0', textAlign:'center' }}>No payer types match the filter</div>:fd.payers.map(p=>(
            <div key={p.name} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}><span style={{ fontSize:13 }}>{p.name}</span><span style={{ fontSize:13, fontWeight:700, color:p.color }}>{p.rev} <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:400 }}>({p.pct}%)</span></span></div>
              <div style={{ background:'#f1f5f9', borderRadius:4, height:8, overflow:'hidden' }}><div style={{ width:`${p.pct}%`, height:'100%', background:p.color, borderRadius:4, transition:'width 0.4s' }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div className="ha-card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Payment Mode Split</div>
          {fd.paymentModes.length===0?<div style={{ color:'var(--text-muted)', fontSize:13, padding:'20px 0', textAlign:'center' }}>No payment modes match the filter</div>:fd.paymentModes.map(p=>(
            <div key={p.name} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}><span style={{ fontSize:13 }}>{p.name}</span><span style={{ fontSize:13, fontWeight:700, color:p.color }}>{p.pct}%</span></div>
              <div style={{ background:'#f1f5f9', borderRadius:4, height:8, overflow:'hidden' }}><div style={{ width:`${p.pct}%`, height:'100%', background:p.color, borderRadius:4, transition:'width 0.4s' }} /></div>
            </div>
          ))}
        </div>
        <div className="ha-card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <div style={{ fontWeight:700, fontSize:14 }}>Patient Visits — Doctor Wise</div>
            <select value={visitPeriod} onChange={e=>setVisitPeriod(e.target.value as Period)} style={{...dropdownStyle,padding:'5px 28px 5px 10px',fontSize:12}}><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>
          </div>
          <div style={{ background:'var(--primary-light)', borderRadius:10, padding:'10px 14px', marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:12, color:'var(--primary)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Total Visits</span>
            <span style={{ fontSize:22, fontWeight:800, color:'var(--primary)' }}>{fd.visits.total.toLocaleString()}</span>
          </div>
          {fd.visits.doctors.length===0?<div style={{ color:'var(--text-muted)', fontSize:13, padding:'16px 0', textAlign:'center' }}>No doctors match the filter</div>:fd.visits.doctors.map(d=>(
            <div key={d.name} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}><span style={{ fontSize:13, fontWeight:500 }}>{d.name}</span><span style={{ fontSize:13, fontWeight:700, color:d.color }}>{d.count.toLocaleString()} <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:400 }}>({fd.visits.total?Math.round((d.count/fd.visits.total)*100):0}%)</span></span></div>
              <div style={{ background:'#f1f5f9', borderRadius:4, height:8, overflow:'hidden' }}><div style={{ width:`${(d.count/maxVisit)*100}%`, height:'100%', background:d.color, borderRadius:4, transition:'width 0.4s ease' }} /></div>
            </div>
          ))}
        </div>
      </div>

      {showFilter && (
        <>
          <div onClick={()=>setShowFilter(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:100 }} />
          <div onClick={e=>e.stopPropagation()} style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'white', borderRadius:18, width:700, maxWidth:'96vw', maxHeight:'88vh', display:'flex', flexDirection:'column', zIndex:101, boxShadow:'0 24px 80px rgba(0,0,0,0.25)', overflow:'hidden' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
              <div><div style={{ fontWeight:800, fontSize:17 }}>Custom Filter</div><div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>Select criteria — the entire dashboard updates on Apply</div></div>
              <button onClick={()=>setShowFilter(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, width:34, height:34, cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'190px 1fr', flex:1, overflow:'hidden', minHeight:0 }}>
              <div style={{ borderRight:'1px solid var(--border)', overflowY:'auto', background:'var(--bg)', padding:'10px 8px' }}>
                {([['datetime','📅','Date & Time'],['department','🏥','Department'],['doctor','👩‍⚕️','Doctor'],['visittype','📋','Service / Visit Type'],['payer','💳','Payer Type'],['payment','💰','Payment Mode'],['pharmacy','💊','Pharmacy'],['labdiag','🧪','Lab & Diagnostics']] as [FilterCat,string,string][]).map(([id,icon,label]) => (
                  <button key={id} onClick={()=>setFilterCat(id)} style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'10px 13px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:filterCat===id?700:400, background:filterCat===id?'white':'transparent', color:filterCat===id?'var(--primary)':'var(--text-muted)', textAlign:'left', marginBottom:3, boxShadow:filterCat===id?'0 1px 4px rgba(0,0,0,0.08)':'none', transition:'all 0.13s' }}>
                    <span style={{ fontSize:15 }}>{icon}</span>{label}
                  </button>
                ))}
              </div>
              <div style={{ overflowY:'auto', padding:'20px 24px' }}>
                {filterCat==='datetime' && (
                  <div>
                    <div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Date Range</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:22 }}>
                      {DATE_PRESETS.map(p => (<button key={p} onClick={()=>setTmpDatePreset(p)} style={{ padding:'6px 14px', borderRadius:9, border:`1.5px solid ${tmpDatePreset===p?'var(--primary)':'var(--border)'}`, background:tmpDatePreset===p?'var(--primary)':'white', color:tmpDatePreset===p?'white':'var(--text-muted)', fontSize:12.5, fontWeight:tmpDatePreset===p?700:400, cursor:'pointer', fontFamily:'inherit' }}>{p}</button>))}
                    </div>
                    {tmpDatePreset==='Custom Range' && (
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:22 }}>
                        <div><div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, marginBottom:6 }}>From</div><input type="date" value={tmpDateFrom} onChange={e=>setTmpDateFrom(e.target.value)} style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', boxSizing:'border-box' }} /></div>
                        <div><div style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600, marginBottom:6 }}>To</div><input type="date" value={tmpDateTo} onChange={e=>setTmpDateTo(e.target.value)} style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', boxSizing:'border-box' }} /></div>
                      </div>
                    )}
                    <div style={{ fontWeight:700, fontSize:13.5, marginBottom:12 }}>Quick Presets</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>{['MTD vs Last MTD','QTD vs Last QTD','YTD vs Last YTD','Last 7 Days vs Prev 7 Days'].map(p=><button key={p} style={{ padding:'6px 13px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg)', fontSize:12, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)' }}>{p}</button>)}</div>
                  </div>
                )}
                {filterCat==='department' && <div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Select Departments</div><CheckList items={DEPTS} selected={tmpDepts} onChange={setTmpDepts} /></div>}
                {filterCat==='doctor'     && <div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Select Doctors</div><CheckList items={DOCTORS} selected={tmpDoctors} onChange={setTmpDoctors} /></div>}
                {filterCat==='visittype'  && <div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Select Visit Types</div><CheckList items={VISIT_TYPES} selected={tmpVisitTypes} onChange={setTmpVisitTypes} /></div>}
                {filterCat==='payer'      && <div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Select Payer Types</div><CheckList items={PAYER_TYPES} selected={tmpPayers} onChange={setTmpPayers} /></div>}
                {filterCat==='payment'    && <div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:14 }}>Select Payment Modes</div><CheckList items={PAY_MODES} selected={tmpPayModes} onChange={setTmpPayModes} /></div>}
                {filterCat==='pharmacy' && (<div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:8 }}>Pharmacy Revenue Filter</div><div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7, marginBottom:14 }}>Selecting "Pharmacy" from the Visit Type filter will isolate pharmacy revenue.</div><CheckList items={['Pharmacy Sales','Over-the-Counter','Controlled Substances']} selected={tmpVisitTypes} onChange={setTmpVisitTypes} /></div>)}
                {filterCat==='labdiag'  && (<div><div style={{ fontWeight:700, fontSize:13.5, marginBottom:8 }}>Lab & Diagnostics Revenue Filter</div><div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7, marginBottom:14 }}>Isolate revenue from diagnostics tests and lab panels.</div><CheckList items={['Blood Tests','Imaging','Pulmonary Function','Cardiac Tests','Microbiology']} selected={tmpVisitTypes} onChange={setTmpVisitTypes} /></div>)}
              </div>
            </div>
            <div style={{ padding:'14px 24px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0, background:'var(--bg)' }}>
              <span style={{ fontSize:12.5, color:'var(--text-muted)' }}>{totalCriteria>0?`${totalCriteria} criteria selected`:'No criteria selected'}</span>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={()=>{setTmpDepts([]);setTmpDoctors([]);setTmpVisitTypes([]);setTmpPayers([]);setTmpPayModes([]);setTmpDatePreset('This Month');}} style={{ padding:'9px 22px', borderRadius:10, border:'1px solid var(--border)', background:'white', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, color:'var(--text-muted)', fontWeight:500 }}>Reset</button>
                <button onClick={applyFilter} className="ha-action-btn">Apply Filter</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
