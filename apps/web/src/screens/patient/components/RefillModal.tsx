import React, { useState } from 'react';
import Icon from '../shared/Icon';
import type { Med, RefillItem } from '../types/patient.types';
import { PHARMACIES } from '../data/mockMedications';

interface RefillModalProps {
  meds: Med[];
  preselect?: string;
  selfName: string;
  onClose: () => void;
  toast: (m: string) => void;
}

const RefillModal: React.FC<RefillModalProps> = ({ meds, preselect, selfName, onClose, toast }) => {
  const activeMeds = meds.filter(m => m.status === 'Active');
  const [selected, setSelected] = useState<RefillItem[]>(
    activeMeds.filter(m => !preselect || m.name === preselect).map(m => ({ name: m.name, dose: m.dose, qty: 30 }))
  );
  const [pharmacy, setPharmacy] = useState(PHARMACIES[0]);
  const [showRx, setShowRx] = useState(false);

  const toggle = (m: Med) =>
    setSelected(prev => prev.some(s => s.name === m.name)
      ? prev.filter(s => s.name !== m.name)
      : [...prev, { name: m.name, dose: m.dose, qty: 30 }]);

  const setQty = (name: string, qty: number) =>
    setSelected(prev => prev.map(s => s.name === name ? { ...s, qty } : s));

  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(16,32,30,.45)',backdropFilter:'blur(3px)',zIndex:400,display:'flex',alignItems:'center',justifyContent:'center',padding:16,overflowY:'auto' }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width:540,maxWidth:'100%',padding:26,maxHeight:'90vh',overflowY:'auto' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18 }}>
          <div style={{ fontWeight:800,fontSize:16 }}>Request Refill</div>
          <button className="icon-btn" style={{ width:32,height:32,borderRadius:9 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>

        <div style={{ fontWeight:600,fontSize:12.5,color:'var(--ink3)',marginBottom:10,textTransform:'uppercase',letterSpacing:'.04em' }}>Select Medications</div>
        <div style={{ display:'flex',flexDirection:'column',gap:8,marginBottom:18 }}>
          {activeMeds.map(m => {
            const sel = selected.find(s => s.name === m.name);
            return (
              <div key={m.name} style={{ display:'flex',alignItems:'center',gap:10,padding:'11px 14px',borderRadius:12,border:`1.5px solid ${sel?'#0E9384':'var(--line)'}`,background:sel?'#eef6f4':'#fbfdfc',transition:'.14s' }}>
                <input type="checkbox" checked={!!sel} onChange={() => toggle(m)} style={{ width:16,height:16,accentColor:'#0E9384',flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <span style={{ fontWeight:700,fontSize:13.5 }}>{m.name}</span>
                  <span style={{ fontSize:12,fontWeight:600,color:'#0E9384',background:'#eef6f4',borderRadius:7,padding:'2px 7px',marginLeft:7 }}>{m.dose}</span>
                  <div style={{ fontSize:11.5,color:'var(--ink3)',marginTop:2 }}>{m.purpose}</div>
                </div>
                {sel && (
                  <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                    <button onClick={() => setQty(m.name, Math.max(7, sel.qty-7))} style={{ width:26,height:26,borderRadius:7,border:'1px solid var(--line)',display:'grid',placeItems:'center',fontWeight:700,fontSize:16 }}>−</button>
                    <span style={{ fontWeight:700,fontSize:14,minWidth:32,textAlign:'center' }}>{sel.qty}</span>
                    <button onClick={() => setQty(m.name, Math.min(90, sel.qty+7))} style={{ width:26,height:26,borderRadius:7,border:'1px solid var(--line)',display:'grid',placeItems:'center',fontWeight:700,fontSize:16 }}>+</button>
                    <span style={{ fontSize:11.5,color:'var(--ink3)' }}>tabs</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <label className="af-field" style={{ marginBottom:18 }}>
          <span style={{ fontWeight:600,fontSize:12.5,color:'var(--ink2)' }}>Nearby Pharmacy</span>
          <select value={pharmacy} onChange={e => setPharmacy(e.target.value)} style={{ padding:'11px 13px',borderRadius:11,border:'1px solid var(--line)',fontSize:13.5,background:'#fbfdfc',marginTop:6,width:'100%' }}>
            {PHARMACIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </label>

        <div style={{ marginBottom:18 }}>
          <button onClick={() => setShowRx(r => !r)} style={{ display:'flex',alignItems:'center',gap:7,fontSize:13,fontWeight:600,color:'#0E9384',cursor:'pointer',background:'none',border:'none' }}>
            <Icon name="doc" size={15} />{showRx ? 'Hide' : 'View'} Prescription Details
            <span style={{ fontSize:10,background:'#eef6f4',borderRadius:6,padding:'2px 6px' }}>Sent to pharmacy</span>
          </button>
          {showRx && selected.length > 0 && (
            <div style={{ marginTop:12,borderRadius:13,border:'1px solid var(--line)',overflow:'hidden' }}>
              <div style={{ background:'#0b3b38',color:'#eafaf7',padding:'12px 16px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:700,fontSize:13.5 }}>Prescription — {selfName}</div>
                  <div style={{ fontSize:11,color:'#7fb3ac',marginTop:2 }}>Issued by Dr. Amy Chen · Apollo Multispecialty</div>
                </div>
                <div style={{ fontSize:11,color:'#7fb3ac' }}>{new Date().toLocaleDateString('en-IN')}</div>
              </div>
              <div style={{ padding:'12px 16px',background:'#fbfdfc' }}>
                {selected.map((s,i) => (
                  <div key={s.name} style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:i<selected.length-1?'1px solid var(--line2)':'none' }}>
                    <div style={{ width:28,height:28,borderRadius:8,background:'#eef6f4',color:'#0E9384',display:'grid',placeItems:'center',flexShrink:0 }}><Icon name="pill" size={14} /></div>
                    <div style={{ flex:1 }}>
                      <span style={{ fontWeight:700,fontSize:13 }}>{s.name}</span>
                      <span style={{ fontSize:12,color:'#0E9384',background:'#eef6f4',borderRadius:6,padding:'1px 6px',marginLeft:6 }}>{s.dose}</span>
                      <div style={{ fontSize:11.5,color:'var(--ink3)',marginTop:1 }}>{activeMeds.find(m => m.name===s.name)?.purpose}</div>
                    </div>
                    <div style={{ fontSize:13,fontWeight:600 }}>Qty: {s.qty}</div>
                  </div>
                ))}
                <div style={{ marginTop:10,fontSize:11,color:'var(--ink3)',fontStyle:'italic' }}>Valid for 30 days from date of issue.</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display:'flex',justifyContent:'flex-end',gap:10 }}>
          <button className="btn btn-outline" style={{ padding:'10px 18px',border:'1px solid var(--line)' }} onClick={onClose}>Cancel</button>
          <button className="btn btn-solid" style={{ padding:'10px 20px',background:selected.length?'var(--teal)':'#ccc',color:'#fff',cursor:selected.length?'pointer':'not-allowed' }}
            onClick={() => { if (!selected.length) return; toast(`Refill placed at ${pharmacy}`); onClose(); }}>
            <Icon name="check" size={15} />Place Order ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefillModal;
