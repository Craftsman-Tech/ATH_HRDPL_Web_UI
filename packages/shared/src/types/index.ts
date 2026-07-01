/**
 * ============================================================================
 *  DOMAIN TYPES — Vexoo
 * ============================================================================
 *
 *  These types describe the SHAPE of every entity in the system.
 *  When the backend gets built, these are the contracts the API will match.
 *
 *  Add a new field?  Add it here first, then to the mock data, then to any
 *  screens that should display it. TypeScript will tell you what breaks.
 * ============================================================================
 */

// ─── Roles ──────────────────────────────────────────────────────────────────
export type Role =
  | 'Admin'          // hospital administrator — manages a single hospital
  | 'Doctor'
  | 'Receptionist'   // includes Nurse — same portal in current design
  | 'Pharmacist'
  | 'LabTech';

// ─── Status enums ───────────────────────────────────────────────────────────
// Strings instead of numeric enums so they're safe to display directly and
// survive serialization to/from the future API.
export type AppointmentStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Waiting'
  | 'CheckedIn'
  | 'InProgress'
  | 'InRoom'
  | 'Completed'
  | 'Cancelled'
  | 'NoShow';

export type PatientHealthStatus =
  | 'Stable'
  | 'Monitoring'
  | 'Critical';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type PrescriptionStatus =
  | 'Pending'
  | 'Verifying'
  | 'Ready'
  | 'Dispensed'
  | 'Rejected';

export type LabPriority = 'Routine' | 'Urgent' | 'STAT';
export type LabStatus   = 'Pending' | 'Processing' | 'Complete' | 'Cancelled';

// ─── Entities ───────────────────────────────────────────────────────────────

export interface Patient {
  id:          string;            // P-001
  name:        string;
  age:         number;
  dob?:        string;
  gender?:     'M' | 'F' | 'Other';
  condition:   string;            // primary condition / diagnosis
  doctor:      string;            // attending doctor name
  status:      PatientHealthStatus;
  risk?:       RiskLevel;
  lastVisit:   string;
  allergies?:  string;            // free text — "Penicillin", "None known"
  vitals?: {
    bp:  string;                  // "128/82"
    hr:  number;
    temp?: number;
    spo2?: number;
  };
}

export interface Doctor {
  id:         string;
  name:       string;             // "Dr. Amy Chen"
  department: string;             // "Cardiology"
  avatar?:    string;             // initials shown if no image
}

export interface Appointment {
  id:        string;
  patient:   string;              // patient name (denormalized for list views)
  patientId: string;
  doctor:    string;
  doctorId?: string;
  type:      string;              // "Follow-up", "Consultation", etc.
  time:      string;              // "09:00 AM"
  date:      string;              // "May 15, 2026"
  duration?: number;              // minutes
  room?:     string;
  status:    AppointmentStatus;
  notes?:    string;
}

export interface Prescription {
  id:           string;           // RX-4821
  patient:      string;
  patientId:    string;
  drug:         string;           // "Lisinopril 10mg"
  qty:          number;
  doctor:       string;
  time:         string;
  status:       PrescriptionStatus;
  refills:      number;
  dob?:         string;
  allergies?:   string;
  instructions: string;
}

export interface LabOrder {
  id:        string;              // L-0091
  patient:   string;
  patientId: string;
  test:      string;              // "HbA1c Panel"
  ordered:   string;              // ordered by (doctor name)
  time:      string;
  priority:  LabPriority;
  status:    LabStatus;
  type:      'Blood' | 'Imaging' | 'Pulmonary' | 'Cardiac' | string;
  collected?: string;             // collection time
  barcode?:  string;
}

export interface InventoryItem {
  id:       string;
  name:     string;               // drug or supply name
  qty:      number;
  min:      number;               // reorder threshold
  max:      number;               // max stock
  expiry?:  string;
  category: string;
}

export interface Notification {
  id:        string;
  type:      'info' | 'warning' | 'danger' | 'success';
  title:     string;
  body:      string;
  timestamp: string;
  read:      boolean;
}

// ─── Auth ───────────────────────────────────────────────────────────────────
export interface AuthUser {
  id:    string;
  email: string;
  name:  string;
  role:  Role;
  avatar?: string;
}
