// ============================================================================
//  @vexoo/shared/customer — domain types
//  Single source of truth for every customer-facing entity, shared by the
//  customer web portal and the customer mobile app. When the backend lands,
//  these are the contracts it must match.
// ============================================================================

export type ScreenId =
  | 'home' | 'appts' | 'records' | 'meds' | 'lab'
  | 'messages' | 'billing' | 'insurance' | 'vax' | 'family';

export type ApptTab = 'upcoming' | 'past' | 'book';
export type Slot    = 'morning' | 'noon' | 'night';
export type FlagType = 'normal' | 'high' | 'low';
export type MedStatus = 'Active' | 'Completed';
export type VaxStatus = 'Up to date' | 'Due soon' | 'Overdue';

// ── Core domain types ────────────────────────────────────────────────────────

export interface Member {
  name:  string;
  rel:   string;
  id:    string;
  blood: string;
  age:   number;
  dot:   string;
}

export interface AddedMember {
  id:        string;
  name:      string;
  relation:  string;
  age:       number | null;
  sex:       string;
  blood:     string;
  condition: string;
}

export interface MemberOption {
  id:  string;
  name: string;
  rel: string;
}

export interface Med {
  name:      string;
  dose:      string;
  purpose:   string;
  icon:      string;
  schedule:  Record<Slot, 'taken' | 'todo' | 'off'>;
  remaining: number;
  total:     number;
  refill:    string;
  status:    MedStatus;
}

export interface RefillItem {
  name: string;
  dose: string;
  qty:  number;
}

export interface LabRow {
  k:    string;
  v:    string;
  u:    string;
  ref:  string;
  flag: FlagType;
}

export interface Lab {
  name:   string;
  date:   string;
  doctor: string;
  status: string;
  color:  string;
  rows:   LabRow[];
}

export interface Invoice {
  id:     string;
  date:   string;
  desc:   string;
  amount: string;
  method: string;
  status: string;
}

export interface ChatMsg {
  from: 'doctor' | 'patient';
  text: string;
}

export interface Thread {
  id:      string;
  name:    string;
  spec:    string;
  preview: string;
  time:    string;
  unread:  boolean;
  msgs:    ChatMsg[];
}

export interface VaxEntry {
  name:   string;
  last:   string;
  next:   string;
  status: VaxStatus;
}

export interface Visit {
  date:    string;
  title:   string;
  doctor:  string;
  node:    string;
  color:   string;
  bg:      string;
  summary: string;
}

export interface Folder {
  name:  string;
  count: number;
  meta:  string;
  ic:    string;
  color: string;
  bg:    string;
}

export interface FolderDoc {
  name: string;
  date: string;
  type: string;
}

export interface Trend {
  key:    string;
  label:  string;
  ic:     string;
  color:  string;
  unit:   string;
  target: string;
  labels: string[];
  data:   number[];
}

// ── Dashboard / UI types ─────────────────────────────────────────────────────

export interface Stat {
  ic:    string;
  color: string;
  bg:    string;
  val:   string;
  unit:  string;
  label: string;
  sub:   string;
  delta: string;
  up:    boolean;
  good:  boolean;
}

export interface QuickAction {
  ic:    string;
  color: string;
  bg:    string;
  label: string;
  to:    ScreenId;
}

export interface WellnessBar {
  ic:    string;
  label: string;
  val:   string;
  pct:   number;
  color: string;
}

export interface Insight {
  ic:    string;
  color: string;
  bg:    string;
  text:  string;
}

export interface Alert {
  ic:     string;
  color:  string;
  bg:     string;
  border: string;
  title:  string;
  time:   string;
  text:   string;
  cta:    string;
}

export interface FeedItem {
  ic:    string;
  color: string;
  bg:    string;
  text:  string;
  time:  string;
}

export interface AdviceItem {
  ic:     string;
  title:  string;
  detail: string;
}

export interface UpcomingAppt {
  dd:     string;
  mo:     string;
  day:    string;
  type:   string;
  doctor: string;
  dept:   string;
  time:   string;
  room:   string;
  mode:   string;
  status: string;
  sColor: string;
  sBg:    string;
}

export interface PastAppt {
  date:    string;
  doctor:  string;
  type:    string;
  summary: string;
}

export interface ChangedMetric {
  label:  string;
  icon:   string;
  from:   string;
  to:     string;
  status: string;
  color:  string;
  bg:     string;
}

export interface Goal {
  ic:    string;
  label: string;
  val:   string;
  meta:  string;
  pct:   number;
  color: string;
}

export interface Achievement {
  ic:     string;
  title:  string;
  desc:   string;
  earned: boolean;
}

export interface Tip {
  ic:    string;
  color: string;
  bg:    string;
  title: string;
  body:  string;
}

export interface NavItem {
  id:    ScreenId;
  label: string;
  ic:    string;
  badge?: number;
}

export interface Notification {
  ic:    string;
  color: string;
  bg:    string;
  title: string;
  text:  string;
  time:  string;
}

export interface SearchResult {
  label: string;
  type:  string;
  ic:    string;
  to:    ScreenId;
}

// ── Shared view contracts ────────────────────────────────────────────────────
// Prop interfaces from the web portal are intentionally not carried over; each
// platform declares its own. Only the data contracts live here.
