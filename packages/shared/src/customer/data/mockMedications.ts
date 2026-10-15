import type { Med } from '../types';

export const MEDS: Med[] = [
  { name: 'Lisinopril', dose: '10mg', purpose: 'Blood pressure (ACE inhibitor)', icon: 'pill',
    schedule: { morning: 'taken', noon: 'off', night: 'off' }, remaining: 12, total: 30, refill: 'May 20, 2026', status: 'Active' },
  { name: 'HCTZ',       dose: '12.5mg', purpose: 'Diuretic — fluid balance',     icon: 'droplet',
    schedule: { morning: 'taken', noon: 'off', night: 'off' }, remaining: 12, total: 30, refill: 'May 20, 2026', status: 'Active' },
  { name: 'Aspirin',    dose: '81mg',   purpose: 'Antiplatelet — heart protection', icon: 'heart',
    schedule: { morning: 'todo', noon: 'off', night: 'off' }, remaining: 28, total: 30, refill: 'Jun 10, 2026', status: 'Active' },
  { name: 'Metformin',  dose: '500mg',  purpose: 'Blood sugar (course completed)',  icon: 'pill',
    schedule: { morning: 'off', noon: 'off', night: 'off' }, remaining: 0,  total: 60, refill: 'N/A',          status: 'Completed' },
];

export const PHARMACIES = [
  'Apollo Pharmacy – Banjara Hills',
  'MedPlus – Jubilee Hills',
  'Wellness Forever – Madhapur',
  'Netmeds Delivery',
  'Frank Ross – Kondapur',
];
