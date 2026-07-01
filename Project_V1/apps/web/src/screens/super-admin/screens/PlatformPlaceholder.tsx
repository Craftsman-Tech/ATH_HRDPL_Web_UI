/**
 * PlatformPlaceholder.tsx — graceful "coming soon" panel for the Platform nav
 * group (Modules / Billing & plans / Settings), which are present in the
 * reference design as navigation entries without a dedicated build-out yet.
 */
import React from 'react';
import { Icon } from '../shared/Icons';
import type { PlatformView } from '../types/admin.types';

const COPY: Record<PlatformView, { title: string; body: string; I: React.FC<{ size?: number }> }> = {
  analytics: { title: 'Analytics', body: 'Platform intelligence — adoption, engagement, operations and revenue across all tenants.', I: Icon.Analytics },
  billing:  { title: 'Billing & plans', body: 'Plan tiers, invoices and payment methods across all tenants will live here.', I: Icon.Billing },
  settings: { title: 'Settings', body: 'Platform-wide configuration: branding, security policy, data-retention and integrations.', I: Icon.Settings },
};

export const PlatformPlaceholder: React.FC<{ view: PlatformView }> = ({ view }) => {
  const { title, body, I } = COPY[view];
  return (
    <section className="view">
      <div className="placeholder">
        <div className="ph-icon"><I size={24} /></div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </section>
  );
};
