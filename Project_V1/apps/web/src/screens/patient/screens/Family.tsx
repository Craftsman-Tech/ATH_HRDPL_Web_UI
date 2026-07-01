import React, { useState, useEffect, useRef } from 'react';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';
import Badge from '../shared/Badge';
import SecHead from '../shared/SecHead';
import EmergencyCard from '../components/EmergencyCard';
import FolderModal from '../components/FolderModal';
import ExportModal from '../components/ExportModal';
import NotesModal from '../components/NotesModal';
import { useFamilyMembers, addFM, removeFM } from '../hooks/useFamilyMembers';
import { SEED_FAMILY, FAMILY_TIMELINE, FAMILY_FOLDERS, FAMILY_EMERGENCY, RELATIONS } from '../data/mockFamily';
import type { Member, AddedMember, MemberOption, Visit } from '../types/patient.types';

interface FamilyProps { member: Member; toast: (m: string) => void; }

const Family: React.FC<FamilyProps> = ({ member, toast }) => {
  const added = useFamilyMembers();
  const [adding, setAdding]         = useState(false);
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [notesVisit, setNotesVisit] = useState<Visit | null>(null);
  const [openTL, setOpenTL]         = useState<number | null>(0);
  const [yearFilter, setYearFilter] = useState('All');
  const [form, setForm] = useState({ name:'',relation:'Spouse',age:'',sex:'Female',blood:'O+',condition:'' });

  const allFamilyMembers: AddedMember[] = [
    ...SEED_FAMILY,
    ...added.filter(a => !SEED_FAMILY.some(s => s.id===a.id)),
  ];
  const [selId, setSelId] = useState(allFamilyMembers[0]?.id ?? '');
  const curMember = allFamilyMembers.find(m => m.id===selId) ?? allFamilyMembers[0];
  const pickerOptions: MemberOption[] = allFamilyMembers.map(m => ({ id:m.id, name:m.name, rel:m.relation }));

  const submitAdd = () => {
    if (!form.name.trim()) { toast('Please enter a name'); return; }
    const newId = 'm'+Date.now();
    addFM({ id:newId, name:form.name.trim(), relation:form.relation, age:form.age?+form.age:null, sex:form.sex, blood:form.blood, condition:form.condition });
    setSelId(newId);
    setAdding(false);
    setForm({ name:'',relation:'Spouse',age:'',sex:'Female',blood:'O+',condition:'' });
    toast(`${form.name.trim()} added to your family`);
  };

  const folders = FAMILY_FOLDERS[selId] ?? [
    { name:'Lab Reports',   count:0, meta:'No reports yet',    ic:'lab',     color:'#4F7CFF', bg:'#eaf0ff' },
    { name:'Prescriptions', count:0, meta:'No prescriptions',  ic:'pill',    color:'#0E9384', bg:'#eef6f4' },
    { name:'Visit Notes',   count:0, meta:'No notes yet',      ic:'doc',     color:'#15a06b', bg:'#dbf3e6' },
    { name:'Imaging',       count:0, meta:'No imaging yet',    ic:'records', color:'#e0951a', bg:'#fdf3e3' },
  ];
  const timeline = FAMILY_TIMELINE[selId] ?? [];
  const years = ['All', ...Array.from(new Set(timeline.map(v => v.date.split(', ')[1])))];
  const filteredTL = yearFilter==='All' ? timeline : timeline.filter(v => v.date.endsWith(yearFilter));
  const emerg = FAMILY_EMERGENCY[selId] ?? { allergies:'None known', conditions:'No chronic conditions', contact:member.name+' · +91 98765 43210' };

  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPickerOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="screen screen-anim">
      <div className="card family-bar" style={{ padding:20 }}>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <div style={{ width:36,height:36,borderRadius:10,background:'#eef6f4',color:'#0E9384',display:'grid',placeItems:'center' }}>
            <Icon name="users" size={17} />
          </div>
          <div>
            <div style={{ fontWeight:700,fontSize:15 }}>Family Members</div>
            <div style={{ fontSize:12.5,color:'var(--ink3)' }}>{allFamilyMembers.length} people in your household</div>
          </div>
        </div>
        <div className="family-bar-r">
          <div className="mselect" ref={pickerRef}>
            <span className="mselect-label">Records for</span>
            <button className="mselect-btn" onClick={() => setPickerOpen(o => !o)}>
              <Avatar name={curMember?.name??'?'} size={28} fs={10} />
              <span className="mselect-txt">
                <span className="mselect-name">{curMember?.name??'Select'}</span>
                <span className="mselect-rel">{curMember?.relation??''}</span>
              </span>
              <span className={`mselect-chev ${pickerOpen?'up':''}`}><Icon name="chevron" size={15} /></span>
            </button>
            {pickerOpen && (
              <div className="mselect-pop">
                {pickerOptions.map(o => (
                  <button key={o.id} className={`mselect-opt ${o.id===selId?'on':''}`}
                    onClick={() => { setSelId(o.id); setPickerOpen(false); setYearFilter('All'); setOpenTL(null); }}>
                    <Avatar name={o.name} size={26} fs={10} />
                    <span className="mselect-txt"><span className="mselect-name">{o.name}</span><span className="mselect-rel">{o.rel}</span></span>
                    {o.id===selId && <span className="mselect-check"><Icon name="check" size={13} /></span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button style={{ padding:'9px 16px',background:'#0E9384',color:'#fff',borderRadius:10,display:'flex',alignItems:'center',gap:6,fontWeight:600,fontSize:13.5 }} onClick={() => setAdding(true)}>
            <Icon name="plus" size={15} />Add member
          </button>
        </div>
      </div>

      {adding && (
        <div className="card add-form" style={{ padding:22 }}>
          <SecHead icon="plus" title="Add family member" sub="Emergency card and records will be created automatically" />
          <div className="af-grid">
            <label className="af-field"><span>Full name</span><input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. David Mitchell" /></label>
            <label className="af-field"><span>Relationship</span><select value={form.relation} onChange={e => setForm(f=>({...f,relation:e.target.value}))}>{RELATIONS.map(r=><option key={r}>{r}</option>)}</select></label>
            <label className="af-field"><span>Age</span><input type="number" value={form.age} onChange={e => setForm(f=>({...f,age:e.target.value}))} placeholder="e.g. 36" /></label>
            <label className="af-field"><span>Sex</span><select value={form.sex} onChange={e => setForm(f=>({...f,sex:e.target.value}))}>{['Female','Male','Other'].map(o=><option key={o}>{o}</option>)}</select></label>
            <label className="af-field"><span>Blood group</span><select value={form.blood} onChange={e => setForm(f=>({...f,blood:e.target.value}))}>{['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(o=><option key={o}>{o}</option>)}</select></label>
            <label className="af-field"><span>Known condition <em>(optional)</em></span><input value={form.condition} onChange={e => setForm(f=>({...f,condition:e.target.value}))} placeholder="e.g. Type 2 Diabetes" /></label>
          </div>
          <div className="af-actions">
            <button className="btn btn-outline" style={{ padding:'9px 16px',border:'1px solid var(--line)' }} onClick={() => setAdding(false)}>Cancel</button>
            <button style={{ padding:'9px 16px',background:'#0E9384',color:'#fff',borderRadius:10,display:'flex',alignItems:'center',gap:6,fontWeight:600 }} onClick={submitAdd}>
              <Icon name="plus" size={15} />Add member
            </button>
          </div>
        </div>
      )}

      {curMember && (
        <div className="grid-2c">
          <div className="col-main">
            <div className="card" style={{ padding:22 }}>
              <SecHead icon="records" title={`${curMember.name}'s Records`} sub="Health documents and folders"
                right={<button className="link-btn" onClick={() => setShowExport(true)}><Icon name="download" size={14} />Export all</button>} />
              <div className="folder-grid">
                {folders.map(f => (
                  <button key={f.name} className="folder" onClick={() => f.count>0 ? setOpenFolder(f.name) : toast('No documents in this folder yet')}>
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
              <SecHead icon="clock" title="Visit Timeline" sub={`Care history for ${curMember.name}`}
                right={<select value={yearFilter} onChange={e=>setYearFilter(e.target.value)} style={{ padding:'6px 11px',borderRadius:9,border:'1px solid var(--line)',fontSize:13,background:'#fbfdfc' }}>
                  {years.map(y=><option key={y}>{y}</option>)}
                </select>} />
              {filteredTL.length===0
                ? <div className="empty"><div>No visits on record yet</div></div>
                : <div className="tl">
                    {filteredTL.map((v,i) => {
                      const isOpen = openTL===i;
                      return (
                        <div key={i} className="tl-item">
                          <div className="tl-line">
                            <div className="tl-node" style={{ background:v.bg,color:v.color }}><Icon name={v.node} size={17} /></div>
                            {i<filteredTL.length-1 && <div className="tl-bar" />}
                          </div>
                          <div className="tl-card">
                            <button className="tl-head" onClick={() => setOpenTL(isOpen?null:i)}>
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
                  </div>}
            </div>
          </div>

          <div className="col-side">
            <div className="card dossier" style={{ padding:22 }}>
              <div className="dossier-head">
                <Avatar name={curMember.name} size={56} fs={20} />
                <div>
                  <div className="dossier-name">{curMember.name}</div>
                  <div className="dossier-rel">{curMember.relation}{curMember.age?` · ${curMember.age} yrs`:''}{curMember.sex?` · ${curMember.sex}`:''}</div>
                </div>
                <span className="dossier-blood">{curMember.blood}</span>
              </div>
              {!SEED_FAMILY.some(s => s.id===curMember.id) && (
                <button className="dossier-remove" onClick={() => { removeFM(curMember.id); setSelId(allFamilyMembers.find(m=>m.id!==curMember.id)?.id??''); toast(`${curMember.name} removed`); }}>
                  <Icon name="x" size={13} />Remove member
                </button>
              )}
            </div>

            <EmergencyCard
              name={curMember.name} blood={curMember.blood}
              allergies={emerg.allergies}
              conditions={curMember.condition || 'None known'}
              contact={emerg.contact}
              onCall={() => toast(`Calling ${emerg.contact.split(' · ')[0]}`)} />

            <div className="card" style={{ padding:22 }}>
              <SecHead icon="heart" title="Medical History" sub="Conditions &amp; hereditary risk" />
              {curMember.condition
                ? <div className="cond-list"><div className="cond"><span className="cond-ic"><Icon name="alert" size={15} /></span><div><div className="cond-name">{curMember.condition}</div><div className="cond-note">Self-reported</div></div></div></div>
                : <div className="empty"><span style={{ color:'#15a06b' }}><Icon name="check" size={22} /></span><div>No conditions on record</div></div>}
            </div>
          </div>
        </div>
      )}

      {!curMember && (
        <div className="card" style={{ padding:40,textAlign:'center' }}>
          <div className="empty"><Icon name="users" size={28} /><div>No family members yet</div></div>
        </div>
      )}

      {openFolder && curMember && <FolderModal folder={openFolder} memberName={curMember.name} onClose={() => setOpenFolder(null)} toast={toast} />}
      {showExport && <ExportModal title={`Export ${curMember?.name??''}'s Records`} onClose={() => setShowExport(false)} onDownload={(f,t)=>toast(`ZIP: ${f} → ${t}`)} />}
      {notesVisit && <NotesModal visit={notesVisit} onClose={() => setNotesVisit(null)} />}
    </div>
  );
};

export default Family;
