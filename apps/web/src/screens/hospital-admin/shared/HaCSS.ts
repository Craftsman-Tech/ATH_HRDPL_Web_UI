// ============================================================================
//  HaCSS.ts — Vexoo Hospital Admin Portal
//  Restyled to match Reception portal design system:
//  Fraunces (display) + Inter Tight (body) · Mineral/ink/paper palette
//  All .ha-* class names preserved — zero component changes.
// ============================================================================

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600&family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.ha-root {
  /* ── Design tokens ── */
  --paper:          #FAFAF7;
  --paper-warm:     #F4F2EC;
  --ink-900:        #0B0F0E;
  --ink-800:        #171C1B;
  --ink-700:        #2A302F;
  --ink-600:        #454C4B;
  --ink-500:        #6B7270;
  --ink-400:        #9AA09E;
  --ink-300:        #C4C8C6;
  --ink-200:        #E4E6E4;
  --ink-100:        #EFF0EE;
  --ink-50:         #F5F6F4;
  --mineral-900:    #062F26;
  --mineral-800:    #0A4A3D;
  --mineral-700:    #0E7C66;
  --mineral-600:    #149E83;
  --mineral-500:    #1FBFA0;
  --mineral-400:    #5BD4BC;
  --mineral-300:    #A4E8DA;
  --mineral-200:    #D1F2EB;
  --mineral-100:    #E8F8F4;

  /* Legacy aliases (screens reference these) */
  --bg:             var(--paper);
  --sidebar:        #0B0F0E;
  --sidebar-hover:  rgba(255,255,255,0.05);
  --primary:        var(--mineral-700);
  --primary-light:  var(--mineral-100);
  --amber:          #C68A1F;
  --amber-light:    #FBF1DC;
  --rose:           #B43A2C;
  --rose-light:     #FAE2DD;
  --blue:           #0A6E8F;
  --blue-light:     #E2F1F6;
  --purple:         #6D5BD0;
  --purple-light:   #ECE9FB;
  --green:          var(--mineral-700);
  --green-light:    var(--mineral-100);
  --text:           var(--ink-900);
  --text-muted:     var(--ink-500);
  --border:         var(--ink-200);
  --card:           #FFFFFF;

  font-family: 'Inter Tight', Inter, system-ui, sans-serif;
  color: var(--ink-900);
  background: var(--paper);
  height: 100vh; overflow: hidden; display: flex;
  -webkit-font-smoothing: antialiased;
  font-size: 14px; line-height: 1.5;
  font-feature-settings: "ss01","cv11";
}

.ha-root * { box-sizing: border-box; }
.ha-root ::selection { background: var(--mineral-300); color: var(--mineral-900); }
.ha-root ::-webkit-scrollbar        { width: 9px; height: 9px; }
.ha-root ::-webkit-scrollbar-track  { background: transparent; }
.ha-root ::-webkit-scrollbar-thumb  { background: rgba(11,15,14,0.14); border-radius: 6px; border: 2px solid transparent; background-clip: padding-box; }

@keyframes ha-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.ha-fade { animation: ha-fade 0.22s ease both; }

/* ── Shell ── */
.ha-shell   { display: flex; height: 100vh; overflow: hidden; width: 100%; }
.ha-main    { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.ha-content { flex: 1; overflow-y: auto; padding: 30px 32px 60px; }

/* ── Sidebar ── */
.ha-sidebar {
  background: #0B0F0E;
  display: flex; flex-direction: column;
  height: 100vh; overflow-y: auto; overflow-x: hidden;
  transition: width 0.22s cubic-bezier(.4,0,.2,1);
  position: relative; z-index: 10; flex-shrink: 0;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.ha-sidebar::before {
  content:''; position:absolute; inset:0;
  background-image: linear-gradient(to right,rgba(255,255,255,0.03) 1px,transparent 1px), linear-gradient(to bottom,rgba(255,255,255,0.03) 1px,transparent 1px);
  background-size:40px 40px; opacity:0.5; pointer-events:none;
}
.ha-sidebar::after {
  content:''; position:absolute; top:-140px; left:-100px; width:340px; height:340px;
  border-radius:50%; background:rgba(14,124,102,0.18); filter:blur(80px); pointer-events:none;
}
.ha-sidebar > * { position: relative; z-index: 1; }
.ha-sidebar.expanded  { width: 248px; }
.ha-sidebar.collapsed { width: 68px; }

.ha-logo-row {
  display: flex; align-items: center; gap: 10px;
  padding: 22px 20px 24px; min-height: 68px;
}
.ha-sidebar.collapsed .ha-logo-row { padding: 22px 14px; }

.ha-logo-icon {
  width: 42px; height: 42px; background: var(--mineral-700);
  border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.32);
}
.ha-logo-text {
  font-family: 'Fraunces', Georgia, serif !important;
  font-size: 20px; font-weight: 400; color: #FAFAF7;
  letter-spacing: -0.035em; white-space: nowrap;
}

.ha-collapse-btn {
  margin-left: auto; background: rgba(255,255,255,0.07);
  border: none; border-radius: 8px; color: rgba(255,255,255,0.7);
  cursor: pointer; padding: 6px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: background 0.15s;
}
.ha-collapse-btn:hover { background: rgba(255,255,255,0.12); }

.ha-nav-section-label {
  padding: 0 20px 10px; font-size: 10px; font-weight: 600;
  color: rgba(255,255,255,0.3); letter-spacing: 0.12em; text-transform: uppercase;
}
.ha-nav { flex: 1; padding: 0 14px; }

.ha-nav-btn {
  display: flex; align-items: center; gap: 12px; width: 100%;
  border-radius: 9px; border: none; cursor: pointer; margin-bottom: 2px;
  font-size: 14px; font-family: 'Inter Tight', sans-serif;
  transition: background 0.13s, color 0.13s; position: relative;
  background: transparent; color: rgba(250,250,247,0.62);
}
.ha-sidebar.expanded  .ha-nav-btn { padding: 0 14px; height: 42px; justify-content: flex-start; }
.ha-sidebar.collapsed .ha-nav-btn { padding: 0 14px; height: 42px; justify-content: center; }
.ha-nav-btn:hover  { background: rgba(255,255,255,0.05) !important; color: #FAFAF7 !important; }
.ha-nav-btn.active {
  background: rgba(14,124,102,0.20) !important;
  color: #FAFAF7 !important; font-weight: 500;
}
.ha-nav-btn.active::before {
  content: ''; position: absolute; left: -14px; top: 9px; bottom: 9px;
  width: 3px; border-radius: 0 3px 3px 0; background: #1FBFA0;
}
.ha-sidebar.collapsed .ha-nav-btn.active::before { display: none; }

.ha-nav-badge {
  margin-left: auto; background: var(--rose); color: white;
  border-radius: 999px; font-size: 10.5px; font-weight: 700;
  padding: 2px 8px; line-height: 1.4;
}
.ha-nav-badge-dot {
  position: absolute; top: 7px; right: 7px;
  width: 8px; height: 8px; background: var(--rose); border-radius: 50%;
}

/* Sidebar user row */
.ha-user-row {
  border-top: 1px solid rgba(255,255,255,0.07);
  padding: 12px 14px;
}
.ha-user-identity {
  display: flex; align-items: center; gap: 10px; border-radius: 10px;
  padding: 10px 12px; margin-bottom: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
}
.ha-sidebar.collapsed .ha-user-identity { padding: 8px 10px; justify-content: center; margin-bottom: 6px; }
.ha-avatar {
  width: 36px; height: 36px; border-radius: 9px;
  background: var(--mineral-700); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 600; font-size: 13px;
}
.ha-user-name { color: #FAFAF7; font-size: 13px; font-weight: 600; white-space: nowrap; }
.ha-user-role { color: rgba(255,255,255,0.38); font-size: 11px; }

.ha-signout-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 9px 14px; border-radius: 9px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: rgba(250,250,247,0.55); font-family: 'Inter Tight', sans-serif;
  font-size: 13.5px; font-weight: 500; cursor: pointer;
  transition: background 0.13s, color 0.13s, border-color 0.13s;
}
.ha-signout-btn:hover { background: rgba(180,58,44,0.14); color: #FAE2DD; border-color: rgba(180,58,44,0.25); }

/* Mobile overlay */
.ha-overlay { display: none; position: fixed; inset: 0; background: rgba(11,15,14,0.45); z-index: 9; }
.ha-overlay.open { display: block; }
.ha-hamburger {
  display: none; background: none; border: none; cursor: pointer;
  padding: 4px; color: var(--ink-900);
  align-items: center; justify-content: center;
}

/* ── Header / Topbar ── */
.ha-header {
  display: flex; align-items: center; padding: 0 32px; height: 72px;
  background: color-mix(in srgb, var(--paper) 86%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
  gap: 14px; flex-shrink: 0;
  position: sticky; top: 0; z-index: 15;
}
.ha-header-title {
  font-family: 'Fraunces', Georgia, serif !important;
  font-size: 26px !important; font-weight: 400 !important;
  letter-spacing: -0.035em; color: var(--ink-900);
}
.ha-header-date     { font-size: 12px; color: var(--ink-500); margin-top: 2px; }
.ha-header-spacer   { flex: 1; }

.ha-search-box {
  display: flex; align-items: center; gap: 8px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 0 14px; height: 44px; width: 280px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.ha-search-box:focus-within {
  border-color: var(--mineral-700);
  box-shadow: 0 0 0 3px rgba(14,124,102,.10);
}
.ha-search-box input {
  border: none; background: transparent; font-size: 13.5px; outline: none;
  color: var(--ink-900); width: 100%; font-family: 'Inter Tight', sans-serif;
}
.ha-search-box input::placeholder { color: var(--ink-400); }

.ha-help-btn {
  background: var(--card); border: 1px solid var(--border); border-radius: 10px;
  padding: 0 16px; height: 44px; cursor: pointer; font-size: 13.5px;
  color: var(--ink-600); display: flex; align-items: center; gap: 6px;
  font-family: 'Inter Tight', sans-serif; transition: background 0.13s;
}
.ha-help-btn:hover { background: var(--ink-50); }

/* Profile tooltip */
.ha-profile-wrap { position: relative; }
.ha-header-avatar {
  width: 38px; height: 38px; border-radius: 9px;
  background: var(--mineral-700); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 600; font-size: 13px; cursor: pointer;
  transition: box-shadow 0.15s; user-select: none;
}
.ha-profile-wrap:hover .ha-header-avatar {
  box-shadow: 0 0 0 3px rgba(14,124,102,.22), 0 0 0 6px rgba(14,124,102,.08);
}
.ha-profile-tooltip {
  display: none; position: fixed; top: 70px; right: 16px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 16px; padding: 18px 20px; min-width: 238px;
  box-shadow: 0 12px 32px rgba(11,15,14,0.14); z-index: 200;
}
.ha-profile-wrap:hover .ha-profile-tooltip { display: block; }
.ha-profile-tooltip::before { content: ''; position: absolute; top: -12px; left: 0; right: 0; height: 12px; }

.ha-tt-avatar {
  width: 48px; height: 48px; border-radius: 11px;
  background: var(--mineral-700);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 600; font-size: 17px; margin-bottom: 12px;
}
.ha-tt-name    { font-size: 14.5px; font-weight: 700; color: var(--ink-900); }
.ha-tt-sub     { font-size: 12px; color: var(--ink-500); margin-top: 3px; }
.ha-tt-divider { height: 1px; background: var(--border); margin: 12px 0; }
.ha-tt-action {
  display: flex; align-items: center; gap: 9px; width: 100%;
  padding: 9px 11px; border-radius: 10px; border: none; background: transparent;
  font-size: 13.5px; font-weight: 500; cursor: pointer; text-align: left;
  font-family: 'Inter Tight', sans-serif; transition: background 0.13s;
}
.ha-tt-action.profile { color: var(--mineral-700); }
.ha-tt-action.profile:hover { background: var(--mineral-100); }
.ha-tt-action.signout { color: var(--rose); }
.ha-tt-action.signout:hover { background: var(--rose-light); }

/* ── Cards ── */
.ha-card {
  background: var(--card); border-radius: 14px; padding: 24px;
  box-shadow: 0 1px 2px rgba(11,15,14,.04), 0 2px 8px rgba(11,15,14,.06);
  border: 1px solid var(--border);
}

/* ── Badges ── */
.ha-badge {
  font-size: 12px; font-weight: 600; padding: 3px 10px;
  border-radius: 999px; display: inline-block; white-space: nowrap;
}
.ha-badge.primary { background: var(--mineral-100); color: var(--mineral-700); }
.ha-badge.amber   { background: var(--amber-light);  color: var(--amber);       }
.ha-badge.rose    { background: var(--rose-light);   color: var(--rose);        }
.ha-badge.blue    { background: var(--blue-light);   color: var(--blue);        }
.ha-badge.purple  { background: var(--purple-light); color: var(--purple);      }
.ha-badge.green   { background: var(--mineral-100);  color: var(--mineral-700); }
.ha-badge.gray    { background: var(--ink-100);      color: var(--ink-600);     }

/* ── Section headings ── */
.ha-section-head  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.ha-section-title {
  font-family: 'Fraunces', Georgia, serif !important;
  font-size: 20px !important; font-weight: 400 !important;
  letter-spacing: -0.02em; color: var(--ink-900);
}
.ha-section-sub   { font-size: 12.5px; color: var(--ink-500); margin-top: 3px; }

/* ── Action button ── */
.ha-action-btn {
  display: flex; align-items: center; gap: 7px;
  background: var(--mineral-700); color: white;
  border: none; border-radius: 10px; padding: 0 18px; height: 42px;
  font-size: 13.5px; font-weight: 600; cursor: pointer;
  font-family: 'Inter Tight', sans-serif; transition: background 0.15s;
  box-shadow: 0 1px 0 rgba(11,15,14,.08), inset 0 1px 0 rgba(255,255,255,.08);
}
.ha-action-btn:hover { background: var(--mineral-800); }

/* ── Tables ── */
.ha-table-wrap { overflow-x: auto; }
.ha-table      { width: 100%; border-collapse: collapse; }
.ha-th {
  padding: 13px 18px; text-align: left; font-size: 10.5px;
  color: var(--ink-500); font-weight: 600;
  background: transparent; border-bottom: 1px solid var(--border);
  white-space: nowrap; text-transform: uppercase; letter-spacing: 0.1em;
}
.ha-td { padding: 14px 18px; font-size: 14px; border-bottom: 1px solid var(--border); color: var(--ink-700); }
.ha-tr { transition: background 0.12s; }
.ha-tr:hover { background: var(--ink-50) !important; }
.ha-tr:last-child .ha-td { border-bottom: none; }

/* ── Search input wrap (used in screen filters) ── */
.ha-search-input-wrap {
  flex: 1; display: flex; align-items: center; gap: 8px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 0 16px; height: 44px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.ha-search-input-wrap:focus-within {
  border-color: var(--mineral-700);
  box-shadow: 0 0 0 3px rgba(14,124,102,.10);
}
.ha-search-input-wrap input {
  border: none; outline: none; background: transparent;
  font-size: 13.5px; font-family: 'Inter Tight', sans-serif; width: 100%; color: var(--ink-900);
}
.ha-search-input-wrap input::placeholder { color: var(--ink-400); }

/* ── Stat cards ── */
.ha-stat-card {
  background: var(--card); border-radius: 14px; padding: 22px;
  box-shadow: 0 1px 2px rgba(11,15,14,.04), 0 2px 8px rgba(11,15,14,.06);
  border: 1px solid var(--border);
}
.ha-stat-label { font-size: 12px; color: var(--ink-500); font-weight: 600; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
.ha-stat-value {
  font-family: 'Fraunces', Georgia, serif !important;
  font-size: 40px !important; font-weight: 400 !important;
  letter-spacing: -0.04em; line-height: 1; color: var(--ink-900); margin-bottom: 6px;
}
.ha-stat-sub    { font-size: 12px; font-weight: 500; }
.ha-stat-icon   { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* ── Bar chart ── */
.ha-bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 100px; }
.ha-bar-col   { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; }
.ha-bar-val   { font-size: 10px; color: var(--ink-500); font-weight: 500; }
.ha-bar       { width: 100%; border-radius: 5px 5px 0 0; transition: height 0.4s ease; }
.ha-bar-label { font-size: 10.5px; color: var(--ink-500); }

/* ── EMR patient list ── */
.ha-emr-layout { display: grid; gap: 16px; }
.ha-emr-pt {
  padding: 12px 16px; border-radius: 11px; cursor: pointer;
  border: 1px solid var(--border); transition: all 0.15s; background: var(--card);
}
.ha-emr-pt.active { background: var(--mineral-100); border-color: var(--mineral-700); border-width: 1.5px; }
.ha-emr-pt:hover:not(.active) { border-color: var(--mineral-300); }
.ha-emr-pt-avatar {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 11px;
}

/* ── Notifications ── */
.ha-notif-item {
  padding: 16px 20px; border: 1px solid var(--border); border-radius: 14px;
  cursor: pointer; transition: all 0.15s; display: flex; gap: 14px; align-items: flex-start;
}
.ha-notif-item.unread { background: var(--mineral-100); border-color: var(--mineral-200); }
.ha-notif-item:hover  { border-color: var(--mineral-300); }
.ha-notif-icon { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.ha-notif-dot  { width: 8px; height: 8px; background: var(--mineral-700); border-radius: 50%; flex-shrink: 0; margin-top: 4px; }

/* ── Toggle ── */
.ha-toggle { width: 38px; height: 22px; background: var(--mineral-700); border-radius: 999px; cursor: pointer; position: relative; flex-shrink: 0; transition: background 0.15s; }
.ha-toggle::after { content: ''; position: absolute; right: 2px; top: 2px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: right 0.15s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }

/* ── Grid helpers ── */
.ha-stat-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
.ha-stat-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.ha-grid-2-1    { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
.ha-grid-1-2    { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
.ha-grid-4col   { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }

/* ── Tinted stat variants (matching Reception s-* pattern) ── */
.ha-stat-card.s-mineral { background: var(--mineral-100); border-color: transparent; }
.ha-stat-card.s-mineral .ha-stat-value,
.ha-stat-card.s-mineral .ha-stat-label { color: var(--mineral-700); }
.ha-stat-card.s-amber   { background: var(--amber-light);  border-color: transparent; }
.ha-stat-card.s-amber   .ha-stat-value,
.ha-stat-card.s-amber   .ha-stat-label { color: var(--amber); }
.ha-stat-card.s-rose    { background: var(--rose-light);   border-color: transparent; }
.ha-stat-card.s-rose    .ha-stat-value,
.ha-stat-card.s-rose    .ha-stat-label { color: var(--rose); }
.ha-stat-card.s-blue    { background: var(--blue-light);   border-color: transparent; }
.ha-stat-card.s-blue    .ha-stat-value,
.ha-stat-card.s-blue    .ha-stat-label { color: var(--blue); }

/* ── Responsive ── */
@media (max-width: 1080px) {
  .ha-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 20; width: 248px !important; transform: translateX(-100%); transition: transform 0.25s cubic-bezier(.4,0,.2,1); }
  .ha-sidebar.mobile-open { transform: translateX(0); }
  .ha-hamburger { display: flex !important; }
  .ha-search-box { width: 180px; }
  .ha-help-btn span { display: none; }
}
@media (max-width: 760px) {
  .ha-header    { padding: 0 16px; gap: 10px; }
  .ha-search-box { display: none; }
  .ha-content   { padding: 16px 14px 40px; }
  .ha-stat-grid-4 { grid-template-columns: repeat(2,1fr) !important; }
  .ha-stat-grid-3 { grid-template-columns: repeat(2,1fr) !important; }
  .ha-grid-2-1    { grid-template-columns: 1fr !important; }
  .ha-grid-1-2    { grid-template-columns: 1fr !important; }
  .ha-grid-4col   { grid-template-columns: 1fr !important; }
  .ha-emr-layout  { grid-template-columns: 1fr !important; }
}

/* ============================================================================
   MOBILE RESPONSIVENESS — appended polish (batch 3, #6)
   (ha already had box-sizing, a 760 media block, and .ha-table-wrap scrolling)
   ============================================================================ */
@media (max-width: 760px){
  .ha-header-date{ display: none; }
  .ha-modal{ max-width: 100% !important; }
  .ha-modal-backdrop{ padding: 10px; }
}
@media (max-width: 460px){
  .ha-stat-grid-4, .ha-stat-grid-3{ grid-template-columns: 1fr !important; }
}
`;
