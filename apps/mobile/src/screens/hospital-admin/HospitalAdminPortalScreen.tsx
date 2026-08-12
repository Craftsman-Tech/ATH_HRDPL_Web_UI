import React, { useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fontSize, fontWeight, palette, radius, spacing } from '@vexoo/shared';
import { useAuth, useTheme } from '../../components/AppContexts';
import { T, alpha } from '../../theme';
import { metricIcon, moduleIcon } from '../../data/icons';
import {
  AppHeader, Button as UiButton, Chip as UiChip, Field as UiField, Icon, ListRow,
  NavDrawer, PillRow, ReadField, SectionHeader, Segmented as UiSegmented,
  SearchField, Sheet as UiSheet, StatTile, Surface, Touchable, pulseFor, toneFor, type IconName,
} from '../../ui';
import {
  HA_APPOINTMENTS,
  HA_EQUIPMENT,
  HA_INVOICES,
  HA_INVENTORY,
  HA_LAB_ORDERS,
  HA_MODULES,
  HA_NOTIFICATIONS,
  HA_PATIENTS,
  HA_PLAN_CARDS,
  HA_PRESCRIPTIONS,
  HA_PROFILE,
  HA_RATING_LABELS,
  HA_REVIEWS,
  HA_STAFF,
  HA_SUBSCRIPTION,
  type HaAppointment,
  type HaEquipmentItem,
  type HaInvoice,
  type HaInventoryItem,
  type HaLabOrder,
  type HaModuleId,
  type HaPatient,
  type HaPlanCard,
  type HaPrescription,
  type HaReview,
  type HaStaffMember,
  type HaSubscription,
  haTone,
} from '../../data/hospitalAdminData';

const accent = palette.roleAdmin;
type StaffRole = HaStaffMember['role'];

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function toneColor(status: string) {
  const tone = haTone(status);
  if (tone === 'danger') return palette.rose;
  if (tone === 'warning') return palette.amber;
  if (tone === 'success') return palette.primary;
  if (tone === 'purple') return palette.purple;
  return palette.blue;
}

function id(prefix: string) {
  return `${prefix}-${Math.floor(Date.now() % 100000)}`;
}

function tempPassword() {
  return `Vex@${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

const monthIndex: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const monthNames = Object.keys(monthIndex);

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shortDate(date: Date) {
  return `${monthNames[date.getMonth()]} ${date.getDate()}`;
}

function dateFromIso(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return new Date(2026, 3, 26);
  return new Date(year, month - 1, day);
}

function shortDateFromIso(value: string) {
  return shortDate(dateFromIso(value));
}

function appointmentIso(a: HaAppointment) {
  if (a.isoDate) return a.isoDate;
  return shortLabelIso(a.date);
}

function shortLabelIso(label: string) {
  if (label === 'Today') return '2026-07-02';
  const [month, day] = label.split(' ');
  return isoDate(new Date(2026, monthIndex[month] ?? 0, Number(day) || 1));
}

/* ── Local primitives ──────────────────────────────────────────────────────
   Call signatures are unchanged so every module renderer below stays as it
   was; each now delegates to the shared UI kit, which is where the elevation,
   icons, focus rings and press physics come from. */

function Chip({ label }: { label: string }) {
  return <UiChip label={label} tone={toneFor(label)} dot style={styles.chipGap} />;
}

/** Leading icon for an action label, so buttons read at a glance. */
function buttonIcon(label: string): IconName | undefined {
  const v = label.toLowerCase();
  if (/approve|confirm|complete|resolve|save|apply|mark/.test(v)) return 'checkCircle';
  if (/add|new|create|register|invite/.test(v))                   return 'plus';
  if (/edit|update/.test(v))                                      return 'edit';
  if (/delete|remove|deactivate|reject/.test(v))                  return 'trash';
  if (/export|download/.test(v))                                  return 'download';
  if (/print/.test(v))                                            return 'printer';
  if (/send|notify|broadcast|reply/.test(v))                      return 'send';
  if (/view|open|details/.test(v))                                return 'eye';
  if (/reorder|restock/.test(v))                                  return 'package';
  if (/filter/.test(v))                                           return 'filter';
  return undefined;
}

function Button({
  label,
  onPress,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
}) {
  return (
    <UiButton label={label} onPress={onPress} variant={variant} accent={accent} icon={buttonIcon(label)} style={styles.btnGap} />
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <ReadField label={label} value={value} />;
}

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <UiField
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline={multiline}
      accent={accent}
      containerStyle={styles.fieldGap}
    />
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <Surface style={styles.cardGap} radiusSize="xl">{children}</Surface>;
}

function Section({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return <SectionHeader title={title} action={action} onAction={onAction} accent={accent} />;
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <StatTile label={label} value={value} detail={sub} color={color} icon={metricIcon(label)} />;
}

function Row({
  title,
  subtitle,
  meta,
  status,
  onPress,
}: {
  title: string;
  subtitle: string;
  meta: string;
  status?: string;
  onPress?: () => void;
}) {
  return (
    <ListRow
      title={title}
      subtitle={subtitle}
      meta={meta}
      onPress={onPress}
      trailing={status ? <UiChip label={status} tone={toneFor(status)} dot /> : undefined}
    />
  );
}

/** Two-to-four way switcher with a sliding indicator. */
function Segment<T extends string>({
  values,
  active,
  onChange,
}: {
  values: { label: string; value: T }[];
  active: T;
  onChange: (value: T) => void;
}) {
  return values.length > 4
    ? <View style={styles.pillWrap}>
        <PillRow options={values.map((v) => ({ value: v.value, label: v.label }))} value={active} onChange={onChange} accent={accent} />
      </View>
    : <UiSegmented options={values.map((v) => ({ value: v.value, label: v.label }))} value={active} onChange={onChange} accent={accent} style={styles.segmentGap} />;
}

function Sheet({
  title,
  visible,
  onClose,
  children,
}: {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return <UiSheet visible={visible} title={title} onClose={onClose}>{children}</UiSheet>;
}

function AppliedFilters({
  filters,
  onClear,
}: {
  filters: string[];
  onClear: () => void;
}) {
  if (!filters.length) return null;
  return (
    <View style={styles.filterRow}>
      {filters.map((filter) => <Chip key={filter} label={filter} />)}
      <Button label="Clear" onPress={onClear} variant="ghost" />
    </View>
  );
}

function ToggleList({
  items,
  selected,
  onChange,
}: {
  items: string[];
  selected: string[];
  onChange: (items: string[]) => void;
}) {
  const { theme } = useTheme();
  const toggle = (item: string) => {
    onChange(selected.includes(item) ? selected.filter((x) => x !== item) : [...selected, item]);
  };
  return (
    <View style={styles.toggleList}>
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <Touchable
            key={item}
            press="sm"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: active }}
            onPress={() => toggle(item)}
            style={[styles.toggleItem, { borderColor: active ? accent : theme.border, backgroundColor: active ? alpha(accent, 0.09) : theme.card }]}
          >
            <View style={[styles.checkbox, { backgroundColor: active ? accent : 'transparent', borderColor: active ? accent : theme.borderStrong }]}>
              {active ? <Icon name="check" size={12} color="#FAFAF7" strokeWidth={3} /> : null}
            </View>
            <Text style={[styles.toggleText, { color: active ? accent : theme.text }]}>{item}</Text>
          </Touchable>
        );
      })}
    </View>
  );
}

function Drawer({
  open,
  active,
  onClose,
  onSelect,
  onSignOut,
}: {
  open: boolean;
  active: HaModuleId;
  onClose: () => void;
  onSelect: (id: HaModuleId) => void;
  onSignOut: () => void;
}) {
  const { user } = useAuth();
  return (
    <NavDrawer
      visible={open}
      items={HA_MODULES.map((m) => ({ id: m.id, label: m.label, icon: moduleIcon(m.label) }))}
      active={active}
      accent={accent}
      roleLabel="Apollo Multispecialty"
      userName={user?.name ?? 'Anita Reddy'}
      userEmail={user?.email}
      onClose={onClose}
      onSelect={onSelect}
      onSignOut={onSignOut}
    />
  );
}

/** One line of context per module, shown under the header title. */
const SUBTITLES: Partial<Record<HaModuleId, string>> = {
  dashboard:     'Occupancy, revenue and the alerts that need an admin today.',
  patients:      'The full patient register across departments.',
  appointments:  'Every booking in the hospital, by doctor and status.',
  emr:           'Clinical records and discharge summaries.',
  pharmacy:      'Prescription throughput and dispensing status.',
  lab:           'Diagnostic orders and turnaround across the lab.',
  staff:         'Roster, roles and access for every employee.',
  analytics:     'Trends across footfall, revenue and utilisation.',
  notifications: 'Approvals and escalations awaiting an admin.',
  reviews:       'Patient feedback and ratings by department.',
  settings:      'Hospital profile, plan and billing.',
};

function Header({ active, onMenu }: { active: HaModuleId; onMenu: () => void }) {
  const { user } = useAuth();
  const label = HA_MODULES.find((m) => m.id === active)?.label ?? 'Dashboard';
  return (
    <AppHeader
      title={label}
      subtitle={SUBTITLES[active] ?? 'Full mobile workflow for hospital operations.'}
      roleLabel="Hospital Admin"
      userName={user?.name ?? 'Admin'}
      accent={accent}
      modulePill="Apollo Multispecialty"
      showClock
      onMenu={onMenu}
    />
  );
}

type Store = {
  patients: HaPatient[];
  appointments: HaAppointment[];
  prescriptions: HaPrescription[];
  labs: HaLabOrder[];
  inventory: HaInventoryItem[];
  equipment: HaEquipmentItem[];
  staff: HaStaffMember[];
  reviews: HaReview[];
  notifications: typeof HA_NOTIFICATIONS;
  subscription: HaSubscription;
  invoices: HaInvoice[];
};

function Dashboard({ store, go }: { store: Store; go: (m: HaModuleId) => void }) {
  const max = 45;
  const weekly = [28, 35, 31, 42, 38, 45, 34];
  const deptLoad = [
    { name: 'General Medicine', count: 18, pct: 86, color: accent },
    { name: 'Orthopaedics', count: 12, pct: 68, color: palette.blue },
    { name: 'Dermatology', count: 9, pct: 52, color: palette.purple },
    { name: 'ENT', count: 7, pct: 44, color: palette.amber },
    { name: 'Paediatrics', count: 5, pct: 31, color: palette.green },
  ];
  const critical = store.labs.filter((l) => l.status === 'Critical').length + store.inventory.filter((i) => i.status === 'Critical').length;
  return (
    <>
      <View style={styles.statGrid}>
        <Stat label="Total Patients" value={String(store.patients.length)} sub="registered patients" color={accent} />
        <Stat label="Appointments" value={String(store.appointments.filter((a) => a.date === 'Apr 26').length)} sub="today" color={palette.blue} />
        <Stat label="Revenue" value="INR 8,240" sub="8% vs yesterday" color={palette.amber} />
        <Stat label="Critical Items" value={String(critical)} sub="needs action" color={palette.rose} />
      </View>
      <Section title="Quick Actions" />
      <View style={styles.quickGrid}>
        <Button label="New Patient" onPress={() => go('patients')} />
        <Button label="New Appointment" onPress={() => go('appointments')} />
        <Button label="Create Staff" onPress={() => go('staff')} />
        <Button label="Review Alerts" onPress={() => go('notifications')} variant="ghost" />
      </View>
      <Section title="Weekly Appointments" action="Analytics" onAction={() => go('analytics')} />
      <Card>
        <View style={styles.chartRow}>
          {weekly.map((value, index) => (
            <View key={index} style={styles.chartCol}>
              <View style={[styles.chartBar, { height: 36 + (value / max) * 88, backgroundColor: index === 5 ? accent : `${accent}66` }]} />
              <Text style={styles.chartLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text>
            </View>
          ))}
        </View>
      </Card>
      <Section title="Department Load" action="Analytics" onAction={() => go('analytics')} />
      <Card>
        <Text style={styles.note}>Live OPD workload by department for the current operating day.</Text>
        {deptLoad.map((dept) => (
          <View key={dept.name} style={styles.progressRow}>
            <View style={styles.progressTop}>
              <Text style={styles.progressName}>{dept.name}</Text>
              <Text style={styles.progressCount}>{dept.count} visits</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { backgroundColor: dept.color, width: `${dept.pct}%` }]} />
            </View>
          </View>
        ))}
      </Card>
      <Section title="Recent Patients" action="View all" onAction={() => go('patients')} />
      {store.patients.slice(0, 5).map((p) => (
        <Row key={p.id} title={p.name} subtitle={`${p.condition} - ${p.id} - ${p.age} yrs`} meta={p.doctor} status={p.status} onPress={() => go('patients')} />
      ))}
      <Section title="Today Schedule" action="View all" onAction={() => go('appointments')} />
      {store.appointments.filter((a) => a.date === 'Apr 26').slice(0, 5).map((a) => (
        <Row key={a.id} title={a.patient} subtitle={`${a.doctor} - ${a.type}`} meta={`${a.time} - ${a.room}`} status={a.status} />
      ))}
    </>
  );
}

function Patients({ store, setStore, toast }: { store: Store; setStore: React.Dispatch<React.SetStateAction<Store>>; toast: (m: string) => void }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<HaPatient | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', phone: '', condition: '', doctor: 'Dr. Chen' });
  const { theme } = useTheme();
  const filtered = store.patients.filter((p) => `${p.name} ${p.id} ${p.condition}`.toLowerCase().includes(query.toLowerCase()));

  const createPatient = () => {
    if (!form.name.trim()) return toast('Enter patient name before saving.');
    const patient: HaPatient = {
      id: id('P'),
      name: form.name,
      age: Number(form.age) || 0,
      gender: 'F',
      blood: 'A+',
      condition: form.condition || 'General consultation',
      doctor: form.doctor,
      status: 'Stable',
      phone: form.phone || '+91 XXXXX XXXXX',
      email: `${form.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      lastVisit: 'Today',
      visits: 1,
      allergies: 'None known',
      history: 'New patient profile created from mobile Hospital Admin portal.',
    };
    setStore((s) => ({ ...s, patients: [patient, ...s.patients] }));
    setForm({ name: '', age: '', phone: '', condition: '', doctor: 'Dr. Chen' });
    setShowNew(false);
    toast('Patient created.');
  };

  if (selected) {
    const rx = store.prescriptions.filter((p) => p.patient === selected.name);
    const labs = store.labs.filter((p) => p.patient === selected.name);
    return (
      <>
        <Button label="Back to patients" onPress={() => setSelected(null)} variant="ghost" />
        <Card>
          <View style={styles.profileHead}>
            <View style={[styles.avatar, { backgroundColor: `${accent}18` }]}>
              <Text style={[styles.avatarText, { color: accent }]}>{initials(selected.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.profileName, { color: theme.text }]}>{selected.name}</Text>
              <Text style={[styles.profileSub, { color: theme.textMuted }]}>{selected.id} - {selected.age} yrs - {selected.gender}</Text>
            </View>
            <Chip label={selected.status} />
          </View>
          <View style={styles.fieldGrid}>
            <Field label="Blood" value={selected.blood} />
            <Field label="Visits" value={String(selected.visits)} />
            <Field label="Doctor" value={selected.doctor} />
            <Field label="Last Visit" value={selected.lastVisit} />
          </View>
          <Field label="Phone" value={selected.phone} />
          <Field label="Allergies" value={selected.allergies} />
          <Field label="History" value={selected.history} />
          <Button label="Export Patient PDF" onPress={() => toast('Patient PDF export simulated for mobile preview.')} />
        </Card>
        <Section title="Prescriptions" action={`${rx.length} records`} />
        {rx.map((p) => <Row key={p.id} title={p.drug} subtitle={`${p.qty} qty - ${p.doctor}`} meta={p.date} status={p.status} />)}
        <Section title="Lab Reports" action={`${labs.length} records`} />
        {labs.map((l) => <Row key={l.id} title={l.test} subtitle={`${l.ordered} - ${l.priority}`} meta={l.result || l.date} status={l.status} />)}
      </>
    );
  }

  return (
    <>
      <Section title="Patients" action="New Patient" onAction={() => setShowNew(true)} />
      <View style={styles.search}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search patients, ID, condition" accent={accent} />
      </View>
      {filtered.map((p) => (
        <Row key={p.id} title={p.name} subtitle={`${p.id} - ${p.age} yrs - ${p.condition}`} meta={`${p.doctor} - Last ${p.lastVisit}`} status={p.status} onPress={() => setSelected(p)} />
      ))}
      <Sheet visible={showNew} title="New Patient" onClose={() => setShowNew(false)}>
        <Input label="Full Name" value={form.name} onChangeText={(name) => setForm((f) => ({ ...f, name }))} placeholder="Patient name" />
        <Input label="Age" value={form.age} onChangeText={(age) => setForm((f) => ({ ...f, age }))} placeholder="34" />
        <Input label="Phone" value={form.phone} onChangeText={(phone) => setForm((f) => ({ ...f, phone }))} placeholder="+91 XXXXX XXXXX" />
        <Input label="Condition" value={form.condition} onChangeText={(condition) => setForm((f) => ({ ...f, condition }))} placeholder="Primary condition" />
        <Input label="Doctor" value={form.doctor} onChangeText={(doctor) => setForm((f) => ({ ...f, doctor }))} />
        <Button label="Create Patient" onPress={createPatient} />
      </Sheet>
    </>
  );
}

function EMR({ store, toast }: { store: Store; toast: (m: string) => void }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(store.patients[0]?.id ?? '');
  const { theme } = useTheme();
  const filtered = store.patients.filter((p) => `${p.name} ${p.id} ${p.phone}`.toLowerCase().includes(query.toLowerCase()));
  const patient = store.patients.find((p) => p.id === selectedId) ?? filtered[0] ?? store.patients[0];
  const patientRx = store.prescriptions.filter((rx) => rx.patient === patient?.name);
  const patientLabs = store.labs.filter((lab) => lab.patient === patient?.name);

  if (!patient) return null;

  return (
    <>
      <Section title="Electronic Medical Records" action="Download PDF" onAction={() => toast(`Medical record PDF export simulated for ${patient.name}.`)} />
      <View style={styles.search}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search by patient name, ID, or phone" accent={accent} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.patientStrip}>
        {filtered.map((p) => {
          const active = p.id === patient.id;
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => setSelectedId(p.id)}
              style={[styles.patientPill, { borderColor: active ? accent : theme.border, backgroundColor: active ? palette.primaryLight : theme.card }]}
            >
              <Text style={[styles.patientPillName, { color: active ? accent : theme.text }]}>{p.name}</Text>
              <Text style={[styles.patientPillSub, { color: theme.textMuted }]}>{p.id} - {p.phone}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Card>
        <View style={styles.profileHead}>
          <View style={[styles.avatar, { backgroundColor: `${accent}18` }]}>
            <Text style={[styles.avatarText, { color: accent }]}>{initials(patient.name)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, { color: theme.text }]}>{patient.name}</Text>
            <Text style={[styles.profileSub, { color: theme.textMuted }]}>{patient.id} - {patient.gender === 'F' ? 'Female' : 'Male'} - {patient.age} years</Text>
          </View>
          <Chip label={patient.status} />
        </View>
        <View style={styles.fieldGrid}>
          <Field label="Blood Pressure" value="128/82 mmHg" />
          <Field label="Heart Rate" value="74 bpm" />
          <Field label="O2 Saturation" value="98%" />
          <Field label="Blood Group" value={patient.blood} />
        </View>
        <Field label="Known Allergies" value={patient.allergies} />
        <Field label="Medical History" value={patient.history} />
        <Field label="Primary Condition" value={patient.condition} />
      </Card>
      <Section title="Active Medications" action={`${patientRx.length} prescriptions`} />
      {patientRx.length ? patientRx.map((rx) => (
        <Row key={rx.id} title={rx.drug} subtitle={`${rx.doctor} - ${rx.qty} units`} meta={`${rx.date} - ${rx.status}`} status={rx.status} />
      )) : <Row title="No prescriptions found" subtitle="No active medication records for this patient" meta="-" />}
      <Section title="Lab Reports" action={`${patientLabs.length} reports`} />
      {patientLabs.length ? patientLabs.map((lab) => (
        <Row key={lab.id} title={lab.test} subtitle={`${lab.ordered} - ${lab.priority}`} meta={lab.result || lab.date} status={lab.status} />
      )) : <Row title="No lab reports found" subtitle="No diagnostic results for this patient" meta="-" />}
    </>
  );
}

function Appointments({ store, setStore, toast }: { store: Store; setStore: React.Dispatch<React.SetStateAction<Store>>; toast: (m: string) => void }) {
  const [tab, setTab] = useState<'schedule' | 'history'>('schedule');
  const [status, setStatus] = useState<'All' | 'Completed' | 'No-Show'>('All');
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeDay, setActiveDay] = useState(6);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ patient: '', doctor: 'Dr. Chen', type: 'Consultation', date: '2026-04-26', time: '09:00 AM', room: 'Room 104' });
  const base = new Date(2026, 3, 20 + (weekOffset * 7));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(base, i));
  const selectedDate = weekDays[activeDay];
  const selectedIso = isoDate(selectedDate);
  const dayAppts = store.appointments.filter((a) => appointmentIso(a) === selectedIso);
  const today = store.appointments.filter((a) => appointmentIso(a) === '2026-04-26');
  const history = store.appointments.filter((a) => a.status === 'Completed' || a.status === 'No-Show');
  const filteredHistory = history.filter((a) => {
    const aIso = appointmentIso(a);
    if (status !== 'All' && a.status !== status) return false;
    if (from && aIso < from) return false;
    if (to && aIso > to) return false;
    return true;
  });
  const list = tab === 'schedule' ? dayAppts : filteredHistory;
  const counts = {
    confirmed: dayAppts.filter((a) => a.status === 'Confirmed').length,
    inProgress: dayAppts.filter((a) => a.status === 'In Progress').length,
    pending: dayAppts.filter((a) => a.status === 'Pending').length,
    waiting: dayAppts.filter((a) => a.status === 'Waiting').length,
  };

  const openNew = () => {
    setForm((f) => ({ ...f, date: selectedIso }));
    setShowNew(true);
  };

  const create = () => {
    if (!form.patient.trim()) return toast('Enter patient name before scheduling.');
    const appointmentDate = form.date.trim() || selectedIso;
    const appointment: HaAppointment = { id: id('A'), patient: form.patient, doctor: form.doctor, type: form.type, time: form.time, date: shortDateFromIso(appointmentDate), isoDate: appointmentDate, room: form.room, status: 'Pending' };
    setStore((s) => ({ ...s, appointments: [appointment, ...s.appointments] }));
    setShowNew(false);
    setForm({ patient: '', doctor: 'Dr. Chen', type: 'Consultation', date: selectedIso, time: '09:00 AM', room: 'Room 104' });
    toast(`Appointment scheduled for ${shortDateFromIso(appointmentDate)}.`);
  };

  return (
    <>
      <View style={styles.statGrid}>
        <Stat label="Today" value={String(today.length)} sub="Apr 26, 2026" color={accent} />
        <Stat label="Confirmed" value={String(counts.confirmed)} sub="selected day" color={palette.blue} />
        <Stat label="In Progress" value={String(counts.inProgress)} sub="active visits" color={palette.amber} />
        <Stat label="History" value={String(history.length)} sub="completed/no-show" color={palette.purple} />
      </View>
      <Segment values={[{ label: 'Schedule', value: 'schedule' }, { label: 'History', value: 'history' }]} active={tab} onChange={setTab} />
      {tab === 'schedule' ? (
        <>
          <View style={styles.weekBar}>
            <Button label="Prev Week" onPress={() => { setWeekOffset((o) => o - 1); setActiveDay(0); }} variant="ghost" />
            <Text style={styles.weekTitle}>{shortDate(weekDays[0])} - {shortDate(weekDays[6])}, 2026</Text>
            <Button label="Next Week" onPress={() => { setWeekOffset((o) => o + 1); setActiveDay(0); }} variant="ghost" />
          </View>
          {weekOffset !== 0 ? <Button label="Back to Today" onPress={() => { setWeekOffset(0); setActiveDay(6); }} variant="ghost" /> : null}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.patientStrip}>
            {weekDays.map((d, index) => {
              const active = index === activeDay;
              const count = store.appointments.filter((a) => appointmentIso(a) === isoDate(d)).length;
              return (
                <TouchableOpacity key={isoDate(d)} onPress={() => setActiveDay(index)} style={[styles.dayPill, { backgroundColor: active ? accent : palette.white, borderColor: active ? accent : palette.borderCool }]}>
                  <Text style={[styles.dayName, { color: active ? palette.white : palette.textMuted }]}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</Text>
                  <Text style={[styles.dayNumber, { color: active ? palette.white : palette.text }]}>{d.getDate()}</Text>
                  <Text style={[styles.dayCount, { color: active ? palette.white : palette.textMuted }]}>{count} appts</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.filterRow}>
            <Chip label={`${counts.pending} Pending`} />
            <Chip label={`${counts.waiting} Waiting`} />
            <Chip label={`${counts.confirmed} Confirmed`} />
          </View>
        </>
      ) : null}
      {tab === 'history' ? (
        <>
          <Segment values={[{ label: 'All', value: 'All' }, { label: 'Completed', value: 'Completed' }, { label: 'No-Show', value: 'No-Show' }]} active={status} onChange={setStatus} />
          <View style={styles.fieldGrid}>
            <Input label="From Date" value={from} onChangeText={setFrom} placeholder="2026-04-20" />
            <Input label="To Date" value={to} onChangeText={setTo} placeholder="2026-04-26" />
          </View>
          {(from || to) ? <Button label="Clear Date Filter" onPress={() => { setFrom(''); setTo(''); }} variant="ghost" /> : null}
        </>
      ) : null}
      <Section title={tab === 'schedule' ? 'Today Schedule' : 'Appointment History'} action={tab === 'schedule' ? 'New Appointment' : 'Export'} onAction={() => tab === 'schedule' ? openNew() : toast('Appointment history export simulated.')} />
      {tab === 'schedule' ? <Text style={styles.note}>Showing {shortDate(selectedDate)}, 2026. New appointments are saved to the selected day.</Text> : <Text style={styles.note}>Showing {filteredHistory.length} of {history.length} completed/no-show records.</Text>}
      {list.map((a) => <Row key={a.id} title={a.patient} subtitle={`${a.doctor} - ${a.type}`} meta={`${a.date} - ${a.time} - ${a.room} - ${a.id}`} status={a.status} />)}
      {!list.length ? <Row title="No appointments" subtitle="No records match this schedule or filter" meta="-" /> : null}
      <Sheet visible={showNew} title="New Appointment" onClose={() => setShowNew(false)}>
        <Input label="Patient Name" value={form.patient} onChangeText={(patient) => setForm((f) => ({ ...f, patient }))} />
        <Input label="Doctor" value={form.doctor} onChangeText={(doctor) => setForm((f) => ({ ...f, doctor }))} />
        <Input label="Visit Type" value={form.type} onChangeText={(type) => setForm((f) => ({ ...f, type }))} />
        <Input label="Date" value={form.date} onChangeText={(date) => setForm((f) => ({ ...f, date }))} placeholder="2026-04-26" />
        <Input label="Time" value={form.time} onChangeText={(time) => setForm((f) => ({ ...f, time }))} />
        <Input label="Room" value={form.room} onChangeText={(room) => setForm((f) => ({ ...f, room }))} />
        <Button label="Schedule Appointment" onPress={create} />
      </Sheet>
    </>
  );
}

function Pharmacy({ store, setStore, toast }: { store: Store; setStore: React.Dispatch<React.SetStateAction<Store>>; toast: (m: string) => void }) {
  const [showNew, setShowNew] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState<HaPrescription | null>(null);
  const [doctor, setDoctor] = useState('All');
  const [status, setStatus] = useState('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [form, setForm] = useState({ patient: '', drug: '', qty: '30', doctor: 'Dr. Chen' });
  const doctors = ['All', ...Array.from(new Set(store.prescriptions.map((rx) => rx.doctor)))];
  const statuses = ['All', 'Pending', 'Ready', 'Dispensed'];
  const appliedFilters = [
    doctor !== 'All' ? `Doctor: ${doctor}` : '',
    status !== 'All' ? `Status: ${status}` : '',
    from ? `From: ${from}` : '',
    to ? `To: ${to}` : '',
  ].filter(Boolean);
  const filtered = store.prescriptions.filter((rx) => {
    const rxIso = shortLabelIso(rx.date);
    if (doctor !== 'All' && rx.doctor !== doctor) return false;
    if (status !== 'All' && rx.status !== status) return false;
    if (from && rxIso < from) return false;
    if (to && rxIso > to) return false;
    return true;
  });
  const create = () => {
    if (!form.patient.trim() || !form.drug.trim()) return toast('Enter patient and drug details.');
    const rx: HaPrescription = { id: id('RX'), patient: form.patient, drug: form.drug, qty: Number(form.qty) || 1, doctor: form.doctor, date: 'Today', status: 'Pending', refills: 0 };
    setStore((s) => ({ ...s, prescriptions: [rx, ...s.prescriptions] }));
    setShowNew(false);
    setForm({ patient: '', drug: '', qty: '30', doctor: 'Dr. Chen' });
    toast('Prescription submitted.');
  };
  return (
    <>
      <View style={styles.statGrid}>
        <Stat label="Pending RX" value={String(store.prescriptions.filter((p) => p.status === 'Pending').length)} sub="need verification" color={palette.amber} />
        <Stat label="Ready" value={String(store.prescriptions.filter((p) => p.status === 'Ready').length)} sub="awaiting pickup" color={accent} />
      </View>
      <Section title="Prescription Filters" action={`Custom Filter${appliedFilters.length ? ` (${appliedFilters.length})` : ''}`} onAction={() => setShowFilter(true)} />
      <AppliedFilters filters={appliedFilters} onClear={() => { setDoctor('All'); setStatus('All'); setFrom(''); setTo(''); }} />
      <Section title="Prescriptions" action="New Prescription" onAction={() => setShowNew(true)} />
      {filtered.map((p) => <Row key={p.id} title={p.patient} subtitle={`${p.drug} - ${p.qty} qty`} meta={`${p.doctor} - ${p.date} - ${p.refills} refills`} status={p.status} onPress={() => setSelected(p)} />)}
      {!filtered.length ? <Row title="No prescriptions match filters" subtitle="Open Custom Filter to adjust doctor, status, or dates" meta="-" /> : null}
      <Inventory kind="drugs" store={store} setStore={setStore} toast={toast} />
      <Sheet visible={showFilter} title="Pharmacy Custom Filter" onClose={() => setShowFilter(false)}>
        <Text style={styles.note}>Filter prescriptions by doctor, status, and date range.</Text>
        <Text style={styles.inputLabel}>Doctor</Text>
        <Segment values={doctors.map((d) => ({ label: d.replace('Dr. ', ''), value: d }))} active={doctor} onChange={setDoctor} />
        <Text style={styles.inputLabel}>Status</Text>
        <Segment values={statuses.map((s) => ({ label: s, value: s }))} active={status} onChange={setStatus} />
        <Input label="From Date" value={from} onChangeText={setFrom} placeholder="2026-04-24" />
        <Input label="To Date" value={to} onChangeText={setTo} placeholder="2026-04-26" />
        <View style={styles.quickGrid}>
          <Button label="Reset" onPress={() => { setDoctor('All'); setStatus('All'); setFrom(''); setTo(''); }} variant="ghost" />
          <Button label="Apply Filter" onPress={() => setShowFilter(false)} />
        </View>
      </Sheet>
      <Sheet visible={!!selected} title="Prescription Detail" onClose={() => setSelected(null)}>
        {selected ? <>
          <Field label="Patient" value={selected.patient} />
          <Field label="Drug" value={selected.drug} />
          <Field label="Doctor" value={selected.doctor} />
          <Field label="Quantity" value={`${selected.qty} units`} />
          <Field label="Refills" value={String(selected.refills)} />
          <Field label="Status" value={selected.status} />
          <Button label="Download PDF" onPress={() => toast('Prescription PDF export simulated.')} />
        </> : null}
      </Sheet>
      <Sheet visible={showNew} title="New Prescription" onClose={() => setShowNew(false)}>
        <Input label="Patient" value={form.patient} onChangeText={(patient) => setForm((f) => ({ ...f, patient }))} />
        <Input label="Drug Name" value={form.drug} onChangeText={(drug) => setForm((f) => ({ ...f, drug }))} />
        <Input label="Quantity" value={form.qty} onChangeText={(qty) => setForm((f) => ({ ...f, qty }))} />
        <Input label="Doctor" value={form.doctor} onChangeText={(doctor) => setForm((f) => ({ ...f, doctor }))} />
        <Button label="Submit Prescription" onPress={create} />
      </Sheet>
    </>
  );
}

function Lab({ store, setStore, toast }: { store: Store; setStore: React.Dispatch<React.SetStateAction<Store>>; toast: (m: string) => void }) {
  const [showNew, setShowNew] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState<HaLabOrder | null>(null);
  const [doctor, setDoctor] = useState('All');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [form, setForm] = useState({ patient: '', test: '', ordered: 'Dr. Chen', priority: 'Routine' });
  const doctors = ['All', ...Array.from(new Set(store.labs.map((lab) => lab.ordered)))];
  const statuses = ['All', 'Pending', 'In Progress', 'Complete', 'Critical'];
  const priorities = ['All', 'Routine', 'Urgent', 'STAT'];
  const appliedFilters = [
    doctor !== 'All' ? `Doctor: ${doctor}` : '',
    status !== 'All' ? `Status: ${status}` : '',
    priority !== 'All' ? `Priority: ${priority}` : '',
    from ? `From: ${from}` : '',
    to ? `To: ${to}` : '',
  ].filter(Boolean);
  const filtered = store.labs.filter((lab) => {
    const labIso = shortLabelIso(lab.date);
    if (doctor !== 'All' && lab.ordered !== doctor) return false;
    if (status !== 'All' && lab.status !== status) return false;
    if (priority !== 'All' && lab.priority !== priority) return false;
    if (from && labIso < from) return false;
    if (to && labIso > to) return false;
    return true;
  });
  const create = () => {
    if (!form.patient.trim() || !form.test.trim()) return toast('Enter patient and test details.');
    const order: HaLabOrder = { id: id('L'), patient: form.patient, test: form.test, ordered: form.ordered, date: 'Today', status: 'Pending', priority: form.priority, result: '' };
    setStore((s) => ({ ...s, labs: [order, ...s.labs] }));
    setShowNew(false);
    setForm({ patient: '', test: '', ordered: 'Dr. Chen', priority: 'Routine' });
    toast('Lab order created.');
  };
  return (
    <>
      <View style={styles.statGrid}>
        <Stat label="Open Orders" value={String(store.labs.filter((l) => l.status !== 'Complete').length)} sub="processing today" color={palette.amber} />
        <Stat label="Critical" value={String(store.labs.filter((l) => l.status === 'Critical').length)} sub="immediate review" color={palette.rose} />
      </View>
      <Section title="Lab Filters" action={`Custom Filter${appliedFilters.length ? ` (${appliedFilters.length})` : ''}`} onAction={() => setShowFilter(true)} />
      <AppliedFilters filters={appliedFilters} onClear={() => { setDoctor('All'); setStatus('All'); setPriority('All'); setFrom(''); setTo(''); }} />
      <Section title="Lab Orders" action="New Lab Order" onAction={() => setShowNew(true)} />
      {filtered.map((l) => <Row key={l.id} title={l.test} subtitle={`${l.patient} - ${l.ordered}`} meta={l.result || `${l.priority} - ${l.date}`} status={l.status} onPress={() => setSelected(l)} />)}
      {!filtered.length ? <Row title="No lab orders match filters" subtitle="Open Custom Filter to adjust doctor, status, priority, or dates" meta="-" /> : null}
      <Inventory kind="equipment" store={store} setStore={setStore} toast={toast} />
      <Sheet visible={showFilter} title="Lab Custom Filter" onClose={() => setShowFilter(false)}>
        <Text style={styles.note}>Filter diagnostics by ordering doctor, status, priority, and date range.</Text>
        <Text style={styles.inputLabel}>Ordering Doctor</Text>
        <Segment values={doctors.map((d) => ({ label: d.replace('Dr. ', ''), value: d }))} active={doctor} onChange={setDoctor} />
        <Text style={styles.inputLabel}>Status</Text>
        <Segment values={statuses.map((s) => ({ label: s, value: s }))} active={status} onChange={setStatus} />
        <Text style={styles.inputLabel}>Priority</Text>
        <Segment values={priorities.map((p) => ({ label: p, value: p }))} active={priority} onChange={setPriority} />
        <Input label="From Date" value={from} onChangeText={setFrom} placeholder="2026-04-23" />
        <Input label="To Date" value={to} onChangeText={setTo} placeholder="2026-04-26" />
        <View style={styles.quickGrid}>
          <Button label="Reset" onPress={() => { setDoctor('All'); setStatus('All'); setPriority('All'); setFrom(''); setTo(''); }} variant="ghost" />
          <Button label="Apply Filter" onPress={() => setShowFilter(false)} />
        </View>
      </Sheet>
      <Sheet visible={!!selected} title="Lab Result Detail" onClose={() => setSelected(null)}>
        {selected ? <>
          <Field label="Test" value={selected.test} />
          <Field label="Patient" value={selected.patient} />
          <Field label="Priority" value={selected.priority} />
          <Field label="Result" value={selected.result || 'Pending'} />
          <Button label="Download Report" onPress={() => toast('Lab report export simulated.')} />
        </> : null}
      </Sheet>
      <Sheet visible={showNew} title="New Lab Order" onClose={() => setShowNew(false)}>
        <Input label="Patient" value={form.patient} onChangeText={(patient) => setForm((f) => ({ ...f, patient }))} />
        <Input label="Test" value={form.test} onChangeText={(test) => setForm((f) => ({ ...f, test }))} />
        <Input label="Ordered By" value={form.ordered} onChangeText={(ordered) => setForm((f) => ({ ...f, ordered }))} />
        <Input label="Priority" value={form.priority} onChangeText={(priority) => setForm((f) => ({ ...f, priority }))} />
        <Button label="Create Lab Order" onPress={create} />
      </Sheet>
    </>
  );
}

function Inventory({
  kind,
  store,
  setStore,
  toast,
}: {
  kind: 'drugs' | 'equipment';
  store: Store;
  setStore: React.Dispatch<React.SetStateAction<Store>>;
  toast: (m: string) => void;
}) {
  const { theme } = useTheme();
  const [showDrug, setShowDrug] = useState(false);
  const [showEq, setShowEq] = useState(false);
  const [editingDrug, setEditingDrug] = useState<HaInventoryItem | null>(null);
  const [editingEq, setEditingEq] = useState<HaEquipmentItem | null>(null);
  const [drugSearch, setDrugSearch] = useState('');
  const [drugPage, setDrugPage] = useState(1);
  const [drugForm, setDrugForm] = useState({ name: '', category: '', stock: '', min: '', max: '', unit: 'tabs', expiry: '' });
  const [eqForm, setEqForm] = useState({ name: '', model: '', status: 'Online' as HaEquipmentItem['status'], load: '0%', lastCalib: '', nextCalib: '', uptime: '100%', tests: '' });
  const pageSize = 5;
  const filteredInventory = store.inventory.filter((item) =>
    `${item.name} ${item.category} ${item.status}`.toLowerCase().includes(drugSearch.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredInventory.length / pageSize));
  const safePage = Math.min(drugPage, totalPages);
  const pageItems = filteredInventory.slice((safePage - 1) * pageSize, safePage * pageSize);

  const openDrug = (item?: HaInventoryItem) => {
    setEditingDrug(item ?? null);
    setDrugForm(item ? { name: item.name, category: item.category, stock: String(item.stock), min: String(item.min), max: String(item.max ?? 0), unit: item.unit, expiry: item.expiry } : { name: '', category: '', stock: '', min: '', max: '', unit: 'tabs', expiry: '' });
    setShowDrug(true);
  };

  const openEq = (item?: HaEquipmentItem) => {
    setEditingEq(item ?? null);
    setEqForm(item ? { name: item.name, model: item.model, status: item.status, load: item.load, lastCalib: item.lastCalib, nextCalib: item.nextCalib, uptime: item.uptime, tests: item.tests.join(', ') } : { name: '', model: '', status: 'Online', load: '0%', lastCalib: '', nextCalib: '', uptime: '100%', tests: '' });
    setShowEq(true);
  };

  const saveDrug = () => {
    if (!drugForm.name.trim()) return toast('Enter drug name.');
    const stock = Number(drugForm.stock) || 0;
    const min = Number(drugForm.min) || 1;
    const item: HaInventoryItem = { id: editingDrug?.id ?? id('INV'), name: drugForm.name, category: drugForm.category || 'Supplies', stock, min, max: Number(drugForm.max) || Math.max(stock, min * 5), unit: drugForm.unit, expiry: drugForm.expiry || '-', status: stock < min * 0.5 ? 'Critical' : stock < min ? 'Low' : 'OK' };
    setStore((s) => ({ ...s, inventory: editingDrug ? s.inventory.map((x) => x.id === item.id ? item : x) : [item, ...s.inventory] }));
    setShowDrug(false);
    toast(editingDrug ? 'Drug inventory updated.' : 'Drug added.');
  };

  const saveEq = () => {
    if (!eqForm.name.trim()) return toast('Enter equipment name.');
    const item: HaEquipmentItem = { id: editingEq?.id ?? id('EQ'), name: eqForm.name, model: eqForm.model || '-', status: eqForm.status, load: eqForm.load, lastCalib: eqForm.lastCalib || '-', nextCalib: eqForm.nextCalib || '-', uptime: eqForm.uptime, tests: eqForm.tests.split(',').map((x) => x.trim()).filter(Boolean) };
    setStore((s) => ({ ...s, equipment: editingEq ? s.equipment.map((x) => x.id === item.id ? item : x) : [item, ...s.equipment] }));
    setShowEq(false);
    toast(editingEq ? 'Equipment updated.' : 'Equipment added.');
  };

  const deleteDrug = (item: HaInventoryItem) => {
    setStore((s) => ({ ...s, inventory: s.inventory.filter((x) => x.id !== item.id) }));
    toast(`${item.name} deleted.`);
  };

  const deleteEq = (item: HaEquipmentItem) => {
    setStore((s) => ({ ...s, equipment: s.equipment.filter((x) => x.id !== item.id) }));
    toast(`${item.name} deleted.`);
  };

  return (
    <>
      {kind === 'drugs' ? (
        <>
          <View style={styles.statGrid}>
            <Stat label="Total Items" value={String(store.inventory.length)} sub="drug records" color={accent} />
            <Stat label="OK" value={String(store.inventory.filter((i) => i.status === 'OK').length)} sub="healthy stock" color={palette.green} />
            <Stat label="Low Stock" value={String(store.inventory.filter((i) => i.status === 'Low').length)} sub="reorder soon" color={palette.amber} />
            <Stat label="Critical" value={String(store.inventory.filter((i) => i.status === 'Critical').length)} sub="immediate purchase" color={palette.rose} />
          </View>
          <Section title="Drug Inventory" action="Add Drug" onAction={() => openDrug()} />
          <View style={styles.search}>
            <SearchField
              value={drugSearch}
              onChangeText={(value: string) => {
                setDrugSearch(value);
                setDrugPage(1);
              }}
              placeholder="Search medications by name, category, or status"
              accent={accent}
            />
          </View>
          <Text style={[styles.note, { color: theme.textMuted }]}>Showing {pageItems.length} of {filteredInventory.length} medications. Page {safePage} of {totalPages}.</Text>
          {pageItems.map((i) => (
            <Card key={i.id}>
              <View style={styles.rowTopLine}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inlineTitle}>{i.name}</Text>
                  <Text style={styles.inlineSub}>{i.category} - Expiry {i.expiry}</Text>
                </View>
                <Chip label={i.status} />
              </View>
              <Field label="Stock Level" value={`${i.stock}/${i.min} ${i.unit} (max ${i.max ?? '-'})`} />
              <View style={styles.quickGrid}>
                <Button label="Edit" onPress={() => openDrug(i)} variant="ghost" />
                <Button label="Reorder" onPress={() => toast(`Reorder request opened for ${i.name}.`)} />
                <Button label="Delete" onPress={() => deleteDrug(i)} variant="danger" />
              </View>
            </Card>
          ))}
          {!pageItems.length ? <Row title="No medications found" subtitle="Try a different medication name, category, or stock status" meta="-" /> : null}
          {filteredInventory.length > pageSize ? (
            <View style={styles.paginationRow}>
              <Button label="Previous" onPress={() => setDrugPage((page) => Math.max(1, page - 1))} variant="ghost" />
              <Text style={styles.paginationText}>{safePage} / {totalPages}</Text>
              <Button label="Next" onPress={() => setDrugPage((page) => Math.min(totalPages, page + 1))} variant="ghost" />
            </View>
          ) : null}
        </>
      ) : (
        <>
          <View style={styles.statGrid}>
            <Stat label="Online" value={String(store.equipment.filter((e) => e.status === 'Online').length)} sub="operational" color={palette.green} />
            <Stat label="Warning" value={String(store.equipment.filter((e) => e.status === 'Warning').length)} sub="maintenance watch" color={palette.amber} />
            <Stat label="Offline" value={String(store.equipment.filter((e) => e.status === 'Offline').length)} sub="needs service" color={palette.rose} />
            <Stat label="Total" value={String(store.equipment.length)} sub="equipment" color={accent} />
          </View>
          <Section title="Equipment Status" action="Add Equipment" onAction={() => openEq()} />
          {store.equipment.map((e) => (
            <Card key={e.id}>
              <View style={styles.rowTopLine}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inlineTitle}>{e.name}</Text>
                  <Text style={styles.inlineSub}>{e.model} - {e.id}</Text>
                </View>
                <Chip label={e.status} />
              </View>
              <View style={styles.fieldGrid}>
                <Field label="Load" value={e.load} />
                <Field label="Uptime" value={e.uptime} />
                <Field label="Last Calib." value={e.lastCalib} />
                <Field label="Next Due" value={e.nextCalib} />
              </View>
              <Field label="Tests" value={e.tests.join(', ')} />
              <View style={styles.quickGrid}>
                <Button label="Edit" onPress={() => openEq(e)} variant="ghost" />
                <Button label="Maintenance" onPress={() => toast(`Maintenance workflow opened for ${e.name}.`)} />
                <Button label="Delete" onPress={() => deleteEq(e)} variant="danger" />
              </View>
            </Card>
          ))}
        </>
      )}
      <Sheet visible={showDrug} title={editingDrug ? 'Edit Drug' : 'Add Drug'} onClose={() => setShowDrug(false)}>
        <Input label="Drug Name" value={drugForm.name} onChangeText={(name) => setDrugForm((f) => ({ ...f, name }))} />
        <Input label="Category" value={drugForm.category} onChangeText={(category) => setDrugForm((f) => ({ ...f, category }))} />
        <Input label="Current Stock" value={drugForm.stock} onChangeText={(stock) => setDrugForm((f) => ({ ...f, stock }))} />
        <Input label="Minimum Required" value={drugForm.min} onChangeText={(min) => setDrugForm((f) => ({ ...f, min }))} />
        <Input label="Maximum Capacity" value={drugForm.max} onChangeText={(max) => setDrugForm((f) => ({ ...f, max }))} />
        <Input label="Unit" value={drugForm.unit} onChangeText={(unit) => setDrugForm((f) => ({ ...f, unit }))} />
        <Input label="Expiry" value={drugForm.expiry} onChangeText={(expiry) => setDrugForm((f) => ({ ...f, expiry }))} />
        <Button label={editingDrug ? 'Save Changes' : 'Add Drug'} onPress={saveDrug} />
      </Sheet>
      <Sheet visible={showEq} title={editingEq ? 'Edit Equipment' : 'Add Equipment'} onClose={() => setShowEq(false)}>
        <Input label="Equipment Name" value={eqForm.name} onChangeText={(name) => setEqForm((f) => ({ ...f, name }))} />
        <Input label="Model / Manufacturer" value={eqForm.model} onChangeText={(model) => setEqForm((f) => ({ ...f, model }))} />
        <Segment values={[{ label: 'Online', value: 'Online' }, { label: 'Warning', value: 'Warning' }, { label: 'Offline', value: 'Offline' }]} active={eqForm.status} onChange={(status) => setEqForm((f) => ({ ...f, status }))} />
        <Input label="Current Load" value={eqForm.load} onChangeText={(load) => setEqForm((f) => ({ ...f, load }))} />
        <Input label="Last Calibrated" value={eqForm.lastCalib} onChangeText={(lastCalib) => setEqForm((f) => ({ ...f, lastCalib }))} />
        <Input label="Next Calibration Due" value={eqForm.nextCalib} onChangeText={(nextCalib) => setEqForm((f) => ({ ...f, nextCalib }))} />
        <Input label="Uptime" value={eqForm.uptime} onChangeText={(uptime) => setEqForm((f) => ({ ...f, uptime }))} />
        <Input label="Test Capabilities" value={eqForm.tests} onChangeText={(tests) => setEqForm((f) => ({ ...f, tests }))} placeholder="CBC, Reticulocytes" />
        <Button label={editingEq ? 'Save Changes' : 'Add Equipment'} onPress={saveEq} />
      </Sheet>
    </>
  );
}

function Analytics({ toast }: { toast: (m: string) => void }) {
  type Period = 'weekly' | 'monthly' | 'yearly';
  type FilterCat = 'datetime' | 'department' | 'doctor' | 'visittype' | 'payer' | 'payment' | 'pharmacy' | 'labdiag';
  const [revPeriod, setRevPeriod] = useState<Period>('monthly');
  const [visitPeriod, setVisitPeriod] = useState<Period>('monthly');
  const [showFilter, setShowFilter] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [filterCat, setFilterCat] = useState<FilterCat>('datetime');
  const [datePreset, setDatePreset] = useState('This Month');
  const [dateFrom, setDateFrom] = useState('2026-06-01');
  const [dateTo, setDateTo] = useState('2026-06-30');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [selectedVisits, setSelectedVisits] = useState<string[]>([]);
  const [selectedPayers, setSelectedPayers] = useState<string[]>([]);
  const [selectedPayModes, setSelectedPayModes] = useState<string[]>([]);

  const revenue = {
    weekly: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [8400, 9200, 7800, 11000, 10500, 6800, 4200], change: '4.2% vs last week' },
    monthly: { labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], values: [42000, 47000, 51000, 38000, 54000, 59000, 62000], change: '5.1% vs Mar' },
    yearly: { labels: ['2022', '2023', '2024', '2025', '2026 YTD'], values: [420000, 510000, 580000, 640000, 240000], change: '10.3% vs 2024' },
  };
  const allDepartments = [
    { name: 'General Medicine', rev: 'INR 2.35 Cr', pct: 28, color: accent },
    { name: 'Orthopaedics', rev: 'INR 1.85 Cr', pct: 22, color: palette.blue },
    { name: 'Dermatology', rev: 'INR 1.25 Cr', pct: 15, color: palette.purple },
    { name: 'ENT', rev: 'INR 0.95 Cr', pct: 11, color: palette.amber },
    { name: 'Others', rev: 'INR 2.05 Cr', pct: 24, color: palette.green },
  ];
  const allPayers = [
    { name: 'Self Pay', rev: 'INR 4.20 Cr', pct: 50, color: accent },
    { name: 'Insurance', rev: 'INR 2.60 Cr', pct: 31, color: palette.blue },
    { name: 'TPA', rev: 'INR 1.10 Cr', pct: 13, color: palette.amber },
    { name: 'Corporate', rev: 'INR 0.55 Cr', pct: 6, color: palette.purple },
  ];
  const allPayModes = [
    { name: 'Cash', pct: 38, color: accent },
    { name: 'UPI / Online', pct: 32, color: palette.blue },
    { name: 'Card', pct: 18, color: palette.amber },
    { name: 'Insurance / TPA', pct: 12, color: palette.purple },
  ];
  const visitData = {
    weekly: { total: 54, doctors: [{ name: 'Dr. Chen', count: 18, color: accent }, { name: 'Dr. Patel', count: 22, color: palette.amber }, { name: 'Dr. Kim', count: 14, color: palette.green }] },
    monthly: { total: 231, doctors: [{ name: 'Dr. Chen', count: 78, color: accent }, { name: 'Dr. Patel', count: 91, color: palette.amber }, { name: 'Dr. Kim', count: 62, color: palette.green }] },
    yearly: { total: 2630, doctors: [{ name: 'Dr. Chen', count: 890, color: accent }, { name: 'Dr. Patel', count: 1020, color: palette.amber }, { name: 'Dr. Kim', count: 720, color: palette.green }] },
  };
  const depts = ['General Medicine', 'Orthopaedics', 'Dermatology', 'ENT', 'Cardiology', 'Paediatrics', 'Others'];
  const doctors = ['Dr. Chen', 'Dr. Patel', 'Dr. Kim'];
  const visitTypes = ['Consultation', 'Follow-Up', 'Procedure', 'Emergency', 'Wellness Check'];
  const payerTypes = ['Self Pay', 'Insurance', 'TPA', 'Corporate'];
  const paymentModes = ['Cash', 'UPI / Online', 'Card', 'Insurance / TPA'];
  const datePresets = ['Today', 'Yesterday', 'This Week', 'This Month', 'This Quarter', 'This Year', 'Custom Range'];
  const filterTabs: { label: string; value: FilterCat }[] = [
    { label: 'Date', value: 'datetime' },
    { label: 'Dept', value: 'department' },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Visit', value: 'visittype' },
    { label: 'Payer', value: 'payer' },
    { label: 'Payment', value: 'payment' },
    { label: 'Pharmacy', value: 'pharmacy' },
    { label: 'Lab', value: 'labdiag' },
  ];
  const periodFromDate: Period = datePreset === 'Today' || datePreset === 'Yesterday' || datePreset === 'This Week' ? 'weekly' : datePreset === 'This Year' ? 'yearly' : 'monthly';
  const effectiveRevPeriod = hasApplied ? periodFromDate : revPeriod;
  const effectiveVisitPeriod = hasApplied ? periodFromDate : visitPeriod;
  const appliedFilters = hasApplied ? [
    `Date: ${datePreset === 'Custom Range' ? `${dateFrom} to ${dateTo}` : datePreset}`,
    selectedDepts.length ? `Department: ${selectedDepts.join(', ')}` : '',
    selectedDoctors.length ? `Doctor: ${selectedDoctors.join(', ')}` : '',
    selectedVisits.length ? `Visit: ${selectedVisits.join(', ')}` : '',
    selectedPayers.length ? `Payer: ${selectedPayers.join(', ')}` : '',
    selectedPayModes.length ? `Payment: ${selectedPayModes.join(', ')}` : '',
  ].filter((x): x is string => Boolean(x)) : [];
  const doctorWeight = selectedDoctors.length ? selectedDoctors.reduce((sum, doctor) => sum + ({ 'Dr. Chen': 0.34, 'Dr. Patel': 0.39, 'Dr. Kim': 0.27 }[doctor] ?? 0), 0) : 1;
  const revValues = revenue[effectiveRevPeriod].values.map((value) => Math.round(value * doctorWeight));
  const maxRev = Math.max(...revValues, 1);
  const totalRev = revValues[revValues.length - 1];
  const totalLabel = effectiveRevPeriod === 'yearly' ? `INR ${(totalRev / 100000).toFixed(1)}L` : `INR ${totalRev.toLocaleString()}`;
  const consultRev = selectedVisits.length && !selectedVisits.some((v) => v === 'Consultation' || v === 'Follow-Up') ? 0 : Math.round(totalRev * 0.46);
  const procedureRev = selectedVisits.length && !selectedVisits.includes('Procedure') ? 0 : Math.round(totalRev * 0.4);
  const otherRev = selectedVisits.length && !selectedVisits.some((v) => v === 'Emergency' || v === 'Wellness Check') ? 0 : Math.round(totalRev * 0.14);
  const pharmacyRev = selectedVisits.length && !selectedVisits.includes('Pharmacy') ? 0 : Math.round(totalRev * 0.18);
  const labRev = selectedVisits.length && !selectedVisits.includes('Lab & Diagnostics') ? 0 : Math.round(totalRev * 0.12);
  const departments = selectedDepts.length ? allDepartments.filter((d) => selectedDepts.includes(d.name)) : allDepartments;
  const payers = selectedPayers.length ? allPayers.filter((p) => selectedPayers.includes(p.name)) : allPayers;
  const modes = selectedPayModes.length ? allPayModes.filter((p) => selectedPayModes.includes(p.name)) : allPayModes;
  const doctorVisits = selectedDoctors.length ? visitData[effectiveVisitPeriod].doctors.filter((d) => selectedDoctors.includes(d.name)) : visitData[effectiveVisitPeriod].doctors;
  const visitTotal = doctorVisits.reduce((sum, d) => sum + d.count, 0);
  const maxVisit = Math.max(...doctorVisits.map((d) => d.count), 1);

  const clearAnalyticsFilters = () => {
    setHasApplied(false);
    setDatePreset('This Month');
    setDateFrom('2026-06-01');
    setDateTo('2026-06-30');
    setSelectedDepts([]);
    setSelectedDoctors([]);
    setSelectedVisits([]);
    setSelectedPayers([]);
    setSelectedPayModes([]);
  };

  return (
    <>
      <Section title="Analytics & Reports" action={`Custom Filter${appliedFilters.length ? ` (${appliedFilters.length})` : ''}`} onAction={() => setShowFilter(true)} />
      <View style={styles.quickGrid}>
        <Button label="Export Report" onPress={() => toast('Analytics report export simulated.')} variant="ghost" />
      </View>
      <AppliedFilters filters={appliedFilters} onClear={clearAnalyticsFilters} />
      <View style={styles.statGrid}>
        <Stat label="Total OP Revenue" value={totalLabel} sub={hasApplied ? 'filtered view' : revenue[effectiveRevPeriod].change} color={accent} />
        <Stat label="Consultation Revenue" value={`INR ${consultRev.toLocaleString()}`} sub="46% of filtered" color={palette.blue} />
        <Stat label="Procedure Revenue" value={`INR ${procedureRev.toLocaleString()}`} sub="40% of filtered" color={palette.amber} />
        <Stat label="Other Charges" value={`INR ${otherRev.toLocaleString()}`} sub="14% of filtered" color={palette.green} />
        <Stat label="Pharmacy Revenue" value={`INR ${pharmacyRev.toLocaleString()}`} sub="18% of filtered" color={palette.purple} />
        <Stat label="Lab & Diagnostics" value={`INR ${labRev.toLocaleString()}`} sub="12% of filtered" color={palette.rose} />
      </View>
      <Section title="Revenue Trend" />
      <Segment values={[{ label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]} active={revPeriod} onChange={setRevPeriod} />
      <Card>
        <Text style={styles.note}>{totalLabel} - {hasApplied ? 'filtered by custom criteria' : revenue[effectiveRevPeriod].change}</Text>
        <View style={styles.chartRow}>
          {revValues.map((value, index) => (
            <View key={revenue[effectiveRevPeriod].labels[index]} style={styles.chartCol}>
              <Text style={styles.chartTiny}>{`${Math.round(value / 1000)}k`}</Text>
              <View style={[styles.chartBar, { height: 30 + (value / maxRev) * 110, backgroundColor: index === revValues.length - 1 ? accent : `${accent}66` }]} />
              <Text style={styles.chartLabel}>{revenue[effectiveRevPeriod].labels[index]}</Text>
            </View>
          ))}
        </View>
      </Card>
      <Section title="Revenue by Department" />
      <Card>
        {departments.length ? departments.map((d) => (
          <View key={d.name} style={styles.progressRow}>
            <View style={styles.progressTop}>
              <Text style={styles.progressName}>{d.name}</Text>
              <Text style={styles.progressCount}>{d.rev} ({d.pct}%)</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { backgroundColor: d.color, width: `${d.pct}%` }]} />
            </View>
          </View>
        )) : <Text style={styles.note}>No departments match the custom filter.</Text>}
      </Card>
      <Section title="Revenue by Payer Type" />
      <Card>
        {payers.length ? payers.map((p) => (
          <View key={p.name} style={styles.progressRow}>
            <View style={styles.progressTop}>
              <Text style={styles.progressName}>{p.name}</Text>
              <Text style={styles.progressCount}>{p.rev} ({p.pct}%)</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { backgroundColor: p.color, width: `${p.pct}%` }]} />
            </View>
          </View>
        )) : <Text style={styles.note}>No payer types match the custom filter.</Text>}
      </Card>
      <Section title="Payment Mode Split" />
      <Card>
        {modes.length ? modes.map((p) => (
          <View key={p.name} style={styles.progressRow}>
            <View style={styles.progressTop}>
              <Text style={styles.progressName}>{p.name}</Text>
              <Text style={styles.progressCount}>{p.pct}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { backgroundColor: p.color, width: `${p.pct}%` }]} />
            </View>
          </View>
        )) : <Text style={styles.note}>No payment modes match the custom filter.</Text>}
      </Card>
      <Section title="Patient Visits - Doctor Wise" action={`${visitTotal} visits`} />
      <Segment values={[{ label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]} active={visitPeriod} onChange={setVisitPeriod} />
      <Card>
        {doctorVisits.length ? doctorVisits.map((d) => (
          <View key={d.name} style={styles.progressRow}>
            <View style={styles.progressTop}>
              <Text style={styles.progressName}>{d.name}</Text>
              <Text style={styles.progressCount}>{d.count} ({visitTotal ? Math.round((d.count / visitTotal) * 100) : 0}%)</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { backgroundColor: d.color, width: `${(d.count / maxVisit) * 100}%` }]} />
            </View>
          </View>
        )) : <Text style={styles.note}>No doctors match the custom filter.</Text>}
      </Card>
      <Sheet visible={showFilter} title="Analytics Custom Filter" onClose={() => setShowFilter(false)}>
        <Segment values={filterTabs} active={filterCat} onChange={setFilterCat} />
        {filterCat === 'datetime' ? (
          <>
            <Text style={styles.inputLabel}>Date Preset</Text>
            <Segment values={datePresets.map((p) => ({ label: p, value: p }))} active={datePreset} onChange={setDatePreset} />
            {datePreset === 'Custom Range' ? (
              <>
                <Input label="From Date" value={dateFrom} onChangeText={setDateFrom} placeholder="2026-06-01" />
                <Input label="To Date" value={dateTo} onChangeText={setDateTo} placeholder="2026-06-30" />
              </>
            ) : null}
            <Section title="Quick Presets" />
            <ToggleList items={['MTD vs Last MTD', 'QTD vs Last QTD', 'YTD vs Last YTD', 'Last 7 Days vs Prev 7 Days']} selected={[]} onChange={() => {}} />
          </>
        ) : null}
        {filterCat === 'department' ? <><Text style={styles.inputLabel}>Departments</Text><ToggleList items={depts} selected={selectedDepts} onChange={setSelectedDepts} /></> : null}
        {filterCat === 'doctor' ? <><Text style={styles.inputLabel}>Doctors</Text><ToggleList items={doctors} selected={selectedDoctors} onChange={setSelectedDoctors} /></> : null}
        {filterCat === 'visittype' ? <><Text style={styles.inputLabel}>Visit Types</Text><ToggleList items={visitTypes} selected={selectedVisits} onChange={setSelectedVisits} /></> : null}
        {filterCat === 'payer' ? <><Text style={styles.inputLabel}>Payer Types</Text><ToggleList items={payerTypes} selected={selectedPayers} onChange={setSelectedPayers} /></> : null}
        {filterCat === 'payment' ? <><Text style={styles.inputLabel}>Payment Modes</Text><ToggleList items={paymentModes} selected={selectedPayModes} onChange={setSelectedPayModes} /></> : null}
        {filterCat === 'pharmacy' ? <><Text style={styles.inputLabel}>Pharmacy Revenue</Text><Text style={styles.note}>Select Pharmacy to isolate pharmacy revenue in the KPI section.</Text><ToggleList items={['Pharmacy']} selected={selectedVisits} onChange={setSelectedVisits} /></> : null}
        {filterCat === 'labdiag' ? <><Text style={styles.inputLabel}>Lab & Diagnostics Revenue</Text><Text style={styles.note}>Select Lab & Diagnostics to isolate diagnostics revenue in the KPI section.</Text><ToggleList items={['Lab & Diagnostics']} selected={selectedVisits} onChange={setSelectedVisits} /></> : null}
        <View style={styles.quickGrid}>
          <Button label="Reset" onPress={clearAnalyticsFilters} variant="ghost" />
          <Button label="Apply Filter" onPress={() => { setHasApplied(true); setShowFilter(false); }} />
        </View>
      </Sheet>
    </>
  );
}

function Notifications({ store, setStore, toast }: { store: Store; setStore: React.Dispatch<React.SetStateAction<Store>>; toast: (m: string) => void }) {
  const markAll = () => {
    setStore((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
    toast('All notifications marked read.');
  };
  return (
    <>
      <Section title="Notifications" action="Mark all read" onAction={markAll} />
      {store.notifications.map((n) => (
        <Row
          key={n.id}
          title={n.title}
          subtitle={n.body}
          meta={n.time}
          status={n.read ? 'Read' : n.type}
          onPress={() => setStore((s) => ({ ...s, notifications: s.notifications.map((x) => x.id === n.id ? { ...x, read: true } : x) }))}
        />
      ))}
    </>
  );
}

function Staff({ store, setStore, toast }: { store: Store; setStore: React.Dispatch<React.SetStateAction<Store>>; toast: (m: string) => void }) {
  const [tab, setTab] = useState<'all' | StaffRole>('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HaStaffMember | null>(null);
  const [viewing, setViewing] = useState<HaStaffMember | null>(null);
  const [credential, setCredential] = useState<{ email: string; pass: string } | null>(null);
  const [form, setForm] = useState({ name: '', role: 'Doctor' as StaffRole, department: '', email: '', phone: '' });
  const filtered = tab === 'all' ? store.staff : store.staff.filter((s) => s.role === tab);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', role: 'Doctor', department: 'Cardiology', email: '', phone: '' });
    setShowForm(true);
  };

  const openEdit = (s: HaStaffMember) => {
    setEditing(s);
    setForm({ name: s.name, role: s.role, department: s.department, email: s.email, phone: s.phone });
    setShowForm(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return toast('Enter staff name and email.');
    if (editing) {
      setStore((s) => ({ ...s, staff: s.staff.map((x) => x.id === editing.id ? { ...x, ...form } : x) }));
      toast('Staff profile updated.');
    } else {
      const member: HaStaffMember = { id: id('S'), name: form.name, role: form.role, department: form.department || form.role, email: form.email, phone: form.phone, status: 'Active', specialization: form.role === 'Doctor' ? form.department : undefined };
      const pass = tempPassword();
      setStore((s) => ({ ...s, staff: [member, ...s.staff] }));
      setCredential({ email: member.email, pass });
    }
    setShowForm(false);
  };

  return (
    <>
      <View style={styles.statGrid}>
        <Stat label="Staff" value={String(store.staff.length)} sub="active profiles" color={accent} />
        <Stat label="Doctors" value={String(store.staff.filter((s) => s.role === 'Doctor').length)} sub="on roster" color={palette.blue} />
      </View>
      <Segment
        values={[{ label: 'All', value: 'all' }, { label: 'Doctors', value: 'Doctor' }, { label: 'Reception', value: 'Receptionist' }, { label: 'Pharmacy', value: 'Pharmacist' }, { label: 'Lab', value: 'LabTech' }]}
        active={tab}
        onChange={setTab}
      />
      <Section title="Staff Directory" action="Create Staff" onAction={openCreate} />
      {filtered.map((s) => (
        <Row
          key={s.id}
          title={s.name}
          subtitle={`${s.role} - ${s.department}`}
          meta={`${s.email} - ${s.phone}`}
          status={s.status}
          onPress={() => setViewing(s)}
        />
      ))}
      <Sheet visible={showForm} title={editing ? 'Edit Staff Profile' : 'Create Staff Profile'} onClose={() => setShowForm(false)}>
        <Segment values={[{ label: 'Doctor', value: 'Doctor' }, { label: 'Reception', value: 'Receptionist' }, { label: 'Pharmacy', value: 'Pharmacist' }, { label: 'Lab Tech', value: 'LabTech' }]} active={form.role} onChange={(role) => setForm((f) => ({ ...f, role }))} />
        <Input label="Full Name" value={form.name} onChangeText={(name) => setForm((f) => ({ ...f, name }))} />
        <Input label="Department / Specialization" value={form.department} onChangeText={(department) => setForm((f) => ({ ...f, department }))} />
        <Input label="Work Email" value={form.email} onChangeText={(email) => setForm((f) => ({ ...f, email }))} />
        <Input label="Phone" value={form.phone} onChangeText={(phone) => setForm((f) => ({ ...f, phone }))} />
        <Button label={editing ? 'Save Changes' : 'Create Profile & Generate Credentials'} onPress={save} />
      </Sheet>
      <Sheet visible={!!viewing} title="Staff Detail" onClose={() => setViewing(null)}>
        {viewing ? <>
          <Field label="Name" value={viewing.name} />
          <Field label="Role" value={viewing.role} />
          <Field label="Department" value={viewing.department} />
          <Field label="Email" value={viewing.email} />
          <Field label="Phone" value={viewing.phone} />
          <Button label="Edit Profile" onPress={() => { const s = viewing; setViewing(null); openEdit(s); }} />
          <Button label="Reset Password" onPress={() => { const pass = tempPassword(); setCredential({ email: viewing.email, pass }); setViewing(null); }} variant="danger" />
        </> : null}
      </Sheet>
      <Sheet visible={!!credential} title="Temporary Credentials" onClose={() => setCredential(null)}>
        {credential ? <>
          <Field label="Login Email" value={credential.email} />
          <Field label="Temporary Password" value={credential.pass} />
          <Text style={styles.note}>Show once. Staff must change this password on first login.</Text>
          <Button label="Done" onPress={() => setCredential(null)} />
        </> : null}
      </Sheet>
    </>
  );
}

function Reviews({ store, toast }: { store: Store; toast: (m: string) => void }) {
  const [doctor, setDoctor] = useState('All Doctors');
  const [rating, setRating] = useState('All Ratings');
  const [status, setStatus] = useState<'All' | 'New' | 'Read'>('All');
  const [showFilter, setShowFilter] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [selected, setSelected] = useState<HaReview | null>(null);
  const doctors = ['All Doctors', ...Array.from(new Set(store.reviews.map((r) => r.doctor)))];
  const ratingOptions = [
    { label: 'All Ratings', value: 'All Ratings' },
    { label: '5 Stars', value: '5' },
    { label: '4 Stars', value: '4' },
    { label: '3 Stars', value: '3' },
    { label: '2 Stars', value: '2' },
    { label: '1 Star', value: '1' },
  ];
  const filtered = store.reviews.filter((r) =>
    (doctor === 'All Doctors' || r.doctor === doctor) &&
    (rating === 'All Ratings' || r.rating === Number(rating)) &&
    (status === 'All' || r.status === status)
  );
  const activeReviewFilters = [
    doctor !== 'All Doctors' ? `Doctor: ${doctor}` : '',
    rating !== 'All Ratings' ? `Rating: ${rating}` : '',
    status !== 'All' ? `Status: ${status}` : '',
  ].filter(Boolean);
  const clearReviewFilters = () => {
    setDoctor('All Doctors');
    setRating('All Ratings');
    setStatus('All');
    setReviewPage(1);
  };
  const reviewsPerPage = 10;
  const reviewTotalPages = Math.max(1, Math.ceil(filtered.length / reviewsPerPage));
  const safeReviewPage = Math.min(reviewPage, reviewTotalPages);
  const pagedReviews = filtered.slice((safeReviewPage - 1) * reviewsPerPage, safeReviewPage * reviewsPerPage);
  const avg = store.reviews.length ? (store.reviews.reduce((sum, r) => sum + r.rating, 0) / store.reviews.length).toFixed(1) : '0.0';
  const recPct = store.reviews.length ? Math.round((store.reviews.filter((r) => r.recommend).length / store.reviews.length) * 100) : 0;
  const doctorSummary = doctors.filter((d) => d !== 'All Doctors').map((d) => {
    const records = store.reviews.filter((r) => r.doctor === d);
    return { doctor: d, count: records.length, avg: (records.reduce((sum, r) => sum + r.rating, 0) / records.length).toFixed(1) };
  });
  const ratingKeys = Object.keys(HA_RATING_LABELS) as Array<keyof HaReview['ratings']>;
  const paramAvgs = ratingKeys.map((key) => ({
    key,
    label: HA_RATING_LABELS[key],
    value: store.reviews.reduce((sum, r) => sum + r.ratings[key], 0) / store.reviews.length,
  }));
  return (
    <>
      <View style={styles.statGrid}>
        <Stat label="Overall Rating" value={`${avg}/5`} sub="across reviews" color={palette.amber} />
        <Stat label="Total Reviews" value={String(store.reviews.length)} sub={`${store.reviews.filter((r) => r.status === 'New').length} new`} color={accent} />
        <Stat label="Recommend" value={`${recPct}%`} sub="would recommend" color={palette.green} />
        <Stat label="New Reviews" value={String(store.reviews.filter((r) => r.status === 'New').length)} sub="need response" color={accent} />
      </View>
      <Section title="Average Score by Parameter" />
      <Card>
        {paramAvgs.map((p) => (
          <View key={p.key} style={styles.progressRow}>
            <View style={styles.progressTop}>
              <Text style={styles.progressName}>{p.label}</Text>
              <Text style={styles.progressCount}>{p.value.toFixed(1)}/5</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { backgroundColor: p.value >= 4 ? palette.green : p.value >= 3 ? palette.amber : palette.rose, width: `${(p.value / 5) * 100}%` }]} />
            </View>
          </View>
        ))}
      </Card>
      <Section title="Doctor-wise Rating Summary" />
      {doctorSummary.map((d) => <Row key={d.doctor} title={d.doctor} subtitle={`${d.count} reviews`} meta={`${d.avg}/5 average`} status={Number(d.avg) >= 4 ? 'Strong' : 'Needs review'} />)}
      <Section title="Review Filters" action={`Custom Filter${activeReviewFilters.length ? ` (${activeReviewFilters.length})` : ''}`} onAction={() => setShowFilter(true)} />
      <AppliedFilters filters={activeReviewFilters} onClear={clearReviewFilters} />
      <Section title="Patient Feedback" action="Export" onAction={() => toast('Reviews export simulated.')} />
      <Text style={styles.note}>Showing {pagedReviews.length} of {filtered.length} matching reviews. Page {safeReviewPage} of {reviewTotalPages}.</Text>
      {pagedReviews.map((r) => <Row key={r.id} title={`${r.patient} - ${r.rating}/5`} subtitle={r.comment} meta={`${r.doctor} - ${r.department} - ${r.visitDate}`} status={r.status} onPress={() => setSelected(r)} />)}
      {!filtered.length ? <Row title="No reviews match this filter" subtitle="Adjust doctor, rating, or status filters" meta="-" /> : null}
      {filtered.length > reviewsPerPage ? (
        <View style={styles.paginationRow}>
          <Button label="Previous" onPress={() => setReviewPage((page) => Math.max(1, page - 1))} variant="ghost" />
          <Text style={styles.paginationText}>{safeReviewPage} / {reviewTotalPages}</Text>
          <Button label="Next" onPress={() => setReviewPage((page) => Math.min(reviewTotalPages, page + 1))} variant="ghost" />
        </View>
      ) : null}
      <Sheet visible={!!selected} title="Review Detail" onClose={() => setSelected(null)}>
        {selected ? <>
          <Field label="Patient" value={`${selected.patient} (${selected.patientId})`} />
          <Field label="Doctor" value={selected.doctor} />
          <Field label="Department" value={selected.department} />
          <Field label="Visit Type" value={selected.visitType} />
          <Field label="Visit Date" value={selected.visitDate} />
          <Field label="Received" value={selected.receivedDate} />
          <Field label="Rating" value={`${selected.rating}/5`} />
          <Field label="Recommendation" value={selected.recommend ? 'Yes, recommends' : 'Does not recommend'} />
          <Field label="Comment" value={selected.comment} />
          <Section title="Parameter Ratings" />
          {ratingKeys.map((key) => (
            <View key={key} style={styles.progressRow}>
              <View style={styles.progressTop}>
                <Text style={styles.progressName}>{HA_RATING_LABELS[key]}</Text>
                <Text style={styles.progressCount}>{selected.ratings[key]}/5</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { backgroundColor: toneColor(String(selected.ratings[key])), width: `${(selected.ratings[key] / 5) * 100}%` }]} />
              </View>
            </View>
          ))}
        </> : null}
      </Sheet>
      <Sheet visible={showFilter} title="Reviews Custom Filter" onClose={() => setShowFilter(false)}>
        <Text style={styles.note}>Filter reviews by doctor, star rating, and read status.</Text>
        <View style={styles.reviewFilterSummary}>
          <Field label="Matching Reviews" value={String(filtered.length)} />
          <Field label="Total Reviews" value={String(store.reviews.length)} />
        </View>
        <Text style={styles.inputLabel}>Doctor</Text>
        <Segment values={doctors.map((d) => ({ label: d.replace('Dr. ', ''), value: d }))} active={doctor} onChange={(next) => { setDoctor(next); setReviewPage(1); }} />
        <Text style={styles.inputLabel}>Rating</Text>
        <Segment values={ratingOptions} active={rating} onChange={(next) => { setRating(next); setReviewPage(1); }} />
        <Text style={styles.inputLabel}>Status</Text>
        <Segment values={[{ label: 'All', value: 'All' }, { label: 'New', value: 'New' }, { label: 'Read', value: 'Read' }]} active={status} onChange={(next) => { setStatus(next); setReviewPage(1); }} />
        <View style={styles.quickGrid}>
          <Button label="Reset" onPress={clearReviewFilters} variant="ghost" />
          <Button label="Apply Filter" onPress={() => setShowFilter(false)} />
        </View>
      </Sheet>
    </>
  );
}

function Settings({
  store,
  setStore,
  toast,
  scrollToTop,
}: {
  store: Store;
  setStore: React.Dispatch<React.SetStateAction<Store>>;
  toast: (m: string) => void;
  scrollToTop: () => void;
}) {
  const { theme } = useTheme();
  const [tab, setTab] = useState<'profile' | 'billing'>('profile');
  const [paying, setPaying] = useState<HaPlanCard | null>(null);
  const [payment, setPayment] = useState({ name: '', card: '', exp: '', cvv: '' });
  const current = HA_PLAN_CARDS.find((p) => p.id === store.subscription.plan);
  const active = store.subscription.status !== 'Cancelled';

  const startPayment = (plan: HaPlanCard) => {
    if (plan.priceValue === null) {
      toast('Contact sales request submitted for Enterprise.');
      return;
    }
    setPaying(plan);
  };

  const completePayment = () => {
    if (!paying) return;
    const invoice: HaInvoice = {
      id: `INV-2026-${String(store.invoices.length + 149).padStart(4, '0')}`,
      plan: paying.id,
      amount: paying.price,
      date: '02 Jul 2026',
      status: 'paid',
    };
    setStore((s) => ({
      ...s,
      subscription: { plan: paying.id, status: 'New', startedOn: '02 Jul 2026', validUntil: '01 Aug 2026' },
      invoices: [invoice, ...s.invoices],
    }));
    setPayment({ name: '', card: '', exp: '', cvv: '' });
    setPaying(null);
    toast(`${paying.name} subscription activated.`);
  };

  const cancelSubscription = () => {
    setStore((s) => ({ ...s, subscription: { ...s.subscription, status: 'Cancelled' } }));
    toast('Subscription cancelled. Access remains until the valid-until date.');
  };

  return (
    <>
      <View style={[styles.settingsTabs, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {[
          { label: 'Profile', value: 'profile' as const },
          { label: 'Billing & Plans', value: 'billing' as const },
        ].map((item) => {
          const selected = tab === item.value;
          return (
            <TouchableOpacity
              key={item.value}
              style={[styles.settingsTab, selected && { backgroundColor: accent }]}
              onPress={() => {
                setTab(item.value);
                scrollToTop();
              }}
            >
              <Text style={[styles.settingsTabText, { color: selected ? '#fff' : theme.textMuted }]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {tab === 'profile' ? (
        <>
          <Section title="Hospital Profile" action="Download docs" onAction={() => toast('Registration documents export simulated.')} />
          <Card>
            <Field label="Legal Name" value={HA_PROFILE.legalName} />
            <Field label="Facility Type" value={HA_PROFILE.facilityType} />
            <Field label="Beds" value={String(HA_PROFILE.beds)} />
            <Field label="Established" value={HA_PROFILE.established} />
            <Field label="Address" value={`${HA_PROFILE.addressLine}, ${HA_PROFILE.city} - ${HA_PROFILE.pincode}`} />
            <Field label="State / UT" value={HA_PROFILE.state} />
            <Field label="GSTIN" value={HA_PROFILE.gstin} />
            <Field label="PAN" value={HA_PROFILE.pan} />
            <Field label="CEA Registration" value={HA_PROFILE.cea} />
          </Card>
          <Section title="Contact Information" />
          <Card>
            <Field label="Hospital Admin" value={HA_PROFILE.contactName} />
            <Field label="Designation" value={HA_PROFILE.designation} />
            <Field label="Work Email" value={HA_PROFILE.email} />
            <Field label="Phone" value={HA_PROFILE.phone} />
            <Field label="Alternate Phone" value={HA_PROFILE.altPhone} />
          </Card>
          <Section title="Licenses" />
          {HA_PROFILE.licenses.map((license) => <Row key={license.no} title={license.name} subtitle={license.no} meta={`Valid until ${license.valid}`} status="Verified" />)}
          <Section title="Documents" />
          {HA_PROFILE.documents.map((doc) => <Row key={doc.name} title={doc.name} subtitle={`${doc.kind} - ${doc.size}`} meta="Tap to download" status="Available" onPress={() => toast(`${doc.name} download simulated.`)} />)}
        </>
      ) : (
        <>
          <Section title="Billing & Plan" />
          <View style={styles.billingHero}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles.billingEyebrow}>Current Subscription</Text>
              <View style={styles.billingPlanRow}>
                <Text style={styles.billingPlan}>{current?.name ?? store.subscription.plan}</Text>
                <View style={styles.billingStatusPill}>
                  <Text style={styles.billingStatusText}>{store.subscription.status}</Text>
                </View>
              </View>
              <Text style={styles.billingMeta}>
                Started {store.subscription.startedOn} - {current ? `${current.price} ${current.cadence}` : '-'} - renews {store.subscription.validUntil}
              </Text>
            </View>
            {active ? (
              <TouchableOpacity style={styles.billingCancel} onPress={cancelSubscription}>
                <Text style={styles.billingCancelText}>Cancel subscription</Text>
              </TouchableOpacity>
            ) : current ? (
              <TouchableOpacity style={styles.billingRenew} onPress={() => startPayment(current)}>
                <Text style={styles.billingRenewText}>Renew subscription</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <Section title="Plans" />
          {HA_PLAN_CARDS.map((plan) => {
            const isCurrent = plan.id === store.subscription.plan && active;
            return (
              <View key={plan.id} style={[styles.planCard, isCurrent && styles.planCardCurrent]}>
                <View style={styles.planBadgeRow}>
                  {plan.popular ? (
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>MOST POPULAR</Text>
                    </View>
                  ) : null}
                  {isCurrent ? (
                    <View style={[styles.planBadge, styles.planBadgeDark]}>
                      <Text style={styles.planBadgeText}>CURRENT PLAN</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.planPriceRow}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  <Text style={styles.planCadence}>{plan.cadence}</Text>
                </View>
                <Text style={styles.planTag}>{plan.tagline}</Text>
                <View style={styles.planSeat}>
                  <Text style={styles.planSeatText}>{plan.seats}</Text>
                </View>
                {plan.features.map((feature) => (
                  <View key={feature} style={styles.planFeature}>
                    <Icon name="check" size={14} color={accent} strokeWidth={2.6} />
                    <Text style={[styles.planFeatureText, { color: theme.textSecondary }]}>{feature}</Text>
                  </View>
                ))}
                {isCurrent ? (
                  <TouchableOpacity style={styles.planCurrentButton} onPress={() => toast('This is your current active plan.')}>
                    <Text style={styles.planCurrentButtonText}>Current plan</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.planActionButton} onPress={() => startPayment(plan)}>
                    <Text style={styles.planActionButtonText}>{plan.priceValue === null ? 'Contact sales' : plan.priceValue === 0 ? 'Start trial' : 'Upgrade'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
          <Section title="Recent Invoices" />
          {store.invoices.map((invoice) => (
            <TouchableOpacity key={invoice.id} style={styles.invoiceCard} onPress={() => toast(`${invoice.id} invoice download simulated.`)}>
              <View style={styles.invoiceTop}>
                <View>
                  <Text style={styles.invoiceId}>{invoice.id}</Text>
                  <Text style={styles.invoiceMeta}>{invoice.date}</Text>
                </View>
                <Chip label={invoice.status === 'paid' ? 'Paid' : 'Failed'} />
              </View>
              <View style={styles.invoiceGrid}>
                <Field label="Plan" value={invoice.plan.toUpperCase()} />
                <Field label="Amount" value={invoice.amount} />
              </View>
              <Text style={styles.invoiceDownload}>Download invoice PDF</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
      <Sheet visible={!!paying} title={paying ? `${paying.name} Checkout` : 'Checkout'} onClose={() => setPaying(null)}>
        {paying ? <>
          <Field label="Plan" value={`${paying.name} - ${paying.price} ${paying.cadence}`} />
          <Text style={styles.note}>Demo checkout only. No real payment is processed in this Expo preview.</Text>
          <Input label="Name on Card" value={payment.name} onChangeText={(name) => setPayment((p) => ({ ...p, name }))} placeholder="Anita Reddy" />
          <Input label="Card Number" value={payment.card} onChangeText={(card) => setPayment((p) => ({ ...p, card }))} placeholder="4242 4242 4242 4242" />
          <Input label="Expiry" value={payment.exp} onChangeText={(exp) => setPayment((p) => ({ ...p, exp }))} placeholder="MM/YY" />
          <Input label="CVV" value={payment.cvv} onChangeText={(cvv) => setPayment((p) => ({ ...p, cvv }))} placeholder="123" />
          <Button label={`Pay ${paying.price}`} onPress={completePayment} />
        </> : null}
      </Sheet>
    </>
  );
}

function ModuleBody({
  active,
  store,
  setStore,
  go,
  toast,
  scrollToTop,
}: {
  active: HaModuleId;
  store: Store;
  setStore: React.Dispatch<React.SetStateAction<Store>>;
  go: (m: HaModuleId) => void;
  toast: (m: string) => void;
  scrollToTop: () => void;
}) {
  if (active === 'dashboard') return <Dashboard store={store} go={go} />;
  if (active === 'patients') return <Patients store={store} setStore={setStore} toast={toast} />;
  if (active === 'appointments') return <Appointments store={store} setStore={setStore} toast={toast} />;
  if (active === 'emr') return <EMR store={store} toast={toast} />;
  if (active === 'pharmacy') return <Pharmacy store={store} setStore={setStore} toast={toast} />;
  if (active === 'lab') return <Lab store={store} setStore={setStore} toast={toast} />;
  if (active === 'analytics') return <Analytics toast={toast} />;
  if (active === 'notifications') return <Notifications store={store} setStore={setStore} toast={toast} />;
  if (active === 'staff') return <Staff store={store} setStore={setStore} toast={toast} />;
  if (active === 'reviews') return <Reviews store={store} toast={toast} />;
  return <Settings store={store} setStore={setStore} toast={toast} scrollToTop={scrollToTop} />;
}

export default function HospitalAdminPortalScreen() {
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView | null>(null);
  const [active, setActive] = useState<HaModuleId>('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [store, setStore] = useState<Store>({
    patients: HA_PATIENTS,
    appointments: HA_APPOINTMENTS,
    prescriptions: HA_PRESCRIPTIONS,
    labs: HA_LAB_ORDERS,
    inventory: HA_INVENTORY,
    equipment: HA_EQUIPMENT,
    staff: HA_STAFF,
    reviews: HA_REVIEWS,
    notifications: HA_NOTIFICATIONS,
    subscription: HA_SUBSCRIPTION,
    invoices: HA_INVOICES,
  });

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });
  };

  const selectModule = (module: HaModuleId) => {
    setActive(module);
    scrollToTop();
    pulseFor(420, 'Loading module');
  };

  const quickStats = useMemo(() => ({
    alerts: store.notifications.filter((n) => !n.read).length,
    critical: store.labs.filter((l) => l.status === 'Critical').length + store.inventory.filter((i) => i.status === 'Critical').length,
  }), [store.inventory, store.labs, store.notifications]);

  return (
    <View style={[styles.safe, { backgroundColor: theme.bg }]}>
      <Header active={active} onMenu={() => setDrawerOpen(true)} />
      <Drawer open={drawerOpen} active={active} onClose={() => setDrawerOpen(false)} onSelect={selectModule} onSignOut={signOut} />
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Escalation band — the operational state an admin checks first. */}
        <View style={[styles.alertBand, { backgroundColor: alpha(palette.rose, 0.1), borderColor: alpha(palette.rose, 0.26) }]}>
          <Icon name="alert" size={16} color={palette.rose} strokeWidth={2.2} />
          <Text style={[T.smallStrong, styles.alertBandText, { color: palette.rose }]}>
            {quickStats.alerts} unread alerts · {quickStats.critical} critical
          </Text>
        </View>
        <ModuleBody active={active} store={store} setStore={setStore} go={selectModule} toast={showToast} scrollToTop={scrollToTop} />
      </ScrollView>
      {!!toast && (
        <View style={[styles.toast, { backgroundColor: theme.text }]}>
          <Icon name="checkCircle" size={16} color={theme.bg} strokeWidth={2.2} />
          <Text style={[T.smallStrong, styles.toastText, { color: theme.bg }]}>{toast}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.huge, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },

  // Escalation band under the header
  alertBand: { alignItems: 'center', borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2 },
  alertBandText: { flex: 1 },

  // Spacing hooks for the kit-backed primitives
  chipGap: { marginTop: spacing.sm },
  btnGap: { marginTop: spacing.sm },
  cardGap: { marginBottom: spacing.md },
  fieldGap: { marginTop: spacing.lg },
  segmentGap: { marginTop: spacing.lg },
  pillWrap: { marginTop: spacing.lg },
  inputLabel: { ...T.label, marginBottom: spacing.sm, marginTop: spacing.lg },
  search: { marginTop: spacing.md },
  note: { ...T.small, paddingVertical: spacing.sm },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  quickGrid: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  rowTopLine: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' },

  // Inline text inside cards + sheets
  inlineTitle: { ...T.titleSm },
  inlineSub: { ...T.caption, marginTop: 2 },
  avatar: { alignItems: 'center', backgroundColor: alpha(accent, 0.12), borderRadius: radius.md, height: 44, justifyContent: 'center', width: 44 },
  avatarText: { ...T.titleSm, color: accent },
  profileHead: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  profileName: { ...T.h3 },
  profileSub: { ...T.small, marginTop: 3 },

  // Multi-select toggles
  toggleList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  toggleItem: { alignItems: 'center', borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2 },
  checkbox: { alignItems: 'center', borderRadius: radius.xs, borderWidth: 1.6, height: 19, justifyContent: 'center', width: 19 },
  toggleText: { ...T.captionStrong },

  // Analytics charts
  chartRow: { alignItems: 'flex-end', flexDirection: 'row', gap: spacing.sm, height: 150, marginTop: spacing.lg },
  chartCol: { alignItems: 'center', flex: 1, gap: 6 },
  chartBar: { borderRadius: radius.xs, width: '72%' },
  chartLabel: { ...T.caption, fontSize: 10 },
  chartTiny: { ...T.caption, fontSize: 10 },
  progressRow: { marginBottom: spacing.md },
  progressTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressName: { ...T.captionStrong },
  progressCount: { ...T.caption },
  progressTrack: { borderRadius: radius.pill, height: 8, overflow: 'hidden' },
  progressFill: { borderRadius: radius.pill, height: '100%' },
  weekBar: { alignItems: 'flex-end', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  weekTitle: { ...T.captionStrong, marginTop: spacing.lg },

  // Appointment day strip
  dayPill: { alignItems: 'center', borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, minWidth: 62, paddingVertical: spacing.sm + 2 },
  dayName: { ...T.caption, fontSize: 10 },
  dayNumber: { ...T.titleSm, marginTop: 2 },
  dayCount: { ...T.caption, fontSize: 10, marginTop: 2 },

  // Patient quick-pick strip
  patientStrip: { gap: spacing.sm, paddingVertical: 2 },
  patientPill: { borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, minWidth: 150, padding: spacing.md },
  patientPillName: { ...T.captionStrong },
  patientPillSub: { ...T.caption, marginTop: 2 },

  // Pagination
  paginationRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'center', marginVertical: spacing.lg },
  paginationText: { ...T.captionStrong },
  reviewFilterSummary: { ...T.caption, marginTop: spacing.sm },

  // Settings tabs
  settingsTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  settingsTab: { borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2 },
  settingsTabText: { ...T.captionStrong },

  // Billing + plans
  billingHero: { borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth * 2, marginTop: spacing.lg, padding: spacing.xl },
  billingEyebrow: { ...T.eyebrow },
  billingPlanRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', marginTop: spacing.sm },
  billingPlan: { ...T.h2 },
  billingMeta: { ...T.small, marginTop: spacing.sm },
  billingStatusPill: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 5 },
  billingStatusText: { ...T.chip },
  billingRenew: { alignItems: 'center', borderRadius: radius.md, justifyContent: 'center', marginTop: spacing.lg, minHeight: 46 },
  billingRenewText: { ...T.button, color: '#FAFAF7' },
  billingCancel: { alignItems: 'center', justifyContent: 'center', marginTop: spacing.md, minHeight: 40 },
  billingCancelText: { ...T.smallStrong },

  planCard: { borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth * 2, marginBottom: spacing.md, padding: spacing.xl },
  planCardCurrent: { borderWidth: 2 },
  planBadgeRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  planBadge: { borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4 },
  planBadgeDark: { backgroundColor: palette.ink },
  planBadgeText: { ...T.chip },
  planName: { ...T.h3, marginTop: spacing.md },
  planTag: { ...T.caption, marginTop: 3 },
  planPriceRow: { alignItems: 'baseline', flexDirection: 'row', gap: 6, marginTop: spacing.md },
  planPrice: { ...T.numeral },
  planCadence: { ...T.caption },
  planSeat: { alignItems: 'center', flexDirection: 'row', gap: 6, marginTop: spacing.sm },
  planSeatText: { ...T.caption },
  planFeature: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  planFeatureMark: { ...T.captionStrong },
  planFeatureText: { ...T.caption, flex: 1 },
  planActionButton: { alignItems: 'center', borderRadius: radius.md, justifyContent: 'center', marginTop: spacing.lg, minHeight: 46 },
  planActionButtonText: { ...T.button, color: '#FAFAF7' },
  planCurrentButton: { alignItems: 'center', borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, justifyContent: 'center', marginTop: spacing.lg, minHeight: 46 },
  planCurrentButtonText: { ...T.button },

  // Invoices
  invoiceGrid: { gap: spacing.sm, marginTop: spacing.lg },
  invoiceCard: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth * 2, padding: spacing.lg },
  invoiceTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  invoiceId: { ...T.mono },
  invoiceMeta: { ...T.caption, marginTop: 4 },
  invoiceDownload: { ...T.captionStrong },

  toast: { alignItems: 'center', borderRadius: radius.lg, bottom: 28, flexDirection: 'row', gap: spacing.sm, left: spacing.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, position: 'absolute', right: spacing.xl },
  toastText: { flex: 1 },
});
