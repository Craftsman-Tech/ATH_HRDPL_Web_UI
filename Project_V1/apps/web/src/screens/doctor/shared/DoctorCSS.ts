/**
 * ============================================================================
 *  DoctorCSS.ts — Doctor Portal, restyled to the Vexoo design system
 *  (Fraunces display + Inter Tight body + JetBrains Mono, paper/ink/mineral
 *  palette) so the Doctor portal looks and feels identical to the Reception
 *  portal. Every class is prefixed .dr- to stay scoped to this portal.
 * ============================================================================
 */
export const CSS = `
.dr-root {
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

.dr-root .dr-display { font-family:'Fraunces',Georgia,serif; letter-spacing:-0.035em; font-feature-settings:"ss01"; }
.dr-root .dr-mono     { font-family:'JetBrains Mono',Menlo,monospace; }

.dr-root ::-webkit-scrollbar       { width: 9px; height: 9px; }
.dr-root ::-webkit-scrollbar-thumb { background: rgba(11,15,14,0.14); border-radius: 6px; border: 2px solid transparent; background-clip: padding-box; }
.dr-root ::-webkit-scrollbar-track { background: transparent; }
.dr-root ::selection { background: #0E7C66; color: #FAFAF7; }

@keyframes dr-fade      { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@keyframes dr-slide-up  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes dr-pulse-dot { 0%,100%{ opacity:1; } 50%{ opacity:0.3; } }
.dr-fade     { animation: dr-fade 0.30s cubic-bezier(0.2,0.9,0.3,1) both; }
.dr-slide-up { animation: dr-slide-up 0.3s ease both; }

/* ─────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────── */
.dr-sidebar {
  width: 248px; flex-shrink: 0; position: relative;
  background: #0B0F0E; color: #FAFAF7;
  display: flex; flex-direction: column;
  height: 100vh; overflow: hidden;
  border-right: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.25s cubic-bezier(.4,0,.2,1);
  scrollbar-width: none;
}
.dr-sidebar::before {
  content:''; position:absolute; inset:0;
  background-image:linear-gradient(to right,rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.035) 1px,transparent 1px);
  background-size:40px 40px; opacity:0.5; pointer-events:none;
}
.dr-sidebar::after {
  content:''; position:absolute; top:-160px; left:-120px; width:380px; height:380px;
  border-radius:50%; background:rgba(14,124,102,0.22); filter:blur(80px); pointer-events:none;
}
.dr-sidebar > * { position: relative; z-index: 1; }

.dr-logo-row { padding: 22px 22px 24px; display: flex; align-items: center; gap: 12px; }
.dr-logo-icon {
  width: 42px; height: 42px; background: #0E7C66; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.32);
}

.dr-nav { flex: 1; padding: 6px 14px; display: flex; flex-direction: column; gap: 3px; overflow-y: auto; }
.dr-nav-btn {
  position: relative; display: flex; align-items: center; gap: 12px;
  width: 100%; height: 42px; padding: 0 14px; border-radius: 9px;
  border: none; cursor: pointer;
  font-size: 14px; font-family: 'Inter Tight', sans-serif; font-weight: 500;
  text-align: left; transition: background 0.15s, color 0.15s;
}
.dr-nav-btn.active { background: rgba(14,124,102,0.20); color: #FAFAF7; font-weight: 500; }
.dr-nav-btn.active::before {
  content:''; position:absolute; left:-14px; top:9px; bottom:9px; width:3px;
  border-radius: 0 3px 3px 0; background: #1FBFA0;
}
.dr-nav-btn.inactive { background: transparent; color: rgba(250,250,247,0.62); font-weight: 500; }
.dr-nav-btn.inactive:hover { background: rgba(255,255,255,0.05); color: #FAFAF7; }
.dr-nav-btn svg { width: 18px; height: 18px; flex-shrink: 0; }
.dr-nav-badge {
  margin-left: auto; min-width: 20px; height: 20px; padding: 0 6px;
  background: var(--rose); color: #FAFAF7; font-size: 11px; font-weight: 600;
  border-radius: 999px; display: flex; align-items: center; justify-content: center;
}
.dr-nav-btn.active .dr-nav-badge { background: #1FBFA0; color: #062F26; }

/* Sidebar footer */
.dr-sidebar-footer { padding: 14px; border-top: 1px solid rgba(255,255,255,0.07); }
.dr-user-identity {
  display: flex; align-items: center; gap: 11px;
  padding: 10px 12px; border-radius: 10px; margin-bottom: 10px;
  background: rgba(255,255,255,0.04);
}
.dr-user-avatar {
  width: 36px; height: 36px; border-radius: 9px; background: #0E7C66;
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; color: #FAFAF7; font-size: 13px; flex-shrink: 0;
}
.dr-signout-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; height: 38px; border-radius: 9px;
  background: transparent; border: 1px solid rgba(255,255,255,0.1);
  color: rgba(250,250,247,0.7); font-size: 13px; font-weight: 500;
  font-family: inherit; cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.dr-signout-btn:hover { background: rgba(255,255,255,0.06); color: #FAFAF7; }
.dr-signout-btn svg { flex-shrink: 0; }

/* ─────────────────────────────────────────────
   TOPBAR / HEADER
───────────────────────────────────────────── */
.dr-header {
  display: flex; align-items: center; gap: 14px;
  padding: 0 36px; height: 72px; flex-shrink: 0;
  background: color-mix(in srgb, var(--paper) 86%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
  position: sticky; top: 0; z-index: 30;
}
.dr-header-title {
  font-family: 'Fraunces','Fraunces Variable',Georgia,serif !important;
  font-size: 26px; font-weight: 400; color: var(--ink-900);
  letter-spacing: -0.035em; line-height: 1.05;
}
.dr-header-date  { font-size: 12px; color: var(--ink-500); margin-top: 1px; }
.dr-header-spacer{ flex: 1; }

.dr-meta-chip {
  display: flex; align-items: center; gap: 7px; height: 36px; padding: 0 13px;
  border-radius: 9px; border: 1px solid var(--line); background: var(--card);
  font-size: 13px; color: var(--ink-600); font-weight: 500; white-space: nowrap;
}

/* Profile hover card */
.dr-profile-wrap { position: relative; }
.dr-profile-avatar {
  width: 38px; height: 38px; border-radius: 9px; background: var(--mineral-700);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 600; font-size: 13px; cursor: pointer;
  flex-shrink: 0; transition: box-shadow 0.15s;
}
.dr-profile-wrap:hover .dr-profile-avatar { box-shadow: 0 0 0 3px rgba(14,124,102,.22), 0 0 0 6px rgba(14,124,102,.08); }
.dr-profile-tooltip {
  display: none; position: fixed; top: 70px; right: 16px;
  background: var(--card); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 18px 20px; min-width: 238px;
  box-shadow: var(--shadow-lg); z-index: 200;
}
.dr-profile-wrap:hover .dr-profile-tooltip { display: block; }
.dr-profile-tooltip::before { content:''; position:absolute; top:-12px; left:0; right:0; height:12px; }
.dr-tt-avatar {
  width: 48px; height: 48px; border-radius: 11px; background: var(--mineral-700);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 600; font-size: 17px; margin-bottom: 12px;
}
.dr-tt-name { font-size: 14.5px; font-weight: 700; color: var(--ink-900); }
.dr-tt-sub  { font-size: 12px; color: var(--ink-500); margin-top: 3px; }
.dr-tt-divider { height: 1px; background: var(--line); margin: 12px 0; }
.dr-tt-action {
  display: flex; align-items: center; gap: 9px; width: 100%;
  padding: 9px 11px; border-radius: 10px; border: none; background: transparent;
  font-size: 13px; font-weight: 500; cursor: pointer; text-align: left;
  font-family: 'Inter Tight', sans-serif; transition: background 0.13s;
}
.dr-tt-action.profile { color: var(--mineral-700); }
.dr-tt-action.profile:hover { background: var(--primary-light); }
.dr-tt-action.signout { color: var(--rose); }
.dr-tt-action.signout:hover { background: var(--rl); }

/* mobile overlay */
.dr-overlay { display: none; position: fixed; inset: 0; background: rgba(11,15,14,.45); z-index: 99; }
.dr-overlay.open { display: block; }
.dr-hamburger { display: none; background: none; border: none; cursor: pointer; padding: 4px; color: var(--ink-900); align-items: center; justify-content: center; }

/* ─────────────────────────────────────────────
   MAIN LAYOUT
───────────────────────────────────────────── */
.dr-main    { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; background: var(--paper); }
.dr-scroll  { flex: 1; overflow-y: auto; }
.dr-content { padding: 30px 36px 56px; display: flex; flex-direction: column; gap: 22px; max-width: 1440px; width: 100%; }

/* ─────────────────────────────────────────────
   STAT CARDS
───────────────────────────────────────────── */
.dr-stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; }
.dr-stat-card {
  background: var(--card); border: 1px solid var(--line);
  border-radius: 14px; padding: 18px 20px; position: relative; overflow: hidden;
  transition: box-shadow 0.2s;
}
.dr-stat-card:hover { box-shadow: var(--shadow-sm); }
.dr-stat-card.s-neutral { background: var(--card); color: var(--ink-900); border-color: var(--line); }
.dr-stat-card.s-amber   { background: var(--al);   color: var(--amber);   border-color: transparent; }
.dr-stat-card.s-mineral { background: var(--mineral-100); color: var(--mineral-700); border-color: transparent; }
.dr-stat-card.s-blue    { background: var(--bl);   color: var(--blue);    border-color: transparent; }
.dr-stat-card.s-red     { background: var(--rl);   color: var(--rose);   border-color: transparent; }
.dr-stat-value { font-family:'Fraunces','Fraunces Variable',Georgia,serif !important; font-size: 36px; font-weight: 400; letter-spacing: -0.04em; line-height: 1; margin-top: 10px; }
.dr-stat-label { font-size: 12.5px; font-weight: 600; letter-spacing: 0.02em; opacity: 0.78; color: inherit; }

/* ─────────────────────────────────────────────
   CARDS & PANELS
───────────────────────────────────────────── */
.dr-card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 22px 24px; }
.dr-card-title { font-family:'Fraunces',Georgia,serif; font-size: 21px; font-weight: 400; color: var(--ink-900); margin-bottom: 16px; letter-spacing: -0.03em; }

/* ─────────────────────────────────────────────
   FORM ELEMENTS
───────────────────────────────────────────── */
.dr-field-label {
  font-size: 0.6875rem; font-weight: 600; color: var(--ink-500);
  letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px; display: block;
}
.dr-field-input, .dr-field-select, .dr-field-textarea {
  width: 100%; height: 44px; padding: 0 14px;
  border: 1px solid var(--line); border-radius: 10px;
  font-size: 14px; font-family: 'Inter Tight', sans-serif;
  color: var(--ink-900); background: var(--card); outline: none;
  transition: border-color 0.15s, box-shadow 0.15s; box-sizing: border-box;
}
.dr-field-select { cursor: pointer; }
.dr-field-textarea { height: auto; padding: 13px 14px; line-height: 1.55; resize: vertical; min-height: 76px; }
.dr-field-input:focus, .dr-field-select:focus, .dr-field-textarea:focus {
  border-color: var(--mineral-700); box-shadow: 0 0 0 3px rgba(14,124,102,.12);
}
.dr-field-input::placeholder, .dr-field-textarea::placeholder { color: var(--ink-400); }
.dr-form-row   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.dr-form-group { display: flex; flex-direction: column; gap: 0; margin-bottom: 16px; }

/* ─────────────────────────────────────────────
   BUTTONS
───────────────────────────────────────────── */
.dr-btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 42px; padding: 0 18px; border-radius: 10px; border: 1px solid var(--mineral-700); cursor: pointer;
  background: var(--mineral-700); color: #FAFAF7; font-size: 14px; font-weight: 600;
  font-family: inherit; white-space: nowrap; transition: all 0.15s;
  box-shadow: 0 1px 0 rgba(11,15,14,0.08), inset 0 1px 0 rgba(255,255,255,0.08);
}
.dr-btn-primary:hover { background: var(--mineral-800); border-color: var(--mineral-800); }
.dr-btn-primary svg { width: 16px; height: 16px; }

.dr-btn-secondary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 42px; padding: 0 18px; border-radius: 10px; cursor: pointer;
  font-family: inherit; background: var(--card); border: 1px solid var(--line);
  color: var(--ink-800); font-size: 14px; font-weight: 600; white-space: nowrap; transition: all 0.15s;
}
.dr-btn-secondary:hover { background: var(--ink-50); border-color: var(--ink-300); }

.dr-btn-outline {
  display: inline-flex; align-items: center; gap: 6px;
  height: 34px; padding: 0 13px; border-radius: 8px;
  border: 1px solid var(--line); background: var(--card);
  color: var(--ink-800); font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap;
}
.dr-btn-outline:hover { background: var(--ink-50); border-color: var(--ink-300); }
.dr-btn-outline.danger { color: var(--rose); border-color: rgba(180,58,44,0.3); }
.dr-btn-outline.danger:hover { background: var(--rl); border-color: var(--rose); }

.dr-btn-add-med {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 13px; border-radius: 12px;
  background: var(--mineral-100); color: var(--mineral-700);
  border: 1.5px dashed var(--mineral-400); font-size: 13.5px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: background 0.15s;
}
.dr-btn-add-med:hover { background: var(--mineral-200); }

/* ─────────────────────────────────────────────
   CHIPS
───────────────────────────────────────────── */
.dr-chip {
  display: inline-flex; align-items: center; gap: 5px;
  height: 24px; font-size: 12px; font-weight: 600; padding: 0 10px;
  border-radius: 999px; white-space: nowrap;
}
.dr-chip.primary { background: var(--mineral-100); color: var(--mineral-700); }
.dr-chip.amber   { background: var(--al);  color: var(--amber); }
.dr-chip.rose    { background: var(--rl);  color: var(--rose); }
.dr-chip.blue    { background: var(--bl);  color: var(--blue); }
.dr-chip.green   { background: var(--mineral-100); color: var(--mineral-700); }
.dr-chip.purple  { background: var(--pul); color: var(--purple); }
.dr-chip.gray    { background: var(--ink-100); color: var(--ink-600); }

/* ─────────────────────────────────────────────
   PATIENT ROWS (Queue / Schedule list)
───────────────────────────────────────────── */
.dr-patient-row {
  display: flex; align-items: center; gap: 13px;
  padding: 13px 14px; border-radius: 12px; cursor: pointer;
  border: 1px solid transparent; transition: all 0.15s; margin-bottom: 8px;
}
.dr-patient-row:last-child { margin-bottom: 0; }
.dr-patient-row.selected { background: var(--mineral-100); border-color: var(--mineral-700); }
.dr-patient-row.normal   { background: var(--card); border-color: var(--line); }
.dr-patient-row.normal:hover { border-color: var(--mineral-300); background: var(--ink-50); }

.dr-token-badge {
  width: 38px; height: 38px; border-radius: 9px;
  background: var(--mineral-700); color: white;
  font-size: 12.5px; font-weight: 600; font-family: 'JetBrains Mono', monospace;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.dr-token-badge.urgent    { background: var(--amber); }
.dr-token-badge.emergency { background: var(--rose); }

/* ─────────────────────────────────────────────
   QUEUE / SCHEDULE TWO-PANE LAYOUT
───────────────────────────────────────────── */
.dr-queue-grid { flex: 1; display: grid; grid-template-columns: 1fr 400px; overflow: hidden; gap: 0; }
.dr-queue-list { overflow-y: auto; padding: 22px 24px; display: flex; flex-direction: column; gap: 0; }
.dr-queue-detail { border-left: 1px solid var(--line); overflow-y: auto; background: var(--paper); }

.dr-detail-header { background: var(--mineral-800); color: white; padding: 22px 22px 20px; }
.dr-detail-avatar {
  width: 48px; height: 48px; border-radius: 11px; background: rgba(255,255,255,0.16);
  display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px; flex-shrink: 0;
}
.dr-detail-section { border: 1px solid var(--line); border-radius: 11px; padding: 14px 16px; background: var(--card); }
.dr-section-label {
  font-size: 0.6875rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--ink-500); margin-bottom: 10px;
}

.dr-vitals-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
.dr-vital-card { border-radius: 11px; padding: 13px 15px; border: 1px solid var(--line); background: var(--card); }
.dr-vital-value { font-family:'Fraunces',Georgia,serif; font-size: 22px; font-weight: 400; letter-spacing: -0.03em; }
.dr-vital-label { font-size: 11px; color: var(--ink-500); margin-bottom: 3px; font-weight: 600; }
.dr-vital-unit  { font-size: 10.5px; color: var(--ink-500); margin-left: 2px; }

.dr-med-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 13px; background: var(--card); border-radius: 10px;
  border: 1px solid var(--line);
}

.dr-start-btn {
  background: var(--mineral-700); color: white; border: none;
  border-radius: 12px; padding: 14px; font-size: 14px; font-weight: 700;
  cursor: pointer; width: 100%; font-family: inherit; transition: background 0.15s;
}
.dr-start-btn:hover { background: var(--mineral-800); }

/* ─────────────────────────────────────────────
   FILTERS / SEARCH
───────────────────────────────────────────── */
.dr-filters { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; flex-wrap: wrap; }
.dr-filter-select { height: 40px; padding: 0 13px; border: 1px solid var(--line); border-radius: 9px; font-size: 13.5px; font-family: inherit; color: var(--ink-900); background: var(--card); outline: none; cursor: pointer; }
.dr-filter-wrap { position: relative; flex: 1; min-width: 200px; }
.dr-filter-wrap svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--ink-400); pointer-events: none; }
.dr-filter-search { width: 100%; height: 40px; padding: 0 14px 0 38px; border: 1px solid var(--line); border-radius: 9px; font-size: 13.5px; font-family: inherit; color: var(--ink-900); background: var(--card); outline: none; box-sizing: border-box; transition: border-color 0.15s; }
.dr-filter-search:focus { border-color: var(--mineral-700); box-shadow: 0 0 0 3px rgba(14,124,102,.12); }

/* ─────────────────────────────────────────────
   WAIT TIMER
───────────────────────────────────────────── */
.dr-queue-pill { display: inline-flex; align-items: center; gap: 5px; background: var(--al); border-radius: 999px; padding: 3px 11px; font-size: 12px; font-weight: 600; color: var(--amber); }
.dr-wait-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--amber); animation: dr-pulse-dot 1.5s ease-in-out infinite; display: inline-block; }

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
.dr-empty { text-align: center; padding: 32px 16px; color: var(--ink-500); font-size: 13.5px; font-weight: 500; background: var(--ink-50); border-radius: var(--radius-sm); border: 1px dashed var(--line); }

/* ─────────────────────────────────────────────
   TABLE  (My Patients)
───────────────────────────────────────────── */
.dr-table { width: 100%; border-collapse: collapse; }
.dr-th { text-align: left; font-size: 0.6875rem; font-weight: 600; color: var(--ink-500); text-transform: uppercase; letter-spacing: 0.1em; padding: 13px 18px; border-bottom: 1px solid var(--line); white-space: nowrap; }
.dr-td { padding: 14px 18px; font-size: 13.5px; border-bottom: 1px solid var(--line); vertical-align: middle; color: var(--ink-700); }
.dr-tr { transition: background 0.12s; }
.dr-tr:hover .dr-td { background: var(--ink-50); }
.dr-tr:last-child .dr-td { border-bottom: none; }
.dr-tbl-action {
  display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px;
  border-radius: 9px; border: 1px solid var(--line); background: var(--card); cursor: pointer;
  color: var(--ink-600); transition: all 0.13s;
}
.dr-tbl-action:hover { background: var(--ink-50); color: var(--ink-800); }

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
.dr-modal-backdrop {
  position: fixed; inset: 0; background: rgba(11,15,14,.40); backdrop-filter: blur(3px);
  z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px;
}
.dr-modal {
  background: var(--card); border-radius: 16px; width: 100%; max-width: 480px;
  box-shadow: var(--shadow-lg); overflow: hidden; max-height: 90vh; overflow-y: auto;
  border: 1px solid var(--line); animation: dr-slide-up 0.25s ease both;
}
.dr-modal-lg { max-width: 660px; }
.dr-modal-header { padding: 22px 26px 18px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; }
.dr-modal-title { font-family:'Fraunces','Fraunces Variable',Georgia,serif !important; font-size: 20px; font-weight: 400; letter-spacing: -0.02em; }
.dr-modal-body { padding: 22px 26px; }
.dr-modal-footer { padding: 16px 26px; border-top: 1px solid var(--line); display: flex; justify-content: flex-end; gap: 12px; background: var(--ink-50); }
.dr-modal-close {
  width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--line); background: var(--card);
  cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--ink-500); font-size: 16px; transition: all 0.15s;
}
.dr-modal-close:hover { background: var(--ink-50); color: var(--ink-800); }

/* ─────────────────────────────────────────────
   CONSULTATION FORM (full takeover modal)
───────────────────────────────────────────── */
.dr-consult-modal {
  background: var(--card); border-radius: 16px; width: 100%; max-width: 880px; height: 86vh;
  display: flex; flex-direction: column; box-shadow: var(--shadow-lg); overflow: hidden;
  border: 1px solid var(--line); animation: dr-slide-up 0.25s ease both;
}
.dr-consult-header { position: relative; background: linear-gradient(135deg, var(--mineral-800), var(--mineral-900)); color: white; padding: 24px 28px 0; flex-shrink: 0; }
.dr-consult-tabs { display: flex; gap: 2px; overflow-x: auto; margin-top: 18px; }
.dr-consult-tab {
  padding: 11px 16px; border-radius: 9px 9px 0 0; border: none; cursor: pointer;
  font-size: 13px; font-weight: 600; font-family: inherit; white-space: nowrap;
  background: transparent; color: rgba(255,255,255,0.6); transition: all 0.15s;
}
.dr-consult-tab.active { background: var(--paper); color: var(--mineral-800); }
.dr-consult-tab:not(.active):hover { color: white; background: rgba(255,255,255,0.08); }
.dr-consult-body { flex: 1; overflow-y: auto; padding: 26px 28px; background: var(--paper); }
.dr-consult-footer { padding: 16px 28px; border-top: 1px solid var(--line); display: flex; justify-content: flex-end; gap: 12px; background: var(--card); flex-shrink: 0; }

/* ─────────────────────────────────────────────
   MULTI-SELECT
───────────────────────────────────────────── */
.dr-multiselect-field {
  width: 100%; min-height: 44px; padding: 6px 8px;
  border: 1px solid var(--line); border-radius: 10px; background: var(--card);
  display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
  cursor: text; box-sizing: border-box; transition: border-color 0.15s, box-shadow 0.15s;
}
.dr-multiselect-field:focus-within { border-color: var(--mineral-700); box-shadow: 0 0 0 3px rgba(14,124,102,.12); }
.dr-multiselect-field input {
  flex: 1; min-width: 90px; border: none; outline: none; background: transparent;
  font-size: 14px; font-family: 'Inter Tight', sans-serif; color: var(--ink-900); padding: 4px 2px;
}
.dr-multiselect-field input::placeholder { color: var(--ink-400); }
.dr-multiselect-panel {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 60;
  background: var(--card); border: 1px solid var(--line); border-radius: 11px;
  box-shadow: var(--shadow-lg); max-height: 240px; overflow-y: auto; padding: 6px;
}
.dr-multiselect-option {
  display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px;
  font-size: 13.5px; color: var(--ink-800); cursor: pointer; transition: background 0.13s;
}
.dr-multiselect-option:hover { background: var(--ink-50); }
.dr-multiselect-option.is-selected { background: var(--mineral-100); color: var(--mineral-800); font-weight: 600; }
.dr-multiselect-checkbox {
  width: 17px; height: 17px; border-radius: 5px; border: 1.5px solid var(--ink-300);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.13s;
}
.dr-multiselect-checkbox.checked { background: var(--mineral-700); border-color: var(--mineral-700); }

/* ─────────────────────────────────────────────
   MEDICATIONS TAB
───────────────────────────────────────────── */
.dr-med-edit-row {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 14px; background: var(--card); border-radius: 11px;
  border: 1px solid var(--line); margin-bottom: 10px;
}
.dr-med-add-row {
  display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px;
  padding: 16px; background: var(--mineral-100); border: 1.5px solid var(--mineral-300);
  border-radius: 12px; margin-bottom: 12px;
}

/* ─────────────────────────────────────────────
   HISTORY TAB
───────────────────────────────────────────── */
.dr-history-row {
  display: flex; gap: 16px; padding: 14px 16px; background: var(--card);
  border: 1px solid var(--line); border-radius: 11px;
}
.dr-history-date { width: 90px; flex-shrink: 0; font-size: 12px; font-weight: 600; color: var(--mineral-700); font-family: 'JetBrains Mono', monospace; }

/* ─────────────────────────────────────────────
   ATTACHMENTS TAB
───────────────────────────────────────────── */
.dr-attachment-row {
  display: flex; align-items: center; gap: 13px; padding: 13px 15px;
  background: var(--card); border: 1px solid var(--line); border-radius: 11px;
}
.dr-attachment-icon {
  width: 38px; height: 38px; border-radius: 9px; background: var(--mineral-100);
  color: var(--mineral-700); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

/* ─────────────────────────────────────────────
   MY SCHEDULE — day strip
───────────────────────────────────────────── */
.dr-schedule-week { display: grid; grid-template-columns: repeat(7,1fr); gap: 8px; }
.dr-week-day { text-align: center; padding: 13px 8px; border-radius: 12px; cursor: pointer; transition: all 0.13s; }
.dr-week-day.today { background: var(--mineral-700); border: none; }
.dr-week-day.other  { background: var(--card); border: 1px solid var(--line); }
.dr-week-day:not(.today):hover { border-color: var(--mineral-300); }

/* ─────────────────────────────────────────────
   MESSAGES (class names unchanged from original — restyled here)
───────────────────────────────────────────── */
.dr-msg-layout { flex: 1; display: grid; grid-template-columns: 300px 1fr; overflow: hidden; }
.dr-msg-sidebar { border-right: 1px solid var(--line); overflow-y: auto; background: var(--card); }
.dr-msg-list-header { padding: 16px 18px; border-bottom: 1px solid var(--line); font-family:'Fraunces',Georgia,serif; font-weight: 400; font-size: 18px; }
.dr-msg-convo-item { padding: 14px 18px; cursor: pointer; border-left: 3px solid transparent; transition: all 0.13s; border-bottom: 1px solid var(--line); }
.dr-msg-convo-item.active { background: var(--mineral-100); border-left-color: var(--mineral-700); }
.dr-msg-convo-item:not(.active):hover { background: var(--ink-50); }
.dr-msg-unread { background: var(--mineral-700); color: white; border-radius: 999px; font-size: 10px; font-weight: 700; padding: 1px 7px; flex-shrink: 0; }
.dr-msg-main { display: flex; flex-direction: column; overflow: hidden; }
.dr-msg-thread-header { padding: 16px 22px; border-bottom: 1px solid var(--line); background: var(--card); font-weight: 700; font-size: 15px; }
.dr-msg-thread { flex: 1; overflow-y: auto; padding: 22px; display: flex; flex-direction: column; gap: 12px; background: var(--paper); }
.dr-msg-bubble { max-width: 68%; padding: 10px 14px; border-radius: 14px; font-size: 13.5px; line-height: 1.6; }
.dr-msg-bubble.doctor  { background: var(--mineral-700); color: white; }
.dr-msg-bubble.patient { background: var(--card); border: 1px solid var(--line); color: var(--text); }
.dr-msg-bubble-time { font-size: 10.5px; opacity: 0.6; margin-top: 4px; text-align: right; }
.dr-msg-compose { padding: 14px 22px; border-top: 1px solid var(--line); background: var(--card); display: flex; gap: 10px; }
.dr-msg-input { flex: 1; height: 42px; padding: 0 14px; border: 1px solid var(--line); border-radius: 10px; font-size: 13.5px; outline: none; background: var(--bg); font-family: inherit; color: var(--text); }
.dr-msg-input:focus { border-color: var(--mineral-700); }
.dr-msg-send { background: var(--mineral-700); color: white; border: none; border-radius: 10px; padding: 0 18px; height: 42px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.dr-msg-send:hover { background: var(--mineral-800); }

/* ─────────────────────────────────────────────
   RESPONSIVE
───────────────────────────────────────────── */
@media (max-width: 1080px) {
  .dr-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; transform: translateX(-100%); }
  .dr-sidebar.mobile-open { transform: translateX(0); }
  .dr-hamburger { display: flex !important; }
  .dr-overlay { display: none; }
  .dr-overlay.open { display: block; }
  .dr-queue-grid { grid-template-columns: 1fr; }
  .dr-queue-detail { display: none; }
  .dr-msg-layout { grid-template-columns: 1fr; }
  .dr-msg-sidebar { display: none; }
  .dr-content { padding: 20px 18px 40px; }
  .dr-header { padding: 0 18px; }
  .dr-med-add-row { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 760px) {
  .dr-form-row { grid-template-columns: 1fr; }
  .dr-vitals-grid { grid-template-columns: 1fr !important; }
  .dr-schedule-week { grid-template-columns: repeat(4,1fr); }
  .dr-med-add-row { grid-template-columns: 1fr; }
}

/* Token / ID cells — JetBrains Mono */
.dr-root [style*="monospace"] { font-family: 'JetBrains Mono', 'Courier New', monospace !important; letter-spacing: -0.01em; }

/* ============================================================================
   HELP / CUSTOMER SUPPORT — appended block (batch 1)
   ============================================================================ */
.dr-help-btn {
  display: inline-flex; align-items: center; gap: 7px; height: 36px; padding: 0 13px;
  border-radius: 9px; border: 1px solid var(--line); background: var(--card);
  color: var(--ink-700); font-family: inherit; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: background .15s, border-color .15s, color .15s;
}
.dr-help-btn:hover { background: var(--mineral-100); border-color: var(--mineral-700); color: var(--mineral-700); }
.dr-help-btn svg { width: 18px; height: 18px; }
.dr-help-btn-label { white-space: nowrap; }

.dr-help-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 14px; margin-bottom: 14px; }
.dr-help-field { margin-bottom: 14px; }
.dr-help-label {
  display: block; font-size: 11px; font-weight: 600; color: var(--ink-500);
  text-transform: uppercase; letter-spacing: .07em; margin-bottom: 6px;
}
.dr-help-input, .dr-help-textarea {
  width: 100%; box-sizing: border-box; font-family: inherit; font-size: 14px;
  color: var(--ink-900); background: var(--card); border: 1px solid var(--line);
  border-radius: 10px; padding: 10px 12px; transition: border-color .15s, box-shadow .15s;
}
.dr-help-input:focus, .dr-help-textarea:focus {
  outline: none; border-color: var(--mineral-700); box-shadow: 0 0 0 3px rgba(14,124,102,.12);
}
.dr-help-textarea { min-height: 132px; resize: vertical; line-height: 1.6; }
.dr-help-upload {
  display: inline-flex; align-items: center; gap: 9px; width: 100%; box-sizing: border-box;
  font-family: inherit; font-size: 13.5px; font-weight: 600; color: var(--ink-700);
  background: var(--ink-50); border: 1px dashed var(--ink-300); border-radius: 10px;
  padding: 12px 14px; cursor: pointer; text-align: left; transition: border-color .15s, background .15s;
}
.dr-help-upload:hover { border-color: var(--mineral-700); background: var(--mineral-100); color: var(--mineral-700); }
.dr-help-banner {
  background: var(--mineral-100); color: var(--mineral-700); border: 1px solid var(--mineral-700);
  border-radius: 11px; padding: 13px 16px; font-size: 13.5px; font-weight: 600; line-height: 1.5; text-align: center;
}
.dr-help-success-icon {
  width: 56px; height: 56px; border-radius: 50%; margin: 0 auto;
  display: flex; align-items: center; justify-content: center;
  background: var(--mineral-700); color: #fff;
}
.dr-btn-primary:disabled { opacity: .5; cursor: not-allowed; }

@media (max-width: 520px) {
  .dr-help-grid { grid-template-columns: 1fr; }
  .dr-help-btn-label { display: none; }
  .dr-help-btn { padding: 0 9px; }
}

/* ============================================================================
   MOBILE RESPONSIVENESS — appended block (batch 3, #6)
   Appended after the help block. No existing selector modified.
   ============================================================================ */
@media (max-width: 900px) {
  /* content-box padding was overflowing width:100% containers on small screens */
  .dr-content, .dr-card, .dr-header, .dr-scroll, .dr-queue-list, .dr-queue-detail { box-sizing: border-box; }
  /* Header: drop the decorative date/time chips so the title has room */
  .dr-meta-chip { display: none !important; }
  .dr-header { gap: 10px; }
  .dr-header-title { font-size: 18px; line-height: 1.25; }
  .dr-header-date { display: none; }
  /* Stat cards: 2-up, allow shrink below intrinsic min */
  .dr-stat-row { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
  /* Queue/patient rows: let the status block wrap under the name */
  .dr-patient-row { flex-wrap: wrap; }
  .dr-patient-row > div:last-child { width: 100%; text-align: left !important; margin-top: 6px; }
  .dr-patient-row > div:last-child > div { justify-content: flex-start !important; flex-wrap: wrap; }
  /* Tables scroll horizontally instead of being clipped by the card */
  .dr-table { display: block; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
}
@media (max-width: 560px) {
  .dr-stat-row { grid-template-columns: 1fr 1fr; }
  .dr-schedule-week { grid-template-columns: repeat(3,1fr); }
  .dr-header { padding: 0 14px; }
  .dr-content { padding: 16px 14px 36px; gap: 16px; }
  .dr-card { padding: 16px 16px; }
  /* Modals fill the small screen with comfy margins */
  .dr-modal-backdrop { padding: 10px; }
  .dr-modal { max-width: 100% !important; }
}
@media (max-width: 400px) {
  .dr-stat-row { grid-template-columns: 1fr; }
  .dr-schedule-week { grid-template-columns: repeat(2,1fr); }
}
`;
