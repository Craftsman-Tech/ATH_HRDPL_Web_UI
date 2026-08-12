/**
 * @vexoo/shared/customer — the customer-facing domain.
 *
 *   import { MOCK_STATS, type Stat } from '@vexoo/shared/customer';
 *
 * Deliberately NOT re-exported from the package root. The clinic-ops domain in
 * ../types already exports a `Notification`, and merging the two barrels would
 * silently shadow one of them. Clinic-ops and customer are separate products
 * that happen to share a repo — keep their contracts separate too.
 *
 * These types and fixtures are pure TypeScript with no React, DOM or React
 * Native imports, so the customer web portal and the mobile app can both
 * consume them unchanged.
 */
export * from './types';
export * from './data/mockAppointments';
export * from './data/mockBilling';
export * from './data/mockDashboard';
export * from './data/mockFamily';
export * from './data/mockHospitals';
export * from './data/mockLabResults';
export * from './data/mockMedications';
export * from './data/mockMessages';
export * from './data/mockNav';
export * from './data/mockRecords';
