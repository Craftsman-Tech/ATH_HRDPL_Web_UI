/**
 * Approvals.tsx — multi-agent approval workflow.
 * ----------------------------------------------------------------------------
 *  Two tabs:
 *   • All approvals queue — the shared queue every agent sees. It lists ONLY the
 *     hospitals that are still unclaimed, with status "Open" or "Overdue", each
 *     with an "Accept" button (→ moves the hospital into the agent's personal
 *     queue and flips its status to "In review"). A hospital that another agent
 *     has already accepted into their personal queue does NOT appear here.
 *     No status sub-filters — the queue is the queue.
 *   • My approval queue — registrations this agent has accepted. Each row opens
 *     the full detail (click the card). The Action column is an ellipsis menu
 *     whose single item, "Release", sends the hospital back to the All queue
 *     with its original status restored ("Open" → Open, "Overdue" → Overdue).
 *     No status sub-filters.
 *
 * Queue state is owned by shared/approvalsStore.tsx (live, in-session).
 */
import React, { useEffect, useRef, useState } from 'react';
import { useApprovals } from '../shared/approvalsStore';
import { stateName, FOUNDER } from '../data/mockData';
import { MiniBadge, PlanPill } from '../shared/Badges';
import { Icon } from '../shared/Icons';
import { initials } from '../shared/initials';
import type { Registration, RegStatus } from '../types/admin.types';

const BADGE: Record<RegStatus, { cls: string; label: string }> = {
  'open':               { cls: 'b-open',     label: 'Open' },
  'overdue':            { cls: 'b-overdue',  label: 'Overdue' },
  'pending':            { cls: 'b-pending',  label: 'Pending' },
  'needs-info':         { cls: 'b-onboarding', label: 'Needs info' },
  'in-review':          { cls: 'b-active',   label: 'In review' },
  'awaiting-applicant': { cls: 'b-pending',  label: 'Awaiting applicant' },
  'approved':           { cls: 'b-active',   label: 'Approved' },
  'rejected':           { cls: 'b-suspended', label: 'Rejected' },
};
const Status = ({ s }: { s: RegStatus }) => <MiniBadge cls={BADGE[s].cls} label={BADGE[s].label} />;

const HospCell = ({ r }: { r: Registration }) => (
  <div className="hosp-cell">
    <div className="hosp-mark" style={{ background: r.accent }}>{r.mark}</div>
    <div>
      <div className="hosp-name">{r.name}</div>
      <div className="hosp-id mono">{r.id} · {r.regNo}</div>
    </div>
  </div>
);
const LocCell = ({ r }: { r: Registration }) => (
  <td><div style={{ fontSize: 13, color: 'var(--ink-800)' }}>{r.city}</div><div className="meta-line">{stateName(r.state)}</div></td>
);

/* Row action menu (ellipsis → Release). Rendered as a fixed-position popover so
 * the table-wrap's `overflow:hidden` cannot clip it. */
const RowMenu: React.FC<{ onRelease: () => void }> = ({ onRelease }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const el = btnRef.current;
    if (el) {
      const b = el.getBoundingClientRect();
      setPos({ top: b.bottom + 6, right: window.innerWidth - b.right });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    window.addEventListener('click', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      window.removeEventListener('click', close);
    };
  }, [open]);

  return (
    <>
      <button ref={btnRef} className={`row-menu-btn ${open ? 'open' : ''}`} title="Actions" onClick={e => { e.stopPropagation(); toggle(); }}>
        <Icon.More size={15} />
      </button>
      {open && (
        <div className="row-menu" style={{ top: pos.top, right: pos.right }} onClick={e => e.stopPropagation()}>
          <button className="row-menu-item" onClick={() => { setOpen(false); onRelease(); }}>
            <Icon.SignOut size={14} /> Release
          </button>
        </div>
      )}
    </>
  );
};

type Tab = 'mine' | 'all';

export const Approvals: React.FC<{ onOpen: (id: string) => void }> = ({ onOpen }) => {
  const store = useApprovals();
  const [tab, setTab] = useState<Tab>('all');

  return (
    <section className="view">
      {/* queue tabs */}
      <div className="queue-tabs">
        <button className={`queue-tab ${tab === 'mine' ? 'active' : ''}`} onClick={() => setTab('mine')}>
          My approval queue <span className="count">{store.mine.length}</span>
        </button>
        <button className={`queue-tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
          All approvals queue <span className="count">{store.acceptableCount}</span>
        </button>
      </div>

      {tab === 'all' ? (
        <>
          <div className="toolbar">
            <span className="queue-count-label">Open &amp; overdue registrations · <b>{store.shared.length}</b></span>
            <div className="toolbar-spacer" />
            <span className="queue-meta"><Icon.Activity size={13} /> Shared across all agents · live</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Hospital</th><th>Location</th><th>Contact</th><th>Plan</th><th>Status</th><th>Submitted</th><th style={{ width: 120, textAlign: 'right' }}>Action</th></tr>
              </thead>
              <tbody>
                {store.shared.length === 0 && <tr className="empty-row"><td colSpan={7}>Nothing in the shared queue right now.</td></tr>}
                {store.shared.map(r => (
                  <tr key={r.id} className="no-pointer">
                    <td><HospCell r={r} /></td>
                    <LocCell r={r} />
                    <td><div style={{ fontSize: 13, color: 'var(--ink-800)', fontWeight: 500 }}>{r.contact}</div><div className="meta-line mono">{r.phone}</div></td>
                    <td><PlanPill plan={r.plan} /></td>
                    <td><Status s={r.status} /></td>
                    <td><span className="meta-line">{r.submitted}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => store.accept(r.id)}>
                        <Icon.Plus size={13} /> Accept
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="queue-foot"><Icon.Activity size={13} /> Accept a hospital to move it into <b>your</b> approval queue. Its status changes to <b>In review</b> and it leaves this shared list for everyone.</p>
        </>
      ) : (
        <>
          <div className="toolbar">
            <span className="queue-count-label">Accepted by you · <b>{store.mine.length}</b></span>
            <div className="toolbar-spacer" />
            <span className="queue-agent"><span className="owner-av" style={{ background: 'var(--mineral-700)' }}>{initials(FOUNDER.name)}</span> {FOUNDER.name}</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Hospital</th><th>Location</th><th>Plan</th><th>Status</th><th>Accepted</th><th style={{ width: 90, textAlign: 'right' }}>Action</th></tr>
              </thead>
              <tbody>
                {store.mine.length === 0 && <tr className="empty-row"><td colSpan={6}>Your queue is empty — accept a hospital from the shared queue to start.</td></tr>}
                {store.mine.map(r => (
                  <tr key={r.id} onClick={() => onOpen(r.id)}>
                    <td><HospCell r={r} /></td>
                    <LocCell r={r} />
                    <td><PlanPill plan={r.plan} /></td>
                    <td><Status s={r.status} /></td>
                    <td><span className="meta-line">{r.accepted ?? '—'}</span></td>
                    <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      <RowMenu onRelease={() => store.release(r.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="queue-foot"><Icon.SignOut size={13} /> Click a hospital to open its full registration detail. Use the <b>⋯</b> menu to <b>Release</b> it back to the shared queue — its original status (Open or Overdue) is restored.</p>
        </>
      )}
    </section>
  );
};
