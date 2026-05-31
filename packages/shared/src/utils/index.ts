/**
 * ============================================================================
 *  UTILS — Pure helpers, zero platform dependencies.
 * ============================================================================
 *  Anything in here must work in BOTH a browser AND a React Native runtime.
 *  No `window`, no `document`, no `AsyncStorage`. Just data in, data out.
 * ============================================================================
 */
import type {
  AppointmentStatus,
  PatientHealthStatus,
  RiskLevel,
  PrescriptionStatus,
  LabPriority,
} from '../types';

/** Map a status string → semantic color token (`success` / `warning` / etc.). */
export function getStatusTone(
  status:
    | AppointmentStatus
    | PatientHealthStatus
    | PrescriptionStatus
    | LabPriority
    | string,
): 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral' {
  switch (status) {
    // Greens (good, done)
    case 'Confirmed':
    case 'Stable':
    case 'Completed':
    case 'Dispensed':
    case 'Complete':
    case 'Ready':
      return 'success';
    // Ambers (in flux)
    case 'Waiting':
    case 'Monitoring':
    case 'Pending':
    case 'Urgent':
      return 'warning';
    // Reds (urgent / bad)
    case 'Critical':
    case 'STAT':
    case 'Cancelled':
    case 'NoShow':
    case 'Rejected':
      return 'danger';
    // Blues (active)
    case 'InProgress':
    case 'CheckedIn':
    case 'InRoom':
    case 'Processing':
    case 'Verifying':
      return 'info';
    // Purples (queued / scheduled)
    case 'Scheduled':
      return 'purple';
    default:
      return 'neutral';
  }
}

/** Risk level → tone. Used by the patient list chips. */
export function getRiskTone(risk: RiskLevel): 'success' | 'warning' | 'danger' {
  return risk === 'Low' ? 'success' : risk === 'Medium' ? 'warning' : 'danger';
}

/** "Sarah Johnson" → "SJ"  ·  "James O'Brien" → "JO" */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]!.toUpperCase())
    .join('');
}

/** Pretty-print an ISO/locale-ish date for chip displays. */
export function formatShortDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

/** Convert a humanized status (`InProgress`) → label (`In Progress`). */
export function humanizeStatus(s: string): string {
  return s.replace(/([A-Z])/g, ' $1').trim();
}
