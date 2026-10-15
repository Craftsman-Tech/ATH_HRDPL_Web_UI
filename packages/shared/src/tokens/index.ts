/**
 * Token barrel export — lets screens do:
 *   import { colors, spacing, fontSize } from '@vexoo/shared/tokens';
 * instead of three separate import lines.
 */
export * from './colors';
export * from './typography';
export * from './spacing';
// Customer-facing products (Customer web + mobile) use a separate palette from
// the clinic-ops portals. Both live here so tokens stay in one place.
export * from './mineral';
