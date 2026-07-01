/**
 * RegistrationDetail.tsx — full "submitted at registration" detail layout.
 * ----------------------------------------------------------------------------
 * Presentational, reused by:
 *   • HospitalDetail  (read-only — every live tenant)
 *   • ApprovalDetail  (read-only detail + an action bar: Reject / Need info /
 *                      Approve & create — only for items in the agent's queue)
 *
 * Sections mirror the registration form: Hospital details, Contact information,
 * Selected plan, Licenses, and Documents (each downloadable).
 */
import React from 'react';
import type { RegDetail } from '../types/admin.types';
import { Icon } from './Icons';
import { PlanPill } from './Badges';

const KV: React.FC<{ k: string; v: React.ReactNode; mono?: boolean }> = ({ k, v, mono }) => (
  <div className="kv-row">
    <div className="kv-k">{k}</div>
    <div className={`kv-v${mono ? ' mono' : ''}`}>{v}</div>
  </div>
);

export const RegistrationDetail: React.FC<{
  detail: RegDetail;
  mark: string;
  accent: string;
  name: string;
  regNo: string;
  status?: React.ReactNode;     // badge shown next to the title
  backLabel: string;            // e.g. "All hospitals" / "My approval queue"
  onBack: () => void;
  note?: React.ReactNode;       // contextual banner (read-only / locked / etc.)
  actions?: React.ReactNode;    // sticky action bar (approval detail only)
}> = ({ detail, mark, accent, name, regNo, status, backLabel, onBack, note, actions }) => {
  const onDownload = (file: string) => {
    // TODO(backend): stream the stored document. Demo: emit a placeholder file.
    const blob = new Blob([`Vexoo · ${name}\nDocument: ${file}\n(placeholder — wire to storage)`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = file.replace(/\.[a-z]+$/i, '') + '.txt';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="view detail">
      <div className="detail-head">
        <button className="detail-back" onClick={onBack}>
          <Icon.Chevron size={13} strokeWidth={2.5} style={{ transform: 'rotate(90deg)' }} /> {backLabel}
        </button>
        <div className="detail-id">
          <div className="hosp-mark" style={{ background: accent, width: 52, height: 52, fontSize: 21, borderRadius: 11 }}>{mark}</div>
          <div style={{ minWidth: 0 }}>
            <div className="detail-name-row">
              <h1 className="detail-name">{name}</h1>
              {status}
            </div>
            <div className="detail-sub">
              <span className="mono">{regNo}</span> · {detail.city}, {detail.state} · {detail.facilityType}
            </div>
          </div>
        </div>
      </div>

      {note && <div className="detail-note">{note}</div>}

      <div className="detail-grid">
        {/* Hospital details */}
        <div className="detail-card">
          <div className="detail-card-title"><Icon.Hospital size={14} /> Hospital details</div>
          <KV k="Legal name" v={detail.legalName} />
          <KV k="Facility type" v={detail.facilityType} />
          <KV k="Beds" v={String(detail.beds)} />
          <KV k="Established" v={detail.established} />
          <KV k="Address" v={`${detail.addressLine}, ${detail.city} — ${detail.pincode}`} />
          <KV k="State / UT" v={detail.state} />
          <KV k="GSTIN" v={detail.gstin} mono />
          <KV k="PAN" v={detail.pan} mono />
          <KV k="CEA reg. no." v={detail.cea} mono />
        </div>

        {/* Contact information */}
        <div className="detail-card">
          <div className="detail-card-title"><Icon.User size={14} /> Contact information</div>
          <KV k="Hospital admin" v={detail.contactName} />
          <KV k="Designation" v={detail.designation} />
          <KV k="Work email" v={detail.email} />
          <KV k="Phone" v={detail.phone} mono />
          <KV k="Alternate phone" v={detail.altPhone} mono />

          <div className="detail-plan">
            <div className="detail-plan-top">
              <span className="detail-plan-eyebrow">Selected plan</span>
              <PlanPill plan={detail.plan} />
            </div>
            <div className="detail-plan-price">{detail.price}</div>
            <div className="detail-plan-note">{detail.planNote}</div>
            <div className="detail-plan-seats">{detail.seats ? `${detail.seats} staff seats` : 'Unlimited staff seats'}</div>
          </div>
        </div>

        {/* Licenses */}
        <div className="detail-card">
          <div className="detail-card-title"><Icon.License size={14} /> Licenses</div>
          <div className="doc-list">
            {detail.licenses.map(l => (
              <div className="lic-row" key={l.no}>
                <div className="lic-row-main">
                  <div className="lic-row-name">{l.name}</div>
                  <div className="lic-row-no mono">{l.no}</div>
                </div>
                <div className="lic-row-valid">valid until<br /><b>{l.valid}</b></div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="detail-card">
          <div className="detail-card-title"><Icon.File size={14} /> Documents</div>
          <div className="doc-list">
            {detail.documents.map(d => (
              <div className="doc-row" key={d.name}>
                <div className="doc-badge">{d.kind}</div>
                <div className="doc-row-main">
                  <div className="doc-row-name">{d.name}</div>
                  <div className="doc-row-size mono">{d.size}</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => onDownload(d.name)}>
                  <Icon.Download size={13} /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {actions && <div className="detail-actionbar">{actions}</div>}
    </section>
  );
};
