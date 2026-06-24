// ============================================================================
//  PatientCSS.ts — Vexoo Patient Portal
//  Visual upgrade: Inter Tight + JetBrains Mono fonts,
//  mineral/ink palette. All class names and layouts UNCHANGED.
// ============================================================================

export const CSS = `@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
.Vexoo-root{height:100vh;overflow:hidden;}
.Vexoo-root *{box-sizing:border-box;margin:0;padding:0}
.Vexoo-root{
  --bg:#FAFAF7; --card:#ffffff; --ink:#0B0F0E; --ink2:#454C4B; --ink3:#6B7270;
  --line:#E4E6E4; --line2:#EFF0EE; --teal:#0E7C66; --teal-d:#0A4A3D;
  --indigo:#3B74F0; --radius:14px; --radius-sm:11px;
  --shadow:0 1px 2px rgba(11,15,14,.04),0 2px 8px rgba(11,15,14,.06);
  --shadow-lg:0 4px 16px rgba(11,15,14,.10),0 16px 40px rgba(11,15,14,.10);
}
.Vexoo-root{height:100%}
.Vexoo-root{font-family:'Inter Tight',Inter,system-ui,sans-serif;background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.5}
.Vexoo-root button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
.Vexoo-root input{font-family:inherit;border:none;outline:none;background:none;color:inherit}
.Vexoo-root ::selection{background:#bfe9e3}
.Vexoo-root .app{display:grid;grid-template-columns:248px 1fr;height:100vh;overflow:hidden}
.Vexoo-root .sidebar{background:#0B0F0E;color:#FAFAF7;display:flex;flex-direction:column;padding:22px 16px;gap:6px}
.Vexoo-root .brand{display:flex;align-items:center;gap:12px;padding:6px 8px 20px}
.Vexoo-root .brand-mark{width:38px;height:38px;border-radius:11px;background:#0E7C66;display:grid;place-items:center;box-shadow:0 6px 14px rgba(10,118,106,.4)}
.Vexoo-root .brand-name{font-size:19px;font-weight:800;color:#fff;letter-spacing:-.02em}
.Vexoo-root .brand-tag{font-size:11px;color:#7fb3ac;font-weight:500;letter-spacing:.04em;text-transform:uppercase}
.Vexoo-root .nav{display:flex;flex-direction:column;gap:3px;margin-top:6px;overflow-y:auto;flex:1;min-height:0;scrollbar-width:none}
.Vexoo-root .nav::-webkit-scrollbar{display:none}
.Vexoo-root .nav-item{position:relative;display:flex;align-items:center;gap:13px;padding:11px 13px;border-radius:12px;color:rgba(250,250,247,0.62);font-weight:500;font-size:14px;transition:.16s}
.Vexoo-root .nav-item:hover{background:rgba(255,255,255,.06);color:#FAFAF7}
.Vexoo-root .nav-item.on{background:rgba(255,255,255,.1);color:#fff;font-weight:600}
.Vexoo-root .nav-ic{display:grid;place-items:center;width:22px;flex-shrink:0}
.Vexoo-root .nav-label{flex:1;text-align:left}
.Vexoo-root .nav-badge{background:#0E7C66;color:#fff;font-size:11px;font-weight:700;min-width:20px;height:20px;border-radius:999px;display:grid;place-items:center;padding:0 5px}
.Vexoo-root .nav-active{position:absolute;left:-16px;top:50%;transform:translateY(-50%);width:4px;height:22px;border-radius:0 4px 4px 0;background:#1FBFA0}
.Vexoo-root .sidebar-foot{margin-top:auto;display:flex;flex-direction:column;gap:8px}
.Vexoo-root .side-card{display:flex;align-items:center;gap:11px;padding:13px;border-radius:13px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08)}
.Vexoo-root .side-card-ic{width:34px;height:34px;border-radius:9px;background:rgba(31,191,160,0.14);color:#5BD4BC;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .sct-title{font-size:13px;font-weight:600;color:#FAFAF7}
.Vexoo-root .sct-sub{font-size:11px;color:rgba(250,250,247,0.45)}
.Vexoo-root .logout{color:rgba(250,250,247,0.55)}
.Vexoo-root .logout:hover{background:rgba(224,65,75,.14);color:#ff9ca1}
.Vexoo-root .main{display:flex;flex-direction:column;overflow:hidden}
.Vexoo-root .topbar{display:flex;align-items:center;gap:18px;padding:18px 30px;background:color-mix(in srgb,#FAFAF7 86%,transparent);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);z-index:30;flex-shrink:0}
.Vexoo-root .topbar-title h1{font-size:21px;font-weight:800;letter-spacing:-.02em}
.Vexoo-root .topbar-title p{font-size:12.5px;color:var(--ink3);font-weight:500;margin-top:1px}
.Vexoo-root .topbar-r{display:flex;align-items:center;gap:10px;margin-left:auto}
.Vexoo-root .icon-btn{position:relative;width:42px;height:42px;border-radius:12px;background:var(--card);border:1px solid var(--line);color:var(--ink2);display:grid;place-items:center;transition:.16s}
.Vexoo-root .icon-btn:hover{color:var(--teal);border-color:#A4E8DA;box-shadow:var(--shadow)}
.Vexoo-root .icon-dot{position:absolute;top:10px;right:11px;width:7px;height:7px;border-radius:50%;background:#e0414b;border:2px solid var(--card)}
.Vexoo-root .topbar-user{display:flex;align-items:center;gap:10px;padding:5px 10px 5px 5px;border-radius:13px;background:var(--card);border:1px solid var(--line);transition:.16s}
.Vexoo-root .topbar-user:hover{box-shadow:var(--shadow)}
.Vexoo-root .tu-text{text-align:left}
.Vexoo-root .tu-name{font-size:13.5px;font-weight:700}
.Vexoo-root .tu-role{font-size:11px;color:var(--ink3)}
.Vexoo-root .gsearch{position:relative;flex:1;max-width:440px;display:flex;align-items:center;gap:10px;padding:0 14px;height:42px;background:var(--card);border:1px solid var(--line);border-radius:13px;transition:.16s}
.Vexoo-root .gsearch:focus-within{border-color:#0E7C66;box-shadow:0 0 0 3px rgba(14,124,102,.10)}
.Vexoo-root .gsearch input{flex:1;font-size:13.5px}
.Vexoo-root .gsearch input::placeholder{color:#a6b1af}
.Vexoo-root .gsearch-kbd{font-family:'JetBrains Mono','IBM Plex Mono',monospace;font-size:11px;color:#9aa6a4;background:#F5F6F4;border:1px solid var(--line);border-radius:6px;padding:2px 6px}
.Vexoo-root .gsearch-pop{position:absolute;top:50px;left:0;right:0;background:var(--card);border:1px solid var(--line);border-radius:15px;box-shadow:var(--shadow-lg);padding:8px;z-index:50;animation:pop .16s ease}
@keyframes pop{from{opacity:0;transform:translateY(-6px)}}
.Vexoo-root .gsearch-cat{font-size:11px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;padding:8px 10px 6px}
.Vexoo-root .gsearch-res{display:flex;align-items:center;gap:12px;width:100%;padding:9px 10px;border-radius:10px;text-align:left;transition:.12s}
.Vexoo-root .gsearch-res:hover{background:#F5F6F4}
.Vexoo-root .gsearch-ic{width:30px;height:30px;border-radius:8px;background:#E8F8F4;color:#0E7C66;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .gsearch-label{flex:1;font-size:13.5px;font-weight:500}
.Vexoo-root .gsearch-type{font-size:11px;color:var(--ink3);background:#F5F6F4;padding:3px 8px;border-radius:7px}
.Vexoo-root .gsearch-empty{padding:18px;text-align:center;color:var(--ink3);font-size:13px}
.Vexoo-root .content{flex:1;overflow-y:auto;padding:26px 30px 60px}
.Vexoo-root .content::-webkit-scrollbar{width:10px}
.Vexoo-root .content::-webkit-scrollbar-thumb{background:rgba(11,15,14,0.14);border-radius:6px;border:3px solid var(--bg)}
.Vexoo-root .screen{max-width:1340px;margin:0 auto;display:flex;flex-direction:column;gap:20px}
.Vexoo-root .screen-anim{animation:fade .3s ease}
@keyframes fade{from{opacity:0;transform:translateY(8px)}}
.Vexoo-root .grid-2c{display:grid;grid-template-columns:1fr 388px;gap:20px;align-items:start}
.Vexoo-root .col-main, .Vexoo-root .col-side{display:flex;flex-direction:column;gap:20px;min-width:0}
.Vexoo-root .card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow)}
.Vexoo-root .card-hover{transition:box-shadow .2s,transform .2s,border-color .2s}
.Vexoo-root .card-hover:hover{box-shadow:var(--shadow-lg)}
.Vexoo-root .sec-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:18px}
.Vexoo-root .sec-head-l{display:flex;align-items:center;gap:12px}
.Vexoo-root .sec-ic{width:34px;height:34px;border-radius:10px;background:#E8F8F4;color:#0E7C66;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .sec-title{font-size:16px;font-weight:700;letter-spacing:-.01em}
.Vexoo-root .sec-sub{font-size:12.5px;color:var(--ink3);font-weight:500;margin-top:1px}
.Vexoo-root .link-btn{display:inline-flex;align-items:center;gap:3px;font-size:13px;font-weight:600;color:var(--teal);padding:6px 8px;border-radius:9px;transition:.14s}
.Vexoo-root .link-btn:hover{background:#E8F8F4}
.Vexoo-root .badge{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:4px 9px;border-radius:8px;white-space:nowrap}
.Vexoo-root .badge-dot{width:6px;height:6px;border-radius:50%}
.Vexoo-root .btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-weight:600;border-radius:11px;transition:.16s;white-space:nowrap}
.Vexoo-root .btn-solid:hover{filter:brightness(1.06);box-shadow:0 6px 16px rgba(14,124,102,.25)}
.Vexoo-root .btn-soft:hover{filter:brightness(.97)}
.Vexoo-root .btn-outline:hover{border-color:#cdd9d6;background:#f7faf9}
.Vexoo-root .btn-ghost:hover{background:#f1f5f4}
.Vexoo-root .avatar{border-radius:50%;background:linear-gradient(145deg,#1aa794,#0a766a);color:#fff;display:grid;place-items:center;font-weight:700;flex-shrink:0;overflow:hidden}
.Vexoo-root .avatar img{width:100%;height:100%;object-fit:cover}
.Vexoo-root .hero{position:relative;overflow:hidden;background:linear-gradient(135deg,#062F26 0%,#0E7C66 100%);border-radius:22px;padding:26px 28px;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
.Vexoo-root .hero-glow{position:absolute;top:-60%;right:-5%;width:380px;height:380px;background:radial-gradient(circle,rgba(31,191,160,0.4),transparent 65%);pointer-events:none}
.Vexoo-root .hero-main{display:flex;align-items:center;gap:18px;position:relative}
.Vexoo-root .hero-main .avatar{border:3px solid rgba(255,255,255,.25)}
.Vexoo-root .hero-greet{font-size:14px;color:#aee9e0;font-weight:500}
.Vexoo-root .hero-name{font-size:27px;font-weight:800;letter-spacing:-.02em;line-height:1.1;margin:1px 0 8px}
.Vexoo-root .hero-meta{display:flex;align-items:center;gap:11px;flex-wrap:wrap;font-size:13px;color:#d4f3ee}
.Vexoo-root .hm-k{color:#7fc9bf;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.04em;margin-right:3px}
.Vexoo-root .hm-sep{width:1px;height:13px;background:rgba(255,255,255,.2)}
.Vexoo-root .hero-actions{display:flex;gap:10px;position:relative;flex-wrap:wrap}
.Vexoo-root .hero-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 16px;border-radius:12px;font-weight:600;font-size:13.5px;background:#fff;color:#062F26;transition:.16s}
.Vexoo-root .hero-btn:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(0,0,0,.2)}
.Vexoo-root .hero-btn.ghost{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.2)}
.Vexoo-root .hero-btn.ghost:hover{background:rgba(255,255,255,.22)}
.Vexoo-root .stat-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:16px}
.Vexoo-root .stat{display:flex;flex-direction:column}
.Vexoo-root .stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px}
.Vexoo-root .stat-ic{width:38px;height:38px;border-radius:11px;display:grid;place-items:center}
.Vexoo-root .stat-delta{display:inline-flex;align-items:center;gap:3px;font-size:11.5px;font-weight:700}
.Vexoo-root .stat-val{font-size:25px;font-weight:800;letter-spacing:-.03em;line-height:1}
.Vexoo-root .stat-unit{font-size:13px;font-weight:600;color:var(--ink3);margin-left:3px;letter-spacing:0}
.Vexoo-root .stat-label{font-size:12.5px;font-weight:600;color:var(--ink2);margin-top:7px}
.Vexoo-root .stat-sub{font-size:11.5px;color:var(--ink3);margin-top:2px}
.Vexoo-root .qa-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.Vexoo-root .qa{display:flex;flex-direction:column;align-items:flex-start;gap:12px;padding:16px;border-radius:14px;border:1px solid var(--line);background:#fbfdfc;transition:.16s;text-align:left}
.Vexoo-root .qa:hover{border-color:#A4E8DA;background:#fff;transform:translateY(-2px);box-shadow:var(--shadow)}
.Vexoo-root .qa-ic{width:42px;height:42px;border-radius:12px;display:grid;place-items:center}
.Vexoo-root .qa-label{font-size:13.5px;font-weight:600;line-height:1.25}
.Vexoo-root .changed-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}
.Vexoo-root .changed{padding:15px;border-radius:14px;border:1px solid var(--line);background:#fbfdfc}
.Vexoo-root .changed-head{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;color:var(--ink2);margin-bottom:11px}
.Vexoo-root .changed-ic{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .changed-vals{display:flex;align-items:center;gap:8px;margin-bottom:11px}
.Vexoo-root .changed-from{font-size:14px;color:var(--ink3);text-decoration:line-through;text-decoration-color:#c9d2d0}
.Vexoo-root .changed-to{font-size:19px;font-weight:800;letter-spacing:-.02em}
.Vexoo-root .insights{background:linear-gradient(165deg,#f4fbf9,#ffffff)}
.Vexoo-root .insights-head{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.Vexoo-root .insights-ai{width:36px;height:36px;border-radius:11px;background:linear-gradient(145deg,#0E7C66,#3B74F0);color:#fff;display:grid;place-items:center;box-shadow:0 6px 14px rgba(79,124,255,.28)}
.Vexoo-root .insights-list{display:flex;flex-direction:column;gap:11px}
.Vexoo-root .insight{display:flex;gap:11px;align-items:flex-start}
.Vexoo-root .insight-ic{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;flex-shrink:0;margin-top:1px}
.Vexoo-root .insight-text{font-size:13.5px;color:var(--ink2);line-height:1.45;text-wrap:pretty}
.Vexoo-root .insights-foot{display:flex;align-items:center;gap:7px;margin-top:16px;padding-top:14px;border-top:1px solid var(--line2);font-size:11.5px;color:var(--ink3)}
.Vexoo-root .alerts{display:flex;flex-direction:column;gap:11px}
.Vexoo-root .alert{display:flex;gap:13px;padding:14px;border-radius:14px;border:1px solid;background:#fbfdfc}
.Vexoo-root .alert-ic{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .alert-body{flex:1}
.Vexoo-root .alert-title{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:13.5px;font-weight:700}
.Vexoo-root .alert-time{font-size:11px;color:var(--ink3);font-weight:500}
.Vexoo-root .alert-text{font-size:12.5px;color:var(--ink2);margin:3px 0 10px;line-height:1.4}
.Vexoo-root .alert-actions{display:flex;align-items:center;gap:12px}
.Vexoo-root .alert-dismiss{font-size:12.5px;font-weight:600;color:var(--ink3)}
.Vexoo-root .alert-dismiss:hover{color:var(--ink)}
.Vexoo-root .wellness{display:flex;gap:22px;align-items:center}
.Vexoo-root .wellness-ring{flex-shrink:0}
.Vexoo-root .ring-wrap{position:relative;display:grid;place-items:center}
.Vexoo-root .ring-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
.Vexoo-root .ring-big{font-size:38px;font-weight:800;letter-spacing:-.03em;line-height:1}
.Vexoo-root .ring-mid{font-size:18px;font-weight:800;letter-spacing:-.02em}
.Vexoo-root .ring-cap{font-size:10.5px;color:var(--ink3);font-weight:500}
.Vexoo-root .wellness-bars{flex:1;display:flex;flex-direction:column;gap:11px;min-width:0}
.Vexoo-root .wb-top{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:var(--ink2);margin-bottom:6px}
.Vexoo-root .wb-ic{color:var(--teal);display:grid;place-items:center}
.Vexoo-root .wb-val{margin-left:auto;font-family:'JetBrains Mono','IBM Plex Mono',monospace;font-weight:600;font-size:12px}
.Vexoo-root .pbar{width:100%;border-radius:6px;overflow:hidden}
.Vexoo-root .pbar-fill{height:100%;border-radius:6px;transition:width 1s cubic-bezier(.4,0,.2,1)}
.Vexoo-root .feed{display:flex;flex-direction:column}
.Vexoo-root .feed-item{display:flex;gap:12px;padding:11px 0;border-bottom:1px solid var(--line2)}
.Vexoo-root .feed-item:last-child{border-bottom:none;padding-bottom:0}
.Vexoo-root .feed-ic{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .feed-text{font-size:13px;font-weight:500;color:var(--ink)}
.Vexoo-root .feed-time{font-size:11.5px;color:var(--ink3);margin-top:2px}
.Vexoo-root .chart{width:100%}
.Vexoo-root .chart-line{stroke-dasharray:2000;stroke-dashoffset:2000;animation:draw 1.4s cubic-bezier(.4,0,.2,1) forwards}
@keyframes draw{to{stroke-dashoffset:0}}
.Vexoo-root .chart-area{opacity:0;animation:afade .8s .5s ease forwards}
@keyframes afade{to{opacity:1}}
.Vexoo-root .spark{display:block}
.Vexoo-root .segmented{display:inline-flex;background:#eff4f2;border-radius:11px;padding:3px;gap:2px}
.Vexoo-root .seg{padding:6px 11px;border-radius:8px;font-size:12px;font-weight:600;color:var(--ink3);transition:.14s;white-space:nowrap}
.Vexoo-root .seg:hover{color:var(--ink2)}
.Vexoo-root .seg-on{background:var(--card);color:var(--teal);box-shadow:var(--shadow)}
.Vexoo-root .empty{display:flex;flex-direction:column;align-items:center;gap:9px;padding:30px;color:var(--ink3);font-size:13px;font-weight:500}
.Vexoo-root .empty.wide{grid-column:1/-1}
.Vexoo-root .tl{display:flex;flex-direction:column}
.Vexoo-root .tl-item{display:flex;gap:16px}
.Vexoo-root .tl-line{display:flex;flex-direction:column;align-items:center;flex-shrink:0}
.Vexoo-root .tl-node{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;z-index:1}
.Vexoo-root .tl-bar{width:2px;flex:1;background:var(--line);margin:4px 0}
.Vexoo-root .tl-card{flex:1;padding-bottom:18px;min-width:0}
.Vexoo-root .tl-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;width:100%;text-align:left}
.Vexoo-root .tl-title{font-size:14.5px;font-weight:700}
.Vexoo-root .tl-meta{font-size:12px;color:var(--ink3);margin-top:2px}
.Vexoo-root .tl-head-r{display:flex;align-items:center;gap:10px;flex-shrink:0}
.Vexoo-root .tl-chev{color:var(--ink3);transition:.2s}
.Vexoo-root .tl-chev.up{transform:rotate(180deg)}
.Vexoo-root .tl-detail{overflow:hidden;transition:max-height .3s ease}
.Vexoo-root .tl-summary{font-size:13px;color:var(--ink2);line-height:1.5;margin:11px 0;padding:13px;background:#f7faf9;border-radius:12px;text-wrap:pretty}
.Vexoo-root .tl-actions{display:flex;gap:8px}
.Vexoo-root .folder-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px}
.Vexoo-root .folder{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:flex-start;gap:5px;padding:16px;border-radius:14px;border:1px solid var(--line);background:#fbfdfc;text-align:left;transition:.16s}
.Vexoo-root .folder:hover{border-color:#A4E8DA;transform:translateY(-2px);box-shadow:var(--shadow)}
.Vexoo-root .folder-top{display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:6px}
.Vexoo-root .folder-ic{width:40px;height:40px;border-radius:11px;display:grid;place-items:center}
.Vexoo-root .folder-count{font-size:18px;font-weight:800;color:var(--ink);font-family:'JetBrains Mono','IBM Plex Mono',monospace}
.Vexoo-root .folder-name{font-size:13.5px;font-weight:600}
.Vexoo-root .folder-meta{font-size:11px;color:var(--ink3)}
.Vexoo-root .folder-hover{position:absolute;left:0;right:0;bottom:0;padding:8px;background:var(--teal);color:#fff;font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px;transform:translateY(100%);transition:.18s}
.Vexoo-root .folder:hover .folder-hover{transform:translateY(0)}
.Vexoo-root .vax{display:flex;flex-direction:column;gap:4px}
.Vexoo-root .vax-row{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--line2)}
.Vexoo-root .vax-row:last-child{border-bottom:none}
.Vexoo-root .vax-ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .vax-info{flex:1}
.Vexoo-root .vax-name{font-size:13.5px;font-weight:600}
.Vexoo-root .vax-meta{font-size:11.5px;color:var(--ink3)}
.Vexoo-root .emerg{background:linear-gradient(150deg,#062F26,#0A4A3D);border-radius:20px;padding:22px;color:#eafaf7;box-shadow:var(--shadow-lg)}
.Vexoo-root .emerg-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px}
.Vexoo-root .emerg-label{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:600;color:#7fc9bf;text-transform:uppercase;letter-spacing:.05em}
.Vexoo-root .emerg-name{font-size:20px;font-weight:800;margin-top:5px}
.Vexoo-root .emerg-blood{width:54px;height:54px;border-radius:14px;background:rgba(224,65,75,.9);color:#fff;display:grid;place-items:center;font-size:20px;font-weight:800;box-shadow:0 6px 16px rgba(224,65,75,.4)}
.Vexoo-root .emerg-grid{display:flex;flex-direction:column;gap:13px}
.Vexoo-root .emerg-field{display:flex;flex-direction:column;gap:2px}
.Vexoo-root .ef-k{font-size:10.5px;color:#6fb3aa;font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.Vexoo-root .ef-v{font-size:13px;font-weight:500;color:#FAFAF7}
.Vexoo-root .emerg-foot{display:flex;align-items:center;gap:13px;margin-top:18px;padding-top:18px;border-top:1px solid rgba(255,255,255,.12)}
.Vexoo-root .emerg-qr{width:62px;height:62px;background:#fff;border-radius:12px;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .emerg-qr-text{flex:1}
.Vexoo-root .eq-title{font-size:12.5px;font-weight:700;color:#fff}
.Vexoo-root .eq-sub{font-size:11px;color:#9fcfc8;margin-top:2px;line-height:1.35}
.Vexoo-root .emerg-btn{display:inline-flex;align-items:center;gap:7px;padding:11px 15px;border-radius:12px;background:#e0414b;color:#fff;font-weight:700;font-size:13px;transition:.16s;flex-shrink:0}
.Vexoo-root .emerg-btn:hover{background:#ef4d57;box-shadow:0 6px 16px rgba(224,65,75,.4)}
.Vexoo-root .med-summary{display:flex;align-items:center;justify-content:space-between;gap:20px}
.Vexoo-root .med-sum-l{display:flex;align-items:center;gap:20px}
.Vexoo-root .med-sum-title{font-size:18px;font-weight:800;letter-spacing:-.02em}
.Vexoo-root .med-sum-sub{font-size:13px;color:var(--ink3);margin:3px 0 10px}
.Vexoo-root .med-sum-tags{display:flex;gap:8px}
.Vexoo-root .med-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
.Vexoo-root .med{display:flex;flex-direction:column;gap:14px}
.Vexoo-root .med-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.Vexoo-root .med-id{display:flex;align-items:center;gap:12px}
.Vexoo-root .med-ic{width:42px;height:42px;border-radius:12px;background:#E8F8F4;color:#0E7C66;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .med-name{font-size:15px;font-weight:700}
.Vexoo-root .med-dose{font-size:12.5px;font-weight:600;color:var(--teal);background:#E8F8F4;padding:2px 7px;border-radius:7px;margin-left:4px}
.Vexoo-root .med-purpose{font-size:12px;color:var(--ink3);margin-top:2px}
.Vexoo-root .med-ring-txt{font-size:11px;font-weight:700;font-family:'JetBrains Mono','IBM Plex Mono',monospace}
.Vexoo-root .med-sched{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.Vexoo-root .med-slot{display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;border-radius:10px;border:1px solid var(--line);background:#fbfdfc;font-size:12px;font-weight:600;color:var(--ink2);transition:.14s}
.Vexoo-root .med-slot:hover:not(:disabled){border-color:var(--teal);color:var(--teal)}
.Vexoo-root .med-slot-taken{background:#dbf3e6;border-color:#bfe9cf;color:#0E7C66}
.Vexoo-root .med-slot-off{opacity:.4;cursor:not-allowed}
.Vexoo-root .med-foot{display:flex;align-items:center;justify-content:space-between;gap:10px}
.Vexoo-root .med-remain{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--ink2)}
.Vexoo-root .med-remain.low{color:#d98914}
.Vexoo-root .trend-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
.Vexoo-root .trend-tab{display:inline-flex;align-items:center;gap:7px;padding:8px 13px;border-radius:11px;border:1px solid var(--line);background:#fbfdfc;font-size:12.5px;font-weight:600;color:var(--ink2);transition:.14s}
.Vexoo-root .trend-tab:hover{background:#fff;border-color:#A4E8DA}
.Vexoo-root .trend-tab.on{background:#fff;font-weight:700;box-shadow:var(--shadow)}
.Vexoo-root .trend-body{display:grid;grid-template-columns:200px 1fr;gap:22px;align-items:center}
.Vexoo-root .trend-now-val{font-size:38px;font-weight:800;letter-spacing:-.03em;line-height:1}
.Vexoo-root .trend-now-val span{font-size:15px;color:var(--ink3);margin-left:4px;letter-spacing:0}
.Vexoo-root .trend-now-label{font-size:13px;color:var(--ink2);font-weight:600;margin-top:6px}
.Vexoo-root .trend-target{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--ink3);margin-top:10px;padding:6px 10px;background:#f7faf9;border-radius:9px}
.Vexoo-root .trend-legend{display:flex;gap:14px;margin-top:12px;font-size:12px;color:var(--ink2);font-weight:500}
.Vexoo-root .trend-legend span{display:inline-flex;align-items:center;gap:6px}
.Vexoo-root .trend-chart{min-width:0}
.Vexoo-root .lab-list{display:flex;flex-direction:column;gap:10px}
.Vexoo-root .lab{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#fbfdfc}
.Vexoo-root .lab-head{display:flex;align-items:center;gap:13px;width:100%;padding:14px;text-align:left}
.Vexoo-root .lab-ic{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .lab-info{flex:1}
.Vexoo-root .lab-name{font-size:14px;font-weight:700}
.Vexoo-root .lab-date{font-size:12px;color:var(--ink3)}
.Vexoo-root .lab-detail{overflow:hidden;transition:max-height .3s ease}
.Vexoo-root .lab-table{width:100%;border-collapse:collapse;margin:0 14px 14px;width:calc(100% - 28px)}
.Vexoo-root .lab-table td{padding:9px 0;border-top:1px solid var(--line2);font-size:13px}
.Vexoo-root .lt-k{font-weight:600;color:var(--ink2)}
.Vexoo-root .lt-v{font-weight:700;font-family:'JetBrains Mono','IBM Plex Mono',monospace}
.Vexoo-root .lt-u{font-size:11px;color:var(--ink3);font-weight:400}
.Vexoo-root .lt-r{font-size:11.5px;color:var(--ink3);text-align:right}
.Vexoo-root .lt-s{text-align:right}
.Vexoo-root .advice{display:flex;flex-direction:column;gap:5px}
.Vexoo-root .advice-item{display:flex;gap:12px;align-items:center;padding:11px 0;border-bottom:1px solid var(--line2)}
.Vexoo-root .advice-item:last-child{border-bottom:none}
.Vexoo-root .advice-ic{width:34px;height:34px;border-radius:10px;background:#E8F8F4;color:#0E7C66;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .advice-text{font-size:13.5px;font-weight:600}
.Vexoo-root .advice-detail{font-size:11.5px;color:var(--ink3);margin-top:1px}
.Vexoo-root .appt-list{display:flex;flex-direction:column;gap:12px}
.Vexoo-root .appt{display:flex;align-items:center;gap:16px;padding:15px;border-radius:15px;border:1px solid var(--line);background:#fbfdfc;transition:.16s}
.Vexoo-root .appt:hover{border-color:#A4E8DA;box-shadow:var(--shadow)}
.Vexoo-root .appt-date{width:62px;flex-shrink:0;text-align:center;padding:8px;border-radius:12px;background:#E8F8F4}
.Vexoo-root .appt-day{font-size:11px;font-weight:700;color:var(--teal);text-transform:uppercase}
.Vexoo-root .appt-dd{font-size:22px;font-weight:800;letter-spacing:-.02em;line-height:1.1}
.Vexoo-root .appt-mo{font-size:11px;color:var(--ink3);font-weight:600}
.Vexoo-root .appt-info{flex:1;min-width:0}
.Vexoo-root .appt-type{font-size:15px;font-weight:700}
.Vexoo-root .appt-doc{font-size:12.5px;color:var(--ink2);margin:2px 0 7px}
.Vexoo-root .appt-meta{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:var(--ink3)}
.Vexoo-root .appt-meta span{display:inline-flex;align-items:center;gap:5px}
.Vexoo-root .appt-side{display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex-shrink:0}
.Vexoo-root .appt-btns{display:flex;gap:7px}
.Vexoo-root .book-cta, .Vexoo-root .ins-help{display:flex;flex-direction:column;align-items:flex-start;gap:7px}
.Vexoo-root .book-ic{width:46px;height:46px;border-radius:13px;background:#E8F8F4;color:#0E7C66;display:grid;place-items:center;margin-bottom:4px}
.Vexoo-root .book-title{font-size:16px;font-weight:700}
.Vexoo-root .book-sub{font-size:12.5px;color:var(--ink3);margin-bottom:8px}
.Vexoo-root .msg-wrap{overflow:hidden}
.Vexoo-root .msg-layout{display:grid;grid-template-columns:320px 1fr;height:600px}
.Vexoo-root .msg-list{border-right:1px solid var(--line);overflow-y:auto;display:flex;flex-direction:column}
.Vexoo-root .msg-list-head{display:flex;align-items:center;gap:9px;padding:18px;font-weight:700;font-size:15px;border-bottom:1px solid var(--line)}
.Vexoo-root .msg-count{margin-left:auto;background:var(--teal);color:#fff;font-size:11px;font-weight:700;min-width:20px;height:20px;border-radius:10px;display:grid;place-items:center}
.Vexoo-root .msg-item{position:relative;display:flex;gap:12px;padding:14px 18px;text-align:left;border-bottom:1px solid var(--line2);transition:.12s}
.Vexoo-root .msg-item:hover{background:#f7faf9}
.Vexoo-root .msg-item.on{background:#E8F8F4}
.Vexoo-root .msg-item-body{flex:1;min-width:0}
.Vexoo-root .msg-item-top{display:flex;justify-content:space-between;gap:8px}
.Vexoo-root .msg-from{font-size:13.5px;font-weight:700}
.Vexoo-root .msg-time{font-size:11px;color:var(--ink3)}
.Vexoo-root .msg-spec{font-size:11px;color:var(--teal);font-weight:600}
.Vexoo-root .msg-preview{font-size:12px;color:var(--ink3);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.Vexoo-root .msg-unread{position:absolute;top:18px;right:14px;width:8px;height:8px;border-radius:50%;background:var(--teal)}
.Vexoo-root .msg-thread{display:flex;flex-direction:column}
.Vexoo-root .msg-thread-head{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--line)}
.Vexoo-root .msg-thread-name{font-size:15px;font-weight:700}
.Vexoo-root .msg-thread-spec{font-size:12px;color:var(--teal);font-weight:600}
.Vexoo-root .msg-thread-body{flex:1;padding:22px;overflow-y:auto}
.Vexoo-root .msg-bubble{max-width:80%;padding:16px 18px;border-radius:4px 16px 16px 16px;background:#E8F8F4;font-size:13.5px;line-height:1.55;color:var(--ink2)}
.Vexoo-root .msg-bubble p{margin:0}
.Vexoo-root .msg-bubble p:empty{height:8px}
.Vexoo-root .msg-compose{display:flex;align-items:center;gap:10px;padding:14px 18px;border-top:1px solid var(--line)}
.Vexoo-root .msg-compose input{flex:1;padding:11px 15px;border-radius:12px;background:#F5F6F4;font-size:13.5px}
.Vexoo-root .msg-send{width:42px;height:42px;border-radius:12px;background:var(--teal);color:#fff;display:grid;place-items:center;flex-shrink:0;transition:.14s}
.Vexoo-root .msg-send:hover{filter:brightness(1.08)}
.Vexoo-root .bill-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.Vexoo-root .bill-stat{display:flex;flex-direction:column;align-items:flex-start;gap:8px}
.Vexoo-root .bs-label{font-size:12.5px;font-weight:600;color:var(--ink3)}
.Vexoo-root .bs-val{font-size:28px;font-weight:800;letter-spacing:-.03em}
.Vexoo-root .bs-sub{font-size:11.5px;color:var(--ink3)}
.Vexoo-root .bill-list{display:flex;flex-direction:column}
.Vexoo-root .bill-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--line2)}
.Vexoo-root .bill-row:last-child{border-bottom:none}
.Vexoo-root .bill-ic{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .bill-info{flex:1}
.Vexoo-root .bill-desc{font-size:13.5px;font-weight:600}
.Vexoo-root .bill-meta{font-size:11.5px;color:var(--ink3);margin-top:2px}
.Vexoo-root .bill-amt{font-size:15px;font-weight:800;font-family:'JetBrains Mono','IBM Plex Mono',monospace;letter-spacing:-.01em}
.Vexoo-root .ins-card{background:linear-gradient(135deg,#1b4ad4,#4F7CFF);border-radius:20px;padding:24px;color:#fff;box-shadow:0 14px 36px rgba(79,124,255,.28)}
.Vexoo-root .ins-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:26px}
.Vexoo-root .ins-brand{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:700}
.Vexoo-root .ins-status{font-size:11px;font-weight:700;background:rgba(255,255,255,.2);padding:4px 11px;border-radius:8px;text-transform:uppercase;letter-spacing:.04em}
.Vexoo-root .ins-member{font-size:19px;font-weight:800;margin-bottom:18px}
.Vexoo-root .ins-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.Vexoo-root .ins-grid>div{display:flex;flex-direction:column;gap:3px}
.Vexoo-root .ins-k{font-size:10.5px;color:rgba(255,255,255,.7);font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.Vexoo-root .ins-v{font-size:14px;font-weight:700;font-family:'JetBrains Mono','IBM Plex Mono',monospace}
.Vexoo-root .cov{display:flex;flex-direction:column;gap:16px}
.Vexoo-root .cov-top{display:flex;justify-content:space-between;font-size:13px;font-weight:600;margin-bottom:7px}
.Vexoo-root .cov-v{font-family:'JetBrains Mono','IBM Plex Mono',monospace;color:var(--ink2)}
.Vexoo-root .cov-note{font-size:11px;color:var(--ink3);margin-top:5px}
.Vexoo-root .ins-docs{display:flex;flex-direction:column;gap:7px}
.Vexoo-root .ins-doc{display:flex;align-items:center;gap:11px;padding:12px;border-radius:11px;border:1px solid var(--line);background:#fbfdfc;font-size:13px;font-weight:500;transition:.14s}
.Vexoo-root .ins-doc:hover{border-color:#A4E8DA;background:#fff}
.Vexoo-root .ins-doc span{flex:1;text-align:left}
.Vexoo-root .profile-head{display:flex;align-items:center;gap:18px}
.Vexoo-root .profile-id{flex:1}
.Vexoo-root .profile-name{font-size:22px;font-weight:800;letter-spacing:-.02em}
.Vexoo-root .profile-sub{font-size:13px;color:var(--ink3);margin:3px 0 9px}
.Vexoo-root .profile-tags{display:flex;gap:8px;flex-wrap:wrap}
.Vexoo-root .profile-info{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border-radius:16px;overflow:hidden;border:1px solid var(--line)}
.Vexoo-root .pinfo{background:var(--card);padding:16px 18px;display:flex;flex-direction:column;gap:4px}
.Vexoo-root .pinfo-k{font-size:11px;color:var(--ink3);font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.Vexoo-root .pinfo-v{font-size:14px;font-weight:600}
.Vexoo-root .goals{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.Vexoo-root .goal{display:flex;flex-direction:column;align-items:center;gap:9px;text-align:center}
.Vexoo-root .goal-ring-val{font-size:17px;font-weight:800;letter-spacing:-.02em}
.Vexoo-root .goal-label{font-size:12.5px;font-weight:700}
.Vexoo-root .goal-meta{font-size:11px;color:var(--ink3);font-family:'JetBrains Mono','IBM Plex Mono',monospace}
.Vexoo-root .symptoms{display:flex;flex-direction:column;gap:14px}
.Vexoo-root .symptom-head{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:600;margin-bottom:9px}
.Vexoo-root .symptom-ic{width:28px;height:28px;border-radius:8px;background:#E8F8F4;color:#0E7C66;display:grid;place-items:center}
.Vexoo-root .symptom-scale{margin-left:auto;font-size:11.5px;color:var(--ink3);font-weight:500}
.Vexoo-root .symptom-dots{display:flex;gap:7px}
.Vexoo-root .symptom-dot{flex:1;height:9px;border-radius:5px;background:#eaf0ee;transition:.14s}
.Vexoo-root .symptom-dot:hover{background:#A4E8DA}
.Vexoo-root .symptom-dot.on{background:var(--teal)}
.Vexoo-root .ach-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:13px}
.Vexoo-root .ach{position:relative;display:flex;flex-direction:column;align-items:center;gap:7px;padding:18px 12px;border-radius:15px;border:1px solid var(--line);text-align:center;transition:.16s}
.Vexoo-root .ach.earned{background:linear-gradient(165deg,#fffaf0,#fff);border-color:#f3e4c4}
.Vexoo-root .ach.earned:hover{transform:translateY(-3px);box-shadow:var(--shadow)}
.Vexoo-root .ach.locked{background:#fafbfb;opacity:.7}
.Vexoo-root .ach-ic{width:48px;height:48px;border-radius:14px;display:grid;place-items:center}
.Vexoo-root .ach.earned .ach-ic{background:linear-gradient(145deg,#f5c451,#e0951a);color:#fff;box-shadow:0 6px 14px rgba(224,149,26,.3)}
.Vexoo-root .ach.locked .ach-ic{background:#eef2f1;color:#b3bdbb}
.Vexoo-root .ach-title{font-size:12.5px;font-weight:700}
.Vexoo-root .ach-desc{font-size:11px;color:var(--ink3);line-height:1.3}
.Vexoo-root .ach-check{position:absolute;top:11px;right:11px;width:18px;height:18px;border-radius:50%;background:#15a06b;color:#fff;display:grid;place-items:center}
.Vexoo-root .tips{display:flex;flex-direction:column;gap:12px}
.Vexoo-root .tip{display:flex;gap:12px;align-items:flex-start;padding:13px;border-radius:13px;background:#fbfdfc;border:1px solid var(--line)}
.Vexoo-root .tip-ic{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .tip-title{font-size:13.5px;font-weight:700}
.Vexoo-root .tip-body{font-size:12px;color:var(--ink2);margin-top:2px;line-height:1.4;text-wrap:pretty}
.Vexoo-root .dot{display:inline-block;width:7px;height:7px;border-radius:50%}
.Vexoo-root .mselect{position:relative;display:flex;align-items:center;gap:10px}
.Vexoo-root .mselect-label{font-size:12px;font-weight:600;color:var(--ink3)}
.Vexoo-root .mselect-btn{display:flex;align-items:center;gap:10px;padding:6px 12px 6px 6px;border-radius:13px;background:#fbfdfc;border:1px solid var(--line);transition:.16s;min-width:170px}
.Vexoo-root .mselect-btn:hover{border-color:#A4E8DA;box-shadow:var(--shadow)}
.Vexoo-root .mselect-txt{display:flex;flex-direction:column;text-align:left;flex:1;min-width:0}
.Vexoo-root .mselect-name{font-size:13px;font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.Vexoo-root .mselect-rel{font-size:11px;color:var(--teal);font-weight:600}
.Vexoo-root .mselect-chev{color:var(--ink3);transition:.2s;flex-shrink:0}
.Vexoo-root .mselect-chev.up{transform:rotate(180deg)}
.Vexoo-root .mselect-pop{position:absolute;top:48px;right:0;min-width:230px;background:var(--card);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow-lg);padding:6px;z-index:40;animation:pop .16s ease}
.Vexoo-root .mselect-opt{display:flex;align-items:center;gap:11px;width:100%;padding:9px 10px;border-radius:10px;text-align:left;transition:.12s}
.Vexoo-root .mselect-opt:hover{background:#f1f7f5}
.Vexoo-root .mselect-opt.on{background:#E8F8F4}
.Vexoo-root .mselect-check{margin-left:auto;width:20px;height:20px;border-radius:50%;background:var(--teal);color:#fff;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .vax-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-bottom:18px}
.Vexoo-root .vax-tile{padding:16px;border-radius:14px;border:1px solid var(--line);background:#fbfdfc}
.Vexoo-root .vt-num{font-size:28px;font-weight:800;letter-spacing:-.03em;line-height:1}
.Vexoo-root .vt-label{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;color:var(--ink2);margin-top:8px}
.Vexoo-root .vax-info{flex:1}
.Vexoo-root .family-bar, .Vexoo-root .ins-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.Vexoo-root .family-bar-r{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.Vexoo-root .add-form{animation:fade .25s ease}
.Vexoo-root .af-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.Vexoo-root .af-field{display:flex;flex-direction:column;gap:6px}
.Vexoo-root .af-field>span{font-size:12px;font-weight:600;color:var(--ink2)}
.Vexoo-root .af-field>span em{color:var(--ink3);font-weight:500;font-style:normal}
.Vexoo-root .af-field input, .Vexoo-root .af-field select{padding:11px 13px;border-radius:11px;border:1px solid var(--line);background:#fbfdfc;font-size:13.5px;transition:.14s;width:100%}
.Vexoo-root .af-field input:focus, .Vexoo-root .af-field select:focus{border-color:#9fd6cd;box-shadow:0 0 0 3px rgba(14,124,102,.10);background:#fff}
.Vexoo-root .af-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px}
.Vexoo-root .dossier-head{display:flex;align-items:center;gap:14px}
.Vexoo-root .dossier-name{font-size:17px;font-weight:800;letter-spacing:-.02em}
.Vexoo-root .dossier-rel{font-size:12.5px;color:var(--ink3);margin-top:2px}
.Vexoo-root .dossier-blood{margin-left:auto;width:44px;height:44px;border-radius:12px;background:rgba(224,65,75,.12);color:#e0414b;display:grid;place-items:center;font-size:15px;font-weight:800;flex-shrink:0}
.Vexoo-root .dossier-remove{display:inline-flex;align-items:center;gap:6px;margin-top:14px;font-size:12.5px;font-weight:600;color:#e0414b;padding:8px 12px;border-radius:10px;border:1px solid #f6d9dc;transition:.14s}
.Vexoo-root .dossier-remove:hover{background:#fceced}
.Vexoo-root .cond-list{display:flex;flex-direction:column;gap:5px}
.Vexoo-root .cond{display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid var(--line2)}
.Vexoo-root .cond:last-child{border-bottom:none}
.Vexoo-root .cond-ic{width:32px;height:32px;border-radius:9px;background:rgba(224,65,75,.1);color:#e0414b;display:grid;place-items:center;flex-shrink:0}
.Vexoo-root .cond-name{font-size:13.5px;font-weight:700}
.Vexoo-root .cond-note{font-size:12px;color:var(--ink3);margin-top:1px}
@media(max-width:1180px){
.Vexoo-root .grid-2c{grid-template-columns:1fr}
.Vexoo-root .stat-grid{grid-template-columns:repeat(3,1fr)}
.Vexoo-root .trend-body{grid-template-columns:1fr}
.Vexoo-root .folder-grid{grid-template-columns:repeat(2,1fr)}
.Vexoo-root .med-grid{grid-template-columns:1fr}
}
.Vexoo-root .mob-menu-btn{display:none;width:38px;height:38px;border-radius:10px;background:var(--card);border:1px solid var(--line);color:var(--ink2);place-items:center;flex-shrink:0;cursor:pointer}
.Vexoo-root .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:190}
@media(max-width:768px){
.Vexoo-root .app{grid-template-columns:1fr}
.Vexoo-root .sidebar{position:fixed;inset:0 auto 0 0;width:260px;transform:translateX(-100%);transition:transform .25s;z-index:200}
.Vexoo-root .sidebar.open{transform:translateX(0);box-shadow:8px 0 32px rgba(0,0,0,.18)}
.Vexoo-root .topbar{padding:12px 14px;gap:8px;flex-wrap:nowrap}
.Vexoo-root .topbar-title{min-width:0}
.Vexoo-root .topbar-title h1{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.Vexoo-root .topbar-title p{display:none}
.Vexoo-root .gsearch{flex:1;min-width:0;max-width:none}
.Vexoo-root .gsearch-kbd{display:none}
.Vexoo-root .content{padding:14px 12px 80px}
.Vexoo-root .stat-grid{grid-template-columns:repeat(2,1fr)}
.Vexoo-root .folder-grid{grid-template-columns:repeat(2,1fr)}
.Vexoo-root .med-grid{grid-template-columns:1fr}
.Vexoo-root .msg-layout{grid-template-columns:1fr;height:auto}
.Vexoo-root .msg-list{border-right:none;border-bottom:1px solid var(--line);max-height:220px}
.Vexoo-root .qa-grid{grid-template-columns:1fr}
.Vexoo-root .hero{flex-direction:column;gap:14px;padding:18px}
.Vexoo-root .hero-actions{width:100%}
.Vexoo-root .hero-btn{flex:1;justify-content:center}
.Vexoo-root .topbar-user .tu-text{display:none}
.Vexoo-root .mob-menu-btn{display:grid}
.Vexoo-root .mob-overlay{display:block}
.Vexoo-root .changed-grid{grid-template-columns:1fr}
.Vexoo-root .bill-stats{grid-template-columns:1fr}
.Vexoo-root .vax-tiles{grid-template-columns:1fr 1fr}
}
@media(max-width:480px){
.Vexoo-root .stat-grid{grid-template-columns:1fr}
.Vexoo-root .folder-grid{grid-template-columns:1fr}
.Vexoo-root .ach-grid{grid-template-columns:repeat(2,1fr)}
.Vexoo-root .goals{grid-template-columns:repeat(2,1fr)}
.Vexoo-root .af-grid{grid-template-columns:1fr!important}
.Vexoo-root .topbar-title{display:none}
.Vexoo-root .gsearch{max-width:none}
.Vexoo-root .appt{flex-direction:column;align-items:flex-start}
.Vexoo-root .appt-side{align-items:flex-start;width:100%}
.Vexoo-root .appt-btns{flex-wrap:wrap}
}

/* ============================================================================
   HOSPITAL BOOKING FLOW — appended block (batch 2, Patient #3)
   All selectors scoped to .Vexoo-root. No existing rule modified.
   ============================================================================ */
.Vexoo-root .hb-wrap{animation:fade .25s ease}
.Vexoo-root .hb-filterbar{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:14px}
.Vexoo-root .hb-filter-chips{display:flex;gap:8px;flex-wrap:wrap}
.Vexoo-root .hb-chip{padding:7px 13px;border-radius:999px;font-size:12.5px;font-weight:600;color:var(--ink2);background:var(--card);border:1px solid var(--line);transition:.14s;white-space:nowrap}
.Vexoo-root .hb-chip:hover{border-color:#A4E8DA;color:var(--teal)}
.Vexoo-root .hb-chip.on{background:var(--teal);color:#fff;border-color:var(--teal)}
.Vexoo-root .hb-sort{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ink3);font-weight:600}
.Vexoo-root .hb-sort select{padding:8px 11px;border-radius:10px;border:1px solid var(--line);background:#fbfdfc;font-size:12.5px;font-weight:600;color:var(--ink);cursor:pointer}
.Vexoo-root .hb-count{font-size:12.5px;color:var(--ink3);font-weight:600;margin-bottom:12px}
.Vexoo-root .hb-list{display:flex;flex-direction:column;gap:14px}
.Vexoo-root .hb-card{display:flex;gap:0;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:#fbfdfc;transition:.16s}
.Vexoo-root .hb-card:hover{border-color:#A4E8DA;box-shadow:var(--shadow)}
.Vexoo-root .hb-img{width:190px;min-height:100%;object-fit:cover;flex-shrink:0;background:#e8f1ef}
.Vexoo-root .hb-img-fallback{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#0E7C66;background:linear-gradient(135deg,#E8F8F4,#cfeee6);font-size:12px;font-weight:700}
.Vexoo-root .hb-body{flex:1;min-width:0;padding:16px 18px;display:flex;flex-direction:column;gap:11px}
.Vexoo-root .hb-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.Vexoo-root .hb-name{font-size:16px;font-weight:800;letter-spacing:-.01em;line-height:1.25}
.Vexoo-root .hb-sub{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:5px}
.Vexoo-root .hb-typebadge{font-size:11px;font-weight:700;color:var(--teal);background:#E8F8F4;padding:3px 9px;border-radius:999px}
.Vexoo-root .hb-dist{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--ink3);font-weight:600}
.Vexoo-root .hb-ratebox{text-align:right;flex-shrink:0}
.Vexoo-root .hb-stars{display:inline-flex;gap:1px;line-height:0}
.Vexoo-root .hb-ratenum{font-size:16px;font-weight:800;color:var(--ink);margin-top:2px}
.Vexoo-root .hb-revcount{font-size:11px;color:var(--ink3);font-weight:500}
.Vexoo-root .hb-highlights{display:flex;gap:7px;flex-wrap:wrap}
.Vexoo-root .hb-pill{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:600;color:var(--ink2);background:#f2f6f5;border:1px solid var(--line2);padding:4px 9px;border-radius:8px}
.Vexoo-root .hb-pill svg{color:var(--teal)}
.Vexoo-root .hb-details{border-top:1px dashed var(--line);padding-top:12px;display:flex;flex-direction:column;gap:13px;animation:fade .2s ease}
.Vexoo-root .hb-detgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.Vexoo-root .hb-detgrid>div{font-size:13px;font-weight:700;color:var(--ink)}
.Vexoo-root .hb-detlbl{display:block;font-size:10.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px}
.Vexoo-root .hb-deptchips{display:flex;gap:6px;flex-wrap:wrap;margin-top:5px}
.Vexoo-root .hb-deptchip{font-size:11.5px;font-weight:600;color:var(--ink2);background:#fff;border:1px solid var(--line);padding:4px 9px;border-radius:8px}
.Vexoo-root .hb-reviews{display:flex;flex-direction:column;gap:9px}
.Vexoo-root .hb-review{background:#fff;border:1px solid var(--line);border-radius:11px;padding:10px 12px}
.Vexoo-root .hb-review-top{display:flex;align-items:center;gap:8px;font-size:12.5px}
.Vexoo-root .hb-review-top strong{font-weight:700}
.Vexoo-root .hb-review-date{color:var(--ink3);font-size:11px;margin-left:auto}
.Vexoo-root .hb-review-text{font-size:12.5px;color:var(--ink2);margin-top:4px;line-height:1.55}
.Vexoo-root .hb-maplink{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;color:var(--teal);padding:7px 0;text-decoration:none}
.Vexoo-root .hb-maplink:hover{text-decoration:underline}
.Vexoo-root .hb-actions{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:2px;flex-wrap:wrap}
.Vexoo-root .hb-detbtn{font-size:12.5px;font-weight:700;color:var(--ink2);background:none;padding:8px 2px}
.Vexoo-root .hb-detbtn:hover{color:var(--teal)}
.Vexoo-root .hb-bookbtn{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:700;color:#fff;background:var(--teal);padding:10px 16px;border-radius:11px;transition:.15s}
.Vexoo-root .hb-bookbtn:hover{background:var(--teal-d)}
.Vexoo-root .hb-empty{padding:34px;text-align:center;color:var(--ink3);font-size:13.5px;border:1px dashed var(--line);border-radius:14px}
/* chosen-hospital header on the schedule step */
.Vexoo-root .hb-chosen{display:flex;align-items:center;gap:14px;border:1px solid var(--line);border-radius:14px;padding:12px;background:#fbfdfc}
.Vexoo-root .hb-chosen .hb-img{width:84px;height:84px;min-height:0;border-radius:11px}
.Vexoo-root .hb-chosen .hb-img-fallback{width:84px;height:84px;border-radius:11px}
.Vexoo-root .hb-chosen-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px}
.Vexoo-root .hb-chosen-addr{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--ink3)}
.Vexoo-root .hb-change{font-size:12.5px;font-weight:700;color:var(--teal);background:#E8F8F4;padding:8px 13px;border-radius:10px;flex-shrink:0;align-self:flex-start}
.Vexoo-root .hb-change:hover{background:#d6f1ea}
/* time-slot picker */
.Vexoo-root .hb-slot-block{margin-top:16px;display:flex;flex-direction:column;gap:11px}
.Vexoo-root .hb-slotgroup-lbl{font-size:11.5px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:7px}
.Vexoo-root .hb-slots{display:flex;gap:8px;flex-wrap:wrap}
.Vexoo-root .hb-slot{padding:9px 14px;border-radius:10px;border:1px solid var(--line);background:#fbfdfc;font-size:13px;font-weight:600;color:var(--ink2);transition:.14s}
.Vexoo-root .hb-slot:hover{border-color:#A4E8DA;color:var(--teal)}
.Vexoo-root .hb-slot.on{background:var(--teal);color:#fff;border-color:var(--teal)}
/* confirmation step */
.Vexoo-root .hb-confirm{display:flex;flex-direction:column;align-items:center;text-align:center;padding:14px 6px;animation:fade .25s ease}
.Vexoo-root .hb-confirm-icon{width:60px;height:60px;border-radius:50%;background:var(--teal);color:#fff;display:grid;place-items:center;box-shadow:0 8px 20px rgba(14,124,102,.32)}
.Vexoo-root .hb-confirm-title{font-size:20px;font-weight:800;letter-spacing:-.02em;margin-top:14px;font-family:'Fraunces',Georgia,serif}
.Vexoo-root .hb-confirm-banner{margin-top:10px;background:#E8F8F4;color:var(--teal-d);border:1px solid #A4E8DA;border-radius:11px;padding:11px 16px;font-size:13px;font-weight:600;max-width:460px}
.Vexoo-root .hb-confirm-card{width:100%;max-width:520px;margin-top:18px;border:1px solid var(--line);border-radius:14px;overflow:hidden;text-align:left}
.Vexoo-root .hb-confirm-row{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:11px 16px;font-size:13px;border-bottom:1px solid var(--line2)}
.Vexoo-root .hb-confirm-row:last-child{border-bottom:none}
.Vexoo-root .hb-confirm-row>span{color:var(--ink3);font-weight:600;flex-shrink:0}
.Vexoo-root .hb-confirm-row>strong{font-weight:700;text-align:right}
.Vexoo-root .hb-send-row{display:flex;gap:12px;margin-top:18px;flex-wrap:wrap;justify-content:center}
.Vexoo-root .hb-send{display:inline-flex;align-items:center;gap:8px;font-size:13.5px;font-weight:700;color:#fff;padding:12px 20px;border-radius:12px;text-decoration:none;transition:.15s}
.Vexoo-root .hb-send-wa{background:#25D366}
.Vexoo-root .hb-send-wa:hover{background:#1da851}
.Vexoo-root .hb-send-sms{background:var(--indigo)}
.Vexoo-root .hb-send-sms:hover{background:#2c5fd0}
@media(max-width:680px){
.Vexoo-root .hb-card{flex-direction:column}
.Vexoo-root .hb-img{width:100%;height:150px;min-height:0}
.Vexoo-root .hb-detgrid{grid-template-columns:repeat(2,1fr)}
.Vexoo-root .hb-head{flex-direction:column}
.Vexoo-root .hb-ratebox{text-align:left}
.Vexoo-root .hb-chosen{flex-wrap:wrap}
.Vexoo-root .hb-confirm-row{flex-direction:column;gap:3px}
.Vexoo-root .hb-confirm-row>strong{text-align:left}
.Vexoo-root .hb-send{flex:1;justify-content:center}
}
`;