// ============================================================================
//  mockReceptionData.ts — Vexoo Reception Portal v3
// ============================================================================
import type { Appointment, Patient, QueueEntry, Bill, NavItem } from '../types/reception.types';

export const DOCTORS = [
  'Dr. Meera Sharma',
  'Dr. Arjun Verma',
  'Dr. Pooja Patel',
  'Dr. Ravi Nair',
  'Dr. Sneha Iyer',
];

const NOW = Date.now();

export const INITIAL_PATIENTS: Patient[] = [
  { id:'PT-000123', name:'Ravi Kumar',   mobile:'9876543210', aadhar:'1234 5678 9012', age:34, gender:'Male',   lastVisit:'Today', bloodGroup:'B+' },
  { id:'PT-000124', name:'Priya Singh',  mobile:'9123456780', aadhar:'2345 6789 0123', age:28, gender:'Female', lastVisit:'Today', bloodGroup:'A+' },
  { id:'PT-000125', name:'Amit Patel',   mobile:'9988776655', aadhar:'3456 7890 1234', age:45, gender:'Male',   lastVisit:'21 May 2025', bloodGroup:'O+' },
  { id:'PT-000126', name:'Neha Gupta',   mobile:'9345678901', aadhar:'4567 8901 2345', age:31, gender:'Female', lastVisit:'20 May 2025', bloodGroup:'AB-' },
  { id:'PT-000127', name:'Suresh Yadav', mobile:'9871234567', aadhar:'5678 9012 3456', age:52, gender:'Male',   lastVisit:'19 May 2025', bloodGroup:'B-' },
  { id:'PT-000128', name:'Kavitha Nair', mobile:'9012345678', aadhar:'6789 0123 4567', age:38, gender:'Female', lastVisit:'18 May 2025', bloodGroup:'O-' },
  { id:'PT-000129', name:'Deepak Menon', mobile:'9765432109', aadhar:'7890 1234 5678', age:41, gender:'Male',   lastVisit:'17 May 2025', bloodGroup:'A-' },
  { id:'PT-000130', name:'Ananya Iyer',  mobile:'9654321098', aadhar:'8901 2345 6789', age:26, gender:'Female', lastVisit:'16 May 2025', bloodGroup:'B+' },
  { id:'PT-000131', name:'Ananya Sagar',  mobile:'9654321008', aadhar:'8901 2345 6589', age:26, gender:'Female', lastVisit:'16 May 2025', bloodGroup:'A+' },
  { id:'PT-000132', name:'Swamy Iyer',  mobile:'9654221098', aadhar:'8901 2375 6789', age:26, gender:'Male', lastVisit:'16 May 2025', bloodGroup:'B+' },
  { id:'PT-000133', name:'Lakshmi Rao',  mobile:'9654110987', aadhar:'8901 2375 6789', age:26, gender:'Female', lastVisit:'16 May 2025', bloodGroup:'A+' }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id:'A1', token:'OP-001', arrivalTime:'09:00 AM', scheduledTime:'09:00 AM',
    patientName:'Ravi Kumar', patientId:'PT-000123', doctor:'Dr. Meera Sharma',
    phone:'9876543210', aadhar:'1234 5678 9012',
    visitType:'Consultation', priority:'Normal', chiefComplaint:'Chest pain follow-up',
    status:'With Doctor', createdAt: NOW - 90*60000,
    prescription:'Tab Atorvastatin 10mg OD', testsRecommended:'ECG, Lipid Profile',
  },
  {
    id:'A2', token:'OP-002', arrivalTime:'09:20 AM', scheduledTime:'09:20 AM',
    patientName:'Priya Singh', patientId:'PT-000124', doctor:'Dr. Arjun Verma',
    phone:'9123456780', aadhar:'2345 6789 0123',
    visitType:'Follow-Up', priority:'Normal', chiefComplaint:'BP review',
    status:'Post-Consult', createdAt: NOW - 80*60000,
    prescription:'Tab Amlodipine 5mg OD morning. Monitor BP daily.',
  },
  {
    id:'A3', token:'OP-003', arrivalTime:'09:40 AM', scheduledTime:'09:40 AM',
    patientName:'Amit Patel', patientId:'PT-000125', doctor:'Dr. Meera Sharma',
    phone:'9988776655', visitType:'Consultation', priority:'Urgent',
    chiefComplaint:'Severe headache', status:'In Queue', createdAt: NOW - 40*60000,
  },
  {
    id:'A4', token:'OP-004', arrivalTime:'10:00 AM', scheduledTime:'10:00 AM',
    patientName:'Neha Gupta', patientId:'PT-000126', doctor:'Dr. Arjun Verma',
    phone:'9345678901', visitType:'Walk-In', priority:'Normal',
    chiefComplaint:'Fever & cold', status:'In Queue', createdAt: NOW - 30*60000,
  },
  {
    id:'A5', token:'OP-005', arrivalTime:'10:20 AM',
    patientName:'Suresh Yadav', patientId:'PT-000127', doctor:'Dr. Meera Sharma',
    phone:'9871234567', visitType:'Consultation', priority:'Normal',
    chiefComplaint:'Knee pain', status:'Bill Pending', createdAt: NOW - 120*60000,
    prescription:'Tab Ibuprofen 400mg TDS. Rest advised.',
    paidAt: undefined,
  },
  {
    id:'A6', token:'OP-006', arrivalTime:'',
    patientName:'Kavitha Nair', patientId:'PT-000128', doctor:'Dr. Pooja Patel',
    phone:'9012345678', visitType:'Consultation', priority:'Normal',
    chiefComplaint:'Skin rash', status:'Scheduled',
    scheduledTime:'11:00 AM', createdAt: NOW - 10*60000,
  },
  {
    id:'A7', token:'OP-007', arrivalTime:'',
    patientName:'Deepak Menon', patientId:'PT-000129', doctor:'Dr. Ravi Nair',
    phone:'9765432109', visitType:'Follow-Up', priority:'Normal',
    chiefComplaint:'Diabetes check', status:'Scheduled',
    scheduledTime:'11:30 AM', createdAt: NOW - 5*60000,
  },
];

export const INITIAL_QUEUE: QueueEntry[] = [
  { apptId:'A3', queueNo:1, token:'OP-003', patientName:'Amit Patel',  patientId:'PT-000125', doctor:'Dr. Meera Sharma', priority:'Urgent', status:'Waiting',     chiefComplaint:'Severe headache', queuedAt: NOW - 40*60000 },
  { apptId:'A4', queueNo:2, token:'OP-004', patientName:'Neha Gupta',  patientId:'PT-000126', doctor:'Dr. Arjun Verma',  priority:'Normal', status:'Waiting',     chiefComplaint:'Fever & cold',    queuedAt: NOW - 30*60000 },
  { apptId:'A1', queueNo:3, token:'OP-001', patientName:'Ravi Kumar',  patientId:'PT-000123', doctor:'Dr. Meera Sharma', priority:'Normal', status:'With Doctor', chiefComplaint:'Chest pain',      queuedAt: NOW - 90*60000 },
];

export const INITIAL_BILLS: Bill[] = [
  {
    apptId:'A5', patientId:'PT-000127', patientName:'Suresh Yadav',
    doctor:'Dr. Meera Sharma', visitDate:'Today',
    lines:[
      { id:'L1', service:'Consultation Fee', charge:600, qty:1 },
      { id:'L2', service:'X-Ray Knee',       charge:400, qty:1 },
    ],
    prescription:'Tab Ibuprofen 400mg TDS. Rest advised.',
  },
  {
    apptId:'A2', patientId:'PT-000124', patientName:'Priya Singh',
    doctor:'Dr. Arjun Verma', visitDate:'Today',
    lines:[
      { id:'L1', service:'Consultation Fee', charge:500, qty:1 },
    ],
    prescription:'Tab Amlodipine 5mg OD morning. Monitor BP daily.',
  },
];

export const NAV: NavItem[] = [
  { id:'dashboard',    label:'Dashboard',            icon:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id:'appointments', label:'Appointments',         icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id:'patientreg',   label:'Patient Registration', icon:'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
  { id:'patients',     label:'Patients',             icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id:'queue',        label:'Queue Management',     icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { id:'billing',      label:'Billing & Payments',   icon:'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { id:'reports',      label:'Reports',              icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id:'communication',label:'Communication',        icon:'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
];

export const SCREEN_TITLES: Record<string, string> = {
  dashboard:'Dashboard', appointments:'Appointments', patientreg:'Patient Registration',
  patients:'Patients', queue:'Queue Management', billing:'Billing & Payments',
  reports:'Reports', communication:'Communication',
};
