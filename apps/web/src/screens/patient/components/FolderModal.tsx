import React, { useState } from 'react';
import Icon from '../shared/Icon';
import ExportModal from './ExportModal';
import { FOLDER_DOCS } from '../data/mockRecords';

interface FolderModalProps {
  folder: string;
  memberName: string;
  onClose: () => void;
  toast: (m: string) => void;
}

const FolderModal: React.FC<FolderModalProps> = ({ folder, memberName, onClose, toast }) => {
  const allDocs = FOLDER_DOCS[folder] ?? [];
  const [filterY, setFilterY] = useState('All');
  const [filterM, setFilterM] = useState('All');
  const [showExport, setShowExport] = useState(false);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const filtered = allDocs.filter(d => {
    const [y, m] = d.date.split('-');
    return (filterM==='All' || months[+m-1]===filterM) && (filterY==='All' || y===filterY);
  });
  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(16,32,30,.45)',backdropFilter:'blur(3px)',zIndex:400,display:'flex',alignItems:'flex-start',justifyContent:'center',overflowY:'auto',padding:'40px 16px' }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width:640,padding:26 }}>
        <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:18 }}>
          <div style={{ fontWeight:700,fontSize:16,flex:1 }}>{folder} — {memberName}</div>
          <button className="link-btn" onClick={() => setShowExport(true)}><Icon name="download" size={14} />Export all</button>
          <button className="icon-btn" style={{ width:32,height:32,borderRadius:9 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div style={{ display:'flex',gap:10,marginBottom:16 }}>
          <select style={{ padding:'7px 11px',borderRadius:9,border:'1px solid var(--line)',fontSize:13,background:'#fbfdfc' }} value={filterY} onChange={e => setFilterY(e.target.value)}>
            <option>All</option>{['2026','2025','2024'].map(y => <option key={y}>{y}</option>)}
          </select>
          <select style={{ padding:'7px 11px',borderRadius:9,border:'1px solid var(--line)',fontSize:13,background:'#fbfdfc' }} value={filterM} onChange={e => setFilterM(e.target.value)}>
            <option>All</option>{months.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        {filtered.length===0
          ? <div className="empty"><div>No documents in this range</div></div>
          : filtered.map((d,i) => (
            <div key={i} style={{ display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:'1px solid var(--line2)' }}>
              <div style={{ width:36,height:36,borderRadius:10,background:'#eef6f4',color:'#0E9384',display:'grid',placeItems:'center' }}><Icon name="doc" size={17} /></div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600,fontSize:13.5 }}>{d.name}</div>
                <div style={{ fontSize:12,color:'var(--ink3)' }}>{d.date} · {d.type}</div>
              </div>
              <button className="link-btn" style={{ fontSize:12.5 }} onClick={() => toast(`Viewing ${d.name}`)}><Icon name="records" size={13} />View</button>
              <button className="link-btn" style={{ fontSize:12.5 }} onClick={() => toast(`Downloading ${d.name}`)}><Icon name="download" size={13} />Download</button>
            </div>
          ))}
        {showExport && <ExportModal title={`Export ${folder}`} onClose={() => setShowExport(false)} onDownload={(f,t) => toast(`ZIP: ${f} → ${t}`)} />}
      </div>
    </div>
  );
};

export default FolderModal;
