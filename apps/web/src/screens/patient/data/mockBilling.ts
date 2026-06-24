import type { Invoice } from '../types/patient.types';

export const INVOICES: Invoice[] = [
  { id: 'INV-2408', date: 'Apr 20, 2026', desc: 'Routine Follow-up',       amount: '\u20B940',  method: 'Visa \u2022\u2022 4421', status: 'Paid' },
  { id: 'INV-2315', date: 'Mar 15, 2026', desc: 'Lab Work + Consultation', amount: '\u20B9100', method: 'Visa \u2022\u2022 4421', status: 'Paid' },
  { id: 'INV-2201', date: 'Feb 8, 2026',  desc: 'Annual Physical',         amount: '\u20B970',  method: 'UPI',                   status: 'Paid' },
  { id: 'INV-2098', date: 'Jan 5, 2026',  desc: 'Medication Review',       amount: '\u20B930',  method: 'Visa \u2022\u2022 4421', status: 'Paid' },
];
