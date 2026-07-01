import type React from 'react';
// ============================================================================
//  reception.types.ts — Vexoo Reception Portal v3
// ============================================================================

export type ScreenId =
  | 'dashboard' | 'appointments' | 'patientreg' | 'patients'
  | 'queue' | 'billing' | 'reports' | 'communication';

export type VisitType    = 'Walk-In' | 'Follow-Up' | 'Consultation' | 'Procedure';
export type Priority     = 'Normal' | 'Urgent' | 'Emergency';
export type ApptStatus   = 'Scheduled' | 'Confirmed' | 'In Queue' | 'With Doctor'
                         | 'Post-Consult' | 'Bill Pending' | 'Paid' | 'Visit Complete'
                         | 'Cancelled' | 'No-Show';
export type QueueStatus  = 'Waiting' | 'With Doctor' | 'Completed';
export type PaymentMode  = 'Cash' | 'Card' | 'UPI' | 'Insurance';
export type ChipColor    = 'primary' | 'amber' | 'rose' | 'blue' | 'green'
                         | 'purple' | 'orange' | 'gray';
export type ReportType   = 'appointment' | 'patient' | 'visit';

// ── Patient ────────────────────────────────────────────────────────────────
export interface Patient {
  id: string;
  name: string;
  mobile: string;
  aadhar?: string;         // NEW
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lastVisit: string;
  bloodGroup?: string;
  email?: string;
  address?: string;
  occupation?: string;
  emergencyName?: string;
  emergencyPhone?: string;
}

// ── Appointment ────────────────────────────────────────────────────────────
export interface Appointment {
  id: string;
  token: string;
  arrivalTime: string;      // auto-filled on check-in
  scheduledTime?: string;   // when booked in advance
  patientName: string;
  patientId: string;
  doctor: string;
  phone: string;
  aadhar?: string;
  visitType: VisitType;
  priority: Priority;
  chiefComplaint: string;
  status: ApptStatus;
  prescription?: string;    // filled by doctor post-consult
  testsRecommended?: string;
  createdAt: number;        // Date.now() — for auto No-Show timer
  paidAt?: number;          // Date.now() — for auto Visit-Complete timer
}

// ── Queue ──────────────────────────────────────────────────────────────────
export interface QueueEntry {
  apptId: string;
  queueNo: number;
  token: string;
  patientName: string;
  patientId: string;
  doctor: string;
  priority: Priority;
  status: QueueStatus;
  chiefComplaint: string;
  queuedAt: number;
}

// ── Bill ───────────────────────────────────────────────────────────────────
export interface BillLine { id: string; service: string; charge: number; qty: number; }

export interface Bill {
  apptId: string;
  patientId: string;
  patientName: string;
  doctor: string;
  visitDate: string;
  lines: BillLine[];
  paymentMode?: PaymentMode;
  amountPaid?: number;
  reference?: string;
  paidAt?: number;
  prescription?: string;
  testsRecommended?: string;
}

// ── Nav ────────────────────────────────────────────────────────────────────
export interface NavItem { id: ScreenId; label: string; icon: string; badge?: number; }

// ── Root props ─────────────────────────────────────────────────────────────
export interface ReceptionScreenProps {
  receptionistName?: string;
  onSignOut?: () => void;
}

// ── Bell notification ─────────────────────────────────────────────────────
export interface BellNotif {
  id: number;
  patientName: string;
  doctor: string;
  token: string;
  timestamp: number;
  read: boolean;
}

// ── Shared app state passed as props to every screen ──────────────────────
export interface AppState {
  patients: Patient[];
  appointments: Appointment[];
  queue: QueueEntry[];
  bills: Bill[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  setQueue: React.Dispatch<React.SetStateAction<QueueEntry[]>>;
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  onNav: (s: ScreenId) => void;
  prefillName?: string;
  prefillPhone?: string;
  setPrefillName?: (v: string) => void;
  setPrefillPhone?: (v: string) => void;
  bellNotifs?: BellNotif[];
  addBellNotif?: (n: Omit<BellNotif,'id'|'timestamp'|'read'>) => void;
  markBellRead?: () => void;
}
