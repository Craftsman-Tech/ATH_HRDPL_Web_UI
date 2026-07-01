/**
 * CredentialsModal.tsx — shown after "Generate & activate" in the drawer.
 * Copy buttons use the clipboard; "Download .pdf" builds a real PDF via the
 * dependency-free exportTextPdf helper; "Email to admin" confirms + closes.
 */
import React, { useState } from 'react';
import { Icon } from '../shared/Icons';
import { exportTextPdf } from '../shared/exportPdf';

interface Cred { k: string; v: string; }

export const CredentialsModal: React.FC<{
  hospitalName?: string;
  creds?: Cred[];
  onClose: () => void;
}> = ({
  hospitalName = 'Suvarna Hospital',
  creds = [
    { k: 'Tenant',        v: 'suvarna.vexoo.in' },
    { k: 'Admin email',   v: 'priya@suvarnahospital.in' },
    { k: 'Temp password', v: 'vx-Helix·8204·Quiet' },
    { k: 'Tenant ID',     v: 'VX-T-00129' },
  ],
  onClose,
}) => {
  const [copied, setCopied] = useState<number | null>(null);
  const [emailed, setEmailed] = useState(false);

  const copy = (idx: number, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(idx);
    window.setTimeout(() => setCopied(null), 1400);
  };

  const downloadPdf = () => {
    exportTextPdf(
      'vexoo-credentials',
      `Vexoo — ${hospitalName} admin credentials`,
      [
        'Generated: ' + new Date().toLocaleString('en-IN'),
        '',
        ...creds.map(c => `${c.k}: ${c.v}`),
        '',
        'This temporary password expires in 24 hours.',
        'The admin must set a new password and enable 2FA on first sign-in.',
      ],
    );
  };

  return (
    <div className="modal-back open" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-icon"><Icon.CheckThin size={22} /></div>
        <p className="modal-eyebrow">Tenant activated</p>
        <h2 className="modal-title">{hospitalName} is <em>live</em></h2>
        <p className="modal-sub">
          Generated admin credentials below. Copy or download — Vexoo only stores a hash,
          so this is the last time the password is shown in plaintext.
        </p>

        {creds.map((c, i) => (
          <div className="cred-row" key={c.k}>
            <span className="k">{c.k}</span>
            <span className="v">{c.v}</span>
            <button
              className={`cred-copy ${copied === i ? 'copied' : ''}`}
              onClick={() => copy(i, c.v)}
            >
              {copied === i ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}

        <div className="modal-note">
          <Icon.Warning size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>The temporary password expires in <b>24 hours</b>. The admin will be forced
            to set a new one and enable 2FA on first sign-in.</div>
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-ghost" onClick={downloadPdf}>
            <Icon.Download size={14} /> Download .pdf
          </button>
          <button className="btn btn-primary" onClick={() => { setEmailed(true); window.setTimeout(onClose, 700); }}>
            <Icon.Mail size={14} /> {emailed ? 'Sent ✓' : 'Email to admin'}
          </button>
        </div>
      </div>
    </div>
  );
};
