// ============================================================================
//  pharmacist.types.ts — Vexoo Pharmacist Portal
//  Type foundation for all 9 screens. Mirrors the Hospital Admin type layer.
// ============================================================================

export type ScreenId =
  | 'dashboard'
  | 'inhouse'      // In-House Prescription Queue
  | 'external'     // External Prescription Queue
  | 'dispensed'    // Dispensed Medications
  | 'completed'    // Completed Prescriptions
  | 'inventory'    // Inventory
  | 'purchase'     // Purchase Orders
  | 'suppliers'    // Suppliers
  | 'reports'      // Reports
  | 'settings';    // Settings (Profile + Billing & plans)

export type StatusColor = 'primary' | 'amber' | 'rose' | 'blue' | 'purple' | 'green' | 'gray';

export type RxStatus  = 'Pending' | 'Verifying' | 'Ready' | 'Dispensed';
export type RxSource  = 'In-House' | 'External';
export type Priority  = 'Routine' | 'Urgent' | 'STAT';

export interface NavItem { id: ScreenId; label: string; path: string; badge?: number; }

/** A prescription flowing through either queue. */
export interface Prescription {
  id: string; patient: string; pid: string; drug: string; qty: number;
  doctor: string; time: string; status: RxStatus; source: RxSource;
  priority: Priority; refills: number; dob: string; allergies: string;
  instructions: string;
  /** External-only: prescribing clinic + verification flag. */
  clinic?: string; verified?: boolean;
}

/** A medication that has been handed to the patient. */
export interface DispensedRecord {
  id: string; rxId: string; patient: string; pid: string; drug: string;
  qty: number; dispensedBy: string; date: string; time: string;
  source: RxSource; batch: string;
}

/** A fully completed prescription (closed out). */
export interface CompletedRx {
  id: string; patient: string; pid: string; drug: string; qty: number;
  doctor: string; completedDate: string; source: RxSource;
  turnaround: string; amount: number;
  // ── Optional fields used to render the printable prescription document ──
  dob?: string; instructions?: string; clinic?: string; phone?: string;
}

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expiring';

export interface InventoryItem {
  id: string; name: string; category: string; qty: number;
  min: number; max: number; unit: string; expiry: string;
  supplier: string; reorderQty: number; batch: string; price: number;
}

export type POStatus = 'Draft' | 'Pending' | 'Approved' | 'Received' | 'Cancelled';

export interface PurchaseOrder {
  id: string; supplier: string; items: number; total: number;
  created: string; expected: string; status: POStatus;
}

export interface Supplier {
  id: string; name: string; contact: string; phone: string; email: string;
  category: string; rating: number; activeOrders: number; status: 'Active' | 'Inactive';
}

export type ActivityType = 'Dispensed' | 'Stock Updated' | 'Purchase Received' | 'Verified';

export interface Activity {
  id: number; type: ActivityType; text: string; time: string;
}

export interface PharmNotification {
  id: number; type: 'critical' | 'alert' | 'info' | 'success';
  title: string; body: string; time: string; read: boolean;
}

export interface PharmacistScreenProps { pharmacistName?: string; onSignOut?: () => void; }

/** Master medicine catalogue entry (drives OTC + inventory dropdowns). */
export interface MedicineCatalogItem {
  name: string;
  category: string;
  /** true → over-the-counter (no prescription needed). false → prescription-only. */
  otc: boolean;
  /** indicative unit price (₹) used to pre-fill forms. */
  price: number;
  /** dispensing unit, e.g. 'tabs', 'units', 'caps', 'sachets'. */
  unit: string;
}

// ── Workflow maps (queue progression) ───────────────────────────────────────
export const NEXT_STATUS: Record<RxStatus, RxStatus> = {
  Pending: 'Verifying', Verifying: 'Ready', Ready: 'Dispensed', Dispensed: 'Dispensed',
};
export const ACTION_LABEL: Record<RxStatus, string> = {
  Pending: 'Start Verification', Verifying: 'Mark Ready', Ready: 'Dispense', Dispensed: 'Completed',
};

/* ============================================================================
   SETTINGS — Profile + Billing & plans  (appended block — Settings section)
   Mirrors the Hospital Admin settings/billing model surfaced inside
   Settings › Billing & plans. New names only · no existing types touched.
   ============================================================================ */
export type PlanTier      = 'pilot' | 'core' | 'scale' | 'enterprise';
export type PhSettingsTab = 'profile' | 'billing';
export type SubStatus     = 'Active' | 'New' | 'Cancelled';

export interface PhRegLicense  { name: string; no: string; valid: string; }
export interface PhRegDocument { name: string; size: string; kind: string; }

/** Full "submitted at registration" record for THIS hospital. Read-only. */
export interface PhHospitalProfile {
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
  licenses: PhRegLicense[];
  documents: PhRegDocument[];
}

/** A subscription tier card shown in Billing & plans. */
export interface PhPlanCard {
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
export interface PhSubscription {
  plan: PlanTier;
  status: SubStatus;
  startedOn: string;    // "12 Apr 2026"
  validUntil: string;   // "11 May 2026"
}

/** An invoice received by THIS hospital for a plan purchase. */
export interface PhInvoice {
  id: string;
  plan: PlanTier;
  amount: string;       // "₹62,000"
  date: string;         // "24 Jun 2026"
  status: 'paid' | 'failed';
}
