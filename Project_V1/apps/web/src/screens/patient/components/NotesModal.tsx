import React from 'react';
import Icon from '../shared/Icon';
import type { Visit } from '../types/patient.types';

interface NotesModalProps { visit: Visit; onClose: () => void; }

const NotesModal: React.FC<NotesModalProps> = ({ visit, onClose }) => (
  <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(16,32,30,.45)',backdropFilter:'blur(3px)',zIndex:400,display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
    <div onClick={e => e.stopPropagation()} className="card" style={{ width:580,padding:28 }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
        <div>
          <div style={{ fontWeight:800,fontSize:17 }}>{visit.title}</div>
          <div style={{ fontSize:12.5,color:'var(--ink3)',marginTop:3 }}>{visit.date} · {visit.doctor}</div>
        </div>
        <button className="icon-btn" style={{ width:34,height:34,borderRadius:10 }} onClick={onClose}><Icon name="x" size={17} /></button>
      </div>
      <div style={{ fontSize:14.5,lineHeight:1.7,color:'var(--ink2)',background:'#f7faf9',borderRadius:13,padding:18 }}>{visit.summary}</div>
    </div>
  </div>
);

export default NotesModal;
