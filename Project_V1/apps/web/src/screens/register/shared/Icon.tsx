/**
 * Icon.tsx — minimal stroke-path icon used across the registration components.
 * Keeps the feature dependency-free (no icon library import).
 */
import React from 'react';

export const Icon: React.FC<{ d: string; size?: number; sw?: number }> = ({
  d,
  size = 16,
  sw = 2,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);
