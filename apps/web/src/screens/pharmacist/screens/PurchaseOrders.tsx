import React, { useMemo, useState } from 'react';
import type { POStatus } from '../types/pharmacist.types';
import { Th, Td, Badge, SvgIcon, statusColor } from '../shared/PhHelpers';
import { PURCHASE_ORDERS } from '../data/mockPharmData';

const FILTERS: (POStatus | 'All')[] = ['All', 'Draft', 'Pending', 'Approved', 'Received', 'Cancelled'];

export const PurchaseOrders: React.FC = () => {
  const [filter, setFilter] = useState<POStatus | 'All'>('All');
  const [query, setQuery]   = useState('');

  const view = useMemo(() => PURCHASE_ORDERS.filter(po =>
    (filter === 'All' || po.status === filter) &&
    (po.supplier.toLowerCase().includes(query.toLowerCase()) ||
     po.id.toLowerCase().includes(query.toLowerCase()))
  ), [filter, query]);

  const pendingValue = PURCHASE_ORDERS.filter(p => p.status === 'Pending' || p.status === 'Approved').reduce((s, p) => s + p.total, 0);

  return (
    <div className="ph-content ph-fade">
      <div className="ph-section-head">
        <div>
          <div className="ph-section-title">Purchase Orders</div>
          <div className="ph-section-sub">{PURCHASE_ORDERS.length} orders · ₹{pendingValue.toLocaleString('en-IN')} in flight</div>
        </div>
        <button className="ph-action-btn">
          <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={16} color="white" /> Create Purchase Order
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }} className="ph-stat-grid-4">
        <div className="ph-stat-card"><div className="ph-stat-label">Total Orders</div><div className="ph-stat-value">{PURCHASE_ORDERS.length}</div></div>
        <div className="ph-stat-card s-amber"><div className="ph-stat-label">Pending Approval</div><div className="ph-stat-value">{PURCHASE_ORDERS.filter(p => p.status === 'Pending').length}</div></div>
        <div className="ph-stat-card s-mineral"><div className="ph-stat-label">Approved</div><div className="ph-stat-value">{PURCHASE_ORDERS.filter(p => p.status === 'Approved').length}</div></div>
        <div className="ph-stat-card s-blue"><div className="ph-stat-label">Received</div><div className="ph-stat-value">{PURCHASE_ORDERS.filter(p => p.status === 'Received').length}</div></div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div className="ph-search-input-wrap" style={{ maxWidth: 360 }}>
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" size={15} color="var(--text-muted)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search PO number or supplier..." />
        </div>
        <div className="ph-tabs">
          {FILTERS.map(f => <button key={f} className={`ph-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}
        </div>
      </div>

      <div className="ph-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="ph-table-wrap">
          <table className="ph-table">
            <thead><tr>{['PO Number', 'Supplier', 'Items', 'Total', 'Created', 'Expected', 'Status', 'Action'].map(h => <Th key={h}>{h}</Th>)}</tr></thead>
            <tbody>
              {view.map(po => (
                <tr key={po.id} className="ph-tr">
                  <Td><span className="ph-id">{po.id}</span></Td>
                  <Td style={{ fontWeight: 600 }}>{po.supplier}</Td>
                  <Td style={{ fontSize: 12.5 }}>{po.items} items</Td>
                  <Td style={{ fontWeight: 600 }}>₹{po.total.toLocaleString('en-IN')}</Td>
                  <Td style={{ fontSize: 12.5 }}>{po.created}</Td>
                  <Td style={{ fontSize: 12.5 }}>{po.expected}</Td>
                  <Td><Badge label={po.status} color={statusColor(po.status)} /></Td>
                  <Td>
                    {po.status === 'Pending'
                      ? <button className="ph-btn-outline" style={{ height: 34, padding: '0 14px', fontSize: 12.5 }}>Approve</button>
                      : po.status === 'Approved'
                        ? <button className="ph-btn-outline" style={{ height: 34, padding: '0 14px', fontSize: 12.5 }}>Mark Received</button>
                        : <button className="ph-btn-outline" style={{ height: 34, padding: '0 14px', fontSize: 12.5 }}>View</button>}
                  </Td>
                </tr>
              ))}
              {view.length === 0 && (
                <tr><td className="ph-td" colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No purchase orders match this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
