/**
 * billingData.ts — seed data for the Lab Technician › Settings section.
 * ----------------------------------------------------------------------------
 *  LT_PROFILE      the "submitted at registration" record for THIS hospital
 *                  (Hospital details, Contact, Licenses, Documents).
 *  LT_PLAN_CARDS   the four subscription tiers (Pilot / Core / Scale / Enterprise).
 *  LT_SUBSCRIPTION the hospital's current live subscription (initial state).
 *  LT_INVOICES     invoices already received by THIS hospital (initial state).
 *
 *  NOTE(backend): all of this is mirrored from the Super Admin registration /
 *  billing model. Wire LT_PROFILE to the approved registration record, and
 *  LT_SUBSCRIPTION / LT_INVOICES to the billing service. Marked TODO(backend)
 *  at the relevant call-sites in screens/Settings.tsx.
 */
import type {
  LtHospitalProfile, LtPlanCard, LtSubscription, LtInvoice,
} from '../types/labtech.types';

/* This hospital's registration record (read-only mirror of what was submitted). */
export const LT_PROFILE: LtHospitalProfile = {
  legalName:    'Vexoo General Hospital Pvt. Ltd.',
  facilityType: 'Multi-speciality hospital',
  beds:         148,
  established:  '2011',
  addressLine:  '57, Banjara Hills Road No. 12',
  city:         'Hyderabad',
  state:        'Telangana',
  pincode:      '500034',
  gstin:        '36AABCV5678H1Z2',
  pan:          'AABCV5678H',
  cea:          'CEA/TG/HYD/2011/05521',
  contactName:  'Kevin Liu',
  designation:  'Senior Lab Technician',
  email:        'lab@vexoo.in',
  phone:        '+91 98765 11223',
  altPhone:     '+91 90000 22446',
  licenses: [
    { name: 'CEA Certificate',          no: 'CEA/TG/HYD/2011/05521',  valid: '14 Aug 2027' },
    { name: 'Clinical Lab (CLE) Reg.',  no: 'CLE-TG-HYD/22841',        valid: '11 Jul 2026' },
    { name: 'NABL Accreditation',       no: 'NABL/MC/2023/TG/1192',    valid: '28 Feb 2027' },
    { name: 'Bio-medical Waste Auth.',  no: 'BMW/TGPCB/2011/4188',     valid: '22 Nov 2026' },
    { name: 'Fire NOC',                 no: 'FIRE/HYD/2024/01277',     valid: '30 Apr 2027' },
    { name: 'NABH Accreditation',       no: 'NABH/AC/2023/TG/0241',    valid: '15 Dec 2026' },
  ],
  documents: [
    { name: 'Registration certificate.pdf', size: '258 KB', kind: 'PDF' },
    { name: 'CEA certificate.pdf',           size: '204 KB', kind: 'PDF' },
    { name: 'NABL accreditation.pdf',        size: '198 KB', kind: 'PDF' },
    { name: 'GST registration.pdf',          size: '138 KB', kind: 'PDF' },
    { name: 'Owner PAN & ID.pdf',            size: '94 KB',  kind: 'PDF' },
    { name: 'Fire NOC.pdf',                  size: '172 KB', kind: 'PDF' },
  ],
};

/* The four subscription tiers. Mirrors the Super Admin plan catalogue. */
export const LT_PLAN_CARDS: LtPlanCard[] = [
  {
    id: 'pilot', name: 'Pilot', price: 'Free', cadence: '30-day trial', priceValue: 0,
    tagline: 'Evaluate Vexoo end-to-end', seats: 'Up to 5 staff seats',
    features: ['OPD & Appointments', 'Up to 5 staff seats', 'Email support', 'Single location'],
  },
  {
    id: 'core', name: 'Core', price: '₹24,000', cadence: '/month', priceValue: 24000, popular: true,
    tagline: 'For growing single hospitals', seats: 'Up to 40 staff seats',
    features: ['Everything in Pilot', 'IPD, Pharmacy & Lab', 'Up to 40 staff seats', 'Patient portal'],
  },
  {
    id: 'scale', name: 'Scale', price: '₹62,000', cadence: '/month', priceValue: 62000,
    tagline: 'Multi-department hospitals', seats: 'Unlimited seats',
    features: ['Everything in Core', 'Radiology (RIS/PACS)', 'Unlimited seats', 'Priority support & SLA'],
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 'Custom', cadence: '/contact us', priceValue: null,
    tagline: 'Hospital groups & chains', seats: 'Unlimited seats',
    features: ['Everything in Scale', 'Multi-branch consolidation', 'Dedicated success manager', 'Custom integrations & SSO'],
  },
];

/* Current live subscription for THIS hospital (initial state). */
export const LT_SUBSCRIPTION: LtSubscription = {
  plan: 'core',
  status: 'Active',
  startedOn: '12 Apr 2026',
  validUntil: '11 May 2026',
};

/* Invoices already received by THIS hospital (initial state — newest first). */
export const LT_INVOICES: LtInvoice[] = [
  { id: 'INV-2026-0148', plan: 'core', amount: '₹24,000', date: '12 Apr 2026', status: 'paid' },
  { id: 'INV-2026-0121', plan: 'core', amount: '₹24,000', date: '12 Mar 2026', status: 'paid' },
  { id: 'INV-2026-0096', plan: 'core', amount: '₹24,000', date: '12 Feb 2026', status: 'paid' },
];

/* Plan-tier label (mirrors the Super Admin plan pill palette). */
export const LT_PLAN_LABEL: Record<LtPlanCard['id'], string> = {
  pilot: 'Pilot', core: 'Core', scale: 'Scale', enterprise: 'Enterprise',
};
