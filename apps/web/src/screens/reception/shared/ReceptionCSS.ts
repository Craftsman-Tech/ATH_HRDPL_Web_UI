// ============================================================================
//  ReceptionCSS.ts — Vexoo Reception Portal
//  Restyled to match the Vexoo_Reception_Portal.html mockup design system:
//  Fraunces (display) + Inter Tight (body) + JetBrains Mono, paper/ink/mineral
//  palette, 14px cards, 10px buttons, 999px badges. All .rc-* class names are
//  preserved so component markup & logic remain unchanged.
// ============================================================================

export const CSS = `
/* ── Design tokens (from mockup) ── */
.rc-root {
  /* paper / ink scale */
  --paper:    #FAFAF7;
  --paper-warm:#F4F2EC;
  --ink-900:#0B0F0E; --ink-800:#171C1B; --ink-700:#2A302F; --ink-600:#454C4B;
  --ink-500:#6B7270; --ink-400:#9AA09E; --ink-300:#C4C8C6; --ink-200:#E4E6E4;
  --ink-100:#EFF0EE; --ink-50:#F5F6F4;

  /* mineral (teal/green primary) scale */
  --mineral-900:#062F26; --mineral-800:#0A4A3D; --mineral-700:#0E7C66;
  --mineral-600:#149E83; --mineral-500:#1FBFA0; --mineral-400:#5BD4BC;
  --mineral-300:#A4E8DA; --mineral-200:#D1F2EB; --mineral-100:#E8F8F4;

  /* mapped legacy variables → keep component code working */
  --bg:      var(--paper);
  --surface: var(--ink-50);
  --card:    #FFFFFF;
  --sidebar: #0B0F0E;

  --primary:       #0E7C66;
  --primary-dark:  #0A4A3D;
  --primary-light: #E8F8F4;
  --primary-mid:   #A4E8DA;

  --amber:  #C68A1F; --al: #FBF1DC;
  --rose:   #B43A2C; --rl: #FAE2DD;
  --blue:   #0A6E8F; --bl: #E2F1F6;
  --purple: #6D5BD0; --pul:#ECE9FB;
  --green:  #0E7C66; --gl: #E8F8F4;
  --orange: #C26A1F; --ol: #FBE9DC;

  --text:   var(--ink-900);
  --text2:  var(--ink-600);
  --muted:  var(--ink-500);
  --border: var(--ink-200);
  --line:   var(--ink-200);

  --shadow-sm:  0 1px 2px rgba(11,15,14,.04), 0 1px 3px rgba(11,15,14,.05);
  --shadow:     0 2px 8px rgba(11,15,14,.06), 0 12px 28px rgba(11,15,14,.07);
  --shadow-lg:  0 12px 32px rgba(11,15,14,.16);

  --radius:    14px;
  --radius-sm: 11px;
  --radius-xs: 10px;

  font-family: 'Inter Tight', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-feature-settings: "ss01","cv11";
  background: var(--paper);
  color: var(--ink-900);
  height: 100vh;
  overflow: hidden;
  display: flex;
  font-size: 14px;
  line-height: 1.5;
}

/* Display / mono helpers */
.rc-root .rc-display, .rc-root .display { font-family:'Fraunces',Georgia,serif; letter-spacing:-0.035em; font-feature-settings:"ss01"; }
.rc-root .rc-mono, .rc-root .mono { font-family:'JetBrains Mono',Menlo,monospace; }

/* Scrollbars */
.rc-root ::-webkit-scrollbar        { width: 9px; height: 9px; }
.rc-root ::-webkit-scrollbar-thumb  { background: rgba(11,15,14,0.14); border-radius: 6px; border:2px solid transparent; background-clip:padding-box; }
.rc-root ::-webkit-scrollbar-track  { background: transparent; }
.rc-root ::selection { background: #0E7C66; color: #FAFAF7; }

/* Animations */
@keyframes rc-fade { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes rc-slide-up { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes rc-pulse-dot { 0%,100%{ opacity:1; } 50%{ opacity:0.3; } }
.rc-fade      { animation: rc-fade     0.30s cubic-bezier(0.2,0.9,0.3,1) both; }
.rc-slide-up  { animation: rc-slide-up 0.3s  ease both; }

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
.rc-sidebar {
  width: 248px; flex-shrink: 0;
  position: relative;
  background: #0B0F0E;
  color: #FAFAF7;
  display: flex; flex-direction: column;
  height: 100vh; overflow: hidden;
  border-right: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
  scrollbar-width: none;
}
.rc-sidebar::before {
  content:''; position:absolute; inset:0;
  background-image:linear-gradient(to right,rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.035) 1px,transparent 1px);
  background-size:40px 40px; opacity:0.5; pointer-events:none;
}
.rc-sidebar::after {
  content:''; position:absolute; top:-160px; left:-120px; width:380px; height:380px;
  border-radius:50%; background:rgba(14,124,102,0.22); filter:blur(80px); pointer-events:none;
}
.rc-sidebar > * { position: relative; z-index: 1; }

.rc-logo-row {
  padding: 22px 22px 24px;
  display: flex; align-items: center; gap: 12px;
}
.rc-logo-icon {
  width: 42px; height: 42px;
  background: #0E7C66;
  border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.32);
}

/* Sidebar mini stats (unused in mockup but kept for safety) */
.rc-sidebar-mini-stats { padding: 14px 14px 8px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.rc-mini-stat { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 10px 8px; text-align: center; }

/* Nav */
.rc-nav { flex: 1; padding: 6px 14px; display: flex; flex-direction: column; gap: 3px; }
.rc-nav-section {
  font-size: 10px; font-weight: 600; letter-spacing: 0.16em;
  color: rgba(250,250,247,0.32); text-transform: uppercase;
  padding: 14px 12px 7px;
}
.rc-nav-btn {
  position: relative;
  display: flex; align-items: center; gap: 12px;
  width: 100%; height: 42px; padding: 0 14px; border-radius: 9px;
  border: none; cursor: pointer; margin-bottom: 0;
  font-size: 14px; font-family: 'Inter Tight', sans-serif; font-weight: 500;
  text-align: left; transition: background 0.15s, color 0.15s;
}
.rc-nav-btn.active {
  background: rgba(14,124,102,0.20);
  color: #FAFAF7; font-weight: 500;
}
.rc-nav-btn.active::before {
  content: ''; position: absolute; left: -14px; top: 9px; bottom: 9px;
  width: 3px; border-radius: 0 3px 3px 0;
  background: #1FBFA0;
}
.rc-nav-btn.inactive { background: transparent; color: rgba(250,250,247,0.62); font-weight: 500; }
.rc-nav-btn.inactive:hover { background: rgba(255,255,255,0.05); color: #FAFAF7; }
.rc-nav-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
.rc-nav-badge {
  margin-left: auto; min-width: 20px; height: 20px; padding: 0 6px;
  background: var(--rose); color: #FAFAF7;
  font-size: 11px; font-weight: 600;
  border-radius: 999px; display: flex; align-items: center; justify-content: center;
}
.rc-nav-btn.active .rc-nav-badge { background: #1FBFA0; color: #062F26; }

/* Sidebar footer */
.rc-sidebar-footer { padding: 14px; border-top: 1px solid rgba(255,255,255,0.07); }
.rc-user-identity {
  display: flex; align-items: center; gap: 11px;
  padding: 10px 12px; border-radius: 10px; margin-bottom: 10px;
  background: rgba(255,255,255,0.04);
}
.rc-user-avatar {
  width: 36px; height: 36px; border-radius: 9px;
  background: #0E7C66;
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; color: #FAFAF7; font-size: 13px; flex-shrink: 0;
}
.rc-logout-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; height: 38px;
  border-radius: 9px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(250,250,247,0.7); font-size: 13px; font-weight: 500;
  font-family: inherit; cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.rc-logout-btn:hover { background: rgba(255,255,255,0.06); color: #FAFAF7; }

/* ─────────────────────────────────────────────
   TOPBAR / HEADER
───────────────────────────────────────────── */
.rc-header {
  display: flex; align-items: center; gap: 14px;
  padding: 0 36px; height: 72px; flex-shrink: 0;
  background: color-mix(in srgb, var(--paper) 86%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
  position: sticky; top: 0; z-index: 30;
}
.rc-header-title {
  font-family: 'Fraunces', 'Fraunces Variable', Georgia, serif !important;
  font-size: 26px; font-weight: 400;
  color: var(--ink-900); letter-spacing: -0.035em; line-height: 1.05;
}
.rc-header-spacer { flex: 1; }

/* meta chips in topbar */
.rc-meta-chip {
  display: flex; align-items: center; gap: 7px; height: 36px; padding: 0 13px;
  border-radius: 9px; border: 1px solid var(--line); background: var(--card);
  font-size: 13px; color: var(--ink-600); font-weight: 500;
}

/* Profile hover card */
.rc-profile-wrap { position: relative; }
.rc-profile-avatar {
  width: 38px; height: 38px; border-radius: 9px;
  background: var(--mineral-700);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 600; font-size: 13px; cursor: pointer;
  flex-shrink: 0; transition: box-shadow 0.15s;
}
.rc-profile-wrap:hover .rc-profile-avatar {
  box-shadow: 0 0 0 3px rgba(14,124,102,.22), 0 0 0 6px rgba(14,124,102,.08);
}
.rc-profile-tooltip {
  display: none; position: fixed; top: 70px; right: 16px;
  background: var(--card); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 18px 20px; min-width: 238px;
  box-shadow: var(--shadow-lg); z-index: 200;
}
.rc-profile-wrap:hover .rc-profile-tooltip { display: block; }
.rc-profile-tooltip::before { content: ''; position: absolute; top: -12px; left: 0; right: 0; height: 12px; }
.rc-tt-avatar {
  width: 48px; height: 48px; border-radius: 11px;
  background: var(--mineral-700);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 600; font-size: 17px; margin-bottom: 12px;
}
.rc-tt-name  { font-size: 14.5px; font-weight: 700; color: var(--ink-900); }
.rc-tt-sub   { font-size: 12px; color: var(--ink-500); margin-top: 3px; }
.rc-tt-divider { height: 1px; background: var(--line); margin: 12px 0; }
.rc-tt-action {
  display: flex; align-items: center; gap: 9px; width: 100%;
  padding: 9px 11px; border-radius: 10px; border: none; background: transparent;
  font-size: 13px; font-weight: 500; cursor: pointer;
  text-align: left; font-family: 'Inter Tight', sans-serif; transition: background 0.13s;
}
.rc-tt-action.profile { color: var(--mineral-700); }
.rc-tt-action.profile:hover { background: var(--primary-light); }
.rc-tt-action.signout { color: var(--rose); }
.rc-tt-action.signout:hover { background: var(--rl); }

/* ─────────────────────────────────────────────
   MAIN LAYOUT
───────────────────────────────────────────── */
.rc-main   { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--paper); }
.rc-scroll { flex: 1; overflow-y: auto; }
.rc-content { padding: 30px 36px 56px; display: flex; flex-direction: column; gap: 26px; max-width: 1440px; width: 100%; }

/* ─────────────────────────────────────────────
   STAT CARDS
───────────────────────────────────────────── */
.rc-stat-row {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;
}
.rc-stat-card {
  background: var(--card); border: 1px solid var(--line);
  border-radius: 14px; padding: 20px 22px;
  position: relative; overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}
.rc-stat-card:hover { box-shadow: var(--shadow-sm); }
/* Tinted stat card variants — matches mockup s-* classes */
.rc-stat-card.s-neutral { background: var(--card); color: var(--ink-900); border-color: var(--line); }
.rc-stat-card.s-amber   { background: var(--al);   color: var(--amber);       border-color: transparent; }
.rc-stat-card.s-mineral { background: var(--mineral-100); color: var(--mineral-700); border-color: transparent; }
.rc-stat-card.s-blue    { background: var(--bl);   color: var(--blue);        border-color: transparent; }
.rc-stat-card.s-red     { background: var(--rl);   color: var(--rose);        border-color: transparent; }
.rc-stat-card.s-mineral .rc-stat-label,
.rc-stat-card.s-amber   .rc-stat-label,
.rc-stat-card.s-blue    .rc-stat-label,
.rc-stat-card.s-red     .rc-stat-label  { color: inherit; opacity: 0.78; }
.rc-stat-value {
  font-family: 'Fraunces', 'Fraunces Variable', Georgia, serif !important;
  font-size: 40px; font-weight: 400; letter-spacing: -0.04em;
  line-height: 1; margin-top: 14px; margin-bottom: 0;
}
.rc-stat-label { font-size: 12.5px; font-weight: 600; letter-spacing: 0.02em; opacity: 0.78; margin-bottom: 0; color: inherit; }
.rc-stat-sub   { font-size: 12px; margin-top: 8px; opacity: 0.7; }

/* ─────────────────────────────────────────────
   CARDS & PANELS
───────────────────────────────────────────── */
.rc-card {
  background: var(--card); border: 1px solid var(--line);
  border-radius: 14px; padding: 22px 24px;
}
.rc-card-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 21px; font-weight: 400; color: var(--ink-900);
  margin-bottom: 16px; letter-spacing: -0.03em;
}
.rc-two-col   { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.rc-three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

/* ─────────────────────────────────────────────
   FORM ELEMENTS
───────────────────────────────────────────── */
.rc-field-label {
  font-size: 0.6875rem; font-weight: 600; color: var(--ink-500);
  letter-spacing: 0.1em; text-transform: uppercase;
  margin-bottom: 8px; display: block;
}
.rc-field-input, .rc-field-select, .rc-field-textarea {
  width: 100%; height: 44px; padding: 0 14px;
  border: 1px solid var(--line); border-radius: 10px;
  font-size: 14px; font-family: 'Inter Tight', sans-serif;
  color: var(--ink-900); background: var(--card); outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}
.rc-field-textarea { height: auto; padding: 13px 14px; line-height: 1.55; }
.rc-field-input:focus, .rc-field-select:focus, .rc-field-textarea:focus {
  border-color: var(--mineral-700);
  box-shadow: 0 0 0 3px rgba(14,124,102,.12);
}
.rc-field-input::placeholder, .rc-field-textarea::placeholder { color: var(--ink-400); }
.rc-field-textarea { resize: vertical; min-height: 76px; }
.rc-form-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.rc-form-group { display: flex; flex-direction: column; gap: 0; margin-bottom: 18px; }

/* ─────────────────────────────────────────────
   BUTTONS
───────────────────────────────────────────── */
.rc-btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 42px; padding: 0 18px; border-radius: 10px; border: 1px solid var(--mineral-700); cursor: pointer;
  background: var(--mineral-700); color: #FAFAF7; font-size: 14px;
  font-weight: 600; font-family: inherit; white-space: nowrap;
  transition: all 0.15s;
  box-shadow: 0 1px 0 rgba(11,15,14,0.08), inset 0 1px 0 rgba(255,255,255,0.08);
}
.rc-btn-primary:hover { background: var(--mineral-800); border-color: var(--mineral-800); }
.rc-btn-primary:active { transform: translateY(0); }
.rc-btn-primary.danger { background: var(--rose); border-color: var(--rose); box-shadow: none; }
.rc-btn-primary.danger:hover { background: #93302410; background: #8f2e22; border-color: #8f2e22; }
.rc-btn-primary.amber { background: var(--amber); border-color: var(--amber); box-shadow: none; }
.rc-btn-primary svg { width: 16px; height: 16px; }

.rc-btn-secondary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 42px; padding: 0 18px; border-radius: 10px; cursor: pointer;
  font-family: inherit; background: var(--card);
  border: 1px solid var(--line);
  color: var(--ink-800); font-size: 14px; font-weight: 600; white-space: nowrap;
  transition: all 0.15s;
}
.rc-btn-secondary:hover { background: var(--ink-50); border-color: var(--ink-300); }
.rc-btn-secondary svg { width: 16px; height: 16px; }

.rc-btn-wa {
  display: inline-flex; align-items: center; gap: 7px;
  height: 42px; padding: 0 18px; border-radius: 10px; border: none; cursor: pointer;
  background: #1FA855; color: white; font-size: 13px;
  font-weight: 600; font-family: inherit;
  transition: all 0.15s;
}
.rc-btn-wa:hover { background: #178a45; }

/* generic small/outline buttons */
.rc-btn-outline {
  display: inline-flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 13px; border-radius: 8px;
  border: 1px solid var(--line); background: var(--card);
  color: var(--ink-800); font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.15s;
}
.rc-btn-outline:hover { background: var(--ink-50); border-color: var(--ink-300); }

/* ─────────────────────────────────────────────
   CHIPS / BADGES  (999px pill, mockup tints)
───────────────────────────────────────────── */
.rc-chip {
  display: inline-flex; align-items: center; gap: 5px;
  height: 24px; font-size: 12px; font-weight: 600; padding: 0 10px;
  border-radius: 999px; white-space: nowrap;
}
.rc-chip.primary { background: var(--mineral-100); color: var(--mineral-700); }
.rc-chip.amber   { background: var(--al);  color: var(--amber); }
.rc-chip.rose    { background: var(--rl);  color: var(--rose); }
.rc-chip.blue    { background: var(--bl);  color: var(--blue); }
.rc-chip.green   { background: var(--mineral-100); color: var(--mineral-700); }
.rc-chip.purple  { background: var(--pul); color: var(--purple); }
.rc-chip.orange  { background: var(--ol);  color: var(--orange); }
.rc-chip.gray    { background: var(--ink-100); color: var(--ink-600); }
/* status aliases */
.rc-chip.confirmed { background: var(--mineral-100); color: var(--mineral-700); }
.rc-chip.pending   { background: var(--al); color: var(--amber); }
.rc-chip.completed { background: var(--bl); color: var(--blue); }
.rc-chip.cancelled { background: var(--rl); color: var(--rose); }
.rc-chip.noshow    { background: var(--ink-100); color: var(--ink-600); }
.rc-chip.waiting   { background: var(--al); color: var(--amber); }
.rc-chip.withdoc   { background: var(--mineral-100); color: var(--mineral-700); }

/* ─────────────────────────────────────────────
   PATIENT ROWS
───────────────────────────────────────────── */
.rc-patient-row {
  display: flex; align-items: center; gap: 13px;
  padding: 12px 13px; border-radius: 11px; cursor: pointer;
  border: 1px solid transparent; transition: all 0.15s; margin-bottom: 8px;
}
.rc-patient-row:last-child { margin-bottom: 0; }
.rc-patient-row.selected {
  background: var(--mineral-100);
  border-color: var(--mineral-700);
}
.rc-patient-row.normal { background: var(--card); border-color: var(--line); }
.rc-patient-row.normal:hover { border-color: var(--mineral-300); background: var(--ink-50); }

.rc-token-badge {
  width: 36px; height: 36px; border-radius: 9px;
  background: var(--mineral-700); color: white;
  font-size: 13px; font-weight: 600;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.rc-token-badge.urgent    { background: var(--amber); }
.rc-token-badge.emergency { background: var(--rose); }

/* Priority left-border accent */
.priority-normal    { border-left-color: var(--blue) !important; }
.priority-urgent    { border-left-color: var(--amber) !important; }
.priority-emergency { border-left-color: var(--rose) !important; }

/* ─────────────────────────────────────────────
   TABLE
───────────────────────────────────────────── */
.rc-table { width: 100%; border-collapse: collapse; }
.rc-th {
  text-align: left; font-size: 0.6875rem; font-weight: 600; color: var(--ink-500);
  text-transform: uppercase; letter-spacing: 0.1em;
  padding: 13px 18px; border-bottom: 1px solid var(--line);
  background: transparent; white-space: nowrap;
}
.rc-td { padding: 15px 18px; font-size: 14px; border-bottom: 1px solid var(--line); vertical-align: middle; color: var(--ink-700); }
.rc-tr { transition: background 0.12s; }
.rc-tr:hover .rc-td { background: var(--ink-50); }
.rc-tr:last-child .rc-td { border-bottom: none; }

/* ─────────────────────────────────────────────
   DETAIL PANEL
───────────────────────────────────────────── */
.rc-detail-header {
  background: var(--mineral-800);
  color: white; padding: 20px 22px; border-radius: 11px;
  margin-bottom: 14px;
}
.rc-detail-section {
  border: 1px solid var(--line); border-radius: 11px;
  padding: 14px 16px; margin-bottom: 12px;
  background: var(--card);
}
.rc-section-label {
  font-size: 0.6875rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--ink-500); margin-bottom: 10px;
}
.rc-detail-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 6px 0; border-bottom: 1px solid var(--line);
}
.rc-detail-row:last-child { border-bottom: none; }

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
.rc-modal-backdrop {
  position: fixed; inset: 0; background: rgba(11,15,14,.40);
  backdrop-filter: blur(3px);
  z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px;
}
.rc-modal {
  background: var(--card); border-radius: 16px; width: 100%;
  max-width: 520px; box-shadow: var(--shadow-lg);
  overflow: hidden; max-height: 90vh; overflow-y: auto;
  border: 1px solid var(--line);
  animation: rc-slide-up 0.25s ease both;
}
.rc-modal-lg { max-width: 680px; }
.rc-modal-header {
  padding: 22px 26px 18px;
  border-bottom: 1px solid var(--line);
  display: flex; justify-content: space-between; align-items: center;
}
.rc-modal-title { font-family: 'Fraunces', 'Fraunces Variable', Georgia, serif !important; font-size: 20px; font-weight: 400; letter-spacing: -0.02em; }
.rc-modal-body  { padding: 22px 26px; }
.rc-modal-footer {
  padding: 16px 26px; border-top: 1px solid var(--line);
  display: flex; justify-content: flex-end; gap: 12px;
  background: var(--ink-50);
}
.rc-modal-close {
  width: 34px; height: 34px; border-radius: 9px;
  border: 1px solid var(--line); background: var(--card);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: var(--ink-500); font-size: 16px; transition: all 0.15s;
}
.rc-modal-close:hover { background: var(--ink-50); color: var(--ink-800); }

/* ─────────────────────────────────────────────
   WAIT TIMER
───────────────────────────────────────────── */
.rc-queue-pill {
  display: inline-flex; align-items: center; gap: 5px;
  background: var(--al); border: 1px solid transparent; border-radius: 999px;
  padding: 3px 11px; font-size: 12px; font-weight: 600; color: var(--amber);
}
.rc-wait-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--amber);
  animation: rc-pulse-dot 1.5s ease-in-out infinite;
}

/* ─────────────────────────────────────────────
   VITALS GRID
───────────────────────────────────────────── */
.rc-vitals-grid-8 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.rc-vital-card {
  border-radius: 11px; padding: 14px 16px;
  border: 1px solid var(--line); background: var(--card);
}
.rc-vital-value { font-family: 'Fraunces', Georgia, serif; font-size: 24px; font-weight: 400; letter-spacing: -0.03em; }
.rc-vital-label { font-size: 11px; color: var(--ink-500); margin-top: 3px; font-weight: 600; }
.rc-vital-unit  { font-size: 10.5px; color: var(--ink-500); margin-top: 1px; }
.rc-vital-required::after { content: ' *'; color: var(--rose); }

/* ─────────────────────────────────────────────
   BILL ROWS
───────────────────────────────────────────── */
.rc-bill-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 9px 0; border-bottom: 1px solid var(--line); font-size: 14px;
}
.rc-bill-row:last-child { border-bottom: none; }
.rc-bill-total {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 14px 0 0; font-family: 'Fraunces', 'Fraunces Variable', Georgia, serif !important; font-size: 22px; font-weight: 400; letter-spacing: -0.02em;
}

/* ─────────────────────────────────────────────
   TASK ROWS
───────────────────────────────────────────── */
.rc-task-row {
  display: flex; align-items: flex-start; gap: 13px;
  padding: 12px 0; border-bottom: 1px solid var(--line);
}
.rc-task-row:last-child { border-bottom: none; }
.rc-task-check {
  width: 22px; height: 22px; border-radius: 7px; border: 2px solid var(--line);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; margin-top: 1px; transition: all 0.15s;
}
.rc-task-check:hover { border-color: var(--mineral-700); }

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
.rc-empty {
  text-align: center; padding: 40px 20px;
  color: var(--ink-500); font-size: 14px; font-weight: 500;
}
.rc-empty::before {
  content: '—'; display: block;
  font-size: 28px; color: var(--ink-300); margin-bottom: 10px;
}

/* ─────────────────────────────────────────────
   CHECKIN LAYOUT
───────────────────────────────────────────── */
.rc-checkin-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 22px 28px; flex: 1; overflow: hidden; }
.rc-checkin-list   { display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
.rc-checkin-detail { overflow-y: auto; }

/* ─────────────────────────────────────────────
   MOBILE / OVERLAY
───────────────────────────────────────────── */
.rc-hamburger { display: none; }
.rc-overlay   { display: none; }
@media (max-width: 1080px) {
  .rc-sidebar .rc-nav-btn span,
  .rc-sidebar .rc-logo-row > div:last-child,
  .rc-sidebar .rc-user-identity > div:last-child,
  .rc-sidebar .rc-logout-btn { font-size: 0; }
}
@media (max-width: 768px) {
  .rc-sidebar                     { position: fixed; left:0; top:0; bottom:0; z-index:100; transform:translateX(-100%); }
  .rc-sidebar.mobile-open         { transform: translateX(0); }
  .rc-hamburger                   { display: flex; background: none; border: none; cursor: pointer; padding: 4px; color: var(--ink-900); }
  .rc-overlay                     { display: none; position: fixed; inset:0; background: rgba(11,15,14,.45); z-index:99; }
  .rc-overlay.open                { display: block; }
  .rc-checkin-layout              { grid-template-columns: 1fr; padding: 16px; }
  .rc-two-col                     { grid-template-columns: 1fr; }
  .rc-three-col                   { grid-template-columns: 1fr 1fr; }
  .rc-vitals-grid-8               { grid-template-columns: repeat(2,1fr); }
  .rc-content                     { padding: 20px 18px 40px; }
  .rc-header                      { padding: 0 18px; }
}

/* ─────────────────────────────────────────────
   DASHBOARD quick-action cards
───────────────────────────────────────────── */
.rc-qa-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
.rc-qa-card {
  background: var(--card); border: 1px solid var(--line);
  border-radius: 14px; padding: 22px;
  text-align: left; cursor: pointer; transition: transform .15s, box-shadow .15s, border-color .15s;
  display: flex; flex-direction: column; gap: 14px;
}
.rc-qa-card:hover { box-shadow: var(--shadow); transform: translateY(-3px); border-color: var(--mineral-300); }
.rc-qa-icon {
  width: 46px; height: 46px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin: 0; font-size: 22px;
}
.rc-qa-title { font-family: 'Fraunces', Georgia, serif; font-size: 18px; font-weight: 400; letter-spacing: -0.02em; color: var(--ink-900); margin-bottom: 0; }
.rc-qa-desc  { font-size: 13px; color: var(--ink-500); line-height: 1.5; }

/* ── Dashboard hero banner ── */
.rc-hero {
  position: relative; overflow: hidden;
  background: linear-gradient(110deg, var(--mineral-100), var(--card) 70%);
  border: 1px solid var(--line); border-radius: 14px;
  padding: 34px 36px; display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 0;
}
.rc-hero::after {
  content:''; position:absolute; top:-90px; right:-60px; width:320px; height:320px;
  border-radius:50%; background:radial-gradient(circle,rgba(14,124,102,0.14),transparent 70%); pointer-events:none;
}
.rc-hero-emoji { font-size: 52px; margin-right: 18px; }
.rc-hero-info-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink-600); }

/* ── Welcome header ── */
.rc-welcome-header { margin-bottom: 4px; }
.rc-welcome-title  { font-family: 'Fraunces', Georgia, serif; font-size: 38px; font-weight: 400; letter-spacing: -0.035em; color: var(--ink-900); }
.rc-welcome-sub    { font-size: 15px; color: var(--ink-600); margin-top: 10px; }

/* ── Section heading ── */
.rc-section-heading { font-family: 'Fraunces', Georgia, serif; font-size: 21px; font-weight: 400; color: var(--ink-900); margin-bottom: 3px; letter-spacing: -0.03em; }
.rc-section-sub     { font-size: 13.5px; color: var(--ink-500); margin-bottom: 16px; }

/* ── Tabs ── */
.rc-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--line); margin-bottom: 4px; }
.rc-tab  { position: relative; padding: 12px 16px; font-size: 14px; font-weight: 600; color: var(--ink-500); cursor: pointer; border: none; background: transparent; font-family: inherit; display: flex; align-items: center; gap: 8px; transition: color 0.15s; }
.rc-tab.active { color: var(--mineral-700); }
.rc-tab.active::after { content: ''; position: absolute; left: 12px; right: 12px; bottom: -1px; height: 2px; border-radius: 2px; background: var(--mineral-700); }
.rc-tab:hover:not(.active) { color: var(--ink-800); }

/* ── Filters row ── */
.rc-filters { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.rc-filter-select { height: 44px; padding: 0 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 14px; font-family: inherit; color: var(--ink-900); background: var(--card); outline: none; cursor: pointer; transition: border-color 0.15s; }
.rc-filter-select:focus { border-color: var(--mineral-700); box-shadow: 0 0 0 3px rgba(14,124,102,.12); }
.rc-filter-search { width: 100%; height: 44px; padding: 0 14px 0 42px; border: 1px solid var(--line); border-radius: 10px; font-size: 14px; font-family: inherit; color: var(--ink-900); background: var(--card); outline: none; transition: border-color 0.15s, box-shadow 0.15s; box-sizing: border-box; }
.rc-filter-search:focus { border-color: var(--mineral-700); box-shadow: 0 0 0 3px rgba(14,124,102,.12); }
.rc-filter-search::placeholder { color: var(--ink-400); }
.rc-filter-wrap { position: relative; flex: 1; min-width: 200px; }
.rc-filter-wrap svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--ink-400); pointer-events: none; }

/* ── Status chips colour overrides already handled above ── */

/* ── Queue stats ── */
.rc-q-stat { border-radius: 14px; padding: 20px 22px; display: flex; align-items: center; gap: 14px; border: 1px solid var(--line); position: relative; overflow: hidden; }
.rc-q-stat-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rc-q-stat-val  { font-family: 'Fraunces', 'Fraunces Variable', Georgia, serif !important; font-size: 40px; font-weight: 400; letter-spacing: -0.04em; line-height: 1; }
.rc-q-stat-label{ font-size: 12.5px; font-weight: 600; color: inherit; opacity: 0.78; margin-top: 1px; }

/* ── Call Next button ── */
.rc-btn-callnext {
  display: inline-flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 13px; border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; border: 1px solid var(--mineral-700); transition: all 0.15s;
  background: var(--mineral-700); color: #FAFAF7;
}
.rc-btn-callnext:hover { background: var(--mineral-800); border-color: var(--mineral-800); }
.rc-btn-callnext.consult { background: var(--purple); border-color: var(--purple); }
.rc-btn-consult { background: var(--mineral-100); color: var(--mineral-700); height: 34px; display: inline-flex; align-items: center; padding: 0 13px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; border: none; }

/* ── Bill panel ── */
.rc-bill-layout { display: grid; grid-template-columns: 1fr 380px; gap: 20px; }
.rc-bill-panel  { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 24px 26px; }
.rc-service-row { display: grid; grid-template-columns: 1fr 100px 60px 90px 36px; gap: 10px; align-items: center; margin-bottom: 8px; }
.rc-service-hdr { font-size: 0.6875rem; font-weight: 600; color: var(--ink-500); text-transform: uppercase; letter-spacing: 0.1em; }
.rc-bill-summary-row { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; color: var(--ink-600); }
.rc-bill-total-row   { display: flex; justify-content: space-between; font-family: 'Fraunces', 'Fraunces Variable', Georgia, serif !important; font-size: 22px; font-weight: 400; padding: 12px 0 0; border-top: 1px solid var(--line); align-items: baseline; }

/* ── Reports ── */
.rc-report-layout  { display: grid; grid-template-columns: 200px 1fr; gap: 18px; align-items: flex-start; }
.rc-report-sidebar { background: var(--card); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
.rc-report-nav-item { display: block; padding: 12px 18px; font-size: 14px; font-weight: 500; color: var(--ink-700); cursor: pointer; border: none; background: transparent; width: 100%; text-align: left; font-family: inherit; border-left: 3px solid transparent; transition: all 0.15s; }
.rc-report-nav-item:hover { background: var(--ink-50); color: var(--mineral-700); }
.rc-report-nav-item.active { background: var(--mineral-100); color: var(--mineral-700); border-left-color: var(--mineral-700); font-weight: 600; }
.rc-report-nav-item + .rc-report-nav-item { border-top: 1px solid var(--line); }

/* ── Report stat cards ── */
.rc-rpt-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 18px; }
.rc-rpt-stat  { border-radius: 14px; padding: 20px 22px; border: 1px solid var(--line); position: relative; overflow: hidden; }
.rc-rpt-stat-val   { font-family: 'Fraunces', 'Fraunces Variable', Georgia, serif !important; font-size: 40px; font-weight: 400; letter-spacing: -0.04em; line-height: 1; }
.rc-rpt-stat-label { font-size: 12.5px; font-weight: 600; margin-top: 0; opacity: 0.78; }

/* ── Communication ── */
.rc-comm-layout { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: flex-start; }
.rc-template-card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 15px 16px; cursor: pointer; margin-bottom: 12px; transition: border-color 0.15s, transform 0.15s; }
.rc-template-card:hover { border-color: var(--mineral-300); transform: translateY(-2px); }
.rc-template-title { font-size: 14px; font-weight: 600; margin-bottom: 6px; color: var(--ink-900); }
.rc-template-text  { font-size: 12.5px; color: var(--ink-500); line-height: 1.5; }

/* ── Registration form ── */
.rc-reg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.rc-reg-panel { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 26px 28px; }
.rc-reg-section-title { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-500); margin-bottom: 20px; padding-bottom: 0; border-bottom: none; }

/* ── Patient table actions ── */
.rc-tbl-action { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--line); background: var(--card); cursor: pointer; color: var(--ink-600); transition: all 0.13s; margin-left: 4px; }
.rc-tbl-action:hover { background: var(--ink-50); color: var(--ink-800); }


/* Token / ID cells — JetBrains Mono */
.rc-root [style*="monospace"] {
  font-family: 'JetBrains Mono', 'Courier New', monospace !important;
  letter-spacing: -0.01em;
}

/* ============================================================================
   MOBILE RESPONSIVENESS — appended block (batch 3, #6)
   ============================================================================ */
@media (max-width: 1080px){
  .rc-root *{ box-sizing: border-box; }
}
@media (max-width: 900px){
  .rc-stat-row > *, .rc-qa-grid > *, .rc-reg-grid > *{ min-width: 0; }
  .rc-header-meta{ display: none !important; }
  .rc-hero{ overflow: hidden; }

  .rc-meta-chip{ display: none !important; }
  .rc-header{ gap: 10px; padding: 0 14px; }
  .rc-reg-grid{ grid-template-columns: minmax(0,1fr) !important; }
  .rc-stat-row, .rc-qa-grid{ grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
  .rc-table{ display: block; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
  .rc-modal{ max-width: 100% !important; }
  .rc-modal-backdrop{ padding: 10px; }
}
@media (max-width: 520px){
  .rc-stat-row, .rc-qa-grid{ grid-template-columns: minmax(0,1fr) !important; }
}

/* ─────────────────────────────────────────────
   APPENDED FIX — Mobile drawer label restore
   ----------------------------------------------
   At <=1080px the sidebar collapses to icons-only by setting font-size:0 on
   the nav labels, logo text, user identity and logout text. That collapse
   rule ALSO applies at <=768px, where the sidebar is instead a slide-in
   DRAWER (.mobile-open). In the open drawer there is full width, so the
   labels must come back. These higher-specificity overrides restore them
   only while the drawer is open. (Append-only; no existing rule edited.)
───────────────────────────────────────────── */
@media (max-width: 768px) {
  .rc-sidebar.mobile-open .rc-nav-btn span              { font-size: 14px; }
  .rc-sidebar.mobile-open .rc-logout-btn                { font-size: 13px; }
  .rc-sidebar.mobile-open .rc-logo-row > div:last-child,
  .rc-sidebar.mobile-open .rc-user-identity > div:last-child { font-size: initial; }
}
`;