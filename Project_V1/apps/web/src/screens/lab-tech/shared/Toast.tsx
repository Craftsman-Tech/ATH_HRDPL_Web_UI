import React from 'react';

/** Floating confirmation toast. Render once per screen; pass the message string. */
export const Toast: React.FC<{ msg: string | null }> = ({ msg }) =>
  msg ? <div className="lt-toast">{msg}</div> : null;
