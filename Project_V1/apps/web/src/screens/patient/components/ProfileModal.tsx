import React, { useState } from 'react';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';
import Badge from '../shared/Badge';
import Ring from '../shared/Ring';
import SecHead from '../shared/SecHead';
import { GOALS, ACHIEVEMENTS, TIPS } from '../data/mockRecords';
import type { Member } from '../types/patient.types';

interface ProfileModalProps { member: Member; onClose: () => void; toast: (m: string) => void; }

const ProfileModal: React.FC<ProfileModalProps> = ({ member, onClose, toast }) => {
  const [sym, setSym] = useState<Record<string, number>>({ Headache: 1, Fatigue: 2, Dizziness: 0 });
  const [editing, setEditing] = useState(false);
  const [editVals, setEditVals] = useState({
    dob: 'Mar 15, 1994', blood: member.blood, height: '165 cm',
    weight: '68.2 kg', phone: '+91 98765 43210', email: 'sarah.j@email.com',
    address: 'Banjara Hills, Hyderabad', emergency: 'Michael Johnson', insurance: 'HealthFirst PPO',
  });
  const [saved, setSaved] = useState(editVals);
  type InfoKey = keyof typeof saved;
  const info: [string, InfoKey, string][] = [
    ['Date of Birth','dob','text'],['Blood Group','blood','text'],['Height','height','text'],
    ['Weight','weight','text'],['Phone','phone','tel'],['Email','email','email'],
    ['Address','address','text'],['Emergency Contact','emergency','text'],['Insurance','insurance','text'],
  ];

  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(16,32,30,.45)',backdropFilter:'blur(3px)',zIndex:300,display:'flex',alignItems:'flex-start',justifyContent:'center',overflowY:'auto',padding:'40px 16px' }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width:720,maxWidth:'100%',padding:26 }}>
        <div className="profile-head">
          <Avatar name={member.name} size={72} fs={26} />
          <div className="profile-id">
            <div className="profile-name">{member.name}</div>
            <div className="profile-sub">Patient · {member.id} · {member.age} years</div>
            <div className="profile-tags">
              <Badge text="Hypertension" color="#e0951a" bg="#fdf3e3" dot />
              <Badge text="Penicillin allergy" color="#e0414b" bg="#fdecec" dot />
            </div>
          </div>
          <button className="btn btn-outline" style={{ padding:'9px 14px',border:'1px solid var(--line)' }} onClick={() => setEditing(e => !e)}>
            <Icon name={editing ? 'x' : 'edit'} size={15} />{editing ? 'Cancel' : 'Edit'}
          </button>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        {editing ? (
          <>
            <div style={{ marginTop:18 }}>
              <div style={{ fontWeight:700,fontSize:14,marginBottom:14,color:'var(--ink2)' }}>Edit Profile Details</div>
              <div className="af-grid">
                {info.map(([label, key, inputType]) => (
                  <label key={key} className="af-field">
                    <span>{label}</span>
                    <input type={inputType} value={editVals[key]} onChange={e => setEditVals(v => ({ ...v, [key]: e.target.value }))} />
                  </label>
                ))}
              </div>
            </div>
            <div className="af-actions">
              <button className="btn btn-outline" style={{ padding:'10px 18px',border:'1px solid var(--line)' }} onClick={() => { setEditVals(saved); setEditing(false); }}>Cancel</button>
              <button className="btn btn-solid" style={{ padding:'10px 20px',background:'var(--teal)',color:'#fff' }}
                onClick={() => { setSaved(editVals); setEditing(false); toast('Profile saved successfully'); }}>
                <Icon name="check" size={15} />Save Changes
              </button>
            </div>
          </>
        ) : (
          <div className="profile-info" style={{ marginTop:20 }}>
            {info.map(([label, key]) => (
              <div key={key} className="pinfo"><div className="pinfo-k">{label}</div><div className="pinfo-v">{saved[key]}</div></div>
            ))}
          </div>
        )}

        <div style={{ marginTop:22 }}>
          <SecHead icon="target" title="Daily Goals" />
          <div className="goals">
            {GOALS.map(g => (
              <div key={g.label} className="goal">
                <Ring value={g.pct} size={84} stroke={8} color={g.color}><span className="goal-ring-val">{g.val}</span></Ring>
                <div className="goal-label">{g.label}</div>
                <div className="goal-meta">{g.meta}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:22 }}>
          <SecHead icon="award" title="Achievements" />
          <div className="ach-grid">
            {ACHIEVEMENTS.map(a => (
              <div key={a.title} className={`ach ${a.earned ? 'earned' : 'locked'}`}>
                {a.earned && <span className="ach-check"><Icon name="check" size={11} /></span>}
                <div className="ach-ic"><Icon name={a.ic} size={22} /></div>
                <div className="ach-title">{a.title}</div>
                <div className="ach-desc">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:22 }}>
          <SecHead icon="spark" title="Symptom Tracker" sub="Tap to log how you feel today" />
          <div className="symptoms">
            {Object.keys(sym).map(name => (
              <div key={name}>
                <div className="symptom-head">
                  <div className="symptom-ic"><Icon name="heart" size={14} /></div>{name}
                  <span className="symptom-scale">{sym[name]===0?'None':sym[name]<=2?'Mild':'Moderate'}</span>
                </div>
                <div className="symptom-dots">
                  {Array.from({ length:5 }).map((_,i) => (
                    <button key={i} className={`symptom-dot ${i < sym[name] ? 'on' : ''}`} onClick={() => setSym(s => ({ ...s, [name]: i+1 }))} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:22 }}>
          <SecHead icon="bulb" title="Tips for You" />
          <div className="tips">
            {TIPS.map(t => (
              <div key={t.title} className="tip">
                <div className="tip-ic" style={{ background:t.bg,color:t.color }}><Icon name={t.ic} size={18} /></div>
                <div><div className="tip-title">{t.title}</div><div className="tip-body">{t.body}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
