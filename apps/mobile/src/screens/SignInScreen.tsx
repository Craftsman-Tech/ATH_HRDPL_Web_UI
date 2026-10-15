/**
 * ============================================================================
 *  SignInScreen — Mobile
 * ============================================================================
 *  The mobile counterpart to the web's two-panel sign-in. On a phone the panels
 *  stack: the ink brand panel becomes a hero that owns the top third, and the
 *  form scrolls beneath it on paper.
 *
 *    ┌─────────────────────────────┐
 *    │  ◈ Vexoo            ☾       │  ← ink hero: grid + mineral orbs
 *    │  ● CALM SOFTWARE …          │
 *    │  Quiet tools.               │  ← Fraunces, mineral italic accent
 *    │  Crisp care.                │
 *    ├─────────────────────────────┤
 *    │  WELCOME BACK               │
 *    │  Sign in to Vexoo           │
 *    │  ┌────┐┌────┐┌────┐         │  ← role cards, active fills w/ accent
 *    │  [ ✉ email            ]     │
 *    │  [ 🔒 password      👁 ]     │
 *    │  [   Sign in    →     ]     │
 *    │  EN · हिंदी · తెలుగు         │
 *    └─────────────────────────────┘
 *
 *  Note on type: Fraunces and Inter Tight carry Latin only, so when the user
 *  picks Hindi or Telugu the display face steps aside for the system font
 *  rather than rendering tofu. See `serif()` below.
 * ============================================================================
 */
import React, { useState } from 'react';
import {
<<<<<<< HEAD
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
=======
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Modal, Pressable,
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing } from '@vexoo/shared';
import type { LangCode, Role } from '@vexoo/shared';
import { useAuth, useLang, useTheme } from '../components/AppContexts';
import type { AuthStackParamList } from '../navigation/RootNavigator';
import { T, alpha, glow } from '../theme';
import {
  Button,
  Chip,
  Field,
  Icon,
  InkPanel,
  Sheet,
  SheetActions,
  Touchable,
  VexooGlyph,
  type IconName,
} from '../ui';

<<<<<<< HEAD
const PAPER = '#FAFAF7';

const ROLES: { id: Role; demoEmail: string; icon: IconName; accent: string }[] = [
  { id: 'Admin',        demoEmail: 'admin@vexoo.in',     icon: 'shield',       accent: '#0E7C66' },
  { id: 'Doctor',       demoEmail: 'doctor@vexoo.in',    icon: 'stethoscope',  accent: '#0A7A8F' },
  { id: 'Receptionist', demoEmail: 'reception@vexoo.in', icon: 'users',        accent: '#0E7C66' },
  { id: 'Pharmacist',   demoEmail: 'pharmacy@vexoo.in',  icon: 'pill',         accent: '#6D5BD0' },
  { id: 'LabTech',      demoEmail: 'lab@vexoo.in',       icon: 'flask',        accent: '#C68A1F' },
=======
// Same role list as web — kept in lockstep so demo behavior matches.
const ROLES: { id: Role; demoEmail: string }[] = [
  { id: 'Admin',        demoEmail: 'admin@vexoo.in'     },
  { id: 'Doctor',       demoEmail: 'doctor@vexoo.in'    },
  { id: 'Receptionist', demoEmail: 'reception@vexoo.in' },
  { id: 'Pharmacist',   demoEmail: 'pharmacy@vexoo.in'  },
  { id: 'LabTech',      demoEmail: 'lab@vexoo.in'       },
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
];

const LANGS: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'te', label: 'తెలుగు' },
];

// Screen names are typed against the auth stack's param list so a route that
// doesn't exist on this navigator fails to compile rather than at runtime.
type Props = {
  navigation: { navigate: (screen: keyof AuthStackParamList) => void };
};

<<<<<<< HEAD
=======
// Navigation prop shape (loose typing — replace with proper RootStackParamList
// once we wire up the typed nav in Phase 2).
type Props = { navigation: { replace: (screen: string) => void; navigate: (screen: string) => void } };

>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
export default function SignInScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const { theme, mode } = useTheme();
  const { code: lang, set: setLang, t } = useLang();
  const insets = useSafeAreaInsets();

  const [role,     setRole]     = useState<Role>('Receptionist');
  const [email,    setEmail]    = useState('reception@vexoo.in');
  const [password, setPassword] = useState('');
  const [err,      setErr]      = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD

  // The role grid is sized from a measured container rather than percentage
  // widths: Yoga shrinks percentage-width children inside a wrapping row
  // instead of wrapping them, which collapsed the five cards into one squeezed
  // line. Exact pixel widths wrap predictably (3 + 2).
  const [gridWidth, setGridWidth] = useState(0);
  const ROLE_GAP = 10;
  const roleCardWidth = gridWidth ? (gridWidth - ROLE_GAP * 2) / 3 : undefined;

=======
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportSent, setSupportSent] = useState(false);
  const [supportMode, setSupportMode] = useState<'help' | 'forgot' | 'register'>('help');
  const [supportForm, setSupportForm] = useState({
<<<<<<< HEAD
    name: '', phone: '', email: 'reception@vexoo.in', hospital: '', message: '',
  });

  const activeRole = ROLES.find((r) => r.id === role) ?? ROLES[2];
  const accent = activeRole.accent;

  /**
   * Fraunces has no Devanagari or Telugu coverage, so translated headings drop
   * back to the platform font at a weight that keeps the same visual hierarchy.
   */
  const serif = (base: object) =>
    lang === 'en' ? base : [base, styles.systemDisplay];
=======
    name: '',
    phone: '',
    email: 'reception@vexoo.in',
    hospital: '',
    message: '',
  });
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2

  const pickRole = (r: Role) => {
    setRole(r);
    const match = ROLES.find((x) => x.id === r);
    if (match) setEmail(match.demoEmail);
    setErr('');
  };

<<<<<<< HEAD
  const openSupport = (next: 'help' | 'forgot' | 'register') => {
    setSupportMode(next);
=======
  const openSupport = (mode: 'help' | 'forgot' | 'register') => {
    setSupportMode(mode);
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
    setSupportSent(false);
    setSupportForm((f) => ({
      ...f,
      email,
<<<<<<< HEAD
      message:
        next === 'forgot'   ? `I need help resetting access for ${email}.`
      : next === 'register' ? 'We want to register a new hospital/clinic with Vexoo.'
      : f.message,
=======
      message: mode === 'forgot'
        ? `I need help resetting access for ${email}.`
        : mode === 'register'
          ? 'We want to register a new hospital/clinic with Vexoo.'
          : f.message,
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
    }));
    setSupportOpen(true);
  };

  const submitSupport = () => {
<<<<<<< HEAD
    if (!supportForm.name.trim() || !supportForm.message.trim()) return;
=======
    if (!supportForm.name.trim() || !supportForm.message.trim()) {
      setErr('Enter your name and message before submitting support request.');
      return;
    }
    setErr('');
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
    setSupportSent(true);
  };

  const onSubmit = async () => {
    setErr('');
<<<<<<< HEAD
    if (!email.trim()) { setErr('Enter your email address.'); return; }
=======
    if (!email.trim()) { setErr('Enter email address.'); return; }
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const user = await signIn(email, password, role);
    setLoading(false);
    if (!user) { setErr(t.signIn.invalid); return; }
    // No manual navigation here: setting the user flips RootNavigator from the
    // auth stack to the app stack. Dispatching `replace('Home')` would target
    // the auth stack, which has no such route.
  };

  const supportTitle =
    supportMode === 'register' ? 'Register your hospital'
    : supportMode === 'forgot' ? 'Reset access'
    : 'Vexoo customer support';

  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
      >
<<<<<<< HEAD
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
          bounces={false}
        >
          {/* ── Ink brand hero ─────────────────────────────────────────── */}
          <InkPanel
            accent="#0E7C66"
            glowPosition="top"
            height={330}
            style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}
          >
            <View style={styles.heroTop}>
              <View style={styles.logoRow}>
                <View style={[styles.logoMark, glow('#0E7C66', 'sm')]}>
                  <VexooGlyph size={21} color={PAPER} />
                </View>
                <View>
                  <Text style={[T.title, { color: PAPER }]}>Vexoo One</Text>
                  <Text style={[T.eyebrow, { color: alpha(PAPER, 0.45) }]} numberOfLines={1}>
                    {t.signIn.estLine}
=======
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
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
                  </Text>
                </View>
              </View>

<<<<<<< HEAD
              <ThemeToggle />
            </View>

            <View style={styles.heroCopy}>
              <View style={styles.eyebrowRow}>
                <View style={styles.eyebrowDot} />
                <Text style={[T.eyebrow, { color: alpha(PAPER, 0.62) }]} numberOfLines={2}>
                  {t.signIn.tagline1}
                </Text>
              </View>

              <Text style={[serif(T.hero), styles.headline, { color: PAPER }]}>
                {t.signIn.headlineA}
                {'\n'}
                <Text style={[styles.headlineEm, lang !== 'en' && styles.systemDisplay]}>
                  {t.signIn.headlineB}
                </Text>{' '}
                {t.signIn.headlineC}
              </Text>
            </View>
          </InkPanel>

          {/* ── Form ────────────────────────────────────────────────────── */}
          <View style={[styles.form, { paddingBottom: spacing.xxxl + insets.bottom }]}>
            <Text style={[T.eyebrow, { color: theme.primary }]}>{t.signIn.welcome}</Text>
            <Text style={[serif(T.h1), styles.heading, { color: theme.text }]}>
              {t.signIn.heading}
            </Text>
            <Text style={[T.small, styles.sub, { color: theme.textMuted }]}>{t.signIn.sub}</Text>

            {/* Role picker — a card grid. Each card carries its portal's accent,
                so the choice previews where you're about to land. */}
            <Text style={[T.label, styles.blockLabel, { color: theme.textMuted }]}>
              {t.signIn.role}
            </Text>
            <View
              style={[styles.roleGrid, { gap: ROLE_GAP }]}
              onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}
            >
              {ROLES.map((r) => {
                const active = r.id === role;
                return (
                  <Touchable
                    key={r.id}
                    onPress={() => pickRole(r.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={[
                      styles.roleCard,
                      roleCardWidth ? { width: roleCardWidth } : null,
                      {
                        backgroundColor: active ? r.accent : theme.card,
                        borderColor: active ? r.accent : theme.border,
                      },
                      active && glow(r.accent, 'sm'),
                    ]}
                  >
                    <Icon
                      name={r.icon}
                      size={19}
                      color={active ? PAPER : theme.textMuted}
                      strokeWidth={active ? 2.1 : 1.8}
                    />
                    <Text
                      style={[T.captionStrong, { color: active ? PAPER : theme.textSecondary }]}
                      numberOfLines={1}
                    >
                      {t.roles[r.id]}
                    </Text>
                  </Touchable>
                );
              })}
            </View>

            {/* The demo account for the selected role — one quiet line instead
                of the old five-card grid duplicating the picker above. */}
            <View style={[styles.demoRow, { backgroundColor: theme.bgSunken, borderColor: theme.hairline }]}>
              <Icon name="info" size={14} color={theme.textFaint} strokeWidth={2} />
              <Text style={[T.caption, styles.demoText, { color: theme.textMuted }]} numberOfLines={2}>
                Demo account
              </Text>
              <Text style={[T.mono, { color: accent }]} numberOfLines={1}>
                {activeRole.demoEmail}
              </Text>
            </View>

            <Field
              label={t.signIn.email}
              icon="mail"
              value={email}
              onChangeText={(v) => { setEmail(v); setErr(''); }}
              accent={accent}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="you@clinic.com"
              containerStyle={styles.field}
            />

            <Field
              label={t.signIn.password}
              icon="lock"
              value={password}
              onChangeText={setPassword}
              accent={accent}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              trailingIcon={showPassword ? 'eyeOff' : 'eye'}
              onTrailingPress={() => setShowPassword((v) => !v)}
              containerStyle={styles.field}
              labelAction={
                <Touchable press="sm" onPress={() => openSupport('forgot')}>
                  <Text style={[T.captionStrong, { color: accent }]}>{t.signIn.forgot}</Text>
                </Touchable>
              }
            />

            {err ? (
              <View style={[styles.error, { backgroundColor: theme.statusBg.danger }]}>
                <Icon name="alertCircle" size={15} color={theme.statusText.danger} strokeWidth={2.2} />
                <Text style={[T.small, styles.errorText, { color: theme.statusText.danger }]}>
                  {err}
                </Text>
              </View>
            ) : null}

            <Button
              label={t.signIn.signin}
              onPress={onSubmit}
              loading={loading}
              accent={accent}
              size="lg"
              full
              iconRight="arrowRight"
              style={styles.submit}
            />

            <Text style={[T.caption, styles.demoNote, { color: theme.textFaint }]}>
              {t.signIn.demo}
            </Text>

            {/* Language */}
            <View style={[styles.langRow, { borderTopColor: theme.hairline }]}>
              <Text style={[T.label, { color: theme.textMuted }]}>{t.signIn.language}</Text>
              <View style={styles.langBtns}>
                {LANGS.map((l) => {
                  const active = lang === l.code;
                  return (
                    <Touchable
                      key={l.code}
                      press="sm"
                      onPress={() => setLang(l.code)}
                      style={[
                        styles.langBtn,
                        {
                          backgroundColor: active ? alpha(theme.primary, mode === 'dark' ? 0.2 : 0.1) : 'transparent',
                          borderColor: active ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[T.captionStrong, { color: active ? theme.primary : theme.textMuted }]}
                      >
                        {l.label}
                      </Text>
                    </Touchable>
                  );
                })}
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Touchable press="sm" onPress={() => navigation.navigate('Register')} style={styles.footerLink}>
                <Text style={[T.small, { color: theme.textMuted }]}>
                  {t.signIn.newClinic}{' '}
                  <Text style={[T.smallStrong, { color: theme.primary }]}>{t.signIn.register}</Text>
                </Text>
              </Touchable>

              <Button
                label={t.signIn.help}
                icon="help"
                variant="ghost"
                size="sm"
                onPress={() => openSupport('help')}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Support sheet ─────────────────────────────────────────────── */}
      <Sheet
        visible={supportOpen}
        title={supportTitle}
        subtitle={
          supportMode === 'register'
            ? 'Send your clinic details and our onboarding team will get in touch.'
            : 'Tell us what is blocking your sign-in and we will follow up.'
        }
        onClose={() => setSupportOpen(false)}
        footer={
          supportSent ? undefined : (
            <SheetActions>
              <Button label="Cancel" variant="ghost" onPress={() => setSupportOpen(false)} style={styles.flex} />
              <Button label="Submit request" onPress={submitSupport} style={styles.flex} />
            </SheetActions>
          )
        }
      >
        {supportSent ? (
          <View style={styles.sent}>
            <View style={[styles.sentMark, { backgroundColor: theme.statusBg.success }]}>
              <Icon name="checkCircle" size={28} color={theme.statusText.success} strokeWidth={2} />
            </View>
            <Text style={[T.h3, styles.sentTitle, { color: theme.text }]}>Message sent</Text>
            <Text style={[T.small, styles.sentBody, { color: theme.textMuted }]}>
              Our team will reach out using the details you provided.
            </Text>
            <Button label="Done" onPress={() => setSupportOpen(false)} style={styles.sentBtn} />
          </View>
        ) : (
          <>
            <Field
              label="Full name"
              icon="user"
              value={supportForm.name}
              onChangeText={(name) => setSupportForm((f) => ({ ...f, name }))}
              placeholder="Your name"
              containerStyle={styles.field}
            />
            <Field
              label="Phone"
              icon="phone"
              value={supportForm.phone}
              onChangeText={(phone) => setSupportForm((f) => ({ ...f, phone }))}
              placeholder="+91 ..."
              keyboardType="phone-pad"
              containerStyle={styles.field}
            />
            <Field
              label="Email"
              icon="mail"
              value={supportForm.email}
              onChangeText={(value) => setSupportForm((f) => ({ ...f, email: value }))}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.field}
            />
            {supportMode === 'register' ? (
              <Field
                label="Hospital / clinic name"
                icon="building"
                value={supportForm.hospital}
                onChangeText={(hospital) => setSupportForm((f) => ({ ...f, hospital }))}
                placeholder="Hospital name"
                containerStyle={styles.field}
              />
            ) : null}

            <View style={styles.roleLine}>
              <Text style={[T.label, { color: theme.textMuted }]}>Role</Text>
              <Chip label={t.roles[role]} color={accent} />
            </View>

            <Field
              label="Message"
              value={supportForm.message}
              onChangeText={(message) => setSupportForm((f) => ({ ...f, message }))}
              placeholder="Describe the issue or onboarding request"
              multiline
              containerStyle={styles.field}
            />
          </>
        )}
      </Sheet>
    </View>
=======
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
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
  );
}

/** The hero's theme switch — lives on ink, so it styles itself. */
function ThemeToggle() {
  const { mode, toggle } = useTheme();
  return (
    <Touchable onPress={toggle} accessibilityLabel="Toggle theme" style={styles.themeBtn}>
      <Icon name={mode === 'light' ? 'moon' : 'sun'} size={17} color={PAPER} strokeWidth={2} />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },

  hero: {
    borderBottomLeftRadius: radius.xxxl,
    borderBottomRightRadius: radius.xxxl,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl + 2,
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
<<<<<<< HEAD
  logoMark: {
    alignItems: 'center',
    backgroundColor: '#0E7C66',
=======
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
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
    borderRadius: radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
<<<<<<< HEAD
  themeBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(250,250,247,0.10)',
=======
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
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
    borderRadius: radius.md,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  heroCopy: {
    marginTop: spacing.xxxl,
  },
  eyebrowRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  eyebrowDot: {
    backgroundColor: '#1FBFA0',
    borderRadius: radius.pill,
    height: 6,
    width: 6,
  },
  headline: {
    marginTop: spacing.md,
  },
  headlineEm: {
    color: '#5BD4BC',
    fontFamily: 'Fraunces-400i',
  },
  /** Fallback for scripts Fraunces/Inter Tight don't cover. */
  systemDisplay: {
    fontFamily: undefined,
    fontWeight: '600',
    letterSpacing: 0,
  },
  passwordToggleStandalone: { alignSelf: 'flex-end', paddingTop: spacing.sm },
  passwordToggleText: { color: theme.primary, fontSize: fontSize.sm, fontWeight: '700' },

  form: {
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl + 2,
    paddingTop: spacing.xxl + 2,
  },
  heading: {
    marginTop: 6,
  },
  sub: {
    marginTop: 6,
  },
  blockLabel: {
    marginBottom: spacing.md,
    marginTop: spacing.xl + 4,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roleCard: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    flexGrow: 0,
    flexShrink: 0,
    gap: 7,
    justifyContent: 'center',
    minHeight: 80,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.md,
  },
  demoRow: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  demoText: {
    flex: 1,
  },
  field: {
    marginTop: spacing.lg,
  },
  error: {
    alignItems: 'center',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
  },
  errorText: {
    flex: 1,
  },
  submit: {
    marginTop: spacing.xl + 2,
  },
  demoNote: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  langRow: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    gap: spacing.md,
    marginTop: spacing.xxxl,
    paddingTop: spacing.xl,
  },
  langBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  langBtn: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  footerLink: {
    paddingVertical: spacing.xs,
  },
  roleLine: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  sent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  sentMark: {
    alignItems: 'center',
    borderRadius: radius.xl,
    height: 62,
    justifyContent: 'center',
    width: 62,
  },
  sentTitle: {
    marginTop: spacing.lg,
  },
  sentBody: {
    marginTop: 6,
    textAlign: 'center',
  },
  sentBtn: {
    marginTop: spacing.xl,
  },
<<<<<<< HEAD
=======
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
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
});
