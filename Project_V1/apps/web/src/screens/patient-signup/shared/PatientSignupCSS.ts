/**
 * PatientSignupCSS.ts — scoped styles for the patient sign-up feature.
 *
 * Same pattern as every portal's `shared/<Portal>CSS.ts`: a single exported
 * `CSS` string rendered via <style>{CSS}</style> in the orchestrator. Every
 * selector is namespaced under `.vxpat`, so this page (which lives OUTSIDE the
 * signed-in portals) cannot leak into or out of any portal. The field / card /
 * button / success styling mirrors the hospital-registration feature (.vxreg);
 * the method-choice, toggle, multi-select and family-card blocks are new.
 */
export const CSS = `
.vxpat{
  --paper:#FAFAF7; --paper-warm:#F4F2EC;
  --ink-900:#0B0F0E; --ink-800:#171C1B; --ink-700:#2A302F; --ink-600:#454C4B;
  --ink-500:#6B7270; --ink-400:#9AA09E; --ink-300:#C4C8C6; --ink-200:#E4E6E4;
  --ink-100:#EFF0EE; --ink-50:#F5F6F4;
  --mineral-900:#062F26; --mineral-800:#0A4A3D; --mineral-700:#0E7C66;
  --mineral-600:#149E83; --mineral-300:#A4E8DA; --mineral-100:#E8F8F4;
  --signal-red:#B43A2C;
  position:fixed; inset:0; z-index:1; overflow-y:auto;
  background:var(--paper); color:var(--ink-900);
  font-family:'Inter Tight',Inter,system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
}
.vxpat *{ box-sizing:border-box; }
.vxpat ::selection{ background:var(--mineral-700); color:#FAFAF7; }

/* top app bar */
.vxpat-bar{ position:sticky; top:0; z-index:5; display:flex; align-items:center; justify-content:space-between;
  padding:14px 24px; background:rgba(250,250,247,0.92); backdrop-filter:blur(8px); border-bottom:1px solid var(--ink-200); }
.vxpat-brand{ display:flex; align-items:center; gap:11px; }
.vxpat-mark{ width:34px; height:34px; border-radius:9px; background:var(--ink-900); display:grid; place-items:center; flex-shrink:0; }
.vxpat-word{ font-family:'Fraunces',Georgia,serif; font-size:20px; font-weight:500; letter-spacing:-0.02em; line-height:1; }
.vxpat-word .ath{ font-size:11px; font-weight:600; color:var(--mineral-700); margin-left:5px; letter-spacing:0.08em; vertical-align:middle; }
.vxpat-sub{ font-size:11px; color:var(--ink-500); margin-top:2px; }
.vxpat-back{ display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:600; color:var(--ink-600);
  background:#fff; border:1px solid var(--ink-200); border-radius:9px; padding:8px 13px; cursor:pointer; transition:.15s; font-family:inherit; }
.vxpat-back:hover{ color:var(--mineral-700); border-color:var(--mineral-700); }

/* page shell */
.vxpat-shell{ max-width:640px; margin:0 auto; padding:28px 20px 80px; }
.vxpat-eyebrow{ font-size:10.5px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--mineral-700);
  display:flex; align-items:center; gap:7px; margin-bottom:8px; }
.vxpat-eyebrow .dot{ width:6px; height:6px; border-radius:50%; background:var(--mineral-600); }
.vxpat-title{ font-family:'Fraunces',Georgia,serif; font-size:30px; line-height:1.12; letter-spacing:-0.03em; color:var(--ink-900); }
.vxpat-title em{ font-style:italic; font-weight:300; color:var(--mineral-700); }
.vxpat-lede{ font-size:14px; color:var(--ink-600); margin-top:9px; line-height:1.55; max-width:58ch; }

/* card */
.vxpat-card{ margin-top:22px; background:#fff; border:1px solid var(--ink-200); border-radius:14px; overflow:hidden;
  box-shadow:0 1px 2px rgba(11,15,14,.04); display:flex; flex-direction:column; }
.vxpat-body{ padding:22px 24px; }
.vxpat-sec{ font-family:'Fraunces',Georgia,serif; font-size:15px; color:var(--ink-700); margin:22px 0 12px; display:flex; align-items:center; gap:10px; }
.vxpat-sec::after{ content:''; flex:1; height:1px; background:var(--ink-200); }
.vxpat-sec:first-child{ margin-top:0; }

/* fields */
.vxpat-f{ margin-bottom:14px; }
.vxpat-2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
.vxpat-3{ display:grid; grid-template-columns:1.4fr 1fr 1fr; gap:12px; margin-bottom:14px; }
.vxpat-lbl{ font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-500); font-weight:500; margin-bottom:6px; display:flex; gap:4px; }
.vxpat-lbl .req{ color:var(--signal-red); }
.vxpat-inp,.vxpat-sel,.vxpat-ta{ width:100%; height:38px; padding:0 12px; border:1px solid var(--ink-200); border-radius:6px;
  background:#fff; color:var(--ink-900); font-family:inherit; font-size:13.5px; outline:none; transition:border-color .15s, box-shadow .15s; }
.vxpat-ta{ height:auto; padding:10px 12px; resize:vertical; min-height:64px; line-height:1.5; }
.vxpat-inp:focus,.vxpat-sel:focus,.vxpat-ta:focus{ border-color:var(--mineral-700); box-shadow:0 0 0 3px rgba(14,124,102,.1); }
.vxpat-inp::placeholder,.vxpat-ta::placeholder{ color:var(--ink-400); }
.vxpat-mono{ font-family:'JetBrains Mono',monospace; font-size:12.5px; }
.vxpat-help{ font-size:11.5px; color:var(--ink-500); margin-top:5px; line-height:1.45; }

/* ── method choice (Google / Email) ─────────────────────────────────────── */
.vxpat-methods{ display:flex; flex-direction:column; gap:12px; }
.vxpat-method{ display:flex; align-items:center; gap:14px; width:100%; padding:16px 18px; border:1px solid var(--ink-200);
  border-radius:11px; background:#fff; cursor:pointer; transition:.15s; font-family:inherit; text-align:left; }
.vxpat-method:hover{ border-color:var(--mineral-700); box-shadow:0 4px 14px rgba(14,124,102,.10); transform:translateY(-1px); }
.vxpat-method-ic{ width:42px; height:42px; border-radius:10px; display:grid; place-items:center; flex-shrink:0; }
.vxpat-method-ic.g{ background:#fff; border:1px solid var(--ink-200); }
.vxpat-method-ic.m{ background:var(--mineral-100); border:1px solid var(--mineral-300); color:var(--mineral-800); }
.vxpat-method-tx{ flex:1; min-width:0; }
.vxpat-method-h{ display:block; font-size:14.5px; font-weight:600; color:var(--ink-900); }
.vxpat-method-s{ display:block; font-size:12px; color:var(--ink-500); margin-top:2px; }
.vxpat-method-arrow{ color:var(--ink-400); flex-shrink:0; }
.vxpat-method:hover .vxpat-method-arrow{ color:var(--mineral-700); }
.vxpat-or{ display:flex; align-items:center; gap:12px; margin:16px 0; color:var(--ink-400); font-size:11px;
  text-transform:uppercase; letter-spacing:0.12em; }
.vxpat-or::before,.vxpat-or::after{ content:''; flex:1; height:1px; background:var(--ink-200); }
.vxpat-mailform{ display:flex; flex-direction:column; gap:12px; padding:16px; border:1px dashed var(--ink-300);
  border-radius:11px; background:var(--ink-50); }

/* ── family toggle switch ───────────────────────────────────────────────── */
.vxpat-toggle{ display:flex; align-items:center; justify-content:space-between; gap:14px; padding:14px 16px;
  border:1px solid var(--ink-200); border-radius:10px; background:var(--ink-50); }
.vxpat-toggle-tx{ min-width:0; }
.vxpat-toggle-h{ font-size:13.5px; font-weight:600; color:var(--ink-900); }
.vxpat-toggle-s{ font-size:12px; color:var(--ink-500); margin-top:2px; line-height:1.4; }
.vxpat-switch{ position:relative; width:46px; height:26px; border-radius:999px; background:var(--ink-300); border:none;
  cursor:pointer; flex-shrink:0; transition:background .18s; padding:0; }
.vxpat-switch.on{ background:var(--mineral-700); }
.vxpat-switch::after{ content:''; position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%;
  background:#fff; box-shadow:0 1px 3px rgba(0,0,0,.25); transition:transform .18s; }
.vxpat-switch.on::after{ transform:translateX(20px); }

/* ── relation multi-select (selected chips show inside the control) ──────── */
.vxpat-ms{ position:relative; }
.vxpat-ms-control{ display:flex; flex-wrap:wrap; align-items:center; gap:6px; min-height:40px; padding:6px 38px 6px 10px;
  border:1px solid var(--ink-200); border-radius:7px; background:#fff; cursor:pointer; transition:border-color .15s, box-shadow .15s; }
.vxpat-ms-control:hover{ border-color:var(--mineral-600); }
.vxpat-ms.open .vxpat-ms-control{ border-color:var(--mineral-700); box-shadow:0 0 0 3px rgba(14,124,102,.1); }
.vxpat-ms-ph{ color:var(--ink-400); font-size:13.5px; padding:2px 0; }
.vxpat-ms-chip{ display:inline-flex; align-items:center; gap:6px; height:24px; padding:0 6px 0 10px; border-radius:999px;
  background:var(--mineral-100); border:1px solid var(--mineral-300); color:var(--mineral-800); font-size:12px; font-weight:600; }
.vxpat-ms-chip button{ display:grid; place-items:center; width:16px; height:16px; border-radius:50%; border:none;
  background:transparent; color:var(--mineral-800); cursor:pointer; padding:0; }
.vxpat-ms-chip button:hover{ background:var(--mineral-300); }
.vxpat-ms-caret{ position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--ink-400); pointer-events:none; transition:transform .18s; }
.vxpat-ms.open .vxpat-ms-caret{ transform:translateY(-50%) rotate(180deg); }
.vxpat-ms-menu{ position:absolute; left:0; right:0; top:calc(100% + 6px); z-index:30; background:#fff; border:1px solid var(--ink-200);
  border-radius:9px; box-shadow:0 14px 38px rgba(11,15,14,.16); overflow:hidden; padding:4px; }
.vxpat-ms-opt{ display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:6px; cursor:pointer; font-size:13.5px; color:var(--ink-700); }
.vxpat-ms-opt:hover{ background:var(--ink-50); }
.vxpat-ms-box{ width:18px; height:18px; border-radius:5px; border:1.5px solid var(--ink-300); display:grid; place-items:center; flex-shrink:0; color:#fff; }
.vxpat-ms-opt.sel .vxpat-ms-box{ background:var(--mineral-700); border-color:var(--mineral-700); }
.vxpat-ms-opt.sel{ color:var(--ink-900); font-weight:600; }

/* ── family member cards ────────────────────────────────────────────────── */
.vxpat-fam-group{ margin-top:16px; }
.vxpat-fam-grouphead{ display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; text-transform:uppercase;
  letter-spacing:0.08em; color:var(--mineral-800); margin-bottom:10px; }
.vxpat-fam-grouphead .pill{ font-family:'JetBrains Mono',monospace; font-size:11px; background:var(--mineral-100);
  border:1px solid var(--mineral-300); border-radius:999px; padding:1px 8px; letter-spacing:0; }
.vxpat-fam{ border:1px solid var(--ink-200); border-radius:10px; padding:14px; margin-bottom:10px; background:var(--paper); }
.vxpat-fam-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.vxpat-fam-title{ font-size:13px; font-weight:600; color:var(--ink-800); display:flex; align-items:center; gap:8px; }
.vxpat-fam-title .ix{ width:20px; height:20px; border-radius:50%; background:var(--mineral-700); color:#fff;
  font-size:11px; font-family:'JetBrains Mono',monospace; display:grid; place-items:center; }
.vxpat-fam-rm{ display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:var(--signal-red);
  background:#fff; border:1px solid var(--ink-200); border-radius:7px; padding:5px 9px; cursor:pointer; font-family:inherit; transition:.15s; }
.vxpat-fam-rm:hover{ border-color:var(--signal-red); background:#FCF0EE; }
.vxpat-fam-add{ display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:600; color:var(--mineral-700);
  background:#fff; border:1px dashed var(--mineral-300); border-radius:8px; padding:9px 14px; cursor:pointer; font-family:inherit; transition:.15s; }
.vxpat-fam-add:hover{ background:var(--mineral-100); border-style:solid; }

/* note */
.vxpat-note{ display:flex; gap:9px; margin-top:18px; padding:12px 14px; background:var(--ink-50); border:1px solid var(--ink-200);
  border-radius:8px; font-size:12.5px; color:var(--ink-600); line-height:1.5; }
.vxpat-note svg{ flex-shrink:0; margin-top:1px; color:var(--mineral-700); }

/* id chip on the details step */
.vxpat-idchip{ display:inline-flex; align-items:center; gap:8px; margin-top:14px; font-size:12px; font-weight:600;
  color:var(--mineral-800); background:var(--mineral-100); border:1px solid var(--mineral-300); border-radius:999px; padding:6px 13px; }
.vxpat-idchip .v{ font-family:'JetBrains Mono',monospace; letter-spacing:0.02em; }

/* footer nav */
.vxpat-foot{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:14px 24px;
  border-top:1px solid var(--ink-200); background:rgba(250,250,247,0.95); }
.vxpat-prog{ font-size:12px; color:var(--ink-500); font-family:'JetBrains Mono',monospace; }
.vxpat-actions{ display:flex; gap:8px; }
.vxpat-btn{ display:inline-flex; align-items:center; gap:7px; height:40px; padding:0 18px; border-radius:9px; font-family:inherit;
  font-size:14px; font-weight:600; cursor:pointer; transition:.15s; border:1px solid transparent; }
.vxpat-btn-primary{ background:var(--mineral-700); color:#FAFAF7; }
.vxpat-btn-primary:hover{ background:var(--mineral-800); }
.vxpat-btn-primary:disabled{ opacity:.5; cursor:not-allowed; }
.vxpat-btn-ghost{ background:#fff; border-color:var(--ink-200); color:var(--ink-700); }
.vxpat-btn-ghost:hover{ background:var(--ink-50); }
.vxpat-btn-ghost:disabled{ opacity:.4; cursor:not-allowed; }
.vxpat-btn-block{ width:100%; justify-content:center; height:44px; }

/* success */
.vxpat-done{ display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px; padding:40px 24px; }
.vxpat-done-ic{ width:60px; height:60px; border-radius:50%; background:var(--mineral-700); color:#fff; display:grid; place-items:center;
  box-shadow:0 8px 22px rgba(14,124,102,.32); }
.vxpat-done-title{ font-family:'Fraunces',Georgia,serif; font-size:24px; letter-spacing:-0.02em; }
.vxpat-done-sub{ font-size:14px; color:var(--ink-600); max-width:44ch; line-height:1.6; }
.vxpat-idcard{ display:flex; flex-direction:column; align-items:center; gap:4px; background:var(--mineral-100);
  border:1px solid var(--mineral-300); border-radius:12px; padding:16px 28px; }
.vxpat-idcard .k{ font-size:10.5px; text-transform:uppercase; letter-spacing:0.12em; color:var(--mineral-800); font-weight:600; }
.vxpat-idcard .v{ font-family:'JetBrains Mono',monospace; font-size:21px; font-weight:600; color:var(--mineral-900); letter-spacing:0.02em; }

@media(max-width:640px){
  .vxpat-shell{ padding:20px 14px 70px; }
  .vxpat-title{ font-size:25px; }
  .vxpat-2,.vxpat-3{ grid-template-columns:1fr; }
  .vxpat-body{ padding:18px 16px; }
  .vxpat-foot{ padding:12px 16px; flex-wrap:wrap; }
}
`;
