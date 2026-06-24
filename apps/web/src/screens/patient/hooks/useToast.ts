// ============================================================================
//  useToast.ts
//  Lightweight toast notification hook.
//  Returns { toast(msg), el } — render el somewhere near the root.
// ============================================================================
import React, { useState, useCallback, useRef } from 'react';
import Icon from '../shared/Icon';

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((m: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMsg(m);
    timer.current = setTimeout(() => setMsg(null), 2600);
  }, []);

  const el = msg
    ? React.createElement('div', {
        style: {
          position: 'fixed', top: 22, left: '50%', transform: 'translateX(-50%)',
          zIndex: 400, background: '#16201e', color: '#fff',
          padding: '12px 20px', borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 13.5, fontWeight: 600,
          boxShadow: '0 12px 32px rgba(0,0,0,.25)',
        },
      },
      React.createElement('span', { style: { color: '#5fe0d0', display: 'grid', placeItems: 'center' } },
        React.createElement(Icon, { name: 'check', size: 16 })
      ),
      msg
    )
    : null;

  return { toast, el };
}
