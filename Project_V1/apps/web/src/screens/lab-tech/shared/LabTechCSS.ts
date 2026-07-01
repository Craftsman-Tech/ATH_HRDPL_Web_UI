/**
 * ============================================================================
 *  LabTechCSS.ts — Lab Technician Portal, restyled to the Vexoo design system
 *  (Fraunces display + Inter Tight body + JetBrains Mono, paper/ink/mineral
 *  palette) so the Doctor portal looks and feels identical to the Reception
 *  portal. Every class is prefixed .lt- to stay scoped to this portal.
 * ============================================================================
 */
export const CSS = `
.lt-root {
  /* paper / ink scale */
  --paper:     #FAFAF7;
  --paper-warm:#F4F2EC;
  --ink-900:#0B0F0E; --ink-800:#171C1B; --ink-700:#2A302F; --ink-600:#454C4B;
  --ink-500:#6B7270; --ink-400:#9AA09E; --ink-300:#C4C8C6; --ink-200:#E4E6E4;
  --ink-100:#EFF0EE; --ink-50:#F5F6F4;

  /* mineral (teal/green primary) scale */
  --mineral-900:#062F26; --mineral-800:#0A4A3D; --mineral-700:#0E7C66;
  --mineral-600:#149E83; --mineral-500:#1FBFA0; --mineral-400:#5BD4BC;
  --mineral-300:#A4E8DA; --mineral-200:#D1F2EB; --mineral-100:#E8F8F4;

  /* mapped legacy variables — keep component code simple */
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

  --text:   var(--ink-900);
  --text2:  var(--ink-600);
  --muted:  var(--ink-500);
  --border: var(--ink-200);
  --line:   var(--ink-200);

  --shadow-sm: 0 1px 2px rgba(11,15,14,.04), 0 1px 3px rgba(11,15,14,.05);
  --shadow:    0 2px 8px rgba(11,15,14,.06), 0 12px 28px rgba(11,15,14,.07);
  --shadow-lg: 0 12px 32px rgba(11,15,14,.16);

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

.lt-root .lt-display { font-family:'Fraunces',Georgia,serif; letter-spacing:-0.035em; font-feature-settings:"ss01"; }
.lt-root .lt-mono     { font-family:'JetBrains Mono',Menlo,monospace; }

.lt-root ::-webkit-scrollbar       { width: 9px; height: 9px; }
.lt-root ::-webkit-scrollbar-thumb { background: rgba(11,15,14,0.14); border-radius: 6px; border: 2px solid transparent; background-clip: padding-box; }
.lt-root ::-webkit-scrollbar-track { background: transparent; }
.lt-root ::selection { background: #0E7C66; color: #FAFAF7; }

@keyframes lt-fade      { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes lt-slide-up  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes lt-pulse-dot { 0%,100%{ opacity:1; } 50%{ opacity:0.3; } }
.lt-fade     { animation: lt-fade 0.30s cubic-bezier(0.2,0.9,0.3,1) both; }
.lt-slide-up { animation: lt-slide-up 0.3s ease both; }

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
.lt-sidebar {
  width: 248px; flex-shrink: 0; position: relative;
  background: #0B0F0E; color: #FAFAF7;
  display: flex; flex-direction: column;
  height: 100vh; overflow: hidden;
  border-right: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
  scrollbar-width: none;
}
.lt-sidebar::before {
  content:''; position:absolute; inset:0;
  background-image:linear-gradient(to right,rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.035) 1px,transparent 1px);
  background-size:40px 40px; opacity:0.5; pointer-events:none;
}
.lt-sidebar::after {
  content:''; position:absolute; top:-160px; left:-120px; width:380px; height:380px;
  border-radius:50%; background:rgba(14,124,102,0.22); filter:blur(80px); pointer-events:none;
}
.lt-sidebar > * { position: relative; z-index: 1; }

.lt-logo-row { padding: 22px 22px 24px; display: flex; align-items: center; gap: 12px; }
.lt-logo-icon {
  width: 42px; height: 42px; background: #0E7C66; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.32);
}

.lt-nav { flex: 1; padding: 6px 14px; display: flex; flex-direction: column; gap: 3px; overflow-y: auto; }
.lt-nav-btn {
  position: relative; display: flex; align-items: center; gap: 12px;
  width: 100%; height: 42px; padding: 0 14px; border-radius: 9px;
  border: none; cursor: pointer;
  font-size: 14px; font-family: 'Inter Tight', sans-serif; font-weight: 500;
  text-align: left; transition: background 0.15s, color 0.15s;
}
.lt-nav-btn.active { background: rgba(14,124,102,0.20); color: #FAFAF7; font-weight: 500; }
.lt-nav-btn.active::before {
  content:''; position:absolute; left:-14px; top:9px; bottom:9px; width:3px;
  border-radius: 0 3px 3px 0; background: #1FBFA0;
}
.lt-nav-btn.inactive { background: transparent; color: rgba(250,250,247,0.62); font-weight: 500; }
.lt-nav-btn.inactive:hover { background: rgba(255,255,255,0.05); color: #FAFAF7; }
.lt-nav-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
.lt-nav-badge {
  margin-left: auto; min-width: 20px; height: 20px; padding: 0 6px;
  background: var(--rose); color: #FAFAF7; font-size: 11px; font-weight: 600;
  border-radius: 999px; display: flex; align-items: center; justify-content: center;
}
.lt-nav-btn.active .lt-nav-badge { background: #1FBFA0; color: #062F26; }

/* Sidebar footer */
.lt-sidebar-footer { padding: 14px; border-top: 1px solid rgba(255,255,255,0.07); }
.lt-user-identity {
  display: flex; align-items: center; gap: 11px;
  padding: 10px 12px; border-radius: 10px; margin-bottom: 10px;
  background: rgba(255,255,255,0.04);
}
.lt-user-avatar {
  width: 36px; height: 36px; border-radius: 9px; background: #0E7C66;
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; color: #FAFAF7; font-size: 13px; flex-shrink: 0;
}
.lt-signout-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; height: 38px; border-radius: 9px;
  background: transparent; border: 1px solid rgba(255,255,255,0.1);
  color: rgba(250,250,247,0.7); font-size: 13px; font-weight: 500;
  font-family: inherit; cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.lt-signout-btn:hover { background: rgba(255,255,255,0.06); color: #FAFAF7; }
.lt-signout-btn svg { flex-shrink: 0; }

/* ─────────────────────────────────────────────
   TOPBAR / HEADER
───────────────────────────────────────────── */
.lt-header {
  display: flex; align-items: center; gap: 14px;
  padding: 0 36px; height: 72px; flex-shrink: 0;
  background: color-mix(in srgb, var(--paper) 86%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
  position: sticky; top: 0; z-index: 30;
}
.lt-header-title {
  font-family: 'Fraunces','Fraunces Variable',Georgia,serif !important;
  font-size: 26px; font-weight: 400; color: var(--ink-900);
  letter-spacing: -0.035em; line-height: 1.05;
}
.lt-header-date  { font-size: 12px; color: var(--ink-500); margin-top: 1px; }
.lt-header-spacer{ flex: 1; }

.lt-meta-chip {
  display: flex; align-items: center; gap: 7px; height: 36px; padding: 0 13px;
  border-radius: 9px; border: 1px solid var(--line); background: var(--card);
  font-size: 13px; color: var(--ink-600); font-weight: 500; white-space: nowrap;
}

/* Profile hover card */
.lt-profile-wrap { position: relative; }
.lt-profile-avatar {
  width: 38px; height: 38px; border-radius: 9px; background: var(--mineral-700);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 600; font-size: 13px; cursor: pointer;
  flex-shrink: 0; transition: box-shadow 0.15s;
}
.lt-profile-wrap:hover .lt-profile-avatar { box-shadow: 0 0 0 3px rgba(14,124,102,.22), 0 0 0 6px rgba(14,124,102,.08); }
.lt-profile-tooltip {
  display: none; position: fixed; top: 70px; right: 16px;
  background: var(--card); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 18px 20px; min-width: 238px;
  box-shadow: var(--shadow-lg); z-index: 200;
}
.lt-profile-wrap:hover .lt-profile-tooltip { display: block; }
.lt-profile-tooltip::before { content:''; position:absolute; top:-12px; left:0; right:0; height:12px; }
.lt-tt-avatar {
  width: 48px; height: 48px; border-radius: 11px; background: var(--mineral-700);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 600; font-size: 17px; margin-bottom: 12px;
}
.lt-tt-name { font-size: 14.5px; font-weight: 700; color: var(--ink-900); }
.lt-tt-sub  { font-size: 12px; color: var(--ink-500); margin-top: 3px; }
.lt-tt-divider { height: 1px; background: var(--line); margin: 12px 0; }
.lt-tt-action {
  display: flex; align-items: center; gap: 9px; width: 100%;
  padding: 9px 11px; border-radius: 10px; border: none; background: transparent;
  font-size: 13px; font-weight: 500; cursor: pointer; text-align: left;
  font-family: 'Inter Tight', sans-serif; transition: background 0.13s;
}
.lt-tt-action.profile { color: var(--mineral-700); }
.lt-tt-action.profile:hover { background: var(--primary-light); }
.lt-tt-action.signout { color: var(--rose); }
.lt-tt-action.signout:hover { background: var(--rl); }

/* mobile overlay */
.lt-overlay { display: none; position: fixed; inset: 0; background: rgba(11,15,14,.45); z-index: 99; }
.lt-overlay.open { display: block; }
.lt-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 4px; color: var(--ink-900); align-items: center; justify-content: center; }

/* ─────────────────────────────────────────────
   MAIN LAYOUT
───────────────────────────────────────────── */
.lt-main    { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; background: var(--paper); }
.lt-scroll  { flex: 1; overflow-y: auto; }
.lt-content { padding: 30px 36px 56px; display: flex; flex-direction: column; gap: 22px; max-width: 1440px; width: 100%; }

/* ─────────────────────────────────────────────
   STAT CARDS
───────────────────────────────────────────── */
.lt-stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
.lt-stat-card {
  background: var(--card); border: 1px solid var(--line);
  border-radius: 14px; padding: 18px 20px; position: relative; overflow: hidden;
  transition: box-shadow 0.2s;
}
.lt-stat-card:hover { box-shadow: var(--shadow-sm); }
.lt-stat-card.s-neutral { background: var(--card); color: var(--ink-900); border-color: var(--line); }
.lt-stat-card.s-amber   { background: var(--al);   color: var(--amber);   border-color: transparent; }
.lt-stat-card.s-mineral { background: var(--mineral-100); color: var(--mineral-700); border-color: transparent; }
.lt-stat-card.s-blue    { background: var(--bl);   color: var(--blue);    border-color: transparent; }
.lt-stat-card.s-red     { background: var(--rl);   color: var(--rose);   border-color: transparent; }
.lt-stat-value { font-family:'Fraunces','Fraunces Variable',Georgia,serif !important; font-size: 36px; font-weight: 400; letter-spacing: -0.04em; line-height: 1; margin-top: 10px; }
.lt-stat-label { font-size: 12.5px; font-weight: 600; letter-spacing: 0.02em; opacity: 0.78; color: inherit; }

/* ─────────────────────────────────────────────
   CARDS & PANELS
───────────────────────────────────────────── */
.lt-card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 22px 24px; }
.lt-card-title { font-family:'Fraunces',Georgia,serif; font-size: 21px; font-weight: 400; color: var(--ink-900); margin-bottom: 16px; letter-spacing: -0.03em; }

/* ─────────────────────────────────────────────
   FORM ELEMENTS
───────────────────────────────────────────── */
.lt-field-label {
  font-size: 0.6875rem; font-weight: 600; color: var(--ink-500);
  letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; display: block;
}
.lt-field-input, .lt-field-select, .lt-field-textarea {
  width: 100%; height: 44px; padding: 0 14px;
  border: 1px solid var(--line); border-radius: 10px;
  font-size: 14px; font-family: 'Inter Tight', sans-serif;
  color: var(--ink-900); background: var(--card); outline: none;
  transition: border-color 0.15s, box-shadow 0.15s; box-sizing: border-box;
}
.lt-field-select { cursor: pointer; }
.lt-field-textarea { height: auto; padding: 13px 14px; line-height: 1.55; resize: vertical; min-height: 76px; }
.lt-field-input:focus, .lt-field-select:focus, .lt-field-textarea:focus {
  border-color: var(--mineral-700); box-shadow: 0 0 0 3px rgba(14,124,102,.12);
}
.lt-field-input::placeholder, .lt-field-textarea::placeholder { color: var(--ink-400); }
.lt-form-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.lt-form-group { display: flex; flex-direction: column; gap: 0; margin-bottom: 16px; }

/* ─────────────────────────────────────────────
   BUTTONS
───────────────────────────────────────────── */
.lt-btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 42px; padding: 0 18px; border-radius: 10px; border: 1px solid var(--mineral-700); cursor: pointer;
  background: var(--mineral-700); color: #FAFAF7; font-size: 14px; font-weight: 600;
  font-family: inherit; white-space: nowrap; transition: all 0.15s;
  box-shadow: 0 1px 0 rgba(11,15,14,0.08), inset 0 1px 0 rgba(255,255,255,0.08);
}
.lt-btn-primary:hover { background: var(--mineral-800); border-color: var(--mineral-800); }
.lt-btn-primary svg { width: 16px; height: 16px; }

.lt-btn-secondary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 42px; padding: 0 18px; border-radius: 10px; cursor: pointer;
  font-family: inherit; background: var(--card); border: 1px solid var(--line);
  color: var(--ink-800); font-size: 14px; font-weight: 600; white-space: nowrap; transition: all 0.15s;
}
.lt-btn-secondary:hover { background: var(--ink-50); border-color: var(--ink-300); }

.lt-btn-outline {
  display: inline-flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 13px; border-radius: 8px;
  border: 1px solid var(--line); background: var(--card);
  color: var(--ink-800); font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap;
}
.lt-btn-outline:hover { background: var(--ink-50); border-color: var(--ink-300); }
.lt-btn-outline.danger { color: var(--rose); border-color: rgba(180,58,44,0.3); }
.lt-btn-outline.danger:hover { background: var(--rl); border-color: var(--rose); }

.lt-btn-add-med {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 13px; border-radius: 12px;
  background: var(--mineral-100); color: var(--mineral-700);
  border: 1.5px dashed var(--mineral-400); font-size: 13.5px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: background 0.15s;
}
.lt-btn-add-med:hover { background: var(--mineral-200); }

/* ─────────────────────────────────────────────
   CHIPS
───────────────────────────────────────────── */
.lt-chip {
  display: inline-flex; align-items: center; gap: 5px;
  height: 24px; font-size: 12px; font-weight: 600; padding: 0 10px;
  border-radius: 999px; white-space: nowrap;
}
.lt-chip.primary { background: var(--mineral-100); color: var(--mineral-700); }
.lt-chip.amber   { background: var(--al);  color: var(--amber); }
.lt-chip.rose    { background: var(--rl);  color: var(--rose); }
.lt-chip.blue    { background: var(--bl);  color: var(--blue); }
.lt-chip.green   { background: var(--mineral-100); color: var(--mineral-700); }
.lt-chip.purple  { background: var(--pul); color: var(--purple); }
.lt-chip.gray    { background: var(--ink-100); color: var(--ink-600); }

/* ─────────────────────────────────────────────
   PATIENT ROWS (Queue / Schedule list)
───────────────────────────────────────────── */
.lt-patient-row {
  display: flex; align-items: center; gap: 13px;
  padding: 13px 14px; border-radius: 12px; cursor: pointer;
  border: 1px solid transparent; transition: all 0.15s; margin-bottom: 8px;
}
.lt-patient-row:last-child { margin-bottom: 0; }
.lt-patient-row.selected { background: var(--mineral-100); border-color: var(--mineral-700); }
.lt-patient-row.normal   { background: var(--card); border-color: var(--line); }
.lt-patient-row.normal:hover { border-color: var(--mineral-300); background: var(--ink-50); }

.lt-token-badge {
  width: 38px; height: 38px; border-radius: 9px;
  background: var(--mineral-700); color: white;
  font-size: 12.5px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.lt-token-badge.urgent    { background: var(--amber); }
.lt-token-badge.emergency { background: var(--rose); }

/* ─────────────────────────────────────────────
   QUEUE / SCHEDULE TWO-PANE LAYOUT
───────────────────────────────────────────── */
.lt-queue-grid { flex: 1; display: grid; grid-template-columns: 1fr 400px; overflow: hidden; gap: 0; }
.lt-queue-list { overflow-y: auto; padding: 22px 24px; display: flex; flex-direction: column; gap: 0; }
.lt-queue-detail { border-left: 1px solid var(--line); overflow-y: auto; background: var(--paper); }

.lt-detail-header { background: var(--mineral-800); color: white; padding: 22px 22px 20px; }
.lt-detail-avatar {
  width: 48px; height: 48px; border-radius: 11px; background: rgba(255,255,255,0.16);
  display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px; flex-shrink: 0;
}
.lt-detail-section { border: 1px solid var(--line); border-radius: 11px; padding: 14px 16px; background: var(--card); }
.lt-section-label {
  font-size: 0.6875rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--ink-500); margin-bottom: 10px;
}

.lt-vitals-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
.lt-vital-card { border-radius: 11px; padding: 13px 15px; border: 1px solid var(--line); background: var(--card); }
.lt-vital-value { font-family:'Fraunces',Georgia,serif; font-size: 22px; font-weight: 400; letter-spacing: -0.03em; }
.lt-vital-label { font-size: 11px; color: var(--ink-500); margin-bottom: 3px; font-weight: 600; }
.lt-vital-unit  { font-size: 10.5px; color: var(--ink-500); margin-left: 2px; }

.lt-med-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 13px; background: var(--card); border-radius: 10px;
  border: 1px solid var(--line);
}

.lt-start-btn {
  background: var(--mineral-700); color: white; border: none;
  border-radius: 12px; padding: 14px; font-size: 14px; font-weight: 700;
  cursor: pointer; width: 100%; font-family: inherit; transition: background 0.15s;
}
.lt-start-btn:hover { background: var(--mineral-800); }

/* ─────────────────────────────────────────────
   FILTERS / SEARCH
───────────────────────────────────────────── */
.lt-filters { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; flex-wrap: wrap; }
.lt-filter-select { height: 40px; padding: 0 13px; border: 1px solid var(--line); border-radius: 9px; font-size: 13.5px; font-family: inherit; color: var(--ink-900); background: var(--card); outline: none; cursor: pointer; }
.lt-filter-wrap { position: relative; flex: 1; min-width: 200px; }
.lt-filter-wrap svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--ink-400); pointer-events: none; }
.lt-filter-search { width: 100%; height: 40px; padding: 0 14px 0 38px; border: 1px solid var(--line); border-radius: 9px; font-size: 13.5px; font-family: inherit; color: var(--ink-900); background: var(--card); outline: none; box-sizing: border-box; transition: border-color 0.15s; }
.lt-filter-search:focus { border-color: var(--mineral-700); box-shadow: 0 0 0 3px rgba(14,124,102,.12); }

/* ─────────────────────────────────────────────
   WAIT TIMER
───────────────────────────────────────────── */
.lt-queue-pill { display: inline-flex; align-items: center; gap: 5px; background: var(--al); border-radius: 999px; padding: 3px 11px; font-size: 12px; font-weight: 600; color: var(--amber); }
.lt-wait-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--amber); animation: lt-pulse-dot 1.5s ease-in-out infinite; display: inline-block; }

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
.lt-empty { text-align: center; padding: 32px 16px; color: var(--ink-500); font-size: 13.5px; font-weight: 500; background: var(--ink-50); border-radius: var(--radius-sm); border: 1px dashed var(--line); }

/* ─────────────────────────────────────────────
   TABLE  (My Patients)
───────────────────────────────────────────── */
.lt-table { width: 100%; border-collapse: collapse; }
.lt-th { text-align: left; font-size: 0.6875rem; font-weight: 600; color: var(--ink-500); text-transform: uppercase; letter-spacing: 0.1em; padding: 13px 18px; border-bottom: 1px solid var(--line); white-space: nowrap; }
.lt-td { padding: 14px 18px; font-size: 13.5px; border-bottom: 1px solid var(--line); vertical-align: middle; color: var(--ink-700); }
.lt-tr { transition: background 0.12s; }
.lt-tr:hover .lt-td { background: var(--ink-50); }
.lt-tr:last-child .lt-td { border-bottom: none; }
.lt-tbl-action {
  display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px;
  border-radius: 9px; border: 1px solid var(--line); background: var(--card); cursor: pointer;
  color: var(--ink-600); transition: all 0.13s;
}
.lt-tbl-action:hover { background: var(--ink-50); color: var(--ink-800); }

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
.lt-modal-backdrop {
  position: fixed; inset: 0; background: rgba(11,15,14,.40); backdrop-filter: blur(3px);
  z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px;
}
.lt-modal {
  background: var(--card); border-radius: 16px; width: 100%; max-width: 480px;
  box-shadow: var(--shadow-lg); overflow: hidden; max-height: 90vh; overflow-y: auto;
  border: 1px solid var(--line); animation: lt-slide-up 0.25s ease both;
}
.lt-modal-lg { max-width: 660px; }
.lt-modal-header { padding: 22px 26px 18px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; }
.lt-modal-title { font-family:'Fraunces','Fraunces Variable',Georgia,serif !important; font-size: 20px; font-weight: 400; letter-spacing: -0.02em; }
.lt-modal-body { padding: 22px 26px; }
.lt-modal-footer { padding: 16px 26px; border-top: 1px solid var(--line); display: flex; justify-content: flex-end; gap: 12px; background: var(--ink-50); }
.lt-modal-close {
  width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--line); background: var(--card);
  cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--ink-500); font-size: 16px; transition: all 0.15s;
}
.lt-modal-close:hover { background: var(--ink-50); color: var(--ink-800); }

/* ─────────────────────────────────────────────
   CONSULTATION FORM (full takeover modal)
───────────────────────────────────────────── */
.lt-consult-modal {
  background: var(--card); border-radius: 16px; width: 100%; max-width: 880px; height: 86vh;
  display: flex; flex-direction: column; box-shadow: var(--shadow-lg); overflow: hidden;
  border: 1px solid var(--line); animation: lt-slide-up 0.25s ease both;
}
.lt-consult-header { position: relative; background: linear-gradient(135deg, var(--mineral-800), var(--mineral-900)); color: white; padding: 24px 28px 0; flex-shrink: 0; }
.lt-consult-tabs { display: flex; gap: 2px; overflow-x: auto; margin-top: 18px; }
.lt-consult-tab {
  padding: 11px 16px; border-radius: 9px 9px 0 0; border: none; cursor: pointer;
  font-size: 13px; font-weight: 600; font-family: inherit; white-space: nowrap;
  background: transparent; color: rgba(255,255,255,0.6); transition: all 0.15s;
}
.lt-consult-tab.active { background: var(--paper); color: var(--mineral-800); }
.lt-consult-tab:not(.active):hover { color: white; background: rgba(255,255,255,0.08); }
.lt-consult-body { flex: 1; overflow-y: auto; padding: 26px 28px; background: var(--paper); }
.lt-consult-footer { padding: 16px 28px; border-top: 1px solid var(--line); display: flex; justify-content: flex-end; gap: 12px; background: var(--card); flex-shrink: 0; }

/* ─────────────────────────────────────────────
   MULTI-SELECT
───────────────────────────────────────────── */
.lt-multiselect-field {
  width: 100%; min-height: 44px; padding: 6px 8px;
  border: 1px solid var(--line); border-radius: 10px; background: var(--card);
  display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
  cursor: text; box-sizing: border-box; transition: border-color 0.15s, box-shadow 0.15s;
}
.lt-multiselect-field:focus-within { border-color: var(--mineral-700); box-shadow: 0 0 0 3px rgba(14,124,102,.12); }
.lt-multiselect-field input {
  flex: 1; min-width: 90px; border: none; outline: none; background: transparent;
  font-size: 14px; font-family: 'Inter Tight', sans-serif; color: var(--ink-900); padding: 4px 2px;
}
.lt-multiselect-field input::placeholder { color: var(--ink-400); }
.lt-multiselect-panel {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 60;
  background: var(--card); border: 1px solid var(--line); border-radius: 11px;
  box-shadow: var(--shadow-lg); max-height: 240px; overflow-y: auto; padding: 6px;
}
.lt-multiselect-option {
  display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px;
  font-size: 13.5px; color: var(--ink-800); cursor: pointer; transition: background 0.13s;
}
.lt-multiselect-option:hover { background: var(--ink-50); }
.lt-multiselect-option.is-selected { background: var(--mineral-100); color: var(--mineral-800); font-weight: 600; }
.lt-multiselect-checkbox {
  width: 17px; height: 17px; border-radius: 5px; border: 1.5px solid var(--ink-300);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.13s;
}
.lt-multiselect-checkbox.checked { background: var(--mineral-700); border-color: var(--mineral-700); }

/* Inline panel: renders in normal flow so the row / card / modal grows to fit
   it (and collapses when closed) instead of floating over and clipping. */
.lt-ms-inline-root { position: relative; }
.lt-multiselect-panel.lt-ms-inline {
  position: static; top: auto; left: auto; right: auto;
  width: 100%; margin-top: 6px; box-shadow: none;
  border-color: var(--line);
}

/* ─────────────────────────────────────────────
   MEDICATIONS TAB
───────────────────────────────────────────── */
.lt-med-edit-row {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 14px; background: var(--card); border-radius: 11px;
  border: 1px solid var(--line); margin-bottom: 10px;
}
.lt-med-add-row {
  display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px;
  padding: 16px; background: var(--mineral-100); border: 1.5px solid var(--mineral-300);
  border-radius: 12px; margin-bottom: 12px;
}

/* ─────────────────────────────────────────────
   HISTORY TAB
───────────────────────────────────────────── */
.lt-history-row {
  display: flex; gap: 16px; padding: 14px 16px; background: var(--card);
  border: 1px solid var(--line); border-radius: 11px;
}
.lt-history-date { width: 90px; flex-shrink: 0; font-size: 12px; font-weight: 600; color: var(--mineral-700); font-family: 'JetBrains Mono', monospace; }

/* ─────────────────────────────────────────────
   ATTACHMENTS TAB
───────────────────────────────────────────── */
.lt-attachment-row {
  display: flex; align-items: center; gap: 13px; padding: 13px 15px;
  background: var(--card); border: 1px solid var(--line); border-radius: 11px;
}
.lt-attachment-icon {
  width: 38px; height: 38px; border-radius: 9px; background: var(--mineral-100);
  color: var(--mineral-700); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

/* ─────────────────────────────────────────────
   MY SCHEDULE — day strip
───────────────────────────────────────────── */
.lt-schedule-week { display: grid; grid-template-columns: repeat(7,1fr); gap: 8px; }
.lt-week-day { text-align: center; padding: 13px 8px; border-radius: 12px; cursor: pointer; transition: all 0.13s; }
.lt-week-day.today { background: var(--mineral-700); border: none; }
.lt-week-day.other  { background: var(--card); border: 1px solid var(--line); }
.lt-week-day:not(.today):hover { border-color: var(--mineral-300); }

/* ─────────────────────────────────────────────
   MESSAGES (class names unchanged from original — restyled here)
───────────────────────────────────────────── */
.lt-msg-layout { flex: 1; display: grid; grid-template-columns: 300px 1fr; overflow: hidden; }
.lt-msg-sidebar { border-right: 1px solid var(--line); overflow-y: auto; background: var(--card); }
.lt-msg-list-header { padding: 16px 18px; border-bottom: 1px solid var(--line); font-family:'Fraunces',Georgia,serif; font-weight: 400; font-size: 18px; }
.lt-msg-convo-item { padding: 14px 18px; cursor: pointer; border-left: 3px solid transparent; transition: all 0.13s; border-bottom: 1px solid var(--line); }
.lt-msg-convo-item.active { background: var(--mineral-100); border-left-color: var(--mineral-700); }
.lt-msg-convo-item:not(.active):hover { background: var(--ink-50); }
.lt-msg-unread { background: var(--mineral-700); color: white; border-radius: 999px; font-size: 10px; font-weight: 700; padding: 1px 7px; flex-shrink: 0; }
.lt-msg-main { display: flex; flex-direction: column; overflow: hidden; }
.lt-msg-thread-header { padding: 16px 22px; border-bottom: 1px solid var(--line); background: var(--card); font-weight: 700; font-size: 15px; }
.lt-msg-thread { flex: 1; overflow-y: auto; padding: 22px; display: flex; flex-direction: column; gap: 12px; background: var(--paper); }
.lt-msg-bubble { max-width: 68%; padding: 10px 14px; border-radius: 14px; font-size: 13.5px; line-height: 1.6; }
.lt-msg-bubble.doctor  { background: var(--mineral-700); color: white; }
.lt-msg-bubble.patient { background: var(--card); border: 1px solid var(--line); color: var(--text); }
.lt-msg-bubble-time { font-size: 10.5px; opacity: 0.6; margin-top: 4px; text-align: right; }
.lt-msg-compose { padding: 14px 22px; border-top: 1px solid var(--line); background: var(--card); display: flex; gap: 10px; }
.lt-msg-input { flex: 1; height: 42px; padding: 0 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 13.5px; outline: none; background: var(--bg); font-family: inherit; color: var(--text); }
.lt-msg-input:focus { border-color: var(--mineral-700); }
.lt-msg-send { background: var(--mineral-700); color: white; border: none; border-radius: 10px; padding: 0 18px; height: 42px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.lt-msg-send:hover { background: var(--mineral-800); }

/* ─────────────────────────────────────────────
   RESPONSIVE
───────────────────────────────────────────── */
@media (max-width: 1080px) {
  .lt-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; transform: translateX(-100%); }
  .lt-sidebar.mobile-open { transform: translateX(0); }
  .lt-hamburger { display: flex !important; }
  .lt-overlay { display: none; }
  .lt-overlay.open { display: block; }
  .lt-queue-grid { grid-template-columns: 1fr; }
  .lt-queue-detail { display: none; }
  .lt-msg-layout { grid-template-columns: 1fr; }
  .lt-msg-sidebar { display: none; }
  .lt-content { padding: 20px 18px 40px; }
  .lt-header { padding: 0 18px; }
  .lt-med-add-row { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 760px) {
  .lt-form-row { grid-template-columns: 1fr; }
  .lt-vitals-grid { grid-template-columns: 1fr !important; }
  .lt-schedule-week { grid-template-columns: repeat(4,1fr); }
  .lt-med-add-row { grid-template-columns: 1fr; }
}

/* Token / ID cells — JetBrains Mono */
.lt-root [style*="monospace"] { font-family: 'JetBrains Mono', 'Courier New', monospace !important; letter-spacing: -0.01em; }

/* ─────────────────────────────────────────────
   LAB-SPECIFIC ADDITIONS (built on the same tokens)
───────────────────────────────────────────── */

/* Section header row: title + right-aligned actions */
.lt-section-head { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:16px; flex-wrap:wrap; }
.lt-section-head .lt-card-title { margin-bottom:0; }
.lt-head-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }

/* Dashboard two-column grid */
.lt-dash-grid { display:grid; grid-template-columns:2fr 1fr; gap:22px; align-items:start; }
.lt-dash-col  { display:flex; flex-direction:column; gap:22px; min-width:0; }

/* Generic list rows used by activity feed / notifications / alerts */
.lt-feed-row { display:flex; align-items:flex-start; gap:12px; padding:12px 4px; border-bottom:1px solid var(--line); }
.lt-feed-row:last-child { border-bottom:none; }
.lt-feed-dot { width:34px; height:34px; border-radius:9px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:var(--mineral-100); color:var(--mineral-700); }
.lt-feed-dot.amber { background:var(--al); color:var(--amber); }
.lt-feed-dot.rose  { background:var(--rl); color:var(--rose); }
.lt-feed-dot.blue  { background:var(--bl); color:var(--blue); }
.lt-feed-title { font-size:13.5px; font-weight:600; color:var(--ink-800); }
.lt-feed-sub   { font-size:12px; color:var(--ink-500); margin-top:2px; }
.lt-feed-time  { font-size:11px; color:var(--ink-400); margin-left:auto; white-space:nowrap; flex-shrink:0; }

/* Quick action tiles */
.lt-qa-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.lt-qa-btn { display:flex; align-items:center; gap:11px; padding:14px; border-radius:12px; border:1px solid var(--line); background:var(--card); cursor:pointer; font-family:inherit; font-size:13.5px; font-weight:600; color:var(--ink-800); text-align:left; transition:all .15s; }
.lt-qa-btn:hover { border-color:var(--mineral-300); background:var(--mineral-100); color:var(--mineral-700); }
.lt-qa-icon { width:34px; height:34px; border-radius:9px; background:var(--mineral-100); color:var(--mineral-700); display:flex; align-items:center; justify-content:center; flex-shrink:0; }

/* Result-entry parameter rows (Test/Range/Result/Flag) */
.lt-param-row { display:grid; grid-template-columns:1.6fr 1.2fr 1fr 110px; gap:12px; align-items:center; padding:12px 14px; border:1px solid var(--line); border-radius:11px; margin-bottom:10px; background:var(--card); }
.lt-param-row:last-child { margin-bottom:0; }

/* Processing timeline */
.lt-timeline { display:flex; flex-direction:column; gap:0; }
.lt-step { display:flex; gap:13px; position:relative; padding-bottom:18px; }
.lt-step:last-child { padding-bottom:0; }
.lt-step-dot { width:26px; height:26px; border-radius:50%; flex-shrink:0; border:2px solid var(--line); background:var(--card); display:flex; align-items:center; justify-content:center; z-index:1; color:var(--ink-400); }
.lt-step.done .lt-step-dot   { background:var(--mineral-700); border-color:var(--mineral-700); color:#fff; }
.lt-step.active .lt-step-dot { background:var(--mineral-100); border-color:var(--mineral-700); color:var(--mineral-700); }
.lt-step::before { content:''; position:absolute; left:12px; top:26px; bottom:0; width:2px; background:var(--line); }
.lt-step:last-child::before { display:none; }
.lt-step.done::before { background:var(--mineral-700); }
.lt-step-title { font-size:13.5px; font-weight:600; color:var(--ink-800); }
.lt-step-sub   { font-size:11.5px; color:var(--ink-500); margin-top:2px; }

/* Timer pill */
.lt-timer-pill { display:inline-flex; align-items:center; gap:6px; background:var(--mineral-100); color:var(--mineral-700); border-radius:999px; padding:5px 13px; font-size:13px; font-weight:700; font-family:'JetBrains Mono',monospace; }

/* Tabs (Inventory categories, Reports tabs) */
.lt-tabs { display:flex; gap:4px; flex-wrap:wrap; border-bottom:1px solid var(--line); margin-bottom:18px; }
.lt-tab { padding:10px 15px; border:none; background:transparent; cursor:pointer; font-family:inherit; font-size:13.5px; font-weight:600; color:var(--ink-500); border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .15s; }
.lt-tab.active { color:var(--mineral-700); border-bottom-color:var(--mineral-700); }
.lt-tab:not(.active):hover { color:var(--ink-800); }

/* Small inline status dot */
.lt-dot { width:8px; height:8px; border-radius:50%; display:inline-block; flex-shrink:0; }
.lt-dot.green { background:var(--mineral-600); } .lt-dot.amber { background:var(--amber); } .lt-dot.rose { background:var(--rose); }

/* Toast */
.lt-toast { position:fixed; bottom:26px; left:50%; transform:translateX(-50%); background:var(--ink-900); color:var(--paper); padding:12px 20px; border-radius:11px; font-size:13.5px; font-weight:600; box-shadow:var(--shadow-lg); z-index:400; animation:lt-slide-up .25s ease both; }

/* Card padding helper for table cards */
.lt-card.pad0 { padding:0; overflow:hidden; }
.lt-card.pad0 .lt-card-head { padding:18px 22px; border-bottom:1px solid var(--line); }

/* Definition list for detail modals */
.lt-dl { display:grid; grid-template-columns:130px 1fr; gap:10px 14px; }
.lt-dl dt { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:var(--ink-500); }
.lt-dl dd { font-size:13.5px; color:var(--ink-800); margin:0; }

/* Responsive */
@media (max-width:1080px){ .lt-dash-grid{ grid-template-columns:1fr; } .lt-param-row{ grid-template-columns:1fr 1fr; } .lt-qa-grid{ grid-template-columns:1fr; } }

/* ============================================================ *
 *  RX1 additions — queue tags, auto-fields, multiselect chips,
 *  attachments, report filters, profile edit. Appended (never
 *  rewriting existing selectors) per the CSS-transform rule.
 * ============================================================ */

/* Test-name pills (queues, collection, processing) */
.lt-test-tag {
  display:inline-flex; align-items:center; gap:4px;
  padding:3px 9px; border-radius:999px; font-size:11.5px; font-weight:600;
  background:var(--mineral-100); color:var(--mineral-800);
  border:1px solid rgba(14,124,102,.18); white-space:nowrap; line-height:1.4;
}
.lt-test-tag-wrap { display:flex; flex-wrap:wrap; gap:5px; }

/* Read-only auto-populated field + hint */
.lt-field-readonly {
  width:100%; min-height:44px; padding:11px 13px; box-sizing:border-box;
  border:1px solid var(--line); border-radius:10px; background:var(--ink-50);
  font-family:'JetBrains Mono', monospace; font-size:14px; letter-spacing:.5px;
  color:var(--ink-800); display:flex; align-items:center; gap:8px;
}
.lt-field-hint { font-size:11.5px; color:var(--muted); margin-top:5px; }

/* "Tests To Be Conducted" box */
.lt-tests-box {
  width:100%; box-sizing:border-box; min-height:44px; padding:10px 12px;
  border:1px solid var(--line); border-radius:10px; background:var(--card);
  display:flex; flex-wrap:wrap; gap:6px; align-items:center;
}
.lt-tests-box .lt-empty-hint { font-size:13px; color:var(--ink-400); }

/* Inline validation error (Add External dialog) */
.lt-inline-error { font-size:11.5px; color:var(--danger,#c0392b); margin-top:5px; }

/* Queue action bar — keeps Accept / Generate Barcode aligned */
.lt-queue-actionbar { display:flex; gap:8px; justify-content:flex-end; }

/* MultiSelect chips (inside field) + compact variant for table cells */
.lt-ms-chip {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 6px 3px 10px; border-radius:999px; font-size:12px; font-weight:600;
  background:var(--mineral-100); color:var(--mineral-800);
  border:1px solid rgba(14,124,102,.2); line-height:1.5;
}
.lt-ms-chip-x {
  border:none; background:transparent; cursor:pointer; padding:0;
  width:15px; height:15px; border-radius:50%; font-size:10px; line-height:1;
  color:var(--mineral-700); display:flex; align-items:center; justify-content:center;
}
.lt-ms-chip-x:hover { background:rgba(14,124,102,.18); }
.lt-multiselect-field.lt-ms-compact {
  min-height:38px; padding:4px 6px; border-radius:9px; font-size:13px;
}
.lt-ms-compact input { font-size:13px; min-width:60px; padding:2px; }

/* Result attachments list */
.lt-attach-list { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
.lt-attach-pill {
  display:inline-flex; align-items:center; gap:7px;
  padding:6px 11px; border-radius:9px; font-size:12.5px; font-weight:500;
  background:var(--ink-50); border:1px solid var(--line); color:var(--ink-800);
}
.lt-attach-pill svg { color:var(--mineral-700); flex-shrink:0; }
.lt-attach-pill .lt-attach-x {
  border:none; background:transparent; cursor:pointer; color:var(--muted);
  font-size:13px; padding:0 0 0 2px; line-height:1;
}
.lt-attach-pill .lt-attach-x:hover { color:var(--danger,#c0392b); }

/* Reports — enhanced filter card */
.lt-report-filters { padding:18px 20px; margin-bottom:18px; }
.lt-report-filter-grid {
  display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr));
  gap:14px 16px; align-items:end;
}
.lt-report-filter-actions {
  display:flex; gap:10px; justify-content:flex-end; align-items:center;
  margin-top:16px; flex-wrap:wrap;
}

/* Profile edit — inputs + success banner */
.lt-profile-input {
  border:1px solid var(--line); border-radius:8px; background:var(--card);
  font-family:'Inter Tight', sans-serif; font-size:13px; color:var(--ink-900);
  padding:7px 10px; outline:none; transition:border-color .15s, box-shadow .15s;
  min-width:140px; text-align:right;
}
.lt-profile-input:focus { border-color:var(--mineral-700); box-shadow:0 0 0 3px rgba(14,124,102,.12); }
.lt-profile-input.center { text-align:center; display:block; width:70%; margin:4px auto 0; font-weight:700; }
.lt-profile-input.center.sub { font-weight:500; font-size:12.5px; color:var(--muted); }
.lt-profile-banner {
  display:flex; align-items:center; gap:9px; margin:0 24px;
  padding:11px 14px; border-radius:10px; font-size:13px; font-weight:600;
  background:var(--mineral-100); color:var(--mineral-800);
  border:1px solid rgba(14,124,102,.25);
  animation:lt-banner-in .25s ease;
}
.lt-profile-banner svg { color:var(--mineral-700); flex-shrink:0; }
@keyframes lt-banner-in { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }


/* ============================================================================
   MOBILE RESPONSIVENESS — appended block (batch 3, #6)
   ============================================================================ */
@media (max-width: 1080px){
  .lt-root *{ box-sizing: border-box; }
}
@media (max-width: 900px){
  .lt-stat-row > *, .lt-qa-grid > *, .lt-vitals-grid > *, .lt-dash-grid > *{ min-width: 0; }

  .lt-meta-chip{ display: none !important; }
  .lt-header-date{ display: none; }
  .lt-header{ gap: 10px; padding: 0 14px; }
  .lt-dash-grid, .lt-queue-grid{ grid-template-columns: minmax(0,1fr) !important; }
  .lt-stat-row, .lt-qa-grid, .lt-vitals-grid{ grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
  .lt-table{ display: block; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
  .lt-modal, .lt-consult-modal{ max-width: 100% !important; }
  .lt-modal-backdrop{ padding: 10px; }
}
@media (max-width: 520px){
  .lt-stat-row, .lt-qa-grid, .lt-vitals-grid{ grid-template-columns: minmax(0,1fr) !important; }
}

/* ============================================================================
   SETTINGS — Profile + Billing & plans  (appended block — Settings section)
   New names only · no existing selectors touched. Mirrors the Hospital Admin
   Settings CSS, re-namespaced lt-* with the lab portal's design tokens.
   Reuses existing primitives: .lt-table/.lt-th/.lt-td/.lt-tr, .lt-chip,
   .lt-toast, .lt-mono, .lt-fade, .lt-content, .lt-scroll, .lt-btn-primary.
   ============================================================================ */

/* Settings shell: left sub-nav + body */
.lt-set-shell { display: grid; grid-template-columns: 210px 1fr; gap: 26px; align-items: start; }
.lt-set-nav   { display: flex; flex-direction: column; gap: 3px; position: sticky; top: 0; }
.lt-set-nav-btn {
  display: flex; align-items: center; gap: 11px;
  padding: 10px 13px; border: none; background: transparent; cursor: pointer;
  border-radius: 10px; font-family: 'Inter Tight', sans-serif;
  font-size: 13.5px; font-weight: 500; color: var(--ink-600);
  text-align: left; transition: background 0.13s, color 0.13s;
}
.lt-set-nav-btn:hover  { background: var(--ink-50); color: var(--ink-900); }
.lt-set-nav-btn.active {
  background: var(--mineral-100); color: var(--mineral-700); font-weight: 600;
  box-shadow: inset 3px 0 0 var(--mineral-700);
}
.lt-set-body { min-width: 0; }

.lt-set-note {
  background: var(--mineral-100); border: 1px solid var(--mineral-300);
  color: var(--mineral-800); border-radius: 12px; padding: 12px 16px;
  font-size: 12.5px; line-height: 1.5; margin-bottom: 18px;
}

/* Profile cards */
.lt-set-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.lt-set-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 14px;
  padding: 20px 22px; box-shadow: 0 1px 2px rgba(11,15,14,.04), 0 2px 8px rgba(11,15,14,.05);
}
.lt-set-card-title {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Fraunces', Georgia, serif; font-size: 15.5px; font-weight: 500;
  color: var(--ink-900); margin-bottom: 14px; padding-bottom: 12px;
  border-bottom: 1px solid var(--ink-100);
}
.lt-kv-row { display: grid; grid-template-columns: 130px 1fr; gap: 12px; padding: 7px 0; align-items: baseline; }
.lt-kv-k   { font-size: 12px; color: var(--ink-500); font-weight: 500; }
.lt-kv-v   { font-size: 13.5px; color: var(--ink-900); font-weight: 500; word-break: break-word; }

/* License rows */
.lt-lic-list, .lt-doc-list { display: flex; flex-direction: column; gap: 8px; }
.lt-lic-row {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 11px 13px; border: 1px solid var(--border); border-radius: 11px; background: var(--ink-50);
}
.lt-lic-main  { min-width: 0; }
.lt-lic-name  { font-size: 13px; font-weight: 600; color: var(--ink-900); }
.lt-lic-no    { font-size: 11.5px; color: var(--ink-500); margin-top: 2px; }
.lt-lic-valid { font-size: 11px; color: var(--ink-500); text-align: right; line-height: 1.45; white-space: nowrap; }
.lt-lic-valid b { color: var(--ink-800); font-size: 12.5px; }

/* Document rows */
.lt-doc-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 13px; border: 1px solid var(--border); border-radius: 11px; background: var(--ink-50);
}
.lt-doc-badge {
  flex-shrink: 0; font-size: 9.5px; font-weight: 700; letter-spacing: 0.06em;
  color: var(--rose); background: var(--rl); border-radius: 6px; padding: 4px 7px;
}
.lt-doc-main { flex: 1; min-width: 0; }
.lt-doc-name { font-size: 13px; font-weight: 500; color: var(--ink-900); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lt-doc-size { font-size: 11px; color: var(--ink-500); margin-top: 1px; }
.lt-doc-dl {
  display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
  background: var(--card); border: 1px solid var(--border); border-radius: 9px;
  padding: 6px 12px; font-size: 12px; font-weight: 600; color: var(--ink-700);
  cursor: pointer; font-family: 'Inter Tight', sans-serif; transition: border-color 0.13s, color 0.13s, background 0.13s;
}
.lt-doc-dl:hover { border-color: var(--mineral-700); color: var(--mineral-700); background: var(--mineral-100); }

/* Subscription summary */
.lt-sub-card {
  display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap;
  background: var(--ink-900); color: #fff; border-radius: 16px; padding: 20px 24px; margin-bottom: 22px;
}
.lt-sub-eyebrow { font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mineral-400); font-weight: 600; }
.lt-sub-plan { font-family: 'Fraunces', Georgia, serif; font-size: 24px; font-weight: 500; margin: 4px 0 6px; }
.lt-sub-meta { font-size: 12.5px; color: var(--ink-300); }
.lt-sub-cancel {
  background: transparent; border: 1px solid rgba(255,255,255,0.28); color: #fff;
  border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: 'Inter Tight', sans-serif; transition: background 0.13s, border-color 0.13s;
}
.lt-sub-cancel:hover { background: rgba(180,58,44,0.22); border-color: var(--rose); color: #FCE3DE; }

/* Plan cards */
.lt-plan-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 26px; }
.lt-plan-card {
  position: relative; background: var(--card); border: 1px solid var(--border); border-radius: 14px;
  padding: 22px 20px; display: flex; flex-direction: column;
  box-shadow: 0 1px 2px rgba(11,15,14,.04), 0 2px 8px rgba(11,15,14,.05); transition: box-shadow 0.15s, border-color 0.15s;
}
.lt-plan-card:hover    { box-shadow: 0 4px 18px rgba(11,15,14,.10); }
.lt-plan-card.popular  { border-color: var(--mineral-700); box-shadow: 0 0 0 1px var(--mineral-700), 0 6px 22px rgba(14,124,102,.14); }
.lt-plan-card.current  { background: var(--mineral-100); border-color: var(--mineral-600); }
.lt-plan-badges { position: absolute; top: -11px; left: 16px; display: flex; gap: 6px; }
.lt-plan-badge {
  font-size: 9.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 999px; white-space: nowrap;
}
.lt-plan-badge.pop { background: var(--mineral-700); color: #fff; }
.lt-plan-badge.cur { background: var(--ink-900); color: #fff; }
.lt-plan-name  { font-size: 16px; font-weight: 700; color: var(--ink-900); margin-top: 4px; }
.lt-plan-price { display: flex; align-items: baseline; gap: 6px; margin: 8px 0 4px; }
.lt-plan-price .amt { font-family: 'Fraunces', Georgia, serif; font-size: 26px; font-weight: 500; color: var(--ink-900); letter-spacing: -0.01em; }
.lt-plan-price .cad { font-size: 12px; color: var(--ink-500); }
.lt-plan-tag   { font-size: 12.5px; color: var(--ink-500); min-height: 32px; }
.lt-plan-seats { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--ink-600); background: var(--ink-50); border: 1px solid var(--border); border-radius: 9px; padding: 7px 10px; margin: 6px 0 14px; }
.lt-plan-feats { list-style: none; margin: 0 0 18px; padding: 0; display: flex; flex-direction: column; gap: 9px; flex: 1; }
.lt-plan-feats li { display: flex; align-items: flex-start; gap: 8px; font-size: 12.5px; color: var(--ink-700); line-height: 1.4; }
.lt-plan-foot  { margin-top: auto; }
.lt-plan-btn {
  width: 100%; background: var(--mineral-700); color: #fff; border: none; border-radius: 10px;
  padding: 11px 14px; font-size: 13px; font-weight: 600; cursor: pointer;
  font-family: 'Inter Tight', sans-serif; transition: background 0.13s;
}
.lt-plan-btn:hover { background: var(--mineral-800); }
.lt-plan-btn.ghost { background: var(--card); color: var(--ink-800); border: 1px solid var(--border); }
.lt-plan-btn.ghost:hover { border-color: var(--mineral-700); color: var(--mineral-700); background: var(--mineral-100); }
.lt-plan-btn.current { background: var(--mineral-200); color: var(--mineral-800); cursor: default; }
.lt-plan-btn:disabled { cursor: default; }

/* Recent invoices card */
.lt-inv-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; box-shadow: 0 1px 2px rgba(11,15,14,.04), 0 2px 8px rgba(11,15,14,.05); overflow: hidden; }
.lt-inv-head { padding: 18px 20px 6px; }
.lt-inv-title { font-family: 'Fraunces', Georgia, serif; font-size: 16px; font-weight: 500; color: var(--ink-900); }
.lt-inv-sub { font-size: 12.5px; color: var(--ink-500); margin-top: 3px; }
.lt-inv-table-wrap { overflow-x: auto; }

/* Payment page */
.lt-pay-back {
  display: inline-flex; align-items: center; gap: 7px; background: transparent; border: none;
  color: var(--ink-600); font-size: 13px; font-weight: 600; cursor: pointer;
  font-family: 'Inter Tight', sans-serif; padding: 0; margin-bottom: 16px; transition: color 0.13s;
}
.lt-pay-back:hover { color: var(--mineral-700); }
.lt-pay-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 18px; align-items: start; }
.lt-pay-demo {
  background: var(--al); border: 1px solid var(--amber); color: var(--amber);
  border-radius: 9px; padding: 8px 12px; font-size: 11.5px; font-weight: 600; margin-bottom: 16px;
}
.lt-pay-label { display: block; font-size: 11.5px; font-weight: 600; color: var(--ink-500); margin: 12px 0 6px; }
.lt-pay-input {
  width: 100%; box-sizing: border-box; padding: 11px 13px; border: 1px solid var(--border);
  border-radius: 10px; font-size: 13.5px; font-family: 'Inter Tight', sans-serif; color: var(--ink-900);
  background: var(--card); outline: none; transition: border-color 0.13s, box-shadow 0.13s;
}
.lt-pay-input:focus { border-color: var(--mineral-700); box-shadow: 0 0 0 3px rgba(14,124,102,.10); }
.lt-pay-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.lt-pay-btn {
  width: 100%; margin-top: 20px; background: var(--mineral-700); color: #fff; border: none;
  border-radius: 11px; padding: 13px; font-size: 14px; font-weight: 700; cursor: pointer;
  font-family: 'Inter Tight', sans-serif; transition: background 0.13s, opacity 0.13s;
}
.lt-pay-btn:hover:not(:disabled) { background: var(--mineral-800); }
.lt-pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.lt-pay-summary { background: var(--ink-50); }
.lt-sum-plan { font-family: 'Fraunces', Georgia, serif; font-size: 19px; font-weight: 500; color: var(--ink-900); margin-top: 4px; }
.lt-sum-tag  { font-size: 12.5px; color: var(--ink-500); margin: 2px 0 14px; }
.lt-sum-line { display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: var(--ink-600); padding: 8px 0; border-top: 1px solid var(--ink-100); }
.lt-sum-line b { color: var(--ink-900); font-weight: 600; }
.lt-sum-total { display: flex; align-items: center; justify-content: space-between; font-size: 14px; font-weight: 700; color: var(--ink-900); padding: 12px 0 4px; border-top: 2px solid var(--ink-200); margin-top: 4px; }
.lt-sum-amt { font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 500; color: var(--mineral-700); }
.lt-sum-note { font-size: 11px; color: var(--ink-500); line-height: 1.5; margin-top: 10px; }

/* Settings responsive */
@media (max-width: 1100px) {
  .lt-plan-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 880px) {
  .lt-set-shell { grid-template-columns: 1fr; gap: 16px; }
  .lt-set-nav   { flex-direction: row; position: static; overflow-x: auto; }
  .lt-set-grid  { grid-template-columns: 1fr; }
  .lt-pay-grid  { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .lt-plan-grid { grid-template-columns: 1fr; }
  .lt-sub-card  { flex-direction: column; align-items: flex-start; }
}

`;
