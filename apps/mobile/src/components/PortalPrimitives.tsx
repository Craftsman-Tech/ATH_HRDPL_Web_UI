import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { fontSize, fontWeight, radius, spacing, type Theme } from '@vexoo/shared';
import type { PortalMetric, PortalPerson, PortalTask, PortalTone } from '../data/portalData';

type ThemeLike = Theme;

const toneKey: Record<PortalTone, keyof ThemeLike['statusBg']> = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  purple: 'purple',
  neutral: 'neutral',
};

export function StatusChip({ label, tone, theme }: { label: string; tone: PortalTone; theme: ThemeLike }) {
  const key = toneKey[tone];
  return (
    <View style={[styles.chip, { backgroundColor: theme.statusBg[key] }]}>
      <Text style={[styles.chipText, { color: theme.statusText[key] }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function PortalHeader({
  title,
  subtitle,
  name,
  roleLabel,
  accent,
  theme,
  activeModule,
  onMenu,
  onTheme,
}: {
  title: string;
  subtitle: string;
  name: string;
  roleLabel: string;
  accent: string;
  theme: ThemeLike;
  activeModule: string;
  onMenu: () => void;
  onTheme: () => void;
}) {
  return (
    <View style={[styles.header, { backgroundColor: theme.sidebar }]}>
      <View style={styles.headerTop}>
        <View style={styles.brandRow}>
          <TouchableOpacity style={styles.menuButton} onPress={onMenu}>
            <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.3} strokeLinecap="round">
              <Path d="M4 6h16M4 12h16M4 18h16" />
            </Svg>
          </TouchableOpacity>
          <View style={[styles.brandMark, { backgroundColor: accent }]}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2}>
              <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </Svg>
          </View>
          <View>
            <Text style={styles.brandText}>Vexoo</Text>
            <Text style={styles.brandSub}>{roleLabel}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={onTheme}>
            <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
              <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.greeting}>Hi, {name}</Text>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={[styles.activeModulePill, { borderColor: accent }]}>
        <Text style={styles.activeModuleText}>{activeModule}</Text>
      </View>
      <Text style={styles.headerSubtitle}>{subtitle}</Text>
    </View>
  );
}

export function DrawerMenu({
  modules,
  active,
  accent,
  theme,
  visible,
  roleLabel,
  onClose,
  onChange,
  onSignOut,
}: {
  modules: string[];
  active: string;
  accent: string;
  theme: ThemeLike;
  visible: boolean;
  roleLabel: string;
  onClose: () => void;
  onChange: (module: string) => void;
  onSignOut: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.drawerRoot}>
        <Pressable style={styles.drawerBackdrop} onPress={onClose} />
        <View style={[styles.drawerPanel, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.drawerHead}>
            <View>
              <Text style={[styles.drawerEyebrow, { color: theme.textMuted }]}>Portal menu</Text>
              <Text style={[styles.drawerTitle, { color: theme.text }]}>{roleLabel}</Text>
            </View>
            <TouchableOpacity style={[styles.drawerClose, { borderColor: theme.border }]} onPress={onClose}>
              <Text style={[styles.drawerCloseText, { color: theme.text }]}>X</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.drawerList}>
            {modules.map((module) => {
              const selected = active === module;
              return (
                <Pressable
                  key={module}
                  onPress={() => {
                    onChange(module);
                    onClose();
                  }}
                  style={[
                    styles.drawerItem,
                    { borderColor: theme.border },
                    selected && { backgroundColor: accent, borderColor: accent },
                  ]}
                >
                  <View style={[styles.drawerItemDot, { backgroundColor: selected ? '#fff' : accent }]} />
                  <Text style={[styles.drawerItemText, { color: selected ? '#fff' : theme.text }]}>
                    {module}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={[styles.drawerFooter, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.drawerLogout, { borderColor: theme.border }]}
              onPress={() => {
                onClose();
                onSignOut();
              }}
            >
              <Svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M10 17l5-5-5-5M15 12H3M21 3v18" />
              </Svg>
              <Text style={[styles.drawerLogoutText, { color: theme.text }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function MetricGrid({ metrics, theme }: { metrics: PortalMetric[]; theme: ThemeLike }) {
  return (
    <View style={styles.metricGrid}>
      {metrics.map((metric) => {
        const key = toneKey[metric.tone];
        return (
          <View key={metric.label} style={[styles.metricCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.metricDot, { backgroundColor: theme.statusText[key] }]} />
            <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{metric.label}</Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>{metric.value}</Text>
            <Text style={[styles.metricDetail, { color: theme.textMuted }]} numberOfLines={2}>
              {metric.detail}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function SectionTitle({ title, action, theme }: { title: string; action?: string; theme: ThemeLike }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {action ? <Text style={[styles.sectionAction, { color: theme.primary }]}>{action}</Text> : null}
    </View>
  );
}

export function TaskRow({ task, theme }: { task: PortalTask; theme: ThemeLike }) {
  return (
    <View style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.rowTop}>
        <Text style={[styles.rowTitle, { color: theme.text }]} numberOfLines={1}>
          {task.title}
        </Text>
        <StatusChip label={task.status} tone={task.tone} theme={theme} />
      </View>
      <Text style={[styles.rowSubtitle, { color: theme.textMuted }]} numberOfLines={2}>
        {task.subtitle}
      </Text>
      <Text style={[styles.rowMeta, { color: theme.textMuted }]}>{task.meta}</Text>
    </View>
  );
}

export function PersonRow({ person, theme }: { person: PortalPerson; theme: ThemeLike }) {
  return (
    <View style={[styles.rowCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.rowTop}>
        <View style={styles.personTitleWrap}>
          <Text style={[styles.rowTitle, { color: theme.text }]} numberOfLines={1}>
            {person.name}
          </Text>
          <Text style={[styles.rowSubtitle, { color: theme.textMuted }]} numberOfLines={1}>
            {person.subtitle}
          </Text>
        </View>
        <StatusChip label={person.status} tone={person.tone} theme={theme} />
      </View>
      <Text style={[styles.rowMeta, { color: theme.textMuted }]}>{person.meta}</Text>
    </View>
  );
}

export function QuickActions({
  actions,
  accent,
  theme,
}: {
  actions: string[];
  accent: string;
  theme: ThemeLike;
}) {
  return (
    <View style={styles.quickGrid}>
      {actions.map((action) => (
        <TouchableOpacity key={action} style={[styles.quickButton, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.quickIcon, { backgroundColor: accent }]} />
          <Text style={[styles.quickText, { color: theme.text }]} numberOfLines={2}>
            {action}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function BottomTabs({
  tabs,
  active,
  accent,
  theme,
  onChange,
}: {
  tabs: string[];
  active: string;
  accent: string;
  theme: ThemeLike;
  onChange: (tab: string) => void;
}) {
  return (
    <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
      {tabs.map((tab) => {
        const selected = active === tab;
        return (
          <TouchableOpacity key={tab} style={styles.bottomTab} onPress={() => onChange(tab)}>
            <View style={[styles.bottomIcon, { backgroundColor: selected ? accent : theme.statusBg.neutral }]} />
            <Text style={[styles.bottomLabel, { color: selected ? accent : theme.textMuted }]} numberOfLines={1}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
    minWidth: 0,
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderRadius: radius.md,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  brandMark: {
    alignItems: 'center',
    borderRadius: radius.md,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  brandText: {
    color: '#fff',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },
  brandSub: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: fontSize.xs,
    marginTop: 1,
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderRadius: radius.md,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  signOutButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderRadius: radius.md,
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  signOutText: {
    color: '#fff',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  greeting: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.xl,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: '#fff',
    fontSize: fontSize.h2,
    marginTop: spacing.xs,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: fontSize.sm,
    lineHeight: 19,
    marginTop: spacing.sm,
  },
  activeModulePill: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  activeModuleText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  drawerRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    backgroundColor: 'rgba(15,22,35,0.48)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  drawerPanel: {
    borderRightWidth: 1,
    height: '100%',
    padding: spacing.xxl,
    width: 304,
  },
  drawerHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
  },
  drawerEyebrow: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  drawerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    marginTop: spacing.xs,
  },
  drawerClose: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  drawerCloseText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  drawerList: {
    gap: spacing.sm,
  },
  drawerItem: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  drawerItemDot: {
    borderRadius: radius.pill,
    height: 9,
    width: 9,
  },
  drawerItemText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  drawerFooter: {
    borderTopWidth: 1,
    marginTop: 'auto',
    paddingTop: spacing.lg,
  },
  drawerLogout: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  drawerLogoutText: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.heavy,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    minHeight: 122,
    padding: spacing.lg,
    width: '47.9%',
  },
  metricDot: {
    borderRadius: radius.pill,
    height: 7,
    marginBottom: spacing.md,
    width: 24,
  },
  metricLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: fontSize.h2,
    marginTop: spacing.xs,
  },
  metricDetail: {
    fontSize: fontSize.sm,
    lineHeight: 17,
    marginTop: spacing.xs,
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.heavy,
  },
  sectionAction: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chipText: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
  },
  rowCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  rowTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  personTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: fontWeight.heavy,
  },
  rowSubtitle: {
    fontSize: fontSize.sm,
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  rowMeta: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickButton: {
    alignItems: 'center',
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 58,
    padding: spacing.md,
    width: '47.9%',
  },
  quickIcon: {
    borderRadius: radius.pill,
    height: 10,
    width: 10,
  },
  quickText: {
    flex: 1,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  bottomBar: {
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  bottomTab: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  bottomIcon: {
    borderRadius: radius.pill,
    height: 5,
    width: 24,
  },
  bottomLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
});
