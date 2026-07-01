// ============================================================================
//  prescriptionPdf.ts — Vexoo Pharmacist Portal
//  Dependency-free PDF generator. Builds a genuine, single-page, flattened
//  (non-editable text) PDF and downloads it — NO npm packages (no jsPDF).
//  Used by Completed Prescriptions → "Download" to export an Rx as PDF.
// ============================================================================

import type { CompletedRx } from '../types/pharmacist.types';

// Escape characters that are special inside a PDF text string.
function pdfEsc(s: string): string {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[\r\n]+/g, ' ');
}

interface Line { text: string; x: number; y: number; size: number; bold?: boolean; }
interface Rule { x1: number; y1: number; x2: number; y2: number; }

// Wrap a long string to a rough character width (Helvetica ~ 0.5em avg).
function wrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) { out.push(cur.trim()); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) out.push(cur.trim());
  return out;
}

/** Build the raw bytes of a one-page A4 PDF from text lines + rule lines. */
function buildPdf(lines: Line[], rules: Rule[]): string {
  let content = '';
  for (const r of rules) {
    content += `0.86 0.87 0.86 RG 0.8 w ${r.x1} ${r.y1} m ${r.x2} ${r.y2} l S\n`;
  }
  content += '0 0 0 rg\n';
  for (const l of lines) {
    const f = l.bold ? '/F2' : '/F1';
    content += `BT ${f} ${l.size} Tf ${l.x} ${l.y} Td (${pdfEsc(l.text)}) Tj ET\n`;
  }

  const objs: string[] = [];
  objs.push('<< /Type /Catalog /Pages 2 0 R >>');
  objs.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  objs.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>');
  objs.push(`<< /Length ${content.length} >>\nstream\n${content}endstream`);
  objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  objs.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (let i = 0; i < objs.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objs[i]}\nendobj\n`;
  }
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += String(off).padStart(10, '0') + ' 00000 n \n';
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return pdf;
}

function download(pdfStr: string, filename: string): void {
  // latin1 keeps byte offsets exact (PDF is a byte format, not UTF-8).
  const bytes = new Uint8Array(pdfStr.length);
  for (let i = 0; i < pdfStr.length; i++) bytes[i] = pdfStr.charCodeAt(i) & 0xff;
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Compose a completed prescription into a downloadable, non-editable PDF. */
export function downloadPrescriptionPdf(rx: CompletedRx): void {
  const L: Line[] = [];
  const R: Rule[] = [];
  const left = 56;
  let y = 792;

  // Letterhead
  L.push({ text: 'VEXOO PHARMACY', x: left, y, size: 22, bold: true }); y -= 20;
  L.push({ text: rx.clinic || 'Vexoo General Hospital', x: left, y, size: 11 }); y -= 14;
  L.push({ text: 'Prescription Record  ·  This is a system-generated document', x: left, y, size: 9.5 }); y -= 18;
  R.push({ x1: left, y1: y, x2: 539, y2: y }); y -= 26;

  // Rx + date row
  L.push({ text: `Rx ID:  ${rx.id}`, x: left, y, size: 12, bold: true });
  L.push({ text: `Date:  ${rx.completedDate}`, x: 380, y, size: 11 }); y -= 28;

  // Patient block
  L.push({ text: 'PATIENT', x: left, y, size: 9, bold: true }); y -= 16;
  L.push({ text: `Name:  ${rx.patient}`, x: left, y, size: 11 }); y -= 15;
  L.push({ text: `Patient ID:  ${rx.pid}`, x: left, y, size: 11 });
  if (rx.dob) L.push({ text: `DOB:  ${rx.dob}`, x: 300, y, size: 11 }); y -= 15;
  if (rx.phone) { L.push({ text: `Phone:  ${rx.phone}`, x: left, y, size: 11 }); y -= 15; }
  y -= 8;
  R.push({ x1: left, y1: y, x2: 539, y2: y }); y -= 26;

  // Prescriber
  L.push({ text: 'PRESCRIBER', x: left, y, size: 9, bold: true }); y -= 16;
  L.push({ text: `Doctor:  ${rx.doctor}`, x: left, y, size: 11 });
  L.push({ text: `Source:  ${rx.source}`, x: 300, y, size: 11 }); y -= 24;
  R.push({ x1: left, y1: y, x2: 539, y2: y }); y -= 26;

  // Medication (the "Rx" symbol)
  L.push({ text: 'Rx', x: left, y, size: 20, bold: true }); y -= 22;
  L.push({ text: `${rx.drug}`, x: left + 6, y, size: 13, bold: true }); y -= 16;
  L.push({ text: `Quantity:  ${rx.qty}`, x: left + 6, y, size: 11 }); y -= 18;
  if (rx.instructions) {
    L.push({ text: 'Instructions / Sig:', x: left + 6, y, size: 10, bold: true }); y -= 15;
    for (const wl of wrap(rx.instructions, 78)) { L.push({ text: wl, x: left + 6, y, size: 11 }); y -= 14; }
  }
  y -= 16;
  R.push({ x1: left, y1: y, x2: 539, y2: y }); y -= 24;

  // Billing
  L.push({ text: `Amount Billed:  Rs. ${rx.amount}`, x: left, y, size: 12, bold: true });
  L.push({ text: `Turnaround:  ${rx.turnaround}`, x: 300, y, size: 11 }); y -= 40;

  // Footer
  L.push({ text: 'Dispensed by:  Maria Perez (Clinical Pharmacist)', x: left, y, size: 10 }); y -= 30;
  L.push({ text: '_______________________________', x: 360, y, size: 10 }); y -= 14;
  L.push({ text: 'Authorised Signature', x: 390, y, size: 9 });

  L.push({ text: 'Generated by Vexoo Clinic Operations · Not valid for re-dispensing without verification.', x: left, y: 48, size: 8 });

  const filename = `Prescription_${rx.id}_${rx.patient.replace(/\s+/g, '_')}.pdf`;
  download(buildPdf(L, R), filename);
}
