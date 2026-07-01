/**
 * AdminCSS.ts — Super Admin (Founders' Console) styles
 * ----------------------------------------------------------------------------
 * Ported verbatim from the "Vexoo · ATH — Super Admin" reference design and
 * fully namespaced under `.vx-admin` so nothing leaks into other portals.
 *
 * Appended (clearly marked) at the very end:
 *   • sidebar profile menu (Profile / Sign out)
 *   • density-compact mode + grain toggle support
 * Never edit existing selectors above the APPENDED block — add new CSS there.
 */
export const CSS_BASE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

.vx-admin, .vx-admin *, .vx-admin *::before, .vx-admin *::after { box-sizing:border-box; }

.vx-admin{
  --paper:#FAFAF7; --paper-warm:#F4F2EC;
  --ink-900:#0B0F0E; --ink-800:#171C1B; --ink-700:#2A302F; --ink-600:#454C4B;
  --ink-500:#6B7270; --ink-400:#9AA09E; --ink-300:#C4C8C6; --ink-200:#E4E6E4;
  --ink-100:#EFF0EE; --ink-50:#F5F6F4;
  --mineral-900:#062F26; --mineral-800:#0A4A3D; --mineral-700:#0E7C66; --mineral-600:#149E83;
  --mineral-500:#1FBFA0; --mineral-400:#5BD4BC; --mineral-300:#A4E8DA; --mineral-200:#D1F2EB;
  --mineral-100:#E8F8F4;
  --signal-red:#B43A2C; --signal-red-bg:#FAE2DD;
  --amber:#C68A1F; --amber-bg:#FCF1D9;
  --slate:#3F5165; --slate-bg:#E5EAF0;
  --grain:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.04 0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");

  font-family:'Inter Tight',Inter,system-ui,sans-serif;
  background:var(--paper); background-image:var(--grain); background-size:220px;
  color:var(--ink-900);
  min-height:100vh; height:100vh; overflow:hidden;
  font-feature-settings:"ss01","cv11";
  display:grid; grid-template-columns:240px 1fr;
  -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
}
.vx-admin.no-grain{ background-image:none; }
.vx-admin ::selection{ background:var(--mineral-700); color:#FAFAF7; }
.vx-admin *:focus-visible{ outline:2px solid var(--mineral-700); outline-offset:2px; border-radius:3px; }
.vx-admin ::-webkit-scrollbar{ width:8px; height:8px; }
.vx-admin ::-webkit-scrollbar-thumb{ background:rgba(11,15,14,0.12); border-radius:6px; }

.vx-admin .display{ font-family:'Fraunces',Georgia,serif; letter-spacing:-0.04em; font-weight:400; }
.vx-admin .mono{ font-family:'JetBrains Mono',Menlo,monospace; }
.vx-admin .eyebrow{ font-size:0.6875rem; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink-500); }

/* ─────────── left nav (dark) ─────────── */
.vx-admin .nav{
  background:#0B0F0E; color:#FAFAF7;
  padding:20px 16px 24px;
  position:sticky; top:0; height:100vh;
  display:flex; flex-direction:column;
  border-right:1px solid rgba(255,255,255,0.06);
  overflow:hidden;
}
.vx-admin .nav::before{
  content:''; position:absolute; top:-180px; right:-120px;
  width:340px; height:340px; border-radius:50%;
  background:rgba(14,124,102,0.22); filter:blur(80px); pointer-events:none;
}
.vx-admin .nav > *{ position:relative; z-index:1; }
.vx-admin .nav-logo{ display:flex; align-items:center; gap:10px; padding:6px 8px 18px; }
.vx-admin .nav-mark{ width:32px; height:32px; border-radius:7px; background:var(--mineral-700); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.3); }
.vx-admin .nav-wordmark{ font-family:'Fraunces',Georgia,serif; font-size:18px; letter-spacing:-0.04em; }
.vx-admin .nav-wordmark .ath{ color:var(--mineral-400); font-style:italic; font-weight:300; margin-left:4px; }
.vx-admin .nav-sub{ font-size:9.5px; text-transform:uppercase; letter-spacing:0.2em; color:var(--mineral-400); margin-top:2px; }
.vx-admin .nav-section{ font-size:10px; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:rgba(250,250,247,0.4); padding:14px 10px 6px; }
.vx-admin .nav-item{
  display:flex; align-items:center; gap:10px;
  padding:8px 10px; border-radius:6px;
  font-size:13.5px; font-weight:500;
  color:rgba(250,250,247,0.72);
  cursor:pointer; transition:background 0.15s, color 0.15s;
  text-decoration:none; margin-bottom:1px;
  border:none; background:transparent; width:100%;
  font-family:inherit; text-align:left;
}
.vx-admin .nav-item:hover{ background:rgba(255,255,255,0.04); color:#FAFAF7; }
.vx-admin .nav-item.active{ background:rgba(14,124,102,0.18); color:#FAFAF7; box-shadow:inset 2px 0 0 var(--mineral-500); }
.vx-admin .nav-item svg{ flex-shrink:0; opacity:0.75; }
.vx-admin .nav-item.active svg{ opacity:1; color:var(--mineral-400); }
.vx-admin .nav-count{ margin-left:auto; font-size:11px; font-weight:600; background:rgba(255,255,255,0.07); color:rgba(250,250,247,0.85); padding:1px 7px; border-radius:999px; font-family:'JetBrains Mono',monospace; }
.vx-admin .nav-count.hot{ background:rgba(180,58,44,0.25); color:#F4B5AB; }
.vx-admin .nav-spacer{ flex:1; }
.vx-admin .nav-user{ display:flex; align-items:center; gap:10px; padding:10px; border-radius:8px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); cursor:pointer; transition:background 0.15s, border-color 0.15s; width:100%; text-align:left; font-family:inherit; }
.vx-admin .nav-user:hover{ background:rgba(255,255,255,0.07); border-color:rgba(255,255,255,0.12); }
.vx-admin .nav-avatar{ width:30px; height:30px; border-radius:50%; background:var(--mineral-700); color:#FAFAF7; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0; }
.vx-admin .nav-user-name{ font-size:13px; font-weight:500; color:#FAFAF7; }
.vx-admin .nav-user-role{ font-size:11px; color:rgba(250,250,247,0.5); }

/* ─────────── main column ─────────── */
.vx-admin .main{ display:flex; flex-direction:column; min-width:0; height:100vh; overflow-y:auto; }
.vx-admin .topbar{
  height:56px; padding:0 28px; display:flex; align-items:center; gap:16px;
  border-bottom:1px solid var(--ink-200);
  background:rgba(250,250,247,0.85); backdrop-filter:blur(8px);
  position:sticky; top:0; z-index:10; flex-shrink:0;
}
.vx-admin .breadcrumb{ display:flex; align-items:center; gap:8px; font-size:13px; color:var(--ink-500); }
.vx-admin .breadcrumb .sep{ color:var(--ink-300); }
.vx-admin .breadcrumb .here{ color:var(--ink-900); font-weight:500; }
.vx-admin .topbar-search{ margin-left:auto; position:relative; width:300px; }
.vx-admin .topbar-search input{ width:100%; height:34px; padding:0 12px 0 34px; border:1px solid var(--ink-200); border-radius:6px; background:white; font-family:inherit; font-size:13px; color:var(--ink-900); outline:none; }
.vx-admin .topbar-search input::placeholder{ color:var(--ink-400); }
.vx-admin .topbar-search input:focus{ border-color:var(--mineral-700); box-shadow:0 0 0 3px rgba(14,124,102,0.1); }
.vx-admin .topbar-search svg{ position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--ink-400); }
.vx-admin .topbar-search .kbd{ position:absolute; right:8px; top:50%; transform:translateY(-50%); font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--ink-400); background:var(--ink-50); border:1px solid var(--ink-200); padding:1px 5px; border-radius:4px; }
.vx-admin .top-pill{ display:inline-flex; align-items:center; gap:6px; padding:5px 10px; border-radius:999px; font-size:11.5px; font-weight:500; background:var(--mineral-100); color:var(--mineral-800); border:1px solid var(--mineral-200); }
.vx-admin .top-pill .dot{ width:6px; height:6px; border-radius:50%; background:var(--mineral-600); animation:vx-pulse 2s infinite; }
@keyframes vx-pulse{ 0%,100%{opacity:1;} 50%{opacity:0.4;} }

/* page header */
.vx-admin .page-head{ padding:32px 28px 16px; }
.vx-admin .page-head .eyebrow{ display:flex; align-items:center; gap:8px; }
.vx-admin .page-head .eyebrow::before{ content:''; width:24px; height:1px; background:var(--ink-300); }
.vx-admin .page-title{ font-family:'Fraunces',Georgia,serif; font-size:38px; line-height:1.05; letter-spacing:-0.04em; margin-top:6px; color:var(--ink-900); }
.vx-admin .page-title em{ font-style:italic; font-weight:300; color:var(--mineral-700); }
.vx-admin .page-sub{ font-size:14px; color:var(--ink-500); margin-top:8px; max-width:560px; line-height:1.55; }
.vx-admin .page-head-row{ display:flex; align-items:flex-end; justify-content:space-between; gap:24px; flex-wrap:wrap; }
.vx-admin .page-head-actions{ display:flex; gap:10px; align-items:center; }

/* buttons */
.vx-admin .btn{ display:inline-flex; align-items:center; gap:7px; height:38px; padding:0 14px; border-radius:6px; font-family:inherit; font-size:13.5px; font-weight:500; cursor:pointer; transition:all 0.15s; border:1px solid transparent; white-space:nowrap; }
.vx-admin .btn-primary{ background:var(--mineral-700); color:#FAFAF7; box-shadow:0 1px 0 rgba(11,15,14,0.1), inset 0 1px 0 rgba(255,255,255,0.08); }
.vx-admin .btn-primary:hover{ background:var(--mineral-800); }
.vx-admin .btn-ghost{ background:white; border-color:var(--ink-200); color:var(--ink-700); }
.vx-admin .btn-ghost:hover{ background:var(--ink-50); border-color:var(--ink-300); }
.vx-admin .btn-dark{ background:var(--ink-900); color:#FAFAF7; }
.vx-admin .btn-dark:hover{ background:var(--ink-800); }
.vx-admin .btn-danger-ghost{ background:white; border-color:var(--ink-200); color:var(--signal-red); }
.vx-admin .btn-danger-ghost:hover{ background:var(--signal-red-bg); border-color:rgba(180,58,44,0.25); }
.vx-admin .btn-sm{ height:30px; padding:0 11px; font-size:12.5px; }

/* KPI strip */
.vx-admin .kpis{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; padding:0 28px 22px; }
.vx-admin .kpi{ background:white; border:1px solid var(--ink-200); border-radius:8px; padding:16px 18px; position:relative; overflow:hidden; }
.vx-admin .kpi::after{ content:''; position:absolute; right:-30px; top:-30px; width:80px; height:80px; border-radius:50%; background:var(--accent, var(--mineral-100)); opacity:0.5; }
.vx-admin .kpi-label{ font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink-500); font-weight:500; }
.vx-admin .kpi-val{ font-family:'Fraunces',Georgia,serif; font-size:32px; line-height:1; letter-spacing:-0.04em; color:var(--ink-900); margin-top:8px; position:relative; z-index:1; }
.vx-admin .kpi-delta{ margin-top:8px; font-size:11.5px; color:var(--ink-500); display:flex; align-items:center; gap:5px; position:relative; z-index:1; }
.vx-admin .kpi-delta .up{ color:var(--mineral-700); font-weight:600; }
.vx-admin .kpi-delta .dn{ color:var(--signal-red); font-weight:600; }

/* tabs */
.vx-admin .tabs{ display:flex; gap:4px; padding:0 28px; border-bottom:1px solid var(--ink-200); margin-top:8px; }
.vx-admin .tab{ padding:11px 14px; font-size:13.5px; font-weight:500; color:var(--ink-500); cursor:pointer; border:none; background:none; font-family:inherit; border-bottom:2px solid transparent; margin-bottom:-1px; display:inline-flex; align-items:center; gap:8px; transition:color 0.15s, border-color 0.15s; }
.vx-admin .tab:hover{ color:var(--ink-800); }
.vx-admin .tab.active{ color:var(--ink-900); border-bottom-color:var(--mineral-700); font-weight:600; }
.vx-admin .tab .count{ font-family:'JetBrains Mono',monospace; font-size:11px; padding:1px 6px; border-radius:999px; background:var(--ink-100); color:var(--ink-600); }
.vx-admin .tab.active .count{ background:var(--mineral-100); color:var(--mineral-800); }

/* toolbar above table */
.vx-admin .toolbar{ display:flex; align-items:center; gap:10px; padding:16px 28px; flex-wrap:wrap; }
.vx-admin .filter-chip{ display:inline-flex; align-items:center; gap:6px; height:30px; padding:0 11px; border-radius:999px; font-size:12.5px; font-weight:500; color:var(--ink-700); background:white; border:1px solid var(--ink-200); cursor:pointer; transition:all 0.15s; font-family:inherit; }
.vx-admin .filter-chip:hover{ background:var(--ink-50); }
.vx-admin .filter-chip.active{ background:var(--ink-900); color:#FAFAF7; border-color:var(--ink-900); }
.vx-admin .toolbar-search{ position:relative; min-width:240px; }
.vx-admin .toolbar-search input{ width:100%; height:32px; padding:0 12px 0 32px; border:1px solid var(--ink-200); border-radius:6px; background:white; font-family:inherit; font-size:12.5px; outline:none; }
.vx-admin .toolbar-search input:focus{ border-color:var(--mineral-700); box-shadow:0 0 0 3px rgba(14,124,102,0.1); }
.vx-admin .toolbar-search svg{ position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--ink-400); }
.vx-admin .toolbar-spacer{ flex:1; }

/* table */
.vx-admin .table-wrap{ margin:0 28px 32px; background:white; border:1px solid var(--ink-200); border-radius:8px; overflow:hidden; }
.vx-admin table{ width:100%; border-collapse:collapse; font-size:13px; }
.vx-admin thead th{ text-align:left; padding:11px 16px; font-size:10.5px; text-transform:uppercase; letter-spacing:0.12em; font-weight:600; color:var(--ink-500); background:var(--ink-50); border-bottom:1px solid var(--ink-200); white-space:nowrap; }
.vx-admin tbody td{ padding:14px 16px; border-bottom:1px solid var(--ink-100); vertical-align:middle; }
.vx-admin tbody tr{ cursor:pointer; transition:background 0.1s; }
.vx-admin tbody tr:hover{ background:var(--ink-50); }
.vx-admin tbody tr.selected{ background:var(--mineral-100); }
.vx-admin tbody tr:last-child td{ border-bottom:none; }
.vx-admin .empty-row td{ text-align:center; color:var(--ink-500); padding:40px 16px; cursor:default; }
.vx-admin .empty-row:hover{ background:white; }

.vx-admin .hosp-cell{ display:flex; align-items:center; gap:11px; }
.vx-admin .hosp-mark{ width:34px; height:34px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-family:'Fraunces',Georgia,serif; font-size:14px; font-weight:500; color:#FAFAF7; flex-shrink:0; }
.vx-admin .hosp-name{ font-weight:600; color:var(--ink-900); font-size:13.5px; }
.vx-admin .hosp-id{ font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--ink-500); margin-top:1px; }

/* badges */
.vx-admin .badge{ display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:999px; font-size:11.5px; font-weight:500; line-height:1; border:1px solid transparent; white-space:nowrap; }
.vx-admin .badge .dot{ width:6px; height:6px; border-radius:50%; }
.vx-admin .b-active{ background:var(--mineral-100); color:var(--mineral-800); border-color:var(--mineral-200); }
.vx-admin .b-active .dot{ background:var(--mineral-600); }
.vx-admin .b-pending{ background:var(--amber-bg); color:#8C5F0E; border-color:#F2DEA8; }
.vx-admin .b-pending .dot{ background:var(--amber); }
.vx-admin .b-suspended{ background:var(--signal-red-bg); color:var(--signal-red); border-color:#F2C7C0; }
.vx-admin .b-suspended .dot{ background:var(--signal-red); }
.vx-admin .b-onboarding{ background:var(--slate-bg); color:var(--slate); border-color:#CFD7E0; }
.vx-admin .b-onboarding .dot{ background:var(--slate); }
.vx-admin .b-trial{ background:#F0EAFA; color:#5A3FA0; border-color:#DCD0F2; }
.vx-admin .b-trial .dot{ background:#7A5BC9; }

.vx-admin .plan-pill{ display:inline-block; padding:2px 8px; border-radius:4px; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:500; background:var(--ink-100); color:var(--ink-700); }
.vx-admin .plan-pill.scale{ background:#262C2B; color:#FAFAF7; }
.vx-admin .plan-pill.core{ background:var(--mineral-100); color:var(--mineral-800); }
.vx-admin .plan-pill.pilot{ background:var(--amber-bg); color:#8C5F0E; }
.vx-admin .plan-pill.enterprise{ background:#F0EAFA; color:#5A3FA0; }

.vx-admin .row-actions{ display:flex; gap:6px; opacity:0; transition:opacity 0.12s; }
.vx-admin tr:hover .row-actions{ opacity:1; }
.vx-admin .icon-btn{ width:28px; height:28px; border-radius:5px; background:transparent; border:1px solid transparent; color:var(--ink-500); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.12s; }
.vx-admin .icon-btn:hover{ background:white; border-color:var(--ink-200); color:var(--ink-800); }
.vx-admin .meta-line{ font-size:12px; color:var(--ink-500); }
.vx-admin .meta-line .mono{ color:var(--ink-700); }

/* approvals queue cards */
.vx-admin .approvals-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(380px,1fr)); gap:14px; padding:8px 28px 32px; }
.vx-admin .approval-card{ background:white; border:1px solid var(--ink-200); border-radius:10px; padding:18px 20px; display:flex; flex-direction:column; gap:14px; position:relative; }
.vx-admin .approval-card::before{ content:''; position:absolute; left:0; top:18px; bottom:18px; width:3px; background:var(--amber); border-radius:0 3px 3px 0; }
.vx-admin .approval-card.calm::before{ background:var(--ink-200); }
.vx-admin .approval-head{ display:flex; align-items:flex-start; gap:12px; }
.vx-admin .approval-name{ font-weight:600; font-size:15px; color:var(--ink-900); }
.vx-admin .approval-loc{ font-size:12.5px; color:var(--ink-500); margin-top:2px; }
.vx-admin .approval-grid2{ display:grid; grid-template-columns:1fr 1fr; gap:10px 14px; padding:12px 14px; background:var(--ink-50); border-radius:6px; font-size:12.5px; }
.vx-admin .approval-grid2 .k{ font-size:10px; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-500); font-weight:500; margin-bottom:2px; }
.vx-admin .approval-grid2 .v{ color:var(--ink-800); font-weight:500; }
.vx-admin .approval-grid2 .v.mono{ font-family:'JetBrains Mono',monospace; font-size:12px; }
.vx-admin .approval-foot{ display:flex; justify-content:space-between; align-items:center; gap:8px; }
.vx-admin .approval-foot .submitted{ font-size:11.5px; color:var(--ink-500); }
.vx-admin .approval-foot .actions{ display:flex; gap:6px; }

/* drawer (register hospital) */
.vx-admin .drawer-backdrop{ position:fixed; inset:0; background:rgba(11,15,14,0.4); backdrop-filter:blur(2px); opacity:0; pointer-events:none; transition:opacity 0.2s; z-index:50; }
.vx-admin .drawer-backdrop.open{ opacity:1; pointer-events:auto; }
.vx-admin .drawer{ position:fixed; top:0; right:0; bottom:0; width:560px; max-width:100vw; background:var(--paper); background-image:var(--grain); background-size:220px; border-left:1px solid var(--ink-200); box-shadow:-24px 0 40px rgba(11,15,14,0.08); transform:translateX(100%); transition:transform 0.28s cubic-bezier(0.2,0.9,0.3,1); z-index:60; display:flex; flex-direction:column; }
.vx-admin .drawer.open{ transform:translateX(0); }
.vx-admin .drawer-head{ padding:20px 24px 14px; border-bottom:1px solid var(--ink-200); display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
.vx-admin .drawer-eyebrow{ font-size:10.5px; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:var(--mineral-700); margin-bottom:4px; display:flex; align-items:center; gap:6px; }
.vx-admin .drawer-title{ font-family:'Fraunces',Georgia,serif; font-size:24px; line-height:1.1; letter-spacing:-0.03em; color:var(--ink-900); }
.vx-admin .drawer-title em{ font-style:italic; font-weight:300; color:var(--mineral-700); }
.vx-admin .drawer-close{ width:32px; height:32px; border-radius:6px; border:1px solid var(--ink-200); background:white; cursor:pointer; color:var(--ink-600); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.vx-admin .drawer-close:hover{ background:var(--ink-50); }

/* stepper */
.vx-admin .stepper{ display:flex; gap:0; padding:14px 24px 0; border-bottom:1px solid var(--ink-200); background:rgba(244,242,236,0.5); }
.vx-admin .step{ flex:1; padding:0 0 12px; cursor:pointer; position:relative; border-bottom:2px solid transparent; background:none; border-left:none; border-right:none; border-top:none; font-family:inherit; text-align:left; }
.vx-admin .step.active{ border-bottom-color:var(--mineral-700); }
.vx-admin .step-num{ width:22px; height:22px; border-radius:50%; background:var(--ink-100); color:var(--ink-500); font-size:11px; font-weight:600; font-family:'JetBrains Mono',monospace; display:inline-flex; align-items:center; justify-content:center; margin-right:8px; }
.vx-admin .step.active .step-num{ background:var(--mineral-700); color:#FAFAF7; }
.vx-admin .step.done .step-num{ background:var(--mineral-100); color:var(--mineral-800); }
.vx-admin .step-label{ font-size:12px; font-weight:500; color:var(--ink-600); }
.vx-admin .step.active .step-label{ color:var(--ink-900); }

.vx-admin .drawer-body{ padding:22px 24px 100px; overflow-y:auto; flex:1; }
.vx-admin .form-section-title{ font-family:'Fraunces',Georgia,serif; font-size:15px; color:var(--ink-700); margin:18px 0 12px; display:flex; align-items:center; gap:10px; }
.vx-admin .form-section-title::after{ content:''; flex:1; height:1px; background:var(--ink-200); }
.vx-admin .form-section-title:first-child{ margin-top:0; }
.vx-admin .field{ margin-bottom:14px; }
.vx-admin .field-2col{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
.vx-admin .field-3col{ display:grid; grid-template-columns:1.4fr 1fr 1fr; gap:12px; margin-bottom:14px; }
.vx-admin .lbl{ font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-500); font-weight:500; margin-bottom:6px; display:flex; align-items:center; gap:4px; }
.vx-admin .lbl .req{ color:var(--signal-red); }
.vx-admin .inp, .vx-admin .sel, .vx-admin .ta{ width:100%; height:38px; padding:0 12px; border:1px solid var(--ink-200); border-radius:6px; background:white; color:var(--ink-900); font-family:inherit; font-size:13.5px; outline:none; transition:border-color 0.15s, box-shadow 0.15s; }
.vx-admin .ta{ height:auto; padding:10px 12px; resize:vertical; min-height:80px; line-height:1.5; }
.vx-admin .inp:focus, .vx-admin .sel:focus, .vx-admin .ta:focus{ border-color:var(--mineral-700); box-shadow:0 0 0 3px rgba(14,124,102,0.1); }
.vx-admin .inp::placeholder, .vx-admin .ta::placeholder{ color:var(--ink-400); }
.vx-admin .helper{ font-size:11.5px; color:var(--ink-500); margin-top:5px; line-height:1.45; }

/* file uploads */
.vx-admin .upload{ display:flex; align-items:center; gap:10px; padding:10px 12px; border:1px dashed var(--ink-300); border-radius:6px; background:var(--ink-50); font-size:12.5px; color:var(--ink-600); cursor:pointer; transition:all 0.15s; margin-bottom:8px; }
.vx-admin .upload:hover{ border-color:var(--mineral-600); background:var(--mineral-100); color:var(--mineral-800); }
.vx-admin .upload.uploaded{ border-style:solid; border-color:var(--mineral-300); background:var(--mineral-100); color:var(--mineral-800); }
.vx-admin .upload-meta{ margin-left:auto; font-family:'JetBrains Mono',monospace; font-size:11px; }

/* approvals checklist */
.vx-admin .check-row{ display:flex; gap:12px; align-items:flex-start; padding:11px 12px; border:1px solid var(--ink-200); border-radius:6px; background:white; margin-bottom:8px; cursor:pointer; transition:border-color 0.15s, background 0.15s; }
.vx-admin .check-row:hover{ border-color:var(--ink-300); }
.vx-admin .check-row.checked{ border-color:var(--mineral-300); background:var(--mineral-100); }
.vx-admin .check-box{ width:18px; height:18px; border-radius:4px; border:1.5px solid var(--ink-300); background:white; flex-shrink:0; margin-top:1px; display:flex; align-items:center; justify-content:center; color:transparent; transition:all 0.15s; }
.vx-admin .check-row.checked .check-box{ border-color:var(--mineral-700); background:var(--mineral-700); color:white; }
.vx-admin .check-title{ font-size:13px; font-weight:500; color:var(--ink-900); }
.vx-admin .check-desc{ font-size:11.5px; color:var(--ink-500); margin-top:2px; line-height:1.4; }

/* drawer foot */
.vx-admin .drawer-foot{ position:absolute; bottom:0; left:0; right:0; padding:14px 24px; background:rgba(250,250,247,0.95); backdrop-filter:blur(8px); border-top:1px solid var(--ink-200); display:flex; gap:10px; align-items:center; justify-content:space-between; }
.vx-admin .drawer-foot .progress{ font-size:12px; color:var(--ink-500); font-family:'JetBrains Mono',monospace; }

/* credentials modal */
.vx-admin .modal-back{ position:fixed; inset:0; background:rgba(11,15,14,0.55); backdrop-filter:blur(4px); display:none; align-items:center; justify-content:center; z-index:80; padding:24px; }
.vx-admin .modal-back.open{ display:flex; }
.vx-admin .modal{ width:100%; max-width:480px; background:var(--paper); background-image:var(--grain); background-size:220px; border-radius:12px; padding:28px; box-shadow:0 20px 60px rgba(0,0,0,0.3); border:1px solid var(--ink-200); animation:vx-modalIn 0.22s cubic-bezier(0.2,0.9,0.3,1); max-height:90vh; overflow-y:auto; }
@keyframes vx-modalIn{ from{ opacity:0; transform:translateY(8px) scale(0.98); } to{ opacity:1; transform:translateY(0) scale(1); } }
.vx-admin .modal-icon{ width:44px; height:44px; border-radius:10px; background:var(--mineral-100); color:var(--mineral-700); display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
.vx-admin .modal-eyebrow{ font-size:10.5px; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:var(--mineral-700); }
.vx-admin .modal-title{ font-family:'Fraunces',Georgia,serif; font-size:24px; line-height:1.1; letter-spacing:-0.03em; margin:6px 0 6px; }
.vx-admin .modal-title em{ font-style:italic; font-weight:300; color:var(--mineral-700); }
.vx-admin .modal-sub{ font-size:13.5px; color:var(--ink-500); line-height:1.55; margin-bottom:18px; }
.vx-admin .cred-row{ display:flex; align-items:center; gap:10px; padding:11px 14px; background:white; border:1px solid var(--ink-200); border-radius:6px; margin-bottom:8px; font-family:'JetBrains Mono',monospace; font-size:13px; }
.vx-admin .cred-row .k{ font-size:10.5px; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink-500); font-family:'Inter Tight',sans-serif; font-weight:500; min-width:80px; }
.vx-admin .cred-row .v{ flex:1; color:var(--ink-900); font-weight:500; user-select:all; word-break:break-all; }
.vx-admin .cred-copy{ background:var(--ink-50); border:1px solid var(--ink-200); color:var(--ink-600); padding:4px 8px; border-radius:4px; cursor:pointer; font-size:11px; font-family:'Inter Tight',sans-serif; font-weight:500; transition:all 0.15s; }
.vx-admin .cred-copy:hover{ background:var(--ink-100); color:var(--ink-900); }
.vx-admin .cred-copy.copied{ background:var(--mineral-700); color:#FAFAF7; border-color:var(--mineral-700); }
.vx-admin .modal-note{ margin:16px 0 18px; padding:11px 14px; background:var(--amber-bg); border:1px solid #F2DEA8; border-radius:6px; font-size:12.5px; color:#7A4F0A; line-height:1.5; display:flex; gap:10px; align-items:flex-start; }
.vx-admin .modal-foot{ display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }

/* tweaks panel */
.vx-admin .tweaks{ position:fixed; bottom:18px; right:18px; width:260px; background:var(--ink-900); color:#FAFAF7; border-radius:10px; padding:14px; z-index:40; font-size:12.5px; box-shadow:0 12px 32px rgba(0,0,0,0.25); display:none; }
.vx-admin .tweaks.open{ display:block; }
.vx-admin .tweaks h4{ font-family:'Fraunces',Georgia,serif; font-size:14px; font-weight:400; margin-bottom:10px; letter-spacing:-0.02em; }
.vx-admin .tweaks .row{ display:flex; gap:8px; align-items:center; margin-bottom:9px; }
.vx-admin .tweaks .row label{ flex:1; font-size:12px; color:rgba(250,250,247,0.7); }
.vx-admin .swatch{ width:22px; height:22px; border-radius:5px; cursor:pointer; border:2px solid transparent; }
.vx-admin .swatch.active{ border-color:#FAFAF7; }
.vx-admin .tweaks-toggle{ position:fixed; bottom:18px; right:18px; z-index:39; background:var(--ink-900); color:#FAFAF7; border:none; width:42px; height:42px; border-radius:50%; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,0.2); display:flex; align-items:center; justify-content:center; }

/* license tab */
.vx-admin .license-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:14px; padding:8px 28px 32px; }
.vx-admin .license-card{ background:white; border:1px solid var(--ink-200); border-radius:10px; padding:18px; display:flex; flex-direction:column; gap:10px; }
.vx-admin .license-head{ display:flex; align-items:center; gap:10px; }
.vx-admin .license-doc{ width:36px; height:44px; border-radius:4px; background:var(--paper-warm); border:1px solid var(--ink-200); display:flex; align-items:center; justify-content:center; color:var(--mineral-700); flex-shrink:0; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:600; flex-direction:column; line-height:1.1; }
.vx-admin .license-doc .ext{ font-size:8px; color:var(--ink-500); }
.vx-admin .license-name{ font-weight:600; font-size:13.5px; color:var(--ink-900); }
.vx-admin .license-hosp{ font-size:11.5px; color:var(--ink-500); }
.vx-admin .license-meta{ display:flex; justify-content:space-between; font-size:11.5px; color:var(--ink-500); padding-top:8px; border-top:1px dashed var(--ink-200); }
.vx-admin .license-meta .v{ color:var(--ink-800); font-family:'JetBrains Mono',monospace; }

/* activity */
.vx-admin .activity-list{ padding:0 28px 32px; }
.vx-admin .act-item{ display:flex; gap:14px; padding:14px 16px; border-left:2px solid var(--ink-200); margin-left:8px; position:relative; }
.vx-admin .act-item::before{ content:''; position:absolute; left:-7px; top:18px; width:11px; height:11px; border-radius:50%; background:white; border:2px solid var(--ink-300); }
.vx-admin .act-item.ok::before{ border-color:var(--mineral-600); background:var(--mineral-500); }
.vx-admin .act-item.warn::before{ border-color:var(--amber); background:var(--amber); }
.vx-admin .act-item.danger::before{ border-color:var(--signal-red); background:var(--signal-red); }
.vx-admin .act-time{ font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--ink-500); width:90px; flex-shrink:0; padding-top:2px; }
.vx-admin .act-body{ flex:1; }
.vx-admin .act-title{ font-size:13px; color:var(--ink-900); }
.vx-admin .act-title b{ font-weight:600; }
.vx-admin .act-detail{ font-size:11.5px; color:var(--ink-500); margin-top:2px; }

/* placeholder (platform views) */
.vx-admin .placeholder{ padding:64px 28px; display:flex; flex-direction:column; align-items:center; text-align:center; color:var(--ink-500); gap:8px; }
.vx-admin .placeholder .ph-icon{ width:56px; height:56px; border-radius:14px; background:var(--mineral-100); color:var(--mineral-700); display:flex; align-items:center; justify-content:center; margin-bottom:6px; }
.vx-admin .placeholder h3{ font-family:'Fraunces',Georgia,serif; font-size:22px; color:var(--ink-900); font-weight:400; }
.vx-admin .placeholder p{ font-size:13.5px; max-width:380px; line-height:1.55; }

.vx-admin .view{ display:block; }

@media (max-width: 1024px){
  .vx-admin{ grid-template-columns:1fr; }
  .vx-admin .nav{ display:none; }
  .vx-admin .kpis{ grid-template-columns:repeat(2,1fr); }
}

/* ============================================================================
   APPENDED BLOCK — additions on top of the verbatim reference port.
   Add any future CSS here; never edit selectors above this line.
   ============================================================================ */

/* sidebar profile menu (Profile / Sign out) — required parity with other portals */
.vx-admin .nav-user-wrap{ position:relative; }
.vx-admin .nav-menu{
  position:absolute; bottom:calc(100% + 8px); left:0; right:0;
  background:#FAFAF7; border:1px solid var(--ink-200); border-radius:10px;
  box-shadow:0 12px 32px rgba(11,15,14,0.22); padding:6px; z-index:30;
  animation:vx-menuIn 0.14s ease both;
}
@keyframes vx-menuIn{ from{ opacity:0; transform:translateY(4px); } to{ opacity:1; transform:translateY(0); } }
.vx-admin .nav-menu-action{
  display:flex; align-items:center; gap:9px; width:100%;
  padding:8px 10px; border-radius:7px; border:none; background:transparent;
  font-size:13px; font-weight:500; cursor:pointer; text-align:left;
  font-family:inherit; transition:background 0.13s;
}
.vx-admin .nav-menu-action svg{ flex-shrink:0; }
.vx-admin .nav-menu-action.profile{ color:var(--mineral-700); }
.vx-admin .nav-menu-action.profile:hover{ background:var(--mineral-100); }
.vx-admin .nav-menu-action.signout{ color:var(--signal-red); }
.vx-admin .nav-menu-action.signout:hover{ background:var(--signal-red-bg); }
.vx-admin .nav-menu-divider{ height:1px; background:var(--ink-200); margin:5px 4px; }
.vx-admin .nav-caret{ margin-left:auto; color:rgba(250,250,247,0.5); transition:transform 0.15s; }
.vx-admin .nav-user[aria-expanded="true"] .nav-caret{ transform:rotate(180deg); }

/* profile modal (themed to match paper aesthetic) */
.vx-admin .pm-overlay{ position:fixed; inset:0; background:rgba(11,15,14,0.4); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; z-index:90; padding:24px; }
.vx-admin .pm-card{ width:100%; max-width:440px; background:var(--paper); background-image:var(--grain); background-size:220px; border:1px solid var(--ink-200); border-radius:14px; padding:26px; box-shadow:0 20px 60px rgba(11,15,14,0.2); max-height:90vh; overflow-y:auto; }
.vx-admin .pm-head{ display:flex; align-items:center; gap:14px; margin-bottom:22px; }
.vx-admin .pm-avatar{ width:56px; height:56px; border-radius:50%; background:var(--mineral-700); color:#FAFAF7; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:600; font-family:'Fraunces',Georgia,serif; flex-shrink:0; }
.vx-admin .pm-name{ font-family:'Fraunces',Georgia,serif; font-size:20px; letter-spacing:-0.02em; color:var(--ink-900); }
.vx-admin .pm-role{ font-size:12.5px; color:var(--ink-500); margin-top:2px; }
.vx-admin .pm-foot{ display:flex; gap:10px; margin-top:20px; }

/* compact density (Tweaks → Density: Compact) */
.vx-admin.density-compact tbody td{ padding:9px 16px; }
.vx-admin.density-compact .kpi{ padding:12px 14px; }
.vx-admin.density-compact .approval-card{ padding:14px 16px; }
.vx-admin.density-compact .license-card{ padding:14px; }
`;

/* Append the mobile-refinement block to the CSS template literal above. */
export const CSS_MOBILE = `
/* ============================================================================
   MOBILE REFINEMENTS (≤ 760px) — append-only; do not edit selectors above.
   ============================================================================ */
@media (max-width: 760px){
  .vx-admin .topbar{ height:auto; padding:10px 16px; gap:10px; flex-wrap:wrap; }
  .vx-admin .breadcrumb{ width:100%; order:1; }
  .vx-admin .topbar-search{ margin-left:0; width:100%; order:3; }
  .vx-admin .top-pill{ order:2; }

  .vx-admin .page-head{ padding:22px 16px 12px; }
  .vx-admin .page-title{ font-size:30px; }
  .vx-admin .page-head-row{ align-items:flex-start; }
  .vx-admin .page-head-actions{ width:100%; }

  .vx-admin .kpis{ padding:0 16px 16px; }

  .vx-admin .tabs{ padding:0 16px; overflow-x:auto; -webkit-overflow-scrolling:touch; }
  .vx-admin .tab{ white-space:nowrap; flex-shrink:0; }

  .vx-admin .toolbar{ padding:14px 16px; }
  .vx-admin .toolbar-search{ min-width:0; flex:1 1 100%; }

  .vx-admin .table-wrap{ margin:0 16px 24px; overflow-x:auto; }
  .vx-admin table{ min-width:720px; }

  .vx-admin .approvals-grid,
  .vx-admin .license-grid{ grid-template-columns:minmax(0,1fr); padding:8px 16px 24px; }
  .vx-admin .approval-foot{ flex-direction:column; align-items:stretch; }
  .vx-admin .approval-foot .actions{ flex-wrap:wrap; }
  .vx-admin .approval-foot .actions .btn{ flex:1; justify-content:center; }

  .vx-admin .activity-list{ padding:0 16px 24px; }
  .vx-admin .act-time{ width:74px; }

  .vx-admin .drawer{ width:100vw; }
  .vx-admin .field-2col,
  .vx-admin .field-3col{ grid-template-columns:minmax(0,1fr); }
}
@media (max-width: 460px){
  .vx-admin .kpis{ grid-template-columns:minmax(0,1fr); }
  .vx-admin .page-head-actions{ flex-direction:column; }
  .vx-admin .page-head-actions .btn{ width:100%; justify-content:center; }
}
`;

/* ============================================================================
   ATH · SUPPORT CONSOLE additions — append-only.
   Sidebar foot + sign-out · topbar bell + profile menu · dashboard panels.
   Never edit selectors above this line; add future CSS at the end here.
   ============================================================================ */
export const CSS_ATH = `
/* ── sidebar: scroll region + pinned foot ─────────────────────────────── */
.vx-admin .nav-scroll{ flex:1; overflow-y:auto; overflow-x:hidden; margin:0 -4px; padding:0 4px; }
.vx-admin .nav-scroll::-webkit-scrollbar{ width:6px; }
.vx-admin .nav-scroll::-webkit-scrollbar-thumb{ background:rgba(255,255,255,0.12); border-radius:6px; }
.vx-admin .nav-foot{ padding-top:12px; margin-top:8px; border-top:1px solid rgba(255,255,255,0.07); }
.vx-admin .nav-foot .nav-user{ cursor:default; margin-bottom:8px; }
.vx-admin .nav-foot .nav-user:hover{ background:rgba(255,255,255,0.04); border-color:rgba(255,255,255,0.06); }
.vx-admin .nav-logout{
  display:flex; align-items:center; justify-content:center; gap:8px; width:100%;
  height:34px; border-radius:7px; border:1px solid rgba(255,255,255,0.08);
  background:rgba(255,255,255,0.02); color:rgba(250,250,247,0.7);
  font-family:inherit; font-size:12.5px; font-weight:500; cursor:pointer;
  transition:background 0.14s, color 0.14s, border-color 0.14s;
}
.vx-admin .nav-logout:hover{ background:rgba(180,58,44,0.18); border-color:rgba(180,58,44,0.3); color:#F4B5AB; }
.vx-admin .nav-logout svg{ flex-shrink:0; }

/* ── topbar: notifications bell ───────────────────────────────────────── */
.vx-admin .top-icon{
  position:relative; width:34px; height:34px; border-radius:7px;
  border:1px solid var(--ink-200); background:white; color:var(--ink-600);
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:background 0.14s, border-color 0.14s, color 0.14s; flex-shrink:0;
}
.vx-admin .top-icon:hover{ background:var(--ink-50); border-color:var(--ink-300); color:var(--ink-900); }
.vx-admin .ndot{ position:absolute; top:7px; right:8px; width:6px; height:6px; border-radius:50%; background:var(--signal-red); border:1.5px solid white; }

/* ── topbar: profile button + menu (tb- prefixed: no clash with ProfileModal) ─ */
.vx-admin .profile-wrap{ position:relative; flex-shrink:0; }
.vx-admin .profile-btn{
  display:flex; align-items:center; gap:8px; height:34px; padding:0 9px 0 5px;
  border-radius:999px; border:1px solid var(--ink-200); background:white;
  cursor:pointer; font-family:inherit; transition:background 0.14s, border-color 0.14s;
}
.vx-admin .profile-btn:hover{ background:var(--ink-50); border-color:var(--ink-300); }
.vx-admin .pf-av{ width:26px; height:26px; border-radius:50%; background:var(--mineral-700); color:#FAFAF7; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; flex-shrink:0; }
.vx-admin .pf-name{ font-size:13px; font-weight:500; color:var(--ink-800); white-space:nowrap; }
.vx-admin .pf-caret{ color:var(--ink-400); }
.vx-admin .profile-menu{
  position:absolute; top:calc(100% + 8px); right:0; width:240px;
  background:#FAFAF7; border:1px solid var(--ink-200); border-radius:10px;
  box-shadow:0 14px 38px rgba(11,15,14,0.18); padding:6px; z-index:30;
  animation:vx-menuIn 0.14s ease both;
}
.vx-admin .tb-pm-head{ display:flex; align-items:center; gap:10px; padding:8px 8px 10px; border-bottom:1px solid var(--ink-200); margin-bottom:5px; }
.vx-admin .tb-pm-av{ width:34px; height:34px; border-radius:50%; background:var(--mineral-700); color:#FAFAF7; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; flex-shrink:0; }
.vx-admin .tb-pm-name{ font-size:13.5px; font-weight:600; color:var(--ink-900); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vx-admin .tb-pm-mail{ font-size:11.5px; color:var(--ink-500); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vx-admin .tb-pm-item{
  display:flex; align-items:center; gap:10px; width:100%; padding:8px 10px;
  border-radius:7px; border:none; background:transparent; cursor:pointer;
  font-family:inherit; font-size:13px; font-weight:500; color:var(--ink-800);
  text-align:left; transition:background 0.13s, color 0.13s;
}
.vx-admin .tb-pm-item:hover{ background:var(--ink-100); }
.vx-admin .tb-pm-item svg{ flex-shrink:0; color:var(--ink-500); }
.vx-admin .tb-pm-item.danger{ color:var(--signal-red); }
.vx-admin .tb-pm-item.danger svg{ color:var(--signal-red); }
.vx-admin .tb-pm-item.danger:hover{ background:var(--signal-red-bg); }
.vx-admin .tb-pm-sep{ height:1px; background:var(--ink-200); margin:5px 4px; }
.vx-admin .nav-count.mine{ margin-left:auto; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600; background:var(--mineral-100); color:var(--mineral-800); padding:1px 7px; border-radius:999px; }

/* ── dashboard ────────────────────────────────────────────────────────── */
.vx-admin .dash{ padding:0 28px 36px; }
.vx-admin .dash-grid{ display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
.vx-admin .dash-card{ background:white; border:1px solid var(--ink-200); border-radius:10px; padding:18px 20px; }
.vx-admin .dash-card-head{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
.vx-admin .dash-card-title{ font-family:'Fraunces',Georgia,serif; font-size:16px; letter-spacing:-0.02em; color:var(--ink-900); }
.vx-admin .dash-link{ display:inline-flex; align-items:center; gap:4px; border:none; background:none; cursor:pointer; font-family:inherit; font-size:12.5px; font-weight:500; color:var(--mineral-700); transition:color 0.13s; }
.vx-admin .dash-link:hover{ color:var(--mineral-800); }
.vx-admin .dash-list{ display:flex; flex-direction:column; gap:6px; }
.vx-admin .dash-row{ display:flex; align-items:center; gap:12px; padding:9px 10px; border-radius:8px; border:1px solid transparent; background:transparent; cursor:pointer; width:100%; text-align:left; font-family:inherit; transition:background 0.13s, border-color 0.13s; }
.vx-admin .dash-row:hover{ background:var(--ink-50); border-color:var(--ink-200); }
.vx-admin .dash-row-mark{ width:32px; height:32px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-family:'Fraunces',Georgia,serif; font-size:13px; color:#FAFAF7; flex-shrink:0; }
.vx-admin .dash-row-main{ display:flex; flex-direction:column; min-width:0; flex:1; }
.vx-admin .dash-row-name{ font-size:13.5px; font-weight:600; color:var(--ink-900); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vx-admin .dash-row-sub{ font-size:11.5px; color:var(--ink-500); }
.vx-admin .dash-acts{ display:flex; flex-direction:column; }
.vx-admin .dash-act{ display:flex; gap:12px; padding:9px 2px; border-bottom:1px solid var(--ink-100); }
.vx-admin .dash-act:last-child{ border-bottom:none; }
.vx-admin .dash-act-dot{ width:8px; height:8px; border-radius:50%; margin-top:5px; flex-shrink:0; background:var(--ink-300); }
.vx-admin .dash-act.ok .dash-act-dot{ background:var(--mineral-600); }
.vx-admin .dash-act.warn .dash-act-dot{ background:var(--amber); }
.vx-admin .dash-act.danger .dash-act-dot{ background:var(--signal-red); }
.vx-admin .dash-act-body{ min-width:0; flex:1; }
.vx-admin .dash-act-title{ font-size:12.5px; color:var(--ink-800); line-height:1.45; }
.vx-admin .dash-act-title b{ font-weight:600; color:var(--ink-900); }
.vx-admin .dash-act-time{ font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--ink-400); margin-top:2px; }
.vx-admin .dash-table-wrap{ border:1px solid var(--ink-200); border-radius:8px; overflow:hidden; }

/* ── mobile refinements for the ATH additions ─────────────────────────── */
@media (max-width: 760px){
  .vx-admin .breadcrumb{ width:auto; order:0; }
  .vx-admin .topbar-search{ order:9; }
  .vx-admin .top-icon{ order:1; }
  .vx-admin .profile-wrap{ order:2; }
  .vx-admin .pf-name{ display:none; }
  .vx-admin .profile-btn{ padding:0 5px; }
  .vx-admin .dash{ padding:0 16px 28px; }
  .vx-admin .dash-grid{ grid-template-columns:minmax(0,1fr); }
  .vx-admin .dash-table-wrap{ overflow-x:auto; }
  .vx-admin .dash-table-wrap table{ min-width:560px; }
}
`;

/* ============================================================================
   ATH · SUPPORT CONSOLE — full functionality additions (CSS_ATH2). Append-only.
   Quick actions · approval queues (tabs/accept/locked) · licenses table ·
   registration detail · modules · billing & plans · settings.
   Never edit selectors above this line; add future CSS at the end here.
   ============================================================================ */
export const CSS_ATH2 = `
/* ── dashboard quick actions ──────────────────────────────────────────── */
.vx-admin .qa-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:10px; }
.vx-admin .qa-tile{ display:flex; align-items:center; gap:12px; padding:12px 14px; border:1px solid var(--ink-200); border-radius:10px; background:white; cursor:pointer; font-family:inherit; text-align:left; transition:border-color 0.14s, background 0.14s, transform 0.05s; width:100%; }
.vx-admin .qa-tile:hover{ border-color:var(--mineral-300); background:var(--mineral-100); }
.vx-admin .qa-tile:active{ transform:translateY(1px); }
.vx-admin .qa-ico{ width:36px; height:36px; border-radius:9px; background:var(--mineral-100); color:var(--mineral-700); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.vx-admin .qa-tile:hover .qa-ico{ background:white; }
.vx-admin .qa-text{ display:flex; flex-direction:column; min-width:0; flex:1; }
.vx-admin .qa-label{ font-size:13.5px; font-weight:600; color:var(--ink-900); }
.vx-admin .qa-desc{ font-size:11.5px; color:var(--ink-500); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vx-admin .qa-caret{ color:var(--ink-300); flex-shrink:0; }
.vx-admin .qa-tile:hover .qa-caret{ color:var(--mineral-700); }

/* ── approvals: queue tabs + meta + locked rows ───────────────────────── */
.vx-admin .queue-tabs{ display:flex; gap:6px; padding:14px 28px 0; border-bottom:1px solid var(--ink-200); }
.vx-admin .queue-tab{ display:inline-flex; align-items:center; gap:8px; padding:8px 6px 12px; border:none; background:none; cursor:pointer; font-family:inherit; font-size:14px; font-weight:500; color:var(--ink-500); border-bottom:2px solid transparent; margin-bottom:-1px; transition:color 0.14s, border-color 0.14s; }
.vx-admin .queue-tab:hover{ color:var(--ink-800); }
.vx-admin .queue-tab.active{ color:var(--ink-900); font-weight:600; border-bottom-color:var(--mineral-700); }
.vx-admin .queue-tab .count{ font-family:'JetBrains Mono',monospace; font-size:11px; padding:1px 7px; border-radius:999px; background:var(--ink-100); color:var(--ink-600); }
.vx-admin .queue-tab.active .count{ background:var(--mineral-100); color:var(--mineral-800); }
.vx-admin .queue-meta{ display:inline-flex; align-items:center; gap:6px; font-size:12px; color:var(--ink-500); }
.vx-admin .queue-meta svg{ color:var(--mineral-600); }
.vx-admin .queue-agent{ display:inline-flex; align-items:center; gap:7px; font-size:12.5px; font-weight:500; color:var(--ink-700); }
.vx-admin .owner-av{ width:22px; height:22px; border-radius:50%; color:#FAFAF7; display:inline-flex; align-items:center; justify-content:center; font-size:9.5px; font-weight:600; flex-shrink:0; }
.vx-admin .locked-cell{ display:inline-flex; align-items:center; gap:9px; justify-content:flex-end; color:var(--ink-400); }
.vx-admin .locked-cell svg{ color:var(--ink-400); }
.vx-admin tbody tr.no-pointer{ cursor:default; }
.vx-admin tbody tr.no-pointer:hover{ background:white; }
.vx-admin .queue-foot{ display:flex; align-items:flex-start; gap:8px; padding:4px 28px 32px; font-size:12px; color:var(--ink-500); max-width:820px; line-height:1.5; }
.vx-admin .queue-foot svg{ color:var(--ink-400); margin-top:1px; flex-shrink:0; }
.vx-admin .queue-foot b{ color:var(--ink-700); }
.vx-admin .btn-sm[disabled]{ cursor:default; opacity:0.85; }

/* ── licenses table ───────────────────────────────────────────────────── */
.vx-admin .lic-cell{ display:flex; align-items:center; gap:11px; }
.vx-admin .lic-doc{ width:30px; height:30px; border-radius:7px; background:var(--mineral-100); color:var(--mineral-700); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.vx-admin .lic-name{ font-weight:600; font-size:13.5px; color:var(--ink-900); }
.vx-admin .time-left{ min-width:130px; }
.vx-admin .time-left-val{ font-size:12.5px; color:var(--ink-600); }
.vx-admin .time-left-val b{ font-family:'JetBrains Mono',monospace; font-weight:600; color:var(--ink-900); font-size:13px; }
.vx-admin .time-left.lt7 .time-left-val b{ color:var(--signal-red); }
.vx-admin .time-left.lt30 .time-left-val b{ color:var(--amber); }
.vx-admin .time-bar{ margin-top:6px; height:4px; border-radius:999px; background:var(--ink-100); overflow:hidden; }
.vx-admin .time-bar span{ display:block; height:100%; border-radius:999px; }

/* ── registration detail (hospital + approval) ────────────────────────── */
.vx-admin .detail{ padding-bottom:120px; }
.vx-admin .detail-head{ padding:24px 28px 4px; }
.vx-admin .detail-back{ display:inline-flex; align-items:center; gap:5px; border:none; background:none; cursor:pointer; font-family:inherit; font-size:12.5px; font-weight:500; color:var(--mineral-700); padding:0; margin-bottom:16px; }
.vx-admin .detail-back:hover{ color:var(--mineral-800); }
.vx-admin .detail-id{ display:flex; align-items:center; gap:16px; }
.vx-admin .detail-name-row{ display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.vx-admin .detail-name{ font-family:'Fraunces',Georgia,serif; font-size:30px; letter-spacing:-0.03em; color:var(--ink-900); font-weight:400; }
.vx-admin .detail-sub{ font-size:13px; color:var(--ink-500); margin-top:5px; }
.vx-admin .detail-sub .mono{ color:var(--ink-700); }
.vx-admin .detail-note{ margin:16px 28px 0; padding:11px 14px; background:var(--mineral-100); border:1px solid var(--mineral-200); border-radius:8px; font-size:12.5px; color:var(--mineral-800); line-height:1.55; display:flex; align-items:flex-start; gap:8px; }
.vx-admin .detail-note b{ font-weight:600; }
.vx-admin .detail-grid{ display:grid; grid-template-columns:1fr 1fr; gap:16px; padding:18px 28px 8px; align-items:start; }
.vx-admin .detail-card{ background:white; border:1px solid var(--ink-200); border-radius:10px; padding:18px 20px; }
.vx-admin .detail-card-title{ display:flex; align-items:center; gap:8px; font-family:'Fraunces',Georgia,serif; font-size:15px; color:var(--ink-900); margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--ink-100); }
.vx-admin .detail-card-title svg{ color:var(--mineral-700); }
.vx-admin .kv-row{ display:flex; gap:14px; padding:7px 0; align-items:baseline; }
.vx-admin .kv-k{ font-size:10.5px; text-transform:uppercase; letter-spacing:0.08em; color:var(--ink-500); font-weight:500; width:128px; flex-shrink:0; }
.vx-admin .kv-v{ font-size:13px; color:var(--ink-800); font-weight:500; min-width:0; word-break:break-word; }
.vx-admin .kv-v.mono{ font-family:'JetBrains Mono',monospace; font-size:12px; }
.vx-admin .detail-plan{ margin-top:16px; padding:14px; border-radius:8px; background:var(--paper-warm); border:1px solid var(--ink-200); }
.vx-admin .detail-plan-top{ display:flex; align-items:center; justify-content:space-between; }
.vx-admin .detail-plan-eyebrow{ font-size:10px; text-transform:uppercase; letter-spacing:0.12em; color:var(--ink-500); font-weight:600; }
.vx-admin .detail-plan-price{ font-family:'Fraunces',Georgia,serif; font-size:20px; color:var(--ink-900); margin-top:8px; }
.vx-admin .detail-plan-note{ font-size:12px; color:var(--ink-600); margin-top:4px; line-height:1.5; }
.vx-admin .detail-plan-seats{ font-size:11.5px; color:var(--ink-500); margin-top:6px; font-family:'JetBrains Mono',monospace; }
.vx-admin .doc-list{ display:flex; flex-direction:column; gap:8px; }
.vx-admin .lic-row{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 12px; border:1px solid var(--ink-200); border-radius:7px; }
.vx-admin .lic-row-name{ font-size:13px; font-weight:600; color:var(--ink-900); }
.vx-admin .lic-row-no{ font-size:11px; color:var(--ink-500); margin-top:2px; }
.vx-admin .lic-row-valid{ font-size:10.5px; color:var(--ink-500); text-align:right; line-height:1.5; flex-shrink:0; }
.vx-admin .lic-row-valid b{ font-size:12px; color:var(--ink-800); font-weight:600; }
.vx-admin .doc-row{ display:flex; align-items:center; gap:11px; padding:9px 12px; border:1px solid var(--ink-200); border-radius:7px; }
.vx-admin .doc-badge{ width:32px; height:32px; border-radius:6px; background:var(--signal-red-bg); color:var(--signal-red); display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:700; font-family:'JetBrains Mono',monospace; flex-shrink:0; }
.vx-admin .doc-row-main{ flex:1; min-width:0; }
.vx-admin .doc-row-name{ font-size:13px; font-weight:500; color:var(--ink-900); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vx-admin .doc-row-size{ font-size:11px; color:var(--ink-500); margin-top:1px; }
.vx-admin .detail-actionbar{ position:fixed; bottom:0; left:240px; right:0; padding:14px 76px 14px 28px; background:rgba(250,250,247,0.96); backdrop-filter:blur(8px); border-top:1px solid var(--ink-200); display:flex; align-items:center; justify-content:space-between; gap:16px; z-index:20; }
.vx-admin .detail-actionbar-meta{ font-size:12px; color:var(--ink-500); }
.vx-admin .detail-actionbar-btns{ display:flex; gap:10px; flex-wrap:wrap; }

/* ── modules ──────────────────────────────────────────────────────────── */
.vx-admin .module-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; padding:8px 28px 36px; }
.vx-admin .module-card{ background:white; border:1px solid var(--ink-200); border-radius:12px; padding:18px; display:flex; flex-direction:column; transition:border-color 0.15s, opacity 0.15s; }
.vx-admin .module-card.off{ opacity:0.74; }
.vx-admin .module-top{ display:flex; align-items:center; gap:11px; }
.vx-admin .module-ico{ width:38px; height:38px; border-radius:9px; background:var(--mineral-100); color:var(--mineral-700); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.vx-admin .module-card.off .module-ico{ background:var(--ink-100); color:var(--ink-500); }
.vx-admin .module-id{ flex:1; min-width:0; }
.vx-admin .module-name{ font-size:14px; font-weight:600; color:var(--ink-900); }
.vx-admin .module-cat{ font-size:11.5px; color:var(--ink-500); margin-top:1px; }
.vx-admin .toggle{ width:40px; height:23px; border-radius:999px; background:var(--ink-200); border:none; cursor:pointer; padding:0; position:relative; flex-shrink:0; transition:background 0.18s; }
.vx-admin .toggle.on{ background:var(--mineral-600); }
.vx-admin .toggle-knob{ position:absolute; top:2.5px; left:2.5px; width:18px; height:18px; border-radius:50%; background:white; box-shadow:0 1px 3px rgba(0,0,0,0.2); transition:transform 0.18s; }
.vx-admin .toggle.on .toggle-knob{ transform:translateX(17px); }
.vx-admin .module-desc{ font-size:12.5px; color:var(--ink-600); line-height:1.5; margin:14px 0 16px; flex:1; }
.vx-admin .module-foot{ display:flex; align-items:center; gap:18px; padding-top:14px; border-top:1px solid var(--ink-100); }
.vx-admin .module-stat-val{ font-family:'Fraunces',Georgia,serif; font-size:20px; color:var(--ink-900); line-height:1; }
.vx-admin .module-stat-lbl{ font-size:9.5px; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-500); font-weight:600; margin-top:4px; }
.vx-admin .module-avail{ margin-left:auto; font-size:12px; font-weight:600; }
.vx-admin .module-avail.yes{ color:var(--mineral-700); }
.vx-admin .module-avail.no{ color:var(--ink-400); }

/* ── billing & plans ──────────────────────────────────────────────────── */
.vx-admin .bill-kpi{ display:flex; flex-direction:column; }
.vx-admin .bill-kpi::after{ display:none; }
.vx-admin .bill-kpi-head{ display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
.vx-admin .bill-kpi-ico{ color:var(--ink-400); }
.vx-admin .plan-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; padding:6px 28px 22px; }
.vx-admin .plan-card{ background:white; border:1px solid var(--ink-200); border-radius:12px; padding:22px 20px; position:relative; display:flex; flex-direction:column; }
.vx-admin .plan-card.popular{ border-color:var(--mineral-500); box-shadow:0 0 0 1px var(--mineral-500); }
.vx-admin .plan-pop{ position:absolute; top:-10px; left:20px; background:var(--mineral-700); color:#FAFAF7; font-size:9.5px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:3px 9px; border-radius:999px; }
.vx-admin .plan-name{ font-size:18px; font-weight:600; color:var(--ink-900); }
.vx-admin .plan-price{ margin-top:8px; display:flex; align-items:baseline; gap:6px; }
.vx-admin .plan-price .amt{ font-family:'Fraunces',Georgia,serif; font-size:30px; letter-spacing:-0.03em; color:var(--ink-900); }
.vx-admin .plan-price .cad{ font-size:12px; color:var(--ink-500); }
.vx-admin .plan-tag{ font-size:12.5px; color:var(--ink-500); margin-top:6px; }
.vx-admin .plan-count{ display:flex; align-items:center; gap:6px; margin:16px 0; padding:10px 12px; background:var(--ink-50); border-radius:7px; font-size:12.5px; color:var(--ink-600); }
.vx-admin .plan-count svg{ color:var(--ink-500); }
.vx-admin .plan-count b{ color:var(--ink-900); }
.vx-admin .plan-feats{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:9px; }
.vx-admin .plan-feats li{ display:flex; align-items:center; gap:9px; font-size:12.5px; color:var(--ink-700); }
.vx-admin .plan-feats li svg{ color:var(--mineral-600); flex-shrink:0; }

/* ── settings ─────────────────────────────────────────────────────────── */
.vx-admin .settings-layout{ display:grid; grid-template-columns:220px 1fr; gap:20px; padding:8px 28px 36px; align-items:start; }
.vx-admin .settings-nav{ display:flex; flex-direction:column; gap:3px; }
.vx-admin .settings-nav-item{ display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:8px; border:1px solid transparent; background:transparent; cursor:pointer; font-family:inherit; font-size:13.5px; font-weight:500; color:var(--ink-600); text-align:left; transition:background 0.13s, color 0.13s; }
.vx-admin .settings-nav-item svg{ color:var(--ink-400); flex-shrink:0; }
.vx-admin .settings-nav-item:hover{ background:var(--ink-50); color:var(--ink-900); }
.vx-admin .settings-nav-item.active{ background:white; border-color:var(--ink-200); color:var(--ink-900); box-shadow:0 1px 2px rgba(11,15,14,0.04); }
.vx-admin .settings-nav-item.active svg{ color:var(--mineral-700); }
.vx-admin .settings-panel{ background:white; border:1px solid var(--ink-200); border-radius:12px; padding:24px 26px; }
.vx-admin .settings-panel-head{ margin-bottom:6px; }
.vx-admin .settings-panel-title{ font-family:'Fraunces',Georgia,serif; font-size:18px; color:var(--ink-900); }
.vx-admin .settings-id{ display:flex; align-items:center; gap:14px; padding:14px 0 20px; border-bottom:1px solid var(--ink-100); margin-bottom:20px; }
.vx-admin .settings-av{ width:48px; height:48px; border-radius:10px; background:var(--mineral-700); color:#FAFAF7; display:flex; align-items:center; justify-content:center; font-size:17px; font-weight:600; font-family:'Fraunces',Georgia,serif; flex-shrink:0; }
.vx-admin .settings-id-name{ font-size:15px; font-weight:600; color:var(--ink-900); }
.vx-admin .settings-form{ display:grid; grid-template-columns:1fr 1fr; gap:14px 18px; }
.vx-admin .settings-panel .placeholder{ padding:40px 16px; }

/* ── activity actor line ──────────────────────────────────────────────── */
.vx-admin .act-actor{ font-size:10px; letter-spacing:0.1em; color:var(--ink-400); margin-top:6px; font-weight:500; }

/* ── mobile refinements for the functionality additions ───────────────── */
@media (max-width: 1024px){
  .vx-admin .detail-actionbar{ left:0; }
}
@media (max-width: 760px){
  .vx-admin .qa-grid{ grid-template-columns:minmax(0,1fr); }
  .vx-admin .queue-tabs{ padding:14px 16px 0; overflow-x:auto; }
  .vx-admin .queue-tab{ white-space:nowrap; flex-shrink:0; }
  .vx-admin .queue-foot{ padding:4px 16px 24px; }
  .vx-admin .detail-head{ padding:18px 16px 4px; }
  .vx-admin .detail-name{ font-size:24px; }
  .vx-admin .detail-note{ margin:14px 16px 0; }
  .vx-admin .detail-grid{ grid-template-columns:minmax(0,1fr); padding:16px 16px 8px; }
  .vx-admin .detail-actionbar{ flex-direction:column; align-items:stretch; gap:10px; padding:12px 16px; }
  .vx-admin .detail-actionbar-btns{ }
  .vx-admin .detail-actionbar-btns .btn{ flex:1; justify-content:center; }
  .vx-admin .module-grid{ grid-template-columns:minmax(0,1fr); padding:8px 16px 28px; }
  .vx-admin .plan-grid{ grid-template-columns:minmax(0,1fr); padding:6px 16px 20px; }
  .vx-admin .settings-layout{ grid-template-columns:minmax(0,1fr); padding:8px 16px 28px; }
  .vx-admin .settings-nav{ flex-direction:row; overflow-x:auto; }
  .vx-admin .settings-nav-item{ white-space:nowrap; flex-shrink:0; }
  .vx-admin .settings-form{ grid-template-columns:minmax(0,1fr); }
}
@media (max-width: 460px){
  .vx-admin .module-foot{ gap:12px; }
}
`;

/* ============================================================================
 * CSS_FIX1 — Super Admin fix round (append-only, no existing selectors edited)
 *   · Hospitals toolbar search: clear button
 *   · Approvals: Open / Overdue badges, queue count label, row ellipsis menu
 *   · Settings: Team & roles table, presence pills, Approval-rule / Security rows
 * ========================================================================== */
const CSS_FIX1 = `
/* --- Hospitals toolbar search clear button --- */
.vx-admin .toolbar-search-clear{ position:absolute; right:8px; top:50%; transform:translateY(-50%); width:18px; height:18px; border:none; background:var(--ink-100); color:var(--ink-500); border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:0; transition:background 0.12s, color 0.12s; }
.vx-admin .toolbar-search-clear:hover{ background:var(--ink-200); color:var(--ink-800); }

/* --- Approvals status badges: Open (blue) + Overdue (red) --- */
.vx-admin .b-open{ background:var(--slate-bg); color:var(--slate); border-color:#CFD7E0; }
.vx-admin .b-open .dot{ background:var(--slate); }
.vx-admin .b-overdue{ background:var(--signal-red-bg); color:var(--signal-red); border-color:#F2C7C0; }
.vx-admin .b-overdue .dot{ background:var(--signal-red); }

/* --- Approvals: left-aligned count label in the toolbar --- */
.vx-admin .queue-count-label{ font-size:12.5px; color:var(--ink-500); }
.vx-admin .queue-count-label b{ color:var(--ink-800); font-weight:600; }

/* --- Approvals: row ellipsis button + fixed-position menu --- */
.vx-admin .row-menu-btn{ width:30px; height:30px; border-radius:6px; background:transparent; border:1px solid transparent; color:var(--ink-500); cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:all 0.12s; }
.vx-admin .row-menu-btn:hover, .vx-admin .row-menu-btn.open{ background:white; border-color:var(--ink-200); color:var(--ink-900); }
.vx-admin .row-menu{ position:fixed; z-index:60; min-width:148px; background:white; border:1px solid var(--ink-200); border-radius:10px; padding:6px; box-shadow:0 12px 32px rgba(11,15,14,0.16); animation:vx-modalIn 0.14s ease; }
.vx-admin .row-menu-item{ display:flex; align-items:center; gap:9px; width:100%; padding:8px 10px; border:none; background:transparent; border-radius:6px; cursor:pointer; font-family:inherit; font-size:13px; font-weight:500; color:var(--ink-700); text-align:left; transition:background 0.12s, color 0.12s; }
.vx-admin .row-menu-item:hover{ background:var(--ink-50); color:var(--ink-900); }
.vx-admin .row-menu-item svg{ color:var(--ink-400); flex-shrink:0; }
.vx-admin .row-menu-item:hover svg{ color:var(--mineral-700); }

/* --- Settings: card head with optional right-side action --- */
.vx-admin .set-card-head{ display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding-bottom:16px; margin-bottom:4px; border-bottom:1px solid var(--ink-100); }

/* --- Settings: stacked labelled rows (Approval rules + Security) --- */
.vx-admin .set-list{ display:flex; flex-direction:column; }
.vx-admin .set-row{ display:flex; align-items:center; justify-content:space-between; gap:24px; padding:16px 0; border-bottom:1px solid var(--ink-100); }
.vx-admin .set-row:last-child{ border-bottom:none; }
.vx-admin .set-row-text{ min-width:0; }
.vx-admin .set-row-title{ font-size:13.5px; font-weight:600; color:var(--ink-900); margin-bottom:3px; }
.vx-admin .set-row-title.danger{ color:var(--signal-red); }
.vx-admin .set-row-control{ flex-shrink:0; display:flex; align-items:center; }
.vx-admin .set-sel{ width:auto; min-width:150px; height:36px; }
.vx-admin .set-num{ width:74px; height:36px; text-align:center; }

/* --- Settings: Team & roles table --- */
.vx-admin .team-table{ display:flex; flex-direction:column; }
.vx-admin .team-head, .vx-admin .team-row{ display:grid; grid-template-columns:1.6fr 1.4fr 1.6fr 0.9fr 40px; align-items:center; gap:16px; }
.vx-admin .team-head{ padding:12px 0; border-bottom:1px solid var(--ink-200); font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-500); font-weight:500; }
.vx-admin .team-row{ padding:14px 0; border-bottom:1px solid var(--ink-100); }
.vx-admin .team-row:last-child{ border-bottom:none; }
.vx-admin .team-agent{ display:flex; align-items:center; gap:11px; min-width:0; }
.vx-admin .team-av{ width:34px; height:34px; border-radius:50%; color:#FAFAF7; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0; }
.vx-admin .team-name{ font-size:13.5px; font-weight:600; color:var(--ink-900); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vx-admin .team-role{ font-size:13px; color:var(--ink-600); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vx-admin .team-email{ font-size:13px; color:var(--ink-600); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

/* --- Presence pills (Online / Away / Offline) --- */
.vx-admin .presence{ display:inline-flex; align-items:center; gap:6px; padding:3px 10px; border-radius:999px; font-size:11.5px; font-weight:500; border:1px solid transparent; }
.vx-admin .presence .dot{ width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.vx-admin .presence-online{ background:var(--mineral-100); color:var(--mineral-800); border-color:var(--mineral-200); }
.vx-admin .presence-online .dot{ background:var(--mineral-600); }
.vx-admin .presence-away{ background:var(--amber-bg); color:#8C5F0E; border-color:#F2DEA8; }
.vx-admin .presence-away .dot{ background:var(--amber); }
.vx-admin .presence-offline{ background:var(--ink-100); color:var(--ink-500); border-color:var(--ink-200); }
.vx-admin .presence-offline .dot{ background:var(--ink-400); }

@media (max-width: 760px){
  .vx-admin .set-row{ flex-direction:column; align-items:stretch; gap:10px; }
  .vx-admin .set-row-control{ justify-content:flex-start; }
  .vx-admin .set-sel, .vx-admin .set-num{ width:100%; }
  .vx-admin .team-head{ display:none; }
  .vx-admin .team-row{ grid-template-columns:1fr 40px; grid-row-gap:4px; }
  .vx-admin .team-agent{ grid-column:1; }
  .vx-admin .team-role{ grid-column:1; padding-left:45px; }
  .vx-admin .team-email{ grid-column:1; padding-left:45px; }
  .vx-admin .team-row > div:nth-child(4){ grid-column:1; padding-left:45px; }
}
`;


/* ════════════════════════════════════════════════════════════════════════
   ANALYTICS  (appended — replaces the old Modules board)
   All selectors scoped under `.vx-admin .an-*`. Append-only; never edits the
   blocks above. Loaded via CSS = … + CSS_ANALYTICS at the foot of this file.
   ════════════════════════════════════════════════════════════════════════ */
export const CSS_ANALYTICS = `
.vx-admin .an-view{ overflow-y:auto; }

/* head actions: custom date-range picker + export */
.vx-admin .an-head-actions{ align-items:center; gap:10px; }
.vx-admin .an-cr{ position:relative; }
.vx-admin .an-cr-btn{ display:inline-flex; align-items:center; gap:8px; background:white; border:1px solid var(--ink-200); border-radius:9px; padding:7px 11px; font-family:inherit; font-size:12.5px; font-weight:600; color:var(--ink-800); cursor:pointer; transition:.14s; }
.vx-admin .an-cr-btn:hover{ border-color:var(--ink-300); box-shadow:0 1px 2px rgba(11,15,14,.06); }
.vx-admin .an-cr-days{ background:var(--mineral-50,var(--ink-50)); color:var(--mineral-700); border-radius:5px; padding:1px 6px; font-size:11px; font-weight:700; }
.vx-admin .an-cr-pop{ position:absolute; right:0; top:calc(100% + 8px); z-index:40; width:280px; background:white; border:1px solid var(--ink-200); border-radius:12px; box-shadow:0 14px 40px rgba(11,15,14,.16); padding:12px; }
.vx-admin .an-cr-presets{ display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:12px; }
.vx-admin .an-cr-preset{ border:1px solid var(--ink-200); background:var(--ink-50); border-radius:8px; padding:7px 8px; font-family:inherit; font-size:12px; font-weight:600; color:var(--ink-700); cursor:pointer; transition:.14s; }
.vx-admin .an-cr-preset:hover{ border-color:var(--mineral-400,var(--mineral-700)); color:var(--mineral-700); background:white; }
.vx-admin .an-cr-fields{ display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
.vx-admin .an-cr-field{ display:flex; flex-direction:column; gap:5px; }
.vx-admin .an-cr-field span{ font-size:11px; font-weight:600; color:var(--ink-500); }
.vx-admin .an-cr-field input{ font-family:inherit; font-size:12.5px; color:var(--ink-900); border:1px solid var(--ink-200); border-radius:8px; padding:7px 9px; outline:none; }
.vx-admin .an-cr-field input:focus{ border-color:var(--mineral-700); box-shadow:0 0 0 3px rgba(14,124,102,.12); }
.vx-admin .an-cr-actions{ display:flex; justify-content:flex-end; gap:8px; }
.vx-admin .an-cr-cancel{ border:1px solid var(--ink-200); background:white; border-radius:8px; padding:7px 14px; font-family:inherit; font-size:12.5px; font-weight:600; color:var(--ink-600); cursor:pointer; }
.vx-admin .an-cr-cancel:hover{ background:var(--ink-50); }
.vx-admin .an-cr-apply{ border:none; background:var(--mineral-700); color:white; border-radius:8px; padding:7px 16px; font-family:inherit; font-size:12.5px; font-weight:600; cursor:pointer; transition:.14s; }
.vx-admin .an-cr-apply:hover{ background:var(--mineral-800,var(--mineral-700)); }
.vx-admin .an-cr-apply:disabled{ opacity:.5; cursor:not-allowed; }

/* tab strip */
.vx-admin .an-tabs{ display:flex; gap:4px; padding:0 28px; border-bottom:1px solid var(--ink-200); margin-bottom:18px; }
.vx-admin .an-tab{ border:none; background:transparent; font-family:inherit; font-size:13.5px; font-weight:600; color:var(--ink-500); padding:11px 4px; margin-right:18px; cursor:pointer; border-bottom:2px solid transparent; transition:.14s; }
.vx-admin .an-tab:hover{ color:var(--ink-800); }
.vx-admin .an-tab.active{ color:var(--ink-900); border-bottom-color:var(--mineral-700); }

/* KPI strip */
.vx-admin .an-kpis{ display:grid; grid-template-columns:repeat(6,1fr); gap:14px; padding:0 28px 16px; }
.vx-admin .an-kpi{ text-align:left; background:white; border:1px solid var(--ink-200); border-radius:12px; padding:15px 16px; cursor:pointer; font-family:inherit; transition:border-color .14s, transform .14s, box-shadow .14s; }
.vx-admin .an-kpi:hover{ border-color:var(--mineral-300); transform:translateY(-2px); box-shadow:0 6px 18px rgba(11,15,14,.06); }
.vx-admin .an-kpi-head{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.vx-admin .an-kpi-label{ font-size:10px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:var(--ink-500); }
.vx-admin .an-kpi-ico{ width:26px; height:26px; border-radius:7px; background:var(--ink-50); color:var(--ink-500); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.vx-admin .an-kpi:hover .an-kpi-ico{ background:var(--mineral-100); color:var(--mineral-700); }
.vx-admin .an-kpi-val{ font-family:'Fraunces',Georgia,serif; font-size:27px; letter-spacing:-.02em; color:var(--ink-900); margin:8px 0 6px; line-height:1; }
.vx-admin .an-kpi-delta{ font-size:11.5px; font-weight:600; }
.vx-admin .an-kpi-delta.up{ color:var(--mineral-700); }
.vx-admin .an-kpi-delta.down{ color:var(--signal-red); }
.vx-admin .an-kpi-delta.flat{ color:var(--ink-500); }

/* card + grid */
.vx-admin .an-grid{ display:grid; gap:16px; padding:0 28px 16px; }
.vx-admin .an-grid-2-1{ grid-template-columns:minmax(0,2fr) minmax(0,1fr); }
.vx-admin .an-grid-1-1{ grid-template-columns:minmax(0,1fr) minmax(0,1fr); }
.vx-admin .an-card{ background:white; border:1px solid var(--ink-200); border-radius:14px; padding:18px 20px; min-width:0; }
.vx-admin .an-view > .an-card{ margin:0 28px 16px; }
.vx-admin .an-card-head{ display:flex; align-items:flex-start; justify-content:space-between; gap:14px; margin-bottom:14px; }
.vx-admin .an-card-title{ font-family:'Fraunces',Georgia,serif; font-size:16px; color:var(--ink-900); letter-spacing:-.01em; }
.vx-admin .an-card-sub{ font-size:12px; color:var(--ink-500); margin-top:3px; }
.vx-admin .an-chip{ font-size:11px; font-weight:600; color:var(--mineral-800); background:var(--mineral-100); border:1px solid var(--mineral-300); border-radius:999px; padding:3px 10px; white-space:nowrap; }

/* area chart */
.vx-admin .an-area{ width:100%; height:150px; display:block; }
.vx-admin .an-axis{ display:flex; justify-content:space-between; font-size:10.5px; color:var(--ink-400); font-family:'JetBrains Mono',monospace; margin-top:6px; }
.vx-admin .an-axis span:nth-child(2){ color:var(--mineral-700); }

/* donut */
.vx-admin .an-donut-row{ display:flex; align-items:center; gap:18px; }
.vx-admin .an-donut-wrap{ flex-shrink:0; }
.vx-admin .an-donut{ width:130px; height:130px; }
.vx-admin .an-donut-c{ font-family:'Fraunces',Georgia,serif; font-size:20px; fill:var(--ink-900); }
.vx-admin .an-donut-s{ font-size:8px; font-weight:600; letter-spacing:.12em; fill:var(--ink-400); }
.vx-admin .an-legend{ flex:1; list-style:none; display:flex; flex-direction:column; gap:9px; min-width:0; }
.vx-admin .an-legend li{ display:flex; align-items:center; gap:9px; font-size:12.5px; color:var(--ink-700); }
.vx-admin .an-dot{ width:9px; height:9px; border-radius:3px; flex-shrink:0; }
.vx-admin .an-legend-label{ flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vx-admin .an-legend-pct{ font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--ink-500); }

/* funnel */
.vx-admin .an-funnel{ display:flex; flex-direction:column; gap:10px; }
.vx-admin .an-funnel-step{ border:none; background:transparent; cursor:pointer; text-align:left; font-family:inherit; padding:0; }
.vx-admin .an-funnel-bar{ display:flex; align-items:center; justify-content:space-between; gap:10px; min-width:160px; color:#FAFAF7; border-radius:7px; padding:9px 14px; transition:filter .14s; }
.vx-admin .an-funnel-step:hover .an-funnel-bar{ filter:brightness(1.08); }
.vx-admin .an-funnel-label{ font-size:13px; font-weight:600; white-space:nowrap; }
.vx-admin .an-funnel-val{ font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:600; }
.vx-admin .an-funnel-note{ display:block; font-size:11px; color:var(--ink-500); margin-top:4px; }

/* live stream */
.vx-admin .an-live{ display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; color:var(--mineral-700); }
.vx-admin .an-live-dot{ width:8px; height:8px; border-radius:50%; background:var(--mineral-600); box-shadow:0 0 0 0 rgba(20,158,131,.5); animation:anPulse 1.8s infinite; }
@keyframes anPulse{ 0%{ box-shadow:0 0 0 0 rgba(20,158,131,.5);} 70%{ box-shadow:0 0 0 7px rgba(20,158,131,0);} 100%{ box-shadow:0 0 0 0 rgba(20,158,131,0);} }
.vx-admin .an-stream{ list-style:none; display:flex; flex-direction:column; }
.vx-admin .an-stream li{ display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid var(--ink-100); font-size:12.5px; }
.vx-admin .an-stream li:last-child{ border-bottom:none; }
.vx-admin .an-stream-tag{ font-size:9px; font-weight:700; letter-spacing:.06em; border:1px solid; border-radius:5px; padding:2px 6px; flex-shrink:0; }
.vx-admin .an-stream-text{ flex:1; min-width:0; color:var(--ink-700); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vx-admin .an-stream-ago{ font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--ink-400); flex-shrink:0; }

/* system health */
.vx-admin .an-ok{ display:inline-flex; align-items:center; gap:7px; font-size:11.5px; font-weight:600; color:var(--mineral-800); background:var(--mineral-100); border:1px solid var(--mineral-300); border-radius:999px; padding:4px 11px; }
.vx-admin .an-ok-dot{ width:7px; height:7px; border-radius:50%; background:var(--mineral-600); }
.vx-admin .an-health{ display:grid; grid-template-columns:repeat(4,1fr); gap:0; }
.vx-admin .an-health-stat{ padding:4px 20px; border-left:1px solid var(--ink-100); }
.vx-admin .an-health-stat:first-child{ border-left:none; padding-left:0; }
.vx-admin .an-health-label{ font-size:10px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:var(--ink-500); }
.vx-admin .an-health-val{ font-family:'Fraunces',Georgia,serif; font-size:26px; color:var(--ink-900); margin:8px 0 5px; line-height:1; }
.vx-admin .an-health-sub{ font-size:11.5px; color:var(--ink-500); }

/* bars */
.vx-admin .an-bars{ display:flex; flex-direction:column; gap:11px; }
.vx-admin .an-bar-row{ display:grid; grid-template-columns:150px 1fr auto; align-items:center; gap:12px; border:none; background:transparent; cursor:pointer; font-family:inherit; padding:0; text-align:left; }
.vx-admin .an-bar-label{ font-size:12.5px; color:var(--ink-700); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vx-admin .an-bar-track{ height:9px; background:var(--ink-100); border-radius:999px; overflow:hidden; }
.vx-admin .an-bar-fill{ display:block; height:100%; border-radius:999px; transition:filter .14s; }
.vx-admin .an-bar-row:hover .an-bar-fill{ filter:brightness(1.08); }
.vx-admin .an-bar-val{ font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--ink-600); min-width:48px; text-align:right; }

/* patient stat grid */
.vx-admin .an-pstats{ display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.vx-admin .an-pstat{ padding:2px 0; }
.vx-admin .an-pstat-val{ font-family:'Fraunces',Georgia,serif; font-size:24px; color:var(--mineral-700); line-height:1; }
.vx-admin .an-pstat-label{ font-size:11.5px; color:var(--ink-500); margin-top:5px; }

/* heatmap */
.vx-admin .an-heat{ display:flex; flex-direction:column; gap:4px; }
.vx-admin .an-heat-row{ display:flex; align-items:center; gap:10px; }
.vx-admin .an-heat-day{ width:30px; font-size:10.5px; color:var(--ink-500); flex-shrink:0; }
.vx-admin .an-heat-cells{ flex:1; display:grid; grid-template-columns:repeat(24,1fr); gap:3px; }
.vx-admin .an-heat-cell{ height:14px; border-radius:3px; }
.vx-admin .an-heat-scale{ display:flex; align-items:center; gap:8px; justify-content:flex-end; margin-top:10px; font-size:10.5px; color:var(--ink-400); }
.vx-admin .an-heat-grad{ width:80px; height:8px; border-radius:999px; background:linear-gradient(90deg, rgba(14,124,102,.12), rgba(14,124,102,.9)); }

/* tables (active hospitals / ledger / leaderboard) */
.vx-admin .an-table{ display:flex; flex-direction:column; }
.vx-admin .an-th{ display:grid; gap:14px; align-items:center; padding:10px 8px; border-bottom:1px solid var(--ink-200); font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:var(--ink-500); font-weight:600; }
.vx-admin .an-tr{ display:grid; gap:14px; align-items:center; padding:12px 8px; border-bottom:1px solid var(--ink-100); border-left:none; border-right:none; border-top:none; background:transparent; cursor:pointer; font-family:inherit; font-size:13px; color:var(--ink-800); text-align:left; transition:background .12s; }
.vx-admin .an-tr:hover{ background:var(--ink-50); }
.vx-admin .an-tr:last-child{ border-bottom:none; }
.vx-admin .an-th-active, .vx-admin .an-tr-active{ grid-template-columns:2.2fr 1.2fr .9fr 1fr 90px; }
.vx-admin .an-th-ledger, .vx-admin .an-tr-ledger{ grid-template-columns:2fr 1.1fr .8fr .8fr .9fr 1.3fr; }
.vx-admin .an-th-leader, .vx-admin .an-tr-leader{ grid-template-columns:2fr .9fr .9fr 1.4fr; }
.vx-admin .an-hosp{ display:flex; align-items:center; gap:10px; font-weight:600; color:var(--ink-900); min-width:0; }
.vx-admin .an-hosp-av{ width:28px; height:28px; border-radius:7px; color:#FAFAF7; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0; }
.vx-admin .an-muted{ color:var(--ink-500); }
.vx-admin .an-ledger-act{ font-weight:600; color:var(--ink-900); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vx-admin .an-rolepill{ font-size:10.5px; font-weight:600; color:var(--ink-600); background:var(--ink-50); border:1px solid var(--ink-200); border-radius:999px; padding:2px 9px; white-space:nowrap; }
.vx-admin .an-ledger-trend{ display:flex; align-items:center; gap:8px; }
.vx-admin .an-up{ color:var(--mineral-700); font-weight:600; font-size:11.5px; }
.vx-admin .an-down{ color:var(--signal-red); font-weight:600; font-size:11.5px; }
.vx-admin .an-spark{ display:block; }

/* column chart (new vs churned) */
.vx-admin .an-colchart{ display:flex; align-items:flex-end; justify-content:space-around; gap:10px; height:170px; padding-top:8px; }
.vx-admin .an-col{ flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; height:100%; border:none; background:transparent; cursor:pointer; font-family:inherit; }
.vx-admin .an-col-bars{ flex:1; display:flex; align-items:flex-end; gap:4px; width:100%; justify-content:center; }
.vx-admin .an-col-add{ width:18px; background:var(--mineral-700); border-radius:4px 4px 0 0; transition:filter .14s; }
.vx-admin .an-col-churn{ width:9px; background:var(--signal-red); border-radius:4px 4px 0 0; opacity:.85; }
.vx-admin .an-col:hover .an-col-add{ filter:brightness(1.1); }
.vx-admin .an-col-label{ font-size:11px; color:var(--ink-500); }
.vx-admin .an-col-legend{ display:flex; gap:18px; justify-content:center; margin-top:12px; font-size:11.5px; color:var(--ink-600); }
.vx-admin .an-col-legend span{ display:inline-flex; align-items:center; gap:6px; }

/* detail drawer */
.vx-admin .an-drawer-back{ position:fixed; inset:0; background:rgba(11,15,14,.32); backdrop-filter:blur(2px); z-index:70; animation:vx-modalFade .14s ease; }
.vx-admin .an-drawer{ position:fixed; top:0; right:0; bottom:0; width:380px; max-width:92vw; background:white; border-left:1px solid var(--ink-200); box-shadow:-16px 0 40px rgba(11,15,14,.16); z-index:71; display:flex; flex-direction:column; animation:anSlide .2s cubic-bezier(.2,.7,.2,1); }
@keyframes anSlide{ from{ transform:translateX(24px); opacity:.4; } to{ transform:translateX(0); opacity:1; } }
.vx-admin .an-drawer-head{ display:flex; align-items:flex-start; justify-content:space-between; gap:14px; padding:20px 22px 16px; border-bottom:1px solid var(--ink-100); }
.vx-admin .an-drawer-title{ font-family:'Fraunces',Georgia,serif; font-size:19px; color:var(--ink-900); letter-spacing:-.01em; }
.vx-admin .an-drawer-sub{ font-size:12px; color:var(--ink-500); margin-top:3px; }
.vx-admin .an-drawer-x{ width:32px; height:32px; border-radius:8px; border:1px solid var(--ink-200); background:white; color:var(--ink-500); cursor:pointer; display:grid; place-items:center; flex-shrink:0; transition:.14s; }
.vx-admin .an-drawer-x:hover{ color:var(--signal-red); border-color:var(--signal-red); }
.vx-admin .an-drawer-body{ flex:1; overflow-y:auto; padding:8px 22px; }
.vx-admin .an-drawer-row{ display:flex; align-items:center; justify-content:space-between; gap:16px; padding:13px 0; border-bottom:1px solid var(--ink-100); font-size:13.5px; color:var(--ink-600); }
.vx-admin .an-drawer-row b{ color:var(--ink-900); font-family:'JetBrains Mono',monospace; font-size:13px; }
.vx-admin .an-drawer-foot{ display:flex; align-items:flex-start; gap:8px; padding:14px 22px; border-top:1px solid var(--ink-100); font-size:11.5px; color:var(--ink-500); line-height:1.5; }
.vx-admin .an-drawer-foot svg{ color:var(--mineral-700); flex-shrink:0; margin-top:1px; }

@media (max-width: 1100px){
  .vx-admin .an-kpis{ grid-template-columns:repeat(3,1fr); }
  .vx-admin .an-grid-2-1, .vx-admin .an-grid-1-1{ grid-template-columns:minmax(0,1fr); }
  .vx-admin .an-health{ grid-template-columns:1fr 1fr; gap:14px 0; }
  .vx-admin .an-health-stat:nth-child(3){ border-left:none; padding-left:0; }
}
@media (max-width: 680px){
  .vx-admin .an-kpis{ grid-template-columns:1fr 1fr; padding:0 16px 12px; }
  .vx-admin .an-grid{ padding:0 16px 12px; }
  .vx-admin .an-view > .an-card{ margin:0 16px 12px; }
  .vx-admin .an-tabs{ padding:0 16px; overflow-x:auto; }
  .vx-admin .an-th-active, .vx-admin .an-tr-active,
  .vx-admin .an-th-ledger, .vx-admin .an-tr-ledger,
  .vx-admin .an-th-leader, .vx-admin .an-tr-leader{ grid-template-columns:1.6fr .8fr .8fr; }
  .vx-admin .an-th-active span:nth-child(n+4), .vx-admin .an-tr-active span:nth-child(n+4),
  .vx-admin .an-th-ledger span:nth-child(n+4), .vx-admin .an-tr-ledger span:nth-child(n+4),
  .vx-admin .an-th-leader span:nth-child(n+4), .vx-admin .an-tr-leader span:nth-child(n+4){ display:none; }
  .vx-admin .an-donut-row{ flex-direction:column; }
  .vx-admin .an-bar-row{ grid-template-columns:110px 1fr auto; }
  .vx-admin .an-pstats{ grid-template-columns:1fr; }
}
`;

/* ── Register-facility buttons (Dashboard header: Hospital · Pharmacy · Lab) ── */
export const CSS_REGFAC = `
.vx-admin .page-head-actions{ flex-wrap:wrap; }
.vx-admin .reg-group{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.vx-admin .btn.btn-reg-alt{ color:var(--ink-700); }
.vx-admin .btn.btn-reg-alt svg{ color:var(--mineral-700); }
.vx-admin .btn.btn-reg-alt:hover{ border-color:var(--mineral-300); background:var(--mineral-100); color:var(--mineral-800); }
@media (max-width:640px){
  .vx-admin .reg-group{ width:100%; flex-direction:column; }
  .vx-admin .reg-group .btn{ width:100%; justify-content:center; }
}
`;

export const CSS = CSS_BASE + CSS_MOBILE + CSS_ATH + CSS_ATH2 + CSS_FIX1 + CSS_ANALYTICS + CSS_REGFAC;
