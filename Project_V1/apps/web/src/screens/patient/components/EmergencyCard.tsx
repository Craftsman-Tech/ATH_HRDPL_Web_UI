import React from 'react';
import Icon from '../shared/Icon';

interface EmergencyCardProps {
  name: string;
  blood: string;
  allergies: string;
  conditions: string;
  contact: string;
  onCall: () => void;
}

const EmergencyCard: React.FC<EmergencyCardProps> = ({ name, blood, allergies, conditions, contact, onCall }) => (
  <div className="emerg">
    <div className="emerg-head">
      <div>
        <div className="emerg-label"><Icon name="alert" size={13} />Emergency Card</div>
        <div className="emerg-name">{name}</div>
      </div>
      <div className="emerg-blood">{blood}</div>
    </div>
    <div className="emerg-grid">
      <div className="emerg-field"><span className="ef-k">Allergies</span><span className="ef-v">{allergies}</span></div>
      <div className="emerg-field"><span className="ef-k">Conditions</span><span className="ef-v">{conditions}</span></div>
      <div className="emerg-field"><span className="ef-k">Emergency Contact</span><span className="ef-v">{contact}</span></div>
    </div>
    <div className="emerg-foot">
      <div className="emerg-qr"><Icon name="print" size={30} /></div>
      <div className="emerg-qr-text">
        <div className="eq-title">Scan for full medical ID</div>
        <div className="eq-sub">First responders can access critical info offline.</div>
      </div>
      <button className="emerg-btn" onClick={onCall}><Icon name="phone" size={14} />Call</button>
    </div>
  </div>
);

export default EmergencyCard;
