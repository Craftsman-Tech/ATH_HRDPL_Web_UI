import type { Hospital, Approval, NavItem } from '../types/admin.types';

export const HOSPITALS: Hospital[] = [
  { id:'H-001', name:'Apollo Multispecialty',   city:'Hyderabad', type:'Multi-speciality', status:'active',    beds:420, doctors:84, joined:'Jan 2024', plan:'Enterprise',   revenue:'₹3.2L' },
  { id:'H-002', name:'Maxcare Heart Institute',  city:'Chennai',   type:'Cardiac',          status:'active',    beds:180, doctors:36, joined:'Mar 2024', plan:'Professional', revenue:'₹1.8L' },
  { id:'H-003', name:'Sunrise General Hospital', city:'Mumbai',    type:'General',          status:'pending',   beds:260, doctors:52, joined:'Apr 2026', plan:'Starter',      revenue:'—'     },
  { id:'H-004', name:'Greenfield Wellness',      city:'Bengaluru', type:'Wellness',         status:'active',    beds:95,  doctors:22, joined:'Sep 2024', plan:'Professional', revenue:'₹0.9L' },
  { id:'H-005', name:'PedsFirst Children',       city:'Pune',      type:'Paediatric',       status:'active',    beds:140, doctors:31, joined:'Nov 2024', plan:'Professional', revenue:'₹1.1L' },
  { id:'H-006', name:'Orthocare Speciality',     city:'Delhi',     type:'Orthopaedic',      status:'suspended', beds:110, doctors:18, joined:'Feb 2024', plan:'Starter',      revenue:'₹0.2L' },
];

export const APPROVALS: Approval[] = [
  { id:'APR-081', type:'Hospital Registration', name:'Sunrise General Hospital', hospital:'Mumbai',    submitted:'Apr 25, 2026', priority:'high',   docs:8  },
  { id:'APR-082', type:'Doctor Credentials',    name:'Dr. Arjun Mehta',          hospital:'Apollo',    submitted:'Apr 25, 2026', priority:'high',   docs:5  },
  { id:'APR-083', type:'Speciality Expansion',  name:'Maxcare — Neuro Wing',     hospital:'Maxcare',   submitted:'Apr 24, 2026', priority:'normal', docs:12 },
  { id:'APR-084', type:'Plan Upgrade',          name:'Greenfield Wellness',      hospital:'Bengaluru', submitted:'Apr 24, 2026', priority:'normal', docs:3  },
  { id:'APR-085', type:'Doctor Credentials',    name:'Dr. Priya Sundar',         hospital:'PedsFirst', submitted:'Apr 23, 2026', priority:'normal', docs:4  },
];

export const NAV_ITEMS: NavItem[] = [
  { id:'dashboard', label:'Dashboard',    path:'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { id:'hospitals', label:'Hospitals',    path:'M12 7V3H2v18h20V7H12zm-2 12H4v-2h6v2zm0-4H4v-2h6v2zm0-4H4V9h6v2zm0-4H4V5h6v2zm10 12h-8V9h8v10zm-2-8h-4v2h4v-2zm0 4h-4v2h4v-2z' },
  { id:'doctors',   label:'Doctors',      path:'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z' },
  { id:'approvals', label:'Approvals',    path:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', badge:5 },
  { id:'licenses',  label:'Licenses',     path:'M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.58 1 13.5 3.08L12 4.58l-1.5-1.51C8.42 1 6 2.53 6 4.64c0 .48.11.92.18 1.36H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5.5-2.5c.72-.7 2.5-.21 2.5.97 0 .78-.59 1.53-1 2.03L14.2 8H12l2.5-4.5zM9 4.61c0-1.18 1.78-1.67 2.5-.97L14 8h-2.2C11.13 7.3 9 6.21 9 4.61zM4 19V8h6l4 4 4-4h6v11H4z' },
  { id:'activity',  label:'Activity Log', path:'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z' },
];

export const PAGE_TITLES: Record<string, [string, string]> = {
  dashboard: ["Founders' Console", 'Platform-wide overview — May 2026'],
  hospitals: ['Registered Hospitals', '6 hospitals on the platform'],
  doctors:   ['Doctor Registry', '243 registered doctors across 6 hospitals'],
  approvals: ['Pending Approvals', '5 items awaiting review'],
  licenses:  ['Licence Management', 'Subscription plans and billing'],
  activity:  ['Activity Log', 'Recent system events'],
};

export const APPROVAL_ICON_PATH: Record<string, string> = {
  'Hospital Registration': 'M12 7V3H2v18h20V7H12zm-2 12H4v-2h6v2zm0-4H4v-2h6v2zm0-4H4V9h6v2zm0-4H4V5h6v2zm10 12h-8V9h8v10zm-2-8h-4v2h4v-2zm0 4h-4v2h4v-2z',
  'Doctor Credentials':    'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z',
  'Speciality Expansion':  'M13 7.5h5v2h-5zm0 7h5v2h-5zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8.5-6.25h-2v2h-2v-2h-2v-2h2v-2h2v2h2z',
  'Plan Upgrade':          'M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.58 1 13.5 3.08L12 4.58l-1.5-1.51C8.42 1 6 2.53 6 4.64c0 .48.11.92.18 1.36H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5.5-2.5c.72-.7 2.5-.21 2.5.97 0 .78-.59 1.53-1 2.03L14.2 8H12l2.5-4.5zM9 4.61c0-1.18 1.78-1.67 2.5-.97L14 8h-2.2C11.13 7.3 9 6.21 9 4.61zM4 19V8h6l4 4 4-4h6v11H4z',
};

export const APPROVAL_ICON_COLOR: Record<string, [string, string]> = {
  'Hospital Registration': ['#1D4ED8','#DBEAFE'],
  'Doctor Credentials':    ['#0E7C66','#E0F3EE'],
  'Speciality Expansion':  ['#7c3aed','#ede9fe'],
  'Plan Upgrade':          ['#B45309','#FEF3C7'],
};
