import React, { useState } from 'react';
import Icon from '../shared/Icon';
import SecHead from '../shared/SecHead';
import MemberPicker from '../components/MemberPicker';
import UploadModal from '../components/UploadModal';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import type { Member } from '../types/patient.types';

interface InsuranceProps { member: Member; toast: (m: string) => void; }

const Insurance: React.FC<InsuranceProps> = ({ member, toast }) => {
  const [sel, setSel]                   = useState('self');
  const [showInsUpload, setShowInsUpload] = useState(false);
  const added = useFamilyMembers();
  const isDependent = sel !== 'self';
  const selName = sel==='self' ? member.name : (added.find(m => m.id===sel)?.name ?? member.name);
  const coverage = isDependent
    ? [
        { label:'Primary Care Copay',      used:25,   total:25,   note:'Per visit',             color:'#0E9384' },
        { label:'Specialist Copay',         used:40,   total:40,   note:'Per visit',             color:'#4F7CFF' },
        { label:'Shared Family Deductible', used:480,  total:1500, note:'\u20B9480 of \u20B91,500 met', color:'#e0951a' },
      ]
    : [
        { label:'Annual Deductible',  used:480,  total:1000, note:'\u20B9520 remaining',  color:'#0E9384' },
        { label:'Out-of-Pocket Max',  used:1180, total:5000, note:'\u20B93,820 remaining', color:'#4F7CFF' },
      ];

  return (
    <div className="screen screen-anim">
      <div className="card ins-bar" style={{ padding:20 }}>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <div style={{ width:36,height:36,borderRadius:10,background:'#eef6f4',color:'#0E9384',display:'grid',placeItems:'center' }}>
            <Icon name="shield" size={17} />
          </div>
          <div>
            <div style={{ fontWeight:700,fontSize:15 }}>Insurance & Coverage</div>
            <div style={{ fontSize:12.5,color:'var(--ink3)' }}>{isDependent?`Dependent under ${member.name}'s plan`:'Primary policy holder'}</div>
          </div>
        </div>
        <MemberPicker value={sel} onChange={setSel} label="Coverage for" selfName={member.name} />
      </div>

      <div className="grid-2c">
        <div className="col-main">
          <div className="ins-card">
            <div className="ins-top"><div className="ins-brand"><Icon name="shield" size={18} />HealthFirst</div><div className="ins-status">Active</div></div>
            <div className="ins-member">{selName}</div>
            <div className="ins-grid">
              <div><div className="ins-k">Member ID</div><div className="ins-v">HF-88204517</div></div>
              <div><div className="ins-k">Group</div><div className="ins-v">GRP-4471</div></div>
              <div><div className="ins-k">Plan</div><div className="ins-v">{isDependent?'PPO · Dependent':'Premium PPO'}</div></div>
              <div><div className="ins-k">Valid Thru</div><div className="ins-v">12 / 2026</div></div>
            </div>
          </div>
          <div className="card" style={{ padding:22 }}>
            <SecHead icon="target" title="Coverage Summary" sub={isDependent?'Shared household benefits':'Your plan at a glance'} />
            <div className="cov">
              {coverage.map(c => (
                <div key={c.label}>
                  <div className="cov-top"><span>{c.label}</span><span className="cov-v">\u20B9{c.used} / \u20B9{c.total}</span></div>
                  <div className="pbar" style={{ height:9,background:'#eef2f1' }}>
                    <div className="pbar-fill" style={{ width:`${Math.min((c.used/c.total)*100,100)}%`,background:c.color }} />
                  </div>
                  <div className="cov-note">{c.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-side">
          <div className="card" style={{ padding:22 }}>
            <SecHead icon="doc" title="Insurance Documents"
              right={<button className="link-btn" onClick={() => setShowInsUpload(true)}><Icon name="up" size={14} />Upload</button>} />
            <div className="ins-docs">
              {['Policy Summary 2026','Coverage Certificate','Claims Form','Insurance Card'].map(d => (
                <button key={d} className="ins-doc" onClick={() => toast(`Opening ${d}`)}>
                  <Icon name="doc" size={17} /><span>{d}</span><Icon name="download" size={15} />
                </button>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding:22,textAlign:'center' }}>
            <div style={{ width:48,height:48,borderRadius:14,background:'#eef6f4',color:'#0E9384',display:'grid',placeItems:'center',margin:'0 auto 10px' }}><Icon name="phone" size={20} /></div>
            <div style={{ fontWeight:700,fontSize:15,marginBottom:4 }}>Insurance support</div>
            <div style={{ fontSize:12.5,color:'var(--ink3)',marginBottom:14 }}>Questions about a claim or coverage?</div>
            <button className="btn btn-outline" style={{ padding:'9px 16px',border:'1px solid var(--line)' }} onClick={() => toast('Opening support chat')}>
              <Icon name="message" size={15} />Contact support
            </button>
          </div>
        </div>
      </div>
      {showInsUpload && <UploadModal onClose={() => setShowInsUpload(false)} toast={toast} />}
    </div>
  );
};

export default Insurance;
