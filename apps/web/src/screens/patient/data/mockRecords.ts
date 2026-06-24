import type { Visit, Folder, FolderDoc, Member, Goal, Achievement, Tip } from '../types/patient.types';

export const MEMBERS: Member[] = [
  { name: 'Sarah Johnson',   rel: 'You',      id: 'P-001', blood: 'A+', age: 32, dot: '#0E9384' },
  { name: 'Michael Johnson', rel: 'Spouse',   id: 'P-014', blood: 'O+', age: 35, dot: '#4F7CFF' },
  { name: 'Emma Johnson',    rel: 'Daughter', id: 'P-027', blood: 'A+', age: 7,  dot: '#e0951a' },
];

export const TIMELINE: Visit[] = [
  { date: 'Apr 20, 2026', title: 'Routine Follow-up',      doctor: 'Dr. Amy Chen', node: 'stetho', color: '#0E9384', bg: '#eef6f4', summary: 'Blood pressure 128/82 mmHg, well controlled. Continue Lisinopril and HCTZ. Lifestyle changes producing positive results. Review in 4 weeks.' },
  { date: 'Mar 15, 2026', title: 'Lab Results Review',     doctor: 'Dr. Amy Chen', node: 'lab',    color: '#4F7CFF', bg: '#eaf0ff', summary: 'CBC and metabolic panel within normal range. Lipid panel shows borderline cholesterol — dietary modifications recommended over medication for now.' },
  { date: 'Feb 8, 2026',  title: 'Annual Physical',        doctor: 'Dr. Amy Chen', node: 'heart',  color: '#e0414b', bg: '#fdecec', summary: 'Comprehensive annual physical. EKG shows normal sinus rhythm. Weight stable. All systems unremarkable. Counselled on sodium reduction.' },
  { date: 'Jan 5, 2026',  title: 'Medication Adjustment',  doctor: 'Dr. Amy Chen', node: 'pill',   color: '#e0951a', bg: '#fdf3e3', summary: 'Increased Lisinopril from 5mg to 10mg due to elevated readings (140/90). Patient counselled on side effects. Follow-up in 6 weeks.' },
];

export const FOLDERS: Folder[] = [
  { name: 'Lab Reports',   count: 12, meta: 'Updated 2 days ago', ic: 'lab',     color: '#4F7CFF', bg: '#eaf0ff' },
  { name: 'Prescriptions', count: 8,  meta: 'Updated 4 days ago', ic: 'pill',    color: '#0E9384', bg: '#eef6f4' },
  { name: 'Imaging',       count: 5,  meta: 'Updated Feb 2026',   ic: 'records', color: '#e0951a', bg: '#fdf3e3' },
  { name: 'Visit Notes',   count: 16, meta: 'Updated Apr 2026',   ic: 'doc',     color: '#15a06b', bg: '#dbf3e6' },
];

export const FOLDER_DOCS: Record<string, FolderDoc[]> = {
  'Lab Reports':   [
    { name: 'CBC Report – Apr 2026',        date: '2026-04-25', type: 'PDF' },
    { name: 'Lipid Panel – Mar 2026',       date: '2026-03-15', type: 'PDF' },
    { name: 'Metabolic Panel – Mar 2026',   date: '2026-03-15', type: 'PDF' },
    { name: 'Blood Sugar – Jan 2026',       date: '2026-01-10', type: 'PDF' },
  ],
  'Prescriptions': [
    { name: 'Lisinopril 10mg Rx',           date: '2026-04-20', type: 'PDF' },
    { name: 'HCTZ 12.5mg Rx',              date: '2026-04-20', type: 'PDF' },
    { name: 'Aspirin 81mg Rx',             date: '2026-03-15', type: 'PDF' },
  ],
  'Imaging':       [
    { name: 'Chest X-Ray – Feb 2026',      date: '2026-02-08', type: 'PDF' },
    { name: 'ECG Report – Feb 2026',       date: '2026-02-08', type: 'PDF' },
  ],
  'Visit Notes':   [
    { name: 'Follow-up Notes – Apr 2026',  date: '2026-04-20', type: 'PDF' },
    { name: 'Lab Review Notes – Mar 2026', date: '2026-03-15', type: 'PDF' },
    { name: 'Annual Physical Notes',       date: '2026-02-08', type: 'PDF' },
  ],
};

export const GOALS: Goal[] = [
  { ic: 'foot',    label: 'Steps',    val: '84%', meta: '8.4k / 10k', pct: 84, color: '#0E9384' },
  { ic: 'moon',    label: 'Sleep',    val: '92%', meta: '7.3 / 8 h',  pct: 92, color: '#4F7CFF' },
  { ic: 'droplet', label: 'Water',    val: '65%', meta: '1.8 / 2.5 L',pct: 65, color: '#15b3a2' },
  { ic: 'flame',   label: 'Exercise', val: '78%', meta: '3.9 / 5 d',  pct: 78, color: '#e0951a' },
];

export const ACHIEVEMENTS: Achievement[] = [
  { ic: 'flame', title: '30-Day Streak', desc: 'Logged BP for 30 days straight', earned: true  },
  { ic: 'foot',  title: 'Step Master',   desc: '10k+ steps for a full week',     earned: true  },
  { ic: 'heart', title: 'Heart Hero',    desc: 'BP in target for 3 months',      earned: false },
];

export const TIPS: Tip[] = [
  { ic: 'bulb',  color: '#e0951a', bg: '#fdf3e3', title: 'Hydration boost',    body: 'You\u2019re slightly behind on water today. A glass before each meal helps you stay on track.' },
  { ic: 'heart', color: '#e0414b', bg: '#fdecec', title: 'Heart-healthy snack',body: 'Try a handful of unsalted almonds \u2014 good fats that support cardiovascular health.' },
];
