import { pulseFor } from '../../../components/pulseBus';
// ============================================================================
//  exportXlsx.ts — Vexoo Pharmacist Portal
//  Dependency-free Excel export. Produces a SpreadsheetML 2003 (.xls) workbook
//  that opens directly in Microsoft Excel / LibreOffice with NO warning and
//  NO npm packages. Header row is styled in the mineral brand colour.
// ============================================================================

type Cell = string | number;

function escXml(s: Cell): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Export tabular data to an Excel-compatible workbook and trigger a download.
 *
 * @param filename  file name WITHOUT extension (".xls" is appended)
 * @param sheetName worksheet tab name
 * @param headers   column header labels
 * @param rows      array of rows; each row is an array of cells (string | number)
 */
export function exportToExcel(
  filename: string,
  sheetName: string,
  headers: string[],
  rows: Cell[][],
): void {
  pulseFor(600, 'Preparing spreadsheet');
  const headerCells = headers
    .map(h => `<Cell ss:StyleID="hdr"><Data ss:Type="String">${escXml(h)}</Data></Cell>`)
    .join('');

  const bodyRows = rows
    .map(r => '<Row>' + r.map(c => {
      const isNum = typeof c === 'number' && Number.isFinite(c);
      return `<Cell><Data ss:Type="${isNum ? 'Number' : 'String'}">${escXml(c)}</Data></Cell>`;
    }).join('') + '</Row>')
    .join('');

  const xml =
`<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal"><Font ss:FontName="Calibri" ss:Size="11"/></Style>
  <Style ss:ID="hdr">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0E7C66" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escXml(sheetName)}">
  <Table>
   <Row>${headerCells}</Row>
   ${bodyRows}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
