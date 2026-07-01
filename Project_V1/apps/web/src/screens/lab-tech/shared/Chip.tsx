// ============================================================================
//  Chip.tsx — pill-shaped status/priority indicator (Lab Tech portal)
//  Identical markup/classes to the Doctor portal's Chip so badges look the
//  same across portals. Styles live in LabTechCSS.ts under .lt-chip rules.
// ============================================================================
import React from 'react';
import type {
  Priority, OrderStatus, SampleStatus, ProcStatus, QCStatus,
  EqStatus, StockState, ResultFlag, ChipColor,
} from '../types/labtech.types';

export const Chip: React.FC<{ label: string; color?: ChipColor; className?: string }> = ({ label, color = 'gray', className = '' }) => (
  <span className={`lt-chip ${color} ${className}`}>{label}</span>
);

export function priorityChip(p: Priority): { label: string; color: ChipColor } {
  if (p === 'STAT')   return { label: 'STAT',    color: 'rose'  };
  if (p === 'Urgent') return { label: 'Urgent',  color: 'amber' };
  return { label: 'Routine', color: 'blue' };
}

export function orderStatusChip(s: OrderStatus): { label: string; color: ChipColor } {
  if (s === 'New')        return { label: 'New',        color: 'amber'   };
  if (s === 'Accepted')   return { label: 'Accepted',   color: 'blue'    };
  if (s === 'Collected')  return { label: 'Collected',  color: 'purple'  };
  if (s === 'Processing') return { label: 'Processing', color: 'primary' };
  return { label: 'Completed', color: 'green' };
}

export function sampleStatusChip(s: SampleStatus): { label: string; color: ChipColor } {
  if (s === 'Pending')   return { label: 'Pending',   color: 'amber' };
  if (s === 'Collected') return { label: 'Collected', color: 'green' };
  if (s === 'Rejected')  return { label: 'Rejected',  color: 'rose'  };
  return { label: 'Recollect', color: 'purple' };
}

export function procStatusChip(s: ProcStatus): { label: string; color: ChipColor } {
  if (s === 'Ready')     return { label: 'Ready',     color: 'blue'    };
  if (s === 'Running')   return { label: 'Running',   color: 'primary' };
  if (s === 'Paused')    return { label: 'Paused',    color: 'amber'   };
  return { label: 'Completed', color: 'green' };
}

export function qcChip(q: QCStatus): { label: string; color: ChipColor } {
  if (q === 'Pass') return { label: 'QC Pass', color: 'green' };
  if (q === 'Fail') return { label: 'QC Fail', color: 'rose'  };
  return { label: 'QC Pending', color: 'amber' };
}

export function eqStatusChip(s: EqStatus): { label: string; color: ChipColor } {
  if (s === 'Online')          return { label: 'Online',          color: 'green' };
  if (s === 'Calibration Due') return { label: 'Calibration Due', color: 'amber' };
  if (s === 'Maintenance')     return { label: 'Maintenance',     color: 'purple'};
  return { label: 'Offline', color: 'rose' };
}

export function stockChip(s: StockState): { label: string; color: ChipColor } {
  if (s === 'OK')        return { label: 'In Stock',  color: 'green' };
  if (s === 'Low')       return { label: 'Low Stock', color: 'amber' };
  if (s === 'Expiring')  return { label: 'Expiring',  color: 'purple'};
  return { label: 'Out of Stock', color: 'rose' };
}

export function outcomeChip(o: 'Normal' | 'Abnormal'): { label: string; color: ChipColor } {
  return o === 'Abnormal' ? { label: 'Abnormal', color: 'rose' } : { label: 'Normal', color: 'green' };
}

export function flagColor(f: ResultFlag): ChipColor {
  if (f === 'high' || f === 'low') return 'amber';
  if (f === 'critical') return 'rose';
  return 'green';
}
