// ============================================================================
//  useElapsed.ts — live "Xm Ys" wait-timer hook, mirrors the Reception
//  portal's QueueManagement timer so wait times tick identically.
// ============================================================================
import { useState, useEffect } from 'react';

export function useElapsed(startedAt: number | undefined, active: boolean): string {
  const [t, setT] = useState('—');
  useEffect(() => {
    if (!active || !startedAt) { setT('—'); return; }
    const tick = () => {
      const s = Math.floor((Date.now() - startedAt) / 1000);
      setT(`${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt, active]);
  return t;
}
