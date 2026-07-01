/**
 * billingData.ts — seed data for the Hospital Admin › Settings section.
 * ----------------------------------------------------------------------------
 *  HA_PROFILE      the "submitted at registration" record for THIS hospital
 *                  (Hospital details, Contact, Licenses, Documents).
 *  HA_PLAN_CARDS   the four subscription tiers (Pilot / Core / Scale / Enterprise).
 *  HA_SUBSCRIPTION the hospital's current live subscription (initial state).
 *  HA_INVOICES     invoices already received by THIS hospital (initial state).
 *
 *  NOTE(backend): all of this is mirrored from the Super Admin registration /
 *  billing model. Wire HA_PROFILE to the approved registration record, and
 *  HA_SUBSCRIPTION / HA_INVOICES to the billing service. Marked TODO(backend)
 *  at the relevant call-sites in screens/Settings.tsx.
 */
import type {
  HaHospitalProfile, HaPlanCard, HaSubscription, HaInvoice,
} from '../types/hospitaladmin.types';

/* This hospital's registration record (read-only mirror of what was submitted). */
export const HA_PROFILE: HaHospitalProfile = {
  legalName:    'Apollo Multispecialty Healthcare Pvt. Ltd.',
  facilityType: 'Multi-speciality hospital',
  beds:         184,
  established:  '2009',
  addressLine:  '142, Jubilee Hills Road No. 36',
  city:         'Hyderabad',
  state:        'Telangana',
  pincode:      '500033',
  gstin:        '36AAPCA1234F1Z5',
  pan:          'AAPCA1234F',
  cea:          'CEA/TG/HYD/2009/04217',
  contactName:  'Anita Reddy',
  designation:  'Administrator',
  email:        'admin@vexoo.in',
  phone:        '+91 98765 43210',
  altPhone:     '+91 90000 12345',
  licenses: [
    { name: 'CEA Certificate',          no: 'CEA/TG/HYD/2009/04217',  valid: '18 Sep 2027' },
    { name: 'Drug License (Form 20B)',  no: '20B-TG-HYD/48217',        valid: '04 Jul 2026' },
    { name: 'Drug License (Form 21B)',  no: '21B-TG-HYD/48218',        valid: '04 Jul 2026' },
    { name: 'Bio-medical Waste Auth.',  no: 'BMW/TGPCB/2009/3471',     valid: '22 Nov 2026' },
    { name: 'Fire NOC',                 no: 'FIRE/HYD/2024/00912',     valid: '30 Apr 2027' },
    { name: 'NABH Accreditation',       no: 'NABH/AC/2023/TG/0188',    valid: '15 Dec 2026' },
  ],
  documents: [
    { name: 'Registration certificate.pdf', size: '264 KB', kind: 'PDF' },
    { name: 'CEA certificate.pdf',           size: '212 KB', kind: 'PDF' },
    { name: 'Drug license.pdf',              size: '188 KB', kind: 'PDF' },
    { name: 'GST registration.pdf',          size: '142 KB', kind: 'PDF' },
    { name: 'Owner PAN & ID.pdf',            size: '96 KB',  kind: 'PDF' },
    { name: 'Fire NOC.pdf',                  size: '176 KB', kind: 'PDF' },
  ],
};

/* The four subscription tiers. Mirrors the Super Admin plan catalogue. */
export const HA_PLAN_CARDS: HaPlanCard[] = [
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
export const HA_SUBSCRIPTION: HaSubscription = {
  plan: 'core',
  status: 'Active',
  startedOn: '12 Apr 2026',
  validUntil: '11 May 2026',
};

/* Invoices already received by THIS hospital (initial state — newest first). */
export const HA_INVOICES: HaInvoice[] = [
  { id: 'INV-2026-0148', plan: 'core', amount: '₹24,000', date: '12 Apr 2026', status: 'paid' },
  { id: 'INV-2026-0121', plan: 'core', amount: '₹24,000', date: '12 Mar 2026', status: 'paid' },
  { id: 'INV-2026-0096', plan: 'core', amount: '₹24,000', date: '12 Feb 2026', status: 'paid' },
];

/* Plan-tier label + pill colour (mirrors the Super Admin plan pill palette). */
export const HA_PLAN_LABEL: Record<HaPlanCard['id'], string> = {
  pilot: 'Pilot', core: 'Core', scale: 'Scale', enterprise: 'Enterprise',
};
