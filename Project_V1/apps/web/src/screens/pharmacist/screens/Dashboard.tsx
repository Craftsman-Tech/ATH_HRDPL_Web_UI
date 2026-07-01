import React, { useEffect, useState } from 'react';
import type { ScreenId } from '../types/pharmacist.types';
import { SvgIcon, StatCard, Badge } from '../shared/PhHelpers';
import { PRESCRIPTIONS, INVENTORY, ACTIVITIES, NOTIFICATIONS } from '../data/mockPharmData';

// ── Derived live counts from mock data ───────────────────────────────────────
const inHouseQ  = PRESCRIPTIONS.filter(p => p.source === 'In-House' && p.status !== 'Dispensed').length;
const externalQ = PRESCRIPTIONS.filter(p => p.source === 'External' && p.status !== 'Dispensed').length;
const readyQ    = PRESCRIPTIONS.filter(p => p.status === 'Ready').length;
const lowStock  = INVENTORY.filter(i => i.qty > 0 && i.qty < i.min).length;
const outStock  = INVENTORY.filter(i => i.qty === 0).length;
const expiring  = INVENTORY.filter(i => /Jul 2026|Sep 2026/.test(i.expiry)).length;

const ACTIVITY_STYLE: Record<string, { color: string; icon: string }> = {
  'Dispensed':         { color: '#0A6E8F', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  'Stock Updated':     { color: '#C68A1F', icon: 'M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4l16-.02V7z' },
  'Purchase Received': { color: '#0E7C66', icon: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' },
  'Verified':          { color: '#6D5BD0', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
};

const NOTIF_STYLE: Record<string, { color: string; icon: string }> = {
  critical: { color: '#B43A2C', icon: 'M12 2L1 21h22L12 2zm1 16h-2v-2h2v2zm0-4h-2V9h2v5z' },
  alert:    { color: '#C68A1F', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
  info:     { color: '#0A6E8F', icon: 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
  success:  { color: '#0E7C66', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
};

const QUICK_ACTIONS: { label: string; color: string; icon: string; go: ScreenId }[] = [
  { label: 'Dispense Medication', color: '#0E7C66', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', go: 'inhouse'   },
  { label: 'Search Prescription', color: '#0A6E8F', icon: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z', go: 'inhouse' },
  { label: 'Search Medicine',     color: '#6D5BD0', icon: 'M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4l16-.02V7z', go: 'inventory' },
  { label: 'Create Purchase Order', color: '#C68A1F', icon: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z', go: 'purchase' },
];

export const Dashboard: React.FC<{ goTo: (s: ScreenId, invFilter?: string) => void }> = ({ goTo }) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const shift = hour < 14 ? 'Morning Shift · 8:00 AM – 2:00 PM' : 'Evening Shift · 2:00 PM – 8:00 PM';
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="ph-content ph-fade">
      {/* 1 ── Welcome card ────────────────────────────────────────────────── */}
      <div className="ph-welcome" style={{ marginBottom: 18 }}>
        <div>
          <div className="ph-welcome-greet">{greeting}, Maria 👋</div>
          <div className="ph-welcome-sub">You have {inHouseQ + externalQ} prescriptions in queue and {readyQ} ready to dispense.</div>
        </div>
        <div className="ph-welcome-meta">
          <div className="ph-welcome-time">{timeStr}</div>
          <div className="ph-welcome-shift">{dateStr}</div>
          <div className="ph-welcome-shift">{shift}</div>
        </div>
      </div>

      {/* 6 ── Quick actions ──────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }} className="ph-grid-4col">
        {QUICK_ACTIONS.map(a => (
          <button key={a.label} className="ph-quick-btn" onClick={() => goTo(a.go)}>
            <div className="ph-quick-ico" style={{ background: `${a.color}18` }}>
              <SvgIcon path={a.icon} size={20} color={a.color} />
            </div>
            <span className="ph-quick-label">{a.label}</span>
          </button>
        ))}
      </div>

      {/* 2 ── Today's work summary ───────────────────────────────────────── */}
      <div className="ph-section-head"><div className="ph-section-title">Today's Work Summary</div></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }} className="ph-stat-grid-3">
        <StatCard label="Prescriptions Received"  value="18" sub="↑ 4 vs yesterday" color="#0A6E8F" iconPath="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-3.5-3.5 1.41-1.41L10 14.17l4.59-4.58L16 11l-6 6z" />
        <StatCard label="Prescriptions Dispensed" value="11" sub="61% of received"  color="#0E7C66" iconPath="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        <StatCard label="Prescriptions Pending"   value="7"  sub="2 over 15 min"    color="#C68A1F" iconPath="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
      </div>

      {/* 3 ── Queue overview (clickable) ─────────────────────────────────── */}
      <div className="ph-section-head"><div className="ph-section-title">Queue Overview</div><div className="ph-section-sub">Tap a card to open the queue</div></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }} className="ph-stat-grid-3">
        <StatCard label="In-House Queue"      value={String(inHouseQ)}  sub="View queue →" color="#0A6E8F" iconPath="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-4-4 1.41-1.41L11 14.17V7h2v7.17l1.59-1.58L16 14l-4 4z" onClick={() => goTo('inhouse')} />
        <StatCard label="External Queue"      value={String(externalQ)} sub="View queue →" color="#6D5BD0" iconPath="M19 3H4.99c-1.11 0-1.98.9-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z" onClick={() => goTo('external')} />
        <StatCard label="Ready for Dispensing" value={String(readyQ)}    sub="Dispense now →" color="#0E7C66" iconPath="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" onClick={() => goTo('inhouse')} />
      </div>

      {/* 4 + 8 ── Critical alerts  +  Performance snapshot ───────────────── */}
      <div className="ph-grid-2-2" style={{ marginBottom: 22 }}>
        <div className="ph-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Critical Alerts</div>
            <Badge label={`${lowStock + outStock + expiring} active`} color="rose" />
          </div>
          <div className="ph-alert-row" onClick={() => goTo('inventory', 'Low Stock')}>
            <div className="ph-alert-count" style={{ color: '#C68A1F' }}>{lowStock}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>Low Stock Medicines</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Below minimum threshold</div>
            </div>
            <SvgIcon path="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" size={16} color="var(--ink-400)" />
          </div>
          <div className="ph-alert-row" onClick={() => goTo('inventory', 'Out of Stock')}>
            <div className="ph-alert-count" style={{ color: '#B43A2C' }}>{outStock}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>Out of Stock Medicines</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reorder required immediately</div>
            </div>
            <SvgIcon path="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" size={16} color="var(--ink-400)" />
          </div>
          <div className="ph-alert-row" onClick={() => goTo('inventory', 'Expiring')}>
            <div className="ph-alert-count" style={{ color: '#6D5BD0' }}>{expiring}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>Medicines Expiring Soon</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Within 90 days</div>
            </div>
            <SvgIcon path="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" size={16} color="var(--ink-400)" />
          </div>
        </div>

        <div className="ph-card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Performance Snapshot</div>
          {([
            ['Average Dispensing Time', '9.4 min', 'Target: ≤ 12 min', '#0E7C66'],
            ['Prescriptions Completed Today', '11', '↑ on track', '#0A6E8F'],
            ['Pending Since > 15 Minutes', '2', 'Needs attention', '#C68A1F'],
          ] as [string, string, string, string][]).map(([label, val, sub, color], i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
              </div>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 26, color, lineHeight: 1 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 + 7 ── Recent activity  +  Notifications ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }} className="ph-grid-2-1">
        <div className="ph-card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Recent Activity</div>
          {ACTIVITIES.map(act => {
            const st = ACTIVITY_STYLE[act.type];
            return (
              <div key={act.id} className="ph-activity-row">
                <div className="ph-activity-dot" style={{ background: `${st.color}18` }}>
                  <SvgIcon path={st.icon} size={16} color={st.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--ink-800)' }}>{act.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{act.type} · {act.time}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="ph-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Notifications</div>
            <Badge label={`${NOTIFICATIONS.filter(n => !n.read).length} new`} color="primary" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {NOTIFICATIONS.map(n => {
              const st = NOTIF_STYLE[n.type];
              return (
                <div key={n.id} className={`ph-notif-item ${!n.read ? 'unread' : ''}`} style={{ padding: '12px 14px' }}>
                  <div className="ph-notif-icon" style={{ background: `${st.color}18` }}>
                    <SvgIcon path={st.icon} size={16} color={st.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{n.body}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-400)', marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
