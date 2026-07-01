/**
 * ============================================================================
 *  mockHistory.ts — cross-hospital visit history & lab attachments
 * ============================================================================
 *  Powers the "History" and "Attachments" tabs in the Consultation form.
 *  Per requirements these show the patient's last 3–6 months of records
 *  from ALL hospitals (not just Vexoo), so each entry carries its own
 *  `hospital` field. TODO: migrate to packages/shared + wire to a real
 *  cross-hospital records API.
 * ============================================================================
 */
import type { HistoryVisit, LabAttachment } from '../types/doctor.types';

export const HISTORY_BY_PATIENT: Record<string, HistoryVisit[]> = {
  'P-001': [
    {
      id: 'H-101', date: '26 Apr 2026', hospital: 'Vexoo Care Hospital', doctor: 'Dr. Meera Sharma',
      diagnosis: 'Hypertension — routine follow-up', prescriptionSummary: 'Lisinopril 10mg OD, HCTZ 12.5mg OD',
      symptoms: 'Patient reports feeling well. BP readings at home averaging 125/80. No chest pain or dyspnea.',
      investigations: 'BP 128/82. HR 74 reg. RR 16. O2 98%. Weight stable at 68.2 kg.',
      medications: [
        { name: 'Lisinopril 10mg', dosage: '1 tablet', timing: 'Before Breakfast' },
        { name: 'HCTZ 12.5mg',     dosage: '1 tablet', timing: 'After Breakfast' },
      ],
      labTests: ['Lipid Panel'],
    },
    { id: 'H-102', date: '02 Mar 2026', hospital: 'Vexoo Care Hospital', doctor: 'Dr. Meera Sharma', diagnosis: 'Hypertension — BP review', prescriptionSummary: 'Continued Lisinopril 10mg OD' },
    { id: 'H-103', date: '14 Jan 2026', hospital: 'Apollo Clinic, Banjara Hills', doctor: 'Dr. Kavya Reddy', diagnosis: 'Seasonal flu', prescriptionSummary: 'Paracetamol 500mg SOS, rest advised' },
  ],
  'P-003': [
    {
      id: 'H-301', date: '18 Apr 2026', hospital: 'Vexoo Care Hospital', doctor: 'Dr. Arjun Verma',
      diagnosis: 'Migraine — frequency increased', prescriptionSummary: 'Sumatriptan 50mg SOS',
      symptoms: 'Headaches now 3–4 times a week, throbbing, photophobia.',
      investigations: 'Neurological exam unremarkable. No red flags.',
      medications: [{ name: 'Sumatriptan 50mg', dosage: '1 tablet', timing: 'After Lunch' }],
      labTests: ['MRI Brain'],
    },
    { id: 'H-302', date: '02 Feb 2026', hospital: 'Care Hospital, Hitech City', doctor: 'Dr. Rohan Das', diagnosis: 'Migraine — first consult', prescriptionSummary: 'Propranolol 40mg OD, lifestyle advice' },
  ],
  'P-005': [
    {
      id: 'H-401', date: '08 May 2026', hospital: 'Vexoo Care Hospital', doctor: 'Dr. Meera Sharma',
      diagnosis: 'Cardiac arrhythmia — palpitations', prescriptionSummary: 'Amiodarone 200mg OD, ECG advised',
      symptoms: 'Reported palpitations and mild dizziness, worse at night.',
      investigations: 'BP 148/95, HR 112 irregular. ECG shows occasional ectopic beats.',
      medications: [{ name: 'Amiodarone 200mg', dosage: '1 tablet', timing: 'After Breakfast' }],
      labTests: ['ECG', 'Troponin'],
    },
  ],
};

export const ATTACHMENTS_BY_PATIENT: Record<string, LabAttachment[]> = {
  'P-001': [
    { id: 'A-101', date: '26 Apr 2026', hospital: 'Vexoo Care Hospital', testName: 'Lipid Profile', result: 'Normal', fileName: 'lipid_profile_26apr.pdf' },
    { id: 'A-102', date: '02 Mar 2026', hospital: 'Vexoo Care Hospital', testName: 'CBC Panel', result: 'Normal', fileName: 'cbc_02mar.pdf' },
    { id: 'A-103', date: '14 Jan 2026', hospital: 'Apollo Clinic, Banjara Hills', testName: 'Chest X-Ray', result: 'Normal', fileName: 'chest_xray_14jan.pdf' },
  ],
  'P-003': [
    { id: 'A-301', date: '18 Apr 2026', hospital: 'Vexoo Care Hospital', testName: 'MRI Brain', result: 'Pending', fileName: 'mri_brain_18apr.pdf' },
  ],
  'P-005': [
    { id: 'A-401', date: '08 May 2026', hospital: 'Vexoo Care Hospital', testName: 'ECG + Troponin', result: 'Abnormal', fileName: 'ecg_troponin_08may.pdf' },
    { id: 'A-402', date: '20 Mar 2026', hospital: 'Yashoda Hospital, Somajiguda', testName: 'Echocardiogram', result: 'Normal', fileName: 'echo_20mar.pdf' },
  ],
};

export const EMPTY_HISTORY: HistoryVisit[] = [];
export const EMPTY_ATTACHMENTS: LabAttachment[] = [];
