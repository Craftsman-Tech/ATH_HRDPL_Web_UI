import React, { useState, useEffect, useRef } from 'react';
import type { Convo, Message } from '../types/doctor.types';
import { CONVOS } from '../data/mockConversations';

export const Messages: React.FC = () => {
  const [sel, setSel] = useState(0);
  const [draft, setDraft] = useState('');
  const [convos, setConvos] = useState<Convo[]>(CONVOS);
  const threadRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight; }, [sel, convos]);
  const send = () => {
    if (!draft.trim()) return;
    const msg: Message = { from:'doctor', text:draft.trim(), time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) };
    setConvos(c => c.map((cv,i) => i === sel ? { ...cv, msgs:[...cv.msgs,msg], last:draft.trim() } : cv));
    setDraft('');
  };
  return (
    <div className="dr-msg-layout dr-fade">
      <div className="dr-msg-sidebar">
        <div className="dr-msg-list-header">Messages</div>
        {convos.map((c, i) => (
          <div key={i} className={`dr-msg-convo-item ${sel === i ? 'active' : ''}`} onClick={() => setSel(i)}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
              <span style={{ fontWeight:700, fontSize:13.5 }}>{c.name}</span>
              <span style={{ fontSize:11, color:'var(--muted)' }}>{c.time}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:12.5, color:'var(--muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:180 }}>{c.last}</span>
              {c.unread > 0 && <span className="dr-msg-unread">{c.unread}</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="dr-msg-main">
        <div className="dr-msg-thread-header">{convos[sel].name}</div>
        <div className="dr-msg-thread" ref={threadRef}>
          {convos[sel].msgs.map((m, i) => (
            <div key={i} style={{ display:'flex', justifyContent: m.from === 'doctor' ? 'flex-end' : 'flex-start' }}>
              <div className={`dr-msg-bubble ${m.from}`}>
                {m.text}
                <div className="dr-msg-bubble-time">{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="dr-msg-compose">
          <input className="dr-msg-input" placeholder="Type a message..." value={draft}
            onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
          <button className="dr-msg-send" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
};
