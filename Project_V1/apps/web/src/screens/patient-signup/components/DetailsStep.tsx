/**
 * DetailsStep.tsx — second step: the mandatory patient profile.
 *
 *  Contact (phone), Address (street / city / district / state / PIN), the
 *  patient's own Aadhar, then a "Family members" toggle. When ON, a relation
 *  multi-select appears; for each chosen relation the matching detail cards are
 *  grouped below, and "multiple" relations (Children / In-laws) get an
 *  "Add another" button so several members can be captured.
 *
 *  This component is presentational — all state lives in the orchestrator and
 *  is threaded in via props, keeping a single source of truth.
 */
import React from 'react';
import { Icon } from '../shared/Icon';
import { RelationMultiSelect } from './RelationMultiSelect';
import { FamilyMemberCard } from './FamilyMemberCard';
import { RELATIONS, STATES } from '../data/patientSignupOptions';
import type {
  FamilyMember,
  FieldSetter,
  RelationId,
  SignupForm,
} from '../types/patientSignup.types';

export const DetailsStep: React.FC<{
  form: SignupForm;
  set: FieldSetter;
  patientId: string;
  familyOn: boolean;
  onFamilyToggle: () => void;
  relations: RelationId[];
  onToggleRelation: (id: RelationId) => void;
  onRemoveRelation: (id: RelationId) => void;
  members: FamilyMember[];
  onMemberField: (key: string, field: keyof FamilyMember, value: string) => void;
  onAddMember: (relation: RelationId) => void;
  onRemoveMember: (key: string) => void;
}> = ({
  form, set, patientId,
  familyOn, onFamilyToggle,
  relations, onToggleRelation, onRemoveRelation,
  members, onMemberField, onAddMember, onRemoveMember,
}) => (
  <div className="vxpat-body">
    {/* identity recap */}
    <h3 className="vxpat-sec">Your details</h3>
    <div className="vxpat-2">
      <div>
        <div className="vxpat-lbl">Full name</div>
        <input className="vxpat-inp" value={form.fullName || ''} onChange={set('fullName')} />
      </div>
      <div>
        <div className="vxpat-lbl">Email</div>
        <input className="vxpat-inp" value={form.email || ''} onChange={set('email')} />
      </div>
    </div>

    <div className="vxpat-2">
      <div>
        <div className="vxpat-lbl">Phone <span className="req">*</span></div>
        <input
          className="vxpat-inp vxpat-mono"
          placeholder="+91 ‑‑‑‑‑ ‑‑‑‑‑"
          maxLength={14}
          value={form.phone || ''}
          onChange={set('phone')}
        />
      </div>
      <div>
        <div className="vxpat-lbl">Your Aadhar number <span className="req">*</span></div>
        <input
          className="vxpat-inp vxpat-mono"
          placeholder="0000 0000 0000"
          maxLength={14}
          value={form.aadhar || ''}
          onChange={set('aadhar')}
        />
      </div>
    </div>

    {/* address */}
    <h3 className="vxpat-sec">Address</h3>
    <div className="vxpat-f">
      <div className="vxpat-lbl">Street / building <span className="req">*</span></div>
      <textarea
        className="vxpat-ta"
        placeholder="Flat 4B, Road No. 3, Banjara Hills"
        value={form.street || ''}
        onChange={set('street')}
      />
    </div>
    <div className="vxpat-3">
      <div><div className="vxpat-lbl">City <span className="req">*</span></div><input className="vxpat-inp" placeholder="Hyderabad" value={form.city || ''} onChange={set('city')} /></div>
      <div><div className="vxpat-lbl">District</div><input className="vxpat-inp" placeholder="Hyderabad" value={form.district || ''} onChange={set('district')} /></div>
      <div><div className="vxpat-lbl">PIN <span className="req">*</span></div><input className="vxpat-inp vxpat-mono" placeholder="500034" maxLength={6} value={form.pin || ''} onChange={set('pin')} /></div>
    </div>
    <div className="vxpat-f">
      <div className="vxpat-lbl">State / UT <span className="req">*</span></div>
      <select className="vxpat-sel" value={form.state || ''} onChange={set('state')}>
        <option value="">Select state…</option>
        {STATES.map((s) => <option key={s}>{s}</option>)}
      </select>
    </div>

    {/* family */}
    <h3 className="vxpat-sec">Family members</h3>
    <div className="vxpat-toggle">
      <div className="vxpat-toggle-tx">
        <div className="vxpat-toggle-h">Add family members</div>
        <div className="vxpat-toggle-s">Link relatives so they share your hospital record and bookings.</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={familyOn}
        className={'vxpat-switch' + (familyOn ? ' on' : '')}
        onClick={onFamilyToggle}
      />
    </div>

    {familyOn && (
      <>
        <div className="vxpat-f" style={{ marginTop: 14 }}>
          <div className="vxpat-lbl">Relations to add</div>
          <RelationMultiSelect
            selected={relations}
            onToggle={onToggleRelation}
            onRemove={onRemoveRelation}
          />
          <div className="vxpat-help">Pick one or more. Children and In-laws can have several members.</div>
        </div>

        {RELATIONS.filter((r) => relations.includes(r.id)).map((r) => {
          const group = members.filter((m) => m.relation === r.id);
          return (
            <div className="vxpat-fam-group" key={r.id}>
              <div className="vxpat-fam-grouphead">
                {r.label}
                <span className="pill">{group.length}</span>
              </div>
              {group.map((m, i) => (
                <FamilyMemberCard
                  key={m.key}
                  member={m}
                  relationLabel={r.label}
                  index={i + 1}
                  showIndex={r.multiple}
                  canRemove={r.multiple ? group.length > 1 : false}
                  onField={(field, value) => onMemberField(m.key, field, value)}
                  onRemove={() => onRemoveMember(m.key)}
                />
              ))}
              {r.multiple && (
                <button type="button" className="vxpat-fam-add" onClick={() => onAddMember(r.id)}>
                  <Icon d="M12 5v14M5 12h14" size={15} /> Add another {r.singular || r.label.toLowerCase()}
                </button>
              )}
            </div>
          );
        })}
      </>
    )}

    {/* auto-generated id */}
    <div className="vxpat-idchip">
      <Icon d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={14} />
      Your Patient ID&nbsp;·&nbsp;<span className="v">{patientId}</span>
    </div>
  </div>
);
