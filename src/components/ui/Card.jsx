import React from 'react';
import './ui.css';

export function Card({ title, value, subtitle, icon, highlightColor = 'var(--primary)', className = '' }) {
  return (
    <div className={`card ${className}`} style={{ borderLeft: `4px solid ${highlightColor}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="card-title">{title}</h3>
        {icon && <div style={{ color: highlightColor }}>{icon}</div>}
      </div>
      <div className="card-value">{value}</div>
      {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
  );
}
