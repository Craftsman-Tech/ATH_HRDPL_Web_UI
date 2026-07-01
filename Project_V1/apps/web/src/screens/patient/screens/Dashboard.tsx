import React, { useState } from 'react';
import Icon from '../shared/Icon';
import Avatar from '../shared/Avatar';
import Badge from '../shared/Badge';
import SecHead from '../shared/SecHead';
import Ring from '../shared/Ring';
import { STATS, ALERTS, FEED, QUICK, WELLNESS, INSIGHTS, ADVICE, CHANGED } from '../data/mockDashboard';
import type { Member, ScreenId } from '../types/patient.types';

const ALERT_NAV: Record<string, ScreenId> = {
  'Request Refill': 'meds',
  'View Details':   'appts',
  'View Results':   'lab',
};

interface DashboardProps { member: Member; onNav: (s: ScreenId) => void; toast: (m: string) => void; }

const Dashboard: React.FC<DashboardProps> = ({ member, onNav, toast }) => {
  const first = member.name.split(' ')[0];
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);
  const visibleAlerts = ALERTS.filter((_, i) => !dismissedAlerts.includes(i));

  return (
    <div className="screen screen-anim">
      <div className="hero">
        <div className="hero-glow" />
        <div className="hero-main">
          <Avatar name={member.name} size={64} fs={22} />
          <div>
            <div className="hero-greet">Good morning,</div>
            <div className="hero-name">{first} 👋</div>
            <div className="hero-meta">
              <span><span className="hm-k">ID</span>{member.id}</span>
              <span className="hm-sep" />
              <span><span className="hm-k">Blood</span>{member.blood}</span>
              <span className="hm-sep" />
              <span><span className="hm-k">Next</span>May 15 · Dr. Chen</span>
            </div>
          </div>
        </div>
        <div className="hero-actions">
          <button className="hero-btn" onClick={() => onNav('appts')}><Icon name="calendar" size={16} />Book Appointment</button>
          <button className="hero-btn ghost" onClick={() => onNav('records')}><Icon name="records" size={16} />My Records</button>
        </div>
      </div>

      <div className="stat-grid">
        {STATS.map(s => (
          <div key={s.label} className="card card-hover" style={{ padding:18 }}>
            <div className="stat-top">
              <div className="stat-ic" style={{ background:s.bg,color:s.color }}><Icon name={s.ic} size={19} /></div>
              <span className="stat-delta" style={{ color:s.good?'#15a06b':'#e0414b' }}>
                <Icon name={s.up?'up':'down'} size={13} />{s.delta}
              </span>
            </div>
            <div><span className="stat-val">{s.val}</span><span className="stat-unit">{s.unit}</span></div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2c">
        <div className="col-main">
          <div className="card" style={{ padding:22 }}>
            <SecHead icon="spark" title="Quick Actions" sub="Jump straight to what you need" />
            <div className="qa-grid">
              {QUICK.map(q => (
                <button key={q.label} className="qa" onClick={() => onNav(q.to)}>
                  <div className="qa-ic" style={{ background:q.bg,color:q.color }}><Icon name={q.ic} size={20} /></div>
                  <div className="qa-label">{q.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding:22 }}>
            <SecHead icon="activity" title="Recent Changes" sub="vs. last quarter" />
            <div className="changed-grid">
              {CHANGED.map(c => (
                <div key={c.label} className="changed">
                  <div className="changed-head">
                    <div className="changed-ic" style={{ background:c.bg,color:c.color }}><Icon name={c.icon} size={17} /></div>
                    {c.label}
                  </div>
                  <div className="changed-vals">
                    <span className="changed-from">{c.from}</span>
                    <Icon name="arrowR" size={12} />
                    <span className="changed-to" style={{ color:c.color }}>{c.to}</span>
                  </div>
                  <Badge text={c.status} color={c.color} bg={c.bg} dot />
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding:22 }}>
            <SecHead icon="target" title="Wellness Score" sub="Your weekly health snapshot" />
            <div className="wellness">
              <div className="wellness-ring">
                <Ring value={87} size={132} stroke={12}>
                  <span className="ring-big">87</span>
                  <span className="ring-cap">Excellent</span>
                </Ring>
              </div>
              <div className="wellness-bars">
                {WELLNESS.map(w => (
                  <div key={w.label}>
                    <div className="wb-top">
                      <span className="wb-ic"><Icon name={w.ic} size={15} /></span>{w.label}
                      <span className="wb-val">{w.val}</span>
                    </div>
                    <div className="pbar" style={{ height:8,background:'#eef2f1' }}>
                      <div className="pbar-fill" style={{ width:`${w.pct}%`,background:w.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card insights" style={{ padding:22 }}>
            <div className="insights-head">
              <div className="insights-ai"><Icon name="spark" size={18} /></div>
              <div><div className="sec-title">Health Insights</div><div className="sec-sub">Personalised by Vexoo AI</div></div>
            </div>
            <div className="insights-list">
              {INSIGHTS.map((it,i) => (
                <div key={i} className="insight">
                  <div className="insight-ic" style={{ background:it.bg,color:it.color }}><Icon name={it.ic} size={15} /></div>
                  <div className="insight-text">{it.text}</div>
                </div>
              ))}
            </div>
            <div className="insights-foot"><Icon name="shield" size={13} />Insights are informational and not a substitute for medical advice.</div>
          </div>
        </div>

        <div className="col-side">
          <div className="card" style={{ padding:22 }}>
            <SecHead icon="bell" title="Action Needed" />
            <div className="alerts">
              {visibleAlerts.length === 0
                ? <div className="empty"><Icon name="check" size={20} /><div>All caught up!</div></div>
                : visibleAlerts.map((a, vi) => {
                    void vi;
                    const origIdx = ALERTS.indexOf(a);
                    return (
                      <div key={origIdx} className="alert" style={{ background:a.bg,borderColor:a.border }}>
                        <div className="alert-ic" style={{ background:'#fff',color:a.color }}><Icon name={a.ic} size={18} /></div>
                        <div className="alert-body">
                          <div className="alert-title">{a.title}<span className="alert-time">{a.time}</span></div>
                          <div className="alert-text">{a.text}</div>
                          <div className="alert-actions">
                            <button className="link-btn" style={{ padding:0 }} onClick={() => onNav(ALERT_NAV[a.cta] ?? 'home')}>{a.cta}</button>
                            <button className="alert-dismiss" onClick={() => setDismissedAlerts(d => [...d,origIdx])}>Dismiss</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>

          <div className="card" style={{ padding:22 }}>
            <SecHead icon="clock" title="Recent Activity" />
            <div className="feed">
              {FEED.map((f,i) => (
                <div key={i} className="feed-item">
                  <div className="feed-ic" style={{ background:f.bg,color:f.color }}><Icon name={f.ic} size={15} /></div>
                  <div><div className="feed-text">{f.text}</div><div className="feed-time">{f.time}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding:22 }}>
            <SecHead icon="stetho" title="Dr. Chen's Advice" />
            <div className="advice">
              {ADVICE.map(a => (
                <div key={a.title} className="advice-item">
                  <div className="advice-ic"><Icon name={a.ic} size={16} /></div>
                  <div><div className="advice-text">{a.title}</div><div className="advice-detail">{a.detail}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
