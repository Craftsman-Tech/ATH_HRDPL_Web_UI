import type { Stat, Alert, FeedItem, QuickAction, WellnessBar, Insight, AdviceItem, ChangedMetric, ScreenId } from '../types/patient.types';

export const STATS: Stat[] = [
  { ic: 'heart',   color: '#e0414b', bg: '#fdecec', val: '128/82', unit: 'mmHg',  label: 'Blood Pressure', sub: 'Stage 1 · stable',   delta: '4%',  up: false, good: true },
  { ic: 'spark',   color: '#0E9384', bg: '#eef6f4', val: '74',     unit: 'bpm',   label: 'Heart Rate',     sub: 'Resting · normal',   delta: '2%',  up: false, good: true },
  { ic: 'scale',   color: '#e0951a', bg: '#fdf3e3', val: '68.2',   unit: 'kg',    label: 'Weight',         sub: 'BMI 22.4 · healthy', delta: '1.2', up: false, good: true },
  { ic: 'wind',    color: '#4F7CFF', bg: '#eaf0ff', val: '98',     unit: '%',     label: 'O₂ Saturation',  sub: 'Excellent',          delta: '0%',  up: true,  good: true },
  { ic: 'droplet', color: '#0E9384', bg: '#eef6f4', val: '96',     unit: 'mg/dL', label: 'Glucose',        sub: 'Fasting · normal',   delta: '3%',  up: false, good: true },
  { ic: 'flame',   color: '#e0951a', bg: '#fdf3e3', val: '1,840',  unit: 'kcal',  label: 'Daily Burn',     sub: 'Avg this week',      delta: '6%',  up: true,  good: true },
];

export const QUICK: QuickAction[] = [
  { ic: 'calendar', color: '#0E9384', bg: '#eef6f4', label: 'Book Appointment', to: 'appts'    as ScreenId },
  { ic: 'message',  color: '#4F7CFF', bg: '#eaf0ff', label: 'Message Doctor',   to: 'messages' as ScreenId },
  { ic: 'pill',     color: '#e0951a', bg: '#fdf3e3', label: 'Request a Refill', to: 'meds'     as ScreenId },
];

export const WELLNESS: WellnessBar[] = [
  { ic: 'foot',    label: 'Activity',  val: '8,420 steps', pct: 84, color: '#0E9384' },
  { ic: 'moon',    label: 'Sleep',     val: '7h 20m',      pct: 78, color: '#4F7CFF' },
  { ic: 'flame',   label: 'Nutrition', val: '1,840 kcal',  pct: 72, color: '#e0951a' },
  { ic: 'droplet', label: 'Hydration', val: '1.8 / 2.5 L', pct: 65, color: '#15b3a2' },
];

export const INSIGHTS: Insight[] = [
  { ic: 'up',    color: '#15a06b', bg: '#dbf3e6', text: 'Your blood pressure has improved 6% over the last month — keep up the daily walks and low-sodium diet.' },
  { ic: 'clock', color: '#e0951a', bg: '#fdf3e3', text: 'Lisinopril refill is due in 6 days. Request it early to avoid a gap in your medication.' },
  { ic: 'heart', color: '#4F7CFF', bg: '#eaf0ff', text: 'Resting heart rate is trending down — a strong sign your cardiovascular fitness is increasing.' },
];

export const ALERTS: Alert[] = [
  { ic: 'pill',     color: '#e0951a', bg: '#fffaf0', border: '#f3e4c4', title: 'Refill due soon',       time: '6 days',    text: 'Lisinopril 10mg — 12 pills remaining.',            cta: 'Request Refill' },
  { ic: 'calendar', color: '#0E9384', bg: '#f3fbf9', border: '#cfe6e1', title: 'Upcoming appointment',  time: 'May 15',    text: 'Dr. Amy Chen · Cardiology · 10:00 AM.',             cta: 'View Details'   },
  { ic: 'lab',      color: '#4F7CFF', bg: '#f5f8ff', border: '#d4e0ff', title: 'New lab results',       time: '2 days ago',text: 'Complete Blood Count (CBC) is ready to view.',      cta: 'View Results'   },
];

export const FEED: FeedItem[] = [
  { ic: 'lab',      color: '#4F7CFF', bg: '#eaf0ff', text: 'CBC lab results uploaded by Dr. Chen', time: '2 days ago' },
  { ic: 'pill',     color: '#0E9384', bg: '#eef6f4', text: 'Aspirin 81mg prescription renewed',    time: '4 days ago' },
  { ic: 'message',  color: '#e0951a', bg: '#fdf3e3', text: 'Dr. Chen replied to your message',     time: '5 days ago' },
  { ic: 'calendar', color: '#15a06b', bg: '#dbf3e6', text: 'Follow-up appointment completed',      time: 'Apr 20'     },
];

export const ADVICE: AdviceItem[] = [
  { ic: 'droplet', title: 'Reduce salt intake',      detail: 'Aim for under 1,500mg sodium per day' },
  { ic: 'foot',    title: 'Walk 5,000+ steps daily', detail: 'You are averaging 8,420 — excellent'  },
  { ic: 'moon',    title: 'Sleep 7–8 hours',         detail: 'Consistent sleep aids BP control'     },
  { ic: 'heart',   title: 'Monitor BP at home',      detail: 'Log readings twice weekly'            },
];

export const CHANGED: ChangedMetric[] = [
  { label: 'Blood Pressure',  icon: 'heart',   from: '142/90',    to: '128/82',   status: 'Improved', color: '#15a06b', bg: '#dbf3e6' },
  { label: 'HbA1c',           icon: 'droplet', from: '6.8%',      to: '6.2%',     status: 'Improved', color: '#15a06b', bg: '#dbf3e6' },
  { label: 'LDL Cholesterol', icon: 'spark',   from: '148 mg/dL', to: '122 mg/dL',status: 'Improved', color: '#15a06b', bg: '#dbf3e6' },
  { label: 'Resting HR',      icon: 'spark',   from: '78 bpm',    to: '71 bpm',   status: 'Improved', color: '#15a06b', bg: '#dbf3e6' },
];
