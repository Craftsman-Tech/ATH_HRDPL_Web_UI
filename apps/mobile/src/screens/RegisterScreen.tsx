import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { fontSize, fontWeight, palette, radius, spacing } from '@vexoo/shared';
import { useTheme } from '../components/AppContexts';

type Props = {
  navigation: {
    goBack: () => void;
    replace: (screen: string) => void;
  };
};

type Step = 1 | 2 | 3;
type Form = {
  name: string;
  facilityType: string;
  beds: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pin: string;
  contactName: string;
  designation: string;
  email: string;
  mobile: string;
  altPhone: string;
  cea: string;
  gstin: string;
  pan: string;
  drugLicense: string;
};

const facilityTypes = ['Multispecialty hospital', 'Day-care / OPD clinic', 'Dental clinic', 'Diagnostic center'];
const requiredDocs = [
  'Registration certificate',
  'CEA / clinical establishment certificate',
  'Owner PAN and ID proof',
  'GST registration',
  'Fire NOC',
  'Drug license',
];

const initialForm: Form = {
  name: '',
  facilityType: facilityTypes[0],
  beds: '',
  street: '',
  city: '',
  district: '',
  state: '',
  pin: '',
  contactName: '',
  designation: '',
  email: '',
  mobile: '',
  altPhone: '',
  cea: '',
  gstin: '',
  pan: '',
  drugLicense: '',
};

export default function RegisterScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Form>(initialForm);
  const [docs, setDocs] = useState<string[]>([]);

  const reference = useMemo(() => `VX-REG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, []);
  const step1ok = Boolean(form.name && form.street && form.city && form.district && form.state && form.pin);
  const step2ok = Boolean(form.contactName && form.designation && form.email && form.mobile);
  const canSubmit = step1ok && step2ok && requiredDocs.every((doc) => docs.includes(doc));

  const update = (key: keyof Form, value: string) => setForm((next) => ({ ...next, [key]: value }));
  const toggleDoc = (doc: string) => setDocs((items) => items.includes(doc) ? items.filter((item) => item !== doc) : [...items, doc]);
  const goNext = () => {
    if (step === 1 && !step1ok) return;
    if (step === 2 && !step2ok) return;
    if (step < 3) {
      setStep((step + 1) as Step);
      return;
    }
    if (canSubmit) setSubmitted(true);
  };

  const s = makeStyles(theme);

  if (submitted) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.topBar}>
          <Brand />
        </View>
        <View style={s.successWrap}>
          <View style={s.successIcon}>
            <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <Path d="m20 6-11 11-5-5" />
            </Svg>
          </View>
          <Text style={s.successTitle}>Registration submitted</Text>
          <Text style={s.successText}>
            Your hospital registration request was received. Reference {reference}. The onboarding team will review the details and contact {form.contactName || 'your administrator'}.
          </Text>
          <TouchableOpacity style={s.primaryButton} onPress={() => navigation.replace('SignIn')}>
            <Text style={s.primaryButtonText}>Back to sign in</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.topBar}>
        <Brand />
        <TouchableOpacity style={s.backButton} onPress={navigation.goBack}>
          <Text style={s.backButtonText}>Back to sign in</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={s.eyebrowRow}>
          <View style={s.dot} />
          <Text style={s.eyebrow}>New hospital</Text>
        </View>
        <Text style={s.title}>Register your hospital</Text>
        <Text style={s.lede}>Tell us about your establishment and upload statutory documents. Our team reviews every submission before activating admin credentials.</Text>
        <View style={s.stepper}>
          {[1, 2, 3].map((value) => {
            const active = step === value;
            return (
              <TouchableOpacity key={value} style={[s.stepPill, active && s.stepPillActive]} onPress={() => setStep(value as Step)}>
                <Text style={[s.stepText, active && s.stepTextActive]}>{value === 1 ? 'Hospital' : value === 2 ? 'Contact' : 'License'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={s.card}>
          {step === 1 ? (
            <>
              <SectionTitle title="Hospital details" />
              <Input label="Legal hospital / clinic name" value={form.name} onChangeText={(value) => update('name', value)} placeholder="Apollo Multispecialty" styles={s} />
              <Text style={s.label}>Facility Type</Text>
              <View style={s.optionGrid}>
                {facilityTypes.map((type) => (
                  <TouchableOpacity key={type} style={[s.option, form.facilityType === type && s.optionActive]} onPress={() => update('facilityType', type)}>
                    <Text style={[s.optionText, form.facilityType === type && s.optionTextActive]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Input label="Number of beds" value={form.beds} onChangeText={(value) => update('beds', value)} placeholder="120" styles={s} keyboardType="number-pad" />
              <Input label="Street address" value={form.street} onChangeText={(value) => update('street', value)} placeholder="Road, area, landmark" styles={s} />
              <Input label="City" value={form.city} onChangeText={(value) => update('city', value)} placeholder="Hyderabad" styles={s} />
              <Input label="District" value={form.district} onChangeText={(value) => update('district', value)} placeholder="Rangareddy" styles={s} />
              <Input label="State / UT" value={form.state} onChangeText={(value) => update('state', value)} placeholder="Telangana" styles={s} />
              <Input label="PIN code" value={form.pin} onChangeText={(value) => update('pin', value)} placeholder="500001" styles={s} keyboardType="number-pad" />
            </>
          ) : null}
          {step === 2 ? (
            <>
              <SectionTitle title="Primary contact" />
              <Input label="Contact person" value={form.contactName} onChangeText={(value) => update('contactName', value)} placeholder="Anita Reddy" styles={s} />
              <Input label="Designation" value={form.designation} onChangeText={(value) => update('designation', value)} placeholder="Administrator" styles={s} />
              <Input label="Work email" value={form.email} onChangeText={(value) => update('email', value)} placeholder="admin@hospital.com" styles={s} keyboardType="email-address" />
              <Input label="Mobile number" value={form.mobile} onChangeText={(value) => update('mobile', value)} placeholder="+91 98765 43210" styles={s} keyboardType="phone-pad" />
              <Input label="Alternate phone" value={form.altPhone} onChangeText={(value) => update('altPhone', value)} placeholder="+91 ..." styles={s} keyboardType="phone-pad" />
            </>
          ) : null}
          {step === 3 ? (
            <>
              <SectionTitle title="Licenses and documents" />
              <Input label="CEA registration number" value={form.cea} onChangeText={(value) => update('cea', value)} placeholder="CEA/TG/..." styles={s} />
              <Input label="GSTIN" value={form.gstin} onChangeText={(value) => update('gstin', value)} placeholder="36AAAAA0000A1Z5" styles={s} />
              <Input label="PAN" value={form.pan} onChangeText={(value) => update('pan', value)} placeholder="ABCDE1234F" styles={s} />
              <Input label="Drug license number" value={form.drugLicense} onChangeText={(value) => update('drugLicense', value)} placeholder="DL-..." styles={s} />
              <Text style={s.label}>Document checklist</Text>
              {requiredDocs.map((doc) => {
                const active = docs.includes(doc);
                return (
                  <TouchableOpacity key={doc} style={[s.docRow, active && s.docRowActive]} onPress={() => toggleDoc(doc)}>
                    <Text style={[s.docMark, active && s.docMarkActive]}>{active ? 'UPLOADED' : 'ADD'}</Text>
                    <Text style={[s.docText, active && s.docTextActive]}>{doc}</Text>
                  </TouchableOpacity>
                );
              })}
              <Text style={s.note}>In this Expo preview, tapping a document marks it as uploaded. Real file upload will connect when backend storage is added.</Text>
            </>
          ) : null}
        </View>
        <View style={s.footer}>
          <Text style={s.progress}>Step {step} of 3</Text>
          <View style={s.actions}>
            <TouchableOpacity style={[s.secondaryButton, step === 1 && s.disabled]} disabled={step === 1} onPress={() => setStep((step - 1) as Step)}>
              <Text style={s.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.primaryButton, ((step === 1 && !step1ok) || (step === 2 && !step2ok) || (step === 3 && !canSubmit)) && s.disabled]}
              disabled={(step === 1 && !step1ok) || (step === 2 && !step2ok) || (step === 3 && !canSubmit)}
              onPress={goNext}
            >
              <Text style={s.primaryButtonText}>{step === 3 ? 'Submit registration' : 'Continue'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Brand() {
  return (
    <View style={base.brandRow}>
      <View style={base.brandMark}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2}>
          <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </Svg>
      </View>
      <View>
        <Text style={base.brandText}>Vexoo</Text>
        <Text style={base.brandSub}>Hospital registration</Text>
      </View>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text style={base.sectionTitle}>{title}</Text>;
}

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  styles,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  styles: ReturnType<typeof makeStyles>;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        style={styles.input}
      />
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    safe: { backgroundColor: theme.bg, flex: 1 },
    topBar: { alignItems: 'center', backgroundColor: palette.ink, flexDirection: 'row', justifyContent: 'space-between', padding: spacing.xxl },
    backButton: { borderColor: 'rgba(255,255,255,0.24)', borderRadius: radius.md, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    backButtonText: { color: '#fff', fontSize: fontSize.sm, fontWeight: fontWeight.bold },
    content: { padding: spacing.xxl, paddingBottom: spacing.xxxl },
    eyebrowRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
    dot: { backgroundColor: palette.primary, borderRadius: radius.pill, height: 8, width: 8 },
    eyebrow: { color: theme.textMuted, fontSize: fontSize.xs, fontWeight: fontWeight.heavy, textTransform: 'uppercase' },
    title: { color: theme.text, fontSize: fontSize.h2, fontWeight: fontWeight.heavy, marginTop: spacing.sm },
    lede: { color: theme.textMuted, fontSize: fontSize.md, lineHeight: 21, marginTop: spacing.sm },
    stepper: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
    stepPill: { borderColor: theme.border, borderRadius: radius.pill, borderWidth: 1, flex: 1, paddingVertical: spacing.sm },
    stepPillActive: { backgroundColor: palette.primary, borderColor: palette.primary },
    stepText: { color: theme.textMuted, fontSize: fontSize.xs, fontWeight: fontWeight.bold, textAlign: 'center' },
    stepTextActive: { color: '#fff' },
    card: { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radius.xl, borderWidth: 1, marginTop: spacing.lg, padding: spacing.lg },
    label: { color: theme.textMuted, fontSize: fontSize.xs, fontWeight: fontWeight.heavy, marginBottom: spacing.xs, marginTop: spacing.md, textTransform: 'uppercase' },
    inputWrap: { marginBottom: spacing.xs },
    input: { backgroundColor: theme.bg, borderColor: theme.border, borderRadius: radius.lg, borderWidth: 1, color: theme.text, fontSize: fontSize.md, minHeight: 46, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    optionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
    option: { borderColor: theme.border, borderRadius: radius.lg, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
    optionActive: { backgroundColor: palette.primaryLight, borderColor: palette.primary },
    optionText: { color: theme.textMuted, fontSize: fontSize.sm, fontWeight: fontWeight.bold },
    optionTextActive: { color: palette.primary },
    docRow: { alignItems: 'center', borderColor: theme.border, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm, minHeight: 48, paddingHorizontal: spacing.md },
    docRowActive: { backgroundColor: palette.primaryLight, borderColor: palette.primary },
    docMark: { color: theme.textMuted, fontSize: fontSize.xxs, fontWeight: fontWeight.heavy, minWidth: 64 },
    docMarkActive: { color: palette.primary },
    docText: { color: theme.text, flex: 1, fontSize: fontSize.sm, fontWeight: fontWeight.bold },
    docTextActive: { color: palette.primary },
    note: { color: theme.textMuted, fontSize: fontSize.sm, lineHeight: 19, marginTop: spacing.sm },
    footer: { marginTop: spacing.lg },
    progress: { color: theme.textMuted, fontSize: fontSize.sm, fontWeight: fontWeight.bold, marginBottom: spacing.md },
    actions: { flexDirection: 'row', gap: spacing.md },
    primaryButton: { alignItems: 'center', backgroundColor: palette.primary, borderRadius: radius.md, flex: 1, justifyContent: 'center', minHeight: 46, paddingHorizontal: spacing.md },
    primaryButtonText: { color: '#fff', fontSize: fontSize.sm, fontWeight: fontWeight.heavy },
    secondaryButton: { alignItems: 'center', backgroundColor: theme.card, borderColor: theme.border, borderRadius: radius.md, borderWidth: 1, flex: 1, justifyContent: 'center', minHeight: 46, paddingHorizontal: spacing.md },
    secondaryButtonText: { color: theme.text, fontSize: fontSize.sm, fontWeight: fontWeight.heavy },
    disabled: { opacity: 0.44 },
    successWrap: { flex: 1, justifyContent: 'center', padding: spacing.xxl },
    successIcon: { alignItems: 'center', alignSelf: 'center', backgroundColor: palette.primary, borderRadius: radius.pill, height: 72, justifyContent: 'center', width: 72 },
    successTitle: { color: theme.text, fontSize: fontSize.h2, fontWeight: fontWeight.heavy, marginTop: spacing.xl, textAlign: 'center' },
    successText: { color: theme.textMuted, fontSize: fontSize.md, lineHeight: 22, marginBottom: spacing.xl, marginTop: spacing.md, textAlign: 'center' },
  });
}

const base = StyleSheet.create({
  brandRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  brandMark: { alignItems: 'center', backgroundColor: palette.primary, borderRadius: radius.md, height: 38, justifyContent: 'center', width: 38 },
  brandText: { color: '#fff', fontSize: fontSize.xl, fontWeight: fontWeight.heavy },
  brandSub: { color: 'rgba(255,255,255,0.68)', fontSize: fontSize.xs, marginTop: 1 },
  sectionTitle: { color: palette.text, fontSize: fontSize.lg, fontWeight: fontWeight.heavy, marginBottom: spacing.sm },
});
