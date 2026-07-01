/**
 * ApprovalDetail.tsx — full registration detail for an item in the agent's
 * personal queue, with the action bar: Reject · Need additional info ·
 * Approve & create. Items that are NOT in the agent's queue are shown read-only
 * with a lock notice (you must accept a registration before you can act on it).
 */
import React, { useMemo } from 'react';
import { buildDetail, stateName } from '../data/mockData';
import { MiniBadge } from '../shared/Badges';
import { Icon } from '../shared/Icons';
import { RegistrationDetail } from '../shared/RegistrationDetail';
import { useApprovals } from '../shared/approvalsStore';
import type { RegStatus } from '../types/admin.types';

const STATUS_BADGE: Record<RegStatus, { cls: string; label: string }> = {
  'open':               { cls: 'b-open',     label: 'Open' },
  'overdue':            { cls: 'b-overdue',  label: 'Overdue' },
  'pending':            { cls: 'b-pending',  label: 'Pending' },
  'needs-info':         { cls: 'b-onboarding', label: 'Needs info' },
  'in-review':          { cls: 'b-active',   label: 'In review' },
  'awaiting-applicant': { cls: 'b-pending',  label: 'Awaiting applicant' },
  'approved':           { cls: 'b-active',   label: 'Approved' },
  'rejected':           { cls: 'b-suspended', label: 'Rejected' },
};

export const ApprovalDetail: React.FC<{
  registrationId: string;
  onBack: () => void;
  onApproved: (name: string) => void;   // open the credentials modal
}> = ({ registrationId, onBack, onApproved }) => {
  const store = useApprovals();
  const reg = store.byId(registrationId);

  const detail = useMemo(
    () => (reg ? buildDetail({ name: reg.name, regNo: reg.regNo, city: reg.city, state: reg.state, contact: reg.contact, email: reg.email, phone: reg.phone, plan: reg.plan }) : null),
    [reg],
  );

  if (!reg || !detail) {
    return (
      <section className="view">
        <div className="placeholder"><h3>Registration not found</h3><p>This registration has been closed or removed from the queue.</p></div>
      </section>
    );
  }

  const mineActionable = reg.queue === 'mine' && reg.status !== 'approved' && reg.status !== 'rejected';
  const sb = STATUS_BADGE[reg.status];

  const note = reg.queue === 'mine'
    ? (reg.status === 'approved'
        ? <><b>Approved.</b> Admin credentials were generated and the application login links emailed to {reg.email}.</>
        : reg.status === 'rejected'
          ? <><b>Rejected.</b> The applicant has been notified that this registration was not approved.</>
          : <><b>In your queue.</b> You can review the submission below, then approve &amp; create the tenant, reject it, or ask the applicant for more information.</>)
    : <><Icon.SignOut size={13} /> <b>Locked.</b> {reg.owner ?? 'Another agent'} has this registration in their personal queue. Accept it from the shared queue first to take any action.</>;

  const actions = mineActionable ? (
    <>
      <div className="detail-actionbar-meta">
        Submitted {reg.submitted}{reg.accepted ? ` · accepted ${reg.accepted}` : ''}
      </div>
      <div className="detail-actionbar-btns">
        <button className="btn btn-danger-ghost" onClick={() => store.reject(reg.id)}>
          <Icon.Close size={14} /> Reject
        </button>
        <button className="btn btn-ghost" onClick={() => store.needInfo(reg.id)}>
          <Icon.Mail size={14} /> Need additional info
        </button>
        <button className="btn btn-primary" onClick={() => { store.approve(reg.id); onApproved(reg.name); }}>
          <Icon.Check size={13} strokeWidth={3} /> Approve &amp; create
        </button>
      </div>
    </>
  ) : undefined;

  return (
    <RegistrationDetail
      detail={detail}
      mark={reg.mark}
      accent={reg.accent}
      name={reg.name}
      regNo={`${reg.id} · ${reg.regNo}`}
      status={<MiniBadge cls={sb.cls} label={sb.label} />}
      backLabel={reg.queue === 'mine' ? 'My approval queue' : 'All approvals queue'}
      onBack={onBack}
      note={<span className="detail-note-inner">{note}</span>}
      actions={actions}
    />
  );
};
