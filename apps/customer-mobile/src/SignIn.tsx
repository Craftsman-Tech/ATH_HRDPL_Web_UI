import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Btn, Field, Txt } from '@vexoo/ui-native';
import { mineral } from '@vexoo/shared';

const DEMO_EMAIL = 'customer@vexoo.in';
const DEMO_PASSWORD = 'vexoo123';

export interface SignInProps {
  onSignIn: (name: string) => void;
}

/**
 * Customer sign-in. Mirrors the web portal's split hero + form panel, collapsed
 * into a single scrolling column at phone width.
 */
export function SignIn({ onSignIn }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password');
      return;
    }
    setError(null);
    setPending(true);
    // Stands in for the auth call until packages/customer-api lands.
    setTimeout(() => {
      setPending(false);
      onSignIn('Sarah Johnson');
    }, 700);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={['#11201C', mineral.surfaceDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.brandRow}>
            <View style={styles.mark}><Text style={styles.markText}>V</Text></View>
            <View style={{ marginLeft: 13 }}>
              <Txt size={22} weight="700" tone="inverse">Vexoo</Txt>
              <Text style={styles.eyebrow}>CONNECTED HEALTH</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 30 }}>
            <View style={styles.pip} />
            <Text style={[styles.eyebrow, { color: '#AEE9E0' }]}>CUSTOMER SIGN-IN</Text>
          </View>
          <Txt size={34} weight="700" tone="inverse" style={{ marginTop: 12 }}>Welcome back</Txt>
          <Txt size={14} style={{ color: '#AEC9C3', marginTop: 10 }}>
            Your health, family and care — all in one place.
          </Txt>
        </LinearGradient>

        <View style={styles.panel}>
          <Txt size={16} weight="600" tone="heading">Secure customer access</Txt>
          <Txt size={12} tone="muted" style={{ marginTop: 3 }}>Use your Vexoo credentials to continue</Txt>

          <View style={{ marginTop: 20, gap: 16 }}>
            <Field label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
            <Field label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
          </View>

          {error ? <Txt size={12} style={{ color: mineral.statusText.danger, marginTop: 10 }}>{error}</Txt> : null}

          <Btn label={pending ? 'Signing in…' : 'Sign in'} onPress={submit} disabled={pending} style={{ marginTop: 20 }} />

          <Pressable
            onPress={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); setError(null); }}
            accessibilityRole="button"
            style={{ paddingVertical: 16 }}
          >
            <Txt size={14} weight="600" tone="brand" center>Use demo customer</Txt>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: mineral.bg },
  hero: { paddingHorizontal: 24, paddingTop: 54, paddingBottom: 56 },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  mark: { width: 46, height: 46, borderRadius: 12, backgroundColor: mineral.primary, alignItems: 'center', justifyContent: 'center' },
  markText: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  eyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: '700', color: '#7FB3AC', marginTop: 3 },
  pip: { width: 7, height: 7, borderRadius: 4, backgroundColor: mineral.primaryBright },
  panel: {
    flex: 1,
    marginTop: -22,
    backgroundColor: mineral.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 40,
  },
});
