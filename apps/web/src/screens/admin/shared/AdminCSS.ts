export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800;900&display=swap');

.vx-admin {
  --ink-900:   #0B0F0E; --ink-800: #1A2120; --ink-700: #2B3533;
  --ink-600:   #3D4A48; --ink-500: #5A6866; --ink-400: #7E8E8C;
  --ink-300:   #A8B5B3; --ink-200: #D0D8D7; --ink-100: #EAF0EF; --ink-050: #F4F8F7;
  --mineral-700: #0E7C66; --mineral-600: #0F9679; --mineral-100: #E0F3EE; --mineral-050: #F0F9F6;
  --signal-red: #C0392B; --signal-red-bg: #FDECEA;
  --amber: #B45309; --amber-bg: #FEF3C7;
  --blue: #1D4ED8; --blue-bg: #DBEAFE;
  --card: #FFFFFF; --bg: #F4F7F6;
  font-family: 'Inter Tight', Inter, system-ui, sans-serif;
  background: var(--bg); color: var(--ink-900);
  height: 100vh; overflow: hidden; display: flex; flex-direction: column;
}
.vx-admin ::-webkit-scrollbar { width: 5px; height: 5px; }
.vx-admin ::-webkit-scrollbar-thumb { background: var(--ink-200); border-radius: 4px; }
.vx-admin ::-webkit-scrollbar-track { background: transparent; }

@keyframes vx-fade { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.vx-fade { animation: vx-fade 0.22s ease both; }

.vx-admin .topbar {
  background: var(--ink-900); color: white;
  display: flex; align-items: center; height: 54px;
  padding: 0 28px; gap: 10px; flex-shrink: 0;
  position: relative; z-index: 15;
}
.vx-admin .topbar-logo { display: flex; align-items: center; gap: 9px; flex-shrink: 0; }
.vx-admin .topbar-logo-icon { width: 30px; height: 30px; background: var(--mineral-700); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.vx-admin .topbar-nav { display: flex; align-items: center; gap: 2px; margin-left: 28px; flex: 1; }
.vx-admin .topbar-nav-btn { display: flex; align-items: center; gap: 6px; padding: 6px 13px; border-radius: 8px; border: none; background: transparent; color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.14s; font-family: inherit; white-space: nowrap; }
.vx-admin .topbar-nav-btn:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
.vx-admin .topbar-nav-btn.active { background: rgba(255,255,255,0.1); color: white; font-weight: 600; }
.vx-admin .topbar-nav-badge { background: #C0392B; color: white; font-size: 10px; font-weight: 700; border-radius: 10px; padding: 1px 6px; min-width: 16px; text-align: center; }
.vx-admin .topbar-spacer { flex: 1; }
.vx-admin .topbar-right { display: flex; align-items: center; gap: 10px; }
.vx-admin .topbar-alert-btn { position: relative; background: rgba(255,255,255,0.07); border: none; border-radius: 8px; padding: 6px 9px; cursor: pointer; color: rgba(255,255,255,0.6); transition: background 0.14s; }
.vx-admin .topbar-alert-btn:hover { background: rgba(255,255,255,0.14); }
.vx-admin .topbar-alert-dot { position: absolute; top: 5px; right: 5px; width: 7px; height: 7px; background: #C0392B; border-radius: 50%; border: 1.5px solid var(--ink-900); }

.vx-admin .topbar-profile-wrap { position: relative; }
.vx-admin .topbar-profile-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--mineral-700); color: #FAFAF7; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; cursor: pointer; flex-shrink: 0; transition: box-shadow 0.15s; }
.vx-admin .topbar-profile-wrap:hover .topbar-profile-avatar { box-shadow: 0 0 0 3px rgba(14,124,102,0.35); }
.vx-admin .topbar-profile-tooltip { display: none; position: absolute; top: calc(100% + 10px); right: 0; background: #FAFAF7; border: 1px solid var(--ink-200); border-radius: 14px; padding: 16px 18px; min-width: 232px; box-shadow: 0 12px 32px rgba(11,15,14,0.18); z-index: 1000; }
.vx-admin .topbar-profile-wrap:hover .topbar-profile-tooltip { display: block; }
.vx-admin .topbar-profile-tooltip::before { content: ''; position: absolute; top: -12px; left: 0; right: 0; height: 12px; }
.vx-admin .vx-tt-avatar { width: 46px; height: 46px; border-radius: 50%; background: var(--mineral-700); color: #FAFAF7; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; margin-bottom: 12px; }
.vx-admin .vx-tt-name { font-size: 14px; font-weight: 700; color: var(--ink-900); }
.vx-admin .vx-tt-sub  { font-size: 12px; color: var(--ink-500); margin-top: 3px; }
.vx-admin .vx-tt-divider { height: 1px; background: var(--ink-200); margin: 12px 0; }
.vx-admin .vx-tt-action { display: flex; align-items: center; gap: 9px; width: 100%; padding: 8px 10px; border-radius: 9px; border: none; background: transparent; font-size: 13px; font-weight: 500; cursor: pointer; text-align: left; font-family: 'Inter Tight', Inter, system-ui, sans-serif; transition: background 0.13s; }
.vx-admin .vx-tt-action svg { flex-shrink: 0; }
.vx-admin .vx-tt-action.profile { color: var(--mineral-700); }
.vx-admin .vx-tt-action.profile:hover { background: var(--mineral-100); }
.vx-admin .vx-tt-action.signout { color: var(--signal-red); }
.vx-admin .vx-tt-action.signout:hover { background: var(--signal-red-bg); }

.vx-admin .main-area { flex: 1; overflow-y: auto; }
.vx-admin .page-header { background: var(--card); border-bottom: 1px solid var(--ink-200); padding: 18px 28px; display: flex; align-items: center; justify-content: space-between; }
.vx-admin .page-title { font-size: 18px; font-weight: 800; letter-spacing: -0.4px; }
.vx-admin .page-subtitle { font-size: 12.5px; color: var(--ink-500); margin-top: 2px; }

.vx-admin .btn-primary { display: flex; align-items: center; gap: 7px; background: var(--mineral-700); color: white; border: none; border-radius: 9px; padding: 8px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: opacity 0.14s; }
.vx-admin .btn-primary:hover { opacity: 0.88; }
.vx-admin .btn-ghost { display: flex; align-items: center; gap: 7px; background: transparent; border: 1px solid var(--ink-200); color: var(--ink-600); border-radius: 9px; padding: 7px 16px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; transition: background 0.14s; }
.vx-admin .btn-ghost:hover { background: var(--ink-050); }
.vx-admin .btn-danger { background: var(--signal-red-bg); color: var(--signal-red); border: 1px solid #fca5a5; border-radius: 9px; padding: 7px 16px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.14s; }
.vx-admin .btn-danger:hover { background: #fdecea; }
.vx-admin .btn-sm { padding: 5px 12px; font-size: 12px; border-radius: 8px; }

.vx-admin .card { background: var(--card); border: 1px solid var(--ink-200); border-radius: 16px; padding: 20px; }
.vx-admin .badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; white-space: nowrap; display: inline-block; }
.vx-admin .badge-active    { background: var(--mineral-100); color: var(--mineral-700); }
.vx-admin .badge-pending   { background: var(--amber-bg); color: var(--amber); }
.vx-admin .badge-suspended { background: var(--signal-red-bg); color: var(--signal-red); }
.vx-admin .badge-high      { background: var(--signal-red-bg); color: var(--signal-red); }
.vx-admin .badge-normal    { background: var(--blue-bg); color: var(--blue); }
.vx-admin .badge-enterprise   { background: #ede9fe; color: #7c3aed; }
.vx-admin .badge-professional { background: var(--blue-bg); color: var(--blue); }
.vx-admin .badge-starter      { background: var(--ink-100); color: var(--ink-500); }

.vx-admin .dash-kpi-row { display: grid; grid-template-columns: repeat(5,1fr); gap: 14px; margin-bottom: 22px; }
.vx-admin .kpi-card { background: var(--card); border: 1px solid var(--ink-200); border-radius: 16px; padding: 18px 20px; }
.vx-admin .kpi-label { font-size: 11px; color: var(--ink-500); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.vx-admin .kpi-value { font-size: 28px; font-weight: 800; line-height: 1.1; }
.vx-admin .kpi-sub { font-size: 12px; color: var(--ink-400); margin-top: 4px; }
.vx-admin .dash-grid   { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 18px; margin-bottom: 18px; }
.vx-admin .dash-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }

.vx-admin .tbl { width: 100%; border-collapse: expand; }
.vx-admin .tbl th { padding: 9px 16px; text-align: left; font-size: 11px; color: var(--ink-500); font-weight: 600; background: var(--ink-050); border-bottom: 1px solid var(--ink-200); white-space: nowrap; text-transform: uppercase; letter-spacing: 0.5px; }
.vx-admin .tbl td { padding: 13px 16px; font-size: 13px; border-bottom: 1px solid var(--ink-100); }
.vx-admin .tbl tr:last-child td { border-bottom: none; }
.vx-admin .tbl tr:hover td { background: var(--ink-050); }

.vx-admin .hospital-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.vx-admin .hospital-card { background: var(--card); border: 1px solid var(--ink-200); border-radius: 16px; padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
.vx-admin .hosp-name { font-size: 15px; font-weight: 700; }
.vx-admin .hosp-meta { font-size: 12.5px; color: var(--ink-500); }
.vx-admin .hosp-stats { display: flex; gap: 16px; }
.vx-admin .hosp-stat { text-align: center; }
.vx-admin .hosp-stat-val { font-size: 18px; font-weight: 800; color: var(--mineral-700); }
.vx-admin .hosp-stat-lbl { font-size: 10.5px; color: var(--ink-400); }

.vx-admin .approval-row { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-bottom: 1px solid var(--ink-100); transition: background 0.12s; }
.vx-admin .approval-row:hover { background: var(--ink-050); }
.vx-admin .approval-row:last-child { border-bottom: none; }
.vx-admin .approval-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.vx-admin .approval-type { font-size: 11px; font-weight: 600; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
.vx-admin .approval-name { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
.vx-admin .approval-hosp { font-size: 12px; color: var(--ink-500); }
.vx-admin .approval-docs { font-size: 12px; color: var(--ink-400); font-weight: 500; margin-top: 2px; }
.vx-admin .approval-actions { display: flex; gap: 8px; flex-shrink: 0; }

.vx-admin .lic-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
.vx-admin .lic-card { background: var(--card); border: 1px solid var(--ink-200); border-radius: 16px; padding: 18px 20px; }
.vx-admin .lic-plan { font-size: 15px; font-weight: 800; margin-bottom: 4px; }
.vx-admin .lic-count { font-size: 28px; font-weight: 800; margin: 8px 0 4px; }
.vx-admin .lic-detail { font-size: 12px; color: var(--ink-500); line-height: 1.6; }
.vx-admin .lic-feature { display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: var(--ink-600); margin-bottom: 6px; }

.vx-admin .activity-row { display: flex; align-items: flex-start; gap: 12px; padding: 13px 0; border-bottom: 1px solid var(--ink-100); }
.vx-admin .activity-row:last-child { border-bottom: none; }
.vx-admin .act-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.vx-admin .act-text { font-size: 13.5px; font-weight: 500; flex: 1; }
.vx-admin .act-time { font-size: 12px; color: var(--ink-400); white-space: nowrap; flex-shrink: 0; }

.vx-admin .field-label { font-size: 12px; font-weight: 600; color: var(--ink-500); margin-bottom: 5px; }
.vx-admin .field-input,.vx-admin .field-select,.vx-admin .field-textarea { width: 100%; padding: 9px 12px; border: 1px solid var(--ink-200); border-radius: 9px; font-size: 13.5px; outline: none; background: var(--ink-050); color: var(--ink-900); font-family: inherit; transition: border-color 0.15s; }
.vx-admin .field-input:focus,.vx-admin .field-select:focus,.vx-admin .field-textarea:focus { border-color: var(--mineral-700); }
.vx-admin .field-textarea { resize: vertical; }
.vx-admin .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.vx-admin .field-full { margin-bottom: 12px; }

.vx-admin .drawer-overlay { position: fixed; inset: 0; background: rgba(11,15,14,0.35); z-index: 100; }
.vx-admin .drawer { position: fixed; right: 0; top: 0; bottom: 0; width: 440px; background: white; box-shadow: -8px 0 40px rgba(11,15,14,0.12); z-index: 101; overflow-y: auto; display: flex; flex-direction: column; }
.vx-admin .drawer-header { padding: 22px 24px; border-bottom: 1px solid var(--ink-200); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.vx-admin .drawer-title { font-size: 17px; font-weight: 800; }
.vx-admin .drawer-body { padding: 24px; flex: 1; }
.vx-admin .drawer-footer { padding: 16px 24px; border-top: 1px solid var(--ink-200); display: flex; gap: 10px; flex-shrink: 0; }

@media (max-width: 1080px) {
  .vx-admin .dash-kpi-row { grid-template-columns: repeat(3,1fr); }
  .vx-admin .dash-grid { grid-template-columns: 1fr; }
  .vx-admin .dash-grid-3 { grid-template-columns: 1fr; }
  .vx-admin .hospital-grid { grid-template-columns: 1fr; }
  .vx-admin .lic-grid { grid-template-columns: 1fr; }
  .vx-admin .topbar-nav { display: none; }
}
@media (max-width: 760px) {
  .vx-admin .dash-kpi-row { grid-template-columns: repeat(2,1fr); }
}

/* ============================================================================
   MOBILE RESPONSIVENESS — appended block (batch 3, #6)
   ============================================================================ */
@media (max-width: 1080px){
  .vx-admin *{ box-sizing: border-box; }
}
@media (max-width: 900px){
  .vx-admin .dash-kpi-row > *, .vx-admin .hospital-grid > *, .vx-admin .lic-grid > *{ min-width: 0; }

  /* top nav scrolls horizontally instead of overflowing */
  .vx-admin .topbar{ flex-wrap: wrap; height: auto; padding: 10px 14px; gap: 8px; }
  .vx-admin .topbar-nav{ order: 3; width: 100%; margin-left: 0; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .vx-admin .topbar-nav-btn{ flex-shrink: 0; }
  .vx-admin .tbl{ display: block; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
  .vx-admin .field-row, .vx-admin .hospital-grid, .vx-admin .lic-grid{ grid-template-columns: minmax(0,1fr) !important; }
  .vx-admin .dash-kpi-row{ grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
}
@media (max-width: 520px){
  .vx-admin .dash-kpi-row{ grid-template-columns: minmax(0,1fr) !important; }
}
`;
