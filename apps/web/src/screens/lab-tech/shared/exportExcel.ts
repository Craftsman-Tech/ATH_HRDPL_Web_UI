import { pulseFor } from '../../../components/pulseBus';
// ============================================================================
//  exportExcel.ts — dependency-free Excel (.xls) export
// ============================================================================
//  Builds a SpreadsheetML 2003 (XML) workbook and triggers a browser download.
//  No npm install required — works offline. Opens cleanly in Excel / LibreOffice
//  / Google Sheets. Used by the Reports screen ("Export Excel").
// ============================================================================

const esc = (v: unknown): string =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const isNumeric = (v: unknown): boolean =>
  typeof v === 'number' || (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v)));

/**
 * Export a single sheet to an .xls download.
 * @param filename  e.g. "lab-report-21-Jun-2026"
 * @param headers   column titles
 * @param rows      array of rows (each an array of cell values)
 * @param sheetName tab name
 */
export function exportExcel(
  filename: string,
  headers: (string | number)[],
  rows: (string | number)[][],
  sheetName = 'Report',
): void {
  pulseFor(600, 'Preparing spreadsheet');
  const headerCells = headers
    .map(h => `<Cell ss:StyleID="hdr"><Data ss:Type="String">${esc(h)}</Data></Cell>`)
    .join('');

  const bodyRows = rows
    .map(r => {
      const cells = r
        .map(c => {
          const type = isNumeric(c) ? 'Number' : 'String';
          const val = type === 'Number' ? Number(c) : esc(c);
          return `<Cell><Data ss:Type="${type}">${val}</Data></Cell>`;
        })
        .join('');
      return `<Row>${cells}</Row>`;
    })
    .join('');

  const xml =
    `<?xml version="1.0"?>` +
    `<?mso-application progid="Excel.Sheet"?>` +
    `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ` +
    `xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">` +
    `<Styles>` +
    `<Style ss:ID="hdr"><Font ss:Bold="1" ss:Color="#FFFFFF"/>` +
    `<Interior ss:Color="#0E7C66" ss:Pattern="Solid"/></Style>` +
    `</Styles>` +
    `<Worksheet ss:Name="${esc(sheetName)}"><Table>` +
    `<Row>${headerCells}</Row>${bodyRows}` +
    `</Table></Worksheet></Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.xls') ? filename : `${filename}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
