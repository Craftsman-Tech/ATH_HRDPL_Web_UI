/**
 * approvalsStore.tsx — shared/personal approval-queue state for the support team.
 * ----------------------------------------------------------------------------
 * Models the multi-agent workflow the reference describes: a single shared
 * queue every agent sees, plus each agent's personal queue. Transitions:
 *
 *   accept(id)   shared → mine        (only the acceptor can act on it afterwards)
 *   needInfo(id) mine   → awaiting-applicant
 *   approve(id)  mine   → approved     (caller then issues credentials)
 *   reject(id)   mine   → rejected
 *
 * Seeded from REGISTRATIONS. In-session only (no backend) — TODO(backend): wire
 * accept/approve/reject/need-info to the registrations service so the shared
 * queue stays consistent across the 1000s of concurrent agents.
 */
import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { Registration, RegStatus } from '../types/admin.types';
import { REGISTRATIONS, FOUNDER } from '../data/mockData';

const ME = { name: FOUNDER.name, mark: 'MN' };

type Action =
  | { type: 'accept';   id: string }
  | { type: 'release';  id: string }
  | { type: 'approve';  id: string }
  | { type: 'reject';   id: string }
  | { type: 'needInfo'; id: string }
  | { type: 'reset' };

function patch(list: Registration[], id: string, next: Partial<Registration>): Registration[] {
  return list.map(r => (r.id === id ? { ...r, ...next } : r));
}

function reducer(state: Registration[], action: Action): Registration[] {
  switch (action.type) {
    case 'accept': {
      const r = state.find(x => x.id === action.id);
      // remember the shared-queue status ('open' | 'overdue') so Release can restore it
      const prev = r && (r.status === 'open' || r.status === 'overdue') ? r.status : (r?.prevStatus ?? 'open');
      return patch(state, action.id, {
        queue: 'mine', owner: ME.name, ownerMark: ME.mark,
        status: 'in-review', accepted: 'just now', prevStatus: prev,
      });
    }
    case 'release': {
      const r = state.find(x => x.id === action.id);
      // back to the shared queue with the original status it had before acceptance
      return patch(state, action.id, {
        queue: 'shared', status: (r?.prevStatus ?? 'open'),
        owner: undefined, ownerMark: undefined, ownerAccent: undefined,
        accepted: undefined, prevStatus: undefined,
      });
    }
    case 'approve':  return patch(state, action.id, { status: 'approved' as RegStatus });
    case 'reject':   return patch(state, action.id, { status: 'rejected' as RegStatus });
    case 'needInfo': return patch(state, action.id, { status: 'awaiting-applicant' });
    case 'reset':    return REGISTRATIONS.map(r => ({ ...r }));
    default:         return state;
  }
}

interface Ctx {
  all: Registration[];
  shared: Registration[];   // All approvals queue — ONLY unclaimed rows with status 'open' or 'overdue'
  mine: Registration[];     // My approval queue (non-terminal)
  byId: (id: string) => Registration | undefined;
  acceptableCount: number;  // unclaimed shared rows (drives the badge)
  accept: (id: string) => void;
  release: (id: string) => void;
  approve: (id: string) => void;
  reject: (id: string) => void;
  needInfo: (id: string) => void;
  reset: () => void;
}

const ApprovalsCtx = createContext<Ctx | null>(null);

const NON_TERMINAL = (r: Registration) => r.status !== 'approved' && r.status !== 'rejected';
/** A row is shown in the All approvals queue only while it is unclaimed and open/overdue. */
const IS_ACCEPTABLE = (r: Registration) => r.queue === 'shared' && (r.status === 'open' || r.status === 'overdue');

export const ApprovalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [all, dispatch] = useReducer(reducer, REGISTRATIONS, init => init.map(r => ({ ...r })));

  const value = useMemo<Ctx>(() => {
    const shared = all.filter(IS_ACCEPTABLE);
    const mine = all.filter(r => r.queue === 'mine' && NON_TERMINAL(r));
    return {
      all, shared, mine,
      byId: (id) => all.find(r => r.id === id),
      acceptableCount: shared.length,
      accept:   (id) => dispatch({ type: 'accept', id }),
      release:  (id) => dispatch({ type: 'release', id }),
      approve:  (id) => dispatch({ type: 'approve', id }),
      reject:   (id) => dispatch({ type: 'reject', id }),
      needInfo: (id) => dispatch({ type: 'needInfo', id }),
      reset:    () => dispatch({ type: 'reset' }),
    };
  }, [all]);

  return <ApprovalsCtx.Provider value={value}>{children}</ApprovalsCtx.Provider>;
};

export function useApprovals(): Ctx {
  const ctx = useContext(ApprovalsCtx);
  if (!ctx) throw new Error('useApprovals must be used within <ApprovalsProvider>');
  return ctx;
}
