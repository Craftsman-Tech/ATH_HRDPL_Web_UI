/**
 * admin.types.ts — Super Admin (ATH · Support Console) shared types
 * ----------------------------------------------------------------------------
 * Aligned to the "Vexoo · ATH — Support Console" reference design:
 *   dark sidebar (Dashboard + Operations + Platform) · tenant directory ·
 *   shared/personal approval queues · licenses · activity · modules ·
 *   billing & plans · settings · per-hospital registration detail.
 */
import type { ReactNode } from 'react';

/* Sidebar + routing -------------------------------------------------------- */
export type MainTab = 'dashboard' | 'hospitals' | 'approvals' | 'licenses' | 'activity';
export type PlatformView = 'analytics' | 'billing' | 'settings';
export type ViewId = MainTab | PlatformView;

/** A focused detail route layered on top of a list view. */
export type DetailRoute =
  | { kind: 'hospital'; id: string }
  | { kind: 'approval'; id: string };

export interface SuperAdminScreenProps {
  adminName?: string;
  adminRole?: string;
  adminEmail?: string;
  onSignOut?: () => void;
}

/* Hospitals ---------------------------------------------------------------- */
export type HospitalStatus = 'active' | 'pending' | 'suspended' | 'onboarding' | 'trial';
export type PlanTier = 'pilot' | 'core' | 'scale' | 'enterprise';

export interface Hospital {
  id: string;          // VX-T-00128
  name: string;
  regNo: string;       // HOSP/AP/2026/00824
  city: string;
  state: string;       // TS, KA … (code)
  admin: string;
  email: string;
  plan: PlanTier;
  status: HospitalStatus;
  registered: string;  // "May 2, 2026"
  mark: string;        // single-letter avatar
  accent: string;      // hex for the avatar tile
}

/* Approvals (multi-agent shared queue) ------------------------------------- */
/** Which queue a registration currently sits in. */
export type QueueKind = 'shared' | 'mine' | 'other';
export type RegStatus =
  | 'open' | 'overdue' | 'pending' | 'needs-info'  // shared queue (acceptable). 'open'/'overdue' are the only two shown in the All queue.
  | 'in-review' | 'awaiting-applicant'             // a personal queue
  | 'approved' | 'rejected';                       // terminal

export interface Registration {
  id: string;          // REG-2026-0904
  regNo: string;       // HOSP/AP/2026/00904
  name: string;
  city: string;
  state: string;       // code
  contact: string;
  phone: string;
  email: string;
  plan: PlanTier;
  submitted: string;   // "4 days ago"
  accepted?: string;   // "2 days ago" — when in a personal queue
  queue: QueueKind;
  prevStatus?: RegStatus; // the shared-queue status before this row was accepted; used by Release to restore 'open' vs 'overdue'
  owner?: string;      // agent full name (mine / other)
  ownerMark?: string;  // initials, e.g. "RV"
  ownerAccent?: string;
  status: RegStatus;
  mark: string;
  accent: string;
}

/* Registration detail (shown for a hospital OR an accepted registration) --- */
export interface RegLicense { name: string; no: string; valid: string }
export interface RegDocument { name: string; size: string; kind: string }

export interface RegDetail {
  legalName: string;
  facilityType: string;
  beds: number;
  established: string;
  addressLine: string;
  city: string;
  state: string;       // full name
  pincode: string;
  gstin: string;
  pan: string;
  cea: string;
  contactName: string;
  designation: string;
  email: string;
  phone: string;
  altPhone: string;
  plan: PlanTier;
  seats: number;
  price: string;
  planNote: string;
  licenses: RegLicense[];
  documents: RegDocument[];
}

/* Licenses ----------------------------------------------------------------- */
export type LicenseStatus = 'ok' | 'expiring';
export type LicenseKind = 'CEA' | 'Drug license' | 'Bio-medical waste' | 'NABH' | 'NABL';

export interface License {
  id: string;
  hosp: string;
  city: string;
  state: string;       // code
  name: string;
  no: string;
  valid: string;       // "30 May 2026"
  daysLeft: number;    // drives the urgency bar
  status: LicenseStatus;
  kind: LicenseKind;
}

/* Activity ----------------------------------------------------------------- */
export type ActivityKind = 'ok' | 'warn' | 'danger';
export type ActivityCategory =
  | 'registration' | 'approval' | 'credential' | 'suspension'
  | 'license' | 'plan' | 'document';

export interface ActivityEvent {
  id: string;
  time: string;
  kind: ActivityKind;
  category: ActivityCategory;
  title: string;   // may contain <b> markup
  detail: string;  // may contain markup
  actor: string;   // mono-caps agent line, e.g. "MEERA NAIR"
}

/* Modules ------------------------------------------------------------------ */
export type ModuleCategory = 'Clinical' | 'Diagnostics' | 'Revenue' | 'Engagement' | 'Platform';
export interface ModuleCard {
  id: string;
  name: string;
  category: ModuleCategory;
  icon: string;        // key into the screen's icon map
  desc: string;
  tenants: number;
  adoption: number;    // %
  available: boolean;
}

/* Billing & plans ---------------------------------------------------------- */
export interface BillingKpi {
  label: string;
  value: string;
  sub: string;
  trend?: 'up';
  trendText?: string;
  icon: string;
}
export interface PlanCard {
  id: PlanTier;
  name: string;
  price: string;       // "Free" / "₹24,000" / "Custom"
  cadence: string;     // "30-day trial" / "/month" / "/contact us"
  tagline: string;
  hospitals: number;
  popular?: boolean;
  features: string[];
}
export interface Invoice {
  id: string;
  hospital: string;
  plan: PlanTier;
  amount: string;
  date: string;
  status: 'paid' | 'failed';
}

/* Settings ----------------------------------------------------------------- */
export interface SettingsProfile {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  tz: string;
}

/* Team & roles tab */
export type AgentPresence = 'online' | 'away' | 'offline';
export interface TeamMember {
  name: string;
  role: string;
  email: string;
  presence: AgentPresence;
  mark: string;        // initials
  accent: string;      // avatar tile colour
}

/* Approval rules tab */
export interface ApprovalRules {
  autoReturn: string;     // "After 24 hours"
  maxOpen: number;        // cap per agent
  slaTarget: string;      // "4 hours"
  twoPerson: boolean;     // require a second sign-off
}

/* Security tab */
export interface SecurityInfo {
  twoFactor: boolean;
  twoFactorVia: string;       // "authenticator app"
  passwordChanged: string;    // "38 days ago"
  sessions: string;           // "2 devices · Chrome on macOS, Vexoo mobile on iOS"
}

export type SettingsTab = 'profile' | 'notifications' | 'team' | 'rules' | 'security';

/* Nav + KPI ---------------------------------------------------------------- */
export interface NavItem {
  id: ViewId;
  label: string;
  count?: number;
  hot?: boolean;
}

export interface KPIItem {
  label: string;
  value: string;
  accent: string;
  trend?: 'up' | 'down';
  trendText?: string;
  deltaText: ReactNode;
}

/** Dashboard quick-action tile → navigates to a sidebar section. */
export interface QuickAction {
  id: ViewId;
  label: string;
  desc: string;
}

/* Per-view page header (the four operational list views) ------------------- */
export interface PageHead {
  eyebrow: string;
  title: string;   // leading words rendered in serif
  em: string;      // trailing italic accent word
  sub: string;
  register?: boolean;
  export?: boolean;
}
