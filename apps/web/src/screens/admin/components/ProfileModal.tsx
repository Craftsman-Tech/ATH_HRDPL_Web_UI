import React from 'react';
import { initials } from '../shared/initials';

export const ProfileModal: React.FC<{ adminName: string; adminRole: string; onClose: () => void }> = ({ adminName, adminRole, onClose }) => {
  const abb = initials(adminName);
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(11,15,14,0.3)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, backdropFilter:'blur(3px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'#FAFAF7', borderRadius:16, padding:28, width:420, maxWidth:'90vw', boxShadow:'0 20px 60px rgba(11,15,14,0.2)', border:'1px solid var(--ink-200)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22 }}>
          <div style={{ width:60, height:60, borderRadius:'50%', background:'var(--mineral-700)', display:'flex', alignItems:'center', justifyContent:'center', color:'#FAFAF7', fontSize:22, fontWeight:700 }}>{abb}</div>
          <div>
            <div style={{ fontWeight:800, fontSize:17, color:'var(--ink-900)' }}>{adminName}</div>
            <div style={{ fontSize:13, color:'var(--ink-500)' }}>{adminRole} · Founders' Console</div>
          </div>
        </div>
        {[['Full Name',adminName],['Email','superadmin@vexoo.in'],['Phone','+91 99887 76655'],['Role',adminRole],['Access Level','Full Platform Access']].map(([label,val]) => (
          <div key={label} style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:600, color:'var(--ink-500)', marginBottom:5 }}>{label}</div>
            <input defaultValue={val} style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--ink-200)', borderRadius:9, fontSize:13.5, outline:'none', fontFamily:'inherit', color:'var(--ink-900)', background:'var(--ink-050)' }} />
          </div>
        ))}
        <div style={{ display:'flex', gap:10, marginTop:20 }}>
          <button onClick={onClose} style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid var(--ink-200)', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, color:'var(--ink-600)' }}>Close</button>
          <button style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'var(--mineral-700)', color:'#FAFAF7', cursor:'pointer', fontFamily:'inherit', fontSize:13.5, fontWeight:600 }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};
