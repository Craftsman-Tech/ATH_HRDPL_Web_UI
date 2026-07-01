/**
 * RegisterCSS.ts — scoped styles for the registration feature.
 *
 * Same pattern as every portal's `shared/<Portal>CSS.ts`: a single exported
 * `CSS` string rendered via <style>{CSS}</style> in the orchestrator. Every
 * selector is namespaced under `.vxreg`, so this page (which lives OUTSIDE the
 * .vx-admin portal) cannot leak into or out of any portal. Palette + field /
 * stepper / upload styling are faithful to the Super-Admin "Register Hospital"
 * drawer (AdminCSS.ts), just re-scoped.
 */
export const CSS = `
.vxreg{
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
.vxreg *{ box-sizing:border-box; }
.vxreg ::selection{ background:var(--mineral-700); color:#FAFAF7; }

/* top app bar */
.vxreg-bar{ position:sticky; top:0; z-index:5; display:flex; align-items:center; justify-content:space-between;
  padding:14px 24px; background:rgba(250,250,247,0.92); backdrop-filter:blur(8px); border-bottom:1px solid var(--ink-200); }
.vxreg-brand{ display:flex; align-items:center; gap:11px; }
.vxreg-mark{ width:34px; height:34px; border-radius:9px; background:var(--ink-900); display:grid; place-items:center; flex-shrink:0; }
.vxreg-word{ font-family:'Fraunces',Georgia,serif; font-size:20px; font-weight:500; letter-spacing:-0.02em; line-height:1; }
.vxreg-word .ath{ font-size:11px; font-weight:600; color:var(--mineral-700); margin-left:5px; letter-spacing:0.08em; vertical-align:middle; }
.vxreg-sub{ font-size:11px; color:var(--ink-500); margin-top:2px; }
.vxreg-back{ display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:600; color:var(--ink-600);
  background:#fff; border:1px solid var(--ink-200); border-radius:9px; padding:8px 13px; cursor:pointer; transition:.15s; font-family:inherit; }
.vxreg-back:hover{ color:var(--mineral-700); border-color:var(--mineral-700); }

/* page shell */
.vxreg-shell{ max-width:720px; margin:0 auto; padding:28px 20px 80px; }
.vxreg-eyebrow{ font-size:10.5px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--mineral-700);
  display:flex; align-items:center; gap:7px; margin-bottom:8px; }
.vxreg-eyebrow .dot{ width:6px; height:6px; border-radius:50%; background:var(--mineral-600); }
.vxreg-title{ font-family:'Fraunces',Georgia,serif; font-size:30px; line-height:1.12; letter-spacing:-0.03em; color:var(--ink-900); }
.vxreg-title em{ font-style:italic; font-weight:300; color:var(--mineral-700); }
.vxreg-lede{ font-size:14px; color:var(--ink-600); margin-top:9px; line-height:1.55; max-width:60ch; }
.vxreg-india{ display:inline-flex; align-items:center; gap:7px; margin-top:14px; font-size:12px; font-weight:600;
  color:var(--mineral-800); background:var(--mineral-100); border:1px solid var(--mineral-300); border-radius:999px; padding:5px 12px; }

/* card */
.vxreg-card{ margin-top:22px; background:#fff; border:1px solid var(--ink-200); border-radius:14px; overflow:hidden;
  box-shadow:0 1px 2px rgba(11,15,14,.04); display:flex; flex-direction:column; }

/* stepper */
.vxreg-stepper{ display:flex; gap:0; padding:14px 22px 0; border-bottom:1px solid var(--ink-200); background:rgba(244,242,236,0.5); }
.vxreg-step{ flex:1; padding:0 0 12px; cursor:pointer; border:none; background:none; border-bottom:2px solid transparent;
  font-family:inherit; text-align:left; display:flex; align-items:center; }
.vxreg-step.active{ border-bottom-color:var(--mineral-700); }
.vxreg-step-num{ width:22px; height:22px; border-radius:50%; background:var(--ink-100); color:var(--ink-500); font-size:11px; font-weight:600;
  font-family:'JetBrains Mono',monospace; display:inline-flex; align-items:center; justify-content:center; margin-right:8px; flex-shrink:0; }
.vxreg-step.active .vxreg-step-num{ background:var(--mineral-700); color:#FAFAF7; }
.vxreg-step.done .vxreg-step-num{ background:var(--mineral-100); color:var(--mineral-800); }
.vxreg-step-label{ font-size:12.5px; font-weight:500; color:var(--ink-600); }
.vxreg-step.active .vxreg-step-label{ color:var(--ink-900); }

/* body */
.vxreg-body{ padding:22px 24px; }
.vxreg-sec{ font-family:'Fraunces',Georgia,serif; font-size:15px; color:var(--ink-700); margin:20px 0 12px; display:flex; align-items:center; gap:10px; }
.vxreg-sec::after{ content:''; flex:1; height:1px; background:var(--ink-200); }
.vxreg-sec:first-child{ margin-top:0; }
.vxreg-f{ margin-bottom:14px; }
.vxreg-2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
.vxreg-3{ display:grid; grid-template-columns:1.4fr 1fr 1fr; gap:12px; margin-bottom:14px; }
.vxreg-lbl{ font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-500); font-weight:500; margin-bottom:6px; display:flex; gap:4px; }
.vxreg-lbl .req{ color:var(--signal-red); }
.vxreg-inp,.vxreg-sel,.vxreg-ta{ width:100%; height:38px; padding:0 12px; border:1px solid var(--ink-200); border-radius:6px;
  background:#fff; color:var(--ink-900); font-family:inherit; font-size:13.5px; outline:none; transition:border-color .15s, box-shadow .15s; }
.vxreg-ta{ height:auto; padding:10px 12px; resize:vertical; min-height:74px; line-height:1.5; }
.vxreg-inp:focus,.vxreg-sel:focus,.vxreg-ta:focus{ border-color:var(--mineral-700); box-shadow:0 0 0 3px rgba(14,124,102,.1); }
.vxreg-inp::placeholder,.vxreg-ta::placeholder{ color:var(--ink-400); }
.vxreg-mono{ font-family:'JetBrains Mono',monospace; font-size:12.5px; }
.vxreg-help{ font-size:11.5px; color:var(--ink-500); margin-top:5px; line-height:1.45; }

/* sub-domain combo */
.vxreg-combo{ display:flex; align-items:stretch; border:1px solid var(--ink-200); border-radius:6px; overflow:hidden; background:#fff; }
.vxreg-combo .vxreg-inp{ border:none; flex:1; box-shadow:none; }
.vxreg-combo .suffix{ display:flex; align-items:center; padding:0 12px; background:var(--ink-50); color:var(--ink-600);
  border-left:1px solid var(--ink-200); font-size:12px; font-family:'JetBrains Mono',monospace; }

/* uploads */
.vxreg-up{ display:flex; align-items:center; gap:10px; padding:11px 12px; border:1px dashed var(--ink-300); border-radius:6px;
  background:var(--ink-50); font-size:12.5px; color:var(--ink-600); cursor:pointer; transition:all .15s; margin-bottom:8px; }
.vxreg-up:hover{ border-color:var(--mineral-600); background:var(--mineral-100); color:var(--mineral-800); }
.vxreg-up.has{ border-style:solid; border-color:var(--mineral-300); background:var(--mineral-100); color:var(--mineral-800); cursor:default; }
.vxreg-up-txt{ flex:1; min-width:0; }
.vxreg-up-name{ font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vxreg-up-meta{ margin-left:auto; font-family:'JetBrains Mono',monospace; font-size:11px; white-space:nowrap; }
.vxreg-up-x{ width:24px; height:24px; border-radius:5px; border:1px solid var(--mineral-300); background:#fff; color:var(--mineral-800);
  display:grid; place-items:center; cursor:pointer; flex-shrink:0; }
.vxreg-up-x:hover{ background:var(--mineral-100); }

/* note */
.vxreg-note{ display:flex; gap:9px; margin-top:18px; padding:12px 14px; background:var(--ink-50); border:1px solid var(--ink-200);
  border-radius:8px; font-size:12.5px; color:var(--ink-600); line-height:1.5; }
.vxreg-note svg{ flex-shrink:0; margin-top:1px; color:var(--mineral-700); }

/* footer nav */
.vxreg-foot{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:14px 24px;
  border-top:1px solid var(--ink-200); background:rgba(250,250,247,0.95); }
.vxreg-prog{ font-size:12px; color:var(--ink-500); font-family:'JetBrains Mono',monospace; }
.vxreg-actions{ display:flex; gap:8px; }
.vxreg-btn{ display:inline-flex; align-items:center; gap:7px; height:40px; padding:0 18px; border-radius:9px; font-family:inherit;
  font-size:14px; font-weight:600; cursor:pointer; transition:.15s; border:1px solid transparent; }
.vxreg-btn-primary{ background:var(--mineral-700); color:#FAFAF7; }
.vxreg-btn-primary:hover{ background:var(--mineral-800); }
.vxreg-btn-primary:disabled{ opacity:.5; cursor:not-allowed; }
.vxreg-btn-ghost{ background:#fff; border-color:var(--ink-200); color:var(--ink-700); }
.vxreg-btn-ghost:hover{ background:var(--ink-50); }
.vxreg-btn-ghost:disabled{ opacity:.4; cursor:not-allowed; }

/* success */
.vxreg-done{ display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px; padding:40px 24px; }
.vxreg-done-ic{ width:60px; height:60px; border-radius:50%; background:var(--mineral-700); color:#fff; display:grid; place-items:center;
  box-shadow:0 8px 22px rgba(14,124,102,.32); }
.vxreg-done-title{ font-family:'Fraunces',Georgia,serif; font-size:24px; letter-spacing:-0.02em; }
.vxreg-done-sub{ font-size:14px; color:var(--ink-600); max-width:42ch; line-height:1.6; }
.vxreg-ref{ font-family:'JetBrains Mono',monospace; font-size:13px; background:var(--mineral-100); color:var(--mineral-800);
  border:1px solid var(--mineral-300); border-radius:8px; padding:8px 14px; }

@media(max-width:640px){
  .vxreg-shell{ padding:20px 14px 70px; }
  .vxreg-title{ font-size:25px; }
  .vxreg-2,.vxreg-3{ grid-template-columns:1fr; }
  .vxreg-stepper{ padding:12px 14px 0; }
  .vxreg-step-label{ font-size:11.5px; }
  .vxreg-body{ padding:18px 16px; }
  .vxreg-foot{ padding:12px 16px; flex-wrap:wrap; }
}
`;
