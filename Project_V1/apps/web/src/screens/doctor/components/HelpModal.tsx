import React, { useState, useRef } from 'react';

interface HelpModalProps {
  userName: string;
  phone: string;
  hospital: string;
  role: string;
  onClose: () => void;
}

/**
 * Vexoo Customer Support form.
 * Name / Phone / Hospital / Role are auto-filled from the signed-in user
 * (editable in case they need correcting). Issue is a large free-text area,
 * with an optional evidence upload. On submit a success banner is shown.
 * Mock — no backend; submission is simulated.
 */
export const HelpModal: React.FC<HelpModalProps> = ({ userName, phone, hospital, role, onClose }) => {
  const [issue, setIssue] = useState('');
  const [fileName, setFileName] = useState('');
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : '');
  };

  const submit = () => {
    if (!issue.trim()) return;
    // TODO(backend): POST { userName, phone, hospital, role, issue, file } to support endpoint.
    setSent(true);
  };

  return (
    <div className="dr-modal-backdrop" onClick={onClose}>
      <div className="dr-modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="dr-modal-header">
          <div className="dr-modal-title">Vexoo Customer Support</div>
          <button className="dr-modal-close" onClick={onClose}>✕</button>
        </div>

        {sent ? (
          <div className="dr-modal-body" style={{ padding: '34px 26px', textAlign: 'center' }}>
            <div className="dr-help-success-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div className="dr-help-banner" style={{ marginTop: 18 }}>
              Message Sent Successfully, Our team will Reach out soon.
            </div>
            <button className="dr-btn-primary" style={{ marginTop: 22 }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="dr-modal-body" style={{ padding: '22px 26px' }}>
              <div className="dr-help-grid">
                <div className="dr-help-field">
                  <label className="dr-help-label">Name</label>
                  <input className="dr-help-input" defaultValue={userName} />
                </div>
                <div className="dr-help-field">
                  <label className="dr-help-label">Phone Number</label>
                  <input className="dr-help-input" defaultValue={phone} />
                </div>
                <div className="dr-help-field">
                  <label className="dr-help-label">Hospital Name</label>
                  <input className="dr-help-input" defaultValue={hospital} />
                </div>
                <div className="dr-help-field">
                  <label className="dr-help-label">Role</label>
                  <input className="dr-help-input" defaultValue={role} />
                </div>
              </div>

              <div className="dr-help-field" style={{ marginTop: 4 }}>
                <label className="dr-help-label">Describe your issue</label>
                <textarea
                  className="dr-help-textarea"
                  placeholder="Tell us what's going wrong in as much detail as you can…"
                  value={issue}
                  onChange={e => setIssue(e.target.value)}
                />
              </div>

              <div className="dr-help-field" style={{ marginBottom: 0 }}>
                <label className="dr-help-label">Attach evidence (optional)</label>
                <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={onFile}
                  accept="image/*,.pdf,.doc,.docx,.txt" />
                <button className="dr-help-upload" onClick={() => fileRef.current?.click()}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  {fileName || 'Upload a screenshot or file'}
                </button>
              </div>
            </div>

            <div className="dr-modal-footer">
              <button className="dr-btn-secondary" onClick={onClose}>Cancel</button>
              <button className="dr-btn-primary" onClick={submit} disabled={!issue.trim()}>Submit</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
