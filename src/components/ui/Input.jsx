import React from 'react';
import './ui.css';

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  id,
  className = ''
}) {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? 'input-error' : ''}`}
      />
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}
