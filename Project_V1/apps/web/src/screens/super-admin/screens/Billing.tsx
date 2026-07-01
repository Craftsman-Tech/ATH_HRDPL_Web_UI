/**
 * Billing.tsx — subscription tiers, tenant distribution and recent invoices.
 */
import React from 'react';
import { BILLING_KPIS, PLAN_CARDS, INVOICES } from '../data/mockData';
import { Icon } from '../shared/Icons';
import { PlanPill } from '../shared/Badges';
import { exportExcel } from '../shared/exportExcel';

const KPI_ICON: Record<string, React.FC<{ size?: number }>> = {
  billing: Icon.Billing, hospital: Icon.Hospital, warning: Icon.Warning, reset: Icon.Reset,
};

export const Billing: React.FC = () => {
  const exportInvoices = () => {
    exportExcel('vexoo-invoices',
      ['Invoice', 'Hospital', 'Plan', 'Amount', 'Date', 'Status'],
      INVOICES.map(i => [i.id, i.hospital, i.plan, i.amount, i.date, i.status]));
  };

  return (
    <section className="view">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <p className="eyebrow">Revenue</p>
            <h1 className="page-title">Billing &amp; <em>plans</em></h1>
            <p className="page-sub">Subscription tiers offered to hospitals, current distribution of tenants, and recent invoices across the platform.</p>
          </div>
          <div className="page-head-actions">
            <button className="btn btn-ghost" onClick={exportInvoices}><Icon.Download size={14} /> Export invoices</button>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="kpis">
        {BILLING_KPIS.map(k => {
          const I = KPI_ICON[k.icon] ?? Icon.Billing;
          return (
            <div className="kpi bill-kpi" key={k.label}>
              <div className="bill-kpi-head"><span className="kpi-label">{k.label}</span><span className="bill-kpi-ico"><I size={15} /></span></div>
              <div className="kpi-val">{k.value}</div>
              <div className="kpi-delta">{k.trend && <span className="up">{k.trendText}</span>}{k.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Plan cards */}
      <div className="plan-grid">
        {PLAN_CARDS.map(p => (
          <article key={p.id} className={`plan-card ${p.popular ? 'popular' : ''}`}>
            {p.popular && <div className="plan-pop">Most popular</div>}
            <div className="plan-name">{p.name}</div>
            <div className="plan-price"><span className="amt">{p.price}</span><span className="cad">{p.cadence}</span></div>
            <div className="plan-tag">{p.tagline}</div>
            <div className="plan-count"><Icon.Hospital size={13} /> <b>{p.hospitals}</b> hospitals on this plan</div>
            <ul className="plan-feats">
              {p.features.map(f => <li key={f}><Icon.Check size={11} strokeWidth={3} /> {f}</li>)}
            </ul>
          </article>
        ))}
      </div>

      {/* Recent invoices */}
      <div className="dash">
        <div className="dash-card">
          <div className="dash-card-head">
            <div>
              <div className="dash-card-title">Recent invoices</div>
              <div className="meta-line" style={{ marginTop: 2 }}>Latest billing activity across tenants</div>
            </div>
            <button className="dash-link">View all <Icon.Chevron size={11} strokeWidth={2.5} style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
          <div className="dash-table-wrap">
            <table>
              <thead>
                <tr><th>Invoice</th><th>Hospital</th><th>Plan</th><th>Amount</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {INVOICES.map(i => (
                  <tr key={i.id} className="no-pointer">
                    <td><span className="mono" style={{ fontSize: 12, color: 'var(--ink-700)' }}>{i.id}</span></td>
                    <td><span style={{ fontSize: 13, color: 'var(--ink-800)', fontWeight: 500 }}>{i.hospital}</span></td>
                    <td><PlanPill plan={i.plan} /></td>
                    <td><span className="mono" style={{ fontSize: 13, color: 'var(--ink-900)' }}>{i.amount}</span></td>
                    <td><span className="meta-line">{i.date}</span></td>
                    <td>
                      <span className={`badge ${i.status === 'paid' ? 'b-active' : 'b-suspended'}`}>
                        <span className="dot" />{i.status === 'paid' ? 'Paid' : 'Failed'}
                      </span>
                    </td>
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
