// ============================================================================
//  Inventory.tsx — Reagents, kits, chemicals, glassware and consumables.
// ----------------------------------------------------------------------------
//  • Reads/writes the shared store (lab.inventory) so added items persist
//    across navigation within the session.
//  • "Add Item" is the ONLY way to add stock — opens a modal form.
//  • "Export" downloads the full inventory as an Excel (.xls) workbook.
// ============================================================================
import React, { useState, useMemo } from 'react';
import type { InventoryCategory, InventoryItem, StockState } from '../types/labtech.types';
import { useLab } from '../data/labStore';
import { Chip, stockChip } from '../shared/Chip';
import { Toast } from '../shared/Toast';
import { useToast } from '../hooks/useToast';
import { exportExcel } from '../shared/exportExcel';

const CATEGORIES: ('All' | InventoryCategory)[] = ['All', 'Reagents', 'Test Kits', 'Chemicals', 'Glassware', 'Consumables'];
const ADD_CATEGORIES: InventoryCategory[] = ['Reagents', 'Test Kits', 'Chemicals', 'Glassware', 'Consumables'];

// Short code prefix per category, used to auto-generate the item id.
const PREFIX: Record<InventoryCategory, string> = {
  'Reagents': 'RGT', 'Test Kits': 'KIT', 'Chemicals': 'CHM', 'Glassware': 'GLS', 'Consumables': 'CNS',
};

const TRANSACTIONS = [
  { time: '09:40 AM', item: 'CBC Diluent',    change: '-2 vials', who: 'Kevin Liu' },
  { time: '09:05 AM', item: 'HbA1c Test Kit', change: '-1 kit',   who: 'Maria Das' },
  { time: 'Yesterday',item: 'Lipid Assay Reagent', change: '+20 vials', who: 'Store Inward' },
];

// Derive the stock state badge from stock vs reorder level.
const deriveState = (stock: number, reorder: number): StockState =>
  stock <= 0 ? 'Out' : stock <= reorder ? 'Low' : 'OK';

const blankForm = {
  name: '', category: 'Reagents' as InventoryCategory, batch: '',
  stock: '', unit: 'vials', reorder: '', expiry: '',
};

export const Inventory: React.FC = () => {
  const { toast, msg } = useToast();
  const lab = useLab();
  const [cat, setCat] = useState<'All' | InventoryCategory>('All');
  const [q, setQ] = useState('');
  const [txOpen, setTxOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(blankForm);

  const items = lab.inventory;

  const rows = useMemo(() => items.filter(i =>
    (cat === 'All' || i.category === cat) &&
    (q === '' || i.name.toLowerCase().includes(q.toLowerCase()) || i.id.toLowerCase().includes(q.toLowerCase()))
  ), [items, cat, q]);

  const totalStock = items.reduce((s, i) => s + i.stock, 0);
  const lowCount   = items.filter(i => i.state === 'Low' || i.state === 'Out').length;
  const expCount   = items.filter(i => i.state === 'Expiring').length;
  const STATS = [
    { label: 'Total Items',     val: items.length, cls: 's-neutral' },
    { label: 'Units in Stock',  val: totalStock,   cls: 's-mineral' },
    { label: 'Low / Out',       val: lowCount,     cls: 's-amber' },
    { label: 'Expiry Alerts',   val: expCount,     cls: 's-red' },
  ];

  const exportXls = () => {
    const headers = ['Code', 'Item', 'Category', 'Batch', 'Stock', 'Unit', 'Reorder At', 'Expiry', 'Status'];
    const body = items.map(i => [i.id, i.name, i.category, i.batch, i.stock, i.unit, i.reorder, i.expiry, i.state]);
    const stamp = new Date().toISOString().slice(0, 10);
    exportExcel(`lab-inventory-${stamp}`, headers, body, 'Inventory');
    toast(`Exported ${items.length} inventory items to Excel`);
  };

  const upd = (patch: Partial<typeof form>) => setForm(f => ({ ...f, ...patch }));

  const saveItem = () => {
    if (!form.name.trim()) { toast('Please enter an item name'); return; }
    const stock = Number(form.stock) || 0;
    const reorder = Number(form.reorder) || 0;
    // Auto-generate a unique code: <PREFIX>-<3 digits>.
    const seq = items.filter(i => i.id.startsWith(PREFIX[form.category])).length + 1;
    const id = `${PREFIX[form.category]}-${String(100 + seq).padStart(3, '0')}`;
    const item: InventoryItem = {
      id, name: form.name.trim(), category: form.category, batch: form.batch.trim() || '—',
      stock, unit: form.unit.trim() || 'pcs', reorder, expiry: form.expiry.trim() || '—',
      state: deriveState(stock, reorder),
    };
    lab.addInventory(item);
    toast(`Added ${item.name} (${item.id})`);
    setForm(blankForm);
    setAddOpen(false);
  };

  return (
    <div className="lt-scroll lt-fade">
      <div className="lt-content">
        <div className="lt-stat-row">
          {STATS.map(s => (
            <div key={s.label} className={`lt-stat-card ${s.cls}`}>
              <div className="lt-stat-label">{s.label}</div>
              <div className="lt-stat-value">{s.val}</div>
            </div>
          ))}
        </div>

        <div className="lt-section-head">
          <div className="lt-tabs" style={{ marginBottom: 0, border: 'none' }}>
            {CATEGORIES.map(c => (
              <button key={c} className={`lt-tab ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="lt-head-actions">
            <button className="lt-btn-secondary" onClick={() => setTxOpen(true)}>Stock Transactions</button>
            <button className="lt-btn-secondary" onClick={exportXls}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            <button className="lt-btn-primary" onClick={() => setAddOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Item
            </button>
          </div>
        </div>

        <div className="lt-filters" style={{ marginTop: -6 }}>
          <div className="lt-filter-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="lt-filter-search" placeholder="Search item or code…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>

        <div className="lt-card pad0">
          <table className="lt-table">
            <thead>
              <tr>
                <th className="lt-th">Code</th><th className="lt-th">Item</th><th className="lt-th">Category</th>
                <th className="lt-th">Batch</th><th className="lt-th">Stock</th><th className="lt-th">Reorder At</th>
                <th className="lt-th">Expiry</th><th className="lt-th">Status</th>
                <th className="lt-th" style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td className="lt-td" colSpan={9}><div className="lt-empty">No items in this category.</div></td></tr>}
              {rows.map(i => (
                <tr key={i.id} className="lt-tr">
                  <td className="lt-td"><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{i.id}</span></td>
                  <td className="lt-td" style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{i.name}</td>
                  <td className="lt-td">{i.category}</td>
                  <td className="lt-td"><span style={{ fontFamily: 'monospace' }}>{i.batch}</span></td>
                  <td className="lt-td">{i.stock} {i.unit}</td>
                  <td className="lt-td">{i.reorder}</td>
                  <td className="lt-td">{i.expiry}</td>
                  <td className="lt-td"><Chip {...stockChip(i.state)} /></td>
                  <td className="lt-td" style={{ textAlign: 'right' }}>
                    <button className="lt-btn-outline" onClick={() => toast(`Reorder raised for ${i.name}`)}>Reorder</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {addOpen && (
        <div className="lt-modal-backdrop" onClick={() => setAddOpen(false)}>
          <div className="lt-modal" onClick={e => e.stopPropagation()}>
            <div className="lt-modal-header">
              <div className="lt-modal-title">Add Inventory Item</div>
              <button className="lt-modal-close" onClick={() => setAddOpen(false)}>✕</button>
            </div>
            <div className="lt-modal-body">
              <div className="lt-form-group">
                <label className="lt-field-label">Item Name</label>
                <input className="lt-field-input" value={form.name} onChange={e => upd({ name: e.target.value })} placeholder="e.g. CBC Diluent" />
              </div>
              <div className="lt-form-row">
                <div className="lt-form-group">
                  <label className="lt-field-label">Category</label>
                  <select className="lt-field-select" value={form.category} onChange={e => upd({ category: e.target.value as InventoryCategory })}>
                    {ADD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="lt-form-group">
                  <label className="lt-field-label">Batch No.</label>
                  <input className="lt-field-input" value={form.batch} onChange={e => upd({ batch: e.target.value })} placeholder="e.g. B-2291" />
                </div>
              </div>
              <div className="lt-form-row">
                <div className="lt-form-group">
                  <label className="lt-field-label">Stock Quantity</label>
                  <input className="lt-field-input" type="number" min="0" value={form.stock} onChange={e => upd({ stock: e.target.value })} placeholder="0" />
                </div>
                <div className="lt-form-group">
                  <label className="lt-field-label">Unit</label>
                  <input className="lt-field-input" value={form.unit} onChange={e => upd({ unit: e.target.value })} placeholder="vials / kits / litres / pcs" />
                </div>
              </div>
              <div className="lt-form-row">
                <div className="lt-form-group">
                  <label className="lt-field-label">Reorder At</label>
                  <input className="lt-field-input" type="number" min="0" value={form.reorder} onChange={e => upd({ reorder: e.target.value })} placeholder="0" />
                </div>
                <div className="lt-form-group">
                  <label className="lt-field-label">Expiry Date</label>
                  <input className="lt-field-input" value={form.expiry} onChange={e => upd({ expiry: e.target.value })} placeholder="e.g. 12 Sep 2026 or —" />
                </div>
              </div>
            </div>
            <div className="lt-modal-footer">
              <button className="lt-btn-secondary" onClick={() => setAddOpen(false)}>Cancel</button>
              <button className="lt-btn-primary" onClick={saveItem}>Add Item</button>
            </div>
          </div>
        </div>
      )}

      {txOpen && (
        <div className="lt-modal-backdrop" onClick={() => setTxOpen(false)}>
          <div className="lt-modal" onClick={e => e.stopPropagation()}>
            <div className="lt-modal-header">
              <div className="lt-modal-title">Stock Transactions</div>
              <button className="lt-modal-close" onClick={() => setTxOpen(false)}>✕</button>
            </div>
            <div className="lt-modal-body">
              {TRANSACTIONS.map((t, i) => (
                <div className="lt-feed-row" key={i}>
                  <div style={{ minWidth: 0 }}>
                    <div className="lt-feed-title">{t.item} <span style={{ color: t.change.startsWith('+') ? 'var(--mineral-700)' : 'var(--rose)' }}>{t.change}</span></div>
                    <div className="lt-feed-sub">{t.who}</div>
                  </div>
                  <div className="lt-feed-time">{t.time}</div>
                </div>
              ))}
            </div>
            <div className="lt-modal-footer">
              <button className="lt-btn-secondary" onClick={() => setTxOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      <Toast msg={msg} />
    </div>
  );
};
