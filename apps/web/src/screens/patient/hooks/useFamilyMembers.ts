// ============================================================================
//  useFamilyMembers.ts
//  Reactive localStorage store for user-added family members.
//  To connect to a real API: replace loadFM/saveFM with fetch calls and
//  replace the subscription pattern with React Query / SWR / useEffect.
// ============================================================================
import { useState, useEffect } from 'react';
import type { AddedMember } from '../types/patient.types';

const FM_KEY  = 'cura_members_v2';
const _fmSubs = new Set<() => void>();
let _fmCache: AddedMember[] | null = null;

function loadFM(): AddedMember[] {
  if (_fmCache === null) {
    try {
      const a = JSON.parse(localStorage.getItem(FM_KEY) || 'null');
      _fmCache = Array.isArray(a) ? a : [];
    } catch { _fmCache = []; }
  }
  return _fmCache!;
}

function saveFM() {
  localStorage.setItem(FM_KEY, JSON.stringify(_fmCache));
  _fmSubs.forEach(f => f());
}

export function addFM(m: AddedMember) { loadFM().push(m); saveFM(); }
export function removeFM(id: string)   { _fmCache = loadFM().filter(m => m.id !== id); saveFM(); }

export function useFamilyMembers(): AddedMember[] {
  const [, tick] = useState(0);
  useEffect(() => {
    const cb = () => tick(x => x + 1);
    _fmSubs.add(cb);
    return () => { _fmSubs.delete(cb); };
  }, []);
  return loadFM();
}
