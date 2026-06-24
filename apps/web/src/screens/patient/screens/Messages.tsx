import React, { useState, useEffect, useRef } from 'react';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';
import { THREADS } from '../data/mockMessages';
import type { Thread } from '../types/patient.types';

interface MessagesProps { toast: (m: string) => void; }

const Messages: React.FC<MessagesProps> = ({ toast }) => {
  const [threads, setThreads] = useState<Thread[]>(THREADS);
  const [activeId, setActiveId] = useState('t1');
  const [draft, setDraft] = useState('');
  const active = threads.find(t => t.id === activeId) ?? threads[0];
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [activeId, threads]);

  const send = () => {
    const text = draft.trim(); if (!text) return;
    setThreads(prev => prev.map(t => t.id===activeId ? { ...t, msgs:[...t.msgs,{from:'patient',text}] } : t));
    setDraft(''); toast('Message sent');
  };

  return (
    <div className="screen screen-anim">
      <div className="card msg-wrap">
        <div className="msg-layout">
          <div className="msg-list">
            <div className="msg-list-head"><Icon name="message" size={18} />Conversations<span className="msg-count">{threads.filter(t=>t.unread).length}</span></div>
            {threads.map(t => (
              <button key={t.id} className={`msg-item ${t.id===activeId?'on':''}`}
                onClick={() => { setActiveId(t.id); setThreads(p=>p.map(x=>x.id===t.id?{...x,unread:false}:x)); }}>
                <Avatar name={t.name} size={42} fs={14} />
                <div className="msg-item-body">
                  <div className="msg-item-top"><span className="msg-from">{t.name}</span><span className="msg-time">{t.time}</span></div>
                  <div className="msg-spec">{t.spec}</div>
                  <div className="msg-preview">{t.preview}</div>
                </div>
                {t.unread && <span className="msg-unread" />}
              </button>
            ))}
          </div>
          <div className="msg-thread">
            <div className="msg-thread-head">
              <Avatar name={active.name} size={42} fs={14} />
              <div><div className="msg-thread-name">{active.name}</div><div className="msg-thread-spec">{active.spec}</div></div>
              <button className="icon-btn" style={{ marginLeft:'auto' }} onClick={() => toast('Starting call')}><Icon name="phone" size={17} /></button>
            </div>
            <div className="msg-thread-body" ref={bodyRef} style={{ display:'flex',flexDirection:'column',gap:12 }}>
              {active.msgs.map((m,i) => (
                <div key={i} className="msg-bubble" style={m.from==='patient'
                  ?{alignSelf:'flex-end',borderRadius:'16px 4px 16px 16px',background:'var(--teal)',color:'#fff'}
                  :{alignSelf:'flex-start'}}>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
            <div className="msg-compose">
              <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type a message…"
                onKeyDown={e => { if (e.key==='Enter') send(); }} />
              <button className="msg-send" onClick={send}><Icon name="send" size={17} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
