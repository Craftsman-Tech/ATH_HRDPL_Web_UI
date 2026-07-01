export type ModuleId =
  | 'dashboard' | 'patients' | 'appointments' | 'emr'
  | 'pharmacy'  | 'lab'      | 'inventory'    | 'analytics'
  | 'notifications' | 'staff' | 'reviews' | 'settings';

export type StatusColor = 'primary' | 'amber' | 'rose' | 'blue' | 'purple' | 'green' | 'gray';
export type StaffRole   = 'Doctor' | 'Receptionist' | 'Pharmacist' | 'LabTech';

export interface NavItem { id: ModuleId; label: string; path: string; badge?: number; }

export interface Patient {
  id: string; name: string; age: number; gender: 'M' | 'F';
  blood: string; condition: string; doctor: string;
  status: string; date: string; phone: string; email: string;
  lastVisit: string; visits: number; allergies: string; history: string;
}
export interface Prescription {
  id: string; patient: string; drug: string; qty: number;
  doctor: string; date: string; status: string; refills: number;
}
export interface LabOrder {
  id: string; patient: string; test: string; ordered: string;
  date: string; status: string; priority: string; result: string;
}
export interface InventoryItem {
  id: string; name: string; category: string; stock: number;
  min: number; unit: string; expiry: string; status: string;
}
export interface Notification {
  id: number; type: 'critical' | 'alert' | 'info' | 'success';
  title: string; body: string; time: string; read: boolean;
}
export interface Appointment {
  id: string; patient: string; doctor: string; type: string;
  time: string; date: string; isoDate: string; room: string; status: string;
}
export interface StaffMember {
  id: string; name: string; role: StaffRole;
  specialization?: string; department: string;
  email: string; phone: string; employeeId: string;
  joinDate: string; status: 'Active' | 'Inactive'; licenceNo?: string;
}
export interface PatientReview {
  id: string; patient: string; patientId: string;
  doctor: string; department: string; visitDate: string; receivedDate: string;
  visitType: string; overallRating: number; recommend: boolean;
  comment: string; status: 'New' | 'Read';
  ratings: {
    hospitalization: number; doctorCare: number; nursingCare: number;
    waitTime: number; pharmacy: number; cleanliness: number; billing: number;
  };
}
export interface HospitalAdminScreenProps { adminName?: string; onSignOut?: () => void; }

/* ============================================================================
   SETTINGS · PROFILE + BILLING & PLANS  (added — Settings section)
   ----------------------------------------------------------------------------
   These mirror what the hospital submitted to the Super Admin at registration
   (Hospital details, Contact, Licenses, Documents) plus the subscription /
   billing model surfaced inside Settings › Billing & plans.
   ============================================================================ */
export type PlanTier      = 'pilot' | 'core' | 'scale' | 'enterprise';
export type HaSettingsTab = 'profile' | 'billing';
export type SubStatus     = 'Active' | 'New' | 'Cancelled';

export interface HaRegLicense  { name: string; no: string; valid: string; }
export interface HaRegDocument { name: string; size: string; kind: string; }

/** Full "submitted at registration" record for THIS hospital. Read-only. */
export interface HaHospitalProfile {
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
  licenses: HaRegLicense[];
  documents: HaRegDocument[];
}

/** A subscription tier card shown in Billing & plans. */
export interface HaPlanCard {
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
export interface HaSubscription {
  plan: PlanTier;
  status: SubStatus;
  startedOn: string;    // "12 Apr 2026"
  validUntil: string;   // "11 May 2026"
}

/** An invoice received by THIS hospital for a plan purchase. */
export interface HaInvoice {
  id: string;
  plan: PlanTier;
  amount: string;       // "₹62,000"
  date: string;         // "24 Jun 2026"
  status: 'paid' | 'failed';
}
