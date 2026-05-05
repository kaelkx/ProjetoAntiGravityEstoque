import React from 'react';
import './ui.css';

export function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  fullWidth = false,
  className = ''
}) {
  const baseClass = 'btn';
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const widthClass = fullWidth ? 'btn-full' : '';
  
  return (
    <button 
      type={type} 
      className={`${baseClass} ${variantClass} ${widthClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
