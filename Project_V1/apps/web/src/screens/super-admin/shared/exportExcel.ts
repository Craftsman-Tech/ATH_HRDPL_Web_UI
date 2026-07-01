/**
 * exportExcel.ts — dependency-free Excel export (SpreadsheetML 2003).
 * No npm install required; produces a .xls that Excel/LibreOffice open natively.
 */
type Cell = string | number;

function esc(v: Cell): string {
  return String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function exportExcel(filename: string, headers: string[], rows: Cell[][]): void {
  const headCells = headers
    .map(h => `<Cell ss:StyleID="hdr"><Data ss:Type="String">${esc(h)}</Data></Cell>`)
    .join('');
  const bodyRows = rows.map(r => {
    const cells = r.map(c => {
      const type = typeof c === 'number' ? 'Number' : 'String';
      return `<Cell><Data ss:Type="${type}">${esc(c)}</Data></Cell>`;
    }).join('');
    return `<Row>${cells}</Row>`;
  }).join('');

  const xml =
`<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="hdr"><Font ss:Bold="1"/>
   <Interior ss:Color="#0E7C66" ss:Pattern="Solid"/>
   <Font ss:Color="#FFFFFF" ss:Bold="1"/></Style>
 </Styles>
 <Worksheet ss:Name="Hospitals">
  <Table><Row>${headCells}</Row>${bodyRows}</Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  triggerDownload(blob, filename.endsWith('.xls') ? filename : `${filename}.xls`);
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
