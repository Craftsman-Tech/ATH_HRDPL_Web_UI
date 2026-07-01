import React from 'react';
import type { StatusColor } from '../types/hospitaladmin.types';

export function initials(name: string) { return name.split(' ').map(n => n[0]).join(''); }

export function statusColor(s: string): StatusColor {
  if (s === 'Critical' || s === 'STAT')                                          return 'rose';
  if (s === 'Monitoring' || s === 'Waiting' || s === 'Low' || s === 'Urgent')   return 'amber';
  if (s === 'In Progress' || s === 'Dispensed' || s === 'Complete')              return 'blue';
  if (s === 'Pending')                                                            return 'purple';
  if (s === 'Ready' || s === 'Stable' || s === 'OK')                            return 'primary';
  return 'gray';
}

export const Badge: React.FC<{ label: string; color?: StatusColor }> = ({ label, color = 'primary' }) => (
  <span className={`ha-badge ${color}`}>{label}</span>
);

export const SvgIcon: React.FC<{ path: string; size?: number; color?: string }> = ({ path, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d={path} />
  </svg>
);

export const StatCard: React.FC<{ label: string; value: string; sub: string; color: string; iconPath: string }> =
  ({ label, value, sub, color, iconPath }) => (
    <div className="ha-stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="ha-stat-label">{label}</div>
          <div className="ha-stat-value">{value}</div>
          <div className="ha-stat-sub" style={{ color }}>{sub}</div>
        </div>
        <div className="ha-stat-icon" style={{ background: `${color}18` }}>
          <SvgIcon path={iconPath} size={22} color={color} />
        </div>
      </div>
    </div>
  );

export const BarChart: React.FC<{ data: number[]; labels: string[]; color?: string; todayIndex?: number }> =
  ({ data, labels, color = 'var(--primary)', todayIndex = 6 }) => {
    const max = Math.max(...data);
    return (
      <div className="ha-bar-chart">
        {data.map((val, i) => (
          <div key={i} className="ha-bar-col">
            <div className="ha-bar-val" style={{ visibility: i === todayIndex ? 'visible' : 'hidden' }}>{val}</div>
            <div className="ha-bar" style={{
              height: `${(val / max) * 74}px`, background: color,
              opacity: i === todayIndex ? 1 : 0.3,
              boxShadow: i === todayIndex ? `0 4px 12px ${color}40` : 'none',
            }} />
            <span className="ha-bar-label">{labels[i]}</span>
          </div>
        ))}
      </div>
    );
  };

export const Th: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="ha-th">{children}</th>
);
export const Td: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <td className="ha-td" style={style}>{children}</td>
);

export function shortDateToISO(d: string): string {
  const m: Record<string,string> = { Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12' };
  const [mon, day] = d.split(' ');
  return `2026-${m[mon] ?? '01'}-${(day ?? '01').padStart(2,'0')}`;
}
