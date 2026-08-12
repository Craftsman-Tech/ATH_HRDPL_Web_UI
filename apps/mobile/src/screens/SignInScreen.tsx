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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
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

const PAPER = '#FAFAF7';

const ROLES: { id: Role; demoEmail: string; icon: IconName; accent: string }[] = [
  { id: 'Admin',        demoEmail: 'admin@vexoo.in',     icon: 'shield',       accent: '#0E7C66' },
  { id: 'Doctor',       demoEmail: 'doctor@vexoo.in',    icon: 'stethoscope',  accent: '#0A7A8F' },
  { id: 'Receptionist', demoEmail: 'reception@vexoo.in', icon: 'users',        accent: '#0E7C66' },
  { id: 'Pharmacist',   demoEmail: 'pharmacy@vexoo.in',  icon: 'pill',         accent: '#6D5BD0' },
  { id: 'LabTech',      demoEmail: 'lab@vexoo.in',       icon: 'flask',        accent: '#C68A1F' },
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

  // The role grid is sized from a measured container rather than percentage
  // widths: Yoga shrinks percentage-width children inside a wrapping row
  // instead of wrapping them, which collapsed the five cards into one squeezed
  // line. Exact pixel widths wrap predictably (3 + 2).
  const [gridWidth, setGridWidth] = useState(0);
  const ROLE_GAP = 10;
  const roleCardWidth = gridWidth ? (gridWidth - ROLE_GAP * 2) / 3 : undefined;

  const [supportOpen, setSupportOpen] = useState(false);
  const [supportSent, setSupportSent] = useState(false);
  const [supportMode, setSupportMode] = useState<'help' | 'forgot' | 'register'>('help');
  const [supportForm, setSupportForm] = useState({
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

  const pickRole = (r: Role) => {
    setRole(r);
    const match = ROLES.find((x) => x.id === r);
    if (match) setEmail(match.demoEmail);
    setErr('');
  };

  const openSupport = (next: 'help' | 'forgot' | 'register') => {
    setSupportMode(next);
    setSupportSent(false);
    setSupportForm((f) => ({
      ...f,
      email,
      message:
        next === 'forgot'   ? `I need help resetting access for ${email}.`
      : next === 'register' ? 'We want to register a new hospital/clinic with Vexoo.'
      : f.message,
    }));
    setSupportOpen(true);
  };

  const submitSupport = () => {
    if (!supportForm.name.trim() || !supportForm.message.trim()) return;
    setSupportSent(true);
  };

  const onSubmit = async () => {
    setErr('');
    if (!email.trim()) { setErr('Enter your email address.'); return; }
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
                  </Text>
                </View>
              </View>

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
  logoMark: {
    alignItems: 'center',
    backgroundColor: '#0E7C66',
    borderRadius: radius.md,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  themeBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(250,250,247,0.10)',
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
});
