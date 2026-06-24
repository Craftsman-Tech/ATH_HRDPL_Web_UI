/**
 * ============================================================================
 *  mockLabData.ts — navigation + mock datasets for the Lab Technician portal
 * ============================================================================
 *  All data here is placeholder seed data. The shared store (labStore.tsx)
 *  takes copies of these arrays as its initial state, then mutates its own
 *  copies as the user pushes an order through the lab pipeline.
 *  TODO(backend): replace TODAY + these arrays with live API calls.
 * ============================================================================
 */
import type {
  NavItem, ScreenId, TestOrder, SampleCollect, ProcessSample,
  PendingResult, CompletedTest, InventoryItem, EquipmentItem,
  TestCatalogItem, ResultParam, ReportRow,
} from '../types/labtech.types';

export const TODAY = '21 Jun 2026';

/* ── Sidebar navigation (feather-style stroke icons) ─────────────────────── */
export const NAV: NavItem[] = [
  { id: 'dashboard',  label: 'Dashboard',           path: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
  { id: 'inhouse',    label: 'In-House Tests Queue', path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h6m-6 4h6' },
  { id: 'external',   label: 'External Tests Queue', path: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
  { id: 'collection', label: 'Sample Collection',   path: 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0z' },
  { id: 'processing', label: 'Sample Processing',   path: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  { id: 'results',    label: 'Test Results',        path: 'M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z' },
  { id: 'completed',  label: 'Completed Tests',     path: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3' },
  { id: 'inventory',  label: 'Inventory',           path: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12' },
  { id: 'equipment',  label: 'Equipment',           path: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z' },
  { id: 'reports',    label: 'Reports',             path: 'M18 20V10M12 20V4M6 20v-6' },
];

export const SCREEN_TITLES: Record<ScreenId, string> = {
  dashboard:  'Dashboard',
  inhouse:    'In-House Tests Queue',
  external:   'External Tests Queue',
  collection: 'Sample Collection',
  processing: 'Sample Processing',
  results:    'Test Results',
  completed:  'Completed Tests',
  inventory:  'Inventory',
  equipment:  'Equipment',
  reports:    'Reports',
};

export const SUBTITLES: Record<ScreenId, string> = {
  dashboard:  "Overview of today's lab workload.",
  inhouse:    'Test requests raised by doctors.',
  external:   'Walk-in and external test requests.',
  collection: 'Collect, verify and label patient samples.',
  processing: 'Run collected samples on lab equipment.',
  results:    'Enter and submit laboratory findings.',
  completed:  'Validated reports ready to share.',
  inventory:  'Reagents, kits, chemicals and consumables.',
  equipment:  'Monitor analyzers, calibration and maintenance.',
  reports:    'Laboratory analytics and exports.',
};

/* ── Test catalog ───────────────────────────────────────────────────────── */
export const TEST_CATALOG: TestCatalogItem[] = [
  { name: 'Complete Blood Count',      testType: 'Hematology',    sampleType: 'Whole Blood (EDTA)', equipment: 'Sysmex XN-1000', durationMin: 15,
    params: [
      { name: 'Hemoglobin', range: '13.0 - 17.0 g/dL' },
      { name: 'WBC Count',  range: '4.0 - 11.0 x10^3/uL' },
      { name: 'Platelets',  range: '150 - 410 x10^3/uL' },
      { name: 'Hematocrit', range: '40 - 50 %' },
    ] },
  { name: 'Lipid Profile',             testType: 'Biochemistry',  sampleType: 'Serum (SST)',        equipment: 'Cobas c311', durationMin: 18,
    params: [
      { name: 'Total Cholesterol', range: '< 200 mg/dL' },
      { name: 'HDL Cholesterol',   range: '> 40 mg/dL' },
      { name: 'LDL Cholesterol',   range: '< 100 mg/dL' },
      { name: 'Triglycerides',     range: '< 150 mg/dL' },
    ] },
  { name: 'Thyroid Panel (T3 T4 TSH)', testType: 'Endocrinology', sampleType: 'Serum (SST)',        equipment: 'Cobas c311', durationMin: 25,
    params: [
      { name: 'T3',  range: '0.8 - 2.0 ng/mL' },
      { name: 'T4',  range: '5.0 - 12.0 ug/dL' },
      { name: 'TSH', range: '0.4 - 4.0 mIU/L' },
    ] },
  { name: 'Liver Function Test',       testType: 'Biochemistry',  sampleType: 'Serum (SST)',        equipment: 'Cobas c311', durationMin: 22,
    params: [
      { name: 'SGPT (ALT)', range: '7 - 56 U/L' },
      { name: 'SGOT (AST)', range: '5 - 40 U/L' },
      { name: 'Bilirubin',  range: '0.1 - 1.2 mg/dL' },
      { name: 'Albumin',    range: '3.5 - 5.0 g/dL' },
    ] },
  { name: 'Urine Routine',             testType: 'Pathology',     sampleType: 'Urine',              equipment: 'Sysmex UN-2000', durationMin: 12,
    params: [
      { name: 'Color',   range: 'Pale Yellow' },
      { name: 'pH',      range: '4.5 - 8.0' },
      { name: 'Protein', range: 'Negative' },
      { name: 'Glucose', range: 'Negative' },
    ] },
  { name: 'HbA1c',                     testType: 'Biochemistry',  sampleType: 'Whole Blood (EDTA)', equipment: 'Cobas c311', durationMin: 14,
    params: [ { name: 'HbA1c', range: '4.0 - 5.6 %' } ] },
  { name: 'Electrolyte Panel',         testType: 'Biochemistry',  sampleType: 'Serum (SST)',        equipment: 'Cobas c311', durationMin: 14,
    params: [
      { name: 'Sodium',    range: '135 - 145 mmol/L' },
      { name: 'Potassium', range: '3.5 - 5.1 mmol/L' },
      { name: 'Chloride',  range: '98 - 107 mmol/L' },
    ] },
  { name: 'Blood Glucose (Fasting)',   testType: 'Biochemistry',  sampleType: 'Fluoride Plasma',    equipment: 'Cobas c311', durationMin: 10,
    params: [ { name: 'Glucose (Fasting)', range: '70 - 100 mg/dL' } ] },
  { name: 'Coagulation (PT/INR)',      testType: 'Hematology',    sampleType: 'Plasma (Citrate)',   equipment: 'Sysmex XN-1000', durationMin: 16,
    params: [
      { name: 'PT',   range: '11 - 13.5 sec' },
      { name: 'INR',  range: '0.8 - 1.1' },
      { name: 'aPTT', range: '25 - 35 sec' },
    ] },
  { name: 'Vitamin D (25-OH)',         testType: 'Biochemistry',  sampleType: 'Serum (SST)',        equipment: 'Cobas c311', durationMin: 30,
    params: [ { name: '25-OH Vitamin D', range: '30 - 100 ng/mL' } ] },
  { name: 'Vitamin B12',               testType: 'Biochemistry',  sampleType: 'Serum (SST)',        equipment: 'Cobas c311', durationMin: 28,
    params: [ { name: 'Vitamin B12', range: '200 - 900 pg/mL' } ] },
  { name: 'C-Reactive Protein (CRP)',  testType: 'Immunology',    sampleType: 'Serum (SST)',        equipment: 'Cobas c311', durationMin: 18,
    params: [ { name: 'CRP', range: '< 5 mg/L' } ] },
];

export const TEST_NAMES = TEST_CATALOG.map(t => t.name);
export const catalogOf = (name: string): TestCatalogItem | undefined =>
  TEST_CATALOG.find(t => t.name === name);

/** Build a fresh, empty (value='') ResultParam[] for a given test name. */
export const paramsFor = (name: string): ResultParam[] =>
  (catalogOf(name)?.params ?? []).map(p => ({ name: p.name, range: p.range, value: '', flag: 'normal' }));

/* ── In-House Tests Queue (doctor-raised) ───────────────────────────────── */
export const INHOUSE_ORDERS: TestOrder[] = [
  { id: 'LAB-2041', queue: 'inhouse', patient: 'Anjali Mehta', pid: 'P-001', age: 34, gender: 'Female', tests: ['Complete Blood Count'], test: 'Complete Blood Count', testType: 'Hematology',    department: 'General Medicine', doctor: 'Dr. Meera Sharma', ordered: TODAY, time: '09:12 AM', priority: 'STAT',    status: 'New',      barcode: '', phone: '+91 98765 44001' },
  { id: 'LAB-2042', queue: 'inhouse', patient: 'Rohan Verma',  pid: 'P-002', age: 51, gender: 'Male',   tests: ['Lipid Profile'],        test: 'Lipid Profile',        testType: 'Biochemistry', department: 'Cardiology',       doctor: 'Dr. Arjun Rao',   ordered: TODAY, time: '09:26 AM', priority: 'Urgent',  status: 'Accepted', barcode: '', phone: '+91 98765 33446', assignedTech: 'Kevin Liu' },
  { id: 'LAB-2043', queue: 'inhouse', patient: 'Priya Nair',   pid: 'P-003', age: 28, gender: 'Female', tests: ['Thyroid Panel (T3 T4 TSH)'], test: 'Thyroid Panel (T3 T4 TSH)', testType: 'Endocrinology', department: 'General Medicine', doctor: 'Dr. Meera Sharma', ordered: TODAY, time: '09:40 AM', priority: 'Routine', status: 'New',      barcode: '', phone: '+91 98765 44003' },
  { id: 'LAB-2046', queue: 'inhouse', patient: 'Vikram Singh', pid: 'P-006', age: 60, gender: 'Male',   tests: ['HbA1c', 'Lipid Profile'], test: 'HbA1c', testType: 'Biochemistry', department: 'Endocrinology', doctor: 'Dr. Neha Gupta', ordered: TODAY, time: '10:34 AM', priority: 'Routine', status: 'New', barcode: '', phone: '+91 98765 44006' },
];

/* ── External Tests Queue (walk-in) ─────────────────────────────────────── */
export const EXTERNAL_ORDERS: TestOrder[] = [
  { id: 'EXT-7001', queue: 'external', patient: 'Ramesh Iyer', pid: 'W-101', age: 47, gender: 'Male', tests: ['Blood Glucose (Fasting)'], test: 'Blood Glucose (Fasting)', testType: 'Biochemistry', department: 'Walk-in', doctor: 'Self / Walk-in', ordered: TODAY, time: '08:55 AM', priority: 'Routine', status: 'New', barcode: '', phone: '+91 98765 55101', walkIn: true },
];

/* ── Sample Collection seed ─────────────────────────────────────────────── */
//  NOTE: the pending row below must NOT reuse a barcode that already exists in
//  PROCESS_SAMPLES, otherwise confirming collection would REPLACE that running
//  row instead of adding a new one. BC-93026 is unique to this pending sample.
export const SAMPLES: SampleCollect[] = [
  { orderId: 'LAB-2047', barcode: 'BC-93026', patient: 'Sneha Kapoor', pid: 'P-007', tests: ['Lipid Profile'], test: 'Lipid Profile', doctor: 'Dr. Arjun Rao', sampleType: ['Serum (SST)'], status: 'Pending', phone: '+91 98765 33445' },
  { orderId: 'LAB-2042', barcode: 'BC-93022', patient: 'Rohan Verma', pid: 'P-002', tests: ['Lipid Profile'], test: 'Lipid Profile', doctor: 'Dr. Arjun Rao', sampleType: ['Serum (SST)'], status: 'Collected', collector: 'Kevin Liu', collectedAt: '21 Jun 2026, 09:48 AM', phone: '+91 98765 33446' },
];

/* ── Sample Processing seed ─────────────────────────────────────────────── */
export const PROCESS_SAMPLES: ProcessSample[] = [
  { orderId: 'LAB-2024', barcode: 'BC-93024', patient: 'Sameer Khan', pid: 'P-004', tests: ['Liver Function Test'], test: 'Liver Function Test', doctor: 'Dr. Neha Gupta', equipments: ['Cobas c311'], status: 'Running', qc: 'Pass', durationMin: 22, startedAt: Date.now() - 7 * 60 * 1000, collectedAt: '23 Jun 2026, 01:30 AM', phone: '+91 98765 33447' },
  { orderId: 'LAB-2025', barcode: 'BC-93025', patient: 'Divya Reddy', pid: 'P-005', tests: ['Urine Routine'], test: 'Urine Routine', doctor: 'Dr. Arjun Rao', equipments: ['Sysmex UN-2000'], status: 'Running', qc: 'Pass', durationMin: 12, startedAt: Date.now() - 3 * 60 * 1000, collectedAt: '23 Jun 2026, 01:42 AM', phone: '+91 98765 33448' },
  { orderId: 'LAB-2018', barcode: 'BC-93018', patient: 'Karan Malhotra', pid: 'P-011', tests: ['Complete Blood Count'], test: 'Complete Blood Count', doctor: 'Dr. Meera Sharma', equipments: ['Sysmex XN-1000'], status: 'Ready', qc: 'Pending', durationMin: 15, collectedAt: '23 Jun 2026, 01:50 AM', phone: '+91 98765 33449' },
];

/* ── Test Results seed ──────────────────────────────────────────────────── */
const mkResultTest = (name: string) => {
  const c = catalogOf(name)!;
  return { name: c.name, testType: c.testType, params: paramsFor(name), remarks: '', attachments: [] as string[] };
};
export const PENDING_RESULTS: PendingResult[] = [
  {
    id: 'LAB-2025', patient: 'Karan Malhotra', pid: 'P-011', test: 'Complete Blood Count', testType: 'Hematology',
    doctor: 'Dr. Meera Sharma', collected: '08:30 AM',
    tests: [mkResultTest('Complete Blood Count')],
  },
  {
    id: 'LAB-2026', patient: 'Neha Iyer', pid: 'P-012', test: 'Electrolyte Panel', testType: 'Biochemistry',
    doctor: 'Dr. Arjun Rao', collected: '08:52 AM',
    tests: [mkResultTest('Electrolyte Panel'), mkResultTest('Vitamin D (25-OH)')],
  },
];

/* ── Completed Tests seed ───────────────────────────────────────────────── */
export const COMPLETED_TESTS: CompletedTest[] = [
  { id: 'LAB-2011', patient: 'Asha Pillai',  pid: 'P-009', test: 'Blood Glucose (Fasting)', testType: 'Biochemistry', doctor: 'Dr. Neha Gupta',  completed: TODAY + ' 10:05 AM', validatedBy: 'Dr. Arjun Rao',    outcome: 'Abnormal', phone: '+91 98765 22001', tests: ['Blood Glucose (Fasting)'] },
  { id: 'LAB-2012', patient: 'Manish Gupta', pid: 'P-010', test: 'Complete Blood Count',    testType: 'Hematology',   doctor: 'Dr. Meera Sharma', completed: TODAY + ' 10:22 AM', validatedBy: 'Dr. Meera Sharma', outcome: 'Normal',   phone: '+91 98765 22002', tests: ['Complete Blood Count'] },
  { id: 'LAB-2013', patient: 'Ritu Desai',   pid: 'P-013', test: 'Thyroid Panel (T3 T4 TSH)', testType: 'Endocrinology', doctor: 'Dr. Neha Gupta', completed: TODAY + ' 10:48 AM', validatedBy: 'Dr. Arjun Rao', outcome: 'Normal', phone: '+91 98765 22003', tests: ['Thyroid Panel (T3 T4 TSH)'] },
];

/* ── Inventory ──────────────────────────────────────────────────────────── */
export const INVENTORY: InventoryItem[] = [
  { id: 'RGT-118', name: 'CBC Diluent',            category: 'Reagents',    batch: 'B-2291', stock: 4,   unit: 'vials',  reorder: 6,  expiry: '12 Sep 2026', state: 'Low'      },
  { id: 'RGT-204', name: 'Lipid Assay Reagent',    category: 'Reagents',    batch: 'B-3310', stock: 22,  unit: 'vials',  reorder: 8,  expiry: '02 Aug 2026', state: 'OK'       },
  { id: 'KIT-052', name: 'HbA1c Test Kit',         category: 'Test Kits',   batch: 'K-1180', stock: 9,   unit: 'kits',   reorder: 5,  expiry: '30 Jun 2026', state: 'Expiring' },
  { id: 'KIT-061', name: 'Urine Strip Kit',        category: 'Test Kits',   batch: 'K-1207', stock: 0,   unit: 'kits',   reorder: 4,  expiry: '18 Nov 2026', state: 'Out'      },
  { id: 'CHM-009', name: 'Ethanol 70%',            category: 'Chemicals',   batch: 'C-0455', stock: 14,  unit: 'litres', reorder: 5,  expiry: '21 Jan 2027', state: 'OK'       },
  { id: 'CHM-014', name: 'Hydrochloric Acid 0.1N', category: 'Chemicals',   batch: 'C-0512', stock: 3,   unit: 'litres', reorder: 4,  expiry: '09 Oct 2026', state: 'Low'      },
  { id: 'GLS-031', name: 'Test Tubes 5ml',         category: 'Glassware',   batch: 'G-7781', stock: 120, unit: 'pcs',    reorder: 40, expiry: '—',           state: 'OK'       },
  { id: 'CNS-077', name: 'Pipette Tips (1000uL)',  category: 'Consumables', batch: 'N-9920', stock: 18,  unit: 'boxes',  reorder: 20, expiry: '—',           state: 'Low'      },
  { id: 'CNS-082', name: 'Nitrile Gloves (M)',     category: 'Consumables', batch: 'N-9931', stock: 56,  unit: 'boxes',  reorder: 25, expiry: '—',           state: 'OK'       },
];

/* ── Equipment ──────────────────────────────────────────────────────────── */
export const EQUIPMENT: EquipmentItem[] = [
  { id: 'EQ-01', name: 'Sysmex XN-1000', model: 'Hematology Analyzer',     status: 'Online',          load: '3 / 8 slots',  lastCalib: '18 Jun 2026', nextCalib: '25 Jun 2026', nextService: '12 Jul 2026', runningTest: 'CBC — Karan Malhotra', uptime: '99.4%', errors: [] },
  { id: 'EQ-02', name: 'Cobas c311',     model: 'Biochemistry Analyzer',   status: 'Online',          load: '5 / 10 slots', lastCalib: '15 Jun 2026', nextCalib: '22 Jun 2026', nextService: '01 Jul 2026', runningTest: 'LFT — Sameer Khan',  uptime: '98.1%', errors: [{ time: '08:14 AM', msg: 'Reagent low: Channel 3' }] },
  { id: 'EQ-03', name: 'Sysmex UN-2000', model: 'Urine Analyzer',          status: 'Calibration Due', load: '1 / 6 slots',  lastCalib: '10 Jun 2026', nextCalib: '21 Jun 2026', nextService: '28 Jun 2026', runningTest: 'Urine Routine — Divya Reddy', uptime: '97.6%', errors: [] },
  { id: 'EQ-04', name: 'Centrifuge C-24', model: 'Refrigerated Centrifuge', status: 'Maintenance',    load: 'Idle',         lastCalib: '02 Jun 2026', nextCalib: '02 Jul 2026', nextService: '21 Jun 2026', uptime: '95.0%', errors: [{ time: '07:50 AM', msg: 'Rotor imbalance detected' }] },
  { id: 'EQ-05', name: 'Mindray BS-240', model: 'Chemistry Analyzer',      status: 'Offline',         load: 'Idle',         lastCalib: '20 May 2026', nextCalib: '20 Jun 2026', nextService: '24 Jun 2026', uptime: '88.3%', errors: [{ time: 'Yesterday', msg: 'Power supply fault' }] },
];

export const EQUIPMENT_NAMES = EQUIPMENT.map(e => e.name);

/* ── Reports dataset (drives the filterable analytics table) ─────────────── */
export const REPORT_ROWS: ReportRow[] = [
  { date: '2026-06-21', dateLabel: '21 Jun 2026', patient: 'Asha Pillai',    pid: 'P-009', test: 'Blood Glucose (Fasting)', department: 'Endocrinology',    priority: 'Routine', technician: 'Kevin Liu', status: 'Completed',  tatMin: 42 },
  { date: '2026-06-21', dateLabel: '21 Jun 2026', patient: 'Manish Gupta',   pid: 'P-010', test: 'Complete Blood Count',    department: 'General Medicine', priority: 'STAT',    technician: 'Kevin Liu', status: 'Completed',  tatMin: 38 },
  { date: '2026-06-21', dateLabel: '21 Jun 2026', patient: 'Ritu Desai',     pid: 'P-013', test: 'Thyroid Panel (T3 T4 TSH)', department: 'General Medicine', priority: 'Routine', technician: 'Maria Das', status: 'Completed', tatMin: 130 },
  { date: '2026-06-20', dateLabel: '20 Jun 2026', patient: 'Sameer Khan',    pid: 'P-004', test: 'Liver Function Test',     department: 'Gastroenterology', priority: 'Urgent',  technician: 'Maria Das', status: 'Processing', tatMin: 64 },
  { date: '2026-06-20', dateLabel: '20 Jun 2026', patient: 'Divya Reddy',    pid: 'P-005', test: 'Urine Routine',           department: 'Nephrology',       priority: 'Routine', technician: 'Arun Pillai', status: 'Completed', tatMin: 26 },
  { date: '2026-06-19', dateLabel: '19 Jun 2026', patient: 'Karan Malhotra', pid: 'P-011', test: 'Complete Blood Count',    department: 'General Medicine', priority: 'Urgent',  technician: 'Kevin Liu', status: 'Rejected',   tatMin: 0  },
  { date: '2026-06-19', dateLabel: '19 Jun 2026', patient: 'Neha Iyer',      pid: 'P-012', test: 'Electrolyte Panel',       department: 'Cardiology',       priority: 'STAT',    technician: 'Maria Das', status: 'Completed',  tatMin: 49 },
  { date: '2026-06-18', dateLabel: '18 Jun 2026', patient: 'Aditya Bose',    pid: 'P-014', test: 'Lipid Profile',           department: 'Cardiology',       priority: 'Routine', technician: 'Arun Pillai', status: 'Completed', tatMin: 54 },
  { date: '2026-06-18', dateLabel: '18 Jun 2026', patient: 'Priya Nair',     pid: 'P-003', test: 'Thyroid Panel (T3 T4 TSH)', department: 'General Medicine', priority: 'Routine', technician: 'Kevin Liu', status: 'Pending', tatMin: 0 },
  { date: '2026-06-17', dateLabel: '17 Jun 2026', patient: 'Ramesh Iyer',    pid: 'W-101', test: 'Blood Glucose (Fasting)', department: 'Walk-in',          priority: 'Routine', technician: 'Maria Das', status: 'Completed',  tatMin: 31 },
];

export const DEFAULT_PROFILE = {
  name: 'Kevin Liu',
  role: 'Senior Lab Technician',
  email: 'lab@vexoo.in',
  employeeId: 'LAB-2024-07',
  section: 'Hematology / Biochemistry',
  shift: 'Morning (08:00-16:00)',
  phone: '+91 98765 11223',
};
