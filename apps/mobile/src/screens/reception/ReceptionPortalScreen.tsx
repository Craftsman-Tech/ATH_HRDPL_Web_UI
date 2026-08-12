import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { fontSize, fontWeight, palette, radius, spacing } from '@vexoo/shared';
import { useAuth, useTheme } from '../../components/AppContexts';
import { T, alpha, elevation } from '../../theme';
import { moduleIcon } from '../../data/icons';
import {
  AppHeader, Avatar, Button as UiButton, Chip as UiChip, Field as Field2, IconButton,
  NavDrawer, PillRow, ReadField, SectionHeader, Sheet as UiSheet, StatTile, Surface,
  pulseFor, toneFor, withPulse, type IconName,
} from '../../ui';
import {
  RECEPTION_APPOINTMENTS, RECEPTION_BILLS, RECEPTION_DOCTORS, RECEPTION_MESSAGE_TEMPLATES,
  RECEPTION_MESSAGE_HISTORY, RECEPTION_MODULES, RECEPTION_PATIENTS, RECEPTION_QUEUE, RECEPTION_REPORT_RECORDS, RECEPTION_SERVICES,
  type ReceptionAppointment, type ReceptionBill, type ReceptionBillLine, type ReceptionMessageHistory,
  type ReceptionModuleId, type ReceptionNotification, type ReceptionPatient, type ReceptionPaymentMode,
  type ReceptionPriority, type ReceptionQueueEntry, type ReceptionReportRecord, type ReceptionVisitType,
} from '../../data/receptionData';

const accent = palette.roleReceptionist;
const nowTime = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
const initials = (name: string) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
const billTotal = (bill: ReceptionBill) => bill.lines.reduce((sum, line) => sum + line.charge * line.qty, 0);
const todayIso = () => new Date().toISOString().slice(0, 10);

function useElapsed(start: number, running: boolean) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [running]);
  const seconds = Math.max(0, Math.floor((now - start) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return hours ? `${hours}h ${String(minutes).padStart(2, '0')}m` : `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}

const htmlEscape = (value: string | number | undefined) => String(value ?? '-').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char] ?? char));

async function printOrShareDocument(title: string, rows: [string, string | number | undefined][], share = false) {
  // Rendering the PDF and handing it to the share sheet both take a beat on
  // device, so the heartbeat runs for the whole round trip.
  return withPulse(() => runPrintOrShare(title, rows, share), share ? 'Preparing document' : 'Sending to printer');
}

async function runPrintOrShare(title: string, rows: [string, string | number | undefined][], share: boolean) {
  const html = `<html><body style="font-family:Arial;padding:28px;color:#172033"><h1>${htmlEscape(title)}</h1>${rows.map(([label, value]) => `<div style="padding:10px 0;border-bottom:1px solid #ddd"><b>${htmlEscape(label)}</b><span style="float:right">${htmlEscape(value)}</span></div>`).join('')}</body></html>`;
  try {
    if (!share) {
      await Print.printAsync({ html });
      return;
    }
    const file = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(file.uri, { mimeType:'application/pdf', dialogTitle:title });
    else await Share.share({ title, message:rows.map(([label, value]) => `${label}: ${value ?? '-'}`).join('\n') });
  } catch {
    Alert.alert('Action unavailable', 'The device could not open the print or sharing service.');
  }
}

function tone(value: string) {
  const text = value.toLowerCase();
  if (text.includes('emergency') || text.includes('urgent') || text.includes('cancel') || text.includes('no-show') || text.includes('abnormal')) return palette.rose;
  if (text.includes('waiting') || text.includes('pending') || text.includes('scheduled')) return palette.amber;
  if (text.includes('paid') || text.includes('complete') || text.includes('confirmed') || text.includes('sent')) return palette.green;
  if (text.includes('doctor') || text.includes('queue')) return palette.purple;
  return accent;
}

/* ── Local primitives ──────────────────────────────────────────────────────
   Signatures are unchanged so the module renderers below stay as they were;
   each now delegates to the shared UI kit for elevation, icons, focus rings
   and press physics. */

function Chip({ label }: { label: string }) {
  return <UiChip label={label} tone={toneFor(label)} dot style={styles.chipGap} />;
}

function Button({ label, onPress, variant = 'primary' }: { label: string; onPress: () => void; variant?: 'primary' | 'ghost' | 'danger' }) {
  return <UiButton label={label} onPress={onPress} variant={variant} accent={accent} icon={buttonIcon(label)} style={styles.btnGap} />;
}

/** Leading icon for an action label, so buttons read at a glance. */
function buttonIcon(label: string): IconName | undefined {
  const v = label.toLowerCase();
  if (/confirm|arrival|done|complete|paid|register/.test(v)) return 'checkCircle';
  if (/call/.test(v)) return 'bell';
  if (/add|new|create|quick/.test(v)) return 'plus';
  if (/print/.test(v)) return 'printer';
  if (/share|send|notify/.test(v)) return 'send';
  if (/save/.test(v)) return 'download';
  if (/edit/.test(v)) return 'edit';
  if (/logout|sign out/.test(v)) return 'logout';
  if (/cancel|close/.test(v)) return undefined;
  return undefined;
}

function Input({ label, value, onChangeText, placeholder, multiline, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; multiline?: boolean; keyboardType?: 'default' | 'numeric' | 'phone-pad' }) {
  return <Field2 label={label} value={value} onChangeText={onChangeText} placeholder={placeholder} multiline={multiline} keyboardType={keyboardType} accent={accent} containerStyle={styles.fieldGap} />;
}

function Selector({ label, items, selected, onChange }: { label: string; items: string[]; selected: string; onChange: (value: string) => void }) {
  const { theme } = useTheme();
  return <View style={styles.fieldGap}>
    <Text style={[T.label, styles.selectorLabel, { color: theme.textMuted }]}>{label}</Text>
    <PillRow options={items.map((x) => ({ value: x, label: x }))} value={selected} onChange={onChange} accent={accent} />
  </View>;
}

function Card({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  return <Surface onPress={onPress} style={styles.cardGap} radiusSize="xl">{children}</Surface>;
}

function Section({ title, action }: { title: string; action?: string }) {
  return <SectionHeader title={title} action={action} accent={accent} />;
}

function Field({ label, value }: { label: string; value: string }) {
  return <ReadField label={label} value={value} />;
}

function Sheet({ visible, title, onClose, children }: { visible: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  return <UiSheet visible={visible} title={title} onClose={onClose}>{children}</UiSheet>;
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  const { theme } = useTheme();
  if (pages <= 1) return null;
  return <View style={styles.pagination}>
    <IconButton name="chevronLeft" onPress={() => page > 1 && onChange(page - 1)} size={38} color={page === 1 ? theme.textFaint : theme.text} />
    <Text style={[T.captionStrong, { color: theme.textMuted }]}>Page {page} of {pages}</Text>
    <IconButton name="chevronRight" onPress={() => page < pages && onChange(page + 1)} size={38} color={page === pages ? theme.textFaint : theme.text} />
  </View>;
}

type ReceptionProfile = { name: string; role: string; email: string; employeeId: string; department: string; shift: string; phone: string };

/** One line of context per module, shown under the header title. */
const SUBTITLES: Partial<Record<ReceptionModuleId, string>> = {
  dashboard: 'Outpatient flow across the front desk, at a glance.',
  appointments: 'Book, confirm and track today’s outpatient appointments.',
  patientreg: 'Register new patients and issue patient IDs.',
  patients: 'Search the patient directory and start a visit.',
  queue: 'Live waiting list with call-in and doctor hand-off.',
  billing: 'Raise, collect and settle outpatient bills.',
  communication: 'Send reminders and updates to patients.',
  reports: 'Daily collection, footfall and no-show summaries.',
};

function Header({ active, unread, onMenu, onProfile, onNotifications }: { active: ReceptionModuleId; unread: number; onMenu: () => void; onProfile: () => void; onNotifications: () => void }) {
  const { user } = useAuth();
  const title = RECEPTION_MODULES.find((item) => item.id === active)?.label ?? 'Dashboard';
  return <AppHeader
    title={title}
    subtitle={SUBTITLES[active] ?? 'Front desk workspace.'}
    roleLabel="Reception Portal"
    userName={user?.name ?? 'Receptionist'}
    accent={accent}
    modulePill={unread ? `${unread} new alerts` : 'Out-patient only'}
    showClock
    onMenu={onMenu}
    onProfile={onProfile}
    onHelp={onNotifications}
  />;
}

function Drawer({ visible, active, badges, onClose, onSelect, onProfile, onLogout }: { visible: boolean; active: ReceptionModuleId; badges: Partial<Record<ReceptionModuleId, number>>; onClose: () => void; onSelect: (id: ReceptionModuleId) => void; onProfile: () => void; onLogout: () => void }) {
  const { user } = useAuth();
  return <NavDrawer
    visible={visible}
    items={RECEPTION_MODULES.map((item) => ({ id: item.id, label: item.label, icon: moduleIcon(item.label), badge: badges[item.id] }))}
    active={active}
    accent={accent}
    roleLabel="Reception"
    userName={user?.name ?? 'Anita Sharma'}
    userEmail={user?.email}
    onClose={onClose}
    onSelect={onSelect}
    onProfile={onProfile}
    onSignOut={onLogout}
  />;
}

function ProfileSheet({ visible, profile, onSave, onClose }: { visible: boolean; profile: ReceptionProfile; onSave: (profile: ReceptionProfile) => void; onClose: () => void }) {
  const { theme } = useTheme(); const [editing, setEditing] = useState(false); const [draft, setDraft] = useState(profile);
  const edit = () => { setDraft(profile); setEditing(true); };
  const save = () => { if (!draft.name.trim() || !draft.email.trim()) return Alert.alert('Required fields', 'Name and email are required.'); onSave(draft); setEditing(false); Alert.alert('Profile updated', 'Reception profile saved successfully.'); };
  return <Sheet visible={visible} title={editing ? 'Edit Profile' : 'My Profile'} onClose={onClose}><View style={styles.profileHero}><View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{initials(editing ? draft.name : profile.name)}</Text></View>{!editing ? <><Text style={[styles.profileName, { color: theme.text }]}>{profile.name}</Text><Text style={[styles.note, { color: theme.textMuted }]}>{profile.role} - {profile.email}</Text></> : null}</View>{editing ? <><Input label="Full Name" value={draft.name} onChangeText={(name) => setDraft((p) => ({ ...p, name }))} /><Input label="Role / Designation" value={draft.role} onChangeText={(role) => setDraft((p) => ({ ...p, role }))} /><Input label="Email" value={draft.email} onChangeText={(email) => setDraft((p) => ({ ...p, email }))} /><Input label="Employee ID" value={draft.employeeId} onChangeText={(employeeId) => setDraft((p) => ({ ...p, employeeId }))} /><Input label="Department" value={draft.department} onChangeText={(department) => setDraft((p) => ({ ...p, department }))} /><Input label="Shift" value={draft.shift} onChangeText={(shift) => setDraft((p) => ({ ...p, shift }))} /><Input label="Phone" value={draft.phone} onChangeText={(phone) => setDraft((p) => ({ ...p, phone }))} /><View style={styles.actionRow}><Button label="Cancel" onPress={() => setEditing(false)} variant="ghost" /><Button label="Save Changes" onPress={save} /></View></> : <><Field label="Employee ID" value={profile.employeeId} /><Field label="Department" value={profile.department} /><Field label="Shift" value={profile.shift} /><Field label="Phone" value={profile.phone} /><View style={styles.actionRow}><Button label="Close" onPress={onClose} variant="ghost" /><Button label="Edit Profile" onPress={edit} /></View></>}</Sheet>;
}

function Dashboard({ name, appointments, queue, bills, patients, onNav }: { name: string; appointments: ReceptionAppointment[]; queue: ReceptionQueueEntry[]; bills: ReceptionBill[]; patients: ReceptionPatient[]; onNav: (id: ReceptionModuleId) => void }) {
  const { theme } = useTheme();
  const actions = RECEPTION_MODULES.filter((item) => item.id !== 'dashboard');
  const metrics = [{ label: 'Scheduled', value: appointments.filter((a) => a.status === 'Scheduled').length }, { label: 'Waiting', value: queue.filter((q) => q.status === 'Waiting').length }, { label: 'Patients', value: patients.length }, { label: 'Pending Bills', value: bills.filter((b) => !b.paidAt).length }];
  return <><View style={[styles.hero, { backgroundColor: `${accent}12`, borderColor: `${accent}35` }]}><Text style={[styles.heroKicker, { color: accent }]}>OUT PATIENT CARE - BETTER EVERY DAY</Text><Text style={[styles.heroTitle, { color: theme.text }]}>Welcome, {name.split(' ')[0]}!</Text><Text style={[styles.note, { color: theme.textMuted }]}>Manage outpatient services efficiently. Have a great shift.</Text><Chip label="Out Patient Only" /></View><View style={styles.statGrid}>{metrics.map((metric) => <View key={metric.label} style={[styles.stat, { backgroundColor: theme.card, borderColor: theme.border }]}><Text style={[styles.statLabel, { color: theme.textMuted }]}>{metric.label}</Text><Text style={[styles.statValue, { color: theme.text }]}>{metric.value}</Text></View>)}</View><Section title="Quick Actions" action="Select to begin" />{actions.map((action) => <Card key={action.id} onPress={() => onNav(action.id)}><Text style={[styles.cardTitle, { color: theme.text }]}>{action.label}</Text><Text style={[styles.note, { color: theme.textMuted }]}>Open {action.label.toLowerCase()} workflow.</Text></Card>)}<View style={[styles.infoBand, { backgroundColor: `${palette.blue}12`, borderColor: `${palette.blue}35` }]}><Text style={[styles.cardTitle, { color: palette.blue }]}>Out Patient Focused</Text><Text style={[styles.note, { color: theme.textMuted }]}>This Reception Portal currently manages OP services only.</Text></View></>;
}

type AppointmentDraft = { patientId: string; patientName: string; phone: string; doctor: string; visitType: ReceptionVisitType; priority: ReceptionPriority; complaint: string; scheduledDate: string; scheduledTime: string };
const emptyAppointment = (): AppointmentDraft => ({ patientId: '', patientName: '', phone: '', doctor: RECEPTION_DOCTORS[0], visitType: 'Walk-In', priority: 'Normal', complaint: '', scheduledDate: todayIso(), scheduledTime: nowTime() });

function AppointmentForm({ visible, title, patients, initialPatient, quick, onClose, onSave }: { visible: boolean; title: string; patients: ReceptionPatient[]; initialPatient?: ReceptionPatient | null; quick?: boolean; onClose: () => void; onSave: (draft: AppointmentDraft) => void }) {
  const { theme } = useTheme();
  const [draft, setDraft] = useState<AppointmentDraft>(emptyAppointment());
  const [search, setSearch] = useState('');
  React.useEffect(() => { if (!visible) return; const next = emptyAppointment(); if (initialPatient) Object.assign(next, { patientId: initialPatient.id, patientName: initialPatient.name, phone: initialPatient.mobile }); setDraft(next); setSearch(initialPatient?.name ?? ''); }, [visible, initialPatient?.id]);
  const matches = patients.filter((p) => `${p.name} ${p.mobile} ${p.aadhar ?? ''}`.toLowerCase().includes(search.toLowerCase())).slice(0, 5);
  const save = () => { if (!draft.patientName.trim()) return Alert.alert('Patient required', 'Select or enter a patient name.'); if (!draft.phone.trim()) return Alert.alert('Phone required', 'Enter a phone number.'); if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.scheduledDate)) return Alert.alert('Valid date required', 'Enter the appointment date as YYYY-MM-DD.'); if (!draft.scheduledTime.trim()) return Alert.alert('Time required', 'Enter an appointment time.'); if (!quick && !draft.complaint.trim()) return Alert.alert('Chief complaint required', 'Enter the reason for the visit.'); onSave(draft); };
  return <Sheet visible={visible} title={title} onClose={onClose}>{!quick ? <><Input label="Search Registered Patient" value={search} onChangeText={setSearch} placeholder="Name, mobile, or Aadhar" />{search && !draft.patientId ? matches.map((p) => <TouchableOpacity key={p.id} style={[styles.searchResult, { borderColor: theme.border }]} onPress={() => { setDraft((d) => ({ ...d, patientId: p.id, patientName: p.name, phone: p.mobile })); setSearch(p.name); }}><Text style={[styles.cardTitle, { color: theme.text }]}>{p.name}</Text><Text style={[styles.note, { color: theme.textMuted }]}>{p.id} - {p.mobile}</Text></TouchableOpacity>) : null}</> : null}<Input label="Patient Name" value={draft.patientName} onChangeText={(patientName) => setDraft((d) => ({ ...d, patientName }))} /><Input label="Phone" value={draft.phone} onChangeText={(phone) => setDraft((d) => ({ ...d, phone }))} keyboardType="phone-pad" /><Selector label="Doctor" items={RECEPTION_DOCTORS} selected={draft.doctor} onChange={(doctor) => setDraft((d) => ({ ...d, doctor }))} />{!quick ? <><Selector label="Visit Type" items={['Walk-In','Follow-Up','Consultation','Procedure']} selected={draft.visitType} onChange={(visitType) => setDraft((d) => ({ ...d, visitType: visitType as ReceptionVisitType }))} /><Selector label="Priority" items={['Normal','Urgent','Emergency']} selected={draft.priority} onChange={(priority) => setDraft((d) => ({ ...d, priority: priority as ReceptionPriority }))} /><Input label="Chief Complaint" value={draft.complaint} onChangeText={(complaint) => setDraft((d) => ({ ...d, complaint }))} multiline /></> : null}<Input label="Appointment Date" value={draft.scheduledDate} onChangeText={(scheduledDate) => setDraft((d) => ({ ...d, scheduledDate }))} placeholder="YYYY-MM-DD" /><Input label="Time Slot" value={draft.scheduledTime} onChangeText={(scheduledTime) => setDraft((d) => ({ ...d, scheduledTime }))} placeholder="10:30 AM" /><View style={styles.actionRow}><Button label="Cancel" onPress={onClose} variant="ghost" /><Button label={quick ? 'Create Quick Appointment' : 'Create Appointment'} onPress={save} /></View></Sheet>;
}

function AppointmentRow({ appt, onConfirm }: { appt: ReceptionAppointment; onConfirm?: () => void }) {
  const { theme } = useTheme();
  return <Card><View style={styles.rowTop}><View style={styles.token}><Text style={styles.tokenText}>{appt.token.replace('OP-', '')}</Text></View><View style={{ flex: 1 }}><Text style={[styles.cardTitle, { color: theme.text }]}>{appt.patientName}</Text><Text style={[styles.note, { color: theme.textMuted }]}>{appt.doctor}</Text><Text style={[styles.note, { color: theme.textMuted }]}>{appt.scheduledDate ?? 'Today'} - {appt.scheduledTime || appt.arrivalTime || 'Time pending'}</Text></View></View><Text style={[styles.bodyText, { color: theme.text }]}>{appt.chiefComplaint}</Text><View style={styles.chipLine}><Chip label={appt.priority} /><Chip label={appt.status} /></View>{onConfirm ? <Button label="Confirm Arrival" onPress={onConfirm} /> : null}</Card>;
}

function AppointmentsModule({ patients, appointments, setAppointments, queue, setQueue, onRegisterQuick }: { patients: ReceptionPatient[]; appointments: ReceptionAppointment[]; setAppointments: React.Dispatch<React.SetStateAction<ReceptionAppointment[]>>; queue: ReceptionQueueEntry[]; setQueue: React.Dispatch<React.SetStateAction<ReceptionQueueEntry[]>>; onRegisterQuick: (name: string, phone: string) => void }) {
  const { theme } = useTheme();
  const [tab, setTab] = useState<'all' | 'scheduled' | 'quick'>('all'); const [search, setSearch] = useState(''); const [doctor, setDoctor] = useState('All Doctors'); const [status, setStatus] = useState('All Status'); const [formOpen, setFormOpen] = useState(false); const [quickOpen, setQuickOpen] = useState(false); const [quick, setQuick] = useState<AppointmentDraft[]>([]); const [page, setPage] = useState(1); const [quickSearch, setQuickSearch] = useState(''); const [quickPage, setQuickPage] = useState(1);
  const filtered = appointments.filter((a) => (tab !== 'scheduled' || a.status === 'Scheduled') && (doctor === 'All Doctors' || a.doctor === doctor) && (status === 'All Status' || a.status === status) && `${a.patientName} ${a.token} ${a.phone}`.toLowerCase().includes(search.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 10)); const rows = filtered.slice((page - 1) * 10, page * 10); const quickFiltered = quick.filter((item) => `${item.patientName} ${item.phone}`.toLowerCase().includes(quickSearch.toLowerCase())); const quickPages = Math.max(1, Math.ceil(quickFiltered.length / 10)); const quickRows = quickFiltered.slice((quickPage - 1) * 10, quickPage * 10);
  const create = (draft: AppointmentDraft) => { const next: ReceptionAppointment = { id:`A${Date.now()}`, token:`OP-${String(appointments.length + 1).padStart(3,'0')}`, arrivalTime:'', scheduledDate:draft.scheduledDate, scheduledTime:draft.scheduledTime || nowTime(), patientName:draft.patientName, patientId:draft.patientId || `PT-${Date.now()}`, doctor:draft.doctor, phone:draft.phone, visitType:draft.visitType, priority:draft.priority, chiefComplaint:draft.complaint, status:'Scheduled', createdAt:Date.now() }; setAppointments((items) => [next, ...items]); setFormOpen(false); setTab('all'); };
  const createQuick = (draft: AppointmentDraft) => { setQuick((items) => [{ ...draft, patientId:`QA-${Date.now()}` }, ...items]); setQuickOpen(false); setTab('quick'); };
  const confirm = (appt: ReceptionAppointment) => { const arrived = nowTime(); setAppointments((items) => items.map((item) => item.id === appt.id ? { ...item, arrivalTime:arrived, status:'In Queue' } : item)); if (!queue.some((item) => item.apptId === appt.id)) setQueue((items) => [...items, { apptId:appt.id, queueNo:items.length + 1, token:appt.token, patientName:appt.patientName, patientId:appt.patientId, doctor:appt.doctor, priority:appt.priority, status:'Waiting', chiefComplaint:appt.chiefComplaint, queuedAt:Date.now() }]); Alert.alert('Arrival confirmed', `${appt.patientName} was added to the OP queue.`); };
  const stats = [['Total today', appointments.length], ['Scheduled', appointments.filter((a) => a.status === 'Scheduled').length], ['In queue', appointments.filter((a) => a.status === 'In Queue').length], ['With doctor', appointments.filter((a) => a.status === 'With Doctor').length], ['No-shows', appointments.filter((a) => a.status === 'No-Show').length]] as const;
  return <><View style={styles.statGrid}>{stats.map(([label, value]) => <View key={label} style={[styles.stat, { backgroundColor:theme.card, borderColor:theme.border }]}><Text style={[styles.statLabel, { color:theme.textMuted }]}>{label}</Text><Text style={[styles.statValue, { color:theme.text }]}>{value}</Text></View>)}</View><View style={styles.actionRow}><Button label="Quick Appointment" onPress={() => setQuickOpen(true)} variant="ghost" /><Button label="New Appointment" onPress={() => setFormOpen(true)} /></View><Selector label="View" items={['all','scheduled','quick']} selected={tab} onChange={(value) => { setTab(value as typeof tab); setPage(1); setQuickPage(1); }} />{tab !== 'quick' ? <><Input label="Search" value={search} onChangeText={(value) => { setSearch(value); setPage(1); }} placeholder="Patient, token, or phone" /><Selector label="Doctor Filter" items={['All Doctors', ...RECEPTION_DOCTORS]} selected={doctor} onChange={(value) => { setDoctor(value); setPage(1); }} /><Selector label="Status Filter" items={['All Status','Scheduled','Confirmed','In Queue','With Doctor','Post-Consult','Bill Pending','Paid','Visit Complete','Cancelled','No-Show']} selected={status} onChange={(value) => { setStatus(value); setPage(1); }} /><Section title={tab === 'scheduled' ? 'Scheduled Appointments' : 'All Appointments'} action={`${filtered.length} records`} />{rows.map((appt) => <AppointmentRow key={appt.id} appt={appt} onConfirm={appt.status === 'Scheduled' ? () => confirm(appt) : undefined} />)}{!rows.length ? <Text style={[styles.note, { color: theme.textMuted }]}>No appointments match these filters.</Text> : null}<Pagination page={page} pages={pages} onChange={setPage} /></> : <><Input label="Search Non-registered Appointments" value={quickSearch} onChangeText={(value) => { setQuickSearch(value); setQuickPage(1); }} placeholder="Name or phone number" /><Section title="Non-registered Appointments" action={`${quickFiltered.length} records`} />{quickRows.map((item) => <Card key={item.patientId}><Text style={[styles.cardTitle, { color: theme.text }]}>{item.patientName}</Text><Text style={[styles.note, { color: theme.textMuted }]}>{item.phone} - {item.doctor}</Text><Text style={[styles.note, { color: theme.textMuted }]}>{item.scheduledDate} - {item.scheduledTime}</Text><Button label="Register Patient" onPress={() => onRegisterQuick(item.patientName, item.phone)} /></Card>)}{!quickRows.length ? <Text style={[styles.note, { color: theme.textMuted }]}>{quick.length ? 'No results match your search.' : 'No quick appointments created in this session.'}</Text> : null}<Pagination page={quickPage} pages={quickPages} onChange={setQuickPage} /></>}<AppointmentForm visible={formOpen} title="New Appointment" patients={patients} onClose={() => setFormOpen(false)} onSave={create} /><AppointmentForm visible={quickOpen} title="Quick Appointment" patients={patients} quick onClose={() => setQuickOpen(false)} onSave={createQuick} /></>;
}

function RegistrationModule({ patients, setPatients, addToQueue, prefill, clearPrefill }: { patients: ReceptionPatient[]; setPatients: React.Dispatch<React.SetStateAction<ReceptionPatient[]>>; addToQueue: (patient: ReceptionPatient, draft: AppointmentDraft) => void; prefill: { name: string; phone: string }; clearPrefill: () => void }) {
  const { theme } = useTheme(); const [tab, setTab] = useState<'new'|'recent'>('new'); const [name, setName] = useState(prefill.name); const [mobile, setMobile] = useState(prefill.phone); const [aadhar, setAadhar] = useState(''); const [age, setAge] = useState(''); const [gender, setGender] = useState('Male'); const [blood, setBlood] = useState(''); const [email, setEmail] = useState(''); const [address, setAddress] = useState(''); const [occupation, setOccupation] = useState(''); const [referralSource, setReferralSource] = useState<NonNullable<ReceptionPatient['referralSource']>>('Self'); const [emergencyName, setEmergencyName] = useState(''); const [emergencyPhone, setEmergencyPhone] = useState(''); const [search, setSearch] = useState(''); const [selected, setSelected] = useState<ReceptionPatient | null>(null); const [page, setPage] = useState(1);
  React.useEffect(() => { if (prefill.name || prefill.phone) { setName(prefill.name); setMobile(prefill.phone); setTab('new'); clearPrefill(); } }, [prefill.name, prefill.phone]);
  const clear = () => { setName(''); setMobile(''); setAadhar(''); setAge(''); setGender('Male'); setBlood(''); setEmail(''); setAddress(''); setOccupation(''); setReferralSource('Self'); setEmergencyName(''); setEmergencyPhone(''); };
  const save = () => { if (!name.trim() || !mobile.trim() || !aadhar.trim() || !age.trim() || Number.isNaN(Number(age))) return Alert.alert('Required details', 'Name, mobile, Aadhar, and a valid age are required.'); const patient: ReceptionPatient = { id:`PT-${String(patients.length + 123).padStart(6,'0')}`, name:name.trim(), mobile:mobile.trim(), aadhar:aadhar.trim(), age:Number(age), gender:gender as ReceptionPatient['gender'], lastVisit:'Today', bloodGroup:blood, email, address, occupation, referralSource, emergencyName, emergencyPhone }; setPatients((items) => [patient, ...items]); clear(); setTab('recent'); Alert.alert('Patient registered', `${patient.name} was assigned ${patient.id}.`); };
  const filtered = patients.filter((p) => `${p.name} ${p.mobile} ${p.aadhar ?? ''}`.toLowerCase().includes(search.toLowerCase())); const pages = Math.max(1, Math.ceil(filtered.length / 10));
  return <><Selector label="Registration View" items={['new','recent']} selected={tab} onChange={(value) => setTab(value as typeof tab)} />{tab === 'new' ? <Card><Input label="Full Name" value={name} onChangeText={setName} /><Selector label="Gender" items={['Male','Female','Other']} selected={gender} onChange={setGender} /><Input label="Age" value={age} onChangeText={setAge} keyboardType="numeric" /><Input label="Mobile" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" /><Input label="Aadhar Number" value={aadhar} onChangeText={setAadhar} /><Input label="Email" value={email} onChangeText={setEmail} /><Input label="Address" value={address} onChangeText={setAddress} multiline /><Selector label="Blood Group" items={['A+','A-','B+','B-','AB+','AB-','O+','O-']} selected={blood} onChange={setBlood} /><Input label="Occupation" value={occupation} onChangeText={setOccupation} /><Selector label="Referral Source" items={['Self','Doctor Referral','Hospital Referral','Online']} selected={referralSource} onChange={(value) => setReferralSource(value as NonNullable<ReceptionPatient['referralSource']>)} /><Input label="Emergency Contact Name" value={emergencyName} onChangeText={setEmergencyName} /><Input label="Emergency Contact Phone" value={emergencyPhone} onChangeText={setEmergencyPhone} keyboardType="phone-pad" /><View style={styles.actionRow}><Button label="Clear" variant="ghost" onPress={clear} /><Button label="Save & Register" onPress={save} /></View></Card> : <><Input label="Search Recent Registrations" value={search} onChangeText={(value) => { setSearch(value); setPage(1); }} /><Section title="Recent Registrations" action={`${filtered.length} patients`} />{filtered.slice((page - 1) * 10, page * 10).map((patient) => <Card key={patient.id}><Text style={[styles.cardTitle, { color: theme.text }]}>{patient.name}</Text><Text style={[styles.note, { color: theme.textMuted }]}>{patient.id} - {patient.mobile} - {patient.age} yrs</Text><Button label="Add to Queue" onPress={() => setSelected(patient)} /></Card>)}<Pagination page={page} pages={pages} onChange={setPage} /></>}<AppointmentForm visible={!!selected} title="New Appointment" patients={patients} initialPatient={selected} onClose={() => setSelected(null)} onSave={(draft) => { if (selected) addToQueue(selected, draft); setSelected(null); }} /></>;
}

function PatientsModule({ patients, addToQueue }: { patients: ReceptionPatient[]; addToQueue: (patient: ReceptionPatient, draft: AppointmentDraft) => void }) {
  const { theme } = useTheme(); const [search, setSearch] = useState(''); const [page, setPage] = useState(1); const [rowsPerPage, setRowsPerPage] = useState(10); const [detail, setDetail] = useState<ReceptionPatient | null>(null); const [appointmentPatient, setAppointmentPatient] = useState<ReceptionPatient | null>(null);
  const filtered = patients.filter((p) => `${p.name} ${p.id} ${p.mobile} ${p.aadhar ?? ''}`.toLowerCase().includes(search.toLowerCase())); const pages = Math.max(1, Math.ceil(filtered.length / rowsPerPage)); const rows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  return <><Input label="Search Patients" value={search} onChangeText={(value) => { setSearch(value); setPage(1); }} placeholder="Name, patient ID, mobile, or Aadhar" /><Selector label="Rows Per Page" items={['5','10','20','50']} selected={String(rowsPerPage)} onChange={(value) => { setRowsPerPage(Number(value)); setPage(1); }} /><Section title="Patients" action={`Showing ${Math.min(page * rowsPerPage, filtered.length)} of ${filtered.length}`} />{rows.map((patient) => <Card key={patient.id} onPress={() => setDetail(patient)}><View style={styles.rowTop}><View style={styles.smallAvatar}><Text style={styles.smallAvatarText}>{initials(patient.name)}</Text></View><View style={{ flex: 1 }}><Text style={[styles.cardTitle, { color: theme.text }]}>{patient.name}</Text><Text style={[styles.note, { color: theme.textMuted }]}>{patient.id} - {patient.age} yrs - {patient.gender}</Text></View></View><Text style={[styles.note, { color: theme.textMuted }]}>{patient.mobile} - Last visit {patient.lastVisit}</Text><Button label="Add to Queue" onPress={() => setAppointmentPatient(patient)} /></Card>)}<Pagination page={page} pages={pages} onChange={setPage} /><Sheet visible={!!detail} title="Patient Details" onClose={() => setDetail(null)}>{detail ? <><View style={styles.profileHero}><View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{initials(detail.name)}</Text></View><Text style={[styles.profileName, { color: theme.text }]}>{detail.name}</Text></View><Field label="Patient ID" value={detail.id} /><Field label="Mobile" value={detail.mobile} /><Field label="Aadhar" value={detail.aadhar ?? '-'} /><Field label="Age / Gender" value={`${detail.age} / ${detail.gender}`} /><Field label="Blood Group" value={detail.bloodGroup ?? '-'} /><Field label="Address" value={detail.address ?? '-'} /><Field label="Referral Source" value={detail.referralSource ?? '-'} /><View style={styles.actionRow}><Button label="Close" onPress={() => setDetail(null)} variant="ghost" /><Button label="Add to Queue" onPress={() => { setAppointmentPatient(detail); setDetail(null); }} /></View></> : null}</Sheet><AppointmentForm visible={!!appointmentPatient} title="New Appointment" patients={patients} initialPatient={appointmentPatient} onClose={() => setAppointmentPatient(null)} onSave={(draft) => { if (appointmentPatient) addToQueue(appointmentPatient, draft); setAppointmentPatient(null); }} /></>;
}

function QueueEntryCard({ entry, onCall, onDone }: { entry: ReceptionQueueEntry; onCall: () => void; onDone: () => void }) {
  const { theme } = useTheme();
  const elapsed = useElapsed(entry.queuedAt, entry.status === 'Waiting');
  return <Card><View style={styles.rowTop}><View style={styles.queueNo}><Text style={styles.queueNoText}>{entry.queueNo}</Text></View><View style={{ flex:1 }}><Text style={[styles.cardTitle, { color:theme.text }]}>{entry.patientName}</Text><Text style={[styles.note, { color:theme.textMuted }]}>{entry.token} - {entry.doctor}</Text></View></View><Text style={[styles.bodyText, { color:theme.text }]}>{entry.chiefComplaint}</Text><View style={styles.chipLine}><Chip label={entry.priority} /><Chip label={entry.status} /></View>{entry.status === 'Waiting' ? <Text style={[styles.waitTime, { color:palette.amber }]}>Live wait: {elapsed}</Text> : null}{entry.status === 'Waiting' ? <Button label="Call Patient" onPress={onCall} /> : null}{entry.status === 'With Doctor' ? <Button label="Doctor Done" onPress={onDone} /> : null}</Card>;
}

function QueueModule({ queue, setQueue, appointments, setAppointments, setBills, addNotification }: { queue: ReceptionQueueEntry[]; setQueue: React.Dispatch<React.SetStateAction<ReceptionQueueEntry[]>>; appointments: ReceptionAppointment[]; setAppointments: React.Dispatch<React.SetStateAction<ReceptionAppointment[]>>; setBills: React.Dispatch<React.SetStateAction<ReceptionBill[]>>; addNotification: (entry: ReceptionQueueEntry) => void }) {
  const { theme } = useTheme(); const [doctor, setDoctor] = useState('All Doctors'); const [search, setSearch] = useState(''); const [called, setCalled] = useState<ReceptionQueueEntry | null>(null);
  const sorted = [...queue].sort((a, b) => { const statusOrder = { 'With Doctor':0, Waiting:1, Completed:2 }; const priorityOrder = { Emergency:0, Urgent:1, Normal:2 }; return statusOrder[a.status]-statusOrder[b.status] || priorityOrder[a.priority]-priorityOrder[b.priority] || a.queuedAt-b.queuedAt; }).filter((entry) => (doctor === 'All Doctors' || entry.doctor === doctor) && `${entry.patientName} ${entry.token}`.toLowerCase().includes(search.toLowerCase()));
  const call = (entry: ReceptionQueueEntry) => { setQueue((items) => items.map((item) => item.apptId === entry.apptId ? { ...item, status:'With Doctor' } : item)); setAppointments((items) => items.map((item) => item.id === entry.apptId ? { ...item, status:'With Doctor' } : item)); addNotification(entry); setCalled(entry); setTimeout(() => setCalled((current) => current?.apptId === entry.apptId ? null : current), 5000); };
  const done = (entry: ReceptionQueueEntry) => { setQueue((items) => items.map((item) => item.apptId === entry.apptId ? { ...item, status:'Completed' } : item)); setAppointments((items) => items.map((item) => item.id === entry.apptId ? { ...item, status:'Bill Pending' } : item)); const appt = appointments.find((item) => item.id === entry.apptId); const bill: ReceptionBill = { apptId:entry.apptId, patientId:entry.patientId, patientName:entry.patientName, doctor:entry.doctor, visitDate:new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), lines:[{ id:'L1', service:'Consultation Fee', charge:600, qty:1 }], prescription:appt?.prescription, testsRecommended:appt?.testsRecommended }; setBills((items) => items.some((item) => item.apptId === entry.apptId) ? items.map((item) => item.apptId === entry.apptId ? bill : item) : [...items, bill]); Alert.alert('Consultation completed', `A pending bill was created for ${entry.patientName}.`); };
  const stats = [{ label:'Active Queue', value:queue.filter((q) => q.status !== 'Completed').length }, { label:'Waiting', value:queue.filter((q) => q.status === 'Waiting').length }, { label:'With Doctor', value:queue.filter((q) => q.status === 'With Doctor').length }, { label:'Completed', value:queue.filter((q) => q.status === 'Completed').length }];
  return <>{called ? <View style={[styles.callBanner, { backgroundColor:`${accent}16`, borderColor:accent }]}><Text style={[styles.cardTitle, { color:accent }]}>Token {called.token} called</Text><Text style={[styles.note, { color:theme.text }]}>{called.patientName}, please proceed to {called.doctor}.</Text><Button label="Dismiss" onPress={() => setCalled(null)} variant="ghost" /></View> : null}<View style={styles.statGrid}>{stats.map((item) => <View key={item.label} style={[styles.stat, { backgroundColor:theme.card, borderColor:theme.border }]}><Text style={[styles.statLabel, { color:theme.textMuted }]}>{item.label}</Text><Text style={[styles.statValue, { color:theme.text }]}>{item.value}</Text></View>)}</View><Input label="Search Queue" value={search} onChangeText={setSearch} placeholder="Patient or token" /><Selector label="Doctor Filter" items={['All Doctors', ...RECEPTION_DOCTORS]} selected={doctor} onChange={setDoctor} /><Section title="OP Queue" action={`${sorted.length} entries`} />{sorted.map((entry) => <QueueEntryCard key={entry.apptId} entry={entry} onCall={() => call(entry)} onDone={() => done(entry)} />)}</>;
}

function BillLineEditor({ line, onChange, onRemove }: { line: ReceptionBillLine; onChange: (line: ReceptionBillLine) => void; onRemove: () => void }) {
  return <View style={styles.billEditor}><Input label="Service" value={line.service} onChangeText={(service) => onChange({ ...line, service })} /><Input label="Charge" value={String(line.charge)} onChangeText={(value) => onChange({ ...line, charge:Number(value) || 0 })} keyboardType="numeric" /><Input label="Quantity" value={String(line.qty)} onChangeText={(value) => onChange({ ...line, qty:Math.max(1, Number(value) || 1) })} keyboardType="numeric" /><Text style={styles.billLineAmount}>Rs {(line.charge * line.qty).toLocaleString('en-IN')}</Text><Button label="Remove" onPress={onRemove} variant="danger" /></View>;
}

function BillingModule({ bills, setBills, appointments, setAppointments }: { bills: ReceptionBill[]; setBills: React.Dispatch<React.SetStateAction<ReceptionBill[]>>; appointments: ReceptionAppointment[]; setAppointments: React.Dispatch<React.SetStateAction<ReceptionAppointment[]>> }) {
  const { theme } = useTheme(); const [selectedId, setSelectedId] = useState<string | null>(null); const [lines, setLines] = useState<ReceptionBillLine[]>([]); const [mode, setMode] = useState<ReceptionPaymentMode>('Cash'); const [newService, setNewService] = useState(''); const [reference, setReference] = useState(''); const [receipt, setReceipt] = useState<ReceptionBill | null>(null);
  const pending = bills.filter((bill) => !bill.paidAt); const paid = bills.filter((bill) => !!bill.paidAt); const selected = bills.find((bill) => bill.apptId === selectedId) ?? null; const subtotal = lines.reduce((sum, line) => sum + line.charge * line.qty, 0);
  const choose = (bill: ReceptionBill) => { setSelectedId(bill.apptId); setLines(bill.lines.map((line) => ({ ...line }))); setMode('Cash'); setReference(''); setNewService(''); };
  const addLine = () => { if (!newService.trim()) return Alert.alert('Service required', 'Enter or select a service to add.'); const found = RECEPTION_SERVICES.find((item) => item.service === newService); setLines((items) => [...items, { id:`L${Date.now()}`, service:newService.trim(), charge:found?.charge ?? 0, qty:1 }]); setNewService(''); };
  const collect = () => { if (!selected) return; if (!lines.length || subtotal <= 0) return Alert.alert('Bill incomplete', 'Add at least one service with a valid charge.'); const paidAt = Date.now(); const updated: ReceptionBill = { ...selected, lines, paymentMode:mode, amountPaid:subtotal, reference:reference.trim(), paidAt }; setBills((items) => items.map((item) => item.apptId === selected.apptId ? updated : item)); setAppointments((items) => items.map((item) => item.id === selected.apptId ? { ...item, status:'Paid', paidAt } : item)); setReceipt(updated); setSelectedId(null); };
  const markVisitComplete = (bill: ReceptionBill) => { const completedAt = Date.now(); setBills((items) => items.map((item) => item.apptId === bill.apptId ? { ...item, visitCompletedAt:completedAt } : item)); setAppointments((items) => items.map((item) => item.id === bill.apptId ? { ...item, status:'Visit Complete' } : item)); };
  const receiptRows = (bill: ReceptionBill): [string, string | number | undefined][] => [['Patient',bill.patientName],['Doctor',bill.doctor],['Visit Date',bill.visitDate],['Payment Mode',bill.paymentMode],['Reference',bill.reference || '-'],['Amount Paid',`Rs ${(bill.amountPaid ?? billTotal(bill)).toLocaleString('en-IN')}`]];
  const collected = paid.reduce((sum, bill) => sum + (bill.amountPaid ?? 0), 0);
  return <><View style={styles.statGrid}><View style={[styles.stat, { backgroundColor:theme.card, borderColor:theme.border }]}><Text style={[styles.statLabel, { color:theme.textMuted }]}>Pending Bills</Text><Text style={[styles.statValue, { color:theme.text }]}>{pending.length}</Text></View><View style={[styles.stat, { backgroundColor:theme.card, borderColor:theme.border }]}><Text style={[styles.statLabel, { color:theme.textMuted }]}>Paid Today</Text><Text style={[styles.statValue, { color:theme.text }]}>{paid.length}</Text></View><View style={[styles.stat, { backgroundColor:theme.card, borderColor:theme.border }]}><Text style={[styles.statLabel, { color:theme.textMuted }]}>Collected</Text><Text style={[styles.statValue, { color:theme.text }]}>Rs {collected.toLocaleString('en-IN')}</Text></View></View><Section title="Pending Payments" action={`${pending.length}`} />{pending.map((bill) => <Card key={bill.apptId} onPress={() => choose(bill)}><Text style={[styles.cardTitle, { color:theme.text }]}>{bill.patientName}</Text><Text style={[styles.note, { color:theme.textMuted }]}>{bill.doctor} - {bill.visitDate}</Text><Text style={[styles.amount, { color:accent }]}>Rs {billTotal(bill).toLocaleString('en-IN')}</Text><Button label="Collect Payment" onPress={() => choose(bill)} /></Card>)}<Section title="Paid Transactions" action={`${paid.length}`} />{paid.map((bill) => { const complete = !!bill.visitCompletedAt || appointments.find((appt) => appt.id === bill.apptId)?.status === 'Visit Complete'; return <Card key={bill.apptId}><Text style={[styles.cardTitle, { color:theme.text }]}>{bill.patientName}</Text><Text style={[styles.note, { color:theme.textMuted }]}>{bill.paymentMode} - Rs {(bill.amountPaid ?? 0).toLocaleString('en-IN')}</Text><Chip label={complete ? 'Visit Complete' : 'Paid'} /><View style={styles.actionRow}><Button label="Receipt" onPress={() => setReceipt(bill)} variant="ghost" /><Button label="WhatsApp Receipt" onPress={() => printOrShareDocument('Vexoo Payment Receipt', receiptRows(bill), true)} variant="ghost" />{!complete ? <Button label="Mark Visit Completed" onPress={() => markVisitComplete(bill)} /> : null}</View></Card>; })}<Sheet visible={!!selected} title="Collect Payment" onClose={() => setSelectedId(null)}>{selected ? <><Field label="Patient" value={selected.patientName} /><Field label="Doctor" value={selected.doctor} /><Section title="Services & Charges" />{lines.map((line) => <BillLineEditor key={line.id} line={line} onChange={(updated) => setLines((items) => items.map((item) => item.id === line.id ? updated : item))} onRemove={() => setLines((items) => items.filter((item) => item.id !== line.id))} />)}<Selector label="Suggested Service" items={RECEPTION_SERVICES.map((item) => item.service)} selected={newService} onChange={setNewService} /><Input label="Add Custom Service" value={newService} onChangeText={setNewService} placeholder="Service name" /><Button label="Add Service" onPress={addLine} variant="ghost" /><Selector label="Payment Mode" items={['Cash','Card','UPI','Insurance']} selected={mode} onChange={(value) => setMode(value as ReceptionPaymentMode)} /><Input label="Payment Reference (optional)" value={reference} onChangeText={setReference} placeholder="Transaction or insurance reference" /><Field label="Total Payable" value={`Rs ${subtotal.toLocaleString('en-IN')}`} /><Button label="Collect Payment" onPress={collect} /></> : null}</Sheet><Sheet visible={!!receipt} title="Payment Receipt" onClose={() => setReceipt(null)}>{receipt ? <><View style={styles.profileHero}><Text style={[styles.heroTitle, { color:theme.text }]}>Vexoo Receipt</Text><Chip label="Paid" /></View>{receiptRows(receipt).map(([label, value]) => <Field key={label} label={label} value={String(value ?? '-')} />)}<View style={styles.actionRow}><Button label="Close" onPress={() => setReceipt(null)} variant="ghost" /><Button label="Print Receipt" onPress={() => printOrShareDocument('Vexoo Payment Receipt', receiptRows(receipt))} /><Button label="WhatsApp Receipt" onPress={() => printOrShareDocument('Vexoo Payment Receipt', receiptRows(receipt), true)} variant="ghost" /></View></> : null}</Sheet></>;
}

function ReportsModule({ appointments, bills }: { appointments: ReceptionAppointment[]; bills: ReceptionBill[] }) {
  const { theme } = useTheme(); const [doctor, setDoctor] = useState('All Doctors'); const [range, setRange] = useState('All Time'); const [page, setPage] = useState(1); const [detail, setDetail] = useState<ReceptionReportRecord | null>(null);
  const allRecords = useMemo<ReceptionReportRecord[]>(() => {
    const live = appointments.map((appt) => { const bill = bills.find((item) => item.apptId === appt.id); return { id:`LIVE-${appt.id}`, patientName:appt.patientName, doctor:appt.doctor, visitDate:new Date(appt.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), timestamp:appt.createdAt, prescription:appt.prescription ?? bill?.prescription ?? 'Not available', testsRecommended:appt.testsRecommended ?? bill?.testsRecommended, invoiceAmount:bill?.amountPaid ?? (bill ? billTotal(bill) : 0) }; });
    return [...live, ...RECEPTION_REPORT_RECORDS];
  }, [appointments, bills]);
  const now = new Date();
  const inRange = (timestamp: number) => { const date = new Date(timestamp); const age = now.getTime() - timestamp; if (range === 'All Time') return true; if (range === 'Today') return date.toDateString() === now.toDateString(); if (range === 'Last 7 Days') return age <= 7 * 86400000; if (range === 'Last Month') return age <= 30 * 86400000; if (range === 'Last 3 Months') return age <= 90 * 86400000; if (range === 'Last 6 Months') return age <= 180 * 86400000; if (range === 'Last 9 Months') return age <= 270 * 86400000; if (range === 'This Month') return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); if (range === 'This Year') return date.getFullYear() === now.getFullYear(); return true; };
  const records = allRecords.filter((record) => (doctor === 'All Doctors' || record.doctor === doctor) && inRange(record.timestamp)); const pages = Math.max(1, Math.ceil(records.length / 10)); const collected = records.reduce((sum, record) => sum + record.invoiceAmount, 0);
  const invoiceRows = (record: ReceptionReportRecord): [string, string | number | undefined][] => [['Patient',record.patientName],['Doctor',record.doctor],['Visit Date',record.visitDate],['Invoice Amount',`Rs ${record.invoiceAmount.toLocaleString('en-IN')}`]];
  const prescriptionRows = (record: ReceptionReportRecord): [string, string | number | undefined][] => [['Patient',record.patientName],['Doctor',record.doctor],['Visit Date',record.visitDate],['Prescription',record.prescription],['Tests Recommended',record.testsRecommended ?? 'None']];
  return <><View style={styles.statGrid}><View style={[styles.stat, { backgroundColor:theme.card, borderColor:theme.border }]}><Text style={[styles.statLabel, { color:theme.textMuted }]}>Records</Text><Text style={[styles.statValue, { color:theme.text }]}>{records.length}</Text></View><View style={[styles.stat, { backgroundColor:theme.card, borderColor:theme.border }]}><Text style={[styles.statLabel, { color:theme.textMuted }]}>Doctors</Text><Text style={[styles.statValue, { color:theme.text }]}>{new Set(records.map((record) => record.doctor)).size}</Text></View><View style={[styles.stat, { backgroundColor:theme.card, borderColor:theme.border }]}><Text style={[styles.statLabel, { color:theme.textMuted }]}>Revenue</Text><Text style={[styles.statValue, { color:theme.text }]}>Rs {collected.toLocaleString('en-IN')}</Text></View></View><Selector label="Date Range" items={['All Time','Today','Last 7 Days','Last Month','Last 3 Months','Last 6 Months','Last 9 Months','This Month','This Year']} selected={range} onChange={(value) => { setRange(value); setPage(1); }} /><Selector label="Doctor" items={['All Doctors', ...RECEPTION_DOCTORS]} selected={doctor} onChange={(value) => { setDoctor(value); setPage(1); }} />{range !== 'All Time' || doctor !== 'All Doctors' ? <Button label="Reset Filters" onPress={() => { setRange('All Time'); setDoctor('All Doctors'); setPage(1); }} variant="ghost" /> : null}<Section title="OP Visit Reports" action={`${records.length} records`} />{records.slice((page - 1) * 10, page * 10).map((record) => <Card key={record.id}><Text style={[styles.cardTitle, { color:theme.text }]}>{record.patientName}</Text><Text style={[styles.note, { color:theme.textMuted }]}>{record.doctor} - {record.visitDate}</Text><Text style={[styles.amount, { color:accent }]}>Rs {record.invoiceAmount.toLocaleString('en-IN')}</Text><View style={styles.actionRow}><Button label="View Actions" onPress={() => setDetail(record)} variant="ghost" /></View></Card>)}<Pagination page={page} pages={pages} onChange={setPage} /><Sheet visible={!!detail} title="Visit Report Actions" onClose={() => setDetail(null)}>{detail ? <><Field label="Patient" value={detail.patientName} /><Field label="Doctor" value={detail.doctor} /><Field label="Visit Date" value={detail.visitDate} /><Field label="Prescription" value={detail.prescription} /><Field label="Tests Recommended" value={detail.testsRecommended ?? 'None'} /><View style={styles.actionRow}><Button label="Print Invoice" onPress={() => printOrShareDocument('Vexoo Invoice', invoiceRows(detail))} /><Button label="WhatsApp Invoice" onPress={() => printOrShareDocument('Vexoo Invoice', invoiceRows(detail), true)} variant="ghost" /><Button label="Print Prescription" onPress={() => printOrShareDocument('Vexoo Prescription', prescriptionRows(detail))} /><Button label="WhatsApp Prescription" onPress={() => printOrShareDocument('Vexoo Prescription', prescriptionRows(detail), true)} variant="ghost" /><Button label="Close" onPress={() => setDetail(null)} variant="ghost" /></View></> : null}</Sheet></>;
}

function CommunicationModule({ patients, history, setHistory }: { patients: ReceptionPatient[]; history: ReceptionMessageHistory[]; setHistory: React.Dispatch<React.SetStateAction<ReceptionMessageHistory[]>> }) {
  const { theme } = useTheme(); const [tab, setTab] = useState<'send'|'history'>('send'); const [recipient, setRecipient] = useState('All Patients'); const [mobiles, setMobiles] = useState(''); const [message, setMessage] = useState(''); const [templateTitle, setTemplateTitle] = useState('General Notification');
  const charCount = message.length; const smsCount = Math.ceil(charCount / 160) || 1;
  const send = () => { if (!message.trim()) return Alert.alert('Message required', 'Enter a message before sending.'); if (recipient !== 'All Patients' && !mobiles.trim()) return Alert.alert('Recipients required', 'Enter at least one mobile number.'); const selectedCount = mobiles.split(',').map((item) => item.trim()).filter(Boolean).length; const recipients = recipient === 'All Patients' ? `All Patients (${patients.length})` : `${recipient} (${selectedCount})`; const delivered = recipient === 'All Patients' ? patients.length : selectedCount; setHistory((items) => [{ id:`MSG-${Date.now()}`, recipients, message:message.trim(), sentAt:new Date().toLocaleString('en-IN'), status:'Sent', messageType:templateTitle, delivered }, ...items]); setMessage(''); setMobiles(''); Alert.alert('Message sent', `Notification sent to ${recipients}.`); setTab('history'); };
  const templateTitles = ['Appointment Reminder','Follow-up Reminder','General Notification'];
  return <><Selector label="Communication View" items={['send','history']} selected={tab} onChange={(value) => setTab(value as typeof tab)} />{tab === 'send' ? <><Card><Selector label="To" items={['All Patients','By Filter','Select Patients']} selected={recipient} onChange={setRecipient} />{recipient !== 'All Patients' ? <Input label="Mobile Number(s)" value={mobiles} onChangeText={setMobiles} placeholder="Enter mobile numbers, comma separated" /> : null}<Selector label="Template" items={templateTitles} selected={templateTitle} onChange={(title) => { const index = templateTitles.indexOf(title); setTemplateTitle(title); setMessage(RECEPTION_MESSAGE_TEMPLATES[index] ?? ''); }} /><Input label="Message" value={message} onChangeText={setMessage} multiline placeholder="Type your message here" /><Text style={[styles.messageCounter, { color:theme.textMuted }]}>{charCount} / 160 Characters - {smsCount} SMS</Text><Button label="Send Message" onPress={send} /></Card><Section title="Quick Templates" />{RECEPTION_MESSAGE_TEMPLATES.map((template, index) => <Card key={template} onPress={() => { setMessage(template); setTemplateTitle(templateTitles[index]); }}><Text style={[styles.cardTitle, { color:theme.text }]}>{templateTitles[index]}</Text><Text style={[styles.bodyText, { color:theme.text }]}>{template}</Text></Card>)}</> : <><Section title="Message History" action={`${history.length} sent`} />{history.map((item) => <Card key={item.id}><View style={styles.rowTop}><Text style={[styles.cardTitle, { color:theme.text, flex:1 }]}>{item.messageType ?? 'General Notification'}</Text><Chip label={item.status} /></View><Text style={[styles.note, { color:theme.textMuted }]}>{item.sentAt} - {item.recipients}</Text><Text style={[styles.bodyText, { color:theme.text }]}>{item.message}</Text><Text style={[styles.deliveryText, { color:accent }]}>Delivered: {item.delivered ?? 0}</Text></Card>)}{!history.length ? <Text style={[styles.note, { color:theme.textMuted }]}>No messages sent in this session.</Text> : null}</>}</>;
}

function NotificationsSheet({ visible, notifications, onRead, onClose }: { visible: boolean; notifications: ReceptionNotification[]; onRead: () => void; onClose: () => void }) {
  const { theme } = useTheme(); React.useEffect(() => { if (visible) onRead(); }, [visible]);
  return <Sheet visible={visible} title="Patient Call Notifications" onClose={onClose}>{notifications.map((item) => <Card key={item.id}><Text style={[styles.cardTitle, { color:theme.text }]}>{item.patientName} called</Text><Text style={[styles.note, { color:theme.textMuted }]}>{item.token} - {item.doctor}</Text></Card>)}{!notifications.length ? <Text style={[styles.note, { color:theme.textMuted }]}>No patient call notifications yet.</Text> : null}</Sheet>;
}

export default function ReceptionPortalScreen() {
  const { user, signOut } = useAuth(); const { theme } = useTheme(); const scrollRef = useRef<ScrollView | null>(null);
  const [active, setActive] = useState<ReceptionModuleId>('dashboard'); const [drawer, setDrawer] = useState(false); const [profileOpen, setProfileOpen] = useState(false); const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [patients, setPatients] = useState(RECEPTION_PATIENTS); const [appointments, setAppointments] = useState(RECEPTION_APPOINTMENTS); const [queue, setQueue] = useState(RECEPTION_QUEUE); const [bills, setBills] = useState(RECEPTION_BILLS); const [notifications, setNotifications] = useState<ReceptionNotification[]>([]); const [messages, setMessages] = useState<ReceptionMessageHistory[]>(RECEPTION_MESSAGE_HISTORY); const [prefill, setPrefill] = useState({ name:'', phone:'' });
  const [profile, setProfile] = useState<ReceptionProfile>({ name:user?.name ?? 'Anita Sharma', role:'Senior Receptionist', email:'reception@vexoo.in', employeeId:'REC-2024-07', department:'Front Desk', shift:'Morning (8 AM - 4 PM)', phone:'+91 91234 56789' });
  useEffect(() => {
    const updateStatuses = () => setAppointments((items) => items.map((appt) => {
      const age = Date.now() - appt.createdAt;
      if (appt.status === 'Scheduled' && age >= 2 * 60 * 60 * 1000) return { ...appt, status:'No-Show' };
      if (appt.status === 'Paid' && appt.paidAt && Date.now() - appt.paidAt >= 6 * 60 * 60 * 1000) return { ...appt, status:'Visit Complete' };
      return appt;
    }));
    updateStatuses();
    const timer = setInterval(updateStatuses, 60000);
    return () => clearInterval(timer);
  }, []);
  const select = (id: ReceptionModuleId) => { setActive(id); requestAnimationFrame(() => scrollRef.current?.scrollTo({ y:0, animated:false })); pulseFor(420, 'Loading module'); };
  const addNotification = (entry: ReceptionQueueEntry) => setNotifications((items) => [{ id:`N-${Date.now()}`, patientName:entry.patientName, doctor:entry.doctor, token:entry.token, timestamp:Date.now(), read:false }, ...items]);
  const addToQueue = (patient: ReceptionPatient, draft: AppointmentDraft) => { if (!draft.complaint.trim()) return Alert.alert('Chief complaint required', 'Enter the reason for the visit.'); const appt: ReceptionAppointment = { id:`A${Date.now()}`, token:`OP-${String(appointments.length + 1).padStart(3,'0')}`, arrivalTime:nowTime(), scheduledDate:draft.scheduledDate, scheduledTime:draft.scheduledTime, patientName:patient.name, patientId:patient.id, doctor:draft.doctor, phone:patient.mobile, aadhar:patient.aadhar, visitType:draft.visitType, priority:draft.priority, chiefComplaint:draft.complaint, status:'In Queue', createdAt:Date.now() }; const entry: ReceptionQueueEntry = { apptId:appt.id, queueNo:queue.length + 1, token:appt.token, patientName:patient.name, patientId:patient.id, doctor:draft.doctor, priority:draft.priority, status:'Waiting', chiefComplaint:draft.complaint, queuedAt:Date.now() }; setAppointments((items) => [appt, ...items]); setQueue((items) => [...items, entry]); select('queue'); };
  const badges: Partial<Record<ReceptionModuleId, number>> = { appointments:appointments.filter((a) => a.status === 'Scheduled').length, queue:queue.filter((q) => q.status === 'Waiting').length, billing:bills.filter((b) => !b.paidAt).length };
  const module = active === 'dashboard' ? <Dashboard name={profile.name} appointments={appointments} queue={queue} bills={bills} patients={patients} onNav={select} /> : active === 'appointments' ? <AppointmentsModule patients={patients} appointments={appointments} setAppointments={setAppointments} queue={queue} setQueue={setQueue} onRegisterQuick={(name, phone) => { setPrefill({ name, phone }); select('patientreg'); }} /> : active === 'patientreg' ? <RegistrationModule patients={patients} setPatients={setPatients} addToQueue={addToQueue} prefill={prefill} clearPrefill={() => setPrefill({ name:'', phone:'' })} /> : active === 'patients' ? <PatientsModule patients={patients} addToQueue={addToQueue} /> : active === 'queue' ? <QueueModule queue={queue} setQueue={setQueue} appointments={appointments} setAppointments={setAppointments} setBills={setBills} addNotification={addNotification} /> : active === 'billing' ? <BillingModule bills={bills} setBills={setBills} appointments={appointments} setAppointments={setAppointments} /> : active === 'reports' ? <ReportsModule appointments={appointments} bills={bills} /> : <CommunicationModule patients={patients} history={messages} setHistory={setMessages} />;
  return <View style={[styles.safe, { backgroundColor:theme.bg }]}><Header active={active} unread={notifications.filter((n) => !n.read).length} onMenu={() => setDrawer(true)} onProfile={() => setProfileOpen(true)} onNotifications={() => setNotificationsOpen(true)} /><Drawer visible={drawer} active={active} badges={badges} onClose={() => setDrawer(false)} onSelect={select} onProfile={() => setProfileOpen(true)} onLogout={signOut} /><ScrollView ref={scrollRef} style={{ flex:1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>{module}</ScrollView><ProfileSheet visible={profileOpen} profile={profile} onSave={setProfile} onClose={() => setProfileOpen(false)} /><NotificationsSheet visible={notificationsOpen} notifications={notifications} onRead={() => setNotifications((items) => items.map((item) => ({ ...item, read:true })))} onClose={() => setNotificationsOpen(false)} /></View>;
}

const styles = StyleSheet.create({
  safe:{ flex:1 },
  content:{ paddingBottom:spacing.huge, paddingHorizontal:spacing.xl, paddingTop:spacing.sm },

  // Spacing hooks for the kit-backed primitives
  chipGap:{ marginTop:spacing.sm },
  btnGap:{ marginTop:spacing.sm },
  cardGap:{ marginBottom:spacing.md },
  fieldGap:{ marginTop:spacing.lg },
  selectorLabel:{ marginBottom:spacing.sm },

  // Card interior text
  cardTitle:{ ...T.title },
  bodyText:{ ...T.small, marginTop:spacing.sm },
  note:{ ...T.caption, marginBottom:spacing.xs, marginTop:3 },
  rowTop:{ alignItems:'center', flexDirection:'row', gap:spacing.md },
  chipLine:{ flexDirection:'row', flexWrap:'wrap', gap:6, marginTop:spacing.sm },
  actionRow:{ flexDirection:'row', flexWrap:'wrap', gap:spacing.md, marginTop:spacing.md },

  // Dashboard hero + info bands
  hero:{ borderRadius:radius.xl, borderWidth:StyleSheet.hairlineWidth*2, marginTop:spacing.xl, padding:spacing.xl },
  heroKicker:{ ...T.eyebrow, marginBottom:spacing.sm },
  heroTitle:{ ...T.h2, marginBottom:spacing.xs },
  infoBand:{ borderRadius:radius.lg, borderWidth:StyleSheet.hairlineWidth*2, marginTop:spacing.lg, padding:spacing.lg },

  // Stats. These are hand-rolled rather than <StatTile>, so they carry their
  // own card treatment. `minWidth` is what guarantees two-up on a phone — a
  // percentage basis alone does not reliably resolve inside a wrapping row.
  statGrid:{ flexDirection:'row', flexWrap:'wrap', gap:spacing.md, marginTop:spacing.lg },
  stat:{
    borderRadius:radius.xl,
    borderWidth:StyleSheet.hairlineWidth*2,
    flexBasis:'47%',
    flexGrow:1,
    flexShrink:0,
    minHeight:104,
    minWidth:150,
    padding:spacing.lg,
    ...elevation('sm','light'),
  },
  statLabel:{ ...T.label },
  statValue:{ ...T.numeral, marginTop:spacing.sm },

  // Leading slots on list rows
  token:{ alignItems:'center', backgroundColor:alpha(accent,0.12), borderRadius:radius.md, height:46, justifyContent:'center', width:46 },
  tokenText:{ ...T.mono, color:accent, fontSize:14 },
  smallAvatar:{ alignItems:'center', backgroundColor:alpha(accent,0.12), borderRadius:radius.md, height:44, justifyContent:'center', width:44 },
  smallAvatarText:{ ...T.titleSm, color:accent },
  queueNo:{ alignItems:'center', backgroundColor:accent, borderRadius:radius.md, height:48, justifyContent:'center', width:48 },
  queueNoText:{ ...T.numeralSm, color:'#FAFAF7' },

  // Profile sheet hero
  profileHero:{ alignItems:'center', marginBottom:spacing.xl },
  profileAvatar:{ alignItems:'center', backgroundColor:accent, borderRadius:radius.xl, height:72, justifyContent:'center', marginBottom:spacing.md, width:72 },
  profileAvatarText:{ ...T.h3, color:'#FAFAF7' },
  profileName:{ ...T.title },

  // Module-specific bits
  searchResult:{ borderBottomWidth:StyleSheet.hairlineWidth*2, borderColor:palette.borderCool, marginBottom:spacing.sm, padding:spacing.md },
  pagination:{ alignItems:'center', flexDirection:'row', gap:spacing.md, justifyContent:'center', marginVertical:spacing.lg },
  amount:{ ...T.numeralSm, marginTop:spacing.sm },
  waitTime:{ ...T.smallStrong, marginTop:spacing.md },
  callBanner:{ borderRadius:radius.lg, borderWidth:StyleSheet.hairlineWidth*2, marginTop:spacing.lg, padding:spacing.lg },
  billEditor:{ borderColor:palette.borderCool, borderRadius:radius.lg, borderWidth:StyleSheet.hairlineWidth*2, marginBottom:spacing.md, padding:spacing.md },
  billLineAmount:{ ...T.title, color:accent, marginBottom:spacing.sm, textAlign:'right' },
  messageCounter:{ ...T.caption, marginBottom:spacing.md, marginTop:spacing.xs },
  deliveryText:{ ...T.smallStrong, marginTop:spacing.md },
});
