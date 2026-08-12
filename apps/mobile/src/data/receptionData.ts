export type ReceptionModuleId = 'dashboard' | 'appointments' | 'patientreg' | 'patients' | 'queue' | 'billing' | 'reports' | 'communication';
export type ReceptionVisitType = 'Walk-In' | 'Follow-Up' | 'Consultation' | 'Procedure';
export type ReceptionPriority = 'Normal' | 'Urgent' | 'Emergency';
export type ReceptionAppointmentStatus = 'Scheduled' | 'Confirmed' | 'In Queue' | 'With Doctor' | 'Post-Consult' | 'Bill Pending' | 'Paid' | 'Visit Complete' | 'Cancelled' | 'No-Show';
export type ReceptionQueueStatus = 'Waiting' | 'With Doctor' | 'Completed';
export type ReceptionPaymentMode = 'Cash' | 'Card' | 'UPI' | 'Insurance';

export type ReceptionPatient = {
  id: string; name: string; mobile: string; aadhar?: string; age: number;
  gender: 'Male' | 'Female' | 'Other'; lastVisit: string; bloodGroup?: string;
  email?: string; address?: string; occupation?: string; emergencyName?: string; emergencyPhone?: string;
  referralSource?: 'Self' | 'Doctor Referral' | 'Hospital Referral' | 'Online';
};

export type ReceptionAppointment = {
  id: string; token: string; arrivalTime: string; scheduledTime?: string; patientName: string;
  patientId: string; doctor: string; phone: string; aadhar?: string; visitType: ReceptionVisitType;
  priority: ReceptionPriority; chiefComplaint: string; status: ReceptionAppointmentStatus;
  prescription?: string; testsRecommended?: string; createdAt: number; paidAt?: number;
  scheduledDate?: string;
};

export type ReceptionQueueEntry = {
  apptId: string; queueNo: number; token: string; patientName: string; patientId: string;
  doctor: string; priority: ReceptionPriority; status: ReceptionQueueStatus; chiefComplaint: string; queuedAt: number;
};

export type ReceptionBillLine = { id: string; service: string; charge: number; qty: number };
export type ReceptionBill = {
  apptId: string; patientId: string; patientName: string; doctor: string; visitDate: string;
  lines: ReceptionBillLine[]; paymentMode?: ReceptionPaymentMode; amountPaid?: number;
  reference?: string; paidAt?: number; prescription?: string; testsRecommended?: string;
  visitCompletedAt?: number;
};

export type ReceptionNotification = { id: string; patientName: string; doctor: string; token: string; timestamp: number; read: boolean };
export type ReceptionMessageHistory = {
  id: string; recipients: string; message: string; sentAt: string; status: 'Sent';
  messageType?: string; delivered?: number;
};

export type ReceptionReportRecord = {
  id: string; patientName: string; doctor: string; visitDate: string; timestamp: number;
  prescription: string; testsRecommended?: string; invoiceAmount: number;
};

export const RECEPTION_MODULES: { id: ReceptionModuleId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' }, { id: 'appointments', label: 'Appointments' },
  { id: 'patientreg', label: 'Patient Registration' }, { id: 'patients', label: 'Patients' },
  { id: 'queue', label: 'Queue Management' }, { id: 'billing', label: 'Billing & Payments' },
  { id: 'reports', label: 'Reports' }, { id: 'communication', label: 'Communication' },
];

export const RECEPTION_DOCTORS = ['Dr. Meera Sharma', 'Dr. Arjun Verma', 'Dr. Pooja Patel', 'Dr. Ravi Nair', 'Dr. Sneha Iyer'];
export const RECEPTION_SERVICES = [
  { service: 'Consultation Fee', charge: 600 }, { service: 'Follow-up Fee', charge: 400 },
  { service: 'X-Ray', charge: 400 }, { service: 'ECG', charge: 500 },
  { service: 'Lab Charges', charge: 750 }, { service: 'Procedure Fee', charge: 1200 },
];
export const RECEPTION_MESSAGE_TEMPLATES = [
  'Hi {name}, this is a reminder for your appointment on {date} at {time}.',
  'Hi {name}, this is a reminder for your follow-up on {date}.',
  'Hi {name}, this is a message from {clinic_name}.',
];

const reportDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

export const RECEPTION_REPORT_RECORDS: ReceptionReportRecord[] = [
  { id:'R1', patientName:'Suresh Yadav', doctor:'Dr. Meera Sharma', visitDate:reportDate(23).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), timestamp:reportDate(23).getTime(), prescription:'Tab Ibuprofen 400mg TDS. Rest advised.', invoiceAmount:1000 },
  { id:'R2', patientName:'Priya Singh', doctor:'Dr. Arjun Verma', visitDate:reportDate(23).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), timestamp:reportDate(23).getTime(), prescription:'Tab Amlodipine 5mg OD morning. Monitor BP daily.', invoiceAmount:500 },
  { id:'R3', patientName:'Ravi Kumar', doctor:'Dr. Meera Sharma', visitDate:reportDate(23).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), timestamp:reportDate(23).getTime(), prescription:'Tab Atorvastatin 10mg OD', testsRecommended:'ECG, Lipid Profile', invoiceAmount:600 },
  { id:'R4', patientName:'Amit Patel', doctor:'Dr. Meera Sharma', visitDate:reportDate(24).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), timestamp:reportDate(24).getTime(), prescription:'Tab Paracetamol 500mg TID. Fluids advised.', invoiceAmount:600 },
  { id:'R5', patientName:'Neha Gupta', doctor:'Dr. Arjun Verma', visitDate:reportDate(24).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), timestamp:reportDate(24).getTime(), prescription:'Tab Cetirizine 10mg OD night.', invoiceAmount:500 },
];

export const RECEPTION_MESSAGE_HISTORY: ReceptionMessageHistory[] = [
  { id:'MSG-1', recipients:'All Patients (240)', message:'Appointment reminder campaign', sentAt:'22 May 2025', status:'Sent', messageType:'Appointment Reminder', delivered:236 },
  { id:'MSG-2', recipients:'Selected (8)', message:'Follow-up reminder campaign', sentAt:'21 May 2025', status:'Sent', messageType:'Follow-up Reminder', delivered:8 },
  { id:'MSG-3', recipients:'All Patients (238)', message:'General notification campaign', sentAt:'20 May 2025', status:'Sent', messageType:'General Notification', delivered:230 },
];

const now = Date.now();
export const RECEPTION_PATIENTS: ReceptionPatient[] = [
  { id:'PT-000123', name:'Ravi Kumar', mobile:'9876543210', aadhar:'1234 5678 9012', age:34, gender:'Male', lastVisit:'Today', bloodGroup:'B+' },
  { id:'PT-000124', name:'Priya Singh', mobile:'9123456780', aadhar:'2345 6789 0123', age:28, gender:'Female', lastVisit:'Today', bloodGroup:'A+' },
  { id:'PT-000125', name:'Amit Patel', mobile:'9988776655', aadhar:'3456 7890 1234', age:45, gender:'Male', lastVisit:'21 May 2025', bloodGroup:'O+' },
  { id:'PT-000126', name:'Neha Gupta', mobile:'9345678901', aadhar:'4567 8901 2345', age:31, gender:'Female', lastVisit:'20 May 2025', bloodGroup:'AB-' },
  { id:'PT-000127', name:'Suresh Yadav', mobile:'9871234567', aadhar:'5678 9012 3456', age:52, gender:'Male', lastVisit:'19 May 2025', bloodGroup:'B-' },
  { id:'PT-000128', name:'Kavitha Nair', mobile:'9012345678', aadhar:'6789 0123 4567', age:38, gender:'Female', lastVisit:'18 May 2025', bloodGroup:'O-' },
  { id:'PT-000129', name:'Deepak Menon', mobile:'9765432109', aadhar:'7890 1234 5678', age:41, gender:'Male', lastVisit:'17 May 2025', bloodGroup:'A-' },
  { id:'PT-000130', name:'Ananya Iyer', mobile:'9654321098', aadhar:'8901 2345 6789', age:26, gender:'Female', lastVisit:'16 May 2025', bloodGroup:'B+' },
  { id:'PT-000131', name:'Ananya Sagar', mobile:'9654321008', aadhar:'8901 2345 6589', age:26, gender:'Female', lastVisit:'16 May 2025', bloodGroup:'A+' },
  { id:'PT-000132', name:'Swamy Iyer', mobile:'9654221098', aadhar:'8901 2375 6789', age:26, gender:'Male', lastVisit:'16 May 2025', bloodGroup:'B+' },
  { id:'PT-000133', name:'Lakshmi Rao', mobile:'9654110987', aadhar:'8901 2375 6789', age:26, gender:'Female', lastVisit:'16 May 2025', bloodGroup:'A+' },
];

export const RECEPTION_APPOINTMENTS: ReceptionAppointment[] = [
  { id:'A1', token:'OP-001', arrivalTime:'09:00 AM', scheduledTime:'09:00 AM', patientName:'Ravi Kumar', patientId:'PT-000123', doctor:'Dr. Meera Sharma', phone:'9876543210', visitType:'Consultation', priority:'Normal', chiefComplaint:'Chest pain follow-up', status:'With Doctor', createdAt:now-90*60000, prescription:'Tab Atorvastatin 10mg OD', testsRecommended:'ECG, Lipid Profile' },
  { id:'A2', token:'OP-002', arrivalTime:'09:20 AM', scheduledTime:'09:20 AM', patientName:'Priya Singh', patientId:'PT-000124', doctor:'Dr. Arjun Verma', phone:'9123456780', visitType:'Follow-Up', priority:'Normal', chiefComplaint:'BP review', status:'Post-Consult', createdAt:now-80*60000, prescription:'Tab Amlodipine 5mg OD morning. Monitor BP daily.' },
  { id:'A3', token:'OP-003', arrivalTime:'09:40 AM', scheduledTime:'09:40 AM', patientName:'Amit Patel', patientId:'PT-000125', doctor:'Dr. Meera Sharma', phone:'9988776655', visitType:'Consultation', priority:'Urgent', chiefComplaint:'Severe headache', status:'In Queue', createdAt:now-40*60000 },
  { id:'A4', token:'OP-004', arrivalTime:'10:00 AM', scheduledTime:'10:00 AM', patientName:'Neha Gupta', patientId:'PT-000126', doctor:'Dr. Arjun Verma', phone:'9345678901', visitType:'Walk-In', priority:'Normal', chiefComplaint:'Fever and cold', status:'In Queue', createdAt:now-30*60000 },
  { id:'A5', token:'OP-005', arrivalTime:'10:20 AM', patientName:'Suresh Yadav', patientId:'PT-000127', doctor:'Dr. Meera Sharma', phone:'9871234567', visitType:'Consultation', priority:'Normal', chiefComplaint:'Knee pain', status:'Bill Pending', createdAt:now-120*60000, prescription:'Tab Ibuprofen 400mg TDS. Rest advised.' },
  { id:'A6', token:'OP-006', arrivalTime:'', scheduledTime:'11:00 AM', patientName:'Kavitha Nair', patientId:'PT-000128', doctor:'Dr. Pooja Patel', phone:'9012345678', visitType:'Consultation', priority:'Normal', chiefComplaint:'Skin rash', status:'Scheduled', createdAt:now-10*60000 },
  { id:'A7', token:'OP-007', arrivalTime:'', scheduledTime:'11:30 AM', patientName:'Deepak Menon', patientId:'PT-000129', doctor:'Dr. Ravi Nair', phone:'9765432109', visitType:'Follow-Up', priority:'Normal', chiefComplaint:'Diabetes check', status:'Scheduled', createdAt:now-5*60000 },
];

export const RECEPTION_QUEUE: ReceptionQueueEntry[] = [
  { apptId:'A3', queueNo:1, token:'OP-003', patientName:'Amit Patel', patientId:'PT-000125', doctor:'Dr. Meera Sharma', priority:'Urgent', status:'Waiting', chiefComplaint:'Severe headache', queuedAt:now-40*60000 },
  { apptId:'A4', queueNo:2, token:'OP-004', patientName:'Neha Gupta', patientId:'PT-000126', doctor:'Dr. Arjun Verma', priority:'Normal', status:'Waiting', chiefComplaint:'Fever and cold', queuedAt:now-30*60000 },
  { apptId:'A1', queueNo:3, token:'OP-001', patientName:'Ravi Kumar', patientId:'PT-000123', doctor:'Dr. Meera Sharma', priority:'Normal', status:'With Doctor', chiefComplaint:'Chest pain', queuedAt:now-90*60000 },
];

export const RECEPTION_BILLS: ReceptionBill[] = [
  { apptId:'A5', patientId:'PT-000127', patientName:'Suresh Yadav', doctor:'Dr. Meera Sharma', visitDate:'Today', lines:[{ id:'L1',service:'Consultation Fee',charge:600,qty:1 },{ id:'L2',service:'X-Ray Knee',charge:400,qty:1 }], prescription:'Tab Ibuprofen 400mg TDS. Rest advised.' },
  { apptId:'A2', patientId:'PT-000124', patientName:'Priya Singh', doctor:'Dr. Arjun Verma', visitDate:'Today', lines:[{ id:'L1',service:'Consultation Fee',charge:500,qty:1 }], prescription:'Tab Amlodipine 5mg OD morning. Monitor BP daily.' },
];
