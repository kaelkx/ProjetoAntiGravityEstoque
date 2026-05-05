import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { MainLayout } from './components/layout/MainLayout';
import { FornecedoresList } from './pages/fornecedores/FornecedoresList';
import { FornecedorForm } from './pages/fornecedores/FornecedorForm';
import { AtivosList } from './pages/ativos/AtivosList';
import { DescarteDashboard } from './pages/descartes/DescarteDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="fornecedores" element={<FornecedoresList />} />
          <Route path="fornecedores/novo" element={<FornecedorForm />} />
          <Route path="fornecedores/editar/:id" element={<FornecedorForm />} />
          <Route path="ativos/consultar" element={<AtivosList />} />
          <Route path="ativos/painel-descarte" element={<DescarteDashboard />} />
          <Route path="*" element={<div style={{padding: '2rem'}}>Página em construção</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
