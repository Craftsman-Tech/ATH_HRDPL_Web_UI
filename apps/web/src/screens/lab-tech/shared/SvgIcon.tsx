import React from 'react';

/** Stroke-based 24x24 icon. `d` is the path data; inherits currentColor. */
export function SvgIcon({ path, size = 17 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d={path} />
    </svg>
  );
}
