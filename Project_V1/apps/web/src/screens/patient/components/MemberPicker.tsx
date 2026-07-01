import React, { useState, useEffect, useRef } from 'react';
import Avatar from '../shared/Avatar';
import Icon from '../shared/Icon';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import { SEED_FAMILY } from '../data/mockFamily';

interface MemberPickerProps {
  value: string;
  onChange: (id: string) => void;
  label?: string;
  selfName: string;
}

const MemberPicker: React.FC<MemberPickerProps> = ({ value, onChange, label = 'Viewing', selfName }) => {
  const added = useFamilyMembers();
  const allFamily = [
    ...SEED_FAMILY.map(m => ({ id: m.id, name: m.name, rel: m.relation })),
    ...added.filter(a => !SEED_FAMILY.some(s => s.id === a.id)).map(m => ({ id: m.id, name: m.name, rel: m.relation })),
  ];
  const options = [{ id: 'self', name: selfName, rel: 'Self' }, ...allFamily];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const cur = options.find(o => o.id === value) ?? options[0];
  return (
    <div className="mselect" ref={ref}>
      {label && <span className="mselect-label">{label}</span>}
      <button className="mselect-btn" onClick={() => setOpen(o => !o)}>
        <Avatar name={cur.name} size={28} fs={10} />
        <span className="mselect-txt">
          <span className="mselect-name">{cur.name}</span>
          <span className="mselect-rel">{cur.rel}</span>
        </span>
        <span className={`mselect-chev ${open ? 'up' : ''}`}><Icon name="chevron" size={15} /></span>
      </button>
      {open && (
        <div className="mselect-pop">
          {options.map(o => (
            <button key={o.id} className={`mselect-opt ${o.id === value ? 'on' : ''}`}
              onClick={() => { onChange(o.id); setOpen(false); }}>
              <Avatar name={o.name} size={26} fs={10} />
              <span className="mselect-txt">
                <span className="mselect-name">{o.name}</span>
                <span className="mselect-rel">{o.rel}</span>
              </span>
              {o.id === value && <span className="mselect-check"><Icon name="check" size={13} /></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberPicker;
