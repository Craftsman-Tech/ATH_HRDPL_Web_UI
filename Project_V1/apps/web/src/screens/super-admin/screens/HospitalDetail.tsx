/**
 * HospitalDetail.tsx — read-only view of everything a hospital submitted at
 * registration. Reached by clicking a row in the Hospitals directory.
 */
import React, { useMemo } from 'react';
import { HOSPITALS, buildDetail, stateName } from '../data/mockData';
import { StatusBadge } from '../shared/Badges';
import { RegistrationDetail } from '../shared/RegistrationDetail';

export const HospitalDetail: React.FC<{ hospitalId: string; onBack: () => void }> = ({ hospitalId, onBack }) => {
  const h = HOSPITALS.find(x => x.id === hospitalId);

  const detail = useMemo(
    () => (h ? buildDetail({ name: h.name, regNo: h.regNo, city: h.city, state: h.state, contact: h.admin, email: h.email, phone: '+91 90000 00000', plan: h.plan }) : null),
    [h],
  );

  if (!h || !detail) {
    return (
      <section className="view">
        <div className="placeholder"><h3>Hospital not found</h3><p>This tenant is no longer on the platform.</p></div>
      </section>
    );
  }

  return (
    <RegistrationDetail
      detail={detail}
      mark={h.mark}
      accent={h.accent}
      name={h.name}
      regNo={`${h.id} · ${h.regNo}`}
      status={<StatusBadge status={h.status} />}
      backLabel="All hospitals"
      onBack={onBack}
      note={<><b>Read-only.</b> This is the exact information {h.admin} submitted at registration for {stateName(h.state)}. Live tenants can only be edited from the hospital's own admin portal.</>}
    />
  );
};
