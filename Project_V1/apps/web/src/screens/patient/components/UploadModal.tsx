import React, { useState, useRef } from 'react';
import Icon from '../shared/Icon';

interface UploadModalProps { onClose: () => void; toast: (m: string) => void; }

const UploadModal: React.FC<UploadModalProps> = ({ onClose, toast }) => {
  const [docName, setDocName] = useState('');
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);
  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(16,32,30,.45)',backdropFilter:'blur(3px)',zIndex:400,display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width:420,padding:26 }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18 }}>
          <div style={{ fontWeight:800,fontSize:16 }}>Upload Document</div>
          <button className="icon-btn" style={{ width:32,height:32,borderRadius:9 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="af-grid" style={{ gridTemplateColumns:'1fr' }}>
          <label className="af-field">
            <span>Document Name</span>
            <input value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. CBC Report – Apr 2026" />
          </label>
          <div className="af-field">
            <span>Select File</span>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.png" style={{ display:'none' }}
              onChange={e => setFileName(e.target.files?.[0]?.name ?? '')} />
            <button onClick={() => fileRef.current?.click()}
              style={{ padding:'11px 13px',borderRadius:11,border:'1px dashed #9fd6cd',background:'#f7faf9',fontSize:13.5,display:'flex',alignItems:'center',gap:9,color:'var(--ink2)',width:'100%' }}>
              <Icon name="download" size={16} />{fileName || 'Browse files (PDF / JPG / PNG)'}
            </button>
          </div>
        </div>
        <div className="af-actions">
          <button className="btn btn-outline" style={{ padding:'9px 16px',border:'1px solid var(--line)' }} onClick={onClose}>Cancel</button>
          <button className="btn btn-solid" style={{ padding:'9px 18px',background:fileName?'var(--teal)':'#ccc',color:'#fff' }}
            onClick={() => { if (!fileName) return; toast(`"${docName || fileName}" uploaded`); onClose(); }}>
            <Icon name="up" size={14} />Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
