import React from 'react';
import Icon from './Icon';

interface SecHeadProps {
  icon: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}

const SecHead: React.FC<SecHeadProps> = ({ icon, title, sub, right }) => (
  <div className="sec-head">
    <div className="sec-head-l">
      <div className="sec-ic"><Icon name={icon} size={18} /></div>
      <div>
        <div className="sec-title">{title}</div>
        {sub && <div className="sec-sub">{sub}</div>}
      </div>
    </div>
    {right}
  </div>
);

export default SecHead;
