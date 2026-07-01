import React, { useState } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import SecHead from '../shared/SecHead';
import EmergencyCard from '../components/EmergencyCard';
import FolderModal from '../components/FolderModal';
import ExportModal from '../components/ExportModal';
import NotesModal from '../components/NotesModal';
import { FOLDERS, TIMELINE } from '../data/mockRecords';
import type { Member, Visit } from '../types/patient.types';

interface RecordsProps { member: Member; toast: (m: string) => void; }

const Records: React.FC<RecordsProps> = ({ member, toast }) => {
  const [open, setOpen]           = useState<number | null>(0);
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [notesVisit, setNotesVisit] = useState<Visit | null>(null);
  const [yearFilter, setYearFilter] = useState('All');
  const years = ['All', ...Array.from(new Set(TIMELINE.map(v => v.date.split(', ')[1])))];
  const filteredTL = yearFilter === 'All' ? TIMELINE : TIMELINE.filter(v => v.date.endsWith(yearFilter));

  return (
    <div className="screen screen-anim">
      <div className="grid-2c">
        <div className="col-main">
          <div className="card" style={{ padding:22 }}>
            <SecHead icon="records" title="Health Records" sub="All your documents in one place"
              right={<button className="link-btn" onClick={() => setShowExport(true)}><Icon name="download" size={14} />Export all</button>} />
            <div className="folder-grid">
              {FOLDERS.map(f => (
                <button key={f.name} className="folder" onClick={() => setOpenFolder(f.name)}>
                  <div className="folder-top">
                    <div className="folder-ic" style={{ background:f.bg,color:f.color }}><Icon name={f.ic} size={20} /></div>
                    <div className="folder-count">{f.count}</div>
                  </div>
                  <div className="folder-name">{f.name}</div>
                  <div className="folder-meta">{f.meta}</div>
                  <div className="folder-hover"><Icon name="arrowR" size={14} />Open folder</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding:22 }}>
            <SecHead icon="clock" title="Visit Timeline" sub="Chronological history of your care"
              right={<select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ padding:'6px 11px',borderRadius:9,border:'1px solid var(--line)',fontSize:13,background:'#fbfdfc' }}>
                {years.map(y => <option key={y}>{y}</option>)}
              </select>} />
            <div className="tl">
              {filteredTL.map((v,i) => {
                const isOpen = open===i;
                return (
                  <div key={i} className="tl-item">
                    <div className="tl-line">
                      <div className="tl-node" style={{ background:v.bg,color:v.color }}><Icon name={v.node} size={17} /></div>
                      {i < filteredTL.length-1 && <div className="tl-bar" />}
                    </div>
                    <div className="tl-card">
                      <button className="tl-head" onClick={() => setOpen(isOpen?null:i)}>
                        <div><div className="tl-title">{v.title}</div><div className="tl-meta">{v.date} · {v.doctor}</div></div>
                        <div className="tl-head-r">
                          <Badge text="Completed" color="#15a06b" bg="#dbf3e6" dot />
                          <span className={`tl-chev ${isOpen?'up':''}`}><Icon name="chevron" size={16} /></span>
                        </div>
                      </button>
                      <div className="tl-detail" style={{ maxHeight:isOpen?240:0 }}>
                        <div className="tl-summary">{v.summary}</div>
                        <div className="tl-actions">
                          <button className="btn btn-outline" style={{ padding:'7px 12px',fontSize:12.5,border:'1px solid var(--line)' }} onClick={() => setNotesVisit(v)}>
                            <Icon name="doc" size={14} />View Notes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-side">
          <EmergencyCard
            name={member.name} blood={member.blood}
            allergies="Penicillin (severe), Sulfonamides"
            conditions="Hypertension (Stage 1)"
            contact="Michael Johnson · +91 98765 43210"
            onCall={() => toast('Calling emergency contact')} />
        </div>
      </div>

      {openFolder && <FolderModal folder={openFolder} memberName={member.name} onClose={() => setOpenFolder(null)} toast={toast} />}
      {showExport && <ExportModal title="Export All Health Records" onClose={() => setShowExport(false)} onDownload={(f,t) => toast(`ZIP: ${f} → ${t}`)} />}
      {notesVisit && <NotesModal visit={notesVisit} onClose={() => setNotesVisit(null)} />}
    </div>
  );
};

export default Records;
