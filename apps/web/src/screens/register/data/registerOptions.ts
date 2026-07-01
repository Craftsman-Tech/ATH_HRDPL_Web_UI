/**
 * registerOptions.ts — reference data for the registration form.
 *
 * India-first: full set of States + UTs, establishment / ownership types per
 * Indian norms, and the License-tab document checklist (CEA, Drug License,
 * BMW, GST, PAN, Fire NOC). Swap/extend these lists when expanding to other
 * countries without touching the components.
 */
import type { DocConfig } from '../types/register.types';

export const STATES: string[] = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi (NCT)', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
  'Other…',
];

export const ESTABLISHMENT_TYPES: string[] = [
  'Multi-speciality hospital',
  'Single-speciality hospital',
  'Nursing home',
  'Maternity home',
  'Day-care / OPD clinic',
  'Dental clinic',
  'Eye / ENT centre',
  'Diagnostic centre',
  'AYUSH / Ayurveda',
];

export const OWNERSHIP_TYPES: string[] = [
  'Private — Proprietorship',
  'Private — Pvt Ltd',
  'Partnership / LLP',
  'Trust / Society',
  'Charitable',
  'Government',
  'PPP',
];

export const NABH_OPTIONS: string[] = [
  'None',
  'NABH — Entry level',
  'NABH — Full',
  'NABL accredited lab',
  'NABH + NABL',
];

/** License-tab uploads. `required` items gate the final Submit button. */
export const DOCS: DocConfig[] = [
  { id: 'cea',  label: 'CEA registration certificate',    accept: '.pdf',                 meta: 'PDF · ≤ 5 MB',       required: true  },
  { id: 'drug', label: 'Drug license (Form 20/21)',       accept: '.pdf',                 meta: 'PDF · ≤ 5 MB',       required: false },
  { id: 'bmw',  label: 'Bio-medical waste authorisation', accept: '.pdf',                 meta: 'PDF · ≤ 5 MB',       required: false },
  { id: 'gst',  label: 'GST certificate',                 accept: '.pdf',                 meta: 'PDF · ≤ 5 MB',       required: true  },
  { id: 'pan',  label: 'PAN card (establishment)',        accept: '.pdf,.jpg,.jpeg,.png', meta: 'PDF, JPG · ≤ 2 MB',  required: true  },
  { id: 'fire', label: 'Fire safety NOC',                 accept: '.pdf',                 meta: 'PDF · ≤ 5 MB',       required: false },
];

export const STEPS = ['Hospital', 'Contact', 'License'] as const;
