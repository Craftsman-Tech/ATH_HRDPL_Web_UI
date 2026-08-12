import {
  MOCK_APPOINTMENTS,
  MOCK_PATIENTS,
  palette,
  type AppointmentStatus,
  type PatientHealthStatus,
  type RiskLevel,
  type Role,
} from '@vexoo/shared';

export type PortalTone = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';

export type PortalMetric = {
  label: string;
  value: string;
  detail: string;
  tone: PortalTone;
};

export type PortalTask = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  status: string;
  tone: PortalTone;
};

export type PortalPerson = {
  id: string;
  name: string;
  subtitle: string;
  meta: string;
  status: string;
  tone: PortalTone;
};

export type PortalConfig = {
  role: Role;
  label: string;
  homeTitle: string;
  subtitle: string;
  accent: string;
  modules: string[];
  metrics: PortalMetric[];
  tasks: PortalTask[];
  people: PortalPerson[];
  quickActions: string[];
};

const appointmentTone: Record<AppointmentStatus, PortalTone> = {
  Scheduled: 'info',
  Confirmed: 'success',
  Waiting: 'warning',
  CheckedIn: 'info',
  InProgress: 'purple',
  InRoom: 'purple',
  Completed: 'success',
  Cancelled: 'danger',
  NoShow: 'danger',
};

const patientTone: Record<PatientHealthStatus | RiskLevel, PortalTone> = {
  Stable: 'success',
  Monitoring: 'warning',
  Critical: 'danger',
  Low: 'success',
  Medium: 'warning',
  High: 'danger',
};

const todaysAppointments = MOCK_APPOINTMENTS.map((item) => ({
  id: item.id,
  title: item.patient,
  subtitle: `${item.type} with ${item.doctor}`,
  meta: item.time,
  status: item.status,
  tone: appointmentTone[item.status],
}));

const patientDirectory = MOCK_PATIENTS.map((patient) => ({
  id: patient.id,
  name: patient.name,
  subtitle: `${patient.age} yrs - ${patient.condition}`,
  meta: `${patient.doctor} - Last visit ${patient.lastVisit}`,
  status: patient.risk ?? patient.status,
  tone: patientTone[patient.risk ?? patient.status],
}));

export const PORTAL_CONFIGS: Record<Role, PortalConfig> = {
  Admin: {
    role: 'Admin',
    label: 'Hospital Admin',
    homeTitle: 'Operations command',
    subtitle: 'Monitor appointments, staff, pharmacy, lab, EMR, reviews, and settings from one mobile view.',
    accent: palette.roleAdmin,
    modules: ['Dashboard', 'Appointments', 'Patients', 'Staff', 'Pharmacy', 'Lab', 'Inventory', 'EMR', 'Analytics'],
    metrics: [
      { label: 'Today visits', value: '128', detail: '+18 from yesterday', tone: 'success' },
      { label: 'Occupancy', value: '72%', detail: '18 beds available', tone: 'info' },
      { label: 'Open alerts', value: '7', detail: '3 need admin approval', tone: 'warning' },
      { label: 'Revenue', value: '4.8L', detail: 'Collected today', tone: 'purple' },
    ],
    tasks: [
      { id: 'HA-1', title: 'Approve visiting consultant roster', subtitle: 'Cardiology and orthopedics slots pending', meta: 'Due 11:30 AM', status: 'Approval', tone: 'warning' },
      { id: 'HA-2', title: 'Review pharmacy low-stock request', subtitle: '8 medicines below reorder threshold', meta: 'Inventory', status: 'Stock', tone: 'danger' },
      { id: 'HA-3', title: 'Resolve billing exception queue', subtitle: 'Insurance mismatch on 5 cases', meta: 'Finance', status: 'Review', tone: 'purple' },
    ],
    people: patientDirectory.slice(0, 5),
    quickActions: ['Add staff', 'Create appointment', 'Broadcast notice', 'Export report'],
  },
  Doctor: {
    role: 'Doctor',
    label: 'Doctor',
    homeTitle: 'Clinical workspace',
    subtitle: 'Queue, patient summaries, schedule, consultation notes, and care messages adapted for rounds.',
    accent: palette.roleDoctor,
    modules: ['Dashboard', 'Queue', 'Patients', 'Schedule', 'Messages'],
    metrics: [
      { label: 'In queue', value: '12', detail: '3 urgent consults', tone: 'warning' },
      { label: 'Completed', value: '18', detail: 'Today', tone: 'success' },
      { label: 'Messages', value: '9', detail: '2 unread from reception', tone: 'info' },
      { label: 'Critical', value: '1', detail: 'Needs follow-up', tone: 'danger' },
    ],
    tasks: todaysAppointments,
    people: patientDirectory,
    quickActions: ['Start consult', 'Add prescription', 'Order lab test', 'Send note'],
  },
  Receptionist: {
    role: 'Receptionist',
    label: 'Reception',
    homeTitle: 'Front desk flow',
    subtitle: 'Appointments, queue movement, registration, billing, communication, and reports for the desk.',
    accent: palette.roleReceptionist,
    modules: ['Dashboard', 'Appointments', 'Queue', 'Registration', 'Billing', 'Communication', 'Reports'],
    metrics: [
      { label: 'Checked in', value: '46', detail: 'Across 5 counters', tone: 'success' },
      { label: 'Waiting', value: '14', detail: 'Average 18 min', tone: 'warning' },
      { label: 'New patients', value: '8', detail: 'Registered today', tone: 'info' },
      { label: 'Payments', value: '2.1L', detail: 'Collected', tone: 'purple' },
    ],
    tasks: todaysAppointments,
    people: patientDirectory,
    quickActions: ['Check in', 'Register patient', 'Collect payment', 'Notify doctor'],
  },
  Pharmacist: {
    role: 'Pharmacist',
    label: 'Pharmacy',
    homeTitle: 'Dispensing center',
    subtitle: 'Prescription queues, inventory, suppliers, purchase orders, billing, and dispensing history.',
    accent: palette.rolePharmacist,
    modules: ['Dashboard', 'In-house Queue', 'External Queue', 'Inventory', 'Purchase Orders', 'Suppliers', 'Reports'],
    metrics: [
      { label: 'Pending RX', value: '24', detail: '6 insurance checks', tone: 'warning' },
      { label: 'Ready', value: '11', detail: 'Awaiting pickup', tone: 'success' },
      { label: 'Low stock', value: '8', detail: 'Reorder suggested', tone: 'danger' },
      { label: 'Dispensed', value: '63', detail: 'Today', tone: 'info' },
    ],
    tasks: [
      { id: 'RX-4821', title: 'Sarah Johnson', subtitle: 'Lisinopril 10mg - 30 tablets', meta: 'Dr. Chen', status: 'Verify', tone: 'warning' },
      { id: 'RX-4822', title: 'Marcus Williams', subtitle: 'Metformin 500mg - 60 tablets', meta: 'Dr. Patel', status: 'Ready', tone: 'success' },
      { id: 'RX-4823', title: 'Elena Rodriguez', subtitle: 'Albuterol inhaler - 1 unit', meta: 'Dr. Kim', status: 'Insurance', tone: 'purple' },
      { id: 'RX-4824', title: "James O'Brien", subtitle: 'Amiodarone 200mg - urgent', meta: 'Dr. Chen', status: 'STAT', tone: 'danger' },
    ],
    people: patientDirectory.slice(0, 4),
    quickActions: ['Scan RX', 'Mark ready', 'Create PO', 'Stock audit'],
  },
  LabTech: {
    role: 'LabTech',
    label: 'Lab Technician',
    homeTitle: 'Lab workflow',
    subtitle: 'Orders, collection, processing, results, equipment, inventory, reports, and lab settings.',
    accent: palette.roleDoctor,
    modules: ['Dashboard', 'Orders', 'Collection', 'Processing', 'Results', 'Completed', 'Equipment', 'Inventory'],
    metrics: [
      { label: 'Orders', value: '31', detail: '9 urgent', tone: 'warning' },
      { label: 'Collected', value: '18', detail: 'Samples in transit', tone: 'info' },
      { label: 'Processing', value: '12', detail: '4 nearing SLA', tone: 'purple' },
      { label: 'Completed', value: '26', detail: 'Released today', tone: 'success' },
    ],
    tasks: [
      { id: 'L-0091', title: 'HbA1c Panel', subtitle: 'Sarah Johnson - Blood', meta: '09:20 AM', status: 'Routine', tone: 'success' },
      { id: 'L-0092', title: 'Cardiac Enzymes', subtitle: "James O'Brien - Blood", meta: '10:05 AM', status: 'STAT', tone: 'danger' },
      { id: 'L-0093', title: 'Chest X-Ray', subtitle: 'Thomas Klein - Imaging', meta: '10:40 AM', status: 'Urgent', tone: 'warning' },
      { id: 'L-0094', title: 'Lipid Profile', subtitle: 'Priya Sharma - Blood', meta: '11:15 AM', status: 'Processing', tone: 'purple' },
    ],
    people: patientDirectory.slice(0, 6),
    quickActions: ['Scan barcode', 'Collect sample', 'Enter result', 'Flag critical'],
  },
};
