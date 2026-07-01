// ============================================================================
//  Dashboard.tsx — Lab workload overview for today (live counts from store).
// ============================================================================
import React from 'react';
import type { ScreenId } from '../types/labtech.types';
import { useLab } from '../data/labStore';
import { SvgIcon } from '../shared/SvgIcon';

const I = {
  flask: 'M9 3h6M10 3v6.5L4.5 19a2 2 0 001.8 3h11.4a2 2 0 001.8-3L14 9.5V3',
  drop:  'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z',
  edit:  'M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z',
  check: 'M20 6L9 17l-5-5',
  tool:  'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  box:   'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  bell:  'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
  scan:  'M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2',
};

export const Dashboard: React.FC<{ onNav: (s: ScreenId) => void }> = ({ onNav }) => {
  const lab = useLab();

  const pendingOrders   = [...lab.inhouse, ...lab.external].filter(o => o.status === 'New').length;
  const waitingCollect  = lab.samples.filter(s => s.status === 'Pending').length;
  const inProcessing    = lab.processing.filter(s => s.status === 'Running' || s.status === 'Paused').length;
  const resultsPending  = lab.results.length;
  const awaitingValidate= lab.completed.filter(c => c.outcome === 'Abnormal').length;
  const statTests       = [...lab.inhouse, ...lab.external].filter(o => o.priority === 'STAT').length;

  const STATS = [
    { label: 'Pending Test Orders',    val: pendingOrders,    cls: 's-amber',   icon: I.flask, to: 'inhouse'    as ScreenId },
    { label: 'Waiting for Collection', val: waitingCollect,   cls: 's-blue',    icon: I.drop,  to: 'collection' as ScreenId },
    { label: 'In Processing',          val: inProcessing,     cls: 's-mineral', icon: I.flask, to: 'processing' as ScreenId },
    { label: 'Results Pending Entry',  val: resultsPending,   cls: 's-neutral', icon: I.edit,  to: 'results'    as ScreenId },
    { label: 'Awaiting Validation',    val: awaitingValidate, cls: 's-blue',    icon: I.check, to: 'completed'  as ScreenId },
    { label: 'Critical / STAT Tests',  val: statTests,        cls: 's-red',     icon: I.bell,  to: 'inhouse'    as ScreenId },
  ];

  const eqAlerts = lab.equipment.filter(e => e.status !== 'Online');
  const lowStock = lab.inventory.filter(i => i.state === 'Low' || i.state === 'Out' || i.state === 'Expiring');

  const ACTIVITIES = [
    { dot: 'green', icon: I.check, title: 'CBC validated — Manish Gupta',     sub: 'Report released', time: '2m ago' },
    { dot: '',      icon: I.flask, title: 'LFT processing started — Sameer Khan', sub: 'Cobas c311',  time: '8m ago' },
    { dot: 'blue',  icon: I.drop,  title: 'Sample collected — Rohan Verma',   sub: 'Lipid Profile',   time: '14m ago' },
    { dot: 'rose',  icon: I.drop,  title: 'Sample rejected — Asha Pillai',    sub: 'Hemolyzed',       time: '32m ago' },
  ];
  const NOTIFS = [
    { dot: 'amber', icon: I.tool, title: 'Cobas c311 calibration due tomorrow', sub: 'EQ-02',        time: '1h ago' },
    { dot: 'rose',  icon: I.box,  title: 'Urine Strip Kit out of stock',         sub: 'Reorder now',  time: '1h ago' },
    { dot: 'blue',  icon: I.flask,title: '2 new STAT orders from Cardiology',    sub: 'Review queue', time: '2h ago' },
  ];
  const QUICK = [
    { label: 'View Test Orders',  icon: I.flask, to: 'inhouse'    as ScreenId },
    { label: 'Collect a Sample',  icon: I.scan,  to: 'collection' as ScreenId },
    { label: 'Enter Results',     icon: I.edit,  to: 'results'    as ScreenId },
    { label: 'Check Inventory',   icon: I.box,   to: 'inventory'  as ScreenId },
  ];

  return (
    <div className="lt-scroll lt-fade">
      <div className="lt-content">
        {/* Today's Test Summary */}
        <div>
          <div className="lt-card-title" style={{ marginBottom: 14 }}>Today's Test Summary</div>
          <div className="lt-stat-row">
            {STATS.map(s => (
              <div key={s.label} className={`lt-stat-card ${s.cls}`} style={{ cursor: 'pointer' }} onClick={() => onNav(s.to)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="lt-stat-label">{s.label}</div>
                  <SvgIcon path={s.icon} size={18} />
                </div>
                <div className="lt-stat-value">{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lt-dash-grid">
          {/* Left column */}
          <div className="lt-dash-col">
            <div className="lt-card">
              <div className="lt-card-title">Recent Activities</div>
              {ACTIVITIES.map((a, i) => (
                <div className="lt-feed-row" key={i}>
                  <div className={`lt-feed-dot ${a.dot}`}><SvgIcon path={a.icon} size={16} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div className="lt-feed-title">{a.title}</div>
                    <div className="lt-feed-sub">{a.sub}</div>
                  </div>
                  <div className="lt-feed-time">{a.time}</div>
                </div>
              ))}
            </div>

            <div className="lt-card">
              <div className="lt-card-title">Equipment Alerts</div>
              {eqAlerts.length === 0 && <div className="lt-empty">All equipment online.</div>}
              {eqAlerts.map(e => (
                <div className="lt-feed-row" key={e.id}>
                  <div className="lt-feed-dot amber"><SvgIcon path={I.tool} size={16} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div className="lt-feed-title">{e.name} — {e.status}</div>
                    <div className="lt-feed-sub">{e.model}</div>
                  </div>
                  <button className="lt-btn-outline" onClick={() => onNav('equipment')}>View</button>
                </div>
              ))}
            </div>

            <div className="lt-card">
              <div className="lt-card-title">Low Stock Reagents</div>
              {lowStock.map(i => (
                <div className="lt-feed-row" key={i.id}>
                  <div className="lt-feed-dot rose"><SvgIcon path={I.box} size={16} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div className="lt-feed-title">{i.name}</div>
                    <div className="lt-feed-sub">{i.stock} {i.unit} left · reorder at {i.reorder}</div>
                  </div>
                  <button className="lt-btn-outline" onClick={() => onNav('inventory')}>Reorder</button>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="lt-dash-col">
            <div className="lt-card">
              <div className="lt-card-title">Notifications</div>
              {NOTIFS.map((n, i) => (
                <div className="lt-feed-row" key={i}>
                  <div className={`lt-feed-dot ${n.dot}`}><SvgIcon path={n.icon} size={16} /></div>
                  <div style={{ minWidth: 0 }}>
                    <div className="lt-feed-title">{n.title}</div>
                    <div className="lt-feed-sub">{n.sub}</div>
                  </div>
                  <div className="lt-feed-time">{n.time}</div>
                </div>
              ))}
            </div>

            <div className="lt-card">
              <div className="lt-card-title">Quick Actions</div>
              <div className="lt-qa-grid">
                {QUICK.map(q => (
                  <button key={q.label} className="lt-qa-btn" onClick={() => onNav(q.to)}>
                    <span className="lt-qa-icon"><SvgIcon path={q.icon} size={17} /></span>
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
