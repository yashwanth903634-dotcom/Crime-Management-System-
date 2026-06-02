import React from 'react';

interface CardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  alert?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, value, icon, alert }) => {
  return (
    <div className={`glass-panel stat-card ${alert ? 'alert' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="stat-title">{title}</div>
          <div className="stat-value">{value}</div>
        </div>
        <div style={{ 
          color: alert ? 'var(--neon-red)' : 'var(--neon-cyan)', 
          opacity: 0.7,
          filter: alert ? 'drop-shadow(0 0 8px var(--neon-red))' : 'drop-shadow(0 0 8px var(--neon-cyan))'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};
