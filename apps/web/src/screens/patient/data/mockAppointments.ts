import type { UpcomingAppt, PastAppt } from '../types/patient.types';

export const UPCOMING: UpcomingAppt[] = [
  { dd: '15', mo: 'May', day: 'Thu', type: 'Routine Follow-up',  doctor: 'Dr. Amy Chen',  dept: 'Cardiology', time: '10:00 AM', room: 'Room 104',   mode: 'In-person', status: 'Confirmed', sColor: '#15a06b', sBg: '#dbf3e6' },
  { dd: '03', mo: 'Jun', day: 'Wed', type: 'Lab Results Review', doctor: 'Dr. Raj Patel', dept: 'General',    time: '2:30 PM',  room: 'Telehealth', mode: 'Video',     status: 'Pending',   sColor: '#e0951a', sBg: '#fdf3e3' },
];

export const PAST: PastAppt[] = [
  { date: 'Apr 20, 2026', doctor: 'Dr. Amy Chen', type: 'Routine Follow-up',  summary: 'BP 128/82, well controlled. Continue current medications. Dietary changes showing positive results.' },
  { date: 'Mar 15, 2026', doctor: 'Dr. Amy Chen', type: 'Lab Results Review', summary: 'CBC and metabolic panel reviewed — all values within normal range. Lipid panel borderline; diet modifications advised.' },
  { date: 'Feb 8, 2026',  doctor: 'Dr. Amy Chen', type: 'Annual Physical',    summary: 'Full physical completed. EKG normal sinus rhythm. Weight stable at 68.2 kg. Sodium-reduction advice given.' },
];
