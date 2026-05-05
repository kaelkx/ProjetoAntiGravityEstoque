import React, { useState, useEffect } from 'react';
import { Clock, UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) {
      handleLogout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <header className="layout-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft < 300 ? 'var(--danger)' : 'var(--text-muted)' }}>
        <Clock size={20} />
        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
          Sessão: {formatTime(timeLeft)}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
          <UserCircle size={24} color="var(--primary)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Admin TI</span>
        </div>
        <button 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600 }}
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </header>
  );
}
