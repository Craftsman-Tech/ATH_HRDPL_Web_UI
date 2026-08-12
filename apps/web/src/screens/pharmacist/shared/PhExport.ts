import { pulseFor } from '../../../components/pulseBus';
/**
 * PhExport.ts — dependency-free file download helpers for the Pharmacist
 * portal Settings section. No npm install required (works with the manual
 * Ctrl+A → paste flow).
 *   • triggerDownload  — push a Blob to the browser as a file.
 *   • exportTextPdf    — build + download a minimal, valid single-page PDF.
 * Ported from the Hospital Admin HaExport so invoices/documents download as a
 * real .pdf without any third-party library.
 */

export function triggerDownload(blob: Blob, filename: string): void {
  pulseFor(600, 'Preparing download');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function pdfEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/** Build + download a one-page PDF from a title and a list of text lines. */
export function exportTextPdf(filename: string, title: string, lines: string[]): void {
  const y0 = 770;
  const textOps: string[] = [
    'BT', '/F1 18 Tf', `1 0 0 1 56 ${y0} Tm`, `(${pdfEscape(title)}) Tj`, 'ET',
  ];
  let y = y0 - 32;
  for (const ln of lines) {
    // a leading "##" marks a bold sub-heading line
    const bold = ln.startsWith('##');
    const text = bold ? ln.slice(2).trim() : ln;
    textOps.push('BT', bold ? '/F1 12 Tf' : '/F2 11 Tf', `1 0 0 1 56 ${y} Tm`, `(${pdfEscape(text)}) Tj`, 'ET');
    y -= bold ? 22 : 17;
  }
  const stream = textOps.join('\n');

  const objs: string[] = [];
  objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
  objs[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] ' +
            '/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>';
  objs[4] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  objs[5] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  objs[6] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (let i = 1; i <= 6; i++) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objs[i]}\nendobj\n`;
  }
  const xrefPos = pdf.length;
  pdf += `xref\n0 7\n0000000000 65535 f \n`;
  for (let i = 1; i <= 6; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  triggerDownload(blob, filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
