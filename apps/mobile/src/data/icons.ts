/**
 * ============================================================================
 *  Icon resolution — Vexoo Mobile
 * ============================================================================
 *  The portal configs carry modules and quick actions as display strings
 *  ("Purchase Orders", "Collect sample"), not enums. Rather than migrate every
 *  data file to add an icon field, these resolvers map a label onto the icon
 *  set by keyword.
 *
 *  Order matters: the first matching rule wins, so put specific terms above
 *  general ones ("purchase order" before "order").
 * ============================================================================
 */
import type { IconName } from '../ui';

type Rule = [RegExp, IconName];

const MODULE_RULES: Rule[] = [
  [/dashboard|overview|home/i,            'grid'],
  [/purchase\s*order|supplier|vendor/i,   'truck'],
  [/in-?house\s*queue|external\s*queue/i, 'inbox'],
  [/queue|worklist|triage/i,              'inbox'],
  [/appointment|schedule|calendar/i,      'calendar'],
  [/registration|register/i,              'edit'],
  [/patient|directory|people/i,           'users'],
  [/staff|team|employee/i,                'briefcase'],
  [/pharmacy|prescription|medicine|drug/i,'pill'],
  [/lab|diagnostic|specimen|sample/i,     'flask'],
  [/collection|collect/i,                 'droplet'],
  [/processing|process/i,                 'refresh'],
  [/result|report/i,                      'fileText'],
  [/completed|complete|history|dispensed/i,'checkCircle'],
  [/inventory|stock/i,                    'package'],
  [/equipment|device|machine/i,           'settings'],
  [/emr|record|chart|note/i,              'clipboard'],
  [/analytic|insight|statistic/i,         'barChart'],
  [/billing|payment|invoice|finance/i,    'creditCard'],
  [/message|communication|chat|inbox/i,   'message'],
  [/notification|alert/i,                 'bell'],
  [/review|feedback|rating/i,             'star'],
  [/setting|preference|config/i,          'settings'],
];

const ACTION_RULES: Rule[] = [
  [/scan|barcode/i,                       'search'],
  [/add|create|new|register/i,            'plus'],
  [/start|begin|consult/i,                'activity'],
  [/prescri|medicine|dispense/i,          'pill'],
  [/lab|test|sample|specimen/i,           'flask'],
  [/send|notify|broadcast|message/i,      'send'],
  [/check\s*in|mark|ready|complete/i,     'checkCircle'],
  [/collect|payment|pay|bill/i,           'creditCard'],
  [/export|download|report/i,             'download'],
  [/audit|stock|inventory/i,              'package'],
  [/flag|critical|urgent|alert/i,         'alert'],
  [/print/i,                              'printer'],
  [/upload|attach/i,                      'upload'],
  [/edit|update|modify/i,                 'edit'],
];

function resolve(label: string, rules: Rule[], fallback: IconName): IconName {
  for (const [pattern, icon] of rules) {
    if (pattern.test(label)) return icon;
  }
  return fallback;
}

/** Icon for a navigation module / drawer item. */
export const moduleIcon = (label: string): IconName => resolve(label, MODULE_RULES, 'layers');

/** Icon for a quick-action tile. */
export const actionIcon = (label: string): IconName => resolve(label, ACTION_RULES, 'zap');

/**
 * Icon for a KPI tile.
 *
 * Metric labels are domain nouns ("Awaiting collection", "Revenue"), not verbs,
 * so they get their own rules rather than reusing ACTION_RULES — which matched
 * "collection" on its `/collect|payment/` rule and put a credit card on a
 * blood-draw tile.
 */
const METRIC_RULES: Rule[] = [
  [/waiting|pending|queue|awaiting/i,      'clock'],
  [/collection|collected|sample|specimen/i,'droplet'],
  [/consultation|in progress|processing/i, 'refresh'],
  [/completed|complete|done|validated/i,   'checkCircle'],
  [/critical|urgent|alert|abnormal/i,      'alert'],
  [/revenue|collected|payment|billing|paid/i, 'creditCard'],
  [/stock|inventory|reorder/i,             'package'],
  [/patient|people|registered|visitor/i,   'users'],
  [/staff|doctor|technician/i,             'briefcase'],
  [/order|prescription|rx/i,               'clipboard'],
  [/appointment|scheduled|booking/i,       'calendar'],
  [/result|report/i,                       'fileText'],
  [/message|unread/i,                      'message'],
  [/occupancy|bed|utilisation|utilization/i, 'barChart'],
];

export const metricIcon = (label: string): IconName =>
  resolve(label, [...METRIC_RULES, ...MODULE_RULES], 'activity');
