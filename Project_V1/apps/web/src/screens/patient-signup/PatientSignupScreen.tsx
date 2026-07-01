/**
 * ============================================================================
 *  PatientSignupScreen.tsx — public patient sign-up (root orchestrator)
 * ============================================================================
 *  Route: /patient/signup  (PUBLIC — a new patient has no account yet)
 *  Reached from Sign-In via "New Patient? Sign Up".
 *
 *  Flow:
 *    1 Method   — Sign up using Google (simulated) OR with Email → captures
 *                 name + email and auto-generates the Patient ID.
 *    2 Details  — mandatory profile: phone, address, self Aadhar, plus an
 *                 optional Family-members section (relation multi-select →
 *                 grouped member cards, several allowed for Children/In-laws).
 *    3 Done     — shows the Patient ID and signs the patient into /patient.
 *
 *  Folder layout matches every portal:
 *    components/  MethodStep, DetailsStep, RelationMultiSelect,
 *                 FamilyMemberCard, SignupSuccess
 *    data/        patientSignupOptions (relations, states)
 *    shared/      PatientSignupCSS (scoped .vxpat styles), Icon
 *    types/       patientSignup.types
 *
 *  Self-contained: only React + react-router + useAuth. Styles are scoped under
 *  `.vxpat` via <style>{CSS}</style>, so nothing leaks into/out of any portal.
 *  TODO(backend): POST the assembled profile (form + family[]) to the patient
 *  onboarding endpoint; the real Patient ID + account come from that response.
 * ============================================================================
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../components/AuthContext';
import { CSS } from './shared/PatientSignupCSS';
import { Icon } from './shared/Icon';
import { RELATIONS } from './data/patientSignupOptions';

import { MethodStep } from './components/MethodStep';
import { DetailsStep } from './components/DetailsStep';
import { SignupSuccess } from './components/SignupSuccess';

import type {
  FamilyMember,
  RelationId,
  SignupForm,
  SignupStage,
} from './types/patientSignup.types';

const genId = () => 'VX-PT-' + Math.random().toString(36).slice(2, 8).toUpperCase();
const rowKey = () => Math.random().toString(36).slice(2, 9);

export default function PatientSignupScreen() {
  const nav = useNavigate();
  const { signUpPatient } = useAuth();

  const [stage, setStage] = useState<SignupStage>('method');
  const [form, setForm] = useState<SignupForm>({});
  const [familyOn, setFamilyOn] = useState(false);
  const [relations, setRelations] = useState<RelationId[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);

  // Auto-generated once — simulates the backend issuing the Patient ID.
  const patientId = useMemo(genId, []);

  // set('phone') -> onChange handler (input / select / textarea).
  const set =
    (key: keyof SignupForm) =>
    (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  // Load Vexoo fonts so a direct /patient/signup visit renders the type family.
  useEffect(() => {
    const id = 'vexoo-patient-signup-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  // Step 1 → 2: store identity from Google / Email.
  const onIdentity = (fullName: string, email: string) => {
    setForm((f) => ({ ...f, fullName, email }));
    setStage('details');
  };

  // ── family state helpers ──────────────────────────────────────────────────
  const toggleFamily = () => {
    setFamilyOn((on) => {
      if (on) { setRelations([]); setMembers([]); }  // turning off clears the section
      return !on;
    });
  };

  const toggleRelation = (id: RelationId) => {
    setRelations((rs) => {
      if (rs.includes(id)) {
        setMembers((ms) => ms.filter((m) => m.relation !== id));
        return rs.filter((r) => r !== id);
      }
      setMembers((ms) => [...ms, { key: rowKey(), relation: id }]);
      return [...rs, id];
    });
  };

  const removeRelation = (id: RelationId) => {
    setRelations((rs) => rs.filter((r) => r !== id));
    setMembers((ms) => ms.filter((m) => m.relation !== id));
  };

  const addMember = (relation: RelationId) =>
    setMembers((ms) => [...ms, { key: rowKey(), relation }]);

  const removeMember = (key: string) =>
    setMembers((ms) => ms.filter((m) => m.key !== key));

  const memberField = (key: string, field: keyof FamilyMember, value: string) =>
    setMembers((ms) => ms.map((m) => (m.key === key ? { ...m, [field]: value } : m)));

  // ── validation ────────────────────────────────────────────────────────────
  const canSubmit = useMemo(() => {
    const core = !!(form.phone && form.aadhar && form.street && form.city && form.pin && form.state);
    const familyOk = !familyOn || members.every((m) => (m.name || '').trim().length > 0);
    return core && familyOk;
  }, [form, familyOn, members]);

  const submit = () => {
    if (!canSubmit) return;
    // TODO(backend): POST { ...form, patientId, family: members } to the patient
    // onboarding endpoint; the response confirms the account + real Patient ID.
    setStage('done');
  };

  const continueToPortal = () => {
    signUpPatient(form.fullName || 'Patient', form.email || '', patientId);
    nav('/patient');
  };

  const firstName = (form.fullName || '').split(' ')[0] || '';

  const Bar = (
    <div className="vxpat-bar">
      <div className="vxpat-brand">
        <div className="vxpat-mark"><Icon d="M22 12h-4l-3 9L9 3l-3 9H2" size={18} sw={2.2} /></div>
        <div>
          <div className="vxpat-word">Vexoo<span className="ath">ATH</span></div>
          <div className="vxpat-sub">Patient sign-up</div>
        </div>
      </div>
      {stage !== 'done' && (
        <button className="vxpat-back" onClick={() => (stage === 'details' ? setStage('method') : nav(-1))}>
          <Icon d="M19 12H5M12 19l-7-7 7-7" size={15} /> {stage === 'details' ? 'Back' : 'Back to sign in'}
        </button>
      )}
    </div>
  );

  if (stage === 'done') {
    return (
      <div className="vxpat">
        <style>{CSS}</style>
        {Bar}
        <div className="vxpat-shell">
          <div className="vxpat-card">
            <SignupSuccess
              firstName={firstName}
              patientId={patientId}
              familyCount={members.length}
              onContinue={continueToPortal}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vxpat">
      <style>{CSS}</style>
      {Bar}

      <div className="vxpat-shell">
        <div className="vxpat-eyebrow"><span className="dot" /> New patient</div>
        <h1 className="vxpat-title">
          {stage === 'method' ? <>Create your <em>patient</em> account</> : <>A few <em>details</em> about you</>}
        </h1>
        <p className="vxpat-lede">
          {stage === 'method'
            ? 'Sign up to book appointments, view prescriptions and reports, and manage your family — all in one place.'
            : 'These help clinics identify you and reach you. Add family members now or skip and do it later from your profile.'}
        </p>

        <div className="vxpat-card">
          {stage === 'method' && <MethodStep onIdentity={onIdentity} />}

          {stage === 'details' && (
            <>
              <DetailsStep
                form={form}
                set={set}
                patientId={patientId}
                familyOn={familyOn}
                onFamilyToggle={toggleFamily}
                relations={relations}
                onToggleRelation={toggleRelation}
                onRemoveRelation={removeRelation}
                members={members}
                onMemberField={memberField}
                onAddMember={addMember}
                onRemoveMember={removeMember}
              />
              <div className="vxpat-foot">
                <span className="vxpat-prog">{RELATIONS.length ? 'Step 2 of 2' : ''}</span>
                <div className="vxpat-actions">
                  <button className="vxpat-btn vxpat-btn-ghost" onClick={() => setStage('method')}>Back</button>
                  <button className="vxpat-btn vxpat-btn-primary" disabled={!canSubmit} onClick={submit}>
                    <Icon d="m20 6-11 11-5-5" size={15} sw={2.4} /> Create account
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
