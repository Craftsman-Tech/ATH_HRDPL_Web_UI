/**
 * RelationMultiSelect.tsx — multi-select for family relations.
 *
 * Selected options render as removable chips INSIDE the control (per the
 * design); the dropdown lists every relation with a checkbox state. Closing is
 * handled by an outside-click listener. Dependency-free.
 */
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../shared/Icon';
import { RELATIONS } from '../data/patientSignupOptions';
import type { RelationId } from '../types/patientSignup.types';

export const RelationMultiSelect: React.FC<{
  selected: RelationId[];
  onToggle: (id: RelationId) => void;
  onRemove: (id: RelationId) => void;
}> = ({ selected, onToggle, onRemove }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const label = (id: RelationId) => RELATIONS.find((r) => r.id === id)?.label ?? id;

  return (
    <div className={'vxpat-ms' + (open ? ' open' : '')} ref={ref}>
      <div className="vxpat-ms-control" onClick={() => setOpen((o) => !o)}>
        {selected.length === 0 && <span className="vxpat-ms-ph">Select relations…</span>}
        {selected.map((id) => (
          <span key={id} className="vxpat-ms-chip">
            {label(id)}
            <button
              type="button"
              aria-label={'Remove ' + label(id)}
              onClick={(e) => { e.stopPropagation(); onRemove(id); }}
            >
              <Icon d="M18 6 6 18M6 6l12 12" size={11} sw={2.4} />
            </button>
          </span>
        ))}
        <span className="vxpat-ms-caret"><Icon d="m6 9 6 6 6-6" size={16} /></span>
      </div>

      {open && (
        <div className="vxpat-ms-menu">
          {RELATIONS.map((r) => {
            const on = selected.includes(r.id);
            return (
              <div
                key={r.id}
                className={'vxpat-ms-opt' + (on ? ' sel' : '')}
                onClick={() => onToggle(r.id)}
              >
                <span className="vxpat-ms-box">
                  {on && <Icon d="m20 6-11 11-5-5" size={12} sw={3} />}
                </span>
                {r.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
