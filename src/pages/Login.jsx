import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import './Login.css';

export function Login() {
  const [email, setEmail] = useState('admin@empresa.com.br');
  const [password, setPassword] = useState('admin123');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Mock login sucess
      localStorage.setItem('auth_token', 'mock_token_123');
      navigate('/home');
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card">
        <div className="login-header">
          <ShieldCheck size={56} className="login-logo" />
          <h1 className="login-title">Portal de Governança</h1>
          <p className="login-subtitle">Gestão de Ativos Corporativos</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <Input
            id="email"
            label="E-mail"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          
          <Input
            id="password"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <div className="login-actions">
            <Button type="submit" fullWidth>
              Acessar Portal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
