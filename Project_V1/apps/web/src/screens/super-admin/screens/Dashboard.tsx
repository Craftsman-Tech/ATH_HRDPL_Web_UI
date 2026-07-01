/**
 * Dashboard.tsx — landing view for the ATH · Support Console.
 * Renders: its own page header, the KPI strip, a Quick actions grid (one tile
 * per sidebar destination — click to navigate), and three summary panels
 * (shared approval queue, recent activity, newest hospitals). Every "view all"
 * affordance deep-links into the matching operational screen.
 */
import React from 'react';
import { HOSPITALS, ACTIVITY, KPIS, QUICK_ACTIONS, stateName } from '../data/mockData';
import { useApprovals } from '../shared/approvalsStore';
import { StatusBadge, PlanPill, MiniBadge } from '../shared/Badges';
import { Icon } from '../shared/Icons';
import type { ViewId } from '../types/admin.types';

const QA_ICON: Record<string, React.FC<{ size?: number }>> = {
  hospitals: Icon.Hospital, approvals: Icon.Approvals, licenses: Icon.License,
  activity: Icon.Activity, analytics: Icon.Analytics, billing: Icon.Billing, settings: Icon.Settings,
};

export const Dashboard: React.FC<{
  onNav: (v: ViewId) => void;
  onRegister: () => void;
  onRegisterPharmacy: () => void;
  onRegisterLaboratory: () => void;
  onExport: () => void;
}> = ({ onNav, onRegister, onRegisterPharmacy, onRegisterLaboratory, onExport }) => {
  const store = useApprovals();
  const queue = store.shared.slice(0, 5);
  const recent = ACTIVITY.slice(0, 5);
  const newest = HOSPITALS.slice(0, 5);

  return (
    <section className="view">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <p className="eyebrow">Support console</p>
            <h1 className="page-title">Operations <em>dashboard</em></h1>
            <p className="page-sub">A live snapshot of tenants, the shared approval queue, compliance and
              recent platform activity — everything the support desk touches, in one place.</p>
          </div>
          <div className="page-head-actions">
            <button className="btn btn-ghost" onClick={onExport}><Icon.Download size={14} /> Export</button>
            <div className="reg-group">
              <button className="btn btn-primary" onClick={onRegister}><Icon.Plus size={14} /> Register hospital</button>
              <button className="btn btn-ghost btn-reg-alt" onClick={onRegisterPharmacy}><Icon.Plus size={14} /> Register pharmacy</button>
              <button className="btn btn-ghost btn-reg-alt" onClick={onRegisterLaboratory}><Icon.Plus size={14} /> Register laboratory</button>
            </div>
          </div>
        </div>
      </div>

      <div className="kpis">
        {KPIS.map(k => (
          <div className="kpi" key={k.label} style={{ ['--accent' as string]: k.accent } as React.CSSProperties}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-val">{k.value}</div>
            <div className="kpi-delta">
              {k.trend && <span className={k.trend === 'up' ? 'up' : 'dn'}>{k.trendText}</span>}
              {k.deltaText}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions — one tile per sidebar destination */}
      <div className="dash" style={{ paddingBottom: 8 }}>
        <div className="dash-card">
          <div className="dash-card-head">
            <div className="dash-card-title">Quick actions</div>
            <span className="meta-line">Jump to any section of the console</span>
          </div>
          <div className="qa-grid">
            {QUICK_ACTIONS.map(a => {
              const I = QA_ICON[a.id] ?? Icon.Dashboard;
              return (
                <button key={a.id} className="qa-tile" onClick={() => onNav(a.id)}>
                  <span className="qa-ico"><I size={18} /></span>
                  <span className="qa-text">
                    <span className="qa-label">{a.label}</span>
                    <span className="qa-desc">{a.desc}</span>
                  </span>
                  <Icon.Chevron size={13} strokeWidth={2.5} className="qa-caret" style={{ transform: 'rotate(-90deg)' }} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="dash">
        <div className="dash-grid">
          {/* Shared approval queue */}
          <div className="dash-card">
            <div className="dash-card-head">
              <div className="dash-card-title">Shared approval queue</div>
              <button className="dash-link" onClick={() => onNav('approvals')}>
                Review all <Icon.Chevron size={11} strokeWidth={2.5} style={{ transform: 'rotate(-90deg)' }} />
              </button>
            </div>
            <div className="dash-list">
              {queue.map(a => (
                <button key={a.id} className="dash-row" onClick={() => onNav('approvals')}>
                  <span className="dash-row-mark" style={{ background: a.accent }}>{a.mark}</span>
                  <span className="dash-row-main">
                    <span className="dash-row-name">{a.name}</span>
                    <span className="dash-row-sub">{a.city}, {stateName(a.state)}</span>
                  </span>
                  {a.queue === 'other'
                    ? <MiniBadge cls="b-active" label="In review" />
                    : <MiniBadge cls={a.status === 'overdue' ? 'b-pending' : a.status === 'needs-info' ? 'b-onboarding' : 'b-pending'} label={a.status === 'overdue' ? 'Overdue' : a.status === 'needs-info' ? 'Needs info' : 'Pending'} />}
                </button>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="dash-card">
            <div className="dash-card-head">
              <div className="dash-card-title">Recent activity</div>
              <button className="dash-link" onClick={() => onNav('activity')}>
                View all <Icon.Chevron size={11} strokeWidth={2.5} style={{ transform: 'rotate(-90deg)' }} />
              </button>
            </div>
            <div className="dash-acts">
              {recent.map(e => (
                <div key={e.id} className={`dash-act ${e.kind}`}>
                  <span className="dash-act-dot" />
                  <div className="dash-act-body">
                    <div className="dash-act-title" dangerouslySetInnerHTML={{ __html: e.title }} />
                    <div className="dash-act-time">{e.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newest hospitals */}
        <div className="dash-card">
          <div className="dash-card-head">
            <div className="dash-card-title">Newest hospitals</div>
            <button className="dash-link" onClick={() => onNav('hospitals')}>
              All hospitals <Icon.Chevron size={11} strokeWidth={2.5} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
          <div className="dash-table-wrap">
            <table>
              <thead>
                <tr><th>Hospital</th><th>City</th><th>Plan</th><th>Status</th><th>Registered</th></tr>
              </thead>
              <tbody>
                {newest.map(h => (
                  <tr key={h.id} onClick={() => onNav('hospitals')}>
                    <td>
                      <div className="hosp-cell">
                        <div className="hosp-mark" style={{ background: h.accent }}>{h.mark}</div>
                        <div>
                          <div className="hosp-name">{h.name}</div>
                          <div className="hosp-id mono">{h.id}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 13, color: 'var(--ink-800)' }}>{h.city}</span></td>
                    <td><PlanPill plan={h.plan} /></td>
                    <td><StatusBadge status={h.status} /></td>
                    <td><span className="meta-line">{h.registered}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
