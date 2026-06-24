import React, { useState } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import Ring from '../shared/Ring';
import SecHead from '../shared/SecHead';
import MemberPicker from '../components/MemberPicker';
import RefillModal from '../components/RefillModal';
import { MEDS } from '../data/mockMedications';
import type { Member, Med, Slot } from '../types/patient.types';

interface MedicationsProps { member: Member; toast: (m: string) => void; }

const Medications: React.FC<MedicationsProps> = ({ member, toast }) => {
  const [meds, setMeds]               = useState<Med[]>(MEDS);
  const [showRefill, setShowRefill]   = useState(false);
  const [preselect, setPreselect]     = useState<string | undefined>(undefined);
  const [medMember, setMedMember]     = useState('self');
  const active = meds.filter(m => m.status === 'Active');
  const taken  = active.reduce((n, m) => n + Object.values(m.schedule).filter(s => s === 'taken').length, 0);
  const due    = active.reduce((n, m) => n + Object.values(m.schedule).filter(s => s === 'todo').length, 0);

  const toggle = (mi: number, slot: Slot) =>
    setMeds(prev => prev.map((m, i) => {
      if (i !== mi) return m;
      const cur = m.schedule[slot];
      if (cur === 'off') return m;
      return { ...m, schedule: { ...m.schedule, [slot]: cur==='taken'?'todo':'taken' } };
    }));

  return (
    <div className="screen screen-anim">
      <div className="card" style={{ padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <div style={{ fontWeight:700,fontSize:14 }}>Medications for</div>
        <MemberPicker value={medMember} onChange={setMedMember} selfName={member.name} />
      </div>

      <div className="card" style={{ padding:22 }}>
        <div className="med-summary">
          <div className="med-sum-l">
            <Ring value={active.length?Math.round((taken/(taken+due||1))*100):0} size={92} stroke={9}>
              <span className="med-ring-txt" style={{ fontSize:16 }}>{taken}/{taken+due}</span>
            </Ring>
            <div>
              <div className="med-sum-title">Today's Medications</div>
              <div className="med-sum-sub">{taken} taken · {due} remaining · {active.length} active prescriptions</div>
              <div className="med-sum-tags">
                <Badge text={`${active.length} Active`} color="#0E9384" bg="#eef6f4" dot />
                <Badge text="1 refill due" color="#e0951a" bg="#fdf3e3" dot />
              </div>
            </div>
          </div>
          <button className="btn btn-solid" style={{ padding:'11px 18px',background:'var(--teal)',color:'#fff' }}
            onClick={() => { setPreselect(undefined); setShowRefill(true); }}>
            <Icon name="refresh" size={16} />Request Refills
          </button>
        </div>
      </div>

      <div className="med-grid">
        {meds.map((m, mi) => {
          const low = m.status==='Active' && m.remaining < 15;
          return (
            <div key={m.name} className="card" style={{ padding:20,opacity:m.status==='Completed'?.72:1 }}>
              <div className="med">
                <div className="med-top">
                  <div className="med-id">
                    <div className="med-ic"><Icon name={m.icon} size={20} /></div>
                    <div>
                      <div className="med-name">{m.name}<span className="med-dose">{m.dose}</span></div>
                      <div className="med-purpose">{m.purpose}</div>
                    </div>
                  </div>
                  <Badge text={m.status} color={m.status==='Active'?'#0E9384':'#7b8785'} bg={m.status==='Active'?'#eef6f4':'#f1f5f4'} dot />
                </div>
                <div className="med-sched">
                  {(['morning','noon','night'] as Slot[]).map(slot => {
                    const st = m.schedule[slot];
                    return (
                      <button key={slot} disabled={st==='off'}
                        className={`med-slot ${st==='taken'?'med-slot-taken':''} ${st==='off'?'med-slot-off':''}`}
                        onClick={() => toggle(mi, slot)}>
                        <Icon name={st==='taken'?'check':slot==='night'?'moon':'spark'} size={13} />
                        {slot[0].toUpperCase()+slot.slice(1)}
                      </button>
                    );
                  })}
                </div>
                <div className="med-foot">
                  <span className={`med-remain ${low?'low':''}`}>
                    <Icon name="pill" size={14} />
                    {m.status==='Completed'?'Course completed':`${m.remaining} of ${m.total} pills left`}
                  </span>
                  {m.status==='Active'
                    ? <button className="btn btn-outline" style={{ padding:'8px 13px',fontSize:12.5,border:'1px solid var(--line)' }}
                        onClick={() => { setPreselect(m.name); setShowRefill(true); }}>
                        <Icon name="refresh" size={13} />Refill · {m.refill}
                      </button>
                    : <span className="med-remain" style={{ color:'#15a06b' }}><Icon name="check" size={14} />Finished</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showRefill && <RefillModal meds={meds} preselect={preselect} selfName={member.name} onClose={() => setShowRefill(false)} toast={toast} />}
    </div>
  );
};

export default Medications;
