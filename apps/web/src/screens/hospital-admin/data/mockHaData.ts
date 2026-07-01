import type {
  Patient, Prescription, LabOrder, InventoryItem,
  Notification, Appointment, StaffMember, PatientReview, NavItem
} from '../types/hospitaladmin.types';

export const PATIENTS: Patient[] = [
  { id:'P-001', name:'Sarah Johnson',   age:34, gender:'F', blood:'A+',  condition:'Hypertension',       doctor:'Dr. Chen',  status:'Stable',     date:'Apr 26', phone:'+91 98765 43210', email:'sarah.j@email.com',  lastVisit:'20-04-2026', visits:14, allergies:'Penicillin, Sulfonamides', history:'Diagnosed hypertension 2022. Family history of cardiac disease. Ex-smoker.' },
  { id:'P-002', name:'Marcus Williams', age:52, gender:'M', blood:'O+',  condition:'Type 2 Diabetes',    doctor:'Dr. Patel', status:'Monitoring', date:'Apr 26', phone:'+91 98765 43211', email:'marcus.w@email.com', lastVisit:'18-04-2026', visits:22, allergies:'None known', history:'T2DM diagnosed 2019. BMI 29.4. Hypertension co-morbidity managed.' },
  { id:'P-003', name:'Elena Rodriguez', age:28, gender:'F', blood:'B-',  condition:'Asthma',             doctor:'Dr. Kim',   status:'Stable',     date:'Apr 25', phone:'+91 98765 43212', email:'elena.r@email.com',  lastVisit:'22-04-2026', visits:8,  allergies:'Aspirin (mild)', history:'Childhood asthma. Seasonal allergic rhinitis. No hospitalisations in past 3 years.' },
  { id:'P-004', name:"James O'Brien",   age:67, gender:'M', blood:'AB+', condition:'Cardiac Arrhythmia', doctor:'Dr. Chen',  status:'Critical',   date:'Apr 25', phone:'+91 98765 43213', email:'james.o@email.com',  lastVisit:'24-04-2026', visits:31, allergies:'Warfarin (GI bleed risk)', history:'AF diagnosed 2020. Pacemaker implanted Jan 2023. Previous MI 2018.' },
  { id:'P-005', name:'Priya Sharma',    age:41, gender:'F', blood:'A-',  condition:'Migraine',           doctor:'Dr. Patel', status:'Stable',     date:'Apr 25', phone:'+91 98765 43214', email:'priya.s@email.com',  lastVisit:'19-04-2026', visits:11, allergies:'None known', history:'Chronic migraine with aura since 2017. Hormonal triggers identified. No structural abnormality on MRI.' },
  { id:'P-006', name:'Thomas Klein',    age:59, gender:'M', blood:'O-',  condition:'COPD',               doctor:'Dr. Kim',   status:'Monitoring', date:'Apr 24', phone:'+91 98765 43215', email:'thomas.k@email.com', lastVisit:'15-04-2026', visits:19, allergies:'Beta-blockers', history:'COPD Stage II diagnosed 2021. 30-pack-year smoking history. Quit 2020.' },
  { id:'P-007', name:'Aisha Okonkwo',   age:31, gender:'F', blood:'B+',  condition:'Anxiety Disorder',   doctor:'Dr. Patel', status:'Stable',     date:'Apr 23', phone:'+91 98765 43216', email:'aisha.o@email.com',  lastVisit:'10-04-2026', visits:6,  allergies:'None known', history:'GAD diagnosed 2023. Concurrent CBT. No prior psychiatric admissions.' },
  { id:'P-008', name:'David Nguyen',    age:44, gender:'M', blood:'A+',  condition:'Hypertension',       doctor:'Dr. Chen',  status:'Stable',     date:'Apr 22', phone:'+91 98765 43217', email:'david.n@email.com',  lastVisit:'14-04-2026', visits:9,  allergies:'Codeine', history:'Hypertension diagnosed 2023. Lifestyle modification initiated. Monitoring lipid profile.' },
];

export const PRESCRIPTIONS: Prescription[] = [
  { id:'RX-4821', patient:'Sarah Johnson',   drug:'Lisinopril 10mg',    qty:30, doctor:'Dr. Chen',  date:'Apr 26', status:'Pending',   refills:2 },
  { id:'RX-4822', patient:'Marcus Williams', drug:'Metformin 500mg',    qty:60, doctor:'Dr. Patel', date:'Apr 26', status:'Ready',     refills:3 },
  { id:'RX-4823', patient:"James O'Brien",   drug:'Amiodarone 200mg',   qty:30, doctor:'Dr. Chen',  date:'Apr 26', status:'Dispensed', refills:0 },
  { id:'RX-4824', patient:'Elena Rodriguez', drug:'Salbutamol Inhaler', qty:1,  doctor:'Dr. Kim',   date:'Apr 25', status:'Pending',   refills:1 },
  { id:'RX-4825', patient:'Priya Sharma',    drug:'Sumatriptan 50mg',   qty:9,  doctor:'Dr. Patel', date:'Apr 25', status:'Ready',     refills:2 },
  { id:'RX-4826', patient:'Thomas Klein',    drug:'Tiotropium 18mcg',   qty:30, doctor:'Dr. Kim',   date:'Apr 24', status:'Dispensed', refills:1 },
];

export const PRESCRIPTION_DETAILS: Record<string, { frequency:string; duration:string; instructions:string; taken:number; isoDate:string }> = {
  'RX-4821': { frequency:'Once daily (morning)',    duration:'30 days',    instructions:'Take in the morning with water. Monitor BP weekly.',                            taken:2,  isoDate:'2026-04-26' },
  'RX-4822': { frequency:'Twice daily with meals',  duration:'30 days',    instructions:'Take with breakfast and dinner. Monitor blood glucose.',                        taken:4,  isoDate:'2026-04-26' },
  'RX-4823': { frequency:'Once daily with food',    duration:'30 days',    instructions:'Take with food. Regular ECG monitoring required.',                              taken:6,  isoDate:'2026-04-26' },
  'RX-4824': { frequency:'2 puffs as needed',       duration:'As directed', instructions:'Use when experiencing shortness of breath. Max 4 times daily.',               taken:0,  isoDate:'2026-04-25' },
  'RX-4825': { frequency:'Once at migraine onset',  duration:'As needed',  instructions:'Take at onset. May repeat after 2 hrs if needed. Max 2/day.',                  taken:3,  isoDate:'2026-04-25' },
  'RX-4826': { frequency:'Once daily (inhaled)',    duration:'30 days',    instructions:'1 capsule inhaled via HandiHaler device each morning.',                         taken:8,  isoDate:'2026-04-24' },
};

export const LAB_ORDERS: LabOrder[] = [
  { id:'L-0091', patient:'Marcus Williams', test:'HbA1c Panel',            ordered:'Dr. Patel', date:'Apr 26', status:'In Progress', priority:'Routine', result:'' },
  { id:'L-0092', patient:"James O'Brien",   test:'ECG + Troponin',         ordered:'Dr. Chen',  date:'Apr 26', status:'Critical',    priority:'STAT',    result:'Troponin elevated' },
  { id:'L-0093', patient:'Sarah Johnson',   test:'CBC + Metabolic Panel',  ordered:'Dr. Chen',  date:'Apr 25', status:'Complete',    priority:'Routine', result:'Within normal range' },
  { id:'L-0094', patient:'Elena Rodriguez', test:'Spirometry',             ordered:'Dr. Kim',   date:'Apr 25', status:'Complete',    priority:'Routine', result:'FEV1 68% — mild obstruction' },
  { id:'L-0095', patient:'Priya Sharma',    test:'MRI Brain',              ordered:'Dr. Patel', date:'Apr 24', status:'Pending',     priority:'Urgent',  result:'' },
  { id:'L-0096', patient:'Thomas Klein',    test:'Pulmonary Function Test', ordered:'Dr. Kim',  date:'Apr 23', status:'Complete',    priority:'Routine', result:'Moderate COPD confirmed' },
];

export const LAB_RESULT_DETAILS: Record<string, { parameter:string; value:string; unit:string; reference:string; flag:'NORMAL'|'HIGH'|'LOW'|'CRITICAL' }[]> = {
  'L-0091': [
    { parameter:'HbA1c',           value:'7.2',  unit:'%',     reference:'< 5.7',   flag:'HIGH'     },
    { parameter:'Fasting Glucose', value:'132',  unit:'mg/dL', reference:'70–99',   flag:'HIGH'     },
    { parameter:'Est. Avg Glucose',value:'163',  unit:'mg/dL', reference:'< 154',   flag:'HIGH'     },
  ],
  'L-0092': [
    { parameter:'Troponin I',  value:'0.18', unit:'ng/mL', reference:'< 0.04',  flag:'CRITICAL' },
    { parameter:'Heart Rate',  value:'110',  unit:'bpm',   reference:'60–100',  flag:'HIGH'     },
    { parameter:'PR Interval', value:'198',  unit:'ms',    reference:'120–200', flag:'NORMAL'   },
    { parameter:'QRS Duration',value:'115',  unit:'ms',    reference:'< 120',   flag:'NORMAL'   },
  ],
  'L-0093': [
    { parameter:'WBC',        value:'6.8',  unit:'K/μL',  reference:'4.5–11.0',  flag:'NORMAL' },
    { parameter:'RBC',        value:'4.5',  unit:'M/μL',  reference:'4.2–5.4',   flag:'NORMAL' },
    { parameter:'Hemoglobin', value:'13.8', unit:'g/dL',  reference:'12.0–16.0', flag:'NORMAL' },
    { parameter:'Sodium',     value:'140',  unit:'mEq/L', reference:'136–145',   flag:'NORMAL' },
    { parameter:'Potassium',  value:'4.1',  unit:'mEq/L', reference:'3.5–5.1',   flag:'NORMAL' },
    { parameter:'Creatinine', value:'0.9',  unit:'mg/dL', reference:'0.6–1.2',   flag:'NORMAL' },
  ],
  'L-0094': [
    { parameter:'FVC',      value:'2.8', unit:'L',  reference:'≥ 3.5', flag:'LOW'    },
    { parameter:'FEV1',     value:'1.9', unit:'L',  reference:'≥ 2.8', flag:'LOW'    },
    { parameter:'FEV1/FVC', value:'68',  unit:'%',  reference:'≥ 70',  flag:'LOW'    },
    { parameter:'TLC',      value:'4.8', unit:'L',  reference:'4.5–7.5',flag:'NORMAL'},
  ],
  'L-0095': [],
  'L-0096': [
    { parameter:'FVC',      value:'2.6', unit:'L',     reference:'≥ 3.5',  flag:'LOW' },
    { parameter:'FEV1',     value:'1.5', unit:'L',     reference:'≥ 2.8',  flag:'LOW' },
    { parameter:'FEV1/FVC', value:'58',  unit:'%',     reference:'≥ 70',   flag:'LOW' },
    { parameter:'DLCO',     value:'62',  unit:'%pred', reference:'≥ 75',   flag:'LOW' },
  ],
};

export const INVENTORY: InventoryItem[] = [
  { id:'INV-001', name:'Lisinopril 10mg',    category:'Cardiovascular', stock:1240, min:200,  unit:'tabs',  expiry:'Dec 2026', status:'OK'       },
  { id:'INV-002', name:'Metformin 500mg',    category:'Diabetes',       stock:180,  min:200,  unit:'tabs',  expiry:'Nov 2026', status:'Low'      },
  { id:'INV-003', name:'Amiodarone 200mg',   category:'Cardiac',        stock:95,   min:100,  unit:'tabs',  expiry:'Sep 2026', status:'Low'      },
  { id:'INV-004', name:'Salbutamol Inhaler', category:'Respiratory',    stock:48,   min:20,   unit:'units', expiry:'Mar 2027', status:'OK'       },
  { id:'INV-005', name:'Surgical Gloves L',  category:'Supplies',       stock:12,   min:50,   unit:'boxes', expiry:'—',        status:'Critical' },
  { id:'INV-006', name:'IV Saline 0.9%',     category:'Fluids',         stock:340,  min:100,  unit:'bags',  expiry:'Jan 2027', status:'OK'       },
  { id:'INV-007', name:'Syringes 5ml',       category:'Supplies',       stock:22,   min:100,  unit:'boxes', expiry:'—',        status:'Critical' },
  { id:'INV-008', name:'Paracetamol 500mg',  category:'Analgesics',     stock:2800, min:500,  unit:'tabs',  expiry:'Aug 2027', status:'OK'       },
];

export const NOTIFICATIONS_DATA: Notification[] = [
  { id:1, type:'critical', title:"Critical Lab Result — James O'Brien",  body:'Troponin levels elevated. Immediate cardiology review required.',          time:'2 min ago',  read:false },
  { id:2, type:'alert',    title:'Low Inventory: Surgical Gloves',        body:'Stock at 12 boxes, below minimum threshold of 50. Reorder required.',      time:'18 min ago', read:false },
  { id:3, type:'alert',    title:'Low Inventory: Syringes 5ml',           body:'Only 22 boxes remaining. Critical shortage expected within 48 hours.',     time:'25 min ago', read:false },
  { id:4, type:'info',     title:'Appointment Reminder',                  body:'Dr. Patel has 6 appointments starting at 10:30 AM today.',                 time:'1 hr ago',   read:false },
  { id:5, type:'info',     title:'New Patient Registration',              body:'Thomas Klein has been registered and assigned to Dr. Kim.',                time:'2 hrs ago',  read:false },
  { id:6, type:'success',  title:'Prescription Dispensed',                body:"RX-4823 — Amiodarone 200mg dispensed to James O'Brien.",                  time:'3 hrs ago',  read:true  },
  { id:7, type:'info',     title:'Lab Results Ready',                     body:'CBC + Metabolic Panel for Sarah Johnson are ready for review.',            time:'4 hrs ago',  read:true  },
  { id:8, type:'success',  title:'Payment Processed',                     body:'Invoice #INV-2408 — ₹1,240 received from Marcus Williams.',                time:'5 hrs ago',  read:true  },
];

export const APPOINTMENTS: Appointment[] = [
  { id:'A-001', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 104', status:'Confirmed'   },
  { id:'A-002', patient:'New Patient',     doctor:'Dr. Patel', type:'Consultation',time:'10:30 AM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 201', status:'Waiting'     },
  { id:'A-003', patient:"James O'Brien",   doctor:'Dr. Chen',  type:'Urgent',      time:'11:00 AM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 104', status:'In Progress' },
  { id:'A-004', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Check-up',    time:'01:00 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 302', status:'Confirmed'   },
  { id:'A-005', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'02:30 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 201', status:'Confirmed'   },
  { id:'A-006', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Lab Review',  time:'04:00 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 201', status:'Pending'     },
  { id:'A-007', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Consultation',time:'04:45 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 201', status:'Pending'     },
  { id:'A-008', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Follow-up',   time:'05:00 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 104', status:'Pending'     },
  { id:'A-009', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Consultation',time:'05:30 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 302', status:'Pending'     },
  { id:'A-010', patient:'Fatima Noor',     doctor:'Dr. Chen',  type:'Follow-up',   time:'06:00 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 104', status:'Pending'     },
  { id:'A-011', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Check-up',    time:'06:30 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 302', status:'Pending'     },
  { id:'A-012', patient:'Meena Iyer',      doctor:'Dr. Patel', type:'Consultation',time:'07:00 PM', date:'Apr 26', isoDate:'2026-04-26', room:'Room 201', status:'Pending'     },
  { id:'A-013', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', date:'Apr 25', isoDate:'2026-04-25', room:'Room 104', status:'Completed'   },
  { id:'A-014', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Consultation',time:'10:00 AM', date:'Apr 25', isoDate:'2026-04-25', room:'Room 201', status:'Completed'   },
  { id:'A-015', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'11:30 AM', date:'Apr 25', isoDate:'2026-04-25', room:'Room 201', status:'No-Show'     },
  { id:'A-016', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Check-up',    time:'02:00 PM', date:'Apr 25', isoDate:'2026-04-25', room:'Room 302', status:'Completed'   },
  { id:'A-017', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Consultation',time:'08:30 AM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 302', status:'Completed'   },
  { id:'A-018', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 104', status:'Completed'   },
  { id:'A-019', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Lab Review',  time:'10:00 AM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 201', status:'No-Show'     },
  { id:'A-020', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Check-up',    time:'11:00 AM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 302', status:'Completed'   },
  { id:'A-021', patient:'Meena Iyer',      doctor:'Dr. Patel', type:'Consultation',time:'12:30 PM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 201', status:'Completed'   },
  { id:'A-022', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Urgent',      time:'02:00 PM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 104', status:'Completed'   },
  { id:'A-023', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Follow-up',   time:'03:00 PM', date:'Apr 24', isoDate:'2026-04-24', room:'Room 302', status:'Completed'   },
  { id:'A-024', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Lab Review',  time:'08:00 AM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 201', status:'Completed'   },
  { id:'A-025', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'09:00 AM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 201', status:'Completed'   },
  { id:'A-026', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Check-up',    time:'10:30 AM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 104', status:'No-Show'     },
  { id:'A-027', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Consultation',time:'11:00 AM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 201', status:'Completed'   },
  { id:'A-028', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Follow-up',   time:'01:00 PM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 302', status:'Completed'   },
  { id:'A-029', patient:'Fatima Noor',     doctor:'Dr. Chen',  type:'Consultation',time:'02:30 PM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 104', status:'Completed'   },
  { id:'A-030', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Check-up',    time:'03:30 PM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 302', status:'Completed'   },
  { id:'A-031', patient:'Meena Iyer',      doctor:'Dr. Patel', type:'Follow-up',   time:'04:00 PM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 201', status:'No-Show'     },
  { id:'A-032', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Consultation',time:'04:30 PM', date:'Apr 23', isoDate:'2026-04-23', room:'Room 302', status:'Completed'   },
  { id:'A-033', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 104', status:'Completed'   },
  { id:'A-034', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Consultation',time:'10:00 AM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 201', status:'No-Show'     },
  { id:'A-035', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Check-up',    time:'11:30 AM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 302', status:'Completed'   },
  { id:'A-036', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Lab Review',  time:'01:00 PM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 104', status:'Completed'   },
  { id:'A-037', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'02:30 PM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 201', status:'Completed'   },
  { id:'A-038', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Consultation',time:'04:00 PM', date:'Apr 22', isoDate:'2026-04-22', room:'Room 201', status:'Completed'   },
  { id:'A-039', patient:'Fatima Noor',     doctor:'Dr. Chen',  type:'Consultation',time:'08:30 AM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 104', status:'Completed'   },
  { id:'A-040', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Check-up',    time:'09:30 AM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 302', status:'Completed'   },
  { id:'A-041', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Follow-up',   time:'10:30 AM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 302', status:'No-Show'     },
  { id:'A-042', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'12:00 PM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 104', status:'Completed'   },
  { id:'A-043', patient:'Meena Iyer',      doctor:'Dr. Patel', type:'Consultation',time:'01:30 PM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 201', status:'Completed'   },
  { id:'A-044', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Lab Review',  time:'02:30 PM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 201', status:'Completed'   },
  { id:'A-045', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Consultation',time:'04:00 PM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 302', status:'Completed'   },
  { id:'A-046', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Check-up',    time:'04:45 PM', date:'Apr 21', isoDate:'2026-04-21', room:'Room 104', status:'Completed'   },
  { id:'A-047', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Consultation',time:'09:00 AM', date:'Apr 20', isoDate:'2026-04-20', room:'Room 201', status:'Completed'   },
  { id:'A-048', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Follow-up',   time:'10:00 AM', date:'Apr 20', isoDate:'2026-04-20', room:'Room 201', status:'Completed'   },
  { id:'A-049', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Check-up',    time:'11:30 AM', date:'Apr 20', isoDate:'2026-04-20', room:'Room 302', status:'No-Show'     },
  { id:'A-050', patient:'Fatima Noor',     doctor:'Dr. Chen',  type:'Consultation',time:'01:00 PM', date:'Apr 20', isoDate:'2026-04-20', room:'Room 104', status:'Completed'   },
  { id:'A-051', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Follow-up',   time:'02:30 PM', date:'Apr 20', isoDate:'2026-04-20', room:'Room 302', status:'Completed'   },
  { id:'A-052', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'09:00 AM', date:'Apr 17', isoDate:'2026-04-17', room:'Room 104', status:'Completed'   },
  { id:'A-053', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Lab Review',  time:'10:30 AM', date:'Apr 17', isoDate:'2026-04-17', room:'Room 201', status:'No-Show'     },
  { id:'A-054', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Consultation',time:'12:00 PM', date:'Apr 17', isoDate:'2026-04-17', room:'Room 302', status:'Completed'   },
  { id:'A-055', patient:'David Nguyen',    doctor:'Dr. Chen',  type:'Check-up',    time:'02:00 PM', date:'Apr 17', isoDate:'2026-04-17', room:'Room 104', status:'Completed'   },
  { id:'A-056', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Follow-up',   time:'03:30 PM', date:'Apr 17', isoDate:'2026-04-17', room:'Room 201', status:'Completed'   },
  { id:'A-057', patient:'Aisha Okonkwo',   doctor:'Dr. Patel', type:'Consultation',time:'09:30 AM', date:'Apr 16', isoDate:'2026-04-16', room:'Room 201', status:'Completed'   },
  { id:'A-058', patient:'Thomas Klein',    doctor:'Dr. Kim',   type:'Check-up',    time:'11:00 AM', date:'Apr 16', isoDate:'2026-04-16', room:'Room 302', status:'No-Show'     },
  { id:'A-059', patient:'Fatima Noor',     doctor:'Dr. Chen',  type:'Consultation',time:'01:30 PM', date:'Apr 16', isoDate:'2026-04-16', room:'Room 104', status:'Completed'   },
  { id:'A-060', patient:'Ravi Kumar',      doctor:'Dr. Kim',   type:'Follow-up',   time:'03:00 PM', date:'Apr 16', isoDate:'2026-04-16', room:'Room 302', status:'Completed'   },
  { id:'A-061', patient:'Meena Iyer',      doctor:'Dr. Patel', type:'Consultation',time:'09:00 AM', date:'Apr 14', isoDate:'2026-04-14', room:'Room 201', status:'Completed'   },
  { id:'A-062', patient:'Sarah Johnson',   doctor:'Dr. Chen',  type:'Follow-up',   time:'10:30 AM', date:'Apr 14', isoDate:'2026-04-14', room:'Room 104', status:'Completed'   },
  { id:'A-063', patient:'Marcus Williams', doctor:'Dr. Patel', type:'Lab Review',  time:'12:00 PM', date:'Apr 14', isoDate:'2026-04-14', room:'Room 201', status:'No-Show'     },
  { id:'A-064', patient:'Elena Rodriguez', doctor:'Dr. Kim',   type:'Check-up',    time:'02:00 PM', date:'Apr 14', isoDate:'2026-04-14', room:'Room 302', status:'Completed'   },
  { id:'A-065', patient:'Priya Sharma',    doctor:'Dr. Patel', type:'Consultation',time:'03:30 PM', date:'Apr 14', isoDate:'2026-04-14', room:'Room 201', status:'Completed'   },
];

export const STAFF_MEMBERS_INIT: StaffMember[] = [
  { id:'S-001', name:'Dr. Amy Chen',  role:'Doctor',       specialization:'Cardiologist',    department:'Cardiology',    email:'amy.chen@hospital.vexoo.in',  phone:'+91 98765 43210', employeeId:'EMP-D001', joinDate:'Jan 2024', status:'Active', licenceNo:'MCI/REG/12483' },
  { id:'S-002', name:'Dr. Raj Patel', role:'Doctor',       specialization:'Endocrinologist', department:'Endocrinology', email:'raj.patel@hospital.vexoo.in', phone:'+91 98765 43211', employeeId:'EMP-D002', joinDate:'Feb 2024', status:'Active', licenceNo:'MCI/REG/09214' },
  { id:'S-003', name:'Maria Lopez',   role:'Receptionist', department:'Reception',           email:'maria.l@hospital.vexoo.in',  phone:'+91 98765 43220', employeeId:'EMP-R001', joinDate:'Jan 2024', status:'Active' },
  { id:'S-004', name:'Kevin Liu',     role:'LabTech',      department:'Diagnostics',         email:'kevin.l@hospital.vexoo.in',  phone:'+91 98765 43230', employeeId:'EMP-L001', joinDate:'Mar 2024', status:'Active', licenceNo:'LT/2019/TS/00482' },
  { id:'S-005', name:'Mei Perez',     role:'Pharmacist',   department:'Pharmacy',            email:'mei.p@hospital.vexoo.in',    phone:'+91 98765 43240', employeeId:'EMP-P001', joinDate:'Apr 2024', status:'Active', licenceNo:'PH/2020/MH/04182' },
];

export const REVIEWS: PatientReview[] = [
  { id:'R-001', patient:'Sarah Johnson',   patientId:'P-001', doctor:'Dr. Chen',  department:'Cardiology',    visitDate:'20-04-2026', receivedDate:'21-04-2026 09:14 AM', visitType:'Follow-Up',    overallRating:5, recommend:true,  status:'New',  comment:'Dr. Chen was extremely thorough and explained everything clearly. The nursing staff was very attentive and the ward was spotless. Only minor issue was the 15-minute wait at the pharmacy counter, but overall a wonderful experience.', ratings:{ hospitalization:5, doctorCare:5, nursingCare:5, waitTime:3, pharmacy:4, cleanliness:5, billing:4 } },
  { id:'R-002', patient:'Marcus Williams', patientId:'P-002', doctor:'Dr. Patel', department:'Endocrinology', visitDate:'18-04-2026', receivedDate:'19-04-2026 11:32 AM', visitType:'Consultation',  overallRating:4, recommend:true,  status:'New',  comment:'Dr. Patel is very knowledgeable and took time to answer all my questions. Appointment scheduling was smooth. The waiting area was comfortable. Lab results were available quickly.', ratings:{ hospitalization:4, doctorCare:5, nursingCare:4, waitTime:4, pharmacy:4, cleanliness:4, billing:3 } },
  { id:'R-003', patient:'Elena Rodriguez', patientId:'P-003', doctor:'Dr. Kim',   department:'Pulmonology',   visitDate:'22-04-2026', receivedDate:'23-04-2026 02:45 PM', visitType:'Check-Up',      overallRating:3, recommend:true,  status:'Read', comment:'Good doctor and helpful staff. However I had to wait almost 45 minutes past my appointment time. The billing process was also a bit confusing. Hope the wait time issue gets addressed.', ratings:{ hospitalization:3, doctorCare:4, nursingCare:3, waitTime:2, pharmacy:3, cleanliness:4, billing:2 } },
  { id:'R-004', patient:"James O'Brien",   patientId:'P-004', doctor:'Dr. Chen',  department:'Cardiology',    visitDate:'24-04-2026', receivedDate:'25-04-2026 10:05 AM', visitType:'Urgent',        overallRating:5, recommend:true,  status:'New',  comment:'Exceptional emergency care. The team acted immediately when I arrived and I felt safe throughout. Dr. Chen kept my family informed at every step. The ICU nursing staff went above and beyond. Cannot thank them enough.', ratings:{ hospitalization:5, doctorCare:5, nursingCare:5, waitTime:5, pharmacy:5, cleanliness:5, billing:4 } },
  { id:'R-005', patient:'Priya Sharma',    patientId:'P-005', doctor:'Dr. Patel', department:'Neurology',     visitDate:'19-04-2026', receivedDate:'20-04-2026 08:22 AM', visitType:'Follow-Up',    overallRating:4, recommend:true,  status:'Read', comment:'Pleasant experience overall. Dr. Patel is patient and explains the treatment plan very well. The pharmacy was well-stocked and the pharmacist explained dosage clearly. Minor issue with parking availability.', ratings:{ hospitalization:4, doctorCare:5, nursingCare:4, waitTime:3, pharmacy:5, cleanliness:4, billing:4 } },
  { id:'R-006', patient:'Thomas Klein',    patientId:'P-006', doctor:'Dr. Kim',   department:'Pulmonology',   visitDate:'15-04-2026', receivedDate:'16-04-2026 03:10 PM', visitType:'Consultation',  overallRating:2, recommend:false, status:'Read', comment:'Disappointed with this visit. The appointment took much longer than expected and the coordination between the doctor and pharmacy was poor. My prescription was not ready even after waiting 1 hour. Billing also had an error that took time to fix.', ratings:{ hospitalization:2, doctorCare:3, nursingCare:2, waitTime:1, pharmacy:1, cleanliness:3, billing:1 } },
  { id:'R-007', patient:'Aisha Okonkwo',   patientId:'P-007', doctor:'Dr. Patel', department:'Psychiatry',    visitDate:'10-04-2026', receivedDate:'11-04-2026 11:00 AM', visitType:'Consultation',  overallRating:5, recommend:true,  status:'Read', comment:'Dr. Patel created a very comfortable and non-judgmental environment. The reception was welcoming and the entire process from check-in to exit was well organised. I felt genuinely cared for.', ratings:{ hospitalization:5, doctorCare:5, nursingCare:5, waitTime:4, pharmacy:4, cleanliness:5, billing:5 } },
  { id:'R-008', patient:'David Nguyen',    patientId:'P-008', doctor:'Dr. Chen',  department:'Cardiology',    visitDate:'14-04-2026', receivedDate:'15-04-2026 09:50 AM', visitType:'Follow-Up',    overallRating:4, recommend:true,  status:'Read', comment:'Solid experience. Dr. Chen is always well-prepared and refers to previous visit notes which shows he reviews history carefully. The lab turnaround time was impressive — results in under 2 hours.', ratings:{ hospitalization:4, doctorCare:5, nursingCare:4, waitTime:4, pharmacy:4, cleanliness:4, billing:4 } },
];

export const NAV: NavItem[] = [
  { id:'dashboard',     label:'Dashboard',        path:'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { id:'patients',      label:'Patients',         path:'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
  { id:'appointments',  label:'Appointments',     path:'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' },
  { id:'pharmacy',      label:'Pharmacy',         path:'M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3zm9.5 1c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
  { id:'lab',           label:'Lab & Diagnostics',path:'M6 2v6l2 2-6 10h16L12 10l2-2V2H6zm6 9.5L14.73 16H9.27L12 11.5zM10 4h4v3.17l1.17 1.17L12 12.5 8.83 8.34 10 7.17V4z' },
  { id:'inventory',     label:'Inventory',        path:'M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.58 1 13.5 3.08L12 4.58l-1.5-1.51C8.42 1 6 2.53 6 4.64c0 .48.11.92.18 1.36H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z' },
  { id:'analytics',     label:'Analytics',        path:'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z' },
  { id:'notifications', label:'Notifications',    path:'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z', badge:5 },
  { id:'staff',         label:'Staff Management', path:'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
  { id:'reviews',       label:'Reviews & Feedback',path:'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12l-3-3-3 3V6h6v8z' },
  { id:'settings',      label:'Settings',         path:'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z' },
];

export const MODULE_TITLES: Record<string, string> = {
  dashboard:'Dashboard', patients:'Patients', appointments:'Appointments',
  emr:'Medical Records', pharmacy:'Pharmacy', lab:'Lab & Diagnostics',
  inventory:'Inventory', analytics:'Analytics', notifications:'Notifications',
  staff:'Staff Management', reviews:'Reviews & Feedback', settings:'Settings',
};

export const EMR_ALLERGIES: Record<string, string> = {
  'P-001':'Penicillin, Sulfonamides', 'P-002':'None known',
  'P-003':'Aspirin (mild)',           'P-004':'Warfarin (GI bleed risk)',
  'P-005':'None known',               'P-006':'Beta-blockers',
  'P-007':'None known',               'P-008':'Codeine',
};

export const INV_DRUGS = [
  { id:'S-001', name:'Lisinopril 10mg',    category:'Cardiovascular', qty:1240, min:200,  max:2000, unit:'tabs',  expiry:'Dec 2026' },
  { id:'S-002', name:'Metformin 500mg',    category:'Diabetes',       qty:180,  min:200,  max:1500, unit:'tabs',  expiry:'Nov 2026' },
  { id:'S-003', name:'Amiodarone 200mg',   category:'Cardiac',        qty:95,   min:100,  max:500,  unit:'tabs',  expiry:'Sep 2026' },
  { id:'S-004', name:'Salbutamol Inhaler', category:'Respiratory',    qty:48,   min:20,   max:150,  unit:'units', expiry:'Mar 2027' },
  { id:'S-005', name:'Sumatriptan 50mg',   category:'Neurology',      qty:320,  min:100,  max:800,  unit:'tabs',  expiry:'Feb 2027' },
  { id:'S-006', name:'Paracetamol 500mg',  category:'Analgesics',     qty:2800, min:500,  max:5000, unit:'tabs',  expiry:'Aug 2027' },
  { id:'S-007', name:'Omeprazole 20mg',    category:'GI',             qty:640,  min:150,  max:1200, unit:'caps',  expiry:'Jul 2027' },
  { id:'S-008', name:'Atorvastatin 40mg',  category:'Cardiovascular', qty:880,  min:200,  max:1500, unit:'tabs',  expiry:'May 2027' },
];

export const INV_EQUIPMENT = [
  { id:'ANA-001', name:'Hematology Analyzer',  model:'Sysmex XN-1000',        eqStatus:'Online',  load:'72%', lastCalib:'Apr 24, 2026', nextCalib:'May 8, 2026',  tests:['CBC','Reticulocytes'],             uptime:'99.2%' },
  { id:'ANA-002', name:'Chemistry Analyzer',   model:'Roche Cobas 8000',       eqStatus:'Online',  load:'45%', lastCalib:'Apr 22, 2026', nextCalib:'May 6, 2026',  tests:['Metabolic Panel','LFTs','Lipids'],  uptime:'98.8%' },
  { id:'ANA-003', name:'Immunoassay Analyzer', model:'Abbott Architect',        eqStatus:'Warning', load:'88%', lastCalib:'Apr 20, 2026', nextCalib:'May 4, 2026',  tests:['Troponin','HbA1c','TSH'],           uptime:'96.1%' },
  { id:'IMG-001', name:'MRI Scanner',          model:'Siemens MAGNETOM',        eqStatus:'Online',  load:'30%', lastCalib:'Apr 15, 2026', nextCalib:'May 15, 2026', tests:['MRI Brain','MRI Spine','MRI Body'], uptime:'99.7%' },
  { id:'PFT-001', name:'Spirometer',           model:'ndd EasyOne Air',         eqStatus:'Online',  load:'20%', lastCalib:'Apr 25, 2026', nextCalib:'May 9, 2026',  tests:['Spirometry','PFT'],                 uptime:'100%'  },
  { id:'ECG-001', name:'ECG Machine',          model:'Philips PageWriter TC70', eqStatus:'Offline', load:'0%',  lastCalib:'Apr 10, 2026', nextCalib:'—',            tests:['ECG','Holter'],                     uptime:'85.0%' },
];

export const ROLE_COLORS: Record<string, [string,string]> = {
  Doctor:       ['#dbeafe','#3b82f6'],
  Receptionist: ['#fce7f3','#ec4899'],
  Pharmacist:   ['#e6faf8','#0d9488'],
  LabTech:      ['#ede9fe','#7c3aed'],
};
export const ROLE_LABELS: Record<string, string> = {
  Doctor:'Doctor', Receptionist:'Receptionist / Nurse',
  Pharmacist:'Pharmacist', LabTech:'Lab Technician',
};
export const DOCTOR_SPECS = [
  'Cardiologist','General Physician','Endocrinologist','Pulmonologist',
  'Orthopaedic Surgeon','Neurologist','Paediatrician','Dermatologist',
  'Ophthalmologist','ENT Specialist','Gynaecologist','Oncologist',
  'Psychiatrist','Radiologist','Anaesthesiologist',
];
export const RATING_LABELS: Record<string, string> = {
  hospitalization:'Hospitalization', doctorCare:'Doctor Care',
  nursingCare:'Nursing Care', waitTime:'Wait Time',
  pharmacy:'Pharmacy', cleanliness:'Cleanliness', billing:'Billing & Payment',
};
