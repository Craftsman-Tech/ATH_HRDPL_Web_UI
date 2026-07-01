/**
 * Badges.tsx — status badge + plan pill for the Super Admin portal.
 */
import React from 'react';
import type { HospitalStatus, PlanTier } from '../types/admin.types';

const STATUS_MAP: Record<HospitalStatus, { cls: string; label: string }> = {
  active:     { cls: 'b-active',     label: 'Active' },
  pending:    { cls: 'b-pending',    label: 'Pending' },
  suspended:  { cls: 'b-suspended',  label: 'Suspended' },
  onboarding: { cls: 'b-onboarding', label: 'Onboarding' },
  trial:      { cls: 'b-trial',      label: 'Trial' },
};

export function StatusBadge({ status }: { status: HospitalStatus }) {
  const { cls, label } = STATUS_MAP[status];
  return <span className={`badge ${cls}`}><span className="dot" />{label}</span>;
}

const PLAN_LABEL: Record<PlanTier, string> = {
  pilot: 'Pilot', core: 'Core', scale: 'Scale', enterprise: 'Enterprise',
};

export function PlanPill({ plan }: { plan: PlanTier }) {
  return <span className={`plan-pill ${plan}`}>{PLAN_LABEL[plan] ?? plan}</span>;
}

/** Generic pill used for "Overdue" / "In review" / "Valid" / "Expiring" tags */
export function MiniBadge({ cls, label }: { cls: string; label: string }) {
  return <span className={`badge ${cls}`}><span className="dot" />{label}</span>;
}
