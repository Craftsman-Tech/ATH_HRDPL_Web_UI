import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BarChart, Badge, SvgIcon } from '../shared/PhHelpers';
import { inRange } from '../shared/FilterPopover';
import type { DatePreset, RangeFilter } from '../shared/FilterPopover';
import { exportToExcel } from '../shared/exportXlsx';
import {
  INVENTORY, PURCHASE_ORDERS, COMPLETED, DISPENSED,
  MEDICINE_CATALOG, CATEGORIES,
} from '../data/mockPharmData';

// ============================================================================
//  Reports.tsx — Reports & Analytics
//  The dead "This Week / Month / Quarter" tabs are replaced with a single
//  "Custom Filter" popover (date range + medicine category). Every KPI, chart
//  and breakdown below recomputes from the selected filter, and "Export"
//  downloads the full analysis of that selection as an Excel workbook.
// ============================================================================

// ── Date-range presets shown in the filter popover ──
const PRESETS: { id: DatePreset; label: string }[] = [
  { id: 'all',    label: 'All'               },
  { id: 'week',   label: 'Week'              },
  { id: 'month',  label: 'Month'             },
  { id: 'year',   label: 'Year'              },
  { id: 'custom', label: 'Custom Date Range' },
];

// "Medicine Category" options = All + every catalogue category.
const CAT_OPTIONS = ['All', ...CATEGORIES];

// Map a drug name (e.g. "Sumatriptan 50mg") → its category, via the catalogue,
// falling back to the live inventory list, else "Other".
const drugCategory = (drug: string): string =>
  MEDICINE_CATALOG.find(m => m.name === drug)?.category
  ?? INVENTORY.find(i => i.name === drug)?.category
  ?? 'Other';

// Palette for the "Top Dispensed Categories" bars (cycled).
const CAT_COLORS = ['#0E7C66', '#0A6E8F', '#C68A1F', '#6D5BD0', '#B43A2C', '#2F8F5B', '#9A4Fb0'];

interface ReportFilter {
  preset: DatePreset;
  from: string;   // yyyy-mm-dd (only when preset === 'custom')
  to: string;     // yyyy-mm-dd
  category: string;
}

const DEFAULT_REPORT_FILTER: ReportFilter = { preset: 'all', from: '', to: '', category: 'All' };

const PRESET_LABEL: Record<DatePreset, string> = {
  all: 'All time', week: 'This Week', month: 'This Month', year: 'This Year', custom: 'Custom range',
};

export const Reports: React.FC = () => {
  const [filter, setFilter] = useState<ReportFilter>(DEFAULT_REPORT_FILTER);
  const [open, setOpen]     = useState(false);
  const [draft, setDraft]   = useState<ReportFilter>(DEFAULT_REPORT_FILTER);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setDraft(filter), [filter]);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const active = filter.preset !== 'all' || filter.category !== 'All';
  const apply  = () => { setFilter(draft); setOpen(false); };
  const reset  = () => { setDraft(DEFAULT_REPORT_FILTER); setFilter(DEFAULT_REPORT_FILTER); setOpen(false); };

  // inRange() expects a RangeFilter (which carries a `source`); reports filter
  // by date only, so supply a neutral source.
  const dateFilter: RangeFilter = { preset: filter.preset, from: filter.from, to: filter.to, source: 'All' };
  const matchesCat = (drug: string) => filter.category === 'All' || drugCategory(drug) === filter.category;

  // ── Filtered datasets ──
  const dispRecords = useMemo(
    () => DISPENSED.filter(d => inRange(d.date, dateFilter) && matchesCat(d.drug)),
    [filter],
  );
  const compRecords = useMemo(
    () => COMPLETED.filter(c => inRange(c.completedDate, dateFilter) && matchesCat(c.drug)),
    [filter],
  );
  const invItems = useMemo(
    () => INVENTORY.filter(i => filter.category === 'All' || i.category === filter.category),
    [filter],
  );
  const poRecords = useMemo(
    () => PURCHASE_ORDERS.filter(p => inRange(p.created, dateFilter)),
    [filter],
  );

  // ── KPIs ──
  const dispensedQty   = dispRecords.reduce((s, d) => s + d.qty, 0);
  const inventoryValue = invItems.reduce((s, i) => s + i.qty * i.price, 0);
  const poValue        = poRecords.reduce((s, p) => s + p.total, 0);
  const billed         = compRecords.reduce((s, c) => s + c.amount, 0);

  // ── Top dispensed categories (by qty) ──
  const topCats = useMemo(() => {
    const map = new Map<string, number>();
    dispRecords.forEach(d => map.set(drugCategory(d.drug), (map.get(drugCategory(d.drug)) ?? 0) + d.qty));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [filter]);
  const maxCat = topCats.length ? Math.max(...topCats.map(c => c[1])) : 1;

  // ── Dispensing-by-day chart (built from the filtered records) ──
  const chart = useMemo(() => {
    const map = new Map<string, number>();
    dispRecords.forEach(d => map.set(d.date, (map.get(d.date) ?? 0) + 1));
    const entries = [...map.entries()]
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-7);
    return {
      data: entries.map(e => e[1]),
      labels: entries.map(e => e[0].replace(/,?\s*\d{4}$/, '')), // "Jun 21, 2026" → "Jun 21"
    };
  }, [filter]);

  // ── Inventory health by category (within the filtered inventory) ──
  const healthCats = Array.from(new Set(invItems.map(i => i.category)));

  // ── Export the analysis of the current filter to Excel ──
  const handleExport = () => {
    const headers = [
      'Category', 'Dispensed Records', 'Dispensed Qty', 'Billed (₹)',
      'Inventory SKUs', 'Inventory Value (₹)',
    ];
    const cats = Array.from(new Set([
      ...dispRecords.map(d => drugCategory(d.drug)),
      ...invItems.map(i => i.category),
    ])).sort();

    const rows = cats.map(cat => {
      const dr = dispRecords.filter(d => drugCategory(d.drug) === cat);
      const iv = invItems.filter(i => i.category === cat);
      const cm = compRecords.filter(c => drugCategory(c.drug) === cat);
      return [
        cat,
        dr.length,
        dr.reduce((s, d) => s + d.qty, 0),
        cm.reduce((s, c) => s + c.amount, 0),
        iv.length,
        Math.round(iv.reduce((s, i) => s + i.qty * i.price, 0)),
      ];
    });

    // TOTAL row summarising the whole selection.
    rows.push([
      'TOTAL', dispRecords.length, dispensedQty, billed, invItems.length, Math.round(inventoryValue),
    ]);

    const tag = `${PRESET_LABEL[filter.preset]}_${filter.category}`.replace(/[^\w]+/g, '-');
    exportToExcel(`Vexoo_Reports_${tag}`, 'Analysis', headers, rows);
  };

  const filterSummary = `${PRESET_LABEL[filter.preset]} · ${filter.category}`;

  return (
    <div className="ph-content ph-fade">
      <div className="ph-section-head">
        <div>
          <div className="ph-section-title">Reports & Analytics</div>
          <div className="ph-section-sub">Dispensing throughput, inventory value & procurement · {filterSummary}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* ── Custom Filter popover ── */}
          <div className="ph-filter-wrap" ref={wrapRef}>
            <button className={`ph-btn-outline ${active ? 'ph-btn-active' : ''}`} onClick={() => setOpen(o => !o)}>
              <SvgIcon path="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" size={16} color="currentColor" />
              Filter{active ? ' ·' : ''}
            </button>

            {open && (
              <div className="ph-filter-pop">
                <div className="ph-filter-group-label">Date range</div>
                <div className="ph-filter-chips">
                  {PRESETS.map(p => (
                    <button key={p.id}
                      className={`ph-filter-chip ${draft.preset === p.id ? 'active' : ''}`}
                      onClick={() => setDraft(d => ({ ...d, preset: p.id }))}>{p.label}</button>
                  ))}
                </div>

                {draft.preset === 'custom' && (
                  <div className="ph-filter-dates">
                    <label>From
                      <input type="date" value={draft.from} onChange={e => setDraft(d => ({ ...d, from: e.target.value }))} />
                    </label>
                    <label>To
                      <input type="date" value={draft.to} onChange={e => setDraft(d => ({ ...d, to: e.target.value }))} />
                    </label>
                  </div>
                )}

                <div className="ph-filter-group-label" style={{ marginTop: 14 }}>Medicine Category</div>
                <div className="ph-filter-chips">
                  {CAT_OPTIONS.map(c => (
                    <button key={c}
                      className={`ph-filter-chip ${draft.category === c ? 'active' : ''}`}
                      onClick={() => setDraft(d => ({ ...d, category: c }))}>{c}</button>
                  ))}
                </div>

                <div className="ph-filter-actions">
                  <button className="ph-btn-text" onClick={reset}>Reset</button>
                  <button className="ph-action-btn" style={{ height: 36, padding: '0 18px' }} onClick={apply}>Apply</button>
                </div>
              </div>
            )}
          </div>

          <button className="ph-btn-outline" onClick={handleExport}>
            <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={16} color="currentColor" /> Export
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }} className="ph-stat-grid-4">
        <div className="ph-stat-card"><div className="ph-stat-label">Dispensed Records</div><div className="ph-stat-value">{dispRecords.length}</div><div className="ph-stat-sub" style={{ color: 'var(--mineral-700)' }}>{dispensedQty} units</div></div>
        <div className="ph-stat-card"><div className="ph-stat-label">Inventory Value</div><div className="ph-stat-value">₹{Math.round(inventoryValue).toLocaleString('en-IN')}</div></div>
        <div className="ph-stat-card"><div className="ph-stat-label">Procurement</div><div className="ph-stat-value">₹{poValue.toLocaleString('en-IN')}</div></div>
        <div className="ph-stat-card"><div className="ph-stat-label">Billed (completed)</div><div className="ph-stat-value">₹{billed.toLocaleString('en-IN')}</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 18 }} className="ph-grid-2-1">
        <div className="ph-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Dispensing by Day</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{filterSummary}</div>
            </div>
            <Badge label={`${dispRecords.length} records`} color="primary" />
          </div>
          {chart.data.length > 0
            ? <BarChart data={chart.data} labels={chart.labels} color="var(--mineral-700)" todayIndex={chart.data.length - 1} />
            : <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No dispensing records for this filter.</div>}
        </div>

        <div className="ph-card">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>Top Dispensed Categories</div>
          {topCats.length > 0 ? topCats.map(([cat, count], i) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500 }}>{cat}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{count}</span>
              </div>
              <div className="ph-progress"><div style={{ width: `${(count / maxCat) * 100}%`, background: CAT_COLORS[i % CAT_COLORS.length] }} /></div>
            </div>
          )) : <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>No data for this filter.</div>}
        </div>
      </div>

      <div className="ph-card">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Inventory Health by Category</div>
        {healthCats.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {healthCats.map(cat => {
              const catItems = invItems.filter(i => i.category === cat);
              const low = catItems.filter(i => i.qty < i.min).length;
              return (
                <div key={cat} style={{ padding: 14, borderRadius: 11, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>{cat}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 24 }}>{catItems.length}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>SKUs</span>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <Badge label={low ? `${low} low` : 'Healthy'} color={low ? 'amber' : 'primary'} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>No inventory in this category.</div>}
      </div>
    </div>
  );
};
