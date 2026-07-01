import React, { useEffect, useMemo, useState } from 'react';
import type { InventoryItem, StockStatus } from '../types/pharmacist.types';
import { Th, Td, Badge, SvgIcon, statusColor } from '../shared/PhHelpers';
import { SearchSelect } from '../shared/SearchSelect';
import { exportToExcel } from '../shared/exportXlsx';
import { INVENTORY, MEDICINE_CATALOG, CATEGORIES } from '../data/mockPharmData';

const isExpiring = (e: string) => /Jul 2026|Sep 2026/.test(e);

function stockStatus(i: InventoryItem): StockStatus {
  if (i.qty === 0)     return 'Out of Stock';
  if (i.qty < i.min)   return 'Low Stock';
  if (isExpiring(i.expiry)) return 'Expiring';
  return 'In Stock';
}

const FILTERS: (StockStatus | 'All')[] = ['All', 'In Stock', 'Low Stock', 'Out of Stock', 'Expiring'];

// Every catalogue entry is a legal medicine → all appear in the Add dropdown.
const MED_NAMES = MEDICINE_CATALOG.map(m => m.name);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Convert an <input type="month"> value "2026-12" → "Dec 2026".
function fmtMonth(v: string): string {
  if (!v) return '—';
  const [y, m] = v.split('-');
  const idx = parseInt(m, 10) - 1;
  return idx >= 0 && idx < 12 ? `${MONTHS[idx]} ${y}` : v;
}

interface StagedItem { sku: string; name: string; category: string; qty: number; expiry: string; unit: string; price: number; }

export const Inventory: React.FC<{ initialFilter?: string }> = ({ initialFilter }) => {
  const [items, setItems]   = useState<InventoryItem[]>(INVENTORY);
  const [filter, setFilter] = useState<StockStatus | 'All'>('All');
  const [query, setQuery]   = useState('');

  // ── Add Medicine form ──
  const [showForm, setShowForm] = useState(false);
  const [staged, setStaged]     = useState<StagedItem[]>([]);
  const [sku, setSku]       = useState('');
  const [medSel, setMedSel] = useState<string[]>([]);
  const [catSel, setCatSel] = useState<string[]>([]);
  const [stock, setStock]   = useState('');
  const [expiry, setExpiry] = useState('');

  // Deep-link from dashboard critical-alert cards
  useEffect(() => {
    if (initialFilter && FILTERS.includes(initialFilter as StockStatus)) {
      setFilter(initialFilter as StockStatus);
    }
  }, [initialFilter]);

  const nextSku = (extra = 0) => {
    const ids = [...items.map(i => i.id), ...staged.map(s => s.sku)];
    const nums = ids.map(v => parseInt(v.replace(/\D/g, ''), 10)).filter(n => !Number.isNaN(n));
    const n = (nums.length ? Math.max(...nums) : 0) + 1 + extra;
    return `S-${String(n).padStart(3, '0')}`;
  };

  const view = useMemo(() => items.filter(i => {
    const matchesFilter =
      filter === 'All'      ? true :
      filter === 'Expiring' ? isExpiring(i.expiry) :
      stockStatus(i) === filter;
    const matchesQuery =
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.category.toLowerCase().includes(query.toLowerCase()) ||
      i.id.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  }), [items, filter, query]);

  const counts = {
    low: items.filter(i => i.qty > 0 && i.qty < i.min).length,
    out: items.filter(i => i.qty === 0).length,
    exp: items.filter(i => isExpiring(i.expiry)).length,
  };

  const openForm = () => {
    setStaged([]); setSku(nextSku()); setMedSel([]); setCatSel([]); setStock(''); setExpiry('');
    setShowForm(true);
  };

  // When a medicine is picked, auto-fill its category & unit from the catalogue.
  const onPickMed = (next: string[]) => {
    setMedSel(next);
    const cat = MEDICINE_CATALOG.find(m => m.name === next[0])?.category;
    if (cat) setCatSel([cat]);
  };

  const canAdd = sku.trim() !== '' && medSel.length > 0 && catSel.length > 0 && parseInt(stock || '0', 10) > 0;

  const addStaged = () => {
    if (!canAdd) return;
    const cat = MEDICINE_CATALOG.find(m => m.name === medSel[0]);
    setStaged(s => [...s, {
      sku: sku.trim(), name: medSel[0], category: catSel[0],
      qty: parseInt(stock, 10), expiry: fmtMonth(expiry),
      unit: cat?.unit ?? 'tabs', price: cat?.price ?? 0,
    }]);
    // Reset entry fields for the next medicine, auto-advance the SKU.
    setSku(nextSku(1)); setMedSel([]); setCatSel([]); setStock(''); setExpiry('');
  };

  const removeStaged = (idx: number) => setStaged(s => s.filter((_, i) => i !== idx));

  // Export the full inventory — every medicine with its live status — to Excel.
  const handleExport = () => {
    const headers = [
      'SKU', 'Medicine', 'Category', 'Stock', 'Min', 'Unit',
      'Status', 'Expiry', 'Batch', 'Price (₹)', 'Stock Value (₹)', 'Supplier', 'Reorder Qty',
    ];
    const rows = items.map(i => [
      i.id, i.name, i.category, i.qty, i.min, i.unit,
      stockStatus(i), i.expiry, i.batch, i.price,
      Math.round(i.qty * i.price), i.supplier, i.reorderQty,
    ]);
    exportToExcel('Vexoo_Inventory_Status', 'Inventory', headers, rows);
  };

  const updateInventory = () => {
    const newItems: InventoryItem[] = staged.map(s => {
      const min = Math.max(20, Math.round(s.qty * 0.2));
      return {
        id: s.sku, name: s.name, category: s.category, qty: s.qty,
        min, max: Math.max(s.qty, min * 5), unit: s.unit, expiry: s.expiry,
        supplier: '—', reorderQty: min * 2,
        batch: `B-${7600 + items.length + Math.floor(Math.random() * 90)}`, price: s.price,
      };
    });
    setItems(prev => [...newItems, ...prev]);
    setStaged([]); setShowForm(false);
  };

  return (
    <div className="ph-content ph-fade">
      <div className="ph-section-head">
        <div>
          <div className="ph-section-title">Inventory</div>
          <div className="ph-section-sub">{items.length} medicines tracked · {counts.low} low · {counts.out} out of stock</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="ph-btn-outline" onClick={handleExport}>
            <SvgIcon path="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" size={16} color="currentColor" /> Export
          </button>
          <button className="ph-action-btn" onClick={openForm}>
            <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={16} color="white" /> Add Medicine
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }} className="ph-stat-grid-4">
        <div className="ph-stat-card"><div className="ph-stat-label">Total SKUs</div><div className="ph-stat-value">{items.length}</div></div>
        <div className="ph-stat-card s-amber"><div className="ph-stat-label">Low Stock</div><div className="ph-stat-value">{counts.low}</div></div>
        <div className="ph-stat-card s-rose"><div className="ph-stat-label">Out of Stock</div><div className="ph-stat-value">{counts.out}</div></div>
        <div className="ph-stat-card s-blue"><div className="ph-stat-label">Expiring Soon</div><div className="ph-stat-value">{counts.exp}</div></div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div className="ph-search-input-wrap" style={{ maxWidth: 360 }}>
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" size={15} color="var(--text-muted)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search medicine, category, or SKU..." />
        </div>
        <div className="ph-tabs">
          {FILTERS.map(f => <button key={f} className={`ph-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}
        </div>
      </div>

      <div className="ph-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="ph-table-wrap">
          <table className="ph-table">
            <thead><tr>{['SKU', 'Medicine', 'Category', 'Stock Level', 'Expiry', 'Status', 'Action'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {view.map(i => {
                const st = stockStatus(i);
                const pct = Math.min(100, Math.round((i.qty / i.max) * 100));
                const barColor = i.qty === 0 ? 'var(--rose)' : i.qty < i.min ? 'var(--amber)' : 'var(--mineral-700)';
                return (
                  <tr key={i.id} className="ph-tr">
                    <Td><span className="ph-id">{i.id}</span></Td>
                    <Td><div style={{ fontWeight: 600 }}>{i.name}</div><div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Batch {i.batch} · ₹{i.price}/{i.unit.slice(0, -1)}</div></Td>
                    <Td style={{ fontSize: 12.5 }}>{i.category}</Td>
                    <Td style={{ minWidth: 150 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                        <span style={{ fontWeight: 600 }}>{i.qty} {i.unit}</span>
                        <span style={{ color: 'var(--text-muted)' }}>min {i.min}</span>
                      </div>
                      <div className="ph-progress"><div style={{ width: `${pct}%`, background: barColor }} /></div>
                    </Td>
                    <Td style={{ fontSize: 12.5 }}>{i.expiry}</Td>
                    <Td><Badge label={st} color={statusColor(st)} /></Td>
                    <Td>
                      {i.qty < i.min
                        ? <button className="ph-btn-outline" style={{ height: 34, padding: '0 14px', fontSize: 12.5 }}>Reorder {i.reorderQty}</button>
                        : <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>—</span>}
                    </Td>
                  </tr>
                );
              })}
              {view.length === 0 && (
                <tr><td className="ph-td" colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No medicines match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Medicine form ── */}
      {showForm && (
        <div className="ph-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="ph-modal ph-modal-wide" onClick={e => e.stopPropagation()}>
            <div className="ph-modal-head">
              <div>
                <div className="ph-modal-title">Add Medicine to Inventory</div>
                <div className="ph-modal-sub">Add one medicine at a time, then commit them all with “Update Inventory”.</div>
              </div>
              <button className="ph-modal-x" onClick={() => setShowForm(false)}>×</button>
            </div>

            <div className="ph-modal-body">
              <div className="ph-form-grid ph-form-grid-2">
                <div className="ph-field">
                  <label>SKU Number<span className="ph-req">*</span></label>
                  <input value={sku} onChange={e => setSku(e.target.value)} className="ph-input ph-input-mono" placeholder="S-009" />
                </div>
                <div className="ph-field">
                  <label>Medicine<span className="ph-req">*</span> <span className="ph-hint">(legal medicines)</span></label>
                  <SearchSelect options={MED_NAMES} value={medSel} onChange={onPickMed} placeholder="Type to search medicine…" />
                </div>
                <div className="ph-field">
                  <label>Category<span className="ph-req">*</span></label>
                  <SearchSelect options={CATEGORIES} value={catSel} onChange={setCatSel} placeholder="Select category…" />
                </div>
                <div className="ph-field">
                  <label>Stock Level<span className="ph-req">*</span></label>
                  <input type="number" min={1} value={stock} onChange={e => setStock(e.target.value)} className="ph-input" placeholder="e.g. 500" />
                </div>
                <div className="ph-field">
                  <label>Expiry Date</label>
                  <input type="month" value={expiry} onChange={e => setExpiry(e.target.value)} className="ph-input" />
                </div>
                <div className="ph-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button className="ph-action-btn" style={{ width: '100%' }} disabled={!canAdd} onClick={addStaged}>
                    <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={16} color="white" /> Add
                  </button>
                </div>
              </div>

              {staged.length > 0 && (
                <div className="ph-staged">
                  <div className="ph-staged-head">{staged.length} medicine{staged.length > 1 ? 's' : ''} ready to add</div>
                  <table className="ph-table" style={{ marginTop: 4 }}>
                    <thead><tr>{['SKU', 'Medicine', 'Category', 'Stock', 'Expiry', ''].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
                    <tbody>
                      {staged.map((s, idx) => (
                        <tr key={`${s.sku}-${idx}`} className="ph-tr">
                          <Td><span className="ph-id">{s.sku}</span></Td>
                          <Td style={{ fontWeight: 600 }}>{s.name}</Td>
                          <Td style={{ fontSize: 12.5 }}>{s.category}</Td>
                          <Td style={{ fontSize: 12.5 }}>{s.qty} {s.unit}</Td>
                          <Td style={{ fontSize: 12.5 }}>{s.expiry}</Td>
                          <Td><button className="ph-chip-x ph-chip-x-lg" onClick={() => removeStaged(idx)} aria-label="Remove">×</button></Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="ph-modal-foot">
              <button className="ph-btn-text" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="ph-action-btn" disabled={staged.length === 0} style={{ opacity: staged.length === 0 ? 0.5 : 1 }} onClick={updateInventory}>
                Update Inventory ({staged.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
