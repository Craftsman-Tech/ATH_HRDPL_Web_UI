export type PharmacyModuleId =
  | "dashboard"
  | "inhouse"
  | "external"
  | "dispensed"
  | "completed"
  | "inventory"
  | "purchase"
  | "suppliers"
  | "reports"
  | "settings";
export type PharmacyRxStatus = "Pending" | "Verifying" | "Ready" | "Dispensed";
export type PharmacySource = "In-House" | "External";
export type PharmacyPriority = "Routine" | "Urgent" | "STAT";
export type PharmacyStockStatus =
  | "In Stock"
  | "Low Stock"
  | "Out of Stock"
  | "Expiring";
export type PharmacyPOStatus =
  | "Draft"
  | "Pending"
  | "Approved"
  | "Received"
  | "Cancelled";

export type PharmacyPrescription = {
  id: string;
  patient: string;
  pid: string;
  drug: string;
  qty: number;
  doctor: string;
  time: string;
  status: PharmacyRxStatus;
  source: PharmacySource;
  priority: PharmacyPriority;
  refills: number;
  dob: string;
  allergies: string;
  instructions: string;
  clinic?: string;
  verified?: boolean;
};
export type PharmacyDispensed = {
  id: string;
  rxId: string;
  patient: string;
  pid: string;
  drug: string;
  qty: number;
  dispensedBy: string;
  date: string;
  time: string;
  timestamp: number;
  source: PharmacySource;
  batch: string;
};
export type PharmacyCompleted = {
  id: string;
  patient: string;
  pid: string;
  drug: string;
  qty: number;
  doctor: string;
  completedDate: string;
  timestamp: number;
  source: PharmacySource;
  turnaround: string;
  amount: number;
  dob?: string;
  instructions?: string;
  clinic?: string;
  phone?: string;
};
export type PharmacyInventoryItem = {
  id: string;
  name: string;
  category: string;
  qty: number;
  min: number;
  max: number;
  unit: string;
  expiry: string;
  supplier: string;
  reorderQty: number;
  batch: string;
  price: number;
};
export type PharmacyPurchaseOrder = {
  id: string;
  supplier: string;
  items: number;
  total: number;
  created: string;
  expected: string;
  status: PharmacyPOStatus;
};
export type PharmacySupplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  category: string;
  rating: number;
  activeOrders: number;
  status: "Active" | "Inactive";
};
export type PharmacyCatalogItem = {
  name: string;
  category: string;
  otc: boolean;
  price: number;
  unit: string;
};
export type PharmacyNotification = {
  id: number;
  type: "critical" | "alert" | "info" | "success";
  title: string;
  body: string;
  time: string;
  read: boolean;
};
export type PharmacyActivity = {
  id: number;
  type: "Dispensed" | "Stock Updated" | "Purchase Received" | "Verified";
  text: string;
  time: string;
};
export type PharmacyPlan = {
  id: "pilot" | "core" | "scale" | "enterprise";
  name: string;
  price: string;
  priceValue: number | null;
  cadence: string;
  tagline: string;
  seats: string;
  popular?: boolean;
  features: string[];
};
export type PharmacyInvoice = {
  id: string;
  plan: PharmacyPlan["id"];
  amount: string;
  date: string;
  status: "paid" | "failed";
};

export const PHARMACY_MODULES: { id: PharmacyModuleId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "inhouse", label: "In-House Queue" },
  { id: "external", label: "External Queue" },
  { id: "dispensed", label: "Dispensed Medications" },
  { id: "completed", label: "Completed Prescriptions" },
  { id: "inventory", label: "Inventory" },
  { id: "purchase", label: "Purchase Orders" },
  { id: "suppliers", label: "Suppliers" },
  { id: "reports", label: "Reports & Analytics" },
  { id: "settings", label: "Settings" },
];

export const PHARMACY_PRESCRIPTIONS: PharmacyPrescription[] = [
  {
    id: "RX-4821",
    patient: "Sarah Johnson",
    pid: "P-001",
    drug: "Lisinopril 10mg",
    qty: 30,
    doctor: "Dr. Chen",
    time: "08:45 AM",
    status: "Pending",
    source: "In-House",
    priority: "Routine",
    refills: 2,
    dob: "Mar 15, 1992",
    allergies: "Penicillin",
    instructions: "Take once daily in the morning",
  },
  {
    id: "RX-4822",
    patient: "Marcus Williams",
    pid: "P-002",
    drug: "Metformin 500mg",
    qty: 60,
    doctor: "Dr. Patel",
    time: "09:30 AM",
    status: "Verifying",
    source: "In-House",
    priority: "Routine",
    refills: 3,
    dob: "Jun 8, 1974",
    allergies: "None known",
    instructions: "Take twice daily with meals",
  },
  {
    id: "RX-4823",
    patient: "James O'Brien",
    pid: "P-004",
    drug: "Amiodarone 200mg",
    qty: 30,
    doctor: "Dr. Chen",
    time: "10:15 AM",
    status: "Ready",
    source: "In-House",
    priority: "Urgent",
    refills: 0,
    dob: "Nov 3, 1959",
    allergies: "Sulfonamides",
    instructions: "Take with food. Regular ECG monitoring required",
  },
  {
    id: "RX-4824",
    patient: "Elena Rodriguez",
    pid: "P-003",
    drug: "Salbutamol Inhaler",
    qty: 1,
    doctor: "Dr. Kim",
    time: "11:00 AM",
    status: "Pending",
    source: "In-House",
    priority: "STAT",
    refills: 1,
    dob: "Feb 22, 1998",
    allergies: "None known",
    instructions: "2 puffs as needed for shortness of breath",
  },
  {
    id: "RX-E219",
    patient: "Anil Kapoor",
    pid: "P-101",
    drug: "Atorvastatin 40mg",
    qty: 30,
    doctor: "Dr. Mehta",
    time: "09:10 AM",
    status: "Pending",
    source: "External",
    priority: "Routine",
    refills: 2,
    dob: "Apr 2, 1968",
    allergies: "None known",
    instructions: "Take at night",
    clinic: "CarePlus Clinic",
    verified: false,
  },
  {
    id: "RX-E220",
    patient: "Divya Nair",
    pid: "P-102",
    drug: "Levothyroxine 50mcg",
    qty: 90,
    doctor: "Dr. Rao",
    time: "09:55 AM",
    status: "Verifying",
    source: "External",
    priority: "Routine",
    refills: 3,
    dob: "Dec 19, 1990",
    allergies: "Iodine (mild)",
    instructions: "Take on empty stomach",
    clinic: "Sunrise Polyclinic",
    verified: true,
  },
];

const seedNow = Date.now();
export const PHARMACY_DISPENSED: PharmacyDispensed[] = [
  {
    id: "D-9011",
    rxId: "RX-4825",
    patient: "Priya Sharma",
    pid: "P-005",
    drug: "Sumatriptan 50mg",
    qty: 9,
    dispensedBy: "Maria Perez",
    date: "21 Jun 2026",
    time: "01:34 PM",
    timestamp: seedNow - 2 * 86400000,
    source: "In-House",
    batch: "B-7741",
  },
  {
    id: "D-9010",
    rxId: "RX-4826",
    patient: "Thomas Klein",
    pid: "P-006",
    drug: "Tiotropium 18mcg",
    qty: 30,
    dispensedBy: "Maria Perez",
    date: "21 Jun 2026",
    time: "02:08 PM",
    timestamp: seedNow - 2 * 86400000,
    source: "In-House",
    batch: "B-7738",
  },
  {
    id: "D-9009",
    rxId: "RX-E211",
    patient: "Ravi Teja",
    pid: "P-098",
    drug: "Pantoprazole 40mg",
    qty: 30,
    dispensedBy: "Maria Perez",
    date: "21 Jun 2026",
    time: "11:20 AM",
    timestamp: seedNow - 3 * 86400000,
    source: "External",
    batch: "B-7702",
  },
  {
    id: "D-9008",
    rxId: "RX-4810",
    patient: "Grace Lee",
    pid: "P-014",
    drug: "Amoxicillin 500mg",
    qty: 21,
    dispensedBy: "Maria Perez",
    date: "21 Jun 2026",
    time: "10:05 AM",
    timestamp: seedNow - 3 * 86400000,
    source: "In-House",
    batch: "B-7690",
  },
];

export const PHARMACY_COMPLETED: PharmacyCompleted[] = [
  {
    id: "RX-4790",
    patient: "Nadia Hassan",
    pid: "P-031",
    drug: "Ramipril 5mg",
    qty: 30,
    doctor: "Dr. Chen",
    completedDate: "20 Jun 2026",
    timestamp: seedNow - 4 * 86400000,
    source: "In-House",
    turnaround: "12 min",
    amount: 148,
    dob: "Jul 12, 1981",
    phone: "+91 98765 11031",
    instructions: "Take 1 tablet once daily in the morning.",
    clinic: "Vexoo General Hospital",
  },
  {
    id: "RX-4788",
    patient: "Leo Martins",
    pid: "P-033",
    drug: "Gliclazide 80mg",
    qty: 60,
    doctor: "Dr. Patel",
    completedDate: "20 Jun 2026",
    timestamp: seedNow - 4 * 86400000,
    source: "In-House",
    turnaround: "9 min",
    amount: 212,
    dob: "Jan 5, 1969",
    phone: "+91 98765 11033",
    instructions: "Take 1 tablet twice daily with meals.",
    clinic: "Vexoo General Hospital",
  },
  {
    id: "RX-E198",
    patient: "Sana Iqbal",
    pid: "P-088",
    drug: "Cetirizine 10mg",
    qty: 14,
    doctor: "Dr. Rao",
    completedDate: "20 Jun 2026",
    timestamp: seedNow - 5 * 86400000,
    source: "External",
    turnaround: "18 min",
    amount: 64,
    dob: "Sep 28, 1995",
    phone: "+91 98765 11088",
    instructions: "Take 1 tablet at night for 14 days.",
    clinic: "Sunrise Polyclinic",
  },
];

export const PHARMACY_INVENTORY: PharmacyInventoryItem[] = [
  {
    id: "S-001",
    name: "Lisinopril 10mg",
    category: "Cardiovascular",
    qty: 1240,
    min: 200,
    max: 2000,
    unit: "tabs",
    expiry: "Dec 2026",
    supplier: "MedSupply Co.",
    reorderQty: 500,
    batch: "B-7741",
    price: 4.2,
  },
  {
    id: "S-002",
    name: "Metformin 500mg",
    category: "Diabetes",
    qty: 180,
    min: 200,
    max: 1500,
    unit: "tabs",
    expiry: "Nov 2026",
    supplier: "PharmaDist Ltd.",
    reorderQty: 600,
    batch: "B-7738",
    price: 2.8,
  },
  {
    id: "S-003",
    name: "Amiodarone 200mg",
    category: "Cardiac",
    qty: 0,
    min: 100,
    max: 500,
    unit: "tabs",
    expiry: "Sep 2026",
    supplier: "CardioMeds Inc.",
    reorderQty: 200,
    batch: "B-7702",
    price: 9.6,
  },
  {
    id: "S-004",
    name: "Salbutamol Inhaler",
    category: "Respiratory",
    qty: 48,
    min: 20,
    max: 150,
    unit: "units",
    expiry: "Jul 2026",
    supplier: "RespiCare",
    reorderQty: 50,
    batch: "B-7690",
    price: 185,
  },
  {
    id: "S-005",
    name: "Sumatriptan 50mg",
    category: "Neurology",
    qty: 320,
    min: 100,
    max: 800,
    unit: "tabs",
    expiry: "Feb 2027",
    supplier: "NeuroPharm",
    reorderQty: 300,
    batch: "B-7655",
    price: 14.5,
  },
  {
    id: "S-006",
    name: "Paracetamol 500mg",
    category: "Analgesics",
    qty: 2800,
    min: 500,
    max: 5000,
    unit: "tabs",
    expiry: "Aug 2027",
    supplier: "GenPharma",
    reorderQty: 1000,
    batch: "B-7610",
    price: 0.8,
  },
  {
    id: "S-007",
    name: "Omeprazole 20mg",
    category: "GI",
    qty: 90,
    min: 150,
    max: 1200,
    unit: "caps",
    expiry: "Jul 2026",
    supplier: "GastroMeds",
    reorderQty: 400,
    batch: "B-7588",
    price: 3.1,
  },
  {
    id: "S-008",
    name: "Atorvastatin 40mg",
    category: "Cardiovascular",
    qty: 880,
    min: 200,
    max: 1500,
    unit: "tabs",
    expiry: "May 2027",
    supplier: "MedSupply Co.",
    reorderQty: 500,
    batch: "B-7560",
    price: 5.4,
  },
];

export const PHARMACY_CATALOG: PharmacyCatalogItem[] = [
  {
    name: "Paracetamol 500mg",
    category: "Analgesics",
    otc: true,
    price: 0.8,
    unit: "tabs",
  },
  {
    name: "Ibuprofen 400mg",
    category: "Analgesics",
    otc: true,
    price: 1.2,
    unit: "tabs",
  },
  {
    name: "Cetirizine 10mg",
    category: "Allergy",
    otc: true,
    price: 1.1,
    unit: "tabs",
  },
  {
    name: "Antacid Suspension 170ml",
    category: "GI",
    otc: true,
    price: 78,
    unit: "bottles",
  },
  {
    name: "ORS Sachet",
    category: "General",
    otc: true,
    price: 18,
    unit: "sachets",
  },
  {
    name: "Vitamin C 500mg",
    category: "Vitamins & Supplements",
    otc: true,
    price: 3.2,
    unit: "tabs",
  },
  {
    name: "Vitamin D3 60K IU",
    category: "Vitamins & Supplements",
    otc: true,
    price: 24,
    unit: "caps",
  },
  {
    name: "Diclofenac Gel 30g",
    category: "Analgesics",
    otc: true,
    price: 88,
    unit: "tubes",
  },
  {
    name: "Lisinopril 10mg",
    category: "Cardiovascular",
    otc: false,
    price: 4.2,
    unit: "tabs",
  },
  {
    name: "Atorvastatin 40mg",
    category: "Cardiovascular",
    otc: false,
    price: 5.4,
    unit: "tabs",
  },
  {
    name: "Amlodipine 5mg",
    category: "Cardiovascular",
    otc: false,
    price: 2.1,
    unit: "tabs",
  },
  {
    name: "Amiodarone 200mg",
    category: "Cardiac",
    otc: false,
    price: 9.6,
    unit: "tabs",
  },
  {
    name: "Metformin 500mg",
    category: "Diabetes",
    otc: false,
    price: 2.8,
    unit: "tabs",
  },
  {
    name: "Levothyroxine 50mcg",
    category: "General",
    otc: false,
    price: 2,
    unit: "tabs",
  },
  {
    name: "Salbutamol Inhaler",
    category: "Respiratory",
    otc: false,
    price: 185,
    unit: "units",
  },
  {
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    otc: false,
    price: 6.4,
    unit: "caps",
  },
  {
    name: "Sumatriptan 50mg",
    category: "Neurology",
    otc: false,
    price: 14.5,
    unit: "tabs",
  },
  {
    name: "Omeprazole 20mg",
    category: "GI",
    otc: false,
    price: 3.1,
    unit: "caps",
  },
];

export const PHARMACY_PURCHASE_ORDERS: PharmacyPurchaseOrder[] = [
  {
    id: "PO-3012",
    supplier: "PharmaDist Ltd.",
    items: 4,
    total: 14820,
    created: "19 Jun 2026",
    expected: "24 Jun 2026",
    status: "Approved",
  },
  {
    id: "PO-3011",
    supplier: "CardioMeds Inc.",
    items: 2,
    total: 9200,
    created: "18 Jun 2026",
    expected: "23 Jun 2026",
    status: "Pending",
  },
  {
    id: "PO-3010",
    supplier: "MedSupply Co.",
    items: 6,
    total: 22640,
    created: "17 Jun 2026",
    expected: "21 Jun 2026",
    status: "Received",
  },
  {
    id: "PO-3009",
    supplier: "GastroMeds",
    items: 1,
    total: 1240,
    created: "16 Jun 2026",
    expected: "22 Jun 2026",
    status: "Approved",
  },
  {
    id: "PO-3007",
    supplier: "NeuroPharm",
    items: 2,
    total: 4350,
    created: "14 Jun 2026",
    expected: "-",
    status: "Draft",
  },
];

export const PHARMACY_SUPPLIERS: PharmacySupplier[] = [
  {
    id: "SUP-01",
    name: "MedSupply Co.",
    contact: "Rahul Verma",
    phone: "+91 98480 11223",
    email: "orders@medsupply.in",
    category: "Cardiovascular",
    rating: 4.8,
    activeOrders: 1,
    status: "Active",
  },
  {
    id: "SUP-02",
    name: "PharmaDist Ltd.",
    contact: "Sneha Iyer",
    phone: "+91 90030 55410",
    email: "sales@pharmadist.in",
    category: "General",
    rating: 4.6,
    activeOrders: 1,
    status: "Active",
  },
  {
    id: "SUP-03",
    name: "CardioMeds Inc.",
    contact: "David Okoro",
    phone: "+91 99590 78112",
    email: "support@cardiomeds.in",
    category: "Cardiac",
    rating: 4.3,
    activeOrders: 1,
    status: "Active",
  },
  {
    id: "SUP-04",
    name: "RespiCare",
    contact: "Meera Joshi",
    phone: "+91 97000 44219",
    email: "hello@respicare.in",
    category: "Respiratory",
    rating: 4.5,
    activeOrders: 0,
    status: "Active",
  },
  {
    id: "SUP-05",
    name: "GastroMeds",
    contact: "Aman Gupta",
    phone: "+91 80190 33271",
    email: "orders@gastromeds.in",
    category: "GI",
    rating: 4.1,
    activeOrders: 1,
    status: "Active",
  },
  {
    id: "SUP-06",
    name: "NeuroPharm",
    contact: "Lily Tan",
    phone: "+91 70450 90118",
    email: "desk@neuropharm.in",
    category: "Neurology",
    rating: 3.9,
    activeOrders: 0,
    status: "Inactive",
  },
];

export const PHARMACY_ACTIVITIES: PharmacyActivity[] = [
  {
    id: 1,
    type: "Dispensed",
    text: "Dispensed Sumatriptan 50mg to Priya Sharma",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "Stock Updated",
    text: "Paracetamol stock adjusted by 1,000 tabs",
    time: "14 min ago",
  },
  {
    id: 3,
    type: "Verified",
    text: "Verified external RX-E220 for Divya Nair",
    time: "22 min ago",
  },
  {
    id: 4,
    type: "Purchase Received",
    text: "PO-3010 received from MedSupply Co.",
    time: "48 min ago",
  },
];

export const PHARMACY_NOTIFICATIONS: PharmacyNotification[] = [
  {
    id: 1,
    type: "info",
    title: "New Prescription Assigned",
    body: "RX-4824 marked STAT for Elena Rodriguez.",
    time: "3 min ago",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Supplier Delivery Received",
    body: "PO-3010 received and stock updated.",
    time: "48 min ago",
    read: false,
  },
  {
    id: 3,
    type: "alert",
    title: "Stock Alert",
    body: "Omeprazole 20mg is below minimum.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 4,
    type: "critical",
    title: "Out of Stock",
    body: "Amiodarone 200mg is out of stock.",
    time: "5 hr ago",
    read: true,
  },
];

export const PHARMACY_PROFILE = {
  legalName: "Vexoo General Hospital Pvt. Ltd.",
  facilityType: "Multi-speciality hospital",
  beds: "148",
  established: "2011",
  address: "57, Banjara Hills Road No. 12, Hyderabad, Telangana - 500034",
  gstin: "36AABCV5678H1Z2",
  pan: "AABCV5678H",
  cea: "CEA/TG/HYD/2011/05521",
  contactName: "Maria Perez",
  designation: "Chief Pharmacist",
  email: "pharmacy@vexoo.in",
  phone: "+91 98765 11223",
  altPhone: "+91 90000 22446",
  licenses: [
    ["CEA Certificate", "CEA/TG/HYD/2011/05521", "14 Aug 2027"],
    ["Drug License (Form 20)", "20-TG-HYD/51902", "09 Jul 2026"],
    ["Drug License (Form 21)", "21-TG-HYD/51903", "09 Jul 2026"],
    ["NABH Accreditation", "NABH/AC/2023/TG/0241", "15 Dec 2026"],
  ],
  documents: [
    "Registration certificate.pdf",
    "CEA certificate.pdf",
    "Drug license.pdf",
    "GST registration.pdf",
    "Owner PAN & ID.pdf",
    "Fire NOC.pdf",
  ],
};

export const PHARMACY_PLANS: PharmacyPlan[] = [
  {
    id: "pilot",
    name: "Pilot",
    price: "Free",
    priceValue: 0,
    cadence: "30-day trial",
    tagline: "Evaluate Vexoo end-to-end",
    seats: "Up to 5 staff seats",
    features: ["OPD & Appointments", "Email support", "Single location"],
  },
  {
    id: "core",
    name: "Core",
    price: "Rs 24,000",
    priceValue: 24000,
    cadence: "/month",
    tagline: "For growing single hospitals",
    seats: "Up to 40 staff seats",
    popular: true,
    features: ["Everything in Pilot", "IPD, Pharmacy & Lab", "Patient portal"],
  },
  {
    id: "scale",
    name: "Scale",
    price: "Rs 62,000",
    priceValue: 62000,
    cadence: "/month",
    tagline: "Multi-department hospitals",
    seats: "Unlimited seats",
    features: [
      "Everything in Core",
      "Radiology (RIS/PACS)",
      "Priority support & SLA",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    priceValue: null,
    cadence: "/contact us",
    tagline: "Hospital groups & chains",
    seats: "Unlimited seats",
    features: [
      "Everything in Scale",
      "Multi-branch consolidation",
      "Custom integrations & SSO",
    ],
  },
];

export const PHARMACY_INVOICES: PharmacyInvoice[] = [
  {
    id: "INV-2026-0148",
    plan: "core",
    amount: "Rs 24,000",
    date: "12 Apr 2026",
    status: "paid",
  },
  {
    id: "INV-2026-0121",
    plan: "core",
    amount: "Rs 24,000",
    date: "12 Mar 2026",
    status: "paid",
  },
  {
    id: "INV-2026-0096",
    plan: "core",
    amount: "Rs 24,000",
    date: "12 Feb 2026",
    status: "paid",
  },
];

export const PHARMACY_CATEGORIES = [
  "Cardiovascular",
  "Cardiac",
  "Diabetes",
  "Respiratory",
  "Neurology",
  "Analgesics",
  "GI",
  "Antibiotics",
  "Allergy",
  "Vitamins & Supplements",
  "General",
];
export const nextRxStatus = (status: PharmacyRxStatus): PharmacyRxStatus =>
  status === "Pending"
    ? "Verifying"
    : status === "Verifying"
      ? "Ready"
      : "Dispensed";
