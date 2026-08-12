export type HaModuleId =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'emr'
  | 'pharmacy'
  | 'lab'
  | 'analytics'
  | 'notifications'
  | 'staff'
  | 'reviews'
  | 'settings';

export type HaTone = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';

export type HaPatient = {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  blood: string;
  condition: string;
  doctor: string;
  status: string;
  phone: string;
  email: string;
  lastVisit: string;
  visits: number;
  allergies: string;
  history: string;
};

export type HaAppointment = {
  id: string;
  patient: string;
  doctor: string;
  type: string;
  time: string;
  date: string;
  isoDate?: string;
  room: string;
  status: string;
};

export type HaPrescription = {
  id: string;
  patient: string;
  drug: string;
  qty: number;
  doctor: string;
  date: string;
  status: string;
  refills: number;
};

export type HaLabOrder = {
  id: string;
  patient: string;
  test: string;
  ordered: string;
  date: string;
  status: string;
  priority: string;
  result: string;
};

export type HaInventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  min: number;
  max?: number;
  unit: string;
  expiry: string;
  status: string;
};

export type HaEquipmentItem = {
  id: string;
  name: string;
  model: string;
  status: 'Online' | 'Warning' | 'Offline';
  load: string;
  lastCalib: string;
  nextCalib: string;
  uptime: string;
  tests: string[];
};

export type HaStaffMember = {
  id: string;
  name: string;
  role: 'Doctor' | 'Receptionist' | 'Pharmacist' | 'LabTech';
  department: string;
  specialization?: string;
  email: string;
  phone: string;
  status: string;
};

export type HaReview = {
  id: string;
  patient: string;
  patientId: string;
  doctor: string;
  department: string;
  visitDate: string;
  receivedDate: string;
  visitType: string;
  rating: number;
  recommend: boolean;
  status: 'New' | 'Read';
  comment: string;
  ratings: {
    hospitalization: number;
    doctorCare: number;
    nursingCare: number;
    waitTime: number;
    pharmacy: number;
    cleanliness: number;
    billing: number;
  };
};

export type HaPlanTier = 'pilot' | 'core' | 'scale' | 'enterprise';

export type HaSubscription = {
  plan: HaPlanTier;
  status: 'Active' | 'New' | 'Cancelled';
  startedOn: string;
  validUntil: string;
};

export type HaInvoice = {
  id: string;
  plan: HaPlanTier;
  amount: string;
  date: string;
  status: 'paid' | 'failed';
};

export type HaPlanCard = {
  id: HaPlanTier;
  name: string;
  price: string;
  cadence: string;
  priceValue: number | null;
  tagline: string;
  seats: string;
  popular?: boolean;
  features: string[];
};

export const HA_MODULES: { id: HaModuleId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'patients', label: 'Patients' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'emr', label: 'Medical Records' },
  { id: 'pharmacy', label: 'Pharmacy' },
  { id: 'lab', label: 'Lab & Diagnostics' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'staff', label: 'Staff Management' },
  { id: 'reviews', label: 'Reviews & Feedback' },
  { id: 'settings', label: 'Settings' },
];

export const HA_PATIENTS: HaPatient[] = [
  { id: 'P-001', name: 'Sarah Johnson', age: 34, gender: 'F', blood: 'A+', condition: 'Hypertension', doctor: 'Dr. Chen', status: 'Stable', phone: '+91 98765 43210', email: 'sarah.j@email.com', lastVisit: '20-04-2026', visits: 14, allergies: 'Penicillin, Sulfonamides', history: 'Hypertension diagnosed in 2022. Family history of cardiac disease. Ex-smoker.' },
  { id: 'P-002', name: 'Marcus Williams', age: 52, gender: 'M', blood: 'O+', condition: 'Type 2 Diabetes', doctor: 'Dr. Patel', status: 'Monitoring', phone: '+91 98765 43211', email: 'marcus.w@email.com', lastVisit: '18-04-2026', visits: 22, allergies: 'None known', history: 'T2DM diagnosed in 2019. BMI 29.4. Hypertension co-morbidity managed.' },
  { id: 'P-003', name: 'Elena Rodriguez', age: 28, gender: 'F', blood: 'B-', condition: 'Asthma', doctor: 'Dr. Kim', status: 'Stable', phone: '+91 98765 43212', email: 'elena.r@email.com', lastVisit: '22-04-2026', visits: 8, allergies: 'Aspirin (mild)', history: 'Childhood asthma. Seasonal allergic rhinitis. No hospitalisations in past 3 years.' },
  { id: 'P-004', name: "James O'Brien", age: 67, gender: 'M', blood: 'AB+', condition: 'Cardiac Arrhythmia', doctor: 'Dr. Chen', status: 'Critical', phone: '+91 98765 43213', email: 'james.o@email.com', lastVisit: '24-04-2026', visits: 31, allergies: 'Warfarin risk', history: 'AF diagnosed in 2020. Pacemaker implanted Jan 2023. Previous MI 2018.' },
  { id: 'P-005', name: 'Priya Sharma', age: 41, gender: 'F', blood: 'A-', condition: 'Migraine', doctor: 'Dr. Patel', status: 'Stable', phone: '+91 98765 43214', email: 'priya.s@email.com', lastVisit: '19-04-2026', visits: 11, allergies: 'None known', history: 'Chronic migraine with aura since 2017. Hormonal triggers identified.' },
  { id: 'P-006', name: 'Thomas Klein', age: 59, gender: 'M', blood: 'O-', condition: 'COPD', doctor: 'Dr. Kim', status: 'Monitoring', phone: '+91 98765 43215', email: 'thomas.k@email.com', lastVisit: '15-04-2026', visits: 19, allergies: 'Beta-blockers', history: 'COPD Stage II diagnosed 2021. 30-pack-year smoking history. Quit 2020.' },
];

export const HA_APPOINTMENTS: HaAppointment[] = [
  { id: 'A-001', patient: 'Sarah Johnson', doctor: 'Dr. Chen', type: 'Follow-up', time: '09:00 AM', date: 'Apr 26', room: 'Room 104', status: 'Confirmed' },
  { id: 'A-002', patient: 'New Patient', doctor: 'Dr. Patel', type: 'Consultation', time: '10:30 AM', date: 'Apr 26', room: 'Room 201', status: 'Waiting' },
  { id: 'A-003', patient: "James O'Brien", doctor: 'Dr. Chen', type: 'Urgent', time: '11:00 AM', date: 'Apr 26', room: 'Room 104', status: 'In Progress' },
  { id: 'A-004', patient: 'Elena Rodriguez', doctor: 'Dr. Kim', type: 'Check-up', time: '01:00 PM', date: 'Apr 26', room: 'Room 302', status: 'Confirmed' },
  { id: 'A-005', patient: 'Priya Sharma', doctor: 'Dr. Patel', type: 'Follow-up', time: '02:30 PM', date: 'Apr 26', room: 'Room 201', status: 'Confirmed' },
  { id: 'A-013', patient: 'Sarah Johnson', doctor: 'Dr. Chen', type: 'Follow-up', time: '09:00 AM', date: 'Apr 25', room: 'Room 104', status: 'Completed' },
  { id: 'A-015', patient: 'Priya Sharma', doctor: 'Dr. Patel', type: 'Follow-up', time: '11:30 AM', date: 'Apr 25', room: 'Room 201', status: 'No-Show' },
];

export const HA_PRESCRIPTIONS: HaPrescription[] = [
  { id: 'RX-4821', patient: 'Sarah Johnson', drug: 'Lisinopril 10mg', qty: 30, doctor: 'Dr. Chen', date: 'Apr 26', status: 'Pending', refills: 2 },
  { id: 'RX-4822', patient: 'Marcus Williams', drug: 'Metformin 500mg', qty: 60, doctor: 'Dr. Patel', date: 'Apr 26', status: 'Ready', refills: 3 },
  { id: 'RX-4823', patient: "James O'Brien", drug: 'Amiodarone 200mg', qty: 30, doctor: 'Dr. Chen', date: 'Apr 26', status: 'Dispensed', refills: 0 },
  { id: 'RX-4824', patient: 'Elena Rodriguez', drug: 'Salbutamol Inhaler', qty: 1, doctor: 'Dr. Kim', date: 'Apr 25', status: 'Pending', refills: 1 },
];

export const HA_LAB_ORDERS: HaLabOrder[] = [
  { id: 'L-0091', patient: 'Marcus Williams', test: 'HbA1c Panel', ordered: 'Dr. Patel', date: 'Apr 26', status: 'In Progress', priority: 'Routine', result: '' },
  { id: 'L-0092', patient: "James O'Brien", test: 'ECG + Troponin', ordered: 'Dr. Chen', date: 'Apr 26', status: 'Critical', priority: 'STAT', result: 'Troponin elevated' },
  { id: 'L-0093', patient: 'Sarah Johnson', test: 'CBC + Metabolic Panel', ordered: 'Dr. Chen', date: 'Apr 25', status: 'Complete', priority: 'Routine', result: 'Within normal range' },
  { id: 'L-0094', patient: 'Elena Rodriguez', test: 'Spirometry', ordered: 'Dr. Kim', date: 'Apr 25', status: 'Complete', priority: 'Routine', result: 'FEV1 68%, mild obstruction' },
];

export const HA_INVENTORY: HaInventoryItem[] = [
  { id: 'INV-001', name: 'Lisinopril 10mg', category: 'Cardiovascular', stock: 1240, min: 200, max: 2000, unit: 'tabs', expiry: 'Dec 2026', status: 'OK' },
  { id: 'INV-002', name: 'Metformin 500mg', category: 'Diabetes', stock: 180, min: 200, max: 1500, unit: 'tabs', expiry: 'Nov 2026', status: 'Low' },
  { id: 'INV-003', name: 'Amiodarone 200mg', category: 'Cardiac', stock: 95, min: 100, max: 500, unit: 'tabs', expiry: 'Sep 2026', status: 'Low' },
  { id: 'INV-004', name: 'Salbutamol Inhaler', category: 'Respiratory', stock: 48, min: 20, max: 150, unit: 'units', expiry: 'Mar 2027', status: 'OK' },
  { id: 'INV-005', name: 'Surgical Gloves L', category: 'Supplies', stock: 12, min: 50, max: 500, unit: 'boxes', expiry: '-', status: 'Critical' },
  { id: 'INV-006', name: 'Paracetamol 500mg', category: 'Analgesics', stock: 2800, min: 500, max: 5000, unit: 'tabs', expiry: 'Aug 2027', status: 'OK' },
  { id: 'INV-007', name: 'Syringes 5ml', category: 'Supplies', stock: 22, min: 100, max: 1000, unit: 'boxes', expiry: '-', status: 'Critical' },
];

export const HA_EQUIPMENT: HaEquipmentItem[] = [
  { id: 'ANA-001', name: 'Hematology Analyzer', model: 'Sysmex XN-1000', status: 'Online', load: '72%', lastCalib: 'Apr 24, 2026', nextCalib: 'May 8, 2026', uptime: '99.2%', tests: ['CBC', 'Reticulocytes'] },
  { id: 'ANA-002', name: 'Chemistry Analyzer', model: 'Roche Cobas 8000', status: 'Online', load: '45%', lastCalib: 'Apr 22, 2026', nextCalib: 'May 6, 2026', uptime: '98.8%', tests: ['Metabolic Panel', 'LFTs', 'Lipids'] },
  { id: 'ANA-003', name: 'Immunoassay Analyzer', model: 'Abbott Architect', status: 'Warning', load: '88%', lastCalib: 'Apr 20, 2026', nextCalib: 'May 4, 2026', uptime: '96.1%', tests: ['Troponin', 'HbA1c', 'TSH'] },
  { id: 'IMG-001', name: 'MRI Scanner', model: 'Siemens MAGNETOM', status: 'Online', load: '30%', lastCalib: 'Apr 15, 2026', nextCalib: 'May 15, 2026', uptime: '99.7%', tests: ['MRI Brain', 'MRI Spine'] },
  { id: 'ECG-001', name: 'ECG Machine', model: 'Philips PageWriter TC70', status: 'Offline', load: '0%', lastCalib: 'Apr 10, 2026', nextCalib: '-', uptime: '85.0%', tests: ['ECG', 'Holter'] },
];

export const HA_NOTIFICATIONS = [
  { id: 1, type: 'critical', title: "Critical Lab Result - James O'Brien", body: 'Troponin levels elevated. Immediate cardiology review required.', time: '2 min ago', read: false },
  { id: 2, type: 'alert', title: 'Low Inventory: Surgical Gloves', body: 'Stock at 12 boxes, below minimum threshold of 50.', time: '18 min ago', read: false },
  { id: 3, type: 'info', title: 'Appointment Reminder', body: 'Dr. Patel has 6 appointments starting at 10:30 AM today.', time: '1 hr ago', read: false },
  { id: 4, type: 'success', title: 'Payment Processed', body: 'Invoice INV-2408 received from Marcus Williams.', time: '5 hrs ago', read: true },
];

export const HA_STAFF: HaStaffMember[] = [
  { id: 'S-001', name: 'Dr. Amy Chen', role: 'Doctor', specialization: 'Cardiologist', department: 'Cardiology', email: 'amy.chen@hospital.vexoo.in', phone: '+91 98765 43210', status: 'Active' },
  { id: 'S-002', name: 'Dr. Raj Patel', role: 'Doctor', specialization: 'Endocrinologist', department: 'Endocrinology', email: 'raj.patel@hospital.vexoo.in', phone: '+91 98765 43211', status: 'Active' },
  { id: 'S-003', name: 'Maria Lopez', role: 'Receptionist', department: 'Reception', email: 'maria.l@hospital.vexoo.in', phone: '+91 98765 43220', status: 'Active' },
  { id: 'S-004', name: 'Kevin Liu', role: 'LabTech', department: 'Diagnostics', email: 'kevin.l@hospital.vexoo.in', phone: '+91 98765 43230', status: 'Active' },
  { id: 'S-005', name: 'Mei Perez', role: 'Pharmacist', department: 'Pharmacy', email: 'mei.p@hospital.vexoo.in', phone: '+91 98765 43240', status: 'Active' },
];

export const HA_REVIEWS: HaReview[] = [
  { id: 'R-001', patient: 'Sarah Johnson', patientId: 'P-001', doctor: 'Dr. Chen', department: 'Cardiology', visitDate: '20-04-2026', receivedDate: '21-04-2026 09:14 AM', visitType: 'Follow-Up', rating: 5, recommend: true, status: 'New', comment: 'Dr. Chen was extremely thorough and explained everything clearly. The nursing staff was very attentive and the ward was spotless. Only minor issue was the pharmacy wait.', ratings: { hospitalization: 5, doctorCare: 5, nursingCare: 5, waitTime: 3, pharmacy: 4, cleanliness: 5, billing: 4 } },
  { id: 'R-002', patient: 'Marcus Williams', patientId: 'P-002', doctor: 'Dr. Patel', department: 'Endocrinology', visitDate: '18-04-2026', receivedDate: '19-04-2026 11:32 AM', visitType: 'Consultation', rating: 4, recommend: true, status: 'New', comment: 'Dr. Patel is very knowledgeable and took time to answer all questions. Appointment scheduling was smooth and lab results were available quickly.', ratings: { hospitalization: 4, doctorCare: 5, nursingCare: 4, waitTime: 4, pharmacy: 4, cleanliness: 4, billing: 3 } },
  { id: 'R-003', patient: 'Elena Rodriguez', patientId: 'P-003', doctor: 'Dr. Kim', department: 'Pulmonology', visitDate: '22-04-2026', receivedDate: '23-04-2026 02:45 PM', visitType: 'Check-Up', rating: 3, recommend: true, status: 'Read', comment: 'Good doctor and helpful staff. Wait time was long and the billing process was confusing.', ratings: { hospitalization: 3, doctorCare: 4, nursingCare: 3, waitTime: 2, pharmacy: 3, cleanliness: 4, billing: 2 } },
  { id: 'R-004', patient: "James O'Brien", patientId: 'P-004', doctor: 'Dr. Chen', department: 'Cardiology', visitDate: '24-04-2026', receivedDate: '25-04-2026 10:05 AM', visitType: 'Urgent', rating: 5, recommend: true, status: 'New', comment: 'Exceptional emergency care. The team acted immediately and kept the family informed at every step.', ratings: { hospitalization: 5, doctorCare: 5, nursingCare: 5, waitTime: 5, pharmacy: 5, cleanliness: 5, billing: 4 } },
  { id: 'R-005', patient: 'Priya Sharma', patientId: 'P-005', doctor: 'Dr. Patel', department: 'Neurology', visitDate: '19-04-2026', receivedDate: '20-04-2026 08:22 AM', visitType: 'Follow-Up', rating: 4, recommend: true, status: 'Read', comment: 'Pleasant experience overall. The pharmacy was well-stocked and dosage was explained clearly.', ratings: { hospitalization: 4, doctorCare: 5, nursingCare: 4, waitTime: 3, pharmacy: 5, cleanliness: 4, billing: 4 } },
  { id: 'R-006', patient: 'Thomas Klein', patientId: 'P-006', doctor: 'Dr. Kim', department: 'Pulmonology', visitDate: '15-04-2026', receivedDate: '16-04-2026 03:10 PM', visitType: 'Consultation', rating: 2, recommend: false, status: 'Read', comment: 'Appointment took longer than expected and coordination between doctor and pharmacy was poor.', ratings: { hospitalization: 2, doctorCare: 3, nursingCare: 2, waitTime: 1, pharmacy: 1, cleanliness: 3, billing: 1 } },
];

export const HA_RATING_LABELS: Record<keyof HaReview['ratings'], string> = {
  hospitalization: 'Hospitalization',
  doctorCare: 'Doctor Care',
  nursingCare: 'Nursing Care',
  waitTime: 'Wait Time',
  pharmacy: 'Pharmacy',
  cleanliness: 'Cleanliness',
  billing: 'Billing & Payment',
};

export const HA_PROFILE = {
  legalName: 'Apollo Multispecialty Healthcare Pvt. Ltd.',
  facilityType: 'Multi-speciality hospital',
  beds: 184,
  established: '2009',
  addressLine: '142, Jubilee Hills Road No. 36',
  city: 'Hyderabad',
  state: 'Telangana',
  pincode: '500033',
  gstin: '36AAPCA1234F1Z5',
  pan: 'AAPCA1234F',
  cea: 'CEA/TG/HYD/2009/04217',
  contactName: 'Anita Reddy',
  designation: 'Administrator',
  email: 'admin@vexoo.in',
  phone: '+91 98765 43210',
  altPhone: '+91 90000 12345',
  licenses: [
    { name: 'CEA Certificate', no: 'CEA/TG/HYD/2009/04217', valid: '18 Sep 2027' },
    { name: 'Drug License (Form 20B)', no: '20B-TG-HYD/48217', valid: '04 Jul 2026' },
    { name: 'Drug License (Form 21B)', no: '21B-TG-HYD/48218', valid: '04 Jul 2026' },
    { name: 'Bio-medical Waste Auth.', no: 'BMW/TGPCB/2009/3471', valid: '22 Nov 2026' },
    { name: 'Fire NOC', no: 'FIRE/HYD/2024/00912', valid: '30 Apr 2027' },
    { name: 'NABH Accreditation', no: 'NABH/AC/2023/TG/0188', valid: '15 Dec 2026' },
  ],
  documents: [
    { name: 'Registration certificate.pdf', size: '264 KB', kind: 'PDF' },
    { name: 'CEA certificate.pdf', size: '212 KB', kind: 'PDF' },
    { name: 'Drug license.pdf', size: '188 KB', kind: 'PDF' },
    { name: 'GST registration.pdf', size: '142 KB', kind: 'PDF' },
    { name: 'Owner PAN and ID.pdf', size: '96 KB', kind: 'PDF' },
    { name: 'Fire NOC.pdf', size: '176 KB', kind: 'PDF' },
  ],
};

export const HA_PLAN_CARDS: HaPlanCard[] = [
  { id: 'pilot', name: 'Pilot', price: 'Free', cadence: '30-day trial', priceValue: 0, tagline: 'Evaluate Vexoo end-to-end', seats: 'Up to 5 staff seats', features: ['OPD and Appointments', 'Up to 5 staff seats', 'Email support', 'Single location'] },
  { id: 'core', name: 'Core', price: 'INR 24,000', cadence: '/month', priceValue: 24000, popular: true, tagline: 'For growing single hospitals', seats: 'Up to 40 staff seats', features: ['Everything in Pilot', 'IPD, Pharmacy and Lab', 'Up to 40 staff seats', 'Patient portal'] },
  { id: 'scale', name: 'Scale', price: 'INR 62,000', cadence: '/month', priceValue: 62000, tagline: 'Multi-department hospitals', seats: 'Unlimited seats', features: ['Everything in Core', 'Radiology support', 'Unlimited seats', 'Priority support and SLA'] },
  { id: 'enterprise', name: 'Enterprise', price: 'Custom', cadence: '/contact us', priceValue: null, tagline: 'Hospital groups and chains', seats: 'Unlimited seats', features: ['Everything in Scale', 'Multi-branch consolidation', 'Dedicated success manager', 'Custom integrations and SSO'] },
];

export const HA_SUBSCRIPTION: HaSubscription = {
  plan: 'core',
  status: 'Active',
  startedOn: '12 Apr 2026',
  validUntil: '11 May 2026',
};

export const HA_INVOICES: HaInvoice[] = [
  { id: 'INV-2026-0148', plan: 'core', amount: 'INR 24,000', date: '12 Apr 2026', status: 'paid' },
  { id: 'INV-2026-0121', plan: 'core', amount: 'INR 24,000', date: '12 Mar 2026', status: 'paid' },
  { id: 'INV-2026-0096', plan: 'core', amount: 'INR 24,000', date: '12 Feb 2026', status: 'paid' },
];

export function haTone(status: string): HaTone {
  const s = status.toLowerCase();
  if (s.includes('critical') || s.includes('no-show')) return 'danger';
  if (s.includes('low') || s.includes('pending') || s.includes('waiting') || s.includes('progress')) return 'warning';
  if (s.includes('ready') || s.includes('complete') || s.includes('stable') || s.includes('active') || s.includes('ok')) return 'success';
  if (s.includes('dispensed')) return 'purple';
  return 'info';
}
