import React, { useState } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import SecHead from '../shared/SecHead';
import MemberPicker from '../components/MemberPicker';
import { DEFAULT_VAX } from '../data/mockFamily';
import type { Member, VaxEntry, VaxStatus } from '../types/patient.types';

interface VaccinationsProps { member: Member; }

const toneFor = (s: VaxStatus) =>
  s==='Up to date' ? { color:'#15a06b',bg:'#dbf3e6' }
  : s==='Due soon' ? { color:'#d98914',bg:'#fdf3e3' }
  :                  { color:'#e0414b',bg:'#fdecec' };

const Vaccinations: React.FC<VaccinationsProps> = ({ member }) => {
  const [sel, setSel] = useState('self');
  const vaxMap: Record<string, VaxEntry[]> = {};
  const vaccines = vaxMap[sel] ?? DEFAULT_VAX;
  const counts = {
    'Up to date': vaccines.filter(v => v.status==='Up to date').length,
    'Due soon':   vaccines.filter(v => v.status==='Due soon').length,
    'Overdue':    vaccines.filter(v => v.status==='Overdue').length,
  };

  return (
    <div className="screen screen-anim">
      <div className="card" style={{ padding:22 }}>
        <SecHead icon="syringe" title="Vaccination Status" sub={`Immunization record for ${sel==='self'?member.name:'family member'}`}
          right={<MemberPicker value={sel} onChange={setSel} selfName={member.name} />} />
        <div className="vax-tiles">
          <div className="vax-tile"><div className="vt-num" style={{ color:'#15a06b' }}>{counts['Up to date']}</div><div className="vt-label"><span className="dot" style={{ background:'#15a06b' }} />Up to date</div></div>
          <div className="vax-tile"><div className="vt-num" style={{ color:'#d98914' }}>{counts['Due soon']}</div><div className="vt-label"><span className="dot" style={{ background:'#d98914' }} />Due soon</div></div>
          <div className="vax-tile"><div className="vt-num" style={{ color:'#e0414b' }}>{counts['Overdue']}</div><div className="vt-label"><span className="dot" style={{ background:'#e0414b' }} />Overdue</div></div>
        </div>
        <div className="vax">
          {vaccines.map(v => {
            const tone = toneFor(v.status);
            return (
              <div key={v.name} className="vax-row">
                <div className="vax-ic" style={{ background:tone.bg,color:tone.color }}><Icon name="syringe" size={16} /></div>
                <div className="vax-info">
                  <div className="vax-name">{v.name}</div>
                  <div className="vax-meta">Last: {v.last} · Next due: {v.next}</div>
                </div>
                <Badge text={v.status} color={tone.color} bg={tone.bg} dot />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Vaccinations;
