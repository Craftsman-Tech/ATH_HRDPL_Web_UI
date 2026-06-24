import type {
  NavItem, ScreenId, Prescription, DispensedRecord, CompletedRx,
  InventoryItem, PurchaseOrder, Supplier, Activity, PharmNotification,
  MedicineCatalogItem,
} from '../types/pharmacist.types';

// ── Navigation ───────────────────────────────────────────────────────────────
export const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard',                 path: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { id: 'inhouse',   label: 'In-House Queue',  badge: 4,  path: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
  { id: 'external',  label: 'External Queue',  badge: 2,  path: 'M19 3H4.99c-1.11 0-1.98.9-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z' },
  { id: 'dispensed', label: 'Dispensed Medications',     path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  { id: 'completed', label: 'Completed Prescriptions',   path: 'M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z' },
  { id: 'inventory', label: 'Inventory',                 path: 'M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4l16-.02V7z' },
  { id: 'purchase',  label: 'Purchase Orders',           path: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' },
  { id: 'suppliers', label: 'Suppliers',                 path: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' },
  { id: 'reports',   label: 'Reports',                   path: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z' },
];

export const SCREEN_TITLES: Record<ScreenId, string> = {
  dashboard: 'Dashboard',
  inhouse:   'In-House Prescription Queue',
  external:  'External Prescription Queue',
  dispensed: 'Dispensed Medications',
  completed: 'Completed Prescriptions',
  inventory: 'Inventory',
  purchase:  'Purchase Orders',
  suppliers: 'Suppliers',
  reports:   'Reports & Analytics',
};

// ── Prescription queues (source = In-House / External) ───────────────────────
export const PRESCRIPTIONS: Prescription[] = [
  { id:'RX-4821', patient:'Sarah Johnson',   pid:'P-001', drug:'Lisinopril 10mg',    qty:30, doctor:'Dr. Chen',  time:'08:45 AM', status:'Pending',   source:'In-House', priority:'Routine', refills:2, dob:'Mar 15, 1992', allergies:'Penicillin',     instructions:'Take once daily in the morning' },
  { id:'RX-4822', patient:'Marcus Williams', pid:'P-002', drug:'Metformin 500mg',    qty:60, doctor:'Dr. Patel', time:'09:30 AM', status:'Verifying', source:'In-House', priority:'Routine', refills:3, dob:'Jun 8, 1974',  allergies:'None known',     instructions:'Take twice daily with meals' },
  { id:'RX-4823', patient:"James O'Brien",   pid:'P-004', drug:'Amiodarone 200mg',   qty:30, doctor:'Dr. Chen',  time:'10:15 AM', status:'Ready',     source:'In-House', priority:'Urgent',  refills:0, dob:'Nov 3, 1959',  allergies:'Sulfonamides',   instructions:'Take with food. Regular ECG monitoring required' },
  { id:'RX-4824', patient:'Elena Rodriguez', pid:'P-003', drug:'Salbutamol Inhaler', qty:1,  doctor:'Dr. Kim',   time:'11:00 AM', status:'Pending',   source:'In-House', priority:'STAT',    refills:1, dob:'Feb 22, 1998', allergies:'None known',     instructions:'2 puffs as needed for shortness of breath' },
  // External
  { id:'RX-E219', patient:'Anil Kapoor',     pid:'P-101', drug:'Atorvastatin 40mg',  qty:30, doctor:'Dr. Mehta', time:'09:10 AM', status:'Pending',   source:'External', priority:'Routine', refills:2, dob:'Apr 2, 1968',  allergies:'None known',     instructions:'Take at night',        clinic:'CarePlus Clinic',   verified:false },
  { id:'RX-E220', patient:'Divya Nair',      pid:'P-102', drug:'Levothyroxine 50mcg',qty:90, doctor:'Dr. Rao',   time:'09:55 AM', status:'Verifying', source:'External', priority:'Routine', refills:3, dob:'Dec 19, 1990', allergies:'Iodine (mild)',  instructions:'Take on empty stomach', clinic:'Sunrise Polyclinic', verified:true  },
];

// ── Dispensed medications ────────────────────────────────────────────────────
export const DISPENSED: DispensedRecord[] = [
  { id:'D-9011', rxId:'RX-4825', patient:'Priya Sharma',  pid:'P-005', drug:'Sumatriptan 50mg', qty:9,  dispensedBy:'Maria Perez', date:'Jun 21, 2026', time:'01:34 PM', source:'In-House', batch:'B-7741' },
  { id:'D-9010', rxId:'RX-4826', patient:'Thomas Klein',  pid:'P-006', drug:'Tiotropium 18mcg', qty:30, dispensedBy:'Maria Perez', date:'Jun 21, 2026', time:'02:08 PM', source:'In-House', batch:'B-7738' },
  { id:'D-9009', rxId:'RX-E211', patient:'Ravi Teja',     pid:'P-098', drug:'Pantoprazole 40mg',qty:30, dispensedBy:'Maria Perez', date:'Jun 21, 2026', time:'11:20 AM', source:'External', batch:'B-7702' },
  { id:'D-9008', rxId:'RX-4810', patient:'Grace Lee',     pid:'P-014', drug:'Amoxicillin 500mg',qty:21, dispensedBy:'Maria Perez', date:'Jun 21, 2026', time:'10:05 AM', source:'In-House', batch:'B-7690' },
  { id:'D-9007', rxId:'RX-4809', patient:'Omar Farouk',   pid:'P-022', drug:'Losartan 50mg',    qty:30, dispensedBy:'Maria Perez', date:'Jun 20, 2026', time:'04:50 PM', source:'In-House', batch:'B-7655' },
];

// ── Completed prescriptions ──────────────────────────────────────────────────
//  (extra fields — dob / phone / instructions / clinic — feed the printable PDF)
export const COMPLETED: CompletedRx[] = [
  { id:'RX-4790', patient:'Nadia Hassan',  pid:'P-031', drug:'Ramipril 5mg',    qty:30, doctor:'Dr. Chen',  completedDate:'Jun 20, 2026', source:'In-House', turnaround:'12 min', amount:148, dob:'Jul 12, 1981', phone:'+91 98765 11031', instructions:'Take 1 tablet once daily in the morning. Monitor blood pressure weekly.', clinic:'Vexoo General Hospital' },
  { id:'RX-4788', patient:'Leo Martins',   pid:'P-033', drug:'Gliclazide 80mg', qty:60, doctor:'Dr. Patel', completedDate:'Jun 20, 2026', source:'In-House', turnaround:'9 min',  amount:212, dob:'Jan 5, 1969',  phone:'+91 98765 11033', instructions:'Take 1 tablet twice daily with breakfast and dinner.', clinic:'Vexoo General Hospital' },
  { id:'RX-E198', patient:'Sana Iqbal',    pid:'P-088', drug:'Cetirizine 10mg', qty:14, doctor:'Dr. Rao',   completedDate:'Jun 20, 2026', source:'External', turnaround:'18 min', amount:64,  dob:'Sep 28, 1995', phone:'+91 98765 11088', instructions:'Take 1 tablet at night for 14 days.', clinic:'Sunrise Polyclinic' },
  { id:'RX-4785', patient:'Victor Owens',  pid:'P-040', drug:'Bisoprolol 5mg',  qty:30, doctor:'Dr. Kim',   completedDate:'Jun 19, 2026', source:'In-House', turnaround:'11 min', amount:176, dob:'Mar 19, 1972', phone:'+91 98765 11040', instructions:'Take 1 tablet once daily. Do not stop abruptly.', clinic:'Vexoo General Hospital' },
  { id:'RX-4782', patient:'Aisha Bello',   pid:'P-044', drug:'Folic Acid 5mg',  qty:30, doctor:'Dr. Chen',  completedDate:'Jun 19, 2026', source:'In-House', turnaround:'7 min',  amount:52,  dob:'Nov 2, 1990',  phone:'+91 98765 11044', instructions:'Take 1 tablet once daily with water.', clinic:'Vexoo General Hospital' },
];

// ── Inventory ────────────────────────────────────────────────────────────────
export const INVENTORY: InventoryItem[] = [
  { id:'S-001', name:'Lisinopril 10mg',    category:'Cardiovascular', qty:1240, min:200, max:2000, unit:'tabs',  expiry:'Dec 2026', supplier:'MedSupply Co.',   reorderQty:500,  batch:'B-7741', price:4.2  },
  { id:'S-002', name:'Metformin 500mg',    category:'Diabetes',       qty:180,  min:200, max:1500, unit:'tabs',  expiry:'Nov 2026', supplier:'PharmaDist Ltd.', reorderQty:600,  batch:'B-7738', price:2.8  },
  { id:'S-003', name:'Amiodarone 200mg',   category:'Cardiac',        qty:0,    min:100, max:500,  unit:'tabs',  expiry:'Sep 2026', supplier:'CardioMeds Inc.', reorderQty:200,  batch:'B-7702', price:9.6  },
  { id:'S-004', name:'Salbutamol Inhaler', category:'Respiratory',    qty:48,   min:20,  max:150,  unit:'units', expiry:'Jul 2026', supplier:'RespiCare',       reorderQty:50,   batch:'B-7690', price:185  },
  { id:'S-005', name:'Sumatriptan 50mg',   category:'Neurology',      qty:320,  min:100, max:800,  unit:'tabs',  expiry:'Feb 2027', supplier:'NeuroPharm',      reorderQty:300,  batch:'B-7655', price:14.5 },
  { id:'S-006', name:'Paracetamol 500mg',  category:'Analgesics',     qty:2800, min:500, max:5000, unit:'tabs',  expiry:'Aug 2027', supplier:'GenPharma',       reorderQty:1000, batch:'B-7610', price:0.8  },
  { id:'S-007', name:'Omeprazole 20mg',    category:'GI',             qty:90,   min:150, max:1200, unit:'caps',  expiry:'Jul 2026', supplier:'GastroMeds',      reorderQty:400,  batch:'B-7588', price:3.1  },
  { id:'S-008', name:'Atorvastatin 40mg',  category:'Cardiovascular', qty:880,  min:200, max:1500, unit:'tabs',  expiry:'May 2027', supplier:'MedSupply Co.',   reorderQty:500,  batch:'B-7560', price:5.4  },
];

// ── Master medicine catalogue ────────────────────────────────────────────────
//  otc:true  → over-the-counter, may be sold without a prescription (External
//              Queue "walk-in" form shows ONLY these).
//  otc:false → prescription-only / legal-controlled (hidden from walk-in form,
//              but shown in the Inventory "Add Medicine" dropdown).
//  The Inventory dropdown lists EVERY entry below (all are legal medicines).
export const MEDICINE_CATALOG: MedicineCatalogItem[] = [
  // ── OTC (no prescription required) ──
  { name:'Paracetamol 500mg',        category:'Analgesics',              otc:true,  price:0.8,  unit:'tabs'    },
  { name:'Ibuprofen 400mg',          category:'Analgesics',              otc:true,  price:1.2,  unit:'tabs'    },
  { name:'Cetirizine 10mg',          category:'Allergy',                 otc:true,  price:1.1,  unit:'tabs'    },
  { name:'Loratadine 10mg',          category:'Allergy',                 otc:true,  price:1.6,  unit:'tabs'    },
  { name:'Antacid Suspension 170ml', category:'GI',                      otc:true,  price:78,   unit:'bottles' },
  { name:'ORS Sachet',               category:'General',                 otc:true,  price:18,   unit:'sachets' },
  { name:'Loperamide 2mg',           category:'GI',                      otc:true,  price:2.4,  unit:'tabs'    },
  { name:'Vitamin C 500mg',          category:'Vitamins & Supplements',  otc:true,  price:3.2,  unit:'tabs'    },
  { name:'Vitamin D3 60K IU',        category:'Vitamins & Supplements',  otc:true,  price:24,   unit:'caps'    },
  { name:'Multivitamin Tablet',      category:'Vitamins & Supplements',  otc:true,  price:4.5,  unit:'tabs'    },
  { name:'Calcium + D3',             category:'Vitamins & Supplements',  otc:true,  price:5.1,  unit:'tabs'    },
  { name:'Povidone-Iodine 5% 100ml', category:'Dermatology',             otc:true,  price:55,   unit:'bottles' },
  { name:'Antiseptic Cream 20g',     category:'Dermatology',             otc:true,  price:42,   unit:'tubes'   },
  { name:'Cough Lozenges',           category:'General',                 otc:true,  price:1.0,  unit:'units'   },
  { name:'Saline Nasal Spray',       category:'Respiratory',             otc:true,  price:96,   unit:'bottles' },
  { name:'Diclofenac Gel 30g',       category:'Analgesics',              otc:true,  price:88,   unit:'tubes'   },
  // ── Prescription-only (legal but require a doctor's Rx) ──
  { name:'Lisinopril 10mg',          category:'Cardiovascular',          otc:false, price:4.2,  unit:'tabs'    },
  { name:'Atorvastatin 40mg',        category:'Cardiovascular',          otc:false, price:5.4,  unit:'tabs'    },
  { name:'Amlodipine 5mg',           category:'Cardiovascular',          otc:false, price:2.1,  unit:'tabs'    },
  { name:'Ramipril 5mg',             category:'Cardiovascular',          otc:false, price:3.6,  unit:'tabs'    },
  { name:'Bisoprolol 5mg',           category:'Cardiovascular',          otc:false, price:4.0,  unit:'tabs'    },
  { name:'Losartan 50mg',            category:'Cardiovascular',          otc:false, price:3.4,  unit:'tabs'    },
  { name:'Amiodarone 200mg',         category:'Cardiac',                 otc:false, price:9.6,  unit:'tabs'    },
  { name:'Metformin 500mg',          category:'Diabetes',                otc:false, price:2.8,  unit:'tabs'    },
  { name:'Gliclazide 80mg',          category:'Diabetes',                otc:false, price:3.5,  unit:'tabs'    },
  { name:'Insulin Glargine 100IU',   category:'Diabetes',                otc:false, price:540,  unit:'units'   },
  { name:'Levothyroxine 50mcg',      category:'General',                 otc:false, price:2.0,  unit:'tabs'    },
  { name:'Salbutamol Inhaler',       category:'Respiratory',             otc:false, price:185,  unit:'units'   },
  { name:'Tiotropium 18mcg',         category:'Respiratory',             otc:false, price:21,   unit:'caps'    },
  { name:'Amoxicillin 500mg',        category:'Antibiotics',             otc:false, price:6.4,  unit:'caps'    },
  { name:'Azithromycin 500mg',       category:'Antibiotics',             otc:false, price:14,   unit:'tabs'    },
  { name:'Sumatriptan 50mg',         category:'Neurology',               otc:false, price:14.5, unit:'tabs'    },
  { name:'Omeprazole 20mg',          category:'GI',                      otc:false, price:3.1,  unit:'caps'    },
  { name:'Pantoprazole 40mg',        category:'GI',                      otc:false, price:3.8,  unit:'tabs'    },
  { name:'Folic Acid 5mg',           category:'Vitamins & Supplements',  otc:false, price:1.7,  unit:'tabs'    },
];

// ── Categories (Inventory "Add Medicine" category dropdown) ──────────────────
export const CATEGORIES: string[] = [
  'Cardiovascular', 'Cardiac', 'Diabetes', 'Respiratory', 'Neurology',
  'Analgesics', 'GI', 'Antibiotics', 'Allergy', 'Dermatology',
  'Vitamins & Supplements', 'General',
];

// ── Purchase orders ──────────────────────────────────────────────────────────
export const PURCHASE_ORDERS: PurchaseOrder[] = [
  { id:'PO-3012', supplier:'PharmaDist Ltd.', items:4, total:14820, created:'Jun 19, 2026', expected:'Jun 24, 2026', status:'Approved' },
  { id:'PO-3011', supplier:'CardioMeds Inc.', items:2, total:9200,  created:'Jun 18, 2026', expected:'Jun 23, 2026', status:'Pending'  },
  { id:'PO-3010', supplier:'MedSupply Co.',   items:6, total:22640, created:'Jun 17, 2026', expected:'Jun 21, 2026', status:'Received' },
  { id:'PO-3009', supplier:'GastroMeds',      items:1, total:1240,  created:'Jun 16, 2026', expected:'Jun 22, 2026', status:'Approved' },
  { id:'PO-3008', supplier:'RespiCare',       items:3, total:9100,  created:'Jun 15, 2026', expected:'Jun 18, 2026', status:'Received' },
  { id:'PO-3007', supplier:'NeuroPharm',      items:2, total:4350,  created:'Jun 14, 2026', expected:'—',            status:'Draft'    },
];

// ── Suppliers ────────────────────────────────────────────────────────────────
export const SUPPLIERS: Supplier[] = [
  { id:'SUP-01', name:'MedSupply Co.',   contact:'Rahul Verma',  phone:'+91 98480 11223', email:'orders@medsupply.in',   category:'Cardiovascular', rating:4.8, activeOrders:1, status:'Active'   },
  { id:'SUP-02', name:'PharmaDist Ltd.', contact:'Sneha Iyer',   phone:'+91 90030 55410', email:'sales@pharmadist.in',   category:'General',        rating:4.6, activeOrders:1, status:'Active'   },
  { id:'SUP-03', name:'CardioMeds Inc.', contact:'David Okoro',  phone:'+91 99590 78112', email:'support@cardiomeds.in', category:'Cardiac',        rating:4.3, activeOrders:1, status:'Active'   },
  { id:'SUP-04', name:'RespiCare',       contact:'Meera Joshi',  phone:'+91 97000 44219', email:'hello@respicare.in',    category:'Respiratory',    rating:4.5, activeOrders:0, status:'Active'   },
  { id:'SUP-05', name:'GastroMeds',      contact:'Aman Gupta',   phone:'+91 80190 33271', email:'orders@gastromeds.in',  category:'GI',             rating:4.1, activeOrders:1, status:'Active'   },
  { id:'SUP-06', name:'NeuroPharm',      contact:'Lily Tan',     phone:'+91 70450 90118', email:'desk@neuropharm.in',    category:'Neurology',      rating:3.9, activeOrders:0, status:'Inactive' },
];

// ── Recent activity (last 10) ────────────────────────────────────────────────
export const ACTIVITIES: Activity[] = [
  { id:1,  type:'Dispensed',        text:'Dispensed Sumatriptan 50mg (×9) to Priya Sharma',      time:'2 min ago'  },
  { id:2,  type:'Stock Updated',    text:'Stock adjusted: Paracetamol 500mg +1,000 tabs',         time:'14 min ago' },
  { id:3,  type:'Verified',         text:'Verified external Rx RX-E220 for Divya Nair',           time:'22 min ago' },
  { id:4,  type:'Purchase Received', text:'PO-3010 received from MedSupply Co. (6 items)',         time:'48 min ago' },
  { id:5,  type:'Dispensed',        text:'Dispensed Tiotropium 18mcg (×30) to Thomas Klein',      time:'1 hr ago'   },
  { id:6,  type:'Stock Updated',    text:'Low-stock flag set: Metformin 500mg (180 tabs)',        time:'1 hr ago'   },
  { id:7,  type:'Dispensed',        text:'Dispensed Pantoprazole 40mg (×30) to Ravi Teja',        time:'2 hr ago'   },
  { id:8,  type:'Purchase Received', text:'PO-3008 received from RespiCare (3 items)',             time:'3 hr ago'   },
  { id:9,  type:'Dispensed',        text:'Dispensed Amoxicillin 500mg (×21) to Grace Lee',        time:'4 hr ago'   },
  { id:10, type:'Stock Updated',    text:'Out-of-stock: Amiodarone 200mg reached 0 tabs',         time:'5 hr ago'   },
];

// ── Notifications ────────────────────────────────────────────────────────────
export const NOTIFICATIONS: PharmNotification[] = [
  { id:1, type:'info',     title:'New Prescription Assigned',  body:'RX-4824 (Salbutamol Inhaler) marked STAT for Elena Rodriguez.', time:'3 min ago',  read:false },
  { id:2, type:'success',  title:'Supplier Delivery Received', body:'PO-3010 from MedSupply Co. received — 6 items added to stock.', time:'48 min ago', read:false },
  { id:3, type:'alert',    title:'Stock Alert',                body:'Omeprazole 20mg is below minimum (90 of 150 caps).',           time:'1 hr ago',   read:false },
  { id:4, type:'success',  title:'Purchase Order Approved',    body:'PO-3012 to PharmaDist Ltd. approved — ₹14,820.',               time:'2 hr ago',   read:true  },
  { id:5, type:'critical', title:'Out of Stock',               body:'Amiodarone 200mg is out of stock. Reorder 200 tabs.',          time:'5 hr ago',   read:true  },
];
