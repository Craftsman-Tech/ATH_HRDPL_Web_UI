import React, { useState } from 'react';
import { STAFF_MEMBERS_INIT, ROLE_COLORS, ROLE_LABELS, DOCTOR_SPECS } from '../data/mockHaData';
import type { StaffMember, StaffRole } from '../types/hospitaladmin.types';

type StaffTabId = 'all' | 'doctor' | 'reception' | 'pharmacy' | 'labtech';

export const StaffScreen: React.FC<{ hospitalName?: string }> = ({ hospitalName = 'Hospital' }) => {
  const [tab,          setTab]          = useState<StaffTabId>('all');
  const [staffList,    setStaffList]    = useState<StaffMember[]>(STAFF_MEMBERS_INIT);
  const [showDrawer,   setShowDrawer]   = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);
  const [resetPwStaff, setResetPwStaff] = useState<(StaffMember & { newPass: string }) | null>(null);
  const [credentials,  setCredentials]  = useState<(StaffMember & { tempPass: string }) | null>(null);
  const [form, setForm] = useState({ name:'', role:'Doctor' as StaffRole, specialization:'Cardiologist', email:'', phone:'', licenceNo:'' });

  const counts = { all:staffList.length, doctor:staffList.filter(s=>s.role==='Doctor').length, reception:staffList.filter(s=>s.role==='Receptionist').length, pharmacy:staffList.filter(s=>s.role==='Pharmacist').length, labtech:staffList.filter(s=>s.role==='LabTech').length };
  const filtered = tab==='all'?staffList:tab==='doctor'?staffList.filter(s=>s.role==='Doctor'):tab==='reception'?staffList.filter(s=>s.role==='Receptionist'):tab==='pharmacy'?staffList.filter(s=>s.role==='Pharmacist'):staffList.filter(s=>s.role==='LabTech');

  const nextId  = (role: StaffRole) => { const p={Doctor:'D',Receptionist:'R',Pharmacist:'P',LabTech:'L'}[role]; const n=String(staffList.filter(s=>s.role===role).length+1).padStart(3,'0'); return `EMP-${p}${n}`; };
  const genPass = () => 'Vex@'+Math.random().toString(36).slice(2,6).toUpperCase();

  const openCreateDrawer = () => { setEditingStaff(null); setForm({name:'',role:'Doctor',specialization:'Cardiologist',email:'',phone:'',licenceNo:''}); setShowDrawer(true); };
  const openEditDrawer   = (s: StaffMember) => { setEditingStaff(s); setForm({name:s.name,role:s.role,specialization:s.specialization??'Cardiologist',email:s.email,phone:s.phone,licenceNo:s.licenceNo??''}); setShowDrawer(true); };

  const handleSave = () => {
    if (!form.name.trim()||!form.email.trim()) return;
    const dept = form.role==='Doctor'?form.specialization:form.role==='Receptionist'?'Reception':form.role==='Pharmacist'?'Pharmacy':'Diagnostics';
    if (editingStaff) {
      setStaffList(prev=>prev.map(s=>s.id===editingStaff.id?{...s,name:form.name,role:form.role,specialization:form.role==='Doctor'?form.specialization:undefined,department:dept,email:form.email,phone:form.phone,licenceNo:form.licenceNo||undefined}:s));
      setShowDrawer(false); setEditingStaff(null);
    } else {
      const member: StaffMember = {id:`S-${Date.now()}`,name:form.name,role:form.role,specialization:form.role==='Doctor'?form.specialization:undefined,department:dept,email:form.email,phone:form.phone,employeeId:nextId(form.role),joinDate:new Date().toLocaleDateString('en-IN',{month:'short',year:'numeric'}),status:'Active',licenceNo:form.licenceNo||undefined};
      const pass = genPass();
      setStaffList(s=>[...s,member]); setShowDrawer(false); setCredentials({...member,tempPass:pass});
    }
    setForm({name:'',role:'Doctor',specialization:'Cardiologist',email:'',phone:'',licenceNo:''});
  };
  const handleResetPw = (s: StaffMember) => setResetPwStaff({...s,newPass:genPass()});

  const inpStyle: React.CSSProperties = { width:'100%', padding:'9px 12px', border:'1px solid var(--border)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', background:'var(--bg)', color:'var(--text)', boxSizing:'border-box' };
  const labelStyle: React.CSSProperties = { fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:5, display:'block' };
  const newBtnStyle: React.CSSProperties = { display:'flex', alignItems:'center', gap:7, background:'#0d9488', color:'white', border:'none', borderRadius:10, padding:'9px 18px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' };

  return (
    <>
    <div style={{ flex:1, overflowY:'auto', padding:20 }} className="ha-fade">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:20 }}>
        {([['Total Staff',counts.all,'var(--text)'],['Doctors',counts.doctor,'#3b82f6'],['Reception',counts.reception,'#ec4899'],['Pharmacy',counts.pharmacy,'#0d9488'],['Lab Tech',counts.labtech,'#7c3aed']] as [string,number,string][]).map(([l,v,c]) => (
          <div key={l} className="ha-card">
            <div style={{ fontSize:10.5, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {([['all','All Staff'],['doctor','Doctors'],['reception','Reception'],['pharmacy','Pharmacy'],['labtech','Lab Tech']] as [StaffTabId,string][]).map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding:'6px 14px', borderRadius:9, cursor:'pointer', fontFamily:'inherit', fontSize:12.5, fontWeight:tab===id?700:500, border:tab===id?'none':'1px solid var(--border)', background:tab===id?'var(--primary)':'var(--card)', color:tab===id?'white':'var(--text-muted)' }}>
              {label} ({counts[id]})
            </button>
          ))}
        </div>
        <button style={newBtnStyle} onClick={openCreateDrawer}>+ Create Staff Profile</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {filtered.map(s => {
          const [bg,color] = ROLE_COLORS[s.role];
          const abb = s.name.split(' ').map(n=>n[0]).join('').slice(0,2);
          return (
            <div key={s.id} className="ha-card" style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:15, flexShrink:0 }}>{abb}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{s.name}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.specialization??ROLE_LABELS[s.role]}</div>
                </div>
                <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20, background:bg, color, flexShrink:0 }}>{s.role==='LabTech'?'Lab Tech':s.role}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {([['Employee ID',s.employeeId],['Status',s.status],['Email',s.email],['Phone',s.phone||'—']] as [string,string][]).map(([k,v]) => (
                  <div key={k} style={{ background:'var(--bg)', borderRadius:8, padding:'7px 10px' }}>
                    <div style={{ fontSize:10.5, color:'var(--text-muted)', marginBottom:2 }}>{k}</div>
                    <div style={{ fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:k==='Status'?(v==='Active'?'#16a34a':'#e11d48'):'var(--text)' }}>{v}</div>
                  </div>
                ))}
              </div>
              {s.licenceNo && (
                <div style={{ background:ROLE_COLORS[s.role][0], borderRadius:8, padding:'7px 10px' }}>
                  <div style={{ fontSize:10.5, color:ROLE_COLORS[s.role][1], fontWeight:600, marginBottom:2 }}>Licence / Reg. No.</div>
                  <div style={{ fontSize:12, fontWeight:700, color:ROLE_COLORS[s.role][1], fontFamily:'monospace' }}>{s.licenceNo}</div>
                </div>
              )}
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => openEditDrawer(s)} style={{ flex:1, padding:'7px', borderRadius:9, border:'1px solid var(--border)', background:'transparent', fontSize:12.5, cursor:'pointer', fontFamily:'inherit', color:'var(--text-muted)' }}>Edit</button>
                <button onClick={() => setViewingStaff(s)} style={{ flex:1, padding:'7px', borderRadius:9, border:'none', background:ROLE_COLORS[s.role][0], fontSize:12.5, cursor:'pointer', fontFamily:'inherit', color:ROLE_COLORS[s.role][1], fontWeight:600 }}>Details</button>
                <button onClick={() => handleResetPw(s)} style={{ flex:1, padding:'7px', borderRadius:9, border:'none', background:'var(--rose-light)', fontSize:12.5, cursor:'pointer', fontFamily:'inherit', color:'var(--rose)', fontWeight:600 }}>Reset PW</button>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'48px 20px', color:'var(--text-muted)' }}>
            <div style={{ fontSize:40, marginBottom:10 }}>👤</div>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>No profiles created yet</div>
            <div style={{ fontSize:13, marginBottom:16 }}>Create the first staff profile for this role.</div>
            <button style={newBtnStyle} onClick={openCreateDrawer}>+ Create Staff Profile</button>
          </div>
        )}
      </div>
    </div>

    {showDrawer && (
      <>
        <div onClick={() => setShowDrawer(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
        <div style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'white', boxShadow:'-8px 0 40px rgba(0,0,0,0.14)', zIndex:101, overflowY:'auto', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'22px 24px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
            <div><div style={{ fontWeight:800, fontSize:17 }}>{editingStaff?'Edit Staff Profile':'Create Staff Profile'}</div><div style={{ fontSize:12.5, color:'var(--text-muted)', marginTop:2 }}>{editingStaff?`Editing: ${editingStaff.name}`:hospitalName}</div></div>
            <button onClick={() => setShowDrawer(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:12.5, fontFamily:'inherit' }}>✕ Close</button>
          </div>
          <div style={{ padding:24, flex:1, display:'flex', flexDirection:'column', gap:16 }}>
            {!editingStaff && (
              <div>
                <label style={labelStyle}>STAFF ROLE *</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {(['Doctor','Receptionist','Pharmacist','LabTech'] as StaffRole[]).map(role => {
                    const [bg,color] = ROLE_COLORS[role]; const sel = form.role===role;
                    return (<button key={role} onClick={()=>setForm(f=>({...f,role}))} style={{ padding:'10px 12px', borderRadius:10, border:`2px solid ${sel?color:'var(--border)'}`, background:sel?bg:'transparent', cursor:'pointer', fontFamily:'inherit', fontWeight:sel?700:400, color:sel?color:'var(--text-muted)', fontSize:13, textAlign:'left' }}>{ROLE_LABELS[role]}</button>);
                  })}
                </div>
              </div>
            )}
            <div><label style={labelStyle}>Full Name *</label><input style={inpStyle} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Dr. Arjun Mehta" /></div>
            {form.role==='Doctor' && (<div><label style={labelStyle}>Specialization *</label><select style={{...inpStyle,cursor:'pointer'}} value={form.specialization} onChange={e=>setForm(f=>({...f,specialization:e.target.value}))}>{DOCTOR_SPECS.map(s=><option key={s}>{s}</option>)}</select></div>)}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><label style={labelStyle}>Work Email *</label><input style={inpStyle} type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="name@vexoo.in" /></div>
              <div><label style={labelStyle}>Phone</label><input style={inpStyle} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+91 XXXXX XXXXX" /></div>
            </div>
            {form.role!=='Receptionist' && (<div><label style={labelStyle}>{form.role==='Doctor'?'MCI Registration No.':form.role==='Pharmacist'?'Pharmacy Licence No.':'Lab Technician Licence No.'}</label><input style={inpStyle} value={form.licenceNo} onChange={e=>setForm(f=>({...f,licenceNo:e.target.value}))} placeholder={form.role==='Doctor'?'MCI/REG/XXXXX':'e.g. PH/2024/TS/XXXXX'} /></div>)}
            {!editingStaff && (
              <div style={{ background:'#fffef5', border:'1px solid #fde68a', borderRadius:12, padding:14 }}>
                <div style={{ fontSize:11.5, fontWeight:700, color:'#92400e', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Auto-Generated on Creation</div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontSize:12.5, color:'#78350f' }}>Employee ID</span><span style={{ fontSize:12.5, fontWeight:700, fontFamily:'monospace', color:'#92400e' }}>{nextId(form.role)}</span></div>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ fontSize:12.5, color:'#78350f' }}>Temp Password</span><span style={{ fontSize:12.5, fontWeight:700, fontFamily:'monospace', color:'#92400e' }}>Vex@••••••</span></div>
                <div style={{ fontSize:11.5, color:'#92400e', marginTop:8, lineHeight:1.5 }}>Share these with the staff member. Password must be changed on first login.</div>
              </div>
            )}
          </div>
          <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, flexShrink:0 }}>
            <button onClick={handleSave} style={{ flex:1, justifyContent:'center', display:'flex', alignItems:'center', padding:'11px 18px', borderRadius:10, border:'none', background:'#0d9488', color:'white', fontSize:13.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>{editingStaff?'✓ Save Changes':'Create Profile & Generate Credentials'}</button>
            <button onClick={() => setShowDrawer(false)} style={{ padding:'10px 18px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5 }}>Cancel</button>
          </div>
        </div>
      </>
    )}

    {credentials && (
      <div onClick={() => setCredentials(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, backdropFilter:'blur(2px)' }}>
        <div onClick={e=>e.stopPropagation()} style={{ background:'white', borderRadius:16, padding:28, width:400, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign:'center', marginBottom:18 }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:26 }}>✓</div>
            <div style={{ fontWeight:800, fontSize:18 }}>Profile Created!</div>
            <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>Share these login credentials with {credentials.name}.</div>
          </div>
          {([['Name',credentials.name],['Role',ROLE_LABELS[credentials.role]],['Employee ID',credentials.employeeId],['Login Email',credentials.email]] as [string,string][]).map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 12px', background:'var(--bg)', borderRadius:9, marginBottom:8 }}>
              <span style={{ fontSize:13, color:'var(--text-muted)' }}>{k}</span>
              <span style={{ fontSize:13, fontWeight:700, fontFamily:k==='Employee ID'?'monospace':'inherit' }}>{v}</span>
            </div>
          ))}
          <div style={{ background:'#fffef5', border:'1px solid #fde68a', borderRadius:12, padding:14, marginBottom:18, textAlign:'center' }}>
            <div style={{ fontSize:12, color:'#92400e', fontWeight:600, marginBottom:6 }}>Temporary Password — Show Once</div>
            <div style={{ fontSize:24, fontWeight:800, fontFamily:'monospace', color:'#92400e', letterSpacing:3 }}>{credentials.tempPass}</div>
            <div style={{ fontSize:11.5, color:'#92400e', marginTop:6 }}>Must be changed on first login</div>
          </div>
          <button onClick={() => setCredentials(null)} style={{ display:'flex', alignItems:'center', gap:7, background:'#0d9488', color:'white', border:'none', borderRadius:10, padding:'9px 18px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', width:'100%', justifyContent:'center' }}>Done</button>
        </div>
      </div>
    )}

    {viewingStaff && (
      <div onClick={() => setViewingStaff(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, backdropFilter:'blur(2px)' }}>
        <div onClick={e=>e.stopPropagation()} style={{ background:'white', borderRadius:16, padding:28, width:480, maxWidth:'92vw', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:ROLE_COLORS[viewingStaff.role][0], color:ROLE_COLORS[viewingStaff.role][1], display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, flexShrink:0 }}>{viewingStaff.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
            <div><div style={{ fontWeight:800, fontSize:17 }}>{viewingStaff.name}</div><div style={{ fontSize:13, color:'var(--text-muted)' }}>{viewingStaff.specialization??ROLE_LABELS[viewingStaff.role]} · {viewingStaff.department}</div></div>
            <span style={{ marginLeft:'auto', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, background:ROLE_COLORS[viewingStaff.role][0], color:ROLE_COLORS[viewingStaff.role][1] }}>{viewingStaff.role==='LabTech'?'Lab Tech':viewingStaff.role}</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {([['Employee ID',viewingStaff.employeeId],['Status',viewingStaff.status],['Email',viewingStaff.email],['Phone',viewingStaff.phone||'—'],['Department',viewingStaff.department],['Joined',viewingStaff.joinDate]] as [string,string][]).map(([k,v]) => (
              <div key={k} style={{ background:'var(--bg)', borderRadius:10, padding:'10px 14px' }}>
                <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{k}</div>
                <div style={{ fontSize:13.5, fontWeight:600, color:k==='Status'?(v==='Active'?'#16a34a':'#e11d48'):'var(--text)' }}>{v}</div>
              </div>
            ))}
          </div>
          {viewingStaff.licenceNo && (
            <div style={{ background:ROLE_COLORS[viewingStaff.role][0], borderRadius:10, padding:'10px 14px', marginBottom:16 }}>
              <div style={{ fontSize:11, color:ROLE_COLORS[viewingStaff.role][1], fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{viewingStaff.role==='Doctor'?'MCI Registration No.':viewingStaff.role==='Pharmacist'?'Pharmacy Licence No.':'Lab Technician Licence No.'}</div>
              <div style={{ fontSize:14, fontWeight:800, fontFamily:'monospace', color:ROLE_COLORS[viewingStaff.role][1] }}>{viewingStaff.licenceNo}</div>
            </div>
          )}
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <button onClick={() => { setViewingStaff(null); openEditDrawer(viewingStaff); }} style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, fontWeight:600 }}>Edit Profile</button>
            <button onClick={() => setViewingStaff(null)} style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'var(--primary)', color:'white', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, fontWeight:600 }}>Close</button>
          </div>
        </div>
      </div>
    )}

    {resetPwStaff && (
      <div onClick={() => setResetPwStaff(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, backdropFilter:'blur(2px)' }}>
        <div onClick={e=>e.stopPropagation()} style={{ background:'white', borderRadius:16, padding:28, width:380, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign:'center', marginBottom:18 }}>
            <div style={{ width:50, height:50, borderRadius:'50%', background:'var(--amber-light)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22 }}>🔑</div>
            <div style={{ fontWeight:800, fontSize:17 }}>Password Reset</div>
            <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>New temporary password for {resetPwStaff.name}</div>
          </div>
          <div style={{ background:'#fffef5', border:'1px solid #fde68a', borderRadius:12, padding:18, marginBottom:18, textAlign:'center' }}>
            <div style={{ fontSize:12, color:'#92400e', fontWeight:600, marginBottom:8 }}>New Temporary Password — Show Once</div>
            <div style={{ fontSize:26, fontWeight:800, fontFamily:'monospace', color:'#92400e', letterSpacing:4 }}>{resetPwStaff.newPass}</div>
            <div style={{ fontSize:11.5, color:'#92400e', marginTop:8 }}>Share this with {resetPwStaff.name}. They must change it on next login.</div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'var(--bg)', borderRadius:9, marginBottom:16 }}><span style={{ fontSize:13, color:'var(--text-muted)' }}>Staff Member</span><span style={{ fontSize:13, fontWeight:700 }}>{resetPwStaff.name}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'var(--bg)', borderRadius:9, marginBottom:16 }}><span style={{ fontSize:13, color:'var(--text-muted)' }}>Login Email</span><span style={{ fontSize:13, fontWeight:700 }}>{resetPwStaff.email}</span></div>
          <button onClick={() => setResetPwStaff(null)} style={{ display:'flex', alignItems:'center', gap:7, background:'#0d9488', color:'white', border:'none', borderRadius:10, padding:'9px 18px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', width:'100%', justifyContent:'center' }}>Done</button>
        </div>
      </div>
    )}
    </>
  );
};
