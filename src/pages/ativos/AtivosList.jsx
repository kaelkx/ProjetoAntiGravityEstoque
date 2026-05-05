import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PackageSearch, Plus, Eye, Edit2, Trash2, Search, Filter,
  FileText, Clock, Truck, ShieldAlert, X, Download, AlertTriangle, FileSignature,
  Trash, Image as ImageIcon, UploadCloud, CheckCircle, Info, ArrowRightLeft
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import './AtivosList.css';

const INITIAL_MOCK_DATA = [
  {
    id: 1, codigo: 'AT-00123', nome: 'Notebook Dell Inspiron 15', descricao: 'Core i7 16GB RAM 512GB SSD', tipo: 'Notebook',
    categoria: 'Equipamento TI', status: 'Ativo', valorAcquisicao: 4500.00, dataCompra: '2023-05-15',
    colaborador: 'João Silva', setor: 'TI', localizacao: 'Home Office', fornecedorId: 1, fornecedorNome: 'Tech Fix S.A.',
    qtdEnvios: 2, ultimaAtualizacao: '2025-03-12', historicoFornecedores: [], historicoGeral: [], anexos: [],
    termos: [
      { id: 1, colaborador: 'João Silva', dataEntrega: '2023-05-16', dataDevolucao: null, status: 'Ativo', descricao: 'Termo de recebimento de Notebook Dell para trabalho remoto.', arquivo: 'termo_notebook_joao.pdf' }
    ],
    statusDescarte: null,
    dadosDescarte: null
  },
  {
    id: 2, codigo: 'AT-00140', nome: 'Monitor Dell 24"', descricao: 'Monitor Full HD P2419H', tipo: 'Monitor',
    categoria: 'Equipamento TI', status: 'Ativo', valorAcquisicao: 900.00, dataCompra: '2023-06-01',
    colaborador: 'João Silva', setor: 'TI', localizacao: 'Home Office', fornecedorId: null, fornecedorNome: '-',
    qtdEnvios: 0, ultimaAtualizacao: '2023-06-02', historicoFornecedores: [], historicoGeral: [], anexos: [],
    termos: [
      { id: 2, colaborador: 'João Silva', dataEntrega: '2023-06-02', dataDevolucao: null, status: 'Ativo', descricao: 'Termo de recebimento de segundo monitor.', arquivo: 'termo_monitor_joao.pdf' }
    ]
  },
  {
    id: 3, codigo: 'AT-00155', nome: 'Mouse sem fio Logitech', descricao: 'Mouse MX Master 3', tipo: 'Periférico',
    categoria: 'Equipamento TI', status: 'Inativo', valorAcquisicao: 450.00, dataCompra: '2023-01-10',
    colaborador: 'João Silva', setor: 'TI', localizacao: 'Almoxarifado', fornecedorId: null, fornecedorNome: '-',
    qtdEnvios: 0, ultimaAtualizacao: '2024-11-20', historicoFornecedores: [], historicoGeral: [], anexos: [],
    termos: [
      { id: 3, colaborador: 'João Silva', dataEntrega: '2023-05-16', dataDevolucao: '2024-11-20', status: 'Devolvido', descricao: 'Devolução por defeito no scroll.', arquivo: 'termo_mouse_joao.pdf' }
    ],
    statusDescarte: 'Finalizado',
    dadosDescarte: {
      motivo: 'Scroll com defeito permanente',
      tipoDescarte: 'Sucata',
      dataSolicitacao: '2024-11-22',
      dataDescarte: '2024-11-25',
      responsavel: 'Admin TI',
      imagens: [{ id: 1, url: 'https://images.unsplash.com/photo-1527814050087-37938154799f?auto=format&fit=crop&q=80&w=200' }],
      anexos: [{ id: 1, nome: 'laudo_tecnico.pdf' }]
    }
  },
  {
    id: 4, codigo: 'AT-00170', nome: 'Teclado Mecânico Keychron', descricao: 'Keychron K2 Switch Brown', tipo: 'Periférico',
    categoria: 'Equipamento TI', status: 'Inativo', valorAcquisicao: 600.00, dataCompra: '2023-05-10',
    colaborador: 'João Silva', setor: 'TI', localizacao: 'Almoxarifado', fornecedorId: null, fornecedorNome: '-',
    qtdEnvios: 0, ultimaAtualizacao: '2025-01-15', historicoFornecedores: [], historicoGeral: [], anexos: [],
    termos: [
      { id: 4, colaborador: 'João Silva', dataEntrega: '2023-05-16', dataDevolucao: '2025-01-15', status: 'Devolvido', descricao: 'Devolução de teclado para substituição.', arquivo: 'termo_teclado_joao.pdf' }
    ]
  },
  {
    id: 5, codigo: 'AT-00182', nome: 'Headset Plantronics', descricao: 'Headset com cancelamento de ruído', tipo: 'Periférico',
    categoria: 'Equipamento TI', status: 'Ativo', valorAcquisicao: 350.00, dataCompra: '2024-02-10',
    colaborador: 'João Silva', setor: 'TI', localizacao: 'Home Office', fornecedorId: null, fornecedorNome: '-',
    qtdEnvios: 0, ultimaAtualizacao: '2024-02-12', historicoFornecedores: [], historicoGeral: [], anexos: [],
    termos: [
      { id: 5, colaborador: 'João Silva', dataEntrega: '2024-02-12', dataDevolucao: null, status: 'Ativo', descricao: 'Headset para reuniões remotas.', arquivo: 'termo_headset_joao.pdf' }
    ]
  },
  {
    id: 6, codigo: 'AT-00199', nome: 'Cadeira Ergonômica', descricao: 'Cadeira de Escritório Brizza', tipo: 'Mobiliário',
    categoria: 'Móveis', status: 'Ativo', valorAcquisicao: 1200.00, dataCompra: '2023-07-01',
    colaborador: 'João Silva', setor: 'TI', localizacao: 'Home Office', fornecedorId: null, fornecedorNome: '-',
    qtdEnvios: 0, ultimaAtualizacao: '2023-07-05', historicoFornecedores: [], historicoGeral: [], anexos: [],
    termos: [
      { id: 6, colaborador: 'João Silva', dataEntrega: '2023-07-05', dataDevolucao: null, status: 'Ativo', descricao: 'Cadeira ergonômica para auxílio no home office.', arquivo: 'termo_cadeira_joao.pdf' }
    ]
  },
  {
    id: 7, codigo: 'AT-00210', nome: 'MacBook Pro 14"', descricao: 'M2 Pro 16GB RAM 512GB SSD', tipo: 'Notebook',
    categoria: 'Equipamento TI', status: 'Ativo', valorAcquisicao: 15000.00, dataCompra: '2024-01-20',
    colaborador: 'Maria Souza', setor: 'Comercial', localizacao: 'Matriz - SP', fornecedorId: null, fornecedorNome: '-',
    qtdEnvios: 0, ultimaAtualizacao: '2024-01-25', historicoFornecedores: [], historicoGeral: [], anexos: [],
    termos: [
      { id: 7, colaborador: 'Maria Souza', dataEntrega: '2024-01-25', dataDevolucao: null, status: 'Ativo', descricao: 'Termo de recebimento de MacBook Pro.', arquivo: 'termo_macbook_maria.pdf' }
    ]
  }
];

export function AtivosList() {
  const navigate = useNavigate();
  
  // Data State
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('ativosData');
    return savedData ? JSON.parse(savedData) : INITIAL_MOCK_DATA;
  });
  
  // Filter States
  const [filters, setFilters] = useState({
    codigo: '', nome: '', tipo: '', categoria: '', status: '',
    localizacao: '', colaborador: '', fornecedor: '', dataInit: '', dataEnd: ''
  });

  // UI States
  const [viewingAsset, setViewingAsset] = useState(null);
  const [viewingTermo, setViewingTermo] = useState(null);
  const [viewingMovimentacao, setViewingMovimentacao] = useState(null);
  const [descarteTab, setDescarteTab] = useState('geral');
  const [activeTab, setActiveTab] = useState('geral');
  const [feedback, setFeedback] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // Pagination (mocking)
  const [page, setPage] = useState(1);
  const totalPages = 1;

  // Filter Data
  const filteredData = data.filter(item => {
    return (
      (filters.codigo === '' || item.codigo.toLowerCase().includes(filters.codigo.toLowerCase())) &&
      (filters.nome === '' || item.nome.toLowerCase().includes(filters.nome.toLowerCase())) &&
      (filters.tipo === '' || item.tipo === filters.tipo) &&
      (filters.categoria === '' || item.categoria === filters.categoria) &&
      (filters.status === '' || item.status === filters.status) &&
      (filters.localizacao === '' || item.localizacao.toLowerCase().includes(filters.localizacao.toLowerCase())) &&
      (filters.colaborador === '' || item.colaborador.toLowerCase().includes(filters.colaborador.toLowerCase())) &&
      (filters.fornecedor === '' || item.fornecedorNome.toLowerCase().includes(filters.fornecedor.toLowerCase()))
    );
  });

  // Dashboard Stats
  const totalAtivos = data.length;
  const emManutencao = data.filter(i => i.status === 'Em manutenção').length;
  const totalEnvios = data.reduce((acc, curr) => acc + curr.qtdEnvios, 0);

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({ ...prev, [id]: value }));
  };

  const clearFilters = () => {
    setFilters({
      codigo: '', nome: '', tipo: '', categoria: '', status: '',
      localizacao: '', colaborador: '', fornecedor: '', dataInit: '', dataEnd: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este ativo?")) {
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
      localStorage.setItem('ativosData', JSON.stringify(updatedData));
      
      setFeedback({ type: 'success', msg: 'Ativo excluído com sucesso!' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Ativo': return 'status-ativo';
      case 'Estoque': return 'status-ativo';
      case 'Em manutenção': return 'status-manutencao';
      case 'Problema': return 'status-problema';
      case 'Inativo': 
      case 'Baixado': 
      case 'Descartado': return 'status-inativo';
      default: return '';
    }
  };

  const getDescarteStatusClass = (status) => {
    if (status === 'Pendente') return 'status-manutencao';
    if (status === 'Aprovado') return 'status-ativo';
    if (status === 'Finalizado') return 'status-inativo';
    return '';
  };

  const openMovimentacaoModal = (item) => {
    setViewingMovimentacao({
      ...item,
      tipoMovimentacao: 'Transferência',
      novoColaborador: '',
      dataMovimentacao: new Date().toISOString().split('T')[0],
      responsavelMovimentacao: '',
      statusDescarte: item.statusDescarte || 'Pendente',
      dadosDescarte: item.dadosDescarte || {
        motivo: '', tipoDescarte: 'Reciclagem', dataSolicitacao: new Date().toISOString().split('T')[0],
        dataDescarte: '', responsavel: '', imagens: [], anexos: []
      }
    });
    setDescarteTab('geral');
  };

  const handleMovimentacaoInputChange = (e) => {
    const { id, value } = e.target;
    if (['tipoMovimentacao', 'novoColaborador', 'dataMovimentacao', 'responsavelMovimentacao', 'statusDescarte'].includes(id)) {
      setViewingMovimentacao(prev => ({ ...prev, [id]: value }));
    } else {
      setViewingMovimentacao(prev => ({
        ...prev,
        dadosDescarte: { ...prev.dadosDescarte, [id]: value }
      }));
    }
  };

  const handleSaveMovimentacao = () => {
    const isDescarte = viewingMovimentacao.tipoMovimentacao === 'Descarte';
    
    if (isDescarte && !viewingMovimentacao.dadosDescarte.motivo) {
      alert("Informe o motivo do descarte.");
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    let updatedItem = { ...viewingMovimentacao };

    if (isDescarte) {
      updatedItem.colaborador = '-';
      updatedItem.status = 'Descartado';
      updatedItem.termos = updatedItem.termos?.map(t => t.status === 'Ativo' ? { ...t, status: 'Devolvido', dataDevolucao: currentDate } : t) || [];
      updatedItem.historicoGeral = [...(updatedItem.historicoGeral || []), { id: Date.now(), data: currentDate, descricao: 'Ativo enviado para descarte.', autor: updatedItem.dadosDescarte.responsavel || 'Sistema' }];
    } else {
      const novoColab = updatedItem.novoColaborador.trim() || '-';
      updatedItem.colaborador = novoColab;
      updatedItem.status = novoColab === '-' ? 'Estoque' : 'Ativo';
      updatedItem.termos = updatedItem.termos?.map(t => t.status === 'Ativo' ? { ...t, status: 'Devolvido', dataDevolucao: currentDate } : t) || [];
      updatedItem.historicoGeral = [...(updatedItem.historicoGeral || []), { id: Date.now(), data: currentDate, descricao: `Ativo transferido para ${novoColab}.`, autor: updatedItem.responsavelMovimentacao || 'Sistema' }];
    }

    const updatedData = data.map(i => i.id === updatedItem.id ? updatedItem : i);
    setData(updatedData);
    localStorage.setItem('ativosData', JSON.stringify(updatedData));
    setFeedback({ type: 'success', msg: 'Movimentação realizada com sucesso!' });
    setTimeout(() => setFeedback(null), 3000);
    setViewingMovimentacao(null);
  };

  const simulateImageUpload = () => {
    const newImage = { id: Date.now(), url: 'https://images.unsplash.com/photo-1588508065123-287b28e0131b?auto=format&fit=crop&q=80&w=200' };
    setViewingMovimentacao(prev => ({
      ...prev,
      dadosDescarte: { ...prev.dadosDescarte, imagens: [...prev.dadosDescarte.imagens, newImage] }
    }));
  };

  const simulateAttachmentUpload = () => {
    const newAttachment = { id: Date.now(), nome: `documento_${Date.now()}.pdf` };
    setViewingMovimentacao(prev => ({
      ...prev,
      dadosDescarte: { ...prev.dadosDescarte, anexos: [...prev.dadosDescarte.anexos, newAttachment] }
    }));
  };

  return (
    <div className="ativos-container animate-fade-in">
      
      {/* Header */}
      <div className="ativos-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <PackageSearch size={28} className="text-primary" />
          <h1 className="ativos-title">Consulta de Ativos</h1>
        </div>
        <Button onClick={() => alert("Navegação para Cadastrar Ativo em breve")}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} />
          Novo Ativo
        </Button>
      </div>

      {feedback && (
        <div className={`feedback-msg ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.msg}
        </div>
      )}

      {/* Dashboard Cads */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-icon-wrapper">
            <PackageSearch size={24} />
          </div>
          <div className="dashboard-info">
            <h3>Total de Ativos</h3>
            <p>{totalAtivos}</p>
          </div>
        </div>
        <div className="dashboard-card warning">
          <div className="dashboard-icon-wrapper">
            <AlertTriangle size={24} />
          </div>
          <div className="dashboard-info">
            <h3>Em Manutenção</h3>
            <p>{emManutencao}</p>
          </div>
        </div>
        <div className="dashboard-card danger">
          <div className="dashboard-icon-wrapper">
            <Truck size={24} />
          </div>
          <div className="dashboard-info">
            <h3>Total de Envios</h3>
            <p>{totalEnvios}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <div className="filter-group">
          <label>Código</label>
          <input type="text" id="codigo" className="input-field" value={filters.codigo} onChange={handleFilterChange} placeholder="Ex: AT-001" />
        </div>
        <div className="filter-group">
          <label>Nome / Descrição</label>
          <input type="text" id="nome" className="input-field" value={filters.nome} onChange={handleFilterChange} placeholder="Buscar..." />
        </div>
        <div className="filter-group">
          <label>Tipo</label>
          <select id="tipo" className="input-field" value={filters.tipo} onChange={handleFilterChange}>
            <option value="">Todos</option>
            <option value="Notebook">Notebook</option>
            <option value="Desktop">Desktop</option>
            <option value="Monitor">Monitor</option>
            <option value="Mobiliário">Mobiliário</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select id="status" className="input-field" value={filters.status} onChange={handleFilterChange}>
            <option value="">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Em manutenção">Em manutenção</option>
            <option value="Problema">Problema</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Localização</label>
          <input type="text" id="localizacao" className="input-field" value={filters.localizacao} onChange={handleFilterChange} placeholder="Filial, Setor..." />
        </div>
        <div className="filter-group">
          <label>Colaborador</label>
          <input type="text" id="colaborador" className="input-field" value={filters.colaborador} onChange={handleFilterChange} placeholder="Nome do colaborador" />
        </div>
        
        <div className="filters-actions">
          <Button variant="secondary" onClick={clearFilters}>Limpar Filtros</Button>
          <Button>
            <Filter size={18} style={{ marginRight: '0.5rem' }} />
            Buscar
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Código</th>
                <th>Nome do Ativo</th>
                <th>Status</th>
                <th>Status Descarte</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Nenhum ativo encontrado.</td></tr>
              ) : (
                filteredData.map((item) => {
                  const termoAtivo = item.termos?.find(t => t.status === 'Ativo');
                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{item.colaborador}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.setor}</div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{item.codigo}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{item.nome}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.tipo}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(item.status)}`}>{item.status}</span>
                      </td>
                      <td>
                        {item.statusDescarte ? (
                          <span className={`status-badge ${getDescarteStatusClass(item.statusDescarte)}`}>{item.statusDescarte}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>-</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn" title="Movimentar Ativo" onClick={() => openMovimentacaoModal(item)}>
                            <ArrowRightLeft size={18} />
                          </button>
                          {termoAtivo && (
                            <button className="action-btn" title="Ver Termo" onClick={() => setViewingTermo({ ativo: item, termo: termoAtivo })}>
                              <FileSignature size={18} />
                            </button>
                          )}
                          <button className="action-btn" title="Visualizar Detalhes" onClick={() => { setViewingAsset(item); setActiveTab('geral'); }}><Eye size={18} /></button>
                          <button className="action-btn" title="Editar" onClick={() => alert("Editar em breve")}><Edit2 size={18} /></button>
                          <button className="action-btn" title="Excluir" onClick={() => handleDelete(item.id)}><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Mostrando {filteredData.length} registros
          </span>
          <div className="pagination-controls">
            <button className="pagination-button" disabled>Anterior</button>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{page} de {totalPages}</span>
            <button className="pagination-button" disabled>Próxima</button>
          </div>
        </div>
      </div>

      {/* Visualizar Modal */}
      {viewingAsset && (
        <div className="modal-overlay" onClick={() => setViewingAsset(null)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <PackageSearch size={24} />
                Detalhes do Ativo: {viewingAsset.codigo}
              </h2>
              <button className="close-btn" onClick={() => setViewingAsset(null)}><X size={24} /></button>
            </div>
            
            <div className="tabs-header">
              <button className={`tab-btn ${activeTab === 'geral' ? 'active' : ''}`} onClick={() => setActiveTab('geral')}>
                Informações Gerais
              </button>
              <button className={`tab-btn ${activeTab === 'fornecedores' ? 'active' : ''}`} onClick={() => setActiveTab('fornecedores')}>
                <Truck size={16} /> Histórico c/ Fornecedores
              </button>
              <button className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`} onClick={() => setActiveTab('historico')}>
                <Clock size={16} /> Histórico Geral
              </button>
              <button className={`tab-btn ${activeTab === 'anexos' ? 'active' : ''}`} onClick={() => setActiveTab('anexos')}>
                <FileText size={16} /> Anexos
              </button>
            </div>

            <div className="modal-body">
              {/* ABA GERAL */}
              {activeTab === 'geral' && (
                <div className="tab-content">
                  
                  {viewingAsset.qtdEnvios > 0 && (
                    <div className="alert-banner">
                      <AlertTriangle size={20} />
                      Este ativo já foi enviado {viewingAsset.qtdEnvios} {viewingAsset.qtdEnvios === 1 ? 'vez' : 'vezes'} para fornecedores externos para manutenção/troca.
                    </div>
                  )}

                  <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Informações Principais</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Nome</span>
                      <span className="detail-value">{viewingAsset.nome}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Descrição</span>
                      <span className="detail-value">{viewingAsset.descricao}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tipo / Categoria</span>
                      <span className="detail-value">{viewingAsset.tipo} - {viewingAsset.categoria}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span className="detail-value">
                        <span className={`status-badge ${getStatusClass(viewingAsset.status)}`}>{viewingAsset.status}</span>
                      </span>
                    </div>
                  </div>

                  <h3 style={{ marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--text-dark)' }}>Responsabilidade e Local</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Colaborador Vinculado</span>
                      <span className="detail-value">{viewingAsset.colaborador}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Setor</span>
                      <span className="detail-value">{viewingAsset.setor}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Localização</span>
                      <span className="detail-value">{viewingAsset.localizacao}</span>
                    </div>
                  </div>

                  <h3 style={{ marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--text-dark)' }}>Financeiro e Fornecedor</h3>
                  <div className="detail-grid" style={{ marginBottom: 0 }}>
                    <div className="detail-item">
                      <span className="detail-label">Valor de Aquisição</span>
                      <span className="detail-value">R$ {viewingAsset.valorAcquisicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Data da Compra</span>
                      <span className="detail-value">{new Date(viewingAsset.dataCompra).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Fornecedor Atual</span>
                      <span className="detail-value" style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>
                        {viewingAsset.fornecedorNome}
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* ABA FORNECEDORES */}
              {activeTab === 'fornecedores' && (
                <div className="tab-content">
                  <div className="alert-banner">
                    👉 Este ativo já foi enviado {viewingAsset.qtdEnvios} vezes para fornecedores.
                  </div>
                  
                  {viewingAsset.historicoFornecedores.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>Nenhum histórico de envio para fornecedores.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Fornecedor</th>
                            <th>Motivo</th>
                            <th>Data Envio</th>
                            <th>Data Retorno</th>
                            <th>Status</th>
                            <th>Custo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingAsset.historicoFornecedores.map((hist) => (
                            <tr key={hist.id}>
                              <td style={{ fontWeight: 600 }}>{hist.fornecedor}</td>
                              <td>{hist.motivo}</td>
                              <td>{new Date(hist.dataEnvio).toLocaleDateString('pt-BR')}</td>
                              <td>{hist.dataRetorno ? new Date(hist.dataRetorno).toLocaleDateString('pt-BR') : '-'}</td>
                              <td>
                                <span className={`status-badge ${hist.status === 'Finalizado' ? 'status-ativo' : 'status-manutencao'}`}>
                                  {hist.status}
                                </span>
                              </td>
                              <td>{hist.custo ? `R$ ${hist.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ABA HISTORICO GERAL */}
              {activeTab === 'historico' && (
                <div className="tab-content">
                  <div className="timeline">
                    {viewingAsset.historicoGeral.map((hist) => (
                      <div className="timeline-item" key={hist.id}>
                        <div className="timeline-date">{new Date(hist.data).toLocaleDateString('pt-BR')} - {hist.autor}</div>
                        <div className="timeline-desc">{hist.descricao}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA ANEXOS */}
              {activeTab === 'anexos' && (
                <div className="tab-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: 'var(--text-dark)' }}>Arquivos do Ativo</h3>
                    <Button variant="secondary" size="sm">
                      <Plus size={16} style={{ marginRight: '0.5rem' }} /> Novo Anexo
                    </Button>
                  </div>

                  {viewingAsset.anexos.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Nenhum anexo disponível.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {viewingAsset.anexos.map((anexo, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
                            <FileText size={20} style={{ color: 'var(--primary)' }} />
                            {anexo.nome}
                          </div>
                          <button style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                            <Download size={16} /> Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Modal de Termo */}
      {viewingTermo && (
        <div className="modal-overlay" onClick={() => setViewingTermo(null)}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: '500px', height: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <FileSignature size={24} />
                Termo de Responsabilidade
              </h2>
              <button className="close-btn" onClick={() => setViewingTermo(null)}><X size={24} /></button>
            </div>
            
            <div className="modal-body" style={{ padding: '2rem' }}>
              <div className="detail-item" style={{ marginBottom: '1rem' }}>
                <span className="detail-label">Colaborador</span>
                <span className="detail-value" style={{ fontWeight: 700 }}>{viewingTermo.termo.colaborador}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: '1rem' }}>
                <span className="detail-label">Ativo</span>
                <span className="detail-value">{viewingTermo.ativo.codigo} - {viewingTermo.ativo.nome}</span>
              </div>
              <div className="detail-item" style={{ marginBottom: '1rem' }}>
                <span className="detail-label">Status</span>
                <span className="detail-value">
                  <span className={`status-badge ${viewingTermo.termo.status === 'Ativo' ? 'status-ativo' : 'status-inativo'}`}>
                    {viewingTermo.termo.status}
                  </span>
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="detail-item">
                  <span className="detail-label">Data de Entrega</span>
                  <span className="detail-value">{new Date(viewingTermo.termo.dataEntrega).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Data de Devolução</span>
                  <span className="detail-value">{viewingTermo.termo.dataDevolucao ? new Date(viewingTermo.termo.dataDevolucao).toLocaleDateString('pt-BR') : '-'}</span>
                </div>
              </div>
              <div className="detail-item" style={{ marginBottom: '2rem' }}>
                <span className="detail-label">Descrição do Termo</span>
                <span className="detail-value" style={{ fontStyle: 'italic' }}>{viewingTermo.termo.descricao}</span>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button variant="secondary" style={{ flex: 1 }} onClick={() => alert("Visualização em breve")}>
                  <Eye size={18} style={{ marginRight: '0.5rem' }} /> Visualizar
                </Button>
                <Button style={{ flex: 1 }} onClick={() => alert("Download iniciado")}>
                  <Download size={18} style={{ marginRight: '0.5rem' }} /> Baixar Documento
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Movimentacao */}
      {viewingMovimentacao && (
        <div className="modal-overlay" onClick={() => setViewingMovimentacao(null)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <ArrowRightLeft size={24} />
                Movimentação de Ativo: {viewingMovimentacao.codigo}
              </h2>
              <button className="close-btn" onClick={() => setViewingMovimentacao(null)}><X size={24} /></button>
            </div>

            <div className="tabs-header">
              <button className={`tab-btn ${descarteTab === 'geral' ? 'active' : ''}`} onClick={() => setDescarteTab('geral')}>
                <Info size={16} /> Dados da Movimentação
              </button>
              {viewingMovimentacao.tipoMovimentacao === 'Descarte' && (
                <>
                  <button className={`tab-btn ${descarteTab === 'imagens' ? 'active' : ''}`} onClick={() => setDescarteTab('imagens')}>
                    <ImageIcon size={16} /> Imagens ({viewingMovimentacao.dadosDescarte?.imagens?.length || 0})
                  </button>
                  <button className={`tab-btn ${descarteTab === 'anexos' ? 'active' : ''}`} onClick={() => setDescarteTab('anexos')}>
                    <FileText size={16} /> Anexos ({viewingMovimentacao.dadosDescarte?.anexos?.length || 0})
                  </button>
                </>
              )}
            </div>

            <div className="modal-body">
              {descarteTab === 'geral' && (
                <div className="tab-content">
                  <div className="form-grid">
                    <div className="form-group full-width" style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '2rem' }}>
                      <div><span className="detail-label">Nome</span><div className="detail-value">{viewingMovimentacao.nome}</div></div>
                      <div><span className="detail-label">Colaborador Atual</span><div className="detail-value">{viewingMovimentacao.colaborador}</div></div>
                    </div>

                    <div className="form-group full-width">
                      <span className="form-label">Tipo de Movimentação</span>
                      <select id="tipoMovimentacao" className="input-field" value={viewingMovimentacao.tipoMovimentacao} onChange={handleMovimentacaoInputChange}>
                        <option value="Transferência">Transferência / Devolução</option>
                        <option value="Descarte">Enviar para Descarte</option>
                      </select>
                    </div>

                    {viewingMovimentacao.tipoMovimentacao === 'Transferência' ? (
                      <>
                        <div className="form-group"><span className="form-label">Novo Colaborador (Deixe vazio p/ Estoque)</span><Input id="novoColaborador" value={viewingMovimentacao.novoColaborador} onChange={handleMovimentacaoInputChange} placeholder="Ex: Maria Silva" /></div>
                        <div className="form-group"><span className="form-label">Data</span><Input id="dataMovimentacao" type="date" value={viewingMovimentacao.dataMovimentacao} onChange={handleMovimentacaoInputChange} /></div>
                        <div className="form-group"><span className="form-label">Responsável pela Ação</span><Input id="responsavelMovimentacao" value={viewingMovimentacao.responsavelMovimentacao} onChange={handleMovimentacaoInputChange} placeholder="Nome do responsável" /></div>
                      </>
                    ) : (
                      <>
                        <div className="form-group">
                          <span className="form-label">Status do Descarte</span>
                          <select id="statusDescarte" className="input-field" value={viewingMovimentacao.statusDescarte} onChange={handleMovimentacaoInputChange}>
                            <option value="Pendente">Pendente</option>
                            <option value="Aprovado">Aprovado</option>
                            <option value="Finalizado">Finalizado</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <span className="form-label">Tipo de Descarte</span>
                          <select id="tipoDescarte" className="input-field" value={viewingMovimentacao.dadosDescarte.tipoDescarte} onChange={handleMovimentacaoInputChange}>
                            <option value="Reciclagem">Reciclagem</option>
                            <option value="Doação">Doação</option>
                            <option value="Venda">Venda</option>
                            <option value="Sucata">Sucata</option>
                          </select>
                        </div>

                        <div className="form-group full-width"><span className="form-label">Motivo do Descarte *</span><Input id="motivo" value={viewingMovimentacao.dadosDescarte.motivo} onChange={handleMovimentacaoInputChange} placeholder="Ex: Equipamento irreparável" /></div>
                        
                        <div className="form-group"><span className="form-label">Data Solicitação</span><Input id="dataSolicitacao" type="date" value={viewingMovimentacao.dadosDescarte.dataSolicitacao} onChange={handleMovimentacaoInputChange} /></div>
                        <div className="form-group"><span className="form-label">Data do Descarte</span><Input id="dataDescarte" type="date" value={viewingMovimentacao.dadosDescarte.dataDescarte || ''} onChange={handleMovimentacaoInputChange} /></div>
                        
                        <div className="form-group full-width"><span className="form-label">Responsável</span><Input id="responsavel" value={viewingMovimentacao.dadosDescarte.responsavel} onChange={handleMovimentacaoInputChange} placeholder="Nome do responsável" /></div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {descarteTab === 'imagens' && viewingMovimentacao.tipoMovimentacao === 'Descarte' && (
                <div className="tab-content">
                  <div className="image-upload-box" onClick={simulateImageUpload}>
                    <UploadCloud size={32} style={{ marginBottom: '0.5rem' }} />
                    <span style={{ fontWeight: 600 }}>Clique para adicionar imagem</span>
                    <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Suporta JPG, PNG. (Simulação)</span>
                  </div>

                  {viewingMovimentacao.dadosDescarte.imagens.length > 0 && (
                    <div className="images-grid">
                      {viewingMovimentacao.dadosDescarte.imagens.map((img) => (
                        <div key={img.id} className="image-preview-card" onClick={() => setEnlargedImage(img.url)}>
                          <img src={img.url} alt="Evidência" />
                          <div className="image-preview-overlay"><Eye size={24} /></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {descarteTab === 'anexos' && viewingMovimentacao.tipoMovimentacao === 'Descarte' && (
                <div className="tab-content">
                  <Button variant="secondary" onClick={simulateAttachmentUpload} style={{ marginBottom: '1.5rem' }}>
                    <Plus size={16} style={{ marginRight: '0.5rem' }} /> Adicionar Documento
                  </Button>

                  {viewingMovimentacao.dadosDescarte.anexos.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {viewingMovimentacao.dadosDescarte.anexos.map((anexo) => (
                        <div key={anexo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}><FileText size={20} style={{ color: 'var(--primary)' }} />{anexo.nome}</div>
                          <button style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}><Download size={16} /> Download</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: 'var(--bg-card)' }}>
              <Button variant="secondary" onClick={() => setViewingMovimentacao(null)}>Cancelar</Button>
              <Button onClick={handleSaveMovimentacao}><CheckCircle size={18} style={{ marginRight: '0.5rem' }} />Confirmar Movimentação</Button>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div className="enlarged-image-modal" onClick={() => setEnlargedImage(null)}>
          <button className="enlarged-image-close" onClick={() => setEnlargedImage(null)}><X size={32} /></button>
          <img src={enlargedImage} alt="Ampliada" onClick={e => e.stopPropagation()} />
        </div>
      )}

    </div>
  );
}
