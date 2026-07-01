/**
 * Mock patients — directly transcribed from the original HTML mockups.
 * Replace this file with real API calls once the backend is ready;
 * the SHAPE of the data must remain identical (see Patient type).
 */
import type { Patient } from '../types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'P-001', name: 'Sarah Johnson', age: 34,
    condition: 'Hypertension', doctor: 'Dr. Chen',
    status: 'Stable', risk: 'Low', lastVisit: 'Apr 20',
    allergies: 'Penicillin',
    vitals: { bp: '128/82', hr: 74 },
  },
  {
    id: 'P-002', name: 'Marcus Williams', age: 52,
    condition: 'Type 2 Diabetes', doctor: 'Dr. Patel',
    status: 'Monitoring', risk: 'Medium', lastVisit: 'Apr 18',
    allergies: 'None known',
    vitals: { bp: '135/88', hr: 82 },
  },
  {
    id: 'P-003', name: 'Elena Rodriguez', age: 28,
    condition: 'Asthma', doctor: 'Dr. Kim',
    status: 'Stable', risk: 'Low', lastVisit: 'Apr 22',
    allergies: 'None known',
    vitals: { bp: '118/76', hr: 68 },
  },
  {
    id: 'P-004', name: "James O'Brien", age: 67,
    condition: 'Cardiac Arrhythmia', doctor: 'Dr. Chen',
    status: 'Critical', risk: 'High', lastVisit: 'Apr 24',
    allergies: 'Sulfonamides',
    vitals: { bp: '148/95', hr: 110 },
  },
  {
    id: 'P-005', name: 'Priya Sharma', age: 41,
    condition: 'Migraine', doctor: 'Dr. Patel',
    status: 'Stable', risk: 'Low', lastVisit: 'Apr 19',
    allergies: 'Aspirin (mild)',
    vitals: { bp: '120/78', hr: 72 },
  },
  {
    id: 'P-006', name: 'Thomas Klein', age: 59,
    condition: 'COPD', doctor: 'Dr. Kim',
    status: 'Monitoring', risk: 'Medium', lastVisit: 'Apr 21',
    allergies: 'None known',
    vitals: { bp: '130/84', hr: 80 },
  },
];
