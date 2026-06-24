import React, { useState } from 'react';
import { INITIAL_PATIENTS as PATIENTS } from '../data/mockReceptionData';

const TEMPLATES = [
  { title:'Appointment Reminder', text:'Hi {name}, this is a reminder for your appointment on {date} at {time}.' },
  { title:'Follow-up Reminder',   text:'Hi {name}, this is a reminder for your follow-up on {date}.' },
  { title:'General Notification', text:'Hi {name}, this is a message from {clinic_name}.' },
];

export const Communication: React.FC = () => {
  const [tab, setTab]         = useState<'send'|'history'>('send');
  const [toMode, setToMode]   = useState<'all'|'filter'|'select'>('all');
  const [template, setTmpl]   = useState('');
  const [mobiles, setMobiles] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent]       = useState(false);

  const charCount = message.length;
  const smsCount  = Math.ceil(charCount / 160) || 1;

  const applyTemplate = (text: string) => setMessage(text);

  const sendMessage = () => {
    if (!message.trim()) { alert('Please enter a message.'); return; }
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const HISTORY = [
    { date:'22 May 2025', to:'All Patients (240)', type:'Appointment Reminder', status:'Sent', delivered:236 },
    { date:'21 May 2025', to:'Selected (8)',        type:'Follow-up Reminder',   status:'Sent', delivered:8 },
    { date:'20 May 2025', to:'All Patients (238)',  type:'General Notification', status:'Sent', delivered:230 },
  ];

  return (
    <div className="rc-scroll rc-fade">
      <div className="rc-content">
        <div className="rc-card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'18px 22px 0' }}>
            <div style={{ fontWeight:800, fontSize:15 }}>Communication</div>
            <div style={{ fontSize:12.5, color:'var(--muted)', marginBottom:14 }}>Send SMS/notifications to patients for appointments and reminders.</div>
            <div className="rc-tabs">
              <button className={`rc-tab ${tab==='send'?'active':''}`} onClick={() => setTab('send')}>Send Message</button>
              <button className={`rc-tab ${tab==='history'?'active':''}`} onClick={() => setTab('history')}>Message History</button>
            </div>
          </div>

          {tab === 'send' ? (
            <div style={{ padding:'20px 22px' }}>
              <div className="rc-comm-layout">
                {/* Left: form */}
                <div>
                  {/* To */}
                  <div className="rc-form-group">
                    <div className="rc-field-label">To</div>
                    <div style={{ display:'flex', gap:18, marginBottom:10, fontSize:13 }}>
                      {(['all','filter','select'] as const).map(m => (
                        <label key={m} style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontWeight: toMode===m?700:400 }}>
                          <input type="radio" name="toMode" value={m} checked={toMode===m} onChange={() => setToMode(m)} style={{ accentColor:'var(--primary)' }} />
                          {m==='all'?'All Patients':m==='filter'?'By Filter':'Select Patients'}
                        </label>
                      ))}
                    </div>
                    {toMode === 'select' && (
                      <input className="rc-field-input" placeholder="Enter mobile numbers (comma separated)" value={mobiles} onChange={e => setMobiles(e.target.value)} />
                    )}
                  </div>

                  {/* Template */}
                  <div className="rc-form-group">
                    <div className="rc-field-label">Template</div>
                    <select className="rc-field-select" value={template}
                      onChange={e => { setTmpl(e.target.value); if (e.target.value) applyTemplate(e.target.value); }}>
                      <option value="">Select template</option>
                      {TEMPLATES.map(t => <option key={t.title} value={t.text}>{t.title}</option>)}
                    </select>
                  </div>

                  {/* Mobile (filter mode) */}
                  {toMode === 'filter' && (
                    <div className="rc-form-group">
                      <div className="rc-field-label">Mobile Number(s)</div>
                      <input className="rc-field-input" placeholder="Enter mobile numbers (comma separated)" value={mobiles} onChange={e => setMobiles(e.target.value)} />
                    </div>
                  )}

                  {/* Message */}
                  <div className="rc-form-group">
                    <div className="rc-field-label">Message</div>
                    <textarea className="rc-field-textarea" rows={5} placeholder="Type your message here..."
                      value={message} onChange={e => setMessage(e.target.value)} />
                    <div style={{ fontSize:11.5, color:'var(--muted)', marginTop:5 }}>
                      {charCount} / 160 Characters · {smsCount} SMS
                    </div>
                  </div>

                  {sent && (
                    <div style={{ background:'var(--gl)', border:'1px solid var(--green)', borderRadius:'var(--radius-xs)', padding:'10px 14px', fontSize:13, fontWeight:700, color:'var(--green)', marginBottom:14 }}>
                      ✓ Message sent successfully!
                    </div>
                  )}

                  <button className="rc-btn-primary" style={{ width:'100%', justifyContent:'center', padding:12, fontSize:14 }} onClick={sendMessage}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Send Message
                  </button>
                </div>

                {/* Right: quick templates */}
                <div>
                  <div style={{ fontWeight:800, fontSize:14, marginBottom:14, color:'var(--text)' }}>Quick Templates</div>
                  {TEMPLATES.map(t => (
                    <div key={t.title} className="rc-template-card" onClick={() => { applyTemplate(t.text); setTmpl(t.text); }}>
                      <div className="rc-template-title">{t.title}</div>
                      <div className="rc-template-text">{t.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding:'0 22px 22px' }}>
              <div style={{ overflowX:'auto' }}>
                <table className="rc-table">
                  <thead>
                    <tr>{['Date','Sent To','Message Type','Status','Delivered'].map(h=><th key={h} className="rc-th">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {HISTORY.map((h,i) => (
                      <tr key={i} className="rc-tr">
                        <td className="rc-td" style={{ color:'var(--muted)' }}>{h.date}</td>
                        <td className="rc-td" style={{ fontWeight:600 }}>{h.to}</td>
                        <td className="rc-td">{h.type}</td>
                        <td className="rc-td"><span className="rc-chip green">{h.status}</span></td>
                        <td className="rc-td" style={{ fontWeight:600, color:'var(--green)' }}>{h.delivered}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
