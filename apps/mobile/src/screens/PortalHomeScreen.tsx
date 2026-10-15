<<<<<<< HEAD
/**
 * ============================================================================
 *  PortalHomeScreen — Mobile
 * ============================================================================
 *  Sends the signed-in user to their role's portal. Every role has a bespoke
 *  portal, and `Record<Role, …>` makes that total — adding a role to `Role`
 *  without building its portal is a compile error rather than a blank screen.
 * ============================================================================
 */
import React from 'react';
import type { Role } from '@vexoo/shared';
import { useAuth } from '../components/AppContexts';
import HospitalAdminPortalScreen from './hospital-admin/HospitalAdminPortalScreen';
import DoctorPortalScreen from './doctor/DoctorPortalScreen';
import ReceptionPortalScreen from './reception/ReceptionPortalScreen';
import PharmacyPortalScreen from './pharmacy/PharmacyPortalScreen';
import LabTechPortalScreen from './lab-tech/LabTechPortalScreen';

const PORTAL_BY_ROLE: Record<Role, React.ComponentType> = {
  Admin:        HospitalAdminPortalScreen,
  Doctor:       DoctorPortalScreen,
  Receptionist: ReceptionPortalScreen,
  Pharmacist:   PharmacyPortalScreen,
  LabTech:      LabTechPortalScreen,
};

export default function PortalHomeScreen() {
  const { user } = useAuth();
  // RootNavigator only mounts this stack once a user exists, so the fallback
  // is belt-and-braces rather than a state the app actually reaches.
  const Portal = PORTAL_BY_ROLE[user?.role ?? 'Receptionist'];
  return <Portal />;
}
=======
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontSize, fontWeight, spacing } from '@vexoo/shared';
import { useAuth, useTheme } from '../components/AppContexts';
import HospitalAdminPortalScreen from './hospital-admin/HospitalAdminPortalScreen';
import {
  BottomTabs,
  DrawerMenu,
  MetricGrid,
  PersonRow,
  PortalHeader,
  QuickActions,
  SectionTitle,
  TaskRow,
} from '../components/PortalPrimitives';
import { PORTAL_CONFIGS } from '../data/portalData';

const TABS = ['Dashboard', 'Worklist', 'Directory'];

export default function PortalHomeScreen() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const config = PORTAL_CONFIGS[user?.role ?? 'Receptionist'];
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [activeModule, setActiveModule] = useState(config.modules[0]);
  const [menuOpen, setMenuOpen] = useState(false);

  const activeSummary = useMemo(() => {
    if (activeModule === config.modules[0]) return config.subtitle;
    return `${activeModule} is available in the ${config.label} mobile workspace with quick triage and handoff actions.`;
  }, [activeModule, config.label, config.modules, config.subtitle]);

  if (user?.role === 'Admin') {
    return <HospitalAdminPortalScreen />;
  }

  const renderDashboard = () => (
    <>
      <View style={styles.moduleSummary}>
        <Text style={[styles.moduleTitle, { color: theme.text }]}>{activeModule}</Text>
        <Text style={[styles.moduleBody, { color: theme.textMuted }]}>{activeSummary}</Text>
      </View>
      <MetricGrid metrics={config.metrics} theme={theme} />
      <SectionTitle title="Quick actions" action="New" theme={theme} />
      <QuickActions actions={config.quickActions} accent={config.accent} theme={theme} />
      <SectionTitle title="Needs attention" action="View all" theme={theme} />
      {config.tasks.slice(0, 3).map((task) => <TaskRow key={task.id} task={task} theme={theme} />)}
    </>
  );

  const renderWorklist = () => (
    <>
      <SectionTitle title={`${config.label} worklist`} action={`${config.tasks.length} items`} theme={theme} />
      {config.tasks.map((task) => <TaskRow key={task.id} task={task} theme={theme} />)}
    </>
  );

  const renderDirectory = () => (
    <>
      <SectionTitle title="Patient directory" action={`${config.people.length} records`} theme={theme} />
      {config.people.map((person) => <PersonRow key={person.id} person={person} theme={theme} />)}
    </>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      <PortalHeader
        title={config.homeTitle}
        subtitle={config.subtitle}
        name={user?.name ?? 'User'}
        roleLabel={config.label}
        accent={config.accent}
        activeModule={activeModule}
        theme={theme}
        onMenu={() => setMenuOpen(true)}
        onTheme={toggle}
      />
      <DrawerMenu
        modules={config.modules}
        active={activeModule}
        accent={config.accent}
        theme={theme}
        visible={menuOpen}
        roleLabel={config.label}
        onClose={() => setMenuOpen(false)}
        onChange={setActiveModule}
        onSignOut={signOut}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Dashboard' ? renderDashboard() : null}
        {activeTab === 'Worklist' ? renderWorklist() : null}
        {activeTab === 'Directory' ? renderDirectory() : null}
      </ScrollView>

      <BottomTabs
        tabs={TABS}
        active={activeTab}
        accent={config.accent}
        theme={theme}
        onChange={setActiveTab}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xxl,
  },
  moduleSummary: {
    marginBottom: spacing.lg,
  },
  moduleTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
  },
  moduleBody: {
    fontSize: fontSize.md,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
});
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
