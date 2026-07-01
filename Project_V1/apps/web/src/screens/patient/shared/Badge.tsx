import React from 'react';

interface BadgeProps { text: string; color: string; bg: string; dot?: boolean; }

const Badge: React.FC<BadgeProps> = ({ text, color, bg, dot }) => (
  <span className="badge" style={{ color, background: bg }}>
    {dot && <span className="badge-dot" style={{ background: color }} />}
    {text}
  </span>
);

export default Badge;
