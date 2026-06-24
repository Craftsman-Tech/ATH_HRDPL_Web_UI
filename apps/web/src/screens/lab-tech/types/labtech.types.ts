/**
 * ============================================================================
 *  labtech.types.ts — shared type definitions for the Lab Technician portal
 * ============================================================================
 *  Screens (10):
 *    dashboard | inhouse | external | collection | processing | results |
 *    completed | inventory | equipment | reports
 *
 *  The lab "pipeline" now flows across screens via the shared store
 *  (data/labStore.tsx): an order moves
 *     In-House / External Queue  →  Sample Collection  →  Sample Processing
 *                                →  Test Results        →  Completed Tests
 *  so several shapes below carry the same orderId / barcode / tests across
 *  screens to support that movement.
 * ============================================================================
 */

export type ScreenId =
  | 'dashboard'
  | 'inhouse'
  | 'external'
  | 'collection'
  | 'processing'
  | 'results'
  | 'completed'
  | 'inventory'
  | 'equipment'
  | 'reports';

export type TestQueue = 'inhouse' | 'external';

export type Priority      = 'STAT' | 'Urgent' | 'Routine';
export type OrderStatus   = 'New' | 'Accepted' | 'Collected' | 'Processing' | 'Completed';
export type SampleStatus  = 'Pending' | 'Collected' | 'Rejected' | 'Recollect';
export type ProcStatus    = 'Ready' | 'Running' | 'Paused' | 'Completed';
export type QCStatus      = 'Pass' | 'Fail' | 'Pending';
export type ResultFlag    = 'normal' | 'high' | 'low' | 'critical';
export type EqStatus      = 'Online' | 'Calibration Due' | 'Maintenance' | 'Offline';
export type StockState    = 'OK' | 'Low' | 'Expiring' | 'Out';

export type ChipColor = 'primary' | 'amber' | 'rose' | 'blue' | 'green' | 'purple' | 'gray';

export interface NavItem { id: ScreenId; label: string; path: string; badge?: number; }

/* ── Test catalog (drives the multi-select + result parameters) ──────────── */
export interface CatalogParam { name: string; range: string; }
export interface TestCatalogItem {
  name: string;          // 'Complete Blood Count'
  testType: string;      // 'Hematology'
  sampleType: string;    // 'Whole Blood (EDTA)'
  equipment: string;     // default analyzer
  durationMin: number;
  params: CatalogParam[];
}

/* ── Test Orders Queue (In-House + External) ────────────────────────────── */
export interface TestOrder {
  id: string;            // 'LAB-2041' (in-house) | 'EXT-7001' (external)
  queue: TestQueue;
  patient: string;
  pid: string;           // 'P-001'
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  tests: string[];       // one or many test names
  test: string;          // primary display (tests[0]) — kept for table compat
  testType: string;      // primary test type
  department: string;
  doctor: string;
  ordered: string;
  time: string;
  priority: Priority;
  status: OrderStatus;
  barcode: string;       // 'BC-93021' (blank until Generate Barcode)
  phone?: string;        // patient contact (used for WhatsApp report share)
  assignedTech?: string;
  walkIn?: boolean;
}

/* ── Sample Collection ──────────────────────────────────────────────────── */
export interface SampleCollect {
  orderId: string;
  barcode: string;
  patient: string;
  pid: string;
  tests: string[];       // all tests to be conducted
  test: string;          // primary (compat)
  doctor: string;
  sampleType: string[];  // one or more required sample types (derived from tests)
  status: SampleStatus;
  collector?: string;
  collectedAt?: string;
  phone?: string;        // patient contact (carried through the pipeline)
  note?: string;
}

/* ── Sample Processing ──────────────────────────────────────────────────── */
export interface ProcessSample {
  orderId: string;
  barcode: string;
  patient: string;
  pid: string;
  tests: string[];       // all tests (multi)
  test: string;          // compat primary
  doctor: string;
  equipments: string[];  // one analyzer per test if needed (multi-select)
  status: ProcStatus;
  qc: QCStatus;
  startedAt?: number;
  collectedAt?: string;  // date + time the sample was collected (shown in table)
  phone?: string;        // patient contact (carried through the pipeline)
  durationMin: number;
}

/* ── Test Results entry ─────────────────────────────────────────────────── */
export interface ResultParam {
  name: string;
  range: string;
  value: string;
  flag: ResultFlag;
}
export interface ResultTest {
  name: string;
  testType: string;
  params: ResultParam[];
  remarks?: string;
  attachments?: string[];
}
export interface PendingResult {
  id: string;            // order id
  patient: string;
  pid: string;
  test: string;          // primary
  testType: string;      // primary
  doctor: string;
  collected: string;
  phone?: string;        // patient contact (carried through the pipeline)
  tests: ResultTest[];   // one entry per test → drives the tabbed entry card
}

/* ── Completed Tests ────────────────────────────────────────────────────── */
export interface CompletedTest {
  id: string;
  patient: string;
  pid: string;
  test: string;
  testType: string;
  doctor: string;
  completed: string;
  validatedBy: string;
  outcome: 'Normal' | 'Abnormal';
  phone?: string;        // patient contact (used for WhatsApp report share)
  tests?: string[];
}

/* ── Inventory ──────────────────────────────────────────────────────────── */
export type InventoryCategory = 'Reagents' | 'Test Kits' | 'Chemicals' | 'Glassware' | 'Consumables';
export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  batch: string;
  stock: number;
  unit: string;
  reorder: number;
  expiry: string;
  state: StockState;
}

/* ── Equipment ──────────────────────────────────────────────────────────── */
export interface EquipmentItem {
  id: string;
  name: string;
  model: string;
  status: EqStatus;
  load: string;
  lastCalib: string;
  nextCalib: string;
  nextService: string;
  runningTest?: string;
  uptime: string;
  errors: { time: string; msg: string }[];
}

/* ── Reports ────────────────────────────────────────────────────────────── */
export interface ReportRow {
  date: string;          // 'YYYY-MM-DD'
  dateLabel: string;     // '21 Jun 2026'
  patient: string;
  pid: string;
  test: string;
  department: string;
  priority: Priority;
  technician: string;
  status: 'Completed' | 'Processing' | 'Pending' | 'Rejected';
  tatMin: number;        // turnaround minutes
}

/* ── Profile ────────────────────────────────────────────────────────────── */
export interface LabProfile {
  name: string;
  role: string;
  email: string;
  employeeId: string;
  section: string;
  shift: string;
  phone: string;
}

export interface LabTechScreenProps { techName?: string; onSignOut?: () => void; }
