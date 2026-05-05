import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, PackageMinus, PlusSquare, Layers, Settings, FileText, Home, BookLock, ShieldCheck, Users } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="layout-sidebar">
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-light)' }}>
        <ShieldCheck size={32} />
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Governança</span>
      </div>

      <nav style={{ padding: '1rem 0', flex: 1, overflowY: 'auto' }}>
        <SidebarItem to="/home" icon={<Home size={20} />} label="Home" />
        <SidebarItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        
        {/* Ativos group */}
        <div style={{ padding: '0.5rem 1.5rem', marginTop: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
          Ativos
        </div>
        <SidebarItem to="/ativos/consultar" icon={<PackageSearch size={20} />} label="Consultar Ativos" />
        <SidebarItem to="/ativos/painel-descarte" icon={<PackageMinus size={20} />} label="Painel de Descarte" />
        <SidebarItem to="/ativos/cadastrar" icon={<PlusSquare size={20} />} label="Cadastrar Ativo" />
        <SidebarItem to="/fornecedores" icon={<Users size={20} />} label="Gestão de Fornecedores" />
        <SidebarItem to="/ativos/lote" icon={<Layers size={20} />} label="Alteração em Lote" />

        {/* Outros */}
        <div style={{ padding: '0.5rem 1.5rem', marginTop: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
          Sistema
        </div>
        <SidebarItem to="/cadastros" icon={<FileText size={20} />} label="Cadastros" />
        <SidebarItem to="/relatorios" icon={<FileText size={20} />} label="Relatórios" />
        <SidebarItem to="/termos" icon={<BookLock size={20} />} label="Termos" />
        <SidebarItem to="/configuracoes" icon={<Settings size={20} />} label="Configurações" />
      </nav>
    </aside>
  );
}

function SidebarItem({ to, icon, label }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.5rem',
        color: isActive ? 'var(--primary)' : 'var(--text-dark)',
        backgroundColor: isActive ? 'rgba(23, 105, 170, 0.05)' : 'transparent',
        borderRight: isActive ? '3px solid var(--primary)' : '3px solid transparent',
        fontWeight: isActive ? 600 : 500,
        textDecoration: 'none',
        transition: 'all 0.2s'
      })}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
