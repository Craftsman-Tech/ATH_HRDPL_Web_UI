// ============================================================================
//  PharmacistCSS.ts — Vexoo Pharmacist Portal
//  Design system matched 1:1 to the Hospital Admin portal:
//  Fraunces (display) + Inter Tight (body) + JetBrains Mono (IDs)
//  Mineral / ink / paper palette · all classes use the .ph-* namespace.
// ============================================================================

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600&family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.ph-root {
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

.ph-root * { box-sizing: border-box; }
.ph-root ::selection { background: var(--mineral-300); color: var(--mineral-900); }
.ph-root ::-webkit-scrollbar        { width: 9px; height: 9px; }
.ph-root ::-webkit-scrollbar-track  { background: transparent; }
.ph-root ::-webkit-scrollbar-thumb  { background: rgba(11,15,14,0.14); border-radius: 6px; border: 2px solid transparent; background-clip: padding-box; }

@keyframes ph-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.ph-fade { animation: ph-fade 0.22s ease both; }

/* ── Shell ── */
.ph-shell   { display: flex; height: 100vh; overflow: hidden; width: 100%; }
.ph-main    { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.ph-content { flex: 1; overflow-y: auto; padding: 30px 32px 60px; }

/* ── Sidebar ── */
.ph-sidebar {
  background: #0B0F0E;
  display: flex; flex-direction: column;
  height: 100vh; overflow-y: auto; overflow-x: hidden;
  transition: width 0.22s cubic-bezier(.4,0,.2,1);
  position: relative; z-index: 10; flex-shrink: 0;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.ph-sidebar::before {
  content:''; position:absolute; inset:0;
  background-image: linear-gradient(to right,rgba(255,255,255,0.03) 1px,transparent 1px), linear-gradient(to bottom,rgba(255,255,255,0.03) 1px,transparent 1px);
  background-size:40px 40px; opacity:0.5; pointer-events:none;
}
.ph-sidebar::after {
  content:''; position:absolute; top:-140px; left:-100px; width:340px; height:340px;
  border-radius:50%; background:rgba(14,124,102,0.18); filter:blur(80px); pointer-events:none;
}
.ph-sidebar > * { position: relative; z-index: 1; }
.ph-sidebar.expanded  { width: 248px; }
.ph-sidebar.collapsed { width: 68px; }

.ph-logo-row {
  display: flex; align-items: center; gap: 10px;
  padding: 22px 20px 24px; min-height: 68px;
}
.ph-sidebar.collapsed .ph-logo-row { padding: 22px 14px; }

.ph-logo-icon {
  width: 42px; height: 42px; background: var(--mineral-700);
  border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.32);
}
.ph-logo-text {
  font-family: 'Fraunces', Georgia, serif !important;
  font-size: 20px; font-weight: 400; color: #FAFAF7;
  letter-spacing: -0.035em; white-space: nowrap;
}

.ph-collapse-btn {
  margin-left: auto; background: rgba(255,255,255,0.07);
  border: none; border-radius: 8px; color: rgba(255,255,255,0.7);
  cursor: pointer; padding: 6px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: background 0.15s;
}
.ph-collapse-btn:hover { background: rgba(255,255,255,0.12); }

.ph-nav-section-label {
  padding: 0 20px 10px; font-size: 10px; font-weight: 600;
  color: rgba(255,255,255,0.3); letter-spacing: 0.12em; text-transform: uppercase;
}
.ph-nav { flex: 1; padding: 0 14px; }

.ph-nav-btn {
  display: flex; align-items: center; gap: 12px; width: 100%;
  border-radius: 9px; border: none; cursor: pointer; margin-bottom: 2px;
  font-size: 14px; font-family: 'Inter Tight', sans-serif;
  transition: background 0.13s, color 0.13s; position: relative;
  background: transparent; color: rgba(250,250,247,0.62);
}
.ph-sidebar.expanded  .ph-nav-btn { padding: 0 14px; height: 42px; justify-content: flex-start; }
.ph-sidebar.collapsed .ph-nav-btn { padding: 0 14px; height: 42px; justify-content: center; }
.ph-nav-btn:hover  { background: rgba(255,255,255,0.05) !important; color: #FAFAF7 !important; }
.ph-nav-btn.active {
  background: rgba(14,124,102,0.20) !important;
  color: #FAFAF7 !important; font-weight: 500;
}
.ph-nav-btn.active::before {
  content: ''; position: absolute; left: -14px; top: 9px; bottom: 9px;
  width: 3px; border-radius: 0 3px 3px 0; background: #1FBFA0;
}
.ph-sidebar.collapsed .ph-nav-btn.active::before { display: none; }

.ph-nav-badge {
  margin-left: auto; background: var(--rose); color: white;
  border-radius: 999px; font-size: 10.5px; font-weight: 700;
  padding: 2px 8px; line-height: 1.4;
}
.ph-nav-badge-dot {
  position: absolute; top: 7px; right: 7px;
  width: 8px; height: 8px; background: var(--rose); border-radius: 50%;
}

/* Sidebar user row */
.ph-user-row {
  border-top: 1px solid rgba(255,255,255,0.07);
  padding: 12px 14px;
}
.ph-user-identity {
  display: flex; align-items: center; gap: 10px; border-radius: 10px;
  padding: 10px 12px; margin-bottom: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
}
.ph-sidebar.collapsed .ph-user-identity { padding: 8px 10px; justify-content: center; margin-bottom: 6px; }
.ph-avatar {
  width: 36px; height: 36px; border-radius: 9px;
  background: var(--mineral-700); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 600; font-size: 13px;
}
.ph-user-name { color: #FAFAF7; font-size: 13px; font-weight: 600; white-space: nowrap; }
.ph-user-role { color: rgba(255,255,255,0.38); font-size: 11px; }

.ph-signout-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 9px 14px; border-radius: 9px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  color: rgba(250,250,247,0.55); font-family: 'Inter Tight', sans-serif;
  font-size: 13.5px; font-weight: 500; cursor: pointer;
  transition: background 0.13s, color 0.13s, border-color 0.13s;
}
.ph-signout-btn:hover { background: rgba(180,58,44,0.14); color: #FAE2DD; border-color: rgba(180,58,44,0.25); }

/* Mobile overlay */
.ph-overlay { display: none; position: fixed; inset: 0; background: rgba(11,15,14,0.45); z-index: 9; }
.ph-overlay.open { display: block; }
.ph-hamburger {
  display: none; background: none; border: none; cursor: pointer;
  padding: 4px; color: var(--ink-900);
  align-items: center; justify-content: center;
}

/* ── Header / Topbar ── */
.ph-header {
  display: flex; align-items: center; padding: 0 32px; height: 72px;
  background: color-mix(in srgb, var(--paper) 86%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
  gap: 14px; flex-shrink: 0;
  position: sticky; top: 0; z-index: 15;
}
.ph-header-title {
  font-family: 'Fraunces', Georgia, serif !important;
  font-size: 26px !important; font-weight: 400 !important;
  letter-spacing: -0.035em; color: var(--ink-900);
}
.ph-header-date     { font-size: 12px; color: var(--ink-500); margin-top: 2px; }
.ph-header-spacer   { flex: 1; }

.ph-search-box {
  display: flex; align-items: center; gap: 8px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 0 14px; height: 44px; width: 280px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.ph-search-box:focus-within {
  border-color: var(--mineral-700);
  box-shadow: 0 0 0 3px rgba(14,124,102,.10);
}
.ph-search-box input {
  border: none; background: transparent; font-size: 13.5px; outline: none;
  color: var(--ink-900); width: 100%; font-family: 'Inter Tight', sans-serif;
}
.ph-search-box input::placeholder { color: var(--ink-400); }

.ph-help-btn {
  background: var(--card); border: 1px solid var(--border); border-radius: 10px;
  padding: 0 16px; height: 44px; cursor: pointer; font-size: 13.5px;
  color: var(--ink-600); display: flex; align-items: center; gap: 6px;
  font-family: 'Inter Tight', sans-serif; transition: background 0.13s;
}
.ph-help-btn:hover { background: var(--ink-50); }

/* Profile tooltip */
.ph-profile-wrap { position: relative; }
.ph-header-avatar {
  width: 38px; height: 38px; border-radius: 9px;
  background: var(--mineral-700); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 600; font-size: 13px; cursor: pointer;
  transition: box-shadow 0.15s; user-select: none;
}
.ph-profile-wrap:hover .ph-header-avatar {
  box-shadow: 0 0 0 3px rgba(14,124,102,.22), 0 0 0 6px rgba(14,124,102,.08);
}
.ph-profile-tooltip {
  display: none; position: fixed; top: 70px; right: 16px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 16px; padding: 18px 20px; min-width: 238px;
  box-shadow: 0 12px 32px rgba(11,15,14,0.14); z-index: 200;
}
.ph-profile-wrap:hover .ph-profile-tooltip { display: block; }
.ph-profile-tooltip::before { content: ''; position: absolute; top: -12px; left: 0; right: 0; height: 12px; }

.ph-tt-avatar {
  width: 48px; height: 48px; border-radius: 11px;
  background: var(--mineral-700);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 600; font-size: 17px; margin-bottom: 12px;
}
.ph-tt-name    { font-size: 14.5px; font-weight: 700; color: var(--ink-900); }
.ph-tt-sub     { font-size: 12px; color: var(--ink-500); margin-top: 3px; }
.ph-tt-divider { height: 1px; background: var(--border); margin: 12px 0; }
.ph-tt-action {
  display: flex; align-items: center; gap: 9px; width: 100%;
  padding: 9px 11px; border-radius: 10px; border: none; background: transparent;
  font-size: 13.5px; font-weight: 500; cursor: pointer; text-align: left;
  font-family: 'Inter Tight', sans-serif; transition: background 0.13s;
}
.ph-tt-action.profile { color: var(--mineral-700); }
.ph-tt-action.profile:hover { background: var(--mineral-100); }
.ph-tt-action.signout { color: var(--rose); }
.ph-tt-action.signout:hover { background: var(--rose-light); }

/* ── Cards ── */
.ph-card {
  background: var(--card); border-radius: 14px; padding: 24px;
  box-shadow: 0 1px 2px rgba(11,15,14,.04), 0 2px 8px rgba(11,15,14,.06);
  border: 1px solid var(--border);
}

/* ── Badges ── */
.ph-badge {
  font-size: 12px; font-weight: 600; padding: 3px 10px;
  border-radius: 999px; display: inline-block; white-space: nowrap;
}
.ph-badge.primary { background: var(--mineral-100); color: var(--mineral-700); }
.ph-badge.amber   { background: var(--amber-light);  color: var(--amber);       }
.ph-badge.rose    { background: var(--rose-light);   color: var(--rose);        }
.ph-badge.blue    { background: var(--blue-light);   color: var(--blue);        }
.ph-badge.purple  { background: var(--purple-light); color: var(--purple);      }
.ph-badge.green   { background: var(--mineral-100);  color: var(--mineral-700); }
.ph-badge.gray    { background: var(--ink-100);      color: var(--ink-600);     }

/* ── Section headings ── */
.ph-section-head  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.ph-section-title {
  font-family: 'Fraunces', Georgia, serif !important;
  font-size: 20px !important; font-weight: 400 !important;
  letter-spacing: -0.02em; color: var(--ink-900);
}
.ph-section-sub   { font-size: 12.5px; color: var(--ink-500); margin-top: 3px; }

/* ── Action button ── */
.ph-action-btn {
  display: flex; align-items: center; gap: 7px;
  background: var(--mineral-700); color: white;
  border: none; border-radius: 10px; padding: 0 18px; height: 42px;
  font-size: 13.5px; font-weight: 600; cursor: pointer;
  font-family: 'Inter Tight', sans-serif; transition: background 0.15s;
  box-shadow: 0 1px 0 rgba(11,15,14,.08), inset 0 1px 0 rgba(255,255,255,.08);
}
.ph-action-btn:hover { background: var(--mineral-800); }

/* ── Tables ── */
.ph-table-wrap { overflow-x: auto; }
.ph-table      { width: 100%; border-collapse: collapse; }
.ph-th {
  padding: 13px 18px; text-align: left; font-size: 10.5px;
  color: var(--ink-500); font-weight: 600;
  background: transparent; border-bottom: 1px solid var(--border);
  white-space: nowrap; text-transform: uppercase; letter-spacing: 0.1em;
}
.ph-td { padding: 14px 18px; font-size: 14px; border-bottom: 1px solid var(--border); color: var(--ink-700); }
.ph-tr { transition: background 0.12s; }
.ph-tr:hover { background: var(--ink-50) !important; }
.ph-tr:last-child .ph-td { border-bottom: none; }

/* ── Search input wrap (used in screen filters) ── */
.ph-search-input-wrap {
  flex: 1; display: flex; align-items: center; gap: 8px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 0 16px; height: 44px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.ph-search-input-wrap:focus-within {
  border-color: var(--mineral-700);
  box-shadow: 0 0 0 3px rgba(14,124,102,.10);
}
.ph-search-input-wrap input {
  border: none; outline: none; background: transparent;
  font-size: 13.5px; font-family: 'Inter Tight', sans-serif; width: 100%; color: var(--ink-900);
}
.ph-search-input-wrap input::placeholder { color: var(--ink-400); }

/* ── Stat cards ── */
.ph-stat-card {
  background: var(--card); border-radius: 14px; padding: 22px;
  box-shadow: 0 1px 2px rgba(11,15,14,.04), 0 2px 8px rgba(11,15,14,.06);
  border: 1px solid var(--border);
}
.ph-stat-label { font-size: 12px; color: var(--ink-500); font-weight: 600; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
.ph-stat-value {
  font-family: 'Fraunces', Georgia, serif !important;
  font-size: 40px !important; font-weight: 400 !important;
  letter-spacing: -0.04em; line-height: 1; color: var(--ink-900); margin-bottom: 6px;
}
.ph-stat-sub    { font-size: 12px; font-weight: 500; }
.ph-stat-icon   { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* ── Bar chart ── */
.ph-bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 100px; }
.ph-bar-col   { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; }
.ph-bar-val   { font-size: 10px; color: var(--ink-500); font-weight: 500; }
.ph-bar       { width: 100%; border-radius: 5px 5px 0 0; transition: height 0.4s ease; }
.ph-bar-label { font-size: 10.5px; color: var(--ink-500); }

/* ── EMR patient list ── */
.ph-emr-layout { display: grid; gap: 16px; }
.ph-emr-pt {
  padding: 12px 16px; border-radius: 11px; cursor: pointer;
  border: 1px solid var(--border); transition: all 0.15s; background: var(--card);
}
.ph-emr-pt.active { background: var(--mineral-100); border-color: var(--mineral-700); border-width: 1.5px; }
.ph-emr-pt:hover:not(.active) { border-color: var(--mineral-300); }
.ph-emr-pt-avatar {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 11px;
}

/* ── Notifications ── */
.ph-notif-item {
  padding: 16px 20px; border: 1px solid var(--border); border-radius: 14px;
  cursor: pointer; transition: all 0.15s; display: flex; gap: 14px; align-items: flex-start;
}
.ph-notif-item.unread { background: var(--mineral-100); border-color: var(--mineral-200); }
.ph-notif-item:hover  { border-color: var(--mineral-300); }
.ph-notif-icon { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.ph-notif-dot  { width: 8px; height: 8px; background: var(--mineral-700); border-radius: 50%; flex-shrink: 0; margin-top: 4px; }

/* ── Toggle ── */
.ph-toggle { width: 38px; height: 22px; background: var(--mineral-700); border-radius: 999px; cursor: pointer; position: relative; flex-shrink: 0; transition: background 0.15s; }
.ph-toggle::after { content: ''; position: absolute; right: 2px; top: 2px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: right 0.15s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }

/* ── Grid helpers ── */
.ph-stat-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }
.ph-stat-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.ph-grid-2-1    { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
.ph-grid-1-2    { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
.ph-grid-4col   { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; }

/* ── Tinted stat variants (matching Reception s-* pattern) ── */
.ph-stat-card.s-mineral { background: var(--mineral-100); border-color: transparent; }
.ph-stat-card.s-mineral .ph-stat-value,
.ph-stat-card.s-mineral .ph-stat-label { color: var(--mineral-700); }
.ph-stat-card.s-amber   { background: var(--amber-light);  border-color: transparent; }
.ph-stat-card.s-amber   .ph-stat-value,
.ph-stat-card.s-amber   .ph-stat-label { color: var(--amber); }
.ph-stat-card.s-rose    { background: var(--rose-light);   border-color: transparent; }
.ph-stat-card.s-rose    .ph-stat-value,
.ph-stat-card.s-rose    .ph-stat-label { color: var(--rose); }
.ph-stat-card.s-blue    { background: var(--blue-light);   border-color: transparent; }
.ph-stat-card.s-blue    .ph-stat-value,
.ph-stat-card.s-blue    .ph-stat-label { color: var(--blue); }

/* ── Responsive ── */
@media (max-width: 1080px) {
  .ph-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 20; width: 248px !important; transform: translateX(-100%); transition: transform 0.25s cubic-bezier(.4,0,.2,1); }
  .ph-sidebar.mobile-open { transform: translateX(0); }
  .ph-hamburger { display: flex !important; }
  .ph-search-box { width: 180px; }
  .ph-help-btn span { display: none; }
}
@media (max-width: 760px) {
  .ph-header    { padding: 0 16px; gap: 10px; }
  .ph-search-box { display: none; }
  .ph-content   { padding: 16px 14px 40px; }
  .ph-stat-grid-4 { grid-template-columns: repeat(2,1fr) !important; }
  .ph-stat-grid-3 { grid-template-columns: repeat(2,1fr) !important; }
  .ph-grid-2-1    { grid-template-columns: 1fr !important; }
  .ph-grid-1-2    { grid-template-columns: 1fr !important; }
  .ph-grid-4col   { grid-template-columns: 1fr !important; }
  .ph-emr-layout  { grid-template-columns: 1fr !important; }
}

/* ════════════════════════════════════════════════════════════════════════
   Pharmacist extras — dashboard widgets & screen utilities (ph-* namespace)
   ════════════════════════════════════════════════════════════════════════ */
.ph-clickable { cursor: pointer; transition: transform .12s, box-shadow .15s; }
.ph-clickable:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(11,15,14,.10); }

/* Welcome / greeting card */
.ph-welcome {
  background: linear-gradient(120deg, var(--mineral-800), var(--mineral-700));
  border-radius: 16px; padding: 26px 28px; color: #FAFAF7;
  display: flex; align-items: center; justify-content: space-between; gap: 18px;
  box-shadow: 0 8px 28px rgba(14,124,102,.22); position: relative; overflow: hidden;
}
.ph-welcome::after {
  content:''; position:absolute; top:-70px; right:-40px; width:240px; height:240px;
  border-radius:50%; background:rgba(255,255,255,.08); pointer-events:none;
}
.ph-welcome-greet { font-family:'Fraunces',Georgia,serif; font-size:27px; font-weight:400; letter-spacing:-.03em; }
.ph-welcome-sub   { font-size:13px; opacity:.86; margin-top:5px; }
.ph-welcome-meta  { text-align:right; position:relative; z-index:1; flex-shrink:0; }
.ph-welcome-time  { font-family:'JetBrains Mono',monospace; font-size:25px; font-weight:500; letter-spacing:-.01em; }
.ph-welcome-shift { font-size:12px; opacity:.86; margin-top:3px; }

/* Quick actions */
.ph-quick-btn {
  display:flex; flex-direction:column; align-items:flex-start; gap:12px;
  padding:16px; border:1px solid var(--border); border-radius:12px;
  background:var(--card); cursor:pointer; text-align:left; width:100%;
  transition: border-color .14s, background .14s, transform .12s;
  font-family:'Inter Tight',sans-serif;
}
.ph-quick-btn:hover { border-color:var(--mineral-300); background:var(--mineral-100); transform:translateY(-1px); }
.ph-quick-ico   { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; }
.ph-quick-label { font-size:13.5px; font-weight:600; color:var(--ink-900); }

/* Recent activity rows */
.ph-activity-row { display:flex; gap:12px; align-items:flex-start; padding:11px 0; border-bottom:1px solid var(--border); }
.ph-activity-row:last-child { border-bottom:none; }
.ph-activity-dot { width:30px; height:30px; border-radius:9px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }

/* Critical alert rows (clickable → inventory) */
.ph-alert-row {
  display:flex; align-items:center; gap:13px; padding:13px 14px; border-radius:11px;
  cursor:pointer; border:1px solid var(--border); transition:all .14s; margin-bottom:9px;
}
.ph-alert-row:last-child { margin-bottom:0; }
.ph-alert-row:hover { border-color:var(--mineral-300); background:var(--ink-50); }
.ph-alert-count { font-family:'Fraunces',Georgia,serif; font-size:23px; font-weight:400; line-height:1; }

/* Monospace ID token */
.ph-id { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--ink-600); }

/* Segmented filter tabs */
.ph-tabs { display:inline-flex; background:var(--ink-100); border-radius:10px; padding:3px; gap:2px; }
.ph-tab  { border:none; background:transparent; padding:7px 15px; border-radius:8px; font-size:13px; font-weight:600; color:var(--ink-500); cursor:pointer; font-family:'Inter Tight',sans-serif; transition:all .13s; }
.ph-tab.active { background:var(--card); color:var(--mineral-700); box-shadow:0 1px 3px rgba(11,15,14,.08); }

/* Outline / ghost button */
.ph-btn-outline { display:flex; align-items:center; gap:7px; background:var(--card); color:var(--ink-700); border:1px solid var(--border); border-radius:10px; padding:0 16px; height:42px; font-size:13.5px; font-weight:600; cursor:pointer; font-family:'Inter Tight',sans-serif; transition:background .14s; }
.ph-btn-outline:hover { background:var(--ink-50); }

/* Inline progress bar (stock levels) */
.ph-progress { background:var(--ink-100); border-radius:4px; height:6px; overflow:hidden; }
.ph-progress > div { height:100%; border-radius:4px; transition:width .4s ease; }

/* Two-column dashboard helper that collapses on mobile */
.ph-grid-2-2 { display:grid; grid-template-columns:1fr 1fr; gap:18px; }

@media (max-width: 760px) {
  .ph-grid-2-2 { grid-template-columns:1fr !important; }
  .ph-welcome  { flex-direction:column; align-items:flex-start; }
  .ph-welcome-meta { text-align:left; }
}


/* ════════════════════════════════════════════════════════════════════
   rx1 ADDITIONS — modals, forms, filters, multi-select, rx sheet, toast
   (appended verbatim; nothing above this line was modified)
   ════════════════════════════════════════════════════════════════════ */

/* ── Toast ── */
.ph-toast {
  position:fixed; bottom:26px; left:50%; transform:translateX(-50%);
  background:var(--ink-900); color:#fff; padding:13px 22px; border-radius:12px;
  font-size:13.5px; font-weight:600; font-family:'Inter Tight',sans-serif;
  box-shadow:0 12px 32px rgba(11,15,14,.28); z-index:4000;
  display:flex; align-items:center; gap:9px; animation:ph-toast-in .22s ease;
}
@keyframes ph-toast-in { from{opacity:0; transform:translate(-50%,12px);} to{opacity:1; transform:translate(-50%,0);} }

/* ── Modal shell ── */
.ph-modal-overlay {
  position:fixed; inset:0; background:rgba(11,15,14,.42);
  backdrop-filter:blur(2px); z-index:3000;
  display:flex; align-items:flex-start; justify-content:center;
  padding:48px 20px; overflow-y:auto; animation:ph-ov-in .16s ease;
}
@keyframes ph-ov-in { from{opacity:0;} to{opacity:1;} }
.ph-modal {
  background:var(--card); border-radius:18px; width:100%; max-width:540px;
  box-shadow:0 24px 64px rgba(11,15,14,.30); overflow:hidden;
  animation:ph-modal-in .2s cubic-bezier(.16,1,.3,1); margin:auto 0;
  max-height:calc(100vh - 96px); display:flex; flex-direction:column;
}
.ph-modal-wide { max-width:680px; }
@keyframes ph-modal-in { from{opacity:0; transform:translateY(14px) scale(.98);} to{opacity:1; transform:translateY(0) scale(1);} }
.ph-modal-head {
  display:flex; align-items:flex-start; justify-content:space-between;
  padding:22px 24px 16px; border-bottom:1px solid var(--border); flex-shrink:0;
}
.ph-modal-title { font-family:'Fraunces',serif; font-size:22px; font-weight:500; color:var(--ink-900); letter-spacing:-.01em; }
.ph-modal-sub   { font-size:13px; color:var(--ink-500); margin-top:3px; }
.ph-modal-x {
  border:none; background:var(--ink-50); color:var(--ink-600); width:34px; height:34px;
  border-radius:9px; cursor:pointer; font-size:18px; line-height:1; flex-shrink:0;
  display:flex; align-items:center; justify-content:center; transition:background .13s;
}
.ph-modal-x:hover { background:var(--ink-100); }
.ph-modal-body { padding:22px 24px; overflow-y:auto; flex:1 1 auto; min-height:0; }
.ph-modal-foot {
  display:flex; align-items:center; justify-content:flex-end; gap:10px;
  padding:16px 24px; border-top:1px solid var(--border); background:var(--ink-50); flex-shrink:0;
}

/* ── Form fields ── */
.ph-form-grid   { display:grid; grid-template-columns:1fr; gap:16px; }
.ph-form-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.ph-field { display:flex; flex-direction:column; gap:6px; min-width:0; }
.ph-field > label {
  font-size:12px; font-weight:600; color:var(--ink-600);
  text-transform:uppercase; letter-spacing:.04em;
}
.ph-req  { color:var(--rose); margin-left:2px; }
.ph-hint { font-size:11.5px; color:var(--ink-400); margin-top:2px; }
.ph-input {
  width:100%; height:44px; border:1px solid var(--border); border-radius:11px;
  padding:0 13px; font-size:14px; font-family:'Inter Tight',sans-serif;
  color:var(--ink-900); background:var(--card); outline:none; transition:border-color .14s, box-shadow .14s;
}
.ph-input:focus { border-color:var(--mineral-500); box-shadow:0 0 0 3px var(--mineral-100); }
.ph-input-readonly { background:var(--ink-50); color:var(--ink-600); cursor:default; }
.ph-input-mono { font-family:'JetBrains Mono',monospace; font-size:13px; letter-spacing:.02em; }

/* ── Buttons (text / active) ── */
.ph-btn-text {
  border:none; background:transparent; color:var(--ink-600); padding:0 14px; height:42px;
  border-radius:10px; font-size:13.5px; font-weight:600; cursor:pointer;
  font-family:'Inter Tight',sans-serif; transition:background .13s;
}
.ph-btn-text:hover { background:var(--ink-50); }
.ph-btn-active { background:var(--mineral-100) !important; color:var(--mineral-700) !important; }

/* ── Quantity stepper list (OTC dispense) ── */
/* ── Quantity list (OTC dispense) — bordered card list, matches .ph-staged ── */
.ph-qty-list { margin-top:8px; border:1px solid var(--border); border-radius:14px; overflow:hidden; background:var(--card); }
.ph-qty-head {
  display:flex; align-items:center; justify-content:space-between;
  padding:11px 15px; background:var(--ink-50); border-bottom:1px solid var(--border);
  font-size:12px; font-weight:700; color:var(--ink-600); text-transform:uppercase; letter-spacing:.04em;
}
.ph-qty-count {
  font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600;
  background:var(--mineral-100); color:var(--mineral-700);
  border-radius:999px; padding:2px 9px; letter-spacing:0;
}
.ph-qty-row {
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:11px 15px; background:var(--card);
}
.ph-qty-row + .ph-qty-row { border-top:1px solid var(--border); }
.ph-qty-meta { display:flex; align-items:center; gap:11px; min-width:0; }
.ph-qty-dot {
  width:32px; height:32px; border-radius:9px; flex-shrink:0;
  background:var(--mineral-100); color:var(--mineral-700);
  display:flex; align-items:center; justify-content:center;
  font-weight:700; font-size:14px; font-family:'Inter Tight',sans-serif;
}
.ph-qty-name { font-size:13.5px; font-weight:600; color:var(--ink-800); min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ph-qty-sub  { font-size:11.5px; color:var(--text-muted); margin-top:1px; }
.ph-stepper { display:flex; align-items:center; border:1px solid var(--border); border-radius:10px; overflow:hidden; background:var(--card); flex-shrink:0; }
.ph-stepper button {
  border:none; background:var(--card); width:34px; height:34px; font-size:17px; line-height:1;
  color:var(--ink-600); cursor:pointer; transition:background .12s, color .12s;
  display:flex; align-items:center; justify-content:center;
}
.ph-stepper button:hover { background:var(--mineral-100); color:var(--mineral-700); }
.ph-stepper input {
  width:48px; height:34px; text-align:center; border:none; outline:none;
  border-left:1px solid var(--border); border-right:1px solid var(--border);
  font-size:13.5px; font-weight:700; font-family:'JetBrains Mono',monospace;
  color:var(--ink-900); background:var(--card); -moz-appearance:textfield;
}
.ph-stepper input::-webkit-outer-spin-button,
.ph-stepper input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }

/* ── Staged list (inventory add) ── */
.ph-staged { margin-top:6px; border:1px solid var(--border); border-radius:13px; overflow:hidden; }
.ph-staged-head {
  display:flex; align-items:center; justify-content:space-between;
  padding:11px 15px; background:var(--ink-50); border-bottom:1px solid var(--border);
  font-size:12px; font-weight:700; color:var(--ink-600); text-transform:uppercase; letter-spacing:.04em;
}

/* ── SearchSelect (filterable dropdown) ── */
.ph-select { position:relative; width:100%; }
.ph-select-field {
  width:100%; min-height:44px; border:1px solid var(--border); border-radius:11px;
  padding:6px 12px; font-size:14px; font-family:'Inter Tight',sans-serif;
  color:var(--ink-900); background:var(--card); cursor:text;
  display:flex; flex-wrap:wrap; align-items:center; gap:6px;
}
.ph-select-field:focus-within { border-color:var(--mineral-500); box-shadow:0 0 0 3px var(--mineral-100); }
.ph-select-field input { border:none; outline:none; flex:1; min-width:90px; font-size:14px; font-family:'Inter Tight',sans-serif; background:transparent; color:var(--ink-900); height:30px; }
.ph-select-menu {
  margin-top:5px; width:100%;
  background:var(--card); border:1px solid var(--border); border-radius:12px;
  box-shadow:0 14px 38px rgba(11,15,14,.16); max-height:248px; overflow-y:auto; padding:5px;
}
.ph-select-opt {
  display:flex; align-items:center; justify-content:space-between; gap:8px;
  padding:9px 11px; border-radius:8px; font-size:13.5px; color:var(--ink-800); cursor:pointer; transition:background .1s;
}
.ph-select-opt:hover { background:var(--mineral-100); }
.ph-select-opt small { font-size:11.5px; color:var(--ink-400); font-weight:500; }
.ph-select-empty { padding:14px 11px; text-align:center; font-size:13px; color:var(--ink-400); }
.ph-check { width:16px; height:16px; flex-shrink:0; color:var(--mineral-700); }

/* ── Chips (multi-select) ── */
.ph-chip-row { display:flex; flex-wrap:wrap; gap:6px; }
.ph-chip {
  display:inline-flex; align-items:center; gap:6px; background:var(--mineral-100);
  color:var(--mineral-800); border-radius:999px; padding:4px 6px 4px 11px;
  font-size:12.5px; font-weight:600;
}
.ph-chip-x   { border:none; background:rgba(14,124,102,.16); color:var(--mineral-800); width:18px; height:18px; border-radius:50%; cursor:pointer; font-size:12px; line-height:1; display:flex; align-items:center; justify-content:center; }
.ph-chip-x:hover { background:rgba(14,124,102,.28); }
.ph-chip-x-lg { width:20px; height:20px; font-size:13px; }

/* ── Filter popover ── */
.ph-filter-wrap { position:relative; display:inline-flex; }
.ph-filter-pop {
  position:absolute; top:calc(100% + 8px); right:0; z-index:60;
  background:var(--card); border:1px solid var(--border); border-radius:15px;
  box-shadow:0 18px 48px rgba(11,15,14,.18); padding:18px; width:330px;
  animation:ph-modal-in .16s ease;
}
.ph-filter-group-label { font-size:12px; font-weight:700; color:var(--ink-600); text-transform:uppercase; letter-spacing:.04em; margin-bottom:9px; }
.ph-filter-chips { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:18px; }
.ph-filter-chip {
  border:1px solid var(--border); background:var(--card); color:var(--ink-600);
  border-radius:999px; padding:7px 14px; font-size:12.5px; font-weight:600; cursor:pointer;
  font-family:'Inter Tight',sans-serif; transition:all .12s;
}
.ph-filter-chip:hover { border-color:var(--mineral-400); }
.ph-filter-chip.active { background:var(--mineral-700); border-color:var(--mineral-700); color:#fff; }
.ph-filter-dates { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:18px; }
.ph-filter-dates label {
  display:flex; flex-direction:column; gap:6px; min-width:0;
  font-size:11px; font-weight:700; color:var(--ink-600);
  text-transform:uppercase; letter-spacing:.04em;
}
.ph-filter-dates input {
  width:100%; height:40px; border:1px solid var(--border); border-radius:10px;
  padding:0 11px; font-size:13px; font-family:'Inter Tight',sans-serif;
  color:var(--ink-900); background:var(--card); outline:none; cursor:text;
  transition:border-color .14s, box-shadow .14s;
}
.ph-filter-dates input:focus { border-color:var(--mineral-500); box-shadow:0 0 0 3px var(--mineral-100); }
.ph-filter-dates input::-webkit-calendar-picker-indicator { cursor:pointer; opacity:.5; transition:opacity .12s; }
.ph-filter-dates input::-webkit-calendar-picker-indicator:hover { opacity:1; }
.ph-filter-actions { display:flex; align-items:center; justify-content:space-between; gap:10px; border-top:1px solid var(--border); padding-top:14px; }

/* ── Prescription sheet (View modal + mirrors PDF) ── */
.ph-rx-sheet { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:26px 28px; }
.ph-rx-letterhead { display:flex; align-items:flex-start; justify-content:space-between; padding-bottom:16px; border-bottom:2px solid var(--mineral-700); margin-bottom:18px; }
.ph-rx-brand { font-family:'Fraunces',serif; font-size:26px; font-weight:600; color:var(--mineral-700); letter-spacing:-.01em; }
.ph-rx-sub   { font-size:11.5px; color:var(--ink-500); margin-top:2px; }
.ph-rx-grid  { display:grid; grid-template-columns:auto 1fr; gap:6px 18px; font-size:13px; margin-bottom:16px; }
.ph-rx-k { color:var(--ink-500); font-weight:600; }
.ph-rx-v { color:var(--ink-900); font-weight:600; }
.ph-rx-divider { height:1px; background:var(--border); margin:16px 0; }
.ph-rx-med-head { font-family:'Fraunces',serif; font-size:16px; color:var(--ink-700); margin-bottom:10px; }
.ph-rx-med { display:flex; align-items:baseline; justify-content:space-between; gap:12px; padding:11px 0; border-bottom:1px dashed var(--border); }
.ph-rx-med b { font-size:14.5px; color:var(--ink-900); }
.ph-rx-med .ph-rx-instr { font-size:12px; color:var(--ink-500); margin-top:3px; }
.ph-rx-qty { font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--ink-700); font-weight:500; flex-shrink:0; }
.ph-rx-sig { margin-top:26px; display:flex; align-items:flex-end; justify-content:space-between; }
.ph-rx-sig .ph-rx-sigline { border-top:1.5px solid var(--ink-700); padding-top:5px; font-size:12px; color:var(--ink-600); min-width:180px; text-align:center; }
.ph-rx-foot { margin-top:22px; padding-top:13px; border-top:1px solid var(--border); font-size:11px; color:var(--ink-400); text-align:center; }

@media (max-width:620px) {
  .ph-form-grid-2 { grid-template-columns:1fr; }
  .ph-filter-pop  { width:calc(100vw - 40px); right:auto; left:0; }
}


/* ============================================================================
   SETTINGS — Profile + Billing & plans  (appended block — Settings section)
   New names only · no existing selectors touched. Mirrors the Hospital Admin
   Settings CSS, re-namespaced ph-*.
   ============================================================================ */

/* mono helper (JetBrains Mono) used by KV values, IDs and payment fields */
.ph-root .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 0.94em; letter-spacing: -0.01em; }

/* Settings shell: left sub-nav + body */
.ph-set-shell { display: grid; grid-template-columns: 210px 1fr; gap: 26px; align-items: start; }
.ph-set-nav   { display: flex; flex-direction: column; gap: 3px; position: sticky; top: 0; }
.ph-set-nav-btn {
  display: flex; align-items: center; gap: 11px;
  padding: 10px 13px; border: none; background: transparent; cursor: pointer;
  border-radius: 10px; font-family: 'Inter Tight', sans-serif;
  font-size: 13.5px; font-weight: 500; color: var(--ink-600);
  text-align: left; transition: background 0.13s, color 0.13s;
}
.ph-set-nav-btn:hover  { background: var(--ink-50); color: var(--ink-900); }
.ph-set-nav-btn.active {
  background: var(--mineral-100); color: var(--mineral-700); font-weight: 600;
  box-shadow: inset 3px 0 0 var(--mineral-700);
}
.ph-set-body { min-width: 0; }

.ph-set-note {
  background: var(--mineral-100); border: 1px solid var(--mineral-300);
  color: var(--mineral-800); border-radius: 12px; padding: 12px 16px;
  font-size: 12.5px; line-height: 1.5; margin-bottom: 18px;
}

/* Profile cards */
.ph-set-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.ph-set-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 14px;
  padding: 20px 22px; box-shadow: 0 1px 2px rgba(11,15,14,.04), 0 2px 8px rgba(11,15,14,.05);
}
.ph-set-card-title {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Fraunces', Georgia, serif; font-size: 15.5px; font-weight: 500;
  color: var(--ink-900); margin-bottom: 14px; padding-bottom: 12px;
  border-bottom: 1px solid var(--ink-100);
}
.ph-kv-row { display: grid; grid-template-columns: 130px 1fr; gap: 12px; padding: 7px 0; align-items: baseline; }
.ph-kv-k   { font-size: 12px; color: var(--ink-500); font-weight: 500; }
.ph-kv-v   { font-size: 13.5px; color: var(--ink-900); font-weight: 500; word-break: break-word; }

/* License rows */
.ph-lic-list, .ph-doc-list { display: flex; flex-direction: column; gap: 8px; }
.ph-lic-row {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 11px 13px; border: 1px solid var(--border); border-radius: 11px; background: var(--ink-50);
}
.ph-lic-main  { min-width: 0; }
.ph-lic-name  { font-size: 13px; font-weight: 600; color: var(--ink-900); }
.ph-lic-no    { font-size: 11.5px; color: var(--ink-500); margin-top: 2px; }
.ph-lic-valid { font-size: 11px; color: var(--ink-500); text-align: right; line-height: 1.45; white-space: nowrap; }
.ph-lic-valid b { color: var(--ink-800); font-size: 12.5px; }

/* Document rows */
.ph-doc-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 13px; border: 1px solid var(--border); border-radius: 11px; background: var(--ink-50);
}
.ph-doc-badge {
  flex-shrink: 0; font-size: 9.5px; font-weight: 700; letter-spacing: 0.06em;
  color: var(--rose); background: var(--rose-light); border-radius: 6px; padding: 4px 7px;
}
.ph-doc-main { flex: 1; min-width: 0; }
.ph-doc-name { font-size: 13px; font-weight: 500; color: var(--ink-900); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ph-doc-size { font-size: 11px; color: var(--ink-500); margin-top: 1px; }
.ph-doc-dl {
  display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
  background: var(--card); border: 1px solid var(--border); border-radius: 9px;
  padding: 6px 12px; font-size: 12px; font-weight: 600; color: var(--ink-700);
  cursor: pointer; font-family: 'Inter Tight', sans-serif; transition: border-color 0.13s, color 0.13s, background 0.13s;
}
.ph-doc-dl:hover { border-color: var(--mineral-700); color: var(--mineral-700); background: var(--mineral-100); }

/* Subscription summary */
.ph-sub-card {
  display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap;
  background: var(--ink-900); color: #fff; border-radius: 16px; padding: 20px 24px; margin-bottom: 22px;
}
.ph-sub-eyebrow { font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mineral-400); font-weight: 600; }
.ph-sub-plan { font-family: 'Fraunces', Georgia, serif; font-size: 24px; font-weight: 500; margin: 4px 0 6px; }
.ph-sub-meta { font-size: 12.5px; color: var(--ink-300); }
.ph-sub-cancel {
  background: transparent; border: 1px solid rgba(255,255,255,0.28); color: #fff;
  border-radius: 10px; padding: 10px 18px; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: 'Inter Tight', sans-serif; transition: background 0.13s, border-color 0.13s;
}
.ph-sub-cancel:hover { background: rgba(180,58,44,0.22); border-color: var(--rose); color: #FCE3DE; }

/* Plan cards */
.ph-plan-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 26px; }
.ph-plan-card {
  position: relative; background: var(--card); border: 1px solid var(--border); border-radius: 14px;
  padding: 22px 20px; display: flex; flex-direction: column;
  box-shadow: 0 1px 2px rgba(11,15,14,.04), 0 2px 8px rgba(11,15,14,.05); transition: box-shadow 0.15s, border-color 0.15s;
}
.ph-plan-card:hover    { box-shadow: 0 4px 18px rgba(11,15,14,.10); }
.ph-plan-card.popular  { border-color: var(--mineral-700); box-shadow: 0 0 0 1px var(--mineral-700), 0 6px 22px rgba(14,124,102,.14); }
.ph-plan-card.current  { background: var(--mineral-100); border-color: var(--mineral-600); }
.ph-plan-badges { position: absolute; top: -11px; left: 16px; display: flex; gap: 6px; }
.ph-plan-badge {
  font-size: 9.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 999px; white-space: nowrap;
}
.ph-plan-badge.pop { background: var(--mineral-700); color: #fff; }
.ph-plan-badge.cur { background: var(--ink-900); color: #fff; }
.ph-plan-name  { font-size: 16px; font-weight: 700; color: var(--ink-900); margin-top: 4px; }
.ph-plan-price { display: flex; align-items: baseline; gap: 6px; margin: 8px 0 4px; }
.ph-plan-price .amt { font-family: 'Fraunces', Georgia, serif; font-size: 26px; font-weight: 500; color: var(--ink-900); letter-spacing: -0.01em; }
.ph-plan-price .cad { font-size: 12px; color: var(--ink-500); }
.ph-plan-tag   { font-size: 12.5px; color: var(--ink-500); min-height: 32px; }
.ph-plan-seats { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: var(--ink-600); background: var(--ink-50); border: 1px solid var(--border); border-radius: 9px; padding: 7px 10px; margin: 6px 0 14px; }
.ph-plan-feats { list-style: none; margin: 0 0 18px; padding: 0; display: flex; flex-direction: column; gap: 9px; flex: 1; }
.ph-plan-feats li { display: flex; align-items: flex-start; gap: 8px; font-size: 12.5px; color: var(--ink-700); line-height: 1.4; }
.ph-plan-foot  { margin-top: auto; }
.ph-plan-btn {
  width: 100%; background: var(--mineral-700); color: #fff; border: none; border-radius: 10px;
  padding: 11px 14px; font-size: 13px; font-weight: 600; cursor: pointer;
  font-family: 'Inter Tight', sans-serif; transition: background 0.13s;
}
.ph-plan-btn:hover { background: var(--mineral-800); }
.ph-plan-btn.ghost { background: var(--card); color: var(--ink-800); border: 1px solid var(--border); }
.ph-plan-btn.ghost:hover { border-color: var(--mineral-700); color: var(--mineral-700); background: var(--mineral-100); }
.ph-plan-btn.current { background: var(--mineral-200); color: var(--mineral-800); cursor: default; }
.ph-plan-btn:disabled { cursor: default; }

/* Recent invoices card */
.ph-inv-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; box-shadow: 0 1px 2px rgba(11,15,14,.04), 0 2px 8px rgba(11,15,14,.05); overflow: hidden; }
.ph-inv-head { padding: 18px 20px 6px; }
.ph-inv-title { font-family: 'Fraunces', Georgia, serif; font-size: 16px; font-weight: 500; color: var(--ink-900); }

/* Payment page */
.ph-pay-back {
  display: inline-flex; align-items: center; gap: 7px; background: transparent; border: none;
  color: var(--ink-600); font-size: 13px; font-weight: 600; cursor: pointer;
  font-family: 'Inter Tight', sans-serif; padding: 0; margin-bottom: 16px; transition: color 0.13s;
}
.ph-pay-back:hover { color: var(--mineral-700); }
.ph-pay-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 18px; align-items: start; }
.ph-pay-demo {
  background: var(--amber-light); border: 1px solid var(--amber); color: var(--amber);
  border-radius: 9px; padding: 8px 12px; font-size: 11.5px; font-weight: 600; margin-bottom: 16px;
}
.ph-pay-label { display: block; font-size: 11.5px; font-weight: 600; color: var(--ink-500); margin: 12px 0 6px; }
.ph-pay-input {
  width: 100%; box-sizing: border-box; padding: 11px 13px; border: 1px solid var(--border);
  border-radius: 10px; font-size: 13.5px; font-family: 'Inter Tight', sans-serif; color: var(--ink-900);
  background: var(--card); outline: none; transition: border-color 0.13s, box-shadow 0.13s;
}
.ph-pay-input:focus { border-color: var(--mineral-700); box-shadow: 0 0 0 3px rgba(14,124,102,.10); }
.ph-pay-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ph-pay-btn {
  width: 100%; margin-top: 20px; background: var(--mineral-700); color: #fff; border: none;
  border-radius: 11px; padding: 13px; font-size: 14px; font-weight: 700; cursor: pointer;
  font-family: 'Inter Tight', sans-serif; transition: background 0.13s, opacity 0.13s;
}
.ph-pay-btn:hover:not(:disabled) { background: var(--mineral-800); }
.ph-pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.ph-pay-summary { background: var(--ink-50); }
.ph-sum-plan { font-family: 'Fraunces', Georgia, serif; font-size: 19px; font-weight: 500; color: var(--ink-900); margin-top: 4px; }
.ph-sum-tag  { font-size: 12.5px; color: var(--ink-500); margin: 2px 0 14px; }
.ph-sum-line { display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: var(--ink-600); padding: 8px 0; border-top: 1px solid var(--ink-100); }
.ph-sum-line b { color: var(--ink-900); font-weight: 600; }
.ph-sum-total { display: flex; align-items: center; justify-content: space-between; font-size: 14px; font-weight: 700; color: var(--ink-900); padding: 12px 0 4px; border-top: 2px solid var(--ink-200); margin-top: 4px; }
.ph-sum-amt { font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 500; color: var(--mineral-700); }
.ph-sum-note { font-size: 11px; color: var(--ink-500); line-height: 1.5; margin-top: 10px; }

/* Settings responsive */
@media (max-width: 1100px) {
  .ph-plan-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 880px) {
  .ph-set-shell { grid-template-columns: 1fr; gap: 16px; }
  .ph-set-nav   { flex-direction: row; position: static; overflow-x: auto; }
  .ph-set-grid  { grid-template-columns: 1fr; }
  .ph-pay-grid  { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .ph-plan-grid { grid-template-columns: 1fr; }
  .ph-sub-card  { flex-direction: column; align-items: flex-start; }
}

`;