/**
 * ============================================================================
 *  SignInScreen — Mobile
 * ============================================================================
 *  Same brand DNA as the web Sign-In (deep ink hero, Fraunces serif, role
 *  picker, English/Hindi/Telugu, light/dark) — but laid out vertically for
 *  a phone:
 *
 *    ┌─────────────────────────────┐
 *    │   [ Brand hero — top 35% ]  │  ← headline + tagline + theme toggle
 *    ├─────────────────────────────┤
 *    │   Welcome back              │
 *    │   Sign in to Vexoo          │
 *    │                             │
 *    │   [ role · role · role  ]   │  ← horizontal scrollable chips
 *    │   [ email input         ]   │
 *    │   [ password input      ]   │
 *    │   [ Sign in ▶           ]   │
 *    │                             │
 *    │   [ EN  · HI  · TE      ]   │
 *    └─────────────────────────────┘
 *
 *  The form scrolls when keyboard is up; brand hero stays fixed.
 * ============================================================================
 */
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Modal, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path }   from 'react-native-svg';
import type { Role, LangCode } from '@vexoo/shared';
import { palette, fontSize, spacing, radius } from '@vexoo/shared';
import { useAuth, useTheme, useLang } from '../components/AppContexts';

// Same role list as web — kept in lockstep so demo behavior matches.
const ROLES: { id: Role; demoEmail: string }[] = [
  { id: 'Admin',        demoEmail: 'admin@vexoo.in'     },
  { id: 'Doctor',       demoEmail: 'doctor@vexoo.in'    },
  { id: 'Receptionist', demoEmail: 'reception@vexoo.in' },
  { id: 'Pharmacist',   demoEmail: 'pharmacy@vexoo.in'  },
  { id: 'LabTech',      demoEmail: 'lab@vexoo.in'       },
];

const ROLE_ICON_PATHS: Record<Role, string> = {
  Admin:        'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  Doctor:       'M22 12h-4l-3 9L9 3l-3 9H2',
  Receptionist: 'M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z',
  Pharmacist:   'M6.5 10h-2v3h-3v2h3v3h2v-3h3v-2h-3z',
  LabTech:      'M6 2v6l2 2-6 10h16L12 10l2-2V2H6z',
};

const ROLE_ACCENTS: Record<Role, string> = {
  Admin:        '#0E7C66',
  Doctor:       '#0A7A8F',
  Receptionist: '#0E7C66',
  Pharmacist:   '#5C6BC0',
  LabTech:      '#0A7A8F',
};

// Navigation prop shape (loose typing — replace with proper RootStackParamList
// once we wire up the typed nav in Phase 2).
type Props = { navigation: { replace: (screen: string) => void; navigate: (screen: string) => void } };

export default function SignInScreen({ navigation }: Props) {
  const { signIn }       = useAuth();
  const { mode, theme, toggle } = useTheme();
  const { code: lang, set: setLang, t } = useLang();

  const [role,     setRole]     = useState<Role>('Receptionist');
  const [email,    setEmail]    = useState('reception@vexoo.in');
  const [password, setPassword] = useState('');
  const [err,      setErr]      = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportSent, setSupportSent] = useState(false);
  const [supportMode, setSupportMode] = useState<'help' | 'forgot' | 'register'>('help');
  const [supportForm, setSupportForm] = useState({
    name: '',
    phone: '',
    email: 'reception@vexoo.in',
    hospital: '',
    message: '',
  });

  // Same pickRole behavior as web — auto-fills the demo email.
  const pickRole = (r: Role) => {
    setRole(r);
    const m = ROLES.find(x => x.id === r);
    if (m) setEmail(m.demoEmail);
    setErr('');
  };

  const openSupport = (mode: 'help' | 'forgot' | 'register') => {
    setSupportMode(mode);
    setSupportSent(false);
    setSupportForm((f) => ({
      ...f,
      email,
      message: mode === 'forgot'
        ? `I need help resetting access for ${email}.`
        : mode === 'register'
          ? 'We want to register a new hospital/clinic with Vexoo.'
          : f.message,
    }));
    setSupportOpen(true);
  };

  const submitSupport = () => {
    if (!supportForm.name.trim() || !supportForm.message.trim()) {
      setErr('Enter your name and message before submitting support request.');
      return;
    }
    setErr('');
    setSupportSent(true);
  };

  const onSubmit = async () => {
    setErr('');
    if (!email.trim()) { setErr('Enter email address.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const u = await signIn(email, password, role);
    setLoading(false);

    if (!u) { setErr(t.signIn.invalid); return; }
    // Each role goes to its own stack — for now they all lead to the same
    // placeholder until the portal phases land. (Auth state is persisted so
    // this navigation only runs on cold sign-in.)
    navigation.replace('Home');
  };

  // Theming — every dynamic style derives from `theme` so dark mode works.
  const s = makeStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: theme.bg }}
    >
      {/* ── Brand hero (top 35%) ──────────────────────────────────── */}
      <LinearGradient colors={['#1c2537', '#253048']} style={s.hero}>
        <SafeAreaView edges={['top']}>
          <View style={s.heroTop}>
            <View style={s.logoRow}>
              <View style={s.logoMark}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
                     stroke="#fafaf7" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </Svg>
              </View>
              <View>
                <Text style={s.logoText}>Vexoo</Text>
                <Text style={s.logoSub}>{t.signIn.estLine}</Text>
              </View>
            </View>
            {/* Theme toggle (top-right) */}
            <TouchableOpacity onPress={toggle} style={s.themeBtn}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                   stroke="#fafaf7" strokeWidth={2}>
                <Path d={mode === 'light'
                  ? 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'
                  : 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'} />
              </Svg>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: spacing.xxxl }}>
            <View style={s.eyebrowRow}>
              <View style={s.eyebrowDot} />
              <Text style={s.eyebrowText}>{t.signIn.tagline1}</Text>
            </View>
            <Text style={s.headline}>
              {t.signIn.headlineA}{'\n'}
              <Text style={s.headlineEm}>{t.signIn.headlineB}</Text> {t.signIn.headlineC}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── Form ──────────────────────────────────────────────────── */}
      <ScrollView
        style={s.formScroll}
        contentContainerStyle={s.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.welcome}>{t.signIn.welcome}</Text>
        <Text style={s.heading}>{t.signIn.heading}</Text>
        <Text style={s.sub}>{t.signIn.sub}</Text>

        {/* Role picker — horizontal chips (mobile-native pattern) */}
        <Text style={s.label}>{t.signIn.role}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.xs }}>
          {ROLES.map(r => {
            const active = role === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[s.roleChip, active && { backgroundColor: ROLE_ACCENTS[r.id], borderColor: ROLE_ACCENTS[r.id] }]}
                onPress={() => pickRole(r.id)}
              >
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none"
                     stroke={active ? '#fff' : theme.textMuted} strokeWidth={2.2}
                     strokeLinecap="round" strokeLinejoin="round">
                  <Path d={ROLE_ICON_PATHS[r.id]} />
                </Svg>
                <Text style={[s.roleChipText, active && { color: '#fff' }]}>
                  {t.roles[r.id]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={s.demoCards}>
          {ROLES.map(r => (
            <TouchableOpacity key={r.id} style={s.demoCard} onPress={() => pickRole(r.id)}>
              <Text style={s.demoRole}>{t.roles[r.id]}</Text>
              <Text style={s.demoEmail}>{r.demoEmail}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Email */}
        <Text style={[s.label, { marginTop: spacing.lg }]}>{t.signIn.email}</Text>
        <TextInput
          style={s.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@clinic.com"
          placeholderTextColor={theme.textMuted}
        />

        {/* Password */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between',
                       alignItems: 'flex-end', marginTop: spacing.lg, marginBottom: spacing.sm }}>
          <Text style={s.label}>{t.signIn.password}</Text>
          <TouchableOpacity onPress={() => openSupport('forgot')}><Text style={s.forgot}>{t.signIn.forgot}</Text></TouchableOpacity>
        </View>
        <TextInput
          style={s.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholder="••••••••"
          placeholderTextColor={theme.textMuted}
        />
        <TouchableOpacity style={s.passwordToggleStandalone} onPress={() => setShowPassword(v => !v)}>
          <Text style={s.passwordToggleText}>{showPassword ? 'Hide password' : 'Show password'}</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity style={[s.submit, loading && { opacity: 0.6 }]}
                          onPress={onSubmit} disabled={loading}>
          {loading
            ? <ActivityIndicator color={theme.bg} />
            : <Text style={s.submitText}>{t.signIn.signin}  →</Text>}
        </TouchableOpacity>

        {!!err && <Text style={s.err}>{err}</Text>}
        <Text style={s.demo}>{t.signIn.demo}</Text>

        {/* Language switcher */}
        <View style={s.langRow}>
          <Text style={s.langLabel}>{t.signIn.language}</Text>
          <View style={{ flexDirection: 'row', gap: spacing.xs }}>
            {(['en', 'hi', 'te'] as LangCode[]).map(c => {
              const active = lang === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[s.langBtn, active && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                  onPress={() => setLang(c)}
                >
                  <Text style={[s.langBtnText, active && { color: '#fff' }]}>
                    {c === 'en' ? 'English' : c === 'hi' ? 'हिंदी' : 'తెలుగు'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <TouchableOpacity style={s.footerAction} onPress={() => navigation.navigate('Register')}>
            <Text style={s.footerText}>
              {t.signIn.newClinic} <Text style={{ color: theme.primary }}>{t.signIn.register}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.helpAction} onPress={() => openSupport('help')}>
            <Text style={s.helpActionText}>{t.signIn.help} Vexoo Customer Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal transparent visible={supportOpen} animationType="slide" onRequestClose={() => setSupportOpen(false)}>
        <View style={s.modalRoot}>
          <Pressable style={s.modalBackdrop} onPress={() => setSupportOpen(false)} />
          <View style={s.supportSheet}>
            <View style={s.supportHead}>
              <View style={{ flex: 1 }}>
                <Text style={s.supportTitle}>{supportMode === 'register' ? 'Register Hospital' : supportMode === 'forgot' ? 'Reset Access' : 'Vexoo Customer Support'}</Text>
                <Text style={s.supportSub}>{supportMode === 'register' ? 'Send your clinic details and onboarding team will contact you.' : 'Tell us what is blocking your sign-in.'}</Text>
              </View>
              <TouchableOpacity style={s.supportClose} onPress={() => setSupportOpen(false)}>
                <Text style={s.supportCloseText}>X</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={s.supportBody}>
              {supportSent ? (
                <View style={s.successBox}>
                  <Text style={s.successTitle}>Message Sent Successfully</Text>
                  <Text style={s.successText}>Our team will reach out soon using the details you provided.</Text>
                  <TouchableOpacity style={s.submit} onPress={() => setSupportOpen(false)}>
                    <Text style={s.submitText}>Done</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text style={s.label}>Full Name</Text>
                  <TextInput style={s.input} value={supportForm.name} onChangeText={(name) => setSupportForm((f) => ({ ...f, name }))} placeholder="Your name" placeholderTextColor={theme.textMuted} />
                  <Text style={s.label}>Phone</Text>
                  <TextInput style={s.input} value={supportForm.phone} onChangeText={(phone) => setSupportForm((f) => ({ ...f, phone }))} placeholder="+91 ..." placeholderTextColor={theme.textMuted} keyboardType="phone-pad" />
                  <Text style={s.label}>Email</Text>
                  <TextInput style={s.input} value={supportForm.email} onChangeText={(value) => setSupportForm((f) => ({ ...f, email: value }))} placeholder="you@example.com" placeholderTextColor={theme.textMuted} keyboardType="email-address" autoCapitalize="none" />
                  {supportMode === 'register' ? (
                    <>
                      <Text style={s.label}>Hospital / Clinic Name</Text>
                      <TextInput style={s.input} value={supportForm.hospital} onChangeText={(hospital) => setSupportForm((f) => ({ ...f, hospital }))} placeholder="Hospital name" placeholderTextColor={theme.textMuted} />
                    </>
                  ) : null}
                  <Text style={s.label}>Role</Text>
                  <TextInput style={s.input} value={t.roles[role]} editable={false} />
                  <Text style={s.label}>Message</Text>
                  <TextInput
                    style={[s.input, s.messageInput]}
                    value={supportForm.message}
                    onChangeText={(message) => setSupportForm((f) => ({ ...f, message }))}
                    placeholder="Describe the issue or onboarding request"
                    placeholderTextColor={theme.textMuted}
                    multiline
                  />
                  <View style={s.supportActions}>
                    <TouchableOpacity style={s.ghostButton} onPress={() => setSupportOpen(false)}>
                      <Text style={s.ghostButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.supportSubmit} onPress={submitSupport}>
                      <Text style={s.supportSubmitText}>Submit Request</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// Stylesheet factory — takes the theme so we can flip light/dark cleanly.
const makeStyles = (theme: ReturnType<typeof useTheme>['theme']) => StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.xxl,
    paddingBottom:     spacing.xxxl,
    borderBottomLeftRadius:  radius.xxl,
    borderBottomRightRadius: radius.xxl,
  },
  heroTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: spacing.md,
  },
  logoRow:    { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  logoMark:   {
    width: 36, height: 36, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoText:   { color: '#fafaf7', fontSize: fontSize.xl, fontWeight: '600' },
  logoSub:    { color: 'rgba(250,250,247,0.55)', fontSize: fontSize.xxs, marginTop: 1 },
  themeBtn:   {
    width: 36, height: 36, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  eyebrowDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#5bd4bc' },
  eyebrowText:{ color: 'rgba(250,250,247,0.65)', fontSize: fontSize.xs, letterSpacing: 1.2, textTransform: 'uppercase' },
  headline:   { color: '#fafaf7', fontSize: 36, lineHeight: 40, marginTop: spacing.md },
  headlineEm: { color: '#5bd4bc', fontStyle: 'italic', fontWeight: '400' },

  formScroll: { flex: 1 },
  formContent:{ padding: spacing.xxl, paddingBottom: spacing.xxxl + spacing.xxl },

  welcome: { fontSize: fontSize.xs, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: '600' },
  heading: { fontSize: fontSize.h2, color: theme.text, marginTop: 4 },
  sub:     { fontSize: fontSize.md, color: theme.textMuted, marginTop: spacing.sm, lineHeight: 20 },

  label:   { fontSize: fontSize.sm, fontWeight: '600', color: theme.textMuted, marginTop: spacing.xl, marginBottom: spacing.sm },
  forgot:  { fontSize: fontSize.sm, color: theme.primary },

  roleChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: theme.card,
    borderWidth: 1, borderColor: theme.border,
  },
  roleChipText: { fontSize: fontSize.sm, fontWeight: '600', color: theme.textMuted },
  demoCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  demoCard: {
    width: '48%',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.card,
    padding: spacing.md,
  },
  demoRole: { color: theme.text, fontSize: fontSize.sm, fontWeight: '700' },
  demoEmail: { color: theme.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs },

  input: {
    backgroundColor: theme.card,
    borderWidth: 1, borderColor: theme.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    fontSize: fontSize.md, color: theme.text,
  },
  passwordToggleStandalone: { alignSelf: 'flex-end', paddingTop: spacing.sm },
  passwordToggleText: { color: theme.primary, fontSize: fontSize.sm, fontWeight: '700' },

  submit: {
    marginTop: spacing.xxl,
    backgroundColor: theme.text,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 1,
    alignItems: 'center', justifyContent: 'center',
  },
  submitText: { color: theme.bg, fontWeight: '700', fontSize: fontSize.md },

  err:  { marginTop: spacing.md, fontSize: fontSize.base, color: palette.rose, textAlign: 'center' },
  demo: { marginTop: spacing.md, fontSize: fontSize.sm, color: theme.textMuted, textAlign: 'center' },

  langRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: spacing.xxxl, paddingTop: spacing.xl,
    borderTopWidth: 1, borderTopColor: theme.border,
  },
  langLabel: { fontSize: fontSize.sm, color: theme.textMuted },
  langBtn: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
    borderWidth: 1, borderColor: theme.border,
    backgroundColor: 'transparent',
  },
  langBtnText: { fontSize: fontSize.sm, color: theme.textMuted },

  footer: { marginTop: spacing.xl, alignItems: 'center', gap: spacing.md },
  footerAction: { paddingVertical: spacing.xs },
  footerText: { fontSize: fontSize.sm, color: theme.textMuted },
  helpAction: { borderColor: theme.border, borderRadius: radius.md, borderWidth: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  helpActionText: { color: theme.primary, fontSize: fontSize.sm, fontWeight: '700' },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { backgroundColor: 'rgba(15,22,35,0.48)', bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 },
  supportSheet: { backgroundColor: theme.card, borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, maxHeight: '88%' },
  supportHead: { alignItems: 'center', borderBottomColor: theme.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', padding: spacing.xl },
  supportTitle: { color: theme.text, fontSize: fontSize.lg, fontWeight: '800' },
  supportSub: { color: theme.textMuted, fontSize: fontSize.sm, lineHeight: 18, marginTop: spacing.xs },
  supportClose: { alignItems: 'center', borderColor: theme.border, borderRadius: radius.md, borderWidth: 1, height: 36, justifyContent: 'center', width: 36 },
  supportCloseText: { color: theme.text, fontSize: fontSize.sm, fontWeight: '800' },
  supportBody: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  messageInput: { minHeight: 110, textAlignVertical: 'top' },
  supportActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  ghostButton: { alignItems: 'center', backgroundColor: theme.card, borderColor: theme.border, borderRadius: radius.md, borderWidth: 1, flex: 1, minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.lg },
  ghostButtonText: { color: theme.text, fontSize: fontSize.sm, fontWeight: '700' },
  supportSubmit: { alignItems: 'center', backgroundColor: theme.primary, borderRadius: radius.md, flex: 1, minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.lg },
  supportSubmitText: { color: '#fff', fontSize: fontSize.sm, fontWeight: '800' },
  successBox: { alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  successTitle: { color: theme.text, fontSize: fontSize.lg, fontWeight: '800', textAlign: 'center' },
  successText: { color: theme.textMuted, fontSize: fontSize.md, lineHeight: 21, textAlign: 'center' },
});
