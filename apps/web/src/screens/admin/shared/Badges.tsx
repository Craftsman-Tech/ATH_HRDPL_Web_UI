import React from 'react';
import type { Hospital } from '../types/admin.types';

export function StatusBadge({ status }: { status: Hospital['status'] }) {
  const map: Record<Hospital['status'], string> = {
    active: 'badge-active', pending: 'badge-pending', suspended: 'badge-suspended',
  };
  const labels: Record<Hospital['status'], string> = {
    active: 'Active', pending: 'Pending', suspended: 'Suspended',
  };
  return <span className={`badge ${map[status]}`}>{labels[status]}</span>;
}

export function PlanBadge({ plan }: { plan: string }) {
  const cls = plan === 'Enterprise'
    ? 'badge-enterprise' : plan === 'Professional'
    ? 'badge-professional' : 'badge-starter';
  return <span className={`badge ${cls}`}>{plan}</span>;
}
