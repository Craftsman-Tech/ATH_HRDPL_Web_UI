import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Badge, Card, HeartbeatPulse, Icon, IconChip, Txt } from '@vexoo/ui-native';
import { mineral, mineralPalette } from '@vexoo/shared';
import { NAV, NOTIF_DATA, SEARCH_INDEX, TITLES, type ScreenId } from '@vexoo/shared/customer';
import { SCREENS } from './screens';

const DRAWER_W = 300;
/** Floor on how long the busy overlay stays up so instant work doesn't flash. */
const MIN_BUSY_MS = 900;

export interface PortalShellProps {
  customerName: string;
  customerId: string;
  onSignOut: () => void;
}

/**
 * The portal shell: header, slide-in drawer, inline search, notifications and the
 * screen switcher.
 *
 * Navigation is a single switch on `screen` rather than a navigator, mirroring the
 * native Android client's single-activity `render(screen)` model. It keeps the
 * drawer, the header title and the loading state in one place, which is what the
 * design actually needs — there are no nested stacks to manage.
 */
export function PortalShell({ customerName, customerId, onSignOut }: PortalShellProps) {
  const [screen, setScreen] = useState<ScreenId>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { width } = useWindowDimensions();
  const slide = useRef(new Animated.Value(-DRAWER_W)).current;

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
    Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  }, [slide]);

  const closeDrawer = useCallback(() => {
    Animated.timing(slide, { toValue: -DRAWER_W, duration: 200, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setDrawerOpen(false);
    });
  }, [slide]);

  /** Switching modules shows the heartbeat strip, exactly as the Android client does. */
  const go = useCallback(
    (next: ScreenId) => {
      closeDrawer();
      setSearchOpen(false);
      setQuery('');
      setScreen(next);
      setLoading(true);
      setTimeout(() => setLoading(false), 420);
    },
    [closeDrawer],
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  /** Blocking heartbeat overlay for downloads, exports and uploads. */
  const runBusy = useCallback(
    (message: string, done?: string) => {
      setBusy(message);
      setTimeout(() => {
        setBusy(null);
        if (done) showToast(done);
      }, MIN_BUSY_MS + 300);
    },
    [showToast],
  );

  const title = TITLES[screen];
  const results = useMemo(
    () => (query.trim() ? SEARCH_INDEX.filter((r) => r.label.toLowerCase().includes(query.trim().toLowerCase())) : []),
    [query],
  );
  const notifications = NOTIF_DATA.filter((_, i) => !dismissed.includes(i));

  const Screen = SCREENS[screen];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={openDrawer} accessibilityRole="button" accessibilityLabel="Open navigation" style={styles.hBtn}>
          <Icon name="menu" size={20} color={mineral.heading} />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Txt size={20} weight="700" tone="heading">{title.t}</Txt>
          <Txt size={12} tone="muted">{title.s}</Txt>
        </View>
        <Pressable onPress={() => setSearchOpen((s) => !s)} accessibilityRole="button" accessibilityLabel="Search" style={styles.hBtn}>
          <Icon name="search" size={19} color={mineral.heading} />
        </Pressable>
        <Pressable onPress={() => setNotifOpen(true)} accessibilityRole="button" accessibilityLabel="Notifications" style={styles.hBtn}>
          <Icon name="bell" size={19} color={mineral.heading} />
          {notifications.length > 0 ? <View style={styles.dot} /> : null}
        </Pressable>
        <Avatar name={customerName} size={42} />
      </View>

      {searchOpen ? (
        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search records, meds, labs…"
            placeholderTextColor={mineral.textMuted}
            autoFocus
            style={styles.searchInput}
          />
          {results.map((r) => (
            <Pressable key={r.label} onPress={() => go(r.to)} style={styles.searchRow}>
              <IconChip icon={r.ic} size={32} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Txt size={13} weight="600" tone="heading">{r.label}</Txt>
                <Txt size={11} tone="muted">{r.type}</Txt>
              </View>
              <Icon name="arrowR" size={15} color={mineral.textMuted} />
            </Pressable>
          ))}
          {query.trim() && results.length === 0 ? (
            <Txt size={13} tone="muted" center style={{ paddingVertical: 18 }}>No matches for “{query}”</Txt>
          ) : null}
        </View>
      ) : null}

      {/* ── Content ── */}
      {loading ? (
        <View style={styles.loading}>
          <HeartbeatPulse accent={mineral.primaryBright} deep={mineral.primary} />
          <Txt size={13} tone="muted" center style={{ marginTop: 12 }}>Loading…</Txt>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Screen go={go} toast={showToast} busy={runBusy} customerName={customerName} customerId={customerId} />
        </ScrollView>
      )}

      {/* ── Drawer ── */}
      <Modal visible={drawerOpen} transparent animationType="fade" onRequestClose={closeDrawer}>
        <Pressable style={styles.scrim} onPress={closeDrawer} accessibilityLabel="Close navigation">
          <Animated.View style={[styles.drawer, { width: DRAWER_W, transform: [{ translateX: slide }] }]}>
            <Pressable onPress={() => {}} style={{ flex: 1 }}>
              <SafeAreaView edges={['top']} style={{ backgroundColor: mineral.surfaceDark }}>
                <View style={styles.drawerHead}>
                  <View style={styles.drawerMark}><Text style={styles.drawerMarkText}>V</Text></View>
                  <View style={{ marginLeft: 12 }}>
                    <Txt size={20} weight="700" tone="inverse">Vexoo</Txt>
                    <Text style={styles.drawerEyebrow}>CUSTOMER PORTAL</Text>
                  </View>
                </View>
                <View style={styles.idCard}>
                  <Avatar name={customerName} size={40} />
                  <View style={{ marginLeft: 11, flex: 1 }}>
                    <Txt size={14} weight="600" tone="inverse">{customerName}</Txt>
                    <Text style={styles.idText}>{customerId}</Text>
                  </View>
                </View>
              </SafeAreaView>

              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12 }}>
                {NAV.map((item) => {
                  const active = item.id === screen;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => go(item.id)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      style={[styles.navItem, active && styles.navItemActive]}
                    >
                      <View style={[styles.navRail, active && { backgroundColor: mineral.primaryBright }]} />
                      <View style={[styles.navChip, active && { backgroundColor: mineral.primary }]}>
                        <Icon name={item.ic} size={16} color={active ? '#FFFFFF' : '#9AA3A1'} />
                      </View>
                      <Text style={[styles.navLabel, active && { color: '#FAFAF7', fontWeight: '600' }]}>{item.label}</Text>
                      {item.badge ? <Badge color="#FFFFFF" bg={mineral.primary}>{String(item.badge)}</Badge> : null}
                    </Pressable>
                  );
                })}
                <Pressable onPress={onSignOut} style={[styles.navItem, { marginTop: 10 }]} accessibilityRole="button">
                  <View style={styles.navRail} />
                  <View style={styles.navChip}><Icon name="logout" size={16} color="#FF9CA1" /></View>
                  <Text style={[styles.navLabel, { color: '#FF9CA1' }]}>Logout</Text>
                </Pressable>
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* ── Notifications ── */}
      <Modal visible={notifOpen} transparent animationType="slide" onRequestClose={() => setNotifOpen(false)}>
        <Pressable style={styles.sheetScrim} onPress={() => setNotifOpen(false)}>
          <Pressable style={[styles.sheet, { maxWidth: width }]} onPress={() => {}}>
            <View style={styles.grabber} />
            <View style={styles.sheetHead}>
              <Txt size={20} weight="700" tone="heading">Notifications</Txt>
              <Pressable onPress={() => setNotifOpen(false)} accessibilityLabel="Close">
                <Icon name="x" size={20} color={mineral.textMuted} />
              </Pressable>
            </View>
            {notifications.length === 0 ? (
              <View style={{ paddingVertical: 34, alignItems: 'center' }}>
                <IconChip icon="check" size={48} />
                <Txt size={15} weight="600" tone="heading" style={{ marginTop: 12 }}>All caught up</Txt>
                <Txt size={12} tone="muted">No new notifications.</Txt>
              </View>
            ) : (
              NOTIF_DATA.map((n, i) =>
                dismissed.includes(i) ? null : (
                  <Card key={n.title} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <IconChip icon={n.ic} color={n.color} bg={n.bg} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Txt size={14} weight="600" tone="heading">{n.title}</Txt>
                      <Txt size={12} tone="muted" style={{ marginTop: 2 }}>{n.text}</Txt>
                      <Txt size={11} tone="muted" style={{ marginTop: 4 }}>{n.time}</Txt>
                    </View>
                    <Pressable onPress={() => setDismissed((d) => [...d, i])} accessibilityLabel={`Dismiss ${n.title}`}>
                      <Icon name="x" size={16} color={mineral.textMuted} />
                    </Pressable>
                  </Card>
                ),
              )
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Blocking heartbeat overlay ── */}
      <Modal visible={busy !== null} transparent animationType="fade" onRequestClose={() => setBusy(null)}>
        <View style={styles.busyScrim}>
          <View style={styles.busyPanel}>
            <HeartbeatPulse accent={mineral.primaryBright} deep={mineral.primary} />
            <Txt size={14} weight="600" tone="heading" center style={{ marginTop: 10 }}>{busy}</Txt>
          </View>
        </View>
      </Modal>

      {toast ? (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: mineral.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
    backgroundColor: mineral.bg,
    borderBottomWidth: 1,
    borderBottomColor: mineral.border,
  },
  hBtn: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: mineralPalette.coral },
  searchWrap: { paddingHorizontal: 16, paddingTop: 10, backgroundColor: mineral.bg },
  searchInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: mineral.border,
    backgroundColor: mineral.cardInset,
    paddingHorizontal: 14,
    fontSize: 15,
    color: mineral.text,
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  content: { padding: 16, paddingBottom: 40 },
  loading: { paddingTop: 60, paddingHorizontal: 16 },

  scrim: { flex: 1, backgroundColor: 'rgba(11,15,14,0.55)' },
  drawer: { flex: 1, backgroundColor: mineral.surfaceDark },
  drawerHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14 },
  drawerMark: { width: 44, height: 44, borderRadius: 12, backgroundColor: mineral.primary, alignItems: 'center', justifyContent: 'center' },
  drawerMarkText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  drawerEyebrow: { fontSize: 10, letterSpacing: 1.3, color: '#9AA3A1', fontWeight: '700', marginTop: 2 },
  idCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  idText: { fontSize: 11, color: '#9AA3A1', marginTop: 3, fontVariant: ['tabular-nums'] },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, paddingRight: 12, borderRadius: 12, gap: 2 },
  navItemActive: { backgroundColor: 'rgba(255,255,255,0.10)' },
  navRail: { width: 3, height: 22, borderRadius: 2, marginRight: 8, backgroundColor: 'transparent' },
  navChip: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  navLabel: { flex: 1, marginLeft: 12, fontSize: 14, color: '#9AA3A1' },

  sheetScrim: { flex: 1, backgroundColor: 'rgba(11,15,14,0.55)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 18, maxHeight: '86%' },
  grabber: { width: 46, height: 5, borderRadius: 3, backgroundColor: '#C8D4D5', alignSelf: 'center', marginBottom: 16 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },

  busyScrim: { flex: 1, backgroundColor: 'rgba(11,15,14,0.70)', alignItems: 'center', justifyContent: 'center' },
  busyPanel: { width: 292, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 20, alignItems: 'center' },

  toast: { position: 'absolute', left: 16, right: 16, bottom: 28, backgroundColor: mineral.surfaceDark, borderRadius: 12, padding: 14 },
  toastText: { color: '#FFFFFF', fontSize: 13.5 },
});
