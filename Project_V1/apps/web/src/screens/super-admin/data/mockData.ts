/**
 * mockData.ts — Super Admin (ATH · Support Console) seed data
 * ----------------------------------------------------------------------------
 * Ported from the reference design + screenshots. Every export is a seed-only
 * constant; replace with API calls later (see TODO(backend) markers).
 *
 * The approval workflow is multi-agent: REGISTRATIONS seed the shared queue
 * and each agent's personal queue. The live accept / approve / reject / need-
 * info transitions are owned by shared/approvalsStore.tsx.
 */
import type {
  Hospital, Registration, License, ActivityEvent, RegDetail,
  ModuleCard, BillingKpi, PlanCard, Invoice, SettingsProfile,
  TeamMember, ApprovalRules, SecurityInfo,
  NavItem, KPIItem, QuickAction, ViewId, MainTab, PageHead, PlanTier,
} from '../types/admin.types';

/* Full state names (the directory shows these under the city) -------------- */
export const STATE_FULL: Record<string, string> = {
  AP: 'Andhra Pradesh', TS: 'Telangana', KA: 'Karnataka', TN: 'Tamil Nadu',
  MH: 'Maharashtra', KL: 'Kerala', GJ: 'Gujarat', DL: 'Delhi',
};
export const stateName = (code: string) => STATE_FULL[code] ?? code;

/* Hospitals (tenant directory — matches the reference, 7 live tenants) ----- */
export const HOSPITALS: Hospital[] = [
  { id:'VX-T-00128', name:'Suvarna Multi-Speciality', regNo:'HOSP/AP/2026/00824', city:'Hyderabad',  state:'TS', admin:'Dr. Priya Iyer',       email:'priya@suvarnahospital.in', plan:'core',  status:'active',     registered:'May 2, 2026',  mark:'S', accent:'#0E7C66' },
  { id:'VX-T-00127', name:"Akash Children's Clinic",  regNo:'HOSP/KA/2026/01993', city:'Bengaluru',  state:'KA', admin:'Dr. Rohan Mehta',      email:'rohan@akashclinic.in',     plan:'pilot', status:'trial',      registered:'Apr 28, 2026', mark:'A', accent:'#5C6BC0' },
  { id:'VX-T-00126', name:'Karuna Maternity Centre',  regNo:'HOSP/MH/2026/02014', city:'Pune',       state:'MH', admin:'Dr. Anjali Deshpande', email:'anjali@karunacare.in',     plan:'core',  status:'onboarding', registered:'Apr 25, 2026', mark:'K', accent:'#0A7A8F' },
  { id:'VX-T-00125', name:'Citadel Diagnostics',      regNo:'HOSP/TN/2026/00761', city:'Chennai',    state:'TN', admin:'Mr. Hari Krishnan',    email:'hari@citadeldx.in',        plan:'scale', status:'active',     registered:'Apr 21, 2026', mark:'C', accent:'#2A7A4B' },
  { id:'VX-T-00124', name:'Aarogyam Wellness',        regNo:'HOSP/AP/2026/00671', city:'Vijayawada', state:'AP', admin:'Dr. Naveen Reddy',     email:'naveen@aarogyam.in',       plan:'core',  status:'active',     registered:'Apr 18, 2026', mark:'A', accent:'#149E83' },
  { id:'VX-T-00121', name:'Lotus Eye Hospital',       regNo:'HOSP/MH/2026/01228', city:'Mumbai',     state:'MH', admin:'Dr. Ritu Kapoor',      email:'ritu@lotuseye.in',         plan:'scale', status:'active',     registered:'Apr 6, 2026',  mark:'L', accent:'#0E7C66' },
  { id:'VX-T-00120', name:'Surya Skin & Cosmetic',    regNo:'HOSP/KL/2026/00094', city:'Kochi',      state:'KL', admin:'Dr. Meera Nair',       email:'meera@suryaskin.in',       plan:'core',  status:'suspended',  registered:'Mar 30, 2026', mark:'S', accent:'#C68A1F' },
];

/* Registrations (the approval workflow seed) ------------------------------- */
/* queue:'shared'  → All approvals queue, acceptable (status 'open' or 'overdue' only)
 * queue:'other'   → locked in another agent's queue (hidden from the All queue)
 * queue:'mine'    → Meera's personal queue (status in-review / awaiting-applicant) */
export const REGISTRATIONS: Registration[] = [
  { id:'REG-2026-0904', regNo:'HOSP/AP/2026/00904', name:'Trinetra Eye & ENT',      city:'Visakhapatnam', state:'AP', contact:'Dr. Lakshmi Rao',  phone:'+91 90142 77821', email:'lakshmi@trinetra.in',  plan:'core',  submitted:'4 days ago',   queue:'shared', status:'overdue', mark:'T', accent:'#0E7C66' },
  { id:'REG-2026-0941', regNo:'HOSP/MH/2026/02041', name:'Niramay Holistic Centre', city:'Pune',          state:'MH', contact:'Dr. Aniket Patil', phone:'+91 98214 33890', email:'aniket@niramay.in',    plan:'scale', submitted:'2 days ago',   queue:'shared', status:'open',    mark:'N', accent:'#5C6BC0' },
  { id:'REG-2026-0955', regNo:'HOSP/TS/2026/00541', name:'Krishna Heart Institute', city:'Hyderabad',     state:'TS', contact:'Dr. Srikanth K.',  phone:'+91 99812 70014', email:'srikanth@krishnaheart.in', plan:'scale', submitted:'1 day ago', queue:'shared', status:'open', mark:'K', accent:'#B43A2C' },
  { id:'REG-2026-0962', regNo:'HOSP/MH/2026/02055', name:'Sangam Diagnostics',      city:'Nashik',        state:'MH', contact:'Mrs. Vidya Joshi', phone:'+91 90282 14998', email:'vidya@sangamdx.in',    plan:'core',  submitted:'14 hours ago', queue:'shared', status:'open',    mark:'S', accent:'#0A7A8F' },
  { id:'REG-2026-0938', regNo:'HOSP/GJ/2026/00712', name:'Vatsalya Mother & Child', city:'Ahmedabad',     state:'GJ', contact:'Dr. Hetal Shah',   phone:'+91 90998 11200', email:'hetal@vatsalya.in',    plan:'core',  submitted:'3 days ago',   accepted:'3 days ago', queue:'other', owner:'Rahul Verma', ownerMark:'RV', ownerAccent:'#B43A2C', status:'in-review', mark:'V', accent:'#149E83' },
  { id:'REG-2026-0947', regNo:'HOSP/KA/2026/02110', name:'Orion Neuro Centre',      city:'Bengaluru',     state:'KA', contact:'Dr. Arjun Nair',   phone:'+91 90361 22118', email:'arjun@orionneuro.in',  plan:'scale', submitted:'2 days ago',   accepted:'2 days ago', queue:'other', owner:'Priya Das',   ownerMark:'PD', ownerAccent:'#5C6BC0', status:'in-review', mark:'O', accent:'#7A5BC9' },
  { id:'REG-2026-0951', regNo:'HOSP/TN/2026/00820', name:'Greenleaf Polyclinic',    city:'Coimbatore',    state:'TN', contact:'Dr. Karthik Menon', phone:'+91 90473 55021', email:'karthik@greenleafclinic.in', plan:'core', submitted:'2 days ago', accepted:'2 days ago', queue:'mine', owner:'Meera Nair', ownerMark:'MN', status:'in-review', prevStatus:'open', mark:'G', accent:'#0E7C66' },
  { id:'REG-2026-0933', regNo:'HOSP/AP/2026/00880', name:'Sahaya Cancer Care',      city:'Guntur',        state:'AP', contact:'Dr. Rama Devi',    phone:'+91 90085 41277', email:'rama@sahayacare.in',   plan:'scale', submitted:'5 days ago',   accepted:'5 days ago', queue:'mine', owner:'Meera Nair', ownerMark:'MN', status:'in-review', prevStatus:'overdue', mark:'S', accent:'#0A7A8F' },
];

/* Registration detail builder --------------------------------------------- */
/* Deterministically synthesises the full submitted-at-registration payload
 * (India-specific fields) from a small base, so every hospital + registration
 * has a complete, believable detail view without hand-authoring 15 records. */
const PLAN_INFO: Record<PlanTier, { seats: number; price: string; note: string }> = {
  pilot:      { seats: 5,  price: 'Free · 30-day trial', note: 'Evaluation tenant — converts to a paid plan after trial.' },
  core:       { seats: 40, price: '₹24,000 / month',      note: 'OPD, IPD, Pharmacy & Lab · patient portal included.' },
  scale:      { seats: 0,  price: '₹62,000 / month',      note: 'Unlimited seats · Radiology (RIS/PACS) · priority SLA.' },
  enterprise: { seats: 0,  price: 'Custom · contact us',  note: 'Multi-branch consolidation · dedicated success manager.' },
};
const FACILITY = ['Multi-speciality hospital', 'Diagnostics & imaging centre', 'Maternity & child centre', 'Eye & ENT hospital', 'Day-care surgery centre'];

function hash(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

export function buildDetail(base: {
  name: string; regNo: string; city: string; state: string;
  contact: string; email: string; phone: string; plan: PlanTier;
}): RegDetail {
  const h = hash(base.name);
  const pin = 500001 + (h % 60000);
  const beds = 18 + (h % 240);
  const est = 1996 + (h % 28);
  const seats = PLAN_INFO[base.plan].seats || 25 + (h % 90);
  const st = base.state;
  return {
    legalName: base.name + (base.name.includes('Pvt') ? '' : ' Healthcare Pvt. Ltd.'),
    facilityType: FACILITY[h % FACILITY.length],
    beds,
    established: String(est),
    addressLine: `${1 + (h % 240)}, ${['MG Road', 'Ring Road', 'Civil Lines', 'Sector 7', 'Anna Salai'][h % 5]}`,
    city: base.city,
    state: stateName(st),
    pincode: String(pin),
    gstin: `${(10 + (h % 28))}${st}${('ABCDE'[h % 5])}${1000 + (h % 8999)}${'FGHJK'[h % 5]}1Z${h % 9}`,
    pan: `${'ABCDE'[h % 5]}${'FGHJK'[(h >> 3) % 5]}${'LMNPQ'[(h >> 5) % 5]}${'PCFHT'[h % 5]}${1000 + (h % 8999)}${'ABCDE'[(h >> 7) % 5]}`,
    cea: `CEA/${st}/${base.city.slice(0, 3).toUpperCase()}/${est}/${String(100 + (h % 9000)).padStart(5, '0')}`,
    contactName: base.contact,
    designation: ['Medical Director', 'Administrator', 'Managing Director', 'Chief Medical Officer'][h % 4],
    email: base.email,
    phone: base.phone,
    altPhone: `+91 ${80000 + (h % 19999)} ${10000 + (h % 89999)}`,
    plan: base.plan,
    seats,
    price: PLAN_INFO[base.plan].price,
    planNote: PLAN_INFO[base.plan].note,
    licenses: [
      { name: 'CEA Certificate',         no: `CEA/${st}/${base.city.slice(0, 3).toUpperCase()}/${est}/${String(100 + (h % 9000)).padStart(5, '0')}`, valid: `${1 + (h % 28)} ${['Jan','Mar','Jun','Sep','Dec'][h % 5]} 2027` },
      { name: 'Drug License (Form 20B)', no: `20B-${st}-${base.city.slice(0, 3).toUpperCase()}/${10000 + (h % 89999)}`,                                  valid: `${1 + (h % 28)} ${['Feb','Apr','Jul','Oct','Nov'][h % 5]} 2026` },
      { name: 'Bio-medical Waste Auth.', no: `BMW/${st}PCB/${est}/${1000 + (h % 8999)}`,                                                                 valid: `${1 + (h % 28)} ${['Jan','May','Aug','Nov'][h % 4]} 2026` },
    ],
    documents: [
      { name: 'Registration certificate.pdf', size: `${180 + (h % 240)} KB`, kind: 'PDF' },
      { name: 'CEA certificate.pdf',           size: `${180 + ((h >> 2) % 240)} KB`, kind: 'PDF' },
      { name: 'Drug license.pdf',              size: `${120 + ((h >> 3) % 200)} KB`, kind: 'PDF' },
      { name: 'GST registration.pdf',          size: `${90 + ((h >> 4) % 160)} KB`, kind: 'PDF' },
      { name: 'Owner PAN & ID.pdf',            size: `${60 + ((h >> 5) % 140)} KB`, kind: 'PDF' },
      { name: 'Fire NOC.pdf',                  size: `${110 + ((h >> 6) % 180)} KB`, kind: 'PDF' },
    ],
  };
}

/* Licenses (compliance table — expiring / renewal-due) --------------------- */
export const LICENSES: License[] = [
  { id:'LIC-01', hosp:'Karuna Maternity Centre',  city:'Pune',       state:'MH', name:'BMW Authorisation',       no:'BMW/MPCB/2024/4421',    valid:'30 May 2026', daysLeft:2,   status:'expiring', kind:'Bio-medical waste' },
  { id:'LIC-02', hosp:"Akash Children's Clinic",  city:'Bengaluru',  state:'KA', name:'CEA Certificate',         no:'CEA/KA/BLR/2024/00781', valid:'12 Jun 2026', daysLeft:15,  status:'expiring', kind:'CEA' },
  { id:'LIC-03', hosp:'Surya Skin & Cosmetic',    city:'Kochi',      state:'KL', name:'CEA Certificate',         no:'CEA/KL/EKM/2023/00210', valid:'22 Jul 2026', daysLeft:55,  status:'expiring', kind:'CEA' },
  { id:'LIC-04', hosp:'Greenleaf Polyclinic',     city:'Coimbatore', state:'TN', name:'Drug License (Form 20B)', no:'20B-TN-CBE/05512',      valid:'11 Jul 2026', daysLeft:44,  status:'ok',       kind:'Drug license' },
  { id:'LIC-05', hosp:'Suvarna Multi-Speciality', city:'Hyderabad',  state:'TS', name:'Drug License (Form 20B)', no:'20B-AP-HYD/14782',      valid:'14 Aug 2026', daysLeft:78,  status:'ok',       kind:'Drug license' },
  { id:'LIC-06', hosp:'Krishna Heart Institute',  city:'Hyderabad',  state:'TS', name:'Drug License (Form 21)',  no:'21-TS-HYD/22014',       valid:'05 Dec 2026', daysLeft:161, status:'ok',       kind:'Drug license' },
];

/* Activity timeline (multi-agent audit log) -------------------------------- */
export const ACTIVITY: ActivityEvent[] = [
  { id:'EV-01', time:'2 min ago',  kind:'ok',     category:'credential',   actor:'MEERA NAIR',   title:'Credentials issued · <b>Suvarna Multi-Speciality</b>',                                  detail:'Tenant VX-T-00128 activated · login links emailed to priya@suvarnahospital.in' },
  { id:'EV-02', time:'18 min ago', kind:'ok',     category:'approval',     actor:'RAHUL VERMA',  title:'<b>Rahul Verma</b> accepted <b>Vatsalya Mother & Child</b> from the shared queue',      detail:"Moved to Rahul's approval queue · REG-2026-0938" },
  { id:'EV-03', time:'46 min ago', kind:'warn',   category:'license',      actor:'IMRAN SHEIKH', title:"License expiring · <b>Akash Children's Clinic</b>",                                      detail:'CEA Certificate expires in 15 days — reminder email sent to admin' },
  { id:'EV-04', time:'1 h 12 min', kind:'ok',     category:'registration', actor:'SYSTEM',       title:'New registration submitted · <b>Krishna Heart Institute</b>',                            detail:'6 documents uploaded · added to the shared approval queue' },
  { id:'EV-05', time:'2 h 40 min', kind:'warn',   category:'approval',     actor:'MEERA NAIR',   title:'<b>Meera Nair</b> requested additional info · <b>Sahaya Cancer Care</b>',                detail:'AERB radiation-safety clearance requested · re-submit link emailed' },
  { id:'EV-06', time:'3 h 02 min', kind:'danger', category:'suspension',   actor:'BILLING BOT',  title:'Tenant suspended · <b>Surya Skin & Cosmetic</b>',                                        detail:'Reason: payment failure (3 attempts) · grace period 7 days' },
  { id:'EV-07', time:'5 h 18 min', kind:'ok',     category:'approval',     actor:'PRIYA DAS',    title:'<b>Priya Das</b> accepted <b>Orion Neuro Centre</b> from the shared queue',              detail:"Moved to Priya's approval queue · REG-2026-0947" },
  { id:'EV-08', time:'Yesterday',  kind:'ok',     category:'plan',         actor:'SARA THOMAS',  title:'Plan changed · <b>Citadel Diagnostics</b>',                                              detail:'Core → Scale · effective immediately · prorated invoice generated' },
];

/* Application modules (platform-wide capability catalogue) ------------------ */
export const MODULES: ModuleCard[] = [
  { id:'opd',     name:'OPD & Appointments', category:'Clinical',    icon:'user',     desc:'Token queues, doctor scheduling, consultation notes and e-prescriptions.', tenants:128, adoption:94, available:true  },
  { id:'ipd',     name:'IPD & Wards',        category:'Clinical',    icon:'hospital', desc:'Admissions, bed management, nursing charts and discharge summaries.',      tenants:86,  adoption:71, available:true  },
  { id:'pharm',   name:'Pharmacy',           category:'Clinical',    icon:'pill',     desc:'Drug inventory, dispensing, batch & expiry tracking, supplier orders.',    tenants:103, adoption:82, available:true  },
  { id:'lab',     name:'Laboratory (LIS)',   category:'Diagnostics', icon:'beaker',   desc:'Sample tracking, analyser integration and validated result reporting.',    tenants:97,  adoption:78, available:true  },
  { id:'rad',     name:'Radiology (RIS/PACS)', category:'Diagnostics', icon:'scan',   desc:'Imaging orders, DICOM viewer and structured reporting.',                   tenants:54,  adoption:48, available:true  },
  { id:'billing', name:'Billing & Claims',   category:'Revenue',     icon:'billing',  desc:'Invoicing, package billing, TPA & insurance claim management.',             tenants:124, adoption:91, available:true  },
  { id:'portal',  name:'Patient Portal & App', category:'Engagement', icon:'users',   desc:'Patient self-service, reports download, tele-consult and reminders.',       tenants:71,  adoption:63, available:true  },
  { id:'analytics', name:'Analytics & Insights', category:'Platform', icon:'chart',   desc:'Operational dashboards, revenue analytics and clinical KPIs.',              tenants:39,  adoption:31, available:false },
];

/* Billing & plans ---------------------------------------------------------- */
export const BILLING_KPIS: BillingKpi[] = [
  { label:'Monthly recurring rev.', value:'₹18.4L', sub:'vs May',          trend:'up', trendText:'▲ 9.2%', icon:'billing' },
  { label:'Paying tenants',         value:'109',    sub:'19 in trial',     icon:'hospital' },
  { label:'Failed payments',        value:'1',      sub:'Surya Skin · grace 7d', icon:'warning' },
  { label:'Trials converting',      value:'3',      sub:'this week',       icon:'reset' },
];
export const PLAN_CARDS: PlanCard[] = [
  { id:'pilot',      name:'Pilot',      price:'Free',    cadence:'30-day trial', tagline:'Evaluate Vexoo end-to-end',  hospitals:19, features:['OPD & Appointments','Up to 5 staff seats','Email support','Single location'] },
  { id:'core',       name:'Core',       price:'₹24,000', cadence:'/month',       tagline:'For growing single hospitals', hospitals:71, popular:true, features:['Everything in Pilot','IPD, Pharmacy & Lab','Up to 40 staff seats','Patient portal'] },
  { id:'scale',      name:'Scale',      price:'₹62,000', cadence:'/month',       tagline:'Multi-department hospitals', hospitals:32, features:['Everything in Core','Radiology (RIS/PACS)','Unlimited seats','Priority support & SLA'] },
  { id:'enterprise', name:'Enterprise', price:'Custom',  cadence:'/contact us',  tagline:'Hospital groups & chains',   hospitals:6,  features:['Everything in Scale','Multi-branch consolidation','Dedicated success manager','Custom integrations & SSO'] },
];
export const INVOICES: Invoice[] = [
  { id:'INV-2026-2841', hospital:'Citadel Diagnostics',      plan:'scale', amount:'₹62,000',   date:'24 Jun 2026', status:'paid' },
  { id:'INV-2026-2840', hospital:'Lotus Eye Hospital',       plan:'scale', amount:'₹62,000',   date:'22 Jun 2026', status:'paid' },
  { id:'INV-2026-2839', hospital:'Suvarna Multi-Speciality', plan:'core',  amount:'₹2,88,000', date:'20 Jun 2026', status:'paid' },
  { id:'INV-2026-2838', hospital:'Surya Skin & Cosmetic',    plan:'core',  amount:'₹24,000',   date:'18 Jun 2026', status:'failed' },
];

/* Settings ----------------------------------------------------------------- */
export const SETTINGS_PROFILE: SettingsProfile = {
  fullName: 'Meera Nair',
  role: 'Approvals Agent · L2',
  email: 'meera.nair@vexoo.in',
  phone: '+91 90000 12345',
  tz: 'Asia/Kolkata (IST)',
};

/* Team & roles tab — agents across the support organisation. */
export const TEAM_MEMBERS: TeamMember[] = [
  { name:'Aisha Khan',   role:'Approvals Lead',     email:'aisha.khan@vexoo.in',   presence:'online',  mark:'AK', accent:'#454C4B' },
  { name:'Rahul Verma',  role:'Approvals Agent · L2', email:'rahul.verma@vexoo.in', presence:'online',  mark:'RV', accent:'#5C6BC0' },
  { name:'Priya Das',    role:'Approvals Agent · L1', email:'priya.das@vexoo.in',   presence:'online',  mark:'PD', accent:'#B43A2C' },
  { name:'Imran Sheikh', role:'Compliance Agent',   email:'imran.sheikh@vexoo.in', presence:'away',    mark:'IS', accent:'#0A7A8F' },
  { name:'Sara Thomas',  role:'Billing Agent',      email:'sara.thomas@vexoo.in',  presence:'offline', mark:'ST', accent:'#7A5BC9' },
];
export const TEAM_TOTAL = '1,024';

/* Approval rules tab — how cases flow through the shared queue. */
export const APPROVAL_RULES: ApprovalRules = {
  autoReturn: 'After 24 hours',
  maxOpen: 10,
  slaTarget: '4 hours',
  twoPerson: false,
};
export const AUTO_RETURN_OPTIONS = ['After 12 hours', 'After 24 hours', 'After 48 hours', 'Never'];
export const SLA_OPTIONS = ['2 hours', '4 hours', '8 hours', '24 hours'];

/* Security tab — protect your account. */
export const SECURITY_INFO: SecurityInfo = {
  twoFactor: true,
  twoFactorVia: 'authenticator app',
  passwordChanged: '38 days ago',
  sessions: '2 devices · Chrome on macOS, Vexoo mobile on iOS',
};

/* Sidebar nav -------------------------------------------------------------- */
/** Shared-queue size drives the hot Approvals badge (matches the reference 4). */
const SHARED_QUEUE = REGISTRATIONS.filter(r => r.queue === 'shared').length;

export const NAV_OPERATIONS: NavItem[] = [
  { id:'dashboard', label:'Dashboard' },
  { id:'hospitals', label:'Hospitals', count: HOSPITALS.length },
  { id:'approvals', label:'Approvals', count: SHARED_QUEUE, hot: SHARED_QUEUE > 0 },
  { id:'licenses',  label:'Licenses',  count: LICENSES.length },
  { id:'activity',  label:'Activity' },
];
export const NAV_PLATFORM: NavItem[] = [
  { id:'analytics',  label:'Analytics' },
  { id:'billing',  label:'Billing & plans' },
  { id:'settings', label:'Settings' },
];

/* Breadcrumb tail label per view ------------------------------------------- */
export const CRUMB_LABELS: Record<ViewId, string> = {
  dashboard: 'Dashboard', hospitals: 'Hospitals', approvals: 'Approvals',
  licenses: 'Licenses', activity: 'Activity', analytics: 'Analytics',
  billing: 'Billing & plans', settings: 'Settings',
};

/* Per-view page header (the four operational list views) ------------------- */
export const PAGE_HEAD: Record<Exclude<MainTab, 'dashboard'>, PageHead> = {
  hospitals: {
    eyebrow: 'Tenant directory',
    title: 'Hospitals on', em: 'Vexoo',
    sub: 'Every live hospital on the platform. Open any hospital to see the full set of details submitted at registration.',
    export: true,
  },
  approvals: {
    eyebrow: 'Approval workflow',
    title: 'Hospital', em: 'approvals',
    sub: 'The shared queue is visible to every support agent. Accept a hospital to move it into your personal queue — only then can you review, approve or reject it.',
  },
  licenses: {
    eyebrow: 'Compliance',
    title: 'Licenses &', em: 'renewals',
    sub: 'Hospital licenses that are expiring soon or due for renewal. Send the hospital admin a reminder to renew before the deadline.',
  },
  activity: {
    eyebrow: 'Audit log',
    title: 'Platform', em: 'activity',
    sub: 'Every approval, credential issue, suspension and license action across the support team.',
  },
};

/* Dashboard quick actions (one tile per sidebar destination) --------------- */
export const QUICK_ACTIONS: QuickAction[] = [
  { id:'hospitals', label:'Hospitals',       desc:'Browse the tenant directory' },
  { id:'approvals', label:'Approvals',       desc:'Shared & personal queues' },
  { id:'licenses',  label:'Licenses',        desc:'Renewals & reminders' },
  { id:'activity',  label:'Activity',        desc:'Platform audit log' },
  { id:'analytics',  label:'Analytics',        desc:'Platform intelligence & metrics' },
  { id:'billing',   label:'Billing & plans', desc:'Tiers, tenants & invoices' },
  { id:'settings',  label:'Settings',        desc:'Profile & team access' },
];

/* KPI strip (Dashboard) ---------------------------------------------------- */
export const KPIS: KPIItem[] = [
  { label:'Active tenants',         value:String(HOSPITALS.filter(h => h.status === 'active').length), accent:'var(--mineral-100)',   trend:'up', trendText:'▲ 6', deltaText:'this month' },
  { label:'Pending approval',       value:String(SHARED_QUEUE),                                        accent:'var(--amber-bg)',                                      deltaText:'1 overdue · oldest 4d' },
  { label:'In trial',               value:String(HOSPITALS.filter(h => h.status === 'trial').length),  accent:'#F0EAFA',                                               deltaText:'converting this week' },
  { label:'Licenses expiring <30d', value:String(LICENSES.filter(l => l.daysLeft < 30).length),        accent:'var(--signal-red-bg)', trend:'down', trendText:'▲ 1',  deltaText:'from last week' },
];

/* Signed-in support agent (mock) ------------------------------------------- */
/** Export name kept as FOUNDER for import stability across components. */
export const FOUNDER = {
  name: 'Meera Nair',
  role: 'Approvals Agent · L2',
  email: 'meera@vexoo.in',
  phone: '+91 99887 76655',
  access: 'Approvals · L2',
};

/** Items in the agent's personal approval queue (topbar profile badge). */
export const MY_QUEUE_COUNT = REGISTRATIONS.filter(r => r.queue === 'mine').length;
