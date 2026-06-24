import React, { useMemo, useState } from 'react';
import { Badge, SvgIcon, initials } from '../shared/PhHelpers';
import { SUPPLIERS } from '../data/mockPharmData';

export const Suppliers: React.FC = () => {
  const [query, setQuery] = useState('');

  const view = useMemo(() => SUPPLIERS.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase()) ||
    s.contact.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  return (
    <div className="ph-content ph-fade">
      <div className="ph-section-head">
        <div>
          <div className="ph-section-title">Suppliers</div>
          <div className="ph-section-sub">{SUPPLIERS.filter(s => s.status === 'Active').length} active suppliers</div>
        </div>
        <button className="ph-action-btn">
          <SvgIcon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={16} color="white" /> Add Supplier
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div className="ph-search-input-wrap" style={{ maxWidth: 360 }}>
          <SvgIcon path="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" size={15} color="var(--text-muted)" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search supplier, category, or contact..." />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }} className="ph-grid-4col">
        {view.map(s => (
          <div key={s.id} className="ph-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>{initials(s.name)}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{s.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{s.category} · {s.id}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 12.5, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Contact</span><span style={{ fontWeight: 500 }}>{s.contact}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Phone</span><span className="ph-id">{s.phone}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Email</span><span style={{ fontWeight: 500 }}>{s.email}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Active orders</span><span style={{ fontWeight: 600 }}>{s.activeOrders}</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <SvgIcon path="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" size={15} color="#C68A1F" />
                <span style={{ fontWeight: 600, fontSize: 13 }}>{s.rating}</span>
              </div>
              <Badge label={s.status} color={s.status === 'Active' ? 'primary' : 'gray'} />
            </div>
          </div>
        ))}
        {view.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No suppliers found.</div>
        )}
      </div>
    </div>
  );
};
