import React from 'react';
import type { StatusColor } from '../types/pharmacist.types';

// ── Name → initials ──────────────────────────────────────────────────────────
export function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// ── Status → badge colour (covers Rx, stock, PO & priority vocab) ────────────
export function statusColor(s: string): StatusColor {
  if (['Out of Stock', 'STAT', 'Cancelled', 'Critical'].includes(s))             return 'rose';
  if (['Low Stock', 'Pending', 'Urgent', 'Expiring', 'Verifying'].includes(s))   return 'amber';
  if (['Dispensed', 'In Progress', 'Received', 'Verified'].includes(s))          return 'blue';
  if (['Draft', 'Routine'].includes(s))                                          return 'purple';
  if (['Ready', 'In Stock', 'Approved', 'Active', 'Complete', 'Completed'].includes(s)) return 'primary';
  return 'gray';
}

export const Badge: React.FC<{ label: string; color?: StatusColor }> = ({ label, color = 'primary' }) => (
  <span className={`ph-badge ${color}`}>{label}</span>
);

export const SvgIcon: React.FC<{ path: string; size?: number; color?: string }> = ({ path, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d={path} />
  </svg>
);

export const StatCard: React.FC<{
  label: string; value: string; sub: string; color: string; iconPath: string;
  onClick?: () => void;
}> = ({ label, value, sub, color, iconPath, onClick }) => (
  <div className={`ph-stat-card ${onClick ? 'ph-clickable' : ''}`} onClick={onClick}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div className="ph-stat-label">{label}</div>
        <div className="ph-stat-value">{value}</div>
        <div className="ph-stat-sub" style={{ color }}>{sub}</div>
      </div>
      <div className="ph-stat-icon" style={{ background: `${color}18` }}>
        <SvgIcon path={iconPath} size={22} color={color} />
      </div>
    </div>
  </div>
);

export const BarChart: React.FC<{ data: number[]; labels: string[]; color?: string; todayIndex?: number }> =
  ({ data, labels, color = 'var(--primary)', todayIndex = 6 }) => {
    const max = Math.max(...data);
    return (
      <div className="ph-bar-chart">
        {data.map((val, i) => (
          <div key={i} className="ph-bar-col">
            <div className="ph-bar-val" style={{ visibility: i === todayIndex ? 'visible' : 'hidden' }}>{val}</div>
            <div className="ph-bar" style={{
              height: `${(val / max) * 74}px`, background: color,
              opacity: i === todayIndex ? 1 : 0.3,
              boxShadow: i === todayIndex ? `0 4px 12px ${color}40` : 'none',
            }} />
            <span className="ph-bar-label">{labels[i]}</span>
          </div>
        ))}
      </div>
    );
  };

export const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="ph-th">{children}</th>
);
export const Td: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <td className="ph-td" style={style}>{children}</td>
);

// ── Small avatar bubble (tables / lists) ─────────────────────────────────────
export const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', background: 'var(--primary-light)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: size * 0.34, color: 'var(--primary)', flexShrink: 0,
  }}>{initials(name)}</div>
);
