export type ModuleId =
  | 'dashboard' | 'patients' | 'appointments' | 'emr'
  | 'pharmacy'  | 'lab'      | 'inventory'    | 'analytics'
  | 'notifications' | 'staff' | 'reviews';

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
