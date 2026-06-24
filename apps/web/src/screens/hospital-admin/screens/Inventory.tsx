import React, { useState } from 'react';
import { Badge, SvgIcon, Th, Td } from '../shared/HaHelpers';
import { INV_DRUGS, INV_EQUIPMENT } from '../data/mockHaData';

type DrugItem  = typeof INV_DRUGS[0];
type EqItem    = typeof INV_EQUIPMENT[0];

function invDrugStatus(qty: number, min: number): 'Critical' | 'Low' | 'OK' {
  if (qty < min * 0.5) return 'Critical';
  if (qty < min)       return 'Low';
  return 'OK';
}
function eqBorderCol(s: string) {
  if (s === 'Online')  return 'var(--primary)';
  if (s === 'Warning') return 'var(--amber)';
  return 'var(--rose)';
}

export const InventoryModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drugs'|'equipment'>('drugs');
  const [drugs,     setDrugs]     = useState<DrugItem[]>(INV_DRUGS);
  const [equipment, setEquipment] = useState<EqItem[]>(INV_EQUIPMENT);
  const [openDrugMenu, setOpenDrugMenu] = useState<string|null>(null);
  const [openEqMenu,   setOpenEqMenu]   = useState<string|null>(null);
  const [showAddDrug, setShowAddDrug]   = useState(false);
  const [showAddEq,   setShowAddEq]     = useState(false);
  const [editingDrug, setEditingDrug]   = useState<DrugItem|null>(null);
  const [editingEq,   setEditingEq]     = useState<EqItem|null>(null);
  const [confirmDeleteDrug, setConfirmDeleteDrug] = useState<string|null>(null);
  const [confirmDeleteEq,   setConfirmDeleteEq]   = useState<string|null>(null);
  const [drugForm, setDrugForm] = useState({ name:'', category:'Cardiovascular', qty:'', min:'', max:'', unit:'tabs', expiry:'' });
  const [eqForm,   setEqForm]   = useState({ name:'', model:'', eqStatus:'Online', load:'0%', lastCalib:'', nextCalib:'', uptime:'100%', tests:'' });

  const drugOK       = drugs.filter(d => invDrugStatus(d.qty,d.min)==='OK').length;
  const drugLow      = drugs.filter(d => invDrugStatus(d.qty,d.min)==='Low').length;
  const drugCritical = drugs.filter(d => invDrugStatus(d.qty,d.min)==='Critical').length;
  const eqOnline     = equipment.filter(e => e.eqStatus==='Online').length;
  const eqWarning    = equipment.filter(e => e.eqStatus==='Warning').length;
  const eqOffline    = equipment.filter(e => e.eqStatus==='Offline').length;

  const openEditDrug = (d: DrugItem) => { setEditingDrug(d); setDrugForm({ name:d.name, category:d.category, qty:String(d.qty), min:String(d.min), max:String(d.max), unit:d.unit, expiry:d.expiry }); setOpenDrugMenu(null); };
  const saveDrug = () => {
    if (editingDrug) { setDrugs(prev => prev.map(d => d.id===editingDrug.id?{...d,name:drugForm.name,category:drugForm.category,qty:Number(drugForm.qty),min:Number(drugForm.min),max:Number(drugForm.max),unit:drugForm.unit,expiry:drugForm.expiry}:d)); setEditingDrug(null); }
    else { const newId='S-'+String(drugs.length+1).padStart(3,'0'); setDrugs(prev=>[...prev,{id:newId,name:drugForm.name,category:drugForm.category,qty:Number(drugForm.qty),min:Number(drugForm.min),max:Number(drugForm.max),unit:drugForm.unit,expiry:drugForm.expiry}]); setShowAddDrug(false); }
    setDrugForm({name:'',category:'Cardiovascular',qty:'',min:'',max:'',unit:'tabs',expiry:''});
  };
  const deleteDrug = (id: string) => { setDrugs(prev=>prev.filter(d=>d.id!==id)); setConfirmDeleteDrug(null); };

  const openEditEq = (e: EqItem) => { setEditingEq(e); setEqForm({name:e.name,model:e.model,eqStatus:e.eqStatus,load:e.load,lastCalib:e.lastCalib,nextCalib:e.nextCalib,uptime:e.uptime,tests:e.tests.join(', ')}); setOpenEqMenu(null); };
  const saveEq = () => {
    if (editingEq) { setEquipment(prev=>prev.map(e=>e.id===editingEq.id?{...e,name:eqForm.name,model:eqForm.model,eqStatus:eqForm.eqStatus,load:eqForm.load,lastCalib:eqForm.lastCalib,nextCalib:eqForm.nextCalib,uptime:eqForm.uptime,tests:eqForm.tests.split(',').map(t=>t.trim()).filter(Boolean)}:e)); setEditingEq(null); }
    else { const newId='EQ-'+String(equipment.length+1).padStart(3,'0'); setEquipment(prev=>[...prev,{id:newId,name:eqForm.name,model:eqForm.model,eqStatus:eqForm.eqStatus,load:eqForm.load,lastCalib:eqForm.lastCalib,nextCalib:eqForm.nextCalib,uptime:eqForm.uptime,tests:eqForm.tests.split(',').map(t=>t.trim()).filter(Boolean)}]); setShowAddEq(false); }
    setEqForm({name:'',model:'',eqStatus:'Online',load:'0%',lastCalib:'',nextCalib:'',uptime:'100%',tests:''});
  };
  const deleteEq = (id: string) => { setEquipment(prev=>prev.filter(e=>e.id!==id)); setConfirmDeleteEq(null); };

  const closeMenus = () => { setOpenDrugMenu(null); setOpenEqMenu(null); };
  const inpStyle: React.CSSProperties = { width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' };
  const labelStyle: React.CSSProperties = { fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5, display:'block' };

  const DrugDrawer = () => {
    const isEdit = !!editingDrug;
    const close = () => { setShowAddDrug(false); setEditingDrug(null); };
    return (
      <><div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
      <div style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div><div style={{ fontWeight:800, fontSize:17 }}>{isEdit?'Edit Drug':'Add New Drug'}</div><div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>{isEdit?`Editing: ${editingDrug!.name}`:'Add a new drug to inventory'}</div></div>
          <button onClick={close} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:12.5, fontFamily:'inherit' }}>✕ Close</button>
        </div>
        <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:14 }}>
          <div><label style={labelStyle}>Drug Name *</label><input style={inpStyle} value={drugForm.name} onChange={e=>setDrugForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Lisinopril 10mg" /></div>
          <div><label style={labelStyle}>Category *</label><select style={{...inpStyle,cursor:'pointer'}} value={drugForm.category} onChange={e=>setDrugForm(f=>({...f,category:e.target.value}))}>{['Cardiovascular','Diabetes','Cardiac','Respiratory','Neurology','Analgesics','GI','Antibiotics','Oncology','Other'].map(c=><option key={c}>{c}</option>)}</select></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            <div><label style={labelStyle}>Current Stock *</label><input style={inpStyle} type="number" value={drugForm.qty} onChange={e=>setDrugForm(f=>({...f,qty:e.target.value}))} placeholder="e.g. 500" /></div>
            <div><label style={labelStyle}>Min Required</label><input style={inpStyle} type="number" value={drugForm.min} onChange={e=>setDrugForm(f=>({...f,min:e.target.value}))} placeholder="e.g. 100" /></div>
            <div><label style={labelStyle}>Max Capacity</label><input style={inpStyle} type="number" value={drugForm.max} onChange={e=>setDrugForm(f=>({...f,max:e.target.value}))} placeholder="e.g. 2000" /></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={labelStyle}>Unit</label><select style={{...inpStyle,cursor:'pointer'}} value={drugForm.unit} onChange={e=>setDrugForm(f=>({...f,unit:e.target.value}))}>{['tabs','caps','units','vials','sachets','bottles','boxes','bags'].map(u=><option key={u}>{u}</option>)}</select></div>
            <div><label style={labelStyle}>Expiry Date</label><input style={inpStyle} value={drugForm.expiry} onChange={e=>setDrugForm(f=>({...f,expiry:e.target.value}))} placeholder="e.g. Dec 2026" /></div>
          </div>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
          <button className="ha-action-btn" style={{ flex:1, justifyContent:'center' }} onClick={saveDrug}>{isEdit?'✓ Save Changes':'+ Add Drug'}</button>
          <button onClick={close} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
        </div>
      </div></>
    );
  };

  const EqDrawer = () => {
    const isEdit = !!editingEq;
    const close = () => { setShowAddEq(false); setEditingEq(null); };
    return (
      <><div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
      <div style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div><div style={{ fontWeight:800, fontSize:17 }}>{isEdit?'Edit Equipment':'Add New Equipment'}</div><div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>{isEdit?`Editing: ${editingEq!.name}`:'Register new lab equipment'}</div></div>
          <button onClick={close} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:12.5, fontFamily:'inherit' }}>✕ Close</button>
        </div>
        <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:14 }}>
          <div><label style={labelStyle}>Equipment Name *</label><input style={inpStyle} value={eqForm.name} onChange={e=>setEqForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Hematology Analyzer" /></div>
          <div><label style={labelStyle}>Model / Manufacturer *</label><input style={inpStyle} value={eqForm.model} onChange={e=>setEqForm(f=>({...f,model:e.target.value}))} placeholder="e.g. Sysmex XN-1000" /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={labelStyle}>Status</label><select style={{...inpStyle,cursor:'pointer'}} value={eqForm.eqStatus} onChange={e=>setEqForm(f=>({...f,eqStatus:e.target.value}))}><option>Online</option><option>Warning</option><option>Offline</option></select></div>
            <div><label style={labelStyle}>Current Load</label><input style={inpStyle} value={eqForm.load} onChange={e=>setEqForm(f=>({...f,load:e.target.value}))} placeholder="e.g. 72%" /></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={labelStyle}>Last Calibrated</label><input style={inpStyle} value={eqForm.lastCalib} onChange={e=>setEqForm(f=>({...f,lastCalib:e.target.value}))} placeholder="e.g. Apr 24, 2026" /></div>
            <div><label style={labelStyle}>Next Calibration Due</label><input style={inpStyle} value={eqForm.nextCalib} onChange={e=>setEqForm(f=>({...f,nextCalib:e.target.value}))} placeholder="e.g. May 8, 2026" /></div>
          </div>
          <div><label style={labelStyle}>Uptime</label><input style={inpStyle} value={eqForm.uptime} onChange={e=>setEqForm(f=>({...f,uptime:e.target.value}))} placeholder="e.g. 99.2%" /></div>
          <div><label style={labelStyle}>Test Capabilities (comma-separated)</label><input style={inpStyle} value={eqForm.tests} onChange={e=>setEqForm(f=>({...f,tests:e.target.value}))} placeholder="e.g. CBC, Reticulocytes, WBC" /></div>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
          <button className="ha-action-btn" style={{ flex:1, justifyContent:'center' }} onClick={saveEq}>{isEdit?'✓ Save Changes':'+ Add Equipment'}</button>
          <button onClick={close} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
        </div>
      </div></>
    );
  };

  const DeleteModal = ({ label, onConfirm, onCancel }: { label:string; onConfirm:()=>void; onCancel:()=>void }) => (
    <><div onClick={onCancel} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:200 }} />
    <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'white', borderRadius:16, padding:28, width:380, maxWidth:'90vw', zIndex:201, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
      <div style={{ textAlign:'center', marginBottom:18 }}>
        <div style={{ width:50, height:50, borderRadius:'50%', background:'var(--rose-light)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22 }}>🗑</div>
        <div style={{ fontWeight:800, fontSize:17, marginBottom:6 }}>Delete Item?</div>
        <div style={{ fontSize:13.5, color:'var(--text-muted)', lineHeight:1.6 }}>Are you sure you want to delete <strong>{label}</strong>? This cannot be undone.</div>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onCancel} style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
        <button onClick={onConfirm} style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'var(--rose)', color:'white', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, fontWeight:700 }}>Yes, Delete</button>
      </div>
    </div></>
  );

  return (
    <div className="ha-content ha-fade" onClick={closeMenus}>
      <div className="ha-section-head">
        <div><div className="ha-section-title">Inventory</div><div className="ha-section-sub">Drug stock · Lab equipment status</div></div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={() => setActiveTab('drugs')} style={{ padding:'7px 18px', borderRadius:9, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, background:activeTab==='drugs'?'var(--primary)':'var(--card)', color:activeTab==='drugs'?'white':'var(--text-muted)', boxShadow:activeTab==='drugs'?'none':'0 0 0 1px var(--border)' }}>Drug Inventory</button>
          <button onClick={() => setActiveTab('equipment')} style={{ padding:'7px 18px', borderRadius:9, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, background:activeTab==='equipment'?'var(--primary)':'var(--card)', color:activeTab==='equipment'?'white':'var(--text-muted)', boxShadow:activeTab==='equipment'?'none':'0 0 0 1px var(--border)' }}>Equipment Status</button>
          <button className="ha-action-btn" onClick={e => { e.stopPropagation(); activeTab==='drugs'?setShowAddDrug(true):setShowAddEq(true); }}>
            <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14} color="white" />
            {activeTab==='drugs'?'Add Drug':'Add Equipment'}
          </button>
        </div>
      </div>

      {activeTab === 'drugs' && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {([['Total Items',String(drugs.length),'var(--primary)','var(--primary-light)'],['OK',String(drugOK),'var(--green)','var(--green-light)'],['Low Stock',String(drugLow),'var(--amber)','var(--amber-light)'],['Critical',String(drugCritical),'var(--rose)','var(--rose-light)']] as [string,string,string,string][]).map(([l,v,c,bg]) => (
              <div key={l} className="ha-card" style={{ background:bg, border:'none', textAlign:'center', padding:'14px 16px' }}>
                <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
                <div style={{ fontSize:12, color:c, marginTop:3, fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="ha-card" style={{ padding:0, overflow:'hidden' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:15 }}>Drug Inventory</div>
            <div className="ha-table-wrap">
              <table className="ha-table">
                <thead><tr>{['Drug Name','Category','Stock','Min','Max','Stock Level','Expiry','Status','Actions'].map(h=><Th key={h}>{h}</Th>)}</tr></thead>
                <tbody>
                  {drugs.map((d,i) => {
                    const st = invDrugStatus(d.qty,d.min);
                    const pct = Math.min(100,(d.qty/d.max)*100);
                    const barColor = st==='Critical'?'var(--rose)':st==='Low'?'var(--amber)':'var(--primary)';
                    const menuOpen = openDrugMenu===d.id;
                    return (
                      <tr key={d.id} className="ha-tr" style={{ borderBottom:i<drugs.length-1?'1px solid var(--border)':'none', background:st==='Critical'?'#fff8f8':undefined }}>
                        <Td><span style={{ fontWeight:700 }}>{d.name}</span></Td>
                        <Td><Badge label={d.category} color="gray" /></Td>
                        <Td><span style={{ fontWeight:700, color:st==='Critical'?'var(--rose)':st==='Low'?'var(--amber)':'var(--text)' }}>{d.qty.toLocaleString()}</span></Td>
                        <Td style={{ color:'var(--text-muted)' }}>{d.min}</Td>
                        <Td style={{ color:'var(--text-muted)' }}>{d.max}</Td>
                        <Td style={{ minWidth:120 }}>
                          <div style={{ background:'#f1f5f9', borderRadius:4, height:7, overflow:'hidden' }}>
                            <div style={{ width:`${pct}%`, height:'100%', background:barColor, borderRadius:4 }} />
                          </div>
                        </Td>
                        <Td style={{ color:'var(--text-muted)' }}>{d.expiry}</Td>
                        <Td><Badge label={st} color={st==='Critical'?'rose':st==='Low'?'amber':'primary'} /></Td>
                        <Td>
                          <div style={{ position:'relative' }}>
                            <button onClick={e=>{e.stopPropagation();setOpenDrugMenu(menuOpen?null:d.id);}} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'4px 10px', fontSize:16, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)', lineHeight:1 }}>⋯</button>
                            {menuOpen && (
                              <div onClick={e=>e.stopPropagation()} style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'white', border:'1px solid var(--border)', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:50, minWidth:130, overflow:'hidden' }}>
                                <button onClick={()=>openEditDrug(d)} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--text)' }}>✏️ Edit</button>
                                <div style={{ height:1, background:'var(--border)' }} />
                                <button onClick={()=>{setConfirmDeleteDrug(d.id);setOpenDrugMenu(null);}} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--rose)' }}>🗑 Delete</button>
                              </div>
                            )}
                          </div>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'equipment' && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {([['Online',eqOnline,'var(--green)','var(--green-light)'],['Warning',eqWarning,'var(--amber)','var(--amber-light)'],['Offline',eqOffline,'var(--rose)','var(--rose-light)'],['Total',equipment.length,'var(--primary)','var(--primary-light)']] as [string,number,string,string][]).map(([l,n,c,bg]) => (
              <div key={l} className="ha-card" style={{ background:bg, border:'none', textAlign:'center', padding:'14px 16px' }}>
                <div style={{ fontSize:26, fontWeight:800, color:c }}>{n}</div>
                <div style={{ fontSize:12, color:c, marginTop:3, fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
            {equipment.map(e => {
              const menuOpen = openEqMenu===e.id;
              return (
                <div key={e.id} className="ha-card" style={{ borderLeft:`4px solid ${eqBorderCol(e.eqStatus)}`, padding:'18px 20px', display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:3 }}>{e.name}</div>
                      <div style={{ fontSize:12.5, color:'var(--text-muted)' }}>{e.model} · {e.id}</div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <Badge label={e.eqStatus} color={e.eqStatus==='Online'?'primary':e.eqStatus==='Warning'?'amber':'rose'} />
                      <div style={{ position:'relative' }}>
                        <button onClick={ev=>{ev.stopPropagation();setOpenEqMenu(menuOpen?null:e.id);}} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'4px 10px', fontSize:16, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)', lineHeight:1 }}>⋯</button>
                        {menuOpen && (
                          <div onClick={ev=>ev.stopPropagation()} style={{ position:'absolute', right:0, top:'calc(100% + 4px)', background:'white', border:'1px solid var(--border)', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:50, minWidth:130, overflow:'hidden' }}>
                            <button onClick={()=>openEditEq(e)} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--text)' }}>✏️ Edit</button>
                            <div style={{ height:1, background:'var(--border)' }} />
                            <button onClick={()=>{setConfirmDeleteEq(e.id);setOpenEqMenu(null);}} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--rose)' }}>🗑 Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {([['Current Load',e.load],['Uptime',e.uptime],['Last Calibrated',e.lastCalib],['Next Due',e.nextCalib]] as [string,string][]).map(([k,v]) => (
                      <div key={k} style={{ background:'var(--bg)', borderRadius:8, padding:'8px 10px' }}>
                        <div style={{ fontSize:10.5, color:'var(--text-muted)', marginBottom:2 }}>{k}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:k==='Current Load'&&parseInt(e.load)>80?'var(--amber)':'var(--text)' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>{e.tests.map(t=><span key={t} style={{ fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:20, background:'#f1f5f9', color:'var(--text-muted)' }}>{t}</span>)}</div>
                  {e.eqStatus!=='Online' && (<div style={{ padding:'8px 12px', borderRadius:9, fontSize:12.5, fontWeight:600, background:e.eqStatus==='Warning'?'var(--amber-light)':'var(--rose-light)', color:e.eqStatus==='Warning'?'var(--amber)':'var(--rose)' }}>{e.eqStatus==='Warning'?'⚠ High load — schedule maintenance':'🔴 Offline — contact biomedical engineering'}</div>)}
                </div>
              );
            })}
          </div>
        </>
      )}

      {(showAddDrug||editingDrug) && <DrugDrawer />}
      {(showAddEq||editingEq)     && <EqDrawer />}
      {confirmDeleteDrug && (<DeleteModal label={drugs.find(d=>d.id===confirmDeleteDrug)?.name??''} onConfirm={()=>deleteDrug(confirmDeleteDrug)} onCancel={()=>setConfirmDeleteDrug(null)} />)}
      {confirmDeleteEq   && (<DeleteModal label={equipment.find(e=>e.id===confirmDeleteEq)?.name??''} onConfirm={()=>deleteEq(confirmDeleteEq)} onCancel={()=>setConfirmDeleteEq(null)} />)}
    </div>
  );
};
