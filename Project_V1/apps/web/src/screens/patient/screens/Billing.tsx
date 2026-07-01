import React from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import SecHead from '../shared/SecHead';
import { INVOICES } from '../data/mockBilling';

interface BillingProps { toast: (m: string) => void; }

const Billing: React.FC<BillingProps> = ({ toast }) => (
  <div className="screen screen-anim">
    <div className="card" style={{ padding:22 }}>
      <SecHead icon="billing" title="Billing & Payments" sub="Invoices, insurance and coverage" />
      <div className="bill-stats">
        {[
          { label:'Outstanding Balance',val:'\u20B90',   sub:'All invoices settled' },
          { label:'Paid This Year',      val:'\u20B91,180',sub:'4 invoices'          },
          { label:'Insurance Covered',   val:'\u20B9940', sub:'80% of total'        },
        ].map(s => (
          <div key={s.label} className="bill-stat">
            <div className="bs-label">{s.label}</div>
            <div className="bs-val">{s.val}</div>
            <div className="bs-sub">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="grid-2c">
      <div className="col-main">
        <div className="card" style={{ padding:22 }}>
          <SecHead icon="doc" title="Invoice History"
            right={<button className="link-btn" onClick={() => toast('Downloading statements')}><Icon name="download" size={14} />Statements</button>} />
          <div className="bill-list">
            {INVOICES.map(inv => (
              <div key={inv.id} className="bill-row">
                <div className="bill-ic" style={{ background:'#dbf3e6',color:'#15a06b' }}><Icon name="check" size={17} /></div>
                <div className="bill-info">
                  <div className="bill-desc">{inv.desc}</div>
                  <div className="bill-meta">{inv.id} · {inv.date} · {inv.method}</div>
                </div>
                <div className="bill-amt">{inv.amount}</div>
                <Badge text={inv.status} color="#15a06b" bg="#dbf3e6" dot />
                <button className="icon-btn" style={{ width:36,height:36 }} onClick={() => toast(`Downloading ${inv.id}`)}><Icon name="download" size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-side">
        <div className="ins-card">
          <div className="ins-top"><div className="ins-brand"><Icon name="shield" size={18} />HealthFirst</div><div className="ins-status">Active</div></div>
          <div className="ins-member">Sarah Johnson</div>
          <div className="ins-grid">
            <div><div className="ins-k">Member ID</div><div className="ins-v">HF-88204517</div></div>
            <div><div className="ins-k">Group</div><div className="ins-v">GRP-4471</div></div>
            <div><div className="ins-k">Plan</div><div className="ins-v">Premium PPO</div></div>
            <div><div className="ins-k">Valid Thru</div><div className="ins-v">12 / 2026</div></div>
          </div>
        </div>
        <div className="card" style={{ padding:22 }}>
          <SecHead icon="target" title="Coverage" />
          <div className="cov">
            {[
              { label:'Annual Deductible',used:480, total:1000,note:'\u20B9520 remaining', color:'#0E9384' },
              { label:'Out-of-Pocket Max',used:1180,total:5000,note:'\u20B93,820 remaining',color:'#4F7CFF' },
            ].map(c => (
              <div key={c.label}>
                <div className="cov-top"><span>{c.label}</span><span className="cov-v">\u20B9{c.used} / \u20B9{c.total}</span></div>
                <div className="pbar" style={{ height:9,background:'#eef2f1' }}>
                  <div className="pbar-fill" style={{ width:`${(c.used/c.total)*100}%`,background:c.color }} />
                </div>
                <div className="cov-note">{c.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Billing;
