import React, { useState } from 'react';
import Icon from '../shared/Icon';

interface ExportModalProps {
  title: string;
  onClose: () => void;
  onDownload: (from: string, to: string) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ title, onClose, onDownload }) => {
  const [from, setFrom] = useState('2026-01-01');
  const [to, setTo]   = useState(new Date().toISOString().slice(0, 10));
  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(16,32,30,.45)',backdropFilter:'blur(3px)',zIndex:400,display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width:420,padding:26 }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18 }}>
          <div style={{ fontWeight:700,fontSize:16 }}>{title}</div>
          <button className="icon-btn" style={{ width:32,height:32,borderRadius:9 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="af-grid" style={{ gridTemplateColumns:'1fr 1fr' }}>
          <label className="af-field"><span>From date</span><input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
          <label className="af-field"><span>To date</span><input type="date" value={to} onChange={e => setTo(e.target.value)} /></label>
          <label className="af-field"><span>Year</span>
            <select onChange={e => { const y=e.target.value; setFrom(`${y}-01-01`); setTo(`${y}-12-31`); }}>
              {['2026','2025','2024','2023'].map(y => <option key={y}>{y}</option>)}
            </select>
          </label>
          <label className="af-field"><span>Range preset</span>
            <select onChange={e => {
              const today = new Date();
              if (e.target.value==='last30') { const d=new Date(today); d.setDate(d.getDate()-30); setFrom(d.toISOString().slice(0,10)); setTo(today.toISOString().slice(0,10)); }
              else if (e.target.value==='last90') { const d=new Date(today); d.setDate(d.getDate()-90); setFrom(d.toISOString().slice(0,10)); setTo(today.toISOString().slice(0,10)); }
              else if (e.target.value==='thisyear') { setFrom(`${today.getFullYear()}-01-01`); setTo(today.toISOString().slice(0,10)); }
            }}>
              <option value="">Custom</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="thisyear">This year</option>
            </select>
          </label>
        </div>
        <div style={{ marginTop:6,fontSize:12,color:'var(--ink3)' }}>Records from {from} to {to} will be zipped as PDFs.</div>
        <div className="af-actions">
          <button className="btn btn-outline" style={{ padding:'9px 16px',border:'1px solid var(--line)' }} onClick={onClose}>Cancel</button>
          <button className="btn btn-solid" style={{ padding:'9px 18px',background:'var(--teal)',color:'#fff' }}
            onClick={() => { onDownload(from,to); onClose(); }}>
            <Icon name="download" size={15} />Download ZIP
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
