/**
 * analyticsData.ts — mock data for the Super-Admin "Platform analytics" screen.
 *
 * Replaces the old Modules catalogue. Four tabs of platform intelligence —
 * Overview · Engagement · Operations · Growth & revenue — faithful to the
 * reference dashboards. All figures are seed data; wire each block to its real
 * endpoint later (search for TODO(backend) in Analytics.tsx).
 *
 * Numbers carry a `range` multiplier convention: where a metric is range-aware
 * (7d / 30d / 90d), the screen scales the base (30d) figure. Static cards keep
 * their literal display string.
 */

export type RangeId = '7d' | '30d' | '90d';
export type AnalyticsTab = 'overview' | 'engagement' | 'operations' | 'growth';

export interface AnTab { id: AnalyticsTab; label: string; }
export const AN_TABS: AnTab[] = [
  { id: 'overview',    label: 'Overview' },
  { id: 'engagement',  label: 'Engagement' },
  { id: 'operations',  label: 'Operations' },
  { id: 'growth',      label: 'Growth & revenue' },
];

export const AN_RANGES: { id: RangeId; label: string }[] = [
  { id: '7d',  label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
];

/* A KPI tile. `icon` keys into Analytics.tsx's icon map. `tone` colours the
   delta + icon chip. `detail` rows feed the click-through drawer. */
export interface AnKpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: 'up' | 'down' | 'flat';
  icon: string;
  detail: [string, string][];
}

/* ─────────────── OVERVIEW ─────────────── */
export const OV_KPIS: AnKpi[] = [
  { id:'active-hospitals', label:'Active hospitals', value:'134', delta:'▲ 4.7% · +6 this month', tone:'up', icon:'hospital',
    detail:[['Active','134'],['Onboarding','7'],['Trial','12'],['Suspended','3'],['Net new (30d)','+6']] },
  { id:'dau', label:'Daily active users', value:'4,820', delta:'▲ 8.1% · staff + patients', tone:'up', icon:'users',
    detail:[['Staff','3,800'],['Patients','1,020'],['Peak hour','10:00–11:00'],['Vs yesterday','+361']] },
  { id:'events-today', label:'Events today', value:'41,431', delta:'▲ 12.4% · all role apps', tone:'up', icon:'activity',
    detail:[['Clinical','14,090'],['Pharmacy','7,460'],['Billing','6,630'],['Lab & radiology','6,210'],['Auth & admin','2,480']] },
  { id:'mrr', label:'Monthly recurring rev.', value:'₹18.4L', delta:'▲ 9.2% · 109 paying', tone:'up', icon:'billing',
    detail:[['Scale plan','₹8.5L'],['Core plan','₹7.4L'],['Enterprise','₹2.5L'],['Paying tenants','109'],['ARPA','₹16,880']] },
  { id:'new-regs', label:'New registrations · 30d', value:'23', delta:'▲ 15% · 41 started', tone:'up', icon:'file',
    detail:[['Started','41'],['Submitted','34'],['Approved','27'],['Activated','25'],['Conversion','54%']] },
  { id:'uptime', label:'Platform uptime', value:'99.97%', delta:'SLA met · 30-day rolling', tone:'flat', icon:'shield',
    detail:[['SLA target','99.9%'],['Incidents (30d)','1'],['Mean time to recover','12 min'],['Last incident','19 days ago']] },
];

/** Daily platform-event totals (last 30 days). Drives the area chart. */
export const OV_EVENTS_SERIES: number[] = [
  18200, 17600, 16100, 14900, 16800, 19400, 22100, 20500, 18800, 17200,
  15600, 14100, 13800, 15200, 18100, 21300, 24600, 27800, 30900, 33200,
  34800, 36100, 35200, 33600, 31100, 29400, 30200, 32800, 34100, 35600,
];
export const OV_EVENTS_TOTAL = '8,89,468';
export const OV_EVENTS_PEAK = 'peak 36.1k/day';

export interface DonutSlice { label: string; pct: number; color: string; }
export const OV_CATEGORY: DonutSlice[] = [
  { label:'OPD & IPD clinical', pct:34, color:'#0E7C66' },
  { label:'Pharmacy',          pct:18, color:'#149E83' },
  { label:'Billing & payments', pct:16, color:'#C68A1F' },
  { label:'Lab & radiology',   pct:15, color:'#3F5165' },
  { label:'Patient app',       pct:11, color:'#5C6BC0' },
  { label:'Auth & admin',      pct:6,  color:'#9AA09E' },
];
export const OV_CATEGORY_CENTER = '38.4k';

export interface FunnelStep { label: string; value: number; note: string; }
export const OV_FUNNEL: FunnelStep[] = [
  { label:'Registration started', value:41, note:'entry point' },
  { label:'Documents submitted',  value:34, note:'83% from previous · 83% of all' },
  { label:'Approved by support',  value:27, note:'79% from previous · 66% of all' },
  { label:'Activated · first login', value:25, note:'93% from previous · 61% of all' },
  { label:'Active · using daily',  value:22, note:'88% from previous · 54% of all' },
];

export interface StreamItem { tag: string; tagColor: string; text: string; ago: string; }
export const OV_STREAM: StreamItem[] = [
  { tag:'BILLING',   tagColor:'#C68A1F', text:'Invoice INV-2026-2841 paid · Citadel Diagnostics', ago:'just now' },
  { tag:'DOCTOR',    tagColor:'#0A7A8F', text:'e-Prescription issued · Dr. Srikanth K · Krishna Heart', ago:'3s ago' },
  { tag:'LAB',       tagColor:'#3F5165', text:'Lab result published · CBC panel · Suvarna Multi-Speciality', ago:'7s ago' },
  { tag:'RECEPTION', tagColor:'#0E7C66', text:'Appointment booked · token #214 · Aarogyam Wellness', ago:'11s ago' },
  { tag:'PATIENT',   tagColor:'#5C6BC0', text:'Patient app login · Lotus Eye Hospital', ago:'15s ago' },
  { tag:'PHARMACY',  tagColor:'#149E83', text:'Medicine dispensed · Pharmacy · Karuna Maternity', ago:'19s ago' },
];

export interface HealthStat { label: string; value: string; sub: string; }
export const OV_HEALTH: HealthStat[] = [
  { label:'API P95 latency',  value:'142 ms',   sub:'target < 300 ms' },
  { label:'Error rate (5xx)', value:'0.04%',    sub:'18 of 41.2k req' },
  { label:'Background jobs',  value:'2,140 / hr', sub:'0 stuck · queue clear' },
  { label:'DB storage',       value:'68%',      sub:'1.4 TB of 2 TB' },
];

/* ─────────────── ENGAGEMENT ─────────────── */
export const EN_KPIS: AnKpi[] = [
  { id:'daily-active', label:'Daily active', value:'4,820', delta:'staff + patients · 24h', tone:'up', icon:'users',
    detail:[['Staff','3,800'],['Patients','1,020'],['New today','142'],['Returning','4,678']] },
  { id:'weekly-active', label:'Weekly active', value:'9,640', delta:'7-day unique', tone:'up', icon:'users',
    detail:[['Staff','6,900'],['Patients','2,740'],['Vs last week','+6.3%']] },
  { id:'monthly-active', label:'Monthly active', value:'14,210', delta:'30-day unique', tone:'up', icon:'users',
    detail:[['Staff','9,310'],['Patients','4,900'],['Vs last month','+11%']] },
  { id:'stickiness', label:'Stickiness', value:'34%', delta:'DAU / MAU ratio', tone:'flat', icon:'activity',
    detail:[['DAU','4,820'],['MAU','14,210'],['Benchmark','> 20% healthy']] },
];

export const EN_SESSIONS_SERIES: number[] = [
  3200, 3400, 3900, 4600, 5400, 6100, 6500, 6400, 6000, 5600, 5900,
];
export const EN_PLATFORM: DonutSlice[] = [
  { label:'Desktop / web', pct:58, color:'#0E7C66' },
  { label:'Android app',   pct:31, color:'#149E83' },
  { label:'iOS app',       pct:11, color:'#5C6BC0' },
];
export const EN_PLATFORM_CENTER = '48,210';

export interface BarRow { label: string; value: number; color: string; }
export const EN_STAFF_ROLES: BarRow[] = [
  { label:'Reception / front desk', value:1420, color:'#0E7C66' },
  { label:'Doctors',                value:1180, color:'#0E7C66' },
  { label:'Nursing / wards',        value:980,  color:'#149E83' },
  { label:'Pharmacy',               value:640,  color:'#C68A1F' },
  { label:'Billing',                value:520,  color:'#3F5165' },
  { label:'Lab & radiology',        value:410,  color:'#5C6BC0' },
];

export interface PatientStat { value: string; label: string; }
export const EN_PATIENT: PatientStat[] = [
  { value:'3,900',  label:'App sessions · today' },
  { value:'1,020',  label:'Reports downloaded' },
  { value:'96',     label:'Teleconsults started' },
  { value:'48,210', label:'Total installs' },
];

/** 7 rows (Mon–Sun) × 24 cols (hour-of-day) intensity 0..1, for the heatmap. */
export const EN_HEATMAP: number[][] = (() => {
  const rows: number[][] = [];
  const dayWeight = [1, 1, 0.98, 0.95, 0.9, 0.55, 0.4]; // Mon..Sun
  for (let d = 0; d < 7; d++) {
    const r: number[] = [];
    for (let h = 0; h < 24; h++) {
      // clinic rhythm: low overnight, peaks ~10–13 and ~17–19
      const m = Math.exp(-Math.pow(h - 11, 2) / 18) + 0.7 * Math.exp(-Math.pow(h - 18, 2) / 10);
      r.push(Math.min(1, Math.max(0.05, m * dayWeight[d])));
    }
    rows.push(r);
  }
  return rows;
})();
export const EN_HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export interface ActiveHospital {
  name: string; city: string; users: number; events: string; mark: string; accent: string; trend: number[];
}
export const EN_ACTIVE_HOSPITALS: ActiveHospital[] = [
  { name:'Suvarna Multi-Speciality', city:'Hyderabad', users:212, events:'4,120', mark:'S', accent:'#0E7C66', trend:[3,4,4,5,6,7,8] },
  { name:'Krishna Heart Institute',  city:'Hyderabad', users:188, events:'3,680', mark:'K', accent:'#B43A2C', trend:[6,5,4,5,4,5,5] },
  { name:'Aarogyam Wellness',        city:'Vijayawada', users:164, events:'3,210', mark:'A', accent:'#149E83', trend:[2,3,3,4,4,5,6] },
  { name:'Lotus Eye Hospital',       city:'Mumbai',    users:151, events:'2,740', mark:'L', accent:'#5C6BC0', trend:[4,4,5,5,5,6,6] },
  { name:'Citadel Diagnostics',      city:'Chennai',   users:97,  events:'2,510', mark:'C', accent:'#3F5165', trend:[3,3,3,4,4,4,5] },
];

/* ─────────────── OPERATIONS ─────────────── */
export const OP_KPIS: AnKpi[] = [
  { id:'actions-today', label:'Actions · today', value:'24.9k', delta:'18 tracked event types', tone:'up', icon:'activity',
    detail:[['Clinical','9.1k'],['Front desk','5.9k'],['Pharmacy','3.5k'],['Billing','3.7k'],['Lab & imaging','2.7k']] },
  { id:'consultations', label:'Consultations · today', value:'1,690', delta:'across 94 hospitals', tone:'up', icon:'doctor',
    detail:[['OPD','1,410'],['IPD rounds','184'],['Teleconsults','96'],['Avg duration','11 min']] },
  { id:'bills-today', label:'Bills raised · today', value:'1,980', delta:'₹52.1L value processed', tone:'up', icon:'billing',
    detail:[['Paid','1,760'],['Pending','220'],['Avg bill','₹2,632'],['Refunds','14']] },
  { id:'lab-today', label:'Lab + imaging · today', value:'974', delta:'760 lab · 214 imaging', tone:'up', icon:'beaker',
    detail:[['Lab orders','760'],['Imaging studies','214'],['Critical flags','7'],['Avg TAT','3.2h']] },
];

export interface LedgerRow {
  action: string; role: string; today: string; d7: string; d30: string; trend: number[]; delta: string; up: boolean;
}
export const OP_LEDGER: LedgerRow[] = [
  { action:'Appointment booked',  role:'Reception', today:'2,140', d7:'14,120', d30:'58,900', trend:[4,5,5,6,7,8,9], delta:'▲ 11%', up:true },
  { action:'Patient registered',  role:'Reception', today:'870',   d7:'5,980',  d30:'25,130', trend:[5,5,6,6,6,7,7], delta:'▲ 4%',  up:true },
  { action:'Consultation completed', role:'Doctor', today:'1,690', d7:'11,240', d30:'47,800', trend:[6,6,7,7,8,8,9], delta:'▲ 9%',  up:true },
  { action:'e-Prescription issued', role:'Doctor',  today:'1,510', d7:'10,080', d30:'42,600', trend:[5,6,7,7,8,9,9], delta:'▲ 13%', up:true },
  { action:'Vitals recorded',     role:'Nursing',   today:'2,310', d7:'15,600', d30:'64,200', trend:[7,7,8,8,8,9,9], delta:'▲ 4%',  up:true },
  { action:'Patient admitted (IPD)', role:'Nursing', today:'142',  d7:'960',    d30:'4,010',  trend:[3,3,3,4,4,4,5], delta:'▲ 2%',  up:true },
  { action:'Patient discharged',  role:'Nursing',   today:'128',   d7:'910',    d30:'3,870',  trend:[3,3,4,4,4,4,5], delta:'▲ 1%',  up:true },
  { action:'Lab order placed',    role:'Doctor',    today:'880',   d7:'5,840',  d30:'24,300', trend:[5,5,6,6,6,7,7], delta:'▲ 5%',  up:true },
  { action:'Lab result published', role:'Lab tech', today:'760',   d7:'5,210',  d30:'22,100', trend:[4,5,5,6,6,7,7], delta:'▲ 6%',  up:true },
  { action:'Imaging study reported', role:'Radiology', today:'214', d7:'1,480', d30:'6,200',  trend:[3,3,4,4,4,5,5], delta:'▲ 3%',  up:true },
  { action:'Medicine dispensed',  role:'Pharmacy',  today:'1,240', d7:'8,410',  d30:'35,200', trend:[6,6,7,7,7,8,8], delta:'▲ 7%',  up:true },
  { action:'Invoice generated',   role:'Billing',   today:'1,980', d7:'13,720', d30:'55,430', trend:[6,7,7,8,8,9,9], delta:'▲ 9%',  up:true },
  { action:'Payment collected',   role:'Billing',   today:'1,760', d7:'11,930', d30:'49,800', trend:[6,6,7,8,8,9,9], delta:'▲ 12%', up:true },
  { action:'Teleconsult started', role:'Doctor',    today:'96',    d7:'640',    d30:'2,710',  trend:[3,4,4,5,6,7,8], delta:'▲ 22%', up:true },
  { action:'Report downloaded',   role:'Patient',   today:'1,020', d7:'6,800',  d30:'28,420', trend:[5,6,6,7,7,8,8], delta:'▲ 14%', up:true },
  { action:'Patient app login',   role:'Patient',   today:'3,900', d7:'26,120', d30:'1,08,200', trend:[7,7,8,8,9,9,9], delta:'▲ 16%', up:true },
  { action:'Staff login',         role:'All staff', today:'4,180', d7:'24,900', d30:'1,04,600', trend:[8,8,8,9,9,9,9], delta:'▲ 3%',  up:true },
  { action:'Password reset',      role:'All staff', today:'38',    d7:'248',    d30:'1,042',  trend:[5,4,4,3,4,3,3], delta:'▼ 4%',  up:false },
];

export const OP_MODULE_ADOPTION: BarRow[] = [
  { label:'OPD & Appointments', value:94, color:'#0E7C66' },
  { label:'IPD & Wards',        value:71, color:'#0E7C66' },
  { label:'Pharmacy',           value:82, color:'#0E7C66' },
  { label:'Laboratory (LIS)',   value:78, color:'#0E7C66' },
  { label:'Radiology (RIS/PACS)', value:46, color:'#0E7C66' },
  { label:'Billing & Claims',   value:91, color:'#0E7C66' },
  { label:'Patient Portal & App', value:63, color:'#0E7C66' },
  { label:'Analytics & Insights', value:31, color:'#9AA09E' },
];

export const OP_ROLE_ACTIONS: BarRow[] = [
  { label:'Patient',   value:4920, color:'#B43A2C' },
  { label:'All staff', value:4210, color:'#9AA09E' },
  { label:'Doctor',    value:4170, color:'#0E7C66' },
  { label:'Reception', value:3740, color:'#149E83' },
  { label:'Nursing',   value:2580, color:'#0A7A8F' },
  { label:'Pharmacy',  value:1240, color:'#C68A1F' },
  { label:'Lab tech',  value:760,  color:'#5C6BC0' },
  { label:'Radiology', value:214,  color:'#3F5165' },
];

/* ─────────────── GROWTH & REVENUE ─────────────── */
export const GR_KPIS: AnKpi[] = [
  { id:'mrr-growth', label:'MRR', value:'₹18.4L', delta:'▲ 8.2% vs May', tone:'up', icon:'billing',
    detail:[['This month','₹18.4L'],['Last month','₹17.0L'],['Net add','₹1.4L'],['Churn','₹0.3L']] },
  { id:'net-new', label:'Net new tenants · 30d', value:'+21', delta:'24 added · 3 churned', tone:'up', icon:'hospital',
    detail:[['Added','24'],['Churned','3'],['Reactivated','2'],['Net','+21']] },
  { id:'approval-rate', label:'Approval rate', value:'82%', delta:'92% within SLA', tone:'flat', icon:'check',
    detail:[['Approved','27'],['Rejected','6'],['Needs info','8'],['Within SLA','92%']] },
  { id:'aht', label:'Avg handling time', value:'2.8h', delta:'target 4h · within', tone:'up', icon:'activity',
    detail:[['Fastest agent','2.1h'],['Slowest','3.4h'],['Median','2.7h'],['SLA target','4.0h']] },
];

export const GR_MRR_SERIES: number[] = [
  9.1, 9.6, 10.2, 10.9, 11.5, 12.1, 12.8, 13.4, 14.2, 16.1, 17.0, 18.4,
];
export const GR_REVENUE_PLAN: DonutSlice[] = [
  { label:'Scale · ₹8.5L',      pct:46, color:'#0E7C66' },
  { label:'Core · ₹7.4L',       pct:40, color:'#149E83' },
  { label:'Enterprise · ₹2.5L', pct:12, color:'#5C6BC0' },
];
export const GR_REVENUE_CENTER = '₹18.4L';

export interface MonthBar { month: string; added: number; churned: number; }
export const GR_NEW_CHURN: MonthBar[] = [
  { month:'Jan', added:14, churned:2 },
  { month:'Feb', added:17, churned:3 },
  { month:'Mar', added:15, churned:2 },
  { month:'Apr', added:19, churned:3 },
  { month:'May', added:22, churned:2 },
  { month:'Jun', added:24, churned:3 },
];

export const GR_BY_STATE: BarRow[] = [
  { label:'Maharashtra',    value:31, color:'#0E7C66' },
  { label:'Telangana',      value:24, color:'#0E7C66' },
  { label:'Karnataka',      value:22, color:'#0E7C66' },
  { label:'Tamil Nadu',     value:18, color:'#149E83' },
  { label:'Andhra Pradesh', value:17, color:'#149E83' },
  { label:'Gujarat',        value:11, color:'#3F5165' },
  { label:'Kerala',         value:9,  color:'#3F5165' },
  { label:'Others',         value:2,  color:'#9AA09E' },
];

export interface LeaderRow { name: string; approved: number; avg: string; mark: string; accent: string; }
export const GR_LEADERBOARD: LeaderRow[] = [
  { name:'Aisha Khan',   approved:48, avg:'2.1h', mark:'AK', accent:'#0E7C66' },
  { name:'Rahul Verma',  approved:41, avg:'2.6h', mark:'RV', accent:'#5C6BC0' },
  { name:'Meera Nair',   approved:39, avg:'2.8h', mark:'MN', accent:'#149E83' },
  { name:'Priya Das',    approved:33, avg:'3.0h', mark:'PD', accent:'#B43A2C' },
  { name:'Imran Shaikh', approved:27, avg:'3.4h', mark:'IS', accent:'#3F5165' },
];
