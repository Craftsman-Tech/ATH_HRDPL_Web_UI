export type DoctorModuleId = 'queue' | 'patients' | 'schedule' | 'messages';
export type DoctorRisk = 'Low' | 'Medium' | 'High';
export type DoctorPriority = 'Normal' | 'Urgent' | 'Emergency';
export type DoctorAppointmentStatus = 'Waiting' | 'In Consultation' | 'Completed' | 'Scheduled';

export type DoctorMedication = {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  duration?: string;
  status: 'Active' | 'Stopped';
  startDate?: string;
};

export type DoctorVital = {
  label: string;
  value: string;
  unit: string;
};

export type DoctorConsultation = {
  symptoms?: string;
  investigations?: string;
  labTests?: string[];
  completedAt?: number;
};

export type DoctorHistoryVisit = {
  id: string;
  date: string;
  hospital: string;
  doctor: string;
  diagnosis: string;
  prescriptionSummary: string;
  symptoms?: string;
  investigations?: string;
  medications?: { name: string; dosage: string; timing: string }[];
  labTests?: string[];
};

export type DoctorAttachment = {
  id: string;
  date: string;
  hospital: string;
  testName: string;
  result: 'Normal' | 'Abnormal' | 'Pending';
  fileName: string;
};

export type DoctorAppointment = {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  condition: string;
  riskLevel: DoctorRisk;
  token: string;
  date: string;
  visitType: 'Walk-In' | 'Follow-Up' | 'Consultation' | 'Procedure';
  priority: DoctorPriority;
  chiefComplaint: string;
  status: DoctorAppointmentStatus;
  queuedAt?: number;
  scheduledTime?: string;
  vitals: DoctorVital[];
  activeMedications: DoctorMedication[];
  consultation?: DoctorConsultation;
};

export type DoctorPatient = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  condition: string;
  riskLevel: DoctorRisk;
  phone: string;
  lastVisit: string;
  activeMedications: DoctorMedication[];
};

export type DoctorMessage = {
  from: 'doctor' | 'patient';
  text: string;
  time: string;
};

export type DoctorConversation = {
  name: string;
  last: string;
  time: string;
  unread: number;
  msgs: DoctorMessage[];
};

const pad = (n: number) => String(n).padStart(2, '0');
const baseToday = new Date();
export const DOCTOR_TODAY = `${baseToday.getFullYear()}-${pad(baseToday.getMonth() + 1)}-${pad(baseToday.getDate())}`;

export function doctorAddDays(days: number) {
  const next = new Date(baseToday);
  next.setDate(next.getDate() + days);
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
}

export function doctorShortDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

const now = Date.now();

export const DOCTOR_MODULES: { id: DoctorModuleId; label: string }[] = [
  { id: 'queue', label: "Today's Queue" },
  { id: 'patients', label: 'My Patients' },
  { id: 'schedule', label: 'My Schedule' },
  { id: 'messages', label: 'Messages' },
];

export const DOCTOR_LAB_TESTS = [
  'CBC (Complete Blood Count)',
  'Metabolic Panel',
  'HbA1c',
  'Lipid Panel',
  'Thyroid Function (TSH)',
  'Troponin',
  'Urinalysis',
  'Coagulation (PT/INR)',
  'Liver Function',
  'CRP / ESR',
  'ECG',
  'Chest X-Ray',
  'MRI Brain',
  'Spirometry',
];

export const DOCTOR_MEDICINES = [
  'Lisinopril 10mg',
  'Lisinopril 5mg',
  'Amlodipine 5mg',
  'Amlodipine 10mg',
  'Atorvastatin 10mg',
  'Atorvastatin 20mg',
  'Metformin 500mg',
  'Metformin 1000mg',
  'Aspirin 81mg',
  'Aspirin 150mg',
  'HCTZ 12.5mg',
  'Losartan 50mg',
  'Amiodarone 200mg',
  'Salbutamol Inhaler',
  'Montelukast 10mg',
  'Sumatriptan 50mg',
  'Propranolol 40mg',
  'Ibuprofen 400mg',
  'Paracetamol 500mg',
  'Azithromycin 500mg',
  'Amoxicillin 500mg',
  'Pantoprazole 40mg',
  'Cetirizine 10mg',
  'Vitamin D3 60K',
  'Calcium + D3',
  'Ondansetron 4mg',
  'Insulin Glargine',
  'Levothyroxine 50mcg',
  'Sertraline 50mg',
  'Alprazolam 0.25mg',
];

export const DOCTOR_DOSAGES = ['Once', 'Twice', 'Thrice'];
export const DOCTOR_TIMINGS = ['Before Breakfast', 'After Breakfast', 'Before Lunch', 'After Lunch', 'Before Dinner', 'After Dinner'];

export const DOCTOR_APPOINTMENTS: DoctorAppointment[] = [
  {
    id: 'AP-001',
    patientId: 'P-002',
    name: 'Ravi Kumar',
    age: 41,
    gender: 'Male',
    bloodGroup: 'B+',
    condition: 'Coronary Risk Monitoring',
    riskLevel: 'Medium',
    token: 'OP-001',
    date: DOCTOR_TODAY,
    visitType: 'Walk-In',
    priority: 'Normal',
    chiefComplaint: 'Chest pain',
    status: 'In Consultation',
    queuedAt: now - 18 * 60000,
    vitals: [
      { label: 'Blood Pressure', value: '138/88', unit: 'mmHg' },
      { label: 'Heart Rate', value: '92', unit: 'bpm' },
    ],
    activeMedications: [],
  },
  {
    id: 'AP-002',
    patientId: 'P-006',
    name: 'Elena Rodriguez',
    age: 28,
    gender: 'Female',
    bloodGroup: 'O+',
    condition: 'Asthma',
    riskLevel: 'Low',
    token: 'OP-002',
    date: DOCTOR_TODAY,
    visitType: 'Walk-In',
    priority: 'Normal',
    chiefComplaint: 'Inhaler technique review',
    status: 'Completed',
    queuedAt: now - 150 * 60000,
    vitals: [
      { label: 'Blood Pressure', value: '118/76', unit: 'mmHg' },
      { label: 'O2 Saturation', value: '97', unit: '%' },
    ],
    activeMedications: [],
    consultation: { symptoms: 'Mild wheeze on exertion.', investigations: 'Spirometry reviewed and stable.', labTests: [], completedAt: now - 100 * 60000 },
  },
  {
    id: 'AP-003',
    patientId: 'P-003',
    name: 'Amit Patel',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    condition: 'Migraine',
    riskLevel: 'Medium',
    token: 'OP-003',
    date: DOCTOR_TODAY,
    visitType: 'Follow-Up',
    priority: 'Urgent',
    chiefComplaint: 'Severe headache',
    status: 'Waiting',
    queuedAt: now - 41 * 60000,
    vitals: [],
    activeMedications: [{ id: 'M-1', name: 'Sumatriptan 50mg', dosage: '1 tablet', timing: 'After Lunch', duration: 'SOS', status: 'Active', startDate: 'Apr 2026' }],
  },
  {
    id: 'AP-004',
    patientId: 'P-004',
    name: 'Neha Gupta',
    age: 28,
    gender: 'Female',
    bloodGroup: 'AB-',
    condition: 'Seasonal Flu',
    riskLevel: 'Low',
    token: 'OP-004',
    date: DOCTOR_TODAY,
    visitType: 'Walk-In',
    priority: 'Normal',
    chiefComplaint: 'Fever and cold',
    status: 'Waiting',
    queuedAt: now - 31 * 60000,
    vitals: [{ label: 'Temperature', value: '101.2', unit: 'F' }],
    activeMedications: [],
  },
  {
    id: 'AP-005',
    patientId: 'P-005',
    name: "James O'Brien",
    age: 67,
    gender: 'Male',
    bloodGroup: 'O-',
    condition: 'Cardiac Arrhythmia',
    riskLevel: 'High',
    token: 'OP-005',
    date: DOCTOR_TODAY,
    visitType: 'Follow-Up',
    priority: 'Urgent',
    chiefComplaint: 'Reported palpitations last night',
    status: 'Waiting',
    queuedAt: now - 12 * 60000,
    vitals: [
      { label: 'Blood Pressure', value: '148/95', unit: 'mmHg' },
      { label: 'Heart Rate', value: '112', unit: 'bpm' },
      { label: 'O2 Saturation', value: '96', unit: '%' },
    ],
    activeMedications: [{ id: 'M-2', name: 'Amiodarone 200mg', dosage: '1 tablet', timing: 'After Breakfast', duration: 'Ongoing', status: 'Active', startDate: 'May 2026' }],
  },
  {
    id: 'AP-006',
    patientId: 'P-001',
    name: 'Sarah Johnson',
    age: 34,
    gender: 'Female',
    bloodGroup: 'A+',
    condition: 'Hypertension',
    riskLevel: 'Low',
    token: 'OP-006',
    date: DOCTOR_TODAY,
    visitType: 'Follow-Up',
    priority: 'Normal',
    chiefComplaint: 'Routine follow-up. BP trending down.',
    status: 'Scheduled',
    scheduledTime: '11:00 AM',
    vitals: [],
    activeMedications: [
      { id: 'M-3', name: 'Lisinopril 10mg', dosage: '1 tablet', timing: 'Before Breakfast', duration: 'Ongoing', status: 'Active', startDate: 'Jan 2024' },
      { id: 'M-4', name: 'Aspirin 81mg', dosage: '1 tablet', timing: 'After Breakfast', duration: 'Ongoing', status: 'Active', startDate: 'Mar 2024' },
    ],
  },
  {
    id: 'AP-007',
    patientId: 'P-007',
    name: 'David Nguyen',
    age: 44,
    gender: 'Male',
    bloodGroup: 'B+',
    condition: 'Hypertension',
    riskLevel: 'Medium',
    token: 'OP-007',
    date: DOCTOR_TODAY,
    visitType: 'Follow-Up',
    priority: 'Normal',
    chiefComplaint: 'Second visit post medication start.',
    status: 'Scheduled',
    scheduledTime: '02:00 PM',
    vitals: [],
    activeMedications: [],
  },
  { id: 'AP-008', patientId: 'P-008', name: 'Priya Sharma', age: 41, gender: 'Female', bloodGroup: 'B+', condition: 'Migraine', riskLevel: 'Low', token: 'OP-008', date: doctorAddDays(1), visitType: 'Follow-Up', priority: 'Normal', chiefComplaint: 'Frequency increased, consider prophylaxis.', status: 'Scheduled', scheduledTime: '10:00 AM', vitals: [], activeMedications: [] },
  { id: 'AP-009', patientId: 'P-009', name: 'Thomas Klein', age: 59, gender: 'Male', bloodGroup: 'A-', condition: 'COPD', riskLevel: 'Medium', token: 'OP-009', date: doctorAddDays(1), visitType: 'Follow-Up', priority: 'Normal', chiefComplaint: 'Spirometry results review.', status: 'Scheduled', scheduledTime: '11:30 AM', vitals: [], activeMedications: [] },
  { id: 'AP-010', patientId: 'P-010', name: 'Aisha Okonkwo', age: 31, gender: 'Female', bloodGroup: 'O+', condition: 'Anxiety Disorder', riskLevel: 'Low', token: 'OP-010', date: doctorAddDays(2), visitType: 'Follow-Up', priority: 'Normal', chiefComplaint: 'Monthly check-in, therapy progress.', status: 'Scheduled', scheduledTime: '04:30 PM', vitals: [], activeMedications: [] },
  { id: 'AP-011', patientId: 'P-011', name: 'Marcus Williams', age: 52, gender: 'Male', bloodGroup: 'AB+', condition: 'Type 2 Diabetes', riskLevel: 'Medium', token: 'OP-011', date: doctorAddDays(3), visitType: 'Follow-Up', priority: 'Normal', chiefComplaint: 'HbA1c review, adjust Metformin dose.', status: 'Scheduled', scheduledTime: '10:00 AM', vitals: [], activeMedications: [] },
];

export const DOCTOR_PATIENTS: DoctorPatient[] = [
  { id: 'P-001', name: 'Sarah Johnson', age: 34, gender: 'Female', bloodGroup: 'A+', condition: 'Hypertension', riskLevel: 'Low', phone: '9876500001', lastVisit: '26 Apr 2026', activeMedications: DOCTOR_APPOINTMENTS[5].activeMedications },
  { id: 'P-002', name: 'Ravi Kumar', age: 41, gender: 'Male', bloodGroup: 'B+', condition: 'Coronary Risk Monitoring', riskLevel: 'Medium', phone: '9876500002', lastVisit: 'Today', activeMedications: [] },
  { id: 'P-003', name: 'Amit Patel', age: 45, gender: 'Male', bloodGroup: 'O+', condition: 'Migraine', riskLevel: 'Medium', phone: '9876500003', lastVisit: 'Today', activeMedications: DOCTOR_APPOINTMENTS[2].activeMedications },
  { id: 'P-004', name: 'Neha Gupta', age: 28, gender: 'Female', bloodGroup: 'AB-', condition: 'Seasonal Flu', riskLevel: 'Low', phone: '9876500004', lastVisit: 'Today', activeMedications: [] },
  { id: 'P-005', name: "James O'Brien", age: 67, gender: 'Male', bloodGroup: 'O-', condition: 'Cardiac Arrhythmia', riskLevel: 'High', phone: '9876500005', lastVisit: 'Today', activeMedications: DOCTOR_APPOINTMENTS[4].activeMedications },
  { id: 'P-006', name: 'Elena Rodriguez', age: 28, gender: 'Female', bloodGroup: 'O+', condition: 'Asthma', riskLevel: 'Low', phone: '9876500006', lastVisit: 'Today', activeMedications: [] },
  { id: 'P-007', name: 'David Nguyen', age: 44, gender: 'Male', bloodGroup: 'B+', condition: 'Hypertension', riskLevel: 'Medium', phone: '9876500007', lastVisit: '02 Mar 2026', activeMedications: [] },
  { id: 'P-008', name: 'Priya Sharma', age: 41, gender: 'Female', bloodGroup: 'B+', condition: 'Migraine', riskLevel: 'Low', phone: '9876500008', lastVisit: '15 Mar 2026', activeMedications: [] },
  { id: 'P-009', name: 'Thomas Klein', age: 59, gender: 'Male', bloodGroup: 'A-', condition: 'COPD', riskLevel: 'Medium', phone: '9876500009', lastVisit: '20 Mar 2026', activeMedications: [] },
  { id: 'P-010', name: 'Aisha Okonkwo', age: 31, gender: 'Female', bloodGroup: 'O+', condition: 'Anxiety Disorder', riskLevel: 'Low', phone: '9876500010', lastVisit: '28 Mar 2026', activeMedications: [] },
  { id: 'P-011', name: 'Marcus Williams', age: 52, gender: 'Male', bloodGroup: 'AB+', condition: 'Type 2 Diabetes', riskLevel: 'Medium', phone: '9876500011', lastVisit: '30 Mar 2026', activeMedications: [] },
];

export const DOCTOR_HISTORY: Record<string, DoctorHistoryVisit[]> = {
  'P-001': [
    { id: 'H-101', date: '26 Apr 2026', hospital: 'Vexoo Care Hospital', doctor: 'Dr. Meera Sharma', diagnosis: 'Hypertension - routine follow-up', prescriptionSummary: 'Lisinopril 10mg OD, HCTZ 12.5mg OD', symptoms: 'Patient reports feeling well. BP readings at home averaging 125/80.', investigations: 'BP 128/82. HR 74 regular. O2 98%. Weight stable.', medications: [{ name: 'Lisinopril 10mg', dosage: '1 tablet', timing: 'Before Breakfast' }, { name: 'HCTZ 12.5mg', dosage: '1 tablet', timing: 'After Breakfast' }], labTests: ['Lipid Panel'] },
    { id: 'H-102', date: '02 Mar 2026', hospital: 'Vexoo Care Hospital', doctor: 'Dr. Meera Sharma', diagnosis: 'Hypertension - BP review', prescriptionSummary: 'Continued Lisinopril 10mg OD' },
    { id: 'H-103', date: '14 Jan 2026', hospital: 'Apollo Clinic, Banjara Hills', doctor: 'Dr. Kavya Reddy', diagnosis: 'Seasonal flu', prescriptionSummary: 'Paracetamol 500mg SOS, rest advised' },
  ],
  'P-003': [
    { id: 'H-301', date: '18 Apr 2026', hospital: 'Vexoo Care Hospital', doctor: 'Dr. Arjun Verma', diagnosis: 'Migraine - frequency increased', prescriptionSummary: 'Sumatriptan 50mg SOS', symptoms: 'Headaches now 3-4 times a week with photophobia.', investigations: 'Neurological exam unremarkable. No red flags.', medications: [{ name: 'Sumatriptan 50mg', dosage: '1 tablet', timing: 'After Lunch' }], labTests: ['MRI Brain'] },
    { id: 'H-302', date: '02 Feb 2026', hospital: 'Care Hospital, Hitech City', doctor: 'Dr. Rohan Das', diagnosis: 'Migraine - first consult', prescriptionSummary: 'Propranolol 40mg OD, lifestyle advice' },
  ],
  'P-005': [
    { id: 'H-401', date: '08 May 2026', hospital: 'Vexoo Care Hospital', doctor: 'Dr. Meera Sharma', diagnosis: 'Cardiac arrhythmia - palpitations', prescriptionSummary: 'Amiodarone 200mg OD, ECG advised', symptoms: 'Palpitations and mild dizziness, worse at night.', investigations: 'BP 148/95, HR 112 irregular. Occasional ectopic beats.', medications: [{ name: 'Amiodarone 200mg', dosage: '1 tablet', timing: 'After Breakfast' }], labTests: ['ECG', 'Troponin'] },
  ],
};

export const DOCTOR_ATTACHMENTS: Record<string, DoctorAttachment[]> = {
  'P-001': [
    { id: 'A-101', date: '26 Apr 2026', hospital: 'Vexoo Care Hospital', testName: 'Lipid Profile', result: 'Normal', fileName: 'lipid_profile_26apr.pdf' },
    { id: 'A-102', date: '02 Mar 2026', hospital: 'Vexoo Care Hospital', testName: 'CBC Panel', result: 'Normal', fileName: 'cbc_02mar.pdf' },
    { id: 'A-103', date: '14 Jan 2026', hospital: 'Apollo Clinic, Banjara Hills', testName: 'Chest X-Ray', result: 'Normal', fileName: 'chest_xray_14jan.pdf' },
  ],
  'P-003': [{ id: 'A-301', date: '18 Apr 2026', hospital: 'Vexoo Care Hospital', testName: 'MRI Brain', result: 'Pending', fileName: 'mri_brain_18apr.pdf' }],
  'P-005': [
    { id: 'A-401', date: '08 May 2026', hospital: 'Vexoo Care Hospital', testName: 'ECG + Troponin', result: 'Abnormal', fileName: 'ecg_troponin_08may.pdf' },
    { id: 'A-402', date: '20 Mar 2026', hospital: 'Yashoda Hospital, Somajiguda', testName: 'Echocardiogram', result: 'Normal', fileName: 'echo_20mar.pdf' },
  ],
};

export const DOCTOR_CONVERSATIONS: DoctorConversation[] = [
  {
    name: 'Sarah Johnson',
    last: 'When should I take my medication?',
    time: '2m',
    unread: 2,
    msgs: [
      { from: 'patient', text: 'Hi Doctor, when exactly should I take my Lisinopril?', time: '9:45 AM' },
      { from: 'doctor', text: 'Good morning Sarah. Take it first thing in the morning, ideally at the same time each day.', time: '9:52 AM' },
      { from: 'patient', text: 'Should I take it with food or on an empty stomach?', time: '9:53 AM' },
    ],
  },
  {
    name: 'Marcus Williams',
    last: 'Thank you doctor',
    time: '1h',
    unread: 0,
    msgs: [
      { from: 'patient', text: 'Doctor, my blood sugar has been high this week.', time: '8:00 AM' },
      { from: 'doctor', text: 'Please check levels after each meal and share the readings.', time: '8:30 AM' },
      { from: 'patient', text: 'Will do. Thank you doctor.', time: '8:35 AM' },
    ],
  },
  {
    name: 'Pharmacy Team',
    last: 'RX-4823 dispensed',
    time: '3h',
    unread: 1,
    msgs: [{ from: 'patient', text: "RX-4823 - Amiodarone 200mg has been dispensed to James O'Brien.", time: '6:30 AM' }],
  },
  {
    name: 'Priya Sharma',
    last: 'Sharing my BP readings for this week.',
    time: '4h',
    unread: 3,
    msgs: [
      { from: 'doctor',  text: 'Priya, please log your blood pressure twice a day for a week.', time: 'Mon 10:10 AM' },
      { from: 'patient', text: 'Understood doctor, starting today.', time: 'Mon 10:14 AM' },
      { from: 'patient', text: 'Mon morning 142/90, evening 138/88.', time: 'Tue 8:05 AM' },
      { from: 'patient', text: 'Tue morning 136/86, evening 134/84.', time: 'Wed 8:02 AM' },
      { from: 'patient', text: 'Sharing my BP readings for this week.', time: '5:40 AM' },
    ],
  },
  {
    name: 'Thomas Klein',
    last: 'Is the swelling normal after the procedure?',
    time: '6h',
    unread: 1,
    msgs: [
      { from: 'patient', text: 'Doctor, the knee is still swollen three days after the procedure.', time: '4:10 AM' },
      { from: 'patient', text: 'Is the swelling normal after the procedure?', time: '4:11 AM' },
    ],
  },
  {
    name: 'Lab Diagnostics',
    last: 'Cardiac enzyme panel released.',
    time: '8h',
    unread: 0,
    msgs: [
      { from: 'patient', text: "Cardiac enzyme panel for James O'Brien has been released.", time: '2:15 AM' },
      { from: 'doctor',  text: 'Received, reviewing now.', time: '2:40 AM' },
    ],
  },
  {
    name: 'Elena Rodriguez',
    last: 'Thank you, the inhaler technique helped.',
    time: '1d',
    unread: 0,
    msgs: [
      { from: 'doctor',  text: 'Elena, breathe out fully before pressing the inhaler, then hold for ten seconds.', time: 'Yesterday 3:20 PM' },
      { from: 'patient', text: 'Thank you, the inhaler technique helped.', time: 'Yesterday 6:05 PM' },
    ],
  },
  {
    name: 'Amit Patel',
    last: 'Can I reschedule to Friday morning?',
    time: '1d',
    unread: 0,
    msgs: [
      { from: 'patient', text: 'Doctor, I have a work conflict on Thursday.', time: 'Yesterday 11:00 AM' },
      { from: 'patient', text: 'Can I reschedule to Friday morning?', time: 'Yesterday 11:01 AM' },
      { from: 'doctor',  text: 'Friday 9:30 AM works. Reception will confirm the slot.', time: 'Yesterday 12:15 PM' },
    ],
  },
  {
    name: 'Reception Desk',
    last: 'Two walk-ins added to your queue.',
    time: '2d',
    unread: 0,
    msgs: [
      { from: 'patient', text: 'Two walk-ins added to your queue for this morning.', time: '2 days ago' },
    ],
  },
];
