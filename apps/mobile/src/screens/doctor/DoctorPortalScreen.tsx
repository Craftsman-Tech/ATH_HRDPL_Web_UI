import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { fontSize, fontWeight, palette, radius, spacing } from '@vexoo/shared';
import { useAuth, useTheme } from '../../components/AppContexts';
import { T, alpha, body, mix } from '../../theme';
import { metricIcon, moduleIcon } from '../../data/icons';
import {
  AppHeader, Avatar, Badge, Button as UiButton, Chip as UiChip, EmptyState,
  Field as UiField, Icon, NavDrawer, PillRow, ReadField, SearchField,
  SectionHeader, Sheet as UiSheet, StatGrid, StatTile, Surface, Touchable,
  pulseFor, toneFor, withPulse, type IconName,
} from '../../ui';
import {
  DOCTOR_APPOINTMENTS,
  DOCTOR_CONVERSATIONS,
  DOCTOR_ATTACHMENTS,
  DOCTOR_DOSAGES,
  DOCTOR_HISTORY,
  DOCTOR_LAB_TESTS,
  DOCTOR_MEDICINES,
  DOCTOR_MODULES,
  DOCTOR_PATIENTS,
  DOCTOR_TODAY,
  DOCTOR_TIMINGS,
  doctorAddDays,
  doctorShortDate,
  type DoctorAppointment,
  type DoctorAppointmentStatus,
  type DoctorConversation,
  type DoctorMedication,
  type DoctorModuleId,
  type DoctorPatient,
  type DoctorPriority,
  type DoctorRisk,
} from '../../data/doctorData';

const accent = palette.roleDoctor;

function useElapsed(start?: number, running = true) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!start || !running) return undefined;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [running, start]);

  if (!start) return '-';
  const seconds = Math.max(0, Math.floor((now - start) / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return hours > 0
    ? `${hours}h ${String(minutes).padStart(2, '0')}m`
    : `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

function toneColor(value: string) {
  const text = value.toLowerCase();
  if (text.includes('high') || text.includes('urgent') || text.includes('emergency')) return palette.rose;
  if (text.includes('medium') || text.includes('waiting') || text.includes('scheduled')) return palette.amber;
  if (text.includes('completed') || text.includes('low') || text.includes('active')) return palette.green;
  if (text.includes('consultation')) return palette.purple;
  return accent;
}

/* ── Local primitives ──────────────────────────────────────────────────────
   Call signatures are unchanged so the module renderers below are untouched;
   each now delegates to the shared UI kit, which is where the elevation,
   icons, focus rings and press physics come from. */

function Chip({ label }: { label: string }) {
  return <UiChip label={label} tone={toneFor(label)} dot style={styles.chipGap} />;
}

/** Leading icon for an action label, so buttons read at a glance. */
function buttonIcon(label: string): IconName | undefined {
  const v = label.toLowerCase();
  if (/start|continue|consult/.test(v))       return 'activity';
  if (/complete|completed|save|confirm/.test(v)) return 'checkCircle';
  if (/add|new|create/.test(v))               return 'plus';
  if (/edit|modify/.test(v))                  return 'edit';
  if (/remove|stop|delete|cancel edit/.test(v)) return 'trash';
  if (/attach|upload/.test(v))                return 'paperclip';
  if (/submit|send/.test(v))                  return 'send';
  if (/view|open/.test(v))                    return 'eye';
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
    <UiButton
      label={label}
      onPress={onPress}
      variant={variant}
      accent={accent}
      icon={buttonIcon(label)}
      style={styles.btnGap}
    />
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <Surface style={styles.cardGap} radiusSize="xl">{children}</Surface>;
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

function Section({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <SectionHeader title={title} action={action} onAction={onAction} accent={accent} />;
}

function Stat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return <StatTile label={label} value={value} detail={sub} color={color} icon={metricIcon(label)} />;
}

function Sheet({
  title,
  visible,
  onClose,
  children,
  subtitle,
  footer,
  scroll = true,
}: {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  subtitle?: string;
  /** Pinned action bar — the chat composer uses this. */
  footer?: React.ReactNode;
  /** Set false when the caller lays out its own scroller (chat thread). */
  scroll?: boolean;
}) {
  return (
    <UiSheet
      visible={visible}
      title={title}
      subtitle={subtitle}
      onClose={onClose}
      footer={footer}
      scroll={scroll}
    >
      {children}
    </UiSheet>
  );
}

/**
 * Multi-select list — lab tests, consume times. Now a real checkbox row rather
 * than an "ON" / "+" text marker.
 */
function ToggleList({ items, selected, onChange }: { items: string[]; selected: string[]; onChange: (items: string[]) => void }) {
  const { theme, mode } = useTheme();
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
            onPress={() => onChange(active ? selected.filter((x) => x !== item) : [...selected, item])}
            style={[
              styles.toggleItem,
              {
                backgroundColor: active ? alpha(accent, mode === 'dark' ? 0.18 : 0.09) : theme.card,
                borderColor: active ? accent : theme.border,
              },
            ]}
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

function OptionPicker({ label, items, selected, onChange }: { label: string; items: string[]; selected: string; onChange: (item: string) => void }) {
  const { theme } = useTheme();
  return (
    <View style={styles.fieldGap}>
      <Text style={[T.label, styles.pickerLabel, { color: theme.textMuted }]}>{label}</Text>
      <PillRow options={items.map((x) => ({ value: x, label: x }))} value={selected} onChange={onChange} accent={accent} />
    </View>
  );
}

function SearchPicker({ label, items, selected, onChange }: { label: string; items: string[]; selected: string; onChange: (item: string) => void }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState(selected);
  const [open, setOpen] = useState(false);

  useEffect(() => setQuery(selected), [selected]);

  const matches = items.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8);
  return (
    <View style={styles.fieldGap}>
      <UiField
        label={label}
        icon="search"
        value={query}
        onChangeText={(value) => { setQuery(value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Type to search medicine"
        accent={accent}
        trailingIcon={query ? 'close' : undefined}
        onTrailingPress={() => { setQuery(''); setOpen(true); }}
      />
      {open ? (
        <Surface style={styles.searchResults} radiusSize="lg" lift="md">
          {matches.map((item, index) => (
            <Touchable
              key={item}
              press="none"
              style={[
                styles.searchResult,
                { borderBottomColor: theme.hairline, borderBottomWidth: index === matches.length - 1 ? 0 : StyleSheet.hairlineWidth * 2 },
              ]}
              onPress={() => { onChange(item); setQuery(item); setOpen(false); }}
            >
              <Icon name="pill" size={15} color={item === selected ? accent : theme.textFaint} strokeWidth={2} />
              <Text style={[T.small, styles.searchResultText, { color: item === selected ? accent : theme.text }]}>{item}</Text>
              {item === selected ? <Icon name="check" size={14} color={accent} strokeWidth={2.6} /> : null}
            </Touchable>
          ))}
          {!matches.length ? (
            <Text style={[T.caption, styles.searchEmpty, { color: theme.textMuted }]}>No stocked medicine found.</Text>
          ) : null}
        </Surface>
      ) : null}
    </View>
  );
}

type DoctorProfile = { name: string; specialisation: string; department: string; phone: string; email: string; employeeId: string };

function DoctorProfileSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [profile, setProfile] = useState<DoctorProfile>({ name: user?.name ?? 'Dr. Meera Sharma', specialisation: 'Cardiologist', department: 'Outpatient', phone: '+91 98765 43210', email: 'doctor@vexoo.in', employeeId: 'DOC-2024-14' });
  const [draft, setDraft] = useState(profile);
  const [editing, setEditing] = useState(false);

  const beginEdit = () => { setDraft(profile); setEditing(true); };
  const save = () => {
    if (!draft.name.trim() || !draft.email.trim() || !draft.phone.trim()) {
      Alert.alert('Required details', 'Name, email, and phone number are required.');
      return;
    }
    setProfile(draft);
    setEditing(false);
    Alert.alert('Profile updated', 'Your Doctor profile was updated successfully.');
  };

  return (
    <Sheet visible={visible} title={editing ? 'Edit Profile' : 'My Profile'} onClose={onClose}>
      {!editing ? (
        <>
          <View style={styles.profileHero}>
            <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{initials(profile.name)}</Text></View>
            <Text style={[styles.profileName, { color: theme.text }]}>{profile.name}</Text>
            <Text style={[styles.inlineSub, { color: theme.textMuted }]}>{profile.specialisation}</Text>
            <Text style={[styles.inlineSub, { color: theme.textMuted }]}>{profile.email}</Text>
          </View>
          <Field label="Employee ID" value={profile.employeeId} />
          <Field label="Specialisation" value={profile.specialisation} />
          <Field label="Department" value={profile.department} />
          <Field label="Phone" value={profile.phone} />
          <View style={styles.quickGrid}><Button label="Close" onPress={onClose} variant="ghost" /><Button label="Edit Profile" onPress={beginEdit} /></View>
        </>
      ) : (
        <>
          <Input label="Full Name" value={draft.name} onChangeText={(name) => setDraft((item) => ({ ...item, name }))} />
          <Input label="Specialisation" value={draft.specialisation} onChangeText={(specialisation) => setDraft((item) => ({ ...item, specialisation }))} />
          <Input label="Department" value={draft.department} onChangeText={(department) => setDraft((item) => ({ ...item, department }))} />
          <Input label="Phone" value={draft.phone} onChangeText={(phone) => setDraft((item) => ({ ...item, phone }))} />
          <Input label="Email" value={draft.email} onChangeText={(email) => setDraft((item) => ({ ...item, email }))} />
          <View style={styles.quickGrid}><Button label="Cancel" onPress={() => setEditing(false)} variant="ghost" /><Button label="Save Changes" onPress={save} /></View>
        </>
      )}
    </Sheet>
  );
}

function DoctorHelpSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState(user?.name ?? 'Dr. Meera Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [hospital, setHospital] = useState('Vexoo General Hospital');
  const [role, setRole] = useState('Doctor');
  const [issue, setIssue] = useState('');
  const [evidence, setEvidence] = useState('');
  const [sent, setSent] = useState(false);

  const close = () => { setSent(false); onClose(); };
  const submit = () => {
    if (!issue.trim()) {
      Alert.alert('Describe the issue', 'Please tell our support team what went wrong.');
      return;
    }
    setSent(true);
  };

  const pickEvidence = async () => {
    try {
      const result = await withPulse(() => DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
        multiple: false,
      }), 'Opening files');
      if (!result.canceled && result.assets[0]) setEvidence(result.assets[0].name);
    } catch {
      Alert.alert('Unable to open files', 'Please check the device file permissions and try again.');
    }
  };

  return (
    <Sheet visible={visible} title="Vexoo Customer Support" onClose={close}>
      {sent ? (
        <View style={styles.successBox}>
          <View style={[styles.successMark, { backgroundColor: theme.statusBg.success }]}>
            <Icon name="checkCircle" size={28} color={theme.statusText.success} strokeWidth={2} />
          </View>
          <Text style={[styles.profileName, { color: theme.text }]}>Message Sent Successfully</Text>
          <Text style={[styles.note, { color: theme.textMuted, textAlign: 'center' }]}>Our team will reach out soon.</Text>
          <Button label="Done" onPress={close} />
        </View>
      ) : (
        <>
          <Input label="Name" value={name} onChangeText={setName} />
          <Input label="Phone Number" value={phone} onChangeText={setPhone} />
          <Input label="Hospital Name" value={hospital} onChangeText={setHospital} />
          <Input label="Role" value={role} onChangeText={setRole} />
          <Input label="Describe your issue" value={issue} onChangeText={setIssue} multiline placeholder="Tell us what is going wrong in as much detail as you can" />
          <TouchableOpacity style={[styles.uploadButton, { backgroundColor: theme.bg, borderColor: theme.border }]} onPress={pickEvidence}>
            <Text style={[styles.uploadText, { color: evidence ? accent : theme.text }]}>{evidence || 'Attach evidence (optional)'}</Text>
          </TouchableOpacity>
          {evidence ? <Button label="Remove Attachment" onPress={() => setEvidence('')} variant="ghost" /> : null}
          <View style={styles.quickGrid}><Button label="Cancel" onPress={close} variant="ghost" /><Button label="Submit" onPress={submit} /></View>
        </>
      )}
    </Sheet>
  );
}

function Drawer({
  open,
  active,
  onClose,
  onSelect,
  onSignOut,
  onProfile,
  onHelp,
}: {
  open: boolean;
  active: DoctorModuleId;
  onClose: () => void;
  onSelect: (id: DoctorModuleId) => void;
  onSignOut: () => void;
  onProfile: () => void;
  onHelp: () => void;
}) {
  const { user } = useAuth();
  return (
    <NavDrawer
      visible={open}
      items={DOCTOR_MODULES.map((item) => ({ id: item.id, label: item.label, icon: moduleIcon(item.label) }))}
      active={active}
      accent={accent}
      roleLabel="Doctor"
      userName={user?.name ?? 'Dr. Meera Sharma'}
      userEmail={user?.email}
      onClose={onClose}
      onSelect={onSelect}
      onProfile={onProfile}
      onHelp={onHelp}
      onSignOut={onSignOut}
    />
  );
}

function Header({ active, onMenu, onProfile, onHelp }: { active: DoctorModuleId; onMenu: () => void; onProfile: () => void; onHelp: () => void }) {
  const { user } = useAuth();
  const title = DOCTOR_MODULES.find((item) => item.id === active)?.label ?? "Today's Queue";
  const subtitles: Record<DoctorModuleId, string> = {
    queue: 'Walk-ins and patients scheduled for later today.',
    patients: 'Search, view and manage your patients.',
    schedule: 'View today and upcoming appointments.',
    messages: 'Conversations with your patients.',
  };
  return (
    <AppHeader
      title={title}
      subtitle={subtitles[active]}
      roleLabel="Doctor Portal"
      userName={user?.name ?? 'Doctor'}
      accent={accent}
      showClock
      onMenu={onMenu}
      onProfile={onProfile}
      onHelp={onHelp}
    />
  );
}

function AppointmentCard({
  appt,
  onOpen,
  onStart,
}: {
  appt: DoctorAppointment;
  onOpen: () => void;
  onStart?: () => void;
}) {
  const { theme } = useTheme();
  const elapsed = useElapsed(appt.queuedAt, appt.status === 'Waiting');
  return (
    <Surface onPress={onOpen} style={styles.row} accent={appt.priority === 'Urgent' ? palette.rose : undefined}>
      <View style={[styles.token, { backgroundColor: appt.priority === 'Urgent' ? alpha(palette.rose, 0.12) : alpha(accent, 0.12) }]}>
        <Text style={[styles.tokenText, { color: appt.priority === 'Urgent' ? palette.rose : accent }]}>{appt.token.replace('OP-', '')}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.rowTitle, { color: theme.text }]}>{appt.name}</Text>
        <Text style={[styles.rowSub, { color: theme.textMuted }]}>{appt.chiefComplaint}</Text>
        <Text style={[styles.rowMeta, { color: appt.status === 'Waiting' ? palette.amber : theme.textMuted }]}>
          {appt.status === 'Waiting' ? `Waiting ${elapsed}` : appt.scheduledTime ?? appt.visitType} - {appt.condition}
        </Text>
        <View style={styles.chipLine}>
          <Chip label={appt.priority} />
          <Chip label={appt.status} />
        </View>
        {onStart && appt.status !== 'Completed' ? <Button label="Start Consultation" onPress={onStart} /> : null}
      </View>
    </Surface>
  );
}

function AppointmentDetailSheet({ appt, onClose, onStart }: { appt: DoctorAppointment | null; onClose: () => void; onStart: (appt: DoctorAppointment) => void }) {
  const { theme } = useTheme();
  const elapsed = useElapsed(appt?.queuedAt, appt?.status === 'Waiting');
  if (!appt) return null;
  const canStart = appt.date === DOCTOR_TODAY && appt.status !== 'Completed';
  return (
    <Sheet visible={!!appt} title="Patient Details" onClose={onClose}>
      <View style={styles.profileHead}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials(appt.name)}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.inlineTitle, { color: theme.text }]}>{appt.name}</Text>
          <Text style={[styles.inlineSub, { color: theme.textMuted }]}>{appt.patientId} - {appt.age} yrs - {appt.gender}</Text>
        </View>
        <Chip label={appt.riskLevel} />
      </View>
      <View style={styles.chipLine}><Chip label={appt.priority} /><Chip label={appt.status} /></View>
      <Section title="Appointment" />
      <Field label="Token" value={appt.token} />
      <Field label="Date & Time" value={`${doctorShortDate(appt.date)} - ${appt.scheduledTime ?? appt.visitType}`} />
      {appt.status === 'Waiting' ? <Field label="Live Wait Time" value={elapsed} /> : null}
      <Field label="Visit Type" value={appt.visitType} />
      <Field label="Chief Complaint" value={appt.chiefComplaint} />
      <Field label="Known Condition" value={appt.condition} />
      {appt.date === DOCTOR_TODAY ? (
        <>
          <Section title="Vitals" />
          {appt.vitals.length ? appt.vitals.map((vital) => <Field key={vital.label} label={vital.label} value={`${vital.value} ${vital.unit}`} />) : <Text style={[styles.note, { color: theme.textMuted }]}>No vitals recorded.</Text>}
          {appt.visitType === 'Follow-Up' && appt.activeMedications.length ? (
            <><Section title="Active Medications" />{appt.activeMedications.map((med) => <Field key={med.id} label={med.name} value={`${med.dosage} - ${med.timing}`} />)}</>
          ) : null}
        </>
      ) : null}
      <View style={styles.quickGrid}>
        <Button label="Close" onPress={onClose} variant="ghost" />
        {canStart ? <Button label={appt.status === 'In Consultation' ? 'Continue Consultation' : 'Start Consultation'} onPress={() => onStart(appt)} /> : null}
      </View>
    </Sheet>
  );
}

function ConsultationSheet({
  appt,
  visible,
  onClose,
  onComplete,
}: {
  appt: DoctorAppointment | null;
  visible: boolean;
  onClose: () => void;
  onComplete: (appt: DoctorAppointment) => void;
}) {
  const { theme } = useTheme();
  const [tab, setTab] = useState<'visit' | 'notes' | 'meds' | 'history' | 'attachments'>('visit');
  const [symptoms, setSymptoms] = useState('');
  const [investigations, setInvestigations] = useState('');
  const [labTests, setLabTests] = useState<string[]>([]);
  const [meds, setMeds] = useState<DoctorMedication[]>([]);
  const [medicine, setMedicine] = useState('');
  const [dose, setDose] = useState('');
  const [timings, setTimings] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);

  useEffect(() => {
    if (!appt) return;
    setTab('visit');
    setSymptoms(appt.consultation?.symptoms ?? '');
    setInvestigations(appt.consultation?.investigations ?? '');
    setLabTests(appt.consultation?.labTests ?? []);
    setMeds(appt.activeMedications);
    setMedicine('');
    setDose('');
    setTimings([]);
    setDuration('');
    setEditingId(null);
    setHistoryId(null);
  }, [appt?.id]);

  if (!appt) return null;

  const history = DOCTOR_HISTORY[appt.patientId] ?? [];
  const attachments = DOCTOR_ATTACHMENTS[appt.patientId] ?? [];
  const historyDetail = history.find((item) => item.id === historyId) ?? null;

  const resetMedication = () => {
    setMedicine('');
    setDose('');
    setTimings([]);
    setDuration('');
    setEditingId(null);
  };

  const saveMedication = () => {
    if (!medicine.trim() || !dose.trim() || !timings.length) {
      Alert.alert('Medication incomplete', 'Select a medicine, dosage frequency, and at least one consume time.');
      return;
    }
    const next: DoctorMedication = { id: editingId ?? `DM-${Date.now()}`, name: medicine.trim(), dosage: dose.trim(), timing: timings.join(', '), duration: duration.trim() || undefined, status: 'Active', startDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) };
    setMeds((items) => editingId ? items.map((item) => item.id === editingId ? next : item) : [...items, next]);
    resetMedication();
  };

  const performComplete = () => {
    onComplete({
      ...appt,
      status: 'Completed',
      activeMedications: meds,
      consultation: { symptoms, investigations, labTests, completedAt: Date.now() },
    });
  };

  const complete = () => {
    Alert.alert('Complete consultation?', 'This will save the notes, medications, and lab recommendations and mark the appointment completed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Review Completed', onPress: performComplete },
    ]);
  };

  return (
    <Sheet visible={visible} title="Consultation" onClose={onClose}>
      <View style={styles.profileHead}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials(appt.name)}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.inlineTitle}>{appt.name}</Text>
          <Text style={styles.inlineSub}>{appt.patientId} - {appt.age} yrs - {appt.gender}</Text>
        </View>
        <Chip label={appt.riskLevel} />
      </View>
      <View style={styles.segment}>
        <PillRow
          options={[
            { value: 'visit'       as const, label: 'Visit Details', icon: 'clipboard' },
            { value: 'notes'       as const, label: 'Notes',         icon: 'edit' },
            { value: 'meds'        as const, label: 'Medications',   icon: 'pill' },
            { value: 'history'     as const, label: 'History',       icon: 'clock' },
            { value: 'attachments' as const, label: 'Attachments',   icon: 'paperclip' },
          ]}
          value={tab}
          onChange={setTab}
          accent={accent}
        />
      </View>
      {tab === 'visit' ? (
        <>
          <Field label="Chief Complaint" value={appt.chiefComplaint} />
          <View style={styles.fieldGrid}>
            <Field label="Visit Type" value={appt.visitType} />
            <Field label="Priority" value={appt.priority} />
            <Field label="Blood Group" value={appt.bloodGroup} />
            <Field label="Condition" value={appt.condition} />
          </View>
          <Section title="Vitals" />
          {appt.vitals.length ? appt.vitals.map((v) => <Field key={v.label} label={v.label} value={`${v.value} ${v.unit}`} />) : <Text style={styles.note}>No vitals recorded for this visit.</Text>}
        </>
      ) : null}
      {tab === 'notes' ? (
        <>
          <Input label="Symptoms" value={symptoms} onChangeText={setSymptoms} multiline placeholder="Describe symptoms observed during examination" />
          <Input label="Investigations" value={investigations} onChangeText={setInvestigations} multiline placeholder="Clinical findings and examination notes" />
          <Text style={styles.inputLabel}>Lab Test Recommendation</Text>
          <ToggleList items={DOCTOR_LAB_TESTS} selected={labTests} onChange={setLabTests} />
        </>
      ) : null}
      {tab === 'meds' ? (
        <>
          <Section title="Active Medications" />
          {meds.map((m) => (
            <View key={m.id} style={styles.medRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inlineTitle, { color: theme.text }]}>{m.name}</Text>
                <Text style={[styles.inlineSub, { color: theme.textMuted }]}>{m.dosage} - {m.timing}{m.duration ? ` - ${m.duration}` : ''}</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => { setEditingId(m.id); setMedicine(m.name); setDose(DOCTOR_DOSAGES.includes(m.dosage) ? m.dosage : ''); setTimings(m.timing.split(',').map((item) => item.trim()).filter(Boolean)); setDuration(m.duration ?? ''); }}>
                  <Text style={[styles.inlineAction, { color: accent }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMeds((items) => items.filter((item) => item.id !== m.id))}>
                  <Text style={[styles.inlineAction, { color: palette.rose }]}>Stop</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {!meds.length ? <Text style={[styles.note, { color: theme.textMuted }]}>No active medications.</Text> : null}
          <Section title={editingId ? 'Modify Medication' : 'Add Medication'} />
          <SearchPicker label="Medicine" items={DOCTOR_MEDICINES} selected={medicine} onChange={setMedicine} />
          <OptionPicker label="Dosage" items={DOCTOR_DOSAGES} selected={dose} onChange={setDose} />
          <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Consume Time</Text>
          <ToggleList items={DOCTOR_TIMINGS} selected={timings} onChange={setTimings} />
          <Input label="Duration (optional)" value={duration} onChangeText={setDuration} placeholder="Example: 30 days or ongoing" />
          <Button label={editingId ? 'Save Changes' : 'Add Medication'} onPress={saveMedication} variant="ghost" />
          {editingId ? <Button label="Cancel Edit" onPress={resetMedication} variant="ghost" /> : null}
        </>
      ) : null}
      {tab === 'history' ? (
        <>
          <Text style={[styles.note, { color: theme.textMuted }]}>Visits from all participating hospitals during the last six months.</Text>
          {history.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.historyCard, { backgroundColor: theme.bg, borderColor: theme.border }]} onPress={() => setHistoryId(historyId === item.id ? null : item.id)}>
              <View style={styles.historyTop}><Text style={[styles.inlineTitle, { color: theme.text }]}>{item.diagnosis}</Text><Text style={[styles.historyDate, { color: accent }]}>{item.date}</Text></View>
              <Text style={[styles.inlineSub, { color: theme.textMuted }]}>{item.hospital} - {item.doctor}</Text>
              <Text style={[styles.historySummary, { color: theme.text }]}>{item.prescriptionSummary}</Text>
              {historyDetail?.id === item.id ? (
                <View style={[styles.historyDetail, { borderTopColor: theme.border }]}>
                  {item.symptoms ? <Field label="Symptoms" value={item.symptoms} /> : null}
                  {item.investigations ? <Field label="Investigations" value={item.investigations} /> : null}
                  {item.medications?.map((med, index) => <Field key={`${med.name}-${index}`} label={med.name} value={`${med.dosage} - ${med.timing}`} />)}
                  {item.labTests?.length ? <Field label="Tests Recommended" value={item.labTests.join(', ')} /> : null}
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
          {!history.length ? <Text style={[styles.note, { color: theme.textMuted }]}>No visit history found in the last six months.</Text> : null}
        </>
      ) : null}
      {tab === 'attachments' ? (
        <>
          <Text style={[styles.note, { color: theme.textMuted }]}>Lab reports and clinical attachments from all participating hospitals.</Text>
          {attachments.map((item) => (
            <View key={item.id} style={[styles.attachmentCard, { backgroundColor: theme.bg, borderColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.inlineTitle, { color: theme.text }]}>{item.testName}</Text>
                <Text style={[styles.inlineSub, { color: theme.textMuted }]}>{item.date} - {item.hospital}</Text>
                <Text style={[styles.fileName, { color: theme.textMuted }]}>{item.fileName}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Chip label={item.result} />
                <TouchableOpacity onPress={() => Alert.alert(item.testName, `${item.fileName}\n\nDocument preview will open when file storage is connected.`)}>
                  <Text style={[styles.inlineAction, { color: accent }]}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {!attachments.length ? <Text style={[styles.note, { color: theme.textMuted }]}>No attachments found in the last six months.</Text> : null}
        </>
      ) : null}
      <View style={styles.quickGrid}>
        <Button label="Close" onPress={onClose} variant="ghost" />
        <Button label="Review Completed" onPress={complete} />
      </View>
    </Sheet>
  );
}

function Queue({
  appointments,
  openDetails,
  beginConsult,
}: {
  appointments: DoctorAppointment[];
  openDetails: (appt: DoctorAppointment) => void;
  beginConsult: (appt: DoctorAppointment) => void;
}) {
  const todays = appointments.filter((item) => item.date === DOCTOR_TODAY);
  return (
    <>
      <View style={styles.statGrid}>
        <Stat label="Waiting" value={String(todays.filter((a) => a.status === 'Waiting').length)} sub="for doctor" color={palette.amber} />
        <Stat label="In Consultation" value={String(todays.filter((a) => a.status === 'In Consultation').length)} sub="active consults" color={palette.purple} />
        <Stat label="Scheduled" value={String(todays.filter((a) => a.status === 'Scheduled').length)} sub="later today" color={accent} />
        <Stat label="Completed" value={String(todays.filter((a) => a.status === 'Completed').length)} sub="today" color={palette.green} />
      </View>
      <Section title="Today's Queue" action={`${todays.length} patients`} />
      {todays.map((appt) => <AppointmentCard key={appt.id} appt={appt} onOpen={() => openDetails(appt)} onStart={() => beginConsult(appt)} />)}
      {!todays.length ? <Text style={styles.note}>No patients on today's queue.</Text> : null}
    </>
  );
}

function Patients() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DoctorPatient | null>(null);
  const filtered = DOCTOR_PATIENTS.filter((patient) =>
    `${patient.id} ${patient.name} ${patient.condition}`.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <>
      <Section title="My Patients" action={`${filtered.length} records`} />
      <TextInput value={query} onChangeText={setQuery} placeholder="Search patients, ID, condition" placeholderTextColor={theme.textMuted} style={[styles.search, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]} />
      {filtered.map((patient) => (
        <Surface key={patient.id} style={styles.row} onPress={() => setSelected(patient)}>
          <View style={styles.avatarSmall}><Text style={styles.avatarSmallText}>{initials(patient.name)}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>{patient.name}</Text>
            <Text style={[styles.rowSub, { color: theme.textMuted }]}>{patient.id} - {patient.age} yrs - {patient.condition}</Text>
            <Text style={[styles.rowMeta, { color: theme.textMuted }]}>Last visit {patient.lastVisit}</Text>
            <Text style={[styles.rowMeta, { color: theme.textMuted }]}>{patient.activeMedications.length ? `${patient.activeMedications.length} active medication${patient.activeMedications.length === 1 ? '' : 's'}` : 'No active medications'}</Text>
          </View>
          <Chip label={patient.riskLevel} />
        </Surface>
      ))}
      <Sheet visible={!!selected} title="Patient Profile" onClose={() => setSelected(null)}>
        {selected ? (
          <>
            <View style={styles.profileHead}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{initials(selected.name)}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inlineTitle}>{selected.name}</Text>
                <Text style={styles.inlineSub}>{selected.id} - {selected.age} yrs - {selected.gender}</Text>
              </View>
              <Chip label={selected.riskLevel} />
            </View>
            <Field label="Phone" value={selected.phone} />
            <Field label="Blood Group" value={selected.bloodGroup} />
            <Field label="Condition" value={selected.condition} />
            <Field label="Last Visit" value={selected.lastVisit} />
            <Section title="Active Medications" />
            {selected.activeMedications.length ? selected.activeMedications.map((m) => <Field key={m.id} label={m.name} value={`${m.dosage} - ${m.timing}`} />) : <Text style={styles.note}>No active medications.</Text>}
            <Button label="Close" onPress={() => setSelected(null)} />
          </>
        ) : null}
      </Sheet>
    </>
  );
}

function Schedule({
  appointments,
  openDetails,
  beginConsult,
}: {
  appointments: DoctorAppointment[];
  openDetails: (appt: DoctorAppointment) => void;
  beginConsult: (appt: DoctorAppointment) => void;
}) {
  const { theme } = useTheme();
  const dates = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    return Array.from({ length: 7 }, (_, index) => doctorAddDays(mondayOffset + index));
  }, []);
  const [activeDate, setActiveDate] = useState(DOCTOR_TODAY);
  const dayAppts = appointments.filter((item) => item.date === activeDate);
  const isToday = activeDate === DOCTOR_TODAY;
  return (
    <>
      <Section title="Week Schedule" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateStrip}>
        {dates.map((date) => {
          const active = date === activeDate;
          const count = appointments.filter((item) => item.date === date).length;
          return (
            <TouchableOpacity key={date} style={[styles.datePill, { backgroundColor: active ? accent : theme.card, borderColor: active ? accent : theme.border }]} onPress={() => setActiveDate(date)}>
              <Text style={[styles.dateText, { color: active ? '#fff' : theme.text }]}>{doctorShortDate(date)}</Text>
              <Text style={[styles.dateSub, { color: active ? 'rgba(255,255,255,0.78)' : theme.textMuted }]}>{count} appts{date === DOCTOR_TODAY ? ' - Today' : ''}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Section title={isToday ? "Today's Appointments" : 'Scheduled Appointments'} action={`${dayAppts.length} items`} />
      {dayAppts.map((appt) => <AppointmentCard key={appt.id} appt={appt} onOpen={() => openDetails(appt)} onStart={isToday ? () => beginConsult(appt) : undefined} />)}
      {!dayAppts.length ? <Text style={styles.note}>No appointments on this date.</Text> : null}
    </>
  );
}

/**
 * ============================================================================
 *  Messages
 * ============================================================================
 *  An inbox, not a carousel. The previous version put every conversation in a
 *  horizontal pill strip with the open thread permanently below it, which only
 *  worked while there were two or three: past that the strip ran off-screen and
 *  the thread pushed the list out of view entirely.
 *
 *  Now it is the pattern every messaging app uses, because it scales:
 *
 *    Messages            ← searchable vertical list
 *    ┌──────────────────────────────┐
 *    │ SJ  Sarah Johnson    2m  (2) │  ← unread: tinted, accent rail, bold
 *    │     When should I take my …  │
 *    ├──────────────────────────────┤
 *    │ MW  Marcus Williams      1h  │  ← read: quiet
 *    └──────────────────────────────┘
 *              ↓ tap
 *    a full chat sheet: whole history, pinned composer
 * ============================================================================
 */
function Messages() {
  const { theme, mode } = useTheme();
  const [convos, setConvos] = useState<DoctorConversation[]>(DOCTOR_CONVERSATIONS);
  const [openName, setOpenName] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const totalUnread = convos.reduce((sum, item) => sum + item.unread, 0);
  const open = convos.find((c) => c.name === openName) ?? null;

  const filtered = convos.filter((c) =>
    `${c.name} ${c.last}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  /** Opening a thread clears its unread count, as it would on any inbox. */
  const openChat = (name: string) => {
    setOpenName(name);
    setConvos((items) => items.map((item) => (item.name === name ? { ...item, unread: 0 } : item)));
  };

  const send = (text: string) => {
    if (!text.trim() || !openName) return;
    const msg = {
      from: 'doctor' as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setConvos((items) =>
      items.map((item) =>
        item.name === openName
          ? { ...item, msgs: [...item.msgs, msg], last: msg.text, time: 'now', unread: 0 }
          : item,
      ),
    );
  };

  return (
    <>
      <Section
        title="Messages"
        action={totalUnread ? `${totalUnread} unread` : 'All read'}
      />

      {convos.length > 4 ? (
        <View style={styles.search}>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Search conversations"
            accent={accent}
          />
        </View>
      ) : null}

      {filtered.map((convo) => {
        const unread = convo.unread > 0;
        return (
          <Surface
            key={convo.name}
            onPress={() => openChat(convo.name)}
            accent={unread ? accent : undefined}
            style={[
              styles.convoRow,
              // An opaque blend, not a translucent overlay — see `mix`.
              unread && { backgroundColor: mix(theme.card, accent, mode === 'dark' ? 0.14 : 0.07) },
            ]}
          >
            <Avatar name={convo.name} size={46} />

            <View style={styles.convoBody}>
              <View style={styles.convoTop}>
                <Text
                  style={[unread ? T.title : T.subtitle, styles.convoNameText, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {convo.name}
                </Text>
                <Text style={[T.caption, { color: unread ? accent : theme.textFaint }]}>
                  {convo.time}
                </Text>
              </View>

              <View style={styles.convoBottom}>
                <Text
                  style={[
                    unread ? T.smallStrong : T.small,
                    styles.convoPreview,
                    { color: unread ? theme.text : theme.textMuted },
                  ]}
                  numberOfLines={1}
                >
                  {convo.last}
                </Text>
                {unread ? <Badge value={convo.unread} color={accent} /> : null}
              </View>
            </View>
          </Surface>
        );
      })}

      {!filtered.length ? (
        <EmptyState
          icon="message"
          title={query ? 'No matching conversations' : 'No messages yet'}
          message={
            query
              ? 'Try a different name or keyword.'
              : 'Patient messages will appear here as they arrive.'
          }
          accent={accent}
        />
      ) : null}

      <ChatSheet convo={open} onClose={() => setOpenName(null)} onSend={send} />
    </>
  );
}

/** The open thread: full history, newest at the bottom, pinned composer. */
function ChatSheet({
  convo,
  onClose,
  onSend,
}: {
  convo: DoctorConversation | null;
  onClose: () => void;
  onSend: (text: string) => void;
}) {
  const { theme, mode } = useTheme();
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  // Reset the composer when switching threads.
  useEffect(() => { setDraft(''); }, [convo?.name]);

  const submit = () => {
    if (!draft.trim()) return;
    onSend(draft);
    setDraft('');
  };

  return (
    <Sheet
      visible={!!convo}
      title={convo?.name ?? ''}
      subtitle={convo ? `${convo.msgs.length} messages · last activity ${convo.time}` : undefined}
      onClose={onClose}
      scroll={false}
      footer={
        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a reply…"
            placeholderTextColor={theme.textFaint}
            multiline
            style={[
              styles.composerInput,
              { backgroundColor: theme.bgSunken, borderColor: theme.border, color: theme.text },
            ]}
          />
          <Touchable
            onPress={submit}
            disabled={!draft.trim()}
            accessibilityLabel="Send message"
            style={[styles.sendButton, { backgroundColor: accent }]}
          >
            <Icon name="send" size={19} color="#FAFAF7" strokeWidth={2.2} />
          </Touchable>
        </View>
      }
    >
      {convo ? (
        <ScrollView
          ref={scrollRef}
          style={styles.threadScroll}
          contentContainerStyle={styles.thread}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {convo.msgs.map((msg, index) => {
            const mine = msg.from === 'doctor';
            return (
              <View
                key={`${msg.time}-${index}`}
                style={[
                  styles.messageBubble,
                  mine
                    ? [styles.messageDoctor, { backgroundColor: accent }]
                    : [styles.messagePatient, { backgroundColor: theme.bgSunken, borderColor: theme.hairline }],
                ]}
              >
                <Text style={[T.small, { color: mine ? '#FAFAF7' : theme.text }]}>{msg.text}</Text>
                <Text
                  style={[
                    T.caption,
                    styles.messageTime,
                    { color: mine ? alpha('#FAFAF7', 0.7) : theme.textFaint },
                  ]}
                >
                  {msg.time}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      ) : null}
    </Sheet>
  );
}

function ModuleBody({
  active,
  appointments,
  openDetails,
  beginConsult,
}: {
  active: DoctorModuleId;
  appointments: DoctorAppointment[];
  openDetails: (appt: DoctorAppointment) => void;
  beginConsult: (appt: DoctorAppointment) => void;
}) {
  if (active === 'queue') return <Queue appointments={appointments} openDetails={openDetails} beginConsult={beginConsult} />;
  if (active === 'patients') return <Patients />;
  if (active === 'schedule') return <Schedule appointments={appointments} openDetails={openDetails} beginConsult={beginConsult} />;
  return <Messages />;
}

export default function DoctorPortalScreen() {
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView | null>(null);
  const [active, setActive] = useState<DoctorModuleId>('queue');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(DOCTOR_APPOINTMENTS);
  const [consulting, setConsulting] = useState<DoctorAppointment | null>(null);
  const [viewing, setViewing] = useState<DoctorAppointment | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const quickStats = useMemo(() => ({
    waiting: appointments.filter((item) => item.date === DOCTOR_TODAY && item.status === 'Waiting').length,
    urgent: appointments.filter((item) => item.date === DOCTOR_TODAY && item.priority === 'Urgent').length,
  }), [appointments]);

  const selectModule = (id: DoctorModuleId) => {
    setActive(id);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 0, animated: false }));
    pulseFor(420, 'Loading module');
  };

  const completeConsult = (updated: DoctorAppointment) => {
    setAppointments((items) => items.map((item) => item.id === updated.id ? updated : item));
    setConsulting(null);
    setActive('queue');
  };

  const beginConsult = (appt: DoctorAppointment) => {
    const updated = appt.status === 'Waiting' || appt.status === 'Scheduled' ? { ...appt, status: 'In Consultation' as const } : appt;
    setAppointments((items) => items.map((item) => item.id === updated.id ? updated : item));
    setViewing(null);
    setConsulting(updated);
  };

  return (
    <View style={[styles.safe, { backgroundColor: theme.bg }]}>
      <Header active={active} onMenu={() => setDrawerOpen(true)} onProfile={() => setProfileOpen(true)} onHelp={() => setHelpOpen(true)} />
      <Drawer open={drawerOpen} active={active} onClose={() => setDrawerOpen(false)} onSelect={selectModule} onSignOut={signOut} onProfile={() => setProfileOpen(true)} onHelp={() => setHelpOpen(true)} />
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live load band — the one number a doctor checks between patients. */}
        <View style={[styles.alertBand, { backgroundColor: alpha(palette.amber, 0.12), borderColor: alpha(palette.amber, 0.28) }]}>
          <Icon name="clock" size={16} color={palette.amber} strokeWidth={2.2} />
          <Text style={[T.smallStrong, styles.alertText, { color: palette.amber }]}>
            {quickStats.waiting} waiting · {quickStats.urgent} urgent
          </Text>
        </View>
        <ModuleBody active={active} appointments={appointments} openDetails={setViewing} beginConsult={beginConsult} />
      </ScrollView>
      <AppointmentDetailSheet appt={viewing} onClose={() => setViewing(null)} onStart={beginConsult} />
      <ConsultationSheet appt={consulting} visible={!!consulting} onClose={() => setConsulting(null)} onComplete={completeConsult} />
      <DoctorProfileSheet visible={profileOpen} onClose={() => setProfileOpen(false)} />
      <DoctorHelpSheet visible={helpOpen} onClose={() => setHelpOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing.huge, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },

  // Live load band under the header
  alertBand: { alignItems: 'center', borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2 },
  alertText: { flex: 1 },

  // Spacing hooks for the kit-backed primitives
  chipGap: { marginTop: spacing.sm },
  btnGap: { marginTop: spacing.sm },
  cardGap: { marginBottom: spacing.md },
  fieldGap: { marginTop: spacing.lg },
  pickerLabel: { marginBottom: spacing.sm },
  inputLabel: { ...T.label, marginBottom: spacing.sm, marginTop: spacing.lg },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },

  // Record rows. Surface supplies the ground, hairline, radius and elevation;
  // this only lays the row out and separates it from the next one.
  row: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  rowTitle: { ...T.title },
  rowSub: { ...T.small, marginTop: 2 },
  rowMeta: { ...T.caption, marginTop: 5 },
  chipLine: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm },
  note: { ...T.small, paddingVertical: spacing.sm },

  // Token / avatar leading slots
  token: { alignItems: 'center', borderRadius: radius.md, height: 46, justifyContent: 'center', width: 46 },
  tokenText: { ...T.mono, fontSize: 14 },
  avatar: { alignItems: 'center', backgroundColor: accent, borderRadius: radius.lg, height: 54, justifyContent: 'center', width: 54 },
  avatarText: { ...T.title, color: '#FAFAF7' },
  avatarSmall: { alignItems: 'center', backgroundColor: alpha(accent, 0.12), borderRadius: radius.md, height: 44, justifyContent: 'center', width: 44 },
  avatarSmallText: { ...T.titleSm, color: accent },

  // Sheets: profile heads
  profileHead: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  profileHero: { alignItems: 'center', marginBottom: spacing.lg },
  profileAvatar: { alignItems: 'center', backgroundColor: accent, borderRadius: radius.xl, height: 72, justifyContent: 'center', marginBottom: spacing.md, width: 72 },
  profileAvatarText: { ...T.h3, color: '#FAFAF7' },
  profileName: { ...T.h3 },
  inlineTitle: { ...T.titleSm },
  inlineSub: { ...T.caption, marginTop: 2 },
  inlineAction: { ...T.captionStrong, paddingVertical: 4, textAlign: 'right' },

  // Consultation tabs
  segment: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.lg },
  segmentItem: { borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 1 },
  segmentText: { ...T.captionStrong },

  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quickGrid: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },

  // Medication editor
  medRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm },
  toggleList: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  toggleItem: { alignItems: 'center', borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2 },
  toggleText: { ...T.captionStrong },
  checkbox: { alignItems: 'center', borderRadius: radius.xs, borderWidth: 1.6, height: 19, justifyContent: 'center', width: 19 },

  // Medicine search
  search: { marginTop: spacing.md },
  searchResults: { marginTop: spacing.sm, padding: 0 },
  searchResult: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  searchResultText: { flex: 1 },
  searchEmpty: { padding: spacing.lg, textAlign: 'center' },

  // History + attachments
  historyCard: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth * 2, marginBottom: spacing.sm, padding: spacing.lg },
  historyTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  historyDate: { ...T.captionStrong },
  historySummary: { ...T.small, marginTop: spacing.sm },
  historyDetail: { borderTopWidth: StyleSheet.hairlineWidth * 2, marginTop: spacing.md, paddingTop: spacing.md },
  attachmentCard: { alignItems: 'flex-start', borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth * 2, flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm, padding: spacing.lg },
  fileName: { ...T.mono, marginTop: 4 },
  uploadButton: { alignItems: 'center', borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth * 2, borderStyle: 'dashed', justifyContent: 'center', marginTop: spacing.md, minHeight: 56, paddingHorizontal: spacing.lg },
  uploadText: { ...T.smallStrong },

  // Schedule strip
  dateStrip: { gap: spacing.sm, paddingVertical: 2 },
  datePill: { borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth * 2, minWidth: 104, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2 },
  dateText: { ...T.captionStrong },
  dateSub: { ...T.caption, fontSize: 11, marginTop: 2 },

  // Messages — inbox list
  convoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm + 2,
    padding: spacing.md + 2,
  },
  convoBody: { flex: 1, gap: 4, minWidth: 0 },
  convoTop: { alignItems: 'baseline', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  convoNameText: { flex: 1 },
  convoBottom: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  convoPreview: { flex: 1 },

  // Messages — chat thread
  threadScroll: { flex: 1 },
  thread: { gap: spacing.sm + 2, paddingBottom: spacing.sm },
  messageBubble: {
    borderRadius: radius.lg,
    maxWidth: '84%',
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm + 3,
  },
  messageDoctor: { alignSelf: 'flex-end', borderBottomRightRadius: radius.xs },
  messagePatient: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: radius.xs,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  messageTime: { fontSize: 10, marginTop: 4 },

  // Messages — composer
  composer: { alignItems: 'flex-end', flexDirection: 'row', gap: spacing.sm + 2 },
  composerInput: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    flex: 1,
    fontFamily: body(500),
    fontSize: 15,
    maxHeight: 120,
    minHeight: 48,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.md,
    textAlignVertical: 'center',
  },
  sendButton: {
    alignItems: 'center',
    borderRadius: radius.lg,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },

  // Success state in sheets
  successBox: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  successMark: { alignItems: 'center', borderRadius: radius.pill, height: 62, justifyContent: 'center', width: 62 },
});
