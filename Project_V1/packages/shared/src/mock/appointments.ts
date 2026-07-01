/**
 * Mock appointment data — transcribed from the original mockups.
 */
import type { Appointment } from '../types';

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'A-001', patient: 'Sarah Johnson',   patientId: 'P-001', doctor: 'Dr. Chen',  type: 'Follow-up',     time: '09:00 AM', date: 'May 7, 2026', status: 'Confirmed' },
  { id: 'A-002', patient: 'New Patient',     patientId: 'P-NEW', doctor: 'Dr. Patel', type: 'Consultation',  time: '10:30 AM', date: 'May 7, 2026', status: 'Waiting'   },
  { id: 'A-003', patient: "James O'Brien",   patientId: 'P-004', doctor: 'Dr. Chen',  type: 'Urgent',        time: '11:00 AM', date: 'May 7, 2026', status: 'InProgress'},
  { id: 'A-004', patient: 'Elena Rodriguez', patientId: 'P-003', doctor: 'Dr. Kim',   type: 'Check-up',      time: '01:00 PM', date: 'May 7, 2026', status: 'Confirmed' },
  { id: 'A-005', patient: 'Priya Sharma',    patientId: 'P-005', doctor: 'Dr. Patel', type: 'Follow-up',     time: '02:30 PM', date: 'May 7, 2026', status: 'Confirmed' },
];
