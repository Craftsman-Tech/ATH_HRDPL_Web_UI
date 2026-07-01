import React from 'react';

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

interface AvatarProps {
  name: string;
  size?: number;
  fs?: number;
  style?: React.CSSProperties;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 40, fs = 14, style }) => (
  <div className="avatar" style={{ width: size, height: size, fontSize: fs, ...style }}>
    {initials(name)}
  </div>
);

export default Avatar;
