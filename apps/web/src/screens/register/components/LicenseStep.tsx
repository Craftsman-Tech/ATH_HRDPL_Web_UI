/**
 * LicenseStep.tsx — Step 3: Indian statutory registrations (CEA, Drug License,
 * BMW, Fire NOC, NABH/NABL, PCPNDT) plus the document-upload checklist.
 */
import React from 'react';
import { DOCS, NABH_OPTIONS } from '../data/registerOptions';
import { Icon } from '../shared/Icon';
import { UploadTile } from './UploadTile';
import type { DocId, StepProps, UploadedFiles } from '../types/register.types';

export const LicenseStep: React.FC<StepProps & {
  files: UploadedFiles;
  onPick: (id: DocId, name: string) => void;
  onClear: (id: DocId) => void;
}> = ({ form, set, files, onPick, onClear }) => (
  <>
    <h3 className="vxreg-sec">Statutory registrations</h3>

    <div className="vxreg-2">
      <div><div className="vxreg-lbl">Clinical Establishments Act (CEA) No.</div><input className="vxreg-inp vxreg-mono" placeholder="CEA/TS/HYD/2024/01182" value={form.cea || ''} onChange={set('cea')} /></div>
      <div><div className="vxreg-lbl">CEA valid until</div><input className="vxreg-inp" type="date" value={form.ceaExp || ''} onChange={set('ceaExp')} /></div>
    </div>

    <div className="vxreg-2">
      <div><div className="vxreg-lbl">Drug license (Form 20/21)</div><input className="vxreg-inp vxreg-mono" placeholder="20B-AP-HYD/14782" value={form.drug || ''} onChange={set('drug')} /></div>
      <div><div className="vxreg-lbl">Drug license valid until</div><input className="vxreg-inp" type="date" value={form.drugExp || ''} onChange={set('drugExp')} /></div>
    </div>

    <div className="vxreg-2">
      <div><div className="vxreg-lbl">Bio-medical waste authorisation</div><input className="vxreg-inp vxreg-mono" placeholder="BMW/TSPCB/2024/4421" value={form.bmw || ''} onChange={set('bmw')} /></div>
      <div><div className="vxreg-lbl">Fire safety NOC No.</div><input className="vxreg-inp vxreg-mono" placeholder="FNOC/GHMC/2024/0931" value={form.fire || ''} onChange={set('fire')} /></div>
    </div>

    <div className="vxreg-2">
      <div>
        <div className="vxreg-lbl">NABH / NABL accreditation</div>
        <select className="vxreg-sel" value={form.nabh || ''} onChange={set('nabh')}>
          {NABH_OPTIONS.map((n) => <option key={n}>{n}</option>)}
        </select>
      </div>
      <div><div className="vxreg-lbl">PCPNDT registration (if applicable)</div><input className="vxreg-inp vxreg-mono" placeholder="PNDT/TS/2024/2210" value={form.pndt || ''} onChange={set('pndt')} /></div>
    </div>

    <h3 className="vxreg-sec">Document uploads</h3>
    {DOCS.map((d) => (
      <UploadTile key={d.id} doc={d} filename={files[d.id]} onPick={onPick} onClear={onClear} />
    ))}

    <div className="vxreg-note">
      <Icon d="M12 16v-4 M12 8h.01 M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" size={15} />
      <div>
        Documents marked <b>*</b> are required. On submit, your registration enters the Vexoo onboarding
        queue for verification — nothing is activated until our team approves it.
      </div>
    </div>
  </>
);
