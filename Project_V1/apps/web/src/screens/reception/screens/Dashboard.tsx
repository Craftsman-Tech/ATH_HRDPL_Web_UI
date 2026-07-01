import React from 'react';
import type { ScreenId } from '../types/reception.types';

interface DashboardProps {
  receptionistName: string;
  onNav: (s: ScreenId) => void;
}

const QUICK_ACTIONS: { id: ScreenId; title: string; desc: string; emoji: string; bg: string; color: string }[] = [
  { id:'appointments', title:'Appointments',         desc:'Schedule new appointments, view, reschedule or cancel OP appointments.', emoji:'📅', bg:'var(--mineral-100)', color:'var(--mineral-700)' },
  { id:'patientreg',   title:'Patient Registration', desc:'Register new outpatient patients and manage demographic details.',       emoji:'🧑‍⚕️', bg:'var(--al)', color:'var(--amber)' },
  { id:'patients',     title:'Patients',             desc:'Search and view patient information and visit history.',                  emoji:'👥', bg:'var(--bl)', color:'var(--blue)' },
  { id:'queue',        title:'Queue Management',     desc:'Manage OP queue, call patients and track waiting status.',               emoji:'🔢', bg:'var(--al)', color:'var(--amber)' },
  { id:'billing',      title:'Billing & Payments',   desc:'Generate bills for OP services and record payments.',                    emoji:'💳', bg:'var(--rl)', color:'var(--rose)' },
  { id:'reports',      title:'Reports',              desc:'View OP reports like daily appointments, collections and more.',         emoji:'📊', bg:'var(--mineral-100)', color:'var(--mineral-700)' },
  { id:'communication',title:'Communication',        desc:'Send SMS/notifications to patients for appointments and reminders.',     emoji:'💬', bg:'var(--bl)', color:'var(--blue)' },
];

export const Dashboard: React.FC<DashboardProps> = ({ receptionistName, onNav }) => {
  const firstName = receptionistName.split(' ')[0];

  return (
    <div className="rc-scroll rc-fade">
      <div className="rc-content">
        {/* Hero banner */}
        <div className="rc-hero">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="rc-hero-emoji">🏥</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Out Patient Care · Better Every Day
              </div>
              <div className="rc-display" style={{ fontSize: 32, fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.035em' }}>
                Welcome, {firstName}!
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--text2)', marginTop: 5 }}>
                Manage outpatient services efficiently. Have a great shift!
              </div>
              <div className="rc-hero-info-row" style={{ marginTop: 12 }}>
                <span style={{ background: 'var(--primary)', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>OUT PATIENT ONLY</span>
                <span style={{ marginLeft: 8 }}>This system is designed exclusively for Out Patient (OP) management.</span>
              </div>
            </div>
          </div>
          {/* Illustration */}
          <div style={{ fontSize: 64, flexShrink: 0 }}>🚪🪑🪑</div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="rc-section-heading">Quick Actions</div>
          <div className="rc-section-sub">Select an option below to get started.</div>
          <div className="rc-qa-grid">
            {QUICK_ACTIONS.map(qa => (
              <div key={qa.id} className="rc-qa-card" onClick={() => onNav(qa.id)}>
                <div className="rc-qa-icon" style={{ background: qa.bg, color: qa.color }}>
                  <span style={{ fontSize: 28 }}>{qa.emoji}</span>
                </div>
                <div className="rc-qa-title">{qa.title}</div>
                <div className="rc-qa-desc">{qa.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ background: 'var(--bl)', border: '1.5px solid #bfdbfe', borderRadius: 'var(--radius-sm)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>Out Patient Focused</div>
            <div style={{ fontSize: 12.5, color: 'var(--text2)', marginTop: 2 }}>
              This Vexoo Reception Portal is built Currently for Out Patient (OP) services. No In Patient (IP) modules are included.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
