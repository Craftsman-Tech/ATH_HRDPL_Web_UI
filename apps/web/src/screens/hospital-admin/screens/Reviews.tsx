import React, { useState, useMemo } from 'react';
import { REVIEWS, RATING_LABELS } from '../data/mockHaData';
import type { PatientReview } from '../types/hospitaladmin.types';

function StarRating({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i<=value?'#f59e0b':'#e2e8f0'}>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ))}
    </div>
  );
}

export const ReviewsModule: React.FC = () => {
  const [filterDoc,    setFilterDoc]    = useState('All Doctors');
  const [filterStar,   setFilterStar]   = useState('All Ratings');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selected,     setSelected]     = useState<PatientReview | null>(null);

  const doctors  = ['All Doctors', ...Array.from(new Set(REVIEWS.map(r => r.doctor)))];
  const filtered = useMemo(() =>
    REVIEWS.filter(r =>
      (filterDoc==='All Doctors'||r.doctor===filterDoc) &&
      (filterStar==='All Ratings'||r.overallRating===Number(filterStar)) &&
      (filterStatus==='All'||r.status===filterStatus)
    ), [filterDoc, filterStar, filterStatus]);

  const avgOverall = (REVIEWS.reduce((s,r)=>s+r.overallRating,0)/REVIEWS.length).toFixed(1);
  const recPct     = Math.round((REVIEWS.filter(r=>r.recommend).length/REVIEWS.length)*100);
  const newCount   = REVIEWS.filter(r=>r.status==='New').length;

  const paramAvgs: Record<string,string> = {};
  for (const key of Object.keys(RATING_LABELS)) {
    const avg = REVIEWS.reduce((s,r)=>s+(r.ratings as Record<string,number>)[key],0)/REVIEWS.length;
    paramAvgs[key] = avg.toFixed(1);
  }

  const docSummary = Array.from(new Set(REVIEWS.map(r=>r.doctor))).map(doc => {
    const docRevs = REVIEWS.filter(r=>r.doctor===doc);
    const avg = (docRevs.reduce((s,r)=>s+r.overallRating,0)/docRevs.length).toFixed(1);
    return { doctor:doc, count:docRevs.length, avg };
  });

  const selectStyle: React.CSSProperties = { padding:'7px 28px 7px 12px', borderRadius:9, border:'1px solid var(--border)', background:'var(--bg)', fontSize:12.5, fontWeight:500, cursor:'pointer', fontFamily:'inherit', color:'var(--text)', outline:'none', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center' };
  const ratingBg  = (v: number) => v>=4?'var(--green-light)':v===3?'var(--amber-light)':'var(--rose-light)';
  const ratingCol = (v: number) => v>=4?'var(--green)':v===3?'var(--amber)':'var(--rose)';

  return (
    <>
    <div className="ha-content ha-fade">
      <div className="ha-section-head">
        <div><div className="ha-section-title">Reviews & Feedback</div><div className="ha-section-sub">Patient feedback received after hospital visits · Read-only</div></div>
        <div style={{ display:'flex', alignItems:'center', gap:6, background:'var(--amber-light)', border:'1px solid var(--amber)', borderRadius:10, padding:'6px 14px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--amber)"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          <span style={{ fontSize:12.5, fontWeight:700, color:'var(--amber)' }}>{newCount} new unread</span>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {([['Overall Rating',`${avgOverall} / 5`,'Based on all reviews','var(--amber-light)','var(--amber)'],['Total Reviews',String(REVIEWS.length),`${newCount} new`,'var(--primary-light)','var(--primary)'],['Recommend Hospital',`${recPct}%`,'Would recommend us','var(--green-light)','var(--green)'],['Avg Wait Time Score',`${paramAvgs.waitTime}/5`,'Across all visits','var(--blue-light)','var(--blue)']] as [string,string,string,string,string][]).map(([l,v,sub,bg,c]) => (
          <div key={l} className="ha-card" style={{ background:bg, border:'none' }}>
            <div style={{ fontSize:11, color:c, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c, letterSpacing:'-0.5px', marginBottom:3 }}>{v}</div>
            <div style={{ fontSize:12, color:c, opacity:0.75 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <div className="ha-card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Average Score by Parameter</div>
          {Object.entries(RATING_LABELS).map(([key, label]) => {
            const val = Number(paramAvgs[key]);
            return (
              <div key={key} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                  <span style={{ fontSize:13 }}>{label}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <StarRating value={Math.round(val)} size={12} />
                    <span style={{ fontSize:12, fontWeight:700, color:ratingCol(val), background:ratingBg(val), padding:'1px 8px', borderRadius:20 }}>{val}</span>
                  </div>
                </div>
                <div style={{ background:'#f1f5f9', borderRadius:4, height:7, overflow:'hidden' }}><div style={{ width:`${(val/5)*100}%`, height:'100%', background:ratingCol(val), borderRadius:4, transition:'width 0.4s' }} /></div>
              </div>
            );
          })}
        </div>
        <div className="ha-card">
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Doctor-wise Rating Summary</div>
          {docSummary.map(d => (
            <div key={d.doctor} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:'var(--primary)', flexShrink:0 }}>{d.doctor.split(' ').slice(0,2).map(n=>n[0]).join('')}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13.5 }}>{d.doctor}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>{d.count} review{d.count>1?'s':''}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:18, fontWeight:800, color:'var(--amber)' }}>{d.avg}</div>
                <StarRating value={Math.round(Number(d.avg))} size={12} />
              </div>
            </div>
          ))}
          <div style={{ marginTop:14, padding:'12px 14px', background:'var(--primary-light)', borderRadius:10 }}>
            <div style={{ fontSize:11.5, color:'var(--primary)', fontWeight:600, marginBottom:6 }}>DISTRIBUTION</div>
            {[5,4,3,2,1].map(star => {
              const cnt = REVIEWS.filter(r=>r.overallRating===star).length;
              const pct = Math.round((cnt/REVIEWS.length)*100);
              return (
                <div key={star} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                  <span style={{ fontSize:11, fontWeight:600, color:'var(--primary)', width:12 }}>{star}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <div style={{ flex:1, background:'rgba(255,255,255,0.5)', borderRadius:4, height:6, overflow:'hidden' }}><div style={{ width:`${pct}%`, height:'100%', background:'var(--primary)', borderRadius:4 }} /></div>
                  <span style={{ fontSize:11, color:'var(--primary)', fontWeight:600, width:28, textAlign:'right' }}>{cnt}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
        <span style={{ fontSize:12.5, fontWeight:600, color:'var(--text-muted)' }}>Filter:</span>
        <select value={filterDoc}    onChange={e=>setFilterDoc(e.target.value)}    style={selectStyle}>{doctors.map(d=><option key={d}>{d}</option>)}</select>
        <select value={filterStar}   onChange={e=>setFilterStar(e.target.value)}   style={selectStyle}><option>All Ratings</option>{[5,4,3,2,1].map(s=><option key={s} value={s}>{s} Stars</option>)}</select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={selectStyle}><option>All</option><option>New</option><option>Read</option></select>
        <span style={{ fontSize:12.5, color:'var(--text-muted)', marginLeft:'auto' }}>Showing {filtered.length} of {REVIEWS.length} reviews</span>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.length===0 && (<div className="ha-card" style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-muted)' }}><div style={{ fontSize:36, marginBottom:12 }}>⭐</div><div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>No reviews match this filter</div><div style={{ fontSize:13 }}>Try adjusting the filters above.</div></div>)}
        {filtered.map(r => (
          <div key={r.id} className="ha-card" style={{ borderLeft:`4px solid ${r.overallRating>=4?'var(--green)':r.overallRating===3?'var(--amber)':'var(--rose)'}`, cursor:'pointer' }} onClick={() => setSelected(r)}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:'var(--primary)', flexShrink:0 }}>{r.patient.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{r.patient} <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:400 }}>· {r.patientId}</span></div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{r.doctor} · {r.department} · {r.visitType} · {r.visitDate}</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                {r.status==='New' && (<span style={{ fontSize:10, fontWeight:800, padding:'2px 9px', borderRadius:20, background:'var(--primary)', color:'white' }}>NEW</span>)}
                <StarRating value={r.overallRating} size={15} />
                <span style={{ fontSize:14, fontWeight:800, color:'var(--amber)' }}>{r.overallRating}.0</span>
                <span style={{ fontSize:12, color:r.recommend?'var(--green)':'var(--rose)', fontWeight:600 }}>{r.recommend?'👍 Recommends':'👎 Does not recommend'}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:10 }}>
              {Object.entries(r.ratings).map(([key,val]) => (<span key={key} style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:ratingBg(val as number), color:ratingCol(val as number) }}>{RATING_LABELS[key]} {val}/5</span>))}
            </div>
            <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.7, background:'var(--bg)', padding:'10px 14px', borderRadius:10, border:'1px solid var(--border)' }}>"{r.comment}"</div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:10 }}>
              <span style={{ fontSize:11.5, color:'var(--text-muted)' }}>Received: {r.receivedDate}</span>
              <span style={{ fontSize:12, color:'var(--primary)', fontWeight:600 }}>Click to view details →</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {selected && (
      <>
        <div onClick={() => setSelected(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100 }} />
        <div onClick={e=>e.stopPropagation()} style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'white', borderRadius:18, width:600, maxWidth:'94vw', maxHeight:'90vh', overflowY:'auto', zIndex:101, boxShadow:'0 24px 80px rgba(0,0,0,0.2)' }}>
          <div style={{ padding:'22px 26px 18px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div><div style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>Review Detail</div><div style={{ fontSize:12.5, color:'var(--text-muted)' }}>Received: {selected.receivedDate}</div></div>
            <button onClick={() => setSelected(null)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, width:34, height:34, cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>✕</button>
          </div>
          <div style={{ padding:'22px 26px', display:'flex', flexDirection:'column', gap:18 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {([['Patient',`${selected.patient} (${selected.patientId})`],['Doctor',selected.doctor],['Department',selected.department],['Visit Type',selected.visitType],['Visit Date',selected.visitDate],['Status',selected.status]] as [string,string][]).map(([k,v]) => (
                <div key={k} style={{ background:'var(--bg)', borderRadius:10, padding:'10px 14px' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{k}</div>
                  <div style={{ fontSize:13.5, fontWeight:600, color:k==='Status'&&v==='New'?'var(--primary)':'var(--text)' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:20, background:selected.overallRating>=4?'var(--green-light)':selected.overallRating===3?'var(--amber-light)':'var(--rose-light)', borderRadius:14, padding:'16px 20px' }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:ratingCol(selected.overallRating), textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>Overall Rating</div>
                <div style={{ fontSize:36, fontWeight:900, color:ratingCol(selected.overallRating) }}>{selected.overallRating}.0</div>
              </div>
              <StarRating value={selected.overallRating} size={22} />
              <div style={{ marginLeft:'auto', textAlign:'right' }}>
                <div style={{ fontSize:11, fontWeight:700, color:selected.recommend?'var(--green)':'var(--rose)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>Recommendation</div>
                <div style={{ fontSize:16, fontWeight:800, color:selected.recommend?'var(--green)':'var(--rose)' }}>{selected.recommend?'👍 Yes, recommends':'👎 Does not recommend'}</div>
              </div>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Parameter-wise Ratings</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {Object.entries(selected.ratings).map(([key,val]) => (
                  <div key={key} style={{ padding:'12px 14px', background:'var(--bg)', borderRadius:10, border:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                      <span style={{ fontSize:12.5, fontWeight:600 }}>{RATING_LABELS[key]}</span>
                      <span style={{ fontSize:13, fontWeight:800, color:ratingCol(val as number), background:ratingBg(val as number), padding:'1px 9px', borderRadius:20 }}>{val}/5</span>
                    </div>
                    <div style={{ background:'#e2e8f0', borderRadius:4, height:6, overflow:'hidden' }}><div style={{ width:`${((val as number)/5)*100}%`, height:'100%', background:ratingCol(val as number), borderRadius:4 }} /></div>
                    <StarRating value={val as number} size={11} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Patient Comment</div>
              <div style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.8, background:'var(--bg)', padding:'16px 18px', borderRadius:12, border:'1px solid var(--border)', fontStyle:'italic' }}>"{selected.comment}"</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'var(--amber-light)', borderRadius:10, border:'1px solid var(--amber)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--amber)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              <span style={{ fontSize:12.5, color:'var(--amber)', fontWeight:600 }}>This feedback is read-only. Responses are managed by the patient communication team.</span>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
};
