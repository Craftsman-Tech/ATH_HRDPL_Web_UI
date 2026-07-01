/**
 * FamilyMemberCard.tsx — one family member's detail fields (name, age, phone,
 * Aadhar). The header shows the relation + a per-member index; a Remove button
 * appears when the member can be deleted (always allowed for "multiple"
 * relations like Children / In-laws, and for any extra rows).
 */
import React from 'react';
import { Icon } from '../shared/Icon';
import type { FamilyMember } from '../types/patientSignup.types';

export const FamilyMemberCard: React.FC<{
  member: FamilyMember;
  relationLabel: string;
  index: number;        // 1-based within its relation group
  showIndex: boolean;   // only show "#2" etc. when there can be multiple
  canRemove: boolean;
  onField: (field: keyof FamilyMember, value: string) => void;
  onRemove: () => void;
}> = ({ member, relationLabel, index, showIndex, canRemove, onField, onRemove }) => (
  <div className="vxpat-fam">
    <div className="vxpat-fam-head">
      <div className="vxpat-fam-title">
        {showIndex && <span className="ix">{index}</span>}
        {relationLabel}{showIndex ? ` · ${index}` : ''}
      </div>
      {canRemove && (
        <button type="button" className="vxpat-fam-rm" onClick={onRemove}>
          <Icon d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" size={13} /> Remove
        </button>
      )}
    </div>

    <div className="vxpat-2">
      <div>
        <div className="vxpat-lbl">Full name <span className="req">*</span></div>
        <input
          className="vxpat-inp"
          placeholder={`${relationLabel}'s name`}
          value={member.name || ''}
          onChange={(e) => onField('name', e.target.value)}
        />
      </div>
      <div>
        <div className="vxpat-lbl">Age</div>
        <input
          className="vxpat-inp"
          type="number"
          placeholder="0"
          value={member.age || ''}
          onChange={(e) => onField('age', e.target.value)}
        />
      </div>
    </div>

    <div className="vxpat-2">
      <div>
        <div className="vxpat-lbl">Phone</div>
        <input
          className="vxpat-inp vxpat-mono"
          placeholder="+91 ‑‑‑‑‑ ‑‑‑‑‑"
          maxLength={14}
          value={member.phone || ''}
          onChange={(e) => onField('phone', e.target.value)}
        />
      </div>
      <div>
        <div className="vxpat-lbl">Aadhar number</div>
        <input
          className="vxpat-inp vxpat-mono"
          placeholder="0000 0000 0000"
          maxLength={14}
          value={member.aadhar || ''}
          onChange={(e) => onField('aadhar', e.target.value)}
        />
      </div>
    </div>
  </div>
);
