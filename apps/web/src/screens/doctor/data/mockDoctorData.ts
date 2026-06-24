/**
 * ============================================================================
 *  mockDoctorData.ts — Today's Queue / My Schedule / My Patients seed data
 * ============================================================================
 *  All appointments (walk-in + scheduled) live in ONE array tagged with a
 *  `date` (YYYY-MM-DD). Today's Queue = entries where date === TODAY.
 *  My Schedule lets the doctor pick any date in the 7-day strip and filters
 *  the same array — so a patient "Started Consultation" from either screen
 *  always reflects the same shared state (lifted to DoctorScreen).
 * ============================================================================
 */
import type { Appointment, PatientRecord } from '../types/doctor.types';

// ── Date helpers (relative to whenever the app is opened, not hardcoded) ──
const pad = (n: number) => String(n).padStart(2, '0');
export const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const baseToday = new Date();
export const TODAY = toDateStr(baseToday);
export const addDays = (n: number) => {
  const d = new Date(baseToday);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};
const NOW = Date.now();

// ── Today's Queue ───────────────────────────────────────────────────────
export const INITIAL_APPOINTMENTS: Appointment[] = [
  // Walk-In — currently In Consultation
  {
    id: 'AP-001', patientId: 'P-002', name: 'Ravi Kumar', age: 41, gender: 'Male', bloodGroup: 'B+',
    condition: 'Coronary Risk Monitoring', riskLevel: 'Medium',
    token: 'OP-001', date: TODAY, visitType: 'Walk-In', priority: 'Normal',
    chiefComplaint: 'Chest pain', status: 'In Consultation',
    queuedAt: NOW - 18 * 60000,
    vitals: [
      { label: 'Blood Pressure', value: '138/88', unit: 'mmHg', color: 'var(--blue)' },
      { label: 'Heart Rate',     value: '92',     unit: 'bpm',  color: 'var(--rose)' },
    ],
    activeMedications: [],
  },
  // Walk-In — Completed earlier today
  {
    id: 'AP-002', patientId: 'P-006', name: 'Elena Rodriguez', age: 28, gender: 'Female', bloodGroup: 'O+',
    condition: 'Asthma', riskLevel: 'Low',
    token: 'OP-002', date: TODAY, visitType: 'Walk-In', priority: 'Normal',
    chiefComplaint: 'Inhaler technique review', status: 'Completed',
    queuedAt: NOW - 150 * 60000,
    vitals: [
      { label: 'Blood Pressure', value: '118/76', unit: 'mmHg', color: 'var(--blue)' },
      { label: 'Heart Rate',     value: '70',     unit: 'bpm',  color: 'var(--rose)' },
      { label: 'O₂ Saturation',  value: '97',     unit: '%',    color: 'var(--mineral-700)' },
    ],
    activeMedications: [],
    consultation: { symptoms: 'Mild wheeze on exertion.', investigations: 'Spirometry reviewed — stable.', labTests: [], completedAt: NOW - 100 * 60000 },
  },
  // Walk-In — Waiting, Urgent (Follow-Up, migraine history) — no vitals captured
  {
    id: 'AP-003', patientId: 'P-003', name: 'Amit Patel', age: 45, gender: 'Male', bloodGroup: 'O+',
    condition: 'Migraine', riskLevel: 'Medium',
    token: 'OP-003', date: TODAY, visitType: 'Follow-Up', priority: 'Urgent',
    chiefComplaint: 'Severe headache', status: 'Waiting',
    queuedAt: NOW - 41 * 60000 - 8000,
    vitals: [],
    activeMedications: [
      { id: 'M-1', name: 'Sumatriptan 50mg', dosage: '1 tablet', timing: 'After Lunch', duration: 'SOS', status: 'Active', startDate: 'Apr 2026' },
    ],
  },
  // Walk-In — Waiting, single vital only (Temperature)
  {
    id: 'AP-004', patientId: 'P-004', name: 'Neha Gupta', age: 28, gender: 'Female', bloodGroup: 'AB-',
    condition: 'Seasonal Flu', riskLevel: 'Low',
    token: 'OP-004', date: TODAY, visitType: 'Walk-In', priority: 'Normal',
    chiefComplaint: 'Fever & cold', status: 'Waiting',
    queuedAt: NOW - 31 * 60000 - 8000,
    vitals: [
      { label: 'Temperature', value: '101.2', unit: '°F', color: 'var(--amber)' },
    ],
    activeMedications: [],
  },
  // Walk-In — Waiting, Urgent, full vitals + active medication
  {
    id: 'AP-005', patientId: 'P-005', name: "James O'Brien", age: 67, gender: 'Male', bloodGroup: 'O-',
    condition: 'Cardiac Arrhythmia', riskLevel: 'High',
    token: 'OP-005', date: TODAY, visitType: 'Follow-Up', priority: 'Urgent',
    chiefComplaint: 'Reported palpitations last night', status: 'Waiting',
    queuedAt: NOW - 12 * 60000,
    vitals: [
      { label: 'Blood Pressure', value: '148/95', unit: 'mmHg', color: 'var(--blue)' },
      { label: 'Heart Rate',     value: '112',    unit: 'bpm',  color: 'var(--rose)' },
      { label: 'O₂ Saturation',  value: '96',     unit: '%',    color: 'var(--mineral-700)' },
    ],
    activeMedications: [
      { id: 'M-2', name: 'Amiodarone 200mg', dosage: '1 tablet', timing: 'After Breakfast', duration: 'Ongoing', status: 'Active', startDate: 'May 2026' },
    ],
  },
  // Scheduled for later today — Follow-Up with active medications (per requirement example)
  {
    id: 'AP-006', patientId: 'P-001', name: 'Sarah Johnson', age: 34, gender: 'Female', bloodGroup: 'A+',
    condition: 'Hypertension', riskLevel: 'Low',
    token: 'OP-006', date: TODAY, visitType: 'Follow-Up', priority: 'Normal',
    chiefComplaint: 'Routine follow-up. BP trending down.', status: 'Scheduled',
    scheduledTime: '11:00 AM',
    vitals: [],
    activeMedications: [
      { id: 'M-3', name: 'Lisinopril 10mg', dosage: '1 tablet', timing: 'Before Breakfast', duration: 'Ongoing', status: 'Active', startDate: 'Jan 2024' },
      { id: 'M-4', name: 'Aspirin 81mg',    dosage: '1 tablet', timing: 'After Breakfast',  duration: 'Ongoing', status: 'Active', startDate: 'Mar 2024' },
      { id: 'M-5', name: 'Amlodipine 5mg',  dosage: '1 tablet', timing: 'Before Breakfast', duration: 'Ongoing', status: 'Active', startDate: 'Jan 2024' },
    ],
  },
  // Scheduled for later today — second visit, no active meds yet
  {
    id: 'AP-007', patientId: 'P-007', name: 'David Nguyen', age: 44, gender: 'Male', bloodGroup: 'B+',
    condition: 'Hypertension', riskLevel: 'Medium',
    token: 'OP-007', date: TODAY, visitType: 'Follow-Up', priority: 'Normal',
    chiefComplaint: 'Second visit post medication start.', status: 'Scheduled',
    scheduledTime: '02:00 PM',
    vitals: [],
    activeMedications: [],
  },

  // ── Upcoming days — My Schedule demo ──
  {
    id: 'AP-008', patientId: 'P-008', name: 'Priya Sharma', age: 41, gender: 'Female', bloodGroup: 'B+',
    condition: 'Migraine', riskLevel: 'Low',
    token: 'OP-008', date: addDays(1), visitType: 'Follow-Up', priority: 'Normal',
    chiefComplaint: 'Frequency increased, consider prophylaxis.', status: 'Scheduled',
    scheduledTime: '10:00 AM', vitals: [], activeMedications: [],
  },
  {
    id: 'AP-009', patientId: 'P-009', name: 'Thomas Klein', age: 59, gender: 'Male', bloodGroup: 'A-',
    condition: 'COPD', riskLevel: 'Medium',
    token: 'OP-009', date: addDays(1), visitType: 'Follow-Up', priority: 'Normal',
    chiefComplaint: 'Spirometry results review.', status: 'Scheduled',
    scheduledTime: '11:30 AM', vitals: [], activeMedications: [],
  },
  {
    id: 'AP-010', patientId: 'P-010', name: 'Aisha Okonkwo', age: 31, gender: 'Female', bloodGroup: 'O+',
    condition: 'Anxiety Disorder', riskLevel: 'Low',
    token: 'OP-010', date: addDays(2), visitType: 'Follow-Up', priority: 'Normal',
    chiefComplaint: 'Monthly check-in, therapy progress.', status: 'Scheduled',
    scheduledTime: '04:30 PM', vitals: [], activeMedications: [],
  },
  {
    id: 'AP-011', patientId: 'P-011', name: 'Marcus Williams', age: 52, gender: 'Male', bloodGroup: 'AB+',
    condition: 'Type 2 Diabetes', riskLevel: 'Medium',
    token: 'OP-011', date: addDays(3), visitType: 'Follow-Up', priority: 'Normal',
    chiefComplaint: 'HbA1c review, adjust Metformin dose.', status: 'Scheduled',
    scheduledTime: '10:00 AM', vitals: [], activeMedications: [],
  },
];

// ── My Patients roster — the doctor's full patient list (not date-bound) ──
export const PATIENT_ROSTER: PatientRecord[] = [
  { id: 'P-001', name: 'Sarah Johnson',   age: 34, gender: 'Female', bloodGroup: 'A+',  condition: 'Hypertension',           riskLevel: 'Low',    phone: '9876500001', lastVisit: '26 Apr 2026', activeMedications: [
    { id: 'M-3', name: 'Lisinopril 10mg', dosage: '1 tablet', timing: 'Before Breakfast', duration: 'Ongoing', status: 'Active', startDate: 'Jan 2024' },
    { id: 'M-4', name: 'Aspirin 81mg',    dosage: '1 tablet', timing: 'After Breakfast',  duration: 'Ongoing', status: 'Active', startDate: 'Mar 2024' },
    { id: 'M-5', name: 'Amlodipine 5mg',  dosage: '1 tablet', timing: 'Before Breakfast', duration: 'Ongoing', status: 'Active', startDate: 'Jan 2024' },
  ]},
  { id: 'P-002', name: 'Ravi Kumar',      age: 41, gender: 'Male',   bloodGroup: 'B+',  condition: 'Coronary Risk Monitoring', riskLevel: 'Medium', phone: '9876500002', lastVisit: 'Today', activeMedications: [] },
  { id: 'P-003', name: 'Amit Patel',      age: 45, gender: 'Male',   bloodGroup: 'O+',  condition: 'Migraine',                riskLevel: 'Medium', phone: '9876500003', lastVisit: 'Today', activeMedications: [
    { id: 'M-1', name: 'Sumatriptan 50mg', dosage: '1 tablet', timing: 'After Lunch', duration: 'SOS', status: 'Active', startDate: 'Apr 2026' },
  ]},
  { id: 'P-004', name: 'Neha Gupta',      age: 28, gender: 'Female', bloodGroup: 'AB-', condition: 'Seasonal Flu',            riskLevel: 'Low',    phone: '9876500004', lastVisit: 'Today', activeMedications: [] },
  { id: 'P-005', name: "James O'Brien",   age: 67, gender: 'Male',   bloodGroup: 'O-',  condition: 'Cardiac Arrhythmia',      riskLevel: 'High',   phone: '9876500005', lastVisit: 'Today', activeMedications: [
    { id: 'M-2', name: 'Amiodarone 200mg', dosage: '1 tablet', timing: 'After Breakfast', duration: 'Ongoing', status: 'Active', startDate: 'May 2026' },
  ]},
  { id: 'P-006', name: 'Elena Rodriguez', age: 28, gender: 'Female', bloodGroup: 'O+',  condition: 'Asthma',                  riskLevel: 'Low',    phone: '9876500006', lastVisit: 'Today', activeMedications: [] },
  { id: 'P-007', name: 'David Nguyen',    age: 44, gender: 'Male',   bloodGroup: 'B+',  condition: 'Hypertension',            riskLevel: 'Medium', phone: '9876500007', lastVisit: '02 Mar 2026', activeMedications: [] },
  { id: 'P-008', name: 'Priya Sharma',    age: 41, gender: 'Female', bloodGroup: 'B+',  condition: 'Migraine',                riskLevel: 'Low',    phone: '9876500008', lastVisit: '15 Mar 2026', activeMedications: [] },
  { id: 'P-009', name: 'Thomas Klein',    age: 59, gender: 'Male',   bloodGroup: 'A-',  condition: 'COPD',                    riskLevel: 'Medium', phone: '9876500009', lastVisit: '20 Mar 2026', activeMedications: [] },
  { id: 'P-010', name: 'Aisha Okonkwo',   age: 31, gender: 'Female', bloodGroup: 'O+',  condition: 'Anxiety Disorder',        riskLevel: 'Low',    phone: '9876500010', lastVisit: '28 Mar 2026', activeMedications: [] },
  { id: 'P-011', name: 'Marcus Williams', age: 52, gender: 'Male',   bloodGroup: 'AB+', condition: 'Type 2 Diabetes',         riskLevel: 'Medium', phone: '9876500011', lastVisit: '30 Mar 2026', activeMedications: [] },
];
