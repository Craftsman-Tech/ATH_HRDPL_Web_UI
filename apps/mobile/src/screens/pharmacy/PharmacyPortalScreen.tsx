import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { fontSize, fontWeight, palette, radius, spacing } from "@vexoo/shared";
import { useAuth, useTheme } from "../../components/AppContexts";
import { T, alpha } from "../../theme";
import { metricIcon, moduleIcon } from "../../data/icons";
import {
  AppHeader, Avatar, Button as UiButton, Chip as UiChip, EmptyState,
  Field as UiField, Icon, IconButton, ListRow, NavDrawer, PillRow, ReadField,
  SearchField, SectionHeader, Sheet as UiSheet, StatTile, Surface, Touchable,
  pulseFor, toneFor, withPulse, type IconName,
} from "../../ui";
import {
  PHARMACY_ACTIVITIES,
  PHARMACY_CATALOG,
  PHARMACY_CATEGORIES,
  PHARMACY_COMPLETED,
  PHARMACY_DISPENSED,
  PHARMACY_INVENTORY,
  PHARMACY_INVOICES,
  PHARMACY_MODULES,
  PHARMACY_NOTIFICATIONS,
  PHARMACY_PLANS,
  PHARMACY_PRESCRIPTIONS,
  PHARMACY_PROFILE,
  PHARMACY_PURCHASE_ORDERS,
  PHARMACY_SUPPLIERS,
  nextRxStatus,
  type PharmacyCompleted,
  type PharmacyDispensed,
  type PharmacyInventoryItem,
  type PharmacyModuleId,
  type PharmacyNotification,
  type PharmacyPlan,
  type PharmacyPOStatus,
  type PharmacyPrescription,
  type PharmacyPurchaseOrder,
  type PharmacyRxStatus,
  type PharmacySource,
  type PharmacyStockStatus,
  type PharmacySupplier,
} from "../../data/pharmacyData";

const accent = palette.rolePharmacist;
const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
const currentDate = () =>
  new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const currentTime = () =>
  new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

function tone(value: string) {
  const text = value.toLowerCase();
  if (
    text.includes("stat") ||
    text.includes("out of") ||
    text.includes("cancel") ||
    text.includes("critical")
  )
    return palette.rose;
  if (
    text.includes("urgent") ||
    text.includes("pending") ||
    text.includes("low") ||
    text.includes("expir")
  )
    return palette.amber;
  if (
    text.includes("ready") ||
    text.includes("dispensed") ||
    text.includes("received") ||
    text.includes("active") ||
    text.includes("paid") ||
    text.includes("in stock")
  )
    return palette.green;
  if (text.includes("verif") || text.includes("approved"))
    return palette.purple;
  return accent;
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
  if (/dispense|verify|approve|ready|complete|confirm|receive|save|apply/.test(v)) return "checkCircle";
  if (/add|new|create|raise|order/.test(v))       return "plus";
  if (/edit|update|adjust/.test(v))               return "edit";
  if (/delete|remove|cancel order|reject/.test(v)) return "trash";
  if (/print/.test(v))                            return "printer";
  if (/export|download|invoice|pdf/.test(v))      return "download";
  if (/share|send|notify/.test(v))                return "send";
  if (/scan|search/.test(v))                      return "search";
  if (/view|open|details/.test(v))                return "eye";
  if (/reorder|restock|stock/.test(v))            return "package";
  if (/supplier|delivery/.test(v))                return "truck";
  return undefined;
}

function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
}) {
  return (
    <UiButton
      label={label}
      onPress={onPress}
      variant={variant}
      disabled={disabled}
      accent={accent}
      icon={buttonIcon(label)}
      style={styles.btnGap}
    />
  );
}

function Card({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Surface onPress={onPress} style={styles.cardGap} radiusSize="xl">
      {children}
    </Surface>
  );
}

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "phone-pad";
  multiline?: boolean;
}) {
  return (
    <UiField
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      multiline={multiline}
      accent={accent}
      containerStyle={styles.fieldGap}
    />
  );
}

function Selector({
  label,
  items,
  selected,
  onChange,
}: {
  label: string;
  items: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  const { theme } = useTheme();
  return (
    <View style={styles.fieldGap}>
      <Text style={[T.label, styles.pickerLabel, { color: theme.textMuted }]}>{label}</Text>
      <PillRow
        options={items.map((x) => ({ value: x, label: x }))}
        value={selected}
        onChange={onChange}
        accent={accent}
      />
    </View>
  );
}

function SearchPicker({
  label,
  items,
  selected,
  onChange,
}: {
  label: string;
  items: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  const { theme } = useTheme();
  const [query, setQuery] = useState(selected);
  const [open, setOpen] = useState(false);
  useEffect(() => setQuery(selected), [selected]);
  const matches = items
    .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);
  return (
    <View style={styles.fieldGap}>
      <UiField
        label={label}
        icon="search"
        value={query}
        onFocus={() => setOpen(true)}
        onChangeText={(value) => {
          setQuery(value);
          setOpen(true);
        }}
        placeholder={`Search ${label.toLowerCase()}`}
        accent={accent}
        trailingIcon={query ? "close" : undefined}
        onTrailingPress={() => {
          setQuery("");
          setOpen(true);
        }}
      />
      {open ? (
        <Surface style={styles.searchResults} radiusSize="lg" lift="md">
          {matches.map((item, index) => (
            <Touchable
              key={item}
              press="none"
              style={[
                styles.searchResult,
                {
                  borderBottomColor: theme.hairline,
                  borderBottomWidth: index === matches.length - 1 ? 0 : StyleSheet.hairlineWidth * 2,
                },
              ]}
              onPress={() => {
                onChange(item);
                setQuery(item);
                setOpen(false);
              }}
            >
              <Icon name="pill" size={15} color={item === selected ? accent : theme.textFaint} strokeWidth={2} />
              <Text style={[T.small, styles.searchResultText, { color: item === selected ? accent : theme.text }]}>
                {item}
              </Text>
              {item === selected ? <Icon name="check" size={14} color={accent} strokeWidth={2.6} /> : null}
            </Touchable>
          ))}
          {!matches.length ? (
            <Text style={[T.caption, styles.searchEmpty, { color: theme.textMuted }]}>No results found.</Text>
          ) : null}
        </Surface>
      ) : null}
    </View>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <ReadField label={label} value={value} />;
}

function Section({ title, action }: { title: string; action?: string }) {
  return <SectionHeader title={title} action={action} accent={accent} />;
}

function Stat({
  label,
  value,
  detail,
  color = accent,
  onPress,
}: {
  label: string;
  value: string;
  detail: string;
  color?: string;
  onPress?: () => void;
}) {
  return (
    <StatTile
      label={label}
      value={value}
      detail={detail}
      color={color}
      icon={metricIcon(label)}
      onPress={onPress}
    />
  );
}

function Sheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <UiSheet visible={visible} title={title} onClose={onClose}>
      {children}
    </UiSheet>
  );
}

function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}) {
  const { theme } = useTheme();
  if (pages <= 1) return null;
  return (
    <View style={styles.pagination}>
      <IconButton
        name="chevronLeft"
        onPress={() => page > 1 && onChange(page - 1)}
        size={38}
        color={page === 1 ? theme.textFaint : theme.text}
      />
      <Text style={[T.captionStrong, { color: theme.textMuted }]}>
        Page {page} of {pages}
      </Text>
      <IconButton
        name="chevronRight"
        onPress={() => page < pages && onChange(page + 1)}
        size={38}
        color={page === pages ? theme.textFaint : theme.text}
      />
    </View>
  );
}

const htmlEscape = (value: string | number | undefined) =>
  String(value ?? "-").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ] ?? char,
  );
async function exportDocument(
  title: string,
  rows: [string, string | number | undefined][],
  share = true,
) {
  // Rendering the PDF and handing it to the share sheet both take a beat on
  // device, so the heartbeat runs for the whole round trip.
  return withPulse(
    () => runExport(title, rows, share),
    share ? "Preparing document" : "Sending to printer",
  );
}

async function runExport(
  title: string,
  rows: [string, string | number | undefined][],
  share: boolean,
) {
  const html = `<html><body style="font-family:Arial;padding:28px;color:#172033"><h1>${htmlEscape(title)}</h1>${rows.map(([k, v]) => `<div style="padding:9px 0;border-bottom:1px solid #ddd"><b>${htmlEscape(k)}</b><span style="float:right">${htmlEscape(v)}</span></div>`).join("")}</body></html>`;
  try {
    if (!share) {
      await Print.printAsync({ html });
      return;
    }
    const file = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync())
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/pdf",
        dialogTitle: title,
      });
    else
      await Share.share({
        title,
        message: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      });
  } catch {
    Alert.alert(
      "Export unavailable",
      "The device could not open its print or sharing service.",
    );
  }
}

function stockStatus(item: PharmacyInventoryItem): PharmacyStockStatus {
  if (item.qty === 0) return "Out of Stock";
  if (item.qty < item.min) return "Low Stock";
  if (/Jul 2026|Sep 2026/.test(item.expiry)) return "Expiring";
  return "In Stock";
}
function matchesDate(
  timestamp: number,
  preset: string,
  from: string,
  to: string,
) {
  const now = Date.now();
  if (preset === "All Time") return true;
  if (preset === "Today")
    return new Date(timestamp).toDateString() === new Date().toDateString();
  if (preset === "Last 7 Days") return now - timestamp <= 7 * 86400000;
  if (preset === "Last 30 Days") return now - timestamp <= 30 * 86400000;
  if (preset === "Last 3 Months") return now - timestamp <= 90 * 86400000;
  if (preset === "Custom") {
    const start = from ? new Date(from).getTime() : 0;
    const end = to
      ? new Date(to).getTime() + 86400000
      : Number.MAX_SAFE_INTEGER;
    return timestamp >= start && timestamp < end;
  }
  return true;
}

type PortalState = {
  prescriptions: PharmacyPrescription[];
  setPrescriptions: React.Dispatch<
    React.SetStateAction<PharmacyPrescription[]>
  >;
  dispensed: PharmacyDispensed[];
  setDispensed: React.Dispatch<React.SetStateAction<PharmacyDispensed[]>>;
  completed: PharmacyCompleted[];
  setCompleted: React.Dispatch<React.SetStateAction<PharmacyCompleted[]>>;
  inventory: PharmacyInventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<PharmacyInventoryItem[]>>;
  orders: PharmacyPurchaseOrder[];
  setOrders: React.Dispatch<React.SetStateAction<PharmacyPurchaseOrder[]>>;
  suppliers: PharmacySupplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<PharmacySupplier[]>>;
  goTo: (id: PharmacyModuleId, filter?: string) => void;
};

/** One line of context per module, shown under the header title. */
const SUBTITLES: Partial<Record<PharmacyModuleId, string>> = {
  dashboard: "Queue load, stock risk and today's dispensing at a glance.",
  inhouse: "Prescriptions raised by doctors inside the hospital.",
  external: "Walk-in and external prescriptions presented at the counter.",
  inventory: "Stock on hand, batches, expiry and reorder levels.",
  purchase: "Purchase orders raised with suppliers.",
  suppliers: "Supplier directory, terms and delivery performance.",
  dispensed: "Medications handed over, with who dispensed them.",
  completed: "Closed prescriptions and their billing status.",
  reports: "Throughput, revenue and stock movement.",
  settings: "Pharmacist profile, alerts and plan.",
};

function Header({
  active,
  unread,
  onMenu,
  onProfile,
  onNotifications,
}: {
  active: PharmacyModuleId;
  unread: number;
  onMenu: () => void;
  onProfile: () => void;
  onNotifications: () => void;
}) {
  const { user } = useAuth();
  const title =
    PHARMACY_MODULES.find((item) => item.id === active)?.label ?? "Dashboard";
  return (
    <AppHeader
      title={title}
      subtitle={SUBTITLES[active] ?? "Dispensing workspace."}
      roleLabel="Pharmacist Portal"
      userName={user?.name ?? "Maria Perez"}
      accent={accent}
      modulePill={unread ? `${unread} new alerts` : undefined}
      showClock
      onMenu={onMenu}
      onProfile={onProfile}
      onHelp={onNotifications}
    />
  );
}

function Drawer({
  visible,
  active,
  badges,
  onClose,
  onSelect,
  onProfile,
  onLogout,
}: {
  visible: boolean;
  active: PharmacyModuleId;
  badges: Partial<Record<PharmacyModuleId, number>>;
  onClose: () => void;
  onSelect: (id: PharmacyModuleId) => void;
  onProfile: () => void;
  onLogout: () => void;
}) {
  const { user } = useAuth();
  return (
    <NavDrawer
      visible={visible}
      items={PHARMACY_MODULES.map((item) => ({
        id: item.id,
        label: item.label,
        icon: moduleIcon(item.label),
        badge: badges[item.id],
      }))}
      active={active}
      accent={accent}
      roleLabel="Pharmacy"
      userName={user?.name ?? "Maria Perez"}
      userEmail={user?.email}
      onClose={onClose}
      onSelect={onSelect}
      onProfile={onProfile}
      onSignOut={onLogout}
    />
  );
}

function ProfileSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name ?? "Maria Perez",
    role: "Chief Pharmacist",
    employeeId: "PH-2024-09",
    license: "TG/PH/2018/4021",
    phone: "+91 98765 11223",
    email: "pharmacy@vexoo.in",
  });
  const [draft, setDraft] = useState(profile);
  const save = () => {
    if (!draft.name.trim() || !draft.email.trim())
      return Alert.alert("Required details", "Name and email are required.");
    setProfile(draft);
    setEditing(false);
    Alert.alert("Profile updated", "Pharmacist profile saved.");
  };
  return (
    <Sheet
      visible={visible}
      title={editing ? "Edit Profile" : "My Profile"}
      onClose={onClose}
    >
      <View style={styles.profileHero}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>
            {initials(editing ? draft.name : profile.name)}
          </Text>
        </View>
        <Text style={[styles.profileName, { color: theme.text }]}>
          {profile.name}
        </Text>
        <Text style={[styles.note, { color: theme.textMuted }]}>
          {profile.role}
        </Text>
      </View>
      {editing ? (
        <>
          <Input
            label="Full Name"
            value={draft.name}
            onChangeText={(name) => setDraft({ ...draft, name })}
          />
          <Input
            label="Role"
            value={draft.role}
            onChangeText={(role) => setDraft({ ...draft, role })}
          />
          <Input
            label="Employee ID"
            value={draft.employeeId}
            onChangeText={(employeeId) => setDraft({ ...draft, employeeId })}
          />
          <Input
            label="Pharmacy License"
            value={draft.license}
            onChangeText={(license) => setDraft({ ...draft, license })}
          />
          <Input
            label="Phone"
            value={draft.phone}
            onChangeText={(phone) => setDraft({ ...draft, phone })}
          />
          <Input
            label="Email"
            value={draft.email}
            onChangeText={(email) => setDraft({ ...draft, email })}
          />
          <View style={styles.actionRow}>
            <Button
              label="Cancel"
              onPress={() => setEditing(false)}
              variant="ghost"
            />
            <Button label="Save Changes" onPress={save} />
          </View>
        </>
      ) : (
        <>
          <Field label="Employee ID" value={profile.employeeId} />
          <Field label="Pharmacy License" value={profile.license} />
          <Field label="Phone" value={profile.phone} />
          <Field label="Email" value={profile.email} />
          <View style={styles.actionRow}>
            <Button label="Close" onPress={onClose} variant="ghost" />
            <Button
              label="Edit Profile"
              onPress={() => {
                setDraft(profile);
                setEditing(true);
              }}
            />
          </View>
        </>
      )}
    </Sheet>
  );
}

function NotificationsSheet({
  visible,
  notifications,
  setNotifications,
  onClose,
}: {
  visible: boolean;
  notifications: PharmacyNotification[];
  setNotifications: React.Dispatch<
    React.SetStateAction<PharmacyNotification[]>
  >;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  useEffect(() => {
    if (visible)
      setNotifications((items) =>
        items.map((item) => ({ ...item, read: true })),
      );
  }, [visible]);
  return (
    <Sheet visible={visible} title="Pharmacy Notifications" onClose={onClose}>
      {notifications.map((item) => (
        <Card key={item.id}>
          <View style={styles.rowTop}>
            <Text style={[styles.cardTitle, { color: theme.text, flex: 1 }]}>
              {item.title}
            </Text>
            <Chip label={item.type} />
          </View>
          <Text style={[styles.body, { color: theme.text }]}>{item.body}</Text>
          <Text style={[styles.note, { color: theme.textMuted }]}>
            {item.time}
          </Text>
        </Card>
      ))}
      {!notifications.length ? (
        <Text style={[styles.note, { color: theme.textMuted }]}>
          No notifications.
        </Text>
      ) : null}
    </Sheet>
  );
}

function Dashboard({
  state,
  activities,
  notifications,
}: {
  state: PortalState;
  activities: typeof PHARMACY_ACTIVITIES;
  notifications: PharmacyNotification[];
}) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const firstName = (user?.name ?? "Maria Perez").split(" ")[0];
  const inhouse = state.prescriptions.filter(
    (p) => p.source === "In-House" && p.status !== "Dispensed",
  ).length;
  const external = state.prescriptions.filter(
    (p) => p.source === "External" && p.status !== "Dispensed",
  ).length;
  const ready = state.prescriptions.filter((p) => p.status === "Ready").length;
  const low = state.inventory.filter((i) => i.qty > 0 && i.qty < i.min).length;
  const out = state.inventory.filter((i) => i.qty === 0).length;
  const expiring = state.inventory.filter(
    (i) => stockStatus(i) === "Expiring",
  ).length;
  return (
    <>
      <View
        style={[
          styles.hero,
          { backgroundColor: `${accent}12`, borderColor: `${accent}35` },
        ]}
      >
        <Text style={[styles.heroKicker, { color: accent }]}>
          PHARMACY OPERATIONS
        </Text>
        <Text style={[styles.heroTitle, { color: theme.text }]}>
          Good{" "}
          {new Date().getHours() < 12
            ? "Morning"
            : new Date().getHours() < 17
              ? "Afternoon"
              : "Evening"}
          , {firstName}
        </Text>
        <Text style={[styles.note, { color: theme.textMuted }]}>
          Manage prescriptions, dispensing, inventory, suppliers, and
          purchasing.
        </Text>
        <Chip label="Morning Shift - 8 AM to 2 PM" />
      </View>
      <Section title="Quick Actions" />
      <View style={styles.actionRow}>
        <Button label="Dispense Medication" onPress={() => state.goTo("inhouse")} />
        <Button
          label="Search Prescription"
          onPress={() => state.goTo("inhouse")}
        />
        <Button
          label="Search Medicine"
          onPress={() => state.goTo("inventory")}
          variant="ghost"
        />
        <Button
          label="New Purchase Order"
          onPress={() => state.goTo("purchase")}
          variant="ghost"
        />
      </View>
      <View style={styles.statGrid}>
        <Stat
          label="In-House Queue"
          value={String(inhouse)}
          detail="View queue"
          onPress={() => state.goTo("inhouse")}
        />
        <Stat
          label="External Queue"
          value={String(external)}
          detail="View queue"
          color={palette.purple}
          onPress={() => state.goTo("external")}
        />
        <Stat
          label="Ready"
          value={String(ready)}
          detail="Dispense now"
          color={palette.green}
          onPress={() => state.goTo("inhouse")}
        />
        <Stat
          label="Low Stock"
          value={String(low + out)}
          detail="Needs attention"
          color={palette.rose}
          onPress={() => state.goTo("inventory", "Low Stock")}
        />
      </View>
      <Section
        title="Critical Stock Alerts"
        action={`${low + out + expiring} items`}
      />
      <Card>
        <TouchableOpacity
          onPress={() => state.goTo("inventory", "Low Stock")}
          style={styles.alertRow}
        >
          <Text style={[styles.cardTitle, { color: palette.amber }]}>
            Low Stock
          </Text>
          <Text style={[styles.alertValue, { color: theme.text }]}>{low}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => state.goTo("inventory", "Out of Stock")}
          style={styles.alertRow}
        >
          <Text style={[styles.cardTitle, { color: palette.rose }]}>
            Out of Stock
          </Text>
          <Text style={[styles.alertValue, { color: theme.text }]}>{out}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => state.goTo("inventory", "Expiring")}
          style={styles.alertRow}
        >
          <Text style={[styles.cardTitle, { color: palette.purple }]}>
            Expiring Soon
          </Text>
          <Text style={[styles.alertValue, { color: theme.text }]}>
            {expiring}
          </Text>
        </TouchableOpacity>
      </Card>
      <Section
        title="Recent Activity"
        action={`${activities.length} updates`}
      />
      {activities.map((item) => (
        <Card key={item.id}>
          <View style={styles.rowTop}>
            <Chip label={item.type} />
            <Text style={[styles.note, { color: theme.textMuted }]}>
              {item.time}
            </Text>
          </View>
          <Text style={[styles.body, { color: theme.text }]}>{item.text}</Text>
        </Card>
      ))}
      <Section
        title="Latest Notifications"
        action={`${notifications.filter((n) => !n.read).length} unread`}
      />
      {notifications.slice(0, 3).map((item) => (
        <Card key={item.id}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.body, { color: theme.text }]}>{item.body}</Text>
        </Card>
      ))}
    </>
  );
}

function PrescriptionCard({
  rx,
  external,
  onAdvance,
  onVerify,
  onView,
}: {
  rx: PharmacyPrescription;
  external: boolean;
  onAdvance: () => void;
  onVerify?: () => void;
  onView: () => void;
}) {
  const { theme } = useTheme();
  const action =
    rx.status === "Pending"
      ? "Start Working"
      : rx.status === "Verifying"
        ? "Mark Ready"
        : rx.status === "Ready"
          ? "Dispense"
          : "Completed";
  return (
    <Card>
      <View style={styles.rowTop}>
        <View style={styles.rxIcon}>
          <Text style={styles.rxIconText}>{initials(rx.patient)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {rx.patient}
          </Text>
          <Text style={[styles.note, { color: theme.textMuted }]}>
            {rx.id} - {rx.pid} - {rx.time}
          </Text>
        </View>
      </View>
      <Text style={[styles.medName, { color: theme.text }]}>
        {rx.drug} x {rx.qty}
      </Text>
      <Text style={[styles.note, { color: theme.textMuted }]}>
        {rx.doctor}
        {rx.clinic ? ` - ${rx.clinic}` : ""}
      </Text>
      <View style={styles.chipLine}>
        <Chip label={rx.priority} />
        <Chip label={rx.status === "Verifying" ? "In Work" : rx.status} />
        {external ? (
          <Chip label={rx.verified ? "Verified" : "Not Verified"} />
        ) : null}
      </View>
      <View style={styles.actionRow}>
        <Button label="View" onPress={onView} variant="ghost" />
        {external && onVerify ? (
          <Button
            label={rx.verified ? "Unverify" : "Verify Rx"}
            onPress={onVerify}
            variant="ghost"
          />
        ) : null}
        {rx.status !== "Dispensed" ? (
          <Button
            label={action}
            disabled={external && rx.status === "Ready" && !rx.verified}
            onPress={onAdvance}
          />
        ) : null}
      </View>
    </Card>
  );
}

function PrescriptionDetail({
  rx,
  onClose,
}: {
  rx: PharmacyPrescription | null;
  onClose: () => void;
}) {
  return (
    <Sheet visible={!!rx} title="Prescription Details" onClose={onClose}>
      {rx ? (
        <>
          <Field label="Rx ID" value={rx.id} />
          <Field label="Patient" value={`${rx.patient} (${rx.pid})`} />
          <Field label="Date of Birth" value={rx.dob} />
          <Field label="Medication" value={`${rx.drug} x ${rx.qty}`} />
          <Field label="Doctor" value={rx.doctor} />
          <Field label="Allergies" value={rx.allergies} />
          <Field label="Instructions" value={rx.instructions} />
          {rx.clinic ? <Field label="Clinic" value={rx.clinic} /> : null}
          <View style={styles.actionRow}>
            <Button label="Close" onPress={onClose} variant="ghost" />
            <Button
              label="Print Prescription"
              onPress={() =>
                exportDocument(
                  `Prescription ${rx.id}`,
                  [
                    ["Patient", rx.patient],
                    ["Medication", rx.drug],
                    ["Quantity", rx.qty],
                    ["Doctor", rx.doctor],
                    ["Instructions", rx.instructions],
                  ],
                  false,
                )
              }
            />
          </View>
        </>
      ) : null}
    </Sheet>
  );
}

function QueueScreen({
  source,
  state,
}: {
  source: PharmacySource;
  state: PortalState;
}) {
  const { theme } = useTheme();
  // Dispensing is an audit trail — it has to name whoever is actually signed
  // in, not a fixed demo pharmacist.
  const { user } = useAuth();
  const [filter, setFilter] = useState<"All" | "Pending" | "In Work" | "Ready" | "Dispensed">("All");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<PharmacyPrescription | null>(null);
  const [walkIn, setWalkIn] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [medicines, setMedicines] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [otcQuery, setOtcQuery] = useState("");
  const rows = state.prescriptions.filter(
    (rx) =>
      rx.source === source &&
      (filter === "All" || rx.status === (filter === "In Work" ? "Verifying" : filter)) &&
      `${rx.patient} ${rx.id} ${rx.drug} ${rx.clinic ?? ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const dispenseRx = (rx: PharmacyPrescription) => {
    const inventory = state.inventory.find((item) => item.name === rx.drug);
    if (inventory && inventory.qty < rx.qty)
      return Alert.alert(
        "Insufficient stock",
        `${rx.drug} has only ${inventory.qty} ${inventory.unit}.`,
      );
    const timestamp = Date.now();
    state.setPrescriptions((items) =>
      items.map((item) =>
        item.id === rx.id ? { ...item, status: "Dispensed" } : item,
      ),
    );
    state.setInventory((items) =>
      items.map((item) =>
        item.name === rx.drug
          ? { ...item, qty: Math.max(0, item.qty - rx.qty) }
          : item,
      ),
    );
    const record: PharmacyDispensed = {
      id: `D-${timestamp}`,
      rxId: rx.id,
      patient: rx.patient,
      pid: rx.pid,
      drug: rx.drug,
      qty: rx.qty,
      dispensedBy: user?.name ?? "Maria Perez",
      date: currentDate(),
      time: currentTime(),
      timestamp,
      source: rx.source,
      batch: inventory?.batch ?? "OTC",
    };
    state.setDispensed((items) => [record, ...items]);
    state.setCompleted((items) => [
      {
        id: rx.id,
        patient: rx.patient,
        pid: rx.pid,
        drug: rx.drug,
        qty: rx.qty,
        doctor: rx.doctor,
        completedDate: currentDate(),
        timestamp,
        source: rx.source,
        turnaround: "Live",
        amount:
          rx.qty *
          (inventory?.price ??
            PHARMACY_CATALOG.find((item) => item.name === rx.drug)?.price ??
            0),
        dob: rx.dob,
        instructions: rx.instructions,
        clinic: rx.clinic,
      },
      ...items,
    ]);
  };
  const advance = (rx: PharmacyPrescription) => {
    if (rx.status === "Ready") dispenseRx(rx);
    else
      state.setPrescriptions((items) =>
        items.map((item) =>
          item.id === rx.id
            ? { ...item, status: nextRxStatus(item.status) }
            : item,
        ),
      );
  };
  const addWalkIn = () => {
    if (!name.trim() || !phone.trim())
      return Alert.alert(
        "Patient details required",
        "Enter patient name and phone number.",
      );
    if (!medicines.length)
      return Alert.alert(
        "OTC medicine required",
        "Select at least one OTC medicine.",
      );
    const saleId = Date.now();
    const rows = medicines.map(
      (drug, index): PharmacyPrescription => ({
        id: `RX-W${saleId}-${index + 1}`,
        patient: name.trim(),
        pid: `W-${saleId}`,
        drug,
        qty: Math.max(1, Number(quantities[drug]) || 1),
        doctor: "-",
        time: currentTime(),
        status: "Ready",
        source: "External",
        priority: "Routine",
        refills: 0,
        dob: "Not provided",
        allergies: "Not provided",
        instructions: "OTC sale",
        clinic: "Walk-in",
        verified: true,
      }),
    );
    const insufficient = rows.find((rx) => {
      const item = state.inventory.find((stock) => stock.name === rx.drug);
      return item && item.qty < rx.qty;
    });
    if (insufficient)
      return Alert.alert(
        "Insufficient stock",
        `${insufficient.drug} does not have enough stock.`,
      );
    state.setPrescriptions((items) => [...rows, ...items]);
    rows.forEach(dispenseRx);
    setWalkIn(false);
    setName("");
    setPhone("");
    setMedicines([]);
    setQuantities({});
    setOtcQuery("");
  };
  return (
    <>
      <View style={styles.rowTop}>
        <View style={{ flex: 1 }}>
          <Section
            title={
              source === "In-House"
                ? "In-House Prescriptions"
                : "External Prescriptions"
            }
            action={`${rows.length} records`}
          />
        </View>
        {source === "External" ? (
          <Button label="Walk-in OTC" onPress={() => setWalkIn(true)} />
        ) : null}
      </View>
      <Input
        label="Search"
        value={query}
        onChangeText={setQuery}
        placeholder="Patient, Rx ID, drug, or clinic"
      />
      <Selector
        label="Status"
        items={["All", "Pending", "In Work", "Ready", "Dispensed"]}
        selected={filter}
        onChange={(value) => setFilter(value as typeof filter)}
      />
      {rows.map((rx) => (
        <PrescriptionCard
          key={rx.id}
          rx={rx}
          external={source === "External"}
          onView={() => setDetail(rx)}
          onVerify={
            source === "External"
              ? () =>
                  state.setPrescriptions((items) =>
                    items.map((item) =>
                      item.id === rx.id
                        ? { ...item, verified: !item.verified }
                        : item,
                    ),
                  )
              : undefined
          }
          onAdvance={() => advance(rx)}
        />
      ))}
      {!rows.length ? (
        <Text style={[styles.note, { color: theme.textMuted }]}>
          No prescriptions match the filters.
        </Text>
      ) : null}
      <PrescriptionDetail rx={detail} onClose={() => setDetail(null)} />
      <Sheet
        visible={walkIn}
        title="Walk-in OTC Dispensing"
        onClose={() => setWalkIn(false)}
      >
        <Input label="Patient Name" value={name} onChangeText={setName} />
        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Text style={[styles.inputLabel, { color: theme.textMuted }]}>OTC Medicines</Text>
        <Input label="Search OTC Medicines" value={otcQuery} onChangeText={setOtcQuery} placeholder="Type a medicine name" />
        {PHARMACY_CATALOG.filter(
          (item) => item.otc && item.name.toLowerCase().includes(otcQuery.toLowerCase()),
        ).map((item) => {
          const selected = medicines.includes(item.name);
          return (
            <View key={item.name} style={[styles.otcRow, { borderColor: theme.border }]}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  setMedicines((rows) =>
                    selected ? rows.filter((name) => name !== item.name) : [...rows, item.name],
                  );
                  if (!selected) setQuantities((rows) => ({ ...rows, [item.name]: "1" }));
                }}
              >
                <Text style={[styles.cardTitle, { color: selected ? accent : theme.text }]}>{item.name}</Text>
                <Text style={[styles.note, { color: theme.textMuted }]}>Rs {item.price} / {item.unit}</Text>
              </TouchableOpacity>
              <Chip label={selected ? "Selected" : "Add"} />
            </View>
          );
        })}
        {medicines.map((drug) => (
          <Input
            key={drug}
            label={`${drug} Quantity`}
            value={quantities[drug] ?? "1"}
            onChangeText={(value) => setQuantities((rows) => ({ ...rows, [drug]: value }))}
            keyboardType="numeric"
          />
        ))}
        <Field
          label="Estimated Amount"
          value={`Rs ${medicines.reduce((sum, drug) => sum + (PHARMACY_CATALOG.find((item) => item.name === drug)?.price ?? 0) * (Number(quantities[drug]) || 1), 0).toLocaleString("en-IN")}`}
        />
        <View style={styles.actionRow}>
          <Button
            label="Cancel"
            onPress={() => setWalkIn(false)}
            variant="ghost"
          />
          <Button label="Dispense OTC" onPress={addWalkIn} />
        </View>
      </Sheet>
    </>
  );
}

function DispensedScreen({ records }: { records: PharmacyDispensed[] }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"All" | PharmacySource>("All");
  const [preset, setPreset] = useState("All Time");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const filtered = records.filter(
    (item) =>
      (source === "All" || item.source === source) &&
      matchesDate(item.timestamp, preset, from, to) &&
      `${item.patient} ${item.drug} ${item.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const exportRows: [string, string | number][] = [
    ["Records", filtered.length],
    ["Total quantity", filtered.reduce((sum, item) => sum + item.qty, 0)],
    ...filtered.map((item): [string, string] => [
      item.id,
      `${item.patient} - ${item.drug} x ${item.qty} - ${item.date}`,
    ]),
  ];
  return (
    <>
      <View style={styles.statGrid}>
        <Stat
          label="Dispensed"
          value={String(filtered.length)}
          detail={preset}
        />
        <Stat
          label="Total Quantity"
          value={String(filtered.reduce((sum, item) => sum + item.qty, 0))}
          detail="units supplied"
          color={palette.green}
        />
      </View>
      <View style={styles.actionRow}>
        <Button
          label="Export"
          onPress={() => exportDocument("Dispensed Medications", exportRows)}
          variant="ghost"
        />
      </View>
      <Input
        label="Search"
        value={query}
        onChangeText={(value) => {
          setQuery(value);
          setPage(1);
        }}
        placeholder="Patient, medication, or dispense ID"
      />
      <Selector
        label="Source"
        items={["All", "In-House", "External"]}
        selected={source}
        onChange={(value) => {
          setSource(value as typeof source);
          setPage(1);
        }}
      />
      <Selector
        label="Date Range"
        items={[
          "All Time",
          "Today",
          "Last 7 Days",
          "Last 30 Days",
          "Last 3 Months",
          "Custom",
        ]}
        selected={preset}
        onChange={(value) => {
          setPreset(value);
          setPage(1);
        }}
      />
      {preset === "Custom" ? (
        <>
          <Input label="From Date" value={from} onChangeText={setFrom} placeholder="YYYY-MM-DD" />
          <Input label="To Date" value={to} onChangeText={setTo} placeholder="YYYY-MM-DD" />
        </>
      ) : null}
      <Section
        title="Dispensing History"
        action={`${filtered.length} records`}
      />
      {filtered.slice((page - 1) * 10, page * 10).map((item) => (
        <Card key={item.id}>
          <View style={styles.rowTop}>
            <Text style={[styles.cardTitle, { color: theme.text, flex: 1 }]}>
              {item.patient}
            </Text>
            <Chip label={item.source} />
          </View>
          <Text style={[styles.medName, { color: theme.text }]}>
            {item.drug} x {item.qty}
          </Text>
          <Text style={[styles.note, { color: theme.textMuted }]}>
            {item.id} - {item.rxId} - Batch {item.batch}
          </Text>
          <Text style={[styles.note, { color: theme.textMuted }]}>
            {item.date} at {item.time} - {item.dispensedBy}
          </Text>
        </Card>
      ))}
      <Pagination page={page} pages={pages} onChange={setPage} />
    </>
  );
}

function CompletedScreen({ records }: { records: PharmacyCompleted[] }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"All" | PharmacySource>("All");
  const [preset, setPreset] = useState("All Time");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<PharmacyCompleted | null>(null);
  const filtered = records.filter(
    (item) =>
      (source === "All" || item.source === source) &&
      matchesDate(item.timestamp, preset, from, to) &&
      `${item.patient} ${item.drug} ${item.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const rxRows = (
    item: PharmacyCompleted,
  ): [string, string | number | undefined][] => [
    ["Rx ID", item.id],
    ["Patient", item.patient],
    ["Patient ID", item.pid],
    ["Date of Birth", item.dob],
    ["Medication", item.drug],
    ["Quantity", item.qty],
    ["Doctor", item.doctor],
    ["Clinic", item.clinic],
    ["Instructions", item.instructions],
    ["Amount", `Rs ${item.amount.toLocaleString("en-IN")}`],
  ];
  return (
    <>
      <View style={styles.statGrid}>
        <Stat
          label="Completed"
          value={String(filtered.length)}
          detail="prescriptions"
        />
        <Stat
          label="Billed"
          value={`Rs ${filtered.reduce((sum, item) => sum + item.amount, 0).toLocaleString("en-IN")}`}
          detail="filtered total"
          color={palette.green}
        />
      </View>
      <View style={styles.actionRow}>
        <Button
          label="Export"
          onPress={() =>
            exportDocument("Completed Prescriptions", [
              ["Records", filtered.length],
              [
                "Total amount",
                filtered.reduce((sum, item) => sum + item.amount, 0),
              ],
            ])
          }
          variant="ghost"
        />
      </View>
      <Input
        label="Search"
        value={query}
        onChangeText={(value) => {
          setQuery(value);
          setPage(1);
        }}
        placeholder="Patient, medication, or Rx ID"
      />
      <Selector
        label="Source"
        items={["All", "In-House", "External"]}
        selected={source}
        onChange={(value) => {
          setSource(value as typeof source);
          setPage(1);
        }}
      />
      <Selector
        label="Date Range"
        items={[
          "All Time",
          "Today",
          "Last 7 Days",
          "Last 30 Days",
          "Last 3 Months",
          "Custom",
        ]}
        selected={preset}
        onChange={(value) => {
          setPreset(value);
          setPage(1);
        }}
      />
      {preset === "Custom" ? (
        <>
          <Input label="From Date" value={from} onChangeText={setFrom} placeholder="YYYY-MM-DD" />
          <Input label="To Date" value={to} onChangeText={setTo} placeholder="YYYY-MM-DD" />
        </>
      ) : null}
      <Section
        title="Completed Prescriptions"
        action={`${filtered.length} records`}
      />
      {filtered.slice((page - 1) * 10, page * 10).map((item) => (
        <Card key={`${item.id}-${item.timestamp}`}>
          <View style={styles.rowTop}>
            <Text style={[styles.cardTitle, { color: theme.text, flex: 1 }]}>
              {item.patient}
            </Text>
            <Chip label={item.source} />
          </View>
          <Text style={[styles.medName, { color: theme.text }]}>
            {item.drug} x {item.qty}
          </Text>
          <Text style={[styles.note, { color: theme.textMuted }]}>
            {item.id} - {item.doctor} - {item.completedDate}
          </Text>
          <Text style={[styles.amount, { color: accent }]}>
            Rs {item.amount.toLocaleString("en-IN")}
          </Text>
          <View style={styles.actionRow}>
            <Button
              label="View"
              onPress={() => setDetail(item)}
              variant="ghost"
            />
            <Button
              label="Download PDF"
              onPress={() =>
                exportDocument(`Prescription ${item.id}`, rxRows(item))
              }
            />
          </View>
        </Card>
      ))}
      <Pagination page={page} pages={pages} onChange={setPage} />
      <Sheet
        visible={!!detail}
        title="Completed Prescription"
        onClose={() => setDetail(null)}
      >
        {detail ? (
          <>
            {rxRows(detail).map(([key, value]) => (
              <Field key={key} label={key} value={String(value ?? "-")} />
            ))}
            <View style={styles.actionRow}>
              <Button
                label="Close"
                onPress={() => setDetail(null)}
                variant="ghost"
              />
              <Button
                label="Download PDF"
                onPress={() =>
                  exportDocument(`Prescription ${detail.id}`, rxRows(detail))
                }
              />
            </View>
          </>
        ) : null}
      </Sheet>
    </>
  );
}

function InventoryScreen({
  state,
  initialFilter,
}: {
  state: PortalState;
  initialFilter?: string;
}) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PharmacyStockStatus | "All">(
    (initialFilter as PharmacyStockStatus) || "All",
  );
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(false);
  const [medicine, setMedicine] = useState(PHARMACY_CATALOG[0].name);
  const [stock, setStock] = useState("");
  const [expiry, setExpiry] = useState("");
  const [supplier, setSupplier] = useState(state.suppliers[0]?.name ?? "");
  useEffect(() => {
    if (initialFilter) setFilter(initialFilter as PharmacyStockStatus);
  }, [initialFilter]);
  const filtered = state.inventory.filter(
    (item) =>
      (filter === "All" || stockStatus(item) === filter) &&
      `${item.name} ${item.category} ${item.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const add = () => {
    const qty = Number(stock);
    const cat = PHARMACY_CATALOG.find((item) => item.name === medicine);
    if (!cat || qty <= 0 || !expiry.trim())
      return Alert.alert(
        "Required details",
        "Medicine, positive stock, and expiry are required.",
      );
    const existing = state.inventory.find((item) => item.name === medicine);
    if (existing) {
      state.setInventory((items) =>
        items.map((item) =>
          item.id === existing.id
            ? { ...item, qty: item.qty + qty, expiry, supplier }
            : item,
        ),
      );
    } else {
      const id = `S-${String(state.inventory.length + 1).padStart(3, "0")}`;
      state.setInventory((items) => [
        ...items,
        {
          id,
          name: medicine,
          category: cat.category,
          qty,
          min: Math.max(20, Math.round(qty * 0.2)),
          max: Math.max(qty * 2, 100),
          unit: cat.unit,
          expiry,
          supplier,
          reorderQty: Math.max(20, Math.round(qty * 0.5)),
          batch: `B-${Date.now().toString().slice(-4)}`,
          price: cat.price,
        },
      ]);
    }
    setForm(false);
    setStock("");
    setExpiry("");
  };
  const reorder = (item: PharmacyInventoryItem) => {
    const order: PharmacyPurchaseOrder = {
      id: `PO-${Date.now().toString().slice(-5)}`,
      supplier: item.supplier,
      items: 1,
      total: item.reorderQty * item.price,
      created: currentDate(),
      expected: "Pending confirmation",
      status: "Draft",
    };
    state.setOrders((items) => [order, ...items]);
    Alert.alert(
      "Draft purchase order created",
      `${order.id} created for ${item.reorderQty} ${item.unit} of ${item.name}.`,
    );
  };
  return (
    <>
      <View style={styles.statGrid}>
        <Stat
          label="Total SKUs"
          value={String(state.inventory.length)}
          detail="catalogued"
        />
        <Stat
          label="Low Stock"
          value={String(
            state.inventory.filter((item) => stockStatus(item) === "Low Stock")
              .length,
          )}
          detail="reorder needed"
          color={palette.amber}
        />
        <Stat
          label="Out of Stock"
          value={String(
            state.inventory.filter(
              (item) => stockStatus(item) === "Out of Stock",
            ).length,
          )}
          detail="unavailable"
          color={palette.rose}
        />
        <Stat
          label="Inventory Value"
          value={`Rs ${Math.round(state.inventory.reduce((sum, item) => sum + item.qty * item.price, 0)).toLocaleString("en-IN")}`}
          detail="current stock"
          color={palette.green}
        />
      </View>
      <View style={styles.actionRow}>
        <Button
          label="Export Inventory"
          onPress={() =>
            exportDocument(
              "Inventory Status",
              state.inventory.map((item): [string, string] => [
                item.id,
                `${item.name} - ${item.qty} ${item.unit} - ${stockStatus(item)}`,
              ]),
            )
          }
          variant="ghost"
        />
        <Button label="Add Medicine" onPress={() => setForm(true)} />
      </View>
      <Input
        label="Search"
        value={query}
        onChangeText={(value) => {
          setQuery(value);
          setPage(1);
        }}
        placeholder="Medicine, category, or SKU"
      />
      <Selector
        label="Stock Status"
        items={["All", "In Stock", "Low Stock", "Out of Stock", "Expiring"]}
        selected={filter}
        onChange={(value) => {
          setFilter(value as typeof filter);
          setPage(1);
        }}
      />
      <Section title="Drug Inventory" action={`${filtered.length} items`} />
      {filtered.slice((page - 1) * 10, page * 10).map((item) => (
        <Card key={item.id}>
          <View style={styles.rowTop}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.note, { color: theme.textMuted }]}>
                {item.id} - {item.category} - Batch {item.batch}
              </Text>
            </View>
            <Chip label={stockStatus(item)} />
          </View>
          <Text style={[styles.stockQty, { color: theme.text }]}>
            {item.qty.toLocaleString("en-IN")} {item.unit}
          </Text>
          <Text style={[styles.note, { color: theme.textMuted }]}>
            Min {item.min} - Max {item.max} - Exp {item.expiry}
          </Text>
          <Text style={[styles.note, { color: theme.textMuted }]}>
            {item.supplier} - Rs {item.price}/{item.unit}
          </Text>
          {item.qty < item.min ? (
            <Button
              label={`Reorder ${item.reorderQty}`}
              onPress={() => reorder(item)}
              variant="ghost"
            />
          ) : null}
        </Card>
      ))}
      <Pagination page={page} pages={pages} onChange={setPage} />
      <Sheet
        visible={form}
        title="Add Medicine to Inventory"
        onClose={() => setForm(false)}
      >
        <SearchPicker
          label="Medicine"
          items={PHARMACY_CATALOG.map((item) => item.name)}
          selected={medicine}
          onChange={setMedicine}
        />
        <Field
          label="Category"
          value={
            PHARMACY_CATALOG.find((item) => item.name === medicine)?.category ??
            "-"
          }
        />
        <Input
          label="Stock Quantity"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />
        <Input
          label="Expiry"
          value={expiry}
          onChangeText={setExpiry}
          placeholder="Example: Dec 2027"
        />
        <Selector
          label="Supplier"
          items={state.suppliers.map((item) => item.name)}
          selected={supplier}
          onChange={setSupplier}
        />
        <View style={styles.actionRow}>
          <Button
            label="Cancel"
            onPress={() => setForm(false)}
            variant="ghost"
          />
          <Button label="Update Inventory" onPress={add} />
        </View>
      </Sheet>
    </>
  );
}

function PurchaseOrdersScreen({ state }: { state: PortalState }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PharmacyPOStatus | "All">("All");
  const [form, setForm] = useState(false);
  const [detail, setDetail] = useState<PharmacyPurchaseOrder | null>(null);
  const [supplier, setSupplier] = useState(state.suppliers[0]?.name ?? "");
  const [items, setItems] = useState("1");
  const [total, setTotal] = useState("");
  const [expected, setExpected] = useState("");
  const filtered = state.orders.filter(
    (order) =>
      (filter === "All" || order.status === filter) &&
      `${order.id} ${order.supplier}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const create = () => {
    if (!supplier || Number(items) <= 0 || Number(total) <= 0)
      return Alert.alert(
        "Required details",
        "Supplier, item count, and total are required.",
      );
    const order: PharmacyPurchaseOrder = {
      id: `PO-${Date.now().toString().slice(-5)}`,
      supplier,
      items: Number(items),
      total: Number(total),
      created: currentDate(),
      expected: expected || "Pending confirmation",
      status: "Draft",
    };
    state.setOrders((rows) => [order, ...rows]);
    setForm(false);
    setItems("1");
    setTotal("");
    setExpected("");
  };
  const update = (order: PharmacyPurchaseOrder, status: PharmacyPOStatus) => {
    state.setOrders((rows) =>
      rows.map((item) => (item.id === order.id ? { ...item, status } : item)),
    );
  };
  const pendingValue = state.orders
    .filter((item) => item.status === "Pending" || item.status === "Approved")
    .reduce((sum, item) => sum + item.total, 0);
  return (
    <>
      <View style={styles.statGrid}>
        <Stat
          label="Pending Approval"
          value={String(
            state.orders.filter((item) => item.status === "Pending").length,
          )}
          detail="orders"
          color={palette.amber}
        />
        <Stat
          label="Approved"
          value={String(
            state.orders.filter((item) => item.status === "Approved").length,
          )}
          detail="awaiting delivery"
        />
        <Stat
          label="Received"
          value={String(
            state.orders.filter((item) => item.status === "Received").length,
          )}
          detail="completed"
          color={palette.green}
        />
        <Stat
          label="Pending Value"
          value={`Rs ${pendingValue.toLocaleString("en-IN")}`}
          detail="committed"
          color={palette.purple}
        />
      </View>
      <Button label="New Purchase Order" onPress={() => setForm(true)} />
      <Input
        label="Search"
        value={query}
        onChangeText={setQuery}
        placeholder="PO number or supplier"
      />
      <Selector
        label="Status"
        items={["All", "Draft", "Pending", "Approved", "Received", "Cancelled"]}
        selected={filter}
        onChange={(value) => setFilter(value as typeof filter)}
      />
      <Section title="Purchase Orders" action={`${filtered.length} records`} />
      {filtered.map((order) => (
        <Card key={order.id}>
          <View style={styles.rowTop}>
            <Text style={[styles.cardTitle, { color: theme.text, flex: 1 }]}>
              {order.id}
            </Text>
            <Chip label={order.status} />
          </View>
          <Text style={[styles.medName, { color: theme.text }]}>
            {order.supplier}
          </Text>
          <Text style={[styles.note, { color: theme.textMuted }]}>
            {order.items} items - Created {order.created} - Expected{" "}
            {order.expected}
          </Text>
          <Text style={[styles.amount, { color: accent }]}>
            Rs {order.total.toLocaleString("en-IN")}
          </Text>
          <View style={styles.actionRow}>
            <Button
              label="View"
              onPress={() => setDetail(order)}
              variant="ghost"
            />
            {order.status === "Draft" ? (
              <Button label="Submit" onPress={() => update(order, "Pending")} />
            ) : null}
            {order.status === "Pending" ? (
              <Button
                label="Approve"
                onPress={() => update(order, "Approved")}
              />
            ) : null}
            {order.status === "Approved" ? (
              <Button
                label="Mark Received"
                onPress={() => update(order, "Received")}
              />
            ) : null}
            {!["Received", "Cancelled"].includes(order.status) ? (
              <Button
                label="Cancel"
                onPress={() => update(order, "Cancelled")}
                variant="danger"
              />
            ) : null}
          </View>
        </Card>
      ))}
      <Sheet
        visible={form}
        title="New Purchase Order"
        onClose={() => setForm(false)}
      >
        <Selector
          label="Supplier"
          items={state.suppliers
            .filter((item) => item.status === "Active")
            .map((item) => item.name)}
          selected={supplier}
          onChange={setSupplier}
        />
        <Input
          label="Number of Items"
          value={items}
          onChangeText={setItems}
          keyboardType="numeric"
        />
        <Input
          label="Total Amount"
          value={total}
          onChangeText={setTotal}
          keyboardType="numeric"
        />
        <Input
          label="Expected Date"
          value={expected}
          onChangeText={setExpected}
          placeholder="DD MMM YYYY"
        />
        <View style={styles.actionRow}>
          <Button
            label="Cancel"
            onPress={() => setForm(false)}
            variant="ghost"
          />
          <Button label="Create Draft" onPress={create} />
        </View>
      </Sheet>
      <Sheet
        visible={!!detail}
        title="Purchase Order"
        onClose={() => setDetail(null)}
      >
        {detail ? (
          <>
            <Field label="PO Number" value={detail.id} />
            <Field label="Supplier" value={detail.supplier} />
            <Field label="Items" value={String(detail.items)} />
            <Field
              label="Total"
              value={`Rs ${detail.total.toLocaleString("en-IN")}`}
            />
            <Field label="Created" value={detail.created} />
            <Field label="Expected" value={detail.expected} />
            <Field label="Status" value={detail.status} />
            <Button
              label="Close"
              onPress={() => setDetail(null)}
              variant="ghost"
            />
          </>
        ) : null}
      </Sheet>
    </>
  );
}

function SuppliersScreen({ state }: { state: PortalState }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(false);
  const [detail, setDetail] = useState<PharmacySupplier | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(PHARMACY_CATEGORIES[0]);
  const filtered = state.suppliers.filter((item) =>
    `${item.name} ${item.category} ${item.contact}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const add = () => {
    if (!name.trim() || !contact.trim() || !phone.trim() || !email.trim())
      return Alert.alert(
        "Required details",
        "Supplier, contact, phone, and email are required.",
      );
    const supplier: PharmacySupplier = {
      id: `SUP-${String(state.suppliers.length + 1).padStart(2, "0")}`,
      name: name.trim(),
      contact: contact.trim(),
      phone: phone.trim(),
      email: email.trim(),
      category,
      rating: 0,
      activeOrders: 0,
      status: "Active",
    };
    state.setSuppliers((items) => [...items, supplier]);
    setForm(false);
    setName("");
    setContact("");
    setPhone("");
    setEmail("");
  };
  const toggle = (item: PharmacySupplier) =>
    state.setSuppliers((rows) =>
      rows.map((row) =>
        row.id === item.id
          ? { ...row, status: row.status === "Active" ? "Inactive" : "Active" }
          : row,
      ),
    );
  return (
    <>
      <View style={styles.statGrid}>
        <Stat
          label="Suppliers"
          value={String(state.suppliers.length)}
          detail="registered"
        />
        <Stat
          label="Active"
          value={String(
            state.suppliers.filter((item) => item.status === "Active").length,
          )}
          detail="available"
          color={palette.green}
        />
      </View>
      <Button label="Add Supplier" onPress={() => setForm(true)} />
      <Input
        label="Search"
        value={query}
        onChangeText={setQuery}
        placeholder="Supplier, category, or contact"
      />
      <Section
        title="Supplier Directory"
        action={`${filtered.length} records`}
      />
      {filtered.map((item) => (
        <Card key={item.id}>
          <View style={styles.rowTop}>
            <View style={styles.rxIcon}>
              <Text style={styles.rxIconText}>{initials(item.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.note, { color: theme.textMuted }]}>
                {item.id} - {item.category}
              </Text>
            </View>
            <Chip label={item.status} />
          </View>
          <Text style={[styles.body, { color: theme.text }]}>
            {item.contact} - {item.phone}
          </Text>
          <Text style={[styles.note, { color: theme.textMuted }]}>
            {item.email}
          </Text>
          <Text style={[styles.note, { color: theme.textMuted }]}>
            Rating {item.rating || "-"} - {item.activeOrders} active orders
          </Text>
          <View style={styles.actionRow}>
            <Button
              label="View"
              onPress={() => setDetail(item)}
              variant="ghost"
            />
            <Button
              label={item.status === "Active" ? "Deactivate" : "Activate"}
              onPress={() => toggle(item)}
              variant={item.status === "Active" ? "danger" : "primary"}
            />
          </View>
        </Card>
      ))}
      <Sheet visible={form} title="Add Supplier" onClose={() => setForm(false)}>
        <Input label="Supplier Name" value={name} onChangeText={setName} />
        <Input
          label="Contact Person"
          value={contact}
          onChangeText={setContact}
        />
        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Input label="Email" value={email} onChangeText={setEmail} />
        <Selector
          label="Category"
          items={PHARMACY_CATEGORIES}
          selected={category}
          onChange={setCategory}
        />
        <View style={styles.actionRow}>
          <Button
            label="Cancel"
            onPress={() => setForm(false)}
            variant="ghost"
          />
          <Button label="Add Supplier" onPress={add} />
        </View>
      </Sheet>
      <Sheet
        visible={!!detail}
        title="Supplier Details"
        onClose={() => setDetail(null)}
      >
        {detail ? (
          <>
            <Field label="Supplier ID" value={detail.id} />
            <Field label="Name" value={detail.name} />
            <Field label="Contact" value={detail.contact} />
            <Field label="Phone" value={detail.phone} />
            <Field label="Email" value={detail.email} />
            <Field label="Category" value={detail.category} />
            <Field label="Rating" value={String(detail.rating || "-")} />
            <Field label="Active Orders" value={String(detail.activeOrders)} />
            <Button
              label="Close"
              onPress={() => setDetail(null)}
              variant="ghost"
            />
          </>
        ) : null}
      </Sheet>
    </>
  );
}

function ReportsScreen({ state }: { state: PortalState }) {
  const { theme } = useTheme();
  const [preset, setPreset] = useState("All Time");
  const [category, setCategory] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const matchesCategory = (drug: string) =>
    category === "All" ||
    (PHARMACY_CATALOG.find((item) => item.name === drug)?.category ??
      "General") === category;
  const dispensed = state.dispensed.filter(
    (item) =>
      matchesDate(item.timestamp, preset, from, to) &&
      matchesCategory(item.drug),
  );
  const completed = state.completed.filter(
    (item) =>
      matchesDate(item.timestamp, preset, from, to) &&
      matchesCategory(item.drug),
  );
  const inventory = state.inventory.filter(
    (item) => category === "All" || item.category === category,
  );
  const billed = completed.reduce((sum, item) => sum + item.amount, 0);
  const inventoryValue = inventory.reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );
  const poValue = state.orders
    .filter((item) => item.status === "Pending" || item.status === "Approved")
    .reduce((sum, item) => sum + item.total, 0);
  const cats = [...new Set(inventory.map((item) => item.category))];
  const daily = [...new Set(dispensed.map((item) => item.date))]
    .map((date) => ({
      date,
      qty: dispensed
        .filter((item) => item.date === date)
        .reduce((sum, item) => sum + item.qty, 0),
    }))
    .slice(0, 7);
  const maxDaily = Math.max(1, ...daily.map((item) => item.qty));
  return (
    <>
      <Selector
        label="Date Range"
        items={[
          "All Time",
          "Today",
          "Last 7 Days",
          "Last 30 Days",
          "Last 3 Months",
          "Custom",
        ]}
        selected={preset}
        onChange={setPreset}
      />
      {preset === "Custom" ? (
        <>
          <Input
            label="From Date"
            value={from}
            onChangeText={setFrom}
            placeholder="YYYY-MM-DD"
          />
          <Input
            label="To Date"
            value={to}
            onChangeText={setTo}
            placeholder="YYYY-MM-DD"
          />
        </>
      ) : null}
      <Selector
        label="Category"
        items={["All", ...PHARMACY_CATEGORIES]}
        selected={category}
        onChange={setCategory}
      />
      <View style={styles.actionRow}>
        <Button
          label="Reset Filters"
          onPress={() => {
            setPreset("All Time");
            setCategory("All");
            setFrom("");
            setTo("");
          }}
          variant="ghost"
        />
        <Button
          label="Export Analysis"
          onPress={() =>
            exportDocument("Pharmacy Reports & Analytics", [
              ["Date range", preset],
              ["Category", category],
              [
                "Dispensed quantity",
                dispensed.reduce((sum, item) => sum + item.qty, 0),
              ],
              ["Billed", `Rs ${billed.toLocaleString("en-IN")}`],
              [
                "Inventory value",
                `Rs ${Math.round(inventoryValue).toLocaleString("en-IN")}`,
              ],
              ["Purchase order value", `Rs ${poValue.toLocaleString("en-IN")}`],
            ])
          }
        />
      </View>
      <View style={styles.statGrid}>
        <Stat
          label="Dispensed Qty"
          value={String(dispensed.reduce((sum, item) => sum + item.qty, 0))}
          detail="filtered period"
        />
        <Stat
          label="Billed"
          value={`Rs ${billed.toLocaleString("en-IN")}`}
          detail="completed prescriptions"
          color={palette.green}
        />
        <Stat
          label="Inventory Value"
          value={`Rs ${Math.round(inventoryValue).toLocaleString("en-IN")}`}
          detail="selected category"
          color={palette.purple}
        />
        <Stat
          label="PO Value"
          value={`Rs ${poValue.toLocaleString("en-IN")}`}
          detail="pending and approved"
          color={palette.amber}
        />
      </View>
      <Section title="Dispensing by Day" action={`${dispensed.length} records`} />
      <Card>
        {daily.map((item) => (
          <View key={item.date} style={styles.barRow}>
            <Text style={[styles.barLabel, { color: theme.textMuted }]}>{item.date}</Text>
            <View style={[styles.barTrack, { backgroundColor: theme.border }]}>
              <View style={[styles.barFill, { width: `${Math.max(4, Math.round((item.qty / maxDaily) * 100))}%` }]} />
            </View>
            <Text style={[styles.barValue, { color: theme.text }]}>{item.qty}</Text>
          </View>
        ))}
        {!daily.length ? <Text style={[styles.note, { color: theme.textMuted }]}>No dispensing data for this filter.</Text> : null}
      </Card>
      <Section
        title="Category Performance"
        action={`${cats.length} categories`}
      />
      {cats.map((cat) => {
        const catDisp = dispensed
          .filter(
            (item) =>
              (PHARMACY_CATALOG.find((m) => m.name === item.drug)?.category ??
                "General") === cat,
          )
          .reduce((sum, item) => sum + item.qty, 0);
        const catInv = inventory.filter((item) => item.category === cat);
        return (
          <Card key={cat}>
            <View style={styles.rowTop}>
              <Text style={[styles.cardTitle, { color: theme.text, flex: 1 }]}>
                {cat}
              </Text>
              <Text style={[styles.alertValue, { color: accent }]}>
                {catDisp} dispensed
              </Text>
            </View>
            <Text style={[styles.note, { color: theme.textMuted }]}>
              {catInv.length} SKUs -{" "}
              {catInv.filter((item) => item.qty < item.min).length} need
              attention
            </Text>
          </Card>
        );
      })}
      <Section title="Inventory Health" />
      <View style={styles.statGrid}>
        <Stat
          label="Healthy"
          value={String(
            inventory.filter((item) => stockStatus(item) === "In Stock").length,
          )}
          detail="in stock"
          color={palette.green}
        />
        <Stat
          label="Low"
          value={String(
            inventory.filter((item) => stockStatus(item) === "Low Stock")
              .length,
          )}
          detail="below minimum"
          color={palette.amber}
        />
        <Stat
          label="Out"
          value={String(
            inventory.filter((item) => stockStatus(item) === "Out of Stock")
              .length,
          )}
          detail="unavailable"
          color={palette.rose}
        />
        <Stat
          label="Expiring"
          value={String(
            inventory.filter((item) => stockStatus(item) === "Expiring").length,
          )}
          detail="soon"
          color={palette.purple}
        />
      </View>
    </>
  );
}

function SettingsScreen() {
  const { theme } = useTheme();
  const [tab, setTab] = useState<"profile" | "billing">("profile");
  const [plan, setPlan] = useState<PharmacyPlan["id"]>("core");
  const [status, setStatus] = useState<"Active" | "New" | "Cancelled">(
    "Active",
  );
  const [invoices, setInvoices] = useState(PHARMACY_INVOICES);
  const [payPlan, setPayPlan] = useState<PharmacyPlan | null>(null);
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const downloadDocument = (file: string) =>
    exportDocument(file.replace(".pdf", ""), [
      ["Hospital", PHARMACY_PROFILE.legalName],
      ["Facility", PHARMACY_PROFILE.facilityType],
      ["GSTIN", PHARMACY_PROFILE.gstin],
      ["CEA", PHARMACY_PROFILE.cea],
    ]);
  const upgrade = (next: PharmacyPlan) => {
    if (next.priceValue === null) {
      Alert.alert(
        "Contact sales",
        "Our enterprise team will contact the hospital administrator.",
      );
      return;
    }
    setPayPlan(next);
  };
  const pay = () => {
    if (
      !payPlan ||
      name.trim().length < 3 ||
      card.replace(/\D/g, "").length < 12 ||
      !/^\d{2}\/\d{2}$/.test(expiry) ||
      !/^\d{3,4}$/.test(cvv)
    )
      return Alert.alert(
        "Payment details incomplete",
        "Enter a valid name, card number, MM/YY, and CVV.",
      );
    const id = `INV-${new Date().getFullYear()}-${String(invoices.length + 149).padStart(4, "0")}`;
    setPlan(payPlan.id);
    setStatus("New");
    setInvoices((items) => [
      {
        id,
        plan: payPlan.id,
        amount: payPlan.price,
        date: currentDate(),
        status: "paid",
      },
      ...items,
    ]);
    setPayPlan(null);
    setName("");
    setCard("");
    setExpiry("");
    setCvv("");
    Alert.alert("Plan activated", `${payPlan.name} is now active.`);
  };
  if (payPlan)
    return (
      <>
        <Section title={`Activate ${payPlan.name}`} action={payPlan.price} />
        <Card>
          <Field
            label="Plan"
            value={`${payPlan.name} - ${payPlan.price} ${payPlan.cadence}`}
          />
          <Input label="Name on Card" value={name} onChangeText={setName} />
          <Input
            label="Card Number"
            value={card}
            onChangeText={(value) =>
              setCard(value.replace(/\D/g, "").slice(0, 16))
            }
            keyboardType="numeric"
          />
          <Input
            label="Expiry (MM/YY)"
            value={expiry}
            onChangeText={setExpiry}
          />
          <Input
            label="CVV"
            value={cvv}
            onChangeText={(value) =>
              setCvv(value.replace(/\D/g, "").slice(0, 4))
            }
            keyboardType="numeric"
          />
          <View style={styles.actionRow}>
            <Button
              label="Back"
              onPress={() => setPayPlan(null)}
              variant="ghost"
            />
            <Button
              label={payPlan.priceValue === 0 ? "Start Trial" : "Pay Securely"}
              onPress={pay}
            />
          </View>
        </Card>
      </>
    );
  return (
    <>
      <Selector
        label="Settings"
        items={["Profile", "Billing & Plans"]}
        selected={tab === "profile" ? "Profile" : "Billing & Plans"}
        onChange={(value) =>
          setTab(value === "Profile" ? "profile" : "billing")
        }
      />
      {tab === "profile" ? (
        <>
          <Section title="Hospital Details" />
          <Field label="Legal Name" value={PHARMACY_PROFILE.legalName} />
          <Field label="Facility Type" value={PHARMACY_PROFILE.facilityType} />
          <Field label="Beds" value={PHARMACY_PROFILE.beds} />
          <Field label="Established" value={PHARMACY_PROFILE.established} />
          <Field label="Address" value={PHARMACY_PROFILE.address} />
          <Field label="GSTIN" value={PHARMACY_PROFILE.gstin} />
          <Field label="PAN" value={PHARMACY_PROFILE.pan} />
          <Field label="CEA Registration" value={PHARMACY_PROFILE.cea} />
          <Section title="Contact Information" />
          <Field
            label="Contact"
            value={`${PHARMACY_PROFILE.contactName} - ${PHARMACY_PROFILE.designation}`}
          />
          <Field label="Email" value={PHARMACY_PROFILE.email} />
          <Field label="Phone" value={PHARMACY_PROFILE.phone} />
          <Field label="Alternate Phone" value={PHARMACY_PROFILE.altPhone} />
          <Section
            title="Licenses"
            action={`${PHARMACY_PROFILE.licenses.length} records`}
          />
          {PHARMACY_PROFILE.licenses.map(([license, no, valid]) => (
            <Card key={license}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {license}
              </Text>
              <Text style={[styles.note, { color: theme.textMuted }]}>
                {no}
              </Text>
              <Text style={[styles.note, { color: theme.textMuted }]}>
                Valid until {valid}
              </Text>
            </Card>
          ))}
          <Section
            title="Registration Documents"
            action={`${PHARMACY_PROFILE.documents.length} files`}
          />
          {PHARMACY_PROFILE.documents.map((file) => (
            <Card key={file}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {file}
              </Text>
              <Button
                label="Download"
                onPress={() => downloadDocument(file)}
                variant="ghost"
              />
            </Card>
          ))}
        </>
      ) : (
        <>
          <View style={[styles.subscription, { backgroundColor: palette.ink }]}>
            <Text style={styles.subscriptionKicker}>CURRENT SUBSCRIPTION</Text>
            <Text style={styles.subscriptionTitle}>
              {PHARMACY_PLANS.find((item) => item.id === plan)?.name}{" "}
              <Text style={styles.subscriptionStatus}>{status}</Text>
            </Text>
            <Text style={styles.subscriptionBody}>
              Started 12 Apr 2026 - renews monthly
            </Text>
            {status !== "Cancelled" ? (
              <Button
                label="Cancel Subscription"
                onPress={() => setStatus("Cancelled")}
                variant="ghost"
              />
            ) : (
              <Button
                label="Renew Subscription"
                onPress={() =>
                  upgrade(PHARMACY_PLANS.find((item) => item.id === plan)!)
                }
              />
            )}
          </View>
          <Section title="Plans" />
          {PHARMACY_PLANS.map((item) => {
            const current = item.id === plan && status !== "Cancelled";
            return (
              <View
                key={item.id}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: current ? `${accent}12` : theme.card,
                    borderColor: current ? accent : theme.border,
                  },
                ]}
              >
                {item.popular ? <Chip label="Most Popular" /> : null}
                {current ? <Chip label="Current Plan" /> : null}
                <Text style={[styles.planName, { color: theme.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.planPrice, { color: theme.text }]}>
                  {item.price}{" "}
                  <Text
                    style={[styles.planCadence, { color: theme.textMuted }]}
                  >
                    {item.cadence}
                  </Text>
                </Text>
                <Text style={[styles.note, { color: theme.textMuted }]}>
                  {item.tagline}
                </Text>
                <Field label="Seats" value={item.seats} />
                {item.features.map((feature) => (
                  <View key={feature} style={styles.feature}>
                    <Icon name="check" size={14} color={accent} strokeWidth={2.6} />
                    <Text style={[T.caption, styles.featureText, { color: theme.textSecondary }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
                <Button
                  label={
                    current
                      ? "Current Plan"
                      : item.priceValue === null
                        ? "Contact Sales"
                        : item.id === "pilot"
                          ? "Start Trial"
                          : "Upgrade"
                  }
                  disabled={current}
                  onPress={() => upgrade(item)}
                  variant={current ? "ghost" : "primary"}
                />
              </View>
            );
          })}
          <Section
            title="Recent Invoices"
            action={`${invoices.length} invoices`}
          />
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <View style={styles.rowTop}>
                <Text
                  style={[styles.cardTitle, { color: theme.text, flex: 1 }]}
                >
                  {invoice.id}
                </Text>
                <Chip label={invoice.status} />
              </View>
              <Text style={[styles.note, { color: theme.textMuted }]}>
                {invoice.plan.toUpperCase()} - {invoice.date}
              </Text>
              <Text style={[styles.amount, { color: accent }]}>
                {invoice.amount}
              </Text>
              <Button
                label="Download Invoice"
                onPress={() =>
                  exportDocument(invoice.id, [
                    ["Hospital", PHARMACY_PROFILE.legalName],
                    ["Plan", invoice.plan],
                    ["Amount", invoice.amount],
                    ["Date", invoice.date],
                    ["Status", invoice.status],
                  ])
                }
                variant="ghost"
              />
            </Card>
          ))}
        </>
      )}
    </>
  );
}

function ModuleBody({
  active,
  state,
  inventoryFilter,
  activities,
  notifications,
}: {
  active: PharmacyModuleId;
  state: PortalState;
  inventoryFilter?: string;
  activities: typeof PHARMACY_ACTIVITIES;
  notifications: PharmacyNotification[];
}) {
  if (active === "dashboard")
    return (
      <Dashboard
        state={state}
        activities={activities}
        notifications={notifications}
      />
    );
  if (active === "inhouse")
    return <QueueScreen source="In-House" state={state} />;
  if (active === "external")
    return <QueueScreen source="External" state={state} />;
  if (active === "dispensed")
    return <DispensedScreen records={state.dispensed} />;
  if (active === "completed")
    return <CompletedScreen records={state.completed} />;
  if (active === "inventory")
    return <InventoryScreen state={state} initialFilter={inventoryFilter} />;
  if (active === "purchase") return <PurchaseOrdersScreen state={state} />;
  if (active === "suppliers") return <SuppliersScreen state={state} />;
  if (active === "reports") return <ReportsScreen state={state} />;
  return <SettingsScreen />;
}

export default function PharmacyPortalScreen() {
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView | null>(null);
  const [active, setActive] = useState<PharmacyModuleId>("dashboard");
  const [drawer, setDrawer] = useState(false);
  const [profile, setProfile] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState<string | undefined>();
  const [prescriptions, setPrescriptions] = useState(PHARMACY_PRESCRIPTIONS);
  const [dispensed, setDispensed] = useState(PHARMACY_DISPENSED);
  const [completed, setCompleted] = useState(PHARMACY_COMPLETED);
  const [inventory, setInventory] = useState(PHARMACY_INVENTORY);
  const [orders, setOrders] = useState(PHARMACY_PURCHASE_ORDERS);
  const [suppliers, setSuppliers] = useState(PHARMACY_SUPPLIERS);
  const [notifications, setNotifications] = useState(PHARMACY_NOTIFICATIONS);
  const [activities] = useState(PHARMACY_ACTIVITIES);
  const goTo = (id: PharmacyModuleId, filter?: string) => {
    setActive(id);
    setInventoryFilter(id === "inventory" ? filter : undefined);
    requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({ y: 0, animated: false }),
    );
    pulseFor(420, 'Loading module');
  };
  const state: PortalState = {
    prescriptions,
    setPrescriptions,
    dispensed,
    setDispensed,
    completed,
    setCompleted,
    inventory,
    setInventory,
    orders,
    setOrders,
    suppliers,
    setSuppliers,
    goTo,
  };
  const badges: Partial<Record<PharmacyModuleId, number>> = {
    inhouse: prescriptions.filter(
      (item) => item.source === "In-House" && item.status !== "Dispensed",
    ).length,
    external: prescriptions.filter(
      (item) => item.source === "External" && item.status !== "Dispensed",
    ).length,
    inventory: inventory.filter((item) => item.qty < item.min).length,
  };
  return (
    <View style={[styles.safe, { backgroundColor: theme.bg }]}>
      <Header
        active={active}
        unread={notifications.filter((item) => !item.read).length}
        onMenu={() => setDrawer(true)}
        onProfile={() => setProfile(true)}
        onNotifications={() => setNotificationOpen(true)}
      />
      <Drawer
        visible={drawer}
        active={active}
        badges={badges}
        onClose={() => setDrawer(false)}
        onSelect={goTo}
        onProfile={() => setProfile(true)}
        onLogout={signOut}
      />
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ModuleBody
          active={active}
          state={state}
          inventoryFilter={inventoryFilter}
          activities={activities}
          notifications={notifications}
        />
      </ScrollView>
      <ProfileSheet visible={profile} onClose={() => setProfile(false)} />
      <NotificationsSheet
        visible={notificationOpen}
        notifications={notifications}
        setNotifications={setNotifications}
        onClose={() => setNotificationOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingBottom: spacing.huge, paddingHorizontal: spacing.xl, paddingTop: spacing.sm },

  // Spacing hooks for the kit-backed primitives
  chipGap: { marginTop: spacing.sm },
  btnGap: { marginTop: spacing.sm },
  cardGap: { marginBottom: spacing.md },
  fieldGap: { marginTop: spacing.lg },
  pickerLabel: { marginBottom: spacing.sm },
  inputLabel: { ...T.label, marginBottom: spacing.sm, marginTop: spacing.lg },

  // Card interior text
  cardTitle: { ...T.title },
  body: { ...T.small, marginTop: spacing.sm },
  note: { ...T.caption, marginTop: 3 },
  rowTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' },
  chipLine: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: spacing.sm },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },

  // Dashboard hero
  hero: { borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth * 2, marginTop: spacing.xl, padding: spacing.xl },
  heroKicker: { ...T.eyebrow },
  heroTitle: { ...T.h2, marginBottom: spacing.xs, marginTop: spacing.sm },

  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },

  // Prescription rows
  rxIcon: { alignItems: 'center', borderRadius: radius.md, height: 46, justifyContent: 'center', width: 46 },
  rxIconText: { ...T.mono, fontSize: 13 },
  medName: { ...T.smallStrong, marginTop: 4 },
  amount: { ...T.numeralSm, marginTop: spacing.sm },
  stockQty: { ...T.monoLg },
  otcRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },

  // Medicine / supplier search
  searchResults: { marginTop: spacing.sm, padding: 0 },
  searchResult: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  searchResultText: { flex: 1 },
  searchEmpty: { padding: spacing.lg, textAlign: 'center' },

  pagination: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'center', marginVertical: spacing.lg },

  // Reports bars
  barRow: { marginBottom: spacing.md },
  barLabel: { ...T.captionStrong, marginBottom: 5 },
  barTrack: { borderRadius: radius.pill, height: 9, overflow: 'hidden' },
  barFill: { borderRadius: radius.pill, height: '100%' },
  barValue: { ...T.caption, marginTop: 4 },
  alertRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', paddingVertical: spacing.sm },
  alertValue: { ...T.titleSm },

  // Profile sheet hero
  profileHero: { alignItems: 'center', marginBottom: spacing.xl },
  profileAvatar: { alignItems: 'center', backgroundColor: accent, borderRadius: radius.xl, height: 72, justifyContent: 'center', marginBottom: spacing.md, width: 72 },
  profileAvatarText: { ...T.h3, color: '#FAFAF7' },
  profileName: { ...T.h3 },

  // Subscription + plans
  subscription: { borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth * 2, marginTop: spacing.lg, padding: spacing.xl },
  subscriptionKicker: { ...T.eyebrow },
  subscriptionTitle: { ...T.h3, marginTop: spacing.sm },
  subscriptionBody: { ...T.small, marginTop: spacing.sm },
  subscriptionStatus: { ...T.captionStrong, marginTop: spacing.sm },
  planCard: { borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth * 2, marginBottom: spacing.md, padding: spacing.xl },
  planName: { ...T.h3 },
  planPrice: { ...T.numeral, marginTop: spacing.sm },
  planCadence: { ...T.caption },
  feature: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  featureText: { flex: 1 },
});
