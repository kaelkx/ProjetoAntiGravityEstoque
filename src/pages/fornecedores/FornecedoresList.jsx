import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2, UploadCloud, Search, Trash2, X, Download, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { fornecedorService } from '../../services/api';
import './FornecedoresList.css';

// Mock data initially for visual consistency until API answers
const MOCK_DATA = [
  { id: 1, ticket: 'CHM-1025', colaborador: 'João Silva', ativo: 'NTB-4059', termo: 'termo_aceite.pdf', laudo: null, status: 'Concluído', data: '2023-10-01', fornecedor: 'Tech Fix S.A.', cnpj: '12.345.678/0001-90', email: 'contato@techfix.com', telefone: '(11) 98765-4321', custoCentro: 'TI', custo: 350.00, os: 'OS-982' },
  { id: 2, ticket: 'CHM-1026', colaborador: 'Maria Souza', ativo: 'CEL-1234', termo: null, laudo: null, status: 'Pendente de envio', data: '2023-10-05', fornecedor: 'Reparos Express', cnpj: '98.765.432/0001-10', email: 'suporte@reparos.com', telefone: '(11) 91234-5678', custoCentro: 'Comercial', custo: 120.00, os: 'OS-985' },
  { id: 3, ticket: 'CHM-1027', colaborador: 'Carlos Dias', ativo: 'TAB-5541', termo: 'termo.pdf', laudo: 'laudo.pdf', status: 'Enviado ao fornecedor', data: '2023-10-08', fornecedor: 'Global Assist', cnpj: '11.222.333/0001-44', email: 'atendimento@global.com', telefone: '(21) 99999-8888', custoCentro: 'TI', custo: 0.00, os: 'OS-990' },
  { id: 4, ticket: 'CHM-1028', colaborador: 'Ana Marques', ativo: 'NTB-9988', termo: 'termo_assinado.pdf', laudo: null, status: 'Pendente de devolução', data: '2023-10-10', fornecedor: 'Tech Fix S.A.', cnpj: '12.345.678/0001-90', email: 'contato@techfix.com', telefone: '(11) 98765-4321', custoCentro: 'Operações', custo: 450.00, os: 'OS-995' },
];

export function FornecedoresList() {
  const navigate = useNavigate();
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('fornecedoresData');
    return savedData ? JSON.parse(savedData) : MOCK_DATA;
  });
  const [loading, setLoading] = useState(false);
  const [viewingSupplier, setViewingSupplier] = useState(null);
  const [feedback, setFeedback] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(() => {
    const savedData = localStorage.getItem('fornecedoresData');
    return savedData ? JSON.parse(savedData).length : MOCK_DATA.length;
  });
  const limit = 10;

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateInit, setDateInit] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [ccFilter, setCcFilter] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      // Aqui integrará com:
      // const res = await fornecedorService.getFornecedores({ page, limit, search: searchTerm, status: statusFilter, cc: ccFilter, dateInit, dateEnd });
      // setData(res.data);
      // setTotalPages(res.totalPages);
      // setTotalRecords(res.total);
      
      // Simulating API call for demonstration:
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, searchTerm, statusFilter, dateInit, dateEnd, ccFilter]);

  const getStatusClass = (status) => {
    if (status === 'Concluído') return 'status-concluido';
    if (status.includes('Pendente')) return 'status-pendente';
    if (status === 'Enviado ao fornecedor') return 'status-enviado';
    return '';
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este fornecedor?")) {
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
      setTotalRecords(updatedData.length);
      localStorage.setItem('fornecedoresData', JSON.stringify(updatedData));
      
      setFeedback({ type: 'success', msg: 'Fornecedor excluído com sucesso!' });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleDownloadAttachment = (filename) => {
    // Simular o download
    alert(`Iniciando download de: ${filename}`);
  };

  return (
    <div className="fornecedores-container animate-fade-in">
      
      <div className="fornecedores-header">
        <h1 className="fornecedores-title">Gestão de Fornecedores</h1>
        <Button onClick={() => navigate('/fornecedores/novo')}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} />
          Novo Chamado
        </Button>
      </div>

      {feedback && (
        <div className={`feedback-msg ${feedback.type === 'success' ? 'feedback-success' : 'feedback-error'}`}>
          {feedback.msg}
        </div>
      )}

      {/* Filters */}
      <div className="filters-card">
        <div className="filter-group">
          <label>Busca</label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              style={{ width: '100%', paddingLeft: '2rem' }} 
              placeholder="Ticket, Colaborador, Fornecedor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select className="input-field" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos</option>
            <option value="Enviado ao fornecedor">Enviado ao fornecedor</option>
            <option value="Pendente de envio">Pendente de envio</option>
            <option value="Pendente de devolução">Pendente de devolução</option>
            <option value="Concluído">Concluído</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Período</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="date" className="input-field" value={dateInit} onChange={(e) => setDateInit(e.target.value)} />
            <span>até</span>
            <input type="date" className="input-field" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
          </div>
        </div>

        <div className="filter-group">
          <label>Centro de Custo</label>
          <select className="input-field" value={ccFilter} onChange={(e) => setCcFilter(e.target.value)}>
            <option value="">Todos</option>
            <option value="TI">TI</option>
            <option value="Operações">Operações</option>
            <option value="Comercial">Comercial</option>
            <option value="RH">RH</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket / OS</th>
                <th>Solicitante / Ativo</th>
                <th>Fornecedor</th>
                <th>Centro de Custo</th>
                <th>Custo (R$)</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Carregando dados server-side...</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.ticket}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.os}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.colaborador}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.ativo}</div>
                    </td>
                    <td>{item.fornecedor}</td>
                    <td>{item.custoCentro}</td>
                    <td>{item.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn" title="Visualizar Detalhes" onClick={() => setViewingSupplier(item)}><Eye size={18} /></button>
                        <button className="action-btn" title="Editar" onClick={() => navigate(`/fornecedores/editar/${item.id}`)}><Edit2 size={18} /></button>
                        <button className="action-btn" title="Excluir" onClick={() => handleDelete(item.id)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Paginação */}
        <div className="pagination-container">
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Mostrando {data.length} de {totalRecords} registros
          </span>
          <div className="pagination-controls">
            <button 
              className="pagination-button" 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Anterior
            </button>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{page} de {totalPages}</span>
            <button 
              className="pagination-button" 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Próxima
            </button>
          </div>
        </div>

      </div>

      {/* Modal de Visualização */}
      {viewingSupplier && (
        <div className="modal-overlay" onClick={() => setViewingSupplier(null)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Detalhes do Fornecedor</h2>
              <button className="close-btn" onClick={() => setViewingSupplier(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Nome do Fornecedor</span>
                <span className="detail-value">{viewingSupplier.fornecedor || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">CNPJ</span>
                <span className="detail-value">{viewingSupplier.cnpj || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">E-mail</span>
                <span className="detail-value">{viewingSupplier.email || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Telefone</span>
                <span className="detail-value">{viewingSupplier.telefone || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Centro de Custo</span>
                <span className="detail-value">{viewingSupplier.custoCentro || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className="detail-value">
                  <span className={`status-badge ${getStatusClass(viewingSupplier.status)}`}>
                    {viewingSupplier.status}
                  </span>
                </span>
              </div>
            </div>

            <div className="attachments-section">
              <h3 className="attachments-title">Anexos</h3>
              
              {(!viewingSupplier.termo && !viewingSupplier.laudo) ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>Nenhum anexo disponível</div>
              ) : (
                <>
                  {viewingSupplier.termo && (
                    <div className="attachment-item">
                      <div className="attachment-name">
                        <FileText size={18} style={{ color: 'var(--primary)' }} />
                        {viewingSupplier.termo}
                      </div>
                      <div className="attachment-actions">
                        <button className="attachment-action-btn" onClick={() => handleDownloadAttachment(viewingSupplier.termo)}>
                          <Download size={16} style={{ marginRight: '4px' }} />
                          Download
                        </button>
                      </div>
                    </div>
                  )}
                  {viewingSupplier.laudo && (
                    <div className="attachment-item">
                      <div className="attachment-name">
                        <FileText size={18} style={{ color: 'var(--primary)' }} />
                        {viewingSupplier.laudo}
                      </div>
                      <div className="attachment-actions">
                        <button className="attachment-action-btn" onClick={() => handleDownloadAttachment(viewingSupplier.laudo)}>
                          <Download size={16} style={{ marginRight: '4px' }} />
                          Download
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
