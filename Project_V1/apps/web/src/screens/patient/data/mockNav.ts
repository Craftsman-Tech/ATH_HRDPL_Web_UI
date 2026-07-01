import type { NavItem, ScreenId, SearchResult, Notification } from '../types/patient.types';

export const NAV: NavItem[] = [
  { id: 'home',      label: 'Dashboard',    ic: 'home' },
  { id: 'appts',     label: 'Appointments', ic: 'calendar', badge: 1 },
  { id: 'records',   label: 'My Records',   ic: 'records' },
  { id: 'meds',      label: 'Medications',  ic: 'pill' },
  { id: 'lab',       label: 'Lab Results',  ic: 'lab' },
  { id: 'vax',       label: 'Vaccinations', ic: 'syringe' },
  { id: 'family',    label: 'Family',       ic: 'users' },
  { id: 'messages',  label: 'Messages',     ic: 'message', badge: 1 },
  { id: 'billing',   label: 'Billing',      ic: 'billing' },
  { id: 'insurance', label: 'Insurance',    ic: 'shield' },
];

export const TITLES: Record<ScreenId, { t: string; s: string }> = {
  home:      { t: 'Dashboard',          s: 'Your health at a glance' },
  appts:     { t: 'Appointments',       s: 'Bookings and visit history' },
  records:   { t: 'Health Records',     s: 'Documents and timeline' },
  meds:      { t: 'Medications',        s: "Today's schedule and prescriptions" },
  lab:       { t: 'Lab Results',        s: 'Trends and detailed reports' },
  vax:       { t: 'Vaccinations',       s: 'Immunization records for your family' },
  family:    { t: 'Family',             s: 'Manage household members and records' },
  messages:  { t: 'Messages',           s: 'Talk to your care team' },
  billing:   { t: 'Billing & Payments', s: 'Invoices and claims' },
  insurance: { t: 'Insurance',          s: 'Coverage and benefits' },
};

export const SEARCH_INDEX: SearchResult[] = [
  { label: 'Book an appointment',  type: 'Action',    ic: 'calendar', to: 'appts'    },
  { label: 'Lisinopril 10mg',      type: 'Med',       ic: 'pill',     to: 'meds'     },
  { label: 'Complete Blood Count', type: 'Lab',       ic: 'lab',      to: 'lab'      },
  { label: 'Lipid Panel',          type: 'Lab',       ic: 'lab',      to: 'lab'      },
  { label: 'Vaccinations',         type: 'Record',    ic: 'syringe',  to: 'vax'      },
  { label: 'Family members',       type: 'Family',    ic: 'users',    to: 'family'   },
  { label: 'Message Dr. Chen',     type: 'Action',    ic: 'message',  to: 'messages' },
  { label: 'Invoice history',      type: 'Billing',   ic: 'billing',  to: 'billing'  },
  { label: 'Insurance coverage',   type: 'Insurance', ic: 'shield',   to: 'insurance'},
  { label: 'Visit timeline',       type: 'Record',    ic: 'records',  to: 'records'  },
];

export const NOTIF_DATA: Notification[] = [
  { ic: 'pill',     color: '#e0951a', bg: '#fdf3e3', title: 'Refill due soon',       text: 'Lisinopril 10mg \u2014 12 pills remaining.',          time: '6 days'    },
  { ic: 'calendar', color: '#0E9384', bg: '#f3fbf9', title: 'Upcoming appointment',  text: 'Dr. Amy Chen \u00b7 Cardiology \u00b7 May 15 \u00b7 10:00 AM.', time: '4 days'    },
  { ic: 'lab',      color: '#4F7CFF', bg: '#f5f8ff', title: 'New lab results ready', text: 'Complete Blood Count (CBC) is available.',             time: '2 days ago' },
];
