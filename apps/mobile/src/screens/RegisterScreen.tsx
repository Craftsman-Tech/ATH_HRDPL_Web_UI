/**
 * ============================================================================
 *  RegisterScreen — Mobile
 * ============================================================================
 *  The three-step hospital onboarding form, mirroring the web's
 *  RegisterStepper (Hospital → Contact → License).
 *
 *  The previous version showed three equal pills, so you couldn't tell which
 *  steps were done. This one uses a real stepper: completed steps collapse to
 *  a check, the active step is filled, and the connecting rail fills as you
 *  advance — the standard affordance for "how much is left".
 *
 *  The footer is pinned rather than scrolling away, so Continue is always
 *  reachable on a long form.
 * ============================================================================
 */
import React, { useMemo, useState } from 'react';
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
import { useTheme } from '../components/AppContexts';
import type { AuthStackParamList } from '../navigation/RootNavigator';
import { T, alpha, glow } from '../theme';
import {
  Button,
  Field,
  Icon,
  InkPanel,
  SectionHeader,
  Surface,
  Touchable,
  VexooGlyph,
} from '../ui';

const PAPER = '#FAFAF7';

type Props = {
  navigation: { goBack: () => void; replace: (screen: keyof AuthStackParamList) => void };
};

type Step = 1 | 2 | 3;

type Form = {
  name: string; facilityType: string; beds: string;
  street: string; city: string; district: string; state: string; pin: string;
  contactName: string; designation: string; email: string; mobile: string; altPhone: string;
  cea: string; gstin: string; pan: string; drugLicense: string;
};

const FACILITY_TYPES = [
  'Multispecialty hospital',
  'Day-care / OPD clinic',
  'Dental clinic',
  'Diagnostic center',
];

const REQUIRED_DOCS = [
  'Registration certificate',
  'CEA / clinical establishment certificate',
  'Owner PAN and ID proof',
  'GST registration',
  'Fire NOC',
  'Drug license',
];

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: 'Hospital' },
  { id: 2, label: 'Contact' },
  { id: 3, label: 'License' },
];

const INITIAL: Form = {
  name: '', facilityType: FACILITY_TYPES[0], beds: '',
  street: '', city: '', district: '', state: '', pin: '',
  contactName: '', designation: '', email: '', mobile: '', altPhone: '',
  cea: '', gstin: '', pan: '', drugLicense: '',
};

export default function RegisterScreen({ navigation }: Props) {
  const { theme, mode } = useTheme();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Form>(INITIAL);
  const [docs, setDocs] = useState<string[]>([]);

  const reference = useMemo(
    () => `VX-REG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    [],
  );

  const step1ok = Boolean(form.name && form.street && form.city && form.district && form.state && form.pin);
  const step2ok = Boolean(form.contactName && form.designation && form.email && form.mobile);
  const docsOk  = REQUIRED_DOCS.every((doc) => docs.includes(doc));
  const canSubmit = step1ok && step2ok && docsOk;

  const stepDone: Record<Step, boolean> = { 1: step1ok, 2: step2ok, 3: canSubmit };
  const blocked =
    (step === 1 && !step1ok) || (step === 2 && !step2ok) || (step === 3 && !canSubmit);

  const update = (key: keyof Form, value: string) =>
    setForm((next) => ({ ...next, [key]: value }));

  const toggleDoc = (doc: string) =>
    setDocs((items) => (items.includes(doc) ? items.filter((d) => d !== doc) : [...items, doc]));

  const goNext = () => {
    if (blocked) return;
    if (step < 3) { setStep((step + 1) as Step); return; }
    setSubmitted(true);
  };

  // ── Success ─────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <View style={[styles.root, { backgroundColor: theme.bg }]}>
        <TopBar onBack={undefined} />
        <View style={styles.successWrap}>
          <View style={[styles.successMark, glow(theme.primary, 'md'), { backgroundColor: theme.primary }]}>
            <Icon name="check" size={34} color={PAPER} strokeWidth={2.6} />
          </View>
          <Text style={[T.h1, styles.successTitle, { color: theme.text }]}>
            Registration submitted
          </Text>
          <Text style={[T.small, styles.successBody, { color: theme.textMuted }]}>
            Our onboarding team will review your details and contact{' '}
            {form.contactName || 'your administrator'} shortly.
          </Text>

          <Surface style={styles.refCard} radiusSize="lg">
            <Text style={[T.label, { color: theme.textFaint }]}>Reference number</Text>
            <Text style={[T.monoLg, { color: theme.primary, marginTop: 4 }]}>{reference}</Text>
          </Surface>

          <Button
            label="Back to sign in"
            iconRight="arrowRight"
            size="lg"
            full
            onPress={() => navigation.replace('SignIn')}
            style={styles.successBtn}
          />
        </View>
      </View>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <TopBar onBack={navigation.goBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.eyebrowRow}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <Text style={[T.eyebrow, { color: theme.primary }]}>New hospital</Text>
          </View>
          <Text style={[T.h1, styles.title, { color: theme.text }]}>Register your hospital</Text>
          <Text style={[T.small, styles.lede, { color: theme.textMuted }]}>
            Tell us about your establishment and upload statutory documents. Every submission is
            reviewed before admin credentials are activated.
          </Text>

          {/* Stepper */}
          <View style={styles.stepper}>
            {STEPS.map((s, i) => {
              const active = step === s.id;
              const done = stepDone[s.id] && step > s.id;
              const reached = step >= s.id;
              return (
                <React.Fragment key={s.id}>
                  {i > 0 ? (
                    <View
                      style={[
                        styles.rail,
                        { backgroundColor: reached ? theme.primary : theme.border },
                      ]}
                    />
                  ) : null}
                  <Touchable press="sm" onPress={() => setStep(s.id)} style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepDot,
                        {
                          backgroundColor: done
                            ? theme.primary
                            : active
                              ? theme.primary
                              : theme.card,
                          borderColor: reached ? theme.primary : theme.border,
                        },
                        active && glow(theme.primary, 'sm'),
                      ]}
                    >
                      {done ? (
                        <Icon name="check" size={15} color={PAPER} strokeWidth={2.8} />
                      ) : (
                        <Text
                          style={[
                            T.captionStrong,
                            { color: active ? PAPER : theme.textMuted },
                          ]}
                        >
                          {s.id}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        T.caption,
                        styles.stepLabel,
                        { color: reached ? theme.text : theme.textFaint },
                      ]}
                      numberOfLines={1}
                    >
                      {s.label}
                    </Text>
                  </Touchable>
                </React.Fragment>
              );
            })}
          </View>

          {/* Step content */}
          {step === 1 ? (
            <>
              <SectionHeader title="Hospital details" eyebrow="Step 1 of 3" tight />
              <Field
                label="Legal hospital / clinic name"
                icon="building"
                value={form.name}
                onChangeText={(v) => update('name', v)}
                placeholder="Apollo Multispecialty"
                containerStyle={styles.field}
              />

              <Text style={[T.label, styles.blockLabel, { color: theme.textMuted }]}>
                Facility type
              </Text>
              <View style={styles.optionGrid}>
                {FACILITY_TYPES.map((type) => {
                  const active = form.facilityType === type;
                  return (
                    <Touchable
                      key={type}
                      press="sm"
                      onPress={() => update('facilityType', type)}
                      style={[
                        styles.option,
                        {
                          backgroundColor: active
                            ? alpha(theme.primary, mode === 'dark' ? 0.2 : 0.1)
                            : theme.card,
                          borderColor: active ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      <Icon
                        name={active ? 'checkCircle' : 'plus'}
                        size={15}
                        color={active ? theme.primary : theme.textFaint}
                        strokeWidth={2.2}
                      />
                      <Text
                        style={[T.captionStrong, { color: active ? theme.primary : theme.textSecondary }]}
                      >
                        {type}
                      </Text>
                    </Touchable>
                  );
                })}
              </View>

              <Field
                label="Number of beds"
                value={form.beds}
                onChangeText={(v) => update('beds', v)}
                placeholder="120"
                keyboardType="number-pad"
                containerStyle={styles.field}
              />
              <Field
                label="Street address"
                icon="mapPin"
                value={form.street}
                onChangeText={(v) => update('street', v)}
                placeholder="Road, area, landmark"
                containerStyle={styles.field}
              />
              <View style={styles.pair}>
                <Field
                  label="City"
                  value={form.city}
                  onChangeText={(v) => update('city', v)}
                  placeholder="Hyderabad"
                  containerStyle={styles.pairItem}
                />
                <Field
                  label="District"
                  value={form.district}
                  onChangeText={(v) => update('district', v)}
                  placeholder="Rangareddy"
                  containerStyle={styles.pairItem}
                />
              </View>
              <View style={styles.pair}>
                <Field
                  label="State / UT"
                  value={form.state}
                  onChangeText={(v) => update('state', v)}
                  placeholder="Telangana"
                  containerStyle={styles.pairItem}
                />
                <Field
                  label="PIN code"
                  value={form.pin}
                  onChangeText={(v) => update('pin', v)}
                  placeholder="500001"
                  keyboardType="number-pad"
                  containerStyle={styles.pairItem}
                />
              </View>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <SectionHeader title="Primary contact" eyebrow="Step 2 of 3" tight />
              <Field
                label="Contact person"
                icon="user"
                value={form.contactName}
                onChangeText={(v) => update('contactName', v)}
                placeholder="Anita Reddy"
                containerStyle={styles.field}
              />
              <Field
                label="Designation"
                icon="briefcase"
                value={form.designation}
                onChangeText={(v) => update('designation', v)}
                placeholder="Administrator"
                containerStyle={styles.field}
              />
              <Field
                label="Work email"
                icon="mail"
                value={form.email}
                onChangeText={(v) => update('email', v)}
                placeholder="admin@hospital.com"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.field}
              />
              <Field
                label="Mobile number"
                icon="phone"
                value={form.mobile}
                onChangeText={(v) => update('mobile', v)}
                placeholder="+91 98765 43210"
                keyboardType="phone-pad"
                containerStyle={styles.field}
              />
              <Field
                label="Alternate phone"
                icon="phone"
                value={form.altPhone}
                onChangeText={(v) => update('altPhone', v)}
                placeholder="+91 ..."
                keyboardType="phone-pad"
                hint="Optional — used only if we can't reach the primary number."
                containerStyle={styles.field}
              />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <SectionHeader title="Licenses & documents" eyebrow="Step 3 of 3" tight />
              <Field
                label="CEA registration number"
                value={form.cea}
                onChangeText={(v) => update('cea', v)}
                placeholder="CEA/TG/..."
                containerStyle={styles.field}
              />
              <View style={styles.pair}>
                <Field
                  label="GSTIN"
                  value={form.gstin}
                  onChangeText={(v) => update('gstin', v)}
                  placeholder="36AAAAA0000A1Z5"
                  autoCapitalize="characters"
                  containerStyle={styles.pairItem}
                />
                <Field
                  label="PAN"
                  value={form.pan}
                  onChangeText={(v) => update('pan', v)}
                  placeholder="ABCDE1234F"
                  autoCapitalize="characters"
                  containerStyle={styles.pairItem}
                />
              </View>
              <Field
                label="Drug license number"
                value={form.drugLicense}
                onChangeText={(v) => update('drugLicense', v)}
                placeholder="DL-..."
                containerStyle={styles.field}
              />

              <View style={styles.checklistHead}>
                <Text style={[T.label, { color: theme.textMuted }]}>Document checklist</Text>
                <Text style={[T.captionStrong, { color: docsOk ? theme.statusText.success : theme.textMuted }]}>
                  {docs.length}/{REQUIRED_DOCS.length}
                </Text>
              </View>

              {REQUIRED_DOCS.map((doc) => {
                const active = docs.includes(doc);
                return (
                  <Touchable
                    key={doc}
                    press="sm"
                    onPress={() => toggleDoc(doc)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: active }}
                    style={[
                      styles.docRow,
                      {
                        backgroundColor: active
                          ? alpha(theme.primary, mode === 'dark' ? 0.16 : 0.08)
                          : theme.card,
                        borderColor: active ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: active ? theme.primary : 'transparent',
                          borderColor: active ? theme.primary : theme.borderStrong,
                        },
                      ]}
                    >
                      {active ? <Icon name="check" size={13} color={PAPER} strokeWidth={3} /> : null}
                    </View>
                    <Text
                      style={[T.smallStrong, styles.docText, { color: active ? theme.text : theme.textSecondary }]}
                    >
                      {doc}
                    </Text>
                    <Icon
                      name={active ? 'checkCircle' : 'upload'}
                      size={16}
                      color={active ? theme.statusText.success : theme.textFaint}
                      strokeWidth={2}
                    />
                  </Touchable>
                );
              })}

              <View style={[styles.note, { backgroundColor: theme.statusBg.info }]}>
                <Icon name="info" size={15} color={theme.statusText.info} strokeWidth={2.2} />
                <Text style={[T.caption, styles.noteText, { color: theme.statusText.info }]}>
                  In this preview, tapping a document marks it as uploaded. Real file upload
                  connects when backend storage is added.
                </Text>
              </View>
            </>
          ) : null}
        </ScrollView>

        {/* Pinned footer */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.card,
              borderTopColor: theme.hairline,
              paddingBottom: Math.max(insets.bottom, spacing.lg),
            },
          ]}
        >
          <View style={styles.progressWrap}>
            <View style={[styles.progressTrack, { backgroundColor: theme.bgSunken }]}>
              <View
                style={[
                  styles.progressFill,
                  { backgroundColor: theme.primary, width: `${(step / 3) * 100}%` },
                ]}
              />
            </View>
            <Text style={[T.caption, { color: theme.textMuted }]}>Step {step} of 3</Text>
          </View>

          <View style={styles.actions}>
            <Button
              label="Back"
              icon="arrowLeft"
              variant="ghost"
              size="lg"
              disabled={step === 1}
              onPress={() => setStep((step - 1) as Step)}
              style={styles.actionBtn}
            />
            <Button
              label={step === 3 ? 'Submit' : 'Continue'}
              iconRight="arrowRight"
              size="lg"
              disabled={blocked}
              onPress={goNext}
              style={styles.actionBtn}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function TopBar({ onBack }: { onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <InkPanel
      accent="#0E7C66"
      glowPosition="top"
      height={120}
      grid
      style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}
    >
      <View style={styles.topBarRow}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <VexooGlyph size={19} color={PAPER} />
          </View>
          <View>
            <Text style={[T.titleSm, { color: PAPER }]}>Vexoo One</Text>
            <Text style={[T.eyebrow, { color: alpha(PAPER, 0.45) }]}>Hospital registration</Text>
          </View>
        </View>

        {onBack ? (
          <Touchable press="sm" onPress={onBack} style={styles.backBtn}>
            <Icon name="arrowLeft" size={15} color={PAPER} strokeWidth={2.2} />
            <Text style={[T.captionStrong, { color: PAPER }]}>Sign in</Text>
          </Touchable>
        ) : null}
      </View>
    </InkPanel>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  topBar: {
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  topBarRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm + 2,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: '#0E7C66',
    borderRadius: radius.sm,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  backBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(250,250,247,0.10)',
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 1,
  },

  content: {
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  eyebrowRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    borderRadius: radius.pill,
    height: 6,
    width: 6,
  },
  title: {
    marginTop: spacing.sm,
  },
  lede: {
    marginTop: 6,
  },

  stepper: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: spacing.xl + 4,
  },
  stepItem: {
    alignItems: 'center',
    gap: 6,
    width: 74,
  },
  stepDot: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  stepLabel: {
    textAlign: 'center',
  },
  rail: {
    flex: 1,
    height: 2,
    marginTop: 16,
  },

  field: {
    marginTop: spacing.lg,
  },
  blockLabel: {
    marginBottom: spacing.md,
    marginTop: spacing.xl,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 3,
  },
  pair: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  pairItem: {
    flex: 1,
    marginTop: spacing.lg,
  },

  checklistHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.xl + 4,
  },
  docRow: {
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.md + 2,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: radius.xs,
    borderWidth: 1.6,
    height: 21,
    justifyContent: 'center',
    width: 21,
  },
  docText: {
    flex: 1,
  },
  note: {
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    padding: spacing.md,
  },
  noteText: {
    flex: 1,
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  progressWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  progressTrack: {
    borderRadius: radius.pill,
    flex: 1,
    height: 5,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: radius.pill,
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionBtn: {
    flex: 1,
  },

  successWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successMark: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 78,
    justifyContent: 'center',
    width: 78,
  },
  successTitle: {
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  successBody: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  refCard: {
    alignItems: 'center',
    marginTop: spacing.xl,
    minWidth: 220,
  },
  successBtn: {
    marginTop: spacing.xl,
  },
});
