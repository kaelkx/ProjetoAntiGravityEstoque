import React from 'react';
import { Search, TrendingUp, TrendingDown, Minus, DollarSign, PackageMinus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import './Home.css';

const mockBarData = [
  { name: 'Conta A', qty: 120 },
  { name: 'Conta B', qty: 98 },
  { name: 'Conta C', qty: 86 },
  { name: 'Conta D', qty: 54 },
  { name: 'Conta E', qty: 32 },
];

const mockPieData = [
  { name: 'TI', value: 45000 },
  { name: 'Comercial', value: 25000 },
  { name: 'RH', value: 15000 },
  { name: 'Operações', value: 35000 },
];

const BLUE_PALETTE = ['#1769aa', '#1e88e5', '#42a5f5', '#90caf9'];
// Amarelo para destaque apenas se necessário, mas vou focar em tons de azul conforme orientação

export function Home() {
  return (
    <div className="home-container">
      
      {/* Top Header - Busca e Filtros */}
      <div className="home-header-row">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Realize sua pesquisa aqui"
          />
        </div>
        
        <div className="filters-box">
          <input type="date" className="filter-input" aria-label="Data Inicial" />
          <span>a</span>
          <input type="date" className="filter-input" aria-label="Data Final" />
        </div>
      </div>

      {/* Cards de Indicadores */}
      <div className="cards-grid">
        <Card 
          title="Valor Total de Ativos no Período" 
          value="R$ 1.250.400,00" 
          icon={<DollarSign size={24} />}
          subtitle={
            <div className="indicator positive">
              <TrendingUp size={16} /> +12.5% em relação ao mês anterior
            </div>
          }
        />
        
        <Card 
          title="Quantidade de Ativos Baixados" 
          value="45" 
          icon={<PackageMinus size={24} />}
          highlightColor="#ef4444"
          subtitle={
            <div className="indicator negative">
              <TrendingDown size={16} /> -3.2% em relação ao mês anterior
            </div>
          }
        />

        <Card 
          title="Valor Total de Ativos Baixados" 
          value="R$ 48.500,00" 
          icon={<DollarSign size={24} />}
          highlightColor="#f59e0b"
          subtitle={
            <div className="indicator neutral">
              <Minus size={16} /> Sem alteração significativa
            </div>
          }
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Gráfico 1 - Centro de Custo */}
        <div className="chart-card">
          <h3 className="chart-title">Valor de Ativos por Centro de Custo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mockPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BLUE_PALETTE[index % BLUE_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2 - Qtd por Conta */}
        <div className="chart-card">
          <h3 className="chart-title">Quantidade de Ativos por Conta</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockBarData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(23, 105, 170, 0.05)' }} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
              />
              <Bar dataKey="qty" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
