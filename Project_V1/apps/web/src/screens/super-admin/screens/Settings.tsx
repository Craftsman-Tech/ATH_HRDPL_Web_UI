/**
 * Settings.tsx — account settings for the Support Console.
 * Left sub-nav with five tabs: Profile (editable form), Notifications (roadmap
 * placeholder), Team & roles, Approval rules and Security — the last three built
 * to match the reference screens.
 */
import React, { useState } from 'react';
import {
  SETTINGS_PROFILE, TEAM_MEMBERS, TEAM_TOTAL, APPROVAL_RULES,
  AUTO_RETURN_OPTIONS, SLA_OPTIONS, SECURITY_INFO,
} from '../data/mockData';
import { Icon } from '../shared/Icons';
import { initials } from '../shared/initials';
import type { SettingsTab, AgentPresence } from '../types/admin.types';

const NAV: { id: SettingsTab; label: string; I: React.FC<{ size?: number }> }[] = [
  { id: 'profile',  label: 'Profile',        I: Icon.User },
  { id: 'notifications', label: 'Notifications', I: Icon.Bell },
  { id: 'team',     label: 'Team & roles',   I: Icon.Users },
  { id: 'rules',    label: 'Approval rules',  I: Icon.File },
  { id: 'security', label: 'Security',        I: Icon.License },
];

const PRESENCE: Record<AgentPresence, string> = { online: 'Online', away: 'Away', offline: 'Offline' };

/* Reusable settings card (serif title + sub, optional right-side header action). */
const Panel: React.FC<{ title: string; sub: string; action?: React.ReactNode; children: React.ReactNode }> = ({ title, sub, action, children }) => (
  <div className="settings-panel">
    <div className="set-card-head">
      <div>
        <div className="settings-panel-title">{title}</div>
        <div className="meta-line">{sub}</div>
      </div>
      {action}
    </div>
    {children}
  </div>
);

/* A labelled row with a control on the right (used by Approval rules + Security). */
const SetRow: React.FC<{ title: string; desc: string; danger?: boolean; control: React.ReactNode }> = ({ title, desc, danger, control }) => (
  <div className="set-row">
    <div className="set-row-text">
      <div className={`set-row-title ${danger ? 'danger' : ''}`}>{title}</div>
      <div className="meta-line">{desc}</div>
    </div>
    <div className="set-row-control">{control}</div>
  </div>
);

const Toggle: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
  <button className={`toggle ${on ? 'on' : ''}`} role="switch" aria-checked={on} onClick={onClick}>
    <span className="toggle-knob" />
  </button>
);

/* ---- Profile tab (unchanged behaviour) ---- */
const ProfileTab: React.FC = () => {
  const p = SETTINGS_PROFILE;
  const [form, setForm] = useState({ fullName: p.fullName, role: p.role, email: p.email, phone: p.phone, tz: p.tz });
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setForm(f => ({ ...f, [k]: e.target.value })); setSaved(false); };

  return (
    <Panel title="Your profile" sub="How you appear across the Support Console">
      <div className="settings-id">
        <div className="settings-av">{initials(form.fullName)}</div>
        <div style={{ flex: 1 }}>
          <div className="settings-id-name">{form.fullName}</div>
          <div className="meta-line">{form.role}</div>
        </div>
        <button className="btn btn-ghost btn-sm">Change photo</button>
      </div>

      <div className="settings-form">
        <div className="field"><div className="lbl">Full name</div><input className="inp" value={form.fullName} onChange={set('fullName')} /></div>
        <div className="field"><div className="lbl">Role</div><input className="inp" value={form.role} onChange={set('role')} /></div>
        <div className="field"><div className="lbl">Work email</div><input className="inp" value={form.email} onChange={set('email')} /></div>
        <div className="field"><div className="lbl">Phone</div><input className="inp" value={form.phone} onChange={set('phone')} /></div>
        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <div className="lbl">Time zone</div>
          <select className="sel" value={form.tz} onChange={set('tz')}>
            <option>Asia/Kolkata (IST)</option>
            <option>Asia/Dubai (GST)</option>
            <option>Europe/London (GMT)</option>
            <option>America/New_York (ET)</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <button className={`btn ${saved ? 'btn-ghost' : 'btn-primary'}`} onClick={() => setSaved(true)}>
          {saved ? <><Icon.Check size={13} strokeWidth={3} /> Saved</> : 'Save changes'}
        </button>
      </div>
    </Panel>
  );
};

/* ---- Team & roles tab ---- */
const TeamTab: React.FC = () => (
  <Panel
    title="Team & roles"
    sub={`${TEAM_TOTAL} agents across the support organisation`}
    action={<button className="btn btn-primary btn-sm"><Icon.Plus size={13} /> Invite agent</button>}
  >
    <div className="team-table">
      <div className="team-head">
        <div>Agent</div><div>Role</div><div>Email</div><div>Status</div><div />
      </div>
      {TEAM_MEMBERS.map(m => (
        <div className="team-row" key={m.email}>
          <div className="team-agent">
            <div className="team-av" style={{ background: m.accent }}>{m.mark}</div>
            <div className="team-name">{m.name}</div>
          </div>
          <div className="team-role">{m.role}</div>
          <div className="team-email">{m.email}</div>
          <div>
            <span className={`presence presence-${m.presence}`}><span className="dot" /> {PRESENCE[m.presence]}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button className="row-menu-btn" title="Actions"><Icon.More size={15} /></button>
          </div>
        </div>
      ))}
    </div>
  </Panel>
);

/* ---- Approval rules tab ---- */
const RulesTab: React.FC = () => {
  const [rules, setRules] = useState(APPROVAL_RULES);
  const [saved, setSaved] = useState(false);
  const upd = <K extends keyof typeof rules>(k: K, v: (typeof rules)[K]) => { setRules(r => ({ ...r, [k]: v })); setSaved(false); };

  return (
    <Panel title="Approval rules" sub="How cases flow through the shared queue">
      <div className="set-list">
        <SetRow
          title="Auto-return abandoned cases"
          desc="If an accepted case sees no action, return it to the shared queue."
          control={
            <select className="sel set-sel" value={rules.autoReturn} onChange={e => upd('autoReturn', e.target.value)}>
              {AUTO_RETURN_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          }
        />
        <SetRow
          title="Max open cases per agent"
          desc="Cap how many cases one agent can hold at once."
          control={
            <input
              className="inp set-num" type="number" min={1} max={99}
              value={rules.maxOpen}
              onChange={e => upd('maxOpen', Number(e.target.value) || 0)}
            />
          }
        />
        <SetRow
          title="SLA target"
          desc="Target time to first decision after a case is accepted."
          control={
            <select className="sel set-sel" value={rules.slaTarget} onChange={e => upd('slaTarget', e.target.value)}>
              {SLA_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          }
        />
        <SetRow
          title="Require two-person approval"
          desc="Scale & Enterprise registrations need a second agent's sign-off."
          control={<Toggle on={rules.twoPerson} onClick={() => upd('twoPerson', !rules.twoPerson)} />}
        />
      </div>
      <div style={{ marginTop: 4 }}>
        <button className={`btn ${saved ? 'btn-ghost' : 'btn-primary'}`} onClick={() => setSaved(true)}>
          {saved ? <><Icon.Check size={13} strokeWidth={3} /> Saved</> : 'Save rules'}
        </button>
      </div>
    </Panel>
  );
};

/* ---- Security tab ---- */
const SecurityTab: React.FC = () => {
  const s = SECURITY_INFO;
  return (
    <Panel title="Security" sub="Protect your account">
      <div className="set-list">
        <SetRow
          title="Two-factor authentication"
          desc={`Required for all approval actions. Currently via ${s.twoFactorVia}.`}
          control={<span className="presence presence-online"><span className="dot" /> Enabled</span>}
        />
        <SetRow
          title="Password"
          desc={`Last changed ${s.passwordChanged}.`}
          control={<button className="btn btn-ghost btn-sm">Change password</button>}
        />
        <SetRow
          title="Active sessions"
          desc={s.sessions}
          control={<button className="btn btn-ghost btn-sm">Sign out others</button>}
        />
        <SetRow
          title="Sign out everywhere"
          desc="End all sessions including this one."
          danger
          control={<button className="btn btn-danger-ghost btn-sm">Sign out</button>}
        />
      </div>
    </Panel>
  );
};

export const Settings: React.FC = () => {
  const [tab, setTab] = useState<SettingsTab>('profile');

  return (
    <section className="view">
      <div className="page-head">
        <div className="page-head-row">
          <div>
            <p className="eyebrow">Account</p>
            <h1 className="page-title">Settings</h1>
            <p className="page-sub">Manage your profile, notifications, team access and security for the Support Console.</p>
          </div>
        </div>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          {NAV.map(n => (
            <button key={n.id} className={`settings-nav-item ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
              <n.I size={15} /> {n.label}
            </button>
          ))}
        </nav>

        {tab === 'profile'  && <ProfileTab />}
        {tab === 'team'     && <TeamTab />}
        {tab === 'rules'    && <RulesTab />}
        {tab === 'security' && <SecurityTab />}
        {tab === 'notifications' && (
          <div className="settings-panel">
            <div className="placeholder" style={{ padding: '48px 24px' }}>
              <div className="ph-icon"><Icon.Bell size={22} /></div>
              <h3>Notifications</h3>
              <p>This section is on the roadmap. Profile, Team &amp; roles, Approval rules and Security are live today.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
