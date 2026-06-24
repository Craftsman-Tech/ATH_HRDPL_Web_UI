// ============================================================================
//  Chip.tsx — pill-shaped status/priority/risk indicator (Doctor portal)
//  Mirrors the Reception portal's Chip.tsx so badges look identical across
//  portals. Class names live in DoctorCSS.ts under the .dr-chip rules.
// ============================================================================
import React from 'react';
import type { AppointmentStatus, Priority, RiskLevel } from '../types/doctor.types';

export type ChipColor = 'primary' | 'amber' | 'rose' | 'blue' | 'green' | 'purple' | 'gray';

export const Chip: React.FC<{ label: string; color?: ChipColor; className?: string }> = ({ label, color = 'gray', className = '' }) => (
  <span className={`dr-chip ${color} ${className}`}>{label}</span>
);

// Queue / schedule status → chip color + display label
export function statusChip(s: AppointmentStatus): { label: string; color: ChipColor } {
  if (s === 'Waiting')         return { label: 'Waiting for Doctor',     color: 'amber' };
  if (s === 'In Consultation') return { label: 'In Consultation',        color: 'green' };
  if (s === 'Completed')       return { label: 'Consultation Completed', color: 'blue'  };
  return { label: 'Scheduled', color: 'gray' };
}

export function priorityChip(p: Priority): { label: string; color: ChipColor } {
  if (p === 'Emergency') return { label: 'Emergency', color: 'rose' };
  if (p === 'Urgent')    return { label: 'Urgent',    color: 'amber' };
  return { label: 'Normal', color: 'blue' };
}

export function riskChip(r: RiskLevel): { label: string; color: ChipColor } {
  if (r === 'High')   return { label: 'High Risk',   color: 'rose'  };
  if (r === 'Medium') return { label: 'Medium Risk', color: 'amber' };
  return { label: 'Low Risk', color: 'green' };
}

export function resultChip(r: 'Normal' | 'Abnormal' | 'Pending'): { label: string; color: ChipColor } {
  if (r === 'Abnormal') return { label: 'Abnormal', color: 'rose'  };
  if (r === 'Pending')  return { label: 'Pending',  color: 'amber' };
  return { label: 'Normal', color: 'green' };
}
