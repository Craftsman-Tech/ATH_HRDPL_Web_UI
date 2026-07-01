/**
 * exportPdf.ts — dependency-free single-page PDF generator.
 * Builds a minimal but valid PDF (Helvetica text lines). No npm install.
 * Good enough for credential sheets / simple receipts.
 */
import { triggerDownload } from './exportExcel';

function pdfEscape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function exportTextPdf(filename: string, title: string, lines: string[]): void {
  const y0 = 760;
  const textOps: string[] = [
    'BT', '/F1 16 Tf', `1 0 0 1 56 ${y0} Tm`, `(${pdfEscape(title)}) Tj`, 'ET',
  ];
  let y = y0 - 30;
  for (const ln of lines) {
    textOps.push('BT', '/F2 11 Tf', `1 0 0 1 56 ${y} Tm`, `(${pdfEscape(ln)}) Tj`, 'ET');
    y -= 18;
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
