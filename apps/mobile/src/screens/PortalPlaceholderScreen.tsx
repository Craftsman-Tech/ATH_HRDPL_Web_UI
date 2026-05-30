/**
 * Placeholder home — replaced in later phases by each role's actual portal.
 * Confirms auth is working end-to-end and demonstrates `useAuth` / theme.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useTheme } from '../components/AppContexts';
import { spacing, fontSize, radius } from '@vexoo/shared';

export default function PortalPlaceholderScreen() {
  const { user, signOut } = useAuth();
  const { theme }         = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ padding: spacing.xxl }}>
        <Text style={[styles.eyebrow, { color: theme.textMuted }]}>
          Phase 1 · Foundation
        </Text>
        <Text style={[styles.heading, { color: theme.text }]}>
          Welcome, {user?.name}.
        </Text>
        <Text style={[styles.body, { color: theme.textMuted }]}>
          Sign-In is wired up on mobile. Auth state persists across app restarts.
          Theme toggle and language switcher work. Your portal — {user?.role} —
          ships in a later phase.
        </Text>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.textMuted }]}>SIGNED-IN USER</Text>
          <Text style={[styles.cardLine, { color: theme.text }]}>Name: {user?.name}</Text>
          <Text style={[styles.cardLine, { color: theme.text }]}>Email: {user?.email}</Text>
          <Text style={[styles.cardLine, { color: theme.text }]}>Role: {user?.role}</Text>
        </View>

        <TouchableOpacity style={[styles.signOut, { backgroundColor: theme.text }]}
                          onPress={signOut}>
          <Text style={{ color: theme.bg, fontWeight: '700', fontSize: fontSize.md }}>
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  eyebrow:  { fontSize: fontSize.xs, textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: '600' },
  heading:  { fontFamily: 'Fraunces', fontSize: fontSize.h2, marginTop: spacing.sm },
  body:     { fontSize: fontSize.md, lineHeight: 22, marginTop: spacing.md },
  card:     {
    marginTop: spacing.xxl, padding: spacing.lg,
    borderRadius: radius.xl, borderWidth: 1,
  },
  cardTitle:{ fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 1, marginBottom: spacing.sm },
  cardLine: { fontSize: fontSize.md, marginTop: 4 },
  signOut:  {
    marginTop: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
});
