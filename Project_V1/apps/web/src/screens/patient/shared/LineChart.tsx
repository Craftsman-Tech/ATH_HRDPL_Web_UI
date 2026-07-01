import React from 'react';

interface LineChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, labels, color = '#0E9384', height = 150 }) => {
  const W = 520, H = height, PAD = 26;
  const min = Math.min(...data) * 0.96, max = Math.max(...data) * 1.04, range = max - min || 1;
  const step = (W - PAD * 2) / (data.length - 1 || 1);
  const pts = data.map((v, i) => [PAD + i * step, H - PAD - ((v - min) / range) * (H - PAD * 2)] as [number, number]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0]},${H - PAD} L${pts[0][0]},${H - PAD} Z`;
  const gradId = `g-${color.slice(1)}`;
  return (
    <svg className="chart spark" viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map(f => (
        <line key={f} x1={PAD} x2={W - PAD} y1={PAD + f * (H - PAD * 2)} y2={PAD + f * (H - PAD * 2)}
          stroke="#eef2f1" strokeWidth="1" />
      ))}
      <path className="chart-area" d={area} fill={`url(#${gradId})`} />
      <path className="chart-line" d={line} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#fff" stroke={color} strokeWidth="2.5" />)}
      {labels && pts.map((p, i) => (
        <text key={i} x={p[0]} y={H - 7} textAnchor="middle" fontSize="11" fill="#7b8785">{labels[i]}</text>
      ))}
    </svg>
  );
};

export default LineChart;
