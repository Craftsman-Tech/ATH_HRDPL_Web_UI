import type { AddedMember, VaxEntry, Folder, Visit } from '../types/patient.types';

export const RELATIONS = ['Spouse','Father','Mother','Son','Daughter','Brother','Sister','Grandfather','Grandmother','Other'];

export const SEED_FAMILY: AddedMember[] = [
  { id: 'seed1', name: 'Michael Johnson', relation: 'Spouse',   age: 35, sex: 'Male',   blood: 'O+', condition: '' },
  { id: 'seed2', name: 'Emma Johnson',    relation: 'Daughter', age: 7,  sex: 'Female', blood: 'A+', condition: 'Mild asthma' },
];

export const FAMILY_TIMELINE: Record<string, Visit[]> = {
  seed1: [
    { date: 'Mar 10, 2026', title: 'Annual Check-up',     doctor: 'Dr. Raj Patel',   node: 'stetho', color: '#0E9384', bg: '#eef6f4', summary: 'Blood pressure 118/76. ECG normal. Weight stable at 82 kg. No concerns. Continue annual monitoring.' },
    { date: 'Jan 20, 2026', title: 'Dental Consultation', doctor: 'Dr. Priya Nair',  node: 'heart',  color: '#4F7CFF', bg: '#eaf0ff', summary: 'Routine cleaning and checkup. No cavities. Advised fluoride rinse. Next visit in 6 months.' },
  ],
  seed2: [
    { date: 'Apr 5, 2026',  title: 'Asthma Review',       doctor: 'Dr. Kavya Reddy', node: 'wind',   color: '#e0951a', bg: '#fdf3e3', summary: 'Mild asthma well-controlled on Salbutamol inhaler as-needed. Lung function normal. No night symptoms reported.' },
    { date: 'Feb 14, 2026', title: 'Paediatric Check-up', doctor: 'Dr. Kavya Reddy', node: 'stetho', color: '#0E9384', bg: '#eef6f4', summary: 'Growth on track. Vaccinations up to date. No developmental concerns. Good school performance.' },
  ],
};

export const FAMILY_FOLDERS: Record<string, Folder[]> = {
  seed1: [
    { name: 'Lab Reports',   count: 4, meta: 'Updated Mar 2026', ic: 'lab',     color: '#4F7CFF', bg: '#eaf0ff' },
    { name: 'Prescriptions', count: 2, meta: 'Updated Mar 2026', ic: 'pill',    color: '#0E9384', bg: '#eef6f4' },
    { name: 'Imaging',       count: 1, meta: 'Updated Jan 2026', ic: 'records', color: '#e0951a', bg: '#fdf3e3' },
    { name: 'Visit Notes',   count: 3, meta: 'Updated Mar 2026', ic: 'doc',     color: '#15a06b', bg: '#dbf3e6' },
  ],
  seed2: [
    { name: 'Lab Reports',   count: 2, meta: 'Updated Apr 2026', ic: 'lab',     color: '#4F7CFF', bg: '#eaf0ff' },
    { name: 'Prescriptions', count: 3, meta: 'Updated Apr 2026', ic: 'pill',    color: '#0E9384', bg: '#eef6f4' },
    { name: 'Visit Notes',   count: 2, meta: 'Updated Apr 2026', ic: 'doc',     color: '#15a06b', bg: '#dbf3e6' },
    { name: 'Imaging',       count: 0, meta: 'No imaging yet',   ic: 'records', color: '#e0951a', bg: '#fdf3e3' },
  ],
};

export const FAMILY_EMERGENCY: Record<string, { allergies: string; conditions: string; contact: string }> = {
  seed1: { allergies: 'None known',        conditions: 'No chronic conditions', contact: 'Sarah Johnson \u00b7 +91 98765 43210' },
  seed2: { allergies: 'Dust mites (mild)', conditions: 'Mild asthma',           contact: 'Sarah Johnson \u00b7 +91 98765 43210' },
};

export const DEFAULT_VAX: VaxEntry[] = [
  { name: 'COVID-19',       last: '2025', next: '2026',     status: 'Up to date' },
  { name: 'Influenza',      last: '2024', next: 'Due soon', status: 'Due soon'   },
  { name: 'Tetanus (Tdap)', last: '2020', next: '2030',     status: 'Up to date' },
  { name: 'Hepatitis B',    last: '\u2014', next: '2026',   status: 'Due soon'   },
];
