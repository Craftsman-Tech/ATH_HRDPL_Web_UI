import type { Lab, Trend } from '../types';

export const LABS: Lab[] = [
  { name: 'Complete Blood Count (CBC)', date: 'Apr 25, 2026', doctor: 'Dr. Amy Chen', status: 'Normal',     color: '#15a06b', rows: [
    { k: 'White Blood Cells', v: '6.8',  u: 'K/μL',  ref: '4.5–11.0', flag: 'normal' },
    { k: 'Red Blood Cells',   v: '4.5',  u: 'M/μL',  ref: '4.2–5.4',  flag: 'normal' },
    { k: 'Hemoglobin',        v: '13.8', u: 'g/dL',  ref: '12.0–16.0',flag: 'normal' },
    { k: 'Platelets',         v: '250',  u: 'K/μL',  ref: '150–400',  flag: 'normal' },
  ]},
  { name: 'Lipid Panel',               date: 'Mar 15, 2026', doctor: 'Dr. Amy Chen', status: 'Borderline', color: '#e0951a', rows: [
    { k: 'Total Cholesterol', v: '210', u: 'mg/dL', ref: '< 200', flag: 'high'   },
    { k: 'LDL',               v: '130', u: 'mg/dL', ref: '< 100', flag: 'high'   },
    { k: 'HDL',               v: '55',  u: 'mg/dL', ref: '> 40',  flag: 'normal' },
    { k: 'Triglycerides',     v: '145', u: 'mg/dL', ref: '< 150', flag: 'normal' },
  ]},
  { name: 'Metabolic Panel',           date: 'Mar 15, 2026', doctor: 'Dr. Amy Chen', status: 'Normal',     color: '#15a06b', rows: [
    { k: 'Glucose (fasting)', v: '96',  u: 'mg/dL',  ref: '70–100', flag: 'normal' },
    { k: 'Sodium',            v: '139', u: 'mmol/L', ref: '135–145',flag: 'normal' },
    { k: 'Potassium',         v: '4.2', u: 'mmol/L', ref: '3.5–5.0',flag: 'normal' },
    { k: 'Creatinine',        v: '0.9', u: 'mg/dL',  ref: '0.6–1.1',flag: 'normal' },
  ]},
];

export const TRENDS: Trend[] = [
  { key: 'bp',   label: 'Blood Pressure', ic: 'heart',   color: '#e0414b', unit: 'mmHg',  target: 'Target < 130/80', labels: ['Jan','Feb','Mar','Apr','May'], data: [140,136,132,129,128] },
  { key: 'chol', label: 'Cholesterol',    ic: 'droplet', color: '#e0951a', unit: 'mg/dL', target: 'Target < 200',    labels: ['Oct','Dec','Jan','Mar'],       data: [228,220,214,210] },
  { key: 'glc',  label: 'Glucose',        ic: 'spark',   color: '#0E9384', unit: 'mg/dL', target: 'Target 70–100',   labels: ['Jan','Feb','Mar','Apr','May'], data: [102,99,98,97,96] },
  { key: 'wt',   label: 'Weight',         ic: 'scale',   color: '#4F7CFF', unit: 'kg',    target: 'Goal 67 kg',      labels: ['Jan','Feb','Mar','Apr','May'], data: [69.4,69.0,68.6,68.4,68.2] },
];
