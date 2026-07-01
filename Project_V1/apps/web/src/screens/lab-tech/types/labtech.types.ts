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
  | 'reports'
  | 'settings';

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

/* ============================================================================
   SETTINGS — Profile + Billing & plans  (appended block — Settings section)
   Mirrors the Hospital Admin settings/billing model surfaced inside
   Settings › Billing & plans. New names only · no existing types touched.
   ============================================================================ */
export type PlanTier      = 'pilot' | 'core' | 'scale' | 'enterprise';
export type LtSettingsTab = 'profile' | 'billing';
export type SubStatus     = 'Active' | 'New' | 'Cancelled';

export interface LtRegLicense  { name: string; no: string; valid: string; }
export interface LtRegDocument { name: string; size: string; kind: string; }

/** Full "submitted at registration" record for THIS hospital. Read-only. */
export interface LtHospitalProfile {
  // Hospital details
  legalName: string;
  facilityType: string;
  beds: number;
  established: string;
  addressLine: string;
  city: string;
  state: string;        // full name (e.g. "Telangana")
  pincode: string;
  gstin: string;
  pan: string;
  cea: string;
  // Contact information
  contactName: string;
  designation: string;
  email: string;
  phone: string;
  altPhone: string;
  // Compliance
  licenses: LtRegLicense[];
  documents: LtRegDocument[];
}

/** A subscription tier card shown in Billing & plans. */
export interface LtPlanCard {
  id: PlanTier;
  name: string;
  price: string;        // display: "Free" / "₹24,000" / "Custom"
  cadence: string;      // "30-day trial" / "/month" / "/contact us"
  priceValue: number | null;   // numeric amount for payment; null ⇒ contact sales
  tagline: string;
  seats: string;        // e.g. "Up to 40 staff seats" / "Unlimited seats"
  popular?: boolean;
  features: string[];
}

/** Live subscription state for THIS hospital. */
export interface LtSubscription {
  plan: PlanTier;
  status: SubStatus;
  startedOn: string;    // "12 Apr 2026"
  validUntil: string;   // "11 May 2026"
}

/** An invoice received by THIS hospital for a plan purchase. */
export interface LtInvoice {
  id: string;
  plan: PlanTier;
  amount: string;       // "₹62,000"
  date: string;         // "24 Jun 2026"
  status: 'paid' | 'failed';
}
