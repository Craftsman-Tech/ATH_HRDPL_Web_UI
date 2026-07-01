/**
 * UploadTile.tsx — a single document upload row backed by a real
 * <input type="file">. Shows the chosen filename and a remove (×) button.
 * Required docs show a red asterisk until a file is attached.
 */
import React from 'react';
import { Icon } from '../shared/Icon';
import type { DocConfig, DocId } from '../types/register.types';

export const UploadTile: React.FC<{
  doc: DocConfig;
  filename?: string;
  onPick: (id: DocId, name: string) => void;
  onClear: (id: DocId) => void;
}> = ({ doc, filename, onPick, onClear }) => {
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.files?.[0]?.name;
    if (name) onPick(doc.id, name);
    e.target.value = ''; // let the same file be picked again after a remove
  };

  return (
    <label className={`vxreg-up ${filename ? 'has' : ''}`}>
      {filename ? (
        <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" size={16} />
      ) : (
        <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" size={16} />
      )}

      <div className="vxreg-up-txt">
        <div className="vxreg-up-name">
          {filename || doc.label}
          {doc.required && !filename ? <span style={{ color: 'var(--signal-red)' }}> *</span> : null}
        </div>
        {filename && <div className="vxreg-help" style={{ marginTop: 1 }}>Attached · ready for review</div>}
      </div>

      {filename ? (
        <span
          className="vxreg-up-x"
          title="Remove"
          onClick={(e) => { e.preventDefault(); onClear(doc.id); }}
        >
          <Icon d="M18 6 6 18M6 6l12 12" size={13} />
        </span>
      ) : (
        <span className="vxreg-up-meta">{doc.meta}</span>
      )}

      <input type="file" accept={doc.accept} style={{ display: 'none' }} onChange={handle} />
    </label>
  );
};
