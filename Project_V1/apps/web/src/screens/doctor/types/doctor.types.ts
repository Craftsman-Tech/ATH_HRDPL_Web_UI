/**
 * ============================================================================
 *  doctor.types.ts — shared type definitions for the Doctor portal
 * ============================================================================
 */
import type React from 'react';

// Only 4 screens remain in the sidebar — Medical Records / Prescriptions /
// Lab Orders were folded into the Consultation form (see ConsultationForm.tsx)
export type ScreenId = 'queue' | 'patients' | 'messages' | 'schedule';

export type VisitType = 'Walk-In' | 'Follow-Up' | 'Consultation' | 'Procedure';
export type Priority  = 'Normal' | 'Urgent' | 'Emergency';
export type Gender    = 'Male' | 'Female' | 'Other';
export type RiskLevel = 'Low' | 'Medium' | 'High';

// Status of a single day's appointment / queue entry
export type AppointmentStatus = 'Waiting' | 'In Consultation' | 'Completed' | 'Scheduled';

export type BadgeKey =
  | 'low' | 'medium' | 'high'
  | 'waiting' | 'in consultation' | 'completed' | 'scheduled'
  | 'urgent' | 'normal' | 'emergency'
  | 'active' | 'stopped' | 'normal result' | 'abnormal result' | 'pending result';

export interface NavItem { id: ScreenId; label: string; path: string; badge?: number; }

// ── Vitals ───────────────────────────────────────────────────────────────
// Vitals are dynamic — a hospital may only capture one (e.g. Temperature)
// or all four. An empty array means "No Vitals" was recorded for the visit.
export interface VitalReading {
  label: string;   // 'Blood Pressure'
  value: string;   // '128/82'
  unit: string;    // 'mmHg'
  color: string;   // CSS color var for the value text
}

// ── Medications ──────────────────────────────────────────────────────────
export interface Medication {
  id: string;
  name: string;       // 'Lisinopril 10mg'  (selected from pharmacy list)
  dosage: string;      // '1 tablet'
  timing: string;      // 'After Breakfast'
  duration?: string;   // '30 days' (optional, ongoing if blank)
  status: 'Active' | 'Stopped';
  startDate?: string;  // 'Jan 2024'
}

// ── Cross-hospital history & attachments (shown in Consultation tabs) ─────
export interface HistoryVisit {
  id: string;
  date: string;          // '12 Apr 2026'
  hospital: string;      // 'Vexoo Care Hospital' / 'Apollo Clinic'
  doctor: string;
  diagnosis: string;
  prescriptionSummary: string;
  // Optional richer breakdown — when present, the "View" modal renders a
  // full read-only prescription instead of just the summary line.
  symptoms?: string;
  investigations?: string;
  medications?: { name: string; dosage: string; timing: string }[];
  labTests?: string[];
}

export interface LabAttachment {
  id: string;
  date: string;
  hospital: string;
  testName: string;
  result: 'Normal' | 'Abnormal' | 'Pending';
  fileName: string;
}

// ── Consultation outcome (filled once doctor completes review) ────────────
export interface ConsultationRecord {
  symptoms?: string;
  investigations?: string;
  labTests?: string[];        // multi-select recommended tests
  completedAt?: number;       // Date.now()
}

// ── Appointment — one row in Today's Queue / My Schedule for a given date ─
export interface Appointment {
  id: string;
  patientId: string;          // 'P-001'
  name: string;
  age: number;
  gender: Gender;
  bloodGroup?: string;
  condition: string;          // chronic condition tag, e.g. 'Hypertension'
  riskLevel: RiskLevel;

  token: string;               // 'OP-001'
  date: string;                 // 'YYYY-MM-DD' — the calendar day this entry belongs to
  visitType: VisitType;
  priority: Priority;
  chiefComplaint: string;
  status: AppointmentStatus;

  queuedAt?: number;            // ms timestamp — present once a Walk-In is checked in & waiting
  scheduledTime?: string;       // '02:00 PM' — present for anything booked ahead of arrival

  vitals: VitalReading[];               // [] → "No Vitals"
  activeMedications: Medication[];      // [] → "No Active Medications"

  consultation?: ConsultationRecord;
}

// ── Patient roster (My Patients screen) ────────────────────────────────────
export interface PatientRecord {
  id: string;            // 'P-001'
  name: string;
  age: number;
  gender: Gender;
  bloodGroup?: string;
  condition: string;
  riskLevel: RiskLevel;
  phone: string;
  lastVisit: string;     // '26 Apr 2026'
  activeMedications: Medication[];
}

// ── Messaging (unchanged) ───────────────────────────────────────────────
export interface Message { from: 'doctor' | 'patient'; text: string; time: string; }
export interface Convo { name: string; last: string; time: string; unread: number; msgs: Message[]; }

// ── Shared app-level state — lifted to DoctorScreen, passed to screens ────
export interface DoctorAppState {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  onNav: (s: ScreenId) => void;
}

export interface DoctorScreenProps {
  doctorName?: string;
  onSignOut?: () => void;
}
