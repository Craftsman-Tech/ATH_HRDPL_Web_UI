import React, { useState } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import SecHead from '../shared/SecHead';
import LineChart from '../shared/LineChart';
import UploadModal from '../components/UploadModal';
import ExportModal from '../components/ExportModal';
import { LABS, TRENDS } from '../data/mockLabResults';
import type { Member, FlagType } from '../types/patient.types';

const flagColor = (f: FlagType) => f==='normal'?'#15a06b':f==='high'?'#e0414b':'#e0951a';
const flagBg    = (f: FlagType) => f==='normal'?'#dbf3e6':f==='high'?'#fdecec':'#fdf3e3';

interface LabResultsProps { member: Member; toast: (m: string) => void; }

const LabResults: React.FC<LabResultsProps> = ({ member, toast }) => {
  const [trend, setTrend]         = useState(0);
  const [open, setOpen]           = useState<number | null>(0);
  const [showUpload, setShowUpload] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const t = TRENDS[trend];

  return (
    <div className="screen screen-anim">
      <div className="card" style={{ padding:22 }}>
        <SecHead icon="up" title="Health Trends" sub="Track your key markers over time" />
        <div className="trend-tabs">
          {TRENDS.map((tr,i) => (
            <button key={tr.key} className={`trend-tab ${i===trend?'on':''}`} onClick={() => setTrend(i)} style={i===trend?{color:tr.color}:undefined}>
              <Icon name={tr.ic} size={15} />{tr.label}
            </button>
          ))}
        </div>
        <div className="trend-body">
          <div>
            <div className="trend-now-val" style={{ color:t.color }}>{t.data[t.data.length-1]}<span>{t.unit}</span></div>
            <div className="trend-now-label">Latest {t.label.toLowerCase()}</div>
            <div className="trend-target"><Icon name="target" size={14} />{t.target}</div>
            <div className="trend-legend">
              <span><span className="dot" style={{ background:t.color }} />Measured</span>
              <span><span className="dot" style={{ background:'#cdd9d6' }} />Trend</span>
            </div>
          </div>
          <div className="trend-chart"><LineChart data={t.data} labels={t.labels} color={t.color} height={160} /></div>
        </div>
      </div>

      <div className="card" style={{ padding:22 }}>
        <SecHead icon="lab" title={`Lab Reports — ${member.name}`} sub="Tap a report to view detailed results"
          right={<div style={{ display:'flex',gap:8 }}>
            <button className="link-btn" onClick={() => setShowUpload(true)}><Icon name="up" size={14} />Upload</button>
            <button className="link-btn" onClick={() => setShowExport(true)}><Icon name="download" size={14} />Export all</button>
          </div>} />
        <div className="lab-list">
          {LABS.map((lab,i) => {
            const isOpen = open===i;
            return (
              <div key={i} className="lab">
                <button className="lab-head" onClick={() => setOpen(isOpen?null:i)}>
                  <div className="lab-ic" style={{ background:flagBg(lab.status==='Normal'?'normal':'high'),color:lab.color }}><Icon name="lab" size={18} /></div>
                  <div className="lab-info"><div className="lab-name">{lab.name}</div><div className="lab-date">{lab.date} · {lab.doctor}</div></div>
                  <Badge text={lab.status} color={lab.color} bg={lab.status==='Normal'?'#dbf3e6':'#fdf3e3'} dot />
                  <div style={{ display:'flex',gap:6,marginLeft:8 }}>
                    <button className="link-btn" style={{ fontSize:12 }} onClick={e => { e.stopPropagation(); toast(`Viewing ${lab.name}`); }}>View</button>
                    <button className="link-btn" style={{ fontSize:12 }} onClick={e => { e.stopPropagation(); toast(`Downloading ${lab.name}`); }}><Icon name="download" size={13} /></button>
                  </div>
                  <span className={`tl-chev ${isOpen?'up':''}`} style={{ marginLeft:4 }}><Icon name="chevron" size={16} /></span>
                </button>
                <div className="lab-detail" style={{ maxHeight:isOpen?60+lab.rows.length*42:0 }}>
                  <table className="lab-table"><tbody>
                    {lab.rows.map(r => (
                      <tr key={r.k}>
                        <td className="lt-k">{r.k}</td>
                        <td className="lt-v">{r.v} <span className="lt-u">{r.u}</span></td>
                        <td className="lt-r">Ref: {r.ref}</td>
                        <td className="lt-s"><Badge text={r.flag} color={flagColor(r.flag)} bg={flagBg(r.flag)} dot /></td>
                      </tr>
                    ))}
                  </tbody></table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} toast={toast} />}
      {showExport && <ExportModal title="Export Lab Reports" onClose={() => setShowExport(false)} onDownload={(f,t2) => toast(`Lab ZIP: ${f} → ${t2}`)} />}
    </div>
  );
};

export default LabResults;
